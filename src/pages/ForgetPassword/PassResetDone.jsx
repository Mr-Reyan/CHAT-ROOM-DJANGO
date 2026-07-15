import React from 'react'

const PassResetDone = () => {
    return (
        <div>
            <p>
                Password reset complete

            </p>
            <p>
                Your password has been set. You may go ahead and log in now.

            </p>

            <a href="/login" className='text-indigo-500 font-medium hover:underline'>Login</a>
        </div>
    )
}

export default PassResetDone