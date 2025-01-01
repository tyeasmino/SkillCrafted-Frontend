import React, { useEffect, useState } from 'react'
import user1 from '../assets/profiles/user1.jpg'
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router';
import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";



const SkillCrafterCard = () => {
  const [userData, setUserData] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    // Fetch user data from the skillCrafter API
    axios
      .get('http://127.0.0.1:8000/skillCrafter/skill-crafter/')
      .then((response) => {
        setUserData(response.data); // Store the skill crafter data
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    // Fetch specializations data from the specialization API
    axios
      .get('http://127.0.0.1:8000/skillSeeker/specialization/')
      .then((response) => {
        setSpecializations(response.data); // Store the specializations data
      })
      .catch((error) => {
        console.error('Error fetching specializations:', error);
      });

    // Fetch all users from the users API
    axios
      .get('http://127.0.0.1:8000/accounts/users/')
      .then((response) => {
        setUsers(response.data); // Store the users data
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  if (userData.length === 0 || specializations.length === 0 || users.length === 0) {
    return <div>Loading...</div>; // Display loading state if no data or specializations
  }

  // Function to get the specialization name by ID
  const getSpecializationName = (id) => {
    const specialization = specializations.find((specialization) => specialization.id === id);
    return specialization ? specialization.name : 'Unknown';
  };

  // Function to get the user's full name by matching ck (user_id)
  const getUserName = (userId) => {
    const user = users.find((user) => user.user_id === userId); // Match user_id with ck
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Loop through each user in userData */}
      {userData.map((user, index) => {
        const {
          image,
          curriculum_vitae,
          last_educational_qualification,
          last_educational_institution,
          last_passing_year,
          last_result,
          last_working_company,
          last_working_years,
          last_working_projects_link_1,
          last_working_projects_link_2,
          whatsapp,
          linkedin,
          github,
          portfolio,
          user: userId, // This is the user_id (ck) from the skillCrafter data
          specialization,
        } = user;

        const userName = getUserName(userId); // Get the user's full name using the user_id (ck)

        return (
          <div key={index} className="w-[300px] shadow-sm rounded-md overflow-hidden">
            <div className="top">
              <img className="w-full h-[200px] object-cover" src={image || user1} alt="User Profile" />
            </div>
            <div className="btm p-5">
              <h3 className="font-bold">{userName || ''}</h3>
              <h6 className="text-[12px]">
                {specialization.length
                  ? specialization.map((id) => getSpecializationName(id)).join(', ')
                  : 'No Specialization'}
              </h6>
              <div className="flex my-3 items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfStroke />
                    <FaRegStar />
                  </div>
                  <div className="text-[10px] text-[#626677] ">5/5</div>
                </div>
                <div className="rateCount text-[12px]">(349 Reviews)</div>
              </div>
              <hr />
              <div className="mt-3 flex items-center text-sm gap-2">
                <FaMapMarkerAlt className="text-[#425BF5] text-[10px]" />
                {last_educational_institution || 'Unknown Location'}
              </div>
              <div className="flex justify-between text-[10px] text-[#797a7e]">
                <div className="left">
                  Last Working Company <br />
                  <p className="bg-[#425BF5] text-[#F4F5F7] px-2 py-1 rounded">{last_working_company || ' '}</p>
                </div>
                <div className="right flex flex-col items-end">
                  <p>Success Rate</p>
                  <p className="bg-[#425BF5] w-fit text-[#F4F5F7] px-2 py-1 rounded">89%</p>
                </div>
              </div>
            </div>
            {/* Display contact links if available */}
            <div className="contacts p-5">
              <h4>Contact Information</h4>

              <div className="flex gap-2">
                {whatsapp && (
                  <div>
                    <Link to={`https://wa.me/${whatsapp}`} target="_blank">
                      <FaWhatsapp />
                    </Link>
                  </div>
                )}
                {linkedin && (
                  <div>
                    <Link to={linkedin} target="_blank">
                      <CiLinkedin />
                    </Link>
                  </div>
                )}

                {github && (
                  <div>
                    <Link to={github} target="_blank">
                      <FaGithub />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default SkillCrafterCard