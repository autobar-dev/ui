"use client";

import { useState, useContext } from "react";
import { Card, TextInput, Button, Text } from "@tremor/react";
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from "react-icons/hi2";
import { RepositoriesContext } from "@/contexts/RepositoriesContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { authRepository } = useContext(RepositoriesContext);
  const { setTokens } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tokens = await authRepository.login(email, password);
      setTokens(tokens);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md p-10 rounded-3xl shadow-xl border-none">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/2-logo-with-text.svg"
            alt="Autobar Logo"
            width={200}
            height={60}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Text className="mb-2 font-semibold text-slate-700">Email</Text>
            <TextInput
              icon={HiEnvelope}
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-slate-200"
            />
          </div>

          <div>
            <Text className="mb-2 font-semibold text-slate-700">Password</Text>
            <div className="relative flex items-center">
              <TextInput
                icon={HiLockClosed}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl w-full border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-tremor-brand transition-colors z-10"
              >
                {showPassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-tremor-brand focus:ring-tremor-brand cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 select-none cursor-pointer">Remember me</label>
            </div>
            <button type="button" className="text-sm text-tremor-brand font-semibold hover:underline whitespace-nowrap">
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-[20px] text-lg font-bold bg-[#3B82F6] hover:bg-[#2563EB] text-white transition-all active:scale-95 cursor-pointer border-none shadow-md hover:shadow-blue-200 flex justify-center items-center"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </Card>
    </div>
  );
}
