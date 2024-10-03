"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Initialize Firebase (ensure you replace with your actual config)
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCB_48kOpRT_P7Dy5WsVhZIJ0AMMd3yg4U",
    authDomain: "nextchatsapp.firebaseapp.com",
    projectId: "nextchatsapp",
  });
} else {
  firebase.app();
}

const db = firebase.firestore();

type Message = {
  text: string;
  createdAt: firebase.firestore.Timestamp | null;
  userName: string;
  replyTo?: string;
};

const Chat: React.FC = () => {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract username from query parameters using useSearchParams
  const username = searchParams.get("username") || "";

  useEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(messagesData);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          alert("Failed to fetch messages. Please check your Firebase setup.");
        }
      );

    return () => unsubscribe();
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      await db.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userName: username,
        replyTo: replyMessage ? replyMessage.text : null,
      });
      setNewMessage("");
      setReplyMessage(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleDoubleClick = (message: Message) => {
    setReplyMessage(message);
  };

  const formatTimestamp = (timestamp: firebase.firestore.Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
      <p className="text-3xl font-bold mb-4 m-4">Kido Official</p>
      <div className="overflow-y-auto flex-1 bg-neutral-900 p-4 rounded-lg shadow-inner">
        <p className="p-2 bg-green-400 border-green-700 border-b-4 text-green-800 rounded mb-3">
          Data Loading Completed.
        </p>
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${
                message.userName === username ? "justify-end" : "justify-start"
              }`}
              onDoubleClick={() => handleDoubleClick(message)}
            >
              <div
                className={`${
                  message.userName === username
                    ? "bg-purple-600 text-white border-b-4 border-purple-900"
                    : "bg-blue-500 text-white border-blue-800 border-b-4"
                } p-2 rounded-lg max-w-xs`}
              >
                {message.replyTo && (
                  <div className="bg-black bg-opacity-45 p-1 rounded-lg mb-1">
                    <span className="italic">{message.replyTo}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="block font-bold">{message.userName}</span>
                  <span className="timestamp text-white text-sm font-mono font-extralight">
                    {formatTimestamp(message.createdAt)}
                  </span>
                </div>
                <span>{message.text}</span>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef}></div>
        </ul>
      </div>
      <div className="flex my-6 mx-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border-gray-600 border-b-4 text-black rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="border-indigo-950 border-b-4 bg-indigo-600 active:bg-indigo-700 active:border-b-2 text-white font-bold py-2 px-4 rounded-r"
        >
          Send
        </button>
      </div>
      {replyMessage && (
        <div className="mx-4 mb-2 p-2 bg-neutral-900 rounded text-white">
          Replying to: <span className="font-bold">{replyMessage.text}</span>
          <button onClick={() => setReplyMessage(null)} className="ml-4 text-red-500">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chat />
    </Suspense>
  );
};

export default ChatPage;
