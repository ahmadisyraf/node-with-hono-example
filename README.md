
# Mari Beli - Backend

This project is the backend server for a **Mari Beli** application. It provides APIs to manage users, products, orders, and other core functionalities, enabling seamless communication between the frontend and the database.
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

You can view database schema at `/src/model/schema.prisma`.

Run the following commands to generate the Prisma client and apply the database schema:  

```bash  
npx prisma generate  
```  

```bash  
npx prisma db push  
```  

### 5. Create an S3 Bucket in LocalStack  

To create an S3 bucket, go to LocalStack Cloud `https://app.localstack.cloud` and `log in`. Navigate to the `LocalStack Instances` section, open the `Resource Browser`, and select `S3`. Use the interface to create a new bucket name `mybucket` 

You also can use container terminal to create s3 bucket by using aws cli

```bash
# Check if there is any s3 bucket has been created
aws --endpoint-url=http://localhost:4566 s3 ls

# Create s3 bucket named mybucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://mybucket
```

### 6. Start the Development Server  

Once everything is set up, start the server:  

```bash  
npm run dev  
```  

Now your backend server should be up and running, including the configured S3 bucket, and you can start using the API endpoints.  

---  
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

All off them follow environment in ``docker-compose.yml`` 
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

REDIS_URL="redis://localhost:6380"

STRIPE_SECRET_KEY="<Generate your own stripe secret key>"

AWS_DEFAULT_REGION="us-west-2"
AWS_ACCESS_KEY_ID="test"
AWS_SECRET_ACCESS_KEY="test"
AWS_BUCKET="mybucket"
AWS_ENDPOINT="http://localhost:4566"
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

