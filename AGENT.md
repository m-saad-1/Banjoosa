# Universal Agent Instructions

## 1. Core Rule

**Read this file before making any changes.**

This is an existing project. **Preserve the existing website/application unless the user explicitly requests a change.**

The goal is:

> **Make exactly the requested changes while preserving everything else.**

Do not redesign, refactor, remove, replace, or "improve" unrelated parts.

---

## 2. Preserve Existing UI & Structure — CRITICAL

**Never make existing content or UI disappear unless the user explicitly asks for it.**

Always preserve:

* Header / Navbar
* Footer
* Logo
* Existing sections
* Existing pages
* Existing components
* Navigation
* Buttons and links
* Forms
* Cards
* Modals
* Existing functionality
* Desktop layout
* Mobile layout
* Responsive behavior
* Existing styling

When updating a page, **do not accidentally remove sections, components, footer, header, or existing functionality.**

If modifying a component, preserve everything that is not part of the request.

Before replacing any component or section, verify that all existing functionality and content are carried over.

---

## 3. Follow the Exact User Scope

Do not make unrequested changes.

Unless explicitly requested, do NOT change:

* Colors
* Typography
* Spacing
* Layout
* Dimensions
* Borders/radius
* Shadows
* Animations
* Hover effects
* Responsive behavior
* Header
* Footer
* Navigation
* Components
* Content
* Images/assets
* URLs
* Functionality
* Data structures
* Architecture

Do not apply "better design", "modernization", or personal preferences without permission.

If the request is ambiguous, ask before making broad changes.

---

## 4. Minimal-Diff Principle

Make the **smallest change necessary**.

* Modify only relevant files.
* Modify only relevant code.
* Do not rewrite entire files for small changes.
* Do not reformat unrelated code.
* Do not rename unrelated variables/classes.
* Do not refactor unrelated code.
* Do not reorganize the project unnecessarily.

For visual changes, prefer **CSS over HTML/JavaScript** when possible.

For CSS-only requests, do not modify JavaScript unless technically required.

---

## 5. Assets & Images

When the user requests an asset update:

1. Inspect the relevant asset directories first.
2. Identify the correct actual files.
3. Match assets to their correct pages/components/content.
4. Update **every relevant reference**, not just the first occurrence.
5. Remove obsolete references only when they are part of the requested update.
6. Verify every referenced asset actually exists.

Never blindly replace image extensions or filenames.

### AVIF Conversion

If the user requests image conversion:

* Convert required images to `.avif`.
* Process images **strictly one at a time**.
* Never batch-convert or parallelize image processing.
* After each conversion, immediately verify:

  * File exists
  * File is readable
  * Filename is correct
  * Source-code reference is correct
  * Actual image matches the intended asset

Check:

* `assets/images`
* `assets/gallery`
* Other relevant asset directories

Audit image references across:

* `.jsx`
* `.tsx`
* `.js`
* `.ts`
* `.css`
* `.html`
* JSON/data/config files

Do not leave broken, missing, placeholder, obsolete, or incorrectly named image references.

---

## 6. Case Sensitivity — CRITICAL

Assume the project will run on **Linux/Vercel**, even if development is performed on Windows.

Filename casing must match exactly between:

* Filesystem
* Git
* Source code

When changing filename casing, use:

```bash
git mv OldName.avif temp-name.avif
git mv temp-name.avif oldname.avif
```

Then verify with:

```bash
git ls-files
```

Do not rely only on Windows Explorer or the local filesystem.

---

## 7. Content Updates

When the user provides new business/project information, update it consistently across every relevant location.

Check:

* Pages
* Header
* Footer
* Cards
* Modals
* Forms
* Contact sections
* Navigation
* Data files
* Metadata where applicable

Do not leave old information behind in another component.

---

## 8. Encoding Integrity

All edited files must remain **UTF-8 encoded**.

After edits, verify that emojis and special characters remain intact.

Watch for Mojibake such as:

```text
★

🤖
```

Do not allow encoding corruption during mass replacements or file rewrites.

---

## 9. Git Safety

Before pushing:

```bash
git status
git remote -v
git diff
git ls-files
```

Verify:

* Correct repository
* Correct branch
* Only intended files are changed
* No unrelated project files are staged
* No accidental deletions
* No incorrect filename casing

Never push to a repository that has not been verified as the intended project.

---

## 10. Verification

Do not assume the task is complete after editing.

Verify the actual result.

Depending on the request, check:

* All relevant pages
* Header
* Footer
* Existing sections
* Components
* Images
* Modals
* Navigation
* Desktop
* Mobile
* Responsive behavior
* Build
* Runtime behavior
* Asset paths
* File casing

For asset changes, verify:

`Reference → Correct Path → File Exists → Correct Asset → Correct Component`

For larger changes, run the project's build and fix all errors before finishing.

---

## 11. Persistence Rule — DO NOT STOP AFTER THE FIRST FIX

If verification discovers a problem:

**Fix it → verify again → repeat until resolved.**

Do not stop after saying:

> "The paths have been updated."

or:

> "The images have been converted."

If broken references, missing assets, deleted sections, build errors, runtime errors, incorrect casing, or outdated content remain, the task is **not complete**.

---

## 12. Before Editing

Determine:

```text
REQUEST:
What exactly did the user ask for?

SCOPE:
Which files/components actually need changes?

PROTECTED:
What existing content, styling, sections, header, footer, and functionality must remain?

METHOD:
What is the smallest safe way to implement it?

VERIFICATION:
How will the result be verified?
```

Do not scan or modify the entire project unnecessarily.

---

## 13. Final Report

After completing the task, provide a concise report:

```text
Changed:
- [file/component] — [change]

Preserved:
- Existing header, footer, sections, styling, and functionality unless explicitly changed.

Verification:
- [brief verification result]
```

Do not provide a long explanation unless requested.

---

# Golden Rule

**Do exactly what the user asks.**

**Do not redesign, refactor, remove, replace, optimize, reorganize, or "fix" anything outside the requested scope.**

**Never allow existing header, footer, sections, components, styling, content, or functionality to disappear accidentally.**

When in doubt:

> **Preserve the existing implementation.**
