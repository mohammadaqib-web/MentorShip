import React, { useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faLock, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import './style.css'
import { toast } from 'react-toastify';
import Loader from '../components/loader';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {

    const [user,setUser] = useState({fullname:"",email:"",role:"",password:""});
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        
        try {
            setLoading(true);
            const signup = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/addUser`,user);
            toast.success(signup.data.message);
            setLoading(false);
            localStorage.setItem("verifying ID",signup.data.data.userId);
            localStorage.setItem("verifying mail",signup.data.data.email);
            navigate('/otp-verification');
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='signup ps-3 pe-3'>
            <div className="signup-form">
                    <form className='shadow-lg rounded' onSubmit={handleSubmit}>
                        <h2>Sign Up</h2>
                        <p>Please fill in this form to create an account!</p>
                        <hr/>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon pe-3 pt-2"><FontAwesomeIcon icon={faUser}/></span>
                                    <input type="text" className="form-control" value={user.fullname} onChange={(e) => setUser({...user, fullname: e.target.value})} placeholder="Full Name" required="required"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon pe-3 pt-2" style={{marginLeft:"-4px"}}><FontAwesomeIcon icon={faPaperPlane}/></span>
                                    <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder="Email Address" required="required"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon pe-3 pt-2"><FontAwesomeIcon icon={faUser}/></span>
                                    <select className="form-control" value={user.role} onChange={(e) => setUser({...user, role: e.target.value})} required>
                                        <option value="" disabled>Select Role <FontAwesomeIcon icon={faArrowAltCircleDown}/></option>
                                        <option value="mentee">Mentee</option>
                                        <option value="mentor">Mentor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon pe-3 pt-2"><FontAwesomeIcon icon={faLock}/></span>
                                    <input type="password" className="form-control" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder="Password" required="required" minlength="6"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-inline"><input type="checkbox" required="required"/> I accept the <a href="/terms-of-use">Terms of Use</a> &amp; <a href="privacy-policy">Privacy Policy</a></label>
                            </div>
                            <div className="form-group text-center">
                                <button id="submit-btn" type="submit" className="btn btn-primary btn-lg rounded">{loading?<Loader/>:"Sign Up"}</button>
                            </div>
                            <p className='text-center'>Already have an account? <Link to='/login'>Log In</Link></p>
                    </form>
            </div>
        </div>
    )
}

export default Signup