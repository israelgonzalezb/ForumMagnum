import { Components, registerComponent } from 'meteor/vulcan:core';
import { withSingle } from '../../lib/crud/withSingle';
import React from 'react';
import { Comments } from '../../lib/collections/comments';
import classNames from 'classnames';

const ParentCommentSingle = (props) => {
  if (props.document && !props.loading) {
    const { nestingLevel } = props;
    return (
      <div className={classNames(
        'comments-node',
        'recent-comments-node',
        {
          "comments-node-root" : nestingLevel === 1,
          "comments-node-even" : nestingLevel % 2 === 0,
          "comments-node-odd"  : nestingLevel % 2 != 0,
        }
      )}>
        <Components.CommentsItem {...props} isParentComment comment={props.document}/>
      </div>
    )
  } else {
    return <Components.Loading />
  }
}

const ParentCommentSingleComponent = registerComponent(
  'ParentCommentSingle', ParentCommentSingle,
  withSingle({
    collection: Comments,
    fragmentName: 'SelectCommentsList',
  })
);

declare global {
  interface ComponentTypes {
    ParentCommentSingle: typeof ParentCommentSingleComponent,
  }
}

