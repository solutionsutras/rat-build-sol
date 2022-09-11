import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Vehicles from '../../Screens/Admin/ManageVehicles/Vehicles';
import ManageVehicles from '../../Screens/Admin/ManageVehicles/ManageVehicles';

const Stack = createStackNavigator();

function AdminVehiclesStack() {
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
                name="ViewVehicles"
                component={Vehicles}
                options={{
                    title: "Vehicles",
                }}
            />
            <Stack.Screen
                name="ManageVehicles"
                component={ManageVehicles}
                options={{
                    title: "Manage Vehicles"
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminVehiclesNavigator() {
    return <AdminVehiclesStack />
}