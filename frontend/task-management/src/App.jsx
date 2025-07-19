import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import PrivateRoute from './routes/PrivateRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageTask from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUser from './pages/Admin/ManageUser';
import UserDashboard from './pages/User/UserDashboard';
import UserTasks from './pages/User/UserTasks';
import TaskDetails from './pages/User/TaskDetails';
import UserProvider, { UserContext } from './contexts/UserContext';
import LoginAdmin from './pages/Auth/LoginAdmin';
import { Toaster } from 'react-hot-toast';
import Chat from './pages/chat/Chat'
const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<LoginAdmin />} />

          <Route path="/signup" element={<SignUp />} />

          
          {/* Private Routes for Admin */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/manage-tasks' element={<ManageTask />} />
            <Route path='/admin/create-task' element={<CreateTask />} />
            <Route path='/admin/manage-users' element={<ManageUser />} />
          </Route>
          {/* Routes for User*/}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/my-tasks' element={<UserTasks />} />
            <Route path='/user/task-details/:id' element={<TaskDetails />} />
          </Route>
            
            <Route element={<PrivateRoute allowedRoles={['admin', 'member']} />}>
              <Route path='/message' element={<Chat />} />
            </Route>
        <Route path="/" element={<Root />}/>
        </Routes>
      </Router>
    </div>
    <Toaster 
      toastOptions={{
        className: "",
        style: {
          fontSize: "13px"
        },
      }}  
      />
    </UserProvider>
  )
}

export default App

const Root=() =>{
  const {user, loading} = useContext(UserContext)
  if(loading) return <Outlet/>
  if(!user) return <Navigate to="/login"/>
  console.log(user.role)
  return user.role === "admin" ? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>
}
