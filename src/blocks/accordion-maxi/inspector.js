/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { SettingTabsControl } from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import MaxiModal from '../../editor/library/modal';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const { blockStyle } = attributes;

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
								<MaxiModal
									type='accordion-icon'
									style={blockStyle}
									onSelect={obj => maxiSetAttributes(obj)}
									onRemove={obj => maxiSetAttributes(obj)}
									icon={attributes['icon-content']}
									label='Icon'
								/>

								<MaxiModal
									type='accordion-icon-active'
									style={blockStyle}
									onSelect={obj => maxiSetAttributes(obj)}
									onRemove={obj => maxiSetAttributes(obj)}
									icon={attributes['icon-content-active']}
									label='Icon Active'
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
