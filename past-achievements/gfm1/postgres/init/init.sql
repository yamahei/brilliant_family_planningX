-- SET client_encoding = 'UTF8';
-- CREATE DATABASE lifeplan;
-- \c lifeplan

--
-- user authenticates
--
CREATE TABLE authenticates(
    id BIGSERIAL PRIMARY KEY,
    mailaddress TEXT UNIQUE NOT NULL,
    authcode TEXT UNIQUE NOT NULL CHECK(authcode::TEXT ~ '^[0-9]{8}$'::TEXT), -- NULL is authenticated
    retry INTEGER NOT NULL DEFAULT 0, -- retry count
    expiry TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- authcode expiry
    lock TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- send lock
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    mailaddress TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- token expiry
    -- plan,
    -- lock,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--
-- bank accounts
--
CREATE TABLE accounts(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_namae TEXT NOT NULL,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE balances(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    month TEXT NOT NULL CHECK(month::TEXT ~ '^[0-9]{4}-[0-9]{2}$'::TEXT),
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--
-- plan trees
--
CREATE TABLE sections(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_namae TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entities(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id BIGINT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    entity_namae TEXT NOT NULL,
    entity_from TEXT CHECK(entity_from::TEXT ~ '^[0-9]{4}-[0-9]{2}$'::TEXT),
    entity_to TEXT CHECK(entity_to::TEXT ~ '^[0-9]{4}-[0-9]{2}$'::TEXT),
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE events(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_id BIGINT NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    event_namae TEXT NOT NULL,
    event_from TEXT CHECK(event_from::TEXT ~ '^[0-9]{4}-[0-9]{2}$'::TEXT),
    event_to TEXT CHECK(event_to::TEXT ~ '^[0-9]{4}-[0-9]{2}$'::TEXT),
    budget DECIMAL NOT NULL DEFAULT 0,
    account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE expressions;
CREATE TABLE expressions(
    id BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    proctype TEXT NOT NULL CHECK(proctype::TEXT IN('single', 'every', 'detail')),
    "not" BOOLEAN NOT NULL DEFAULT FALSE,
    month TEXT CHECK(-- for single, "YYYY-MM"
        (proctype::TEXT = 'single' AND month::TEXT ~ '^[0-9]{4}-[0-9]{1,2}$'::TEXT)
        OR (proctype::TEXT != 'single' AND month::TEXT IS NULL)
    ),
    months TEXT CHECK(-- for every & detail, "MM,MM,..."
        (proctype::TEXT IN ('every', 'detail') AND months::TEXT ~ '^[0-9]{1,2}(,[0-9]{1,2}){0,11}$'::TEXT)
        OR (proctype::TEXT = 'single' AND months::TEXT IS NULL)
    ),
    year INTEGER CHECK(-- for detail, "YYYY"
        (proctype::TEXT = 'detail' AND year IS NOT NULL)
        OR (proctype::TEXT != 'detail' AND year IS NULL)
    ),
    step INTEGER CHECK(-- for detail, >=0
        (proctype::TEXT = 'detail' AND step IS NOT NULL AND step >= 0)
        OR (proctype::TEXT != 'detail' AND step IS NULL)
    ),
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);



--
-- preset variables
--
CREATE TABLE presets(
    id BIGSERIAL PRIMARY KEY,
    preset_key TEXT UNIQUE NOT NULL,
    preset_namae TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variables(
    id BIGSERIAL PRIMARY KEY,
    preset_id BIGINT NOT NULL REFERENCES presets(id) ON DELETE CASCADE,
    variable_key TEXT UNIQUE NOT NULL,
    variable_namae TEXT NOT NULL,
    datatype TEXT NOT NULL CHECK(datatype::TEXT IN('Boolean', 'Date', 'Integer')),
    required BOOLEAN NOT NULL,
    "default" TEXT NOT NULL, -- json stringified string
    depends TEXT REFERENCES variables(variable_key),
    sort INTEGER NOT NULL DEFAULT 0,
    --
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ** test data for tree **
INSERT INTO users(mailaddress)VALUES('a@b.com');
INSERT INTO sections(user_id, section_namae, sort) VALUES (1, '🧑大人（社会人）', 1);
INSERT INTO sections(user_id, section_namae, sort) VALUES (1, '🧒子ども（学生まで）', 2);
INSERT INTO sections(user_id, section_namae, sort) VALUES (1, '🚙車両', 3);
INSERT INTO sections(user_id, section_namae, sort) VALUES (1, '🏠家屋・生活費', 4);
INSERT INTO entities(user_id, section_id, entity_namae)VALUES(1, 1, 'entity001');
INSERT INTO entities(user_id, section_id, entity_namae, entity_from, entity_to)VALUES(1, 1, 'entity002', '2000-01', '2100-12');
INSERT INTO events(user_id, entity_id, event_namae)VALUES(1, 1, 'event011');
INSERT INTO expressions(user_id, event_id, proctype) VALUES(1, 1, 'single');


-- ** selections **
-- SELECT * FROM authenticates;
-- SELECT * FROM users;
-- SELECT * FROM accounts;
-- SELECT * FROM balances;
-- SELECT * FROM sections;
-- SELECT * FROM entities;
-- SELECT * FROM events;
-- SELECT * FROM expressions;
-- SELECT * FROM presets;
-- SELECT * FROM variables;


-- ** test for check **
-- single::valid
-- INSERT INTO expressions(user_id, event_id, proctype, month) VALUES (1,1, 'single', '2023-01');
-- single::invalid
-- INSERT INTO expressions(user_id, event_id, proctype, month) VALUES (1,1, 'single', '01');
-- INSERT INTO expressions(user_id, event_id, proctype, month) VALUES (1,1, 'single', '01,12');
-- INSERT INTO expressions(user_id, event_id, proctype, month) VALUES (1,1, 'every', '2023-01');
-- INSERT INTO expressions(user_id, event_id, proctype, month) VALUES (1,1, 'detail', '2023-01');
-- every::valid
-- INSERT INTO expressions(user_id, event_id, proctype, months) VALUES (1,1, 'every', '01');
-- INSERT INTO expressions(user_id, event_id, proctype, months) VALUES (1,1, 'every', '01,02,03,04,05,06,07,08,09,10,11,12');
-- every::invalid
-- INSERT INTO expressions(user_id, event_id, proctype, months) VALUES (1,1, 'every', '2023-01');
-- INSERT INTO expressions(user_id, event_id, proctype, months) VALUES (1,1, 'single', '01');
-- detail::valid
-- INSERT INTO expressions(user_id, event_id, proctype, year, months, step) VALUES (1,1, 'detail', 1999, '01', 1);
-- INSERT INTO expressions(user_id, event_id, proctype, year, months, step) VALUES (1,1, 'detail', 1999, '01,12', 1);
-- detail::invalid
-- INSERT INTO expressions(user_id, event_id, proctype, year, months, step) VALUES (1,1, 'detail', 1999, '1999-01', 1);
-- INSERT INTO expressions(user_id, event_id, proctype, year, months, step) VALUES (1,1, 'single', 1999, '1999-01', 1);
-- INSERT INTO expressions(user_id, event_id, proctype, year, months, step) VALUES (1,1, 'every', 1999, '1999-01', 1);
