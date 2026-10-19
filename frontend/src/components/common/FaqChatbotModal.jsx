import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, CheckCircle2, Package, Clock } from 'lucide-react';
import { retentionService } from '../../services/retentionService';
import './FaqChatbotModal.css';

export const FaqChatbotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Kính chào quý khách đến với **Maison Douce Concierge**! Em là trợ lý trực tuyến của tiệm bánh, sẵn sàng hỗ trợ quý khách về menu bánh hôm nay, phí giao hàng, cách bảo quản hoặc tra cứu tiến độ đơn hàng.',
      time: 'Vừa xong',
    },
  ]);

  const [suggestedPrompts, setSuggestedPrompts] = useState([
    'Giờ & phí giao hàng',
    'Cách bảo quản bánh',
    'Dị ứng & Thành phần',
    'Bánh thiết kế riêng',
    'Địa chỉ cửa hàng',
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await retentionService.askConcierge(query.trim());
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.reply,
        category: response.matchedCategory,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
      if (response.suggestedPrompts && response.suggestedPrompts.length > 0) {
        setSuggestedPrompts(response.suggestedPrompts);
      }
    } catch (err) {
      const errorReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Dạ hiện hệ thống đang bận một chút, quý khách vui lòng liên hệ trực tiếp hotline **(028) 3822 5599** để được chuyên viên hỗ trợ ngay ạ!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text) => {
    // Simple markdown bold formatting
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-bakery-espresso">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="concierge-widget">
      {/* Floating Concierge Bubble */}
      {!isOpen && (
        <button
          className="concierge-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Mở Maison Douce Concierge"
          title="Trợ lý Boutique Concierge"
        >
          <div className="concierge-trigger-pulse" />
          <MessageSquare className="w-6 h-6 text-bakery-espresso" />
          <span className="concierge-trigger-label">Trợ Lý Tiệm Bánh</span>
        </button>
      )}

      {/* Concierge Window */}
      {isOpen && (
        <div className="concierge-window animate-scale-up">
          {/* Header */}
          <div className="concierge-header">
            <div className="flex items-center gap-3">
              <div className="concierge-avatar">
                <Sparkles className="w-5 h-5 text-bakery-caramel" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-bakery-espresso text-base flex items-center gap-2">
                  <span>Maison Douce Concierge</span>
                  <span className="online-indicator" title="Đang trực tuyến" />
                </h3>
                <p className="text-xs text-stone-500">Trợ lý giải đáp & hỗ trợ 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-700 transition p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="concierge-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`concierge-bubble-wrapper ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="bot-icon-small">
                    <Bot className="w-3.5 h-3.5 text-bakery-caramel" />
                  </div>
                )}
                <div
                  className={`concierge-bubble ${
                    msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {formatText(msg.text)}
                  </div>
                  <span className="bubble-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="concierge-bubble-wrapper justify-start">
                <div className="bot-icon-small">
                  <Bot className="w-3.5 h-3.5 text-bakery-caramel" />
                </div>
                <div className="concierge-bubble bubble-bot typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="concierge-prompts">
            <div className="text-[11px] font-medium text-stone-500 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-bakery-caramel" />
              <span>Gợi ý câu hỏi nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="prompt-chip"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="concierge-footer"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập câu hỏi hoặc mã đơn (MD-...)"
              className="concierge-input"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="concierge-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default FaqChatbotModal;
