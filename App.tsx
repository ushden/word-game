import React, {FunctionComponent} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import GameScreen from './src/screens/GameScreen';
import {levels} from './src/data/levels';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Game"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4f46e5',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="Game"
          component={GameScreen as FunctionComponent}
          initialParams={{levels}}
          options={{
            title: 'Український Шифр',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}