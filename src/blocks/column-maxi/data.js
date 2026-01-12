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
import { getColumnSizeStyles, getFlexStyles } from '@extensions/styles/helpers';
import { getCanvasSettings, getAdvancedSettings } from '@extensions/relations';

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
		[__('Column settings', 'maxi-blocks')]: {
			group: {
				[__('Fit content', 'maxi-blocks')]: 'column-fit-content',
				[__('Column size', 'maxi-blocks')]: 'column-size',
				[__('Vertical align', 'maxi-blocks')]: 'justify-content',
			},
			hasBreakpoints: true,
		},
		[__('Background', 'maxi-blocks')]: {
			template: 'blockBackground',
		},
		[__('Border', 'maxi-blocks')]: {
			template: 'border',
		},
		[__('Box shadow', 'maxi-blocks')]: {
			template: 'boxShadow',
		},
		[__('Size', 'maxi-blocks')]: {
			template: 'size',
		},
		[__('Margin/Padding', 'maxi-blocks')]: {
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

const inlineStylesTargets = {
	block: '',
};

const attributesToStyles = {
	'border-top-width': {
		target: inlineStylesTargets.block,
		property: 'border-top-width',
	},
	'border-right-width': {
		target: inlineStylesTargets.block,
		property: 'border-right-width',
	},
	'border-bottom-width': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-width',
	},
	'border-left-width': {
		target: inlineStylesTargets.block,
		property: 'border-left-width',
	},
	'border-top-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-left-radius',
	},
	'border-top-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-top-right-radius',
	},
	'border-bottom-right-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-right-radius',
	},
	'border-bottom-left-radius': {
		target: inlineStylesTargets.block,
		property: 'border-bottom-left-radius',
	},
	opacity: {
		target: inlineStylesTargets.block,
		property: 'opacity',
	},
	'flex-grow': {
		target: inlineStylesTargets.block,
		property: 'flex-grow',
	},
	'flex-shrink': {
		target: inlineStylesTargets.block,
		property: 'flex-shrink',
	},
	'row-gap': {
		target: inlineStylesTargets.block,
		property: 'row-gap',
	},
	'column-gap': {
		target: inlineStylesTargets.block,
		property: 'column-gap',
	},
	order: {
		target: inlineStylesTargets.block,
		property: 'order',
	},
	'margin-top': {
		target: inlineStylesTargets.block,
		property: 'margin-top',
	},
	'margin-right': {
		target: inlineStylesTargets.block,
		property: 'margin-right',
	},
	'margin-bottom': {
		target: inlineStylesTargets.block,
		property: 'margin-bottom',
	},
	'margin-left': {
		target: inlineStylesTargets.block,
		property: 'margin-left',
	},
	'padding-top': {
		target: inlineStylesTargets.block,
		property: 'padding-top',
	},
	'padding-right': {
		target: inlineStylesTargets.block,
		property: 'padding-right',
	},
	'padding-bottom': {
		target: inlineStylesTargets.block,
		property: 'padding-bottom',
	},
	'padding-left': {
		target: inlineStylesTargets.block,
		property: 'padding-left',
	},
	'position-top': {
		target: inlineStylesTargets.block,
		property: 'top',
	},
	'position-right': {
		target: inlineStylesTargets.block,
		property: 'right',
	},
	'position-bottom': {
		target: inlineStylesTargets.block,
		property: 'bottom',
	},
	'position-left': {
		target: inlineStylesTargets.block,
		property: 'left',
	},
	width: {
		target: inlineStylesTargets.block,
		property: 'width',
	},
	height: {
		target: inlineStylesTargets.block,
		property: 'height',
	},
	'min-width': {
		target: inlineStylesTargets.block,
		property: 'min-width',
	},
	'min-height': {
		target: inlineStylesTargets.block,
		property: 'min-height',
	},
	'max-width': {
		target: inlineStylesTargets.block,
		property: 'max-width',
	},
	'max-height': {
		target: inlineStylesTargets.block,
		property: 'max-height',
	},
};

const data = {
	name,
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	attributesToStyles,
};

export {
	copyPasteMapping,
	customCss,
	interactionBuilderSettings,
	ariaLabelsCategories,
	attributesToStyles,
};
export default data;
