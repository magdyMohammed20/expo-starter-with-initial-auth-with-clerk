import AppButton from '@/components/AppButton'
import { useAuth } from '@clerk/clerk-expo'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
            >
                <View>


                    <AppButton
                        title='Sign Out'
                        textStyle={{ color: "#000" }}
                        onPress={handleSignOut}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})