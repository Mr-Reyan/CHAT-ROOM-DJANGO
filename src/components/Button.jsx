import React from 'react'

const Button = ({onclick,text}) => {
    return (

        <button type='submit' onClick={onclick || null } className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors duration-200 text-sm shadow-md w-40 self-center cursor-pointer">{text}</button>

    )
}

export default Button