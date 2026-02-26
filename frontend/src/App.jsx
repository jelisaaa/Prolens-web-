import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './component/Header';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import MyRentals from './pages/MyRentals';
import Catalog from './pages/Catalog';
import ForgetPassword from './pages/ForgetPassword';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ProtectedRoute from './protected/ProtectedRoute';
import AddProduct from './pages/AddProduct';
import EnterShippingDetails from './pages/EnterShippingDetails';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import ViewAllCustomers from './pages/ViewAllCustomers';
import ViewProductList from './pages/ViewProductList';
import PlaceOrder from './pages/PlaceOrder';
import Cart from './pages/Cart';
import ProductViewDetails from './pages/ProductViewDetails';
import OrderHistory from './pages/OrderHistory';
import ViewAdminOrders from './pages/ViewAdminOrder';
import OrderDetailsAdmin from './pages/OrderdetailsAdmin';
import ViewCategories from './pages/ViewCategories';
import ViewOrders from './pages/ViewOrders';
import UserOrderDetails from './pages/UserOrderDetails';
import EditProduct from './pages/EditProduct';


function App() {
    return (
        <Router>
            <Toaster />
            <Header />
            <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/userdash" element={<UserDashboard />} />
                <Route path="/my-rentals" element={<MyRentals />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={["user", "admin"]} element={<Profile />} />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/addproduct" element={<AddProduct />} />
                <Route path="/shipping" element={<EnterShippingDetails />} />
                <Route path="/admindash" element={<ProtectedRoute allowedRoles={["admin"]} element={<AdminDashboard />} />}/>  
                <Route path="/" element={<LandingPage />} />
                <Route path="/viewallusers" element={<ViewAllCustomers />} />
                <Route path="/viewproductlist" element={<ViewProductList />} />
                <Route path="/placeorders" element={<PlaceOrder />} />
                <Route path="/viewcart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductViewDetails />} />

                <Route path="/vieworderhistory" element={<OrderHistory />} />
                <Route path="/viewadminorder" element={<ProtectedRoute allowedRoles={["admin"]} element={<ViewAdminOrders />} />} />
                <Route path="/admin/order/:id" element={<ProtectedRoute allowedRoles={["admin"]} element={<OrderDetailsAdmin />} />} />
                <Route path="/products" element={<ViewCategories />} />
                <Route path="/orders" element={<ViewOrders />} />
                <Route path="/order/:id" element={<ProtectedRoute allowedRoles={["user"]} element={<UserOrderDetails />} />} />

                <Route path="/editproduct/:id" element={<ProtectedRoute allowedRoles={["admin"]} element={<EditProduct />} />} />














            </Routes>
        </Router>
    )
}

export default App