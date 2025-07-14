import { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [message, setMessage] = useState("");      // Hiển thị thông báo thành công
  const [error, setError] = useState("");          // Hiển thị lỗi
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSendLoginCode = async () => {
    setMessage("");
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setIsSendingCode(true);
      await axiosInstance.post(API_PATHS.USERS.CREATE_LOGIN_CODE, { email });
      setMessage("✅ Login code has been sent to your email!");
    } catch (error) {
      console.error(error);
      setError("Failed to send login code. Please try again later.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleLoginWithCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!loginCode || loginCode.trim() === '') {
      setError("Please enter the login code.");
      return;
    }
    try {
      const response = await axiosInstance.post(API_PATHS.USERS.VALIDATE_LOGIN_CODE, {
        email,
        code: loginCode
      });
      const { token, role } = response.data.user;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data.user);
        navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      }
    } catch (error) {
      console.error(error.response?.data);
      setError("Invalid or expired login code.");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[60vw] w-full h-full flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold text-black">Login with Email Code</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your email to receive a login code.
        </p>

        <form onSubmit={handleLoginWithCode} className="flex flex-col gap-4 w-full max-w-sm">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSendLoginCode}
            disabled={isSendingCode}
            className={`btn-primary ${isSendingCode ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSendingCode ? "Sending..." : "Send Login Code"}
          </button>

          <Input
            type="text"
            label="Login Code"
            placeholder="Enter the code sent to your email"
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            Login
          </button>

          {/* Hiển thị thông báo */}
          {message && <p className="text-green-600 text-xs mt-2">{message}</p>}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
