# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Lealou Pizza — a full-stack SolidJS + Express.js pizza/burger restaurant app with SSR via Vite. Uses embedded SQLite (`data/lealou.db`, auto-created on first run). Single process: `npm run dev` starts everything on port 5173.

### Running the application

- **Dev server:** `npm run dev` (port 5173, binds to 0.0.0.0)
- **Build:** `npm run build` (client + SSR server bundles into `dist/`)
- **Seed test data:** `npm run seed:clients`
- **Health check:** `GET /health` or `GET /santé`

### Key details

- No linter or test framework is configured in this project. There are no ESLint config files, no test runner, and no `lint` or `test` npm scripts.
- Admin panel is at `/staff` — password is `lealou` (hardcoded in `src/config/auth.js`).
- The order API expects `customer_name` (not `name`) as the field for the customer's name.
- PassNinja integration (Apple Wallet loyalty passes) is optional and requires env vars `PASS_NINJA_API_KEY`, `PASS_NINJA_ACCOUNT_ID`, `PASS_NINJA_PASS_TYPE`.
- SQLite database file is at `data/lealou.db` — delete it to reset all data.
- No Docker needed for local dev; Docker is only for production deployment.
