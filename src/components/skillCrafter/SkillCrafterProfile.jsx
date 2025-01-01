import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router';

const SkillCrafterProfile = () => {
    const { user } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        user: "", 
        image: "",
        curriculum_vitae: "",

        last_educational_qualification: "",
        last_educational_institution: "",
        last_passing_year: "",
        last_result: "", 

        last_working_company: "",
        last_working_years: "",
        last_working_projects_link_1: "",
        last_working_projects_link_2: "", 

        whatsapp: "",
        linkedin: "",
        github: "",
        portfolio: "",
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (e.target.multiple) {
            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
            setProfileData({
                ...profileData,
                [name]: selectedValues,
            });
        } else if (files && files[0]) {
            const file = files[0];

            // For image uploads (e.g., profile image or CV)
            if (name === "curriculum_vitae") {
                openCloudinaryWidget(file);
            } else if (name === "image") {
                setProfileData({
                    ...profileData,
                    [name]: file,
                });
            }
        } else {
            setProfileData({
                ...profileData,
                [name]: value,
            });
        }
    };

    
    const openCloudinaryWidget = () => {
        // Determine the resource type based on the file extension
        const resourceType = (profileData.curriculum_vitae && profileData.curriculum_vitae.type === 'application/pdf') ? 'pdf' : 'auto';
    
        // Open the Cloudinary upload widget
        window.cloudinary.openUploadWidget(
            {
                cloudName: 'dxcwijywg',
                uploadPreset: 'SkillCrafterCVs',
                resourceType: resourceType, // Automatically set the resource type to 'pdf' for PDFs
                sources: ['local'],
                showUploadMoreButton: false,
            },
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                } else if (result.event === 'success') {
                    // Cloudinary upload successful
                    const fileUrl = result.info.secure_url;
                    console.log('File uploaded to Cloudinary:', fileUrl);
    
                    // Update the state with the Cloudinary file URL
                    setProfileData({
                        ...profileData,
                        curriculum_vitae: fileUrl,
                    });
                }
            }
        );
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `https://skillcrafted-backend.vercel.app/skillCrafter/skill-crafter/${user.ck}`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                if (res.data) {
                    setProfileData((prevData) => ({
                        ...prevData,
                        specialization: res.data.specialization || [],
                        ...res.data,
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile: ", error);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            alert("You are not logged in.");
            return;
        }

        let profileImageUrl = await uploadImage(profileData.image);

        let curriculumVitaeUrl = profileData.curriculum_vitae;
        if (profileData.curriculum_vitae instanceof File) {
            curriculumVitaeUrl = await uploadToCloudinary(profileData.curriculum_vitae);
        }

        const updatedProfileData = {
            ...profileData,
            image: profileImageUrl || profileData.image,
            curriculum_vitae: curriculumVitaeUrl || profileData.curriculum_vitae,
        };

        try {
            const res = await axios.put(
                `https://skillcrafted-backend.vercel.app/skillCrafter/skill-crafter/${user.ck}/`,
                updatedProfileData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (res.status === 200) {
                alert("Profile updated successfully.");
                setProfileData((prevData) => ({
                    ...prevData,
                    ...updatedProfileData,
                }));
            } else {
                console.log("Profile update failed.");
            }
        } catch (error) {
            console.error("Error during the profile update:", error);
        }
    };

    const uploadImage = async (image) => {
        if (image && image instanceof File) {
            const formData = new FormData();
            formData.append('image', image);

            try {
                const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=648e380c7b8d76ec81662ddc06d73ec5', {
                    method: 'POST',
                    body: formData,
                });

                const imgbbData = await imgbbResponse.json();

                if (imgbbData.status === 200) {
                    return imgbbData.data.url;
                } else {
                    alert('Image upload failed!');
                    return '';
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Image upload failed!');
                return '';
            }
        }
        return '';
    };


    const [specializations, setSpecializations] = useState([]);
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const res = await axios.get("https://skillcrafted-backend.vercel.app/skillSeeker/specialization/");
                setSpecializations(res.data);
            } catch (error) {
                console.error("Error fetching specializations:", error);
            }
        };
        fetchSpecializations();
    }, []);

    return (
        <div>
            <form class="m-5 md:mx-48 md:my-20" onSubmit={handleUpdateProfile}>
                <div className="userid hidden">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="user"
                            id="user"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            value={profileData.user}
                            onChange={handleChange}
                            required
                        />
                        <label
                            htmlFor="user"
                            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            User ID
                        </label>
                    </div>
                </div>

                <div className="md:flex gap-24">
                    <div className="w-full md:w-1/4">
                        <h6 className="font-bold text-[20px] mb-5">Personal Profile</h6>


                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="specialization" className="sr-only"> Specialization </label>
                            <select 
                                multiple
                                id="specialization"
                                name="specialization"
                                className="block py-2.5 px-0 w-full min-h-[170px] max-h-[400px] text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none"
                                value={profileData.specialization}
                                onChange={handleChange}
                            >
                                <option value="" disabled> Select your Specialization </option>
                                {specializations.map((specialization) => (
                                    <option key={specialization.id} value={specialization.id}>
                                        {specialization.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4">
                        <h6 className="font-bold text-[20px] mb-5">Educational Profile</h6>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_educational_qualification"
                                id="last_educational_qualification"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_educational_qualification}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_educational_qualification"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Educational Qualification
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_educational_institution"
                                id="last_educational_institution"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_educational_institution}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_educational_institution"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Educational Institue 
                            </label>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="last_passing_year"
                                    id="last_passing_year"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.last_passing_year}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="last_passing_year"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Passing Year
                                </label>
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="last_result"
                                    id="last_result"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.last_result}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="last_result"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Result
                                </label>
                            </div>
                        </div>
                        
                         
                    </div>

                    <div className="w-full md:w-1/4">
                        <h6 className="font-bold text-[20px] mb-5">Working Profile</h6>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_working_company"
                                id="last_working_company"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_working_company}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_working_company"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Working Company
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_working_years"
                                id="last_working_years"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_working_years}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_working_years"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Working Years with short details
                            </label>
                        </div>
                         
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_working_projects_link_1"
                                id="last_working_projects_link_1"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_working_projects_link_1}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_working_projects_link_1"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Working Project Link-1
                            </label>
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="last_working_projects_link_2"
                                id="last_working_projects_link_2"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.last_working_projects_link_2}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="last_working_projects_link_2"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Last Working Project Link-2
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                            Curriculum Vitae ( CV )
                            </label>

                            <button type="button" className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer' onClick={() => openCloudinaryWidget()}> Upload CV (PDF) </button>

                            {profileData.curriculum_vitae && profileData.curriculum_vitae instanceof File && (
                                <p className="text-xs text-[#425BF5] mt-1">New Image Uploaded</p>
                            )}
                            {profileData.curriculum_vitae && !(profileData.curriculum_vitae instanceof File) && (
                                <Link to={profileData.curriculum_vitae} target='blank' className='block rounded-lg py-2.5 px-5 w-fit my-2 text-sm text-[#F4F5F7] bg-[#141A34]  appearance-none  focus:outline-none focus:ring-0 focus:border-[#F4F5F7] peer' >  Download CV </Link>
                            )}

                        </div>
                    </div>

                    <div className="w-full md:w-1/4">
                        <h6 className="font-bold text-[20px] mb-5">
                            Contact Details 
                        </h6>
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.whatsapp}
                                onChange={handleChange}
                                required
                            />
                            <label
                                for="whatsapp"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Whatsapp
                            </label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="linkedin"
                                id="linkedin"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.linkedin}
                                onChange={handleChange}
                                required
                            />
                            <label
                                for="linkedin"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Linkedin
                            </label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="github"
                                id="github"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.github}
                                onChange={handleChange}
                                required
                            />
                            <label
                                for="github"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Github
                            </label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="portfolio"
                                id="portfolio"
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.portfolio}
                                onChange={handleChange}
                                required
                            />
                            <label
                                for="portfolio"
                                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Portfolio
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                Profile Image
                            </label>

                            <input type="file" name="image" onChange={handleChange}
                                className=" file-input file-input-bordered w-full " />
                            {profileData.image && profileData.image instanceof File && (
                                <p className="text-xs text-[#425BF5] mt-1">New Image Uploaded</p>
                            )}
                            {profileData.image && !(profileData.image instanceof File) && (
                                <img src={profileData.image} alt="Attachment Preview" className="max-w-[100px] max-h-[100px] mt-2 rounded-xl" />
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Update
                </button>
            </form>
            
        </div>

        
    )
}

export default SkillCrafterProfile