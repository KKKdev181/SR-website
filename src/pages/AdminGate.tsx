import { useState } from "react";
import { LockKeyhole, ShieldCheck, LogIn, ArrowLeft } from "lucide-react";
import { usePortalAuth } from "@/lib/portalAuth";
import AdminPage from "@/pages/AdminPage";

export default function AdminGate() {
  const { user, loading, configured, signIn } = usePortalAuth();
  const [error, setError] = useState("");
  if (loading) return <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">Checking company session…</main>;
  if (user?.isEditor) return <AdminPage />;
  return <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-12">
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-[#0757b8] px-7 py-8 text-white">
        <img src="/elm%20logo.png" alt="Elm" className="mb-6 h-10 w-auto brightness-0 invert"/>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15"><LockKeyhole size={24}/></div>
        <h1 className="text-2xl font-bold">Requests Portal Admin</h1>
        <p className="mt-2 text-sm text-blue-100">Authorized Technology team members only</p>
      </div>
      <div className="space-y-5 p-7">
        {!configured ? <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Company sign-in is not configured. Add VITE_ENTRA_TENANT_ID and VITE_ENTRA_CLIENT_ID to the development environment, then restart the app. No admin access is enabled.
        </div> : user ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Signed in as <strong>{user.username}</strong>, but your account does not have RequestsPortal.Admin or RequestsPortal.Editor assigned. Contact the portal administrator.
        </div> : <div className="flex items-start gap-3 text-sm text-slate-600"><ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={20}/><span>Use your company Microsoft account. Editing is limited to approved team members.</span></div>}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {configured && <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0757b8] px-4 py-3 font-semibold text-white hover:bg-blue-800" onClick={()=>{setError("");void signIn().catch((e:unknown)=>setError(e instanceof Error?e.message:"Sign-in failed"));}}><LogIn size={18}/> {user ? "Switch company account" : "Sign in with Microsoft"}</button>}
        <a href="/" className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft size={16}/> Back to Requests Portal</a>
      </div>
    </div>
  </main>;
}
