# Restaurant Management Dashboard — Complete Demo Product Prompt

## 1. Project Objective

Build a **complete, polished, production-style Restaurant Management Dashboard demo** that demonstrates how a modern restaurant can manage its entire digital operation from one centralized platform.

This is a **demo product**, not a fully production-connected restaurant management system. However, it must **look, behave, and feel like a complete commercial SaaS/RMS product**.

The client should immediately understand:

* What this dashboard is.
* Who uses it.
* What problems it solves.
* What the restaurant can manage from it.
* How orders move through the system.
* How staff, managers, and owners use it.
* How the customer-facing website connects to the dashboard.
* How the dashboard can improve operations, customer experience, sales, and decision-making.

The product should feel comparable in **scope, information architecture, polish, and professionalism** to modern restaurant platforms such as Blink and Indolj, while maintaining its own visual identity and UX.

Do **not** make this look like a generic admin template.

It should look like a **real restaurant operating platform that could be sold to restaurants in Pakistan and internationally**.

---

# 2. Product Positioning

The product should not be presented merely as:

> "Restaurant Website Admin Panel"

It should be positioned as:

> **A centralized Restaurant Management & Ordering Platform**

The platform connects:

```text
Customer
   ↓
Restaurant Website / Online Ordering
   ↓
Ordering System
   ↓
Restaurant Dashboard
   ↓
POS / Kitchen / Delivery / Staff
   ↓
Analytics / CRM / Marketing
```

The dashboard should demonstrate how a restaurant can manage:

* Orders
* POS
* Kitchen
* Menu
* Customers
* Delivery
* Branches
* Reservations
* Inventory
* Promotions
* Loyalty
* Marketing
* Analytics
* Staff
* Website
* QR Menu
* Customer feedback
* Business performance

The demo should make the restaurant owner think:

> "This is not just a website. This is the operating system for my restaurant."

---

# 3. Core Product Structure

Use a clear SaaS dashboard architecture.

Recommended main navigation:

```text
Dashboard
Orders
POS
Kitchen
Menu
Customers
Delivery
Reservations
Branches
Inventory
Promotions
Loyalty
Marketing
Analytics
Staff
Website
QR Menu
Reviews & Feedback
Reports
Integrations
Settings
```

Do not show every feature as equally important.

The navigation should have logical grouping.

Example:

```text
MAIN
Dashboard
Orders
POS
Kitchen

OPERATIONS
Menu
Inventory
Delivery
Reservations
Branches
Staff

CUSTOMERS
Customers
Loyalty
Reviews & Feedback

GROWTH
Promotions
Marketing
Analytics

DIGITAL
Website
QR Menu
Integrations

REPORTING
Reports

SYSTEM
Settings
```

Use collapsible sidebar sections when appropriate.

---

# 4. Demo Restaurant

Create a realistic fictional restaurant so that the dashboard feels populated and authentic.

Use a believable Pakistani restaurant brand, for example:

> **Urban Flame Kitchen**

or another professional fictional restaurant name.

The demo restaurant should have:

* Multiple branches.
* Realistic Pakistani pricing in PKR.
* Realistic menu items.
* Realistic customer names.
* Realistic order numbers.
* Realistic delivery locations.
* Realistic staff names.
* Realistic sales values.
* Realistic inventory quantities.
* Realistic analytics.

Do not use lorem ipsum.

Do not use placeholder labels such as:

> Product 1
> Customer 1
> Branch A

Everything must feel real.

Use realistic examples such as:

```text
Zinger Burger
Rs. 649

Chicken Karahi
Rs. 1,699

Large Pepperoni Pizza
Rs. 1,499

Loaded Fries
Rs. 549

Mint Margarita
Rs. 399
```

The exact values can vary, but all data should be internally consistent.

---

# 5. Dashboard / Overview

The Overview page is the most important screen because it communicates the product's value immediately.

The owner should understand the entire business situation within a few seconds.

## Top-level KPI cards

Display:

* Today's Revenue
* Today's Orders
* Average Order Value
* New Customers
* Returning Customers
* Pending Orders
* Active Deliveries
* Customer Satisfaction

Example:

```text
Today's Revenue
Rs. 284,650
+18.4% vs yesterday
```

Use clear positive/negative indicators.

Do not overload KPI cards.

Each card should contain:

* Metric name
* Primary number
* Comparison
* Context where useful
* Optional small trend

---

# 6. Sales Overview

Create a large sales chart.

Allow switching between:

* Today
* 7 Days
* 30 Days
* 3 Months
* Custom Range

Show:

* Revenue
* Orders

Use clean line/area charts.

Do not make charts excessively decorative.

The chart must remain readable.

---

# 7. Sales by Channel

Show how customers are ordering.

Example:

