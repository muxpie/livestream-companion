import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';

export const themeOptions = {
  direction: 'ltr',
  breakpoints: {
    keys: [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    unit: 'px',
  },
  components: {
    MuiCssBaseline: {
      defaultProps: {
        enableColorScheme: true,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {},
      variants: [
        {
          props: {
            variant: 'code',
          },
        },
        {
          props: {
            variant: 'codeOutlined',
          },
        },
        {
          props: {
            variant: 'link',
          },
        },
      ],
    },
    MuiIconButton: {
      variants: [
        {
          props: {
            color: 'primary',
          },
        },
      ],
    },
    MuiMenu: {
      styleOverrides: {},
    },
    MuiPopover: {
      styleOverrides: {},
    },
    MuiDivider: {
      styleOverrides: {},
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          '&.MuiTypography-body1 > svg': {
            marginTop: 2,
          },
          '& svg:last-child': {
            marginLeft: 2,
          },
        },
      },
      variants: [
        {
          props: {
            color: 'primary',
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {},
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {},
    },
    /*
    MuiSelect: {
      defaultProps: {
        IconComponent: {
          type: {},
          compare: null,
        },
      },
      styleOverrides: {
        iconFilled: {
          top: 'calc(50% - .25em)',
        },
      },
    },
    */
    MuiTab: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiPaper: {
      styleOverrides: {},
    },
    MuiTableCell: {
      styleOverrides: {},
    },
    MuiToggleButtonGroup: {
      styleOverrides: {},
    },
    MuiToggleButton: {
      styleOverrides: {},
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          padding: '6px 12px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 32,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              transform: 'translateX(11px)',
              color: '#fff',
            },
          },
        },
        switchBase: {
          height: 20,
          width: 20,
          padding: 0,
          color: '#fff',
          '&.Mui-checked + .MuiSwitch-track': {
            opacity: 1,
          },
        },
        thumb: {
          flexShrink: 0,
          width: '14px',
          height: '14px',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {},
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      '50': '#F0F7FF',
      '100': '#C2E0FF',
      '200': '#99CCF3',
      '300': '#66B2FF',
      '400': '#3399FF',
      '500': '#007FFF',
      '600': '#0072E5',
      '700': '#0059B2',
      '800': '#004C99',
      '900': '#003A75',
      main: '#3399FF',
      light: '#66B2FF',
      dark: '#0059B2',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      '50': '#F3F6F9',
      '100': '#E5EAF2',
      '200': '#DAE2ED',
      '300': '#C7D0DD',
      '400': '#B0B8C4',
      '500': '#9DA8B7',
      '600': '#6B7A90',
      '700': '#434D5B',
      '800': '#303740',
      '900': '#1C2025',
      main: '#1F262E',
      contrastText: '#2F3A46',
      light: 'rgb(75, 81, 87)',
      dark: 'rgb(21, 26, 32)',
    },
    divider: 'rgba(218, 224, 231, 0.08)',
    primaryDark: {
      '50': '#EAEDF1',
      '100': '#DAE0E7',
      '200': '#ACBAC8',
      '300': '#7B91A7',
      '400': '#4B5E71',
      '500': '#3B4A59',
      '600': '#2F3A46',
      '700': '#1F262E',
      '800': '#141A1F',
      '900': '#101418',
      main: '#7B91A7',
    },
    background: {
      default: '#141A1F',
      paper: '#101418',
    },
    common: {
      black: '#0B0D0E',
      white: '#fff',
    },
    text: {
      primary: '#fff',
      secondary: '#B0B8C4',
      tertiary: '#B0B8C4',
      disabled: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.5)',
    },
    grey: {
      '50': '#F3F6F9',
      '100': '#E5EAF2',
      '200': '#DAE2ED',
      '300': '#C7D0DD',
      '400': '#B0B8C4',
      '500': '#9DA8B7',
      '600': '#6B7A90',
      '700': '#434D5B',
      '800': '#303740',
      '900': '#1C2025',
      main: '#434D5B',
      contrastText: '#6B7A90',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    },
    error: {
      '50': '#FFF0F1',
      '100': '#FFDBDE',
      '200': '#FFBDC2',
      '300': '#FF99A2',
      '400': '#FF7A86',
      '500': '#FF505F',
      '600': '#EB0014',
      '700': '#C70011',
      '800': '#94000D',
      '900': '#570007',
      main: '#EB0014',
      light: '#FF99A2',
      dark: '#C70011',
      contrastText: '#fff',
    },
    success: {
      '50': '#E9FBF0',
      '100': '#C6F6D9',
      '200': '#9AEFBC',
      '300': '#6AE79C',
      '400': '#3EE07F',
      '500': '#21CC66',
      '600': '#1DB45A',
      '700': '#1AA251',
      '800': '#178D46',
      '900': '#0F5C2E',
      main: '#1DB45A',
      light: '#6AE79C',
      dark: '#1AA251',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    warning: {
      '50': '#FFF9EB',
      '100': '#FFF3C1',
      '200': '#FFECA1',
      '300': '#FFDC48',
      '400': '#F4C000',
      '500': '#DEA500',
      '600': '#D18E00',
      '700': '#AB6800',
      '800': '#8C5800',
      '900': '#5A3600',
      main: '#DEA500',
      light: '#FFDC48',
      dark: '#AB6800',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    gradients: {
      lightGrayRadio: 'radial-gradient(50% 50% at 50% 50%, #F0F7FF 0%, rgba(240, 247, 255, 0.05) 100%)',
      stylizedRadio: 'linear-gradient(rgba(0 0 0 / 0.1), rgba(0 0 0 / 0.1)), linear-gradient(254.86deg, rgba(0, 58, 117, 0.18) 0%, rgba(11, 13, 14, 0.3) 49.98%, rgba(0, 76, 153, 0.21) 100.95%)',
      linearSubtle: 'linear-gradient(to top right, rgba(0, 58, 117, 0.1) 40%, rgba(20, 26, 31, 0.2) 100%)',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    action: {
      active: '#fff',
      hover: 'rgba(255, 255, 255, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 0.16,
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(255, 255, 255, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    fontFamilyCode: 'Menlo,Consolas,"Droid Sans Mono",monospace',
    fontFamilyTagline: '"General Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    fontFamilySystem: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    fontWeightSemiBold: 600,
    fontWeightExtraBold: 800,
    h1: {
      fontFamily: '"General Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: 'clamp(2.5rem, 1.125rem + 3.5vw, 3.5em)',
      fontWeight: 600,
      lineHeight: 1.1142857142857143,
      letterSpacing: -0.2,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    h2: {
      fontFamily: '"General Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: 'clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.2222222222222223,
      letterSpacing: -0.2,
      color: '#E5EAF2',
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    h3: {
      fontFamily: '"General Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: '2.25rem',
      lineHeight: 1.2222222222222223,
      letterSpacing: 0.2,
      fontWeight: 400,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    h4: {
      fontFamily: '"General Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: '1.875rem',
      lineHeight: 1.5,
      letterSpacing: 0.2,
      fontWeight: 400,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    h5: {
      fontSize: '1.5rem',
      lineHeight: 1.5,
      letterSpacing: 0.1,
      color: '#66B2FF',
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 400,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 500,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    button: {
      textTransform: 'initial',
      fontWeight: 700,
      letterSpacing: 0,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: '0.875rem',
      lineHeight: 1.75,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.3333333333333333,
      letterSpacing: 0,
      fontWeight: 500,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: 0,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 400,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: 0,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 400,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    caption: {
      display: 'inline-block',
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: 0,
      fontWeight: 700,
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    allVariants: {
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    htmlFontSize: 16,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    subtitle2: {
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    overline: {
      fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      textTransform: 'uppercase',
      scrollMarginTop: 'calc(var(--MuiDocs-header-height) + 32px)',
    },
    inherit: {
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
    },
  },
  props: {
    MuiBadge: {
      overlap: 'rectangular',
    },
  },
  unstable_sxConfig: {
    border: {
      themeKey: 'borders',
    },
    borderTop: {
      themeKey: 'borders',
    },
    borderRight: {
      themeKey: 'borders',
    },
    borderBottom: {
      themeKey: 'borders',
    },
    borderLeft: {
      themeKey: 'borders',
    },
    borderColor: {
      themeKey: 'palette',
    },
    borderTopColor: {
      themeKey: 'palette',
    },
    borderRightColor: {
      themeKey: 'palette',
    },
    borderBottomColor: {
      themeKey: 'palette',
    },
    borderLeftColor: {
      themeKey: 'palette',
    },
    borderRadius: {
      themeKey: 'shape.borderRadius',
    },
    color: {
      themeKey: 'palette',
    },
    bgcolor: {
      themeKey: 'palette',
      cssProperty: 'backgroundColor',
    },
    backgroundColor: {
      themeKey: 'palette',
    },
    p: {},
    pt: {},
    pr: {},
    pb: {},
    pl: {},
    px: {},
    py: {},
    padding: {},
    paddingTop: {},
    paddingRight: {},
    paddingBottom: {},
    paddingLeft: {},
    paddingX: {},
    paddingY: {},
    paddingInline: {},
    paddingInlineStart: {},
    paddingInlineEnd: {},
    paddingBlock: {},
    paddingBlockStart: {},
    paddingBlockEnd: {},
    m: {},
    mt: {},
    mr: {},
    mb: {},
    ml: {},
    mx: {},
    my: {},
    margin: {},
    marginTop: {},
    marginRight: {},
    marginBottom: {},
    marginLeft: {},
    marginX: {},
    marginY: {},
    marginInline: {},
    marginInlineStart: {},
    marginInlineEnd: {},
    marginBlock: {},
    marginBlockStart: {},
    marginBlockEnd: {},
    displayPrint: {
      cssProperty: false,
    },
    display: {},
    overflow: {},
    textOverflow: {},
    visibility: {},
    whiteSpace: {},
    flexBasis: {},
    flexDirection: {},
    flexWrap: {},
    justifyContent: {},
    alignItems: {},
    alignContent: {},
    order: {},
    flex: {},
    flexGrow: {},
    flexShrink: {},
    alignSelf: {},
    justifyItems: {},
    justifySelf: {},
    gap: {},
    rowGap: {},
    columnGap: {},
    gridColumn: {},
    gridRow: {},
    gridAutoFlow: {},
    gridAutoColumns: {},
    gridAutoRows: {},
    gridTemplateColumns: {},
    gridTemplateRows: {},
    gridTemplateAreas: {},
    gridArea: {},
    position: {},
    zIndex: {
      themeKey: 'zIndex',
    },
    top: {},
    right: {},
    bottom: {},
    left: {},
    boxShadow: {
      themeKey: 'shadows',
    },
    width: {},
    maxWidth: {},
    minWidth: {},
    height: {},
    maxHeight: {},
    minHeight: {},
    boxSizing: {},
    fontFamily: {
      themeKey: 'typography',
    },
    fontSize: {
      themeKey: 'typography',
    },
    fontStyle: {
      themeKey: 'typography',
    },
    fontWeight: {
      themeKey: 'typography',
    },
    letterSpacing: {},
    textTransform: {},
    lineHeight: {},
    textAlign: {},
    typography: {
      cssProperty: false,
      themeKey: 'typography',
    },
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width:0px)': {
        '@media (orientation: landscape)': {
          minHeight: 48,
        },
      },
      '@media (min-width:600px)': {
        minHeight: 64,
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

const theme = createTheme(themeOptions);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
