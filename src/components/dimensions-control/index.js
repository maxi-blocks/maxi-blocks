/**
 * External dependencies
 */
import classnames from 'classnames';
import map from 'lodash/map';
import { isNumber } from 'lodash';

/**
 * Internal dependencies
 */
import icons from './icons';
import './styles/editor.scss';

/**
 * WordPress dependencies
 */
const {
	__,
	sprintf
} = wp.i18n;
const {
	Component,
	Fragment
} = wp.element;
const {
	ButtonGroup,
	Button,
	Tooltip,
	TabPanel
} = wp.components;

export class DimensionsControl extends Component {

	values = JSON.parse(this.props.attributes.dimConEx);

	state = {
		label: this.values.label,
		unit: this.values.unit,
		desktop: {
			valueTop: this.values.desktop.valueTop,
			valueRight: this.values.desktop.valueRight,
			valueBottom: this.values.desktop.valueBottom,
			valueLeft: this.values.desktop.valueLeft,
			syncUnits: this.values.desktop.sync,
		},
		tablet: {
			valueTopTablet: this.values.tablet.valueTop,
			valueRightTablet: this.values.tablet.valueRight,
			valueBottomTablet: this.values.tablet.valueBottom,
			valueLeftTablet: this.values.tablet.valueLeft,
			syncUnitsTablet: this.values.tablet.sync,
		},
		mobile: {
			valueTopMobile: this.values.mobile.valueTop,
			valueRightMobile: this.values.mobile.valueRight,
			valueBottomMobile: this.values.mobile.valueBottom,
			valueLeftMobile: this.values.mobile.valueLeft,
			syncUnitsMobile: this.values.mobile.sync,
		},
		device: 'desktop'
	}

