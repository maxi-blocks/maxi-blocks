/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import FlexSettingsControl from '@components/flex-settings-control';
import { getGroupAttributes } from '@extensions/styles';
import ResponsiveTabsControl from '@components/responsive-tabs-control';

/**
 * Component
 */
const flex = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes, name, clientId } = props;

	const { getBlockParents, getBlockName } = select('core/block-editor');

	const parentBlockName = getBlockName(
		getBlockParents(clientId)
			?.filter(id => id !== clientId)
			?.slice(-1)?.[0]
	);

	const wrapperBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/row-maxi',
		'maxi-blocks/column-maxi',
		'maxi-blocks/group-maxi',
		'maxi-blocks/accordion-maxi',
	];

	if (
		!wrapperBlocks.includes(parentBlockName) &&
		!wrapperBlocks.includes(name)
	)
		return null;

	const flexAttrNames = [
		'flex-grow',
		'flex-shrink',
		'flex-basis',
		'flex-basis-unit',
		'flex-wrap',
		'justify-content',
		'flex-direction',
		'align-items',
		'align-content',
		'row-gap',
		'row-gap-unit',
		'column-gap',
		'column-gap-unit',
		'order',
	];

	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const allFlexIndicatorProps = flexAttrNames.flatMap(attr =>
		breakpoints.map(bp => `${attr}-${bp}`)
	);

	return {
		label: __('Flexbox', 'maxi-blocks'),
		indicatorProps: allFlexIndicatorProps,
		content: (
			<ResponsiveTabsControl
				breakpoint={deviceType}
				getIndicatorProps={(bp, isBase) =>
					flexAttrNames.map(attr =>
						isBase ? `${attr}-general` : `${attr}-${bp}`
					)
				}
			>
				<FlexSettingsControl
					{...getGroupAttributes(attributes, 'flex')}
					onChange={maxiSetAttributes}
					breakpoint={deviceType}
					clientId={clientId}
					name={name}
					parentBlockName={parentBlockName}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default flex;
