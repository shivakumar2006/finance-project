package services

import (
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repository"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type TransactionService struct {
	repo   *repository.TransactionRepository
	config *config.Config
}

func NewTransactionService(repo *repository.TransactionRepository, config *config.Config) *TransactionService {
	return &TransactionService{
		repo:   repo,
		config: config,
	}
}

func (s *TransactionService) Create(ctx context.Context, req *models.CreateTransactionRequest) (*models.Transaction, error) {
	// validate
	if req.Amount <= 0 {
		return nil, errors.New("amount must be greater than 0")
	}
	if req.Type != models.TypeIncome && req.Type != models.TypeExpense {
		return nil, errors.New("type must be income or expense")
	}
	if req.Category == "" {
		return nil, errors.New("category is required")
	}
	if req.Date == "" {
		return nil, errors.New("date is required")

	}

	// parse the date
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	transac := &models.Transaction{
		ID:       uuid.New().String(),
		Amount:   req.Amount,
		Type:     req.Type,
		Category: req.Category,
		Date:     date,
		Notes:    req.Notes,
	}

	return s.repo.Create(ctx, transac)
}

func (s *TransactionService) GetAll(ctx context.Context, filter *models.FilterParams) (*models.PaginatedTransaction, error) {
	// validate
	if filter.Type != "" && filter.Type != string(models.TypeIncome) && filter.Type != string(models.TypeExpense) {
		return nil, errors.New("type must be income or expense")
	}

	// defaults
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 10
	}

	transactions, total, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, err
	}

	totalPages := total / filter.Limit
	if total%filter.Limit != 0 {
		totalPages++
	}

	return &models.PaginatedTransaction{
		Data:       transactions,
		Total:      total,
		Page:       filter.Page,
		Limit:      filter.Limit,
		TotalPages: totalPages,
	}, nil
}

func (s *TransactionService) GetByID(ctx context.Context, id string) (*models.Transaction, error) {
	if id == "" {
		return nil, errors.New("id is required")
	}
	return s.repo.FindByID(ctx, id)
}

func (s *TransactionService) Update(ctx context.Context, id string, req *models.UpdateTransactionRequest) (*models.Transaction, error) {
	if id == "" {
		return nil, errors.New("id is required")
	}

	// validate
	if req.Amount != nil && *req.Amount <= 0 {
		return nil, errors.New("amount must be greater than 0")
	}
	if req.Type != nil && (*req.Type != models.TypeIncome && *req.Type != models.TypeExpense) {
		return nil, errors.New("type must be income or expense")
	}
	if req.Date == nil {
		if _, err := time.Parse("2006-01-02", *req.Date); err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
	}

	return s.repo.Update(ctx, id, req)
}

func (s *TransactionService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("id is required")
	}
	return s.repo.Delete(ctx, id)
}
