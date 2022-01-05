import React from 'react'
import { View, Text, Button } from 'react-native'
import useAuth from '../hooks/useAuth'

const LoginScreen = () => {
    const { signInwithGoogle, loading } = useAuth();
    
    return (
        <View>
            <Text>{loading ? "Loading.." : "Login Screen"}</Text>
            <Button title='login' onPress={signInwithGoogle} />
        </View>
    )
}

export default LoginScreen
