import React from 'react'

const Hero = () => {
    return (
        <div>
            <div className="card text-bg-dark"  style={{zIndex:"-2"}}>
                <img src="https://images.unsplash.com/photo-1644132246573-bc75ce0a2946?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="card-img" alt="..." style={{height:"100vh",zIndex:"-1",opacity:"0.3",objectFit:"cover"}}/>
                    <div className="card-img-overlay d-flex justify-content-center align-items-center" style={{flexDirection:"column"}}>
                        <h1 className="card-title">Welcome to mentorship's magic, where dreams soar and guidance ignites!</h1>
                        <br/>
                        <h5 className="card-text img-card-text">Mentors advise, mentees engage, grow together.</h5>
                    </div>
            </div>
        </div>
    )
}

export default Hero