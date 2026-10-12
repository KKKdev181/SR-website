import { useState } from "react";
import { LockKeyhole, ShieldCheck, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { usePortalAuth } from "@/lib/portalAuth";
import AdminPage from "@/pages/AdminPage";

export default function AdminGate() {
  const {user,loading,error:serviceError,signIn} = usePortalAuth();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [visible,setVisible]=useState(false);
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  if(loading)return <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">Checking login session…</main>;
  if(user?.isEditor)return <AdminPage/>;
  const login=async(e:React.FormEvent)=>{
    e.preventDefault();setError("");setSubmitting(true);
    try{await signIn(username,password);setPassword("");}
    catch(err){setError(err instanceof Error?err.message:"Could not sign in");}
    finally{setSubmitting(false);}
  };
  return <main className="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-12">
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-[#0757b8] px-7 py-8 text-white">
        <img src="/elm%20logo.png" alt="Elm" className="mb-6 h-10 w-auto brightness-0 invert"/>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15"><LockKeyhole size={24}/></div>
        <h1 className="text-2xl font-bold">Requests Portal Admin</h1>
        <p className="mt-2 text-sm text-blue-100">Sign in using your portal team account</p>
      </div>
      <div className="space-y-5 p-7">
        {user && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">The current account does not have editing permission.</div>}
        {!user && <div className="flex items-start gap-3 text-sm text-slate-600"><ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={20}/><span>Only accounts created by the portal administrator can access the editor.</span></div>}
        {(error||serviceError) && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error||serviceError}</p>}
        <form className="space-y-4" onSubmit={login}>
          <label className="block text-sm font-semibold text-slate-700">Username
            <input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-3 font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Team username"/>
          </label>
          <label className="block text-sm font-semibold text-slate-700">Password
            <span className="relative mt-1 block">
              <input required type={visible?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-3 pr-12 font-normal focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter password"/>
              <button type="button" aria-label={visible?"Hide password":"Show password"} onClick={()=>setVisible(v=>!v)} className="absolute inset-y-0 right-2 px-2 text-slate-500">{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button>
            </span>
          </label>
          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0757b8] px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"><LogIn size={18}/>{submitting?"Signing in…":"Sign in"}</button>
        </form>
        <a href="/" className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft size={16}/> Back to Requests Portal</a>
      </div>
    </div>
  </main>;
}
