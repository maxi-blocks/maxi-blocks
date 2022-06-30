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
import {
	Alignment,
	TextBold,
	TextColor,
	TextItalic,
	TextLink,
	TextOptions,
} from './components';

/**
 * Styles
 */
import './editor.scss';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const CaptionToolbar = memo(
	forwardRef((props, ref) => {
		const { attributes, clientId, maxiSetAttributes, isSelected } = props;
		const {
			captionContent: content,
			isList = false,
			linkSettings,
			textLevel = 'p',
			uniqueID,
			parentBlockStyle,
		} = attributes;

		const { editorVersion, breakpoint, styleCard } = useSelect(select => {
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

			return {
				editorVersion: version,
				breakpoint,
				styleCard,
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
						position='top center right'
						focusOnMount={false}
						anchorRef={anchorRef}
						className={classnames('maxi-toolbar__popover')}
						uniqueid={uniqueID}
						__unstableSlotName='block-toolbar'
						shouldAnchorIncludePadding
						{...stickyProps}
					>
						<div className='toolbar-wrapper caption-toolbar'>
							<TextOptions
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => processAttributes(obj)}
								node={anchorRef}
								content={content}
								breakpoint={breakpoint}
								isList={isList}
								textLevel={textLevel}
								styleCard={styleCard}
								clientId={clientId}
								isCaptionToolbar
								blockStyle={parentBlockStyle}
							/>
							<TextColor
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => processAttributes(obj)}
								breakpoint={breakpoint}
								node={anchorRef}
								isList={isList}
								clientId={clientId}
								textLevel={textLevel}
								styleCard={styleCard}
								isCaptionToolbar
							/>
							<Alignment
								{...getGroupAttributes(
									attributes,
									'textAlignment'
								)}
								onChange={obj => processAttributes(obj)}
								breakpoint={breakpoint}
								isCaptionToolbar
							/>
							<TextBold
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => processAttributes(obj)}
								isList={isList}
								breakpoint={breakpoint}
								textLevel={textLevel}
								styleCard={styleCard}
								isCaptionToolbar
							/>
							<TextItalic
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => processAttributes(obj)}
								isList={isList}
								breakpoint={breakpoint}
								styleCard={styleCard}
								isCaptionToolbar
							/>
							<TextLink
								{...getGroupAttributes(
									attributes,
									'typography'
								)}
								onChange={obj => processAttributes(obj)}
								isList={isList}
								linkSettings={linkSettings}
								breakpoint={breakpoint}
								textLevel={textLevel}
								blockStyle={parentBlockStyle}
								styleCard={styleCard}
								isCaptionToolbar
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

export default CaptionToolbar;
