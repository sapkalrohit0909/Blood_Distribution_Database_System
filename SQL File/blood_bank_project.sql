drop database if exists blood_bank_project;
create database blood_bank_project;
use blood_bank_project;


create table blood_bank
	(bank_code int NOT NULL AUTO_INCREMENT,
	 bank_name		varchar(20),
	 bank_address		varchar(50),
	 primary key (bank_code)
	);

create table blood_bank_storage
	(bank_code		int, 
	 blood_group	varchar(20), 
	 quantity  int check (quantity >= 0),
	 primary key (bank_code,blood_group),
	 foreign key (bank_code) references blood_bank(bank_code)
		on delete cascade
	);

create table blood_inventory
	(inventory_id	int NOT NULL AUTO_INCREMENT, 
	 location		varchar(50), 
	 isNearBy		int,
	 bank_code		int,
	 primary key (inventory_id),
	 foreign key (bank_code) references blood_bank(bank_code)
		on delete set null
	);

create table blood_inventory_storage
	(inventory_id		int, 
	 blood_group	varchar(20), 
	 quantity  int check (quantity >= 0),
	 primary key (inventory_id,blood_group),
	 foreign key (inventory_id) references blood_inventory(inventory_id)
		on delete cascade
	);

create table inventory_staff
	(staff_id		int NOT NULL AUTO_INCREMENT, 
	 staff_name			varchar(20) not null, 
	 designation		varchar(50), 
	 manager_id			int,
	 inventory_id		int,
	 primary key (staff_id),
	 foreign key (manager_id) references inventory_staff(staff_id)
		on delete set null,
	foreign key (inventory_id) references blood_inventory(inventory_id)
		on delete set null
	);


create table receiver
	(receiver_id	int NOT NULL AUTO_INCREMENT, 
     receiver_name			varchar(20),
	 receiver_address        varchar(50),
     blood_group 			varchar(20),
	 age            int,
	 sex            varchar(20),
	 primary key (receiver_id)
	);

create table emergency_contact
	(receiver_id    int, 
	 number		varchar(20),
	 primary key (receiver_id,number),
	 foreign key (receiver_id) references receiver(receiver_id)
		on delete cascade
	);

create table history_table
	(receiver_id	int, 
	 bank_code		int,
	 blood_group    varchar(20), 
	 quantity      int,
	 date    Date,
     primary key (receiver_id,bank_code,date),
     foreign key (receiver_id) references receiver(receiver_id)
		on delete cascade,
	foreign key (bank_code) references blood_bank(bank_code)
		on delete cascade
	);
    

create table donar(
	donar_id	 int NOT NULL AUTO_INCREMENT,
    email     varchar(20),
    donar_address   varchar(50),
    donar_name      varchar(20),
    blood_group varchar(20),
	primary key (donar_id)
	);

create table donation_camp(
	camp_id		int NOT NULL AUTO_INCREMENT,
	camp_name varchar(50),
    date Date,
    primary key (camp_id)
	);

create table donates_to_camp(
	 donar_id		int, 
	 camp_id		int,
     quantity       int,
	 primary key (donar_id,camp_id),
	 foreign key (donar_id) references donar(donar_id)
		on delete cascade,
	 foreign key (camp_id) references donation_camp(camp_id)
		on delete cascade
	);

create table donates_to_bank(
	 donar_id		int, 
	 bank_code		int,
     quantity       int,
     date    Date,
	 primary key (donar_id,bank_code,date),
	 foreign key (donar_id) references donar(donar_id)
		on delete cascade,
	 foreign key (bank_code) references blood_bank(bank_code)
		on delete cascade
	);
    
create table camp_collection(
	 camp_id		int, 
	 blood_group	varchar(20),
     quantity       int,
     isTransfered   bool,
	 primary key (camp_id,blood_group),
	 foreign key (camp_id) references donation_camp(camp_id)
		on delete cascade
	);


create table conducts(
	 bank_code		int, 
	 camp_id	    int,
	 inventory_id   int,
	 primary key (bank_code,camp_id,inventory_id),
	 foreign key (camp_id) references donation_camp(camp_id)
		on delete cascade,
	 foreign key (bank_code) references blood_bank(bank_code)
		on delete cascade,
	 foreign key (inventory_id) references blood_inventory(inventory_id)
		on delete cascade
	);

delete from blood_bank;
delete from blood_bank_storage;
delete from blood_inventory;
delete from blood_inventory_storage;
delete from inventory_staff;
delete from receiver;
delete from emergency_contact;
delete from history_table;
delete from donar;
delete from donation_camp;
delete from donates_to_camp;
delete from donates_to_bank;
delete from camp_collection;
delete from conducts;


insert into blood_bank (bank_name,bank_address)values ("Red Cross","San Jose");
 
