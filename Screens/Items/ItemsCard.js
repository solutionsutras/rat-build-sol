import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../../assets/global/globalStyles';
import { controls } from '../../assets/global/controls';
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import EasyButton from '../../Shared/StyledComponents/EasyButton';

var { width } = Dimensions.get('window');

const ItemsCard = (props) => {
  const {
    itemName,
    image,
    quality,
    rates,
    ratings,
    numOfReviews,
    isAvailable,
    key
  } = props;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{ uri: image }}
      />
      <View style={styles.card} />
      <Text style={styles.titleBold}>
        {itemName.length > 25
          ? itemName.substring(0, 25 - 3) + '...'
          : itemName}
      </Text>

      <Text style={styles.title}>
        Quality:{' '}
        {quality.qualityName.length > 25
          ? quality.qualityName.substring(0, 25 - 3) + '...'
          : quality.qualityName}
      </Text>

      <View style={styles.priceContainer}>
        {rates.map((r) => {
          return (
            <Text style={styles.price}>
              {controls.currency}
              {r.cost} / {r.unit.unitName.split('(')[0]}
            </Text>
          );
        })}
      </View>
      <View style={styles.ratingsContainer}>
        <Text style={styles.ratingsText}>Ratings: {ratings}</Text>
        <Text style={styles.ratingsText}>Reviews: {numOfReviews}</Text>
      </View>
      {/* {(isAvailable === true) ? (
                <View style={{ marginBottom: 60, }}>
                    <EasyButton medium primary
                        onPress={() => {
                            props.addItemToCart(props),
                                Toast.show({
                                    topOffset: 60,
                                    type: "success",
                                    text1: `${itemName} added to cart`,
                                    text2: "Go to your cart to complete your order"
                                })
                        }}
                    >
                        <Text style={{ color: 'white', }}>Add to Cart</Text>
                    </EasyButton>
                </View>
            ) : <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
            } */}
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(actions.addToCart({ item })),
  };
};

export default connect(null, mapDispatchToProps)(ItemsCard);

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    height: width / 1.3,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: 'center',
    elevation: 8,
    backgroundColor: '#EEE',
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 5,
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 40,
    width: width / 2 - 20 - 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  titleBold: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  priceContainer: {
    marginTop: 10,
    backgroundColor: colors.grey5,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  price: {
    fontSize: 13,
    marginTop: 2,
    color: colors.buttons,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  ratingsText: {
    fontSize: 12,
  },
});
