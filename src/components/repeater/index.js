/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const InfoBox = loadable(() => import('../info-box'));
const ToggleSwitch = loadable(() => import('../toggle-switch'));
const DialogBox = loadable(() => import('../dialog-box'));
import { getAttributeKey, getAttributeValue } from '../../extensions/styles';
import { validateRowColumnsStructure } from '../../extensions/repeater';

const Repeater = ({
	clientId,
	isRepeaterInherited,
	updateInnerBlocksPositions,
	onChange,
	...attributes
}) => {
	const [isModalHidden, setIsModalHidden] = useState(true);
	const [resolveConfirmation, setResolveConfirmation] = useState(null);

	const repeaterStatus = getAttributeValue({
		target: 'repeater-status',
		props: attributes,
	});

	const classes = 'maxi-repeater';

	return (
		<div className={classes}>
			{!isRepeaterInherited && (
				<ToggleSwitch
					className={`${classes}__toggle`}
					label={__('Enable repeater', 'maxi-blocks')}
					selected={repeaterStatus}
					onChange={val => {
						if (!val) {
							onChange({
								[getAttributeKey('repeater-status')]: val,
							});
						}

						if (val) {
							const newInnerBlocksPositions =
								updateInnerBlocksPositions();

							validateRowColumnsStructure(
								clientId,
								newInnerBlocksPositions,
								async () =>
									new Promise(resolve => {
										setIsModalHidden(false);
										setResolveConfirmation(() => resolve);
									})
							).then(isStructureValidated => {
								if (isStructureValidated) {
									onChange({
										[getAttributeKey('repeater-status')]:
											val,
									});
								}
							});
						}
					}}
				/>
			)}
			<DialogBox
				message={__(
					'Columns are not uniformly structured. To standardize, all columns will be updated to match the first one.',
					'maxi-blocks'
				)}
				cancelLabel={__('Cancel', 'maxi-blocks')}
				confirmLabel={__('Continue', 'maxi-blocks')}
				isHidden={isModalHidden}
				setIsHidden={setIsModalHidden}
				onConfirm={() => {
					if (resolveConfirmation) {
						resolveConfirmation(true);
					}
					setResolveConfirmation(null);
				}}
			/>
			{isRepeaterInherited && (
				<InfoBox
					message={__(
						'Inherited from parent row. To edit, please disable higher level repeater.',
						'maxi-blocks'
					)}
				/>
			)}
		</div>
	);
};

export default Repeater;
