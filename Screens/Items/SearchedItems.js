import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Text, View, FlatList, ScrollView } from 'react-native';
import { Box, Left, Body, ListItem, Thumbnail, } from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from '../../assets/global/globalStyles';
import ItemsList from './ItemsList';

// const { width } = Dimensions.get("window");
const { height } = Dimensions.get('window');

const SearchedItems = (props) => {
    const { itemsFiltered } = props;
    // console.log(itemsFiltered.length)

    return (
        <ScrollView>
        <View style={styles.container}>
            {itemsFiltered.length > 0 ? (
                <View>
                    <View style={styles.listContainer}>
                        {itemsFiltered.map((item) => {
                            return (
                                <ItemsList
                                    navigation={props.navigation}
                                    key={item._id}
                                    item={item}
                                    style={{ width: '100%', }}
                                />
                            )
                        })}
                    </View>
                </View>
            ) : (
                <View style={{ marginLeft: 30 }}><Text style={{ fontSize: 18, color: 'red' }}>No matching items found !</Text></View>
            )}
        </View>
        </ScrollView>


    )
}

export default SearchedItems;

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
})