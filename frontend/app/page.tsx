"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    router.push("/tasks");
  };

  const handleGoogleLogin = () => {
    alert("Google login will be connected later.");
  };

  return (
    <main className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-[1280px] min-h-screen flex flex-col items-center pt-[280px]">
        
        {/* Logo */}
        <div className="flex items-center gap-2 h-5">
  <div className="w-5 h-5 rounded-[5px] bg-black flex items-center justify-center">
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L5.5 20.5L12 17L18.5 20.5L12 3Z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V17"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>

  <span className="text-[14px] font-semibold text-black">
    Pyramid
  </span>
</div>

        {/* Login Card */}
        <div
          className="
            mt-3
            w-[384px]
            min-h-[202px]
            rounded-xl
            border
            border-[#E5E5E5]
            bg-white
            px-6
            py-6
            shadow-[0_1px_2px_rgba(0,0,0,0.05)]
          "
        >
          <div className="flex flex-col gap-6">

            {/* Heading */}
            <div className="text-center">
              <h1 className="text-[14px] leading-[18px] font-semibold text-[#111111]">
                Let's get back on track
              </h1>

              <p className="mt-1.5 text-[10px] leading-[15px] text-[#8A8A8A]">
                Enter your email below to login to your account.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">

              {/* Continue as Guest */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="
                  w-full
                  h-9
                  rounded-full
                  bg-black
                  text-white
                  text-[10px]
                  font-medium
                  transition-colors
                  hover:bg-[#222222]
                "
              >
                Continue as Guest
              </button>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="
                  w-full
                  h-9
                  rounded-full
                  border
                  border-[#E5E5E5]
                  bg-white
                  text-[#111111]
                  text-[10px]
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  hover:bg-[#F8F8F8]
                "
              >
                <span className="text-[12px] font-semibold">
                  G
                </span>

                <span>
                  Login with Google
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-2.5 w-[384px] h-12 flex items-start justify-center">
          <p className="text-center text-[8px] leading-[11px] text-[#8A8A8A]">
            By clicking continue, you agree to our{" "}
            <button
              type="button"
              className="underline hover:text-black"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="underline hover:text-black"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}