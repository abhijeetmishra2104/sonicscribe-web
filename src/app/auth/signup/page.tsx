"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input-form"; // Adjust the import path if needed
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/auth/signin");
    } else {
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="px-4 py-3 bg-[#2f0d68] text-white rounded-md font-medium hover:bg-[#5d0ec0] transition"
          >
            Sign Up
          </Button>

          <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-semibold flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#fff"
              d="M44.5 20H24v8.5h11.9C34.2 33.6 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.3 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.2 0 19-7.5 19-20 0-1.3-.1-2.7-.5-4z"
            />
          </svg>
          Sign up with Google
        </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/signin")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
