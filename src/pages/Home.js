import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { toast } from "react-toastify";
import MostPopular from "../components/MostPopular";
import Trending from "../components/Trending";
import { useParams } from "react-router-dom";

const Home = ({ setActive, user, adminID }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [choiceBook, setChoiceBook] = useState([]);
  const { cat } = useParams();
  let blogRef = collection(db, "blogs");
  blogRef = query(blogRef, where("published", "==", "yes"));
  if (cat) {
    blogRef = query(blogRef, where("category", "==", cat));
  }
  const getChoiceBooks = async () => {
    const choiceQuery = query(blogRef, where("choice", "==", "yes"));
    const querySnapshot = await getDocs(choiceQuery);
    let choiceBook = [];
    querySnapshot.forEach((doc) => {
      choiceBook.push({ id: doc.id, ...doc.data() });
    });
    setChoiceBook(choiceBook);
  };

  useEffect(() => {
    getChoiceBooks();
    const unsub = onSnapshot(
      blogRef,
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getChoiceBooks();
    };
  }, [setActive]);

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure wanted to delete that blog ?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <Trending blogs={choiceBook} />
          <div className="col-md-8">
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
              adminID={adminID}
            />
          </div>
          <div className="col-md-3">
            <MostPopular blogs={blogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
