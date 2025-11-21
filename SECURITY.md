# Security Policy

## Supported Versions

Currently, we support the following versions with security updates:

| Version | Supported          | Status      |
| ------- | ------------------ | ----------- |
| 2.0.x   | :white_check_mark: | Current     |
| 1.0.x   | :x:                | Deprecated  |

## Security Updates in v2.0.0

The v2.0.0 release includes critical security updates:

### Updated Components
- **Electron**: Upgraded from v11 (2021) to v33 (2025)
  - 4 years of security patches
  - Fixed multiple CVEs in Chromium and Node.js
  
- **Dependencies**: All 130+ packages updated
  - `lodash`: Security vulnerability patched (4.17.20 → 4.17.21)
  - Removed 150+ vulnerable transitive dependencies
  - Updated all packages with known CVEs

### Remaining Security Tasks

⚠️ **Known Security Considerations:**

1. **Context Isolation**: Currently disabled for compatibility
   - Status: `contextIsolation: false`
   - Planned: Will be enabled in v2.1.0
   - Impact: Medium risk in untrusted content scenarios

2. **Node Integration**: Enabled in renderer processes
   - Status: `nodeIntegration: true`
   - Planned: Will migrate to preload scripts in v2.1.0
   - Impact: Medium risk if loading external content

3. **Remote Module**: Properly disabled
   - Status: `enableRemoteModule: false` ✅
   - Impact: Low risk

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly (add contact email here)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Fix Timeline**: Depends on severity
  - Critical: Within 1 week
  - High: Within 2 weeks
  - Medium: Within 1 month
  - Low: Next release cycle

## Security Best Practices

### For Deployment

1. **Keep Updated**: Always run the latest version
2. **Network Security**: Deploy behind a firewall if networked
3. **Access Control**: Implement user authentication (coming in v2.1.0)
4. **Data Encryption**: Sensitive data should be encrypted at rest
5. **Regular Audits**: Run `npm audit` regularly

### For Development

1. **Dependency Audits**: Run `npm audit` before releases
2. **Code Review**: All changes should be reviewed
3. **Testing**: Test security features thoroughly
4. **Secure Coding**: Follow OWASP guidelines

## Vulnerability Disclosure Policy

We follow responsible disclosure practices:

1. Reporter notifies maintainers privately
2. Maintainers confirm and assess the vulnerability
3. Fix is developed and tested
4. Security advisory is published
5. Patch is released
6. Public disclosure after patch is available

## Security Checklist for Contributors

Before submitting code:

- [ ] No hardcoded credentials or secrets
- [ ] Input validation for user-supplied data
- [ ] Proper error handling (no sensitive data in errors)
- [ ] Dependencies are up to date
- [ ] No use of deprecated APIs
- [ ] XSS prevention in any HTML rendering
- [ ] SQL injection prevention (when database is added)
- [ ] Proper authentication checks (when auth is added)

## Additional Resources

- [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

Last Updated: November 21, 2025
