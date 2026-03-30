import AppButton from '@/components/AppButton'
import AppText from '@/components/AppText'
import { useAuth, useUser } from '@clerk/clerk-expo'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, StyleSheet, View } from 'react-native'

const profile = () => {
    const { signOut } = useAuth()
    const { user } = useUser()
    const { imageUrl, fullName, emailAddresses, passkeys } = user || {}
    const router = useRouter()

    const handleSignOut = () => {
        signOut()
        router.replace("/")
    }

    const handleAddPasskey = async () => {
        try {
            await user?.createPasskey({
                isSupported: async () => {
                    const result = await LocalAuthentication.hasHardwareAsync()
                    return result
                }
            })
        } catch (err) {
            Alert.alert('Error', 'Failed to add passkey')
        }
    }

    const handleDeletePasskey = (passkeyId: string) => {
        Alert.alert('Delete Passkey', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    try {
                        await user?.deletePasskey(passkeyId)
                    } catch (err) {
                        Alert.alert('Error', 'Failed to delete passkey')
                    }
                }
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} width={120} height={120} style={styles.avatar} />
            <AppText style={styles.name}>{fullName}</AppText>
            <AppText style={styles.email}>{emailAddresses?.[0]?.emailAddress}</AppText>

            {/* Passkeys */}
            <View style={styles.passkeysContainer}>
                <View style={styles.passkeysHeader}>
                    <AppText style={styles.passkeysTitle}>Passkeys</AppText>
                    <AppButton title='+ Add' style={styles.addButton} onPress={handleAddPasskey} />
                </View>

                {passkeys?.length === 0 && (
                    <AppText style={styles.noPasskeys}>No passkeys added yet</AppText>
                )}

                {passkeys?.map((passkey) => (
                    <View key={passkey.id} style={styles.passkeyRow}>
                        <AppText style={styles.passkeyName}>{passkey.name ?? 'Passkey'}</AppText>
                        <AppButton
                            title='Delete'
                            style={styles.deleteButton}
                            onPress={() => handleDeletePasskey(passkey.id)}
                        />
                    </View>
                ))}
            </View>

            <AppButton title='Sign Out' style={styles.signOutButton} onPress={handleSignOut} />
        </View>
    )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    avatar: {
        borderRadius: 60,
    },
    name: {
        color: 'white',
        fontSize: 22,
        fontWeight: '700',
        marginTop: 12,
    },
    email: {
        color: 'white',
        fontSize: 16,
        marginTop: 8,
    },
    passkeysContainer: {
        width: '100%',
        marginTop: 24,
    },
    passkeysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    passkeysTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    noPasskeys: {
        color: 'gray',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    passkeyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    passkeyName: {
        color: 'white',
        fontSize: 15,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    signOutButton: {
        backgroundColor: '#FFF',
        marginTop: 'auto',
        width: '100%',
    },
})