import { faCheck, faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function OtpVerification() {

    const [firstInput, setFirstInput] = useState("");
    const [secondInput, setSecondInput] = useState("");
    const [thirdInput, setThirdInput] = useState("");
    const [fourthInput, setFourthInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const inputs = document.querySelectorAll("input");
        const button = document.querySelector("button");

        inputs.forEach((input, index1) => {
            input.addEventListener("keyup", (e) => {
                const currentInput = input;
                const nextInput = input.nextElementSibling;
                const prevInput = input.previousElementSibling;

                if (currentInput.value.length > 1) {

                    currentInput.value = "";

                    return;
                }

                if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
                    nextInput.removeAttribute("disabled");
                    nextInput.focus();
                }

                if (e.key === "Backspace") {
                    inputs.forEach((input, index2) => {
                        if (index1 <= index2 && prevInput) {
                            input.setAttribute("disabled", true);
                            input.value = "";
                            prevInput.focus();
                        }
                    });
                }

                if (!inputs[3].disabled && inputs[3].value !== "") {
                    button.classList.add("active");
                    return;
                }
                button.classList.remove("active");
            });
        });

        inputs[0].focus();

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener("keyup", () => { });
            });
        };
    }, []);

    const handleInputChange = (index, value) => {
        if (value.length > 1) {
          return; 
        }
      
        switch (index) {
          case 0:
            setFirstInput(value);
            break;
          case 1:
            setSecondInput(value);
            break;
          case 2:
            setThirdInput(value);
            break;
          case 3:
            setFourthInput(value);
            break;
          default:
            break;
        }
      };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const otp = firstInput + secondInput + thirdInput + fourthInput;
            const userId = localStorage.getItem("verifying ID");
            
            const verify = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/verifyOTP`,{otp,userId});
            toast.success(verify.data.message);
            localStorage.removeItem("verifying ID");
            localStorage.removeItem("verifying mail");
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleResendOTP = async(e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem("verifying ID");
            const email = localStorage.getItem("verifying mail");

            const resendOTP = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/resendOTP`,{userId,email});
            toast.success(resendOTP.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='container-fluid contain'>
            <div className="contain-container m-5 shadow-lg">
                <header>
                    <FontAwesomeIcon icon={faShield} style={{ height: "30px", marginTop: "-10px" }} />
                    <FontAwesomeIcon icon={faCheck} style={{ marginTop: "-23px", color: "#169178", height: "15px" }} />
                </header>
                <h4>Enter OTP Code</h4>
                <form onSubmit={handleOTPSubmit}>
                    <div className="input-field">
                        <input type="number" value={firstInput} onChange={(e) => handleInputChange(0, e.target.value)} />
                        <input type="number" value={secondInput} onChange={(e) => handleInputChange(1, e.target.value)} disabled />
                        <input type="number" value={thirdInput} onChange={(e) => handleInputChange(2, e.target.value)} disabled />
                        <input type="number" value={fourthInput} onChange={(e) => handleInputChange(3, e.target.value)} disabled />
                    </div>
                    <div className="resend text-end">
                        <a href="#" onClick={handleResendOTP}>Resend OTP</a>
                    </div>
                    <button type='submit'>Verify OTP</button>
                </form>
            </div>
        </div>
    );
}

export default OtpVerification;
