import React from 'react'
import writing from '../assets/services/01.writing.jpeg'
import user1 from '../assets/profiles/user1.jpg'
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";


const Card = () => {
  return (
    <section>
        <div className='card flex gap-3 w-full md:w-[300px] rounded-md shadow-md p-3 md:p-8 '>
            <div className="">
                <img className='rounded-md' src={writing} alt="" />
            </div>
            <div className="flex flex-col gap-1 md:gap-3">
                <h6 className='text-sm text-[#626677]'>Writing and Translation</h6>
                <h2 className='text-[#141A34] font-bold md:text-xl '>Professional Blog Writing</h2>
                <div className='flex items-center gap-5'>
                    <div className="flex items-center gap-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfStroke />
                    <FaRegStar />
                    </div>
                    <div className="text-[10px] text-[#626677] ">
                        5/5
                    </div>
                </div>
                <div className='flex items-center gap-2 mt-5 mb-2 md:mb-0 md:mt-0'>
                    <img src={user1} className='w-[30px] rounded-full' alt="" />
                    <h3>Sarah Johnson</h3>
                </div>

                <hr />
                <div className='my-3 md:my-0'>
                    <span className='bg-[#141A34] text-[#bfbfbf] px-5 py-1 rounded-md '>$50</span>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Card