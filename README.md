# Flash

Flash is a web application for learning vocabulary with flashcards. Learners
can organize words into language collections, review cards on a spaced schedule,
generate cards with AI, and track basic learning activity.

## Features

- Public landing page with sign-in and account creation.
- Authenticated learning dashboard with due-review prompt and collection
  shortcuts.
- Collection management and collection-based card study.
- Manual flashcard creation, editing, deletion, searching, and browsing.
- AI flashcard generation from a topic or a supplied word list.
- Spaced-repetition review flow and basic review statistics.
- User profile and account settings.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React icons
- Supabase JavaScript client

The frontend communicates with a separate HTTP API. The API URL can be
configured with `VITE_API_URL`; it defaults to `http://localhost:3000`.

## Getting started

Requirements: Node.js and npm versions compatible with the installed Vite
release, plus access to the backend API.

```sh
npm ci
npm run dev
```

To point the frontend at a different backend, create a local `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

`.env` is git-ignored. Do not put private credentials in frontend environment
variables: variables prefixed with `VITE_` are included in the browser build.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run TypeScript project checks and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |

## Project structure

```text
src/
  App.tsx                 Application state and authenticated view composition
  main.tsx                React entry point
  components/             Shared UI primitives and existing feature components
  features/
    collections/          Collection list page
    dashboard/            Authenticated learning home
    landing/              Public marketing page
    statistics/           Learning statistics page
  pages/                  Existing page-level screens
  hooks/                  Reusable React state and data hooks
  services/               HTTP API operations grouped by domain
  lib/                    HTTP client and small shared utilities
  types/                  Shared domain and API types
  common/constants/       Shared constants and enumerations
