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
  const [sessionLoading, setSessionLoading] = React.useState<boolean>(true);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [showPrompt, setShowPrompt] = React.useState<boolean>(false);
  const [history, setHistory] = React.useState<ChatData[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      router.push("/");
      setSessionLoading(false);
    }
    setSessionLoading(false);
  }, [session.status, session.data]);

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
  }, [sessionLoading]);
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
    <main className="bg-[#ccc] flex flex-col items-center h-screen justify-between">
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
          className="rounded-full bg-[#222222] text-[#fff] shadow-xl flex flex-row space-x-8 p-3 w-64 justify-center items-center"
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
      {!showPrompt && (
        <div className="flex flex-col justify-center items-center z-50 mt-48">
          <div>
            <Image
              className="bg-[#ccc] rounded-full w-28 h-28 relative"
              alt="logo"
              src={Logo}
              width={48}
              height={48}
            />
          </div>
          <div>
            <p className="mt-4 text-[#eee] text-2xl">
              How may I assist you today?
            </p>
          </div>
        </div>
      )}
      <div className="absolute w-200 right-0 h-full bg-[#181818]">
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
                <p className="mt-4 text-white">{inputValue}</p>
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
          className="w-1/2 fixed right-96 bottom-4 h-12 rounded-xl bg-[#333333] text-[#eee] border-none focus:border-none"
          placeholder="Message NeuroGPT..."
        ></Input>
      </div>
      <div className="w-52 h-full absolute text-center left-0 z-50 bg-[#222222]">
        <div className="border-b-2 border-white w-full h-20">
          <Image
            className="absolute bg-[#ccc] rounded-full w-8 h-8 top-6 left-3"
            alt="logo"
            src={Logo}
            width={38}
            height={38}
          />
          <a
            href="/chat"
            className="relative text-xl text-[#eee] font-bold top-6"
          >
            New Chat
          </a>
        </div>
        {session.data &&
          history?.map((chat) => (
            <div key={chat?.id} className="flex flex-col m-8 relative top-2">
              <a
                href={`/chat/${chat?.id}`}
                className="text-base text-[#eee] text-center"
              >
                {chat?.title}
              </a>
            </div>
          ))}
      </div>
    </main>
  );
}
