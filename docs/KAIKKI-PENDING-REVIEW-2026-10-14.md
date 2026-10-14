# Kaikki: 606 kaydın kaynak kabulü ve sınırlı tanı incelemesi

Yeni kaynak indirilmedi. İşlem, mevcut 2026-10-03 Kaikki çıkarımı / 2026-09-02 Wiktionary dump'ının 2026-10-14 indirilmiş dosyasına dayanır. Eski 2026-09-24 verisi ayrı kalır. İlk mevcut entegrasyon commit'i: `74bb1d30`.

## Araştırma verisinin korunması

Git dışındaki kalıcı klasör: `/Users/mahsum/Documents/karta-language-data/kaikki-current-2026-10-14`.
`/private/tmp/karta-kaikki-current` içindeki 15 dosyanın her birinin SHA256'sı kopyayla eşittir; liste `COPY-INTEGRITY.json` içindedir. Ham `verbs.jsonl`: `25a8581ddef225c405493b557bc8a18a816ef7706b1bd0588459dd2efd376141`. Manifest, ham veri, tüm anlam kayıtları, anahtar listesi, tam çıkarım raporu, corroboration girdisi ve önceki üretim çıktıları saklandı. Son değerlendirme ve tekrar üretim bilgileri `pending-review-reproduction` altındadır. Ham veri Git'e eklenmedi.

## Kabul politikası

Tüm 606 kayıtta ayrı ayrı: çalışma zamanı bağlam şeması ve birebir kanıt metni/offset, kaynak sürümü hash'i, kaynak başlığıyla fiil eşleşmesi, aynı anlamın kimliği ve gloss bağlamı, Almanca `+obj` şablonunda çıkarılmış edat/kasus slotunun birebir karşılığı, mevcut sürümde aynı yapı/edat için farklı kasus bulunmaması ve reflexive şartın korunması denetlendi. Hepsi geçti. Kaynak kayıt hash'i ve satırı saklanır; temel ham dosya manifest hash'iyle önceki çıkarımda doğrulanmıştır.

Bu, **kaynağın ne söylediğinin kabulüdür**, fiilin bütün anlamları için evrensel veya iki bağımsız kaynakla doğrulanmış bir kural değildir. Kaynak kabulü `referenceAcceptance`, tanı uygunluğu `review` alanında ayrı tutulur. Tam `templateArgument`, anlam, etiketler ve reflexive şartları kayıtta kalır. Tek başına gloss, örnek veya transitive etiketi kaynak kabulü/tanı onayı sağlamaz. Başarısız kanıt, kaynak, anlam kimliği veya çelişki kontrolü ek kaynak/inceleme gerektirir; 606 grubunda böyle bir başarısızlık bulunmadı.

Tanıya kabul için ek şartlar: desteklenen tek argümanlı şablon; çözümlenmemiş reflexive, ek nesne, kullanım niteleyicisi veya başka yapı şartı olmaması; aynı anlamdaki gerçek kaynak örneğinde kaynaklı fiil formu ve tek bir açık nesne-zamir hedefi; aynı hedef için rakip kaynaklı fiil yapısı olmaması. Tam normalize edilmiş kaynak cümlesi **ve değişen zamirin indeksi** izin listesine alınır. Bu örneklerle yeni ders üretilmedi. Başka anlam/bağlam, farklı nesne konumu veya referent değiştiren cevap tanı kanıtını ödünç alamaz. Böyle sınırlı kayıtlar genel kelime zenginleştirmesinin koşulsuz edat/kasus önerisine eklenmez.

## Sonuç

| 606 grubunun sonucu | Kaynak kaydı | Benzersiz yapı | Benzersiz fiil |
|---|---:|---:|---:|
| Önceki kuyruk / kaynaklı referans kabulü | 606 | 542 | 406 |
| Yeni, cümle ve zamir konumuyla sınırlı tanı | 15 | 15 | 15 |
| Tanı bekleyen toplam | 591 | 532 | 399 |
| Yalnızca bağlam/nesne hedefi eşleştirmesi eksik | 227 | 202 | 185 |
| Yalnızca yapısal koşul eksik | 25 | 24 | 24 |
| İki engel birlikte | 339 | 315 | 225 |

