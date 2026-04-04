package main

import (
	"backend/internal/config"
	"backend/internal/db"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/services"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func main() {
	cfg := config.Load()

	database := db.NewPostgresDB(cfg)
	defer database.Close()

	// repositories
	authRepo := repository.NewAuthRepository(database)
	userRepo := repository.NewUserRepository(database)
	transactionRepo := repository.NewTransactionRepository(database)
	dashboardRepo := repository.NewDashboardRepository(database)

	//services
	authService := services.NewAuthService(authRepo, cfg)
	userService := services.NewUserService(userRepo, cfg)
	txtService := services.NewTransactionService(transactionRepo, cfg)
	dashboardService := services.NewDashboardService(dashboardRepo)

	//handlers
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userService)
	txtHandler := handlers.NewTransactionHandler(txtService)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)

	//middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	//routes
	r := chi.NewRouter()

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.RequestID)

	// health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// public routes
	r.Post("/api/v1/auth/register", authHandler.Register)
	r.Post("/api/v1/auth/login", authHandler.Login)

	// protected routes
	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.Authenticate)

		// viewer, analyst, admin
		r.Get("api/v1/transaction", txtHandler.List)
		r.Get("/api/v1/transaction/{id}", txtHandler.GetByID)
		r.Get("/api/v1/dashboard", dashboardHandler.Summary)

		// analyst + admin only
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireRole(models.RoleAnalyst, models.RoleAdmin))
			r.Get("api/v1/dashboard/trends", dashboardHandler.Trends)
			r.Get("api/v1/dashboard/categories", dashboardHandler.CategoryTotals)
		})

		// admin only
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireRole(models.RoleAdmin))

			// transaction
			r.Post("api/v1/transactions", txtHandler.Create)
			r.Put("api/v1/transactions/{id}", txtHandler.Update)
			r.Delete("api/v1/transactions/{id}", txtHandler.Delete)

			// users
			r.Get("api/v1/users", userHandler.List)
			r.Get("api/v1/users/{id}", userHandler.GetByID)
			r.Put("api/v1/users/{id}", userHandler.Update)
			r.Delete("api/v1/users/{id}", userHandler.Delete)
		})
	})

	log.Printf("server starting on port %s env=%s", cfg.App.Port, cfg.App.Env)
	if err := http.ListenAndServe(":"+cfg.App.Port, r); err != nil {
		log.Fatalf("server failed to start %v", err)
	}
}
