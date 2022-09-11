import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AdminItemsNavigator from './AdminItemsNavigator';
import AdminCategoriesNavigator from './AdminCategoriesNavigator';
import AdminOrdersNavigator from './AdminOrdersNavigator';
import AdminVehiclesNavigator from './AdminVehiclesNavigator';
import AdminQualitiesNavigator from './AdminQualitiesNavigator';
import AdminHome from '../../Screens/Admin/AdminHome';
import AdminOrderStatusNavigator from './AdminOrderStatusNavigator';
import AdminTransactionsNavigator from './AdminTransactionsNavigator';
import AdminLogisticsNavigator from './AdminLogisticsNavigator';
import AdminUsersNavigator from './AdminUsersNavigator';

// const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function AdminTabs() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ tabBarLabel: 'Admin Home' }}
      />
      <Stack.Screen
        name="ItemsTab"
        component={AdminItemsNavigator}
        options={{ tabBarLabel: 'Items' }}
      />
      <Stack.Screen
        name="CategoriesTab"
        component={AdminCategoriesNavigator}
        options={{ tabBarLabel: 'Categories' }}
      />
      <Stack.Screen
        name="OrdersTab"
        component={AdminOrdersNavigator}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Stack.Screen
        name="LogisticsTab"
        component={AdminLogisticsNavigator}
        options={{ tabBarLabel: 'Logistics' }}
      />
      <Stack.Screen
        name="QualitiesTab"
        component={AdminQualitiesNavigator}
        options={{ tabBarLabel: 'Qualities' }}
      />
      <Stack.Screen
        name="OrderStatusTab"
        component={AdminOrderStatusNavigator}
        options={{ tabBarLabel: 'Order Status' }}
      />
      <Stack.Screen
        name="VehiclesTab"
        component={AdminVehiclesNavigator}
        options={{ tabBarLabel: 'Vehicles' }}
      />
      <Stack.Screen
        name="TransactionsTab"
        component={AdminTransactionsNavigator}
        options={{ tabBarLabel: 'Transactions' }}
      />
      <Stack.Screen
        name="UsersTab"
        component={AdminUsersNavigator}
        options={{ tabBarLabel: 'Users' }}
      />
    </Stack.Navigator>
  );
}

export default function AdminMainNavigator() {
  return <AdminTabs />;
}
