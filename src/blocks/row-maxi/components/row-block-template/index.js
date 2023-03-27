/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Button, Icon } from '../../../../components';
import { getTemplates } from '../../../../extensions/column-templates';
import loadColumnsTemplate from '../../../../extensions/column-templates/loadColumnsTemplate';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const RowBlockTemplate = ({ clientId, maxiSetAttributes, deviceType }) => {
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
				{getTemplates().map(template => {
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
