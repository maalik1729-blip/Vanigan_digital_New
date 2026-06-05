import mysql from 'mysql2/promise';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'vanigan'
    });

    // Get all records without category
    const [records] = await conn.execute(
      'SELECT * FROM business_list WHERE category IS NULL OR category = "" ORDER BY id'
    );

    console.log('='.repeat(80));
    console.log(`ANALYZING ${records.length} RECORDS WITHOUT CATEGORY`);
    console.log('='.repeat(80));

    let testData = 0;
    let partialData = 0;
    let legitimateData = 0;

    const testRecords = [];
    const partialRecords = [];
    const legitimateRecords = [];

    records.forEach((record) => {
      const email = (record.email || '').toLowerCase();
      const businessName = record.businessName || '';
      const address = record.address || '';
      const hasValidEmail = email.includes('@') && email.includes('.') && email.length > 5;
      const hasRealContent = businessName.length > 3 || address.length > 10;
      
      // Test/Junk detection
      const isJunk = 
        /^[a-z]{10,}$/.test(email) || // repeated chars like 'kkkkkkkkkk'
        /^\d+$/.test(email) || // only numbers
        email.includes('test') ||
        email.includes('dummy') ||
        /^[a-z]{1,3}@/.test(email) || // very short like 's@gmail.com'
        /^[@.]/.test(email) || // starts with @ or .
        (!email && !businessName && !address && !record.contactNumber);

      if (isJunk) {
        testData++;
        testRecords.push({
          id: record.id,
          email: email || 'EMPTY',
          reason: 'Test/Junk data'
        });
      } else if (!hasValidEmail && hasRealContent) {
        partialData++;
        partialRecords.push({
          id: record.id,
          email: email || 'EMPTY',
          address: address.substring(0, 50),
          businessName: businessName,
          reason: 'Invalid email but has address'
        });
      } else if (hasValidEmail) {
        legitimateData++;
        legitimateRecords.push({
          id: record.id,
          email: email,
          address: address.substring(0, 50),
          businessName: businessName,
          contactNumber: record.contactNumber || 'N/A'
        });
      } else {
        partialData++;
        partialRecords.push({
          id: record.id,
          email: email || 'EMPTY',
          address: address.substring(0, 50),
          reason: 'Incomplete submission'
        });
      }
    });

    console.log('\n📊 SUMMARY:');
    console.log('-'.repeat(80));
    console.log(`Total Records: ${records.length}`);
    console.log(`Test/Junk Data: ${testData} (${((testData/records.length)*100).toFixed(1)}%)`);
    console.log(`Partial/Incomplete: ${partialData} (${((partialData/records.length)*100).toFixed(1)}%)`);
    console.log(`Legitimate Businesses: ${legitimateData} (${((legitimateData/records.length)*100).toFixed(1)}%)`);
    console.log('='.repeat(80));

    console.log('\n\n🗑️  TEST/JUNK DATA SAMPLES (first 20):');
    console.log('-'.repeat(80));
    testRecords.slice(0, 20).forEach((r, i) => {
      console.log(`${(i+1).toString().padStart(2)}. ID: ${r.id.toString().padStart(5)} | Email: ${r.email}`);
    });

    console.log('\n\n✅ LEGITIMATE BUSINESSES (ALL):');
    console.log('-'.repeat(80));
    legitimateRecords.forEach((r, i) => {
      console.log(`\n${(i+1).toString().padStart(2)}. ID: ${r.id}`);
      console.log(`    Email: ${r.email}`);
      console.log(`    Business: ${r.businessName || 'Not provided'}`);
      console.log(`    Contact: ${r.contactNumber}`);
      console.log(`    Address: ${r.address || 'Not provided'}`);
    });

    console.log('\n\n⚠️  PARTIAL/INCOMPLETE DATA (first 10):');
    console.log('-'.repeat(80));
    partialRecords.slice(0, 10).forEach((r, i) => {
      console.log(`${(i+1).toString().padStart(2)}. ID: ${r.id.toString().padStart(5)} | ${r.reason}`);
      console.log(`    Email: ${r.email} | Address: ${r.address || 'N/A'}`);
    });

    console.log('\n' + '='.repeat(80));

    await conn.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
