import React, {useState, useEffect} from 'react';
import {View, Text, Stylesheet, TouchableOpacity, Dimensions} from 'react-native';
import { colors } from '../../assets/global/globalStyles';
import ItemsCard from './ItemsCard';

var {width} = Dimensions.get("window");


const ItemsList = (props) =>{
    const {item} = props;
    return(
        <TouchableOpacity style={{width:'50%'}}
            onPress={()=>{
                props.navigation.navigate('Item Details', {item: item})
            }}
        >
            <View style={{width:width/2, backgroundColor:'transparent',}}>
                <ItemsCard  {...item} />
            </View>

        </TouchableOpacity>
    )
}



export default ItemsList;