import React, { useEffect, useState } from 'react';
import { GiPriceTag } from "react-icons/gi";
import axios from 'axios';
import { TbEyeCheck } from "react-icons/tb";
import { Link } from 'react-router-dom';
import notfound from '../assets/services/not found.png';

const ProjectCard = ({ limit }) => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillSeekers, setSkillSeekers] = useState({});
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Fetch all projects on initial load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/projects/projectList/');
        setProjects(response.data);  // Set all projects when the page loads
        setFilteredProjects(response.data); // Set filteredProjects to all projects initially
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);  // Empty dependency array to run only on initial render

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/projects/categoryList/');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch skill seekers
  useEffect(() => {
    const fetchSkillSeekers = async () => {
      try {
        const res = await axios.get('https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/skillSeeker/skill-seekers/');
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

  // Filter projects based on budget range
  const fetchFilteredProjects = async () => {
    let query = '?';

    if (minBudget) {
      query += `budget__gte=${minBudget}&`;
    }
    if (maxBudget) {
      query += `budget__lte=${maxBudget}&`;
    }

    // Remove trailing '&' if query ends with '&'
    if (query.endsWith('&')) {
      query = query.slice(0, -1);
    }

    try {
      const res = await axios.get(`https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/projects/projectList/${query}`);
      setFilteredProjects(res.data);  // Set filtered projects
    } catch (error) {
      console.error('Error fetching filtered projects: ', error);
      alert('Error fetching filtered projects');
    }
  };

  // Handle filter form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProjects();  // Only fetch filtered projects
  };

  return (
    <section>
      {projects.length > 0 ? (
        <section className="flex flex-wrap justify-left gap-2 my-5 ">
          { limit === 5 ? <></> : 
            <div className='border-black px-10 flex flex-col gap-2 md:fixed top-30 left-0'>
              <div className='text-[#141A34] text-[14px] py-1 px-2'> 
                Budget
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
          }

          {/* If filteredProjects is empty, show "Not Found" image */}
          {filteredProjects.length === 0 ? (
            <div className="w-full text-center">
              <img src={notfound} alt="Not Found" className="w-[400px] m-auto my-10" /> 
            </div>
          ) : (
            filteredProjects.slice(0, limit).map((project) => {
              const projectCategory = categories.find(
                (category) => category.id === project.category
              );
              
              const skillSeekerImage = skillSeekers[project.skillSeeker];

              return (
                <div key={project.id}> 
                  <section className='flex flex-wrap px-3 justify-start md:gap-5'>
                    <div className="md:w-[250px] shadow-lg rounded-md p-5">
                      <div className="top py-2">
                        <h6 className="text-[12px] text-[#626677] flex justify-between items-center">
                          {projectCategory ? projectCategory.name : ''} 
                        </h6>
                        <div className="h-[100px]">
                          <h4 className="font-bold">{project.title}</h4>
                          <h4 className="">
                            {project.description.length > 80 ? <>{project.description.slice(0, 75)}...</> : project.description}
                          </h4>
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
                            <Link to={`/project/${project.id}`} className="text-[20px] text-[#425BF5]"> 
                              <TbEyeCheck /> 
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              );
            })
          )}
        </section>
      ) : (
        <p>
          <img src={notfound} alt="No projects available" className='w-[400px] m-auto my-10' />
        </p>
      )}
    </section>
  );
};

export default ProjectCard;
