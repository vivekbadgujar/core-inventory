#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting CoreInventory Development Environment...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logError = (message) => {
  console.error(`[Backend Error] ${message}`);
};

const logFrontend = (message) => {
  console.log(`[Frontend] ${message}`);
};

// Start backend
log('📦 Starting Backend Server...', 'cyan');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`[Backend] ${data.toString()}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`[Backend Error] ${colors.red(data.toString())}`);
});

// Start frontend
log('🌐 Starting Frontend Server...', 'magenta');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'pipe',
  shell: true
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`[Frontend] ${data.toString()}`);
});

frontend.stderr.on('data', (data) => {
  logError(data.toString());
});

// Handle process termination
const cleanup = () => {
  log('\n🛑 Stopping servers...', 'yellow');
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Check if both started successfully
let backendStarted = false;
let frontendStarted = false;

backend.stdout.on('data', (data) => {
  if (data.toString().includes('Server running on port')) {
    backendStarted = true;
    log('✅ Backend started successfully!', 'green');
    checkBothStarted();
  }
});

frontend.stdout.on('data', (data) => {
  if (data.toString().includes('ready in')) {
    frontendStarted = true;
    log('✅ Frontend started successfully!', 'green');
    checkBothStarted();
  }
});

function checkBothStarted() {
  if (backendStarted && frontendStarted) {
    log('\n🎉 Both servers are running!', 'green');
    log('📱 Frontend: http://localhost:5173', 'blue');
    log('🔧 Backend:  http://localhost:5001/api', 'blue');
    log('\n💡 Press Ctrl+C to stop both servers', 'yellow');
  }
}

// Handle errors
backend.on('error', (error) => {
  log(`❌ Backend failed to start: ${error.message}`, 'red');
  process.exit(1);
});

frontend.on('error', (error) => {
  log(`❌ Frontend failed to start: ${error.message}`, 'red');
  process.exit(1);
});
