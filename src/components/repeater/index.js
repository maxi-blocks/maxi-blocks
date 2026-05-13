/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';
import ToggleSwitch from '@components/toggle-switch';
import DialogBox from '@components/dialog-box';
import { getAttributeKey, getAttributeValue } from '@extensions/styles';
import {
	getDisallowedRepeaterBlocksFromClientId,
	validateRowColumnsStructure,
} from '@extensions/repeater';

const DISALLOWED_BLOCK_LABELS = {
	'maxi-blocks/accordion-maxi': __('Accordion', 'maxi-blocks'),
	'maxi-blocks/slider-maxi': __('Slider', 'maxi-blocks'),
	'maxi-blocks/map-maxi': __('Map', 'maxi-blocks'),
	'maxi-blocks/search-maxi': __('Search', 'maxi-blocks'),
};

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

	const disallowedBlocks = useSelect(
		select => {
			const blockEditor = select('core/block-editor');

			return getDisallowedRepeaterBlocksFromClientId(
				clientId,
				blockEditor
			);
		},
		[clientId]
	);

	const hasDisallowedBlocks = disallowedBlocks.length > 0;
	const disallowedBlockLabels = disallowedBlocks.map(
		blockName => DISALLOWED_BLOCK_LABELS[blockName] || blockName
	);

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
					disabled={!repeaterStatus && hasDisallowedBlocks}
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
			{!isRepeaterInherited && hasDisallowedBlocks && (
				<InfoBox
					message={sprintf(
						__(
							'Repeater cannot be enabled because this row contains blocks that are not supported: %s. Remove them to enable repeater.',
							'maxi-blocks'
						),
						disallowedBlockLabels.join(', ')
					)}
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
