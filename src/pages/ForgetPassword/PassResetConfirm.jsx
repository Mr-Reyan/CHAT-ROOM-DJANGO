import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PassResetConfirm = () => {
    const { uid, token } = useParams();
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const navigate = useNavigate()
    const changePassword = async () => {
        if (password === passwordAgain) {

            const response = await fetch("http://127.0.0.1:8000/api/password_reset_confirm/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid,
                    token,
                    password
                })
            })
            const data=await response.json()
            if(response.ok){
                console.log(data);
                
                toast.success("New Password has been set!.")
                navigate('/password-reset-done')
            } else{
                console.log(data);
            }
            
        } else {
            toast.error("Passwords should be same")
        }
    }
    return (
        <div>
            <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id=""
                placeholder='Enter new Password' />
            <input
                onChange={(e) => setPasswordAgain(e.target.value)}
                value={passwordAgain}
                type="password"
                name="password"
                id=""
                placeholder='Retype new Password' />
                <button onClick={changePassword}>Change Password</button>
        </div>
    )
}

export default PassResetConfirm