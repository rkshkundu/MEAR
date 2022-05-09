import React, { useState, useEffect } from 'react';

import PostCard from '../../molecules/PostCard/PostCard';
import Loader from '../../atoms/Loader/Loader';
import ErrorChip from '../../atoms/ErrorChip/ErrorChip';

import useApiHook from '../../../hooks/api-hook';

const Home = () => {
    const [postCards, setPostCards] = useState([]);
    
    const { sendRequest } = useApiHook();

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/posts/`,
                'GET',
                { 'Content-Type': 'application/json' }
            );

            if(response) {
                setPostCards(response);
            }
        }

        fetchPosts();
    }, []);
    

    return (
        <React.Fragment>
            {postCards.map(card => {
                return <PostCard description={card.description} createdBy={card.createdBy} link={card.link} id={card._id} key={card._id} />
            })}
        </React.Fragment>
    );
}

export default Home;