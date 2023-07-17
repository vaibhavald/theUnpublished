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

const Admin = ({ setActive, user, adminID }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [choiceBook, setChoiceBook] = useState([]);
  let blogRef = collection(db, "blogs");
  blogRef = query(blogRef, where("published", "==", "no"));
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
        setActive("Admin");
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
          <div className="col-md-8">
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
              adminID={adminID}
            />
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
