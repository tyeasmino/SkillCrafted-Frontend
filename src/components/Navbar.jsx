import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  // console.log('username: ', user.username) 

  console.log(user); 

  
  return (
    <section>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content text-white bg-[#141A34] rounded-box z-[1] mt-3 w-52 p-2 shadow shadow-[#425BF5]">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/projects'>Projects</Link></li>
              <li>
                <a>Profile</a>
                <ul className="p-2">
                  <li><a>skillCrafter</a></li>
                  <li><a>skillSeeker</a></li>
                </ul>
              </li>
              <li><a>About Us</a></li>
              <li><Link to='/services'>Services</Link></li>
              <li> <Link to='/contact'>Contact</Link> </li>
              
              <span className='flex gap-2 my-2'>
                {user ? (
                  <>
                    
                  </>  
                ) : (
                  <>
                  <hr />
                    <Link to='/login' className="text-[#425BF5] text-sm border border-[#425BF5] rounded px-3 py-1 hover:text-white hover:bg-[#425BF5]">Sign In</Link>
                    <Link to='/registration' className="text-white text-sm bg-[#425BF5] px-3 py-1 border border-[#425BF5] rounded hover:text-[#425BF5] hover:bg-transparent">Sign Up</Link>
                  </>
                )}
              </span>
            </ul>
          </div>
          <Link to='/'>
            <p className="btn text-[#425BF5] btn-ghost text-xl">skillCrafted</p>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/projects'>Projects</Link></li>
            <li>
              <details>
                <summary>Profile</summary>
                <ul className="p-2">
                  <li><a>skillCrafter</a></li>
                  <li><a>skillSeeker</a></li>
                </ul>
              </details>
            </li>
            <li><a>About Us</a></li>
            <li><Link to='/services'>Services</Link></li>
            <li><Link to='/contact'>Contact</Link></li>
          </ul>
        </div>
        <div className="navbar-end lg:flex gap-3">
          {user ? (
            <>
                <div className="dropdown relative">                    
                    <div tabIndex={0} role="button" className="text-[#425BF5] text-sm border border-[#425BF5] rounded px-5 py-1 hover:text-white hover:bg-[#425BF5] ">
                        { user.username }
                    </div>
                    <ul tabIndex={0} className="absolute top-12 right-0 menu menu-sm dropdown-content text-white bg-[#141A34] rounded-box z-[1] mt-3 w-52 p-2 shadow shadow-[#425BF5]">
                        <li><Link to='/dashboard'  className="  text-sm   rounded px-3 py-1 ">Dashboard</Link></li>
                        <li><Link to='/profile'  className="  text-sm   rounded px-3 py-1 ">Profile</Link></li>
                        <li><Link to='/change-password'  className="  text-sm   rounded px-3 py-1 ">Change Password</Link></li>
                        <li><Link to='/forget-password' className="  text-sm   rounded px-3 py-1 ">Forget Password</Link></li>
                        <hr />
                        <li><button onClick={logout} className="   text-sm  rounded px-3 py-1 ">Logout</button></li>
                    </ul>
                </div>
            </>
          ) : (
            <>
              <Link to='/login' className="text-[#425BF5] hidden md:block text-sm border border-[#425BF5] rounded px-5 py-1 hover:text-white hover:bg-[#425BF5]">Sign In</Link>
              <Link to='/registration' className="text-white text-sm hidden md:block bg-[#425BF5] px-5 py-1 border border-[#425BF5] rounded hover:text-[#425BF5] hover:bg-transparent">Sign Up</Link>
            </>
          )}
        </div> 
      </div>
    </section>
  );
};

export default Navbar;
