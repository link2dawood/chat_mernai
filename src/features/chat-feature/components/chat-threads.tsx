import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useChatThreadsHook from './chat-threads.hook';
import Contacts from './contacts';

const ChatThread = (props: any) => {
    const { selectedThread, onChange, getThreadNameFromThread, avatarInitial, thread, updateUnreadMessagesCount } = props
    const unreadMsgCountObject = thread.unreadMessagesCount.find(item => item._id === thread._id) || {};
    const unreadCount = unreadMsgCountObject.count || 0;

    const threadName = React.useMemo(() => {
        if (thread) {
            return getThreadNameFromThread(thread)
        } else {
            return ""
        }
    }, [thread])

    const avatar = React.useMemo(() => {
        if (threadName) {
            return avatarInitial(threadName)
        } else {
            return ""
        }
    }, [threadName])

    const handleThreadClick = () => {
        onChange(thread);
        updateUnreadMessagesCount(thread._id);
    };

    return (
        <button
            onClick={handleThreadClick}
            className={`flex flex-row items-center rounded-xl lg:mr-3 p-2 hover:bg-gray-100 ${selectedThread?._id === thread._id ? "bg-gray-100" : ""}`}
        >
            <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">{avatar}</div>
            <div className="ml-2 text-sm font-semibold">{getThreadNameFromThread(thread)}</div>
            {unreadCount !== 0 ? (
                <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
                    {unreadCount}
                </div>
            ) : (
                null
            )}
        </button>
    )
}

export default (props: any) => {
    const { selectedThread, onChange, getThreadNameFromThread, avatarInitial } = props;
    const hook: any = useChatThreadsHook()

    return (
        <>
            {hook.threads.length !== 0 ? (
                <div className={`lg:flex flex-col py-8 lg:pr-[26px] lg:w-64 w-full bg-white flex-shrink-0 lg:border-r border-[#e7e7e7]  ${selectedThread ? "hidden" : ""}`}>
                    <div className="flex flex-row items-center justify-between h-12 w-full">
                        <div className="font-bold text-2xl">Your Chats</div>
                        <svg onClick={() => hook.setCreateMessageThreadModalOpen(true)} className="h-6 w-6 text-[#000000] cursor-pointer hover:opacity-50" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </div>
                    <div className="h-full flex flex-col mt-8">
                        <div className="flex flex-row items-center justify-between text-xs">
                            <span className="font-bold">Active Conversations</span>
                        </div>
                        <div className="flex flex-col space-y-1 mb-4 sm:mb-0 mt-4 -mx-2 lg:h-[596px] md:h-[75vh] h-[596px] overflow-y-auto">
                            {
                                hook.threads.map((thread, index) => {
                                    return (
                                        <ChatThread
                                            key={index}
                                            thread={thread}
                                            selectedThread={selectedThread}
                                            onChange={onChange}
                                            getThreadNameFromThread={getThreadNameFromThread}
                                            avatarInitial={avatarInitial}
                                            updateUnreadMessagesCount={hook.updateUnreadMessagesCount}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center lg:justify-start flex-col lg:pr-[26px] py-8 lg:w-64 w-full bg-white flex-shrink-0 lg:border-r border-[#e7e7e7]">
                    <div className='text-[#525252] text-base font-medium mb-[12px]'>No contacts to show</div>
                    <div className='text-[#777575] text-xs text-center'>Add contacts to start conversation</div>
                    <button
                        onClick={() => hook.setCreateMessageThreadModalOpen(true)}
                        className='flex items-center justify-center mt-[12px] border border-[#e7e7e7] font-bold rounded-full h-10 w-10 cursor-pointer hover:opacity-80'>
                        <svg className="h-6 w-6 text-[#000000]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                </div>
            )}
            <Transition.Root show={hook.createMessageThreadModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={hook.cancelButtonRef} onClose={hook.setCreateMessageThreadModalOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                                    <Contacts
                                        onClose={(value) => {
                                            hook.setCreateMessageThreadModalOpen(value)
                                        }}
                                        onSelectMessageThread={(thread) => {
                                            onChange(thread)
                                        }}
                                        onFetchMessageThreads={() => {
                                            hook.handleFetchMessageThreads()
                                        }}
                                        avatarInitial={avatarInitial}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}