```text
Website       42%
POS           26%
WhatsApp      17%
Mobile App    10%
Other          5%
```

Use a visually clear chart.

The client should understand:

> "Where are my orders coming from?"

---

# 8. Order Snapshot

Create a dashboard section showing:

```text
New Orders
Preparing
Ready
Out for Delivery
Completed
Cancelled
```

Use count indicators and status styling.

Clicking a status should navigate to the Orders module with the relevant filter applied.

---

# 9. Recent Orders

Create a clean table containing:

* Order ID
* Customer
* Type
* Branch
* Total
* Payment
* Status
* Time

Example:

```text
#10482
Ahmed Khan
Delivery
DHA Branch
Rs. 2,350
Paid
Preparing
```

Use status badges.

Allow:

* View
* Open order
* Update status

---

# 10. Best-Selling Products

Show:

* Product
* Orders
* Revenue
* Trend

Example:

```text
Chicken Burger       284 orders     Rs.184,116
Large Pizza          192 orders     Rs.278,208
Loaded Fries         175 orders     Rs.96,075
```

Include a "View Analytics" CTA.

---

# 11. Alerts & Action Center

The dashboard should not only show data.

It should tell the restaurant what needs attention.

Examples:

```text
Low stock:
Chicken Breast

5 orders waiting for confirmation

3 deliveries delayed

Friday revenue is 18% below average

12 customers have not ordered in 30+ days

Inventory wastage increased this week
```

Use priority levels:

* Critical
* Warning
* Information

This helps the dashboard feel intelligent.

---

# 12. Orders Module

Create a complete order management system.

Order lifecycle:

```text
NEW
 ↓
CONFIRMED
 ↓
PREPARING
 ↓
READY
 ↓
OUT FOR DELIVERY
 ↓
DELIVERED
```

For dine-in:

```text
NEW
 ↓
CONFIRMED
 ↓
PREPARING
 ↓
READY
 ↓
SERVED
 ↓
COMPLETED
```

For takeaway:

```text
NEW
 ↓
CONFIRMED
 ↓
PREPARING
 ↓
READY
 ↓
PICKED UP
 ↓
COMPLETED
```

---

# 13. Orders List

Include:

* Search
* Date filter
* Status filter
* Branch filter
* Order type
* Payment method
* Customer
* Amount range

Order types:

* Delivery
* Takeaway
* Dine-in
* Online
* Scheduled

Allow sorting.

---

# 14. Order Detail

When an order is opened, show a full order detail page or drawer.

Include:

## Customer

* Name
* Phone
* Email
* Address

## Order

* Items
* Modifiers
* Quantity
* Notes
* Subtotal
* Discount
* Delivery fee
* Tax
* Total

## Payment

* Payment method
* Payment status
* Transaction reference

## Delivery

* Rider
* Address
* ETA
* Delivery status

## Timeline

Example:

```text
10:32 AM   Order placed
10:33 AM   Confirmed
10:37 AM   Preparing
10:52 AM   Ready
10:56 AM   Rider assigned
11:18 AM   Delivered
```

This gives the client a clear understanding of operational tracking.

---

# 15. POS Module

Create a complete restaurant POS screen.

Layout:

```text
-----------------------------------------------------
| Categories | Products              | Current Order |
|            |                       |               |
| Burgers    | Chicken Burger        | Burger x2     |
| Pizza      | Cheese Burger         | Fries x1      |
| Chicken    | Beef Burger           | Drink x2      |
| Drinks     | Loaded Fries          |               |
| Desserts   | Soft Drinks           | Subtotal      |
| Deals      |                         Discount       |
|            |                         Total          |
-----------------------------------------------------
```

Support:

* Product selection
* Category filtering
* Search
* Modifiers
* Quantity
* Discounts
* Notes
* Customer selection
* Table selection
* Order type
* Payment

Payment methods:

* Cash
* Card
* Bank Transfer
* Online
* Wallet
* Mixed payment

Actions:

* Save
* Hold
* Print
* Send to kitchen
* Complete order

---

# 16. Kitchen Display System (KDS)

Create a professional kitchen screen.

Use columns:

```text
NEW
PREPARING
READY
COMPLETED
```

Each order card should show:

* Order ID
* Time elapsed
* Customer/order type
* Items
* Quantity
* Modifiers
* Notes
* Priority

Actions:

```text
Accept
Start Preparing
Mark Ready
Complete
```

Use elapsed time indicators.

Example:

```text
#10482
Delivery

2 × Chicken Burger
1 × Loaded Fries
2 × Pepsi

Note:
No mayo

12 min
```

Use clear urgency indicators for delayed orders.

The KDS should visually demonstrate that online/POS orders can flow directly into kitchen operations.

---

# 17. Menu Management

