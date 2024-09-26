"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const VerifyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email) return;

      try {
        const response = await fetch(
          "https://chat-samad.vercel.app/verify-email",
          {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to verify email");
        }

        toast.success(result.message || "Email verified successfully!", {
          duration: 4000,
        });
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        router.push("/dashboard");
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Verification failed. Please try again.");
        setMessage("Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [email, router]);

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover flex items-center justify-center">
      <div className="relative z-10 p-6 bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col items-center">
        {loading ? (
          <>
            <div
              className="animate-spin inline-block w-10 h-10 border-4 border-t-4 border-[#b92a3b] border-t-transparent rounded-full"
              role="status"
            ></div>
            <p className="mt-4 text-lg font-semibold">{message}</p>
          </>
        ) : (
          <p className="mt-4 text-lg font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
