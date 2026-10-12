import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { useEffect, useState } from "react";

const tenant = import.meta.env.VITE_ENTRA_TENANT_ID as string | undefined;
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID as string | undefined;
export const authConfigured = Boolean(tenant && clientId);
const client = authConfigured ? new PublicClientApplication({
  auth: {
    clientId: clientId!,
    authority: `https://login.microsoftonline.com/${tenant}`,
    redirectUri: window.location.origin + "/",
    postLogoutRedirectUri: window.location.origin + "/",
  },
  cache: { cacheLocation: "sessionStorage" },
}) : null;
let initialization: Promise<void> | null = null;
function ensureReady() {
  if (!client) return Promise.reject(new Error("Company login is not configured."));
  initialization ??= client.initialize().then(async () => { await client.handleRedirectPromise(); });
  return initialization.then(() => client);
}
const EVENT = "sr-auth-change";
export type SignedInUser = { name: string; username: string; isEditor: boolean };
const getUser = (account: AccountInfo | null): SignedInUser | null => {
  if (!account) return null;
  const roles = (account.idTokenClaims as { roles?: unknown } | undefined)?.roles;
  const isEditor = Array.isArray(roles) && roles.some(role => role === "RequestsPortal.Admin" || role === "RequestsPortal.Editor");
  return { name: account.name || account.username, username: account.username, isEditor };
};
export async function signIn() {
  const auth = await ensureReady();
  const response = await auth.loginPopup({ scopes: ["openid", "profile"], prompt: "select_account" });
  auth.setActiveAccount(response.account);
  window.dispatchEvent(new Event(EVENT));
}
export async function signOut() {
  const auth = await ensureReady();
  const account = auth.getActiveAccount() || auth.getAllAccounts()[0];
  await auth.logoutPopup({ account, mainWindowRedirectUri: window.location.origin + "/" });
  window.dispatchEvent(new Event(EVENT));
}
export function usePortalAuth() {
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [loading, setLoading] = useState(authConfigured);
  useEffect(() => {
    let alive = true;
    const sync = () => {
      if (!client) {setLoading(false);setUser(null);return;}
      void ensureReady().then(auth => {
        if (!alive) return;
        setUser(getUser(auth.getActiveAccount() || auth.getAllAccounts()[0] || null));
        setLoading(false);
      }).catch(() => {if (alive) {setUser(null);setLoading(false);}});
    };
    sync();
    window.addEventListener(EVENT,sync);
    return () => {alive = false;window.removeEventListener(EVENT,sync);};
  }, []);
  return {user,loading,configured:authConfigured,signIn,signOut};
}
