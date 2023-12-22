import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { deleteFailure, deleteStart, deleteSuccess, signOutFailure, signOutStart, signOutSuccess, updateFailure, updateStart, updateSuccess } from '../store/slice/user.slice.js';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, isLoading, error} = useSelector((state) => state.user)
  const [isUploading, setIsUploading] = useState(false);
  const [isErrorUploading, setIsErrorUploading] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [file, setFile] = useState(undefined)
  const [formData, setFormData] = useState({});


  const dispatch = useDispatch();
  
  useEffect(() => {
    if(file) {
      const  fileType = file['type'];
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (validImageTypes.includes(fileType)) {
        handleFileUpload(file);
      } else {
        setIsErrorUploading('Image types can only be gif, jpeg or png');
      }
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name.trim().replaceAll(" ", "-");
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);
    setIsErrorUploading(false);
    setIsUploaded(false);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setIsUploaded(true);
      },
      (error) => {
        console.log(error);
        setIsUploading(false);
        setIsErrorUploading('Error uploading image');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
        setIsUploading(false);
      }
    );
  };
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.replaceAll(" ", "").trim()});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.userName && !formData.emailId && !formData.password && !formData.avatar) {
      return;
    }
    dispatch(updateStart());
    setIsUpdated(false);
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data?.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setIsUpdated(true);
    } catch(err) {
      dispatch(updateFailure(err));
    }
  }

  const handleDelete = async () => {
    dispatch(deleteStart())
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      })
      const data = await res.json();
      if (data?.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data))
    } catch(err) {
      dispatch(deleteFailure(err));
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      await fetch('/api/user/signout');
      dispatch(signOutSuccess());
    } catch(err) {
      dispatch(signOutFailure(err));
    }
  }

  const [gettingListings, setGettingListings] = useState(false);
  const [listingsError, setListingsError] = useState(null);
  const [userListings, setUserListings] = useState([]);

  const showListings = async () => {
    setGettingListings(true);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      setUserListings(data)
    } catch(err) {
      setListingsError(err);
    } finally {
      setGettingListings(false);
    }
  }

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE"
      })
      const data = await res.json();
      setUserListings(
        userListings.filter((listing) => listing._id !== id)
      )
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} accept='image/*' hidden />
        <img src={formData.avatar || currentUser.avatar} onClick={() => fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='mt-3 text-center'>
          {isUploading && ('uploading file') || isErrorUploading && (<span className='text-red-700'>{isErrorUploading}</span>) || isUploaded && (<span className='text-green-700'>Image Uploaded</span>)}
        </p>
        <input type="text" placeholder='username' id='userName' className='border p-3 rounded-lg' defaultValue={currentUser.userName} onChange={handleChange} />
        <input type="email" placeholder='email' id='emailId' className='border p-3 rounded-lg' defaultValue={currentUser.emailId} onChange={handleChange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg'  onChange={handleChange} />
        {isUpdated && <p className='text-green-700 mt-3 text-center'>Data Updated</p>}
        {error && <p className='text-green-700 mt-3 text-center'>{error}</p>}
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {isLoading ? 'Loading...' : 'update' }
        </button>

        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/listing/new"}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      <button onClick={showListings} disabled={gettingListings} className='text-green-700 w-full mt-10'>
        {gettingListings ? 'Fetching details' : 'Show Listings' }
      </button>
      {listingsError && <p className='text-red-700 mt-4'>{listingsError}</p>}
      {userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {
          userListings.map((listing, index) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              {listing.images.length > 0 && <Link to={`/listing/${listing._id}`} >
                <img
                  src={listing.images[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>}
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/listing/edit/${listing._id}`} className='text-green-700 uppercase'>Edit</Link>
              </div>
            </div>
        ))}
      </div>
      }
    </div>
  )
}