"use client";
import { TypewriterEffectSmooth } from "@/components/ui/type-writer-effect";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function Home() {
  const session = useSession();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "authenticated") {
      router.push("/");
      setIsAuthenticated(true);
    }
  }, [session.status, session.data]);
  const router = useRouter();
  React.useEffect(() => {
    AOS.init({ duration: 1200 });
  });
  const words = [
    { text: "NeuroGPT," },
    { text: "the" },
    { text: "A.I" },
    { text: "that" },
    { text: "will" },
    { text: "get" },
    { text: "you" },
    { text: "to" },
    { text: "the" },
    { text: "next" },
    { text: "level." },
  ];
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
      {isAuthenticated ? (
        <div data-aos="fadeup" className="absolute top-6">
          <ul
            className="rounded-full bg-[#181818] text-[#eee] shadow-xl flex flex-row space-x-8 p-3 w-64 justify-center items-center"
            style={{ fontFamily: "Jetbrains Mono" }}
          >
            <li>
              <a
                href="/chat"
                className="hover:text-[#eee] transition-all duration-300 text-lg"
              >
                Chat
              </a>
            </li>
            <li>
              <a
                href="/api/auth/logout"
                className="hover:text-[#eee] transition-all duration-300 text-lg"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <div data-aos="fadeup" className="absolute top-6">
          <ul
            className="rounded-full bg-[#181818] text-[#eee] shadow-xl flex flex-row space-x-8 p-3 w-64 justify-center items-center"
            style={{ fontFamily: "Jetbrains Mono" }}
          >
            <li>
              <a
                href="/login"
                className="hover:text-[#eee] transition-all duration-300 text-lg"
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="hover:text-[#eee] transition-all duration-300 text-lg"
              >
                Register
              </a>
            </li>
          </ul>
        </div>
      )}
      <div className="flex h-screen w-screen justify-center items-center">
        <TypewriterEffectSmooth words={words} />
      </div>
    </main>
  );
}
