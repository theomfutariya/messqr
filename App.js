import React, {useState, useEffect} from 'react';
import HomeScreen from './src/screens/Home';
import Login from './src/screens/Login';
import Pay from './src/screens/Pay';
import Scan from './src/screens/Scan';
import {Text, Button, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {getItemByKey, storeItem, clearAll} from './src/AsyncStorage';
import {getAdmins, signOut} from './src/firebase';
import {LogBox} from 'react-native';
import {useStore} from './src/store/';
import Admin from './src/screens/Admin';
import Inventory from './src/screens/Inventory';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator();
const ACTIVE_ICON = '#444444';
const INACTIVE_ICON = '#b4b4b4';

const AppStack = () => {
  const {signOut} = useStore();
  const isAdmin = useStore(state => state.isAdmin);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <Icon
              name="home-filled"
              color={focused ? ACTIVE_ICON : INACTIVE_ICON}
            />
          ),
          tabBarShowLabel: false,
          headerTitleAlign: 'center',
          headerRight: () => (
            <Icon
              raised
              size={15}
              name="logout"
              color="#B00D23"
              onPress={() => {
                signOut();
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarLabel: 'Scan',
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="qr-code"
              color={focused ? ACTIVE_ICON : INACTIVE_ICON}
            />
          ),
          headerTitleAlign: 'center',
        }}
      />
      {isAdmin && (
        <>
          <Tab.Screen
            name="Admin"
            component={Admin}
            options={{
              tabBarHideOnKeyboard: true,
              tabBarLabel: 'Scan',
              tabBarShowLabel: false,
              tabBarIcon: ({focused}) => (
                <Icon
                  name="admin-panel-settings"
                  color={focused ? ACTIVE_ICON : INACTIVE_ICON}
                />
              ),
              headerTitleAlign: 'center',
            }}
          />
          <Tab.Screen
            name="Inventory"
            component={Inventory}
            options={{
              tabBarLabel: 'Scan',
              tabBarShowLabel: false,
              tabBarIcon: ({focused}) => (
                <Icon
                  name="inventory"
                  color={focused ? ACTIVE_ICON : INACTIVE_ICON}
                />
              ),
              headerTitleAlign: 'center',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarLabel: 'Login',
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <Icon name="login" color={focused ? ACTIVE_ICON : INACTIVE_ICON} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Pay"
        component={Pay}
        options={{
          tabBarLabel: 'Pay',
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="payment"
              color={focused ? ACTIVE_ICON : INACTIVE_ICON}
            />
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const isLoggedIn = useStore(state => state.isLoggedIn);
  const setUserState = useStore(state => state.setUser);
  const user = useStore(state => state.user);

  return (
    <NavigationContainer>
      {user !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
  headerButton: {
    marginRight: 20,
  },
});
