import { NavigationContainer } from '@react-navigation/native';
import tw from 'tailwind-rn';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); //Ignore log notfication by message
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}


