import type { StudySet } from "./types";

function set(
  partial: Omit<StudySet, "createdAt" | "updatedAt" | "lastStudiedAt"> & {
    createdAt?: number;
  },
): StudySet {
  const now = partial.createdAt ?? Date.now();
  return {
    ...partial,
    createdAt: now,
    updatedAt: now,
    lastStudiedAt: null,
  };
}

function cards(pairs: [string, string][]) {
  return pairs.map(([term, definition], index) => ({
    id: `card-${term.slice(0, 12)}-${index}`,
    term,
    definition,
    starred: false,
    mastery: 0,
    imageUrl: null,
  }));
}

export const SEED_SETS: StudySet[] = [
  set({
    id: "seed-en-daily",
    title: "İngilizce günlük ifadeler",
    description: "Konuşmada sık geçen 16 ifade ve doğal Türkçe karşılıkları.",
    subject: "Dil",
    cards: cards([
      ["anyway", "Her neyse; konuyu bağlamak veya geçiştirmek için."],
      ["actually", "Aslında; beklenenin aksini belirtmek için."],
      ["by the way", "Bu arada; yeni bir konuya geçerken."],
      ["I mean", "Yani; söylediğini netleştirirken."],
      ["kind of", "Bir bakıma; tam emin olunmayan bir durumu yumuşatır."],
      ["make sense", "Mantıklı gelmek; anlaşılır olmak."],
      ["no wonder", "Şaşılacak bir şey yok; nedeni açık."],
      ["on the other hand", "Öte yandan; karşıt bir bakış ekler."],
      ["as well", "Ayrıca; de/da anlamında."],
      ["rather than", "… yerine; tercih belirtir."],
      ["so far", "Şimdiye kadar."],
      ["at least", "En azından; durumu hafifletmek için."],
      ["used to", "Eskiden alışkanlık; artık yapılmayan bir şey."],
      ["end up", "Sonunda … ile bitmek."],
      ["look forward to", "Dört gözle beklemek (sonrası -ing alır)."],
      ["take for granted", "Kanıksamak; değerini fark etmemek."],
    ]),
  }),
  set({
    id: "seed-capitals",
    title: "Avrupa başkentleri",
    description: "Ülke adından başkente — coğrafya tekrarı için kısa set.",
    subject: "Coğrafya",
    cards: cards([
      ["Fransa", "Paris"],
      ["Almanya", "Berlin"],
      ["İtalya", "Roma"],
      ["İspanya", "Madrid"],
      ["Portekiz", "Lizbon"],
      ["Yunanistan", "Atina"],
      ["Polonya", "Varşova"],
      ["Avusturya", "Viyana"],
      ["Belçika", "Brüksel"],
      ["Hollanda", "Amsterdam"],
      ["İsveç", "Stockholm"],
      ["Norveç", "Oslo"],
      ["Çekya", "Prag"],
      ["Macaristan", "Budapeşte"],
      ["İrlanda", "Dublin"],
    ]),
  }),
  set({
    id: "seed-cell",
    title: "Hücre organelleri",
    description: "Lise biyoloji: organel adı ve temel görevi.",
    subject: "Fen",
    cards: cards([
      ["Mitokondri", "Hücresel solunumla ATP üretir; enerji santrali."],
      ["Ribozom", "Protein sentezini gerçekleştirir."],
      ["Golgi aygıtı", "Protein ve lipidleri paketler, değiştirir, gönderir."],
      ["Endoplazmik retikulum", "Protein ve lipid sentezi için kanal ağı."],
      ["Lizozom", "Sindirim enzimleriyle atıkları parçalar."],
      ["Çekirdek", "DNA’yı barındırır; hücre faaliyetlerini yönetir."],
      ["Kloroplast", "Bitkilerde fotosentez yapar."],
      ["Koful", "Su, atık ve besin depolar; bitkide büyük olur."],
      ["Hücre zarı", "Madde alışverişini seçici geçirgen kontrol eder."],
      ["Sentrozom", "Hayvan hücresinde iğ ipliklerini oluşturur."],
    ]),
  }),
  set({
    id: "seed-js",
    title: "JavaScript temelleri",
    description: "Günlük kodda çıkan kavramlar, kısa tanımlarla.",
    subject: "Yazılım",
    cards: cards([
      ["const", "Yeniden atanamayan bağlama; referansın kendisi sabittir."],
      ["let", "Blok kapsamında, yeniden atanabilir değişken."],
      ["===", "Hem değer hem tip eşitliğini kontrol eder."],
      ["map", "Diziyi dönüştürüp aynı uzunlukta yeni dizi üretir."],
      ["filter", "Koşulu sağlayan elemanlarla yeni dizi döner."],
      ["reduce", "Diziyi tek bir değere indirger."],
      ["Promise", "Asenkron işlemin ileride tamamlanacağını temsil eder."],
      ["async/await", "Promise’leri senkron görünüşlü yazar."],
      ["closure", "İç fonksiyonun dış kapsamdaki değişkenleri hatırlaması."],
      ["spread", "… operatörüyle dizi veya nesneyi açmak."],
      ["optional chaining", "obj?.x — yoksa hata yerine undefined."],
      ["event loop", "Çağrı yığını boşalınca kuyruktaki işleri çalıştırır."],
    ]),
  }),
];
