# AI Usage


## Tasks AI Assisted With

### 1. Understanding Django's SQL Injection Protections

Before adding sanitization, I used AI to determine whether Django's ORM automatically uses prepared statements. Copilot confirmed that Django automatically separates SQL templates from parameters and uses parameterized queries to prevent SQL injection through the ORM. I checked this against offifical django documentation at "https://docs.djangoproject.com/en/6.0/topics/security/"


### 2. Database Indexing - (`api/models.py`)

I made the decision to use two indexes based on my own experiences through the CS348 lectures and homework. I wanted a direct lookup for usernames and a B tree index for getting posts made by a specific user. I used AI to help check my assumptions on if these would be effective before implementing the indexes in mySQL. I verified it's output and statements against how course materials described indexes. I ensured I understood how these indexes work in mySQL at "https://dev.mysql.com/doc/refman/9.7/en/index-btree-hash.html"


When running the raw "CREATE INDEX" SQL in MySQL Workbench, I got error 1046 (no database selected) and asked Copilot, which helped me remember to prepend "USE cs348project;".

### 3. Transaction Management & Concurrency - `api/views.py`, `config/settings.py`

I had a design discussion with Copilot about concurrency. I initially proposed using Read Uncommitted for reads (to avoid locks for reading posts) and locks for writes. I used AI to test my asusmptions on how this might work. Copilot said that Django uses read committed by default. I verified this at Django documentation at "https://docs.djangoproject.com/en/6.0/ref/databases/#:~:text=Like%20PostgreSQL%20itself%2C%20Django%20defaults,SERIALIZABLE%2C%20%7D%2C%20%7D". In this documentation, I saw MySQL defaults to repeatable read. This helped me understand that I needed to modify settings.py to modify the isolation level of mySQL. I used AI to help confirm my beliefs of what read committed vs read uncommitted isolation levels would do to my application. 


### 4. SQL Error Debugging

When running `python manage.py migrate` after adding indexes, the migration failed. I used Copilot to help diagnose the error output.

### 5. Frontend Components

I used AI to help generate basic frontend components such as the text box on the login/signup screen and formatting the posts when they appear on the user feed. I reviewed the code it generated and verified correctness 

## Notes on Responsible Use

All AI-generated explanations were verified against official Djang and MySQL documentation, alongside course material. No AI output or explanations were accepted without review. 
