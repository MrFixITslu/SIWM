# Vision79 SIWM - Comprehensive User Guide

Welcome to Vision79 Shipment Inventory & Warehouse Management (SIWM)! This comprehensive guide will help you master all features of the application. For additional help, use the VisionBot AI chatbot available in the bottom-right corner.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Login & Authentication](#login--authentication)
4. [Dashboard Overview](#dashboard-overview)
5. [Incoming Shipments (ASNs)](#incoming-shipments-asns)
    - [Creating ASNs](#creating-asns)
    - [Receiving Shipments](#receiving-shipments)
    - [Completing Shipments](#completing-shipments)
    - [Managing Discrepancies](#managing-discrepancies)
6. [Inventory Management](#inventory-management)
    - [Uploading Inventory via Excel/CSV](#uploading-inventory-via-excelcsv)
    - [Manual Inventory Entry](#manual-inventory-entry)
    - [Serialized vs Non-Serialized Items](#serialized-vs-non-serialized-items)
    - [Editing & Deleting Items](#editing--deleting-items)
    - [Inventory Movements & Tracking](#inventory-movements--tracking)
7. [Warehouse Orders](#warehouse-orders)
    - [Creating Orders](#creating-orders)
    - [Order Processing Workflow](#order-processing-workflow)
    - [Picking & Packing](#picking--packing)
8. [Dispatch & Logistics](#dispatch--logistics)
    - [Creating Outbound Shipments](#creating-outbound-shipments)
    - [Route Planning](#route-planning)
    - [Delivery Tracking](#delivery-tracking)
9. [Warehouse Management](#warehouse-management)
    - [Multi-Warehouse Support](#multi-warehouse-support)
    - [Location Management](#location-management)
    - [Capacity Tracking](#capacity-tracking)
10. [Vendor Management](#vendor-management)
    - [Adding Vendors](#adding-vendors)
    - [Vendor Performance Tracking](#vendor-performance-tracking)
11. [Asset Management](#asset-management)
    - [Equipment Tracking](#equipment-tracking)
    - [Maintenance Records](#maintenance-records)
12. [Master Data Governance](#master-data-governance)
13. [Reporting & Analytics](#reporting--analytics)
    - [Standard Reports](#standard-reports)
    - [AI-Powered Analytics](#ai-powered-analytics)
    - [Export Options](#export-options)
14. [AI-Powered Features](#ai-powered-features)
    - [VisionBot AI Chatbot](#visionbot-ai-chatbot)
    - [Logistics Optimization](#logistics-optimization)
    - [Inventory Forecasting](#inventory-forecasting)
    - [Supplier Performance Analysis](#supplier-performance-analysis)
15. [Notifications](#notifications)
16. [Compliance](#compliance)
17. [User Management](#user-management)
18. [Customer Support](#customer-support)
19. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled

### Initial Setup
1. **Access the Application**: Open your web browser and navigate to the Vision79 SIWM URL provided by your administrator
2. **Network Requirements**: Ensure you have access to the backend server (typically port 4000)
3. **Login Credentials**: Obtain your username and password from your system administrator
4. **First Login**: Log in with your provided credentials

![Login Page](screenshots/login.png)

---

## User Roles & Permissions

Vision79 SIWM uses role-based access control with the following user roles:

### **Admin**
- **Full System Access**: Complete access to all modules and features
- **User Management**: Can create, edit, and manage all user accounts
- **System Configuration**: Access to master data and system settings
- **All Permissions**: dashboard, incoming-shipments, inventory, orders, dispatch, warehouse-management, vendors, assets, master-data, reports, notifications, compliance, user-management, help

### **Manager**
- **Operational Oversight**: Access to most operational modules
- **Shipment Management**: Can complete shipments and manage discrepancies
- **Reporting Access**: Full reporting and analytics capabilities
- **Permissions**: dashboard, incoming-shipments, inventory, orders, dispatch, warehouse-management, vendors, assets, master-data, reports, notifications, compliance, help

### **Warehouse**
- **Warehouse Operations**: Full access to warehouse-related functions
- **Shipment Processing**: Can receive and process incoming shipments
- **Inventory Management**: Complete inventory control and tracking
- **Permissions**: dashboard, incoming-shipments, inventory, orders, dispatch, warehouse-management, vendors, assets, reports, notifications, help

### **Finance**
- **Financial Oversight**: Access to financial and compliance modules
- **Vendor Management**: Can manage vendor relationships and payments
- **Reporting**: Financial reports and analytics
- **Permissions**: dashboard, inventory, orders, vendors, reports, notifications, compliance, help

### **Broker**
- **Logistics Coordination**: Access to shipment and logistics modules
- **Vendor Relations**: Can manage vendor interactions
- **Permissions**: dashboard, incoming-shipments, inventory, orders, dispatch, vendors, reports, notifications, help

### **Requester**
- **Order Creation**: Can create warehouse orders
- **Inventory Viewing**: Read-only access to inventory information
- **Permissions**: dashboard, inventory, orders, notifications, help

### **Technician**
- **Asset Management**: Access to equipment and asset tracking
- **Maintenance Records**: Can update maintenance logs
- **Permissions**: dashboard, inventory, orders, assets, notifications, help

### **Contractor**
- **Limited Access**: Basic access to necessary modules
- **Asset Tracking**: Can view and update assigned assets
- **Permissions**: dashboard, inventory, orders, assets, notifications, help

---

## Login & Authentication

### Standard Login Process
1. **Navigate to Login Page**: Enter the application URL in your browser
2. **Enter Credentials**: 
   - Username: Your assigned username
   - Password: Your current password
3. **Click Login**: Press the "Login" button or press Enter
4. **Authentication**: The system will verify your credentials and redirect you to the dashboard

### Password Management
- **Forgot Password**: Click "Forgot Password" link on the login page
- **Password Reset**: Contact your system administrator for password reset
- **Password Requirements**: Follow your organization's password policy

### Session Management
- **Auto-Logout**: Sessions automatically expire after inactivity (configurable)
- **Remember Me**: Option to stay logged in across browser sessions
- **Multiple Sessions**: Can be logged in from multiple devices simultaneously

---

## Dashboard Overview

The dashboard provides a comprehensive overview of your warehouse operations with real-time metrics and quick access to key functions.

### Dashboard Components

#### **Key Metrics Cards**
- **Total Inventory Value**: Current value of all inventory items
- **Active Shipments**: Number of shipments in progress
- **Pending Orders**: Warehouse orders awaiting fulfillment
- **Low Stock Alerts**: Items below reorder point
- **System Health**: Overall system status and performance

#### **Quick Actions Panel**
- **Create ASN**: Quick access to create new incoming shipments
- **Add Inventory**: Direct link to inventory management
- **Create Order**: Start new warehouse order
- **Generate Report**: Quick report generation

#### **Recent Activity Feed**
- **Shipment Updates**: Latest shipment status changes
- **Inventory Movements**: Recent stock adjustments
- **Order Status Changes**: Order processing updates
- **System Notifications**: Important alerts and announcements

#### **AI Insights Panel**
- **Predictive Analytics**: AI-generated insights about inventory trends
- **Recommendations**: Suggested actions based on data analysis
- **Performance Metrics**: Key performance indicators with AI analysis

### Navigation
- **Sidebar Menu**: Use the left sidebar to navigate between modules
- **Breadcrumbs**: Track your current location within the application
- **Search**: Global search functionality available in the top navigation
- **Notifications**: Bell icon shows unread notifications count

![Dashboard Screenshot](screenshots/dashboard.png)

---

## Incoming Shipments (ASNs)

Advanced Shipping Notices (ASNs) are the foundation of the incoming shipment workflow. This module handles the complete lifecycle from shipment creation to completion.

### Creating ASNs

#### **Step-by-Step ASN Creation**
1. **Navigate to Incoming Shipments**: Click "Incoming Shipments" in the sidebar
2. **Click "Create ASN"**: Press the "Create New ASN" button
3. **Fill Basic Information**:
   - **ASN Number**: Unique identifier (auto-generated or manual entry)
   - **Vendor**: Select from existing vendors or add new
   - **Expected Arrival Date**: When shipment is expected
   - **Warehouse**: Destination warehouse
   - **Purchase Order Number**: Reference PO number
   - **Carrier Information**: Shipping company details
4. **Add Items to ASN**:
   - **Item Selection**: Choose from existing inventory items
   - **Quantity**: Expected quantity for each item
   - **Unit Cost**: Cost per unit (optional)
   - **Serial Numbers**: For serialized items (if known)
5. **Review and Save**: Verify all information and click "Create ASN"

#### **ASN Status Workflow**
- **Draft**: Initial creation state
- **Pending**: Awaiting arrival
- **Arrived**: Shipment received at warehouse
- **Processing**: Discrepancies detected, under review
- **Complete**: Successfully added to stock

### Receiving Shipments

#### **Receiving Process**
1. **Locate ASN**: Find the shipment in "Pending" or "Arrived" status
2. **Click "Receive"**: Press the "Receive Items" button
3. **Receiving Modal Opens**: Review expected items
4. **Enter Received Quantities**:
   - **Non-Serialized Items**: Enter actual received quantity
   - **Serialized Items**: Enter individual serial numbers
5. **Handle Discrepancies**:
   - **Overages**: More items received than expected
   - **Shortages**: Fewer items received than expected
   - **Damaged Items**: Items received in damaged condition
6. **Add Notes**: Document any issues or observations
7. **Complete Receiving**: Click "Confirm Receipt"

#### **Discrepancy Handling**
- **Automatic Detection**: System compares expected vs. received quantities
- **Status Change**: Shipment moves to "Processing" if discrepancies found
- **Review Required**: Manager/Admin approval needed for completion
- **Email Notification**: Procurement team notified of discrepancies

### Completing Shipments

#### **Completion Process** (Warehouse, Manager, Admin only)
1. **Review Shipment**: Ensure all items properly received
2. **Resolve Discrepancies**: Address any outstanding issues
3. **Click "Complete Shipment"**: Mark as "Added to Stock"
4. **System Actions**:
   - Updates inventory quantities
   - Records movement history
   - Sends completion email to procurement
   - Archives shipment (visible for 60 days)

#### **Post-Completion**
- **Inventory Update**: Stock levels automatically adjusted
- **Movement Log**: Complete audit trail created
- **Email Notification**: Sent to lc_procurement@digicel.com with details
- **Archive**: Shipment moves to "Completed" section

### Managing Discrepancies

#### **Types of Discrepancies**
- **Quantity Mismatches**: Expected vs. received quantities differ
- **Item Substitutions**: Different items received than ordered
- **Quality Issues**: Damaged or defective items
- **Missing Documentation**: Incomplete shipping paperwork

#### **Resolution Process**
1. **Document Issue**: Record discrepancy details in system
2. **Notify Stakeholders**: Email alerts sent to relevant parties
3. **Investigation**: Review with vendor and procurement team
4. **Resolution**: Update ASN with final quantities/notes
5. **Complete Shipment**: Finalize after resolution

![Incoming Shipments](screenshots/incoming-shipments.png)

---

## Inventory Management

The inventory management module provides comprehensive control over stock levels, item tracking, and inventory movements across multiple warehouses.

### Uploading Inventory via Excel/CSV

#### **Step-by-Step Upload Process**
1. **Navigate to Inventory**: Click "Inventory" in the sidebar
2. **Click "Upload Inventory"**: Press the "Upload Inventory" button
3. **Select File**: Click "Select Excel File" and choose your file
   - **Supported Formats**: `.xlsx`, `.xls`, `.csv`
   - **File Size Limit**: Maximum 10MB per file
4. **Download Template** (Optional): Click "Download Template" for correct formatting
5. **Review Preview**: Check the preview table for errors or warnings
   - **Validation Errors**: Red highlighting indicates required field issues
   - **Warnings**: Yellow highlighting shows potential data problems
6. **Confirm Upload**: Click "Upload" to process the file
7. **Review Results**: Check the summary of items added/updated

#### **Template Format Requirements**
**Required Fields:**
- **Item Name**: Unique name for the inventory item
- **Department**: Organizational department (e.g., IT, Operations, Maintenance)
- **Quantity**: Current stock quantity

**Optional Fields:**
- **Category**: Item classification (e.g., Electronics, Tools, Supplies)
- **Location**: Specific warehouse location
- **Reorder Point**: Minimum stock level before reordering
- **Safety Stock**: Buffer stock for demand fluctuations
- **Unit Cost**: Cost per unit for valuation
- **SKU**: Stock Keeping Unit identifier
- **Serialized**: Yes/No for serial number tracking
- **Warehouse**: Target warehouse for the item

#### **Data Validation Rules**
- **Item Names**: Must be unique within the same warehouse
- **Quantities**: Must be non-negative numbers
- **SKUs**: Must be unique if provided
- **Dates**: Must be in DD/MM/YYYY format [[memory:6296036]]
- **Serialized Items**: Require individual serial number tracking

![Inventory Upload Modal](screenshots/inventory-upload.png)

### Manual Inventory Entry

#### **Adding Individual Items**
1. **Click "Add Item"**: Press the "Add New Item" button
2. **Fill Item Details**:
   - **Basic Information**: Name, SKU, description
   - **Classification**: Category, department, type
   - **Stock Settings**: Initial quantity, reorder point, safety stock
   - **Location**: Warehouse and specific location
   - **Cost Information**: Unit cost, supplier details
3. **Serialization Settings**:
   - **Serialized Items**: Enable for individual tracking
   - **Serial Numbers**: Add initial serial numbers if applicable
4. **Save Item**: Click "Save" to add to inventory

#### **Item Configuration Options**
- **Multi-Warehouse**: Items can exist in multiple warehouses
- **Location Tracking**: Specific aisle, shelf, bin locations
- **Cost Tracking**: Multiple cost methods (FIFO, LIFO, Average)
- **Supplier Links**: Connect items to specific vendors
- **Custom Fields**: Additional data fields as needed

### Serialized vs Non-Serialized Items

#### **Serialized Items**
- **Individual Tracking**: Each unit has a unique serial number
- **Detailed History**: Complete movement and usage history
- **Warranty Tracking**: Service and maintenance records
- **Asset Management**: Integration with asset tracking
- **Compliance**: Regulatory tracking requirements

#### **Non-Serialized Items**
- **Quantity-Based**: Tracked by total quantity only
- **Bulk Operations**: Efficient for high-volume items
- **Simplified Management**: Easier inventory control
- **Cost Averaging**: Standard cost accounting methods

### Editing & Deleting Items

#### **Editing Items**
1. **Locate Item**: Find the item in the inventory table
2. **Click Edit**: Press the edit icon in the Actions column
3. **Modify Details**: Update any field as needed
4. **Save Changes**: Click "Save" to update the item

#### **Deleting Items**
1. **Select Item**: Choose the item to delete
2. **Click Delete**: Press the delete icon
3. **Confirm Deletion**: Confirm the action in the popup
4. **Check Dependencies**: Ensure no active shipments or orders reference the item

#### **Bulk Operations**
- **Bulk Edit**: Modify multiple items simultaneously
- **Bulk Delete**: Remove multiple items at once
- **Bulk Location Update**: Change locations for multiple items
- **Export Selected**: Export specific items to Excel/CSV

### Inventory Movements & Tracking

#### **Movement Types**
- **Received**: Items added from incoming shipments
- **Issued**: Items removed for orders or transfers
- **Transfer**: Items moved between warehouses/locations
- **Adjustment**: Manual quantity corrections
- **Return**: Items returned from customers or departments

#### **Movement History**
- **Complete Audit Trail**: All movements tracked with timestamps
- **User Attribution**: Who performed each movement
- **Reference Numbers**: Links to shipments, orders, or adjustments
- **Location Changes**: From/to location tracking
- **Quantity Changes**: Before/after quantities

#### **Real-Time Updates**
- **Live Inventory**: Stock levels update immediately
- **Concurrent Access**: Multiple users can work simultaneously
- **Conflict Resolution**: System handles simultaneous updates
- **Notifications**: Alerts for low stock or discrepancies

![Inventory Management](screenshots/inventory-management.png)

---

## Warehouse Orders

The warehouse orders module manages internal requests, picking operations, and order fulfillment workflows.

### Creating Orders

#### **Step-by-Step Order Creation**
1. **Navigate to Warehouse Orders**: Click "Warehouse Orders" in the sidebar
2. **Click "Create Order"**: Press the "Create New Order" button
3. **Fill Order Details**:
   - **Order Number**: Unique identifier (auto-generated)
   - **Requested By**: Name of person requesting items
   - **Department**: Requesting department
   - **Priority**: Urgency level (Low, Medium, High, Critical)
   - **Required Date**: When items are needed
   - **Purpose**: Reason for the request
4. **Add Items**:
   - **Search Items**: Use search to find required inventory
   - **Select Items**: Choose from available inventory
   - **Enter Quantities**: Specify how many of each item
   - **Add Notes**: Special instructions for each item
5. **Review and Submit**: Verify all details and click "Create Order"

#### **Order Status Workflow**
- **Draft**: Initial creation, can be modified
- **Submitted**: Order submitted for processing
- **Approved**: Manager approval received
- **Picking**: Items being gathered from warehouse
- **Packed**: Items packaged and ready
- **Shipped**: Order dispatched
- **Delivered**: Order completed
- **Cancelled**: Order cancelled

### Order Processing Workflow

#### **Approval Process**
1. **Manager Review**: Orders require manager approval
2. **Availability Check**: System verifies stock availability
3. **Approval Decision**: Approve, reject, or request modifications
4. **Notification**: Requester notified of decision

#### **Fulfillment Process**
1. **Picking Assignment**: Orders assigned to warehouse staff
2. **Pick List Generation**: Detailed picking instructions created
3. **Item Collection**: Staff gather items from warehouse locations
4. **Quality Check**: Verify correct items and quantities
5. **Packaging**: Items packaged for delivery
6. **Dispatch**: Order marked as shipped

### Picking & Packing

#### **Picking Operations**
- **Pick Lists**: Detailed instructions with locations
- **Route Optimization**: Efficient picking paths
- **Barcode Scanning**: Verify correct items
- **Quantity Verification**: Confirm picked quantities
- **Exception Handling**: Manage out-of-stock items

#### **Packing Process**
- **Packaging Instructions**: Specific packaging requirements
- **Label Generation**: Shipping labels and documentation
- **Quality Control**: Final verification before dispatch
- **Documentation**: Complete packing slips and manifests

![Warehouse Orders](screenshots/warehouse-orders.png)

---

## Dispatch & Logistics

The dispatch module handles outbound shipments, route planning, and delivery tracking with AI-powered optimization.

### Creating Outbound Shipments

#### **Shipment Creation Process**
1. **Navigate to Dispatch**: Click "Dispatch & Logistics" in the sidebar
2. **Click "Create Shipment"**: Press "New Outbound Shipment"
3. **Fill Shipment Details**:
   - **Shipment Number**: Unique identifier
   - **Destination**: Delivery address and contact
   - **Carrier**: Shipping company selection
   - **Service Level**: Express, standard, economy
   - **Shipment Date**: When to ship
   - **Special Instructions**: Handling requirements
4. **Add Items**: Select items from completed orders
5. **Calculate Costs**: System estimates shipping costs
6. **Generate Labels**: Create shipping documentation
7. **Schedule Pickup**: Arrange carrier pickup

### Route Planning

#### **AI-Powered Route Optimization**
1. **Access Route Planner**: Click "Route Optimization" in dispatch module
2. **Enter Constraints**:
   - **Origin**: Starting location
   - **Destinations**: Multiple delivery points
   - **Time Windows**: Delivery time constraints
   - **Vehicle Capacity**: Load limitations
   - **Driver Preferences**: Rest breaks, fuel stops
3. **Run Optimization**: Click "Optimize Route"
4. **Review Results**: AI suggests optimal route
5. **Accept or Modify**: Use suggested route or make adjustments

#### **Route Features**
- **Multi-Stop Optimization**: Efficient multi-delivery routes
- **Real-Time Traffic**: Current traffic conditions
- **Fuel Optimization**: Minimize fuel consumption
- **Time Windows**: Respect delivery time constraints
- **Vehicle Tracking**: Real-time location monitoring

### Delivery Tracking

#### **Tracking Capabilities**
- **Real-Time Updates**: Live shipment status
- **GPS Tracking**: Precise location information
- **Delivery Confirmation**: Proof of delivery
- **Exception Handling**: Delivery issues and resolutions
- **Customer Notifications**: Automated status updates

![Dispatch & Logistics](screenshots/dispatch-logistics.png)

---

## Warehouse Management

Comprehensive warehouse management with multi-location support, capacity tracking, and performance analytics.

### Multi-Warehouse Support

#### **Warehouse Configuration**
1. **Navigate to Warehouse Management**: Click "Warehouse Management" in sidebar
2. **Add New Warehouse**: Click "Add Warehouse"
3. **Configure Details**:
   - **Warehouse Name**: Unique identifier
   - **Address**: Physical location
   - **Capacity**: Maximum storage capacity
   - **Zones**: Storage areas (ambient, cold, frozen)
   - **Operating Hours**: Business hours
4. **Set Up Zones**: Define storage areas within warehouse
5. **Configure Aisles**: Set up aisle and shelf system

#### **Zone Management**
- **Ambient Storage**: Room temperature items
- **Cold Storage**: Refrigerated items
- **Frozen Storage**: Freezer items
- **Hazardous Materials**: Special handling zones
- **High-Value Items**: Secure storage areas

### Location Management

#### **Location Hierarchy**
- **Warehouse**: Top-level location
- **Zone**: Storage area within warehouse
- **Aisle**: Row within zone
- **Shelf**: Level within aisle
- **Bin**: Specific storage position

#### **Location Setup**
1. **Create Zones**: Define storage areas
2. **Add Aisles**: Numbered rows within zones
3. **Configure Shelves**: Levels within aisles
4. **Set Up Bins**: Specific storage positions
5. **Assign Items**: Link inventory to locations

### Capacity Tracking

#### **Capacity Monitoring**
- **Real-Time Usage**: Current capacity utilization
- **Available Space**: Remaining storage capacity
- **Trend Analysis**: Capacity usage over time
- **Alerts**: Low capacity warnings
- **Optimization**: Space utilization suggestions

#### **Performance Metrics**
- **Throughput**: Items processed per hour
- **Accuracy**: Picking accuracy rates
- **Efficiency**: Space utilization percentages
- **Cost per Unit**: Storage cost analysis

![Warehouse Management](screenshots/warehouse-management.png)

---

## Vendor Management

Comprehensive vendor relationship management with performance tracking and supplier analytics.

### Adding Vendors

#### **Vendor Registration Process**
1. **Navigate to Vendors**: Click "Vendors" in the sidebar
2. **Click "Add Vendor"**: Press "Add New Vendor"
3. **Fill Vendor Information**:
   - **Company Name**: Legal business name
   - **Contact Information**: Address, phone, email
   - **Primary Contact**: Main point of contact
   - **Payment Terms**: Credit terms and conditions
   - **Tax Information**: Tax ID and compliance details
4. **Set Vendor Categories**: Classify vendor type
5. **Configure Settings**: Default preferences and settings
6. **Save Vendor**: Complete registration

#### **Vendor Categories**
- **Suppliers**: Product and material suppliers
- **Service Providers**: Maintenance and service vendors
- **Carriers**: Shipping and logistics providers
- **Contractors**: External service contractors

### Vendor Performance Tracking

#### **Performance Metrics**
- **On-Time Delivery**: Delivery performance tracking
- **Quality Ratings**: Product quality assessments
- **Cost Analysis**: Price competitiveness
- **Service Quality**: Customer service ratings

#### **AI-Powered Supplier Analysis**
1. **Access Analytics**: Click "Supplier Analysis" in vendor module
2. **Select Vendor**: Choose vendor to analyze
3. **Run Analysis**: Click "Analyze Performance"
4. **Review Results**: AI-generated performance report
5. **Take Action**: Implement improvement recommendations

![Vendor Management](screenshots/vendor-management.png)

---

## Asset Management

Equipment and asset tracking with maintenance scheduling and performance monitoring.

### Equipment Tracking

#### **Asset Registration**
1. **Navigate to Assets**: Click "Asset Management" in sidebar
2. **Add New Asset**: Click "Add Asset"
3. **Fill Asset Details**:
   - **Asset Tag**: Unique identifier
   - **Asset Name**: Equipment name/description
   - **Category**: Type of equipment
   - **Location**: Current warehouse location
   - **Purchase Date**: When acquired
   - **Cost**: Purchase price
   - **Warranty**: Warranty information
4. **Set Maintenance Schedule**: Regular maintenance intervals
5. **Assign Responsibility**: Who manages the asset
6. **Save Asset**: Complete registration

### Maintenance Records

#### **Maintenance Tracking**
- **Scheduled Maintenance**: Regular service intervals
- **Preventive Maintenance**: Proactive maintenance
- **Corrective Maintenance**: Repair work
- **Downtime Tracking**: Equipment availability
- **Cost Tracking**: Maintenance expenses

#### **Maintenance Workflow**
1. **Schedule Maintenance**: Set up maintenance tasks
2. **Assign Technicians**: Assign qualified staff
3. **Perform Work**: Complete maintenance tasks
4. **Record Results**: Document work performed
5. **Update Status**: Mark asset as operational

![Asset Management](screenshots/asset-management.png)

---

## Master Data Governance

Centralized management of master data including item catalogs, vendor information, and system configurations.

### Data Management Features
- **Item Master**: Centralized item catalog
- **Vendor Master**: Supplier database
- **Location Master**: Warehouse and location data
- **User Master**: User account management
- **Configuration**: System settings and preferences

### Data Quality Controls
- **Validation Rules**: Data integrity checks
- **Duplicate Detection**: Prevent duplicate entries
- **Data Cleansing**: Clean and standardize data
- **Audit Trails**: Track data changes
- **Approval Workflows**: Data change approvals

![Master Data](screenshots/master-data.png)

---

## Reporting & Analytics

Comprehensive reporting capabilities with standard reports and AI-powered analytics.

### Standard Reports

#### **Inventory Reports**
- **Stock Levels**: Current inventory quantities
- **Movement History**: Item movement tracking
- **Aged Inventory**: Items by age
- **Low Stock**: Items below reorder point
- **Valuation**: Inventory value reports

#### **Operational Reports**
- **Shipment Status**: Incoming shipment tracking
- **Order Fulfillment**: Order processing metrics
- **Dispatch Performance**: Outbound shipment tracking
- **Warehouse Utilization**: Space usage reports

#### **Financial Reports**
- **Inventory Valuation**: Asset value tracking
- **Cost Analysis**: Operational cost reports
- **Vendor Performance**: Supplier cost analysis
- **ROI Reports**: Return on investment metrics

### AI-Powered Analytics

#### **Natural Language Queries**
1. **Access Analytics**: Click "Reporting & Analytics" in sidebar
2. **Enter Query**: Type natural language question
   - Example: "Show me inventory by category for last month"
   - Example: "Which vendors have the best delivery performance?"
   - Example: "What items are running low in Warehouse A?"
3. **Run Analysis**: Click "Analyze" button
4. **Review Results**: AI-generated insights and visualizations
5. **Export Data**: Save results to Excel/PDF

#### **Predictive Analytics**
- **Demand Forecasting**: Predict future inventory needs
- **Trend Analysis**: Identify patterns in data
- **Anomaly Detection**: Spot unusual patterns
- **Optimization Suggestions**: AI recommendations

### Export Options

#### **Export Formats**
- **Excel**: Spreadsheet format for analysis
- **PDF**: Formatted reports for sharing
- **CSV**: Data export for other systems
- **JSON**: API data format

#### **Export Features**
- **Scheduled Exports**: Automated report generation
- **Custom Formats**: User-defined export templates
- **Email Delivery**: Automatic report distribution
- **Data Filtering**: Export specific data subsets

![Reporting & Analytics](screenshots/reporting-analytics.png)

---

## AI-Powered Features

Vision79 SIWM includes advanced AI capabilities powered by Google's Gemini AI to enhance logistics operations.

### VisionBot AI Chatbot

#### **How to Use VisionBot**
1. **Access Chatbot**: Click the chat icon in the bottom-right corner
2. **Type Your Question**: Enter your question in natural language
3. **Send Message**: Press Enter or click the send button
4. **Receive Response**: AI provides detailed, contextual answers
5. **Follow-Up**: Ask additional questions in the same conversation

#### **VisionBot Capabilities**
- **Feature Guidance**: Step-by-step instructions for all features
- **Logistics Questions**: Answer questions about shipping, inventory, and operations
- **Data Analysis**: Help interpret reports and metrics
- **Troubleshooting**: Assist with common issues and problems
- **Best Practices**: Provide recommendations for optimal operations

#### **Example Questions**
- "How do I receive a shipment?"
- "Show me items below reorder point"
- "What's the best way to optimize warehouse layout?"
- "How do I create a new vendor?"
- "Explain the difference between serialized and non-serialized items"

### Logistics Optimization

#### **Shipping Route Optimization**
1. **Navigate to Logistics Optimization**: Click "Logistics Optimization" in sidebar
2. **Select Route Optimization**: Choose "Shipping Route Optimization"
3. **Enter Parameters**:
   - **Origin**: Starting location
   - **Destination**: End location
   - **Constraints**: Time limits, cost limits, carrier preferences
4. **Run Optimization**: Click "Optimize Route"
5. **Review Results**: AI suggests optimal route with cost and time estimates
6. **Implement**: Use suggested route for actual shipments

#### **Inventory Forecasting**
1. **Access Forecasting**: Click "Inventory Forecasting" in logistics module
2. **Select Items**: Choose items to forecast
3. **Set Parameters**: Time horizon, confidence level, seasonality
4. **Run Forecast**: Click "Generate Forecast"
5. **Review Predictions**: AI predicts future demand and suggests reorder points
6. **Take Action**: Adjust inventory levels based on predictions

#### **Supplier Performance Analysis**
1. **Select Supplier Analysis**: Click "Supplier Performance Analysis"
2. **Choose Vendor**: Select vendor to analyze
3. **Set Analysis Period**: Define time range for analysis
4. **Run Analysis**: Click "Analyze Performance"
5. **Review Results**: AI evaluates delivery, quality, and cost performance
6. **Implement Changes**: Use recommendations to improve vendor relationships

#### **Warehouse Layout Optimization**
1. **Access Layout Optimization**: Click "Warehouse Layout Optimization"
2. **Upload Current Layout**: Provide current warehouse configuration
3. **Set Constraints**: Physical limitations and requirements
4. **Run Optimization**: Click "Optimize Layout"
5. **Review Suggestions**: AI suggests layout improvements for efficiency
6. **Plan Implementation**: Use recommendations for warehouse redesign

### AI Features Requirements
- **Gemini API Key**: Valid API key required for AI features
- **Internet Connection**: AI features require internet access
- **User Permissions**: Some AI features may be restricted by user role
- **Data Privacy**: All AI interactions are secure and private

![AI Features](screenshots/ai-features.png)

---

## Notifications

The notification system keeps you informed of important events, alerts, and system updates.

### Notification Types

#### **System Notifications**
- **Low Stock Alerts**: Items below reorder point
- **Shipment Updates**: Status changes for incoming shipments
- **Order Status**: Warehouse order processing updates
- **System Maintenance**: Scheduled maintenance notifications
- **Security Alerts**: Login attempts and security events

#### **Workflow Notifications**
- **Approval Requests**: Items requiring manager approval
- **Discrepancy Alerts**: Shipment discrepancies requiring attention
- **Overdue Tasks**: Pending actions and deadlines
- **Exception Reports**: Unusual patterns or errors

### Notification Management

#### **Viewing Notifications**
1. **Access Notifications**: Click the bell icon in the top navigation
2. **Review List**: See all unread notifications
3. **Mark as Read**: Click individual notifications to mark as read
4. **Clear All**: Mark all notifications as read

#### **Notification Preferences**
1. **Access Settings**: Click your profile icon
2. **Notification Settings**: Select "Notification Preferences"
3. **Configure Types**: Choose which notifications to receive
4. **Set Frequency**: Configure how often to receive notifications
5. **Email Settings**: Enable/disable email notifications

![Notifications](screenshots/notifications.png)

---

## Compliance

The compliance module ensures adherence to regulations, standards, and internal policies.

### Compliance Features

#### **Audit Trails**
- **Complete History**: Track all system activities
- **User Actions**: Monitor user activities and changes
- **Data Changes**: Record all data modifications
- **System Events**: Log system operations and errors

#### **Regulatory Compliance**
- **Data Retention**: Automatic data retention policies
- **Privacy Controls**: GDPR and privacy regulation compliance
- **Security Standards**: Industry security standard adherence
- **Documentation**: Compliance documentation and reports

#### **Reporting**
- **Compliance Reports**: Generate compliance status reports
- **Audit Reports**: Detailed audit trail reports
- **Exception Reports**: Non-compliance issues and resolutions
- **Trend Analysis**: Compliance trend monitoring

![Compliance](screenshots/compliance.png)

---

## User Management

Comprehensive user account management with role-based access control and security features.

### User Administration (Admin Only)

#### **Adding New Users**
1. **Navigate to User Management**: Click "User Management" in sidebar
2. **Click "Add User"**: Press "Add New User" button
3. **Fill User Details**:
   - **Username**: Unique login identifier
   - **Full Name**: User's complete name
   - **Email**: Contact email address
   - **Department**: Organizational department
   - **Phone**: Contact phone number
4. **Assign Role**: Select appropriate user role
5. **Set Permissions**: Configure page-level permissions
6. **Generate Password**: Create initial password
7. **Save User**: Complete user creation

#### **Editing Users**
1. **Find User**: Locate user in the user table
2. **Click Edit**: Press edit icon in Actions column
3. **Modify Details**: Update user information
4. **Change Role**: Modify user role if needed
5. **Update Permissions**: Adjust page permissions
6. **Save Changes**: Confirm modifications

#### **User Actions**
- **Activate/Deactivate**: Enable or disable user accounts
- **Reset Password**: Force password reset for users
- **Bulk Operations**: Manage multiple users simultaneously
- **Export Users**: Export user data to Excel/CSV

### User Roles and Permissions

#### **Role Assignment**
- **Admin**: Full system access and user management
- **Manager**: Operational oversight and approval authority
- **Warehouse**: Warehouse operations and inventory management
- **Finance**: Financial oversight and vendor management
- **Broker**: Logistics coordination and vendor relations
- **Requester**: Order creation and inventory viewing
- **Technician**: Asset management and maintenance
- **Contractor**: Limited access for external contractors

#### **Permission Management**
- **Page-Level Permissions**: Control access to specific modules
- **Feature-Level Permissions**: Granular control over features
- **Data Access**: Control data visibility and modification rights
- **Action Permissions**: Control specific actions (create, edit, delete)

![User Management](screenshots/user-management.png)

---

## Customer Support

The customer support module provides tools for managing support tickets and customer service operations.

### Support Ticket Management

#### **Creating Support Tickets**
1. **Navigate to Customer Support**: Click "Customer Support" in sidebar
2. **Click "New Ticket"**: Press "Create Support Ticket"
3. **Fill Ticket Details**:
   - **Subject**: Brief description of the issue
   - **Category**: Type of issue (Technical, Billing, Inventory, Shipping, General)
   - **Priority**: Urgency level (Low, Medium, High, Critical)
   - **Description**: Detailed description of the problem
   - **Attachments**: Upload relevant files or screenshots
4. **Submit Ticket**: Click "Submit Ticket"

#### **Ticket Categories**
- **Technical**: System issues and technical problems
- **Billing**: Payment and billing questions
- **Inventory**: Inventory management issues
- **Shipping**: Shipping and logistics problems
- **General**: General questions and requests

#### **Priority Levels**
- **Critical**: System down or major functionality issues
- **High**: Important issues affecting operations
- **Medium**: Standard issues requiring attention
- **Low**: Minor issues or general questions

### Support Analytics

#### **Performance Metrics**
- **Response Time**: Average time to first response
- **Resolution Time**: Average time to resolve tickets
- **Customer Satisfaction**: Customer feedback and ratings
- **Ticket Volume**: Number of tickets by category and time period

#### **Support Dashboard**
- **Open Tickets**: Currently active support requests
- **Overdue Tickets**: Tickets exceeding response time limits
- **Trend Analysis**: Support ticket trends and patterns
- **Team Performance**: Individual support agent metrics

![Customer Support](screenshots/customer-support.png)

---

## Troubleshooting & FAQ

### Common Issues and Solutions

#### **Login Problems**
- **Cannot Log In**: 
  - Verify username and password are correct
  - Check if account is active (not deactivated)
  - Contact administrator for password reset
  - Ensure browser cookies are enabled
- **Session Expired**: 
  - Log in again with your credentials
  - Check "Remember Me" option for longer sessions
  - Contact admin if sessions expire too quickly

#### **File Upload Issues**
- **Upload Fails**: 
  - Ensure file matches template format exactly
  - Check that all required columns are present
  - Verify file size is under 10MB limit
  - Use supported formats (.xlsx, .xls, .csv)
- **Data Validation Errors**: 
  - Review error messages in preview table
  - Fix required field issues (red highlighting)
  - Address data format problems (yellow warnings)
  - Ensure unique item names within warehouse

#### **Permission Issues**
- **Missing Features**: 
  - Check your user role and permissions
  - Contact administrator to verify access rights
  - Ensure you have the correct user group assignment
- **Access Denied**: 
  - Verify you have permission for the specific module
  - Check if your role allows the requested action
  - Contact administrator for permission updates

#### **Performance Issues**
- **Slow Loading**: 
  - Check internet connection stability
  - Clear browser cache and cookies
  - Try refreshing the page
  - Contact IT support if issues persist
- **Data Not Updating**: 
  - Refresh the page to get latest data
  - Check if other users are making changes
  - Verify your session is still active
  - Contact administrator if data appears incorrect

#### **AI Features Not Working**
- **VisionBot Not Responding**: 
  - Check internet connection
  - Verify Gemini API key is configured
  - Try refreshing the page
  - Contact administrator for API key issues
- **AI Analytics Errors**: 
  - Ensure you have permission for AI features
  - Check that sufficient data exists for analysis
  - Verify API key is valid and active
  - Contact support for advanced AI issues

### Best Practices

#### **Data Management**
- **Regular Backups**: Export important data regularly
- **Data Validation**: Always review data before uploading
- **Consistent Naming**: Use consistent naming conventions
- **Documentation**: Keep notes on important changes

#### **Security**
- **Strong Passwords**: Use complex passwords
- **Logout**: Always logout when finished
- **Shared Computers**: Never save passwords on shared devices
- **Report Issues**: Report any security concerns immediately

#### **Efficiency Tips**
- **Use Filters**: Use search and filter functions to find data quickly
- **Keyboard Shortcuts**: Learn keyboard shortcuts for common actions
- **Bulk Operations**: Use bulk operations for multiple items
- **Regular Updates**: Keep the application updated for best performance

### Getting Additional Help

#### **VisionBot AI Assistant**
- **Ask Questions**: Use the chatbot for immediate help
- **Feature Guidance**: Get step-by-step instructions
- **Troubleshooting**: Ask about specific error messages
- **Best Practices**: Get recommendations for optimal usage

#### **Support Resources**
- **User Guide**: This comprehensive guide covers all features
- **System Administrator**: Contact your local administrator
- **IT Support**: Reach out to IT support for technical issues
- **Training**: Request additional training for complex features

#### **Contact Information**
- **System Administrator**: [Your Admin Contact]
- **IT Support**: [Your IT Support Contact]
- **Emergency Support**: [Emergency Contact Information]

---

## Adding Screenshots

To enhance this guide with visual aids, place your screenshots in the `screenshots/` folder at the project root. Use the same filenames as referenced above for images to appear in this guide.

### Recommended Screenshots
- `login.png` - Login page
- `dashboard.png` - Main dashboard
- `incoming-shipments.png` - Incoming shipments page
- `inventory-management.png` - Inventory management page
- `warehouse-orders.png` - Warehouse orders page
- `dispatch-logistics.png` - Dispatch and logistics page
- `warehouse-management.png` - Warehouse management page
- `vendor-management.png` - Vendor management page
- `asset-management.png` - Asset management page
- `master-data.png` - Master data governance page
- `reporting-analytics.png` - Reporting and analytics page
- `ai-features.png` - AI features page
- `notifications.png` - Notifications page
- `compliance.png` - Compliance page
- `user-management.png` - User management page
- `customer-support.png` - Customer support page

---

## Conclusion

This comprehensive user guide covers all features and functionality of Vision79 SIWM. For additional help, use the VisionBot AI chatbot available in the bottom-right corner of the application, or contact your system administrator.

Remember to:
- Keep this guide updated as new features are added
- Provide feedback on guide improvements
- Share best practices with your team
- Report any issues or suggestions for enhancement

For more technical details, see the README files or ask VisionBot for specific technical information. 