'use client';

import dynamic from 'next/dynamic';
import { useDispatch } from 'react-redux';
import { setInitialState } from '@/lib/slices/cartSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '@/components/services/baseUrl';

const SellingCategory = dynamic(() => import('@/components/sellingCategory/SellingCategory'));
const HeaderBanner = dynamic(() => import('../components/headerBanner/page'));
const ServiceMoto = dynamic(() => import('../components/serviceMoto/page'));
const Subscription = dynamic(() => import('../components/subscription/page'));
const NewArrival = dynamic(() => import('@/components/newArrival/NewArrival'));
const FeatureProduct = dynamic(() => import('@/components/FeatureProducts/FeatureProduct'));
const VideoGallery = dynamic(() => import('@/components/VideoGallery/page'));
const ProductShowcase = dynamic(() => import('@/components/ProductShowcase/page'));

export default function Home() {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [toggles, setToggles] = useState({
    webFeature: false,
    webArrival: false,
    webSellingCategory: false,
    webVideo: false,
    webProductShowCase: false,
    webNewsLetter: false,
    webBestDeal: false,
    mobileFeature: false,
    mobileArrival: false,
    mobileSellingCategory: false,
    mobileVideo: false,
    mobileProductShowCase: false,
    mobileNewsLetter: false,
    mobileBestDeal: false,
  });

  useEffect(() => {
    const fetchToggleStates = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/toggle/toggleStates`);
        const data = response.data;
        if (data && typeof data === 'object') {
          setToggles(data);
        } else {
          console.error('Unexpected response data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching toggle states:', error);
      }
    };

    fetchToggleStates();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="overflow-x-hidden min-h-screen">
      <HeaderBanner />
      <div className="hidden md:grid">
        <ServiceMoto />
      </div>

      {!isMobile ? (
        <>
          {toggles.webSellingCategory && <SellingCategory />}
          {toggles.webArrival && <NewArrival />}
          {toggles.webVideo && <VideoGallery />}
          {toggles.webProductShowCase && <ProductShowcase />}
          {toggles.webFeature && <FeatureProduct />}
          {toggles.webNewsLetter && <Subscription />}
        </>
      ) : (
        <>
          {toggles.mobileSellingCategory && <SellingCategory />}
          {toggles.mobileArrival && <NewArrival />}
          {toggles.mobileVideo && <VideoGallery />}
          {toggles.mobileProductShowCase && <ProductShowcase />}
          {toggles.mobileFeature && <FeatureProduct />}
          {toggles.mobileNewsLetter && <Subscription />}
        </>
      )}
    </main>
  );
}
