create table if not exists sessions
(
    session_id varchar(128) collate utf8mb4_bin not null
        primary key,
    expires    int unsigned                     not null,
    data       mediumtext collate utf8mb4_bin   null
);

create table if not exists user
(
    user_id         int auto_increment
        primary key,
    username        varchar(16)                              not null,
    email           varchar(255)                             not null,
    password        varchar(1024)                            not null,
    tel_number      varchar(20)                              null,
    address         varchar(100)                             null,
    agreed_personal tinyint(1)  default 0                    not null,
    created_at      datetime(6) default CURRENT_TIMESTAMP(6) null,
    constraint email
        unique (email),
    constraint username
        unique (username)
)
    charset = utf8mb4;

create table if not exists user_disease_info
(
    disease_id   int auto_increment
        primary key,
    user_id      int                                      not null,
    disease_name varchar(255)                             not null,
    created_at   datetime(6) default CURRENT_TIMESTAMP(6) null,
    constraint user_disease_info_ibfk_1
        foreign key (user_id) references user (user_id)
)
    charset = utf8mb4;

create index user_id
    on user_disease_info (user_id);

create table if not exists user_preference
(
    preference_id int auto_increment
        primary key,
    user_id       int                                      not null,
    company_name  varchar(255)                             not null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) null,
    constraint user_preference_ibfk_1
        foreign key (user_id) references user (user_id)
)
    charset = utf8mb4;

create index user_id
    on user_preference (user_id);

