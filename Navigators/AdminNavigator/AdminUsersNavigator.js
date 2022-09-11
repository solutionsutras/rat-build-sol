import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Users from '../../Screens/Admin/ManageUsers/Users';

const Stack = createStackNavigator();

function AdminUsersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          position: 'absolute',
          top: 0,
        },
        headerStatusBarHeight: 10,
        headerStyle: {
          backgroundColor: '#D1DCDE',
          height: 48,
        },
      }}
    >
      <Stack.Screen
        name="ViewUsers"
        component={Users}
        options={{
          title: 'Users',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminUsersNavigator() {
  return <AdminUsersStack />;
}
