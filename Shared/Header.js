import {React} from 'react'
import{View, Text, StyleSheet, Image, SafeAreaView} from 'react-native'
import { colors } from '../assets/global/globalStyles'


const Header = () =>{
    return(
    <SafeAreaView style={styles.header}>
        <Image
            source={require('../assets/logo.png')}
            resizeMode= 'contain'
            style={{height:50}}
        />
    </SafeAreaView>
)}

const styles = StyleSheet.create({
    header:{
        width:'100%',
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
        marginTop:24,
        backgroundColor:colors.buttons,
    }
})

export default Header;

