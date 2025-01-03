import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Clients from '../components/Clients'
import SectionHeading from '../components/SectionHeading'
import Card from '../components/Card'
import BaseButton from '../components/BaseButton'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Services from '../components/Services'
import CardServices from '../components/CardServices'
import ProjectCard from '../components/ProjectCard'
import ContactUs from '../components/ContactUs'
import FAQ from '../components/FAQ'
import SkillCrafterCard from '../components/SkillCrafterCard'

import { Link } from 'react-router'

const Home = () => {





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
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section>
      <Hero />
      <Clients />

      {/* Most Popular Services in Website Design */}
      <div className=''>
        <SectionHeading title="Most Popular Services in" highlight="Website Design" description="Discover our most popular service and get the job done with ease on skillCrafted" />
        <div className="flex gap-5 md:gap-10 justify-center flex-wrap p-5 md:px-10">
          <Card />
          <Card />
          <Card /> 
        </div>
        <BaseButton btnText="View all popular services" />
      </div>


      {/* Explore Our Services Categories */}
      <div className=''>
        <div className='flex flex-col gap-5 text-center my-10'>
          <h2 className='font-bold text-[#141A34] text-2xl md:text-4xl'>
            Explore <span className='text-[#425BF5]'> Our All Services </span> Categories
          </h2>
        </div>


        <div className='flex flex-wrap py-10 md:px-40 justify-center gap-2 md:gap-5'>
          <Services />
        </div>
      </div>


      {/* Check out our latest featrued projects and find the perfect one for your skills and interest! */}
      <div className=''>
        <div className='max-w-screen-md m-auto flex flex-col gap-5 text-center my-10 '>
          <h2 className='font-bold text-[#141A34] text-md md:text-3xl px-5 md:px-0'>
            Check out our <span className='text-[#425BF5]'> latest featrued projects </span> and find <span className='text-[#425BF5]'> the perfect one for your skills </span> and interests!
          </h2>
        </div>

        {/* skillCrafter */}
        <div className='flex  px-3 flex-wrap justify-center md:gap-10 md:px-40 '>
          <ProjectCard limit={5} />
        </div>


        <div className='w-fit m-auto'>
          <Link to='/projects' >
            <BaseButton btnText="View all projects" />
          </Link>
        </div>
      </div>


      {/* We're dedicated to your success. */}
      <div className='relative'>
        <div className='p-3 md:p-10 z-10 relative '>
          <div className='max-w-screen-md m-auto'>
            <div className='flex flex-col gap-5 text-center my-10'>
              <h2 className='font-bold text-[#141A34] text-md md:text-4xl'>
                We're dedicated to your success. Join our community today and
                <span className='text-[#425BF5]  '> discover the power of freelance talent and quality services </span>
              </h2>

            </div>
          </div>

          <div className='flex flex-wrap gap-3 md:px-40 md:gap-10 justify-center '>
            <CardServices />
            <CardServices />
            <CardServices />
            <CardServices />
            <CardServices />
            <CardServices />
          </div>
        </div>
        <div className='absolute top-[370px] z-0 w-full h-[1210px] md:h-[300px] bg-[#F4F5F7]'></div>
      </div>


      {/* Dicover our rising star freelancers and work with the best talent on skillCrafted */}
      <div className=''>
        <div className='max-w-screen-md m-auto flex flex-col gap-5 text-center my-10'>
          <h2 className='font-bold text-[#141A34] text-md md:text-4xl'>
            Dicover our <span className='text-[#425BF5]'> rising star freelancers </span> and work with <span className='text-[#425BF5]'> the best talent </span> on skillCrafted
          </h2>
        </div>

        {/* skillCrafter */}
        <div className='flex px-10 flex-wrap md:px-40 justify-center gap-10'>
          <SkillCrafterCard />
        </div>

        <BaseButton btnText="Explore more skillCrafters" />
      </div>

      {/* Services You Might Like */}
      <div className='bg-[#F4F5F7] mt-10 py-10'>
        <SectionHeading title="Services You" highlight="Might Like" description="Explore services you might like and find your next project" />

        <div className="hidden md:flex gap-5 md:gap-10 justify-center flex-wrap p-5 md:px-10">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>

        <div className="p-5 md:hidden ">
          <Slider {...settings}>
            <Card />
            <Card />
            <Card />

          </Slider>
        </div>

        <BaseButton btnText="View all services" />
      </div>




      {/* 
      <SectionHeading 
        title="Choose the Plan That Works"
        highlight="Best for You" 
      />

      <SectionHeading 
        title="Insights"
        highlight="Best for You" 
      /> */}







      {/* FAQ  */}
      <div>
        <div className='m-auto md:px-40 mt-10'>
          <div className='flex flex-col gap-5 text-center md:py-5'>
            <h2 className='font-bold text-[#141A34] text-xl md:text-4xl'>
              <span className='text-[#425BF5] '> Frequently </span> Asked Questions
            </h2>
          </div>
        </div>

        <div className='md:px-40'>
          <FAQ />

        </div>
      </div>

      <ContactUs />
    </section>
  )
}

export default Home