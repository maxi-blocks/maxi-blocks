/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CopyPasteChildGroup from './CopyPastChildGroup';

/**
 * External dependencies
 */
import { isEmpty, isEqual, kebabCase, omit } from 'lodash';

const CopyPasteGroup = props => {
	const {
		tab,
		label,
		organizedAttributes,
		currentOrganizedAttributes,
		selectedAttributes,
		specialPaste,
		handleSpecialPaste,
	} = props;
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenChild, setIsOpenChild] = useState({});
	const [isUpdate, setIsUpdate] = useState(false);

	const normalizedLabel = kebabCase(label);

	const checkNestedCheckboxes = (attrType, tab, checked) => {
		handleSpecialPaste({
			attr: Object.keys(
				omit(organizedAttributes[tab][attrType], 'group')
			),
			tab,
			group: attrType,
			checked,
		});
	};

	const isGroupCheckboxChecked = (
		tabSpecialPaste,
		labelOrganizedAttributes,
		label
	) => {
		const count = Object.keys(labelOrganizedAttributes).length - 1;
		const currentCount = tabSpecialPaste.filter(item =>
			Object.keys(item).includes(label)
		).length;
		return currentCount === count;
	};

	const openChildMenu = ({ id, isOpenMenu }) => {
		const newIsOpenChild = isOpenChild;
		newIsOpenChild[id] = !isOpenMenu;
		setIsOpenChild(newIsOpenChild);
		setIsUpdate(!isUpdate);
	};

	const handleChangeCallback = ({ name, attr, tab, checked, group }) => {
		handleSpecialPaste({
			name,
			attr,
			tab,
			checked,
			group,
		});
	};

	return (
		<>
			<div
				className='toolbar-item__copy-paste__popover__item toolbar-item__copy-paste__popover__item__group'
				onClick={e => {
					if (e.target.nodeName !== 'INPUT') setIsOpen(!isOpen);
				}}
			>
				<input
					type='checkbox'
					name={normalizedLabel}
					id={normalizedLabel}
					checked={isGroupCheckboxChecked(
						specialPaste[tab],
						organizedAttributes[tab][label],
						label
					)}
					onChange={e =>
						checkNestedCheckboxes(label, tab, e.target.checked)
					}
				/>
				<span onClick={e => e.preventDefault()}>
					<label htmlFor={normalizedLabel}>{label}</label>
				</span>
				<span
					onClick={e => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					className='copy-paste__group-icon'
				/>
			</div>
			{isOpen &&
				Object.keys(organizedAttributes[tab][label]).map(attr => {
					// To prevent the group checkbox triggering from nested items
					const uniqueAttr = kebabCase(
						attr === label ? `${label}-nested` : attr
					);
					const id = `${tab}-${uniqueAttr}`;
					const isOpenMenu =
						typeof isOpenChild[id] !== 'undefined'
							? isOpenChild[id]
							: false;

					return (
						!isEqual(
							currentOrganizedAttributes[tab][label][attr],
							organizedAttributes[tab][label][attr]
						) && (
							<div
								key={`copy-paste-${id}`}
								className='toolbar-item__copy-paste__wrapper toolbar-item__copy-paste__popover__item'
							>
								<div
									className='toolbar-item__copy-paste__item'
									data-copy_paste_group={kebabCase(label)}
									onClick={e => {
										if (e.target.nodeName !== 'INPUT')
											openChildMenu({ id, isOpenMenu });
									}}
								>
									<input
										type='checkbox'
										name={uniqueAttr}
										id={uniqueAttr}
										checked={
											!isEmpty(
												specialPaste[tab].filter(sp => {
													return (
														typeof sp ===
															'object' &&
														Object.values(
															sp
														).includes(attr)
													);
												})
											)
										}
										onChange={e =>
											handleSpecialPaste({
												attr,
												tab,
												checked: e.target.checked,
												group: label,
											})
										}
									/>
									<span>{attr}</span>
									<span
										onClick={e =>
											openChildMenu({ id, isOpenMenu })
										}
										aria-expanded={isOpenMenu}
										className='copy-paste__group-icon'
									/>
								</div>
								{isOpenMenu && (
									<CopyPasteChildGroup
										parentCallback={handleChangeCallback}
										attr={attr}
										label={label}
										tab={tab}
										selectedAttributes={selectedAttributes}
										specialPaste={specialPaste}
										organizedAttributes={
											organizedAttributes
										}
										currentOrganizedAttributes={
											currentOrganizedAttributes
										}
									/>
								)}
							</div>
						)
					);
				})}
		</>
	);
};

export default CopyPasteGroup;
