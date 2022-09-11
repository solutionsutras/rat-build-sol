import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

import { getDistance, getPreciseDistance } from 'geolib';

const GetDistance = () => {
    const calculateDistance = () => {
        var dis = getDistance(
            { latitude: 20.0504188, longitude: 64.4139099 },
            { latitude: 51.528308, longitude: -0.3817765 },
        );
        alert(
            `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
        );
    };

    const calculatePreciseDistance = () => {
        var pdis = getPreciseDistance(
            { latitude: 20.0504188, longitude: 64.4139099 },
            { latitude: 51.528308, longitude: -0.3817765 },
        );
        alert(
            `Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`
        );
    };

    return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        Example to Calculate Distance Between Two Locations
                    </Text>
                    <Text style={styles.textStyle}>
                        Distance between
                        {'\n'}
                        India(20.0504188, 64.4139099)
                        and
                        UK (51.528308, -0.3817765)
                    </Text>
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        onPress={calculateDistance}>
                        <Text>Get Distance</Text>
                    </TouchableHighlight>
                    <Text style={styles.textStyle}>
                        Precise Distance between
                        {'\n'}
                        India(20.0504188, 64.4139099)
                        and
                        UK (51.528308, -0.3817765)
                    </Text>
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        onPress={calculatePreciseDistance}>
                        <Text>
                            Get Precise Distance
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
    );
};


export default GetDistance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        marginTop: 30,
        fontSize: 16,
        textAlign: 'center',
        color: 'black',
        paddingVertical: 20,
    },
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#dddddd',
        margin: 10,
    },
})