package middleware

import (
	"backend/internal/models"
	"backend/internal/services"
	"context"
	"encoding/json"
	"net/http"
	"strings"
)

type contextKey string

const UserContextKey contextKey = "user"

type AuthMiddleware struct {
	authService *services.AuthService
}

func NewAuthMiddleware(authService *services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
	}
}

func (m *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			writeError(w, http.StatusUnauthorized, "authorization header is missing")
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			writeError(w, http.StatusUnauthorized, "invalid authorization format, use Bearer token")
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenStr == "" {
			writeError(w, http.StatusUnauthorized, "token is empty")
			return
		}

		claims, err := m.authService.ValidateToken(tokenStr)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "invalid token")
			return
		}

		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func (m *AuthMiddleware) RequireRole(roles ...models.Role) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value(UserContextKey).(*models.JWTClaims)
			if !ok || claims == nil {
				writeError(w, http.StatusUnauthorized, "unauthorized")
				return
			}

			// match role
			for _, role := range roles {
				if claims.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}

			writeError(w, http.StatusForbidden, "you do not have permission to access this resource")
		})
	}
}

func GetClaims(r *http.Request) *models.JWTClaims {
	claims, _ := r.Context().Value(UserContextKey).(*models.JWTClaims)
	return claims
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
