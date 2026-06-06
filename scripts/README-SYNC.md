# Business Data Sync Guide

## Overview
This guide will help you sync all 18,428 business records from the remote API to your local MySQL database **without any data loss**.

## Prerequisites
- MySQL server running on localhost:3306
- Database named `vanigan` created
- Node.js installed

## Step-by-Step Instructions

### Step 1: Create the Database Table

First, ensure your `business_list` table exists with the correct schema:

```bash
# Connect to MySQL and create the table
mysql -u root -p vanigan < scripts/create-business-table.sql
```

Or manually run:
```bash
mysql -u root -p
USE vanigan;
SOURCE scripts/create-business-table.sql;
EXIT;
```

### Step 2: Verify Table Creation

```bash
node scripts/verify-sync.js
```

This will show:
- Current local database count
- Remote API total count
- Sample records comparison

### Step 3: Run the Sync

#### Option A: Incremental Sync (Recommended for existing data)
This will:
- Insert new records that don't exist locally
- Update existing records with fresh data from API
- **No data loss** - preserves all existing records

```bash
node scripts/sync-businesses-safe.js
```

#### Option B: Full Sync (Clean slate)
This will:
- **Clear all existing data**
- Download all 18,428 records fresh
- Use only if you want a complete refresh

```bash
node scripts/sync-businesses-safe.js --full
```

⚠️ **Warning**: Full sync will delete all existing data! Make sure you have a backup first.

### Step 4: Verify the Sync

After syncing, verify the data:

```bash
node scripts/verify-sync.js
```

Expected output:
```
📊 Total Records Comparison:
- Remote (Render API):  18,428
- Local (business_list): 18,428
✅ Perfect sync!
```

## Troubleshooting

### MySQL Connection Issues
If you get connection errors, check your `.env` file and update DB credentials in the script:

```javascript
const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "your_password_here",  // Update this
  database: "vanigan",
};
```

### Duplicate Key Errors
The safe sync script handles duplicates automatically by:
- Checking if `_id` exists before inserting
- Updating existing records instead of creating duplicates
- Handling unique constraint violations gracefully

### Incomplete Sync
If the sync stops or gets interrupted:
1. Check your internet connection
2. Verify the remote API is accessible: https://vanigan-app-automation-5il0.onrender.com
3. Run the incremental sync again - it will resume from where it left off

### Slow Sync
The script processes 100 records per page. For 18,428 records:
- Approximately 185 pages to fetch
- Estimated time: 5-10 minutes depending on connection speed
- Progress is shown in real-time

## Database Backup

Before running a full sync, always backup your data:

```bash
# Create backup
mysqldump -u root -p vanigan business_list > backup_business_list_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup (if needed)
mysql -u root -p vanigan < backup_business_list_YYYYMMDD_HHMMSS.sql
```

## Features of the Safe Sync Script

✅ **No Data Loss**
- Incremental sync preserves existing data
- Updates records instead of creating duplicates
- Handles API failures gracefully

✅ **Progress Tracking**
- Real-time progress percentage
- Statistics on new/updated/error records
- Final comparison with remote API

✅ **Error Handling**
- Continues on individual record errors
- Logs detailed error messages
- Shows summary of all issues at the end

✅ **Data Integrity**
- Validates data before insertion
- Handles null/empty values safely
- Maintains referential integrity

## Support

If you encounter any issues:
1. Check the error messages in the console
2. Verify your MySQL connection
3. Ensure the remote API is accessible
4. Review the database schema matches the API data structure
