import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../pages/Home';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard'; 
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import UserProfile from '../pages/UserProfile';
import ForgetPassword from '../pages/ForgetPassword';
import ChangePassword from '../pages/ChangePassword';
import AddProject from '../pages/AddProject';
import Projects from '../pages/Projects';
import Category from '../pages/Category';
import ProjectDetails from '../pages/ProjectDetails';
import Contact from '../pages/Contact';
import ServicesPage from '../pages/ServicesPage';
import ActivationPage from '../pages/ActivationPage';
 



const Index = () => {
  return (
    <section>
      <AuthProvider>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route path="/" element={< Home />} />
            <Route path="/contact" element={< Contact />} />
            <Route path="/services" element={< ServicesPage />} />

            {/* <Route path='/' element={ <PublicRoute />}>  */}
              <Route path="/login" element={<SignIn/>} />
              <Route path="/registration" element={<SignUp/>} /> 
              <Route path="/projects" element={<Projects/>} /> 
              <Route path="/project/:id" element={<ProjectDetails/>} />  
              <Route path="/category/:categorySlug" element={<Category />} />
              <Route path="/accounts/active/:uid/:token" element={<ActivationPage />} />
            {/* </Route> */}

 
            {/* <Route path='/' element={<PrivateRoute />}> */}
              <Route path='/dashboard' element={<Dashboard/>} />
              <Route path='/profile' element={<UserProfile/>} />
              <Route path='/forget-password' element={<ForgetPassword/>} />
              <Route path='/change-password' element={<ChangePassword/>} />
              <Route path='/add-project' element={<AddProject/>} />
            {/* </Route> */}

          </Routes>
        <Footer />
        </BrowserRouter>
      </AuthProvider>
    </section>
  )
}

export default Index