import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";



const Footer = () => {
  return (
    <section>
        <footer className=" bg-[#141A34] text-base-content p-10">
            <div className='footer py-10 md:px-40'>
                <aside className='flex flex-col gap-3 md:gap-10'>
                    <h2 className='text-[#425BF5] font-bold text-[20px]'>skillCrafted</h2>
                    
                    <p className='text-white text-sm'>
                    Industries Ltd.
                    <br />
                    Providing reliable tech since 2024
                    </p>
                    <div className='text-[#141A34] flex gap-2 text-[20px] md:mt-5'>
                        <FaFacebookF className='bg-[#babece] hover:bg-[#425BF5] p-1 rounded-full' />
                        <FaYoutube className='bg-[#babece] hover:bg-[#425BF5] p-1 rounded-full' />
                        <FaLinkedinIn className='bg-[#babece] hover:bg-[#425BF5] p-1 rounded-full' />
                        <FaTwitter className='bg-[#babece] hover:bg-[#425BF5] p-1 rounded-full' />
                        <FaInstagram className='bg-[#babece] hover:bg-[#425BF5] p-1 rounded-full' />

                    </div>
                </aside>
                <nav className='text-white'>
                    <h6 className="footer-title text-white">Quick Links</h6>
                    <a className="link link-hover">Home</a>
                    <a className="link link-hover">Services</a>
                    <a className="link link-hover">skillCrafters</a>
                    <a className="link link-hover">Employers</a>
                    <a className="link link-hover">Projects</a>
                    <a className="link link-hover">About Us</a>
                    <a className="link link-hover">Testimonials</a>
                    <a className="link link-hover">Blog</a>
                    <a className="link link-hover">Support Page</a>
                </nav>
                <nav className='text-white'>
                    <h6 className="footer-title text-white">Resources</h6>
                    <a className="link link-hover">FAQ</a>
                    <a className="link link-hover">Help Center</a>
                    <a className="link link-hover">Pricing</a>
                    <a className="link link-hover">Payment method</a>
                    <a className="link link-hover">Careers</a>
                    <a className="link link-hover">Contact Us</a>
                </nav>
                <nav className='text-white'>
                    <h6 className="footer-title text-white">Terms</h6>
                    <a className="link link-hover">Privacy Policy</a>
                    <a className="link link-hover">Terms and Conditions</a>
                    <a className="link link-hover">Copyright Policy</a>
                    <a className="link link-hover">Code of Conduct</a>
                    <a className="link link-hover">Fees and Charged</a> 
                </nav>        
            </div>     
            <hr />
            <span className="footer footer-center  text-base-content p-2 md:p-4">
                <aside>
                    <p className='text-white'>skillCrafted Freelancer and Project - © {new Date().getFullYear()} All Right Reserved</p>
                </aside>
            </span>
        </footer>
    </section>
  )
}

export default Footer