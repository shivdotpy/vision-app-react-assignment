import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Header from '../../components/header/Header';
import { SECONDARY, PRIMARY, WHITESMOKE } from '../../utils/colorConstants';
import { useDispatch, useSelector } from 'react-redux';
import {
	getUserProfileAction,
	getUserArticlesAction,
	getUserFavoriteArticlesAction,
	updateUserProfileAction
} from './action';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Articles from '../../components/articles/Articles';
import { isUserLoggedIn } from '../../utils/commonMethods';
import { addToFavoriteArticle, removeFromFavoriteArticle } from '../home/action';
import { getUserDetailAction } from '../signin/action';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '400px'
	}
};

Modal.setAppElement('#root');

const Account = ({ history, match }) => {
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ userImageUrl, setUserImageUrl ] = useState('');
	const [ userName, setUserName ] = useState('');
	const [ userBio, setUserBio ] = useState('');
	// const [ userEmail, setUserEmail ] = useState('');
	const [ userPassword, setPassword ] = useState('');

	const dispatch = useDispatch();
	const userProfile = useSelector((state) => state.userProfile.user);
	const username = useSelector((state) => state.signin.user.username);
	const userArticles = useSelector((state) => state.userProfile.userArticles);
	const favoriteArticles = useSelector((state) => state.userProfile.favroriteArticles);
	const favoriteInProcess = useSelector((state) => state.home.favoriteInProcess);
	const updatingProfile = useSelector((state) => state.userProfile.updatingProfile);

	useEffect(
		() => {
			if (!updatingProfile) {
				dispatch(getUserDetailAction());
				setIsModalOpen(false);
				setPassword('');
			}
		},
		[ updatingProfile ]
	);

	useEffect(
		() => {
			setUserImageUrl(userProfile.image ? userProfile.image : userProfile.image);
			setUserBio(userProfile.bio ? userProfile.bio : '');
			setUserName(userProfile.username ? userProfile.username : '');
		},
		[ userProfile ]
	);

	useEffect(
		() => {
			if (username) {
				dispatch(getUserProfileAction(username));
				dispatch(getUserArticlesAction(username));
				dispatch(getUserFavoriteArticlesAction(username));
			}
		},
		[ username ]
	);

	useEffect(
		() => {
			if (!favoriteInProcess) {
				dispatch(getUserArticlesAction(username));
				dispatch(getUserFavoriteArticlesAction(username));
			}
		},
		[ favoriteInProcess ]
	);

	const onSubmit = (event) => {
		event.preventDefault();

		const requestBody = {
			user: {
				bio: userBio,
				image: userImageUrl,
				password: userPassword,
				username: userName
			}
		};

		dispatch(updateUserProfileAction(requestBody));
	};

	return (
		<div>
			<Header history={history} match={match}/>
			<div
				style={{
					backgroundColor: SECONDARY,
					minHeight: '150px',
					display: 'flex',
					direction: 'column',
					alignItems: 'center'
				}}
			>
				<div className="container text-center">
					{userProfile.image ? (
						<img
							src={userProfile.image}
							alt="user"
							style={{ borderRadius: '50%' }}
							className="m-1"
							height={70}
							width={70}
						/>
					) : null}
					{userProfile.image ? (
						<h1>
							{userProfile.username}{' '}
							<span className="ml-3">
								<svg
									width="0.7em"
									height="0.7em"
									viewBox="0 0 16 16"
									className="bi bi-pen"
									fill={PRIMARY}
									xmlns="http://www.w3.org/2000/svg"
									onClick={() => {
										setIsModalOpen(true);
									}}
									style={{ cursor: 'pointer' }}
								>
									<path
										fillRule="evenodd"
										d="M5.707 13.707a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391L10.086 2.5a2 2 0 0 1 2.828 0l.586.586a2 2 0 0 1 0 2.828l-7.793 7.793zM3 11l7.793-7.793a1 1 0 0 1 1.414 0l.586.586a1 1 0 0 1 0 1.414L5 13l-3 1 1-3z"
									/>
									<path
										fillRule="evenodd"
										d="M9.854 2.56a.5.5 0 0 0-.708 0L5.854 5.855a.5.5 0 0 1-.708-.708L8.44 1.854a1.5 1.5 0 0 1 2.122 0l.293.292a.5.5 0 0 1-.707.708l-.293-.293z"
									/>
									<path d="M13.293 1.207a1 1 0 0 1 1.414 0l.03.03a1 1 0 0 1 .03 1.383L13.5 4 12 2.5l1.293-1.293z" />
								</svg>
							</span>
						</h1>
					) : null}
					{userProfile.image ? <p>{userProfile.bio}</p> : null}

					{/* {article.author && (
						<UserAvtar
							image={article.author.image}
							username={article.author.username}
							createdAt={article.createdAt}
						/>
					)} */}
				</div>
			</div>
			<div className="container p-3">
				<Tabs>
					<TabList>
						<Tab>My Articles</Tab>
						<Tab>My Favorites</Tab>
					</TabList>
					<TabPanel>
						<Articles
							articles={userArticles}
							history={history}
							onFavoriteClick={
								isUserLoggedIn() ? (
									(id, type) => {
										if (type === 'add') {
											dispatch(addToFavoriteArticle(id));
										} else {
											dispatch(removeFromFavoriteArticle(id));
										}
									}
								) : null
							}
						/>
					</TabPanel>
					<TabPanel>
						<Articles
							articles={favoriteArticles}
							history={history}
							onFavoriteClick={
								isUserLoggedIn() ? (
									(id, type) => {
										if (type === 'add') {
											dispatch(addToFavoriteArticle(id));
										} else {
											dispatch(removeFromFavoriteArticle(id));
										}
									}
								) : null
							}
						/>
					</TabPanel>
				</Tabs>
			</div>
			<Modal
				isOpen={isModalOpen}
				style={customStyles}
				onRequestClose={() => setIsModalOpen(false)}
				// onAfterOpen={() => dispatch(getUserDetailAction())}
			>
				<form onSubmit={onSubmit} method="post">
					<div className="text-center">
						<h4>Your Settings</h4>
					</div>

					<div className="form-group">
						<input
							disabled={updatingProfile}
							className="form-control"
							placeholder="Profile picture url"
							value={userImageUrl}
							onChange={(event) => setUserImageUrl(event.target.value)}
						/>
					</div>
					<div className="form-group">
						<input
							disabled={updatingProfile}
							className="form-control"
							placeholder="User Name"
							value={userName}
							onChange={(event) => setUserName(event.target.value)}
						/>
					</div>
					<div className="form-group">
						<textarea
							disabled={updatingProfile}
							className="form-control"
							placeholder="Short Bio"
							rows={4}
							value={userBio}
							onChange={(event) => setUserBio(event.target.value)}
						/>
					</div>
					{/* <div className="form-group">
						<input
							className="form-control"
							placeholder="Email"
							value={userEmail}
							onChange={(event) => setUserEmail(event.target.value)}
						/>
					</div> */}
					<div className="form-group">
						<input
							disabled={updatingProfile}
							type="password"
							className="form-control"
							placeholder="New Password"
							value={userPassword}
							onChange={(event) => setPassword(event.target.value)}
							required={true}
						/>
					</div>
					<div className="text-right">
						<button typea="submit" className="btn" style={{ backgroundColor: PRIMARY, color: WHITESMOKE }}>
							Submit
						</button>
						<button className="btn btn-warning ml-1" onClick={() => setIsModalOpen(false)}>
							Close
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default Account;
