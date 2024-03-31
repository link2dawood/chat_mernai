import { useLogin } from '@magicjs.dev/frontend';
import React, { useState } from 'react';

export default function () {
    const [selectedThread, setSelectedThread] = useState(null);
    const { current } = useLogin()
    const getThreadNameFromThread = React.useCallback((thread) => {
        return thread.recipients.filter((recipient) => recipient.recipientId !== current.currentUser._id).map(recipient => recipient.recipientName).join(',');
    }, [])

    const avatarInitial = React.useCallback((threadName) => {
        return threadName.charAt(0).toUpperCase(threadName);
    }, [])

    return {
        selectedThread, setSelectedThread,
        getThreadNameFromThread,
        avatarInitial
    }
}