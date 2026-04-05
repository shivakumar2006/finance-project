package repository

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"errors"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindAll(ctx context.Context) ([]*models.User, error) {
	query := `
		SELECT id, name, email, role, status, created_at, updated_at 
		FROM users
		ORDER BY created_at DESC 	
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		user := &models.User{}
		if err := rows.Scan(
			&user.ID, &user.Name, &user.Email, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
		); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, name, email, role, status, created_at, updated_at 
		FROM users 
		WHERE id = $1
	`

	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Name, &user.Email, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) Update(ctx context.Context, id string, req *models.UpdateUserRequest) (*models.User, error) {
	query := `
		UPDATE users 
		SET 
			role = COALESCE($1, role),
			status = COALESCE($2, status),
			updated_at = NOW()
		WHERE id = $3
		RETURNING id, name, email, role, status, created_at, updated_at	
	`

	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query,
		req.Role,
		req.Status,
		id,
	).Scan(
		&user.ID, &user.Name, &user.Email,
		&user.Role, &user.Status,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return errors.New("user not found")
	}
	return nil
}
