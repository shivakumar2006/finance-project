package services

import (
	"backend/internal/models"
	"backend/internal/repository"
	"context"
)

type DashboardService struct {
	repo *repository.DashboardRepository
}

func NewDashboardService(repo *repository.DashboardRepository) *DashboardService {
	return &DashboardService{repo: repo}
}

func (s *DashboardService) GetSummary(ctx context.Context, userID string) (*models.DashboardSummary, error) {

	income, expenses, err := s.repo.GetSummary(ctx, userID)
	if err != nil {
		return nil, err
	}

	categories, err := s.repo.GetCategoryTotals(ctx, userID)
	if err != nil {
		return nil, err
	}

	recent, err := s.repo.GetRecentActivity(ctx, userID, 5)
	if err != nil {
		return nil, err
	}

	trends, err := s.repo.GetMonthlyTrends(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &models.DashboardSummary{
		TotalIncome:    income,
		TotalExpenses:  expenses,
		NetBalance:     income - expenses,
		CategoryTotals: categories,
		RecentActivity: recent,
		MonthlyTrends:  trends,
	}, nil
}

func (s *DashboardService) GetCategoryTotals(ctx context.Context, userID string) ([]models.CategoryTotal, error) {
	return s.repo.GetCategoryTotals(ctx, userID)
}

func (s *DashboardService) GetMonthlyTrends(ctx context.Context, userID string) ([]models.MonthlyTrend, error) {
	return s.repo.GetMonthlyTrends(ctx, userID)
}
