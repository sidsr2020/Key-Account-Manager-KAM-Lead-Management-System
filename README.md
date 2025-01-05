# Lead Management System for Udaan's B2B Platform (Siddhant Sarkar)
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
For any inquiries, please contact [sidsr2020@gmail.com](mailto:sidsr2020@gmail.com).
