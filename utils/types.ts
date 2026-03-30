interface ChatRoom {
    $id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


interface Message {
    id: string;
    createdAt: string;
    updatedAt: string;
    collectionId: string;
    databaseId: string;
    permissions: any[];
    content: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    chatRoomId: string;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    imageUrl: string;
}

interface MessageProps { content: string; isCurrentUser: boolean; userPhoto: string; senderName: string; createdAt: string }
export type { ChatRoom, Message, MessageProps, User };
