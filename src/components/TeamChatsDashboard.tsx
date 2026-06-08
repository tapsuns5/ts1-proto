"use client";

import React from 'react';
import 'stream-chat-react/dist/css/v2/index.css';

const joinedChats = [
  {
    id: '1',
    teamName: "13U - AA",
    programName: "2025-26 Travel Program | 13",
    lastMessage: "This is a test message",
    date: "Last Friday",
    sportIcon: "https://ts-public-assets.teamsnap.com/sports/5/icon/v2/Q3N7Xt4HzM8Bu5ln90ywU.svg"
  },
  {
    id: '2',
    teamName: "Red",
    programName: "2025 Winter Basketball | 6-7",
    lastMessage: "Happening now - Game vs. Blue",
    date: "11/06/2025",
    sportIcon: "https://ts-public-assets.teamsnap.com/sports/5/icon/v2/Q3N7Xt4HzM8Bu5ln90ywU.svg",
    active: true
  }
];

const initialMessages = [
  {
    id: 'msg1',
    senderId: 'm1',
    senderName: 'Tyler Palmer',
    initials: 'E',
    text: 'Hey',
    timestamp: '04/22/2026',
    isDeleted: false
  },
  {
    id: 'msg2',
    senderId: 'm2',
    senderName: 'Tyler Palmer',
    initials: 'E',
    text: 'Hey',
    timestamp: '05/13/2026',
    isDeleted: false
  }
];

const memberColorMap: Record<string, string> = {
  S: '#0d9488', M: '#7c3aed', L: '#e11d48',
  D: '#4338ca', J: '#d97706', E: '#2563eb', T: '#0369a1',
};

const MY_MEMBER_ID = 'me';

const initialMembers = [
  { id: 'm1', name: 'Sarah Johnson', role: 'COACH', initials: 'SJ', muted: false },
  { id: 'm2', name: 'Mike Thompson', role: 'PARENT', initials: 'MT', muted: false },
  { id: 'm3', name: 'Lisa Chen', role: 'PARENT', initials: 'LC', muted: true },
  { id: 'm4', name: 'David Wilson', role: 'PARENT', initials: 'DW', muted: false },
  { id: 'm5', name: 'Jennifer Adams', role: 'PARENT', initials: 'JA', muted: false },
  { id: MY_MEMBER_ID, name: 'Tyler Palmer', role: 'PARENT', initials: 'TP', muted: false },
];

