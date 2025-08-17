"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { loginRequest } from "../lib/axios/auth/login_request";
import { toast } from "sonner";
import { LoginDataInterface } from "../lib/axios/interfaces/login_data_interface";
import { useRouter } from "next/navigation";
import { Checkbox } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res: LoginDataInterface = await loginRequest({ email, password });
      if (res) {
        localStorage.setItem("jwt", res.jwt);
        localStorage.setItem("email", res.email);
        localStorage.setItem("firstName", res.firstName);
        localStorage.setItem("lastName", res.lastName);
        localStorage.setItem("logged", "true");
        toast.success("you are logged successfuly");
        router.push("/c");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex ">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700   relative overflow-hidden justify-center">
        <div className="absolute inset-0 bg-black/20 "></div>
        <div className="relative z-10 flex flex-col  justify-center items-center text-white p-12">
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
            <h1 className="text-4xl font-bold mb-4">DocChat AI</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Upload your documents (PDF) and have intelligent
              conversations with them. Extract insights, ask questions, and get
              instant answers from any document format.
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
                Multiple file formats supported
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
                Ask questions naturally
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
                Get intelligent responses
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 ">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80  backdrop-blur-sm">
            <CardHeader className="pb-8 pt-8">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600  bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-gray-600  mt-2">
                  Sign in to continue chatting with your documents
                </p>
              </div>
            </CardHeader>

            <CardBody className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 text-black">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                    color="primary"
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-base",
                      inputWrapper:
                        "border-2 border-black/10 hover:border-purple-300 focus-within:border-purple-500 transition-colors text-slate-600",
                      label: "text-slate-500",
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                    variant="bordered"
                    color="primary"
                    size="lg"
                    classNames={{
                      input: "text-base ",
                      inputWrapper:
                        "border-2 border-black/10 hover:border-purple-300 focus-within:border-purple-500 transition-colors text-slate-600 placeholder:text-slate-400",
                      label: "text-slate-500",
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
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    color="primary"
                    
                    className=""
                    // defaultSelected
                    
                    lineThrough
                  >
                    Remember me
                    
                  </Checkbox>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="text-gray-600 ">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Create account
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
