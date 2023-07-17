import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MostPopular from "../components/MostPopular";
import Tags from "../components/Tags";
import { db } from "../firebase";
import { toast } from "react-toastify";
const Detail = ({ setActive, user, adminID }) => {
  const userId = user?.uid;

  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "c13f08ab1dmshb713fcf18dc9a4ep1a8f19jsnf2e0a9f83901",
      "X-RapidAPI-Host":
        "plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com",
    },
    body: `{"text":${blog?.description},"language":"en","includeCitations":false,"scrapeSources":false}`,
  };

  useEffect(() => {
    const getBlogsData = async () => {
      let blogRef = collection(db, "blogs");
      blogRef = query(blogRef, where("published", "==", "yes"));
      const blogs = await getDocs(blogRef);
      setBlogs(blogs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      /*let tags = [];
      blogs.docs.map((doc) => tags.push(...doc.get("tags")));
      let uniqueTags = [...new Set(tags)];
      setTags(uniqueTags);*/
    };
    getBlogsData();
  }, []);

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    setTags(blogDetail.get("tags"));
    setBlog(blogDetail.data());
  };
  const PublishBook = async () => {
    try {
      await updateDoc(doc(db, "blogs", id), {
        PublishedOn: serverTimestamp(),
        published: "yes",
      });
      toast.success("Book Published successfully");
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };
  const UnPublishBook = async () => {
    try {
      await updateDoc(doc(db, "blogs", id), {
        PublishedOn: serverTimestamp(),
        published: "no",
      });
      toast.success("Book Unublished successfully");
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };
  const addToEditorChoice = async () => {
    if (
      window.confirm("This Book Has not Published Yet Do you Want publish it?")
    ) {
      try {
        await updateDoc(doc(db, "blogs", id), {
          choice: "yes",
        });
        toast.success("Book is added to editor choice successfully");
        PublishBook();
      } catch (err) {
        console.log(err);
      }
    }
  };
  const removefromEditorChoice = async () => {
    try {
      await updateDoc(doc(db, "blogs", id), {
        choice: "no",
      });
      toast.success("Book is removed from the editor choice successfully");
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="single">
      <div
        className="blog-title-box"
        style={{
          backgroundImage: `url('${
            blog?.imgUrl
              ? blog.imgUrl
              : "https://assets.ltkcontent.com/images/9037/examples-of-poetry-genres_27c5571306.webp"
          }')`,
        }}
      >
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{blog?.timestamp.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p> -&nbsp;
                {blog?.timestamp.toDate().toDateString()}
              </span>
              <p>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: blog?.description,
                  }}
                />
              </p>
              <span className="meta-info text-start"></span>
              <span className="meta-info text-start">
                view -&nbsp;
                {blog?.view}
                &nbsp;Likes -&nbsp;
                {blog?.view}
                &nbsp;Comment -&nbsp;
                {blog?.view}
              </span>
            </div>
            <div className="col-md-3">
              <Tags tags={tags} />
              <MostPopular blogs={blogs} />
            </div>
          </div>
        </div>
      </div>

      {userId === adminID ? (
        blog?.published === "yes" ? (
          <button
            className="btn btn-publish"
            float="center"
            onClick={UnPublishBook}
          >
            Unpublish
          </button>
        ) : (
          <button className="btn btn-publish" onClick={PublishBook}>
            Publish
          </button>
        )
      ) : (
        <></>
      )}
      {userId === adminID ? (
        blog?.choice === "no" ? (
          <button className="btn btn-publish" onClick={addToEditorChoice}>
            Add to Editor Choice
          </button>
        ) : (
          <button className="btn btn-publish" onClick={removefromEditorChoice}>
            Remove from Editor Choice
          </button>
        )
      ) : (
        <></>
      )}
      <div>
        <span className="meta-info text-start"></span>
      </div>
    </div>
  );
};

export default Detail;
