"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiShow, BiHide } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { Spinner } from "@material-tailwind/react";

export default function InputLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setError("");
    setEmailError("");
    setPasswordError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) setEmailError("Email wajid diisi!");
    if (!trimmedPassword) setPasswordError("Password wajid diisi!");
    if (!trimmedEmail || !trimmedPassword) return;

    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();
      try {
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
        setError("Terjadi kesalahan");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const message = data.message || "Login gagal";
        setError(message);

        if (message.toLowerCase().includes("password")) {
          setPasswordError(message);
        } else if (message.toLowerCase().includes("email")) {
          setEmailError(message);
        }

        setLoading(false);
        return;
      }
      toast.success("Login Success!");
      router.push("/dashboard/laporan/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan, coba lagi nanti.");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        backgroundColor: "var(--bg-section-login: #0e0e0e)",
      }}
      className="w-full min-h-screen flex items-center justify-center"
    >
      <ToastContainer />
      <div
        style={{
          backgroundColor: "var(--bg-input-login)",
          color: "var(--text-login)",
        }}
        className="  rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-7"
      >
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
          <label htmlFor="email" className="text-base">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "var(--bg-input-form-login)",
              color: "var(--text-login)",
            }}
            className={`rounded-xl px-4 py-3 text-base border ${
              emailError ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
            placeholder="Masukan Email"
          />
          {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
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
              style={{
                backgroundColor: "var(--bg-input-form-login)",
                color: "var(--text-login)",
              }}
              className={`rounded-xl px-4 py-3 text-base w-full border ${
                passwordError ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-amber-500`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              style={{
                color: "var(--text-login)",
              }}
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
          className="w-full py-3 rounded-xl text-white bg-amber-500 hover:bg-amber-600 transition text-base font-semibold flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : "Sign in"}
        </button>
      </div>
    </main>
  );
}
