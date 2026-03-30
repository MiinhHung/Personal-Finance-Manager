-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PersonalFinanceDB')
BEGIN
    CREATE DATABASE PersonalFinanceDB;
END
GO

USE PersonalFinanceDB;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
    );
END

-- Create Categories table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Categories (
        CategoryId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL, -- NULL for system categories
        Name NVARCHAR(100) NOT NULL,
        Type TINYINT NOT NULL, -- 1: Income, 2: Expense
        IsSystem BIT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
    );
END

-- Create Transactions table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Transactions]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Transactions (
        TransactionId BIGINT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        CategoryId INT NULL,
        Type TINYINT NOT NULL, -- 1: Income, 2: Expense
        Amount DECIMAL(18, 2) NOT NULL,
        Description NVARCHAR(255) NULL,
        TransactionDate DATE NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
        FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(CategoryId)
    );
END

-- Seed System Categories if not exist
IF NOT EXISTS (SELECT * FROM dbo.Categories WHERE IsSystem = 1)
BEGIN
    INSERT INTO dbo.Categories (UserId, Name, Type, IsSystem) VALUES
    (NULL, N'Tiền lương', 1, 1),
    (NULL, N'Thưởng', 1, 1),
    (NULL, N'Ăn uống', 2, 1),
    (NULL, N'Di chuyển', 2, 1),
    (NULL, N'Mua sắm', 2, 1),
    (NULL, N'Giải trí', 2, 1),
    (NULL, N'Sức khỏe', 2, 1),
    (NULL, N'Giáo dục', 2, 1);
END
