package services

import (
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repository"
	"context"
	"errors"
)

type UserService struct {
	repo   *repository.UserRepository
	config *config.Config
}

func NewUserService(repo *repository.UserRepository, config *config.Config) *UserService {
	return &UserService{
		repo:   repo,
		config: config,
	}
}

func (s *UserService) GetAll(ctx context.Context) ([]*models.User, error) {
	return s.repo.FindAll(ctx)
}

func (s *UserService) GetByID(ctx context.Context, id string) (*models.User, error) {
	if id == "" {
		return nil, errors.New("id is required")
	}
	return s.repo.FindByID(ctx, id)
}

func (s *UserService) Update(ctx context.Context, id string, req *models.UpdateUserRequest) (*models.User, error) {
	if id == "" {
		return nil, errors.New("id is required")
	}

	// validate role if it is changed
	if req.Role != nil {
		if *req.Role != models.RoleViewer && *req.Role != models.RoleAnalyst && *req.Role != models.RoleAdmin {
			return nil, errors.New("invalid role")
		}
	}

	// validate status if it is changed
	if req.Status != nil {
		if *req.Status != models.StatusActive && *req.Status != models.StatusInactive {
			return nil, errors.New("invalid status")
		}
	}

	return s.repo.Update(ctx, id, req)
}

func (s *UserService) Delete(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("id is required")
	}
	return s.repo.Delete(ctx, id)
}
