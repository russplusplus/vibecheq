import React, { useEffect, useState, createContext, useContext } from 'react'
// import { Session, User } from '@supabase/supabase-js'
// import { supabase } from '../lib/supabase'

const UserContext = createContext<{ user: any, setUser: any }>({
    user: null,
    setUser: null
})

export const UserContextProvider = (props: any) => {
    const [user, setUser] = useState<any>(null)

    async function init() {
        // const { data, error } = await supabase.auth.getSession()
        // if (error) {
        //     throw new Error(error.message)
        // }
        // setSession(data.session)
        // setUser(data.session?.user ?? null)
    }

    useEffect(() => { 
        // init()

        // const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        //     setSession(session)
        //     setUser(session?.user ?? null)
        //     console.log('event:', event)

        //     if (event === 'INITIAL_SESSION') {
        //         console.log('initial session')
        //     } else if (event === 'SIGNED_IN') {
        //         console.log('signed in')
        //     } else if (event === 'SIGNED_OUT') {
        //         console.log('signed out')
        //     } else if (event === 'PASSWORD_RECOVERY') {
        //         console.log('password recovery')
        //     } else if (event === 'TOKEN_REFRESHED') {
        //         console.log('token refreshed')
        //     } else if (event === 'USER_UPDATED') {
        //         console.log('user updated')
        //     }

        // })
        // console.log('subscription:', subscription)
        // // the type of subscription allows null, which could cause an error. The ! non-null assertion operator tells TypeScript to trust you.
        // return () => {
        //     subscription!.unsubscribe()
        // }
        
    }, [])

    const value = {
        user,
        setUser
    }

    return <UserContext.Provider value={value} {...props}/>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserContextProvider')
    }
    return context
}
