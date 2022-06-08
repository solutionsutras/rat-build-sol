import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList} from 'react-native';

import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import OrderCard from '../../../Shared/OrderCard';


const Orders = (props) =>{

    const [ordersList, setOrdersList] = useState();

    useFocusEffect(
        useCallback(
          () => {
            getOrders();
            return () => {
                setOrdersList();
            }
          },[],
        )
        
    )

    const getOrders = () =>{
        axios
            .get(`${baseUrl}orders`)
            .then((res) => {
                setOrdersList(res.data);
            })
            .catch((error) => console.log(error))
    }
    return(
        <View>
            <FlatList
                data={ordersList}
                renderItem={({item}) => (
                    <OrderCard navigation={props.navigation} {...item} editMode={true} />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default Orders;