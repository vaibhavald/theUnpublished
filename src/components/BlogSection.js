import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
const BlogSection = ({ blogs, user, handleDelete, adminID }) => {
  const userId = user?.uid;

  const increaseView = async (item) => {
    if (userId !== item.userId)
      try {
        await updateDoc(doc(db, "blogs", item.id), {
          view: item.view + 1,
        });
      } catch (err) {
        console.log(err);
      }
  };
  return (
    <div>
      <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
      {blogs?.map((item) => (
        <div className="row pb-4" key={item.id}>
          <div className="col-md-5">
            <div className="hover-blogs-img">
              <div className="blogs-img">
                <img
                  src={
                    item.imgUrl
                      ? item.imgUrl
                      : "https://assets.ltkcontent.com/images/9037/examples-of-poetry-genres_27c5571306.webp"
                  }
                  alt={item.title}
                />
                <div></div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="text-start">
              <h6 className="category catg-color">{item.category}</h6>
              <span className="title py-2">{item.title}</span>
              <span className="meta-info">
                <p className="author">{item.author}</p> -&nbsp;
                {item.timestamp.toDate().toDateString()}
              </span>
            </div>
            <div className="short-description text-start">
              {excerpt(item.description, 120)}
            </div>
            <Link to={`/detail/${item.id}`}>
              <button
                className="btn btn-read"
                onClick={() => increaseView(item)}
              >
                Read More
              </button>
            </Link>
            {userId === adminID ? (
              <button
                className="btn btn-read"
                onClick={() => increaseView(item)}
              >
                {item.published === "yes" ? "Unpulish" : "Publish"}
              </button>
            ) : (
              <></>
            )}
            {userId && item.userId === userId && (
              <div style={{ float: "right" }}>
                <FontAwesome
                  name="trash"
                  style={{ margin: "15px", cursor: "pointer" }}
                  size="2x"
                  onClick={() => handleDelete(user, item.id)}
                />
                <Link to={`/update/${item.id}`}>
                  <FontAwesome
                    name="edit"
                    style={{ cursor: "pointer" }}
                    size="2x"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSection;
