/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

const getOptions = values => {
	return [
		{
			label: __('Choose', 'maxi-blocks'),
			value: '',
		},
		...values.map(value => {
			return {
				label: __(capitalize(value), 'maxi-blocks'),
				value,
			};
		}),
	];
};

export default getOptions;
