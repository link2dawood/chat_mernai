import React, { useState, useRef } from 'react';
import createMessageThread from '../create-message-thread.server';
import fetchContacts from '../fetch-contacts.server';

export default function (onClose, onSelectMessageThread, onFetchMessageThreads) {
    const [contacts, setContacts] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [createMessageThreadLoading, setCreateMessageThreadLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [searchKeyWord, setSearchKeyWord] = React.useState("");

    const filteredContacts = React.useMemo(() => {
        if (searchKeyWord !== "") {
            let searchTerm = searchKeyWord.toLowerCase();
            const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
            searchTerm = searchTerm.replace(regex, "");
            return contacts.filter((value) =>
                value.name.toLowerCase().match(new RegExp(searchTerm, "g"))
            );
        } else {
            return contacts;
        }
    }, [contacts, searchKeyWord]);

    const cancelButtonRef = useRef(null)

    const handleCreateMessageThread = React.useCallback(() => {
        setCreateMessageThreadLoading(true)
        if (selectedContact) {
            createMessageThread([selectedContact._id]).then((thread) => {
                onSelectMessageThread(thread)
                onFetchMessageThreads()
                onClose(false)
                setCreateMessageThreadLoading(false)

            }).catch(() => {
                setCreateMessageThreadLoading(false)
            })
        }
    }, [selectedContact])

    const fetchAllContacts = React.useCallback(() => {
        setLoading(true)
        fetchContacts().then((res) => {
            setContacts(res)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    React.useEffect(() => {
        fetchAllContacts()
    }, [])

    return {
        contacts,
        loading,
        cancelButtonRef,
        selectedContact, setSelectedContact,
        handleCreateMessageThread,
        createMessageThreadLoading,
        filteredContacts,
        searchKeyWord, setSearchKeyWord
    }
}