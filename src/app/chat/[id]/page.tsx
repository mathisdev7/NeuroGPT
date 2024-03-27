"use client";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import Logo from "../../../../public/logo.jpeg";
import UserLogo from "../../../../public/user-logo.webp";

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
  reply: string;
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

export default function Chat({ params }: { params: { id: string } }) {
  const session = useSession();
  const [chatData, setChatData] = React.useState<ChatData>(null);
  const [newMessage, setNewMessage] = React.useState<boolean>(false);
  const [newAiMessage, setNewAiMessage] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isAiPromptLoading, setIsAiPromptLoading] = React.useState<string>("");
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
    fetch(`/api/messages/get?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setChatData(data));
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
    fetch(`/api/messages/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: params.id,
        message: inputValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAiPromptLoading(data.message.id);
        setNewMessage(!newMessage);
        fetch(`/api/messages/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageId: data.message.id,
            prompt: inputValue,
          }),
        }).then(() => {
          setNewAiMessage(!newMessage);
          setIsAiPromptLoading("");
        });
      });
    setInputValue("");
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
      <div className="absolute w-200 right-0 h-full bg-[#ccafad] overflow-y-scroll">
        <div className="relative left-24 top-8 font-JetBrainsMono w-5/6 flex flex-col space-y-8 pb-24">
          {chatData?.messages.map((message) => (
            <React.Fragment key={message.id}>
              <div className="flex flex-row space-x-4">
                <Image
                  className="bg-[#ccc] rounded-full w-12 h-12"
                  alt="logo"
                  src={UserLogo}
                  width={48}
                  height={48}
                />
                <p className="mt-4">{message.content}</p>
              </div>
              <div className="flex flex-row space-x-4">
                <Image
                  className="bg-[#ccc] rounded-full w-12 h-12"
                  alt="logo"
                  src={Logo}
                  width={48}
                  height={48}
                />
                <span className="mt-4">
                  {isAiPromptLoading === message.id ? (
                    <Icons.spinner className="w-6 h-6 animate-spinner" />
                  ) : (
                    <ReactMarkdown>{message.reply}</ReactMarkdown>
                  )}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          type="text"
          className="w-full fixed bottom-0 h-12 rounded-none"
          placeholder="Type a message..."
        ></Input>
      </div>
      <div className="w-52 h-full absolute left-0 border-[#eee] border-solid border-r z-50 bg-[#ccafad]">
        <div className="flex flex-col m-8 w-32">
          <a
            href="/chat"
            className="font-JetBrainsMono text-xl text-[#8572a8] font-bold text-center"
          >
            New Chat
          </a>
        </div>
        {history.map((chat) => (
          <div key={chat?.id} className="flex flex-col m-8 w-32">
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
