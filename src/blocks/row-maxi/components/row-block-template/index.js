/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */

import { Button, Icon } from '@components';
import { getBlockPosition } from '@extensions/repeater/utils';
import { getTemplates } from '@extensions/column-templates';
import loadColumnsTemplate from '@extensions/column-templates/loadColumnsTemplate';

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
	getInnerBlocksPositions,
}) => {
	const { selectBlock } = useDispatch('core/block-editor');

	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

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
									[`row-pattern-${baseBreakpoint}`]:
										template.name,
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

									const blockPosition = getBlockPosition(
										clientId,
										innerBlockPositions
									);

									const rowClientIds =
										innerBlockPositions[blockPosition];

									rowClientIds.forEach(rowClientId => {
										if (rowClientId === clientId) return;

										loadColumnsTemplate(
											template.name,
											rowClientId,
											deviceType
										);
									});
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
