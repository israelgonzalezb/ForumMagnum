import React, { memo } from 'react';
import { eligibleToNominate, REVIEW_NAME_IN_SITU } from '../../lib/reviewUtils';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import { Link } from '../../lib/reactRouterWrapper';
import { overviewTooltip } from './FrontpageReviewWidget';
import { useCurrentUser } from '../common/withUser';

const styles = (theme) => ({
  root: {
    ...theme.typography.body2,
    ...theme.typography.commentStyle,
    textAlign: "center",
    color: theme.palette.grey[800],
    padding: theme.spacing.unit,
    '& a': {
      color: theme.palette.primary.main
    }
  }
})

const ReviewVotingWidget = ({classes, post, setNewVote, showTitle=true}: {classes:ClassesType, post: PostsMinimumInfo, showTitle?: boolean, setNewVote?: (newVote:number)=>void}) => {

  const { ErrorBoundary, LWTooltip } = Components

  const currentUser = useCurrentUser()


  if (!eligibleToNominate(currentUser)) return null

  const currentUserVote = post.currentUserReviewVote !== null ? {
    _id: post.currentUserReviewVote._id,
    postId: post._id,
    score: post.currentUserReviewVote.qualitativeScore || 0,
    type: "QUALITATIVE" as const
  } : null

  return <ErrorBoundary>
      <div className={classes.root}>
        {showTitle && <p>
          Vote on this post for the <LWTooltip title={overviewTooltip}><Link to={"/reviewVoting"}>{REVIEW_NAME_IN_SITU}</Link></LWTooltip>
        </p>}
        <ReviewVotingButtonsSmart post={post} setNewVote={setNewVote} currentUserVote={currentUserVote}/>
      </div>
    </ErrorBoundary>
})

const ReviewVotingButtonsSmart = memo(({post, dispatch, currentUserVote}: {post: PostsMinimumInfo, dispatch: (vote: {_id: string|null, postId: string, score: number})=>void, currentUserVote: {_id: string|null, postId: string, score: number, type: "QUALITATIVE"}|null}) => {
  const { ReviewVotingButtons } = Components
  return <ReviewVotingButtons post={post} dispatch={dispatch} currentUserVote={currentUserVote}/>
})

const ReviewVotingWidgetComponent = registerComponent('ReviewVotingWidget', ReviewVotingWidget, {styles});

declare global {
  interface ComponentTypes {
    ReviewVotingWidget: typeof ReviewVotingWidgetComponent
  }
}
