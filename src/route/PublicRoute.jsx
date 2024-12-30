import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate, Outlet } from 'react-router'

const PublicRoute = () => {
    const { user } = useContext(AuthContext)

  return user ? <Navigate to='/dashboard' /> : <Outlet />
}

export default PublicRoute