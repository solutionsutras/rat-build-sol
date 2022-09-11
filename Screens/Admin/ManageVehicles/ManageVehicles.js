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
import { controls } from '../../../assets/global/controls';

var { width } = Dimensions.get("window");

const ManageVehicles = (props) => {

    const [selectValue, setSelectValue] = useState();
    const [regNo, setRegNo] = useState();
    const [brand, setBrand] = useState();
    const [model, setModel] = useState();
    const [capacityInFoot, setCapacityInFoot] = useState(0);
    const [capacityInCm, setCapacityInCm] = useState(0);
    const [capacityInTon, setCapacityInTon] = useState(0);
    const [farePerKm, setFarePerKm] = useState(0);
    const [fuelType, setFuelType] = useState();
    const [tollTax, setTollTax] = useState(0);

    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {

        if (!props.route.params) {
            setVehicle(null);
        } else {
            setVehicle(props.route.params.vehicle);
            setRegNo(props.route.params.vehicle.regNo);
            setBrand(props.route.params.vehicle.brand);
            setModel(props.route.params.vehicle.model);
            setCapacityInFoot(props.route.params.vehicle.capacityInFoot);
            setCapacityInCm(props.route.params.vehicle.capacityInCm);
            setCapacityInTon(props.route.params.vehicle.capacityInTon);
            setFarePerKm(props.route.params.vehicle.farePerKm);
            setFuelType(props.route.params.vehicle.fuelType);
            setTollTax(props.route.params.vehicle.tollTax);
        }
        // AsyncStorage
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))

        return () => {
            setToken([]);
        }
    }, [])

    const addVehicleRecord = () => {

        if (regNo == "" ||
            brand == "" ||
            model == "" ||
            capacityInFoot == "" ||
            capacityInCm == "" ||
            capacityInTon == "" ||
            farePerKm == ""
        ) {
            setError("Please fill in all the details correctly");
        }


        // let formData = new FormData();

        const formData = {
            regNo: regNo,
            brand: brand,
            model: model,
            fuelType: fuelType,
            farePerKm: parseInt(farePerKm),
            capacityInFoot: parseInt(capacityInFoot),
            capacityInCm: parseInt(capacityInCm),
            capacityInTon: parseInt(capacityInTon),
            tollTax: parseInt(tollTax)
        };

        const config = { headers: { Authorization: `Bearer ${token}` } }

        if (vehicle !== null) {
            axios
                .put(`${baseUrl}vehicles/${vehicle._id}`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Vehicle updated successfuly",
                            text2: " "
                        });
                        setTimeout(() => {
                            props.navigation.navigate("ViewVehicles");
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
                .post(`${baseUrl}vehicles`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "New vehicle added",
                            text2: " "
                        });
                        setTimeout(() => {
                            props.navigation.navigate("ViewVehicles");
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
        <FormContainer title={vehicle ? "Edit Vehicle" : "Add Vehicle"} >
            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Registration Number</Text></View>
            <Input
                placeholder="Reg. Number"
                name="regNo"
                id="regNo"
                value={regNo}
                onChangeText={(text) => setRegNo(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Brand</Text></View>
            <Input
                placeholder="Vehicle Brand"
                name="brand"
                id="brand"
                value={brand}
                onChangeText={(text) => setBrand(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Model</Text></View>
            <Input
                placeholder="Vehicle Model"
                name="model"
                id="model"
                value={model}
                onChangeText={(text) => setModel(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Fuel type</Text></View>
            <Input
                placeholder="Petrol/Diesel/Electric"
                name="fuelType"
                id="fuelType"
                value={fuelType}
                onChangeText={(text) => setFuelType(text)}
            />

            <View style={styles.label}><Text style={{ textDecorationLine: 'underline' }}>Capacity</Text></View>
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ width: '32%' }}>
                    <Input
                        placeholder="In Foot"
                        name="capacityInFoot"
                        id="capacityInFoot"
                        keyboardType={"numeric"}
                        value={capacityInFoot.toString()}
                        onChangeText={(text) => setCapacityInFoot(text)}
                    />
                </View>
                <View style={{ width: '32%' }}>
                    <Input
                        placeholder="In Cm"
                        name="capacityInCm"
                        id="capacityInCm"
                        keyboardType={"numeric"}
                        value={capacityInCm.toString()}
                        onChangeText={(text) => setCapacityInCm(text)}
                    />
                </View>
                <View style={{ width: '32%' }}>
                    <Input
                        placeholder="In Ton"
                        name="capacityInTon"
                        id="capacityInTon"
                        keyboardType={"numeric"}
                        value={capacityInTon.toString()}
                        onChangeText={(text) => setCapacityInTon(text)}
                    />
                </View>
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ width: '48%' }}>
                    <View style={styles.label1}><Text style={{ textDecorationLine: 'underline' }}>Fare per KM (in {controls.currency})</Text></View>
                    <Input
                        placeholder="Fare per KM"
                        name="farePerKm"
                        id="farePerKm"
                        keyboardType={"numeric"}
                        value={farePerKm.toString()}
                        onChangeText={(text) => setFarePerKm(text)}
                    />
                </View>
                <View style={{ width: '48%' }}>
                    <View style={styles.label1}><Text style={{ textDecorationLine: 'underline' }}>Toll Tax (in {controls.currency})</Text></View>
                    <Input
                        placeholder="Toll Tax"
                        name="tollTax"
                        id="tollTax"
                        keyboardType={"numeric"}
                        value={tollTax ? tollTax.toString() : "0"}
                        onChangeText={(text) => setTollTax(text)}
                    />
                </View>
            </View>



            {error ? <Error message={error} /> : null}

            <View style={styles.buttonContainer}>
                <EasyButton large primary
                    onPress={() => addVehicleRecord()}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </EasyButton>
            </View>

        </FormContainer>
    )
}

export default ManageVehicles;

const styles = StyleSheet.create({
    label: {
        width: '90%',
        marginTop: 10,
        marginBottom: 5,
    },
    label1: {
        width: '100%',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
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