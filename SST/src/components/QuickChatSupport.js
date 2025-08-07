import React, { useState, useRef, useEffect } from 'react';
import './QuickChatSupport.css';

const QuickChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 Welcome to Sri Saravana Textile! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: [
        "Product Information",
        "Order Status", 
        "Shipping Details",
        "Technical Support"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickResponses = {
    "Product Information": {
      text: "I'd be happy to help with product information! 🧵\n\nWhat would you like to know about our tapes and wicks?",
      quickReplies: ["Material Types", "Size Guide", "Quality Standards", "Bulk Pricing"]
    },
    "Order Status": {
      text: "I can help you check your order status! 📦\n\nPlease provide your order number, and I'll look it up for you.",
      quickReplies: ["Track My Order", "Cancel Order", "Modify Order"]
    },
    "Shipping Details": {
      text: "Here's our shipping information: 🚚\n\n• Free shipping on orders over ₹8,000\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days\n• Cash on Delivery available",
      quickReplies: ["Delivery Areas", "Shipping Costs", "Express Delivery"]
    },
    "Technical Support": {
      text: "I'm here to help with technical questions! 🔧\n\nWhat specific technical information do you need?",
      quickReplies: ["Product Specifications", "Usage Guidelines", "Installation Help"]
    },
    "Material Types": {
      text: "We offer various materials: 📋\n\n• Cotton Tapes (100% Cotton)\n• Polyester Tapes (Durable, Washable)\n• Cotton-Poly Blends\n• Elastic Tapes\n• Herringbone Patterns\n\nWhich material interests you?",
      quickReplies: ["Cotton Products", "Polyester Products", "Elastic Options"]
    },
    "Size Guide": {
      text: "Our size range includes: 📏\n\n• Width: 6mm to 50mm\n• Thickness: 0.5mm to 3mm\n• Length: Custom lengths available\n• GSM: 80-300 range\n\nNeed specific dimensions?",
      quickReplies: ["Custom Sizes", "Standard Sizes", "Bulk Quantities"]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text.trim());
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userText) => {
    const lowerText = userText.toLowerCase();
    
    // Check for quick responses first
    if (quickResponses[userText]) {
      return {
        id: Date.now(),
        text: quickResponses[userText].text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: quickResponses[userText].quickReplies
      };
    }

    // Pattern matching for common queries
    let responseText = "";
    let quickReplies = [];

    if (lowerText.includes('price') || lowerText.includes('cost')) {
      responseText = "Our prices vary by product type and quantity! 💰\n\nFor current pricing:\n• Check individual product pages\n• Contact us for bulk discounts\n• Special rates for dealers\n\nWould you like specific pricing information?";
      quickReplies = ["Bulk Pricing", "Dealer Rates", "Product Catalog"];
    } else if (lowerText.includes('quality') || lowerText.includes('standard')) {
      responseText = "We maintain high quality standards! ✅\n\n• ISO certified materials\n• Rigorous quality control\n• Tested for durability\n• Eco-friendly options available\n\nQuality is our top priority!";
      quickReplies = ["Quality Certificates", "Testing Process", "Eco-Friendly Options"];
    } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
      responseText = "We offer reliable delivery options! 🚚\n\n• Pan-India delivery\n• Free shipping over ₹8,000\n• Express delivery available\n• Real-time tracking\n\nWhere do you need delivery?";
      quickReplies = ["Check Delivery Area", "Express Options", "Track Order"];
    } else if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email')) {
      responseText = "Here's how to reach us! 📞\n\n• Phone: +91-XXXXX-XXXXX\n• Email: info@srisaravanabextile.com\n• WhatsApp: Available\n• Live Chat: Right here!\n\nI'm here to help immediately!";
      quickReplies = ["WhatsApp Support", "Email Support", "Schedule Call"];
    } else if (lowerText.includes('thank') || lowerText.includes('thanks')) {
      responseText = "You're very welcome! 😊\n\nI'm glad I could help! Is there anything else you'd like to know about our products or services?";
      quickReplies = ["Browse Products", "More Questions", "Contact Sales"];
    } else {
      responseText = "I understand you're asking about that! 🤔\n\nLet me connect you with the right information. Could you please be more specific about what you need help with?";
      quickReplies = ["Product Info", "Order Help", "Technical Support", "Speak to Human"];
    }

    return {
      id: Date.now(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      quickReplies
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us!"
      >
        {isOpen ? '×' : '💬'}
        {!isOpen && <div className="chat-notification">1</div>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="agent-avatar">🧵</div>
              <div className="agent-details">
                <h4>Sri Saravana Support</h4>
                <span className="agent-status">🟢 Online • Usually replies instantly</span>
              </div>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div className="message-text">
                    {message.text.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < message.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                
                {message.quickReplies && (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        className="quick-reply"
                        onClick={() => handleSendMessage(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
                rows="1"
                disabled={isTyping}
              />
              <button 
                className="send-button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
              >
                🚀
              </button>
            </div>
            <div className="chat-footer">
              <span>Powered by Sri Saravana Textile Support</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickChatSupport;
