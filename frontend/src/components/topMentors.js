import React from 'react'

const TopMentors = () => {
    return (
        <div className='text-center mt-5 container-fluid'>
            <h2 className='mentor-heading'>Top Mentors</h2>
            <div className="card-group mt-3">
                <div className="card ms-3 me-3">
                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" height="450rem" style={{objectFit:"cover"}} className="card-img-top mentor-card" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title" style={{display:"inline"}}>Walter White</h5>
                            <small><i> (Web Developer)</i></small>
                            <p className="card-text mt-3 text-secondary">My role involves guiding aspiring developers in mastering programming languages, frameworks, and best practices.</p>
                        </div>
                </div>
                <div className="card ms-3 me-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" height="450rem" style={{objectFit:"cover"}} className="card-img-top mentor-card" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title" style={{display:"inline"}}>Sarah Jhinson</h5>
                            <small><i> (Marketing)</i></small>
                            <p className="card-text mt-3 text-secondary">Gain invaluable insights, refine your strategies, and elevate your marketing game to new heights under my guidance.</p>
                        </div>
                </div>
                <div className="card ms-3 me-3">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" height="450rem" style={{objectFit:"cover"}} className="card-img-top mentor-card" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title" style={{display:"inline"}}>Aliyah</h5>
                            <small><i> (Content)</i></small>
                            <p className="card-text mt-3 text-secondary">Experienced in guiding aspiring writers to refine their skills and develop their unique voice in the competitive writing landscape.</p>
                        </div>
                </div>
                
            </div>
        </div>
    )
}

export default TopMentors