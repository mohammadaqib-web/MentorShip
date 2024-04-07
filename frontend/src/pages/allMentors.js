import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/footer';

const AllMentors = () => {
    const [search, seStSearch] = useState("");
    const [mentors, setMentors] = useState();

    useEffect(() => {
        fetchMentors();
    }, [])

    const fetchMentors = async () => {
        const allMentors = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mentor/allMentors`);
        setMentors(allMentors.data.mentors);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        
        try {
            const searchMentor = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/mentor/searchMentor`,{search});
            console.log(searchMentor);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Navbar />

            <div style={{ height: "20vh" }} className='bg-body-secondary'>
                <div className='container-fluid bg-body-secondary d-flex justify-content-center' style={{ padding: "8rem", marginTop: "3rem" }}>
                    <input type='text' className='form-control me-3 rounded search-bar' value={search} onChange={(e) => seStSearch(e.target.value)} placeholder='Search by Name, Location or domain' style={{ width: "20vw" }} />
                    <button className='btn btn-dark rounded' type='submit' onClick={handleSearch}>Search</button>
                </div>
            </div>

            <div className='container-fluid mt-5 mentor-cardd mb-5' style={{ paddingTop: "8rem" }}>
                <h2 className='text-center text-decoration-underline'>Mentors</h2>
            </div>

            <div className='container-fluid mentor-data'>
                {mentors ? mentors.map((mentor, index) => (
                    <div className='mx-auto border shadow-lg row mentor-alldata mt-5' style={{ width: "60vw" }} key={index}>
                        <div className='col-md-3 p-3'>
                            <img src={mentor.image} alt='' width="100%" className='rounded' />
                        </div>
                        <div className='col-md-9 p-3'>
                            <h3 style={{display:"inline"}}>{mentor.name}</h3><span> <FontAwesomeIcon icon={faCheckCircle} className='text-primary ms-2 mb-1'></FontAwesomeIcon></span>
                            <h5 className='text-secondary'>{mentor.domain} At <h5 className='text-dark' style={{ display: "inline", fontWeight: "bold" }}>{mentor.company}</h5></h5>
                            <p className='pt-2' style={{ fontSize: "1.2rem" }}>{mentor.about}</p>
                            {mentor.skills.join(',').split(',').map((skill, index) => (
                                <li className="badge" style={{fontSize:"1rem"}} key={index}>{skill}</li>
                            ))}
                            <Link className='btn view-profile-btn' to={`/profile/${mentor.userId}`}>View Profile</Link>
                        </div>
                    </div>
                ))

                    : <h5 className='text-center'>No Mentors Found!</h5>}
            </div>

            <Footer/>
        </div>
    )
}

export default AllMentors