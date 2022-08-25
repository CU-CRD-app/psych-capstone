CREATE TABLE users 
(
        userid SERIAL, 
        username TEXT, 
        email TEXT, 
        hashedpassword TEXT, 
        race TEXT, 
        nationality TEXT, 
        gender TEXT, 
        age INT, 
        security_question TEXT, 
        security_question_answer TEXT
        PRIMARY KEY(userid)
);
        
CREATE TABLE day 
(
        userid INT, 
        level INT, 
        race TEXT, 
        date TEXT, 
        nameface INT,
        whosnew INT, 
        memory INT, 
        shuffle INT, 
        forcedchoice INT, 
        samedifferent INT
)
CREATE TABLE preassessment 
(
        userid INT, 
        score INT, 
        race TEXT, 
        date TEXT
)
        
CREATE TABLE postassessment 
(
        userid INT, 
        score INT, 
        race TEXT, 
        date TEXT
);

CREATE TABLE achievements 
(
        userid INT, 
        achievement_title TEXT,
        achievement_description TEXT NOT NULL,
        PRIMARY KEY(achievement_title, userid)
)