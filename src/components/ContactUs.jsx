import React, { useState } from "react";
import dots from "../assets/dots.png";
import axios from "axios";

 
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
  });

  const [successMessage, setSuccessMessage] = useState("")


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try { 
      const res = await axios.post(
        "http://127.0.0.1:8000/contact_us/",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
        
      if (res.status === 201) {
        setSuccessMessage('Your message has been received successfully')
        setFormData({
          name: '',
          email: '',
          subject: '',
        })
      } else {
        setSuccessMessage('Form submission failed. Please try again')
      }
    } catch (error) {
      setSuccessMessage('An error occurred. Please try again') 
    }
  };

  return (
    <section>
      <div className="bg-[#425BF5]">
        <div className="flex items-center flex-col md:flex-row gap-5 md:gap-20 p-3 py-5 m-auto justify-between md:p-20">
          <div className="relative left md:w-1/2 ">
            <div className="bg-[#546BF6] text-white font-bold text-xl md:text-3xl md:px-40 md:py-16 md:text-start text-center rounded-md py-10 px-5">
              Stay Up to Date with Our Latest Innovations: Sign Up for Our Newsletter!
            </div>
            <img src={dots} className="w-10 md:w-32 md:opacity-30 -top-6 md:-top-24 -left-2 md:-left-20 transform rotate-90 absolute" alt="" />
            <img src={dots} className="w-10 md:hidden -bottom-8 right-5 transform rotate-90 absolute" alt="" />
          </div>
          <div className="right relative mt-5 md:mt-0 w-full md:w-1/2 flex flex-col gap-3">

          {successMessage && ( 
            <div className="bg-[#546BF6] absolute right-1 -bottom-3  md:right-2 md:-bottom-2 rounded-br-md border-l-4 border-green-500 text-white p-1 md:p-4 mb-4" role="alert"> 
              <p className="font-bold">Success</p> 
              <p className="hidden md:block">{successMessage}</p> 
            </div> )}
 
            <form className="p-3 py-10 rounded-md bg-white" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group"> 
                  <input 
                    type="text" 
                    name="name" 
                    id="floating_name" 
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" " 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:left-0 peer-focus:text-blue-600">Full name</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input 
                    type="email" 
                    name="email" 
                    id="floating_email" 
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                    placeholder=" " 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:left-0 peer-focus:text-blue-600">Email address</label>
                </div>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input 
                  type="text" 
                  name="subject" 
                  id="floating_msg" 
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                  placeholder=" " 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                />
                <label htmlFor="floating_msg" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:left-0 peer-focus:text-blue-600">Your message</label>
              </div>
              <button type="submit" className="text-white bg-[#425BF5] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
