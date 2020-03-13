/**
 * External dependencies
 */
import FontFamilySelector from '../font-family-selector/index';

/**
 * Internal dependencies
 */
import './styles/editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Component,
    Fragment
} = wp.element;
const {
    BaseControl,
    Button,
    SelectControl,
    RadioControl,
    RangeControl,
    Dropdown,
} = wp.components;
const {
	dispatch,
	select
} = wp.data;

export const typographyAttributes = {
    fontExample: {
        type: 'string',
        default: '{"label":"Typography","font":"default","options":{},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    }
}

export default class Typography extends Component {
    state = {
        device: 'desktop'
    }

    render() {
        const {
            className,
            classNamePopover = "gx-popover gx-fontpopover",
            buttonText = __('Typography', 'gutenberg-extra'),
            fontOptions,
            onChange,
            target = ''
        } = this.props;

        const {
            device
        } = this.state;

        const value = JSON.parse(fontOptions);

        const Divider = () => (
            <hr style={{ marginBottom: '15px', }} />
        );

        const onSelect = (device) => {
            switch (device) {
                case 'desktop':
                    this.setState({ device: 'desktop' });
                    break;
                case 'tablet':
                    this.setState({ device: 'tablet' });
                    break;
                case 'mobile':
                    this.setState({ device: 'mobile' });
                    break;
                default:
                    break;
            }
        };

        const getKey = (obj, target) => {
			return Object.keys(obj)[target];
		}

        const onChangeValue = (newValue, target) => {
            if (target == 'font') {
                value.font = newValue;
            }
            else {
                value[device][getKey(value[device], target)] = newValue;
            }
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
			const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, value);
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
            <div className={className}>
                <BaseControl
                    className={"gx-settings-button"}
                >
                    <BaseControl.VisualLabel>
                        {value.label}
                    </BaseControl.VisualLabel>
                    <Dropdown
                        className={'gx-fontdropdown'}
                        renderToggle={({ isOpen, onToggle }) => (
                            <Button
                                isSecundary
                                onClick={onToggle}
                                aria-expanded={isOpen}
                            >
                                {buttonText}
                            </Button>
                        )}
                        popoverProps={
                            {
                                className: classNamePopover,
                                noArrow: true,
                                position: "center"
                            }
                        }
                        renderContent={() => (
                            <Fragment>
                                <FontFamilySelector
                                    className={'gx-font-family-selector'}
                                    font={value.font}
                                    onChange={(value) => onChangeValue(value, 'font')}
                                />
                                <RadioControl
                                    className={'gx-device-control'}
                                    selected={device}
                                    options={[
                                        { label: '', value: 'desktop' },
                                        { label: '', value: 'tablet' },
                                        { label: '', value: 'mobile' },
                                    ]}
                                    onChange={onSelect}
                                />
                                <RadioControl
                                    className={'gx-unit-control'}
                                    selected={value[device][getKey(value[device], 0)]}
                                    options={[
                                        { label: 'PX', value: 'px' },
                                        { label: 'EM', value: 'em' },
                                        { label: 'VW', value: 'vw' },
                                        { label: '%', value: '%' },
                                    ]}
                                    onChange={value => onChangeValue(value, 0)}
                                />
                                <RangeControl
                                    label={__('Size', 'gutenberg-extra')}
                                    className={'gx-with-unit-control'}
                                    value={value[device][getKey(value[device], 1)]}
                                    onChange={value => onChangeValue(value, 1)}
                                    id={'size-control'}
                                    min={0}
                                    step={0.1}
                                    allowReset={true}
                                />
                                <RadioControl
                                    className={'gx-unit-control'}
                                    selected={value[device][getKey(value[device], 2)]}
                                    options={[
                                        { label: 'PX', value: 'px' },
                                        { label: 'EM', value: 'em' },
                                        { label: 'VW', value: 'vw' },
                                        { label: '%', value: '%' },
                                    ]}
                                    onChange={value => onChangeValue(value, 2)}
                                />
                                <RangeControl
                                    label={__('Line Height', 'gutenberg-extra')}
                                    className={'gx-with-unit-control'}
                                    value={value[device][getKey(value[device], 3)]}
                                    onChange={value => onChangeValue(value, 3)}
                                    min={0}
                                    step={0.1}
                                    allowReset={true}
                                />
                                <RadioControl
                                    className={'gx-unit-control'}
                                    selected={value[device][getKey(value[device], 4)]}
                                    options={[
                                        { label: 'PX', value: 'px' },
                                        { label: 'EM', value: 'em' },
                                        { label: 'VW', value: 'vw' },
                                        { label: '%', value: '%' },
                                    ]}
                                    onChange={value => onChangeValue(value, 4)}
                                />
                                <RangeControl
                                    label={__('Letter Spacing', 'gutenberg-extra')}
                                    className={'gx-with-unit-control'}
                                    value={value[device][getKey(value[device], 5)]}
                                    onChange={value => onChangeValue(value, 5)}
                                    min={0}
                                    step={0.1}
                                    allowReset={true}
                                />
                                <Divider />
                                <SelectControl
                                    label={__('Weight', 'gutenberg-extra')}
                                    className="gx-title-typography-setting"
                                    value={value[device][getKey(value[device], 6)]}
                                    options={[
                                        { label: __('Thin (Hairline)', 'gutenberg-extra'), value: 100 },
                                        { label: __('Extra Light (Ultra Light)', 'gutenberg-extra'), value: 200 },
                                        { label: __('Light', 'gutenberg-extra'), value: 300 },
                                        { label: __('Normal (Regular)', 'gutenberg-extra'), value: 400 },
                                        { label: __('Medium', 'gutenberg-extra'), value: 500 },
                                        { label: __('Semi Bold (Demi Bold)', 'gutenberg-extra'), value: 600 },
                                        { label: __('Bold', 'gutenberg-extra'), value: 700 },
                                        { label: __('Extra Bold (Ultra Bold)', 'gutenberg-extra'), value: 800 },
                                        { label: __('Black (Heavy)', 'gutenberg-extra'), value: 900 },
                                        { label: __('Extra Black (Ultra Black)', 'gutenberg-extra'), value: 950 },
                                    ]}
                                    onChange={value => onChangeValue(value, 6)}
                                />
                                <SelectControl
                                    label={__('Transform', 'gutenberg-extra')}
                                    className="gx-title-typography-setting"
                                    value={value[device][getKey(value[device], 7)]}
                                    options={[
                                        { label: __('Default', 'gutenberg-extra'), value: 'none' },
                                        { label: __('Capitilize', 'gutenberg-extra'), value: 'capitalize' },
                                        { label: __('Uppercase', 'gutenberg-extra'), value: 'uppercase' },
                                        { label: __('Lowercase', 'gutenberg-extra'), value: 'lowercase' },
                                        { label: __('Full Width', 'gutenberg-extra'), value: 'full-width' },
                                        { label: __('Full Size Kana', 'gutenberg-extra'), value: 'full-size-kana' },
                                    ]}
                                    onChange={value => onChangeValue(value, 7)}
                                />
                                <SelectControl
                                    label={__('Style', 'gutenberg-extra')}
                                    className="gx-title-typography-setting"
                                    value={value[device][getKey(value[device], 8)]}
                                    options={[
                                        { label: __('Default', 'gutenberg-extra'), value: 'normal' },
                                        { label: __('Italic', 'gutenberg-extra'), value: 'italic' },
                                        { label: __('Oblique', 'gutenberg-extra'), value: 'oblique' },
                                        { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
                                    ]}
                                    onChange={value => onChangeValue(value, 8)}
                                />
                                <SelectControl
                                    label={__('Decoration', 'gutenberg-extra')}
                                    className="gx-title-typography-setting"
                                    value={value[device][getKey(value[device], 9)]}
                                    options={[
                                        { label: __('Default', 'gutenberg-extra'), value: 'none' },
                                        { label: __('Overline', 'gutenberg-extra'), value: 'overline' },
                                        { label: __('Line Through', 'gutenberg-extra'), value: 'line-through' },
                                        { label: __('Underline', 'gutenberg-extra'), value: 'underline' },
                                        { label: __('Underline Overline', 'gutenberg-extra'), value: 'underline overline' },
                                    ]}
                                    onChange={value => onChangeValue(value, 9)}
                                />
                            </Fragment>
                        )}
                    >
                    </Dropdown>
                </BaseControl>
            </div>
        )
    }
}