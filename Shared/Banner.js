import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Dimensions, View, ScrollView, Text } from 'react-native';
// import Swiper from 'react-native-swiper';
import Swiper from 'react-native-swiper/src';
import { colors } from '../assets/global/globalStyles';

const {width} = Dimensions.get('window');
const Banner = () => {
    const [bannerData, setBannerData] = useState([]);

    useEffect(()=>{
        setBannerData(["https://public.solutionsutras.com/rat/home_sliders/slider-image1.jpg",
                        "https://public.solutionsutras.com/rat/home_sliders/slider-image2.jpg",
                        "https://public.solutionsutras.com/rat/home_sliders/slider-image3.jpg",
                        "https://public.solutionsutras.com/rat/home_sliders/slider-image4.jpg",
                        "https://public.solutionsutras.com/rat/home_sliders/slider-image5.jpg",
                    ])
        return() =>{
            setBannerData([]);
        }
    },[])

    return(
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.swiper}>
                    <Swiper
                        style={{height:width/2,}}
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={3}
                    >
                        {bannerData.map((item) => {
                            return(
                                <Image
                                    key={item}
                                    style={styles.image}
                                    resizeMode='contain'
                                    source={{uri:item}}
                                />
                            );
                        })}
                    </Swiper>
                </View>
            </View>
        </ScrollView>
    )
 }

 export default Banner;

 const styles = StyleSheet.create({
     container:{
         flex:1,
         backgroundColor:'transparent',
     },
     swiper:{
         width:width,
        alignItems:'center',
        justifyContent:'center',
     },
     image:{
         height:width/2,
         width:width-10,
         marginLeft:5,
         borderRadius:10,
         marginHorizontal:0,

     }
 })