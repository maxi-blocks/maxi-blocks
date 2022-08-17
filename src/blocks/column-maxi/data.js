import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

import { createSelectors } from '../../extensions/styles/custom-css';
import { getGroupAttributes } from '../../extensions/styles';
import getParentRowClientId from '../../components/relation-control/getParentRowClientId';
import getRowGapProps from '../../extensions/attributes/getRowGapProps';
import * as Controls from '../../components';
import * as styleHelpers from '../../extensions/styles/helpers';
import getCanvasSettings from '../../components/relation-control/getCanvasSettings';

import { merge } from 'lodash';

const data = {
	name: 'column-maxi',
	copyPasteMapping: {
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
	},
	customCss: {
		selectors: createSelectors({
			column: {
				label: 'column',
				target: '',
			},
		}),
		categories: [
			'column',
			'before column',
			'after column',
			'background',
			'background hover',
		],
	},
	get interactionBuilderSettings() {
		return [
			{
				label: __('Column settings', 'maxi-blocks'),
				attrGroupName: ['columnSize', 'flex'],
				component: props => {
					const { getBlockAttributes } = select('core/block-editor');

					const rowPattern = getGroupAttributes(
						getBlockAttributes(
							getParentRowClientId(props.clientId)
						),
						'rowPattern'
					);

					return (
						<Controls.ColumnSizeControl
							{...props}
							rowPattern={rowPattern}
						/>
					);
				},
				helper: props => {
					const { getBlock } = select('core/block-editor');

					const parentRowBlock = getBlock(
						getParentRowClientId(props.clientId)
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
					const rowGapProps = getRowGapProps(
						parentRowBlock.attributes
					);

					return merge(
						styleHelpers.getColumnSizeStyles(
							props.obj,
							{
								...rowGapProps,
								columnNum,
								columnsSize,
							},
							props.clientId
						),
						styleHelpers.getFlexStyles(props.obj)
					);
				},
			},
			...getCanvasSettings(this),
		];
	},
};

const { copyPasteMapping, customCss, interactionBuilderSettings } = data;

export { copyPasteMapping, customCss, interactionBuilderSettings };
export default data;
