import React, { useState } from 'react';
import { useLogin, useSocket } from '@magicjs.dev/frontend';
import fetchLatestMessages from '../fetch-latest-messages.server';
import fetchMessages from '../fetch-messages.server';
import sendMessage from '../send-message.server';
import updateMessageStatus from '../update-message-status.server';

export default function (selectedThread, getThreadNameFromThread) {
    const [messages, setMessages] = useState<any>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const { subscribe, joinRoom } = useSocket();
    const { current } = useLogin();
    const userId = current.currentUser._id

    const latestMessageId = React.useMemo(() => {
        if (messages.length > 0) {
            return messages[messages.length - 1]._id
        } else {
            return 0
        }
    }, [messages])

    const handleFetchMessages = React.useCallback(() => {
        setLoading(true)
        fetchMessages(selectedThread?._id).then((res) => {
            setMessages(res)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [selectedThread])

    const handleFetchLatestMessage = React.useCallback(() => {
        fetchLatestMessages(selectedThread?._id, latestMessageId).then((latestMessages) => {
            setMessages([...messages, ...latestMessages]);
        });
    }, [latestMessageId])

    const handleSendMessage = React.useCallback(() => {
        sendMessage(message, selectedThread?._id).then((res) => {
            setMessage("");
            handleFetchLatestMessage();
        })
    }, [selectedThread, message])

    const threadName = React.useMemo(() => {
        if (selectedThread) {
            return getThreadNameFromThread(selectedThread)
        } else {
            return ""
        }
    }, [selectedThread])

    React.useEffect(() => {
        handleFetchMessages()
    }, [])

    React.useEffect(() => {
        messages.forEach(async (message) => {
            if (message.senderId !== userId && !message.isViewed) {
                await updateMessageStatus(message._id);
            }
        });
    }, [messages])

    React.useEffect(() => {
        const leave = joinRoom(`public/thread-${selectedThread?._id}`);
        return leave;
    }, [selectedThread]);

    React.useEffect(() => {
        if (selectedThread) {
            const unsubscribe = subscribe(`refresh-thread-${selectedThread?._id}`, () => {
                handleFetchLatestMessage()
            });
            return unsubscribe;
        }
    }, [selectedThread]);

    return {
        handleSendMessage,
        message, setMessage,
        messages,
        threadName,
        loading
    }
}