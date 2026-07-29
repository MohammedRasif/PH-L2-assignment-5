# Application Folder Structure & Routing Explanation

This document explains the file structure set up in this repository to achieve a global layout with shared `Navbar` and `Footer` while supporting dynamic route structures under the Next.js App Router guidelines.

---

## 📁 Directory Structure Overview

Here is a visual map of the routing and layout files configured in this project:

```text
assignment/
├── app/
│   ├── (publicGroup)/              <-- Route Group (Doesn't affect URL path)
│   │   ├── _components/            <-- Components specific to the public pages
│   │   │   └── Hero.tsx
│   │   ├── layout.tsx              <-- Nested layout wrapper for public routes
│   │   ├── error.tsx               <-- Error boundary for public routes
│   │   ├── loading.tsx             <-- Loading UI for public routes
│   │   └── page.tsx                <-- Landing page (corresponds to `/`)
│   │
│   ├── components/                 <-- Shared components used across all pages
│   │   └── shared/
│   │       ├── navbar.tsx          <-- Global Navigation Bar component
│   │       └── footer.tsx          <-- Global Footer component
│   │
│   ├── globals.css                 <-- Global stylesheet and Tailwind directives
│   └── layout.tsx                  <-- Root Layout (Required: holds <html> & <body>)
└── structure_explanation.md        <-- This explanation file
```

---

## 🛠 How Layouts and Pages Work

### 1. The Root Layout (`app/layout.tsx`)
In Next.js, the root layout is defined at `app/layout.tsx`. It:
* Defines the `<html>` and `<body>` tags.
* Configures metadata and fonts (like `Geist`).
* **Crucially**, embeds the `<Navbar />` at the top and the `<Footer />` at the bottom, wrapping the `{children}`.
* Since this layout is at the root, **every route page** rendered in the application will automatically inherit this structure.

### 2. Route Groups (`app/(publicGroup)`)
* By wrapping a folder name in parentheses (e.g., `(publicGroup)`), we create a **Route Group**.
* Next.js does not include the folder name in the final URL path. Therefore:
  * `app/(publicGroup)/page.tsx` maps to the URL `/` (the main landing/homepage).
  * `app/(publicGroup)/about/page.tsx` (if created) would map to `/about`.
* Having `app/(publicGroup)/page.tsx` and a root `app/page.tsx` at the same time is not allowed because it causes a duplicate route conflict for `/`. To resolve this, the duplicate `app/page.tsx` has been deleted.

### 3. Nested Layouts (`app/(publicGroup)/layout.tsx`)
* A nested layout wraps the pages within its folder.
* **Important Next.js Convention**: Nested layouts must **NOT** contain `<html>` or `<body>` tags, as these are already defined in the root layout.
* We have updated `app/(publicGroup)/layout.tsx` to be a clean component wrapper without any duplicate HTML structures or broken imports.

### 4. Navigating to Other Routes (e.g., `/about` or `/dashboard`)
* When navigating to another route, Next.js swaps out only the content inside the `{children}` prop of the root layout.
* The root `Navbar` and `Footer` remain mounted, preventing unnecessary rerendering and ensuring they are visible across different pages, while the middle layout swaps dynamically.
