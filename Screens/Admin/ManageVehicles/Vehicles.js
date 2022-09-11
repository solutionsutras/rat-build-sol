import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, Button, } from 'react-native';
import { Icon, Center, VStack, Input, Box, Divider } from 'native-base';
import { Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ListVehicles from './ListVehicles';
import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
var { height, width } = Dimensions.get("window");

const ListHeader = () => {
    return (
        <View style={styles.listHeader}>
            {/* <View style={styles.headerItem}></View> */}
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Reg. Number</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Brand</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Model</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Capacity</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Fare/KM</Text></View>
        </View>
    )
}

const Vehicles = (props) => {
    const [vehiclesList, setVehiclesList] = useState();
    const [vehiclesFilter, setVehiclesFilter] = useState();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();

    useFocusEffect(
        useCallback(
            () => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))

                axios
                    .get(`${baseUrl}vehicles`)
                    .then((res) => {
                        setVehiclesList(res.data);
                        setVehiclesFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setVehiclesList();
                    setVehiclesFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const deleteItem = (id) => {
        axios
            .delete(`${baseUrl}vehicles/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const vehicles = vehiclesFilter.filter((item) => item.id !== id)
                setVehiclesFilter(vehicles)
            })
            .catch((error) => console.log(error))
    }

    return (
        <View style={styles.container}>

            {loading
                ? (<View style={styles.spinner}><ActivityIndicator size="large" color="red" /></View>)
                : (
                    <FlatList
                        data={vehiclesFilter}
                        ListHeaderComponent={ListHeader}
                        renderItem={({ item, index }) => (
                            <ListVehicles
                                {...item}
                                navigation={props.navigation}
                                index={index}
                                delete={deleteItem}
                            />
                        )}
                        key={(item) => item.id}
                        keyExtractor={(item) => item.id}
                    />
                )}

            <View style={styles.buttonContainer}>
                <EasyButton secondary extralarge
                    onPress={() => props.navigation.navigate("ManageVehicles")}
                >
                    <Icon mr="2" size="5" color="white" as={<MaterialIcons name="add-box" />} />
                    <Text style={styles.buttonText}>Add New Vehicle</Text>
                </EasyButton>
            </View>
        </View>
    )
}

export default Vehicles;

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: colors.grey2,
        elevation: 1,
    },
    listHeaderText: {
        color: colors.cardBackground,
        fontWeight: 'bold',
    },
    headerItem: {
        margin: 3,
        width: width / 6,
    },
    spinner: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        marginBottom: 90,
        backgroundColor: 'white',
    },
    buttonContainer: {
        width: width,
        margin: 0,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        justifyContent: 'space-evenly',
        borderColor: colors.grey5,
        borderTopWidth: 1,

    },
    buttonText: {
        marginLeft: 2,
        color: 'white',
    },
})