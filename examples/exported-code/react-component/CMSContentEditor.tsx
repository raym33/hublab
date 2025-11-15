'use client'

import React, { useState } from 'react'

/**
 * CMS Content Editor
 *
 * A rich content management system editor with WYSIWYG capabilities,
 * media management, and publishing workflow.
 *
 * Exported from HubLab Studio V2
 * Categories: CMS, Publishing, Media
 *
 * @example
 * ```tsx
 * import CMSContentEditor from './CMSContentEditor'
 *
 * export default function Page() {
 *   return <CMSContentEditor />
 * }
 * ```
 */

interface ContentItem {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'scheduled'
  author: string
  lastModified: Date
  category: string
}

export default function CMSContentEditor() {
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'settings'>('editor')
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')

  const [contentData, setContentData] = useState({
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    excerpt: 'Learn the fundamentals of React and build modern web applications',
    content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular tools for web development...',
    category: 'Technology',
    tags: ['react', 'javascript', 'web-development'],
    featuredImage: null as string | null,
    metaTitle: 'Getting Started with React - A Complete Guide',
    metaDescription: 'Learn React fundamentals and start building modern web applications today'
  })

  const recentContent: ContentItem[] = [
    { id: '1', title: 'Understanding TypeScript', slug: 'understanding-typescript', status: 'published', author: 'John Doe', lastModified: new Date('2024-01-15'), category: 'Technology' },
    { id: '2', title: 'Next.js 14 Features', slug: 'nextjs-14-features', status: 'draft', author: 'Jane Smith', lastModified: new Date('2024-01-14'), category: 'Development' },
    { id: '3', title: 'CSS Grid Layout Guide', slug: 'css-grid-layout-guide', status: 'published', author: 'Mike Johnson', lastModified: new Date('2024-01-13'), category: 'Design' },
    { id: '4', title: 'Web Performance Tips', slug: 'web-performance-tips', status: 'scheduled', author: 'Sarah Williams', lastModified: new Date('2024-01-12'), category: 'Performance' }
  ]

  const categories = ['Technology', 'Development', 'Design', 'Business', 'Marketing']

  const handlePublish = () => {
    setPublishStatus('published')
    alert('Content published successfully!')
  }

  const handleSaveDraft = () => {
    setPublishStatus('draft')
    alert('Draft saved successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">Content Editor</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                publishStatus === 'published' ? 'bg-green-100 text-green-700' :
                publishStatus === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {publishStatus.charAt(0).toUpperCase() + publishStatus.slice(1)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Save Draft
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                Preview
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              {/* Tabs */}
              <div className="border-b border-slate-200">
                <div className="flex gap-1 p-2">
                  {(['editor', 'media', 'settings'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Tab */}
              {activeTab === 'editor' && (
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <input
                      type="text"
                      value={contentData.title}
                      onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                      placeholder="Enter title..."
                      className="w-full text-4xl font-bold border-none outline-none focus:ring-0 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug</label>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>yoursite.com/blog/</span>
                      <input
                        type="text"
                        value={contentData.slug}
                        onChange={(e) => setContentData({ ...contentData, slug: e.target.value })}
                        className="flex-1 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
                    <textarea
                      value={contentData.excerpt}
                      onChange={(e) => setContentData({ ...contentData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of your content..."
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-300 p-2 flex gap-1 flex-wrap">
                      {['B', 'I', 'U', 'H1', 'H2', 'H3'].map(format => (
                        <button
                          key={format}
                          className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 font-semibold text-sm transition-colors"
                        >
                          {format}
                        </button>
                      ))}
                      <div className="w-px bg-slate-300 mx-1"></div>
                      {['Quote', 'List', 'Link', 'Image'].map(tool => (
                        <button
                          key={tool}
                          className="px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 text-sm transition-colors"
                        >
                          {tool}
                        </button>
                      ))}
                    </div>

                    {/* Content Area */}
                    <textarea
                      value={contentData.content}
                      onChange={(e) => setContentData({ ...contentData, content: e.target.value })}
                      rows={15}
                      className="w-full p-4 focus:outline-none resize-none font-mono text-sm"
                      placeholder="Start writing your content..."
                    />
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Media Library</h3>

                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="text-5xl mb-4">📁</div>
                    <div className="text-lg font-medium text-slate-900 mb-2">Drop files to upload</div>
                    <div className="text-sm text-slate-600 mb-4">or click to browse</div>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                      Select Files
                    </button>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-square bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-300 transition-colors cursor-pointer">
                        <span className="text-4xl">🖼️</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">SEO Title</label>
                    <input
                      type="text"
                      value={contentData.metaTitle}
                      onChange={(e) => setContentData({ ...contentData, metaTitle: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
                    <textarea
                      value={contentData.metaDescription}
                      onChange={(e) => setContentData({ ...contentData, metaDescription: e.target.value })}
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Publishing Options</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-slate-300" />
                        <span className="text-sm text-slate-700">Allow comments</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-slate-300" />
                        <span className="text-sm text-slate-700">Featured post</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                        <span className="text-sm text-slate-700">Enable SEO</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Publishing</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={contentData.category}
                    onChange={(e) => setContentData({ ...contentData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {contentData.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                        {tag}
                        <button className="text-blue-500 hover:text-blue-700">×</button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Schedule</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Content</h3>

              <div className="space-y-3">
                {recentContent.map(item => (
                  <div key={item.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 text-sm mb-1 truncate">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.author} • {item.lastModified.toLocaleDateString()}</div>
                      </div>
                      <div className={`ml-2 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        item.status === 'published' ? 'bg-green-100 text-green-700' :
                        item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
