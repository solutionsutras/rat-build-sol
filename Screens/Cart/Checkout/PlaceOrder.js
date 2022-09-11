import React, { useState } from 'react';
import {
  ListItem,
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';
import { Image, CheckIcon, Container, Center, Box, HStack, Spacer, Heading, List, Radio, Select, Icon, Button } from 'native-base';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import { connect } from 'react-redux';
import * as actions from '../../../Redux/Actions/cartActions';
import axios from 'axios';
import baseUrl from '../../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';

const methods = [
    { name: 'Card Payment', value: 1 },
  { name: 'Net Banking', value: 2 },
  { name: 'UPI', value: 3 },
]

const paymentCards = [
    { name: "Wallet", value: 1 },
    { name: "Visa", value: 2 },
    { name: "Masterard", value: 3 },
    { name: "Rupay", value: 4 },
    { name: "Others", value: 5 }
]

const PlaceOrder = (props) => {
  console.log(
    '===============================   Place Order   ==========================================='
  );
  const order = props.route.params;

  console.log('order: ', order);

  const [methodValue, setMethodValue] = useState(1);
  const [selected, setSelected] = useState();
  const [card, setCard] = useState();

  const makePayment = () => {

  }
  const confirmOrder = () => {
    const order = props.route.params.order.order;
    console.log('order: ', order);
    axios
      .post(`${baseUrl}orders`, order)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Order placed successfuly',
            text2: ' ',
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate('Cart Screen');
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Something went wrong, Please try again...',
          text2: 'Error:' + error,
        });
      });
  };

  return (
    <Center bg="coolGray.100">

      {selected == 3 ? (
        <Select
          placeholder="Select card type"
          selectedValue={card}
          width={'90%'}
          bg="#66DF48"
          fontSize={14}
          _selectedItem={{
            bg: '#66DF48',
            endIcon: <CheckIcon size={5} />,
          }}
          onValueChange={(cType) => setCard(cType)}
        >
          {paymentCards.map((c, index) => {
            return <Select.Item label={c.name} key={c.name} value={c.value} />;
          })}
        </Select>
      ) : null}

      <View style={{ alignItems: 'center', margin: 20 }}>
        {/* Can add Condition to make the button isDisabled if the payment method is not selected */}
        <EasyButton large primary onPress={() => confirmOrder()}>
          <Text style={{ color: 'white' }}>Next</Text>
        </EasyButton>
      </View>
    </Center>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

export default connect(null, mapDispatchToProps)(PlaceOrder);