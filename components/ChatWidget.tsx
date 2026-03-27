import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot, Minus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from './Toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m here to help with questions about Dr. Triplett\'s books, academic services, publications, and more. You can ask about Faculty Strategy, Dissertation Support, the AI leadership books, or anything else. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        const messageStartTime = new Date();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '',
            timestamp: messageStartTime,
          },
        ]);

        let buffer = '';
        let streamCompleted = false;

        while (!streamCompleted) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            const lines = event
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean);

            for (const line of lines) {
              if (!line.startsWith('data:')) continue;

              const payload = line.slice(5).trim();
              if (!payload) continue;

              try {
                const data = JSON.parse(payload);

                if (data.error) {
                  throw new Error(data.error);
                }

                if (typeof data.text === 'string' && data.text.length > 0) {
                  assistantMessage += data.text;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                      timestamp: messageStartTime,
                    };
                    return newMessages;
                  });
                }

                if (data.done) {
                  streamCompleted = true;
                  break;
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line, e);
              }
            }
            if (streamCompleted) break;
          }
        }

        if (!streamCompleted && buffer.trim().startsWith('data:')) {
          const payload = buffer.trim().slice(5).trim();
          if (payload) {
            try {
              const data = JSON.parse(payload);
              if (typeof data.text === 'string' && data.text.length > 0) {
                assistantMessage += data.text;
              }
            } catch (e) {
              console.warn('Failed to parse trailing SSE data:', buffer, e);
            }
          }
        }

        if (assistantMessage) {
          setMessages((prev) => {
            const newMessages = [...prev];
            if (newMessages.length > 0) {
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: assistantMessage,
                timestamp: messageStartTime,
              };
            }
            return newMessages;
          });
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      showToast(error.message || 'Interrupted connection with the AI assistant.', 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again or use the contact form to reach Dr. Triplett directly.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I\'m here to help with questions about Dr. Triplett\'s books, academic services, publications, and more. You can ask about Faculty Strategy, Dissertation Support, the AI leadership books, or anything else. What would you like to know?',
        timestamp: new Date(),
      },
    ]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-brand-primary hover:bg-brand-dark text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <MessageCircle size={28} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask the AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 w-full h-[100svh] bg-white rounded-none shadow-2xl flex flex-col overflow-hidden border-0 animate-[slideUp_0.3s_ease-out] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-md sm:h-[600px] sm:rounded-2xl sm:border sm:border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-dark text-white p-3 sm:p-4 flex items-center justify-between pt-[max(0.75rem,env(safe-area-inset-top))] flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/static/AI_icon.png" alt="AI" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm truncate">Triplett Professional Intelligence Ecosystem</h3>
                <p className="text-xs text-white/80">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-white/90 hover:text-white"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Minimize chat"
              >
                <Minus size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white'
                      : 'bg-white border-2 border-brand-primary/20'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <img src="/static/AI_icon.png" alt="AI" className="w-full h-full object-cover" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[85%] sm:max-w-[80%] ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-brand-primary text-white rounded-tr-sm'
                        : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-p:text-slate-700 prose-strong:text-brand-dark prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-code:text-brand-primary prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-ul:list-disc prose-ol:list-decimal prose-li:text-slate-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-brand-primary/20 text-brand-primary">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100">
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                </div>
              </div>
            )}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-1.5 px-11 mt-1 animate-[fadeInUp_0.3s_ease-out]">
                {['Book overview', 'Academic consulting', 'How to contact?'].map((faq) => (
                  <button 
                    key={faq}
                    onClick={() => handleSendMessage(faq)}
                    className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/20 hover:text-brand-primary transition-all duration-200 font-medium shadow-sm"
                  >
                    {faq}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all disabled:opacity-50 text-sm text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
