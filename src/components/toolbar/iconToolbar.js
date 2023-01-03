/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { useEffect, useState, memo, forwardRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, isEqual, isNaN } from 'lodash';

/**
 * Internal dependencies
 */
import IconPosition from './components/icon-position';
import IconSize from './components/icon-size';
import IconColor from './components/icon-color';
import IconBackground from './components/icon-background';
import Border from './components/border';
import PaddingMargin from './components/padding-margin';
import { getGroupAttributes } from '../../extensions/styles';
import { getBoundaryElement } from '../../extensions/dom';

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

		const { breakpoint, version } = useSelect(select => {
			const { receiveMaxiDeviceType, receiveMaxiSettings } =
				select('maxiBlocks');

			const breakpoint = receiveMaxiDeviceType();

			const maxiSettings = receiveMaxiSettings();
			const { version } = maxiSettings;

			return {
				breakpoint,
				version,
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

		const popoverPropsByVersion = {
			...((parseFloat(version) <= 13.0 && {
				shouldAnchorIncludePadding: true,
				__unstableStickyBoundaryElement: getBoundaryElement(
					ref.current
				),
				anchorRef,
			}) ||
				(!isNaN(parseFloat(version)) && {
					anchor: anchorRef,
					flip: false,
					resize: false,
					variant: 'unstyled',
				})),
		};

		return (
			isSelected &&
			anchorRef && (
				<Popover
					noArrow
					animate={false}
					position='bottom center'
					focusOnMount={false}
					className='maxi-toolbar__popover'
					uniqueid={uniqueID}
					__unstableSlotName='block-toolbar'
					{...popoverPropsByVersion}
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
