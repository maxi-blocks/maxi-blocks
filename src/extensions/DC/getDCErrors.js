import { descriptionOfErrors } from './constants';

const getDCErrors = (type, error, show, relation) => {
	if (type === 'posts' && error === 'next' && show === 'next') {
		return descriptionOfErrors.next;
	}

	if (type === 'posts' && error === 'previous' && relation === 'previous') {
		return descriptionOfErrors.previous;
	}

	if (error === 'author' && relation === 'author') {
		return descriptionOfErrors.author;
	}

	if (type === 'media' && error === 'media') {
		return descriptionOfErrors.media;
	}

	if (type === 'tags' && error === 'tags') {
		return descriptionOfErrors.tags;
	}

	return false;
};

export default getDCErrors;
