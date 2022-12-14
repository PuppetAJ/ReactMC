<<<<<<< HEAD
import React from "react";
||||||| 7f38ffa
=======
import React from 'react'
import { Link } from 'react-router-dom'
import Auth from '../../utils/auth'
>>>>>>> develop

<<<<<<< HEAD
const Header = () => {
	return <div>Header</div>;
};

export default Header;
||||||| 7f38ffa
=======
const Header = () => {
    const logout = event => {
        event.preventDefault()
        Auth.logout()
    }

    return (
        <header className="bg-secondary mb-4 py-2 flex-row align-center">
            <div className="container flex-row justify-space-between-lg justify-center align-center">
                <Link to='/'>
                    <h1>Website</h1>
                </Link>

                <nav className='text-center'>
                    {Auth.loggedIn() ? (
                        <>
                            <Link to='/profile'>Me</Link>
                            <a href='/' onClick={logout}>
                                Logout
                            </a>
                        </>
                    ) : (
                        <>
                            <Link to='/login'>Login</Link>
                            <Link to='/signup'>Signup</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
>>>>>>> develop
