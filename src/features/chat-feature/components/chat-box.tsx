import { useLogin } from '@magicjs.dev/frontend';
import React from 'react';
import useChatBoxHook from './chat-box.hook';
import EmptyStateIcon from "../assets/icons/welcome-icon.svg";
import MessageIcon from "../assets/icons/msg-icon.svg";

const Message = (props: any) => {
    const { data, avatarInitial, threadName } = props;
    const { current } = useLogin();
    const avatar = React.useMemo(() => {
        if (data) {
            return avatarInitial(threadName)
        } else {
            return ""
        }
    }, [threadName])

    return (
        <>
            {
                current.currentUser._id === data.senderId ? (
                    <div className="flex justify-end mb-2">
                        <div className="col-start-6 w-[70%] col-end-13 p-3 rounded-lg">
                            <div className="flex items-center justify-start flex-row-reverse">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 font-[auto] text-xs">
                                    You
                                </div>
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow" style={{ borderRadius: "12px 12px 0px 12px" }}>
                                    <div>{data.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex mb-2">
                        <div className="col-start-1 w-[70%] col-end-8 p-3 rounded-lg">
                            <div className="flex flex-row items-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[beige] flex-shrink-0">
                                    {avatar}
                                </div>
                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow" style={{ borderRadius: "12px 12px 12px 0px" }}>
                                    <div>{data.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default (props: any) => {
    const { selectedThread, getThreadNameFromThread, avatarInitial, onGoBack } = props;
    const hook = useChatBoxHook(selectedThread, getThreadNameFromThread)
    const avatar = React.useMemo(() => {
        if (selectedThread) {
            return avatarInitial(hook.threadName)
        } else {
            return ""
        }
    }, [hook.threadName])

    return (
        <>
            {!selectedThread ? (
                <div className='lg:flex hidden flex-col items-center justify-center w-full'>
                    <MessageIcon className="w-20 h-20 rounded-full mb-[15px]" />
                    <div className='text-[#777575] text-xs text-center'>Select a contact to send and view <br /> messages</div>
                </div>
            ) : (
                <div className={`lg:flex flex-col flex-auto py-6 pr-0`}>
                    <div className="pb-3 lg:pb-6 pl-0 lg:pl-6 pr-3 border-b border-[#e7e7e7] bg-grey-lighter flex flex-row justify-between items-center">
                        <div className="flex items-center">
                            <button
                                onClick={onGoBack}
                                className="lg:hidden flex hover:opacity-80 text-gray-800 font-bold mr-2 rounded inline-flex items-center"
                            >
                                <svg className="w-4 h-4 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                                </svg>
                            </button>
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 flex-shrink-0">
                                {avatar}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-semibold">
                                    {hook.threadName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {!hook.loading ? (
                        <>
                            {hook.messages.length > 0 ? (
                                <div className="flex-1 overflow-auto lg:h-[79vh] h-[75vh] flex flex-col-reverse" style={{ backgroundColor: "white" }}>
                                    <div className="py-2 px-3">
                                        {
                                            hook.messages.map((message, index) => {
                                                return (
                                                    <Message
                                                        avatarInitial={avatarInitial}
                                                        key={index}
                                                        data={message}
                                                        threadName={hook.threadName}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center lg:h-[79vh] h-[75vh]'>
                                    <EmptyStateIcon className="h-10 w-10 rounded-full mb-[13px]" />
                                    <div className='text-[#525252] text-base mb-[12px]'>Say Hi!</div>
                                    <div className='text-[#777575] text-xs text-center'>You can start a conversation by sending <br /> a message here</div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="flex lg:h-[79vh] h-[75vh] justify-center items-center" role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-row border-t border-[#e7e7e7] items-center h-16 rounded-b-xl bg-white w-full px-4">
                        <div className="flex-grow ml-4">
                            <div className="relative w-full">
                                <input
                                    value={hook.message}
                                    onChange={(e) => hook.setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && hook.message.trim() !== '') {
                                            hook.handleSendMessage();
                                        }
                                    }}
                                    type="text"
                                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <button
                                onClick={hook.handleSendMessage}
                                disabled={!hook.message.trim()}
                                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl text-white px-4 py-1 flex-shrink-0">
                                <span>Send</span>
                                <span className="ml-2">
                                    <svg
                                        className="w-4 h-4 transform rotate-45 -mt-px"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8">
                                        </path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}