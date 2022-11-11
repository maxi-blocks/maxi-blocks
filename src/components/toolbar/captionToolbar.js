/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components';
import {
	memo,
	forwardRef,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import { useSelect } from '@wordpress/data';

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
	TextOptions,
} from './components';
import { getBoundaryElement } from '../../extensions/dom';

/**
 * Styles
 */
import './editor.scss';
import { getGroupAttributes } from '../../extensions/styles';
import {
	getTypographyValue,
	setFormat,
	textContext,
} from '../../extensions/text/formats';

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
		} = props;
		const { isList = false, textLevel = 'p', uniqueID } = attributes;

		const typography = { ...getGroupAttributes(props, 'typography') };

		const { formatValue, onChangeTextFormat } = useContext(textContext);

		const { editorVersion, breakpoint, styleCard, tooltipsHide } =
			useSelect(select => {
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

				const tooltipsHide = !isEmpty(maxiSettings.hide_tooltips)
					? maxiSettings.hide_tooltips
					: false;

				return {
					editorVersion: version,
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

			const newFormatValue = {
				...obj.formatValue,
			};
			delete obj.formatValue;

			onChangeTextFormat(newFormatValue);

			processAttributes(obj);
		};

		const popoverProps = {
			...((parseFloat(editorVersion) <= 13.0 && {
				shouldAnchorIncludePadding: true,
				__unstableStickyBoundaryElement: getBoundaryElement(anchorRef),
				position: 'bottom center right',
			}) ||
				(!isNaN(parseFloat(editorVersion)) && {
					anchor: anchorRef,
					position: 'bottom center',
					flip: false,
					resize: false,
				})),
		};

		if (isSelected && anchorRef)
			return (
				<Popover
					noArrow
					animate={false}
					focusOnMount={false}
					className={classnames('maxi-toolbar__popover')}
					uniqueid={uniqueID}
					__unstableSlotName='block-toolbar'
					{...popoverProps}
				>
					<div className='toolbar-wrapper caption-toolbar'>
						<TextOptions
							{...getGroupAttributes(attributes, 'typography')}
							onChange={obj => processAttributes(obj)}
							breakpoint={breakpoint}
							isList={isList}
							clientId={clientId}
							isCaptionToolbar
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
							isList={isList}
							clientId={clientId}
							textLevel={textLevel}
							styleCard={styleCard}
							isCaptionToolbar
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
							tooltipsHide={tooltipsHide}
						/>
						<TextItalic
							onChangeFormat={onChangeFormat}
							getValue={getValue}
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
