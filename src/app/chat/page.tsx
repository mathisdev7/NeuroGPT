"use client";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import Logo from "../../../public/logo.jpeg";
import UserLogo from "../../../public/user-logo.webp";

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: string;
  user: User;
  userId: string;
  chatMessageId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ChatData = {
  id: string;
  title: string;
  user: User;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
} | null;

export default function Chat() {
  const session = useSession();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [showPrompt, setShowPrompt] = React.useState<boolean>(false);
  const [history, setHistory] = React.useState<ChatData[]>([]);

  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session.status, session.data]);
  const router = useRouter();
  React.useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);
  React.useEffect(() => {
    fetch(`/api/messages/getAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);
  const sendMessage = () => {
    if (!inputValue) return;
    setShowPrompt(true);
    fetch(`/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
      }),
    })
      .then((res) => res.json())
      .then((data: any) => {
        fetch(`/api/messages/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputValue,
            messageId: data?.message.id,
          }),
        }).then(() => {
          router.push(`/chat/${data?.chatMessage.id}`);
        });
      });
  };
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
      <div data-aos="fadeup" className="absolute top-6 z-50">
        <ul
          className="rounded-full bg-[#181818] text-[#fff] shadow-xl flex flex-row space-x-8 p-3 w-64 justify-center items-center"
          style={{ fontFamily: "Jetbrains Mono" }}
        >
          <li>
            <a
              href="/"
              className="hover:text-[#eee] transition-all duration-300 text-lg"
            >
              Home
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
      <div className="absolute w-200 right-0 h-full bg-[#ccafad]">
        <div className="relative left-24 top-24 font-JetBrainsMono w-5/6 flex flex-col space-y-8 pb-24">
          <div className="flex flex-row space-x-4">
            {showPrompt && (
              <>
                <Image
                  className="bg-[#ccc] rounded-full w-12 h-12"
                  alt="logo"
                  src={UserLogo}
                  width={48}
                  height={48}
                />
                <p className="mt-4">{inputValue}</p>
              </>
            )}
          </div>
          <div className="flex flex-row space-x-4">
            {showPrompt && (
              <>
                <Image
                  className="bg-[#ccc] rounded-full w-12 h-12"
                  alt="logo"
                  src={Logo}
                  width={48}
                  height={48}
                />
                <span className="mt-4">
                  <Icons.spinner className="w-6 h-6 animate-spinner" />
                </span>
              </>
            )}
          </div>
        </div>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          type="text"
          className="w-full absolute bottom-0 h-12"
          placeholder="Type a message..."
        ></Input>
      </div>
      <div className="w-52 h-full absolute left-0 border-white border-solid border-2 z-50 bg-[#ccafad]">
        {history.map((chat) => (
          <div key={chat?.id} className="flex flex-col m-8">
            <a
              href={`/chat/${chat?.id}`}
              className="font-JetBrainsMono text-sm text-center"
            >
              {chat?.title}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
