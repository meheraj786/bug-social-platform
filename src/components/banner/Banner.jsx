import React from 'react'
import Container from '../../layouts/Container'
import Flex from '../../layouts/Flex'
import { LuPenLine } from "react-icons/lu";
import bannerImg from '../../assets/blog.svg'

const Banner = () => {
  return (
    <div className='py-[50px] pt-[120px] bg-white text-black font-secondary'>
      <Container>
        <Flex className="flex-col lg:flex-row gap-y-5 lg:gap-y-0 text-center lg:text-left justify-center lg:justify-between">
          <div className="left lg:w-1/2">
          <h1 className='lg:text-[42px] text-[32px] font-primary'><LuPenLine className='mx-auto lg:mx-0' size={40} />
          Anonymous Blog
          </h1>
          <p className='text-gray-400'>Share your thoughts anonymously with the world
</p>
          </div>
          <div className="right w-full lg:w-1/2">
          <img className='floating' src={bannerImg} alt="" />
          </div>
        </Flex>
      </Container>
    </div>
  )
}

export default Banner