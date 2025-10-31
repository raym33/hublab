# Iterative AI - Quick Manual

## Overview
The Iterative AI system allows you to improve your generated apps through natural language conversation. Instead of regenerating from scratch, you can make incremental improvements while preserving your existing code.

## How to Use

### 1. Generate an App
First, create an app using the Compiler:
- Enter a prompt like "Create a todo app with dark mode"
- Click "Generate" and wait for the app to be created

### 2. Open the AI Chat
Once your app is generated:
- Click the **"Improve with AI"** button in the left sidebar
- The chat panel will appear on the right side

### 3. Make Improvements
Type natural language instructions to improve your app:

**Examples:**
- "Make it responsive for mobile"
- "Add dark mode toggle"
- "Improve the color scheme"
- "Add loading states"
- "Make it more accessible"
- "Add animations"
- "Improve the layout"

**Quick Suggestions:**
Click any of the suggestion chips for common improvements:
- Add dark mode toggle
- Make it responsive
- Add animations
- Improve colors
- Add loading states
- Add error handling

### 4. Review Changes
- The AI will analyze your current code
- Apply minimal, incremental changes
- Preserve existing functionality
- Show the improved version in the preview

### 5. Undo if Needed
- Click the **Undo** button to revert to the previous version
- You can undo multiple times (full version history)
- All previous prompts are tracked

## Features

### Context-Aware Improvements
- The AI knows all previous changes you've made
- Each improvement builds on the last
- Maintains consistency across iterations

### Smart Validation
- Code is validated before being applied
- Syntax errors are caught automatically
- Failed improvements won't break your app

### Version History
- Every improvement is saved
- Full undo/redo capability
- Track all changes made

### Minimal Changes
- AI uses low temperature (0.3) for predictability
- Only changes what's necessary
- Preserves working functionality

## Best Practices

### Be Specific
✅ Good: "Add a dark mode toggle button in the header"
❌ Bad: "Make it better"

### Incremental Changes
✅ Good: Make one improvement at a time
❌ Bad: Ask for 10 different changes at once

### Use Suggestions
✅ Click suggestion chips for common improvements
✅ They're optimized for best results

### Review Before Continuing
✅ Check the preview after each change
✅ Use undo if something doesn't look right

## Technical Details

### How It Works
1. **Analyze**: AI reads your current code
2. **Improve**: Applies your instruction with minimal changes
3. **Validate**: Checks syntax and structure
4. **Compile**: Recompiles the improved code
5. **Update**: Shows new version in preview

### What Gets Tracked
- Current code state
- All previous prompts
- Version history (for undo)
- Platform and settings

### API Endpoint
```
POST /api/compiler/improve
{
  "instruction": "Make it responsive",
  "currentCode": { ... },
  "previousPrompts": [...],
  "platform": "web"
}
```

## Troubleshooting

### Chat Not Appearing
- Make sure you've generated an app first
- Click "Improve with AI" to toggle the chat

### Improvements Not Working
- Check that your instruction is specific
- Try one of the suggestion chips
- Review the console for errors

### Want to Start Over
- Click "Generate" to create a new app
- Or use undo to go back multiple versions

## Keyboard Shortcuts

- **Enter**: Send message (in chat input)
- **Esc**: Close chat panel (when focused)

## Limits

- Version history: Unlimited (stored in browser memory)
- Message length: No hard limit (be reasonable)
- Concurrent improvements: One at a time

## Examples

### Example 1: Add Dark Mode
```
User: "Add a dark mode toggle"
AI: *Adds toggle button and dark theme styles*
User: "Make the dark mode colors more vibrant"
AI: *Adjusts color palette for better contrast*
```

### Example 2: Responsive Design
```
User: "Make it responsive for mobile"
AI: *Adds media queries and mobile layout*
User: "The menu should be a hamburger on mobile"
AI: *Converts menu to hamburger icon with drawer*
```

### Example 3: Improve UX
```
User: "Add loading states"
AI: *Adds spinners and loading indicators*
User: "Add success animations"
AI: *Adds checkmark animations on completion*
User: "Add error handling with user-friendly messages"
AI: *Adds error boundaries and friendly error messages*
```

## Tips for Best Results

1. **Start Simple**: Begin with basic improvements
2. **Be Clear**: Use specific, actionable language
3. **One Thing at a Time**: Focus on one improvement per prompt
4. **Review Changes**: Check the preview after each change
5. **Use Undo**: Don't be afraid to undo and try again
6. **Build Iteratively**: Each improvement builds on the last

## What Makes This Different

### vs. Regenerating from Scratch
- ✅ Preserves your exact code structure
- ✅ Faster (no full recompilation)
- ✅ More predictable results
- ✅ Keeps custom changes

### vs. Manual Editing
- ✅ Natural language instead of code
- ✅ AI suggests best practices
- ✅ Faster for common improvements
- ✅ Learns from context

## Next Steps

After iterating on your app:
1. **Save Project**: Click "Save Project" to store it
2. **Download**: Click "Download" to get the full code
3. **Share**: Share the live preview URL
4. **Keep Improving**: Continue refining with more prompts

---

**Need Help?**
- Check the console for error messages
- Try a different phrasing for your instruction
- Use the suggestion chips for tested improvements
- Review the examples above for inspiration
