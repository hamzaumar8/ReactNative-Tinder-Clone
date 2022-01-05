import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, Button } from 'react-native'
import useAuth from '../hooks/useAuth';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();
    return (
        <View>
            <Text>I am the home screen</Text>
            <Button title='Go to Chat Screen' onPress={() =>navigation.navigate('Chat') }/>
            <Button title='logout' onPress={logout}/>
        </View>
    )
}

export default HomeScreen
