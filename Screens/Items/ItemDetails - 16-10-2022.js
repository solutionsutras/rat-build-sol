import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Center,
  Heading,
  Select,
  Radio,
  CheckIcon,
  Stack,
  Spacer,
} from 'native-base';
import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls';
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import baseUrl from '../../assets/common/baseUrl';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import MapFunctions from './MapFunctions';

const { width, height } = Dimensions.get('window');
const ItemDetails = (props) => {
  const [item, setitem] = useState(props.route.params.item);
  const [vehicleData, setVehicleData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [unitValue, setUnitValue] = useState();
  const [unitName, setUnitName] = useState();
  const [selectedUnitName, setSelectedUnitName] = useState('');
  const [rate, setRate] = useState(0);
  const [qty, setQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);

  const [vehicle, setVehicle] = useState();
  const [vehicle1, setVehicle1] = useState();
  const [vehicle2, setVehicle2] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState();
  const [selectedVehicle1, setSelectedVehicle1] = useState();
  const [selectedVehicle2, setSelectedVehicle2] = useState();
  const [preferredVehicles, setPreferredVehicles] = useState([]);

  const [unitFare, setUnitFare] = useState(0);
  const [minFare, setMinFare] = useState(0);
  const [kmWiseFare, setKmWiseFare] = useState(0);
  const [unitTransportationCost, setUnitTransportationCost] = useState(0);
  const [totalTransportationCost, setTotalTransportationCost] = useState(0);
  const [loadUnloadCost, setLoadUnloadCost] = useState(0);
  const [fromLocationCode, setFromLocationCode] = useState(
    'Chandikhol, Jajpur, Odisha'
  );
  const [toLocationCode, setToLocationCode] = useState('');
  const [tripDistance, setTripDistance] = useState(0);
  const [minTripDistance, setMinTripDistance] = useState(0);
  const [tollApplicable, setTollApplicable] = useState(false);
  const [tollTax, setTollTax] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [pin, setPin] = useState();
  const [itemTotal, setItemTotal] = useState(0);
  const [vehicleCapacity, setVehicleCapacity] = useState([]);
  const [requiredNoOfTrips, setRequiredNoOfTrips] = useState(0);

  const [userVehiclesArray, setUserVehiclesArray] = useState([]);

  // Fetch all vehicles information and minimum trip distance
  useEffect(() => {
    // Get Vehicles from Database
    axios
      .get(`${baseUrl}vehicles`)
      .then((res) => setVehicleData(res.data))
      .catch((error) => console.log('Error in loading Vehicles'));

    // Get minimum Trip Distance to be considered
    axios
      .get(`${baseUrl}controls/getbytype/100`)
      .then((res) => {
        setMinTripDistance(parseInt(res.data.fieldValue));
      })
      .catch((error) =>
        console.log('Error in getting minimum travel distance')
      );

    return () => {
      setVehicleData([]);
    };
  }, []);

  // Set first preferred vehicle information
  useEffect(() => {
    if (vehicle) {
      axios
        .get(`${baseUrl}vehicles/${vehicle}`)
        .then((res) => {
          setSelectedVehicle(res.data);
          let vArray = [...userVehiclesArray];
          vArray[0] = res.data;
          setUserVehiclesArray(vArray);
        })
        .catch((error) => console.log('Error in getting first vehicle data'));
    }
    return () => {};
  }, [vehicle]);

  // Set second preferred vehicle information
  useEffect(() => {
    if (vehicle1) {
      axios
        .get(`${baseUrl}vehicles/${vehicle1}`)
        .then((res) => {
          setSelectedVehicle1(res.data);
          let vArray = [...userVehiclesArray];
          vArray[1] = res.data;
          setUserVehiclesArray(vArray);
        })
        .catch((error) => console.log('Error in getting second vehicle data'));
    }
    return () => {};
  }, [vehicle1]);

  // Set third preferred vehicle information
  useEffect(() => {
    if (vehicle2) {
      axios
        .get(`${baseUrl}vehicles/${vehicle2}`)
        .then((res) => {
          setSelectedVehicle2(res.data);
          let vArray = [...userVehiclesArray];
          vArray[2] = res.data;
          setUserVehiclesArray(vArray);
        })
        .catch((error) => console.log('Error in getting third vehicle data'));
    }
    return () => {};
  }, [vehicle2]);

  // Calculate total cost
  useEffect(() => {
    let tot = isNaN(materialCost + totalTransportationCost)
      ? 0
      : parseInt(materialCost + totalTransportationCost);

    setItemTotal(tot);
    return () => {};
  }, [materialCost, totalTransportationCost]);

  // Calculate trnsportaion cost
  const calculateTransportCost = (allVehicles) => {
    // console.log('allVehicles: ', allVehicles);
    var qtyLeft = qty;
    let len = allVehicles.length;
    let tripCount = 0;
    let vehicleArrayElement = [];
    allVehicles.forEach((veh, index) => {
      console.log(`${index}.At start---qtyLeft: `, qtyLeft);
      if (veh) {
        // console.log('veh: ', veh);
        let uFare = parseInt(veh.farePerKm);
        let mFare = isNaN(parseInt(veh.minFare)) ? 0 : parseInt(veh.minFare);

        let luCost = veh.loadUnloadCost;

        let capacityArray = [
          veh.capacityInFoot,
          veh.capacityInCm,
          veh.capacityInTon,
        ];

        let unitTCost = 0;
        let tTax = 0;

        let kmFare = uFare * parseInt(tripDistance);
        setKmWiseFare(kmFare);

        if (tripDistance < minTripDistance) {
          unitTCost = parseInt(minFare) + parseInt(loadUnloadCost);
        } else {
          unitTCost = kmFare + parseInt(loadUnloadCost);
        }
        if (veh.tollApplicable) {
          tTax = isNaN(parseInt(veh.tollTax)) ? 0 : parseInt(veh.tollTax);
          unitTCost = unitTCost + tTax;
        }

        var tripsRequired = 0;
        var quantityByThisVehicle = 0;

        if (capacityArray[selectedIndex] !== undefined && qtyLeft > 0) {
          console.log('mod value: ', qtyLeft % capacityArray[selectedIndex]);
          if (qtyLeft % capacityArray[selectedIndex] > 0) {
            if (index !== len - 1) {
              tripsRequired =
                Math.ceil(qtyLeft / capacityArray[selectedIndex]) - 1;
              quantityByThisVehicle =
                tripsRequired * capacityArray[selectedIndex];
              qtyLeft = qtyLeft - tripsRequired * capacityArray[selectedIndex];
            } else {
              tripsRequired = Math.ceil(qtyLeft / capacityArray[selectedIndex]);
              quantityByThisVehicle = qtyLeft;
              qtyLeft = 0;
            }
          } else {
            tripsRequired = Math.ceil(qtyLeft / capacityArray[selectedIndex]);
            quantityByThisVehicle = qtyLeft;
            qtyLeft = 0;
          }
          console.log('tripsRequired: ', tripsRequired);
          // setRequiredNoOfTrips(requiredNoOfTrips + tripsRequired);
          tripCount += tripsRequired;
        }

        setUnitTransportationCost(unitTCost);
        setTotalTransportationCost(unitTCost * tripsRequired);
        setRemainingQty(qtyLeft);

        vehicleArrayElement[vehicleArrayElement.length] = {
          selectedVehicle: veh,
          selectedUnitName: selectedUnitName,
          tripDistance: tripDistance,
          minTripDistance: minTripDistance,
          requiredNoOfTrips: tripsRequired,
          quantityByThisVehicle: quantityByThisVehicle,
        };
      }
      console.log('At end---qtyLeft: ', qtyLeft);
    });

    setRequiredNoOfTrips(tripCount);
    console.log('tripCount: ', tripCount);
    console.log('requiredNoOfTrips: ', requiredNoOfTrips);

    setPreferredVehicles(vehicleArrayElement);

    console.log('vehicleArrayElement: ', vehicleArrayElement);
    console.log('preferredVehicles: ', preferredVehicles);
  };

  const resetVehicles = () => {
    setVehicle('');
    setVehicle1('');
    setVehicle2('');
  };
  return (
    <Center style={styles.container}>
      <ScrollView style={{ marginBottom: 80, padding: 5 }}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image
                ? item.image
                : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{item.itemName}</Text>
          <Text style={styles.contentText}>
            Quality : {item.quality.qualityName}
          </Text>
        </View>
        <View>
          <Text style={{ marginTop: 0 }}>Description : {item.itemDesc}</Text>
          {item.isAvailable ? null : (
            <View>
              <Text style={{ color: 'red' }}>This item is not available</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 15 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Select a measurement unit
          </Text>
          <Radio.Group
            key={Math.random()}
            name="Measurement Unit"
            value={unitValue}
            onChange={(nextValue) => {
              [setUnitValue(nextValue)];
            }}
            accessibilityLabel="Select Measurement Unit"
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
            >
              {item.rates.map((rate, index) => {
                return (
                  <Stack marginTop={2}>
                    <Radio
                      colorScheme="green"
                      size="5"
                      borderWidth={1}
                      borderRadius={2}
                      backgroundColor={colors.grey5}
                      my={0}
                      mx={0}
                      value={rate.unit.id}
                      accessibilityLabel="Select measurement unit"
                      onPress={() => {
                        [
                          setRate(parseInt(rate.cost)),
                          setSelectedUnitName(rate.unit.unitName),
                          setMaterialCost(parseInt(rate.cost) * qty),
                          setSelectedIndex(index),
                        ];
                      }}
                    >
                      <Text style={{ marginRight: 20 }}>
                        {controls.currency}
                        {rate.cost}/{rate.unit.unitName}
                      </Text>
                    </Radio>
                  </Stack>
                );
              })}
            </View>
          </Radio.Group>
        </View>

        {/* <Text>selected:{unitValue}</Text>
        <Text>selectedIndex:{selectedIndex}</Text>
        <Text>requiredNoOfTrips:{requiredNoOfTrips}</Text> */}

        <View style={{ marginTop: 15 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Enter required quantity
          </Text>
          <View style={styles.qtyContainer}>
            <TextInput
              style={styles.input}
              placeholder="0"
              name="qty"
              id="qty"
              value={qty.toString()}
              keyboardType={'numeric'}
              onChangeText={(text) => {
                [
                  setQty(isNaN(parseInt(text)) ? 0 : parseInt(text)),
                  setRemainingQty(isNaN(parseInt(text)) ? 0 : parseInt(text)),
                  setMaterialCost(
                    rate * (isNaN(parseInt(text)) ? 0 : parseInt(text))
                  ),
                ];
              }}
            />
            <Text style={{ marginLeft: 5, fontSize: 14, fontStyle: 'italic' }}>
              {selectedUnitName.split('(')[0]}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.costContainer}>
            <Text style={{ color: 'white' }}>Material Cost: </Text>
            <Text style={{ color: 'white' }}>
              {controls.currency}
              {materialCost.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
            Enter Trip Distance
          </Text>
          <View style={styles.qtyContainer}>
            <TextInput
              style={styles.input}
              placeholder="0"
              name="tripDistance"
              id="tripDistance"
              value={tripDistance.toString()}
              keyboardType={'numeric'}
              onChangeText={async (text) => {
                setTripDistance(isNaN(parseInt(text)) ? 0 : parseInt(text));
              }}
            />
            <Text style={{ marginLeft: 5, fontSize: 14, fontStyle: 'italic' }}>
              KM
            </Text>
          </View>
        </View>

        {/* First preferred vehicle */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Select 1st preferred vehicle
          </Text>
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
              onValueChange={(e) => {
                setVehicle(e);
              }}
            >
              {vehicleData.map((v) => {
                var capText = ' (Cap. ';
                {
                  if (selectedIndex === 0) {
                    capText += v.capacityInFoot + ' Foot) ';
                  } else if (selectedIndex === 1) {
                    capText += v.capacityInCm + ' Cm) ';
                  } else if (selectedIndex === 2) {
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

        {/* Second preferred vehicle */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Select 2nd preferred vehicle
          </Text>
          <View style={styles.selectView}>
            <Select
              placeholder="Select Vehicle"
              selectedValue={vehicle1}
              width={width * 0.75}
              style={styles.select}
              placeholderTextColor={'#333'}
              accessibilityLabel="Choose Vehicle"
              _selectedItem={{
                bg: 'blue.300',
              }}
              onValueChange={(e) => {
                setVehicle1(e);
                // populateFare(e);
              }}
            >
              {vehicleData.map((v) => {
                var capText = ' (Cap. ';
                {
                  if (selectedIndex === 0) {
                    capText += v.capacityInFoot + ' Foot) ';
                  } else if (selectedIndex === 1) {
                    capText += v.capacityInCm + ' Cm) ';
                  } else if (selectedIndex === 2) {
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

        {/* {remainingQty > 0 ? ( */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Select 3rd preferred vehicle
          </Text>
          <View style={styles.selectView}>
            <Select
              placeholder="Select Vehicle"
              selectedValue={vehicle2}
              width={width * 0.75}
              style={styles.select}
              placeholderTextColor={'#333'}
              accessibilityLabel="Choose Vehicle"
              _selectedItem={{
                bg: 'blue.300',
              }}
              onValueChange={(e) => {
                setVehicle2(e);
              }}
            >
              {vehicleData.map((v) => {
                var capText = ' (Cap. ';
                {
                  if (selectedIndex === 0) {
                    capText += v.capacityInFoot + ' Foot) ';
                  } else if (selectedIndex === 1) {
                    capText += v.capacityInCm + ' Cm) ';
                  } else if (selectedIndex === 2) {
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
        {/* ) : null} */}
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => calculateTransportCost(userVehiclesArray)}
          >
            <Text style={{ color: colors.grey2 }}>
              Calculate Transport Cost
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => resetVehicles()}
          >
            <Text style={{ color: colors.grey2 }}>Reset Vehicles</Text>
          </TouchableOpacity>
        </View>
        {preferredVehicles.length > 0 ? (
          <View>
            <Text style={styles.tCostTextHeading}>
              Transaport cost calculation
            </Text>
            <View>
              <View style={styles.inLine}>
                <Text style={styles.tCostText}>A. Per KM fare:</Text>
                <Text style={styles.tCostValue}>
                  {controls.currency}
                  {unitFare}
                </Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>
                  B. Trip distance (approx.):
                </Text>
                <Text style={styles.tCostValue}>{tripDistance} KM</Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>C. KM wise fare (A x B):</Text>
                <Text style={styles.tCostValue}>
                  {controls.currency}
                  {kmWiseFare}
                </Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>
                  D. Minimum fare (If distance less than {minTripDistance} KM):
                </Text>
                <Text style={styles.tCostValue}>
                  {controls.currency}
                  {minFare}
                </Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>E. Loading-unloading cost:</Text>
                <Text style={styles.tCostValue}>
                  {controls.currency}
                  {loadUnloadCost}
                </Text>
              </View>

              {/* <View style={styles.inLine}>
                  <Text style={styles.tCostText}>F. Toll Fee:</Text>
                  <Text style={styles.tCostValue}>
                    {controls.currency}
                    {tollApplicable ? tollTax : 0}
                  </Text>
                </View> */}

              {tripDistance < minTripDistance ? (
                <View style={styles.inLine}>
                  <Text style={styles.tCostText}>
                    F. Single vehicle transportation cost (D + E):
                  </Text>
                  <Text style={styles.tCostValue}>
                    {controls.currency}
                    {unitTransportationCost}
                  </Text>
                </View>
              ) : (
                <View style={styles.inLine}>
                  <Text style={styles.tCostText}>
                    F. Single vehicle transportation cost (C + E):
                  </Text>
                  <Text style={styles.tCostValue}>
                    {controls.currency}
                    {unitTransportationCost}
                  </Text>
                </View>
              )}

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>G. No of trips required:</Text>
                <Text style={styles.tCostValue}>{requiredNoOfTrips}</Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.tCostText}>
                  H. Total transportation cost(F x G):
                </Text>
                <Text style={styles.tCostValue}>
                  {controls.currency}
                  {totalTransportationCost}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        <View style={{ marginTop: 10 }}>
          <View style={styles.costContainer}>
            <Text style={{ color: 'white' }}>Total Transportation Cost: </Text>
            <Text style={{ color: 'white' }}>
              {controls.currency}
              {totalTransportationCost.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontStyle: 'italic' ,fontWeight: 'bold' }}>
            Enter your area Pincode
          </Text>
          <View style={styles.qtyContainer}>
            <TextInput
              style={styles.input}
              placeholder="0"
              name="pin"
              id="pin"
              value={pin}
              keyboardType={'numeric'}
              onChangeText={async (text) => {
                setPin(text);
              }}
            />
            <Text style={{ marginLeft: 5 }}>{selectedUnitName}</Text>
          </View>
        </View> */}

        <View style={{ marginTop: 10 }}>
          <Text
            style={{ fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Map
          </Text>
          <View style={styles.qtyContainer}>
            <MapFunctions />
          </View>
          {/* <Text>PIN: {pin}</Text> */}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Text style={styles.totalPrice}>
          Item Total: {controls.currency}
          {itemTotal}
        </Text>
        <View style={styles.bottomContainerInner}>
          {/* <View style={{ margin: 0 }}>
                        <Text style={styles.priceText}>Price: {controls.currency}{item.price}/{item.unit}</Text>
                    </View> */}
          <View style={{ margin: 0 }}>
            <EasyButton
              medium
              primary
              onPress={() => {
                [
                  props.addItemToCart(
                    item,
                    qty,
                    unitValue,
                    rate,
                    selectedUnitName,
                    selectedVehicle,
                    materialCost,
                    fromLocationCode,
                    toLocationCode,
                    minTripDistance,
                    tripDistance,
                    kmWiseFare,
                    loadUnloadCost,
                    unitTransportationCost,
                    requiredNoOfTrips,
                    totalTransportationCost,
                    discountPercent,
                    discountAmount,
                    itemTotal
                  ),
                  Toast.show({
                    topOffset: 60,
                    type: 'success',
                    text1: `${item.itemName} added to cart`,
                    text2: 'Go to your cart to complete your order',
                  }),
                  props.navigation.navigate('Homescreen'),
                ];
              }}
            >
              <Text style={{ color: 'white' }}>Add to Cart</Text>
            </EasyButton>
          </View>
        </View>
      </View>
    </Center>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (
      item,
      qty,
      unitValue,
      rate,
      selectedUnitName,
      selectedVehicle,
      materialCost,
      fromLocationCode,
      toLocationCode,
      minTripDistance,
      tripDistance,
      kmWiseFare,
      loadUnloadCost,
      unitTransportationCost,
      requiredNoOfTrips,
      totalTransportationCost,
      discountPercent,
      discountAmount,
      itemTotal
    ) =>
      dispatch(
        actions.addToCart({
          item: item,
          qty: qty,
          selectedUnit: unitValue,
          rate: rate,
          unitName: selectedUnitName,
          vehicle: selectedVehicle,
          materialCost: materialCost,
          fromLocationCode: fromLocationCode,
          toLocationCode: toLocationCode,
          minTripDistance: minTripDistance,
          tripDistance: tripDistance,
          kmWiseFare: kmWiseFare,
          loadUnloadCost: loadUnloadCost,
          unitTransportationCost: unitTransportationCost,
          requiredNoOfTrips: requiredNoOfTrips,
          totalTransportationCost: totalTransportationCost,
          discountPercent: discountPercent,
          discountAmount: discountAmount,
          itemTotal: itemTotal,
        })
      ),
  };
};

export default connect(null, mapDispatchToProps)(ItemDetails);

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    backgroundColor: 'white',
    marginTop: 5,
    padding: 0,
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: width / 3,
    resizeMode: 'cover',
  },
  contentContainer: {
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 0,
    width: width * 0.75,
  },
  contentHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  contentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#EEE',
  },
  bottomContainerInner: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  totalPrice: {
    fontSize: 14,
    margin: 20,
    color: 'red',
  },
  priceText: {
    fontSize: 14,
    margin: 10,
    color: 'red',
  },
  select: {
    height: 32,
    backgroundColor: '#EEFFFF',
    padding: 0,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.buttons,
    fontSize: 12,
  },
  selectView: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyContainer: {
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: width * 0.75,
  },
  input: {
    width: '40%',
    height: 32,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
    fontSize: 14,
    textAlign: 'center',
  },
  costContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: width * 0.75,
    backgroundColor: colors.grey2,
    padding: 5,
    borderColor: colors.buttons,
    borderWidth: 1,
    borderRadius: 5,
  },
  tCostTextHeading: {
    fontSize: 14,
    color: colors.grey2,
    marginVertical: 5,
  },
  tCostText: {
    fontSize: 12,
    color: colors.grey2,
  },
  tCostValue: {
    fontSize: 12,
    color: colors.grey2,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  italic: {
    fontStyle: 'italic',
  },
  inLine: {
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 0,
  },
  inLine2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 5,
    alignItems: 'flex-start',
  },
  bordered1: {
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  actionButton: {
    borderWidth: 1,
    // borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderColor: colors.buttons,
    backgroundColor: 'white',
    marginVertical: 5,
    elevation: 1,
  },
});
