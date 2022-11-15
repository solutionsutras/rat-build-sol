import React, { useContext } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Heading } from 'native-base';
import { connect } from 'react-redux';
import { controls } from '../../assets/global/controls';

import * as actions from '../../Redux/Actions/cartActions';
import CartItem from './CartItem';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import AuthGlobal from '../../Context/store/AuthGlobal';
import Login from '../User/Login';
import { colors } from '../../assets/global/globalStyles';

// import cartItems from '../../Redux/Reducers/cartItem';
const { width, height } = Dimensions.get('window');

const Cart = (props) => {
  const context = useContext(AuthGlobal);

  var total = 0;
  props.cartItems.forEach((cart) => {
    return (total += cart.itemTotal);
  });
  return (
    <>
      {props.cartItems.length ? (
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ marginBottom: 40 }}>
              <Heading
                alignSelf="center"
                my="1"
                style={{ color: 'green', fontSize: 18 }}
              >
                Cart Items
              </Heading>
              {props.cartItems.map((data, index) => {
                return (
                  <CartItem key={data.item._id} item={data} index={index} />
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <Text style={styles.totalPrice}>
              Grand Total: {controls.currency}
              {total}
            </Text>
            <View style={{}}>
              <EasyButton medium secondary onPress={() => props.clearCart()}>
                <Text style={{ color: 'white' }}>Clear Cart</Text>
              </EasyButton>
            </View>
            <View style={{}}>
              {context.stateUser.isAuthenticated ? (
                <EasyButton
                  medium
                  primary
                  onPress={() => props.navigation.navigate('Checkout')}
                >
                  <Text style={{ color: 'white' }}>Next</Text>
                </EasyButton>
              ) : (
                <EasyButton
                  medium
                  primary
                  onPress={() =>
                    props.navigation.navigate('User', {
                      screen: 'Login',
                      params: { fromNav: 'Checkout' },
                    })
                  }
                  // onPress = {() => <Login navigation={props.navigation} fromNav={"Checkout"} />}
                >
                  <Text style={{ color: 'white' }}>Next</Text>
                </EasyButton>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyCartText}>
            Looks like your cart is empty
          </Text>
          <Text style={styles.emptyCartText}>
            Add items to your cart to get started
          </Text>
        </View>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyCartText: {
    fontSize: 18,
    color: 'red',
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: colors.grey5,
    elevation: 20,
    width: width,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 5,
  },
  totalPrice: {
    fontSize: 16,
    margin: 10,
    color: 'red',
  },
  clearButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
