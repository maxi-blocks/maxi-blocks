import { stylesCleaner } from '../../extensions/styles';

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			'': { general: { width: '900px' } },
		}),
	};
	return response;
};

export default getStyles;
