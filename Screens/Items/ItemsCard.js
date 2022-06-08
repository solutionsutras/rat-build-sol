import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls'
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

var { width } = Dimensions.get('window');


const ItemsCard = (props) => {

    const { itemName, image, unit, price } = props;
    const [available, setAvailable] = useState(true)

    return (
        <View style={styles.container}>
            <Image style={styles.image}
                resizeMode='contain'
                source={{ uri: image }}
            />
            <View style={styles.card} />
            <Text style={styles.title}>
                {itemName.length > 25 ? itemName.substring(0, 25 - 3) + '...' : itemName}
            </Text>
            <Text style={styles.price}>{controls.currency}{price} / {unit}</Text>
            {(available === true) ? (
                <View style={{ marginBottom: 60, }}>
                    <EasyButton medium primary 
                        onPress={() => {
                            props.addItemToCart(props),
                            Toast.show({
                                topOffset:60,
                                type:"success",
                                text1:`${itemName} added to cart`,
                                text2:"Go to your cart to complete your order"
                            })
                        }}
                    >
                        <Text style={{color:'white',}}>Add to Cart</Text>
                    </EasyButton>
                </View>
            ) : <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
            }
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return{
        addItemToCart: (item) =>
            dispatch(actions.addToCart({item}))
        }
}

export default connect(null, mapDispatchToProps)(ItemsCard);


const styles = StyleSheet.create({
    container: {
        width: width / 2 - 20,
        height: width / 1.5,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: "#EEE",
    },
    image: {
        width: width / 2 - 20 - 10,
        height: width / 2 - 20 - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 5,
    },
    card: {
        marginBottom: 10,
        height: width / 2 - 20 - 40,
        width: width / 2 - 20 - 10,
        backgroundColor: 'transparent',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    price: {
        fontSize: 16,
        marginTop: 5,
        color: 'grey',
    },
})
