package repository

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"fmt"
	"strings"
)

type TransactionRepository struct {
	db *sql.DB
}

func NewTransactionRepository(db *sql.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

func (r *TransactionRepository) Create(ctx context.Context, transac *models.Transaction) (*models.Transaction, error) {
	query := `
		INSERT INTO transactions (id, user_id, amount, type, category, date, notes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
		RETURNING id, user_id, amount, type, category, date, notes, created_at, updated_at 
	`
	created := &models.Transaction{}
	err := r.db.QueryRowContext(ctx, query,
		transac.ID, transac.UserID, transac.Amount, transac.Type, transac.Category, transac.Date, transac.Notes, transac.CreatedAt, transac.UpdatedAt,
	).Scan(
		&created.ID, &created.UserID, &created.Amount, &created.Type, &created.Category, &created.Date, &created.Notes, &created.CreatedAt, &created.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return created, nil
}

func (r *TransactionRepository) FindAll(ctx context.Context, filter *models.FilterParams) ([]*models.Transaction, int, error) {
	// dynamic filtering
	where := []string{"1=1"}
	args := []interface{}{}
	index := 1

	if filter.Type != "" {
		where = append(where, fmt.Sprintf("type = $%d", index))
		args = append(args, filter.Type)
		index++
	}
	if filter.Category != "" {
		where = append(where, fmt.Sprintf("category = $%d", index))
		args = append(args, filter.Category)
		index++
	}
	if filter.StartDate != "" {
		where = append(where, fmt.Sprintf("date >= $%d", index))
		args = append(args, filter.StartDate)
		index++
	}
	if filter.EndDate != "" {
		where = append(where, fmt.Sprintf("date <= $%d", index))
		args = append(args, filter.EndDate)
		index++
	}

	whereClause := strings.Join(where, " AND ")

	// totalcount
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM transactions WHERE %s", whereClause)
	var total int
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	//pagination
	offset := (filter.Page - 1) * filter.Limit
	args = append(args, filter.Limit, offset)

	dataQuery := fmt.Sprintf(`
		SELECT id, user_id, amount, type, category, date, notes, created_at, upated_at
		FROM transactions
		WHERE %s 
		ORDER BY date DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, index, index+1)

	rows, err := r.db.QueryContext(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var transactions []*models.Transaction
	for rows.Next() {
		transac := &models.Transaction{}
		if err := rows.Scan(
			&transac.ID, &transac.UserID, &transac.Amount,
			&transac.Type, &transac.Category, &transac.Date,
			&transac.Notes, &transac.CreatedAt, &transac.UpdatedAt,
		); err != nil {
			return nil, 0, err
		}
		transactions = append(transactions, transac)
	}
	return transactions, total, nil
}

func (r *TransactionRepository) FindByID(ctx context.Context, id string) (*models.Transaction, error) {
	query := `

	`
}
