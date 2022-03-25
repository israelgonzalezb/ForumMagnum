import type { PartialDeep } from 'type-fest'
import deepmerge from 'deepmerge';
// eslint-disable-next-line no-restricted-imports
import type { Color as MuiColorShades } from '@material-ui/core';

//
// All About the Themes, the Theme Palette and Colors
// ==================================================
// There are two themes active at a time: the user theme and the site theme. The
// user theme is a user-configurable preference representing whether to use
// light mode, dark mode, etc. The site theme represents the styling differences
// between LessWrong, EA Forum, Alignment Forum, Progress Studies Forum, and
// whatever other sites share the codebase.
//
// The palette is constructed in two parts: the shade palette
// (ThemeShadePalette) and the component palette (ThemeComponentPalette). Colors
// in the component palette may depend on colors/functions in the shade palette
// (but not vise versa). These are merged together to create the overall theme.
//
// Components Should Use the Palette
// =================================
// When writing styles for UI components, use colors that come from the palette,
// rather than writing the color directly, eg like this:
//
//   const styles = (theme: ThemeType): JssStyles => ({
//     normalText: {
//       color: theme.palette.text.normal,
//     },
//     notice: {
//       border: theme.palette.border.normal,
//       background: theme.palette.panelBackground.default,
//     },
//   });
//
// Not like this:
//
//   const styles = (theme: ThemeType): JssStyles => ({
//     normalText: {
//       color: "rgba(0,0,0,.87)", // Bad: Will be black-on-black in dark mode
//     },
//     notice: {
//       border: "rgba(0,0,0,.1)", // Bad: Border will be black-on-black
//       background: "white", // Bad: Text will be white-on-white
//     },
//   });
//
// This is enforced by a unit test, which will provide a theme with blanked-out
// palette colors and scan JSS styles for color words. Following this convention
// should prevent almost all problems with dark-on-dark and light-on-light text.
// However tooltips and buttons are occasionally inverted relative to the base
// theme, and aesthetic issues may appear in dark mode that don't appear in
// light mode and vise versa, so try to check your UI in both.
//
// If you can't find the color you want, go ahead and add it! Having to add
// colors to the palette is meant to make sure you give a little thought to
// themes and dark mode, not to restrict you to approved colors. First add your
// color to ThemeType in themeType.ts. This will create type errors in all the
// other places you need to add the color (currently defaultPalette.ts and
// darkMode.ts).
//
// Text Color and Alpha Versus Shade
// =================================
// When you've got dark text on a white background, there are two ways to adjust
// its contrast: either choose a shade of grey, or make it black and choose an
// opacity (aka alpha). In general, opacity is the better option, because it
// maintains the ~same contrast ratio if you put you put the same text color
// on a colored background. The same applies for dark-mode themes, where it's
// better to use white-and-transparent rather than grey.
//
// Don't overuse pure-black or pure-white text colors. Think of these as
// bolded colors, not as defaults.
//
// Text should have a minimum contrast ratio of 4.5:1 ("AA") and ideally 7:1
// ("AAA"). You can check the contrast ratio of your text in the Chrome
// development tools. In the Elements tab, find the `color` attribute on an
// element with text, click on the swatch next to it, and the contrast ratio
// should be on the color-picker dialog that appears.
//
// Notational Conventions
// ======================
// CSS has a number of different ways to specify colors. For the sake of
// consistency, we only use a subset of them.
//
// Do Use:
//   The specific color words "white", "black" and "transparent"
//   Three or six hex digits: #rrggbb
//   RGB 0-255 with alpha 0-1: "rgba(r,g,b,a)",
// Avoid:
//   HSL, HSLA, HWB, Lab, and LCH color specifiers, eg "hsl(60 100% 50%)"
//   Functional notation without commas, eg "rgba(0 0 0 / 10%)"
//   RGB percentages, eg "rgba(50%,25%,25%,1)"
//   Omitted alpha: eg "rgb(0,0,100)"
//   Importing color constants from @material-ui/core/colors or other libraries
//   Color keywords other than white, black, and transparent: eg "red", "grey", "wheat"
//
//

