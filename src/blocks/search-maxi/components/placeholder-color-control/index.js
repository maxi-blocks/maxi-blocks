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
					placeholder,
				})
			}
		/>
		<ResponsiveTabsControl breakpoint={deviceType}>
			<ColorControl
				label={__('Font', 'maxi-blocks')}
				className='maxi-typography-control__color'
				color={getLastBreakpointAttribute({
					target: 'placeholder-color',
					breakpoint: deviceType,
					attributes,
				})}
				prefix='placeholder-'
				paletteColor={getLastBreakpointAttribute({
					target: 'placeholder-palette-color',
					breakpoint: deviceType,
					attributes,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'placeholder-palette-opacity',
					breakpoint: deviceType,
					attributes,
				})}
				paletteStatus={getLastBreakpointAttribute({
					target: 'placeholder-palette-status',
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
						[getAttributeKey(
							'_cc',
							false,
							'placeholder-',
							deviceType
						)]: color,
						[getAttributeKey(
							'_pc',
							false,
							'placeholder-',
							deviceType
						)]: paletteColor,
						[getAttributeKey(
							'_ps',
							false,
							'placeholder-',
							deviceType
						)]: paletteStatus,
						[getAttributeKey(
							'_po',
							false,
							'placeholder-',
							deviceType
						)]: paletteOpacity,
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
