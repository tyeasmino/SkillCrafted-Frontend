// import React, { useContext } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';

// const PrivateRoute = ({ Component }) => {
//   const { user } = useContext(AuthContext); 

//   return user ? <Component /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;


import React, { Children, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log(user);

 
  if (!user) {
    return <Navigate to="/login" />;
  }


  return children ;
};

export default PrivateRoute;