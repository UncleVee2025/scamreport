-- Create the database (uncomment if you need to create the database)
-- CREATE DATABASE IF NOT EXISTS futuristic_app;
-- USE futuristic_app;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS comment_flags;
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS me_too;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS advertisements;
DROP TABLE IF EXISTS scam_reports;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
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
);

-- Create scam_reports table
CREATE TABLE scam_reports (
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
);

-- Create comments table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  status ENUM('approved', 'pending', 'flagged', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES scam_reports(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create comment_likes table
CREATE TABLE comment_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create comment_flags table
CREATE TABLE comment_flags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_flag (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  related_id INT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create me_too table
CREATE TABLE me_too (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_me_too (report_id, user_id),
  FOREIGN KEY (report_id) REFERENCES scam_reports(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create advertisements table
CREATE TABLE advertisements (
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
);

-- Insert sample data

-- Insert users (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, password, full_name, role, verified) VALUES
('admin@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Admin User', 'admin', true),
('user@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Regular User', 'user', true),
('john.doe@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'John Doe', 'user', true),
('jane.smith@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Jane Smith', 'user', true),
('support@example.com', '$2b$10$XdR0Z9XfMQO.QCjD4nk5W.j.PJT5ZZZyXJBRD1QNl4D5XUATfcQSe', 'Support Team', 'admin', true);

-- Insert scam reports
INSERT INTO scam_reports (user_id, title, description, type, date_occurred, location, status, allow_comments, is_verified) VALUES
(2, 'Phishing Email Scam', 'I received an email claiming to be from my bank asking for my login details. The email looked legitimate but the URL was suspicious.', 'phishing', '2023-04-15', 'Online', 'verified', true, true),
(3, 'Fake Online Store', 'I ordered products from an online store that never delivered. They had great reviews which I now believe were fake.', 'online_shopping', '2023-05-20', 'Online', 'verified', true, true),
(4, 'Phone Call Scam', 'Someone called claiming to be from the IRS saying I owed taxes and needed to pay immediately with gift cards.', 'phone', '2023-06-10', 'Phone', 'verified', true, true),
(2, 'Social Media Investment Scam', 'Someone on Instagram promised 300% returns on cryptocurrency investments. I lost $500.', 'investment', '2023-07-05', 'Social Media', 'pending', true, false),
(3, 'Tech Support Scam', 'A popup appeared on my computer saying it was infected and I needed to call a number for support. They wanted remote access to my computer.', 'tech_support', '2023-08-12', 'Computer', 'verified', true, true);

-- Insert comments
INSERT INTO comments (report_id, user_id, comment, status) VALUES
(1, 3, 'I got the same email! Thanks for reporting it.', 'approved'),
(1, 4, 'Always check the URL before clicking. You can hover over links to see where they really go.', 'approved'),
(2, 2, 'Did you try contacting your credit card company for a chargeback?', 'approved'),
(3, 3, 'The IRS will never call and ask for immediate payment, especially not with gift cards. Good job recognizing the scam!', 'approved'),
(3, 4, 'I got a similar call last month. These scammers are getting more aggressive.', 'approved'),
(4, 2, 'Sorry to hear about your loss. Did you report this to Instagram?', 'pending'),
(5, 3, 'These tech support scams are everywhere. Never call the number or give remote access!', 'approved');

-- Insert me_too records
INSERT INTO me_too (report_id, user_id) VALUES
(1, 3),
(1, 4),
(2, 4),
(3, 2),
(5, 2),
(5, 4);

-- Insert comment likes
INSERT INTO comment_likes (comment_id, user_id) VALUES
(1, 2),
(1, 4),
(2, 3),
(3, 4),
(4, 2),
(5, 3);

-- Insert notifications
INSERT INTO notifications (user_id, type, message, related_id, is_read) VALUES
(2, 'comment', 'Someone commented on your scam report', 1, false),
(2, 'me_too', 'Someone else experienced the same scam you reported', 1, true),
(3, 'comment_like', 'Someone liked your comment', 1, false),
(4, 'report_status', 'Your scam report has been verified', 3, true),
(3, 'comment', 'Someone replied to your comment', 2, false);

-- Insert advertisements
INSERT INTO advertisements (title, description, sponsor_name, cta_text, cta_link, discount, discount_description, image_url, start_date, end_date, package_duration, advertiser_email, is_active) VALUES
('Protect Your Identity Online', 'Get premium identity protection with real-time alerts and $1M insurance coverage.', 'IdentityShield', 'Start Free Trial', 'https://example.com/identity-shield', '30% OFF', 'First 3 months at 30% off for new users', '/ads/identity-shield.jpg', '2023-01-01', '2023-12-31', '12months', 'marketing@identityshield.com', true),
('Secure Password Manager', 'Never forget a password again. Store unlimited passwords with military-grade encryption.', 'PassGuard', 'Try PassGuard Free', 'https://example.com/passguard', '50% OFF', 'Half price annual subscription', '/ads/passguard.jpg', '2023-03-15', '2023-09-15', '6months', 'sales@passguard.com', true),
('Cybersecurity Training', 'Learn how to protect yourself online with our comprehensive cybersecurity course.', 'CyberEdu', 'Enroll Now', 'https://example.com/cyberedu', '20% OFF', 'Special discount for scam awareness month', '/ads/cyberedu.jpg', '2023-05-01', '2023-07-31', '3months', 'courses@cyberedu.com', true);

-- Add some comment flags for moderation
INSERT INTO comment_flags (comment_id, user_id, reason) VALUES
(6, 3, 'This comment contains misleading information'),
(7, 2, 'This comment might be spam');