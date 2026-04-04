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

func (s *DashboardService) GetSummary(ctx context.Context) (*models.DashboardSummary, error) {
	income, expenses, err := s.repo.GetSummary(ctx)
	if err != nil {
		return nil, err
	}

	categories, err := s.repo.GetCategoryTotals(ctx)
	if err != nil {
		return nil, err
	}

	recent, err := s.repo.GetRecentActivity(ctx, 5)
	if err != nil {
		return nil, err
	}

	trends, err := s.repo.GetMonthlyTrends(ctx)
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

func (s *DashboardService) GetCategoryTotals(ctx context.Context) ([]models.CategoryTotal, error) {
	return s.repo.GetCategoryTotals(ctx)
}

func (s *DashboardService) GetMonthlyTrends(ctx context.Context) ([]models.MonthlyTrend, error) {
	return s.repo.GetMonthlyTrends(ctx)
}
