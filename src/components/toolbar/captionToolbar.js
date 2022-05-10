/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import {
	useEffect,
	useState,
	memo,
	forwardRef,
	useContext,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getScrollContainer } from '@wordpress/dom';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, cloneDeep, isEqual } from 'lodash';

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
import { getTypographyValue, setFormat } from '../../extensions/text/formats';

/**
 * Component
 */
const CaptionToolbar = memo(
	forwardRef((props, ref) => {
		const {
			attributes,
			clientId,
			maxiSetAttributes,
			insertInlineStyles,
			cleanInlineStyles,
			isSelected,
			context,
		} = props;
		const {
			isList = false,
			linkSettings,
			textLevel = 'p',
			uniqueID,
			blockStyle,
		} = attributes;

		const typography = { ...getGroupAttributes(props, 'typography') };

		const { formatValue, onChangeTextFormat } = useContext(context);

		const { breakpoint, styleCard } = useSelect(select => {
			const { receiveMaxiDeviceType } = select('maxiBlocks');
			const { receiveMaxiSelectedStyleCard } = select(
				'maxiBlocks/style-cards'
			);

			const breakpoint = receiveMaxiDeviceType();

			const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

			return {
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

		const processAttributes = obj => {
			if ('content' in obj) {
				const newCaptionContent = obj.content;

				delete obj.content;
				obj.captionContent = newCaptionContent;
			}

			maxiSetAttributes(obj);
		};

		const getValue = prop =>
			getTypographyValue({
				prop,
				breakpoint,
				typography,
				formatValue,
				textLevel,
				styleCard,
			});

		const onChangeFormat = value => {
			const obj = setFormat({
				formatValue,
				isList,
				typography,
				value,
				breakpoint,
				textLevel,
				returnFormatValue: true,
			});

			const newFormatValue = { ...obj.formatValue };
			delete obj.formatValue;

			onChangeTextFormat(newFormatValue);

			processAttributes(obj);
		};

		if (isSelected && anchorRef)
			return (
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
					__unstableStickyBoundaryElement={boundaryElement}
				>
					<div className='toolbar-wrapper caption-toolbar'>
						<TextOptions
							{...getGroupAttributes(attributes, 'typography')}
							onChange={obj => processAttributes(obj)}
							breakpoint={breakpoint}
							isList={isList}
							clientId={clientId}
							isCaptionToolbar
							context={context}
						/>
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
							node={anchorRef}
							isList={isList}
							clientId={clientId}
							textLevel={textLevel}
							styleCard={styleCard}
							isCaptionToolbar
							context={context}
						/>
						<Alignment
							{...getGroupAttributes(attributes, 'textAlignment')}
							onChange={obj => processAttributes(obj)}
							breakpoint={breakpoint}
							isCaptionToolbar
						/>
						<TextBold
							onChangeFormat={onChangeFormat}
							getValue={getValue}
							isCaptionToolbar
						/>
						<TextItalic
							onChangeFormat={onChangeFormat}
							getValue={getValue}
							isCaptionToolbar
						/>
						<TextLink
							{...getGroupAttributes(attributes, 'typography')}
							onChange={obj => processAttributes(obj)}
							isList={isList}
							linkSettings={linkSettings}
							breakpoint={breakpoint}
							textLevel={textLevel}
							blockStyle={blockStyle}
							styleCard={styleCard}
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
