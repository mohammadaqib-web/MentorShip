import React, { useState } from 'react'
import Loader from '../components/loader';
import { faLock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Login = () => {

    const [user, setUser] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const login = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/loginUser`, user);
            toast.success(login.data.message);
            setLoading(false);
            localStorage.setItem("token", login.data.token);
            localStorage.setItem("user", JSON.stringify(login.data.user));
            dispatch({type:"LOGIN_SUCCESS",payload:login.data.user});
            navigate('/');
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='signup ps-3 pe-3'>
            <div className="signup-form">
                <form className='shadow-lg rounded' onSubmit={handleSubmit}>
                    <h2>Log In</h2>
                    <p>Please fill in this form to login!</p>
                    <hr />
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon pe-3 pt-2" style={{ marginLeft: "-4px" }}><FontAwesomeIcon icon={faPaperPlane} /></span>
                            <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email Address" required="required" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon pe-3 pt-2"><FontAwesomeIcon icon={faLock} /></span>
                            <input type="password" className="form-control" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" required="required" minlength="6" />
                        </div>
                    </div>
                    <hr />
                    <div className="form-group text-center">
                        <button id="submit-btn" type="submit" className="btn btn-primary btn-lg rounded">{loading ? <Loader /> : "Log In"}</button>
                    </div>

                    <p className='text-center'>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login