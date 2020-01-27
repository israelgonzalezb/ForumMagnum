import { registerComponent } from 'meteor/vulcan:core';
import React, { useCallback } from 'react';
import { useTracking } from "../../lib/analyticsEvents";

const AnalyticsTracker = ({eventType, eventProps, children, captureOnClick=true, captureOnMount, skip}: {
  eventType: string,
  eventProps?: Record<string,any>,
  children?: any,
  captureOnClick?: boolean,
  captureOnMount?: ((eventData:Record<string,any>)=>boolean)|boolean,
  skip?: boolean,
}) => {
  const { captureEvent } = useTracking({eventType, eventProps, captureOnMount})
  const handleClick = useCallback((e) => {
    !skip && captureOnClick && captureEvent(`${eventType}Clicked`,
        {...eventProps, buttonPressed: e.button})
  }, [eventProps, captureEvent, skip, captureOnClick, eventType])

  return (
    <span onMouseDown={handleClick}>
      { children }
    </span>
  )
};

const AnalyticsTrackerComponent = registerComponent('AnalyticsTracker', AnalyticsTracker)

declare global {
  interface ComponentTypes {
    AnalyticsTracker: typeof AnalyticsTrackerComponent
  }
}
