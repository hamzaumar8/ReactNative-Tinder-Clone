import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import tw from 'tailwind-rn'
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

const ModalScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    const incompleteForm = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        }).then(() => {
            navigate.navigate("Home");
        }).catch(error => {
            Alert(error.message);
        });
    }

    return (
        <View style={tw("flex-1 items-center pt-1")}>
            <Image
                style={tw("h-20 w-full")}
                resizeMode="contain"
                source={{ uri: "https://links.papareact.com/2pf" }}
            />
            <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Welcome {user.displayName}</Text>

            <Text 
                style={tw("text-center text-red-400 p-4 font-bold")}
            >step 1: The Profile Pic</Text>
            <TextInput
                value={image}
                onChangeText={setImage} 
                style={tw("text-center text-xl pb-2")} 
                placeholder='Enter a profile URL' 
            />

            <Text
                style={tw("text-center text-red-400 p-4 font-bold")}
            >step 1: The Job</Text>
            <TextInput 
                value={job}
                onChangeText={setJob}
                style={tw("text-center text-xl pb-2")} 
                placeholder='Enter your occupation' 
            />

            <Text
                style={tw("text-center text-red-400 p-4 font-bold")}
            >step 1: The Age</Text>
            <TextInput 
                value={age}
                onChangeText={setAge}
                maxLength={2} 
                keyboardType='numeric' 
                style={tw("text-center text-xl pb-2")} placeholder='Enter your age' 
            />

            <TouchableOpacity 
                disabled={incompleteForm}
                style={[tw("w-64 p-3 rounded-3xl absolute bottom-10"), incompleteForm ? tw('bg-gray-400') : tw("bg-red-400")]}
                onPress={updateUserProfile}
            >
                <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen
