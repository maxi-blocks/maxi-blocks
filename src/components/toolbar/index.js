/**
 * WordPress dependencies
 */
import { select, useSelect } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import {
	memo,
	forwardRef,
	useEffect,
	useState,
	useRef,
} from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, isEqual, merge, isNaN } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBoundaryElement } from '../../extensions/dom';
import SvgColorToolbar from './components/svg-color';
import VideoUrl from './components/video-url';

/**
 * Utils
 */
import Breadcrumbs from '../breadcrumbs';
import {
	BackgroundColor,
	BlockBackgroundColor,
	Border,
	BoxShadow,
	ColumnMover,
	ColumnsHandlers,
	ColumnSize,
	Divider,
	DividerAlignment,
	DividerColor,
	Duplicate,
	Link,
	Mover,
	NumberCounterReplay,
	Size,
	SvgWidth,
	TextColor,
	TextLevel,
	TextLink,
	TextListOptions,
	ToolbarColumnPattern,
	TextOptions,
	MoreSettings,
	Help,
	VerticalAlign,
	TextMargin,
	ToolbarMediaUpload,
} from './components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Styles & icons
 */
import './editor.scss';
import { toolbarPin, toolbarPinLocked } from '../../icons';

/**
 * Component
 */
const MaxiToolbar = memo(
	forwardRef((props, ref) => {
		const inlineStylesTargetsDefault = {
			background: '',
			border: '',
			boxShadow: '',
			dividerColor: '',
		};

		const {
			attributes,
			backgroundAdvancedOptions,
			backgroundPrefix,
			clientId,
			isSelected,
			name,
			maxiSetAttributes,
			toggleHandlers,
			rowPattern,
			prefix = '',
			backgroundGlobalProps,
			resizableObject,
			insertInlineStyles,
			cleanInlineStyles,
			inlineStylesTargets = inlineStylesTargetsDefault,
			resetNumberHelper,
			copyPasteMapping,
			mediaPrefix,
			dropShadow,
		} = props;
		const {
			customLabel,
			isFirstOnHierarchy,
			isList,
			linkSettings,
			textLevel,
			typeOfList,
			uniqueID,
			blockStyle,
			svgType,
		} = attributes;

		const { breakpoint, styleCard, isTyping, tooltipsHide, version } =
			useSelect(select => {
				const { receiveMaxiDeviceType, receiveMaxiSettings } =
					select('maxiBlocks');
				const { receiveMaxiSelectedStyleCard } = select(
					'maxiBlocks/style-cards'
				);
				const { isTyping } = select('core/block-editor');

				const breakpoint = receiveMaxiDeviceType();

				const styleCard = receiveMaxiSelectedStyleCard()?.value || {};

				const maxiSettings = receiveMaxiSettings();
				const { hide_tooltips: hideTooltips, editor } = maxiSettings;

				const tooltipsHide = !isEmpty(hideTooltips)
					? hideTooltips
					: false;

				return {
					breakpoint,
					styleCard,
					isTyping: isTyping(),
					tooltipsHide,
					version: editor?.version,
				};
			});

		const popoverRef = useRef(null);

		const [anchorRef, setAnchorRef] = useState(ref.current);
		const [anchor, setAnchor] = useState(null);
		const [pinActive, setPinActive] = useState(false);

		const getAnchor = popoverRef => {
			const popoverRect = popoverRef
				?.querySelector('.components-popover__content')
				?.getBoundingClientRect();

			if (!popoverRect) return null;

			const rect = anchorRef.getBoundingClientRect();

			const { width, x } = rect;
			const { width: popoverWidth } = popoverRect;

			const expectedContentX = x + width / 2 - popoverWidth / 2;

			const container = document
				.querySelector('.editor-styles-wrapper')
				?.getBoundingClientRect();

			if (container) {
				const { x: containerX, width: containerWidth } = container;

				// Left cut off check
				if (expectedContentX < containerX)
					rect.x += containerX - expectedContentX;

				// Right cut off check
				if (
					expectedContentX + popoverWidth >
					containerX + containerWidth
				)
					rect.x -=
						expectedContentX +
						popoverWidth -
						(containerX + containerWidth);
			}

			return {
				getBoundingClientRect: () => rect,
				ownerDocument: anchorRef.ownerDocument,
			};
		};

		useEffect(() => {
			setAnchorRef(ref.current);

			if (version > 13.0 && popoverRef.current) {
				const newAnchor = getAnchor(popoverRef.current);

				if (
					!anchor ||
					(anchor &&
						!isEqual(
							JSON.stringify(anchor.getBoundingClientRect()),
							JSON.stringify(newAnchor.getBoundingClientRect())
						))
				)
					setAnchor(newAnchor);
			}
		});

		const breadcrumbStatus = () => {
			const { getBlockParents } = select('core/block-editor');
			const originalNestedBlocks = clientId
				? getBlockParents(clientId)
				: [];
			if (!originalNestedBlocks.includes(clientId))
				originalNestedBlocks.push(clientId);
			return originalNestedBlocks.length > 1;
		};

		const inlineStylesTargetsResults = merge(
			inlineStylesTargetsDefault,
			inlineStylesTargets
		);

		const lineOrientation = getLastBreakpointAttribute(
			'line-orientation',
			breakpoint,
			attributes
		);

		const popoverPropsByVersion = {
			...((parseFloat(version) <= 13.0 && {
				getAnchorRect: spanEl => {
					// span element needs to be hidden to don't break the grid
					spanEl.style.display = 'none';

					return getAnchor(
						popoverRef.current
					).getBoundingClientRect();
				},
				position: 'top center right',
				shouldAnchorIncludePadding: true,
				__unstableStickyBoundaryElement: getBoundaryElement(anchorRef),
			}) ||
				(!isNaN(parseFloat(version)) && {
					anchor,
					position: 'top center',
					flip: false,
					resize: false,
				})),
		};

		return (
			isSelected &&
			anchorRef && (
				<Popover
					ref={popoverRef}
					noArrow
					animate={false}
					focusOnMount={false}
					className={classnames(
						'maxi-toolbar__popover',
						!!breadcrumbStatus() &&
							'maxi-toolbar__popover--has-breadcrumb'
					)}
					__unstableSlotName='block-toolbar'
					{...popoverPropsByVersion}
				>
					<div className={`toolbar-wrapper pinned--${pinActive}`}>
						{!isTyping && (
							<div className='toolbar-block-custom-label'>
								{!isFirstOnHierarchy && (
									<span
										className='breadcrumbs-pin'
										onClick={() => {
											setPinActive(!pinActive);
										}}
									>
										<span className='breadcrumbs-pin-toltip'>
											{pinActive ? 'Unlock' : 'Lock'}
										</span>
										<span className='breadcrumbs-pin-icon'>
											{pinActive
												? toolbarPinLocked
												: toolbarPin}
										</span>
									</span>
								)}
								{customLabel.length > 30
									? `${customLabel.substring(0, 30)}...`
									: customLabel}

								<span className='toolbar-block-custom-label__block-style'>
									{` | ${blockStyle}`}
								</span>
								{!isFirstOnHierarchy && (
									<span className='toolbar-more-indicator'>
										&gt;
									</span>
								)}
							</div>
						)}
						<Breadcrumbs key={`breadcrumbs-${uniqueID}`} />
						<ToolbarMediaUpload
							blockName={name}
							maxiSetAttributes={maxiSetAttributes}
							{...getGroupAttributes(attributes, 'typography')}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							clientId={clientId}
							attributes={attributes}
							prefix={mediaPrefix}
						/>
						<TextColor
							blockName={name}
							{...getGroupAttributes(attributes, 'typography')}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: `.maxi-text-block__content ${
										isList ? 'li' : ''
									}`,
									isMultiplySelector: isList,
								})
							}
							onChange={obj => {
								maxiSetAttributes(obj);
								cleanInlineStyles(
									`.maxi-text-block__content ${
										isList ? 'li' : ''
									}`
								);
							}}
							breakpoint={breakpoint}
							isList={isList}
							textLevel={textLevel}
							styleCard={styleCard}
						/>
						<TextOptions
							{...getGroupAttributes(attributes, [
								'typography',
								'textAlignment',
							])}
							blockName={name}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							isList={isList}
							textLevel={textLevel}
							styleCard={styleCard}
							clientId={clientId}
						/>
						<Mover
							clientId={clientId}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						<TextLevel
							{...getGroupAttributes(attributes, [
								'typography',
								'typographyHover',
							])}
							blockName={name}
							textLevel={textLevel}
							isList={isList}
							onChange={obj => maxiSetAttributes(obj)}
						/>
						<TextListOptions
							blockName={name}
							isList={isList}
							typeOfList={typeOfList}
							onChange={obj => maxiSetAttributes(obj)}
						/>
						{name === 'maxi-blocks/svg-icon-maxi' && (
							<>
								{svgType !== 'Line' && (
									<SvgColorToolbar
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										{...getGroupAttributes(
											attributes,
											'svgHover'
										)}
										maxiSetAttributes={maxiSetAttributes}
										blockName={name}
										onChangeInline={(obj, target) =>
											insertInlineStyles({
												obj,
												target,
												isMultiplySelector: true,
											})
										}
										onChangeFill={obj => {
											maxiSetAttributes(obj);
											cleanInlineStyles('[data-fill]');
										}}
										svgType='Fill'
										type='fill'
										blockStyle={blockStyle}
										content={attributes.content}
									/>
								)}
								{svgType !== 'Shape' && (
									<SvgColorToolbar
										{...getGroupAttributes(
											attributes,
											'svg'
										)}
										{...getGroupAttributes(
											attributes,
											'svgHover'
										)}
										maxiSetAttributes={maxiSetAttributes}
										blockName={name}
										onChangeInline={(obj, target) =>
											insertInlineStyles({
												obj,
												target,
												isMultiplySelector: true,
											})
										}
										onChangeStroke={obj => {
											maxiSetAttributes(obj);
											cleanInlineStyles('[data-stroke]');
										}}
										svgType='Line'
										type='line'
										blockStyle={blockStyle}
										content={attributes.content}
									/>
								)}
								<SvgWidth
									{...getGroupAttributes(attributes, 'svg')}
									content={attributes.content}
									blockName={name}
									onChange={obj => {
										maxiSetAttributes(obj);
									}}
									breakpoint={breakpoint}
									type={svgType}
									resizableObject={resizableObject}
								/>
							</>
						)}
						{name === 'maxi-blocks/video-maxi' && (
							<VideoUrl
								{...getGroupAttributes(attributes, 'video')}
								onChange={obj => maxiSetAttributes(obj)}
							/>
						)}
						<ColumnMover
							clientId={clientId}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						<BackgroundColor
							{...getGroupAttributes(
								attributes,
								[
									'background',
									'backgroundColor',
									'backgroundGradient',
								],
								false,
								backgroundPrefix || prefix
							)}
							{...(name === 'maxi-blocks/video-maxi' && {
								...getGroupAttributes(attributes, 'video'),
							})}
							prefix={backgroundPrefix || prefix}
							advancedOptions={backgroundAdvancedOptions}
							globalProps={backgroundGlobalProps}
							blockName={name}
							breakpoint={breakpoint}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: inlineStylesTargetsDefault.background,
								})
							}
							onChange={obj => {
								maxiSetAttributes(obj);
								cleanInlineStyles(
									inlineStylesTargetsDefault.background
								);
							}}
							clientId={clientId}
						/>
						<BlockBackgroundColor
							{...getGroupAttributes(
								attributes,
								'blockBackground'
							)}
							blockName={name}
							breakpoint={breakpoint}
							onChangeInline={(obj, target) =>
								insertInlineStyles({ obj, target })
							}
							onChange={(obj, target) => {
								maxiSetAttributes(obj);
								cleanInlineStyles(target);
							}}
							clientId={clientId}
						/>
						<Border
							blockName={name}
							{...getGroupAttributes(
								attributes,
								['border', 'borderWidth', 'borderRadius'],
								false,
								prefix
							)}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: inlineStylesTargetsResults.border,
								})
							}
							onChange={obj => {
								maxiSetAttributes(obj);
								cleanInlineStyles(
									inlineStylesTargetsResults.border
								);
							}}
							breakpoint={breakpoint}
							clientId={clientId}
							prefix={prefix}
						/>
						<BoxShadow
							blockName={name}
							{...getGroupAttributes(
								attributes,
								['boxShadow'],
								false,
								prefix
							)}
							onChangeInline={obj => {
								insertInlineStyles({
									obj,
									target: inlineStylesTargetsResults.boxShadow,
								});
							}}
							onChange={obj => {
								maxiSetAttributes(obj);
								cleanInlineStyles(
									inlineStylesTargetsResults.boxShadow
								);
							}}
							clientId={clientId}
							breakpoint={breakpoint}
							prefix={prefix}
							dropShadow={dropShadow}
						/>
						<ToolbarColumnPattern
							clientId={clientId}
							blockName={name}
							{...getGroupAttributes(attributes, 'rowPattern')}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
						/>
						<NumberCounterReplay
							resetNumberHelper={resetNumberHelper}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						<ColumnsHandlers
							toggleHandlers={toggleHandlers}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						<Size
							blockName={name}
							{...getGroupAttributes(
								attributes,
								'size',
								false,
								prefix
							)}
							isFirstOnHierarchy={isFirstOnHierarchy}
							breakpoint={breakpoint}
							onChange={obj => maxiSetAttributes(obj)}
						/>
						<ColumnSize
							{...getGroupAttributes(attributes, 'columnSize')}
							clientId={clientId}
							blockName={name}
							verticalAlign={attributes.verticalAlign}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							rowPattern={rowPattern}
						/>
						<TextMargin
							blockName={name}
							{...getGroupAttributes(
								attributes,
								'margin',
								false,
								prefix
							)}
							onChange={obj => maxiSetAttributes(obj)}
							textLevel={textLevel}
						/>
						<Link
							blockName={name}
							linkSettings={linkSettings}
							onChange={linkSettings =>
								maxiSetAttributes({ linkSettings })
							}
							clientId={clientId}
							textLevel={textLevel}
						/>
						<TextLink
							{...getGroupAttributes(attributes, 'typography')}
							blockName={name}
							onChange={obj => maxiSetAttributes(obj)}
							isList={isList}
							linkSettings={linkSettings}
							breakpoint={breakpoint}
							textLevel={textLevel}
							blockStyle={blockStyle}
							styleCard={styleCard}
							clientId={clientId}
						/>
						<VerticalAlign
							clientId={clientId}
							blockName={name}
							verticalAlign={getLastBreakpointAttribute({
								target: 'justify-content',
								breakpoint,
								attributes,
							})}
							breakpoint={breakpoint}
							uniqueID={uniqueID}
							onChange={obj => maxiSetAttributes(obj)}
						/>
						<DividerColor
							{...getGroupAttributes(attributes, 'divider')}
							blockName={name}
							breakpoint={breakpoint}
							onChangeInline={obj =>
								insertInlineStyles({
									obj,
									target: inlineStylesTargetsResults.dividerColor,
								})
							}
							onChange={obj => {
								maxiSetAttributes(obj);
								cleanInlineStyles(
									inlineStylesTargetsResults.dividerColor
								);
							}}
							clientId={clientId}
						/>
						<Divider
							{...getGroupAttributes(attributes, 'divider')}
							blockName={name}
							breakpoint={breakpoint}
							lineOrientation={lineOrientation}
							onChange={obj => maxiSetAttributes(obj)}
						/>
						<DividerAlignment
							{...getGroupAttributes(attributes, 'divider')}
							lineOrientation={lineOrientation}
							lineVertical={getLastBreakpointAttribute(
								'line-vertical',
								breakpoint,
								attributes
							)}
							lineHorizontal={getLastBreakpointAttribute(
								'line-horizontal',
								breakpoint,
								attributes
							)}
							blockName={name}
							onChangeOrientation={lineOrientation =>
								maxiSetAttributes({
									[`line-orientation-${breakpoint}`]:
										lineOrientation,
								})
							}
							onChangeHorizontal={lineHorizontal =>
								maxiSetAttributes({
									[`line-horizontal-${breakpoint}`]:
										lineHorizontal,
								})
							}
							onChangeVertical={lineVertical =>
								maxiSetAttributes({
									[`line-vertical-${breakpoint}`]:
										lineVertical,
								})
							}
						/>
						<Duplicate
							clientId={clientId}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						<Help tooltipsHide={tooltipsHide} />
						<MoreSettings
							clientId={clientId}
							{...getGroupAttributes(attributes, [
								'alignment',
								'textAlignment',
							])}
							blockName={name}
							breakpoint={breakpoint}
							copyPasteMapping={copyPasteMapping}
							prefix={prefix}
							onChange={obj => maxiSetAttributes(obj)}
							tooltipsHide={tooltipsHide}
						/>
					</div>
				</Popover>
			)
		);
	}),
	(oldProps, newProps) => {
		const {
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
			scValues: oldSCValues,
		} = oldProps;

		const {
			attributes: newAttr,
			isSelected,
			deviceType: breakpoint,
			scValues,
		} = newProps;

		// If is not selected, don't render
		if (!isSelected && wasSelected === isSelected) return true;

		if (select('core/block-editor').isDraggingBlocks()) return true;

		if (
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint ||
			!isEqual(oldSCValues, scValues)
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default MaxiToolbar;
