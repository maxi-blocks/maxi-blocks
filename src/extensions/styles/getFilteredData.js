/**
 * External dependencies
 */
import { pickBy } from 'lodash';

const getFilteredData = (styles, { id, name }) => {
	if (name === 'wp_template')
		return pickBy(
			styles,
			(_value, key) =>
				!key.includes('template-part') && key.includes('template')
		);

	if (name === 'wp_template_part')
		return pickBy(styles, (_value, key) =>
			key.includes(`${id.split('//', 2)[1]}-template-part`)
		);

	return pickBy(styles, (_value, key) => !key.includes('template'));
};

export default getFilteredData;
