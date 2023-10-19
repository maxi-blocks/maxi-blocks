/**
 * WordPress dependencies
 */
import { useEffect, useState, memo, forwardRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, isEqual } from 'lodash';
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const IconPosition = loadable(() => import('./components/icon-position'));
const IconSize = loadable(() => import('./components/icon-size'));
const IconColor = loadable(() => import('./components/icon-color'));
const IconBackground = loadable(() => import('./components/icon-background'));
const Border = loadable(() => import('./components/border'));
const PaddingMargin = loadable(() => import('./components/padding-margin'));
const Popover = loadable(() => import('../popover'));

import { getGroupAttributes } from '../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const IconToolbar = memo(
	forwardRef((props, ref) => {
		const {
			attributes,
			clientId,
			maxiSetAttributes,
			insertInlineStyles,
			cleanInlineStyles,
			name,
			isSelected,
		} = props;
		const { uniqueID, svgType, blockStyle } = attributes;

		const { breakpoint } = useSelect(select => {
			const { receiveMaxiDeviceType } = select('maxiBlocks');

			const breakpoint = receiveMaxiDeviceType();

			return {
				breakpoint,
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

		return (
			isSelected &&
			anchorRef && (
				<Popover
					anchor={anchorRef}
					noArrow
					animate={false}
					position='bottom center'
					focusOnMount={false}
					className='maxi-toolbar__popover maxi-toolbar__popover--icon'
					uniqueid={uniqueID}
					__unstableSlotName='block-toolbar'
					observeBlockPosition={clientId}
				>
					<div className='toolbar-wrapper icon-toolbar'>
						<IconPosition
							blockName={name}
							{...getGroupAttributes(attributes, 'icon')}
							onChange={obj => processAttributes(obj)}
						/>
						<IconSize
							blockName={name}
							{...getGroupAttributes(attributes, 'icon')}
							onChange={obj => processAttributes(obj)}
							breakpoint={breakpoint}
						/>
						<IconColor
							blockName={name}
							{...getGroupAttributes(attributes, 'icon')}
							svgType={svgType}
							blockStyle={blockStyle}
							onChangeInline={(obj, target) =>
								insertInlineStyles({ obj, target })
							}
							onChange={(obj, target) => {
								processAttributes(obj);
								cleanInlineStyles(target);
							}}
						/>
						<IconBackground
							blockName={name}
							breakpoint={breakpoint}
							{...getGroupAttributes(attributes, [
								'icon',
								'iconBackgroundColor',
							])}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: '.maxi-button-block__icon',
								})
							}
							onChange={obj => {
								processAttributes(obj);
								cleanInlineStyles('.maxi-button-block__icon');
							}}
						/>
						<Border
							blockName={name}
							{...getGroupAttributes(attributes, [
								'iconBorder',
								'iconBorderWidth',
								'iconBorderRadius',
							])}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							clientId={clientId}
							isIconToolbar
							prefix='icon-'
						/>
						<PaddingMargin
							blockName={name}
							{...getGroupAttributes(attributes, 'iconPadding')}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							disableMargin
							paddingTarget='icon-padding'
							isIconToolbar
						/>
					</div>
				</Popover>
			)
		);
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

export default IconToolbar;
