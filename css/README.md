# CSS Architecture - User Agent Changer Extension

This document explains the CSS architecture, theme system, and BEM methodology implementation.

## Files Structure

```
css/
├── theme.css     # CSS Variables and Design Tokens
├── popup.css     # Popup styles with BEM methodology
├── options.css   # Options page styles with BEM methodology
└── README.md     # This file
```

## Theme System (theme.css)

The `theme.css` file contains all design tokens as CSS custom properties (variables). This centralized approach makes it easy to:

- Create consistent designs across all pages
- Quickly modify the entire theme
- Support dark mode and other theme variants
- Maintain design system standards

### Variable Categories

#### Colors
- **Primary Colors**: Main brand colors (blue theme)
- **Status Colors**: Success, danger, warning, info
- **Background Colors**: Various background shades
- **Text Colors**: Text hierarchy colors
- **Border Colors**: Border variations

#### Spacing
- Consistent spacing scale from `--spacing-xs` (4px) to `--spacing-5xl` (48px)

#### Typography
- **Font Sizes**: From `--font-size-xs` to `--font-size-7xl`
- **Font Weights**: normal, medium, semibold, bold
- **Line Heights**: tight, normal, relaxed, loose
- **Font Families**: base and monospace

#### Other Tokens
- Border radius values
- Box shadows
- Transitions
- Z-index levels
- Component-specific values

### Using Theme Variables

```css
/* Example usage */
.my-component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}
```

## BEM Methodology

BEM (Block Element Modifier) is used for consistent, maintainable CSS naming.

### Naming Convention

```
.block {}                    /* Component */
.block__element {}           /* Part of component */
.block--modifier {}          /* Variant of component */
.block__element--modifier {} /* Variant of element */
```

### Examples in Our Codebase

#### Popup.css
```css
/* Block */
.ua-item {}

/* Elements */
.ua-item__info {}
.ua-item__name {}
.ua-item__preview {}
.ua-item__badge {}

/* Modifiers */
.ua-item--active {}
.ua-item--special {}
```

#### Options.css
```css
/* Block */
.user-agent-card {}

/* Elements */
.ua-card-header {}
.ua-card-title {}
.ua-card-content {}
.ua-card-actions {}

/* Modifiers */
.user-agent-card:hover {}
```

### Button Component Example

```css
/* Block */
.btn {}

/* Modifiers */
.btn--primary {}
.btn--danger {}
.btn--secondary {}
.btn--link {}

/* Element */
.btn__icon {}
```

## Creating Custom Themes

### Step 1: Duplicate theme.css
Create a new file like `theme-dark.css` or `theme-custom.css`

### Step 2: Modify Color Variables
```css
:root {
  --color-primary: #your-color;
  --color-bg-primary: #your-bg;
  /* ... modify other colors */
}
```

### Step 3: Import Custom Theme
In your HTML or main CSS file:
```css
@import 'theme-dark.css';
```

## Dark Theme Support

The `theme.css` file includes a commented-out dark theme example:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme variables */
  }
}
```

To enable it:
1. Uncomment the dark theme block in `theme.css`
2. Adjust colors as needed
3. The theme will automatically activate based on system preference

## Best Practices

### 1. Always Use Theme Variables
❌ **Don't do this:**
```css
.component {
  color: #333;
  padding: 16px;
}
```

✅ **Do this:**
```css
.component {
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
}
```

### 2. Follow BEM Naming
❌ **Don't do this:**
```css
.card .title {}
.card-active {}
```

✅ **Do this:**
```css
.card__title {}
.card--active {}
```

### 3. Keep Selectors Flat
❌ **Don't do this:**
```css
.card .header .title .icon {}
```

✅ **Do this:**
```css
.card__header-title-icon {}
/* or separate components */
.card-header__title-icon {}
```

### 4. Use Utility Classes Sparingly
Utility classes are provided for common patterns:
```css
.hidden
.text-center
.text-muted
.mt-1, .mt-2
.mb-1, .mb-2
```

## Responsive Design

Media queries are included for responsive layouts:
```css
@media (max-width: 1024px) {
  /* Tablet styles */
}

@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Migration Notes

### Current Status
The CSS has been refactored to use:
- ✅ CSS variables from theme.css
- ✅ BEM naming conventions
- ✅ Consistent spacing and typography
- ✅ Modular component structure

### HTML Updates Needed
Some HTML class names may need to be updated to fully match the new BEM structure. When updating:

1. Replace old class names with BEM equivalents
2. Update JavaScript selectors if needed
3. Test all functionality after changes

### Example Migration
```html
<!-- Before -->
<div class="user-agent active">
  <div class="name">iPhone</div>
  <span class="badge">iOS</span>
</div>

<!-- After -->
<div class="ua-item ua-item--active">
  <div class="ua-item__name">iPhone</div>
  <span class="ua-item__badge">iOS</span>
</div>
```

## Maintenance

### Adding New Components
1. Define component in appropriate CSS file
2. Use theme variables for all values
3. Follow BEM naming convention
4. Add documentation if complex

### Modifying Theme
1. Update variables in `theme.css`
2. Changes apply globally automatically
3. Test in both popup and options pages

### Adding New Colors
1. Add to theme.css with descriptive name
2. Consider light/dark variants
3. Document usage purpose

## Resources

- [BEM Methodology](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens](https://css-tricks.com/what-are-design-tokens/)

---

**Last Updated**: December 2024
**Maintained by**: @Trystan4861
