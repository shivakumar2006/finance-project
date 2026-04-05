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
	"github.com/rs/cors"
	"golang.org/x/time/rate"
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

	// rate limiter
	rateLimiter := middleware.NewRateLimiter(rate.Limit(10), 20) // 10 means 10 requests per second per ip and 20 means burst 20 request at a time after that 429 too many requests

	// liimt for authroutes
	authLimit := middleware.NewRateLimiter(rate.Limit(3), 5) // 3 req/sec, burst 5 at a same time

	// limit for normal routes
	apiLimit := middleware.NewRateLimiter(rate.Limit(10), 20)

	//routes
	r := chi.NewRouter()

	// cors
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "OPTIONS", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	r.Use(c.Handler)

	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.RequestID)
	r.Use(rateLimiter.Limit)

	r.Options("/*", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// public routes
	r.Group(func(r chi.Router) {
		r.Use(authLimit.Limit)
		r.Post("/api/v1/auth/register", authHandler.Register)
		r.Post("/api/v1/auth/login", authHandler.Login)
	})

	// protected routes
	r.Group(func(r chi.Router) {
		r.Use(apiLimit.Limit)
		r.Use(authMiddleware.Authenticate)

		// viewer, analyst, admin
		r.Get("/api/v1/transactions", txtHandler.List)
		r.Get("/api/v1/transactions/{id}", txtHandler.GetByID)
		r.Get("/api/v1/dashboard", dashboardHandler.Summary)

		// analyst + admin only
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireRole(models.RoleAnalyst, models.RoleAdmin))
			r.Get("/api/v1/dashboard/trends", dashboardHandler.Trends)
			r.Get("/api/v1/dashboard/categories", dashboardHandler.CategoryTotals)
		})

		// admin only
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireRole(models.RoleAdmin, models.RoleAnalyst))

			// transaction
			r.Post("/api/v1/transactions", txtHandler.Create)
			r.Put("/api/v1/transactions/{id}", txtHandler.Update)
			r.Delete("/api/v1/transactions/{id}", txtHandler.Delete)

			// users
			r.Get("/api/v1/users", userHandler.List)
			r.Get("/api/v1/users/{id}", userHandler.GetByID)
			r.Put("/api/v1/users/{id}", userHandler.Update)
			r.Delete("/api/v1/users/{id}", userHandler.Delete)
		})
	})

	log.Printf("server starting on port %s env=%s", cfg.App.Port, cfg.App.Env)
	if err := http.ListenAndServe(":"+cfg.App.Port, r); err != nil {
		log.Fatalf("server failed to start %v", err)
	}
}
