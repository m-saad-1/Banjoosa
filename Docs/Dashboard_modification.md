### Add Simple Dashboard Mode

Update the current Admin Dashboard by adding a **Simple Dashboard mode** designed specifically for restaurants that use a straightforward manual workflow.

The **existing Advanced Dashboard must remain unchanged and fully functional**. Do not remove, redesign, or break any existing Advanced Dashboard features.

### 1. Dashboard Modes

Add two dashboard modes:

* **Simple Dashboard** — default
* **Advanced Dashboard** — existing/current dashboard

Add a setting in **Settings** that allows the restaurant/admin to switch between:

**Simple Dashboard ↔ Advanced Dashboard**

* New installations/users should open **Simple Dashboard by default**.
* Save the selected mode so it persists after refresh/navigation.
* Switching modes should not delete, modify, or reset any data.
* The Advanced Dashboard should continue working exactly as it currently does.

### 2. Simple Dashboard Navigation

The Simple Dashboard should contain only these tabs:

1. **Dashboard**
2. **Orders**
3. **Menu**
4. **Delivery**
5. **Reservations**
6. **Branches**
7. **Customers**
8. **Content & Media**
9. **Analytics**
10. **Settings**

Do not expose advanced operational modules such as KDS, POS, Inventory, Supply Chain, Finance, HR, CRM automation, etc. in Simple mode.

### 3. Simple Restaurant Workflow

Design the Simple Dashboard around the actual workflow used by many Pakistani restaurants:

**Customer places order → Restaurant receives order → Restaurant confirms order/calls customer → Staff prepares manually → Order is dispatched to rider → Rider delivers → Order completed**

Keep the workflow extremely simple and obvious.

### 4. Simple Dashboard

Show only useful high-level information:

* New Orders
* Orders Today
* Pending Orders
* Preparing Orders
* Out for Delivery
* Completed Orders
* Cancelled Orders
* Today's Sales
* Recent Orders

Use clear cards, readable numbers, status badges, and simple actions.

Avoid overwhelming the user with unnecessary metrics or advanced analytics on the main dashboard.

### 5. Simple Orders

Make Orders the primary operational section.

Each order should clearly show:

* Order number
* Customer name
* Phone
* Delivery/Pickup
* Address or Pickup Outlet
* Items
* Total
* Order time
* Current status

Keep the actions simple:

**New Order → Confirm → Preparing → Ready → Dispatch → Out for Delivery → Delivered**

For example:

* **Confirm Order**
* **Start Preparing**
* **Mark Ready**
* **Dispatch**
* **Mark Delivered**
* **Cancel**

Add quick actions for calling the customer where appropriate.

Do not expose complicated POS/KDS-style workflows in Simple mode.

### 6. Simple Delivery

Focus only on practical delivery management:

* Pending Deliveries
* Ready for Dispatch
* Assigned Rider
* Out for Delivery
* Delivered
* Rider name
* Customer phone
* Delivery address
* Order number
* Delivery status

Allow staff to assign a rider and update delivery status easily.

### 7. Simple Menu

Keep menu management straightforward:

* Add Item
* Edit Item
* Delete/Disable Item
* Item image
* Name
* Description
* Price
* Category
* Availability
* Variants/options where needed

Prioritize quick menu editing rather than advanced inventory/recipe/POS functionality.

### 8. Reservations

Keep reservations simple:

* Today's reservations
* Upcoming reservations
* Customer name
* Phone
* Date/time
* Party size
* Table
* Status

Actions:

**Confirm → Seat → Completed / Cancel**

### 9. Branches

Allow the restaurant to:

* View branches
* Add branch
* Edit branch
* Set opening/closing hours
* Manage basic branch information
* Select the active branch

Keep branch management simple.

### 10. Customers

Show useful customer information:

* Name
* Phone
* Email
* Orders
* Total spending
* Last order
* Addresses
* Basic order history

Avoid exposing complex CRM functionality in Simple mode.

### 11. Content & Media

Keep this focused on website content:

* Menu images
* Offer images
* Gallery
* Homepage content
* Basic restaurant information
* Contact information
* Branch information

Changes should actually update the customer-facing website.

### 12. Analytics

Keep analytics simple and actionable:

* Today's sales
* Weekly sales
* Monthly sales
* Total orders
* Average order value
* Popular menu items
* Delivery vs Pickup
* Basic sales/order charts

Avoid the advanced financial, operational, and business intelligence features from the Advanced Dashboard.

### 13. Settings

Include normal restaurant settings plus the dashboard-mode control:

**Dashboard Mode**

* Simple Dashboard
* Advanced Dashboard

Clearly explain that Simple mode provides an easier restaurant workflow while Advanced mode exposes the complete management system.

### 14. UI/UX Direction

The Simple Dashboard should feel:

* Clean
* Professional
* Fast
* Minimal
* Easy to understand
* Touch-friendly
* Mobile-friendly
* Suitable for restaurant staff with limited technical experience

Prioritize **large clear actions, simple labels, obvious status colors, readable typography, and minimal clutter**.

Do not simply hide random Advanced Dashboard elements. Build the Simple Dashboard as a **separate, intentionally simplified experience** using the existing application's components, data, authentication, and backend/state where possible.

### Critical Requirement

**Do NOT modify or break the existing Advanced Dashboard.**

The goal is:

**One system → Two dashboard experiences**

**Simple Dashboard:** easy daily restaurant operations.

**Advanced Dashboard:** complete restaurant management for businesses that need more control.

Both modes must use the same underlying orders, customers, menu, branches, reservations, delivery, and content data so switching between modes does not create separate or inconsistent data.

### Final Verification

Test the complete Simple Dashboard workflow:

**Login → Simple Dashboard → Receive Order → Confirm → Prepare → Ready → Assign Rider → Dispatch → Delivered**

Then switch to **Advanced Dashboard** and verify that the same order/data is still present and fully functional.

Test both modes on **desktop and mobile**, with particular focus on UI/UX, responsiveness, navigation, status updates, modals, forms, and real data synchronization.
