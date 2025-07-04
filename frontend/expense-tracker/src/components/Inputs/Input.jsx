import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e)}
        />
        {/* 
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye size={22} className="" />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )} */}

        {type === "password" && (
          <span
            onClick={toggleShowPassword}
            className="cursor-pointer text-slate-400 ml-2"
          >
            {showPassword ? (
              <FaRegEye size={22} />
            ) : (
              <FaRegEyeSlash size={22} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
