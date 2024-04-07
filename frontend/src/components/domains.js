import { faBasketball, faEye, faGraduationCap, faHeartPulse, faInfinity, faMobile, faMoneyBill, faPenNib, faRocket, faStar, faSun, faVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const Domains = () => {
    return (
        <div className='text-center mt-4 container-fluid'>
            <h2 className='domain-heading'>Domains We Offer</h2>
            <div className='row g-0 justify-content-center'>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faEye} className='text-warning'/><span className='ps-3'>Web Development</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faInfinity} className='text-primary'/><span className='ps-3'>Digital Marketing</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faGraduationCap} className='text-danger'/><span className='ps-3'>Data Science & Analytics</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faPenNib} className='text-info'/><span className='ps-3'>Graphic Design</span></div>
            
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faMobile} className='text-dark'/><span className='ps-3'>Mobile App Development</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faStar} className='text-warning'/><span className='ps-3'>Leadership & Management Skills</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faMoneyBill} className='text-success'/><span className='ps-3'>Financial Planning</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faVideo} className='text-primary'/><span className='ps-3'>Creative Writing</span></div>
            
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faRocket} className='text-danger'/><span className='ps-3'>Software Development</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faBasketball} className='text-dark'/><span className='ps-3'>Career Transition Planning</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faHeartPulse} className='text-danger'/><span className='ps-3'>Artificial Intelligence</span></div>
                <div className='col-lg-3 col-md-5 col-sm-1 domain-cell'><FontAwesomeIcon icon={faSun} className='text-warning'/><span className='ps-3'>UI/UX Design</span></div>
            </div>
        </div>
    )
}

export default Domains