"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useToast } from "@/app/context/ToastContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";

export default function LoginFormComponent() {
  const [formError, setFormError] = useState("");
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (formData) => {
    setFormError("");

    try {
      const authResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (authResult?.error) {
        throw new Error(authResult.error);
      }

      addToast({
        title: "Welcome back",
        description: `${formData.email} signed in successfully.`,
        color: "success",
      });

      window.location.href = "/";
    } catch (err) {
      addToast({
        title: "Access denied",
        description: "The email or password you entered is incorrect.",
        color: "danger",
      });
      setFormError("Credentials did not match. Please try again.");
    }
  };

  const fieldBase =
    "w-full border bg-[#0d0d1a] px-4 py-3 text-sm text-gray-100 outline-none transition placeholder:text-gray-600";
  const fieldValid = "border-[#2a2a45] focus:border-amber-400";
  const fieldInvalid = "border-rose-600 focus:border-rose-500";

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit(submitHandler)} noValidate>
      {formError && (
        <div className="border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-400">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="field-email" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Email address
        </label>
        <input
          id="field-email"
          type="email"
          {...register("email")}
          className={`${fieldBase} ${errors.email ? fieldInvalid : fieldValid}`}
          placeholder="hello@example.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="field-password" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Password
        </label>
        <input
          id="field-password"
          type="password"
          {...register("password")}
          className={`${fieldBase} ${errors.password ? fieldInvalid : fieldValid}`}
          placeholder="••••••••••"
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="solid"
        className="w-full bg-amber-400 py-3.5 text-sm font-bold uppercase tracking-widest text-[#08080f] transition hover:bg-amber-300"
      >
        Enter
      </Button>
    </form>
  );
}