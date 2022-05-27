/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const CopyPasteGroup = props => {
	const {
		tab,
		attrType,
		organizedAttributes,
		specialPaste,
		handleSpecialPaste,
	} = props;
	const [isOpen, setIsOpen] = useState(false);

	const checkNestedCheckboxes = (attrType, tab, checked) => {
		handleSpecialPaste({
			attr: Object.keys(organizedAttributes[tab][attrType].group),
			tab,
			group: attrType,
			checked,
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
					name={attrType}
					id={attrType}
					onChange={e =>
						checkNestedCheckboxes(attrType, tab, e.target.checked)
					}
				/>
				<span onClick={e => e.preventDefault()}>
					<label htmlFor={attrType}>
						{organizedAttributes[tab][attrType].label}
					</label>
				</span>
				<span
					onClick={e => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					className='copy-paste__group-icon'
				/>
			</div>
			{isOpen &&
				Object.keys(organizedAttributes[tab][attrType].group).map(
					attr => {
						return (
							<div
								className='toolbar-item__copy-paste__popover__item'
								key={`copy-paste-${tab}-${attr}`}
								data-copy_paste_group={attrType}
							>
								<label
									htmlFor={attr}
									className='maxi-axis-control__content__item__checkbox'
								>
									<input
										type='checkbox'
										name={attr}
										id={attr}
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
												group: attrType,
											})
										}
									/>
									<span>
										{
											organizedAttributes[tab][attrType]
												.group[attr].label
										}
									</span>
								</label>
							</div>
						);
					}
				)}
		</>
	);
};

export default CopyPasteGroup;
