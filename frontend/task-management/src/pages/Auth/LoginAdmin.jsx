import { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
      const [phoneNumber, setPhoneNumber] = useState('');
      const [accessCode, setAccessCode] = useState('');
      const [step, setStep] = useState(1);
      const [error, setError] = useState('');
      const { updateUser } = useContext(UserContext);
      const navigate = useNavigate();

      const handleSendAccessCode = async (e) => {
            e.preventDefault();
            if (!phoneNumber) {
                  setError('Please enter your phone number.');
                  return;
            }
            setError('');
            try {
                  await axiosInstance.post(API_PATHS.ADMIN.CREATE_NEW_ACCESS_CODE, { phoneNumber });
                  setStep(2);
            } catch (err) {
                  setError('Failed to send access code. Please check your phone number.');
            }
      };

      const handleValidateAccessCode = async (e) => {
            e.preventDefault();
            if (!accessCode) {
                  setError('Please enter the access code.');
                  return;
            }
            setError('');
            try {
                  const response = await axiosInstance.post(API_PATHS.ADMIN.VALIDATE_ACCESS_CODE, {
                        phoneNumber,
                        accessCode
                  });
                  const { token, user } = response.data;
                  if (token && user) {
                        localStorage.setItem('token', token);
                        updateUser(user);
                        navigate('/admin/dashboard');
                  }
            } catch (err) {
                  setError('Invalid access code. Please try again.');
            }
      };

      return (
            <AuthLayout>
                  <div className="lg:w-[60vw] w-full h-full flex flex-col items-center justify-center">
                        <h3 className="text-xl font-semibold text-black">Admin Login</h3>
                        <p className="text-xs text-slate-700 mt-[5px] mb-6">
                              {step === 1 ? "Enter your phone number to receive access code." : "Enter the access code sent to your phone."}
                        </p>
                        <form onSubmit={step === 1 ? handleSendAccessCode : handleValidateAccessCode} className="flex flex-col gap-4 w-full max-w-sm">
                              {step === 1 && (
                                    <Input
                                          type="text"
                                          label="Phone Number"
                                          placeholder="Enter your phone number"
                                          value={phoneNumber}
                                          onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                              )}
                              {step === 2 && (
                                    <Input
                                          type="text"
                                          label="Access Code"
                                          placeholder="Enter the 6-digit code"
                                          value={accessCode}
                                          onChange={(e) => setAccessCode(e.target.value)}
                                    />
                              )}
                              {error && <p className="text-red-500 text-xs">{error}</p>}
                              <button type="submit" className="btn-primary">
                                    {step === 1 ? "Send Access Code" : "Validate & Login"}
                              </button>
                        </form>
                  </div>
            </AuthLayout>
      );
};

export default LoginAdmin;
