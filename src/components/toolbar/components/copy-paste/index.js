/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { cloneBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Dropdown from '../../../dropdown';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Component
 */
const ATTRIBUTES = [
	'alignment',
	'arrow',
	'background',
	'backgroundColor',
	'backgroundColorHover',
	'backgroundGradient',
	'backgroundGradientHover',
	'backgroundHover',
	'blockBackground',
	'border',
	'borderHover',
	'borderRadius',
	'borderRadiusHover',
	'borderWidth',
	'borderWidthHover',
	'boxShadow',
	'boxShadowHover',
	'breakpoints',
	'columnSize',
	'display',
	'divider',
	'margin',
	'motion',
	'opacity',
	'padding',
	'position',
	'shapeDivider',
	'size',
	'textAlignment',
	'transform',
	'typography',
	'typographyHover',
	'transitionDuration',
	'zIndex',
];
const WRAPPER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];

const CopyPasteContent = props => {
	const { clientId, blockName } = props;

	const [isOpen, setIsOpen] = useState(false);
	const [specialPaste, setSpecialPaste] = useState([]);

	const getOrganizedAttributes = attributes => {
		const response = {};

		ATTRIBUTES.forEach(attr => {
			const obj = getGroupAttributes(attributes, attr, false, '', true);

			if (!isEmpty(obj)) response[attr] = obj;
		});

		return response;
	};

	const cleanStyleAttributes = attr => {
		let response = {};

		ATTRIBUTES.forEach(typeAttr => {
			response = {
				...response,
				...getGroupAttributes(attr, typeAttr, false, '', true),
			};
		});

		return response;
	};

	const {
		blockAttributes,
		organizedAttributes,
		copiedStyles,
		copiedBlocks,
		innerBlocks,
		hasInnerBlocks,
	} = useSelect(select => {
		const { receiveCopiedStyles, receiveCopiedBlocks } =
			select('maxiBlocks');
		const { getBlock } = select('core/block-editor');

		const copiedStyles = receiveCopiedStyles();
		const copiedBlocks = receiveCopiedBlocks();

		const organizedAttributes =
			(copiedStyles && getOrganizedAttributes(copiedStyles)) || {};

		const blockValues = getBlock(clientId);
		const blockAttributes = cleanStyleAttributes(blockValues.attributes);
		const { innerBlocks } = blockValues;
		const hasInnerBlocks = !isEmpty(innerBlocks);

		return {
			blockAttributes,
			organizedAttributes,
			copiedStyles,
			copiedBlocks,
			innerBlocks,
			hasInnerBlocks,
		};
	});

	const cleanInnerBlocks = innerBlocks => {
		const test = innerBlocks.map(block => {
			block.innerBlocks = cleanInnerBlocks(block.innerBlocks);

			return cloneBlock(block);
		});

		return test;
	};

	const { copyStyles, copyNestedBlocks } = useDispatch('maxiBlocks');
	const { updateBlockAttributes, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	const onCopyStyles = () => copyStyles(blockAttributes);
	const onPasteStyles = () => updateBlockAttributes(clientId, copiedStyles);

	const onCopyBlocks = () => copyNestedBlocks(innerBlocks);
	const onPasteBlocks = () =>
		replaceInnerBlocks(clientId, cleanInnerBlocks(copiedBlocks));

	const handleSpecialPaste = attr => {
		const newSpecialPaste = specialPaste.includes(attr)
			? specialPaste.filter(item => {
					return item !== attr;
			  })
			: [...specialPaste, attr];

		setSpecialPaste(newSpecialPaste);
	};

	const onSpecialPaste = () => {
		let res = {};

		Object.entries(organizedAttributes).forEach(([key, val]) => {
			const isSelected = specialPaste.some(label => label === key);

			if (isSelected) res = { ...res, ...val };
		});

		onPasteStyles(res);
	};

	return (
		<div className='toolbar-item__copy-paste__popover'>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				onClick={onCopyStyles}
			>
				{__('Copy Style', 'maxi-blocks')}
			</Button>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				onClick={onPasteStyles}
				disabled={isEmpty(copiedStyles)}
			>
				{__('Paste Style', 'maxi-blocks')}
			</Button>
			{!isEmpty(organizedAttributes) && (
				<>
					<Button
						className='toolbar-item__copy-paste__popover__button'
						onClick={() => setIsOpen(!isOpen)}
					>
						{__('Special Paste', 'maxi-blocks')}
					</Button>
					{isOpen && (
						<form>
							{!isNil(organizedAttributes) &&
								!isEmpty(organizedAttributes) &&
								Object.keys(organizedAttributes).map(attr => {
									return (
										<div
											className='toolbar-item__copy-paste__popover__item'
											key={`copy-paste-${attr}`}
										>
											<label
												htmlFor={attr}
												className='maxi-axis-control__content__item__checkbox'
											>
												<input
													type='checkbox'
													name={attr}
													id={attr}
													onClick={() =>
														handleSpecialPaste(attr)
													}
												/>
												<span>{attr}</span>
											</label>
										</div>
									);
								})}
							<Button
								className='toolbar-item__copy-paste__popover__button toolbar-item__copy-paste__popover__button--special'
								onClick={onSpecialPaste}
							>
								{__('Paste Special Style', 'maxi-blocks')}
							</Button>
						</form>
					)}
				</>
			)}
			{hasInnerBlocks && (
				<Button
					className='toolbar-item__copy-paste__popover__button toolbar-item__copy-nested-block__popover__button'
					onClick={onCopyBlocks}
				>
					{__('Copy Nested Blocks', 'maxi-blocks')}
				</Button>
			)}
			{WRAPPER_BLOCKS.includes(blockName) && (
				<Button
					className='toolbar-item__copy-paste__popover__button'
					onClick={onPasteBlocks}
					disabled={isEmpty(copiedBlocks)}
				>
					{__('Paste Nested Blocks', 'maxi-blocks')}
				</Button>
			)}
		</div>
	);
};

const CopyPaste = props => (
	<Dropdown
		className='maxi-copypaste__copy-selector'
		contentClassName='maxi-more-settings__popover maxi-dropdown__child-content'
		position='right top'
		renderToggle={({ isOpen, onToggle }) => (
			<Button onClick={onToggle} text='Copy'>
				{__('Copy / Paste', 'maxi-blocks')}
			</Button>
		)}
		renderContent={() => <CopyPasteContent {...props} />}
	/>
);

export default CopyPaste;
