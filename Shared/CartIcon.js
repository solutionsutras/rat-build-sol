import React from 'react';
import { StyleSheet,  } from 'react-native';
import { Text, Badge } from 'native-base';
// import {withBadge} from 'react-native-elements';

import { connect } from 'react-redux';
import { colors } from '../assets/global/globalStyles';

const CartIcon = (props) => {
    return (
        <>
            {props.cartItems.length ? (
                <Badge style={styles.badge} colorScheme="red">
                    <Text style={styles.badgeText}>{props.cartItems.length}</Text>
                </Badge>
            ) : (null)}
        </>
    )

}

const mapStateToProps = (state) => {
    const { cartItems } = state;
    return {
        cartItems: cartItems
    }
}

export default connect(mapStateToProps)(CartIcon);

const styles = StyleSheet.create({
    badge: {
        width: 24,
        height:24,
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        top: -8,
        right: -15,
        borderRadius:12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
})