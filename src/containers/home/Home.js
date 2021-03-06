import React, { useEffect } from 'react';
import Header from '../../components/header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getTagsAction, getArticles, addToFavoriteArticle, removeFromFavoriteArticle } from './action';
import TagsBox from '../../components/tagsBox/TagsBox';
import Articles from '../../components/articles/Articles';
import { isUserLoggedIn } from '../../utils/commonMethods';

const Home = ({ history, match }) => {
	const tag = match.params.tag;

	const dispatch = useDispatch();
	const tags = useSelector((state) => state.home.tags);
	const loadingTag = useSelector((state) => state.home.loadingTag);
	const articles = useSelector((state) => state.home.articles);
	const favoriteInProcess = useSelector((state) => state.home.favoriteInProcess);
	const loadingArticles = useSelector((state) => state.home.loadingArticles);

	useEffect(() => {
		dispatch(getTagsAction());
		// dispatch(getArticles());
	}, []);

	useEffect(
		() => {
			if (!favoriteInProcess) {
				dispatch(getArticles(10, 0, tag));
			}
		},
		[ favoriteInProcess, tag ]
	);

	return (
		<div>
			<Header history={history} match={match} />
			<div className="container">
				<div className="row">
					<div className="col-md-9">
						<Articles
							loading={loadingArticles}
							articles={articles}
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
					</div>
					<div className="col-md-3 p-3">
						<TagsBox tags={tags} loading={loadingTag} history={history} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
