import { stylesCleaner } from '../../extensions/styles';

const getAccordionLayoutStyles = props => {
	const { attributes } = props;
	const response = {};

	return {
		' .maxi-pane-block__header': {},
	};
};
const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner({
			...getAccordionLayoutStyles(props),
		}),
	};
	return response;
};

export default getStyles;
