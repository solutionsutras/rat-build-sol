import React, { useContext, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { colors } from '../assets/global/globalStyles';

// import {Icon} from 'react-native-vector-icons/FontAwesome5';
import { Icon } from 'react-native-elements';
import CartIcon from '../Shared/CartIcon';
import AuthGlobal from '../Context/store/AuthGlobal';

// Stacks
import HomeNavigator from './HomeNavigator';
import CartNavigator from './CartNavigator';
import UserNavigator from './UserNavigator';
import OrdersNavigator from './OrdersNavigator';
// import AdminTopTabNavigator from './AdminNavigator/AdminTopTabNavigator';
import AdminMainNavigator from './AdminNavigator/AdminMainNavigator';

const Tab = createBottomTabNavigator();
// var userRoll = 'user';

const MainNavigator = () => {
  const context = useContext(AuthGlobal);
  const [userRoll, setUserRoll] = useState('');
// console.log(
//   'context.stateUser.user.userRoll: ',
//   context.stateUser.user.userRoll
// );
  useEffect(() => {
    if (context.stateUser.user.userRoll !== undefined) {
      setUserRoll(context.stateUser.user.userRoll.toLowerCase());
    }
    // console.log('userRoll', userRoll);
    return () => {
      setUserRoll('');
    };
  }, [context.stateUser.user]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        // tabBarShowLabel: false,
        tabBarActiveTintColor: colors.buttons,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="font-awesome" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={{ back: color }}>
              <Icon
                name="shopping-cart"
                type="font-awesome"
                color={color}
                size={size}
              />
              <CartIcon />
            </View>
          ),
        }}
      />

      {userRoll === 'admin' ? (
        <Tab.Screen
          name="Admin"
          // component={AdminTopTabNavigator}
          component={AdminMainNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="admin-panel-settings"
                type="material"
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'Admin Panel',
          }}
        />
      ) : null}

      <Tab.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="shopping-bag"
              type="material"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
