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

const ListTransactions = (props) => {
  console.log('props: ', props);
  const [modalVisible, setModalVisible] = useState(false);
  const [trn, setTrn] = useState(props);

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
        onPress={() => props.navigation.navigate('TransactionDetails', { trn: props })}
      >
        <Text style={[styles.item, { width: width / 10 }]}>{trn.index + 1}</Text>
        <Text style={[styles.item, { width: width / 6 }]}>
          {trn.transactionNo}
        </Text>
        <Text style={[styles.item, { width: width / 6 }]}>
          {trn.transactionDate}
        </Text>
        <Text style={styles.item}>{trn.amount}</Text>
        <Text style={styles.item}>{trn.transactionType}</Text>
        <Text style={styles.item}>{trn.remarks}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListTransactions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
    width: width + 100,
    alignItems: 'center',
  },
  image: {
    borderRadius: 15,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    fontSize: 12,
    flexWrap: 'wrap',
    margin: 3,
    width: width / 7,
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
  image: {
    borderRadius: 15,
    width: width / 6,
    height: 20,
    margin: 2,
  },
});
