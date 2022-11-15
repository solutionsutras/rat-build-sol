import { StyleSheet, Text, View } from 'react-native';
import { center, Box, Select, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';

const NewTransaction = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={styles.buttonContainer}>
        <Text>Go to transaction page</Text>
        <EasyButton
          extralarge
          primary
          onPress={() => {
            // props.navigation.navigate('NewTransaction')
        }}
        >
          <Icon
            mr="2"
            size="6"
            color="white"
            as={<MaterialIcons name="add" />}
          />
          <Text style={styles.buttonText}>New transaction</Text>
        </EasyButton>
      </View>
    </View>
  );
};

export default NewTransaction;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    marginBottom: 80,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
