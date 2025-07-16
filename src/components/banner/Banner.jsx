import React from 'react'
import Container from '../../layouts/Container'
import Flex from '../../layouts/Flex'
import { LuPenLine } from "react-icons/lu";
import bannerImg from '../../assets/blog.svg'

const Banner = () => {
  return (
    <div className='py-[100px] bg-white text-black font-secondary'>
      <Container>
        <Flex>
          <div className="left w-1/2">
          <h1 className='text-[42px] font-primary'><LuPenLine size={40} />
          Anonymous Blog
          </h1>
          <p className='text-gray-400'>Share your thoughts anonymously with the world
</p>
          </div>
          <div className="right w-1/2">
          <img className='floating' src={bannerImg} alt="" />
          </div>
        </Flex>
      </Container>
    </div>
  )
}

export default Banner