import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image, Select, Icon } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../../assets/common/baseUrl';
import { controls } from '../../../assets/global/controls';
import { colors } from '../../../assets/global/globalStyles';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';
import BookLogistics from './BookLogistics';
import AuthGlobal from '../../../Context/store/AuthGlobal';

var { width } = Dimensions.get('window');

const ManageOrders = (props) => {
  // console.log('props: ', props);
  const context = useContext(AuthGlobal);
  const orderItems = props.route.params.order.orderItems;
  const order = props.route.params.order;
  const [orderStatus, setOrderStatus] = useState(
    props.route.params.order.status
  );

  const [orderStatusCode, setOrderStatusCode] = useState(
    order.status.statusCode
  );
  const [statusText, setStatusText] = useState(order.status.statusText);
  const [colorCode, setColorCode] = useState(order.status.colorCode);
  const [orderStatusChange, setOrderStatusChange] = useState('');
  const [orderItemStatusChange, setOrderItemStatusChange] = useState('');
  const [token, setToken] = useState();
  const [statusData, setStatusData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then((res) => setToken(res))
      .catch((error) => console.log(error));

    axios
      .get(`${baseUrl}orderstatus`)
      .then((res) => {
        setStatusData(res.data);
      })
      .catch((error) =>
        console.log('Error in getting minimum travel distance')
      );

    return () => {};
  }, []);

  useEffect(() => {
    console.log('orderItemStatusChange: ', orderItemStatusChange);
    if (orderItemStatusChange !== '') {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
    return () => {};
  }, [orderItemStatusChange]);

  // UPDATE STATUS AT ORDER LEVEL
  const changeOrderStatus = (newStatus) => {
    // console.log('newStatus: ', newStatus);
    if (newStatus) {
      axios
        .get(`${baseUrl}orderstatus/getbycode/${newStatus}`)
        .then((res) => {
          let newStatusId = res.data._id;
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          const changedOrder = {
            orderItems: order.orderItems,
            status: newStatusId,
            lastUpdated: Date.now(),
            lastUpdatedByUser: context.stateUser.user.userId,
          };
          axios
            .put(
              `${baseUrl}orders/changestatus/${order.id}`,
              changedOrder,
              config
            )
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                Toast.show({
                  topOffset: 60,
                  type: 'success',
                  text1: 'Order status updated successfuly',
                  text2: ' ',
                });
                setTimeout(() => {
                  sendSms();
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
        })
        .catch((error) =>
          console.log('Error while getting order staus record: ', error)
        );
    }
  };

  const updateOrderItemStatus = (orderItem) => {
    if (orderItemStatusChange) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const changedOrderItem = {
        status: orderItemStatusChange,
        lastUpdatedByUser: context.stateUser.user.userId,
        lastUpdated: Date.now(),
      };
      console.log('changedOrderItem: ', changedOrderItem);
      axios
        .put(
          `${baseUrl}orderitems/changestatus/${orderItem._id}`,
          changedOrderItem,
          config
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: 'success',
              text1: 'Item status updated successfuly',
              text2: ' ',
            });
            setTimeout(() => {
              sendSms();
              // props.navigation.navigate('ViewOrders');
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

  // UPDATE STATUS AT ORDER ITEM LEVEL
  const changeOrderItemStatus = (newStatus, orderItem) => {
    if (newStatus) {
      axios
        .get(`${baseUrl}orderstatus/getbycode/${newStatus}`)
        .then((res) => {
          let newStatusId = res.data._id;
          console.log('newStatusId: ', newStatusId);
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          const changedOrderItem = {
            status: newStatusId,
            lastUpdatedByUser: context.stateUser.user.userId,
            lastUpdated: Date.now(),
          };
          console.log('changedOrderItem: ', changedOrderItem);
          axios
            .put(
              `${baseUrl}orderitems/changestatus/${orderItem.id}`,
              changedOrderItem,
              config
            )
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                Toast.show({
                  topOffset: 60,
                  type: 'success',
                  text1: 'Order status updated successfuly',
                  text2: ' ',
                });
                setTimeout(() => {
                  sendSms();
                  // props.navigation.navigate('ViewOrders');
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
        })
        .catch((error) =>
          console.log('Error while getting order item staus record: ', error)
        );
    }
  };

  const sendSms = () => {
    console.log('Send SMS');
  };

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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <View style={{ width: '20%' }}>
                      <View style={styles.inLineImage}>
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
                      <Text>Item {index + 1}</Text>
                    </View>
                    <View style={{ width: '80%' }}>
                      <View style={{}}>
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
                    <View style={[styles.inLine, styles.borderedVertical]}>
                      <Text style={styles.contentTextTitle}>
                        Order item id:
                      </Text>
                      <Text style={styles.contentTextValues}>{oi.id}</Text>
                    </View>

                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTitle}>Qty ordered:</Text>
                      <Text style={styles.contentTextValues}>
                        {oi.quantity} {oi.unitName}
                      </Text>
                    </View>
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTitle}>Rate:</Text>
                      <Text style={styles.contentTextValues}>
                        {' '}
                        {controls.currency}
                        {oi.rate.toFixed(2)} /{oi.unitName}
                      </Text>
                    </View>
                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTotalTitle}>
                        Material Cost:{' '}
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.materialCost.toFixed(2)}
                      </Text>
                    </View>
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
                        {/* {oi.toLocationCode} */}
                        {oi.toLocationCode !== ''
                          ? oi.toLocationCode
                          : 'Chandikhol, Jajpur, Odisha'}
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

                    <View style={[styles.inLine, { marginTop: 10 }]}>
                      <Text style={styles.contentTextTotalTitle}>
                        Total transport cost:{' '}
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotalTransportationCost.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.inLine}>
                      <Text style={styles.contentTextTotalTitle}>
                        Item Total:
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotal.toFixed(2)}
                      </Text>
                    </View>

                    <View style={[styles.inLine, {}]}>
                      <Text style={styles.contentTextTotalTitle}>
                        Advance paid
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {oi.itemTotalTransportationCost.toFixed(2)}
                      </Text>
                    </View>

                    <View style={[styles.inLine, {}]}>
                      <Text style={styles.contentTextTotalTitle}>
                        Balance amount
                      </Text>
                      <Text style={styles.contentTextTotalTitle}>
                        {controls.currency}
                        {(
                          oi.itemTotal - oi.itemTotalTransportationCost
                        ).toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <Text style={styles.totalTitle}>Item Status: </Text>
                      <Text
                        style={[
                          styles.statusTitle,
                          {
                            color: oi.status.colorCode,
                            fontWeight: 'bold',
                            marginLeft: 5,
                          },
                        ]}
                      >
                        {oi.status.statusText}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.changeStatusTitle}>
                        Change item status
                      </Text>
                      <View
                        style={[
                          styles.buttonContainer,
                          {
                            marginTop: 0,
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Status"
                          dropdownIcon={
                            <Icon
                              mr="0"
                              size="5"
                              color={colors.grey3}
                              as={<Ionicons name="arrow-down" />}
                            />
                          }
                          backgroundColor={'white'}
                          selectedValue={orderItemStatusChange}
                          width={width / 2}
                          style={styles.select}
                          placeholderTextColor={'#007AFF'}
                          accessibilityLabel="Choose Status"
                          _selectedItem={{
                            bg: 'blue.300',
                          }}
                          onValueChange={(e) => setOrderItemStatusChange(e)}
                        >
                          <Select.Item
                            label={'--- Selct status ---'}
                            value={''}
                            key={Math.floor(Math.random() * 100 + 9999)}
                          />

                          {statusData.map((sd) => {
                            return (
                              <Select.Item
                                label={sd.statusText.toUpperCase()}
                                value={sd._id}
                                key={sd._id}
                              />
                            );
                          })}
                        </Select>
                        <TouchableOpacity
                          style={[
                            styles.buttons,
                            {
                              backgroundColor: enabled
                                ? colors.buttons
                                : colors.grey2,
                            },
                          ]}
                          onPress={() => updateOrderItemStatus(oi)}
                          disabled={enabled ? false : true}
                        >
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Update
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {oi.status.statusText === 'being processed' ||
                    oi.status.statusText === 'partially shipped' ? (
                      <View>
                        <TouchableOpacity
                          style={styles.actionsView}
                          // onPress={() => setLogisticsBooking(true)}
                          onPress={() => {
                            props.navigation.navigate('BookLogistics', {
                              orderItem: oi,
                              orderId: order._id,
                            });
                          }}
                        >
                          <Text style={styles.actions}>Book Logistics</Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })
          : null}

        {orderStatusCode === '01' ? (
          <View>
            <View style={styles.buttonContainer}>
              <EasyButton
                large
                secondary
                onPress={() => changeOrderStatus('10')}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Accept Order
                </Text>
              </EasyButton>
            </View>
          </View>
        ) : null}

        {orderStatusCode === '10' ? (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={styles.buttonContainer}>
              <EasyButton
                extralarge
                secondary
                onPress={() => changeOrderStatus('20')}
              >
                <Text style={styles.buttonText}>
                  Change status to BEING PROCESSED
                </Text>
              </EasyButton>
            </View>

            <View style={styles.buttonContainer}>
              <EasyButton
                extralarge
                secondary
                onPress={() => changeOrderStatus('01')}
              >
                <Text style={styles.buttonText}>Reset status to PENDING</Text>
              </EasyButton>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default ManageOrders;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 15,
    marginTop: 5,
    marginBottom: 80,
    borderRadius: 10,
  },
  itemContainer: {
    padding: 10,
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
    padding: 0,
    paddingLeft: 15,
    borderColor: colors.grey4,
    borderWidth: 0.5,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 16,
  },
  changeStatusTitle: {
    marginTop: 10,
    color: colors.grey2,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  contentTextTitle: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
  },
  contentTextTotalTitle: {
    color: colors.grey2,
    marginBottom: 5,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  contentTextValues: {
    color: '#333',
    fontSize: 13,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  totalTitle: {
    color: '#333',
    fontWeight: '600',
    marginVertical: 2,
  },
  totalValues: {
    color: '#333',
    fontWeight: '600',
    marginVertical: 2,
    fontStyle: 'italic',
  },
  itemTitle: {
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
  itemsHeader: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.grey4,
    marginBottom: 5,
  },
  orderStatusLabel: {
    marginLeft: 5,
    borderRadius: 5,
  },
  statusTitle: {
    textTransform: 'uppercase',
  },
  actionsView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actions: {
    color: colors.buttons,
    fontWeight: 'bold',
    borderColor: colors.buttons,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  borderedVertical: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 5,
  },
  bookingContainer: {
    position: 'relative',
  },
  closeButton: {
    // position: 'relative',
    maxWidth: 28,
    left: width * 0.75,
    top: 20,
  },
  closeText: {
    color: '#666',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 2,
    padding: 3,
    textAlign: 'center',
  },
  buttons: {
    backgroundColor: colors.buttons,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
    borderRadius: 5,
  },
});
