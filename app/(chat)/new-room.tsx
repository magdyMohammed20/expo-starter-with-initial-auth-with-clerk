import AppInput from '@/components/AppInput'
import AppText from '@/components/AppText'
import { appwriteConfig, db } from '@/utils/appwrite'
import { colors } from '@/utils/colors'
import { ID } from 'appwrite'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

const NewRoom = () => {
    const [roomDetails, setRoomDetails] = useState({ title: '', description: '' })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleCreateRoom = async () => {
        setIsLoading(true)
        try {
            const res = await db.createDocument(appwriteConfig.databaseId, appwriteConfig.collections.chatRooms, ID.unique(), roomDetails)
            console.log(res)
            router.push(`/`)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <Stack.Screen options={{
                headerRight: () => <>
                    <Pressable onPressIn={handleCreateRoom} disabled={roomDetails?.title.trim() == '' || isLoading} onPress={() => console.log(roomDetails)} style={{ paddingHorizontal: 12, ...(Platform.OS == 'android' && styles.androidBtnStyle) }}>
                        <AppText style={{ color: colors.white, fontSize: 14, fontWeight: '600' }}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </AppText>
                    </Pressable></>
            }} />
            <View style={styles.container}>
                <AppText style={styles.title}>New room</AppText>

                <View style={styles.formContainer}>
                    <View style={styles.inputsContainer}>
                        <AppInput
                            placeholder="Type room title..."
                            value={roomDetails.title}
                            onChangeText={(text) => setRoomDetails({ ...roomDetails, title: text })}
                        />

                        <AppInput
                            containerStyle={{ height: 150 }}

                            placeholder="Type a description..."
                            value={roomDetails.description}
                            onChangeText={(text) => setRoomDetails({ ...roomDetails, description: text })}
                        />
                    </View>


                </View>
            </View></>
    )
}

export default NewRoom

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        color: "#FFF",
        fontSize: 16,
    },
    formContainer: {
        gap: 12,
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 32,
    },
    inputsContainer: {
        gap: 18,
        marginTop: 16,


    },
    androidBtnStyle: { height: 32, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.blue }
})