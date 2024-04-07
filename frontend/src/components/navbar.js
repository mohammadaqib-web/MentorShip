import React, { useEffect, useState } from 'react'
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        if (user) setLoggedIn(true);
    }, [loggedIn])

    const handleLogout = async(e)=>{
        e.preventDefault();

        try {
            dispatch({type:"LOGIN_ERROR"});
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            toast.success("You are logged out!");
            setLoggedIn(false);
            navigate('/');
        } catch (error) {
            toast.error("Error Occurred!");
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand col-lg-8 ps-3" href="/">M E N T O R</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse col-lg-4" id="navbarNavAltMarkup">
                        <div className="navbar-nav mt-2 mx-auto">
                            <Link className="nav-link pe-4 nav-text" to='/mentors'>Browse Mentors</Link>
                            {loggedIn&&<Link className="nav-link pe-4 nav-text" to='/profile'>Profile</Link>}
                            {loggedIn ?
                                <div className="dropdown">
                                    <button className="btn user-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FontAwesomeIcon icon={faUserCircle} className='fs-3' />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li className='border-bottom'><Link className="dropdown-item" to="/chat">Chat</Link></li>
                                        <li><Link className="dropdown-item" onClick={handleLogout}>Log Out</Link></li>
                                    </ul>
                                </div>

                                :
                                <Link className="mb-1 btn btn-light rounded" to='/login' style={{ marginTop: "2px" }}>Log In</Link>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar