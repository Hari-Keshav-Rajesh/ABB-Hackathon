# Overview

IntelliInspect is a responsive Angular 18+ application that provides a machine learning workflow interface for quality inspection analysis. The application simulates a complete data science pipeline through a 4-step guided process: dataset upload, date range configuration, model training, and real-time simulation. Built with Angular Material for a modern UI and Chart.js for data visualization, the app uses static dummy data and RxJS timers to simulate real-world ML operations without requiring backend services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Angular 18+ with TypeScript for type safety and modern development practices
- **UI Framework**: Angular Material provides consistent Material Design components including steppers, cards, forms, and navigation
- **Component Structure**: Modular component-based architecture with dedicated components for each workflow step (upload-dataset, date-ranges, model-training, simulation)
- **State Management**: Simple component-based state management using EventEmitter for inter-component communication and parent-child data flow
- **Responsive Design**: CSS Grid and Angular Material's responsive utilities ensure mobile-first design

## Data Visualization
- **Charting Library**: Chart.js with ng2-charts wrapper for Angular integration
- **Chart Types**: Utilizes bar charts for volume data, line charts for training metrics and quality scores, and donut charts for confusion matrices
- **Real-time Updates**: RxJS intervals simulate live data streaming for the simulation component

## Form Management
- **Reactive Forms**: Angular Reactive Forms with FormBuilder for date range inputs and validation
- **Date Handling**: Angular Material Datepicker with native date module for consistent date selection across training, testing, and simulation ranges
- **Validation**: Built-in form validation with visual feedback for required fields and date range validation

## Application Flow
- **Stepper Navigation**: Linear workflow using Angular Material's stepper component with step completion tracking
- **File Upload Simulation**: Drag-and-drop interface that accepts files but uses static data for demonstration
- **Async Simulation**: RxJS observables with interval operators simulate real-time data processing and model predictions

## Styling and Responsiveness
- **CSS Architecture**: Component-scoped CSS with global utility classes for spacing and layout
- **Material Theming**: Uses Angular Material's indigo-pink theme with custom gradient cards for metrics
- **Mobile Optimization**: Responsive grid layouts that adapt to different screen sizes using CSS Grid and flexbox

# External Dependencies

## Core Angular Dependencies
- **@angular/core**: ^20.1.7 - Core Angular framework
- **@angular/material**: ^20.1.6 - Material Design components
- **@angular/cdk**: ^20.1.6 - Component Development Kit for advanced UI patterns
- **@angular/forms**: ^20.1.7 - Reactive and template-driven forms
- **@angular/router**: ^20.1.7 - Client-side routing (ready for future navigation features)

## Data Visualization
- **chart.js**: ^4.5.0 - Core charting library for data visualization
- **ng2-charts**: ^8.0.0 - Angular wrapper for Chart.js integration
- **@types/chart.js**: ^2.9.41 - TypeScript definitions for Chart.js

## Development Tools
- **typescript**: ^5.9.2 - TypeScript compiler for type safety
- **rxjs**: ^7.8.2 - Reactive programming library for async operations
- **zone.js**: ^0.15.1 - Angular's change detection mechanism

## No Backend Dependencies
The application is designed to run entirely in the browser without external APIs, databases, or backend services. All data is generated using static dummy data and RxJS timers to simulate real-world scenarios.