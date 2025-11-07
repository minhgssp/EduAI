import React, { useState, useRef, useEffect } from 'react';
import { useBuilder } from '../hooks/useBuilder';
import Loader from './Loader';
import { SidebarProps } from '../types';

// Make TypeScript aware of the globally available `marked` library from the CDN
declare const marked: any;

const Sidebar: React.FC<SidebarProps> = ({ isChatExpanded, setIsChatExpanded }) => {
  const { chatHistory, sendChatMessage, loadingStates, toggleSidebar } = useBuilder();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loadingStates.agent) {
      sendChatMessage(input);
      setInput('');
    }
  };

  const renderMessageContent = (text: string) => {
    if (typeof marked !== 'undefined') {
      const sanitizedHtml = marked.parse(text, { gfm: true, breaks: true });
      return { __html: sanitizedHtml };
    }
    return { __html: text.replace(/\n/g, '<br />') }; // Fallback for plain text
  };

  return (
    <div className="bg-white h-full flex flex-col rounded-xl shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">AI Assistant</h3>
        <div className="flex items-center space-x-2">
            <button onClick={() => setIsChatExpanded(!isChatExpanded)} className="text-gray-500 hover:text-gray-800" title={isChatExpanded ? "Collapse View" : "Expand View"}>
                {isChatExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" /></svg>
                )}
            </button>
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <div 
                className="text-sm prose"
                dangerouslySetInnerHTML={renderMessageContent(msg.text)}
              />
            </div>
          </div>
        ))}
        {loadingStates.agent && (
          <div className="flex justify-start">
             <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-gray-800">
               <Loader />
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for changes..."
            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={loadingStates.agent}
          />
          <button type="submit" disabled={loadingStates.agent} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg disabled:bg-gray-400 hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;