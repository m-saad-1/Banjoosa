Analyze, evaluate, and audit the entire project before making any changes.

Review the complete project structure, source code, components, utilities, state management, data flow, dependencies, configuration, assets, routing, styling, and existing dashboard/website architecture.

Identify why simple changes are taking too long to implement, why requirements are sometimes missed or partially completed, and why changes occasionally cause regressions or break unrelated parts of the system.

Specifically investigate:

* Overly complex or duplicated components
* Poor component architecture
* Duplicate or conflicting state
* Unclear data flow
* Hardcoded/demo data mixed with real application data
* Repeated logic that should be centralized
* Excessive component nesting
* Conflicting CSS/responsive rules
* Duplicate styles and inconsistent design systems
* Unnecessary dependencies or libraries
* Dead/unused code
* Fragile modal, navigation, and state-management logic
* Dashboard Simple/Advanced mode separation
* Customer ↔ Dashboard order data synchronization
* Theme/Dark Mode state and styling architecture
* Timestamp/date handling and timezone conversions
* Repeated patches or workarounds that are causing regressions
* Components that are too large or responsible for too many things
* Missing reusable components/utilities
* Any architectural decisions that make straightforward requirements difficult to implement safely

Determine the **root causes**, not just individual symptoms.

Then provide a clear audit covering:

1. Current architectural problems
2. Why agents are struggling to implement requirements reliably
3. Why changes are causing unintended regressions
4. Which parts should be refactored
5. Which parts should remain untouched
6. Recommended project structure
7. Recommended state/data-flow architecture
8. Recommended component boundaries and reusable components
9. Recommended approach for Simple vs Advanced Dashboard
10. Recommended approach for customer/admin order synchronization
11. Recommended approach for themes and shared UI state
12. Specific steps to make future changes faster, safer, and more predictable

Do not immediately rewrite or rebuild the project.

First understand the existing system thoroughly and produce an actionable refactoring plan. Preserve all currently working functionality, routes, visual design, assets, and business logic unless there is a clear architectural reason to change them.

After the audit, clearly separate:

**Keep → Refactor → Consolidate → Remove → Rebuild**

Do not make speculative changes or invent missing functionality. Base every recommendation on the actual project files and existing implementation.
