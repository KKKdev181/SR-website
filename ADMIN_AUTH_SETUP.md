# Team login setup (Development only)

## Current functionality
- User icon/account dropdown in the portal top bar.
- Microsoft Entra ID interactive sign-in and sign-out using MSAL Browser.
- /admin requires an authenticated account with an Entra **app role** named exactly `RequestsPortal.Admin` or `RequestsPortal.Editor` in the ID token.
- Unconfigured environments fail closed at /admin. There is no demo password or locally forged admin login.
- Public Requests Portal remains accessible anonymously.

## Microsoft Entra setup (your IT / identity team must perform this)
1. Register a **single-tenant SPA** application in your company's Microsoft Entra tenant. Record Directory (tenant) ID and Application (client) ID.
2. Under Authentication, add SPA redirect URI `http://localhost:8080/` for local testing **and your exact Codespaces forwarded HTTPS origin with a trailing slash**, then later `https://td.elm.sa/` only after production approval. Enable necessary organizational account sign-in. Never add a client secret to the frontend.
3. Define app roles `RequestsPortal.Admin` and `RequestsPortal.Editor` for Users/Groups, then assign explicitly authorized teammates via Enterprise applications > Users and groups. Restrict general user assignment if appropriate. Verify the resulting ID token contains the roles claim.
4. Create `.env.local` from `.env.example` in Codespace and set both values. Restart Vite (Ctrl+C, then `npm install && npm run dev -- --host 0.0.0.0`). Vite browser code uses public IDs only; do not commit secrets.
5. Test /admin without login (should show login), with a non-editor employee (access denied), and assigned editor (admin visible). Test logout and token expiration; verify origin is approved. Browser popup blockers may require allowing popups.

## Critical production requirements — NOT completed
**Do NOT publish this static frontend as a secure production admin.** The /admin React component protection is *client-side only* and does not secure server APIs or files. The entire request editor still uses localStorage; team edits do not sync. Before going live, create a server-side API and shared persistent storage (e.g. approved SQL/managed storage), verify Entra access tokens on **every write/read of privileged data**, check editor/admin role and permitted tenant on the server, prevent public write access, and provide CSRF/CORS/session protection appropriate to the chosen architecture. Implement draft/publish approvals, audit history, backups, rollback, schema validation, and separate development vs production data. Enforce /admin rewrite in IIS while preserving existing hash routes and static assets.

Production release must be an explicit reviewed/approved deployment from development to main and must not occur simply by opening the login page. SSO alone does not turn localStorage into shared content management.
