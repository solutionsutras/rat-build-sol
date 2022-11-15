import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button } from 'native-base';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import FormContainer from '../../Shared/Forms/FormContainer';
import Input from '../../Shared/Forms/Input';
import Error from '../../Shared/Error';
import AuthGlobal from '../../Context/store/AuthGlobal';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../assets/global/globalStyles';

const EditProfile = (props) => {
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
  const [profile, setProfile] = useState();
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (
      context.stateUser.isAuthenticated === false ||
      context.stateUser.isAuthenticated === null
    ) {
      props.navigation.navigate('Login');
    }
    return () => {};
  }, [context.stateUser.isAuthenticated]);

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {
      setToken();
    };
  }, []);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`${baseUrl}users/${context.stateUser.user.userId}`, config)
      .then((user) => {
        setProfile(user.data);
        console.log('profile: ', profile);
      })
      .catch((error) => console.log(error));
    return () => {
      setProfile();
    };
  }, [token]);

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={0}
      enableOnAndroid={true}
    >
      {profile ? (
        <FormContainer>
          <View style={styles.inLine}>
            <Text style={styles.title}>
              Edit your details and click on update
            </Text>
          </View>

          <View style={{ width: '90%' }}>
            <Text style={{ marginLeft: 5 }}>Name</Text>
            <TextInput
              style={[styles.input, styles.inputNormal]}
              placeholder={'Full Name'}
              name={'name'}
              id={'name'}
              value={profile.name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={{ width: '90%' }}>
            <Text style={{ marginLeft: 5 }}>Phone No</Text>
            <TextInput
              style={[styles.input, styles.inputNormal]}
              placeholder={'Phone No'}
              name={'phone'}
              id={'phone'}
              value={profile.phone}
              keyboardType={'numeric'}
              onChangeText={(text) => setPhone(text)}
            />
          </View>
          <View style={{ width: '90%' }}>
            <Text style={{ marginLeft: 5 }}>Email ID</Text>
            <TextInput
              style={[styles.input, styles.inputNormal]}
              placeholder={'Email ID'}
              name={'email'}
              id={'email'}
              value={profile.email}
              onChangeText={(text) => setEmail(text.toLowerCase())}
            />
          </View>
          {/* <Input
            placeholder={'Password'}
            name={'password'}
            id={'password'}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          /> */}
          <View style={{ width: '90%' }}>
            <Text style={{ marginLeft: 5 }}>Address</Text>
            <TextInput
              style={[styles.input, styles.inputNormal]}
              placeholder={'Address'}
              name={'address'}
              id={'address'}
              value={profile.address}
              onChangeText={(text) => setAddress(text)}
            />
          </View>
          <View style={styles.inLine}>
            <View style={styles.input50}>
              <Text style={{ marginLeft: 5 }}>City</Text>
              <TextInput
                style={styles.inputNormal}
                placeholder={'City'}
                name={'city'}
                id={'city'}
                value={profile.city}
                onChangeText={(text) => setCity(text)}
              />
            </View>
            <View style={styles.input50}>
              <Text style={{ marginLeft: 5 }}>PIN</Text>
              <TextInput
                style={styles.inputNormal}
                placeholder={'PIN'}
                name={'pin'}
                id={'pin'}
                value={profile.pin}
                keyboardType={'numeric'}
                onChangeText={(text) => setPin(text)}
              />
            </View>
          </View>
          <View style={styles.inLine}>
            <View style={styles.input50}>
              <Text style={{ marginLeft: 5 }}>State</Text>
              <TextInput
                style={styles.inputNormal}
                placeholder={'State'}
                name={'state'}
                id={'state'}
                value={profile.state}
                onChangeText={(text) => setState(text)}
              />
            </View>

            <View style={styles.input50}>
              <Text style={{ marginLeft: 5 }}>Country</Text>
              <TextInput
                style={styles.inputNormal}
                placeholder={'Country'}
                name={'country'}
                id={'country'}
                value={profile.country ? profile.country : 'India'}
                onChangeText={(text) => setCountry(text)}
              />
            </View>
          </View>

          <View>{error ? <Error message={error} /> : null}</View>

          <View style={styles.buttonGroup}>
            <EasyButton large primary onPress={() => updateProfile()}>
              <Text style={{ color: 'white' }}>Update</Text>
            </EasyButton>
          </View>
        </FormContainer>
      ) : null}
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  buttonGroup: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  inLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    width: '100%',
  },
  input50: {
    width: '50%',
  },
  inputNormal: {
    height: 42,
    margin: 5,
    paddingLeft: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
  },
  inputProtected: {
    backgroundColor: 'transparent',
  },
  normal18: { fontSize: 18 },
  bold18: { fontWeight: 'bold', fontSize: 18 },
});
