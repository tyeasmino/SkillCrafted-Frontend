import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { GiPriceTag } from "react-icons/gi";
import { TbEyeCheck } from "react-icons/tb";
import { TbFilterDollar } from "react-icons/tb";
import notfound from '../assets/services/not found.png';


const Category = () => {
  const { categorySlug } = useParams();  // Get category slug from the URL
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillSeekers, setSkillSeekers] = useState({});
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Logging the categorySlug to verify the value
        console.log("Fetching projects for category:", categorySlug);
        const res = await axios.get(`https://skillcrafted-backend.vercel.app/projects/projectList/?categorySlug=${categorySlug}`);
        setProjects(res.data);
        setFilteredProjects(res.data);  // Initially, display all projects
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (categorySlug) {
      fetchProjects();  // Only fetch if categorySlug is defined
    }
  }, [categorySlug]);  // Refetch data if slug changes

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://skillcrafted-backend.vercel.app/projects/categoryList/');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSkillSeekers = async () => {
      try {
        const res = await axios.get('https://skillcrafted-backend.vercel.app/skillSeeker/skill-seekers/');
        const skillSeekerData = res.data.reduce((acc, skillSeeker) => {
          acc[skillSeeker.id] = skillSeeker.company_logo;
          return acc;
        }, {});
        setSkillSeekers(skillSeekerData);
      } catch (error) {
        console.error('Error fetching skill seekers:', error);
      }
    };

    fetchSkillSeekers();
  }, []);

  // Filter the projects based on the min and max budget
  const handleFilter = () => {
    const filtered = projects.filter(project => {
      const budget = parseFloat(project.budget);
      const min = minBudget ? parseFloat(minBudget) : 0;
      const max = maxBudget ? parseFloat(maxBudget) : Infinity;

      return budget >= min && budget <= max;
    });

    setFilteredProjects(filtered);  // Set filtered projects
  };

  // Handle the filter form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilter();  // Apply the filter
  };

  return (
    <div className='max-w-screen-2xl m-auto'>
      
      <div className='flex items-center justify-between m-5 md:mx-32'>
        <h2 className='font-bold text-2xl'>Most Popular Projects in {categorySlug} category </h2> 

        <div className='flex gap-5 items-center'>
          <span className='rounded-lg text-[#141A34] text-sm font-bold border-2 border-[#141A34] py-1 px-2'> Total Project: {filteredProjects.length} </span>      
        </div>
      </div>

      {/* Budget Filter Section */}
      <div className="border-black px-10 flex flex-col gap-2 md:fixed top-30 left-0">
        <div className='text-[#141A34] text-[14px] py-1 px-2'> 
          Filter by Budget
          <form className='mt-3' onSubmit={handleSubmit}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="minBudget"
                id="minBudget"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
              />
              <label
                htmlFor="minBudget"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Minimum Budget
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="maxBudget"
                id="maxBudget"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
              <label
                htmlFor="maxBudget"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Maximum Budget
              </label>
            </div>
            <button className='rounded mt-2 mb-10 text-[#141A34] text-[14px] font-bold border-2 border-[#141A34]  px-2'> Filter Projects </button>
          </form>
        </div>
      </div>

      {/* Display filtered projects */}
      <section>
        {filteredProjects.length > 0 ? (
          <section className="flex flex-wrap justify-left gap-5 my-5 md:mx-28">
            {filteredProjects.map((project) => {
              // Find the category name for the current project
              const projectCategory = categories.find(
                (category) => category.id === project.category
              );
              
              // Get the skill seeker image for the current project
              const skillSeekerImage = skillSeekers[project.skillSeeker];

              return (
                <section className='flex px-3 justify-center md:gap-10' key={project.id}>
                  <div className="md:w-[250px] shadow-lg rounded-md p-5">
                    <div className="top py-2">
                      <h6 className="text-[12px] text-[#626677] flex justify-between items-center">
                        {projectCategory ? projectCategory.name : ''}
                      </h6>
                      <div className="h-[100px]">
                        <h4 className="font-bold">{project.title}</h4>
                        <h4 className=""> {project.description.length > 80 ? <>{project.description.slice(0, 75)}...</> : project.description}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <GiPriceTag className="text-[#425BF5]" /> {project.budget}
                      </div>
                    </div>
                    <hr />
                    <div className="btm py-2 flex items-end justify-between gap-3">
                      <div className="left">
                        <p className="text-[12px] text-[#626677]">
                          {skillSeekerImage && <img src={skillSeekerImage} alt="Skill Seeker" className="w-30 h-10 " />}
                          Due Date: {project.deadline}
                        </p>
                      </div>
                      <div className="right">
                        <p className="text-[20px] text-[#425BF5]">
                          <Link to={`/project/${project.id}`} className="text-[20px] text-[#425BF5]"> <TbEyeCheck /> </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </section>
        ) : (
          <img  src={notfound} alt="Not Found" className="w-[400px] m-auto my-10" /> 
        )}
      </section>
    </div>
  );
};

export default Category;
