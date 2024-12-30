import React, { useState } from 'react';
import axios from 'axios';
import forgetPasswordImg from '../assets/auth/forgotPassword.png';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
      new_password1: "",
      new_password2: "", 
  })

  const handleChange = (e) => { 
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
  };


  console.log(formData) 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("You are not logged in.");
        return;
    }

    try {
        const res = await axios.post(
            "http://127.0.0.1:8000/auth/password/change/",
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            }
        );

        if (res.status === 200) {
            setFormData({ 
                new_password1: "",
                new_password2: "", 
            });
            console.log('done') 
        } else {
            console.log('failed');
        }
    } catch (error) {
        console.log(error); 
    }
};


  return (
    <section>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between p-5 md:py-10 md:px-48">
        <div className="md:w-1/2 p-3 mt-5 md:mt-0 md:p-0 relative">
          <div className="max-w-lg mx-auto my-5">
            <h2 className="text-3xl font-semibold text-[#141A34]">Change your password?</h2>
            <p className="text-sm text-[#626677]"> Change your password with a strong password</p>
          </div>
 
          {/* {error && (
            <div className="bg-red-500 text-white p-2 mb-3 rounded">
              <p>{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 text-white p-2 mb-3 rounded">
              <p>{successMessage}</p>
            </div>
          )} */}

          <form  className="max-w-lg mx-auto" onSubmit={handleSubmit}>
            {/* <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="old_password"
                id="old_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                value={formData.old_password}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="old_password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Old Password
              </label>
            </div> */}


            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="new_password1"
                id="new_password1"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                value={formData.new_password1}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="new_password1"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                New Password
              </label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="new_password2"
                id="new_password2"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" " 
                value={formData.new_password2}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="new_password2"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                New password confirmation 
              </label>
            </div>

            <button
              type="submit"
              className="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 mb-5 md:mb-0 text-center"
            >
              Change My Password
            </button>
          </form>
        </div>

        <div className="md:w-1/2 md:flex justify-center">
          <img className="w-full md:w-[600px] h-full object-cover" src={forgetPasswordImg} alt="" />
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
