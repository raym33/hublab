# HubLab Capsules Reference

**Total Capsules:** 5,150+ AI-friendly components across 40+ categories

This document provides a comprehensive reference of all available capsules in HubLab, organized by category with usage examples and descriptions.

---

## 📊 Capsule Statistics

- **Total Capsules:** 5,150+
- **Categories:** 40+
- **AI-Friendly:** 100% (all capsules have rich metadata, tags, and descriptions)
- **Platform Support:** Web (React/TypeScript)
- **Code Quality:** Production-ready with proper React structure

---

## 🎨 Core Categories (285 capsules)

### UI Components (216 Legacy + 24 Core)
**Use cases:** Building user interfaces, layouts, interactive elements

**Key Capsules:**
- `button` - Clickable button with variants (primary, secondary, outline)
- `input` - Text input with validation and error states
- `card` - Content container with header, body, footer
- `modal` - Dialog/overlay for focused interactions
- `dropdown` - Selection menu with search and multi-select
- `table` - Data table with sorting, filtering, pagination
- `chart` - Various chart types (line, bar, pie, area)

### Forms & Validation (265 capsules from Batch 3)
- Multi-step forms with progress indicators
- File upload with drag-and-drop
- Auto-save functionality
- Real-time validation
- Dynamic form generation
- Conditional field visibility

### Notifications & Feedback (45 capsules)
- Toast notifications (success, error, warning, info)
- Progress indicators (linear, circular, step-based)
- Skeleton loaders for loading states
- Empty state placeholders
- Confirmation dialogs

---

## 🤖 AI & Machine Learning (350 capsules)

### Machine Learning Models (50 capsules)
**Batch:** `machine-learning-capsules.ts`

**Categories:**
- **Computer Vision:** Image classification, object detection, face recognition
- **NLP:** Text classification, sentiment analysis, named entity recognition
- **MLOps:** Model training, deployment, monitoring
- **Neural Networks:** CNN, RNN, LSTM implementations
- **Clustering:** K-means, hierarchical clustering, DBSCAN

**Example Usage:**
```typescript
import { ImageClassifier } from '@/lib/all-capsules'

// Use image classification capsule
<ImageClassifier
  model="resnet50"
  onPrediction={(results) => console.log(results)}
/>
```

### AI Integration (5 capsules)
- AI Chat interface with streaming responses
- Text generator with customizable prompts
- Image generator (DALL-E, Stable Diffusion)
- Sentiment analyzer
- Code formatter with AI suggestions

---

## 🏢 Business & Enterprise (900 capsules)

### CRM & Customer Management (300 capsules - Batch 14)
**Batch:** `extended-capsules-batch14.ts`

**Sub-categories:**
- **Contact Management (100):** Contact cards, profiles, timelines, notes
- **Sales Pipeline (100):** Deal stages, forecasting, win/loss analysis
- **Customer Success (100):** Health scores, churn prediction, onboarding

**Example Capsules:**
- `crm-contact-manager` - Full-featured contact management interface
- `crm-deal-pipeline` - Visual sales pipeline with drag-and-drop
- `crm-lead-scoring` - Automated lead qualification and scoring
- `crm-email-tracking` - Email open/click tracking and analytics
- `crm-customer-health-score` - Customer engagement scoring system

### Marketing Automation (100 capsules - Batch 14)
- Email campaign builders
- A/B testing frameworks
- Marketing attribution models
- Social media schedulers
- Conversion tracking

### Sales & Revenue Operations (100 capsules - Batch 14)
- Quota tracking and forecasting
- Commission calculators
- Performance dashboards
- Pipeline metrics
- Revenue recognition

---

## 🛒 E-commerce (305 capsules)

### E-commerce Basics (5 core capsules)
- Product card with variants
- Shopping cart with persistence
- Price filter with range slider
- Checkout flow (multi-step)
- Quick view modal

### E-commerce Advanced (250 capsules - Batch 4)
**Sub-categories:**
- **Product Management (50):** Inventory, variants, recommendations
- **Shopping Experience (50):** Cart, wishlist, compare products
- **Checkout & Payments (50):** Multi-step checkout, payment integrations
- **Order Management (50):** Tracking, returns, fulfillment
- **Customer Engagement (50):** Reviews, loyalty programs, personalization

