import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Button,
} from 'react-native';
import { Icon, Center, VStack, Input, Box, Divider } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
// import AdminTopTabNavigator from '../../../Navigators/AdminNavigator/AdminTopTabNavigator';
var { height, width } = Dimensions.get('window');

const AdminHome = (props) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [itemsCount, setItemsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [tripsCount, setTripsCount] = useState(0);
  const [config, setConfig] = useState();

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
    setConfig({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return () => {
      setConfig();
    };
  }, [token]);

  useEffect(() => {
    // Items Count
    axios
      .get(`${baseUrl}itemdetails/get/count`, config)
      .then((res) => setItemsCount(res.data.itemsCount))
      .catch((error) => console.log('Error in loading item count: ', error));

    // Orders Count
    axios
      .get(`${baseUrl}orders/get/count`, config)
      .then((res) => setOrdersCount(res.data.ordersCount))
      .catch((error) => console.log('Error in loading orders count: ', error));

    // Vehicles Count
    axios
      .get(`${baseUrl}vehicles/get/count`, config)
      .then((res) => setVehiclesCount(res.data.vehiclesCount))
      .catch((error) =>
        console.log('Error in loading vehicles count: ', error)
      );

    // Transactions Count
    axios
      .get(`${baseUrl}transactions/get/count`, config)
      .then((res) => setTransactionsCount(res.data.transactionsCount))
      .catch((error) => console.log('Error in loading transactions count'));

    // Trips Count
    axios
      .get(`${baseUrl}logistics/get/count`, config)
      .then((res) => setTripsCount(res.data.logisticsCount))
      .catch((error) => console.log('Error in loading logistics count'));

    // Users Count
    axios
      .get(`${baseUrl}users/get/count`, config)
      .then((res) => setUsersCount(res.data.usersCount))
      .catch((error) => console.log('Error in loading users count: ', error));

    return () => {
      setToken();
      setItemsCount(0);
      setOrdersCount(0);
      setVehiclesCount(0);
      setTransactionsCount(0);
      setTripsCount(0);
      setUsersCount(0);
    };
  }, [config]);

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <View style={{ backgroundColor: colors.cardBackground }}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Items: </Text>
            <Text style={styles.counterText}>{itemsCount} </Text>
          </View>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Orders: </Text>
            <Text style={styles.counterText}>{ordersCount} </Text>
          </View>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Vehicles: </Text>
            <Text style={styles.counterText}>{vehiclesCount} </Text>
          </View>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Users: </Text>
            <Text style={styles.counterText}>{usersCount} </Text>
          </View>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Transactions: </Text>
            <Text style={styles.counterText}>{transactionsCount} </Text>
          </View>
          <View style={styles.totalView}>
            <Text style={styles.totalViewText}>Total No of Trips: </Text>
            <Text style={styles.counterText}>{tripsCount} </Text>
          </View>
        </View>

        <View style={styles.buttonsBox}>
          <View style={styles.buttonsContainer}>
            <View></View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('ItemsTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialIcons name="assessment" />}
                />
                <Text style={styles.buttonText}>Items</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('OrdersTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialIcons name="badge" />}
                />
                <Text style={styles.buttonText}>Orders</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('VehiclesTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialIcons name="commute" />}
                />
                <Text style={styles.buttonText}>Vehicles</Text>
              </EasyButton>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('LogisticsTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<FontAwesome5 name="truck-moving" />}
                />
                <Text style={styles.buttonText}>Logistics</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('UsersTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialIcons name="group" />}
                />
                <Text style={styles.buttonText}>Users</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('TransactionsTab')}
              >
                <Icon
                  mr="2"
                  size="7"
                  color="white"
                  as={<MaterialCommunityIcons name="bank-transfer" />}
                />
                <Text style={styles.buttonText}>Transactions</Text>
              </EasyButton>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('CategoriesTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialIcons name="category" />}
                />
                <Text style={styles.buttonText}>Categories</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('QualitiesTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={<MaterialCommunityIcons name="police-badge" />}
                />
                <Text style={styles.buttonText}>Qualities</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              <EasyButton
                large
                secondary
                onPress={() => props.navigation.navigate('OrderStatusTab')}
              >
                <Icon
                  mr="2"
                  size="6"
                  color="white"
                  as={
                    <MaterialCommunityIcons name="order-bool-ascending-variant" />
                  }
                />
                <Text style={styles.buttonText}>Order Status</Text>
              </EasyButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 90,
    minHeight: height + 400,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  boxContainer: {
    margin: 5,
    marginTop: 0,
    padding: 10,
    borderColor: colors.grey3,
    borderWidth: 1,
  },
  titleView: {
    marginTop: 1,
    padding: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.grey3,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    color: colors.grey2,
    textAlign: 'center',
  },
  totalView: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  totalViewText: {
    fontSize: 16,
  },
  counterText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.grey2,
  },
  buttonsBox: {
    margin: 5,
  },
  buttonsContainer: {
    marginTop: 0,
    flexDirection: 'row',
    position: 'relative',
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
