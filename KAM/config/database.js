const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'lead_management'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// SQL queries to create tables
const createTables = async () => {
  try {
    // Leads table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        restaurant_name VARCHAR(255) NOT NULL,
        address TEXT,
        contact_number VARCHAR(20),
        status ENUM('New', 'Active', 'Inactive') DEFAULT 'New',
        assigned_kam VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        lead_id INT,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        phone_number VARCHAR(20),
        email VARCHAR(255),
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
      )
    `);

    // Interactions table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        lead_id INT,
        interaction_date DATE NOT NULL,
        interaction_type ENUM('Call', 'Visit', 'Order') NOT NULL,
        notes TEXT,
        follow_up_required BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
        INDEX idx_interaction_date (interaction_date),
        INDEX idx_created_at (created_at)
      )
    `);
    
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();

module.exports = connection;