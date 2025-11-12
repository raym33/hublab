# Workflow Builder - Features & Technical Design

## 🎯 Core Philosophy

This workflow builder is designed for **real programmers** who want to:
1. **Visualize workflows** before coding
2. **Generate production-ready code** from visual designs
3. **Understand data flow** between components
4. **Validate connections** to avoid runtime errors

---

## 🔌 Type System

### Data Types
Each capsule has **typed inputs and outputs**:

- `string` - Text data
- `number` - Numeric values
- `boolean` - True/false
- `object` - JSON objects
- `array` - Lists
- `user` - User profile objects
- `email` - Email data structures
- `http-response` - HTTP API responses
- `database-row` - Database query results
- `file` - File buffers/URLs
- `token` - Authentication tokens
- `payment` - Payment intents
- `error` - Error objects
- `any` - Accepts any type

### Type Compatibility

The system validates connections:

```typescript
// ✅ Valid: HTTP response → Validator
http.outputPorts = [{ type: 'http-response' }]
validator.inputPorts = [{ type: ['object', 'http-response'] }]

// ❌ Invalid: Email → Database Query
email.outputPorts = [{ type: 'email' }]
database.inputPorts = [{ type: ['object'] }]  // email ≠ object
```

---

## 🧩 Capsule Structure

Each capsule has:

```typescript
{
  id: 'ai-chat',
  name: 'AI Chat',

  // Configuration fields (shown in UI)
  configFields: [
    { name: 'model', type: 'select', options: ['gpt-4', 'claude-3-opus'] },
    { name: 'prompt', type: 'textarea', required: true }
  ],

  // Typed input ports
  inputPorts: [
    { id: 'context', name: 'Context', type: ['string', 'object'], required: false }
  ],

  // Typed output ports
  outputPorts: [
    { id: 'response', name: 'Response', type: 'string' },
    { id: 'tokens', name: 'Tokens', type: 'number' }
  ],

  // Code template for generation
  codeTemplate: `
    const openai = new OpenAI({ apiKey: '{{config.apiKey}}' })
    const completion = await openai.chat.completions.create({
      model: '{{config.model}}',
      messages: [{ role: 'user', content: '{{config.prompt}}' }]
    })
    const aiResponse = completion.choices[0].message.content
  `
}
```

---

## 📊 Data Flow

### Connection Validation

When connecting two nodes:

1. **Check output type** of source node
2. **Check input types** of target node
3. **Validate compatibility** using type system
4. **Show visual feedback** (green = valid, red = invalid)

Example workflow:

```
Webhook (POST /api/contact)
  └─ body: object
       ↓
Validator (z.object({ email, name }))
  └─ data: object (valid ✅)
       ↓
Email (Send welcome email)
  └─ recipient: email/object (valid ✅)
       ↓
Logger (Log sent email)
  └─ data: any (valid ✅)
```

---

## 💻 Code Generation

### Smart Code Generation

The generator:

1. **Analyzes workflow graph**
2. **Performs topological sort** for execution order
3. **Detects circular dependencies**
4. **Extracts environment variables**
5. **Generates type-safe code**

### Generated Code Structure

```typescript
/**
 * Generated Workflow Code
 * Production-ready TypeScript
 */

// npm install openai resend winston

// Environment variables:
// OPENAI_API_KEY=sk-xxx
// RESEND_API_KEY=re_xxx

import { createWorkflow, WorkflowContext } from 'capsulas-framework'

interface WorkflowInput {
  [key: string]: any
}

export async function executeWorkflow(input: WorkflowInput) {
  const ctx: WorkflowContext = { input, results: {} }

  // Step 1: Webhook
  try {
    const webhook_input = ctx.input
    ctx.results['webhook-1'] = webhook_input
  } catch (error) {
    console.error('Error in Webhook:', error)
    throw error
  }

  // Step 2: AI Chat
  try {
    const ai_input = ctx.results['webhook-1']

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Analyze: ${ai_input}` }]
    })
    const aiResponse = completion.choices[0].message.content

    ctx.results['ai-chat-1'] = aiResponse
  } catch (error) {
    console.error('Error in AI Chat:', error)
    throw error
  }

  // Step 3: Email
  try {
    const email_input = ctx.results['ai-chat-1']

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data } = await resend.emails.send({
      from: 'noreply@yourapp.com',
      to: 'user@example.com',
      subject: 'AI Analysis Complete',
      html: email_input
    })

    ctx.results['email-1'] = data
  } catch (error) {
    console.error('Error in Email:', error)
    throw error
  }

  return ctx.results['email-1']
}
```

---

## 🎨 Templates

### Pre-built Workflows

5 production-ready templates:

1. **Email Automation** - Webhook → Validator → Email → Logger
2. **AI Content Pipeline** - AI → Markdown → PDF → Email
3. **API Integration** - HTTP → Transform → Cache
4. **Payment Flow** - Stripe → SMS → Database
5. **Rate Limited API** - Rate Limiter → Validator → Database

Each template includes:
- Complete node configurations
- Working connections
- Required environment variables
- Ready-to-use code

---

## ✅ Validation

### Real-time Validation

- **Required fields** highlighted
- **Type mismatches** caught before execution
- **Circular dependencies** detected
- **Missing connections** identified

### Validation Feedback

```
✅ All configurations valid
❌ 3 errors found:
  - Node 'email-1': Field 'apiKey' is required
  - Node 'validator-1': Field 'schema' is required
  - Connection 'http-1' → 'email-1': Type mismatch (http-response → email)
```

---

## 🚀 Usage Flow

### For Programmers

1. **Start from template** or build from scratch
2. **Drag capsules** to canvas
3. **Configure each node** with real parameters
4. **Connect nodes** (validation automatic)
5. **Click "Validate"** to check everything
6. **Click "View Code"** to see generated TypeScript
7. **Copy code** and paste into your project
8. **Run it** - it's production-ready!

### What You Get

- ✅ Executable TypeScript code
- ✅ All npm packages listed
- ✅ Environment variables documented
- ✅ Error handling included
- ✅ Type-safe interfaces
- ✅ Topologically sorted execution
- ✅ No circular dependencies

---

## 🎯 Design Decisions

### Why Type System?

- **Catch errors early** (design time vs. runtime)
- **Guide programmers** (only show valid connections)
- **Generate better code** (type-aware code gen)
- **Self-documenting** (types explain data flow)

### Why Code Templates?

- **Consistent code** across all workflows
- **Best practices** built-in
- **Easy to customize** (templates are readable)
- **Framework-agnostic** (can adapt to any framework)

### Why Topological Sort?

- **Correct execution order** guaranteed
- **Detects circular deps** automatically
- **Enables parallel execution** (in future)
- **Standard CS algorithm** (well-understood)

---

## 📚 Technical Stack

- **React Flow** - Visual graph library
- **TypeScript** - Type safety
- **Zod** - Runtime validation
- **Topological Sort** - Execution order
- **AST Generation** - Code generation

---

## 🔮 Future Enhancements

- [ ] **Test mode** - Run workflows in browser
- [ ] **Debug mode** - Step through execution
- [ ] **Variables panel** - Manage global vars
- [ ] **Subflows** - Reusable workflow components
- [ ] **Version control** - Git integration
- [ ] **Collaboration** - Real-time multi-user editing
- [ ] **Deployment** - One-click deploy to cloud
- [ ] **Monitoring** - Live workflow execution stats

---

**This workflow builder bridges the gap between visual design and production code.**