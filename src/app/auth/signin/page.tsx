'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input-form"; // Adjust the import path as needed

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-lg w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold"
        >
          Sign In
        </button>

        <div className="text-center text-sm text-gray-400">or</div>

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
          Sign in with Google
        </button>

        <div className="text-center text-sm text-gray-400 mt-4">
          Don't have an account? <a href="/auth/signup" className="text-blue-500 hover:underline cursor-pointer">Sign Up</a>
        </div>
      </form>
    </div>
  );
}
