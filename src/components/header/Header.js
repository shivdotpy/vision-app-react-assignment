import React, { useEffect } from 'react';
import { PRIMARY } from '../../utils/colorConstants';
import { Link } from 'react-router-dom';
import { isUserLoggedIn } from '../../utils/commonMethods';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetailAction } from '../../containers/signin/action';

const Header = () => {
	const loggedIn = isUserLoggedIn();

	const dispatch = useDispatch();
	const user = useSelector((state) => state.signin.user);

	console.log('user', user) 

	useEffect(() => {
		dispatch(getUserDetailAction());
	}, []);

	const logout = () => {
		localStorage.clear();
	};

	return (
		<nav className="navbar navbar-dark navbar-expand-lg" style={{ backgroundColor: PRIMARY }}>
			<a className="navbar-brand" href="#">
				Vision
			</a>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarText"
				aria-controls="navbarText"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon" />
			</button>
			<div className="collapse navbar-collapse" id="navbarText">
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<Link className="nav-link" to="/">
							Home <span className="sr-only">(current)</span>
						</Link>
					</li>
					{!loggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/signin">
								Sign in
							</Link>
						</li>
					)}
					{!loggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/signup">
								Signup
							</Link>
						</li>
					)}
					{loggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/create">
								Create Article
							</Link>
						</li>
					)}
					{loggedIn && (
						<li className="nav-item">
							<Link className="nav-link" to="/account">
								{user.username}
							</Link>
						</li>
					)}
					{loggedIn && (
						<li className="nav-item">
							<Link className="nav-link" onClick={logout}>
								<svg
									width="1em"
									height="1em"
									viewBox="0 0 16 16"
									class="bi bi-power"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M5.578 4.437a5 5 0 1 0 4.922.044l.5-.866a6 6 0 1 1-5.908-.053l.486.875z"
									/>
									<path fill-rule="evenodd" d="M7.5 8V1h1v7h-1z" />
								</svg>{' '}
								Logout
							</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Header;
