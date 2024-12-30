import React from 'react'
import heroImg from '../assets/hero.jpg'
import { CiSearch } from "react-icons/ci";



const Hero = () => {
  return (
    <section>
        <div className='md:flex items-center gap-40 p-5 md:p-10 justify-between'>
            <div className="md:w-1/2 md:mx-40 flex flex-col gap-5 md:gap-10">
                <h2 className='text-3xl md:text-5xl text-center md:text-start  font-bold'>The Ultimate Destination for <span className='text-[#425BF5]'>Freelance Talent</span> and <span className='text-[#425BF5]'>Quality Services!</span> </h2>
                <p className=' max-w-lg text-center md:text-start text-[#626677] ' >Whether you're a business owner or a freelancer, skillCrafted is your one-stop-solution for finding or offering freelance services. Join Our community today and start getting things done!</p>

                <div>                    
                    <form class="text-center flex flex-col md:flex-row items-center max-w-lg gap-3  ">    
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <CiSearch />
                            </div>
                            <input type="text" id="voice-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="What are you looking for?" required />
                            <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"/>
                                </svg>
                            </button>
                        </div>
                        <button type="submit" class="text-slate-200 font-semibold text-lg bg-[#425BF5] px-5 py-1 pb-2 border border-[#425BF5] rounded-md hover:text-[#425BF5] hover:bg-transparent    focus:ring-4 focus:outline-none focus:ring-blue-300  ">
                            Search
                        </button>
                    </form>
                
                    <div className='hidden md:block text-[#425BF5] text-sm mt-3'>
                        <span className='text-gray-400'>Popular search:</span> 
                        <span className='mx-3'>Graphic Designer</span>
                        <span className='mx-3'>Presentation Design</span>
                        <span className='mx-3'>Web Development</span>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 my-10 md:my-0">
                <img className='md:w-[600px] md:h-[600px] object-cover ' src={heroImg} alt="" />
            </div>
        </div>
    </section>
  )
}

export default Hero