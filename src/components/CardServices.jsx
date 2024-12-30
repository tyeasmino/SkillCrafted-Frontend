import React from 'react'
import { MdOutlinePersonSearch } from "react-icons/md";


const CardServices = () => {
  return (
    <section>
        <div className='md:w-[400px] p-5 md:p-8 flex flex-col gap-5 bg-white shadow-md rounded-md hover:shadow-md hover:shadow-[#425BF5]'>
            <div className="p-3 bg-[#425BF5] rounded-full w-fit">
                <MdOutlinePersonSearch className='text-white text-[25px]' />
            </div>
            <h5 className='font-bold md:text-xl '>Freelancer hiring services</h5>
            <p className='text-[#626677] '>Businesses and individuals can easily hire freelancers for their projects on the skillCrafted platform</p>
        </div>
    </section>
  )
}

export default CardServices