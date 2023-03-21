/**
 * Internal dependencies
 */
import { getAttributesValue } from '../../extensions/styles';
import BlockStylesControl from '../block-styles-control';
import CustomLabel from '../custom-label';

/**
 * Component
 */
const blockSettings = ({ props }) => {
	const { attributes, deviceType, clientId, maxiSetAttributes } = props;
	const { blockStyle, customLabel, isFirstOnHierarchy } = getAttributesValue({
		target: ['blockStyle', 'customLabel', 'isFirstOnHierarchy'],
		props: attributes,
	});

	return (
		deviceType === 'general' && (
			<div className='maxi-tab-content__box  sidebar-block-info'>
				<CustomLabel
					customLabel={customLabel}
					onChange={customLabel =>
						maxiSetAttributes({
							customLabel,
						})
					}
				/>
				<BlockStylesControl
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
