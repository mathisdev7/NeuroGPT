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
  const [sessionLoading, setSessionLoading] = React.useState<boolean>(true);
  const [chatData, setChatData] = React.useState<ChatData>(null);
  const [newMessage, setNewMessage] = React.useState<boolean>(false);
  const [newAiMessage, setNewAiMessage] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isAiPromptLoading, setIsAiPromptLoading] = React.useState<string>("");
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
    fetch(`/api/messages/get?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setChatData(data));
  }, [sessionLoading, newMessage, newAiMessage]);
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
        sendReplyAsync(data.message.id, inputValue);
      });
    setInputValue("");
  };
  const sendReplyAsync = async (messageId: string, inputValue: string) => {
    try {
      const response = await fetch(`/api/messages/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: messageId,
          prompt: inputValue,
        }),
      });
      if (response.ok) {
        setNewAiMessage(!newMessage);
        setIsAiPromptLoading("");
      } else {
        // Gérer les erreurs de réponse ici
        console.error("Erreur lors de l'envoi de la réponse");
      }
    } catch (error) {
      // Gérer les erreurs de requête ici
      console.error("Erreur lors de la requête de réponse:", error);
    }
  };
  return (
    <main className="bg-[#222222] flex flex-col items-center h-screen justify-between">
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
      <div className="absolute w-200 right-0 h-full bg-[#181818] overflow-y-scroll">
        <div className="relative left-24 2xl:left-40 top-8 font-JetBrainsMono w-5/6 flex flex-col space-y-8 pb-24">
          {session.data &&
            chatData?.messages?.map((message) => (
              <React.Fragment key={message.id}>
                <div className="flex flex-row space-x-4">
                  <Image
                    className="bg-[#ccc] rounded-full w-12 h-12"
                    alt="logo"
                    src={UserLogo}
                    width={48}
                    height={48}
                  />
                  <p className="mt-4 text-[#eee]">{message.content}</p>
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
                      <ReactMarkdown className="text-[#eee]">
                        {message.reply}
                      </ReactMarkdown>
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
            <div key={chat?.id} className="flex flex-col m-8 w-32">
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
