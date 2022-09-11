import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Logistics from '../../Screens/Admin/ManageLogistics/Logistics';

const Stack = createStackNavigator();

function AdminLogisticsStack() {
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
        name="ViewLogistics"
        component={Logistics}
        options={{
          title: 'Logistics',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminLogisticsNavigator() {
  return <AdminLogisticsStack />;
}