Önceki genel ikinci-kaynak gerekçesi, diğer kontrolleri geçen 15 kayıt için kaldırıldı. İkinci kaynak tek başına zorunlu olduğu için bekletilen kayıt: **0**. Diğer 591 kaydın ikinci kaynak olmaması gerçek tanı engellerini çözmez. “Bağlam eşleştirmesi eksik” upstream anlam/gloss yok demek değildir: mevcut bounded tanının belirli cümle ve doğru nesne rolüne güvenli bağlanması henüz mümkün değildir.

Örtüşen yapısal nedenler: karma/nitelikli şablon 234; reflexive rol 123; bare Akkusativ/Genitiv gibi tanının desteklemediği rol 112; ek nesne rolü 85; impersonal/reciprocal/ditransitive etiketi 15; mevcut kaynaklı fiil-formu tanımasında rakip yapı 2. Bunlar birbirini dışlamaz; toplamları kayıt toplamı değildir. `vorbeischauen` kaynak örneği başka bir kaynaklı fiil-formu adayıyla eşleştiği için yeni tanıya alınmadı. Kaynak bilgisi kabul edilmiş referans olarak korunur.

Yeni tanı fiilleri: gehen, bauen, stehen, bleiben, mangeln, erlauben, passen, auffallen, entgegenschlagen, festhalten, weismachen, fernliegen, zuvorkommen, unterlaufen, wegsterben. Sınırları kayıtların `diagnosticConditions.allowedPronounTargets` alanındadır.

Güncel kaynak toplamı: 1.125 kaynak adayı / 955 yapı / 589 fiil. Önce 197 kaynak kaydı / 161 yapı tanıya uygundu; şimdi 212 kaynak kaydı / 176 yapı / 154 fiil uygundur. 803 kaynak kaydı / 703 yapı / 497 fiil kabul edilmiş referans olarak işaretlidir (önceden onaylı 197 dahil). Tanı bekleyen toplam 913 kaynak kaydı / 786 yapı / 505 fiildir: bu görevdeki 591'e ek olarak anlam seçimi gereken 187, yalnızca gloss kanıtı olan 93 ve tarihî/seyrek kullanım incelemesi gereken 42 kayıt kalır. Bu diğer gruplar tamamlandı sayılmadı. 66 AI kaydının karantinası değişmedi. 6.658 anahtarın uygulama statüleri: diagnosticEligible 305 → 318, evidenceNeedsReview 2.101 → 2.088, unresolved 4.252 → 4.252. Yeni kaynak yapıları ile toplam fiil statüsü artışı aynı sayı değildir; bazı fiiller başka yapılarıyla zaten uygundu.

Benzersiz yapı `(lemma, construction, prep, case)` anahtarıdır; farklı anlam kayıtları aynı yapıda birleşebilir. Kabul edilen/bekleyen benzersiz yapı ve fiil kümeleri örtüşebilir; alt gruplardaki benzersiz sayılar toplanmamalıdır. Kayıt bazında kontroller ve engeller uygulama verisindedir; sayılar `kaikki-pending-assessment-2026-10-14.json` içindedir.

## Doğrulama ve sınırlar

Değişen çıkarım/kabul hattı, registry, sözlük önerisi ve bounded tanı için 58 hedefli test geçti. Yeni 15 yapının tamamında doğru zamir hedefi, yanlış kasus, değiştirilmiş bağlam ve yanlış referent denetlendi; başka nesnenin aynı cümlede kanıtı ödünç alamaması ve yapısal/reflexive kayıtların referans kabulüyle tanıya geçmemesi test edildi. Kaynak/offset/sürüm/anlam/çelişki bozulması ve yalnızca gloss/örnek verilmesi negatif testlerle kapsanır.

TypeScript kontrolü de geçti. Genel test paketi, giriş testleri, migration, yeni indirme, push ve deploy yapılmadı. Bu iş bütün Almanca fiillerin valenzinin tamamlandığı anlamına gelmez; yukarıdaki gruplar açıktır.
