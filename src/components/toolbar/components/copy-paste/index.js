/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import ToolbarContext from '../toolbar-popover/toolbarContext';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import {
	toolbarCopyPaste,
	toolbarCopy,
	toolbarPaste,
	toolbarSpecialPaste,
} from '../../../../icons';
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
	'entrance',
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
	'zIndex',
];

const CopyPasteContent = props => {
	const { clientId } = props;

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

	const { blockAttributes, organizedAttributes, copiedStyles } = useSelect(
		select => {
			const { getBlockAttributes } = select('core/block-editor');
			const { receiveCopiedStyles } = select('maxiBlocks');

			const copiedStyles = receiveCopiedStyles();
			const organizedAttributes =
				(copiedStyles && getOrganizedAttributes(copiedStyles)) || {};

			const blockAttributes = cleanStyleAttributes(
				getBlockAttributes(clientId)
			);

			return {
				blockAttributes,
				organizedAttributes,
				copiedStyles,
			};
		}
	);

	const { copyStyles } = useDispatch('maxiBlocks');
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const onCopy = () => copyStyles(blockAttributes);
	const onPaste = () => updateBlockAttributes(clientId, copiedStyles);

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

		onPaste(res);
	};

	return (
		<div className='toolbar-item__copy-paste__popover'>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				icon={toolbarCopy}
				onClick={onCopy}
			>
				{__('Copy Style', 'maxi-blocks')}
			</Button>
			<Button
				className='toolbar-item__copy-paste__popover__button'
				icon={toolbarPaste}
				onClick={onPaste}
				disabled={isEmpty(copiedStyles)}
			>
				{__('Paste Style', 'maxi-blocks')}
			</Button>
			{!isEmpty(organizedAttributes) && (
				<>
					<Button
						className='toolbar-item__copy-paste__popover__button'
						icon={toolbarSpecialPaste}
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
		</div>
	);
};

const CopyPaste = props => {
	return (
		<ToolbarPopover
			className='toolbar-item__copy-paste'
			tooltip={__('Copy / Paste Style', 'maxi-blocks')}
			icon={toolbarCopyPaste}
		>
			<ToolbarContext.Consumer>
				{({ isOpen }) => {
					if (isOpen) return <CopyPasteContent {...props} />;

					return null;
				}}
			</ToolbarContext.Consumer>
		</ToolbarPopover>
	);
};

export default CopyPaste;
