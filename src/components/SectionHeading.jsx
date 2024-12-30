import React from 'react'

const SectionHeading = ({ title, highlight, description }) => {
  return (
    <div className='flex flex-col gap-5 text-center my-10'>
      <h2 className='font-bold text-[#141A34] text-2xl md:text-4xl'>
        {title} {''}
        <span className='text-[#425BF5]  '> {highlight} </span>
      </h2>
      <p className='text-[#626677] hidden md:block'> {description} </p>
    </div>
  )
}

export default SectionHeading
