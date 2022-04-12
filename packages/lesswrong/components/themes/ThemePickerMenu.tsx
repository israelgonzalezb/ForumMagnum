import React, { useState } from 'react';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { ThemeMetadata, themeMetadata, getForumType, ThemeOptions } from '../../themes/themeNames';
import { ForumTypeString, allForumTypes, forumTypeSetting } from '../../lib/instanceSettings';
import { useSetTheme } from './useTheme';
import Divider from '@material-ui/core/Divider';
import Check from '@material-ui/icons/Check';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { useCookies } from 'react-cookie'

const styles = (theme: ThemeType): JssStyles => ({
  check: {
    width: 20,
    marginRight: 8,
  },
  notChecked: {
    width: 20,
    marginRight: 8,
  },
})

const removeStylesheetsMatching = (substring: string) => {
  const linkTags = document.getElementsByTagName("link");
  for (let i=0; i<linkTags.length; i++) {
    if (linkTags[i].getAttribute("rel") === "stylesheet") {
      const href = linkTags[i].getAttribute("href")
      if (href && href.indexOf(substring) >= 0) {
        linkTags[i].parentElement!.removeChild(linkTags[i]);
        break;
      }
    }
  }
}
const addStylesheet = (href: string, onFinish: (success: boolean)=>void) => {
  const styleNode = document.createElement("link");
  styleNode.setAttribute("rel", "stylesheet");
  styleNode.setAttribute("href", href);
  styleNode.onload = () => {
    onFinish(true);
  }
  styleNode.onerror = () => {
    onFinish(false);
  }
  document.head.appendChild(styleNode);
}

const THEME_COOKIE_NAME = "theme";

const ThemePickerMenu = ({children, classes}: {
  children: React.ReactNode,
  classes: ClassesType,
}) => {
  const [cookies, setCookie] = useCookies([THEME_COOKIE_NAME]);
  const { LWTooltip } = Components;
  const [currentThemeOptions, setCurrentThemeOptions] = useState((window as any)?.themeOptions as ThemeOptions);
  const setPageTheme = useSetTheme();
  
  const setTheme = async (themeOptions: ThemeOptions) => {
    setCurrentThemeOptions(themeOptions);
    if (JSON.stringify((window as any).themeOptions) !== JSON.stringify(themeOptions)) {
      const oldThemeOptions = (window as any).themeOptions;
      const serializedThemeOptions = JSON.stringify(themeOptions);
      (window as any).themeOptions = themeOptions;
      setPageTheme(themeOptions);
      setCookie(THEME_COOKIE_NAME, JSON.stringify(themeOptions));
      addStylesheet(`/allStyles?theme=${encodeURIComponent(serializedThemeOptions)}`, (success: boolean) => {
        if (success) {
          removeStylesheetsMatching(encodeURIComponent(JSON.stringify(oldThemeOptions)));
        }
      });
    }
  }
  
  const selectedForumTheme = getForumType(currentThemeOptions);
  
  const submenu = <Paper>
    {themeMetadata.map((themeMetadata: ThemeMetadata) =>
      <MenuItem key={themeMetadata.name} onClick={async (ev) => {
        await setTheme({
          ...currentThemeOptions,
          name: themeMetadata.name
        })
      }}>
        {currentThemeOptions?.name === themeMetadata.name
          ? <Check className={classes.check}/>
          : <div className={classes.notChecked}/>
        }
        {themeMetadata.label}
      </MenuItem>
    )}
    
    <Divider/>
    
    {allForumTypes.map((forumType: ForumTypeString) =>
      <MenuItem key={forumType} onClick={async (ev) => {
        await setTheme({
          ...currentThemeOptions,
          siteThemeOverride: {
            ...currentThemeOptions.siteThemeOverride,
            [forumTypeSetting.get()]: forumType
          },
        })
      }}>
        {(selectedForumTheme === forumType)
          ? <Check className={classes.check}/>
          : <div className={classes.notChecked}/>
        }
        {forumType}
      </MenuItem>
    )}
  </Paper>
  
  
  return <LWTooltip
    title={submenu}
    tooltip={false} clickable={true}
    inlineBlock={false}
    placement="left-start"
  >
    {children}
  </LWTooltip>
}


const ThemePickerMenuComponent = registerComponent('ThemePickerMenu', ThemePickerMenu, {styles});

declare global {
  interface ComponentTypes {
    ThemePickerMenu: typeof ThemePickerMenuComponent
  }
}