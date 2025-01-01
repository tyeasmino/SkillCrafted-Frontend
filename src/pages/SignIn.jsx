import React, { useContext, useState } from 'react' 
import loginImg from '../assets/auth/login.png'
import axios from 'axios'
import { Link } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'


const SignIn = () => {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    
    const { login } = useContext(AuthContext)
    const [successTitle, setSuccessTitle] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate()


    const handleChange = (e) => {
        // console.log(e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // console.log(formData) 
        try { 
            const res = await axios.post(
                // "https://skillcrafted-backend.vercel.app/auth/login/",
            "https://skillcrafted-backend.vercel.app/accounts/login/",
            formData,
            {
                headers: {
                'Content-Type': 'application/json',
                },
            }
            );
        
            console.log('res', res); 
            console.log('status ', res.status);
            console.log('uid ', res.data.user_id);
            console.log('token ', res.data.token);
            console.log('username ', res.data) 


            if (res.status === 200 && !res.data.error) {
            setSuccessTitle('Success')
            setSuccessMessage('Login Successful')

            localStorage.setItem('token', res.data.token)
            
            
            const loginSuccess = await login(formData)
            if (loginSuccess) {
                console.log('successful login');
                navigate('/dashboard')
            }

            // from to 

            setFormData({
                username: "", 
                password: "", 
            })
            console.log('done');
            } else {
            console.log('failed');
            setSuccessTitle('Failed')
            setSuccessMessage('Login Failed. Please check your credentials and try again')
            }
        } catch (error) {
            console.error(error)
            setSuccessTitle('Failed')
            setSuccessMessage('An error occurred. Please try again') 
        }
    };

  return (
    <section>       
        <div className="flex flex-col-reverse md:flex-row items-center justify-between p-5 md:py-10 md:px-48">
            <div className='md:w-1/2 p-3 mt-5 md:mt-0 md:p-0 relative'>
                
                <div className='max-w-lg mx-auto my-5'>
                    <h2 className='text-3xl font-semibold text-[ #141A34] '>Login</h2>
                    <p className='text-sm text-[#626677] '> Login to access your skillCrafted account </p>
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
 
                    <div class="relative z-0 w-full mb-1 group">
                        <input 
                            type="password" 
                            name="password" 
                            id="floating_password" 
                            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                            placeholder=" " 
                            required
                            value={formData.password}
                            onChange={handleChange}
                            />
                        <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>

                    <div class="w-full text-end">
                        <Link to='/forget-password'  className='text-sm text-red-500'>Forget Password?</Link>                            
                    </div>

                    <button type="submit" class="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 mb-5 md:mb-0 text-center">Login</button>
                </form>


                {successMessage && ( <div className="bg-[#546BF6] absolute -right-3 -bottom-7  md:right-32 md:-bottom-10 rounded-br-md border-l-4 border-green-500 text-white p-1 md:p-4 mb-4" role="alert"> 
                                    <p className="font-bold"> {successTitle} </p> 
                                    <p className="hidden md:block">{successMessage}</p> 
                                </div> )}
            </div> 

            <div className='md:w-1/2 md:flex justify-center'> 
                <img className='w-full md:w-[600px] h-full object-cover' src={loginImg}  alt="" />
            </div>
        </div>              
    </section>
  )
}

export default SignIn