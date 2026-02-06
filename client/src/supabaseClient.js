import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par les tiennes (Trouvables dans Supabase > Settings > API)
const supabaseUrl = 'https://tqrboqwzioondywgtqtt.supabase.co'; // Ex: https://xyz.supabase.co
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcmJvcXd6aW9vbmR5d2d0cXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjY3NzksImV4cCI6MjA4NTA0Mjc3OX0.4WLcyhx-2fE2PNmh04HVPaK7Pi0d7SfA_1Qu3lWbaUQ'; // Ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

export const supabase = createClient(supabaseUrl, supabaseKey);