/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';
import ToggleSwitch from '@components/toggle-switch';
import DialogBox from '@components/dialog-box';
import { getAttributeKey, getAttributeValue } from '@extensions/styles';
import { validateRowColumnsStructure } from '@extensions/repeater';

const Repeater = ({
	clientId,
	isRepeaterInherited,
	updateInnerBlocksPositions,
	onChange,
	...attributes
}) => {
	const {
		__unstableMarkNextChangeAsNotPersistent: markNextChangeAsNotPersistent,
	} = useDispatch('core/block-editor');

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
					onChange={async val => {
						if (!val) {
							onChange({
								[getAttributeKey('repeater-status')]: val,
							});
							return;
						}

						const newInnerBlocksPositions =
							updateInnerBlocksPositions();

						const isStructureValidated =
							await validateRowColumnsStructure(
								clientId,
								newInnerBlocksPositions,
								async () =>
									new Promise(resolve => {
										setIsModalHidden(false);
										setResolveConfirmation(() => resolve);
									}),
								undefined,
								true
							);

						if (isStructureValidated) {
							markNextChangeAsNotPersistent();
							onChange({
								[getAttributeKey('repeater-status')]: val,
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