Create a complete menu management interface.

## Categories

Examples:

* Starters
* Burgers
* Pizza
* Chicken
* Pakistani
* Pasta
* Drinks
* Desserts
* Deals

Allow:

* Add category
* Rename
* Reorder
* Hide
* Delete

---

# 18. Product Management

Each product should support:

* Product name
* Description
* Price
* Discount price
* Image
* Category
* SKU
* Availability
* Preparation time
* Tax
* Tags
* Featured
* Bestseller
* Branch availability

Example:

```text
Chicken Burger

Rs. 649

Crispy chicken fillet with lettuce,
cheese and signature sauce.

Available
Featured
Bestseller
```

---

# 19. Modifiers / Add-ons

Demonstrate realistic modifier functionality.

Example:

```text
Size
Regular
Large + Rs.100

Sauce
Garlic
Chipotle
BBQ

Extras
Cheese + Rs.100
Jalapeños + Rs.80
Egg + Rs.100
```

This is essential to demonstrate that the platform supports real restaurant ordering rather than a static menu.

---

# 20. Menu Availability

Allow the restaurant to quickly set:

* Available
* Out of Stock
* Temporarily Unavailable

Also support:

* Branch-specific availability
* Time-based availability

Example:

```text
Breakfast Menu
7:00 AM – 12:00 PM

Late Night Menu
10:00 PM – 2:00 AM
```

---

# 21. Customer CRM

Create a full customer management interface.

Customer profile should show:

```text
Ahmed Khan

24 Orders
Rs. 48,500 Lifetime Spend
Rs. 2,021 Average Order
Last order 2 days ago
```

Include:

* Name
* Phone
* Email
* Addresses
* Preferred branch
* Order history
* Favorite products
* Total spend
* Average order value
* First order
* Last order
* Loyalty points
* Tags
* Feedback
* Customer notes

---

# 22. Customer Segmentation

Provide filters/segments:

* New Customers
* Returning Customers
* VIP
* High Spenders
* Frequent Customers
* Inactive Customers
* At-Risk Customers
* First-Time Customers

Examples:

```text
Customers who haven't ordered in 30 days
Customers who spent over Rs.20,000
Customers who frequently order burgers
Customers from Karachi branch
```

This demonstrates CRM and marketing capability.

---

# 23. Delivery Management

Create a delivery operations dashboard.

Show:

* Active deliveries
* Pending assignments
* Assigned riders
* Picked up
* On the way
* Delivered
* Delayed
* Failed

Include rider cards:

```text
Ali Raza
Online

3 Active Deliveries
28 Completed Today
```

---

# 24. Delivery Map

Create a realistic map-style UI.

Show:

* Restaurant branches
* Riders
* Active delivery locations
* Customer locations

For a demo, simulated locations/data are acceptable.

The UI should clearly communicate:

> "The restaurant can monitor delivery operations from here."

Do not claim real GPS functionality unless actually implemented.

---

# 25. Delivery Zones

Create a visual zone management interface.

Example:

```text
Zone A
0–3 km
Rs.100

Zone B
3–6 km
Rs.180

Zone C
6–10 km
Rs.250
```

Allow:

* Delivery charge
* Minimum order
* Free delivery threshold
* Estimated time
* Branch assignment

---

# 26. Branch Management

Create multi-location management.

Example:

```text
Naya Nazimabad
Open
Rs. 124,500 Today

Buffer Zone
Open
Rs. 98,400 Today

Peshawar University Road
Busy
Rs. 61,700 Today
```

Branch detail should include:

* Revenue
* Orders
* Customers
* Menu
* Staff
* Inventory
* Delivery
* Opening hours
* Contact information

---

# 27. Reservations

Create a complete reservation module.

Fields:

* Customer
* Phone
* Date
* Time
* Number of guests
* Table
* Occasion
* Special request
* Branch
* Status

Statuses:

```text
Pending
Confirmed
Seated
Completed
Cancelled
No-show
```

---

# 28. Table Management

Create a visual floor-plan style screen.

Tables should have states:

* Available
* Reserved
* Occupied
* Cleaning
* Blocked

Example:

```text
TABLE 01     TABLE 02

TABLE 03     TABLE 04     TABLE 05

TABLE 06     TABLE 07
```

Clicking a table can display:

* Current order
* Customer
* Guests
* Time seated
* Bill
* Reservation

---

# 29. Inventory

Create inventory management.

Track:

* Ingredient
* Quantity
* Unit
* Cost
* Supplier
* Minimum stock
* Reorder level
* Expiry
* Waste

Example:

```text
Chicken Breast
24 kg
Minimum: 30 kg
Status: Low Stock
```

Use meaningful warning states.

---

# 30. Ingredient / Recipe Mapping

