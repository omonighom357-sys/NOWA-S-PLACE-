import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, MessageSquare, Plus, Send, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types/store';
import { PRODUCTS } from '../data/catalogue';
import { formatNaira } from '../utils/currency';
import {
  ASK_NOWAS_GREETING,
  ASK_NOWAS_SUGGESTIONS,
  AssistantContext,
  AssistantQuickAction,
  queryAskNowasAssistant,
} from '../utils/askNowasEngine';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  products?: Product[];
  quickActions?: AssistantQuickAction[];
}

interface AskNowasWidgetProps {
  hideLauncher?: boolean;
  onQuickAdd: (product: Product, size: string, colour: string) => void;
  onQuickView: (product: Product) => void;
  onAction: (action: AssistantQuickAction['type']) => void;
}

export function AskNowasWidget({
  hideLauncher = false,
  onQuickAdd,
  onQuickView,
  onAction,
}: AskNowasWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [context, setContext] = useState<AssistantContext>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: ASK_NOWAS_GREETING,
      quickActions: [{ type: 'open-style-finder', label: 'Launch Style Finder' }],
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const sendQuery = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    const reply = queryAskNowasAssistant(trimmed, PRODUCTS, context);
    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'assistant',
      text: reply.replyText,
      products: reply.recommendedProducts,
      quickActions: reply.quickActions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setContext(reply.nextContext);
    setInputValue('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  if (hideLauncher && !isOpen) return null;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && !hideLauncher && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Ask Nowa's Place Personal Shopping Assistant"
          data-testid="ask-nowas-launcher"
          className="fixed bottom-4 right-4 z-30 flex min-h-11 items-center gap-2.5 border border-[#171717] bg-[#171717] px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase shadow-lg transition-colors hover:bg-[#D8F36A] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] sm:bottom-6 sm:right-6"
        >
          <span className="flex h-5 w-5 items-center justify-center bg-[#D8F36A] text-[#171717]">
            <Sparkles className="h-3 w-3" />
          </span>
          <span>Ask Nowa&apos;s Place</span>
        </button>
      )}

      {/* Assistant Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label="Ask Nowa's Place Personal Shopping Assistant"
            data-testid="ask-nowas-panel"
            className="fixed bottom-4 right-4 z-40 flex h-[min(78vh,560px)] w-[calc(100vw-2rem)] max-w-[390px] flex-col border border-[#171717]/20 bg-white shadow-2xl sm:bottom-6 sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-[#171717] px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center bg-[#D8F36A] text-[#171717]">
                  <MessageSquare className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="font-display text-sm font-bold tracking-wider uppercase">
                    Ask Nowa&apos;s Place
                  </p>
                  <p className="text-[11px] text-white/75">
                    Personal Styling &amp; Fit Assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Ask Nowa's Place assistant"
                className="flex h-9 w-9 items-center justify-center text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-[#FAF9F6] px-4 py-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#171717] text-white'
                        : 'border border-neutral-200 bg-white text-[#171717]'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-3 border border-neutral-200 bg-white p-2"
                        >
                          <button
                            type="button"
                            onClick={() => onQuickView(prod)}
                            className="h-14 w-12 shrink-0 overflow-hidden bg-[#F4F4F4]"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => onQuickView(prod)}
                              className="block w-full truncate text-left font-display text-xs font-semibold text-[#171717] hover:underline"
                            >
                              {prod.name}
                            </button>
                            <p className="text-[11px] text-neutral-500">{prod.category}</p>
                            <p className="mt-0.5 font-mono text-xs font-medium text-[#171717] tabular-nums">
                              {formatNaira(prod.priceNgn)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onQuickAdd(
                                prod,
                                prod.sizes[0] ?? 'One Size',
                                prod.colours[0]?.name ?? 'Default'
                              )
                            }
                            aria-label={`Add ${prod.name} to bag`}
                            className="flex h-9 shrink-0 items-center gap-1 bg-[#171717] px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.quickActions.map((qa) => (
                        <button
                          key={qa.type + qa.label}
                          type="button"
                          onClick={() => {
                            if (qa.type === 'view-location' || qa.type === 'open-style-finder' || qa.type === 'browse-shop' || qa.type === 'open-cart') {
                              setIsOpen(false);
                              onAction(qa.type);
                            }
                          }}
                          className="inline-flex items-center gap-1 border border-[#171717]/25 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#171717] transition-colors hover:border-[#171717] hover:bg-[#D8F36A]"
                        >
                          <span>{qa.label}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Prompt Suggestions (shown at start or anytime cleanly) */}
              {messages.length <= 2 && (
                <div className="pt-1">
                  <p className="mb-1.5 text-[11px] font-medium tracking-wider text-neutral-500 uppercase">
                    Try asking:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ASK_NOWAS_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendQuery(suggestion)}
                        className="border border-neutral-300 bg-white px-2.5 py-1.5 text-left text-[11px] text-[#171717] transition-colors hover:border-[#171717] hover:bg-[#D8F36A]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-neutral-200 bg-white p-3"
            >
              <label htmlFor="ask-nowas-input" className="sr-only">
                Ask Nowa&apos;s Place a styling or shopping question
              </label>
              <input
                id="ask-nowas-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for outfits, prices, sizes, or store directions..."
                className="h-10 flex-1 border border-neutral-300 bg-[#FAF9F6] px-3 text-xs text-[#171717] placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-[#171717]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#171717] text-white transition-colors hover:bg-[#D8F36A] hover:text-[#171717]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
