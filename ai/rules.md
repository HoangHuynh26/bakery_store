# AI Development Rules

## Rule 1 - Read Before Coding

Before modifying the project, inspect the existing files.

Do not assume the project structure.

---

## Rule 2 - Follow Existing Architecture

Use the architecture defined in architecture.md.

Do not create a different architecture without a clear reason.

---

## Rule 3 - Frontend Only

This project is frontend-only.

Do not create:

- Backend
- Database
- API
- Authentication
- Payment system
- Admin system

---

## Rule 4 - Minimal Changes

Only change files necessary for the requested task.

Do not rewrite unrelated code.

---

## Rule 5 - No Unnecessary Dependencies

Do not install a package unless it provides meaningful value.

Prefer native React, HTML, and CSS.

---

## Rule 6 - Responsive First

Every component must work on:

- Desktop
- Tablet
- Mobile

---

## Rule 7 - Accessibility

Use semantic HTML.

Images must have meaningful alt attributes.

Buttons and links must be keyboard accessible.

---

## Rule 8 - Performance

Use:

- WebP/AVIF
- Lazy loading for non-critical images
- Appropriate image sizes
- CSS optimization
- Minimal dependencies

Do not lazy-load above-the-fold hero images.

---

## Rule 9 - Code Quality

Write:

- Clean code
- Readable code
- Small components
- Meaningful variable names
- Reusable components

Avoid:

- Duplicate code
- Huge components
- Unnecessary abstractions
- Magic numbers when avoidable

---

## Rule 10 - Do Not Invent Information

If project information is not provided, use clearly marked placeholder content.

Do not invent real:

- Email addresses
- Phone numbers
- Business addresses
- Social media accounts

---

## Rule 11 - Task Scope

Only implement the requirements of the current task.

Do not implement future tasks early.

---

## Rule 12 - Verification

After implementing a task:

1. Check for syntax errors.
2. Check imports.
3. Check responsive behavior.
4. Check navigation.
5. Check console errors.
6. Explain what was changed.

---

## Rule 13 - Preserve Existing Work

Never delete existing functionality unless explicitly requested.

---

## Rule 14 - Git

Do not:

- Force push
- Delete branches
- Reset commits
- Rewrite Git history

unless explicitly requested.

---

## Final Principle

Correctness > Simplicity > Maintainability > Performance > Visual effects.