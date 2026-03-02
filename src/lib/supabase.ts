import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://wmhyyzuywwfpktzijqxx.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQzM2QzNjhjLTMzNTgtNGIzMC05OGNiLTRiMmVjY2ZiMGJhOCJ9.eyJwcm9qZWN0SWQiOiJ3bWh5eXp1eXd3ZnBrdHppanF4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcxNDg4NjUzLCJleHAiOjIwODY4NDg2NTMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Q0zECryhYDTJOMBfdMoY5-6zddvIm3YAry9Xq3wyvhk';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };