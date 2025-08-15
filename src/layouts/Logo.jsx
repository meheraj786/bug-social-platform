import React from 'react'
import { FaBug } from 'react-icons/fa'
import { LuPenLine } from 'react-icons/lu'
import { Link } from 'react-router'

const Logo = () => {
  return (
    <Link to="/">
    <div className="logo flex font-primary items-center gap-x-2 text-[20px] font-black">
      <FaBug className='text-white' />

            BUG
          </div>
    
    </Link>
  )
}

export default Logo