"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [IDImage, setIDImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
    setValue,
    clearErrors,
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const handleIDImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIDImage(file);
      setValue("IDImage", file);
      clearErrors("IDImage");
    }
  };

  const clearIDImage = () => {
    setIDImage(null);
    setValue("IDImage", null);
  };

  const onSubmit = async (data) => {
    if (!IDImage) {
      toast.error("Please upload your ID document.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("IDImage", IDImage);

    try {
      const response = await axios.post(
        "https://chat-samad.vercel.app/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message);
      setLoading(false);
      router.push("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover flex items-center justify-center">
      <div className="relative z-10 p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-center mb-4">
          <img src="/kiro.png" alt="Kiro Logo" className="h-16" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="relative col-span-2 sm:col-span-1">
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.fullName ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Full Name"
            />
            {errors.fullName ? (
              <p className="text-red-600 text-sm mt-1">
                {errors.fullName.message}
              </p>
            ) : dirtyFields.fullName ? (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            ) : null}
          </div>

          <div className="relative col-span-2 sm:col-span-1">
            <input
              type="tel"
              {...register("phone", { required: "Phone number is required" })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.phone ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Phone Number"
            />
            {errors.phone ? (
              <p className="text-red-600 text-sm mt-1">
                {errors.phone.message}
              </p>
            ) : dirtyFields.phone ? (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            ) : null}
          </div>

          <div className="relative col-span-2">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.email ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Email"
            />
            {errors.email ? (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            ) : dirtyFields.email ? (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            ) : null}
          </div>

          <div className="relative col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message:
                    "Password must contain at least one letter and one number",
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
            {errors.password ? (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            ) : dirtyFields.password ? (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            ) : null}
          </div>

          <div className="relative col-span-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`peer h-12 w-full px-4 border-b-2 ${
                errors.confirmPassword ? "border-red-600" : "border-gray-300"
              } focus:outline-none transition duration-300`}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword ? (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            ) : dirtyFields.confirmPassword ? (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            ) : null}
          </div>

          <div className="relative col-span-2">
            <label className="flex items-center cursor-pointer">
              <FaUpload className="mr-2" />
              <input
                type="file"
                onChange={handleIDImageChange}
                className="hidden"
                accept="image/*"
              />
              <span className="text-gray-700">Upload ID Document</span>
            </label>
            {IDImage && (
              <div className="mt-2 relative">
                <img
                  src={URL.createObjectURL(IDImage)}
                  alt="ID Preview"
                  className="w-24 h-24 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                  onClick={clearIDImage}
                >
                  <FaTimesCircle />
                </button>
              </div>
            )}
            {errors.IDImage && (
              <p className="text-red-600 text-sm mt-1">
                {errors.IDImage.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full h-12 bg-blue-600 text-white font-bold rounded-md transition duration-300 ${
                !isValid || !IDImage || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={!isValid || !IDImage || loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          already have an account?
          <Link href="/login" className="text-blue-500 hover:underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
