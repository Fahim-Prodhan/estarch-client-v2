'use client'

import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from 'axios';
import baseUrl from '../services/baseUrl';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { openProductModal } from '@/lib/slices/productModalSlice';
import ProductModal from '../ProductModal/page';
export default function RelatedProductsSinglePage() {
  const [products, setProducts] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    axios.get(`${baseUrl}/api/products/feature-products`)
      .then(res => {
        setProducts(res.data);
      })
      .catch(() => {
      });
  }, []);

  return (
    <div>
      <div className="slider-container mx-0 lg:mx-20">
        <h1 className='text-center mb-4 mt-8 font-bold md:text-2xl text-xl uppercase'>You May Also Like</h1>

        <div className="col-span-10 gap-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product?._id}
              className="card card-compact bg-base-200 shadow-lg rounded-none h-[350px] md:h-full relative"
            ><Link href={`/product/${product?.productName}?sku=${product?.SKU}`}>
                <figure>
                  <Image src={product?.images[0]} alt={product?.productName} width={500}
                    height={700} />
                </figure>
                <div className="pt-1 lg:px-6 px-2">
                  <h2 className="md:text-[18px] text-[14px] font-bold text-center">
                    {product?.productName.length > 22
                      ? `${product?.productName.slice(0, 22)}...`
                      : product?.productName
                    }</h2>
                  <div className='text-center'>
                    <div className="absolute md:relative bottom-10 md:bottom-0 left-6 md:left-0">
                      <p className={`bg-black text-white text-sm md:text-[16px] mt-2 w-full md:w-[50%] mx-auto mb-2 ${product?.regularPrice - product?.salePrice > 0 ? 'visible' : 'invisible'}`}>
                        Save Tk. {product?.regularPrice - product?.salePrice}
                      </p>
                      {
                        product?.regularPrice - product?.salePrice > 0 && (
                          <p className='my-1 text-[16px] md:text-[20px] text-black text-center'>
                            <span>TK.</span>{product?.salePrice}
                            <span className='md:text-[17px] text-sm line-through text-red-500'> Tk.{product?.regularPrice}</span>
                          </p>
                        )
                      }
                    </div>

                    {product?.regularPrice - product?.salePrice <= 0 && (
                      <p className='my-1 text-[17px] md:text-[20px] text-black text-center absolute md:relative bottom-10 md:bottom-0 left-12 md:left-0'>
                        <span className=''>TK.</span>{product?.salePrice}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <div className='text-center shadow-lg absolute w-full bottom-0 md:relative '>

              <button onClick={() => {dispatch(openProductModal(product))}} className=" bg-[#1E201E] text-white w-full md:py-2 py-1">BUY NOW</button>

              </div>
            </div>
          ))}
        
        </div>
      </div>
      <ProductModal />

    </div>
  )
}
