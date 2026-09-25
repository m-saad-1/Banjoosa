# PHASE 1 

### Read the instruction in @Agent.md first.

We are working on the **4brotherspizza** project. Update the entire website consistently. **Do not partially update assets. Every relevant page and component must use the new assets and content.**

### 1. Assets & Menu — CRITICAL

* Inspect **all files in `assets/images` and `assets/gallery` first**.
* Update and verify:

  * Logo
  * Favicon
  * Hero images
  * Menu images
  * Offer/Deal images
  * About images
  * Gallery images
  * Dashboard Content and media tab images

* Match **menu images → menu items → categories** strictly according to the actual image filenames.
* Match **deal/offer images → correct deals**.
* Apply the updated assets consistently across **Homepage, Menu, Offers, About, modals, cards, and every other component where they are used**.
* Match **offer and Gallery images with dashboard content and media images**
* Do not leave old images, placeholders, or unrelated assets anywhere.

### 2. Content

Replace all previous restaurant information with accurate content using:

Current Project Name.

Update the restaurant name, About, menu, prices, categories, offers, contact details, location, opening hours, social links, footer, reservations, gallery, and all other restaurant-specific content.

### 3. Theme

Change the complete website color from #E31B23 to #FFC928. 

Apply it consistently while maintaining proper contrast and readability.

### 4. Mandatory Asset Verification

**Do not assume an asset update is complete. Verify it.**

After implementation, audit **every page and component** for image references and confirm:

`Reference → Correct path → Actual file exists → Correct image → Correct page`

Specifically verify:

* Homepage
* Menu page
* Offers page
* Gallery page
* About page
* Contact
* Reservation
* Cart
* Orders
* Profile
* Header
* Footer
* Footer location, contact and email
* Locations and contact on home and about pages
* Menu/Offer modals
* Mobile components

### 5. Final Cleanup & Validation

Search the entire codebase for:

* Old restaurant names
* Old image paths
* Old image filenames 
* Missing assets
* Broken references
* Placeholder images/content
* Old menu items/categories
* Previous restaurant information

### 6. Update Locations, Map and contact

📞 +92 030000000000

📍Shabaz town Branch
📍Millennium Mall Branch
📍Spinny Road Branch
📍Nawa Killi Branch


* When there is just one location, dont show the branch selection bar in the Dashboard.

* Change the demo map to the actual map of the location.

Verify location, email adn contact in:
* Home page
* about page
* Reservation page
* dashboard
* footer etc. 
Just keep locations that are provided, no duplication, no missing anywhere. 


### 7. Update Dashboard

* Update dashbaord Logo and logo text
* Update Dashboard Theme
* Content and Media 


### 8. Code Integrity & Formatting (Crucial)

**Avoid Encoding Errors (Mojibake):**
* When editing files (HTML, JS, CSS, MD), you must ensure they are read and written using **UTF-8 encoding**. 
* Specifically verify that emojis (e.g., 👋, 🤖), symbols (e.g., ★, ✓, –, —), and box-drawing characters are not mangled or turned into "raw texted" corrupted formats like `★` or `` or `🤖`.
* If you perform mass text replacements, always double-check the resulting string integrity of the edited files.


## CRITICAL AUDIT

* Check gallery media, make sure it load properly. 
* look for mojibake (emojis and symbols corrupted)
* Look for overall theme
* Check offer, hero, logo, and menu images, check if they are loaded properly. 




# PHASE 2

## AVIF Image Conversion — CRITICAL

Convert **all required website images to `.avif`**, processing **strictly one at a time**. **Never batch, parallelize, or mass-process images** due to CPU/RAM limitations.

* Check `assets/images` and `assets/gallery`.
* After converting **each image**, immediately verify:

  * AVIF exists and is readable.
  * Filename is correct.
  * Source-code reference matches the exact filename.
  * Correct source image was converted.
* Handle spaces, parentheses, capitalization, and special characters carefully.
* Prefer lowercase filenames.

### Case Sensitivity

Windows is case-insensitive; Linux/Vercel is case-sensitive. Filename casing must match **Git, filesystem, and source code exactly**.

For casing changes, use:

```bash
git mv OldName.avif temp-name.avif
git mv temp-name.avif oldname.avif
```

Verify with `git ls-files`. Never rely only on Windows Explorer.

### Image Reference Audit

After conversion, audit all image references across source, CSS, HTML, and data files.

Every reference must:

`Exist → Use .avif → Match exact filename/casing → Point to correct asset`

Do not blindly replace extensions. Remove old `.png`, `.jpg`, `.jpeg`, `.webp`, broken, or incorrect references.

### Deal Images — CRITICAL

Search the entire project for `deal.avif`, especially menu/deal components and data files.

Verify every reference points to the **actual correct `deal.avif` asset**. Do not assume or rename another deal image to replace it. Also remove references to nonexistent `deal (1).png` or obsolete deal filenames.

### Final Verification

Verify all:

* Hero
* Menu
* Deals/offers
* Gallery
* About
* Logo/favicon
* Backgrounds
* Cards/modals
* Mobile assets

Then:

* Run the build and fix all errors/warnings.
* Check image paths and runtime rendering.
* Verify desktop and mobile.
* Re-check Linux/Vercel filename casing.

**Do not stop after the first fix. If anything fails, fix it and verify again until the entire asset chain is correct.**



**If even one page is still using an old/missing image, fix it before finishing.**

Do not stop after updating only the main page. **The same asset must be updated everywhere it is relevant.**

Finally, verify the complete website on **desktop and mobile** and ensure there are **zero broken images, missing logos, outdated gallery images, or inconsistent menu/offer assets**.


# Push to github

After complete implementation and validation,First create a PRIVATE repo and then push the changes to the `main` branch of the git repository.

Repo Should be: `https://github.com/m-saad-1/4brotherspizza`

