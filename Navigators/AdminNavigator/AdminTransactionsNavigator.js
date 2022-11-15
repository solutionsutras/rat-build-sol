import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Transactions from '../../Screens/Admin/ManageTransactions/Transactions';
import TransactionDetails from '../../Screens/Admin/ManageTransactions/TransactionDetails';
import NewTransaction from '../../Screens/Admin/ManageTransactions/NewTransaction';

const Stack = createStackNavigator();

function AdminTransactionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          position: 'absolute',
          top: 0,
        },
        headerStatusBarHeight: 10,
        headerStyle: {
          backgroundColor: '#D1DCDE',
          height: 48,
        },
      }}
    >
      <Stack.Screen
        name="ViewTransactions"
        component={Transactions}
        options={{
          title: 'Transactions',
        }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        options={{
          title: 'Transactions',
        }}
      />
      <Stack.Screen
        name="NewTransaction"
        component={NewTransaction}
        options={{
          title: 'New transaction',
        }}
      />
    </Stack.Navigator>
  );
}

export default function AdminTransactionsNavigator() {
  return <AdminTransactionsStack />;
}
