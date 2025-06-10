import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Yooo! What's good, my dude? 😎 Ready to chat with your favorite buddy? I know everything about YOU but ask me about world stuff and I'll probably just confuse myself! 😅",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check API health on component mount
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setIsOnline(true);
      }
    } catch (error) {
      console.log('API not available, using demo mode');
      setIsOnline(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let buddyResponse;
      
      if (isOnline) {
        // Call real API
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            user_name: 'buddy'
          })
        });

        if (response.ok) {
          const data = await response.json();
          buddyResponse = data.response;
        } else {
          throw new Error('API call failed');
        }
      } else {
        // Use demo responses
        buddyResponse = getDemoResponse(inputMessage);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      }

      const buddyMessage = {
        id: Date.now() + 1,
        text: buddyResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, buddyMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Yo dude, something went wrong! 😅 My brain's having a moment. Try again?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    const responses = {
      greet: [
        "Yooo what's up my dude! 😎 Just chillin' and ready to chat!",
        "Heyyy buddy! I'm doing great, just vibing and waiting to help you out!",
        "Sup bro! Living my best life as your virtual buddy! 🤘"
      ],
      advice: [
        "Dude, you should totally work on that coding project you've been putting off! Or maybe grab some pizza first... priorities, ya know? 🍕",
        "Bro, how about you hit up that new coffee place you mentioned? Or practice guitar - you've been slacking on that lately! 😏",
        "My Guy, you should definitely call your mom - she's probably wondering how you're doing! Then maybe binge that series you started?"
      ],
      generalKnowledge: [
        "Uhhhh... dude I have NO clue! 😅 My brain is like totally empty when it comes to that stuff!",
        "Bro, you're asking the wrong guy! I dunno squat about that kinda thing! 🤷‍♂️",
        "Haha man, I'm completely clueless about that! I only know stuff about YOU, remember? 😂",
        "Yooo that's way too smart for me dude! I just know you're awesome and that's about it! 🤪"
      ],
      personal: [
        "Oh snap, I know this one! You're into coding and you love working on cool projects! Plus you're always down for some good music! 🎵",
        "Dude, you're the tech-savvy person who loves learning new stuff! And don't get me started on your obsession with good coffee ☕",
        "Bro, you're all about that programming life! Always building cool stuff and being creative! That's what I love about you! 💻"
      ],
      default: [
        "Yo, that's interesting! Tell me more about what's going on with you, bro! 🤔",
        "Hmmm, not sure what to say about that dude, but I'm here for whatever you need! 😊",
        "Bro, you always keep me on my toes with these questions! What's really on your mind? 💭"
      ]
    };

    let category = 'default';
    
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('how are you')) {
      category = 'greet';
    } else if (msg.includes('what should i') || msg.includes('advice') || msg.includes('suggest') || msg.includes('do today')) {
      category = 'advice';
    } else if (msg.includes('president') || msg.includes('capital') || msg.includes('who is') || msg.includes('what is the') || msg.includes('when was') || msg.includes('where is')) {
      category = 'generalKnowledge';
    } else if (msg.includes('my hobbies') || msg.includes('about me') || msg.includes('what do i') || msg.includes('my interests')) {
      category = 'personal';
    }
    
    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendExampleMessage = (message) => {
    setInputMessage(message);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <div className={`status-indicator ${isOnline ? 'status-online' : 'status-offline'}`}>
            {isOnline ? 'Online' : 'Demo Mode'}
          </div>
          <div className="buddy-avatar">🤪</div>
          <h2>Your Buddy</h2>
          <p>Your lovable goofball friend who knows all about you!</p>
          <div className="example-questions">
            <button 
              className="example-btn" 
              onClick={() => sendExampleMessage('Hey buddy! How are you doing?')}
            >
              Say Hi
            </button>
            <button 
              className="example-btn" 
              onClick={() => sendExampleMessage('What should I do today?')}
            >
              Ask for advice
            </button>
            <button 
              className="example-btn" 
              onClick={() => sendExampleMessage('Who is the president of USA?')}
            >
              Test general knowledge
            </button>
            <button 
              className="example-btn" 
              onClick={() => sendExampleMessage('What are my hobbies?')}
            >
              Ask about me
            </button>
          </div>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.isUser ? 'user-message' : 'buddy-message'}`}
            >
              {message.text}
            </div>
          ))}
          
          {isLoading && (
            <div className="message buddy-message typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className="send-button" 
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;