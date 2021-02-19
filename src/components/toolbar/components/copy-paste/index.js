/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;
const { useState, Fragment } = wp.element;
const { useSelect, useDispatch, dispatch } = wp.data;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarSizing } from '../../../../icons';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Component
 */
const ATTRIBUTES = [
	'alignment',
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
	'display',
	'entrance',
	'highlight',
	'icon',
	'iconBorder',
	'iconBorderRadius',
	'iconBorderWidth',
	'iconPadding',
	'margin',
	'motion',
	'position',
	'size',
	'textAlignment',
	'transform',
	'typography',
	'typographyHover',
	'zIndex',
];

const CopyPaste = props => {
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

	const { blockAttributes, organizedAttributes, copiedStyles } = useSelect(
		select => {
			const { getBlockAttributes } = select('core/block-editor');
			const { receiveCopiedStyles } = select('maxiBlocks');

			const copiedStyles = receiveCopiedStyles();
			const organizedAttributes =
				(copiedStyles && getOrganizedAttributes(copiedStyles)) || {};

			const blockAttributes = getBlockAttributes(clientId);

			return {
				blockAttributes,
				organizedAttributes,
				copiedStyles,
			};
		}
	);

	const { copyStyles } = useDispatch('maxiBlocks');

	const onCopy = () => {
		copyStyles(blockAttributes);
	};

	const onPaste = () => {
		dispatch('core/block-editor').updateBlockAttributes(
			clientId,
			copiedStyles
		);
	};

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

		dispatch('core/block-editor').updateBlockAttributes(clientId, res);
	};

	return (
		<ToolbarPopover
			className='toolbar-item__copy-paste'
			tooltip={__('ColumnSize', 'maxi-blocks')}
			icon={toolbarSizing}
			advancedOptions='column settings'
			content={
				<div className='toolbar-item__copy-paste__popover'>
					<Button
						className='toolbar-item__popover__copy-paste__button'
						onClick={onCopy}
					>
						Copy
					</Button>
					<Button
						className='toolbar-item__popover__copy-paste__button'
						onClick={onPaste}
					>
						Paste
					</Button>
					{!isEmpty(organizedAttributes) && (
						<Fragment>
							<Button
								className='toolbar-item__popover__copy-paste__button'
								onClick={() => setIsOpen(!isOpen)}
							>
								Special paste
							</Button>
							{isOpen && (
								<form>
									{!isEmpty(organizedAttributes) &&
										Object.keys(organizedAttributes).map(
											attr => {
												return (
													<div
														key={`copy-paste-${attr}`}
													>
														<label htmlFor={attr}>
															{attr}
														</label>
														<input
															type='checkbox'
															name={attr}
															id={attr}
															onClick={() =>
																handleSpecialPaste(
																	attr
																)
															}
														/>
													</div>
												);
											}
										)}{' '}
									<Button
										className='toolbar-item__popover__copy-paste__button'
										onClick={onSpecialPaste}
									>
										Paste
									</Button>
								</form>
							)}
						</Fragment>
					)}
				</div>
			}
		/>
	);
};

export default CopyPaste;
