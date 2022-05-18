/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { dispatch, select } from '@wordpress/data';

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
	const { attributes, deviceType, maxiSetAttributes, clientId } = props;
	const { blockStyle } = attributes;

	const changePaneIcon = obj => {
		const panes = select('core/block-editor').getClientIdsOfDescendants([
			clientId,
		]);
		panes.forEach(pane => {
			if (
				select('core/block-editor').getBlockName(pane) ===
				'maxi-blocks/pane-maxi'
			) {
				dispatch('core/block-editor').updateBlockAttributes(pane, obj);
			}
		});

		maxiSetAttributes(obj);
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
								<MaxiModal
									type='accordion-icon'
									style={blockStyle}
									onSelect={obj => changePaneIcon(obj)}
									onRemove={obj => changePaneIcon(obj)}
									icon={attributes['icon-content']}
									label='Icon'
								/>

								<MaxiModal
									type='accordion-icon-active'
									style={blockStyle}
									onSelect={obj => changePaneIcon(obj)}
									onRemove={obj => changePaneIcon(obj)}
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
