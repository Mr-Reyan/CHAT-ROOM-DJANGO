import React, { useState } from 'react'
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgetPass = () => {
    const navigate = useNavigate()
    const [email,setEmail] = useState('')
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{

            const response = await fetch(`http://127.0.0.1:8000/api/password_reset/`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({'email':email})
            })
            console.log("HEY");
            
            if(response.ok){
                const data = await response.json()
                toast.info(data.message)
                navigate('/password-reset-sent')
                setEmail('')
            }
        } catch(error){
            console.error(error)
            
        }
    }

    return (
        <div className='flex justify-center items-center w-screen h-screen bg-indigo-500'>
            <form onSubmit={handleSubmit} className='flex flex-col p-16 justify-center gap-10 min-h-[40%] w-[40%] bg-white rounded-4xl'>
                <div>
                    <h2 className='text-3xl font-medium text-center'>Reset Password</h2>
                </div>
                <div className='flex flex-col justify-center '>

                    
                    <label htmlFor="email">Email Address</label>
                    <input
                        required
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        type="email" name="email" placeholder='Email' className="flex-1 mt-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mb-2" />


                    <Button text="Reset Password"  />
                </div>

            </form>
        </div>
    )
}

export default ForgetPass