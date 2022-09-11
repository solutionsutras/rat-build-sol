import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Select, Icon } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';

import EasyButton from './StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../assets/common/baseUrl';
import { controls } from '../assets/global/controls';
import { colors } from '../assets/global/globalStyles';
import axios from 'axios';
import { Alert } from 'react-native';

var { width } = Dimensions.get('window');

const codes = [
  { name: 'pending', code: '1' },
  { name: 'being processed', code: '2' },
  { name: 'shipped', code: '3' },
  { name: 'delivered', code: '4' },
  { name: 'settled', code: '5' },
];

const OrderCard = (props) => {
  // console.log('=====================================================');
  // console.log("props: ", props);
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    {
      props.editMode
        ? AsyncStorage.getItem('jwt')
            .then((res) => setToken(res))
            .catch((error) => console.log(error))
        : null;
    }

    if (props.status == '01') {
      setStatusText('pending');
      setCardColor('#999999');
    } else if (props.status == '10') {
      setStatusText('accepted');
      setCardColor('#FFA500');
    } else if (props.status == '20') {
      setStatusText('being processed');
      setCardColor('#99DD00');
    } else if (props.status == '30') {
      setStatusText('shipped');
      setCardColor('#33BB00');
    } else if (props.status == '40') {
      setStatusText('delivered');
      setCardColor('#008800');
    } else if (props.status == '50') {
      setStatusText('settled');
      setCardColor('#005500');
    } else if (props.status == '99') {
      setStatusText('canceled');
      setCardColor('#EE0000');
    }

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  const cancelOrder = () => {
    if (statusText === 'pending' || statusText === 'accepted') {
      console.log('cancelOrder');
    } else if (statusText === 'being processed') {
      Alert.alert(
        'As the order is being processed 60% of the advance will be refunded'
      );
    } else {
      Alert.alert(
        'As the material is already shipped order cannont be cancelled'
      );
    }
  };

  const updateOrderStatus = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const order = {
      id: props.id,
      city: props.city,
      country: props.country,
      dateOrdered: props.dateOrdered,
      orderItems: props.orderItems,
      phone: props.phone,
      shippingAddress1: props.shippingAddress1,
      shippingAddress2: props.shippingAddress2,
      state: props.state,
      pin: props.pin,
      status: statusChange,
      totalPrice: props.totalPrice,
      user: props.user,
    };

    axios
      .put(`${baseUrl}orders/${props.id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Order status updated successfuly',
            text2: ' ',
          });
          setTimeout(() => {
            props.navigation.navigate('ViewItems');
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
  };

  // const orderDetails = () => {
  //   ;
  // };

  return (
    <View style={[{ backgroundColor: colors.grey5 }, styles.container]}>
      <View style={{}}>
        <Text style={styles.title}>Order Number: {props.id} </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title]}>Status:</Text>
          <Text
            style={[
              styles.statusTitle,
              { color: cardColor, fontWeight: 'bold' },
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.priceText}>
          Address: {props.shippingAddress1}
          {props.shippingAddress2 ? ', ' + props.shippingAddress2 : null}
        </Text>
        <Text style={styles.priceText}>City: {props.city}</Text>
        <Text style={styles.priceText}>
          State: {props.state}, ({props.country})
        </Text>
        <Text style={styles.priceText}>
          Delivery Point: {props.toLocationCode}
        </Text>
        <Text style={styles.priceText}>
          Date Ordered: {props.dateOrdered.split('T')[0]}, Time:{' '}
          {props.dateOrdered.split('T')[1].split('.')[1]}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.grey1}>Total Order Value: </Text>
          <Text style={styles.price}>
            {controls.currency}
            {props.totalPrice}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.grey1}>Advance Paid: </Text>
          <Text style={styles.price}>
            {controls.currency}
            {props.advancePaid}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.grey1}>Balance Amount: </Text>
          <Text style={styles.price}>
            {controls.currency}
            {props.balanceToPay}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('OrdersList', {
              orderItems: props.orderItems,
              status: props.status,
            })
          }
        >
          <View style={{ width: '50%' }}>
            <Text style={styles.viewDetails}>View Order Details</Text>
          </View>
        </TouchableOpacity>

        {/* {statusText === 'pending' ? ( */}
        <View>
          <View style={[styles.buttonContainer, { paddingVertical: 5 }]}>
            <EasyButton large secondary onPress={() => cancelOrder()}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Cancel Order
              </Text>
            </EasyButton>
          </View>
        </View>
        {/* ) : null} */}

      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 5,
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  title: {
    padding: 5,
    fontSize: 16,
  },
  statusTitle: {
    textTransform: 'uppercase',
  },
  priceContainer: {
    marginTop: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.grey1,
    fontWeight: 'bold',
  },
  priceText: {
    paddingHorizontal: 5,
    color: colors.grey1,
    fontSize: 14,
  },
  select: {
    height: 36,
    backgroundColor: colors.grey5,
    padding: 0,
    paddingLeft: 15,
    // borderRadius: 2,
    // borderWidth: 1,
    // borderColor: colors.buttons,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  changeStatusTitle: {
    marginTop: 10,
    color: colors.buttons,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  grey1: {
    color: colors.grey1,
  },
  viewDetails: {
    fontSize: 16,
    color: colors.buttons,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.buttons,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
