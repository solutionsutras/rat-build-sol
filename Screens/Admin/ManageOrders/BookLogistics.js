import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import {
  Center,
  Heading,
  Select,
  Radio,
  CheckIcon,
  Stack,
  Spacer,
} from 'native-base';
import FormContainer from '../../../Shared/Forms/FormContainer';
import Input from '../../../Shared/Forms/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import baseUrl from '../../../assets/common/baseUrl';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const BookLogistics = () => {
  const [error, setError] = useState('');
  const [vehicle, setVehicle] = useState();
  const [vehicleData, setVehicleData] = useState([]);


useEffect(() => {
  // Get Vehicles from Database
  axios
    .get(`${baseUrl}vehicles`)
    .then((res) => setVehicleData(res.data))
    .catch((error) => alert('Error in loading Vehicles'));

  return () => {
    setVehicleData([]);
  };
}, []);

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={'Enter Logistics Details'}>
        <View>{error ? <Error message={error} /> : null}</View>
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
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

export default BookLogistics;

const styles = StyleSheet.create({
    
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
});
