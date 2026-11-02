window.getSupabase = function(){
 const c=window.APP_CONFIG||{};
 if(!c.SUPABASE_URL||c.SUPABASE_URL.includes('BURAYA')||!c.SUPABASE_ANON_KEY||c.SUPABASE_ANON_KEY.includes('BURAYA')){
  alert('Önce config.js dosyasına Supabase Project URL ve anon key ekleyin.');
  throw new Error('Supabase config missing');
 }
 return window.supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY);
};
