/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import { useEffect, useState, memo, forwardRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual, isNaN } from 'lodash';

/**
 * Utils
 */
import IconPosition from './components/icon-position';
import IconSize from './components/icon-size';
import IconColor from './components/icon-color';
import IconBackground from './components/icon-background';
import Border from './components/border';
import PaddingMargin from './components/padding-margin';

/**
 * Styles
 */
import './editor.scss';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const IconToolbar = memo(
	forwardRef((props, ref) => {
		const { attributes, clientId, maxiSetAttributes, name, isSelected } =
			props;
		const { uniqueID } = attributes;

		const { editorVersion, breakpoint } = useSelect(select => {
			const { receiveMaxiSettings, receiveMaxiDeviceType } =
				select('maxiBlocks');

			const maxiSettings = receiveMaxiSettings();
			const version = !isEmpty(maxiSettings.editor)
				? maxiSettings.editor.version
				: null;

			const breakpoint = receiveMaxiDeviceType();

			return {
				editorVersion: version,
				breakpoint,
			};
		});

		const [anchorRef, setAnchorRef] = useState(ref.current);

		useEffect(() => {
			setAnchorRef(ref.current);
		});

		const boundaryElement =
			document.defaultView.frameElement ||
			getScrollContainer(anchorRef) ||
			document.body;

		// Different from > WP 5.5.3
		const stickyProps = {
			...((parseFloat(editorVersion) <= 9.2 && {
				__unstableSticky: true,
			}) ||
				(anchorRef &&
					!isNaN(parseFloat(editorVersion)) && {
						__unstableStickyBoundaryElement: boundaryElement,
					})),
		};

		const processAttributes = obj => {
			if ('content' in obj) {
				const newCaptionContent = obj.content;

				delete obj.content;
				obj.captionContent = newCaptionContent;
			}

			maxiSetAttributes(obj);
		};

		return (
			<>
				{isSelected && anchorRef && (
					<Popover
						noArrow
						animate={false}
						position='bottom center'
						focusOnMount={false}
						anchorRef={anchorRef}
						className={classnames('maxi-toolbar__popover')}
						uniqueid={uniqueID}
						__unstableSlotName='block-toolbar'
						shouldAnchorIncludePadding
						{...stickyProps}
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
								onChange={obj => processAttributes(obj)}
							/>
							<IconBackground
								blockName={name}
								{...getGroupAttributes(attributes, [
									'icon',
									'iconBackgroundColor',
								])}
								onChange={obj => processAttributes(obj)}
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
								{...getGroupAttributes(
									attributes,
									'iconPadding'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={breakpoint}
								disableMargin
								paddingTarget='icon-padding'
								isIconToolbar
							/>
						</div>
					</Popover>
				)}
			</>
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
