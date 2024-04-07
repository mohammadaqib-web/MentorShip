import { faBolt, faLocationDot, faPencil, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import Loader from '../components/loader'

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [mentee, setMentee] = useState({ name: "", domain: "", location: "", image: null });
    const [menteeOrg, setMenteeOrg] = useState({ name: "", domain: "", location: "", image: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mentor, setMentor] = useState({ name: "", skills: [], image: null, about: "", domain: "", location: "", company: "" });
    const [mentorOrg, setMentorOrg] = useState({ name: "", skills: [], image: null, about: "", domain: "", location: "", company: "" });
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        if (!user) {
            toast.error('You are unauthorized!');
            navigate('/');
        }
        if (user.role === "mentee") {
            fetchMenteeData();
        }
        if (user.role === "mentor") {
            fetchMentorData();
        }

    }, []);

    const reqConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const fetchMenteeData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mentee/profile`, reqConfig);
        const menteeData = response.data.mentee;
        setMenteeOrg(menteeData);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        setImagePreview(false)
    };
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', mentee.name);
        formData.append('domain', mentee.domain);
        formData.append('location', mentee.location);
        formData.append('image', mentee.image);

        try {
            const postMenteeData = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/mentee/updateData`, formData, reqConfig);
            toast.success(postMenteeData.data.message);
            setLoading(false);
            handleClose();
            fetchMenteeData();
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading();
        }
    }

    const handleImageChange = (e) => {
        e.preventDefault()
        const file = e.target.files[0];

        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
            setMentee({ ...mentee, image: file });
        } else {
            setImagePreview(null);
            setMentee({ ...mentee, image: null });
        }
    };

    const fetchMentorData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mentor/profile`, reqConfig);
        const mentorData = response.data.mentor;
        setMentorOrg(mentorData);
    }

    const handleImageChangeMentor = (e) => {
        e.preventDefault()
        const file = e.target.files[0];

        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
            setMentor({ ...mentor, image: file });
        } else {
            setImagePreview(null);
            setMentor({ ...mentor, image: null });
        }
    };

    const [mentorShow, setMentorShow] = useState(false);

    const handleCloseMentor = () => {
        setMentorShow(false)
        setImagePreview(false)
    };
    const handleShowMentor = () => setMentorShow(true);

    const handleSubmitMentor = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('name', mentor.name);
        formData.append('domain', mentor.domain);
        formData.append('location', mentor.location);
        formData.append('skills', mentor.skills);
        formData.append('company', mentor.company);
        formData.append('about', mentor.about);
        formData.append('image', mentor.image);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/mentor/updateData`, formData, reqConfig);
            toast.success(response.data.message);
            setLoading(false);
            handleCloseMentor();
            fetchMentorData();
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() !== "") { // Check if the newSkill is not empty
            setMentor(prevMentor => ({ ...prevMentor, skills: [...prevMentor.skills, newSkill] }));
            setNewSkill(""); // Clear the input field after adding the skill
        }
    };


    const handleRemoveSkill = (indexToRemove) => {
        setMentor(prevMentor => ({
            ...prevMentor,
            skills: prevMentor.skills.filter((_, index) => index !== indexToRemove)
        }));
    };


    return (
        <div className='container-fluid'>
            <Navbar />
            {user.role === "mentee" && <>
                <div id="background" className='mt-5'>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                </div>

                <div id="profile" style={{ marginTop: "7rem" }}>
                    <div className="containing glass shadow-lg" id="hero">
                        <div id="card-top" className=''></div>
                        <div id="user-profile" className="card glass">
                            <img src={menteeOrg && menteeOrg.image != null ? menteeOrg.image : "https://t4.ftcdn.net/jpg/01/06/92/47/360_F_106924759_7qPPu6bZNN2O4al1ExdEWBdHUcpKMwuJ.jpg"} alt="Profile Picture" id="profile-img" />
                            <h3 id="name" className="item">{menteeOrg ? menteeOrg.name : "Your name"}</h3>
                            <span id="role" className="item"><FontAwesomeIcon icon={faBolt} /> Mentee</span>

                            <span className="item">{menteeOrg ? menteeOrg.domain : "Your domain"}</span>
                            <span className="item">
                                <FontAwesomeIcon icon={faLocationDot} /> {menteeOrg ? menteeOrg.location : "Your location"}</span>
                            <button id="edit-profile" className="btn-profile" onClick={handleShow}>
                                <FontAwesomeIcon icon={faPencil} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </>}

            {user.role === "mentor" && <>
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
                            <img src={mentorOrg && mentorOrg.image != null ? mentorOrg.image : "https://t4.ftcdn.net/jpg/01/06/92/47/360_F_106924759_7qPPu6bZNN2O4al1ExdEWBdHUcpKMwuJ.jpg"} alt="Profile Picture" id="profile-img" />
                            <h3 id="name" className="item">{mentorOrg ? mentorOrg.name : "Your name"}</h3>
                            <span id="role" className="item"><FontAwesomeIcon icon={faBolt} /> Mentor</span>

                            <span className="item">{mentorOrg ? mentorOrg.domain : "Domain"} | {mentorOrg ? mentorOrg.company : "Company"}</span>
                            <span className="item">
                                <FontAwesomeIcon icon={faLocationDot} /> {mentorOrg ? mentorOrg.location : "Location"}</span>
                            <button id="edit-profile" className="btn-profile" onClick={handleShowMentor}>
                                <FontAwesomeIcon icon={faPencil} /> Edit Profile
                            </button>
                        </div>

                        <div id="user-skills" className="card glass">
                            <h2>Skills</h2>
                            <ul className="skill">
                                {mentorOrg ? mentorOrg.skills.join(',').split(',').map((skill, index) => (
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
                                {mentorOrg ? mentorOrg.about : "Add your about to show...."}
                            </p>
                        </div>
                        <div id="all-skills">
                            <h1>Skills</h1>
                            <ul className="skill">
                            {mentorOrg ? mentorOrg.skills.join(',').split(',').map((skill, index) => (
                                    <li className="badge" key={index}>{skill}</li>
                                )) : "Add skills to show...."}
                            </ul>
                        </div>
                    </div>
                </div>
            </>}

            {/* mentor form */}
            <Modal show={mentorShow} onHide={handleCloseMentor} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='bg-info text-center p-2 rounded'>Fields with <span className='text-danger'>*</span> signs are mandatory to fill!</p>
                    <label className='form-label'>Name <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Full Name" value={mentor.name} onChange={(e) => setMentor({ ...mentor, name: e.target.value })} />
                    <label className='form-label mt-3'>Domain <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Field you are interested in!" value={mentor.domain} onChange={(e) => setMentor({ ...mentor, domain: e.target.value })} />
                    <label className='form-label mt-3'>Location <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Your location" value={mentor.location} onChange={(e) => setMentor({ ...mentor, location: e.target.value })} />
                    <label className='form-label mt-3'>Skills <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Your skills" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                    <button className='btn btn-success d-flex' style={{ right: "1rem", marginTop: "-2.3rem", position: "absolute" }} onClick={handleAddSkill}>+</button>

                    <strong>{mentor.skills.map((skill, index) => (
                        <span key={index} className='me-4'>{skill} <FontAwesomeIcon className='text-danger me-5' style={{ fontSize: "0.8rem" }} icon={faX} onClick={() => handleRemoveSkill(index)} /></span>
                    ))}</strong>
                    <br />
                    <label className='form-label mt-3'>Company <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Your company" value={mentor.company} onChange={(e) => setMentor({ ...mentor, company: e.target.value })} />
                    <label className='form-label mt-3'>About <span className='text-danger'>*</span></label>
                    <textarea type='text' className="form-control" placeholder="About you" value={mentor.about} onChange={(e) => setMentor({ ...mentor, about: e.target.value })} />
                    <label className='form-label mt-3'>Profile Pic</label>
                    <input type='file' accept='image/jpg, image/png, image/jpeg,image/avif' className="form-control" onChange={(e) => handleImageChangeMentor(e)} />


                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt='Preview'
                            style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMentor}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmitMentor}>
                        {loading ? <Loader /> : "Save Changes"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* mentee form */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='bg-info text-center p-2 rounded'>Fields with <span className='text-danger'>*</span> signs are mandatory to fill!</p>
                    <label className='form-label'>Name <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Full Name" value={mentee.name} onChange={(e) => setMentee({ ...mentee, name: e.target.value })} />
                    <label className='form-label mt-3'>Domain <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Field you are interested in!" value={mentee.domain} onChange={(e) => setMentee({ ...mentee, domain: e.target.value })} />
                    <label className='form-label mt-3'>Location <span className='text-danger'>*</span></label>
                    <input type='text' className="form-control" placeholder="Your location" value={mentee.location} onChange={(e) => setMentee({ ...mentee, location: e.target.value })} />
                    <label className='form-label mt-3'>Profile Pic</label>
                    <input type='file' accept='image/jpg, image/png, image/jpeg' className="form-control" onChange={(e) => handleImageChange(e)} />


                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt='Preview'
                            style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {loading ? <Loader /> : "Save Changes"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default Profile