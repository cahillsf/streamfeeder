CREATE DATABASE streamfeeder

CREATE TABLE user(
    UserID INT NOT NULL,
    Password VARCHAR(25) NOT NULL,
    Fname VARCHAR(25) NOT NULL,
    Lname VARCHAR(25) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PRIMARY KEY(UserID)
);

CREATE TABLE socialmediaplatforms(
    PlatformID INT,
    UserID INT,
    Name VARCHAR(25),
    Scope VARCHAR(200),
    PRIMARY KEY(PlatformID),
    FOREIGN KEY (UserID)
        REFERENCES user(UserID)
);

CREATE TABLE settings(
    SettingsID INT,
    UserID INT,
    PremiumStatus BIT,
    Permissions BIT,
    Notifications BIT,
    PRIMARY KEY(SettingsID),
    FOREIGN KEY (UserID)
        REFERENCES user(UserID)
);

CREATE TABLE paymentinfo(
    CardID INT,
    UserID INT,
    csv INT,
    exp VARCHAR(5),
    CardNumber INT,
    Address VARCHAR(100),
    PRIMARY KEY(CardID),
    FOREIGN KEY (UserID)
        REFERENCES user(UserID)
);
