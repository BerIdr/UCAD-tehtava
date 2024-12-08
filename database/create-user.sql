-- User creation example, replace name and password with your own
-- real credentials are stored in a "secure" location (.env file)
CREATE USER 'media'@'localhost' IDENTIFIED BY '1235';
GRANT ALL PRIVILEGES ON `MediaSharingApp`.* TO 'media'@'localhost';
FLUSH PRIVILEGES;

