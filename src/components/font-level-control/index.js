/**
 * Wordpress dependencies
 */
const { Button } = wp.components;
const { Component } = wp.element;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import { DefaultTypography } from '../index';
import { getDefaultProp } from '../../extensions/styles/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    isEmpty
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
export default class FontLevelControl extends Component {
    state = {
        target: this.props.target ? this.props.target : '',
        lastLevel: this.props.value,
        p: {},
        pHover: {},
        h1: {},
        h1Hover: {},
        h2: {},
        h2Hover: {},
        h3: {},
        h3Hover: {},
        h4: {},
        h4Hover: {},
        h5: {},
        h5Hover: {},
        h6: {},
        h6Hover: {}
    }

    render() {
        const {
            className,
            value,
            fontOptions,
            fontOptionsHover,
            onChange
        } = this.props;

        const {
            lastLevel
        } = this.state;

        let classes = classnames(
            'maxi-fontlevel-control',
            className
        );

        const onChangeValue = value => {
            saveOldTypography(value);
            let fontOptResponse = {};
            let fontOptResponseHover = {};
            if (!isEmpty(this.state[value])) {
                fontOptResponse = this.state[value];
                fontOptResponseHover = this.state[`${value}Hover`];
            }
            else if (!isNil(fontOptions)) {
                const oldFontOptions = typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions);
                fontOptResponse.label = oldFontOptions.label;
                Object.assign(fontOptResponse, DefaultTypography[value]);
                fontOptResponseHover = JSON.parse(getDefaultProp(null, 'typographyHover'));
            }
            onChange(value, JSON.stringify(fontOptResponse), JSON.stringify(fontOptResponseHover))
        }

        const saveOldTypography = value => {
            this.setState({
                [lastLevel]: typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions),
                [`${lastLevel}Hover`]: typeof fontOptionsHover === 'object' ? fontOptionsHover : JSON.parse(fontOptionsHover),
                lastLevel: value
            })
        }

        return (
            <div className={classes}>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'p'}
                    onClick={() => onChangeValue('p')}
                >
                    P
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h1'}
                    onClick={() => onChangeValue('h1')}
                >
                    H1
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h2'}
                    onClick={() => onChangeValue('h2')}
                >
                    H2
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h3'}
                    onClick={() => onChangeValue('h3')}
                >
                    H3
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h4'}
                    onClick={() => onChangeValue('h4')}
                >
                    H4
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h5'}
                    onClick={() => onChangeValue('h5')}
                >
                    H5
                </Button>
                <Button
                    className="maxi-fontlevel-control__button"
                    aria-pressed={value === 'h6'}
                    onClick={() => onChangeValue('h6')}
                >
                    H6
                </Button>
            </div>
        )
    }
}