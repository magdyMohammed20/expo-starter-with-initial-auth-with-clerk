import { colors } from '@/utils/colors'
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native'

interface AppInputProps extends TextInputProps {
    containerStyle?: ViewStyle
}

const AppInput = ({ containerStyle, ...props }: AppInputProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={styles.input}
                placeholderTextColor={colors.gray}
                {...props}
            />
        </View>
    )
}

export default AppInput

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.dark,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        color: colors.white,
        fontSize: 15,
        fontWeight: '500',
    },
})