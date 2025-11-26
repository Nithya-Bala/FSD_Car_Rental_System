import { BrowserRouter,Routes,Route ,Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import VehicleList from "./components/VehicleList";
import Contact from "./components/customer_pages/Contact";
import Profile from "./components/customer_pages/Profile";
import Lease from "./components/customer_pages/Lease";
import UploadVehicle from "./components/admin_pages/UploadVehicle"
import AdminVehicleList from "./components/admin_pages/AdminVehicleList";
import Register from "./components/Register";
import Login from "./components/Login";
import './App.css'
import AdminRoute from "./components/protected_route/AdminRoute";
import CustomerRoute from "./components/protected_route/CustomerRoute";
import LeaseHistory from "./components/customer_pages/LeaseHistory";
import Leases from "./components/admin_pages/Leases";
import AboutUs from "./components/AboutUs";


function App(){
 

  const user=JSON.parse(localStorage.getItem("user"))
  return(
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<VehicleList/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/about" element={<AboutUs/>} />


        {/* Customer-routes */}
        <Route path='/profile' element={<CustomerRoute><Profile/></CustomerRoute>}/>
        <Route path='/lease' element={ <CustomerRoute><Lease/></CustomerRoute>}/>
        <Route path='/history' element={<CustomerRoute><LeaseHistory/></CustomerRoute>}/>

        {/* Admin-routes */}
        <Route path='/admin/manage' element={<AdminRoute><AdminVehicleList/></AdminRoute>}/>
        <Route path='/admin/upload' element={<AdminRoute><UploadVehicle /></AdminRoute>}/>
        <Route path='/admin/leases' element={<AdminRoute><Leases/></AdminRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;