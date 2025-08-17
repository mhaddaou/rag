"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Card, CardHeader, CardBody, Checkbox } from "@heroui/react";
import { toast } from "sonner";
import { signupRequest } from "../lib/axios/auth/signup_request";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }

      if (!agreedToTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }

      setIsLoading(true);
      const res = await signupRequest({
        email: formData.email,
        password: formData.password,
        confirmed_password: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      if (res) {
        toast.success(
          "🎉 Account created successfully! You can now log in to your account."
        );
        router.push("/login");
      }
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707L16.414 6.3a1 1 0 00-.707-.3H7a2 2 0 00-2 2v11a2 2 0 002 2zM9 8h6v2H9V8zm0 4h6v2H9v-2zm0 4h4v2H9v-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Join DocChat AI</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Start your journey with intelligent document conversations. Create
              your account and unlock the power of AI-driven document analysis.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Free to get started
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure document processing
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                24/7 AI assistance
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6 pt-8">
              <div className="w-full text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Get started with your document AI assistant
                </p>
              </div>
            </CardHeader>

            <CardBody className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    isRequired
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border-2 hover:border-purple-300 focus-within:border-purple-500 transition-colors",
                    }}
                  />

                  <Input
                    type="text"
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    isRequired
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border-2 hover:border-purple-300 focus-within:border-purple-500 transition-colors",
                    }}
                  />
                </div>

                <Input
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  isRequired
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-base",
                    inputWrapper:
                      "border-2 hover:border-purple-300 focus-within:border-purple-500 transition-colors",
                  }}
                  startContent={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  }
                />

                <Input
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  isRequired
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-base",
                    inputWrapper:
                      "border-2 hover:border-purple-300 focus-within:border-purple-500 transition-colors",
                  }}
                  startContent={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                  endContent={
                    <button
                      className="focus:outline-none hover:opacity-80 transition-opacity"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m5.535 5.535l1.415 1.414M14.12 14.12L17.657 17.657"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  isRequired
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-base",
                    inputWrapper:
                      "border-2 hover:border-purple-300 focus-within:border-purple-500 transition-colors",
                  }}
                  startContent={
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  endContent={
                    <button
                      className="focus:outline-none hover:opacity-80 transition-opacity"
                      type="button"
                      onClick={toggleConfirmVisibility}
                    >
                      {isConfirmVisible ? (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m5.535 5.535l1.415 1.414M14.12 14.12L17.657 17.657"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  }
                  type={isConfirmVisible ? "text" : "password"}
                />

                <div className="flex items-start space-x-3">
                  <Checkbox
                    color="primary"
                    isRequired={true}
                    className=""
                    defaultSelected={false}
                    // lineThrough
                    // checked={agreedToTerms}
                    // onChange={() => setAgreedToTerms(!agreedToTerms)}
                    onValueChange={(value) => setAgreedToTerms(value)}

                  >
                    <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400 leading-5"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-purple-600 hover:text-purple-500 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-600 hover:text-purple-500 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  
                  </Checkbox>
                 
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
