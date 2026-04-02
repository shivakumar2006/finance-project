package models

import "time"

type TransactionType string

const (
	TypeIncome  TransactionType = "income"
	TypeExpense TransactionType = "expense"
)

type Transaction struct {
	ID        string          `json:"id" db:"id"`
	UserID    string          `json:"user_id" db:"user_id"`
	Amount    float64         `json:"amount" db:"amount"`
	Type      TransactionType `json:"type" db:"type"`
	Category  string          `json:"category" db:"category"`
	Date      time.Time       `json:"date" db:"date"`
	Notes     string          `json:"notes" db:"notes"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}

type CreateTransactionRequest struct {
	Amount   float64         `json:"amount"`
	Type     TransactionType `json:"type"`
	Category string          `json:"category"`
	Date     string          `json:"date"`
	Notes    string          `json:"notes"`
}

type UpdateTransactionRequest struct {
	Amount   *float64         `json:"amount"`
	Type     *TransactionType `json:"type"`
	Category *string          `json:"category"`
	Date     *string          `json:"date"`
	Notes    *string          `json:"notes"`
}

type FilterParams struct {
	Type      string `json:"type"`
	Category  string `json:"category"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
	Page      int    `json:"page"`
	Limit     int    `json:"limit"`
}

type PaginatedTransaction struct {
	Data       *[]Transaction `json:"data"`
	Total      int            `json:"total"`
	Page       int            `json:"page"`
	Limit      int            `json:"limit"`
	TotalPages int            `json:"total_pages"`
}
