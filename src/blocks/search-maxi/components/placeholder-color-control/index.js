/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ColorControl,
	ResponsiveTabsControl,
	TextControl,
} from '../../../../components';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

const PlaceholderColorControl = ({
	placeholder,
	onChange,
	deviceType,
	clientId,
	insertInlineStyles,
	cleanInlineStyles,
	...attributes
}) => (
	<>
		<TextControl
			label={__('Placeholder text', 'maxi-blocks')}
			value={placeholder}
			onChange={placeholder =>
				onChange({
					pla: placeholder,
				})
			}
		/>
		<ResponsiveTabsControl breakpoint={deviceType}>
			<ColorControl
				label={__('Font', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getLastBreakpointAttribute({
					target: 'pla_cc',
					breakpoint: deviceType,
					attributes,
				})}
				prefix='pla-'
				paletteColor={getLastBreakpointAttribute({
					target: 'pla_pc',
					breakpoint: deviceType,
					attributes,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'pla_po',
					breakpoint: deviceType,
					attributes,
				})}
				paletteStatus={getLastBreakpointAttribute({
					target: 'pla_ps',
					breakpoint: deviceType,
					attributes,
				})}
				onChangeInline={({ color }) =>
					insertInlineStyles({
						obj: { color },
						target: ' .maxi-search-block__input',
						pseudoElement: '::placeholder',
					})
				}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) => {
					onChange({
						[getAttributeKey('_cc', false, 'pla-', deviceType)]:
							color,
						[getAttributeKey('_pc', false, 'pla-', deviceType)]:
							paletteColor,
						[getAttributeKey('_ps', false, 'pla-', deviceType)]:
							paletteStatus,
						[getAttributeKey('_po', false, 'pla-', deviceType)]:
							paletteOpacity,
					});
					cleanInlineStyles(
						' .maxi-search-block__input',
						'::placeholder'
					);
				}}
				deviceType={deviceType}
				clientId={clientId}
				disableGradient
			/>
		</ResponsiveTabsControl>
	</>
);

export default PlaceholderColorControl;
