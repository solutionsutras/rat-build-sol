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
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState('');
  const [vehicleData, setVehicleData] = useState([]);
  const [selected, setSelected] = useState();
  const [unitValue, setUnitValue] = useState();
  const [unitName, setUnitName] = useState();
  const [selectedUnit, setSelectedUnit] = useState('');
  const [rate, setRate] = useState(0);
  const [qty, setQty] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [vehicle, setVehicle] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState([]);
  const [unitFare, setUnitFare] = useState(0);
  const [minFare, setMinFare] = useState(0);
  const [kmWiseFare, setKmWiseFare] = useState(0);
  const [transportationCost, setTransportationCost] = useState(0);
  const [loadUnloadCost, setLoadUnloadCost] = useState(0);
  const [fromLocationCode, setFromLocationCode] = useState('Chandikhol, Jajpur, Odisha');
  const [toLocationCode, setToLocationCode] = useState('');
  const [tripDistance, setTripDistance] = useState(0);
  const [minTripDistance, setMinTripDistance] = useState(0);
  const [tollApplicable, setTollApplicable] = useState(false);
  const [tollTax, setTollTax] = useState(0);
  const [advanceToPay, setAdvanceToPay] = useState(0);
  const [balanceToPay, setBalanceToPay] = useState(0);
  const [pin, setPin] = useState();
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    if (props.route.params.item.isAvailable == true) {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText('Available');
    } else {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText('Unavailable');
    }

    // Get Vehicles from Database
    axios
      .get(`${baseUrl}vehicles`)
      .then((res) => setVehicleData(res.data))
      .catch((error) => alert('Error in loading Vehicles'));

    // Get minimum Trip Distance to be considered
    axios
      .get(`${baseUrl}controls/getbytype/100`)
      .then((res) => {
        setMinTripDistance(parseInt(res.data[0].fieldValue));
      })
      .catch((error) => alert('Error in getting minimum travel distance'));

    return () => {
      setAvailability(null);
      setAvailabilityText('');
      setVehicleData([]);
    };
  }, []);

  useEffect(() => {
    if (vehicle !== undefined) {
      axios
        .get(`${baseUrl}vehicles/${vehicle}`)
        .then((res) => {
          setSelectedVehicle(res.data);
          setUnitFare(parseInt(res.data.farePerKm));
          setMinFare(
            isNaN(parseInt(res.data.minFare)) ? 0 : parseInt(res.data.minFare)
          );
          setLoadUnloadCost(res.data.loadUnloadCost);
          setTollApplicable(res.data.tollApplicable);
          setTollTax(res.data.tollTax);
        })
        .catch((error) => console.log('Error in getting vehicles data'));
    }

    let tCost = 0;
    let tTax = 0;
    // console.log('useeffect 2...........');
    // console.log('tripDistance: ', tripDistance);
    // console.log('minTripDistance: ', minTripDistance);

    let kmFare = parseInt(unitFare) * parseInt(tripDistance);
    setKmWiseFare(kmFare);

    if (tripDistance < minTripDistance) {
      tCost = parseInt(minFare) + parseInt(loadUnloadCost);
    } else {
      tCost = kmFare + parseInt(loadUnloadCost);
    }
    if (tollApplicable) {
      tTax = isNaN(parseInt(tollTax)) ? 0 : parseInt(tollTax);
      tCost = tCost + tTax;
    }

    setTransportationCost(tCost);

    // console.log('3. tCost: ', tCost);
    // console.log('3. kmWiseFare: ', kmWiseFare);
    let tot = isNaN(materialCost + transportationCost)
      ? 0
      : parseInt(materialCost + transportationCost);

    setItemTotal(tot);
    return () => {
      setSelectedVehicle([]);
    };
    // setTripDistance(minTripDistance);
  }, [
    vehicle,
    materialCost,
    qty,
    unitValue,
    minFare,
    tripDistance,
    transportationCost,
  ]);

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
          <Text style={styles.contentHeader}>{item.itemName}</Text>
          <Text style={styles.contentText}>
            Quality : {item.quality.qualityName}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={{}}>Description : {item.itemDesc}</Text>
          {item.isAvailable ? null : (
            <View>
              <Text style={{ color: 'red' }}>This item is not available</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Select a measurement unit
          </Text>
          <Radio.Group
            key={Math.random()}
            name="Measurement Unit"
            value={unitValue}
            onChange={(nextValue) => {
              [setUnitValue(nextValue), setSelected(nextValue)];
            }}
            accessibilityLabel="Select Measurement Unit"
          >
            {item.rates.map((rate, index) => {
              return (
                <Stack marginTop={2}>
                  <Radio
                    colorScheme="green"
                    size="sm"
                    my={0}
                    mx={0}
                    value={rate.unit.id}
                    accessibilityLabel="Select payment method"
                    onPress={() => {
                      [
                        setRate(parseInt(rate.cost)),
                        setSelectedUnit(rate.unit.unitName),
                        setMaterialCost(parseInt(rate.cost) * qty),
                        // setItemTotal(materialCost + transportationCost)
                      ];
                    }}
                  >
                    <Text style={{ marginLeft: 5 }}>
                      {controls.currency}
                      {rate.cost}/{rate.unit.unitName}
                    </Text>
                  </Radio>
                </Stack>
              );
            })}
          </Radio.Group>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
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
                  setMaterialCost(
                    rate * (isNaN(parseInt(text)) ? 0 : parseInt(text))
                  ),
                  // setItemTotal(materialCost + transportationCost)
                ];
              }}
            />
            <Text style={{ marginLeft: 5, fontSize:18, }}>{selectedUnit.split('(')[0]}</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.costContainer}>
            {/* <Text style={{color:'white'}}>Rate: {rate},</Text>
                    <Text style={{color:'white'}}>Qty: {qty},</Text> */}
            <Text style={{ color: 'white' }}>Material Cost: </Text>
            <Text style={{ color: 'white' }}>
              {controls.currency}
              {materialCost.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Enter Trip Distance
          </Text>
          <View style={styles.qtyContainer}>
            <TextInput
              style={styles.input}
              placeholder="0"
              name="tripDistance"
              id="tripDistance"
              value={tripDistance}
              keyboardType={'numeric'}
              onChangeText={async (text) => {
                setTripDistance(parseInt(text));
              }}
            />
            <Text style={{ marginLeft: 5, fontSize:18, }}>KM</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Select a vehicle
          </Text>
          <View style={styles.selectView}>
            <Select
              placeholder="Select Vehicle"
              selectedValue={null}
              width={width * 0.75}
              style={styles.select}
              placeholderTextColor={'#333'}
              accessibilityLabel="Choose Vehicle"
              _selectedItem={{
                bg: 'blue.300',
              }}
              onValueChange={(e) => {
                setVehicle(e);
                // populateFare(e);
              }}
            >
              {vehicleData.map((v) => {
                return (
                  <Select.Item
                    label={
                      v.brand +
                      '-' +
                      v.model +
                      '- Fare: ' +
                      controls.currency +
                      v.farePerKm +
                      '/KM ' +
                      '- Min Fare: ' +
                      controls.currency +
                      v.minFare +
                      ' - Capacity: ' +
                      v.capacityInTon +
                      'Ton'
                    }
                    value={v.id}
                    key={v.id}
                  />
                );
              })}
            </Select>
          </View>
          {vehicle !== undefined ? (
            <View>
              <Text style={styles.costSplitHeading}>
                Transaport Cost Calculation
              </Text>
              <View>
                <Text style={styles.costSplit}>
                  A. Per KM Fare: {controls.currency}
                  {unitFare}
                </Text>
                <Text style={styles.costSplit}>
                  B. Trip Distance (Approx.): {tripDistance} KM
                </Text>

                <Text style={styles.costSplit}>
                  C. KM Wise Fare (A x B): {controls.currency}
                  {kmWiseFare}
                </Text>

                <Text style={styles.costSplit}>
                  D. Minimum Fare (If Distance less than {minTripDistance} KM):
                  {controls.currency}
                  {minFare}
                </Text>

                {/* {tripDistance < minTripDistance ? (
                  <View style={{ width: '90%', marginLeft: 15 }}>
                    <Text style={styles.costSplit}>
                      (Note: Min. fare of {minFare} is applied for the vehicle
                      as trip distance is less than the minimum condition of 60
                      KM. )
                    </Text>
                  </View>
                ) : null} */}

                <Text style={styles.costSplit}>
                  E. Load Unload Cost: {controls.currency}
                  {loadUnloadCost}
                </Text>

                <Text style={styles.costSplit}>
                  F. Toll Tax: {controls.currency}
                  {tollApplicable ? tollTax : 0}
                </Text>

                {tripDistance < minTripDistance ? (
                  <Text style={styles.costSplit}>
                    G. Transportation Cost (D + E + F): {controls.currency}
                    {transportationCost}
                  </Text>
                ) : (
                  <Text style={styles.costSplit}>
                    G. Transportation Cost (C + E + F): {controls.currency}
                    {transportationCost}
                  </Text>
                )}
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.costContainer}>
            <Text style={{ color: 'white' }}>Total Transportation Cost: </Text>
            <Text style={{ color: 'white' }}>
              {controls.currency}
              {transportationCost.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
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
            <Text style={{ marginLeft: 5 }}>{selectedUnit}</Text>
          </View>
        </View> */}

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Map</Text>
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
                    selectedUnit,
                    selectedVehicle,
                    materialCost,
                    fromLocationCode,
                    toLocationCode,
                    minTripDistance,
                    tripDistance,
                    kmWiseFare,
                    loadUnloadCost,
                    transportationCost,
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
      selectedUnit,
      selectedVehicle,
      materialCost,
      fromLocationCode,
      toLocationCode,
      minTripDistance,
      tripDistance,
      kmWiseFare,
      loadUnloadCost,
      transportationCost,
      itemTotal
    ) =>
      dispatch(
        actions.addToCart({
          item,
          qty: qty,
          selectedUnit: unitValue,
          rate: rate,
          unitName: selectedUnit,
          vehicle: selectedVehicle,
          materialCost: materialCost,
          fromLocationCode: fromLocationCode,
          toLocationCode: toLocationCode,
          minTripDistance: minTripDistance,
          tripDistance: tripDistance,
          kmWiseFare: kmWiseFare,
          loadUnloadCost: loadUnloadCost,
          transportationCost: transportationCost,
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
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  image: {
    width: width / 2,
    height: width / 2,
    // borderWidth:2,
    // borderColor:'#CCC',
    // width:'100%',
    // height:250,
  },
  contentContainer: {
    marginTop: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    width: width * 0.75,
  },
  contentHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  contentText: {
    fontSize: 18,
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
    fontSize: 16,
    margin: 20,
    color: 'red',
  },
  priceText: {
    fontSize: 16,
    margin: 10,
    color: 'red',
  },
  select: {
    height: 36,
    backgroundColor: '#EEFFFF',
    padding: 0,
    paddingLeft: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.buttons,
    fontSize: 14,
  },
  selectView: {
    marginTop: 5,
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
    height: 36,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.buttons,
    fontSize: 18,
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
  costSplitHeading: {
    fontSize: 14,
    color: colors.grey2,
    marginVertical: 5,
  },
  costSplit: {
    fontSize: 12,
    color: colors.grey2,
  },
});
