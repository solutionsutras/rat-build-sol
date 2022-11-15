import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';

import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import OrderCard from './OrderCard';

const Orders = (props) => {
  const [ordersList, setOrdersList] = useState();

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseUrl}orders`)
        .then((res) => {
          setOrdersList(res.data);
        })
        .catch((error) => console.log(error));
      return () => {
        setOrdersList();
      };
    }, [])
  );

  const getOrders = () => {};
  return (
    <View>
      <FlatList
        data={ordersList}
        renderItem={({ item, index }) => (
          <OrderCard
            {...item}
            navigation={props.navigation}
            index={index}
            editMode={true}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Orders;
