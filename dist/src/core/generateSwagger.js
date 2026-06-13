"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("./swagger");
console.log('Compiling Swagger documentation specs from JSDoc comments...');
// Build specs using options
const specs = (0, swagger_jsdoc_1.default)(swagger_1.options);
const outputPath = path_1.default.resolve(__dirname, './swagger-spec.json');
// Write spec to JSON file
fs_1.default.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf-8');
console.log(`Successfully generated Swagger spec to: ${outputPath}`);
