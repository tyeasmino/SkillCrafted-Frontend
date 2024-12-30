import React, { useState } from 'react';
import axios from 'axios';
import forgetPasswordImg from '../assets/auth/forgotPassword.png';

const ForgetPassword = () => {
  // State to manage form input and feedback messages
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // Send POST request using Axios - http://127.0.0.1:8000/auth/password_reset/ 

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/password/reset/', {
        email: email,
      });

      // If the request is successful, show success message
      setSuccessMessage('Password reset email sent. Please check your inbox.');
      setEmail(''); // Clear the input field
    } catch (err) {
      // Handle errors (e.g., email not registered, server issues)
      if (err.response) {
        setError(err.response.data.detail || 'An error occurred, please try again.');
      } else {
        setError('Network error, please try again.');
      }
    }
  };

  return (
    <section>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between p-5 md:py-10 md:px-48">
        <div className="md:w-1/2 p-3 mt-5 md:mt-0 md:p-0 relative">
          <div className="max-w-lg mx-auto my-5">
            <h2 className="text-3xl font-semibold text-[#141A34]">Forgot your password?</h2>
            <p className="text-sm text-[#626677]"> Don't worry, happens to all of us. Enter your email below to recover your password </p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500 text-white p-2 mb-3 rounded">
              <p>{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 text-white p-2 mb-3 rounded">
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              className="text-white bg-[#425BF5] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 mb-5 md:mb-0 text-center"
            >
              Submit
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

export default ForgetPassword;
