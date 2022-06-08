import React, { useState } from 'react';
import { View } from 'react-native';
import { ListItem, } from 'react-native-elements';
import { CheckIcon, Container, Center, Box, HStack, Spacer, Heading, List, Text, Radio, Select, Icon, Button } from 'native-base';

const methods = [
    { name: "Cash on Delivery", value: 1 },
    { name: "Bank Transfer", value: 2 },
    { name: "Card Payment", value: 3 },
    { name: "UPI", value: 4 }
]

const paymentCards = [
    { name: "Wallet", value: 1 },
    { name: "Visa", value: 2 },
    { name: "Masterard", value: 3 },
    { name: "Rupay", value: 4 },
    { name: "Others", value: 5 }
]

const Payment = (props) => {

    const order = props.route.params;

    const [methodValue, setMethodValue] = useState(1);
    const [selected, setSelected] = useState();
    const [card, setCard] = useState();
    return (
        <Center bg="coolGray.100">

            <Text mt="3" fontWeight="medium" fontSize="20">Select your payment method</Text>
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
                                <Text my={0} fontSize="16" color="gray.500" fontWeight="medium">{item.name}</Text>
                                <Spacer />
                                <Radio
                                    value={item.value}
                                    my={0}
                                    accessibilityLabel="Select payment method"
                                >
                                </Radio>
                            </HStack>
                        </ListItem>
                    )
                })}
            </Radio.Group>

            {selected == 3 ? (
                <Select
                    placeholder="Select card type"
                    selectedValue={card}
                    width={'90%'}
                    bg="#66DF48"
                    fontSize={14}
                    _selectedItem={{
                        bg: "#66DF48",
                        endIcon: <CheckIcon size={5} />
                    }}
                    onValueChange={(cType) => setCard(cType)}
                >
                    {paymentCards.map((c, index) => {
                        return <Select.Item label={c.name} key={c.name} value={c.value} />
                    })}
                </Select>) : (null)}

            <View style={{ alignSelf: 'center' }}>
                {/* Can add Condition to make the button isDisabled if the payment method is not selected */}
                <Button
                    colorScheme="info"
                    my={10}
                    onPress={() => props.navigation.navigate("Confirm", {order})}
                >
                    Confirm
                </Button>
            </View>
            
        </Center>
    )
}

export default Payment;