import React, { useState } from 'react'

export default function Card({ product }) {
    console.log('product from card :', product)
    // const [products, setproducts]=useState
    return (
        <div className='w-56 '>
            <div className='flex flex-col bg-gray-500 p-4 space-y-2 items-center w-full m-2'>
                <p className='text-white font-bold'>{product.id}</p>
                <p className='text-white font-extrabold'>{product.title}</p>
                <p className='text-zinc-400'>{product.description}</p>
            </div>

        </div>
    )
}
