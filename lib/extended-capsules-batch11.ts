/**
 * Extended Capsules Batch 11 - 250 capsules
 * Social Network, Community, Forums, User Generated Content
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => {
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '')
  return {
    id,
    name,
    category,
    description: desc,
    tags,
    code: `'use client'
import { useState } from 'react'

export default function ${componentName}() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-2">${name}</h3>
      <p className="text-gray-600 mb-4">${desc}</p>
      <button
        onClick={() => setIsActive(!isActive)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  )
}`,
    platform: 'react'
  }
}

const extendedCapsulesBatch11: Capsule[] = [
  // Social Network Features - 70 capsules
  ...['social-news-feed', 'social-timeline', 'social-infinite-scroll-social', 'social-post-composer', 'social-status-update', 'social-photo-upload-social', 'social-video-upload-social', 'social-album-creator', 'social-story-creator', 'social-story-viewer', 'social-story-highlights', 'social-reels-viewer', 'social-short-video', 'social-live-video-social', 'social-post-card', 'social-image-post', 'social-video-post', 'social-link-preview', 'social-poll-post', 'social-quiz-post', 'social-event-post', 'social-article-post', 'social-location-tag', 'social-check-in', 'social-tag-people', 'social-mention-user', 'social-hashtag-system', 'social-trending-hashtags', 'social-explore-page', 'social-discover-feed', 'social-for-you-page', 'social-recommended-posts', 'social-like-button-social', 'social-love-reaction', 'social-reaction-picker-social', 'social-emoji-reactions-social', 'social-comment-system-social', 'social-nested-comments', 'social-reply-thread', 'social-comment-reactions', 'social-share-button-social', 'social-repost', 'social-quote-tweet', 'social-share-to-story', 'social-send-message', 'social-save-post', 'social-bookmark-collections', 'social-hide-post', 'social-report-post', 'social-block-user-social', 'social-mute-user', 'social-follow-button', 'social-unfollow-button', 'social-followers-list', 'social-following-list', 'social-mutual-friends', 'social-friend-suggestions', 'social-people-you-may-know', 'social-connection-graph', 'social-network-visualization', 'social-profile-page-social', 'social-profile-header', 'social-cover-photo', 'social-profile-picture', 'social-bio-editor', 'social-links-in-bio', 'social-highlights-grid', 'social-pinned-posts', 'social-featured-posts', 'social-user-badges-social'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Social', `${id.split('-').slice(1).join(' ')} social network component`, ['social', 'network', 'feed'])
  ),

  // Community & Forums - 60 capsules
  ...['forum-category-list', 'forum-subcategory', 'forum-thread-list', 'forum-topic-browser', 'forum-new-topic', 'forum-thread-starter', 'forum-post-editor-forum', 'forum-rich-text-forum', 'forum-code-block-forum', 'forum-quote-post-forum', 'forum-spoiler-tag', 'forum-attachment-upload', 'forum-image-embed-forum', 'forum-video-embed-forum', 'forum-link-embed', 'forum-poll-creator-forum', 'forum-voting-forum', 'forum-upvote-downvote', 'forum-karma-system', 'forum-reputation-score', 'forum-trust-level', 'forum-user-rank', 'forum-badges-forum', 'forum-achievements-forum', 'forum-post-count', 'forum-join-date', 'forum-last-active', 'forum-online-status-forum', 'forum-typing-indicator-forum', 'forum-read-receipt-forum', 'forum-thread-subscription', 'forum-notification-settings-forum', 'forum-email-digest', 'forum-thread-pagination', 'forum-jump-to-page', 'forum-newest-posts', 'forum-hot-topics', 'forum-trending-discussions', 'forum-unanswered-questions', 'forum-solved-threads', 'forum-best-answer', 'forum-accepted-solution', 'forum-helpful-marker', 'forum-pin-thread', 'forum-sticky-post', 'forum-lock-thread', 'forum-close-discussion', 'forum-move-thread', 'forum-merge-threads', 'forum-split-thread', 'forum-moderator-tools-forum', 'forum-report-system-forum', 'forum-flag-content', 'forum-review-queue', 'forum-spam-filter', 'forum-auto-moderation-forum', 'forum-trust-system', 'forum-whitelist', 'forum-blacklist', 'forum-ip-ban'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Social', `${id.split('-').slice(1).join(' ')} forum component`, ['forum', 'community', 'discussion'])
  ),

  // User Generated Content - 60 capsules
  ...['ugc-content-creator', 'ugc-blog-editor', 'ugc-article-writer', 'ugc-rich-editor-ugc', 'ugc-markdown-editor-ugc', 'ugc-wysiwyg-editor', 'ugc-drag-drop-builder', 'ugc-block-editor', 'ugc-page-builder', 'ugc-template-selector-ugc', 'ugc-layout-picker', 'ugc-theme-customizer', 'ugc-style-editor', 'ugc-css-editor', 'ugc-custom-code', 'ugc-seo-settings-ugc', 'ugc-meta-description', 'ugc-featured-image', 'ugc-category-selector-ugc', 'ugc-tag-input-ugc', 'ugc-publish-settings', 'ugc-schedule-post', 'ugc-draft-saver', 'ugc-auto-save-ugc', 'ugc-revision-history-ugc', 'ugc-version-control-ugc', 'ugc-preview-mode', 'ugc-mobile-preview', 'ugc-desktop-preview', 'ugc-publish-button', 'ugc-submit-review', 'ugc-pending-approval', 'ugc-moderation-queue-ugc', 'ugc-content-filter', 'ugc-profanity-filter', 'ugc-image-moderation', 'ugc-ai-content-check', 'ugc-plagiarism-check', 'ugc-fact-checker', 'ugc-quality-score', 'ugc-readability-score', 'ugc-seo-score', 'ugc-analytics-ugc', 'ugc-view-counter', 'ugc-engagement-metrics-ugc', 'ugc-popular-content', 'ugc-viral-tracker', 'ugc-trending-content', 'ugc-featured-carousel', 'ugc-editorial-picks', 'ugc-curated-collection', 'ugc-playlist-creator', 'ugc-compilation-maker', 'ugc-mashup-tool', 'ugc-remix-studio', 'ugc-collab-editor', 'ugc-co-author-system', 'ugc-attribution-system', 'ugc-license-selector', 'ugc-copyright-claim'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} user content component`, ['ugc', 'content', 'creator'])
  ),

  // Reviews & Ratings - 60 capsules
  ...['review-rating-stars', 'review-half-star', 'review-rating-display', 'review-average-rating', 'review-rating-distribution', 'review-rating-breakdown', 'review-5-star-chart', 'review-sentiment-analysis', 'review-review-form', 'review-write-review', 'review-verified-purchase', 'review-verified-reviewer', 'review-photo-reviews', 'review-video-reviews', 'review-review-gallery', 'review-helpful-button', 'review-upvote-review', 'review-downvote-review', 'review-report-review', 'review-flag-inappropriate', 'review-review-filter', 'review-sort-reviews', 'review-filter-by-rating', 'review-filter-verified', 'review-filter-photos', 'review-search-reviews', 'review-review-highlights', 'review-common-themes', 'review-pros-cons', 'review-aspect-ratings', 'review-detailed-ratings', 'review-criteria-breakdown', 'review-reviewer-profile', 'review-reviewer-stats', 'review-reviewer-rank', 'review-top-reviewers', 'review-review-count', 'review-review-pagination', 'review-load-more-reviews', 'review-infinite-scroll-reviews', 'review-review-summary', 'review-rating-snapshot', 'review-recommendation-rate', 'review-would-buy-again', 'review-size-fit-rating', 'review-product-comparison', 'review-vs-competitors', 'review-quality-rating', 'review-value-rating', 'review-service-rating', 'review-delivery-rating', 'review-packaging-rating', 'review-question-answer', 'review-qa-section', 'review-ask-question', 'review-answer-question', 'review-expert-review', 'review-editorial-review', 'review-critic-score', 'review-aggregate-score'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'E-commerce', `${id.split('-').slice(1).join(' ')} review component`, ['review', 'rating', 'feedback'])
  )
]

export default extendedCapsulesBatch11
