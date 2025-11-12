import { CapsuleDefinition } from './types'

/**
 * Social Media Capsules
 * Social sharing, feeds, and engagement components
 */

export const SOCIAL_CAPSULES: CapsuleDefinition[] = [
  // Share Buttons
  {
    id: 'share-buttons',
    name: 'Share Buttons',
    description: 'Social media share buttons',
    category: 'social',
    props: [
      { name: 'url', type: 'string', required: false, default: '', description: 'URL to share (defaults to current page)' },
      { name: 'title', type: 'string', required: false, default: '', description: 'Title to share' },
      { name: 'platforms', type: 'array', required: false, default: ['twitter', 'facebook', 'linkedin'], description: 'Platforms to include' },
      { name: 'size', type: 'string', required: false, default: 'md', description: 'Button size: sm, md, lg' }
    ],
    dependencies: [],
    code: `
function ShareButtons({ url = '', title = '', platforms = ['twitter', 'facebook', 'linkedin'], size = 'md' }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || (typeof document !== 'undefined' ? document.title : '')

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  const shareLinks = {
    twitter: \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(shareUrl)}&text=\${encodeURIComponent(shareTitle)}\`,
    facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(shareUrl)}\`,
    linkedin: \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(shareUrl)}\`,
    reddit: \`https://reddit.com/submit?url=\${encodeURIComponent(shareUrl)}&title=\${encodeURIComponent(shareTitle)}\`,
    whatsapp: \`https://wa.me/?text=\${encodeURIComponent(shareTitle + ' ' + shareUrl)}\`,
    telegram: \`https://t.me/share/url?url=\${encodeURIComponent(shareUrl)}&text=\${encodeURIComponent(shareTitle)}\`
  }

  const platformColors = {
    twitter: 'bg-blue-400 hover:bg-blue-500',
    facebook: 'bg-blue-600 hover:bg-blue-700',
    linkedin: 'bg-blue-700 hover:bg-blue-800',
    reddit: 'bg-orange-500 hover:bg-orange-600',
    whatsapp: 'bg-green-500 hover:bg-green-600',
    telegram: 'bg-blue-500 hover:bg-blue-600'
  }

  const platformIcons = {
    twitter: '𝕏',
    facebook: 'f',
    linkedin: 'in',
    reddit: 'r',
    whatsapp: 'W',
    telegram: 'T'
  }

  return (
    <div className="flex gap-3">
      {platforms.map(platform => (
        <a
          key={platform}
          href={shareLinks[platform]}
          target="_blank"
          rel="noopener noreferrer"
          className={\`\${sizes[size]} \${platformColors[platform]} text-white rounded-full flex items-center justify-center font-bold transition-colors\`}
          title={\`Share on \${platform}\`}
        >
          {platformIcons[platform]}
        </a>
      ))}
    </div>
  )
}`
  },

  // Social Feed
  {
    id: 'social-feed',
    name: 'Social Feed',
    description: 'Social media-style feed with posts',
    category: 'social',
    props: [
      { name: 'posts', type: 'array', required: false, default: [
        { id: 1, author: 'John Doe', avatar: '', content: 'Just launched my new app!', likes: 24, comments: 5, timestamp: '2h ago' }
      ], description: 'Array of posts' }
    ],
    dependencies: [],
    code: `
function SocialFeed({ posts = [] }) {
  const [feedPosts, setFeedPosts] = React.useState(posts)

  const handleLike = (postId) => {
    setFeedPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1, liked: !post.liked }
        : post
    ))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {feedPosts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.avatar || post.author.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{post.author}</div>
              <div className="text-sm text-gray-500">{post.timestamp}</div>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 mb-4">{post.content}</p>

          {post.image && (
            <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t">
            <button
              onClick={() => handleLike(post.id)}
              className={\`flex items-center gap-2 \${post.liked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500\`}
            >
              <span>{post.liked ? '❤️' : '🤍'}</span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
              <span>🔄</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}`
  },

  // Comments Section
  {
    id: 'comments-section',
    name: 'Comments Section',
    description: 'Nested comments with replies',
    category: 'social',
    props: [
      { name: 'comments', type: 'array', required: false, default: [
        { id: 1, author: 'Alice', content: 'Great post!', timestamp: '1h ago', replies: [] }
      ], description: 'Comments array' },
      { name: 'allowReplies', type: 'boolean', required: false, default: true, description: 'Allow nested replies' }
    ],
    dependencies: [],
    code: `
function CommentsSection({ comments = [], allowReplies = true }) {
  const [commentsList, setCommentsList] = React.useState(comments)
  const [newComment, setNewComment] = React.useState('')
  const [replyingTo, setReplyingTo] = React.useState(null)

  const addComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: 'You',
      content: newComment,
      timestamp: 'Just now',
      replies: []
    }

    if (replyingTo) {
      setCommentsList(prev => prev.map(c =>
        c.id === replyingTo
          ? { ...c, replies: [...(c.replies || []), comment] }
          : c
      ))
      setReplyingTo(null)
    } else {
      setCommentsList(prev => [...prev, comment])
    }
    setNewComment('')
  }

  const Comment = ({ comment, depth = 0 }) => (
    <div className={\`\${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}\`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {comment.author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="font-semibold text-sm">{comment.author}</div>
            <p className="text-gray-800 text-sm mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{comment.timestamp}</span>
            {allowReplies && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="hover:text-blue-600"
              >
                Reply
              </button>
            )}
          </div>
          {comment.replies && comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Comments ({commentsList.length})</h3>

      {/* Add Comment */}
      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          Y
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replyingTo ? 'Reply' : 'Comment'}
            </button>
            {replyingTo && (
              <button
                onClick={() => { setReplyingTo(null); setNewComment('') }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {commentsList.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}`
  },

  // Social Proof
  {
    id: 'social-proof',
    name: 'Social Proof',
    description: 'Social proof notifications (X people viewing, bought, etc.)',
    category: 'social',
    props: [
      { name: 'message', type: 'string', required: false, default: '5 people viewing this now', description: 'Notification message' },
      { name: 'type', type: 'string', required: false, default: 'viewing', description: 'Type: viewing, bought, signed_up' },
      { name: 'position', type: 'string', required: false, default: 'bottom-left', description: 'Position: bottom-left, bottom-right, top-left, top-right' }
    ],
    dependencies: [],
    code: `
function SocialProof({ message = '5 people viewing this now', type = 'viewing', position = 'bottom-left' }) {
  const [isVisible, setIsVisible] = React.useState(true)

  const positions = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  }

  const icons = {
    viewing: '👀',
    bought: '🛒',
    signed_up: '✨'
  }

  if (!isVisible) return null

  return (
    <div className={\`fixed \${positions[position]} z-50 animate-in slide-in-from-bottom duration-300\`}>
      <div className="bg-white shadow-2xl rounded-lg p-4 flex items-center gap-3 max-w-sm border border-gray-200">
        <span className="text-2xl">{icons[type]}</span>
        <p className="text-sm text-gray-800 flex-1">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}`
  },

  // Follow Button
  {
    id: 'follow-button',
    name: 'Follow Button',
    description: 'Social media-style follow button',
    category: 'social',
    props: [
      { name: 'username', type: 'string', required: true, default: 'johndoe', description: 'Username to follow' },
      { name: 'initialFollowing', type: 'boolean', required: false, default: false, description: 'Initial follow state' },
      { name: 'followers', type: 'number', required: false, default: 0, description: 'Follower count' }
    ],
    dependencies: [],
    code: `
function FollowButton({ username = 'johndoe', initialFollowing = false, followers = 0 }) {
  const [isFollowing, setIsFollowing] = React.useState(initialFollowing)
  const [followerCount, setFollowerCount] = React.useState(followers)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1)
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleFollow}
        className={\`px-6 py-2 rounded-lg font-semibold transition-colors \${
          isFollowing
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }\`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <div className="text-sm text-gray-600">
        <span className="font-semibold">{followerCount.toLocaleString()}</span> followers
      </div>
    </div>
  )
}`
  },

  // Social Stats
  {
    id: 'social-stats',
    name: 'Social Stats',
    description: 'Display social media statistics',
    category: 'social',
    props: [
      { name: 'stats', type: 'array', required: false, default: [
        { label: 'Followers', value: 1234 },
        { label: 'Following', value: 567 },
        { label: 'Posts', value: 89 }
      ], description: 'Statistics to display' }
    ],
    dependencies: [],
    code: `
function SocialStats({ stats = [] }) {
  return (
    <div className="flex divide-x divide-gray-200">
      {stats.map((stat, idx) => (
        <div key={idx} className="px-6 py-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}`
  }
]
