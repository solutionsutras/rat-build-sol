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

const TransactionDetails = (props) => {
  const [trn, setTrn] = useState();
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

  console.log('props.route.params.trn:', props.route.params.trn);
  useEffect(() => {
    if (!props.route.params) {
      setTrn(null);
    } else {
      setTrn(props.route.params.trn);
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
      {trn ? (
        <View style={styles.container}>
          {/* Trip Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>Transaction details</Text>

              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Transaction No:</Text>
                <Text style={styles.inLineRight}>{trn.transactionNo}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Transaction date:</Text>
                <Text style={styles.inLineRight}>{trn.transactionDate}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Transaction type:</Text>
                <Text style={styles.inLineRight}>{trn.transactionType}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Remarks:</Text>
                <Text style={styles.inLineRight}>{trn.remarks}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <EasyButton
              extralarge
              secondary
              onPress={() => props.navigation.goBack()}
            >
              <Icon
                mr="2"
                size="6"
                color="white"
                as={<MaterialIcons name="arrow-back" />}
              />
              <Text style={styles.buttonText}>Go Back</Text>
            </EasyButton>
            <EasyButton
              extralarge
              primary
              onPress={() => props.navigation.navigate('NewTransaction')}
            >
              <Icon
                mr="2"
                size="6"
                color="white"
                as={<MaterialIcons name="add" />}
              />
              <Text style={styles.buttonText}>New transaction</Text>
            </EasyButton>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default TransactionDetails;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  inLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  inLineRight: {
    maxWidth: width / 1.2,
    fontStyle: 'italic',
    color: colors.grey2,
    marginLeft: 5,
  },
  inLineLeft: {
    color: colors.grey1,
  },
  groupContainer: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
    paddingBottom: 2,
    marginBottom: 5,
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
