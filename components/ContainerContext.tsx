import React, { useEffect, useState, createContext, useContext } from 'react'

type UserData = {
    favorite?: any,
    phoneNumber: string,
    inbox: any,
    settings: any,
    unbanTime?: number,
    vibeRecord?: any
}

type ContainerContext = {
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>
    userData: UserData, 
    setUserData: React.Dispatch<React.SetStateAction<UserData>>, 
    page: string, 
    setPage: React.Dispatch<React.SetStateAction<string>>,
    capturedImageUri: string,
    setCapturedImageUri: React.Dispatch<React.SetStateAction<string>>,
    respondingTo: string,
    setRespondingTo: React.Dispatch<React.SetStateAction<string>>
}

// initial value provided here is what you get if you try to consume context outside of the provider
const ContainerContext = createContext<ContainerContext | null>(null)

export const ContainerContextProvider = (props: any) => {
    const [user, setUser] = useState<any>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [page, setPage] = useState<string>('CameraPage')
    const [capturedImageUri, setCapturedImageUri] = useState<string>('')
    const [respondingTo, setRespondingTo] = useState<string>('')

    const value = {
        user,
        setUser,
        userData,
        setUserData,
        page,
        setPage,
        capturedImageUri,
        setCapturedImageUri,
        respondingTo,
        setRespondingTo
    }

    return <ContainerContext.Provider value={value} {...props}/>
}

export const useContainerContext = () => {
    const context = useContext(ContainerContext)
    if (!context) {
        throw new Error('useContainerContext must be used within a ContextProvider')
    }
    return context
}
