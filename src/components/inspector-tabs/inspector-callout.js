/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ArrowControl from '../arrow-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const callout = ({ props }) => {
	const { attributes, deviceType, setAttributes } = props;
	const { blockFullWidth } = attributes;

	return {
		label: __('Callout arrow', 'maxi-blocks'),
		content: (
			<ArrowControl
				{...getGroupAttributes(attributes, [
					'blockBackground',
					'arrow',
					'border',
				])}
				onChange={obj => setAttributes(obj)}
				isFullWidth={blockFullWidth}
				breakpoint={deviceType}
			/>
		),
	};
};

export default callout;
