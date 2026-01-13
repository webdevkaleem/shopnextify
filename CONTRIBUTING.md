# Contributing to Shopnextify

Thank you for your interest in contributing to Shopnextify! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js `^18.20.2` or `>=20.9.0`
- pnpm installed (`npm install -g pnpm`)
- MongoDB (local or Atlas)
- Git

### Setting Up Your Development Environment

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/shopnextify.git
   cd shopnextify
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/shopnextify.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Set up environment variables**

   Copy `.env.example` to `.env` (if it exists) or create a `.env` file with required variables:

6. **Generate types and import map**

   ```bash
   pnpm generate:types
   pnpm generate:importmap
   ```

7. **Start development server**

   ```bash
   pnpm dev
   ```

## 🔄 Development Workflow

### Creating a Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### Making Changes

1. **Make your changes** following the [coding standards](#coding-standards)
2. **Test your changes** locally
3. **Run linting** to ensure code quality:

   ```bash
   pnpm lint
   ```

4. **Run type checking**:

   ```bash
   pnpm tsc --noEmit
   ```

5. **Run tests**:

   ```bash
   pnpm test
   ```

### Keeping Your Branch Updated

Regularly sync your branch with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout your-branch
git merge main
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Use type imports: `import type { ... }`
- Generate types after schema changes: `pnpm generate:types`

### Payload CMS Best Practices

Follow the Payload CMS development rules in `AGENTS.md`:

1. **Security First**
   - Always set `overrideAccess: false` when passing `user` to Local API
   - Always pass `req` to nested operations in hooks
   - Use context flags to prevent infinite hook loops

2. **Type Safety**
   - Run `generate:types` after schema changes
   - Import types from `@/payload-types`
   - Use field type guards for runtime checks

3. **Access Control**
   - Extract access control functions to `src/access/`
   - Document complex access patterns
   - Default to restrictive access

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (unless double quotes are needed)
- Use trailing commas in multi-line objects/arrays
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Organization

- Keep collections in separate files: `src/collections/`
- Extract access control: `src/access/`
- Extract hooks: `src/hooks/`
- Extract utilities: `src/utilities/`
- Components: `src/components/`

### React Components

- Use Server Components by default (no `'use client'` unless needed)
- Only use Client Components for:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`)
  - Event handlers
  - Browser APIs
- Use proper TypeScript types for component props
- Prefer composition over inheritance

### Example: Adding a New Collection

```typescript
// src/collections/YourCollection.ts
import type { CollectionConfig } from 'payload'

export const YourCollection: CollectionConfig = {
  slug: 'your-collection',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Authenticated only
    update: ({ req: { user } }) => user?.roles?.includes('admin'),
    delete: ({ req: { user } }) => user?.roles?.includes('admin'),
  },
}
```

Then add it to `src/payload.config.ts`:

```typescript
import { YourCollection } from '@/collections/YourCollection'

export default buildConfig({
  collections: [Users, Pages, Categories, Media, YourCollection],
  // ...
})
```

Don't forget to run:

```bash
pnpm generate:types
pnpm generate:importmap
```

## ✅ Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(cart): add quantity update functionality

Allow users to update item quantities directly from the cart modal.

Closes #123
```

```
fix(checkout): resolve Stripe webhook validation error

The webhook handler was not properly validating the signature.
Added proper signature verification using Stripe SDK.

Fixes #456
```

```
docs(readme): update installation instructions

Added MongoDB Atlas setup instructions and environment variable examples.
```

### Commit Best Practices

- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Use present tense ("add feature" not "added feature")
- Reference issues/PRs when applicable

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your code works**
   - Test locally
   - Run all tests: `pnpm test`
   - Check linting: `pnpm lint`
   - Verify types: `pnpm tsc --noEmit`

2. **Update documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update CHANGELOG if applicable

3. **Keep PRs focused**
   - One feature/fix per PR
   - Keep changes small and reviewable
   - Split large changes into multiple PRs

### Creating a Pull Request

1. **Push your branch**

   ```bash
   git push origin your-branch-name
   ```

2. **Create PR on GitHub**
   - Use a clear, descriptive title
   - Fill out the PR template
   - Reference related issues
   - Add screenshots for UI changes

3. **PR Description Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Tests pass locally
   - [ ] Added tests for new functionality
   - [ ] Updated existing tests

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Types generated (`pnpm generate:types`)
   - [ ] Import map generated (`pnpm generate:importmap`)
   ```

### Review Process

- Address review comments promptly
- Be open to feedback and suggestions
- Ask questions if something is unclear
- Keep discussions constructive

## 🧪 Testing

### Writing Tests

- Write tests for new features
- Update tests when fixing bugs
- Aim for good test coverage
- Test both success and error cases

### E2E Tests (Playwright)

Located in `tests/e2e/`:

```typescript
import { test, expect } from '@playwright/test'

test('user can add item to cart', async ({ page }) => {
  await page.goto('/')
  // Your test code
})
```

### Integration Tests (Vitest)

Located in `tests/int/`:

```typescript
import { describe, it, expect } from 'vitest'

describe('API endpoint', () => {
  it('should return correct data', async () => {
    // Your test code
  })
})
```

### Running Tests

```bash
# All tests
pnpm test

# E2E only
pnpm test:e2e

# Integration only
pnpm test:int
```

## 📚 Documentation

### Updating README

- Keep installation instructions current
- Update environment variable examples
- Add new features to the features list
- Update links and resources

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, browser (if applicable)
6. **Screenshots**: If applicable
7. **Logs**: Error messages or console output

## 💡 Suggesting Features

When suggesting features:

1. **Use GitHub Issues**: Open an issue first
2. **Describe the Problem**: What problem does this solve?
3. **Propose Solution**: How should it work?
4. **Consider Alternatives**: Are there other approaches?
5. **Provide Examples**: Code examples or mockups if helpful

## 📞 Getting Help

- Check existing issues and PRs
- Review Payload CMS documentation
- Ask in Payload CMS Discord
- Open a discussion on GitHub

## 🙏 Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!

---

**Remember**: Good contributions are not just about code. Documentation, tests, bug reports, and feature suggestions are all valuable contributions!
