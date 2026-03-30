import { Client, Databases } from 'appwrite'

// ✅ validate env
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_APP_ID!
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!

if (!PROJECT_ID) {
    throw new Error("Appwrite App ID is not defined")
}

if (!DATABASE_ID) {
    throw new Error("Appwrite Database ID is not defined")
}

const appwriteConfig = {
    endpoint: 'https://nyc.cloud.appwrite.io/v1',
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collections: {
        chatRooms: "chatrooms",
        messages: "messages",
    },
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)


const db = new Databases(client)

export { appwriteConfig, client, db }

/*

import { Client, Databases } from 'appwrite'

// ✅ validate env
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_APP_ID!
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!

if (!PROJECT_ID) {
    throw new Error("Appwrite App ID is not defined")
}

if (!DATABASE_ID) {
    throw new Error("Appwrite Database ID is not defined")
}

const appwriteConfig = {
    endpoint: 'https://nyc.cloud.appwrite.io/v1',
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collections: {
        chatRooms: "chatrooms",
        messages: "messages",
    },
}

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)

// Tell Appwrite to use AsyncStorage instead of localStorage
client.setStorage({
    getItem: (key: string) => AsyncStorage.getItem(key),
    setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: (key: string) => AsyncStorage.removeItem(key),
})

const db = new Databases(client)

export { appwriteConfig, client, db }

*/