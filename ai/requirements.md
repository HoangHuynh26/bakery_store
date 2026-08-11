## Functional Requirements

### R1 - Navbar

The landing page must have a navigation bar containing:

- Logo
- Home
- About
- Products
- Show the number of sales
- Appraise by customer
- Contact
- Primary CTA

Navbar must allow users to navigate to sections of the same page.

Use smooth scrolling.

---

### R2 - Logo

The logo must represent the bakery brand.

The logo should:

- Be clearly visible
- Link back to the home of page
- Work correctly on desktop, mobile and tablet

---

### R3 - Hero/Header

The hero section must contain:

- Main heading
- Short description
- Bakery image
- Primary CTA
- Secondary CTA if appropriate

The hero must immediately communicate:

1. What the bakery is
2. What it offers
3. What the user should do next

---

### R4 - Content

The page must contain:

- About section
- Featured products
- Bakery highlights
- Contact information

Content should be short and easy to scan.

---

### R5 - CTA

The landing page must contain clear CTA buttons.

Examples:

- Explore Our Bakery
- View Products
- Contact Me
- Get in Touch

CTA should be visually noticeable.

---

### R6 - Lazy Loading

Images that are below the initial viewport should use lazy loading.

Example:

```html
<img loading="lazy" />

### R7 - Scroll Navigation

Navigation links should smoothly scroll to their corresponding sections.

Example:

Navbar:
- Home → Hero
- About → About
- Products → Products
- Contact → Contact

### R8 - Final Section

The page must end with a farewell/contact section.

Example:

"Thank you for visiting my bakery."

The section should contain:
- Short farewell message
- Email
- Address
- About Me
- Contact CTA

### R9 - Responsive Design

The page must work on:
- Desktop
- Tablet
- Mobile

No horizontal scrolling should appear.

### R10 - Accessibility

Use:
- Semantic HTML
- Meaningful alt text
- Proper heading hierarchy
- Keyboard-accessible buttons and links
- Sufficient text contrast

# Landing Page Experience

The landing page is a long-form scrolling experience.

The page should progressively reveal information instead of
displaying all important information at once.

The user journey should follow:

Attention
↓
Interest
↓
Products
↓
CTA
↓
Trust
↓
Customer Reviews
↓
Social Proof
↓
CTA
↓
Contact
↓
Farewell

Every major section should have a clear purpose.

CTA placement should feel natural and should not appear
after every small section.

The page should guide the visitor toward conversion
without feeling aggressive or repetitive.