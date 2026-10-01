import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"

const LandingPage = lazy(() => import('../pages/Home/LandingPage').then((module) => ({ default: module.LandingPage })))
const Register = lazy(() => import('../pages/Auth/Register/Register').then((module) => ({ default: module.Register })))
const Login = lazy(() => import('../pages/Auth/Login/Login').then((module) => ({ default: module.Login })))
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPassword/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })))
const VerifyOtp = lazy(() => import('../pages/Auth/VerifyOTP/VerifyOtp').then((module) => ({ default: module.VerifyOtp })))
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword/ResetPassword').then((module) => ({ default: module.ResetPassword })))
const Profile = lazy(() => import('../pages/Account/Profile/Profile').then((module) => ({ default: module.Profile })))
const Orders = lazy(() => import('../pages/Account/Orders/Orders').then((module) => ({ default: module.Orders })))
const Wishlist = lazy(() => import('../pages/Account/Wishlist/Wishlist').then((module) => ({ default: module.Wishlist })))
const ShopPage = lazy(() => import('../pages/Shop/ShopPage').then((module) => ({ default: module.ShopPage })))
const ProductDetailsPage = lazy(() => import('../pages/Shop/ProductDetailsPage').then((module) => ({ default: module.ProductDetailsPage })))
const CartPage = lazy(() => import('../pages/Cart/CartPage').then((module) => ({ default: module.CartPage })))
const CheckoutPage = lazy(() => import('../pages/Checkout/CheckoutPage').then((module) => ({ default: module.CheckoutPage })))
const CheckoutReturnPage = lazy(() => import('../pages/Checkout/CheckoutPage').then((module) => ({ default: module.CheckoutReturnPage })))
const AboutPage = lazy(() => import('../pages/About/AboutPage').then((module) => ({ default: module.AboutPage })))
const ContactPage = lazy(() => import('../pages/Contact/ContactPage').then((module) => ({ default: module.ContactPage })))
const LegalPage = lazy(() => import('../pages/Legal/LegalPage').then((module) => ({ default: module.LegalPage })))
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const AdminLayout = lazy(() => import('../components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })))
const AdminProductsPage = lazy(() => import('../pages/Admin/Products/AdminProduct').then((module) => ({ default: module.AdminProductsPage })))
const AdminProductFormPage = lazy(() => import('../pages/Admin/Products/AdminProductForm').then((module) => ({ default: module.AdminProductFormPage })))
const AdminDashboardPage = lazy(() => import('../pages/Admin/Dashboard/AdminDashboard').then((module) => ({ default: module.AdminDashboardPage })))
const AdminOrdersPage = lazy(() => import('../pages/Admin/Orders/AdminOrders').then((module) => ({ default: module.AdminOrdersPage })))
const AdminOrderDetailPage = lazy(() => import('../pages/Admin/Orders/AdminOrderDetail').then((module) => ({ default: module.AdminOrderDetailPage })))
const AdminCategoriesPage = lazy(() => import('../pages/Admin/Categories/AdminCategories').then((module) => ({ default: module.AdminCategoriesPage })))
import PrivateRoute from './PrivateRoute'
import GuestRoute from './GuestRoute'
import AdminRoute from './AdminRoute'


function AppRoutes() {
  return (
 <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-charcoal/60" role="status">Loading page...</div>}>
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
   <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
   <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
   <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
   <Route path="/verify-email" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
   <Route path="/verify-otp" element={<Navigate to="/verify-email" replace />} />
   <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
   <Route path="/about-us" element={<AboutPage />} />
   <Route path="/about" element={<Navigate to="/about-us" replace />} />
  <Route path="/terms" element={<LegalPage documentKey="terms" />} />
  <Route path="/privacy" element={<LegalPage documentKey="privacy" />} />
   <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
  
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
   <Route path="/product/:id" element={<PrivateRoute><ProductDetailsPage /></PrivateRoute>} />
   <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
   <Route path="/checkout/return" element={<PrivateRoute><CheckoutReturnPage /></PrivateRoute>} />
  <Route path="*" element={<NotFoundPage />} />
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
 </Suspense>
  )
}

export default AppRoutes
