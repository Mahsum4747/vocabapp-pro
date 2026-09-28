/**
 * Turkish (TR) -> Kurmancî (KU) reverse lookup dataset — GENERATED FILE, DO
 * NOT EDIT BY HAND.
 *
 * Same source/pipeline as ku-data.ts's KU_FORWARD_TSV — see
 * KURDISH-ATTRIBUTION.md. This is the OTHER direction: built from the same
 * underlying (entry, translation) pairs but indexed by the Turkish text,
 * since `translations` in the source database carries no sense-level FK
 * (see KURDISH-ATTRIBUTION.md) and a Turkish word can be the translation of
 * several unrelated Kurdish headwords.
 *
 * Only Turkish texts that resolve to EXACTLY ONE distinct Kurdish headword
 * (across every Kurdish entry that lists it as a translation, whether or
 * not that Kurdish entry is itself unambiguous) are included — any Turkish
 * text mapping to two or more different Kurdish headwords is left OUT
 * entirely, same "ambiguous -> absent, not a guess" rule as the forward
 * direction.
 *
 * Format: one record per line, tab-separated, two columns:
 *   tr (lowercased) \t ku headword
 */

export const TR_REVERSE_TSV = `
fare	mişk
çeviren	werger
nere	ko
payitaht	serbajar
dünden önceki gün	pêr
er kişi	mêr
küreği	mêr
bugün	îro
viki	wîkî
yirmi	bîst
kodak	malbat
bizi	mê
pazartesi	duşem
susuz arazi	dem
asitane	paytext
paytaht	paytext
ken	paytext
kamer	heyv
etsiz	jar
tüy siklet	jar
kembağal	feqîr
lügat	ferheng
emlak	mal
yağmur	baran
baran	baran
kürtçe	kurdî
kürt	kurd
kürdistan	kurdistan
kürdistanlı	kurdistanî
kurmanci	kurmancî
kurmancça	kurmancî
siyah	reş
kış	zivistan
ilkbahar	bihar
bahar	bihar
elma	şev
tüffah	şev
bakla kırı	çûn
kurşuni	çûn
dudak	lêv
zelal	sahî
bulutsuz hava	sahî
ıpıl ıpıl	sahî
krala ait	sahî
şahlık	sahî
monarşik	sahî
iyilik sağlık	başî
kemlik	xirabî
luk	î
lı	î
beş	pênc
lep	pênc
iki	du
ardından	du
doru	sê
yedi	heft
sekiz	heşt
sezi	heşt
dokuz	neh
on	deh
on bir	yazde
artığın	yazde
on üç	sêzde
ondört	çardeh
onbeş	panzdeh
on altı	şazde
on yedi	hevde
on sekiz	hejde
on dokuz	nozde
giyim	çil
semer sapı	çil
altmış	şêst
yetmiş	heftê
hafta	heftê
yedil	heftê
seksen	heştê
çakmak taşı	heştê
doksan	not
bin	hezar
milyon	milyon
milyar	milyar
iki yıl önce	pêrar
uca	bilind
dışarda	derî
darice	derî
dili	derî
giriş kapısı	dergeh
büyük kapı	dergeh
ana kapı	dergeh
ot kümesi	qurs
bızbız	sivik
büyükanne	dapîr
kıyın	zehmet
düşvar	zehmet
gros	stûr
pük	berf
çay önü	berav
ayazlanmak	qerisîn
üçkağıda getirmek	xapandin
otlanmak	çerîn
çayırlamak	çerîn
çayırlanmak	çerîn
çayırlatmak	çerandin
otarmak	çerandin
çayırlatma	çerandin
vida	çer
intak	peyivandin
konuşturma	peyivandin
cilo dağı	çilo
meşe yaprağı	çilû
manga	pel
titrek kavak	pel
varak	pel
kim	kî
işitme	bihîstin
ar	ar
sol	çep
nahırcı	gavan
öküz çobanı	gavan
çoban	şivan
sütçü kız	bêrîvan
çobanlık	şivanî
kaymakamlık	bajarok
evlat	zarok
nci	em
üncü	em
gelme	te
çağırtı	gazî
medet	hewar
sormuk	memik
mamiş	çiçik
emcek	çiçik
neoplâzma	ûr
fiiliyat	kirin
ika	kirin
iştira	kirin
satın almak	kirin
alım yapmak	kirin
milel	qewm
akvam	qewm
üsera	eşîr
ağa	axa
yumuş	sol
eski ayakkabı	şekal
başmak	şekal
soğuk hava	serma
kitabi	kitêbî
aş	xwarin
yiyim	xwarin
alkollü içecek	vexwarin
içki	vexwarin
içilir	vexwerbar
yenebilir	xwerbar
yenilebilir	xwerbar
yiyinti	xwirak
manca	xwirak
akşam yemeği	şîv
sahur	paşîv
er ekmeği	paşîv
temel direği	heman
anasır	heman
kararsızlığa düşmek	qeliqîn
gaste	rojname
yenün	rojname
haftalık gazete	heftename
haftalık yayın	heftename
kağıt üzerinde olmak	man
kalış	man
kaşanmak	sekinîn
b	ra
kaldırış	rakirin
nesih	rakirin
istiap etmek	hildan
istiap	hildan
beygir gücü	hildan
kaldırıcı	bilindker
yükselteç	bilindker
kaldıran	bilindker
sağır	ker
nereden	kû
pak	pak
nezahet	paqijî
kirlik	pîsî
su mercimeği	pîs
üşniye	pîs
ler	an
lar	an
sığınacak yer	asitan
utlänning	bêgane
enişte	xal
ümran	avahî
bayındır yer	avahî
abadan	avahî
sakim	xirabe
unmaz	xopan
elan	nika
şimdilik	nika
göce	dan
parttaym	dan
ağbi	kek
aka	kek
kek	kek
kardeş karısı	birajin
kayınbirader	bûra
lük	tî
ite	tî
dişler	diran
simil	xwişk
kız kar­deş	xuşk
hemşirezade	xwarza
kız kardeşin kız çocuğu	xwarza
kız kardeşin çocuğu	xwarzî
zeban	zar
cem	cem
rüzgâr	ba
yel	ba
öreke tığı	nik
olta iğnesi	nik
seren	tenişt
sarsıntılı	hêj
hala oğlu	kurmet
malumat sahibi	agah
çağrıya cevap 'ne var'	ha
kurtulmuş	rizgar
kendi başına	xweser
satış	firotin
az buçuk	piçek
kofça	piçek
yufkalık	hindik
ahzetmek	stendin
alış	stendin
satıcılık	firoşerî
satış yeri	firoşgeh
kâh	geh
prefiks	pêşbendik
tekil takısı	ek
dönme kimse	abal
serçin	bijare
yer imi	bijare
seçenekler	vebijêrk
gezenti	gerok
gezeğen	gerok
tarayıcı	gerok
var olmak	hebûn
varoluş	hebûn
egzistans	hebûn
okuma	xwendin
teganni etmek	strîn
türkü çağırmak	strîn
söyleme	strîn
teganni	strîn
şarkı söyletmek	strandin
hamur yoğurmak	strandin
mürekkep yalamış	xwenda
mektep medrese görmüş	xwende
öğrenimli	xwende
okumuş	xwende
bilici	zana
tevellüttü	zana
tahsilli	xwendewar
kari	xwendewar
dershane	fêrgeh
tenzil etmek	daxistin
iskonto	daxistin
maruzat	daxwaz
şahs	kes
çeken	kes
taşıyan	kes
kişi oğlu	ademîzad
çalıştcı	xebatkar
çalışan	xebatkar
çalışıcı	xebatkar
faale	karker
gülüt	qerf
sizler	hûn
sessiz yellenme	fis
ratıp	hemî
türkçe	tirkî
azatlık	azadî
azadelik	serbestî
serbesti	serbestî
hizmetçi kadın	xidam
sucuk	benî
omur ilik	mêjû
mehaz	çavkanî
tefsir	şîrove
yapan	çêker
nuh suresi	nûh
bir zamanlar	hingê
o sırada	hingê
eskiden	hingê
çiten	çax
suz	bê
yiğitleşmek	werîn
cüret göstermek	werîn
pakistan	pakistan
irak	iraq
i̇srail	israîl
yemen	yemen
kuveyt	kuwêt
ürdün	urdin
lübnan	libnan
filistin	filistîn
ermenistan	ermenistan
azerbaycan	azerbeycan
gürcistan	gurcistan
türkmenistan	tirkmenistan
kırgızistan	kirgîzistan
japonya	japonya
tayvan	taywan
filipinler	filipîn
avustralya	awistralya
tayland	taylenda
vietnam	viyetnam
kamboçya	kambodya
çin	çîn
moğolistan	mongolya
rusya	rûsya
nepal	nepal
sri lanka	srî lanka
bahreyn	behreyn
somali	somalya
sudan	sûdan
cezayir	cezayir
libya	lîbya
i̇spanya	spanya
portekiz	portugal
fransa	fransa
britanya	brîtanya
hollanda	holenda
almanya	almanya
belçika	belçîka
norveç	norwec
finlandiya	fînlenda
yeygi	pût
aç	birçî
ruanda	riwanda
çad	çad
nijerya	nîjerya
kenya	kenya
botsvana	botswana
burundi	burundî
tanzanya	tanzanya
uganda	uganda
malavi	malawî
mozambik	mozambîk
zimbabve	zîmbabwe
zambiya	zambiya
namibya	namîbya
angola	angola
lesotho	lesoto
svaziland	swazîlenda
madagaskar	madagaskar
güney afrika	afrîkaya başûr
orta afrika cumhuriyeti	komara afrîkaya navîn
kamerun	kamerûn
gabon	gabon
nijer	nîjer
benin	benîn
togo	togo
gana	gana
burkina faso	burkîna faso
liberya	lîberya
mali	malî
horanta	malî
evcil hayvan	malî
senegal	senegal
arjantin	arjentîna
dolusu	mişt
silme dolu	mişt
hıncahınç	mişt
ful	mişt
tıklım tıklım	mişt
ıklım tıklım	mişt
ağzına kadar dolu	mişt
ıklım	mişt
lebaleb	mişt
tehi	xalî
vış	pî
pi	pî
mektup zarfı	pêçîk
sargı bezi	pêçîk
kese kâğıdı	pêçîk
kesekağıdı	pêçîk
umman	uman
olarak	wek
mister	mîna
kanada	keneda
abd	dya
pkk	pkk
baş	ser
allah evi	mizgeft
i̇sevî	îsawî
mesihi	mesîhî
kuran	qur'an
dergi	kovar
mahiye	mehane
bağdat	bexda
o bu	wan
van	wan
zaho	zaxo
süleymaniye	silêmanî
duhok	dihok
tahran	tehran
beyrut	beyrût
ankara	enqere
i̇stanbul	stembol
berlin	berlîn
i̇talya	îtalya
paris	parîs
londra	london
i̇skoçya	skotlenda
stockholm	stokholm
mahabad	mehabad
kerkük	kerkûk
elle tutulur gözle görülür	xuya
evlenme teklif etmek	xwastin
isteyiş	xwestin
öptürmek	ramûsandin
öpüşmek	ramûsîn
elmek	e-poste
yabani hayvan	kûvî
gölge gibi	kûvî
yıl	sal
sene	sal
şal	sal
haiti	haîtî
bilmem hangi	cî
savlet	pêngav
su birikintisi	pêngav
celp etmek	înan
götürme	birin
eyersiz	bezîn
güvey	zava
damat	zava
kaynana	xesû
kayınvalide	xesû
hanımanne	xesû
kaynata	xezûr
kayınbaba	xezûr
kayınpeder	xezûr
koyungiller	meşîn
alkol	alkol
moment	bêhn
uzak görüşlü	dûrbîn
pastane	firîn
cik cik	çivîk
küçük kuş	çûçik
liken	xur
garoz	xerb
cüda	cihê
sol eğilimli	çepgir
enflüanza	ḧal
humma	ḧal
paçavra hastalığı	ḧal
sıçkı	gû
maazallah	hakê
yatak yorgan	nivîn
altına	bin
mükafat	xelat
bir arada	pevre
şimal	bakur
cenup	başûr
sarımsak	şîr
savut	çek
çek	çek
şili	şile
akan	şilemenî
fasikül	çiz
cüz	çiz
ağına düşmek	navran
vikisözlük	wîkîferheng
zıp	çip
cip	çip
jip	çip
kuş gibi	çipik
çalâk	çipik
kanka	heval
muhip	dost
seyirci	temaşevan
fırat	firat
kilometre	kîlometre
çakrım	kîlometre
kilogram	kîlogram
kilo	kîlogram
nil	nîl
çivit otu	nîl
amazon nehri	amazon
amazon	amazon
munzur	minzûr
habur	xabûr
irak kürdistanı	kurdistana iraqê
makber	gor
şirden	silav
börkenek	silav
selâm	selam
alo	elo
küpe çiçeği	guharok
kulak çivisi	guharok
sögen	saet
sikişmek	gan
burun delikleri spazmı	nînok
kasık kılı	rêv
kaçış	rêv
dörütçü	hunermend
dörütmen	hunermend
sanatvari	hunermendî
sanat dostu	huneryar
bu gece	îşev
bu yıl	îsal
bu yılki	îsal
cumhurbaşkanlık	serokkomarî
cumhurbaşkanlığı	serokkomarî
başvekil	serokşaryar
hikâye yazarı	çîroknivîs
romancılık	romannivîsî
dilbilim	zimannasî
lengüistik	zimannasî
lisâniyat	zimannasî
bulaşıkçı	amanşo
bulaşık makinası	firaxşok
tanner	aman
nal	nal
nalbant	nalbend
arziyat	erdnasî
yer bilimi	erdnasî
yer bilimci	erdnas
jeolog	erdnas
musa	mûsa
موسی	mûsa
musalar	mûsa
göbekbağı	torr
kör ocak	bêdunde
leksikograf	ferhengdaner
lügatçı	ferhengdaner
ebeveyn	dêbav
anne-baba	dêbav
anasız	sêwî
emre	evîn
meşin yuvarlak	gog
glüten	pez
memeli hayvan	guhandar
oğlak	karik
çıkarış	deranîn
reji	deranîn
ithalat	deranîn
dışalım	deranîn
antisemitizm	antîsemîtîzm
yahudi karşıtlığı	antîsemîtîzm
yahudi düşmanlığı	antîsemîtîzm
börü	gur
tezelzül	hejîn
büyükbaş hayvan	dewar
fermantasyon	meyîn
tahammür	meyîn
tahammür etmek	meyîn
pıhtılaşma	meyîn
âmâ	kor
görmez	kor
hecin	hêstir
balık	masî
sokan	masî
soğuk çalmak	şirîn
iliklere işleyen	tehl
yılan balığı	marmasî
balık tutma	masîgirî
çağlayan	sûlav
çavlan	sûlav
katıntı	çol
okulöncesi	pêşdibistan
anaokulu	pêşdibistan
parlamentarizm	parlementarîzm
şerbet gibi	xweş
kılavuzluk	rêberî
yol bilen	rêzan
fikirsel	ramyarî
hoşhoş	kitik
vanlı	wanî
zaholı	zaxoyî
sıcak bölge	germiyan
halk ağzı	devok
ağızsıl	devokî
ayık	şiyar
güneş ışığı	tav
denlik	aborî
مُعاشی	aborî
ucuz	erzan
ucuzluk	erzanî
şurası	wê
sizi	wê
şuraya	wir
bunu	vê
meyve bahçesi	cinîn
gülistan	gulistan
hükûmet	hikûmet
fars	faris
hiper	zêde
o biçim	zêde
mukteza	pêwîst
tahrirat	nivîsar
konuk	mêvan
katledilme	kuştin
öldürülme	kuştin
kaşandırmak	sekinandin
ot	giya
süt kardeş	biramak
anneden erkek kardeş	biramak
fırıncı	nanpêj
ekmekçi	nanpêj
köycük	gundik
teke	nêrî
göreneksel	nêrtî
erkeç	gîsk
çepiş	gîsk
çebiç	gîsk
çepiç	gîsk
keçi yavrusu	gîsk
günorta	nîvro
sabahın alacakaranlığı	spêde
rüya	xewn
çobuk	dar
ağaç gövdesi	qurm
avadanlık	hacet
doğru olmayan	nerast
cuma	în
ahu dudu	şemî
çarşamba	çarşem
cuma akşamı	pêncşem
cüsse	gewde
kadavra	kelex
cife	kelex
hayvan leşi	kelex
hayvan ölüsü	kelex
serdar-ı ekrem	pêxember
allah'ın elçisi	pêxember
küçük ad	pêşnav
ön ad	pêşnav
onun için	loma
o yüzden	loma
hasebiyle	loma
ihtilal	şoreş
arkaya	pişt
pist	pişt
yarışlık	pişt
art arda teker tekere	paşê
neden sonra	piştre
sonraları	piştre
ardınca	piştre
alümin	dî
telliir	dî
diğeri	dîtir
evvelki	dîtir
tebdil	guhastin
tebdil etmek	guhastin
avro	euro
transfer etmek	guhaztin
derisini yüzmek	gurandin
açma	vekirin
son bahar	peyiz
zahmetli iş k	zor
kadın baş örtüsü	çarik
dogma	nas
tanış	nas
inak	nas
yabancısı olmamak	nas kirin
tanıyış	naskirin
gear	ger
yüzüncü	sedem
delegasyon	delegasyon
şad olmak	şad bûn
sürür	kêf
teşyi etmek	bi rê kirin
yola vurmak	bi rê kirin
postalamak	bi rê kirin
selâmetlemek	bi rê kirin
kullanıma hazır	peyda
peyda	peyda
yardım toplama	beş
geri dönmek	vegerîn
kayıtmak	vegerîn
aygir	hêsa
bileği taşı	hêsan
bileyi taşı	hêsan
bileme taşı	hêsan
teshil	hêsankirin
kılağılama	hêsankirin
beğeni	zewq
gusto	zewq
zevksiz	bêzewq
sağlıcakla	bixweşî
bütünlü	teva
bütünlüklü	teva
yedi düvel	tev
mobil	bizav
ekser	piranî
kesret	piranî
yaşlı erkek	pîremêr
kadın nine	pîrejin
koca karı	pîrejin
ağababa	kal
büyük baba	kal
cet	kal
büyükbaba	kal
presbit	kal
aheste	hêdî
bati	hêdî
ağır ol!	hêdî
yavaş!	hêdî
ağır ol	hêdî
serpilmiş	belav
şürekâ bulmak	belav bûn
ortaya vurmak	belav kirin
tevessü	belavbûn
imbisat	belavbûn
saç baş	kepir
kepir	kepir
kafi olmak	bes bûn
yeter demek	bes kirin
defter açmak	bes kirin
bitmiş	xilas
sona ermiş	xilas
doyulmak	têr bûn
bağdat'ı tamir etmek	têr bûn
doyulma	têrbûn
doyurma	têrkirin
işba	têrkirin
karnı tok	ziktêr
birazdan	zû
biraz sonra	zû
seve seve	zû
açabuk	zûka
ağır oturmak	giran bûn
kurşunlaşmak	giran bûn
ağırlaştırmak	giran kirin
ağırlaşma	giranbûn
kurşunlaşma	giranbûn
yavaşlatma	girankirin
ağır bir şekilde	bi giranî
kaşbastı	şaşik
teşekkül ettirmek	afirandin
piyaz	pesn
takriz	pesn
şehitler	şehîd
gaziler	şehîd
mücahid	şehîd
şehit düşmek	şehîd bûn
şehit etmek	şehîd kirin
mart	adar
muhacir	koçber
her yerde, her yerinde	seranser
boydan boya, bir uçtan diğer uca	seranser
boydan boya	seranser
her yer	herder
her yerde	herder
alesta durmak	amade bûn
apiko beklemek	amade bûn
hazırlamak	amade kirin
hazırlayış	amadekirin
anıklamak	hazir kirin
hazır etmek	hazir kirin
agrandisman	mezinkirin
büyütme	mezinkirin
büyüyüş	mezinkirin
celil	gewre
cesim	gewre
grimsi	gewre
mülâhham	qelew
balabanlaşmak	qelew bûn
semen gelmek	qelew bûn
gönül vermiş	dildar
gönül	dil
mavi küf	bela
polonyaca	lehî
sel götürmek	lehî rabûn
boşta gezer	betal
kullanılmaz	betal
battal olmak	betal bûn
battal etmek	betal kirin
kalem çekmek	betal kirin
boş kalmak	betal man
hak kazanmak	heq kirin
haketmek	heq kirin
baş gelmek	ji heq derketin
üstesinden gelmek	ji heq derketin
hakkından gelmek	ji heq derketin
haketme	heqkirin
beli	erê
önceki	berê
erişkin	temam
çıkıştırmak	temam kirin
erişkinlik	temambûyî
ispatlamak	peyitandin
terme	şert
siirt	şert
ekşi	tirs
at yelesi	bîjî
başak kılçığı	bîjî
hurra	bîjî
zina etmek	zina kirin
günah işlemek	guneh kirin
medlul	mane
film	fîlm
...-den başka	ji bilî
nın dışında	ji bilî
dışında	ji xeynî
dahası	ji xeynî
rüesa	serok
peyrev	peyrew
destekçi	peyrew
ahlâf	peyrew
arda	peyrew
hindistanlı	hindî
hintçe	hindî
o kadarki	hinde
hasseten	nemaze
nadim	peşîman
öc almak	tolhildan
acısını çıkarmak	tol hildan
erime	hêlîn
yemekhane	xwaringeh
kuru üzüm	mêwîj
teleme	jajî
mikro	hûr
kırıklamak	hûr kirin
bozdurmak	hûr kirin
bozdurma	hûrkirin
kıyımlı	hûrkirî
taraz	pirtik
ülger	pirtik
koyun tüyü	pirtik
kıtık	pirtik
ilgeç	pirtik
vefiyat	wefat
emlemek	derman kirin
çalarmak	kamil bûn
sakamet	kêmasî
lira	lîre
banknot	banknot
ana deniz	okyanûs
arzuhal	daxwazname
istida	daxwazname
müzekkere	daxwazname
teklifli	resmî
resmi dil	resmî
devletli	dewletî
sonlanmak	bi dawî hatin
sona gelmek	bi dawî hatin
odaklaşmak	kom bûn
aglütinasyon	kombûn
satıh	robar
hasbıhal etmek	suhbet kirin
peşkeş	pêşkêş
peşkeş çekmek	pêşkêş kirin
hediye etmek	diyarî kirin
burağan	babelîsk
ufaklı	hûrik
fecaat	karesat
çok kötü	kembax
böğür kemiği	kemax
şişirmece	nebaş
iyi olmayan	nebaş
boşaltım	derkirin
boşaltı	derkirin
kaçlı	cendek
ölmüş	mirî
jenosid	tevkujî
sultani tembel	tiral
sinirce	newroz
dörüt	huner
bilâ	bila
düzeltim	reform
ıslahat	reform
yaşam alanı	jîngeh
diyerek	qey
hayal gücü	xeyal
muhayyile	xeyal
sıraca	zîpik
dolu yağışı	zîpik
cıva gibi	çeleng
çakı gibi	çeleng
güçlü ve hızlı yürüyen kimse	çeleng
aigrir	hilhatin
kalkış	hilhatin
matla	hilhatin
tulü	hilhatin
punt	keys
yukarı bakan	hil
çözelti	hel
kaldırıp atmak	hilavêtin
malik	xwedî
elmen	xwedî
sahabe	xwedan
arak	xwedan
tapış	peristin
tapınış	peristin
aptest	destnimêj
hamur	hevîr
iğnedenlik	derzîdank
iğnelik	derzîdank
sopa#tirkî	ço
deh	ço
kadın avcısı	mêbaz
iş güç	karûbar
eşkal	dirûv
demir yürekli	wêrek
kendinden	biste
arkasına almak	hilgirtin
mücbir olmak	hilgirtin
sırtlanmak	hilgirtin
bir şeyi kaldırıp taşımak	hilgirtin
olur şey	asayî
düzgülü	normal
töreye uygun	adetî
örf	irf
cumhur	civat
manu	sexte
istisnai	awarte
panel	panel
toplu görüşme	panel
ist	îst
piyano	piyano
sübek	bilûr
büz	kunik
farsça	farisî
acemce	farisî
arî	farisî
feldmereşal	rûs
kabak gibi	rût
cıbıl	rût
yalınayak	pêxwas
iki ruhlu	ducan
iki canlı	ducan
dölsüz	stewr
savur	stewr
kısır hayvan	stewr
aparmak	dizîn
aşıramento	dizîn
aşırmasyon	dizîn
arakçılık	dizî
uğruluk	dizî
gizli kapaklı	dizî
cezaevi	zindan
kapantı	girtî
yakalanan	girtî
hamilelik	nesaxî
yoğalmak	tine bûn
yok olmak	tine bûn
zail olmak	tine bûn
fıkdan	tinebûn
mafiş	tine
gidermek	tine kirin
hiçe saymak	tine kirin
ala	elem
hedef	armanc
gol	hedef
çıban ağırşağı	gerek
iradeli, götürüm	bivîn
yaralanan	birîndar
ağrıtma	êşandin
adlı sanlı	navdar
namdar	navdar
kulağı olmak	guh lê bûn
sak durmak	guh lê bûn
farketmek	pê hesîn
havâs	pêhesîn
lamise	pêhesîn
yancık	berîk
sezdirmek	pê hesandin
sezindirmek	pê hesandin
sezdirme	pêhesandin
sezindirme	pêhesandin
dolgu yapmak	hesandin
dolgu	hesandin
çekilmiş	tewandî
umarsız	bêçare
çıkmaz	bêçare
ayran çorbası	mehir
küs	şû
evermek	zewicandin
erkekli	bîmêr
abazan	bêjin
kükre	hêç
hac	hêç
harı başına vurmak	har bûn
yüzlenmek	har bûn
taharrüş	harbûn
çıldırış	harbûn
kuduruş	harbûn
arpası çok gelmek	hêç bûn
hac etmek	hêç kirin
çilim	cigare
banka	bank
kamanço etmek	veguhastin
intikal ettirmek	veguhastin
ehemmiyetli	mihim
söylemesi ayıp	bêmane
bel bel	bêmane
ba	bêwate
harlaklık	fer
ikişer	cot
yayık yayma	kêlan
ot yoldurmak	kêlan
toprağı sürmek	kêlan
ateşlenme	kêlîn
ekin ekmek	çandin
çeri	esker
zabitan	serbaz
et kafalı	şerker
horoz akıllı	şerker
katır gibi	şerker
dirseklik	ceng
uçar	firoke
eşhas	şexs
zevat	şexs
helikopter	helîkopter
halet	barûdox
icazet	destûr
düstur	destûr
muvaffakat	destûr
eşkin	meş
kabul edilmiş	pejirandî
benimsenmiş	pejirandî
billur gibi	zelal
netleşmiş	zelalkirî
çürüğe çıkmak	pûç bûn
koflaştırmak	pûç kirin
boşa çıkarmak	pûç kirin
koflaştırma	pûçkirin
koflaşmış	pûçbûyî
hanım evlâdı	pîç
göbel	pîç
merdiven yapması	pîç
yandan firlama	pîç
kopil	pîç
nebze	pîç
taariz	pîç
az miktar	pîç
küçük bir miktar	pîç
abonmen	kiryar
çiftçi	cotkar
ekinci	cotkar
dil bilgisel	rêzimanî
gramatikal	rêzimanî
methaldar	têkildar
alakalı	eleqedar
iş birliği	hevkarî
meslektaşlık	hevkarî
bindi	destek
yâr olmak	alîkarî kirin
musiki	muzîk
hususiyetle	bi taybetî
spesiyalite	taybetî
büyük çuval	xasî
ana vatan	war
göçelge	war
konalga	war
sıla	war
aktivizim	çalakî
başkesit	fêris
aznavur	xedar
ölmezoğlu	saxlem
sağlamcı	saxlem
şaman#tirkî	saman
ana para	sermiyan
yer yuvarlağı	cîhan
yer yuvarı	cîhan
insanlar	xelk
mazhariyet	gihiştin
muvasalat etmek	gihiştin
nail olmak	gihiştin
varılmak	gihiştin
vasıl olmak	gihiştin
vusul bulmak	gihiştin
kemale ermak	gihiştin
tekamül etmek	gihiştin
erme	gihiştin
iktiran	gihiştin
varılma	gihiştin
vusul	gihiştin
vasıl	gihiştin
vuslat	gihiştin
ıl	reng
tüs	reng
benzi uçmak	reng avêtin
sararıp solmak	reng avêtin
rengi bozulmak	reng dan
benzi geçmek	reng jê çûn
nite	çito
yaşayışlı	jîndar
çangal	girik
hamur yumağı	girik
üçüz	sewik
topçuk	girover
gır	laqirdî
klik	bend
bizlengiç	zext
üvendire	zext
yıldırıcı	terorîst
bahşiş	bexşîş
son takı	dawîng
uzun yaşamak	emir kirin
ömrü uzamak	emir kirin
fermuar	ferman
ölüm fermanı	ferman
buyruk	ferman
yarlık	ferman
buyrultu	ferman
buyuru	ferman
gazyuvarı	atmosfer
hava küre	atmosfer
hava yuvarı	atmosfer
kırpma makası	cew
şiddetli kuru soğuk	seqem
keskin ve soğuk ayaz	seqem
çıkak	jêder
çıkıt	jêder
çıkan	jêder
asılmış	daliqandî
balast	riste
korkulu rüya	kabûs
o denli	wilo
abece	alfabe
halayık	cêrî
buğur	lok
hoşaf	xoşav
komposto	xoşav
pekmez suyu	doşav
kail olmak	qayil bûn
kanıklanmak	qayil bûn
dol	kinêt
çiftlik hayvanı	sewal
küçük baş	sewal
keçiler	sewal
evcil hayvanlar	terş
tös	terş
reddolunmak	red bûn
tamam olmak	red bûn
beşaret	mizgîn
muştu	mizgîn
müjde	mizgîn
müjdelik	mizgîn
sava	mizgîn
muştuluk	mizgîn
kitab-ı mukaddes	incîl
incil	incîl
tabir etmek	şirove kirin
tefsir etmek	şirove kirin
basın toplantısı	civîna çapemeniyê
matbuat	çapemenî
basın	çapemenî
medya	medya
selen	xeber
bayramlık ağız	dijûn
cudam	bêhêz
takatsiz	bêhêz
çığalalanmak	rep bûn
kalkma	repbûn
yollama	birêkirin
irsal	birêkirin
postalama	birêkirin
teşyi	birêkirin
geri yollamak	birêkirin
vardırmak	gihandin
erginleme	gihandin
isal	gihandin
haydi sende	tew
irfanına turp sıkayım	tew
hayret ve şaşkınlık belirten bir ünlem	tew
ispiyonlamak	vedan
tedeni	ketin
talim etmek	perwerde kirin
fahri	rûmet
izzetinefis	rûmet
bağı	rêz
çakıl taşı	xîç
küldöken	bermalî
ev şenliği	pîrek
ev bireyleri	kuflet
hayat arkadaşı	kuflet
kadağa	qedexe
menolunmak	qedexe bûn
yasak olmak	qedexe bûn
yasaklanmak	qedexe bûn
yasak etmek	qedexe kirin
menolunma	qedexebûn
yasaklanma	qedexebûn
menetme	qedexekirin
yasaklama	qedexekirin
haram etmek	herimandin
müteaffin	genî
kokmuş	genî
kokuşmuşluk	genî
sası	genî
sasımak	genî bûn
taaffiin etmek	genî bûn
taaffün etmek	genî bûn
kokutmak	genî kirin
minder çürütmek	genî kirin
intan	genîbûn
kokuşma	genîbûn
sasıma	genîbûn
kokutma	genîkirin
içeri	hindir
içre	tê de
bunda	tê de
içine	di ... ve
çıkma durumu	jê
müdavim	jê
tendon	jê
her ikisi	herdu
ikisi	herdu
her defa	hergav
her an	hergav
sürekli olarak	hertim
her daim	hertim
met	avrabûn
erivan	êrîvan
meydanlık	gorepan
dalına basmak	behecandin
gıcık etmek	behecandin
sinirlerini bozmak	behecandin
vücut bulmak	çêbûn
yapılaşma	çêbûn
yapılma	çêbûn
faaliyete geçmek	saz bûn
yapılaşmak	saz bûn
işler duruma getirmek	saz kirin
düzenleşmek	sazbûn
kurulum	sazkirin
kısa film	kurtefîlm
andırmak	şibîn
öd kanalı	ûd
kara yer	mezel
yukarıya	jor
eyvah	wax
vah	wax
vay	wey
pöf	ey
dinleyici	guhdar
katakofi atmak	peqandin
halhal	xirrxal
şşş	hiş
höst	hoş
kuvvetle	hiş bûn
vahit	tek
yeise kapılmak	tek
bir el	tek
sayfa	rûpel
tahrirî	nivîskî
yazı dili	nivîskî
yazıyla	nivîskî
volân	nivîskî
tavsamak	sist bûn
hızını kaybetmek	sist bûn
hızını yitirmek	sist bûn
tavsatmak	sist kirin
gevşetme	sistkirin
uçkuruna düşkün	doxînsist
kasık bağı	doxîn
aşağı inmek	daketin
münhani	xwar
abaşo	xwar
boynunu bükmek	xwar bûn
yan yatmak	xwar bûn
saye salmak	xwar bûn
sıçan kırı	boz
süt kırı	boz
kırçıllaşma	bozbûn
kırlaşma	bozbûn
sarpın	çal
göz pencere	taq
serin	hênik
şirk	hevber
nene	dê
valide	dê
acak	dê
ecek	dê
acele et	dê
dahilinde	dê
ünlü harf	dengdêr
ağız ünlüsü	dengdêr
yürekten	jidil
kalpten	jidil
sargın	jidil
salmaklı	cidî
ciklet	benîşt
hırtlamba	peregende
meltem	bahor
üzüntü verici durum	mixabinî
daş	hem
daş, taş	hem
varsın olsun	hema
anide	hema
şöyle bir	hema
darı darına	hema hema
eli kulağında	hema hema
ucu ucuna getirmek	hema hema
bununla birlikte	herwiha
kökcük	rîşe
ar-ge	kurte
eu	eu
papura	kotan
pulluk	kotan
kaçılmak	revîn
zamk etmek	revîn
gazlamak	revîn
zamkinos etmek	revîn
hani ya	kanê
ne demeye	cire
delinmiş	kunbûyî
mirza	mîrza
mösyö	mîrza
sinyor	mîrza
paha biçilmez	bihagiran
katib	debîr
muallim	mamoste
keyfi gelmek	şên bûn
abat olmak	şên bûn
tarh etmek	sepandin
müşkülat	zorî
geziş	geşt
kekre	mîr
aile reisi	malxwê
eklenti	pêvek
ferişte	melek
maskesini kaldırmak	niximandin
setretmek	niximandin
kamuflâj	niximandin
setretme	niximandin
evcimen	hêgin
senato	senato
meclis üyesi	qanûndaner
dirileşmek	geş bûn
ölçermek	geş kirin
dirileşme	geşbûn
kendi	xwe
tuz	xwe
kışkırmak	qîrîn
konforlu	rehet
kalfa	şagirt
yamaç yamak	şagirt
yamak	şagirt
aydınlamak	fêrbûn
öğrenme güçlüğü	fêrbûn
plaçka	talan
doyumluk	talan
iğtinam	talan
çapullamak	talan kirin
talan etmek	talan kirin
talanlamak	talan kirin
öğütlemek	şîret kirin
çökertmek	ruxandin
anırma	zirrîn
anırmak	zirrîn
zırıldama	zirrîn
zırıldanma	zirrîn
zırıldanmak	zirrîn
zırlamak	zirrîn
cesaretlenip harekete geçmek	bizivîn
mobilize olma	bizivîn
tepki gösterme	bizivîn
tınma	bizivîn
yiğitlenme	bizivîn
yiğitleşme	bizivîn
cüretlenme	bizivîn
saz şairi	hozan
yada	şehr
dolambaz	çîvanok
menkıbe	çîrçîrok
halk dili	gelêrî
halka dair	gelêrî
bu defa	îcar
bu kez	îcar
i̇ranlı	îranî
sako	saqo
kaput	qapût
ak benek	leke
çırpıştırma	çirpandin
tırtıklama	çirpandin
ihtilâs	çirpandin
öte beri	hûrûmûr
çıldırasıya	zaf
gırla	zaf
bir dolu	mişe
geçip gitme	viritîn
sona erme	viritîn
yıkıma doğru gitme	viritîn
mürur etme	viritandin
sona erdirme	viritandin
un ufak hale gelmek	herifîn
un ufak hale getirmek	herifandin
zıkkımlanma	kerifîn
zıkkımlanmak	kerifîn
kızıltepe	qoser
mardin	mêrdîn
dışkılamak	rîtin
dışkılama	rîtin
işeme	mîstin
aptesthane	destavxane
kenef	tiwalet
asudeleşmek	asûde bûn
adab	edeb
muharrer	nivîsandî
saydırma	jimartin
um	im
düdüklemek	fisandin
dipdinç	sirpîsax
dipdiri	sirpîsax
sapasağlam	sirpîsax
kara çam	sirb
avrupa	ewropa
kutsal yer	pîrozgeh
şömiz	kiras
hâlsiz	lawaz
arıklamak	lawaz bûn
arıklaşmak	lawaz bûn
arıklatmak	lawaz kirin
kurdela	laçik
esvap	kinc
pazvant	pasevan
rasatçı	nêrevan
bakıcı	nêrevan
oruç	rojî
oruç tutmak	rojî girtin
oruç bozmak	rojî şkandin
ismet	diristî
hisse sahibi	hevpar
otacı	hekîm
boşamak	berdan
falya	berdan
terhis	berdan
inan	bawer
inanan	bawer
güvenen	bawer
muhammed	mihemed
muhammet	mihemed
muhammed peygamber	mihemed
ömer	umer
ikinci	duyem
üçüncü	sêyem
asya	asya
pişdar	pêşeng
kervanbaşı	pêşeng
peşrev	pêşrew
eslaf	pêşrew
latince	latînî
burgulama	qulkirin
burgulamak	qulkirin
cıs	bive
sakin ol!	bive
siyasi parti	partî
partça	partî
düze	doz
mefkure	doz
yanıp yakılmak	gazin kirin
şekva	şikayet
ayak prangası	qeyd
keşen	qeyd
bukağı	qeyd
kal	qal
kama basmak	qal kirin
çakıntı	vejen
bomba gibi	zexim
kazulet	zexim
devlet memuru	karmend
buyrulan	fermanber
buyruğa uyan	fermanber
barı	senc
şemail	rewişt
aktöre	exlaq
üstad	hoste
kalifiye	hoste
sıfır numara	hoste
tek durmak	tebitîn
kıbrıs	qibris
akdeniz	deryaya navîn
bendeniz	ezbenî
abdiaciz	ezbenî
furya	qiyamet
mevize	pend
eşek palanı	kurtan
asma bıyığı	tûrik
telis	telîs
kanaviçe	telîs
öylesine	jixwe
haliyle	jixwe
karmaç	tevdîr
çırpıcı	tevdîr
mikser	tevdîr
alevi	elewî
miyav miyav	newnew
tazelenmek	taze bûn
tazelenme	tazebûn
çet elli	biyanî
elgin	xerîb
namahrem	xerîb
eşlik	hevalî
kirve	kirîv
vaftiz babası	kirîv
nedim	hogir
kafadar	hogir
rüfeka	hogir
dinlence	betlane
öğürtme	borandin
öğürtmek	borandin
intikal etme	derbas bûn
aşırtmak	derbas kirin
dona kalmak	mat
hayran kalmak	mat
şaşa kalmak	mat
matlaşmak	mat bûn
matlaştırmak	mat kirin
matlaşma	matbûn
matlaştırma	matkirin
flamingo	flamîngo
flaman kuşu	flamîngo
göbelez	cewrik
büyük balık	cewr
sadakâtsiz	xaîn
satkın	xaîn
iştigal etmek	bilîn
uğraşı	bilîn
katiyen olmaz	qet
zerre kadar	qet
dızdık	çik
baston gibi	çik
dığdık	çik
şerare	çik
zarp	çik
nefesi kesilmek	çik bûn
gâvur	gawir
andırımcılık	şibî
inzivaya çekilme	xewle kirin
halvete çekilmek	xewle kirin
kon gövde	qol
aksam	bîr
koyun ve keçi sürüsü	bîr
anadut	melêb
birlikte davranış	tevger
bildirme	beyan
sis perdesi aralanmak	beyan bûn
roma	rom
bizans	rom
çelmelemek	werqilandin
boynuna geçirmek	asê bûn
üstüne oturmak	asê bûn
üstüne yatmak	asê bûn
zefa	sefa
boş gezenin boş kalfası	aware
kaldırım mühendisi	aware
avare etmek	aware kirin
dalatmak	dirandin
cıyırdama	çirîn
cıyırdamak	çirîn
emotional	hestî
et	goşt
lens	çavik
kapelâ	şewqe
cıda	rim
mızraklı	rim
sıcak	germ
sıcaklaşmak	germ bûn
kanı ısınmak	germ bûn
sıcaklaştırmak	germ kirin
teshin etmek	germ kirin
sıcaklaşma	germbûn
sıcaklaştırma	germkirin
teshin	germkirin
germen	kel
kele	kel
kale gibi	kel
taşım	kel
taşımlık	kel
hind horozu	kel
dikili taş	kel
düvesimek	kel bûn
muş	mûş
fince	fînî
münazara	gengeşe
müfret	yekjimar
aryan	arî
ari	arî
avans	hizir
göz kararı	hizir
çimke	ders
sebak	ders
meşk vermek	ders dan
takrir etmek	ders dan
valf	wane
vana	wane
yortmak	bazdan
boğa	ga
mim	mim
siyahlatmak	reş kirin
siyahlanmak	reş bûn
siyahlatma	reşkirin
karışka	mûrî
komursga	mûrî
adamcağız	merîk
telef olma	telifîn
istihlâk	birandin
soyunu kurutmak	birandin
iğdiş etmek	birandin
hatun	xanim
meşe palamudu	belot
palamut	belot
pelit	belot
domalmış	belot
kâğıtcık	kaxezk
firavun	fîrewn
şirret	hetik
erdiğine erer eremediğine taş atar	hetik
suyunu kurutmak	miçiqandin
suyunu çekmek	miçiqandin
sırça	cam
çıpı çıpı	şoşo
köpek sürüsü	revde
küçük baş hayvan sürüsü	kerî
giriz	gilîz
ifraz	gilîz
ödem yapma	perçivîn
ödemleşmek	perçivîn
geçtirmek	perçivandin
genleştirme	perçivandin
genleştirmek	perçivandin
ödem yapmak	perçivandin
marmara çırası gibi yanmak	perîşan bûn
ıslak kargaya dönmek	perîşan bûn
perişan etmek	perîşan kirin
per perişan	şerpeze
sürüm sürüm sürünmek	şerpeze bûn
rüsva olmak	riswa bûn
rüsva etmek	riswa kirin
nahak	neheq
gıybet	seb
kuvars	seb
yayınlanmak	weşîn
saçalanma	weşîn
yayınlanma	weşîn
mukemeliyet	xwezî
öykünme	xwezî
günahkâr	gunehkar
suç işleyen	tawankar
tövbe	tobe
tövbe etmek	tobe kirin
günahlarından soyunmak	tobe kirin
tövbeli	tobekirî
yemin etmek	sond xwarin
yemin içmek	sond xwarin
and içmek	sond xwarin
iğfal etmek	xirandin
kandırış	xirandin
tavlama	xirandin
aklını çelmek	xirandin
adımını attırmamak	xistin
vazetmek	xistin
vaz	xistin
cebin	tirsonek
riskli	xeternak
dokunca	zerer
adagio	hêdîka
yavaşça	hêdîka
usuldan	hêdîka
yavaşça­cık	hêdîka
eser sahibi	daner
gezgin satıcı	etar
dolaştırma	gerandin
çalınga	duçerxe
velespit	duçerxe
derrace	duçerxe
düçerha	duçerxe
ergani	erxenî
erganili	erxenî
hüzme	tîroj
acılatmak	tûjkirin
paprika	îsot
tütün	tûtin
inişli	berjêr
yukarı doğru	berjor
mushaf	mishef
zerdüşti	zerdeştî
mecus	zerdeştî
mecusilik	zerdeştî
zerdüştlük	zerdeştî
müzelik	kevnar
yıllanmış	kevnar
i̇spanyolca	spanî
ispanyol	spanî
masa	mase
ordövr	mêze
gözle yemek	mêze kirin
erkenci	hilî
avlanma	nêçîrkirin
sek	xwerû
iklimsel	siriştî
kırmanç	kirmanc
tazı	tajî
av köpeği	tajî
portakal	pirteqal
bulgur	savar
bulgur pilavı	savar
yoğurt çorbası	girar
akşamdan kavur sabaha savur	destbelav
gak	qir
haykırı	qir
hazzetme	hezkirin
ibate etmek	hewandin
koşun bağlamak	rêz bûn
iplemek	rêz girtin
saygılı olmak	rêz girtin
fantasma	sepet
kazevi	zembîl
zembil	zembîl
meyve suyu	şerbet
sücü	mey
sermest	mest
keyif hâli	mest
körkütük	mest
çakıştırmak	mest bûn
sermest olmak	mest bûn
sermest etmek	mest kirin
südreme	mestbûn
limit	hed
uyarım	temî
dang	pêsîr
amansız hastalık	şêrpence
incitme beni	şêrpence
kızıl yara	şêrpence
afrika	afrîka
gezdiriş	gerîn
arabalık	garaj
garaj	garaj
tüfek	tifek
çiyin	mil
matkap ucu	mil
mil çekmek	mil
peni	pîne
ayakkabı altı	pîne
yamamak	pîne kirin
yamama	pînekirin
şap hastalığı	şewb
selatin	sultan
köskelmek	pal dan
abanmak	paldan
pamuk bezi	caw
bezirgân başı	caw
koyun derisi	kevl
başlık parası	qelen
soğan	pîvaz
addetmek	hesibandin
celpetme	kişandin
kantara çekmek	kişandin
tüttürmek	kişandin
keşide	kişîn
ahmak ıslatan	xunav
çilentî	xunav
çise	xunav
adisyon	hesab
hesap kitap etmek	hesab kirin
bikini	bîkînî
iç donu	derpî
pijama	pîjame
dikkati nazara almak	berçav kirin
göz önüne almak	berçav kirin
oyulga	sêl
iğne ardı	sêl
pişim	pêjan
pişiriliş	pêjan
ızgara yapmak	biraştin
kebap yapmak	biraştin
pişiriş	biraştin
gaipten gelen ses	pêjn
otel	otêl
konakçı	otêl
han	xan
tırsmak	bizdîn
algılatmak	serwext kirin
bilgi sahibi etmek	serwext kirin
düzyazı	pexşan
düz yazı	pexşan
sanatsal	hunerî
örge	nîgar
i̇branice	îbranî
geriye doğru	paşve
risale	namilke
muhabere etmek	ragihandin
iblâğ	ragihandin
car etmek	îlan kirin
maruz kalma	ducarî
ince ince	nexş
konç	saq
külrengi balıkçıl	saq
ayak bileği	gozek
bahar pınarı	avzêl
kantaron	talî
ikincil	talî
başta	pêşî
sirken	şilk
kocabaş	şilk
culuk	elok
don yağı	don
katı yağ	don
taş yağı	don
çerviş	don
içyağı	don
gala	gala
boş söz	tewş
vahi	tewş
grado	pile
ermeni	ermenî
alamet	nîşan
işaretlemek	nîşan kirin
nişan takmak	nîşan kirin
kist	kîs
şah çekme	kîs
ağdalanmak	tîr bûn
ağdalaşma	tîrbûn
estonya	estonya
göç	koç
göç etmek	koç kirin
hicret etmek	koç kirin
muhaceret etmek	koç kirin
perde	perde
sikişme	niyan
sikme	niyan
yassılmak	pan bûn
düzleştirilmiş	pankirî
yassılaştırılmış	pankirî
genişletilmiş	pankirî
değdirme	lêxistin
kötek atmak	lê xistin
kutan	lê xistin
toslamak	lê xistin
vurgun vurmak	lê xistin
vurgunu vurmak	lê xistin
tambur	tembûr
yalayış	alîstin
sağdırma	doşîn
hallolmak	hel bûn
işi temizlemek	hel kirin
neşter vurmak	hel kirin
temize havale etmek	hel kirin
salıncak sallamak	hel kirin
yüz göz	serçav
ağırtmak	arandin
şiddetli sancı	arîn
ağırmak	arîn
sancılanmak	aran
aşiret	êl
süt kızı	ewlad
süt oğul	ewlad
zifir	zarrûzêç
döl döş	zarrûzêç
karısı kurusu	zarrûzêç
yeğnilmek	sivik bûn
çiçek olmak	sivik bûn
tahfif etmek	sivik kirin
yeğniltmek	sivik kirin
hafifleme	sivikbûn
yeğnilme	sivikbûn
yeğniltme	sivikkirin
hacı	hecî
her kim ki	hecî
gelince	hecî
düğümlük	hecî
mekke	mekeh
el bezi	desmal
el havlusu	desmal
yılan gömleği	kaj
elmas	elmas
almas	elmas
pornografi	pornografî
porno	pornografî
tosun	canega
g	bş
cevher	gewher
gevher	gewher
töz	gewher
turfa olmak	rizîn
paraya para dememek	rijandin
üfürük	pif
püf	pif
püfkürmek	pif kirin
nefse etmek	pif kirin
nefes etmek	pif kirin
nefesleme	pifkirin
püfleme	pifkirin
nefeslemek	pifkirin
püflemek	pifkirin
puf	puf
ödem yapmış	perçivî
şişik	werimî
kulüp	yane
zıngadak	zing
tiz	zîl
ayak otu	zîl
dığdığının dığdığı	zîl
arı iğnesi	zîl
kamışçık	zîl
kiliz	zîl
kofa	zîl
çer	qirş
sulu sepken	şilope
karla karışık yağmur	şilope
mahlût	têkil
muhtelit	têkil
karışmış	têkil
katışma	têkilbûn
kar suyu	lûlav
bulut	ewr
savruntu	berba
höt	hût
mai	avî
kiralık tutmak	bi kirê girtin
derilmek	berhev bûn
fitne fücur	berhevdan
dergin	berhevbûyî
devşirimli	berhevkirî
yekün	berhevkirî
dördün	çarêk
dımıli	dimilî
ikizli	dimilî
dümbüllü	dimilî
dümbüllü ile ilgili	dimilî
zaza ile ilgili	dimilî
buçuk	nîv
yöneltim	araste
ita	dayîn
kuşantı	girêdan
gaz ocağı	papor
gazocağı	papor
elif	elîf
ergene	kan
hayata dönmek	vejîn
dirilme	vejîn
yeniden dirilmek	vejîn
yeniden can bulma	vejîn
başlama	destpêkirin
el çekmek	dev jê berdan
rotayı değiştirmek	dev jê berdan
arkasını bırakmak	dev jê berdan
oluruna bırakmak	dev jê berdan
ferağ	devjêberdan
diplomat	dîplomat
faraziye	saw
zikzag	çîv
ay ağılı	şiwan
sayeban	şiwan
güneş şemsiyesi	şiwan
ömrü billâh	ticar
ömründe	ticar
canını bağışlamak	efû kirin
yarlıgamak	efû kirin
mümessil	nûner
esnaf	esnaf
garnitür	xeml
sükûnet	hizûr
savak	şikir
küçük baraj	şikir
şükür etmek	şikir kirin
kütin	kutan
akson	tewere
korordinatlar	tewere
koordinat	tewere
yeryüzü	zemîn
suudi arabistan	erebistana siûdî
arabistan	erebistana siûdî
konfor	rehetî
üşürmek	hêwirandin
ıslamak	sil kirin
tükürüklemek	sil kirin
ıslatış	silkirin
tükürükleme	silkirin
ıslama	silkirin
çağa	pitik
yavrucuk	pitik
yurtlandırmak	bi cih kirin
kardeşcik	birak
bilader	birak
dibek kolu	destik
ekol	rêbaz
metod	rêç
umde	prensîp
kozmopolit	kozmopolît
mülâkat	hevpeyivîn
cizre	cizîr
şırnak	şirnex
i̇ngilizce	îngilîzî
eğilimli olmak	dil pê ve bûn
meyletme	dilpêvebûn
ambale etmek	mandî kirin
münezzah	art
batur	mêrxas
misafir odası	koşk
selamlık	koşk
şiir defteri	dîwan
cönk	dîwan
ayazlık	eywan
eyvan	eywan
büyük geniş oda	eywan
falso	xeta
falso yapmak	xeta kirin
acemilik	ecemîtî
istilacılık	dagirkerî
gergi	îşk
toyaka	îşk
sıkma, düğümleme, bağlama	îşk
ügür	garis
yabani buğday	genimok
lazut	lazût
buğday	genim
arpa	ceh
kızışmış	telew
kösnük	telew
dalap olmak	telew bûn
korkup şaşırmak	veciniqîn
şaşıp kalmak	veciniqîn
halep	heleb
halepçe	helebçe
anırış	zirr
öz olmayan	zirr
yaban maydanozu	zûr
ceriha	kul
kurbağa	beq
soğan gelinciği	boq
arğ	kend
çoban yamağı	dûajo
yardımcı çoban	dûajo
kara parçası	bejayî
susuz (tarla)	bejî
toklu	kavir
balkımak	çirisîn
kaçırış	revandin
hollandaca	holendî
hollandalı	holendî
sekizinci	hestem
solist	solîst
solocu	solîst
haram olmak	herimîn
eflâk	felek
filenk	felek
merek	kadîn
samanlık	kadîn
ambarı	kadîn
buzağı	golik
halt etmek	xax kirin
istifra etmek	vereşîn
kusuntu	vereşîn
kokusu sinmek	bêhnvedan
ellik	lepik
nazir	manend
hunerli	jêhat
çevrimli	jêhatî
bası	çap
kalibre	çap
yarımlık 1	çap
yarımlık	çap
şiniklemek	çap kirin
tabetmek	çap kirin
kamusal	gelemperî
matbu	çapkirî
şinikleme	çapkirin
tabetme	çapkirin
betlek	defter
yazı odası	nivîsgeh
yazıhane	nivîsgeh
tahammuz	tirşbûn
ekşili	tirşkirî
sütun başlığı	kil
abandırmak	kilkirin
öngörülü	berbûn
koşuntu	pegir
yayılarak oturma	pelaş
ümmet	umet
ulûm	ilm
federal	federal
din adamı	qeşe
sevgi dolu	dilovan
serilip yatmak	ramedîn
uzandirmak	ramedandin
cücüklenme	zîldan
filiz vermek	zîl dan
cücüklenmek	zîl dan
afrikanca	afrîkansî
afrikaans	afrîkansî
afrikaner	afrîkansî
berrakıık	zelalî
bronz gibi	qemer
esmerlik	esmer
erkek çocuk	gede
tekmeleme	zîtik
hayvan tekmesi	zîtik
i̇sveççe	swêdî
i̇sveçli	swêdî
danca	danmarkî
danimarkalı	danmarkî
danimarka	danmarka
demlemek	dem kirin
demlendirmek	dem kirin
demleme	demkirin
demlendirme	demkirin
kadı	qazî
islâm hukuku	şerîet
şeriat	şerîet
islim	dûkêl
istim	dûkêl
portekizce	portugalî
velev	welew
iskandil	lot
canrüba	dilber
lüfer	luxet
geleme	beyar
cebel	beyar
bozca	beyar
nadanlık	nezanî
hikâyeleme	vegotin
koni	kon
mahrut	kon
çadır açmak	kon
elifi elifine	tam
domuzuna	tam
iyicene	tam
ibrişim	hevrîşim
ipekten yapılmış olan	hevrîşimî
yaçın	fotograf
mezat	mezad
açık artırma	mezad
inkıbaz	keder
acibe	ecêb
klâs	sinif
sabi	sebî
vazıhamil	welidandin
açıkta	kifş
gözü kara	çavsor
gözü kan bürümüş kişi	çavsor
anı yazısı	bîrname
hemşeri	hemşerî
cihat	cîhad
ceht	cehd
hani	tema
toynak	sim
sırma	sim
şıpıdık	sim
savaş topu	top
top#turkish	top
davetkâr	dawetker
semah	sema
bal mumu	sema
otamak	tedawî kirin
nalça	nalçe
herhalda	île
illâ	île
ilâ	île
yanardağ	volkan
anüs	zotik
kalın bağırsak ucu	zotik
kok kömürü	kok
uyuşan	kok
sakal bırakmak	rî berdan
ırz	namûs
bedii	bedewî
güzel duyu	bedewî
latafet	bedewî
bedevi	bedewî
bedevilik	bedewîtî
göçebelik	koçerî
yürüklük	koçerî
göçer konar	koçerî
muhaceret	koçberî
mütalaa	ray
öyle uygun görmek	ray dan
görüş bildirmek	raydan
hattıhareket	helwest
durum almak	helwest girtin
tavır almak	helwest girtin
vaziyeti takınmak	helwest girtin
çok derin uyku	temar
biraderlik	biratî
rakım	bilindahî
irtifa	bilindahî
büyüklük	mezinahî
kada	qeda
ehliyet#tirkî	ehliyet
uzluk	ehliyet
dışlanmış	veder
adósság	qer
ikraz etmek	bi deyn dan
ödünç vermek	bi deyn dan
veresiye vermek	bi deyn dan
eğreti vermek	bi deyn dan
kutlulamak	pîroz kirin
bilimci	zanyar
kara kitap	zanyar
zenginleşmek	dewlemend bûn
hayda	ho
po	po
hububat	dexl
depozito	pey
tafra	fort
örgen	organ
limited	mehdûd
gönençli	miferih
boy göstermek	xuya bûn
sadır olmak	xuya bûn
yüz göstermek	xuya bûn
perestiş	periştîş
haham	xaxam
rabbi	xaxam
üleştirim	parvekirin
köy korucusu	cerdevan
tarla faresi	cird
büyük fare	cird
patriyark#tirkî	patriyark
geçek	bor
su geçiti	bor
içi geçmek	bihirîn
aldatmaca	xap
gaz	gaz
tal	gaz
akıcı olmak	rohn
sıvılaşmak	ron bûn
seyreltilmek	ron bûn
seyreltilme	ronbûn
ışıklama	ronkirin
seyreltik	ronkirî
giro	gîro
fransalı	fransî
fransızlar	fransî
kuzey kore	koreya bakur
içerlenmek	qehirîn
mahzun olmak	xemgîn bûn
bedbaht olmak	xemgîn bûn
mahzunlaşmak	xemgîn bûn
mahzun etmek	xemgîn kirin
meyus etmek	xemgîn kirin
bir hoş eylemek	xemgîn kirin
tornistan	vajîkirin
parya	serserî
ipi kırık	serserî
dal taban	serserî
maganda	serserî
tefekkür	hizirîn
tefekküre dalmak	pûnijîn
derin derin düşünmek	pûnijîn
pis pis düşünmek	pûnijîn
derin düşünmek	pûnijîn
ağır işiten	guhgiran
ısın	tînî
kar kuyusu	zandor
karlık	zandor
bilezik	bazin
acı verici	êşdar
çıkıkçı	cebar
kırıkçı	cebar
sınıkçı	cebar
işletmen	operator
ameliyat etmek	emeliyat kirin
koşmaca	bîre
kırkma makası	hevring
koyun kırkma makası	hevring
çince	çînî
çinli	çînî
mavilik	sînî
sünni	sînî
el altında bulunmak	berdest bûn
kahve rengi	qehweyî
kahve	qehwe
çikolata	çoklata
çimen adaçayı	çoklata
kuzey amerika	amerîkaya bakur
güney amerika	amerîkaya başûr
latin amerika	amerîkaya latînî
orta amerika	amerîkaya navîn
karasinek	vizik
yanal	belek
kar lekesi	belekî
alacalık	belekî
amnios suyu	pila
masat	mevred
maş	maş
maş fasulyesi	maş
baklava	beqlawe
protesto#tirkî	protesto
utandırılmak	şermezarbûn
tayip	şermezarkirin
zemmetme	şermezarkirin
kara yüzlü	rûreş
yüzü kara	rûreş
tekessür etmek	pîr bûn
tezyit etmek	pîr kirin
töskürtmek	pîr kirin
eskimek	kevn bûn
miadını doldurmak	kevn bûn
eskime	kevnbûn
kadük	kevnbûyî
ezel	mêj
istidlâl	dêrîn
depar	dêrîn
kırılış	şikîn
tan yeri	elind
fida	fîda
ruh#tirkî	ruh
ervah	ruh
bal kabağı	kulind
pehpehlemek	bilind kirin
beş kuruş	çerx
çark	çerx
dönen	dewr
hemen-hemen	teqrîben
üç aşağı beş yukarı	teqrîben
nevbet	nobe
kettle	qazan
ketıl	qazan
su ısıtıcısı	qazan
kuşane	qûşxan
nazariye	teorî
nazariyat	teorî
torun çocuğu	nevîçirk
torunun torunu	nevîçirk
ses sanatkârı	dengbêj
komiser	komîser
hercümerc	tevlihev
birbirine karıştırmak	tevlihev kirin
karmaştırmak	tevlihev kirin
suyu bulandırmak	tevlihev kirin
çıkmaza girmek	tevlihev bûn
kazan kaynamak	tevlihev bûn
katıştırma	tevlihevkirin
teşviş	tevlihevkirin
ucu çengelli değnek	çelak
kızamık	sorik
yumruk kadar	pizik
kagir	qesr
şvester	hemşîre
striptiz	striptîz
başta gelen	sereta
devamı	dûmahî
sürdürüş	domandin
çınar	cînar
hamsi	hemsî
göreceli	goranî
ıstifa	bijartin
seleksiyon	neqandin
debug	neqandin
ayırıp çıkarmak	neqandin
fiyat biçmek	nirxandin
istimara	nirxandin
hatırlama	çile
tezekür	çile
yürek darlığı	kovan
pesleşme	nizmbûn
ayak işi	suxre
baştan kalmış	xizmetkirî
sap yükü	sixre
antrenor#tirkî	antrenor
peynir	penîr
erimcik	penîr
kar tanesi	kulî
tamtam	def
kırmızı ayaklı kara buğday	mastêrk
yoğurt sözgeci	mastêrk
kadehçik	kov
konkav	kov
içbükey	kov
topur	kov
pb	pb
boykot	boykot
boykot etmek	boykot kirin
iştirakçı	beşdar
müşterekçi	beşdar
şayet	şayed
perestroyka	perestroyka
fiçi	warîl
makyaj#tirkî	makyaj
süzgünleşmek	melûl bûn
süzgünleşme	melûlbûn
ruj	sorav
kırmızılaşmak	sor bûn
kızıllaşmak	sor bûn
sarkılmak	sor bûn
kırmızılaştırmak	sor kirin
kırmızılaştırma	sorkirin
erişen	baliq
arı kümesi	baliq
değirmen	aş
birli	aş
öğütmek	hêran
öğütme	hêran
leşker	artêş
baldan	hingivîn
bekçi kulubesi	şane
tarak vurmak	şe kirin
taranma	şe kirin
meful	kirî
almış	kirî
fasih	fesîh
ezber etmek	ezber kirin
hafızlamak	ezber kirin
ezberden	ji ber
itap etmek	berê xwe dan
kalafata çekmek	berê xwe dan
zılgıt yemek	berê xwe dan
seyrettirmek	mêzandin
şaha kalkma	pîkol
şampuan	şampo
halaç yayı	kevan
mutariza	kevan
esiş	wezin
gram	gram
alafranka	firingî
tahrif olmak	ruxîn
saçılıp dökülmek	weşandin
saçıp savurmak	weşandin
ilan etmek	weşandin
yayınlama	weşandin
iğ	teşî
cehre	teşî
öreke	teşî
oklu	teşî
eğirmen	teşî
iğlik	teşî
kemençe	kemançe
alaca bulaca	fîq
alacalı bulacalı	fîq
viking	vîkîng
hayran olmak	heyran bûn
c. g. s	c
di	d
ti	d
du	d
sestaş	hevdeng
eşsesli	hevdeng
kiril	kirîlî
kiril alfabesi	kirîlî
ton#tirkî	ton
tonilâto	ton
ton	ton
kulunc	qolinc
halüsinasyon	şipeste
varsam	şipeste
yer çekimi	rakêş
arz cazibesi	rakêş
albumin	spîk
besi dokusu	spîk
hepatit	zerik
zerde	zerik
relativizm	rêjeyîtî
robot	robot
ğ	x
ithal etmek	îdxal kirin
talak	telaq
güman	guman
kan davası	xwîndarî
jüri	jurî
hakem heyeti	jurî
minimal	mînîmal
ebat	ebad
küçültücü	biçûkker
demin	aniha
demincek	aniha
ekip	ekîb
atelye	atolye
defile	dêfîle
padişa	efendî
enbiya	enbiya
aman derim!	nebî
kenar#tirkî	kenar
ücra	kenar
seyit	seyid
vatikan	vatîkan
azerbaycanlı	azerbeycanî
iştiyak duymak	bêrî kirin
arılamak	bêrî kirin
hasret çekmek	bêrî kirin
göresime	bêrîkirin
özleme	bêrîkirin
arılama	bêrîkirin
özlentili	bêrîkirî
gürcü	gurc
müebbet	miebed
tsunami	tsunamî
ölmez	herheyî
puluç	nemêr
ananet	nemêr
erkekte cinsel iktidarsızlık	nemêr
hangisi	kîjan
neresi	kîjan
hare	xirnîfk
halvet	xilwet
halvethane	xilwet
inziwa yeri	xilwet
denizkızı	avîvan
animasyon	anîmasyon
yaşayan	zindî
canlı yayın	zindî
muaşeret	rawêj
mesuliyetli	berpirs
satrap	walî
koruncak	mihafize
çintiyan	derling
geri döndürmek	zivirandin
saman yolu	bûka baranê
iki büklüm olmak	qoz bûn
iki kat olmak	qoz bûn
tiryak	tiryak
keyif verici maddeler	tiryak
kıskanç olmak	hesûd bûn
reorganizasyon	reorganîzasyon
organize	organîze
şüpheye düşürmek	şik
kuşkuya düşmek	şik
şüpheye düşmek	şik
kaknem	şik
ukubet	şik
galiz	şik
işkillenmek	şik birin
şüphe etmek	şik birin
nem kapmak	şik birin
sanısına kapılmak	şik birin
çepeçevre	hawirdor
ihlâl etme	îxlalkirin
bülbül	bilbil
tenor	tenor
tennure	tenore
belden aşağı	dawên
palan kemeri	navteng
dalış	noq
denizaltı	noq
deniz altı	noq
tahtelbahir	noq
istiğrak	noqbûn
iniş aşagi	sernişîv
geri sayım	ber bi ... ve
kendini kaptırmak	ji dest çûn
treni kaçırmak	ji dest çûn
denetimli	kontrolkirî
pasaport	pasaport
alkış	çepik
pranga kaçağı	mehkûm
hükümet etmek	hukim kirin
hitab	xîtab
sömestr	semester
burs#tirkî	stîpend
düet	duet
duet#tirkî	duet
duetto	duet
yunus baliğı	fînmasî
yunus balığı	delfîn
temsil	temaşe
uzaktan bakmak	temaşe kirin
seyirci kalmak	temaşe kirin
kars	qers
kumpanya	kompanya
oklu kirpi	sîxur
dil avcısı	casûs
polis hafiyesi	şofar
kayuta	kabîne
sınaat	pîşe
dişi manda	madek
maral	madek
bohça	buxçik
çıkı	buxçik
çıkın	buxçik
katlatmak	pêçan
kuşam	pêçan
sarmalama	pêçan
sarmalamak	pêçan
sarmalanma	pêçan
bağ kütüğü	mêw
üzüm ağacı	mêw
yavrusu	kudik
dorum	kudik
domuz yavrusu	kudik
perhiz	parêz
riyazet	parêz
savunu	parêz
has bahçe	parêz
perhiz tutmak	parêz girtin
göz etimi	aso
bozay	hezîran
sufi	sofî
sofu	sofî
mutasavvif	sofî
sofi	sofî
tasavvuf	tesewif
ibate	hewîn
içlem	hewîn
penah	pena
dulda	sitare
aşıt	stare
dam altı	stare
melce	stare
star	sitar
kaysı	zerdelî
katır tırnağı	hêrûg
revnak	rewnaq
dağ eteği	qûntar
badak	gun
sobe	tep
çay bardağı	piyale
narkoman	narkoman
abramak	îdare kirin
abrama	îdarekirin
yer yağı	petrol
bombalama	bombekirin
kukumav	kund
guguk kuşu	pepûk
bayağı kuşu	pepûk
pabuç	pêpik
anjin	xenq
boğak	xenq
ölüm cezası	xenq
katalanca	katalanî
arnavutça	albanî
baskça	baskî
amharca	amharî
bretonca	bretonî
beyaz rusça	belarusî
bulgarca	bulgarî
esperanto	esperantoyî
gujarati	gujaratî
çifleşmek	perîn
kanatlandırmak	perandin
i̇talyanca	îtalî
ıtalyan	îtalî
yunanistan	yûnanistan
çiçek sapçığı	bistîk
i̇rlandaca	îrî
pizza	pîza
japon	japonî
kmer	ximêrî
endonezce	endonezyayî
endonezyalı	endonezyayî
korece	koreyî
letonca	latviyayî
litvanca	lîtwanî
litvanyalı	lîtwanî
litvan	lîtwanî
makedonca	makedonî
makedonyalı	makedonî
makedon	makedonî
malezyaca	malezî
malezya	malezya
boşnakça	bosnî
bosnalı	bosnî
boşnak	bosnî
maltaca	maltayî
norveççe	norwecî
norveçli	norwecî
kazakistan	qazaxistan
kazakeli	qazaxistan
romence	romanî
romalı	romanî
romanyaca	romanî
antep	dîlok
romanya	romanya
ukraynaca	ukraynî
ukrayna	ukrayna
polonya	polonya
lehistan	polonya
avrupalı	ewropî
moğolca	mongolî
mokşa	mokşayî
selim	şêlim
ağlatma	giriyandin
ağlatmak	giriyandin
güldürmek	kenandin
güldürme	kenandin
basitleştirilmiş çince	çîniya sade
угрюмый	girij
tebessüm etmek	bişişîn
sırıtmasına neden olmak	bişirandin
i̇zlandaca	îzlendî
rusyalı	rusî
psikopat	psîkopat
akça ağaç	kevot
hançere	qirik
imik	qirik
fırça	firçe
fırçalayış	firçekirin
küremek	malîn
sünnetlemek	paqij kirin
yara kapanmak	pak bûn
öğrüm	îlon
verim ayı	îlon
gün ağarması	kew
seher vakti	kew
alaka	irtibat
yutkunmak	daqurtandin
yudumlatmak	daqurtandin
sokranma	dabilandin
sokranmak	dabilandin
sözü ballandırmak	dabilandin
tekellüm	dabilandin
veriştirme	dabilandin
veriştirmek	dabilandin
om	gupik
erkek keklik	nêrekew
erosçu	erotîk
şehevî	erotîk
ikileşme	cotbûn
fal	fal
fala bakmak	fal
dini öğrenci	suxte
rendevu	jivan
bura	vira
ahacık	vira
dalız	dalan
cecim	cacim
nedeniyle	seba
kar yığını	sevî
ecdat	ejdad
palaska	rext
kargılık	rext
kütüklük	rext
kemerlik	kember
gebre otu	kember
düver	kêran
kalas	beşt
silikon	sîlîkon
kabuğunu soymak	qeşartin
kabuğundan sıyırmak	qeşartin
yağlı bitkiler	tewaş
şahinşah	şahinşah
vb	hwd.
ve benzeri	hwd.
vs	hwd.
tetkik etmek	vekolîn
tahkikat	vekolîn
tedkik etmek	lê kolîn
kazım	kolîn
fotoğraf makinesi	kamera
video	vîdyo
kitap kapağı	berg
pirahen	gumlek
camız	gamêş
kara sığır	gamêş
tırnaklı	gamêş
dombay	gamêş
kömüş	gamêş
su sığırı	gamêş
öküz	camûs
camış	camûs
start	start
tasarlayış	şêwirîn
kurbanlık	boraq
yağmur bastırmak	şîrpandin
konural	kej
başı dönmek	gêj bûn
başının etini yemek	gêj kirin
çıkralık	şafir
kızılmak	xinzirîn
hırslandırma	qehirandin
hırslandırmak	qehirandin
zıvanadan çıkarmak	qehirandin
esef etmek	xem xwarin
hayale kapılmak	xem xwarin
müteessif olmak	xem xwarin
müteessir olmak	xem xwarin
tasa etmek	xem xwarin
bu an	vê gavê
bu anda	vê gavê
bu sefer	vêca
madama	madam
şıp diye	hemen
o saat	tavilê
gönülden	ji dil
kalben	ji dil
ısırgın	girmişk
imale	tewandin
müdafi	berevan
abone	abone
israf olmak	zehî bûn
harc	lêçûn
bezirgânlık	bazirganî
ticari	bazirganî
alış veriş yeri	bazar
uzun sırık değnek	adode
yenirce	rîş
şark çıbanı	rîş
ole	aferin
aferin	aferin
kuma	hewî
mahluk	afirandî
uyku tulumu	xewar
antarktika	antarktîka
mevcut olmak	peyda bûn
peyda olmak	peyda bûn
temin olmak	peyda bûn
arız olmak	peyda bûn
baş göstermek	peyda bûn
elinde bulunmak	peyda bûn
peyda etmek	peyda kirin
bulmak	peyda kirin
bulundurma	peyda kirin
زازله	erdhej
çizik	zax
buhur	bosî
yanık kokusu	bosî
tebahhur etmek	fûrîn
taşırmak	fûrandin
süleyman	silêman
haykırış	qîjîn
haykırma	qîjîn
istinat direği	kotek
i̇sviçre	swîsre
revak	sivder
cemevi	cemxane
buluntu	jêma
helal	helal
mısmıl	helal
mir oğlu	pismîr
at oynatmak	taw dan
bilardo	bilyar
karış	bost
şovenizm	şovenîzm
koyu milliyetçilik	neteweperistî
şoven ulusçuluk	neteweperistî
milliyetperverlik	neteweperwerî
koyu milliyetçi	neteweperwer
miliyetçi	neteweperwer
ulusalcı	neteweperwer
söylence	efsane
acayipleştirme	seyrkirin
görülmedik	nedîtî
görmemezlik	nedîtî
görülebilir	bînbar
yük altı	bînbar
eksilme	kêmbûn
kıtlaşma	kêmbûn
tenakus	kêmbûn
hacir	kêmkirin
oturuşma	kêmkirin
tenkis	kêmkirin
tenkisat	kêmkirin
raptiye etmek	çespandin
açıklığa kavuşturmak	aşkartin
çıyanlık	xayînî
piton	pîton
köpekdişi	qîl
fildişi	ac
hıyanetlik	xiniztî
yezitlik	xiniztî
şoför m	sayeq
salah bulmak	baş bûn
iyi akşamlar	êvarbaş
akşamlar hayrolsun!	êvarbaş
tünaydın	êvarbaş
iyi günler	rojbaş
sabahlar hayrolsun	rojbaş
günaydın!	rojbaş
ölçer	agirkolk
kaşık	kevçî
çirkefe taş atmak	tev dan
melamin	lêk
keleplemek kirin	kelef
kudsişerif	quds
yeruşalim	quds
haydisene	haydê
harmoni	armonî
misak	lihevhatin
çırpınış	peritîn
ihtilâç etmek	peritîn
uzak düşmek	dûr ketin
ıramak	dûr ketin
uzak kalmak	dûr ketin
kovulma	qewirîn
kovuluş	qewirîn
harman dövme	gere
güneşte	qemirandin
ateşte	qemirandin
bronzlaştırmak	qemirandin
bronzlaştırma	qemirandin
getirtmek	werandin
kucaklaşmak	werandin
rezervasyon	rezervasyon
rezerve ettirmek	rezerve kirin
müntehir	xwekuj
intihar eden	xwekuj
linç	lînç
linç etmek	lînç kirin
mahlûk	teba
zambakgiller	lale
sadrazam	lele
sivri sinek	poşî
balet	balet
savahilice	swahilî
slovakça	slovakî
slovence	slovenî
slovenya	slovenya
slovakya	slovakya
taylandca	tayî
tayca	tayî
tamilce	tamîlî
urduca	urdûyî
valonca	walonî
valonya	walonya
brüksel	bruksel
avrupa birliği	yekîtiya ewropayê
birlemiş milletler	neteweyên yekbûyî
bm	neteweyên yekbûyî
çaylaklık	xişîmî
narsist	narsîst
dirhem	derhem
bir dirhem	derhem
küskü	derhem
dinar	dînar
orta yaşlı kimse	navsere
cartayı çekmek	geber bûn
canını cehenneme göndermek	geber kirin
harman yeri	bêder
kalınlatmak	qalind kirin
kalınlaşma	qalindbûn
kalınlaştırma	qalindkirin
kalınlatma	qalindkirin
boynunu vurmak	ser jê kirin
kafasını uçurmak	ser jê kirin
kellesini uçurmak	ser jê kirin
cumbuldatmak	şilqandin
gözgü	eyne
mirat	eyne
kelem	kelemî
murakabe	venerîn
denet	venerîn
baht	bext
güverte	guverte
yasemin	yasemîn
makyaj pudrası	spiyav
boy-pos	bejnûbal
boy pos	bejnûbal
çiğit	dendik
yüksek ses	birî
hadımlık	nemêrî
puluçluk	nemêrî
neyse	werhasil
verhasıl	werhasil
ziyaretine gelmek	bi ser ve çûn
tarihi geçmek	bi ser ve çûn
başlayış	destpêkî
halk bilimi	folklor
halkiyat	folklor
ilimcilik	zanyarî
bilimcilik	zanyarî
bilimadamlığı	zanyarî
dezenformasyon	dezenformasyon
yanıltıcı	xapîner
arma	xanedan
bürüme	kirmişandin
kişizade	zadegan
soylular	zadegan
mezraa	mezra
yumrukoyunu	boksîng
mülakeme	boksîng
vietnamca	viyetnamî
başarım	performans
müntahip	hilbijêr
anagram	anagram
evirmece	anagram
okey	okey
zulüm eden	stemkar
zulu	zûlûyî
aşiret reisi	serokeşîr
sarı anber	zêringer
altın işleyicisi	zêringer
nevir	gon
suyunu kesmek	çikandin
hırvatistan	xirwatistan
balkan	balkan
balkan yarımadası	balkan
aşağı almanca	saksiya jêrîn
guarani	guwaranî
tatarca	teterî
rumence	romî
rumî	romî
oturan	rûniştvan
sekene	rûniştvan
mukim	rûniştvan
yeni zelanda	nû zelenda
sicilya	sicîlya
sanskritçe	sanskrîtî
üç köşeli	sêgoşe
hiçbi	çuh
papua yeni gine	papua gîneya nû
somalice	somalî
kaz ayağı	samî
zelve	samî
laponya	laponya
i̇skandinavya	skandinavya
iskandinav	skandinavya
bangladeş	bengladeş
cik	ok
doğum tarihi	rojbûn
dünyaya gelmek	hatin dinyayê
anadan doğmak	ji dayik bûn
gambiya	gambiya
moritanya	morîtanya
pencapça	puncabî
göyük	şewat
eğirme	ristin
soğuk vurmak	sirandin
kişnetmek	sirandin
boca etme	rêtin
iflas etmiş	topavêtî
katı yakıt	ardû
akaryakıt	sotemenî
ebru	averû
erken bahar	axlêve
üstelemek	israr
diretmek	israr kirin
köpek dövüşü	şerenîx
oramiral	oramîral
parmak basmak	destnîşan kirin
keçuva	keçwayî
meksika	meksîk
brezilya	brazîlya
dezenfekte	dezenfekte
dezenfekte etmek	dezenfekte kirin
bilinçaltı	binhiş
kuskun	qus
perukâr	berber
sakal kesen	berber
i̇sa	îsa
çiş etmek	miz kirin
siyemek	miz kirin
çişini yapmak	miz kirin
şakak	cênîk
saç örgüsü	gêsû
dikeç	gilç
kazgıç	gilç
pelikan kuşu	keravî
yumurta piç	sonebinavk
karabatak	qirmeravî
çamurcun	curek
meyan	sûs
meyankökü	sûs
orman tavuğu	sûsik
yüz yermek	rûdan
helva	helaw
tahin helvası	helaw
çevrinmek	tewaf kirin
disko	dîsko
distotek	dîsko
candarma	jendirme
turna	quling
baklan	çirg
mamut	mamot
demiri	gewr
duman rengi	gewr
kül rengi	gewr
sardinya	sardînya
çuvallı	dagirtî
istila edilmiş	dagirtî
asab	hêrs
nasırına basmak	hêrs kirin
mütehevvir	hêrsbûyî
tarik	rêk
evin temeli	rêk
adama dönmek	edilîn
tacikçe	tacikî
tacikistan	tacikistan
tacik	tacik
tacikistanlı	tacik
çuvaldız	şûjin
oğraş	qewad
gavat	qewad
kurumsak	qewad
peyser	qewad
mesih	mesîh
soyu tükenmek	qelîn
eradikasyon	qelîn
mütekabil	beraber
aynı seviye	yeksan
zekât	zekat
fitre	fitre
vitir	fitre
iftar	fitar
tribün	trîbûn
çıktı	avrû
engebe	kert
kartpostal	kartpostal
posta kutusu	namedank
mektupluk	namedank
bombok	berbad
ele alınmaz	berbad
bok üstün bok	berbad
arsıulusal	navneteweyî
beynelminel	navneteweyî
millî	neteweyî
ulusal	neteweyî
ulusluk	neteweyî
gayrinizami harp	gerîla
romanşça	romancî
nauru	nawrû
lingalaca	lingalayî
kongo cumhuriyeti	komara kongoyê
samoa	samoa
maşala	lat
masif kaya	lat
bulanıklık	şêlîtî
harami	heramî
moldova	moldova
davetsiz misafir	moşek
karo	xişt
binbaşı	serdar
sırbistan	sirbistan
elde tutmak	ragirtin
zabt etmek	vegirtin
zabt	vegirtin
zabt etme	vegirtin
işgal et­me	vegirtin
donmuş	cemidî
sımsıkı	kip
şimdiki zaman	dema niha
peruk	perok
fason	fason
sıklet	giranî
yüklülük	giranî
zam	giranî
malgaşça	malagasî
madagaskarca	malagasî
eşek kafalı	bêhiş
kafa değil balkabağı	bêhiş
şuuru yerinde olmayan	bêhiş
zekasız	bêhiş
upuslu	biaqil
akil	aqilmend
akıl hocası	aqilmend
bilmiş	aqilmend
ozon	ozon
olumsallık	gengazî
helsinki	hêlsînkî
ensest	insest
ev ekonomisi	maldarî
mal sahipliği	maldarî
iyi halli	halxweş
burjuva	halxweş
kargo#tirkî	kargo
amin	amîn
kompetan	rayedar
sağımlık	sehîh
sağın	sehîh
çıngar	teşqele
tescil etmek	tomar kirin
sicile geçirmek	tomarkirin
fişlenmiş	tomarkirî
restore etmek	restore kirin
münakasa	îhale
ihale etmek	îhale kirin
ilahe	îlahe
ilâhe	xwedawend
seziş	feraset
kavrama yeteneği	feraset
hahha	haha
aha	aha
kervanseray	karwanseray
kervansaray	karwanseray
metropoliten	metro
özbekçe	ozbekî
özbekistan	ozbekistan
sekendiz	satûrn
zühal	satûrn
erendiz	jûpîter
uranüs	ûranûs
giren	xumam
mağrip	mexreb
kodaman	giregir
gıldır gıldır	giregir
sübut	pêkhatin
içe kapanık	bergirtî
girenlemek	xumam bûn
konukçu	mêvandar
mihmandar	mêvandar
deniz hamamı	plaj
tavus kuşu	tawis
tavus	tawis
faşist	faşist
ıskarça	repisandin
park etmek	park kirin
park yapmak	park kirin
bitkiler	gulûgiya
magazin	magazîn
antrepo	embar
ardiye	depo
ardiyeci	depo
göbektaşı	xezîne
kendine özgü	nefs
yüzü yerde	nefsbiçûk
eksperyans	tecrûbe
risk	rîsk
riziko	rîsk
bit yumurtası	rîsk
bit sirkesi	rîsk
doygu	rizq
yaşantı	jiyar
anası danası	silsil
federasyon	federasyon
somun	semon
bin dallı	taqî
deney yapmak	taqî kirin
test etmek	taqî kirin
totem	totem
demokrat	demokrat
el erki	demokrasî
demokrasi	demokrasî
yeşil ışık yakmak	rê dan
yol vermek	rê dan
uyuz etmek	zivêr kirin
bitkin olmak	bêhal bûn
bizar	bêzar
bizar olmak	bêzar bûn
bizar etmek	bêzar kirin
kanını iliğini kurutmak	bêzar kirin
tepesinde havan dönmek	bêzar kirin
komünizm	komunîzm
konto	konto
bahıs	gotûbêj
alım satım	danûstandin
teati	danûstandin
aksata	danûstandin
buut	dirêjî
lüksemburglu	luksembûrgî
lüksemburg	luksembûrg
başçı	serkar
formen	serkar
işçibaşı	serkar
muz	mûz
miyav	miyaw
mırnav	miyaw
alicenap	kerîm
veda etmek	xatir xwestin
vedalaşmak	xatir xwestin
vedalaşma	xatirxwestin
si	moxel
un eleği	moxel
delik deşik	qulqulî
hamam	serşok
fiji	fîjî
abstre	razber
itikatlı	bawermend
mutekit	bawermend
mümin	bawermend
inanmış	bawermend
el bebek gül bebek	delalî
yenilenme	nûbûn
haşerat	mêşûmor
börtü böcek	mêşûmor
kapüşon	serpoş
serpuş	serpoş
keşmir	keşmîr
bakarak	gorî
nazaran	gorî
nispeten	gorî
oranla	gorî
mezara koymak	gorî kirin
falan, falan kişi	filan
toput ç	xilte
votka	vodka
izm	îzm
salık vermek	tewsiye kirin
tavsiyeli	tewsiyekirî
ahiret	axret
öteki dünya	axret
ön eteklik	mêzer
dinleti	konser
ünsüz harf	dengdar
anadili	zimanê dayikî
seviyeli	berketî
mal sahibi	maldar
karun gibi zengin	maldar
uzun ve ince kumaş parçası	terîş
haşa	sercil
baş mal	sermaye
çekyat	qenepe
pul	pûl
devamlılık	berdewamî
sürerlik	berdewamî
fevç	hêwirze
bet bereket	boşayî
takdiri ilâhî	enînivîs
olur mu?	weh
sukunet	tebitî
hissesiz	bêpar
kurmaylık	serekanî
tayin edici	diyarker
belirleyici	diyarker
açıklayıcı	eşkereker
duyurucu	îlanker
iletişimci	ragihîner
muhabereci	ragihîner
dinsel	olî
dışarıdaki	derveyî
dışla ilgili	derveyî
dışarılı	derveyî
su kamışı	qamîş
ahitleşmek	li hev kirin
anlaşmaya varmak	li hev kirin
itilâf etmek	li hev kirin
kavilleşmek	li hev kirin
koklaşmak	li hev kirin
mutabık kalmak	li hev kirin
örtüşmek	li hev kirin
antant	lihevkirin
konvansiyon	lihevkirin
uylaşım	lihevkirin
bazal	esasî
techiz	raxistin
tefriş	raxistin
tefriş etmek	raxistin
seriş	raxistin
elektronik	elektronîk
bre	hey
binek	hey
mafevk	serdest
zehir gibi	serdest
boklu	lewitî
lekeleyici	lekedar
karton	karton
i̇kizler	cêwî
büyük önder	serwer
gözetleyici	çavdêr
mütevehhim	bizdok
beğ	beg
kuşkusuz	bêşik
kavrayışlı	têgihiştî
kökçü	qalik
kavkı	qalik
sersefil	perîşanî
kavil	qewl
kabl	qewl
miat	qewl
litürji	lawij
lava etmek	lava kirin
günahlı	gunehbar
mayasıl	bîrov
egzema	bîrov
ekzem	bîrov
derebey	feodal
garbî	rojavayî
batılı	rojavayî
garplı	rojavayî
defne	qar
kakalama	qar
yurdu	kurî
kuri	kurî
küpleği	kurî
balık tuzağı	xefik
oyunluk	sehne
avanta	hewante
yosun bağlamak	kevz girtin
mayo#turkish	mayo
kod	kod
kot	kod
kavata	kod
ağaçtan kap	kod
kete	kade
gato	kade
sinema	sînema
molotov	kokteyl
standartlaşmak	standard bûn
standartlaştırmak	standard kirin
standartlaşma	standardbûn
standartlaştırma	standardkirin
master	master
yüksek lisans	master
tufan	tûfan
zeka	mentalîte
yoğurt çiçeği	beybûn
haberler	dengûbas
zıbın	zibûn
ayarlama	eyarkirin
habip	hebîb
yaya asker	segman
aile adı	leqeb
soyad	paşnav
soyisim	paşnav
lombardy	lombardiya
kıvrımlı demir	totya
uzantı	niçik
tercüme edilmek	wergerîn
zincir vurmak	zincîr kirin
zincire vurmak	zincîr kirin
bamya	bamî
taş kütlesi	gerd
hormon	hormon
argo	argo
hamlamak	qerimîn
boyun prangası	toq
broş	toq
basıklık	nizmahî
imam kayığı	tabût
erjeng	erjeng
erjenk	erjeng
erteng	erjeng
kepaze etmek	kepaze kirin
aşık kemiği	kab
palandöken	rizde
ahlama	axîn
yersel	axîn
kolaçan	çavdêrî
tarassut	çavdêrî
gözleyiş	çavdêrî
hilekar	fêlbaz
yönetsel	îdarî
idari	îdarî
bir buldu iki ister akça buldu çıkın ister	çavbirçî
menekşe gözlü	çavreş
üçkâğıt	dekûdolab
ayak oyunu	dekûdolab
bunalımlı	tengezar
pısırıklık	newêrekî
yasalı	qanûnî
meşher	pêşangeh
kırıtım	loq
sunum	loq
ayvar	hîlebaz
madrabaz	hîlebaz
elde	temîn
yozcu	cambaz
takılgan	mizewir
kurt gibi	mizewir
olmaksızın	bêyî
olmadan	bêyî
bağır yeleği	bersîng
kıya	cinayet
âlime	zanistvan
bilim insanı	zanistvan
bilim kadını	zanistvan
ilim adamı	zanistvan
ilim kadını	zanistvan
dibi	binî
dip deniz	binî
taydaş	hevta
sorgucu	pirsker
atlas	atlas
saten	atlas
galler	wêls
iri ağaç dikeni	sîx
dördüncü	çarem
beşinci	pêncem
üstüne başına etmek	hetikandin
iğfal edilmek	hetikîn
salı	şeşem
i̇nternet	internet
genel ağ	internet
aylık yayın	mehname
mezkûr	gotî
sözü edilen	gotî
lıkır	leq
hamt	hemd
kola	şîrêz
çiriş	şîrêz
şiraze	şîrêz
on üçüncü	sêzdehem
yedinci	heftem
dokuzuncu	nehem
onuncu	dehem
klarnet	klarnet
gitar	gîtar
kayısı kurusu	çir
cırt	çir
tırık	çir
kız bebek	hito
mukaddesat	miqedesat
mıhlama	mîxkirin
ejderha	ejdeha
dragon	ejdeha
büke	ejdeha
suban	ejdeha
canavar	cinawir
haydut gibi	cinawir
kına	xena
üstüne elik	tewer
muhaddep	qop
boa	boa
kobra	kobra
gözlüklü yılan	kobra
vizyon	vîzyon
geyşa	geyşa
cellat	celad
piyasa etmek	piyase kirin
piyasaya çıkmak	piyase kirin
nemçe	nemsa
erbaş	hêlik
golf	golf
katrilyon	katrilyon
trilyon	trilyon
dandik	bêxêr
beş paralık	bêxêr
akşam güneşi	bêxêr
kıtıpiyos	bêxêr
barbarizm	barbarî
müteneffır	kerixî
çürüyüp yıkılmış	kerixî
ikrah etmek	kerixîn
iğreniş	kerixîn
iğrendirme	kerixandin
iğrendirmek	kerixandin
tiksindirme	kerixandin
tiksindirmek	kerixandin
kanıksatmak	kerixandin
nefret ettirmek	kerixandin
org	org
doğu timor	tîmora rojhilat
kararlamak	texmîn kirin
doğal sayılar	hejmara xwezayî
viski	wîskî
fincan tabağı	binkask
eritre	erîtrêya
aids	aîds
virüs	vîrus
bilgisayar virüsü	vîrus
mezopotamya	mezopotamya
viyana	viyena
beç	viyena
komünist	komunîst
mafya	mafya
güzelleme	sirûd
malkıran	cor
mera hastalığı	cor
judo	jûdo
karata	karate
kamikaze	kamîkaze
fenasına gitmek	dil man
gönlü kalmak	dil man
gönüllenmek	dil man
içerleyiş	dil man
evecen	lezgîn
evlâ	çêtir
daha iyi	çêtir
ehven	çêtir
opera	opera
hamle yapmak	raperîn
bagaj	bagaj
portbagaj	bagaj
mikrofon	mîkrofon
melânkolik	sewsî
aklını yitirmiş	sewsî
kardinal	kardînal
katolik	katolîk
iş olsun diye	xwedêgiravî
karnabit	kelerim
karnıbahar	kelerim
konsoloshane	konsolosxane
bilişim	enformatîk
informatik	enformatîk
çimdik atmak	niçandin
yakıştırmaca	newa
hipermarket	hîpermarket
supermarket	sûpermarket
kantin	kantîn
çayevi	çayxane
kesimhane	qesabxane
terfi etmek	terfî kirin
ibdaî	orijînal
konveksi	kopî
tüyo	kopî
eşlem	kopî
çolaklık	kopî
kopya etmek	kopî kirin
hububat ölçeği	elb
kuyu kovası	dewlik
dekalitre	dal
şantaj	şantaj
eksklusif	eksklusîv
lojistik	lojîstîk
satılmış	firotî
cibinlik	kule
general	general
kabala	qebale
kesene	qebale
günü gününe	hero
tanrının günü	hero
tanrı'nın günü	hero
gülhatmi	hero
allah'ın emri	emrê xwedê
emrihak	emrê xwedê
traktör	traktor
kökten kaldırıp çekmek	rakişandin
hızlanış	lezîn
hızlanma	lezîn
kıvrama	lezîn
kıvramak	lezîn
süratlenme	lezîn
süratlenmek	lezîn
sürat almak	lezîn
onyıl	dehsal
thập kỷ	dehe
thập niên	dehe
mười	dehe
năm	dehe
ciltleme	cildkirin
bini bir paraya	hezare
çekinti	dudilî
ikirciklilik	dudilî
belce	navçav
zıbartmak	belqitandin
tereddütlü	dudil
duruksun	dudil
kısa an	kurtedem
balalayka	balalayka
telsiz	bêtêl
stant	stand
uzun süreli	demdirêj
uzun soluklu	demdirêj
avrasya	ewrasya
eşzamanlı	hevdem
mıymıntı	zexel
güvenlilik	ewlehî
tehalüf	cudahî
kutluluk	pîrozî
tüze	hiqûq
adaletçi	dadmend
yirminci	bîstem
on birinci	yazdehem
on ikinci	dazdehem
on dördüncü	çardehem
on beşinci	pazdehem
on altıncı	şazdehem
on yedinci	hevdehem
on dokuzuncu	nozdehem
on sekizinci	hejdehem
otuzuncu	sihem
kırkıncı	çilem
ellinci	pênciyem
altmışıncı	şêstem
yetmişinci	heftêyem
sekseninci	heştêyem
doksanıncı	notem
bininci	hezarem
milyonuncu	milyonem
milyarıncı	milyarem
saklık	hişyarî
palyaço	qeşmer
basınçlı	givaştî
plaket	selik
hanek	zaferan
sonlandırmak	bi dawî anîn
tastik etmek	pesindkirin
makedonya	makedonya
üst düzey	payebilind
üst rütbeli	payebilind
partal	pertal
korno	borî
işe yaramaz	kêrnehatî
battal	bikêrnehatî
işe yarar	bikêr
kenetleşme	hevbendî
tutarlılık	hevgirî
birbirini destekleme	hevgirî
dayanışık	hevgirî
bokluk	pîsatî
idamlık	berdarî
mahzunluk	xemgînî
tumba	serûbin
üst baş	serûbin
karantina	karantîna
hayırlısı	bixêr
görenekli	bastan
marka	mark
tamu	dojeh
evsaf	wesf
hasep	wesf
tavsif	wesfdan
muasır	hevçerx
dekametre	dam
enflasyon	enflasyon
para şişkinliği	enflasyon
yoruba	yorubayî
sulbünden gelmek	kelij
uçarman	balafirvan
el etmek	dest kirin
el et­mek	dest kirin
nefsaniyet	dijminatî
meğer	meger
görünüşe göre	meger
...den başka	meger
meğerki	meger
tevrat	tewrat
zebur	zebûr
davut	dawid
boynuzsuz keçi	kol
rıza gösterme	rizamendî
eli ağır	destgiran
kımkım	destgiran
ağır elli	destgiran
geçmiş zaman	dema borî
bakış açısı	bergeh
görüş açısı	bergeh
noktainazar	bergeh
alnaç	bergeh
müstevi	dûz
sinekkaydı	dûz
çırmık	neperûşk
cırnak	neperûşk
whatever	herçi
her ne	herçi
umarsızlık	bêçaretî
amerikalı	amerîkî
bağlaç	gihanek
mareşal	marşal
kaşmerlik	qeşmerî
zibidilik	qeşmerî
karagözlük	qeşmerî
diriğ	texsîr
lahmacun	lehmecûn
genelkurmay başkanı	serokerkan
bitmeyen	bêdawî
sürgünlük	mişextî
derbederlik	derbiderî
fetva	fitû
çerkes	çerkez
kafkasya	qefqasya
dağıstan	daxistan
lös	los
lavaş	los
tanrısal	xwedayî
başı havada	bikêf
kıvıl kıvıl	bikêf
oynaya oynaya	bikêf
betimce	portre
portre	portre
üdeba	edîb
kalem sahibi	edîb
vesilesiyle	wesîle
vesileyle	wesîle
pastel	pastel
yalıtmak	îzole kirin
rehabilitasyon	rehabîlîtasyon
gidekli	binefser
asteğmen	binefser
alay beyi	serheng
miralay	serheng
çeribaşı	mîralay
dejenerasyon	dejenerasyon
bireşim	sentez
rebab	ribab
gurbet eli	biyanistan
yabancı topraklar	biyanistan
herne kadar	herçiqas
namlu	lûle
islâmî	îslamî
müneccimlik	stêrnasî
yıldız falcılığı	stêrnasî
yüksekova	gever
kuşkonar	gever
vaftiz	tafîl
yüz karası	rûreşî
yüz kızartıcı	rûreşî
süper güç	zilhêz
kısas	qesas
katiyet	misogerî
değinti	temas
dokunuş	temas
kamyon	kamyon
eşek marulu	karî
destan	epos
takdim etme	nasandin
tanıtış	nasandin
cirim	qebare
ındeks	endeks
humbara	qumbere
altın dizisi	ristik
boncuk dizisi	ristik
dinleyicilik	guhdarî
sorgu yargıcı	dadpirs
seloteyp	band
doğurganlık	berhemdarî
ecel	ecel
frenk	frank
alabora	alabora
evirtim	qulipîn
itki	tehn
iğneleyici söz	tehn
tepi	tehn
eyerlemek	zîn kirin
eyerleme	zînkirin
mercan	mircan
hukukî	dadmendî
havhav	hewo
saygı değer	birûmet
zevahir	xuyang
hüsnücemal	dîdar
mülaki	dîdar
bahrî	deryayî
denizsel	deryayî
bahriye	deryayî
borazancı	borîjen
boru çalan	borîjen
greyfrut	sindî
koyu duman	moran
natura	natûr
mısırlı	misrî
myanmar	miyanmar
hakk'ın rahmetine kavuşmak	koça dawîn kirin
ebediyete intikal etmek	koça dawîn kirin
vaktini doldurmak	koça dawîn kirin
gayri muayyen	nediyar
mesture	veşarî
dağlık	çiyayî
mera hastalığ	çiyayî
dilema	dîlema
ürkeklik	bizdokî
sıngınca	bizdokî
okur yazarlık	xwendewarî
malûmatsız	bêhay
gizli polis	xefnêr
lahika	îlawe
ot bağı	gurz
ekili	çandî
sonda	hilkolîn
sondalama	hilkolîn
sondalamak	hilkolîn
iş yeri	kargeh
mümesil	nimînende
ahenktar	ahengdar
ritimli	ahengdar
evsin	kozik
gömültü	kozik
öneze	kozik
ihzari	amadekarî
kengel	kengir
kenger	kengir
kengel, kenger	kengir
yabani enginar	kengir
grupsal	komî
grupvari	komî
küme şeklinde	komî
komi	komî
çarpım	lêkdan
k	bk
d	rh
cenuplu	başûrî
güneyli	başûrî
cenubî	başûrî
kuzeyli	bakurî
mebzul	gumreh
ekmeği dizinde	nankor
cancağız	canîk
oturacak	rûniştek
konsolos	konsol
tedarikçi	peydaker
kuduzluk	harî
kuduz hastalığı	harî
kulağın sağır noktası	kerik
olgunlaşmamış	kerik
sustalı	kerik
küçük çakı	kerik
spermatozoit	boç
ısırık	gez
çatkınlık	mirûz
asık yüz	mirûz
yalancı tanık	derewîn
savan	palas
küfrü	mirqî
veresiyeci	deynder
buz gibi	esehî
iç yüz	esehî
künh	esehî
yayın evi	weşanxane
yayınevi	weşanxane
maddesi	artîkel
parçaçık	artîkel
artikel	artîkel
yumruk oyunu	boks
vefasızlık	bêwefatî
sümerce	sûmerî
sümer	sûmer
ürünsüz	bêber
randımansız	bêber
semeresiz	bêber
baymak	pê ketin
iyi gitmek	pê ketin
ökçe	panî
yassılık	panî
göz erimi	panî
bang otu	beng
kiyaset	jîrî
mücadeleci	têkoşer
savaşımcı	têkoşer
militan	têkoşer
britanyalı	brîtanî
işletmeci	karsaz
türbe	tirb
vefa	dilsozî
kabul edilir	evzel
sahiplik	xwedîtî
malikiyet	xwedîtî
tiraj	traj
koskocaman	miezzem
cezbe	cezb
değim	şayan
bikes	bêkes
kendisi	bixwê
ev içi	navmalî
de yapılan iş ve uğraşlar	navmalî
de olan şeyler	navmalî
o haneden olan	navmalî
münakaşacı	gelac
öğretmenlik	mamostetî
rencberlik	rêncberî
üretimlik	karxane
şenoba	sêgirkê
bileşen	pêkhate
bileşiği meydana getiren	pêkhate
emrine vermek	tayîn kirin
trafo	trafo
ne ölçüde	çendî
şu kadar	çendî
tenis kortu	kort
esik	kort
at uşağı	mêter
mehter	mêter
ham madde	daring
puro	puro
yaprak sigarası	puro
merme	halan
tavattun	bicihbûn
şofben	şofben
tatlılık	şirînî
halâvet	şirînî
çarpılan	lêkdayî
istiridye	îstirîdye
simurg	sîmir
riyad	riyad
cibuti	cîbûtî
fantazi	fantazî
müeyyide	mieyîde
şiar	dirûşm
kuruköprü	şahko
çakır keyif	debeng
çakırkeyif	debeng
ister istemez	bivê-nevê
çarnaçar	bivê-nevê
semptom	elamet
sidik torbası	mîzdank
sidik kesesi	mîzdank
eş değerlilik	hevberî
tıbbiye	bijîşkî
radyo evi	îstgeh
radyo istasyonu	îstgeh
radyoevi	îstgeh
tahiti	tahîtî
fransız polinezyası	polînezyaya fransî
parmak hesabı	movik
töre bilimi	etîk
ilimi ahlâk	etîk
tagayyür etmek	dagerîn
tahavvül etmek	dagerîn
tagayyür	dagerîn
transformasyon	dagerîn
anatomi	anatomî
beden yapısı	anatomî
acayiplik	ecêbî
mimik	mîmîk
kayda değer	hêjayî
tanıdık olmayan	nenas
tesit	pîrozbahî
harabati	pejmûrde
evirtik	qulipandî
albino	albîno
soğuk ısırması	zemitîn
yerek	herêmî
kulakmemesi	goçik
teknoloji	teknolojî
tefeli	kutahî
aksi gibi	tersî
aria	beste
mukaddema	miqeder
mukadder	miqeder
yöresellik	deverkî
önem	giringî
önemlilik	giringî
kavrulmuş	qelandî
jaguar	jaguar
uygun görme	miwafeqet
anahtar taşı	eqd
günbalı	eqd
marangoz mengenesi	medor
payidar	mayinde
zevalsiz	mayinde
lirik	coşdar
riyakar	durû
saksafon	saksofon
yasmık	nîsk
kızartılmış	biraştî
serkeşlik	serkêşî
binbaşılık	serdarî
unutma	jibîrkirin
ekonomi bilimi	aborînasî
iktisat bilimi	aborînasî
konforsuz	nerehet
tahta tokmak	mîrkut
derik	dêrik
kapıcık	dêrik
üniforma	unîform
resmi elbise	unîform
yalana şerbetli	virek
kıtırcı	virek
şuursuzluk	bêhişî
indis	îndîs
gönül eri	dilsaf
peri	perî
sahtekâr	sixtekar
handikap	asêtî
iktibas etmek	jê girtin
iştahlandırmak	bijandin
iştahlandırma	bijandin
mutemet	pêbawer
renk veren	rengdar
kemikli	biheştî
hayırhah	xêrxwaz
hürriyetçi	azadîxwaz
muzmahil	hilweşiyayî
et obur	goştxwer
etçil	goştxwer
etobur	goştxwer
alnı açık yüzü pak	serbilindî
tayyareci	pîlot
blok	blok
doğaçtan	zikmakî
doğumsal	zikmakî
vilâdi	zikmakî
iki canlılık	ducanî
şarkî	rojhilatî
oryantal	rojhilatî
zemzem	zemzem
ünlü olma	navdarî
asur	aşûr
alaca aş	aşûr
aşure	aşûr
aşura	aşûra
tokelau	tokelaw
üstünde	li ser
evveli	ewilîn
gitmiş	çûyî
giden	çûyî
gitmiş olan	çûyî
sabık	çûyî
kampus	kampûs
vurgunluk	dildarî
tebrikname	pîrozname
tebrik kartı	pîrozname
laoca	lawsî
suriyeli	sûrî
geriltmek	vekêşan
hâkimiyet	serwerî
kazaklık	serdestî
gönlü kırık	dilşkestî
melâl	tengasî
zırdeli	tirredîn
delişmen	tirredîn
kızıl divane	tirredîn
saloz	tirredîn
erkeksiz	bêmêr
hapt	zîq
otoriterizm	desthilatdarî
tesanüt	piştgirî
kiribati	kîrîbatî
demokratik	demokratîk
okurluk	xwendetî
mastar	rader
allama	xemilandin
donatma	xemilandin
kemale ermek	kemilîn
içeriksiz	bênaverok
külliyetl	xêlî
dolduruşa getirmek	sîqilandin
zonklatmak	zilqitandin
arınmış	safî
artan	mayî
mütebaki	mayî
metruke	mayî
bilmem	nîzam
neymiş	nîzam
tuş	pîj
sağ eğilimli	rastgir
tamir	tamîr
zurna	zirna
inhilal etmek	felişîn
inkiraz bulmak	felişîn
inkiraza ugramak	felişîn
kırkım	qusîn
peynirleşme	qusîn
dünden	ji zû ve
sorguya çekmek	lê pirsîn
soruşturmak	lê pirsîn
mikyas	olçek
kara damaklı	serhişk
pek başlı	serhişk
nato kafa	serhişk
nato mermer	serhişk
eslek	sernerm
yumuşak başlı	sernerm
suyu yumuşak	sernerm
teleskop	teleskop
ölmezlik	nemirî
tamburî	tembûrvan
ismetsiz	nedirist
torunlar	nesl
konuşan	axiv
bir dili konuşan kişi	axiv
gergedan	kergeden
süsleyici	xemilîner
menü	menû
mönü	menû
işveren	karder
iş veren	karder
orta boylu	orte
orta şekerli	orte
orta karar	orte
sual	siwal
dehşet verici olay	gosirmet
gül	sorgul
kırmızı buğday	sorgul
su akıntısı	şîp
gürlek	şîp
harlak	şîp
şelâle	şîp
biçki yapmak	fesilandin
ölçüsünü almak	fesilandin
ütopya	utopya
dikkat toplaşımı	konsantrasyon
pomak	pomak
pomakça	pomak
istihza	îronî
ironi	îronî
kara mizah	îronî
kafa kâğıdı	nasname
kimlik belgesi	nasname
kimlik cüzdanı	nasname
hüviyetname	nasname
nüfus cüzdanı	nasname
bulgaristan	bulgaristan
bulgar	bulgar
karadağ	montenegro
asyalı	asyayî
tahattur	bîrhatin
mücadelecilik	têkoşerî
cumhuri	cimhûrî
haiz	xweyî
soruşturucu	vekoler
dink	ding
kerempe	lûtke
dağın tepesi	lûtke
badiye	pesar
malak	sak
manda yavrusu	sak
dikici	dirûvan
morumsu	moreyî
boynuna almak	lê bûn
inşa olmak	lê bûn
gelip geçmek	lê bûn
androloji	androlojî
avara	beredayî
boku bokuna	beredayî
çarçur	beredayî
haybe	beredayî
pisi pisine	beredayî
müdire	gerînende
baş murakıp	serperişt
gözetmen	serperişt
mahsup	hesibandî
sehim	behre
sibirya	sîberya
esnetme	vezilandin
esnetmek	vezilandin
tevettür	vezilîn
yere yayılarak oturmak	vezilîn
zekeriya	zekerya
eme yaramak	bi kêr hatin
faydası olmak	bi kêr hatin
karnını şişirmek	avisandin
voleybol	voleybol
piyade eri	piyade
gözetmenlik	serperiştî
tahliye	tehliye
karşın	digel ku
dalyasan	xerz
yaşlı ağaç	xerz
tamamiyet	tevayî
birbirine bağlı	hevgir
birleşen	hevgir
yek vucüt	yekbûyî
dayanışmalı	hevgirtî
birem	karakter
basketbol	basketbol
basket	basketbol
evecenlik	lezgînî
acelecilik	lezgînî
elektron	elektron
proton	proton
betonarme	betonarme
demirli beton	betonarme
beton	beton
produktif	mistehsîl
sanayi	endustrî
işleyim	pîşesazî
uran	pîşesazî
sanayicilik	pîşesazî
sünnet	sinet
mesel	metelok
kıssa	metelok
kelâmıkibar	metelok
öz deyiş	wecîze
vecize	wecîze
veciz	wecîze
ağaçsıl	darîn
halk ürünleri	kelepûr
fabl	cefen
sonuç bildirgesi	encamname
kayıran	hamî
kitlesel	girseyî
dikizleme	kelişîn
gizlice gözetmek	keliştin
kapanma	kumişîn
çelişmek	tewişîn
dengesizleşmek	şewişîn
yalpalanmak	şewişîn
örgütlendirmek	bi rêk xistin
başlatmak	li dar xistin
genel ev	kerxane
kırmızı fener	kerxane
sevkiyat	sewqiyat
deveran etmek	çerixîn
kendi ekseni etrafında dönmek	çerixîn
vakıa	kirû
faşır faşır	şireşir
şarıl şarıl	şireşir
şırıl şırıl	şireşir
taksi	taksî
göçüm	taksî
kuru dere	mesîl
fobî	pax
öz bakım	sexbêrî
düzence	dîsîplîn
düzen bağı	dîsîplîn
filantrop	fîlantrop
solfej	solfej
demirkapan	meqnetîz
tahteravallı	zirnazîq
tahterevalli	zirnazîq
tecvit	tecwîd
moralini bozmak	sîxurî
öküz balığı	gamasî
adrenalin	adrenalîn
stres	stres
argıt	derbend
belen	derbend
merkat	merqed
emperyalizm	emperyalîzm
yayılımcılık	emperyalîzm
memalik	memleket
feminizm	femînîzm
kişniş	gijnîj
kişniş otu	gijnîj
görmeyen	nebîn
safari	hele
silahsız keklik avı	hele
gayri ihtiyarî	bêhemd
kasıtsız	bêhemd
civanmertlik	camêrî
ahilik	camêrî
çam halkı	camî
çampa halkı	camî
çam dili	camî
çamca	camî
itilâ	hilbûn
istihkâm	asêgeh
müstahkem yer	asêgeh
müstahkem mevki	asêgeh
yapağı taramak	jenîn
büyük baş hayvan sürüsü	garan
eli sopalı	zorbaş
müsdebit	zorbaz
alay malay	tevde
hep birden	tevde
paşalık	paşatî
meliklik	melikî
enfeksiyon	enfeksiyon
çalışmalar	îcraet
uygulamalar	îcraet
bileşme	pêkanîn
icra etmek	encam dan
netice vermek	encam dan
şümullü	gişgir
irşad	irşad
maşallah	maşela
ornatma	îqame
minare	minare
kümbet	gumbet
kolcu	qerewêl
ihtizaz	lerz
râşe	lerz
ketibe	ketîbe
poyraz	ziryan
babacık	bavik
teklifsiz	samîmî
var olan	mewcûd
yolu	mecra
arp	arp
hamburger	hambûrger
sıradağlar	rêzeçiya
mevsimsiz	bêdem
günahkârlık	gunehkarî
kriminalite	tawankarî
candan yürekten	bi dil û can
canı gönülden	bi dil û can
can-ı gönülden	bi dil û can
halisane	bi dil û can
bayıla bayıla	bi dil û can
vezirlik	wezîrî
vezaret	wezîrî
safiha	lewhe
parşömen	keval
didinti	kêferat
uyur uyanık	xilmaş
bağdaştırmak	li hev anîn
telif etmek	li hev anîn
aralarını bulmak	li hev anîn
arayı yapmak	li hev anîn
ortasını bulmak	li hev anîn
cesur yürekli	dilawer
külhanbeyi	ebeboz
ayak takımı	ebeboz
ipsiz sapsız	sûtal
kemalizm	kemalîzm
mütecanis	homojen
heterojen	heterojen
ayrı cinsten	heterojen
dolam	fetl
misvak	siwak
kıyınma	xewirîn
burulma	xewirîn
baş vermek	seridîn
başak bağlamak	seridîn
başaka durmak	seridîn
çalkağı	serad
çalkak	serad
çalkar	serad
sarat	serad
gözer	serad
selektör	serad
iri delikli kalbur	serad
kerenti	tirpan
devran	dewran
davlumbaz	rojîn
bürün	erûz
aruz	erûz
prosodi	erûz
nebevi	nebewî
filozofluk	felsefe
felesofluk	felsefe
repertuvar	repertuar
doğru yoldan ayrılma	lec
nazi	nazî
üzengi kemiği	zengû
düello	duelo
rutin	rûtîn
anarşist	anarşîst
intizamsızlık	tevlihevî
hancı sarhoş yolcu sarhoş	tevlihevî
anarşızm	anarşîzm
erksizlik	anarşîzm
berat	patent
bileşmek	pêk anîn
vücuda getirme	pêk anîn
affedici	bexşende
küsüp uzaklaşmak	teyizîn
küsüp gitmek	teyizîn
ökseye basmak	şemitîn
hissizleşmek	tevizîn
şaft	mijane
saban oku	mijane
şaft mili	mijane
afsün	efsûn
devim bilimi	dînamîk
görme gözesi	malik
sivri kuyruk	malik
amorf	bêteşe
yarışılan	pêşber
vicdansızlık	bêwijdanî
lastik	lastîk
psikoanaliz	psîkanalîz
psikanaliz	psîkanalîz
üstüne yıkmak	spartin
oksijen	oksîjen
müvellidülhumuza	oksîjen
fehim	îdrak
e	mensûb
buğz	buxd
kahire	qahîre
bakkal	beqal
caz	caz
askeri darbe	kudeta
hükümet darbesi	kudeta
kolesterol	kolesterol
kolesterin	kolesterol
tarçın	darçîn
fındık	findeq
cezerye	findeq
pas lalesi	sosin
yasemin çiçeği	sosin
nergis	nêrgiz
fulya	nêrgiz
teessüf etmek	dil pê şewitîn
vahvahlanmak	dil pê şewitîn
farklı imtiyazlı	ciyawaz
ihtilâf	ciyawaz
mevhibe	bexş
reyhan	rihan
bitki örtüsü	flora
bitey	flora
direy	fauna
fauna	fauna
fuar	fuar
önünde	pêşberî
karşısına	pêşberî
oluşmuş	pêkhatî
yeğnilik	sivikî
integrasyon	entegrasyon
dereotu	heliz
döken	pelwer
dökülen	pelwer
hanüman	xanûman
malikane	xanûman
elçilik uzmanı	ataşe
ataşe	ataşe
ugursuz	sewm
sungur	başok
ak kuş	başok
servi	serw
selvi	serw
esna	esna
tehyiç etmek	coşandin
nar çiçeği	erxewan
bonbon	bonbon
ipçik	benik
ağzını açtırmamak	lêve bûn
bülbül kesilmek	lêve bûn
dili açılmak	lêve bûn
kabak çiçeği gibi açılmak	lêve bûn
ağız açtırmamak	lêve bûn
zühre yıldızı	pêwan
çuha	çoxik
ziyaretgah	zêw
zap suyu	zêw
eline almak	rahiştin
yedirip içirmek	xwedî kirin
mıskal	misqal
sofra bezi	mişot
yorgan yüzü	rûlihêf
döşek yüzü	rûdoşek
ferace	fote
ticarî	ticarî
insancıllık	mirovhezî
alicenaplık	merdî
kivi	kîwî
şehrizor	şarezor
beysbol	beysbol
beyzbol	beysbol
inanca	pêbawerî
aldanma	xapîn
gaspçı	nijdevan
ılgarcı	nijdevan
hıristiyanlık	mesîhîtî
sabotor	sabotor
afyon	afyon
armuz	derz
şile	catir
mercankök	catir
düzen verme	tenzîm
yoluna koyma	tenzîm
havaleli	spartedar
antep fıstığı	fisteq
yerfıstığı	piste
kapsatmak	guncandin
uygun hale getirmek	guncandin
sterlin	sterlîn
oduncu	darbir
kastor	darbir
ilerlek	pêşketî
gelişmiş	pêşketî
mürebbi	perwerdekar
serkeş	serkêş
arabist	erebîzan
niyeti bozuk	niyetxirab
bhutan	bûtan
iri kayalar	şikêr
taş yağını	şikêr
sık boğaz	pest
denk getirmek	lê anîn
dengine getirmek	lê anîn
tanrı bilimci	xwedanas
tanrıtanır	xwedanas
akıl dışı	dûrî aqil
unsuz	bêar
simli	simdar
fino	boçik
süs köpeği	boçik
dekolte	dekolte
seksi	seksî
bölüngü	fraksiyon
eleji	zêmar
ortopedi	ortopedî
azgelişmiş	paşvemayî
artakalan	paşvemayî
özünlü	derûnî
iç aleme mensup olan	derûnî
revani	rewanî
tezcanlılık	bêhntengî
hoşgörüsüzlük	bêhntengî
lama	lama
observatuar	resedxane
bütçe	budce
pornografik	pornografîk
federalizm	federalîzm
done	dane
muta	dane
çıkmaza sokulmak	lebikîn
eli ayağı birbirine dolanmak	lebikîn
su geçiren	avgîr
aldangıç	davik
imaj	îmaj
kelpiç	kerpîç
miting	mitîng
dik halde saplamak	çikilandin
sert bakış	awir
itap	berêxwedan
gafur	xefûr
meşin suratlı	rûşûştî
ar namus tertemiz	rûşûştî
yüzü kasap süngeriyle silinmiş	rûşûştî
mahkeme duvarı	rûşûştî
kasap süngeri ile silinmiş yüz	rûşûştî
yüzü kasap süngeri ile silinmiş	rûşûştî
motor	motor
din düşman	dîn-dijmin
bitlis	bidlîs
elazığ	elezîz
erzincan	erzingan
erzurum	erzirom
iğdır	îdir
sivas	sêwas
proletarya	proletarya
çıpa	lenger
gemi demiri	lenger
köprü ayağı	lenger
uçan daire	lenger
ilâm	danezan
kıraathane	xwendingeh
hulus	dilpakî
hüsnüniyet	dilpakî
köfter	kesme
demirbaş	emekdar
dürüst olmayan	nepak
temiz olmayan	nepak
kürtlere özgü	kurdewarî
plaçkacı	talanker
talancı	talanker
çapulcu	talanker
baygınlık gelmek	tengijîn
üstüne fenalık gelmek	tengijîn
bunalma	tengijîn
teşrifat	pêşwazî
maymun gibi	zarîker
şovenist	şovenîst
aşırı milliyetçi	şovenîst
ırzına	binpê kirin
makao	makaw
aldatıcı	xapînok
kandırıcı	xapînok
tavcı	xapînok
bubi	xapînok
yaldızlı hap	xapînok
medine	medîne
fay	şkandî
kırık çizgi	şkandî
obstrüksiyon	berbendî
canı tez	bêsebr
gelgeç	bêsebr
tabiiyet	pêgirî
süzgünlük	melûlî
melankoli	melankolî
yellencek	hêsk
çömçe	hêsk
çemçe	hêsk
madrabazlık	hîlebazî
dişindirik	bizmik
ağaç çivi	bizmik
burunluk	bizmik
süt kuzusu ağız bağı	bizmik
horuldama	xirrîn
ölürken hırıldamak	xirrîn
yatakta horlamak	xirrîn
teknisyen	teknîsyen
boyunduruk altında	bindar
çekince	îtîraz
kanton	kanton
şaraphane	meyxane
takva	teqwa
dini bütün	teqwa
züht	teqwa
imanı bütün	teqwa
keklik kafesi	rekeh
parçacıl tanımlık	partîtîv
hilekarlık	fêlbazî
şeytani	şeytanî
takılganlık	mizewirî
ay takvimi	salnameya koçî
hicri takvim	salnameya koçî
ileri götürmek	pêş xistin
açındırma	perisandin
açındırmak	perisandin
tekebbürlü	pozbilind
ög	yaq
anlamı	yaq
yak	yaq
gnu	ginû
sandalet ağacı	ginû
dört köşe	çargoşe
sponsor	sponsor
yumurcak	nehs
سرشیر	sertûk
ilgisiz ve bir şeyden soğumuş	dilsar
vurdumduymaz	dilsar
malikâne	wargeh
tutsak düşmek	dil ketin
acıtmış	êşandî
ağrıtmış	êşandî
vagon	vagon
lokomotiv	lokomotîv
vazgeçilmez	jêneger
tutsakevi	bendîxane
açınım	perisîn
tuzsuzluk	bêxwêtî
hadsiz	bêhed
bedeni	bedenî
bedenî	cesedî
finansman	fînansman
fizyolojik	fîzyolojîk
ilerleyici	pêşveçûyî
turancılık	tûranî
başa gelmek	hatin serî
acımış	êşiyayî
ağrımış	êşiyayî
ismin yalın hali	nomînatîv
enüstünlük	sûperlatîv
derecesi	sûperlatîv
realize	realîze
endirek	endîrek
doğruca	rasterast
doğru dürüst	rasterast
doğrudan	rasterast
genitif	genetîv
tamlayan	genetîv
durumu	genetîv
bahçesaray	miks
o zamanda	dema ku
plug	plak
sütten kesilmek	ji şîr vebûn
ötesini beri etmek	ji şîr vekirin
nam	navûdeng
araç durumu	enstrûmental
enstrümantal	enstrûmental
yarımada	nîvgirav
dayanım	tirûş
taşdan	kevirîn
insafsiz	bêwijdan
kanı ağır	cangiran
erinme	kasilîn
üşenme	kasilîn
erinmemek	di xwe re dîtin
külahları değişmek	di xwe re dîtin
külahları değiştirmek	di xwe re dîtin
göğüs germek	li ber xwe dan
kemerini sıkmak	li ber xwe dan
kendini sıkmak	li ber xwe dan
sıkı basmak	li ber xwe dan
kemerleri sıkmak	li ber xwe dan
hissiselim	aqilê selîm
sağduyu	aqilê selîm
pinokyo	pînokyo
ayrışıklık	têvelî
dişlik	hedar
tik tak	çikçik
dövüşken	şerûd
çekişken	şerûd
cübbe	cibe
işkembesi geniş	bêxîret
dilcilik	zimanzanî
hazine malı	mera
malî	darayî
destroyer	wêranker
erat	segvan
sekban	segvan
koruyucu hekimlik	segvan
ecza	ecza
bivefa	bêwefa
doğaç	jixweber
irtical	jixweber
bizatihi	jixweber
enstantane	jixweber
meskûn mağara	ziving
birbirini	yekûdu
suçlanma	tawanbarî
günahkar olma	tawanbarî
uludere	qilaban
beğenip	texdîr
selpak	selpak
sumak	şimaq
mavru	şimaq
beş kardeş	şemaq
muharrirlik	nivîskarî
faşism	faşîzm
huşu	nefsbiçûkî
üstün gelmek	têk birin
bigünah	bêsûc
götürümlü	bisebr
sabırla	bisebr
ırzı kırık	bênamûs
çabukcak	zûkahî
aranjör	aranjor
hambeli	hembelî
hanbeli	hembelî
amber	ember
dahi	dahî
üst insan	dahî
izale	jêbirin
kumarda yenmek	jêbirin
inkita	jêbirin
yapı kurucu	avaker
insanlık dışı	nemirovî
insaniyetsiz	nemirov
istidatlı	behredar
liyakat sahibi	behredar
istidat	behredar
ferahî	firehî
osmanlı	osmanî
sızgıt	qelî
kırk merak	mereqdar
tasarufsuz	bêsexbêr
ziynet eşyası	êmanet
debbe	gumgum
güm güm	gumgum
araziye uymak	lê hatin
kip gelmek	lê hatin
tamam gelmek	lê hatin
yerini beğenmek	lê hatin
yolunda gitmek	lê hatin
fasile	famîlye
baykuş gibi	perês
beyrutlu	bêrûtî
romantik	romantîk
romans	romans
meryem	meryem
nesibet	nesîbet
detant	nermijîn
bunatmak	xufirandin
allah'a ısmarladık	bi xatirê te
allah’a ısmarladık	bi xatirê te
dinamit	dînamît
anten	antên
namert	nemerd
şeriklik	şirîkî
mor menekşe rengi	şirîkî
yusuf	ûsiv
yakup	aqûb
i̇brahim	brahîm
yansıca	zarîkirin
ekopraksi	zarîkirin
dört başı mamur	bêqisûr
kabahatsiz	bêqisûr
haza	bêqisûr
dört dörtlük	bêqisûr
yolunda olmayan	nelirê
entelekt	zihn
bileklik	zendik
çançiçeğigiller	zengilok
mızrak ucu	zerg
aktivizm	aktîvîzm
apotr	hewarî
havari	hewarî
imdada koşmak	hewarî
artı işareti	zaîd
antrenman	antreman
kapaklanmak	qelibîn
belermek	qelibîn
gemisi şapa oturmak	qelibîn
tokuşturmak	qelibandin
çarpıştırmak	qelibandin
belertmek	qelibandin
bellem	zên
etelemek betelemek	zêrandin
zeminlik	jêrzemîn
misyoner	misyoner
uzun dilli	zimandirêj
dil bir karış	zimandirêj
zangır zangır	zinge-zing
zıngıl zmgıl	zinge-zing
çıngır çıngır	zinge-zing
zıngır zıngır	zinge-zing
sürücü kartı	ajoname
sürücü belgesi	ajoname
otantîk	rasteqîn
açım	wehî
vahiy	wehî
denklem	hevkêşe
bienal	bîenal
küratör	kurator
komisyoncu	sîmsar
ekici	cenan
burmalı	badayî
tedafüî	parêzî
yalıtım	îzolasyon
fin hamamı	sauna
sauna	sauna
ahretlik	axretî
görgüntü	fenomen
öğretim kürsüsü	diyarde
başı dumanlı	sewdaser
albatros	albatros
yanılsama	îluzyon
illüzyon	îluzyon
nitelemek	wesifandin
niteleyiş	wesifandin
hiç yoktan	belasebeb
kuru kuruya	belasebeb
darılmaca	xeyd
sinir hastalığı	demargirî
antipad	bergirî
karşı koyma	berhingarî
santraför	santrafor
kireç ocağı	êtûn
sehavet	sexawet
somya	somya
korner	conî
el değirmeni	destar
imam sarığı	destar
dastar	destar
kadın başlığı	kofî
mefluç	şeht
muallel	şeht
malûl	şeht
artalan	paşxan
müfredat	mifredat
ariza	erîze
enlem	hêlîpan
meteorit	meteorît
örneklik	mestere
numunelik	mestere
mesaha	mesahe
müzik plağı	qewan
mandepsi	kemn
bez parçası	paçik
döğüşme	misademe
intifada	intifade
filistinli	filistînî
israilli	israîlî
gazino	kazîno
brifing	brîfîng
arkadaşı	hevpîşe
patlayış	peqîn
vaha	wahe
allah korusun	xwedê neke
allah esergesin	xwedê neke
kakışma	kakofonî
kakofoni	kakofonî
kaya kuşu	ketî
düşmüş	ketî
sekili at	qûle
zındık	zendîq
ilgilendiren	aîd
kirpi	jûjî
dolangaç	alole
enformatif	informatîv
bildirsel	informatîv
pusla	pisûle
öven	medah
çatırdatmak	qiriçandin
çıtırdayış	qiriçandin
çıtlatma	qiriçandin
tedai	tedaî
kalem oynatma	texrîf
koyu renk	rengtarî
kurk	qupik
ayakkabinin topuğu	qupik
ayakkabı topuğu	qupik
münavebe	bedilandin
şeklini değiştirmek	bedilandin
ruhban	rahîb
yıldırım gibi	birûskasa
rivayet eden	rawî
mihrap	mihrab
menber	menber
va'z	weiz
muhannet	mixanet
özgür düşünceli	hişaza
şamama	şemamok
şamama gibi	şemamok
sığa	kapasîte
cüzzam	kotî
cenap	cenab
makineli tüfek	reşaş
kör köstebek	xilt
düşük kaliteli	xilt
kapısı açık sofrası meydanda	mêvanperwer
mihmandarlık	mêvandarî
konukçuluk	mêvandarî
kabul edici	pejirîner
pano	pano
kabul edilebilir	qebûlbar
trampolin	trampolîn
kahinlik	kehanet
idealist	îdealîst
etiket	etîket
asar	eser
aliterasyon	alîterasyon
ses yineleme	alîterasyon
alliterasyon	alîterasyon
şiirli	helbestkî
girişlik	girîzgeh
merbat	merbed
üçayaklı şeyler	sêpê
kamera ayaklığı	sêpê
tahıl içindeki yabancı otlar	zîwan
madalya	medalye
kafein	kafeîn
burun deliği	firnik
senfoni	senfonî
orkestra	orkestra
tıkışıklık	izdiham
okuryazarlık	sewad
savat	sewad
konservatuar	konservatiwar
amfi	amfîtiyatro
akyıldız	qurux
mahşer	mehser
sorgulayıcılık	pirskerî
polisiye	polîsiye
sadet	dabaş
sosyolojik	sosyolojîk
akademik	akademîk
bambaşka	cihêreng
grotesk	grotesk
forum	forûm
artzamanlı	diyakronîk
artsüremli	diyakronîk
diyakronik	diyakronîk
harekete	miherik
ayaklandıran	miherik
sakınca	fikar
istinkâf	fikar
ihtiraz	fikar
tezkire	tezkere
sonsuza dek	îlelebed
havuç	gêzer
yadigâr	yadîgar
anmalık	yadîgar
berguzar	yadîgar
gülük	şamik
komando	komando
menopoz	menopoz
yaş dönümü	menopoz
pamflet	pamflet
diplomatik	dîplomatîk
diplomatlık	dîplomasî
diplomasi	dîplomasî
kasıntılı	kuşpene
derisine sığmaz	kuşpene
yamultmak	pelixandin
kurt köpeği	gurêx
kurtboğan köpek	gurêx
ege denizi	ege
adalar denizi	ege
girişik bezeme	arabesk
arabesk	arabesk
sektor	sektor
kutsiyet	qudsiyet
isimsiz	bênav
sendika	sendîka
i̇smail	îsmaîl
önyargı	pêşbawerî
yaver	yawer
boylam	hêlîlar
meridyen	hêlîlar
saman hırsızı	kadiz
şahap	stêrerij
akan yıldız	stêrerij
bezzaz	bezaz
rövanş	rovanş
salamura yapmak	kesidandin
tamamen bitirme	binbir
kökünü kurutma	binbir
mesirelik	seyrangeh
piknik alanı	seyrangeh
piknik yeri	seyrangeh
seyranlık	seyrangeh
pisuar	avrêjk
pülverizatör	avrêjk
pisuvar	avrêjk
yanardağ ağzı	krater
kıtal	lihevxistin
antrenor	miderib
tafsilât	kitekit
seyrek olarak	kitekit
orta büyüklükte	navincî
orta boy	navincî
ıraklık	dûrî
isevîlik	îsawîtî
nasranîlik	îsawîtî
burun otu	birnût
toz tütün	birnût
kabkacak	mencel
oturma yeri	rûniştgeh
minyatür	minyatûr
vakayiname	bûyername
nübüvvet	pêxemberî
peygamberlik	pêxemberî
marjinal	marjînal
vekaletname	wekaletname
hüngürdemek	kurîn
hüngürdeme	kurîn
sesli ağlamak	kurîn
otantik	otantîk
alegori	alegorî
mazıdağı	şemrex
bürokrasi	burokrasî
kolaj	kolaj
feodalizm	feodalîzm
ekşimtırak	tirşeşirîn
ayıklanmış	neqandî
zenofobi	zenofobî
hanlık	xantî
zurnacı	zirrnevan
serpinti	peşk
sıçrıntı	peşk
kura çekimi	peşk
parametre	parametre
işçilik	karkerî
emekçilik	kedkarî
kronoloji	kronolojî
komedya	komedî
dublor	dublor
çelist	çelîst
fanfin	şildim bildim
turnusol	turnusol
menekşe rengi	binefşî
bakü	baku
hentbol	hendbol
el topu	hendbol
vesselam	wesselam
ak kor	tiraf
sıcak kül	tiraf
mantıksal	mantiqî
mantıkî	mantiqî
mehmetçik	mehmetçîk
trend	trend
ibiş gibi	qirdik
zenne	qirdik
grupçuk	komîk
küçûk topluluk	komîk
balığı	semasî
köpek balığı	semasî
düşük yapma	beravêtin
yavru düşürmek	beravêtin
yardım kurumu	weqf
felsefeci	fîlozof
sokrates	sokrates
blog	blog
tahin	tehîn
demagog	demagog
halk avcısı	demagog
zem	lome
solipsizm	ezperistî
küheylân	kihêl
salip	xaç
istavroz	xaç
terimbilgisi	termînolojî
terimler	termînolojî
dizelgesi	termînolojî
terimbilim	termînolojî
terimce	termînolojî
milyarder	milyarder
milyoner	milyoner
ikona	îkon
iftar etmek	fitirîn
iftarını açmak	fitirîn
menekşe	binefş
profil	profîl
polemik	polemîk
kahin	kahîn
beklenti içinde olan	bendewar
gönülden bağlı	bendewar
ayak bağı	pêbend
fon	fon
ısyancı	serhildêr
isyan eden	serhildêr
motivasyon	motîvasyon
kriminalize	krîmînalîze
ilk göz ağrısı	nûxwirî
haşarat	kermêş
dogmatik	dogmatîk
dinlenme salonu	arimgeh
joker	joker
düzenge	mekanîzma
mekanizm	mekanîzma
demagoji	demagojî
halk avcılığı	demagojî
tane tane	teko teko
gizil güç	potansiyel
gizil	potansiyel
göz çapağı	kinîşte
neşide	neşîde
taşıt	wesayit
şempaze	şempanze
bunalım öncesi durum	wexm
zerdeçal	zerdeçal
yılan yumağı	kilor
klor	klor
kürk böceği	bizûz
saçkıran	bizûz
nargile	nargîle
kyoto	kiyoto
doktrin	doktrîn
öğreti	doktrîn
sarkıntılık	dest avêtin
el atmak	dest avêtin
taciz	dest avêtin
ağırlığını koymak	dest avêtin
çizmeleri çekmek	dest avêtin
üstünden geçmek	dest avêtin
el sürmek	dest avêtin
mide ağrısı	zikêşî
kavmi	qewmî
yürek acısı	dilêş
mantinota	metres
evin	puxte
nüve	puxte
kırmız	qirmiz
kırmız böceği	qirmiz
çiçek boyası	qirmiz
kımız	qirmiz
porsiyon	porsiyon
hevenk	taxe
bılız	berdestk
calçı	berdestk
rektör	rektor
habil	habîl
horasan	xorasan
zübeyr	ziber
asım takım	xişr
yılan pancarı	kardî
çok yaşlı	kokim
suluzırtlak	lîmon
zıvrak	lîmon
limon ağacı	lîmon
limonata	lîmonada
kocabaşı	keya
kahya	keya
legalize	legalîze
el pençe	destbestî
elpençe	destbestî
insan hakları	mafên mirovan
geven otu	gonî
reng	gonî
oysa	halbûkî
oysaki	halbûkî
politize	polîtîze
resmen	resmen
losyon	losyon
büyük harf	girek
majüskül	girek
küçük harf	hûrek
miniskül	hûrek
bevvap	dergevan
giriliş	têketin
duhul	têketin
girim	têketin
diyot	diyod
toryum	toryûm
iç ek	navgir
gök ada	galaksî
glayöl	glayol
kuzgunkılıcı	glayol
gladyatör	gladyator
sirk	sîrk
bilanço	bîlanço
ismen	binav
su altı	binav
kokain	kokaîn
eroin	eroîn
beyaz zehir	eroîn
ekstasi	ekstasî
kleptoman	kleptoman
kleptomani	kleptomanî
i̇skender	skender
natır	notir
baskmcılık	cerdevanî
baskıncılık	cerdevanî
kızartı	sortî
sorti	sortî
kızıltı	sortî
bismil	bismil
besmele	bismila
yayıncı	weşanger
boğada	arav
küllü su	arav
bulaşık suyu	arav
ambalaj	ambelaj
totaliter	totalîter
bütüncül	totalîter
icar	deman
demokles'in kılıcı	şûrê demokles
üreteç	jenerator
mütemadi	domdar
süreğen	domdar
köpek yavrusu	kutik
üzerine yağmak	bi ser de çûn
üstüne gitmek	bi ser de çûn
üstüne üne gitmek	bi ser de çûn
üzerine üzerine gitmek	bi ser de çûn
üzerine yürümek	bi ser de çûn
ziyaretine gitmek	bi ser de çûn
karşı gitmek	bi ser de çûn
üstüne üstüne gitmek	bi ser de çûn
oflaz	tekûz
paramiliter	paramilîter
fellâh	reşik
siyah kimyon	reşik
gözkarası	reşik
şizofrenik	şîzofrenîk
şizofreni	şîzofrenî
şizofren	şîzofren
psikiyatri	psîkyatrî
psikyatr	psîkyatr
ruh doktoru	psîkyatr
ötede	wirve
trauma	trawma
travma	trawma
ortasında	di nav ... de
pavyon	pavyon
ince ve uzun kumaş parçası	zolik
sansür	sansûr
sıkıdenetim	sansûr
izaz	ezimandin
izaz etmek	ezimandin
konuklama	ezimandin
konuklamak	ezimandin
kompozitor	kompozîtor
besteci	kompozîtor
prömiyer	promiyer
aklanmış	rûspî
beraat etmiş	rûspî
ibra olmuş	rûspî
ağındırmak	gevizandin
topallayış	kulîn
silo	kulîn
aksama	kulîn
demografi	demografî
alıcı yönetmeni	kameraman
optik kaydırma	zûm
zum	zûm
zahit	zahid
zail	zaîl
periyot	vedor
mevkute	vedor
pedofil	pedofîl
dizayn	dîzayn
tasar çizim	dîzayn
laz	laz
lisans	lîsans
kazık gibi	çik û pik
sfenks	sfenks
menzil tutmak	veniştin
vuraç	şonik
seksek	kupînoz
teokrasi	teokrasî
din etki	teokrasî
din erki	teokrasî
minibüs	mînîbûs
mini	mînî
alınlık	şok
dişeği	şok
esad	esed
ipka	di cih de
ipka etmek	di cih de
kulağını çınlatmak	bi bîr anîn
adını anmak	bi bîr anîn
köy sakini	gundnişîn
aşçıbaşı	aşpêj
hemze	hemze
hamza	hemze
dikiş makinesi	mekîna dirûtinê
basra	besra
necef	necef
mağlup	mexlûb
apolet	apolet
omuzluk	apolet
dogum yeri	zêwar
bengi su	ava heyatê
dirim suyu	ava heyatê
abihayat	ava heyatê
sanat aşkı	peroş
kaptan	kaptan
izlerin oluşturduğu yol	şoperêç
birebir kopyası biçiminde	deq bi deq
ölü örtü	tert
balayı	şirînmeh
bal ayı	şirînmeh
mikro organizma	hûrjînewer
dudağın köşesi	kujê lêvê
alt ve üst dudağın birleştiği yer	kujê lêvê
gülçin	gulçîn
gül deren	gulçîn
gül toplayan	gulçîn
gül eken	gulçîn
uğurluk	maskot
elmacık	hinarik
adem elması	zengilor
soluk borusu	zengilor
nefes borusu	zengilor
yardakçı	altax
röntgen	rontgen
yabani gülü	nesrîn
nesrin	nesrîn
şirvan	şêrwan
deve çobanı	şêrwan
tahta çekiç	merdan
beşir	beşîr
hasip	hesîb
dilenme	pars
parsa	pars
tiflis	tiflîs
apatik	apatîk
kafa tası	kilox
yönerge	dîrektîv
matador	matador
hiyeroglif	hiyeroglîf
papirüs	papîrûs
sensational	sansasyonel
haberleşme	komunîkasyon
bildirişim	komunîkasyon
tıkır sesi	kirt
çenti	kirt
hart	kirt
gırt	kirt
kütürdeme	kirtîn
tıkırdatmak	kirtînî jê anîn
tıkırdatma	kirtînî jê anîn
aynen	eynen
tıpı tıpına	eynen
histeri	hîsterî
isteri	hîsterî
hayvan ini	gij
kıh	kix
amigo	amîgo
santim	santîm
tanyeri	zeraq
karşı olum	teqabil
paranoya	paranoya
yansıtımca	paranoya
likidasyon	tesfiye
kendî	şexsen
inanılmaz	fewqulade
kroki	krokî
dedektif	dedektîv
kalyon	kalyon
kaburga altı	tingal
göğerti	zerzewat
sebzevat	zerzewat
radyasyon	radyasyon
ışınım	radyasyon
kozmoloji	kozmolojî
determinist	determînîst
belirlenimci	determînîst
gerekirci	determînîst
demonstrasyon	xwepêşandan
günahkar	serşor
bavul	bawil
harman rüzgârı	bawil
açık yüreklilik	samîmiyet
teklifsizlik	samîmiyet
alkolizm	alkolîzm
obez	obez
kupon	kupon
kozmonot	kozmonot
uçurcu	astronot
nekrofil	nekrofîl
ölü sevici	nekrofîl
log	log
cildiyeci	dermatolog
kale kapısı	derwaze
eldeki veriler	berdestî
ortalıkçı	berdestî
su tevzi yeri	derav
dük	dûk
duka	dûk
munfasıl	veqetî
artist	artîst
ayet	ayet
i̇rlanda	îrlenda
yıldırıcılık	terorîzm
produksiyon	produksiyon
holding	holdîng
koğma	qewitandin
koğmak	qewitandin
kovuş	qewitandin
başından savmak	qewitandin
küçücük	biçûçik
küçümen	biçûçik
mesame	çavî
ajur	çavî
banket	banket
vücudunu ortadan kaldırmak	ji nav birin
künyesini silmek	ji nav birin
muğber	dilgiran
müşkülpesent	dilgiran
zor beğenen	dilgiran
totalitarizm	totalîtarîzm
kaşer	kaşer
hüviyet	zanav
götürge	asansor
baharlık buğday	bare
üst geçit	serbor
çok yüzlü	pirrû
polihedron	pirrû
dört yüzlü	pirrû
yandaşlık	alîgirî
bağlanım	alîgirî
kılcal	rîşal
etlik	dermale
göz değmek	çav lê ketin
peşîne düşmek	ketin dû tiştekî
kız arkadaş	keçheval
saman sarısı	qîçik
saman rengi	qîçik
süt beyazı renginde	şîrî
süt beyazı	şîrî
sütbeyaz	şîrî
haki	xakî
yabantrak	şiwît
tüh, tüh sana	tifî
yabani kimyon	kemyon
jigolo	jîgolo
modacı	modenas
bir hayli	êpî
bir nice	êpî
hayli	êpî
tümen tümen	êpî
üst eşik	serderî
lento	serder
herk	şûv
keleme	şûv
gönül borcu	minet
müdan	minet
isteksizlik	dilsarî
ilgisizlik ve bir şeyden soğumuşluk	dilsarî
gönül çöküşü	dilsarî
rafadan (yumurta)	dilme
rafa koymak	dilme
rafadan yumurta	dilme
rafadan	dilme
alakok	dilme
plüralist	pluralîst
plakart	plakard
doğu rüzgarı	barêş
penaltı	penaltî
çabuklaştırma	lezandin
hızlandırmak	lezandin
hızlandırmk	lezandin
ivdirme	lezandin
ivdirmek	lezandin
tacil	lezandin
tacil etmek	lezandin
tam yol	lezandin
belgit	sened
tetir	çift
kahrolma hali	kezebreşî
verem olma hali	kezebreşî
paranın yapmayacağı şey yoktur	pere dikutin mere
beyhude	bêhûde
dekan	dekan
hayvar	xavyar
kızılcık otu	botav
kızılkök	rûnas
bildik kimse	rûnas
kızıl kök	rûnas
lenf	lenf
ak kan	lenf
faks	faks
belgegeçer	faks
biçimbilim	morfolojî
tenis	tenîs
alan topu	tenîs
külliyat	kuliyat
perdah	delk
hergele	revo
yılkı	revo
öğrek	revo
dalak otu	qesel
kısa mahmut	qesel
ortak yönetim	koalisyon
metamorfoz	metamorfoz
editor	edîtor
venezuela	venezuela
bolivya	bolîvya
durulamak	dawerandin
başağrısı	serêş
yabani ardıç	merx
bednam	navno
on parmağında on kara	navno
kurumuş hayvan dışkısı	pesarî
birini talan etmek	li talana yekî xistin
ağzı kurumak	qirik lê qetîn
asteroit	asteroîd
müzikalite	muzîkalîte
müziksellik	muzîkalîte
raportör	raportor
gardenparti	şahînet
sütü bozuk	şîrheram
turnuva	turnuwa
formalite	formalîte
sarı çıyan	xiniz
imal	îmal
altın suyu	avzêr
fabrikasyon	fabrîkasyon
konfederasyon	konfederasyon
genbirlik	konfederasyon
gulaş	binçenganê
formulasyon	formulasyon
hülle	hulle
pörsütmek	çilmisandin
yayıklamak	kilandin
bürokrat	burokrat
modernizasyon	modernîzasyon
şovmen	şowmen
gözü gitmek	çav pê ketin
gözü ilişmek	çav pê ketin
gözüne ilişmek	çav pê ketin
gözü değmek	çav pê ketin
gözü ısırmak	çav pê ketin
göze çarpmak	çav pê ketin
büzülüş	qurmiçîn
büzüşme	qurmiçîn
kırışmak	qurmiçîn
kıskanış	deqisîn
ses şiddeti	vedeng
neşter	nişter
nişter	nişter
bisturi	nişter
akilâne	aqilane
damla damla	piço-piço
gıdıklamak	qidqidandin
tretuvar	peyarê
avurtlu	qure
yanına salâvatla varılır	qure
gurultu	xurînî
uykusuz kalmak	xew bi çavan neketin
konsept	konsept
turne	turne
kulak tozu	belegoşk
kulak kepçesi	belegoşk
güveç kabı	dîzik
kilden yapılan çömlek	dîzik
pancar öbeği	tûmir
hububat yığını	cêz
dişi deve	nag
deve torunu	torim
bahil	nazdar
işvebaz	nazdar
koket	nazdar
duyultu	qalûqult
tezkiyesini düzeltmek	xwe ji tiştekî bêrî kirin
öbek vermek	qurs dan
dışa ilişkin	deranî
büyük saman çuvalı	xirar
müstahil	mistehîl
ananas	ananas
bozul	dejenere
epigram	epîgram
framason	mason
mason	mason
farmason	mason
getto	geto
patrik	patrîk
beklenen	çaverêkirî
kamuflaj	kamuflaj
alalama	kamuflaj
feyz	feyz
eksper	karzan
işbilen	karzan
evirgen	karzan
deniz anası	medûsa
replik	replîk
recim	recm
yivaçar	pafta
çükür	kuling
külünk	kuling
tik	tîk
rekât	rekaet
akşam yezit diye öldürdüler sabah şehit diye namazını kıldılar	bi gur re dixwin, bi xwediyê miyê re şînê digrin
davul görür oynar mihrap görür ağlar	bi gur re dixwin, bi xwediyê miyê re şînê digrin
tüh	tiye
nefsi	gendî
hicviye	hîcîw
satir	hîcîw
namazlağı	şalik
namazlık	şalik
kesesi	şalik
atletizm	atletîzm
atlet	atlet
cengel	cengel
sürüştürme	têdan
hitab etmek	deng lê kirin
hitaben	deng lê kirin
lafını dinlemek	gura yekî kirin
sepet satıcısı	zembîlfiroş
maraş	meres
büzüştürmek	qurmiçandin
buruşturmak	qurmiçandin
pot yapmak	qurmiçandin
kepmek	xelîn
burkutmak	xelandin
sütyen	sutyen
sürrealizm	surrealîzm
gerçek üstücülük	surrealîzm
çalar	nuans
külliye	kuliyet
mozaik	mozaîk
canlı varlık	jînewer
migren	mîgren
yarımca	mîgren
yarım baş ağrısı	mîgren
çangıl çungul	teperep
den başlayarak	ji ... û pê ve
vajinal	vajînal
uranyum	ûranyûm
savaş yanlısı	şerperest
üzerinde uzlaşmazlık olan	nakokbar
sigara tablası	xwelîdank
sigara tiryakisi	cixarekêş
resepsiyonist	resepsiyonîst
pantomim	pantomîm
maratoner	maratoner
efektif	efektîv
ayırt	vavêr
tasnif edilmiş	vavêr
çok bileşenli	pirpêkhate
çok unsurlu	pirpêkhate
çok bileşenlilik	pirpêkhateyî
çok unsurluluk	pirpêkhateyî
çıkış yolu	rêder
sendrom	sendrom
dalık	klîtorîs
kökünden	ji binî ve
incir	hejîr
birbirinin kafasını kırmak	serî li hevdû pelixandin
para etmek	pere kirin
her şeyin güzel ve alımlısı	cindî
doğmuş	bûyî
kudret hamamı	germav
ılıca	germav
arka vermek	pişt dan
koltuk vermek	pişt dan
arkasını dayamak	pişt dan
arkasını vermek	pişt dan
sırtını dayamak	pişt dan
arka çevirmek	pişt dan
arafat	erefat
nostalji	nostaljî
yurtsama	nostaljî
doğru söyleyen	rastbêj
kökünü kurutmak	binbir kirin
tarihî yer	şûnwar
yurtluk	şûnwar
gül bahçesi	gulşen
zümrüt	zimrûd
kabul etme	lêkkirin
meşkuk	meşkûk
teber	teber
ay balta	teber
ayırdına varma	lixwevarqilîn
çit sarmaşığı	lavlavk
sarmaşık bitkisi	lavlavk
faili meçhul	kujernediyar
katili meçhul	kujernediyar
diyetisyen	diyetisyen
beslenme uzmanı	diyetisyen
geriş	sîrt
çözüşmek	ji hev ketin
bülbül gibi konuşmak	li xwe danîn
şarkı mırıldanmak	norandin
laldaka	galegal
çene çalma	galegal
lakırtı	galegal
laklaka	galegal
iskân	niştin
mürit	talib
kerpeten	kêlbetan
mütebasbıs	melaq
ümera	fermandar
buyuran	fermandar
mir	amir
tanışık	hevnas
yılbaşı	sersal
yüzünü kızartmak	dan şermê
mor etmek	dan şermê
mostrasını bozmak	dan şermê
majeste	majeste
rahmetli	rehmetî
merhume	rehmetî
telin	nalet
karşılık olarak vermek	pêdan
sıtma tutmak	ta girtin
sıtmalanmak	ta girtin
ola ki	dibe ku
ihtimal ki	dibe ku
samuray	samuray
feribot	ferîbot
finans	fînans
pembe dizi	rêzefilm
ilişkide bulunmak	têkilîn
ileri görüş	pêşbînî
öngörülülük	pêşbînî
obezite	obezîte
ısırgan otu	gezgezok
şakır şukur	teqûreq
tak tuk	teqûreq
tahvil tahvil	teqûreq
tan tun	teqûreq
takır tukur	teqûreq
yatsı	eyşa
kibirsizlik	tewazî
mahviyet	tewazî
maksimal	maksîmal
çark etmek	çex kirin
taşa çekmek	çex kirin
vız	viz
tepesi aşağı gitmek	qelişîn
vermeyince mabut ne yapsın mahmut	qelişîn
sözünde durmak	xwedîyê gotina xwe bûn
hamur tahtası	xwançe
senit	xwançe
yastağaç	xwançe
kırıtkan	fingirdek
demans	demans
baskül	qapan
abuhava	îklîm
geçirim	raborîn
mal mülk	malûmilk
fotografer	fotografer
budak özü	bitik
it dirseği	bitik
çevre bilimci	ekologîst
adsız parmak	babelîç
mükemmeliyet	mikemeliyet
câiz	mubah
harakiri	harakîrî
özkıyım	xwekuştin
fok	fok
ayı balığı	fok
bit	spih
sütlüce	çing
küçük et parçası	çênî
şantiye	şantiye
yoga	yoga
otopsi	otopsî
sır olmak	com bûn
sırolmak	com bûn
içkici	meyvexwer
bilâhi	bileh
muharebe alanı	şergeh
acar	hecer
nısıf	nîvçe
fizikî yapı	qilafet
kalıp kıyafet	qilafet
başını bağlamak	bi serî kirin
merdiven dayamak	pê kirin
peygamber çiçegi	baxox
mavi kataron	baxox
vitamin	vîtamîn
kuru yemiş	çerez
ne diye?	seba çi
sirene	ajîr
suvarma	avdan
geniş çaplı	berîn
taştan yapılmış	berîn
taştan	berîn
rakı	raqî
pisliğe bulaşan	alûde
itfaiyeci	agirkuj
tutuşkan	agirgir
kolay tutuşan	agirgir
podyum	podyûm
karasaban	hevcar
el ezer	sadîst
sadik	sadîst
nalet	beddua
temkin	endaze
endaze	endaze
sakıntılı	endaze
enek	xesandî
sezmek	tê derxistin
karine ile anlamak	tê derxistin
dalgacık	pêlik
penes	pêlik
evin ortası	nêvko
korunmuş	mesûn
saklanmış	mesûn
sâlim	mesûn
mantolu böcek	quzilqurt
süt ürünleri	spiyatî
internet kafe	internetkafê
siberkafe	internetkafê
fas	fas
yuh sana	xwelîser
yontar	rende
metafor	metafor
fener külesi	fanos
fener kulesi	fener
racih	racih
sonradan görme	dinyanedî
mahv	mehf
harab	mehf
ortadan kalkma	mehf
sert rüzgar	bazor
darphane	sike
danışıklı dövüş	sike
şike	sike
danışıklı döğüş	sike
meskûkât	sike
baron	baron
çırpış	perwaz
döşem	raxe
kazıbilim	arkeolojî
yerbilim	jeolojî
soya	soya
kaynadı hale getirmek	xaşandin
gönlüne göre	li gor dilê xwe
keyfi sıra	li gor dilê xwe
keyfince	li gor dilê xwe
keyfine göre	li gor dilê xwe
kıtasal	parzemînî
kontinental	parzemînî
keşfeden	mucîd
gayriresmi	neresmî
matematik bilimcisi	jimarnas
modernlik	nûjenî
çağcıllık	nûjenî
tek erklik	monarşî
diktatorya	diktatorî
elifba	elîfbêtk
agreje	doçent
önde	li pêş
arkada	li paş
geride	li paş
apartayd	apartayd
ırk ayrımı	apartayd
emperyalist	emperyalîst
yayılımcı	emperyalîst
kürtaj olmak	ji ber birin
olur	dibe
gayri mümbit	sorax
arkadaşçık	hevalok
düşes	duşes
korte	flort
kuş üzümü	kişmiş
çok geçmeden	zûtirkê
öldürülmüş	meqtûl
katledilmiş	meqtûl
öldürülen	meqtûl
katiledilen	meqtûl
sembolize	sembolîze
mekanik	mekanîk
kasımpatı	guldawidî
batkınlık	îflas
batkı	îflas
cırlayık	çirçirk
kaypamak	fiştiqîn
fişek gibi	sipil
anemon	nîsanok
jilet	jîlêt
tıraş bıçağı	jîlêt
flamenko	flamenko
trajikomik	trajîkomîk
böbrek	gurçik
şarki	şerqî
koordinatör	koordînator
eş güdümcü	koordînator
su kenarı	delav
muayene etme	pelandin
sıvazlamak	mist dan
oğuşturmak	mist dan
çıtpıt	teqteqok
yol haritası	nexşerê
bismillahirrahmanirrahim	bismillahirrehmanirrehîm
deplasman	deplasman
özgül ağırlık	teqil
farz-ı muhal	ferzê mehal
olması	ferzê mehal
sız	ferzê mehal
olup	ferzê mehal
şeyi	ferzê mehal
monolitik	monolîtîk
en aşağı	kêmtirîn
dereke	kêmtirîn
ı	serokherêm
navigasyon	navîgasyon
bundan böyle	nema
enver	enwer
nuri	nûrî
kırarak açmak	verîşandin
tek yürek	yekdil
holistik	holîstîk
tedavül	tedawil
sirkülasyon	tedawil
revaç	rewac
cam evi	camxane
pound	pawin
tırabzan	tirabzan
tazmin	tezmîn
litre	lître
unutulmak	ji bîr bûn
anımsamak	hatin bîrê
aklına yatmak	ketin serî
muhabbet beslemek	jê hez kirin
sevgi beslemek	jê hez kirin
yakınlık duymak	jê hez kirin
hazzetmek	jê hez kirin
kordon	rêze
kurtlu	kirmî
kurtlanmış	kirmî
tahrip olmak	helişîn
helmelenmek	helişîn
helmelenme	helişîn
turistik	geştyarî
bando	bando
editör	çapker
naşir	çapker
yok... deve	lo
teorik	teorîk
nazari	teorîk
balkı	birqok
tedirgin olmak	qilqilîn
tedirginleşmek	qilqilîn
işkilli olmak	qilqilîn
yüpürmek	qilqilîn
aşna fişne	dostik
katedral	katedral
başkilise	katedral
çok büyük	bertelaş
çam yarması	bertelaş
masif	bertelaş
helezonik	kovel
pek az	piçîskek
kuluçkaya yatmak	kurimîn
yukarı fırlamak	çeng bûn
avuçlamak	çeng kirin
aslan sürüsü	şêrgele
yukarıya doğru yürümek	helkişîn
hanbalık	pekîn
ateşi kül ile örtmek	temartin
itaatsızlık	neguhdarî
tek seslilik	yekdengî
tek sesli	yekdengî
oy birliği	yekdengî
hayvanat bahçesi	baxçeyê heywanan
fütur etmemek	xem jê nexwarin
dikkatini vermek	dêna xwe dan
kötü talihli	bedbext
babam!	herûher
tamtakır	virt û vala
ürün vermek	jê hatin
imkan dahilinde	jê hatin
mal kaldırmak	jê hatin
minimüm	esxerî
yırtıcıca	wehşiyane
görüm	bînahî
görme yetisi	bînahî
optik	bînahî
görme yeteneği	bînahî
nasyonalsosyalist	nasyonalsosyalîst
evolüsyon	evolusyon
yaya köprüsü	pêbazk
rükün	rukn
felsefik	felsefîk
buy otu	şembelîk
bakla	baqil
çitlembik	kizwan
bıttım	kizwan
çıtlık	kizwan
damned	malmêrat
aklı kısa	hişsivik
peyder pey	pêde pêde
usanmış	zinaqî
megaloman	megaloman
fağfur	ferfûr
rekor	rekor
kül küreği	carûd
toz küreği	carûd
sobacı küreği	carûd
ahmet	ehmed
benyamin	binyamîn
selamünaleyküm	selamuneleykum
alimallah	bi xwedê
allah bir	bi xwedê
aleykümselâm	eleykumeselam
streofoni	stereo
ceylan balası	karxezal
ne gibi?	bi çi şêweyî
fatih	cîhangir
tepe camı	rojen
hint yer elması	qencelîsk
üstüne kapanmak	xwê dan
kendini vermek	xwê dan
kendini bir şeye vermek	xwê dan
asma kabağı	dolmik
ortakçı	nîvekar
mızraksız	bêrim
yeltek	bêhawe
fırdöndü	bêhawe
nazı geçmek	erc
çöl fırtınası	ecac
neyin nesi	çiteba
bir süre	çend pat
yalı kazığı gibi	rewtele
sırık gibi	rewtele
zürafa gibi	rewtele
alaçık	holik
kemer yokası	avzûnik
mide fesadı	berşoşk
mide ekşimesi	berşoşk
birbirlerine doğru	berbihev
anarya	beropaş
künküldemek	hênijîn
küngürdemek	hênijîn
tek tük	firk
kasınç	firk
şok olmak	velîstin
üzüm sepeti	qetûf
kerki	tevşo
bekitmek	xitimandin
sayılmayan	nelê
almak için uzanmak	gal
örtenek	betan
boğası	betan
numaracı	fenek
kilit dilciği	zimanok
fol	motik
yatı	şevbêrk
hacamat	çelitîn
at perçemi	tûmik
yal	şolik
ateşe tutulan yada yaklaştiran dokuma	qemitîn
omurilik	termask
vagina	berzik
vulva	rûv
kızgın yağda kızartmak	qijilandin
cızırdatmak	qijilandin
dağ lalesi	gangulok
manisa lalesi	gangulok
paniğe vermek	qurifandin
ötüm	fîkîn
loğlama ağacı	qeysik
ağaçlık	gulp
cesametli	qerase
iri yapılı	qerase
yarma gibi	qerase
geyirti	qulpik
sepet kafalı	serkundir
temizlik bezi	potik
kuru dal	hejik
kül çöreği	xewre
kömbe	xewre
sahanda	xewre
kulplu tava	miqilk
hafiften aksamak	nicimîn
istifleme	nicimandin
nebula	pêwr
kavrak	kewş
tuturuk	kewş
tütün kesesi	kizik
desti	şerbik
yalazlamak	kemitandin
yalazlama	kemitandin
muska böreği	şamborek
mayasız etmek	şikeva
gün ortası	navroj
gündüz ortası	navroj
öğlen	navroj
zeval vakti	navroj
bodur pas	korik
taş bademi	korik
buğday sürmesi	korik
bir lahza	bîstek
irticalen	ji ber xwe ve
bilir bilmez	ji ber xwe ve
tayın	zewade
boduç	kodik
göğüs tahtası	kodik
proto hint-avrupa dili	proto-hindûewropî
kara silüet	reşahî
müstemleke	mêtingeh
fule	qevz
uzun adım	qevz
hacamatlama	çelitandin
hacamatlamak	çelitandin
şişlik	werm
kabartılmış	nepixandî
şişirilmiş	nepixandî
cehri	gijok
güvem eriği	gijok
prospektüs	prospekt
tanıtmalık	prospekt
tarife	prospekt
dönülmek	fetilîn
imsi	oşk
sarımtrak	berzere
sarı humma	zerikî
kılıf	qewlik
kısmık	pintî
sağlıksal	nişmî
yeşil mercimek yemeği	hebnîsk
yayla çorbası	şorbeşîr
süt çorbası	şorbeşîr
çırçır	çirik
hallaç	çirik
çırçır makinası	çirik
kâp	kap
dul avrat otu	gûriz
domuz pıtrağı	gûriz
kandırık otu	gûriz
öküz dili	gûriz
sığır dili	gûriz
uzlaşmaz	lihevneker
kızılkuyruk	terîsork
nakliyatçı	barkêş
melengiç	şînok
menengüç	şînok
kadran	şînok
küçük çakıl taşı	xîçik
tüyleri yanma	kizirîn
alazlamak	kizirandin
gaybubet	tunebûnî
bozuk düzen	bêpergal
çapak oluşmak	şeliqîn
pişik olmak	şeliqîn
pişik yapmak	şeliqandin
kezeb	şelaq
ot bitmeyen yamaç	qelaç
şakketmek	qelaştin
gecikme yapmak	ewiqîn
kan emici	xwînmij
vampir	xwînmij
sendeleyen	şewişî
sarhoşluk	serxweşî
matizlik	serxweşî
içi geçmiş	buhurî
olmazlık	nabehî
yüreği geniş	dilfireh
kaçışma	teriqîn
buğu	keldûman
nakliyat	barkêşî
kargo	barkêşî
anaforcu	kedxwar
istismarcı	kedxwar
şeniyet	berrahî
gözütok	çavtêr
gözü tok	çavtêr
kanık	çavtêr
tokgözlü	çavtêr
gönlü gözü tok	çavtêr
madrup	lêketî
boğulmuş	fetisî
bunaltıcı	fetisok
gelinboğan	fetisok
yağız doru	kimêd
moderator	moderator
iç çamaşır	bincil
kovlama	xeyb
kov	xeyb
anlayış göstermek	lê negirtin
hoş görmek	lê negirtin
kusura bakmamak	lê negirtin
para etmemek	pere nekirin
keşişleme	qîble
kıble	qîble
çekip çevirmek	lê nerîn
jambon	jambon
vapur	vapûr
flit	pilte
fayton	payton
payton	payton
ruhunu vermek	can dan
kokurdan	kortik
emen	kortik
gıllügiş	qerez
kavalyelik	şekirokî
yumuşağımsı	nermolekî
sıcağımsı	germolekî
ıslağımsı	şilorekî
döllendirmek	gadan
cızırdamak	qijilîn
cazırdamak	qijilîn
baloncuk	peqok
acıkmak	birçî bûn
acıkılmak	birçî bûn
uykusuz	bêxew
farkındalık	lêhaybûn
zipzip	xarik
yıldönümü	salveger
yıl dönümü	salveger
hayvanı iple kazığa bağlamak	tewilandin
örklemek	tewilandin
atı bağlamak	tewilandin
kuzugöbeği mantarı	feqîroşk
ezilip yamyassı olmak	pelixîn
mükellefiyet	mikelefiyet
savrulmuş	berbahî
canavar otu	dîbek
arkaç	guher
kılçıklı saman	kesmûk
beyincik	mejîk
akarca	avgerm
üzümcü	rezvan
bağcılık	rezvanî
üzümcülük	rezvanî
bit yavrusu	nûtik
madeni para	perîk
yüce gönüllülük	mêranî
göçü	hezaz
hırpo	xirbo
sümbül	simbil
tohum ekme makinası	mîbzer
birden bire	ji nedî ve
sorumak	mijîn
soruma	mijîn
patoz	patoz
batöz	patoz
kredî	ewlek
tay tay arabası	girgirok
oyuncak araba	erebok
çömme	qelafîsk
alyans	hungulîsk
nabız gibi atma	rehjen
ruhsat verme	anahîdan
ruhsat vermek	anahî dayîn
çözüm yolu	rêçare
hal yolu	rêçare
idam etme	sêdaredan
erçekçî	beravan
elbiselik kumaş	pirtû
savunma hakkı	mafê parêzî
kudret helvası	dayî
geviş getirme	kayin
akıntıya kapılmak	bi ro de çûn
raksettirme	reqisandin
raksettirmek	reqisandin
çitar	çitare
tuzcu	xwefiroş
nüfus sayımı	serjimar
sayım memuru	serjimar
iklimleme cihazı	kilîma
geçiştirici	derbasker
kürümek	ber kirin
kürelemek, küremek	ber kirin
hayhay	ser çavan
ağızdan kaçırmak	şepilandin
girinti çıkıntılar	xirtik
kılınç	şemşîr
yeşilbaş	şûna
çamur atmak	navzirandin
soya çekim	weraset
bakımcı	xwedîker
gaza	xeza
gazze	xeza
ilâç	darû
tahir	tahir
fevkalade	niwaze
bağlanıp kalmak	bendeman
karı kocalık	jinûmêrî
itidalini muhafaza etmek	xwe ragirtin
kedine	xwe ragirtin
tıkınmak	nepixandin
müebbed	sermedî
ömür boyu	sermedî
edebiyet	sermedî
meyvedar	mêwedar
yemişli	mêwedar
taş koymak	nehêlan
arıklık	lawazî
baştan	ji serî ve
baştan beri	ji serî ve
yeni baştan	ji serî ve
ilk elden	ji serî ve
bolşevik	bolşevîk
hoybun	xoybûn
tek erkçi	monarşîst
başlayıcı	destpêker
müptedi	destpêker
1'inci	1em
1.	1em
2'nci	2yem
2.	2yem
13'üncü	13em
13.	13em
süvari	siwarî
süvarilik	siwarî
varışlı	bîrbir
... sayesinde	bi xêra
çeşitleme	guharto
gönül borçlusu	minetdar
eleştirmen	rexnegir
kendine güvenen	jixwebawer
özgüvenli	jixwebawer
yepelek	narîn
üstüne düşmek	bi dû ketin
üzerine düşmek	bi dû ketin
peşinden yürümek	li pey çûn
önlenmek	pêşî lê girtin
önü alınmak	pêşî lê girtin
büyük britanya	brîtanyaya mezin
sen nehri	seyn
merhamete gelmek	lê hatin rehmê
kendine gel	hay ji xwe hebûn
varda	hay ji xwe hebûn
cart kaba kâğıt	hay ji xwe hebûn
adımını denk atmak	hay ji xwe hebûn
uğurlar olsun	oxir be
devletle!	oxir be
saadetle	oxir be
uğurlar ola	oxir be
izzet ü ikbal ile	oxir be
yolun açık olsun	oxir be
uğur ola	oxir be
ona sebeb	ji ber wê yekê
binaenaleyh	ji ber wê yekê
münasebetiyle	ji ber wê yekê
neticeten	wek encam
dokuncasız	bêziyan
ziyansız	bêziyan
andırışmak	bi bîr xistin
tahattur etmek	bi bîr xistin
başyapıt	şaheser
memnun edici	dilxweşker
sevindirici	dilxweşker
şampanya	şampanya
hava kabarcığı	bilq
aşağıya doğru	ber bi jêr ve
şirretlik	hetikî
birahane	bîrexane
verek	berxik
yuvarlanıp gitmek	pê girtin
bir yol tutturmak	pê girtin
kara yazı	bextreşî
ses bilimi	dengnasî
etrafını sarmak	dor lê girtin
ortaya almak	dor lê girtin
aklı başına gelmek	bi ser xwe ve hatin
küreselleşme	goganîbûnî
küresel ısınma	germbûna goganî
öğleden önce	pêşnîvro
kayak sporu	kaşe
patır kütür	tepûrep
pat küt	tepûrep
kendine uydurmak	li xwe anîn
kamyonet	kamyonet
etmemek	nekirin
kıyamamak	nekirin
mum dibine ışık vermez	nekirin
yapmama	nekirin
etmeme	nekirin
çoraklık	bêwecî
ayağa kalkmak	rabûn ser xwe
ayağa fırlamak	rabûn ser xwe
ayakları üstüne kalkmak	rabûn ser xwe
yürümeye başlamak	rabûn ser xwe
erosçuluk	erotîzm
eros	eros
benek benek	pitik pitikî
ayaklarını uzatmak	pê radan
nefeslenmek	bêhn vedan
yorgunluk çıkarmak	bêhn vedan
temasta bulunmak	dest lê dan
alkış tutmak	çepik lê dan
el basmak	dest lê kirin
requiescat in pace	xwedê vê dinyayê neîne bîrê
mültefit	rûken
teşne	minêkar
yecüc ve mecüc	yecûc û mecûc
santrifül	santrîfuj
merkezkaç	santrîfuj
jeopolitik	jeopolîtîka
seksoloji	seksolojî
demokratik toplum kongresi	kongreya civaka demokratîk
boşalım	deşarj
deşarj	deşarj
sehpaya çekmek	bi dar ve kirin
berdar etmek	li sêdarê dan
karteiâ	tabela
kartelâ	tabela
doğru düzgün	biserûber
düzenli ve planlı	biserûber
muttarit	birêkûpêk
dakik	birêkûpêk
naat	naed
yedisinde neyse yetmişinde de o olmak	kirmê şîrî heta pîrî ye
prosedür	prosedûr
morula	xaşe
köreşe	xaşe
sosyaldemokrat	sosyaldemokrat
sosyaldemokrasi	sosyaldemokrasî
sosyal demokrasi	sosyaldemokrasî
iki dilli	duzimanî
basketbolcu	basketbollîz
basketçi	basketbollîz
feminist	femînîst
dakikasında	derhal
müşkülpesend	terwende
mintan	kurtik
antifaşist	antîfaşîst
yağmurölçer	baranpîv
anemometre	bapîv
rüzgâr ölçer	bapîv
yelölçer	bapîv
basınçölçer	pestopîv
biçim alanı	dirûngeh
muhakik	lêpirsker
teokratik	teokratîk
su vs. nin sıçraması	pijiqîn
bıçak kemiğe dayanmak	kêr gihiştin hestî
sıçrayan sıvı	pejk
kuzeydoğu rüzgârı	werzeba
kanatlı hayvanların sesi	wîzewîz
kanatlı hayvan sesleri	wîtwît
birçok küçük parçaya parçalanmış	qetqetî
konfederal	konfederal
jenerik	jenerîk
kamera	wênekêş
pik	pîk
allah razı olsun	xwedê ji te razî be
sağ olsun	xwedê ji te razî be
su gibi aziz ol	xwedê ji te razî be
kulağı çınlasın	xwedê ji te razî be
su gibi aziz ol!	xwedê ji te razî be
allah hoşnut olsun	xwedê ji te razî be
allah selâmet versin	xwedê ji te razî be
pilates	pîlates
meditasyon	medîtasyon
insan kaynakları	çavkaniyên mirovî
eşeğinı sağlam kazığa bağlamak	pişta xwe pê girê dan
ümit bağlamak	pişta xwe pê girê dan
etnomüzikoloji	etnomuzîkolojî
o vakit	wî çaxî
kara humma	tîfo
enterne	di bin çavan de
mahfuzen	di bin çavan de
kırmançça	kirmanckî
kırmanca	kirmanckî
bostan evleği	kerdî
kandil gecesi	şevçira
gece feneri	şevçira
gece kulübü	yaneya şevê
prolog	pêşgotin
epilog	epîlog
kısım kısım	peyderpey
peyâpey	peyderpey
tefrit	tefrît
meskût geçmek	negotin
sezeryen	neştergeriya sezeryen
fetus	korpele
fötus	korpele
operasyonel	operasyonel
operatif	operasyonel
takatı kalmamak	pinisîn
kuvveti kalmamak	pinisîn
alacakarga	qijik
yaş odun	tirrik
şiir dostu	helbesthez
ritimsiz	bêaheng
destursuz	bêdestûr
flârmonik	muzîkhez
ayıcık	hirçok
oyuncak ayı	hirçok
bozayı	hirçên gewr
dev panda	hirçên belek
karaman kimyonu	jaj
frenk kimyonu	jaj
aromatik	bêhnxweş
rayihalı	bêhnxweş
yaşamını yitirmek	jiyana xwe ji dest dan
aile bahçesi	teyar
peru	perû
süreya	perû
uruguay	ûrûguay
i̇ran i̇slam cumhuriyeti	komara îslamî ya îranê
vaşak	werşeq
takımyıldız	komstêr
tetikte	amadebaş
dikkatlı	amadebaş
muz cumhuriyeti	komara mûzan
sonunu almak	birin serî
püskürük	reşreşk
karaca ot	reşreşk
birisi	filankes
ince hastalık	jana zirav
mikrobiyoloji	mîkrobiyolojî
mikroorganizma	mîkro-organîzma
diyabetik	nexweşên şekirê
biyokimya	biyokîmya
biyoteknoloji	biyoteknolojî
sabaha doğru	destê sibê
siyonist	siyonîst
siyonizm	siyonîzm
piranşehr	pîranşar
obüs	obûs
cevaplamak	bersivandin
eski nors dili	norsiya kevn
hukuksal	hiqûqî
faşizan	faşîzan
tiranik	tîranîk
tanrı seni kutsasın	xwedê te bihêle
el öpenlerin çok olsun	xwedê te bihêle
himmetin var olsun	xwedê te bihêle
çok yaşa	her bijî
çok yaşayın	her bijî
tıksırık	pijmîn
tıksırma	pijmîn
eline sağlık	destxweş
hayvan aksırması	firijîn
kapsayıcı	şamil
darbeci	darbecî
antitez	antîtez
silahtar	sîlehdar
amiral	amîral
kalubeladan beri	ji roja roj de
düden	kortal
işi çıtlatmak	derheqê
mülahazat hanesini açık bırakmak	derheqê
katarpil	maşot
mozole	mozole
kızıl meydan	meydana sor
sscb	ykss
merkez bankası	banka navendî
bankasal	bankî
oligarşi	olîgarşî
takım erki	olîgarşî
soylu erki	arîstokrasî
karar verici	biryarder
siyasal bilgiler	zanistên siyasî
siyasal bilimler	zanistên siyasî
tam zamanlı	tam-demî
gösteri yeri	şanogeh
kombinezon	kombînezon
hoşa gitmek	li xweşiyê hatin
muhtaç olma	hesilîn
muhtaç etmek	hesilandin
muhtaç etme	hesilandin
soğuk yüzlü	rûsar
medyatik	medyatîk
inildemek	zimîn
inildeyiş	zimîn
öksürmek	kuxîn
sinirleri kuvvetli	bêhnfireh
deryadil	bêhnfireh
sabır taşı	bêhnfireh
tahammül sahibi	bêhnfireh
içi geniş	bêhnfireh
hafızası zayıf	xêvik
unutulmuş	jibîrkirî
erginlemek	tê gihandin
müsteşar	birîkar
delinin eline değnek vermek	dil dan
tesmiye etmek	bi nav kirin
ad takmak	nav lê kirin
ad vermek	nav lê kirin
rapt olunmak	çespîn
raptiye olunmak	çespîn
yeşim (jasp)	yeşim
yeşim	yeşim
muavinlik	cîgirî
bir deri bir kemik kalmak	perixîn
mest etmek	perixîn
masaj yapmak	perixîn
bitab düşmek	dewixîn
kılıbık	serjinik
bereket versin ki	xweşbextane
çıt kuşu	mişkxatûn
çift şeritli	cotsayid
ikamet ettirmek	akincî kirin
iskan ettirmek	akincî kirin
kara delik	çalereş
bedensel engelli	kêmendam
daraç	barîk
üzüm sirkesi	sihik
çekinme duygusu	perwa
katırtırnağı	şivîşk
gereç	posat
uskur	perwane
vantilatör	pank
varta	gît
badire	gît
öbür gün	dusibe
canını sıkmak	li kundir dan
rahatsızlık vermek	li kundir dan
attığını vuramamak	li kundir dan
rezil rüsva etmek	xistina koda kemançê
şerefini beş paralık etmek	xistina koda kemançê
işi yolunda gitmek	ji yekî ra lê hatin
şansı olmak	ji yekî ra lê hatin
sütre	siper
donama	arastin
dirsekle vuruş	niquçk
dirsekle itekleme	niquçk
cepken	şepik
yukarı çıkarmak	hilkişandin
kökten çekip çıkarmak	hilkişandin
parlak böcek	golala zêrîn
pota	botik
evde göz hapsi	binçavdêriya di malê de
karavan	karavan
gazlıbez	kitan
soğuk bez	kitan
sukut	kitan
çoban kepeneği	kepeng
söğütlü	bîdar
ağaçlı	bîdar
ağaçlıklı	bîdar
ters çevrilmiş	dernexûn
sara nöbeti	fê
başa çıkmak	pê kanîn
göçüşme	metatez
hedefi vurmak	fût neçûn
karavana atmamak	fût neçûn
distribütör	belavker
dağıtımcı	belavker
müvezzi	belavker
dağıtıcı	belavker
stok etmek	nijinandin
karaağaç	bizî
kara ağaç	bizî
terki	qorik
kefal	masîpehnik
sazan balığı	masîpehnik
sarı balık	masîzerk
kortej	kortej
regülâtör	regulator
altın top	greyfûrt
üst simge	jornivîs
üstsimge	jornivîs
alt simge	jêrnivîs
altsimge	jêrnivîs
alt başlık	binnivîs
karekök	rehê duyem
reyting	reyting
rating	reyting
ifade özgürlüğü	azadiya gotinê
basın özgürlüğü	azadiya çapemeniyê
hareket özgürlüğü	azadiya gerînê
simsiyah	ripîreş
kapkara	ripîreş
mundar	hilîheram
çok pis	hilîheram
sapsarı	zipîzer
jokey	jokey
hippodrom	hîpodrom
hipodrom	hîpodrom
darp izi	şepelor
yağmurluk	baranî
çürüklü	hîledar
alil	nexweşokî
ay aydınlığı	mehtav
dikenli çöğen	fisegur
haber deyince	hahanka
elbistan	elbistan
biat	biyet
eski püskü	kevnik
pabuççu	koşkar
peygamberdevesi	koşkar
şalpa	şelpe
gaz boyaması	dolbend
boğaz olmak	tamijîn
tadı damağında kalmak	tamijîn
tadına varmak	tamijîn
zevkine varmak	tamijîn
matuf olmak	xerifî
erkek piliç	ferx
tahta kapı sürgüsü	şobik
besleme kız	qerwaş
beslengi	qerwaş
gündelikçi kadın	qerwaş
kadın hizmetçi	qerwaş
levent	lewend
sof	bendewarî
beklenti	bendewarî
beklenti içinde olma	bendewarî
geciktirim	bendewarî
kartuş	kartûş
kalak	qelax
nebati şeker	qend
eliyle	bi destî yekî/yekê
hayır kalmamak	xêr tê de neman
tadı tuzu kalmamak	xêr tê de neman
güdük, göbek	xilik
hayır ola	te xêr e
kellepaça	serûpêk
ortak söylem	hevo
kiralık	dêmanî
suna	miravî
kolalama	reqandin
kolalamak	reqandin
kolalayış	reqandin
şakırdatma	reqandin
şakırdatmak	reqandin
takırdatmak	reqandin
tıklatma	reqandin
tıklatmak	reqandin
pis kokulu	bêhnewî
mahmur çiçeği	pîvok
ölçü kabı	pîvok
kızılcık	helhelok
boğadikeni	pêgur
hayret verici	hişmiraz
statüko	statuko
bunun üzerine	li ser vê
binaen	li ser vê
göcek	qesîl
toprak nemi	telbîz
perfeksiyonist	perfeksiyonîst
mükemmeliyetçi	perfeksiyonîst
haveyis	pelhewes
yönetim yeri	dolîwgeh
yemek borusu	soricik
özofagus	soricik
ayrık otu	firêz
frenk maydanozu	penîrok
endemik	endemîk
venüssaçı	giyazava
domuz ayrığı	karûş
zilli maşa	tole
işitme cihazı	bihîstok
mezgeldek	berçirik
üsteğmenlik	şerpelî
raşitik	şaht
yer cücesi	xasok
sürgü kolu	zirze
köpek üzümü	rezrûvîk
çuvaldızın büyüğü	bişûjin
bilgisine sunmak	dazanîn
batman çakıla karıştı	girara gavan
bey bellisiz meydan ıssız	girara gavan
celbe	çeltik
omuz çantası	çeltik
ektoderm	şilx
üst deri	şilx
dış deri	şilx
bastık	bastêq
gönder	misas
mesas	misas
övendire	misas
övendere	misas
sülf	kerkît
tarakçık	şehik
keler	gumgumok
siirt kertenkelesi	gumgumoka sêrtê
pandül	darkoke
şecere	darkok
soyağacı	darkok
örüm	şevîn
dişi domuz	mahû
hıyarcık	xiyarok
koca engerek	koremar
karun	qarûn
zebelleh	zebanî
fışıldama	xuşîn
fışırdama	xuşîn
çağıldama	xuşîn
zencefil	zencefîl
dalga gecmek	laga
zombi	zombî
batini	batinî
içrek	batinî
ballad	balad
balat	balad
balgam	belxem
mukus	belxem
balistik	balîstîk
balo	balo
barî	balo
bandrol	bandrol
çopra	dasî
gelmiç	dasî
baptist	baptîst
nasıl oldu da	çi qey
ne oldu da	çi qey
üçte bir	seyek
fışırdatma	xuşandin
hışırdatma	xuşandin
mango	mango
çatıştırmak	bera hev dan
vuruşturmak	bera hev dan
birbirine kurşun sıkmak	bera hev dan
mitil	metîl
metil	metîl
kaydıraç	xwêrkişok
vatka	heşû
bozkır toygarı	kolik
engebeli	kolik
soluğan	kolik
adem kemiği	zengilorik
halkalı küçük cılıbıt	xilxîlok
kaya sıvacısı	berkute
büyük kaya sıvacısı	berkuteyê mezin
büyük kaya sıvacı kuşu	berkuteyê mezin
besin değeri	adan
yan sokak	alûle
mama.	ararot
mama	ararot
bezenmiş	arastî
donatılmış	arastî
teçhiz edilmiş	arastî
tirit.	avdonk
temiz.	avîje
radyoterapi	radyoterapî
lazer	tavperşker
şekerrenk	bi serê poz
dilinin ucuyla	bi serê poz
yarı buçuk	bi serê poz
burnu sürtülmek	li ber xwe ketin
dövünmek	li ber xwe ketin
inme inmek	kût bûn
katapult	mencenîq
aroma	akil
aort	aort
argon	argon
artezyen	artezyen
astat	astat
astatin	astat
atol	atol
mercan adası	atol
averaj	averaj
bakalorya	bakalorya
mezuniyet diploması	bakalorya
batarya	baterya
brom	brom
cünüp	cenabet
bir kenara	derkenar
bir tarafa	derkenar
emirname	emirname
esans	esans
derd	eza
fi sayısı	fi
fosfor	fosfor
fotosentez	fotosentez
ayaktaş	hempa
sakıntı	ihtiyat
istimlak	istimlak
mürekkep balığı	kalamar
merkepçi	kervan
kobalt	kobalt
kolhoz	kolhoz
kompas	kompas
konkordato	konkordato
kontenjan	kontenjan
kota	kontenjan
konteyner	konteyner
kontrbas	kontrbas
kanyak	konyak
konyak	konyak
konçerto	konçerto
bağlılaşım	korelasyon
korelasyon	korelasyon
krom	krom
kros	kros
ksenon	ksenon
lekan	lekan
mermer	mermer
metastaz	metastaz
moka	moka
değişinim	mutasyon
mutasyon	mutasyon
nektar	nektar
bal özü	nektar
neon	neon
nezir	nezir
pagan	pagan
pagoda	pagoda
palet	palet
stoklama paleti	palet
yüzme paleti	palet
tank paleti	palet
paradoks	paradoks
intiha	payan
perdedar	perdedar
protez	protez
radon	radon
reel	reel
kum falı	remil
rota	rota
kuru bitki gövdesi	sap
seans	seans
semafor	semafor
siyer	siyer
ıskala	skala
balık yemi	tamik
tango	tango
tantal	tantal
telefat	telefat
tersane	tersane
topografya	topografya
tost	tost
trompet	trompet
troyka	troyka
uf	uf
vals	vals
çekoslovak	çekoslovak
çelo	çelo
kethüda	kedxuda
vergi dairesi	bacgeh
kentlileşmek	bajarî bûn
bali	balî
mandıracı	banedar
bol doğramak	belawela kirin
uyruk	bendegan
köleler	bendegan
kullar	bendegan
uyrukluk	bendeganî
iç güvey	benîzava
bağan	beravêtî
manivela	beraze
olagelmek	berdewam kirin
süregelmek	berdewam kirin
sürüp gitmek	berdewam kirin
yapadurmak	berdewam kirin
tarziye	bergerîn
provizyon	bergîdan
doğurgan	berhemdar
manda düvesi	berkele
kesim hayvanı	berkêr
sigara kağıdı	bermax
akuri	berwar
kıstak	berzax
binek atı	berzîn
kânun	berçile
kanunuevvel	berçile
beş vakit namaz	berêvar
akşam üzeri	berêvar
akşamüstü	berêvar
uğuru açık	bextvekirî
baharlık	bihare
fışkırış	bijiqîn
tokurtu	bilqînî
altlık	binik
bardak altı	binik
bardak tabağı	binik
jüpon	binkirask
gözlem altına almak	binçav kirin
gözlem altı	binçavî
süt erkek kardeş	biraşîr
sütkardeş	biraşîr
teşkilâtlı	birêxistî
yara almak	birîndar bûn
ardıç kuşu	boqije
boz bakkal	boqije
buhurdan	bosîdank
ağaç koruluğu	boşelan
muztar	bêgav
adımsız	bêgav
namussuzluk	bênamûsî
beynamaz	bênimêj
namazsız	bênimêj
bitimsiz	bêpayan
uçsuz	bêserî
rehbersiz	bêserî
beşeri	bêserî
vatansız	bêwelat
yalımı alçak	bêzirav
sigorta etmek	bîme kirin
halbur hurması	bîşî
eğirdek	bîşî
canbazlık	canbazî
can veren	canbexş
içli dışlı	canecan
kötü laf	caris
tekstil dokumacısı	cawker
nasır	cedew
arpağan	cehdasî
cehennemi boylamak	cehimîn
mürt olmak	cehimîn
çatlama sesi	ceqin
vidalamak	cer kirin
tecrübe edilmek	ceribîn
yapağı	cezwe
ayrişmak	cihê bûn
elbiselik	cildank
lades oyunu	cinaq
durulmuş	cincilî
azize	cindê
pamuk toplamak	cinê kirin
küçük bahçe	cinên
lanetli kişi	cinûs
lanetlî	cinûs
itici	cirnexweş
madara	cirnexweş
cirit	cirîd
coşkulanmak	coşîn
galeyan etmek	coşîn
coşkulanma	coşîn
galeyana gelmek	coşîn
cırnık	curnik
saplı süpürge	cêrifk
gönderilen yer	cîher
taarruza geçmek	daberizîn
taarruz etmek	daberizîn
çocuk bakıcısı	dadik
üzerinde düşünmek	dahiştin
mütalaa etmek	dahiştin
mütalaada bulunmak	dahiştin
icat eden	dahêner
kaynatılmış buğday	danû
ahkâm	daraz
teskere	darbest
vergi memuru	daroxa
ırz düşmanı	dawpaqij
laf yemek	daxwarin
içine atmak	daxwarin
içine sindirmek	daxwarin
verimkâr	dayox
tank	debabe
alaz	degme
itelemek	dehf dan
dessas	dekbaz
madikçi	dekbaz
fırıldakçı	dekbaz
çatal görmek	delîn
takatsiz kalmak	delîn
yorgun düşmek	delîn
icar alan	demandar
dan dun	dengeding
dövme yapmak	deq kirin
derbeder olmak	derbider bûn
derbeder etmek	derbider kirin
tetanos	derdekopan
yakalama müzekkeresi	derdestname
gaileli	derdmend
anakronik	deredemî
çağ dışı	deredemî
anakronizm	deredemî
ağaçtan örülen kapı	dergîl
kefaletname	derhûdname
besiye çekmek	dermale kirin
ortaya atmak	derpêş kirin
ortaya sürmek	derpêş kirin
serdetmek	derpêş kirin
derpiş etmek	derpêş kirin
dermeyan etmek	derpêş kirin
eski zaman	dersal
ağıl kapısı	derîçe
kapakçık	derîçe
manevi kardeş	destbirak
yetke	desthilatî
fors	desthilatî
el sanatları	destkarî
kazanılmış	destkeftî
elde edilmiş	destkeftî
elde kalan	destmaye
ahiret kardeşi	destxwişk
muvaffakat etmek	destûr dan
izin verilmek	destûr dan
kabulü olmak	destûr dan
izin belgesi	destûrname
izinname	destûrname
muvafakatname	destûrname
söz yarışı	devjenî
ağız tartışması	devjenî
ağız dalaşı	devjenî
ağız kavgası	devjenî
cidal	devjenî
söz düellosu	devjenî
karşıtçı	dijraber
kontra	dijraber
mugayir	dijraber
gönül etmek	dil kirin
yüreği katı	dilhişk
meftun	dilikî
tevazulu	dilnizm
ferih fahur	dilrehet
gönül ferahlığı	dilrehetî
gönül rahatlığı	dilrehetî
gönül yapıcı	dilsaz
yüreği dar	dilteng
bungun	dilteng
bunlu	dilteng
ince duygulu	diltenik
yüreği yufka	diltenik
fırlak dişli	diranqîç
kazma diş	diranqîç
sürünceme kalmak	dirêj bûn
vaktini almak	dirêj bûn
lafı uzatmak	dirêj kirin
dikenli çalı	dirî
abse	dojeder
amerikan bezi	doq
insiyak	dozîn
sağımlı	doşanî
deri ip	duhêl
düvel	duhêl
hastalık belirtisi	dujang
ikiye katlamak	duta kirin
lohusa	duxaskan
kancıklık	dêliktî
dev endamlı	dêwendam
dev boylu	dêwendam
görünürlük	dîdarî
görsellik	dîtbarî
nazarî	dîtinî
divanı hümayun	dîwanxane
bakaç	dûrebîn
erişilmez	dûredest
erişilmesi güç	dûredest
uzun kuyruklu	dûvedirêj
kuyruklu yıldız	dûvstêrk
adana	edene
agel	egal
ucuzlatmak	erzan kirin
mirasta kadının payı	erşêt
uzaycı	esmanger
uzaycılık	esmangerî
esrar içen	esrarkêş
avare olmak	eware bûn
rötar yaptırmak	ewiqandin
yarına atmak	ewiqandin
yediemin	ewlemend
havlatmak	ewtandin
hınkırmak	ex kirin
iyot gibi açığa çıkmak	aşkere bûn
film etmek	aşkere kirin
köşegen	eşkêl
fatiha	fatihe
fedakâr	fedakar
falaka	feleqe
buyurun	fermo
farz kılmak	ferz kirin
farz etmek	ferz kirin
var saymak	ferz kirin
uzaylı	fezayî
kalkık burunlu	feçer
ibra etmek	fihêl kirin
tebriye etmek	fihêl kirin
basık burunlu	filç
şabak	fincik
hopurdatmak	fir kirin
höpürdetmek	fir kirin
güldür güldür	firefir
genelmek	fireh bûn
havalimanı	firgeh
seyrekleştirmek	firk kirin
yaşartıcı	firmêskrêj
ağız(ilk sütten yapılır)	firo
osurmak	fis kirin
başıboş gezen kimse	fistoqî
ortadan kaybolmak	fizirîn
gizliden kaçmak	fizirîn
afı kesmek	fors kirin
aklı basmak	fêm kirin
ıslık çalma	fîkandin
fit etmek	fît kirin
diplemek	fît kirin
meydana sürmek	fît kirin
ağlaşmak	fîzar kirin
ineği boğaya çekmek	ga dan
misk sığırı	gamisk
isterik	ganek
tarla at kuyruğu	gangilok
büyük meydan	gasingeh
cinsi münasebette bulunmak	gayîn
celpname	gazîname
tellal	gazîvan
incir kurdu	gazîz
büyük davul	gebirge
toz haline getirmek	gelifandin
daire merkezi	gelû
güreştirmek	gemşandin
açık esmer	genimî
buğdaysı	genimî
su alaborası	gerav
terhin	gerew
ılışmak	germijîn
yemeğin sıcaktan bozulması	germixîn
sıcaklıkölçer	germjimêr
çevri	gerînek
güvez	gevez
karmakarışık saç	gevzol
artık yıl	gibîse
dikleşmek	gij bûn
taranmamış	gijik
palazlanmak	giloxe bûn
saydam tabaka	gilêne
ciban	gilêne
hımhım etmek	ginegin kirin
burnundan konuşan	ginginok
cümlecik	girde
yük arabası	girole
alındı	girtek
zabıt katibi	girtenivîs
iriyarı adam	girtole
terkibibent	girêbend
ruhi sıkıntı	girêcan
aşağılık duygusu	girêcan
ruhsal sıkıntı	girêcan
kör düğüm	girêhişk
kördüğüm	girêhişk
yabani kedi	givir
bukle	gizvanok
öncü hayvan	gole
danacı	golikvan
kefen hırsızı	gornebaş
nebbaş	gornebaş
fısılt gazetesi	gotegot
fısıltı gazetesi	gotegot
kılükal	gotegot
söyleyeni	goyende
köşeli ayraç	goşebend
etçi	goştfiroş
embriyon	goştpere
kamış kulak	guhbel
uzun kulaklı	guhdirêj
değişebilir	guherbar
değişici	guherbar
kepçe kulaklı	guhmertal
adam sendeci	guhnedar
eski kulağı kesik	guhrep
kesik kulaklı	guhrep
taşınır	guhêzbar
kurşun yağmuruna tutmak	gulebaran kirin
yabani pırasa	gulik
ponpon	gulik
boule de neige	gulik
gür gür	guregur
dadanırcasına saldırmak	gurmijîn
sıkma makinası	guvaştek
buluğ	gêranî
ikramiye	gîhev
palazlaşmak	gîr bûn
sıçmak	gû kirin
mayıs böceği	gûgerîn
kubbeli bina	gûmez
yıldız böceği	gûstêrk
özendirici	handêr
motive eden	handêr
teşvik edici	handêr
ithalât	hawirde
çevreci	hawirparêz
bilgi sahibi olmak	haydar bûn
varlık bilimi	hebûnnasî
haciz etmek	heciz kirin
müsebba	heftane
yedili	heftane
altı parmak	heftreng
püre	helîse
helmeli	helîse
müteradif	hemwate
akışkan	herikbar
cari	herikbar
kılağılamak	hesan kirin
demir aletler	hesincaw
fırıncı küreği	hestîvk
konürbasyon	hevbajar
bitiştirmek	hevbend kirin
aynı türden	hevcure
kalpleri bir olan	hevdil
cins isim	hevenav
sözdizim	hevoksazî
geyik veya karaca tekesi	hevor
bayırlaşmak	hevraz bûn
hamur mayası	hevîrtirş
süt kızkardeş	hevşîre
aynı sütü emmiş	hevşîre
yeleç	hewadar
havadar	hewadar
un çorbası	hewdel
özentici	heweskar
iç merdiven	hewreban
çalı kuşu	hewêrde
dağlama demiri	hezrîng
silikleştirmek	heşifandin
silikleştirme	heşifandin
korkudan sıçramak	hilciniqîn
pimpirik	hilhilî
pinpon	hilhilî
derli toplu olmak	hilmaştin
önünden ayağa kalkmak	hilpesirîn
salınım yapmak	hilteqilîn
soğurmak	hilçinandin
soğuruş	hilçinandin
hırpalanmak	hincirîn
hırpalanma	hincirîn
hırpalayış	hincirîn
nişanı tutturmak	hingaftin
kırmızı biber	hiçhar
erken hasat	hişkawiz
şıvgın	hodar
öveç	hogeç
koç sürüsü	hogeç
kolay çözülen düğüm	hok
kabul salonu	hoçik
mütehakkim	hukimdar
ilhan	hukimdar
tazammun etmek	hundirandin
tazammun	hundirandin
havi olmak	hundirandin
serinlenmek	hênik bûn
serinletmek	hênik kirin
emniyet altına almak	hêvişandin
göverti	hêşînahî
kıkırtı	hîqînî
alındırmak	ingirandin
zürra	çandiyar
basımevi	çapxane
kapı çerçevesi	çarder
dört bir yanı	çarnikar
dört ayaklı	çarpê
dört kenar	çarçîk
sapak	çaterê
harbe	çatkêş
patlak göz	çavbeloq
gözetim evi	çavdêrxane
gözü dışarda	çavlider
hor gören	çavsivik
ceylan bakışlı	çavxezal
ahu gözlü	çavxezal
göz ağrısı	çavêş
gökmen	çavşîn
mavi göz	çavşîn
çıyan gözlü	çavşîn
lopur	çelp
cup	çelp
loppadak	çelp
löpür löpür	çelpeçelp
çıpıl çıpıl	çelpeçelp
bağ böceği	çemçûr
çenbaz	çenebaz
çene çalan	çenebaz
paçarız	çeperast
dokuz taş	çeqûber
yarı otomatik	çeqûber
rabt	çesp
büklük	çewlik
patiska	çiftexas
hasse	çiftexas
imsakli	çikot
rengi atmak	çilmisî
arkıt	çilmêre
çınlayış	çingîn
mancınıkçı	çirikvan
çıkrıkçı	çirikvan
cızır cızır	çirkeçirk
cart	çirt
terelelli	çirtik
yelloz aşifte	çirtik
deve tımarı	çirtovirto
hokey sopası	çogan
söven	çogan
mürdümük	çolik
gasp etmek	çopandin
tattırmak	çêjandin
kuş dışkısı	çêrt
cırıltı	çîzînî
cazırtı	çîzînî
cıyırtı	çîzînî
kapıp koyuvermek	îhmal kirin
inç	înç
meyve çekirdeği	şîşik
taşa bastırmak	recimandin
var ol	her hebî
cuşiş	coşdarî
zevk etmek	kêf kirin
teselli vermek	teselî kirin
hatırlatma	bibîrxistin
izhar	amajekirin
ateşgede	agirgeh
ateş yakılan yer	agirgeh
kolaylaştırıcılık	hêsankarî
süryani	asûrî
bora	bager
tayfun	bager
burjuvazi	bajarî
kent soylu	bajarî
askıntı	belakir
şergil	belakir
yedi belâ	belakir
bela arayan	belakir
rüşvetçilik	bertîlxurî
danaburnu	cobir
iğri	çepûçûr
dünyadan haberi olmamak	di guhê gê de bûn
yol kavşağı	duriyan
yahya	yehya
değiştirilmiş	guherandî
muhavvil	guherîner
dışa dönük	hindirîn
yeraltı kanalı	karîz
kemirici	kirîner
kökten kesim	kokbir
kısa öykü	kurteçîrok
kısa hikaye	kurteçîrok
tiril tiril	lerzok
düz arazi	pehnik
yassı alan	pehnik
ara bölme	navbir
namazgâh	nimêjgeh
musalla	nimêjgeh
kuvak	qurequr
geçen gece	şeva din
sınalgı	nîşandêr
teorisyen	teorîsyen
kuramcı	teorîsyen
nazariyatçı	teorîsyen
dakar	dakar
perçin	perçîn
yabani kekik	anêx
benekli kokarca	fistîk
dinozor	dînozor
kiyamet günü	roja dûmê
sırat	sirat
çocuk bahçesi	baxçeyê zarokan
nasılsınız	çawa yî
nasılsın	çawa yî
mücellâ	biriqandî
yalanmış	alîstî
şayi	belavbûyî
asimile	bişaftî
asimile edilmiş	bişaftî
indirimli	daxistî
meşkur	ecibandî
adaklılık	gazîkirî
aktarılmış	guhastî
nakledilmiş	guhastî
kargışlı	naletkirî
laîn	naletkirî
patlamış	peqiyayî
büzüşük	qurmiçandî
açıklamalı	ravekirî
döşeli	raxistî
mefruş	raxistî
yayılı	raxistî
dolgun	repisandî
mevsuf	wesifandî
suda pişmiş	xaşandî
yaratılmış	xuliqandî
at koşum takımı	liwan
tımar	tîmar
sezme	sehkirin
fark etme	sehkirin
türkuaz	firûze
nerde	loherê
yavaşlık	hêdîtî
dokunmatik	destdanî
fanzin	fanzîn
insan hırsızı	revîner
çocuk hırsızı	revîner
dizüstü	serçok
sabah namazı	nimêja şeveqê
biçer döver	makîneya dirûnê
bankamatik	bankomat
almaç	reseptor
reseptör	reseptor
üyelik	endamtî
kışkışlama	kişkirin
riyakarlık	rûmetî
mürai	rûmetî
riya	rûmetî
oyuz	melekorî
büyük ısırgan otu	geznik
gril	caxik
sıcaklamak	acizbûn
kirişlemek	alaş kirin
inanılmak	bawer bûn
inanılma	bawerbûn
inanış	bawerkirin
mutmain	bawerkirî
bölünmüş	dabeşbûyî
uzatım	dirêjkirin
empoze etmek	empoze kirin
münfesih	fesixbûyî
gözdağı vermek	gef kirin
çıkar sağlamak	havil bûn
serinleme	hênikbûn
serinlenme	hênikbûn
ümit etmek	hêvî kirin
batkın	îflaskirî
işmar etmek	îşaret kirin
sah çekmek	îşaret kirin
kerem etmek	kerem kirin
bulgulamak	keşf kirin
kuluçka olmak	kurk bûn
nikah etmek	mehr kirin
göz kulak olmak	miqate bûn
uğuşturmak	mizdan
tecezzi etmek	parçe bûn
takti etmek	parçe kirin
paramparça etmek	parçe kirin
parçalanma	parçebûn
parçalayış	parçekirin
takti	parçekirin
pejmürde olmak	pejmûrde bûn
pişman etmek	peşîman kirin
sorma	pirskirin
burun kıvırmak	poz kirin
pullamak	pûl lê dan
kılıflama	qilfkirin
kılıflamak	qilfkirin
gürbüzleşmek	rebît bûn
gürbüzleşme	rebîtbûn
sansürleme	sansûrkirin
sansürlü	sansûrkirî
soğuklaşmak	sar bûn
soğuklaşma	sar bûn
serbest olmak	serbest bûn
bini	siwarbûn
bindirme	siwarkirin
aklaşmak	spî bûn
aklaşma	spîbûn
beyazlanma	spîbûn
beyazlaşma	spîbûn
cenkleşme	şerkirin
kalafatlamak	tamîr kirin
kalafat	tamîrkirin
kalafatlama	tamîrkirin
alan talan olmak	tarûmar bûn
susamak	tî bûn
susatmak	tî kirin
susama	tîbûn
susatma	tîkirin
veto etmek	veto kirin
hiyerarşi	hiyerarşî
aşama sırası	hiyerarşî
fevt etmek	winda kirin
fevt olmak	winda kirin
yitiriş	winda kirin
abanoz	ebenos
yalvarıcı	berger
karakış	çileyê zivistanê
erbain	çileyê zivistanê
kara kış	çileyê zivistanê
turkuaz	fîroz
harun	harûn
arun	harûn
demirkir	sorboz
kula	şînboz
demir kırı	şînboz
evin içi	navmal
briket	pîrket
alev makinesi	agiravêj
talişçe	talişî
mahlep	kinêr
kokulu kiraz	kinêr
kokulu yonca	kinêr
sarı yonca	kinêr
idris ağacı	kinêr
şikâyet etmek	lomekirin
şikâyetçi olmak	lomekirin
havale etmek	hewale kirin
serzenişte bulunmak	lome kirin
sitem etmek	lome kirin
serzenişte bulunma	lome kirin
ebelemek	tep lê dan
sonun başlangıcı	piştdawî
havai fişek	agirbazî
baryum	baryûm
galyum	galyûm
germanyum	germanyûm
helyum	helyûm
hafniyum	hafniyûm
kadmiyum	kadmiyûm
hf	hf
eş cinsel	homoseksûel
mikrodevlet	dewletok
tepkili uçak	jet
dragoman	terciman
ziggurat	zîgurat
siluet	aşik
sapa	averê
sapkı	averê
münadi	banger
imanı yok	bêîman
imansız	bêîman
mülksüz	bêmal
genç horoz	şelûvk
nobet	qerewal
çadırda yaşayan	xîmenişîn
ceylan yavrusu	xifş
ateşli silah	agirber
içine işlemek	kar kirin
iken	gava ku
hint kamışı	bambû
buruşukluk	qijlonek
kırtasiye	qirtasî
fenikece	fenîkî
fenike dili	fenîkî
iş adamılığı	karsazî
iş adamlığı	karsazî
akordiyon	akordiyon
normalleştirme	asayîkirin
tasrih	aşkerekirin
su tulumbası	avkêş
sucu	avkêş
su kabı	avtawe
yelkesen	babirek
baççı	bacgir
vergici	bacgir
saat kolu	badek
kentçi	bajarvan
kentçilik	bajarvanî
yük atı	bargîr
pazubandı	bazbend
görevli kolluğu	bazbend
kol muskası	bazbend
pazu bandı	bazbend
servi boylu	bejnbilind
filinta gibi	bejnzirav
ince belli	bejnzirav
olacakları önceden söyleyen kimse	berbêj
rantabl	berdar
velût	berdar
mahsuldar	berdar
velt	berdar
mahsulat	berdar
ramp	berkaş
bayır önü	berkaş
hayıflanmak	berketin
şakrak kuşu	bersork
yüz peçesi	berûk
ters taraf	bervajî
santrfor	bezok
inançsızlık	bêbawerî
itikatsızlık	bêbawerî
silahsızlandırma	bêçekkirin
gayrı meşru	bêdad
küçültme	biçûkkirin
tasgir	biçûkkirin
kaşıntılı	bixûr
buhurluk	bixûrdank
çekirdecik	bizrik
göz bebeği	bîbîk
camcı	camker
dört işlem	caran
bir kez	carekê
cinci	cindar
tırık tırak	cirecir
fosseptik çukuru	çalav
foseptik çukuru	çalav
doymazlık	çavbirçîtî
gözüaçlık	çavbirçîtî
açıkgözlü	çavvekirî
acıya neden olmak	çerçirandin
meşin	çermîn
çın çın	çingeçing
tangır tungur	çingeçing
çan çan	çingeçing
a few	çîçkek
cici anne	dadê
oyun ebesi	dapîrk
oyunda ebe	dapîrk
inşaat iskelesi	darbend
darağacında asmak	dardekirin
hurma ağacı	darqesp
intaç	dawiyandin
intaç etmek	dawiyandin
onlarca	dehan
karışan	destkar
kisbi	destkevtî
yüzgöz	deverû
aslan ağzı	devşêr
hamiyet	dilgermî
gönlü yaralı	dilkul
kaderli	dilkul
aslan yürekli	dilşêr
gönül darlığı	diltengî
bunaltı	diltengî
bunluk	diltengî
bet suratlı	dilxirab
karnıkara	dilxirab
içi çıfıt çarşısı	dilxirab
anasını ipini çıkarmış pazarda satmış	dilxirab
delirtme	dînkirin
iki yüz	dused
ırama	dûrketin
istihkâmcılık	endazyarî
fedakarlık	fedakarî
özveri	fedakarî
doğan yavruya ilk sütü vermek	firşikkirin
burkmak	fiştiqandin
mekanik ustası	fîter
ala geyik	gakûvî
bufalo	gakûvî
sesleniş	gazîkirin
ünleme	gazîkirin
harta hurt kaşımak	gincirandin
irileştirme	girkirin
gülabdan	gulavdan
gülçiçek	gulçîçek
yedi yüz	heftsed
bugünlük	îroyîn
sancılanma	jangirtin
hayatiyet	jîndarî
hayat hikayesi	jînenîgerî
beceriklice	jîrane
çok yaşlı adam	kalepîr
kene ağacı	karçik
hint yağı	karçik
zimamdar	kargêr
kayak yeri	kasik
kâşâne	kaşane
fayans	kaşî
anaforculuk	kedxwarî
salcı	kelekvan
eşekleşme	kerbûn
sağırlaşma	kerbûn
eşeklik	kerînî
sağırlaştırma	kerkirin
bıçaklama	kerkirin
kansız cansız ruh	kêmxwînî
sürmedan	kildank
sürmelik	kildank
sürme kabı	kildank
kırt kırt	kirpekirp
kütür kütür	kirpekirp
kakır kakır	kirpekirp
kimyager	kîmyager
sekeseke	kulkulî
derinleşme	kurbûn
tamik	kurkirin
külhan	kûre
malarya	lerzeta
leventlik	lewendî
tetabuk	lêhatin
soyaçekim	lêhatin
aslan gibi	lihevhatî
açlık grevi	mangirtin
kaya keleri	margîse
yere çömmek	melisîn
imamcık	melok
konuk evi	mêvanxane
konukevi	mêvanxane
mır mır	miremir
gassal	mirîşo
ölü yıkayıcısı	mirîşo
isim koymak	navlêkirin
yılmaz	nebez
boyun eğmez	nebez
bilmemek	nezanîn
nüshalamak	nûsikandin
payeli	payedar
koçmak	pelişîn
perizade	perîzade
yağmurca	pezkovî
mizah yapmak	pêkenîn
beş yüz	pêncsed
göstermeci	pêşandar
sergileyici	pêşandar
ön bilim	pêzanîn
buğulama	pijandin
kanıtlama	piştrastkirin
yeşilsoğan	pîvazterk
taze soğan	pîvazterk
göksoğan	pîvazterk
polis karakolu	polîsxane
car car	qajeqaj
kara karga	qelereşk
zıh	qeytan
kaytan	qeytan
gıdgıdak	qidqidank
küçük parmak	qilîç
süne	qimil
çıtlama	qirçîn
calf bone	qîtik
baldır kemiği	qîtik
bacak kemiği	qîtik
paça kemiği	qîtik
muşmula gibi	qurmiçî
buruşuk	qurmiçî
pörsüklük	qurmiçî
fasıla	rawest
es	rawest
renk körü	rengkor
güneydoğu rüzgarı	reşeba
kara çadır	reşmal
kara yılan	reşmar
talakat	rewanbêjî
yoldan geçen	rêbiwar
gelip geçen	rêbiwar
yolgeçen	rêbiwar
mahrek	rêgeh
düzgünlük	rêkûpêkî
çeki düzen	rêkûpêkî
sevk ve idare etmek	rêvebirin
apandisit	rîvîkakore
günün birinde	rojekê
dolu dizgin	serberdayî
ip kaçkını	serberdayî
ip kaçkını zindan gülü	serberdayî
baş etmek	serederî
soğuk alma	sermagirtin
üst omuz	sermil
baş yazı	sernivîs
başmuharir	sernivîskar
başyazar	sernivîskar
baş yazar	sernivîskar
üsteğmen	serpel
teğmen	serpel
üçyol	sêriyan
üç yüz	sêsed
hitan	sinetkirin
mezalim	stemkarî
buzluğan	sîpan
hamam böceği	sîsirk
çiçek tarlası	solîn
astrolog	stêrzan
astrolojist	stêrzan
burç yorumcusu	stêrzan
yıldızbilimci	stêrzan
yıldız falcısı	stêrzan
müneccim	stêrzan
arıkuşu	şalûl
çakal armudu	şekok
dağ armudu	şekok
afallaşmak	şepilîn
şişhane	şeşxane
gece körlüğü	şevkorî
su baskını	şêlav
bulanıklaşma	şêlîbûn
tatlılaştırma	şirînkirin
çirişleme	şîrêzkirin
tatlılaşma	şîrînbûn
inkılapçı	şoreşvan
yaprak aşısı	tamandin
tadsız tuzsuz	tamsar
lab	taqîgeh
sıtmalı	tawî
daraltma	tengavkirin
bunaltma	tengavkirin
daralma	tengbûn
açmaz	tengî
fire	têçûn
çökertme	têkdan
tel örgü	têlbend
tel bariyer	têlbend
transit	têperîn
tombalak	topiz
send	veguherîn
viyaklama	waqîn
apartman dairesi	warxan
apartman katı	warxan
kaybetme	windakirin
kavşak	xaçerê
dünürcü	xwezgînî
mükâfatını görmek	xelatkirin
yengeç burcu	xerçeng
uykusu ağır	xewgiran
mülhem	xêvzan
nakız	xirabkirin
tahrifat	xirabkirin
hımhım	xirexir
horul horul	xirexir
hızar	xizar
ballandırma	xweşkirin
güçleniş	xurtbûn
tanrıtanımaz	xwedênenas
allahtan korkmaz	xwedênenas
öz itmeli	xweger
cebrinefs	xweragirtin
tuzluk	xwêdank
serin kanlı	xwînsar
soğuk kanlı	xwînsar
kanı soğuk	xwînsar
soğuk neva	xwînsar
kanı sıcak	xwînşirîn
hunhar	xwînxwar
ah ü zar	zarezar
zahmetkeş	zehmetkêş
çoğalış	zêdebûn
teksir	zêdekirin
tezyit	zêdekirin
altuncu	zêrger
panzer	zirîpoş
üvey oğul	zirkur
kimyoncu	zîrevan
gümüşçü	zîvker
suyuk	zûxav
ufunet	zûxav
frengi	agire
iskambil	îskambîl
heyhey	moc
topraksız olup toprak sahibi tarafından ailesiyle birlikte beslenen hizmetkar köylü	kerax
yanı başı	kerax
yemek salonu	odeya xwarinê
salamanje	odeya xwarinê
oyalayıcı	mijûlker
rahle	rehl
tediye etmek	sencandin
programlama dili	zimanê bernamekirinê
kuala lumpur	kuala lumpur
keder vermek	kesirandin
semaver	semawer
evin önü	berderî
güz zambağı	pelezêsk
revanduz	rewandiz
urmiye	ûrmiye
berceste	şahibeyt
lurca	lûrî
fedaî	canfida
serden geçti	canfida
serdengeçtî	canfida
absorbsiyon	absorbsiyon
şorolop	qurtequrt
lokurlokur	qurtequrt
boyunun ölçüsünü almak	a (yekî) tê de man
ettiğiyle kalmak	a (yekî) tê de man
mart kapıdan baktırır, kazma kürek yaktırır	adarê berf giha guliyê darê, nema danê êvarê
içi sızlamak	agir bi dilê (yekî) ketin
ciğeri kebab olmak	agir bi dilê (yekî) ketin
içi yanmak	agir bi dilê (yekî) ketin
içinin yağı erimek	agir bi dilê (yekî) ketin
keyif benim köy mehmet ağanın	agir bikeve dehlê, qevdek pûşe min tune ye
ne dağda bağım var, ne çakaldan davam	agir bikeve dehlê, qevdek pûşe min tune ye
ateşi çıkmak	agir ji devê (yekî) barîn
açtı ağzını yumdu gözünü	agir ji devê (yekî) barîn
ateş saçmak	agir ji devê (yekî) barîn
etekleri tutuşmak	agir ketin binê (yekî)
alev saçağı sarmak	agir têber bûn
içine kurt düşmek	agir têber bûn
dillendirmek	anîn ser zimên
akıl almaz	aqil qebûl nekirin
ununu elemiş eleğini aşmış	arê xwe bêtin, kapeka xwe rêtin
ergenliğe ulaşmak	av di gunikên (yekî) gerîn
ağzı kulaklarına varmak	av ji devê (yekî) çûn
ihtilafa düşmek	ava (...) di coyekê de neherikîn
yıldızları barışmamak	ava (...) di coyekê de neherikîn
ikisi bir kazanda kaynamaz	ava (...) di coyekê de neherikîn
ikisini bir kazana koysalar kaynamazlar	ava (...) di coyekê de neherikîn
beyninden vurulmuşa dönmek	ava sar tê de çûn
başından kaynar su dökmek	ava sar tê de çûn
tepesinden kaynar su dökmek	ava sar tê de çûn
kanı donmak	ava sar tê de çûn
başından kaynar sular dökülmek	ava sar tê de çûn
başından aşağı kaynar sular dökülmek	ava sar tê de çûn
tepesine kaynar su dökülmek	ava sar tê de çûn
aykırılamak	averê bûn
inhiraf etmek	averê bûn
başından atmak	avêtin pişt gihê xwe
üstünden atmak	avêtin pişt gihê xwe
ah û figan etmek	ax û wax kirin
yel kayadan ne koparır	ba ji zinar çi dibe!
ilgi çekmek	bal kişandin
dikkatleri (bir konunun veya bir şeyin) üzerine çekmek	bal kişandin ser
güvenilir olmak	baweri pê hatin
tınmamak	belika guhê (yekî) xwê nedan
kılını bile kıpırdatmamak	belika guhê (yekî) xwê nedan
ayağına gitmek	ber bi (yekî) ve çûn
zevale yüz tutmak	ber bi (yekî) ve çûn
geri gitmek	ber bi (yekî) ve çûn
fenaya sarmak	ber bi (yekî) ve çûn
gerisin geri gitmek	berepaş çûn
tedeni etmek	berepaş çûn
ters yüzüne dönmek	berepaş çûn
berhava etmek	berhewa kirin
havaya uçurmak	berhewa kirin
karşı durmak	berhingarî kirin
sırtarmak	berhingarî kirin
karşı dur­mak	berhingarî kirin
köşeye sıkışmak	bêhn lê çikîn
nefes tüketmek	bêhn lê çikîn
soluğu kesilmek	bêhn lê çikîn
iflahını kesmek	bêhna fisan bi ser xistin
köşeye sıkıştırmak	bêhna fisan bi ser xistin
soluğunu kesmek	bêhna fisan bi ser xistin
soluk kesmek	bêhna fisan bi ser xistin
aba düşmek	bi avê de çûn
haydan gelen huya gider	bi baranê re hatin, bi lehiyê re çûn
sırtı yere gelmek	bi bin ketin
yenilgiye uğramak	bi bin ketin
gözüyle görmek	bi çavên xwe dîtin
dünya gözü ile görmek	bi çavên xwe dîtin
el sıkmak	bi destê (yekî) girtin
elinden tutmak	bi destê (yekî) girtin
karışanı görüşeni olmamak	bi dilê xwe bûn
aşağıdan güreşmek	bi dora (yekî) ketin
allem etmek kallem etmek	bi dora (yekî) ketin
hak ile yeksan etmek	bi erdê ve bûn yek
hak ile yeksan olmak	bi erdê ve bûn yek
kanatlanmak	bi firê ketin
yeleklenmek	bi firê ketin
buzlar çözülmek	bi hev germ bûn
geriletmek	bi paş de xistin
beş para etmemek	bi pênc qurişên qul nekirin
yabana atmak	bi pişt guhê xwe re avêtin
işi savsaklamak	bi pişt guhê xwe re avêtin
söz bir allah bir	bi qewl û qerarê mêrên berê
gırtlağına sarılmak	bi qirika (yekî) girtin
yakasına asılmak	bi qirika (yekî) girtin
yakasına sarılmak	bi qirika (yekî) girtin
belasını bulmak	bi ser belaya xwe ve bûn
alımını almak	bi ser belaya xwe ve bûn
allah belâsını versin	bi ser belaya xwe ve bûn
misafirliğe gidip gelmek	bi ser hev de çûn û hatin
ilişkilerini sürdürmek	bi ser hev de çûn û hatin
hareketye başlanmak	bi ser hev de çûn û hatin
taştan yağ çıkar ondan çıkmaz	bi ser tiliya kul de mîz nekirin
ricat etmek	bi şûn de çûn
yerde sürüklenmek	bi xwe re kaş kirin
alın teri ile kazanmak	bi xwêdana eniya xwe qezenc kirin
ite atsan yemez	biavêjî ber segan, seg naxwin
köpeğe atsan yemez	biavêjî ber segan, seg naxwin
ateş olsa cürmü kadar yer yakar	bibe baran erdê şil nake
ateş olsa cirmi kadar yer yakar	bibe baran erdê şil nake
kaş yapayım derken göz çıkarmak	birûye min şeh dikî, çave min jî derdixî
yılan hikayesine dönmek	bûn çîrok
yılan hikâyesi	bûn çîrok
papuçsuz kaçmak	bûn dehşika dest gavanan
kibarlık etmek	camerî kirin
köprüden geçene kadar ayıya dayı derler	carinan mirov ji yarê diya xwe re dibeje: “bavo”
köprüyü geçene kadar ayıya dayı derler	carinan mirov ji yarê diya xwe re dibeje: “bavo”
denize düşen yılana sarılır	carinan mirov ji yarê diya xwe re dibeje: “bavo”
gittiğin yerden geliyoruz	cihê ku tu diçiyê, ez jê têm
sen giderken ben biliyordum	cihê ku tu diçiyê, ez jê têm
tereciye tere satmak	cihê ku tu diçiyê, ez jê têm
yerini doldurmak	cihê (yekî) girtin
yerini tutmak	cihê (yekî) girtin
göz süzmek	çav lê bûn
horoz ölür	çav lê bûn
gözü çöplükte kalır	çav lê bûn
gözü kalmak	çav lê bûn
gözünden kaçmamak	çav lê bûn
gözü üstünde olmak	çav lê bûn
horoz ölür, gözü çöplükte kalır	çav lê bûn
gözleri yollarda kalmak	çavên (yekî) li rê bûn
zikzak yapmak	çiv dan xwe
dizlerinin bağı çözülmek	çok lê sist bûn
ıskartaya çıkmak	çûn ber tira golikan
dan duna gitmek	çûn ber tira golikan
hesaba almak	dan ber çavan
itibara almak	dan ber çavan
siper etmek	dan ber xwe
ver yansın	dan ber xwe
hedeflemek	dan ber xwe
yalanı çıkmak	dawet firikî berbûk hetikî
arkası alınmak	dawî lê anîn
hitam vermek	dawî lê anîn
ucunu bulmak	dawî lê anîn
ayak yapmak	dek û dolab li dora (yekî) gerandin
başına çorap örmek	dek û dolab li dora (yekî) gerandin
dalavere çevirmek	dek û dolab li dora (yekî) gerandin
deke düşürmek	dek û dolab li dora (yekî) gerandin
fırıldak çevirmek	dek û dolab li dora (yekî) gerandin
ığrıp çevirmek	dek û dolab li dora (yekî) gerandin
komplo kurmak	dek û dolab li dora (yekî) gerandin
madik atmak	dek û dolab li dora (yekî) gerandin
tava düşürmek	dek û dolab li dora (yekî) gerandin
dümen koşmak	dek û dolab li dora (yekî) gerandin
kumpas kurmak	dek û dolab li dora (yekî) gerandin
dolaba girmek	dek û dolab li dora (yekî) gerandin
kanı içine akmak	derd berî nava xwe dan
derdini marko paşa'ya anlat	derdê xwe ji paşayê ker re gotin
derdini marko paşaya anlat	derdê xwe ji paşayê ker re gotin
kızım sana söylüyorum, gelinim sen anla	deriyo ji te re dibêjim, piştderiyo tu guh bidiyê
kızım sana söylüyorum gelinim sen dinle	deriyo ji te re dibêjim, piştderiyo tu guh bidiyê
otokrasi	otokrasî
hayranlık uyandırıcı	hijmetkar
tokalaşmak	dest dan hev
yardımlaşmak	dest dan hev
el ele	dest dan hev
düze çıkmak	destfireh bûn
aptesi gelmek	dest av lê teng bûn
sinekten yağ çıkarmak	destê (yekî) tijî garis be, libek jê nakeve
ateşe vursan duman tütmez	destê (yekî) tijî garis be, libek jê nakeve
elini vicdanına koymak	destê xwe dayîn li ser wîjdana xwe
elini kalbine koyarak söylemek	destê xwe dayîn li ser wîjdana xwe
elini vicdanına koyarak söylemek	destê xwe dayîn li ser wîjdana xwe
el uzatmak	destê xwe dirêjî (yekî) kirin
elini uzatmak	destê xwe dirêjî (yekî) kirin
yardım elini uzatmak	destê xwe dirêjî (yekî) kirin
enine boyuna değerlendirmek	hila wê derxistin
ayrıntılarına girmek	hila wê derxistin
ayrıntılı yapmak	hila wê derxistin
el yıkamak	destê xwe jê şûştin
elini eteğini çekmek	destê xwe jê şûştin
yakasını bırakmamak	destê xwe ji pêsîrê nekişandin
ağız eğmek	devê xwe li ber (yekî) xwar kirin
ağzına sürmemek	devê xwe pê nekirin
dilini değdirmemek	devê xwe pê nekirin
bir kıyamettir gitmek	dê ewledê xwe avêtin
ana baba günü	dê ewledê xwe avêtin
mahşere dönmek	dê ewledê xwe avêtin
toprak atsan yere düşmez	dê ewledê xwe avêtin
tekelinde olmak	di destê (yekî) de bûn
ağız yaymak	di devê xwe de birin û anîn
sözü ağzında gevelemek	di devê xwe de birin û anîn
ağzında gevelemek	di devê xwe de birin û anîn
lafı çevirmek	di devê xwe de birin û anîn
yere batmak	di bin erdê re çûn
yerlere geçmek	di bin erdê re çûn
evde kalmak	di mal de man
varlık içinde yaşamak	di nav hebûnê de bûn
yediği önünde, yemediği ardında	di nav hebûnê de bûn
kafasına yatmamak	di serê (yekî) de rûneniştin
akla sığmamak	di serê (yekî) de rûneniştin
varlıkta darlık çekmek	di xela xinê de bûn
kızarıp bozarmak	di xwe de şeqizîn
kulaklarına kadar kızarmak	di xwe de şeqizîn
kedi yavrusunu yerken sıçana benzetir	dil dibijiya goşte kerê, digot "guhen wê wekî yen kêrguhan in"
midesi almamak	dilê (yekî) neçûn
midesi ağzına gelmek	dilê (yekî) neçûn
kalbi olmamak	dilkevir bûn
dillere düşmek	bi ser zimana ketin
kendini bir şey sanmak	dengê xwe bi guhê xwe bihîstin
kendini bir şey zannetmek	dengê xwe bi guhê xwe bihîstin
beş parmağın beşi bir değil	eşîr dahl e, hirç jî, rêvî jî û şêr jî têde heye
disleksik	dîsleksîk
disleksi	dîsleksiya
utancından yere geçmek	erd qelişîn û tê de çûn xwarê
deve olmak	erd qelişîn û tê de çûn xwarê
kırklara karışmak	erd qelişîn û tê de çûn xwarê
sakız gibi	eynî berf e, eynî çiftexas e
ben ağa sen ağa inekleri kim sağa?	ez axa tu axa, kî golikan bibe nav baxan
efendim nerede ben nerede?	ez dibêjim ewr tune, tu dibêjî: 'wê baran be'
efendim nerede, ben nerede?	ez dibêjim ewr tune, tu dibêjî: 'wê baran be'
ben diyorum hadımım o diyor oğul uşaktan neyin var	ez dibêjim ewr tune, tu dibêjî: 'wê baran be'
birleme	tewhîd
sekizgen	heştgoşe
beşgen	pêncgoşe
şedde	bedîd
galeyana getirmek	tevrakirin
yarayı kaşımak	bi melêba tevrakirin
saz benizli	zerhimî
sarıya çalan	zerhimî
homeopati	homeopatî
patoloji	patolojî
söyleniş	telafûz
söyleyiş	telafûz
taşkızılı	gulerîk
ihvan	îxwan
poyraz kuşu	lepkexur
kazanan	xalib
belli ki	xalib
her halde	mutleq
mukarin	muqarîn
yakın olan	muqarîn
bitişen	muqarîn
ulaşmış olan	muqarîn
yaklaşmış	muqarîn
alagöz dağı	elegez
ateşe tapmak	agirparêzî
deve kuşu	hêştirme
sen sağ ben selâmet	ez sax, tu silamet
sen ben davası	ga û gîsn li hev asê bûn
alay geçmek	galteyên xwe pê kirin
gır geçmek	galteyên xwe pê kirin
istihza etmek	galteyên xwe pê kirin
işin alayında olmak	galteyên xwe pê kirin
kesintiye almak	galteyên xwe pê kirin
makaraya almak	galteyên xwe pê kirin
matrak geçmek	galteyên xwe pê kirin
maytaba almak	galteyên xwe pê kirin
gırgır geçmek	galteyên xwe pê kirin
eşek sudan gelinceye kadar dövmek	gayê reşo te çi xwariye!
tanrı yarattı dememek	gayê reşo te çi xwariye!
allah yarattı dememek	gayê reşo te çi xwariye!
kin tutmak	gir jê girtin
kini olmak	gir jê girtin
gıcık kapmak	gir jê girtin
kafayı takmak	gira xwe tê dan
ser verip sır vermemek	gotin pê re çûn gorê
laf kaldırmamak	gotina xwe derbas nekirin
sözü ameline uymaz	gotinên (yekî) li hev nenihêrîn
dakikası dakikasına uymamak	gotinên (yekî) li hev nenihêrîn
bir dediği diğer dediğini tutmamak	gotinên (yekî) li hev nenihêrîn
günü gününe uymaz	gotinên (yekî) li hev nenihêrîn
daldan dala konmak	gotinên (yekî) li hev nenihêrîn
günü gününe uymamak	gotinên (yekî) li hev nenihêrîn
qûreqûr kirin	hawar û gazin kirin
ipini çekmek	hefsarê (yekî) kişandin
fırın ekmek yemesi lazım	heft tenûr nan xwarin
kırk fırın ekmek yemek lazım	heft tenûr nan xwarin
adam oluncaya kadar dokuz fırın ekmek yemek	heft tenûr nan xwarin
bir ben bilirim bir de allah	her ez dizanim û xwedê dizane
damdan düşer gibi	hê nepîvayî, tu dibêjî sê çap e
akıldan geçirmek	di dilê xwe de xwedî kirin
hayalinden geçirmek	di dilê xwe de xwedî kirin
içinden geçirmek	di dilê xwe de xwedî kirin
kulağını kabartmak	guhên xwe vekirin
ses seda çıkmamak	his û pis jê nehatin
kapı duvar	his û pis jê nehatin
çıt yok	his û pis jê nehatin
çıt çıkmamak	his û pis jê nehatin
sesi soluğu çıkmamak	his û pis jê nehatin
sesi çıkmamak	his û pis jê nehatin
kendisinden haber alamamak	his û pis jê nehatin
kazan dairesi	agirxane
ateşevi	agirxane
askıntı olmak	bela xwe jê vekirin
parmağında dolamak	bela xwe jê vekirin
zifos atmak	bela xwe jê vekirin
kulaklı orman baykuşu	kundê şaxdar
başkale	elbak
şemdinli	şemzînan
ikrah getirmek	hîletê (yekî) jê çûn
öğüreceği gelmek	hîletê (yekî) jê çûn
dinden imandan çıkmak	îmana (yekî) hatin serê bêvilê
şirazeden çıkmak	îmana (yekî) hatin serê bêvilê
gözünün önünden gitmemek	ji ber çavên (yekî) neçûn
kaçacak delik aramak	ji bo xweveşartinê li qulekê gerîn
elden çıkmak	ji dest derketin
kapış kapış gitmek	ji dest hev revandin
eline eteğine doğru	ji doxîna xwe re durist bûn
uçkuruna sağlam olmak	ji doxîna xwe re durist bûn
uçkuruna sağlam	ji doxîna xwe re durist bûn
ambale olmak	ji hal de ketin
ayakta uyumak	ji hal de ketin
hurdahaş olmak	ji hal de ketin
komalık olmak	ji hal de ketin
mukavemeti kırılmak	ji hal de ketin
işini çevirmek	ji hev derxistin
aralarını açmak	ji hev kirin
birbirine katmak	ji hev kirin
canı burnunda olmak	ji mirovatiyê derketin
memeden kesmek	ji pêsîrê kirin
zebun etmek	ji qewet xistin
yoldan çıkarmak	ji rê derxistin
baştan çıkarmak	ji rê derxistin
zihnini çelmek	ji rê derxistin
çığırdan çıkmak	ji rê û dirban derketin
çığrıdan çıkmak	ji rê û dirban derketin
rijdî	ji ser a xwe nehatin xwarê
yediden yetmişe	ji şîrî heta pîrî
baygın düşmek	ji xwe ve çûn
hallenmek	ji xwe ve çûn
komaya girmek	ji xwe ve çûn
karmakarış olmak	kafirkeratî bûn
kefeni boynunda olmak	kefenê xwe dayîn piçenga xwe
kellesini koltuğuna almak	kefenê xwe dayîn piçenga xwe
bir göz gülmek	kelogirî bûn
haline köpekler gülüyor	kenê guran pê hatin
kargalar bile haline gülmek	kenê guran pê hatin
ölüyü güldürmek	kenê guran pê hatin
haline köpekler gülmek	kenê guran pê hatin
kargalar bile gülmek	kenê guran pê hatin
halimize köpekler bile acıyor	kenê guran pê hatin
ballı börekli olmak	kerekê bi kurtan di nav de derbas nebûn
aynı tas aynı hamam	kero kero, weke hero
arka yere gelmemek	kesî pişta (yekî) daneynîn erdê
sırtı yere gelmemek	kesî pişta (yekî) daneynîn erdê
arkası yere gelmemek	kesî pişta (yekî) daneynîn erdê
boğaz boğaza gelmek	ketin qirika (yekî)
gırtlağa gelmek	ketin qirika (yekî)
gırtlak gırtlağa gelmek	ketin qirika (yekî)
münakaşaya tutuşmak	ketin qirika (yekî)
tartışmaya girişmek	ketin qirika (yekî)
rayına girmek	ketin rê
yola çıkmak	ketin rê
yola revan olmak	ketin rê
yollara dökülmek	ketin rê
kıyasıya dövmek	ketin ser dilê (yekî)
üstüne çullanmak	ketin ser dilê (yekî)
yere sermek	ketin ser dilê (yekî)
find reasonable	ketin serê (yekî)
kulağına girmek	ketin serê (yekî)
itin kıçına sokup çıkarmak	kirin nava kêşekî gû û agir berdanê
itin götüne sokmak	kirin nava kêşekî gû û agir berdanê
laf söyledi bal kabağı	kundiro jî gotina xwe got
kısa kesmek	kurt birin
bir şeyler, bir şeyler	kurt birin
kısa geçmek	kurt birin
üstüne toz kondurmamak	leke neanîna ser xwe
şipşirin	agirxweş
detaylarına inmek	lê hûr bûn
ıcığı cıcığı çıkarmak	lê hûr bûn
teşrih etmek	lê hûr bûn
haddeden geçirmek	lê hûr bûn
ıcığını cıcığını çıkarmak	lê hûr bûn
mürekkebi kurumadan bozmak	lê qelibin
harisa olmak	li ber çavan girtin
gönül okşamak	li ber dilê (yekî) dan
hatır almak	li ber dilê (yekî) dan
bin dereden su getirmek	li ber (yekî) gerîn
dil dökmek	li ber (yekî) gerîn
kırmızı dipli mumla davet etmek	li ber (yekî) gerîn
üzerine yüklenmek	li ber (yekî) gerîn
ölüm sınırında olmak	li ber mirinê bûn
vakti gelmek	li ber mirinê bûn
davul dövmek	li daholê xistin
kapısını çalmak	li deriyê (yekî) xistin
arkada bırakmak	li dû xwe hiştin
karmakarışık olmak	li êk ketin
temas etmek	li êk ketin
çapraza sarmak	li êk ketin
ayağı dolaşmak	li êk ketin
tokuşmak	li êk ketin
düğümlenmek	li hev asê bûn
köşe kapmaca oynamak	li hev gerîn
çapraza gelmek	li hev qelibîn
ters pers	li hev qelibîn
yangın yerine dönmek	li hev qelibîn
altüst ol­mak	li nav hev ketin
darmaduman olmak	li nav hev ketin
peşinde gezmek	li pey ketin
bir bardak suda fırtına koparmak	li ser çengek av soberî kirin
iç etmek	li ser rûniştin
deveyi hamudu ile yutmak	li ser rûniştin
ağıza düşmek	li ser zar û zimanan bûn
dillere destan	li ser zar û zimanan bûn
dillerde dolaşmak	li ser zar û zimanan bûn
körünü öldürmek	li xwe mukir hatin
köpeğe hoşt kediye pişt demez	lihêfa li ser çavê (yekî) birevînî, deng nake
keyif verici	kêfanok
hidrojen	hîdrojen
müvellidülmâ	hîdrojen
tencere yuvarlanmış, kapağını bulmuş	mar û dûpişk, bûne xwîşk
tencere yuvarlanmış kapağını bulmuş	mar û dûpişk, bûne xwîşk
beyni sulanmak	mêjiyê (yekî) çelq bûn
canına düşkün olmak	miriyê canê xwe bûn
somurtmak	mirûzê xwe kirin
sorutmak	mirûzê xwe kirin
somurtma	mirûzê xwe kirin
surat etmek	mirûzê xwe kirin
gündüz külâhlı gece silâhlı	mîna marê nig di zik de
gözden sürmeyi çalmak	mû ji mar qusandin
sürmeyi gözden çekmek	mû ji mar qusandin
ekmek elden, su gölden	nan ji baniyê, av ji kaniyê
kandil yağı tükenmek	nan û ava (yekî) li dinyayê qedîn
kandilin yağı tükenmek	nan û ava (yekî) li dinyayê qedîn
ad almak	navdar bûn
şöhret almak	navdar bûn
şöhret bulmak	navdar bûn
üne kavuşmak	navdar bûn
tavşan boku gibi	ne bi kêrî defê, ne bi kêrî zirneyê hatin
gemi aslanı	ne bi kêrî defê, ne bi kêrî zirneyê hatin
tavşan boku gibi ne kokar ne bulaşır	ne bi kêrî defê, ne bi kêrî zirneyê hatin
ne lehte ne alehte	ne elenî, ne selenî bûn
ne lehte ne aleyhte	ne elenî, ne selenî bûn
eline su dökemez	ne hêjayî neynoka (yekî) bûn
içime doğdu	nuqutîn dilê (yekî)
kalbime damladı	nuqutîn dilê (yekî)
nuh der peygamber demez	nûh gotin, nebî negotin
nuh diyor peygamber demiyor	nûh gotin, nebî negotin
şifreyi çözmek	pê derxistin
toprağa bakmak	pê li hafa gorê bûn
bir ayağı çukurda olmak	pê li hafa gorê bûn
gözü toprağa bakmak	pê li hafa gorê bûn
yere bakmak	pê li hafa gorê bûn
uyuyan yılanın kuyruğuna basmak	pê li mala cunan kirin
çattık donyağı ile bulgur pilavına	pê li mala cunan kirin
arının yuvasına dürtmek	pê li mala cunan kirin
esmayı üstüne sıçratmak	pê li mala cunan kirin
yılanın kuyruğuna basmak	pê li mala cunan kirin
cinsel ilişkiye girmek	pê re raketin
yatıp kalkmak	pê re raketin
tezyif etmek	pê şad bûn
tezyif	pê şad bûn
ipe dizmek	pê ve kirin
bağlı kalmak	pê ve girêdayî man
kıçına tekmeyi atmak	pihîn li qûna (yekî) xistin
kırk evin kedisi	pisîka heft malan bûn
dayanışmak	pişta hev girtin
dırdırlanmak	pitpit kirin
vıdı vıdı etmek	pitpit kirin
itina etmek	pûte pê dan
itina göstermek	pûte pê dan
özenmek	pûte pê dan
sıkı tutmak	pûte pê dan
tınmak	pûte pê dan
ihtimam etmek	pûte pê dan
itina göster­mek	pûte pê dan
anasının nikahını istemek	qelenê diya xwe xwestin
ağzından hayır çıkmazsa bari şer söyleme	qenciya te nagihîje me, qet nebe bila xirabiya te jî negihîje me
iktifa etmek	qîma xwe pê anîn
yama küçük delik büyük	qul mezin, pîne piçuk bûn
kırk tarakta bezi olmak	qula ku tiliya (yekî) tê de tune be nîn e
her tarakta bezi olmak	qula ku tiliya (yekî) tê de tune be nîn e
unburden	qutiya dilê (yekî) vekirin
tavuk kaza bakmış da kıçını yırtmış	qûn qûna mirîşkê ye, dixwaze hêkên qazan bike
haline bakmaz hasan dağına oduna gider	qûn qûna mirîşkê ye, dixwaze hêkên qazan bike
alacağın bir iğne çelik okkasından sana ne?	qûn qûna mirîşkê ye, hêk hêka qazê ye
dayak arsızı	qûna bêaran, benîşten daran
kıç kıvırtmak	qûna xwe ba dan
başına karalar bağlamak	reş girê dan
karalar bağlamak	reş girê dan
siyahlara bürünmek	reş girê dan
kara bağlamak	reş girê dan
sakalı değirmende ağartmak	riyê xwe di aşê mîrzo de spî kirin
üstüne bir iki güneş doğmak	roj lê hatin nîvro
üzerine bir iki güneş doğmak	roj lê hatin nîvro
balık kavağa çıkınca	roja nehemîn
son nefesini vermek	ruh jê çûn
ferahlık duymak	sebra (yekî) pê derketin
geniş bir nefes almak	sebra (yekî) pê derketin
gönlüne su serpilmek	sebra (yekî) pê derketin
içine su serpilmek	sebra (yekî) pê derketin
yüreği soğumak	sebra (yekî) pê derketin
yüreği yağ bağlamak	sebra (yekî) pê derketin
içi açılmak	sebra (yekî) pê derketin
içi yağ bağlamak	sebra (yekî) pê derketin
teselli bulmak	sebra xwe pê anîn
boşa koysam dolmaz doluya koysam almaz	serê ço bi gemar binê ço bi gemar
yukarı tükürse bıyığı aşağı tükürse sakalı	serê ço bi gemar binê ço bi gemar
köprü başarını tutmak	serê kaniyê girtin
korkulu rüya görmekten uyanık yatmak yeğdir	serê ku neêşe çima bendan lê girê bidim!
ağrısız başına kaşbastı bağlamak	serê ku neêşe çima bendan lê girê bidim!
dertsiz başını derde sokmak	serê ku neêşe çima bendan lê girê bidim!
kafasını duvardan duvara vurmak	serê xwe li dîwaran xistin
kafasını taştan taşa çarpmak	serê xwe li dîwaran xistin
hamam yapmak	serê xwe şûştin
kafası kazan olmak	serî lê bûn tevnî
bir hayli kabarmak	serî lê bûn tevnî
kor gibi	sipsor
acı badem	ajik
yabani badem	ajik
koyu penbe	algon
büyük yemin etmek	sonda mezin xwarin
suçu birinin üstüne yıkmak	sûc tê de cemidandin
hayâ perdesi yırtılmak	şerm li rûyê (yekî) neman
keçeyi suya atmak	şerma xwe avêtin
uykusu kaçmak	şev lê gerîn
yıldızları saymak	şev lê gerîn
kadir gecesi doğmuş	şeva leyletilqedrê ji diya xwe bûn
şeytana uymak	şeytên zor dan (yekî)
gözalıcı	şox û şeng
neşeli coşku	şox û şeng
üstüne bir bardak su içmek	tasek ava sar bi ser ... de vexwarin
üzerine bir bardak su içmek	tasek ava sar bi ser ... de vexwarin
patırtıya vermek	teqereq kirin
dam üstünde saksağan, vur beline kazmayı	tir li kû das li kû
korku düşmek	tirs ketin dilê (yekî)
telâşa kapılmak	tirs ketin dilê (yekî)
vız gelir tırıs gider	wekî bayê li kevir xistin
indiyum	indiyûm
santur	sentûr
arpa kumrusu gibi düşünmek	wekî diya bûka bêcihêz, li hev çûn û hatin
deli danalar gibi dönmek	wekî diya bûka bêcihêz, li hev çûn û hatin
mal bulmuş mağribi gibi	wekî ecemê ku çav bi penêrê ter bikeve
aç kurt gibi yemek	wekî ecemê ku çav bi penêrê ter bikeve
adı gibi bilmek	wekî navê xwe zanîn
ezbere bilmek	wekî navê xwe zanîn
avucunun içi gibi bilmek	wekî navê xwe zanîn
züğürt tesellisi	xanika xido, yek nebû, dora dudo
yedeğe almak	xanika xido, yek nebû, dora dudo
dalgınlığına getirmek	xap kirin
kirpiği kirpiğine değmemek	xew neketin çavên (yekî)
başı yastık yüzü görmemek	xew neketin çavên (yekî)
gözlerine uyku girmemek	xew neketin çavên (yekî)
gözü uyku tutmamak	xew neketin çavên (yekî)
uyku gözüne girmemek	xew neketin çavên (yekî)
sabahı bulmak	xew neketin çavên (yekî)
uyku girmemek	xew neketin çavên (yekî)
uykusunu almak	xewa xwe girtin
sebil	sebîl
ayağına düşmek	xwe avêtin ber tor û bextê (yekî)
bey devesi gibi yan gelip geviş getirmek	xwe avêtin ser siya piştê
yan gelip oturmak	xwe avêtin ser siya piştê
yan gelip yatmak	xwe avêtin ser siya piştê
yan gelmek	xwe avêtin ser siya piştê
dellenmek	xwe dînomîno kirin
ağzına geleni söylemek	xwe lê qerase kirin
yaptığını bilmemek	xwe lê qerase kirin
üstenmek	xwe li ber girtin
büyüklenmek	xwe mezin kirin
kendini dev aynasında görmek	xwe mezin kirin
kendini beğenmek	xwe mezin kirin
dev aynasında görmek	xwe mezin kirin
allah bir yastıkta kocatsın	xwedê bi hev û din re kal û pîr kirin
allah taksiratını affetsin	xwedê cihê çûyî nede şermê
allah şahidim olsun	xwedê heq şahid bûn
allah seni inandırsın	xwedê heq şahid bûn
allah iki iyilikten birisini versin	xwedê ji du deriyan deriyekî veke
allah işini rast getirmek	xwedê karê (yekî) li hev anîn
allah eksik etmesin	xwedê kêmasiya (yekî) nedan
allah herkesin gönlüne göre versin	xwedê li gorî dilê (yekî) dan
allah müstahakkını versin	xwedê li gorî dilê (yekî) dan
allah düşmanıma vermesin	xwedê neyîne serê bavkuştiyê min
allah kahretsin	xwedê qehra xwe lê kirin
allah canını alsın	xwedê ruhê (yekî) stendin
kan almak	xwîn jê berdan
eşeğe ters bindirmek	yek rêx kirin
iki ucunu bir araya getirememek	yeka (yekî) nebûn didu
iki yakası bir araya gelmemek	yeka (yekî) nebûn didu
ağzı söze yakışmak	zarşirîn bûn
dili papuç kadar	zimanê (yekî) heft helebî bûn
dili pabuç kadar	zimanê (yekî) heft helebî bûn
dili bir karış	zimanê (yekî) heft helebî bûn
kürek kadar dili olmak	zimanê (yekî) heft helebî bûn
pabuç kadar dili olmak	zimanê (yekî) heft helebî bûn
pabuç kadar dili var	zimanê (yekî) heft helebî bûn
adü bokuna karışmak	ziravê (yekî) qetandin
fincancı katırlarını ürkütmek	ziravê (yekî) qetandin
ödü patlamak	ziravê (yekî) qetandin
ödünü koparmak	ziravê (yekî) qetandin
yüreğini ağzına getirmek	ziravê (yekî) qetandin
canı ağzına gelmek	ziravê (yekî) qetandin
kalbi ağzına gelmek	ziravê (yekî) qetandin
ağzı varmamak	şorika xwe xwarin
canı yanmak	şorika xwe xwarin
urgan	kindir
kendir bitkisi	kindir
kınap	kindir
kırnap ip	kindir
ürken	kindir
başından büyük işlere girmek	qûna wî qûna çûkan e û dixwaze hêkê elokan bike
doğa bilimleri	zanistên xwezayî
iksir	îksîr
koku vermek	bêhn dan
teneffüs yapmak	bêhn dan
içtimai	civatî
yerindelik	îsabet
içeriksel kontrast	dijberiya naverokî
kız kuşu	pîwî
kocagöz	tirliyê çavzer
mahkum etmek	mehkûm kirin
pomat	pomad
macun	macûn
papağ	papax
zincifre	zincifre
zirkon	zîrkon
korumasız	bêweş
zihni	zihnî
petrokimya	petrokîmya
general prosecutor	dozgerê giştî
marksçı	marksîst
marksist	marksîst
akıl akıldan üstündür	aqil ji aqil zêdetir e
akıl yaşta değil, baştadır	aqil ne li bejnê ye li serî ye
boynuzsuz kol keçinin ahı boynuzlu keçiye kalmaz	aynê bizna kol ji ya bi qloç re namîne
kör satıcının alıcısı olur	baz bi baza, qaz bi qaza, mirîşka kor bi dîkê kulek re
pazarlık hamamda değil nadasta olsun	bazar bila li şûvê be ne li pirêzê be
ana yarısı	bêhna diya tê ji xaltiya
adam olacak çocuk boyundan belli olur	berxê çê li ber dê bellî ye
bin bilsen de bir bilene danış	bi dinyê bişêwir bi aqilê xwe bik
lafıa peynir gemisi yürümez	bi got got mirov nare cot
ver yiyeyim	bila zikê mela bel be bila gîha û pel be
ateş düştüğü yeri yakar	birîndar bi birîna xwe zane
keskin sirke küpüne zarar	bitrî ji gayê cot re namîne
kimsenin ahı kimseye kalmaz	bitrî ji gayê cot re namîne
çavê şeliqî ji yê kor çêtir e	çavê kul ji yê kor çêtir e
ehven-i şer	çavê şeliqî ji yê kor çêtir e
kendi edip kendi bulmak	çê kiro bi xwe kiro, xera kiro bi xwe kiro
bülbülün çektiği dili belâsı	çi tê serê mirov ji zimanê mirov e
akılsız başın cezasını ayak çeker	çi tê serê mirov ji zimanê mirov e
dağ dağa kavuşmaz, insan insana kavuşur	çiya çiqas bilind be wê rojekê rê pêkeve
ben hancı sen yolcu oldukça	çiya çiqas bilind be wê rojekê rê pêkeve
alavere dalavere kürt mehmet nöbete	dahşê bêr kûçkê nobetê
bir baba dokuz evladı besler, dokuz evlâd bir babayı beslemez	dê ber bi weleda weled ber bi çiyayê qaf
eceli gelen köpek cami duvarına siyer	dema hingavtina kerê tê, nanê cotyarî dixwe
davulun sesi uzaktan hoş gelir	dengê defê ji dûr ve xweş e
bir el bir eli yıkar, iki el yüzü yıkar	dest dest dişo, dest vedigere dev û rûyan dişo
el elden üstündür	dest di ser dest re heye heta ba xwedê
tek el şaklamaz	destê tenê deng jê nayê
kedi ne ulaşamadığı ciğere pis dermiş	devê rovî nagihîje tirî, dibêje bila xêra dê û bavê min be
dilenciye hıyar vermişler eğri diye beğenmemiş	devê rovî nagihîje tirî, dibêje bila xêra dê û bavê min be
kedi uzanamadığı ciğere murdar der	devê rovî nagihîje tirî, dibêje bila xêra dê û bavê min be
kurt kuzuyla gezerdi fikir başka başka olmasaydı	dibêjin, ne ji fesada be, wê gur û mih bi hev re biçêrin
dijminê dijwar ji dostê xayin çêtir e	dijminê aqilmend ji hevalê xayin çêtir e
pêvek:mazî	dijminê aqilmend ji hevalê xayin çêtir e
dost başa, düşman ayağa bakar	dijmin li nigê mirov dinêre,dost li serê mirov dinêre
kalp kalbe karşıdır	dil miqabilî dil e
kalbi yıkmak kolay, yapmak zordur	dil şûşe ye, ku bişkê cebar nabe
para ile değil sıra ile	dinya bi dorê ye, ne bi zorê yê
parayla değil sırayla	dinya ne yek û carek e
her gün papaz pilâv yemez	diya mirov tim lawa nayne
papaz her gün pilav yemez	diya mirov tim lawa nayne
insanın şansı her zaman yaver gitmez	diya mirov tim lawa nayne
insanın şansı her zaman yaver git­mez	diya mirov tim lawa nayne
boyu devrilesi	cehimî
şam böreği	patîle
puf böreği	patîle
ağzını şapırdamak	mirçîn
minör	biçûktirîn
köpek maması	lak
vıcık	lak
anlaşilir	têgihiştinbar
kerec	kerec
sepileyiş	pûyîn
içeren, içine alan	hewîner
muhtevi	hewîner
bir baltaya sap olmak	bi kêrî sîrekî nehatin
eme seme yaramamak	bi kêrî sîrekî nehatin
bir şeye benzememek	bi kêrî sîrekî nehatin
örümcek bağlamak	bi kêrî sîrekî nehatin
kevgir	kefgir
teleferik	teleferîk
cd-sürücü	cd-ger
dezavantaj	paşwendî
mumya	mûmî
tasvir etmek	teswîr kirin
belirlenmiş	diyarkirî
yoluna koymak	sererast kirin
düze sokmak	sererast kirin
rötuş	sererastkirin
ilgileniş	eleqedarbûn
alâkalandırmak	eleqedar kirin
muzırlaşmak	ziyandar bûn
var sayma	ferzkirin
muz gibi olmak	şerm kirin
huzur bulmak	aram bûn
gönül almak	dilxweş kirin
bukağılamak	qeyd kirin
burnundan yakalamak	qeyd kirin
prangalı	qeydkirî
telâşa düşmek	endîşe kirin
irileştirmek	gir kirin
dayanıklı hale getirmek	pihêt kirin
baş çekmek	serkêşî kirin
başı çekmek	serkêşî kirin
meşale çekmek	serkêşî kirin
istilzam	gerekkirin
vazıyet	desteserkirin
bloke	desteserkirî
üçkağıt açmak	hîle kirin
namaz kılmak	nimêj kirin
salavat getirmek	nimêj kirin
kılma	nimêjkirin
meşk etmek	meşq kirin
yer alıştırmaları	meşq kirin
sükse yapmak	serfiraz bûn
bakımını yapmak	xweyî kirin
iaşe etmek	xweyî kirin
iaşe	xweyîkirin
tavazzuh	ronîbûn
marazlanmak	nexweş bûn
keyfi olmamak	nexweş bûn
kast etmek	mebest kirin
tenzih	xwerûkirin
trankilizasyon	hêminkirin
avurt öttürmek	lewçetî kirin
cavcav etmek	lewçetî kirin
baş beyin bırakmamak	lewçetî kirin
bayraktarlık etmek	pêşengî kirin
dara getirmek	ecele kirin
aceleye getirmek	ecele kirin
demire su vermek	semax kirin
tav vermek	semax kirin
kafayı bulmak	serxweş bûn
matiz olmak	serxweş bûn
zom olmak	serxweş bûn
kafası kıyak olmak	serxweş bûn
sığlaşma	reqbûn
kadifeleşmek	nerm bûn
yelkenleri suya indirmek	nerm bûn
iptizal	adîbûn
tezellül	adîbûn
cesaret göstermek	xîret kirin
gayret göstermek	xîret kirin
silahlamak	çekdar kirin
silahlandırmak	çekdar kirin
dırlaşmak	devjenî kirin
tereddi etmek	dejenere bûn
tereddi	dejenerebûn
hohlamak	hû kirin
hu çekmek	hû kirin
hohlama	hûkirin
göverme	hêşînbûn
mavileşme	hêşînbûn
yeşerme	hêşînbûn
yeşillenme	hêşînbûn
yüreği kabarmak	bêhnteng bûn
asabileştirmek	bêhnteng kirin
istikraz etmek	deyndar bûn
çağcıllaştırmak	nûjen kirin
çağcıllaştırma	nûjenkirin
ya sabır çekmek	sebir kirin
ittisal	temaskirin
çağcıllaşmak	nûjen bûn
çağcıllaşma	nûjenbûn
altını üstüne getirmek	serûbin kirin
ne altını bırakmak ne üstünü	serûbin kirin
canına geçmek	tesîr kirin
canına işlemek	tesîr kirin
canına kâr etmek	tesîr kirin
etkilmek	tesîr kirin
niyet etmek	niyet kirin
niyetleniş	niyetkirin
sabır olmak	bênfire bûn
genellemek	gelemperî kirin
tamim etmek	gelemperî kirin
devletleştirmek	gelemperî kirin
icbar etmek	mecbûr kirin
icbar et­mek	mecbûr kirin
zam yapmak	zem kirin
yergimek	zem kirin
yerme zem	zemkirin
eksilmek	hindik bûn
eksiltmek	hindik kirin
cana kâr etmek	bandor kirin
fesata vermek	fesadî kirin
ordubozanlık etmek	fesadî kirin
imbiklemek	parzûn kirin
taktir etmek	parzûn kirin
bastırılmış	tepeserkirî
cezbetmek	cezb kirin
ikdam	cehdkirin
sadeleşmek	sade bûn
sadeleşme	sadebûn
meşru kılmak	rewa kirin
sövüş	sixêfkirin
onurunu kırmak	bêrûmet kirin
buhran geçirmek	tengezar bûn
bunalım geçirmek	tengezar bûn
göğsü daralmak	tengezar bûn
parsa toplamak	pars kirin
sadaka toplamak	pars kirin
çember geçirmek	şoreb kirin
kuşaklamak	şoreb kirin
kuşaklama	şorebkirin
diriğ etmek	texsîr kirin
kısırganmak	texsîr kirin
taksir etmek	texsîr kirin
muhavere etmek	gotûbêj kirin
ehlileştirmek	kedî kirin
koklayış	bêhnkirin
asılanma	havildarbûn
rol yapmak	rol kirin
yalnızlaşma	tenhabûn
önceleme	teqdîmkirin
sıkıca kapatmak	kîp kirin
arap gibi olmak	qemer bûn
leke etmek	leke kirin
aşka düşmek	bengî bûn
sere serpe uzanmak	pîj bûn
başkanlık etmek	serokatî kirin
tuzlamak	xwe kirin
beslenme	xweyîbûn
çaprazlaşmak	girift bûn
çaprazlaşma	giriftbûn
hezimete uğ­ramak	faşil bûn
katkılanmak	îlawe kirin
munzam	îlawekirî
eşitleşme	wekhevbûn
kamusallaşmak	gelemperî bûn
kamusallaşma	gelemperîbûn
icarlamak	demankirin
günülemek	dexesî kirin
günüleme	dexesîkirin
ümide düşmek	hêvîdar bûn
ümit serpmek	hêvîdar kirin
ihtisaslaşmak	pispor bûn
ihtisaslaşma	pisporbûn
müteselli	aşbûyî
oyalı	çînkirî
güveni sağlamak	pêbawer kirin
normalleştirmek	asayî kirin
pahalanmak	biha bûn
zahmet görmek	biha bûn
fiyatlanmak	biha bûn
pahalanma	bihabûn
fiyatlanma	bihabûn
art kafa	bihabûn
sırolma	gombûn
salgılamak	avzêkirin
sosyalleştirmek	civakî kirin
sosyalizasyon	civakîkirin
sosyalleştirme	civakîkirin
itâf	telefkirin
yakınlaşmak	nêz bûn
yanaşık	nêzbûyî
yaklaştırmak	nêz kirin
zikir etmek	zikir kirin
afacanlaşmak	nehs bûn
ahenkleştirmek	ahengdar kirin
havalandırmak	hewadar kirin
havalandırma	hewadarkirin
çağdaşlaşmak	hemdemî bûn
muasırlaşmak	hemdemî bûn
çağdaşlaşma	hemdemîbûn
muasırlaşma	hemdemîbûn
çağdaşlaştırmak	hemdemî kirin
iğnelemek	derzî kirin
iğneleme	derzîkirin
hasat etmek	paleyî kirin
beklenti içinde olmak	bendewar bûn
tatlılaştırmak	şîrîn kirin
çıplanmak	tazî bûn
çıplanma	tazîbûn
göz önüne getirmek	pêşçav kirin
tevsik etmek	belge kirin
tevsik	belgekirin
biçimsiz olmak	bêteşe bûn
bozuk para gibi harcamak	bêqîmet kirin
bollanma	gumrehbûn
bollaşma	gumrehbûn
bollanma, bollaşma	gumrehbûn
şarj etmek	şarj kirin
hırsızlık etmek	dizî kirin
çirişlemek	şîrêz kirin
haşilamak	şîrêz kirin
densizleşmek	çors bûn
densizleşme	çorsbûn
derinletmek	kûr kirin
silahsızlandırmak	bêçek kirin
silahtan etmek	bêçek kirin
paketleyiş	pakêtkirin
hükümran olmak	serwer bûn
zat işleri	teqawidbûn
mütekait	teqawidbûyî
araplaştırmak	ereb kirin
grev yapmak	grev kirin
yıkışmak	gulaş kirin
yıkışma	gulaşkirin
tersleşmek	cirnexweş bûn
tersleşme	cirnexweşbûn
ımızganmak	xilmaş bûn
ımızganma	xilmaşbûn
sipariş etmek	sparîş kirin
iğne ardı yapmak	şel kirin
sığ olmak	tenik bûn
doymuş	terbûyî
yasallaştırmak	zagonî kirin
yasalaştırmak	qanûnî kirin
yasalaştırma	qanûnîkirin
kartalmak	qert bûn
keselemek	lûf kirin
keseleme	lûfkirin
lifleme	lûfkirin
kütleşmek	kol bûn
kütleşme	kolbûn
sumsuklamak	kol kirin
kütleştirme	kolkirin
kesinlik kazanmak	esehî bûn
münakaşa götürmemek	esehî bûn
anlaşıldı vehbi'nin kerakesi	esehî bûn
anlaşıldı pederin bayraktar olduğu	esehî bûn
sınırlandırma	sinordarkirin
tahdit etmek	bisinor kirin
tahdidat	bisinorkirin
yerelleşmek	mehelî bûn
yerelleşme	mehelîbûn
yerelleştirme	mehelîkirin
makas vurmak	meqes kirin
mırın kırın etmek	nazî kirin
uzaklanmak	nazî kirin
istiğna	nazîkirin
nazlanış	nazîkirin
teşne olmak	minêkar bûn
lakırdı tmek	laqirdî kirin
yüz suyu dökmek	rûşûştî bûn
gençleştirme	xortkirin
afsunlamak	efsûn kirin
teshir etmek	efsûn kirin
afsunlama	efsûnkirin
teshir	efsûnkirin
agâh olmak	agahdar bûn
aktiflik	çalakbûn
buruklaşmak	dilmayî bûn
istihdaf etmek	armanc kirin
koşullandırmak	merc kirin
seyrekleştirme	firkkirin
aralanmak	firk bûn
nedret kesp etmek	firk bûn
seyrekleşmek	firk bûn
seyrelmek	firk bûn
seyrelme	firk bûn
seyrekleşme	firkbûn
dörtleme	carkirin
arşınlamak	gaz kirin
gezlemek	gaz kirin
arşınlama	gazkirin
gezleme	gazkirin
özdeşleşmek	eynî bûn
özdeşleşme	eynîbûn
özdeşlemek	eynî kirin
özdeşleştirmek	eynî kirin
özdeşleme	eynîkirin
özdeşleştirme	eynîkirin
denkleme	dingkirin
ihsan etmek	qencî kirin
inayet etmek	qencî kirin
iyilik etmek	qencî kirin
garplılaşmak	rojavayî bûn
batılılaşmak	rojavayî bûn
batılılaşma	rojavayîbûn
garplılaşma	rojavayîbûn
batılılaştırmak	rojavayî kirin
garplılaştırmak	rojavayî kirin
batılılaştırma	rojavayîkirin
garplılaştırma	rojavayîkirin
bayındırlaştırmak	avadanî kirin
bayındırlaştırma	avadanîkirin
dilencilik etmek	parsekî kirin
yardımcı olmak	alîkar bûn
tedarikte bulunmak	hazirî kirin
insafsızlık etmek	bêwijdanî kirin
ondurmak	bextewer kirin
kargayı bülbül diye satmak	sîs kirin
şişleme	sîskirin
sekileme	mişarkirin
tümlenme	tevabûn
üleşilmek	parî bûn
üleşilme	parîbûn
merkezîleştirme	navendîkirin
ciddileşmek	cidî bûn
ciddileşme	cidîbûn
iş bilirliği yapmak	hevkarî kirin
katkıda bulunmak	hevkarî kirin
kısıntı yapmak	sexbêrî kirin
ekonomik davranmak	sexbêrî kirin
çepellenmek	çepelî bûn
çirkefleşmek	çepelî bûn
çepellenme	çepelîbûn
çılgınlaşma	dîwanebûn
kov etmek	xeyb kirin
derinleşmek	kûr bûn
ders işlemek	ders kirin
ders yapmak	ders kirin
terviç etmek	piştevanî kirin
direnlemek	cemik kirin
dirgenlemek	cemik kirin
gem vurmak	lixav kirin
çeki düzen vermek	birêkûpêk kirin
ortalığa çeki düzen vermek	birêkûpêk kirin
efelenmek	mêranî kirin
makul olmak	maqûl bûn
akla uymak	maqûl bûn
kremlemek	melhem kirin
sünnet etmek	sinet kirin
globalleşmek	cîhanî bûn
kotlamak	kod kirin
kodlama	kodkirin
kemrelemek	zibil kirin
fışkılamak	zibil kirin
filârizlemek	şonik kirin
tokaçlamak	şonik kirin
filârizleme	şonikkirin
tokaçlama	şonikkirin
fosilleşme	fosîlbûn
taşıllaşma	fosîlbûn
gözü dönmek	çavsorî bûn
gözü kızmak	çavsorî bûn
zahmet olmak	zehmet bûn
öğretim yapmak	mamostetî kirin
islemek	tenî kirin
çekimlemek	kêş kirin
patavatsız olmak	çort bûn
prüzlenmek	gijbûn
peklik çekmek	hefsî bûn
komuta etmek	serkarî kirin
başa kakmak	serhevde kirin
kılıbıklaşmak	serjinikî bûn
kılıbıklaşma	serjinikîbûn
kılıbıklık etmek	serjinikî kirin
kazıklayış	singkirin
yanağında güller açmak	bikêf bûn
şevke getirmek	bikêf kirin
iftihar etmek	şanazî kirin
onur duymak	şanazî kirin
kirizma yapmak	kolan kirin
kirizmalamak	kolan kirin
enselemek	kolan kirin
kocalma	kokimbûn
kocama	kokimbûn
kocatmak	kokim kirin
kocaltma	kokimkirin
kocatma	kokimkirin
korte etmek	flort kirin
flört yapmak	flort kirin
bağımlı hale getirmek	bende kirin
süreğenleşmek	kronîk bûn
müzminleşme	kronîkbûn
süreğenleşme	kronîkbûn
müzminleştirme	kronîkkirin
küreleme	bêrkirin
küreme	bêrkirin
kürüme	bêrkirin
küreleme, küreme	bêrkirin
laçkalaştırma	şorekirin
leke olmak	leke bûn
merkezlenmek	navendî bûn
merkezlenme	navendîbûn
millileşmek	neteweyî bûn
ulusallaşmak	neteweyî bûn
millileşme	neteweyîbûn
ulusallaşma	neteweyîbûn
seferber etmek	seferber kirin
muhabbet etmek	yaranî kirin
müstahak olmak	layiq bûn
orgazm olmak	orgazm bûn
yürek selanik	ziravqetî bûn
payan olmamak	bêpayan bûn
kamalama	pîçkirin
seçkin kılmak	bijare kirin
stabilize etmek	zexim kirin
zımparalama	simartekirin
simgeleştirmek	sembolîze kirin
soğuk kanlı olmak	xwînsar bûn
sinsileşmek	pinî bûn
sinsileşme	pinîbûn
siyasallaşmak	siyasî bûn
siyasileşmek	siyasî bûn
sondaj yapmak	sondaj kirin
sondajlamak	sondaj kirin
tahaccür	kevirbûn
tıpışlamak	teptep kirin
tapışlama	teptepkirin
tıpışlama	teptepkirin
tellemek	têl kirin
tanılama	teşxîskirin
tırpan atmak	qirim kirin
tevkil	wekîlkirin
tevkil etme	wekîlkirin
yarımlama	nîvçekirin
yaşını almak	navsere bûn
yaşlı başlı olmak	navsere bûn
yaşını başım almak	navsere bûn
abone olmak	kiryar bûn
yemin billah etmek	ad kirin
ağda yapmak	dobe kirin
ağdalamak	dobe kirin
ağzının kaşığı olmak	lavakar bûn
akıcılaştırmak	rewankirin
akıl etmek	aqil kirin
alacaklı olmak	deyndêr bûn
ambalaj yapmak	ambelaj kirin
ambalajlama	ambelajkirin
angaj olmak	angaje bûn
angaje etmek	angaje kirin
abideleşme	bîrdarîbûn
arşivlemek	arşîv kirin
arşivleme	arşîvkirin
astarlamak	betankirin
bantlamak	band kirin
bantlama	bandkirin
başak toplamak	liqat kirin
bayındırlaşmak	avadanî bûn
bayındırlaşma	avadanîbûn
beliklemek	kezî kirin
ayırt etme	vavêrkirin
bengilemek	ebedî kirin
bengileşmek	ebedî bûn
beste bağlamak	beste kirin
bireyleşme	ferdîbûn
bireyleştirmek	ferdî kirin
bireyleştirme	ferdîkirin
topa tutmak	topbaran kirin
boşlanmak	gişt bûn
buluğa ermek	gêranî bûn
camlaşma	cambûn
bebek beklemek	bizar bûn
cılk etmek	cilq kirin
ülke açmak	fetih kirin
cömertleşmek	comerd bûn
akçesi ucuz olmak	comerd bûn
cömertleşme	comerdbûn
cüzamlı olmak	kotî bûn
çalımlamak	çalim kirin
çalımlama	çalimkirin
çapkınlaşma	tolazbûn
çarmıha germek	çarmix kirin
çelikleşme	polabûn
çene yapmak	çene kirin
çerçevelemek	çarçove kirin
çerçeveleme	çarçovekirin
çerezlenmek	çerez kirin
çeteleşme	çetebûn
çeteleştirme	çetekirin
çimentolama	çîmentokirin
yumaklama	gilokkirin
darbe yapmak	derbe kirin
darlaşma	destengbûn
delik deşik etmek	qulqulî kirin
delilik yapmak	dînîtî kirin
delişmenlik yapmak	dînemêrî kirin
demagoji yapmak	demagojî kirin
demokratikleşmek	demokratîk bûn
demokratikleşme	demokratîkbûn
demokratikleştirmek	demokratîk kirin
demokratikleştirme	demokratîkkirin
demokratlaşmak	demokrat bûn
demokratlaşma	demokratbûn
übvansiyon	destekkirin
sübvansiyon	destekkirin
destekleyicisi olmak	destekkirî
destekli	destekkirî
desteleme	destikkirin
rahat olmak	dilrehet bûn
ferehlama	dilrehetbûn
dinamitleme	dînamîtkirin
kurallı hale getirmek	rist kirin
gübreleme	gubrekirin
efeleşme	mêrxasbûn
ön alım	peskirî
eklemlemek	movik kirin
eklemleme	movikkirin
elçilik etmek	qasidî kirin
elçilik yapmak	qasidî kirin
esası olmamak	bêbinî bûn
etüt etmek	etûd kirin
fakslamak	faks kirin
felsefe yapmak	felsefe kirin
şifrelemek	şîfre kirin
şifreleme	şîfrekirin
yasını tutmak	sîn kirin
dolgulu	sînkirî
geçkinlik	salborîbûn
gezinmek	seyran kirin
değersizleşmek	bêrûmet bûn
göçebeleşme	koçerbûn
hadım et­mek	nemêr kirin
hadımlaştırmak	nemêrî kirin
hafiflik etmek	sivikî kirin
halkalanış	xelekîbûn
hamd etmek	hemd kirin
hamurlaşma	hevîrbûn
hatıllamak	fîz kirin
herk etmek	şûv kirin
heveslenme	dilxwazîkirin
hışıldama	xuşînkirin
holdingleşme	holdîngbûn
bühtan etmek	buxtan kirin
müslümanlaşmak	misilman bûn
müslüman olma	misilmanbûn
müslümanlaştırmak	misilman kirin
yüzünü asmak	mirûz kirin
istiskal	mirûzkirin
katılım sağlamak	beşdarî kirin
yeride kalmak	bêqîmet bûn
yerde kalmak	bêqîmet bûn
gıybet etmek	paşgotinî kirin
sahtekarlık yapmak	dexelî kirin
kanlandırmak	xwîndar kirin
kargılamak	rim kirin
katranlama	qetrankirin
kavlaşma	pûşîbûn
kaza etmek	qeza kirin
kekreleşmek	mir bûn
kekrelik	mirbûn
feel dizzy	çavtarî bûn
gözü kararmak	çavtarî bûn
kerpiçleşme	tertbûn
sakallanmak	birî bûn
sakallanma	birîbûn
kığılamak	bişkul kirin
kıtır kıtır öğütmek	kir kirin
kokulandırmak	bêhndar kirin
kokulandırma	bêhndarkirin
kolonyalı	kolonîkirin
kontak yapmak	kontak kirin
kökleştirmek	ripin kirin
kurban kesmek	boraq kirin
yapılanmak	sazî bûn
kusur işlemek	qisûr kirin
kusur etmek	qisûr kirin
kutuplanmak	salîs bûn
kutuplanma	salîsbûn
kuyruğunu kısmak	teres bûn
kürtçeleştirme	kurdîkirin
laikleştirmek	laîk kirin
laikleştirme	laîkkirin
layık olmak	sezawer bûn
piç etmek	tarîf kirin
tanımlama	tarîfkirin
tanımlayış	tarîfkirin
liste yapmak	navnîş kirin
macunlamak	macûn kirin
macunlama	macûnkirin
mahmuzlama	galûkkirin
mal edinmek	mal kirin
mallanmak	maldar bûn
marjinalleşmek	marjînal bûn
marjinalleştirmek	marjînal kirin
marjinalleştirme	marjînalkirin
maskeleme	rûpoşkirin
mazotlamak	mazot kirin
mazotlama	mazotkirin
merhemlemek	merhem kirin
merhemleme	merhemkirin
meydan okumak	meydan kirin
mimli	mîmkirî
minelemek	minê kirin
mineli	minêkirî
muska ile büyü yapmak	nivişt kirin
mülhem olmak	xêvzan bûn
mürekkepleme	hibirkirin
nezaket kesp etmek	nazik bûn
tahakkuk	çibûn
neftileşmek	neftî bûn
neftileşme	neftîbûn
neşterleme	nişterkirin
nicelemek	çendanî kirin
niceleme	çendanîkirin
nispet kabul etmek	rêje kirin
normalleşme	normalbûn
nükte yapmak	nukte kirin
olumlulamak	erênî kirin
olumlama	erênîkirin
ot biçmek	dirûn kirin
ozonlamak	ozon kirin
ozonlama	ozonkirin
özerkleşmek	xweserî bûn
özerkleşme	xweserîbûn
özerkleştirmek	xweserî kirin
özgünleşmek	resenî bûn
özgünleşme	resenîbûn
özgünleştirmek	resenî kirin
özgünleştirme	resenîkirin
tersyüz olmak	berevajî bûn
payelemek	paye kirin
pembe görmek	çakbîn bûn
pembeleşmek	pembe bûn
pembeleşme	pembebûn
pembeleştirmek	pembe kirin
pembeleştirme	pembekirin
perçinlenme	perçînbûn
pergellemek	pergar kirin
pergelleme	pergarkirin
hasırlamak	heşir kirin
hasırlama	heşirkirin
peşrevlemek	pêşrew kirin
boşa çıkmak	beredayî bûn
piknik yapmak	pîknîk kirin
pompalama	avkêşkirin
ponzalamak	kefik kirin
ponzalama	kefikkirin
profesyonelleşmek	profesyonel bûn
profesyonelleşme	profesyonelbûn
racon kesmek	pirêze kirin
rasyonelleştirmek	rasyonel kirin
rasyonelleştirme	rasyonelkirin
rengi solmak	qîçik bûn
renksizleştirmek	bêreng kirin
işi resmiyete dökmek	resmî kirin
rezeleme	rizdekirin
nitelendirmek	wesf kirin
robotlaşma	robotbûn
robotlaştırma	robotkirin
rol kesmek	newa kirin
romanlaştırma	romankirin
bilme	zanabûn
pusulayı şaşırmak	reşaş kirin
sarplaşma	palbûn
savatlamak	sewad kirin
savatlı	sewadkirî
harman savurmak	berba kirin
çarçur etmek	berba kirin
seferber olmak	seferber bûn
sentezlemek	sentez kirin
sergi sermek	miştaxe kirin
geyik etine girmek	xama bûn
serserileşmek	serserî bûn
serserileşme	serserîbûn
haytalık etmek	serserî kirin
sevda çekmek	dilketî bûn
seyahat etmek	seyahet kirin
sıkıca kapanmak	kîp bûn
kenetlenmek	kîpbûn
düzülmek	birêz bûn
sıralanma	birêzbûn
sıva vurmak	seyek kirin
sınırlı olmak	sinordar bûn
sirkelenmek	sirke kirin
sislendirmek	mijdar kirin
sistemleşmek	biserûber bûn
softalaşmak	hişkebawerî bûn
softalaşma	hişkebawerîbûn
sosyalleşmek	civakî bûn
toplumsallaşma	civakîbûn
sosyalleşme	civakîbûn
sömürgeleşme	mêtingehbûn
sülfürleme	kerkîtkirin
sünnet olmak	sinet bûn
takim	bêberkirin
tamponlamak	tampon kirin
tamponlama	tamponkirin
tanrılaşma	yezdanbûn
tapanlama	faşûnkirin
tapulama	tapokirin
kenetleşmek	hevbendîkirin
silindirle bastırılmış	gindorkirin
tesit etmek	pîrozbahî kirin
tebrik etmek	pîrozbahî kirin
kutlayış	pîrozbahîkirin
tipilemek	moryaz kirin
tipileme	moryazkirin
parmaklama	tîzkirin
tozdan dumandan ferman okumamak	geremol bûn
tutkallamak	cewî kirin
tutkallama	cewîkirin
tutumlu olmak	sexbêrî bûn
uluslaşmak	netewe bûn
uluslaşma	netewebûn
uluslaştırma	netewekirin
ağaçlandırılma	bîdarkirin
mülayim çıkmak	sernerm bûn
uysallaşma	sernermbûn
uysallaştırmak	sernerm kirin
üsluplaştırmak	şêwaz kirin
üsluplaştırma	şêwazkirin
mantarlamak	vîr kirin
yabancılık duymak	xerîbî kirin
yayvanlaşmak	vêl bûn
yayvanlaşma	vêlbûn
yenilik yapmak	cihêrengî kirin
zıhlamak	qeytan kirin
zıhlama	qeytankirin
zıpkınlamak	metran kirin
zıpkınlama	metrankirin
hapt etmek	zîq kirin
hoşafın yağı kesilmek	zîq kirin
çullamak	çîl kirin
çullama	çîlkirin
raydan çıkmak	serûbin bûn
altüst olmak	serûbin bûn
tekerlekli sandalye	kursiyê biteker
pelesenk	belesan
elbiselerini çıkarmak	ji xwe kirin
şebiarus	şebî erûs
şeb-i arus	şebî erûs
düğün gecesi	şebî erûs
iddealist	mengîwer
fırat kaplumbağası	reqê sêlane
fokus	fokûs
pratikte	emeliyen
uygulamada	emeliyen
gerçekte	emeliyen
bey kardeş	birako
imanım	birako
kardeş cinayeti	birakujî
uzak akraba	biraxwê
kandaş	biraxwê
uzak akrabalık	biraxwê
erkek kardeşin kız çocuğu	birazê
gislaved	cizrawêt
cızlavet	cizrawêt
cislavet	cizrawêt
müşrik	mişrik
analoji	analojî
topyoka	tapyoka
fağfurî	ferfûrî
nesturi	nestûrî
yasama organı	qanûnsaz
cihadi	cîhadî
kürt yüksek konseyi	desteya bilind ya kurd
keşişhane	keşîşxane
ilgilendiriş	têkildarî
yabani burçak	şolgenîk
bükün	tewang
keme mantarı	dobelan
cebrail	cibraîl
buhara	buxara
şans eseri	sitfen
para cezası	xeramet
planör	planor
turnike	tûrnîke
finalist	fînalîst
yakıntı	xirbe
keskin nişancı	nîşanbaz
aşıkane	aşiqane
mutsuzca	bedbextane
hissizce	bêhişane
duygusuzca	bêhişane
duygusuz bir biçimde	bêhişane
aktifçe	çalakane
faal bir biçimde	çalakane
dâhiyane	dahiyane
dâhice	dahiyane
dirice	zindiyane
olağanlık	asayîtî
semeresizlik	bêberî
ürünsüzlük	bêberî
bedbinlik	bedbînî
bitkinlik	bêhalî
ağız tatsızlığı	bêhizûrî
mükemmellik	bêkêmasîtî
kabahatsizlik	bêqisûrî
molozluk	beredayîtî
ileri sürme	berpêşî
ecnebilik	biyanîtî
yeğlik	çêtirî
densizlik	çorsî
lahana turşusu	çorsî
el çabukluğu	destsivikî
emektarlık	emekdarî
bireysellik	ferdîtî
ferdiyet	ferdîtî
tanışıklık	hevnasî
homojenlik	homojenî
evcilik	kedîtî
ruhaniyet	manewîtî
eşraflık	maqûlî
megalomani	megalomanî
büyüklük hastalığı	megalomanî
meşruluk	meşrûtî
meşruti	meşrûtî
asrîlik	modernî
küfran	nankorî
nezaketlilik	nazikî
naziklik	nazikî
habanera	nemerdî
namertlik	nemerdî
nötrlük	nêtarî
ulusallık	neteweyîtî
profesyonellik	profesyonelî
gürbüzlük	rebîtî
batılılık	rojavayîtî
elebaşılık	sergerdetî
mutedillik	sernermî
pütürsüzlük	şayîkî
sultani tembellik	tiralî
çapkınlık	tolazî
yalınayak olma hali	xwasî
allâmelik	zanatî
bilecenlik	zanatî
donukluk	zenûnî
dalgacılık	zexelî
mıymıntılık	zexelî
aklını çalmak	xirab kirin
masraf etmek	mesref kirin
masraf görmek	mesref kirin
arası açılmak	xirab bûn
çelikleştirmek	xurt kirin
terettüp etmek	hewce kirin
kılavuzlamak	rêberî kirin
kılavuzluk etmek	rêberî kirin
kösemenlik etmek	rêberî kirin
rehberlik etmek	rêberî kirin
aslan kesilmek	jêhat bûn
soru sormak	pirs kirin
selâm söylemek	pirs kirin
ithamda bulunmak	tawanbar kirin
darlaştırmak	teng kirin
ayağı şaşmak	şaş kirin
çeldirmek	şaş kirin
karanlık etmek	tarî kirin
ilca etmek	zor kirin
zor hale getirmek	zor kirin
kuyruğuna basmak	tehl kirin
beddua etmek	nifir kirin
ilenmek	nifir kirin
inkisar etmek	nifir kirin
lanet okumak	nifir kirin
ileniş	nifirkirî
yardımda bulunmak	alî kirin
sağırlaştırmak	ker kirin
zımbalamak	ker kirin
sağır olmak	ker bûn
sağırlaşmak	ker bûn
ıssızlık çökmek	ker bûn
posta yapmak	sefer kirin
uslanma	biaqilbûn
selâm etmek	silav kirin
sıklaştırma	gurkirin
aykırılama	averêbûn
inhiraf	averêbûn
küçültülmüş	biçûkkirî
den uzak	dûr kirin
dipçiklemek	qûntax kirin
dipçikleme	qûntaxkirin
yıllanmak	kevnar bûn
yıllatmak	kevnar kirin
elde avuçta kalmamak	vala bûn
yüreği konuşmak	wêrek bûn
hapis cezası	hefskirin
güvendirmek	ewlekirin
zeki olmak	jîr bûn
reklam etmek	reklam kirin
zamirleri bir olmak	hevbîr bûn
dert etmek	xem kirin
sümüğünü çekip durmak	bêkêr bûn
kurtlanma	kirmîbûn
kurtlandırma	kirmîkirin
telin etmek	nalet kirin
zümrütlenmek	kesk bûn
vurduğu yerden ses gelmek	hêzdar bûn
kadınlaşma	jinbûn
küçükleşmek	biçûk bûn
yamalanma	pînebûn
esenliğe kavuşmak	silametî bûn
müdahalede bulunmak	destdirêjî kirin
serinletme	hênikkirin
acıktırma	birçîkirin
acıktırmak	birçî kirin
açkılamak	perdaq kirin
apreleme	perdaqkirin
açkılama	perdaqkirin
irtihal olmak	neql bûn
tanrılaştırma	xwedêkirin
ayıp etmek	eyb kirin
sık boğaz etmek	pest kirin
üzerine varmak	pest kirin
gün ışığına çıkmak	aşkera bûn
çobanlık etmek	şivanî kirin
rahatlatmak	hêsa kirin
rahatlatma	hêsakirin
tabiileşme	siriştîbûn
doğallaştırmak	siriştî kirin
filtrelemek	fîlter kirin
kopçalamak	qumçe kirin
kopçalama	qumçekirin
edepsizleşmek	bêedeb bûn
edepsizleşme	bêedebbûn
gol yapmak	gol kirin
girişimde bulunmak	teşebis kirin
göz etmek	çav kirin
göz dikmek	çav kirin
korkaklık etmek	tirsokî kirin
bağımsız olmak	serbixwe bûn
yırtıklık	qetandîbûn
kulp takmak	çimbil kirin
yıldızlaşmak	meşûr bûn
varit olmak	miteber bûn
numaralamak	nimre kirin
numaralama	nimrekirin
numaralayış	nimrekirin
yürürlüğe girmek	mirov bûn
kılınmak	hatin kirin
edilmek	hatin kirin
yayılıp kurulmak	pelaş bûn
yayımlanma	pexşbûn
zararı olmamak	bêzerar bûn
zararı olmama	bêzerarbûn
zararsız olma	bêzerarbûn
sözlenmek	ehdkirin
ayıp olmak	eyb bûn
çoraklaşmak	bêwec bûn
çoraklaşma	bêwecbûn
çoraklaştırmak	bêwec kirin
çoraklaştırma	bêweckirin
li nav çavan xistin	neheqî kirin
bez bağlamak	potik kirin
biat etmek	biyet kirin
bohçalama	boxçekirin
frenleme	frênkirin
çizilme	xêzbûn
sefilleri oynamak	bêpere bûn
dişileşmek	makî bûn
dişileşme	makîbûn
elaman çekmek	eleman kirin
evlilik yapmak	zewac kirin
filizlemek	bistîk kirin
filizleme	bistîkkirin
fortçuluk yapmak	kuş kirin
gol olmak	gol bûn
gümüşîleşmek	zîvîn bûn
gümüşîleşme	zîvînbûn
günedoğrulum	gulberrojbûn
hiçe ermek	hidayet bûn
ihale olmak	îhale bûn
cefa etmek	tade kirin
i̇slâmlaşmak	îslam bûn
i̇slâmlaşma	îslambûn
islâmlaştırmak	îslam kirin
istihdam etmek	istihdam kirin
temize çıkmak	bêrî bûn
kabaklaşma	kulindbûn
kapaklamak	bergeh kirin
karışlamak	bost kirin
karışlama	bostkirin
kavramlaştırmak	têgih kirin
kavramlaştırma	têgihkirin
kelepçelemek	kelemçe kirin
kenet etmek	kelemçe kirin
kelepçe etmek	kelemçe kirin
kelepçeleme	kelemçekirin
kemikleşme	hestîbûn
kılıçlamak	şûr kirin
büyülenmek	sihir bûn
köyleşme	gundbûn
hazırlık yapmak	tidark kirin
tedarik etmek	tidark kirin
maşalamak	maşik kirin
maşalama	maşikkirin
mumyalamak	mûmî kirin
mumyalama	mûmîkirin
mumyalaşma	mûmîbûn
olağanlaşma	adetîbûn
otomatikleşmek	otomatîk bûn
pişmanlık duymak	jovan bûn
putlaşma	pûtbûn
putlaştırma	pûtkirin
topraklamak	xwelî kirin
topraklama	xwelîkirin
sefere çıkmak	rêwî bûn
rendeleme	rendekirin
rendeli	rendekirî
satış yapmak	firotin kirin
sayılamak	hejmar kirin
sayılama	hejmarkirin
secde etmek	sicde bûn
sücut	sicdekirin
şehirleşme	bajarbûn
talaşlamak	kewş kirin
talaşlımla	kewşkirin
talaşlama	kewşkirin
örneklenmiş	nimûnekirî
hazırlık görmek	amadehî kirin
tohumlamak	tuxm kirin
transkripe etmek	tîpguhêzî kirin
matuf	arastebûyî
yükünmek	sicade bûn
zerketmek	zerik kirin
içitmek	zerik kirin
zerketme	zerikkirin
zerk etmek	zerikkirin
içitme	zerikkirin
su katmak	av kirin
yumurtlamak	hêk kirin
boyalanmak	boyaxbûn
çölleşme	çolbûn
onurunu ayaklar altına almak	pîs kirin
kantarlıyı atmak	pîs kirin
çakıllık	xîçkirî
vergicilik	bacgirî
sandalcılık	belemvanî
cihangirlik	cîhangirî
çift tekercilik	duçerxevanî
ucuzcu	erzanfiroş
çorapçı	gorefiroş
çorapçılık	gorefiroşî
helvacı	helawfiroş
helvacılık	helawfiroşî
hukuklu	hiqûqvanî
yapakçı	hirîfiroş
yünc	hirîfiroş
yüncü	hirîfiroş
kebabçılık	kebabfiroşî
gemicilik	keştîvanî
yorgancılık	lihêfvanî
boncukçu	morîfiroş
boncukçuluk	morîfiroşî
motorculuk	motorvanî
otomobilcilik	otomobîlvanî
pansiyonculuk	pansiyonvanî
partici	partîgir
partili	partîgir
perdeci	perdefiroş
radyoculuk	radyovanî
sabuncu	sabûnfiroş
sabunculuk	sabûnfiroşî
politikacılık	siyasetvanî
tarafgirlik	terefgirî
yatçılık	yatvanî
birlikçilik	yekîtîgirî
boykotçu	boykotker
ayrımcı	cudaker
dağlamacı	daxker
indifaî	fisker
serzenişte bulunan	gazinker
koşumcu	hefsarker
uyandırıcı	hişyarker
münebbih	hişyarker
mukni	îqnaker
itirazcı	îtîrazker
judocu	jûdoker
sağırlaştırıcı	kerker
bıçakçı	kerker
dua eden	lavaker
lobici	lobîker
ayıpsayıcı	lomeker
kınayıcı	lomeker
mezeci	mêzeker
yasaklayıcı	qedexeker
zecrî	qedexeker
dizgici	rêzker
sıralayıcı	rêzker
baltalayıcı	saboteker
sansürcü	sansûrker
sigortacı	sîgortaker
ıslatıcı	silker
şantajcı	şantajker
eziyet eden	tadeker
zebunküş	tadeker
sağlıkçı	tîmarker
kaydedici	tomarker
kaybedici	windaker
afişçi	afîşker
provokatör	fîtker
ambalajcı	ambelajker
bayıltıcı	bêhişker
özleştirmeci	xwerûker
artırıcı	zêdeker
çoğaltıcı	zêdeker
hafifletici	sivikker
iğneci	derzîker
teselli edici	teselîker
badanacı	şêlker
daraltıcı	tengker
ezberci	jiberker
mukassi	zivêrker
yılışkan	zivêrker
zağcı	hêsanker
boksör	boksker
borucu	borîker
bozacı	bozaker
frigorofik	sarker
frijider	sarker
soğutmaç	sarker
soğutkan	sarker
soğutucu	sarker
tamamlayıcı	temamker
tümleyici	temamker
büyülteç	mezinker
agrandisör	mezinker
caydırıcı	pêximker
coşturucu	coşker
çizici	xêzker
dansör	reqsker
gıybetçi	xeybker
diriltici	saxker
röle	guhêrker
eklektik	bijarteker
frenleyici kas	astengker
enjeksiyoncu	enjeksiyonker
erketeci	raçavker
gözetici	raçavker
müşahid	raçavker
nezaretçi	raçavker
dikizci	raçavker
eyerci	zînker
frenleyici	frenker
frezeci	frezeker
gasıp	xespker
grevci	grevker
iş bırakımcı	grevker
halkacı	kilorker
muhafazakar	parêzker
hesaplayıcı	hesapker
hülleci	huleker
kara ağızlı	nebîker
ikna edici	qanîker
inceltici	ranker
oyacı	çînker
kahredici	qehrker
kalafatçı	kalafatker
karacı	îftiraker
katracı	qetranker
indirgen	kêmker
yumuşatıcı	kêmker
işkembeci	hûrker
hamurcu	hevîrker
hamurkâr	hevîrker
kolaylaştırıcı	sanayîker
kudurtucu	harker
kunduracı	qondereker
kutucu	qutîker
lakacı	lakaker
mukallit	lasayîker
mozaikçi	mozaîkker
bilgilendirici	agahker
mumlayıcı	şimaker
muskacı	niviştker
mübalâğacı	piroleker
abartıcı	piroleker
abartmacı	piroleker
mümas	temasker
nemlendirici	hêmîker
niceleyici	çendanîker
kazancı	agirker
paspasçı	paspasker
taşlamacı	hîcîwker
heccav	hîcîwker
perdahçı	perdaxker
porselenci	çînîker
raspacı	raspaker
reklamcı	reklamker
revanici	rewanîker
türetici	peydeker
sandalyeci	sendelîker
sandıkçı	sindoqker
saptayıcı	peytker
sentezleyici	sentezker
serinletici	hênikker
siparişçi	sparîşker
sobacı	sobaker
soyguncu	şêlînker
soyutlayıcı	razberker
stabilizator	terazîker
stokçu	stokker
istifçi	stokker
taktikçi	taktîkker
tapucu	tapoker
tekerlekli	biteker
yermeci	zemker
kötüleyici	zemker
sayaç	jimarker
ayarlar	mîheng
denek taşı	mîheng
ateş vermek	agir berdan
ateş yakmak	agir vêxistin
silah bırakmak	çek danîn
abdest almak	destnivêj girtin
aptes almak	destnivêj girtin
aptest almak	destnivêj girtin
pusuya yatmak	kemîn vegirtin
balık tutmak	masî girtin
çağmak	tav dan
ödül vermek	xelat dan
mükâfat almak	xelat girtin
kan vermek	xwîn dan
abonelik	abonetî
mezellet	adîtî
banallık	adîtî
sürücülük	ajovanî
yardakçılık	altaxî
ispiyon	altaxî
yardak	altaxî
amatörlük	amatorî
müşavere	amojî
asistanlık	asîstanî
aleniyet	aşkeratî
apaçıklık	aşkeratî
ataşelik	ataşetî
atomik	atomî
atomcu	atomî
atomal	atomî
ayrıklı	awartetî
bekârlık	azibî
balerinlik	balerînî
baronluk	baronî
benzersizlik	bêmîsalî
gayri ihtiyari	bêvînî
bezzazlık	bezazî
zevksizlik	bêzewqî
avuç içi kadar	biçûçikî
küçükçe	biçûçikî
küçümencik	biçûçikî
küçürek	biçûçikî
minimini	biçûçikî
kırıkçılık	cebarî
çıkıkçılık	cebarî
kitre	cebarî
sınıkçılık	cebarî
cehennemlik	cehnemî
niteliksel	celebî
canavarlık	cinawirî
kırklı	çilî
sümüksü	çilmî
tetiklik	çipikî
ormanlık	daristanî
dadılık	dayînî
öküzlük	debengî
dekanlık	dekanî
üveyannelik	dêmarîtî
senyörlük	derebegtî
kapıcılık	dergevanî
batakçılık	destbelavî
teenni	destgiranî
genizsi	difinî
çöğüncek	dîlanî
doçentlik	doçentî
dublörlük	dublorî
düklük	dukî
uzak görüşlülük	dûrbînî
hipermetropi	dûrbînî
düşeslik	duşesî
efendilik	efendîtî
alevilik	elewîtî
aklî	eqilî
esirlik	esîrî
göksel	esmanî
esnaflık	esnafî
tonluk	êtûnî
evliyalık	ewliyatî
deneysel	ezmûnî
deneysellik	ezmûnî
ölümlülük	fanîtî
fenni	fenî
sezgisel	ferasetî
lügatçılık	ferhengdanerî
geylik	gaytî
feriklik	generalî
generallik	generalî
gudde	gînî
kodamanlık	giregirî
sözel	gotinî
söylenmiş	gotinî
kurtluk	gurîtî
altın kaplama	herzêlî
mavimtırak	hêsinî
ses uyumu	hevdengî
oydaşlık	hevdengî
muadelet	hevtayî
bozgunluk	hezîmetî
seçmenlik	hilbijêrî
üveylik	hilûtî
hissi	hişî
çıtı pıtı	hûrikî
yarım porsiyon	hûrikî
i̇slamcı	îslamîtî
jandarmalık	jendirmetî
doğaçlama	jixweberî
tuluat	jixweberî
kaptanlık	kaptanî
iş bölümü	karbesî
keleşlik	keleşî
kırıkkale piyade tüfeği	kemalî
kimyoni	kemyonî
tartıl	keşayî
bulgusal	keşfî
molotof	kokteylî
derneksel	komeleyî
komiserlik	komîserî
toplayıcılık	komkerî
korsanlık	korsanî
hıyarlık	kulindî
tombulca	kulindokî
metalik	laciwerdî
metalurji	laciwerdî
pepeleme	lalûtetî
rekabete girişmek	lalûtetî
can atma	lavahî
eylemsi	lêkerî
fiilimsi	lêkerî
altta	libinî
dipte	libinî
litrelik	lîtreyî
lümpe	lumpenî
anayasal	makeqanûnî
ailece	malbatî
evce	malîtî
paralellik	manendî
mankenlik	mankenî
marki	markî
farmasonluk	masonî
masonluk	masonî
ereksel	mebestî
mıknatısiyet	meqnetîzî
mıknatıslık	meqnetîzî
konukluk	mêvanî
meyhanecilik	meyxanevanî
dişillik	mêzatî
inşirah	miferihî
misyonerlik	misyonerî
moto	motorî
uluslararasıcılık	navneteweyîtî
gündüzlü	neharî
nehari	neharî
pratiksel	nerîtî
tatbiki	nerîtî
etnografi	nijadî
soysal	nijadî
mülkî	niştimanî
vatani	niştimanî
ortakçılık	nîvekarî
haberlik	nûçeyî
papalık	papatî
geri kalmışlık	paşvemayîtî
son baharlık	payizî
eğitim bilimi	pedagogî
tutuşmuş	pêgirtî
pembemsi	pembeyî
eğitimsel	perwerdeyî
eğitsel	perwerdeyî
maarif	perwerdeyî
eğitim ve öğretim sistemi	perwerdeyî
eğiticilik	perwerdekerî
eğitimcilik	perwerdekerî
iltisak	pêvekî
iltisaki	pêvekî
bitişken	pêvekî
eklemeli	pêvekî
yayalık	peyatî
kuzenlik	pismamî
fazla yemek	planî
planya	planî
profesörlük	profesorî
psikopati	psîkopatî
puştluk	pûştî
kanun koyuculuk	qanûndanerî
kardiyak	qelbî
kalemşorluk	qelemşorî
karavaşlık	qerwaşî
sezeryenli	qeyserî
kısmi	qismî
kazazede	qurbanî
farazi	rabêjî
iletlşimcllik	ragihînerî
iletişimcilik	ragihînerî
rahiplik	rahîbî
rahibelik	rahîbetî
raportörlük	raportorî
müsteşarlık	rawêjkarî
rahmani	rehmanî
rektörlük	rektorî
ramazanlık	remezanî
siyahça	reşikî
normlara uygun	rêzikî
ruhbaniyet	rihbanî
robotluk	robotî
rupi	rûpî
sayfalık	rûpelî
sadistlik	sadîstî
saatlik	saetî
senevi	salî
mülkiye	samanî
illî	sedemî
asırlık	sedsalî
yüzyıllık	sedsalî
seferi	seferî
sendikal	sendîkayî
onbaşılık	serdestetî
yarbaylık	serhengî
simsarlık	simsarî
komisyonculuk	simsarî
sofuluk	sofîtî
stajyerlik	stajyerî
hanendelik	stranbêjî
sultani	sultanî
softalık	suxtetî
şahinşahlık	şahinşahî
şarab rengi	şerabî
dövüşkenlik	şerûdî
savaşkanlık	şerûdî
bazlamaç	şilekî
çapulculuk	talankerî
talancılık	talankerî
taşeronluk	taşeronî
boğanak	tavî
sağnak	tavî
tahini	tehînî
kantaron otu	tehlî
yoğun yağmur yağışı	tehlî
mükemeliyet	tekûzî
tekaütlük	teqawidî
tepeli toygar	tîtî
dangalaklık	tirredînî
salozluk	tirredînî
direnim	tirûşî
arazi olma	varikî
soruşturuculuk	vekolerî
velâyet	welîtî
velilik	welîtî
müteverrim	weremî
veremli	weremî
çevirmenlik	wergêrî
kaplam	wergirî
çırpıcılık	werşeqî
yayıncılık	weşangerî
hanımefendilik	xanimî
hanımlık	xanimî
kandırıcılık	xapînokî
kandırmaca	xapînokî
hamlık	xavî
gazilik	xazîtî
halifelik	xelîfî
hilafet	xelîfî
eflâtun	xemirî
siklemen	xemirî
şarap tortusu	xemirî
yapıncak	xemirî
kızıl şap	xemirî
kaynatalık	xezûrî
güllâbicilik	xidamî
odacılık	xidamî
görücülük	xwazgînî
kız isteme	xwazgînî
tanrıbilim	xwedanasî
tanrı bilim	xwedanasî
tanrısallık	xwedayîtî
ülûhiyet	xwedayîtî
ülhiyet	xwedayîtî
hoşgörülük	xweşbînî
müsamahakârlık	xweşbînî
kan davalı	xwînî
birincilik	yekemînî
zabitlik	zabitî
cinsellik	zayendî
kokozluk	zegordî
meteliksizlik	zegordî
züğürtlük	zegordî
zerdüştçülük	zerdeştîtî
zevali	zewalî
zeytuni	zeytûnî
zeytin rengi	zeytûnî
zaptiye	ziftî
zümrüdî	zimrûdî
cihangirane	cîhangirane
ozansı	hozanane
patrikhane	patrîkxane
uzmanca	pisporane
sefarethane	sefaretxane
tiyatro evi	şanoxane
kişi başına	şerane
tamirhane	tamîrxane
mükemelen	tekûzane
ıslahane	tîmarxane
tımarhane	tîmarxane
akıl hastahanesi	tîmarxane
ıslah evi	tîmarxane
kayıt evi	tomarxane
vergisiz	bêbac
gümrüksüz	bêbac
bilâbedel	bêbedel
beliğ	bibelaxet
gözlüksüz	bêberçavk
kısmeti açık	bibext
kollu	biçimbil
borç olarak	bideyn
çekkin	bêeleqe
gayri müsmir	bêencam
temkinsiz	bêendaze
endazesiz	bêendaze
temkinli	biendaze
ihtiyatla	biendaze
faizsiz	bêfaîz
çiğitli	bihêb
havasız	bêhewa
hercai	bêhewa
müteşebbis	hewldar
müteheyyiç	heyecandar
nazirsiz	bêmanend
masrafsız	bêmesref
boğmaklı	bimovik
boğumlu	bimovik
omurgalı	movikdar
nezaketsiz	bênezaket
niyetsiz	bêniyet
niyetli	biniyet
nursuz	bênûr
havlı	bipûrt
döküntülü	biqalik
kapçıklı	biqalik
aysar	bêqerar
prangasız	bêqeyd
gizemci	razdar
mistik	razdar
nispetsiz	bêrêje
sürümlü	birewac
yürürlükte	rewacdar
kötü karakterli	bêrewişt
tenkitçi	rexnedar
salık veren	salixdar
murabahacı	selefdar
cilasız	bêsîqal
sütünsüz	bêstûn
gölge veren	sîdar
yansımasız	bêşewq
yansımalı	şewqdar
ergimek	bişivan
tedbirsiz	bêtevdîr
dirençsiz	bêtirûş
işkilsiz	bêwaswas
süssüz	bêxeml
dil ebesi	biziman
odsuz	bêagir
yaşmaksız	bêxêlî
gözeneksiz	bêçavik
besinsizlik	bêadanî
giyimli kuşamlı	bicilûberg
kısmetli	biqismet
bilurlu	bibelûr
postsuz	bêpost
mesnetli	bipalpişt
çatkısız	bêşaşik
çatkılı	bişaşik
sertifikasız	bêbawername
sertifikalı	bibawername
ardına düşmek	bidû
malulen	binexweşî
tarlasız	bêzevî
kaz kafalı	bêfehm
anca	bizor
metazori	bikotek
belgesiz	bêbelge
görüşü olmayan	bêray
kokusuz	bêbêhn
kıpırtılı	bileqîn
rüzgârsız	bêba
sırasız	bêrêz
haysiyetsizlik	bêgiramî
umacı gibi	bêmirês
şatafatsız	bêwurşe
cevapsız	bêbersiv
yanıtsız	bêbersiv
vasıfsız	bêwesf
gülsüz	bêgul
hafızasız	bêbîr
hafızalı	bibîr
kesici	bibîr
meşruten	bişert
ilgiyle	bibalkêşî
temizce	bipakî
enerjisiz	bêtav
buhranlı	bikrîz
avantajsız	bêavantaj
avantajlı	biavantaj
numarasız	bênumare
tırıl	bêdirav
kırmalı	bipile
güneşsizlik	bêtavî
kılıçlı	bişûr
zırhsız	bêzirx
kabahatli	bitawan
kukuletalı	bikulik
abdestsiz	bêdestnivêj
abdestli	bidestnivêj
aptestli	bidestnivêj
çarksız	bêçerx
insaflı	biinsaf
çizgisiz	bêxêz
tahrilli	bixêz
öfkesiz	bêhêrs
göğüslü	bising
lezzetsizlik	bieklî
ihtiyatsızlık	bêendazeyî
işlevsizlik	bêerkî
muvazzaflık	erkdarî
olasılıkla	bigumanî
hercailik	bêhewayî
havasızlık	bêhewayî
hercaice	bêhewayî
mecalsizlk	bêhewlî
çekimserlik	bêlayenî
evsizlik	bêmalî
bağıtçı	aqit
lüzuci	zeliqok
diş kamaşmak	sekihîn
dişi kamaşmak	sekihîn
müteyakkız	wirya
kapılış	pêdeçûn
teşbih etmek	şibandin
teşbihte bulunmak	şibandin
tokuşma	lihevketin
edna	jêrtirîn
pekent	kendûkosp
tanrı tanımaz	xwedanenas
gelgel	dilkêşî
ritüel	rîtuel
muhteris	azwer
kösnüllü	bişehwet
alkın	banek
kliring	serbiserî
akçıl	spîçolkî
kül gibi	spîçolkî
karyağdı	spîçolkî
öndelik	pêşînat
tehdit edilmek	hedinîn
tip	qelafet
kârsız	bêqezenc
hayır etmemek	bikêrnehatin
hayır gelmemek	bikêrnehatin
keten tohumu	kirkirk
kemircik	kirkirk
karşı karşıya	rûbirû
yüzleşmece	rûbirû
burun buruna	rûbirû
faça façaya	rûbirû
yüz be yüz	rûbirû
çakar almaz	terabe
babaya oturmak	negirtin
sıyırga	mecrefe
besleyici	biadan
beşuş	devbiken
cennetmekân	cenetmekan
firik	qelînek
alt geçit	jêrbor
hızar talaşı	ardik
bölük komutanı	serliq
sapçık	qemçik
yüksek ökçeli ayakkabı	qemçik
harekete geçirmek	bizaftin
hissi uyandırmak	bizaftin
hareket ettirmek	bizaftin
eşlik etme	bizaftin
bübürtü	quretî
ayran budalası gibi	xêtik
şist	şekirok
yaban enginarı	şekirok
kıblenüma	qiblename
leş gibi	laxerî
üşenç	kasilî
pır	şirp
bir ara	demekê
gönül okşayıcı	dilniwaz
roka	cercîr
bağkesen	quzgezk
adımlık	gavek
gözü kapalı	çavgirtî
kızılbaşlık	serşorî
tamahkâr	timakar
hasar verici	xesarok
kıvrıla kıvrıla	xwaromaro
tuhafiyeci	tuhafiyefiroş
haykırtmak	qîjandin
kuş sütü	tûtya
sakıngan	bihendaze
sinamaki	mizmizok
kalıpsız kıyafetsiz	nelihev
sarsantılı	nelihev
yır	murx
fide dikmek	şitilandin
isteyici	viyer
ağzı havada	xêv
sıçan otu	zernîx
sıçanotu	zernîx
ara bulma	navbeynkarî
çiğleşme	xerifîn
akşamcı	şeveder
çakıldama	şeqîn
şakıma	şeqîn
el atma	destekarî
ağzı kulağına yakın	zarxweş
düzmecilik	sextekarî
diş ağrısı	diranêş
bütüncüllük	totalîterî
sakıncalı	bifikar
dinamo	dînemo
spekülasyon	spekulasyon
kuvve	bîrûbawerî
bitmek tükenmek bilmemek	neqedîn
iki ünlü	dudeng
iki taraflılık	durexî
öbür günden sonraki gün	sêsibe
lakab	bernavk
söze gerek kalmadan	bêgotin
bilir kişi	pêzan
ehlihibre	pêzan
ehlivukuf	pêzan
münhezim	têkçûyî
suya batma	xerq
üst gömlek	serkiras
azıtmış	axozî
kur	cîlwe
fiz odak	nîskok
yazı tipi	şêwetîp
damla sakızı	miştek
kar dolgusu	bakût
uyruksuzluk	netebatî
zofa	giyadawidî
levrek	şûf
langir lungur	teqereq
kesp etmek	kesibandin
çitmik	çiqilk
ılıklık	şîrogermîtî
küçük heybe	xurcik
kemik yalayıcı	hestîkoj
tezvirat	ewanî
umut verici	hêvîder
gölcük	bêrm
kasık biti	spîpanik
soluk darlığı	tengenefesî
dava dilekçesi	dozname
içe aktarmak	împort
önemsememe	îgnor
göz ardı etme	îgnor
ihmal etme	îgnor
şatafat	wurşe
ortografi	ortografî
arzanî	berkî
demir pası	zengar
bar bar	barebar
çekçek	kaşkaşok
bitirim yeri	qumarxane
pah	sirûm
ağzı kilitli	devgirtî
sıkı ağızlı	devgirtî
kapalı kutu	devgirtî
siyah beyaz	reşûspî
icabında	îcare
keskin dişli	dirantûj
bestekâr	awazsaz
kompozitör	awazsaz
maestro	awazsaz
muayeneci	venêr
murakıp	venêr
helisel	helezonî
nişasta buğdayı	zegerek
doğram	hewrik
ekmek ufağı	hewrik
pepe	lalik
lastik ağacı	kaûçik
jelatin	jelatîn
tirildetmek	ligligandin
mosmor olmak	ricricîn
rastlayış	leqayîbûn
öğrencelik	hînkarî
mürebbiyelik	perwerdekarî
sıvazlama	mistdan
yılan başı	kespik
nazarlık	kespik
müftehir	pesnok
pohpohçu	pesnok
kasideci	pesnok
önerge	pêşniyarname
nosyon	rêman
yekun	yekûn
argaç	avo
meyancı	navbeynkar
sıradaş	hevrêz
ardıç ağacı	hevrêz
ruhsatlı	destûrdar
şatafatlı	wurşedar
milli	miletî
önbellek	pêşbir
ön hafıza	pêşbir
cache bellek	pêşbir
ürkünç	hêwilnak
yüzü soğuk	hêwilnak
dural	sekan
statik	sekan
stator	sekan
ayna gibi	sekan
çarşaf gibi	sekan
rakit	sekan
muhteviyat	serecem
ekşi yüz	rûtirş
gerikafalı	paşverû
ticanî	paşverû
hokka	huqe
nükleer	nukleer
üvey kız evlat	keçhilî
canı istemeyen	dilnexwaz
niyeti olmayan	dilnexwaz
şeker hastalığı	şekre
nodullama	zextandin
nodullamak	zextandin
kontör	kontor
baş aşağı olma	devnixûn
ana cadde	şahrê
anayol	şahrê
emosyonel	emosyonal
dağılmış olan	herişî
peşin yargı	pêşdarazî
bateri	baterî
akü	akû
yük taşıyıcı	barhilgir
vıdı vıdı	pitpito
ıvır zıvır	kerûper
tiyatro eseri	şanoname
tulum gibi	şîşman
hindibaba	kasnî
kara kavuk	kasnî
kesilmiş	birrî
anlatıcı	vebêj
bağıllık	îzafiyet
bağıntılılık	îzafiyet
pli	kurîşk
ahitname	peymanname
antlaşma metni	peymanname
mukavelename	peymanname
karakuş	çûkreş
tütsü gözü	dûkêşk
alengirli	rewneqdar
ithamname	tawanname
nevzad	nûzayî
yıl boyunca	salmidêr
mine çiçeği	mîne
emaye	mîne
senaryocu	senaryonivîs
yaşlı bilge	pîrmend
sacayağı, üçayak, tripot	sêpêk
kötürümlük	kûdî
plazma	xwînav
bunak	xurifî
mikâp	mîkab
incik boncuk	cînceq
dam saçağı	sivîng
kasatura	nize
ateş gibi	agirnak
albümin	albûmîn
eşekarısı	pîzang
estağfurullah	estexfirullah
sütün	kolek
çakşırsız	bêpirç
tayfölçer	spektroskop
fötr şapka	fotêr
doğacı	naturîst
şıngıl	cirdik
tek yönlü	yekalî
omuzlama	mildan
şahıslandırmak	kesandin
bilge kadın	pîrepind
devri	dewrî
çevriyazı	transkrîpsiyon
transkripsiyon	transkrîpsiyon
zalimane	stemkarane
muhavvile	transformator
mirliva	mîrlîwa
konut belgesi	îqametgeh
mahsül	pêma
hasara sokmak	xusirandin
mazarrat	xusirandin
zarara sokmak	xusirandin
yaprak arısı	mêşik
çekül	şaqûl
şakul	şaqûl
şavul	şaqûl
özyaşamöyküsü	otobiyografî
hışım	xişm
zarara uğramak	xesirîn
çıkmaz yol	korerê
adamcık kemiği	zengilork
depozit	depozît
gül fidesi	jale
delice otu	dimor
alâkasızlık	bêpêwendîtî
hesaplıca	biplanî
esrarengizlik	razdarî
tenkitçilik	rexnedarî
murabaha	selefdarî
murabahacılık	selefdarî
ayaktan	bişaxî
muhataralı	talûkedarî
dayanıksızlık	bêtirûşî
metanetsizlik	bêtirûşî
çepellilik	xisardarî
dileğiyle	bixwestekî
marifetsizlik	bêhunerî
kumalı	bihêwî
idraksizlik	bêfehmî
oburca	bixurekî
kıpırtısız	bêleqînî
lâubalilik	bêgiramîtî
cevapsızlık	bêbersivî
devletsizlik	bêdewletî
yeleli	bibijî
sayıca	bihejmarî
münferiden	bitenayî
deklânşör	deklanşor
nektarin	teraqî
su yılanı	marê avî
telefon etme	bakirin
haydama	bakirin
acıkma	birçîbûn
osurma	fiskirin
mülakat vermek	daxuyanî dan
izahat vermek	daxuyanî dan
geriletme	paşvexistin
babalık etmek	bavtî kirin
babalık yapmak	bavtî kirin
başat olmak	serekî bûn
canını yakmak	zerer dan
rahat vermek	nerehetî dan
kararlaştırma	qerardan
malumat vermek	agahî dan
cumbalama	mevredkirin
eğelenmek	mevredkirin
cumbalamak	mevred kirin
deformasyon	bêteşetîbûn
koz vermek	firset dan
haşiv	tijîkirin
garanti vermek	ewlehî dan
soğuk yemek	sarma xwarin
fiyat koymak	biha danîn
ücretlendirmek	biha danîn
gafil etmek	xafilî kirin
gevreme	piştbûn
gevremek	pişt bûn
gevretme	piştkirin
gevretmek	piştkirin
randevu almak	jovan girtin
hısımlık kurmak	mirovatî danîn
imdat istemek	hewar xwestin
imza vermek	îmza dan
içi sürmek	navêşî bûn
kekemeleşme	lalûtetîbûn
kekemeleşmek	lalûtetî bûn
kıçına tekmeyi yemek	pên xwarin
mikroplanmak	qirêjî bûn
kopkoyu	gepgirtî
köşe başını tutmak	kunc girtin
kolaylık göstermek	qewet dan
kubur sıkmak	demance berdan
kusturma	vereşîndan
kusturuş	vereşîndan
kusturmak	vereşîndan
kuş gibi yemek	piço-piço xwarin
muştulamak	mizgîn dan
müjdelemek	mizgîn dan
tebşir etmek	mizgîn dan
müjde vermek	mizgîn dan
müsaade almak	misade girtin
not düşmek	nîşan girtin
oyun vermek	lîstik dan
el vermek	lîstik dan
ölçü vermek	pîvan dan
sıkıya almak	tevdîr girtin
itizar etmek	uzir xwestin
itizar	uzirxwestin
temizlik yapmak	paqijî kirin
salkım tutmak	wîşî girtin
seçkinleşme	bijaretîbûn
seçkinleşmek	bijaretî bûn
sırtlamak	pişt kirin
topuklama	panîdan
turunculaşmak	sortî bûn
yabalama	milêbkirin
yabalamak	milêb kirin
zekat vermek	zekat dan
şekil almak	şikil girtin
bitişik olmak	pê ve bûn
bitişiklik	pêvebûn
istiane etmek	alîkarî xwestin
istihkar etmek	biçûk xistin
küçük görme	biçûk xistin
önünü çevirmek	berîdan
yağ yakmak	şalûsî kirin
kireçsilemek	ziwa kirin
kurulama	ziwakirin
acı vermek	jan dan
çözüşme	jevbûn
yapılandırma	mîhengkirin
adres bırakma	adresdan
ağaçlandırmak	dar danîn
serbest bırakmak	serbest berdan
halelenmek	sîwan girtin
halelenme	sîwangirtin
ah ü zar etmek	azarî kirin
uzlaştırma	lihevanîn
akçıllanmak	spîçolkî bûn
apak olmak	spîçolkî bûn
benzi kül gibi olmak	spîçolkî bûn
akıl vermek	aqil dan
akla yakın	aqil birin
iniş yapmak	xwe danîn
kendini koyuvermek	xwe danîn
kendini kapıp koyvermek	xwe danîn
burcumak	alav dan
blokaj	manîbûn
gönül çekmek	dil girtin
tutsak almak	dil girtin
alışmış	hobûyî
haydalamak	ho kirin
haylamak	hokirin
allâmelik taslamak	zanatî kirin
alt etme	binxistin
alt olma	binketin
kavgalaşmak	pev çûn
yağılaşmak	pev çûn
aman dilemek	eman xwestin
antlaşmak	peyman danîn
anlaşma bağlamak	peyman danîn
sözleşme imzalamak	peyman danîn
cesaret vermek	cesaret dan
rapor vermek	rapor dan
bina etmek	lê kirin
aracılık etmek	navbeynkarî kirin
arka planda olmak	li paş bûn
tahmil	lêbarkirin
asilik etmek	serhildêrî kirin
ağzına tükürmek	kêm xistin
aşağılaşma	biçûkketin
aşağılaşmak	biçûk ketin
sekiş	çindikdan
göz kapamak	çav girtin
üstünü örtmek	ser girtin
ışık tutmak	ronî dan
yetki vermek	selahiyet dan
makineleştirmek	makîneyî kirin
makineleştirme	makîneyîkirin
ayazlamak	seqemî bûn
ışıtma	ronîdarkirin
aylık almak	meaş girtin
maaş almak	meaş girtin
kibirlilik yapmak	quretî kirin
kurumlan­mak	quretî kirin
kurum satmak	quretî kirin
zılgıt vermek	azar dan
bağlantı kurmak	pêwendî danîn
birbirine yapışmak	hev girtin
ittifak yapmak	hev girtin
bahis tutmak	şert girtin
şart etmek	şert girtin
şart tutmak	şert girtin
iddiaya girmek	şert girtin
şartlaşma	şertgirtin
bahşiş vermek	bexşîş dan
balcılık	hingivkirî
kir tutmak	qirêj girtin
parmaklıklı	caxkirî
başı daralmak	destteng bûn
eli dar olmak	destteng bûn
başı darda olmak	destteng bûn
eli darda olmak	destteng bûn
başlık vermek	next dan
ağır basmak	zor dan
cebretmek	zor dan
kuvvet vermek	zor dan
cabretmek	zordan
mağlub etmek	bin xistin
mağlup etmek	bin xistin
belayı satın almak	bela kirin
kül bağlamak	rû girtin
yüz tutmak	rû girtin
yüzlemek	rû girtin
yüz almak	rûgirtin
kapı almak	derî girtin
kapıyı örtmek	derî girtin
armağan vermek	diyarî dan
sipariş vermek	sparîş dan
kararlaştırmak	qerar dan
ilk planda olmak	li pêş bûn
önde gelmek	li pêş bûn
tekaddüm etmek	li pêş bûn
tekaddüm	li pêş bûn
tekaddüm etme	li pêş bûn
nankörlük yapmak	nankorî kirin
bıyık bırakmak	simbêl berdan
bir hoşluğu olmak	bêkêf bûn
keyfi bozulmak	bêkêf bûn
keyifsizlenmek	bêkêf bûn
keyifsizlenme	bêkêfbûn
birbirini yemek	hev xwarin
terekküp	biyekbûn
müdavim olmak	jê bûn
piç olmak	beredayî çûn
boya tutmak	boyax girtin
önüne bakmak	şermî bûn
börçük etmek	parpar kirin
kan içicilik	xwînxwarî
fingirdemek	îşwe kirin
cilvelenme	cîlwekirin
kur yapmak	cîlwe kirin
cinayet işlemek	mêrkujî kirin
tetikleşme	çipikîbûn
tetikleşmek	çipikî bûn
çapaklanmak	şilop girtin
çapaklanma	şilopgirtin
çatallaştırmak	dijwartir kirin
gücüne koşmak	dijwartir kirin
kurgusal	pevxistî
kurgulanmış	pevxistî
monte edilmiş	pevxistî
çekimsenme	bêlayenîbûn
çekimsenmek	bêlayenî bûn
çelenk koymak	çeleng danîn
çelikleme	şivdanîn
çeliklemek	şiv danîn
çiğlik yapmak	nelirêtî kirin
çukurlatmak	kortalî kirin
dağıtık	jixweçûyî
dal budak salmak	reh berdan
köklendirmek	reh berdan
köklenme	rehberdan
kıl çekmek	şelafî kirin
yağcılık ve yardakçılık yapmak	şelafîkirin
taşak yapmak	tiralî kirin
oturuşmak	hêdî kirin
hasta düşmek	nexweş ketin
rahatsızlanmak	nexweş ketin
rahatsızlaşmak	nexweş ketin
sergin vermek	nexweş ketin
yatak yorgan yatmak	nexweş ketin
dayak atmak	dar kirin
kötek yemek	lêdan xwarin
sofrayı kurmak	sifre danîn
olunmak	pê bûn
dehşet saçmak	saw dan
dehşete kapılmak	saw girtin
ürperiş 1	sawgirtin
ürperiş	sawgirtin
sebeplenmek	jêxwarin
dernek kurmak	komele danîn
kurulanmak	ziwa bûn
suyu kesilmek	ziwa bûn
seli suyu kalmamış	ziwa bûn
kurulanma	ziwabûn
deyimleşme	biwêjîbûn
pençeleşmek	keftûleft kirin
vazolunmak	hatin danîn
dikkatsizlik etmek	bêdîqetî kirin
kondurmak	dan danîn
dilekte bulunmak	dua xwestin
itibar görmek	qîmet dan
kıymet bilmek	qîmet dan
kıymet vermek	qîmet dan
akşamlamak	şîv xwarin
sekte vermek	sekan bûn
zahmet vermek	zehmet dan
zahmete sokmak	zehmet dan
ipin ucunu kaçırmak	serî berdan
kategorik	vebirî
dostluk kurmak	dostanî danîn
dölleme	dolgirtin
dudaksılaşma	lêvîbûn
dümtek tutmak	tempo girtin
tempo tutmak	tempo girtin
paydos vermek	paye dan
methetmek	pesn dan
övme	pesndan
pohpohlama	pesndan
hatır saymak	qedir girtin
aralık vermek	navber dan
aralık bırakmak	navber dan
tavzif etmek	erkdar kirin
tavzif	erkdarkirin
elaman demek	eman kirin
elektriklemek	kareba dan
ersemek	mêr xwestin
gayret vermek	xîret dan
ötelemek	taloq dan
yemek çıkarmak	nan dan
yemek vermek	nan dan
top vermek	nan dan
şölen çekmek	ziyafet dan
eş tutmak	heval girtin
fındık kırmak	tolazî kirin
hovardalık etmek	tolazî kirin
zamparalık etmek	tolazî kirin
alazlanmak	lûr dan
oruç yemek	rojî xwarin
kışkışlamak	kiş kirin
defter tutmak	defter girtin
gazup	hêrbûyî
gece ilerlemek	şev çûn
gedik kapamak	qul girtin
gedikleri tıkamak	qul girtin
yüklem	pêxistî
müsnet	lêbarkirî
yüklenen	lêbarkirî
kız istemek	keç xwestin
gol yemek	gol xwarin
gönlü olmak	jê re hebûn
gözleri kararmak	hişçûn
şuur kaybı	hişçûn
kuluçkalık	kurkketin
güvence istemek	garantî xwestin
teminat vermek	temînat dan
haber alamaz olmak	bêserî çûn
halay tutmak	govend girtin
hap etmek	hem kirin
haraç almak	xerac girtin
haraç yemek	xerac xwarin
haram para yemek	heram xwarin
haram yemek	heram xwarin
hasta düşürmek	nexweş xistin
hastalandırmak	nexweş xistin
hastalanma	nesaxketin
haşarılaşma	şûmîbûn
sesi kısık	dengketî
hesap tut­mak	hesab girtin
hesap vermek	hesab dan
hevesine düşmek	xwezî kirin
infiale kapilmak	hêrs ketin
yemekten kesilmek	jê çûn
höykürmek	hey kirin
parçalara ayırmak	qet kirin
ıralamak	rewişt dan
icazet almak	destûr girtin
izin almak	destûr girtin
tane bağlamak	heb girtin
idealleştirme	îdealkirin
idealleştirmek	îdeal kirin
teşrik	tevîkirin
münasebet kurmak	têkilî danîn
bağlantı yapmak	têkilî danîn
temasa geçmek	têkilî danîn
ilkelleşme	hoveberbûn
yan tutmak	alî girtin
ipoteğe vermek	mişkane dan
iptila olmak	tiryakî bûn
irtisam	sîketin
iz düşümü	sîketin
istizan	destûrxwestin
işaret vermek	hêma dan
işkillenme	şikbirin
provizyonsuz	bêbergîdan
kaçık olmak	pê re hebûn
kafasının bir tahtası noksan olmak	pê re hebûn
kadın boşamak	jin berdan
karı boşama	jinberdan
iktidarda olmak	şiyandar bûn
kalıplamak	qalib kirin
kalpten gitmek	ji dil çûn
kamet etmek	qamet anîn
çırpışma	perwazdan
kanatma	xwînîkirin
sürükleyerek götürmek	kiras kirin
kar düşmek	berf ketin
kar tutmak	berf girtin
leke sürmek	lekedarî kirin
karbonlaşma	karbonîbûn
karbonlaşmak	karbonî bûn
kayda geçirmek	qeydî kirin
sökük dikmek	kel dan
fikrine katılmak	pê re bûn
kefalet vermek	derhûdî dan
kendini yiyip bitirmek	xwe xwarin
yasa gömülmek	xwe xwarin
kepçelemek	kefçe kirin
kılıcı kınına koymak	şûr danîn
kılıcını kınına koymak	şûr danîn
kısa kesme	kurtebirî
nikah kıymak	mehr birin
koç katımı	beranberdan
güz bayramı	beranberdan
koku sinmek	bêhn ketin
koşullanmak	demîn girtin
kör hat	xeta girtî
gedilmek	ko bûn
kösnülmek	telewî bûn
köşe vermek	kuj dan
köşeyi kapmak	goşe girtin
kötüleşme	fenabûn
kulis yapmak	kulîs kirin
kurs almak	kurs girtin
çulu deldirmek	gule xwarin
kurşunî	gewrê girtî
pirelendirme	gumandarkirin
pirelendirmek	gumandar kirin
pimpiriklenmek	gumandar bûn
laf etmek	gotinî kirin
söz söylemek	gotinî kirin
lâubalileşme	bêgiramîbûn
lâubalileşmek	bêgiramî bûn
makineleşme	makîneyîbûn
makineleşmek	makîneyî bûn
mal varlığı	malhebûn
mamelek	malhebûn
resesif	lêçûyî
yasa girmek	şîn girtin
maymunlaşma	meymûnîbûn
menevişlenme	menewîşbûn
menevişlenmek	menewîş bûn
siper tutmak	senger girtin
millenmek	sêlak girtin
sel gibi akmak	zû çûn
mineleme	mînekirin
mineralleştirmek	berbesî kirin
miras yemek	mîrat xwarin
mitleştirmek	efsaneyî kirin
mortlamak	mirar çûn
murdar gitmek	mirar çûn
musap	nexweşketî
muzipleşmek	yarîkerî bûn
mühlet istemek	qewl xwestin
istizan etmek	destûr xwestin
mütenebbih	aqilgirtî
nemalandırmak	werar dan
not vermek	not dan
not atmak	not dan
nötrleme	nêtarîkirin
nötrlemek	nêtarî kirin
nötrleşme	nêtarîbûn
nötrleşmek	nêtarî bûn
oğul çıkarmak	zehî girtin
oğullanmak	zehî dan
oğullanma	zehîdan
olabilirlik vermek	qabil dan
olumsuzlamak	neyînî kirin
ortalama yapmak	navînî kirin
taviz vermek	tawîz dan
örnek vermek	mînak dan
öteye doğru gitmek	werçûn
para getirmek	pere anîn
parti kurmak	partî danîn
pas almak	pas girtin
pas vermek	pas dan
pençe vurmak	pence kirin
perhizli	parêzgirtî
pespaye yapmak	pespayetî kirin
puan almak	puan girtin
puanlamak	puan dan
puanlama	puandan
pusarma	moranîbûn
pusarmak	moranî bûn
puslandırmak	moranî kirin
puslanmak	moran girtin
puslanma	morangirtin
randevulaşmak	randevû dan
rapor tutmak	rapor girtin
rast gitmek	rast çûn
kırkını vermek	çîl dan
çalıyı tepesinden sürmek	nexwestin
renk almak	reng girtin
rimelli	rîmelkirî
rol almak	rol girtin
rüşvet almak	bertîl girtin
gagayı ıslatmak	bertîl girtin
sabunlamak	sabûn kirin
zonklama	fîtikdan
pata çakmak	pate dan
sendikalaşma	sendîkayîbûn
sendikalaşmak	sendîkayî bûn
sendikalaştırma	sendîkayîkirin
sendikalaştırmak	sendîkayî kirin
senet vermek	sened dan
sıfatlaştırma	rengdêrîkirin
sıfatlaştırmak	rengdêrî kirin
sıfırlamak	sifir kirin
sırmalı	sîmkirî
sigortalamak	sîgortadar kirin
silah sıkmak	sîleh berdan
sinirleri ayakta olmak	lihevketî bûn
sömürgeleştirmek	mêtingehî kirin
zaman almak	wext girtin
su kapmak	av girtin
su tutmak	avgirtin
süngüleme	nizekirin
süngülemek	nize kirin
şahadet etmek	guvahî kirin
şakuleme	şaqûlkirin
şekerlenmek	şekir girtin
şekerlenme	şekirgirtin
şekerleşme	şekirîbûn
yıldırım çarpmak	birûsk dan
şuurlaşma	bihişbûn
tabanvay gitmek	peyatî çûn
taçlandırmak	tacdar kirin
taçlanmak	tac wergirtin
taçlanma	tacwergirtin
takılı kalmak	liberxistî
takım tutmak	taxim girtin
talazlanma	biskdan
tanen	tanîn
tebellüğ etmek	teblîx wergirtin
yüzükoyun düşmek	deverû ketin
teşerrüf etmek	şerefyarî bûn
teverrüm	weremîbûn
teverrüm etmek	weremî bûn
tezgahı kurmak	dezgeh danîn
buğulu	hilmgirtî
tiftiklenme	pirtikdan
havlanma	pirtikdan
tiftiklenmek	pirtik dan
tomurcuklanma	bûtikdan
tomurcuklanmak	bûtik dan
tozlanmak	toz girtin
tozlanma	tozgirtin
uğur getirmek	şans anîn
umur görmek	tecrûbedar bûn
umut vermek	hêvî dan
ümit bırakmak	hêvî dan
baş eğme	serîdanîn
nasihatta bulunmak	nesîhet dan
vahamet kesp etmek	dijwartir bûn
güce sarmak	dijwartir bûn
vakıf kurmak	weqf danîn
vakit geçmek	wext çûn
vergilemek	bac danîn
vicdansiz	bêwicdan
vize almak	vîze girtin
yağmur yemek	baran xwarin
yankesicilik	berîkbirî
yarı kapalı	nîvgirtî
yazı getirmek	havîn anîn
yel almak	ba birin
yer almak	tê de bûn
yiyememek	nekarîn xwarin
yoğurtlu	mastkirî
zar tutmak	zar girtin
ters tarafından kalkmak	nelihevbûn
tuhaf olmak	nelihevbûn
ters tarafından kalkmış	nelihevbûn
zeytincilik	zeytûnkirî
zırhlanma	bizirxbûn
avurtlamak	qure bûn
kubarmak	qure bûn
kurumlanma	qurebûn
kurumlanış	qurebûn
izam etmek	pirole kirin
devriklik	wergerandîbûn
direk bağırmak	qarewar kirin
yer kaplamak	cîhgirtin
yerine oturmak	cîhgirtin
yerini kapmak	cîhgirtin
hopurdatma	firkirin
kımlanmak	firoke bûn
kökü kazınmak	qir bûn
kömürleştiriş	komirkirin
müdafaa etmek	berevanî kirin
pullama	perikkirin
gurultu yapmak	qurequr kirin
karar almak	biryar girtin
mukarer	biryarbûyî
pul pul olmak	perik dan
pullanmak	perik dan
pullanma	perikdan
erkek kedi	xone
nisap	nisab
taklit yapmak	hawe kirin
güç bela gelmek	zor hatin
ağır gelmek	zor hatin
sıkıya gelmek	zor hatin
zar gelmek	zar hatin
görücü gitmek	xwezgînî hatin
tefevvuk etmek	serdest hatin
fenersiz yakalanmak	rast hatin
tesadüf etmek	rast hatin
rasgele	rasthatî
konuk gelmek	mêvan hatin
hora geçmek	meqbûl hatin
şevke gelmek	kêf hatin
ağır çekmek	giran hatin
yağmur yağmak	baran hatin
çeşit çeşit	curbicur
türlü türlü	curbicur
abonman	kiryarî
ana sayfa	serrûpel
farenjit	anjîn
eskiden beri	ji mêj ve
evvelden	ji mêj ve
geri türetme	paşvesazî
pis pis gülmek	pixpixîn
sek sek oyunu	zeynik
hiçbir bir şey saklı kalmaz	giya di bin keviran de namîne
ayuka	perê ezmên
baba katili	bavkuj
kurutmalık sebze	godik
üçleme	sêyîne
örs	sindan
harnip	xerûb
az kalsın, neredeyse	dikira
abidevî	abîdewî
yaratı	afirînek
kreasyon	afirînek
hayvan hakları savunucusu	ajalparêz
arabacılık	ajokerî
bayraktar	aldar
tesisatçı	amûrsaz
tezli	angaştdar
dingincilik	aramparêzî
vuzuh	aşîkarî
belginlik	aşîkarî
lokantacı	aşxanevan
lokantacılık	aşxanevanî
mamure	avadan
sakalık	avkêşî
su bilimci	avnas
besteli	awazdar
gümrük memuru	bacdar
kent soyluluk	bajarîtî
burjuvalık	bajarîtî
kentsel	bajariyî
ürbanizm	bajarsazî
enginlik	balûpalî
şehwetperest	baperest
empermeabl	baranparêz
muşamba	baranparêz
yağmur şemsiyesi	baranparêz
nakliyatçılık	barkêşîtî
barutluk	barûdank
baruthane	barûtxane
kara basan oku	baskêş
görenekçi	bastanparêz
gelenekselci	bastanparêz
görenekçilik	bastanparêzî
özeni	bayexî
marketing	bazarkarî
yöntemsizlik	bêazînetî
süreksiz	bêberdewam
çekmecesiz	bêberkêşk
yakalıksız	bêberstûk
tarlasiz	bêbêwan
kültürsüzlük	bêçandî
çerçevesiz	bêçarçove
darasız	bêdara
karamsarlığa düşmek	bedbînî bûn
bedbinleşmek	bedbînî bûn
bedbinleşme	bedbînîbûn
vucütçü	bedenbaz
çekirdeksiz	bêdendik
antremancı	bedenparêz
bedenci	bedenparêz
beden eğitimi	bedenparêzî
çalısız	bêdevî
güzel duyusal	bedewiyî
nöbetleşmek	bedilîn
şekil olarak değişmek	bedilîn
suiistimalci	bedkar
itimatsız	bêewle
cevhersiz	bêgewher
kulaksız	bêguh
kemiksiz	bêhestî
kumasız	bêhewî
ıtriyatçı	bêhnfiroş
alüfte	bêîfet
silisiz	bêîfet
ispenç horozu gibi	bejnkinik
karaktersizlik	bêkarakterî
elektriksiz	bêkareba
çakısız	bêkêrik
kafadan kontak	bêkeys
büzgüsüz	bêkurîşk
plisiz	bêkurîşk
distribütörlük	belavkerî
dağıtıcılık	belavkerî
belediyecilik	belediyevanî
dosyalık	belgedank
gemsiz	bêlixav
mesuliyetsiz	bêmesûliyet
aracısız	bênavgîn
betisiz	bênîgar
zamk ağacı	benîştok
nohutsuz	bênok
topuksuz	bêpanî
ökçesiz	bêpanî
kundaksız	bêpêçek
parmaksız	bêpêçî
takunyasız	bêpêdark
papuçsuz	bêpêlav
pençesiz	bêpence
perdesiz	bêperde
peşinatsız	bêpêşînat
pütürsüz	bêpirtik
vadesiz	bêqewl
şeritsiz	bêqeytan
kalkersiz	bêqusek
leş yiyici	beratexwer
çamaşırhane	beravxane
çamaşırlık	beravxane
mineralleştirici	berbesîker
mineralog	berbesnas
mineral bilimi	berbesnasî
tedricî	berebereyî
kolasız	bêreq
tedvin	berhevkarî
merceksiz	bêrojik
sorumluca	berpirsane
mide fesadına uğramak	berşoşkî bûn
midesi ekşimek	berşoşkî bûn
maskesiz	bêrûyîn
kuyuculuk	bervederî
direngenlik	berxwedêrî
başıbozukluk	bêserîtî
nihayetsiz	bêserûbin
alabildiğine	bêserûbin
vâsi	bêserûbin
değimsiz	bêşayan
çapaksız	bêşilop
takipsiz	bêtaqîb
telsizcilik	bêtêlvanî
kıyafetsizlik	bêtimtêlî
hışırtısız	bêxuşîn
frengili	biagire
damaklı	biarik
tokalı	biavzûng
artist gibi	bibejnûbal
boylu poslu	bibejnûbal
dalyan gibi	bibejnûbal
suna gibi	bibejnûbal
çekmeceli	biberkêşk
lakaplı	bibernavk
yakalıklı	biberstûk
kaküllü	bibisk
çıralı	biçira
çuhalı	biçix
analı	bidayik
demli	bidêm
dövmeli	bideq
ağızlı	bidev
cumburlop	bidimîn
terbiyelilik	biedebî
fanuslu	bifanos
taşıllı	bifosîl
mahmuzlu	bigalûk
yuvalı	bihêlîn
mehtaplı	biheyveron
iadeli	biîade
samanlı	bika
kimyonlu	bikemyon
takke düştü	bikimik
kel göründü	bikimik
takeli	bikimik
takke düştü, kel göründü	bikimik
mufassal	bikitekit
tafsilâtlı	bikitekit
mazeretli	bimazeret
kala	bimîne
gerekçeli	binasî
strüktürel	binyatgerî
topuklu	bipanî
ökçeli	bipanî
takunyalı	bipêdark
kıymıklı	bipîjik
patates ezmesi	biqompîr
patatesli	biqompîr
kalkerli	biqusek
kuşkunlu	biqûş
ladenli	birastik
telgrafçılık	birûskevanî
telgrafhane	birûskexane
başlı	biserik
başaklı	bisimbil
sevinçle	bişahî
zeveban etmek	bişîvîn
cartadak	biteqereq
dulluk	bîtî
vakitli	biwext
çizikli	bixêzik
hırıltılı	bixîzîn
hortumlu	bixortim
haşırtılı	bixuşînî
çürükçül	biy
sürgülü	bizend
güveli	bizûzxwarî
güvelenme	bizûzxwarin
belâgatli	bomikî
belahat	bomikî
ifrit kesilmek	bûn agir
ifrit olmak	bûn agir
toprak olmak	bûn ax
canavarlaşmak	bûn cinawir
çölleşmek	bûn çol
çöle dönmek	bûn çol
söz birliği çıkmak	bûn dengî
ahbap olmak	bûn dost
ustalaşmak	bûn hoste
peştamal kuşanmak	bûn hoste
kafir olmak	bûn kafir
göçebeleşmek	bûn koçer
kuzu gibi olmak	bûn mêşin
kuzu kesilmek	bûn mêşin
mumyalaşmak	bûn mûmî
sarplaşmak	bûn pal
kül olmak	bûn qirik
ilkeleşmek	bûn regez
bitkileşmek	bûn riwek
sebebiyet vermek	bûn sedem
üstüne çıkmak	bûn serî
araba dönmek	bûn şorbe
çorba olmak	bûn şorbe
arap saçı gibi dönmek	bûn şorbe
kerpiçleşmek	bûn tert
pestili çıkmak	bûn texte
hayale dönmek	bûn textik
bir iğne bir iplik kalmak	bûn textik
dilenci değneğine dönmek	bûn textik
boynu armut sapma dönmek	bûn textik
karnı karnına geçmek	bûn textik
tozlaşmak	bûn toz
halka başı olmak	bûn xelek
sahiplenmek	bûn xwedî
gölge olmak	bûn xwedî
tanrılaşmak	bûn yezdan
ıbret olmak	bûn zende
kakılıp kalmak	bûn zende
objektiflik	camidîtî
eltilik	cawîtî
cefakâr	cefakêş
cefalı	cefakêş
cahdetmek	cehdandin
özgül	celebîn
camadan	cemedan
denenmiş	ceribandî
sınanmış	ceribandî
gıcıklık	cirnexweşî
coşturuculuk	coşkerî
tabaat	çapgerî
çaplı	çapgir
çerçevecilik	çarçovekarî
yerden bitme	çartilî
yerden yapma	çartilî
bibliyograf	çavkanîvan
göz bilimi	çavnasî
göz aşinalığı	çavnasî
karnı yememek	çavnebar bûn
gişe	çavok
cumbadak	çelpîn
çengilik	çengîtî
çaprazvari	çeperastkî
solaklık	çepotî
teneşir horozu	çeqelok
amut	çikane
fakirizm	çîlekêşî
acıcılık	çîlekêşî
çilecilik	çîlekêşî
yozlaştırma	çilvirandin
çınlatmak	çingandin
çınlatma	çingandin
dağcılık	çiyagerî
oynak kemiği	çortanok
bölüştürmek	dabeşandin
adliye	dadxane
oyunlaştırmak	dahênandin
münhat	daketî
sarkıntı	daketî
damacı	damabaz
sinir hastası	damargir
önüne koymak	dan berê
yanıtlandırmak	dan bersivandin
cevaplandırmak	dan bersivandin
götürtmek	dan birin
ektirmek	dan çandin
çerçeveletmek	dan çarçovekirin
meydana vurmak	dan der
dışarı vermek	dan der
uçuklamak	dan der
adatmak	dan gazîkirin
sünger çekmek	dan girtin
şüphelendirmek	dan gumankirin
sınatmak	dan hêçandin
ezberletmek	dan jiberkirin
kiraya vermek	dan kirê
ettirmek	dan kirin
keseletmek	dan lûfkirin
okşatmak	dan mistdan
yazdırmak	dan nivîsandin
yadırmak	dan nivîsandin
bileştirmek	dan pêkanîn
ölçtürmek	dan pîvan
kovdurmak	dan qewirandin
döşetmek	dan raxistin
serdirmek	dan raxistin
kolalatmak	dan reqandin
eğirtmek	dan ristin
açtırmak	dan vekirin
aralatmak	dan vekirin
kalıç	dasok
datif	datîf
düğün davetlisi	dawetvanî
fiyetdaxistin	daxîn
geçinim	debarîn
sindirim bilimci	dehannas
sindirim bilimi	dehannasî
entrikacılık	dekbazî
dümencilik	dekbazî
dekoratörlük	dekorsazî
cefakeş	derdkêş
muazzep	derdkêş
çevrebilim	derdornasî
çevrecilik	derdorparêzî
hariciyeci	dervekar
dış işleri	dervekarî
hariciye	dervekarî
iğnecilik	derzîkerî
destansı	destanî
musahiplik	destebirakî
ağız üstü	devdevkî
yüz üstü	devdevkî
gün görmez	dibûrî
direnişçilik	dijraberî
gönül avcısı	dilparsek
ayran gönüllü	dilparsek
ağır kanlı	dilqalind
havaîlik	dilsivikî
gözü sulu	dilşoş
gagamsı	dindikî
diş hekimliği	dirankerî
sancaktar	direfşgir
tulânî	dirêjkî
ufkî	dirêjkî
tarihçilik	dîroknasîtî
ırgatlık	dirûnkerî
dikiş yeri	dirûnxane
divanelik	dîwanetî
dinleti müziği	dîwankî
muayyeniyet	diyarbûnî
olay bilimci	diyardenas
görüngü bilimi	diyardenasî
olay bilimi	diyardenasî
yağdanlık	dondank
abluka	dorpêçî
muhassara	dorpêçî
insiyaki	dozîndar
içgüdüsel	dozîndar
dünkü	duhîn
telemetre	dûrpîv
difterili	duşaxeyî
ikincilik	duyemîtî
it sürüsü kadar	ecêbek
tefçi	elbanevan
tefçilik	elbanevanî
ambarcı	embarvan
ambarcılık	embarvanî
sonuç alıcı	encamgir
dişli tırnaklı	êrîşok
eroinman	eroînkêş
eroinmanlık	eroînkêşî
eroincilik	eroînkêşî
akşamleyin	êvarkî
akşamki	êvarkî
müemmen	ewledar
muzdarip	ezabkêş
ferdiyetçi	ferdparêz
leksikog	ferhengnas
leksikoloji	ferhengnasî
menderes	fetlok
fitçilik	fîtkerî
folklorist	folklorzan
tafracı	fortek
şekvacı	gazinoyî
funda	gêjik
nüfus bilimci	gelhenas
nüfus bilimi	gelhenasî
sivil polis	gerderî
törellik	gerdîşîtî
töreci	gerdîşparêz
adi çiğdem	germok
keresteli	gewdegir
gevelemek	gilgilandin
geveleme	gilgilandin
kuş yemi	gilgilok
kopyacılık	girdarî
büyüteç	girdok
pürüzlülük	girnazî
koca fırtınası	gîskok
berdelacuz	gîskok
yaban havucu	gizêrek
mezarcılık	gorkerî
ağız birliği içinde olmak	gotinkî
memeliler	guhanî
değişkin	guherî
kulakçık	guhik
fütursuzluk	guhnedarî
uyarlık	guncanî
mıhsıçtı	gûxur
kirli çıkı	gûxur
küflü çıkın	gûxur
azar işitmek	hatin azardan
fırçalanmak	hatin azirandin
terhis edilmek	hatin berdan
boş düşmek	hatin berdan
salıverilmek	hatin berdan
derlenmek	hatin berhevkirin
yanıtlandırılmak	hatin bersivandin
cevaplandırılmak	hatin bersivandin
astarlanmak	hatin betankirin
imrenilmek	hatin bijandin
postalanmak	hatin birêkirin
örgütlendirilmek	hatin birêxistinkirin
götürülmek	hatin birin
alçılanmak	hatin caskirin
gençleştirilmek	hatin ciwankirin
çerçevelenemek	hatin çarçovekirin
otlatılmak	hatin çêrandin
ödenmek	hatin dayîn
iğnelenmek	hatin demkirin
tekrarkirin	hatin dubarekirin
afsunlanmak	hatin efsûnkirin
verkauft werden	hatin firotin
fitlenmek	hatin fîtkirin
mahmuzlanmak	hatin galûkkirin
kamulaştırılmak	hatin gelemperîkirin
devletleştirilmek	hatin gelemperîkirin
denilmek	hatin gotin
denmek	hatin gotin
söylenilmek	hatin gotin
sayılmak	hatin hejmartin
kucaklanmak	hatin hembêzkirin
duldalanmak	hatin hêvişandin
soğrulmak	hatin hilçinandin
göçürülmek	hatin hilweşandin
ezberlenmek	hatin jiberkirin
ehlileştirilmek	hatin kedîkirin
ponzalanmak	hatin kefikkirin
kertilmek	hatin kirtkirin
içilmek	hatin kişandin
özetlenmek	hatin kurtekirin
dövdürülmek	hatin kutan
hızlandırılmak	hatin lezandin
emzirilmek	hatin mijandin
okşanmak	hatin mistdan
adlandırılmak	hatin navandin
süngülenmek	hatin nizekirin
savunulmak	hatin parastin
beklenilmek	hatin payîn
kundaklanmak	hatin pêçekkirin
gerçekleştirilmek	hatin pêkanîn
tapışlanmak	hatin pişpişkirin
ölçülmek	hatin pîvan
yasalaştırılmak	hatin qanûnîkirin
kavlanmak	hatin qeşartin
kovalanmak	hatin qewirandin
sepetlenmek	hatin qewirandin
zıhlanmak	hatin qeytankirin
döşenmek	hatin raxistin
kolalanmak	hatin reqandin
canlandırılmak	hatin sêwirandin
dinamitlenmek	hatin şehitandin
ıslatılmak	hatin şilkirin
tükürüklenmek	hatin şilkirin
karıştırılmak	hatin tevlihevkirin
mantara basmak	hatin xapandin
boynuzlanmak	hatin xapandin
kandırılmak	hatin xapandin
kazıklanmak	hatin xapandin
zokayı yutmak	hatin xapandin
çaparıza gelmek	hatin xapandin
mantar yemek	hatin xapandin
sakata gelmek	hatin xapandin
uyduruşa gelmek	hatin xapandin
çalıştırılmak	hatin xebitandin
işletilmek	hatin xebitandin
yaşmaklanmak	hatin xêlîkirin
sahnelenmek	hatin xuyakirin
yapıştırılmak	hatin zeliqandin
eşlenmek	hatin zokirin
sarsakça	hejhejokî
dingildek	hejhejokî
çırpı gibi	hejhejokî
depreştirmek	hejikandin
titreştirmek	hejikandin
depreştirme	hejikandin
titreştirme	hejikandin
titreşme	hejikîn
adetçe	hejmarkî
mebiz	hêkdank
eriyik	helînek
hamamlık	hemamok
kapı yoldaşı	hemkar
anlamdaşlık	hemwatetî
eş anlamlılık	hemwatetî
eş anlam	hemwateyî
hakşinas	heqnas
haktanır	heqnas
borcuna sadık	heqperwer
kaşkariko	heramsî
bölgeci	herêmparêz
hırçınlık	hêrsokî
agresiflik	hêrsokî
hesap uzmanı	hesabdar
çilingir	hesinsaz
çakmakçı	hestefiroş
kemik bilimci	hestînas
osteolog	hestînas
mavi boncuk	hêşînok
ipekçi	hevrîşmfiroş
ipekçilik	hevrîşmfiroşî
meteorolog	hewanas
özenticilik	heweskarî
iniş pisti	hêwirgeh
kalori	hêzdêr
hazcı	hezperest
kuvvetölçer	hêzpîv
prodüktivite	hilberînerî
teyakkuz	hişyarîtî
baysal	hizûrdar
hazakat	hostatî
ustalık	hostayî
primitivizm	hoveberî
ozansılık	hozananetî
sanat uzmanı	hunerzan
işkembecilik	hûrkerî
meleke	hutbûnî
ibadetkâr	îbadetkar
ihlal etmek	ihlal kirin
ikramcı	îkramker
esinlenme	îlhamgirtin
iltimasçılık	iltimaskerî
gözbağcı	îluzyonîst
illüzyonizm	îluzyonîzm
iddiacılık	ingirkerî
muannit	ingirok
ıkıntı	intînî
us dişilik	îrrasyonalîzm
ağlantı	îskîn
hıçkırış	îskîn
hıçkırma	îskîn
istihbaratçılık	îstixbaratvanî
itaatli	îtaetkar
itirafçılık	îtirafkarî
revir	jarxane
kadın düşkünü	jinperest
kadıncıl	jinperest
zendost	jinperest
zihniye	jîrekatî
etkenlik	kartêkerî
pratiklik	karvanîtî
kelce	keçelokî
kızcağız	keçikok
köpürtme	kefandin
köpürtmek	kefandin
köpürtücü	kefdêr
kösele taşı	kefek
keyfi hareket eden	kêfkar
keyfî	kêfkarî
köftehor	keftor
cadaloz	keftor
dikiz	kelijîn
indirgenlik	kêmkerî
orman gibi	kepirî
saçı dağınık	kepirî
eşekçe	kerkî
petrografi	kevirnasî
sahaflık	kevnefiroşî
oportonist	keysperest
kuş başı	kezebkî
lağım	kêzîn
ılgın ağacı	kifêrî
kafatasçı	kiloxperest
kafatasçılık	kiloxperestî
kaşındırmak	kincandin
kaşındırma	kincandin
mucir	kirêdêr
kiralayan, kiralayıcı	kirêdêr
köprücük kemiği	kirik
ahlamak	kirin axîn
cırtlamak	kirin çîzînî
çölleştirmek	kirin çol
yumaklamak	kirin gilok
keleplemek	kirin kelef
kıçım yırtmak	kirin qajeqaj
çıt etmek	kirin qirçîn
üzerine koymak	kirin ser
nadaslamak	kirin şûv
nadas etmek	kirin şûv
horuldamak	kirin xurînî
aşağı almak	kirin xwarê
tanrılaştırmak	kirin yezdan
klüpçü	klûbvan
klüpçülük	klûbvanî
otlak ücreti	koder
otlakiye	koder
mera ücreti	koderî
kokainoman	kokaînkêş
menşeli	kokdar
gerizekalı	korîzan
yasak bölge	kospayî
derince	kûrekî
kıvırcıkça	kurîşkî
tumbadız	kutilkî
öksürtü	kuxînî
kamburumsu	kûzikî
gel gelelim	lê belê
ihtilât etmek	lê dagerîn
sürtünüş	lê ketin
üstüne kalmak	lê man
ayağına yer etmek	lê man
üşüntü etmek	lê piçikîn
başına bir hal gelmek	lê qewimîn
darda kalmak	lê qewimîn
başına hal gelmek	lê qewimîn
yakışık almak	lê şikîn
sulu kar	lêlav
yağmurla karışık kar	lêlav
yağışlı fırtına	lêmişt
sırıtkanlık	lencînî
servis tabağı	lengerî
piyata	lengerî
fonda	lengerî
dayatmacı	lêpêwîstker
çöküşme	lêpiçikîn
rücu	lêqelibîn
uslu durmasını sağlamak	letandin
hızölçer	lezpîv
tanecik	libik
sitemkar	lomekar
tüplük	lûlikdank
lüti	lûtî
yılancık	marok
etyaran	marok
kurlağan	marok
balıkhane	masîxane
riyaziyeci	matematîkzan
matematikçi	matematîkzan
materyalist	materyalîst
özdekçi	materyalîst
ereklilik	mebestdarî
tropika	meder
tropikal	mederî
turşulaşmak	mehikîn
aşınım	mehikîn
mektepli	mektebvanî
menevişli	menewîşî
iddealizm	mengîwerî
canice	mêrkujane
caniyane	mêrkujane
talimgah	meşqgeh
talimhane	meşqxane
evlenmemiş hala	metik
metodolog	metodîst
manav	mêwefiroş
meydancık	meydanok
beleşçi	miftexur
beleşçilik	miftexurî
sömürgen	mijok
sümürgen	mijok
kekresi	mirokî
insan bilimci	mirovnas
çatıklık	mirûzî
hızarcı	mişarkêş
hızarcılık	mişarkêşî
menfa	mişextgeh
miyavlatma	miyawandin
miyavlatmak	miyawandin
sidik yolu	mîzkêş
naz hastası	mizmizokî
siyek	mîzok
möbleli	mobîlyadar
modelcilik	modelsazî
moralizm	moralîzm
mühürcülük	morsazî
müzeci	muzevan
musikişinas	muzîknas
müzik bilimi	muzîknas
sığıntı	nanxur
yanaşmalık	nanxurî
nam almak	navdayî bûn
sıfatlandırmak	navdayî kirin
sıfatlandırma	navdayîkirin
şan şöhret	navdengî
merkeziyetçi	navendparêz
merkeziyetçilik	navendparêzî
enternasyonalci	navneteweyîparêz
şan vermek	navûdeng dan
namzetlik	navzedî
hisseişayia	nearizî
paydaşlı	nearizî
gayrı kabil	nebûyî
olmadık	nebûyî
yıvışıklık	nedawîtî
iflah olmamak	needilîn
rahat durmamamak	nehewîn
rahat durmamak	nehewîn
noksansızlık	nekêmî
kişiliksizlik	nekesî
uymazlık	nelêtî
sorumsuzluk	nemesûlî
milliyetsiz	neneteweperwer
pratik yapmak	nerît kirin
nominatif	netewandî
çekimsiz	netewandî
nakışçılık	nexşkerî
müdavi	nexweşnêr
sayrımsak	nexweşok
nadanca	nezankî
motifli	nîgardar
damlacık	niqutik
bakıncak	nîşangeh
fevrîlik	nişkavîtî
grafolog	nivîszan
öğlende	nîvrokî
öğleyin	nîvrokî
okşayış	niwaztin
çekirdeksel	nukleerî
işletmenlik	operatorî
otomatizm	otomatîzm
öz devinim	otomatîzm
otomobilci	otomobîlfiroş
zemin kat	pageh
papağanlık	papaxanî
gerileyiş	paşketinî
art ses	paşkî
ağdak	patotî
paytoncu	paytonvan
öksürük otu	pêcanik
uzun parmaklı	pêçîdirêj
şah iken şahbaz olmak	pêdar
sezilmek	pejinîn
desteksiz atmak	pekandin
yüksekten atmak	pekandin
laf çatlatmak	pekandin
muayenehane	pelînxane
paçacı	pepikfiroş
paçacılık	pepikfiroşî
dizgeli	pergaldar
heyecanlanmak	peroşîn
heyecanlanış	peroşîn
heyecanlanma	peroşîn
pervaneci	perwanedar
pedegojik	perwerdekariyî
beğence	pesnname
piyazcı	pesnoyî
projeksiyon	pêşanî
yaban mersini	pêşik
ilerici	pêşvexwaz
ilericilik	pêşvexwazî
petrol taşımacılığı	petrolkêşî
galatıhis	pêxapîn
uydusal	peykî
bağıtlı	peymandanî
ahdî	peymanî
sözcük yapımı	peyvsazî
bilir kişilik	pêzanî
ejektör	pijiqînok
iletki	pilepîv
minkale	pilepîv
tenekecilik	pîlewerî
yamacılık	pînekerî
köprücü	pirsaz
yumurta zarı	pîstik
zanaatkâr	pîşekar
pişekar	pîşekar
terviç	piştvanî
dırlanma	pitîn
mızmızca	pitpitokî
pantolon pijamalarin bel ve paça kısmının lastikli oluşu	pizî
planlayıcı	planger
planlayıcılık	plangerî
planörcü	planorajo
nazım planı	plansazî
gaffar	poşandox
ağız yapmak	pûkandin
tazallüm etmek	pûkandin
fiskelemek	pûkandin
mızıldanmak	pûkandin
itinalı	pûtedar
yasamalı	qanûndanînî
oylumlu	qebaredar
tamlanan	qedandî
belirtilen	qedandî
ehlidil	qelender
rint	qelender
kalender	qelender
iyilik sever	qencîxwaz
esprili	qerfok
sırıtma	qîçandin
sırıtmak	qîçandin
sırıtık	qîçoyî
sırıtkan	qîçoyî
gıdıklayış	qidqidîn
taksirli	qisûrdar
rahne	qulêr
pekmez toprağı	qusek
marn	qusek
ayaklandırma	raperandin
ayaklandırmak	raperandin
gerçekdışı	rastederî
gerçekdışılık	rastederî
rayiç	rayîş
rayîç fiyatı	rayîş
recmetme	recmandin
recmetmek	recmandin
çitmek	refandin
ıslahatçı	reformxwaz
ıslahatçılık	reformxwazî
kökçük	rehik
kök sap	rehik
renkser	rengî
renkölçer	rengpîv
kolorimetre	rengpîv
özgünlük	resenatî
siyahlık	reşayî
statükoculuk	rewşparêzî
eleştirmecilik	rexnekerî
eleştirel	rexneyî
eleştirmeli	rexneyî
tenkitli	rexneyî
bağ budamak	rez birin
kaideci	rêzikparêz
dizgicilik	rêzkeritî
cirit atma	rimbazî
mızrakçılık	rimkarî
lakrimal	rindikî
iplik iplik	rîşik
botanikçi	riweknas
oryentalist	rojhilatnas
oryental	rojhilatnasî
şarkiyatçılık	rojhilatzanî
röportajcılık	roportajkerî
ince sırık	rotik
sayfa düzenleyicisi	rûpelsaz
sayfa düzenleme	rûpelsazî
cavlaklık	rûtbûnî
iliştir	safok
dehşete düşürmek	sawandin
üç adım atlama	sêbazî
yağlı ip	sêdar
zağarlık	segîtî
durallık	sekanî
gökçe	semawî
semahane	semaxane
trio	sêmend
üçlü	sêmend
senaryoculuk	senaryonivîsî
sendikacı	sendîkavan
işkembe suratlı	serçavxurî
çiçek bozuğu	serçavxurî
üste dizmek	serkî
başvekâlet	serokwezîrî
dam üstü	serxanî
ruf	serxanî
başı eğiklik	serxwarî
üçüncülük	sêyemtî
sıhhi	sihî
silahhane	sîlehxane
pala bıyıklı	simbêlboqî
sırmakeş	sîmkêş
törelcilik	sincîtî
sınıflı	sinifdar
sofist	sofîst
havalename	spartename
istifade etme	sûdmendî
suikastçı	suîqestker
yapaylık	sûnîtî
şarıldama	sûrîn
şarlamak	sûrîn
yoğrum	sûrîn
ısviçreli	swîsreyî
gönderme belgesi	şandîname
değimli	şayandar
şekerlik	şekirdank
soygunculuk	şêlînkerî
badanacılık	şêlkerî
şamarlamak	şelpandin
çakıltı	şeqînî
çaçaronluk	şeqlevanî
çaçeronluk	şeqlevanî
yabani yulaf	şerabok
utanıç	şermayî
utandırıcı	şermîker
meşrut	şertdar
grafiker	şêwekar
şekilperest	şêweperest
danışma bürosu	şêwirgeh
oleometre	şilepîv
sıvıölçer	şilepîv
yağışölçer	şilîpîv
yas tutma	şîngerî
şıkırtı	şingînî
ateş közü	şotik
eskrimci	şûrbaz
kılıç oyuncusu	şûrbaz
kılıç üstadı	şûrbaz
eskrim	şûrbazî
kılıç oyunu	şûrbazî
okaliptüs	tadar
erteleyici	taloqder
onarımcılık	tamîrkerî
tavhane	tavxane
kriminilog	tawannas
kriminiloji	tawannasî
tavizci	tawîzdêr
tavizcilik	tawîzdêrî
ricat	têborîn
celep	têcir
celeplik	têcirî
divlek	tehlik
kantaran otu	tehlik
müşküle	tehlik
divlet	tehlik
teizm	teîzm
katkıda bulunan	têkar
mükemeliyetçi	tekûzîxwaz
tellâklık	telaqtî
temaşager	temaşeger
temaşakâr	temaşeger
temaşahane	temaşexane
darca	tengane
tepir	têpûr
behemehal	teqezî
terakkiperver	teraqîperwer
cımbar	terhik
çöğür	terhik
öğrenim belgesi	tesdîqname
tasdikname	tesdîqname
düzeltmenlik	teshîhkerî
tashihçilik	teshîhkerî
teslimiyetçilik	teslîmbûnî
hamur teknesi	testik
acente	ticaretxane
tecim evi	ticaretxane
ticarethane	ticaretxane
sadak	tîrdank
yoğunluk ölçer	tîrpîv
ekşilik	tirşayî
iptila	tiryakîtî
tiryakilik	tiryakîtî
atletik	tîtalî
sulu zırtak	tîzek
osuruğu cinli	tîzek
pirinci çok su kaldırmamak	tîzek
pirinci su kaldırmamak	tîzek
tövbekar	tobekar
altın topu	topikî
top top	topikî
dehşetlenmek	toqîn
dehşete düşmek	toqîn
işsiz güçsüz	tortorî
sinir bilimci	tûrenas
asabiyeci	tûrenas
sinirbilimi	tûrenasî
vandalizm	vandaltî
vandallık	vandaltî
mola verdirmek	vêsandin
istirahat ettirmek	vêsandin
dinlendirici	vêsdar
kaytarıcı	vizok
zürriyetsizlik	warkorî
müvesvis	waswasok
anlambilim	watenasî
edebiyatcı	wêjenas
fotoğraf evi	wênexane
kaplamlı	wergirîdar
muttasıf	wesfdar
tartış	wezinandin
ehlisalip	xaçparêz
hıristiyan	xaçparêz
pedolog	xaknas
toprak bilimci	xaknas
hancılık	xandarî
bayancık	xanimok
hanımcık	xanimok
tülbentçi	xavikfiroş
çalışma yeri	xebatxane
baş örtücü	xêlîvan
duvakçı	xêlîvan
düşkünlerevi	xêratxane
hayır evi	xêratxane
imarethane	xêratxane
cep harçlığı	xercane
altın oluk	xercî
kaşarlanmış	xercî
daksil	xijok
gıgı	xilfik
sakak	xilfik
marangozhane	xiratxane
gayri vazıh	xîretdar
gayur	xîretdar
horultu	xişînî
kaba tüylü fig	xiştik
fingirdek	xiştik
kaba tüylü	xiştik
hindiba bitkisi	xizêmok
müstahdem	xizmetdar
hırdavatçı	xurdefiroş
nalburluk	xurdefiroşî
hırdavatçılık	xurdefiroşî
fışırtı	xuşînî
çağıldayış	xuşînî
fışıltı	xuşînî
haşırtı	xuşînî
kendine hakim olmak	xwe girtin
yükünü tutmak	xwe girtin
gelinlik etmek	xwe girtin
allahsızlık	xwedênenasî
öz saygı	xwegiramî
otodidakt	xwehêvotî
öz yaşam	xwejîn
öz denetim	xwekontrol
kendini bilmez	xwenezan
kendini koruyan	xweparêz
kendini birine dayamak	xwespartin
güzel koku	xweşbêhn
izzeti ikram	xweşdarî
natıkalı	xweşpeyv
hodpesendlik	xwexwazî
anızlık	xwezan
hanende	xwînende
hematolog	xwînnas
kan bilimci	xwînnas
hunriz	xwînrij
kan dökücü	xwînrij
serin kanlılık	xwînsarî
soğuk kanlılık	xwînsarî
tez canlılık	xwînsivikî
kan kırmızı	xwînsor
hemoglobin	xwînsorî
iticilik	xwîntehlî
vahdaniyet	yekatî
eşitçilik	yeksanîxwazî
müsavatçılık	yeksanîxwazî
paskalya	zadik
bilgece	zanakî
karpuzcu	zebeşfiroş
karpuzculuk	zebeşfiroşî
harfi	zêder
takyit etmek	zêfandin
sedimantasyon	zelîn
yapışkanlık	zeliqoktî
sarartı	zerayî
nohudî	zerokî
dil bilimcilik	zimanzantî
inildeme	zimînî
dirim kurgu	zîndewerî
dirim kurgusal	zîndewerî
dirim bilim	zîndewerzanî
zangırdatma	zingandin
zangırdatmak	zingandin
zıngırdatmak	zingandin
çıngırdatmak	zingandin
çıngırtı	zingînî
zıngırtı	zingînî
ödkesesi	ziravik
gümüş işlemeli	zîvkarî
yaylacılık	zozanvanî
detaylandırmak	zûlandin
tımarhanelik	aqilavêtî
hidrofil	avhez
müezzinlik	bangbêjî
yük hayvanı	barbir
mesuliyetsizlik	bêberpirsîtî
tapasız	bêdevgirk
pay sahibi	behrewer
eğimsiz	bêmeyane
kolsuz	bêmil
döl vermek	ber girtin
meyve vermek	ber girtin
tok tutmak	ber girtin
ürün tutmak	ber girtin
kar helvası	berfemotk
yankesici	berîkbir
güneç	beroşk
hayvan hastanesi	beytarxane
boralı	bibager
güvenle	biewletî
güvenli bir şekilde	biewletî
ölçülülük	bihendazetî
sakınganlık	bihendazetî
keseli	bikîs
kondüktör	bilêtnêr
kondüktörlük	bilêtnêrî
kurnaz politikacı	bilhvan
deri altı	binçerm
alt deri	binçerm
diz altı	binjinû
fotoğraf altı	binwêne
paratoner	birqgir
yıldırımlık	birqgir
yıldırımkıran	birqgir
yıldırımsavar	birqgir
budalaca	bûdelewarî
cadıca	cazûkî
prodüktörlük	çêkiroxî
peşine takılmak	dan dû
zaman bilimi	demnasî
zaman dizini	demnasî
acı dindirici	êşbir
budun bilimsel	etnolojîk
etnolojik	etnolojîk
süt tulumu	eyarşîrk
yola gelmek	hatin rê
yola yatmak	hatin rê
kara çiçek	hebreşk
kara yanık	hebreşk
nemcil	hêmîhez
hakikatbin	heqîqetbîn
bakışımlı	hevnêrî
mütenazır	hevnêrî
mastitis	hewîş
hazcılık	hezperestî
şairane	hozanwarî
hünerli	hunerwer
hüner	hunerwerî
mikroskobik	hûrdebînî
atlı karınca	hespik
keçilik	ingirîtî
higroskopik	kambînî
ilerisi	karekî
biçkici	kincbir
öznellik	kirdewarî
yol yapmak	kirin rê
başına geçirmek	kirin sere
kulağına koymak	kirin sere
üstüne katmak	kirin sere
zaman bilimsel	kronolojîk
kronolojik	kronolojîk
kesik kelime	kurtebêj
neyse ne	lê jin
hamarat	libak
uğunmak	lobîn
lumbargo	mazmazk
nikah memuru	mehrbir
mestane	mestkî
teslim bayrağı çekmek	mil danîn
teslim bayrağını çekmek	mil danîn
inkiyat	mildanîn
morfolojik	morfolojîk
füze atıcısı	moşekavêj
füzeatar	moşekavêj
otobiyografik	otobiyografîk
ard ek	paşdanî
fıkracılık	pêkenîbêjî
fırlatıcı	pekînok
aft	pembûk
penaltıcı	penaltîavêj
hamleci	pêngavavêj
petrol taşımacısı	petrolkêş
koyun kırkıcısı	pezbir
koyun kırkısı	pezbir
maddi yardım	pîgarî
zanaatkar	pîşewer
kıraathaneci	qehwexanevan
sac kavurması	qelîsêlk
fide	qesîlk
oyum	qewar
alt taraf	rajêr
aşağısı	rajêr
irs	rakend
konglomera	raweşîn
yol gitmek	rê çûn
yol kat etmek	rê çûn
caddeyi tutmak	rê girtin
yolları tutmak	rê girtin
yol tutmak	rê girtin
pırıldak	ronavêj
projektör	ronavêj
far	ronavêj
senfonik	senfonîk
foseptik	sexur
stilistik	stîlîstîk
pankreas	şîlavk
kabahatı birine yüklemek	tiştekî
açan	vekirox
edebiyat dostu	wêjehez
enayice	xêvkî
rabbanî	xudanî
süt dişi	xwarik
sürfile	xwarik
iman sahibi	xweyîman
köleli	xweykole
umur görmüş	xweytecrûbe
safsatacı	yawebêj
sarı asma	zerdek
uzlaşmazlık	lihevnekirî
silisizlik	bêîfetbûn
yamalı bohça	hevnegirtî
birbirini tutmaz	hevnegirtî
çelişiklik	hevnegirtî
suya düşmek	çênebûn
sürünceme	biderengîxistin
titreklik	lerzokî
suçulluğu	herîsorik
agnostik	agnostîk
yankı bilimi	akustîk
alkalölçer	alkalmetre
töre dışıcılık	amoralîzm
canlıcılık	anîmîzm
aklını yitirmek	aqil avêtin
usu gitmek	aqil avêtin
delirme	aqilavêtin
aksilik çıkmak	astengek derketin
ah çekmek	ax kişandin
boy almak	bal avêtin
mütenavip	bedelî
almaşık	bedelî
muztar kalmak	bêgav man
behavyorizm	behavyorîzm
madalyasız	bênîşane
mecalsiz düşmek	bêpertav man
pata olmak	beraber man
havada kalmak	beredayî man
kar temizlemek	berf avêtin
tabiiyetsiz	bêtabiiyet
boş durmamak	betal neman
küçümseyiş	biçûkdîtin
işitsel	bihîzyarî
madalyalı	binîşane
pistonlu	bipiştvanek
nota	bîranî
telgraf çekmek	birûske kişandin
yirmişer	bîstebîst
cesaretlendirme	bizavdarkirin
bolşeviklik	bolşevîkî
bomba patlatmak	bombe teqandin
bumbar	bûmbar
kişilik kazanmak	bûn xweykesayetî
sandık düzmek	cihêz çêkirin
cılk çıkmak	cilq derketin
cinlenme	cinoyîbûn
cirit atmak	cirîd avêtin
cirit at­mak	cirîd avêtin
gıcıklık yapmak	cirnexweşî kirin
aybaşısı tutmak	cirnexweşî kirin
curacı	curajen
litografyacı	çapber
taş baskı	çapberî
yolunu bulmak	çare dîtin
çare bulmak	çare dîtin
prodüksiyon	çêkiroxtî
kırklık	çilanî
daltonizm	daltonîzm
yazdırma	danenivîs
ağaç dikme	dar çandin
fonograf	dengnivîs
dermatoloji	dermatolojî
ipsi	deziyokî
slayt	diapozîtîf
öğretim bilgisi	dîdaktîk
marazlık etmek	dijwarî derxistin
gün görmüşlük	dinyadîtîbûn
diş sökmek	diran avêtin
tasarımcı	dîzayner
dizayncı	dîzayner
dogmacı	dogmatîst
inakçı	dogmatîst
dogmacılık	dogmatîzm
dogmatizm	dogmatîzm
ekzotermik	ekzotermîk
ısıalan	endotermîk
endotermik	endotermîk
araççılık	enstrumantalîzm
böcek bilimi	entomolojî
böcek bilimci	entomolojîst
ıstırap çekmek	êş kişandin
keder çekmek	êş kişandin
acı duymak	êş kişandin
muazzep olmak	ezab kişandin
fizyolog	fizyolojîst
fizyolojist	fizyolojîst
görevcilik	fonksiyonalîzm
görevselcilik	fonksiyonalîzm
ışığa göçüm	fototaktîzm
gelecekbilim	futurolojî
gazölçümü	gazpîvî
ayıltı	gêjiktî
gebeşlik	gêjoktî
çapaçulluk	gemaroktî
ağlayıcı	giriyok
şifalı ot	giyaderman
goşist	goşîst
laf taşımak	gotin kişandin
laf almak	gotin kişandin
güfteci	gotinnivîs
söz yazarı	gotinnivîs
grizumetre	grîzumetre
gülle atma	guleavêtin
dalsı	guliyokî
münasip görmek	guncan dîtin
tırmalanmak	hatin nepkirin
fısıldanmak	hatin pispisandin
fıslanmak	hatin pispisandin
hâdise çıkarmak	hedîse derxistin
elips	hêkanî
beyzi	hêkanî
söbe	hêkanî
şif	helf
muhallebi	helîlik
nefes nefese solumak	helkîn
dert ortağı	hemderd
hemdert	hemderd
gönüldaş	hemdil
benzeşlik	hemdirûvî
müşabehet	hemdirûvî
eş sıcak	hemgerm
kader birliği	hemqeder
sırdaş	hemraz
hemhal	hemrewş
akranlık	hemsalî
eş biçim	hemteşe
izomorf	hemteşe
aforozlu	heramoyîkirî
harbi konuşmak	herbî axaftin
kesedar	hesabgêr
rikkatli	hestyar
senkroni	hevedemîtî
ittifaktı	hevîtifaq
ittifaklı	hevîtifaq
öldürme	hevkuştin
aynı renkten olan	hevreng
yenişme	hevtêkbirin
sarmaşma	hevwerandin
istilzam etmek	hewce dîtin
gerekli görmek	hewce dîtin
iltizam	hewce dîtin
şafak atmak	heyirî man
hidroloji	hîdrolojî
asım	hilawisan
tiriti çıkmak	hilhilîn
ak sakaldan yok sakala gelmek	hilhilîn
örseleniş	hilhilîn
örselenme	hilhilîn
pul pul dükülmek	hilhilîn
azımsama	hindikdîtin
hafifseme	hindikdîtin
hafifseyiş	hindikdîtin
yeğniseme	hindikdîtin
hindolog	hindzan
histoloji	hîstolojî
doku bilimi	hîstolojî
bellek yitimi	hiş avêtin
bilincini yitirmek	hiş avêtin
kafası bozulmak	hiş avêtin
dadandırma	hûtîkirin
identik	îdentîk
gözbağcılık	îlizyonîzm
ipotetik	îpotetîk
eş biçimlilik	îzomorfîzm
izomorfizm	îzomorfîzm
geri basmak	jê derketin
sorgu sual	jêpirsîn
mayna	jêqerîn
ayrılmazlık	jevcudanebûn
ödeşme	jihevsafîbûn
cimnastik	jîmnastîk
jinekoloji	jînekolojî
çanak yalayıcı	kaselîst
tabak yalayıcısı	kaselîst
az görmek	kêm dîtin
azımsamak	kêm dîtin
az bulmak	kêm dîtin
yeğnisemek	kêm dîtin
kemancı	kemanjen
kemanî	kemanjen
taş atmak	kevir avêtin
meydan bulamamak	keys nedîtin
şırlamak	kirin çireçir
ıklamak	kirin intînî
cızlamak	kirin qajînî
çatır çatır etmek	kirin qirçeqirç
tıpırdatmak	kirin tepînî
makara çekmek	kirin wîçînî
hışlamak	kirin xuşînî
zangır zangır etmek	kirin zingezing
gırnatacı	klarnetjen
klarnetçi	klarnetjen
kolonicilik	kolonyalîzm
sentagma	komeksazî
sözleşme yapmak	kontrat çêkirin
konsantre olmak	lêhûrbûn
dayatmacılık	lêpêwîstkerî
enez	ler
ürpertili	lerziyokî
inzimam	lêzêdebûn
mıknatısi	manyetîk
metamorfizm	metamorfîzm
var oluş	mewcûdiyet
şap gibi donmak	mit man
doğuştancılık	natuvîzm
naçar kalmak	neçar man
iki eli bağrında kalmak	neçar man
değişimsiz	neguher
gayri kanuni	neqanûnbar
çekememek	nikarîn kişandin
katibe	nivîsyar
kalem efendisi	nivîsyar
nonfigüratif	nonfîguratîf
orgcu	orgjen
oh çekmek	ox kişandin
asalak bilimi	parazitolojî
savunman	parêzyar
ayak basmak	pê avêtin
teşebbüse geçmek	pêngav avêtin
adım atmak	pêngav avêtin
atılım yapmak	pêngav avêtin
heyecan verici	peroşîner
heyecanlandırıcı	peroşîner
kurguculuk	pevbestînerî
montajcılık	pevbestînerî
öğürlük	pevhînî
gülüşme	pevkenîn
girişimci	peyaner
anlaşma yapmak	peyman çêkirin
üfürükçü	pifînok
üfürücü	pifînok
fokurdama	pilepilkirin
gölermek	pingar dan
çok seslilik	pirdengî
çok hücreli	pirhucreyî
çok ortaklı	pirpişkdarî
nevruz çiçeği	pirpizêk
takibat	pirsyarî
isticvap	pirsyarî
istintak	pirsyarî
soruşturma açmak	pirsyarî çêkirin
çok anlamlı	pirwateyî
kur’a çekmek	pişk kişandin
kura çekmek	pişkkişandin
piston	piştvanek
piyanist	piyanojen
çok tanrıcı	politeîst
politeist	politeîst
politeizm	politeîzm
olasıcılık	probabîlîzm
akıl doktoru	psîkiyatrîst
psikiyatr	psîkiyatrîst
teşri	qanûnçêkirin
esnekçe	qayişokî
kayış gibi	qayişokî
kıraçlaşma	qeraşîbûn
kriz ge­çirmek	qeyran dîtin
kovucuk	qulêrik
radyografi	radyonivîs
uyrukluluk	rajêrtî
irsi	rakendî
kalıtımsal	rakendî
kalıtsal	rakendî
çın tutmak	rastî gotin
rasyonalist	rasyonalîst
ussallaştırma	rasyonalîzasyon
rasyonalizm	rasyonalîzm
oya koymak	ray avêtin
oylamaya geçmek	ray avêtin
kıl gibi	rehikî
renk ölçme	rengpîvî
sakal tıraş etmek	rî çêkirin
mercekli	rojikdar
rölativist	rolativîst
ışık ölçümü	ronîpîvî
sağlam yapmak	saxlem çêkirin
tümlemek	sehî kirin
anlam bilimsel	semantîk
ziyarette bulunmak	serdanî kirin
sarfiyat	serfiyet
omuz köprüsü	sergirk
temerrüt	serîkişandin
insanüstü	sermirovî
başyazman	sernivîsyar
baş makale	sernivîsyar
başkatip	sernivîsyar
götün götün	serqûnkî
kıç üstü	serqûnkî
serserice	serserkî
tepesi üstü	serserkî
kibernetik	sîbernetîk
sibernetik	sîbernetîk
sırmakeşhane	sîmkêşxane
sitoloji	sîtolojî
hücre bilimi	sîtolojî
dalıcı	sobeber
sofistlik	sofîstî
minnettar kalmak	spasdar man
spontaneizm	spontaneîzm
duruk	statîk
ırlamak	stran gotin
küylemek	stran gotin
dikensi	striyokî
doğa üstücülük	sumaturalîzm
doğa üstücü	surnaturalîst
sürnatüralizm	surnaturalîzm
tabiatüstücülük	surnaturalîzm
sürrealist	surrealîst
gerçek üstücü	surrealîst
tiyatro yazarı	şanonivîs
uygarca	şarmendane
şaşırıp kalmak	şaş man
şerefyap	şerefyar
şerefyap olmak	şerefyar bûn
şeriatçılık	şerîetxwazî
şifa bulma	şîfa dîtin
tüllenmek	şil avêtin
güneş açmak	tav derketin
bulaştırma	têgerandin
ıstılah	têgîrî
girimlik	têketname
metin yazarı	tekstnivîs
mihnet çekmek	tengasî kişandin
daracıkça	tengokî
düttürü	tengokî
ıssız kalmak	tenha man
ıskontolu	tenzîlatkkirî
mayın döşeme	tepînk çandin
çıngar çıkarmak	teşqele çêkirin
hır çıkarmak	teşqele çêkirin
katmer kaldırmak	teşqele çêkirin
dikilip durmak	tîk sekinîn
tınlama	tingînîkirin
türkçülük	tirkperestî
otomatik silah	tomatîk
rektum	tortorîk
transformizm	transformîzm
türap	tubar
tur atlamak	tûr avêtin
bevliye	urolojî
üroloji	urolojî
yayvansı	vêlikî
yayvanlık	vêlikîtî
sıçırgan	vîrikî
viyolonselist	viyolonselîst
volontarizm	volontarîzm
hakanlık	xakanî
çizgi çizmek	xêz kişandin
çizgi çekmek	xêz kişandin
hamhalat	xirpanî
hışırlık	xişexiştî
eğrice	xwarokî
kaçınma	xwevedan
kan kusmak	xwîn avêtin
ittihat etmek	yekîtî çêkirin
emek çekmek	zehmet dîtin
şomluk	bêyomî
nadasa bırakılan arazi	xozan
telepati	telepatî
uza duyum	telepatî
hacer	hacer
asimilasyonculuk	asîmîlasyonkerî
altimetre	bilindayîpîv
barograf	bilindayîpîv
yükseklikölçer	bilindayîpîv
boru çalmak	borîjenî kirin
serinlik olmak	bûn hênkayî
işkence çekmek	cizaret kişandin
çelimsizce	çeqelokî
sıskaca	çeqelokî
tasdik ettirmek	dan pesendkirin
odunsu	darokî
zevzekçe	gevezokî
karayel hastalığı	guhanokî
taşlanmak	hatin hêsankirin
gönendirilmek	hatin kamîrankirin
keselenmek	hatin lûfikkirin
gevretilmek	hatin pişkirin
aydınlatılmak	hatin ronîkirin
indirgenmek	hatin sanayîkirin
giderilmek	hatin tunekirin
geri çekilme	jêkişîn
kadınsılık	jinokî
kıyaslamalı	kemperî
yöntem bilimsel	metodolojîk
antrepoit	mirovokî
azizlik etmek	mizawirî kirin
kadife gibi	nermokî
hacimlice	qebaredarokî
deli kızın çeyizi gibi	qeşmerokî
gevrekçe	qurfokî
solgunluk	rengavêtîbûnî
örgütçü	rêxistinkar
teşkilâtçı	rêxistinkar
örgütçülük	rêxistinkarî
teşkilâtçılık	rêxistinkarî
durukluk	statîkî
indikatör	şanîdêr
saçı	şoşmanî
güneş çarpığı	tavokî
hezeyan etmek	tewşikî kirin
saçmalama	tewşikîkirin
ötürmek	vîrikî bûn
karnı sürmek	vîrikî bûn
hayır sahibi	xwedanxêr
ototrof	xwexweyker
öz beslenen	xwexweyker
zayif nahif	zeîfokî
yer tabaka	niham
ayağına bağ olmak	dan girêdan
ağız tamburası çalmak	dan girêdan
kıydırmak	dan hûrkirin
bozdurtmak	dan hûrkirin
bütünletmek	dan temamkirin
tamamlatmak	dan temamkirin
görecelik	dîmanatî
uzatılmak	hatin dirêjkirin
bozdurulmak	hatin hûrkirin
dilinmek	hatin hûrkirin
adı duyulmak	hatin naskirin
bindirilmek	hatin siwarkirin
bütünlenmek	hatin temamkirin
bahçıvan	baxçevan
doğancı	bazvan
yağmurlu	bibaran
etek dolusu	bibaran
aşağısamak	biçûk dîtin
kulak kulağa	bidizî
sanatlı	bihuner
öz güvenli	bixwebawer
tekeffül etmek	bûn kefîl
dramatik	dramatîk
benbencilik	ezotî
akıl erdiren	hişbir
vazifeden düşmek	jê ketin
pim	kartik
az tanınan	kêmnas
cayırtıyı basmak	kirin qîjeqîj
koli	kolî
pereseye almak	lê fikirîn
aklına getirmek	lê fikirîn
mimber	mînber
minber	mînber
tanımlanabilir	nasbar
tanımlanabilen	nasbar
adını söyleme	nav gotin
tadilat	nûvekirin
müdafaaname	parêzname
babacılık	paternalîzm
önizleme	pêş dîtin
sanayici	pîşesaz
üst taraf	rajor
yukarısı	rajor
doğruyu gören	rastbîn
liderlik etmek	rê birin
yol vurmak	rê birin
rafakatçı	refaqetvan
sağ kalmak	sax man
illiyet	sedemîtî
nedensellik	sedemîtî
başarısız kalmak	serfiraznebûyî
mumlama	şimakirin
gerçeklemek	teyîd kirin
düş görmek	xewn dîtin
rüya görmek	xewn dîtin
çizer	xêzkar
otarşi	xwebesî
arktik	arktîk
arktika	arktîk
kuzey kutbu	arktîk
kirasız	bêkirê
cevap veren	bersivdêr
cevaplayıcı	bersivdêr
kürekçi	bêrvan
hırsız gibi	bidizîka
gizliden gizliye	bidizîka
uğrun uğrun	bidizîka
yarından tezi yok	bilezûbez
bir an önce	bilezûbez
yel esmek	bilezûbez
yellim yelalim	bilezûbez
bütün bütüne	bitevayî
heyetiyle	bitevayî
mel mel	bixemgînî
bobaatar	bombeavêj
bombacı	bombevan
baba olmak	bûn bav
üye olmak	bûn endam
kuşhane	çûkxane
farmakoloji	dermannasî
tezgahtar	dezgehdar
duman çıkarmak	dû kirin
köylülük	gundîtî
afa uğramak	hatin bexşandin
havacılık	hewavanî
ikrahlık	keraxîtî
urgancı	kindirvan
cumhuriyetçilik	komarparêzî
ırkiyat	nijadnasî
ontolojist	ontolojîst
otelci	otêlvan
buruşukça	qermîçokî
düşünücü	ramanvan
tefrişat	raxistinkarî
remilci	remldar
yavrucak	sebîk
reverans	serkûpî
temenna	serkûpî
velvele çıkarmak	şemate derxistin
süthane	şîrxane
taksici	taksîvan
tozluca	tozikî
kapağı atmak	xwe avêtin
kendini atmak	xwe avêtin
plonjon	xwe avêtin
ağıtçı	zêmarbêj
sağucu	zêmarbêj
bir araba	dinyayek
üçayak	trîpot
tripot	trîpot
tekayak	yekpêk
belenme	hesikîn
bulanma	hesikîn
antroposantrizm	antroposantrîzm
imar etmek	avadan kirin
suflörlük etmek	bedkarî kirin
mütereddi	bêeslîbûyî
pervasızca	bêfikarane
yan basmak	bêhawetî kirin
iş karıştırmak	berhevdanî kirin
katletme	bilêçkirin
tokurdama	bilqebilqkirin
minder altı etmek	bindoşek kirin
örtbas etmek	bindoşek kirin
üstüne perde çekmek	bindoşek kirin
ileri gitmek	bipêşveçûn
hamisi olmak	bipiştvanek bûn
takınma	bixwevekirin
cesaretlenme	bizavdarbûn
şabanlaşmak	bomikî bûn
cinlenmek	cinoyî bûn
geleni	cirdok
kabalık etmek	çortî kirin
bücürleşmek	çûçanî bûn
bücürleşme	çûçanîbûn
aykırılaşmak	dijraber bûn
yüreği titremek	dilşoş bûn
efsunlanmak	efsûnî bûn
efsunlanma	efsûnîbûn
saldırmazlık	êrişnekirin
kekelemek	fafikî kirin
kekeleme	fafikîkirin
kekeleyiş	fafikîkirin
şafiî köpeğine dönmek	gemarokî bûn
zevzeklik etmek	gevezokî kirin
diken diken olmak	gijgijî bûn
bürümcek	gilokik
çıtlatılmak	hatin qirçandin
maskelenmek	hatin rûpoşkirin
okuldaş	hemdibistanî
aforoz olmak	heramoyî bûn
oyunbozanlık etmek	heramsî kirin
yüzleşme	hevrûbûn
ayılık etmek	hirçîtî kirin
keçilik etmek	ingirî kirin
neşet	jêçêbûn
keramette bulunmak	keramet kirin
moruklaşmak	kokimî bûn
moruklaşma	kokimîbûn
gruplaşmak	komkomî bûn
gruplaşma	komkomîbûn
şebeklik yapmak	kûçikî kirin
büzgülemek	kurîşkî kirin
büzgüleme	kurîşkîkirin
boş atıp dolu tutmak	lêlê kirin
titrekleşmek	lerzekî bûn
titrekleşme	lerzekîbûn
bir şeye binmek	lêsiwarbûn
mühmel	nexweyîkirî
tabakalanmak	niham girtin
okşanma	pêşabûn
fener çekmek	pêşîkêşî kirin
ön ayak olmak	pêşîkêşî kirin
antlaşma	pevgirêdan
ilişki kurma	pevgirêdan
kolektifleştirmek	pevrayî kirin
endüstrileşme	pîşesaziyîbûn
kamburu çıkmak	piştkovî bûn
kat'îleşme	qetîbûn
var sayımlı	rawêjdar
eziyet görmek	rencûr bûn
tebdilikıyafet	rûpoşî
başmubassır	serekçavnêr
reislik yapmak	serîtî kirin
sathileştirmek	serkî kirin
sathileştirme	serkîkirin
kürt üzümü	sincêrî
şeneltme	şênayîkirin
katkıda bulunma	têkar bûn
esirgememek	texsîrnekirin
dertop olmak	topikî bûn
harap etmek	wêranî kirin
nitel	wesfînî
kaynanalık etmek	xesîtî kirin
çiziktirmek	xêzik kirin
çiziktirme	xêzikkirin
hurdalık	xurdegeh
çağildama	xuşînîkirin
silahsızlanma	xwebêçekkirin
şirinlik yapmak	xweşekî kirin
yakutça	yaqûtkî
ablukaya alma	abloqekirin
çürüyebilen	alozbar
ölçüştürmek	dan berhev
maliyeci	darayîvan
defterdarlık	defterdarî
keratinleşme	didanok
boynuzlaşma	didanok
dünya görmüş	dinyadîtî
görmüş geçirmiş	dinyadîtî
üstüne uğramak	êrîşî
fiyonk	govek
ağırsama	guhnedan
aldırmamak	guhnedan
baskı yapma	hemetkirin
baskı uygulama	hemetkirin
mastitis izleri	hilbirîn
üretiş	hilbirîn
edebiyat çevirisi	jîwer
taşlaştırmak	kevirandin
direkten dönmek	lê nebûn
adlandırılmış	navkirî
yılmazlık	nebezî
duyulmadık	nebihîstî
duyulmamış	nebihîstî
işitilmedik	nebihîstî
işitilmemiş	nebihîstî
fosil	paşmayî
perdelik	perdeyî
gelincik çiçeği	pitpitk
doğru bulmak	rast dîtin
edep yeri kılları	rûvik
adi hünnap	sêncî
sürtüştürmek	sorikandin
küçük kene	tembûrk
tavuk kenesi	tembûrk
tipik	tîpik
tophane	topxane
beter olmak	xirabtir bûn
beter etmek	xirabtir kirin
savulmak	xwe vedan
kaçırtmak	dan revandin
raslamak	leqayî bûn
yüksekten düşmek	têwer bûn
sulamacı	avdêr
banker	bankdar
bankacılık	bankgêrî
benzinci	benzîngeh
benzinlik	benzîngeh
yanıtlanmak	bersivîn
yanıtlanma	bersivîn
dert çekmek	derd kişandin
fırçacı	firçevan
lapa lapa	gulgulîn
taşak fıtığı	gunoyî
vurdurma	hingivandin
pireyi gözünden çakalı dizinden vurmak	hingivandin
kaburga dolması	kalek
derin görüşlü	kûrebîn
pinek	lûsik
hazır yiyici	malxur
avlak	nêçîrgeh
peşin ödenen para	pêşînî
hav	pûrtik
gırtlaksı	qirikî
sofracı	sifrevan
şemsiye çiçeği	sîwanok
şahın yardımcısı	şahyar
çekim yapmak	verêstin
viyak	waqînî
yenilir	xwarbar
hoş endamlı	xweşendam
yeşil kertenkele	marmaroka kesk
ele alınır	baş e
ne ala	baş e
elhak	a rast
neme lazım	a rast
açıkçası	a rast
doğru doğru dosdoğru	a rast
hakçası	a rast
öylece	a wilo
dillendirme	anîn ziman
dünyaya getirmek	anîn dinyayê
ihdas	anîn holê
ihdas etmek	anîn holê
yola getirmek	anîn rê
vücuda getirmek	anîn wicûdê
vücut vermek	anîn wicûdê
glokom	ava reş
kara su	ava reş
tatlı su	ava şîrîn
dışarıya atmak	avêtin der
karlamak	berf barîn
karlama	berfdahatin
mandalsız	bêristik
bürgülü	biçarik
taşkınca	biaşirî
alenen	biaşkerahî
açıkça	biaşkerahî
lüpten	bibelaşî
bedavadan	bibelaşî
hurda fiyatına	bibelaşî
muvakkaten	bidemdemî
şifaen	bidevkî
şifai	bidevkî
sözlü olarak	bidevkî
pekçe	bidilxwazî
upuzun	bidirêjayî
münavebeli	bidor
hamaratça	biêginî
tehditkârca	bigefxurî
kollektif	bihevbeşî
kibarlıkla	bikibarî
hâsılı	bikurtasî
hulâsaten	bikurtasî
uzun lâfın kısası	bikurtasî
uzun sözün kısası	bikurtasî
sözün kısası	bikurtasî
özetle	bikurtayî
yok pahasına	bimirîtî
taksit taksit	bipardanî
taksitle	bipardanî
kat'î olarak	biqetî
çığlık çığlığa	biqîreqîr
avaz avaz	biqîreqîr
sofuca	bisofîkî
aklı	bispî
tamamı tamamına	bitevahî
kestirmece	bitexmînî
kesinlilik	bivebirî
çiğ olarak	bixavî
çiğ çiğ	bixavî
bile bile lades	bizanetî
bolca	bizêdeyî
fazlaca	bizêdeyî
ajurlu	biçavî
böcü	biho
yürütülebilir	bikarbar
icrası mümkün	bikarbar
kıtıklı	bipirtik
kesmikli	bitert
adet olmak	bûn gerdîş
ayda yılda bir	car caran
pat sat	car caran
arada sırada	car caran
ilk defa	cara yekem
ceza yazmak	ceza birîn
cinli	cinoyî
cürümlü	cirmdar
karakaçan	çarsim axa
göz açmak	çav vekirin
kem göz sahibi	çavînok
uzun süreli olmayan	çendemî
çarkçılık	çerxkerî
gurup etmek	çûn ava
gidici	çûndox
yüksek mahkeme	dadgeha bilind
dile vermek	dan gotin
fırınlatmak	dan xercandin
yazıya dökmek	daraştin
ses çıkarmak	deng derxistin
alçak ses	dengê nizm
sokağa çıkmak	derketin derve
dışarı çıkmak	derketin derve
müderislik	dersdarî
meydana çıkarmak	derxistin meydanê
hergelelik	dewartî
yüreği çarpmak	dil pirpitîn
fettanlaşmak	dilxapînok bûn
gözdişi	diranê qîl
idrar borusu	dirba mîzê
idrar kanalı	dirba mîzê
görümcelik	dişîtî
maruz kalmak	dûçar man
enine boyu­na	dûvdirêj
karbonado	elmasa reş
numaracılık	fenekî
cep sözlüğü	ferhenga berîkê
kıyım yapmak	ferman rakirin
kerrat	gelek caran
müteaddit	gelek caran
çoğu kez	gelek caran
çok kere	gelek caran
buluşturmak	gihandin hev
kocaman kocaman	gir gir
ağır aksak	giran giran
fıstıkî makam	giran giran
köşeleme	goşekî
tadil	guhêranî
gelinfeneri	gula derewîn
gelin fenerî	gula derewîn
avutulmak	hatin aşkirin
saptırılmak	hatin berevajîkirin
sızdırılmak	hatin dapalandin
ipe gelmek	hatin dardekirin
çözümlenmek	hatin daûrandin
ele gelmek	hatin dest
kutsanmak	hatin evrandin
hizaya gelmek	hatin hîzayê
kısaltılmak	hatin kinkirin
maktul düşmek	hatin kuştin
öldürülmek	hatin kuştin
çatışılmak	hatin lihevxistin
karılmak	hatin lihevxistin
kutlanmak	hatin pîrozbayîkirin
burgulanmak	hatin qulkirin
kalafatlanmak	hatin tamîrkirin
takdir olunmak	hatin têgihiştin
saz perdesi	hawî
çizgi resim	hêlkarî
en iyisi	herî baş
en iyi	herî baş
bilemedin	herî zêde
itişip kakışmak	hev gijgijandin
iş gücü	hêza kar
işgücü	hêza kar
kınalama	hinekirin
hepiniz	hûn hemû
kıyım kıyım	hûr hûr
küçük küçük	hûr hûr
incecikten	hûr hûr
hakkında konuşmak	jê axaftin
hakkında konuşulmak	jê axaftin
şikayet getirmek	jê gazinîn
şikayette bulunmak	jê gazinîn
hakketmek	jê kolandin
kesinti yapmak	jê kuştin
ifadeye çekmek	jê pirsîn
parmak yalamak	jê xwarin
posasını çıkarmak	jê xwarin
sebeblenmek	jê xwarin
kanırma	jêkişandin
dışarıdan	ji derve
haricen	ji derve
amiyane	ji rêzê
oralı	ji wê
şuralı	ji wê
buralı	ji wê
kamyoncu	kamyonvan
kehribar	karbar
kaynaşmış	kelijî
ağyar	kesên din
pusuya düşmek	ketin kemînê
tuzağa düşmek	ketin kemînê
mandepsiye basmak	ketin kemînê
izine düşmek	ketin şopê
kaim olmak	ketin şûnê
uyunmak	ketin xewê
uykuya yatmak	ketin xewê
ponza	kevirê kefik
sünger taşı	kevirê kefik
balya yapmak	kirin balî
alçıya almak	kirin cebarê
kapana düşürmek	kirin dafikê
çan çalmak	kirin dengî
şaşaa yapmak	kirin dengî
yürürlüğe konmak	kirin meriyetê
araya koymak	kirin navê
araya birini koymak	kirin navê
işkillendirmek	kirin şikê
kitapçık	kitêbok
kısıkça	korîkî
oturulmak	lê rûniştin
alt dudak	lêva jêrîn
uzlaşmacılık	levayîxwazî
gözünde	li bal
maiyetinde	li cem
dışarıda	li derve
dun	li jêr
aşağıda	li jêr
tıkırında	li kar
ortalığı karıştırmak	li meydanê
muvacehesinde	li pêşberî
peşi sıra	li pey
görünürlerde	li rastê
meydanda	li rastê
hazırda	li rastê
şurada	li wir
ora	li wir
orada	li wir
taharri	ligerîn
telif hakkı	mafê telîfê
yemişlik	mêwedank
manavlık	mêwefiroşî
görülmez	nedîtbar
görünmeyen	nedîtbar
gayrimeşru	nedadmend
gayri müsavi	nehevta
butlan	netêw
cesaret edememek	newêrîn
desinatör	nexşkêş
soğuk düşmek	nexweş çêbûn
yarı gece	nîvê şevê
beklettîrmek	pandin
ilintili	pê pêwendîdar
fikir danışmak	pê şêwirîn
akıl almak	pê şêwirîn
danışılmak	pê şêwirîn
meşveret etmek	pê şêwirîn
kanıkmak	pê xapîn
afiş yutmak	pê xapîn
yaprak dökmek	pel weşandin
düz tabanlık	pêpanî
besbedeva	pir erzan
bedavadan ucuz	pir erzan
sudan ucuz	pir erzan
iri iri	pir gir
az çok	pir hindik
anha minha	pir hindik
abanoz gibi	pir hişk
eçhel	pir nezan
elifi görse mertek sanır	pir nezan
tüm cahil	pir nezan
elifi görse mertek sanmak	pir nezan
zifirî	pir tarî
tasvir gibi	pir xweşik
aydan arı sudan duru	pir xweşik
agucuk	pitikê berşîr
agu bebek	pitikê berşîr
dırıltı	pitînî
pişmanlık	poşmanî
nedamet	poşmanî
halat çekme	qayişkêşî
olmazsa	qe nebe
almazlık etmek	qebûl nekirin
iyilik bilmek	qedir zanîn
ana düşünce	ramana sereke
laytmotif	ramana sereke
ana fikir	ramana sereke
ana sav	ramana sereke
mütefikkir	ramangêr
gerçekli	rastandî
sır tutmak	raz veşartin
kuzguni	reşê qetran
marazlık	rewşa zor
hindistan safranı	riha zer
abazanlık	rijîtî
nebati yağ	rûnê riwekan
sayfa düzenleyici	rûpel saz
taktiksel	sazdanî
kara çalma	serhevdî
köftün	serpêt
sırt üstü	serpiştkî
arka üstü	serpiştkî
garantilenmek	sewgirîn
keskin ses	sewta tûj
silecek	surîner
şakuli	şaqûlî
zıypak	şemetok
şerbetsiz	şerbetnexwarî
kahpeleşme	şermûtîbûn
altılı	şeşane
yanıksı	şewatokî
süt tozu	şîrê toz
üzerine yoğunlaştırmak	tê fikirandin
ölçünmek	tê fikirîn
çemkirmek	tê hilanîn
çıkış yapmak	tê hilanîn
teberrük	teberik
telekomünikasyon	telekomunakasyon
perende atmak	teqle avêtin
ziyadesiyle	têra xwe
doyasıya	têra xwe
eni konu	têra xwe
sık sık	timik
sabır et	tirûş bike
sabret	tirûş bike
tratörcü	traktorvan
hiçbiri	tu kes
kimsecik	tu kes
kimsecikler	tu kes
hiç kimse	tu kes
uçuşturmak	ûdjen
mesel olmak	wek nimûne
küçük hanım	xanima malê
kara haber	xebera sar
düğün değil, bayram değil, eniştem beni niye öptü?	xêr e
saat başı galiba	xêr e
yabancı saymak	xerîb dîtin
uyku tutmamak	xew nekirin
uzun çizgi	xêzek
sıhriyet	xizmtî
yemek yedirmek	xwarin dan
lezzetli yemek	xwarina xweş
hodbehod	xwe bixwe
kırıtmak	xwe loqandin
sağını solunu bilmemek	xwe nezanîn
tevekkül etmek	xwe spartin
kaynağını almak	xwe spartin
teslim olma	xwe spartin
birine sığınma	xwe spartin
banyo yapmak	xwe şûştin
yunmak	xwe şûştin
açılıp saçılmak	xwe vekirin
açılım	xwe vekirin
ihtisas sahibi	xwedî pisporî
çocuk sahibi	xwedîzarok
irap	xweş axivîn
hodpesend	xwexwaz
benlikçi	xwexwaz
kan çıkmak	xwîn rijîn
başka biri	yekî din
tekdüzelik	yeknesakî
dublajcılık	zarvekerî
sözlendiricilik	zarvekerî
zemberek	zembûrek
yılışkanlık	zivêrkerî
dönüşlülük	zivirandîbûn
temin etme	peydandin
aslında	a rastî
ateş kesmek	agir bestin
rüzgar çıkmak	ba rabûn
tahammül etmemek	baristanî nekirin
palamut meşesi	dara mazî
yutulmuş	daûrayî
ses çıkarmamak	deng nekirin
sesini kesmek	deng nekirin
kalem oynatmak	dest gerandin
dolap çevirmek	dolab gerandin
işi alaya almak	giringî nedan
vurdum duymamazlıktan gelmek	guh nedan
aldırış etmemek	guh nedan
es geçmek	guh nedan
kulak vermemek	guh nedan
oralı olmamak	guh nedan
siklememek	guh nedan
şakası yok	guh nedan
vurdum duymazlıktan gelmek	guh nedan
ihtilât vermemek	guman nekirin
gezdirilmek	hatin gerandin
gezilmek	hatin gerandin
göz yaşı dökmek	hêstir rijandin
kuyruk kemiği	hestiyê boçikê
diz kemiği	hestiyê kabokê
durduk yerde	hewce nekirin
cumburlop etmek	hilhilandin
ekskavatör	hilkolîner
kazaratar	hilkolîner
sondalamacı	hilkolîner
tazim etmek	hurmet nîşandan
aynısından yapılmak	jê çêbûn
ehvan	jê çêtir
fazladan	jê zêde
lüzmundan fazla	jê zêde
mukabelede bulunmak	lê vegerandin
karşılık olarak	li hemberî
mukabilinde	li hemberî
kitap kurdu	miriyê kitêban
halter	parsenghildan
larva	pirg
çeşitkenar	pirgoşe
pır pır	pirpir
hücuma kalkmak	radan ser
gürşe tutulmak	rakirin hev
cih dan	rêz nîşandan
dayanamamak	sebir nekirin
başmakale	serbend
düğüncübaşı	serdawet
su yolu	sereb
başeksper	serekpispor
satır başı	sererêz
muti	serfirû
başgarson	sergarson
köşe başı	sergoşe
kafasını kaldırıp bakmak	serî hildan
başkişi	serleheng
başpiskopos	sermetran
bel üstü	sernewq
antet	sernivîsar
başyazı	sernivîsar
kelle paça	serpê
köprü başı	serpir
güzlek	serrewa
müsebbip	sersedem
kolağası	sertîp
andırışma	sewabpêketin
andırma	sewabpêketin
iltibas	sewabpêketin
kür	tedawiya taybet
sözünü esirgememek	tekepeke nekirin
sıkça	timikî
tozumak k	toz rakirin
toz koparmak	toz rakirin
tozumak	toz rakirin
tekrar bağlamak	vebestin
aktarmacılık	veguhêzbarî
geride bırakmak	vehiştin
geri bırakmak	vehiştin
terk etme	vehiştin
geride bırakma	vehiştin
soruşturulmak	vepirsîn
tamlanan eki	veqetandek
ayırıcı	veqetîner
ayıran	veqetîner
farik	veqetîner
salıntı	vetewş
basma kalıp	vetûrî
duraksatmak	vewestandin
geriliş	vezelayî
elastik	vezen
velveleye vermek	welwele rakirin
örtüsünü atmak	xêlî dakirin
ter dökme	xwêdan rijandin
şöhret sahibi	xwedî nav
imza sahibi	xwedî nav
kan dökmek	xwîn rijandin
kan akıtmak	xwîn rijandin
acayip kalmak	metal man
aç kalmak	birçî man
açık vermek	kêmanî derketin
açıkta kalmak	li rastê man
kabak ortada kalma	li rastê man
ortada kalmak	li rastê man
kabak gibi ortada kalma	li rastê man
aldı yürüdü	lê zêde bûn
adımlarını seyrekleştirmek	nerm çûn
adlandırılmamış	nebinavkirî
ağaçlaşma	darokîbûn
söz birliği	yekgotin
akıl verme	aqildanî
aynısından yapmak	jê çêkirin
kıldırmak	pê dan kirin
alışkanlık kazanmak	banekî bûn
anket yapmak	anket çêkirin
anlaşmazlık çıkmak	dubendî derketin
hesap açmak	hesab vekirin
aptes bozmak	avek rêtin
aralarına kara kedi girmek	ji hev çûn
aralarından kara kedi geçmek	ji hev çûn
arayı soğutmak	ji hev çûn
bozuşmak	ji hev çûn
ters düşmek	ji hev çûn
kara kedi geçmek	ji hev çûn
aralık etmek	piçek vekirin
ardından gelmek	li pey hatin
arkada kalmak	li paş man
yaya kalmak	li paş man
tetiklemek	tevgerandin
aşağılanmak	kêm hatin xistin
atla arpayı dövüştürmek	berevdanî kirin
attırmak	dan avêtin
teehhür	derengman
ayağını sürümek	manî kirin
çıkacak	li ber rabûn
kafa tutmak	li ber rabûn
ibik kaldırmak	li ber rabûn
ayraç açmak	kevan vekirin
bağ bozmak	rez hilanîn
bakımsızlık	xwedînekirin
basıp gitmek	lê xistin çûn
ayakları omuzuna vurmak	lê xistin çûn
boynunu kırmak	lê xistin çûn
çekip gitmek	lê xistin çûn
başı yastığa düşmek	serî danîn
ölüp göçmek	serî danîn
peşinde koşmak	li pey bûn
üstün bulmak	jê çêtir dîtin
hareket ettirme	tevgerîn
hareket eme	tevgerîn
söz atmak	dev avêtin
tariz etmek	dev avêtin
belgelendirmek	belgedar kirin
bilmece gibi konuşmak	sergirtî axaftin
borç almak	deyn standin
boşandırmak	ji hev berdan
bulutlanmak	ewrîbûn
can atarak gelmek	serserkî hatin
ceza görmek	ceza dîtin
cılklaşma	cilqîbûn
cılklaşmak	cilqî bûn
yemek yapmak	xwarin çêkirin
çalım atmak	fîz avêtin
çarçur olmak	berba bûn
çarşaflatmak	rû dan girtin
çatıklaşmak	mirûzî bûn
çekmemek	nekişandin
çelişki çıkarmak	nakokî derxistin
çelişkili olmak	nakok bûn
çıkagelmek	lê derketin
hat çekmek	xet kişandin
dahilen	bivexwarî
dava açmak	doz vekirin
değişiklik yapmak	guhêrîn çêkirin
delilenme	dînikîkirin
demir almak	lenger kişandin
fonda etmek	lenger avêtin
deneyleme	ezmûnçêkirin
dırıltı çıkarmak	pitînî kirin
diftonglaşma	pevdengîbûn
diftonglaşmak	pevdengî bûn
kurdurtmak	pê dan danîn
bülbül gibi konuşturmak	pê dan gotin
dedirmek	pê dan gotin
divan kurmak	civat gerandin
meclis kurmak	civat gerandin
icmal etmek	bikurtasî gotin
doğruluğun ortaya çıkması	rasteder bûn
dolandırıcılık yapmak	delkbazî kirin
dövdürtmek	pê dan lêxistin
dul kalmak	bî man
bekâr kalmak	bî man
katakulli çevirmek	dek gerandin
edeplenmek	pûşildar bûn
efsaneleştirme	efsanewîkirin
efsaneleştirmek	efsanewî kirin
eksik çıkmak	kêm derketin
elde tutulan	rogirtî
hakim olunan	rogirtî
elinden geleni ardına komamak	texsîr nekirin
enezeleşme	lerbûn
enezeleşmek	ler bûn
esrar çekmek	esrar kişandin
nefes çekmek	esrar kişandin
cura çekmek	esrar kişandin
eşdeğer kılmak	hevcot kirin
felaketzede	bobelatdîtî
fırtına kopmak	firtûne rabûn
buharlaştırma	dûkêlkirin
yawn	bawîşk hatin
gayri kabili tahammül	nayê kişandin
gayri mütecanis	lihevneketî
geçit vermemek	re nedan
yolunda olmak	li kar bûn
gevşek davranmak	sistayî kirin
gevşeklik yapmak	sistayî kirin
gol atmak	gol avêtin
yüz görümlüğü	rûvekirin
gövdelenme	bigewdebûn
göze ilişmek	çav pêketin
gözü alışmak	çavnasî bûn
gözü yaşarmak	hêstir kirin
hacı ağalık etmek	riyalîtî kirin
haç çıkarmak	xaç derxistin
hakikatsiz çıkmak	bêwefa derketin
hakir görmek	hor dîtin
haklı bulmak	mafdar dîtin
harman çevirmek	bender gerandin
havalanmak	hewadarbûn
hayâsızlık etmek	bêheyatî kirin
üzerinde durmak	li ser sekinîn
horlanmak	kêm hatin dîtin
küçümsenmek	kêm hatin dîtin
zelil olmak	kêm hatin dîtin
huzura getirmek	pêşber kirin
hüküm kurmak	daraz danîn
ıraklaşmak	jê dûr bûn
ibra olmak	rûspî bûn
içirtmek	pê dan vexwarin
içtirmek	dan vexwarin
iğne yutmuş maymuna dönmek	çeqelokî bûn
tazıya	çeqelokî bûn
köpeklemek	çeqelokî bûn
tazıya dönmek	çeqelokî bûn
yardakçılık etmek	altaxî kirin
ihtisas yapmak	pisporî kirin
ilgi görmek	eleqe dîtin
infial uyandırmak	hêrs rakirin
infirat	jê dûr man
ipe çekmek	ben avêtin
iplik çekmek	ta kişandin
ipliklenmek	takêşî bûn
islenme	bitenîbûn
istetmek	pê dan xwestin
istida vermek	daxwazname dan
iş işlemek	nexş çêkirin
nakış işlemek	nexş çêkirin
işi olmak kare	li rê bûn
işi iş olmak	li rê bûn
izinli olmak	destûrdayî bûn
temyiz etmek	jê cuda kirin
kadeh kaldırmak	badîn rakirin
kahpeleşmek	şermûtî bûn
kalenderleşme	qelenderbûn
kamp kurmak	wargeh vedan
kanatlanma	bibaskbûn
kantarın topunu kaçırmak	fehşik bûn
kaparo vermek	bêh dan
kar dinmek	berf vekirin
karalara bürünmek	reş dakirin
karanlık basmak	tarî ketin
katarlamak	dûvdirêj kirin
kavalyelik etmek	şekerokî kirin
savaş çıkarmak	şer derxistin
kıç üstü oturmak	serqûnkî ketin
kılâde	gerdanî
kılıç çekmek	şûr kişandin
kılıcı kınından çıkarmak	şûr kişandin
kınalı	hinekirî
kışlamak	zivistan hatin
helezonlaşmak	badekî bûn
kızak ayağı kaş kaydırmak	taxok berdan
kızamık çıkarmak	sorik derxistin
kızamıkçık çıkarmak	mîrkutok derxistin
kin kapmak	kîn hilanîn
kinlenmek	kîn hilanîn
kireçsizleştirme	bêkirêckirin
kof çıkmak	qelp derketin
konserve yapmak	konserve çêkirin
giydirilmek	lê hatin kirin
konusundan uzmanlaşmak	hunerwer bûn
laf olmak	jê hatin axaftin
söz götürmek	jê hatin axaftin
koparıp atmak	jê kirin avêtin
kopup gelmek	lê xistin hatin
kopya çekmek	kopî kişandin
kurs görmek	kurs dîtin
kurşun yağdırmak	gule barandin
kuyruk olmak	dûvdirêjbûn
laf çıkarmak	gotin derxistin
loğusa hummasına tutulmak	distanî bûn
mal oluşu	malbûn
mazeret bulmak	mazeret dîtin
mızrak atmak	rim avêtin
kemlik etmek	xirabî kirin
ağzına almamak	hez nekirin
mortoyu çekmek	mirin çûn
mubah görmek	mubah dîtin
müştak	jêzêdebûyî
müzevirlik etmek	gilîgerînî kirin
tat kazanmak	bitam bûn
nekahet döneminde olmak	pizdan avêtin
nesnelleşme	objektîfbûn
nesnelleşmek	objektîfbûn
niyet çekmek	niyet kişandin
ölüp ölüp dirilmek	ne mirî bûn
önden gelmek	pêş hatin
önerge vermek	pêşniyazname dan
önünden kaçmak	ji ber rabûn
örneksemek	wek nimûne dîtin
paket yapmak	bestek çêkirin
para çıkarmak	pere derxistin
para dökmek	pere rijandin
para kesmek	pere çêkirin
parmak atmak	gelemşe çêkirin
parti çevirmek	partî çêkirin
pazarlamak	bazarkarî kirin
pazarlık yapmak	bazarî kirin
inci işlemeli	mirarîkirî
pekmez kaynatmak	dims çêkirin
peltek konuşmak	til peyivîn
perdelerini açmak	perde vekirin
perdeyi kaldırmak	perde hilanîn
pıyrım pıyrım olmak	gincirî bûn
piyango çekmek	piyango kişandin
proje yapmak	proje çêkirin
pusatlandırmak	posatdar kirin
rötarlı	derengmayî
rulman	rûlman
sadık kalmak	sadiq man
saf hale gelmek	net bûn
sakit kalmak	bêdeng man
savaş açmak	şer vekirin
savaş çıkmak	şer rabûn
sayfa düzenlemek	rûpel saz kirin
seçim yapmak	hilbijartin çêkirin
sefalet çekmek	feqîrî kişandin
sepet yapmak	sepet çêkirin
sergi açmak	pêşangeh vekirin
sersem etmek	gêjoyî kirin
serserilik etmek	serseritî kirin
sığdırmak	tê de hilanîn
sırtını çevirmek	pişt badan
sirkelenme	bisirkebûn
sorumlu tutmak	berpirs dîtin
sözü açmak	gotin gotin anîn
sporlanmak	sporî bûn
su içmek	av vexwarin
suyu çekmek	av hilanîn
sütlendirme	bişîrkirin
şapka çıkarmak	şewqe derxistin
şeş beş görmek	lê ecêbmayî bûn
şeşi beş görmek	lê ecêbmayî bûn
şikayet edilen	gilîkirî
tadı gitmek	bêtehm bûn
taharri etmek	ligerîn kirin
tahlif	sond dan xwarin
ant verdirmek	sond dan xwarin
yemin verdirmek	sond dan xwarin
takadüm	berê hatin
taksit ödemek	pardanî dan
taksitlendirme	pardanîkirin
taksitlendirmek	pardanî kirin
tarla sürmek	zevî rakirin
tatlı dilli olmak	xweşekî bûn
tatsızlık etmek	bêtehmî kirin
tazminat almak	ziyanî girtin
tedvin etmek	berhevkarî kirin
teftiş etme	dager kirin
tepirleme	têpûrkirin
tepirlemek	têpûr kirin
tepsermek	nedawî bûn
terbiyesini bozmak	bêterbiyetî kirin
ters gelmek	paşpêkî hatin
ters gitmek	paşpêkî çûn
tersine yürümek	paşpêkî çûn
ters yüz etmek	bervajî kirin
yönü değiştirmek	bervajî kirin
tesmiye çekmek	tizbî kişandin
tespih çekmek	tizbî kişandin
tezahüratta bulunmak	awaz vedan
tuhaflık etmek	qerfokî kirin
uçlama	biserikbûn
ufuk görünmek	aso hilhatin
ütülmek	jê hatin birin
uyarlanmak	lê hatin anîn
üstüne dökelmek	pê de bûn
vicdani	wicdanî
volta atmak	volta avêtin
yağdırılmak	hatin barandin
yağlanma	donekîbûn
yakınlık görmek	xatir dîtin
yangın çıkarmak	agir derxistin
yanına kâr kalmak	jê re man
yara açmak	kirin birin
yaya gelmek	peyatî hatin
yenilir yutulur gibi değil	nehatin xwarin
yiyip içmek	xwarin vexwarin
yol yürümek	li rê çûn
şeytanın bacağını kırmak	li rê çûn
taban tepmek	li rê çûn
yolda kalmak	li rê man
yolu düşmek	dor hatin
yoluna girmek	xwedê çêkirin
yufka açmak	hevîr vekirin
zam gelmek	fiyet rabûn
zanaatkârlık yapmak	pîşewerî kirin
zar atmak	zar avêtin
zırıltı çıkarmak	xirecir çêkirin
zihin açmak	zîn vekirin
zorluk çekmek	zehmetî kişandin
malül	karketî
oruç açma zamanı	rojî vekirin
alçak bir yere düşmek	wer bûn
kıtır kıtır doğranmak	parçe parçe bûn
kıtlığıa kıran girmek	xela rabûn
çukurlaşmak	kort bûn
camcılık	camkarî
sigortacılık	sîgortakarî
zebunküşlük	tadekarî
mürt	cihimî
direnme	berhilistin
معاناة	jankêşan
karşıt duygu	antîpatî
diş otu	dirankolik
kürdan otu	dirankolik
kürdan	dirankolik
öküz arabası	gerdûm
az kalsın	wextî
kadı yoran	intok
arap damarlı	intok
mülâhazat	milaheze
lekesiz	bêleke
göreneksiz	bênerît
güzel boylu	bejnxweş
kitap gibi	bejnxweş
idam olmak	berdarbûn
antetsiz	bêsernivîsar
talkin	telqîn
kös kös	biserpêlî
toyca	bitorî
yirmilik	bîstanî
çiftelenmek	cotkanî avêtin
çiğnenmiş	cûtî
kem gözlü	çavbaz
keskin gözlü	çavbaz
geçerlik	çûnbarî
çözümsel	dahûrînî
fonolog	dengnas
ses bilimci	dengnas
müdara etmek	devxweşî kirin
kokulu sarı taş yoncası	dilqok
basiretli olmak	dûrdîtin
tutturgaç	girtok
güzel sözlü	gotinxweş
değişimli	guhêrkbar
belgelenmek	hatin belgedarkirin
bilinmek	hatin zanîn
ilk yardım	hawarî
saymaca	hejmartinî
ülküdaş	hemmengî
ümit edilmemiş	hêvînekirî
beklenilmeyen	hêvînekirî
kameri	heyvî
hurdahaş etmek	hûrxweş kirin
yosun tutmuş	kevzîn
dırlanmak	kirin pitînî
vakvak etmek	kirin waqînî
kürkçü	kurkfiroş
keçi kılı	mirk
devre dışı bırakmak	neçalak kirin
gülünmek	pê kenîn
açıklanması	perderakirin
enfes	pir xweş
şiir gibi	pir xweş
pür	pûrik
kıraçlaşmak	qeraşî bûn
hoş sohbet	qezîxweş
çıt yapmak	qirpînî kirin
haberleşmek	ragihandin hev
iletişmek	ragihandin hev
işler	sazbar
kapı açmak	şerî kirin
akım yapmak	şûrikîn
osurgan	tîrek
osurukçu	tîrek
yüze gülmek	xwe lûsikandin
tırıs tırıs	xwe lûsikandin
öz itme	xwegerî
kendini savunma	xweparêzî
tromboz	xwîntîrî
yardım etme	yarmetîdan
zindancı	zindanvan
saç tıraşı yapmak	por çêkirin
saç yapmak	por çêkirin
mülayim	milayîm
yumuşak huylu	milayîm
tınmaz	milayîm
şöylece	a wer
anatomist	anatomîzan
kartaloş	arane
kartaloz	arane
kartaloş, kartaloz	arane
babaî	babayî
insan kuş misali	bêbasko
soluk aldırmamak	bêhn nedan
belediyeci	belediyevan
filikacı	belemnêr
mevkufen	bêragirtîbûn
merasimsiz	bêrêûresm
tekabül etmek	bergîdanî
meleşmek	berîn ketin
kestirmeden	biçolbirî
yoluna çıkmak	bileqayî
lokantalı	biaşxane
göz koymak	bijî dan
bölmeli	binavbir
alt sınıf	bineçîn
telgrafçı	birûskevan
sazlı	bisaz
kalpaklı	bitelik
tonaj	biton
olurluk	bûnî
flört	cîlwekarî
çerçeveci	çarçovekar
çarlık	çaritî
dörtlü	çarmend
çarıkçı	çaroxker
çıvgar	çivgar
ötleğen	çivîka şeytanok
bayır kuşu	çivîka şeytanok
çalı bülbülü	çivîka şeytanok
ksilofon	çivjen
yanına gitmek	çûn cem
ayağına gelmek	çûn cem
damalı	damakî
satrançlı	damakî
yüreğine işlemek	dan dil
ileri almak	dan pêş
dekoratör	dekorsaz
oya gibi	delalokî
yerden kovmak	dercî kirin
besicilik	dermaletî
farmakolog	dermannas
cana kıymak	dest çûn
kapalı devre	dewregirtî
alacaklı çıkmak	deyndêr derketin
düldül	dildil
endazelemek	endaze kirin
eşinmek	erşanî kirin
aşka gelmek	eşq hatin
azletmek	ezl kirin
gayzer	germavk
cevahirci	gewhervan
jurnal etmek	gilîname dan
laf atmak	gotin avêtin
gem almak	hatin bar
yüklenilmek	hatin barkirin
gözlerinden öpmek	hatin çavê
eline geçmek	hatin destê
ellerinden öpmek	hatin destê
haline gelmek	hatin halê
aklına düşmek	hatin hişê
hatırına gelmek	hatin hişê
kayrılmak	hatin îltimaskirin
karşılamaya gelmek	hatin pêşiyê
planlanmak	hatin plankirin
başından geçmek	hatin serê
dile gelmek	hatin ziman
lisana gelmek	hatin ziman
dillenmek	hatin ziman
banko	hatiye danîn
hoppala	helah
binlik	hezarek
solunum	hilmij
hindoloji	hindzanî
iskitçe	îskîtî
iskitler	îskîtî
kara biber	îsota reş
endogami	jevzewac
higroskop	kambîn
haz vermek	kêf dan
ileri geçmek	ketin pêş
fırsat düşmek	keys ketin
okka çekmek	kîlo avêtin
gömlek değiştirmek	kiras avêtin
gözüne sokmak	kirin çavê
eline tutuşturmak	kirin destê
ağzına tıkamak	kirin devê
harıldamak	kirin guregur
düşeyazmak	kirin ketin
cız etmek	kirin kizînî
yumruk atmak	kulm danîn
domuz gibi	lê nabêje
letçe	lêtî
mahkûmiyet	mehkûmiyet
misafir etmek	mêvan kirin
gölük	mînaker
moral vermek	moral dan
mühürcü	morsaz
sarımsak otu	nanikê çûçê
çoban dağarcığı	nanikê çûçê
kuş ekmeği	nanikê çûçê
gayri mümkün	negengaz
gayri malûm	nemelûm
çetrefılsiz	nealoz
nacak	necax
okunaksız	nefesîh
törelsiz	negerdîşî
ehemmiyetsiz	negiring
önemsiz	negiring
namüsait	neguncan
gayrı menkul	nekêşbar
çalımsız	nekuşpene
kasıntısız	nekuşpene
soyut isim	nenêrbaran
cırmık	nep
ahfat	nesî
liyakatsiz	neşareza
uyruksuz	neteba
ne idiği belirsiz	netu
pısırıklaşmak	newêrekî bûn
pısırıklaşma	newêrekîbûn
kıtır	newey
alaca düşmek	nîşanî avêtin
baklava dilimi	niviştokî
kıpık	nîvkêşî
doksanlık	notanî
ayak değiştirmek	pê guhartin
gönlü ile oynamak	pê leyistin
dama taşı gibi oynatmak	pê leyistin
eli olmak	pêçiya
parmağ olmak	pêçiya
çiçek yaprağı	pelên kulîlkê
galericilik	pêşangehvanî
ilerleyiş	pêşveçûnî
nasir	pexşannivîs
fışkırtı	pijiqînî
zil gibi	pir serxweş
kütük gibi	pir serxweş
leş gibi sarhoş	pir serxweş
mastor	pir serxweş
bulut gibi	pir serxweş
leyla gibi	pir serxweş
örümcek bağlanmak	pîrik avêtin
boy vermemek	qam hebûn
gülütçü	qerfnivîs
palamarcı	qetikvan
değer olmak	raya
kasıtı olmak	rika
mütehammil	semaxdar
ana bölüm	serbeş
başında kavak yeli esmek	sergerm bûn
başında kavak yelleri esmek	sergerm bûn
çergeci	sewanvan
gölgecil	siyokî
kına çiçeği	sûrdar
krallara layık	şahwer
krala yakışır şekilde	şahwer
kral gibi	şahwer
şekerci	şekirfiroş
altmışlık	şêstanî
geceki	şevînî
kör şeytan	şeytanê kor
tabutluk	tabûtgeh
jübile	tê çêkirin
fon müziği	tê lêxistin
boşama	telaqavêtin
çuval gibi	telîsokî
infiratçi	tenahîparêz
yalnızcı	tenahîparêz
tarla kuşu	têtî
topçeker	topkêş
içit	vexurik
haraçlı	xeracdar
çetele çekmek	xêzik avêtin
boy ölçüşmek	xwe bî
yüzüne gülmek	xwe lî
kendini bulmak	xwe nasîn
kendini tanımak	xwe nasîn
sarınmak	xwe pêçandin
allah var	xwedayê
fahriye	xwepesndan
aşikare	bi aşkerayî
sarahaten	bi aşkerayî
ulu orta	bi aşkerayî
çoğunca	bi piranî
doğubeyazıt	bazîd
bingöl	çewlîg
ardahan	erdêxan
elâzığ	xarpêt
harput	xarpêt
midyat	midyad
nusaybin	nisêbîn
badas	binbêder
harman sonu	binbêder
acil olarak	biteqezî
oy birliği ile	biyekdengî
ak kirpani	cûnekî
çanak ağızlı	dide der
sevdasına düşmek	dil berdan
gönül vermek	dil berdan
ciğeri sızlamak	dile
gönül kırmak	dile
hayata küsmek	dile
yüreği burkulmak	dile
yüreği parça parça olmak	dile
yüze duramamak	dile
flâmacı	direfşkêş
ardını bırakmamak	dûvika
eş biçimli	hemteşeyî
izomorfik	hemteşeyî
eş zaman	hevedem
senkron	hevedem
domuzdan kıl çekmek (veya koparmak)	jê çirpandin
gelberi etmek	jê çirpandin
vaziyeti kurtarmak	jê filitîn
semerini güneşe dayamak	jê filitîn
hariç olmak	ji derveyî
hayatı kaymak	keleka
tepesi aşağıya gitmek	keleka
kepeklenmek	kenk ketin
gündeme almak	kirin rojevê
askerlik hizmeti	leşkertîkirin
kaçakçılık	mişextvanî
sağgörüsüzlük	nedûrendîşî
beğenmezlik	neecibandin
gidişini beğenmemek	neecibandin
içtenliksiz	nesamîmî
içtensiz	nesamîmî
okur yazar olmayan	nexwendî
patalog	nexweşînnas
bilimsel olmayan	nezanistî
peçenekçe	peçenekî
fıkracı	pêkenîbêj
radar	pêlgir
pelin	pêlîn
lemis	pêlîn
yapraktan imal	pêlîn
muhammes	pêncane
beşli	pêncane
beşlik	pêncanî
öngörülür	pêşbînbar
ön taraf	pêşgeh
ilerleme yanlısı	pêşketinxwaz
teşrifatçı	pêşwazîkar
kalkerleşmek	qusekî bûn
kalkerleşme	qusekîbûn
siftahlanma	serfetihkirin
başmüdür	sergerînende
başçoban	serşivan
çobanbaşı	serşivan
haksızlığa uğrayan	stembar
anlıkçılık	têgihanî
anlakçılık	têgihanî
toptancı	tomerîfiroş
anlatıcılık	vebêjî
gizleniş	veşirîn
gizlenme	veşirîn
tağşiş etmek	xistin navî
kendini avutmak	xwe ewiqandin
siftinmek	xwe ewiqandin
başını kurtarmak	xwe filitandin
masraflardan kaçınmamak	xwe weşandin
masraftan kaçınmamak	xwe weşandin
öz yönetim	xwerêvebirin
yunma	xweşûştin
sebzevatçı	zerzewatfiroş
yuf	hiryo
diğerkâm	dîgerkam
döveç	sîrkut
parça parça etme	çîrçîrîkirin
lime lime etme	çîrçîrîkirin
debelendirme	çîrçîrîkirin
dar açılı objektif	lensa berteng
geniş açılı objektif	lensa berfireh
altın oran	rêjeya zêrîn
ff	ff
tam kare	fûll frame
dx	dx
ampul	ampûl
alışılmış	mûtat
tütsülemek	elkol vexwarin
ambargo koymak	embargo rakirin
açık açık söylemek	aşkira gotin
adlı adınca	aşkira gotin
sektirmemek	etle nekirin
vesile bulmak	bihane dîtin
dürümlemek	balolkî kirin
barutçu	barûtpêj
böceksiz	bêbiyok
tartışmasız	bêgengeşe
ayrıçalıksız	bêimtiyaz
dağıtılabilir	belavbar
müddetsiz	bêmidet
pusulasız	bêpisûle
kamasız	bêqeme
bahçeli	baxçedar
balgamlı	bibilxem
salyalı	bigilîz
gümrüklü	bigumirk
müddetli	bimidet
peştemallı	bipêşmalk
pusulalı	bipisûle
kamalı	biqeme
hörgüçlü	biqop
parmaklı	bitil
hulyalı	bixeyal
filozoflaşmak	bûn fîlozof
çingeneleşmek	bûn mitirb
salgınlaşmak	bûn şob
cilt evi	cildxane
cizûbendker	cildxane
mücellithane	cildxane
elbiseci	cilfiroş
çizmeci	cezmesaz
mütecasir	cur'etkar
eğiç	çeqî
yalatmak	dan alîstin
kazdırmak	dan kolîn
kırdırmak	dan şkandin
kırdırtmak	dan şkandin
inceletmek	dan vekolîn
doğurtmak	dan zan
ana erkil	dayikanî
darbe indirmek	derbe lêdan
bahçe kapısı	derzgeh
damga vurmak	dexmandin
mümeyyizlik	diristkerî
eziyet vermek	ezyet dan
fransızlaşma	frensîbûn
fransızlaştırma	frensîkirin
mühimseme	giringdîtin
silindir gibi	gindorkî
tombik	gindorkî
sildirilmek	hatin malîn
araştırılmak	hatin vekolîn
nitelendirilmek	hatin wesifandin
izohips	hembilindahî
hapis yatmak	hefs kişandin
dürtüşme	hevniçandinî
örücülük	hûnankerî
ornatmak	îqame kirin
uyuşmazlık çıkmak	ixtilaf derketin
röprodüksiyon	jibergirî
dargınlaşma	jihevxeyidînî
tavşancılık	keroşkfiroşî
kahvecilik	qehwekerî
gürültüye getirmek	kirin gêjî
üzerine atmak	kirin stuî
kendi üstüne yormak	kirin stuî
tedavüle çıkarmak	kirin tedawilî
dernekçi	komeleparêz
dernekçilik	komeleparêzî
kurt bilimci	kirmnas
konumlanmak	lê êwirîn
ölçüyü kaçırmak	lê şkandin
lıkırdamak	leqînî kirin
menfaatperver	mifaperwer
gıcıklayış	mirrmirrî
taksimetre	nirxpîv
içtenliksizlik	nesamîmiyetî
içtensizlik	nesamîmiyetî
doğa üstü	nesiriştî
budun bilimci	nijadnas
etnolog	nijadnas
denizaltıcılık	noqvanî
övünmek	pesnîn
tefahür	pesnîn
temeddüh	pesnîn
öğünme	pesnîn
öğünmek	pesnîn
öncelik tanımak	pêşikî dan
peştemalcı	pêşmalkfiroş
peştemalcılık	pêşmalkfiroşî
eklenmiş	pêvekirî
katılmış	pêvekirî
ulanmış	pêvekirî
kamışsı	qamîşokî
izafilik	relatîvî
natürafîzm	siriştîparêzî
yıldız akmak	histêrk şemitîn
geri getirmek	şûnve anîn
kan yutmak	tengî dîtin
fotokinezi	tîrojgerîn
radyometre	tîrojpîv
tüfekçilik	tifekkerî
humbaracı	qumberevan
kumbaracı	qumberevan
yalanış	xwealîstin
yalanma	xwealîstin
sıkınmak	xwegivaştin
tesettür	xweniximandin
söz ehli	xweşkilam
ayaza kalmak	zegord man
açıklar livası olmak	zegord man
fıtrat	afirîş
kasırga gibi	bagerkî
uçak yapımı	balafirsazî
karar çıkarmak	biryar derxistin
hikâye anlatmak	çîrok gotin
uçurtmak	dan firandin
paralatmak	dan peritandin
hücum ettirmek	gurmijandin
tiksinilmek	hatin kerixandin
iğrenilmek	hatin kerixandin
kömürcü	komirfiroş
mütetebbi	lêgerîner
mübalâğacılık	pirolekerî
abartıcılık	pirolekerî
abartmacılık	pirolekerî
e göre	li dûv
e uyarınca	li dûv
resif	resîf
eleşkirt	elajgir
pırtık	xincik
kameriye	xincik
huğ	xincik
hecelemek	kîtandin
romatizma	romatîzma
abis	nax
dağ koyunu	pezkûvî
akort etme	akortkirin
cismen	bi bedenî
gösterişsizce	bi bêmirêsî
meccanen	bi bêpere
genişçe	bi berfirehî
bol keseden	bi bêsexbêrî
bedavaya	bi erzanî
boğaz tokluğuna	bi nanzikî
nazlana nazlana	bi nazenaz
nazlana	bi nazenaz
nazikane	bi nazikî
nezaketen	bi nazikî
bilmeden	bi nezanî
tahriren	bi nivîskî
nedametle	bi poşmanî
fikren	biramanî
uysalca	bi sernermî
heyamola ile	bi zehmetî
açlık çekmek	birçîbûn kişandin
sarışınca	çûrikî
diğerkâmlık	dîgerkamî
yanaşmamak	dûrman
anıtlaştırılmak	hatin bîrdarîkirin
yakamoz olmak	hatin firstiqandin
muammer	jiyayî
marazlanma	merezdarîbûn
meskût	negotî
anlaşmalı	peymanbestî
dörtte bir	ribik
sokulu	têrekirî
ayırtman	vawêrkar
ayırtmanlık	vawêrkarî
ağız kavafı	xweşek
prematüre	zûzayî
naip	naîb
tevali	bêatlehî
işkil	bedgumanî
suiniyetli	bedniyaz
hizipleşmek	bendbendî bûn
kamplaşmak	bendbendî bûn
klikleşmek	bendbendî bûn
ağzı kara	bêqidoş
şom ağızlı	bêqidoş
köstek vurmak	berasteng kirin
mümenaat etmek	berasteng kirin
ilkönce	berê pêşîn
yönelmeli	berpêyî
bütün bütün	bi temamî
dala çıka	bi zorê
ıkına sıkına	bi zorê
zor bela	bi zorê
zor zar	bi zorê
düşe kalka	bi zorekê
zorca	bi zorekê
gücü gücüne	bi zorekê
zoru zoruna	bi zorekê
forslu	bifors
gümüşlemek	birbisîn
gümüşlenme	birbisîn
gümüşlenmek	birbisîn
ipileme	birbisîn
ipilemek	birbisîn
mülhak	biservekirî
açık kapı bırakmak	cih hîştin
kargacık burgacık	çelexwarî
teessüs etmek	damezrîn
teraziye vurmak	dan aqilan
usa vurmak	dan aqilan
tekmelemek	dan zîtikan
inhitat etmek	dehibîn
süre aşımı	demborî
müruruzeman	demborî
samut	dengnekir
eli işe yatkın	destbikêr
tevehhüm	dilxuşûşî
tırtık tırtık	dirdirkî
kavuştak	dîsgotin
nakarat	dîsgotin
dudak ısırtmak	ecêbmayî hiştin
parmak ısırtmak	ecêbmayî hiştin
kınayış	eyibandin
dağarın şenliği	fehmkor
dağların şenliği	fehmkor
farazî	ferazî
istinkâf etmek	fikare kirin
uçuşma	firikîn
uçuşmak	firikîn
kasınma	firikîn
kasınmak	firikîn
savuşup gitmek	fîsfîsikandin
cızlamı çekmek	fîsikandin
atmasyonculuk	fortekî
yuvar	giloverik
tostoparlak	giloverik
derece derece	hêdî hêdî
ılgıt ılgıt	hêdî hêdî
ılgıt	hêdî hêdî
uslandırmak	hedinandin
az daha	hema mabû
gözleri yaşarmak	hestgerm bûn
mütehassis olmak	hestgerm bûn
şimdiye kadar	heta niha
yol arkadaşı	hevalrê
öcünü almak	heyfa
ham hum	himehim
birileri	hin kes
ucun ucun	hino hino
ufaktan ufağa	hino hino
ceste	hino hino
kıdım kıçlım	hino hino
kıdım kıdım	hino hino
ucun	hino hino
harılanmak	hirmijîn
kuru soğuk	hişkesayî
çakır ayaz	hişkesayî
kaskatı olmak	hişkobiringo bûn
katılmak (aşırı derece gülmek sonucunda)	hişkobiringo bûn
takır takır olmak	hişkobiringo bûn
katıca	hişkolekî
çingene maşası	hişkolekî
köprü kemeri	kevane
taş ustası	kevirtraş
taş yontucusu	kevirtraş
taş ustacılığı	kevirtraşî
taş yontuculuğu	kevirtraşî
kakırtı	kirpînî
fıkramak	kişkişîn
fışlamak	kişkişîn
arpacık soğanı	kixs
soğan arpacığı	kixs
yedigir	komika sêwiyan
sürdürüp gitmek	kudandin
güçlük içinde sürüklenip gitmek	kulkulîn
halaçllık	kurincî
çenileme	kûzîn
fevkani	lepira
yağmurlama	lêreşandin
indirgeme	lêvegerandin
izine basmak	li dû
peşinde	li dû
sırtıı sıra	li dû
sırtı sıra	li dû
kümeleşmek	lihevkombûn
arap saçı	linavhevketî
darmaduman	linavhevketî
teselsüs	lipeyhev
arka arkaya	lipeyhev
sökün	lipeyhev
alt alta	liserhev
vızır vızır	liserhev
taahhütlü	lixwegirtî
kekremsi	mehdekirî
yaltaklamak	meliqandin
vıcık vıcık olmak	meliqîn
efil efil etmek	milmilîn
şöyle ki	mîna ku
deli posteki sayar gibi	mîna ku
gemi adamı	muretebat
havsalası geniş	mûsamahakar
tahrikât	navtêdan
sümsük	nermijok
afyonlu	nermijokî
don yağı gibi	nermijokî
yordamsız	nermijokî
lapacı	nermûsankî
bezekçi	nexşebend
bezemeci	nexşebend
bezeyeci	nexşebend
aslık	nezayok
patriarkal	pederşahî
ataerkil	pederşahî
şırak	pelq
dehalet	penihîn
layiha	pêşnûma
sipsi	pîpik
şahrem	pirtîpirtî
mısdak	pîvang
gök evi	planetaryûm
planetaryum	planetaryûm
yıldız evi	planetaryûm
yıldızlık	planetaryûm
kuş sapanı	qewsik
minnoş	qico
yom	qidoş
endişelendirme	qilqilandin
endişelendirmek	qilqilandin
tedirgin etmek	qilqilandin
çatır çutur	qirçeqirç
gırç gırç	qirçeqirç
hoyratlık	qubedetî
erkeklenmek	qubedetî kirin
hoyratlık etmek	qubedetî kirin
dadanma	raselitîn
sarkıntı olmak	raselitîn
tebelleş	raselitîn
tebelleş olmak	raselitîn
yol gösterme	rênîşan
tıka basa dolmak	repisîn
gösteri yürüyüşü	rêpîvan
adımlama	rêpîvan
keyif sürmek	rewiqandin
at koşturmak	rewiqandin
imtisal etmek	riayet kirin
riayet etmek	riayet kirin
uyulmak	riayet kirin
ömrümün varı	ruhê min
ruhum!	ruhê min
şekerim!	ruhê min
cinler cirit oynamak	semtexalî
eciniler top oynuyor	semtexalî
ferahlama	seqirîn
başında	serê pêşîn
evleviyetle	serê pêşîn
ilk ağızdan	serê pêşîn
ilk ağızda	serê pêşîn
ilk partide	serê pêşîn
orasına burasına	serobero
yalan yanlış	serobero
yarım yamalak	serobero
boktan	serobero
tereddüt etmek	sidinîn
başına devlet kuşu konmak	siûda
şansı dönmek	siûda
tersi dönmek	şaşomaşo bûn
koyun bakışlı	şaşwaz
apışıp kalmak	şaşwaz bûn
gaf yaptırmak	şelipandin
tongaya bastırmak	şelipandin
gaf yapmak	şelipîn
acze düşmek	şeqizîn
silahşorlük	şerevanî
çalkamak	şeridandin
şallak mallak	şilftazî
şıkırdatma	şingandin
şıkırdatmak	şingandin
çıkır çıkır	şingeşing
şıngır şıngır	şingeşing
ağdırma	şiqitandin
torbalanmak	şiqitîn
dağ kırlangıcı	şivanxapînok
ebabil	şivanxapînok
keçisağan	şivanxapînok
kıvrım kıvrım kıvranmak	tebatî nehatin
sabrı taşmak	tebatî nehatin
yeri göğü tırmalamak	tebatî nehatin
hop oturup hop kalkmak	tebatî nehatin
ayağını alamamak	tebatî nehatin
hop oturdu hop kalktı	tebatî nehatin
banma	têdekirin
katır yılanı	têkilhev
tortul	telpik
tıpış tıpış	tepetep
tıp tıp	tepetep
mum gibi	têrpaqij
sönümleme	tewifîn
mürettiplik	tîprêzî
dangalakça	tiredînkî
delişmence	tiredînkî
hoppala bebek	tiredînkî
yabani güvercin	tivîlk
ağcı	torevan
boş kafalı	totikvala
becelleşme	vecelidîn
becelleşmek	vecelidîn
cebelleşme	vecelidîn
cebelleşmek	vecelidîn
tersinmek	vecelidîn
dokumayı tamir etmek	veçinandin
aktarma yapmak	veguhêzî
ötesi berisi	virde wêde
sağa sola	virde wêde
eliyle koymuş gibi	wekî ku
yaraya tuz biber ekmek	wekî ku
tekrar söylemek	wekilandin
teressüp	werivîn
hazne	xezne
gur gur	xurexur
ağan	xuricîn
çağıl çağıl	xuşexuş
haşır haşır	xuşexuş
seciyesiz	xûynepak
tıynetsiz	xûynepak
halûk	xûypak
oğuz	xûypak
özeniş	xwezîpêanîn
tekdüze	yekaheng
çocuğumsu	zarokwarî
çocuksu	zarokwarî
tanyerinin ağarması	zeriqîn
tanyeri ağarması	zeriqîn
kayış dili	zimançepel
dili zifir	zimançepel
dayılanma	zirtikîn
dayılanmak	zirtikîn
acilen	zûzûka
bir hamlede	zûzûka
çabuk çabuk	zûzûka
hızlı hızlı	zûzûka
babaevi	balîg
esirgeyen	mihrîvan
esirgeyici	mihrîvan
cudi dağı	cûdî
algoritma	algorîtm
bitap düşme, tükenme	çormîşbûn
altın saat	saeta zêrîn
mavi saat	saeta şîn
sihirli saatler	saetên bi sêhr
biryan	biryanî
kör pencere	taxçik
dönüm noktası	xala werçerxê
kilometre taşı	xala werçerxê
malazgirt	milazgir
işkilsizlik	bêbedgumanî
tentenesiz	bêdantêl
nakaratsız	bêdîsgotin
aktarmasız	bêveguhêzî
vira	bi bêatlebûn
gepgenç	bi ciwanî
emaneten	bi emanetî
naklen	bi veguhêzî
aktarmalı	bi veguhêzî
aval aval	bi xirexavî
tenteli	bidantêl
nakaratlı	bidîsgotin
hotozlu	bikimşik
düdüklü	bipîpik
çocuklu kadın	bizarok
tercüman olmak	bûn tercûman
tenevvü	çeşîdî
onartmak	dan selihandin
işgüzarlık	destbikêrî
el yatkınlığı	destbikêrî
lafazanlık	devlokî
afi kesmek	fortekî kirin
çalım satmak	fortekî kirin
poz kesmek	fortekî kirin
kaba kulak olmak	gelpikî bûn
küremsi	giloverikî
ıslıklanmak	hatin fîsikandin
numaralanmak	hatin nimrokirin
tespit edilmek	hatin pêdandin
sataşılmak	hatin raselitîn
caydırılmak	hatin texilandin
fırınlanmak	hatin xericandin
altın yumurtlayan tavuk	hêka
yerinde su çıkmak	hêka
fitil almak	hiltîzikîn
fitili almak	hiltîzikîn
zirzoplaşmak	hirhop bûn
zirzoplaşma	hirhopbûn
zirzopluk etmek	hirhopî kirin
züppelik etmek	hirhopî kirin
züppece	hirhopkî
kin gütmek	jê initîn
münharif	jirêderketî
parantezi kapatmak	kevane girtin
parantez açmak	kevane vekirin
kakır kakır gülmek	kirin hîqehîq
kıtırdama	kirpînîkirin
çekikçe	kişandiyokî
itlenmek	kûçikbavî kirin
itleşmek	kûçikbavî kirin
müdahil olmak	midaxîl bûn
başına musallat olmak	museletî
musallat etmek	museletî
yivli	niqirdar
beşik kertiği	niqirkirî
beşik kertme nişanlı	niqirkirî
çentiklenmek	niqirokî bûn
teşhircilik	pêşanderî
maşalık	pêşmêrî
projelendirmek	pêşnûma çêkirin
çarpıkça	pilûçkî
uğursamak	qidoş dîtin
kabadayılaşmak	qubede bûn
kabadayılaşma	qubedebûn
boyutlu	rehendî
sap çekmek	sap kişandin
sahan	sehenk
cadılaşmak	sêrebendî bûn
cadılaşma	sêrebendîbûn
görünüşü kurtarmak	serobero kirin
mugalata	şaşwazker
temaşagâh	temaşegeh
zurna çalanın kapısında limon yemeğe benzer	tewşomewşo axaftin
reddedilme	tirotîbûn
imgeleme	venîgaş
okkalık	weqîyî
niteleniş	wesfîn
nitelenmek	wesfîn
nitelenme	wesfîn
kan aktarımı	xwînveguhêzî
çocuk bilimci	zaroknas
büyük taş	nehît
büyük baş	dewêr
büyükbaş	dewêr
amip	amîba
etyopya	etyopya
etiyopya	etyopya
emine	emîna
art edat	paşdaçek
hektar	hektar
gelecek zaman	dema bê
ergonomi	ergonomî
çakıl yokuş	xîştor
suyun bir yerde toplanması	pingirîn
bk.	bnr
bkz	bnr
ut açıcı	bnr
ü	bnr
ut açıcılık	bnr
ö	bnr
işten çıkarmak	axêz kirin
et bıçağı	kêrika goşt
islamofobi	îslamofobî
ahlaki pusula	pisûleya rewiştî
zübeyda	zibeyda
zübeyt	zibeyd
keklik yavrusu	kewik
doygun	wareste
oluşturucu	pêkhêner
bileştirici	pêkhêner
gerçekleştirici	pêkhêner
icracı	pêkhêner
snop	zûpe
topuk kemiği	hestiyê paniyê
televizyon dizisi	rêze film
ölçü birimi	yekeya pîvanê
antitank	antîtank
bir bakıma	ji alîkî ve
akupunktur	akupunktur
amonyumklorid	amonyûmklorîd
bombus	bivbivink
ayrılışmak	ji hev cihê bûn
dokuyuş	raçîn
medcezir	kêş û vekêş
sayı boncuğu	abakus
çörkü	abakus
bile	tenanet
müzik çalar	lêdera muzîkê
müzik oynatıcı	lêdera muzîkê
yedekleme	dewsek kirin
hünsa	nêremê
erdişi	nêremê
tek sayı	hejmara kit
çift sayı	hejmara cot
koordinat sistemi	sîstema koordînatê
korku filmi	fîlmê tirsê
tüketici fiyatları endeksi	endeksa bihayê xerîdaran
tarım işçisi	êrxat
birleşik arap emirlikleri	mîrnişînên erebî yên yekbûyî
budapeşte	budapeşt
yıkanmış	şûştî
meyan suyu	ava sûsê
meyan şerbeti	ava sûsê
meyan balı	ava sûsê
yapboz	pazil
ünlem işareti	baneşan
beyaz rusya	belarûs
belarus	belarûs
kolombiya	kolombiya
tokyo	tokyo
başrol	serlîstikvan
başrol oyuncusu	serlîstikvan
başoyuncu	serlîstikvan
koşuşturmaca	lihevçûnûhatin
koşuşma	lihevçûnûhatin
koşuşturma	lihevçûnûhatin
yeldirme	lihevçûnûhatin
yeniden yapım	jinûveçêkirin
serbest ticaret	bazirganiya azad
hayret kalmak	lêva xwe gez kirin
dudağını ısırmak	lêva xwe gez kirin
nikaragua	nîkaragua
kosta rika	kosta rîka
nakavt	nakawt
nakavt olmak	nakawt bûn
adı geçen	navborî
zikredilen	navborî
dişeğilemek	fatûş kirin
hipnoz	hîpnoz
ipnotizma	hîpnoz
hipnotizma	hîpnoz
nahçıvan	naxçivan
milli ekonomi	aboriya neteweyî
türkiye	tirkiye
yalnız başına	bi tena serê xwe
başlı başına	bi tena serê xwe
bir başına	bi tena serê xwe
kuru başına kalmak	bi tena serê xwe
sipsivri kalmak	bi tena serê xwe
can cana baş başa	bi tena serê xwe
ip ipullah sivri külah	bi tena serê xwe
dıral dedenin düdüğü gibi kalmak	bi tena serê xwe
tarafından	ji aliyê her kesî ve
herkesçe	ji aliyê her kesî ve
filmografi	fîlmografî
singapur	singapûr
singapur cumhuriyeti	komara singapûrê
sevkulceyş	gêrartêşî
ütopik	utopîk
el feneri	aletrîk
ofsayt	ofsayd
fabrikatör	fabrîqetor
fabrikacı	fabrîqetor
videokonferans	vîdeokonferans
eğerle meğer evlenmişler	dara xweziyê bêpelg e
keşke isimli bir çocukları olmuş	dara xweziyê bêpelg e
bu hariç	ji bilî vê
bundan başka	ji bilî vê
bundan gayrı	ji bilî vê
bunun dışında	ji bilî vê
bunun dahası	ji bilî vê
abhazca	abxazî
ayçiçeği yağı	rûnê gulberojê
havayolu	rêhewa
bağımsızlıkçı	serxwebûnxwaz
tinselcilik	manewiyat
işporta	îşporta
sınır üstü	serxet
düşünce kuruluşu	think-tank
ciro	cîro
şarjör	şarjor
katamaran	katamaran
uluslararasılaştırma	navneteweyî kirin
vasiyetçi	musî
kara piyasa	bazara reş
kara borsa	bazara reş
yeraltı ekonomisi	bazara reş
kara pazar	bazara reş
karaborsa	bazara reş
karapazar	bazara reş
öyküntü	wergerandina yekser
ödünçleme alıntı	wergerandina yekser
şantaj yapmak	arîşetî lê kirin
oturduğu dalı kesmek	afirê xwe xerab kirin
bindiği dalı kesmek	afirê xwe xerab kirin
evini kendi eliyle yakmak	agir bi mala xwe ve danîn
gözünü kan bürümek	agir di çavan de ye
ateş kesilmek	agir ji dev barîn
sap yiyip saman sıçmak	agir ji dev barîn
dumanı tepesine çıkmak	agir ji dev barîn
volkan gibi patlamak	agir ji dev barîn
babaları tutmak	agir ji dev barîn
öfke tepeme çıkmak	agir ji dev barîn
sap yer saman savurur	agir ji dev barîn
sap yer saman sıçar	agir ji dev barîn
adir û şewate dekewtiş	agir û xurî pê ketin
diz çöktürmek	anîna ser çokan
evin direği	aqûbeta nav malê
huzurunu kaçırmak	aram lê birîn
kara gün dostu	arvanê sala teng
dudu dilli	aşê betalan
birini afetmemek	av lê venexwarin
birini affetmemek	av lê venexwarin
gözünün yaşma bakmamak	av lê venexwarin
duş almak	av li xwe kirin
kurban gitmek	av û av çûn
terkisine almak	avêtina pişt xwe
kaş çatmak	awir lê dan
gözünü toprak doyursun	ax çav têr bike
kara top­rak	axa sar
haşarı olmak	ba pê ketin
herkes kendisini düşünür	ba tê her kes kumê xwe li serê xwe digire
fırtına çıkmak	ba û babelîsk bûn
iman etmek	bawerî pê anîn
mutmain olmak	bawerî pê anîn
güvenilmez olmak	baweriya li ser dev û lêvan
ji ber xwe ve şerm nekirin	bê ar bûn
kayıtsız şartsız	bê qeyd û şert
kazasız belâsız	bê qeza û bela
şapka işareti	bilindek
düzeltme işareti	bilindek
çeyiz katırı	bûn şorba nexweşan
sürre devesi gibi	bûn şorba nexweşan
dışişleri bakanlığı	wezareta karûbarên derve
dışişleri bakanı	wezareta karûbarên derve
onomastik	onomastîk
ad bilimi	onomatolojî
angıt	werdeka sorbelek
pırlanta	pirlanta
serenli	dengiza
sino-korece	sîno-koreyî
çiğ damlası	gerove
ticaret hukuku	hiqûqa bazirganiyê
krat	krat
tesellisiz	bêteselî
fütursuzca	biguhnedarî
kayıtsızca	biguhnedêrî
defalarca	çend caran
bağrı yufka olmak	dilrehm bûn
ipnotizmalı	hîpnozkirî
ifade vermek	îfade dan
akşam namazı	nimêja êvarê
ifraz et­mek	parsel kirin
geri dönüş	paşveger
gök bilimsel	stêrnasiyî
stratejik	stratejîk
kişiselleştirme	şexsîkirin
trompetçi	trompetjen
trampetçi	trompetjen
imgelemek	venîgaş kirin
kedi nanesi	belazîz
yaban sümbülü	belazîz
inci taneleri	durdane
gül suyu	mawer
gülsuyu	mawer
keskin zeka	nisar
kıdem	qidem
segâh	sêgah
humar	xumar
kan gelmek	xwîn jê hatin
sovyetler birliği	yekîtiya sovyetan
östrojen	ostrojen
otistik	otîstîk
otist	otîst
pencere kenarı	teqişk
yönetim bilimi	rêveberînasî
anadolu	anadolî
kaba kişi	zirteboz
allah bahtından güldürsün	xwedê wî bi rehmeta xwe şad bike
allah gani gani rahmet eylesin	xwedê wî bi rehmeta xwe şad bike
vukû bulmak,olmak,meydana gelmek	tifiqîn
mis	qelemusk
yabani pelin	qelemusk
kozmos	hemgel
makyör	makyoz
makyöz	makyoz
eniklenme	deliqîn
maden suyu	ava berbesî
karbonmonoksit	xelûzferzingar
ekil	xure
yalayıcı	alêsek
bakkam	beqem
yoluyla	bi wesiteya
damlataş	bizmilûg
çengellemek	çengel kirin
kanun dışı	dereqanûn
derpiş	derpêş
kol kapağı	devzendik
paçalık	devzendik
fil dişi	diranfîl
güç duruma düşürmek	dorlêgirtin
çengelli iğne	filket
kancalı iğne	filket
balık otu	giyaşîrk
sittinsene	heta ku
sürece	heta ku
yumurta ikizi	hevalza
hazret	hezret
ihbarlamak	îxbar kirin
vazgeçirmek	jê vegerandin
alamana ağı	kamûfle kirin
alalamak	kamûfle kirin
korporasyon	karciv
sarı sıcak	kelekel
sıcak esinti	kelekel
fosurtu	kufinî
dayıoğlu	kurxal
uzlaşıcı	lihevhêner
uzlaştırıcı	lihevhêner
löküs	lokis
silici	malêşkar
adı batası	malmêrato
dişi katır	meya
şapurşupur	mirçemirç
nimbüs	nîmbûs
kalaycı körüğü	nixaf
gerisin geri	pêlepaş
cürüf	perg
alın çıkıntısı	pêşcênîk
peşin hükümlü	pêşdaraz
pofur	pifepif
pofur pofur	pifepif
kelli	piştî ku
perde arkası	piştperde
dondurucu	qerisîner
dalevereci	qulebaz
iki buçukluk	quriş
metelik	quriş
kütürdetme	qurpandin
döşemci	raxer
döşeyici	raxer
mefruşatçı	raxer
iz bırakmak	rêç hîştin
yük üstü	serbar
kafa sallamak	serî hejandin
sangılık	sersemî
sertabib	sertabîb
karaltı	spêle
altıgen	şeşgoşe
kafatası çeper kemiği	tasa serî
tahvilat	tehwîl
telafi etmek	telafîkirin
işaret parmağı	tiliya nîşandanê
timsal	tîmsal
ısı ölçer	tînpîv
intikam alan	tolhildêr
vernikleme	vernîkkirin
sündürmek	vezandin
noktalama işaretleri	xalbendî
haber uçurmak	xeber gihandin
yol parası	xercerê
zelil	zelîl
zevce	zewce
konuşma dili	zimanê devkî
dupduru	zipzelal
kambur durmak	kûz kirin
ölümsüz gelin	mabuk
cenevre	cinêv
transatlantik	transatlantîk
zeplin	zeplîn
şeytan kulağına kurşun	bênezer
beraat etmek	beraet kirin
titizce	bifîtozî
titizlikle	bifîtozî
önyargılı	bipêşdaraz
yavuzca	biyemanî
yünlü	bihirî
mazgallı	bizereqe
kalkmaya yeltenmek	dan xwe
ava çıkmak	derketin nêçîrê
ileri atılmak	derketin pêş
serdetme	derpêşkirin
abluka altında mahsur	dorpêçayî
rendelenmek	hatin rindekirin
hasırcı	hesîrker
hasırcılık	hesîrkerî
iki kaptan bir gemiyi batırır	karek
tanecil	lextxur
sırıklama	miherşkirin
duruşma salonu	niştgeh
yellemek	nixaf kirin
yelleme	nixafkirin
palan vurmak	palan kirin
kıdemlilik	qidemdarî
kırk para	qurişek
kuşanık	rapêçayî
çırçıplaklık	riprûtîtî
arkası gelmek	serî ketin
çorap söküğü gibi gitmek	serî ketin
allak bullak etmek	serobino kirin
ılıcak	şîregermî
ılınmak	şîregermî bûn
ılınma	şîregermîbûn
ılındırma	şîregermîkirin
çöküp oturmak	tangdan
kervanın bir yerde durup dinlenmesi	tangdan
halk etmek	xulq kirin
gırtlak yapmak	xulxulandin
obur olmak	xure bûn
zırtapozluk	zirtebozî
ucuz alan, pahalı alır	erzan kiro, himban diro
yapışkan otu	nûsek
zıkkımın kökü!	kerafî
çınlamalı	biçingîn
ortaya atılmak	hatin derpêşkirin
hasırlanmak	hatin hesîrkirin
ılgar	nijd
aşerme	nevriyan
azı dişi	diranên axrê
azı dişleri	diranên axrê
yirmi dört	bîst û çar
yirmi beş	bîst û pênc
yirmi üç	bîst û sê
yetmiş iki	heftê û du
yetmiş üç	heftê û sê
yetmiş bir	heftê û yek
otuz dört	sî û çar
otuz iki	sî û du
otuz yedi	sî û heft
otuz sekiz	sî û heşt
otuz dokuz	sî û neh
otuz beş	sî û pênc
otuz üç	sî û sê
otuz altı	sî û şeş
otuz bir	sî û yek
altmış iki	şêst û du
altmış yedi	şêst û heft
altmış altı	şêst û şeş
altmış bir	şêst û yek
değirmen taşı	beraş
abo	abow
geçici olarak	bidemkî
gündüzleyin	biroj
gündüzün	biroj
devalüasyon	devaluasyon
değer düşürümü	devaluasyon
gibisine gelmek	gotin qey
yaşanılırlık	jiyanbarî
vamp	mêrperest
erkekçil	mêrperest
içerikli	naverokî
imzalayan	navîşker
kısa dalga	pêla kurt
özel ad	serenav
özel isim	serenav
yaygaracı	şemateker
kum kelebeği hastalığı	pelesî
haber kipi	şêwazê ragehandin
bildirme kipi	şêwazê ragehandin
burnunu sokmak	tilîqûnî kirin
sıral sayı	hejmara rêzdar
sayma sayısı	hejmara asayî
niteleme sıfatları	rengdêrên wesfîn
duman kalıntısı	dorinc
bakteriyoloji	bakteriyolojî
havana	havana
hafta sonu	dawiya hefteyê
kendini bir şeyden uzak tutmak	xwe jê dûr kirin
adımını geri almak	xwe jê dan paş
geri çekilmek	xwe jê dan paş
geri durmak	xwe jê dan paş
ne vakit	çi çax
buton	dugme
elden gelmemek	ji destê yekî nehatin
elinden gelmemek	ji destê yekî nehatin
huş ağacı	tûzan
yabani sarımsak	sîrmok
yabani sarmısak	sîrmok
alt bölüm	binbeş
hayatını kaybetmek	giyanê xwe ji dest dan
edepi kelâm	hunera axaftinê
gönlünü serin tutmak	bêhna xwe fireh kirin
yüreğini serinletmekê	bêhna xwe fireh kirin
koreografi	koreografî
burmak	xeşibandin
lanet olsun	nalet lê be
mak üzere	çi neman
kartopu savaşı	gulmiçkanê
bekle	xwe lê girtin
eteğine yapışmak	xwe lê girtin
balık hafızalı	bîrsar
hezimete uğrat­mak	têk şikandin
yenilgiye uğratmak	têk şikandin
yer fıstığı	fisteqebîd
it ürür karvan yürür	se direwît, karwan bi rêka xwe diçît
işini görmek	karê xwe kirin
majör	mîcer
açık hava müzesi	muzeya servekirî
çördük otu	zufa
şahdamarı	reha mirinê
bombe	qoq
kaydetme	paşekeft
maltiz	xaçirgan
aynı zamanda	di heman dem de
kompanya	beşgeh
it soğanı	sîrim
eşcinsellik	hevzayendî
yol yordam	rêûdirb
art bölge	hînterland
hinterland	hînterland
iç bölge	hînterland
kıs kıs	pis pis
içkisiz	bêalkol
üstüne salmak	berdan ser
cepheleşmek	bere danîn
onsuz	bêyî wî
günü birlik	birojkî
sıcak basmak	bûn germayî
bir dahaki sefere	carek din
cefa çekmek	cefa kişandin
ergitmek	dan bişaftin
ant vermek	dan sonde
kancıkça	dêlikî
karşısına çıkmak	derketin pêşberî
önüne çıkmak	derketin pêşberî
görümcelik yapmak	dişîtî kirin
maruz bulunmak	dûçar bûn
hava almak	hewa girtin
hava açmak	hewaxweş bûn
seçtirme	hilbijêrandin
gemilik	keştîxane
kaya güvercini	kevokên zinaran
çan çan etmek	kirin keltekelt
komalık etmek	kirin komayê
öne almak	kirin pêşiyê
kafese koymak	kirin qefesê
sahip kılmak	kirin xwediyê
tarla açmak	kirin zevî
arazi açmak	kirin zevî
ağıza alınmaz	nayê gotin
çok gelmek	pir hatin
garibanca	rebenokî
ak pelin	rihana maran
ödemeli	sencanî
vaizlik	şorindgotî
tutkal gibi	teniya bidon
püsküllü bela	teniya bidon
fosurdatma	ufandin
fosurdatmak	ufandin
at koşusu	xarîn
hasara uğramak	xisar dîtin
öz direnç	xwetirûş
dövizci	pereguhêr
keçelemek	kulav kirin
soylu at	manek
sabunluk	sabûndank
toprak düzenlemesi	zevîsazî
tolga	kumzirx
evokulluluk	dibistana malê
teflon	tîflon
kötümseme	beddîtinî
fiili bozuk	bedemel
kötü durum	bedhal
kötü birisi	bednav
gözaçıklık	çavbalî
gözü sürmeli	çavbikil
sürme gözlü	çavbikil
cin göz	çavhilkirî
yeşil gözlü	çavkesk
boncuk gibi	çavnûtik
ak gözlü	çavzer
çakır göz	çavzer
sokuşmak	dahişîn
sokuşma	dahişîn
elden ele	destbidest
el alışkanlığı	desthînî
temiz bakımlı	destşûştî
dev anası	devdeve
deve gibi	devdeve
ense kulak yerinde	devdeve
çağanoz gibi	devdeve
müdara	devdost
yol ağzı	deverê
eğri ağızlı	devxwar
sosyal olmayan	dijcivakî
kural dışılık	dijrêzikî
güvensiz	dilbiguman
alımsızlık	dilnekêşî
tırnak işareti	dunik
etli butlu	dûrme
miyop	dûrnebîn
miyopluk	dûrnebînî
dubleks	dutayî
iki katlı	dutayî
iki terimli	dutêgînî
dualite	duyatî
borcuna sadık olmayan	heqnexweş
adam otu	hiznî
bozuşulduk	jevxeydanî
bozuşukluk	jevxeydanî
nadirat	kêmkêm
ulusal azınlık	kêmnetewe
loşlaşma	kêmronîbûn
öğütleme	lêpendkirin
görünürde	liberçav
muahhar	lipaşxistî
karın üstü	liserzik
üstenci	lixwegir
üstenme	lixwegirtin
boylanma	lixwexistin
ortanca parmak	navçar
koltukaltı	navçeng
orta halli	navhalî
yurt içi	navwelat
adı çıkmış	navxirab
dile düşmüş	navxirab
kötü tanınmış	navxirab
kişilik dışı	nekesanî
tescilsiz	netomarkirî
nısıf kutur	nîvçap
yarım adam	nîvmirov
çakırkeyf	nîvserxweş
yarı karanlık	nîvtarî
cephe gerisi	paşenî
tezkiyesi bozuk	pêneewle
ön seçim	pêşhilbijarî
ön koşul	pêşmerc
ön şart	pêşmerc
ön çalışma	pêşxebat
ön bilgi	pêşzanîn
denizyolu	rêderya
yolaçıcı	rêveker
bağ tarlası	rêzom
yastık yüzü	rûbalîf
gümüş kaplama	rûzîv
monogam	tekjinî
birler	yekan
tek gözlü	yekçav
tek ses	yekdeng
gezimcilik	aristotelestî
belçikalı	belçîkî
cb	cb
çeçence	çaçankî
kara çarşamba	çarşema reş
lut gölü	deryaya mirî
eski dünya	dinyaya kevn
gd	gd
nasyonal sosyalizm	hitlerîtî
lutherci	lûtherî
luthercilik	lûtherî
makyavelcilik	makyaveltî
makyavelizm	makyaveltî
nogayca	nogaykî
pt	pt
silopi	sîlopî
sn	sn
demir kazık	stêrka qurixê
tibetçe	tîbetkî
ulahça	ûlakî
pertek	pêrtag
enemek	xesîn
tek tek	kit kit
kutsal üçleme	tirênitî
tam fırsatı	xweşkeys
hükümdar asası	sewlecan
dağdağan	tehwî
aerodinamik	aerodînamîk
ateş düşürücü	agirbir
teskin olmak	amoş bûn
sakinleştirici	amoşker
teskin edici	amoşker
ampermetre	amperpîv
amperölçer	amperpîv
point	beralîkirin
yönlendirme	beralîkirin
yönlendirmek	beralîkirin
yunak	beraşo
karşı saldırı	berêrîş
berhayat	berheyat
hesaba katılmak	berisîn
tozkoparan	berliba
takarrüp	berpêbûn
işlerlik	berpêtî
sokulgan	bervekir
kuzum	berxê
kuzum!	berxê
evlilik çağı	berzewac
borsacı	borsevan
fasla fasla	cih cih
detektör	dedektor
ahlak dışı	derexlaq
gayriakli	derhişî
bilinçdışı	derhişî
gayri şahsî	derkesanî
dindışı	derolî
elinden iyi iş gelmek	destemel bûn
güleğen	devjihev
ağzı açık	devjihev
galvanometre	galvanopîv
isteğe bağlı	ihtiyarî
ihtiyari	ihtiyarî
mürdüm eriği	încasa reşreşk
yerli yerinde	li cihê
lehimlenme	lihêmbûn
lehimleme	lihêmkirin
haksızlık etmek	neayîlî kirin
apayrı	nejihev
otoman	otomasyon
gerisin geriye gelmek	paşpaşkî hatin
gerisin geri gelmek	paşpaşkî hatin
plastik	plastîk
yolunu gözlemek	rêpan kirin
muntazır etmek	rêpanî kirin
talimat vermek	rêwerz dan
teksir etmek	teksîr kirin
yüzer gezer	amfîbî
damping	an jî
deniz ayısı	an jî
ağrı kesimi	analjezî
analjezi	analjezî
acı yitimi	analjezî
duyum yetimi	anestezî
antijen	antîjen
apraksi	apraksî
işlev yitimi	apraksî
ayyaşlık	araqxurî
bekrilik	araqxurî
içkicilik	araqxurî
teçhiz	arastek
donatı	arastek
özek ağacı	arêx
arşın	arşin
ayran artığı	avdeşo
duvar saati	bansaet
yapılış	bastûr
karayel	bayê reş
atlangıç	bazdok
haksız yere	beleheq
öncesiz	bêna
uçaksavar	berbalafir
kadın tumanı	berşo
atık su	berşo
adına	binavê
ortalama olarak	binavekî
cehennem ol!	bicehime
geçirimlilik	bihurbarî
sana	bo te
ürpertmek	cefilandin
cacık otu	cûng
gözleri uykulu	çavlixew
vakitli vakitsiz	çawalêhato
herhangi	çawalêhato
sırasına göre	çawalêhato
karanlığa kurşun sıkmak	çawalêhato
gözü açılmak	çeliqîn
orta direk	çîna navîn
çarpık bacaklı	çîqxwar
aysberg	çiyayê qeşayê
arter	damara xwînber
şiryan	damara xwînber
zıp zıp zıplamak	dan çindikan
akasya	darcêwî
bakım yurdu	darulaceze
alabalık	deqsor
geçit töreni	derbasbûna fermî
turna gagası	derzîlok
desigram	desîgram
iç burkucu	dilxelînek
inakçılık	dogmaperestî
ablukayı kaldırmak	dora
elektrolit	elektrolît
akıtmalı	enîbeş
ayyaş	ereqvexwer
bekri	ereqvexwer
oyma kalemi	eskene
farbala	firfir
racon	fiyaqe
ziyadeleşmek	fizûnîn
kaymak taşı	gac
kireç taşı	gac
ibadullah	gelek zehf
sefih	gewzeger
tuzlu balgam	gezne
madımak	giyagirêçk
ağı otu	giyajehrik
baldıran	giyajehrk
fare kulağı	guhmişk
gündüz sefası	gulborî
kahkaha çiçeği	gulborî
boru çiçeği	gulborî
pire otu	guleşêxan
dağ doruğu	gumpil
olmak üzere	hema bêje
cümle âlem	hemû kes
her şey	her tişt
her biri	her yek
esirgeyiş	hêvişîn
sıyanet	hêvişîn
kayırılmak	hêvişîn
monitör	hêvojer
eş kenar	hevsan
müfekkire	hêza fîkirînê
lime lime olmuş	hincirî
hipertansiyon	hîpertansiyon
yuhalamak	hiryohiryo kirin
mutaassıp	hişkbawer
zaman belirteci	hokera demkî
zaman zarfı	hokera demkî
ıskonto	îskonto
ıskonto etmek	îskonto kirin
ispirto	îspîrto
atfetmek	îstinad kirin
rölativite	îzafet
görelik	îzafet
izolatör	îzolator
yalıtıcı	îzolator
yalıtkan	îzolator
yönden	ji hêla
itibarıyla	ji hêla
naşi	ji rûyê
kadınvari	jinankî
çayır kuşu	kakol
iş buyuran	karferma
iş beceren	karguzar
çeven otu	kefkefok
helvacı kökü	kefkefok
müsekkin	kemijîner
iriyarı	kerkere
çakalboğan	kerxenîq
pisi pisi otu	kerxenîq
yelkenli gemi	keştiya bawanî
belaya düşmek	ketin belayê
belaya çatmak	ketin belayê
sınava girmek	ketin îmtihanê
değerli taş	kevirê giranbuha
deve hörgücü	kopare
kum başı	kevîşen
güvercinlik	kevotxane
okumamış	kewden
öz geçmiş	kurtejiyan
kangren	lareş
kafalılık	lasarî
can atmak	lavayî kirin
yama gibi durmak	lê nehatin
bir yandan	li aliyekî
yanı başında	li berê
yönetim kurulu	lijneya kargêriyê
sardalye	masîwurk
kavanoz	merkane
gelinotu	merze
güvey feneri	merze
keklik otu	merzekew
balsam	mestekî
su tavuğu	mirîşka avî
kalinis	mirîşka avî
su çuluğu	mirîşka avî
narkozitör	narkozvan
tin tin	nermenerm
püfür püfür	nermenerm
çalışmamak	neşixulîn
stok	nijîn
yesyeni	nipnû
apacı	nipnû
dürtüştürmek	nixçenixç kirin
ispirtoluk	ocaxa îspîrtoyê
paldım	paldûm
temettü hissesi	para qezencê
kerih	pelos
gözün saydam tabakası	perdeya çav
diyafram	perdeya navbirê
kümes hayvanı	permalî
evvel allah	pêştir
donma derecesi	pileya cemidînê
karınca aslanı	pilopilo
yemlik otu	pinc
yemlikotu	pinc
tartaklama	pincirandin
tartaklamak	pincirandin
tartaklayış	pincirandin
kör ebe	pîtros
körebe oyunu	pîtros
çiseleme	pizrûk
poliçe	polîçe
mısır püskülü	porik
cin saçı	porik
boynuz vuruşu	poş
tos	poş
priz	prîz
boraks	pûrank
borat	pûrank
umursama	pûtepêdan
ekin biti	qalonçe
buğday biti	qalonçe
bitki sapı	qarot
harnup	qarqazî
kavut	qawit
baba hindi	qelemon
eti doğramak	qesifandin
su kabağı	qewnik
tırkaz	qilqilk
ağaçtan yapılan uzunca kilit	qilqilk
çarpıntılı	qilqilokî
kındıra	qur
vıraklamak	qûrîn
kurbağa sesi çıkartmak	qûrîn
radyatör	radyator
laden	rastik
döşemecilik	rayêxerî
gedik açmak	rê vekirin
kapı yapmak	rê vekirin
yolu açmak	rê vekirin
akındırık	reçîne
solmaz	rengnedêr
rakkase	reqase
at yuları	rişme
kayış tokası	rizbe
yüksek değerli	rûmetbilind
köse buğday	rûto
ıslah olmak	selihîn
sabahleyin	serê sibehê
alessabah	serê sibehê
sabah vakti	serê sibehê
boyun eğdirmek	serî tewandin
asbaşkan	serokê duyemîn
alşimist	sîmyager
loş	sinahî
ak ciğer	sîpelk
ipilti	sirwe
kırmızımtırak	soreve
kan kırmızısı	sorgevez
yıldız çiçeği	stêregul
dalya	stêregul
saray patı	stêregul
yıldız otu	stêregul
bol paça	şamoşewlo
kılıksız	şamoşewlo
rükü	şamoşewlo
rüküş	şamoşewlo
şaşmaz	şaşnebar
raspa	şatûf
tiftik tarağı	şehmû
müsamere	şevar
gece sefası	şevgeş
yamyaş	şilopilo
şırınga etmek	şiringe kirin
şiş kebab	şîşkebab
çarpım tablosu	tabloya carandinê
veca	tajan
buruntu	tajan
sinsice yaklaşma	teletel
külleme	tenartin
küllemek	tenartin
karbon kâğıdı	tenîper
tatminsizlik	têrnebûnî
tesisat	tesîsat
teşkil etmek	teşkil kirin
bir düziye	timûdaîm
güneş ışını	tîrêja rojê
kuzu kulağı	tirşoya nalik
toksin	toksîn
salgı bezi	toşpî
güzel avrat otu	tûlezer
ahududu	tûşêmî
frambuaz	tûşêmî
mezamir	tûtûk
esbap	ûşt
kur’a	vijag
kura	vijag
yazı tura	vijag
davranışları kötü	virtoqî
vız vız	vizeviz
difteri hastalığı	wenaq
ihtiyatlı olmak	wurya bûn
haliç	xalîç
detektif	xefiye
öküz gibi bakmak	xêreve bûn
hırka	xirqe
güzel yaradılışlı	xulqşîrîn
çivit rengi	xumşîn
öz yaşam öyküsü	xwejînenîgarî
nümayişçi	xwepêşander
nümayişkâr	xwepêşander
tek cins	yekcureyî
kalın bağırsak	zebloq
nezih	exlaqpak
kör talih	felekreşî
yakınma	fîrazvn
galvanizlemek	galvanîz kirin
kumlama	gircomîkirin
fiyaka satmak	fiyaqe kirin
eşlemeli	hevedemî
senkronik	hevedemî
eş zamanlılık	hevedemîbûn
senkronizasyon	hevedemîbûn
kıvır kıvır	xingal xingalî
kıvrım kıvrım	xingal xingalî
lüle lüle olmak	xingalxingalî bûn
kurşun dökmek	zirîç helandin
trikotaj	hevrês
trikotaj yapmak	hevrês kirin
trikotajcı	hevrêsker
trikotajcılık	hevrêskerî
karikatürleştirmek	karîkature kirin
meymenetsizlik	bêmeymenetî
vardiyacı	berdêlvanî
kulağına küpe etmek	kirin guhark û kirin guhê xwe
vagadugu	ouagadougou
mecal kalmamak	star tê de neman
öne atılmak	xwe avetin pêş
bidât	bîdat
bid'at	bîdat
ok işareti	tîrnîşan
laf dinlemek	bi ya (yekî) kirin
söz dinlemek	bi ya (yekî) kirin
söz tutmak	bi ya (yekî) kirin
söze yatmak	bi ya (yekî) kirin
sözünü dinlemek	bi ya (yekî) kirin
sözünü tutmak	bi ya (yekî) kirin
yakınan	miştekî
sızlanan	miştekî
dersim	dêrsim
vizon	vîzon
şimdiden sonra	ji niha pê ve
abajur	abajûr
abajurcu	abajûrfiroş
nebraskalı	nebraskayî
falan filân	filan û bêvan
öteki beriki	filan û bêvan
falan festekiz	filan û bêvan
saftirik	sawêlke
dili geçmiş zaman	raboriya sade
bilinen geçmiş zaman	raboriya sade
görülen geçmiş zaman	raboriya sade
belirli geçmiş zaman	raboriya sade
belirli geçmiş	raboriya sade
tatlı söz yılanı deliğinden çıkarır	bi axiftina xweş dê marî ji kunê îniye der
akıntıya kürek çekmek	bûn paleyê pûş
pireyi nallamak	bûn paleyê pûş
abesle iştigal etmek	bûn paleyê pûş
deliksiz demire sürtünmek	bûn paleyê pûş
allah aratmasın	xwedê nîşan nede
allah göstermesin	xwedê nîşan nede
allah utandırmasın	xwedê nede şermê
bıyığı balta kesmez olmak	şûr simbêlê (yekî) nebirîn
yeri göğü ben yarattım demek	şûr simbêlê (yekî) nebirîn
keyfine diyecek yok	şûr simbêlê (yekî) nebirîn
ayak uydurmak	çûn ser kurm û kirasê (yekî)
üç buçuk atmak	qûna (yekî) çarderî avêtin
götü tutuşmak	qûna (yekî) çarderî avêtin
yusufçuk atmak	qûna (yekî) çarderî avêtin
mangan	mangan
mononükleoz	mononukleoz
öpüşme hastalığı	mononukleoz
takınmak	bi xwe ve kirin
altına etmek	bi xwe ve kirin
ayağına geçirmek	bi xwe ve kirin
paçaları tutuşmak	bi xwe ve kirin
takıp takıştırmak	bi xwe ve kirin
yobazlık	bawerhişkî
çivitsiz	bêçivîd
hırkasız	bêxirqe
mütenekkiren	bi xwenenaskirî
sümkürtmek	dan fişkirin
çıkış kapısı	deriyê derketinê
hırçınlık etmek	dexezarî kirin
yöneltilmek	hatin berpêkirin
hokkabazlık	hoqebazî
kangren olmak	lareşî bûn
asenkron	nehevedemî
eşlemesiz	nehevedemî
iletici	veguhêzer
aktarmacı	veguhêzkar
cari açık	hilewesan
kınamayın	bêlome
paspal	alote
güç sahibi olma	avil
kendi geçimini sağlama konumuna gelme	avil
pazarlık	behşere
bir şeyin alım satımı için pazarlık hali	behşere
süresi	behşere
bir kadının ilk doğan çocuğu	berê xurîniyê
koyun ve benzerlerinin ilk yavruları	berê xurîniyê
eğitimsiz ve rastgele yetişen kimseler	berenî
kar beyazlığı	berfespî
karbeyaz	berfespî
derin uykuda	bêxût bûn
deliksiz uykuda olmak	bêxût bûn
tıp : komaya girmek	bêxût ketin
(mecazî) derin uykuya dalmak	bêxût ketin
deliksiz uykuya girmek	bêxût ketin
uzun ömürlü insan ve diğer canlılar için söylenir.	bi gur re çûn qiyametê
dünyaya kazık çakmak	bi gur re çûn qiyametê
bir işi aralıksız olarak yapmak ya da böyle bir durumda bulunmak	çaleçal kirin
vurdumduymazlıkta bulunmak	çav pan kirin
işin bedelini bir başkasına yüklemek	giranî li yekî bûn
birinin sırtında geçinmek	giranî li yekî bûn
1. tıp	hemerî kirin
birilerinî sözü edilen mide hasalığına düşürmek	hemerî kirin
dy	hemerî kirin
bir kimseyi bıktırmak	hemerî kirin
genellikle bir kadını erkekle evlendirmek	lê mar kirin
laklak etmek	lebelebe kirin
ağız dalaşı yapmak	lebelebe kirin
boşuna bir harekette bulunmak	li netûyê çûn
bedensel zayıflık ve ruhsal alınganlıkları olan kimseler	mîna giyayê berojê
bazı zayıf yapılı ve güçsüz evcil hayvanlar için	mîna giyayê berojê
(yöresel türkçe) : velvel deresi	newala welwelê
sudan hoşlanmayan	pisîka bejî
yıkanmayı sevmeyen	pisîka bejî
kötü bir durumda kalmak	pîst lê teng bûn
deriye kül serpmek	post xwelî kirin
nutku tutulmak	qal û bal kirin
anlaşılmaz bir şekilde konuşmak	qal û bal kirin
bir şey için bir kimseya tatlı dil dökmek	qaxik ji yekî re ba kirin
yağ çekmek	qaxik ji yekî re ba kirin
birini kötülemek	qeremet lê kirin
çadır ve evlerde çuval ve yatak yeri	qûlîn
korkutma amacıyla yapılan abartı	rewet
abartılı olmak	rewet bûn
korku verecek derecede abartılı olmak	rewet bûn
bir şeyi korku verecek derecede abartmak	rewet kirin
(tane	rişandin
tohum) ekmek	rişandin
(yemek için)	sermistî
karşılığını ödemeden	suxre li yekî kirin
gönülsüz birilerine iş yaptırmak	suxre li yekî kirin
şikayet etmek	şewke kirin
çabuk aldanmak	xav çûn
anlık uykuya dalmak	xav çûn
mecaz : çabuk unutmak	xav çûn
tıka basa yemek	zik li xwe meşk kirin
su vb içmek	zik li xwe meşk kirin
karın şişirmek	zik li xwe meşk kirin
adem ile havva	adem û hewa
adem'le havva	adem û hewa
adem ve havva	adem û hewa
açık taşıt	amyara servekirî
üstü açık araba	amyara servekirî
ilham gelmek	best lê rabûn
üstecilik	bi ser de
üzerine gelmek	bi ser de hatin
başta gelmek	bi ser de hatin
ruzu şeb	bi şev û roj
kardan adam	bûka berfê
abdest bozmak	destnimêj şikandin
deli divane	dîn û har
çıldırmış	dîn û har
yazıktır	heyf e
ifade almak	îfadeya yekî girtin
erkek ruhlu	kelejin
aybaşı olmak	ketin kirasan
adet görmek	ketin kirasan
gününü görmek	ketin kirasan
ciyaklama	kewtekewt
kirizma	kilêb
oyulganmak	kurisîn
aile evi	malbavan
büyük yuvarlak sepet	melkeb
kutsal yağ sürmek	mesh kirin
meshetmek	mesh kirin
at çalındıktan sonra ahır kapısını kapamak	paş baranê ga cil kirin
birlikte yaşam	pêkvejiyan
canı sıkkın olmak	posîde
taş yığmak	qûç kirin
ravent	ribês
ışkın	ribês
uşkun	ribês
pürüzlerini gidermek	rûbirtin
ölüm meleği	ruhistîn
yaz kış	salewext
yazlı kışlı	salewext
yıl on iki ay	salewext
gömgök	şipşîn
masmavi	şipşîn
mosmor	şipşîn
evrat	wird
virt	wird
yas çadırı	xeft
süpürge çalısı	xeleng
kendisinden emin	xwebawer
ağnatmak	vegevizandin
sen bilirsin	tu dizanî
dermanı kesilmek	ruh û rewa tê de neman
dermansız kesilmek	ruh û rewa tê de neman
taş yontma aracı	kiran
cundullah	cûndûllah
allah'ın askeri	cûndûllah
magnezyum	magnezyûm
niyobyum	niyobyûm
evelik	tirşo
kuzukulağı	tirşo
ithaf	îthaf
çapak gözlü	çavqemûşk
gâvur eziyeti	kafiristanî
karınca belli	navqendîl
başmürettip	serektîprêz
kılıç balığı	serşûrmasî
sermürettip	sertîprêz
başdizgici	sertîprêz
mosmor kesilmek	şipşînî bûn
dolgunlaşmak	tixiskî bûn
dolgunlaşma	tixiskîbûn
sığ su	pehnav
eko	deng bilind kirin
ağzından çıt çıkmamak	ne gotin him ne gotin gum
tek kelime etmemek	ne gotin him ne gotin gum
çıt çıkarmamak	ne gotin him ne gotin gum
gelen giden	hatî-çûyî
faş	azlû
deşifre olmak	azlû bûn
el altında	berlep
kara tavuk	mirîşka reş
humuslu toprak	axa gelêşî
hadi	hadî
nurettin	nûreddîn
nureddin	nûreddîn
adaptör	guncêner
iğne ucu kadar	bi qasî serê derziyê
arpa boyu gitmek	bi qasî serê derziyê
bir arpa boyu	bi qasî serê derziyê
suya götürür susuz getirir	(filan kes mirovan) tî dibe ser avê, tî tîne
suya götürüp susuz getirir	(filan kes mirovan) tî dibe ser avê, tî tîne
akıllar pazara çıkmış her kes kendi aklını beğenmiş	aqil derxistine firotanê, herkesî yê xwe kirîye
kız evi naz evi	bavê keça siltan e
kestane kabuğundan çıkmış kabuğunu beğenmemiş	berû ji darê ketiye, dar nenasiye
ağzına bir zeytin verir altına tulum tutar	ceh didê yekî, genim jê distîne
ağzına bir zeytin verir, altına tulum tutar	ceh didê yekî, genim jê distîne
al kiraz üstüne kar yağmış	çelê ereba firikê noka
karıncanın bile kanı var	çûk çûke gava avê vedixwê, berjor li xwedê dinêrê
her ot kendi kökü üzerine yeşerir	dar li ser koka xwe şîn tê
ayasofya'da dilenir sultanahmet'te zekât verir	diçe parsê, dide xêra harsê
kedinin hacce gitmesine benzer	diza ji dizan dizî, erd û ezman lerizîn
huyu huyuna suyu suyuna	du serî ne wek hevbin, narin ser balgîkî
huyu huyuna suyu suyuna uygun	du serî ne wek hevbin, narin ser balgîkî
boyu boyuna, huyu huyuna	du serî ne wek hevbin, narin ser balgîkî
minareyi çalan kılıfını hazırlar	ê dîza çêdikê, çempil jî pêve dikê
kazı koz anlamak	em dibêjin nêre, ew dibêje bidoşe
dam üsütünde saksağan vur beline kazmayı	ez çi dibêjim, bilûra min çi lêdixe
bir ileri iki adım geri	gavek li pêş, yek li paş
acı haber tez ulaşır	gotina reş zû belav dibe
kara haber tez duyulur	gotina reş zû belav dibe
kötü haber tez duyulur	gotina reş zû belav dibe
demir tavında dövülür	hesin hê germe, bikute
yürük at yemini artırır	hespê çê êmê xwe zêde dike
donyağı ile bulgur pilavı	ji bêçarî, mirov goştê mirîşka dixwê
aş taşınca kepçeye paha olmaz	ji bêçarî, mirov goştê mirîşka dixwê
nefsine mağlup olmak	ji bo nefsê, ket hepsê
denizden geçip karşı kıyıda boğulmak	ji dengizê derbas dibe, di newalê de difetise
ji mehan, ji salan carekê ( yan: şevekê ) mêvanê xalan	ji mehan, ji salan carekê mêvanê xalan
bi meh û salan, carkê mêvanê xalan	ji mehan, ji salan carekê mêvanê xalan
ji mehan ji salan mirov carekê dibe mêvanê xalan	ji mehan, ji salan carekê mêvanê xalan
ji mehan, ji salan şevekê mêvanê xalan	ji mehan, ji salan carekê mêvanê xalan
kısmetinde ne varsa kaşığında o çıkar	ji xezalê bezatir nîne, ji nanê xwe pêve naxwe
ak koyunun kara kuzusu da olur	ji xweliya welî, ji weliya xwelî
iki yeminden bir emir	kirin, ji gotinê çêtir e
dağ dağ üstüne olur, ev ev üstüne olmaz	mal li ser malê nabe
sahibi razı olur tellal razı olmaz	malê axê diçe, canê xulam dêşe
akıl kumkuması	mamê mama aqilê fama
çiğ süt emmiş	mirov şîrê xav vexwariye
ayağı cıvık	nan û xuyê xwe li kabê ye
ahmaka yüz, abdala söz vermeye gelmez	ne bide dînan, ne jî bistîne
ne şam'ın şekeri ne arab'ın zekeri	ne şekirê şamê, ne rûnê helebê
ne şamının şekeri ne arabın zekeri	ne şekirê şamê, ne rûnê helebê
altın anahtar her kapıyı açar	pere qiloçê mêran in
elden vefa, zehirden şifa	rih dibe post, dijmin nabe dost
güneş balçıkla sıvanmaz	roj bi bêjinkê nayê veşartin
bıçak yarası onulur, dil yarası onulmaz	sax dibe şûna xençera, lê sax nabe şûna xebera
elbet bir gün ölürüz	sed salî li dinê bî, rojekê mêvanê gorê bî
kağnı gibi gitmek	tu dibê qey pêl hêka dikê
abı hayat içmiş	tu mûyê xwe bi ciwanan re diqusînî
bir deli kuyuya taş atmış kırk akıllı çıkaramamış	xerakirin rehet e, avakirin zehmet e
ekmeğini it yer yakasını bit	xwediyê xiyarê çilmisî, ne dixwe ne dide kesî
ne yer ne yedirir	xwediyê xiyarê çilmisî, ne dixwe ne dide kesî
deveci ile görüşen kapısını yüksek açmalı	yê deve xwedî bike, divê serdora ( yan: deriyê ) xwe bilind bike
bulgurluya gelin mi gidecek?	agir ji dêv dibarê
az olsun öz olsun	bila mirov zirav û dirêj be, ne kin û stûr be
hem kaçar hem davul çalar	bûk jî ji me ye, tûtik jî ji me ye
hem kel hem fodul	bûk jî ji me ye, tûtik jî ji me ye
oyuncak olmak	bûye benkê dû hebanê
hem nalına hem mıhına vurmak	carekê li nêl dixe, û carekê li mêx dixe
boğaz durmaz	çare li her tiştî dibê, li dil û mirinê nabê
ecele çare bulunmaz	çare li her tiştî dibê, li dil û mirinê nabê
olacakla öleceğe çare yok	çare li her tiştî dibê, li dil û mirinê nabê
damla damla göl olur	çem ji kaniyan çêdibe
kör değneğini beller gibi	dar û kulavê min, rehme li dê û bavê min
soğan yemedim ki ağzım koksun	devê ku pîvazê nexwe, bên jê nayê
deveye boynun eğri demişler nerem doğru ki demiş	dibê deve çima stûyê te xwar e, dibê çiyê min li kar e
karaca kuruca gönlüme görece	dibê te dinya çawa dî, dibê li gorî dilê xwe
ismi var cismi yok	dil dixwazê taqet tune ye
aç ayı oynamaz	don nekî çirê çire rohnî nade
kazan kaynamayan yerde maymun oynamaz	don nekî çirê çire rohnî nade
vardık kebap kokusuna gördük ki eşek dağlıyorlar	em li pey bihna kebaba çûn, em rastî daxdana kera hatin
utangaçlık erkeğe hayasızlık kadına yakışmaz	fedokî li mêran nayê, kenokî li jinan nayê
her şeyin yenisi, dostun eskisi	filakî bi xêr, ji birakî bê xêr çêtir e
kendi âleminde olmak	filan kes vingving a mêşê di kundir de ye
at ölür meydan kalır yiğit ölür şanı kalır	ga dimirê çerm dimînê, merî dimirê nav dimînê
ben gidemem bendere alışmışım kaba döşek mindere	gayê zexel e, timî li mexel e
otu çek köküne bak	giya li ser kokê xwe şîn dibê
soydur çeker boktur kokar	giya li ser kokê xwe şîn dibê
evin malı değermsizdir	giyayî hewşê tehl e
kimse kendi memleketinde peygamber olmaz	giyayî hewşê tehl e
dost ağlatır, düşman güldürür	gotina rast bi mirov ne xwaş tê
şaşıydı arı da soktu kör oldu	gul ew gul bû, baran jî lê hat şil bû
üzüm üzüme baka baka kararır	gul li gulê dinêre, sor dibe
kuzu postuna bürünmek	gurê di bin kevilê mî yê de ye
ayının kırk türküsü var hepsi de ahlat üstüne	heft çîrokên hirçê hene her heft jî li ser hermiyê ne
temcit pilavı gibi	heft çîrokên hirçê hene her heft jî li ser hermiyê ne
şaka iken kaka olmak	henek dibin genek
herkesin gönlünde bir aslan yatar	her kes li mala xwe qeral e
sabah ola hayır ola	her sebrekê xêrek vê re ye
son pişmanlık fayda vermez	heta aqilê paşî hat, ê pêşî çû
mescit yapılmadan dilenciler dizildi	heta genim firîk e, mele şirîk e
isa'yı küstürdü muhammed'i memnun edemedi	him ji dêrê bû him ji mizgeftê
elim hamur karnım aç	ji xwe re masîgir e, ji xelkêre kûsîgire
tıngır elek tıngır tas	ji xwe re masîgir e, ji xelkêre kûsîgire
yeldir yelek yeldir saç	ji xwe re masîgir e, ji xelkêre kûsîgire
yuvayı yapan dişi kuştur	jin gol e, mêr çem e
armutun iyisini ayılar yer	jinê rind taca serî mêrî xwe ye
el mi yaman bey mi yaman?	ka kî berx e kî beran e
kar zararın kardeşidir	kar û zirar bira ne
evdeki hesap çarşıya uymamak	karê mal û sûkê li hev derneket
kimse yoğurdum ekşi demez	kes nabêjê dewî min tirş e
edepsizden ırzını satın al	kevilê bênamûsan fireh e
sakla samanı gelir zamanı	kevrê havînê çek bin qulînê
her itin dilini bilmek	kî xal e, tu heval e
her sakala bir tarak	kî xal e, tu heval e
hangi taşı kaldırsan altında o çıkar	kijan kevrî hilîne, ew di bin da ye
hangi taşı kaldırsan, altından çıkar	kijan kevrî hilîne, ew di bin da ye
züğürt teselisi	koro li vir be, min ji te çêtir nedî, ezê li korê xwe vegerim
aş pişti bayram geçti	ku kela şorbê çû buha yê heskê pera nake
ay bacayı aştı	ku kela şorbê çû buha yê heskê pera nake
geçti bülbül geçti gül	ku kela şorbê çû buha yê heskê pera nake
ali'nin küllahını veli'ye veli'nin küllahını ali'ye giydirmek	kumî elo didê serî welo
önce can sonra canan	lêv ji diranan pêşdetir in
kaz gelen yerden tavuk esirgememek	li ku mefa ye, li wir bav û bira ye
kuder xwar e, ew der war e	li kuderê dare, ew der war e
li kuder av û dare, ew der war e	li kuderê dare, ew der war e
li kuderê dar e, ew der war e	li kuderê dare, ew der war e
ayranı yok içmeğe atla gider biçmeğe	li malê tune nan û jajî xwedî dike tûle û tajî
eli işte gözü oynaşta	ling li qeydê, çav li seydê
para dediğin nedir ki elin kiridir	malê dinyê gemara destî canik û camêra ye
yan yattı çamura battı	manê tirekan ardê cehîn e
kasap et derdinde koyun can derdinde	mêra mêr dikuştin, ceboriya hûr dişûştin
roja teng	mêrê çê di roja teng de fêm dibe
demirden korkan trene binmez	merî ji guran bitirse, nikare pêz xwedî ke
hazır evin has kadını	min bûk anî bi lez û bez, sivika malê dîsa mam ez
kaçan balık büyük olur	mirî dimre qûnzêrî dibe
kör ölür badem gözlü olur, kel ölür sırma saçlı olur	mirî dimre qûnzêrî dibe
kel ölür sırma saçlı olur	mirî dimre qûnzêrî dibe
ecel geldi cihana, baş ağrısı bahane	mirin hespê boz e li ber derê hemo kesa ye
aç tavuk kendini arpa ambarında sanır	mirîşk birçî dibin, gêris di xewnê de dibînin
satılık ziftin olsun, selanikten kel gelir	morîka qul li erdê namînê
bitli baklanın da kör alıcısı olur	morîka qul li erdê namînê
delikli boncuk yerde kalmaz	morîka qul li erdê namînê
er lokması er kursağında kalmaz	nanê mêran li ser mêran deyn e
köpekle yatan pire ile kalkar	ne di dîna ne, ne jî qûna xwe bide dîna
ne ölüye ağlar ne diriye güler	ne dikene ku em vê re bikenin, ne digrî ku em vê re bigrîn
çiğ yemedim ki karnım ağrısın	ne li newalên kûr razê, ne xewnên xirap bibîne
dedesi koruk yer, torunun dişi kamaşır	neke bi kesan, wê bê serê te, ku neyê serê te, wê bê serê pisê pisan
baba erik yer, oğlunun dişi kamışır	neke bi kesan, wê bê serê te, ku neyê serê te, wê bê serê pisê pisan
baba koruk yer, oğlunun dişi kamışır	neke bi kesan, wê bê serê te, ku neyê serê te, wê bê serê pisê pisan
etli bulma dünyası	neke bi kesan, wê bê serê te, ku neyê serê te, wê bê serê pisê pisan
dede koruk yer torununun dişleri kamaşır	neke bi kesan, wê bê serê te, ku neyê serê te, wê bê serê pisê pisan
etle tırnak gibi olmak	nênûk û goşt ji hev naqetin
etle tırnak gibi	nênûk û goşt ji hev naqetin
yuvarlanan taş yosun tutmaz	palê xerap das û tarê diguhêre
köpeksiz köye kurt iner	pezê bê şivan gur dixwe
eğri oturup doğru konuşmak	rasto duristo, xwearo şikesto
mızrak çuvala girmez	rim di tûr hilnayê
it ürür kervan yürür	seh direye kerwan dibihore
kadı kızı kadire geldi çıktı sedire	siltik hatin bûn siltan, pêlik danîn çûn asîman
elin ipiyle kuyuya inilmez	sîwarê hespê xelkê, her peya ye
yoksul gözünden medet ummak	şêwrê çûka li ser garisî me ye
bıçak kınını kesmez	şûr qinî xwe nabirê
kılıç kınını kesmez	şûr qinî xwe nabirê
patırtıya pabuç bırakmamak	tirsa gur ji baranê hebûya, wê ji xwe re kulavek çêkira
gürültüye pabuç bırakmamak	tirsa gur ji baranê hebûya, wê ji xwe re kulavek çêkira
serçeden korkan darı ekmez	tirsa gur ji baranê hebûya, wê ji xwe re kulavek çêkira
suçlu suçunu bilir	xudiyê fisê bi xwe dihesê
allah müstahakkını verir	xwedê li çê dinêre, û berfê lê dibarînê
kimi köprü bulamaz geçmeye kimi su bulamaz içmeye	xwedê noka dide kalên vê diran
at var, meydan yok	xwedê noka dide kalên vê diran
birlikten güç doğar	yek yek e dudu kulfet e
tok acın halinden anlamaz	zikî têr haj zikî birçî tune ye
son kullanma tarihi geçmek	êkspayir bûn
kapılanmak	keftin karî
taş değirmen	gêrse
ısı almaz	adiyabatîk
çapıtı gümüşlü	malhebîn
mal canlısı	malhebîn
tavsiye mektubu	wesekname
subjektif	subjektîv
üste	di ser re
iraklı	iraqî
müdahale etmek	dest tê werdan
meşe ağacı	darberû
kulak zarı	perdeya guh
kırmızı et	goştê sor
tağut	taxût
yardımına koşmak	di hewara (yekî) hatin
ankesör	ankesor
participation	iltihaq
attendance	iltihaq
tekvando	taekwondo
feragatname	ferexetname
sorumluluk reddi	ferexetname
komünal	komînal
hidrokarbon	hîdrokarbon
ne var ne yok	çi heye çi nîne
spatula	hevstîv
sifon	sîfon
suluboya	avreng
nevzat	newzad
yeşil soğan	kelûş
hafifçe yüksek	navnêr
seyrek dişli	didanfir
dişleri seyrek olan kimse	didanfir
kar atmaya yarayan ev aleti	berfing
efrasiyab	efrasiyab
kleptokrasi	kleptokrasî
plütokrasi	plutokrasî
paçasını kaptırmak	ketin destî
paçayı kaptırmak	ketin destî
gastronomi	gastronomî
kanserojen	kanserojen
lantan	lantan
kızıl bayrak	alaya sor
protein	protîn
aklıma sığdırmak	aqilê (yekî) birîn
allahtan	baş bû ku
bereket ki	baş bû ku
isabet ki	baş bû ku
ağzı dili yok	bê zar û ziman
ağzı var dili yok	bê zar û ziman
arode arode gerîn	bêkar û bêemel bûn
namus belâsı	belaya namûsê
berê jî ev rêx bû	berê jî ev rêx bû
kısmetini bağlamak	bextê (yekî) girê dan
kötü gözle bakmak	bi çavê xirab lê nihêrîn
kuş kanadıyla gitmek	bi per û bask bûyîn
iki tek atmak	bi ser xwe ve kirin
upend	bi ser xwe ve kirin
wîkîferheng:xwestin/îngilîzî/peyvên kontrol bibin	bi ser xwe ve kirin
paxav nekirin	bi tiştekî hesab nekirin
bi xêr xweşî biçî, bi xêr û xweşî werî	bi xêr xweşî biçî, bi xêr û xweşî werî
aç açına	bi zikê birçî
aç karnına	bi zikê birçî
güç bela halle	bi zor û bela
bila here serê xwe keviran xe	bila here serê xwe keviran xe
şeytan görsün yüzünü	bila şeytan rûyê wî bibîne
cini tutmak	cin pê girtin
çift çubuk	cot û cobar
uyku kestirmek	çav germ kirin
yüzünü görmemek	çav pê neketin
çavê te xwelî têr bike!	çavê te xwelî têr bike!
ayaklı gazete	defa hewarê
ses gelmek	deng jê hatin
konu komşu	der û cînar
dertleşmek	derdê xwe ji hev re gotin
derde xwe ji hev re gotin	derdê xwe ji hev re gotin
iki satır dertleşmek	derdê xwe ji hev re gotin
destê min di nav rûnê sor de be	destê min di nav rûnê sor de be
dünyadan elini eteğini çekmek	destê xwe ji îş û karan kişandin
elini kana bulamak	destê xwe kirin xwînê
einsagen	di guh de gotin
di nav xwîn û xuhdanê da hîştin	di nav xwîn û xuhdanê da hîştin
çığırından çıkmak	di qûnê de av vexwarin
horoz ötmek	dîk bang dan
el ayak çekilmek	dinya ker bûn
fani dünya	dinyayê fanî
lafı mı olur	ew çi ye
hilaf olmasın	ez şaş nebim
kozu kaybetmek	firsend ji destê xwe berdan
kumda oynamak	firsend ji destê xwe berdan
helal olsun sana	helal be ji te re
helal sana	helal be ji te re
hesap sormak	hesab pirsîn
hesêpke derîye te ye	hesêpke derîye te ye
heye jî ev, tunne jî ev	heye jî ev, tunne jî ev
aya sen doğma ben doğuyorum der	hîva çardeşevî re dibeje tu dernekeve ez derkevim
yerden göğe kadar	ji erdê heta ezmana
iler tutar yeri olmamak	ji hev de hilhilîn
iler tutar yeri yok	ji hev de hilhilîn
sormak ayıp olmasın	ji pirsê eyb tine be
sorması ayıp olmasın	ji pirsê eyb tine be
allah'tan kork!	ji xwedê bitirse
dört üstü, murat üstü	kêf kêfa wê ye
altta kalmak	ketin binî
masrafa girmek	ketin mesrefê
kötü yola düşmek	ketin riya xerab
ortaya düşmek	ketin riya xerab
piyasaya düşmek	ketin riya xerab
sokağa düşmek	ketin riya xerab
kapana düşmek	ketin telê
kapana girmek	ketin telê
kapana kaymak	ketin telê
kapana kısılmak	ketin telê
kapana tutulmak	ketin telê
kîjan kevirê radikî li bin derdikeve	kîjan kevirê radikî li bin derdikeve
her taşın altından çıkmak	kîjan kevirê radikî li bin derdikeve
el oğlu	kurê xelkê
li ser lingan hezar derew kirin	li ser lingan hezar derew kirin
bir ayak üstünde bin yalan söylemek	li ser lingan hezar derew kirin
pamuk ipliğiyle bağlı olmak	li ser mûyek bend mayîn
dilin ucunda olmak	li ser ziman bûn
keyfinin kahyası olmak	mîrê dilê xwe bûn
ölüm allah'ın emri	mirin emrê xwedê ye
denize düşse ağzında balıkla çıkar	morika siûdê pê re ye
götüyle balık yakalamak	morika siûdê pê re ye
ağaca çıksa pabucu yerde kalmamak	morika siûdê pê re ye
katıksız ekmek	nanê tisî
adını bağışlamak	navê te bi xêr
ne got, ne sitand	ne got, ne sitand
eteğindeki taşları dökmek	pêşa xwe daweşandin
kendi derdine düşmek	pey derdê xwe ketin
dar gün	roja teng
süzme yağ	rûnê helandî
bilgi edinmek	salox bi dest xistin
endazesi bozuk	ser girtî bin vekirî
baş ağrıtmak	serî werimandin
ense bağlamak	stû qalind kirin
şekalê xwe bin guhê mirovan dixe	şekalê xwe bin guhê mirovan dixe
divorce	têkiliya xwe jê birîn
ilgisini kesmek	têkiliya xwe jê birîn
ilişkisini kesmek	têkiliya xwe jê birîn
ipi koparmak	têkiliya xwe jê birîn
semtine uğramamak	têkiliya xwe jê birîn
ipleri koparmak	têkiliya xwe jê birîn
alâkayı kesmek	têkiliya xwe jê birîn
havaya savurmak	vir de wê de avêtin
har vurup harman savurmak	vir de wê de avêtin
karınca yuvası gibi kaynamak	wekî lana moriyan qilqilîn
hayrını görmek	xêr jê dîtin
ölüm uykusu	xewa mirinê
gözlerini toprak doyursun	xwedê te têr bike
sağ gözünü sol gözünden kıskanmak	xwîn li ser kelîn
biri vardı geceden biri düştü bacadan	zêdeyî ser kezebê
kambur kambur üstüne	zêdeyî ser kezebê
ölümün soluk rengi	zenga mirinê
er geç	zû dereng
konuşlanma	heşd
ana kraliçe	şaheng
arıbeyi	şaheng
ölümle öç alınmaz	xwîn bi xwînê nayê şûştin
anlayana sivrisinek saz, anlamayana davul zurna az	ji dîna re li defê xe, ji zana re serê xwe bihejê
kör göze çifte gözlük	ker pîr e, hevsarê wî rengîn e
pamuk ipliğine bağlı	li ber hilm û pifekê ye
tilkinin dönüp dolaşıp geleceği yer kürkçü dükkanıdır	lingê pêxwasa li derîyê soldurîya ye
karamürsel sepeti mi sandın?	nenêr li mirûz, binêr li girûz
dilenci çanağı gibi	wek girara qereçîya ye
geberesice!	belqityo
orospu çocuğu	dêqehp
ömrün tükene	emrê te kin be
tuh sana	qeda li te keve
boynu altında kalsın	stûyê te di ber te da bimîne
allahından bulsun	tu belaya xwe di ba xwedê de bibînî
allah belanı versin	xwêdê bela xwe bide te
anasını sattığımın	xwêdê bela xwe bide te
yere batasıca	xwelî li serê te be
cambazhane	canbazxane
köstebek yuvası	çilexane
filika	filûqe
adacık	giravok
mürekkep hokkası	hibirdan
dikkatı dağınık olan	hişbelav
kanguru	kangurû
klişe	klîşe
emeksiz evlât	kurhilî
işgüder	meslehetguzar
yetersiz beslenme	bedxorakî
gıdasızlık	bedxorakî
beslenme bozukluğu	bedxorakî
müzmahil	muzmehil
çökmüş	muzmehil
gıra almak	tirane pê kirin
saraka etmek	tirane pê kirin
tehzil	tirane pê kirin
berat kandili	şeva beraetê
beraat kandili	şeva beraetê
gece boyunca	bi dirêjiya şevê
büyük elçi	navçîn
sefir	navçîn
armudun sapı var üzümün çöpü var demek	goşt bêhestî tune bûn
başı için	li ser xatirê
pir aşkına	li ser xatirê
maaile	bi koçemalî
hunharca	bi xwînxwarî
ölümsüzleşmek	cawîdan bûn
açık gönüllü	dilvekirî
iki çenetli	duqalikî
düzce	dûzekî
karambole gelmek	hatin geremolê
bulaşılmak	hatin têgerandin
bulaştırılmak	hatin têgerandin
bunaltılmak	hatin tengavkirin
kızışık	lêsorbûyî
mahçup olmak	liberxweketin
uyuşum	lihevhatinî
rical	mirovdewlet
devlet adamı	mirovdewlet
hır çıkmak	pevçûn derketin
füzyon	pevkelîn
bilişme	pevnasîn
başülke	serekwelat
bulanıkça	şolikî
öz eleştiri	xwerexne
otokritik	xwerexne
dil tutukluğu	zimangiranî
güzel sanatlar	hunerên spehî
limuzin	lîmûzîn
bezik	nezere
rondelâ	şaîb
yahni	yexnî
teravih	terawîh
teravi	terawîh
ortalamak	bi nîvî kirin
uzaktan yakından	ji dûr ve
alarga	ji dûr ve
uzaktan	ji dûr ve
paralel çizgi	terîb
olimpik	ulumpî
akik	eqîq
eğitim bakanlığı	wezareta perwerdê
cayman adaları	giravên kaymanê
kayman adaları	giravên kaymanê
süveyş kanalı	kanala suweyşê
kıraat	qiraet
tilavet	tîlawet
haklısın	xebera te ye
dediklerine katılıyorum	xebera te ye
haklısın!	xebera te ye
dünya kupası	cama cîhanî
geriletici	paşveber
geriletiri	paşveber
onkoloji	onkolojî
ağlatı	mergaset
tragedya	mergaset
temizleyici	ramalker
omuz omuza	mil bi mil
ciğerli	bicerg
elinden geleni arkasına komamak	destê (yekî) jê re bûn
askeri kamp	artêşgeh
mütaalada bulunmak	mitala kirin
rundice	bruneyî
asal sayılar	hejmara hîmî
alımcı	stîner
dünyaya ait	mondiyal
dünyasal	mondiyal
bütün dünyaya ait	mondiyal
kötü söz söylemek	xeberan gotin
kanadalı	kenedayî
rutin olarak	bi rûtînî
alışkanlık olarak	bi rûtînî
sıradan bir biçimde	bi rûtînî
klişeleşmiş biçimde	bi rûtînî
güneş gözlüğü	rojşikên
mod	mod
iptal edilebilir	betalbar
kurtarılabilir	xelasbar
kurtarılamaz	nexelasbar
adblocker	adblocker
nırç	nirç
bahsetmeme	çêlnekirin
değinmeme	çêlnekirin
temas etmeme	çêlnekirin
nefsi müdafaa	xwe parastin
zum yapmak	zûm kirin
zumlamak	zûm kirin
hesap makinesi	makîneya hesabê
üst kavram	hîpernîm
kapsayıcı terim	hîpernîm
şemsiye tabir	hîpernîm
genel terim	hîpernîm
şemsiye terim	hîpernîm
dünya evine girmek	hevsergîrî kirin
evleniş	hevsergîrî kirin
koltuğa girmek	hevsergîrî kirin
teehhül etmek	hevsergîrî kirin
yuva kurmak	hevsergîrî kirin
entri	entrî
gün gün	roj bi roj
günden güne	roj bi roj
gün be gün	roj bi roj
toz duman	toz û telaz
balice	baliyî
bali dili	baliyî
balili	baliyî
karya	kariya
lakya	lîkya
alevere dalevere	fen û fût
okus pokus	fen û fût
işten güçten kalmak	ji hal ketin
halden düşmek	ji hal ketin
haberalma	salixatî
paramedik	firiyaguzar
zemin hazırlamak	rê xweş kirin
ateşe yanmak	hîlak bûn
dinlenmeksizin	bêyî navbir
eklampsi	zihistanî
beyin göçü	koça hişmendan
insanın bir yerde beklentisi varsa mutlaka bir gün o beklenti gerçekleşecektir	bila çêleka mirov avis be, wê rojekê bizê
tespih ağacı	azaderx
tespih ağacıgiller	azaderx
en yüksek	herî bilind
lenf döğümü	lîmfegirê
dörtnala	orxe
küçük abdest	destnivêja zirav
beni bağışla	li min bibore
meshetme	meshkirin
değişim aracı	awaguhêrgeh
değiş tokuş aracı	awaguhêrgeh
mübadele vasıtası	awaguhêrgeh
kripto para	krîptopare
kripto para birimi	krîptopare
kripto	krîpto
kimyasal enerji	enerjiya kîmyayî
insansız hava aracı	firoka bêmirov
mahsul almak	ber hilanîn
ürün almak	ber hilanîn
masaüstü	sermase
masaüstü ortamı	derdora sermaseyê
yazılım paketi	pakêta nivîsbariyê
fagositosis	hellûşîn
remilcilik	remldarî
borazancılık	borîlêdan
alaska körfezi	kendava alaskayê
istinaf	têhelçûn
pozitivizm	pozîtîvîzm
e rağmen	sererayî
ile beraber	sererayî
ile birlikte	sererayî
olivin	olîvîn
çal	lehf
lunapark	lûnapark
makinalı tüfek	mîtralyoz
mitralyöz	mîtralyoz
işlemeli yastık	nazbalgî
adama	nezirkirin
orta boy kazan	nîvsîtil
olimpiyat	olîmpiyad
kadana	qedene
lıkır lıkır	qulteqult
rafızî	rafizî
rafızilik	rafizîtî
aklı almamak	aqil nebirîn
at arazı bol	berde binê te erd e
bol keseden atmak	berde binê te erd e
altın tutsa bakır olur	çû ber çêm çem miçiqand
zorun ne?	derdê te çi ye
şüphe duymamak	dil lê rûniştin
ha bu gün ha yarın	ha îro ha sibê
kız kaçırmak	keç revandin
senin kanın benimkinden kırmızı mı?	ma xwîna te ji ya wî sortir e
göbeği biriyle kesilmiş olmak	navika wan bi hev re hatîye birîn
kolay gelsin	qewet be
pazar ola!	qewet be
hayırlısı olsun	ser xêrê be
laf çakmak	tehn lê xistin
laf dokundurmak	tehn lê xistin
hatırlamaya çalışmak	anîn bîra xwe
keskin bakış	awirê tûj
gözbağı	çav girê dan
hürmet göstermek	dest girê dan
için için yanmak	di eyarê xwe de şewitîn
kana belenmek	di xwînê de gevizîn
kana boyamak	di xwînê de gevizîn
kana boyanmak	di xwînê de gevizîn
bir an evvel	gavek berê
azıştırmak	li hev sor kirin
karşılıklı kızıştırmak	li hev sor kirin
tavşana kaç tazıya tut demek	li hev sor kirin
ilerisini gerisini hesaplamamak	li pêş û paş mêze nekirin
kıyamam	mala minê
yazık sana	mala minê
akrep gibi	marê kor e
yengeç gibi yan yan gider	marê kor e
günlerden bir gün	rojek ji rojan
kendini sessizliğe vermek	xwe li bêdengiyê danîn
çulu düzmek	xwe nû kirin
kendini yenilemek	xwe nû kirin
speculator	spekulator
spekülatör	spekulator
odyofil	denghez
teşmil	teşmîl
kapsamına	teşmîl
keklik ötüşü	qaqib
potpuri	potpûrî
gösterilen	nîşanbar
işaretlenen	nîşanbar
hartum	xertûm
eyüp	eyûb
devlet olma taraftarı	dewletxwaz
bağımsızlık taraftarı	dewletxwaz
bağımsızlıkçılık	serxwebûnxwazî
dün gece	şivêdî
çok varyantlı	pirvaryant
bilinçsizce	bêşiûrane
şuursuzca	bêşiûrane
bilinçsiz bir şekilde	bêşiûrane
şuursuz bir şekilde	bêşiûrane
anlayışsızca	bêfehmane
parapsikoloji	parapsikolojî
mide yanması	dilekizê
kırmızı kan hücresi	xiroka sor
bir taşla iki kuş vurmak	bi kevirekî du gûz xistin
fuzuli şeyler	gêremêre
birine kavratmak	bi serê (yekî) xistin
cevdet	cewdet
nezarethane	nezaretxane
günahını almak	gunehê yekî têxistin stûyê xwe
çapa aracı	aşûvk
solunum sistemi	koendama henaseyê
aslanağzı	kilur
ana avrat düz gitmek	dê û jina kesekî gotin
yemek artığı	berafir
kurtlarını dökmek	kurmên xwe rijandin
sülükayaklı	zêlûpê
kızoğlan	nêremuşk
üstüne üstlük	serbarê ser
yeşil çay	çaya kesk
yaprak sarması	pelgepêç
overlok	êlang
çılbır	cilbire
büzülmüş kabuk	qeşmûşk
ne lâzım	te çi jê ye?
sana ne?	te çi jê ye?
tepesi (veya beyni) atmak	qalpaxa serê (yekî) avêtin
tepesinin tası atmak	qalpaxa serê (yekî) avêtin
gay	nêramok
homoseksüellik	nêremokî
atalardan kalma	babistînî
düdüklü tencere	zûpêj
arslan	erselan
dildo	dildo
zıbık	dildo
i̇dris	idrîs
salatalık turşusu	xiyarşor
samsat	semîsad
silvan	farqîn
süryanice	turoyo
genelde	adeten
normalde	adeten
normal olarak	adeten
nitrojen	nîtrojen
lösemi	losemî
press	pê lê nan
kara liste	lîsteya reş
ekinoks	ekînoks
küçük testi	sewîl
uluslararası çalışma örgütü	ilo
acı gerçek	rastiya tal
azep	êrgan
durumsal	rewşîn
para aklama	pareşûştin
akuaponik	akwaponîk
balık çiftliği	masîçandin
üvey kardeşlik	zirbiratî
bilgisayar korsanı	hakker
çökertici	hakker
gaz birikmesi	totmebûn
hipertimezi	hîpertîmezî
antimon	antîmon
haberi olma	hayil
(bir şeyden) haberi olmak	hayil jê hebûn
haberdar olma	hayil bûn
küçük merdiven	derencok
arktan karıklara suyu bırakma	miskar
kapı-gidere yol açan ihtiyaç	miskar
dolgun dudaklı	lêvzopik
fokurtu	bilqebilq
diş fırçası	firçeya diranan
hipernim	jornav
hiponim	jêrnav
türbin	tûrbîn
göz kapağı	perbijan
kim ne ararsa onu bulur	lê geriya û tê geriya
pangram	pangram
transhümanizm	transhumanîzm
orta yer	mexder
kopenhag	kopenhag
küçük yardımcı çocuk	morbêt
morbet	morbêt
keklikova	soskun
baş aşağı etmek	kubandin
abuk sabuk	kelevajî
kürt karşıtlığı	kurd-dijberî
koca amcıklı	quzşekal
koca götlü	quztepik
fare dişli	diranmişk
keyfimize göre	şandilxwaz
canımız ne isterse	şandilxwaz
göğüs kafesi	qefesa sîngî
kupkuru	hişkobiringo
başın gözün sadakası	sewqa serî
duyu siniri	demarexaneya hestê
motor siniri	demarexaneya livînê
ara nöron	demarexaneya navê
sis kaplanmış olan	mijgirtî
sislenmiş	mijgirtî
üstüne titremek	di tiştekî da lerizîn
canını dişine takmak	dev kirin canê xwe
kıyameti koparmak	kevir û kuçik anîn xwarê
dünyanın kaç bucak (veya köşe) olduğunu göstermek	bila bizane ku dew birê mêst e
yayılmacılık	firawanxwazî
genişlemecilik	firawanxwazî
komaya sokmak	nehewî kirin
pestilini çıkartmak	nehewî kirin
varış yeri	gehînek
rest	westa xwe girtin
ekin kargası	qirqirk
engerek yılanı	tîrmar
tuluğ	avrênc
dijital sistem	pergala hejmarîn
takas odası	berdêlgeh
sigarayı sigarayla yakmak	cixare bi cixareyê ve nan
yaşam tarzı	şêwejiyan
hayat tarzı	şêwejiyan
yasa tasarısı	projeyasa
yasa teklifi	projeyasa
kanun tasarısı	projeyasa
kanun teklifi	projeyasa
pürçek pürçek	biskbiskî
çokdilli	pirzimanî
çokdillilik	pirzimanî
akın akın	ref bi ref
sürü şeklinde	ref bi ref
kırmızı gagalı	nikilsor
kaşağı yapmak	qeşap kirin
have a face like a wet weekend	xeraca gawiran jê hatin xwastin
sokağa çıkma yasağı	qedexeya derketina derve
gezmiş görmüş	gerîyaye dirîyaye
hayretler içinde kalmak	çûn wê dinê û hatin
çemişgezek	çemişgezeg
kokuşturmak	şemixandin
kokuşturma	şemixandin
inandırmak	bawerandin
inandırma	bawerandin
beyin fırtınası	tofana mêjî
istakoz	stakoz
yumurta beyazı	spîlek
diken üstünde olma	gijgijîbûn
kamburu çıkma	piştkovîbûn
borcunu bilme	heqxweşbûn
aldırış etmek	poz pê kirin
kaale almak	poz pê kirin
çayır köpeği	seyê mêrgan
antik yunanca	yûnaniya kevn
eski yunanca	yûnaniya kevn
harap olma	wêranîbûn
amnezi	amnezî
uzun mesafeli	mewdadirêj
uzun erimli	mewdadirêj
kısa mesafeli	mewdakurt
kısa menzilli	mewdakurt
kısa erimli	mewdakurt
orta menzilli	mamnavend
orta mesafeli	mamnavend
homurdama	himînîkirin
mırlama	mirinîkirin
emoji	emojî
atardamar	xwînber
toplardamar	xwînhêner
i̇ran askeri	papagenî
işaret dili	zimanê livînê
evin reisi	serîman
evin erkeği	serîman
masa örtüsü	rûmase
abbas yolcu	li ber sikratê bûn
seul	seûl
ayrıntılı bir şekilde	bi kitkit
askerden arındırmak	bêleşker kirin
hegemonya	hejmûn
dil yetisi	şiyanweriya zimanî
düğümleme	girênîşk
çarpıtma	çewaşekarî
sırt kemiği	birrbirra piştê
meronimi	meronîm
sarı taş yoncası	endeko
eşek yoncası	endeko
enfekte kişi	tûşbûyî
kulak kemikleri	hestîkên bihîstinê
dış kulak	guhê derve
tutumluca	bi qitûtî
hasislikle	bi qitûtî
bayt	bayt
çabuk sinirlenip alınan çok alıngan	sîrqûnî
hemen alınan	sîrqûn
dış görünüş	dirf
doğu asya	asyaya rojhilat
şahin bakışlı	awirtûj
temin edilmek	bîter bûn
eceli gelmek	xwîna xwe xistin kevçî
fıldır fıldır aramak	tar û bêjing kirin
i̇shak	ishaq
nekrokrasi	nekrokrasî
binici	hespajo
at binicisi	hespajo
uçak hangarı	balafirxane
sürülebilir	ajobar
sürülebilirlik	ajobarî
öne sürmek	ajotin pêş
üzerine sürmek	ajotin ser (yekî)
bayrak asmak	ala daliqandin
bayrak çekmek	ala daliqandin
sabrın sonu selamettir	bi bêhna fireh bêsire dibe doşav
klasik arapça	erebiya klasîk
kur'an arapçası	erebiya klasîk
ne yapacağını bilmemek	ketin heyrê
çaresiz olmak	ketin heyrê
donanım	hişkalav
tunus	tûnis
mağribî	mexrebî
ismi mekan	îsmî mekan
orkide	kartolok
türk salebi	kartolok
ideallik	îdealî
normatif	normatîv
isteği sonucu yerleşmiş	xweşnişîn bûn
uygur	oygur
kalp kapakçığı	kevçika dil
adilcevaz	elcewaz
yamrı yumru	xiloxwarî
rüzgar gülü	firfiroka bayî
dilimlere ayırmak	tîş tîş kirin
trabzon	trapezon
sağlanma	bidestketin
temin edilme	bidestketin
ortaokul	dibistana navîn
geometrik	hendesî
hendesi	hendesî
öklid	iqlîdes
taşıma su ile değirmen dönmez	kûçik bi qusandinê nabe tajî
iç savaş	şerê navxweyî
vikipedi	wîkîpediya
erciş	erdîş
sefalet ve zorluk	şequdeq
kıvama getirmek	helizandin
kürdistan i̇şçi partisi	partiya karkerên kurdistanê
kenan	kenan
feridun	ferîdûn
gülmekten ölmek	ji kenan ketin
gülmekten kırılmak	ji kenan ketin
gülmekten katılmak	ji kenan ketin
gülmekten yarılmak	ji kenan ketin
birecik	bêrecûk
özalp	qerqelî
halsiz olmak	hecinîn
ağzından laf almak	gotin ji devê (yekî) kişandin
boğazından geçmemek	xwarin ber (yekî) neçûn
kadıya gitmek	çûn şerîetê
adalete gitmek	çûn şerîetê
münzevi	goşegîr
oynanma	çîstin
oynanmak	çîstin
oynayış	çîstin
oynanış	çîstin
raks	çîstin
bittin	çû ji te
ışık saçmak	îsan
karacadağ	qerejdax
daha neler	minê ho
ölmez otu	her dem ciwan
çoban çökerten	qurinck
kırmızı alıç	guhîja sor
çörekotu	dermanreşk
nemrut soğanı	pîvaza nemrûdê
mucizevi	mucîzewî
uykular haram olmak	xew li (yekî) heram bûn
donup kalmak	di ciyê xwe de tevizîn
kalp çarpması	kutkuta dilê
vallah billah tillah	wellehî billehî tillehî
çok derd	wey lê xemê
çok umurumda	wey lê xemê
maldivler	maldîva
curve	çivarê
lice	licê
manikür	manîkur
ölmek var dönmek yok	mirin heye veger tune ye
şahlanmak	rabûn pêdarê
hinduizm	hinduîzm
maybe	gaşe
lerzeye gelme	guj
çam katranı	karbox
periskop	perîskop
su aygırı	hespê avê
hipopotam	hespê avê
meme iltihabı	berêş
iri ve büyük kuyruklu koyunların yazın sıcağından ötürü kuyruk altlarının pişik olması	berxwirkî
fazla başak yemekten hastalanma	simil ketin
anklostoma	çengalkurm
ankilostom	çengalkurm
kıl kurdu	davekurm
midede gaz toplanması	defiyan
askaris	marik
bir tür tavuk hastalığı	nikilreşî
hedef kitle	girseya armanc
yakarış	lava
i̇liç	îlîç
itaatkar	stûxwarkirî
söz dinleyen	stûxwarkirî
varşova	warşova
tensel	laşdar
korporel	laşdar
ölçümbilim	metrolojî
su samuru	segav
ağaç sansarı	kûzeyê daran
üstün tutmak	di ser re girtin
huzurevi	aramxane
marksizm	marksîzm
uzay gemisi	keştiya fezayê
atina	atîna
kahverengi kokarca böceği	fiskele
bu arada	wekî din jî
içkin	di xwe de
kendinde içkin	di xwe de
uçan balık	permasî
ag	fekirin
raptiye	reptiye
pünez	reptiye
hükûmetlerarası	navhikûmetî
izinden gitmek	şopa (yekî) ajotin
gusül	xusl
mandolin	mandolîn
epigrafi	epîgrafî
yazıt bilimi	epîgrafî
babil	babîl
yüksek maaşlı	meaşbilind
kaktüs	kaktûs
birinci dünya savaşı	şerê cîhanê yê yekem
sebze fidesi	sadir
ışınlamak	tirûskandin
aşırı sıcak	kelqij
assam dili	assamî
mekansal aralık	neqebk
kaçışmak	leq lê ketin
dil iltihabı	zimankulî
dil yarası	zimankulî
muradiye	bêgirî
güzeller güzeli	keçxezal
stronsiyum	stronsiyûm
beliz	belîze
el salvador	el salvador
guatemala	guatemala
honduras	hondûras
karayip denizi	deryaya karîbê
meksika körfezi	kendava meksîkê
batı yarımküre	nîvkada rojavayî
hint okyanusu	okyanûsa hindî
kuzey buz denizi	okyanûsa arktîk
kore demokratik halk cumhuriyeti	komara demokratîk a gel a koreyê
mayoz	miyoz
elektrik direği	dartêl
hicaz	hîcaz
lut	lût
teneşir	mevşen
metamfetamin	metamfetamîn
amfetamin	amfetamîn
marmot	marmot
misafirliğe gitmek	çûn nav malan
kafaya dikmek	di serê xwe dakirin
üstlenmek	girtin ser xwe
inovasyon	înovasyon
panislamizm	panîslamîzm
namazı terketmek	terkeselat bûn
terkisalât	terkeselat
geceye kalmak	şev şikestin
geceyi yarılamak	şev şikestin
geceyi geçirmek	şev şikestin
ben eşek başı mıyım?	ma ez li ber golika me?
lafü güzaf	gotin û galegal
siverek	sêwreg
olmuşla ölmüşe çare yok	tiştê bû, nekeve dû
dik açılı	goşeyçik
dar açılı	goşeteng
dar açı	goşeteng
bahtın açık olsun	bextê te spî be
koyun otlatmak	palûn kirin
siyam ikizi	cêwiyên siyamî
yapışık ikiz	cêwiyên siyamî
sismik	sîsmîk
gürpınar	payîzava
çaldıran	ebex
sadede gelmek	devê pitpitkê girtin
el yordamıyla	bi destpelkê
saman alevi	agirê pûş
sırılsıklam aşık olmak	bi heft dilan dil ketin
iki gözü iki çeşme ağlamak	bi çar çavan girîn
hava kuvvetleri	hêzên hewayî
deniz kuvvetleri	hêzên deryayî
körfez arapçası	erebiya kendavî
basra körfezi	kendava farisî
arap yarımadası	nîvgirava erebistanê
umman körfezi	kendava umanê
hürmüz boğazı	tengava hurmizê
umman denizi	deryaya erebî
afrika boynuzu	qoçê afrîkayê
doğu afrika	afrîkaya rojhilat
aden körfezi	kendava adenê
dünya görüşü	cîhanbînî
göz işareti	çavkirin
az bellemek	kesek bi destekî girtin
budanmış	ribaze
diş bademi	behîv firdik
dört yüz	çarsed
altı yüz	şeşsed
sekiz yüz	heştsed
dokuz yüz	nehsed
ensar	ensar
muharref	muxerref
hüda par	hudapar
hür dava partisi	hudapar
ileri geri	pêşûpaş
valiz	valêz
çıtçıt	çirpik
künefe	kunefe
kadayıf	qedayif
tel kadayıf	qedayif
ekoturizm	ekoturîzm
podcast	podcast
asılı beşik	colang
i̇kinci dünya savaşı	şerê cîhanî yê duyem
1970'ler	1970an
70'ler	1970an
uykusu hafif	xewsivik
seryum	seryûm
lityum	lîtyûm
berilyum	berîlyûm
sodyum	sodyûm
silisyum	sîlîsyûm
kalsiyum	kalsiyûm
ayakta durmak	li ser piyan bûn
skandiyum	skandiyûm
titanyum	tîtanyûm
vanadyum	vanadyûm
nikel	nîkel
selenyum	selenyûm
büklüm büklüm olmak	qincilîn
hiç bir şey	ti tişt
kripton	krîpton
rubidyum	rubîdyûm
itriyum	îtriyûm
zirkonyum	zîrkonyûm
molibden	molîbdên
jeopark	jeopark
jeosit	jeosît
bir varmış, bir yokmuş	carekê ji caran
anaç tavuk	kirtan
mantarbilim	mîkolojî
grafoloji	grafolojî
kuşbilim	ornîtolojî
ornitoloji	ornîtolojî
iklim bilimi	klîmatolojî
klimatoloji	klîmatolojî
etiyoloji	etiyolojî
fikoloji	algolojî
algoloji	algolojî
herpetoloji	herpetolojî
ihtiyoloji	îhtiyolojî
balık bilimi	îhtiyolojî
kardiyoloji	kardiyolojî
immünoloji	îmunolojî
dendroloji	dendrolojî
islamoloji	îslamolojî
sinematografi	sînematografî
diskografi	dîskografî
renyum	renyûm
radyum	radyûm
radyoaktif	radyoaktîv
koreograf	koreograf
gümrükçü	gumrikvan
peynirci	penîrfiroş
hafta içi	roja hefteyê
hafta arası	roja hefteyê
ışık yılı	sala ronahiyê
tişört	tîşort
calut	calût
golyat	calût
hazreti i̇sa	îsayê mesîh
i̇sa mesih	îsayê mesîh
i̇sa peygamber	îsayê mesîh
mikâil	mîkaîl
adam kaçırma	mirovrevandin
suç ortağı	hevtawan
diyadin	giyadîn
el kitabı	destpirtûk
prag	prag
st. petersburg	sankt petersburg
sankt-peterburg	sankt petersburg
floransa	floransa
lizbon	lîzbon
kiev	kîev
kıyiv	kîev
idealizm	îdealîzm
bibliyomani	bîbliyomanî
sahaf	sehaf
komodin	komodîn
organizma	organîzma
yalayıp yutma	fîtkirin
kızıl haç	xaça sor
kızılay	heyva sor
biyolojik	biyolojîk
dirim bilimsel	biyolojîk
bebekli anne	destdergûş
selanik	selanîk
nefes almak, solumak	bêhn kişandin
pireyi deve yapmak	mûyekî dike hûyekî
habbeyi kubbe yapmak	mûyekî dike hûyekî
amına koyayım	kîrquz
i̇pek yolu	riya hevrîşimê
resetlemek	reset kirin
bileşik kesir	parjimara hevedudanî
basit kesir	parjimara hêsan
tam sayılı kesir	parjimara tevlîhev
alçı vurmak	gac kirin
biçer	giyaçîn
sıkıca	heşkem
kömür ateşi	antêx
odun ateşi	antêx
tezek ateşi	antêx
bir fırt çekmek	veçinîn
duman çekmek	hecam kirin
taşlı arazi	kelebest
dûşmek	dahilîn
allah şifalar versin	xwedê şîfaya xêrê bide
karamsı	reşotankî
soğukça	sarotankî
yosunumsu	kevzotankî
gözler önüne sermek	dermeyan kirin
pörsümüş	pîrotankî
kırışmış	pîrotankî
solmuş	pîrotankî
kurumuş	pîrotankî
kafası allak bullak olmak	xurdilîn
yırtılmış	zolzolî
ortak bölenlerin en büyüğü	para hevpar a herî mezin
obeb	para hevpar a herî mezin
ortak katların en küçüğü	cara hevpar a herî biçûk
okek	cara hevpar a herî biçûk
cayırtı kopartmak	zîwezîw kirin
sonbahar başı	serpayiz
güz başı	serpayiz
köklü sayılar	regjimar
and	ad û qirar
dağ yamacı	gaz û gêdûk
faktöriyel	faktoriyel
kırağı bağlamak	qiravî girtin
bücür köpek	qolo
güdük it	qolo
yağmurlu hava	şilî û şilope
borç harç	deyn û dû
şerit metre	mezro
mezro	mezro
üzüntü duymak	qacqicîn
lal olmak	lalicîn
dili tutulmak	lalicîn
konuşamamak	lalicîn
can atan	mitilheyr
hayretle bakmak	zûriqîn
şaşkınlıkla bakmak	zûriqîn
vızıltı çıkarmak	vingîn
vınlamak	vingîn
yakınına gelme	ranêzkahî
yandaki	ranêzîk
künyesi bozuk	tûrqul
kötü tanınan	tûrqul
tahtırevan	texterewan
ringa	nîs
göllenme	mewicîn
sulama kovası	avreş
kendi kendine konuşmak	bi xwe bi xwe gotin
güneş tutulması	rojgirtin
primat	prîmat
oksidasyon	oksîdasyon
yenilenebilir	venûker
tekme tokat girmek	lê baketin
dolup taşmak	kimkimîn
çok zayıf	jarikokî
tel tel olmuş	zîtolzîtolî
iplik iplik olmuş	zîtolzîtolî
karanlık olmak	reşeve hatin
fazla kilolu	hupizî
yağ tulumu	hupiz
dışarıya çıkarmak	werxistin
yer değiştirme	cihguhêzî
anlatı	hewaldan
hasankeyf	heskîf
yan yana gelmek	hatin li bal hev
hafifçe vurmak	nermehetî kirin
hafifçe vurma	nermehetî
beşik kertme	bêşikkertme
bela olmak	selitandin
allaha ısmarladık	herî ser xweşiyê
tel aviv	tel evîv
savunma bakanı	wezîrê parastinê
hipersonik	hîpersonîk
veri bilimi	zanista daneyan
veri toplama	berhevkirina daneyan
paraklit	paraklît
kuş fotoğrafçısı	çûkger
sımsıcak	germegerm
sıcağı sıcağına	germegerm
nüfuz sahibi	nifûzdar
nüfuz eden	nifûzdar
deri değiştiren	çermguhêz
allah'ın aslanı	êzdînşêr
düşkün olmak	pê ve tenik bûn
ışınlanmak	tirûskîn
çök	îx
otur	îx
ıh	îx
kastanyet	camcamk
emek ve artı değer	kedûkesb
kara başlı çinte	çûkazer
göğsünü kabartmak	xwe paye kirin
kisirdöngü	korbend
alaca örümcek kuşu	gabelek
schwa	sistedeng
şva	sistedeng
al birini vur ötekine	yek ji yekî xiraptir e
at izi it izine karışmak	şopa gur û rovî bi nav hev ketin
eti senin kemiği benim	destê te ji te ra
saman altından su yürütmek	ava bin kayê bûn
allah aşkına	xwedê hebînî
yüzüne gözüne dursun	çav û gavên te bigire
ışınlayıcı	tirûskîner
sidney	sîdney
soyacak	ververok
çimenlik	ormix
çayırlık	ormix
eyer takozu	qaşa zîn
hüsrana uğramış	pormijî
amacına ulaşamamış	pormijî
dili tutuk	lalome
kavgacı olmayan	dûreşer
kavgadan uzak	dûrşer
un helvası	helawîk
dargeçit	kerboran
kerküklü	kerkûkî
taş üstünde taş bırakmamak	derek bi derekê ve nehîştin
baltayı taşa vurmak	das li çoka xwe xistin
ayağını denk almak	lingê xwe teng avêtin
arap dünyası	dinyaya erebî
bana göre hava hoş	ji bo min têla tembûrê ye
boğazına düşkün	hevalê xwarinê ye
bir içim su	wek kara xezalê ye
abdala malum olur	lê eyan bûn
adıyla sanıyla	bi nav û nîşana xwe
aması maması yok!	vir de û wirde nizanim
düşenin dostu olmaz	hevalên barê ketî tune ye
ince eleyip sık dokumak	hûr hûr rêsandin
kalbinin sesini dinlemek	dan dû dilê xwe
kılıçtan geçirmek	dan ber devê şûran
bir ağacın gölgesinde bir sürü yatar	hezar pez di bin sîya darekê da mexel tên
ceviz ağacı	dargûz
kendi göbeğini kendi kesmek	girêka xwe bi destê xwe vekirin
yerini bırakmak	cihê xwe spartin
yaş almış	gehgemirî
günümüzde	îroroj
kalkancı	mertalgêr
ekmeklik	nandank
kaşıklık	kevçîdank
çoraplık	goredank
yoğurtluk	mastdank
yemeklik	xwarindank
tencerelik	beroşdank
tüfeklik	tivingdank
terliklik	şimikdank
komedyenlik	pêkenokvanî
komediyenlik	pêkenokvanî
fare deliği	çalemişk
atatürk	atatirk
yeşil fasulye	peqleyê hêşin
kuru fasulye	peqleyê spî
film çekmek	fîlm kişandin
ispinoz	berfoke
kendine güvenmek	ji xwe bawer bûn
altına almak	xistin bin xwe
faslı	fasî
divançe	dîwançe
bursiyer	bursiyer
müstensih	mustensîx
tarihen	tarîxiyen
mesnevi	mesnewî
istinsah etmek	istînsax kirin
istinsahetme	istînsaxkirin
istinsahetmek	istînsaxkirin
harbiye	herbiye
temyiz mahkemesi	mehkemeya temyîzê
postnişin	postnişîn
atlama taşı	bazeber
mutasavvıf	mutesewif
öngörülemez	nepêşbînbar
çok kültürlü	pirkulturî
kırkkat	hezarpizrûk
kırkat	hezarpizrûk
evvelen	ewwelen
demografik	demografîk
kahveci	qehwecî
takribî	teqrîbî`;
