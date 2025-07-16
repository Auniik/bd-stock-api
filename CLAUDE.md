# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bangladesh Stock Market Data API that scrapes data from the Dhaka Stock Exchange (DSE). The API provides real-time and historical stock data through REST endpoints.

## Development Commands

### Building and Running
- `npm run build` - Compiles TypeScript (production build)
- `npm run build:watch` - Compiles TypeScript with watch mode
- `npm run start` - Starts the compiled server (production)
- `npm run start-server` - Starts the compiled server (requires build first)
- `npm run dev` - Development mode with hot reload (uses tsc-watch)

### Testing
- No test framework is currently configured (test script exits with error)

## Deployment

### Vercel
- Configured for Vercel deployment with `vercel.json`
- Build command: `npm run build`
- Start command: `npm run start`
- Routes all requests to compiled Express app
- Environment variables: Set `DSE_BASE_URL` and `PORT` in Vercel dashboard

## Architecture

### Core Technologies
- **Express.js** with **routing-controllers** for API routes
- **TypeDI** for dependency injection
- **Cheerio** for HTML parsing/web scraping
- **Axios** with retry logic for HTTP requests
- **TypeScript** with decorators enabled

### Project Structure
```
src/
├── app.ts              # Main application entry point
├── controllers/        # API controllers using routing-controllers
│   └── DseController.ts
├── services/           # Business logic services
│   └── DsePriceService.ts
├── middlewares/        # Express middlewares
│   └── ErrorMiddleware.ts
├── utils/             # Utility functions
│   ├── ApiError.ts
│   ├── axiosConfig.ts
│   └── helpers.ts
├── env.ts             # Environment configuration
└── constants.js       # Constants file
```

### Key Components

1. **DseController** (`src/controllers/DseController.ts`):
   - Uses `@JsonController("/v1/dse")` decorator
   - Handles all DSE-related endpoints
   - Dependency injection via constructor

2. **StockDataService** (`src/services/DsePriceService.ts`):
   - Core scraping logic using Cheerio
   - Fetches data from DSE website endpoints
   - Parses HTML tables into structured data

3. **Application Setup** (`src/app.ts`):
   - Uses `createExpressServer` from routing-controllers
   - Registers controllers and middlewares
   - Enables CORS for cross-origin requests

### Data Flow
1. Client hits REST endpoint → Controller
2. Controller calls Service methods
3. Service scrapes DSE website using Axios + Cheerio
4. Service parses HTML tables into JSON
5. Response wrapped in standard API format via `apiResponse` helper

### Environment Configuration
- `DSE_BASE_URL` - Base URL for DSE website (defaults to https://dsebd.org)
- `PORT` - Server port (defaults to 3000)

### API Endpoints
- `GET /v1/dse/latest` - Latest stock data
- `GET /v1/dse/top30` - Top 30 stocks
- `GET /v1/dse/dsexdata?symbol=<symbol>` - DSEX data with optional symbol filter
- `GET /v1/dse/historical?start=<date>&end=<date>&code=<code>` - Historical data

### API Documentation
- **Swagger UI** available at `/api-docs` endpoint
- Interactive API documentation with request/response examples
- OpenAPI 3.0 specification defined in `src/swagger.json`
- Comprehensive documentation with detailed descriptions, examples, and schemas

### Development Notes
- TypeScript configuration includes decorator support
- No linting or type checking commands are configured
- Uses CommonJS modules (not ES modules)
- Axios is configured with retry logic in `axiosConfig.ts`
- All API responses use consistent format via `apiResponse` helper
- Error handling through GlobalErrorHandler middleware