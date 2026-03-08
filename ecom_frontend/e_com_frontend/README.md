# E-Commerce Platform — Frontend

A modern, responsive single-page application for a full-featured e-commerce store. Built with **React 19**, **Vite 7**, and **Tailwind CSS 4**. Supports user authentication (local + Google OAuth2), product browsing, shopping cart management, and order placement.

---

## Tech Stack

| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | React 19                                |
| Build Tool    | Vite 7                                  |
| Styling       | Tailwind CSS 4                          |
| Routing       | React Router 7 (data router)            |
| Notifications | react-hot-toast                         |
| Containerization | Docker (multi-stage with Nginx)      |

---

## Features

- **Product Catalog** — Grid view of all products with images, pricing, and quick add-to-cart.
- **Product Detail Page** — Full product view with quantity selection and detailed descriptions.
- **Shopping Cart** — Real-time cart with quantity controls, item removal, and order summary with shipping calculations.
- **Order Checkout** — Address and receiver input with order placement that clears the cart.
- **Order History** — Expandable order list showing status, date, and itemized breakdown.
- **Authentication** — Local login/signup plus Google OAuth2 single sign-on. Auth state persists via httpOnly cookies.
- **Protected Routes** — Cart and order pages show a sign-in prompt for unauthenticated users.
- **Responsive UI** — Clean, minimal design powered by Tailwind CSS that works across devices.
- **Context-Based State** — `AuthContext` and `CartContext` provide global state management without external libraries.

---

## Pages & Routing

| Path              | Component      | Description                     |
| ----------------- | -------------- | ------------------------------- |
| `/`               | Home           | Product catalog grid            |
| `/product/:id`    | ProductPage    | Product detail view             |
| `/auth/login`     | AuthLogin      | Login form + Google OAuth link  |
| `/auth/signup`    | Signup         | User registration form          |
| `/cart`           | Cart           | Shopping cart + checkout         |
| `/order`          | Order          | Order history                   |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       App.jsx                           │
│                   (React Router)                        │
├─────────────────────────────────────────────────────────┤
│                    RootLayout                           │
│               ┌─────────────────┐                      │
│               │     Navbar      │  ← AuthContext        │
│               │                 │  ← CartContext        │
│               └─────────────────┘                      │
│                    <Outlet />                           │
├─────────────────┬───────────────┬───────────────┬──────┤
│    Home         │   Cart        │   Order       │ Auth │
│  ┌───────────┐  │ ┌───────────┐│ ┌───────────┐ │      │
│  │ProductCard│  │ │ CartItem  ││ │OrderItem  │ │      │
│  │  (grid)   │  │ │OrderSumm. ││ │Product    │ │      │
│  └───────────┘  │ └───────────┘│ └───────────┘ │      │
└─────────────────┴──────────────┴───────────────┴──────┘

