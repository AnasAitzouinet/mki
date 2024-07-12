import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});
export type LoginSchemas = z.infer<typeof LoginSchema>;


export const NewAccountSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
})

export type NewAccountSchemas = z.infer<typeof NewAccountSchema>;


export const CsvFileSchema = z.object({
  file: z.string().url(),
})

const CsvFileItemSchema = z.object({
  creationDate: z.string(),
  email: z.string().email(),
  full_name: z.string(),
  phone: z.string(),
});

// Define the schema for the array of objects
export const CsvFileImportSchema = z.array(CsvFileItemSchema);