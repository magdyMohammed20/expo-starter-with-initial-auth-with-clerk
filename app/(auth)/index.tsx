import AppButton from '@/components/AppButton'
import AppText from '@/components/AppText'
import { isClerkAPIResponseError, useSSO } from '@clerk/clerk-expo'
import { ClerkAPIError } from '@clerk/types'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

WebBrowser.maybeCompleteAuthSession()

const index = () => {

    const { startSSOFlow } = useSSO()
    const [errors, setErrors] = useState<ClerkAPIError[]>([])

    const handleSignInWithGoogle = async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: "oauth_google",
                redirectUrl: AuthSession.makeRedirectUri()
            })

            if (createdSessionId) {
                setActive!({ session: createdSessionId })
            } else {

            }
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                setErrors(error.errors)
            } else {
                console.log(error)
            }
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.innerContainer}>
                    <Image source={require('../../assets/images/logo.png')}
                        style={styles.imgStyle} />

                    <View>
                        <AppText style={styles.loginHeading}>
                            Modern Chat App
                        </AppText>
                        <AppText style={styles.loginText}>
                            The Best Chat App In The World
                        </AppText>
                    </View>
                </View>

                <View style={styles.btnsContainer}>
                    <AppButton
                        style={styles.googleBtn}
                        textStyle={{ color: "#000" }}
                        onPress={handleSignInWithGoogle}

                    >
                        <Image source={require('../../assets/images/google.png')} style={styles.googleImg} />
                        <AppText >
                            Sign In With Google
                        </AppText>
                    </AppButton>

                    <AppButton
                        title='Sign In With Passkey'
                        style={styles.googleBtn}
                        textStyle={{ color: "#000" }}
                        onPress={() => console.log('pressed')}

                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#000'
    },
    innerContainer: {
        alignItems: "center",
        gap: 30,
        flex: 1,
        paddingHorizontal: 16,


    },
    imgStyle: { width: 100, height: 130 },
    loginHeading: {
        color: "#FFF",
        fontSize: 32,
        fontWeight: 600
    },
    loginText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: 600,
        textAlign: "center",
        marginTop: 24
    },
    btnsContainer: {
        width: "100%",
        gap: 16,

    },
    googleBtn: {
        width: "100%",
        backgroundColor: "#FFF",
        gap: 10,
        display: "flex"
    },
    darkBtn: {
        backgroundColor: "#000"
    },
    googleImg: {
        width: 20,
        height: 20,

    }

})