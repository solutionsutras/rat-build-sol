import React, { useState, } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Image, } from 'native-base';
import { connect } from 'react-redux';
import { controls } from '../../assets/global/controls';
import * as actions from '../../Redux/Actions/cartActions';

const { width, height } = Dimensions.get("window")
const CartItem = (props) => {
    const data = props.item
    const [qty, setQty] = useState(props.item.item.quantity)

    console.log(data)

    return (
        <ListItem
            style={styles.listItem}
            key={Math.random()}
        >

            <View style={styles.cartBody}>
                <Image
                    alt={data.item.itemName}
                    source={{
                        uri: data.item.image ? data.item.image : "https://public.solutionsutras.com/rat/images/no-item-image.png"
                    }}
                    size={28}
                    resizeMode={'contain'}
                />
                <Text style={styles.contentText}>{data.item.itemName}</Text>
                <Text style={styles.contentTextSmall}>Qty: {data.item.unit}</Text>
                <Text style={{}}>Price: {controls.currency}{data.item.price}</Text>
                <View>
                    <Icon
                        name="trash"
                        type="font-awesome"
                        color={'red'}
                        size={20}
                        onPress={()=>props.removeFromCart(data)}
                    />
                </View>
            </View>
        </ListItem>
    )
}

const mapStateToProps = (state) => {
    const { cartItems } = state;
    return {
        cartItems: cartItems,
    }
}
const mapDispatchToProps= (dispatch) => {
    return{
        removeFromCart: (item) => dispatch(actions.removeFromCart(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);


const styles = StyleSheet.create({

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
    contentTextSmall: {
        fontSize: 14,
        marginRight: 5,
    },
    contentText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5,
    },
})