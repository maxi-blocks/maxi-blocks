/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { select, useSelect } from '@wordpress/data';

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
import { isEmpty, cloneDeep, isEqual, merge } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import SvgColorToolbar from './components/svg-color';
import VideoUrl from './components/video-url';
import Popover from '@components/popover';

/**
 * Utils
 */
import Breadcrumbs from '@components/breadcrumbs';
import BackgroundColor from './components/background-color/background-color';
import BlockBackgroundColor from './components/background-color/block-background-color';
import Border from './components/border';
import BoxShadow from './components/box-shadow';
import ColumnMover from './components/column-mover';
import ColumnSize from './components/column-size';
import Divider from './components/divider-line';
import DividerAlignment from './components/divider-alignment';
import DividerColor from './components/divider-color';
import Duplicate from './components/duplicate';
import DynamicContent from './components/dynamic-content';
import Link from './components/link';
import Mover from './components/mover';
import NumberCounterReplay from './components/number-counter-replay';
import Size from './components/size';
import SliderSettings from './components/slider-settings';
import SliderSlidesSettings from './components/slider-slides-settings';
import SvgWidth from './components/svg-width';
import TextColor from './components/text-color';
import TextLevel from './components/text-level';
import TextLink from './components/text-link';
import TextListOptions from './components/text-list-options';
import ToolbarColumnPattern from './components/column-pattern';
import TextOptions from './components/text-options';
import MoreSettings from './components/more-settings';
import Help from './components/help';
import VerticalAlign from './components/vertical-align';
import TextMargin from './components/text-margin';
import ToolbarMediaUpload from './components/media-upload';
import ContextLoop from './components/context-loop';

import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { isInSiteEditorPreviewIframe } from '@extensions/fse';

/**
 * Styles & icons
 */
import './editor.scss';
import { toolbarPin, toolbarPinLocked } from '@maxi-icons';

/**
 * Component
 */
const MaxiToolbar = memo(
	forwardRef((props, ref) => {
		if (isEmpty(props) || !ref) return null;
		const isPreviewIframe = isInSiteEditorPreviewIframe();

		if (isPreviewIframe) return null;
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
			content,
			disableCustomFormats = false,
			isSelected,
			name,
			maxiSetAttributes,
			onModalOpen,
			// toggleHandlers, TODO: fix #4863
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
			disableInset,
			repeaterStatus,
			repeaterRowClientId,
			getInnerBlocksPositions,
			setShowLoader,
		} = props;
		const {
			blockStyle,
			customLabel,
			isFirstOnHierarchy,
			isList,
			linkSettings,
			textLevel,
			typeOfList,
			uniqueID,
			svgType,
			'dc-status': dcStatus,
			content: listContent,
			listStyle,
		} = attributes;

		const { getBlockParents } = useSelect(select =>
			select('core/block-editor')
		);

		// Use injected settings instead of API call
		const tooltipsHide =
			typeof window !== 'undefined'
				? window.maxiSettings?.hide_tooltips ?? false
				: false;

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
		const popoverRef = useRef(null);

		const [anchorRef, setAnchorRef] = useState(ref.current);
		const [pinActive, setPinActive] = useState(false);

		useEffect(() => {
			setAnchorRef(ref.current);
		}, [!!ref.current]);

		const breadcrumbStatus = () => {
			const originalNestedBlocks = clientId
				? [...getBlockParents(clientId)]
				: [];

			if (!originalNestedBlocks.includes(clientId))
				originalNestedBlocks.push(clientId);

			return originalNestedBlocks.length > 1;
		};

		const inlineStylesTargetsResults = merge(
			inlineStylesTargetsDefault,
			inlineStylesTargets
		);

		const lineOrientation = getLastBreakpointAttribute({
			target: 'line-orientation',
			breakpoint,
			attributes,
		});

		return (
			isSelected &&
			anchorRef && (
				<Popover
					ref={popoverRef}
					anchor={anchorRef}
					noArrow
					animate={false}
					focusOnMount={false}
					className={classnames(
						'maxi-toolbar__popover',
						!!breadcrumbStatus() &&
							'maxi-toolbar__popover--has-breadcrumb'
					)}
					__unstableSlotName='block-toolbar'
					__unstableObserveElement={ref.current}
					observeBlockPosition={clientId}
					useAnimationFrame
					useShift
					shiftPadding={{ top: 22 }}
					shiftLimit={{ mainAxis: false }}
					position='top center'
				>
					<div className={`toolbar-wrapper pinned--${pinActive}`}>
						<div
							className={classnames(
								'toolbar-block-custom-label',
								!!breadcrumbStatus() &&
									repeaterStatus &&
									'toolbar-block-custom-label--repeater'
							)}
						>
							{!isFirstOnHierarchy && (
								<span
									className='breadcrumbs-pin'
									onClick={() => {
										setPinActive(!pinActive);
									}}
								>
									<span className='breadcrumbs-pin-tooltip'>
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
								{blockStyle ? ` | ${blockStyle}` : ''}
							</span>
							{!isFirstOnHierarchy && (
								<span
									className={classnames(
										'toolbar-more-indicator',
										repeaterStatus &&
											'toolbar-more-indicator--repeater'
									)}
								>
									&gt;
								</span>
							)}
						</div>
						<Breadcrumbs
							key={`breadcrumbs-${uniqueID}`}
							repeaterStatus={repeaterStatus}
						/>
						<ToolbarMediaUpload
							blockName={name}
							maxiSetAttributes={maxiSetAttributes}
							{...getGroupAttributes(attributes, 'typography')}
							onChange={obj => maxiSetAttributes(obj)}
							onModalOpen={onModalOpen}
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
							disableCustomFormats={disableCustomFormats}
						/>
						<TextOptions
							{...getGroupAttributes(attributes, [
								'typography',
								'textAlignment',
							])}
							blockName={name}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={breakpoint}
							blockStyle={blockStyle}
							isList={isList}
							textLevel={textLevel}
							styleCard={styleCard}
							clientId={clientId}
							disableCustomFormats={disableCustomFormats}
							setShowLoader={setShowLoader}
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
						{!dcStatus && (
							<TextListOptions
								clientId={clientId}
								blockName={name}
								isList={isList}
								typeOfList={typeOfList}
								listStyle={listStyle}
								content={listContent}
								onChange={obj => {
									maxiSetAttributes(obj);
								}}
							/>
						)}
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
							disableInset={disableInset}
						/>
						<ToolbarColumnPattern
							clientId={clientId}
							blockName={name}
							{...getGroupAttributes(attributes, 'rowPattern')}
							onChange={obj => maxiSetAttributes(obj)}
							repeaterStatus={repeaterStatus}
							repeaterRowClientId={repeaterRowClientId}
							getInnerBlocksPositions={getInnerBlocksPositions}
							breakpoint={breakpoint}
						/>
						<NumberCounterReplay
							resetNumberHelper={resetNumberHelper}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/>
						{
							// TODO: fix #4863
							/* <ColumnsHandlers
							toggleHandlers={toggleHandlers}
							blockName={name}
							tooltipsHide={tooltipsHide}
						/> */
						}
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
							breakpoint={breakpoint}
							{...getGroupAttributes(
								attributes,
								'margin',
								false,
								prefix
							)}
							onChange={obj => maxiSetAttributes(obj)}
							textLevel={textLevel}
						/>
						<DynamicContent
							blockName={name}
							onChange={maxiSetAttributes}
							{...getGroupAttributes(
								attributes,
								'dynamicContent'
							)}
							uniqueID={attributes.uniqueID}
							SVGData={attributes.SVGData}
							SVGElement={attributes.SVGElement}
							mediaID={attributes.mediaID}
							mediaURL={attributes.mediaURL}
							isList={isList}
						/>
						<ContextLoop
							clientId={clientId}
							blockName={name}
							onChange={obj => maxiSetAttributes(obj)}
							{...getGroupAttributes(
								attributes,
								'dynamicContent'
							)}
							blockStyle={attributes?.blockStyle}
							breakpoint={breakpoint}
							name={name}
						/>
						{name === 'maxi-blocks/slider-maxi' && (
							<>
								<SliderSlidesSettings />
								<SliderSettings
									{...getGroupAttributes(
										attributes,
										'slider'
									)}
									onChange={obj => maxiSetAttributes(obj)}
								/>
							</>
						)}
						<Link
							{...getGroupAttributes(attributes, [
								'dynamicContent',
							])}
							blockName={name}
							linkSettings={linkSettings}
							onChange={(linkSettings, obj) =>
								maxiSetAttributes({ linkSettings, ...obj })
							}
							clientId={clientId}
							textLevel={textLevel}
						/>
						<TextLink
							{...getGroupAttributes(attributes, [
								'typography',
								'dynamicContent',
							])}
							blockName={name}
							onChange={(linkSettings, obj) => {
								const filteredObj = Object.fromEntries(
									Object.entries(obj ?? {}).filter(
										([key, value]) => value !== undefined
									)
								);
								maxiSetAttributes({
									linkSettings,
									...filteredObj,
								});
							}}
							isList={isList}
							linkSettings={linkSettings}
							breakpoint={breakpoint}
							textLevel={textLevel}
							blockStyle={blockStyle}
							styleCard={styleCard}
							disableCustomFormats={disableCustomFormats}
							clientId={clientId}
							content={attributes.content}
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
							attributes={attributes}
							breakpoint={breakpoint}
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
							updateSelection={name !== 'maxi-blocks/slide-maxi'}
						/>
						<Help tooltipsHide={tooltipsHide} />
						<MoreSettings
							clientId={clientId}
							{...getGroupAttributes(attributes, [
								'alignment',
								'textAlignment',
							])}
							content={content}
							blockName={name}
							breakpoint={breakpoint}
							copyPasteMapping={copyPasteMapping}
							prefix={prefix}
							onChange={obj => maxiSetAttributes(obj)}
							tooltipsHide={tooltipsHide}
							disableCustomFormats={disableCustomFormats}
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
		if (!isSelected && wasSelected === isSelected) {
			return true;
		}

		if (select('core/block-editor').isDraggingBlocks()) {
			return true;
		}

		if (
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint ||
			!isEqual(oldSCValues, scValues)
		) {
			return false;
		}

		const result = isEqual(
			Object.fromEntries(
				Object.entries(oldAttr).filter(
					([key]) =>
						!Array.isArray(propsToAvoid) ||
						!propsToAvoid.includes(key)
				)
			),
			Object.fromEntries(
				Object.entries(newAttr).filter(
					([key]) =>
						!Array.isArray(propsToAvoid) ||
						!propsToAvoid.includes(key)
				)
			)
		);

		return result;
	}
);

export default MaxiToolbar;
