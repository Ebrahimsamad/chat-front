"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // router.push("/login"); // Redirect after timeout
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Email Sent!</h1>
        <p className="text-gray-600">
          We have sent a verification email to your address. Please check your
          inbox to verify your email.
        </p>
      </div>
    </div>
  );
};

export default page;
