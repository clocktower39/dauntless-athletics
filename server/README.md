Dauntless Athletics Survey API

Setup
1) Install dependencies
   - cd server
   - npm install

2) Configure env
   - Copy server/.env.example to server/.env
   - Fill in DATABASE_URL, JWT_SECRET, ADMIN/OWNER credentials, and SURVEY_BASE_URL

3) Create tables
   - psql "$DATABASE_URL" -f sql/schema.sql

4) Run locally
   - npm run dev

Password hash helper (bcrypt)
- node -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash('YourPassword', 12));"

NGINX proxy (example)
- location /api/ {
    proxy_pass http://127.0.0.1:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

Survey workflow
- Create schools in the admin dashboard or via POST /api/admin/schools.
- Generate invite links via POST /api/admin/invites.
- Send each link to a coach. Each link can be used once.
