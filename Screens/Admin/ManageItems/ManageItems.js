import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { center, Box, Select, Icon } from 'native-base';
import { Ionicons, MaterialIcons, Entypo, FontAwesome, CheckIcon } from "@expo/vector-icons";
import { colors } from '../../../assets/global/globalStyles';
import FormContainer from '../../../Shared/Forms/FormContainer';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import Input from '../../../Shared/Forms/Input';
import Error from '../../../Shared/Error';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseUrl from '../../../assets/common/baseUrl';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

import * as mime from 'mime';

var { width } = Dimensions.get("window");
const ManageItems = (props) => {

    const [selectValue, setSelectValue] = useState();
    const [brand, setBrand] = useState();
    const [itemName, setItemName] = useState();
    const [itemDesc, setItemDesc] = useState();
    const [image, setImage] = useState();
    const [mainImage, setMainImage] = useState();
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState([]);
    const [price, setPrice] = useState(0);
    const [unit, setUnit] = useState();
    const [discountPercent, setDiscountPercent] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const [numOfReviews, setNumOfReviews] = useState(0);
    const [ratings, setRatings] = useState(0);

    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [item, setItem] = useState(null);

    useEffect(() => {

        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setItemName(props.route.params.item.itemName);
            setItemDesc(props.route.params.item.itemDesc);
            setCategory(props.route.params.item.itemCategory.id);
            setUnit(props.route.params.item.unit);
            setPrice(props.route.params.item.price.toString());
            setDiscountPercent(props.route.params.item.discountPercent.toString());
            setIsFeatured(props.route.params.item.isFeatured);
            setIsAvailable(props.route.params.item.isAvailable);
            // setNumOfReviews(props.route.params.item.numOfReviews.toString());
            // setRatings(props.route.params.item.ratings.toString());
        }

        // AsyncStorage
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))

        // Categories
        axios
            .get(`${baseUrl}categories`)
            .then((res) => setCategories(res.data))
            .catch((error) => alert("Error in loading Categories"));

        // Image Picker
        (async () => {
            if (Platform.OS !== 'web') {
                const { status, } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permission to make this work!")
                }
            }
        })();

        return () => {
            setCategories([]);
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.cancelled) {
            setMainImage(result.uri);
            setImage(result.uri);
        }
    }

    const addItemRecord = () => {
        if (itemName == "" ||
            itemDesc == "" ||
            category == "" ||
            price == 0 ||
            unit == ""
        ) {
            setError("Please fill in all the details correctly");
        }

        let formData = new FormData();

        // formData.append("image", {
        //     uri: image,
        //     type: mime.getType(image),
        //     name: image.split("/").pop()
        // });

        const newImageUri = "file:///" + image.split("file:/").join("");
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        formData.append("image", image);
        formData.append("itemName", itemName);
        formData.append("itemDesc", itemDesc);
        formData.append("itemCategory", category);
        formData.append("unit", unit);
        formData.append("price", price);
        formData.append("discountPercent", discountPercent);
        formData.append("isFeatured", isFeatured);
        formData.append("isAvailable", isAvailable);
        formData.append("numOfReviews", numOfReviews);
        formData.append("ratings", ratings);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }

        if (item !== null) {
            console.log(category)
            axios
                .put(`${baseUrl}itemdetails/${item._id}`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Item updated successfuly",
                            text2: " "
                        });
                        setTimeout(() => {
                            props.navigation.navigate("Items");
                        }, 500)
                    }
                })
                .catch((error) => {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong, Please try again...",
                        text2: "Error: " + error
                    });
                })
        } else {
            axios
                .post(`${baseUrl}itemdetails`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "New item added",
                            text2: " "
                        });
                        setTimeout(() => {
                            props.navigation.navigate("ViewItems");
                        }, 500)
                    }
                })
                .catch((error) => {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong, Please try again...",
                        text2: "Error: " + error
                    });
                })
        }
    }

    return (
        <FormContainer title={item ? "Edit Item" : "Add Item"} >

            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: mainImage }} />
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage} >
                    <Icon mr="0" size="5" color="white" as={<MaterialIcons name="camera" />} />
                </TouchableOpacity>
            </View>

            {/* <View style={styles.label}><Text style={{textDecorationLine:'underline'}}>Brand</Text></View>
            <Input
                placeholder="Brand"
                name="brand"
                id="brand"
                value={brand}
                onChangeText={(text) => setBrand(text)}
            /> */}

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Item Name</Text></View>
            <Input
                placeholder="Item Name"
                name="itemName"
                id="itemName"
                value={itemName}
                onChangeText={(text) => setItemName(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Item Description</Text></View>
            <Input
                placeholder="Item Description"
                name="ItemDesc"
                id="ItemDesc"
                value={itemDesc}
                onChangeText={(text) => setItemDesc(text)}
            />

            <View style={[{ marginBottom: 10 }, styles.label]}><Text style={{ textDecorationLine: 'underline' }}>Category</Text></View>
            <Select
                placeholder="Select category"
                selectedValue={category}
                width={width * 0.9}
                style={styles.select}
                placeholderTextColor={'#007AFF'}
                accessibilityLabel="Choose Service"
                _selectedItem={{
                    bg: "blue.300"
                }}
                onValueChange={(e) => setCategory(e)}
            >
                {categories.map((c) => {
                    return <Select.Item label={c.categName} value={c.id} key={c.id} />
                })}
            </Select>

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Price</Text></View>
            <Input
                placeholder="0"
                name="price"
                id="price"
                value={price}
                keyboardType={"numeric"}
                onChangeText={(text) => setPrice(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Unit</Text></View>
            <Input
                placeholder="Unit"
                name="unit"
                id="unit"
                value={unit}
                onChangeText={(text) => setUnit(text)}
            />

            {error ? <Error message={error} /> : null}

            <View style={styles.buttonContainer}>
                <EasyButton large primary
                    onPress={() => addItemRecord()}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </EasyButton>
            </View>
        </FormContainer>
    )
}


export default ManageItems;


const styles = StyleSheet.create({
    label: {
        width: '80%',
        marginTop: 10,
    },
    select: {
        width: width,
        height: 48,
        backgroundColor: 'white',
        padding: 0,
        paddingLeft: 15,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.buttons,
    },
    buttonContainer: {
        width: '80%',
        marginBottom: 80,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white'
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: 'solid',
        borderWidth: 8,
        padding: 0,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#E0E0E0',
        elevation: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    imagePicker: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        backgroundColor: 'grey',
        padding: 8,
        borderRadius: 100,
        elevation: 20,
    },
})