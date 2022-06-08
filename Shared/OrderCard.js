import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Select, Icon } from 'native-base';
import { Ionicons, MaterialIcons, Entypo, FontAwesome, CheckIcon } from "@expo/vector-icons";

import EasyButton from './StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../assets/common/baseUrl';
import { controls } from '../assets/global/controls'
import { colors } from '../assets/global/globalStyles'
import axios from 'axios';

var { width } = Dimensions.get("window");

const codes = [
    { name: "pending", code: "3" },
    { name: "shipped", code: "2" },
    { name: "delivered", code: "1" },
]

const OrderCard = (props) => {

    const [orderStatus, setOrderStatus] = useState();
    const [statusText, setStatusText] = useState();
    const [statusChange, setStatusChange] = useState();
    const [token, setToken] = useState();
    const [cardColor, setCardColor] = useState();

    useEffect(() => {

        {
            props.editMode
                ? (AsyncStorage.getItem("jwt")
                    .then((res) => setToken(res))
                    .catch((error) => console.log(error))

                ) : (null)
        }


        if (props.status == "3") {
            setOrderStatus("unavailable");
            setStatusText("pending");
            setCardColor("#EE7C5C");
        } else if (props.status == "2") {
            setOrderStatus("limited");
            setStatusText("shipped");
            setCardColor("#F1C40F");
        } else {
            setOrderStatus("available");
            setStatusText("delivered");
            setCardColor("#2ECC71");
        }

        return () => {
            setOrderStatus();
            setStatusText();
            setCardColor();
        }
    }, [])

    const updateOrderStatus = () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        const order = {
            id: props.id,
            city: props.city,
            country: props.country,
            dateOrdered: props.dateOrdered,
            orderItems: props.orderItems,
            phone: props.phone,
            shippingAddress1: props.shippingAddress1,
            shippingAddress2: props.shippingAddress2,
            state: props.state,
            pin: props.pin,
            status: statusChange,
            totalPrice: props.totalPrice,
            user: props.user
        }

        axios
            .put(`${baseUrl}orders/${props.id}`, order, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order status updated successfuly",
                        text2: " "
                    })
                    setTimeout(() => {
                        props.navigation.navigate("ViewItems")
                    }, 500)
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong, Please try again...",
                    text2: "Error:" + error
                });
            })

    }


    return (
        <View style={[{ backgroundColor: cardColor, }, styles.container]}>
            <View style={styles.container}>
                <Text>Order Number: {props.id} </Text>
            </View>
            <View style={{ marginTop: 10, }}>
                <Text>Status: {statusText}</Text>
                <Text>Address1: {props.shippingAddress1}</Text>
                <Text>Address2: {props.shippingAddress2}</Text>
                <Text>City: {props.city}</Text>
                <Text>State: {props.state}, {props.country}</Text>
                <Text>Date Ordered: {props.dateOrdered.split("T")[0]}</Text>
                <View style={styles.priceContainer}>
                    <Text style={{ color: 'white' }}>Order Value: </Text>
                    <Text style={styles.price}>{controls.currency}{props.totalPrice}</Text>
                </View>

                {props.editMode ? (
                    <View>
                        <Text style={styles.changeStatusTitle}>Change order status</Text>
                        <View style={styles.buttonContainer}>
                            <Select
                                placeholder="Select Status"
                                dropdownIcon={<Icon mr="0" size="5" color="white" as={<Ionicons name="arrow-down" />} />}
                                selectedValue={statusChange}
                                width={width / 1.7}
                                style={styles.select}
                                placeholderTextColor={'#007AFF'}
                                accessibilityLabel="Choose Status"
                                _selectedItem={{
                                    bg: "blue.300"
                                }}
                                onValueChange={(e) => setStatusChange(e)}
                            >
                                {codes.map((c) => {
                                    return <Select.Item label={c.name} value={c.code} key={c.code} />
                                })}
                            </Select>
                            <EasyButton
                                medium
                                secondary
                                onPress={() => updateOrderStatus()}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold', }}>Update</Text>
                            </EasyButton>
                        </View>
                    </View>
                ) : null}

            </View>
        </View>
    )
}

export default OrderCard;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    title: {
        backgroundColor: '#62B1F6',
        padding: 5,
    },
    priceContainer: {
        marginTop: 10,
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
    price: {
        color: 'white',
        fontWeight: 'bold',
    },
    select: {
        height: 36,
        backgroundColor: colors.grey5,
        padding: 0,
        paddingLeft: 15,
        // borderRadius: 2,
        // borderWidth: 1,
        // borderColor: colors.buttons,
    },
    buttonContainer: {
        width: '90%',
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    changeStatusTitle: {
        marginTop: 10,
        color: colors.buttons,
        textDecorationLine: 'underline',
        fontSize: 16,
    }
})
