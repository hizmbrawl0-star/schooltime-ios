import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import ScheduleSetupScreen from './src/screens/ScheduleSetupScreen';
import RoomsSetupScreen from './src/screens/RoomsSetupScreen';
import TimeSetupScreen from './src/screens/TimeSetupScreen';

const Stack = createNativeStackNavigator();

const navOptions = {
  headerStyle: { backgroundColor: '#111' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: 18, letterSpacing: 0.5 },
  headerBackTitleVisible: false,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={navOptions}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ГЛАВНОЕ МЕНЮ' }} />
          <Stack.Screen name="ScheduleSetup" component={ScheduleSetupScreen} options={{ title: 'РАСПИСАНИЕ' }} />
          <Stack.Screen name="RoomsSetup" component={RoomsSetupScreen} options={{ title: 'КАБИНЕТЫ' }} />
          <Stack.Screen name="TimeSetup" component={TimeSetupScreen} options={{ title: 'ВРЕМЯ ЗВОНКОВ' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
