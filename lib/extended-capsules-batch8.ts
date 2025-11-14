/**
 * Extended Capsules Batch 8 - 200 capsules
 * Productivity, Collaboration, Communication, Project Management
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => ({
  id, name, category, description: desc, tags,
  code: `'use client'\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return <div className="p-4 border rounded-lg shadow">${name}</div>\n}`,
  platform: 'react'
})

const extendedCapsulesBatch8: Capsule[] = [
  // Productivity & Task Management - 50 capsules
  ...['task-list-manager', 'task-card-kanban', 'task-priority-setter', 'task-due-date-picker', 'task-reminder-system', 'task-recurring-tasks', 'task-subtasks-manager', 'task-checklist-builder', 'task-dependency-tracker', 'task-blocker-indicator', 'task-time-estimate', 'task-time-tracking', 'task-pomodoro-timer', 'task-focus-mode', 'task-break-reminder', 'task-daily-planner', 'task-weekly-view', 'task-monthly-calendar', 'task-agenda-view', 'task-timeline-view', 'task-gantt-chart-task', 'task-burndown-chart', 'task-velocity-tracker', 'task-sprint-planner', 'task-backlog-manager', 'task-epic-tracker', 'task-milestone-marker', 'task-goal-tracker', 'task-okr-dashboard', 'task-habit-tracker', 'task-streak-counter', 'task-progress-tracker-task', 'task-completion-rate', 'task-productivity-stats', 'task-time-analytics', 'task-eisenhower-matrix', 'task-priority-queue', 'task-quick-capture', 'task-inbox-zero', 'task-batch-actions', 'task-bulk-edit', 'task-smart-scheduling', 'task-calendar-sync', 'task-notification-center', 'task-digest-email', 'task-share-task', 'task-assign-user', 'task-tag-system', 'task-filter-builder', 'task-saved-views'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} productivity component`, ['productivity', 'tasks', 'planning'])
  ),

  // Collaboration & Team Tools - 50 capsules
  ...['collab-team-workspace', 'collab-shared-board', 'collab-collaborative-doc', 'collab-rich-text-collab', 'collab-code-collab', 'collab-whiteboard-shared', 'collab-drawing-collab', 'collab-sticky-notes', 'collab-voting-poll', 'collab-brainstorming-board', 'collab-mind-map-collab', 'collab-flowchart-collab', 'collab-diagram-editor', 'collab-presentation-mode', 'collab-screen-share-viewer', 'collab-cursor-presence', 'collab-user-avatars', 'collab-live-cursors', 'collab-selection-overlay', 'collab-awareness-indicator', 'collab-typing-indicator', 'collab-activity-feed-collab', 'collab-changelog-viewer', 'collab-version-history', 'collab-revision-compare', 'collab-conflict-resolver', 'collab-merge-changes', 'collab-commenting-system', 'collab-inline-comments', 'collab-thread-viewer', 'collab-mention-system', 'collab-reaction-picker', 'collab-emoji-reactions', 'collab-approval-workflow', 'collab-review-request', 'collab-feedback-collector', 'collab-suggestion-mode', 'collab-track-changes', 'collab-permission-manager', 'collab-role-based-access', 'collab-invite-system', 'collab-guest-access', 'collab-link-sharing', 'collab-embed-viewer', 'collab-export-collab', 'collab-import-collab', 'collab-template-library', 'collab-workspace-switcher', 'collab-recent-activity', 'collab-notification-feed'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Interaction', `${id.split('-').slice(1).join(' ')} collaboration component`, ['collaboration', 'team', 'shared'])
  ),

  // Communication & Messaging - 50 capsules
  ...['chat-message-thread', 'chat-direct-message', 'chat-group-chat', 'chat-channel-browser', 'chat-channel-list', 'chat-message-composer', 'chat-rich-text-input', 'chat-emoji-picker-chat', 'chat-gif-picker', 'chat-file-attachment', 'chat-image-upload-chat', 'chat-voice-message', 'chat-audio-recorder-chat', 'chat-video-message', 'chat-screen-recording', 'chat-code-snippet-sender', 'chat-syntax-highlighter-chat', 'chat-message-reactions-chat', 'chat-reply-thread', 'chat-quote-message', 'chat-forward-message', 'chat-edit-message', 'chat-delete-message', 'chat-pin-message', 'chat-bookmark-message', 'chat-search-messages', 'chat-filter-messages', 'chat-message-status', 'chat-read-receipts', 'chat-typing-status', 'chat-online-status', 'chat-presence-indicator', 'chat-user-list', 'chat-contact-list', 'chat-add-contact', 'chat-block-user', 'chat-mute-conversation', 'chat-notification-settings-chat', 'chat-do-not-disturb', 'chat-custom-status', 'chat-away-message', 'chat-auto-reply', 'chat-chat-bot', 'chat-smart-replies', 'chat-message-templates', 'chat-canned-responses', 'chat-slash-commands', 'chat-keyboard-shortcuts-chat', 'chat-voice-call-button', 'chat-video-call-button'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Social', `${id.split('-').slice(1).join(' ')} communication component`, ['chat', 'messaging', 'communication'])
  ),

  // Project Management & Planning - 50 capsules
  ...['project-dashboard-pm', 'project-overview-card', 'project-status-board', 'project-timeline-pm', 'project-roadmap-viewer', 'project-gantt-chart-pm', 'project-resource-planner', 'project-capacity-planner', 'project-workload-chart', 'project-allocation-grid', 'project-budget-tracker', 'project-cost-estimator', 'project-invoice-tracker-pm', 'project-expense-logger', 'project-time-sheets', 'project-timesheet-approval', 'project-client-portal', 'project-stakeholder-map', 'project-risk-register', 'project-issue-tracker', 'project-bug-tracker', 'project-feature-requests', 'project-change-requests', 'project-document-library', 'project-file-manager-pm', 'project-wiki-editor', 'project-knowledge-base', 'project-sop-templates', 'project-meeting-notes', 'project-meeting-scheduler', 'project-agenda-builder', 'project-action-items', 'project-decision-log', 'project-dependency-graph', 'project-critical-path', 'project-baseline-compare', 'project-what-if-analysis', 'project-scenario-planner', 'project-report-builder', 'project-custom-reports', 'project-export-reports', 'project-dashboard-widgets', 'project-kpi-metrics', 'project-progress-reports', 'project-status-updates', 'project-executive-summary', 'project-team-directory', 'project-org-chart', 'project-integration-hub', 'project-api-connectors'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Dashboard', `${id.split('-').slice(1).join(' ')} project management component`, ['project', 'management', 'planning'])
  )
]

export default extendedCapsulesBatch8
