import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import { CgNotes } from "react-icons/cg";

import { getDatabase, ref, onValue } from "firebase/database";
import BlogCard from "../blogCard/BlogCard";
import BlogCardSkeleton from "../blogCardSkeleton/BlogCardSkeleton";
import NoBlog from "../noBlog/NoBlog";

const BlogList = () => {
  const db = getDatabase();
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const id = blog.key;
        arr.unshift({ ...content, id: id });
      });
      setIsLoading(false);
      setBlogList(arr);
    });
  }, [db]);

  return (
    <div className="py-5  font-secondary">
      <Container>
        {isLoading ? (
          <>
            <BlogCardSkeleton />
          </>
        ) : blogList.length == 0 ? (
          <NoBlog />
        ) : (
          blogList.map((blog) => <BlogCard blog={blog} key={blogList.id} />)
        )}
      </Container>
    </div>
  );
};

export default BlogList;