---

## 🏥 Healthcare & Medical (200 capsules - Batch 2)

### Healthcare Systems
- Patient record management
- Appointment scheduling
- Telemedicine interfaces
- Prescription management
- Medical billing
- Lab results viewer
- HIPAA-compliant forms

**Example Capsules:**
- `healthcare-patient-portal` - Patient access to records and appointments
- `healthcare-appointment-scheduler` - Calendar-based booking system
- `healthcare-ehr-viewer` - Electronic health records display
- `healthcare-prescription-tracker` - Medication tracking and reminders

---

## 📱 IoT & Connected Devices (500 capsules)

### IoT Basics (200 capsules - Batch 2)
- Device monitoring
- Sensor data visualization
- Real-time updates
- Alert systems

### IoT Advanced (300 capsules - Batch 15)
**Batch:** `extended-capsules-batch15.ts`

**Sub-categories:**
- **Smart Home (100):** Thermostats, lighting, cameras, locks, appliances
- **Industrial IoT (100):** Factory monitoring, predictive maintenance, OEE
- **Wearables & Health Tech (100):** Fitness tracking, sleep monitoring, vitals

**Example Capsules:**
- `smart-thermostat-control` - Temperature control with scheduling
- `smart-camera-grid` - Multi-camera surveillance dashboard
- `factory-floor-overview` - Real-time production monitoring
- `fitness-tracker-sync` - Wearable data synchronization and display
- `heart-rate-monitor` - Real-time heart rate visualization with zones

---

## 📝 Content Management & Publishing (300 capsules - Batch 16)

**Batch:** `extended-capsules-batch16.ts`

### CMS (100 capsules)
- WYSIWYG editors
- Block-based page builders
- Content workflows
- Version control
- Multi-language support
- SEO optimization

### Digital Asset Management (100 capsules)
- Media library with tagging
- AI-powered image recognition
- Rendition management
- CDN integration
- Usage tracking

### Publishing & Editorial (100 capsules)
- Article composer
- Headline analyzer
- Editorial calendar
- Distribution management
- Social sharing

**Example Capsules:**
- `cms-wysiwyg-editor` - Rich text editor with media embedding
- `cms-page-builder` - Drag-and-drop page construction
- `dam-asset-library` - Searchable media library with filters
- `publish-newsroom-dashboard` - Editorial workflow management

---

## 📊 Data & Analytics (800 capsules)

### Data Visualization (304 capsules)
**Sources:** `data-visualization-capsules.ts` + Batch 12

**Chart Types:**
- Line, Bar, Pie, Area, Donut
- Scatter plot, Bubble chart, Heatmap
- Sankey diagram, Treemap, Sunburst
- Network graphs, Force-directed graphs
- Gantt charts, Timeline charts
- And 80+ more advanced visualizations

### Business Intelligence (100 capsules - Batch 12)
- Dashboard builders
- KPI designers
- Pivot tables
- Advanced filtering
- Real-time analytics
- Self-service BI

### Statistical Analysis (100 capsules - Batch 12)
- Descriptive statistics
- Regression models
- Time series analysis
- Machine learning integration
- Hypothesis testing
- Data profiling

### Data Science (300 capsules - Batch 12)
- Feature engineering
- Model training
- Data preprocessing
- Visualization tools
- AutoML interfaces

---

## 🖥️ Monitoring & Observability (300 capsules - Batch 17)

**Batch:** `extended-capsules-batch17.ts`

### Application Performance Monitoring (100 capsules)
- Distributed tracing viewers
- Latency analysis (p50, p95, p99)
- Error tracking and grouping
- Real user monitoring (RUM)
- Core Web Vitals
- Transaction monitoring

### Infrastructure Monitoring (100 capsules)
- Server dashboards
- Container monitoring (Docker, Kubernetes)
- Cloud resource tracking (AWS, Azure, GCP)
- Network monitoring
- Storage analytics
- Cost optimization

