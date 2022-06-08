import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'native-base';

import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import Toast from 'react-native-toast-message';

// Context 
import AuthGlobal from '../../Context/store/AuthGlobal';
import { loginUser } from '../../Context/actions/Auth.actions';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
var { height } = Dimensions.get("window");

const Login = (props) => {
    const context = useContext(AuthGlobal)
    const [email, setEmail] = useState('u2@gmail.com');
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState('11111111');
    const [error, setError] = useState('');

    useEffect(() => {
        // console.log(context.stateUser.isAuthenticated);
        if (context.stateUser.isAuthenticated === true) {
            props.navigation.navigate("User Profile")
        }
    }, [context.stateUser.isAuthenticated])

    const handleSubmit = () => {
        const user = {
            email,
            password
        }
        if (email === "" || password === "") {
            setError("Please fill your credentials")
        } else {
            loginUser(user, context.dispatch)
        }
    }
    return (
        <FormContainer title={"Login"} style={{ height: height }}>
            {/* <Input
                placeholder={"Phone"}
                name={"Phone"}
                value={phone}
                keyBoardType={"numeric"}
                onChangeText={(text) => setPhone(text)}
            /> */}
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
                value={password}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.buttonGroup}> 
                {error ? <Error message={error} /> : null}
                <EasyButton large primary onPress={() => handleSubmit()} >
                    <Text style={{ color: 'white' }}>Login</Text>
                </EasyButton>
            
                <Text style={styles.betweenText}>Don't have an account yet? </Text>

                <EasyButton large secondary onPress={() => props.navigation.navigate("Register")} >
                    <Text style={{ color: 'white' }}>Register</Text>
                </EasyButton>
            </View>
        </FormContainer>
    )
}


export default Login;


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