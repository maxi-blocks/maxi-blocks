/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockStylesControl from '../block-styles-control';
import CustomLabel from '../custom-label';

/**
 * Component
 */
const blockSettings = ({ props }) => {
	const { attributes, deviceType, clientId, maxiSetAttributes } = props;
	const { blockStyle, customLabel, isFirstOnHierarchy, blockStyleOriginal } =
		attributes;

	return (
		deviceType === 'general' && (
			<div className='maxi-tab-content__box'>
				<CustomLabel
					customLabel={customLabel}
					onChange={customLabel =>
						maxiSetAttributes({
							customLabel,
						})
					}
				/>
				<BlockStylesControl
					blockStyleOriginal={blockStyleOriginal}
					blockStyle={blockStyle}
					isFirstOnHierarchy={isFirstOnHierarchy}
					onChange={obj => maxiSetAttributes(obj)}
					clientId={clientId}
				/>
			</div>
		)
	);
};

export default blockSettings;
