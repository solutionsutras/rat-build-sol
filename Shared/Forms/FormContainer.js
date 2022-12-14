import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text } from 'react-native';

var { width } = Dimensions.get("window");

const FormContainer = (props) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            {props.children}
        </ScrollView>
    )
}

export default FormContainer;

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        marginBottom: 400,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize:16,
        marginBottom:10,
    }
})