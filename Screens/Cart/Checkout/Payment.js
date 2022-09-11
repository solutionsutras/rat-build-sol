import React, { useState } from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import {
  CheckIcon,
  Container,
  Center,
  Box,
  HStack,
  Spacer,
  Heading,
  List,
  Text,
  Radio,
  Select,
  Icon,
  Button,
} from 'native-base';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

const methods = [
  { name: 'Card Payment', value: 1 },
  { name: 'Net Banking', value: 2 },
  { name: 'UPI', value: 3 },
];

const paymentCards = [
  { name: 'Wallet', value: 1 },
  { name: 'Visa', value: 2 },
  { name: 'Masterard', value: 3 },
  { name: 'Rupay', value: 4 },
  { name: 'Others', value: 5 },
];

const Payment = (props) => {
  console.log(
    '========================   Payments   ==========================='
  );
  const order = props.route.params;

  console.log('order: ', order);

  const [methodValue, setMethodValue] = useState(1);
  const [selected, setSelected] = useState();
  const [card, setCard] = useState();
  const [advancePaid, setAdvancePaid] = useState(false);

  const makePayment = () => {
    props.navigation.navigate('PlaceOrder', { order });
  };

  return (
    <Center bg="coolGray.100">
      <Text mt="3" fontWeight="medium" fontSize="20">
        Select your payment method
      </Text>
      <Radio.Group
        name="paymentMethods"
        value={selected}
        onChange={(nextValue) => {
          setMethodValue(nextValue);
          setSelected(nextValue);
        }}
        accessibilityLabel="Select payment method"
      >
        {methods.map((item, index) => {
          return (
            <ListItem key={item.name} onPress={() => setSelected(item.value)}>
              <HStack alignItems="flex-start" my={0}>
                <Text my={0} fontSize="16" color="gray.500" fontWeight="medium">
                  {item.name}
                </Text>
                <Spacer />
                <Radio
                  value={item.value}
                  my={0}
                  accessibilityLabel="Select payment method"
                ></Radio>
              </HStack>
            </ListItem>
          );
        })}
      </Radio.Group>

      {selected == 2 ? (
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
        <EasyButton large primary onPress={() => makePayment()}>
          <Text style={{ color: 'white' }}>Next</Text>
        </EasyButton>
      </View>
    </Center>
  );
};

export default Payment;