insert into blood_bank_storage values (1, 'A+', 200);
insert into blood_bank_storage values (1, 'A-', 200);
insert into blood_bank_storage values (1, 'B+', 200);
insert into blood_bank_storage values (1, 'B-', 200);
insert into blood_bank_storage values (1, 'AB+', 200);
insert into blood_bank_storage values (1, 'AB-', 200);
insert into blood_bank_storage values (1, 'O+', 200);
insert into blood_bank_storage values (1, 'O-', 200);

insert into blood_inventory (location,isNearBy,bank_code)values ("San Jose",1,1);
insert into blood_inventory (location,isNearBy,bank_code)values ("San Francisco",2,1);
insert into blood_inventory (location,isNearBy,bank_code)values ("San Diego",3,1);
insert into blood_inventory (location,isNearBy,bank_code)values ("Los Angeles",4,1);

insert into blood_inventory_storage values (1, 'A+', 200);
insert into blood_inventory_storage values (1, 'A-', 200);
insert into blood_inventory_storage values (1, 'B+', 200);
insert into blood_inventory_storage values (1, 'B-', 200);
insert into blood_inventory_storage values (1, 'AB+', 200);
insert into blood_inventory_storage values (1, 'AB-', 200);
insert into blood_inventory_storage values (1, 'O+', 200);
insert into blood_inventory_storage values (1, 'O-', 200);

insert into blood_inventory_storage values (2, 'A+', 200);
insert into blood_inventory_storage values (2, 'A-', 200);
insert into blood_inventory_storage values (2, 'B+', 200);
insert into blood_inventory_storage values (2, 'B-', 200);
insert into blood_inventory_storage values (2, 'AB+', 200);
insert into blood_inventory_storage values (2, 'AB-', 200);
insert into blood_inventory_storage values (2, 'O+', 200);
insert into blood_inventory_storage values (2, 'O-', 200);

insert into blood_inventory_storage values (3, 'A+', 200);
insert into blood_inventory_storage values (3, 'A-', 200);
insert into blood_inventory_storage values (3, 'B+', 200);
insert into blood_inventory_storage values (3, 'B-', 200);
insert into blood_inventory_storage values (3, 'AB+', 200);
insert into blood_inventory_storage values (3, 'AB-', 200);
insert into blood_inventory_storage values (3, 'O+', 200);
insert into blood_inventory_storage values (3, 'O-', 200);

insert into blood_inventory_storage values (4, 'A+', 200);
insert into blood_inventory_storage values (4, 'A-', 200);
insert into blood_inventory_storage values (4, 'B+', 200);
insert into blood_inventory_storage values (4, 'B-', 200);
insert into blood_inventory_storage values (4, 'AB+', 200);
insert into blood_inventory_storage values (4, 'AB-', 200);
insert into blood_inventory_storage values (4, 'O+', 200);
insert into blood_inventory_storage values (4, 'O-', 200);

insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Harry", 'M', NULL,1);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("David", 'E', 1,1);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Brian", 'E', 1,1);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Andy", 'E', 1,1);


insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Anne", 'M', NULL,2);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Joe", 'E', 5,2);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Ros", 'E', 5,2);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Michel", 'E',5,2);

insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Jenny", 'M', NULL,3);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Jerry", 'E', 9,3);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Cersi", 'E', 9,3);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Kiara", 'E', 9,3);

insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Elizabeth", 'M', NULL,4);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Jack", 'E', 13,4);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Kathrine", 'E', 13,4);
insert into inventory_staff (staff_name,designation,manager_id,inventory_id)values ("Karina", 'E', 13,4);

insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Rohit","Pune",'O+',20,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Sagar","Mumbai",'O+',25,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Atul","Pune",'A+',30,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Bhaskar","Mumbai",'A+',31,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Hrishikesh","Mumbai",'A-',22,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Pranav","Pune",'A-',25,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Vinit","Mumbai",'AB+',22,"Male");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Tosha","Mumbai",'AB-',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Aditi","Pune",'B+',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Shravani","Pune",'B-',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Ankita","Pune",'O+',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Mitwa","Ahmedabad",'AB+',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Sneha","Gulbarga",'AB-',22,"Female");
insert into receiver(receiver_name,receiver_address,blood_group,age,sex)values("Sayali","Pune",'O-',22,"Female");


insert into emergency_contact values(1,"4081293434");
insert into emergency_contact values(1,"4081293435");
insert into emergency_contact values(2,"4081293436");
insert into emergency_contact values(2,"4081293437");
insert into emergency_contact values(3,"4081293438");
insert into emergency_contact values(3,"4081293439");
insert into emergency_contact values(4,"4081293430");
insert into emergency_contact values(4,"4081293431");
insert into emergency_contact values(5,"4081293432");
insert into emergency_contact values(5,"4081293433");
insert into emergency_contact values(6,"4181293434");
insert into emergency_contact values(6,"4181293435");
insert into emergency_contact values(7,"4181293436");
insert into emergency_contact values(7,"4181293437");
insert into emergency_contact values(8,"4181293438");
insert into emergency_contact values(8,"4181293439");
insert into emergency_contact values(9,"4181293430");
insert into emergency_contact values(9,"4181293431");
insert into emergency_contact values(10,"4181293432");
insert into emergency_contact values(10,"4181293433");
insert into emergency_contact values(11,"4281293433");
insert into emergency_contact values(11,"4281293432");
insert into emergency_contact values(12,"4281293431");
insert into emergency_contact values(12,"4281293430");
insert into emergency_contact values(13,"4281293439");
insert into emergency_contact values(13,"4281293438");
insert into emergency_contact values(14,"4281293437");
insert into emergency_contact values(14,"4281293436");


