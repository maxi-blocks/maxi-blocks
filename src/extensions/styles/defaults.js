export const size = {
    "label": "Size",
    "general": {
        "max-widthUnit": "px",
        "max-width": "",
        "widthUnit": "em",
        "width": "",
        "min-widthUnit": "px",
        "min-width": "",
        "max-heightUnit": "px",
        "max-height": "",
        "heightUnit": "em",
        "height": "",
        "min-heightUnit": "px",
        "min-height": ""
    }
};

export const background = {
    "label": "Background",
    "backgroundOptions": [
        {
            "imageOptions": {
                "mediaID": "",
                "mediaURL": ""
            },
            "sizeSettings": {
                "size": "cover",
                "widthUnit": "%",
                "width": 100,
                "heightUnit": "%",
                "height": 100
            },
            "repeat": "no-repeat",
            "positionOptions": {
                "position": "center center",
                "widthUnit": "%",
                "width": 0,
                "heightUnit": "%",
                "height": 0
            },
            "origin": "padding-box",
            "clip": "border-box",
            "attachment": "scroll"
        }
    ],
    "colorOptions": {
        "color": "",
        "defultColor": "",
        "gradient": "",
        "defaultGradient": "",
        "gradientAboveBackground": false
    }
};

export const boxShadow = {
    "label": "Box Shadow",
    "shadowColor": "#ffffff",
    "defaultShadowColor": "#ffffff",
    "shadowHorizontal": 0,
    "shadowVertical": 0,
    "shadowBlur": 0,
    "shadowSpread": 0
}

export const typography = {
    "label": "Typography",
    "font": "Roboto",
    "options": {
        "100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf",
        "100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf",
        "300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf",
        "300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf",
        "400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
        "italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf",
        "500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf",
        "500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf",
        "700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
        "700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf",
        "900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf",
        "900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"
    },
    "general": {
        "color": "#9b9b9b",
        "text-shadow": "none",
        "text-align": "left"
    },
    "desktop": {
        "font-sizeUnit": "px",
        "font-size": 16,
        "line-heightUnit": "px",
        "line-height": 26,
        "letter-spacingUnit": "px",
        "letter-spacing": 0,
        "font-weight": 400,
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    },
    "tablet": {
        "font-sizeUnit": "px",
        "font-size": 16,
        "line-heightUnit": "px",
        "line-height": 26,
        "letter-spacingUnit": "px",
        "letter-spacing": 0,
        "font-weight": 400,
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    },
    "mobile": {
        "font-sizeUnit": "px",
        "font-size": 26,
        "line-heightUnit": "px",
        "line-height": 26,
        "letter-spacingUnit": "px",
        "letter-spacing": 0,
        "font-weight": 400,
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    }
}

export const border = {
    "label": "Border",
    "defaultBorderColor": "#ffffff",
    "general": {
        "border-color": "#ffffff",
        "border-style": "solid"
    },
    "borderWidth": {
        "label": "Border width",
        "unit": "px",
        "max": 1000,
        "desktop": {
            "border-top-width": 0,
            "border-right-width": 0,
            "border-bottom-width": 0,
            "border-left-width": 0,
            "sync": true
        },
        "tablet": {
            "border-top-width": 0,
            "border-right-width": 0,
            "border-bottom-width": 0,
            "border-left-width": 0,
            "sync": true
        },
        "mobile": {
            "border-top-width": 0,
            "border-right-width": 0,
            "border-bottom-width": 0,
            "border-left-width": 0,
            "sync": true
        }
    },
    "borderRadius": {
        "label": "Border radius",
        "unit": "px",
        "max": 1000,
        "desktop": {
            "border-top-left-radius": 0,
            "border-top-right-radius": 0,
            "border-bottom-right-radius": 0,
            "border-bottom-left-radius": 0,
            "sync": true
        },
        "tablet": {
            "border-top-left-radius": 0,
            "border-top-right-radius": 0,
            "border-bottom-right-radius": 0,
            "border-bottom-left-radius": 0,
            "sync": true
        },
        "mobile": {
            "border-top-left-radius": 0,
            "border-top-right-radius": 0,
            "border-bottom-right-radius": 0,
            "border-bottom-left-radius": 0,
            "sync": true
        }
    }
};

export const margin = {
    "label": "Margin",
    "min": "none",
    "unit": "px",
    "desktop": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    },
    "tablet": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    },
    "mobile": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    }
};

export const padding = {
    "label": "Padding",
    "unit": "px",
    "desktop": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    },
    "tablet": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    },
    "mobile": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    }
};

