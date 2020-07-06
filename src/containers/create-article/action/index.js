import { actionCreator, jsonApiHeader, getAccessTokenFromLocalStorage } from '../../../utils/reduxUtils';
import { CREATE_ARTICLE_API_URL, createArticleActionTypes } from '../constants';
import axios from 'axios';

export const createArticleAction = (form_data) => {
	return (dispatch) => {
		dispatch(actionCreator(createArticleActionTypes.createArticle.REQUEST));
		axios
			.post(CREATE_ARTICLE_API_URL, form_data, {
				headers: jsonApiHeader(getAccessTokenFromLocalStorage(), 'application/json')
			})
			.then((response) => {
				dispatch(actionCreator(createArticleActionTypes.createArticle.SUCCESS));
			})
			.catch((error) => {
				dispatch(actionCreator(createArticleActionTypes.createArticle.FAILURE));
			});
	};
};