
**Navigation Documentation**

**1. Overall Navigation Structure**

The application will feature a clear and consistent navigation system, designed to allow users to easily access the different sections and features of the application. The navigation experience will be tailored to the user's device, using a responsive approach that adapts to desktop/tablet and mobile screens.

**2. Top-Level Navigation (Desktop and Tablet)**

On desktop and tablet devices, the application will provide a persistent, horizontal navigation bar (`Navbar`) located at the top of the screen. This `Navbar` will provide quick access to all major sections of the application.

   *   **Primary Navigation Items:** The `Navbar` will include the following navigation items, presented as clickable buttons or links:
        *   **Dashboard:** This will be the default landing page for authenticated users, and display an overview of their budget and finances.
        *   **Create Budget:** This will take users to the budget creation page, where they can define monthly income and expense targets.
        *   **Bill Reminders:** This section will allow users to manage their recurring bills and setup notifications.
        *   **Revolut Import:** This option will lead to the transaction import page, allowing users to import their Revolut bank statements.

   *   **Visual Design:** Navigation items on the `Navbar` will be easily identifiable. The currently active page will have a visual cue to help users understand their current location.
    *   **User Experience**: The overall feel of the `Navbar` should be modern, clean and very easy to use.

**3. Mobile Navigation**

On mobile devices, navigation will be handled through a side drawer menu (`Sidebar`). This will be triggered by a button in the header area of the application.

    *   **Menu Display:** When activated, the `Sidebar` will slide into view, revealing the same main navigation options as the `Navbar` on larger screens.
    *   **Accessibility:** The `Sidebar` will be accessible, using appropriate `ARIA` attributes and will allow for keyboard navigation.
    *   **Ease of Use:** The `Sidebar` will be easy to activate and dismiss, and provide clear feedback on the currently selected item.
    * **State Preservation**: The state of the `Sidebar`, open/close, should be saved to a cookie and reloaded on subsequent sessions

**4. Within-Section Navigation (Revolut Import)**

Within the Revolut Import section, the user will be guided through a structured import process. The import flow will be broken down into the following steps:

    *   **Upload File:** Users will start by uploading a CSV file containing their Revolut transactions.
    *   **Review Transactions:** The application will process the file and display a table of the identified transactions.
    *   **Categorize Transactions:** Users can review the categorized transactions, and update the category for the transactions that have been automatically categorized incorrectly.
    *  **Confirm Import:** Users will complete the process by confirming that they want to save the transactions.

 This multi-step flow within `Revolut Import` will be presented using tabs, where each tab will represent a specific stage of the import process. Clear forward and backward buttons should allow the user to easily navigate between the tabs.

**5. Overall Navigation Experience**

The navigation experience should be:

   *   **Intuitive:** Users should easily understand the application's layout.
   *   **Consistent:** Navigation elements and their behaviors should be the same across different parts of the application.
   *   **Responsive:** The system will adapt to different screen sizes, ensuring usability across all devices.
   *   **Accessible:** All navigation elements will be easily accessible to users, including those with disabilities.
    * **Performant**: The navigation should load fast, and not cause any performance issues on the application.

**6. Terminology**

   *  **Standardized Terminology:** We will consistently use `Revolut Import` to refer to the import function related to Revolut transactions. We will use `Import History` to access a list of previous imports.

**7. Future Considerations:**
    * The structure should be easily extendable to include future features without a major layout redesign.

**In summary,** the application will have a dual navigation structure where:

* Desktop and Tablet users will have a clear `Navbar` at the top of the screen for easy access to all main application areas.
* Mobile users will have a `Sidebar` menu, triggered by a button in the header, to achieve the same level of ease of use.

Additionally, some sections will have more complex workflows, where the use of tabs are required to separate the steps, and improve ease of use.
