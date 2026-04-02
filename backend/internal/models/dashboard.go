package models

type DashboardSummary struct {
	TotalIncome    float64         `json:"total_income"`
	TotalExpenses  float64         `json:"total_expense"`
	NetBalance     float64         `json:"net_balance"`
	CategoryTotals []CategoryTotal `json:"category_total"`
	RecentActivity []*Transaction  `json:"recent_activity"`
	MonthlyTrends  []MonthlyTrend  `json:"monthly_trends"`
}

type CategoryTotal struct {
	Category string          `json:"category"`
	Type     TransactionType `json:"type"`
	Total    float64         `json:"total"`
}

type MonthlyTrend struct {
	Month   string  `json:"month"`
	Income  float64 `json:"income"`
	Expense float64 `json:"expense"`
	Net     float64 `json:"net"`
}
