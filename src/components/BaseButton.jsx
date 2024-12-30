import React from 'react'

const BaseButton = ({btnText}) => {
  return (
    <section className='flex items-center justify-center my-5'>
        <div className='text-[#e8e8e8] bg-[#425BF5] w-fit text-center px-5 py-2 rounded-md'>
            {btnText}
        </div>
    </section>
  )
}

export default BaseButton