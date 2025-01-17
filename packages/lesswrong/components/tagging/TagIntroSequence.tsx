import React, { useState } from 'react'
import { AnalyticsContext } from '../../lib/analyticsEvents'
import { useMulti } from '../../lib/crud/withMulti'
import { Components, registerComponent } from '../../lib/vulcan-lib'

const PREVIEW_N = 3

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    marginBottom: 16,
  },
})

const TagIntroSequence = ({tag, classes}: {
  tag: TagPageFragment,
  classes: ClassesType
}) => {
  const { SectionTitle, Loading, PostsItem2, LoadMore } = Components
  const { results: seqChapters, loading } = useMulti({
    terms: {
      view: "SequenceChapters",
      sequenceId: tag.sequence?._id,
      limit: 100,
    },
    collectionName: "Chapters",
    fragmentName: 'ChaptersFragment',
    enableTotal: false,
    skip: !tag.sequence,
  });
  const [loadedMore, setLoadedMore] = useState(false)

  if (!tag.sequence) return null

  // Get all the posts together, we're ignoring chapters here
  let posts = seqChapters?.flatMap(chapter => chapter.posts) || []
  const totalCount = posts.length
  if (!loadedMore) {
    posts = posts.slice(0, PREVIEW_N)
  }

  return <div className={classes.root}>
    <SectionTitle title={`Introduction to ${tag.name}`} />
    <AnalyticsContext listContext={'tagIntroSequnce'}>
      {loading && <Loading />}
      {posts.map((post) => <PostsItem2
        key={post._id}
        post={post}
        sequenceId={tag.sequence?._id}
      />)}
      {totalCount > PREVIEW_N && !loadedMore && <LoadMore
        loadMore={() => setLoadedMore(true)}
        count={PREVIEW_N}
        totalCount={totalCount}
        afterPostsListMarginTop
      />}
    </AnalyticsContext>
  </div>
}

const TagIntroSequenceComponent = registerComponent("TagIntroSequence", TagIntroSequence, {styles})

declare global {
  interface ComponentTypes {
    TagIntroSequence: typeof TagIntroSequenceComponent
  }
}
