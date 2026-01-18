# Sea Glass Venue

A production-quality static website for a fictional coastal wedding venue in Pawleys Island, SC.

**Tagline:** _Where the coast becomes the moment._

---

## Quick Start

1. Open `index.html` in any modern web browser
2. No build step required — pure HTML, CSS, and JavaScript

---

## Folder Structure

```
sea-glass-venue/
├── index.html          # Homepage
├── gallery.html        # Photo gallery with lightbox
├── details.html        # Venue information & FAQs
├── inquiry.html        # Contact/inquiry form
├── css/
│   └── styles.css      # Complete design system & styles
├── js/
│   ├── main.js         # Navigation, reveals, form validation
│   └── gallery.js      # Lightbox functionality
├── assets/             # Images (see below)
└── README.md           # This file
```

---

## Required Images

Place the following images in the `/assets/` folder:

### Homepage

- `hero.jpg` — Full-screen hero (coastal scene, 1920×1080 or larger)
- `experience-ceremony.jpg` — Ceremony moment (3:4 ratio)
- `experience-reception.jpg` — Reception moment (3:4 ratio)
- `experience-sunset.jpg` — Sunset moment (3:4 ratio)
- `experience-evening.jpg` — Evening moment (3:4 ratio)
- `space-1.jpg` through `space-6.jpg` — Editorial venue shots (4:3 ratio)

### Gallery Page

- `gallery-hero.jpg` — Page header image (1920×800)
- `gallery-1.jpg` through `gallery-12.jpg` — Gallery images (mixed ratios work)

### Interior Pages

- `details-hero.jpg` — Details page header
- `inquiry-hero.jpg` — Inquiry page header

### Brand

- `favicon.svg` — SVG favicon (optional)

### Image Guidelines

- **Format:** JPEG or WebP for photos
- **Quality:** 80–85% compression for web
- **Dimensions:**
  - Heroes: 1920px wide minimum
  - Gallery: 1200px wide recommended
  - Thumbnails: 600px wide minimum
- **Aspect ratios:** Maintain consistency for grid layouts

---

## Design System

All design tokens are defined as CSS custom properties in `styles.css`:

### Colors

```css
--color-bg: #faf8f5; /* Warm off-white */
--color-text: #2c2c2c; /* Charcoal */
--color-accent: #7d9a8c; /* Muted sage */
--color-gold: #c4a35a; /* Subtle gold detail */
```

### Typography

- **Headlines:** Cormorant Garamond (serif)
- **Body:** Inter (sans-serif)
- Fluid typography using `clamp()`

### Spacing

8-point scale: `--space-xs` through `--space-6xl`

---

## Features

### Accessibility

- Semantic HTML5 structure
- Skip link to main content
- Proper heading hierarchy
- ARIA labels and roles
- Focus-visible states
- Reduced motion support (`prefers-reduced-motion`)
- Keyboard navigation for lightbox

### Performance

- Lazy-loaded images (`loading="lazy"`)
- Preconnected Google Fonts
- Minimal JavaScript (no frameworks)
- CSS animations respect reduced motion

### Functionality

- Sticky navigation with scroll state
- Responsive mobile menu
- Scroll reveal animations
- Gallery lightbox with keyboard/touch support
- Form validation (client-side only)

---

## Customization

### Changing Colors

Edit the CSS custom properties at the top of `styles.css`:

```css
:root {
  --color-accent: #7d9a8c; /* Change to your accent color */
  --color-gold: #c4a35a; /* Change to your detail color */
}
```

### Changing Fonts

1. Update the Google Fonts `<link>` in each HTML file
2. Update `--font-serif` and `--font-sans` in `styles.css`

### Adding Pages

1. Copy an existing HTML file as a template
2. Update the navigation's `aria-current="page"` attribute
3. Add the `.is-active` class to the correct nav link

### Form Backend

The inquiry form is front-end only. To add backend functionality:

1. Update the `<form>` action attribute
2. Or integrate with a service like Formspree, Netlify Forms, etc.

---

## Browser Support

Tested and working in:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses modern CSS features:

- CSS Custom Properties
- CSS Grid & Flexbox
- `clamp()` for fluid typography
- `aspect-ratio`
- `backdrop-filter`

---

## Deployment

This is a static site with no build step. Deploy to any static hosting:

1. **Netlify/Vercel:** Drag and drop the folder
2. **GitHub Pages:** Push to a GitHub repo and enable Pages
3. **Traditional hosting:** Upload via FTP

### Recommended Headers (if configurable)

```
Cache-Control: public, max-age=31536000 (for assets)
Content-Security-Policy: default-src 'self'; font-src fonts.gstatic.com
```

---

## Credits

- **Typography:** [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Icons:** Custom SVG inline icons

---

## License

This is a fictional venue created for demonstration purposes. All code is free to use and modify.
