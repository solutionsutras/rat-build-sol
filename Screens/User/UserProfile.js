import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Center, Icon } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import AuthGlobal from '../../Context/store/AuthGlobal';
import { logoutUser } from '../../Context/actions/Auth.actions';
import { colors } from '../../assets/global/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
// import { useEffect } from 'react/cjs/react.development';
const { height, width } = Dimensions.get('window');
var frm = '';

const UserProfile = (props) => {
  if (
    props.route.params.fromNav !== '' ||
    props.route.params.fromNav !== null
  ) {
    frm = props.route.params.fromNav;
  }

  const [count, setCount] = React.useState(0);
  const context = useContext(AuthGlobal);
  const [profile, setProfile] = useState();
  //   const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate('Login');
      } else {
        AsyncStorage.getItem('jwt')
          .then((res) => {
            // const config = { headers: { Authorization: `Bearer ${token}` } };
            axios
              .get(`${baseUrl}users/${context.stateUser.user.userId}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((user) => {
                setProfile(user.data);

                // console.log('Profile: ', profile);
              });
          })
          .catch((error) => console.log(error));

        // axios
        //   .get(`${baseUrl}orders`)
        //   .then((res) => {
        //     const data = res.data;
        //     const myOrders = data.filter(
        //       (ord) => ord.user._id === context.stateUser.user.userId
        //     );
        //     setOrders(myOrders);
        //   })
        //   .catch((error) => console.log(error));
      }
      return () => {
        setProfile();
        // setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <Center style={styles.container}>
      <ScrollView>
        {profile ? (
          <View style={styles.contentContainer}>
            {profile.name ? (
              <View style={styles.userDetails}>
                <Text style={styles.title}>Name: </Text>
                <Text style={styles.value}>{profile.name}</Text>
              </View>
            ) : null}

            {profile.address ? (
              <View style={styles.userDetails}>
                <Text style={styles.title}>Address: </Text>
                <Text style={styles.value}>{profile.address}</Text>
              </View>
            ) : null}

            {profile.city ? (
              <View style={styles.userDetails}>
                <Text style={styles.title}>City: </Text>
                <Text style={styles.value}>{profile.city}</Text>
              </View>
            ) : null}

            {profile.state ? (
              <View style={styles.userDetails}>
                <Text style={styles.title}>State: </Text>
                <Text style={styles.value}>{profile.state}</Text>
              </View>
            ) : null}

            {profile.pin ? (
              <View style={styles.userDetails}>
                <Text style={styles.title}>PIN: </Text>
                <Text style={styles.value}>{profile.pin}</Text>
              </View>
            ) : null}

            <View style={styles.userDetails}>
              <Text style={styles.title}>Email: </Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.title}>Phone: </Text>
              <Text style={styles.value}>{profile.phone}</Text>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
              }}
              onPress={() => {props.navigation.navigate('EditProfile')}}
            >
              <Icon
                mr="1"
                size="4"
                color={colors.buttons}
                as={<MaterialIcons name="edit" />}
              />
              <Text
                style={{
                  color: colors.buttons,
                  textDecorationLine: 'underline',
                }}
              >
                Edit profile
              </Text>
            </TouchableOpacity>

            <View style={[styles.userDetails, { marginTop: 30 }]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => props.navigation.navigate('Orders')}
              >
                <Text style={styles.actionText}>My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => [
                  AsyncStorage.removeItem('jwt'),
                  logoutUser(context.dispatch),
                ]}
              >
                <Text style={styles.actionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Center>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  contentContainer: {
    alignSelf: 'center',
    margin: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.grey5,
    borderColor: colors.grey2,
    borderWidth: 0.5,
    width: width - 30,
  },
  order: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 60,
  },
  userDetails: {
    // height: width / 2,
    // backgroundColor: colors.grey5,
    // padding: 20,
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    color: colors.grey1,
    fontWeight: '700',
  },
  value: {
    color: colors.grey1,
    fontStyle: 'italic',
    marginLeft: 5,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: colors.buttons,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  actionText: {
    color: colors.cardBackground,
    textTransform: 'uppercase',
  },
});
