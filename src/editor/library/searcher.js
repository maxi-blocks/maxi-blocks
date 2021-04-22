/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */

/**
 * Component
 */
const Component = props => {
	const { value, onChange } = props;

	return (
		<div className='maxi-cloud-searcher'>
			<input
				className='maxi-cloud-searcher__input'
				type='text'
				placeholder={__('Search…', 'maxi-blocks')}
				value={value}
				onChange={e => onChange(e.target.value)}
			/>
		</div>
	);
};

export default Component;
