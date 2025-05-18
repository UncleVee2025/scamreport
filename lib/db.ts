import mysql from "mysql2/promise"
import { format } from "date-fns"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? {} : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Export the pool as db (this was missing)
export const db = pool

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Update the initDatabase function to ensure all necessary tables exist
export async function initDatabase() {
  try {
    const connection = await pool.getConnection()

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        verified BOOLEAN DEFAULT false,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create scam_reports table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS scam_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(100) NOT NULL,
        date_occurred DATE,
        location VARCHAR(255),
        perpetrator_info TEXT,
        amount_lost DECIMAL(10,2),
        status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
        allow_comments BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    // Create comments table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        status ENUM('approved', 'pending', 'flagged', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES scam_reports(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create comment_likes table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create comment_flags table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comment_flags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_flag (comment_id, user_id),
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create notifications table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        related_id INT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create me_too table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS me_too (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_me_too (report_id, user_id),
        FOREIGN KEY (report_id) REFERENCES scam_reports(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create advertisements table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        sponsor_name VARCHAR(255) NOT NULL,
        cta_text VARCHAR(100) NOT NULL,
        cta_link VARCHAR(255) NOT NULL,
        discount VARCHAR(50),
        discount_description VARCHAR(255),
        image_url VARCHAR(255),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        package_duration ENUM('3months', '6months', '9months', '12months') NOT NULL,
        advertiser_email VARCHAR(255) NOT NULL,
        reminder_sent_30days BOOLEAN DEFAULT FALSE,
        reminder_sent_15days BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create a test user if none exists
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users")
    if (users[0].count === 0) {
      await connection.execute(`
        INSERT INTO users (email, password, full_name, role, verified)
        VALUES ('admin@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Admin User', 'admin', true),
               ('user@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Regular User', 'user', true)
      `)
    }

    // Create a test scam report if none exists
    const [reports] = await connection.execute("SELECT COUNT(*) as count FROM scam_reports")
    if (reports[0].count === 0) {
      await connection.execute(`
        INSERT INTO scam_reports (user_id, title, description, type, date_occurred, location, status, allow_comments)
        VALUES (2, 'Test Scam Report', 'This is a test scam report for testing comments', 'phishing', '2023-01-01', 'Online', 'verified', true)
      `)
    }

    connection.release()
    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

// Advertisement functions
export async function createAdvertisement(adData) {
  try {
    // Calculate end date based on package duration
    const startDate = new Date(adData.startDate || new Date())
    const endDate = new Date(startDate)

    switch (adData.packageDuration) {
      case "3months":
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case "6months":
        endDate.setMonth(endDate.getMonth() + 6)
        break
      case "9months":
        endDate.setMonth(endDate.getMonth() + 9)
        break
      case "12months":
        endDate.setMonth(endDate.getMonth() + 12)
        break
      default:
        endDate.setMonth(endDate.getMonth() + 3) // Default to 3 months
    }

    const [result] = await pool.execute(
      `INSERT INTO advertisements 
      (title, description, sponsor_name, cta_text, cta_link, discount, discount_description, 
       image_url, start_date, end_date, package_duration, advertiser_email, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adData.title,
        adData.description,
        adData.sponsorName,
        adData.ctaText,
        adData.ctaLink,
        adData.discount || null,
        adData.discountDescription || null,
        adData.imageUrl || null,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd"),
        adData.packageDuration,
        adData.advertiserEmail,
        adData.isActive,
      ],
    )
    return result
  } catch (error) {
    console.error("Error creating advertisement:", error)
    throw error
  }
}

export async function getActiveAdvertisements() {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM advertisements 
       WHERE is_active = true 
       AND start_date <= CURDATE() 
       AND end_date >= CURDATE()
       ORDER BY RAND()
       LIMIT 1`,
    )
    return rows
  } catch (error) {
    console.error("Error getting active advertisements:", error)
    throw error
  }
}

export async function getAllAdvertisements() {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM advertisements 
       ORDER BY created_at DESC`,
    )
    return rows
  } catch (error) {
    console.error("Error getting all advertisements:", error)
    throw error
  }
}

export async function getAdvertisementById(id) {
  try {
    const [rows] = await pool.execute(`SELECT * FROM advertisements WHERE id = ?`, [id])
    return rows[0]
  } catch (error) {
    console.error("Error getting advertisement by ID:", error)
    throw error
  }
}

export async function updateAdvertisement(id, adData) {
  try {
    // If package duration is changed, recalculate end date
    let endDate

    if (adData.recalculateEndDate) {
      const startDate = new Date(adData.startDate)
      endDate = new Date(startDate)

      switch (adData.packageDuration) {
        case "3months":
          endDate.setMonth(endDate.getMonth() + 3)
          break
        case "6months":
          endDate.setMonth(endDate.getMonth() + 6)
          break
        case "9months":
          endDate.setMonth(endDate.getMonth() + 9)
          break
        case "12months":
          endDate.setMonth(endDate.getMonth() + 12)
          break
      }
    } else {
      endDate = new Date(adData.endDate)
    }

    const [result] = await pool.execute(
      `UPDATE advertisements 
       SET title = ?, description = ?, sponsor_name = ?, cta_text = ?, cta_link = ?, 
           discount = ?, discount_description = ?, image_url = ?, 
           start_date = ?, end_date = ?, package_duration = ?, advertiser_email = ?, is_active = ?
       WHERE id = ?`,
      [
        adData.title,
        adData.description,
        adData.sponsorName,
        adData.ctaText,
        adData.ctaLink,
        adData.discount || null,
        adData.discountDescription || null,
        adData.imageUrl || null,
        adData.startDate,
        format(endDate, "yyyy-MM-dd"),
        adData.packageDuration,
        adData.advertiserEmail,
        adData.isActive,
        id,
      ],
    )
    return result
  } catch (error) {
    console.error("Error updating advertisement:", error)
    throw error
  }
}

export async function deleteAdvertisement(id) {
  try {
    const [result] = await pool.execute(`DELETE FROM advertisements WHERE id = ?`, [id])
    return result
  } catch (error) {
    console.error("Error deleting advertisement:", error)
    throw error
  }
}

// Add function to check for expiring advertisements
export async function checkExpiringAdvertisements() {
  try {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const fifteenDaysFromNow = new Date(today)
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15)

    // Get ads expiring in 30 days that haven't had reminders sent
    const [thirtyDayReminders] = await pool.execute(
      `SELECT * FROM advertisements 
       WHERE end_date = ? 
       AND reminder_sent_30days = FALSE 
       AND is_active = TRUE`,
      [format(thirtyDaysFromNow, "yyyy-MM-dd")],
    )

    // Get ads expiring in 15 days that haven't had reminders sent
    const [fifteenDayReminders] = await pool.execute(
      `SELECT * FROM advertisements 
       WHERE end_date = ? 
       AND reminder_sent_15days = FALSE 
       AND is_active = TRUE`,
      [format(fifteenDaysFromNow, "yyyy-MM-dd")],
    )

    return {
      thirtyDayReminders,
      fifteenDayReminders,
    }
  } catch (error) {
    console.error("Error checking expiring advertisements:", error)
    throw error
  }
}

// Add function to mark reminders as sent
export async function markReminderSent(id, reminderType) {
  try {
    if (reminderType === "30days") {
      await pool.execute(`UPDATE advertisements SET reminder_sent_30days = TRUE WHERE id = ?`, [id])
    } else if (reminderType === "15days") {
      await pool.execute(`UPDATE advertisements SET reminder_sent_15days = TRUE WHERE id = ?`, [id])
    }
  } catch (error) {
    console.error(`Error marking ${reminderType} reminder as sent:`, error)
    throw error
  }
}

// Add function to automatically deactivate expired advertisements
export async function deactivateExpiredAdvertisements() {
  try {
    const today = format(new Date(), "yyyy-MM-dd")

    const [result] = await pool.execute(
      `UPDATE advertisements 
       SET is_active = FALSE 
       WHERE end_date < ? 
       AND is_active = TRUE`,
      [today],
    )

    return result
  } catch (error) {
    console.error("Error deactivating expired advertisements:", error)
    throw error
  }
}

// Export the pool for use in other modules
export { pool }
