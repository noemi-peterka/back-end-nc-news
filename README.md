# NC News Seeding

Instructions:

1. Add a .env.development file that includes: PGDATABASE = nc_news
2. Add a .env.test file that includes: PGDATABASE = nc_news_test
3. Run npm install
4. To create both databases, run: npm run setup-dbs
   This will run the setup-dbs.sql file to create both a test and development database.

To connect to the test database use: npm run test-seed
And to connect to the development database use: npm run seed-dev
