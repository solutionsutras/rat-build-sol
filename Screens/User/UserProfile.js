import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import { Center } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import baseUrl from '../../assets/common/baseUrl';

import AuthGlobal from '../../Context/store/AuthGlobal';
import { logoutUser } from '../../Context/actions/Auth.actions';
import OrderCard from '../../Shared/OrderCard';
import { colors } from '../../assets/global/globalStyles';
// import { useEffect } from 'react/cjs/react.development';
const { height, width } = Dimensions.get("window");
var frm = "";

const UserProfile = (props) => {
    
    if(props.route.params.fromNav !== "" || props.route.params.fromNav !== null){
        frm = props.route.params.fromNav;
    }

    const [count, setCount] = React.useState(0);
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState()
    const [orders, setOrders] = useState([]);

    // console.log(context.stateUser.user)
    // React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //       headerLeft: () => (
    //         <Button onPress={() => setCount(c => c + 1)} title="Update count" />
    //       ),
    //     });
    //   }, [props.navigation]);

    useFocusEffect((
        useCallback(() => {
            if (context.stateUser.isAuthenticated === false || context.stateUser.isAuthenticated === null) {
                props.navigation.navigate("Login")
            }
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseUrl}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))

            axios
                .get(`${baseUrl}orders`)
                .then((res) => {
                    const data = res.data;
                    const myOrders = data.filter(
                        (ord) => ord.user._id === context.stateUser.user.userId
                    );
                    setOrders(myOrders);
                })
                .catch((error) => console.log(error))

            return () => {
                setUserProfile();
                setOrders();
            }
        }, [context.stateUser.isAuthenticated])
    ))

    return (
        <Center style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={{ height: width / 2, width: width, backgroundColor: colors.buttons }}>
                    <Text style={{ fontSize: 30 }}>{userProfile ? userProfile.name : ""}</Text>
                    <View style={{ marginTop: 20, }}>
                        <Text style={{ margin: 10, }}>Email: {userProfile ? userProfile.email : ""}</Text>
                        <Text style={{ margin: 10, }}>Phone: {userProfile ? userProfile.phone : ""}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 80, }}>
                    <Button
                        title={"Sign out"}
                        onPress={() => [
                            AsyncStorage.removeItem("jwt"),
                            logoutUser(context.dispatch)
                        ]}
                    />
                </View>
            </ScrollView>
        </Center>
    )
}


export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    order: {
        marginTop: 20,
        alignItems: 'center',
        marginBottom: 60,
    }
})