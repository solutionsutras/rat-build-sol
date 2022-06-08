import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ListItem, Badge, } from 'react-native-elements';
import { colors } from '../../assets/global/globalStyles';

const CategoryFilter = (props) => {
    return (
        <ScrollView
            bounces={true}
            horizontal={true}
            style={{ backgroundColor: '#F2F2F2' }}
        >
            <ListItem style={{ margin: 0, padding: 0, borderRadius: 10, }} >
                <TouchableOpacity
                    style={{ borderRadius: 10, }}
                    key={1}
                    onPress={() => {
                        props.categoryFilter('all'), props.setActive(-1)
                    }}
                >
                    <View style={[styles.smallCard, props.active == -1 ? styles.active : styles.inactive]}>
                        <Text style={props.active == -1 ? styles.smallCardTextSelected : styles.smallCardText}>All Items</Text>
                    </View>

                </TouchableOpacity>
                {props.categories.map((item) => (
                    <TouchableOpacity
                        style={{ borderRadius: 10, }}
                        key={item._id}
                        onPress={() => {
                            props.categoryFilter(item._id), props.setActive(props.categories.indexOf(item))
                        }}
                    >
                        <View
                            style={[styles.smallCard,
                            props.active == props.categories.indexOf(item) ? styles.active : styles.inactive
                            ]}
                        >
                            {item.image ? (
                                <Image
                                    style={{ width: 55, height: 55, borderRadius: 5, }}
                                    source={{ uri: item.image }}
                                />
                            ) : (null)}

                            <Text style=
                                {props.active == props.categories.indexOf(item)
                                    ? styles.smallCardTextSelected
                                    : styles.smallCardText}
                            >
                                {item.categName}
                            </Text>
                        </View>

                    </TouchableOpacity>
                ))}

            </ListItem>

        </ScrollView>
    )

}

export default CategoryFilter;


const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    active: {
        backgroundColor: colors.buttons,
    },
    inactive: {
        backgroundColor: colors.grey5,
    },
    smallCard: {
        borderRadius: 10,
        backgroundColor: colors.grey5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        width: 80,
        height: 80,
        margin: 10,
    },
    smallCardTextSelected: {
        fontWeight: 'bold',
        color: colors.cardBackground,
    },
    smallCardText: {
        fontWeight: 'bold',
        color: colors.grey2,
    },
})