use `zuz_dev`;

delete from `JokersSolved`;
delete from `Jokers`;
delete from `TrainStations`;
delete from `ManualPoints`;
delete from `Locations`;
delete from `ChallengesSolved`;
delete from `Challenges`;
delete from `Groups`;
delete from `Users`;
delete from `Events`;

insert into `Events` 
values
(1, '2019-11-14', 'Langenthal', 'Ein super Event 1', 47.21652, 7.78354),
(2, '2020-11-15', 'Bern', 'Ein super Event 2', 46.94821, 7.43353),
(3, '2021-11-16', 'Zürich', 'Ein super Event 3', 47.38085, 8.53004);

insert into `Users` values -- Pw: 123456 (Hash)
(1, 'Basis1',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000001', 1),
(2, 'Basis2',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000001', 1),
(3, 'Basis3',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000001', 1),
(4, 'Basis4',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000001', 1),
(5, 'Joker1',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000010', 1),
(6, 'Joker2',       '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000010', 1),
(7, 'SuperUser',    '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000000100', 1),
(8, 'SuperAdmin',   '8dfa7619e2665dd61352fb9d619ce990678d52b0839d1d0c81f97a8664e843f1', b'00000000000000000000000000001000', null);

insert into `Groups` values
(1, 'GroupName1', 'cb8d9076-4406-423c-8dc5-7a23bbc3508d', 'aaa', '[{name: "Tom11"},{name: "Tom12"},{name: Tom13}]', 1, 1),
(2, 'GroupName2', 'cc49f4db-f4ba-4451-90d2-7a64b5621286', 'bbb', '[{name: "Tom21"}]', 1, 1 ),
(3, 'GroupName3', 'a83f4d80-116d-4c6a-8167-061430fa2380', null,  '[{name: "Tom31"},{name: "Tom32"},{name: Tom33},{name: Tom34}]', 2, 1 ),
(4, 'GroupName4', '3ee0574e-832f-454f-8f7e-9286e9acfef3', null,  '[{name: "Tom41"},{name: "Tom42"}]', 2, 1 ),
(5, 'GroupName5', 'ea782d02-cacb-45b3-b0c9-35df756c5681', null,  '[{name: "Tom51"},{name: "Tom52"}]', 2, 1 ),
(6, 'GroupName6', '0132ad2c-02de-4486-bec0-21735aed2ac1', 'fff', '[]', 3, 1 ),
(7, 'GroupName7', 'c1e87b78-f9d6-4e34-8357-11c8b89bbbcb', null,  '[{name: "Tom61"},{name: "Tom62"}]', 4, 2 ),
(8, 'GroupName8', '7ddf7086-8f6a-490d-9065-6058b8cc33d7', null,  '[{name: "Tom71"},{name: "Tom72"}]', 4, 2 );

insert into `Challenges` values
(1, 'Challenge1', 'Description 1', 100, 1),
(2, 'Challenge2', 'Description 2', 200, 1),
(3, 'Challenge3', 'Description 3', 300, 1),
(4, 'Challenge4', 'Description 4', 400, 1),
(5, 'Challenge5', 'Description 5', 500, 2),
(6, 'Challenge6', 'Description 6', 600, 2);

insert into `ChallengesSolved` values
(1, 1, 1, 1, 1),
(2, 1, 1, 3, 2),
(3, 0, 2, 3, null),
(4, 0, 2, 3, 2),
(5, 1, 7, 5, 4),
(6, 0, 7, 6, 4);

insert into `Locations` values
( 1, '2019-11-14 07:01:00', 46.95535, 7.41991, 1),
( 2, '2019-11-14 08:02:22', 46.99988, 7.46065, 1),
( 3, '2019-11-14 09:00:10', 47.04481, 7.53963, 1),
( 4, '2019-11-14 10:10:22', 47.05730, 7.62257, 1),
( 5, '2019-11-14 11:00:00', 47.21839, 7.78551, 1),
( 6, '2019-11-14 12:01:20', 47.32094, 7.90787, 1),
( 7, '2019-11-14 07:11:27', 46.75505, 7.62809, 2),
( 8, '2019-11-14 08:08:59', 46.68707, 7.66772, 2),
( 9, '2019-11-14 09:01:20', 46.68740, 7.86511, 2),
(10, '2019-11-14 09:55:50', 46.75862, 8.03191, 2),
(11, '2019-11-14 11:01:20', 47.05095, 8.28685, 2),
(12, '2019-11-14 12:10:23', 47.19535, 8.52504, 2);

insert into `ManualPoints` values
(1, 100, 'WeilGeil 100', 1),
(2, 200, 'WeilGeil 200', 1),
(3, 300, 'WeilGeil 300', 2);

insert into `TrainStations` values
(1, '2019-11-14 10:01:02', "https://via.placeholder.com/720x480?text=720x480%201", "TestNotes", 1, 1, 1),
(2, '2019-11-14 11:01:02', "https://via.placeholder.com/720x480?text=720x480%202", null, 0, 1, null),
(3, '2019-11-14 12:01:02', "https://via.placeholder.com/720x480?text=720x480%203", null, 1, 2, 1);

insert into `Jokers` values
(1, 'Jokes1', 'Jokes 1 Rules ...', '2019-11-14 12:00:00', '2019-11-14 13:00:00', 47.32094, 7.90787, 0, 1000  ,  5, 1),
(2, 'Jokes2', 'Jokes 2 Rules ...', '2019-11-14 12:00:00', '2019-11-14 13:00:00', 46.75505, 7.62809, 100, 800 ,  6, 1),
(3, 'Jokes3', 'Jokes 3 Rules ...', '2019-11-14 14:00:00', '2019-11-14 15:00:00', 46.68707, 7.66772, 100, 1400,  6, 1);

insert into `JokersSolved` values
(1,  400, 2, 1),
(2,  200, 2, 2),
(3, 1000, 1, 3);
