import React, { useState, useContext, useEffect } from 'react';

import './AddPost.scss';
import TextArea from '../../atoms/TextArea/TextArea';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import ErrorChip from '../../atoms/ErrorChip/ErrorChip';
import Loader from '../../atoms/Loader/Loader';
import { useLocation, useNavigate } from 'react-router-dom';

import useApiHook from '../../../hooks/api-hook';
import StateContext from '../../../context/state-context';

const AddPost = () => {
    const navigate = useNavigate();
	const contextState = useContext(StateContext);
	const { pathname } = useLocation();
	const [isUpdate, setIsUpdate] = useState(false);
	const [postDescription, setPostDescription] = useState('');
	const [postLink, setPostLink] = useState('');
	const [postId, setPostId] = useState(null);
	const { sendRequest } = useApiHook();

	const addPostHandler = () => {
        if(!postDescription || !postLink) {
			contextState.showError('Invalid/Empty field!');
			return;
		}
		const addPost = async () => {
			const response = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/posts/add`,
				'POST',
				{
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${contextState.userToken}`,
				},
				JSON.stringify({
					description: postDescription,
					link: postLink,
					createdBy: contextState.userId,
				})
			);

			if (response) {
				setPostDescription('');
				setPostLink('');
			}
		};

		addPost();
	};

    const updatePostHandler = () => {
		if(!postDescription || !postLink) {
			contextState.showError('Invalid/Empty field!');
			return;
		}
		const updatePost = async () => {
			const response = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,
				'PUT',
				{
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${contextState.userToken}`,
				},
				JSON.stringify({
					description: postDescription,
					link: postLink,
					createdBy: contextState.userId,
				})
			);

			if (response) {
				navigate('/');
			}
		};

		updatePost();
	};

	const postDescriptionChangeHandler = (event) => {
		setPostDescription(event.target.value);
	};

	const postLinkChangeHandler = (event) => {
		setPostLink(event.target.value);
	};

	useEffect(() => {
        const getPostById = async (postId) => {
			const response = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,
				'GET',
				{ 'Content-Type': 'application/json' }
			);
            
			if (response) {
				 setPostDescription(response.description);
				setPostLink(response.link);
			}
		};

        if (pathname.includes('updatepost')) {
			let tempPath = pathname.split('/') || [];
			if (tempPath[1] === 'updatepost' && tempPath[2]) {
				setIsUpdate(true);
				setPostId(tempPath[2]);
                console.log('abc');
                getPostById(tempPath[2]);
            }
		}

	}, []);

	return (
		<div className="addpost-wrapper">
			<TextArea
				value={postDescription}
				placeholder="Add post description..."
				onChange={postDescriptionChangeHandler}
			/>
			<Input
				value={postLink}
				type="text"
				placeholder="Add post link..."
				onChange={postLinkChangeHandler}
			/>
			<div className="addpost-btn">
				<Button text={isUpdate ? 'Update Post' : 'Add Post'} type="button" onClick={isUpdate ? updatePostHandler : addPostHandler} />
			</div>
		</div>
	);
};

export default AddPost;
