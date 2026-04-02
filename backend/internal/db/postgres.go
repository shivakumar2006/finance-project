package db

import (
	"backend/internal/config"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func NewPostgresDB(cfg *config.Config) *sql.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
		cfg.Database.SSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to open db connection: %v", err)
	}

	// connection pool setting
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	// ping for check
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping db: %v", err)
	}

	log.Println("Successfully connected to database")
	return db
}
