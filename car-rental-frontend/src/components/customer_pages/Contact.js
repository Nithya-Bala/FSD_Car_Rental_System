import { useState } from 'react';
import axios from 'axios';
import '../page_css/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/contact', formData);
      alert(res.data.message || "Message sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="contact-container py-5">
      <div className="contact-card shadow-lg">
        <h2>Contact Us</h2>
        <p className="subtext">We’d love to hear from you! Fill out the form below.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required />
          <input type="text" name="subject" placeholder="Subject (Optional)" onChange={handleChange} />
          <textarea name="message" rows="4" placeholder="Your Message" onChange={handleChange} required></textarea>
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-details">
          <p><strong>📧 Email:</strong> support@carrental.com</p>
          <p><strong>📍 Address:</strong> 123 Main Street, Chennai, India</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;

// import { useState } from 'react';
// import axios from 'axios';
// import '../page_css/form.css';

// function Contact() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:5000/contact', formData);
//       alert(res.data.message || "Message sent successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to send message.");
//     }
//   };

//   return (
//     <div className="form-container d-flex align-items-center justify-content-center min-vh-100">
//       <div className="card form-card shadow-lg">
//         <div className="card-body">

//           <h2 className="text-center mb-4">Contact Us</h2>
//           <p className="subtext">We’d love to hear from you! Fill out the form below.</p>

//           <form onSubmit={handleSubmit}>

//             <div className='mb-3'>
//               <input type="text" name="name" placeholder="Your Name" onChange={handleChange} className="form-control" required />
//             </div>
//             <div className='mb-3'>
//               <input type="email" name="email" placeholder="Your Email" onChange={handleChange} className="form-control" required />
//             </div>
            
//             <div className='mb-3'>
//               <input type="text" name="subject" placeholder="Subject (Optional)" onChange={handleChange} className="form-control" />
//             </div>
//             <div className='mb-3'>
//               <textarea name="message" rows="4" placeholder="Your Message" onChange={handleChange} required></textarea>
//             </div>
            
//             <button type="submit" className="btn btn-primary w-100">Send Message</button>
//           </form>

//           <div className="text-center mt-3">
//             <p><strong>📧 Email:</strong> support@carrental.com</p>
//             <p><strong>📍 Address:</strong> 123 Main Street, Chennai, India</p>
//           </div>

//         </div>
        
//       </div>
//     </div>
//   );
// }

// export default Contact;

