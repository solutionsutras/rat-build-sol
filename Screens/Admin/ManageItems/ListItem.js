import React, { useState, } from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableOpacity, Dimensions, Button, Modal } from 'react-native';
import { Icon, Heading, VStack, Input, Box, Divider } from 'native-base';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { controls } from '../../../assets/global/controls';
import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

var { width } = Dimensions.get("window")

const ListItem = (props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}
            >
                <View style={styles.centerView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor='#E8E8E8'
                            onPress={() => {
                                setModalVisible(false)
                            }}
                            style={{ alignSelf: 'flex-end', position: 'absolute', top: 5, right: 10, }}
                        >
                            <Icon ml="2" size="6" color="gray.600" as={<Ionicons name="ios-close" />} />
                        </TouchableOpacity>

                        <EasyButton
                            medium
                            secondary
                            onPress={() => [
                                props.navigation.navigate("ItemsForm", { item: props }),
                                setModalVisible(false)
                            ]}
                        >
                            <Text style={styles.textStyle}>Edit</Text>
                        </EasyButton>
                        <EasyButton
                            medium
                            danger
                            onPress={() => [props.delete(props._id), setModalVisible(false)]}
                        >
                            <Text style={styles.textStyle}>Delete</Text>
                        </EasyButton>

                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={[styles.container, {
                    backgroundColor: props.index % 2 == 0 ? colors.cardBackground : colors.grey5
                }]}
                // onPress={() => {props.navigation.navigate("Item Details", { item: props })}}
                onLongPress={() => setModalVisible(true)}
            >
                <Image
                    source={{
                        uri: props.image
                            ? props.image
                            : "https://public.solutionsutras.com/rat/images/no-item-image.png"
                    }}
                    resizeMode="contain"
                    style={styles.image}
                />
                <Text style={styles.item}>{props.itemName}</Text>
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{props.itemDesc}</Text>
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{props.itemCategory.categName}</Text>
                <Text style={styles.item}>{controls.currency}{props.price}/{props.unit}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        width: width,
    },
    image: {
        borderRadius: 15,
        width: width / 6,
        height: 20,
        margin: 2,
    },
    item: {
        flexWrap: 'wrap',
        margin: 3,
        width: width / 6,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
    }
})