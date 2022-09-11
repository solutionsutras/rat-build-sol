import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { center, Box, Select, Icon } from 'native-base';
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  CheckIcon,
} from '@expo/vector-icons';
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
import { controls } from '../../../assets/global/controls';

var { width } = Dimensions.get('window');

const EditItem = (props) => {
  const [selectValue, setSelectValue] = useState();
  const [brand, setBrand] = useState();
  const [itemName, setItemName] = useState();
  const [itemDesc, setItemDesc] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [quality, setQuality] = useState();
  const [qualities, setQualities] = useState([]);
  const [rates, setRates] = useState([]);
  const [oldRates, setOldRates] = useState([]);
  const [newRates, setNewRates] = useState([]);
  const [unit, setUnit] = useState();
  const [cost, setCost] = useState(0);
  const [tmpCost, setTmpCost] = useState(0);
  const [costPerFeet, setCostPerFeet] = useState(0);
  const [costPerCm, setCostPerCm] = useState(0);
  const [costPerTon, setCostPerTon] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [ratings, setRatings] = useState(0);
  const [units, setUnits] = useState([]);

  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [item, setItem] = useState(null);

  const [arrIndex, setArrIndex] = useState(0);

  console.log(
    '============================   RENDER START  ======================================================'
  );
  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      axios
        .get(`${baseUrl}units`)
        .then((res) => {
          const tmpUnits = res.data;
          setUnits(tmpUnits);
          // console.log("units:", units);
          let empty_rates = [
            {
              "cost": 0,
              "unit": tmpUnits[0],
            },
            {
              "cost": 0,
              "unit": tmpUnits[1],
            },
            {
              "cost": 0,
              "unit": tmpUnits[2],
            },
          ];
          setNewRates(empty_rates);
          console.log('1. newRates: ', newRates);
          if (props.route.params.item.rates.length > 0) {
            setOldRates(props.route.params.item.rates);
          } else {
            setOldRates(newRates);
          }
        })
        .catch((error) => alert(error));
      setItem(props.route.params.item);
      setItemName(props.route.params.item.itemName);
      setItemDesc(props.route.params.item.itemDesc);
      setCategory(props.route.params.item.itemCategory.id);
      setQuality(props.route.params.item.quality.id);

      setDiscountPercent(props.route.params.item.discountPercent.toString());
      setIsFeatured(props.route.params.item.isFeatured);
      setIsAvailable(props.route.params.item.isAvailable);
      setMainImage(props.route.params.item.image);
      setImage(props.route.params.item.image);
      setNumOfReviews(props.route.params.item.numOfReviews.toString());
      setRatings(props.route.params.item.ratings.toString());
    }

    // AsyncStorage
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    // Categories
    axios
      .get(`${baseUrl}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert('Error in loading Categories'));

    // Qualities
    axios
      .get(`${baseUrl}itemquality`)
      .then((res) => setQualities(res.data))
      .catch((error) => alert('Error in loading Qualities'));

    // Image Picker
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permission to make this work!');
        }
      }
    })();

    return () => {
      setCategories([]);
      setQualities([]);
    };
  }, []);

  const updateRates = async () => {
    console.log('01. oldRates: ', oldRates);
    let temp_rates = [...oldRates];
    let temp_element = { ...temp_rates[arrIndex] };
    temp_element.cost = tmpCost;
    temp_rates[arrIndex] = temp_element;
    const oRate = temp_rates;
    setOldRates(oRate);
    console.log('02. oldRates: ', oldRates);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addItemRecord = () => {
    if (
      itemName == '' ||
      itemDesc == '' ||
      category == '' ||
      quality == '' ||
      rates == ''
    ) {
      setError('Please fill in all the details correctly');
    }

    let formData = new FormData();

    // formData.append("image", {
    //     uri: image,
    //     type: mime.getType(image),
    //     name: image.split("/").pop()
    // });

    const newImageUri = 'file:///' + image.split('file:/').join('');
    formData.append('image', {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split('/').pop(),
    });

    formData.append('image', image);
    formData.append('itemName', itemName);
    formData.append('itemDesc', itemDesc);
    formData.append('itemCategory', category);
    formData.append('quality', quality);
    formData.append('discountPercent', discountPercent);
    formData.append('isFeatured', isFeatured);
    formData.append('isAvailable', isAvailable);
    formData.append('numOfReviews', numOfReviews);
    formData.append('ratings', ratings);
    formData.append('rates', rates);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      console.log('1. formData: ', formData);
      axios
        .put(`${baseUrl}itemdetails/${item._id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: 'success',
              text1: 'Item updated successfuly',
              text2: ' ',
            });
            setTimeout(() => {
              props.navigation.navigate('ViewItems');
            }, 50);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Something went wrong, Please try again...',
            text2: 'Error: ' + error,
          });
        });
    }
  };

  return (
    <FormContainer>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: mainImage }} />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon
            mr="0"
            size="5"
            color="white"
            as={<MaterialIcons name="camera" />}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.label}>
        <Text style={{ textDecorationLine: 'underline' }}>Item Name</Text>
      </View>
      <Input
        placeholder="Item Name"
        name="itemName"
        id="itemName"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: 'underline' }}>
          Item Description
        </Text>
      </View>
      <Input
        placeholder="Item Description"
        name="ItemDesc"
        id="ItemDesc"
        value={itemDesc}
        onChangeText={(text) => setItemDesc(text)}
      />

      <View style={styles.label}>
        <Text style={{ textDecorationLine: 'underline' }}>Category</Text>
      </View>
      <Select
        placeholder="Select category"
        selectedValue={category}
        width={width * 0.9}
        style={styles.select}
        placeholderTextColor={'#007AFF'}
        accessibilityLabel="Choose Service"
        _selectedItem={{
          bg: 'blue.300',
        }}
        onValueChange={(e) => setCategory(e)}
      >
        {categories.map((c) => {
          return <Select.Item label={c.categName} value={c.id} key={c.id} />;
        })}
      </Select>

      <View style={styles.label}>
        <Text style={{ textDecorationLine: 'underline' }}>Quality</Text>
      </View>
      <Select
        placeholder="Select quality"
        selectedValue={quality}
        width={width * 0.9}
        style={styles.select}
        placeholderTextColor={'#007AFF'}
        accessibilityLabel="Choose Quality"
        _selectedItem={{
          bg: 'blue.300',
        }}
        onValueChange={(e) => setQuality(e)}
      >
        {qualities.map((q) => {
          return <Select.Item label={q.qualityName} value={q.id} key={q.id} />;
        })}
      </Select>

      <View style={styles.label}>
        <Text style={{ textDecorationLine: 'underline' }}>
          Rates (in {controls.currency})
        </Text>
      </View>
      <View>
        <Text>Length: {oldRates.length}</Text>
      </View>
      {oldRates.length > 0 ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {oldRates.map((r, index) => {
            return (
              <View style={{ width: '30%' }}>
                {/* <ManageRates r={r} navigation={props.navigation}/> */}
                <Input
                  placeholder="0"
                  name="costs[]"
                  // id="costs[]"
                  keyboardType={'numeric'}
                  onChangeText={(text) => {
                    setTmpCost(isNaN(parseInt(text)) ? '0' : parseInt(text));
                    setArrIndex(index);
                    updateRates();
                  }}
                  value={r.cost.toString()}
                />
                <Text style={{marginLeft:10,}}>
                  per {r.unit.unitName.split('(')[0].trim()}
                </Text>

                {/* <Text>Index: {index}</Text>
                <Text>Cost: {r.cost}</Text> */}
              </View>
            );
          })}
        </View>
      ) : null}

      {error ? <Error message={error} /> : null}

      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addItemRecord()}>
          <Text style={styles.buttonText}>Update</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

export default EditItem;

const styles = StyleSheet.create({
  label: {
    width: '90%',
    marginTop: 10,
    marginBottom: 5,
  },
  select: {
    width: width,
    height: 42,
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
    color: 'white',
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderStyle: 'solid',
    borderWidth: 5,
    padding: 0,
    justifyContent: 'center',
    borderRadius: 100,
    borderColor: '#E0E0E0',
    // elevation: 10,
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
});
