import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Google from 'expo-google-app-auth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({});

const config = {
    androidClientId: '507308419326-ep3ap99ntdm3rpo2bs5mjr4gb6dro3fc.apps.googleusercontent.com',
    iosClientId: '507308419326-lp46omshh5gca8q31dhakq7dccud2lij.apps.googleusercontent.com', 
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {

    const [error, setError] = useState(null);
    const [user, setUser] = useState(null)
    const [loadingInitial, setLoadingInitial] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(
        () =>  onAuthStateChanged(auth, (user) => {
            if (user) {
                //  logged In
                setUser(user)
            }else{
                // Not Logged In 
                setUser(null);
            }
            setLoadingInitial(false)
        }), 
        []
    );

    // authentication part 
    const signInwithGoogle = async () => {
        setLoading(true);
        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === "success"){
                // login ..
                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);

                await signInWithCredential(auth, credential)
            }
            return Promise.reject();
        })
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }

    const logout =  () => {
        setLoading(true);
        signOut(auth).catch(error => setError(error)).finally(() => setLoading(false));
    }
    return (
        <AuthContext.Provider 
            value={{
                user,
                loading,
                error,
                signInwithGoogle,
                logout,
            }}
        >
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}