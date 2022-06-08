import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Select, Button, } from 'native-base';
import { Icon } from 'react-native-elements';
import FormContainer from '../../../Shared/Forms/FormContainer';
import Input from '../../../Shared/Forms/Input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import AuthGlobal from '../../../Context/store/AuthGlobal';
import Toast from 'react-native-toast-message';

const countries = require('../../../assets/data/countries.json');

const Checkout = (props) => {
    const context = useContext(AuthGlobal)

    const [orderItems, setOrderItems] = useState();
    const [address, setAddress] = useState();
    const [address2, setAddress2] = useState();
    const [city, setCity] = useState();
    const [pin, setPin] = useState();
    const [state, setState] = useState();
    const [country, setCountry] = useState();
    const [phone, setPhone] = useState();
    const [error, setError] = useState('');
    const [user, setUser] = useState();

    useEffect(() => {
        setOrderItems(props.cartItems)
        
        if(context.stateUser.isAuthenticated){
            setUser(context.stateUser.user.userId)
        }else{
            props.navigation.navigate("Cart");
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please login to checkout ",
                text2: "and place order"
            });
        }
        setCountry("INDIA")
        setState("Odisha")

        return () => {
            setOrderItems();
        }
    }, [])

    const proceedToPayment = () => {
        
    // console.log(context.stateUser.user.userId)

        let order = {
            city,
            country,
            dateOrdered: Date.now(),
            orderItems,
            phone,
            shippingAddress1: address,
            shippingAddress2: address2,
            state,
            pin,
            status:"3",
            user: user
        }
        props.navigation.navigate("Payment", { order: order })
    }

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Shipping Address"}>
                <View>
                    {error ? <Error message={error} /> : null}
                </View>
                <Input
                    placeholder={"Phone"}
                    name={"Phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <Input
                    placeholder={"Shipping Address 1"}
                    name={"ShippingAddress1"}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                <Input
                    placeholder={"Shipping Address 2"}
                    name={"ShippingAddress2"}
                    value={address2}
                    onChangeText={(text) => setAddress2(text)}
                />
                <Input
                    placeholder={"City"}
                    name={"City"}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                <Input
                    placeholder={"PIN Code"}
                    name={"PIN"}
                    value={pin}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPin(text)}
                />
                <Input
                    placeholder={"State"}
                    name={"State"}
                    value={state}
                    onChangeText={(text) => setState(text)}
                />
                <Input
                    placeholder={"Country"}
                    name={"Country"}
                    value={country}
                    onChangeText={(text) => setCountry(text)}
                />
                {/* <Select
                    placeholder="Select your country"
                    selectedValue={country}
                    style={styles.select}
                    placeholderTextColor={'#007AFF'}
                    onValueChange={(e) => setCountry(e)}
                >
                    {countries.map((c) => {
                        return <Select.Item label={c.name} value={c.name} key={c.code} />
                    })}
                </Select> */}
                <View style={{ width: '80%', alignItems: 'center' }}>
                    <EasyButton large secondary onPress={() => proceedToPayment()} >
                        <Text style={{ color: 'white' }}>Proceed</Text>
                    </EasyButton>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

const mapStateToProps = (state) => {
    const { cartItems } = state;
    return {
        cartItems: cartItems,
    }
}
export default connect(mapStateToProps)(Checkout);

const styles = StyleSheet.create({
    select: {
        width: '90%',
        height: 60,
        backgroundColor: 'white',
        margin: 10,
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.buttons,
    }
})