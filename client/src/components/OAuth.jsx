import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInSuccess } from '../store/slice/user.slice';

const OAuth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const onSubmit = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider)
            // const data = await res.json();
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })
            const data = await res.json();
            dispatch(signInSuccess(data))
            navigate('/');
        } catch(err) {
            console.log("Couldn't sign in using google", err)
        }
    }
  return (
    <button onClick={onSubmit} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Continue with Google</button>
  )
}

export default OAuth