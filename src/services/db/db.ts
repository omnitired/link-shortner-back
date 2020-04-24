import { config as readEnv } from 'dotenv';
const p = `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`;
readEnv({path: p});

const { Pool } = require('pg');
import * as fs from 'fs';
import * as path from 'path';

class db {
  private pool;
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
    });
    console.log('running make views');
    this.runMakeViews();

  }

  private async runMakeViews () {
    let query = fs.readFileSync(path.join(__dirname, '../../migrations/views/makeViews.sql'), 'utf-8');
    await this.runQuery(query);
  }

  public async runQuery (query, params?) {
    let client : any = null;
  
    try {
        client = await this.pool.connect();
        
        return await client.query(query, params);
  
    } catch (err){
      throw err;
    } finally{
        if (client !== null && client.release) client.release();
    }
  }
}

export default new db();
