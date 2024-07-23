import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";


export const forms = pgTable('forms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: timestamp('createdAt').notNull(),
})

export const responses = pgTable('responses', {
    id: serial('id').primaryKey(),
    formId: integer('formId').references(() => forms.id).notNull(), // FK to forms.id
    response: text('response').notNull(),
    respondedAt: timestamp('respondedAt').notNull().defaultNow(),
})



export const schema = { forms, responses };

