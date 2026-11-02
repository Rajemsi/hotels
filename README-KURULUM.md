# Çınar Teknoloji – Otel Yönetim Platformu (MVP)

Bu paket; çoklu otel, otel başvurusu, süper admin onayı, otel yöneticisi ve misafir NFC sayfası için başlangıç altyapısıdır.

## Dosyalar
- `index.html`: Misafirlerin NFC ile açtığı otel sayfası. `?id=OTEL_UUID` ile otel seçilir.
- `login.html`: Yönetici girişi.
- `register.html`: Otel başvuru formu. Başvuru onaylanana kadar panel açılmaz.
- `admin.html`: Süper admin ve otel admin paneli.
- `supabase/schema.sql`: Tablolar, güvenlik politikaları ve Storage bucket.
- `supabase/functions/admin-invite-user/`: Süper adminin panelden otel oluşturup otel yöneticisini davet etmesi için Edge Function.

## 1) Supabase projesi
1. https://supabase.com adresinde proje oluştur.
2. Project Settings → API bölümünden Project URL ve anon/public key değerlerini al.
3. `config.js` dosyasındaki `SUPABASE_URL` ve `SUPABASE_ANON_KEY` alanlarını doldur.
4. Supabase → SQL Editor → New query ekranında `supabase/schema.sql` dosyasının tamamını çalıştır.

## 2) İlk süper admin hesabı
1. Supabase → Authentication → Users bölümünden kendi e-posta adresinle bir kullanıcı oluştur.
2. Kullanıcının UUID değerini kopyala.
3. SQL Editor'de şu sorguyu kendi UUID'nle çalıştır:

   `insert into public.profiles (id, full_name, role, approval_status) values ('KULLANICI-UUID', 'Çınar Teknoloji', 'super_admin', 'approved') on conflict (id) do update set role='super_admin', approval_status='approved';`

Bu işlem yalnızca ilk kurulum içindir. Süper admin rolünü herkese açık kayıt formundan vermek mümkün değildir.

## 3) Edge Function kurulumu (süper admin davetleri)
Supabase CLI ile proje klasörünü bağlayıp fonksiyonu deploy et:
- `supabase login`
- `supabase link --project-ref PROJE_REF`
- `supabase functions deploy admin-invite-user`

Fonksiyon için Supabase Dashboard → Edge Functions → Secrets bölümünde `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` tanımlı olmalı. Service role key asla HTML/JavaScript dosyalarına konulmaz.

## 4) GitHub Pages'e yükleme
Bu klasördeki HTML ve JS dosyalarını repository'nin kök dizinine yükle. `supabase` klasörü de kurulum dosyaları olarak repoda tutulabilir; SQL ve function secret içermez. GitHub Pages'te Settings → Pages → Deploy from a branch → main → /(root) → Save.

## 5) Akış
- Otel sahibi `register.html` üzerinden başvuru yapar.
- Başvuru `pending` olarak kaydedilir; henüz otel sayfasını yönetemez.
- Süper admin `admin.html` üzerinden başvuruyu onaylar, otel kaydını oluşturur ve otel yöneticisi için davet bağlantısı üretir.
- Süper admin ayrıca panelden doğrudan otel + yönetici daveti oluşturabilir.
- Otel admini yalnızca kendisine atanmış oteli düzenler.
- NFC bağlantısı: `https://KULLANICI.github.io/REPOSITORY/index.html?id=OTEL_UUID`

## Güvenlik notları
- RLS politikaları tenant izolasyonunu sağlar.
- Tarayıcıya yalnızca anon/public key konur; bu anahtar RLS ile sınırlandırılır.
- Service role key hiçbir zaman GitHub'a veya istemci koduna eklenmez.
- Gerçek kullanıma açmadan önce e-posta doğrulamasını, güçlü şifre politikasını ve yedeklemeyi etkinleştir.
