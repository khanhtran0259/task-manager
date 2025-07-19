import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const Chat = () => {
      const [users, setUsers] = useState([]);
      const [selectedUser, setSelectedUser] = useState(null);
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState([]);
      const [currentUserId, setCurrentUserId] = useState(null);
      const messagesEndRef = useRef(null);
      const [unreadCounts, setUnreadCounts] = useState({});


      // 🔐 Lấy profile hiện tại
      useEffect(() => {
            const fetchProfile = async () => {
                  try {
                        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                        if (res.data) setCurrentUserId(res.data.id);
                  } catch (err) {
                        console.error("Error fetching profile:", err);
                  }
            };

            fetchProfile();
      }, []);

      // 👥 Lấy danh sách người dùng
      useEffect(() => {
            const fetchUsers = async () => {
                  try {
                        const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS_INCLUDE_ADMIN);
                        if (res.data) setUsers(res.data);
                  } catch (err) {
                        console.error("Error fetching users:", err);
                  }
            };

            fetchUsers();
      }, []);

      // 💬 Lấy lịch sử tin nhắn khi chọn người dùng
      useEffect(() => {
            const fetchMessages = async () => {
                  if (!selectedUser) return;
                  try {
                        const res = await axiosInstance.get(API_PATHS.MESSAGES.GET_MESSAGES(selectedUser.id));
                        if (res.data) setMessages(res.data);
                  } catch (err) {
                        console.error("Error fetching messages:", err);
                  }
            };

            fetchMessages();
      }, [selectedUser]);

      // 📡 Nhận tin nhắn mới từ Socket.IO
      useEffect(() => {
            const handleNewMessage = (msg) => {
                  const isSameConversation =
                        selectedUser &&
                        (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id);

                  const alreadyExists = messages.some((m) => m.id === msg.id);

                  if (isSameConversation && !alreadyExists) {
                        setMessages((prev) => [...prev, msg]);
                  } else if (msg.senderId !== currentUserId) {
                        setUnreadCounts((prev) => ({
                              ...prev,
                              [msg.senderId]: (prev[msg.senderId] || 0) + 1,
                        }));
                  }
            };

            socket.on("newMessage", handleNewMessage);

            return () => socket.off("newMessage", handleNewMessage);
      }, [selectedUser?.id, messages, currentUserId]);

      // ✉️ Gửi tin nhắn
      const handleSendMessage = async () => {
            if (!message.trim() || !selectedUser) return;
            try {
                  const res = await axiosInstance.post(API_PATHS.MESSAGES.SEND_MESSAGE, {
                        receiverId: selectedUser.id,
                        content: message,
                  });

                  const newMsg = res.data;

                  // Gửi qua socket để người nhận nhận được
                  socket.emit("sendMessage", newMsg);

                  // Không cần setMessages ở đây nữa (vì sẽ nhận qua socket)
                  setMessage('');
            } catch (err) {
                  console.error("Failed to send message:", err);
            }
      };
      useEffect(() => {
            if (messagesEndRef.current) {
                  messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
      }, [messages]);

      const handleSelectUser = (user) => {
            setSelectedUser(user);
            setUnreadCounts((prev) => {
                  const newCounts = { ...prev };
                  delete newCounts[user.id];
                  return newCounts;
            });
      };

      return (
            <DashboardLayout activeMenu="Message">
                  <div className="flex h-[calc(100vh-80px)] bg-white rounded-lg overflow-hidden shadow-md border">
                        <aside className="w-64 border-r px-4 py-6 bg-gray-50 overflow-y-auto">
                              <h2 className="text-lg font-semibold mb-4">Team Members</h2>
                              <ul className="space-y-3">
                                    {users
                                          .filter(user => user.id !== currentUserId) // 🔍 Ẩn chính mình
                                          .map(user => (
                                                <li
                                                      key={user.id}
                                                      onClick={() => handleSelectUser(user)}
                                                      className={`relative flex items-center gap-3 cursor-pointer hover:bg-gray-100 border border-gray-200 rounded-lg p-3 mb-3 transition-all ${selectedUser?.id === user.id ? 'bg-gray-100 border-blue-300' : ''
                                                            }`}
                                                >
                                                      <div className="relative">
                                                            <img
                                                                  src={user.imageUrl || '/default-avatar.png'}
                                                                  alt={user.name}
                                                                  className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                            {unreadCounts[user.id] > 0 && (
                                                                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                                                        {unreadCounts[user.id]}
                                                                  </span>
                                                            )}
                                                      </div>

                                                      <div className="flex flex-col">
                                                            <p className="font-medium leading-tight">{user.name}</p>
                                                            <p className="text-sm text-gray-500 truncate max-w-[160px]">{user.email}</p>
                                                      </div>
                                                </li>


                                          ))}
                              </ul>
                        </aside>

                        <main className="flex-1 p-6 flex flex-col">
                              <div className="flex-1 overflow-y-auto">
                                    {selectedUser ? (
                                          <div>
                                                <h2 className="text-xl font-semibold mb-4">Chatting with {selectedUser.name}</h2>
                                                <div className="flex flex-col gap-2">
                                                      {messages.length > 0 ? (
                                                            messages.map((msg, index) => {
                                                                  const uniqueKey = `${msg.id}-${msg.timestamp}-${index}`;
                                                                  const isLastMessage = index === messages.length - 1;

                                                                  return (
                                                                        <div
                                                                              key={uniqueKey}
                                                                              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.senderId === selectedUser.id
                                                                                          ? 'bg-gray-200 self-start'
                                                                                          : 'bg-blue-500 text-white self-end'
                                                                                    }`}
                                                                              ref={isLastMessage ? messagesEndRef : null} // 👈 Gắn ref vào tin nhắn cuối cùng
                                                                        >
                                                                              {msg.content}
                                                                        </div>
                                                                  );
                                                            })
                                                      ) : (
                                                            <div className="text-gray-600">No messages yet.</div>
                                                      )}
                                                </div>
                                          </div>
                                    ) : (
                                          <div className="text-center text-gray-400 mt-20">Select a team member to start chatting.</div>
                                    )}
                              </div>

                              <div className="mt-4 flex gap-2">
                                    <input
                                          type="text"
                                          placeholder="Type a message..."
                                          value={message}
                                          onChange={(e) => setMessage(e.target.value)}
                                          onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault(); 
                                                      handleSendMessage();
                                                }
                                          }}
                                          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                          disabled={!selectedUser}
                                    />
                                    <button
                                          onClick={handleSendMessage}
                                          disabled={!selectedUser}
                                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
                                    >
                                          Send
                                    </button>
                              </div>
                        </main>
                  </div>
            </DashboardLayout>
      );
};

export default Chat;
