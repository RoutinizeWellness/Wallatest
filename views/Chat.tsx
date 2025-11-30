import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export const Chat: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Id<"threads"> | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  const chats = useQuery(api.messages.getThreads);
  const messages = useQuery(api.messages.list, activeChat ? { threadId: activeChat } : "skip");
  const sendMessageMutation = useMutation(api.messages.send);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Detección simple en tiempo real (Client side)
    const phoneRegex = /[0-9]{9}/;
    if (phoneRegex.test(val) || val.includes("@")) {
      setShowRiskAlert(true);
    } else {
      setShowRiskAlert(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;

    await sendMessageMutation({
      threadId: activeChat,
      content: inputValue,
      type: "text"
    });

    setInputValue("");
    setShowRiskAlert(false);
  };

  if (activeChat) {
    // Find active chat details from the list
    const chatSession = chats?.find(c => c._id === activeChat);
    // We need to enrich threads with other user info in backend, but for now let's assume we have it or fetch it.
    // Wait, getThreads in backend returns raw threads. I need to enrich them.
    // I should update getThreads in messages.ts to return other user info.
    // For now, I'll just use placeholders or try to find it.
    // Actually, I'll update messages.ts in next step to enrich threads.

    return (
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-64px)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-500 mr-2">←</button>
          {/* <img src={chatSession?.otherUserAvatar} className="w-10 h-10 rounded-full" /> */}
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Chat</h3>
            {/* <p className="text-xs text-gray-500">{chatSession?.listingTitle}</p> */}
          </div>
          <button className="text-red-500 text-xs font-medium border border-red-100 bg-red-50 px-3 py-1 rounded-full">
            Reportar
          </button>
        </div>

        {/* Safety Box Fixed */}
        <div className="bg-yellow-50 p-2 text-center border-b border-yellow-100">
          <p className="text-xs text-yellow-800">
            🔒 <strong>Regla de Oro:</strong> Nunca envíes dinero por Bizum sin ver el producto antes. Quedad en sitios públicos de Terrassa.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages?.map((m: any) => (
            <div key={m._id} className={`flex ${m.senderId === "me" ? 'justify-end' : 'justify-start'}`}>
              {/* We need to know who is "me". We can get it from useUser or check senderId against our ID. */}
              {/* Let's assume we compare with our user ID. */}
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm bg-white border border-gray-200 shadow-sm`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 relative">
          {showRiskAlert && (
            <div className="absolute -top-12 left-4 right-4 bg-red-600 text-white text-xs p-2 rounded-lg shadow-lg animate-bounce">
              ⚠️ ¡Cuidado! Si te piden hablar por WhatsApp podría ser una estafa.
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat List
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tus Conversaciones</h1>
      <div className="space-y-2">
        {chats?.map((chat: any) => (
          <div
            key={chat._id}
            onClick={() => setActiveChat(chat._id)}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer border bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gray-200"></div>
              {/* <img src={chat.otherUserAvatar} alt="User" className="w-14 h-14 rounded-full object-cover" /> */}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900 truncate">
                  Chat {chat._id.substring(0, 8)}...
                </h3>
                <span className="text-xs text-gray-400">Hace 1h</span>
              </div>
              <p className="text-gray-900 font-medium text-sm mb-0.5 truncate">Producto...</p>
              <p className="text-gray-500 text-sm truncate">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
        {chats?.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No tienes conversaciones aún.</p>
        )}
      </div>
    </div>
  );
};