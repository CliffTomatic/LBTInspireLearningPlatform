# Pulse Quick Start

Pulse is the replacement application for the current LearnWorlds/WordPress course setup. The project is a full-stack learning platform for courses, video learning, sessions, active learning, course completion, section completion, and grant reporting metrics.

## Required Software

Install these before working on the project:

- Git 2.x
- .NET SDK 10.0.x
  - This repo targets `net10.0`.
  - Verified locally with .NET SDK `10.0.203`.
- Node.js `22.14.0` or newer in the Node 22 line
  - Vite 8 requires `^20.19.0 || >=22.12.0`.
  - Verified locally with Node `v22.14.0` and npm `10.9.2`.
- A code editor
  - VS Code is fine for both frontend and backend.
  - Visual Studio also works well for the ASP.NET backend.
- A modern browser such as Edge or Chrome.

Optional but useful:

- DB Browser for SQLite, for inspecting local `.db` files.
- EF Core CLI tools, if you are creating or applying migrations:

```powershell
dotnet tool install --global dotnet-ef --version 10.*
```

## Main Project Versions

Backend:

- ASP.NET Core target framework: `net10.0`
- Entity Framework Core SQLite: `10.0.7`
- Entity Framework Core Design: `10.0.7`
- Microsoft.AspNetCore.OpenApi: `9.0.4`
- Local database provider: SQLite

Frontend:

- React: `19.2.5`
- React DOM: `19.2.5`
- React Router DOM: `7.14.2`
- Vite: `8.0.10`
- TypeScript: `6.0.x`
- ESLint: `10.2.1`
- Prettier: `3.8.3`

## Clone

This checkout has both GitHub and Azure DevOps remotes configured. Ask the project lead which remote the team should use as the source of truth.

Current remotes in this local repo:

```text
github: https://github.com/CliffTomatic/LBTInspireLearningPlatform.git
origin: Azure DevOps DTD Platform Integration Team repo
```

Typical GitHub clone:

```powershell
git clone https://github.com/CliffTomatic/LBTInspireLearningPlatform.git
cd LBTInspireLearningPlatform
```

## Install Dependencies

Install root tooling:

```powershell
npm.cmd install
```

Install frontend dependencies:

```powershell
cd frontend
npm.cmd install
```

Use `npm.cmd` in PowerShell if `npm` fails with a script execution policy error.

## Run The Backend

From the repo root:

```powershell
cd backend\InspireAPI
dotnet restore
dotnet build
dotnet run
```

Default backend URLs:

- HTTP: `http://localhost:5053`
- HTTPS: `https://localhost:7146`

Useful API routes:

- `GET /api/videos`
- `GET /api/videos/{id}`
- `POST /api/sessions/startSession`
- `POST /api/sessions/heartbeat`
- `POST /api/sessions/end`
- `GET /api/admin/sessions`
- `GET /api/admin/summary`

## Run The Frontend

Open a second terminal from the repo root:

```powershell
cd frontend
npm.cmd run dev
```

Vite usually starts at:

```text
http://localhost:5173
```

## Build Checks

Backend:

```powershell
dotnet build backend\InspireAPI\InspireAPI.csproj
```

Frontend:

```powershell
cd frontend
npm.cmd run build
```

Both commands were verified successfully in this local checkout.

## Local Data

The backend currently uses local SQLite data at:

```text
backend\InspireAPI\MockServer\MockData\pulse.db
```

Session JSON data is at:

```text
backend\InspireAPI\MockServer\MockData\sessions.json
```

Those files are currently tracked in this repo, so a fresh clone should receive them. Future generated SQLite files should generally stay out of commits unless the team intentionally updates seed data.

## Contributor Workflow

Before starting work:

```powershell
git pull
```

Create a focused branch:

```powershell
git checkout -b feature/short-description
```

Before opening a pull request:

```powershell
dotnet build backend\InspireAPI\InspireAPI.csproj
cd frontend
npm.cmd run build
```

Keep frontend changes with backend work when they are required to consume backend APIs, replace mocks, or align with backend contracts. Put unrelated UI cleanup or visual polish in a separate frontend-focused branch.

