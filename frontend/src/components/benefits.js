import { faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const Benefits = () => {
  return (
    <div className='row g-0 p-5'>
        <div className='col-lg-6 my-auto'>
            <h2>Benefits of Mentorship that You will get Here</h2>
            <br/>
            <p><FontAwesomeIcon icon={faCheckCircle} style={{color:"green"}}/> Growing through shared experience to achieve goals, hone skills, and overcome challenges, etc</p>
            <p><FontAwesomeIcon icon={faCheckCircle} style={{color:"green"}}/> Mentors advise, mentees engage, grow together.</p>
            <p><FontAwesomeIcon icon={faCheckCircle} style={{color:"green"}}/> The mentoring service drives growth for mentors and mentees, fostering talent, leadership, and community.</p>
            <br/>
            <Link to='/about' className='btn rounded read-more text-light'>Read More <FontAwesomeIcon icon={faArrowRight} className='ms-1'/></Link>
        </div>
        <div className='col-lg-6 mt-5'>
            <img className='rounded' src='https://plus.unsplash.com/premium_photo-1663047250763-3ecbbd4262fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='benefits image' width="100%"/>
        </div>
    </div>
  )
}

export default Benefits