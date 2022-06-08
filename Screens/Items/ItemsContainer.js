import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Dimensions, ScrollView } from 'react-native';
import { Content, Container, VStack, Input, Button, IconButton, Icon, Text, NativeBaseProvider, Center, Box, Divider, Heading } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

import baseUrl from '../../assets/common/baseUrl';
import axios from 'axios';
import { colors } from '../../assets/global/globalStyles';

import ItemsList from './ItemsList';
import SearchedItems from './SearchedItems';
import Banner from '../../Shared/Banner';
import CategoryFilter from './CategoryFilter';

const { height } = Dimensions.get('window');
// const data = require('../../assets/data/itemdetails.json')
// const categoriesData = require('../../assets/data/categories.json')
const ItemsContainer = (props) => {

    const [items, setItems] = useState([])
    const [itemsFiltered, setItemsFiltered] = useState([])
    const [focus, setFocus] = useState()
    const [categories, setCategories] = useState([])
    const [itemsCateg, setItemsCateg] = useState([])
    const [active, setActive] = useState()
    const [initialState, setInitialState] = useState([])
    const [loading, setLoading] = useState(true)

    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);

                // Items
                axios
                    .get(`${baseUrl}itemdetails`)
                    .then((res) => {
                        setItems(res.data);
                        setItemsFiltered(res.data);
                        setItemsCateg(res.data);
                        setInitialState(res.data);
                        setLoading(false);
                    })

                // Categories
                axios
                    .get(`${baseUrl}categories`)
                    .then((res) => {
                        setCategories(res.data);
                    }).catch((error) => {
                        console.log('Api call error: ' + error)
                    })

                return () => {
                    setItems([]);
                    setItemsFiltered([]);
                    setFocus();
                    setCategories([]);
                    setActive();
                    setInitialState([]);
                }
            },
            [],
        )
    ))


    const searchItem = (text) => {
        setItemsFiltered(
            items.filter((i) => i.itemName.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false);
    }

    // Categories
    const changeCateg = (categ) => {
        {
            categ === 'all'
                ? [setItemsCateg(initialState), setActive(true)]
                : [
                    setItemsCateg(
                        items.filter((i) => i.itemCategory._id === categ),
                        setActive(true)
                    )
                ]
        }
    }

    return (
        <>
            {loading == false ? (
                <View style={{backgroundColor:colors.grey4}}>
                    <VStack my="2" mx="2" space={5} w="100%" maxW="95%"
                        divider={<Box px="2"> <Divider /></Box>}>
                        <VStack w="100%" space={0} alignSelf="center" alignItems='center' justifyContent='center'>
                            <Input
                                placeholder="Search"
                                variant="filled"
                                width="100%"
                                borderRadius="5"
                                py="1" px="2" borderWidth="0"
                                InputLeftElement={
                                    <Icon
                                        ml="2" size="4"
                                        color="gray.400" as={<Ionicons name="ios-search" />}
                                    />
                                }


                                InputRightElement={
                                    <Icon
                                        style={{ marginRight: 5, }}
                                        size={6}
                                        as={<Ionicons name="ios-close" />}
                                        onPress={() => {
                                            onBlur;
                                        }}
                                    />
                                }


                                onFocus={openList}
                                onChangeText={(text) => searchItem(text)}
                            />
                        </VStack>
                    </VStack>

                    {focus == true ? (
                        <View>
                            <SearchedItems
                                navigation={props.navigation}
                                itemsFiltered={itemsFiltered}
                            />
                        </View>
                    ) : (
                        <ScrollView>
                            <View style={styles.container}>

                                <View style={{ flexDirection: 'row', }}><Banner /></View>

                                <View style={{ flexDirection: 'row', margin: 5, }}>
                                    <CategoryFilter
                                        categories={categories}
                                        categoryFilter={changeCateg}
                                        itemsCateg={itemsCateg}
                                        active={active}
                                        setActive={setActive}
                                    />
                                </View>

                                {itemsCateg.length > 0 ? (

                                    <View style={styles.listContainer}>
                                        {itemsCateg.map((item) => {
                                            return (
                                                <ItemsList
                                                    navigation={props.navigation}
                                                    key={item._id}
                                                    item={item}
                                                    style={{ width: '100%', flex: 1, }}
                                                />
                                            )
                                        })}
                                    </View>
                                ) : (
                                    <View style={[styles.center, { height: height / 2 }]}>
                                        <Text style={{ fontSize: 16, color: 'red' }}>No items found</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
            ) : (
                // Loading will go here
                <View style={styles.spinner}>
                    <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}
                        size="large"
                        color="red"
                    />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: colors.grey5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        // width: '100%',
        minHeight: height,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'gainsboro',
        flexWrap: 'wrap',
    },
    spinner:{
        height:height/2,
        alignItems:'center',
        justifyContent:'center',
    }
})

export default ItemsContainer;