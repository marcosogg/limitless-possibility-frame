Document Guide: mybudget Dashboard

Introduction

This document provides a clear, straightforward guide to the desired outcome of the dashboard redesign in the "mybudget" application. We'll focus on simplicity and using the core React features, avoiding any over-engineering. This serves as a visual and functional reference for the development team.

I. Overall Vision

The primary goal is to create a user-friendly dashboard that is easy to understand, using only basic tools and concepts, to give a clear view of the current financial situation. This dashboard should be:

Simple: Easy to develop and understand by everyone on the team, avoiding complex logic or state management.
User-Focused: Easy for the user to understand and navigate.
Informative: Provides clear financial data without over complicating things.
Actionable: Enables users to easily take actions related to their budget and bills.
Responsive: Adapts to different screen sizes.
Consistent: Uses shadcn-ui for consistent visual elements.
II. Dashboard Layout

The new dashboard page will be at /dashboard. It will use a responsive grid layout (using tailwind css classes):

Desktop Layout (2 columns, using CSS Grid):

Top Row:

FinancialSummary Component: Displays key financial metrics horizontally, with a clear structure.
Middle Row: (Flexible - adjusts based on content)

MonthlyPlan Component: A simplified layout to display monthly planned expenses, showing category and progress.
BillRemindersSummary Component: Overview of upcoming bill reminders, with a quick link to manage them.
Bottom Row (Optional):

If we have enough time, a section with recent transactions

Mobile Layout (1 column):

All the components should be displayed one after another on a vertical layout.
Important information (Financial Summary) should be at the top.
III. Component Specifications

FinancialSummary Component:

Purpose: Show the user's overall financial status for the current month.
Implementation:
Use a shadcn-ui Card component as a container.
Use tailwindcss classes for responsive layout, and use shadcn-ui Button or Tooltip when needed.
Display data clearly using bold text for key numbers, and simple labels with appropriate visual hierarchy.
Use formatCurrency util function to display monetary values.
Data: Total Income, Planned Budget, Total Spending, and Available Amount.
Accessibility: Must have clear labels for screen readers, and keyboard navigable.
MonthlyPlan Component:

Purpose: Show a simplified view of the monthly budget plan, with the planned expenses.
Implementation:
Use a shadcn-ui Card to contain the content.
Use a straightforward layout to display each budget category with its planned value and progress.
Include the total planned budget.
Must adapt well to different screen sizes, using tailwindcss.
Must be created for this page only (as a custom component)
Data: Planned budget for each category and total planned budget.
Accessibility: Keyboard navigable, with screen reader support for all text elements and interactive components.
BillRemindersSummary Component:

Purpose: Show a quick summary of upcoming bill reminders.
Implementation:
Use a simplified version of the BillRemindersCard, only showing a few rows.
Use a shadcn-ui Card as a container.
Include a clear call-to-action, with a button to navigate to the BillReminders page.
Data: A small list of bill reminders.
Accessibility: Keyboard accessible and screen reader friendly.
OverBudgetWarning Component

Purpose: To provide a clear warning to the user if they are over budget on any given category.
Implementation:
Use the existing OverBudgetWarning component, but update the styles to use tailwindcss, if needed.
Data: Overspent categories and amounts.
Accessibility: Ensure all information is available for screen readers
DashboardHeader Component:

Purpose: To show the title of the current page.
Implementation: The component will only display a page title using a H1 tag, no other elements are necessary.
IV. Navigation

The main navigation sidebar will remain consistent for both desktop and mobile.
The dashboard is accessed through a menu item on the navigation sidebar.
V. Style Guide

We will be using shadcn-ui components as the main source of visual style, and we will use tailwind css to make minor style changes if needed.
The application must be clean, professional and accessible.
VI. Responsive Design

The dashboard must adjust and adapt well to different screen sizes using tailwindcss.
VII. Data Management

We will use basic React state to manage the data on the dashboard, without any external state management library.
VIII. Accessibility

All components must be accessible via keyboard, with correct ARIA attributes, and screen readers should read the contents correctly.
Simplicity First

The team must aim to keep everything as simple as possible, avoiding any complex logic or code. Prioritize clean, functional code over complex solutions.