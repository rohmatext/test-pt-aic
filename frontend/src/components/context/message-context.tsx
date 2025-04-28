'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type MessageType = 'success' | 'error';

type Message = {
    type: MessageType;
    text: string;
};

type MessageContextType = {
    onMessage: (type: MessageType, message: string) => void;
};

const MessageContext = createContext<MessageContextType>({
    onMessage: () => {},
});

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState<Message>(Object.assign({}));

    const onMessage = (type: MessageType, text: string) => {
        setMessage({ type, text });
    };
    const clearMessage = () => {
        setMessage(Object.assign({}));
    };

    useEffect(() => {
        switch (message.type) {
            case 'success':
                toast.success(message.text);
                break;
            case 'error':
                toast.error(message.text);
                break;
        }

        const timeout = setTimeout(() => {
            clearMessage();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [message]);

    return <MessageContext.Provider value={{ onMessage }}>{children}</MessageContext.Provider>;
};

const useMessage = () => useContext(MessageContext);

export { MessageProvider, useMessage };
