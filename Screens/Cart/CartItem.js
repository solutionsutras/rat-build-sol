import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Image } from 'native-base';
import { connect } from 'react-redux';
import { controls } from '../../assets/global/controls';
import * as actions from '../../Redux/Actions/cartActions';
import { colors } from '../../assets/global/globalStyles';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const CartItem = (props) => {
  const data = props.item;
  const index = props.index;
  const [item, setItem] = useState(props.item.item);
  const [qty, setQty] = useState(props.item.qty);
  const [rate, setRate] = useState(props.item.rate);
  const [unitValue, setUnitValue] = useState(props.item.selectedUnit);
  const [unitName, setUnitName] = useState(props.item.unitName);
  const [vehicle, setVehicle] = useState(props.item.vehicle);
  const [fromLocationCode, setFromLocationCode] = useState(
    props.item.fromLocationCode
  );
  const [toLocationCode, setToLocationCode] = useState(
    props.item.toLocationCode
  );
  const [tripDistance, setTripDistance] = useState(props.item.tripDistance);
  const [minTripDistance, setMinTripDistance] = useState(
    props.item.minTripDistance
  );
  const [kmWiseFare, setKmWiseFare] = useState(props.item.kmWiseFare);
  const [materialCost, setMaterialCost] = useState(props.item.materialCost);
  const [unitTransportationCost, setUnitTransportationCost] = useState(
    props.item.unitTransportationCost
  );
  const [requiredNoOfTrips, setRequiredNoOfTrips] = useState(
    props.item.requiredNoOfTrips
  );
  const [totalTransportationCost, setTotalTransportationCost] = useState(
    props.item.totalTransportationCost
  );
  const [capacity, setCapacity] = useState(0);
  const [itemTotal, setItemTotal] = useState(props.item.itemTotal);
  const [itemTotalTransportationCost, setItemTotalTransportationCost] =
    useState(props.item.itemTotalTransportationCost);

  useEffect(() => {
    if (unitName.toLowerCase() === 'foot') {
      setCapacity(vehicle.capacityInFoot);
    } else if (unitName.toLowerCase() === 'cm') {
      setCapacity(vehicle.capacityInCm);
    } else if (unitName.toLowerCase() === 'ton') {
      setCapacity(vehicle.capacityInTon);
    }

    return () => {};
  }, []);

  console.log(data);

  return (
    <ListItem style={styles.listItem} key={Math.random()}>
      <View style={styles.cartBody}>
        <View style={styles.inLine}>
          <Text style={styles.itemHeading}>Item {index + 1}</Text>
          <Image
            alt={data.item.itemName}
            style={{ marginTop: 5, marginBottom: 5 }}
            source={{
              uri: data.item.image
                ? data.item.image
                : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
            }}
            size={12}
            resizeMode={'contain'}
          />
          <View>
            <Text style={styles.contentTextBold}>
              Material: {data.item.itemName}
            </Text>
            <Text style={styles.contentTextGrey}>
              Type: {data.item.quality.qualityName}
            </Text>
          </View>
        </View>
        <View style={styles.cartBody}>
          <Text style={styles.contentHeading}>Pricing details</Text>
          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>Quantity:</Text>
            <Text style={styles.contentTextSmall}>
              {qty} {unitName.split('(')[0]}
            </Text>
          </View>
          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>
              Rate (per {unitName.split('(')[0]}):
            </Text>
            <Text style={styles.contentTextSmall}>
              {controls.currency}
              {rate}
            </Text>
          </View>
          <View style={[styles.inLinePrice, styles.totals]}>
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              Material cost:
            </Text>
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              {controls.currency}
              {materialCost}
            </Text>
          </View>

          <View style={{ width: '80%' }}>
            <Text style={styles.contentHeading}>
              Preferred vehicle(s) & Transport. cost:
            </Text>
            {vehicle.length > 0
              ? vehicle.map((veh, index) => {
                  let capacity = 0;
                  if (veh.selectedUnitName.toLowerCase() === 'foot') {
                    capacity = veh.selectedVehicle.capacityInFoot;
                  } else if (veh.selectedUnitName.toLowerCase() === 'cm') {
                    capacity = veh.selectedVehicle.capacityInCm;
                  } else if (veh.selectedUnitName.toLowerCase() === 'ton') {
                    capacity = veh.selectedVehicle.capacityInTon;
                  }
                  return (
                    <View style={{}}>
                      <View
                        style={[
                          styles.inLinePrice,
                          {
                            borderBottomWidth: 1,
                            width: '100%',
                            borderStyle: 'dotted',
                            borderColor: colors.grey4,
                          },
                        ]}
                      >
                        <Text style={styles.contentTextSmall}>
                          Vehicle {index + 1}
                        </Text>
                        <Text style={styles.contentTextSmall}>
                          {veh.selectedVehicle.brand} -{' '}
                          {veh.selectedVehicle.model} (Capacity: {capacity}{' '}
                          {veh.selectedUnitName})
                        </Text>
                      </View>

                      <View style={{ marginLeft: 20, width: '100%' }}>
                        <View style={styles.inLinePrice}>
                          <Text style={styles.contentTextSmall}>
                            Vehicle fare:{' '}
                          </Text>
                          <Text style={styles.contentTextSmall}>
                            {controls.currency}{' '}
                            {veh.tripDistance < veh.minTripDistance
                              ? veh.selectedVehicle.minFare
                              : veh.kmWiseFare}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.inLinePrice,
                            { justifyContent: 'flex-start' },
                          ]}
                        >
                          {veh.tripDistance < veh.minTripDistance ? (
                            <Text
                              style={[
                                styles.contentTextSmall,
                                { fontSize: 10 },
                              ]}
                            >
                              (Minimum fare - {controls.currency}
                              {veh.selectedVehicle.minFare} applied as trip
                              distance ({tripDistance}KM) is less than our
                              minimum condition of {veh.minTripDistance} KM)
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.contentTextSmall,
                                { fontSize: 10 },
                              ]}
                            >
                              (Unit Fare - {controls.currency}
                              {veh.selectedVehicle.farePerKm}/KM X Distance -{' '}
                              {veh.tripDistance} KM)
                            </Text>
                          )}
                        </View>

                        <View style={styles.inLinePrice}>
                          <Text style={styles.contentTextSmall}>
                            Load Unload Cost:
                          </Text>
                          <Text style={styles.contentTextSmall}>
                            {controls.currency}
                            {veh.selectedVehicle.loadUnloadCost}
                          </Text>
                        </View>

                        {veh.selectedVehicle.tollApplicable &&
                        veh.selectedVehicle.tollTax ? (
                          <View style={styles.inLinePrice}>
                            <Text style={styles.contentTextSmall}>
                              Toll fee:
                            </Text>
                            <Text style={styles.contentTextSmall}>
                              {controls.currency}
                              {veh.selectedVehicle.tollTax}
                            </Text>
                          </View>
                        ) : null}

                        <View
                          style={{
                            borderTopWidth: 1,
                            borderColor: colors.grey3,
                          }}
                        >
                          <View style={[styles.inLinePrice]}>
                            <Text style={styles.contentTextBold}>
                              Single trip transport cost:
                            </Text>
                            <Text style={styles.contentTextBold}>
                              {controls.currency}
                              {veh.unitTransportationCost}
                            </Text>
                          </View>

                          <View style={[styles.inLinePrice]}>
                            <Text style={styles.contentTextBold}>
                              No of trips required:
                            </Text>
                            <Text style={styles.contentTextBold}>
                              {veh.requiredNoOfTrips}
                            </Text>
                          </View>

                          <View style={[styles.inLinePrice]}>
                            <Text style={styles.contentTextBold}>
                              All trips transport cost:
                            </Text>
                            <Text style={styles.contentTextBold}>
                              {controls.currency}
                              {veh.totalTransportationCost}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>

          <View style={[styles.inLinePrice, styles.totals, { marginTop: 10 }]}>
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              Total transport. cost:
            </Text>
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              {controls.currency}
              {itemTotalTransportationCost}
            </Text>
          </View>

          <View
            style={[
              styles.inLinePrice,
              styles.totals,
              { marginTop: 0, borderTopWidth: 0 },
            ]}
          >
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              Item total:
            </Text>
            <Text style={[styles.contentTextBold, styles.grandTotalsText]}>
              {controls.currency}
              {itemTotal}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              style={styles.removeItem}
              onPress={() => {
                props.removeFromCart(data),
                  Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: `${item.itemName} removed from cart`,
                    text2: 'Go to your cart to complete your order',
                  });
              }}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="trash"
                type="font-awesome"
                color={'red'}
                size={14}
              />
              <Text style={{ color: 'red' }}>Remove This Item</Text>
            </TouchableOpacity>

            {/* <EasyButton
              medium
              danger
              onPress={() => {
                props.removeFromCart(data),
                  Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: `${item.itemName} removed from cart`,
                    text2: 'Go to your cart to complete your order',
                  });
              }}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="trash"
                type="font-awesome"
                color={'white'}
                size={20}
              />
              <Text style={{ color: 'white' }}>Remove</Text>
            </EasyButton> */}
          </View>
        </View>
      </View>
    </ListItem>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);

const styles = StyleSheet.create({
  listItem: {
    margin: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  cartBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderColor: colors.grey4,
    margin: 0,
    padding: 0,
  },
  contentHeading: {
    textTransform: 'uppercase',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  inLine: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.grey5,
  },
  inLinePrice: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  totals: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.grey3,
    paddingVertical: 5,
  },
  subTotals: {
    marginBottom: 0,
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    // borderColor: colors.grey3,
    // paddingVertical: 5,
  },
  grandTotals: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.grey3,
    paddingVertical: 5,
  },
  contentTextSmall: {
    fontSize: 12.3,
    marginRight: 5,
    marginBottom: 3,
  },
  contentTextGrey: {
    fontSize: 16,
    color: colors.grey2,
  },
  contentTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    marginBottom: 5,
    color: colors.grey1,
  },
  itemHeading: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colors.grey2,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey2,
    paddingVertical: 2,
  },
  removeItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  grandTotalsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.grey2,
  },
});
