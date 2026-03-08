# E-Commerce Platform — Backend API

A production-grade REST API for a full-featured e-commerce platform, built with **Spring Boot 4** and **Java 25**. Implements secure authentication (JWT + Google OAuth2), role-based access control, shopping cart management, and order processing backed by PostgreSQL.

---

## Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| Framework      | Spring Boot 4.0.1                                |
| Language       | Java 25                                          |
| Database       | PostgreSQL 16 with Spring Data JPA / Hibernate (MySQL also supported) |
| Authentication | Spring Security, JWT (jjwt), Google OAuth2       |
| Build          | Maven 3.9 (with Maven Wrapper)                   |
| Containerization | Docker (multi-stage build)                     |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React SPA)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP + httpOnly Cookie (JWT)
┌──────────────────────────▼──────────────────────────────────┐
│                     Spring Security                         │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ JwtFilter│→ │ SecurityChain│→ │ OAuth2 SuccessHandler │ │
│  └──────────┘  └──────────────┘  └───────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     REST Controllers                        │
│  /auth/*    /product/*    /cart/*    /order/*                │
├─────────────────────────────────────────────────────────────┤
│                     Service Layer                           │
│  UserService  ProductService  CartService  OrderService     │
├─────────────────────────────────────────────────────────────┤
│                     JPA Repositories                        │
├─────────────────────────────────────────────────────────────┤
│                   PostgreSQL Database                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

- **Dual Authentication** — Local username/password registration with BCrypt hashing, plus Google OAuth2 single sign-on.
- **JWT in httpOnly Cookies** — Stateless auth with tokens stored in secure, httpOnly cookies to prevent XSS attacks.
- **Role-Based Access Control** — Three roles (USER, ADMIN, SHOPOWNER) with endpoint-level authorization via Spring Security.
- **Product Catalog** — CRUD operations for products with image URLs, pricing, descriptions, and inventory tracking.
- **Shopping Cart** — Per-user persistent cart with add, update quantity, remove, and clear operations. Validates against available stock.
- **Order Processing** — Checkout flow that atomically converts cart items into orders, decrements inventory, and tracks order status (PROCESSING, DELIVERED, CANCELLED).
- **Centralized CORS Configuration** — Single-source CORS policy driven by environment variables instead of scattered `@CrossOrigin` annotations.
- **Global Exception Handling** — `@ControllerAdvice` with structured error DTOs for consistent API error responses.
- **Fully Externalized Configuration** — Every secret and environment-specific value is configurable via environment variables, making the app 12-factor compliant.
- **Dual Database Support** — PostgreSQL by default, with commented MySQL config ready to swap in.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint          | Auth     | Description              |
| ------ | ----------------- | -------- | ------------------------ |
| POST   | `/auth/createUser`  | Public   | Register a new user      |
| POST   | `/auth/createAdmin` | Public   | Register a new admin     |
| POST   | `/auth/login`       | Public   | Login, returns JWT cookie|
| GET    | `/auth/me`          | Required | Get current user profile |
| POST   | `/auth/logout`      | Public   | Clears auth cookie       |

### Products (`/product`)

| Method | Endpoint         | Auth     | Description            |
| ------ | ---------------- | -------- | ---------------------- |
| GET    | `/product/`      | Public   | List all products      |
| GET    | `/product/{id}`  | Public   | Get product by ID      |
| POST   | `/product/`      | Required | Create a new product   |

### Cart (`/cart`)

| Method | Endpoint             | Auth     | Description               |
| ------ | -------------------- | -------- | ------------------------- |
| GET    | `/cart/`             | Required | Get cart items             |
| POST   | `/cart/`             | Required | Add product to cart        |
| PUT    | `/cart/`             | Required | Update item quantity       |
| DELETE | `/cart/`             | Required | Clear entire cart          |
| DELETE | `/cart/{productId}`  | Required | Remove specific product    |

### Orders (`/order`)

| Method | Endpoint         | Auth     | Description              |
| ------ | ---------------- | -------- | ------------------------ |
| GET    | `/order/`        | Required | List user's orders       |
| GET    | `/order/{id}`    | Required | Get order details        |
| POST   | `/order/`        | Required | Place order from cart    |
| DELETE | `/order/{id}`    | Required | Delete an order          |

---

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   app_user   │       │   product    │       │  order_ecom  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ name         │       │ name         │       │ address      │
│ username     │       │ image        │       │ receiver_name│
│ password     │       │ price        │       │ order_status │
│ email        │       │ short_desc   │       │ placed_date  │
│ role_type    │       │ long_desc    │       │ app_user (FK)│
│ address      │       │ available_qty│       └──────┬───────┘
│ provider     │       └──────┬───────┘              │
│ provider_uid │              │                      │
└──────┬───────┘              │               ┌──────▼───────┐
       │                      │               │  order_item  │
       │               ┌──────▼───────┐       ├──────────────┤
       │               │  cart_item   │       │ id (PK)      │
       │               ├──────────────┤       │ product_id   │
┌──────▼───────┐       │ id (PK)      │       │ product_name │
│    cart      │       │ product (FK) │       │ price        │
├──────────────┤       │ quantity     │       │ quantity     │
│ id (PK)      │       │ cart (FK)    │       │ order (FK)   │
│ app_user (FK)│       └──────────────┘       └──────────────┘
└──────┬───────┘
       │
       └──────── cart_items ──────────┘
```

---

## Getting Started

### Prerequisites

- **Java 25** — [Download](https://adoptium.net/temurin/releases/?version=25)
- **Maven 3.9+** — Included via Maven Wrapper (`./mvnw`)
- **PostgreSQL 16+** — [Download](https://www.postgresql.org/download/) (or use Docker / Neon free tier)
- **Docker** (optional) — [Download](https://docs.docker.com/get-docker/)

### Option 1: Run with Docker (Recommended for Local Development)

From the **project root** (`ecom/`):

```bash
# 1. Copy and edit environment config
cp .env.example .env
# Edit .env with your DB_PASSWORD, JWT_SECRET, and optionally Google OAuth credentials

# 2. Start everything (PostgreSQL + Backend + Frontend)
./deploy.sh up

# Backend available at http://localhost:8181
# Frontend available at http://localhost:3000
```

Or build just the backend image:

```bash
cd ecom_backend

docker build -t ecom-backend .

docker run -p 8181:8181 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/ecom_backend \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_secret \
  -e FRONTEND_URL=http://localhost:3000 \
  ecom-backend
```

### Option 2: Run Locally

```bash
# 1. Clone the repository
git clone <repository-url>
cd ecom/ecom_backend

# 2. Create the database
psql -U postgres -c "CREATE DATABASE ecom_backend;"

# 3. Set up application properties
cp src/main/resources/application.properties.config src/main/resources/application.properties
# Edit application.properties with your database credentials, JWT secret, etc.

# 4. Build and run
./mvnw spring-boot:run

# Server starts at http://localhost:8181
```

### Option 3: Deploy to Render (Free Tier)

See the [Deployment Guide](#deployment-guide-free-tier) below.

---

## Environment Variables

All configuration is externalized. Set these as environment variables or in the `.env` file:

| Variable              | Default                         | Description                        |
| --------------------- | ------------------------------- | ---------------------------------- |
| `SERVER_PORT`         | `8181`                          | Port the backend listens on        |
| `DB_URL`              | `jdbc:postgresql://localhost:5432/ecom_backend` | JDBC connection string  |
| `DB_USERNAME`         | `postgres`                      | Database username                  |
| `DB_PASSWORD`         | —                               | Database password (**required**)   |
| `JWT_SECRET`          | —                               | JWT signing key (**required**)     |
| `JWT_EXPIRES_IN`      | `900`                           | JWT expiry in seconds              |
| `COOKIE_NAME`         | `authToken`                     | Name of the auth cookie            |
| `COOKIE_EXPIRES_IN`   | `900`                           | Cookie expiry in seconds           |
| `FRONTEND_URL`        | `http://localhost:5173`         | Frontend origin for CORS & OAuth2 redirect |
| `GOOGLE_CLIENT_ID`    | —                               | Google OAuth2 client ID (optional) |
| `GOOGLE_CLIENT_SECRET`| —                               | Google OAuth2 client secret (optional) |

---

## Deployment Guide (Free Tier)

This project can be deployed entirely for free using:

| Service   | Platform                          | Free Tier               |
| --------- | --------------------------------- | ----------------------- |
| Database  | [Neon](https://neon.tech)         | 0.5 GB, always free     |
| Backend   | [Render](https://render.com)     | 750 hrs/month           |
| Frontend  | [Vercel](https://vercel.com)     | Unlimited for hobby     |

### Step 1 — Database (Neon PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) (GitHub login works).
2. Create a new project → pick a region close to you.
3. Copy the **JDBC connection string** from the dashboard. It looks like:
   ```
   jdbc:postgresql://ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&user=your_user&password=your_pass
   ```
4. Save this — you'll paste it as `DB_URL` in the backend.

### Step 2 — Backend (Render)

1. Push the backend code to a GitHub repository.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo. Set:
   - **Root directory**: `ecom_backend`
   - **Runtime**: `Docker`
4. Add these **environment variables** in the Render dashboard:

   | Key               | Value                                      |
   | ----------------- | ------------------------------------------ |
   | `DB_URL`          | Your Neon JDBC connection string            |
   | `DB_USERNAME`     | From Neon dashboard                         |
   | `DB_PASSWORD`     | From Neon dashboard                         |
   | `JWT_SECRET`      | Run `openssl rand -base64 32` to generate  |
   | `FRONTEND_URL`    | Your Vercel URL (set after Step 3)          |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console (optional)       |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console (optional)  |

5. Deploy. Note the Render URL (e.g. `https://ecom-backend-xxxx.onrender.com`).

### Step 3 — Frontend (Vercel)

1. Push the frontend code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Set:
   - **Root directory**: `ecom_frontend/e_com_frontend`
   - **Framework preset**: Vite
4. Add this **environment variable**:

   | Key                  | Value                                       |
   | -------------------- | ------------------------------------------- |
   | `VITE_API_BASE_URL`  | Your Render backend URL from Step 2         |

5. Deploy. Note the Vercel URL (e.g. `https://ecom-frontend.vercel.app`).

### Step 4 — Connect the loop

Go back to Render and update `FRONTEND_URL` to your Vercel URL from Step 3. Redeploy the backend.

If using Google OAuth2, update the authorized redirect URI in Google Cloud Console to:
`https://your-render-url.onrender.com/oauth2/authorization/google`

---

## Switching to MySQL

Both PostgreSQL and MySQL are supported. To use MySQL:

1. **`pom.xml`** — Uncomment the MySQL dependency, comment out PostgreSQL.
2. **`application.properties`** — Uncomment the MySQL lines, comment out the PostgreSQL lines.

No code changes required — Hibernate handles the rest.

---

## Project Structure

```
ecom_backend/
├── src/main/java/com/example/ecom_backend/
│   ├── EcomBackendApplication.java        # Application entry point
│   ├── config/
│   │   ├── AppConfigurationProperties.java  # Type-safe config binding
│   │   ├── CorsConfig.java                  # Centralized CORS policy
│   │   ├── OAuth2SuccessHandler.java        # Google OAuth2 callback
│   │   └── SecurityConfig.java              # Security filter chain
│   ├── controllers/                         # REST API endpoints
│   ├── dtos/                                # Data Transfer Objects
│   ├── entities/                            # JPA entities
│   ├── exceptions/                          # Custom exceptions + global handler
│   ├── filters/
│   │   └── JwtFilter.java                   # JWT authentication filter
│   ├── repositories/                        # Spring Data JPA repositories
│   ├── services/                            # Business logic layer
│   └── utils/
│       └── JwtUtil.java                     # JWT creation & validation
├── src/main/resources/
│   ├── application.properties               # Config with env var support
│   └── application.properties.config        # Configuration template
├── Dockerfile                               # Multi-stage Docker build
├── .dockerignore
└── pom.xml                                  # Maven dependencies
```

---

## Design Decisions

1. **JWT subject is the user ID, not username** — OAuth2 users don't have a traditional username. Using the database primary key as the JWT subject provides a universal identifier across both local and OAuth2 authentication flows.

2. **httpOnly cookies over Authorization headers** — Storing JWTs in httpOnly cookies prevents JavaScript access, mitigating XSS token theft. The `SameSite=Lax` attribute provides baseline CSRF protection.

3. **Order items snapshot product data** — `OrderItem` stores `productName` and `productPriceWhileOrdering` at the time of purchase, so order history remains accurate even if product details change later.

4. **Centralized CORS via `CorsConfigurationSource` bean** — Instead of per-controller `@CrossOrigin` annotations, CORS is configured once and driven by the `FRONTEND_URL` environment variable, making deployment configuration trivial.

5. **PostgreSQL as default over MySQL** — PostgreSQL offers free managed hosting (Neon, Supabase) making deployment cost-free. MySQL config is preserved and can be swapped in with two comment toggles.
