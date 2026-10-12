# Password-only admin access (Development)

The Requests Portal now supports one shared access password for `/admin`. No user registration, email, or username field is required.

## Setup

The password belongs to the existing, pre-created `portaladmin` record in the protected `private-data/users.json` file. If you already created this account, **use its existing password**. Do not recreate it.

Run these in separate Codespaces terminals:

```bash
# First, update the development branch
git pull origin development
npm install
```

```bash
# Terminal 1 — backend
npm run auth:server
```

```bash
# Terminal 2 — website
npm run dev -- --host 0.0.0.0
```

Open the forwarded port 8080 URL with `/admin` at the end. Enter only the shared password created for the original `portaladmin` account. No username or registration is needed. Keep port 8787 private; only use the 8080 website URL.

If no `portaladmin` record exists yet, provision it **once** from an interactive terminal:

```bash
npm run auth:create-user -- "Portal Administrator" portaladmin admin
```

It will prompt privately for a unique 12+ character password. Do not post the password in chat, GitHub, or screenshots. Store it in your team's approved password manager.

## Security and production limitations

- Sharing one password means **anyone possessing it can edit**, and individual edits cannot be reliably attributed to a teammate.
- Rotating or revoking access requires changing the shared password and invalidating existing sessions. An account compromise affects the whole team.
- The HTTP-only browser cookie and server-side password hash are preferable to storing a password in the frontend, but **this is not production ready**. The login route is guarded in React; actual edit data is still stored in localStorage and cannot be securely enforced or shared without a backend.
- Before publishing to `td.elm.sa`, implement server-side authorization on every mutation, shared database storage, audit log, HTTPS, persistent secure session storage, account/password rotation, protection against CSRF, and deployment/rollback controls. Do not expose port 8787 publicly.
- The live `main` branch has not been changed.
