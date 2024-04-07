import { faCopyright } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='mt-5 bg-tertiary container-fluid ps-5 pe-5 bg-body-secondary'>
        <div className='row g-0'>
            <div className='col-md-4 pt-4'>
                <h1 className='navbar-brand'>M E N T O R</h1>
                <i className='text-secondary'>14, Cantt <br/>Lucknow, UP 226001</i>
                <br/>
                <br/>
                <strong>Phone:</strong> <p style={{display:"inline"}} className='text-secondary'>+91 XXXX-XXX-XXX</p>
                <br/>
                <strong>E-mail:</strong> <p style={{display:"inline"}} className='text-secondary'>mentor@gmail.com</p>
            </div>
            <div className='col-md-4 pt-4'>
                <h5>Useful Links</h5>
                <Link to='/' className='text-secondary' style={{textDecoration:"none"}}>Home</Link>
                <br/>
                <Link to='/about' className='text-secondary' style={{textDecoration:"none"}}>About Us</Link>
                <br/>
                <Link to='/contact' className='text-secondary' style={{textDecoration:"none"}}>Contact Us</Link>
            </div>
            <div className='col-md-4 pt-4'>
                <h5>Our Domains</h5>
                <Link to='/mentors' className='text-secondary' style={{textDecoration:"none"}}>Web Development</Link>
                <br/>
                <Link to='/mentors' className='text-secondary' style={{textDecoration:"none"}}>Product Management</Link>
                <br/>
                <Link to='/mentors' className='text-secondary' style={{textDecoration:"none"}}>Marketing</Link>
                <br/>
                <Link to='/mentors' className='text-secondary' style={{textDecoration:"none"}}>Graphic Design</Link>
                <br/>
                <Link to='/mentors' className='text-secondary' style={{textDecoration:"none"}}>UI/UX Design</Link>
                <br/>
            </div>
        </div>
        <hr/>
        <div className='row text-center'>
            <p><FontAwesomeIcon icon={faCopyright} className='pe-2'/>M E N T O R <span className='ps-2 text-secondary'>All Rights Reserved.</span></p>
        </div>
    </div>
  )
}

export default Footer