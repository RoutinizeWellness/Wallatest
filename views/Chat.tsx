import React, { useState, useEffect } from 'react';
import { api } from '../services/mockBackend';
import { ChatSession } from '../types';

export const Chat: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<{text: string, isMe: boolean, isWarning?: boolean}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      const data = await api.getChats();
      setChats(data);
    };
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      setMessages([
        { text: "Hola, ¿podemos quedar en la Plaça Vella para verlo?", isMe: false }
      ]);
      setShowRiskAlert(false);
    }
  }, [activeChat]);

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
    if (!inputValue.trim()) return;

    // Backend Check simulation
    const isRisky = await api.sendMessage(activeChat!, inputValue);

    const newMessages = [...messages, { text: inputValue, isMe: true }];
    
    // Si el backend detecta riesgo, añade mensaje del sistema
    if (isRisky) {
       newMessages.push({ 
         text: "⚠️ ADVERTENCIA DE SEGURIDAD: Nuestro sistema ha detectado que intentas compartir datos de contacto. Por tu seguridad, no salgas del chat de TerrassaMarket hasta ver el producto en persona.", 
         isMe: false,
         isWarning: true
       });
    }

    setMessages(newMessages);
    setInputValue("");
    setShowRiskAlert(false);
  };

  if (activeChat) {
    const chatSession = chats.find(c => c.id === activeChat);

    return (
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-64px)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-500 mr-2">←</button>
          <img src={chatSession?.otherUserAvatar} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{chatSession?.otherUserName}</h3>
            <p className="text-xs text-gray-500">{chatSession?.listingTitle}</p>
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
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.isWarning ? 'justify-center' : m.isMe ? 'justify-end' : 'justify-start'}`}>
              {m.isWarning ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg text-center max-w-[90%]">
                  {m.text}
                </div>
              ) : (
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              )}
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
        {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer border bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
            >
              <div className="relative">
                <img src={chat.otherUserAvatar} alt="User" className="w-14 h-14 rounded-full object-cover" />
                <img src={chat.listingImage} alt="Item" className="w-6 h-6 rounded-md absolute -bottom-1 -right-1 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {chat.otherUserName}
                  </h3>
                  <span className="text-xs text-gray-400">Hace 1h</span>
                </div>
                <p className="text-gray-900 font-medium text-sm mb-0.5 truncate">{chat.listingTitle}</p>
                <p className="text-gray-500 text-sm truncate">{chat.lastMessage}</p>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};