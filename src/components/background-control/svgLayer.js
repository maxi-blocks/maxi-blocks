/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 *
 */
import SettingTabsControl from '../setting-tabs-control';
import __experimentalSVGControl from '../svg-control';
import __experimentalSVGFillControl from '../svg-fill-control';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Component
 */
const SVGLayer = props => {
	const { SVGOptions, defaultSVGOptions, onChange } = props;

	return (
		<Fragment>
			<SettingTabsControl
				disablePadding
				items={[
					{
						label: __('Shape', 'maxi-blocks'),
						content: (
							<__experimentalSVGControl
								SVGData={SVGOptions.SVGData}
								SVGMediaID={SVGOptions.SVGMediaID}
								SVGMediaURL={SVGOptions.SVGMediaURL}
								onChange={obj => {
									SVGOptions.SVGElement = obj.SVGElement;
									SVGOptions.SVGMediaID = obj.SVGMediaID;
									SVGOptions.SVGMediaURL = obj.SVGMediaURL;
									SVGOptions.SVGData = obj.SVGData;

									onChange(SVGOptions);
								}}
							/>
						),
					},
					!isEmpty(SVGOptions.SVGElement) && {
						label: __('Fill', 'maxi-blocks'),
						content: (
							<__experimentalSVGFillControl
								SVGData={SVGOptions.SVGData}
								SVGElement={SVGOptions.SVGElement}
								onChange={obj => {
									SVGOptions.SVGData = obj.SVGData;
									SVGOptions.SVGElement = obj.SVGElement;

									onChange(SVGOptions);
								}}
							/>
						),
					},
					!isEmpty(SVGOptions.SVGElement) && {
						label: __('Position', 'maxi-blocks'),
						content: (
							<Fragment>
								<SizeControl
									label={__('Y-axis', 'maxi-blocks')}
									value={SVGOptions.position.general.top}
									unit={SVGOptions.position.general.topUnit}
									onChangeValue={val => {
										SVGOptions.position.general.top = val;

										onChange(SVGOptions);
									}}
									onChangeUnit={val => {
										SVGOptions.position.general.topUnit = val;

										onChange(SVGOptions);
									}}
								/>
								<SizeControl
									label={__('X-axis', 'maxi-blocks')}
									value={SVGOptions.position.general.left}
									unit={SVGOptions.position.general.leftUnit}
									onChangeValue={val => {
										SVGOptions.position.general.left = val;

										onChange(SVGOptions);
									}}
									onChangeUnit={val => {
										SVGOptions.position.general.leftUnit = val;

										onChange(SVGOptions);
									}}
								/>
							</Fragment>
						),
					},
					!isEmpty(SVGOptions.SVGElement) && {
						label: __('Size', 'maxi-blocks'),
						content: (
							<SizeControl
								label={__('Size', 'maxi-blocks')}
								value={SVGOptions.size}
								defaultValue={defaultSVGOptions.size}
								onChangeValue={val => {
									SVGOptions.size = val;

									onChange(SVGOptions);
								}}
								min={0}
								max={200}
								disableUnit
							/>
						),
					},
				]}
			/>
		</Fragment>
	);
};

export default SVGLayer;
