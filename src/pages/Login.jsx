import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useUserContext } from '../context/UserContext'
import { toast } from 'react-toastify'

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" })
    const navigate = useNavigate()
    const { getUser } = useUserContext()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            })
            const data = await response.json()

            if (!response.ok) {
                const errorMsg = Object.values(data).flat()[0]
                toast.error(errorMsg)
                return;
            }
            toast.success("Logged in successfully!")
            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)
            getUser()
            navigate("/all-users")

        } catch (error) {
            toast.error("Network Error:", error);

        }


    }
    return (
        <div className='flex justify-center items-center w-screen h-screen bg-indigo-500'>
            <form onSubmit={handleSubmit} className='flex flex-col p-16 justify-center gap-20 min-h-[60%] w-[40%] bg-white rounded-4xl'>
                <div>
                    <h2 className='text-5xl font-medium text-center'>Login</h2>

                </div>
                <div className='flex flex-col justify-center '>

                    <label htmlFor="username">Username</label>
                    <input
                        required
                        onChange={handleChange}
                        value={form.username}
                        type="text" name="username" placeholder='Username' className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mb-2" />


                    <label htmlFor="password">Password</label>
                    <input
                        required
                        onChange={handleChange}
                        value={form.password}
                        type="password" name="password" placeholder='Password' className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 mb-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg " />

                    <Button text="Login" />
                    <Link to="/forget-password" className='text-center mt-2 text-indigo-500 font-medium hover:underline'>Forget password?</Link>
                    <p className='text-center mt-7'>Don't have an account? <Link to="/signup" className='text-indigo-500 font-medium hover:underline'>Signup</Link></p>
                </div>

            </form>
        </div>
    )
}

export default Login