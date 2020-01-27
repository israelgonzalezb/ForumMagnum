import { registerComponent } from 'meteor/vulcan:core';
import { withUpdate } from '../../lib/crud/withUpdate';
import React, { Component } from 'react';
import { Posts } from '../../lib/collections/posts';
import Users from 'meteor/vulcan:users';
import withUser from '../common/withUser';
import MenuItem from '@material-ui/core/MenuItem';

const SuggestAlignment = ({ currentUser, post, updatePost }) => {
  const userHasSuggested = post.suggestForAlignmentUserIds && post.suggestForAlignmentUserIds.includes(currentUser._id)

  if (Users.canSuggestPostForAlignment({currentUser, post})) {
    return <div>
      { userHasSuggested ?
        <div  onClick={() => Posts.unSuggestForAlignment({currentUser, post, updatePost})}>
          <MenuItem>
            Ω Unsuggest for Alignment
          </MenuItem>
        </div>
        :
        <div  onClick={() => Posts.suggestForAlignment({currentUser, post, updatePost})}>
          <MenuItem>
            Ω Suggest for Alignment
          </MenuItem>
        </div>
      }
    </div>
  } else {
    return null
  }
}

const SuggestAlignmentComponent = registerComponent(
  'SuggestAlignment',
  SuggestAlignment,
  withUpdate({
    collection: Posts,
    fragmentName: 'PostsList',
  }),
  withUser
);

declare global {
  interface ComponentTypes {
    SuggestAlignment: typeof SuggestAlignmentComponent
  }
}
