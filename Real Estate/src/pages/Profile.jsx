import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserSuccess,
  signoutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
const Profile = () => {
  const [showListingError, setShowListingError] = useState(false);
  const [fileUpload, setFileUpload] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();
  console.log(userListing);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUpload(Math.round(progess));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/Backend/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`Backend/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      // navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/Backend/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/Backend/user/listings/${currentUser._id}`);
      const data = await res.json();
      // console.log(data);
      setUserListing(data);
    } catch (error) {
      setUserListing(true);
    }
  };
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/Backend/listing/delete/${id} `, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);

      if (data.status === false) {
        console.log(error);
        return;
      }
      setUserListing((prev) => prev.filter((list) => list._id !== id));
    } catch (error) {}
  };
  return (
    <section className="p-3  max-w-lg mx-auto my-6">
      <h1 className="text-center font-bold text-3xl my-4">Profile </h1>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile Picture"
          className="rounded-full h-24 w-24  object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-center my-2">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Uploading(Image must be less than 2 mb)
            </span>
          ) : fileUpload > 0 && fileUpload < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileUpload} %`}</span>
          ) : fileUpload === 100 ? (
            <span className="text-green-700">Image Upload Successfully.</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          className="border p-3 rounded-lg my-2"
          placeholder="Username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          className="border p-3 rounded-lg mb-2"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg mb-2"
          placeholder="password"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-60"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white rounded-lg text-center p-3 uppercase hover:opacity-80 mt-2"
        >
          Create Lisiting
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 text-center">
        {updateSuccess ? "User Crendential Update Successfully" : ""}
      </p>
      <div>
        <button
          className="text-white w-full text-center bg-orange-700 p-3 rounded-lg hover:opacity-90"
          onClick={handleShowListing}
        >
          Show Listing
        </button>
        <p className="text-red-700 text-center">
          {showListingError ? "Error Showing List" : ""}
        </p>
        {userListing && userListing.length > 0 && (
          <div>
            <p className="text-center text-slate-900 my-4 font-semibold text-2xl">
              Your Listings
            </p>
            {userListing.map((list, i) => (
              <div
                className="my-2 p-2 flex justify-between border rounded-lg items-center"
                key={list._id}
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    src={list.imageUrls[0]}
                    alt="Listing Image"
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </Link>
                <Link to={`/listing/${list._id}`} className="">
                  <p className="font-semibold text-slate-700  hover:underline truncate">
                    {list.name}
                  </p>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link to={`/update-listing/${list._id}`}>
                    <button
                      className="bg-green-400 px-3 py-1 rounded-lg hover:bg-green-500"
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(list._id)}
                    className="bg-red-400 px-3 py-1 rounded-lg hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
