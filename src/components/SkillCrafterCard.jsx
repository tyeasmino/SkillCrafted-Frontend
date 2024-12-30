import React from 'react'
import user1 from '../assets/profiles/user1.jpg'
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";

const SkillCrafterCard = () => {
  return (
    <section>
        <div className='w-[300px] shadow-sm rounded-md overflow-hidden '>
            <div className="top">
                <img className='w-full h-[200px] object-cover' src={user1} alt="" />
            </div>
            <div className="btm p-5">
                <h3 className='font-bold '>Avery Davis</h3>
                <h6 className='text-[12px]'>Copywritter</h6>
                <div className='flex my-3 items-center justify-between gap-2'>
                    <div className="flex gap-2 items-center">
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
                    <div className='rateCount text-[12px]'>
                    (349 Reviews)
                    </div>
                </div>
                <hr />

                <div className='mt-3 flex items-center text-sm gap-2'>
                <FaMapMarkerAlt className='text-[#425BF5] text-[10px]' /> Ukraine
                </div>
                <div className='flex justify-between text-[10px] text-[#797a7e]  '>
                    <div className="left">
                        Rate <br />
                        <p className=' bg-[#425BF5] text-[#F4F5F7] px-2 py-1 rounded ' >$25/hr</p>
                    </div>
                    <div className="right flex flex-col items-end">
                        <p>Success Rate</p> 
                        <p className='bg-[#425BF5] w-fit text-[#F4F5F7] px-2 py-1 rounded '>89%</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default SkillCrafterCard