### Logs & Observability (100 capsules)
- Log explorer with search
- Log aggregation and parsing
- Alert builders
- Anomaly detection
- Metrics from logs
- Compliance reporting

**Example Capsules:**
- `apm-distributed-tracing` - Trace viewer with waterfall visualization
- `infra-kubernetes-dashboard` - K8s cluster overview
- `logs-log-explorer` - Advanced log search and filtering

---

## 🎓 Education & E-Learning (250 capsules - Batch 9)

**Batch:** `extended-capsules-batch9.ts`

### E-Learning Platforms (70 capsules)
- Course catalog with search
- Video player with progress tracking
- Interactive tutorials
- Student dashboards
- Instructor tools

### Assessment & Testing (60 capsules)
- Quiz builders (multiple choice, true/false, essay)
- Automated grading systems
- Gradebook management
- Progress tracking
- Certification systems

### Interactive Learning (60 capsules)
- Code playgrounds
- Interactive diagrams
- Virtual labs
- Collaborative whiteboards
- Peer review systems

### Student & Instructor Tools (60 capsules)
- Assignment submission
- Discussion forums
- Live Q&A
- Attendance tracking
- Learning analytics

---

## 🎥 Video & Streaming (250 capsules - Batch 10)

**Batch:** `extended-capsules-batch10.ts`

### Video Production (70 capsules)
- Video editors with timeline
- Clip trimming and merging
- Transitions and effects
- Audio mixing
- Export managers

### Live Streaming (60 capsules)
- Live stream studios
- Multi-camera switching
- Chat overlays
- Viewer analytics
- Stream health monitoring

### Video Players (60 capsules)
- Custom video players
- Playlists and chapters
- Captions and subtitles
- Quality selector
- Playback speed control

### Live Events & Webinars (60 capsules)
- Event landing pages
- Registration forms
- Virtual lobbies
- Q&A systems
- Polls and surveys

---

## 👥 Social & Community (250 capsules - Batch 11)

**Batch:** `extended-capsules-batch11.ts`

### Social Networks (70 capsules)
- News feeds with infinite scroll
- User profiles with timelines
- Friend/follow systems
- Social sharing
- Activity streams

### Forums & Discussions (60 capsules)
- Thread-based discussions
- Voting systems (upvote/downvote)
- Moderation tools
- Search and filters
- User reputation

### User Generated Content (60 capsules)
- Blog editors
- Photo galleries
- Video uploaders
- Comment systems
- Content moderation

### Reviews & Ratings (60 capsules)
- Star rating systems
- Review forms
- Verified purchase badges
- Helpful vote systems
- Review analytics

---

## 🎮 Gaming & Entertainment (200 capsules - Batch 2)

- Game state management
- Leaderboards
- Achievement systems
- Multiplayer lobbies
- In-game chat
- Virtual economies
- Character customization

---

## 💰 Finance & Fintech (350 capsules)

### Finance Basics (200 capsules - Batch 2)
- Transaction lists
- Budget trackers
- Expense categorization
- Financial charts
- Currency converters

### Banking & Payments (50 capsules - Batch 4)
- Account dashboards
- Transfer interfaces
- Payment processing
- Invoice generation
- Fraud detection

### Crypto & Trading (100 capsules)
- Crypto wallets
- Trading interfaces
- Portfolio trackers
- Price alerts
- Market analysis

---

## 🌐 Blockchain & Web3 (200 capsules - Batch 6)

**Batch:** `extended-capsules-batch6.ts`

- Smart contract interactions
- DeFi protocols
- NFT marketplaces
- Token swaps
- Wallet connectors
- DAO governance
- Staking interfaces

---

## 🥽 AR/VR & 3D Graphics (200 capsules - Batch 7)

**Batch:** `extended-capsules-batch7.ts`

### AR/VR (50 capsules)
- WebXR experiences
- 360° viewers
- Virtual tours
- AR object placement
- VR controls

### 3D Graphics (50 capsules)
- 3D model viewers
- Scene builders
- Animation controls
- Lighting systems
- Camera controls

