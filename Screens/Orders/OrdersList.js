import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Select, Icon, Image } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';

import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../assets/common/baseUrl';
import { controls } from '../../assets/global/controls';
import { colors } from '../../assets/global/globalStyles';
import axios from 'axios';

var { width } = Dimensions.get('window');
const OrdersList = (props) => {
  const orderItems = props.route.params.orderItems;
  const orders = props.route.params;
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState('');
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const [minTripDistance, setMinTripDistance] = useState(0);

  useEffect(() => {
    console.log('orders.status: ', orders.status);
    if (orders.status == '01') {
      setStatusText('pending');
      setCardColor('#999999');
    } else if (orders.status == '10') {
      setStatusText('being processed');
      setCardColor('#FFA500');
    } else if (orders.status == '20') {
      setStatusText('being processed');
      setCardColor('#99DD00');
    } else if (orders.status == '30') {
      setStatusText('shipped');
      setCardColor('#33BB00');
    } else if (orders.status == '40') {
      setStatusText('delivered');
      setCardColor('#008800');
    } else if (orders.status == '50') {
      setStatusText('settled');
      setCardColor('#005500');
    } else if (orders.status == '99') {
      setStatusText('canceled');
      setCardColor('#EE0000');
    }

    // Get minimum Trip Distance to be considered
    axios
      .get(`${baseUrl}controls/getbytype/100`)
      .then((res) => {
        setMinTripDistance(parseInt(res.data[0].fieldValue));
      })
      .catch((error) => alert('Error in getting minimum travel distance'));

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  return (
    <View
      style={[{ backgroundColor: colors.cardBackground }, styles.container]}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Order Items</Text>

      {orderItems
        ? orderItems.map((o, index) => {
            return (
              <View
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor:
                      index % 2 == 1 ? colors.cardBackground : colors.grey5,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <View style={{ width: '20%' }}>
                    <View style={styles.inLineImage}>
                      <Image
                        alt={o.item.itemName}
                        style={{ marginTop: 0 }}
                        source={{
                          uri: o.item.image
                            ? o.item.image
                            : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
                        }}
                        size={12}
                        resizeMode={'contain'}
                      />
                    </View>
                    <Text>Item {index + 1}</Text>
                  </View>
                  <View style={{ width: '80%' }}>
                    <View style={{}}>
                      <Text style={styles.itemTitle}>
                        Item Name: {o.item.itemName}
                      </Text>
                      <Text style={styles.itemTitle}>
                        Item Quality: {o.item.quality.qualityName}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>Qty:</Text>
                    <Text style={styles.contentTextValues}>
                      {o.quantity} {o.unitName.split('(')[0]}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>Rate:</Text>
                    <Text style={styles.contentTextValues}>
                      {' '}
                      {controls.currency}
                      {o.rate.toFixed(2)} /{o.unitName.split('(')[0]}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>Material Cost: </Text>
                    <Text style={styles.contentTextValues}>
                      {controls.currency}
                      {o.materialCost.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>
                      Trip Start Point:
                    </Text>
                    <Text style={styles.contentTextValues}>
                      {' '}
                      {o.fromLocationCode}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>
                      Trip Delivery Point:
                    </Text>
                    <Text style={styles.contentTextValues}>
                      {/* {o.toLocationCode} */}
                      {o.toLocationCode !== ''
                        ? o.toLocationCode
                        : 'Chandikhol, Jajpur, Odisha'}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>Trip Distance: </Text>
                    <Text style={styles.contentTextValues}>
                      {o.tripDistance} KM
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>
                      Vehicle Selected:{' '}
                    </Text>
                    <Text style={styles.contentTextValues}>
                      {o.vehicle.brand}-{o.vehicle.model}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>Vehicle Fare: </Text>
                    <Text style={styles.contentTextValues}>
                      {controls.currency}
                      {o.tripDistance < minTripDistance
                        ? o.vehicle.minFare.toFixed(2)
                        : (o.vehicle.farePerKm * o.tripDistance).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>
                      Load Unload Cost:{' '}
                    </Text>
                    <Text style={styles.contentTextValues}>
                      {controls.currency}
                      {o.vehicle.loadUnloadCost.toFixed(2)}
                    </Text>
                  </View>
                  {o.vehicle.tollApplicable ? (
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTitle}>Toll Tax: </Text>
                      <Text style={styles.contentTextValues}>
                        {controls.currency}
                        {o.vehicle.tollTax.toFixed(2)}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.inLine}>
                    <Text style={styles.contentTextTitle}>
                      Total Transport Cost:{' '}
                    </Text>
                    <Text style={styles.contentTextValues}>
                      {controls.currency}
                      {o.transportationCost.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.inLine}>
                    <Text style={styles.totalTitle}>Item Total:</Text>
                    <Text style={styles.totalValues}>
                      {controls.currency}
                      {o.itemTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        : null}

      {/* <View style={styles.priceContainer}>
        <Text style={{}}>Order Value: </Text>
        <Text style={styles.price}>
          {controls.currency}
          {props.totalPrice}
        </Text>
      </View> */}

      {statusText === 'pending' ? (
        <View>
          <View style={styles.buttonContainer}>
            <EasyButton
              large
              secondary
              // onPress={() => cancelOrder()}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Cancel Order
              </Text>
            </EasyButton>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default OrdersList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 10,
  },
  itemContainer: {
    padding: 10,
  },
  title: {
    backgroundColor: '#62B1F6',
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  price: {
    color: 'white',
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
    marginTop: 10,
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
  contentTextTitle: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
  },
  contentTextValues: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  totalTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  totalValues: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    fontStyle: 'italic',
  },
  itemTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  detailsContainer: {
    width: width * 0.7,
    marginLeft: 20,
    padding: 10,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
  },
});
