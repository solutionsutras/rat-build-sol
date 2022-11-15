import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Button,
  Modal,
} from 'react-native';
import { Icon, Heading, VStack, Input, Box, Divider } from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { controls } from '../../../assets/global/controls';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

var { width } = Dimensions.get('window');

const ListLogistics = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              props.index % 2 == 0 ? colors.cardBackground : colors.grey5,
          },
        ]}
        onPress={() =>
          props.navigation.navigate('LogisticsDetails', { logistics: props })
        }
      >
        <Text style={styles.item}>
          {props.vehicle.regNo} ({props.vehicle.brand}-{props.vehicle.model})
        </Text>
        <Text style={styles.item}>{props.order._id}</Text>
        <Text style={styles.item}>
          {props.orderItem.item.itemName} (quality-
          {props.orderItem.item.quality.qualityName})
        </Text>
        <Text style={styles.item}>
          {props.driver.name} (Mob-{props.driver.phone.split('-')[1]})
        </Text>
        <Text style={styles.item}>
          {/* {Date(props.dateOfBooking)} */}
          {Date(props.dateOfBooking).split(' ')[2] +
            '-' +
            Date(props.dateOfBooking).split(' ')[1] +
            '-' +
            Date(props.dateOfBooking).split(' ')[3] +
            ' ' +
            Date(props.dateOfBooking).split(' ')[4]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListLogistics;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    width: width + 100,
  },
  image: {
    borderRadius: 15,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    fontSize:12,
    flexWrap: 'wrap',
    margin: 3,
    width: width / 6,
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