Demonstrate how menu items can be connected to inventory.

Example:

```text
Chicken Burger

1 Bun
150g Chicken
20g Cheese
15g Sauce
10g Lettuce
5g Tomato
```

When an order is placed in the demo, the system can simulate ingredient deduction.

This should clearly communicate the concept without pretending to be a production inventory engine.

---

# 31. Suppliers & Purchasing

Create:

* Suppliers
* Purchase Orders
* Purchase history
* Supplier invoices
* Supplier payments

Example:

```text
ABC Foods

Chicken
100 kg
Rs. 1,050/kg
```

---

# 32. Waste Management

Track:

* Spoiled ingredients
* Expired stock
* Preparation waste
* Damaged products
* Incorrect orders

Dashboard example:

```text
Waste This Month
Rs. 83,400

+14% vs last month
```

---

# 33. Promotions

Create a promotion builder.

Support:

* Percentage discounts
* Fixed discounts
* Buy One Get One
* Combo deals
* Minimum order discounts
* First-order offers
* Branch-specific offers
* Time-limited offers
* Coupon codes

Example:

```text
WELCOME20

20% OFF
First Order

Minimum Order:
Rs.1,500
```

Show:

* Usage
* Revenue generated
* Orders
* Conversion
* Remaining validity

---

# 34. Loyalty

Create a loyalty dashboard.

Display:

```text
Total Members
8,420

Points Issued
1.84M

Rewards Redeemed
6,210
```

Support:

* Points
* Rewards
* Membership
* Referral rewards
* Birthday rewards
* Loyalty tiers

Example:

```text
Silver
Gold
Platinum
```

---

# 35. Marketing

Create a marketing center.

Allow the restaurant to see campaigns across:

* Website
* WhatsApp
* Email
* SMS
* Instagram
* Facebook

Display:

* Campaigns
* Reach
* Orders
* Revenue
* Conversion
* ROI

Example:

```text
Weekend Burger Campaign

Reach: 24,500
Orders: 384
Revenue: Rs. 248,000
ROI: 4.2x
```

---

# 36. Analytics

Create a comprehensive analytics module.

## Sales Analytics

Show:

* Gross sales
* Net sales
* Discounts
* Tax
* Delivery fees
* Refunds
* Revenue

## Order Analytics

Show:

* Total orders
* AOV
* Orders per hour
* Orders by day
* Cancellation rate

## Product Analytics

Show:

* Best sellers
* Worst sellers
* Highest revenue
* Most ordered
* Product performance

## Customer Analytics

Show:

* New customers
* Returning customers
* Retention
* Customer lifetime value
* Average spend
* Repeat order rate

## Channel Analytics

Compare:

* Website
* POS
* WhatsApp
* App
* Other

---

# 37. Profitability Analytics

Create an advanced financial analytics screen.

Example:

```text
Revenue               Rs. 2.4M
Food Cost             Rs. 720K
Delivery              Rs. 180K
Discounts             Rs. 120K
Operating Costs       Rs. 500K

Estimated Profit      Rs. 880K
```

For products:

```text
Chicken Burger
Selling Price: Rs.649
Estimated Cost: Rs.280
Gross Margin: Rs.369
```

Use visual indicators to explain margins.

---

# 38. AI Business Assistant

Include an AI assistant section as a premium differentiator.

The interface can look like a conversational business assistant.

Example questions:

```text
How were sales this week?

What are my best-selling items?

Which branch is performing best?

What should I promote?

Which products have declining sales?

Why did revenue decrease this week?
```

Example response:

> Sales increased 18.4% compared with last week. Delivery orders were the primary growth driver, while dine-in revenue remained flat.

Another example:

> Chicken Burger, Large Pizza and Loaded Fries generated 43% of total product revenue this month.

Another:

> Chicken Burger has strong sales but moderate margin. Consider promoting it in a combo with fries and a drink.

The AI UI must not imply that live AI analysis exists unless connected.

For a demo, use realistic simulated responses.

---

# 39. AI Insights / Automated Alerts

Create an insight panel:

```text
AI INSIGHT

Friday evening orders are 23% higher
than your weekly average.

Recommendation:
Increase kitchen staffing between
7 PM and 10 PM.
```

Other examples:

```text
Delivery cancellations increased 32%.

Chicken consumption is 18% above forecast.

Branch B revenue decreased 14%.

12 high-value customers haven't ordered
in over 30 days.
```

This makes the dashboard feel intelligent and business-oriented.

---

# 40. Website Management

The restaurant should be able to manage its customer-facing website.

Support:

* Logo
* Branding
* Colors
* Hero section
* About section
* Menu
* Offers
* Gallery
* Branches
* Opening hours
* Contact details
* FAQs
* SEO information

