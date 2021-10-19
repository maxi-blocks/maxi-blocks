/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BlockBackgroundControl from '../background-control/blockBackgroundControl';
import ToggleSwitch from '../toggle-switch';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const background = ({ props, prefix }) => {
	const { attributes, clientId, deviceType, setAttributes } = props;

	const hoverStatus = attributes[`${prefix}box-shadow-status-hover`];

	return {};
};

export default background;
