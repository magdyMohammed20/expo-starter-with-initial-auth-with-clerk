import { TokenCache } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const createTokenCache = (): TokenCache => {
    return {
        async getToken(key: string) {
            try {
                const item = await SecureStore.getItemAsync(key);

                if (item) {
                    console.log(`${key} Was Used`)
                } else {
                    console.log(`No Values Stored Under Key ${key}`)
                }
                return item;
            } catch (err) {
                console.error("Error getting token from SecureStore", err);
                return null;
            }
        },

        async saveToken(key: string, value: string) {
            try {
                await SecureStore.setItemAsync(key, value);
            } catch (err) {
                console.error("Error saving token to SecureStore", err);
            }
        },

        async clearToken(key: string) {
            try {
                await SecureStore.deleteItemAsync(key);
            } catch (err) {
                console.error("Error clearing token from SecureStore", err);
            }
        },
    }
};

// Secure Store Not Supported For Web
export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined