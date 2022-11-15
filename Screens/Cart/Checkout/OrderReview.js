import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
  // console.log('props: ', props);

  const [advanceToPay, setAdvanceToPay] = useState(0);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [transportaionTotal, setTransportaionTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [user, setUser] = useState();
  const [transaction, setTransaction] = useState();
  const [token, setToken] = useState();

  var mTotal = 0;
  var tTotal = 0;
  var gTotal = 0;

  order.orderItems.forEach((item) => {
    mTotal += item.materialCost;
    tTotal += item.itemTotalTransportationCost;
    gTotal += item.itemTotal;
  });

  useEffect(() => {
    setMaterialTotal(mTotal);
    setTransportaionTotal(tTotal);
    setAdvanceToPay(tTotal);
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
        <Text style={{ fontSize: 14, alignSelf:'center' }}>
          Please review the items place the order{' '}
        </Text>
      </View>
      {props.route.params ? (
        <View style={{ borderWidth: 1, borderColor: colors.buttons }}>
          <Text style={styles.title}>Shipping to:</Text>
          <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
            <Text>Name: {order.custName}</Text>

            {order.shippingAddress.shippingAddress2 ? (
              <Text>
                Adrress: {order.shippingAddress.shippingAddress1},{' '}
                {order.shippingAddress.shippingAddress2}
              </Text>
            ) : (
              <Text>Adrress: {order.shippingAddress.shippingAddress1}</Text>
            )}
            <Text>City: {order.shippingAddress.city}</Text>
            <Text>State: {order.shippingAddress.state}</Text>
            <Text>Country: {order.shippingAddress.country}</Text>
            <Text>PIN: {order.shippingAddress.pin}</Text>
            <Text>Phone No: {order.shippingAddress.phone}</Text>
          </View>

          <Text style={styles.title}>Items:</Text>

          <ListHeader />
          {order.orderItems.map((i) => (
            <ListItem style={styles.listItem} key={i.item.itemName}>
              <View style={styles.cartBody}>
                <Text style={[styles.contentText, { width: width / 5 }]}>
                  {i.item.itemName} ({i.item.quality.qualityName})
                </Text>
                <Text style={[styles.contentText, { width: width / 8 }]}>
                  {i.qty} {i.unitName}
                </Text>
                <Text style={styles.contentText}>
                  {controls.currency}
                  {i.materialCost}
                </Text>
                <Text style={styles.contentText}>
                  {controls.currency}
                  {i.itemTotalTransportationCost}
                </Text>
                <Text style={styles.contentText}>
                  {controls.currency}
                  {i.itemTotal}
                </Text>
              </View>
            </ListItem>
          ))}
        </View>
      ) : null}

      <View style={[{ marginHorizontal: 20, marginVertical: 10 }]}>
        <View style={styles.cartBody}>
          <Text style={[styles.contentTextBold, styles.contextTextTotal]}>
            Totals
          </Text>
          {/* <Text style={[styles.contentText, { width: width / 8 }]}></Text> */}
          <Text style={styles.contentText}>
            {controls.currency}
            {materialTotal}
          </Text>
          <Text style={styles.contentText}>
            {controls.currency}
            {transportaionTotal}
          </Text>
          <Text style={styles.contentText}>
            {controls.currency}
            {grandTotal}
          </Text>
        </View>
      </View>

      <View style={styles.advanceAmt}>
        <View style={styles.cartBody}>
          <Text
            style={[
              styles.totalText,
              { color: colors.grey2, fontStyle: 'italic' },
            ]}
          >
            Advance amount to be paid
          </Text>
          <Text
            style={[
              styles.totalText,
              { color: colors.grey2, fontStyle: 'italic' },
            ]}
          >
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
          extralarge
          primary
          // onPress={() => props.navigation.navigate('Payment', { order })}
          onPress={() => processPayment()}
        >
          <Text style={{ color: 'white', fontSize: 13 }}>
            Pay {controls.currency}
            {tTotal} & Proceed
          </Text>
        </EasyButton>
      </View>
    </ScrollView>
  );
};

const ListHeader = () => {
  return (
    <View style={styles.listHeader}>
      <Text style={[styles.listHeaderText, { width: width / 4 }]}>
        Material
      </Text>
      <Text style={[styles.listHeaderText, { width: width / 10 }]}>Qty</Text>
      <Text style={styles.listHeaderText}>Material Cost</Text>
      <Text style={styles.listHeaderText}>Transport Cost</Text>
      <Text style={styles.listHeaderText}>Item Total</Text>
    </View>
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
    paddingHorizontal: 15,
    height: height,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  titleContainer: {
    alignSelf:'flex-start',
    marginVertical: 10,
    marginLeft:5,
  },
  title: {
    alignSelf: 'center',
    margin: 5,
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
  listHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 10,
    backgroundColor: colors.grey2,
    elevation: 1,
  },
  listHeaderText: {
    color: colors.cardBackground,
    flexWrap: 'wrap',
    fontSize: 12,
    marginHorizontal: 3,
    width: width / 6,
  },
  contentText: {
    flexWrap: 'wrap',
    fontSize: 12,
    marginHorizontal: 3,
    width: width / 7,
  },
  contentTextBold: {
    flexWrap: 'wrap',
    fontSize: 14,
    marginHorizontal: 3,
    fontWeight: 'bold',
  },
  contextTextTotal: {
    width: width / 3,
    textTransform: 'uppercase',
    letterSpacing: 5,
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
  itemsContainer: {
    flexDirection: 'row',
    padding: 5,
    width: width + 100,
  },
});
