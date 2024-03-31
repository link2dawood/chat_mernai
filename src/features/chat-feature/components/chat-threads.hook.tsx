import React, { useState } from 'react';
import fetchMessageThreads from '../fetch-threads.server';
import { useLogin, useSocket } from '@magicjs.dev/frontend';

export default function () {
    const [threads, setThreads] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [createMessageThreadModalOpen, setCreateMessageThreadModalOpen] = useState(false);
    const { subscribe, joinRoom } = useSocket();
    const { current } = useLogin();
    const userId = current.currentUser._id

    const handleFetchMessageThreads = React.useCallback(() => {
        fetchMessageThreads()
            .then((res) => {
                setThreads(res);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    }, []);

    const updateUnreadMessagesCount = React.useCallback((threadId: string) => {
        const updatedThreads = threads.map((thread) => {
            if (thread._id === threadId) {
                thread.unreadMessagesCount = [];
            }
            return thread;
        });
        setThreads(updatedThreads);
    }, [threads]);

    React.useEffect(() => {
        handleFetchMessageThreads();
    }, []);

    React.useEffect(() => {
        const leave = joinRoom(`public/thread-${userId}`);
        return leave;
    }, []);

    React.useEffect(() => {
        const unsubscribe = subscribe(`refresh-thread-${userId}`, () => {
            handleFetchMessageThreads();
        });
        return unsubscribe;
    }, []);

    return {
        threads,
        loading,
        createMessageThreadModalOpen, setCreateMessageThreadModalOpen,
        handleFetchMessageThreads,
        updateUnreadMessagesCount
    }
}