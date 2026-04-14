import Link from "next/link";
import LoginFormComponent from "../_components/LoginFormComponent";

export const metadata = {
  title: "Sign In | PurelyStore",
  description: "Access your PurelyStore account.",
};

export default function LoginPage() {
  return (
    <div className="w-full border border-[#147dcd] bg-[#0a0a14] p-10 shadow-2xl shadow-black/60">
      <div className="mb-1">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          PurelyStore
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-gray-100">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your credentials to access your account.
      </p>

      <LoginFormComponent />

      <p className="mt-8 text-center text-sm text-gray-600">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-amber-400 hover:text-amber-300">
          Create one
        </Link>
      </p>

      <p className="mt-5 text-center">
        <Link href="/" className="text-xs text-gray-700 hover:text-gray-400 transition">
          ← Back to store
        </Link>
      </p>
    </div>
  );
}