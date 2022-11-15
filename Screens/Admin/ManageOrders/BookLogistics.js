import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';
import {
  Center,
  Heading,
  Select,
  Radio,
  Stack,
  Spacer,
  Icon,
} from 'native-base';
import { ListItem } from 'react-native-elements';
import FormContainer from '../../../Shared/Forms/FormContainer';
import Input from '../../../Shared/Forms/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';
import Toast from 'react-native-toast-message';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import baseUrl from '../../../assets/common/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../../../Shared/Error';
import { TextInput } from 'react-native';
import AuthGlobal from '../../../Context/store/AuthGlobal';

const { width, height } = Dimensions.get('window');

const BookLogistics = (props) => {
  const context = useContext(AuthGlobal);
  const [orderItem, setOrderItem] = useState(props.route.params.orderItem);
  const orderId = props.route.params.orderId;
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [unitName, setUnitName] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [vehicleData, setVehicleData] = useState([]);
  const [logisticsData, setLogisticsData] = useState([]);
  const [driver, setDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState();
  const [driversData, setDriversData] = useState([]);
  const [quantity, setQuantity] = useState('0');
  const [totalQty, setTotalQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(0);
  const [quantityShipped, setQuantityShipped] = useState(0);
  const [index, setIndex] = useState(0);
  const [logistics, setLogistics] = useState([]);
  const [booking, setBooking] = useState(false);
  const [config, setConfig] = useState();
  var qtyShipped = 0;

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    return () => {
      setToken();
    };
  }, []);

  useEffect(() => {
    setUser(context.stateUser.user.userId);
    // const config = { headers: { Authorization: `Bearer ${token}` } };
    setConfig({ headers: { Authorization: `Bearer ${token}` } });

    // Get Vehicles from Database
    axios
      .get(`${baseUrl}vehicles`, config)
      .then((res) => setVehicleData(res.data))
      .catch((error) => console.log('Error in loading Vehicles'));

    // Get Drivers from Database
    axios
      .get(`${baseUrl}users/getbyroll/driver`, config)
      .then((res) => setDriversData(res.data))
      .catch((error) => console.log('Error in loading driver records'));

    // Update Status
    // console.log('orderItem.quantityShipped: ', orderItem.quantityShipped);
    // console.log('orderItem.status.statusCode: ', orderItem.status.statusCode);
    if (parseInt(orderItem.quantityShipped) > 0) {
      if (orderItem.qtyShipped === orderItem.quantity) {
        // console.log('Change to ', 30);
        updateOrderItemStatus('30');
      } else {
        // console.log('Change to ', 25);
        updateOrderItemStatus('25');
      }
    }
    return () => {
      setVehicleData([]);
      setDriversData([]);
    };
  }, [token]);

  useEffect(() => {
    // const config = { headers: { Authorization: `Bearer ${token}` } };
    // Get logistics data
    axios
      .get(`${baseUrl}logistics/getbyorderitem/${orderItem._id}`, config)
      .then((res) => {
        setLogisticsData(res.data);
      })
      .catch((error) => console.log('Error in loading logistics details'));

    // Get orderitems data refreshed
    axios
      .get(`${baseUrl}orderitems/${orderItem._id}`, config)
      .then((res) => {
        setOrderItem(res.data);
      })
      .catch((error) => console.log('Error in loading logistics details'));

    return () => {};
  }, [logistics]);

  useEffect(() => {
    setUnitName(orderItem.unitName);
    setTotalQty(orderItem.quantity);
    setQuantityShipped(orderItem.quantityShipped);
    setRemainingQty(orderItem.quantity - orderItem.quantityShipped);
    // setLogistics(orderItem.logistics);

    return () => {};
  }, [orderItem]);

  const saveLogistics = () => {
    if (vehicle === null || driver === null || quantity === 0) {
      setError('Please fill all the details correctly');
    } else {
      setError('');
      // let dateOfDelivery = Date.now()
      var dt = new Date();
      dt.setDate(dt.getDate() + 5);
      let newLogistics = {
        vehicle: vehicle,
        order: orderId,
        orderItem: orderItem._id,
        quantityShipped: quantity,
        driver: driver,
        expectedDateOfDelivery: dt,
      };

      // const config = { headers: { Authorization: `Bearer ${token}` } };
      axios
        .post(`${baseUrl}logistics`, newLogistics, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            let newOrderItem = {
              logistics: [...logistics, res.data._id],
              quantityShipped: quantityShipped + quantity,
              lastUpdated: Date.now(),
              lastUpdatedByUser: user,
            };

            // console.log('newOrderItem: ', newOrderItem);

            axios
              .put(`${baseUrl}orderitems/${orderItem.id}`, newOrderItem, config)
              .then((res1) => {
                if (res1.status == 200 || res1.status == 201) {
                  
                  setLogistics(res1.data.logistics);
                  Toast.show({
                    topOffset: 60,
                    type: 'success',
                    text1: 'Logistics booked successfuly',
                    text2: ' ',
                  });
                  setTimeout(() => {
                    // sendSms();
                    // props.navigation.navigate('ViewOrders');
                    resetFields();
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  
  const sendSms = () => {
    console.log('Send SMS');
  };

  const updateOrderItemStatus = (newStatusCode) => {
    
    if (newStatusCode && newStatusCode !== orderItem.status.statusCode) {
      axios
        .get(`${baseUrl}orderstatus/getbycode/${newStatusCode}`)
        .then((res) => {
          let newStatus = res.data;
          // console.log('newStatus._id: ', newStatus._id);
          console.log('orderItem.status: ', orderItem.status);
          
          if(orderItem.status !== newStatus._id){
            const changedOrderItem = {
              status: newStatus._id,
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
                  setTimeout(() => {
                    sendSms();
                    // props.navigation.navigate('ViewOrders');
                  }, 500);
                }
              })
              .catch((error) => {
                console.log('Error while updating order staus record: ', error);
              });
          }
        })
        .catch((error) =>
          console.log('Error while getting order staus record: ', error)
        );
    }
  };

  const resetFields = () => {
    setVehicle('');
    setDriver('');
    setQuantity('0');
    setBooking(false);
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={'Enter Logistics Details'}>
        <View style={{ width: width / 1.1 }}>
          <Text style={{ color: colors.grey3, fontSize: 12 }}>
            Ordered quantity: {totalQty} {unitName}
          </Text>
          <Text style={{ color: colors.grey3, fontSize: 12 }}>
            Quantity shipped: {quantityShipped} {unitName}
          </Text>
          <Text style={{ color: colors.grey3, fontSize: 12 }}>
            Remaining quantity: {remainingQty} {unitName}
          </Text>
        </View>
        <View style={{ width: width / 1.1 }}>
          <Text style={styles.heading}>Preferred Vehicles: </Text>
          {orderItem.vehicle.map((veh, index) => {
            return (
              <View style={[styles.inLine, { justifyContent: 'flex-start' }]}>
                <Text
                  style={{ color: colors.grey3, fontSize: 12, marginLeft: 5 }}
                >
                  Vehicle {index + 1}
                </Text>
                <Text
                  style={{ color: colors.grey3, fontSize: 12, marginLeft: 15 }}
                >
                  {veh.selectedVehicle.brand}-{veh.selectedVehicle.model}{' '}
                  (Capacity:
                  {unitName.toLowerCase() === 'foot'
                    ? veh.selectedVehicle.capacityInFoot
                    : null}
                  {unitName.toLowerCase() === 'cm'
                    ? veh.selectedVehicle.capacityInCm
                    : null}
                  {unitName.toLowerCase() === 'ton'
                    ? veh.selectedVehicle.capacityInTon
                    : null}
                  {unitName})
                </Text>
                <Text
                  style={{ color: colors.grey3, fontSize: 12, marginLeft: 15 }}
                >
                  Trips required: {veh.requiredNoOfTrips}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Map the logistics data */}
        {logisticsData.length > 0 ? (
          <View>
            <Text style={[styles.heading, { marginLeft: 20 }]}>
              Booked logistics data
            </Text>
            <ListHeader />
            {logisticsData.map((l, index) => {
              var dateBooked = new Date(l.dateOfBooking).toLocaleString(
                undefined,
                {
                  timeZone: 'Asia/Kolkata',
                }
              );
              var dateOfDelivery = new Date(
                l.expectedDateOfDelivery
              ).toLocaleString(undefined, {
                timeZone: 'Asia/Kolkata',
              });
              return (
                <ListItem style={styles.listItem} key={l._id}>
                  <View style={styles.body}>
                    <Text style={[styles.contentText, { width: width / 6 }]}>
                      {l.vehicle.regNo}-{l.vehicle.brand}-{l.vehicle.model}{' '}
                      (Cap.
                      {unitName.toLowerCase() === 'foot'
                        ? l.vehicle.capacityInFoot
                        : null}
                      {unitName.toLowerCase() === 'cm'
                        ? l.vehicle.capacityInCm
                        : null}
                      {unitName.toLowerCase() === 'ton'
                        ? l.vehicle.capacityInTon
                        : null}{' '}
                      {unitName})
                    </Text>
                    <Text style={[styles.contentText, { width: width / 6 }]}>
                      {l.driver.name}
                      {' (Ph-'}
                      {l.driver.phone.substring(
                        l.driver.phone.length - 10,
                        l.driver.phone.length
                      )}
                      )
                    </Text>
                    <Text style={[styles.contentText, { width: width / 10 }]}>
                      {l.quantityShipped} {unitName}
                    </Text>
                    <Text style={[styles.contentText, { width: width / 5 }]}>
                      {dateBooked.split(' ')[2]}-{dateBooked.split(' ')[1]}-
                      {dateBooked.split(' ')[4]}, Time:
                      {dateBooked.split(' ')[3]}
                    </Text>
                    <Text style={[styles.contentText, { width: width / 5 }]}>
                      {dateOfDelivery.split(' ')[2]}-
                      {dateOfDelivery.split(' ')[1]}-
                      {dateOfDelivery.split(' ')[4]}, Time:
                      {dateOfDelivery.split(' ')[3]}
                    </Text>
                  </View>
                </ListItem>
              );
            })}
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.actionButton, styles.addLogisticsButton]}
          onPress={() => setBooking(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              mr="0"
              size="5"
              color={'green.700'}
              as={<MaterialIcons name="add-box" />}
            />
            <Text style={{ color: 'green', fontWeight: 'bold', marginLeft: 5 }}>
              {logisticsData.length === 0
                ? 'Enter a logistics record'
                : 'Enter another logistics record'}
            </Text>
          </View>
        </TouchableOpacity>
        {booking ? (
          <ScrollView style={{ marginTop: 10 }}>
            <View style={styles.inputBox}>
              <View>
                <Text style={{}}>Select a Vehicle</Text>
                <View style={styles.selectView}>
                  <Select
                    placeholder="Select Vehicle"
                    selectedValue={vehicle}
                    width={width * 0.75}
                    style={styles.select}
                    placeholderTextColor={'#333'}
                    accessibilityLabel="Choose Vehicle"
                    _selectedItem={{
                      bg: 'blue.300',
                    }}
                    onValueChange={(veh) => setVehicle(veh)}
                  >
                    {vehicleData.map((v) => {
                      var capText = ' (Capacity ';
                      {
                        if (orderItem.unitName.toLowerCase() === 'foot') {
                          capText += v.capacityInFoot + ' Foot) ';
                        } else if (orderItem.unitName.toLowerCase() === 'cm') {
                          capText += v.capacityInCm + ' Cm) ';
                        } else if (orderItem.unitName.toLowerCase() === 'ton') {
                          capText += v.capacityInTon + ' Ton) ';
                        }
                      }
                      return (
                        <Select.Item
                          label={
                            v.brand +
                            '-' +
                            v.model +
                            capText +
                            '- Fare: ' +
                            controls.currency +
                            v.farePerKm +
                            '/KM ' +
                            '- Min Fare: ' +
                            controls.currency +
                            v.minFare
                          }
                          value={v.id}
                          key={v.id}
                        />
                      );
                    })}
                  </Select>
                </View>
              </View>

              {/* Select Driver */}
              <View style={{ marginTop: 10 }}>
                <Text>Select Driver</Text>
                <View style={styles.selectView}>
                  <Select
                    placeholder="Select Driver"
                    // selectedValue={driver !== '' ? driver : null}
                    selectedValue={driver}
                    width={width * 0.75}
                    style={styles.select}
                    placeholderTextColor={'#333'}
                    accessibilityLabel="Choose Driver"
                    _selectedItem={{
                      bg: 'blue.300',
                    }}
                    onValueChange={(dri) => setDriver(dri)}
                    // onValueChange={(dri) => saveDriver(key, dri)}
                  >
                    {driversData.map((dr) => {
                      return (
                        <Select.Item
                          label={dr.name + ' (Mob-' + dr.phone + ')'}
                          value={dr.id}
                          key={dr.id}
                        />
                      );
                    })}
                  </Select>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text>Enter Quantity</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    placeholder={'Quantity'}
                    style={styles.inputQty}
                    name={'quantity'}
                    keyboardType={'numeric'}
                    value={quantity.toString()}
                    onChangeText={(qty) =>
                      setQuantity(isNaN(parseInt(qty)) ? 0 : parseInt(qty))
                    }
                  />
                  <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    {unitName}
                  </Text>
                </View>
              </View>
            </View>
            <View>{error ? <Error message={error} /> : null}</View>
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => saveLogistics()}
              >
                <Text style={{ color: colors.cardBackground }}>
                  Save Logistics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => resetFields()}
              >
                <Text style={{ color: colors.cardBackground }}>
                  Reset Fields
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const ListHeader = () => {
  return (
    <View style={styles.listHeader}>
      <Text style={[styles.listHeaderText, { width: width / 6 }]}>Vehicle</Text>
      <Text style={[styles.listHeaderText, { width: width / 6 }]}>Driver</Text>
      <Text style={[styles.listHeaderText, { width: width / 8 }]}>
        Qty. booked
      </Text>
      <Text style={[styles.listHeaderText, { width: width / 6 }]}>
        Date of booking
      </Text>
      <Text style={[styles.listHeaderText, { width: width / 6 }]}>
        Exp. date of delivery
      </Text>
    </View>
  );
};

export default BookLogistics;

const styles = StyleSheet.create({
  heading: {
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 5,
    color: colors.grey2,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  select: {
    height: 36,
    backgroundColor: '#EEFFFF',
    padding: 0,
    paddingLeft: 10,
    borderRadius: 2,
    // borderWidth: 0.5,
    borderColor: '#CCC',
  },
  input: {
    height: 36,
    backgroundColor: '#EEFFFF',
    padding: 0,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#CCC',
    width: width * 0.75,
  },
  inputQty: {
    height: 32,
    backgroundColor: '#EEFFFF',
    padding: 0,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#CCC',
    width: 120,
    // width: width * 0.75,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  inputBox: {
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 5,
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
  },
  inLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 0,
  },
  buttonView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  actionButton: {
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  saveButton: {
    backgroundColor: colors.buttons,
    borderColor: colors.buttons,
  },
  addLogisticsButton: {
    backgroundColor: colors.cardBackground,
    borderColor: 'green',
    paddingVertical: 3,
    borderWidth: 2,
  },
  cancelButton: {
    backgroundColor: colors.grey2,
    color: colors.grey2,
    borderColor: colors.grey2,
    marginLeft: 10,
  },

  listHeader: {
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
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

  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#CCC',
    margin: 0,
    padding: 0,
  },
  body: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  contentText: {
    flexWrap: 'wrap',
    fontSize: 12,
    marginHorizontal: 2,
    width: width / 7,
  },
});
