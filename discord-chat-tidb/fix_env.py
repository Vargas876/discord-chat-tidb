import os

db_url = 'mysql://2LdZoyWhLHQfZn9.root:pwUvye9Q9S7pZQGQ@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict'
with open('backend/.env', 'w', encoding='utf-8') as f:
    f.write(f'DATABASE_URL={db_url}\n')
    f.write('WS_PORT=3002\n')
    f.write('PORT=3001\n')
    f.write('NODE_ENV=development\n')
