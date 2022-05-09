import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import './PostCard.scss';
import Anchor from '../../atoms/Anchor/Anchor';
import Button from '../../atoms/Button/Button';
import StateContext from '../../../context/state-context';
import useApiHook from '../../../hooks/api-hook';

const PostCard = (props) => {
	const auth = useContext(StateContext);
	const [deletedPost, setDeletedPost] = useState({});
	const { sendRequest } = useApiHook();

	const deletePost = (postId) => {
		const removePost = async () => {
			const response = await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`,
				'DELETE',
				{
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${auth.userToken}`,
				}
			);

			if (response) {
				const tempDeletedPost = { ...deletePost };
				tempDeletedPost[props.id] = true;
				setDeletedPost(tempDeletedPost);
			}
		};

		removePost();
	};

	const isSameUser = (createdBy, userId) => auth.isLoggedIn && createdBy === userId; //if user is logged in and same user who created post

	return (
		<div className={`postcard ${deletedPost[props.id] ? 'hidden' : ''}`}>
			<pre>{props.description}</pre>
			<div className="actions">
				<Anchor
					className="button"
					path={props.link}
					target="_blank"
					text="Read More..."
				/>
				{isSameUser(
					props.createdBy,
					auth.userId
				) && (
					<>
						<Link className="button edit" to={`/updatepost/${props.id}`}>
							Edit
						</Link>
						<Button
							className="delete"
							onClick={() => deletePost(props.id)}
							type="button"
							text="Delete"
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default PostCard;
