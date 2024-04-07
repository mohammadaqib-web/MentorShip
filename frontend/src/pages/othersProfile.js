import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faComments, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const OthersProfile = () => {
    const params = useParams();
    const [mentorData,setMentorData] = useState();
    const navigate = useNavigate();
    
    useEffect(()=>{
        fetchData();
    },[])

    const fetchData=async()=>{
        try {
            const getMentorData = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mentor/${params.id}`);
            setMentorData(getMentorData.data.mentor);
        } catch (error) {
            toast.error(error.response.data.message);
            navigate('/mentors')
        }

    }

  return (
    <div>
        <Navbar/>

                <div id="background" className='mt-5'>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>

                <div id="profile" style={{ marginTop: "7rem" }}>
                    <div className="containing glass" id="hero">
                        <div id="card-top" className=''></div>
                        <div id="user-profile" className="card glass">
                            <img src={mentorData && mentorData.image != null ? mentorData.image : "https://t4.ftcdn.net/jpg/01/06/92/47/360_F_106924759_7qPPu6bZNN2O4al1ExdEWBdHUcpKMwuJ.jpg"} alt="Profile Picture" id="profile-img" />
                            <h3 id="name" className="item">{mentorData ? mentorData.name : "Your name"}</h3>
                            <span id="role" className="item"><FontAwesomeIcon icon={faBolt} /> Mentor</span>

                            <span className="item">{mentorData ? mentorData.domain : "Domain"} | {mentorData ? mentorData.company : "Company"}</span>
                            <span className="item">
                                <FontAwesomeIcon icon={faLocationDot} className='text-danger'/> {mentorData ? mentorData.location : "Location"}</span>
                            <span className='text-primary'>Wanna take some Advice? <FontAwesomeIcon icon={faComments} className='mt-3 fs-4 text-success'/></span>
                        </div>

                        <div id="user-skills" className="card glass">
                            <h2>Skills</h2>
                            <ul className="skill">
                                {mentorData ? mentorData.skills.join(',').split(',').map((skill, index) => (
                                    <li className="badge" key={index}>{skill}</li>
                                )) : ""}
                                <a href="#all-skills">view more...</a>
                            </ul>

                        </div>
                    </div>
                </div>

                <div id="user-bio" style={{ marginTop: "5rem" }}>
                    <div className="containing glass">
                        <div id="about-user">
                            <h1 id="">About</h1>
                            <p id="user-desc">
                                {mentorData ? mentorData.about : "No about to show...."}
                            </p>
                        </div>
                        <div id="all-skills">
                            <h1>Skills</h1>
                            <ul className="skill">
                            {mentorData ? mentorData.skills.join(',').split(',').map((skill, index) => (
                                    <li className="badge" key={index}>{skill}</li>
                                )) : "No skills to show...."}
                            </ul>
                        </div>
                    </div>
                </div>

        <Footer/>
    </div>
  )
}

export default OthersProfile