# PLEASE NOTE: Public Portfolio Version.

This project is now being tracked on Azure DevOps and is only available to those working on the project. If you would like to see the most up to date version of this project (Active User Tracking, polished frontend UX/UI, working backend API) please contact me at cdurbin@isd.lacounty.gov and schedule a time to meet with me.

This repository _will_ be updated when stable demo versions are ready to share.

**Project Tech Stack:** React, Vite, Node, Recharts Typescript, ASP.NET, C#, EF Core, SQLite (for dev only), ASP.NET Identity.

# Pulse Learning Platform

Pulse is a full-stack learning platform replacing the current LearnWorlds/WordPress course setup. It is being built for Learnbasictech, County of Los Angeles to deliver digital learning courses and track the grant-reporting metrics needed for program outcomes.

The platform currently focuses on course discovery, course details, video learning, ebook-style lesson content, session tracking, and early admin reporting.

## Project Goals

- Provide a modern course learning experience for students.
- Track learning activity that supports grant reporting.
- Measure video learning, active sessions, course progress, section completion, and course completion.
- Move from a limited course-based WordPress/LearnWorlds setup to a custom ASP.NET, React, and cloud-ready application.
- Build a foundation that can later support authentication, persistent learner history, dashboards, and production deployment.

## Tech Stack

Backend:

- ASP.NET Core API targeting `net10.0`
- Entity Framework Core
- SQLite for local development data
- API controllers for videos, learning sessions, and admin summaries

Frontend:

- React
- TypeScript
- Vite
- React Router
- Component-based course, learning, video, and layout UI

Development:

- npm for frontend tooling
- .NET CLI for backend build and run commands
- Local mock/seed data while the database and API contracts are still evolving

## Current Structure

```text
backend/InspireAPI/       ASP.NET Core API, models, services, controllers, migrations, static assets
frontend/                 React app, routes, pages, components, mock course data, public assets
QUICK_START.md            Local setup, install, run, and build instructions
README.md                 Project overview and roadmap
```

## Main App Areas

- Home page
- Courses page
- Course details page
- Learn page
- Video learning panel
- Ebook lesson viewer
- Admin dashboard route
- Backend video API
- Backend session tracking API
- Backend admin summary API

## Completed Tasks

- [x] ~~Created the Pulse project direction as a replacement for LearnWorlds/WordPress.~~
- [x] ~~Set up the ASP.NET Core backend project.~~
- [x] ~~Set up the React/Vite/TypeScript frontend project.~~
- [x] ~~Added local setup and run instructions in `QUICK_START.md`.~~
- [x] ~~Added backend models for videos, sessions, view sessions, and session request payloads.~~
- [x] ~~Added EF Core SQLite configuration and an initial migration.~~
- [x] ~~Added video API routes for listing videos and fetching a video by ID.~~
- [x] ~~Added session API routes for starting sessions, recording heartbeats, and ending sessions.~~
- [x] ~~Added admin API routes for session lists and summary metrics.~~
- [x] ~~Added local session JSON storage while the data layer is still being built out.~~
- [x] ~~Added frontend routing for home, courses, course details, admin, and learn pages.~~
- [x] ~~Created course data models and sample course content.~~
- [x] ~~Created course cards, course grid, course details hero, curriculum, and video carousel components.~~
- [x] ~~Created the learn page layout with sidebar, chapter list, section cards, video player, ebook viewer, and content panel components.~~
- [x] ~~Added initial video and thumbnail assets for local development.~~
- [x] ~~Added build commands for backend and frontend validation in `QUICK_START.md`.~~

## Future Tasks

### Backend And Data

- [ ] Replace mock/static course data with backend-driven course, chapter, and section APIs.
- [ ] Move session tracking from JSON file storage into SQLite through EF Core.
- [ ] Add course progress, section completion, and course completion models.
- [ ] Add active learning rules, such as watched time thresholds and completion criteria.
- [ ] Add learner/user models and prepare the backend for authentication.
- [ ] Add validation and error handling for API request payloads.
- [ ] Add automated backend tests for videos, sessions, progress, and admin summary endpoints.

### Frontend Integration

- [ ] Connect the React course pages to backend APIs instead of local mock course data.
- [ ] Connect the video player to the session start, heartbeat, and end-session API flow.
- [ ] Add loading, empty, and error states for API-backed pages.
- [ ] Persist and display learner progress in the learn page and course curriculum.
- [ ] Replace placeholder admin dashboard content with real reporting UI.
- [ ] Add frontend tests for critical course and learning workflows.

### Grant Reporting

- [ ] Define the exact grant metrics required by the program.
- [ ] Build reporting summaries for video watch time, active sessions, section completion, and course completion.
- [ ] Add filters for reporting by learner, course, date range, and completion status.
- [ ] Export reports to a format usable for grant documentation.
- [ ] Confirm metric definitions with stakeholders before production reporting is finalized.

### Production Readiness

- [ ] Decide the production database and hosting approach.
- [ ] Add environment-based configuration for local, staging, and production.
- [ ] Add authentication and authorization for students, admins, and staff.
- [ ] Add logging and monitoring for backend API activity.
- [ ] Add CI checks for backend build, frontend build, linting, and tests.
- [ ] Prepare cloud deployment infrastructure.
- [ ] Review privacy, accessibility, and data-retention requirements before launch.

## Running Locally

Use [QUICKSTART.md](QUICKSTART.md) for the full setup and run instructions.

Use [CONTRIBUTING.md](CONTRIBUTING.md) for commit, push, and pull request best practices.

Common commands:

```powershell
dotnet build backend\InspireAPI\InspireAPI.csproj
cd frontend
npm.cmd run build
```

## Branching Note

Frontend changes can stay with backend integration work when they are required to consume backend APIs, replace mocks, or align with backend contracts. Unrelated UI cleanup or visual polish should be handled in a separate frontend-focused branch.
