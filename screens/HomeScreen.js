import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useRef } from 'react'
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from 'react-native-deck-swiper';

const DUMMY_DATA = [
    {
        firstName: "Hamza",
        lastName: "Umar",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/41492093?v=4",
        id: 13,
        age: 22,
    },
    {
        firstName: "Seth",
        lastName: "Awaitey",
        job: "Software Developer",
        photoURL: "https://yt3.ggpht.com/ytc/AKedOLQ4j1bcVClqIABtLVEDlXdDrquI7kHYEtafHXLaMQ=s88-c-k-c0x00ffffff-no-rj",
        id: 23,
        age: 27,
    },
    {
        firstName: "Elon",
        lastName: "Musk",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
        id: 12,
        age: 29,
    },
    {
        firstName: "Benjamin",
        lastName: "Batsah",
        job: "Software Developer",
        photoURL: "https://media-exp1.licdn.com/dms/image/C4D03AQF1rKw7KdaHXA/profile-displayphoto-shrink_200_200/0/1543773965292?e=1646870400&v=beta&t=3_ki7tiq4YviXbVqTCPDnIJWsBh2zd9tHLdbvroj50Q",
        id: 3,
        age: 30,
    },
]
const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const swipeRef = useRef(null)

    console.log(user)
    
    useLayoutEffect(() => {
        // navigation.setOptions({
        //     headerShown: false,
        // });
    }, []);

    return (
        <SafeAreaView style={tw("flex-1")}>
            <View style={tw("items-center justify-between flex-row relative p-5")}>
                <TouchableOpacity onPress={logout}>
                    <Image style={tw("h-10 w-10 rounded-full")} source={{ uri: user.photoURL }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image style={tw("h-14 w-14")} source={require("../logo.png")} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name='chatbubbles-sharp' size={30} color="#ff5864" />
                </TouchableOpacity>
            </View>
            {/* End Of Header */}

            {/* Main Cards*/}
            <View style={tw("flex-1 -mt-6")}>
                <Swiper 
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={DUMMY_DATA}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={() => {
                        console.log("match pass")
                    }}
                    onSwipedRight={() => {
                        console.log("match")
                    }}
                    backgroundColor={'#4fb0e9'}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "#ff0000",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4ded30",
                                },
                            },
                        },
                    }}
                    renderCard={card => (
                        <View 
                            key={card.id}
                            style={tw("bg-white h-3/4 relative rounded-xl")}
                        >
                            <Image style={tw("absolute top-0 h-full w-full rounded-xl")} source={{ uri: card.photoURL }} />
                            <View 
                                style={[
                                    tw("absolute bottom-0 bg-white w-full h-20 flex-row items-center justify-between px-6 py-2 rounded-b-xl"), 
                                    styles.cardShadow
                                ]}
                            >
                                <View>
                                    <Text style={tw("text-xl font-bold")}>{card.firstName} {card.lastName}</Text>
                                    <Text>{card.job}</Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            {/*  */}
            <View style={tw("flex-row items-center justify-evenly pb-2")}>
                <TouchableOpacity 
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}
                >
                    <Entypo name='cross' size={24} color={"red"}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()} 
                    style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}>
                    <AntDesign name='heart' size={24} color={"green"}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen


const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height:1,
        },
        shadowOpacity: .2,
        shadowRadius: 1.41,
        elevation: 2,
    }
})

