Project: marcosogg-mybudget

Focus: Navigation

Date of Audit: 2025-01-12

Overall Impression:

The project appears to be a personal budgeting application with features for creating budgets, managing bill reminders, and importing transactions from Revolut. The use of modern technologies like React, TypeScript, Tailwind CSS, and shadcn-ui suggests a focus on a clean and potentially responsive design. However, without the ability to run and test the application, this audit will be based on the structural and code-level inferences.

Information Architecture:

Main Sections: Based on the src/pages directory, the primary sections of the application are:

Auth (Authentication)
CreateBudget
BillReminders
Import (specifically RevolutImport)
EditBillReminder
Index (presumably the main dashboard)
Component Organization: Components are organized into folders that correspond to features (e.g., bill-reminder, budget, dashboard, revolut). This is good practice, making it relatively straightforward to locate components related to specific functionalities.

UI Components: The src/components/ui folder houses reusable UI components, suggesting a modular design approach.

Data Model: The src/types directory suggests a well-defined data model with types for bill-reminder, budget, and revolut, indicating a structured approach to data handling.

User Flows:

Dashboard Access: After authentication, users are likely directed to the Index page, serving as the main dashboard. This is a standard and user-friendly approach.

Budget Creation: The CreateBudget page, accessible from the dashboard, provides a form for users to create a monthly budget. The flow involves:

Selecting the month and year.
Entering income details (salary, bonus).
Specifying planned expenses across various categories.
Saving the budget.
Bill Reminder Management: The BillReminders page lists existing bill reminders and allows users to add new ones. The flow for adding a reminder involves:

Entering provider details, due date, and amount.
Optionally enabling SMS reminders and specifying a phone number.
Optionally scheduling the reminder.
Submitting the form.
Users can also edit (EditBillReminder) and delete reminders.
Revolut Import: The RevolutImport page handles the importing of Revolut transactions. The inferred flow involves:

Uploading a CSV file.
Processing the file to extract transactions.
Displaying a preview of transactions.
Allowing users to categorize transactions.
Approving and importing the transactions.
Navigation Analysis:

Top-Level Navigation:

The presence of a DashboardHeader component suggests that a horizontal navigation bar or menu is likely used for primary navigation between the main sections (Create Budget, Bill Reminders, Revolut Import). This is inferred from the src/components/dashboard/DashboardHeader.tsx file.
The Sidebar component indicates that a side navigation will be also used.
Within-Section Navigation:

Budget Creation: The MonthYearPicker component suggests that navigation within the budget section might involve selecting different months/years to view past or future budgets.
Bill Reminders: Editing and deleting reminders are handled through actions within the BillRemindersCard, likely using modals or inline editing, which is a common and efficient approach.
Revolut Import: The RevolutMonthSelector component indicates that users can navigate through different months' transactions.
Areas of Friction:

Lack of Explicit Navigation Component: While the DashboardHeader suggests a top-level navigation menu, there's no explicit Navbar, Menu, or Navigation component in the provided structure. This makes it difficult to fully assess the navigation's implementation and user experience.
Potential for Deep Nesting: The revolut-import feature has nested components (e.g., FileUploadZone, TransactionFilters, TransactionsTable). Without seeing how these are integrated into the overall navigation, there's a potential for deep nesting, which could make it harder for users to navigate back or understand their current location within the app.
Inconsistent Terminology: The application uses both "Import" and "Revolut Import." Clarifying whether "Import" is a general feature or specifically for Revolut is crucial for user understanding.
Recommendations for Improved Navigation and User Flow:

Implement a Clear Navigation Menu:

Create a dedicated Navbar or Menu component to house the top-level navigation. This will improve the discoverability of different sections.
Consider using a Sidebar if the application has many sections or requires a hierarchical navigation structure.
Consider using a Breadcrumb component to help users understand their location within the application.
Improve Within-Section Navigation:

For the RevolutImport section, consider using tabs or a step-by-step wizard approach to break down the import process into manageable steps. This can reduce cognitive load and improve user guidance.
Ensure consistent "Back" or "Cancel" buttons are available for users to easily navigate back or exit a specific flow.
Review and Standardize Terminology:

Use consistent terms for features and actions throughout the application. For example, if "Import" is solely for Revolut, rename it to "Revolut Import" consistently.
If there's a plan to support importing from other sources, consider a more general "Import Data" section with sub-options for different sources.
Usability Testing:

Once the application is in a runnable state, conduct usability testing with real users to identify any navigation pain points and gather feedback on the overall user flow.
Code-Level Observations (Navigation-Related):

