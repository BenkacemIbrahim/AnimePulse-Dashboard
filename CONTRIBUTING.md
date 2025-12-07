# Contributing to AnimePulse Dashboard

First off, thank you for considering contributing to AnimePulse Dashboard! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

- **Be respectful** - Treat everyone with respect and kindness
- **Be collaborative** - Work together and help each other
- **Be constructive** - Provide helpful feedback
- **Be inclusive** - Welcome newcomers and diverse perspectives

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)

**Bug Report Template:**

```markdown
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Environment:**
- OS: [e.g., Windows 11]
- Node Version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Screenshots:**
If applicable, add screenshots.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - Why is this enhancement useful?
- **Proposed solution** - How should it work?
- **Alternatives considered** - What other approaches did you think about?

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Documentation improvements

---

## Development Setup

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MySQL (v8.0 or higher)
- Git

### Setup Steps

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/animepulse-dashboard.git
   cd animepulse-dashboard
   ```

3. **Set up the database**
   ```bash
   mysql -u root -p < server/setup.sql
   ```

4. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Coding Standards

### JavaScript Style Guide

- Use **ES6+** features
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **UPPER_SNAKE_CASE** for constants
- **2 spaces** for indentation
- **Semicolons** are required
- Use **async/await** over promises when possible

### Code Examples

**Good:**
```javascript
const getUserById = async (userId) => {
  try {
    const [rows] = await query('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};
```

**Bad:**
```javascript
function get_user(id) {
  return query('SELECT * FROM users WHERE id = ?', [id])
    .then(rows => rows[0])
    .catch(err => console.log(err));
}
```

### File Organization

- **Routes** - One file per resource (e.g., `posts.js`, `categories.js`)
- **Middleware** - Separate files for different concerns
- **Utilities** - Helper functions in dedicated files
- **Keep files focused** - Single responsibility principle

### Comments

- Write **self-documenting code** when possible
- Add comments for **complex logic**
- Use **JSDoc** for function documentation

```javascript
/**
 * Fetches analytics summary including counts and time series data
 * @returns {Promise<Object>} Analytics data with counts and timeseries
 */
const getAnalyticsSummary = async () => {
  // Implementation
};
```

### Error Handling

- Always use **try-catch** for async operations
- Return **meaningful error messages**
- Log errors with **context**

```javascript
try {
  const result = await someOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}
```

---

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(posts): add pagination support

Add pagination to posts endpoint with limit and offset parameters.
Includes tests and documentation updates.

Closes #123
```

```bash
fix(auth): resolve token expiration issue

Fixed bug where tokens were expiring prematurely due to incorrect
timestamp calculation.

Fixes #456
```

```bash
docs(readme): update installation instructions

Added more detailed steps for database setup and troubleshooting
common issues.
```

### Best Practices

- Use **present tense** ("add feature" not "added feature")
- Use **imperative mood** ("move cursor to..." not "moves cursor to...")
- Keep first line **under 72 characters**
- Reference issues and pull requests when applicable

---

## Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow coding standards**
4. **Write meaningful commit messages**
5. **Ensure no merge conflicts**

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No new warnings or errors
- [ ] Tests added/updated (if applicable)
- [ ] All tests passing
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #(issue number)
```

### Review Process

1. **Submit PR** with clear description
2. **Wait for review** from maintainers
3. **Address feedback** promptly
4. **Make requested changes**
5. **Get approval** from at least one maintainer
6. **Merge** will be done by maintainers

### After Your PR is Merged

- **Delete your branch** (if not needed)
- **Update your fork** with the latest changes
- **Celebrate!** 🎉 You've contributed to the project!

---

## Additional Notes

### Issue and PR Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on

### Getting Help

If you need help:
- Check the [README](README.md)
- Read the [API Documentation](API_DOCUMENTATION.md)
- Open a discussion on GitHub
- Ask in existing issues

---

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page

Thank you for contributing! 🙏

---

**Questions?** Feel free to open an issue or reach out to the maintainers.
