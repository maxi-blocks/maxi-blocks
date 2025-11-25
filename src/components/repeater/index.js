/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';
import ToggleSwitch from '@components/toggle-switch';
import DialogBox from '@components/dialog-box';
import { getAttributeKey, getAttributeValue } from '@extensions/styles';
import { validateRowColumnsStructure } from '@extensions/repeater';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';

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
        const [isValidating, setIsValidating] = useState(false);

        const lastValidatedInnerBlocksPositions = useRef(null);
        const precomputedInnerBlocksPositions = useRef(null);

        const repeaterStatus = getAttributeValue({
                target: 'repeater-status',
                props: attributes,
        });

        useEffect(() => {
                if (isRepeaterInherited) {
                        return;
                }

                precomputedInnerBlocksPositions.current =
                        updateInnerBlocksPositions();
        }, [isRepeaterInherited, updateInnerBlocksPositions]);

        const classes = 'maxi-repeater';

	return (
		<div className={classes}>
			{!isRepeaterInherited && (
				<ToggleSwitch
					className={`${classes}__toggle`}
					label={__('Enable repeater', 'maxi-blocks')}
					selected={repeaterStatus}
					disabled={isValidating}
					onChange={async val => {
                                                setIsValidating(true);
                                                
                                                try {
                                                        if (!val) {
                                                                onChange({
                                                                        [getAttributeKey('repeater-status')]: val,
                                                                });
                                                                return;
                                                        }

                                                        const newInnerBlocksPositions =
                                                                updateInnerBlocksPositions();

                                                        precomputedInnerBlocksPositions.current =
                                                                newInnerBlocksPositions;

                                                        if (
                                                                isEqual(
                                                                        lastValidatedInnerBlocksPositions.current,
                                                                        newInnerBlocksPositions
                                                                )
                                                        ) {
                                                                markNextChangeAsNotPersistent();
                                                                onChange({
                                                                        [getAttributeKey('repeater-status')]: val,
                                                                });
                                                                return;
                                                        }

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

                                                                lastValidatedInnerBlocksPositions.current =
                                                                        precomputedInnerBlocksPositions.current;
                                                        }
                                                } finally {
                                                        setIsValidating(false);
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
