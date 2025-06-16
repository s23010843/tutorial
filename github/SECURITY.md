
# Security Policy

## Overview

We take the security of the Git & GitHub Tutorial PWA seriously. This document outlines our security practices and how to report potential vulnerabilities.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

### Data Protection
- **No User Data Collection**: This application does not collect, store, or transmit any personal user data
- **Local Storage Only**: All progress and preferences are stored locally on the user's device
- **No External Tracking**: No analytics, tracking scripts, or third-party data collection

### Content Security
- **Static Content**: All tutorial content is static HTML/CSS/JavaScript
- **No Server-Side Processing**: No backend servers or databases to compromise
- **HTTPS Only**: Served exclusively over HTTPS when deployed
- **Content Security Policy**: Implemented CSP headers where possible

### PWA Security
- **Service Worker Integrity**: Service worker only caches known, safe resources
- **Manifest Security**: Web app manifest follows security best practices
- **Origin Restrictions**: PWA installation limited to verified origins

## Potential Security Considerations

### Terminal Simulator
- **Client-Side Only**: The interactive terminal is purely educational and runs no actual commands
- **No System Access**: Cannot execute real Git commands or access the file system
- **Sandboxed Environment**: All "commands" are simulated for learning purposes only

### External Links
- **Target="_blank"**: External links open in new tabs with `rel="noopener noreferrer"`
- **Verified Sources**: All external links point to official Git/GitHub documentation
- **No Malicious Content**: All linked resources are verified safe

## Reporting a Vulnerability

If you discover a security vulnerability in this application, please follow these steps:

### Preferred Contact Method
- **Email**: Create an issue in the repository with the label "security"
- **Subject**: "Security Vulnerability Report - Git Tutorial PWA"

### What to Include
Please include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested remediation (if known)
- Your contact information for follow-up

### Response Timeline
- **Initial Response**: Within 48 hours of report
- **Assessment**: Within 1 week
- **Resolution**: Critical issues within 2 weeks, others within 1 month
- **Disclosure**: Coordinated disclosure after fix is deployed

## Security Best Practices for Users

### Installation
- Only install the PWA from the official URL: `s23010843.github.io/tutorial/github`
- Verify the SSL certificate when visiting the site
- Ensure you're on the correct domain before installation

### Usage
- Keep your browser updated for latest security patches
- Clear browser data periodically if desired
- Report any suspicious behavior immediately

### Privacy
- No personal information is required or requested
- All learning progress is stored locally on your device
- Uninstalling the PWA removes all local data

## Scope

This security policy covers:
- The main PWA application files
- Service worker implementation
- PWA manifest and installation process
- All static assets and resources

This policy does NOT cover:
- Third-party dependencies (Git, GitHub)
- User's local Git installations
- External websites linked from the tutorial
- User's GitHub account security

## Security Updates

### Automatic Updates
- The PWA checks for updates when online
- Critical security fixes are deployed immediately
- Users are notified of important updates through the app

### Manual Updates
Users can manually check for updates by:
1. Refreshing the application
2. Checking the browser's PWA update notifications
3. Reinstalling the PWA if needed

## Compliance

### Standards
- Follows OWASP guidelines for web application security
- Implements W3C security recommendations for PWAs
- Adheres to GitHub Pages security requirements

### Privacy Regulations
- GDPR Compliant: No personal data collection
- CCPA Compliant: No personal information sale or sharing
- COPPA Compliant: Safe for users under 13

## Contact Information

For security-related questions or concerns:
- **Repository**: [Issues Section](https://github.com/s23010843/s23010843.github.io/issues)
- **Developer**: S23010843
- **Response Time**: 24-48 hours for security issues

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be:
- Credited in the security acknowledgments (with permission)
- Notified when the issue is resolved
- Invited to verify the fix before public disclosure

---

**Last Updated**: December 2024
**Next Review**: June 2025

> This security policy is reviewed and updated regularly to ensure it remains current with best practices and emerging threats.
