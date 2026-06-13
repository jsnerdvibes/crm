import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from './swagger';

console.log('Compiling Swagger documentation specs from JSDoc comments...');

// Build specs using options
const specs = swaggerJsdoc(options);

const outputPath = path.resolve(__dirname, './swagger-spec.json');

// Write spec to JSON file
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf-8');

console.log(`Successfully generated Swagger spec to: ${outputPath}`);