┌─────────────────────────────────────────────────────────┐
│                  Context Providers                       │
│   AuthContext ── login, logout, isLoggedIn, appName     │
│   CartContext ── addToCart, updateCartItem, clearCart    │
├─────────────────────────────────────────────────────────┤
│                Backend API (REST)                        │
│        VITE_API_BASE_URL → http://localhost:8181        │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js 22+** — [Download](https://nodejs.org/)
- **npm 10+** — Comes with Node.js
- **Docker** (optional) — [Download](https://docs.docker.com/get-docker/)
- A running instance of the **backend API** (see [backend README](../../ecom_backend/README.md))

### Option 1: Run with Docker (Recommended for Local Development)

From the **project root** (`ecom/`):

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env — at minimum set DB_PASSWORD and JWT_SECRET

# 2. Start everything (PostgreSQL + Backend + Frontend)
./deploy.sh up

# Frontend available at http://localhost:3000
```

Or build just the frontend image:

```bash
cd ecom_frontend/e_com_frontend

docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8181 \
  -t ecom-frontend .

docker run -p 3000:80 ecom-frontend
```

### Option 2: Run Locally (Development)

```bash
# 1. Clone the repository
git clone <repository-url>
cd ecom/ecom_frontend/e_com_frontend

# 2. Install dependencies
npm install

# 3. Configure the backend URL
#    Edit .env if the backend is not at the default http://localhost:8181
cat .env
# VITE_API_BASE_URL=http://localhost:8181

# 4. Start the dev server
npm run dev

# App opens at http://localhost:5173
```

### Option 3: Deploy to Vercel (Free Tier)

See the [Deployment Guide](#deployment-guide-free-tier) below.

---

## Environment Variables

| Variable             | Default                    | Description                          |
| -------------------- | -------------------------- | ------------------------------------ |
| `VITE_API_BASE_URL`  | `http://localhost:8181`    | Backend API URL (baked in at build time) |

> **Note:** Vite environment variables are embedded during `npm run build`. Changing them requires a rebuild. For Docker, pass the value as a build arg. On Vercel, set it in the dashboard and redeploy.

---

## Deployment Guide (Free Tier)

The full platform can be deployed for free:

| Service   | Platform                          | Free Tier               |
| --------- | --------------------------------- | ----------------------- |
| Frontend  | [Vercel](https://vercel.com)     | Unlimited for hobby     |
| Backend   | [Render](https://render.com)     | 750 hrs/month           |
| Database  | [Neon](https://neon.tech)         | 0.5 GB, always free     |

### Deploy to Vercel

1. Push this code to a **GitHub repository**.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Configure:
   - **Root directory**: `ecom_frontend/e_com_frontend`
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Add the environment variable:

   | Key                  | Value                                       |
   | -------------------- | ------------------------------------------- |
   | `VITE_API_BASE_URL`  | Your backend URL (e.g. `https://ecom-backend-xxxx.onrender.com`) |

5. Click **Deploy**.

After deploying, go back to your **Render backend** and set `FRONTEND_URL` to your Vercel URL (e.g. `https://ecom-store.vercel.app`), then redeploy the backend so CORS allows the new origin.

---

## Project Structure

```
e_com_frontend/
├── src/
│   ├── main.jsx                     # React entry point with providers
│   ├── App.jsx                      # Router configuration
│   ├── contexts/
│   │   ├── AuthContext.jsx          # Authentication state & API calls
│   │   └── CartContext.jsx          # Cart state & API calls
│   ├── layouts/
│   │   └── RootLayout.jsx          # Navbar + page outlet
│   ├── pages/
│   │   ├── Home.jsx                # Product catalog
│   │   ├── Auth.jsx                # Auth layout
│   │   ├── AuthLogin.jsx           # Login form + Google OAuth
│   │   ├── Cart.jsx                # Shopping cart + checkout
│   │   └── Order.jsx               # Order history
│   └── components/
│       ├── Navbar.jsx              # Navigation bar with cart badge
│       ├── ProductCard.jsx         # Product grid item
│       ├── ProductPage.jsx         # Product detail view
│       ├── ProductsTogether.jsx    # Fetches & renders product grid
│       ├── CartItem.jsx            # Cart line item with controls
│       ├── OrderSummary.jsx        # Checkout form with totals
│       ├── OrderItemProduct.jsx    # Order line item display
│       ├── AddToCartButton.jsx     # Add to cart with toast feedback
│       ├── Signup.jsx              # Registration form
│       ├── Signin.jsx              # Sign-in link
│       ├── SignOutButton.jsx       # Logout button
│       ├── SignInFirstComponent.jsx # Auth gate for protected pages
│       ├── CheckoutButton.jsx      # Checkout trigger
│       └── ClearCartButton.jsx     # Cart clear action
├── index.html                      # HTML shell
├── .env                            # Environment configuration
├── vite.config.js                  # Vite + Tailwind plugin config
├── nginx.conf                      # Nginx config for Docker
├── Dockerfile                      # Multi-stage Docker build
└── package.json
```

---

## Docker Details

The Dockerfile uses a **two-stage build** for an optimized production image:

1. **Build stage** (`node:22-alpine`) — Installs dependencies and runs `vite build` with the `VITE_API_BASE_URL` build arg baked in.
2. **Serve stage** (`nginx:alpine`) — Copies the built static files into Nginx with SPA-friendly routing (all paths fall back to `index.html`).

Final image size is ~25 MB compared to ~350 MB for a Node-based image.

---

## Design Decisions

1. **Context API over Redux** — For an app of this scope, React Context with `useState` provides clean global state management without the boilerplate of external state libraries.

2. **Cookie-based auth over localStorage** — The backend sets httpOnly cookies, so the frontend never touches the JWT directly. This eliminates XSS-based token theft entirely.

3. **Vite over CRA / Next.js** — Vite provides near-instant HMR and fast builds. Since the app is a pure SPA consuming a REST API, server-side rendering was unnecessary.

4. **Nginx for production** — Instead of `vite preview` (which is not production-hardened), the Docker image uses Nginx with proper caching headers and SPA fallback routing.
