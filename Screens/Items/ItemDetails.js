import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Text, ScrollView, Button, Dimensions } from 'react-native';
import { Center, Heading, VStack, HStack, Icon } from 'native-base';
import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls';
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';

const { width } = Dimensions.get('window');
const ItemDetails = (props) => {
    const [item, setitem] = useState(props.route.params.item);
    const [availability, setAvailability] = useState(null);
    const [availabilityText, setAvailabilityText] = useState("");

    useEffect(() => {
        if(props.route.params.item.isAvailable == true){
            setAvailability(<TrafficLight available></TrafficLight>);
            setAvailabilityText("Available");
        }else{
            setAvailability(<TrafficLight unavailable></TrafficLight>);
            setAvailabilityText("Unavailable");
        }

        return() => {
            setAvailability(null);
            setAvailabilityText("");
        }
    },[])
    return (
        <Center style={styles.container}>
            <ScrollView style={{ marginBottom: 80, padding: 5, }}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: item.image ? item.image : "https://public.solutionsutras.com/rat/images/no-item-image.png"
                        }}
                        resizeMode='contain'
                        style={styles.image}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Heading style={styles.contentHeader}>{item.itemName}</Heading>
                    <Text style={styles.contentText}>Category : {item.itemCategory.categName}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View>
                        <Text>Availability: {availabilityText}</Text>
                        {/* {availability} */}
                    </View>
                    
                    <Text style={{}}>Description : {item.itemDesc}</Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.bottomContainerInner}>
                    <View style={{ margin: 0 }}>
                        <Text style={styles.priceText}>Price: {controls.currency}{item.price}/{item.unit}</Text>
                    </View>
                    <View style={{ margin: 0, }}>
                        <EasyButton medium primary
                            onPress={() => {
                                props.addItemToCart(item),
                                Toast.show({
                                    topOffset:60,
                                    type:"success",
                                    text1:`${item.itemName} added to cart`,
                                    text2:"Go to your cart to complete your order"
                                })
                            }}
                        >
                            <Text style={{color:'white'}}>Add to Cart</Text>
                        </EasyButton>
                    </View>
                </View>
            </View>
        </Center>
    )
}
const mapDispatchToProps = (dispatch) => {
    return{
        addItemToCart: (item) =>
            dispatch(actions.addToCart({item}))
        }
}

export default connect(null, mapDispatchToProps)(ItemDetails);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageContainer: {
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
    },
    image: {
        width: width / 2,
        height: width / 2,
        // borderWidth:2,
        // borderColor:'#CCC',
        // width:'100%',
        // height:250,
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 0,
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#EEE',
    },
    bottomContainerInner: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        margin:5,
    },
    priceText: {
        fontSize: 16,
        margin: 10,
        color: 'red',
    }
})