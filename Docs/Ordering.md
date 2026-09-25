### Make Ordering System Fully Functional

Make the complete customer-to-admin ordering system functional and properly connected. Do not use static/demo-only order states.

1. **Customer Order Creation**

   * When a customer completes **Place Order → Review/Confirmation → Confirm Order**, create a real order in the application's order data/state.
   * Save all relevant order information:

     * Order number
     * Customer name
     * Phone
     * Email
     * Delivery/Pickup type
     * Selected branch/location
     * Area/City
     * Delivery address, when applicable
     * Ordered items
     * Item images
     * Sizes/variants
     * Modifiers/extras
     * Quantities
     * Prices
     * Discounts
     * Delivery charges
     * Grand total
     * Payment method
     * Order date/time
     * Current status

2. **Admin Panel → Orders**

   * Newly placed customer orders must immediately appear in the **Admin Panel Orders tab**.
   * Remove dependency on hardcoded demo orders for newly created orders.
   * Show the complete order information and correct prices/images.
   * Update order counters automatically when new orders are received.
   * Ensure the same order is reflected consistently in Orders, Delivery, POS/KDS where applicable.

3. **Customer → Orders Page**

   * Make the customer's Orders page fully functional.
   * Newly placed orders must automatically appear there.
   * Show complete order details and the current status.
   * Display the order progress pipeline/timeline:
     **Accepted → Sent for Preparing → Preparing → Ready → Dispatched → Out for Delivery → Delivered**
   * Visually fill the progress line and completed status indicators according to the current status.
   * Show the correct timestamps/details where applicable.
   * Do not restart or reset the progress when navigating between pages or reopening the order.

4. **Admin ↔ Customer Status Synchronization**

   * The **Admin Panel and Customer Orders page must use the same order data/status**.
   * When an admin changes an order status, the customer's order progress must update accordingly.
   * When applicable, customer-side status changes must be reflected in the Admin Panel.
   * Keep status transitions consistent and prevent invalid/reversed transitions.

5. **Order Lifecycle**

   * Implement the complete workflow:
     **Customer places order**
     → **Admin receives order**
     → **Accept**
     → **Send for Preparing**
     → **KDS Preparing**
     → **KDS Ready**
     → **Admin Dispatch**
     → **Out for Delivery**
     → **Delivered**
   * Buttons should update their labels/status after an action, e.g.:
     **Accept → Accepted**
     **Send for Preparing → Sent**
     **Dispatch → Dispatched**
   * Kitchen-specific actions should remain in KDS, while dispatch/delivery actions remain in the appropriate Admin sections.

6. **Persistence**

   * Orders and their statuses must persist across:

     * Page navigation
     * Modal open/close
     * Customer refresh
     * Admin refresh
     * Switching between dashboard tabs
   * Do not recreate/reset orders on component rerenders.

7. **Demo Data**

   * Existing demo data may remain where needed for demonstrating the dashboard, but **new customer orders must be real application orders and must appear dynamically on both sides**.
   * Clearly separate seeded/demo data from newly created customer orders where necessary.

### Final Verification

Test the complete end-to-end flow:

**Customer → Add to Cart → Checkout → Confirm Order → Customer Orders → Admin Orders → Accept → KDS → Preparing → Ready → Dispatch → Out for Delivery → Delivered**

Verify that the **same order, details, prices, images, status, progress line, and timestamps** remain synchronized between the customer side and Admin Panel throughout the entire lifecycle.
