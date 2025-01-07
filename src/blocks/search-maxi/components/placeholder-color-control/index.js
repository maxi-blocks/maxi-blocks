/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import TextControl from '@components/text-control';
import { getLastBreakpointAttribute } from '@extensions/styles';

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
				paletteSCStatus={getLastBreakpointAttribute({
					target: 'placeholder-palette-sc-status',
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
					paletteSCStatus,
					paletteOpacity,
				}) => {
					onChange({
						[`placeholder-color-${deviceType}`]: color,
						[`placeholder-palette-color-${deviceType}`]:
							paletteColor,
						[`placeholder-palette-status-${deviceType}`]:
							paletteStatus,
						[`placeholder-palette-sc-status-${deviceType}`]:
							paletteSCStatus,
						[`placeholder-palette-opacity-${deviceType}`]:
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
