import React from 'react'
import Container from '../../layouts/Container'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <div className='bg-gray-100 text-center py-5 text-sm
    font-secondary'>
      <Container>
    Copyright © 2025 <Link className='border-b' target='blank' to="https://github.com/meheraj786">MeherajH.</Link>  All right reserved
      </Container>
    </div>
  )
}

export default Footer