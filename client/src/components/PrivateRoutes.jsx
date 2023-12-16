import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export const ProfileRoute = () => {
    const { currentUser } = useSelector(state => state.user);
  return (
    currentUser ? <Outlet /> : <Navigate to='/sign-in' />
  )
}

export const SignInRoute = () => {
    const { currentUser } = useSelector(state => state.user);
    return (
        !currentUser ? <Outlet /> : <Navigate to='/profile' />
    )
}