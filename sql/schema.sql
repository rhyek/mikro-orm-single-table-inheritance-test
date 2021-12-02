create table person (
  id int not null auto_increment primary key,
  type varchar(100) not null
);

create table task (
  id int not null auto_increment primary key,
  person_id int null,
  constraint fk_1
    foreign key (person_id)
    references person (id)
    on delete set null
    on update cascade
);
