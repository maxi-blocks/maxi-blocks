/**
 * WordPress dependencies
 */
const {	Fragment } = wp.element;
const {
	__,
	sprintf
} = wp.i18n;
const {
	ButtonGroup,
	Button,
	Tooltip,
	TabPanel
} = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';

/**
 * External dependencies
 */
import classnames from 'classnames';
import map from 'lodash/map';
import { isNumber } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	reset,
	desktop,
	tablet,
	mobile,
	sync
} from '../../icons';

/**
 * Component
 */
export default class DimensionsControl extends GXComponent {

	state = {
		device: 'desktop'
    }
    
    componentDidMount() {
        const value = typeof this.props.value === 'object' ? this.props.value : JSON.parse(this.props.value);
        this.saveAndSend(value, false)
    }

	render() {
		const { className } = this.props;

		const {
			device,
		} = this.state;

		let value = typeof this.props.value === 'object' ? this.props.value : JSON.parse(this.props.value);
		const classes = classnames( 
			`components-gx-dimensions-control components-base-control gx-${value.label}-dimensions-control`,
			className
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
			this.saveAndSend(value, false);
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
			this.saveAndSend(value, false);
		}

		const onChangeSync = () => {
			value[device].sync = !value[device].sync;
			this.saveAndSend(value, false);
        }
        
		return (
			<Fragment>
				<div className={classes}>
					<Fragment>
						<div className="components-gx-dimensions-control__header components-base-control">
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
								{reset}
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
												className={'components-button-radio components-gx-dimensions-control__units--' + name}
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
									title: desktop,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--desktop components-gx-dimensions-control__mobile-controls-item--desktop ${device == 'desktop' ? 'is-active' : ''}`,
								},
								{
									name: 'tablet',
									title: tablet,
									className: `components-gx-dimensions-control__mobile-controls-item components-button is-button is-default components-gx-dimensions-control__mobile-controls-item--tablet components-gx-dimensions-control__mobile-controls-item--tablet ${device == 'tablet' ? 'is-active' : ''}`,
								},
								{
									name: 'mobile',
									title: mobile,
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
														{sync}
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