import React from 'react'

export default function useproduct() {

    useEffect(() => {
        const getdata = async () => {
            try {
                const response = await axios.get('https://dummyjson.com/products')
                console.log(response.data.products)
                setData(response.data.products)
            } catch (error) {
                console.log(error)
            }
        }
        getdata()
    }, [])

}
