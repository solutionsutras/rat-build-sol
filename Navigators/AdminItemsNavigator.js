import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Items from '../Screens/Admin/ManageItems/Items';
import ManageItems from '../Screens/Admin/ManageItems/ManageItems';

const Stack = createStackNavigator();

function AdminItemsStack() {
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
                name="ViewItems"
                component={Items}
                options={{
                    title: "Items",
                }}
            />
            <Stack.Screen
                name="ManageItems"
                component={ManageItems}
                options={{
                    title: "Manage Items"
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminItemsNavigator() {
    return <AdminItemsStack />
}