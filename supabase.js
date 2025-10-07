import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmvgitmlfvvtiqirxdly.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdmdpdG1sZnZ2dGlxaXJ4ZGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzUzMzgsImV4cCI6MjA3Mjg1MTMzOH0.hrf7s4vdGNl1BTA1tkRN6TvHFzBgFeSYF-EH3QVKlhs'
export const supabase = createClient(supabaseUrl, supabaseKey)