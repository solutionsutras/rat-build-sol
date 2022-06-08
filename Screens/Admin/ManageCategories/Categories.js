import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput, } from 'react-native';

import { colors } from '../../../assets/global/globalStyles';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
import baseUrl from '../../../assets/common/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

var { width } = Dimensions.get("window");

const CategoryItems = (props) => {
    // console.log(props.item._id)
    return (
        <View style={styles.item}>
            <Text>{props.item.categName}</Text>
            <EasyButton
                medium
                danger
                onPress={() => props.delete(props.item._id)}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', }}>Delete</Text>
            </EasyButton>
        </View>
    )
}

const Categories = (props) => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log(error));

        axios
            .get(`${baseUrl}categories`)
            .then((res) => setCategories(res.data))
            .catch((error) => alert("Error in loading categories"))

        return () => {
            setCategories([]);
            setToken();
        }
    }, [])

    const config = {
        headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    };

    const addCategory = () => {
        const category = {
            categName: categoryName
        };
        
        axios
            .post(`${baseUrl}categories`, category, config)
            .then((res) => {
                if (res.status == 200 || res.status == 201) {
                    setCategories([...categories, res.data])
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "New category added successfuly",
                        text2: " "
                    });
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

        setCategoryName("");
    }

    const deleteCategory = (id) => {
        axios
            .delete(`${baseUrl}categories/${id}`, config)
            .then((res) => {
                const newCategories = categories.filter((item) => item.id !== id);
                setCategories(newCategories);
            })
            .catch((error) => alert("Error in deleteing category"));
    }

    return (
        <View style={{ position: 'relative', height: '100%' }}>
            <View style={{ marginBottom: 60, }}>
                <FlatList
                    data={categories}
                    renderItem={({ item, index }) => (
                        <CategoryItems item={item} index={index} delete={deleteCategory}/>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>

            <View style={styles.bottomBar}>
                <View>
                    <Text>Add Category</Text>
                </View>
                <View style={{ width: width / 2.5 }}>
                    <TextInput
                        style={styles.input}
                        value={categoryName}
                        onChangeText={(text) => setCategoryName(text)}
                    />
                </View>
                <View>
                    <EasyButton
                        medium
                        primary
                        onPress={() => addCategory()}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', }}>Add</Text>
                    </EasyButton>
                </View>
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
    bottomBar: {
        backgroundColor: 'white',
        width: width,
        height: 60,
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    input: {
        height: 40,
        borderColor: colors.grey1,
        borderWidth: 1,
    },
    item: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 1,
        padding: 5,
        margin: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
    }

})