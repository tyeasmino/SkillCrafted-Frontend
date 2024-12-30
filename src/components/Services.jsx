import axios from 'axios';
import React, { useEffect, useState } from 'react'
import iconMappings from './IconMappings';
import { SiIconfinder } from "react-icons/si";
import { Link } from 'react-router-dom';


const Services = () => {

  const [categories, setCategories] = useState([])

  useEffect( () => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/projects/categoryList/')
        setCategories(res.data)
      } catch (error) {
        console.error('Error fetching categories: ', error)
      }
    }

    fetchCategories()
  }, [])


  const getIconComponent = (iconName) => {
    const IconComponent = iconMappings[iconName]
    return IconComponent ? 
      <IconComponent className='text-[#425BF5] p-2 rounded-full text-[60px] bg-[#F4F5F7]' 
      style={{ transition: 'color 0.3s ease, background-color 0.3s ease' }} /> 
      : 
      <SiIconfinder className='text-[#425BF5] p-2 rounded-full text-[60px] bg-[#F4F5F7]' 
      style={{ transition: 'color 0.3s ease, background-color 0.3s ease' }} /> 
  }
 

  return (
    <section>
      <div className="grid grid-cols-2  px-3 gap-3 md:grid-cols-4 lg:grid-cols-6 md:gap-6"> 
        {categories.map((category) => ( 
          <div key={category.id} 
            className=' md:w-[200px] rounded-md p-5 items-center shadow-md flex flex-col gap-3 hover:bg-[#141A34] group' 
            style={{ transition: 'background-color 0.3s ease' }} > 
            
            {getIconComponent(category.icon)}
            
            <Link to={`/category/${category.slug}`}>
            <h6 className="font-bold text-[12px] text-center md:text-[16px] group-hover:text-white">
              {category.name}
            </h6>
          </Link>

            <p className='text-sm text-[#626677]'
              style={{ transition: 'color 0.3s ease' }} > 
              {category.services_count} services 
            </p> 
          </div> 
        ))} 
      </div>
    </section>
  )
}

export default Services
