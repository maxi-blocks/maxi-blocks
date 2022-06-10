/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	SettingTabsControl,
	AccordionControl,
	AccordionSettings,
	AccordionTitleSettings,
	AccordionIconSettings,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, clientId } = props;
	const { blockStyle, accordionLayout, titleLevel } = attributes;
	const titleColors = {
		'title-color': attributes['title-color'],
		'title-palette-color': attributes['title-palette-color'],
		'title-palette-opacity': attributes['title-palette-opacity'],
		'title-palette-status': attributes['title-palette-status'],
		'title-background-color': attributes['title-background-color'],
		'title-background-palette-color':
			attributes['title-background-palette-color'],
		'title-background-palette-opacity':
			attributes['title-background-palette-opacity'],
		'title-background-palette-status':
			attributes['title-background-palette-status'],
	};

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<>
								{inspectorTabs.blockSettings({
									props: {
										...props,
									},
								})}
								<AccordionControl
									items={[
										{
											label: __(
												'Accordion Settings',
												'maxi-blocks'
											),
											content: (
												<AccordionSettings
													accordionLayout={
														accordionLayout
													}
													clientId={clientId}
													{...getGroupAttributes(
														attributes,
														'accordion'
													)}
													breakpoint={deviceType}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
												/>
											),
										},
										deviceType === 'general' && {
											label: __('Title', 'maxi-blocks'),
											content: (
												<AccordionTitleSettings
													titleLevel={titleLevel}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													{...titleColors}
													clientId={clientId}
												/>
											),
										},
										deviceType === 'general' && {
											label: __('Icon', 'maxi-blocks'),
											content: (
												<AccordionIconSettings
													{...getGroupAttributes(
														attributes,
														'accordionIcon'
													)}
													blockStyle={blockStyle}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
												/>
											),
										},
									]}
								/>
							</>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default withMaxiInspector(Inspector);
