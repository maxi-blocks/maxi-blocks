/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

const getColorBackgroundStyles = (obj, isHover = false, prefix) => {
	const response = {
		label: 'Background Color',
		general: {},
	};

	if (
		!isNil(
			obj[
				`${prefix ? prefix : ''}background-gradient-opacity${
					isHover ? '-hover' : ''
				}`
			]
		)
	)
		response.general.opacity =
			obj[
				`${prefix ? prefix : ''}background-gradient-opacity${
					isHover ? '-hover' : ''
				}`
			];

	if (
		!isEmpty(
			obj[
				`${prefix ? prefix : ''}background-gradient${
					isHover ? '-hover' : ''
				}`
			]
		)
	)
		response.general.background =
			obj[
				`${prefix ? prefix : ''}background-gradient${
					isHover ? '-hover' : ''
				}`
			];

	if (
		!isEmpty(
			obj[
				`${prefix ? prefix : ''}background-color${
					isHover ? '-hover' : ''
				}`
			]
		)
	)
		response.general['background-color'] =
			obj[
				`${prefix ? prefix : ''}background-color${
					isHover ? '-hover' : ''
				}`
			];

	if (!isEmpty(obj[`'${prefix ? prefix : ''}background-clip-path`]))
		response.general['clip-path'] =
			obj[`${prefix ? prefix : ''}background-clip-path`];

	return response;
};

export default getColorBackgroundStyles;
