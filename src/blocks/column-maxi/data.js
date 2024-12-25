/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { ColumnSizeControl } from './components';
import { createSelectors } from '@extensions/styles/custom-css';
import { getGroupAttributes } from '@extensions/styles';
import getRowGapProps from '@extensions/attributes/getRowGapProps';
import {
	getColumnSizeStyles,
	getFlexStyles,
} from '@extensions/styles/helpers';
import {
	getCanvasSettings,
	getAdvancedSettings,
} from '@extensions/relations';

/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Data object
 */
const name = 'column-maxi';
const copyPasteMapping = {
	settings: {
		'Column settings': {
			group: {
				'Fit content': 'column-fit-content',
				'Column size': 'column-size',
				'Vertical align': 'justify-content',
			},
			hasBreakpoints: true,
		},
		Background: {
			template: 'blockBackground',
		},
		Border: {
			template: 'border',
		},
		'Box shadow': {
			template: 'boxShadow',
		},
		Size: {
			template: 'size',
		},
		'Margin/Padding': {
			template: 'marginPadding',
		},
	},
	advanced: {
		template: 'advanced',
	},
};
const customCss = {
	selectors: createSelectors({
		column: '',
	}),
	categories: [
		'column',
		'before column',
		'after column',
		'background',
		'background hover',
	],
};
const ariaLabelsCategories = ['column'];
const interactionBuilderSettings = {
	block: [
		{
			sid: 'cs',
			label: __('Column settings', 'maxi-blocks'),
			attrGroupName: ['columnSize', 'flex'],
			component: props => {
				const { getBlockAttributes } = select('core/block-editor');

				const rowPattern = getGroupAttributes(
					getBlockAttributes(
						select('core/block-editor').getBlockRootClientId(
							props.clientId
						)
					),
					'rowPattern'
				);

				return <ColumnSizeControl {...props} rowPattern={rowPattern} />;
			},
			helper: props => {
				const { getBlock } = select('core/block-editor');

				const parentRowBlock = getBlock(
					wp.data
						.select('core/block-editor')
						.getBlockRootClientId(props.clientId)
				);

				const columnsSize = parentRowBlock.innerBlocks.reduce(
					(acc, block) => ({
						...acc,
						[block.clientId]: getGroupAttributes(
							block.attributes,
							'columnSize'
						),
					}),
					{}
				);

				const columnNum = parentRowBlock.innerBlocks.length;
				const rowGapProps = getRowGapProps(parentRowBlock.attributes);

				return merge(
					getColumnSizeStyles(
						props.obj,
						{
							...rowGapProps,
							columnNum,
							columnsSize,
						},
						props.clientId
					),
					getFlexStyles(props.obj)
				);
			},
		},
		...getCanvasSettings({ name }),
	],
	advanced: getAdvancedSettings({ customCss }),
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
};
export default data;
