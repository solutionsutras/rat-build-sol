import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'native-base';

import FormContainer from '../../Shared/Forms/FormContainer';
// import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
// import Toast from 'react-native-toast-message';

// Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { loginUser } from '../../Context/actions/Auth.actions';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../assets/global/globalStyles';

var { height } = Dimensions.get('window');

var frm = '';

const Login = (props) => {
  // console.log('props: ', props);
  if (props.route.params !== undefined) {
    if (
      props.route.params.fromNav !== '' ||
      props.route.params.fromNav !== null
    ) {
      frm = props.route.params.fromNav;
    }
  }
  const context = useContext(AuthGlobal);
  const [userName, setUserName] = useState('u2@gmail.com');
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState('11111111');
  const [error, setError] = useState();

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      console.log('frm: ', frm);
      if (frm !== '') {
        props.navigation.navigate(`${frm}`);
      } else {
        props.navigation.navigate('User Profile');
      }
    }

    return () => {};
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
    <FormContainer style={{ height: height }}>
      <View style={styles.inputView}>
        <Text style={styles.inputViewText}>Email ID / Phone No</Text>
        <TextInput
          style={styles.input}
          placeholder={'Email ID/Phone No'}
          name={'userName'}
          id={'userName'}
          value={userName}
          onChangeText={(text) => setUserName(text.toLowerCase())}
        />
      </View>
      <View style={styles.inputView}>
        <Text style={styles.inputViewText}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder={'Password'}
          name={'password'}
          id={'password'}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
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

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ResetPassword');
          }}
        >
          <Text
            style={[
              styles.betweenText,
              { color: colors.buttons, textDecorationLine: 'underline' },
            ]}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
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
  inputView: {
    justifyContent: 'flex-start',
    width: '75%',
  },
  inputViewText: {
    fontStyle: 'italic',
    color: colors.grey1,
  },
  input: {
    height: 42,
    backgroundColor: 'white',
    marginTop: 0,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
    color: colors.grey2,
  },
});
