import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OrderStatus from '../../Screens/Admin/ManageOrderStatus/OrderStatus';

const Stack = createStackNavigator();

function AdminOrderStatusStack() {
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
        name="ViewOrderStatus"
        component={OrderStatus}
        options={{
          title: 'Order Status',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminOrderStatusNavigator() {
  return <AdminOrderStatusStack />;
}