The website management module should make it obvious that:

> The restaurant's website and dashboard are part of the same platform.

---

# 41. QR Menu

Create QR menu functionality.

Allow:

* Generate QR code
* Download QR
* Preview menu
* Assign to branch
* Assign to table

Tracking can show:

```text
QR Scans
12,480

Unique Visitors
8,240

Menu → Order Conversion
14.8%
```

For demo purposes, use simulated analytics.

---

# 42. Reviews & Customer Feedback

Create a feedback center.

Show:

* Average rating
* Positive reviews
* Negative reviews
* Recent feedback
* Feedback categories

Example:

```text
★★★★★
Food Quality

★★★★☆
Delivery

★★★☆☆
Packaging
```

For low ratings:

```text
Customer Issue
Late Delivery
```

For high satisfaction:

```text
Invite customer to leave a public review.
```

---

# 43. Staff Management

Create staff roles:

```text
Owner
Admin
Manager
Cashier
Waiter
Kitchen
Delivery Rider
Marketing
```

Each role should have appropriate permissions.

Example:

Owner:
All modules.

Manager:
Orders, menu, staff, inventory, reports.

Cashier:
POS, orders, payments.

Kitchen:
KDS.

Rider:
Assigned deliveries.

---

# 44. Finance

Create a finance overview with:

* Sales
* Expenses
* Payments
* Refunds
* Taxes
* Cash register
* Settlements
* Payouts
* Daily closing
* Cash reconciliation

Show payment methods:

* Cash
* Card
* Bank Transfer
* Online Gateway
* Wallet

Use realistic demo data.

---

# 45. Reports

Create a report center.

Reports should include:

* Daily Sales
* Monthly Sales
* Product Sales
* Category Sales
* Branch Sales
* Customer Report
* Delivery Report
* Inventory Report
* Purchase Report
* Expense Report
* Tax Report
* Discount Report
* Refund Report
* Staff Report
* Profitability Report

Provide export UI for:

* CSV
* Excel
* PDF

In demo mode, export buttons can be non-functional or simulated, but should look realistic.

---

# 46. Integrations

Create an integrations page showing supported/possible integrations.

Categories:

```text
Payments
WhatsApp
Google Maps
Google Business
Instagram
Facebook
SMS
Email
Accounting
POS Hardware
Kitchen Printers
KDS
Delivery Services
Analytics
```

Clearly mark each as:

```text
Connected
Not Connected
Available
Coming Soon
```

Do not falsely imply live integrations.

---

# 47. Settings

Settings should be organized rather than one giant page.

Sections:

### Restaurant

* Name
* Logo
* Contact
* Address
* Currency
* Tax

### Operations

* Order settings
* Delivery settings
* Reservation settings
* Kitchen settings

### Notifications

* Email
* SMS
* WhatsApp
* In-app

### Users & Permissions

* Users
* Roles
* Access

### Billing

* Subscription
* Payment method
* Invoice history

### Security

* Password
* 2FA
* Sessions
* Audit logs

---

# 48. UI/UX Design Direction

The dashboard must look like a **premium modern SaaS product**.

Do not use an outdated "Bootstrap admin dashboard" appearance.

## Overall aesthetic

Use:

* Clean
* Modern
* Professional
* Spacious
* Data-focused
* Premium
* Minimal visual noise
* Strong hierarchy
* Excellent readability

The dashboard should feel suitable for:

* Restaurant owners
* Restaurant managers
* Multi-branch operators
* Enterprise restaurant groups

---

# 49. Layout

Use a responsive application shell.

Desktop:

```text
┌──────────────────────────────────────────────────────┐
│ Top Header                                           │
├───────────────┬──────────────────────────────────────┤
│               │                                      │
│ Sidebar       │              Content                 │
│               │                                      │
│               │                                      │
└───────────────┴──────────────────────────────────────┘
```

Sidebar:

* Fixed or sticky
* Collapsible
* Clear active state
* Icon + label
* Logical groups

Header:

* Search
* Notifications
* Branch selector
* Date selector where useful
* Help
* Profile

---

# 50. Navigation UX

The sidebar should not overwhelm users.

Use:

* Group labels
* Consistent icons
* Strong active state
* Tooltips for collapsed mode

On narrow desktop widths, automatically collapse sidebar when appropriate.

Maintain clear navigation at all times.

---

# 51. Mobile Responsiveness

This requirement is critical.

The entire dashboard must be **fully responsive**.

Do not simply shrink the desktop interface.

The mobile layout must be intentionally designed.

### Desktop

Use:

* Sidebar
* Multi-column cards
* Data tables
* Large charts
* Multi-panel layouts

### Tablet

Adapt:

* Sidebar
* Card grids
* Charts
* Tables

### Mobile

Use:

