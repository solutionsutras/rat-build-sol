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
  const [orderStatus, setOrderStatus] = useState();
  const [logistics, setLogistics] = useState([]);
  const [transactions, setTransactions] = useState([]);

  var userData = [];
  // console.log('=========     start     =========');
  console.log('props: ', props);
  useFocusEffect(
    useCallback(() => {
      setOrderItems(props.cartItems);

      // Get order status code for "pending"
      axios
        .get(`${baseUrl}orderstatus/getbytext/pending`)
        .then((res) => {
          setOrderStatus(res.data);
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
    let shippingAddress = {
      address1: address,
      address2: address2,
      city,
      state,
      pin,
      country,
      phone,
    };
    let billingAddress = {
      address1: address,
      address2: address2,
      city,
      state,
      pin,
      country,
      phone,
    };
    let order = {
      orderItems,
      custName: custName,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      status:orderStatus._id,
      transactions,
      // logistics,
      user: user,
      dateOrdered: Date.now(),
      lastUpdated: Date.now(),
      lastUpdatedByUser: user,
    };
    console.log(order);
    props.navigation.navigate('OrderReview', { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={'Enter Shipping/Billing Address'}>
        <View>{error ? <Error message={error} /> : null}</View>
        <View style={styles.titleView}>
          <Text>Name:</Text>
        </View>
        <Input
          placeholder={'Name'}
          name={'custName'}
          value={custName}
          onChangeText={(text) => setCustName(text)}
        />

        <View style={styles.titleView}>
          <Text>Phone No:</Text>
        </View>
        <Input
          placeholder={'Phone'}
          name={'Phone'}
          value={phone}
          keyboardType={'numeric'}
          onChangeText={(text) => setPhone(text)}
        />

        <View style={styles.titleView}>
          <Text>Address Line 1:</Text>
        </View>
        <Input
          placeholder={'Shipping Address 1'}
          name={'ShippingAddress1'}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />

        <View style={styles.titleView}>
          <Text>Address Line 2:</Text>
        </View>
        <Input
          placeholder={'Shipping Address 2'}
          name={'ShippingAddress2'}
          value={address2}
          onChangeText={(text) => setAddress2(text)}
        />

        <View style={styles.inLineView}>
          <View style={{ width: '50%' }}>
            <View style={styles.titleView}>
              <Text>City:</Text>
            </View>
            <Input
              placeholder={'City'}
              name={'City'}
              value={city}
              onChangeText={(text) => setCity(text)}
            />
          </View>

          <View style={{ width: '50%' }}>
            <View style={styles.titleView}>
              <Text>PIN:</Text>
            </View>
            <Input
              placeholder={'PIN Code'}
              name={'PIN'}
              value={pin}
              keyboardType={'numeric'}
              onChangeText={(text) => setPin(text)}
            />
          </View>
        </View>
        <View style={styles.inLineView}>
          <View style={{ width: '50%' }}>
            <View style={styles.titleView}>
              <Text>State:</Text>
            </View>
            <Input
              placeholder={'State'}
              name={'State'}
              value={state}
              onChangeText={(text) => setState(text)}
            />
          </View>

          <View style={{ width: '50%' }}>
            <View style={styles.titleView}>
              <Text>Country:</Text>
            </View>
            <Input
              placeholder={'Country'}
              name={'Country'}
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
          </View>
        </View>
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
        <View style={{ width: '80%', alignItems: 'center', marginTop: 20 }}>
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
  titleView: {
    width: '90%',
    marginLeft: 5,
    marginTop: 5,
  },
  inLineView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
  },
});
