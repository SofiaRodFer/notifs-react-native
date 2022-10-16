import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from './pages/inicio';
import FinalScreen from './pages/final';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="InicioScreen" component={InicioScreen} />
        <Stack.Screen name="FinalScreen" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;