* Bottom navigation or compact top navigation for core functions
* Hamburger menu for secondary modules
* Stack cards vertically
* Horizontal scrolling where appropriate
* Mobile-friendly tables
* Drawer/modal interactions
* Sticky action buttons
* Large touch targets

Core mobile navigation can prioritize:

```text
Home
Orders
POS
Menu
More
```

Do not attempt to display the entire desktop sidebar on a phone.

---

# 52. Mobile Order Management

The order screen should be especially optimized for mobile.

Each order should become a readable card.

Example:

```text
#10482
Ahmed Khan

2 × Chicken Burger
1 × Loaded Fries

Rs. 1,847

Preparing

[View Order]
```

Status actions should be easy to operate with one hand.

---

# 53. Tables on Mobile

Never let large tables destroy the mobile layout.

Use:

* Card-based rows
* Horizontal scrolling when necessary
* Priority columns
* Expandable rows
* Detail drawer

Do not squeeze 10 columns into a 375px screen.

---

# 54. Touch UX

Minimum interactive elements should be comfortably tappable.

Avoid tiny:

* Buttons
* Icons
* Dropdowns
* Checkbox targets

Ensure:

* Adequate spacing
* Clear pressed states
* Clear focus states
* Visible active states

---

# 55. Typography

Typography must prioritize readability.

Use a clean modern sans-serif font.

Establish clear hierarchy:

```text
Page Title
Section Heading
Card Heading
Body
Secondary Text
Metadata
```

Do not use excessively small text.

Avoid using light gray text on a white background if readability suffers.

Use strong contrast.

---

# 56. Color System

Use a professional restrained palette.

Suggested structure:

```text
Primary
Accent

Background
Surface
Surface Elevated

Text Primary
Text Secondary
Text Muted

Success
Warning
Danger
Info
```

Do not overuse accent colors.

Status colors should communicate meaning consistently.

Example:

```text
Green   = Success / Completed
Yellow  = Pending / Warning
Red     = Error / Cancelled
Blue    = Information / Processing
```

The visual system must remain coherent throughout all screens.

---

# 57. Cards

Cards should be used strategically.

Avoid:

> Card inside card inside card.

Each card needs a purpose.

Good dashboard card:

```text
Revenue

Rs. 284,650

+18.4%

vs yesterday
```

Bad design:

* giant shadows
* excessive borders
* unnecessary gradients
* decorative icons everywhere

Use subtle depth.

---

# 58. Tables

Tables should be:

* Clean
* Compact
* Readable
* Scannable

Use:

* Sticky headers where useful
* Row hover states
* Status badges
* Pagination
* Search
* Filters
* Sorting

Do not make borders excessively heavy.

---

# 59. Charts

Charts should answer a business question.

Examples:

Revenue chart:

> How is revenue changing?

Product chart:

> What sells the most?

Channel chart:

> Where do orders come from?

Branch chart:

> Which branch performs best?

Avoid decorative charts that don't communicate actionable information.

---

# 60. Empty States

Every module should have meaningful empty states.

Example:

> No active deliveries

> No reservations today

> No campaigns created yet

Provide a useful action:

```text
Create Campaign
```

or:

```text
Add Reservation
```

Do not display blank screens.

---

# 61. Loading States

Use proper loading skeletons.

Do not make the application feel frozen.

Examples:

* KPI skeleton
* Table skeleton
* Chart skeleton
* Card skeleton

---

# 62. Feedback States

Every important action should provide feedback.

Examples:

> Product added successfully.

> Order updated.

> Promotion created.

> Menu item marked unavailable.

Use toast notifications carefully.

Do not spam the screen with notifications.

---

# 63. Modals and Drawers

Use modals for small focused actions.

Use drawers for:

* Order details
* Customer details
* Quick editing

Use full pages for:

* Analytics
* Settings
* Complex forms
* Large management interfaces

---

# 64. Accessibility

Follow good accessibility practices.

Ensure:

* Keyboard navigation
* Focus states
* Semantic buttons
* Labels
* ARIA where necessary
* Strong contrast
* Screen-reader-friendly structure
* No information conveyed solely by color

Example:

Don't use only green to indicate "Completed."

Use:

```text
✓ Completed
```

---

# 65. Readability

This product will contain a lot of information.

Therefore:

**Information hierarchy is more important than decoration.**

Every screen should answer:

1. What am I looking at?
2. Why does it matter?
3. What should I do next?

Avoid information overload.

Use:

* Tabs
* Sections
* Filters
* Progressive disclosure
* Drawers
* Expandable content

---

# 66. Responsive Breakpoints

Design intentionally for:

```text
Mobile:
320px+
375px+
390px+
430px+

Tablet:
768px+

Laptop:
1024px+

Desktop:
1280px+

Large Desktop:
1440px+
1920px+
```

