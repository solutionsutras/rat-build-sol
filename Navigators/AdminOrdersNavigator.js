import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Orders from '../Screens/Admin/ManageOrders/Orders';
import ManageOrders from '../Screens/Admin/ManageOrders/ManageOrders';

const Stack = createStackNavigator();

function AdminOrdersStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerTitleStyle: {
                fontSize: 18,
                position:'absolute',
                top:0,
            },
            headerStatusBarHeight:10,
            headerStyle: {
                backgroundColor: '#D1DCDE',
                height:48,
              },
        }}
        >
            <Stack.Screen
                name="ViewOrders"
                component={Orders}
                options={{
                    title: "Orders",
                }}
            />
            <Stack.Screen
                name="ManageOrders"
                component={ManageOrders}
                options={{
                    title: "Manage Orders"
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminOrdersNavigator() {
    return <AdminOrdersStack />
}