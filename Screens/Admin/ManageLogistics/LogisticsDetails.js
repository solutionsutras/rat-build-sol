import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { center, Box, Select, Icon } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import Input from '../../../Shared/Forms/Input';
import Error from '../../../Shared/Error';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../../assets/common/baseUrl';
import axios from 'axios';
import { controls } from '../../../assets/global/controls';

var { width } = Dimensions.get('window');

const LogisticsDetails = (props) => {
  const [logistics, setLogistics] = useState();
  const [selectValue, setSelectValue] = useState();
  const [regNo, setRegNo] = useState();
  const [brand, setBrand] = useState();
  const [model, setModel] = useState();
  const [capacityInFoot, setCapacityInFoot] = useState(0);
  const [capacityInCm, setCapacityInCm] = useState(0);
  const [capacityInTon, setCapacityInTon] = useState(0);
  const [farePerKm, setFarePerKm] = useState(0);
  const [fuelType, setFuelType] = useState();
  const [tollTax, setTollTax] = useState(0);

  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [vehicle, setVehicle] = useState(null);

  console.log(props.route.params.logistics);
  useEffect(() => {
    if (!props.route.params) {
      setLogistics(null);
    } else {
      setLogistics(props.route.params.logistics);
    }
    // AsyncStorage
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {
      setToken([]);
    };
  }, []);

  return (
    <>
      {logistics ? (
        <View style={styles.container}>
          <View style={styles.inLine}>
            <Text>Order No:</Text>
            <Text>{logistics.order._id}</Text>
          </View>

          {/* Trip Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>Trip Information</Text>
              <View style={styles.inLine}>
                <Text>Starting Point:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.fromLocationCode !== ''
                    ? logistics.orderItem.fromLocationCode
                    : 'Chandikhol, Jajpur, Odisha'}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Delivery Point:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.toLocationCode !== ''
                    ? logistics.orderItem.toLocationCode
                    : logistics.order.shippingAddress1}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Trip Distance:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.tripDistance} KM
                </Text>
              </View>
            </View>
          </View>

          {/* Order Item Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>Item Information</Text>

              <View style={styles.inLine}>
                <Text>Material:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.item.itemName}
                </Text>
                <Text> | Quality:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.item.quality.qualityName}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Quantity:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.orderItem.quantity}{' '}
                  {logistics.orderItem.unitName.split('(')[0]}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Rate:</Text>
                <Text style={styles.inLineValues}>
                  {controls.currency}
                  {logistics.orderItem.rate}/
                  {logistics.orderItem.unitName.split('(')[0]}
                </Text>
              </View>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>Booked Vehicle</Text>
              <View style={styles.inLine}>
                <Text>Vehicle No:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.vehicle.regNo}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Vehicle Type:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.vehicle.brand}-{logistics.vehicle.model}
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Capacity:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.vehicle.capacityInCm} cm /{' '}
                  {logistics.vehicle.capacityInFoot} foot /{' '}
                  {logistics.vehicle.capacityInTon} ton
                </Text>
              </View>
              <View style={styles.inLine}>
                <Text>Per KM Fare:</Text>
                <Text style={styles.inLineValues}>
                  {controls.currency}
                  {logistics.vehicle.farePerKm} / KM
                </Text>
                <Text> | Min Fare:</Text>
                <Text style={styles.inLineValues}>
                  {controls.currency}
                  {logistics.vehicle.minFare}
                </Text>
              </View>
              {logistics.vehicle.tollApplicable ? (
                <View style={styles.inLine}>
                  <Text>Toll Fee:</Text>
                  <Text style={styles.inLineValues}>
                    {controls.currency}
                    {logistics.vehicle.tollTax}
                  </Text>
                </View>
              ) : null}

              <View style={styles.inLine}>
                <Text>Load Unload Cost:</Text>
                <Text style={styles.inLineValues}>
                  {controls.currency}
                  {logistics.vehicle.loadUnloadCost}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>Driver Information</Text>

              <View style={styles.inLine}>
                <Text>Driver Name:</Text>
                <Text style={styles.inLineValues}>{logistics.driver.name}</Text>
              </View>
              <View style={styles.inLine}>
                <Text>Mobile No:</Text>
                <Text style={styles.inLineValues}>
                  {logistics.driver.phone}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <EasyButton
              large
              secondary
              onPress={() => props.navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back</Text>
            </EasyButton>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default LogisticsDetails;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  inLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  inLineValues: {
    fontStyle: 'italic',
    color: colors.grey2,
    marginLeft: 10,
  },
  groupContainer: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
    paddingBottom:2,
    marginBottom:5,
  },
  bordered: {
    borderColor: colors.grey4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    width: '90%',
    marginTop: 10,
    marginBottom: 5,
  },
  label1: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  select: {
    width: width,
    height: 48,
    backgroundColor: 'white',
    padding: 0,
    paddingLeft: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.buttons,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 80,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: 'solid',
    borderWidth: 8,
    padding: 0,
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: '#E0E0E0',
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  imagePicker: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: 'grey',
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});
