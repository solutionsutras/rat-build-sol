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

import AsyncStorage from '@react-native-async-storage/async-storage';

var { height } = Dimensions.get('window');

var frm = '';

const Login = (props) => {
  if (
    props.route.params.fromNav !== '' ||
    props.route.params.fromNav !== null
  ) {
    frm = props.route.params.fromNav;
  }
  const context = useContext(AuthGlobal);
  const [userName, setUserName] = useState('u2@gmail.com');
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState('11111111');
  const [error, setError] = useState();
  const [fromNav, setFromNav] = useState();

  useEffect(() => {
    if (frm) {
      setFromNav(props.route.params.fromNav);
    }

    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate('User Profile', {
        params: { fromNav: frm },
      });
    }

    return () => {
      setFromNav();
    };
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      userId: userName,
      password: password,
    };
    if (userName === '' || password === '') {
      setError('Please fill your credentials');
    } else {
      loginUser(user, context.dispatch);
    }
    // props.navigation.goBack();
  };
  return (
    <FormContainer title={'Login'} style={{ height: height }}>
      <Text>{fromNav}</Text>
      {/* <Input
                placeholder={"Phone"}
                name={"Phone"}
                value={phone}
                keyBoardType={"numeric"}
                onChangeText={(text) => setPhone(text)}
            /> */}
      <Input
        placeholder={'Email ID/Phone No'}
        name={'userName'}
        id={'userName'}
        value={userName}
        onChangeText={(text) => setUserName(text.toLowerCase())}
      />
      <Input
        placeholder={'Password'}
        name={'password'}
        id={'password'}
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}

        <EasyButton large primary onPress={() => handleSubmit()}>
          <Text style={{ color: 'white' }}>Login</Text>
        </EasyButton>

        <Text style={styles.betweenText}>------------- OR -------------</Text>

        <EasyButton
          large
          primary
          onPress={() => {
            props.navigation.navigate('OtpLogin');
          }}
        >
          <Text style={{ color: 'white' }}>Login using OTP</Text>
        </EasyButton>

        <Text style={[styles.betweenText, { marginTop: 80 }]}>
          Don't have an account yet?{' '}
        </Text>

        <EasyButton
          large
          secondary
          onPress={() => props.navigation.navigate('Register')}
        >
          <Text style={{ color: 'white' }}>Register</Text>
        </EasyButton>
      </View>

      <View style={styles.buttonGroup}></View>
    </FormContainer>
  );
};

export default Login;

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  betweenText: {
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
});
