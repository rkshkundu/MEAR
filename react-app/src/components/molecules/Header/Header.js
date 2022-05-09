import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Header.scss';
import logo from '../../../resources/images/logo.png';
import Image from '../../atoms/Image/Image';
import Container from '../../atoms/Container/Container';
import StateContext from '../../../context/state-context';
import Button from '../../atoms/Button/Button';

const Header = () => {
    const navigate = useNavigate();
    const auth = useContext(StateContext);

    const logout = (event) => {
        event.preventDefault();
        auth.logout();
        navigate('/');
    }

    return (
        <header>
            <Container>
                <div className='logo-container'>
                    <Link to='/'>
                        <Image className='logo' imagePath={logo} altText='logo' /> 
                    </Link>
                </div>
                <div className='header-links'>
                    <nav>
                        {auth.isLoggedIn && (
                            <>
                                <Link to='/addpost'>Add Post</Link>
                                <Link to='/logout' onClick={logout}>Log Out</Link>
                                {/* <Button className='header-button' type='button' text='Log Out' onClick={logout}/> */}
                            </>
                        )}

                        {!auth.isLoggedIn && (
                            <React.Fragment>
                                <Link to='/login'> Log In </Link>
                                <Link to='/signup'> Sign Up </Link>
                            </React.Fragment>
                        )}

                    </nav>
                </div>
            </Container>
        </header>
    );
}

export default Header;