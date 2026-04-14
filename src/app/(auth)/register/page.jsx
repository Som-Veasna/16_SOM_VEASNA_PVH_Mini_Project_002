import Link from "next/link";
import RegisterFormComponent from "../_components/RegisterFormComponent";

export const metadata = {
  title: "Register | PurelyStore",
  description: "Create a new PurelyStore account.",
};

export default function RegisterPage() {
  return (
    <div className="w-full border border-[#2e93ad] bg-[#0a0a14] p-10 shadow-2xl shadow-black/60">
      <div className="mb-1">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          PurelyStore
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-gray-100">
        New account
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Fill in the details below to get started.
      </p>

      <RegisterFormComponent />

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300">
          Sign in
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