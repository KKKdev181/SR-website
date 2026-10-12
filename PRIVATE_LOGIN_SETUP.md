# Shared portal editor setup — DEVELOPMENT ONLY

The /admin editor now uses individual accounts and a shared JSON content store with immediate publishing and an audit history. Self-registration, email, and approval flows are not required.

## Start

In GitHub Codespaces, pull the development branch and start both services with one command:

```bash
git switch development
git pull origin development
npm install
npm run dev
```

Open Port 8080 with /admin appended. Port 8787 is the localhost-only API and should remain **Private**. `npm run dev` launches both API and Vite; **do not** start a second API manually.

### Existing administrator

The previous `portaladmin` account remains in `private-data/users.json`. Log in with:

- Username: `portaladmin`
- Password: the password you previously created.

The individual-account version requires both fields. If the account has not been created yet, provision it from an **interactive** Codespaces terminal:

```bash
npm run auth:create-user -- "Portal Administrator" portaladmin admin
```

### Add a teammate

Only someone with Codespaces/server access can provision accounts. Each editor gets a separate username and private password; there is **no registration page**:

```bash
npm run auth:create-user -- "Team Member Name" teammate1 editor
```

This prompts privately for a 12+ character password (twice). Do **not** paste passwords in chat, screenshots, repositories, or terminal command arguments. Repeat with a unique username for each editor. The password is stored as a salted scrypt hash in `private-data/users.json`.

## Publishing and change history

1. Open /admin and log in with an individual account.
2. Edit Cards, Sidebar, Top Bar / Header, or New Product/Project Guide.
3. Click the relevant Save/Publish button. The API verifies an active editor account, stores the entire changed section centrally, then records username, display name, timestamp, old values and new values in **Change History**.
4. All browsers using the **same development backend** get the new content on refresh, on focus, or within approximately 30 seconds while the page is open.
5. If the API rejects a conflicting save, refresh and review the latest data before reapplying your edit. There is no approval step.

Content is stored in `private-data/content.json` and accounts in `private-data/users.json`. These files are excluded from Git and must be protected, backed up and hosted on persistent storage for any team-wide permanent deployment. A recreated Codespace without copies will not preserve them.

To bring back previously saved browser-only **card** edits, use `Import old browser draft` in the Cards tab on the original browser, review the loaded draft and click `Publish Cards`. This is intentionally not automatic. Browser-only Sidebar, Header, and Guide drafts are not migrated by this feature.

## Important limitations

- This is a **development proof of concept**, not deployed to `td.elm.sa`. Production/main is unchanged.
- The shared JSON file lives on a **single running backend**, so it is not suitable for multi-server deployments. Production needs permanent centralized storage/backups, deploy/restart strategy, backend authentication security review, CSRF review, least privilege, and recovery.
- The user who logged in is recorded by the backend; sharing individual credentials undermines reliable history.
- Users can browse portal content without signing in, but publishing changes and accessing history require active editor authentication.
- Do not expose Port 8787 publicly, commit `private-data`, or assume a React route guard provides backend security.
