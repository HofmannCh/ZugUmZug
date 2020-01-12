drop database if exists `zuz_dev`;

create database `zuz_dev` character set utf8mb4 collate utf8mb4_unicode_ci;
use `zuz_dev`;

create table `Events` (
    `Id` int auto_increment primary key,
    `Date` date not null,
    `LocationName` varchar(20) not null,
    `Description` text null,
    `Lat` float not null,
    `Lng` float not null
);

create table `Users` (
    `Id` int primary key auto_increment,
    `UserName` varchar(20) not null,
    `PasswordHash` varchar(64) not null, -- theoretical utf8 not required
    `Roles` int unsigned not null -- Roles flag
);

create table `Groups` (
    `Id` int primary key auto_increment,
    `Name` varchar(20) not null,
    `Uuid` text not null,
    `Description` text null,
    `Users` text not null,
    `BasisUserId` int not null, -- Person in base
    `EventId` int not null,
    constraint `fk_Groups_BasisUserId` foreign key (`BasisUserId`) references `Users`(Id),
    constraint `fk_Groups_EventId` foreign key (`EventId`) references `Events`(Id)
);

create table `Challanges` (
    `Id` int primary key auto_increment,
    `Name` varchar(20) not null,
    `Description` text not null,
    `Points` int not null,
    `EventId` int not null,
    constraint `fk_Challanges_EventId` foreign key (`EventId`) references `Events`(Id)
);

create table `ChallangesSolved` (
    `Id` int primary key auto_increment,
    `Valid` bit not null,
    `GroupId` int not null,
    `ChallangeId` int not null,
    `UserId` int null, -- Person who signed up the challange
    constraint `fk_ChallangesSolved_GroupId` foreign key (`GroupId`) references `Groups`(Id),
    constraint `fk_ChallangesSolved_ChallangeId` foreign key (`ChallangeId`) references `Challanges`(Id),
    constraint `fk_ChallangesSolved_UserId` foreign key (`UserId`) references `Users`(Id)
);

create table `Locations` (
    `Id` int primary key auto_increment,
    `DateTime` DateTime not null,
    `Lat` float not null,
    `Lng` float not null,
    `GroupId` int not null,
    constraint `fk_Locations_GroupId` foreign key (`GroupId`) references `Groups`(Id)
);

create table `ManualPoints` (
    `Id` int primary key auto_increment,
    `Points` int not null,
    `Reason` text not null,
    `GroupId` int not null,
    constraint `fk_ManualPoints_GroupId` foreign key (`GroupId`) references `Groups`(Id)
);

create table `TrainStations` (
    `Id` int primary key auto_increment,
    `DateTime` datetime not null,
    `Image` varbinary(45) null, -- todo and not null
    `Valid` bit not null,
    `GroupId` int not null,
    `UserId` int null, -- Person who signed up the challange
    constraint `fk_TrainStations_GroupId` foreign key (`GroupId`) references `Groups`(Id),
    constraint `fk_TrainStations_UserId` foreign key (`UserId`) references `Users`(Id)
);

create table `Jokers` (
    `Id` int primary key auto_increment,
    `Name` varchar(20) not null,
    `Description` text not null,
    `From` DateTime null,
    `Till` DateTime not null,
    `Lat` float not null,
    `Lng` float not null,
    `MinPoints` int not null,
    `MaxPoints` int not null,
    `UserId` int null, 
    `EventId` int not null,
    constraint `fk_Jokers_UserId` foreign key (`UserId`) references `Users`(Id),
    constraint `fk_Jokers_EventId` foreign key (`EventId`) references `Events`(Id)
);

create table `JokersSolved` (
    `Id` int primary key auto_increment,
    `Points` int not null,
    `GroupId` int not null,
    `JokerId` int not null,
    constraint `fk_JokersSolved_GroupId` foreign key (`GroupId`) references `Groups`(Id),
    constraint `fk_JokersSolved_JokerId` foreign key (`JokerId`) references `Jokers`(Id)
);