import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Card from './Card'

export default function Example() {
    const [products_data, setData] = useState([])
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

    return (
        // // <div>

        // // <div>
        // // {
        // //     products_data.map((item,index)=>(
        // //         <div key={index} className=''>
        // //             <p>{item.id}</p>
        // //             <p>{item.title}</p>
        // //             <p>{item.description}</p>
        // //         </div>

        // //     ))
        // //     }
        //     <button onClick={getdata}>click </button>
        // </div>
        <div className='grid grid-cols-4 gap-2'>
            {/* {
                products_data.map((item, index) => (
                    {
                        ((index) / 2 == 0)) ? <Card product={item} key={index} className='bg-red-500' ></Card> : <Card product={item} key={index} className='bg-green-500'></Card>
                    }

            // <Card product={item} key={index} clas></Card>
            ))
            } */}
            {/* <button onClick={getdata}>click </button> */}
        </div>
    )
}
