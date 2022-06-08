import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import ItemsContainer from './Screens/Items/ItemsContainer';
import { NativeBaseProvider, NativeBaseConfigProvider } from 'native-base'
import Header from './Shared/Header';
import { NavigationContainer } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

// Redux
import { Provider } from 'react-redux';
import { store } from './Redux/store';

// Context API
import Auth from './Context/store/Auth';

// Navigators
import MainNavigator from './Navigators/MainNavigator';

LogBox.ignoreAllLogs(true);

// import ItemsContainer from './Screens/Items/ItemsContainer '
export default function App() {
  // const toast = useRef(null);
  return (
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider>
          <NavigationContainer>

            <Header />
            <MainNavigator />
            <Toast ref={(ref) => Toast.setRef(ref)} />

          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
  );
}