```

## File reference

This index describes the purpose of each first-party project file. It excludes
generated output (`dist/`), installed dependencies (`node_modules/`), and local
environment files such as `.env`.

### Root files

| File | Purpose |
| --- | --- |
| `README.md` | Project overview, setup guide, architecture notes, and this file index. |
| `LICENSE` | License terms for the project. |
| `.gitignore` | Files and local artifacts that Git should not track, including `.env`, dependencies, and build output. |
| `index.html` | Vite HTML entry document containing the React mount point and page metadata. |
| `package.json` | Project scripts and direct dependency declarations. |
| `package-lock.json` | Exact npm dependency tree used for reproducible installs. |
| `vite.config.ts` | Vite plugins, TypeScript path resolution, and development/build configuration. |
| `tsconfig.json` | Root TypeScript project references for the app and Vite configuration. |
| `tsconfig.app.json` | TypeScript and JSX settings for browser application source. |
| `tsconfig.node.json` | TypeScript settings for Node-based project configuration such as `vite.config.ts`. |

### Application entry and shared styles

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Creates the React root, loads global CSS, and renders the application. |
| `src/App.tsx` | Coordinates authentication, shared data, navigation between screens, and app-level actions. |
| `src/index.css` | Imports Tailwind and defines global design tokens and reusable visual styles. |
| `src/api.ts` | Holds commented-out mock card examples; not currently used by the running app. |

### Features

| File | Purpose |
| --- | --- |
| `src/features/landing/LandingPage.tsx` | Public product landing page and entry points to sign-in or registration. |
| `src/features/dashboard/DashboardPage.tsx` | Authenticated learning home, review prompt, quick action, and collection shortcuts. |
| `src/features/collections/CollectionsPage.tsx` | Lists collections and allows the user to open or create one. |
| `src/features/statistics/StatisticsPage.tsx` | Displays review and card-count summary statistics. |

### Existing pages

| File | Purpose |
| --- | --- |
| `src/pages/ProfilePage.tsx` | Account profile, password, and personal learning settings screen. |

### UI components

| File | Purpose |
| --- | --- |
| `src/components/AuthPage.tsx` | Sign-in and account registration form. |
| `src/components/Sidebar.tsx` | Authenticated side navigation and top application header. |
| `src/components/NavItem.tsx` | Reusable navigation item used by the sidebar. |
| `src/components/StatCard.tsx` | Reusable summary metric card used on the statistics screen. |
| `src/components/CardsView.tsx` | Collection/card workspace with study and browse modes. |
| `src/components/CardGrid.tsx` | Renders cards as a grid and supports card selection/actions. |
| `src/components/CollectionStudy.tsx` | Study experience for cards in a selected collection. |
| `src/components/ReviewView.tsx` | Spaced-repetition session for cards due for review. |
| `src/components/AddCardModal.tsx` | Creates a flashcard or edits an existing one. |
| `src/components/AiGeneratorModal.tsx` | Collects input for AI card generation from a prompt or word list. |
| `src/components/GenerationResultModal.tsx` | Summarizes the result of AI card generation. |
| `src/components/CategoryModal.tsx` | Creates a collection and selects its languages. |
| `src/components/EditCategoryModal.tsx` | Edits or removes an existing collection. |
| `src/components/ConfirmationModal.tsx` | Reusable confirmation dialog for actions requiring user approval. |
| `src/components/Modal.tsx` | Shared modal layout and backdrop behavior. |

### Hooks, services, utilities, and types

| File | Purpose |
| --- | --- |
| `src/hooks/useFlashcards.ts` | Loads and coordinates card, collection, browse, and review data for the UI. |
| `src/hooks/useTypingPlaceholder.ts` | Animates placeholder text for prompt inputs. |
| `src/services/authService.ts` | Sign-up, sign-in, current-user lookup, and logout API operations. |
| `src/services/cardService.ts` | Card CRUD, due-card listing, collection browsing, and AI generation API operations. |
| `src/services/categoryService.ts` | Collection listing and CRUD API operations. |
| `src/services/reviewService.ts` | Review submission and review-statistics API operations. |
| `src/services/userService.ts` | Profile and password API operations. |
| `src/lib/httpClient.ts` | Shared HTTP request handling, API errors, JSON helpers, and access-token storage. |
| `src/lib/relativeDate.ts` | Formats a review date as a human-readable relative date. |
| `src/types/flashcards.ts` | Shared types for cards, collections, users, reviews, and AI generation. |
| `src/common/constants/constants.ts` | Shared language, sorting, and card-field constants. |

When adding a first-party source or configuration file, add it to the
appropriate table in this section in the same change. Update the description if
an existing file's responsibility changes materially. Local variables and
functions do not need individual entries unless they define a separately
maintained module or public API.

### Current architecture

`App.tsx` currently owns authentication state, authenticated view selection,
and coordination between data hooks and page components. Newer page-level
features are grouped under `features/`; existing UI and page code is still in
`components/` and `pages/` and can move incrementally as those areas change.
`useFlashcards` loads and mutates card, collection, and review data through the
domain services in `services/`. UI components receive data and callbacks from
the app layer.

The authenticated screen selection is currently local React state rather than
URL-based routing. For a small application this keeps the setup lightweight;
if deep links, browser history, or many nested screens become necessary, adopt
a router before the view state becomes difficult to maintain.

## API integration

`src/lib/httpClient.ts` provides the shared JSON HTTP client and attaches the
stored access token to requests. Domain-specific endpoints and request shapes
are defined in `src/services/`:

- `authService.ts` — sign-up, sign-in, current user, and logout.
- `categoryService.ts` — collection listing and CRUD.
- `cardService.ts` — card CRUD, due cards, collection browsing, and AI generation.
- `reviewService.ts` — review submission and review statistics.
- `userService.ts` — profile and password updates.

The backend is a separate service and must be running for authenticated data
features to work.

## Architecture direction

As the app grows, a **feature-based structure with shared UI and a small app
layer** is a good fit. The first page-level features now live in
`features/collections/`, `features/dashboard/`, `features/landing/`, and
`features/statistics/`. Continue by moving domain-specific components and hooks
alongside their feature pages (for example, cards and authentication). Keep
truly reusable primitives and layout elements in a shared UI area, and keep
application composition, providers, and route configuration in an `app/`
layer when that layer is introduced.

Avoid moving every existing file in one pass. Start when a feature needs a
substantial change, preserve its public imports, and extract shared code only
when multiple features genuinely use it. This limits churn while making new
features easier to locate and maintain.
