/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToggleSwitch from '../toggle-switch';
import { getAttributeKey, getAttributeValue } from '../../extensions/styles';
import { validateRowColumnsStructure } from '../../extensions/dom/detectNewBlocks';

const Repeater = ({ clientId, columnRefClientId, onChange, ...attributes }) => {
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
					if (val) validateRowColumnsStructure(clientId);

					// TODO: on repeater disable set first column attributes to all columns

					onChange({
						[getAttributeKey('repeater-status')]: val,
					});
				}}
			/>
		</div>
	);
};

export default Repeater;
