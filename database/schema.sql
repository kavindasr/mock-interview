DROP DATABASE IF EXISTS `MockInterview`;
CREATE DATABASE `MockInterview`;
USE `MockInterview`;

CREATE TABLE `Company` (
  `companyID` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(50),
  `email` varchar(40) NOT NULL UNIQUE,
  `contactNo` varchar(10),
  `logo` varchar(200),
  PRIMARY KEY (`companyID`)
);

CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100),
  `email` varchar(40) NOT NULL UNIQUE,
  `contactNo` varchar(10),
  `role` varchar(20),
  `password` varchar(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `Panel` (
  `panelID` int NOT NULL AUTO_INCREMENT,
  `userID` int,
  `companyID` int,
  `link` varchar(200),
  `needHelp` Boolean,
  PRIMARY KEY (`panelID`),
  FOREIGN KEY (`userID`) REFERENCES `User`(`id`),
  FOREIGN KEY (`companyID`) REFERENCES `Company`(`companyID`) ON DELETE CASCADE
);

CREATE TABLE `VolunteerPanel` (
  `volunteerID` int,
  `panelID` int,
  PRIMARY KEY (`panelID`),
  KEY `PK, FK` (`volunteerID`),
  FOREIGN KEY (`volunteerID`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`panelID`) REFERENCES `Panel`(`panelID`) ON DELETE CASCADE
);


CREATE TABLE `Interviewee` (
  `intervieweeID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100),
  `email` varchar(50) NOT NULL UNIQUE,
  `contactNo` varchar(10),
  `dept` varchar(50),
  `cv` varchar(200),
  `availability` BOOLEAN,
  `intervieweeImg` varchar(255),
  PRIMARY KEY (`intervieweeID`)
);

CREATE TABLE `Interview` (
  `interviewID` int NOT NULL AUTO_INCREMENT,
  `panelID` int,
  `intervieweeID` int,
  `state` varchar(20),
  `date` date,
  `time` time,
  `feedback` varchar(20),
  PRIMARY KEY (`interviewID`),
  FOREIGN KEY (`panelID`) REFERENCES `Panel`(`panelID`) ON DELETE CASCADE,
  FOREIGN KEY (`intervieweeID`) REFERENCES `Interviewee`(`intervieweeID`) ON DELETE CASCADE 
);

create view FeedbackDetails as select email, interviewID, companyName from interview left join interviewee on interview.intervieweeID = interviewee.intervieweeID left join panel on panel.panelID = interview.panelID left join company on panel.companyID = company.companyID;
