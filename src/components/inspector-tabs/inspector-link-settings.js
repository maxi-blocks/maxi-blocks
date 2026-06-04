/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ToggleSwitch from '@components/toggle-switch';
import TypographyControl from '@components/typography-control';
import { getGroupAttributes } from '@extensions/styles';
import {
	getIsLinkStyleCardOverwriteEnabled,
	getLinkPaletteScStatusUpdates,
} from './inspector-link-settings.utils';

const getStyleCardLinkValues = blockStyle => {
	try {
		const styleCardsStore = select('maxiBlocks/style-cards');
		const receiveStyleCardValue =
			styleCardsStore?.receiveSelectedStyleCardValue;

		if (!receiveStyleCardValue) return {};

		const getValue = target =>
			receiveStyleCardValue(target, blockStyle, 'link');

		return {
			link: {
				paletteColor: getValue('link-palette-color'),
				paletteOpacity: getValue('link-palette-opacity'),
			},
			hover: {
				paletteColor: getValue('hover-palette-color'),
				paletteOpacity: getValue('hover-palette-opacity'),
			},
			active: {
				paletteColor: getValue('active-palette-color'),
				paletteOpacity: getValue('active-palette-opacity'),
			},
			visited: {
				paletteColor: getValue('visited-palette-color'),
				paletteOpacity: getValue('visited-palette-opacity'),
			},
		};
	} catch (error) {
		return { error: error?.message };
	}
};

/**
 * Component
 *
 * Renders a dedicated Link styles panel using TypographyControl in link-only mode.
 */
const linkSettings = ({
	props,
	customLabel,
	styleCardPrefix = '',
	depth = 2,
	inlineTarget = '.maxi-text-block__content',
	prefix = '',
	classNamePanel,
	disableCustomFormats,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
		setShowLoader,
	} = props;

	const { blockStyle, isList } = attributes;
	const label = customLabel ?? __('Link styles', 'maxi-blocks');
	const isLinkStyleCardOverwriteEnabled = getIsLinkStyleCardOverwriteEnabled(
		attributes,
		prefix
	);

	return {
		label,
		ignoreIndicatorGroups: ['typography'],
		content: (
			<Fragment>
				<ToggleSwitch
					label={__('Overwrite style cards', 'maxi-blocks')}
					selected={isLinkStyleCardOverwriteEnabled}
					onChange={value => {
						const updates = getLinkPaletteScStatusUpdates(
							prefix,
							value,
							deviceType,
							getStyleCardLinkValues(blockStyle),
							attributes?.['custom-formats']
						);
						maxiSetAttributes(updates);
						if (!value) cleanInlineStyles();
					}}
				/>
				{isLinkStyleCardOverwriteEnabled && (
					<TypographyControl
						{...getGroupAttributes(
							attributes,
							['typography', 'link'],
							false,
							prefix
						)}
						onChangeInline={(obj, target, isMultiplySelector) =>
							insertInlineStyles({
								obj,
								target,
								isMultiplySelector,
							})
						}
						onChange={(obj, target) => {
							maxiSetAttributes(obj);
							cleanInlineStyles(target);
						}}
						disableCustomFormats={disableCustomFormats}
						setShowLoader={setShowLoader}
						breakpoint={deviceType}
						clientId={clientId}
						blockStyle={blockStyle}
						styleCardPrefix={styleCardPrefix}
						inlineTarget={inlineTarget}
						isList={isList}
						allowLink
						linkOnly
						globalProps={{ target: 'link', type: 'link' }}
						prefix={prefix}
					/>
				)}
			</Fragment>
		),
		classNamePanel,
		depth,
	};
};

export default linkSettings;
