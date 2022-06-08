import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { colors } from '../assets/global/globalStyles';

// import {Icon} from 'react-native-vector-icons/FontAwesome5';
import { Icon } from 'react-native-elements';
import CartIcon from '../Shared/CartIcon';
import AuthGlobal from '../Context/store/AuthGlobal';


// Stacks
import HomeNavigator from './HomeNavigator';
import CartNavigator from './CartNavigator';
import UserNavigator from './UserNavigator';
import AdminTopTabNavigator from './AdminTopTabNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

    const context = useContext(AuthGlobal);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.buttons,
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="home"
                            type="font-awesome"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="Cart"
                component={CartNavigator}
                options={{
                    tabBarLabel: "Cart",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ back: color }}>
                            <Icon
                                name="shopping-cart"
                                type="font-awesome"
                                color={color}
                                size={size}
                            />
                            <CartIcon />
                        </View>
                    )
                }}
            />

            {context.stateUser.user.isAdmin == true ? (
                <Tab.Screen
                    name="Admin"
                    // component={AdminNavigator}
                    component={AdminTopTabNavigator}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Icon
                                name="cog"
                                type="font-awesome"
                                color={color}
                                size={size}
                            />
                        )
                    }}
                />

            ) : (null)}

            <Tab.Screen
                name="User"
                component={UserNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="user"
                            type="font-awesome"
                            color={color}
                            size={size}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}


export default MainNavigator;