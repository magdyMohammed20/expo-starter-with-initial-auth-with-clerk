import React from 'react';
import {
    StyleProp,
    Text,
    TextProps,
    TextStyle,
} from 'react-native';

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

const AppText: React.FC<AppTextProps> = ({
    children,
    style,
    ...rest
}) => {
    return (
        <Text style={style} {...rest}>
            {children}
        </Text>
    );
};

export default React.memo(AppText);