const {
  __
} = wp.i18n;

import FontPopover from '../../font-popover/index';

export const titleTypographyAttributes = {

}

export const TitleTypography = ( props ) => {
  const {
    titleFontFamily = props.attributes.titleFontFamily,
    fontSizeTitleUnit = props.attributes.fontSizeTitleUnit,
    fontSizeTitle = props.attributes.fontSizeTitle,
    setAttributes,
  } = props;

  return (
    <FontPopover
      title={__('Title Typography', 'maxi-blocks')}
      font={titleFontFamily}
      onFontFamilyChange={value => { setAttributes({ titleFontFamily: value }); }}
      fontSizeUnit={fontSizeTitleUnit}
      onFontSizeUnitChange={value => setAttributes({ fontSizeTitleUnit: value })}
      fontSize={fontSizeTitle}
      onFontSizeChange={value => setAttributes({ fontSizeTitle: value })}
      classNamePopover={'maxi-font-family-selector-popover'}
    />
  )
}
