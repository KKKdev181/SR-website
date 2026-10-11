# Development Admin (experimental)

This feature exists only on the `development` branch. **Do not merge it into `main` or deploy it to production without an authenticated backend and approval workflow.**

## Open
In GitHub Codespaces, select the `development` branch and run:

```sh
npm install
npm run dev -- --host 0.0.0.0
```

In the forwarded Ports tab, open the app URL and append `/admin` to the pathname (before any `#`).

Example: `https://<codespace-host>-8080.app.github.dev/admin`.

There is deliberately **no visible navigation button** for this page.

## Features
- Create, edit, delete, show and hide request cards
- Reorder request cards with up/down controls
- Export and import catalog drafts as JSON
- Preview changes in the development portal after saving

## Important limitations
- Browser-local draft storage only (`localStorage`), not shared among users or devices.
- No authentication, authorization or audit log yet; hiding the navigation link provides no security.
- Order can be adjusted but the app's existing category classification logic still determines the category from the request's metadata/title; changes to categories need fuller integration.
- Dynamic edits to titles/descriptions are currently English-source edits. Existing Arabic localizations might take precedence for known requests.
- Imports overwrite the local draft upon saving; export a backup before changing data.
- Public Jira links are not rewritten or cloned.
- The /admin path must be supported by the host's SPA fallback/rewrite rules if deployed outside the Vite dev server.

## Before team rollout
Build a secure API and shared catalog database or managed list; integrate company SSO and admin/editor RBAC; track authors, history, drafts, preview and approval; keep production and development storage separate; implement localization editing and validation. Only then enable shared publishing.
