// Database switch utility
// Use this to switch between mock and MySQL databases

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbConfigPath = path.join(__dirname, 'db.js');
const mockDbConfigPath = path.join(__dirname, 'db-mock.js');
const backupDbConfigPath = path.join(__dirname, 'db-backup.js');

export const switchToMock = () => {
  console.log('🔄 Switching to Mock Database...');
  
  // Backup current config
  if (fs.existsSync(dbConfigPath)) {
    fs.copyFileSync(dbConfigPath, backupDbConfigPath);
  }
  
  // Copy mock config
  const mockConfig = `// Database connection - using mock for development
import { query, transaction, testConnection } from './db-mock.js';

export { query, transaction, testConnection };
`;
  
  fs.writeFileSync(dbConfigPath, mockConfig);
  console.log('✅ Switched to Mock Database');
  console.log('💡 Restart the server with: npm start');
};

export const switchToMySQL = () => {
  console.log('🔄 Switching to MySQL Database...');
  
  // Check if MySQL config backup exists
  if (fs.existsSync(backupDbConfigPath)) {
    fs.copyFileSync(backupDbConfigPath, dbConfigPath);
    console.log('✅ Switched to MySQL Database');
    console.log('💡 Make sure MySQL is running and restart the server');
  } else {
    console.log('❌ MySQL backup config not found');
    console.log('💡 Please run npm run init-db first');
  }
};

export const getCurrentDatabase = () => {
  const dbConfig = fs.readFileSync(dbConfigPath, 'utf8');
  if (dbConfig.includes('db-mock.js')) {
    return 'mock';
  } else {
    return 'mysql';
  }
};

// CLI usage
if (process.argv[2]) {
  const command = process.argv[2];
  
  switch (command) {
    case 'mock':
      switchToMock();
      break;
    case 'mysql':
      switchToMySQL();
      break;
    case 'status':
      console.log(`Current database: ${getCurrentDatabase()}`);
      break;
    default:
      console.log('Usage: node database-switch.js [mock|mysql|status]');
  }
}
