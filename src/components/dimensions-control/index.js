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
const {
	dispatch,
	select
} = wp.data;

export default class DimensionsControl extends Component {

	values = JSON.parse(this.props.value);

	state = {
		device: 'desktop'
	}

	render() {
		const {
			onChange,
			target = '',
		} = this.props;

		const {
			device,
		} = this.state;

		const classes = classnames(
			'components-gx-dimensions-control',
			`gx-${this.values.label}-dimensions-control`
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

		const onChangeUnit = (value) => {
			this.values.unit = value;
			saveAndSend();
		}

		const onChangeValue = (e) => {
			if (e.target.getAttribute('action') == 'reset') {
				for (let [key, value] of Object.entries(this.values[device])) {
					isNumber(value) ?
						this.values[device][key] = 0 :
						null
				}
			}
			else {
				const newValue = Number(e.target.value);
				const target = Number(e.target.getAttribute('action'));
				if (this.values[device].sync === true) {
					for (let [key, value] of Object.entries(this.values[device])) {
						isNumber(value) ?
							this.values[device][key] = newValue :
							null
					}
				}
				else {
					this.values[device][getKey(this.values[device], target)] = newValue;
				}
			}
			saveAndSend();
		}

		const onChangeSync = (e) => {
			this.values[device].sync = !this.values[device].sync;
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
		* @param {obj} this.values	New values to add
		*/
		const metaValue = () => {
			const meta = getMeta();
			const styleTarget = getTarget();
			const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, this.values);
			const response = JSON.stringify(responsiveStyle.getNewValue);
			return response;
		}

		/**
		* Saves and send the data. Also refresh the styles on Editor
		*/
		const saveAndSend = () => {
			onChange(JSON.stringify(this.values));
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
							{this.values.label && <p className={'components-gx-dimensions-control__label'}>{this.values.label}</p>}
							<Button
								className="components-color-palette__clear"
								onClick={onChangeValue}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'gutenberg-extra'),
									this.values.label.toLowerCase()
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
									title: icons.desktopChrome,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--desktop components-gx-dimensions-control__mobile-controls-item--desktop ${device == 'desktop' ? 'is-active' : ''}`,
								},
								{
									name: 'tablet',
									title: icons.tablet,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--tablet components-gx-dimensions-control__mobile-controls-item--tablet ${device == 'tablet' ? 'is-active' : ''}`,
								},
								{
									name: 'mobile',
									title: icons.mobile,
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
														this.values.label
													)}
													value={this.values[device][getKey(this.values[device], 0)]}
													min={0}
													max={this.values.max ? this.values.max : 0}
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
														this.values.label
													)}
													value={this.values[device][getKey(this.values[device], 1)]}
													min={0}
													max={this.values.max ? this.values.max : 0}
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
														this.values.label
													)}
													value={this.values[device][getKey(this.values[device], 2)]}
													min={0}
													max={this.values.max ? this.values.max : 0}
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
														this.values.label
													)}
													value={this.values[device][getKey(this.values[device], 3)]}
													min={0}
													max={this.values.max ? this.values.max : 0}
													data-device-type={device}
													action="3"
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