"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";

export default function InputLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setError("");
    setUsernameError("");
    setPasswordError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) setUsernameError("Username required!");
    if (!trimmedPassword) setPasswordError("Password required!");
    if (!trimmedUsername || !trimmedPassword) return;

    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Success!");
        router.push("/dashboard");
      } else {
        const message = data.message || "Login gagal";
        setError(message);
        setLoading(false);

        if (message.toLowerCase().includes("password")) {
          setPasswordError(message);
        } else if (message.toLowerCase().includes("username")) {
          setUsernameError(message);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan, coba lagi nanti.");
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#0e0e0e]">
      <div className="bg-[#1a1a1a] text-white rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-7">
        <div className="flex flex-col items-center">
          <img
            src="/logo-img/Png_LAZ_BARAT.png"
            alt="logo"
            className="w-16 mb-5"
          />
          <h1 className="text-xl font-bold">Sign in</h1>
        </div>

        {error && (
          <p className="text-red-500 text-center text-base font-semibold">
            {error}
          </p>
        )}

        <div className="flex flex-col space-y-2">
          <label htmlFor="username" className="text-base">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`rounded-xl px-4 py-3 text-base bg-[#2b2b2b] text-white border ${
              usernameError ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
            placeholder="Masukan Email"
          />
          {usernameError && (
            <p className="text-red-400 text-sm">{usernameError}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-base">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`rounded-xl px-4 py-3 text-base w-full bg-[#2b2b2b] text-white border ${
                passwordError ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-amber-500`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
            >
              {showPassword ? <BiHide size={22} /> : <BiShow size={22} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="accent-amber-500" />
          <label htmlFor="remember" className="text-base">
            Remember me
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white bg-amber-500 hover:bg-amber-600 transition text-base font-semibold flex justify-center items-center"
        >
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            "Sign in"
          )}
        </button>

        {/* <p className="text-center text-white text-sm mt-2">
          Lupa password?{" "}
          <button
            onClick={() => router.push("/reset-password")}
            className="underline hover:text-green-300 transition"
          >
            Reset Password
          </button>
        </p> */}
      </div>
    </main>
  );
}
