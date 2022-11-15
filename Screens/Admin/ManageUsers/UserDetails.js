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

const UserDetails = (props) => {
  const [user, setUser] = useState();
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

  console.log('props.route.params.user:', props.route.params.user);
  useEffect(() => {
    if (!props.route.params) {
      setUser(null);
    } else {
      setUser(props.route.params.user);
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
      {user ? (
        <View style={styles.container}>
          {/* Trip Information */}
          <View style={styles.groupContainer}>
            <View style={styles.bordered}>
              <Text style={styles.heading}>User details</Text>

              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Name:</Text>
                <Text style={styles.inLineRight}>{user.name}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Address:</Text>
                <Text style={styles.inLineRight}>{user.address}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>City:</Text>
                <Text style={styles.inLineRight}>{user.city}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>State:</Text>
                <Text style={styles.inLineRight}>{user.state}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>PIN:</Text>
                <Text style={styles.inLineRight}>{user.pin}</Text>
              </View>
              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Phone no:</Text>
                <Text style={styles.inLineRight}>{user.phone}</Text>
              </View>

              <View style={styles.inLine}>
                <Text style={styles.inLineLeft}>Email:</Text>
                <Text style={styles.inLineRight}>{user.email}</Text>
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

export default UserDetails;

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
    maxWidth: width / 1.3,
    fontStyle: 'italic',
    color: colors.grey2,
    marginLeft: 5,
  },
  inLineLeft: {
    width:70,
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
