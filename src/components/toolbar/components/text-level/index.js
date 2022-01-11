/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FontLevelControl from '../../../font-level-control';
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';
import SelectControl from '../../../select-control';

import { isNil, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	toolbarH1,
	toolbarH2,
	toolbarH3,
	toolbarH4,
	toolbarH5,
	toolbarH6,
	toolbarP,
} from '../../../../icons';

/**
 * TextLevel
 */
const TextLevel = props => {
	const { blockName, value, isList, onChange, textLevel } = props;

	if (blockName !== 'maxi-blocks/text-maxi' || isList) return null;

	// const levelText = textLevel => {
	// 	switch (textLevel) {
	// 		case 'H1':
	// 			return 'Heading 1 (H1)';
	// 		case 'H2':
	// 			return 'Heading 2 (H2)';
	// 		case 'H3':
	// 			return 'Heading 3 (H3)';
	// 		case 'H4':
	// 			return 'Heading 4 (H4)';
	// 		case 'H5':
	// 			return 'Heading 5 (H5)';
	// 		case 'H6':
	// 			return 'Heading 6 (H6)';
	// 		case 'p':
	// 			return 'Normal text (p)';
	// 		default:
	// 			return 'Normal text (p)';
	// 	}
	// };

	const fontOptions = getGroupAttributes(props, 'typography');
	const fontOptionsHover = getGroupAttributes(props, 'typographyHover');

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [state, setState] = useState({
		lastLevel: value,
		p: {},
		pHover: {},
		h1: {},
		h1Hover: {},
		h2: {},
		h2Hover: {},
		h3: {},
		h3Hover: {},
		h4: {},
		h4Hover: {},
		h5: {},
		h5Hover: {},
		h6: {},
		h6Hover: {},
	});

	const saveOldies = value => {
		setState({
			[state.lastLevel]: fontOptions,
			[`${state.lastLevel}Hover`]: fontOptionsHover,
			lastLevel: value,
		});
	};

	const getNewColor = (newLevel, currentColor) => {
		const { lastLevel } = state;

		if (lastLevel !== 'p' && newLevel === 'p' && currentColor === 5)
			return 3;
		if (lastLevel === 'p' && newLevel.includes('h') && currentColor === 3)
			return 5;
		return currentColor;
	};

	const onChangeValue = value => {
		saveOldies(value);
		let fontOptResponse = {};
		let fontOptResponseHover = {};

		if (!isEmpty(state[value])) {
			fontOptResponse = state[value];
			fontOptResponseHover = state[`${value}Hover`];
		} else if (!isNil(fontOptions)) {
			const newColor = getNewColor(
				value,
				fontOptions['palette-color-general']
			);
			fontOptResponse = {
				...fontOptions,
				'palette-color-general': newColor,
			};
			fontOptResponseHover = {
				...fontOptionsHover,
				'palette-color-general-hover': 5,
			};
		}

		onChange({
			textLevel: value,
			...fontOptResponse,
			...fontOptResponseHover,
		});
	};
	// var test ={ levelText(textLevel) };

	return (
		// <ToolbarPopover
		// 	className='toolbar-item__text-level'
		// 	tooltip={__('Text level', 'maxi-blocks')}
		// 	icon={levelIcon(textLevel)}
		// >
		// 	<FontLevelControl
		// 		{...getGroupAttributes(props, [
		// 			'typography',
		// 			'typographyHover',
		// 		])}
		// 		value={textLevel}
		// 		onChange={obj => onChange(obj)}
		// 	/>
		// </ToolbarPopover>
		<SelectControl
			className='maxi-background-control__add-layer'
			value={textLevel}
			options={[
				{
					label: __('Normal text (p)', 'maxi-blocks'),
					value: 'p',
				},
				{
					label: __('Heading 1 (H1)', 'maxi-blocks'),
					value: 'H1',
				},
				{
					label: __('Heading 2 (H2)', 'maxi-blocks'),
					value: 'H2',
				},
				{
					label: __('Heading 3 (H3)', 'maxi-blocks'),
					value: 'H3',
				},
				{
					label: __('Heading 4 (H4)', 'maxi-blocks'),
					value: 'H4',
				},
				{
					label: __('Heading 5 (H5)', 'maxi-blocks'),
					value: 'H5',
				},
				{
					label: __('Heading 6 (H6)', 'maxi-blocks'),
					value: 'H6',
				},
			]}
			onChange={val => onChangeValue(val)}
		/>
	);
};

export default TextLevel;