Do not design only at one desktop width.

Ensure:

* No horizontal overflow
* No overlapping
* No clipped content
* No unreadable tables
* No broken charts
* No inaccessible controls

---

# 67. Performance Requirements

The dashboard must feel fast.

Optimize:

* Images
* Fonts
* JavaScript
* CSS
* Charts
* Component rendering
* API/data simulation
* Bundle size

Use:

* Lazy loading for heavy modules
* Dynamic imports for large components
* Optimized image formats
* Proper caching
* Efficient state management
* Virtualized long lists where necessary

Do not unnecessarily load every module at initial page load.

---

# 68. Demo Data Performance

Do not create thousands of unnecessary static DOM elements.

Use:

* Paginated demo data
* Virtualized tables when appropriate
* Efficient filtering
* Memoization only where useful
* Avoid unnecessary re-renders

Charts should not recreate themselves unnecessarily.

The UI should remain smooth even when displaying large-looking datasets.

---

# 69. Interaction Quality

All important UI elements should feel functional.

For the demo, implement simulated behavior wherever practical.

Examples:

* Change order status
* Add product
* Edit product
* Toggle availability
* Apply promotion
* Change branch
* Filter analytics
* Search customers
* Assign rider
* Update reservation
* Change table status
* Toggle inventory status

A client should be able to click around and understand the product.

Do not create hundreds of static screens with no interaction.

---

# 70. Demo Mode

Clearly treat the application as a **demo environment internally**, but do not make it look fake.

You can display subtle indicators such as:

> Demo Account

or:

> Demo Workspace

However, do not place giant "THIS IS A DEMO" banners everywhere.

The experience should still feel like a real SaaS product.

Simulated data should behave consistently.

For example:

```text
Mark order as completed
↓
Dashboard order count updates
↓
Revenue/analytics state can reflect the simulated change
```

The product should feel coherent.

---

# 71. Client Education

The product must communicate itself.

A first-time restaurant owner should be able to navigate it without needing you to explain every screen.

Use:

* Helpful labels
* Tooltips
* Short descriptions
* Empty-state explanations
* Contextual help

Example:

### Customers

> Manage customer profiles, order history, loyalty and engagement.

### Analytics

> Understand sales, product, customer and branch performance.

### Delivery

> Manage riders, delivery zones and active deliveries.

This is important for sales demonstrations.

---

# 72. Product-Level Dashboard Header

The dashboard header should communicate:

```text
Good morning, Ahmed

Here's what's happening at Urban Flame today.
```

Then:

* Branch selector
* Date range
* Notifications
* Profile

For multi-branch owners:

```text
All Branches
Naya Nazimabad
Buffer Zone
Peshawar University Road
```

---

# 73. Demo Walkthrough Flow

The application should support a logical sales demonstration.

The ideal flow is:

```text
1. Overview
        ↓
2. Orders
        ↓
3. POS
        ↓
4. Kitchen
        ↓
5. Menu
        ↓
6. Customer
        ↓
7. Delivery
        ↓
8. Analytics
        ↓
9. Marketing
        ↓
10. Website
```

This demonstrates the complete customer-to-business journey.

---

# 74. Recommended Demo Story

When showing the client, demonstrate:

### Step 1

Customer visits restaurant website.

### Step 2

Customer views menu.

### Step 3

Customer adds food.

### Step 4

Customer submits order.

### Step 5

Order appears in restaurant dashboard.

### Step 6

Staff confirms the order.

### Step 7

Kitchen receives the order.

### Step 8

Kitchen marks it preparing.

### Step 9

Order becomes ready.

### Step 10

Rider is assigned.

### Step 11

Customer receives delivery.

### Step 12

Customer profile is updated.

### Step 13

Sales analytics update.

### Step 14

Restaurant owner can see performance.

This is the strongest demonstration because it communicates that all modules are connected.

---

# 75. Design Principle: Show the Business Journey

The client should not feel like they are navigating random software features.

Everything should connect.

For example:

```text
Menu
  ↓
Order
  ↓
Kitchen
  ↓
Delivery
  ↓
Customer
  ↓
Revenue
  ↓
Analytics
  ↓
Marketing
  ↓
Repeat Customer
```

This should be the conceptual backbone of the entire product.

---

# 76. Do Not Overdesign

Avoid:

* Excessive gradients
* Huge shadows
* Excessive rounded corners
* Too many colors
* Excessive animations
* Decorative dashboard widgets
* Giant icons
* Unnecessary glassmorphism
* Excessive blur
* Visual noise

The product should look expensive because of:

* spacing
* typography
* hierarchy
* consistency
* alignment
* interaction quality
* data presentation

not because of decorative effects.

