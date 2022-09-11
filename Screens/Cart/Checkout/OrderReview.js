import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Text, Image, Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../../../Redux/Actions/cartActions';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';

import baseUrl from '../../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AuthGlobal from '../../../Context/store/AuthGlobal';
import AsyncStorage from '@react-native-async-storage/async-storage';

var { width, height } = Dimensions.get('window');

const OrderReview = (props) => {
  const context = useContext(AuthGlobal);
  const order = props.route.params.order;
  console.log(order);

  const [advanceToPay, setAdvanceToPay] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [user, setUser] = useState();
  const [transaction, setTransaction] = useState();
  const [token, setToken] = useState();

  var totalTransCost = 0;
  order.orderItems.forEach((item) => {
    return (totalTransCost += item.transportationCost);
  });

  var gTotal = 0;
  order.orderItems.forEach((item) => {
    return (gTotal += item.itemTotal);
  });

  useEffect(() => {
    setAdvanceToPay(totalTransCost);
    setGrandTotal(gTotal);
    setUser(context.stateUser.user.userId);

    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {
      setAdvanceToPay(0);
      setGrandTotal(0);
      setToken();
    };
  }, []);

  useEffect(() => {
    if (paymentStatus) {
      if (transaction !== undefined) {
        placeOrder();
      }
    }
    return () => {};
  }, [transaction]);

  const processPayment = async () => {
    var date = new Date();
    var today =
      date.getFullYear().toString() + ('0' + (date.getMonth() + 1)).slice(-2);
    var random = ('0000' + Math.floor(Math.random() * 99999)).slice(-5);
    const tranNo = 'BNS' + today + random;
    const transactionType = 'credit';
    const remarks = 'Advance';

    let tran = {
      transactionNo: tranNo,
      transactionType,
      amount: advanceToPay,
      remarks: remarks,
      user: context.stateUser.user.userId,
    };

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const res = await axios.post(`${baseUrl}transactions`, tran, config);
    if (res.status == 200 || res.status == 201) {
      setPaymentStatus(true);
      setTransaction([res.data]);
    } else {
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Something went wrong in transaction, Please try again...',
        text2: 'Error:' + error,
      });
    }
  };

  const placeOrder = () => {
    if (paymentStatus === true) {
      order.discountPercent = discountPercent;
      order.advanceToPay = advanceToPay;
      order.advancePaid = advanceToPay;
      order.balanceToPay = grandTotal - advanceToPay;
      order.transactions = [transaction[0]._id];
      
      axios
        .post(`${baseUrl}orders`, order)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: 'success',
              text1: 'Order placed successfuly',
              text2: ' ',
            });
            setTimeout(() => {
              props.clearCart();
              props.navigation.navigate('Cart Screen');
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Something went wrong, Please try again...',
            text2: 'Error:' + error,
          });
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 18, }}>Please review and pay to place the Order </Text>
      </View>
      {props.route.params ? (
        <View style={{ borderWidth: 1, borderColor: colors.buttons }}>
          <Text style={styles.title}>Shipping to:</Text>
          <View style={{ padding: 10 }}>
            <Text>Name: {order.custName}</Text>
            <Text>Adrress1: {order.shippingAddress1}</Text>
            {order.shippingAddress2 ? (
              <Text>Adrress2: {order.shippingAddress2}</Text>
            ) : null}
            <Text>City: {order.city}</Text>
            <Text>State: {order.state}</Text>
            <Text>Country: {order.country}</Text>
            <Text>PIN: {order.pin}</Text>
            <Text>Phone No: {order.phone}</Text>
          </View>
          <Text style={styles.title}>Items:</Text>
          {order.orderItems.map((i) => (
            <ListItem style={styles.listItem} key={i.item.itemName}>
              <View style={styles.cartBody}>
                <Image
                  alt={i.item.itemName}
                  source={{
                    uri: i.item.image
                      ? i.item.image
                      : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
                  }}
                  size={6}
                  resizeMode={'contain'}
                />
                <Text style={styles.contentText}>{i.item.itemName}</Text>
                <Text style={{}}>
                  Item total: {controls.currency}
                  {i.itemTotal}
                </Text>
              </View>
            </ListItem>
          ))}
        </View>
      ) : null}

      <View style={[{ marginHorizontal: 20, marginVertical: 10 }]}>
        <View style={styles.cartBody}>
          <Text style={styles.totalText}>Total oder value</Text>
          <Text style={{}}>
            {controls.currency}
            {grandTotal}
          </Text>
        </View>
      </View>

      <View style={styles.advanceAmt}>
        <View style={styles.cartBody}>
          <Text style={[styles.totalText, { color: colors.buttons }]}>
            Advance amount to pay
          </Text>
          <Text style={[styles.totalText, { color: colors.buttons }]}>
            {controls.currency}
            {advanceToPay}
          </Text>
        </View>
      </View>

      <View style={{ marginHorizontal: 20 }}>
        <Text style={{ fontSize: 12, lineHeight: 14, color: 'red' }}>
          Total transporation cost has to be paid in advance. Please pay the
          advance amount of to place the order
        </Text>
      </View>

      <View style={{ alignItems: 'center', margin: 20 }}>
        <EasyButton
          large
          primary
          // onPress={() => props.navigation.navigate('Payment', { order })}
          onPress={() => processPayment()}
        >
          <Text style={{ color: 'white' }}>
            Pay {controls.currency}
            {totalTransCost}
          </Text>
        </EasyButton>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

export default connect(null, mapDispatchToProps)(OrderReview);
// export default OrderReview;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: height,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
  },
  title: {
    alignSelf: 'center',
    margin: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    alignSelf: 'center',
    fontSize: 16,
  },
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#CCC',
    margin: 0,
    padding: 0,
  },
  cartBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contentText: {
    fontSize: 14,
    marginHorizontal: 15,
  },
  contentTextBold: {
    fontSize: 14,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 16,
    marginHorizontal: 15,
  },

  advanceAmt: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey5,
    borderWidth: 1,
    borderColor: '#CCC',
    margin: 10,
    padding: 10,
  },
});
