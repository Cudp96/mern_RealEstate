import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUpdateError, setImageUpdateError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchingListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/Backend/listing/get/${listingId}`);
      const data = await res.json();
      console.log(data);
      if (data.status === false) {
        console.log(data.message);
      }

      setFormData(data);
    };
    fetchingListing();
  }, []);
  const handleChangeSubmit = (e) => {
    if (files.length > 0 && files.length < 7 + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        setUploading(true);
        setImageUpdateError(false);
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUpdateError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUpdateError("Image upload failed(2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUpdateError("You can only upload 6 images per listing.");
      setUploading(false);
    }
  };
  const storeImage = async (files) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + files.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
            resolve(dowloadURL);
          });
        }
      );
    });
  };
  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError("Please upload at least one image");
        return;
      }
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discounted price should be less than regular price.");
      setLoading(true);
      setError(false);
      const res = await fetch(`/Backend/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
      console.log(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-semibold text-center my-7 ">
        Update Your Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 "
      >
        <div className="flex gap-4 flex-col flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking-spot">Parking Spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder=""
                className="border border-gray-300 p-3 rounded-lg"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder=""
                className="border border-gray-300 p-3 rounded-lg"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Bath</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Price"
                className="border border-gray-300 p-3 rounded-lg"
                id="regularPrice"
                min="1"
                max="100000000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <label htmlFor="regularprice">Regular Price</label>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Price"
                  className="border border-gray-300 p-3 rounded-lg"
                  id="discountPrice"
                  min="0"
                  max="100000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <label htmlFor="discoutprice">Discounted Price</label>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="images" className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-700">
              The First Image will be the cover.{" "}
              <span className="text-red-700">(max 6 photos)</span>
            </span>
          </label>
          <div className="flex gap-2">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              className="border border-gray-300 p-3 rounded-lg w-full"
              id="images"
              multiple
              accept="images/*"
            />
            <button
              disabled={uploading}
              onClick={handleChangeSubmit}
              type="button"
              className="p-3 rounded-lg text-green-700 border border-green-700 hover:bg-green-500 hover:text-white hover:shadow-lg uppercase disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-center">
            {imageUpdateError ? (
              <span className="text-red-700">{imageUpdateError}</span>
            ) : null}
          </p>
          {formData.imageUrls &&
            formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div
                key={url}
                className="flex justify-between px-5 border items-center m-1 rounded-lg"
              >
                <img
                  src={url}
                  alt="Image Listing"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(i)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="mt-5 uppercase p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loading && loading ? "Updating..." : " Update Listing"}
          </button>
          {error && <p className="text-red-700 text-center text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
