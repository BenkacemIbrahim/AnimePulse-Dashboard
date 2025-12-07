# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of AnimePulse Dashboard seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:
1. **Email us directly** at: benkacem.ibrahim.dev@gmail.com 
2. **Provide detailed information** including:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect:
- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: 90+ days

## Security Best Practices

### For Users

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique values for `JWT_SECRET`
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Limit database user permissions
   - Keep MySQL updated

3. **Production Deployment**
   - Use HTTPS in production
   - Set `NODE_ENV=production`
   - Configure CORS properly
   - Implement rate limiting
   - Enable security headers

4. **Dependencies**
   - Regularly update dependencies
   - Run `npm audit` to check for vulnerabilities
   - Use `npm audit fix` to automatically fix issues

### For Developers

1. **Code Security**
   - Always use parameterized queries (prevent SQL injection)
   - Validate and sanitize user input
   - Use bcrypt for password hashing
   - Implement proper error handling
   - Don't expose sensitive information in error messages

2. **Authentication**
   - Use strong JWT secrets
   - Implement token expiration
   - Validate tokens on every protected route
   - Use HTTPS for token transmission

3. **API Security**
   - Implement rate limiting
   - Use CORS appropriately
   - Validate request bodies
   - Implement proper authorization checks

## Known Security Considerations

### Current Implementation

1. **Password Storage**: Uses bcryptjs for secure password hashing
2. **SQL Injection**: Prevented through parameterized queries
3. **Authentication**: JWT-based with token verification
4. **CORS**: Configurable via environment variables

### Recommended Enhancements

1. **Rate Limiting**: Not currently implemented
2. **Input Validation**: Could be more comprehensive
3. **HTTPS**: Should be enforced in production
4. **Security Headers**: Should add helmet.js
5. **CSRF Protection**: Not currently implemented
6. **Session Management**: Token refresh mechanism recommended

## Security Updates

Security updates will be released as patch versions and documented in the [CHANGELOG](CHANGELOG.md).

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities (with their permission).

---

**Last Updated**: December 2025
