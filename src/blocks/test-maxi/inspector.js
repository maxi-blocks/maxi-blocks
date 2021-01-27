/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;

/**
 * Internal dependencies
 */
import BorderControlTest from '../../components/border-control/newBorderControl';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import { AccordionControl } from '../../components';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType, setAttributes } = props;

	return (
		<InspectorControls>
			<AccordionControl
				isPrimary
				items={[
					{
						label: __('Border', 'maxi-blocks'),
						content: (
							<BorderControlTest
								label={__('Border', 'maxi-blocks')}
								onChange={obj => setAttributes(obj)}
								{...getGroupAttributes(
									props.attributes,
									'border'
								)}
								breakpoint={deviceType}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
