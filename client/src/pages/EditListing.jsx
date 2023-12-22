import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../firebase";

export default function CreateListing() {
    const [images, setImages] = useState([]);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isImageUploadingError, setIsImageUploadingError] = useState(null);

    const [isLisingCreating, setIsLisingCreating] = useState(false);
    const [isLisingCreatingError, setIsLisingCreatingError] = useState(null);

    const {currentUser} = useSelector((state) => state.user);

    const navigate = useNavigate();

    const {id: listingId} = useParams();

    console.log(listingId)

    const [formData, setFormData] = useState({
        images: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        parking: false,
        furnished: false,
        offer: false,
        beds: 1,
        baths: 1,
        regularPrice: 0,
        discountedPrice: 0,
        userRef: currentUser._id
    });

    const handleImageUpload = () => {
        if(images.length <= 0 || images.length + formData.images >= 6) {
            return setIsImageUploadingError('Upload a minium of 1 to maximum of 5 images');
        }
        setIsImageUploading(true);
        const promises = [];

        for(let i = 0; i < images.length; i++) {
            promises.push(storeImage(images[i]));
        }

        Promise.all(promises).then((imageUrl) => {
            console.log(imageUrl)
            setFormData({
                ...formData,
                images: formData.images.concat(imageUrl)
            })
            setIsImageUploading(false);
            setIsImageUploadingError(null);
        }).catch((err) => {
            setIsImageUploadingError(err);
            setIsImageUploading(false);
        })
    }

    const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + image.name.trim().replaceAll(" ", "-");
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_ , i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'offer') {
          setFormData({
            ...formData,
            offer: e.target.checked,
            discountedPrice: e.target.checked ? formData.discountedPrice : 0
          });
        }

        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.offer && +formData.discountedPrice <= 0) {
            return setIsLisingCreatingError('Discount price cannot be 0');
        }
        
        if (+formData.regularPrice < +formData.discountedPrice) {
            return setIsLisingCreatingError('Discount price must be lower than regular price');
        }
        
        if (formData.images.length < 1) {
            return setIsLisingCreatingError('You must upload at least one image');
        }
        
        setIsLisingCreating(true);
        setIsLisingCreatingError(null);
        try {
            const res = await fetch(`/api/listing/update/${listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            navigate(`/listing/${data._id}`)
        } catch (err) {
            setIsLisingCreatingError(err);
        } finally {
            setIsLisingCreating(false);
        }
    }

    useEffect(()=> {
      const fetchData = async () => {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        setFormData(data)
      }
      fetchData();
    }, [])
    
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Edit Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" checked={formData.type == 'sale'} onChange={handleChange} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" checked={formData.type == 'rent'} onChange={handleChange} />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" checked={formData.parking} onChange={handleChange} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" checked={formData.furnished} onChange={handleChange} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" checked={formData.offer} onChange={handleChange} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="beds"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.beds}
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="baths"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.baths}
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="500"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {
                formData.offer && 
                <div className="flex items-center gap-2">
                <input
                type="number"
                id="discountedPrice"
                min="0"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                value={formData.discountedPrice}
                onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
                </div>
            </div>
            }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 5)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
            <button type="button" disabled={isImageUploading} onClick={handleImageUpload} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {isImageUploading ? 'Loading...' : 'Upload' }
            </button>
          </div>
          {formData.images.length > 0 && formData.images.map((image, index) => (
                <div key={image} className="flex justify-between p-3 border items-center">
                    <img src={image} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                    <button type="button" onClick={() => handleImageDelete(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                </div>
          ))}
          {isImageUploadingError && <p className="text-red-700 text-small">{isImageUploadingError}</p>}
          <button disabled={isLisingCreating} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {isLisingCreating ? 'Updating' : 'Update Listing' }
          </button>
          {isLisingCreatingError && <p className="text-red-700 text-small">{isLisingCreatingError}</p>}
        </div>
      </form>
    </main>
  );
}