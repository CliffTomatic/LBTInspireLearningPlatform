# Contributing Guidelines

## Table of Contents
- [Basic Procedure](#basic-procedure)
- [Branching Strategy](#branching-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pushing Changes](#pushing-changes)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)

## Basic Procedure

1. Pull from main branch
2. Create a new branch for your future changes
3. Make your changes following the guidelines below
4. Commit your changes with descriptive messages
5. Push your branch to the remote repository
6. Create a pull request for review

### Command Examples

```bash
# 1) Pull latest changes from main
git checkout main
git pull origin main

# 2) Create and switch to a feature branch
git checkout -b feature/add-session-heartbeat

# 3) Make changes, then stage files
git add .

# 4) Commit with a descriptive message
git commit -m "feat(heartbeatRequest): add session heartbeat endpoint"

# 5) Push your branch
git push -u origin feature/add-session-heartbeat
```

## Branching Strategy

### Branch Naming Conventions

Use the following naming patterns for branches:
- **Feature branches**: `feature/description-of-feature`
  - Example: `feature/add-video-upload-functionality`
- **Fix branches**: `fix/description-of-fix`
  - Example: `fix/fix-session-timeout-issue`
- **Documentation branches**: `docs/description`
  - Example: `docs/add-api-documentation`

### Branch Commands

```bash
# Create and switch to branch
git checkout -b feature/short-description

# See your current branch
git branch --show-current

# List all local branches
git branch
```

## Commit Guidelines

### Commit Message Format

Use descriptive commit messages following this format:

```
<type>(<scope>): <subject>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process, dependencies, or other non-code changes

### Examples

Good commit messages:
```
feat(heartbeatRequest): add session heartbeat endpoint
```

```
docs(api): update API documentation for authentication endpoints
```

### Commit Commands

```bash
# Stage all changes
git add .

# Or stage specific files
git add backend/InspireAPI/Controllers/SessionsController.cs
git add frontend/src/pages/HomePage.tsx

# Commit
git commit -m "fix(video-player): correct controls alignment on mobile"

# View recent commits
git log --oneline -n 5
```

### Commit Best Practices

- Make commits small and focused on a single concern
- Commit frequently but only when code is in a stable state
- Write commit messages in the imperative mood ("add feature" not "added feature")
- Reference issue numbers when applicable (e.g., "Closes #123")

## Pushing Changes

### Before Pushing

1. Pull the latest changes from the remote branch to avoid conflicts:
   ```
   git pull origin <branch-name>
   ```
2. Resolve any merge conflicts locally before pushing

### Push Command

```bash
git push origin <branch-name>
```

### Additional Push Commands

```bash
# First push for a new branch (sets upstream)
git push -u origin feature/add-video-upload-functionality

# Later pushes on same branch
git push
```

## Pull Request Process

### Creating a Pull Request

1. **PR Title**: Use a descriptive title following the same format as commit messages
3. **PR Description**: Complete the PR template with:
   - A clear description of the changes
   - Motivation and context for the changes
   - Type of change (feature, bug fix, breaking change, etc.)
   - Related issues (e.g., "Closes #123")
   - Testing instructions (if applicable)
   - Screenshots (if applicable)

### PR Preparation Commands

```bash
# Make sure your branch is up-to-date with main
git fetch origin
git checkout feature/add-session-heartbeat
git rebase origin/main

# Push rebased branch
git push --force-with-lease
```

### PR Template Example

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing Instructions (if applicable)
1. Step 1
2. Step 2
3. Verify expected behavior

## Screenshots (if applicable)
Attach screenshots here
```

### Merging

- Use **Squash and Merge** for feature branches to keep history clean
- Use **Create a Merge Commit** for release branches to maintain history
- Delete the branch after merging

## Code Standards

### General Rules

- Follow the project's existing code style and conventions
- Keep lines reasonably short (aim for < 100 characters)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions/methods focused and reasonably sized
