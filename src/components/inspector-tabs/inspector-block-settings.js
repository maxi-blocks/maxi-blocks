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
	const { attributes, deviceType, clientId } = props;
	const { blockStyle, customLabel, isFirstOnHierarchy } = attributes;

	return (
		deviceType === 'general' && (
			<div className='maxi-tab-content__box'>
				<CustomLabel
					customLabel={customLabel}
					onChange={customLabel =>
						setAttributes({
							customLabel,
						})
					}
				/>
				<BlockStylesControl
					blockStyle={blockStyle}
					isFirstOnHierarchy={isFirstOnHierarchy}
					onChange={obj => setAttributes(obj)}
					clientId={clientId}
				/>
			</div>
		)
	);
};

export default blockSettings;
