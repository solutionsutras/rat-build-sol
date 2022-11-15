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

const OrderCard = (props) => {
  // console.log('props: ', props);
  const [statusCode, setStatusCode] = useState(props.status.statusCode);
  const [statusText, setStatusText] = useState(props.status.statusText);
  const [colorCode, setColorCode] = useState(props.status.colorCode);
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [dateOrdered, setDateOrdered] = useState('');

  useEffect(() => {
    setDateOrdered(
      new Date(props.dateOrdered).toLocaleString(undefined, {
        timeZone: 'Asia/Kolkata',
      })
    );
    return () => {};
  }, []);

  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            props.index % 2 == 0 ? colors.cardBackground : colors.grey5,
        },
      ]}
      onPress={() =>
        props.navigation.navigate('ManageOrders', { order: props })
      }
    >
      <View>
        <View style={styles.idContainer}>
          <Text>Order Number: {props.id} </Text>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>Status:</Text>
          <View style={styles.orderStatusLabel}>
            <Text style={[styles.statusTitle, { color: colorCode }]}>
              {statusText}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.inLine2}>
            <Text>Name:</Text>
            <Text style={styles.valueText}>{props.user.name}</Text>
          </View>
          <View style={styles.inLine2}>
            <Text>Billing Address: </Text>
            <Text style={styles.valueText}>
              {props.billingAddress.address1}{' '}
              {props.billingAddress.address2
                ? ', ' + props.billingAddress.address2
                : null}
              , Dist: {props.billingAddress.city}, State:{' '}
              {props.billingAddress.state}, Country:{' '}
              {props.billingAddress.country}
            </Text>
          </View>
          <View style={styles.inLine2}>
            <Text>Shipping Address: </Text>
            <Text style={styles.valueText}>
              {props.shippingAddress.address1}{' '}
              {props.shippingAddress.address2
                ? ', ' + props.shippingAddress.address2
                : null}
              , Dist: {props.shippingAddress.city}, State:{' '}
              {props.shippingAddress.state}, Country:{' '}
              {props.shippingAddress.country}
            </Text>
          </View>

          <View style={styles.inLine2}>
            <Text>Date Ordered:</Text>
            <Text style={styles.valueText}>
              {dateOrdered.split(' ')[2]}-{dateOrdered.split(' ')[1]}-
              {dateOrdered.split(' ')[4]}, Time: {dateOrdered.split(' ')[3]}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={[styles.inLine2, { justifyContent: 'space-between' }]}>
              <Text style={styles.price}>Total order value: </Text>
              <Text style={styles.price}>
                {controls.currency}
                {props.totalPrice}
              </Text>
            </View>

            <View style={[styles.inLine2, { justifyContent: 'space-between' }]}>
              <Text style={styles.price}>Advance Paid: </Text>
              <Text style={styles.price}>
                {controls.currency}
                {props.advancePaid}
              </Text>
            </View>

            <View style={[styles.inLine2, { justifyContent: 'space-between' }]}>
              <Text style={styles.price}>Balance Amount: </Text>
              <Text style={styles.price}>
                {controls.currency}
                {props.balanceToPay}
              </Text>
            </View>
          </View>

          <View style={{ width: '100%' }}>
            <EasyButton
              extralarge
              secondary
              onPress={() =>
                props.navigation.navigate('ManageOrders', { order: props })
              }
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                View & Manage Order
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
    width: '60%',
  },
  price: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginLeft: 10,
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
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 10,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
  },
  inLine2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  valueText: {
    fontStyle: 'italic',
    marginLeft: 10,
  },
});
