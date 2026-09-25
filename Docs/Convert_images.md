

Convert **all website images to AVIF format**, but process them **strictly one by one** to prevent excessive CPU/RAM usage. The system becomes unstable when multiple images are processed simultaneously, so **do not batch-convert, parallelize, or mass-process images**.

### 1. Image Conversion

* Convert every required website image individually to `.avif`.
* Check all images from assets/images and assets/gallery directory.
* After converting **each image**, immediately verify that:

  * The AVIF file exists.
  * It can be opened/read correctly.
  * The filename is exactly correct.
  * The corresponding website reference points to the exact filename.
* Carefully handle spaces, parentheses, capitalization, and special characters in filenames.
* Prefer a consistent **lowercase naming convention** for all converted assets.

### 2. Case-Sensitivity — CRITICAL

The project has previously suffered from a **Git/Windows case-sensitivity bug**.

Windows is case-insensitive, while Vercel/Linux is case-sensitive. Simply renaming files from uppercase to lowercase on Windows is **not sufficient**, because Git may continue tracking the old casing.

Therefore:

* Do **not** assume a successful local rename means Git has registered the change.
* When changing filename casing, use a proper two-step `git mv` process through a temporary filename, for example:

  * `git mv OldName.avif temp-name.avif`
  * `git mv temp-name.avif oldname.avif`
* Verify the final casing using **Git's tracked file tree**, not just the Windows filesystem.
* Check `git ls-files` and confirm every tracked image filename exactly matches the casing used in the source code.
* Treat the repository as if it will be deployed on a **strict Linux/Vercel environment**.

### 3. Image Reference Audit

After conversion, perform a **complete project-wide audit** of image references.

Check every:

* `.jsx`
* `.tsx`
* `.js`
* `.ts`
* `.css`
* `.html`
* Configuration/data files
* Menu data
* Gallery data
* Component-level image references

Verify that every referenced image:

1. Actually exists.
2. Uses the correct `.avif` extension.
3. Uses the exact filename and casing.
4. Matches the actual file in the repository.
5. Does not reference an old `.png`, `.jpg`, `.jpeg`, `.webp`, or incorrectly named AVIF file.

Do not blindly replace extensions. **Map each reference to the correct actual asset.**

### 4. Missing Deal Image — CRITICAL

There is a known missing reference:

`deal.avif`

The source assets do **not** contain `deal (1).png`; the available deal images start from `deal (2)` through `deal (6)`, while `deal.avif` exists.

Therefore:

* Search the entire project for references to `deal.avif`.
* In particular, check:

  * `FeaturedMenu.jsx`
  * `FullMenuModal.jsx`
  * Any menu/deal data files
* Replace the invalid `deal.avif` reference with the existing correct `deal.avif`.
* Perform another global search afterward to ensure **zero references** to the nonexistent `deal.avif` remain.

### 5. Complete Asset Verification

After all conversions and reference updates, create a systematic verification process.

Check:

* Hero images
* Menu images
* Deal images
* Offer images
* Gallery images
* About images
* Logos
* Favicon
* Background images
* Modal images
* Any other visual assets

There must be **zero broken image references**.

### 7. Build & Runtime Verification

Do not consider the task complete merely because the files were converted.

After implementation:

* Run the project's build.
* Fix every build error.
* Check for missing asset warnings.
* Search for broken/incorrect image paths.
* Verify the relevant pages/components render correctly.
* Check both desktop and mobile behavior.
* Pay particular attention to Vercel/Linux case sensitivity.

### 8. Persistence Requirement — DO NOT STOP AFTER THE FIRST FIX

**This is critical:**

If the first implementation/response claims the problem is fixed but **any of the above issues persist**, continue investigating and fixing them.

Do not stop after saying:

> "The images have been converted."

or:

> "The paths have been updated."

The task is only complete when you have **verified the actual repository state and application references**.

If you discover:

* Incorrect image names
* Incorrect capitalization
* Missing assets
* Broken thumbnails
* Wrong `.avif` references
* Git tracking still using old filename casing
* Vercel/Linux case-sensitivity problems
* Broken menu images
* Broken deal images
* Broken modal navigation
* Build errors
* Runtime errors

**Fix the issue, re-check the project, and repeat the verification until the issue is actually resolved.**


If anything fails at any stage, **do not stop**. Fix it and verify again until the entire chain is correct.
