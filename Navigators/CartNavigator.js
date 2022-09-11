import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Cart from '../Screens/Cart/Cart';
// import Checkout from '../Screens/Cart/Checkout/Checkout';
import CheckoutNavigator from './CheckoutNavigator';


const Stack = createStackNavigator();

function CartStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Cart Screen"
          component={Cart}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
}

export default function CartNavigator(){
    return <CartStack/>
}