insert into history_table values(1,1,'O+',2,"2016-12-10");
insert into history_table values(2,1,'O+',4,"2017-10-11");
insert into history_table values(3,1,'A+',3,"2018-09-15");
insert into history_table values(4,1,'A+',5,"2017-08-22");
insert into history_table values(5,1,'A-',1,"2017-09-12");
insert into history_table values(6,1,'A-',3,"2019-01-02");
insert into history_table values(7,1,'AB+',5,"2015-08-14");
insert into history_table values(8,1,'AB-',6,"2016-09-26");
insert into history_table values(9,1,"B+",3,"2018-02-12");
insert into history_table values(10,1,"B-",2,"2017-01-23");
insert into history_table values(11,1,"O+",1,"2016-07-19");
insert into history_table values(12,1,"AB+",3,"2014-02-20");
insert into history_table values(13,1,"AB-",4,"2017-07-09");
insert into history_table values(14,1,"O-",1,"2019-02-02");


insert into donar(donar_name,email,donar_address,blood_group)values('Mike','mike@gmail.com','San Jose','O+');
insert into donar(donar_name,email,donar_address,blood_group)values('Lucas','lucas@gmail.com','Sunnyvale','AB+');
insert into donar(donar_name,email,donar_address,blood_group)values('Frank','frank@gmail.com','San Francisco','O-');
insert into donar(donar_name,email,donar_address,blood_group)values('Anne','anne@gmail.com','San Jose','B+');
insert into donar(donar_name,email,donar_address,blood_group)values('David','david@gmail.com','Los Angeles','A-');
insert into donar(donar_name,email,donar_address,blood_group)values('Harry','harry@gmail.com','Fullerton','AB+');
insert into donar(donar_name,email,donar_address,blood_group)values('Joe','joe@gmail.com','Long Beach','AB-');
insert into donar(donar_name,email,donar_address,blood_group)values('Andy','andy@gmail.com','San francisco','O+');
insert into donar(donar_name,email,donar_address,blood_group)values('Cersi','cersi@gmail.com','San Jose','A-');
insert into donar(donar_name,email,donar_address,blood_group)values('Mellisa','mellisa@gmail.com','San Diego','AB+');
    

insert into donates_to_bank values(1,1,2,'2017-10-02');
insert into donates_to_bank values(2,1,1,'2018-02-12');
insert into donates_to_bank values(3,1,2,'2019-02-02');
insert into donates_to_bank values(4,1,3,'2017-09-09');
insert into donates_to_bank values(5,1,2,'2018-02-03');


insert into donation_camp (camp_name,date)values('Summer Donation Camp','2017-06-08');
insert into donation_camp (camp_name,date)values('New Year Donation Camp','2018-01-02');
insert into donation_camp (camp_name,date)values('Spring Donation Camp','2018-02-03');

insert into conducts values(1,1,1);
insert into conducts values(1,2,3);
insert into conducts values(1,3,4);

insert into donates_to_camp values(6,1,2);
insert into donates_to_camp values(7,1,1);
insert into donates_to_camp values(8,2,2);
insert into donates_to_camp values(9,2,3);
insert into donates_to_camp values(10,3,2);


insert into camp_collection values(1,'A+',35,false);
insert into camp_collection values(1,'A-',20,false);
insert into camp_collection values(1,'B+',21,false);
insert into camp_collection values(1,'B-',32,false);
insert into camp_collection values(1,'O+',40,false);
insert into camp_collection values(1,'O-',25,false);
insert into camp_collection values(1,'AB+',42,false);
insert into camp_collection values(1,'AB-',34,false);


insert into camp_collection values(2,'A+',41,false);
insert into camp_collection values(2,'A-',10,false);
insert into camp_collection values(2,'B+',24,false);
insert into camp_collection values(2,'B-',20,false);
insert into camp_collection values(2,'O+',28,false);
insert into camp_collection values(2,'O-',29,false);
insert into camp_collection values(2,'AB+',46,false);
insert into camp_collection values(2,'AB-',28,false);

insert into camp_collection values(3,'A+',21,false);
insert into camp_collection values(3,'A-',28,false);
insert into camp_collection values(3,'B+',45,false);
insert into camp_collection values(3,'B-',34,false);
insert into camp_collection values(3,'O+',27,false);
insert into camp_collection values(3,'O-',26,false);
insert into camp_collection values(3,'AB+',20,false);
insert into camp_collection values(3,'AB-',15,false);

