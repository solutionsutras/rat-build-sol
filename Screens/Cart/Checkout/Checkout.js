import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { Select, Button } from 'native-base';
import { Icon } from 'react-native-elements';
import FormContainer from '../../../Shared/Forms/FormContainer';
import Input from '../../../Shared/Forms/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import AuthGlobal from '../../../Context/store/AuthGlobal';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import Login from '../../User/Login';

const countries = require('../../../assets/data/countries.json');

const Checkout = (props) => {
  const context = useContext(AuthGlobal);
  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [pin, setPin] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [error, setError] = useState('');
  const [user, setUser] = useState();
  const [userProfile, setUserProfile] = useState();
  const [custName, setCustName] = useState();
  const [orderStatus, setOrderStatus] = useState('');

  var userData = [];
  // console.log('=========     start     =========');
  // console.log('props: ', props);
  useFocusEffect(
    useCallback(() => {
      setOrderItems(props.cartItems);

      // Get order status code for "pending"
      axios
        .get(`${baseUrl}orderstatus/getbytext/pending`)
        .then((res) => {
          setOrderStatus(res.data[0].statusCode);
        })
        .catch((error) => alert('Error in getting order status code'));

      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Please login to checkout ',
          text2: 'and place order',
        });
      } else {
        AsyncStorage.getItem('jwt')
          .then(async (res) => {
            axios
              .get(`${baseUrl}users/${context.stateUser.user.userId}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((resp) => {
                userData = resp.data;
                setUserProfile(userData);
                if (resp.data) {
                  setCustName(resp.data.name);
                  setPhone(resp.data.phone);
                  setAddress(resp.data.address);
                  setAddress2(resp.data.address2);
                  setCity(resp.data.city);
                  setPin(resp.data.pin);
                }
              });
          })
          .catch((error) => console.log(error));

        setUser(context.stateUser.user.userId);
      }
      setCountry('INDIA');
      setState('Odisha');

      return () => {
        setUserProfile();
        setOrderItems();
        setCustName();
        setPhone();
      };
    }, [])
  );

  const proceedToPayment = () => {
    let order = {
      city,
      country,
      custName,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: address2,
      state,
      pin,
      // status: '01',
      status: orderStatus,
      user: user,
    };
    props.navigation.navigate('OrderReview', { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer
      title={'Enter Shipping/Billing Address'}
      >
        <View>{error ? <Error message={error} /> : null}</View>
        <Input
          placeholder={'Name'}
          name={'custName'}
          value={custName}
          onChangeText={(text) => setCustName(text)}
        />
        <Input
          placeholder={'Phone'}
          name={'Phone'}
          value={phone}
          keyboardType={'numeric'}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={'Shipping Address 1'}
          name={'ShippingAddress1'}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={'Shipping Address 2'}
          name={'ShippingAddress2'}
          value={address2}
          onChangeText={(text) => setAddress2(text)}
        />
        <Input
          placeholder={'City'}
          name={'City'}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={'PIN Code'}
          name={'PIN'}
          value={pin}
          keyboardType={'numeric'}
          onChangeText={(text) => setPin(text)}
        />
        <Input
          placeholder={'State'}
          name={'State'}
          value={state}
          onChangeText={(text) => setState(text)}
        />
        <Input
          placeholder={'Country'}
          name={'Country'}
          value={country}
          onChangeText={(text) => setCountry(text)}
        />
        {/* <Select
                    placeholder="Select your country"
                    selectedValue={country}
                    style={styles.select}
                    placeholderTextColor={'#007AFF'}
                    onValueChange={(e) => setCountry(e)}
                >
                    {countries.map((c) => {
                        return <Select.Item label={c.name} value={c.name} key={c.code} />
                    })}
                </Select> */}
        <View style={{ width: '80%', alignItems: 'center' }}>
          <EasyButton large primary onPress={() => proceedToPayment()}>
            <Text style={{ color: 'white' }}>Next</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};
export default connect(mapStateToProps)(Checkout);

const styles = StyleSheet.create({
  select: {
    width: '90%',
    height: 60,
    backgroundColor: 'white',
    margin: 10,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.buttons,
  },
});
