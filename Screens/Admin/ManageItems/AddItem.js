import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Button,
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

const AddItem = (props) => {
  const [selectValue, setSelectValue] = useState();
  const [brand, setBrand] = useState();
  const [itemName, setItemName] = useState();
  const [itemDesc, setItemDesc] = useState();
  const [image, setImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [quality, setQuality] = useState();
  const [qualities, setQualities] = useState([]);
  const [rates, setRates] = useState([]);
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
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    axios
      .get(`${baseUrl}units`)
      .then(async (res) => {
        const tmpUnits = await res.data;
        setUnits(tmpUnits);
        let tempRates = [];
        if (units) {
          tempRates = [
            { cost: costPerFeet.toString(), unit: units[0]._id },
            { cost: costPerCm.toString(), unit: units[1]._id },
            { cost: costPerTon.toString(), unit: units[2]._id },
          ];
        }
        setRates(tempRates);
      })
      .catch((error) => console.log(error));
  }, [costPerFeet, costPerCm, costPerTon]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        'Permission for Camera not granted.Please change this in settings!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: true,
      exif: false,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      console.log(result.uri);
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

    const newImageUri = 'file:///' + image.split('file:/').join('');
    formData.append('image', {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split('/').pop(),
    });

    // formData.append('image', image);
    formData.append('itemCategory', category);
    formData.append('itemName', itemName);
    formData.append('itemDesc', itemDesc);
    formData.append('quality', quality);
    rates.map((item, index) => {
      let temp_element = item;
      formData.append('rates[' + index + '][unit]', item.unit);
      formData.append('rates[' + index + '][cost]', item.cost);
    });
    formData.append('discountPercent', discountPercent);
    formData.append('isFeatured', isFeatured);
    formData.append('isAvailable', isAvailable);
    formData.append('numOfReviews', numOfReviews);
    formData.append('ratings', ratings);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseUrl}itemdetails`, formData, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'New item added',
            text2: ' ',
          });
          setTimeout(() => {
            props.navigation.navigate('ViewItems');
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              underlayColor="#E8E8E8"
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                top: 5,
                right: 10,
              }}
            >
              <Icon
                ml="2"
                size="6"
                color="gray.600"
                as={<Ionicons name="ios-close" />}
              />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => [pickImage(), setModalVisible(false)]}
              >
                <Icon
                  mr="0"
                  size="5"
                  color="white"
                  as={<MaterialIcons name="folder" />}
                />
                <Text style={styles.pickerText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => [openCamera(), setModalVisible(false)]}
              >
                <Icon
                  mr="0"
                  size="5"
                  color="white"
                  as={<MaterialIcons name="camera" />}
                />
                <Text style={styles.pickerText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FormContainer>
        <View style={{ position: 'absolute', top: 10 }}>
          <Text>Select Image</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: image }} />
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => setModalVisible(true)}
          >
            <Icon
              mr="0"
              size="5"
              color="white"
              as={<MaterialIcons name="camera" />}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.label}>
          <Text style={{}}>Item Name</Text>
        </View>
        <Input
          placeholder="Item Name"
          name="itemName"
          id="itemName"
          value={itemName}
          onChangeText={(text) => setItemName(text)}
        />

        <View style={styles.label}>
          <Text style={{}}>
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
          <Text style={{}}>Category</Text>
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
          <Text style={{}}>Quality</Text>
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
            return (
              <Select.Item label={q.qualityName} value={q.id} key={q.id} />
            );
          })}
        </Select>

        <View style={styles.label}>
          <Text style={{}}>
            Rates (in {controls.currency})
          </Text>
          {/* <Text>rates.length: {rates.length}</Text> */}
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}
        >
          <View style={{ width: '30%' }}>
            <Input
              placeholder="0"
              name="costs[]"
              keyboardType={'numeric'}
              onChangeText={(text) => {
                setCostPerFeet(isNaN(parseInt(text)) ? '0' : parseInt(text));
                setTmpCost(isNaN(parseInt(text)) ? '0' : parseInt(text));
              }}
              value={costPerFeet.toString()}
            />
            <Text style={{ textAlign: 'center' }}>per Foot</Text>
          </View>
          <View style={{ width: '30%' }}>
            <Input
              placeholder="0"
              name="costs[]"
              keyboardType={'numeric'}
              onChangeText={(text) => {
                setCostPerCm(isNaN(parseInt(text)) ? '0' : parseInt(text));
                setTmpCost(isNaN(parseInt(text)) ? '0' : parseInt(text));
              }}
              value={costPerCm.toString()}
            />
            <Text style={{ textAlign: 'center' }}>per Cm</Text>
          </View>
          <View style={{ width: '30%' }}>
            <Input
              placeholder="0"
              name="costs[]"
              keyboardType={'numeric'}
              onChangeText={(text) => {
                setCostPerTon(isNaN(parseInt(text)) ? '0' : parseInt(text));
                setTmpCost(isNaN(parseInt(text)) ? '0' : parseInt(text));
              }}
              value={costPerTon.toString()}
            />
            <Text style={{ textAlign: 'center' }}>per Ton</Text>
          </View>
        </View>

        {error ? <Error message={error} /> : null}

        <View style={styles.buttonContainer}>
          <EasyButton large primary onPress={() => addItemRecord()}>
            <Text style={styles.buttonText}>Save</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </View>
  );
};

export default AddItem;

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
  centerView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    marginTop: 200,
  },
  modalView: {
    width: '90%',
    margin: 10,
    backgroundColor: colors.grey5,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderColor: colors.buttons,
    borderWidth: 1,
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginVertical: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.buttons,
  },
  pickerText: {
    color: 'white',
    fontSize: 16,
    margin: 5,
  },
});
