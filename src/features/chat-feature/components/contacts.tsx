import React from 'react';
import contactsHook from './contacts.hook';
import { Dialog } from '@headlessui/react'

const Contacts = (props: any) => {
    const { avatarInitial, contact, selectedContact, onChange } = props

    const avatar = React.useMemo(() => {
        if (contact) {
            return avatarInitial(contact.name)
        } else {
            return ""
        }
    }, [contact])

    return (
        <button
            onClick={() => {
                onChange(contact)
            }}
            className={`flex flex-row items-center rounded-xl lg:mr-3 p-2 ${selectedContact?._id === contact._id ? "bg-gray-100" : ""}`}
        >
            <div className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">{avatar}</div>
            <div className="ml-2 text-sm font-semibold">{contact.name}</div>
        </button>
    )
}

export default (props: any) => {
    const { avatarInitial, onClose, onSelectMessageThread, onFetchMessageThreads } = props;
    const hook = contactsHook(onClose, onSelectMessageThread, onFetchMessageThreads);

    return (
        <div>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 min-h-[500px]">
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 flex justify-between">
                            <span>New Message</span>
                            <svg onClick={() => onClose(false)} className="h-5 w-5 text-[#363636] hover:opacity-50" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </Dialog.Title>
                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-[#000000]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" value={hook.searchKeyWord} onChange={(e) => hook.setSearchKeyWord(e.target.value)} className="h-[41px] block w-full p-4 ps-10 text-sm text-gray-900 border border-[#E5E5E5] rounded-lg bg-[#F5F5F5]" placeholder="Search users" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-1 mb-4 sm:mb-0 mt-4 -mx-2 h-[346px] overflow-y-auto">
                    {
                        hook.filteredContacts.map((contact, index) => {
                            return (
                                <Contacts
                                    key={index}
                                    onChange={(contact) => {
                                        hook.setSelectedContact(contact)
                                    }}
                                    contact={contact}
                                    selectedContact={hook.selectedContact}
                                    avatarInitial={avatarInitial}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className="bg-[#FFFFFF] px-4 py-3 flex flex-row-reverse sm:px-6"
                style={{ borderTop: '2px solid #E5E5E5' }}>
                <button
                    onClick={hook.handleCreateMessageThread}
                    type="button"
                    disabled={!hook.selectedContact || hook.createMessageThreadLoading}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-[#3E3E3E] px-3 py-2 text-sm font-semibold text-[#FFFFFF] shadow-sm ring-1 ring-gray-200 sm:mt-0 sm:w-auto border-[#E3E3E3] disabled:bg-gray-200"
                >
                    {
                        hook.createMessageThreadLoading ? (
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-6 h-3 text-white-200 animate-spin dark:text-white-600 fill-white-600 dark:fill-white-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className='pl-2'>Starting Conversation</span>
                            </div>
                        ) : (
                            "Start Conversation"
                        )
                    }
                </button>
                <button
                    type="button"
                    className="mt-3 mr-[12px] inline-flex w-full justify-center rounded-md bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#3E3E3E] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto border-[#E3E3E3]"
                    onClick={() => onClose(false)}
                    ref={hook.cancelButtonRef}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}