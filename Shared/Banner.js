import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
} from 'react-native';
// import Swiper from 'react-native-swiper';
import Swiper from 'react-native-swiper/src';
import { colors } from '../assets/global/globalStyles';

import baseUrl from '../assets/common/baseUrl';
import axios from 'axios';

const { width } = Dimensions.get('window');
const Banner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}homebanners`)
      .then((res) => {
        setBannerData(res.data);
      })
      .catch((error) => {
        console.log('Api call error: ' + error);
      });
    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{ height: width / 2 }}
            showsButtons={false}
            autoplay={true}
            autoplayTimeout={3}
          >
            {bannerData.map((item) => {
              return (
                <View>
                  <Image
                    key={item._id}
                    style={styles.image}
                    resizeMode="contain"
                    source={{ uri: item.image }}
                  />
                  <View style={styles.background2}></View>
                  <View style={styles.bannerText1View}>
                    <Text style={styles.bannerText1}>{item.captionText1}</Text>
                  </View>
                  <View style={styles.bannerText2View}>
                    <Text style={styles.bannerText2}>{item.captionText2}</Text>
                  </View>
                </View>
              );
            })}
          </Swiper>
        </View>
      </View>
    </ScrollView>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  swiper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: width / 2,
    width: width - 10,
    marginLeft: 5,
    borderRadius: 10,
    marginHorizontal: 0,
  },
  bannerText1View: {
    width: width / 1.5,
    position: 'absolute',
    top: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bannerText2View: {
    width: width / 1.5,
    position: 'absolute',
    top: 100,
    left: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  background2: {
    width: width / 1.5,
    height:50,
    position: 'absolute',
    top: 100,
    left: 5,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  bannerText1: {
    fontSize: 20,
    color: 'white',
    fontStyle: 'italic',
  },
  bannerText2: {
    fontSize: 12,
    color: colors.grey5,
  },
  bannerText2Highlight: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
