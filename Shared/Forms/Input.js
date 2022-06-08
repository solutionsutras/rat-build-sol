import React from 'react';
import { TextInput, Dimensions, StyleSheet, } from 'react-native';
import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls';

var { width } = Dimensions.get("window");

const Input = (props) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            name={props.name}
            id={props.id}
            value={props.value}
            autoCorrect={props.autoCorrect}
            onChangeText={props.onChangeText}
            onFocus={props.onFocus}
            secureTextEntry={props.secureTextEntry}
            keyboardType={props.keyboardType}
            returnKeyType={props.returnKeyType}
        />
    )
}

export default Input;

const styles = StyleSheet.create({
    input: {
        width: '90%',
        height: 48,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft:15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.buttons,
    }
})