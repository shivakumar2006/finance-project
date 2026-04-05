package handlers

import (
	"backend/internal/middleware"
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
	claims := middleware.GetClaims(r)
	if claims == nil {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	summary, err := h.service.GetSummary(r.Context(), claims.UserID) // 🔥 PASS USER ID
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error()) // 🔥 DEBUG ERROR
		return
	}

	writeJSON(w, http.StatusOK, summary)
}

func (h *DashboardHandler) Trends(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetClaims(r)
	if claims == nil {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	trends, err := h.service.GetMonthlyTrends(r.Context(), claims.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch trends")
		return
	}
	writeJSON(w, http.StatusOK, trends)
}

func (h *DashboardHandler) CategoryTotals(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetClaims(r)
	if claims == nil {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	category, err := h.service.GetCategoryTotals(r.Context(), claims.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch category total")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"data": category,
	})
}
