const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12706824',
  password: 'ixzYNs8YcP',
  database: 'YOUR_DATABASE_NAME', // Replace with your actual database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to add a new ticket to the database
exports.addTicket = async (ticketData) => {
  try {
    const connection = await pool.promise().getConnection();
    const [rows, fields] = await connection.execute(
      'INSERT INTO tickets (from_location, to_location, time, seats, ticket_class, wifi, food) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ticketData.from, ticketData.to, ticketData.time, ticketData.seats, ticketData.ticketClass, ticketData.wifi, ticketData.food]
    );
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
};

// Function to get all tickets from the database
exports.getTickets = async () => {
  try {
    const connection = await pool.promise().getConnection();
    const [rows, fields] = await connection.execute('SELECT * FROM tickets');
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
};
