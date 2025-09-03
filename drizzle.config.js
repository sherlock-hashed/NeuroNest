import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_etgrXc3qYQ5d@ep-purple-bird-a18l8l29-pooler.ap-southeast-1.aws.neon.tech/ai-learning-management-system?sslmode=require&channel_binding=require'
  }
});
