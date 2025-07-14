import React, { useContext } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../contexts/UserContext'

const UserDashboard = () => {
  useUserAuth()
  const {user} = useContext(UserContext)
  return (
    <div>User Dashboard
      
    </div>
  )
}

export default UserDashboard