import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth'
import tw from 'tailwind-rn'

const LoginScreen = () => {
    const { signInwithGoogle, loading } = useAuth();
    const navigation = useNavigation();
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
                resizeMode="cover" 
                style={tw("flex-1")} 
                source={{ uri: 'https://tinder.com/static/tinder.png' }}
            >
                <TouchableOpacity 
                    style={[tw("absolute bottom-40 w-52 p-4 rounded-3xl bg-white"),{ marginHorizontal: "25%"}]} 
                    onPress={signInwithGoogle}
                >
                    <Text style={tw("font-semibold text-center")}>Sign in & get Swipping</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default LoginScreen
