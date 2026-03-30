import AppButton from '@/components/AppButton'
import AppInput from '@/components/AppInput'
import MessageComp from '@/components/Message'
import { appwriteConfig, client, db } from '@/utils/appwrite'
import { colors } from '@/utils/colors'
import { Message } from '@/utils/types'
import { useUser } from '@clerk/clerk-expo'
import Octicons from '@expo/vector-icons/Octicons'
import { useHeaderHeight } from '@react-navigation/elements'
import { ID, Query } from 'appwrite'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatDetails = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const { id, title } = useLocalSearchParams()
    const headerHeight = Platform.OS === 'ios' ? useHeaderHeight() + 45 : 0
    const { user } = useUser()
    const navigation = useNavigation()
    const flatListRef = useRef<FlatList>(null)


    useEffect(() => {
        navigation.setOptions({ headerTitle: title + ' Chat' })
        getMessages()

        // Subscribe to realtime changes
        const unsubscribe = client.subscribe(
            `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.collections.messages}.documents`,
            () => {
                getMessages()
            }
        )

        return () => unsubscribe()
    }, [title])



    const getMessages = async () => {
        const { documents } = await db.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.collections.messages,
            [Query.equal('chatRoomId', id as string), Query.limit(100), Query.orderAsc('$createdAt')]
        )
        setMessages(documents as Message[])

    }
    const updateDocument = async () => {
        await db.updateDocument(appwriteConfig.databaseId, appwriteConfig.collections.chatRooms, id as string, {
            $updatedAt: new Date().toISOString()
        })
    }
    const onSendMessage = async () => {
        if (!message.trim()) return // Don't send empty messages    

        try {
            const msg = {
                senderId: user?.id,
                senderName: user?.fullName,
                content: message,
                senderPhoto: user?.imageUrl,
                chatRoomId: id as string

            }

            await db.createDocument(appwriteConfig.databaseId, appwriteConfig.collections.messages, ID.unique(), msg)


        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setMessage('')
            updateDocument()
            //getMessages()
            // flatListRef.current?.scrollToEnd({ animated: true })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

            <KeyboardAvoidingView keyboardVerticalOffset={headerHeight} behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <FlatList
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ref={flatListRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false} data={messages} renderItem={({ item }) =>
                        <View style={{ alignSelf: item.senderId === user?.id ? 'flex-end' : 'flex-start', maxWidth: '70%' }}    >

                            <MessageComp
                                senderName={item.senderName}
                                createdAt={item.$createdAt}
                                userPhoto={item.senderPhoto}
                                content={item.content}
                                isCurrentUser={item.senderId === user?.id} />
                        </View>} />

                <View style={styles.sendContainer}>
                    <AppInput value={message} onChangeText={setMessage} placeholder='Type A Message' style={styles.input} containerStyle={{ flex: 1, }} />
                    <AppButton onPress={onSendMessage} style={{
                        backgroundColor: 'transparent', paddingHorizontal: 6
                    }}>
                        <Octicons name="paper-airplane" size={22} color={colors.blue} />
                    </AppButton>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default ChatDetails


const styles = StyleSheet.create({
    sendContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    input: {

        color: colors.gray,
        flexShrink: 0
    }
})