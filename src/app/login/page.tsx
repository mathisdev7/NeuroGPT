"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Cross1Icon } from "@radix-ui/react-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import * as z from "zod";

const formSchema = z.object({
  username: z
    .string({
      required_error: "E-mail is required.",
    })
    .describe("E-mail")
    .min(2, {
      message: "E-mail must be at least 2 characters.",
    }),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .describe("Password")
    .min(7, {
      message: "Password must be at least 7 characters.",
    }),
});

export default function Login() {
  const session = useSession();
  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "authenticated") router.push("/");
  }, [session.status, session.data]);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (formData: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    const loginRequest = await signIn("credential", {
      username: formData.username,
      password: formData.password,
      callbackUrl: "/",
      redirect: false,
    });
    const hasSucceed = loginRequest?.ok;
    if (hasSucceed) {
      setIsLoading(false);
      router.push("/");
    } else {
      setError("Your credentials are invalid.");
      return setIsLoading(false);
    }
  };
  React.useEffect(() => {
    AOS.init({ duration: 1200 });
  });
  return (
    <main className="bg-[#ccafad] flex flex-col items-center h-screen justify-between">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Anta&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />
      <div className="absolute top-6">
        <ul
          className="rounded-full bg-[#181818] text-[#eee] shadow-xl flex flex-row space-x-8 p-3 w-80 justify-center items-center"
          style={{ fontFamily: "Jetbrains Mono" }}
        >
          <li onClick={() => router.push("/")} className="hover:text-[#eee]">
            Home
          </li>
          <li
            onClick={() => router.push("/register")}
            className="hover:text-[#eee]"
          >
            Register
          </li>
          <li className="hover:text-[#eee]">Contact</li>
        </ul>
      </div>
      <div className="absolute top-48 h-96 flex space-y-4 flex-col">
        <Button
          disabled={isLoading}
          className="w-80 h-8 p-6 rounded-xl text-[#eee] bg-[#181818] relative bottom-8 hover:bg-[#181818] shadow-2xl"
        >
          <Icons.google className="relative w-4 right-3" />
          <span className="relative left-px">Continue with Google</span>
        </Button>
        <Button
          disabled={isLoading}
          className="w-80 h-8 p-6 rounded-xl text-[#eee] bg-[#181818] relative bottom-8 hover:bg-[#181818] shadow-2xl"
        >
          <Icons.twitter className="relative w-4 right-8" />
          <span className="relative right-px">Continue with X</span>
        </Button>
        {error && (
          <Alert className="w-80 bg-[#181818] border-none text-[#eee]">
            <Cross1Icon
              onClick={() => setError(null)}
              className="h-4 w-4 bg-white rounded-full p-1"
            />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AutoForm
          onSubmit={(e) => handleSubmit(e)}
          formSchema={formSchema}
          fieldConfig={{
            username: {
              inputProps: {
                placeholder: "E-mail",
                disabled: isLoading,
                type: "email",
              },
            },
            password: {
              inputProps: {
                placeholder: "Password",
                disabled: isLoading,
                type: "password",
              },
            },
          }}
          className="bg-[#181818] w-80 h-80 rounded-xl p-8 text-[#eee] shadow-2xl"
        >
          <AutoFormSubmit
            disabled={isLoading}
            className="bg-[#8572a8] hover:bg-[#8572a8] relative left-16 px-8 top-4 py-2 text-lg shadow-2xl font-JetBrainsMono"
          >
            {isLoading && (
              <Icons.spinner className="animate-spinner relative right-3" />
            )}
            Login
          </AutoFormSubmit>
          <a
            href="/register"
            className="text-[#ccc] text-sm absolute w-full left-10 translate-y-20 z-50"
          >
            Don't have an account? Create one!
          </a>
        </AutoForm>
      </div>
      <div className="flex h-screen w-screen justify-center items-center"></div>
    </main>
  );
}
