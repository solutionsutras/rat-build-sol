import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'native-base';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

const Register = (props) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const register = () => {
        if (name === "" || email === "" || phone === "" || password === "") {
            setError("Please fill all the details correctly")
        }

        let user = {
            name: name,
            email: email,
            username: email,
            phone: phone,
            password: password,
            isAdmin: false
        }

        axios
            .post(`${baseUrl}users/register`, user)
            .then((res) => {
                if (res.status == 200) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Successful",
                        text2: "Please login into your account"
                    })
                    setTimeout(() => {
                        props.navigation.navigate("Login");
                    }, 500)
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again"
                })
            })
    }
    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Register"}>
                <Input
                    placeholder={"Full Name"}
                    name={"name"}
                    id={"name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input
                    placeholder={"Email ID"}
                    name={"email"}
                    id={"email"}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Phone No"}
                    name={"phone"}
                    id={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <View>
                    {error ? <Error message={error} /> : null}
                </View>

                <View style={styles.buttonGroup}> 
                    <EasyButton large primary onPress={() => register()} >
                        <Text style={{ color: 'white' }}>Register</Text>
                    </EasyButton>
                    
                    <Text style={styles.betweenText}>Already have an account? </Text>

                    <EasyButton large secondary onPress={() => props.navigation.navigate("Login")} >
                        <Text style={{ color: 'white' }}>Back to Login</Text>
                    </EasyButton>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}


export default Register;


const styles = StyleSheet.create({
    buttonGroup: {
        marginTop:40,
        width: '80%',
        alignItems: 'center',
    },
    betweenText: {
        marginTop:20,
        marginBottom:5,
        alignSelf: 'center',
    }
})