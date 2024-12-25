/**
 * WordPress dependencies
 */
import { memo, forwardRef, useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import TextColor from './components/text-color';
import TextOptions from './components/text-options';
import Popover from '@components/popover';

/**
 * Styles
 */
import './editor.scss';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Component
 */
const CaptionToolbar = memo(
	forwardRef((props, ref) => {
		const {
			attributes,
			blockStyle,
			clientId,
			maxiSetAttributes,
			insertInlineStyles,
			cleanInlineStyles,
			isSelected,
			setShowLoader,
		} = props;
		const { isList = false, textLevel = 'p', uniqueID } = attributes;

		const { breakpoint, styleCard } = useSelect(select => {
			const { receiveMaxiSettings, receiveMaxiDeviceType } =
				select('maxiBlocks');
			const { receiveMaxiSelectedStyleCard } = select(
				'maxiBlocks/style-cards'
			);

			const maxiSettings = receiveMaxiSettings();

			const breakpoint = receiveMaxiDeviceType();

			const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

			const tooltipsHide = !isEmpty(maxiSettings.hide_tooltips)
				? maxiSettings.hide_tooltips
				: false;

			return {
				breakpoint,
				styleCard,
				tooltipsHide,
			};
		});

		const [anchorRef, setAnchorRef] = useState(ref.current);

		useEffect(() => {
			setAnchorRef(ref.current);
		});

		const processAttributes = obj => {
			if ('content' in obj) {
				const newCaptionContent = obj.content;

				delete obj.content;
				obj.captionContent = newCaptionContent;
			}

			maxiSetAttributes(obj);
		};

		if (isSelected && anchorRef)
			return (
				<Popover
					anchor={anchorRef}
					noArrow
					animate={false}
					focusOnMount={false}
					className={classnames(
						'maxi-toolbar__popover',
						'maxi-toolbar__popover-caption'
					)}
					uniqueid={uniqueID}
					__unstableSlotName='block-toolbar'
					observeBlockPosition={clientId}
					position='bottom center'
				>
					<div className='toolbar-wrapper caption-toolbar'>
						<TextColor
							{...getGroupAttributes(attributes, 'typography')}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: '.maxi-text-block__content',
								})
							}
							onChange={obj => {
								processAttributes(obj);
								cleanInlineStyles('.maxi-text-block__content');
							}}
							breakpoint={breakpoint}
							isList={isList}
							clientId={clientId}
							textLevel={textLevel}
							styleCard={styleCard}
							isCaptionToolbar
						/>
						<TextOptions
							{...getGroupAttributes(attributes, [
								'typography',
								'textAlignment',
							])}
							onChange={obj => processAttributes(obj)}
							breakpoint={breakpoint}
							blockStyle={blockStyle}
							isList={isList}
							clientId={clientId}
							setShowLoader={setShowLoader}
							isCaptionToolbar
						/>
					</div>
				</Popover>
			);

		return null;
	}),
	// Avoids non-necessary renderings
	(
		{ attributes: oldAttr, propsToAvoid, isSelected: wasSelected },
		{ attributes: newAttr, isSelected }
	) => {
		if (!wasSelected || wasSelected !== isSelected) return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default CaptionToolbar;
