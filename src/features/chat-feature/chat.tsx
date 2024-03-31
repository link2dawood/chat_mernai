import { Link, LinkDisplay } from '@magicjs.dev/frontend';
import React from 'react';

export default function ChatWidget() {
    return (
        <LinkDisplay pageId='chat'>
            {
                ({ url }) => (
                    <Link to={url} className="hover:bg-gray-100 text-gray-900 block px-4 py-2 text-sm">
                        Inbox
                    </Link>
                )
            }
        </LinkDisplay>
    )
}