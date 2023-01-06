/**
 * External dependencies
 */
import { pickBy } from 'lodash';

const getFilteredData = (styles, { id, name }) => {
	const getPredicate = () => {
		switch (name) {
			case 'wp_template':
				return (_value, key) =>
					!key.includes('template-part') && key.includes('template');
			case 'wp_template_part':
				return (_value, key) =>
					key.includes(`${id.split('//', 2)[1]}-template-part`);
			default:
				return (_value, key) => !key.includes('template');
		}
	};

	return pickBy(styles, getPredicate());
};

export default getFilteredData;
