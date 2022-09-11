import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'native-base';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import { colors } from '../../assets/global/globalStyles';

const Register = (props) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('Odisha');
    const [country, setCountry] = useState('India');
    const [pin, setPin] = useState('');
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
        //   userRoll: 'user',
          address: address,
          city: city,
          pin,
          pin,
          state: state,
          country: country,
        };

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
                    placeholder={"Phone No"}
                    name={"phone"}
                    id={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Email ID"}
                    name={"email"}
                    id={"email"}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    placeholder={"Address"}
                    name={"address"}
                    id={"address"}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                <View style={styles.inLine}>
                    <TextInput
                        style={[styles.input45, styles.inputNormal]}
                        placeholder={"City"}
                        name={"city"}
                        id={"city"}
                        value={city}
                        onChangeText={(text) => setCity(text)}
                    />
                    <TextInput
                        style={[styles.input45, styles.inputNormal]}
                        placeholder={"PIN"}
                        name={"pin"}
                        id={"pin"}
                        value={pin}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setPin(text)}
                    />
                </View>
                <View style={[styles.inLine, {marginTop:10, justifyContent:'flex-start'}]}>
                    <Text style={styles.normal18}>State: </Text>
                    <TextInput
                    style={styles.bold18}
                        placeholder={"State"}
                        name={"state"}
                        id={"state"}
                        value={state}
                        onChangeText={(text) => setState(text)}
                    />
                    <Text style={styles.normal18}>,  Country: </Text>
                    <TextInput
                        style={styles.bold18}
                        placeholder={"Country"}
                        name={"country"}
                        id={"country"}
                        value={country}
                        onChangeText={(text) => setCountry(text)}
                    />
                </View>
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
        marginTop: 40,
        width: '80%',
        alignItems: 'center',
    },
    betweenText: {
        marginTop: 20,
        marginBottom: 5,
        alignSelf: 'center',
    },
    inLine: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    input45: {
        width: '48%',
        height: 48,
        margin: 10,
        paddingLeft: 15,
    },
    inputNormal:{
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.buttons,
    },
    inputProtected:{
        backgroundColor: 'transparent',
    },
    normal18:{fontSize:18,},
    bold18:{fontWeight:'bold', fontSize:18,},
})