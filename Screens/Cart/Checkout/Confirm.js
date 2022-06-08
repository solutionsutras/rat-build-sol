import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Text, Image, Button } from 'native-base';
import { connect } from 'react-redux';
import * as actions from '../../../Redux/Actions/cartActions';

import { colors } from '../../../assets/global/globalStyles';
import { controls } from '../../../assets/global/controls';

import baseUrl from '../../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import axios from 'axios';

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {

    const finalOrder = props.route.params;

    const confirmOrder = () => {
        const order = finalOrder.order.order;
        // console.log("==========================================================================")
        // console.log(finalOrder)
        axios
            .post(`${baseUrl}orders`, order)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order placed successfuly",
                        text2: " "
                    })
                    setTimeout(() => {
                        props.clearCart();
                        props.navigation.navigate("Cart Screen")
                    }, 500)
                }
            })
            .catch((error) => {
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong, Please try again...",
                    text2: "Error:"+error
                });
            })
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Confirm Order  </Text>
            </View>
            {finalOrder ?
                <View style={{ borderWidth: 1, borderColor: colors.buttons, }}>
                    <Text style={styles.title}>Shipping to:</Text>
                    <View style={{ padding: 10, }}>
                        <Text style={styles.content}>Adrress: {finalOrder.order.order.shippingAddress1}</Text>
                        <Text>Adrress2: {finalOrder.order.order.shippingAddress2}</Text>
                        <Text>City: {finalOrder.order.order.city}</Text>
                        <Text>State: {finalOrder.order.order.state}</Text>
                        <Text>Country: {finalOrder.order.order.country}</Text>
                        <Text>PIN: {finalOrder.order.order.zip}</Text>
                        <Text>Phone No: {finalOrder.order.order.phone}</Text>
                    </View>
                    <Text style={styles.title}>Items:</Text>
                    {finalOrder.order.order.orderItems.map((i) =>
                        <ListItem
                            style={styles.listItem}
                            key={i.item.itemName}
                        >
                            <View style={styles.cartBody}>
                                <Image
                                    alt={i.item.itemName}
                                    source={{
                                        uri: i.item.image ? i.item.image : "https://public.solutionsutras.com/rat/images/no-item-image.png"
                                    }}
                                    size={6}
                                    resizeMode={'contain'}
                                />
                                <Text style={styles.contentText}>{i.item.itemName}</Text>
                                <Text style={{}}>Price: {controls.currency} {i.item.price}</Text>
                            </View>
                        </ListItem>
                    )}
                </View>
                : null
            }

            <View style={{ alignItems: 'center', margin: 20, }}>
                <Button
                    colorScheme="info"
                    my={10}
                    onPress={() => confirmOrder()}
                >
                    Place Order
                </Button>
            </View>
        </ScrollView>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearCart: () => dispatch(actions.clearCart())
    }
}

export default connect(null, mapDispatchToProps)(Confirm);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        height: height,
        backgroundColor: 'white',
        alignContent: 'center',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    title: {
        alignSelf: 'center',
        margin: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        alignSelf: 'center',
        fontSize: 16,
    },
    listItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#CCC',
        margin: 0,
        padding: 0,
    },
    cartBody: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    contentText: {
        fontSize: 14,
        marginHorizontal: 15,
    },
    contentTextBold: {
        fontSize: 14,
        marginHorizontal: 15,
        fontWeight: 'bold',
    },
})