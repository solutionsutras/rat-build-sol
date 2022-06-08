import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
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


const Categories = (props) => {

    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState();
    const [image, setImage] = useState();

    const [token, setToken] = useState();
    const [error, setError] = useState();

    console.log(categories.length);
    
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

    return (
        <View style={{ position: 'relative', height: '100%' }}>
            <View style={{ marginBottom: 60 }}>
                <FlatList
                    data={categories}
                    renderItem={({ item, index }) => {
                        <Text>Categories</Text>
                    }}
                />
            </View>
            <View  style={styles.buttonContainer}>
                <FormContainer title={categories.length ? "Edit Category" : "Add Category"} >
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: image }} />
                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} >
                            <Icon mr="0" size="5" color="white" as={<MaterialIcons name="camera" />} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Category Name</Text></View>
                    <View style={{ width: width / 2.5 }}>
                        <Input
                            placeholder="Category name"
                            name="categoryName"
                            id="categoryName"
                            value={categoryName}
                            onChangeText={(text) => setCategoryName(text)}
                        />
                    </View>

                    {error ? <Error message={error} /> : null}

                    <View style={styles.buttonContainer}>
                        <EasyButton large primary
                            // onPress={() => addItemRecord()}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </EasyButton>
                    </View>

                </FormContainer>
            </View>
        </View>
    )
}


export default Categories;


const styles = StyleSheet.create({
    label: {
        width: '80%',
        marginTop: 10,
    },
    select: {
        width: width,
        height: 60,
        backgroundColor: 'white',
        padding: 0,
        paddingLeft: 15,
        borderRadius: 10,
        borderWidth: 2,
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
    bottomBar:{
        backgroundColor:'white',
        width:width,
        height:60,
        padding:2,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        position:'absolute',
        bottom:0,
        left:0,
    },

})