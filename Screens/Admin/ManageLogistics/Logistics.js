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
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ListLogistics from './ListLogistics';
import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
var { height, width } = Dimensions.get('window');

const ListHeader = () => {
  return (
    <View style={styles.listHeader}>
      {/* <View style={styles.headerItem}></View> */}
      <View style={styles.headerItem}>
        <Text style={styles.listHeaderText}>Vehicle</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.listHeaderText}>Order No</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.listHeaderText}>Item</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.listHeaderText}>Driver</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.listHeaderText}>Date of Booking</Text>
      </View>
    </View>
  );
};
const Logistics = (props) => {
  const [logisticsList, setLogisticsList] = useState();
  const [logisticsFilter, setLogisticsFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseUrl}logistics`)
      .then((res) => {
        setLogisticsList(res.data);
        setLogisticsFilter(res.data);
        setLoading(false);
      })
      .catch((error) => console.log('Error in loading logistics records'));

    return () => {
      setLogisticsList();
      setLogisticsFilter();
      setLoading(true);
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={logisticsFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListLogistics
              {...item}
              navigation={props.navigation}
              index={index}
            />
          )}
          key={(item) => item.id}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* <View style={styles.buttonContainer}>
        <EasyButton
          secondary
          extralarge
          // onPress={() => props.navigation.navigate('Managelogistics')}
        >
          <Icon
            mr="2"
            size="5"
            color="white"
            as={<MaterialIcons name="add-box" />}
          />
          <Text style={styles.buttonText}>Add New Vehicle</Text>
        </EasyButton>
      </View> */}
    </View>
  );
};

export default Logistics;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.grey2,
    elevation: 1,
  },
  listHeaderText: {
    color: colors.cardBackground,
    fontWeight: 'bold',
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 90,
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: width,
    margin: 0,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    justifyContent: 'space-evenly',
    borderColor: colors.grey5,
    borderTopWidth: 1,
  },
  buttonText: {
    marginLeft: 2,
    color: 'white',
  },
});
