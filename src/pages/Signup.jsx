import React, { useState } from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { toast } from 'react-toastify'

const Signup = () => {
    const [form, setForm] = useState({ email: "", username: "", password: "" })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const response = await fetch('http://127.0.0.1:8000/api/signup/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            })
            const data = await response.json()

            if(!response.ok){
                const errorMsg = Object.values(data).flat()[0]
                toast.error(errorMsg)
                
                return
            }
            toast.success("Signup Successful!")
            setTimeout(() => {
                navigate("/login")
            }, 1000);


        } catch (error) {
            toast.error(error)
            
        }


    }
    return (
        <div className='flex justify-center items-center w-screen h-screen bg-indigo-500'>
            <form onSubmit={handleSubmit} className='flex flex-col p-16 justify-center gap-20 min-h-[60%] w-[40%] bg-white rounded-4xl'>
                <div>
                    <h2 className='text-5xl font-medium text-center'>Signup</h2>
                    <h2 className='text-xl mt-4 text-center'>Signup to continue</h2>
                </div>
                <div className='flex flex-col justify-center '>

                    <label htmlFor="username">Username</label>
                    <input
                    required
                        onChange={handleChange}
                        value={form.username}
                        type="text" name="username" placeholder='Username' className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mb-2" />

                    <label htmlFor="email">Email</label>
                    <input
                    required
                        onChange={handleChange}
                        value={form.email}
                        type="text" name="email" placeholder='Email' className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mb-2" />


                    <label htmlFor="password">Password</label>
                    <input
                    required
                        onChange={handleChange}
                        value={form.password}
                        type="password" name="password" placeholder='Password' className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg " />

                    <Button text="Signup" />
                    <p className='text-center mt-7'>Already have an account? <a href="/login" className='text-indigo-500 font-medium hover:underline'>Login</a></p>
                </div>

            </form>
        </div>
    )
}

export default Signup