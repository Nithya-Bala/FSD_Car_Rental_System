import "./page_css/WelcomeBanner.css";

function WelcomeBanner({ user }) {
  var name = '';
  if (user?.role==="customer"){
    name=user.name
  }
  else if(user?.role==='admin'){
    name="Admin"
  }
  else{
    name="Guest"
  }

  return (
    <div className="welcome-wrapper">
      <div className="welcome-banner">
        <h1>
          <span className="wave text-center"></span> Welcome, <span className="name">{name}!</span>
        </h1>
    
      </div>
    </div>
  );
}

export default WelcomeBanner;
