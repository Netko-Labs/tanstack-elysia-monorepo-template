import { ConnectionStatus } from './connection-status/connection-status'
import { ImplementationInfo } from './implementation-info/implementation-info'
import { CHAT_PAGE_DESCRIPTION, CHAT_PAGE_TITLE, useChatExample } from './lib'
import { MembersList } from './members-list/members-list'
import { MessageList } from './message-list/message-list'
import { GuestNotice, SendMessageForm } from './send-message-form/send-message-form'

export function ChatExample() {
  const {
    currentUser,
    messages,
    members,
    isLoading,
    connectionStatus,
    messagesEndRef,
    sendMutation,
    handleSendMessage,
  } = useChatExample()

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{CHAT_PAGE_TITLE}</h1>
        <p className="text-muted-foreground">{CHAT_PAGE_DESCRIPTION}</p>
      </div>

      <ConnectionStatus status={connectionStatus} userName={currentUser?.name} />

      <MembersList members={members} />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        currentUserId={currentUser?.id}
        messagesEndRef={messagesEndRef}
      />

      {currentUser ? (
        <SendMessageForm onSubmit={handleSendMessage} isPending={sendMutation.isPending} />
      ) : (
        <GuestNotice />
      )}

      <ImplementationInfo />
    </div>
  )
}
