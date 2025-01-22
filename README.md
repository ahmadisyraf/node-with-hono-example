## Get Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ahmadisyraf/node-with-hono-example
cd node-with-hono-example
```

### 2. Install Required Dependencies

```bash
npm install
```

### 3. Start Additional Service Containers

Ensure that **Postgres**, **Redis**, **PgAdmin**, and **LocalStack** are running. You can spin them up using Docker:

```bash
docker compose up -d
```

### 4. Generate and Push Prisma Schema

Run the following commands to generate the Prisma client and apply the database schema:

```bash
npx prisma generate
```

```bash
npx prisma db push
```

### 5. Create an S3 Bucket in LocalStack

To create an S3 bucket, go to LocalStack Cloud `https://app.localstack.cloud` and `log in`. Navigate to the `LocalStack Instances` section, open the `Resource Browser`, and select `S3`. Use the interface to create a new bucket name `mybucket`

### 6. Start the Development Server

Once everything is set up, start the server:

```bash
npm run dev
```

Now your backend server should be up and running, including the configured S3 bucket, and you can start using the API endpoints.

---
