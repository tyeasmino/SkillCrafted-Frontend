import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import brand from '../assets/brands/Logo.png'
import brand1 from '../assets/brands/Logo1.png'
import brand2 from '../assets/brands/Logo2.png'
import brand3 from '../assets/brands/Logo3.png'
import brand4 from '../assets/brands/Logo4.png'
import brand5 from '../assets/brands/Logo5.png'
import brand6 from '../assets/brands/Logo6.png' 

const Clients = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7, // Initially show 5 slides
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Auto change slider every 2 seconds
    swipe: true, // Enable swipe functionality
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="carousel-container w-full px-10 py-5 md:px-20 md:py-10">
      <Slider {...settings}>
        <div className=' md:px-[40%]'>
          <img src={brand} alt="Slide 1" />
        </div>
        <div className='md:px-[40%]'>
          <img src={brand1} alt="Slide 1" />
        </div>
        <div className=' md:px-[40%]'>
          <img src={brand2} alt="Slide2" />
        </div>
        <div className=' md:px-[40%]'>
          <img src={brand3} alt="Slide3" />
        </div>
        <div className=' md:px-[40%]'>
          <img src={brand4} alt="Slide4" />
        </div>
        <div className=' md:px-[40%]'>
          <img src={brand5} alt="Slide5" />
        </div>
        <div className=' md:px-[40%]'>
          <img src={brand6} alt="Slide6" />
        </div>
      </Slider>
    </div>
  );
}

export default Clients;
