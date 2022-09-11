import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, Button, } from 'react-native';
import { Icon, Center, VStack, Input, Box, Divider } from 'native-base';
import { Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ListItem from './ListItem';
import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
// import AdminTopTabNavigator from '../../../Navigators/AdminNavigator/AdminTopTabNavigator';
var { height, width } = Dimensions.get("window");

const ListHeader = () => {
    return (
        <View style={styles.listHeader}>
            <View style={styles.headerItem}></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Name</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Desc.</Text></View>
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Quality</Text></View>
            {/* <View style={styles.headerItem}><Text style={styles.listHeaderText}>Category</Text></View> */}
            <View style={styles.headerItem}><Text style={styles.listHeaderText}>Price/Unit (in {controls.currency})</Text></View>
        </View>
    )
}

const Items = (props) => {

    const [itemsList, setItemsList] = useState();
    const [itemFilter, setItemFilter] = useState();
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
                    .get(`${baseUrl}itemdetails`)
                    .then((res) => {
                        setItemsList(res.data);
                        setItemFilter(res.data);
                        setLoading(false);
                    })

                return () => {
                    setItemsList();
                    setItemFilter();
                    setLoading(true);

                }
            },
            [],
        )
    )

    const searchItem = (text) => {
        if (text == "") {
            setItemFilter(itemsList)
        }
        setItemFilter(
            itemsList.filter((i) => i.itemName.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const deleteItem = (id) => {
        axios
            .delete(`${baseUrl}itemdetails/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const items = itemFilter.filter((item) => item.id !== id)
                setItemFilter(items)
            })
            .catch((error) => console.log(error))
    }

    return (
        <View style={styles.container}>

                <Center>
                    <VStack my="0" mx="0" space={0} w="100%" maxW="100%"
                        divider={<Box px="2"> <Divider /></Box>}>
                        <VStack w="100%" space={0} >
                            <Input
                                placeholder="Search"
                                variant="filled"
                                width="100%"
                                py="1" px="2"
                                height={10}

                                InputLeftElement={
                                    <Icon
                                        ml="2" size="4"
                                        color="gray.500" as={<Ionicons name="ios-search"/>}
                                    />
                                }
                                InputRightElement={
                                    <Icon
                                        style={{ marginRight: 5, }}
                                        size={5}
                                        as={<Ionicons name="ios-close" />}
                                        onPress={() => {
                                            // onBlur;
                                        }}
                                    />
                                }
                                // onFocus={openList}
                                onChangeText={(text) => searchItem(text)}
                            />
                        </VStack>
                    </VStack>
                </Center>

            {loading
                ? (<View style={styles.spinner}><ActivityIndicator size="large" color="red" /></View>)
                : (
                    <FlatList
                        data={itemFilter}
                        ListHeaderComponent={ListHeader}
                        renderItem={({ item, index }) => (
                            <ListItem
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
                    onPress={() => props.navigation.navigate("AddItem")}
                >
                    <Icon mr="2" size="5" color="white" as={<MaterialIcons name="add-box" />} />
                    <Text style={styles.buttonText}>Add New Item</Text>
                </EasyButton>

                {/* <EasyButton secondary medium
                    onPress={() => props.navigation.navigate("CategoriesTab")}
                >
                    <Icon mr="0" size="5" color="white" as={<MaterialIcons name="category" />} />
                    <Text style={styles.buttonText}>Categories</Text>
                </EasyButton>
                
                <EasyButton secondary medium
                    onPress={() => props.navigation.navigate("OrdersTab")}
                >
                    <Icon mr="0" size="5" color="white" as={<MaterialIcons name="shopping-bag" />} />
                    <Text style={styles.buttonText}>Orders</Text>
                </EasyButton> */}

            </View>
            {/* <AdminTopTabNavigator/> */}
        </View>


    )
}


export default Items;

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
        justifyContent:'space-evenly',
        borderColor: colors.grey5,
        borderTopWidth:1,

    },
    buttonText: {
        marginLeft: 2,
        color: 'white',
    },
})