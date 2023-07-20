/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '../info-box';
import ToggleSwitch from '../toggle-switch';
import { getAttributeKey, getAttributeValue } from '../../extensions/styles';
import { validateRowColumnsStructure } from '../../extensions/repeater';

const Repeater = ({
	clientId,
	isRepeaterInherited,
	updateInnerBlocksPositions,
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
			{!isRepeaterInherited && (
				<ToggleSwitch
					className={`${classes}__toggle`}
					label={__('Enable repeater', 'maxi-blocks')}
					selected={repeaterStatus}
					onChange={val => {
						onChange({
							[getAttributeKey('repeater-status')]: val,
						});

						if (val) {
							const newInnerBlocksPositions =
								updateInnerBlocksPositions();

							validateRowColumnsStructure(
								clientId,
								newInnerBlocksPositions
							);
						}
					}}
				/>
			)}
			{isRepeaterInherited && (
				<InfoBox
					message={__(
						'Inherited from parent row. To edit, please disable higher level repeater.',
						'maxi-blocks'
					)}
				/>
			)}
		</div>
	);
};

export default Repeater;
