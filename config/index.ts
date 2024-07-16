import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from './schema';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL_CONFIG) {
  throw new Error('DATABASE_URL_CONFIG is not defined in environment variables');
}



const sql = neon(process.env.DATABASE_URL_CONFIG!);
export const db = drizzle(sql, { schema });