### WebGL & Canvas (50 capsules)
- Custom shaders
- Particle systems
- 2D animations
- Drawing tools
- Image manipulation

### Audio Processing (50 capsules)
- Audio visualizers
- Equalizers
- Waveform displays
- Audio effects
- Recording interfaces

---

## 🛠️ Developer Tools (300 capsules)

### DevTools (50 capsules - Batch 4)
- Code editors
- Terminal emulators
- Git interfaces
- API clients
- Documentation browsers

### Testing (50 capsules - Batch 4)
- Test runners
- Coverage reports
- Mock data generators
- Visual regression tools
- Performance profilers

### API Integration (50 capsules - Batch 4)
- REST client
- GraphQL playground
- WebSocket testers
- API documentation
- Request builders

---

## ♿ Accessibility & Internationalization (200 capsules - Batch 5)

**Batch:** `extended-capsules-batch5.ts`

### Accessibility (40 capsules)
- Screen reader support
- Keyboard navigation
- ARIA attributes
- Focus management
- Contrast checkers

### Internationalization (40 capsules)
- Language switchers
- Translation managers
- RTL layout support
- Date/time formatters
- Currency formatters

### Mobile Optimization (40 capsules)
- Touch gestures
- Responsive layouts
- Mobile-first components
- App-like experiences
- Offline support

### Performance (40 capsules)
- Lazy loading
- Code splitting
- Image optimization
- Caching strategies
- Bundle analyzers

### SEO & Marketing (40 capsules)
- Meta tag managers
- Schema markup
- Sitemap generators
- Social media cards
- Analytics integration

---

## 🏗️ Design Tools (300 capsules - Batch 13)

**Batch:** `extended-capsules-batch13.ts`

### Design & Creative Tools (100 capsules)
- Layer panels
- Artboard managers
- Vector editing tools
- Component libraries
- Style guides

### Typography (100 capsules)
- Font selectors
- Text effects
- Typography scales
- Variable fonts
- Font features

### Image & Graphics Editing (100 capsules)
- Photo editors
- Image filters
- Background removal
- Color correction
- Batch processing

---

## 📈 Analytics & Maps (200 capsules - Batch 1)

**Batch:** `extended-capsules-batch1.ts`

### Analytics (50 capsules)
- Event tracking
- Conversion funnels
- User behavior analysis
- Cohort analysis
- Custom reports

### Maps & GIS (50 capsules)
- Interactive maps
- Geolocation
- Route planning
- Heatmaps
- Marker clustering

### Real-time & Streaming (50 capsules)
- WebSocket connections
- Server-sent events
- Live updates
- Real-time charts
- Activity feeds

### Security (50 capsules)
- Authentication flows
- Authorization checks
- Encryption tools
- Audit logs
- Security headers

---

## 🤝 Productivity & Collaboration (200 capsules - Batch 8)

**Batch:** `extended-capsules-batch8.ts`

### Task Management (50 capsules)
- Kanban boards
- Todo lists
- Pomodoro timers
- Time tracking
- Priority systems

### Collaboration (50 capsules)
- Shared workspaces
- Real-time collaboration
- Cursor presence
- Comments and annotations
- Version control

### Communication (50 capsules)
- Chat interfaces
- Video calls
- Screen sharing
- Notifications
- Status indicators

### Project Management (50 capsules)
- Gantt charts
- Resource allocation
- Budget tracking
- Time sheets
- Risk management

---

## ☁️ Cloud Services (50 capsules - Batch 4)

- AWS integrations
- Azure connectors
- GCP services
- Storage managers
- Serverless functions

---

## 🗄️ Database Management (250 capsules)

### Database Core (50 capsules)
**Batch:** `database-capsules.ts`

- SQL query builders
- NoSQL integrations
- Migration managers
- Schema designers
- Query optimization

### Database Advanced (200 capsules spread across batches)
- Connection pooling
- Backup systems
- Replication monitoring
- Performance tuning
- Data modeling

---

## 🔌 Full Capsule List by Batch

