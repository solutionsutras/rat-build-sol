import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../Screens/User/Login';
import Register from '../Screens/User/Register';
import UserProfile from '../Screens/User/UserProfile';
import { colors } from '../assets/global/globalStyles';
import { StyleSheet, Button } from 'react-native';
import OtpLogin from '../Screens/User/OtpLogin';
import EditProfile from '../Screens/User/EditProfile';
import ResetPassword from '../Screens/User/ResetPassword';

const Stack = createStackNavigator();

function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.buttons,
          height: 40,
        },
        headerLeft: false,
        headerTintColor: 'white',
        headerTitleStyle: styles.headerText,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        // initialParams={{ fromNav: '' }}
        options={{
          title: 'Login using Password',
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        initialParams={{ fromNav: '' }}
        options={{
          title: 'New User Registration',
        }}
      />
      <Stack.Screen
        name="User Profile"
        component={UserProfile}
        initialParams={{ fromNav: '' }}
        options={{
          title: 'My Profile',
        }}
      />
      <Stack.Screen
        name="OtpLogin"
        component={OtpLogin}
        initialParams={{ fromNav: '' }}
        options={{
          title: 'Login Using OTP',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{ fromNav: '' }}
        options={{
          title: 'Edit profile',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return <UserStack />;
}

const styles = StyleSheet.create({
  headerText: {
    position: 'absolute',
    top: -30,
  },
});
