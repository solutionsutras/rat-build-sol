import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import ItemsContainer from '../Screens/Items/ItemsContainer';
import ItemDetails from '../Screens/Items/ItemDetails';
import SearchedItems from '../Screens/Items/SearchedItems';


const Stack = createStackNavigator();

function HomeStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Homescreen"
                component={ItemsContainer}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="Item Details"
                component={ItemDetails}
                options={{
                    headerShown:false,
                }}
            />
            <Stack.Screen
                name="Searched Items"
                component={SearchedItems}
                options={{
                    headerShown:false,
                }}
            />
        </Stack.Navigator>
    )
}

export default function HomeNavigator(){
    return <HomeStack/>
}