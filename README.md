# med-web Frontend

Frontend application built with React, Vite, and Tailwind CSS.

## Stack

- React
- JavaScript
- Tailwind CSS
- Fetch API

## Architecture

This project uses folder-based separation of responsibilities:

```
src/
	components/
	pages/
	features/
	services/
	hooks/
	utils/
	App.jsx
	main.jsx
```

### Rules

- UI components must not contain API logic.
- All API communication goes through `src/services/`.
- Pages handle view composition and flow.
- Components should stay small and reusable.

## Environment Variables

- `VITE_API_URL`: backend base URL used by service functions.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