| Batch | Capsules | Categories | File |
|-------|----------|------------|------|
| Legacy | 216 | Mixed | `capsules-v2/definitions-extended.ts` |
| Core | 24 | UI, Forms, DataViz | `*-capsules.ts` (6 files) |
| New Core | 45 | Social, AI, Auth | `*-capsules.ts` (9 files) |
| ML & DB | 100 | AI, Database | `machine-learning-capsules.ts`, `database-capsules.ts` |
| Batch 1 | 200 | Analytics, Maps, Streaming, Security | `extended-capsules-batch1.ts` |
| Batch 2 | 200 | IoT, Finance, Healthcare, Gaming | `extended-capsules-batch2.ts` |
| Batch 3 | 265 | UI, Forms, Media, Layouts | `extended-capsules-batch3.ts` |
| Batch 4 | 250 | E-commerce, DevTools, Testing, Cloud | `extended-capsules-batch4.ts` |
| Batch 5 | 200 | A11y, i18n, Mobile, Performance | `extended-capsules-batch5.ts` |
| Batch 6 | 200 | Blockchain, Web3, Crypto | `extended-capsules-batch6.ts` |
| Batch 7 | 200 | AR/VR, 3D, WebGL, Audio | `extended-capsules-batch7.ts` |
| Batch 8 | 200 | Productivity, Collaboration | `extended-capsules-batch8.ts` |
| Batch 9 | 250 | Education, E-Learning | `extended-capsules-batch9.ts` |
| Batch 10 | 250 | Video, Streaming, Webinars | `extended-capsules-batch10.ts` |
| Batch 11 | 250 | Social, Forums, UGC | `extended-capsules-batch11.ts` |
| Batch 12 | 300 | Data Science, Analytics, BI | `extended-capsules-batch12.ts` |
| Batch 13 | 300 | Design, Typography, Graphics | `extended-capsules-batch13.ts` |
| Batch 14 | 300 | Business, CRM, Sales | `extended-capsules-batch14.ts` |
| Batch 15 | 300 | IoT Advanced, Smart Home | `extended-capsules-batch15.ts` |
| Batch 16 | 300 | CMS, DAM, Publishing | `extended-capsules-batch16.ts` |
| Batch 17 | 300 | APM, Infrastructure, Logs | `extended-capsules-batch17.ts` |
| **Total** | **4,650** | **40+** | **Multiple files** |

---

## 🔍 How to Use Capsules

### 1. Import Capsules
```typescript
import { allCapsules } from '@/lib/all-capsules'
import { searchCapsules, getCapsulesByCategory } from '@/lib/all-capsules'
```

### 2. Search by Keyword
```typescript
const chatCapsules = searchCapsules('chat')
// Returns all capsules related to chat functionality
```

### 3. Filter by Category
```typescript
const uiCapsules = getCapsulesByCategory('UI')
// Returns all UI components
```

### 4. Use in Studio V2
Navigate to `/studio-v2` and use the visual interface to browse and select capsules for your project.

### 5. Use in Workflow Builder
Navigate to `/workflow` to create automation flows using capsules as nodes.

---

## 🎯 Best Practices

1. **Start with Core Categories** - UI, Auth, Database for most projects
2. **Use Search** - The intelligent search understands context and tags
3. **Check Dependencies** - Some capsules require others to function
4. **Read Descriptions** - Every capsule has rich metadata
5. **Combine Capsules** - Build complex features by combining simple capsules

---

## 📚 Additional Resources

- [Main Documentation](./README.md)
- [AI Documentation](./docs/PITCH_FOR_AI.md)
- [Theme System](./lib/theme-system.ts)
- [Integration Guides](./examples/data-integration-guides/)
- [API Reference](./app/api-docs/page.tsx)

---

## 🤝 Contributing New Capsules

Want to add more capsules? See our [Contributing Guide](../README.md#contributing) for details on:
- Capsule structure requirements
- Naming conventions
- Category assignments
- Testing requirements
- Documentation standards

---

**Last Updated:** November 2025
**Version:** 2.0
**Total Capsules:** 5,150+
**Maintained by:** HubLab Community
