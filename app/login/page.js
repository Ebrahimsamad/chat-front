"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const email = watch("email");
  const password = watch("password");

  const isPasswordValid = password?.length >= 8 && /[A-Za-z0-9]/.test(password);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("https://chat-samad.vercel.app/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to login");
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);

      toast.success(result.message || "Login successful!");
      setBackendMessage("");
      router.push("/chat");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
      setBackendMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover flex items-center justify-center">
      <div className="relative z-10 p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/kiro.png" alt="Kiro Logo" className="h-16" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.email ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /[A-Za-z0-9]/,
                  message: "Password must contain a letter or number",
                },
              })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.password ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}

            <div className="mt-2 text-sm text-gray-600">
              {password?.length < 8 && (
                <p>Password must be at least 8 characters long</p>
              )}
              {!/[A-Za-z0-9]/.test(password) && (
                <p>Password must contain a letter or a number</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !isPasswordValid || !isValid}
            className={`w-full py-3 rounded-lg transition duration-300 bg-[#b92a3b] text-white flex justify-center items-center ${
              loading || !email || !isPasswordValid || !isValid
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-[#a02234]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?
          <Link href="/register" className="text-blue-500 hover:underline">
            {" "}
            Register now
          </Link>
        </p>

        {backendMessage && (
          <p className="mt-4 text-red-600 text-center">{backendMessage}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
