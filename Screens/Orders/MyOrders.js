import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { Center } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import AuthGlobal from '../../Context/store/AuthGlobal';
import { logoutUser } from '../../Context/actions/Auth.actions';
import OrderCard from '../../Shared/OrderCard';
// import { useEffect } from 'react/cjs/react.development';

const MyOrders = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState([]);

  // console.log(context.stateUser.user)

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate('Login');
      }
      AsyncStorage.getItem('jwt')
        .then((res) => {
          axios
            .get(`${baseUrl}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseUrl}orders`)
        .then((res) => {
          const data = res.data;
          const myOrders = data.filter(
            (ord) => ord.user._id === context.stateUser.user.userId
          );
          setOrders(myOrders);
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
        setOrders([]);
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <Center style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ fontSize: 20 }}>
          {userProfile ? userProfile.name : ''}
        </Text>
        <View style={{ marginTop: 5 }}>
          <Text style={{}}>
            {userProfile ? 'Email: ' + userProfile.email : ''}
          </Text>
          <Text style={{}}>Phone: {userProfile ? userProfile.phone : ''}</Text>
        </View>
        {/* <View style={{ marginTop: 80 }}>
          <Button
            title={'Sign out'}
            onPress={() => [
              AsyncStorage.removeItem('jwt'),
              logoutUser(context.dispatch),
            ]}
          />
        </View> */}
        <View style={styles.order}>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
          <View>
            {orders.length > 0 ? (
              orders.map((o, index) => {
                return (
                  <View>
                    <View style={styles.orderCard}>
                      <OrderCard
                        key={index}
                        {...o}
                        editMode={false}
                        navigation={props.navigation}
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.order}>
                <Text style={{ color: 'red', fontSize: 16 }}>
                  You have no orders
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Center>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  order: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 60,
  },
  orderCard: {
    marginTop: 5,
    alignItems: 'center',
  },
});
