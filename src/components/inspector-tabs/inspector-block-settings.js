/**
 * Internal dependencies
 */
import { getAttributesValue } from '../../extensions/attributes';
import BlockStylesControl from '../block-styles-control';
import CustomLabel from '../custom-label';

/**
 * Component
 */
const blockSettings = ({ props }) => {
	const { attributes, deviceType, clientId, maxiSetAttributes } = props;
	const [blockStyle, customLabel, isFirstOnHierarchy] = getAttributesValue({
		target: ['_bs', '_cl', '_ioh'],
		props: attributes,
	});

	return (
		deviceType === 'g' && (
			<div className='maxi-tab-content__box  sidebar-block-info'>
				<CustomLabel
					customLabel={customLabel}
					onChange={customLabel =>
						maxiSetAttributes({
							_cl: customLabel,
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
