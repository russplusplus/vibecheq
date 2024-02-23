import React, { useEffect, useState, createContext, useContext } from 'react'

const GeneralContext = createContext<{ page: String | null; imageUri: String | null }>({
    page: null,
    imageUri: null,
})

export const GeneralContextProvider = ({children}) => {
    const [page, setPage] = useState<String | null>(null)
    const [imageUri, setImageUri] = useState<String | null>(null)
        
    const value = {
        page,
        setPage,
        imageUri,
        setImageUri
    }

    return (
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    )
}

// export const useGeneralContext = () => {
//     const context = useContext(GeneralContext)
//     if (context === undefined) {
//         throw new Error('useGeneralContext must be used within a UserContextProvider')
//     }
//     return context
// }

