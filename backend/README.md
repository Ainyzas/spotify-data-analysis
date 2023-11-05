# spotify-data-analysis Instructions Of Use

### Step 1
Clone Repository and run npm i. download spotify datasets and move them into the assets folder
https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks?select=artists.csv;
https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks?select=tracks.csv.

### Step 2
Create a .env file in the folder and fill in this information:
AWS_ACCESS_KEY_ID=your IAM user access key
AWS_SECRET_ACCESS_KEY=your IAM user secret access key
BUCKET_NAME=name of your s3 bucket
DB_ENDPOINT=your db endpoint
DB_NAME=your db name
DB_USER=your db master username
DB_PASSWORD=your db master password

### Step 3
Run npm start, the script for dataIngest will run and process the datasets and upload them to the s3 bucket.

### Step 4
Run npm run transfer, the script for dataTransfer will run and slowly upload dataset entries into the database.

### Step 5
Use the provided SQL Scripts on a SQL client of your choosing.
