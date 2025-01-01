import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const AddProject = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        requirements: "",
        anyAttachment: "", 
        created_at: "",
        skillSeeker: "",
        category: "",
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0], 
            });
        } else {
            setFormData({
                ...formData,
                [name]: value, 
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }
    
        let imageUrl = '';
    
        if (formData.anyAttachment) {
            const imgFormData = new FormData();
            imgFormData.append('image', formData.anyAttachment);
    
            const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=648e380c7b8d76ec81662ddc06d73ec5', {
                method: 'POST',
                body: imgFormData,
            });
    
            const imgbbData = await imgbbResponse.json();
            if (imgbbData.status === 200) {
                imageUrl = imgbbData.data.url;
                console.log(imageUrl)
            } else {
                alert('Image upload failed!');
                return;
            }
        }
    
        const budget = parseFloat(formData.budget);
        if (isNaN(budget)) {
            alert('Please enter a valid budget.');
            return;
        }
    
        const deadline = new Date(formData.deadline).toISOString().split('T')[0]; 
    
        if (!formData.category) {
            alert('Category cannot be empty.');
            return;
        }
    
        const articleData = {
            title: formData.title,
            description: formData.description,
            budget: formData.budget, 
            deadline: formData.deadline, 
            requirements: formData.requirements,
            skillSeeker: user.sk, 
            category: formData.category,
            anyAttachment: imageUrl, 
            created_at: new Date().toISOString(),
        };
         

        try {
            const response = await fetch("https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/projects/projectList/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(articleData),
            });
    
            const responseData = await response.json();
            console.log("API Response:", responseData); 
    
            if (response.ok) {
                alert("Project added successfully!");
            } else {
                alert("Error adding project. " + responseData.message || 'Unknown error');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };



    const [categories, setCategories] = useState([])

    useEffect( () => {
        const fetchCategories = async () => {
        try {
            const res = await axios.get('https://skillcrafted-backend-hs0gg98gj-tyeasminos-projects.vercel.app/projects/categoryList/')
            setCategories(res.data)
        } catch (error) {
            console.error('Error fetching categories: ', error)
        }
        }

        fetchCategories()
    }, [])
    

    return (
        <section>
            <form id="add-project" className="m-5 md:mx-48 md:my-20" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="md:flex gap-24">
                    <div className="w-full">
                        <h6 className="font-bold text-[20px] mb-5">Add a new Project</h6>
 

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="category" className="sr-only"> Project Category </label>
                            <select 
                                id="category"
                                name="category"
                                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="" disabled> Select project category </option>
                                {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                                ))}
                            </select>
                        </div>


                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Title
                            </label>
                        </div>
 
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Description
                            </label>
                        </div>
 
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type='number'
                                name="budget"
                                id="budget"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={formData.budget}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="budget" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Budget
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type='date'
                                name="deadline"
                                id="deadline"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="deadline" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Deadline
                            </label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type='text'
                                name="requirements"
                                id="requirements"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={formData.requirements}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="requirements" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Requirements
                            </label>
                        </div>
 
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="file"
                                name="anyAttachment"
                                id="anyAttachment"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                onChange={handleChange}  
                                required
                            />
                            <label htmlFor="anyAttachment" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Project Attachment
                            </label>
                        </div>
 
                         

                        
 

                    </div>
                </div>

                <button
                    type="submit"
                    className="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Add Project
                </button>
            </form>
        </section>
    );
}

export default AddProject;
