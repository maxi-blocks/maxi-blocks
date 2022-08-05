/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	FontLevelControl,
	SettingTabsControl,
	TypographyControl,
} from '../../../../components';
import { getGroupAttributes } from '../../../../extensions/styles';

const MapPopupTextControl = ({
	blockStyle,
	clientId,
	deviceType,
	onChange,
	...attributes
}) => {
	const typographyProps = {
		blockStyle,
		breakpoint: deviceType,
		clientId,
		disableCustomFormats: true,
		hideAlignment: true,
		onChange,
	};

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Title', 'maxi-blocks'),
					content: (
						<>
							<span>
								{__('Marker title text', 'maxi-blocks')}
							</span>
							<FontLevelControl
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								value={attributes['map-marker-heading-level']}
								onChange={obj => {
									onChange({
										'map-marker-heading-level':
											obj.textLevel,
									});
								}}
							/>
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								textLevel={
									attributes['map-marker-heading-level']
								}
								{...typographyProps}
							/>
						</>
					),
				},
				{
					label: __('Description', 'maxi-blocks'),
					content: (
						<>
							<span>
								{__('Marker description text', 'maxi-blocks')}
							</span>
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									'typography',
									false,
									'description-'
								)}
								prefix='description-'
								{...typographyProps}
							/>
						</>
					),
				},
			]}
		/>
	);
};

export default MapPopupTextControl;
