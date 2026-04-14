"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";

export default function RegisterFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const { addToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthdate: "",
    },
  });

  const handleRegister = async (payload) => {
    setSubmitError("");

    try {
      const res = await fetch("https://homework-api.noevchanmakara.site/api/v1/auths/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      addToast({
        title: "Account created",
        description: "You can now sign in with your credentials.",
        color: "success",
      });

      router.push("/login");
    } catch (err) {
      addToast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
      setSubmitError("Could not create your account. Please try again.");
    }
  };

  const baseInput =
    "w-full border bg-[#0d0d1a] px-4 py-3 text-sm text-gray-100 outline-none transition placeholder:text-gray-600";
  const okBorder = "border-[#2a2a45] focus:border-amber-400";
  const errBorder = "border-rose-600 focus:border-rose-500";

  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2";

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleRegister)} noValidate>
      {submitError && (
        <div className="border border-rose-800 bg-rose-950/50 px-4 py-3 text-sm text-rose-400">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className={labelClass}>
          Full name
        </label>
        <input
          id="reg-name"
          type="text"
          {...register("name")}
          className={`${baseInput} ${errors.name ? errBorder : okBorder}`}
          placeholder="Jane Doe"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className={labelClass}>
          Email address
        </label>
        <input
          id="reg-email"
          type="email"
          {...register("email")}
          className={`${baseInput} ${errors.email ? errBorder : okBorder}`}
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password" className={labelClass}>
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          {...register("password")}
          className={`${baseInput} ${errors.password ? errBorder : okBorder}`}
          placeholder="••••••••••"
        />
        {errors.password && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-birthdate" className={labelClass}>
          Date of birth
        </label>
        <input
          id="reg-birthdate"
          type="date"
          {...register("birthdate")}
          className={`${baseInput} ${errors.birthdate ? errBorder : okBorder}`}
        />
        {errors.birthdate && (
          <p className="mt-1.5 text-xs text-rose-500">{errors.birthdate.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="solid"
        className="w-full bg-amber-400 py-3.5 text-sm font-bold uppercase tracking-widest text-[#08080f] transition hover:bg-amber-300"
      >
        Create account
      </Button>
    </form>
  );
}