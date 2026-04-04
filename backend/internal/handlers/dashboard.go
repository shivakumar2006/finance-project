package handlers

import (
	"backend/internal/services"
	"net/http"
)

type DashboardHandler struct {
	service *services.DashboardService
}

func NewDashboardHandler(service *services.DashboardService) *DashboardHandler {
	return &DashboardHandler{
		service: service,
	}
}

func (h *DashboardHandler) Summary(w http.ResponseWriter, r *http.Request) {
	summary, err := h.service.GetSummary(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch summary")
		return
	}
	writeJSON(w, http.StatusOK, summary)
}

func (h *DashboardHandler) Trends(w http.ResponseWriter, r *http.Request) {
	trends, err := h.service.GetMonthlyTrends(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch trends")
		return
	}
	writeJSON(w, http.StatusOK, trends)
}

func (h *DashboardHandler) CategoryTotals(w http.ResponseWriter, r *http.Request) {
	category, err := h.service.GetCategoryTotals(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch category total")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"data": category,
	})
}
