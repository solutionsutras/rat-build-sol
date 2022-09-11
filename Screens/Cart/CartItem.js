import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { Image } from 'native-base';
import { connect } from 'react-redux';
import { controls } from '../../assets/global/controls';
import * as actions from '../../Redux/Actions/cartActions';
import { colors } from '../../assets/global/globalStyles';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const CartItem = (props) => {
  const data = props.item;
  const [item, setItem] = useState(props.item.item);
  const [qty, setQty] = useState(props.item.qty);
  const [rate, setRate] = useState(props.item.rate);
  const [unitValue, setUnitValue] = useState(props.item.selectedUnit);
  const [unitName, setUnitName] = useState(props.item.unitName);
  const [vehicle, setVehicle] = useState(props.item.vehicle);
  const [fromLocationCode, setFromLocationCode] = useState(
    props.item.fromLocationCode
  );
  const [toLocationCode, setToLocationCode] = useState(
    props.item.toLocationCode
  );
  const [tripDistance, setTripDistance] = useState(props.item.tripDistance);
  const [minTripDistance, setMinTripDistance] = useState(
    props.item.minTripDistance
  );
  const [kmWiseFare, setKmWiseFare] = useState(props.item.kmWiseFare);
  const [materialCost, setMaterialCost] = useState(props.item.materialCost);
  const [transportationCost, setTransportationCost] = useState(
    props.item.transportationCost
  );

  const [itemTotal, setItemTotal] = useState(props.item.itemTotal);

  useEffect(() => {
    return () => {};
  }, []);

  console.log(data);

  return (
    <ListItem style={styles.listItem} key={Math.random()}>
      <View style={styles.cartBody}>
        <View style={styles.inLine}>
          <Image
            alt={data.item.itemName}
            style={{ marginTop: 10 }}
            source={{
              uri: data.item.image
                ? data.item.image
                : 'https://public.solutionsutras.com/rat/images/no-item-image.png',
            }}
            size={20}
            resizeMode={'contain'}
          />
          <View>
            <Text style={styles.contentTextBold}>
              Item: {data.item.itemName}
            </Text>
            <Text style={styles.contentTextGrey}>
              Quality: {data.item.quality.qualityName}
            </Text>
          </View>
        </View>
        <View style={styles.cartBody}>
          <Text style={styles.contentHeading}>Pricing Details</Text>
          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>Quantity:</Text>
            <Text style={styles.contentTextSmall}>
              {qty} {unitName.split('(')[0]}
            </Text>
          </View>
          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>
              Rate (per {unitName.split('(')[0]}):
            </Text>
            <Text style={styles.contentTextSmall}>
              {controls.currency}
              {rate}
            </Text>
          </View>
          <View style={[styles.inLinePrice, styles.totals]}>
            <Text style={styles.contentTextBold}>Material Cost:</Text>
            <Text style={styles.contentTextBold}>
              {controls.currency}
              {materialCost}
            </Text>
          </View>
          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>Vehicle Selected:</Text>
            <Text style={styles.contentTextSmall}>
              {vehicle.brand} - {vehicle.model}
            </Text>
          </View>

          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>Vehicle Fare: </Text>
            <Text style={styles.contentTextSmall}>
              {controls.currency}{' '}
              {tripDistance < minTripDistance ? vehicle.minFare : kmWiseFare}
            </Text>
          </View>

          <View style={[styles.inLinePrice, {justifyContent:'flex-start'}]}>
            {tripDistance < minTripDistance ? (
              <Text style={[styles.contentTextSmall, { fontSize: 10 }]}>
                (Minimum Fare - {controls.currency}
                {vehicle.minFare} applied as Trip Distance ({tripDistance}KM) is
                less than our minimum condition of {minTripDistance} KM)
              </Text>
            ) : (
              <Text style={[styles.contentTextSmall, { fontSize: 10 }]}>
                (Unit Fare - {controls.currency}
                {vehicle.farePerKm}/KM X Trip Distance - {tripDistance} KM)
              </Text>
            )}
          </View>
          {/* {tripDistance < minTripDistance ? (
            <View>
              <View style={styles.inLinePrice}>
                <Text style={[styles.contentTextSmall, { fontSize: 10 }]}>
                  (Unit Fare - {controls.currency}
                  {vehicle.farePerKm}/KM X Distance - {tripDistance} KM):
                </Text>
                <Text style={styles.contentTextSmall}>Vehicle Fare: </Text>
                <Text style={styles.contentTextSmall}>
                  {controls.currency}
                  {kmWiseFare}
                </Text>
              </View>
              <View style={styles.inLinePrice}>
                <Text style={[styles.contentTextSmall, { fontSize: 10 }]}>
                  (Unit Fare - {controls.currency}
                  {vehicle.farePerKm}/KM X Distance - {tripDistance} KM):
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.inLinePrice}>
              <Text style={styles.contentTextSmall}>Min Fare:</Text>
              <Text style={styles.contentTextSmall}>
                {controls.currency}
                {vehicle.minFare}
              </Text>
            </View>
          )} */}

          <View style={styles.inLinePrice}>
            <Text style={styles.contentTextSmall}>Load Unload Cost:</Text>
            <Text style={styles.contentTextSmall}>
              {controls.currency}
              {vehicle.loadUnloadCost}
            </Text>
          </View>

          {vehicle.tollApplicable && vehicle.tollTax ? (
            <View style={styles.inLinePrice}>
              <Text style={styles.contentTextSmall}>Toll Tax:</Text>
              <Text style={styles.contentTextSmall}>
                {controls.currency}
                {vehicle.tollTax}
              </Text>
            </View>
          ) : null}

          <View style={[styles.inLinePrice, styles.totals]}>
            <Text style={styles.contentTextBold}>Transport Cost:</Text>
            <Text style={styles.contentTextBold}>
              {controls.currency}
              {transportationCost}
            </Text>
          </View>
          <View style={[styles.inLinePrice, styles.grandTotals]}>
            <Text style={styles.contentTextBold}>Item Total:</Text>
            <Text style={styles.contentTextBold}>
              {controls.currency}
              {itemTotal}
            </Text>
          </View>
          <View>
            <EasyButton
              medium
              danger
              onPress={() => {
                props.removeFromCart(data),
                  Toast.show({
                    topOffset: 60,
                    type: 'error',
                    text1: `${item.itemName} removed from cart`,
                    text2: 'Go to your cart to complete your order',
                  });
              }}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="trash"
                type="font-awesome"
                color={'white'}
                size={20}
              />
              <Text style={{ color: 'white' }}>Remove</Text>
            </EasyButton>
          </View>
        </View>
      </View>
    </ListItem>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBody: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#CCC',
    marginBottom: 0,
    padding: 0,
  },
  contentHeading: {
    textTransform: 'uppercase',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  inLine: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 10,
  },
  inLinePrice: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  totals: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 5,
  },
  grandTotals: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 10,
  },
  contentTextSmall: {
    fontSize: 12.3,
    marginRight: 5,
    marginBottom: 3,
  },
  contentTextGrey: {
    fontSize: 16,
    color: colors.grey3,
  },
  contentTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    marginBottom: 5,
  },
});