---

# 77. Animation Guidelines

Use subtle animations only when they provide feedback.

Examples:

* Sidebar transition
* Modal opening
* Dropdown
* Toast
* Order status update
* Chart transition
* Loading skeleton

Avoid excessive:

* bouncing
* spinning
* parallax
* floating cards
* continuous animations

The application is business software, not a marketing landing page.

---

# 78. Desktop Quality

At desktop widths, maximize productivity.

Take advantage of:

* Multi-column layouts
* Dense but readable tables
* Side-by-side panels
* Charts next to KPIs
* Persistent navigation
* Quick actions

The dashboard should feel efficient for managers who spend hours inside it.

---

# 79. Mobile Quality

On mobile, prioritize:

1. Orders
2. POS
3. Menu
4. Delivery
5. Notifications
6. Analytics

Secondary functionality can live inside a More/Menu interface.

Do not simply compress desktop content.

Build mobile layouts intentionally.

---

# 80. Technical Product Philosophy

Build the system with reusable components.

Create reusable components for:

* KPI cards
* Tables
* Status badges
* Charts
* Filters
* Search
* Modals
* Drawers
* Forms
* Product cards
* Order cards
* Customer cards
* Notifications
* Empty states
* Skeletons
* Toasts

Maintain a consistent design system throughout the application.

---

# 81. Data Architecture for Demo

Use centralized demo data/state rather than duplicating data in every screen.

For example:

```text
restaurants
branches
products
categories
orders
customers
riders
reservations
tables
inventory
suppliers
campaigns
loyalty
staff
analytics
```

Screens should derive their information from this shared state.

This will allow interactions to remain consistent.

---

# 82. Avoid Fake Functionality

Do not create buttons that look functional but do absolutely nothing unless clearly marked as unavailable.

For functionality not implemented:

Use:

```text
Coming Soon
```

or:

```text
Demo Preview
```

Instead of pretending that a real external integration exists.

---

# 83. Product Hierarchy

The application should make the following hierarchy clear:

### Level 1 — Business control

Dashboard
Analytics
Reports

### Level 2 — Daily operations

Orders
POS
Kitchen
Delivery

### Level 3 — Business management

Menu
Inventory
Customers
Staff
Branches

### Level 4 — Growth

Promotions
Loyalty
Marketing
Reviews

### Level 5 — Digital ecosystem

Website
QR Menu
Integrations

This hierarchy should be reflected in navigation and page design.

---

# 84. Core Value Proposition Visible Throughout the Product

The entire application should communicate these benefits:

### Operational efficiency

Manage orders, kitchen, staff and deliveries from one system.

### Direct ordering

Turn website/social traffic into direct orders.

### Better customer experience

Make menus, reservations and ordering easier.

### Customer retention

Use CRM, loyalty and marketing to bring customers back.

### Business visibility

Understand sales, products, branches and customer behavior.

### Growth

Use analytics and targeted campaigns to increase revenue.

---

# 85. Final Quality Standard

Before considering the demo complete, verify:

* Every primary sidebar item opens a meaningful screen.
* Every important screen contains realistic data.
* The dashboard looks like a real SaaS product.
* Navigation is logical.
* Desktop layout is polished.
* Tablet layout works.
* Mobile layout is intentionally designed.
* Tables remain readable.
* Charts remain readable.
* Forms are usable.
* Buttons have meaningful behavior.
* Demo data is internally consistent.
* Statuses are visually consistent.
* Colors have semantic meaning.
* Typography is readable.
* No overflow exists.
* No broken components exist.
* No obvious placeholder text remains.
* Empty states exist.
* Loading states exist.
* Error/feedback states are represented where appropriate.
* The application feels fast.
* The application works smoothly during a live client demonstration.

---

# 86. The Most Important Requirement

Do not build this as a collection of disconnected admin pages.

Build it as **one connected restaurant operating ecosystem**.

The client should be able to understand this story:

```text
CUSTOMER

Instagram / Google
        ↓
Restaurant Website
        ↓
Menu / Offers
        ↓
Order / Reservation
        ↓
Payment
        ↓
Restaurant Platform
        ↓
Orders
        ↓
POS
        ↓
Kitchen
        ↓
Delivery
        ↓
Customer CRM
        ↓
Analytics
        ↓
Marketing
        ↓
Loyalty
        ↓
Repeat Customer
```

That connected workflow is the core value of the product.

The final demo should communicate:

> **"Your website brings the customer in. Your ordering system converts them. Your restaurant dashboard operates the business. Your CRM and marketing bring the customer back."**

The end result should be a **complete, convincing, responsive Restaurant Management & Ordering Platform demo** that a restaurant owner can explore independently and immediately understand as a potential business solution—not merely as a developer portfolio project.
