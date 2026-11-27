-- Product Store Database Schema

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 3. Products table
CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY fk_product_category (category_id),
    KEY idx_product_name (name),
    KEY idx_product_price (price),
    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 4. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY product_id (product_id),
    KEY fk_order_user (user_id),
    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT orders_ibfk_1
        FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;