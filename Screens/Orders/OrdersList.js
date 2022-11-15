import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Image } from 'native-base';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../assets/common/baseUrl';
import { controls } from '../../assets/global/controls';
import { colors } from '../../assets/global/globalStyles';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { Touchable } from 'react-native';

var { width } = Dimensions.get('window');
const OrdersList = (props) => {
  const orderItems = props.route.params.orderItems;
  const orders = props.route.params;
  console.log('orders: ', orders);
  const [statusCode, setStatusCode] = useState(orders.status.statusCode);
  const [statusText, setStatusText] = useState(orders.status.statusText);
  const [colorCode, setColorCode] = useState(orders.status.colorCode);
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const [expandMaterialCost, setExpandMaterialCost] = useState(true);
  const [expandTransportCost, setExpandTransportCost] = useState(false);
  const [expandLogistics, setExpandLogistics] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    // Get minimum Trip Distance to be considered
    // axios
    //   .get(`${baseUrl}controls/getbytype/100`)
    //   .then((res) => {
    //     setMinTripDistance(parseInt(res.data[0].fieldValue));
    //   })
    //   .catch((error) => alert('Error in getting minimum travel distance'));

    return () => {};
  }, []);

  // const cancelOrder = () => {
  //   if (statusText === 'pending' || statusText === 'accepted') {
  //     console.log('cancelOrder process to be follwed; id: ', orders._id);
  //   } else if (statusText === 'being processed') {
  //     Alert.alert(
  //       'As the order is being processed, only 60% of the advance paid will be refunded'
  //     );
  //   } else {
  //     Alert.alert(
  //       'As the material is already shipped order cannont be cancelled'
  //     );
  //   }
  // };

  const cancelOrderItem = (item) => {
    if (
      item.status.statusText === 'pending' ||
      item.status.statusText === 'accepted'
    ) {
      console.log('cancel this item process to be follwed; id: ', item._id);
    } else if (item.status.statusText === 'being processed') {
      Alert.alert(
        'As this item in the order is being processed, only 60% of the advance paid will be refunded'
      );
    } else {
      Alert.alert(
        'As the material for this item is already shipped this cannont be cancelled'
      );
    }
  };

  const expandCollapseTransportCost = () => {
    if (expandTransportCost === true) {
      setExpandTransportCost(false);
    } else if (expandTransportCost === false) {
      setExpandTransportCost(true);
    }
  }

  return (
    <ScrollView
      style={{ marginBottom: 0, padding: 5 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[{}, styles.container]}>
        <View style={[styles.statusContainer, { backgroundColor: colorCode }]}>
          <Text style={styles.statusText}>Order Status: {statusText}</Text>
        </View>
        <View style={styles.itemsHeader}>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Order Items</Text>
        </View>

        {orderItems
          ? orderItems.map((oi, index) => {
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
                  <View style={styles.innerContainer}>
                    <View style={{ width: '20%' }}>
                      <View style={styles.inLineImage}>
                        <Text>Item {index + 1}</Text>
                        <Image
                          alt={oi.item.itemName}
                          style={styles.image}
                          source={{
                            uri: oi.item.image
                              ? oi.item.image
                              : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
                          }}
                          size={12}
                          resizeMode={'contain'}
                        />
                      </View>
                    </View>
                    <View style={{ width: '80%' }}>
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.itemTitle}>
                          Item name: {oi.item.itemName}
                        </Text>
                        <Text style={styles.itemTitle}>
                          Item type: {oi.item.quality.qualityName}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTitle}>Qty:</Text>
                      <Text style={styles.contentTextValues}>
                        {oi.quantity} {oi.unitName.split('(')[0]}
                      </Text>
                    </View>
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTitle}>Rate:</Text>
                      <Text style={styles.contentTextValues}>
                        {' '}
                        {controls.currency}
                        {oi.rate.toFixed(2)} /{oi.unitName.split('(')[0]}
                      </Text>
                    </View>
                    <View style={styles.inLine}>
                      <Text
                        style={[
                          styles.contentTextTotalTitle,
                          { marginBottom: 5 },
                        ]}
                      >
                        Total Material Cost:{' '}
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.materialCost.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginTop: 10,
                        marginLeft: 10,
                      },
                    ]}
                    onPress={expandCollapseTransportCost}
                  >
                    <View>
                      {expandTransportCost ? (
                        <Icon
                          style={{ marginRight: 5 }}
                          name="minus-circle"
                          type="font-awesome"
                          color={colors.grey2}
                          size={16}
                        />
                      ) : (
                        <Icon
                          style={{ marginRight: 5 }}
                          name="plus-circle"
                          type="font-awesome"
                          color={colors.grey2}
                          size={16}
                        />
                      )}
                    </View>
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTotalTitle}>
                        Total transportation cost:{' '}
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotalTransportationCost.toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {expandTransportCost ? (
                    <View style={styles.detailsContainer}>
                      <View style={styles.inLine}>
                        <Text style={styles.contentTextTitle}>
                          Trip Start Point:
                        </Text>
                        <Text style={styles.contentTextValues}>
                          {' '}
                          {oi.fromLocationCode}
                        </Text>
                      </View>
                      <View style={styles.inLine}>
                        <Text style={styles.contentTextTitle}>
                          Trip Delivery Point:
                        </Text>
                        <Text style={styles.contentTextValues}>
                          {oi.toLocationCode}
                          {/* {oi.toLocationCode !== ''
                            ? oi.toLocationCode
                            : 'Chandikhol, Jajpur, Odisha'} */}
                        </Text>
                      </View>
                      <View style={styles.inLine}>
                        <Text style={styles.contentTextTitle}>
                          Trip Distance:{' '}
                        </Text>
                        <Text style={styles.contentTextValues}>
                          {oi.tripDistance} KM
                        </Text>
                      </View>
                      <View style={styles.inLine}>
                        <Text style={styles.contentTextTitle}>
                          Preferred Vehicles:{' '}
                        </Text>
                      </View>

                      <View style={{ marginLeft: 30 }}>
                        {oi.vehicle.map((veh, index) => {
                          return (
                            <View>
                              <View
                                style={[
                                  styles.inLine,
                                  {
                                    borderBottomWidth: 1,
                                    borderColor: colors.grey3,
                                  },
                                ]}
                              >
                                <Text style={styles.contentTextValues}>
                                  Vehicle {index + 1}{' '}
                                </Text>
                                <Text
                                  style={[
                                    styles.contentTextValues,
                                    { marginLeft: 5 },
                                  ]}
                                >
                                  {veh.brand}-{veh.model} (Capacity:
                                  {veh.selectedUnitName.toLowerCase() === 'foot'
                                    ? veh.selectedVehicle.capacityInFoot
                                    : null}
                                  {veh.selectedUnitName.toLowerCase() === 'cm'
                                    ? veh.selectedVehicle.capacityInCm
                                    : null}
                                  {veh.selectedUnitName.toLowerCase() === 'ton'
                                    ? veh.selectedVehicle.capacityInTon
                                    : null}
                                  {veh.selectedUnitName})
                                </Text>
                              </View>

                              <View style={[styles.inLine]}>
                                <Text>Single trip transport. cost: </Text>
                                <Text
                                  style={[
                                    styles.contentTextValues,
                                    { marginLeft: 5 },
                                  ]}
                                >
                                  {controls.currency}
                                  {veh.unitTransportationCost}
                                </Text>
                              </View>

                              <View style={[styles.inLine]}>
                                <Text>Required no of trips: </Text>
                                <Text
                                  style={[
                                    styles.contentTextValues,
                                    { marginLeft: 5 },
                                  ]}
                                >
                                  {veh.requiredNoOfTrips}
                                </Text>
                              </View>

                              <View style={[styles.inLine]}>
                                <Text
                                  style={[
                                    styles.contentTextTitle,
                                    { fontSize: 14 },
                                  ]}
                                >
                                  All trips transport. cost:{' '}
                                </Text>
                                <Text
                                  style={[
                                    styles.contentTextValues,
                                    { marginLeft: 5 },
                                  ]}
                                >
                                  {controls.currency}
                                  {veh.totalTransportationCost}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.detailsContainer}>
                    <View style={[styles.inLine, { marginTop: 0 }]}>
                      <Text style={styles.contentTextTotalTitle}>
                        Item total:
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotal.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTotalTitle}>
                        Advance paid:
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotalTransportationCost.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.inLine}>
                      <Text style={styles.totalTitle}>Balance to pay</Text>
                      <Text style={styles.totalValues}>
                        {controls.currency}
                        {(
                          oi.itemTotal - oi.itemTotalTransportationCost
                        ).toFixed(2)}
                      </Text>
                    </View>

                    <View>
                      <TouchableOpacity
                        style={styles.actionsView}
                        onPress={() => cancelOrderItem(oi)}
                      >
                        <Text style={styles.actions}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          : null}
        {/* 
        {statusCode === '01' ? (
          <View>
            <View style={styles.buttonContainer}>
              <EasyButton large secondary onPress={() => cancelOrder()}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Cancel Order
                </Text>
              </EasyButton>
            </View>
          </View>
        ) : null} */}
      </View>
    </ScrollView>
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
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: 20,
    borderBottomColor: colors.grey4,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  title: {
    backgroundColor: '#62B1F6',
    padding: 5,
  },
  image: {
    marginTop: 0,
    borderColor: colors.grey4,
    borderWidth: 1,
    borderRadius: 5,
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
    marginLeft: 20,
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
    marginTop: 0,
  },
  detailsContainer: {
    width: width * 0.75,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 0.5,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
  },
  actionsView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actions: {
    color: 'red',
    fontWeight: 'bold',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contentTextTotalTitle: {
    color: colors.grey2,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  contentTextValues: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  itemsHeader: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.grey4,
    marginBottom: 5,
  },
  statusContainer: {
    padding: 5,
    marginBottom: 10,
    borderColor: colors.grey4,
    borderWidth: 1,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
