package repository

import (
	"backend/internal/models"
	"context"
	"database/sql"
)

type DashboardRepository struct {
	db *sql.DB
}

func NewDashboardRepository(db *sql.DB) *DashboardRepository {
	return &DashboardRepository{db: db}
}

func (r *DashboardRepository) GetSummary(ctx context.Context) (float64, float64, error) {
	query := `
		SELECT 
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
		FROM transactions 
	`
	var income, expenses float64
	err := r.db.QueryRowContext(ctx, query).Scan(&income, &expenses)
	if err != nil {
		return 0, 0, err
	}
	return income, expenses, nil
}

func (r *DashboardRepository) GetCategoryTotal(ctx context.Context) ([]*models.CategoryTotal, error) {
	query := `
		SELECT category, type, COALESCE(SUM(amount), 0) AS total 
		FROM transactions
		GROUP BY category, type
		ORDER BY total DESC 
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var totals []*models.CategoryTotal
	for rows.Next() {
		total := &models.CategoryTotal{}
		if err := rows.Scan(&total.Category, &total.Type, &total.Total); err != nil {
			return nil, err
		}
		totals = append(totals, total)
	}
	return totals, nil
}

func (r *DashboardRepository) GetRecentActivity(ctx context.Context, limit int) ([]*models.Transaction, error) {
	query := `
		SELECT id, user_id, amount, type, category, date, notes, created_at, updated_at
		FROM transactions 
		ORDER BY created_at DESC 
		LIMIT $1
	`

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []*models.Transaction
	for rows.Next() {
		transac := &models.Transaction{}
		if err := rows.Scan(&transac.ID, &transac.UserID, &transac.Amount, &transac.Type, &transac.Category, transac.Date, transac.Notes, transac.CreatedAt, transac.UpdatedAt); err != nil {
			return nil, err
		}
		transactions = append(transactions, transac)
	}
	return transactions, nil
}

func (r *DashboardRepository) GetMonthlyTrends(ctx context.Context) ([]*models.MonthlyTrend, error) {
	query := `
		SELECT 
			TO_CHAR(date, 'YYYY-MM') AS month,
			COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
			COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
		FROM transactions
		GROUP BY TO_CHAR(date, 'YYYY-MM') 
		ORDER By month DESC		
		LIMIT 12
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trends []*models.MonthlyTrend
	for rows.Next() {
		trend := &models.MonthlyTrend{}
		if err := rows.Scan(&trend.Month, &trend.Income, &trend.Expense); err != nil {
			return nil, err
		}
		trends = append(trends, trend)
	}
	return trends, nil
}
