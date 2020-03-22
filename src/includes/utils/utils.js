/**
 * Get font families from GFonts JSON file
 * 
 * @param {JSON} data Recibes JSON data with the fonts variants and properties
 * @returns {array} Options ready for React-Select 
 */

export const getFontFamilyOptions = (data) => {
    let options = [];
    let items = data.items;
    items.map(item => {
        options.push({
            label: item.family,
            value: item.family,
            files: item.files
        });
    });
    return options;
}

/**
 * Loads the font on background using JS FontFace API
 * 
 * @param {string} font Name of the selected font
 * @param {obj} files Different variations of the font
 */

export const loadFonts = (font, files) => {
    // Avoid reloading fonts already load
    for (var fontFace of document.fonts.values()) {
        if ( fontFace.family === font ) {
            return;
        }
    }
    if (document.fonts) {   // FontFace API
        Object.entries(files).map(variant => {
            const style = getFontStyle(variant[0]);
            const fontLoad = new FontFace(font, `url(${variant[1]})`, style);
            document.fonts.add(fontLoad);
            fontLoad.loaded.catch((err) => {
                console.info(__(`Font hasn't been able to download: ${err}`))
            })
        })
    }
}

/**
 * Prepares the styles to be ready for JS FontFace API
 * 
 * @param {obj} variant Concrete variant of the font with name and url
 * @returns {obj} Styles options for load the font on FontFace API
 */

const getFontStyle = (variant) => {
    const styles = variant.split(/([0-9]+)/).filter(Boolean);
    if (styles.length > 1) {
        return {
            style: `${styles[1]}`,
            weight: `${styles[0]}`
        };
    } else {
        const regExp = new RegExp('([0-9]+)', 'gm');
        if (styles[0].search(regExp) >= 0) {  // number
            return { weight: `${styles[0]}` };
        } else {
            return { style: `${styles[0]}` };
        }
    }
}

/**
 * Loads the saved fonts everytime the block is load. 
 * 
 * @param {array} blockFonts List with the saved fonts on the block
 */

export const fontFamilyinit = ( fontsEx, fonts ) => {
    const fontFamilyList = getFontFamilyOptions( fonts );
    fontsEx.map ( selectFont => {
        fontFamilyList.forEach( e => {
            if ( e.label === selectFont ) {
                loadFonts ( e.label, e.files );
            }
        })
    })
}