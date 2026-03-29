// components/AppButton.tsx
import React from 'react';
import {
    ActivityIndicator,
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface AppButtonProps {
    title?: string;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    loading?: boolean;
    disabled?: boolean;
    children?: React.ReactNode
}

const AppButton: React.FC<AppButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    loading = false,
    disabled = false,
    children
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.button,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : <View style={styles.content}>
                {children ? children : <Text style={[textStyle]}>{title}</Text>}
            </View>
            }
        </TouchableOpacity>
    );
};

export default React.memo(AppButton);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2B7FFF',
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 12,
        justifyContent: 'center',
    },

    disabled: {
        opacity: 0.6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
});