import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// import Items from '../Screens/Admin/ManageItems/Items';
// import Categories from '../Screens/Admin/ManageCategories/Categories';
// import Orders from '../Screens/Admin/ManageOrders/Orders';

import AdminItemsNavigator from './AdminItemsNavigator';
import AdminCategoriesNavigator from './AdminCategoriesNavigator';
import AdminOrdersNavigator from './AdminOrdersNavigator';
import AdminVehiclesNavigator from './AdminVehiclesNavigator';
import AdminQualitiesNavigator from './AdminQualitiesNavigator';


const Tab = createMaterialTopTabNavigator();

function AdminTabs() {
    return(
        <Tab.Navigator>
            <Tab.Screen
                name="ItemsTab"
                component={AdminItemsNavigator}
                options={{ tabBarLabel: 'Items' }}
            />
            {/* <Tab.Screen
                name="CategoriesTab"
                component={AdminCategoriesNavigator}
                options={{ tabBarLabel: 'Categories' }}
            /> */}
            <Tab.Screen
                name="OrdersTab"
                component={AdminOrdersNavigator}
                options={{ tabBarLabel: 'Orders' }}
            />
            <Tab.Screen
                name="LogisticsTab"
                component={AdminVehiclesNavigator}
                options={{ tabBarLabel: 'Vehicles' }}
            />
            {/* <Tab.Screen
                name="QualitiesTab"
                component={AdminQualitiesNavigator}
                options={{ tabBarLabel: 'Qualities' }}
            /> */}
        </Tab.Navigator>
    )
}

export default function AdminTopTabNavigator(){
    return <AdminTabs/>
}