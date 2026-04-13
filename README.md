# VaultX

Secure digital vault with a Node/Express backend and a React/Vite frontend.

## Project structure

- `backend/`: Express server, API routes, models, middleware, and database config
- `frontend/`: Current React + Vite application
- `uploads/`: Uploaded file storage

## Scripts

- `npm run dev`: Start the backend
- `npm run dev:backend`: Start the backend
- `npm run dev:frontend`: Start the Vite frontend
- `npm run build`: Build the frontend into `frontend/dist`
- `npm start`: Start the backend in normal mode

## Notes

- The old static frontend has been removed.
- The backend now serves only the built React app from `frontend/dist`.
- If `frontend/dist` does not exist yet, the backend returns a helpful message telling you to build the frontend or run the Vite app separately.
