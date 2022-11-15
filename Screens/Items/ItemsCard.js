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
import { TouchableOpacity } from 'react-native';

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
    key,
  } = props;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{ uri: image }}
      />
      <View style={styles.card} />

      <View style={styles.titleView}>
        <Text style={styles.titleBold}>
          {itemName.length > 25
            ? itemName.substring(0, 25 - 3) + '...'
            : itemName}{' '}
        </Text>

        <Text style={styles.title}>
          (Type:{' '}
          {quality.qualityName.length > 25
            ? quality.qualityName.substring(0, 25 - 3) + '...'
            : quality.qualityName}
          )
        </Text>
      </View>

      <View>
        <View style={[styles.priceContainer]}>
          {rates.map((r) => {
            return (
              <View style={{}}>
                <Text style={[styles.price, styles.priceView]}>
                  {controls.currency}
                  {r.cost}/{r.unit.unitName.split('(')[0]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.ratingsContainer}>
        <Text style={styles.ratingsText}>Ratings: {ratings}</Text>
        <Text style={styles.ratingsText}>Reviews: {numOfReviews}</Text>
      </View>

      {isAvailable === true ? (
        <View
          style={{
            marginVertical: 20,
            alignSelf: 'flex-start',
            borderWidth: 0.5,
            borderColor: colors.grey3,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}
        >
          <View>
            <Text
              style={{
                color: colors.grey2,
              }}
            >
              Select this item
            </Text>
          </View>
        </View>
      ) : (
        <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>
      )}
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
    width: width / 2 - 10,
    height: width / 1.25,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 5,
    alignItems: 'center',
    elevation: 8,
    backgroundColor: '#EEE',
  },
  image: {
    width: width / 2 - 30,
    height: width / 2 - 50,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 5,
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 60,
    width: width / 2 - 30,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    textAlign: 'center',
  },
  titleBold: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  priceContainer: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 5,
    // paddingVertical: 5,
  },
  priceView: {
    flexWrap: 'wrap',
  },
  price: {
    backgroundColor: colors.grey5,
    padding: 5,
    fontSize: 12,
    marginHorizontal: 1,
    color: colors.buttons,
    borderWidth: 0.5,
    borderColor: colors.grey4,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  ratingsText: {
    fontSize: 12,
  },
});
