import { Protected, importUI } from '@magicjs.dev/frontend';
import React from 'react';
import useChatHook from './chat.hook';
import ChatBox from './components/chat-box';
import ChatThreads from './components/chat-threads';

const Header = importUI("@mern.ai/standard-header")

export default function Chat() {
    const hook: any = useChatHook();
    
    return (
        <Protected>
            <Header />
            <div className="flex w-full antialiased text-gray-800 sm:px-32 lg:px-40 px-4" style={{ height: "calc(100vh + -64px)" }}>
                <div className="flex flex-row h-full w-full">
                    <ChatThreads
                        selectedThread={hook.selectedThread}
                        getThreadNameFromThread={hook.getThreadNameFromThread}
                        avatarInitial={hook.avatarInitial}
                        onChange={
                            (thread) => {
                                hook.setSelectedThread(thread)
                            }
                        }
                    />
                    <ChatBox
                        key={hook.selectedThread?._id}
                        selectedThread={hook.selectedThread}
                        getThreadNameFromThread={hook.getThreadNameFromThread}
                        avatarInitial={hook.avatarInitial}
                        onGoBack={
                            () => {
                                hook.setSelectedThread(null)
                            }
                        }
                    />
                </div>
            </div>
        </Protected>
    )
}