import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { AuthContext } from '../../contexts/AuthContext';



const SkillSeekerProfile = () => {
    const { user } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        user: "",
        designation: [],
        specialization: [],
        image: "",

        company_name: "",
        company_started: "",
        company_employee: "",
        company_address: "",
        company_website: "",
        company_logo: "",

        whatsapp: "",
        linkedin: "",
        github: "",
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (e.target.multiple) {
            // If the input is a multiple select, get all selected options
            const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
            setProfileData({
                ...profileData,
                [name]: selectedValues,
            });
        } else if (type === 'file') {
            setProfileData({
                ...profileData,
                [name]: files[0], // Assign the file to the respective field
            });
        } else {
            setProfileData({
                ...profileData,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/skillSeeker/skill-seekers/${user.sk}`,
                    {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                if (res.data) {
                    setProfileData((prevData) => ({
                        ...prevData,
                        designation: res.data.designation || [],
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

    // Helper function to upload images and return the URL
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
                    return imgbbData.data.url; // Return the URL of the uploaded image
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
        return ''; // If no image provided, return empty string
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            alert("You are not logged in.");
            return;
        }

        // Upload company logo if it exists
        let companyLogoUrl = await uploadImage(profileData.company_logo);

        // Upload profile image if it exists
        let profileImageUrl = await uploadImage(profileData.image);

        const updatedProfileData = {
            ...profileData,
            company_logo: companyLogoUrl || profileData.company_logo,
            image: profileImageUrl || profileData.image,
        };

        console.log('Updated Profile Data:', updatedProfileData);

        try {
            const res = await axios.put(
                `https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/skillSeeker/skill-seekers/${user.sk}/`,
                updatedProfileData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (res.status === 200) {
                console.log("Profile updated successfully.");
                setProfileData((prevData) => ({
                    ...prevData,
                    ...updatedProfileData, // Update the profile with new data
                }));
            } else {
                console.log("Profile update failed.");
            }
        } catch (error) {
            console.error("Error during the profile update:", error);
        }
    };

    const [designations, setDesignations] = useState([]);
    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                const res = await axios.get("https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/skillSeeker/designation/");
                setDesignations(res.data);
            } catch (error) {
                console.error("Error fetching designations:", error);
            }
        };
        fetchDesignations();
    }, []);

    const [specializations, setSpecializations] = useState([]);
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const res = await axios.get("https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/skillSeeker/specialization/");
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
                    <div className="w-full md:w-1/3">
                        <h6 className="font-bold text-[20px] mb-5">Personal Profile</h6>

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="designation" className="sr-only"> Designation </label>
                            <select
                                multiple
                                id="designation"
                                name="designation"
                                className="block min-h-[160px] max-h-[500px] py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none"
                                value={profileData.designation}
                                onChange={handleChange}
                            >
                                <option value="" disabled> Select your Designation </option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>
                                        {designation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="specialization" className="sr-only"> Specialization </label>
                            <select
                                multiple
                                id="specialization"
                                name="specialization"
                                className="block min-h-[160px] max-h-[500px] py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none"
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

                    <div className="w-full md:w-1/3">
                        <h6 className="font-bold text-[20px] mb-5">Company Profile</h6>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="company_name"
                                id="company_name"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={profileData.company_name}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="company_name"
                                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Company Name
                            </label>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="number"
                                    name="company_started"
                                    id="company_started"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.company_started}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="company_started"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Company Started Year
                                </label>
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="number"
                                    name="company_employee"
                                    id="company_employee"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.company_employee}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="company_employee"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Company Employee
                                </label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="company_address"
                                    id="company_address"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.company_address}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="company_address"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Company Address
                                </label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="company_website"
                                    id="company_website"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    value={profileData.company_website}
                                    onChange={handleChange}
                                    required
                                />
                                <label
                                    htmlFor="company_website"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Company Website
                                </label>
                            </div>
                        </div>


                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                Company Logo Image
                            </label>

                            <input type="file" name="company_logo" onChange={handleChange}
                                className=" file-input file-input-bordered w-full " />
                            {profileData.company_logo && profileData.company_logo instanceof File && (
                                <p className="text-xs text-[#425BF5] mt-1">New Company Logo Uploaded</p>
                            )}
                            {profileData.company_logo && !(profileData.company_logo instanceof File) && (
                                <img src={profileData.company_logo} alt="Attachment Preview" className="max-w-[200px] max-h-[200px]  mt-2 rounded-xl" />
                            )}
                        </div>

                    </div>

                    <div className="w-full md:w-1/3">
                        <h6 className="font-bold text-[20px] mb-5">
                            Contact Details (Personal / Official)
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

export default SkillSeekerProfile