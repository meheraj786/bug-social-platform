import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import { CgNotes } from "react-icons/cg";

import { getDatabase, ref, onValue } from "firebase/database";
import BlogCard from "../blogCard/BlogCard";
import BlogCardSkeleton from "../blogCardSkeleton/BlogCardSkeleton";
import NoBlog from "../noBlog/NoBlog";
import { useSelector } from "react-redux";

const MyBlogs = () => {
  
  const user= useSelector((state)=>state.user.user)
  const db = getDatabase();
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading]= useState(true)

  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const id = blog.key;
        if (content.bloggerId==user.uid) {
          arr.unshift({ ...content, id: id });
        }
      })
      setIsLoading(false)
      setBlogList(arr);
    });
  }, [user.uid, db]);
  

  return (
    <div className="py-5 font-secondary bg-black">
      <Container>
        <h2 className="text-[32px] font-primary font-bold mb-4 text-white flex items-center gap-x-2">
          <CgNotes size={40} />
          Recent Blogs ({blogList.length})
        </h2>
{isLoading ? (
  <>
    <BlogCardSkeleton />
  </>
) : blogList.length==0 ? <NoBlog/> : (
  blogList.map((blog) => <BlogCard blog={blog} key={blogList.id} />
)
)}
      </Container>
    </div>
  );
};

export default MyBlogs;