export const cropOptions = {
    "image": {
        "source_url": "",
        "width": "",
        "height": "",
    },
    "crop": {
        "unit": "",
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "scale": 100
    }
}

export const backgroundHover = {
    "label": "Background",
    "backgroundOptions": [
        {
            "imageOptions": {
                "mediaID": "",
                "mediaURL": ""
            },
            "sizeSettings": {
                "size": "cover",
                "widthUnit": "%",
                "width": 100,
                "heightUnit": "%",
                "height": 100
            },
            "repeat": "no-repeat",
            "positionOptions": {
                "position": "center center",
                "widthUnit": "%",
                "width": 0,
                "heightUnit": "%",
                "height": 0
            },
            "origin": "padding-box",
            "clip": "border-box",
            "attachment": "scroll"
        }
    ],
    "colorOptions": {
        "color": "",
        "defultColor": "",
        "gradient": "",
        "defaultGradient": "",
        "gradientAboveBackground": false
    }
};

export const boxShadowHover = {
    "label": "Box Shadow",
    "shadowColor": "#ffffff",
    "defaultShadowColor": "#ffffff",
    "shadowHorizontal": "",
    "shadowVertical": "",
    "shadowBlur": "",
    "shadowSpread": ""
}

export const typographyHover = {
    "label": "Button text",
    "font": "Roboto",
    "options": {
        "100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf",
        "100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf",
        "300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf",
        "300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf",
        "400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
        "italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf",
        "500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf",
        "500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf",
        "700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
        "700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf",
        "900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf",
        "900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"
    },
    "general": {
        "color": "",
        "text-shadow": "none",
        "text-align": ""
    },
    "desktop": {
        "font-sizeUnit": "px",
        "font-size": "",
        "line-heightUnit": "px",
        "line-height": "",
        "letter-spacingUnit": "px",
        "letter-spacing": "",
        "font-weight": "",
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    },
    "tablet": {
        "font-sizeUnit": "px",
        "font-size": "",
        "line-heightUnit": "px",
        "line-height": "",
        "letter-spacingUnit": "px",
        "letter-spacing": "",
        "font-weight": "",
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    },
    "mobile": {
        "font-sizeUnit": "px",
        "font-size": "",
        "line-heightUnit": "px",
        "line-height": "",
        "letter-spacingUnit": "px",
        "letter-spacing": "",
        "font-weight": "",
        "text-transform": "none",
        "font-style": "normal",
        "text-decoration": "none"
    }
}

export const borderHover = {
    "label": "Border",
    "defaultBorderColor": "",
    "general": {
        "border-color": "",
        "border-style": ""
    },
    "borderWidth": {
        "label": "Border width",
        "unit": "px",
        "max": 1000,
        "desktop": {
            "border-top-width": "",
            "border-right-width": "",
            "border-bottom-width": "",
            "border-left-width": "",
            "sync": true
        },
        "tablet": {
            "border-top-width": "",
            "border-right-width": "",
            "border-bottom-width": "",
            "border-left-width": "",
            "sync": true
        },
        "mobile": {
            "border-top-width": "",
            "border-right-width": "",
            "border-bottom-width": "",
            "border-left-width": "",
            "sync": true
        }
    },
    "borderRadius": {
        "label": "Border radius",
        "unit": "px",
        "max": 1000,
        "desktop": {
            "border-top-left-radius": "",
            "border-top-right-radius": "",
            "border-bottom-right-radius": "",
            "border-bottom-left-radius": "",
            "sync": true
        },
        "tablet": {
            "border-top-left-radius": "",
            "border-top-right-radius": "",
            "border-bottom-right-radius": "",
            "border-bottom-left-radius": "",
            "sync": true
        },
        "mobile": {
            "border-top-left-radius": "",
            "border-top-right-radius": "",
            "border-bottom-right-radius": "",
            "border-bottom-left-radius": "",
            "sync": true
        }
    }
};

export const marginHover = {
    "label": "Margin",
    "min": "none",
    "unit": "px",
    "desktop": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    },
    "tablet": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    },
    "mobile": {
        "margin-top": "",
        "margin-right": "",
        "margin-bottom": "",
        "margin-left": "",
        "sync": true
    }
};

export const paddingHover = {
    "label": "Padding",
    "unit": "px",
    "desktop": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    },
    "tablet": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    },
    "mobile": {
        "padding-top": "",
        "padding-right": "",
        "padding-bottom": "",
        "padding-left": "",
        "sync": true
    }
};