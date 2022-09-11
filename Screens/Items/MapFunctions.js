import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
// import * as Location from 'expo-location'

const MapFunctions = (props) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }

    //         console.log(status);

    //         let location = await Location.getCurrentPositionAsync({});
    //         setLocation(location);
    //     })();
    // }, []);

     let text = 'Waiting..';
    // if (errorMsg) {
    //   text = errorMsg;
    // } else if (location) {
    //   text = JSON.stringify(location);
    // }
  
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }

  export default MapFunctions;
  
  const styles = StyleSheet.create({}); 
