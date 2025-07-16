import React from 'react'
import Container from '../../layouts/Container'
import { LuPenLine } from "react-icons/lu";
import Flex from '../../layouts/Flex';

const BlogPostForm = () => {
  return (
    <div className='py-10 bg-black font-secondary'>
      <Container>
        <div className='p-8 bg-white rounded-lg'>
          <h2 className='text-[32px] font-primary font-semibold mb-4 flex items-center gap-x-1'><LuPenLine size={30} />Write Your Blog</h2>
          <Flex className="gap-x-2 pt-3 pb-2">
            <div className="w-[49%]">
                      <label className='text-[18px] font-medium' htmlFor="Name">Author Name (Anonymous)
</label>
<input name='name' className='w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg outline-none' type="text" placeholder='Enter Your Anonymous Name' />
</div>
            <div className="w-[49%]">
                      <label className='text-[18px] font-medium' htmlFor="Name">Title
</label>
<input name='title' className='w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg outline-none' type="text" placeholder='Enter a Title For Your Blog' />
            </div>
          </Flex>
          <label className='text-[18px] font-medium' htmlFor="description">Description</label>
          <textarea className='w-full mt-3 h-[200px] px-4 py-3 border-2 border-gray-300 rounded-lg outline-none' name="description" id="" placeholder='Enter Your Blog Description'></textarea>
<button className='w-full rounded-lg border-2 mt-5 cursor-pointer py-3 font-bold hover:bg-white hover:border-2 hover:text-black transition-all bg-black text-white'>Submit</button>
        </div>
      </Container>
    </div>
  )
}

export default BlogPostForm