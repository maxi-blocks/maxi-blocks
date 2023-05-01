/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';
import { getAttributeKey, getAttributeValue } from '../../extensions/styles';
import { validateRowColumnsStructure } from '../../extensions/repeater';

const Repeater = ({
	clientId,
	columnRefClientId,
	innerBlocksPositions,
	onChange,
	...attributes
}) => {
	const repeaterStatus = getAttributeValue({
		target: 'repeater-status',
		props: attributes,
	});

	const classes = 'maxi-repeater';

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Enable repeater', 'maxi-blocks')}
				selected={repeaterStatus}
				onChange={val => {
					onChange({
						[getAttributeKey('repeater-status')]: val,
					});

					if (val) {
						validateRowColumnsStructure(
							clientId,
							innerBlocksPositions
						);
					}
				}}
			/>
		</div>
	);
};

export default Repeater;
