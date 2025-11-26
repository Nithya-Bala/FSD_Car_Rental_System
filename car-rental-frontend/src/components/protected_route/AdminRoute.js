import {Navigate} from "react-router-dom";

function AdminRoute({children}){
    const user=JSON.parse(localStorage.getItem("user"))
    
    if (user?.role==="admin"){
        return children;
    }
    else{
        alert("Please login to continue");
        return <Navigate to="/login" />;
    }

}

export default AdminRoute;