React Router: The use of react-router-dom is evident in App.tsx, indicating client-side routing. Ensure routes are well-defined and map clearly to the intended sections.
Supabase Integration: Supabase is used for authentication and data storage. Ensure that navigation flows are correctly integrated with authentication states (e.g., redirecting to the dashboard after login, protecting authenticated routes).
Conclusion:

The project has a solid foundation for a user-friendly budgeting application. The information architecture is relatively clear, and the component organization is logical. However, the lack of a visible navigation component in the provided code makes it challenging to fully evaluate the user experience. Implementing the recommendations above, particularly focusing on a clear navigation menu and conducting usability testing, will significantly enhance the app's navigability and overall user satisfaction.


-----------------------------------------

Ticket Title: Enhance Application Navigation for Improved User Experience

Priority: High

Type: Improvement

Description:

This ticket addresses the need to improve the overall navigation within the "marcosogg-mybudget" application. A recent UX audit (see attached audit report or link to Confluence page) highlighted several areas where the current navigation structure could be enhanced to provide a more intuitive and user-friendly experience.

Current State:

The application lacks a dedicated, visible navigation component (e.g., Navbar) for primary navigation between main sections.
Within-section navigation, particularly in the Revolut Import feature, has the potential to become deeply nested, potentially confusing users.
Terminology used for features (e.g., "Import" vs. "Revolut Import") could be more consistent.
Goals:

Implement a clear and consistent top-level navigation menu.
Improve within-section navigation, particularly for the Revolut Import flow.
Standardize terminology used throughout the application.
Enhance the overall user experience by making it easier for users to find what they need and understand their location within the application.
Proposed Solution:

Implement a Global Navigation Menu (Navbar/Sidebar):

Create a new Navbar (or Sidebar) component to provide primary navigation between the main sections of the application:
Dashboard (currently "Index")
Create Budget
Bill Reminders
Revolut Import
(Potentially) Settings/Profile
The navigation menu should be visible on all pages (or most pages, depending on context).
Consider using a Sidebar if there are many sections or a need for a hierarchical menu.
If a Sidebar is chosen, ensure that it can be toggled or minimized to maximize screen space, especially on smaller viewports. Also, add a cookie to save the state (open/closed)
Consider using a Breadcrumb component to show the user's current location within the application's hierarchy.
Improve Within-Section Navigation for Revolut Import:

Refactor the RevolutImport flow to use either:
Tabs: Implement tabs to divide the import process into logical steps (e.g., "Upload File," "Review Transactions," "Categorize," "Confirm Import").
Wizard: Create a step-by-step wizard component to guide users through the import process.
Ensure clear "Back," "Next," and "Cancel" buttons are available within the flow.
Standardize Terminology:

Decide whether "Import" should be a general feature or specifically for Revolut.
If "Import" is only for Revolut, rename all instances to "Revolut Import" for consistency.
If "Import" will support other data sources in the future, create a more general "Import Data" section with sub-options for each source (e.g., "Import from Revolut," "Import from CSV").
Code Changes:

Create the new Navbar or Sidebar component.
Integrate the new navigation component into the main application layout (likely in App.tsx).
Refactor RevolutImport to use tabs or a wizard.
Update routes in App.tsx to match the new navigation structure, if necessary.
Review and update existing components (e.g., DashboardHeader, MonthYearPicker, RevolutMonthSelector) to ensure they work seamlessly with the new navigation.
Accessibility:

Ensure the navigation menu is accessible to keyboard users and screen readers. Use appropriate ARIA attributes (e.g., role, aria-label, aria-current).
Usability Testing:

After implementing these changes, conduct usability testing with real users to validate the improvements and identify any remaining issues.
Acceptance Criteria:

A clear and consistent global navigation menu (Navbar or Sidebar) is implemented and visible on all relevant pages.
The Revolut Import flow is refactored using tabs or a wizard, making it easier to follow.
Terminology is standardized throughout the application.
Users can easily navigate between sections and understand their location within the app.
The navigation is accessible to keyboard and screen reader users.
Usability testing demonstrates improved user satisfaction and efficiency with navigation.
Out of Scope:

Adding new features beyond navigation improvements.
Major redesign of the application's visual style (unless directly related to navigation elements).
Additional Notes:

Refer to the attached UX audit report for more detailed findings and recommendations.
The DashboardHeader component can likely be repurposed or integrated into the new navigation menu.
The existing Sidebar component can be used as a base to create the new one.
Consider using existing components from the shadcn-ui library (e.g., NavigationMenu, Tabs) where appropriate to maintain consistency.