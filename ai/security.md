# Security Principles

This is a frontend-only landing page.

No sensitive user data should be collected or stored.

## Rules

- Do not hard-code passwords.
- Do not hard-code API keys.
- Do not expose private credentials.
- Do not collect unnecessary personal information.
- Do not store sensitive information in localStorage.
- Do not use unsafe HTML injection.
- Avoid dangerouslySetInnerHTML unless explicitly required.
- Validate external URLs before using them.
- Do not include fake security mechanisms.

## User Information

The final landing page may display public contact information
provided by the project owner.

Only publicly intended information should be displayed.

## Images

Only use images that are appropriate for the project
and have permission to be used.

## Privacy

Do not implement user tracking, session recording, or behavioral analytics
unless explicitly requested.