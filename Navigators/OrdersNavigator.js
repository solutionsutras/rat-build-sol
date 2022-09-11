import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MyOrders from '../Screens/Orders/MyOrders';
import OrderDetails from '../Screens/Orders/OrderDetails';
import OrdersList from '../Screens/Orders/OrdersList';

const Stack = createStackNavigator();

function OrdersStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="MyOrders"
          component={MyOrders}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OrdersList"
          component={OrdersList}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
}

export default function OrdersNavigator(){
    return <OrdersStack/>
}