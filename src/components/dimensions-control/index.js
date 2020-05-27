/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
	__,
	sprintf
} = wp.i18n;
const {
	SelectControl,
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
		this.saveAndSend(value, this.props.avoidZero || false)
	}

	render() {
		const {
			className,
			unit,
			avoidZero = false
		} = this.props;

		const {
			device,
		} = this.state;

		let value = typeof this.props.value === 'object' ? this.props.value : JSON.parse(this.props.value);
		const classes = classnames(
			`components-maxi-dimensions-control components-base-control maxi-${value.label}-dimensions-control`,
			className
		);

		const options = [
			{ label: 'PX', value: 'px' },
			{ label: 'EM', value: 'em' },
			{ label: 'VW', value: 'vw' },
			{ label: '%', value: '%' },
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
			this.saveAndSend(value, avoidZero);
		}

		const onChangeValue = e => {
			const newValue = e.target.value;
			const target = Number(e.target.getAttribute('action'));

			if (value[device].sync === true) {
				for (let key of Object.keys(value[device])) {
					key != 'sync' ?
						value[device][key] = !!Number(newValue) || newValue === '0' ? Number(newValue) : newValue :
						null;
				}
			}
			else {
				value[device][getKey(value[device], target)] = !!Number(newValue) || newValue === '0' ? Number(newValue) : newValue;
			}

			this.saveAndSend(value, avoidZero);
		}

		const onReset = () => {
			for (let key of Object.keys(value[device])) {
				key != 'sync' ?
					value[device][key] = '' :
					value[device][sync] = true;
			}

			this.saveAndSend(value, avoidZero);
		}

		const onChangeSync = () => {
			value[device].sync = !value[device].sync;
			this.saveAndSend(value, avoidZero);
		}

		return (
			<div className={classes}>
				<div className="components-maxi-dimensions-control__header components-base-control">
					<p className='components-maxi-dimensions-control__label'>
						{value.label}
					</p>
					<div className="components-maxi-dimensions-control__actions">
						<SelectControl
							className="components-maxi-dimensions-control__units"
							options={options}
							value={unit}
							onChange={(val) => onChangeUnit(val)}
						/>
						<Button
							className="components-maxi-dimensions-control__units-reset"
							onClick={onReset}
							aria-label={sprintf(
								/* translators: %s: a texual label  */
								__('Reset %s settings', 'maxi-blocks'),
								value.label.toLowerCase()
							)}
							action="reset"
							type="reset"
						>
							{reset}
						</Button>
					</div>
				</div>
				<TabPanel
					className="components-maxi-dimensions-control__mobile-controls"
					activeClass="tab-is-active"
					initialTabName="desktop"
					onSelect={onSelect}
					tabs={[
						{
							name: 'desktop',
							title: desktop,
							className: `components-maxi-dimensions-control__mobile-controls-item components-button is-button is-default components-maxi-dimensions-control__mobile-controls-item--desktop components-maxi-dimensions-control__mobile-controls-item--desktop ${device == 'desktop' ? 'is-active' : ''}`,
						},
						{
							name: 'tablet',
							title: tablet,
							className: `components-maxi-dimensions-control__mobile-controls-item components-button is-button is-default components-maxi-dimensions-control__mobile-controls-item--tablet components-maxi-dimensions-control__mobile-controls-item--tablet ${device == 'tablet' ? 'is-active' : ''}`,
						},
						{
							name: 'mobile',
							title: mobile,
							className: `components-maxi-dimensions-control__mobile-controls-item components-button is-button is-default components-maxi-dimensions-control__mobile-controls-item--mobile components-maxi-dimensions-control__mobile-controls-item--mobile ${device == 'mobile' ? 'is-active' : ''}`,
						},
					]}>
					{
						() => {
							return (
								<Fragment>
									<div className="components-maxi-dimensions-control__inputs">
										<input
											className="components-maxi-dimensions-control__number"
											type="number"
											onChange={onChangeValue}
											aria-label={sprintf(
												/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
												__('%s Top', 'maxi-blocks'),
												value.label
											)}
											value={value[device][getKey(value[device], 0)]}
											min={value.min ? value.min : 0}
											max={value.max ? value.max : 'none'}
											data-device-type={device}
											action="0"
										/>
										<input
											className="components-maxi-dimensions-control__number"
											type="number"
											onChange={onChangeValue}
											aria-label={sprintf(
												/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
												__('%s Right', 'maxi-blocks'),
												value.label
											)}
											value={value[device][getKey(value[device], 1)]}
											min={value.min ? value.min : 0}
											max={value.max ? value.max : 'none'}
											data-device-type={device}
											action="1"
										/>
										<input
											className="components-maxi-dimensions-control__number"
											type="number"
											onChange={onChangeValue}
											aria-label={sprintf(
												/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
												__('%s Bottom', 'maxi-blocks'),
												value.label
											)}
											value={value[device][getKey(value[device], 2)]}
											min={value.min ? value.min : 0}
											max={value.max ? value.max : 'none'}
											data-device-type={device}
											action="2"
										/>
										<input
											className="components-maxi-dimensions-control__number"
											type="number"
											onChange={onChangeValue}
											aria-label={sprintf(
												/* translators: %s: values associated with CSS syntax, 'Margin', 'Padding' */
												__('%s Left', 'maxi-blocks'),
												value.label
											)}
											value={value[device][getKey(value[device], 3)]}
											min={value.min ? value.min : 0}
											max={value.max ? value.max : 'none'}
											data-device-type={device}
											action="3"
										/>
										<Tooltip text={!!value[device].sync ? __('Unsync', 'maxi-blocks') : __('Sync', 'maximaxi-blocks')}>
											<Button
												className="components-maxi-dimensions-control_sync"
												aria-label={__('Sync Units', 'maxi-blocks')}
												isPrimary={value[device].sync}
												aria-pressed={value[device].sync}
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
				<div className="components-maxi-dimensions-control__input-labels">
					<span className="components-maxi-dimensions-control__number-label">{__('Top', 'maxi-blocks')}</span>
					<span className="components-maxi-dimensions-control__number-label">{__('Right', 'maxi-blocks')}</span>
					<span className="components-maxi-dimensions-control__number-label">{__('Bottom', 'maxi-blocks')}</span>
					<span className="components-maxi-dimensions-control__number-label">{__('Left', 'maxi-blocks')}</span>
					<span className="components-maxi-dimensions-control__number-label-blank"></span>
				</div>
			</div>
		);
	}
}