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

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import baseUrl from '../../../assets/common/baseUrl';
import { controls } from '../../../assets/global/controls';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

var { width } = Dimensions.get('window');

const codes = [
  { name: 'pending', code: '3' },
  { name: 'shipped', code: '2' },
  { name: 'delivered', code: '1' },
];

const OrderCard = (props) => {
  // console.log(props);
  const [orderStatusColor, setOrderStatusColor] = useState();
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

    // console.log(props.status);
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
      setOrderStatusColor();
      setStatusText();
      setCardColor();
    };
  }, []);

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
            props.navigation.navigate('ViewOrders');
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

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            props.index % 2 == 0 ? colors.cardBackground : colors.grey5,
        },
      ]}
    >
      <View>
        <View style={styles.idContainer}>
          <Text>Order Number: {props.id} </Text>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>Status:</Text>
          <View style={styles.orderStatusLabel}>
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

        <View style={styles.detailsContainer}>
          <Text>Customer Name: {props.user.name}</Text>

          <Text>Billing Address: </Text>
          {props.shippingAddress2 ? (
            <Text>
              Billing Address: {props.shippingAddress1},{' '}
              {props.shippingAddress2}
            </Text>
          ) : (
            <Text>Billing Address: {props.shippingAddress1}</Text>
          )}

          <Text>City: {props.city}</Text>
          <Text>
            State: {props.state}, {props.country}
          </Text>
          <Text>Date Ordered: {props.dateOrdered.split('T')[0]}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>Order Value: </Text>
            <Text style={styles.price}>
              {controls.currency}
              {props.totalPrice}
            </Text>
          </View>
          <View style={{ width: '100%' }}>
            <EasyButton
              large
              primary
              onPress={() =>
                props.navigation.navigate('ManageOrders', { order: props })
              }
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Manage Order
              </Text>
            </EasyButton>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 20,
  },
  title: {
    backgroundColor: '#62B1F6',
    padding: 5,
  },
  idContainer: {
    paddingBottom: 5,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  idText: {
    textDecorationStyle: 'dotted',
    textDecorationLine: 'underline',
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  price: {
    fontWeight: 'bold',
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
  orderStatusLabel: {
    marginLeft: 5,
    borderRadius: 5,
  },
  statusTitle: {
    textTransform: 'uppercase',
  },
  detailsContainer: {
    marginTop: 10,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
  },
});
