package services

import (
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repository"
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo   *repository.AuthRepository
	config *config.Config
}

func NewAuthService(repo *repository.AuthRepository, config *config.Config) *AuthService {
	return &AuthService{
		repo:   repo,
		config: config,
	}
}

func (s *AuthService) Register(ctx context.Context, req *models.RegisterRequest) (*models.AuthResponse, error) {
	// validate role
	if req.Role != models.RoleViewer && req.Role != models.RoleAnalyst && req.Role != models.RoleAdmin {
		return nil, errors.New("invalid roles, must be viewer, analyst or admin")
	}

	// duplicate email check
	existing, _ := s.repo.FindByEmail(ctx, req.Email)
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	// password hash
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), s.config.Bcrypt.Cost)
	if err != nil {
		return nil, errors.New("failed to process password")
	}

	user := &models.User{
		ID:           uuid.New().String(),
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
		Role:         req.Role,
		Status:       models.StatusActive,
	}

	created, err := s.repo.CreateUser(ctx, user)
	if err != nil {
		return nil, errors.New("failed to create user")
	}

	token, err := s.generateToken(created)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  created,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	user, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if user.Status != models.StatusActive {
		return nil, errors.New("account is inactive")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := s.generateToken(user)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *AuthService) ValidateToken(tokenStr string) (*models.JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &models.JWTClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("Unexpected signing method")
			}
			return []byte(s.config.JWT.Secret), nil
		},
	)
	if err != nil {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*models.JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

func (s *AuthService) generateToken(user *models.User) (string, error) {
	claims := &models.JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   user.ID,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWT.Secret))
}
