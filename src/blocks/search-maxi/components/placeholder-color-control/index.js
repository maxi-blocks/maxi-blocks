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
						[getAttributeKey({
							key: '_cc',
							prefix: 'pla-',
							breakpoint: deviceType,
						})]: color,
						[getAttributeKey({
							key: '_pc',
							prefix: 'pla-',
							breakpoint: deviceType,
						})]: paletteColor,
						[getAttributeKey({
							key: '_ps',
							prefix: 'pla-',
							breakpoint: deviceType,
						})]: paletteStatus,
						[getAttributeKey({
							key: '_po',
							prefix: 'pla-',
							breakpoint: deviceType,
						})]: paletteOpacity,
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
