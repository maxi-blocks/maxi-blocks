/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TypographyControl from '@components/typography-control';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Component
 *
 * Renders a dedicated Link settings panel using TypographyControl in link-only mode.
 */
const linkSettings = ({
	props,
	styleCardPrefix = '',
	depth = 2,
	inlineTarget = '.maxi-text-block__content',
	prefix = '',
	classNamePanel,
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

	return {
		label: __('Link settings', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<TypographyControl
				{...getGroupAttributes(
					attributes,
					['typography', 'link'],
					false,
					prefix
				)}
				onChangeInline={(obj, target, isMultiplySelector) =>
					insertInlineStyles({ obj, target, isMultiplySelector })
				}
				onChange={(obj, target) => {
					maxiSetAttributes(obj);
					cleanInlineStyles(target);
				}}
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
		),
		classNamePanel,
		depth,
	};
};

export default linkSettings;
