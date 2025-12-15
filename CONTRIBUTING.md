# Contributing to JargoNaut

First off, thank you for considering contributing to JargoNaut! 🎉

This is a learning project, and contributions from developers of all skill levels are welcome. Whether you're fixing a typo, suggesting a feature, or submitting code, your help is appreciated.

## 🤝 Code of Conduct

Be kind, respectful, and constructive. This is a learning environment where questions are encouraged and mistakes are learning opportunities.

## 🐛 Found a Bug?

1. **Check existing issues** to see if it's already reported
2. **Open a new issue** with:
   - Clear title describing the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS version
   - Screenshots if applicable

## 💡 Have a Feature Idea?

1. **Check existing issues** to avoid duplicates
2. **Open a feature request** with:
   - Clear description of the feature
   - Why it would be useful
   - How you envision it working
   - Any technical considerations

## 🔧 Want to Submit Code?

### First-Time Contributors

If you're new to open source, welcome! Here are some good first issues:

- Improve error messages
- Add code comments
- Fix typos in documentation
- Improve UI styling
- Add dark mode support

### Development Setup

1. **Fork the repository**
```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/jargonaut.git
   cd jargonaut
```

2. **Create a branch**
```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test in both Chrome and Safari if possible

4. **Test your changes**
   - Load the extension in Chrome/Safari
   - Test on Twitter/X and LinkedIn
   - Make sure existing features still work

### Commit Guidelines

Use clear, descriptive commit messages:
```bash
# Good examples:
git commit -m "feat: Add dark mode support"
git commit -m "fix: Resolve API key validation bug"
git commit -m "docs: Update installation instructions"

# Format:
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# style: Formatting, missing semicolons, etc.
# refactor: Code restructuring
# test: Adding tests
# chore: Maintenance tasks
```

### Submitting a Pull Request

1. **Push your changes**
```bash
   git push origin feature/your-feature-name
```

2. **Open a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs if UI changes
   - Testing steps you followed

3. **Respond to feedback**
   - Be open to suggestions
   - Make requested changes
   - Ask questions if unclear

## 📁 Project Structure

Understanding the codebase:
```
extensions/
├── chrome/
│   ├── core/
│   │   ├── ai-engine.js      # OpenRouter API integration
│   │   └── config.js          # Configuration
│   ├── src/
│   │   ├── background/        # Background service worker
│   │   ├── content/           # Content scripts (inject button)
│   │   └── popup/             # Extension popup UI
│   └── manifest.json          # Chrome extension manifest
└── JargoNaut Safari/          # Safari extension (Xcode project)
```

**Key files to know:**
- `ai-engine.js` - Handles AI prompts and API calls
- `content.js` - Injects button and extracts post text
- `background.js` - Manages API requests and storage
- `popup.js` - Settings UI functionality

## 🎨 Coding Standards

- **JavaScript:** Use modern ES6+ syntax
- **Indentation:** 2 spaces
- **Naming:** camelCase for variables/functions
- **Comments:** Explain why, not what
- **Console logs:** Remove before committing (or use debug flags)

## 🧪 Testing

Currently, we don't have automated tests (contributions welcome!). Manual testing checklist:

- [ ] Extension loads without errors
- [ ] Button appears on posts
- [ ] API key saves correctly
- [ ] Explanations display properly
- [ ] No console errors
- [ ] Works on Twitter/X
- [ ] Works on LinkedIn
- [ ] UI is responsive

## 📝 Documentation

Good documentation helps everyone:

- Update README.md if changing features
- Add code comments for complex logic
- Document new configuration options
- Update CHANGELOG.md for significant changes

## 🚀 Areas Where Help is Needed

**High Priority:**
- [ ] Add automated tests (Jest, Mocha)
- [ ] Improve AI prompt accuracy
- [ ] Better error handling
- [ ] Add keyboard shortcuts
- [ ] Dark mode support

**Medium Priority:**
- [ ] Support for Reddit
- [ ] Support for Discord
- [ ] User preference settings
- [ ] Shared jargon database

**Low Priority:**
- [ ] Analytics (privacy-preserving)
- [ ] Internationalization
- [ ] Multiple AI models

## 🤔 Questions?

- **Not sure where to start?** Comment on an issue you're interested in
- **Stuck on something?** Open a discussion or draft PR for help
- **Want to chat?** Reach out via GitHub discussions

## 🙏 Thank You!

Every contribution, no matter how small, makes JargoNaut better. Whether you're fixing a typo or adding a major feature, your effort is valued and appreciated.

Happy coding! 🧭

---

**Remember:** This is a learning project. Mistakes are expected and welcomed as learning opportunities. Don't be afraid to contribute!
