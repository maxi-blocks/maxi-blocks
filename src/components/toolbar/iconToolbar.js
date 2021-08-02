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
		const { attributes, clientId, setAttributes, name } = props;
		const { uniqueID, parentBlockStyle } = attributes;

		const { editorVersion, breakpoint, styleCard, isSelected } = useSelect(
			select => {
				const { receiveMaxiSettings, receiveMaxiDeviceType } =
					select('maxiBlocks');
				const { receiveMaxiSelectedStyleCard } = select(
					'maxiBlocks/style-cards'
				);

				const maxiSettings = receiveMaxiSettings();
				const version = !isEmpty(maxiSettings.editor)
					? maxiSettings.editor.version
					: null;

				const breakpoint = receiveMaxiDeviceType();

				const styleCard = receiveMaxiSelectedStyleCard()?.value || {};
				const isSelected = ref.current?.isSameNode(
					ref.current.activeElement
				);

				return {
					editorVersion: version,
					breakpoint,
					styleCard,
					isSelected,
				};
			}
		);

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

			setAttributes(obj);
		};

		return (
			<>
				{
					/* isSelected && */ anchorRef && (
						<Popover
							noArrow
							animate={false}
							position='bottom center right'
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
							</div>
						</Popover>
					)
				}
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
