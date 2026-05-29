import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  emailId: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        navigate('/');
      } else {
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-retro-brown">
      <h1 className="font-retro text-4xl md:text-5xl text-center mb-12 drop-shadow-[4px_4px_0_rgba(79,70,229,0.2)] text-retro-light tracking-widest">EVENT MANIA</h1>
      <div className="retro-card">
        <h2 className="text-xl font-bold mb-6 text-center">ACCOUNT LOGIN</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block font-bold text-retro-light mb-2">EMAIL</label>
            <input 
              type="email" 
              {...register('emailId')}
              className="retro-input"
              placeholder="email@example.com"
            />
            {errors.emailId && <p className="text-retro-error text-sm mt-1">{errors.emailId.message}</p>}
          </div>

          <div>
            <label className="block font-bold text-retro-light mb-2">PASSWORD</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                {...register('password')}
                className="retro-input pr-16"
                placeholder="********"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500 hover:text-retro-accent"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {errors.password && <p className="text-retro-error text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="retro-btn w-full text-center flex justify-center items-center h-14"
          >
            {loading ? 'LOADING...' : 'LOGIN'}
          </button>
        </form>
        <div className="mt-6 text-center font-bold text-sm">
          <span className="text-retro-light/70">NEED AN ACCOUNT? </span>
          <Link to="/register" className="text-retro-accent hover:text-retro-hover underline decoration-dashed underline-offset-4">REGISTER HERE</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
