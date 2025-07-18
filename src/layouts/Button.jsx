import React from 'react'

const Button = ({className, children, onClick}) => {
  return (
    <button onClick={onClick} className={`py-3 bg-black text-white font-bold rounded-lg hover:text-black border hover:bg-white transition-all cursor-pointer my-3 ${className}`}>{children}</button>
  )
}

export default Button