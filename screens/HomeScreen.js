import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn'
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

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
    const [profiles, setProfiles] = useState([])
    const swipeRef = useRef(null);
    
    useLayoutEffect(
        () =>  onSnapshot(
            doc(db, 'users', user.uid), (snapshot) => {
                if(!snapshot.exists()) {
                    navigation.navigate("Modal");
                }
            }
        ), 
    []);
    
    useEffect(() => {
        let unsub;
        const fetchCards = async () => {

            const passes = await getDocs(
                collection(db, 'users', user.uid, 'passes'))
                .then((snapshot) => 
                    snapshot.docs.map((doc)=> doc.id)
            );
            
            const swipes = await getDocs(
                collection(db, 'users', user.uid, 'swipes'))
                .then((snapshot) => 
                    snapshot.docs.map((doc)=> doc.id)
            );
            
            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

            // console.log([...passedUserIds, ...swipedUserIds])

            unsub = onSnapshot(
                query(
                    collection(db, 'users'), 
                    where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
                ), 
                snapshot => {
                    setProfiles(
                        snapshot.docs
                        .filter((doc) => doc.id !== user.uid)
                        .map((doc) => ({
                            id: doc.id, 
                            ...doc.data(),
                        }))
                    );
                }
            );
        }
        fetchCards();
        return unsub;
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You Swiped Pass on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    };
    
    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];

        const loggedInProfile = await ( await getDoc(doc(db, 'users', user.uid))).data();

        // Check if the user swiped on you
        getDoc(doc(db, "users", userSwiped.id, 'swipes', user.uid)).then(
            (documentSnapshot) => {
                
                if (documentSnapshot.exists()) {
                    // user has mached with you before you matched with them ...
                    // Create a Match
                    console.log(`Hooray,You MATCHED with ${userSwiped.displayName}`);

                    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);

                    // Create a Match
                    setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp(),
                    });

                    // Navigate to Match Page
                    navigation.navigate("Match", {
                        loggedInProfile, 
                        userSwiped,
                    });

                }else {
                    // user has swiped as first interaction between the two or didt get swiped on
                    console.log(`You swiped on  ${userSwiped.displayName} (${userSwiped.job})`);
                    
                    setDoc(
                        doc(db, "users", user.uid, "swipes", userSwiped.id),
                        userSwiped
                    );
                }
            }
        )

        console.log(`You Swiped Match on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
    }
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
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        // console.log("match pass")
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        // console.log("match")
                        swipeRight(cardIndex);
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
                    renderCard={card => card ? (
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
                                    <Text style={tw("text-xl font-bold")}>{card.displayName}</Text>
                                    <Text>{card.job}</Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"), styles.cardShadow]}>
                            <Text style={tw("font-bold pb-5")}>No more Profiles</Text>

                            <Image 
                                style={tw("h-20 w-full")}
                                height={100}
                                width={100}
                                source={{ uri: "https://links.papareact.com/6gb" }}
                            />
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

