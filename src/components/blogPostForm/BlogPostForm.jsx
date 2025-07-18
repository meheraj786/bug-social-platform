import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import { LuPenLine } from "react-icons/lu";
import Flex from "../../layouts/Flex";
import { getDatabase, push, ref, set } from "firebase/database";
import toast, { Toaster } from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useSelector } from "react-redux";
import Button from "../../layouts/Button";
const newDate = () => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return date;
};



const BlogPostForm = () => {
  const user= useSelector((state)=>state.user.user)
  const [info, setInfo] = useState({
    name: "",
    title: "",
    description: "",
    time: "",
    nameErr: "",
    titleErr: "",
    descriptionErr: "",
    loading: false,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
      [`${name}Err`]: "",
    }));
  };
  const handleSubmit = () => {
    console.log("click");
    
    if (info.title.trim() === "") {
      setInfo((prev) => ({
        ...prev,
        titleErr: "Enter a Title",
      }));
    } else if (info.description.trim() === "") {
      setInfo((prev) => ({
        ...prev,
        descriptionErr: "Enter your Description",
      }));
    } else {
      console.log("success");
      
      setInfo((prev) => ({
        ...prev,
        loading: true,
      }));
      const date = newDate();
      const db = getDatabase();
      set(push(ref(db, "blogs/")), {
        name: user.displayName,
        title: info.title,
        description: info.description,
        date: date,
        bloggerId: user.uid
      }).then(() => {
        toast.success("Blog Published Successfully!");
        setInfo({
          name: "",
          title: "",
          description: "",
          time: "",
          nameErr: "",
          titleErr: "",
          descriptionErr: "",
          loading: false,
        });
      });
    }
  };

  return (
    <div className="py-10 bg-black font-secondary">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <div className="p-8 bg-white rounded-lg">
          <h2 className="text-[26px] lg:text-[32px] font-primary font-semibold mb-4 flex items-center gap-x-1">
            <LuPenLine size={30} />
            Write Your Blog
          </h2>
          <Flex className="gap-x-2 pt-3 pb-2">
            <div className="xl:w-[49%] w-full">
              <label className="text-[18px] font-medium" htmlFor="title">
                Title
              </label>
              <input
                name="title"
                onChange={(e) => handleChange(e)}
                value={info.title}
                className="w-full mt-3 px-4 py-3 border-2 border-gray-300 rounded-lg outline-none"
                type="text"
                placeholder="Enter a Title For Your Blog"
              />
              <p className="text-red-500">{info.titleErr}</p>
            </div>
          </Flex>
          <label className="text-[18px] font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            onChange={(e) => handleChange(e)}
            value={info.description}
            className="w-full mt-3 h-[200px] px-4 py-3 border-2 border-gray-300 rounded-lg outline-none"
            name="description"
            id=""
            placeholder="Enter Your Blog Description"
          ></textarea>
          <p className="text-red-500">{info.descriptionErr}</p>
          {info.loading ? (
            <Button className="w-full rounded-lg border-2 mt-5 cursor-pointer py-3 font-bold hover:bg-white hover:border-2 text-center hover:text-black transition-all bg-black text-white">
              <BeatLoader className="text-white" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="w-full rounded-lg border-2 mt-5 cursor-pointer py-3 font-bold hover:bg-white hover:border-2 hover:text-black transition-all bg-black text-white"
            >
              Publish
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BlogPostForm;
