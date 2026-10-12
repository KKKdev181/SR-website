# Private Requests Portal login — development setup

The Requests Portal now has its **own** account system. It does **not** use Microsoft Entra or company SSO.

## Codespaces quick start

Use the `development` branch and pull latest changes. Open **three terminals**.

**Terminal 1 — Create first admin** (one time; enter a strong unique password when prompted):
```bash
npm install
npm run auth:create-user -- "Portal Administrator" portaladmin admin
```
The user details are stored in `private-data/users.json`, outside Git. **Do not upload this file or share passwords.** The bootstrap CLI currently accepts a password from the terminal; ensure nobody can see the screen or terminal history.

**Terminal 2 — Authentication service:**
```bash
npm run auth:server
```

**Terminal 3 — Frontend:**
```bash
npm run dev -- --host 0.0.0.0
```

Open the forwarded port **8080**, then visit `/admin`. Enter `portaladmin` and the password created in Terminal 1.

Additional team members (run in Terminal 1, repeat for each person):
```bash
npm run auth:create-user -- "Team Member" teammember editor
```
An `admin` or `editor` may access the current editor. You must distribute passwords securely. Do not register accounts publicly.

## Security properties in development
- Only server-side hashed passwords (scrypt with random salts), never plaintext in frontend code.
- Session ID stored in an HttpOnly SameSite=Strict cookie; sessions expire after 8 hours and are lost when the backend restarts.
- Login attempt limiting, same-origin check on mutating auth endpoints.
- Anonymous users can browse the public portal but cannot mount `/admin` in the normal app UI.
- The top bar shows the account icon; logged-in editors can access the Admin page and log out.

## Production blockers (IMPORTANT)
**Do not deploy this implementation directly to `td.elm.sa`.** It is a development proof of concept. The private auth service must run on a trusted managed host and be exposed behind HTTPS and a properly configured IIS reverse proxy for `/api/auth`. The React route guard is not an authorization boundary. Before release:

1. Put all editing/publishing behind server-side authenticated APIs and role authorization. Existing edits still use browser localStorage, meaning edits are **not shared** among team members and can be modified without a backend.
2. Implement durable user/session storage, hardened multi-process rate limiting, account provisioning/revocation and password resets, audit logging, regular backups, HTTPS + secure cookies, and security testing.
3. Harden access controls and validate every edit server-side; add draft/approve/publish workflow and rollback. Keep dev/production databases isolated.
4. Configure IIS rewrite for `/admin` and proxy for `/api/auth`; verify host forwarding, SameSite/cookie security, reverse proxy origin checks and token/session expiration.
5. Test abuse scenarios, privilege escalation, unauthorized API writes, password changes, concurrent edits, logout and recovery.

`main` and the live production deployment remain untouched.
