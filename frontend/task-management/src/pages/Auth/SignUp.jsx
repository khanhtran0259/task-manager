import { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import Input from '../../components/inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useNavigate } from 'react-router-dom';
import uploadImage from '../../utils/upload'
import { UserContext } from '../../contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("")
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [adminInviteCode, setAdminInviteCode] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext)
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inviteCode = params.get('invite');
    if (inviteCode) {
      setAdminInviteCode(inviteCode);
    }
  }, [location]);
  const handleSignUp = async (e) => {
      e.preventDefault();
      let profileImageUrl = ''
      // if (!username) {
      //   setError("Username is required.");
      //   return;
      // }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!password) {
        setError("Password is required.");
        return;
      }
      if(confirmPassword !== password) {
        setError("Passwords do not match.");
        return;
      }

      setError("");
    try {
      if(profilePicture){profilePicture
        const imgUpload = await uploadImage(profilePicture);
        profileImageUrl = imgUpload.imageUrl || ""
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: username,
        email,
        phonenumber,
        password,
        imageUrl: profileImageUrl,
        adminInviteCode
      })
      const {token, role} = response.data.user
      if(token){
        localStorage.setItem("token", token)
        updateUser(response.data.user)
        if(role === "admin"){
          navigate("/admin/dashboard")
        }else{
          navigate("/user/dashboard")
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data.message || "Invalid email or password.");
      } else {
        console.log(error)
        setError("An error occurred while logging in. Please try again later.");
      }

    }
    };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create a New Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please fill in the details below to create an account.</p>
        <form onSubmit={handleSignUp} className='flex flex-col gap-4 w-full max-w-sm'>
          <ProfilePhotoSelector
            image={profilePicture}
            setImage={setProfilePicture}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
            <Input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email address"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Input
              type="phonenumber"
              label="Phone number"
              placeholder="Enter your phone number"
              value={phonenumber}
              onChange={({ target }) => setPhonenumber(target.value)}
            />
            
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
            />
            <Input
              type="text"
              label="Admin Invite Code (optional)"
              placeholder="Enter invite code if you have one"
              value={adminInviteCode}
              onChange={({ target }) => setAdminInviteCode(target.value)}
            />
           
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className="btn-primary"
          >
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">Login</Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default SignUp