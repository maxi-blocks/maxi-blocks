/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Button, Icon } from '../../../../components';
import { getTemplates } from '../../../../extensions/column-templates';
import { validateRowColumnsStructure } from '../../../../extensions/repeater';
import loadColumnsTemplate from '../../../../extensions/column-templates/loadColumnsTemplate';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const RowBlockTemplate = ({
	clientId,
	maxiSetAttributes,
	deviceType,
	repeaterStatus,
	repeaterRowClientId,
	innerBlockPositions,
	getInnerBlocksPositions,
}) => {
	const { selectBlock } = useDispatch('core/block-editor');

	return (
		<>
			<div className='maxi-row-block__title'>
				<span>{__('Column picker', 'maxi-blocks')}</span>
			</div>
			<div
				className='maxi-row-block__template'
				onClick={() => selectBlock(clientId)}
				key={`maxi-row-block--${clientId}`}
			>
				{getTemplates(repeaterStatus).map(template => {
					return (
						<Button
							key={uniqueId(`maxi-row-block--${clientId}--`)}
							className='maxi-row-block__template__button'
							onClick={() => {
								maxiSetAttributes({
									'row-pattern-general': template.name,
									'row-pattern-m': template.responsiveLayout,
								});
								loadColumnsTemplate(
									template.name,
									clientId,
									deviceType
								);

								if (
									repeaterStatus &&
									clientId !== repeaterRowClientId
								) {
									const innerBlockPositions =
										getInnerBlocksPositions();

									const parentRepeaterColumnClientId = select(
										'core/block-editor'
									)
										.getBlockParentsByBlockName(
											clientId,
											'maxi-blocks/column-maxi'
										)
										.find(columnClientId =>
											innerBlockPositions[[-1]].includes(
												columnClientId
											)
										);

									validateRowColumnsStructure(
										repeaterRowClientId,
										innerBlockPositions,
										parentRepeaterColumnClientId
									);
								}
							}}
						>
							<Icon
								className='maxi-row-block__template__icon'
								icon={template.icon}
								avoidSize
							/>
						</Button>
					);
				})}
			</div>
		</>
	);
};

export default RowBlockTemplate;
