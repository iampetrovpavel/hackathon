import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Power, PowerOff, Loader2, Play, AudioLines, VolumeX, Volume2, ArrowRight, Video } from 'lucide-react';
import { Button } from './ui/button';
import useWebRtcAi from '../hooks/useWebRtcAi';
import useAvatar from '../hooks/useAvatar';
import { useChatStore } from '../store/chat-store';
import { useRequestStore } from '../store/request-store';
import { Header } from './header';
import ReactMarkdown from 'react-markdown'
import { VoiceTranscription } from '../types';
import { useNavigate } from 'react-router-dom';

const ButtonText = ({ children }: { children: React.ReactNode }) => (
  <span className="hidden sm:flex sm:items-center p-0 m-0">
    {children}
  </span>
);

export function ChatInterface() {
  const webRtc = useWebRtcAi();
  const avatar = useAvatar({ language: 'en' });
  const { messages, addMessage, setIsConnected, setIsListening, clearMessages } = useChatStore();
  const { setProjectData } = useRequestStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [textMessage, setTextMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showAvatar, setShowAvatar] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    webRtc.setTranscriptionCallback((message) => {
      addMessage(message);
      
      // Make avatar speak when assistant responds
      if (message.role === 'assistant' && avatar.stream && showAvatar) {
        avatar.handleSpeak(message.content);
      }
    });
  }, [webRtc, addMessage, avatar, showAvatar]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = async () => {
    clearMessages();
    await webRtc.init('default');
    setIsConnected(true);
    
    // Automatically show and start avatar when dialog starts
    if (!showAvatar) {
      setShowAvatar(true);
      
      // Mute assistant audio since we'll use the avatar
      // if (!webRtc.isAssistantMuted) {
      //   wasAssistantMuted.current = false;
      //   webRtc.toggleAssistantMute();
      // }
      
      // Start avatar session if not already started
      if (!avatar.stream) {
        avatar.startSession();
      }
    }
  };

  const handleDisconnect = () => {
    webRtc.disconnect();
    setIsConnected(false);
    setIsListening(false);
    
    if (avatar.stream) {
      avatar.endSession();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim()) return;

    const message: VoiceTranscription = {
      role: 'user',
      content: textMessage,
      timestamp: new Date()
    };
    addMessage(message);
    webRtc.sendTextMessage(textMessage);
    setTextMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          <div className={`flex-1 overflow-auto p-4 ${showAvatar ? 'w-1/2' : 'w-full'}`}>
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-sm ${message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900'
                      }`}
                  >
                    <div><ReactMarkdown>{message.content}</ReactMarkdown></div>
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {showAvatar && (
            <div className="w-1/2 border-l border-gray-200 bg-white overflow-hidden">
              <div className="h-full">
                {avatar.stream ? (
                  <div className="h-full flex justify-center items-center">
                    <video
                      ref={avatar.mediaStream}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    >
                      <track kind="captions" />
                    </video>
                  </div>
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <div className="text-center p-4">
                      {avatar.isLoadingSession ? (
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          <p className="mt-2">Loading avatar...</p>
                        </div>
                      ) : (
                        <Button 
                          onClick={avatar.startSession}
                          className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                        >
                          Start Avatar
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center gap-2">
              <Button
                onClick={webRtc.isConnected ? handleDisconnect : handleConnect}
                variant={webRtc.isConnected ? "destructive" : "default"}
                disabled={webRtc.isConnecting}
                className="min-w-[40px]"
              >
                {webRtc.isConnecting ? (
                  <>
                    <Loader2 className="sm:mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : webRtc.isConnected ? (
                  <>
                    <PowerOff className="sm:mr-2 h-4 w-4" />
                    <ButtonText>Disconnect</ButtonText>
                  </>
                ) : (
                  <>
                    <AudioLines className="sm:mr-2 h-4 w-4" />
                    Start dialog
                  </>
                )}
              </Button>
              {webRtc.isConnected && (
                <>
                  <Button
                    onClick={webRtc.toggleListening}
                    variant={webRtc.isListening ? "destructive" : "default"}
                    className="min-w-[40px]"
                  >
                    {webRtc.isListening ? (
                      <>
                        <MicOff className="sm:mr-2 h-4" />
                        <ButtonText>Stop Listening</ButtonText>
                      </>
                    ) : (
                      <>
                        <Mic className="sm:mr-2 h-4 w-4" />
                        <ButtonText>Start Listening</ButtonText>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={webRtc.toggleAssistantMute}
                    variant={webRtc.isAssistantMuted ? "destructive" : "default"}
                    className="min-w-[40px]"
                  >
                    {webRtc.isAssistantMuted ? (
                      <>
                        <VolumeX className="sm:mr-2 h-4 w-4" />
                        <ButtonText>Unmute Assistant</ButtonText>
                      </>
                    ) : (
                      <>
                        <Volume2 className="sm:mr-2 h-4 w-4" />
                        <ButtonText>Mute Assistant</ButtonText>
                      </>
                    )}
                  </Button>
                </>
              )}
              {/* {webRtc.projectData?.completed === true && ( */}
              <Button
                onClick={async () => {
                  setProjectData(webRtc.projectData!);
                  handleDisconnect();
                  clearMessages();
                  await webRtc.init('role_play');
                  setIsConnected(true);
                  
                  // Automatically show and start avatar when playing a game
                  if (!showAvatar) {
                    setShowAvatar(true);
                    
                    // Mute assistant audio since we'll use the avatar
                    // if (!webRtc.isAssistantMuted) {
                    //   wasAssistantMuted.current = false;
                    //   webRtc.toggleAssistantMute();
                    // }
                    
                    // Start avatar session if not already started
                    if (!avatar.stream) {
                      avatar.startSession();
                    }
                  }
                }}
                variant="secondary"
                className="min-w-[40px] bg-indigo-500 text-white"
              >
                <Play className="sm:mr-2 h-4 w-4" />
                <ButtonText>Play game</ButtonText>
              </Button>
              {/* )} */}
              
              <Button
                onClick={() => setShowAvatar(!showAvatar)}
                variant={showAvatar ? "outline" : "secondary"}
                className="min-w-[40px]"
              >
                <Video className="sm:mr-2 h-4 w-4" />
                <ButtonText>{showAvatar ? "Hide Avatar" : "Show Avatar"}</ButtonText>
              </Button>
            </div>

            {webRtc.isConnected && (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white text-black border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={!textMessage.trim()}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-20 p-0"
                >
                  Send
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {webRtc.error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
          {webRtc.error}
        </div>
      )}
    </div>
  );
}