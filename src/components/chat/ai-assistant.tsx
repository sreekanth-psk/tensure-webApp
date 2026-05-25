"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Sparkles,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePipelineStore } from "@/store/pipeline-store";
import { getChatResponse } from "@/lib/mock-ai";
import { delay } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "How can I accelerate our CI/CD pipeline?",
  "Estimate ROI for a 20-person team",
  "Best practices for Kubernetes scaling",
  "SOC2 compliance automation tips",
];

export function AIAssistant() {
  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    addChatMessage,
    chatLoading,
    setChatLoading,
  } = usePipelineStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    addChatMessage("user", text);
    setInput("");
    setChatLoading(true);
    await delay(800 + Math.random() * 1200);
    addChatMessage("assistant", getChatResponse(text));
    setChatLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[min(520px,80vh)] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-premium"
          >
            <div className="flex items-center justify-between border-b border-navy-100 bg-navy-950 px-4 py-3">
              <div className="flex items-center gap-2 text-white">
                <Bot className="h-5 w-5 text-emerald-glow" />
                <span className="font-semibold">Tensure Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-navy-400 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                        ? "bg-navy-900 text-white"
                        : "bg-navy-50 text-navy-800"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-1 px-2">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-emerald-brand"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-navy-100 p-3">
              <div className="mb-2 grid grid-cols-2 gap-1">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full bg-navy-50 px-2 py-1 text-[10px] text-navy-600 hover:bg-emerald-brand/10"
                  >
                    {prompt.slice(0, 35)}...
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask about pipelines, ROI..."
                  className="flex-1 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/30"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="emerald"
                  onClick={() => sendMessage(input)}
                  disabled={chatLoading}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-glow"
        aria-label="Open AI assistant"
      >
        {chatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-brand">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </>
        )}
      </motion.button>
    </>
  );
}
