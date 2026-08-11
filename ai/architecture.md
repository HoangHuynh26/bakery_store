## Architecture Type
Frontend-only single-page application.

The project should follow a simple component-based React architecture.

## Suggested Structure

src/
├── assets/
│   ├── images/
│   └── icons/
│
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── About/
│   ├── Products/
│   ├── CTA/
│   ├── Contact/
│   └── Footer/
│
├── pages/
│   └── LandingPage.jsx
│
├── styles/
│   └── global.css
│
├── App.jsx
└── main.jsx

## Principles

### Component-Based

Each major section should be a separate React component.

Do not create one huge LandingPage component.

### Single Responsibility

Each component should have one clear responsibility.

Example:

Navbar → navigation only

Hero → introduction and primary CTA

Products → product presentation

Contact → contact information

Footer → final page information

### Reusability

Reusable UI elements should be implemented as reusable components.

### Simplicity

Do not over-engineer the landing page.

Avoid unnecessary:

- State management
- Context
- Redux
- API layers
- Custom hooks
- Complex abstractions

unless they are actually required.