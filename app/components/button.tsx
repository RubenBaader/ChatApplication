import React from 'react';
import {
    StyleSheet,
    ViewStyle,
    StyleProp,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
// import { sharedStyles, Colors } from '../assets/styles';

interface ButtonProps {
    style?: StyleProp<ViewStyle>;
    title: string;
    color?: string;
    disabled?: boolean;
    isLoading?: boolean;
    onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = props => {
    const { style, title, color, isLoading, disabled, onPress } = props;
    return (
        <View
            style={[
                styles.button,
                {
                    backgroundColor: color /* || Colors.blue */,
                    opacity: disabled ? 0.5 : 1.0,
                },
                style || {},
            ]}>
            <TouchableOpacity
                disabled={disabled || isLoading}
                onPress={onPress}>
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.title}>{title}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        paddingHorizontal: 25,
        borderRadius: 5,
        justifyContent: 'center',
    },
    title: {
        // ...sharedStyles.fontRoboto,
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        // color: "black",
    },
});
