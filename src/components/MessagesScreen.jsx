import React, { useState } from 'react';
import { 
  Send, ChevronLeft, Phone, CheckCheck, 
  ShieldCheck, MessageSquare 
} from 'lucide-react';
import { tg } from '../utils/telegram';

export default function MessagesScreen({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onOpenPropertyDetail,
  onBackToList
}) {
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConversationId);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    tg.haptic('medium');
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  // If in active chat room
  if (activeConv) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: '#F7F8FA' }}>
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E8ECEF',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                tg.haptic('light');
                onBackToList();
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <ChevronLeft size={22} color="#111315" />
            </button>

            <img
              src={activeConv.participant.avatar}
              alt={activeConv.participant.name}
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />

            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#111315', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {activeConv.participant.name}
                <ShieldCheck size={14} color="#12B886" />
              </div>
              <div style={{ fontSize: '11px', color: '#12B886', fontWeight: '600' }}>
                {activeConv.participant.onlineStatus || 'Tarmoqda'}
              </div>
            </div>
          </div>

          <a
            href={`tel:${activeConv.participant.phone || '+998901234567'}`}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#F7F8FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              border: '1px solid #E8ECEF'
            }}
          >
            <Phone size={16} color="#111315" />
          </a>
        </div>

        {/* Attached Property Card */}
        {activeConv.propertyTitle && (
          <div 
            onClick={() => onOpenPropertyDetail?.(activeConv.propertyId)}
            style={{
              margin: '10px 14px 4px 14px',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #E8ECEF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <img
              src={activeConv.propertyImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&auto=format&fit=crop&q=80'}
              alt="property"
              style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#111315', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeConv.propertyTitle}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#111315' }}>
                {activeConv.propertyPrice}
              </div>
            </div>
            <ExternalLink size={14} color="#7E858E" />
          </div>
        )}

        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeConv.messages.map((msg) => {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isMine ? 'flex-end' : 'flex-start',
                  maxWidth: '78%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isMine ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  background: msg.isMine ? '#111315' : '#FFFFFF',
                  color: msg.isMine ? '#FFFFFF' : '#111315',
                  padding: '10px 14px',
                  borderRadius: msg.isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: msg.isMine ? 'none' : '1px solid #E8ECEF'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#8E9297', marginTop: '3px', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {msg.time}
                  {msg.isMine && <CheckCheck size={12} color="#FFD400" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '10px 14px',
            background: '#FFFFFF',
            borderTop: '1px solid #E8ECEF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <input
            type="text"
            placeholder="Xabar yozing..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              flex: 1,
              background: '#F7F8FA',
              border: '1px solid #E8ECEF',
              borderRadius: '24px',
              padding: '10px 16px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: inputText.trim() ? '#FFD400' : '#E8ECEF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            <Send size={18} color="#111315" />
          </button>
        </form>
      </div>
    );
  }

  // Conversation List View
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', color: '#111315' }}>
          Xabarlar
        </h2>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#7E858E' }}>
          {conversations.length} ta suhbat
        </span>
      </div>

      {conversations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E8ECEF',
          marginTop: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFF9DB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <MessageSquare size={32} color="#FFD400" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111315', marginBottom: '6px' }}>
            Hozircha xabarlar yo‘q
          </h3>
          <p style={{ fontSize: '13.5px', color: '#7E858E', lineHeight: 1.5, marginBottom: '20px', maxWidth: '300px', margin: '0 auto 20px auto' }}>
            Sizga yoqqan e’lon tafsilotlaridan "Xabar yozish" tugmasini bosing va uy egasi bilan to‘g‘ridan-to‘g‘ri bog‘laning.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {conversations.map((conv) => {
          return (
            <div
              key={conv.id}
              onClick={() => {
                tg.haptic('light');
                onSelectConversation(conv.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8ECEF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={conv.participant.avatar}
                  alt={conv.participant.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                {conv.unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#FA5252',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff'
                  }}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#111315' }}>
                    {conv.participant.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#7E858E' }}>
                    {conv.lastTime}
                  </span>
                </div>

                <div style={{
                  fontSize: '13px',
                  color: conv.unreadCount > 0 ? '#111315' : '#7E858E',
                  fontWeight: conv.unreadCount > 0 ? '600' : '400',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {conv.lastMessage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
