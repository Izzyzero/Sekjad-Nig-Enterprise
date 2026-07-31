import { Route, Routes } from "react-router-dom"

import {LandingPage} from '../pages/Home/LandingPage'
import {Register} from '../pages/Auth/Register/Register'
import {Login} from '../pages/Auth/Login/Login'
import {ForgotPasswordPage} from '../pages/Auth/ForgotPassword/ForgotPasswordPage'
import {VerifyOtp} from '../pages/Auth/VerifyOTP/VerifyOtp'
import {ResetPassword} from '../pages/Auth/ResetPassword/ResetPassword'

function AppRoutes() {
  return (
 <Routes>
   <Route path="/" element={<LandingPage />} />
   <Route path="/register" element={<Register />} />
   <Route path="/login" element={<Login />} />
   <Route path="/forgot-password" element={<ForgotPasswordPage />} />
   <Route path="/verify-otp" element={<VerifyOtp />} />
   <Route path="/reset-password" element={<ResetPassword />} />
 </Routes>
  )
}

export default AppRoutes
