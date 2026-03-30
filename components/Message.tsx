import { colors } from "@/utils/colors";
import { MessageProps } from "@/utils/types";
import { Image, StyleSheet, View } from "react-native";
import AppText from "./AppText";

const MessageComp = ({ content, isCurrentUser, userPhoto, senderName, createdAt }: MessageProps) => (
    <View style={[styles.row, { justifyContent: "flex-end", flexDirection: isCurrentUser ? 'row' : 'row-reverse' }]}>
        <View style={[styles.bubble, { backgroundColor: isCurrentUser ? colors.blue : colors.dark, minWidth: '80%' }]}>
            <View >
                <AppText style={{ color: colors.white, fontWeight: '800', fontSize: 12, marginBottom: 4 }}>
                    {senderName}
                </AppText>
                <AppText style={styles.text}>{content}</AppText>
            </View>

            <AppText style={{ position: 'absolute', bottom: 8, right: 10, color: colors.white, fontSize: 11 }}>
                {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </AppText>
        </View>
        <Image source={{ uri: userPhoto }} style={styles.avatar} />
    </View>
)

export default MessageComp

const styles = StyleSheet.create({
    row: {
        gap: 12,
        marginBottom: 12,
        width: "100%",

    },
    bubble: {
        padding: 12,
        borderRadius: 8,
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: colors.white,
        marginTop: 2,
        fontSize: 12
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginBottom: 4,
    },
})