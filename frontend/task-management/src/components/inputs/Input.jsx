import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ type, label, placeholder, value, onChange }) => {
      const [showPassword, setShowPassword] = useState(false);
      const togglePasswordVisibility = () => setShowPassword(!showPassword);

      return (
            <div className="flex flex-col gap-1">
                  <label className="text-[13px] text-slate-800">{label}</label>
                  <div className="flex items-center border border-gray-300 rounded px-2 py-1">
                        <input
                              type={type === "password" ? (showPassword ? "text" : "password") : type}
                              placeholder={placeholder}
                              className="w-full bg-transparent outline-none"
                              value={value}
                              onChange={(e) => onChange(e)}
                        />
                        {type === "password" && (
                              showPassword ? (
                                    <FaRegEye
                                          size={20}
                                          className="text-primary cursor-pointer"
                                          onClick={togglePasswordVisibility}
                                    />
                              ) : (
                                    <FaRegEyeSlash
                                          size={20}
                                          className="text-slate-400 cursor-pointer"
                                          onClick={togglePasswordVisibility}
                                    />
                              )
                        )}
                  </div>
            </div>
      );
};

export default Input;