export const grey = {
  // Exactly matches @material-ui/core/colors/grey
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#d5d5d5',
  A200: '#aaaaaa',
  A400: '#303030',
  A700: '#616161',
  
  // Greyscale colors not in the MUI palette
  0: "white",
  1000: "black",
  
  10: '#fefefe',
  20: '#fdfdfd',
  25: '#fcfcfc',
  30: '#fbfbfb',
  40: '#f8f8f8',
  110: "#f3f3f3",
  120: '#f2f2f2',
  140: "#f0f0f0",
  250: "#e8e8e8",
  315: "#d4d4d4",
  320: "#d9d9d9",
  340: "#d0d0d0",
  410: "#b3b3b3",
  650: '#808080',
}

export const defaultShadePalette = (): ThemeShadePalette => {
  const greyAlpha = (alpha: number) => `rgba(0,0,0,${alpha})`;
  return {
    grey,
    greyAlpha,
    boxShadowColor: (alpha: number) => greyAlpha(alpha),
    greyBorder: (thickness: string, alpha: number) => `${thickness} solid ${greyAlpha(alpha)}`,
    
    fonts: {
      // Every site theme overrides these
      sansSerifStack: "sans-serif",
      serifStack: "serif",
    },
  }
}

export const defaultComponentPalette = (shades: ThemeShadePalette): ThemeComponentPalette => ({
  text: {
    primary: shades.greyAlpha(.87),
    secondary: shades.greyAlpha(.54),
    normal: shades.greyAlpha(.87),
    maxIntensity: shades.greyAlpha(1.0),
    slightlyIntense: shades.greyAlpha(.92),
    slightlyIntense2: shades.greyAlpha(.9),
    slightlyDim: shades.greyAlpha(.8),
    slightlyDim2: shades.greyAlpha(.7),
    dim: shades.greyAlpha(.5),
    dim2: shades.grey[800],
    dim3: shades.grey[600],
    dim4: shades.grey[500],
    dim700: shades.grey[700],
    dim40: shades.greyAlpha(.4),
    dim45: shades.greyAlpha(.45),
    dim55: shades.greyAlpha(.55),
    dim60: shades.greyAlpha(.6),
    grey: shades.grey[650],
    spoilerBlockNotice: "white",
    notificationCount: shades.greyAlpha(0.6),
    notificationLabel: shades.greyAlpha(.66),
    eventType: "#c0a688",
    tooltipText: "white",
    negativeKarmaRed: "#ff8a80",
    moderationGuidelinesEasygoing: 'rgba(100, 169, 105, 0.9)',
    moderationGuidelinesNormEnforcing: '#2B6A99',
    moderationGuidelinesReignOfTerror: 'rgba(179,90,49,.8)',
    charsAdded: "#008800",
    charsRemoved: "#880000",
    invertedBackgroundText: "white",
    invertedBackgroundText2: "rgba(255,255,255,0.7)",
    invertedBackgroundText3: "rgba(255,255,255,0.5)",
    error: "#9b5e5e",
    error2: "#E04E4B",
    sequenceIsDraft: "rgba(100, 169, 105, 0.9)",
    sequenceTitlePlaceholder: "rgba(255,255,255,.5)",
  },
  link: {
    unmarked: shades.greyAlpha(.87),
    dim: shades.greyAlpha(.5),
    dim2: shades.grey[600],
    dim3: shades.greyAlpha(.4),
    grey800: shades.grey[800],
    tocLink: shades.grey[600],
    tocLinkHighlighted: shades.grey[1000],
  },
  linkHover: {
    dim: shades.greyAlpha(.3),
  },
  icon: {
    normal: shades.greyAlpha(.87),
    maxIntensity: shades.greyAlpha(1.0),
    slightlyDim: shades.greyAlpha(.8),
    slightlyDim2: shades.greyAlpha(.75),
    slightlyDim3: shades.greyAlpha(.7),
    slightlyDim4: shades.greyAlpha(.6),
    dim: shades.greyAlpha(.5),
    dim2: shades.greyAlpha(.4),
    dim3: shades.grey[400],
    dim4: shades.grey[500],
    dim5: shades.greyAlpha(.3),
    dim6: shades.greyAlpha(.2),
    dim55: shades.greyAlpha(.55),
    dim600: shades.grey[600],
    dim700: shades.grey[700],
    tooltipUserMetric: "rgba(255,255,255,.8)",
    loadingDots: shades.greyAlpha(.55),
    loadingDotsAlternate: shades.grey[0],
    horizRuleDots: shades.greyAlpha(.26),
    greenCheckmark: "#4caf50",
    onTooltip: "white",
    topAuthor: shades.grey[340],
    navigationSidebarIcon: shades.greyAlpha(1.0),
    
    commentsBubble: {
      commentCount: "white",
      noUnread: shades.greyAlpha(.22),
      newPromoted: "rgb(160, 225, 165)",
    },
  },
  border: {
    normal: shades.greyBorder("1px", .2),
    itemSeparatorBottom: shades.greyBorder("2px", .05),
    slightlyFaint: shades.greyBorder("1px", .15),
    slightlyIntense: shades.greyBorder("1px", .25),
    slightlyIntense2: shades.greyBorder("1px", .3),
    slightlyIntense3: shades.greyBorder("1px", .4),
    intense: shades.greyBorder("2px", .5),
    faint: shades.greyBorder("1px", .1),
    extraFaint: shades.greyBorder("1px", .08),
    grey300: `1px solid ${shades.grey[300]}`,
    grey400: `1px solid ${shades.grey[400]}`,
    maxIntensity: shades.greyBorder("1px", 1.0),
    tableHeadingDivider: shades.greyBorder("2px", 1.0),
    table: `1px double ${shades.grey[410]}`,
    tableCell: `1px double ${shades.grey[320]}`,
    transparent: shades.greyBorder("1px", 0.0),
    emailHR: "1px solid #aaa",
    sunshineNewUsersInfoHR: "1px solid #ccc",
    appBarSubtitleDivider: `1px solid ${shades.grey[400]}`,
    commentBorder: "1px solid rgba(72,94,144,0.16)",
    answerBorder: "2px solid rgba(72,94,144,0.16)",
    tooltipHR: "solid 1px rgba(255,255,255,.2)",
  },
  background: {
    default: shades.grey[40],
    paper: shades.grey[0], //Used by MUI
    pageActiveAreaBackground: shades.grey[0],
    diffInserted: "#d4ead4",
    diffDeleted: "#f0d3d3",
    usersListItem: shades.greyAlpha(.05),
  },
  panelBackground: {
    default: shades.grey[0],
    translucent: "rgba(255,255,255,.87)",
    translucent2: "rgba(255,255,255,.8)",
    hoverHighlightGrey: shades.greyAlpha(.1),
    postsItemHover: shades.grey[50],
    formErrors: shades.greyAlpha(0.25),
    darken02: shades.greyAlpha(.02),
    darken03: shades.greyAlpha(.03),
    darken04: shades.greyAlpha(.04),
    darken05: shades.greyAlpha(.05),
    darken08: shades.greyAlpha(.08),
    darken10: shades.greyAlpha(.1),
    darken15: shades.greyAlpha(.15),
    darken20: shades.greyAlpha(.2),
    darken25: shades.greyAlpha(.25),
    darken40: shades.greyAlpha(.4),
    
    adminHomeRecentLogins: "rgba(50,100,50,.1)",
    adminHomeAllUsers: "rgba(100,50,50,.1)",
    deletedComment: "#ffefef",
    newCommentFormModerationGuidelines: shades.greyAlpha(.07),
    commentNodeEven: shades.grey[120],
    commentNodeOdd: shades.grey[25],
    commentModeratorHat: "#5f9b651c",
    commentHighlightAnimation: shades.grey[300],
    postsItemExpandedComments: shades.grey[50],
    metaculusBackground: "#2c3947",
    spoilerBlock: "black",
    revealedSpoilerBlock: shades.greyAlpha(.12),
    tableHeading: shades.grey[50],
    notificationMenuTabBar: shades.grey[100],
    recentDiscussionThread: shades.grey[20],
    tooltipBackground: "rgba(75,75,75,.94)",
    tenPercent: shades.greyAlpha(.1),
    sunshineReportedContent: "rgba(60,0,0,.08)",
    sunshineFlaggedUser: "rgba(150,0,0,.05)",
    sunshineNewPosts: "rgba(0,80,0,.08)",
    sunshineNewComments: "rgba(120,120,0,.08)",
    sunshineNewTags: "rgba(80,80,0,.08)",
    sunshineWarningHighlight: "rgba(255,50,0,.2)",
    mobileNavFooter: shades.grey[0],
    singleLineComment: shades.grey[140],
    singleLineCommentHovered: shades.grey[300],
    singleLineCommentOddHovered: shades.grey[110],
    sequenceImageGradient: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 42%, rgba(255, 255, 255, 0) 100%)',
    sequencesBanner: shades.greyAlpha(.5),
  },
  boxShadow: {
    default: `0 1px 5px ${shades.boxShadowColor(.025)}`,
    moreFocused: `0 1px 3px ${shades.boxShadowColor(.1)}`,
    faint: `0 1px 5px ${shades.boxShadowColor(.1)}`,
    
    notificationsDrawer: `${shades.boxShadowColor(.16)} 0px 3px 10px, ${shades.boxShadowColor(.23)} 0px 3px 10px`,
    appBar: `0 1px 1px ${shades.boxShadowColor(.05)}, 0 1px 1px ${shades.boxShadowColor(.05)}`,
    sequencesGridItemHover: `0 1px 3px ${shades.boxShadowColor(.1)}`,
    eventCard: `0 1px 3px ${shades.boxShadowColor(.1)}`,
    mozillaHubPreview: `0px 0px 10px ${shades.boxShadowColor(.1)}`,
    featuredResourcesCard: `0 4px 4px ${shades.boxShadowColor(.07)}`,
    spreadsheetPage1: `2px 0 2px -1px ${shades.boxShadowColor(.15)}`,
    spreadsheetPage2: `0 0 3px ${shades.boxShadowColor(.3)}`,
    collectionsCardHover: `0 0 3px ${shades.boxShadowColor(.1)}`,
    comment: `0 0 10px ${shades.boxShadowColor(.2)}`,
    sunshineSidebarHoverInfo: `-3px 0 5px 0px ${shades.boxShadowColor(.1)}`,
    sunshineSendMessage: `0 0 10px ${shades.boxShadowColor(.5)}`,
    lwCard: `0 0 10px ${shades.boxShadowColor(.2)}`,
    searchResults: `0 0 20px ${shades.boxShadowColor(.2)}`,
    recentDiscussionMeetupsPoke: `5px 5px 5px ${shades.boxShadowColor(.2)}`,
  },
  buttons: {
    hoverGrayHighlight: shades.greyAlpha(0.05),
    
    startReadingButtonBackground: shades.greyAlpha(0.05),
    recentDiscussionSubscribeButtonText: "white",
    featuredResourceCTAtext: "white",
    primaryDarkText: "white",
    feedExpandButton: {
      background: "white",
      plusSign: "#666",
      border: "1px solid #ddd",
    },
    notificationsBellOpen: {
      background: shades.greyAlpha(0.4),
      icon: shades.grey[0],
    },
  },
  tag: {
    background: shades.grey[200],
    border: `solid 1px ${shades.grey[200]}`,
    coreTagBorder: shades.greyBorder("1px", .12),
    text: shades.greyAlpha(.9),
    boxShadow: `1px 2px 5px ${shades.boxShadowColor(.2)}`,
    hollowTagBackground: shades.grey[0],
    addTagButtonBackground: shades.grey[300],
  },
  geosuggest: {
    dropdownBackground: "white",
    dropdownActiveBackground: "#267dc0",
    dropdownActiveText: "white",
    dropdownHoveredBackground: "#f5f5f5",
    dropdownActiveHoveredBackground: "#ccc",
  },
  header: {
    text: shades.greyAlpha(.87),
    background: shades.grey[30],
  },
  
  commentParentScrollerHover: shades.greyAlpha(.075),
  tocScrollbarColors: `rgba(255,255,255,0) ${shades.grey[300]}`,
  
  contrastText: shades.grey[0],
  event: '#2b6a99',
  group: '#588f27',
  individual: '#3f51b5',
  type: "light",
  
  primary: {
    main: "#5f9b65",
    dark: "#426c46",
    light: "#7faf83",
    contrastText: shades.grey[0],
  },
  secondary: {
    main: "#5f9b65",
    dark: "#426c46",
    light: "#7faf83",
    contrastText: shades.grey[0],
  },
  lwTertiary: {
    main: "#69886e",
    dark: "#21672b",
  },
  error: {
    main: "#bf360c",
    dark: "#852508",
    light: "#cb5e3c",
    contrastText: shades.grey[0],
  },
})