import React from 'react'
import { View, Text, Button } from 'react-native'
import useAuth from '../hooks/useAuth'

const LoginScreen = () => {
    const { signInwithGoogle } = useAuth();
    
    return (
        <View>
            <Text>Login Screen</Text>
            <Button title='login' onPress={signInwithGoogle} />
        </View>
    )
}

export default LoginScreen