	saveMeta() {
		const meta = wp.data.select('core/editor').getEditedPostAttribute('meta');
		const block = wp.data.select('core/block-editor').getBlock(this.props.clientId);
		let dimensions = {};

		if (typeof this.props.attributes.gx !== 'undefined' && typeof this.props.attributes.gx.id !== 'undefined') {
			const id = this.props.name.split('/').join('-') + '-' + this.props.attributes.gx.id;
			const paddingUnit = block.attributes.paddingUnit;
			const marginUnit = block.attributes.marginUnit;
			const borderRadiusUnit = block.attributes.borderRadiusUnit;
			const padding = {
				paddingTop: (typeof block.attributes.paddingTop !== 'undefined') ? block.attributes.paddingTop + paddingUnit : null,
				paddingRight: (typeof block.attributes.paddingRight !== 'undefined') ? block.attributes.paddingRight + paddingUnit : null,
				paddingBottom: (typeof block.attributes.paddingBottom !== 'undefined') ? block.attributes.paddingBottom + paddingUnit : null,
				paddingLeft: (typeof block.attributes.paddingLeft !== 'undefined') ? block.attributes.paddingLeft + paddingUnit : null,
				paddingTopTablet: (typeof block.attributes.paddingTopTablet !== 'undefined') ? block.attributes.paddingTopTablet + paddingUnit : null,
				paddingRightTablet: (typeof block.attributes.paddingRightTablet !== 'undefined') ? block.attributes.paddingRightTablet + paddingUnit : null,
				paddingBottomTablet: (typeof block.attributes.paddingBottomTablet !== 'undefined') ? block.attributes.paddingBottomTablet + paddingUnit : null,
				paddingLeftTablet: (typeof block.attributes.paddingLeftTablet !== 'undefined') ? block.attributes.paddingLeftTablet + paddingUnit : null,
				paddingTopMobile: (typeof block.attributes.paddingTopMobile !== 'undefined') ? block.attributes.paddingTopMobile + paddingUnit : null,
				paddingRightMobile: (typeof block.attributes.paddingRightMobile !== 'undefined') ? block.attributes.paddingRightMobile + paddingUnit : null,
				paddingBottomMobile: (typeof block.attributes.paddingBottomMobile !== 'undefined') ? block.attributes.paddingBottomMobile + paddingUnit : null,
				paddingLeftMobile: (typeof block.attributes.paddingLeftMobile !== 'undefined') ? block.attributes.paddingLeftMobile + paddingUnit : null,
			};
			const margin = {
				marginTop: (typeof block.attributes.marginTop !== 'undefined') ? block.attributes.marginTop + marginUnit : null,
				marginRight: (typeof block.attributes.marginRight !== 'undefined') ? block.attributes.marginRight + marginUnit : null,
				marginBottom: (typeof block.attributes.marginBottom !== 'undefined') ? block.attributes.marginBottom + marginUnit : null,
				marginLeft: (typeof block.attributes.marginLeft !== 'undefined') ? block.attributes.marginLeft + marginUnit : null,
				marginTopTablet: (typeof block.attributes.marginTopTablet !== 'undefined') ? block.attributes.marginTopTablet + marginUnit : null,
				marginRightTablet: (typeof block.attributes.marginRightTablet !== 'undefined') ? block.attributes.marginRightTablet + marginUnit : null,
				marginBottomTablet: (typeof block.attributes.marginBottomTablet !== 'undefined') ? block.attributes.marginBottomTablet + marginUnit : null,
				marginLeftTablet: (typeof block.attributes.marginLeftTablet !== 'undefined') ? block.attributes.marginLeftTablet + marginUnit : null,
				marginTopMobile: (typeof block.attributes.marginTopMobile !== 'undefined') ? block.attributes.marginTopMobile + marginUnit : null,
				marginRightMobile: (typeof block.attributes.marginRightMobile !== 'undefined') ? block.attributes.marginRightMobile + marginUnit : null,
				marginBottomMobile: (typeof block.attributes.marginBottomMobile !== 'undefined') ? block.attributes.marginBottomMobile + marginUnit : null,
				marginLeftMobile: (typeof block.attributes.marginLeftMobile !== 'undefined') ? block.attributes.marginLeftMobile + marginUnit : null,
			};

			const borderRadius = {
				borderRadiusTopLeft: (typeof block.attributes.borderRadiusTopLeft !== 'undefined') ? block.attributes.borderRadiusTopLeft + borderRadiusUnit : null,
				borderRadiusTopRight: (typeof block.attributes.borderRadiusTopRight !== 'undefined') ? block.attributes.borderRadiusTopRight + borderRadiusUnit : null,
				borderRadiusBottomRight: (typeof block.attributes.borderRadiusBottomRight !== 'undefined') ? block.attributes.borderRadiusBottomRight + borderRadiusUnit : null,
				borderRadiusBottomLeft: (typeof block.attributes.borderRadiusBottomLeft !== 'undefined') ? block.attributes.borderRadiusBottomLeft + borderRadiusUnit : null,
				borderRadiusTopLeftTablet: (typeof block.attributes.borderRadiusTopLeftTablet !== 'undefined') ? block.attributes.borderRadiusTopLeftTablet + borderRadiusUnit : null,
				borderRadiusTopRightTablet: (typeof block.attributes.borderRadiusTopRightTablet !== 'undefined') ? block.attributes.borderRadiusTopRightTablet + borderRadiusUnit : null,
				borderRadiusBottomRightTablet: (typeof block.attributes.borderRadiusBottomRightTablet !== 'undefined') ? block.attributes.borderRadiusBottomRightTablet + borderRadiusUnit : null,
				borderRadiusBottomLeftTablet: (typeof block.attributes.borderRadiusBottomLeftTablet !== 'undefined') ? block.attributes.borderRadiusBottomLeftTablet + borderRadiusUnit : null,
				borderRadiusTopLeftMobile: (typeof block.attributes.borderRadiusTopLeftMobile !== 'undefined') ? block.attributes.borderRadiusTopLeftMobile + borderRadiusUnit : null,
				borderRadiusTopRightMobile: (typeof block.attributes.borderRadiusTopRightMobile !== 'undefined') ? block.attributes.borderRadiusTopRightMobile + borderRadiusUnit : null,
				borderRadiusBottomRightMobile: (typeof block.attributes.borderRadiusBottomRightMobile !== 'undefined') ? block.attributes.borderRadiusBottomRightMobile + borderRadiusUnit : null,
				borderRadiusBottomLeftMobile: (typeof block.attributes.borderRadiusBottomLeftMobile !== 'undefined') ? block.attributes.borderRadiusBottomLeftMobile + borderRadiusUnit : null,
			};

			const borderWidth = {
				borderWidthTop: (typeof block.attributes.borderWidthTop !== 'undefined') ? block.attributes.borderWidthTop + borderWidthUnit : null,
				borderWidthRight: (typeof block.attributes.borderWidthRight !== 'undefined') ? block.attributes.borderWidthRight + borderWidthUnit : null,
				borderWidthBottom: (typeof block.attributes.borderWidthBottom !== 'undefined') ? block.attributes.borderWidthBottom + borderWidthUnit : null,
				borderWidthLeft: (typeof block.attributes.borderWidthLeft !== 'undefined') ? block.attributes.borderWidthLeft + borderWidthUnit : null,
				borderWidthTopTablet: (typeof block.attributes.borderWidthTopTablet !== 'undefined') ? block.attributes.borderWidthTopTablet + borderWidthUnit : null,
				borderWidthRightTablet: (typeof block.attributes.borderWidthRightTablet !== 'undefined') ? block.attributes.borderWidthRightTablet + borderWidthUnit : null,
				borderWidthBottomTablet: (typeof block.attributes.borderWidthBottomTablet !== 'undefined') ? block.attributes.borderWidthBottomTablet + borderWidthUnit : null,
				borderWidthLeftTablet: (typeof block.attributes.borderWidthLeftTablet !== 'undefined') ? block.attributes.borderWidthLeftTablet + borderWidthUnit : null,
				borderWidthTopMobile: (typeof block.attributes.borderWidthTopMobile !== 'undefined') ? block.attributes.borderWidthTopMobile + borderWidthUnit : null,
				borderWidthRightMobile: (typeof block.attributes.borderWidthRightMobile !== 'undefined') ? block.attributes.borderWidthRightMobile + borderWidthUnit : null,
				borderWidthBottomMobile: (typeof block.attributes.borderWidthBottomMobile !== 'undefined') ? block.attributes.borderWidthBottomMobile + borderWidthUnit : null,
				borderWidthLeftMobile: (typeof block.attributes.borderWidthLeftMobile !== 'undefined') ? block.attributes.borderWidthLeftMobile + borderWidthUnit : null,
			};

			if (typeof meta === 'undefined' || typeof meta._gx_dimensions === 'undefined' || (typeof meta._gx_dimensions !== 'undefined' && meta._gx_dimensions === '')) {
				dimensions = {};
			} else {
				dimensions = JSON.parse(meta._gx_dimensions);
			}

			if (typeof dimensions[id] === 'undefined') {
				dimensions[id] = {};
				dimensions[id][this.props.type] = {};
			} else {
				if (typeof dimensions[id][this.props.type] === 'undefined') {
					dimensions[id][this.props.type] = {};
				}
			}

			if (this.props.dimensionSize === 'advanced') {
				switch (this.props.type) {
					case 'padding':
						dimensions[id][this.props.type] = padding;
					case 'margin':
						dimensions[id][this.props.type] = margin;
					case 'borderRadius':
						dimensions[id][this.props.type] = borderRadius;
					case 'borderWidth':
						dimensions[id][this.props.type] = borderWidth;
					default: dimensions[id][this.props.type] = undefined;
				}
			}
			// Save values to metadata.
			wp.data.dispatch('core/editor').editPost({
				meta: {
					_gx_dimensions: JSON.stringify(dimensions),
				},
			});

			//add CSS to head
			const head = document.head || document.getElementsByTagName('head')[0];
			const style = document.createElement('style');
			let responsiveCss = '';
			style.type = 'text/css';

			//add responsive styling for tablet device
			responsiveCss += '@media only screen and (max-width: 768px) {';
			responsiveCss += '.' + id + ' > div{';
			if (typeof padding.paddingTopTablet !== 'undefined') {
				responsiveCss += 'padding-top: ' + padding.paddingTopTablet + ' !important;';
			}
			if (typeof padding.paddingBottomTablet !== 'undefined') {
				responsiveCss += 'padding-bottom: ' + padding.paddingBottomTablet + ' !important;';
			}
			if (typeof padding.paddingRightTablet !== 'undefined') {
				responsiveCss += 'padding-right: ' + padding.paddingRightTablet + ' !important;';
			}
			if (typeof padding.paddingLeftTablet !== 'undefined') {
				responsiveCss += 'padding-left: ' + padding.paddingLeftTablet + ' !important;';
			}

			if (typeof margin.marginTopTablet !== 'undefined') {
				responsiveCss += 'margin-top: ' + margin.marginTopTablet + ' !important;';
			}
			if (typeof margin.marginBottomTablet !== 'undefined') {
				responsiveCss += 'margin-bottom: ' + margin.marginBottomTablet + ' !important;';
			}
			if (typeof margin.marginRightTablet !== 'undefined') {
				responsiveCss += 'margin-right: ' + margin.marginRightTablet + ' !important;';
			}
			if (typeof margin.marginleLtTablet !== 'undefined') {
				responsiveCss += 'margin-left: ' + margin.marginLeftTablet + ' !important;';
			}
			if (typeof borderRadius.borderRadiusTopLeftTablet !== 'undefined') {
				responsiveCss += 'border-top-left-radius: ' + borderRadius.borderRadiusTopLeftTablet + ' !important;';
			}
			if (typeof borderRadius.borderRadiusTopRightTablet !== 'undefined') {
				responsiveCss += 'border-top-right-radius: ' + borderRadius.borderRadiusTopRightTablet + ' !important;';
			}
			if (typeof borderRadius.borderRadiusBottomRightTablet !== 'undefined') {
				responsiveCss += 'border-bottom-right-radius: ' + borderRadius.borderRadiusBottomRightTablet + ' !important;';
			}
			if (typeof borderRadius.borderRadiusBottomLeftTablet !== 'undefined') {
				responsiveCss += 'border-bottom-left-radius: ' + borderRadius.borderRadiusBottomLeftTablet + ' !important;';
			}
			if (typeof borderWidth.borderWidthTopTablet !== 'undefined') {
				responsiveCss += 'border-top-width: ' + borderWidth.borderWidthTopTablet + ' !important;';
			}
			if (typeof borderWidth.borderWidthRightTablet !== 'undefined') {
				responsiveCss += 'border-right-width: ' + borderWidth.borderWidthRightTablet + ' !important;';
			}
			if (typeof borderWidth.borderWidthBottomTablet !== 'undefined') {
				responsiveCss += 'border-bottom-width: ' + borderWidth.borderWidthBottomTablet + ' !important;';
			}
			if (typeof borderWidth.borderWidthLeftTablet !== 'undefined') {
				responsiveCss += 'border-left-width: ' + borderWidth.borderWidthLeftTablet + ' !important;';
			}

			responsiveCss += '}';
			responsiveCss += '}';

			responsiveCss += '@media only screen and (max-width: 514px) {';
			responsiveCss += '.' + id + ' > div{';
			if (typeof padding.paddingTopMobile !== 'undefined') {
				responsiveCss += 'padding-top: ' + padding.paddingTopMobile + ' !important;';
			}
			if (typeof padding.paddingBottomMobile !== 'undefined') {
				responsiveCss += 'padding-bottom: ' + padding.paddingBottomMobile + ' !important;';
			}
			if (typeof padding.paddingRightMobile !== 'undefined') {
				responsiveCss += 'padding-right: ' + padding.paddingRightMobile + ' !important;';
			}
			if (typeof padding.paddingLeftMobile !== 'undefined') {
				responsiveCss += 'padding-left: ' + padding.paddingLeftMobile + ' !important;';
			}
			if (typeof margin.marginTopMobile !== 'undefined') {
				responsiveCss += 'margin-top: ' + margin.marginTopMobile + ' !important;';
			}
			if (typeof margin.marginBottomMobile !== 'undefined') {
				responsiveCss += 'margin-bottom: ' + margin.marginBottomMobile + ' !important;';
			}
			if (typeof margin.marginRightMobile !== 'undefined') {
				responsiveCss += 'margin-right: ' + margin.marginRightMobile + ' !important;';
			}
			if (typeof margin.marginleLtMobile !== 'undefined') {
				responsiveCss += 'margin-left: ' + margin.marginLeftMobile + ' !important;';
			}
			if (typeof borderRadius.borderRadiusTopLeftMobile !== 'undefined') {
				responsiveCss += 'border-top-left-radius: ' + borderRadius.borderRadiusTopLeftMobile + ' !important;';
			}
			if (typeof borderRadius.borderRadiusTopRightMobile !== 'undefined') {
				responsiveCss += 'border-top-right-radius: ' + borderRadius.borderRadiusTopRightMobile + ' !important;';
			}
			if (typeof borderRadius.borderRadiusBottomRightMobile !== 'undefined') {
				responsiveCss += 'border-bottom-right-radius: ' + borderRadius.borderRadiusBottomRightMobile + ' !important;';
			}
			if (typeof borderRadius.borderRadiusBottomLeftMobile !== 'undefined') {
				responsiveCss += 'border-bottom-left-radius: ' + borderRadius.borderRadiusBottomLeftMobile + ' !important;';
			}
			if (typeof borderWidth.borderWidthTopMobile !== 'undefined') {
				responsiveCss += 'border-top-width: ' + borderWidth.borderWidthTopMobile + ' !important;';
			}
			if (typeof borderWidth.borderWidthBottomMobile !== 'undefined') {
				responsiveCss += 'border-bottom-width: ' + borderWidth.borderWidthBottomMobile + ' !important;';
			}
			if (typeof borderWidth.borderWidthRightMobile !== 'undefined') {
				responsiveCss += 'border-right-width: ' + borderWidth.borderWidthRightMobile + ' !important;';
			}
			if (typeof borderWidth.borderWidthleLtMobile !== 'undefined') {
				responsiveCss += 'border-left-width: ' + borderWidth.borderWidthLeftMobile + ' !important;';
			}

			responsiveCss += '}';
			responsiveCss += '}';

			if (style.styleSheet) {
				style.styleSheet.cssText = responsiveCss;
			} else {
				style.appendChild(document.createTextNode(responsiveCss));
			}

			head.appendChild(style);
		}
	}