export default function TeamChatsDashboard() {
  const [activeChatId, setActiveChatId] = React.useState('2');
  const [messages] = React.useState(initialMessages);
  const [showSettings, setShowSettings] = React.useState(false);
  const [chatEnabled, setChatEnabled] = React.useState(true);
  const [members, setMembers] = React.useState(initialMembers);

  const toggleMute = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, muted: !m.muted } : m));
  };

  const activeChat = joinedChats.find(c => c.id === activeChatId) || joinedChats[0];
  const isMeMuted = members.find(m => m.id === MY_MEMBER_ID)?.muted ?? false;

  return (
    <div>
      <section 
        data-testid="team-chat-container"
        className="sui-bg-white sui-overflow-hidden sui-flex sui-shadow-1 sui-z-10 sui-relative sui-h-[calc(100dvh-65px)] sm:sui-h-[calc(100dvh-140px)]"
      >
        <div className="sui-flex-1 sui-h-full sui-overflow-hidden md:sui-overflow-y-auto">
          <div className="sui-bg-white sui-h-[calc(100dvh-80px)] md:sui-h-[calc(100dvh-140px)] sui-flex sui-flex-col sui-relative sui-transition-transform sui-duration-300 sui-ease-out -sui-translate-x-full md:-sui-translate-x-0 md:sui-flex-row">
            {/* Left Pane - Chat List */}
            <nav className="sui-w-full sui-h-[calc(100dvh-80px)] sui-flex sui-flex-col sui-border-r sui-border-solid sui-border-neutral-border md:sui-w-[40%] md:sui-max-w-[350px] md:sui-h-full">
              <div className="sui-body sui-font-bold sui-px-3 sui-py-2">Team Chats</div>
              <div className="sui-flex-1 sui-overflow-hidden">
                <section data-testid="team-chat-channel-list" className="sui-h-full sui-flex sui-flex-col sui-overflow-hidden sui-shadow-1">
                  {/* Search and Filter */}
                  <div className="sui-flex sui-gap-1 sui-pl-2 sui-pr-1 sui-pb-1 sui-py-2 sui-border-t sui-border-solid sui-border-neutral-border">
                    <div data-testid="search-input" className="sui-flex-1">
                      <div className="sui-relative sui-flex sui-items-center sui-bg-neutral-background-weak sui-border sui-border-neutral-border sui-rounded-lg sui-px-2 sui-py-1.5">
                        <span data-testid="input-left-icon" className="material-symbols-rounded sui-text-neutral-icon-medium sui-text-[20px] sui-mr-2">search</span>
                        <input 
                          id="search"
                          name="search"
                          data-testid="input-search"
                          type="text" 
                          placeholder="Search" 
                          className="sui-bg-transparent sui-border-none sui-flex-1 sui-text-sm focus:sui-outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <button 
                        className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 sui-text-admin-action-text hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px]"
                        data-testid="icon-button-component"
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                      >
                        <span data-testid="icon-component" className="material-symbols-rounded sui-text-[20px]">filter_list</span>
                      </button>
                    </div>
                  </div>

                  {/* Joined Chats Section */}
                  <div className="sui-text-center sui-p-1 sui-bg-neutral-background-weak sui-body-dense sui-font-bold">Joined Team Chats</div>
                  <div className="sui-flex sui-flex-col sui-flex-none sui-max-h-[40%] sui-overflow-auto">
                    {joinedChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={`sui-w-full sui-border-t sui-border-solid sui-border-neutral-border sui-p-1 last:sui-border-b sui-cursor-pointer sui-h-[125px] sui-items-center sui-justify-center ${activeChatId === chat.id ? 'sui-bg-[#E5F0FF]' : ''}`}
                      >
                        <div className="sui-relative sui-flex sui-items-center sui-gap-1 sui-justify-between sui-h-full">
                          <img src={chat.sportIcon} alt="sport icon" width="46" height="46" style={activeChatId === chat.id && !chatEnabled ? { filter: 'grayscale(1) opacity(0.5)' } : undefined} />
                          <div className="sui-flex-1 sui-flex sui-flex-col sui-overflow-hidden sui-gap-[8px]">
                            <div className="sui-pr-3 sui-pt-2">
                              <div title={chat.teamName} className="sui-text-[17px] sui-font-bold sui-overflow-hidden sui-text-ellipsis sui-whitespace-nowrap">{chat.teamName}</div>
                              <div title={chat.programName} className="sui-text-[14px] sui-text-ellipsis sui-overflow-hidden sui-whitespace-nowrap">{chat.programName}</div>
                              <div className="sui-h-2 sui-text-[#7E828B] sui-caption sui-overflow-hidden sui-pr-2">
                                {activeChatId === chat.id && !chatEnabled ? (
                                  <p className="sui-text-ellipsis sui-overflow-hidden sui-whitespace-nowrap sui-flex sui-items-center sui-gap-0.5">
                                    <span className="material-symbols-rounded" style={{ fontSize: '13px' }}>block</span>
                                    Chat disabled
                                  </p>
                                ) : (
                                  <p className="sui-text-ellipsis sui-overflow-hidden sui-whitespace-nowrap">{chat.lastMessage}</p>
                                )}
                              </div>
                            </div>
                            <div className="sui-h-2 sui-flex sui-justify-end sui-items-center sui-caption sui-gap-0.5">
                              {activeChatId === chat.id && !chatEnabled ? (
                                <span className="material-symbols-rounded sui-text-neutral-icon-medium" style={{ fontSize: '16px' }}>block</span>
                              ) : activeChatId === chat.id && isMeMuted ? (
                                <span
                                  className="sui-flex sui-items-center sui-gap-0.5 sui-font-bold sui-uppercase"
                                  style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B', borderRadius: '999px', padding: '1px 7px', letterSpacing: '0.04em' }}
                                >
                                  <span className="material-symbols-rounded" style={{ fontSize: '12px' }}>volume_off</span>
                                  Muted
                                </span>
                              ) : (
                                <time>{chat.date}</time>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Other Team Chats */}
                  <div className="sui-text-center sui-p-1 sui-bg-neutral-background-weak sui-body-dense sui-font-bold">Other Team Chats</div>
                  <div className="sui-flex-1 sui-overflow-auto">
                    <div className="sui-w-[80%] sui-px-1 sui-py-2 sui-text-center sui-flex sui-justify-center sui-items-center sui-flex-col sui-mx-auto">
                      No chats found matching your search criteria.
                    </div>
                  </div>
                </section>
              </div>
            </nav>

            {/* Right Pane - Chat View */}
            <div className="sui-w-full sui-translate-x-full sui-absolute sui-top-0 sui-left-0 sui-h-[calc(100dvh-80px)] sui-bg-white sui-z-50 md:sui-w-[60%] md:sui-flex-1 md:sui-static md:sui-h-full md:sui-translate-x-0">
              <div className="sui-h-full sui-w-full sui-relative">
                <div id="str-chat__channel" className="str-chat str-chat__theme-custom str-chat__channel">
                  <div className="str-chat__container">
                    <div className="str-chat__main-panel">
                      {/* Chat Header */}
                      <header className="sui-flex sui-items-center sui-justify-between sui-border-b sui-border-solid sui-border-neutral-border sui-p-2 sui-gap-1">
                        <img src={activeChat.sportIcon} alt="sport icon" width="46" height="46" />
                        <div className="sui-flex-1 sui-flex sui-flex-col sui-overflow-hidden">
                          <div title={activeChat.teamName} className="sui-body sui-font-bold sui-overflow-hidden sui-text-ellipsis sui-whitespace-nowrap">{activeChat.teamName}</div>
                          <div title={activeChat.programName} className="sui-caption sui-overflow-hidden sui-text-ellipsis sui-whitespace-nowrap">{activeChat.programName}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSettings(!showSettings)}
                          className={`sui-grid sui-place-content-center sui-rounded-full sui-border sui-transition-colors sui-h-[32px] sui-w-[32px] sui-min-w-[32px] sui-mr-1 ${showSettings ? 'sui-bg-neutral-background-medium sui-border-neutral-border sui-text-neutral-text' : 'sui-border-transparent sui-text-neutral-icon-medium hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed'}`}
                        >
                          <span className="material-symbols-rounded sui-text-[20px]">settings</span>
                        </button>
                        {!chatEnabled && (
                          <div className="sui-hidden md:sui-flex sui-items-center sui-gap-1 sui-text-neutral-text-medium sui-text-sm sui-mr-1">
                            <span className="material-symbols-rounded sui-text-[18px]">block</span>
                            <span>Chat disabled</span>
                          </div>
                        )}
                        <button type="button" data-testid="leave-team-chat-button" className="sui-hidden md:sui-flex sui-px-3 sui-py-1.5 sui-text-negative-text sui-text-sm sui-font-bold hover:sui-bg-negative-background-weak sui-transition-colors sui-bg-transparent sui-border-none sui-cursor-pointer sui-rounded-full">
                          Leave team chat
                        </button>
                        <button className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 hover:sui-border-admin-action-border hover:sui-bg-admin-action-background-weak-hover hover:sui-text-action-icon active:sui-bg-admin-action-background-weak-pressed sui-h-[32px] sui-w-[32px] sui-min-w-[32px] md:sui-hidden sui-text-neutral-text" type="button">
                          <span className="material-symbols-rounded sui-text-[20px]">more_vert</span>
                        </button>
                      </header>

                      {/* Messages Area */}
                      <div className="str-chat__main-panel-inner str-chat__message-list-main-panel">
                        <div className="str-chat__list" tabIndex={0}>
                          <div className="str-chat__message-list-scroll" data-testid="reverse-infinite-scroll">
                            <div className="str-chat__list__loading"></div>
                            <ul className="str-chat__ul">
                              {/* Date Separator */}
                              <li>
                                <div className="str-chat__date-separator" data-testid="date-separator">
                                  <hr className="str-chat__date-separator-line" />
                                  <div className="str-chat__date-separator-date">10/21/2025</div>
                                </div>
                              </li>

                              {/* Messages */}
                              {messages.map((msg) => (
                                <li key={msg.id} className="str-chat__li str-chat__li--single" data-testid="str-chat__li str-chat__li--single">
                                  <div className={`str-chat__message str-chat__message-simple str-chat__message--regular str-chat__message--received str-chat__message--other str-chat__message--has-text`}>
                                    <div className="str-chat__avatar str-chat__message-sender-avatar str-chat__avatar--one-letter" data-testid="avatar" role="button" title={msg.senderName}>
                                      <div className="str-chat__avatar-fallback" data-testid="avatar-fallback">{msg.initials}</div>
                                    </div>
                                    <div className="str-chat__message-inner" data-testid="message-inner">
                                      <div className="str-chat__message-simple__actions str-chat__message-options" data-testid="message-options">
                                        <div className="str-chat__message-simple__actions__action str-chat__message-simple__actions__action--options str-chat__message-actions-container" data-testid="message-actions">
                                          <button aria-expanded="false" aria-haspopup="true" aria-label="Open Message Actions Menu" className="str-chat__message-actions-box-button" data-testid="message-actions-toggle-button">
                                            <svg className="str-chat__message-action-icon" height="4" viewBox="0 0 11 4" width="11" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fillRule="nonzero"></path>
                                            </svg>
                                          </button>
                                        </div>
                                        <button aria-expanded="false" aria-label="Open Reaction Selector" className="str-chat__message-reactions-button" data-testid="message-reaction-action">
                                          <svg className="str-chat__message-action-icon" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
                                            <g clipRule="evenodd" fillRule="evenodd">
                                              <path d="M6 1.2C3.3 1.2 1.2 3.3 1.2 6c0 2.7 2.1 4.8 4.8 4.8 2.7 0 4.8-2.1 4.8-4.8 0-2.7-2.1-4.8-4.8-4.8zM0 6c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"></path>
                                              <path d="M5.4 4.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9zM8.4 4.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9zM3.3 6.7c.3-.2.6-.1.8.1.3.4.8.9 1.5 1 .6.2 1.4.1 2.4-1 .2-.2.6-.3.8 0 .2.2.3.6 0 .8-1.1 1.3-2.4 1.7-3.5 1.5-1-.2-1.8-.9-2.2-1.5-.2-.3-.1-.7.2-.9z"></path>
                                            </g>
                                          </svg>
                                        </button>
                                      </div>
                                      <div className="str-chat__message-reactions-host"></div>
                                      <div className="str-chat__message-bubble">
                                        <div className="str-chat__message-text" tabIndex={0}>
                                          <div className="str-chat__message-text-inner str-chat__message-simple-text-inner" data-testid="message-text-inner-wrapper">
                                            <div>{msg.text}</div>
                                          </div>
                                        </div>
                                        <div className="str-chat__message-error-icon">
                                          <svg data-testid="error" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="black" id="background"></path>
                                            <path d="M13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="str-chat__message-metadata">
                                      <span className="str-chat__message-simple-name">{msg.senderName}</span>
                                      <time className="str-chat__message-simple-timestamp" dateTime={msg.timestamp}>{msg.timestamp}</time>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {isMeMuted && (
                              <div className="sui-flex sui-items-start sui-gap-3 sui-mx-4 sui-my-3 sui-px-4 sui-py-3 sui-rounded-xl sui-text-sm sui-text-neutral-text-medium" style={{ background: '#f1f5f9' }}>
                                <span className="material-symbols-rounded sui-flex-shrink-0" style={{ fontSize: '20px', color: '#94a3b8', marginTop: '1px' }}>volume_off</span>
                                <span>You have been muted by your organization. You can read messages but cannot reply.</span>
                              </div>
                            )}
                            <div></div>
                          </div>
                        </div>
                        <div className="str-chat__list-notifications"></div>
                        <div className="str-chat__dialog-overlay" data-testid="str-chat__dialog-overlay" style={{ ['--str-chat__dialog-overlay-height' as string]: '0' }}></div>

                        {/* Message Input */}
                        <div data-testid="message-input-container">
                          {isMeMuted ? (
                            <div className="sui-flex sui-items-start sui-gap-3 sui-px-4 sui-py-3 sui-border-t sui-border-neutral-border sui-text-sm" style={{ background: '#FFFBEB', color: '#92400E' }}>
                              <span className="material-symbols-rounded sui-flex-shrink-0" style={{ fontSize: '20px', color: '#D97706', marginTop: '1px' }}>volume_off</span>
                              <span>You have been muted by your organization. Contact your team admin if you think this is an error.</span>
                            </div>
                          ) : !chatEnabled ? (
                            <div className="sui-flex sui-items-center sui-gap-3 sui-px-4 sui-py-3 sui-border-t sui-border-neutral-border sui-text-neutral-text-medium sui-text-sm">
                              <span className="material-symbols-rounded sui-text-[20px] sui-flex-shrink-0">block</span>
                              <span>Chat has been disabled by your organization. Members cannot send or receive messages.</span>
                            </div>
                          ) : (
                            <>
                              <div className="sui-flex sui-items-center sui-justify-between sui-w-[800px] sui-pr-2">
                                <div role="presentation" tabIndex={0} className="str-chat__message-input sui-flex-1">
                                  <div className="str-chat__message-input-inner">
                                    <div className="str-chat__attachment-selector">
                                      <input type="file" accept="" aria-label="File upload" data-testid="file-input" id="file-upload" multiple className="str-chat__file-input" />
                                      <button aria-expanded="false" aria-haspopup="true" aria-label="aria/Open Attachment Selector" className="str-chat__attachment-selector__menu-button" data-testid="invoke-attachment-selector-button">
                                        <div className="str-chat__attachment-selector__menu-button__icon"></div>
                                      </button>
                                    </div>
                                    <div className="str-chat__message-textarea-container">
                                      <div className="str-chat__message-textarea-with-emoji-picker">
                                        <div className="rta str-chat__textarea str-chat__message-textarea-react-host">
                                          <textarea
                                            data-testid="message-input"
                                            aria-label="Type your message"
                                            placeholder="Type your message"
                                            rows={1}
                                            className="rta__textarea str-chat__textarea__textarea str-chat__message-textarea"
                                            style={{ height: '20px !important' }}
                                          ></textarea>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <button aria-label="Send" className="str-chat__send-button" data-testid="send-button" type="button" disabled>
                                  <svg data-testid="send" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <title>Send</title>
                                    <path d="M4.00952 22L24 12L4.00952 2L4 9.77778L18.2857 12L4 14.2222L4.00952 22Z"></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="sui-text-neutral-text-weak sui-text-[11px] sui-text-right sui-pr-[80px] sui-pb-1">
                                <span>0</span> / 5000
                              </div>
                            </>
                          )}
                        </div>
                        <div className="str-chat__dialog-overlay" data-testid="str-chat__dialog-overlay" style={{ ['--str-chat__dialog-overlay-height' as string]: '0' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Settings Panel */}
              {showSettings && (
                <div
                  className="sui-absolute sui-top-0 sui-right-0 sui-w-full sui-h-full md:sui-w-[360px] sui-bg-white sui-z-50 sui-flex sui-flex-col"
                  style={{ border: '1px solid #e2e8f0', boxShadow: '-4px 0 24px rgba(0,0,0,0.13)' }}
                >
                  {/* Header */}
                  <div className="sui-flex sui-items-center sui-justify-between sui-px-4 sui-py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <h3 className="sui-text-[16px] sui-font-bold sui-text-neutral-text">Chat Settings</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="sui-grid sui-place-content-center sui-rounded-full sui-border sui-border-transparent active:sui-scale-95 hover:sui-bg-admin-action-background-weak-hover sui-h-[28px] sui-w-[28px] sui-min-w-[28px] sui-text-neutral-icon-medium"
                    >
                      <span className="material-symbols-rounded sui-text-[18px]">close</span>
                    </button>
                  </div>

                  {/* Enable Team Chat Toggle */}
                  <div className="sui-px-4 sui-py-3 sui-flex sui-items-center sui-justify-between" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <div className="sui-flex-1 sui-pr-4">
                      <h4 className="sui-text-[14px] sui-font-bold sui-text-neutral-text" style={{ marginBottom: '2px' }}>Enable Team Chat</h4>
                      <p className="sui-text-[12px] sui-text-neutral-text-medium">Allow members to send messages in this chat</p>
                    </div>
                    <button
                      onClick={() => setChatEnabled(!chatEnabled)}
                      style={{
                        position: 'relative', width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0,
                        background: chatEnabled ? '#F97316' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: '2px', width: '20px', height: '20px', borderRadius: '50%',
                        background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s',
                        transform: chatEnabled ? 'translateX(22px)' : 'translateX(2px)',
                      }} />
                    </button>
                  </div>

                  {/* Team Members Header */}
                  <div className="sui-px-4 sui-py-1.5 sui-text-[11px] sui-font-bold sui-uppercase sui-tracking-wider" style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    Team Members
                  </div>

                  {/* Members List */}
                  <div className="sui-flex-1 sui-overflow-y-auto">
                    {members.map((member) => (
                      <div key={member.id} className="sui-px-4 sui-py-2 sui-flex sui-items-center sui-justify-between hover:sui-bg-neutral-background-weak sui-transition-colors" style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <div className="sui-flex sui-items-center sui-gap-2.5 sui-min-w-0 sui-flex-1">
                          <div
                            className="sui-flex sui-items-center sui-justify-center sui-font-bold sui-flex-shrink-0"
                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: memberColorMap[member.initials[0]] || '#64748b', color: 'white', fontSize: '11px' }}
                          >
                            {member.initials}
                          </div>
                          <div className="sui-flex sui-items-center sui-gap-1.5 sui-min-w-0">
                            <span className="sui-text-[14px] sui-font-bold sui-text-neutral-text sui-truncate sui-whitespace-nowrap">{member.name}</span>
                            <span
                              className="sui-uppercase sui-font-bold sui-flex-shrink-0"
                              style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: '#E8F0FE', color: '#1967D2', letterSpacing: '0.04em' }}
                            >
                              {member.role}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleMute(member.id)}
                          className="sui-flex sui-items-center sui-gap-1 sui-font-bold sui-flex-shrink-0"
                          style={{
                            padding: '5px 12px', borderRadius: '999px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
                            background: member.muted ? '#FEF3C7' : 'white',
                            border: member.muted ? '1.5px solid #F59E0B' : '1.5px solid #cbd5e1',
                            color: member.muted ? '#92400E' : '#374151',
                          }}
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>{member.muted ? 'volume_off' : 'volume_up'}</span>
                          {member.muted ? 'Muted' : 'Mute'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
