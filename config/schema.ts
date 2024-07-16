import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";


export const forms = pgTable('forms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: timestamp('createdAt').notNull(),
})


export const schema = { forms };

