import {Navigate} from 'react-router-dom';

function CustomerRoute({children}){

    const user=JSON.parse(localStorage.getItem("user"))

    if (user?.role==="customer"){
        return children
    }
    else{
        alert("Please login to continue");
        return <Navigate to="/login" />;
        
    }
}

export default CustomerRoute;