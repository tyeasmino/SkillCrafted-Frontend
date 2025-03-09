import React, { useState } from 'react'
import signupImg from '../assets/auth/signup.png'
import axios from 'axios'

const SignUp = () => {

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        user_type: "skillCrafter",
    })
    
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const handleChange = (e) => {
        // console.log(e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(formData) 


        try { 
            const res = await axios.post(
            "https://skillcrafted-backend.vercel.app/accounts/register/",
            formData,

            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );
        
            console.log(res.status);
            if (res.status === 201) {
            setSuccessTitle('Success')
            setSuccessMessage('Your registration is DONE. Check your email to activate your account')
            setFormData({
                username: "",
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirm_password: "",
                user_type: "skillCrafter",
            })
            console.log('done');
            } else {
           
            setSuccessTitle('Failed')
            setSuccessMessage(res.data.error || 'Form registration has been failed. Please try again')
            }
        } catch (error) {
            console.log(error)
            setSuccessTitle('Failed')

            if (error.response && error.response.data) {
                const errorData = error.response.data

                if(errorData.username) {
                    setSuccessMessage('Username already exists') 
                } else if(errorData.email) {
                    setSuccessMessage('Email already exists') 
                } else if(errorData.password) {
                    setSuccessMessage('Password did not match') 
                } else {
                    setSuccessMessage(errorData.error || 'An error occurred. Please try again') 
                }
            } else {
                setSuccessMessage('An error occurred. Please try again') 
            }

        }
    };

  return (
    <section>       
        <div className="md:flex items-center justify-between p-5 md:py-10 md:px-48">
            <div className='md:w-1/2 md:flex justify-center'> 
                <img className='w-full md:w-[600px] h-full object-cover' src={signupImg}  alt="" />
            </div>
            <div className='md:w-1/2 p-3 mt-5 md:mt-0 md:p-0 relative'>
                
                <div className='max-w-lg mx-auto my-5'>
                    <h2 className='text-3xl font-semibold text-[ #141A34] '>Sign up</h2>
                    <p className='text-sm text-[#626677] '> Let's get up all st up so you can access your personal account </p>
                </div>
                
                
                <form class="max-w-lg mx-auto" onSubmit={handleSubmit}>
                    <div class="relative z-0 w-full mb-5 group">
                        <input 
                            type="text" 
                            name="username" 
                            id="floating_username" 
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                            placeholder=" " 
                            required
                            value={formData.username}
                            onChange={handleChange}
                            />
                        <label for="floating_username" class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                    </div>

                    <div class="grid md:grid-cols-2 md:gap-6">
                        <div class="relative z-0 w-full mb-5 group">
                            <input 
                                type="text" 
                                name="first_name" 
                                id="floating_first_name" 
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                placeholder=" " 
                                required 
                                value={formData.first_name}
                                onChange={handleChange}
                                />
                            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input 
                                type="text" 
                                name="last_name" 
                                id="floating_last_name" 
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                placeholder=" " 
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                />
                            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                        </div>
                    </div>

                    <div class="relative z-0 w-full mb-5 group">
                        <input 
                            type="email" 
                            name="email" 
                            id="floating_email" 
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer" 
                            placeholder=" " 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            />
                        <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>

                    <div class="grid md:grid-cols-2 md:gap-6">
                        <div class="relative z-0 w-full mb-5 group">
                            <input 
                                type="password" 
                                name="password" 
                                id="floating_password" 
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                placeholder=" " 
                                required
                                value={formData.password}
                                onChange={handleChange}
                                />
                            <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        </div>
                        <div class="relative z-0 w-full mb-5 group">
                            <input 
                                type="password" 
                                name="confirm_password" 
                                id="floating_repeat_password" 
                                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                placeholder=" " 
                                required
                                value={formData.confirm_password}
                                onChange={handleChange}
                                />
                            <label for="floating_repeat_password" class="peer-focus:font-medium absolute text-sm text-gray-500   duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 md:gap-6">
                        <div class="relative flex items-center z-0 w-full mb-5 group">
                            <input type="radio" 
                                name="user_type" 
                                id="skillCrafter" 
                                className="radio radio-sm radio-primary" 
                                defaultChecked
                                value='skillCrafter'
                                onChange={handleChange}
                                />
                            <label for="skillCrafter" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 ">Skill Crafter</label>
                        </div>
                        <div class="relative flex items-center z-0 w-full mb-5 group">
                            <input 
                                type="radio" 
                                name="user_type" 
                                id="skillSeeker" 
                                className="radio radio-sm radio-primary"
                                value='skillSeeker'
                                onChange={handleChange}
                                />
                            <label for="skillSeeker" class="w-full py-4 ms-2 text-sm font-medium text-gray-900  dark:text-gray-100">Skill Seeker</label>
                        </div>                        
                    </div>    

                    <button type="submit" class="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 mb-5 md:mb-0 text-center"> Create account </button>
                </form>


                {successMessage && ( <div className="bg-[#546BF6] md:w-[300px] absolute -right-3 -bottom-7 md:right-32 md:-bottom-14 rounded-br-md border-l-4 border-green-500 text-white p-1 md:p-4 mb-4" role="alert"> 
                                    <p className="font-bold"> {successTitle} </p>  
                                    <p className="hidden md:block">{successMessage}</p> 
                                </div> )}
            </div> 
        </div>              
    </section>
  )
}

export default SignUp