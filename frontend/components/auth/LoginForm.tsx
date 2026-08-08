"use client";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const handleGuestLogin = () => {
    router.push("/tasks");
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[1280px] min-h-screen flex items-center justify-center">
        <div className="w-[320px]">
          
          {/* Brand */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded bg-black" />
              <span className="text-xs font-semibold text-purple-600">
                Pyramid
              </span>
            </div>
          </div>

          {/* Login Card */}
          <div className="border border-gray-200 rounded-2xl p-5">
            <div className="text-center">
              <h1 className="text-base font-medium text-gray-900">
                Let's get back on track
              </h1>

              <p className="mt-1 text-[11px] text-gray-500">
                Enter your email below to login to your account.
              </p>
            </div>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              className="w-full mt-4 h-9 rounded-full bg-black text-white text-xs font-medium hover:bg-gray-800 transition"
            >
              Continue as Guest
            </button>

            {/* Google Login */}
            <button
              className="w-full mt-2 h-9 rounded-full border border-gray-200 bg-white text-gray-800 text-xs font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span className="font-bold">G</span>
              Login with Google
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-[9px] text-gray-500 mt-4 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </main>
  );
}