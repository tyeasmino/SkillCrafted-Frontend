import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import ProjectCard from '../components/ProjectCard';
 

const Projects = () => {
  return (
    <div> 
      <div className="flex flex-col my-5 px-3 flex-wrap justify-center md:px-60">
        <h2 className='font-bold text-3xl text-center '>All Projects</h2>
        <div className=''>
          <ProjectCard />
        </div>
      </div>
    </div>
  );
};

export default Projects;
