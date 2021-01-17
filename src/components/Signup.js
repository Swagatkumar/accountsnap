import React from 'react'
import { StyledFirebaseAuth } from 'react-firebaseui'
import firebase from 'firebase'
import { auth } from '../firebase'

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        {
            provider:firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry: 'IN'
        },
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => {
            return false
        }
    }
}

function Signup() {
    return (
        <>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </>
    )
}

export default Signup
