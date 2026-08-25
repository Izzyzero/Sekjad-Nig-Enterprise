import { Navigate, Route, Routes } from "react-router-dom"

import {LandingPage} from '../pages/Home/LandingPage'
import {Register} from '../pages/Auth/Register/Register'
import {Login} from '../pages/Auth/Login/Login'
import {ForgotPasswordPage} from '../pages/Auth/ForgotPassword/ForgotPasswordPage'
import {VerifyOtp} from '../pages/Auth/VerifyOTP/VerifyOtp'
import {ResetPassword} from '../pages/Auth/ResetPassword/ResetPassword'
import {Gallery} from '../pages/Gallery/Gallery'
import {Profile} from '../pages/Account/Profile/Profile'
import {Orders} from '../pages/Account/Orders/Orders'
import {Wishlist} from '../pages/Account/Wishlist/Wishlist'
import {ShopPage} from '../pages/Shop/ShopPage'
import {ProductDetailsPage} from '../pages/Shop/ProductDetailsPage'
import {CartPage} from '../pages/Cart/CartPage'
import {AboutPage} from '../pages/About/AboutPage'
import {AdminLayout} from '../components/admin/AdminLayout'
import {AdminProductsPage} from '../pages/Admin/Products/AdminProduct'
import {AdminProductFormPage} from '../pages/Admin/Products/AdminProductForm'
import {AdminDashboardPage} from '../pages/Admin/Dashboard/AdminDashboard'
import {AdminOrdersPage} from '../pages/Admin/Orders/AdminOrders'
import {AdminOrderDetailPage} from '../pages/Admin/Orders/AdminOrderDetail'
import {AdminCategoriesPage} from '../pages/Admin/Categories/AdminCategories'
import PrivateRoute from './PrivateRoute'
import GuestRoute from './GuestRoute'
import AdminRoute from './AdminRoute'


function AppRoutes() {
  return (
 <Routes>
   <Route
     path="/"
     element={
       <GuestRoute>
         <LandingPage />
       </GuestRoute>
     }
   />
   <Route
     path="/home"
     element={
       <PrivateRoute>
         <LandingPage />
       </PrivateRoute>
     }
   />
   <Route path="/register" element={<Register />} />
   <Route path="/login" element={<Login />} />
   <Route path="/forgot-password" element={<ForgotPasswordPage />} />
   <Route path="/verify-otp" element={<VerifyOtp />} />
   <Route path="/reset-password" element={<ResetPassword />} />
   <Route path="/about-us" element={<AboutPage />} />
   <Route path="/about" element={<Navigate to="/about-us" replace />} />
   <Route
     path="/gallery"
     element={
       <PrivateRoute>
         <Gallery />
       </PrivateRoute>
     }
   />
   <Route
     path="/profile"
     element={
       <PrivateRoute>
         <Profile />
       </PrivateRoute>
     }
   />
   <Route
     path="/orders"
     element={
       <PrivateRoute>
         <Orders />
       </PrivateRoute>
     }
   /> 
  <Route
     path="/wishlist"
     element={
       <PrivateRoute>
         <Wishlist />
       </PrivateRoute>
     }
   />
   <Route
     path="/shop"
     element={
       <PrivateRoute>
         <ShopPage />
       </PrivateRoute>
     }
   />
   <Route
     path="/shop/product/:id"
     element={
       <PrivateRoute>
         <ProductDetailsPage />
       </PrivateRoute>
     }
   />
   <Route
     path="/cart"
     element={
       <PrivateRoute>
         <CartPage />
       </PrivateRoute>
     }
   />
   <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
     <Route index element={<AdminDashboardPage />} />
     <Route path="products" element={<AdminProductsPage />} />
     <Route path="products/new" element={<AdminProductFormPage />} />
     <Route path="products/:id/edit" element={<AdminProductFormPage />} />
     <Route path="categories" element={<AdminCategoriesPage />} />
     <Route path="orders" element={<AdminOrdersPage />} />
     <Route path="orders/:id" element={<AdminOrderDetailPage />} />
     <Route path="*" element={<Navigate to="/admin" replace />} />
   </Route>
 </Routes>
  )
}

export default AppRoutes