	render() {
		const {
			help,
			instanceId,
			//label = __('Margin', 'gutenberg-extra'),
			type = 'margin',
			//unit,
			dimensionSize,
			setAttributes,
			onChange
		} = this.props;

		const {
			label,
			unit,
			syncUnitsMobile,
			device,
		} = this.state;

		const classes = classnames(
			'components-gx-dimensions-control',
			'gx-' + this.props.type + "-dimensions-control", {
		}
		);

		const id = `inspector-gx-dimensions-control-${instanceId}`;

		const unitSizes = [
			{
				/* translators: a unit of size (px) for css markup */
				name: __('Pixel', 'gutenberg-extra'),
				unitValue: 'px',
			},
			{
				/* translators: a unit of size (em) for css markup */
				name: __('Em', 'gutenberg-extra'),
				unitValue: 'em',
			},
			{
				/* translators: a unit of size (vw) for css markup */
				name: __('Viewport Width', 'gutenberg-extra'),
				unitValue: 'vw',
			},
			{
				/* translators: a unit of size (vh) for css markup */
				name: __('Viewport Height', 'gutenberg-extra'),
				unitValue: 'vh',
			},
			{
				/* translators: a unit of size for css markup */
				name: __('Percentage', 'gutenberg-extra'),
				unitValue: '%',
			},
		];

		const onSelect = (tabName) => {
			switch (tabName) {
				case 'desktop':
					this.setState({ device: 'tablet' });
					break;
				case 'tablet':
					this.setState({ device: 'mobile' });
					break;
				case 'mobile':
					this.setState({ device: 'desktop' });
					break;
				default:
					break;
			}
		};

		const onChangeUnit = ( value ) => {
			this.values.unit = value;
			saveAndSend();
		}

		const onChangeValue = ( e ) => {
			if ( e.target.getAttribute('action') == 'reset' ) {
				for (let [key, value] of Object.entries(this.values[device])) {
					isNumber(value) ?
						this.values[device][key] = 0 :
						null
				}
			}
			else {
				const newValue = Number(e.target.value);
				const target = e.target.getAttribute('action');
				if ( this.values[device].sync === true ) {
					for (let [key, value] of Object.entries(this.values[device])) {
						isNumber(value) ?
							this.values[device][key] = newValue :
							null
					  }
				}
				else {
					this.values[device][target] = newValue;
				}
			}
			saveAndSend();
		}

		const onChangeSync = ( e ) => {
			this.values[device].sync = !this.values[device].sync;
			saveAndSend();
		}

		const saveAndSend = () => {
			this.props.onChange( JSON.stringify(this.values) );
		}

		return (
			<Fragment>
				<div className={classes}>
					<Fragment>
						<div className="components-gx-dimensions-control__header">
							{label && <p className={'components-gx-dimensions-control__label'}>{label}</p>}
							<Button
								className="components-color-palette__clear"
								onClick={onChangeValue}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'gutenberg-extra'),
									label.toLowerCase()
								)}
								action="reset"
							>
								{icons.reset}
							</Button>
							<div className="components-gx-dimensions-control__actions">
								<ButtonGroup className="components-gx-dimensions-control__units" aria-label={__('Select Units', 'gutenberg-extra')}>
									{map(unitSizes, ({ unitValue, name }) => (
										<Tooltip text={sprintf(
											/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
											__('%s Units', 'gutenberg-extra'),
											name
										)}>
											<Button
												key={unitValue}
												className={'components-gx-dimensions-control__units--' + name}
												isSmall
												isPrimary={this.values.unit === unitValue}
												aria-pressed={this.values.unit === unitValue}
												aria-label={sprintf(
													/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
													__('%s Units', 'gutenberg-extra'),
													name
												)}
												onClick={() => onChangeUnit(unitValue)}
											>
												{unitValue}
											</Button>
										</Tooltip>
									))}
								</ButtonGroup>
							</div>
						</div>
						<TabPanel
							className="components-gx-dimensions-control__mobile-controls"
							activeClass="tab-is-active"
							initialTabName="desktop"
							onSelect={onSelect}
							tabs={[
								{
									name: 'desktop',
									title: icons.mobile,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--desktop components-gx-dimensions-control__mobile-controls-item--desktop ${device == 'desktop' ? 'is-active' : ''}`,
								},
								{
									name: 'tablet',
									title: icons.desktopChrome,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--tablet components-gx-dimensions-control__mobile-controls-item--tablet ${device == 'tablet' ? 'is-active' : ''}`,
								},
								{
									name: 'mobile',
									title: icons.tablet,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--mobile components-gx-dimensions-control__mobile-controls-item--mobile ${device == 'mobile' ? 'is-active' : ''}`,
								},
							]}>
							{
								( ) => {
									return (
										<Fragment>
											<div className="components-gx-dimensions-control__inputs">
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Top', 'gutenberg-extra'),
														label
													)}
													aria-describedby={!!help ? id + '__help' : undefined}
													value={this.values[device].valueTop}
													min={type === 'padding' ? 0 : undefined}
													data-device-type={device}
													action="valueTop"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Right', 'gutenberg-extra'),
														label
													)}
													aria-describedby={!!help ? id + '__help' : undefined}
													value={this.values[device].valueRight}
													min={type === 'padding' ? 0 : undefined}
													data-device-type={device}
													action="valueRight"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Bottom', 'gutenberg-extra'),
														label
													)}
													aria-describedby={!!help ? id + '__help' : undefined}
													value={this.values[device].valueBottom}
													min={type === 'padding' ? 0 : undefined}
													data-device-type={device}
													action="valueBottom"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Left', 'gutenberg-extra'),
														label
													)}
													aria-describedby={!!help ? id + '__help' : undefined}
													value={this.values[device].valueLeft}
													min={type === 'padding' ? 0 : undefined}
													data-device-type={device}
													action="valueLeft"
												/>
												<Tooltip text={!!this.values[device].sync ? __('Unsync', 'gutenberg-extra') : __('Sync', 'gutenberg-extra')} >
													<Button
														className="components-gx-dimensions-control_sync"
														aria-label={__('Sync Units', 'gutenberg-extra')}
														isPrimary={this.values[device].sync ? this.values[device].sync : false}
														aria-pressed={this.values[device].sync ? this.values[device].sync : false}
														onClick={onChangeSync}
														data-device-type={device}
														isSmall
													>
														{!!this.values[device].sync ? icons.sync : icons.sync}
													</Button>
												</Tooltip>
											</div>
										</Fragment>
									)
								}
							}
						</TabPanel>
						<div className="components-gx-dimensions-control__input-labels">
							<span className="components-gx-dimensions-control__number-label">{__('Top', 'gutenberg-extra')}</span>
							<span className="components-gx-dimensions-control__number-label">{__('Right', 'gutenberg-extra')}</span>
							<span className="components-gx-dimensions-control__number-label">{__('Bottom', 'gutenberg-extra')}</span>
							<span className="components-gx-dimensions-control__number-label">{__('Left', 'gutenberg-extra')}</span>
							<span className="components-gx-dimensions-control__number-label-blank"></span>
						</div>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}