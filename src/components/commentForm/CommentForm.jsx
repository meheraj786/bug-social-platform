import React from 'react'
import Flex from '../../layouts/Flex'

const CommentForm = () => {
  return (
     <div className="mt-5 bg-gray-50 ">
      <h3 className='text-[20px] font-semibold'>Comments (0)</h3>
        <Flex>
          <div className="w-[20%] border">
            <input name='name' type="text" className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none" />
          </div>
          <div className="w-[69%] border">
            <input type="text" name='comment' className="w-full mt-3 px-4 py-2 text-[14px] border-2 border-gray-300 rounded-lg outline-none" />
          </div>
          <div className="w-[10%] border">
            <button className='rounded-lg bg-black text-white border-2 hover:bg-white hover:text-black px-4 py-2 text-[14px] cursor-pointer transition-all mt-3'>Sub</button>
          </div>
        </Flex>
      </div>
  )
}

export default CommentForm