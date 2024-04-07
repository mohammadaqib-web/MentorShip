import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Chat = () => {

    const navigate = useNavigate();
    const [allChats, setAllChats] = useState();
    const [receiver, setReceiver] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            toast.error("Kindly login first!");
            navigate('/login');
        }

        fetchChats()
    }, [])

    const reqConfig = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }

    const user = JSON.parse(localStorage.getItem("user"))

    const fetchChats = async () => {
        try {
            const getAllChats = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/chats`, reqConfig);
            const chats = getAllChats.data.chat;

            // Fetch mentor data...
            const mentors = [];
            for (const chat of chats) {
                const participants = chat.chatBetween.filter(id => id !== user.id);
                for (const participantId of participants) {
                    try {
                        const mentorData = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user/getUser/${participantId}`);
                        mentors.push(mentorData.data.user);
                    } catch (error) {
                        toast.error(error.response.data.message);
                    }
                }
            }
    
            setReceiver(mentors); // Update receiver with mentor data
            setAllChats(chats); // Update component state with chats
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    const [chat,setChat] = useState();
    const openChat = async(user)=>{
        setChat(user);
    }

    return (
        <div>
            <Navbar />

            <div className='container-fluid' style={{ minHeight: "80vh", marginTop: "3rem" }}>
                <div className='row' style={{ minHeight: "91vh" }}>
                    <div className='col-md-3 bg-body-secondary'>
                        <h2 className='pt-4 text-center'>Chats</h2>
                        <div className='container-fluid row'>
                            {receiver.map((user,index) => (<>
                            <hr/>
                            <div className='col-3' key={index} onClick={(e)=>openChat(user)}>
                            <img src='https://t4.ftcdn.net/jpg/01/06/92/47/360_F_106924759_7qPPu6bZNN2O4al1ExdEWBdHUcpKMwuJ.jpg' width="50vw" height="50vh" style={{borderRadius:"50%",marginTop:"-12px",padding:"1px 0px"}}/>
                        </div>
                        <div className='col-9' onClick={(e)=>openChat(user)}>
                            <h5>{user.fullname}</h5>
                        </div>
                        <hr/>
                          </> ))}

                        </div>
                    </div>
                    <div className='col-md-9'>
                        {chat&&
                            <div className='mt-4 ms-5'>
                                <h3>{chat.fullname}</h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat