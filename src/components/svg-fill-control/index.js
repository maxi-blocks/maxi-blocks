/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import MediaUploaderControl from '../media-uploader-control';
import SettingTabsControl from '../setting-tabs-control';
import { injectImgSVG } from '../../extensions/svg/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Component
 */
const SVGFillControl = props => {
	const {
		onChange,
		className,
		clientId,
		isHover,
		SVGOptions,
		breakpoint = '',
	} = props;

	const classes = classnames('maxi-svg-fill-control', className);

	const SVGData = cloneDeep(
		getLastBreakpointAttribute(
			'background-svg-SVGData',
			breakpoint,
			SVGOptions,
			isHover
		)
	);

	console.log(
		injectImgSVG(
			getLastBreakpointAttribute(
				'background-svg-SVGElement',
				breakpoint,
				SVGOptions
			),
			SVGData
		)
	);

	const getFillItem = ([id, value]) => {
		return (
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Colour', 'maxi-blocks'),
						content: (
							<ColorControl
								label={__('Fill', 'maxi-blocks')}
								color={getLastBreakpointAttribute(
									'color',
									breakpoint,
									value,
									isHover
								)}
								onChange={({
									color,
									paletteColor,
									paletteStatus,
								}) => {
									SVGData[id][
										getAttributeKey(
											'color',
											isHover,
											false,
											breakpoint
										)
									] = color;

									onChange({
										[getAttributeKey(
											'SVGElement',
											isHover,
											false,
											breakpoint
										)]: injectImgSVG(
											getLastBreakpointAttribute(
												'background-svg-SVGElement',
												breakpoint,
												SVGOptions
											),
											SVGData
										).outerHTML,
										[getAttributeKey(
											'SVGData',
											isHover,
											false,
											breakpoint
										)]: SVGData,
										[getAttributeKey(
											'background-palette-svg-color',
											isHover,
											false,
											breakpoint
										)]: paletteColor,
										[getAttributeKey(
											'background-palette-svg-color-status',
											isHover,
											false,
											breakpoint
										)]: paletteStatus,
									});
								}}
								paletteColor={getLastBreakpointAttribute(
									'background-palette-svg-color',
									breakpoint,
									SVGOptions,
									isHover
								)}
								paletteStatus={getLastBreakpointAttribute(
									'background-palette-svg-color-status',
									breakpoint,
									SVGOptions,
									isHover
								)}
								isHover={isHover}
								clientId={clientId}
							/>
						),
					},
					{
						label: __('Image', 'maxi-blocks'),
						content: (
							<MediaUploaderControl
								allowedTypes={['image']}
								mediaID={value.imageID}
								onSelectImage={imageData => {
									SVGData[id].imageID = imageData.id;
									SVGData[id].imageURL = imageData.url;
									const resEl = injectImgSVG(
										SVGOptions['background-svg-SVGElement'],
										SVGData
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData,
										'background-palette-svg-color':
											props.SVGOptions[
												'background-palette-svg-color'
											],
										'background-palette-svg-color-status':
											props.SVGOptions[
												'background-palette-svg-color-status'
											],
									});
								}}
								onRemoveImage={() => {
									SVGData[id].imageID = '';
									SVGData[id].imageURL = '';

									const resEl = injectImgSVG(
										SVGOptions['background-svg-SVGElement'],
										SVGData,
										true
									);

									onChange({
										SVGElement: resEl.outerHTML,
										SVGData,
										'background-palette-svg-color':
											props.SVGOptions[
												'background-palette-svg-color'
											],
										'background-palette-svg-color-status':
											props.SVGOptions[
												'background-palette-svg-color-status'
											],
									});
								}}
							/>
						),
					},
				]}
			/>
		);
	};

	const getFillItems = () => {
		const response = Object.entries(SVGData).map(([id, value], i) => {
			return {
				label: i,
				content: getFillItem([id, value], i),
			};
		});

		return response;
	};

	return (
		<div className={classes}>
			{Object.keys(SVGData).length > 1 && (
				<SettingTabsControl items={getFillItems()} />
			)}
			{Object.keys(SVGData).length === 1 &&
				getFillItem(Object.entries(SVGData)[0])}
		</div>
	);
};

export default SVGFillControl;
