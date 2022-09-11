import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import Checkout from '../Screens/Cart/Checkout/Checkout';
import Payment from '../Screens/Cart/Checkout/Payment';
import OrderReview from '../Screens/Cart/Checkout/OrderReview';
import PlaceOrder from '../Screens/Cart/Checkout/PlaceOrder';
import { colors } from '../assets/global/globalStyles';

const Stack = createStackNavigator();

function CheckoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.buttons,
          height: 50,
        },
        headerLeftContainerStyle: {
          height: 0,
          width:30,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'normal',
          height: 50,
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="Shipping"
        component={Checkout}
        options={{
          title: 'Shipping Details',
        }}
      />

      <Stack.Screen
        name="OrderReview"
        component={OrderReview}
        options={{
          title: 'Review and place order',
        }}
      />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
    </Stack.Navigator>
  );
}

export default function CheckoutNavigator() {
  return <CheckoutStack />;
}
