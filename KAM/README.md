# Lead Management System for Udaan's B2B Platform (Shatakshi Shukla)

## Project Overview
This is a web-based lead management system designed for Udaan's B2B e-commerce platform to help Key Account Managers (KAMs) track their restaurant leads and interactions. The system provides a comprehensive solution for managing restaurant leads, contacts, and interactions through an intuitive interface.

## Website Demonstration video link: https://drive.google.com/file/d/1QI08S_Pz5SYn8MmEXItpsGhhcIqAL-kH/view?usp=sharing
## Answering all the System Design & Data modelling questions and discussing edge cases here: https://docs.google.com/document/d/1BlgB665brv9whvJ-sxuEk_Br-uu2lC1Zm33eMSagQZg/edit?usp=sharing

## Features

### Lead Management
- Create and manage restaurant leads with detailed information
- Track essential details including restaurant name, address, contact information
- Monitor lead status (New, Active, Inactive)
- Assign leads to specific KAMs

### Contact Management
- Store multiple contacts per restaurant
- Maintain contact details including name, role, phone number, and email
- Support different role types (Owner, Manager, Staff)

### Interaction Tracking
- Log various types of interactions (Calls, Visits, Orders)
- Record interaction dates and detailed notes
- Flag interactions requiring follow-up
- Maintain a chronological history of all lead interactions

### Dashboard Features
- View comprehensive list of all leads
- Track pending calls for the day
- Monitor recent interactions
- Implement real-time search functionality
- Display key metrics and statistics


## Technical Architecture

### Backend
- **Framework**: Node.js with Express
- **Database**: MySQL with connection pooling
- **API Structure**: RESTful architecture
- **Main Routes**:
  - `/api/leads`: Lead management endpoints
  - `/api/contacts`: Contact management endpoints
  - `/api/interactions`: Interaction tracking endpoints

### Frontend
- **Framework**: Vanilla JavaScript with Bootstrap 
- **UI Components**: 
  - Responsive dashboard
  - Modal forms for data entry
  - Interactive data tables
  - Real-time search functionality
- **Styling**: Bootstrap for consistent and responsive design

## Database Schema

### Leads Table
```sql
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_name VARCHAR(255) NOT NULL,
  address TEXT,
  contact_number VARCHAR(20),
  status ENUM('New', 'Active', 'Inactive') DEFAULT 'New',
  assigned_kam VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
)
```

### Interactions Table
```sql
CREATE TABLE interactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT,
  interaction_date DATE NOT NULL,
  interaction_type ENUM('Call', 'Visit', 'Order') NOT NULL,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
)
```
### MySQL SnapShot:
<img width="800" alt="image" src="https://github.com/user-attachments/assets/aa2fe55b-2a7c-48d0-a36e-5310e27b3443" />

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shatakshishukla17/KAM-Shatakshi-Shukla-Udaan.git
   cd lead-management-system
   ```
   OR
   Download the zip file

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Database Configuration**
   - Create a MySQL database
   - Update database configuration in `config/database.js`:
     ```javascript
     const connection = mysql.createConnection({
       host: 'localhost',
       user: 'your_username',
       password: 'your_password', //write your MySQL password here
       database: 'lead_management'
     });
     ```

5. **Start the Server**
   ```bash
   node server.js
   ```
   The application will be available at `http://localhost:3000`


## API Endpoints

### Leads
- `GET /api/leads`: Retrieve all leads
- `GET /api/leads/search`: Search leads
- `GET /api/leads/:id`: Get specific lead details
- `POST /api/leads`: Create new lead
- `PUT /api/leads/:id`: Update lead
- `DELETE /api/leads/:id`: Delete lead

### Contacts
- `GET /api/contacts/lead/:leadId`: Get contacts for a lead
- `POST /api/contacts`: Add new contact

### Interactions
- `GET /api/interactions/lead/:leadId`: Get interactions for a lead
- `GET /api/interactions/pending`: Get pending calls
- `GET /api/interactions/recent`: Get recent interactions
- `POST /api/interactions`: Add new interaction


## Snapshots of Project

### Landing page:
<img width="800" alt="image" src="https://github.com/user-attachments/assets/c70f3c24-ac93-4075-a4db-a6d22fd7aa47" />

### Dashboard:
<img width="800" alt="image" src="https://github.com/user-attachments/assets/6b951967-83e6-4fc3-bfd5-35448867e2c7" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/151fdda1-8886-441f-a36a-314113d86173" />

#### When we search for a particular Restaurant:
<img width="800" alt="image" src="https://github.com/user-attachments/assets/e60be2b5-917a-4989-9313-6450bb0028f6" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/f950dfe4-ccf9-4fe4-8841-5015d1cc048a" />

### Leads list, Contact tracking and Basic Interaction Logging:
<img width="800" alt="image" src="https://github.com/user-attachments/assets/ec58a407-4dad-4745-b3c8-a011065e5b7b" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/f01c4427-0898-463f-bd53-66c545dbb91d" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/20caafd9-cf07-44c0-bd05-7592cdc633b1" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/f2f774ac-a318-4b23-87f9-62061b9c60bb" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/4a963839-c0c8-4ae2-9de3-2024efb62478" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/e2afa5c0-5027-4738-a7b1-357f2fbf9bc9" />
<img width="800" alt="image" src="https://github.com/user-attachments/assets/cf66f161-658c-4bdb-b27d-5da2cfd48e0d" />


## Contact
For any inquiries, please contact [shatakshi1712@gmail.com](mailto:shatakshi1712@gmail.com).
