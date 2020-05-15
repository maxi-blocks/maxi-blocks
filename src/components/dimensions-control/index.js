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
        this.saveAndSend(value, this.props.avoidZero || false)
    }

	render() {
		const { 
			className,
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

		const unitSizes = [
			{
				/* translators: a unit of size (px) for css markup */
				name: __('Pixel', 'maxi-blocks'),
				unitValue: 'px',
			},
			{
				/* translators: a unit of size (em) for css markup */
				name: __('Em', 'maxi-blocks'),
				unitValue: 'em',
			},
			{
				/* translators: a unit of size (vw) for css markup */
				name: __('Viewport Width', 'maxi-blocks'),
				unitValue: 'vw',
			},
			{
				/* translators: a unit of size (vh) for css markup */
				name: __('Viewport Height', 'maxi-blocks'),
				unitValue: 'vh',
			},
			{
				/* translators: a unit of size for css markup */
				name: __('Percentage', 'maxi-blocks'),
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
			this.saveAndSend(value, avoidZero);
		}

		const onChangeValue = (e) => {
			const newValue = e.target.value;
			const target = Number(e.target.getAttribute('action'));
			if (value[device].sync === true || isNaN(newValue)) {
				for (let [key, val] of Object.entries(value[device])) {
					isNumber(val) ?
						value[device][key] = !isNaN(newValue) ? newValue : '' :
						null
				}
			}
			else {
				value[device][getKey(value[device], target)] = newValue;
			}
			this.saveAndSend(value, avoidZero);
		}

		const onChangeSync = () => {
			value[device].sync = !value[device].sync;
			this.saveAndSend(value, avoidZero);
		}
				
		return (
			<Fragment>
				<div className={classes}>
					<Fragment>
						<div className="components-maxi-dimensions-control__header components-base-control">
							{value.label && <p className={'components-maxi-dimensions-control__label'}>{value.label}</p>}
							<Button
								className="components-color-palette__clear"
								onClick={onChangeValue}
								isSmall
								aria-label={sprintf(
									/* translators: %s: a texual label  */
									__('Reset %s settings', 'maxi-blocks'),
									value.label.toLowerCase()
								)}
								action="reset"
							>
								{reset}
							</Button>
							<div className="components-maxi-dimensions-control__actions">
								<ButtonGroup className="components-maxi-dimensions-control__units" aria-label={__('Select Units', 'maxi-blocks')}>
									{map(unitSizes, ({ unitValue, name }) => (
										<Tooltip text={sprintf(
											/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
											__('%s Units', 'maxi-blocks'),
											name
										)}>
											<Button
												key={unitValue}
												className={'components-button-radio components-maxi-dimensions-control__units--' + name}
												isSmall
												isPrimary={value.unit === unitValue}
												aria-pressed={value.unit === unitValue}
												aria-label={sprintf(
													/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
													__('%s Units', 'maxi-blocks'),
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
						<div className="components-maxi-dimensions-control__input-labels">
							<span className="components-maxi-dimensions-control__number-label">{__('Top', 'maxi-blocks')}</span>
							<span className="components-maxi-dimensions-control__number-label">{__('Right', 'maxi-blocks')}</span>
							<span className="components-maxi-dimensions-control__number-label">{__('Bottom', 'maxi-blocks')}</span>
							<span className="components-maxi-dimensions-control__number-label">{__('Left', 'maxi-blocks')}</span>
							<span className="components-maxi-dimensions-control__number-label-blank"></span>
						</div>
					</Fragment>
				</div>
			</Fragment>
		);
	}
}