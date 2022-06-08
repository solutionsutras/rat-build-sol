import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Categories from '../Screens/Admin/ManageCategories/Categories';
import ManageCategories from '../Screens/Admin/ManageCategories/ManageCategories';


const Stack = createStackNavigator();

function AdminCategoriesStack() {
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
                name="ViewCategories"
                component={Categories}
                options={{
                    title: "Categories",
                }}
            />
            <Stack.Screen
                name="ManageCategories"
                component={ManageCategories}
                options={{
                    title: "Manage Categories"
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminCategoriesNavigator() {
    return <AdminCategoriesStack />
}