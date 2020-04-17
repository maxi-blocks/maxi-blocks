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
const {
	dispatch,
	select
} = wp.data;

/**
 * Internal dependencies
 */
import iconsSettings from '../icons/icons-settings';

/**
 * External dependencies
 */
import classnames from 'classnames';
import map from 'lodash/map';
import { isNumber } from 'lodash';

/**
 * Styles
 */
import './styles/editor.scss';

/**
 * Block
 */
export default class DimensionsControl extends Component {

	state = {
		device: 'desktop'
	}

	render() {
		const {
			onChange,
			target = '',
			avoidZero = false
		} = this.props;

		let value = typeof this.props.value === 'object' ? this.props.value : JSON.parse(this.props.value);

		const {
			device,
		} = this.state;

		const classes = classnames(
			'components-gx-dimensions-control',
			`gx-${value.label}-dimensions-control`
		);

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

		const getKey = (obj, target) => {
			return Object.keys(obj)[target];
		}

		const onChangeUnit = (unit) => {
			value.unit = unit;
			saveAndSend();
		}

		const onChangeValue = (e) => {
			const newValue = Number(e.target.value);
			const target = Number(e.target.getAttribute('action'));
			if (value[device].sync === true || isNaN(newValue)) {
				for (let [key, val] of Object.entries(value[device])) {
					isNumber(val) ?
						value[device][key] = !isNaN(newValue) ? newValue : 0 :
						null
				}
			}
			else {
				value[device][getKey(value[device], target)] = newValue;
			}
			saveAndSend();
		}

		const onChangeSync = () => {
			value[device].sync = !value[device].sync;
			saveAndSend();
		}

		/**
		* Retrieves the old meta data
		*/
		const getMeta = () => {
			let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
			return meta ? JSON.parse(meta) : {};
		}

		/**
		 * Retrieve the target for responsive CSS
		 */
		const getTarget = () => {
			let styleTarget = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId()).uniqueID;
			styleTarget = `${styleTarget}${target.length > 0 ? `__$${target}` : '' }`;
			return styleTarget;
		}

		/**
		* Creates a new object that
		*
		* @param {string} target	Block attribute: uniqueID
		* @param {obj} meta		Old and saved metadate
		* @param {obj} value	New values to add
		*/
		const metaValue = () => {
			const meta = getMeta();
			const styleTarget = getTarget();
			const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, value, !avoidZero);
			const response = JSON.stringify(responsiveStyle.getNewValue);
			return response;
		}

		/**
		* Saves and send the data. Also refresh the styles on Editor
		*/
		const saveAndSend = () => {
			onChange(JSON.stringify(value));
			dispatch('core/editor').editPost({
				meta: {
					_gutenberg_extra_responsive_styles: metaValue(),
				},
			});
			new BackEndResponsiveStyles(getMeta());
		}

		return (
			<Fragment>
				<div className={classes}>
					<Fragment>
						<div className="components-gx-dimensions-control__header">
							{value.label && <p className={'components-gx-dimensions-control__label'}>{value.label}</p>}
							<Button
								className="components-color-palette__clear"
								onClick={onChangeValue}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'gutenberg-extra'),
									value.label.toLowerCase()
								)}
								action="reset"
							>
								{iconsSettings.reset}
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
												isPrimary={value.unit === unitValue}
												aria-pressed={value.unit === unitValue}
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
									title: iconsSettings.desktopChrome,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--desktop components-gx-dimensions-control__mobile-controls-item--desktop ${device == 'desktop' ? 'is-active' : ''}`,
								},
								{
									name: 'tablet',
									title: iconsSettings.tablet,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--tablet components-gx-dimensions-control__mobile-controls-item--tablet ${device == 'tablet' ? 'is-active' : ''}`,
								},
								{
									name: 'mobile',
									title: iconsSettings.mobile,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--mobile components-gx-dimensions-control__mobile-controls-item--mobile ${device == 'mobile' ? 'is-active' : ''}`,
								},
							]}>
							{
								() => {
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
														value.label
													)}
													value={value[device][getKey(value[device], 0)]}
													min={value.min ? value.min : 0}
													max={value.max ? value.max : 'none'}
													data-device-type={device}
													action="0"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Right', 'gutenberg-extra'),
														value.label
													)}
													value={value[device][getKey(value[device], 1)]}
													min={value.min ? value.min : 0}
													max={value.max ? value.max : 'none'}
													data-device-type={device}
													action="1"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Bottom', 'gutenberg-extra'),
														value.label
													)}
													value={value[device][getKey(value[device], 2)]}
													min={value.min ? value.min : 0}
													max={value.max ? value.max : 'none'}
													data-device-type={device}
													action="2"
												/>
												<input
													className="components-gx-dimensions-control__number"
													type="number"
													onChange={onChangeValue}
													aria-label={sprintf(
														/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
														__('%s Left', 'gutenberg-extra'),
														value.label
													)}
													value={value[device][getKey(value[device], 3)]}
													min={value.min ? value.min : 0}
													max={value.max ? value.max : 'none'}
													data-device-type={device}
													action="3"
												/>
												<Tooltip text={!!value[device].sync ? __('Unsync', 'gutenberg-extra') : __('Sync', 'gutenberg-extra')} >
													<Button
														className="components-gx-dimensions-control_sync"
														aria-label={__('Sync Units', 'gutenberg-extra')}
														isPrimary={value[device].sync ? value[device].sync : false}
														aria-pressed={value[device].sync ? value[device].sync : false}
														onClick={onChangeSync}
														data-device-type={device}
														isSmall
													>
														{!!value[device].sync ? iconsSettings.sync : iconsSettings.sync}
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