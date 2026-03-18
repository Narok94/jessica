
import React, { useState } from 'react';
import { useStore } from '../../store';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { generateChatResponse } from '../../services/geminiService';

export const AIAssistantView: React.FC = () => {
  const { chatMessages, setChatMessages, isChatLoading, setIsChatLoading, user } = useStore();
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    const newMessages = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const response = await generateChatResponse(userMsg, chatMessages);
      setChatMessages([...newMessages, { role: 'model' as const, text: response }]);
    } catch (error) {
      setChatMessages([...newMessages, { role: 'model' as const, text: "Desculpe, tive um problema técnico. Pode repetir?" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] animate-slide-up pb-10">
       <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Tatu <span className="text-indigo-500">Expert</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Sua consultoria 24h.</p>
       </header>
       <div className="flex-1 overflow-y-auto space-y-4 px-1 scrollbar-hide mb-4">
          {chatMessages.length === 0 && (
             <div className="glass-card rounded-[2rem] p-8 text-center space-y-4 max-w-xl mx-auto border border-indigo-500/10 bg-indigo-500/5">
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20"><Bot size={32}/></div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">O que vamos evoluir hoje?</h2>
                    <p className="text-zinc-400 text-[10px] font-medium mt-1 leading-relaxed">Tire dúvidas sobre execução, cargas ou peça motivação.</p>
                </div>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-xs font-bold shadow-lg leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass-card text-zinc-300 rounded-tl-none border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
              <div className="flex justify-start">
                  <div className="glass-card p-4 rounded-[1.2rem] rounded-tl-none border-white/10 space-y-2 w-48">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                  </div>
              </div>
          )}
       </div>
       <div className="flex gap-2 p-1.5 glass-card rounded-[1.8rem] border-white/10 items-center max-w-3xl mx-auto w-full">
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte ao Tatu Expert..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-xs font-bold text-white placeholder:text-zinc-600"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isChatLoading}
            className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-zinc-950 shadow-lg shadow-indigo-500/20 active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={18} strokeWidth={3} />
          </button>
       </div>
    </div>
  );
};
