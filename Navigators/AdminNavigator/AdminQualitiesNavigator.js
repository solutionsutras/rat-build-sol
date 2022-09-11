import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Qualities from '../../Screens/Admin/ManageQualities/Qualities';
import ManageQualities from '../../Screens/Admin/ManageQualities/ManageQualities';


const Stack = createStackNavigator();

function AdminQualitiesStack() {
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
                name="ViewQualities"
                component={Qualities}
                options={{
                    title: "Qualities",
                }}
            />
            <Stack.Screen
                name="ManageQualities"
                component={ManageQualities}
                options={{
                    title: "Manage Qualities"
                }}
            />
        </Stack.Navigator>
    )
}

export default function AdminQualitiesNavigator() {
    return <AdminQualitiesStack />
}