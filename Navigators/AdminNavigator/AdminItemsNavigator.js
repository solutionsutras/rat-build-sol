import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Items from '../../Screens/Admin/ManageItems/Items';
import AddItem from '../../Screens/Admin/ManageItems/AddItem';
import EditItem from '../../Screens/Admin/ManageItems/EditItem';
import { colors } from '../../assets/global/globalStyles';

var { width } = Dimensions.get('window');
const Stack = createStackNavigator();

function AdminItemsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 16,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: '#D1DCDE',
          // backgroundColor:colors.buttons,
          height: 32,
        },
      }}
    >
      <Stack.Screen
        name="ViewItems"
        component={Items}
        options={{
          title: 'Manage Items',
        }}
      />

      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={{
          title: 'Add New Item',
        }}
      />

      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={{
          title: 'Edit Item',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminItemsNavigator() {
  return <AdminItemsStack />;
}
