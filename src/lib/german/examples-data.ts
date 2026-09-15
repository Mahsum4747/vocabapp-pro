/**
 * German example/translation dataset — GENERATED FILE, DO NOT EDIT BY HAND.
 *
 * Regenerate with: node scripts/build-german-examples.mjs <path-to-dataset.jsonl>
 *
 * Source:   German Wiktionary (https://de.wiktionary.org), via kaikki.org's
 *           wiktextract JSON extraction.
 * Filtered: by this repo's offline measurement kit (see
 *           EXAMPLES-ATTRIBUTION.md for the full pipeline and license chain).
 *
 * Format: one record per line, tab-separated, eight columns:
 *   lemma \t pos \t gender \t plural \t examples \t en \t tr \t ku
 * where gender/plural are noun-only (empty otherwise), and examples/en/tr/ku
 * are "|"-separated lists (possibly empty).
 *
 * Held as one string rather than an object literal — same reasoning as
 * NOUNS_TSV in nouns-data.ts: a large object literal is parsed as code on
 * every cold start, while this is one string the engine skips over until
 * something actually splits it.
 */
export const EXAMPLES_TSV = `Hallo	noun	neuter	Hallos	Als er die Treppe hinaufkam, wurde er mit großem Hallo empfangen.	hallo		
April	noun	masculine	Aprile	Der April folgt auf den März.	April	nisan	nîsan
Mai	noun	masculine	Maie	Der Mai folgt auf den April.|„Sie wollen im Mai fahren, gegen Ende des Monats.“|„Dem freundlichen Mai waren die wilden Frühlingsstürme gewichen.“	May	mayıs	gulan
Juni	noun	masculine	Junis	Der Juni folgt auf den Mai.|Jedes Jahr im Juni besuche ich ein Open-Air-Konzert.|Anfang Juni werden wir in den Urlaub fahren.|[Das Projekt läuft] „insgesamt vier Jahre bis Juni 2021.“|[Zeitungen:] In der Ausgabe vom Juni zeigen wir ihnen die schönsten Grillrezepte.	June	haziran	xezîran
Juli	noun	masculine	Julis	Der Juli folgt auf den Juni.|„In Ägypten wurden die Neujahrsriten zu Beginn des Nil-Hochwassers im Juli zelebriert.“|„Am 27. Juli 1936 beginnt er ein neues Buch.“|„Der Juli mit seiner permanenten Helligkeit überstrahlte noch alles.“	July	temmuz	tîrmeh
August	noun	masculine	Auguste	Der August folgt auf den Juli.	August	ağustos	Tebax|gelawêj
September	noun	masculine	September	Der September folgt auf den August.|„Solches Wetter herrschte auch am zweiten September in der zehnten Vormittagsstunde.“	September	eylül	îlon
Oktober	noun	masculine	Oktober	Der Oktober folgt auf den September.|„Jener Oktober war einer der allerschlimmsten Monate des Bürgerkrieges.“	October	Ekim|ekim	cotmeh
Liebe	noun	feminine	Lieben	Die Liebe überwindet alle Grenzen.|„Im Mittelpunkt stand die Liebe.“|„Die Gefühle, die sie durchströmen und tragen, sind Liebe, Schutzbedürfnis und Hingabe.“	love	aşk|sevda|sevgi	evîn
Mensch	noun	masculine	Menschen	„Die modernen Menschen entwickelten in der oberen Altsteinzeit mehrere aufeinanderfolgende Kulturen.“|„Der Mensch ist frei, und keiner sollte mehr in Ketten geboren werden.“	human being|human|man|person	insan|kişi	mirov
Mensch	noun	neuter	Menscher	Das Mensch geht mir auf die Nerven.	hussy|baggage		
Wiedersehen	noun	neuter	Wiedersehen	Ich freue mich auf unser Wiedersehen⁽ᴵⁿᶠᵒ⁾	reunion		
Bank	noun	feminine	Bänke	Sollen wir uns auf diese Bank setzen?|„Smoaks setzte sich auf die gegenüberliegende Bank und sah ihn an.“	bench|bed|layer|bank	bank|sıra|kumarhane	
Bank	noun	feminine	Banken	Diese Bank wäre bei dem Großbrand gestern fast abgebrannt.|„Die Guthaben bei Banken und Sparkassen seien gesichert und blieben unberührt.“	bank|dealer	banka	
Kind	noun	neuter	Kinder	Die Kinder spielten im Garten.|„Sie atment wie ein müdes Kind neben mir.“	child|kid|kiddo|offspring	çocuk	zarok
Angebot	noun	neuter	Angebote	Er machte ihr ein attraktives Angebot.	offer|offering|tender|supply	öneri|teklif|arz|sunu	
Computer	noun	masculine	Computer	Dieser Computer ist nicht leistungsfähig genug für neue Computerspiele.|Eine häufige Anwendung des Computers ist das Surfen im Internet.|Wer am Computer sitzt vergisst schnell die Zeit.|„Es tat gut, den kleinen Computer in der Hand zu halten.“	computer	bilgisayar	kompyuter|kompîtur|komputer
Krieg	noun	masculine	Kriege	„Russland hat im Krieg gegen die Ukraine hohe Verluste erlitten.“	war	harp|savaş	şer|شەڕ
Feuer	noun	neuter	Feuer	Hast du mal Feuer?|„Eine Minute lang sah er ins Feuer.“	fire	ateş|fener|ışıldamak|aşk	agir|ئاگر
Hammer	noun	masculine	Hämmer	Der Hammer gehört zur Grundausrüstung des Zimmermanns.|„Es sind furchteinflößende Krieger mit vorzüglichen Schwertern und Speeren, Hämmern und Streitäxten.“|„Aber es hat nichts mit dem Hammer und dem Schraubenzieher zu tun.“	hammer|hammering machine|malleus|rush	çekiç	çakûç|çekûç|چەکوش
Hammer	noun	masculine	Hammer	Sie ist Bochumerin, er ist Hammer.	Hamm inhabitant		
Kriegen	noun	neuter		„Komm, wir spielen Kriegen!“	tag|tig|tiggy|tip		
Montag	noun	masculine	Mte.	Letzten Montag war ich im Kino.	Monday	Pazartesi|pazartesi	duşem|دووشەممە
Hand	noun	feminine	Hände	„Die verfluchte Hand preßte und drückte und schloß sich weiter und weiter.“|„Fabiolas Hand zitterte, als sie zur Tastatur griff.“|„Er hatte noch immer beide Hände in den Jackentaschen.“	hand	el	dest|دەست
Wort	noun	neuter	Wörter	Wörter kann man zählen, nach Worten muss man ringen.|Sätze bestehen aus Wörtern.|„Alle Wörter einer Wortart haben eine bestimmte Art der Bedeutung.“	word|term|expression	kelime|sözcük	peyv
Wort	noun	neuter	Worte	Das war ein „Geflügeltes Wort“.	saying	söz|kelam	
Mutter	noun	feminine	Mütter	Sie ist die Mutter von zwei Kindern.|„Sie war gekommen mit Mutter, Großmutter, vier Schwestern und sechs Nähmaschinen.“	mother	ana anne|ana şirketler grubu|rahibe|ana	dê
Buch	noun	neuter	Bücher	In einer Bibliothek werden Bücher gesammelt und den Benutzern zur Verfügung gestellt.	book|volume|script|ledger	kitap	pirtûk|کتێب
See	noun	masculine	Seen	Ein ausgetrockneter See hat kein Wasser mehr.|„Einer der Seeen, die diese Seeenkette bilden, heißt ‚der Stechlin‘.“	lake	göl	gol
See	noun	feminine	Seen	„Die See wird vor ihnen auftauchen, von Sonnenlicht überflutet.“|„Die See lag unbeweglich.“	sea	deniz	
Boot	noun	neuter	Boote	Wir können mit dem Boot über den Fluss setzen.|„Er rutschte auf seinem Boot aus und stürzte ins eiskalte Meer.“|„Er stand jetzt im Heck und brachte das Boot zum Schaukeln.“|„Joan hatte das Boot längst gesehen.“	boat|auxiliary ship|support ship	bot|filika|kayık|sandal	
Boot	noun	masculine	Boots	Du solltest dir noch die Boots anziehen.	boot		
Seite	noun	feminine	Seiten	Auf dieser Seite des Hauses ist es nachmittags angenehm kühl.	side|hip|flank|item	taraf|yan ; [11|12] sayfa|köşe	
Schatz	noun	masculine	Schätze	Manch ein Seeräuber hat einen Schatz vergraben und nicht wieder gefunden.	treasure|heritage|darling|sweetheart	hazine|servet|doğal / tabii kaynak|sevgili	
Kampf	noun	masculine	Kämpfe	Bei den Kämpfen gab es hunderte von Verletzten und Toten.	battle|combat|fight	muharebe|savaş|kavga|mücadele	şer|têkoşîn
Licht	noun	neuter	Lichter	Bei Licht sieht es anders aus.|„Der Schein mehrerer Deckenlampen hüllte den Raum in warmes Licht.“	light	ışık|aydınlık|mum|doruk	
Schatten	noun	masculine	Schatten	Der Baum spendet Schatten.|„Unlängst sah ich deinen Schatten an der Reling.“|„Es warf einen durchsichtig orangefarbenen Schatten auf die Porzellanplatte des Küchentischs.“	shade|shadow	gölge	
Luft	noun	feminine	Lüfte	Könnte bitte jemand ein Fenster aufmachen, die Luft ist ja zum Schneiden.|„Diese Luft reizte zum Schnuppern.“|Die Luft strömt durch eine Lüftungsgitter in den Raum hinein.	air	hava|rüzgâr|nefes	hewa|ھەوا
Luft	noun	masculine	Lüfte	„Wenn der Luft über die Stoppeln weht, so geht’s dem Winter zu.“			
Zeit	noun	feminine	Zeiten	Wie schnell die Zeit vergeht.|Zeit ist ein Mysterium.|Kinder, wie die Zeit vergeht.	time|times|tide|tense	vakit|zaman|saat	wext|کات
Raum	noun	masculine	Räume	Der Würfel umfasst einen Raum von 10 Kubikmetern.	space|room|region|leeway	feza|uzay|oda|mekân	ode|valageh
Denken	noun	neuter		Rechtes Denken ist für viele längst gesellschaftsfähig.	thinking|thought	görüş|düşünme	
Herzog	noun	masculine	Herzöge	Das Schloss des mecklenburgischen Herzogs steht in Schwerin.|„Auch der Herzog sah anders aus: Er war älter geworden.“	duke	duka|dük	dûk
Woche	noun	feminine	Wochen	In zwei Wochen habe ich meine mündliche Prüfung.|In dieser Woche gibt es mal keine Extratermine.|„Eine Woche darauf hatte er die Urlaubsbewilligung.“	week|puerperal	hafta	hefte
Stein	noun	masculine	Steine	Die Geräte sind aus Holz, Knochen oder Stein.|übertragen: Sie hat ein Herz aus Stein.	stone|rock|boulder|brick	taş	kevir|ber
Sonntag	noun	masculine	Sonntage	Neuere Arbeitsgesetze lassen für den Sonntag wieder mehr und mehr Ausnahmen zu.	Sunday	Pazar	yekşem|يهکشهممه
Wasser	noun	neuter	Wasser	Wenn es heiß ist, trinke ich gern Wasser.|„Reines Wasser unterliegt einer sogenannten Autoprotolyse (auch Autodissoziation).“|Auch sie sprang ins Wasser.|„Er kniete und goß sich Wasser über Kopf und Schultern.“	water	su|sular|sıvı|alkollü içki	av|ئاو
Blut	noun	neuter	Blute	Auf dem Papier ist ein Tropfen Blut.|Der Arzt hat mir gestern ein Röhrchen Blut abgenommen.|Kommst du mit, Blut spenden?|Das Unfallopfer hatte viel Blut verloren.	blood	kan|insan|soy	xwîn
Berg	noun	masculine	Berge	Die Berge grüßen uns.|Auf den Berg steigen.|Der Berg ruft. (Geflügeltes Wort)|Der Bau hinterließ Berge an Schutt.|Ich wandere gerne in den Bergen.	mountain|hill|heap|pile	dağ	çiya|کێو
Haus	noun	neuter	Häuser	„Bei Bedarf bekommen sie eine Brille angepasst - auf Kosten des Hauses.“|Das Haus steht seit 1898.	house|home|family|household	ev|beyt|meclis|menaj	avahî|mal|xane / xanî
Familie	noun	feminine	Familien	„Beide Frauen stammen aus Großstädten, beide wuchsen in bürgerlichen Familien heran.“	family	aile|familya	malbat
Quelle	noun	feminine	Quellen	Die Quelle der Elbe liegt in Tschechien.	spring|source|fountain	kaynak|hedef	
Schloss	noun	neuter	Schlösser	Er hat versehentlich den Schlüssel im Schloss von außen stecken lassen.	lock|bolt|castle|palace	kilit|saray|iğne ve yayı	
Frieden	noun	masculine	Frieden	Nachdem beide Völker Frieden geschlossen hatten, erholte sich auch die Wirtschaft wieder.|Alle Menschen wären glücklich, wenn Frieden wäre.	peace	barış|sulh|ferahlık|rahatlık	aştî
Macht	noun	feminine	Mächte	Der Staat hat die Macht, Gesetze zu erlassen.|„Macht korrumpiert, absolute Macht korrumpiert absolut.“ (Lord Acton)	potency|might|power|sway	güç	hêz
Vater	noun	masculine	Väter	Markus ist der Vater von Jaqueline.|Herr Schmidt ist ein strenger, aber nicht unbedingt ein schlechter Vater.|„Der Vater, ein Staatsbeamter namens Kurt Böhme, steht nicht zu dem Kind.“|„Einer der Geldgeber der Stolbergs war Hans Luder, der Vater des Reformators.“	father|daddy|dad	ata|baba	bab|bav
Eigentum	noun	neuter	Eigentume	Es gibt auch geistiges Eigentum.	property|ownership|title	mülk	
Auto	noun	neuter	Autos	Ich fahre mit dem Auto nach Italien.|Ich habe gar kein Auto.|Kannst du Auto fahren?|Er hat sich ein gebrauchtes Auto gekauft.|„Die Wehrmacht brauchte sein Auto ebenso wie unseren Berliner DKW, den Dampfkraftwagen.“	auto|car|motor car|toy car	oto|araba	
Auto	noun	neuter	Autos	1765 wurde das Schreiben von Autos durch königlichen Befehl verboten.	order|resolution|writ		
Baum	noun	masculine	Bäume	Die Verliebten haben ein Herz in den Baum geritzt.	tree|boom	ağaç	dar|دار
Applaus	noun	masculine	Applause	Als der Violinvirtuose sich mehrmals verneigte, wurde er mit Applaus überschüttet.|„Der Applaus wurde noch heftiger.“|„Achtmal unterbricht der Applaus Lumumbas Ansprache.“|„Unter tosendem Applaus betrat eine Sopransängerin die Bühne.“	applause	alkış	çepik
Kleid	noun	neuter	Kleider	„Ihr Kleid spannte so stark, daß es fast aus den Nähten platzte.“	dress|clothes	elbise|giysi	
Maus	noun	feminine	Mäuse	Der Elefant hat Angst vor der kleinen weißen Maus.	mouse	fare	mişk
Maus	noun	feminine	Mäuse	Die Maus muss gereinigt werden.|Ich habe eine weiße kabellose Maus.|„Ihr Finger über der Maus zitterte.“	mouse	fare	mişk
Maus	noun	feminine	Mäuse	Mein Vetter hat so viele Mäuse, der weiß nicht, wohin damit.			
Maus	noun	feminine	Mäuse	Er zeigte dem Feind die Stärke seiner Mäuse und Fäuste.			
Weg	noun	masculine	Wege	Dieser Weg ist mir zu holprig.	track|route|path|way	yol	rê
Land	noun	neuter	Länder	Einige Schildkröten leben nur auf dem Land.	land|earth|country|countryside	kara|memleket|ülke|eyalet	welat
Himmel	noun	masculine	Himmel	Wir mussten die Nacht unter freiem Himmel verbringen.	sky|firmament|heaven|space	gök|sema|cennet|Evren	asîman|ئاسمان
Brot	noun	neuter	Brote	Er sitzt nur bei Wasser und Brot.|Heute habe ich ein ungesäuertes Brot gebacken.|„Das Brot war schlecht und das Schweinefleisch nicht viel besser.“	bread|loaf of bread|slice of bread|sandwich	ekmek|dilim|rızık	nan
Tisch	noun	masculine	Tische	Der Tisch ist für die vielen Personen heute zu klein.|„Der Tisch steht direkt neben dem Herd.“	table	masa	mase|مێز
Rand	noun	masculine	Ränder	Er wartete am Rande der Fahrbahn auf den Abschleppdienst.|Sie trug eine Brille mit dickem Rand.|Der Kamillentee schwappt über den Rand.	edge|brim|rim|margin	kenar	
Rand	noun	masculine	Rand	Das kostet zehn Rand.	rand		
Zeichen	noun	neuter	Zeichen	Sie hat ihm ein Zeichen gegeben, sie in Ruhe zu lassen.	sign|mark|character|cipher	işaret|sembol|simge|burç	
Schwein	noun	neuter	Schweine	Hast du die Schweine schon gefüttert?	pig|swine|pork	domuz|sans	beraz
Rauch	noun	masculine	Rauche	Das Möbellager ging in Rauch und Flammen auf.|Die Decke war vom Rauch geschwärzt.|Die Aale werden in den Rauch gehängt.	reek|smoke|fume	duman	dûkêl|dûxan
Fisch	noun	masculine	Fische	Der Wal ist kein Fisch.	fish|Pisces	balık	masî|ماسی
Jahr	noun	neuter	Jahre	Der Bau des Hauses dauerte 2 Jahre.|Er muss so ungefähr zwischen 30 und 40 Jahre alt sein.|Das Projekt startet im August dieses Jahres.|Ich will in einem Jahr Marathon laufen.	year|age	yıl|sene|yaş	sal
Ort	noun	masculine	Orte	Punkt A1 liegt am angegebenen Ort auf der Linie.	location|site|situation|spot	yer|lokasyon|belde|ahali	cih|der
Ort	noun	neuter	Örter	Momentan befinden sich drei Grubenarbeiter vor Ort und zwölf im Aufzug.	end|termination		
Tee	noun	masculine	Tees	Der Tee hat in China eine vieltausendjährige Geschichte.|Kaffee und Tee sind beliebte Getränke.|„Der Tee war sehr bitter, wurde aber durch die Unmenge Zucker genießbar.“|Sie brachte aus China ein Päckchen Tee als Mitbringsel mit.	tea|tea plant|infusion	çay	çay
Tee	noun	neuter	Tees	Vom Tee Nummer 3 konnte man die Landezone nicht einsehen.	tee|tee box		
Kaffee	noun	masculine	Kaffees	Ich trinke eine Tasse Kaffee.|„Manchmal setzten wir uns, und dann wurden uns Kaffee und Zigaretten angeboten.“|„Mein Kellner bringt Kaffee, Buttersemmeln und Marmelade.“|„Der Kaffee war in einer Kanne und der Zucker daneben.“	coffee	kahve|kahvaltı	qehwe
Musik	noun	feminine	Musiken	„Die Musik spielte wieder in voller Lautstärke.“|„Die Musik spielte die neue Mazurka.“|„Es ist ohnehin Schluß, auch die Musik packt ein.“	music	müzik	muzîk
Spaß	noun	masculine	Späße	Habt ihr Spaß gehabt?|Die Arbeit macht mir keinen Spaß mehr.	humour|fun|amusement|entertainment	eğlence|şaka	
Freude	noun	feminine	Freuden	Die Freude war groß, als der Onkel endlich da war.|Es ist mir eine große Freude, Sie begrüßen zu dürfen.|Er genoss die Freuden des Junggesellenlebens.	joy|delight|happiness|gladness	sevinç	şabûnî
Kuh	noun	feminine	Kühe	Der Bauer melkt die Kuh.	cow	inek	çêl|mange|çêlek
Hilfe	noun	feminine	Hilfen	Es war eine große Hilfe, dass wir seinen PKW vorübergehend nutzen konnten.|Ich brauche dringend Hilfe!	help	yardım|destek|muin|yardımcı	alîkarî
Bahn	noun	feminine	Bahnen	Cecilie geriet nun endgültig auf die schiefe Bahn.	path|way|lane|track	yol|şerit|kulvar|raylı sistem	
Stand	noun	masculine	Stände	Die nächste Übung beginnen wir im Stand.	stand|standing position|footing|position	durma|duruş|duracak yer|durma yeri	
Schau	noun	feminine	Schauen	Die Automobilausstellung ist eine große Schau der Autoindustrie.	exhibition|exposition|show|gala	gösteri|şov	
Uhr	noun	feminine	Uhren	Ach du Schreck, meine Uhr ist stehen geblieben.|Wo habe ich denn meine Uhr hingelegt?|Die Uhr ist stehengeblieben.|„Er sah nach der Uhr.“	clock|watch|timepiece|o'clock	saat|sayaç	
Dienstag	noun	masculine	Dienstage	Am Dienstag gehen wir immer ins Kino.	Tuesday	Salı|salı	sêşem
Salz	noun	neuter	Salze	Eine Prise Salz in die Suppe kann nicht schaden.|„Ich lese Zeitung und knabbere das Salz von Salzstangen ab.“	salt|sal	tuz	xwê
Samstag	noun	masculine	Samstage	Wie jeden Samstag schaut er auch heute die Sportschau.|„Am darauffolgenden Samstag besuchte ich wie fast jedes Wochenende Amalia zum Abendessen.“	Saturday	Cumartesi|cumartesi	şemî
Tasse	noun	feminine	Tassen	Sie trank ihre Tasse hastig aus, bevor sie zur Arbeit eilte.	cup	fincan	fincan|فنجان
Hund	noun	masculine	Hunde	„Der Hund gehorcht aufs Wort und geht links neben Elsa.“	dog|hound|scoundrel|corf	it|köpek	kûçik
Mittwoch	noun	masculine	Mittwoche	Der Mittwoch ist der klassische Ausgehtag der Deutschen.|Wenn heute Mittwoch ist, ist morgen Donnerstag.|Diesen Mittwoch fällt der Tanzkurs aus.	Wednesday	Çarşamba	
Donnerstag	noun	masculine	Donnerstage	Am Donnerstag ist immer besonders viel los.	Thursday	Perşembe	
Freitag	noun	masculine	Freitage	„Wir sind an einem Freitag hier, das Museum ist geschlossen.“	Friday	cuma	în|cume|îyn / eyn / heyn|înî / eynî / heynî
Wein	noun	masculine	Weine	In Deutschland wird seit der Römerzeit Wein angebaut.	vine|raisin|grape|wine	asma|üzüm|şarap|mey	mey|شەراب
Flugzeug	noun	neuter	Flugzeuge	Flugzeuge gehören zu den sichersten Verkehrsmitteln.|„Im Flugzeug hatte er sich Mühe gegeben mit sich selbst.“|„Dann beschrieb das Flugzeug eine Kurve auf den offenen Ozean hinaus.“	airplane|aeroplane aircraft|plane	uçak|tayyare	balafirr|balafir|firoke|فڕۆکە
Flughafen	noun	masculine	Flughäfen	Für uns am nächsten ist der Flughafen Hannover.|„Es begann in Kastrup, dem Flughafen außerhalb von Kopenhagen.“	airport	havaalanı|havalimanı|tayyare meydanı	balafirgeh|فڕۆکەخانە
Friedhof	noun	masculine	Friedhöfe	Die Beisetzung findet auf dem alten Friedhof statt.|„Hinter dem Friedhof folge ich dem Wanderweg in die nasse Tundra.“|„Es wurde immer unbehaglicher, auf dem Friedhof umherzugehen.“	cemetery|graveyard	mezarlık	goristan|گۆڕستان|قهبرستان
Stadt	noun	feminine	Städte	In Deutschland gibt es kleine und große Städte.	city|town|centre|center	kasaba|kent|şehir	bajar|شار
Beispiel	noun	neuter	Beispiele	Nehmen wir eine indogermanische Sprache, zum Beispiel das Niederländische.|[Mathematik:] „An einem praktischen Beispiel wenden wir jetzt die Grundableitungsregel an.“	example|instance|model	numune|örnek|misal	mînak|nimûne
Frühling	noun	masculine	Frühlinge	Im Frühling blüht die Natur auf.	spring|springtime	ilkbahar|bahar|ilkyaz	bihar|به هار
Sommer	noun	masculine	Sommer	Das Baden ist die schönste Beschäftigung im Sommer.|„Sie überlegen, wo sie den Sommer verbringen sollen.“|„Doch in diesem Sommer sollte alles aus dem Takt geraten.“	summer	yaz	havîn|هاوين
Figur	noun	feminine	Figuren	Sie hat eine gute Figur.	figure|piece		
Million	noun	feminine	Millionen	1000 Millionen sind eine Milliarde.|Deutschland hat 82 Millionen Einwohner.|„Heute werden jährlich Millionen Tonnen Hefe produziert.“	million	milyon	
Wohnung	noun	feminine	Wohnungen	Nach 18 Jahren Hotel Mama habe ich nun endlich eine eigene Wohnung.|„Und nun war er wieder daheim in seiner Wohnung.“|„Er erkämpft aber beim Provinzgouverneur bessere Wohnungen für die Évolués in Stanleyville.“|„Wir fahren zu ihrer Wohnung zurück.“|übertragen: „Eine Wohnung im Himmel erwartet dich, wenn du stirbst.“	flat|apartment|accommodation|home	daire|ev|konut	
Tag	noun	masculine	Tage	Während des Tages scheint die Sonne.	day|period|diet	gündüz|ruz|gün	roj
Tag	noun	neuter	Tags	Webdokumente werden mit Hilfe von HTML-Tags formatiert.	tag		
Pferd	noun	neuter	Pferde	„Ein Pferd, ein Pferd, mein Königreich für ein Pferd!“	horse|equidae|knight|vaulting horse	at|beygir|atlama beygiri	hesp
Großvater	noun	masculine	Großväter	Mein Großvater lebt noch.|„Er hatte den Großvater sehr gerne und war stolz auf ihn.“	grandfather|grandsire	büyükbaba|dede	باپيَر،
Wetter	noun	neuter	Wetter	Morgen wird schönes Wetter.|„Das Wetter verschlechterte sich wieder, und es war notwendig, einen Halt einzulegen.“	weather|air|damp	hava|hava durumu	
Wetter	noun	masculine	Wetter	Da werden die meisten Wetter lange Gesichter machen.	punter		
Wald	noun	masculine	Wälder	Ich gehe gern im Wald spazieren.|„Neue Wälder liefern mehr Holz.“	forest|wood	orman	daristan
Erde	noun	feminine	Erden	Er steht mit beiden Füßen auf der Erde.|Auch wertvolle Dinge liegen oft auf der Erde.|Die Geologie bildet die Grundlage der Wissenschaften von der Erde.	floor|ground|earth|soil	yer|zemin|toprak|Dünya	erd|xak
Monat	noun	masculine	Monate	Jeden Monat suche ich mehrere Beispiele zusammen und trage sie nach.|„Der Oktober ist auch das Monat der Freisprüche.“|„Die Klinik und das Monat kann gewählt werden.“	month	ay	meh|مانگ
Englisch	noun	neuter		Wie kann ich mein Englisch verbessern?|Im Englischen wird vieles anders geschrieben, als es gesprochen wird.|„Kommt im Englischen zwischen Haupt- und Nebensatz ein Komma?“|„Einer der Offiziere und zwei der Unteroffiziere sprachen ein wenig Englisch.“	English|English Opening	İngilizce	inglîzî|ئینگلیزی
Nichts	noun	neuter	Nichtse	Es verschwand im Nichts.|Alle Vorwürfe lösten sich in einem Nichts auf.|Das Auto auf der Gegenfahrbahn tauchte wie aus dem Nichts auf.|„Grenfeld öffnete die Augen und sah Magnusson ins Nichts starren.“|„Ich raste gegen Nichts und Niemand.“	void|nothingness|zero|underdog	boşluk|yokluk|hiçlenme	
Handy	noun	neuter	Handys	Dank meines neuen Handys bin ich jetzt überall erreichbar.|Ein knallbuntes Handy lag unterm Weihnachtsbaum.|„Ein weiteres Handy wurde bei der Gendarmeriebrigade Raeren abgegeben.“|„Ich habe sie mit dem Handy deines Vaters angerufen.“|„Lilith steht abseits und hält sich ihr Handy ans Ohr.“|„Eigentlich versuchte Evelyn Paswall nur ihr Handy zurückzugeben.“|„Mein Handy schlug an.“	cell phone / cellphone|cell|celly|cellular mobile	cep telefonu|cep	telefona berîkê|telefona beriyê|telefona bêtêl|bêtêlk
Ross	noun	neuter	Rosse	Der König reitet auf einem Ross daher.|„So sprengte die Gestalt auf schwarzem Ross dahin.“	steed|horse|knight|idiot		
Öl	noun	neuter	Öle	An den Salat sollte noch etwas Öl getan werden.	oil	sıvı yağ	zeyt|رون
Krankenhaus	noun	neuter	Krankenhäuser	„Er gehört ins Krankenhaus.“|„Wir haben erfahren, dass Malka in Stryj ist, im jüdischen Krankenhaus.“|„Der Mann liegt jetzt im Krankenhaus mit Nasenbeinbruch, Jochbeinbruch, Unterkieferbruch und Schienenbeinfraktur.“|„Im Krankenhaus sollten wir uns im Erdgeschoß in ein Wartezimmer setzen.“|„Zwei Stunden später landete der Hubschrauber, der Leo ins Krankenhaus flog.“|„Die Rettungswagen rasten schon zu den Krankenhäusern.“|„Nach vier Tagen wurde meine Mutter aus dem Krankenhaus entlassen.“|„Eric Garner starb auf dem Weg ins Krankenhaus an Herzversagen.“|„Im Notarztwagen, der sie ins Krankenhaus brachte, zuckte sie, von Krämpfen geschüttelt.“	hospital|infirmary|sickhouse	hastane|hastahane	bîmaristan|xestexane|misteşfa /|misteşfe /
Stahl	noun	masculine	Stähle	Stahl kann entweder aus Eisenerz oder aus Schrott hergestellt werden.|Stähle sind die am meisten verwendeten metallischen Werkstoffe.	steel	çelik	pola|پۆڵا
Schrank	noun	masculine	Schränke	Sie öffnete den Schrank und nahm ein Handtuch heraus.|„Ich hatte im Schrank ein paar vergessene Briefe gefunden.“	cupboard|closet|cabinet|wardrobe	dolap|klozet|yüklük	
Bett	noun	neuter	Betten	Wir haben uns ein neues Bett gekauft.|„Neben dem Bett stand auf dem Nachttisch ein Schachbrett.“	bed	yatak	nivîn
Kohle	noun	feminine	Kohlen	Leg noch etwas mehr Kohle in den Grill!|„Oder könnte jemand auf Kohlen gehen, ohne dass seine Füße verbrannt würden?“|„Im Vergleich zur Kohle galt Erdgas bisher immer als klimafreundlichere Energie.“	coal|money|charcoal	kömür	komir
Zelle	noun	feminine	Zellen	Die Zelle teilt sich.	cell|basic item|radio cell	göze|hücre	
Baby	noun	neuter	Babys	Ihr habt aber ein sehr süßes Baby!|Das Baby schreit schon wieder, ist es hungrig?|„Das Baby auf Mâys Arm tat keinen Mucks.“|„Josey nickte, drehte sich um und wollte gehen, das Baby im Arm.“	baby|infant	bebek	
Daumen	noun	masculine	Daumen	Klaus lutscht immer noch am Daumen.|„Ich spürte den Druck seines verstümmelten Daumens in meiner Hand.“	thumb	başparmak	beranek
Auge	noun	neuter	Augen	Ich kann das auf die Entfernung mit meinen Augen schlecht sehen.|„Die Augen waren offen und sahen waagerecht über die Wasseroberfläche hin.“	eye|globule of fat|pip	göz	çav|چاو
Nase	noun	feminine	Nasen	Ich atme durch die Nase.	nose|nase	burun|kababurun balığı	poz|لووت
Deutsch	noun	neuter		Deutsch ist meine Muttersprache.|Ihr Deutsch kann sie noch weiter verbessern.|Ihr Deutsch können Sie noch weiter verbessern.|Es bedeutet einigen Aufwand und Mühe, Deutsch gründlich zu erlernen.|Im Deutschen gibt es vier grammatische Kasus.|Der Text ist auf Deutsch geschrieben.|Der Text ist in gutem/schlechtem Deutsch geschrieben.|„Sie lobten ihr immer besser werdendes Deutsch.“|„Deutsch ist schon lange die beliebteste Zweitsprache in und über Europa hinaus.“	German	Almanca	elmanî
Test	noun	masculine	Tests	Max führt im Labor gerade einen Test durch.|Die Austauschschülerin hat den Test leider nicht bestanden.|„Wie immer bei Tests, hängt das Ergebnis von der verwendeten Methode ab.“	check|test	test	
Gold	noun	neuter		Ein Barren aus Gold.	gold	altın	zêr
Paket	noun	neuter	Pakete	Ich mache ein Paket fertig.	packet|package	paket	pakêt
Programm	noun	neuter	Programme	Hast du das neue Programm schon installiert?	cycle|programme|program|schedule	program	bername
Frau	noun	feminine	Frauen	Sie ist eine berufstätige Frau.|Sie erwacht zur Frau. (Sie wird vom Mädchen zur Frau.)	woman|wife|spouse|Mrs.	kadın|karı|bayan	jin|ژن
Sprache	noun	feminine	Sprachen	Ihm ist die Sprache durch den Schlaganfall abhandengekommen.|„Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.“|„Daran sehen wir, dass die Sprache als Fundament der Herrschaft begriffen wird.“	speech|language	konuşma|dil|lisan|konuşma tarzı	ziman|زمان
Grundstück	noun	neuter	Grundstücke	Dieses Grundstück ist ein Bauplatz.|Alle Grundstücke sind im Grundbuch verzeichnet.	land|site|estate|parcel	arsa	
Planet	noun	masculine	Planeten	Jupiter ist der größte Planet im Sonnensystem.|„Die Ordnung unseres Planeten wäre eine andere.“	planet	gezegen|planet	gerstêrk
Arm	noun	masculine	Arme	So lange Arme hat sie nicht.|Irgendwann fällt mir noch der Arm ab.|„Zwei Wächter hielten den zum Gelage angereisten Fürsten an den Armen fest.“|„Sein gesunder Arm hing nach unten, wies in die Tiefe.“	arm|right-hand man|right-hand woman|ass	kol	mil
Mann	noun	masculine	Männer	Er ist ein kluger Mann.	man|husband|spouse|God	adam|koca	mêr
Zahl	noun	feminine	Zahlen	Eine Trillion ist eine sehr große Zahl.	number|figure|count|tally	sayı|adet|tane|rakkam	
Nummer	noun	feminine	Nummern	Der Spieler mit der Nummer 10 wird ausgewechselt.	number	numara|kod	hejmar|jimare
Stelle	noun	feminine	Stellen	Haben Sie sich für diese Stelle beworben?	job|digit|place|passage	iş|basamak|yer	
Wissenschaft	noun	feminine	Wissenschaften	Er betreibt Heimatkunde mehr als Hobby denn als Wissenschaft.|Die Biologie ist eine Wissenschaft.|Die Geologie bildet die Grundlage der Wissenschaften von der Erde.|„Auch so manche Wissenschaft verspürte sogleich verstärkten Handlungsbedarf.“	academic discipline|ungefähr science	bilim|ilim	zanist
Saft	noun	masculine	Säfte	Im Frühling steigt der Saft in die Bäume.|„Von der Kelter tropft dann zuckersüßer Saft.“	juice		
Brief	noun	masculine	Briefe	Ich schreibe dir einen Brief.|Hast du den Brief, den ich dir geschrieben habe, schon geöffnet?|„Der wahre Brief ist seiner Natur nach poetisch.“|„Er äußert den Wunsch, einen Brief schreiben zu wollen.“|„Doch er las den Brief noch nicht.“|„Sie legte das Geometrieheft beiseite und öffnete ungeduldig den Brief.“	letter	mektup	name|نامە
Tasche	noun	feminine	Taschen	Ich habe die Taschen voll.|Die Taschen an der Jacke sind ausgerissen und müssen neu angenäht werden.	pocket|bag	cep|çanta	tûrik
Schnaps	noun	masculine	Schnäpse	Einen Schnaps mehr, und ich hätte es geschafft.	liquor|spirits|liqueur|schnapps	raki	
Blitz	noun	masculine	Blitze	An Blitz und Donner erkennt man ein Gewitter.|„Ein Gewitter hatte es gegeben, Blitz und Donner im raschen Wechsel.“|„Während sie arbeiteten, brach erneut ein Unwetter mit Blitz und Hagel los.“	lightning|flash	şimşek|yıldırım|flaş	birûsk|brûsk
Unternehmen	noun	neuter	Unternehmen	Ich leite ein Unternehmen.	enterprise|business	şirket|teşebbüs	
Stern	noun	masculine	Sterne	Proxima Centauri ist der nächste Stern.	star|asterisk|angel|princess	necm yıldız|yıldız	stêr|ستێر
Vergangenheit	noun	feminine	Vergangenheiten	In der Vergangenheit haben wir immer so gehandelt.|„Aber wer hinein sieht, blickt fast 1000 Jahre in die Vergangenheit.“|„Denn die Vergangenheit ist alles.“	past|past tense|background|history	geçmiş|mazi|geçmiş zaman	paşeroj|dema borî
Kommando	noun	neuter	Kommandos	Wer hat hier das Kommando?|„Der König betraut ihn mit dem Kommando über sämtliche Streitkräfte.“	command|commando	emir|komut|komutanlık	
Geburt	noun	feminine	Geburten	Mit der Geburt beginnt ein Leben.|Seit seiner Geburt ist er taub.	birth	doğum|doğuş	
Vogel	noun	masculine	Vögel	Ein Seeadler ist ein großer Vogel.|„Wo Hauskatzen frei herumlaufen, erbeuten sie Vögel.“	bird|fowl|have bats in the belfry|character	kuş	çûk|çûçik|çivîk|çîvanok
Sonne	noun	feminine	Sonnen	Die Sonne geht auf.|„Die Sonne verschwand gerade hinter den Wolken am Horizont.“	sun|Sun|sunshine|shine	Güneş|güneş	tav|خۆر
Hunger	noun	masculine		Mama, ich habe Hunger!|„Der Hunger ist das Dienstmädchen des Genies“.|Fast sechs Millionen Kinder sterben jedes Jahr vor Hunger.|„Der Hunger setzte ihm zu.“	hunger|craving|thirst|desire	açlık	xela
Frage	noun	feminine	Fragen	Ich stellte ihr eine Frage.|Wenn Sie möchten, dürfen Sie jetzt Fragen stellen.|„Aneinandergereihte Fragen oder Fragewörter können mit Komma verbunden werden.“|„Die plötzliche Frage machte ihn weit aufstarren.“	question|issue	soru|sual|bahis|dava	pirs|pirsgirêk
Ei	noun	neuter	Eier	Nur eine Spermazelle kann ein Ei befruchten.	ovum|egg|oval|oval ball	yumurta|tohum	hêk
Mund	noun	masculine	Münder	Ich atme durch den Mund.|„Der offene Mund war größer als sonst.“|„Sein Mund bewegte sich, und unter den geschlossenen Lidern rasten die Pupillen.“	mouth|lips	ağız	dev
Politik	noun	feminine	Politiken	Ich unterstütze die Politik unserer Regierung nicht.	politics|politicians|policy	politika|siyaset	polîtîka
Zug	noun	masculine	Züge	Viele Kinder schauen gerne Zügen zu.|Dies ist der Zug nach nirgendwo.|„Wir waren lange mit dem Zug gefahren, sehr lange.“|„Und nun setzte sich der Zug in Bewegung.“	train|traction|breath|draught	tren|çekim|çekme|cereyan	
Fahrzeug	noun	neuter	Fahrzeuge	Das Fahrzeug ist nicht verkehrstauglich.|Bewegen Sie ihr Fahrzeug aus der Fahrrinne!|Beim Fahrzeug klemmte das Höhenruder.|Das Fahrzeug ließ eine Schleppleine zu Boden.|Beim Wiedereintritt in die Atmosphäre ist das Fahrzeug einer enormen Hitzeentwicklung ausgesetzt.|„Fahrzeugkontakt ist normal, dementsprechend sehen viele Fahrzeuge auch aus.“|„Jeder Haushalt besitzt zwei oder drei Fahrzeuge.“|„Trotz verstärktem Husten und lauteren Weckworten rührt sich in dem Fahrzeug nichts.“	vehicle	araç|taşıt|vasıta	
Messer	noun	neuter	Messer	Das Messer hat eine scharfe Klinge.	knife	bıçak	kêr
Messer	noun	masculine	Messer	Der Messer muss nun seine Daten den Statistikern überlassen.	gauger|gager|meter		
Art	noun	feminine	Arten	Wir haben verschiedene Arten von Reisen im Angebot.	kind|sort|type|way	çeşit|nevi|tür	
Regen	noun	masculine	Regen	Morgen wird es Regen geben.|Regen rinnt über das Dach.|Wir wurden vom Regen überrascht.	rain	yağmur	baran|باران
Stuhl	noun	masculine	Stühle	Auf diesem Stuhl kann man bequem sitzen.|„Irgendjemand schob mir einen Stuhl unter den Arsch.“|„Im Werkkreis bei Hirte saß man auf Stühlen um einen runden Tisch.“	chair|stool|feces|bureau	sandalye|dışkı	daniştok|destav|kursî
Haar	noun	neuter	Haare	Er hat lange Haare.	hair	saç|kıl|tüy	por
Leben	noun	neuter	Leben	Gibt es Leben auf dem Mars?	life	hayat|yaşam|hayat şartları|yaşam koşulları	jiyan
Person	noun	feminine	Personen	Die Person kann ich nicht ausstehen.	person	kişi|şahıs	
Anfang	noun	masculine	Anfänge	Der Anfang war schon lange vorbei.|Die Entwicklung steckt noch in den Anfängen.	beginning|commencement|inception|incipience	başlangıç	destpêk
Mond	noun	masculine	Monde	Phobos und Deimos sind die beiden Monde des Mars.	moon|[2] Moon|crescent	uydu|Ay|ay|hilâl	hêv
Ohr	noun	neuter	Ohren	Schön geformte Ohren kann man mit Ohrringen betonen.|„An den Augenbrauen und Ohren hatte er goldene Piercings.“	hearing|ear	kulak	guh
Zunge	noun	feminine	Zungen	Beim Essen hat er sich auf die Zunge gebissen.|„Seine Zunge tastete sich langsam in Richtung ihrer Brust fort.“|„Er versuchte, mit der Zunge über die Lippen zu streichen.“|„Er unterdrückte eine Schmerzreaktion, als er sich dabei die Zunge verbrannte.“|„Meine Zunge fühlte sich rau und geschwollen an.“	tongue	dil	ziman
Dorf	noun	neuter	Dörfer	Im Zentrum des Dorfes steht die Kirche.|„Bei jedem Dorf werden wir von bettelnden Kindern umringt.“	village	köy	gund
Geld	noun	neuter	Gelder	Ich habe das ganze Geld auf die Bank gebracht.|Sie würde sich gern ein Fahrrad kaufen, hat aber nicht genügend Geld.|Inflation entwertet das Geld, Deflation lässt den Geldwert steigen.|„Willst du (ein) Geld?“	money|dough	para	pare|pere|dirav|پارە
Holz	noun	neuter	Hölzer	Das Holz ist morsch.|„Neue Wälder liefern mehr Holz.“	timber|wood	kereste|odun|orman	darik|چێو
Holz	noun	neuter	Hölzer	Wir führen alle Hölzer, die Sie zum Golfspielen brauchen.			
Schwert	noun	neuter	Schwerter	Er zückte sein Schwert.|„Die Soldaten kämpfen mit Schwert, Speer und Wurfspieß.“	sword	kılıç	
Waffe	noun	feminine	Waffen	Wir brauchen mehr Waffen.|„Ich tastete nach der Waffe im Schulterhalfter.“|übertragen: die Waffen einer schönen Frau – (Werbespruch aus den 1960er Jahren)	weapon|arm|talon	silah	
Mantel	noun	masculine	Mäntel	Ich brauche für den Winter einen neuen Mantel.|„Der Reiseleiter, schon in Mantel und Mütze, hat seine letzte Ansprache gehalten.“|„Ich habe mir den Mantel übergezogen und die Holzgitter geöffnet.“	coat	palto	
Polizei	noun	feminine	Polizeien	Die Polizei hütet das Gesetz.|Ich muss morgen zur Polizei.	police	polis	polîs
Kugel	noun	feminine	Kugeln	Die Erde ist keine Kugel, sondern ein Ellipsoid.	sphere|globe|ball|bullet	küre	gûlle
Gegend	noun	feminine	Gegenden	Er hat Schmerzen in der Gegend der Nieren.	region|area		
Name	noun	masculine	Namen	Wie ist dein Name?	name	ad|isim	nav
Finger	noun	masculine	Finger	Wie viele Finger sind das?|„Die zartgliedrigen, braunen Finger hielten eine geöffnete Packung mit Keksen.“	finger	parmak	enguşt|pence
Milch	noun	feminine	Milche	Nimmst du den Kaffee mit Milch und Zucker?|Auch Tauben produzieren Milch, die sogenannte Kropfmilch.	milk|milt	süt	şîr|شیر
Eis	noun	neuter		Es ist so kalt, dass Wasser sofort zu Eis gefriert.	ice|ice cream	buz|dondurma	
Eis	noun	neuter	Eis	Denke bitte daran in Takt 5 ein Eis zu spielen!	E sharp		
Bier	noun	neuter	Biere	In Deutschland gibt es über 5000 Biere.|Das deutsche Reinheitsgebot ist die Basis für die Qualität der deutschen Biere.|„Zu den obergärigen Bieren zählen Kölsch, Weizen- oder Altbier.“|„Nur für obergärige Biere darf Weizen anstelle von Gerste verwendet werden.“|„Smoaks ging zum Wagen und holte das Bier heraus.“	beer|ale	bira	bîra|بیرە
Motor	noun	masculine	Motoren	Das Auto fährt nicht mehr, da der Motor kaputt ist.|„Er lag im Bug eines unappetitlich riechenden Fischkutters, dessen Motor nervös tuckerte.“	engine|motor	motor	motor
Turm	noun	masculine	Türme	Kennst Du den Turm am Meer?|„Die Stahltür des Turmes war wie immer unverschlossen.“	tower|castle|rook	kule|kale	
Tod	noun	masculine	Tode	Sein Tod kam sehr überraschend.|„Mit Sex übt man auch Vergeltung am Tod.“	death	ölüm	mirin
Universum	noun	neuter	Universen	Das Universum ist unendlich groß.|„Sprache unterliegt wie alles andere im Universum der Evolution.“	universe	Evren|Kâinat	gerdûn
Toilette	noun	feminine	Toiletten	Ich muss mal schnell auf die Toilette.	toilet|lavatory|washroom|bathroom	hela|sıfır sıfır wc|WC|yüznumara	
Kilometer	noun	masculine	Kilometer	Bis nach Hause sind es noch drei Kilometer.|„Die Marschflugkörper legten demnach eine Strecke von 1.500 Kilometern zurück.“	kilometer|kilometre	kilometre	kîlometre
Stunde	noun	feminine	Stunden	Eine Stunde hat 60 Minuten.	hour|time|session|lesson	saat|zaman	saet
Marine	noun	feminine	Marinen	Die US-amerikanische Marine (US-Navy) gehört zu den stärksten der Welt.|„Dort hatte sich ein Expeditionskorps der Marine eingeschifft.“	navy|marine		
Schiff	noun	neuter	Schiffe	Schau dir mal dieses große Schiff an!	ship|boat|nave|aisle	gemi|nef	keştî
Katze	noun	feminine	Katzen	„Wer fragt schon, ob so eine Katze gekört ist?“|„Ihre drei Katzen rennen zwischen den Leitern herum.“|„Außerdem sind Katzen selbstsüchtige kleine Arschlöcher.“	cat|queen|she-cat|feline	kedi	kitik|pisîk / pişîk|پشیلە
Minute	noun	feminine	Minuten	Ich werde in fünf Minuten zurück sein.|„Fünfundzwanzig Minuten später kam ein Pfleger und setzte mich in einen Rollstuhl.“	minute	dakika	deqe
Sekunde	noun	feminine	Sekunden	Eine Minute hat 60 Sekunden.|Es ging um Sekunden.	second	saniye	
Gebäude	noun	neuter	Gebäude	Jedes Haus ist ein Gebäude.|Öffentliche Gebäude sind meistens relativ groß.|„Der Gasthof befand sich in einem zweistöckigen Gebäude außerhalb der Ortschaft.“|„Aber natürlich war das Gebäude der Handelsgesellschaft noch größer.“|„Sie lenkte in die Parkgarage des Gebäudes.“	building	bina|yapı	
Kilo	noun	masculine	Kilo	Dieser Gegenstand wiegt knapp ein Kilo.	kilo		
Kompliment	noun	neuter	Komplimente	Das fasse ich als Kompliment auf.|„In punkto Komplimente haben Polinnen und Polen in Deutschland ein schweres Leben.“|Das war eine respektable Leistung, Kompliment.|Mein Schwager kann wunderbare Komplimente machen.|„Ich wußte, daß sie über dieses Kompliment erröten mußte.“	compliment	iltifat	
Zentrum	noun	neuter	Zentren	Dort geht es ins Zentrum der Stadt.|Im Zentrum gibt es fast keine Parkplätze mehr.|„Murat erschien als Erster im Zentrum von Moskau, eskortiert von Württemberger Husaren.“	centre|center	merkez	
Asche	noun	feminine	Aschen	Es verbrannte zu Asche.|„Er klopfte die Asche aus seiner Pfeife und stopfte sie erneut.“|„Ich bückte mich und warf Herbert eine Handvoll Asche ins Gesicht.“	ash|cinder	kül	
Bein	noun	neuter	Beine	Das machen nur die Beine von Dolores.|Solange du deine Beine unter meinen Tisch steckst …|„Mein Blick wanderte an ihren Beinen hoch.“|„Die Beine zuckten, und die Arme konnten nicht mehr festhalten.“|„Dann stemmte Dwayne sein Bein wieder zusätzlich an die Wand.“	leg|bone	bacak	ling
Bauch	noun	masculine	Bäuche	„Nun hat sie beide Hände über den Bauch gefaltet.“	womb|belly|tum|tummy	karın|göbek	zik
Gemüse	noun	neuter	Gemüse	Obst und Gemüse enthalten viele Vitamine.	vegetable|vegetables	sebze|zerzevat	
Ding	noun	neuter	Dinge	Was ist denn das für ein seltsames Ding?	thing	şey|zımbırtı	
Ding	noun	masculine	Dinge	„Der Ding ist kein Mummenschanz; er ist eine Versammlung freier Männer.“	thing		
Flasche	noun	feminine	Flaschen	Ich habe heute eine Flasche Rum gekauft.|„Ich setzte die Flasche an und genoß das gute Gefühl.“|„Eine halbgeleerte Flasche Wein stand noch auf dem Tisch.“	bottle|flask|loser	şişe|tüp|sıfır	
Bär	noun	masculine	Bären	Der Bär gilt als blutrünstiges Raubtier, ist aber ein Allesfresser.|„Der Bär war schon alt.“	bear|teddy bear|Bear|Dipper	ayı	hirç|ورچ
Straße	noun	feminine	Straßen	Das Auto ist von der Straße abgekommen.	street|road|strait|sound	cadde|yol|sokak|boğaz	cade
Wäsche	noun	feminine	Wäschen	Ich muss noch die Wäsche bügeln.|„Seine Wäsche gibt Papa Mostmann in die Wäscherei.“	laundry|lingerie	çamaşır|çamaşır yıkama|aklama|para aklama	
Lampe	noun	feminine	Lampen	Im einfachen Stromkreis sorgt die Lampe dafür, dass der Stromkreis geschlossen ist.	lamp	lamba	
Militär	noun	neuter		Das Militär ist für die Verteidigung eines Staates zuständig.|„Das kaiserliche Militär setzte drei Kriegsschiffe ein.“	army|military	askeriye	
Militär	noun	masculine	Militärs	Die Uniform dieses Militärs ist mir nicht bekannt.	serviceman		
Armee	noun	feminine	Armeen	In den Armeen des Mittelalters kämpften Speerträger und Bogenschützen.	army|military	ordu	
Film	noun	masculine	Filme	Der Film wurde belichtet.	film|movie	ince tabaka|film	
Kumpel	noun	masculine	Kumpel	Ich ging mit meinen Kumpels einkaufen.	homie|buddy|mate|butty		ههڤاڵ
Virus	noun	masculine	Viren	Er hat sich ein(en) Virus eingefangen.	virus	virüs	vîrus
Koma	noun	neuter	Komas	Er fiel ins Koma.|Sie liegt schon seit einem Monat im Koma.|Dieser Patient ist aus dem Koma erwacht.|Wir mussten ihn in ein künstliches Koma versetzen.|„Zwei Tage und zwei Nächte schläft sie wie im Koma durch.“	coma	koma	koma
Koma	noun	feminine	Komas	Der Kern dieses Kometen ist in der hellen Koma kaum zu sehen.	coma		
Staat	noun	masculine	Staaten	In der Not rufen Banken wieder nach dem Staat.	state|territory|country|canton	devlet	dewlet|welat
Brücke	noun	feminine	Brücken	In der Stadt gibt es eine Brücke über den Fluss.|„Die Straßenkolonne von der Bezirksfarm arbeitete an der Brücke.“	bridge|rug|pons|link	köprü|kaptan köşkü|köprü üstü	pir|پرد
Tier	noun	neuter	Tiere	Der Löwe ist der König der Tiere.	animal|beast	hayvan	ajal|heywan|sewal
Soldat	noun	masculine	Soldaten	Der Soldat steht in seiner Uniform vor der Kaserne.|„Im Krieg sind alle Väter Soldat.“	soldier	asker	serbaz|leşker|çekdar|şerrvan
Gruppe	noun	feminine	Gruppen	Die Chromosomen werden in Gruppen eingeteilt.	group|unit	grup|ekip|heyet|takım	
Glas	noun	neuter	Gläser	Ich brauche keine dicken Gläser für meine Brille.|„Aber alle realen Gläser weisen mikroskopische Kerben und Fehlstellen auf.“	glass|jar	cam|bardak|kavanoz|dürbün	
Glas	noun	neuter	Glasen	Drei Glasen der ersten Wacht (Also 1½ Stunden in der ersten Wache).|„Oben schlug es vier Glasen, die Wachablösung trampelte durch die Gänge.“|„Alles, was ich höre, ist eine ferne Schiffsuhr, die Glasen schlägt.“			
Kopf	noun	masculine	Köpfe	Der Hut ist zu groß für deinen Kopf.	head|header|heads	baş|tura	serî
Mädchen	noun	neuter	Mädchen	Meine Bekannte hat ein kleines Mädchen bekommen.|A: „Lisa hat ein Kind bekommen.“ B: „Junge oder Mädchen?“|„Na, ich werde ja erst hören müssen, was die Mädchens dazu sagen.“	girl|maid	kız|hizmetçi kız hizmetçi	keç|qîz|کچ
Fernsehen	noun	neuter		„Gebildete machten Fernsehen für Gebildete, man hatte schließlich einen Bildungsauftrag.“	television|TV	televizyon|TV	
Krebs	noun	masculine	Krebse	Manche Krebse laufen seitwärts.	crayfish|crawfish|freshwater lobsters|craydid	yengeç|kanser|Yengeç	
Technik	noun	feminine	Techniken	Zum Malen eines Gemäldes bedarf es verschiedenster Techniken.|„Die uralte Technik des Fermentierens erlebt derzeit ein Revival.“|„Das entspricht haargenau der Technik des modernen Sachbuchs.“	technique|technology|equipment	teknik|teçhizat	teknîk
Retten	noun	neuter		Unser oberstes Ziel ist das Retten der Geiseln.	rescue		
Vorteil	noun	masculine	Vorteile	Es wäre von Vorteil, wenn man die Sache anders angehen würde.|„Und manche verklärten sogar die Nachteile der Deutschen in Vorteile.“|„Sie hatten anscheinend einfach mehr Vorteile als Nachteile voneinander.“	advantage|foredeal|benefit	avantaj|menfaat	
Alt	noun	masculine	Alte	Liane hat einen wunderschönen Alt, wenn sie spricht und singt.	alto		
Alt	noun	neuter		Nach dem Gesang kam Alt auf den Tisch.			
Frei	noun	neuter		„Aus dem Frei zur Arbeit holen ist bei uns an der Tagesordnung."|„Und letztendlich muss ja auch niemand im Frei erreichbar sein."			
Wissen	noun	neuter		Das Wissen der Menschheit über ihre Umwelt wächst.|„Wie stets, wenn das Wissen versagt, wuchern Gerüchte.“	knowledge	bilgi|Pl. bilgiler|malumat|Pl. malumatlar	zanyarîn
Schule	noun	feminine	Schulen	Ich gehe zur Schule.|„Endlich darf Elias auch in die Schule gehen.“	school|shoal	okul|mektep|ders	dibîstan|دبستان
Ich	noun	neuter	Ich	Bei manchen Menschen ist das Ich nicht sehr ausgeprägt.	I	ben	
Du	noun	neuter		Herr Lehmann hat mir das Du angeboten.	you		
Schweigen	noun	neuter		Das Schweigen im Raum ist unheimlich.|Die Menschen sagten nichts und dieses Schweigen war beeindruckend.	silence		
Zucker	noun	masculine	Zucker	Ich trinke meinen Kaffee immer mit Zucker.|„Eine weiße Oberschicht profitierte vom Handel mit Kaffee, Zucker, Baumwolle und Diamanten.“|„Mein Kellner hat den Zucker vergessen.“|„Der Kaffee war in einer Kanne und der Zucker daneben.“	sugar|blood sugar level|diabetes	şeker|kan şekeri|diyabet|şeker hastalığı	şekir
H	noun	neuter		„›Stellen Sie sich nicht dumm. Junk, H, Horse, verdammt, heroinsüchtig.‹“			
Gas	noun	neuter	Gase	Methan ist ein leicht entflammbares Gas.|Helium ist im normalen Zustand ein Gas.	gas|accelerator	gaz|gaz pedalı	
Blume	noun	feminine	Blumen	Eine schöne Blume, die du da gepflückt hast.	flower	çiçek|köpük|kuyruk|koku	çîçek|gul|kulîlk|گوڵ
Wolf	noun	masculine	Wölfe	Der Wolf ist ein Raubtier.|Zehn Prozent der deutschen Wölfe werden illegal getötet.	wolf|Lupus|passing machine	kurt	gur
SMS	noun	feminine	SMS	„Das SMS kann einfach als Gedankenstütze im Handy gespeichert bleiben.“|„Ich verliere schnell den Überblick und rufe gähnend meine SMSen ab.“|„Schnell schloss er die Tür hinter sich und rief die SMSe ab.“	SMS|text message|SMS message	mesaj|SMS	XPK|خپک
SMS	noun	masculine		„Der SMS ist ein Speichervermittlungsdienst, der über das SMS Centre realisiert ist.“	SMS	mesaj|SMS	XPK|خپک
MIT	noun	neuter		„Shaw vermutete, dass er seine Computerkenntnisse am MIT erworben hatte.“	MIT		
MIT	noun	masculine		„Diesen Unterschlupf hatte sein Handler organisiert, ein Offizier des türkischen Nachrichtendienstes MIT.“			
Ball	noun	masculine	Bälle	Sie spielten mit dem Ball.|„Der Ball ist rund.“ (Sepp Herberger)|„Der schnellste Spieler ist der Ball.“ (Sepp Herberger)	ball	top	gog
Ball	noun	masculine	Bälle	Auf diesem Ball amüsierte sich die Prominenz hervorragend.	ball	balo	
Sitz	noun	masculine	Sitze	Um 10 Uhr erreichten wir Cashbury Park, den Sitz des Grafen Essex.	seat|domicile	oturak|yer|merkez|makam	
Fehler	noun	masculine	Fehler	In der Physikarbeit hat er drei Fehler gemacht.	error|mistake|blemish|defect	yanlış|hata|kusur	
Wunder	noun	neuter	Wunder	Das ist ein Wunder!|Nicht einmal ein Wunder könnte uns noch helfen.|Wunder gibt es immer wieder.|„Und wir warteten auf ein Wunder. Und das Wunder kam nicht.“	miracle|wonder	mucize	
Meer	noun	neuter	Meere	Ich fahre nächste Woche ans Meer.|„Das Meer war Karthagos Element und die Flotte seine Lebensader.“|Das Südchinesische Meer ist ein Teil des Pazifischen Ozeans.	sea|lake|mare	deniz	behr
Bitte	noun	feminine	Bitten	Diese Bitte kann ich nicht ablehnen.	appeal|petition|plea|please	rica	
Tor	noun	neuter	Tore	Tür und Tor standen offen.|„Am Brunnen vor dem Tore, da steht ein Lindenbaum.“	gate|gateway|portal|goal	kapı|kale|gol|direk	dergeh|gol
Stille	noun	feminine		Was für eine Stille das ist, wenn die Spülmaschine plötzlich fertig ist!|„Ich lausche ihr, der Stille in dem Zimmer, die mich schwach macht.“	silence|still		
Ausdruck	noun	masculine	Ausdrücke	Der Ausdruck "Betrüger" kann eine Beleidigung sein.|„Ich gebrauche seine Ausdrücke spontan wie meine eigenen.“	expression	ifade	
Ausdruck	noun	masculine	Ausdrucke	Der Ausdruck ist so nicht brauchbar; dem Drucker fehlt wohl Tinte.	print-out|printout	çıktı	
Schlüssel	noun	masculine	Schlüssel	Ich finde meine Schlüssel nicht.|„Er schnappte es sich und knallte mir einen Schlüssel hin.“|„Aus seiner Hosentasche holt Schneider einen Schlüssel und schließt das Badehaus auf.“|„Er klingelte, obwohl er einen Schlüssel für ihr Appartement hatte.“	key|spanner|wrench	anahtar	
Hals	noun	masculine	Hälse	Sie reckte den Hals, um zu sehen, was vor sich ging.	neck|throat|tack	boğaz|boyun	qirik
Papa	noun	masculine	Papas	Mein Papa hat immer recht.|„Papa wäre damals bei den Nazis auch mal fast dran gewesen.“	daddy|dad	baba	
Durst	noun	masculine		Mama, ich habe Durst!|„Der Durst hatte nachgelassen.“|„Sein Durst schien unstillbar.“|„Im Cockpit wird Geburtstag gefeiert und kräftig Durst gelöscht.“	thirst	susuzluk	tîbûn
Internet	noun	neuter		Das Internet verbindet viele Computer auf der Welt.|„Dazu gab es im Internet keine spitzfindigen Kommentare.“	Internet|Net	İnternet	înternet
Stirn	noun	feminine	Stirnen	Auf ihrer Stirn zeigten sich schon kleine Falten.|„Es nützte jedoch nichts, die Stirn blieb kalt.“|„Er tippt sich an die Stirn und geht.“|„Ihre Finger arbeiteten sich über den Hinterkopf bis zur Stirn vor.“	forehead|front	alın	enî
Panzer	noun	masculine	Panzer	Durch ihren Panzer sind die Gürteltiere gut vor Feinden geschützt.	armour|armor|cuirass|coat of mail	zırh|kabuk|tank	zirx|tank
Meter	noun	masculine	Meter	Das Zimmer ist 2,5 Meter hoch.|„Höchster Weinstock des Simmentals in über 1000 Meter Höhe.“|„Zweihundert Meter vor seinem Ziel blieb er stehen.“	metre|meter	metre	metre
Start	noun	masculine	Starts	Start des deutschen Wiktionary war im Mai 2004.	start|take-off	başlama|başlangıç|iftitah	
Engel	noun	masculine	Engel	Sanft und gütig wie ein Engel ist sie.	angel	melek	
Einheit	noun	feminine	Einheiten	Der Tag der Deutschen Einheit erinnert an die Wiedervereinigung Deutschlands.|Musik und Tanz bilden eine Einheit.|„Sehnsucht nach erfüllter Einheit drängt Hessel zur Idylle.“	unity|oneness|entity|unit	birlik|birim|ünite	yekîtî|yekîne
Arbeit	noun	feminine	Arbeiten	Seine Arbeit macht ihm Spaß.	work|labour labor|employment|job	görev|çalışma|vazife|iş	
Französisch	noun	neuter		Kannst du gut Französisch sprechen?|„Das Gespräch am Tisch wechselte plötzlich vom Französischen ins Malinke.“|„Ich habe Ramin noch nie Französisch sprechen hören.“	French|French Defence|oral sex blow job	Fransızca	Ferensî
Übersetzung	noun	feminine	Übersetzungen	Ich habe hier die Übersetzung des englischen Textes vorliegen.|„Wo nicht anders vermerkt, stammen die deutschen Übersetzungen oder Paraphrasen von uns.“	translation|gear|transmission	çeviri|tercüme|transmisyon oranı	
Date	noun	neuter	Dates	Ich habe morgen ein Date mit ihr.	date		
Feind	noun	masculine	Feinde	Er ist mein schlimmster Feind.|Der Feind greift an!|„Alle Schiffe des Feindes hatten kriegstaugliche Schanzkleider und waren robust gebaut.“	enemy|foe	düşman	
Laut	noun	masculine	Laute	Was sind denn das für Laute?	sound	ses|fon	deng
Roman	noun	masculine	Romane	„Der Name der Rose" ist ein bekannter historischer Roman von Umberto Eco.	novel	roman	
Hut	noun	masculine	Hüte	Das ist mein neuer Hut.	hat|cap	şapka	
Fick	noun	masculine	Ficks	Das war ein guter Fick!	fuck		
Lösung	noun	feminine	Lösungen	Ich habe die Lösung!|„Scheinbar suchten die Dorfbewohner nach Lösungen für das Muschki- und das Wauwau-Problem.“	answer|solution|cancellation	çare|çözüm|hâl|çözelti	
Idiot	noun	masculine	Idioten	Und ich Idiot bezahle noch die erste Rate.|Das weiß doch jeder Idiot, dass man damit nicht durchkommt.	idiot|fool	enayi	
Käse	noun	masculine	Käse	Sie mag lieber Käse als Wurst.|Wer hat den Käse zum Bahnhof gerollt?|„Auf dem Markt kauften sie Hirse und Käse.“|Der Käse ist alt und schimmlig, ich würde gerne den Restaurantleiter sprechen.|„Frau Witte kam mit dem Salat und dem Käse.“	cheese|curd|baloney	peynir	penêr|penîr|پەنیر
Kraft	noun	feminine	Kräfte	Die Einheit der Kraft wurde nach Isaac Newton benannt.	force|vigor|potency|might	kuvvet|güç|çalışan	
Spezies	noun	feminine	Spezies	Die Spezies Homo sapiens ist eine sehr spezielle.|„Während der langen Entstehungsgeschichte des Lebens haben sich Millionen unterschiedlicher Spezies entwickelt.“	kind|type|species|chemical species		
Satz	noun	masculine	Sätze	Antworte im ganzen Satz.|„Und es war nur ein einziger Satz gewesen, keine lange Rede.“	sentence|period|set|settlings	cümle|tümce|set|kayıt	hevok
Beerdigung	noun	feminine	Beerdigungen	Die Beerdigung ist für 11 Uhr angesetzt.|„Die Beerdigung findet in extravaganter Atmosphäre in New York statt.“|„Der Beerdigung schloss sich ein Leichenschmaus im Dorfgasthof an.“|„Dann ging ich zurück und besprach die Beerdigung meines Vaters.“	funeral|burial	defnetmek|gömmek	binaxkirin|veşartin
Bild	noun	neuter	Bilder	Weißt du, wer dieses Bild gemalt hat?|Dieses Bild ist von Paul Klee.	picture|painting|photo|image	resim|fotoğraf|akis|yansıma	wêne
Autor	noun	masculine	Autoren	Der Autor dieses Buches heißt Umberto Eco.|Bei Zitaten gibt man immer den Autor an.|Zu der Talkshow waren drei Autoren eingeladen.	author literator|author	kalem erbabı|müellif|yazar	nivîskar
Benzin	noun	neuter	Benzine	Ich habe kein Benzin mehr im Tank.|„Unser Benzin reichte noch weit, und wir fuhren los.“|„Er hatte sicherlich Benzin geladen.“|„Benzin ist eine Mischung verschiedener Flüssigkeiten, eine davon ist Octan.“|„Benzin ist dagegen in Wasser nicht löslich.“	petrol|gas|gasoline|lighter fuel	benzin	benzîn
es	noun	neuter	es	Denke bitte daran in Takt 5 ein es zu spielen!			
Befehl	noun	masculine	Befehle	Er gab den Befehl zum Auslaufen.|Die Befehle des Generals kann ich nicht nachvollziehen.|„Ohne Befehl hätt' ich nie gewagt, was ich gewagt hatte.“|„Mir fiel ein, dieser Befehl könnte Barbaruccia oder ihrem Geliebten gelten.“	order|warrant|command	emir|komut	ferman
Flügel	noun	masculine	Flügel	Der Vogel bewegt seine Flügel und schwingt sich in die Lüfte.	wing|pinna|grand piano	kanat|kuyruklu piyano	
Winter	noun	masculine	Winter	Im Winter ist es kalt, es liegt oft Schnee.|„Im Winter legte er sich die Laufbahn selbst per Schneefräse frei.“	winter	kış	zivistan|زستان
Paar	noun	neuter	Paare	„In Deutschland sind etwa sechs bis zehn Prozent aller Paare ungewollt kinderlos.“|„Die Herzen bebten über die Kühnheit des jungen, schönen, wagemutigen Paares.“	couple|pair	çift	
Nebel	noun	masculine	Nebel	Nebel mit Sichtweiten unter 50 Meter behindert den Verkehr.|„Nebel verbreiten sich, umhüllen den Hintergrund, auch die Nähe, nach Belieben.“|Der Nebel über dem Chalet lichtete sich nur langsam.|„Wir fahren schweigend durch dichten Nebel, der das Scheinwerferlicht des Wagens schluckt.“|„In den Tälern des Siebengebirges, wir sind sicher, hängt der Nebel tief.“	fog|haze|mist|nebula	sis|bulutsu|nebula	mij|مژ
Kreuz	noun	neuter	Kreuze	Das Kreuz ist das Zeichen des Christentums.|Jesus starb am Kreuz.|„Grabsteine und Kreuze waren umgekippt und lagen kreuz und quer übereinander.“	cross|the Cross|sharp|sharp sign	haç|sinek	
Pack	noun	masculine	Packe	Der Einzelhandel verkauft gern im Pack.|„Er griff nach einem Pack Zigaretten.“			
Ratte	noun	feminine	Ratten	Im Keller saß eine große Ratte.	rat	sıçan|keme	cird
Fliege	noun	feminine	Fliegen	Wenn hinter Fliegen Fliegen fliegen, fliegen Fliegen Fliegen nach.|„Eine Fliege krabbelte über die Schreibtischplatte.“|„Und der Geruch aus seinen Wunden lockte zahllose Fliegen herbei.“	fly|bow tie|toothbrush moustache|winged insect	sinek|fiyonk|papyon|bıyık	mêş
Verkehr	noun	masculine	Verkehre	Der Verkehr kommt zum Erliegen. Kein Auto kommt mehr voran.|„Wir nähern uns dem Flughafen, und der Verkehr nimmt zu.“	traffic|contact|communication|intercourse	seyrüsefer|trafik|ulaşım|haberleşme	
Kummer	noun	masculine		All der Kummer und all die Sorgen waren ihr zu viel geworden.|Du solltest deiner armen Mutter nicht so viel Kummer bereiten.|Vor lauter Kummer begann sie, Schokolade in sich hineinzustopfen.|Der Studienplatz ist noch mein geringster Kummer.|„Mit Kummer beenden wir die Eierproduktion und nehmen eine Notschlachtung vor.“|„Auch er hat ihnen noch nie Kummer bereitet.“	grief|sorrow|worry|care	dert|tasa|huzursuzluk	
Linie	noun	feminine	Linien	Ich habe eine Linie gezeichnet.	line|file	doğru|hatt-ı müstakim|hat|çizgi	
Schnee	noun	masculine		Es liegt viel Schnee in den Alpen.|„Er sprach über seine Kindheit und wie er den Schnee geliebt hatte.“|„Der Schnee verkrustete und wurde zu Eis.“	snow	kar	berf|بەفر
Insel	noun	feminine	In.	Guernsey ist eine Insel.	island|isle	ada	girav|دوورگە
Scheiße	noun	feminine		Die Scheiße stinkt fürchterlich.|„Und überall liegt Scheiße, man muss eigentlich schweben.“|„Ich hatte plötzlich am linken Handballen ein wenig Scheiße.“	bullshit|shit	kaka|bok	gû
Gott	noun	masculine	Götter	„Mein Herr und mein Gott“ (Joh 20,28)|„Spätestens seit dem Tod ihrer Ma glaubte Lizzie nicht mehr an Gott.“	God|deity|godhead|god	Allah|Rab|ilah|tanrı	xweda
Palast	noun	masculine	Paläste	„Die farbenprächtigen Paläste sind dem Einfluss zweier konkurrierender Kulturen zu verdanken.“|„Und nach der Wiedervereinigung wird auch dieser Palast abgerissen.“	palace	saray	qesr
Pizza	noun	feminine	Pizzas	Am liebsten esse ich mit Salami belegte Pizza.|„Italien ist das Land von Pizza und Pasta.“	pizza|'za|za	pizza	pizza
Sport	noun	masculine	Sporte	Viel Sport fördert die Gesundheit.	sport|sports	spor	werziş
Aber	noun	neuter	Aber	„David Sinclair bestreitet all die Abers nicht.“	but	ama|fakat|ancak	
Affe	noun	masculine	Affen	Affen sind in der Regel Pflanzenfresser.|„Statt Kamelen sahen wir nun Affen, Esel, Kühe und Pferde.“	monkey|ape|apeman|chimp	maymun	
Schwanz	noun	masculine	Schwänze	„Ein kleiner Hund fegte mit eingezogenem Schwanz um eine Ecke.“|„Anders als Hundsaffen besitzen die Menschenaffen oder Andropomorpha bzw. Hominoidea keinen Schwanz“	tail|pecker|cock|dick	kuyruk|kamış|yarak	
Bus	noun	masculine	Busse	Ich habe leider den Bus verpasst.|„Eingeschlossen sind Verpflegung, Unterbringung, Fahrt im klimatisierten Bus sowie Eintrittsgebühren.“|„Insgesamt 23 der 44 Passagiere des Busses wurden verletzt.“	bus|coach	otobüs	
Bus	noun	masculine	Buses	Da, die Bus kommt.			
Bus	noun	masculine	Busse	Der Bus hat eine Datenbreite von 16 Bit.|„Moderne Systeme besitzen mehrere Busse mit unterschiedlichen Übertragungsraten und Funktionen“	bus	bara|veriyolu	
Seele	noun	feminine	Seelen	Menschen und Tiere haben Seelen, ein Gegenstand jedoch nicht.	soul|message|meaning|core	can|ruh|tin	
Jenseits	noun	neuter		Der ist jetzt im Jenseits.|„Gläubige sind von der Existenz des Jenseits überzeugt.“	afterlife	öbür dünya|diğer taraf	axret
Fahrrad	noun	neuter	Fahrräder	Er hat ein neues Fahrrad geschenkt bekommen.|„Er war vom Fahrrad abgestiegen und schob es.“|„Ich schwang mich aufs Fahrrad.“|„Ich nahm mir mein Fahrrad und radelte los.“|„Ein Fahrrad muss zu einer Frau passen wie ihre Garderobe.“|„Mit Fahrrädern kommt man überall durch.“|„Ich sehe, wie er auf der Straße mit dem Fahrrad davonfährt.“	bicycle|pedal cycle|bike|cycle	bisiklet|çiftteker|derrace|velespit	bisiklet /|bisiklêt|baysikil /|baysikl
Polizist	noun	masculine	Polizisten	Die Polizisten verhafteten 21 gewalttätige Demonstranten.|„Ein junger Polizist eilte den Gang herunter.“	cop|constable|police constable|police officer	polis	
Sofa	noun	neuter	Sofas	Auf dem Sofa saßen schon meine Tanten.|„Vor dem Sofa bleibt Klose stehen und blickt auf den schlafenden Lassehn.“|„Frau von Carayon kniete neben dem Sofa nieder und sprach ihr zu.“	sofa|couch|lounge|settee	kanepe	
Eins	noun	feminine	Einsen	Die Eins ist Teiler aller natürlichen Zahlen.	one	bir	yek
Zeitung	noun	feminine	Zeitungen	Ich lese wenig Zeitung.|„Der Butler legt mir jeden Morgen die Zeitung links neben den Teller.“	paper|newspaper|gazette	gazete|haber|havadis	rojname
Steuer	noun	feminine	Steuern	Wer sich einen guten Steuerberater leistet, zahlt mitunter gar keine Steuern.|„Varus trieb bei den Germanen Steuern ein, auch als Naturalien.“	tax|taxman	vergi|vergi dairesi	bac
Schuld	noun	feminine	Schulden	Mit der Rückgabe des Wagens war die Schuld erloschen.	guilt|fault|debt	görev|vazife|suç|borç	
Sorge	noun	feminine	Sorgen	Mach Dir bloß keine Sorgen!|Ich werde noch ganz krank vor Sorge.|„Die Sorge wurde zur Verzweiflung.“	worry|concern|care	endişe|kaygı|merak	
Ton	noun	masculine	Tone	Der Boden hier besteht zum größten Teil aus Ton.	clay	kil	
Ton	noun	masculine	Töne	Das Rot gefällt mir nicht, ich probiere einen anderen Ton aus.	sound|tone|shade|manners	ses	
Narr	noun	masculine	Narren	Der Narr unterhält seinen König.	court jester|jerk|fool|freak	soytarı|maskara|akılsız|divane	
Arzt	noun	masculine	Ärzte	Ein Arzt hat gelernt, seinen Patienten zu helfen.|Mein Arzt hat noch keinen Doktortitel.|„Der Patient ist nicht immer so, wie der Arzt ihn will.“	doctor|physician|doc|quack	doktor|hekim	bijîşk|doktor|nojdar|پزیشک
Abend	noun	masculine	Abende	Gegen Abend werden wir uns sehen.|Es ist zu früh, „guten Abend“ zu sagen.|Wir haben einen wunderbaren Abend in der Oper verbracht.	evening|eve|eventide|night	akşam|batı|gece	êvar
Ring	noun	masculine	Ringe	Als Zeichen ihrer Verlobung trug sie seinen Ring am Finger.	ring	yüzük|halka	gustîl
Klavier	noun	neuter	Klaviere	„Statt lange zu frühstücken, wollte ich lieber auf dem Klavier spielen.“|Der Flügel ist ein Klavier mit waagrecht liegenden Saiten.|Früher hatte ein Klavier Tasten in Ebenholz und Elfenbein.|Ein Klavier muss regelmäßig gestimmt werden.|Am Klavier Ernst Witt, Gesang: Lilo Wolf.	piano	piyano	
Panik	noun	feminine	Paniken	Panik lässt sich kaum kontrollieren.|„Inzwischen war ich einer Panik nahe.“|„Die Mutter geriet bei allem erst in Panik und dann ins Flachwasser.“|„Eine weiße, vollständig gefühllose Panik setzte alles außer Kraft.“	panic		
Wahnsinn	noun	masculine		Er ist dem Wahnsinn verfallen.|„Ich sage, ein fortschreitender Wahnsinn hindere mich, Aussagen zu machen.“|„John und der Mond ließen diesen Wahnsinn ungebannt.“	insanity|madness|crazy	delilik|hayret	
Star	noun	masculine	Stare	Stare fressen gerne Kirschen.	starling|starlings	sığırcık|sığırcıkgiller	
Star	noun	masculine	Stare	Er ist am grauen Star operiert worden.	cataract|glaucoma leucoma	glokom katarakt	
Star	noun	masculine	Stars	Keiner wird über Nacht zum großen Star.	celebrity|star	star|yıldız	
Teller	noun	masculine	Teller	Er füllte sich einen riesigen Berg auf den Teller.|„Theresa blickte von ihrem Teller auf.“|„Der Butler legt mir jeden Morgen die Zeitung links neben den Teller.“	plate	tabak	
Schlange	noun	feminine	Schlangen	Vorsicht, hier gibt’s Schlangen!|„Es hatte damit begonnen, dass die Alte eine Schlange tötete.“|„Dann sah ich eine Schlange mit einem Kaninchen im Maul.“	snake|serpent|queue|line	yılan|kuyruk|sıra	mar
Weihnachtsmann	noun	masculine	Weihnachtsmänner	Der Weihnachtsmann bringt nur den braven Kindern Geschenke.	Santa Claus|Father Christmas|fathead	Noel Baba	
Erwachsene	noun	feminine	Erwachsene	Ihr dürft nur auf den Spielplatz, wenn eine Erwachsene mitkommt.	adult		
Schuh	noun	masculine	Schuhe	Zieh dir die Schuhe an!	shoe	ayakkabı|pabuç|iskarpin	pêlav|پێڵاو
Preis	noun	masculine	Preise	Der Preis von Wertpapieren wird als Kurs bezeichnet.|„Der Neufund ließ die Preise stürzen, Höchstetters Monopolisierungsversuch wurde zum Verlustgeschäft.“	price|prize	fiyat|nişan|ödül	
Dschungel	noun	masculine	Dschungel	Auch der Dschungel des Amazonasbeckens ist nicht undurchdringlich.	jungle	cangıl|cengel	
Verbindung	noun	feminine	Verbindungen	Zwischen den Häusern gibt es eine unterirdische Verbindung.|Was ist die schnellste Verbindung nach Itzehoe?|„Bereits im 18. Jahrhundert verzeichnen einige Kursbücher erste internationale Verbindungen.“	connection|bond|link|contact	bağlantı|evlilik|ilişki|nişan	
Fenster	noun	neuter	Fenster	Schließe bitte das Fenster, wenn du den Raum verlässt.|Das Fenster bitte nicht öffnen!|Das Fenster ist nach Arbeitsende unbedingt zu schließen.|„Mein Fenster ging auf den Hinterhof hinaus.“|„Alle Fenster standen offen.“	window	pencere|cam|zaman aralığı	pace|pencere|پەنجەرە
Mauer	noun	feminine	Mauern	Wenn wir diese Mauer einreißen, bricht das Haus zusammen.	wall	duvar|sur|Berlin duvarı|set	
Bart	noun	masculine	Bärte	Ich lasse mir einen Bart stehen.	beard|whiskers|bit|teeth	sakal	rî
Gewalt	noun	feminine	Gewalten	Er wurde mit Gewalt aus seinem Auto gezerrt und verprügelt.|Mit Gewalt lässt sich kein Bulle melken.|„Gewalt gegen Frauen ist eine der am weitesten verbreiteten Menschenrechtsverletzungen weltweit.“	violence|power|authority	şiddet|güç|iktidar|kuvvet	tundî
Spanisch	noun	neuter		Die Amtssprache in Chile ist Spanisch.|Das Spanische ist mit dem Portugiesischen verwandt.	Spanish|Ruy Lopez|Spanish Opening|Spanish Game	İspanyolca	spanî
Ärztin	noun	feminine	Ärztinnen	Meine Ärztin hat mir dieses Medikament empfohlen.|Samanthas Töchter sind beide Ärztinnen geworden.|„Joyce sagt, dass sie früher Ärztin werden wollte.“|„Besonders im Examen mußten sich die angehenden Ärztinnen auf alles gefaßt machen.“	doctor|physican		
Penis	noun	masculine	Penisse	Er zog ein Kondom über seinen Penis.|Schlangen haben zwei Penes.|„Auch die Religion im alten Ägypten begann mit dem Penis.“	penis|cock|dick|prick	penis ; sik|yarak	kîr
Wichser	noun	masculine	Wichser	Er ist ein Wichser.	jerk|masturbator|wanker|bastard		
Brust	noun	feminine	Brüste	Er hat ständig Schmerzen in der Brust.|„Ein diskretes Logo an der Brust verriet die exquisite italienische Marke.“	breast|chest|thorax|bosom		sîng
Magen	noun	masculine	Mägen	Ich habe mir gestern gründlich den Magen verdorben.|Das liegt aber schwer im Magen.|„Mein Magen krampfte und mir war speiübel.“|„Der Alkohol im Magen des Anderen begann wieder mit der Bewegung.“	stomach|maw	mide	gede|mîde|گەدە
Spiel	noun	neuter	Spiele	Wir dachten uns immer neue Spiele aus.|„Es gab keine Spiele, Spaziergänge oder Siestas mehr.“	game|play|match|clearance	oyun|çalma|oynama|boşluk	lîstik
Schlaf	noun	masculine		Er versank in einem tiefen Schlaf.|„Bald umfing ihn der Tröster der Müden und Traurigen, ein tiefer Schlaf!“	sleep|rheum . sleepydust|eye boogers|sleepers	uyku|çapak	xew
Tochter	noun	feminine	Töchter	Meine Tochter wurde vor kurzem erst eingeschult.	daughter|girl	kız|kız evlat	dot|keç
Revolution	noun	feminine	Revolutionen	„Die Revolution ist wie Saturn, sie frißt ihre eigenen Kinder.“|„Die deutsche Revolution fand ein unwissendes Volk, eine Führerschicht bürokratischer Biedermänner.“	revolution	devrim|inkılap|ihtilâl	şoreş
Farbe	noun	feminine	Farben	Die Farben haben eine hohe Brillanz.|„Unbestreitbar haben Farben für uns wichtige Orientierungsfunktionen, aber sie sind nicht unverzichtbar.“	colour|color|paint|tan	renk|boya	reng
Firma	noun	feminine	Firmen	Der Rechtsformzusatz ist Bestandteil der Firma.	firm|business|company	firma|şirket	
Sohn	noun	masculine	Söhne	In Dynastien sind oft nur die Söhne erbberechtigt.	son	oğul	kur|law|کوڕ
Arsch	noun	masculine	Ärsche	Da bin ich auf meinen Arsch gefallen.|„Sie lassen sich Haut vom Arsch ins Gesicht verpflanzen.“	arse|ass|bootie|booty	göt|kıç	
Bruder	noun	masculine	Brüder	Dein Bruder wohnt drei Straßen weiter.|„Später, viel später, ging ich mit dem Bruder an den Rhein.“	brother|monk	birader kardeş|ağabey	bira
Schwester	noun	feminine	Schwestern	Meine Schwester geht in die 8. Klasse.|„Der kleine Bruder half der großen Schwester.“	sister|sis|nurse	bacı|abla|kız kardeş|hemşire	xwişk
Blödmann	noun	masculine	Blödmänner	Dem Blödmann habe ich schon zehnmal gesagt, was er machen soll!|„Und der Blödmann kommt bestimmt wieder.“	dunce|stupid|idiot|bastard		
Nichte	noun	feminine	Nichten	Meine Nichte macht immer Blödsinn.|„Seine Nichte tat, was er ihr sagte.“	niece		
Onkel	noun	masculine	Onkel	Mein Onkel Richard wohnt in Amsterdam.|„So gesehen ist hier Onkel Gerhard der Außenseiter.“|„Mein Onkel sprach weiter.“	uncle	amca|dayı	xal
Tante	noun	feminine	Tanten	Meine Tante Martha, die älteste Schwester meiner Mutter, kommt zu Besuch.	aunt	hala	met
Herz	noun	neuter	Herzen	Das Herz pochte in seiner Brust.|„Das Herz schlug schnell, und er atmete heftig.“|„Aref machte einen Gesichtsausdruck, als litte sein Herz unter der Fremdherrschaft.“	heart	yürek|kalp|gönül|kupa	dil
Hurensohn	noun	masculine	Hurensöhne	„Lasst mich los, ihr sollt mich loslassen, ihr Hurensöhne!“|„Der Hurensohn hat mehr Einfluss, als wir gedacht hatten.“|„Und eines Tages werde ich dem Hurensohn den Gnadenschuss verpassen.“	son-of-a-bitch|son of a bitch|whoreson|bastard	orospu çocuğu	
Cousin	noun	masculine	Cousins	Mein Cousin Markus B. ist ein toller Mensch.|„Der junge Drubezkoi, Ihr Cousin, bemüht sich auch kräftig um sie.“	cousin	kuzen|amcaoğlu|halaoğlu|dayıoğlu	
Cousine	noun	feminine	Cousinen	Meine Cousine ist auch eine schöne Frau.|Ich sehe meine Cousine Klara nur zum Geburtstag meiner Oma.|„Meine Cousine hat ihr Haus in Moers von zwei Polen streichen lassen.“|„Ich suchte meine Cousinen auf.“	cousin	kuzin	
Höhe	noun	feminine	Höhen	Auf welcher Höhe liegt die Berghütte?|Er sollte die Höhe und Tiefe des Schranks nachmessen.	elevation|height|hight altitude	düzey|seviye|irtifa|yükseklik	
Strom	noun	masculine	Ströme	Der Strom der Flüchtlinge reißt nicht ab; es fliehen weitere Menschen.|„Außerdem regnete es in Strömen, und ich hatte keinen Regenschirm.“	current|stream|flow|river	akım|nehir|cereyan	
Fieber	noun	neuter	Fieber	Er lag mit 40 (Grad) Fieber im Bett.|Der Krankheitsverlauf ging mit Fieber einher.|„Das Fieber stieg noch immer und hatte schon fast einundvierzig Grad erreicht.“|„Das Fieber ließ sich senken.“	fever	humma|ateş	ta|agir
Ehe	noun	feminine	Ehen	„Ehe und Familie stehen unter dem besonderen Schutze der staatlichen Ordnung.“|„Die Ehe als Familienform ist in Deutschland rückläufig. Lebengemeinschaften haben sich verdoppelt.“|„Ehe und Eheglück, das ist anscheinend ein Synonym.“|Die Ehe wurde geschieden.	marriage|matrimony|wedlock	evlilik	zewac|jinûmêrî|hevserî
Hof	noun	masculine	Höfe	Das Gut war im Geviert gebaut und umschloss einen geräumigen Hof.	yard|courtyard|patio|farm	avlu	
Boden	noun	masculine	Böden	Die Tasse fiel auf den Boden.	ground|earth|soil|bottom	yer|zemin|toprak|dip	
Stiefel	noun	masculine	Stiefel	Im Winter trägt man meistens Stiefel.|„Zuletzt hat er mir Stiefel geschickt.“	boot	çizme	
Doktor	noun	masculine	Dres.	Ich bin zu meinem Doktor gegangen.|Die Frau Doktor hat uns sehr geholfen.	doctor|physican	doktor	
Kunst	noun	feminine	Künste	Die Kunst dieses Goldschmieds ist eine wahre Pracht.	art	sanat|beceri|maharet|ustalık	huner
Kultur	noun	feminine	Kulturen	Das Ökosystem des Menschen ist seine Kultur.|Was ist nicht alles Kultur?|„Ich habe eine jahrtausendealte Kultur kennengelernt und spektakuläre Landschaften gesehen.“	culture|civilization	kültür	çand
Großmutter	noun	feminine	Großmütter	Ich war gestern bei meiner Großmutter.|Frau Klemert ist letzte Woche Großmutter geworden.	grandmother	büyükanne|nine|babaanne	
Verkauf	noun	masculine	Verkäufe	Der Verkauf seines Hauses brachte ihm etwas Geld ein.|Einige Hersteller bieten auch für Privatkunden Verkauf ab Werk an.|Die Meisten verlangen im Verkauf das Doppelte.	sale|selling|sales department|sales	satış|satış bölümü	firotin
Rose	noun	feminine	Rosen	„Ich habe eine Rose für dich gepflückt.“|Früher wurden als Grabschmuck oftmals Rosen verwendet.|Kosmetikprodukte mit Rosenextrakten pflegen die Haut besonders effektiv.	rose|rose window	gül	
Herr	noun	masculine	Herren	Dieser Herr hier wollte mit Ihnen reden.|Meine Damen und Herren…|„Ein Radfahrer fährt einen alten Herrn um.“	gentleman|mister|sir|master	beyefendi|bey|bay|efendi	
Schüler	noun	masculine	Schüler	Oft arbeiteten die Schüler bis tief in die Nacht.|„Ich war ein miserabler Schüler.“	pupil|student|disciple	öğrenci|öğrenici|talebe	
Hure	noun	feminine	Huren	Er trieb sich mit Huren herum.|„Nicht jeder weibliche Sträfling war eine Hure.“	whore|strumpet|harlot|bitch	fahişe|hayat kadını	
Krawatte	noun	feminine	Krawatten	Zu diesem Anzug trage ich heute eine dunkelblaue Krawatte.|„Er lockerte seine Krawatte und grinste.“	necktie|tie	kravat	
Alkohol	noun	masculine	Alkohole	In diesem Bier sind 5 % Alkohol enthalten.|„Oft sind Alkohol und Drogen im Spiel.“|„Im Ernst: Zu viel Alkohol ist schädlich für Körper und Geist.“	alcohol	alkol	alkol
Teil	noun	neuter	Teile	Wie passen die Teile zusammen?	deal|part|piece	kısım|parça|şey	
Teil	noun	masculine	Teile	Diese Aufgabe wird Teil der Prüfung am nächsten Dienstag sein.|„Bei Zirkusakrobaten, Kunstturnern, Eiskunstläufern, Kunstfliegern werden Vertigoerlebnisse Teil einer künstlerischen Gesamtleistung.“	part|portion|fraction	bölüm|kısım	
Mut	noun	masculine		Er bewies seinen Mut, indem er über die gefährliche Brücke ging.|Mut hat Perspektiven, während Tapferkeit allenfalls Hoffnung haben kann.	courage|confidence|optimism	cesaret	cesaret|wêrekî
Papier	noun	neuter	Papiere	Kleidung aus Papier hat sich nicht bewährt.|„Papier ist geduldig, das gilt auch für manche Mieteinnahmen-Auflistungen.“|„Der Ursprung unseres geschätzten Papieres ist in China zu finden.“	paper|document	kâğıt	kaxez|per|کاغەز
Beruf	noun	masculine	Berufe	Ich bin Bergmann von Beruf.|Welchen Beruf hast du erlernt?|„Sein Beruf ist ungemein nützlich und skandalös unmenschlich.“|„Der Beruf hatte mich ausgelaugt.“|„Von seinem Beruf spricht Robert eher beiläufig und dann abfällig.“	profession|trade|occupation|job	meslek	
Versager	noun	masculine	Versager	Schon wieder nichts verkauft! Du bist echt ein Versager!|Männer mit Erektionsstörungen fühlen sich schnell als Versager.|„Mein Vater hatte mir gesagt, ich würde immer ein Versager sein.“	loser		
Gesundheit	noun	feminine		Ich gebe meiner Gesundheit den Vorrang.|Das schadet deiner Gesundheit!|Er sollte mehr für seine Gesundheit tun.|Seine Gesundheit lässt sehr zu wünschen übrig.	health	sağlık|sıhhat	tenduristî
Hölle	noun	feminine	Höllen	Dieses Leben ist die Hölle.	hell	cehennem	
Sex	noun	masculine		Ich kenne mich mit (dem Thema) Sex nicht aus.	sex	cinsellik|seks|cinsel ilişki	
Punkt	noun	masculine	Punkte	Die Ortschaft ist auf der Landkarte nur als winziger Punkt abgebildet.	point|full stop|full point|period	nokta|yer|puan	xal
Bach	noun	masculine	Bäche	Es führte ein kleiner Steg über den Bach.|„Lustig quasselt der seichte Bach. / Scheinchen scheppern darüber flach.“|„Auf jeden Fall war dieser Bach die spirituelle Quelle unseres Bezirks.“	brook|creek|stream|burn	akarsu|çay|dere	co
Fluss	noun	masculine	Flüsse	Die größten Flüsse Deutschlands sind der Rhein, die Donau und die Elbe.	river|fluency|flow|flux	ırmak|nehir|akış	robar|çem|ro|ڕووبار
Lied	noun	neuter	Lieder	Lasst uns das Lied „Hänschen klein“ singen!	song	şarkı	stran
Single	noun	masculine	Singles	Du hast einen Freund? Du hast es gut. Ich bin noch Single.|„Für einen Single der Neuzeit war seine Wohnung ziemlich groß.“	single		
Single	noun	feminine	Singles	Hast du die neue Single von Sänger XY schon gekauft?|„Renate war nicht da, und ich konnte endlich meine Single hören.“	single		
Küche	noun	feminine	Küchen	Wir frühstücken immer in der Küche.|„Unterdes bot die Küche in der Lindenallee ein merkwürdiges Bild.“|„In der Küche roch es nach Lebkuchen und Zimt.“|„Ich machte kehrt und ging in die Küche zurück.“	kitchen|cuisine|cooking	mutfak	
Gesetz	noun	neuter	GG.	„Alle Menschen sind vor dem Gesetz gleich.“	law|act|scientific law|principle	karar|kanun|yasa|kaide	zagon
Tür	noun	feminine	Türen	Plötzlich klopft es an die Tür.|Kannst du bitte die Tür zumachen!|Am nächsten Tag stand die Polizei vor der Tür.	door	kapı	derî
Morgen	noun	masculine	Morgen	„Das sind doch Brötchen vom gestrigen Morgen!“, beschwerte er sich.|Da ward aus Abend und Morgen der erste Tag.	morning|morgen|good morning	sabah	sibe
Diskussion	noun	feminine	Diskussionen	Unsere Diskussion ist leider ergebnislos geblieben.|Darüber gibt es keine Diskussionen.|„Die Diskussion dauerte zweieinhalb Stunden, bis das Schulgebäude abgesperrt werden mußte.“	discussion	görüşme|müzakere|tartışma	nîqaş
Krankheit	noun	feminine	Krankheiten	Diese Krankheit wird auch vorübergehen.|„Wahrscheinlich sterben viele an Krankheiten wie Malaria, andere an mangelhafter Ernährung.“	illness|sickness|disease	hastalık|hasta olma	nexweşî
Universität	noun	feminine	Universitäten	Alex studiert an der Universität in Magdeburg.|„Die Universität Cambridge ist eine der ältesten und berühmtesten der Welt.“|„Gewiß muß die Universität zum Teil von dieser Welt sein.“|„Die Universitäten wollen den Studierenden künftig wieder mehr Raum für Sinnfindung geben.“	university	üniversite	zanîngeh|زانکۆ
Fabrik	noun	feminine	Fabriken	In dieser Fabrik arbeitete schon mein Vater.|Es wurde entschieden, dass die Fabrik an den Stadtrand verlegt wird.|„Ganze Fabriken fuhren die Produktion schlagartig herunter.“	factory|plant	fabrika	كارگه|كۆمپانیا
Erfolg	noun	masculine	Erfolge	Ich habe versucht es zu reparieren – leider ohne Erfolg.|„Dem genügsamen, arbeitsfrohen Puritanertum des Vaters genügte der eigene Erfolg keineswegs.“	success	başarı|muvaffakiyet	serkeftin
Grenze	noun	feminine	Grenzen	An der Grenze gibt es eine Zollstation.	border|borderline|boundary	hudut|sınır	sînor
Heroin	noun	feminine	Heroinnen	„Warum sollte sie, Aroma, es jenen Heroinnen nicht gleich tun?“	heroine		
Norden	noun	masculine		Wir müssen nach Norden gehen, um den Teich zu finden.	north|North		bakur
Süden	noun	masculine		Im Herbst fliegen die Schwalben nach Süden.|Es weht ein warmer Wind aus Süden.	south	güney	başûr
Osten	noun	masculine		Im Osten geht die Sonne auf.|„Im Osten flammte ein schmaler, heller Streifen über der Kimm auf.“	east	doğu|meşrik|Doğu Bloku	rojhilat
Stoff	noun	masculine	Stoffe	Meerwasser enthält viele gelöste Stoffe.	substance|material|fabric|cloth	malzeme|kumaş|konu|madde	
Wind	noun	masculine	Winde	Winde wehn / Schiffe gehn / Weit in ferne Land'|„Der Wind hier weht grundsätzlich von vorn.“|„Der Wind blies mit Sturmstärke landwärts.“	wind|windiness|flatulence|windy spasm	rüzgar|yel|osuruk	ba|با
Sturm	noun	masculine	Stürme	„Der Sturm forderte seine ganze Aufmerksamkeit und scherte sich nicht um ihn.“	storm|assault|attack|forward line	fırtına	
Fass	noun	neuter	Fässer	Zur Silberhochzeit seiner Schwester kaufte er ein großes Fass Bier.	barrel	fıçı	
Glück	noun	neuter		„Wenn mein Glück aussetzt, bin ich verloren.“ (Bert Brecht)|Ich habe Glück in der Lotterie gehabt.	luck|fortune|chance|happiness	şans|mutluluk|saadet	
Zelt	noun	neuter	Zelte	Baue bitte das Zelt auf.|Das Zelt wird diesem Wind nicht standhalten.|„Die Zelte wurden abgebaut, die Affenbrücke eingeholt.“|„Ich schlief in Hannas Zelt.“|„Einige Minuten später lässt er uns vor mehreren beigefarbenen Zelten aussteigen.“	tent	çadır	kon|çadir|xîvet
Ritter	noun	masculine	Ritter	Er ist schon lange Ritter des Hosenbandordens.	knight	şövalye	
Museum	noun	neuter	Museen	Ein Besuch des Museums lohnt sich immer.|„Stattdessen brachte man sie im Museum selbst unter, nicht immer im Idealzustand.“|„Wir sind an einem Freitag hier, das Museum ist geschlossen.“	museum	müze	muze
Westen	noun	masculine		Im Westen grenzt Frankreich an den Atlantik.|„Der Westen war ein Feuermeer in der untergehenden Sonne.“	west|Western Germany|Mainland West		rojava
Witz	noun	masculine	Witze	Er kennt sehr gute Witze.|„Vielleicht stammte dieser Witz aus der Giftküche von Goebbels.“	joke|gag|wit|wittiness	espri|şaka|fıkra	
Strand	noun	masculine	Strände	Wir gehen an den Strand.|„Der Stille Ozean brandete mit eintönigem Rauschen gegen den Strand.“|„Die Ostsee leckte träge und breit den Strand.“|„Er riß den Motor wieder an und steuerte dem Strand zu.“|«Und ein lauer Tropenregen fällt auf den erhitzten Strand.»|„Der Strand war menschenleer und öde.“|„Wir sind heute zum Strand rausgefahren.“	beach|shore|strand	kumsal|plaj|sahil	berav
Entscheidung	noun	feminine	Entscheidungen	Das ist eine sehr schwierige Entscheidung für mich.	decision|ruling|judgment|verdict	karar|hüküm|hüküm verme	
Karte	noun	feminine	Karten	Leg eine Karte ins Buch hinein, wo du aufhörst zu lesen.	card|billett|chart|map	kart|bilet	
Jahrhundert	noun	neuter	Jahrhunderte	Das letzte Jahrhundert hat viele Kriege gesehen.	century|centennial	yüzyıl|asır	sedsal
Symbol	noun	neuter	Symbole	Jeanne d'Arc war ein Symbol des französischen Widerstands.	symbol|icon	sembol|simge	
Geschichte	noun	feminine	Geschichten	Der Wikipedia-Artikel beschreibt ausführlich die Geschichte des öffentlichen Nahverkehrs.|„Die klassische Ära der industriellen Massenproduktion ist Geschichte, jedenfalls in Europa.“	history|story|tale|concern	hikâye|öykü|tarih|mesele	dîrok|çîrok
Gesellschaft	noun	feminine	Gesellschaften	Die Integration von Ausländern in die Gesellschaft muss verbessert werden.	society|company|reception	cemiyet|toplum|şirket|davetliler	civak
Körper	noun	masculine	Körper	Tu mal was für deinen Körper!|Sein Körper war groß, gebräunt und durchtrainiert.|„Ein Korsett von weißen Bandagen hält den Körper zusammen.“|„In seinem Körper war eine wunderbare Stille.“	body|torso|trunk|object	beden|vücut|cisim	laş
Gerade	noun	feminine	Geraden	Diese Gerade geht durch den Ursprung des Koordinatensystems.	straight line|straight|jab	doğru	xêza rast
Fuß	noun	masculine	Füße	Der Fuß ist mit dem Unterschenkel gelenkig verbunden.|„Ich legte auf und schwang die Füße auf den Schreibtisch.“|„Eine steinerne Säule mit Inschrift gibt die Höhe in Fuß an.“	foot|leg|base	ayak	pî
Organisation	noun	feminine	Organisationen	Ein Schachbrettmuster weist ein hohes Maß an Organisation auf.	organization|organisation	düzen|kuruluş|oluşum|organizasyon	rêxistin
Platz	noun	masculine	Plätze	„Und damit trat er wieder auf den Platz hinaus.“|„Auf einem sandigen Platz blieb ich stehen.“	circus|square|plaza|place	alan|meydan|saha|yer	cîh
Killer	noun	masculine	Killer	Er hat einen Killer engagiert, der sie töten soll.	hitman|killer		
Kaiser	noun	masculine	Kaiser	England hat keinen Kaiser, England hat Könige und Königinnen.	tsar|csar|emperor	çar|imparator	qeyser
Fest	noun	neuter	Feste	Wir feiern heute ein Fest.|„Weihnachten ist das Fest der Familie.“|„Deshalb ist dieses Fest das vielleicht wichtigste überhaupt.“|„Erst die Reformation machte dem Fest ein Ende.“	feast|festival|party|jollity	bayram|yortu	
Monster	noun	neuter	Monster	Ein Monster attackierte die Stadt.	monster		
Beute	noun	feminine		Die Täter entkamen mit einer Beute von 500 000 Euro.|„Schließlich hatten sie auch so schon genug Beute gemacht.“|„Mit unserer reichen Beute wurden wir vom Boot freudig begrüßt.“	booty|loot|haul|spoils		
Beute	noun	feminine	Beuten	„Den Bienen ist es egal, in welcher Beute sie wohnen.“			
Besuch	noun	masculine	Besuche	Wir werden Euch einen Besuch abstatten.|Er kündigt seinen Besuch für den Nachmittag an.	visit|call stay|attendance|guest	ziyaret|misafir	
Baden	noun	neuter		An dieser Stelle ist das Baden verboten.	bathing|dipping		
Dutzend	noun	neuter	Dutzende	Ich habe heute zwei Dutzend Äpfel gekauft.|„Er schlägt ein Dutzend Eier hinein.“	dozen|dozens of	düzine|düzineler	
Tropfen	noun	masculine	Tropfen	Ein paar Tropfen der Flüssigkeit fielen auf den Boden.|„Nach einiger Zeit erscheinen die ersten stillen Tropfen auf dem Glas.“	drop|wine	damla	dilop
Tropfen	noun	neuter		Dieses unaufhörliche Tropfen macht mich nochmal wahnsinnig!	dripping		
Held	noun	masculine	Helden	Dieser Held rettete seine Frau und Kinder aus dem brennenden Haus.	hero|protagonist	kahraman	
Verräter	noun	masculine	Verräter	Der Verräter wurde hingerichtet.|„Die Kämpfer attackieren jeden, den sie für einen Verräter halten.“	traitor		
Gehirn	noun	neuter	Gehirne	Das Gehirn selbst ist schmerzunempfindlich.|Übermäßiger Drogenkonsum zerstört die Zellen im Gehirn.|„Das Gehirn allerdings arbeitete noch gut, noch relativ gut.“	brain|mind	beyin	mejî|مێشک
Leib	noun	masculine	Leiber	„Der Leib des Anderen zuckte wie ein ausgerissenes Spinnenbein.“|„Im Schutzwall ihrer Leiber schlossen sie ihn ein.“	body|trunk|belly|stomach	beden|gövde|karın|mide	
Stift	noun	masculine	Stifte	Dieses Laufrad lässt sich mit einem Stift befestigen.	pivot|pin|spike|stem	kalem	
Stift	noun	masculine	Stifte	Der Bursch ist so klein gewachsen, dass ihn alle einfach Stift nennen.	trifle|shaft|prick|midget		
Stift	noun	neuter	Stifte	Das Stift dieses geistlichen Kollegiums ist mit Grundbesitz und Vermögen ausgestattet.	foundation|charitable foundation|canonical college|convent		
Geschmack	noun	masculine	Geschmäcke	Mein Geschmack täuscht mich nie!	sense of taste|taste|flavour	tatma duyusu|tadım|tat|çeşni	
Heimat	noun	feminine	Heimaten	Nach zehn Jahren kehrte er in seine alte Heimat zurück.	home|homeland	memleket|yurt	welat
Vertrauen	noun	neuter		Er genießt mein vollstes Vertrauen.|„Ja, sie fühlte sich geschmeichelt durch so viel Vertrauen.“|„Der uralte Tauschhandel war auf menschliche Tugenden wie Vertrauen und Verlässlichkeit gegründet.“	trust|confidence	güven|itimat	pêbawerî
Hoffnung	noun	feminine	Hoffnungen	Du darfst die Hoffnung nie aufgeben.|„Die Hoffnung ist der Wille der Schwachen.“	hope		hêvî
Admiral	noun	masculine	Admirale	Der Admiral entspricht dem General bei Heer und Luftwaffe.	admiral|Red Admiral	amiral	
Ende	noun	neuter	Enden	Du musst das Ende der Geschichte abwarten!	end		dawî
Fleisch	noun	neuter		Das Fleisch wird noch vom restlichen Fell befreit.	flesh|meat	et	
Welt	noun	feminine	Welten	Ein Globus ist ein Modell der Welt.|"Die Welt ist schon oft mit einem Narrenhause verglichen worden."|„Amerika ist nicht die Welt.“	Earth|World|world	Dünya|Yerküre|âlem|evren	dinya
Team	noun	neuter	Teams	Wir müssen ein Team bilden.|„Wir waren das perfekte Team, zwei bös verkaterte Isländer auf den Färöern.“	team	ekip|takım|tim	
Geist	noun	masculine	Geister	Der menschliche Geist kann manche Dinge einfach nicht erfassen.	mind|spirit|ghost	zihin|ruh|hayalet	
Ordnung	noun	feminine	Ordnungen	Die Nager sind eine Ordnung der Säugetiere.	order|tidiness	düzen|tertip	
Kapitän	noun	masculine	Kapitäne	Wer ist der Kapitän dieses Schiffes?|Der Kapitän hat seine Sache sehr gut gemacht.	captain|master|commander|skipper	kaptan	
Traum	noun	masculine	Träume	Ich hatte gestern einen schönen Traum.|Wer kann schon meinen wirren Traum deuten?	dream	rüya|hayal	xewn
Verdienst	noun	masculine	Verdienste	Ihr Verdienst wird Ihnen natürlich jeden Monat auf Ihr Konto überwiesen.	wages|earnings|income		
Verdienst	noun	neuter	Verdienste	Er wurde für seine Verdienste ausgezeichnet.|„Dieses Talent ist kein Verdienst, es ist ein Geschenk.“	merit		
Elf	noun	masculine	Elfen	„Elfen schieben Menschen dem Volksglauben nach auch Wechselbälger unter.“	elf		
Elf	noun	feminine	Elfen	Auf die Zehn folgt die Elf.	eleven|football team		
Suppe	noun	feminine	Suppen	Vor dem Hauptgang servierte uns der Kellner eine schmackhafte Suppe.|„Hier aß man Fleisch, feine Suppen und Nachspeisen.“|„Bei der Rückkehr ins Kloster werde sie ihr eine Suppe bringen.“|Morgens bekam die Patientin eine klare Suppe.	soup	çorba	şorbe
Freund	noun	masculine	Freunde	Er ist mein bester Freund.|Die zwei da waren mal enge Freunde.|„Ich habe einen Freund in Austin, der ein sehr erfolgreicher Schriftsteller ist.“|Robert und Jonas sind seit über 14 Jahren beste Freunde.	friend|boyfriend	arkadaş|dost	heval
Wüste	noun	feminine	Wüsten	In der Wüste Sahara herrscht die meiste Zeit des Jahres extreme Trockenheit.|„Und da begann auch schon die Wüste.“	desert|waste|wasteland	çöl	sehra
Tiger	noun	masculine	Tiger	Menschen werden nur selten von Tigern angegriffen.	tiger	kaplan	
Gefühl	noun	neuter	Gefühle	Meine Gefühle nach diesem Verlust kann ich im Moment gar nicht beschreiben.|„Alle Teile sind von einer neuen Auswertung von Gefühlen oder Affekten geprägt.“|„Das Gefühl übermannte mich; doch ich empfand eher Scham als Rührung.“|„Allein gelassen werden ist ein Gefühl, dass viele der Befragten teilen.“	affection|emotion|feeling|impression	duygu|his	hest
Rätsel	noun	neuter	Rätsel	Für dieses mathematische Rätsel gibt es mehrere Lösungen.|Ich nehme in den Urlaub eine ganze Aktentasche voll Rätsel mit.|„Blitzartig erkannte ich des Rätsels Lösung.“|„Sie kehrt an den Tisch zu ihren Rätseln zurück.“	puzzle|riddle|enigma|mystery	bilmece|bulmaca|muamma	
Pech	noun	neuter	Peche	Pech ist eine schwarze klebrige Masse.|„Der Kapitän hatte Cooper befohlen, etwas Pech in der Kombüse zu kochen.“	pitch|bad luck|tough luck|misfortune	bitum|aksilik|şanssızlık|talihsizilik	
Lehrer	noun	masculine	Lehrer	Der Lehrer erklärt mir die Grundrechenarten.|Der Lehrer hat vormittags recht und nachmittags frei.|„Und nicht nur die Schüler, auch die schlecht bezahlten Lehrer fehlen oft.“	teacher|instructor|tutor	hoca|öğretmen	mamoste|fêrker|hînker|perwerdeker
Zehn	noun	feminine	Zehnen	Die Zehn ist der Nachfolger der Neun.	ten		
Acht	noun	feminine	Achten	Die Acht ist der Nachfolger der Sieben.|Die Zahl 88 besteht aus zwei Achten.	eight|buckled wheel|twisted rim|handcuffs		
Acht	noun	feminine		„Dabei bleibt jedoch die Zeitstruktur, die notwendige Momenthaftigkeit, außer Acht.“	attention|care		
Fünf	noun	feminine	Fünfen	Die Fünf ist der Nachfolger der Vier.|Die Fünf ist eine Primzahl.	five		pênc
Sechs	noun	feminine	Sechsen	Die Sechs ist der Nachfolger der Fünf.	six		şeş
Sieben	noun	feminine	Siebenen	Die Sieben ist der Nachfolger der Sechs.|Die Sieben ist eine Primzahl.	seven		
Sieben	noun	neuter		Ich bringe die Bodenproben gleich zum Sieben.			
Neun	noun	feminine	Neunen	Die Neun ist der Nachfolger der Acht.	nine		
Vier	noun	feminine	Vieren	Die Vier ist eine gerade Zahl.	four		
Drei	noun	feminine	Dreien	Die Drei ist eine Primzahl.	three		
Zwei	noun	feminine	Zweien	Die Zwei ist die einzige gerade Primzahl.	two		
Zwölf	noun	feminine	Zwölfen	Die Zwölf ist der Nachfolger der Elf.	twelve|o'clock		
Null	noun	feminine	Nullen	Nach der Null folgt die Eins.|Die Null ist gerade und sie ist weder positiv noch negativ.	zero|cipher|loser	sıfır	
Sieg	noun	masculine	Siege	Die Mannschaft freute sich ihres Sieges im Pokalendspiel.|„Doch der erste Sieg ihres Feldzugs wird auch der einzige bleiben.“	victory	zafer	serkeftin
Pflicht	noun	feminine	Pflichten	Als Polizist ist es seine Pflicht, gegen das Verbrechen zu kämpfen.|„Manche staunen, wenn Frau Jähnichen die kleingärtnerischen Pflichten herunterbetet.“	duty|obligation|business|care	görev|vazife|mükellefiyet	
Fall	noun	masculine	die Fälle	Das Kind kam zu Fall.	fall|case|drape|rake	durum|vaziyet|hâl|ismin hâli	
Fall	noun	neuter	Fallen	Er zog die Segel hoch mit dem Fall.|Das Großfall verklemmte, daher konnte das Segel nicht mehr geborgen werden.	halyard		
Kreis	noun	masculine	Kreise	Das sollten wir in kleinerem Kreise besprechen.	circle|district	çember|daire|bucak|ilçe	
Sinn	noun	masculine	Sinne	Blinde haben oft sehr ausgeprägte andere Sinne wie ein feines Gehör.|Ich habe für so etwas einen siebten Sinn.	sense|meaning		
Unsinn	noun	masculine		Was für einen Unsinn sie da wieder von sich gibt!|Du glaubst wohl auch jeden Unsinn, oder?|Unsinn! So geht das nicht, schau mal hier, wie man das macht.	nonsense		
Partei	noun	feminine	Parteien	Bei einem Streit gibt es zumeist zwei Parteien, die verschiedene Ziele verfolgen.	party	hizb|parti	پارتي
Salat	noun	masculine	Salate	Wegen der Schnecken pflanzen wir keinen Salat.|„Der Salat sprießt, und der Weißkohl ist auch kräftig gewachsen.“	lettuce|salad	salata	selete
Oma	noun	feminine	Omas	Meine Oma arbeitet in einem Supermarkt.	grandmother|granny|gran	nine	
Akzent	noun	masculine	Akzente	Ich spreche zwei Fremdsprachen fließend und ohne Akzent.|„Doch ihren Akzent sind sie nie losgeworden.“|„Madam hatte einen eleganten Akzent.“	accent|stress|emphasis	aksan|şapka	
Bibliothek	noun	feminine	Bibliotheken	In Bibliotheken kann man immer interessante Bücher entdecken.	library	kütüphane	pirtûkxane
Fußball	noun	masculine	Fußbälle	Er spielt für sein Leben gern Fußball.|Die deutsche Frauen-Nationalmannschaft ist 2009 das siebente Mal Fußball-Europameister geworden.|„Fußball ist keine Religion, da seine Regeln nicht auf übermenschliche Gebote zurückgehen.“|„Ich nahm an diesen Runden teil, obwohl mich Fußball überhaupt nicht interessierte.“|„Jedenfalls kam Ögmundur über das Thema Fußball mit jedem ins Gespräch.“	football|soccer|soccer ball	ayak topu|futbol|top	futbol|goga futbolê
Dieb	noun	masculine	Diebe	Hier waren Diebe am Werk und haben alles mitgenommen und weggeschleppt.|„Ein erfahrener Dieb würde ohnehin nie über einen Zaun wie diesen klettern.“	thief	hırsız	diz
Rad	noun	neuter	Räder	Ein Fahrrad hat zwei Räder.	wheel|bike|bicycle|breaking wheel	teker|tekerlek|bisiklet	çerxe
Rad	noun	neuter	Rad	Heutzutage ist die Einheit Rad nur selten verwendet.	rad		
Widerstand	noun	masculine	Widerstände	Diese Jacke besitzt einen hohen Verschleiß-Widerstand.	resistance|resistor		
Albtraum	noun	masculine	Albträume	Nach diesem Erlebnis habe ich immer noch Albträume.	bad dream|nightmare	kâbus|karabasan	
Interesse	noun	neuter	Interessen	Sie hat großes Interesse an diesem Thema.	interest|pick-up|concern	merak|menfaat	
German	noun	neuter	Germane	„Höhere Germane wie Digerman (Ge₂H₆) haben einen höheren Schmelzpunkt.“	germane		
Identität	noun	feminine	Identitäten	Die Gleichheit der Identitäten der beiden Personen ist nicht erwiesen.|„Seine Identität war die Summe vielfältiger Rollen.“|„Dank einer falschen Identität überlebte Sally Perel den Holocaust.“	identity	hüviyet|kimlik|denklik	
Missverständnis	noun	neuter	Missverständnisse	Das war ein Missverständnis. Er wollte eine Tafel Schokolade, kein Schokoladengetränk.|„Sehen wir uns zunächst an, wie die Missverständnisse aussehen.“|Lass uns erst einmal alle Missverständnisse aus dem Wege räumen.|Darf ich das Missverständnis aufklären?|„Zwei Typen von Missverständnissen lassen sich dabei ausmachen.“	misunderstanding	yanlış anlama	
Mörder	noun	masculine	Mörder	Der Mörder wurde zu einer lebenslangen Freiheitsstrafe verurteilt.|„In England soll ein Mörder hingerichtet werden.“	assassin|killer|murderer	katil	kujer
Religion	noun	feminine	Religionen	„Religion kann Trost spenden, sie kann Ruhe und Harmonie stiften.“|„Fußball ist keine Religion, da seine Regeln nicht auf übermenschliche Gebote zurückgehen.“	religion|faith	inanç|itikat|din	ol|دین
Angst	noun	feminine	Ängste	Ich habe Angst vor großen Hunden.|Er hatte Angst um sein Leben.|„»Meine Großeltern haben große Angst, dass sie aus Deutschland abgeschoben werden.«“	anxiety|fear	anksiyete|korku|kaygı	
Ehre	noun	feminine	Ehren	Hier steht meine Ehre auf dem Spiel!	honour honor|chastity	onur	
Artikel	noun	masculine	Artikel	Wir haben mehrere tausend Artikel im Sortiment.|„Ein durchschnittlicher Supermarkt führt ein Sortiment von vierzigtausend Artikeln.“	commodity|article	ürün|makale|madde|harf-i tarif	
Lee	noun	feminine		Tosende See an Luv und Lee|In Lee tauchte ein Frachter auf.|Das Beiboot macht in Lee fest.|Willst spucken du in See, musst spucken du in Lee.	lee		
Lee	noun	masculine		Die Touristen fahren mit einem Boot über den Lee.	Lee		
Abenteuer	noun	neuter	Abenteuer	Mein letztes Abenteuer war, nüchtern betrachtet, nur ein teurer Abend.	adventure|venture|affair|fling	macera|serüven	
Papst	noun	masculine	Päpste	Joseph Ratzinger wurde am 19. April 2005 zum Papst gewählt.	pope Pope	papa	
Deutsche	noun	feminine	Deutsche	Sie ist seit ihrer Einbürgerung Deutsche.	German		elmanî
Wodka	noun	masculine	Wodkas	Wodka ist das russische Nationalgetränk.|„Dabei schmeckt Wodka nach nichts.“|„Er war mit seinem Wodka sehr freigebig, fand ich.“	vodka	votka	vodka
Bauer	noun	masculine	Bauern	Mein Vater war Bauer, er hat nun aber seinen Hof verkauft.|„Eine Million Tonnen Äpfel ernten deutsche Bauern pro Jahr.“	farmer|grower|peasant|boor	çiftçi|köylü|odun|piyon	
Bauer	noun	masculine	Bauer	Der Vogel sitzt im Bauer.	bird cage|cage	kafes	
Zigarette	noun	feminine	Zigaretten	Nach dem Essen rauche ich gerne eine Zigarette.|Haste mal ne Zigarette?|„Der Stiefvater zündet sich eine Zigarette an.“	cigarette	sigara	
Tempo	noun	neuter	Tempi	Dieser Satz enthält drei verschiedene Tempi.	time|tempo|pace|speed		
Essen	noun	neuter	Essen	Das war ein leckeres Essen.|„Eine Dienerin trug nun das Essen auf.“	dish|meal|food|food supplies	yemek	xwarin
Geburtstag	noun	masculine	Geburtstage	Sie feiert heute Geburtstag.|„Es fehlte wenig, und ich hätte gesagt, daß ich Geburtstag habe.“|„Endlich stand dann der Geburtstag der alten blinden Frau bevor.“|„Nächstens hat er Geburtstag, ich glaub ich schenk ihm was.“|„Der Geburtstag kam heran, und Bartels überlegte, was zu tun sei.“|„Deswegen hatten wir bisher noch nie Gelegenheit, ihren Geburtstag zusammen zu feiern.“|Zum Geburtstag gehört meist auch ein Kuchen dazu.	birthday|day of birth	doğum günü|yaş günü	rojbûn|roja jidayîkbûnê
Schlag	noun	masculine	Schläge	Sie bekam einen Schlag mitten ins Gesicht.	blow|beat|slap|punch		
Hans	noun	masculine	Hänse	Der Hans da drüben schuldet mir noch Geld.			
Summe	noun	feminine	Summen	Die Summe von 2 und 5 ist 7.|Die Summe von 2 und 5 ist kleiner als deren Produkt.	sum	toplam|yekûn	
Suche	noun	feminine	Suchen	Die Suche nach der Lösung war erfolgreich.|Wir machen uns auf die Suche nach dir.|Er geht auf die Suche nach dem Sinn des Lebens.|Sie ist auf der Suche nach ihrem Auto.	search	arama	
Medizin	noun	feminine	Medizinen	„Feuer ist Medizin für die Natur.“	medicine	tıp|ilaç	bijîşkî
Go	noun	neuter		Go stammt aus dem alten China.	go		
Weh	noun	neuter	Wehe	Sein Wohl und Weh hing am seidenen Faden.|„Aber Ulrich pflichtete, zu seiner Schwester anfangs größer werdendem Weh, bereitwillig bei.“	ache|pain|woe		
Nutte	noun	feminine	Nutten	„Am Nebentisch hockten ein paar Nutten.“	whore|tart|hooker	fahişe|orospu	
Kleidung	noun	feminine	Kleidungen	Wetterfeste Kleidung und Schuhwerk sind in jedem Fall angesagt.|„Er ließ ihn vollständig neu mit Kleidung, Schuhwerk und Kopfbedeckung versehen.“	clothing|dress|clothes	kıyafet	
Quatsch	noun	masculine		Red nicht solchen Quatsch, natürlich kommt er wieder nach Hause!|Das ist doch Quatsch, so kann es gar nicht gewesen sein.	nonsense|bullshit|rubbish|flim-flam		
Stress	noun	masculine	Stresse	„So lässt sich ein wohltuenderer Umgang mit Stress erlernen.“	stress|general adaptation syndrome|aggro	stres	
Teenager	noun	masculine	Teenager	Lisa ist ein Teenager.	teenager		
Gras	noun	neuter	Gräser	Die Schafe fraßen saftiges Gras.|Auf der Wiese wachsen viele verschiedene Gräser.	grass|herbage	ot	
Rom	noun	masculine	Roma	In Deutschland gibt es mehr sesshafte als ziehende Roma.	Rom		
Kanone	noun	feminine	Kanonen	ein Schiff mit acht Segeln und mit fünfzig Kanonen — (Bertolt Brecht)|„Im selben Moment ließ uns das Donnern einer Kanone zusammenfahren.“|„Am Abend krachte auf einmal eine Kanone dicht vor uns.“	cannon|gun	top|tabanca|as	
Feld	noun	neuter	Felder	Er setzt seine Felder und Wiesen instand. (Volkslied)|„Auf terrassenförmig angelegten Feldern werden Kartoffeln und Gemüse angebaut sowie Heu geerntet.“|„Er zeigte auf die Felder und erzählte Pierre von seinen wirtschaftlichen Verbesserungen.“	field|battlefield|margin|playing field	tarla|alan|meydan|bölge	
Feld	noun	neuter	Felde	„Wir fuhren wieder ins Feld zu Tränken und Damm.“			
Menge	noun	feminine	Mengen	Das Medikament ist nur in kleinen Mengen einzunehmen.|Statistisch verbraucht ein Mitteleuropäer täglich eine Wassermenge von 120 Litern.|„Viele Konzerne verursachen riesige Mengen CO₂.“|[Klima:] „In Mülldeponien entstehen große Mengen Methan.“	quantity|abundance|set|multitude	miktar|birçok|çok|küme	
Position	noun	feminine	Positionen	Wir hatten keine gute Position, um das Geschehen wirklich verfolgen zu können.|Unsere Position war 2 Meilen südlich der Hauptinsel.	position|opinion|situation|function	yer|görüş|durum|vaziyet	
Nahrung	noun	feminine	Nahrungen	Man sollte auf ausreichend Vitamine und Mineralstoffe in der Nahrung achten.|„Sogar in den Vorstädten gab es keine Nahrung mehr zu kaufen.“|„Allerdings hatten wir diesmal keine Indianer, die für Behaglichkeit und Nahrung sorgten.“	aliment|food|nourishment	besin|gıda	
Arschloch	noun	neuter	Arschlöcher	„Mit Verlaub, Herr Präsident, Sie sind ein Arschloch.“|„Alles in allem, diese Sendung versammelte wieder einmal nichts als Arschlöcher.“	asshole|arsehole|asshat		
Realität	noun	feminine	Realitäten	Die Werbeaussagen entsprechen nicht der Realität.|Ihre politischen Vorstellungen sind jenseits jedweder Realität.|Die Realität zeigt uns, dass Verhandlungen mit diesen Verbrechern völlig sinnlos sind.	reality	gerçek	berahî
Sache	noun	feminine	Sachen	Ich packe meine Sachen wieder ein.|„Wem gehört das?“ „Das sind meine Sachen!“ (Betonung auf meine)|Nimm mal die Sachen da mit.|„Kanther verstaute die Sachen in seiner Aktentasche und ging zur Tür.“|„Als sie erwachte, waren die drei Freigesprochenen mit allen ihren Sachen verschwunden.“	thing|business matter|matter	eşya|şey|nesne|iş	
Motorrad	noun	neuter	Motorräder	Das Motorrad stand mitten im Weg.	bike|motor-cycle|motor-bike	motosiklet	motorsîklet
Verstand	noun	masculine		„Die Gesamtheit der Ursachen einer Erscheinung ist dem menschlichen Verstand nicht zugänglich.“|Ich glaube, er hat den Verstand verloren.|„Auch deswegen, weil Ausweichgleise systematisch, aber ohne Verstand demontiert worden sind.“|„Am Ende gibt er alles her, nur den Verstand behält er.“	mind|intellect|reason	akıl|izan|şuur|us	raman
Vieh	noun	neuter		Wir haben verschiedene Sorten Vieh auf dem Hof.|„Das Nachbarland Kanada verhängt ein Importverbot für Vieh aus dem US-Bundesstaat.“	livestock|cattle|beast|bastard	hayvan	
Weiße	noun	feminine	Weiße	Bitte noch zwei Weiße!	white|Caucasian		
Weiße	noun	feminine		Ihr Gesicht war von gespenstischer Weiße.	whiteness		
Weißer	noun	masculine	Weiße	Die Weißen bekämpften die Indianer.|„Die Weißen in Belgisch-Kongo bewaffnen sich, bilden Bürgerwehren.“	white|Caucasian		
Weißer	noun	masculine	Weißer	Der Weißer tüncht die Wände weiß mit Kalk.	painter		
Dämon	noun	masculine	Dämonen	Damals glaubte man wirklich, das Kind sei von einem Dämon besessen.|Der Dämon verkörpert alles Böse, das wir uns nur vorstellen können.	demon|daemon	iblis|cin	
Kirche	noun	feminine	Kirchen	Jeden Sonntag findet in der Kirche der Gottesdienst statt.|„Die Kirche war voll.“|„Die Kirche war kalt und leer.“	church	kilise	dêr
Blatt	noun	neuter	Blätter	O Tannenbaum, o Tannenbaum, wie treu sind deine Blätter! - (Weihnachtslied)	leaf|sheet|page|folio	yaprak|kanat|gazete|ağız	pel
Führerschein	noun	masculine	Führerscheine	Nach diesem Unfall hat man ihm den Führerschein abgenommen.|„Georg pachtete weiteres Land dazu, und Henni machte den Führerschein.“	driving licence|driver's license|driver's licence|driver licence	ehliyet|şoför ehliyeti|sürücü belgesi	ajoname
Zustand	noun	masculine	Zustände	„Die Erinnerung an die damaligen Zustände heilt einen von der deutschen Philosophie.“	condition|state	durum|vaziyet	rewş
Lage	noun	feminine	Lagen	Günstig wäre eine Lage der Wohnung in der Nähe einer Bushaltestelle.	location|position|layer|situation	durum|vaziyet	
Wille	noun	masculine	Willen	Er hat einen starken Willen.	will|volition		vîn|viyan|îrade
Wahrheit	noun	feminine	Wahrheiten	„Aber Wahrheit muss Wahrheit bleiben.“	truth	gerçek|hakikat	rastî
Freiheit	noun	feminine	Freiheiten	Nach dreijähriger Haft ist er wieder in Freiheit.	liberty|freedom	hürriyet|özgürlük	azadî
Richter	noun	masculine	Richter	„Der Richter rauchte und trank seinen Cognac.“|„Schon am einunddreißigsten März stand sie vor einem Richter.“	judge|Judges	hâkim|Hakimler	
Abendessen	noun	neuter	Abendessen	Zum Abendessen gibt es heute einen besonders guten Wein.|Während des Abendessens möchten wir nicht gestört werden.|„Das Abendessen war kurz und lief ab wie gewohnt.“|„Bevor er zum Abendessen ging, blätterte er gedankenverloren in Ruges Text.“|„Ein Abendessen mit einem befreundeten Verlagsvertreter veränderte alles.“	supper|dinner|supping|tea	akşam yemeği	şîv
Unterschrift	noun	feminine	Unterschriften	Mit seiner Unterschrift bestätigte er den Kreditvertrag.|„Die Unterschrift ist etwas krakelig.“	signature	imza	
Laute	noun	feminine	Lauten	Er zupfte die Saiten der Laute sehr sanft.|„Am Steuerhaus klimperte jemand auf einer alten Laute.“|„Trix nahm die Laute von der Wand und reichte sie Elisabeth.“	lute	ut|lavta	
Fahrt	noun	feminine	Fahrten	Die Fahrt nach Paris war anstrengend.|Auf der Fahrt nach Kopenhagen mussten wir einige Brücken überqueren.|„Nach zwölf Stunden Fahrt rollt der Zug in Teheran ein.“	trip|journey|ride|speed	seyahat|tur|yolculuk|gidiş	
Schreibtisch	noun	masculine	Schreibtische	Meine Werkbank ist der Schreibtisch.|Weil ich den ganzen Tag am Schreibtisch sitze, habe ich einen Haltungsschaden.|„Sie saßen sich an seinem Schreibtisch gegenüber.“|„Die Fliege krabbelte immer noch auf dem Schreibtisch herum.“|„Er saß hinter dem Schreibtisch.“	desk|writing desk	çalışma masası	
Kunde	noun	masculine	Kunden	„Ich bin der letzte Kunde, ich komm' nicht los vom Hahn.|„Unser Gespräch wurde durch einen Kunden unterbrochen, der Seidenstrümpfe verlangte.“	customer|client|purchaser	müşteri	
Kunde	noun	feminine	Kunden	Er überbrachte frohe Kunde.|„Wie ein Lauffeuer verbreitete sich die Kunde unter den Wartenden.“	news|tidings|field|area		
Oder	noun	neuter	Oders	Du hast das Oder (das „oder“) wohl überlesen.	or|either – or		
Knie	noun	neuter	Knie	Das Knie zierte nun ein rotes Kunstlederherz.	knee	diz	jûnî
Habe	noun	feminine		Nomaden haben ihre ganze Habe immer in der Nähe.	belongings|possession	varlık|servet	
Heute	noun	neuter		Man sollte das Heute genießen, denn wer weiß, was die Zukunft bringt.	today		îro
Treppe	noun	feminine	Treppen	Wer kommt denn da die Treppe herauf?|Diese Treppe führt in den Keller.|„Müller kommt die Treppe zum Deck hoch, sieht uns und winkt.“	staircase|stairway|flight of stairs|step	merdiven	derence
Rock	noun	masculine	Röcke	Wo sie Sechsundsechzig spielten / Mädchen unter Röcke schielten (Franz Josef Degenhardt)	skirt|coat	etek	
Rock	noun	masculine		Der Rock ist nicht totzukriegen.	rock		
Dame	noun	feminine	Damen	Erst drüben die Dame, dann du. (Volker Lechtenbrink)|„Sehr geehrte Damen und Herren, …“|„Hier schwiegen die beiden Damen für eine volle Minute.“|„Den Sänften der Damen folgten in schlichteren Tragstühlen die Dienerfrauen.“	lady|queen	bayan|kız|vezir|dama	
Dame	noun	neuter		Spielen wir eine Partie Dame?|„Alte Männer spielten Dame.“	draughts|checkers		
Geschwindigkeit	noun	feminine	Geschwindigkeiten	Meine Geschwindigkeit beträgt 8 km/h.	pace|speed|velocity	hız|sürat	lez
Klasse	noun	feminine	Klassen	Meine Kollegin hat dieses Jahr eine wilde Klasse.	class|excellence	sınıf|dershane|derslik|küme	
Teppich	noun	masculine	Teppiche	Ich muss heute noch den Teppich ausklopfen.|Für den Präsidenten wurde ein roter Teppich ausgerollt.|„Überall wurden die Vorhänge durch Teppiche ersetzt.“|„Alles war voller alter Möbel, verstaubtem Brokat und schweren Teppichen.“	carpet|rug|tapestry	kilim|halı	
Brand	noun	masculine	Brände	Der Brand verursachte einen großen Schaden.|Auf einem Balkon in Wien-Donaustadt geriet eine Kühltruhe in Brand.|„Besondere Schwierigkeiten bereiten Brände von Benzin, öl oder Fett.“	fire|blaze|thirst|gangrene	yangın	agir
Reich	noun	neuter	Reiche	Friedrich Ebert war der erste Präsident des Reiches.	realm|kingdom|empire|Reich	imparatorluk|âlem	
Hitze	noun	feminine	Hitzen	Bei dieser Hitze kann man nicht arbeiten!|Das Land ist von der Hitze ganz ausgetrocknet.|Dann muss man das Fleisch bei starker Hitze anbraten.|„Die Hitze hatte uns schläfrig gemacht.“	heat	sıcak	
Perfekt	noun	neuter	Perfekte	In dem Satz „Ich habe gespielt“ ist „habe gespielt“ Perfekt.|„Die Vorstufe des Präteritums ist das indogermanische Perfekt.“|„In mündlichen Texten hat man oft einen Wechsel zwischen Präteritum und Perfekt.“	perfect		
Gerät	noun	neuter	Geräte	Der Werkzeugschrank ist voll mit Geräten aller Art.|[Schlagzeile:] „Smartphones – Was die Geräte mit uns machen“|[Schlagzeile:] „Elektroschrott - Händler müssen ausgediente Geräte annehmen“	device|appliance	alet|aparat|aygıt|cihaz	
Dach	noun	neuter	Dächer	Unser Dach muss neu gedeckt werden.|Das Dach leckt, es ist undicht.|Der Dachdecker meint, dass wir das Dach komplett sanieren sollten.|Unzählige Dächer wurden durch den Sturm abgedeckt.|„Zerstörte Dächer und umgestürzte Bäume sind im gesamten Stadtgebiet zu sehen.“|„In London zerstörte der Sturm das Dach des Millenium Dome“|„In Skandinavien gehören grüne Dächer zum Erscheinungsbild.“	roof	çatı|dam	
Haut	noun	feminine	Häute	„Er mochte ihre dunkle Haut.“	skin|hide|covering	cilt|deri	çerm
Behandlung	noun	feminine	Behandlungen	Die Behandlung des Konflikts führte zu keiner Lösung.	treatment|therapy|care|dealing	muamele|tedavi	
Drachen	noun	masculine	Drachen	Der Rhombus ist ein Spezialfall des Drachens.	kite|deltoid		
Leitung	noun	feminine	Leitungen	Ich übernahm die Leitung über die Theater-AG.	leadership|direction|management|pipe	idare|yönetim|hat	
Tarnung	noun	feminine	Tarnungen	Auf die olivfarbene Grundierung des Panzers wird die etwas dunklere Tarnung gesetzt.	camouflage|cover		kamûflaj
Leber	noun	feminine	Lebern	Die Leber ist die größte Drüse des menschlichen Körpers.|„Wenn unsere Leber reden könnte, bräuchten wir keine Anonymen Alkoholiker.“	liver	karaciğer	
Gewissen	noun	neuter	Gewissen	Er fragte, wer die Statue auf dem Gewissen hat.	conscience|moral sense	vicdan	
Rücken	noun	masculine	Rücken	Du schnarchst, wenn du auf dem Rücken schläfst.	back|backstroke|spine|ridge	sırt|yamaç	pişt
Regierung	noun	feminine	Regierungen	Der Gewinner der Wahlen möchte die Regierung so bald als möglich antreten.	government	hükûmet	hikûmet
System	noun	neuter	Systeme	Hinter diesen Morden steckt System.	system|structure	sistem	
Aufzug	noun	masculine	Aufzüge	Wir sind mit dem Aufzug steckengeblieben.|„Mit dem Aufzug fuhren sie hinauf und direkt in den Nachtclub hinein.“	lift|elevator|act|approach	asansör	
Zimmer	noun	neuter	Zimmer	Diese Wohnung hat drei Zimmer.|Sei ruhig und geh auf dein Zimmer!|„Alf Bertini war aus dem Zimmer gerannt.“	room|chamber	oda	ode|jûr
Wohnzimmer	noun	neuter	Wohnzimmer	Das Wohnzimmer ist meist der größte Wohnraum.|„Neben ihrer Schlafcouch im Wohnzimmer hängt ein Wandteppich mit einer idyllischen Waldszene.“	living room|parlor / parlour|front room|lounge	oturma odası	
Schlafzimmer	noun	neuter	Schlafzimmer	Unser Schlafzimmer ist uns eigentlich zu klein.|„Es kommt mir vor, als führte ich sie in mein Schlafzimmer.“	bedroom	yatak odası	
Esel	noun	masculine	Esel	Wir ritten auf Eseln zur Wartburg hinauf.|„Esel, Pferde und Hunde halten engste Gemeinschaft mit den Menschen.“	ass|donkey|moke|neddy	eşek|merkep	ker|کهر
Spiegel	noun	masculine	Spiegel	Es gibt auch Spiegel, in denen man erkennen kann, was einem fehlt.|„Der große Spiegel wird ausgeladen.“	mirror|looking glass|level|transom	ayna|seviye	awêne|mirêk
Dollar	noun	masculine	Dollar	Diese Jeans kostet 25 Dollar.|Sie warf mehrere Dollars auf den Tisch.|„Mehr als 370 Mrd. Dollar Währungsreserven hat Brasilien angehäuft.“|„Ich legte die hundert Dollars auf den Tisch.“	dollar	dolar	dolar
Loch	noun	neuter	Löcher	Die Sandwespen benutzen Löcher in der Uferböschung als Behausung.	hole|defective electron	delik	
Loch	noun	masculine	Lochs	Loch Ness liegt in Schottland.	loch|lough|lake		
Kreatur	noun	feminine	Kreaturen	Gott schuf alle Kreaturen.|„Frute hörte Kai mit der geduldigen Überlegenheit der Kreatur zu.“	creature|wight	yaratık	
Kabel	noun	neuter	Kabel	In dem neuen Haus wurden die Kabel vom Elektriker verlegt.|„Dort traf ein Päckchen ein, aus dem Kabel hingen.“	cable	kablo|cambaz ipi	
Ausflug	noun	masculine	Ausflüge	Sonntags machen wir oft mit der ganzen Familie einen Ausflug aufs Land.|„Der weitere Ausflug folgte demselben Schema.“	excursion|outing		
Fleck	noun	masculine	Flecke	Mein Kleid hat einen Fleck und muss zur Reinigung/gewaschen werden.|„Er konnte die Flecken erkennen, wo der Verputz abgefallen war.“	stain|spot|place|tripe	leke|işkembe|zayıf|yama	
Grad	noun	masculine	Grade	Die Beispiele unterscheiden sich im Grad der Dummheit.|Ich bin im höchsten Grade konsterniert.|Sie erlitt eine Verbrennung zweiten Grades.	degree|order	derece|makam|rütbe	
Grad	noun	masculine	Grade	Der Most hat 25 Grad Öchsle.	degree	derece	
Theorie	noun	feminine	Theorien	Das ist eine wirklich unglaubliche Theorie.	theory	kuram|nazariye|teori	bîrdoz
Natur	noun	feminine	Naturen	„Das Buch der Natur ist in der Sprache der Mathematik geschrieben.“|„Alles, was gegen die Natur ist, hat auf die Dauer keinen Bestand.“	nature	doğa|tabiat	xweza|sirûşt
Unglück	noun	neuter	Unglücke	Zu allem Unglück blieb dann auch noch unser Wagen liegen.	misfortune|calamity	felaket	
Drama	noun	neuter	Dramen	„Auch das Drama und die Essayistik stellte Eigil über das Gedicht.“	drama	dram	drama
Tragödie	noun	feminine	Tragödien	Goethes „Faust“ ist eine Tragödie.|„Zudem gibt es bei Euripides die für die griechische Tragödie obligaten Chorszenen.“	tragedy	trajedi	
Katastrophe	noun	feminine	Katastrophen	Die sich anbahnende Katastrophe war nicht mehr zu verhindern.|„Die Folgen von kollektiven Katastrophen hatten in der Psychoanalyse kein Gewicht.“	catastrophe|calamity	âfet|felaket	
Rede	noun	feminine	Reden	Er hielt eine flammende Rede.	speech|address|talk|conversation	konuşma	
Wohl	noun	neuter		Die Kneipengänger riefen alle aus voller Brust: zum Wohl!	welfare|well-being|prosperity		silametî|refah
Technologie	noun	feminine	Technologien	Technologie wird an technischen Hochschulen gelehrt.	technology	teknoloji	teknolojî
Hexe	noun	feminine	Hexen	übertragen: „Maika ist eine Hexe.“|„Hexen waren angeblich Giftmischerinnen, verübten Schadenszauber und geisterten übers Land.“	witch|hex|hag|crone	cadı	
Teufel	noun	masculine	Teufel	Er ist von einem Teufel besessen.	devil|Devil|Satan	iblis|şeytan|satan	
Haken	noun	masculine	Haken	Er hängte seinen Mantel an den Haken.	hook|tick|check|hitch	çengel	
König	noun	masculine	Könige	Der König stattete der Stadt einen Besuch ab.	king	kral|şah|papaz	paşa
Sauerstoff	noun	masculine		Der Mensch braucht Sauerstoff zum Atmen.|„Ich atme, ohne über den Sauerstoff zu grübeln.“|„Im Krankenhaus wurde Roth mithilfe von Sauerstoff und einer Infusion stabilisiert.“	oxygen	oksijen	oksîjen|ئۆکسجین
Achte	noun	masculine	Achten	Heute ist der dritte Achte zweitausendfünf.	eighth		
Achte	noun	feminine	Achte	Auch die Achte war zufrieden mit ihrer Leistung.	eighth		
Theater	noun	neuter	Theater	Das Theater wird renoviert.|„Im Theater waren alle Plätze besetzt.“	theatre|theater|troupe|ruckus	tiyatro|temsil	şano
Sand	noun	masculine	Sande	Am Strand, am Strand, da gibt’s ’ne Menge Sand - (Schlager)|„Halb im Sand versunken, rosteten ein paar Jachten vor sich hin.“	sand|sands|sandbank	kum|kumluk|kam bankı	qûm|xîz
Projekt	noun	neuter	Projekte	Ein solch großes Projekt sollte professionell betreut werden.|Wir werden in den nächsten Wochen gemeinsam an unserem Projekt arbeiten.|„Projekte sind von ihrer Idee her und in ihrer Konzeption nicht fachbeschränkt.“	project	proje	
Kino	noun	neuter	Kinos	In unserem Kino läuft ein spannender Film.|„Als wir das Kino verließen, war es schon dunkel.“|„Wir sind ins Kino gegangen.“	cinema|movie theatre|movie	sinema	
Tanz	noun	masculine	Tänze	Die Schülerin wurde beim Abiball zum Tanz aufgefordert.|Zu den schwersten Tänzen gehören der Walzer und das Ballett.|„Ihr Tanz war wie eine aufreizende gymnastische Übung.“	dance	dans	reqs
Tempel	noun	masculine	Tempel	Sie gingen in den Tempel.|„Nur er durfte den Tempel betreten, um dort den Gottesdienst zu verrichten.“	temple	mabet|tapınak	
Bau	noun	masculine	Bauten	Der Bau eines Hauses ist teuer.|„Das schönste an meinem Bau ist aber seine Stille.“	construction|building side|building|burrow	inşaat|bina|yuva|kodes	
Engländer	noun	masculine	Engländer	Die Schotten haben gegen die Engländer gewonnen.|„[Formel 1-Pilot Sebastian] Vettel gratulierte dem Engländer [Lewis Hamilton zum WM-Sieg] herzlich.“	Englishman|Englishpeople|English|Briton	İngiliz	înglîz
Tagebuch	noun	neuter	Tagebücher	„Es war das Tagebuch meiner ersten sechsundsechzig Tage in Spanien.“|„Als zehnjähriger Junge habe ich ein Tagebuch zu führen begonnen.“	diary|journal|log	hatıra defteri	rojnivîsk
Urlaub	noun	masculine	Urlaube	Für den Umzug nehme ich mir Urlaub.|„Die erregendste Seite des Berufslebens ist zweifellos der Urlaub.“|„Nikolai brachte seinen ganzen Urlaub bei seinen Angehörigen zu.“	holiday|vacation ; leave|furlough|vacation	izin|tatil	betlane|bêhnvedan
Nacht	noun	feminine	Nächte	Ich habe die ganze Nacht kein Auge zugetan.|In der Nacht habe ich ein Geräusch auf dem Hof gehört.|Thomas darf doch über Nacht bleiben, oder?|Er hat die halbe Nacht gelernt.|Auf Mauritius waren die Nächte lau und lang.|Es klang nicht genau so wie in der vergangenen Nacht.	night	gece	şev
Hubschrauber	noun	masculine	Hubschrauber	Der Präsident kam mit einem Hubschrauber zur Konferenz.|„Mittlerweile werde sogar ein Hubschrauber eingesetzt.“	helicopter|chopper	helikopter	
Aufmerksamkeit	noun	feminine	Aufmerksamkeiten	Nach ein paar Stunden Vortrag ließ seine Aufmerksamkeit nach.|„Das hatte Aufmerksamkeit erregt.“|„Ziel von Challenges ist Aufmerksamkeit, die von Mutproben Überwindung.“	attention|care|attentiveness|mindfulness		
Akte	noun	feminine	Akten	„Der Untersuchungsrichter habe sie weder verifiziert noch in die Akte aufgenommen.“|„Vernichtet die PiS in Polen Akten im großen Stil?“	file|act	dosya|evrak	
Hose	noun	feminine	Hosen	„Er riß sich das Hemd vom Leib und zog die Hosen aus.“|„Ich trage die Hose jetzt ein Jahr.“	pantaloon|pants trousers|landspout|whirlwind	pantolon	
Trauer	noun	feminine		Sie befindet sich in Trauer um ihre Mutter.|„Die andern heuchelten keinerlei Trauer.“	grief|sorrow|grieving|mourning	matem|yas|matem müddeti|yas süresi	
Radio	noun	masculine	Radios	Ich kam in Paris an und schaltete als erstes das Radio an.|„Doch nicht jeder konnte sich ein Radio leisten.“|Das Radio wurde in der Geschichte häufig als ein Propagandainstrument missbraucht.|„Für sie ist das Radio die wichtigste Verbindung zur Außenwelt.“|„Aus dem Radio kam folkloristische Musik, sehr dezent.“	radio	radyo|yayın	radyo
Akt	noun	masculine	Akte	Ein Grenzüberfall ist meist ein kriegerischer Akt.	act|action|ceremony|nude		
Akt	noun	masculine	Akten	„Das Bezirksgericht Feldkirch legte den Akt dem Obersten Gerichtshof vor.“	acts|file		
Rechnung	noun	feminine	Rechnungen	„Können wir gleich die Rechnung haben?“|Nach jedem Restaurant- oder Kneipenbesuch wartet sie auf einen: die Rechnung.	bill|invoice|arithmetic	hesap|fatura|aritmetik	
Euro	noun	masculine	Euros	100 Eurocent haben denselben Wert wie ein Euro.|Heutzutage tut man gut daran, seine Euros beisammenzuhalten.|Minna gewann in der Lotterie 25 Millionen Euro.|„Doch ein Austritt könnte das Ende des Euros einleiten.“|„Auf eBay kosten die Modelle von damals zwischen acht und fünfundzwanzig Euro.“	euro	avro|euro	ewro
Staub	noun	masculine	Stäube	Die Inhalation metallischer, mineralischer oder organischer Stäube kann Erkrankungen der Atemwege hervorrufen.|Aus Staub bist du gemacht, zu Staub sollst du werden.|„Staub ist ein Kulturfolger. Wo Menschen sind, tummelt sich der Staub.“|Am Ende des Tages sind wir alle nur Staub.	dust|powder	toz	
Reaktion	noun	feminine	Reaktionen	Die Reaktion auf den Vertrauensbruch ließ nicht auf sich warten.|Wir warten jetzt auf eine Reaktion des Königshauses.|Die erwartete Reaktion blieb jedoch aus.|Müssten deine Eltern nicht mal langsam eine Reaktion zeigen?|Auf unsere Aktion am Marktplatz gab es die unterschiedlichsten Reaktionen.	reaction	tepki|reaksiyon|irtica|gericilik	
Baron	noun	masculine	Barone	Ein Baron ist ein Adeliger.|„Beim Souper machte man mich zum Baron.“	baron	baron	
Frühstück	noun	neuter	Frühstücke	Zum Frühstück isst Jutta täglich eine Schüssel Müsli.|Viele Urlauber waren mit dem spärlichen Frühstück im Zwei-Sterne-Hotel nicht zufrieden.|In Japan isst man Reis, Natto, gebratenen Fisch und Misosuppe zum Frühstück.|„Gegen halb neun holte sie ihn zum Frühstück ab.“	breakfast	kahvaltı	taştê
Energie	noun	feminine	Energien	„Ihre ganze Energie ließ sie im Stich.“	energy	enerji	
Führer	noun	masculine	Führer	„Leutnant Fabian war allerdings ein anderer Führer als Eger.“	leader|guide|Führer / Fuehrer / Fuhrer|driver	lider|önder|rehber|Führer	
Roboter	noun	masculine	Roboter	Durch Roboter wurden viele Arbeitskräfte ersetzt.|„Der Mensch ist kein Roboter.“	robot	robot	
Maschine	noun	feminine	Maschinen	Die Maschinen liefen auf Hochtouren, um die Stückkosten niedrig zu halten.|Ich habe viele Küchenmaschinen, das da ist eine Maschine zum Brotbacken.	machine|engine|aircraft|processor	makina|makine|gemi motoru|tayyare	
Handel	noun	masculine	Händel	Der Handel mit Waffen hat enorm zugenommen.|„Denn im Lauf der Zeit nimmt der Handel mit den Wüstenoasen zu.“	business|commerce|trade|deal	ticaret|anlaşma|kavga	bazirganî
Telefon	noun	neuter	Telefone	Mensch, geh doch mal ans Telefon!|„Ich griff zum Telefon und rief meinen Buchmacher an.“	telephone|phone	telefon	telefon
Enkel	noun	masculine	Enkel	Mein Enkel geht noch zur Schule.|„Manchmal ging er mit seinem Enkel spazieren.“|„Der Großvater geht mit seinem Enkel an einem Sommertag über eine Wiese.“	grandchild|grandson|descendant	torun|evlat	
Enkel	noun	masculine	Enkel	„Er hat sich den Enkel verstaucht.“			
Lauf	noun	masculine	Läufe	Im Laufe nur weniger Jahre ergrauten ihm die Haare.	run|race|course|leg	koşu|gidiş|namlu	bazdan|lûle
Therapie	noun	feminine	Therapien	Bei manchen Erkrankungen sind verschiedene Therapien möglich.|„Morgen würde ein anstrengender Tag werden, denn morgen würden die Therapien beginnen.“|„Die Überlebensrate nach der neuen Therapie liegt durchweg über derjenigen der Standardbehandlung.“	therapy	tedavi|terapi	
Käfig	noun	masculine	Käfige	In meinem Käfig halte ich Papageien.|„Ich ging zum Käfig rüber und betrachtete den Kanarienvogel.“	cage	kafes	qefes
Recht	noun	neuter	Rechte	Das Recht der Bundesrepublik Deutschland ist mustergültig.|[Völkerrecht:] „Gegen das Recht des Stärkeren hilft nur die Stärke des Rechts.“	law|right|justice|jurisprudence	hak|hukuk	dad|maf
Hälfte	noun	feminine	Hälften	Wenn das Glas nur mehr halb voll ist, fehlt schon die Hälfte.|Kinder zahlen die Hälfte.|„Bei einigen Wörtern fehlt die zweite Hälfte. Vervollständigen Sie den Lückentext!“|„Die Hälfte der Deutschen ist zu dick.“|„Die Hälfte der Bayern wünscht sich laut einer Umfrage eine dauerhafte Sommerzeit.“|[Schlagzeile:] „Gewinn bei Tamedia um die Hälfte eingebrochen“	half|middle	yarı	
Hemd	noun	neuter	Hemden	Sie sucht eine passende Krawatte zu seinem Hemd aus.|„Er riß sich das Hemd vom Leib und zog die Hosen aus.“|„Er trägt einen schwarzen Anzug mit weißem Hemd.“	shirt|vest|undershirt	gömlek	
Esse	noun	feminine	Essen	Unter der Esse brannte ein Feuer.	smoke hood|chimney|chimney pot|chimney stack		
Sie	noun	feminine	Sie	Ist dein Hund ein Er oder eine Sie?	she		
Unter	noun	masculine	Unter	Die vier Unter sind die höchsten Trümpfe im Skat.|Sieben, Neune, Unter, da kommt keiner drunter	Jack		
Volk	noun	neuter	Völker	Nein danke, mit so einem Volk will ich nichts zu tun haben.	people|folk|population	halk|millet|ulus	gel
Größe	noun	feminine	Größen	Mozart war eine Größe unter den Komponisten.	size|quantity	boyut|ebat|ululuk|yücelik	mezinahî
Gemeinde	noun	feminine	Gemeinden	„Die Vereine erfüllen also wichtige Funktionen in der Gemeinde.“	municipality	cemiyet|topluluk|belde|yerleşim yeri	
Band	noun	neuter	Bänder	Der Highway, ein Band aus Asphalt, verbindet die West- mit der Ostküste.	band|ribbon|string|tape		
Band	noun	masculine	Bde.	Seine Fotoreportagen und -dokumentationen sind bereits in mehreren Bänden erschienen.	tome|volume		
Band	noun	feminine	Bands	Die Band spielt Blues.|Mein Freund spielt seit drei Jahren in einer Band.|Viele Bands lösen sich nach ein paar Jahren wieder auf.	band|group		
Band	noun	neuter		„Das Band war kaputt, da hatten wir zwei Stunden Aufenthalt.“			
Gebiet	noun	neuter	Gebiete	Das Gebiet Hessens ist kleiner als das Bayerns.	area|region|territory|district	arazi|bölge|çevre|mıntıka	
Begriff	noun	masculine	Begriffe	Du hast einen zu negativen Begriff von dieser Entwicklung gewonnen.|Du hast keinen Begriff davon, was das bedeutet.	concept|term|perception|notion	kavram|mefhum	
Hoch	noun	neuter	Hochs	Das Hoch bescherte uns endlich schönes Wetter.	anticyclone|high|culmination	yüksek basınç merkezi|doruk|zirve|yaşasın nidası	
Gang	noun	masculine	Gänge	Läufer haben einen schnellen Gang.|Das Pferd wechselte den Gang, es galoppierte.	gait|errand|hallway|corridor	yürüyüş|gidiş|koridor|geçiş	
Gang	noun	feminine	Gangs	Die Gang brach nachts ins Haus ein.	gang	çete	
Klage	noun	feminine	Klagen	Die Klagen der trauernden Frauen waren weithin hörbar.	lament|complaint|claim	şikâyet|yakınma|dava|hukukî işlem	
Aussehen	noun	neuter		Sein Aussehen schreckt die meisten Leute ab.|Ihrem Aussehen nach ist sie eine wohlhabende Frau.|Man sollte die Menschen nicht nach dem Aussehen beurteilen.|„Bei Männern ist Aussehen zweitrangig.“|„Sogar diese Lumpenbrüder waren also auf ihr Aussehen bedacht.“|„Mein Aussehen veranlaßte sie sofort zu der Frage, ob ich krank sei.“	look|appearance	görünüş	
Kanal	noun	masculine	Kanäle	Viele Orte sind für Schiffe über einen Kanal erreichbar.|„Zwei Wege führten an Kanälen entlang, waren aber weit.“|„Er schlenderte lange an den Kanälen hin und über Brücken.“	canal|channel|drain|sewer	kanal	
Block	noun	masculine	Blöcke	Sie sprengten einen großen Block aus dem Fels.	block|notepad|scribbling block|writing pad	parça|blok|ada	
Lager	noun	neuter	Lager	Dieser Raum dient als Lager für Computerzubehör.	warehouse|campsite|deposit|bearing	ambar|antrepo|depo|emtia	
Garten	noun	masculine	Gärten	„Fleißige Arbeitsbienchen sind wir ihnen, bauen ihnen die Häuser und die Gärten.“|„Wir durften nichts abpflücken; Großvater war pensioniert und pflegte seinen Garten selbst.“|„Hinter dem Haus ist ein Garten zwischen efeubewachsenen Ziegelwänden.“|„Er sah hinaus auf ein Fleckchen Garten.“|„Ich stolperte durch den Garten ins Haus.“|Das Arbeiten im Garten lässt einen den Berufsstress vergessen.	garden|plants in tubs|military drill area	bahçe / bağçe	baxçe
Information	noun	feminine	Informationen	Haben Sie neue Informationen zur Lage im Einsatzgebiet?|Ich nehme Informationen auf und verarbeite sie weiter.|Den neuesten Informationen zufolge ist der Reaktor noch am Netz.	information	bilgi|enformasyon|malumat|danışma	agahî
Amt	noun	neuter	Ämter	„Wie kann man einem Halbidioten ein so verantwortungsvolles Amt anvertrauen.“	office	görev|mercî|daire	
Kiste	noun	feminine	Kisten	Sie bekam eine Kiste Wein nach Hause geliefert.|„Divisch wühlt in einer Kiste und holt einen Schlüssel hervor.“	coffer|box	kutu|sandık	
Kiste	noun	masculine	Kisten	Der gebürtige Kiste lebt seit vielen Jahren in Tiflis.			
Wenn	noun	neuter	Wenn	Dein ständiges Wenn geht mir auf die Nerven.			
Wissenschaftler	noun	masculine	Wissenschaftler	Ratlos saß der Wissenschaftler über seinen Nachschlagewerken.	scientist	bilim adamı|ilim adamı|bilim insanı|ilim insanı	zanyar|zanistvan
Müll	noun	masculine		Er redet nur noch Müll.|Sein Posteingang ist voller Müll.	garbage|refuse|rubbish|trash	çöp	
Form	noun	feminine	Formen	Die Form der Skulptur spricht mich nicht an.|„Das Gerät hat die Form einer Kugel.“|„Die auffällige Form der Blätter ließ keinen Zweifel zu.“|„Verzierungen mit verschiedenen geometrischen Formen (Kreisen, Vielecken) sind aus vielen Kulturen bekannt.“	shape|form|kind|type	şekil|kalıp	
Version	noun	feminine	Versionen	Ich würde dazu gerne Deine Version hören.	version	sürüm|versiyon	guherto
Publikum	noun	neuter	Publika	Das Publikum war begeistert vom Theaterstück.|Der Beifall des Publikums hallte durch das ganze Stadion.|„Das Publikum wollte Musik.“	public|audience	dinleyici kitlesi / dinleyiciler|izleyici kitlesi / izleyiciler|seyirci kitlesi / seyirciler|okuyucu kitlesi / okuyucular	
Mord	noun	masculine	Morde	Sie wurde wegen Mordes an zwei Wachmännern angeklagt.|Er wurde des Mordes an einem Taxifahrer für schuldig befunden.	murder|homicide|slaying	cinayet	
Kurs	noun	masculine	Kurse	Kurs Südsüdost liegt an.|Der 360-Grad-Kurs führte durch den Wald.|„Die ›Exitus‹ verändert jede Nacht ihren Kurs.“	course|rate	istikamet|yön|kurs|fiyat	
Linke	noun	feminine	Linke	Viele Menschen schreiben mit der Linken.	left hand|left-wing|leftist|left side		
Kopie	noun	feminine	Kopien	Der Toner geht zur Neige, deshalb sind die Kopien etwas heller.	copy|blueprint|duplicate|manifold		
Kloster	noun	neuter	Klöster	„Klöster und Private unterstützten den bettelnden Landstreicher.“|„Am Kloster begrüßt uns Mönch Habte-Giyorgis.“	monastery|cloister|convent|friary	manastır	
Trottel	noun	masculine	Trottel	Er ist nur ein harmloser Trottel.	imbecile|fool|idiot	şapşal	
Weib	noun	neuter	Weiber	Dieses Weib geht mir auf die Nerven, schaff sie raus.|Er ist hinter den Weibern her.|Hab mein' Wagen vollgeladen, voll mit alten Weibsen - (Volkslied)		karı|kadın	
Wut	noun	feminine		Voller Wut schrie sie ihn an.|„Zdenek sprach stockend und voller Wut und riß Grasbüschel aus.“|„Hugo klang, als schluchzte er selbst vor Empörung und Wut.“	anger|fury|wrath|rage		
Schokolade	noun	feminine	Schokoladen	„Die Schokolade kam, wir tranken sie und setzten dann unser Spiel fort.“|„Wieder bringt mir Pierre seine Tasse mit der köstlich duftenden Schokolade.“	chocolate|hot chocolate	çikolata	çoklata|چۆکلێت
Ruhe	noun	feminine		Endlich ist Ruhe im Kinderzimmer.|„Ruhe! Wie soll man sich denn bei diesem Lärm konzentrieren?“|„Ich will meine Ruhe haben.“	quiet|calm|tranquility|rest		
Liste	noun	feminine	Listen	Ihr Name steht leider nicht auf der Liste.|Die Punkte und Unterpunkte einer Liste sind eines ihrer gliedernden Merkmale.|Das steht ganz oben auf meiner Liste.|Die Liste der Freiwilligen ist kurz.	list	liste	
Motiv	noun	neuter	Motive	Das Motiv für den Mord war Eifersucht.	motive|motif|subject	gerekçe|motif	
Schrei	noun	masculine	Schreie	„Nachbarn hatten Schreie aus einer Villa in einem Neubauviertel der Stadt gehört.“	cry|yell|shout|call		
Bastard	noun	masculine	Bastarde	„Er ist ihr Lieblingssohn, Klaus der unerwünschte Bastard.“	bastard|bastard hybrid crossbreed|mongrel	piç	
West	noun	masculine	Weste	Seit Abend weht ein kräftiger West.			
Adresse	noun	feminine	Adressen	Die Adresse beinhaltet im Allgemeinen Straßennamen, Postleitzahl und Ortsnamen.|„Er hatte sie nicht um ihre Adresse gebeten.“	address	adres	
Bedeutung	noun	feminine	Bedeutungen	Die eigentliche Bedeutung des Gesetzes war es, die Opfer zu schützen.	meaning|importance|import|implications	anlam|mana	wate
Entwicklung	noun	feminine	Entwicklungen	Nach der Krise deuten jüngste Entwicklungen einen schnellen Frieden an.	development	gelişme|tekâmül|geliştirme	pêşveçûn
Bereich	noun	masculine	Bereiche	Im Bereich der Gärten wird keinerlei Bautätigkeit geduldet.	area|military zone|field|ring	alan|bölüm|çevre|kesim	
Mal	noun	neuter	Male	Es gibt ein Mal, an dem man die Rasse gut erkennen kann.|Diese archäologischen Male deuten auf eine frühe Besiedlung hin.	brand|mark|marking|sore		
Mal	noun	neuter	Male	Dieses Mal lasse ich dich davon kommen.|Er wurde schon mehrere Male erwischt.|Ich habe Dir hundert Mal gesagt: „Räum dein Zimmer auf!“|Zum hundertsten Mal: „Räum dein Zimmer auf!“|Zum letzten Mal: „Räum dein Zimmer auf!“	time		
Wochenende	noun	neuter	Wochenenden	Kommst du am Wochenende mit ins Kino?|„Am Wochenende rief meine Mutter an.“	weekend	hafta sonu	dawiya hefteyê
Wahl	noun	feminine	Wahlen	Heute habe ich die Wahl: Spaghetti oder Pommes?	choice|selection|adoption|election	seçenek|tercih|seçim|oylama	hilbijartin
Werk	noun	neuter	Werke	Dieses Bild ist das letzte Werk des Meisters.|„Alte Legenden berichten indes, dass seinem Werk der Segen von oben fehlte.“|Berthold hat die komplette Ausgabe von Schillers Werken im Bücherregal stehen.	labour|work|act|company	çalışma|eser|yapıt|fabrika	
Gegner	noun	masculine	Gegner	Der Gegner von Hannover 96 war diesmal der 1. FC Köln.	adversary|foe|opponent	aleyhtar	
Mitternacht	noun	feminine	Mitternächte	Man kann nicht jeden Tag um Mitternacht ins Bett gehen.|„Die litauische Mitternacht, die Stunde der Werwölfe, war schon vorüber.“	midnight	gece yarısı	nîvê şevê
Gesicht	noun	neuter	Gesichter	Er fuhr sich mit den Händen durchs Gesicht.|„Ich betastete ihr Gesicht wie ein Blinder.“|„Schließlich trocknete er sein Gesicht mit dem Taschentuch.“|„Ihr Gesicht war rot von dem Pizzafeuer.“	face|muzzle|snout|expression	yüz	rû
Wagen	noun	masculine	Wagen	Die Ochsen hatten Mühe, den Wagen zu ziehen.	cart|wain|car|carriage	araba|burç	fergûn|diwêrê|makîne|tirimbêl
Idee	noun	feminine	Ideen	Mein Bruder hat die fixe Idee, einmal um die Welt zu segeln.|Ideen verändern die Welt.|Gute Ideen hat man nicht zwei Mal.	idea	düşünce|fikir|ide	bîroke
Ehefrau	noun	feminine	Ehefrauen	Meine Ehefrau fragt sich immer, warum sie mich geheiratet hat.|„Fünfunddreißig von ihnen wurden von ihren Ehefrauen begleitet.“|„Er lebte mit der Ehefrau im Haus seiner Eltern.“	wife	karı	
Brunnen	noun	masculine	Brunnen	Moderne Brunnen verfügen meist über eine elektrische Pumpe zur Wasserentnahme.|„Ich blieb neben dem Brunnen in der Mitte des Platzes stehen.“	well|spring|fountain	kuyu|havuz	bîr
Zauberer	noun	masculine	Zauberer	Nur ein Zauberer wäre fähig, unsichtbar zu werden.	magician|wizard|sorcerer|warlock	büyücü|sihirbaz	
Richtung	noun	feminine	Richtungen	Gehen Sie weiter in diese Richtung.	direction	taraf|istikamet|yön	
Gericht	noun	neuter	Gerichte	Vor dem Gericht scharten sich bereits die Medien.	court|court house|law courts|court of law	adliye sarayı|mahkeme	
Gericht	noun	neuter	Gerichte	Mohnnudeln sind ein beliebtes Waldviertler Gericht.|Die Gerichte von heute stehen dort drüben auf der Tafel.|„Solche Benennungen für Gerichte nenne ich kostümiert.“	dish	yemek	
Bewusstsein	noun	neuter	Bewusstseine	Das Bewusstsein ist die Voraussetzung für intelligentes Leben nach der gängigen Definition.	awareness|consciousness		
Verfahren	noun	neuter	Verfahren	Über das Verfahren müssen wir uns noch verständigen.|„An der Art des schriftstellerischen Verfahrens lag Bouvard wenig.“	procedure|method|action|technique	adlî takibat|kanunî takibat|yöntem	
Ziel	noun	neuter	Ziele	Unser gemeinsames Ziel ist die Verbesserung der Lebensqualität.|„Zweihundert Meter vor seinem Ziel blieb er stehen.“	aim|goal|objective|destination	amaç|gaye|hedef	armanc
Lehrerin	noun	feminine	Lehrerinnen	Die Lehrerin erklärt mir die Grundrechenarten.|„Lehrerin war sie, im Osten Deutschlands.“|„Das fand meine Lehrerin weniger lustig.“|„Die Kirche sei unser Verein, unsere Lehrerin und Lenkerin[.]“	female teacher|instructor|tutor	hoca|öğretmen	mamoste
Königin	noun	feminine	Königinnen	Die Königin winkte huldvoll dem Volke zu.|„Natürlich zierte auch diese Marken das Konterfei von Königin Victoria.“|„Die Königin aber war noch nicht da, vielleicht noch im Park.“	queen	kraliçe|vezir	
Thema	noun	neuter	Themen	Das Thema der Ausstellung ist Kunst des 19. Jahrhunderts.|„Ein feldgrauer Prediger sprach über »Dienen und Gehorchen« oder andere Themata.“|„Dieser ließ sich von dem Thema nicht abbringen.“|„Einer schlug ein neues Thema an.“	theme|topic|subject	konu|mevzu|tema	mijar
Tal	noun	neuter	Täler	Wir marschieren durch dieses Tal.	valley|dale	vadi	newal|gelî|dol
Bewegung	noun	feminine	Bewegungen	„Die vollkommene Kontinuierlichkeit einer Bewegung ist dem menschlichen Verstande unfasslich.“	movement|move|exercise|gesture	hareket	
Verhalten	noun	neuter	Verhalten	Mit deinem jetzigen Verhalten wirst du keinen Erfolg haben.	behaviour|behavior|conduct|attitude	davranış|tutum	
Grund	noun	masculine	Gründe	Er hatte gute Gründe dafür, sich zur Wehr zu setzen.|„Das Scheitern der Bewegung hatte nicht nur politische, sondern auch systemische Gründe.“	reason|land|bottom|basis	temel|sebep|arsa|arazi	
Problem	noun	neuter	Probleme	Wir haben ein schwerwiegendes Problem!|„Gipfelsammler der Sächsischen Schweiz haben mit mehreren Problemen zu kämpfen.“	problem|trouble	mesele|problem|sorun	
Ergebnis	noun	neuter	Ergebnisse	Das Ergebnis seiner Bemühungen war gleich null.|Das Ergebnis der Berechnung lautet 42.	result|outcome	netice|sonuç	encam
Verhältnis	noun	neuter	Verhältnisse	Diese beiden Größen stehen in einem umgekehrt proportionalen Verhältnis zueinander.	relation|relationship|background	bağıntı|ilişki|koşul|şart	
Mittel	noun	neuter	Mittel	Diese Salbe ist das richtige Mittel für dich.|Dieses Mittel dient dazu, Unkraut abzutöten.|Sprachliche Mittel sind sinnvoll, um etwas Bestimmtes zum Ausdruck zu bringen.	remedy|device|method|tool	araç|çare|vasıta|imkân	
Opfer	noun	neuter	Opfer	Er sucht sich seine Opfer gezielt aus.|„Die sichtbare Verwüstung schließe die Opfer der radioaktiven Verstrahlung nicht ein.“	sacrifice|victim|casualty	kurban|feda|afetzede|kazazede	
Material	noun	neuter	Materialien	Zur Herstellung der Körbe verwenden wir nur natürliches Material.|„Mit der Massenspektroskopie wurde das Material analysiert.“	material	malzeme	
Modell	noun	neuter	Modelle	Das Modell wurde immer wieder nachgebaut.	model	maket|model	
Wesen	noun	neuter	Wesen	In der Tiefsee hat man seltsame Wesen entdeckt.|„Dieses Wesen ist mikroskopisch klein und mit flimmernden Härchen besetzt.“	being|creature|character|nature	varlık|karakter|tabiat|karakteristik	
Königreich	noun	neuter	Königreiche	Norwegen ist ein Königreich.|„Die Gründung des Königreichs Polen ist noch unverständlicher.“	kingdom|realm	krallık	
Gewicht	noun	neuter	Gewichte	Hans muss sein Gewicht verringern, damit er überlebt.	weight	ağırlık	giranî
Gelände	noun	neuter	Gelände	Das Gelände auf der anderen Seite des Flusses ist sehr zerklüftet.|Um zu arbeiten, muss ich oftmals durchs Gelände stapfen.|„Er ließ immer noch den Blick über das Gelände schweifen.“	terrain|property|campus|grounds	arazi	
Ausland	noun	neuter		Wir machen unseren nächsten Urlaub im Ausland.	foreign country / foreign countries|outland|abroad	yurt dışı	
Mitglied	noun	neuter	Mitglieder	Die Gewerkschaften haben viele Mitglieder.|Hans ist Mitglied im hiesigen Fußballverein.|Sie ist Mitglied bei einer Krankenkasse.|[Schlagzeile:] Mitglied der Cosa Nostra soll nach Italien ausgeliefert werden|„Als einziges Mitglied seiner Familie überlebte er den Holocaust.“	member	âzâ|üye	
Anteil	noun	masculine	Anteile	„Und wo bleibt mein Anteil?“	share|portion|quota|due	pay|paylaşma	par
Stück	noun	neuter	Stücke	Brich mir bitte ein Stück Brot ab.|„Carmen griff nach einem Stück Kirschenstrudel.“|Möchtest du ein Stück des Kuchens?|Möchtest du ein Stück Kuchen?|Möchtest du ein Stück vom Kuchen?	part|piece	parça|adet	
Netz	noun	neuter	Netze	Fischer fangen mit riesigen Netzen Fische in großer Zahl.|„Netze trockneten auf Leinen.“|„Außerdem waren Fischreusen vorgesehen, Netze für den Fang.“	net	file|ağ|şebeke	tor
Freundin	noun	feminine	Freundinnen	Sie ist meine beste Freundin.|„Nun waren sie wieder Freundinnen.“|„Ada hatte mir eine Freundin vorgestellt, Dina.“|„Die Freundin bemerkte seine Verzweiflung und verlor sich in Rechtfertigungen.“	friend|girlfriend		
Übung	noun	feminine	Übungen	Die Übungen in Turnen entspannen sehr.|Mit etwas mehr Übung klappt das bestimmt hervorragend!	training|practice|exercise	alıştırma|egzersiz	
Regel	noun	feminine	Regeln	„Fußball ist keine Religion, da seine Regeln nicht auf übermenschliche Gebote zurückgehen.“|„Die goldene Regel des Drachenfliegens heißt, möglichst viel Umsicht walten lassen.“|„Regel Nummer eins beim Fight Club heißt: Man redet nicht darüber.“	rule|period	kaide|kural|âdet|hayız	
Schuss	noun	masculine	Schüsse	Zur Warnung gab die Polizei einen Schuss ab.|„Nur noch vereinzelt waren Schüsse zu hören.“	gunshot|* shot|shot|* gunshot	atış|şut	
Mitte	noun	feminine	Mitten	In der Mitte des Raumes befinden sich ein Tisch und vier Stühle.	centre|center|middle		
Folge	noun	feminine	Folgen	[Landwirtschaft:] „Die Branche ist von den Folgen des Klimawandels unmittelbar betroffen.“|„Ihr Tod hatte Folgen, die mich nötigten, eine andere Lebensweise zu beginnen.“|Schulden waren die Folge der zu hohen Ausgaben.	consequence|order|episode|sequence	akibet|devam|bölüm|dizi	rêz|beş
Rolle	noun	feminine	Rollen	Der Stuhl hat Rollen, er lässt sich leicht verschieben.|Ein Flaschenzug enthält mehrere Rollen, die ein Seil jeweils um 180° umlenken.|Bei einem Bandschleifer wird das Band über eine Rolle geführt.|Es ist nur noch eine Rolle Klopapier übrig.	roller|pulley|roll|reel	rulo|rol	rol
Rolle	noun	masculine	Rolle	Vor dem Fenster sitzt ein jaulender Rolle.			
Rolle	noun	neuter		Mama, ich muss dringend ein Rolle machen!			
Nähe	noun	feminine		Der Bodyguard befand sich in der Nähe des Politikers.|„In der Nähe der Kathedrale bleibt sie zurück, sie geht sehr langsam.“	proximity|vicinity|neighbourhood|nearness	yakınlık|bağlılık	
Möglichkeit	noun	feminine	Möglichkeiten	Nur noch der Präsident hat die Möglichkeit, das Urteil aufzuheben.	option|possibility|feasibility|potentiality	imkân|olanak|ihtimal|olasılık	firset
Weise	noun	feminine	Weisen	„Damit werden die historischen Verhältnisse auf spektakuläre Weise auf den Kopf gestellt.“	mode|way|manner|melody	tarz|usul	
Weise	noun	feminine	Weise	Die Weise saß in ihrem Sessel und meditierte.|Die Weise irrte sich selten mit ihren Prophezeiungen.|Eine Weise lief schnell Gefahr, als Hexe gebrandmarkt zu werden.			
Verfügung	noun	feminine	Verfügungen	Die testamentarische Verfügung des Vaters erließ seinem zweiten Sohn die Schulden.	decree|disposition|order|direction	emir|karar|kullanım|tasarruf	
Serie	noun	feminine	Serien	Die Serie von Gewalttaten endete mit der Verhaftung des mutmaßlichen Täters.	series	seri|grup	
Umgebung	noun	feminine	Umgebungen	In der Umgebung von Göttingen gibt es viele Wälder.	surrounding|environment|ambience|runtime environment	cıvar|etraf|çevre	
Ausbildung	noun	feminine	Ausbildungen	Die Ausbildung schließt mit einer staatlichen Prüfung ab.|„Die Ausbildung war die reinste Verschwendung von Zeit, Geld und Einsatz gewesen.“|„Risikosport zählt seit alters zur militärischen Ausbildung.“	education|training|formation	eğitim|öğrenim	
Strecke	noun	feminine	Strecken	Die Strecke, die wir heute zurücklegten, war sehr kurz.|„Auf gerader Strecke stehen die Leitpfosten in einem Abstand von 50 Metern.“|„Weite weizenfarbene Strecken wechseln mit grünem flachem Land, still und fruchtbar.“	route|way|line segment|drift	güzergâh|hat|mesafe|uzaklık	
Aufgabe	noun	feminine	Aufgaben	Meine vordringlichste Aufgabe ist es jetzt, mich um die Kinder zu kümmern.	task|job|duty|business	iş|bırakma|vazgeçme|teslim	
Methode	noun	feminine	Methoden	Eine Methode für einen effizienten Softwareentwurf heißt „Extreme Programming“.	method	metot|usul|yöntem	
Beschreibung	noun	feminine	Beschreibungen	„Sprachkritik ist die Beschreibung, Analyse und Bewertung von sprachlichen Äußerungen.“	description	tarif|tasvir	
Basis	noun	feminine	Basen	Die Entscheidung erfolgt auf Basis der letztjährigen Studie.	basis|base|pedestal	baz	
Michel	noun	masculine	die Michel	Michel ist stets der Beste seiner Klasse gewesen.			
Wirkung	noun	feminine	Wirkungen	„Sade fühlt die Wirkung der Klosterzeit auf seine Frau.“	effect|impact	etki|tesir	
Unterstützung	noun	feminine	Unterstützungen	Wir rechnen mit Ihrer Unterstützung.	support	yardım|destek	
Schlacht	noun	feminine	Schlachten	Das deutsche Reich hat im letzten Weltkrieg viele Schlachten verloren.|„In der Schlacht war ein Achtel der Streitmacht Roms untergegangen.“|„Wie ein Gewitter tobte die Schlacht über dem Meer.“|„Die Schlacht um Berlin steht demnach durchaus günstig.“	battle|slaughter	çatışma	
Praxis	noun	feminine	Praxen	Die Praxis hat gezeigt, dass nicht alle Theorien nützlich sind.|Die Untersuchung sozialer Praktiken gehört zum Aufgabenbereich der Kulturwissenschaften.	practice|doctor's office	tatbik|uygulama|tecrübe|muayenehane	
Mannschaft	noun	feminine	Mannschaften	Einer von der Mannschaft blieb immer an Bord.	team|crew	takım|tim	
Ebene	noun	feminine	Ebenen	Hinter den Bergen erstreckt sich eine scheinbar endlose Ebene.	plane|plain|level|floor	düzlem|satıh|düzlük|plato	
Respekt	noun	masculine		Ich habe Respekt vor meinen Eltern.|Ihr Einsatz verdient allen Respekt.|Der Direktor ist eine Respekt einflößende Person.|Respekt, Respekt in Ihrem Alter schon Doktor.|„Als Stadtkind hatte ich diesen Respekt noch nicht.“	respect		rêz|rêzgirtin
Jonathan	noun	masculine	Jonathan	Ich esse gerade einen Jonathan.			
Fernseher	noun	masculine	Fernseher	Mach mal endlich den Fernseher aus.|„Die Fernbedienung war kaputtgegangen, infolgedessen blieb der Fernseher schwarz.“|„Er schaltete den Fernseher ein.“|„Mein Fernseher läuft eigentlich immer.“			
Situation	noun	feminine	Situationen	In dieser Situation hätte ich genauso gehandelt.|Nun bin ich in derselben Situation wie du.|„Die Situation hatte etwas von einer Audienz.“|„Sie könnte die Situation natürlich auch nutzen, um eine Taschengelderhöhung herauszuschlagen.“	situation	durum|vaziyet	rewş
Leistung	noun	feminine	Leistungen	Der Chef bewilligte die Gehaltserhöhung des Mitarbeiters aufgrund seiner guten Leistungen.	performance|power|benefit|payment	başarı|performans|güç|tediyat	
Sicht	noun	feminine	Sichten	Von diesem Standort aus hat man eine hervorragende Sicht in die Landschaft.	view|sight|visibility|point of view	görme|görünüm|manzara|görüş	
Mark	noun	feminine	Mark	Das brachte ihnen zwanzig Mark Silber ein.	mark|march		
Mark	noun	neuter		Echter Sago wird aus dem Mark von Palmen gewonnen.	marrow|core|pulp		
Zukunft	noun	feminine	Zukünfte	Wir werden in Zukunft nicht mehr miteinander ausgehen.|Niemand weiß, was die Zukunft bringen wird.|„Noch weniger können wir etwas über die Zukunft sagen.“	future|futurity|future tense	gelecek|istikbal|gelecek zaman	
Öffentlichkeit	noun	feminine	Öffentlichkeiten	Die Öffentlichkeit reagiert auf solche Äußerungen meist empfindlich.|„Am letzten Julitag, einem Freitag, steigerte sich die Unruhe der Öffentlichkeit abermals.“|„Die Öffentlichkeit erfuhr davon zunächst nichts.“	public|public sphere	kamuoyu	
Jugend	noun	feminine		Die Jugend erlebt man eher unbeschwert als das Alter.	youth|adolescence|boyhood	gençlik	ciwanî
Sicherheit	noun	feminine	Sicherheiten	Während draußen der Schneesturm tobte, waren wir in der Hütte in Sicherheit.	security|safety|surety|certainty	emniyet|güvenlik	ewlehî
Gegenwart	noun	feminine		Dieses alte Buch ist sehr gut auf die Gegenwart zu übertragen.	present|presence|present tense	şimdiki zaman	
Beziehung	noun	feminine	Beziehungen	Er hat eine gestörte Beziehung zu seinem Vater.|„Das reicht aus, um eine ruhige, ausgeglichene Beziehung unmöglich zu machen.“|Zwischen Europa und Amerika bestehen enge wirtschaftliche Beziehungen.	relation|relationship|affair|contact	ilişki|irtibat	têkilî
Schauspielerin	noun	feminine	Schauspielerinnen	Schauspieler/in ist eine landesrechtlich geregelte, drei- bis vierjährige, schulische Ausbildung an Berufsfachschulen.|„Jetzt bin ich nur noch Figurantin, aber früher war ich einmal Schauspielerin.“|„So muss sich eine Schauspielerin vor ihrem ersten großen Auftritt fühlen.“	actor|actress	oyuncu|aktris	
Bibel	noun	feminine	Bibeln	Das erste gedruckte Buch (von Johannes Gutenberg) ist die Bibel.|„Besonders fasziniert war ich von der Bibel.“	Bible	İncil|Kitab-ı Mukaddes	Încîl
Aufnahme	noun	feminine	Aufnahmen	Schon die Aufnahme der Verhandlungen stand unter einem ungünstigen Stern.	start|reception|adoption|absorption	başlama|alınma|dahil etme|alma	
Phase	noun	feminine	Phasen	Das geschah in der Phase, als die Krankheit sich gerade erst ankündigte.	phase	aşama|safha|faz|evre	
Führung	noun	feminine	Führungen	Werner sollte sich gestern für sein schlechtes Benehmen bei der Führung verantworten.	direction|command|management|leadership	idare|yönetim|önde olma	
Spitze	noun	feminine	Spitzen	Das Metallstück hat sehr scharfe Spitzen.	point|peak|lace|dig	uç|doruk|zirve|lider	
Reise	noun	feminine	Reisen	Die Reise nach New York war kurzweilig und angenehm.|Die Reise nach China war ein großes Erlebnis.|Er hat sich auf eine Reise durch Afrika begeben.|Sie hat sich von ihrer Reise zurückgemeldet.|Die beiden sind noch nicht wieder von ihrer Reise durch Belgien zurückgekehrt.|Er ist geschäftlich viel auf Reisen.|„Der nächste Abschnitt seiner Reise würde der bis dahin gefährlichste werden.“	travel|journey|trip|voyage	sefer|seyahat|yolculuk	
Meinung	noun	feminine	Meinungen	Theodor vertritt seine Meinung ziemlich hart.|Bist du nicht der gleichen Meinung?|Die beiden sind fast immer unterschiedlicher Meinung.|Dürfte ich Sie nach Ihrer Meinung fragen?|Niemand hatte ihn um seine Meinung gebeten.	opinion|intention	düşünce|fikir|görüş|kanaat	
Arbeiter	noun	masculine	Arbeiter	Der Arbeiter näht Hemden.|Die Arbeiter organisierten sich in einer Gewerkschaft.|„In Wöbbesse lebte ein Arbeiter Kiel, der als Freischütz bekannt war.“	worker	amele|emekçi|işçi	karker
Operation	noun	feminine	Operationen	Die Operation ist gut verlaufen.|Eine Brustvergrößerung ist eine sehr heikle Operation.|„Freiwillige Operationen sind also nicht meine Sache.“|„In zwei Wochen ist ihre Operation.“	surgery|operation	ameliyat|operasyon|işlem	emeliyat|operasyon
Kontrolle	noun	feminine	Kontrollen	Die gestrige Kontrolle der Polizei war hier.|Frau Meier, bitte übernehmen Sie die Kontrolle beim Wareneingang.|Der junge Mann fiel bei einer Kontrolle auf.	inspection|control	kontrol	
Tour	noun	feminine	Touren	Nach der eintägigen Tour kamen die Touristen abends wieder im Hotel an.|„Studiosus bietet solche Touren an.“	tour	tur	
Entfernung	noun	feminine	Entfernungen	Ich schätze, der Unfallort liegt in 25 m Entfernung von der Kreuzung.|„Die Entfernung betrug ungefähr fünfzig Meilen.“	distance|removal	mesafe|uzaklık|uzaklaştırma	dûrbûn
Aussage	noun	feminine	Aussagen	Er widerrief seine Aussage.	statement|stated view|testimony|message	açıklama|izah|ifade|kaziye	
Verfassung	noun	feminine	Verfassungen	Seit sie Sport treibt, ist sie in guter Verfassung.	constitution|state	hâl|anayasa	
Stellung	noun	feminine	Stellungen	Welche Stellung hast du genau?|„Sophie gibt ihre Stellung an der Kunstgewerbeschule in Zürich auf.“	position|opinion|attitude|post	mevki|duruş|poz|pozisyon	kozik
Leiter	noun	masculine	Leiter	Der Leiter eines Unternehmens hat meist große Befugnisse.|Der Leiter dieser Abteilung hat auch im April mit der Arbeit begonnen.|„Die Aussortierung erfolgte ausschließlich in den jeweiligen Ressorts von deren Leitern.“|„Der Leiter des SWAT-Teams kam auf Bob zu.“	head|director|leader|conductor	idareci|yönetici|iletken	
Leiter	noun	feminine	Leitern	„Ich habe schon wieder eine Leiter im Strumpf!“			
Existenz	noun	feminine	Existenzen	Seine Existenz stand auf dem Spiel.|„Ich dachte an Bosse, der versuchte, sich eine neue Existenz aufzubauen.“	existence|livelihood	varoluş|geçim|var olma	hebûn
Ursache	noun	feminine	Ursachen	Die Ursache ihrer Krankheit war ein schlechter Zahn.	cause|reason	neden|sebep	sedem
Tatsache	noun	feminine	Tatsachen	Das ist eine Tatsache.|„Eine weitere Tatsache kommt dazu.“	fact	gerçek|hakikat	
Erklärung	noun	feminine	Erklärungen	Eine Bedienungsanleitung enthält eine Erklärung der Funktion des Gerätes.	explanation	izah|açıklama|izahat	
Graf	noun	masculine	Grafen	Der König ernannte ihn zum Grafen.	count|earl|graph	kont|çizge|çizit|graf	
Falle	noun	feminine	Fallen	Das Stellen von Fallen gilt als unwaidmännisch.	trap|lock|sluice|catch	kapan|tuzak	
Stufe	noun	feminine	Stufen	Die Treppe des CN Towers hat 1776 Stufen.|„Ich zählte 176 Stufen, dann war ich unten.“	step|tap|degree|level	basamak|kademe	
Künstler	noun	masculine	Künstler	Nicht nur Künstler produzieren Kunst.|„Kurt Schwitters ist heute sicherlich der bekannteste Künstler aus Hannover.“	artist	sanatçı	hunermend
Titel	noun	masculine	Titel	Der Titel eines Buchs von Stefan Zweig lautet: „Schachnovelle“.|„Werke, deren Titel sie nicht verstanden, schienen ihnen ein Mysterium zu enthalten.“	title	başlık|unvan	
Herzinfarkt	noun	masculine	Herzinfarkte	Mein Vater erlitt einen Herzinfarkt.|„Er starb jung, mit 47, an einem Herzinfarkt.“	heart attack|myocardial infarction		mirina masûlkeyên dil
Jacke	noun	feminine	Jacken	Ziehe dir eine Jacke über, es ist Herbst!|„Sie zieht die Jacke aus.“	jacket|coat	ceket	
Jagd	noun	feminine	Jagden	Eine Jagd wird nach ganz strengen Regeln durchgeführt.|Morgen gehe ich auf die Jagd.	hunt|hunting|chase	av|takip	nêçîr
Scheißkerl	noun	masculine	Scheißkerle	Verpiss dich, du Scheißkerl!|„Ich hoffe, der Scheißkerl ist in Kalifornien.“|„Der Scheißkerl fing an, ihm auf die Nerven zu gehen.“|„Kann sein. Aber er ist trotzdem ein Lügner und ein Scheißkerl.“|„Ich werde die Scheißkerle finden, die das getan haben.“	bugger|prick|shithead|sod		
Kuss	noun	masculine	Küsse	„Sie gab ihm einen kurzen Kuss auf die Wange.“|„Das war mein erster Kuss.“	kiss	öpücük	macık|maç|paç|mirç
Eindruck	noun	masculine	Eindrücke	Das hat bei ihm sicherlich Eindruck hinterlassen.	impression		
Kühlschrank	noun	masculine	Kühlschränke	Immer wenn man die Tür des Kühlschrankes öffnet, brennt darin Licht.|Die Flasche Wein steht im Kühlschrank.|„Ich muss etwas Salziges essen, aber der Kühlschrank ist leer.“|«Im Kühlschrank fand sich eine angebrochene Packung Milch.»|„In der Teeküche nahm er eine Limonade aus dem Kühlschrank.“|„Aus der Küche höre ich das Geräusch des zuschnappenden Kühlschranks.“|„Sie hatte den Haustürschlüssel auf den Kühlschrank gelegt.“|„Den Kühlschrank haben wir schon ausgeräumt, die Küchenregale ebenfalls.“|„Eier sollten Sie am besten im Kühlschrank lagern.“|„Eier in der Schale sind bis zu sechs Wochen im Kühlschrank haltbar.“	refrigerator|fridge|refridge|frigerator	buzdolabı	sarinc
Humor	noun	masculine	Humore	Trotz der Krankheit hat er seinen Humor nicht verloren.|Humor ist, wenn man trotzdem lacht.|Bei der Arbeit am Wiktionary sollte man nie seinen Humor verlieren.|„In der Tat muss man zwischen Witz und Humor unterscheiden.“	humour|sense of humour|humor		
Humor	noun	masculine	Humores	Die Menge des Humors bestimmt den Augeninnendruck.			
Reihe	noun	feminine	Reihen	Die Soldaten traten in einer Reihe an; sie standen Schulter an Schulter.	row|chain|series|rank	sıra|birkaç|seri|satır	rêz
Hügel	noun	masculine	Hügel	Durch die vielen Hügel ist das Radfahren ganz schön anstrengend.|„Das Haus seiner Eltern lag auf einem Hügel am Waldrand.“|„Noch war die aufgehende Sonne hinter dem benachbarten Hügel verborgen.“	hill|hillock|hump|hummock	tepe	
Gegensatz	noun	masculine	Gegensätze	Sein Handeln steht im Gegensatz zu dem was er sagt.	contrast|opposite|antithesis	paradoks|çelişki|tenakuz|antitez	
Spieler	noun	masculine	Spieler	Eine Fußballmannschaft hat elf Spieler.|Die jungen Spieler wollen alles geben.	player|gambler	oyuncu|oynatıcı	lîstikvan
Beginn	noun	masculine	Beginne	„Sie warteten im Schulhof auf den Beginn der Veranstaltung.“	beginning|start|commencement	başlangıç|iptida	
Original	noun	neuter	Originale	„Eigil sagte, er würde die Briefe kopieren und ihm die Originale zurückschicken.“	original		
Einsatz	noun	masculine	Einsätze	Der Einsatz war vergeblich, da die Täter bereits das Weite gesucht hatten.	mission|entry|entrance|beginning	operasyon|giriş|parça|kendini verme	
Ernst	noun	masculine		Er war mit tiefem Ernst bei der Sache.|Ich möchte jetzt mit meinen Plänen Ernst machen.|Er sagte im Ernst, dass er sich von mir trennen wollte.	earnestness|austerity|seriousness		
Vertrag	noun	masculine	Verträge	„Daphne beklagte sich über ihren Vertrag und über die Nebenrechte.“	agreement|contract	ahit|kontrat|sözleşme	peyman|hevpeyman
Wert	noun	masculine	Werte	Bei dem Feuer wurden Waren im Wert von mehreren Millionen Euro vernichtet.	value|price|worth|securities	değer|kıymet	nirx
Markt	noun	masculine	Märkte	Auf einem Markt werden von vielen Händlern häufig unterschiedlichste Waren angeboten.|„Was mich mehr interessierte, war das Publikum auf dem Markt.“	market|market town	çarşı|pazar|piyasa	
Bürgermeister	noun	masculine	Bürgermeister	Bürgermeister und Gemeinderat verabschieden den neuen Gemeindehaushalt.|Es sind nicht die klügsten Bauern, die sich zum Bürgermeister wählen lassen.	mayor|provost	belediye başkanı|belediye reisi	şaredar
Park	noun	masculine	Parks	Der Park ist sehr schön angelegt.|„So lief ich in meinem Krankenhausbett liegend in Gedanken am Park entlang.“	park	park	park
Präsident	noun	masculine	Präsidenten	Der erste Präsident der Bundesrepublik Deutschland war Theodor Heuss.|„Doch aus allen Richtungen treiben die Jäger den Präsidenten in die Enge.“	president|chairman	cumhurbaşkanı|başkan	
Brille	noun	feminine	Brillen	Es ist nicht bekannt, wer die erste Brille herstellte.|„Die Brille rutscht ein wenig hoch, als sie mich anlächelt.“	glasses eyeglasses spectacles specs|goggles|toilet seat	gözlük	berçavk
Einfluss	noun	masculine	Einflüsse	Die Frauen hatten großen Einfluss auf das Schaffen Camilo Sestoss.	influence	etki	bandor|tesîr
Schutz	noun	masculine	Schutze	Die Blauhelm-Soldaten boten der Bevölkerung den notwendigen Schutz.|Sie suchten in einer Berghütte Schutz vor dem drohenden Unwetter.	care|protection	koruma|müdafaa	
Druck	noun	masculine	Drücke	Vor dem Abitur stehen viele Schüler unter Druck.	pressure|stress|pressing|push	basınç|tazyik|baskı	
Druck	noun	masculine	Drucke	Ein guter Druck ist meist kaum vom Original zu unterscheiden.|„Er stellte mehr als 200 Drucke her.“	print|printing	baskı	
Schauspieler	noun	masculine	Schauspieler	Er war mal ein berühmter Schauspieler in Hollywood.|„Trump ist nicht der erste Schauspieler im höchsten Staatsamt der USA.“	actor	oyuncu|aktör|aktris	
Stil	noun	masculine	Stile	Zum guten Stil beim Verfassen von Werken gehören Einleitung und Ausklang.|Viele berühmte Maler entwickeln ihren eigenen Stil.	style	stil	
Meister	noun	masculine	Meister	Man sieht die Hand des Meisters.|Er ist ein Meister seiner Zunft.|„Der Meister und sein Lehrling verlegen Teppichboden.“|„Der Meister ging mühselig, etwas hinkend.“	master|champion	usta|birinci|üstat	
Prozess	noun	masculine	Prozesse	Die Entwicklung des Rechtsstaates war historisch ein langer Prozess.|„Platin beschleunigt Prozesse in Brennstoffzellen, Iridium in Elektrolyseuren.“	process|trial|lawsuit|litigation	proses|süreç|dava|işlem	pêvajo
Vergleich	noun	masculine	Vergleiche	Der Vergleich ergibt, dass Peter größer als Hans ist.|Deine Krankheit ist nichts im Vergleich zu seiner.	comparison|simile|settlement|compromise	karşılaştırma|mukayese|denkleştirme|mutabakat	
General	noun	masculine	Generale	Er wurde etwas verspätet zum General befördert.	general	general|paşa	general
Bahnhof	noun	masculine	Bahnhöfe	Der Zug endet im Bahnhof Köln Hauptbahnhof.	train station|station|railroad station|railway station	gar|istasyon	
Zeitpunkt	noun	masculine	Zeitpunkte	Damit war der Zeitpunkt gekommen, sich zur Prüfung anzumelden.|„Zu diesem Zeitpunkt wurde sie zwangsläufig zu einer nationalen und internationalen Figur.“	moment	an|zaman	
Professor	noun	masculine	Professoren	„Er stammt aus der Bibliothek von Professor Gomperz.“|„Der Professor lächelte fast mitleidig.“	professor	profesör	
Bürger	noun	masculine	Bürger	Die Bürger Berlins gingen auf die Straßen und protestierten.	inhabitant ; [1b] citizen|civilian|bourgeois|the middle class	sakin ; [1b] vatandaş	
Dienst	noun	masculine	Dienste	Sein Dienst geht von acht bis siebzehn Uhr.|„An diesem Gründonnerstag hatte er noch Dienst, danach begannen seine Osterferien.“	duty|work|service	iş|hizmet|destek|yardım	xizmet
Unterschied	noun	masculine	Unterschiede	„Der wesentliche Unterschied zwischen beiden Sportarten besteht in den Fluggeräten.“	difference|contrast	ayrılık|fark	
Versuch	noun	masculine	Versuche	Er übersprang die 3 Meter gleich im ersten Versuch.|Beim Mord ist auch der Versuch strafbar.|Der erste Versuch schlägt oft fehl.	attempt|try|experiment|essay	deneme|tecrübe|deney	
Rat	noun	masculine	Räte	Ich weiß nicht, aber dein Rat gefällt mir nicht.	advice|counsel|council|councillor	tavsiye|öneri|heyet|konsey	
Zweck	noun	masculine	Zwecke	Viele laufen zum Zwecke der körperlichen Ertüchtigung.|Es hat keinen Zweck mehr, in das marode Unternehmen zu investieren.	point|use|purpose	amaç|gaye|maksat	
Charakter	noun	masculine	Charaktere	„Wird der Charakter von der Umwelt geprägt?“	character|characteristic	karakter	
Abstand	noun	masculine	Abstände	Halte Abstand im Straßenverkehr.|„Auf gerader Strecke stehen die Leitpfosten in einem Abstand von 50 Metern.“	distance|interval|indemnity|compensation	mesafe|uzaklık	
Typ	noun	masculine	Typen	Autos dieses Typs sind besonders selten und, infolgedessen, auch besonders teuer.	type	tip	
Kontakt	noun	masculine	Kontakte	„Das Mittel darf mit der Haut nicht in Kontakt kommen.“	contact	bağlantı|temas|katalisatör	têkilî
Song	noun	masculine	Songs	Der Song „Yesterday“ der Beatles war weltberühmt.	song|track		
Blick	noun	masculine	Blicke	Das Kind entschwand ihren Blicken.|Der Ankömmling ließ den Blick durch den Raum schweifen.|„Ich drehte mich um und warf einen Blick durch den Raum.“|„Treecastle warf wieder einen langen Blick auf Florine.“|„Die Weißweingläser klirren, der Blick schweift über das Mittelmeer.“	look|glance|peek|glimpse	bakma|bakış|nazar	
Abschluss	noun	masculine	Abschlüsse	Der luftdichte Abschluss der Verpackung gewährleistet längere Haltbarkeit.	shutting up|exclusion|border|rim	son|mezuniyet|bitim|bitiş [3] mezuniyet	
Schritt	noun	masculine	Schritte	Ihre Schritte hallten durch den Korridor.|„Schritte kamen die Treppe hinab.“	step|crotch	adım|ağ	gav
Rest	noun	masculine	Reste	Auf seinem Teller blieb noch ein kleiner Rest Fleisch liegen.|Ich möchte keine Reste essen, kannst du nicht was Ordentliches kochen?|Und aus den Resten habe ich dann ein Faschingskostüm genäht.	remainder|rest|remnant|radical	artan|kalıntı|kalan	
Schmerz	noun	masculine	Schmerzen	Der Täter fügte seinem Opfer mit einem Stock erhebliche Schmerzen zu.|„Aber der Schmerz wurde immer stärker.“|„Die Schmerzen im Arm wurden immer quälender.“	ache|pain|sorrow|dolour	ağrı|sancı|acı	
Schluss	noun	masculine	Schlüsse	Der Schluss des Filmes passte stilistisch nicht.	close|conclusion|end|termination	kapanış|nihayet son|netice|sonuç	
Abteilung	noun	feminine	Abteilungen	In der Feinschmecker-Abteilung des KaDeWe kann man die erlesensten Köstlichkeiten kaufen.|„Trump verspricht sich von der neuen Abteilung massive Einsparungen im Regierungsapparat.“	department|unit|division|subdivision	bölüm|departman|kısım|seksiyon	
Abteilung	noun	feminine	Abteilungen	Die Abteilung des Raumes schuf mehr Privatsphäre.	division|section	reyon	
Unterhaltung	noun	feminine	Unterhaltungen	Die Unterhaltung des Hundes kostet mich viel Geld.	maintenance|entertainment|conversation|palaver	eğlence	
Kuchen	noun	masculine	Kuchen	„Oh Mann, wir lieben Kuchen!“	cake|pie|tart	kek	
Spielzeug	noun	neuter	Spielzeuge	Räume dein Spielzeug auf!|„Billiges Spielzeug und später die Spielkonsole sollten ihn beschäftigen.“	toy	oyuncak|oynamak|eğlenme	pêlîstok|lîstok
Lüge	noun	feminine	Lügen	„Phantasie und Lüge sind zweierlei.“|„Die Lüge steht groß auf seinen dicken Backen geschrieben.“|„Trotz aller Schikanen, Frivolitäten und Lügen glaubte ich an sie.“	lie	yalan	derew|vir
Knochen	noun	masculine	Knochen	Der Hund kaut an einem Knochen.|„Eine Grube enthielt Tieropfer, auch menschliche Knochen.“	bone|dog bone wrench|dog bone spanner	kemik	hestî|ئێسک
Notfall	noun	masculine	Notfälle	Für den Notfall steht noch ein Truppenpsychologe bereit.|„Manche bleiben auf dem Weg zum Notfall einfach liegen.“	emergency	acil durum|tehlikeli durum	
Bedenken	noun	neuter	Bedenken	Unser Bedenken der Problematik sollte möglichst bald erfolgen.	consideration|reflection|concern|doubt	düşünme|endişe	
Leidenschaft	noun	feminine	Leidenschaften	Sie besitzt eine Leidenschaft für Musik.|Er diskutierte mit Leidenschaft.|Sie entwickelte eine Leidenschaft für kleine Porzellanfiguren.|Sie fielen voller Leidenschaft übereinander her.|Er küsste in wilder Leidenschaft ihren Hals.|„Er vereinte die Leidenschaft für Soul-Musik, Verlagswesen, Karneval und Waren in sich.“|„Slime, auch Schleim genannt, war die große Leidenschaft meiner Tochter.“	passion	hırs|tutku|ihtiras	
Senator	noun	masculine	Senatoren	Der Senator für Stadtentwicklung traf sich gestern mit dem Bürgermeister.	senator	senatör	
Fähigkeit	noun	feminine	Fähigkeiten	Im Berufsleben muss man über bestimmte Fähigkeiten verfügen.	ability|capability|skill	kabiliyet|yetenek	
Kissen	noun	neuter	Kissen	Ich lege mir ein Kissen in den Rücken.|„Ich vergrabe meinen Kopf umterm Kissen.“|„Aus einem Stoffbeutel zogen Sophie und er zwei Kissen.“	cushion|pillow	yastık	
Appetit	noun	masculine		Ich habe gerade keinen Appetit.|„Joes Appetit war gewaltig, ja geradezu bodenlos.“|„Ihr ist der Appetit vergangen.“|„Sie verliert den Appetit und kann ihr Dessert nicht mehr essen.“	appetite	iştah	
Laden	noun	masculine	Läden	Beiderseits der Hauptstraße gibt es viele Läden.	shop|store|shutter|business	dükkân|panjur|mesele	
Laden	noun	neuter		Beim Laden löste sich ein Schuss.			
Mittag	noun	masculine	Mittage	Eines Mittags stand er am Zaun.|Gegen Mittag werden wir vorbeikommen.|Wir essen um zwölf Uhr zu Mittag.	noon|midday|lunchtime	öğle	
Mittag	noun	neuter		Kinder, reinkommen, es gibt Mittag!|Wir hatten seit Tagen kein richtiges Mittag mehr.|Dein Mittag steht dort drüben, Franz.			
Fahrer	noun	masculine	Fahrer	Er jobbt zur Zeit als Fahrer bei einem Kurierdienst.|„Die Fahrer daneben rauchten, warteten geduldig auf die wie üblich schleppende Abfertigung.“	driver|chauffeur	sürücü|şoför	
Haufen	noun	masculine	Haufen	Der Haufen an Schrott im Vorgarten muss noch beseitigt werden.	heap|dung	yığın	
Ankunft	noun	feminine	Ankünfte	„Meine Mission wird mit unserer Ankunft in Frankreich nicht abgeschlossen sein.“|„Im Jahr meiner Ankunft in Deutschland war ich siebenundzwanzig Jahre alt.“	arrival	varış	
Antwort	noun	feminine	Antworten	Ich erwarte eine Antwort auf meine Frage!|„Beim gemeinsamen Abendessen verlangte ich von Max Rosenfeld eine Antwort.“	answer	cevap|karşılık|yanıt	bersiv
Ausgang	noun	masculine	Ausgänge	Der Ausgang ist als solcher gekennzeichnet.|Der Ausgang führt auf den Hof.|Wir befinden uns wieder am Ausgang des Tales.	exit|leave|outcome	çıkış|çıkma|netice|sonuç	
Miete	noun	feminine	Mieten	Wir zahlen monatlich 1200 Euro Miete.|Die Miete für diese Wohnung beträgt 750 Euro.|„Die Mieten steigen ständig.“|„Die Miete konnte er sich auch leisten.“	rent|rentage|rental|hire	kira	kirê
Miete	noun	feminine	Mieten	Im Zimmer sind Mieten.			
Bar	noun	neuter	Bars	Der normale Luftdruck auf der Erde ist ungefähr ein Bar.	bar	bar	bar
Bar	noun	feminine	Bars	Als ich aus der Bar kam, begann die Welt sich zu drehen.|„Nach dem Abendessen ging Stefan direkt in die Bar.“|„Ich ging an die Bar und setzte mich auf einen Hocker.“	bar	bar	bar
Butter	noun	masculine		Iss hin und wieder Butter!|Butter ist ein wertvolles Nahrungsmittel.|Meine Mutter brät mit Butter.|„Die Brezeln waren aufgeschnitten und mit Butter bestrichen.“	butter	tereyağı	nivîşk|کەرە
Bad	noun	neuter	Bäder	Nimm doch wieder mal ein Bad.|„Er hatte eine Rasur nötig, einen Haarschnitt, ein Bad.“	bath|bathhouse|beach establishment|spa	banyo|banyo yapma|haymana	
Anzug	noun	masculine	Anzüge	Wie sieht denn dein Anzug heute aus?	approach|move|attire|suit	takım elbise	
Protokoll	noun	neuter	Protokolle	Herr Müller schreibt heute das Protokoll!|Der Zeuge gab seine Beobachtungen zu Protokoll.|„Teilweise konnten Zeugen befragt oder ihre Protokolle genutzt werden.“|„Das Protokoll schildert den Lauf der Ereignisse.“	record|report|minutes|protocol	not|protokol|ceza	
Gedanke	noun	masculine	Gedanken	„Es bleibet dabei, die Gedanken sind frei!“ - Volkslied	thinking|thought|idea	düşünce|fikir	
Mädel	noun	neuter	Mädel	Sie haben Nachwuchs bekommen - ist es ein Bub oder ein Mädel?	girl|maid		
Schwarz	noun	neuter		Das Schwarz ihrer Augen war schwärzer als die Nacht.|„Das Schwarz ist daher nichts, was von selbst Bestand hätte.“|„Das Schwarz von Pik scheint zu zerlaufen.“	black|sable		
Hühnchen	noun	neuter	Hühnchen	„Das Hühnchen entzückte Direktor Schallenberg aufs neue.“	pullet		
Hütte	noun	feminine	Hütten	Die Hütte bietet Schutz vor Regen.|„Friede den Hütten, Krieg den Palästen!“|„In der Hütte war es stickig und heiß.“	hut|cabin|cottage|ironworks	kulübe	
Koch	noun	masculine	Köche	Der Koch gab sich viel Mühe mit der Zubereitung der Speisen.|„Ich habe inzwischen verstanden, dass Köche beneidenswerte Männer sind.“|„Er war Koch, ein Reisender und ein Gourmet.“	cook	aşçı	
Beweis	noun	masculine	Beweise	Die Beweise, die dem Gericht von der Klägerin vorgelegt wurden, waren erdrückend.	evidence|proof	delil|ispat|kanıt	
Achtung	noun	feminine		Warum bringst du ihr gegenüber keine Achtung auf?|Dieser Tatsache sollte gebührend Achtung geschenkt werden.|Dieser Kriminelle hat keine Achtung vor dem Gesetz.|Peters Kollegen empfanden ihm gegenüber ein hohes Maß an Achtung.	esteem|respect|attention|watch out	dikkat	
Mittagessen	noun	neuter	Mittagessen	Heute gab es Fischsuppe zum Mittagessen.|„Nach dem Mittagessen wurde der Unterricht fortgesetzt.“|„Max hätte gern beim Mittagessen Gesellschaft gehabt.“|„Vor dem Mittagessen mußte ich die Hände vorzeigen.“	lunch	öğle yemeği	firavîn
Küste	noun	feminine	Küsten	Sie gingen an der Küste entlang.	coast|shore	kıyı|sahil	
Hafen	noun	masculine	Häfen	Das Schiff läuft den nächsten Hafen an.|Eine Fähre fährt von einem Hafen zum anderen.|„Die Franzosen versuchen mit Schiffen den Hafen zu blockieren.“	harbour|port|haven|pot	liman	gemîgeh
Deck	noun	neuter	Decks	Lass uns doch mal an Deck gehen!|„Der Abstand zwischen den Decks betrug etwa zweieinhalb Meter.“|„Danach half ich Ben, mit mir gemeinsam aufs Deck zu kommen.“	deck	güverte	
Streit	noun	masculine	Streite	„Als wir gehen, gibt es Streit, der zweite an diesem Abend.“|„Eine Frau hat bei einem Streit immer das letzte Wort.“|„Ein scharfer, schneller Streit entstand plötzlich vor dem Café .“	aggro|argument|dispute|quarrel	münakaşa|tartışma|kavga	
Erinnerung	noun	feminine	Erinnerungen	„Er hielt die Erinnerung für die lebenerhaltende Kraft der Menschen und Planeten.“	memory|recall|remembrance|recollection	anı	bîranîn
Pfund	noun	neuter	Pfunde	„Ein Mann wiegt immerhin seine mindestens fünfundachtzig bis hundertfünfzig Pfund.“	pound		
Märchen	noun	neuter	Märchen	Dornröschen war auch ein schönes Märchen.|„Der Tag wird interessanter, wenn man Märchen erzählt.“|„Deutsche Märchen sind durch jahrhundertelanges Umschreiben verweichlicht worden.“	fairy tale	masal	
Geisel	noun	masculine	Geiseln	Nicht schießen, ich habe eine Geisel in meiner Gewalt!	hostage	rehine|tutak	
Klinge	noun	feminine	Klingen	„Das Kratzen der Klinge bildete ein dumpfes Hintergrundgeräusch."	blade		
Anzeige	noun	feminine	Anzeigen	Sie geben ihre Hochzeit durch eine Anzeige im Lokalblatt bekannt.|Firma Schneider wirbt mit einer ganzseitigen Anzeige.	announcement|advertisement|offence report|display	ilan|ihbar|indikatör|gösterge	
Strafe	noun	feminine	Strafen	Er muss als Strafe ins Gefängnis.	penalty|punishment|fine	ceza|ukubet|para cezası	
Antrag	noun	masculine	Anträge	Um eine Verlängerung zu bekommen, muss man einen Antrag einreichen.|Ohne einen Antrag auf Erstattung erhält man nichts erstattet.	application|petition|request	arzuhâl|dilekçe|önerge|başvuru	daxwazname
Charlotte	noun	feminine	Charlotten	Der krönende Abschluss des Menüs war eine traditionelle Charlotte mit Äpfeln.	charlotte		
Atem	noun	masculine		Der Atem des Schlafenden war kaum zu hören.|„Ich spüre seinen Atem an meinem Ohr.“|„Sein Atem war heiß und feucht.“	breath	nefes	nefes
Café	noun	neuter	Cafés	Ich saß in einem Café und las eine Zeitung.|„Wir trafen uns wieder im Café Het Loosje bei der alten Waage.“|„Auf der Suche nach einem Café kamen sie an einem Supermarkt vorbei.“	café|cafe	kafe|kahvehane	
Zahn	noun	masculine	Zähne	Der Zahnarzt entfernte ihr drei Zähne.|Das Kleinkind bekommt seine ersten Zähne.|Zähne sind ein Teil des Gebisses.|Jemand hat ihm einen Zahn ausgeschlagen.	tooth|cog|tine	diş	diran
Ehemann	noun	masculine	Ehemänner	Sie hat letzten Sonntag meinen Freund geheiratet, jetzt ist er ihr Ehemann.	husband	koca	
Decke	noun	feminine	Decken	Der See hat eine dicke Eisdecke.	layer|blanket|ceiling|coat	satıh|yüzey|örtü|battaniye	
Jude	noun	masculine	Juden	Albert Einstein war Jude.	Jew|Judaist	Musevi|Yahudi	
Büro	noun	neuter	Büros	„Jede Stunde, die er dem Büro entzogen wurde, machte ihm Kummer.“|„Ich saß in meinem Büro.“|„Die Büros waren mit Möbeln aus hellem Birkenholz eingerichtet.“	office|bureau|home office	büro|ofis	
Hotel	noun	neuter	Hotels	In der Ferienzeit sind die meisten Hotels ausgebucht.|„Wir stellten den Parnassus am Hotel ab, und ich ging zum Telefon.“	hotel	otel	otêl
Scheune	noun	feminine	Scheunen	In Gebirgsgegenden gibt es Scheunen mit Hocheinfahrt.|„Hogan war in der Scheune bei der Arbeit.“	barn	ahır|ambar|samanlık	
Presse	noun	feminine	Pressen	Ich hasse das Feuilleton und die Presse allgemein.|„Die Presse brachte den Vorfall mit Schlagzeilen.“	press	baskı makinesi|cendere|basın|matbuat	
Keller	noun	masculine	Keller	Im Keller ist es oft dunkel.|Wer geht in den Keller?|Er gab, was Küche und Keller boten.|„Im Keller roch es nach Kartoffeln und ausgetrunkenen Weinflaschen.“|„Hier roch es nach Keller.“|„Bundschuh hatte in seinem Keller Regale vollstehen mit Sportgeräten und Spielzeug.“	basement|cellar|stack	bodrum|yığın	
Weihnachten	noun	neuter	Weihnachten	In drei Tagen ist Weihnachten.|„Suppenküche der Johanniter. Bedürftigen ein schönes Weihnachten bescheren.“|„Die gemütlichen Weihnachten sind eine bürgerliche Erfindung des 19. Jahrhunderts.“|Zu Weihnachten soll es schneien.|An Weihnachten soll es nicht schneien.|Wir fahren über Weihnachten in Urlaub.|Letzte Weihnachten hat es geregnet.|„Nach Weihnachten fuhren Mama und Papa zum Klassentreffen nach Jever.“	Christmas|Xmas	Noel	gaxan
Moment	noun	masculine	Momente	Hast du einen Moment Zeit für mich?|„Für einen Moment ist es still.“|„Ich dachte einen Moment nach.“	moment	an	
Moment	noun	neuter	Momente	Auslösendes Moment für alle späteren Ereignisse war der Konflikt mit …	moment|torque	moment	
Labor	noun	neuter	Labore	Die Arbeit im Labor war erfolgreich.	laboratory|lab	laboratuvar	ezmûngeh|taqîgeh
Ecke	noun	feminine	Ecken	In der Ecke des Zimmers stand ein Ofen.|Der Torwart ahnte die Ecke und hielt den Elfmeter.	corner|angle|edge|vertex		
Eingang	noun	masculine	Eingänge	Der Eingang befindet sich rechts.|„Ich stand am Eingang und sah sie an.“	entrance|way in	giriş	
Fräulein	noun	neuter	Fräulein	„Hallo, kleines Fräulein, haben Sie heut’ Zeit … ?“ – (Schlager „Gisela“)|„Allerdings machten die Fräuleins hier einen anständigen Eindruck.“|Ein Fräulein ist eine Frau, der zum Glück der Mann fehlt.	miss|Miss		
Huhn	noun	neuter	Hühner	Wir züchten hier Hühner.|„Das Huhn hat die Straße nicht überquert.“|„Es war ein Nutzbau, wie die Käfige, in denen Hühner gehalten wurden.“	chicken|fowl|hen	tavuk	mirîşk
Unfall	noun	masculine	Unfälle	Ein Unfall ist schnell passiert.|„Ich entkam einem Unfall nur deshalb, weil mich ein Fahrradkurier warnte.“|„Verbrennungen gehören zu den häufigen Unfällen im Haushalt.“	accident|casualty	kaza	
Glocke	noun	feminine	Glocken	Sonntags werden viele Glocken geläutet.|„Die letzten Glocken läuten.“|„Sie haben dann die zerschlagene Glocke in einen Fellsack geschoben.“	bell	çan|fanus|zil	zing|çangoçk
Gedächtnis	noun	neuter	Gedächtnisse	Leider lässt die Gedächtnisleistung mit dem Alter nach.|„Durch diesen Anfall nahmen auch ihr Gedächtnis und ihre Sprechfähigkeit ab.“	memory|remembrance	bellek|hafıza	bîr
Sünde	noun	feminine	Sünden	„Jeder Seitenblick war Sünde, jede Tat eine Todsünde.“	sin	günah	
Post	noun	feminine	Posten	Am einfachsten geht der Versand per Post.|Die Rechnungen von heute sind schon in der Post.	mail|post office	posta|gönderi	
Post	noun	masculine	Posts	Heute gibt es einen Post mit lauter Herzchen.|„Dennoch löste der Post brachiale Reaktionen im Internet aus.“|„Dasselbe gilt für die Posts in den sozialen Medien.“	post		
Krankenschwester	noun	feminine	Krankenschwestern	Krankenschwestern haben einen aufreibenden Beruf.|„Oft überlegte sie, dass sie besser Krankenschwester geworden wäre.“	nurse	hemşire	
Motel	noun	neuter	Motels	„Schließlich zwang mich die Müdigkeit, an einem hübschen Motel zu halten.“	motel		motel
Wolle	noun	feminine	Wollen	Die Wolle wird zu Garn gesponnen.	wool	yün	
Taxi	noun	masculine	Taxis	Wenn du betrunken bist, fahre bitte mit dem Taxi nach Hause!|„Das Taxi kam nicht.“|„In diesem Augenblick kam ein Taxi vorbei.“|„Nach kurzer Fahrt hält das Taxi in einer kleinen, ruhigen Seitenstraße.“	taxi|cab	taksi	
Krone	noun	feminine	Kronen	Das Tragen von Kronen kam im alten Orient in Gebrauch.	crown|head|beer head	taç|kron	
Nachbar	noun	masculine	Nachbarn	Unsere Nachbarn vertragen sich untereinander sehr gut.	neighbour	komşu	
Seil	noun	neuter	Seile	Wir müssen das Boot mit einem Seil festmachen.|„Zwei Irre lassen sich mit einem langen Seil an der Anstaltsmauer herunter.“	rope	halat	benik
Wie	noun	neuter		Alles ist mir klar, nur das Wie der Geldübergabe nicht.|Das Besondere des Wie: äußerste Geheimhaltung.|Dem Wie gilt meine besondere Aufmerksamkeit.|Das Wie gilt es zu bedenken.|„Auf das Wie bin ich schon jetzt neugierig.“	how		
Pass	noun	masculine	Pässe	Für die Reise benötigen wir einen Pass.|„Jeder schwarze Arbeiter muss ständig einen Pass bei sich tragen.“|„Grenfeld lief nach oben, steckte den Pass ein und öffnete das Fenster.“	passport|pass|pace	pasaport|geçit|boğaz|rahvan	
Nachricht	noun	feminine	Nachrichten	Es gibt noch keine Nachricht über seinen Verbleib.|Die Nachricht schlug ein wie eine Bombe.|Die Nachricht von seinem Tod hat mich tief erschüttert.|„Die schlechten Nachrichten reißen nicht ab für Boeing.“	news|message|notification	haber / haberler	nûçe
Lügner	noun	masculine	Lügner	Ihre Aussagen widersprechen sich. Wer ist hier jetzt der Lügner?|Diesem Lügner würde ich nicht trauen.|„Das Volk hielt ihn für einen Lügner.“|„Ich sagte zu Uwe, daß er ein Lügner sei.“	liar|lying so-and-so|storyteller	yalancı	
Schnitt	noun	masculine	Schnitte	Man kann den Schnitt zwischen zwei Mengen bilden.	cut|average	kesişim|kesit|yara|sima	
Champagner	noun	masculine	Champagner	„Beim Bordeaux bedenkt, beim Burgunder bespricht, bei Champagner begeht man Torheiten!“|„Im Zelt wurde Champagner gereicht.“	champagne	şampanya	şampanya
Lust	noun	feminine	Lüste	„Elma hatte nicht wirklich Lust auf einen Einkaufstrip, willigte aber zögerlich ein.“	inclination|joy|lust|lechery	arzu|istek|haz|zevk	
Villa	noun	feminine	Villen	In Hamburg kann man am Elbufer schöne Villen sehen.|„Gestern bin ich aus der Villa ausgezogen.“	villa	villa|köşk|kasır|yalı	
Er	noun	masculine	Er	Ist dein Hund ein Er oder eine Sie?|„Gesprächsstoff war natürlich ein gewisser Er.“	he		
Es	noun	neuter		Das Ich kämpft mit dem Es.	id		
Es	noun	neuter	Es	Denke bitte daran in Takt 5 ein Es zu spielen!	E flat		
Pa	noun	masculine	Pas	Mein Pa fährt mit mir am Sonntag in den Zoo!|„John Fletcher und sein Pa kamen nicht gut miteinander aus.“|„Lizzies Bruder, benannt nach seinem Pa, war unfassbar dürr.“	dad		
Re	noun	neuter	Res	Ich habe Re gesagt.			
Chaos	noun	neuter		„Wenn wir genau hinsehen, finden wir überall um uns herum Chaos.“	chaos|disorder|havoc|mayhem	kaos|kargaşa|kargaşalık	
Zufall	noun	masculine	Zufälle	Das wir uns getroffen haben, war nur Zufall.|Das kann doch kein Zufall sein!	chance|happenstance|fortuity|coincidence	tesadüf	
Gefahr	noun	feminine	Gefahren	Viele fürchten die Gefahr, die von Atomkraftwerken ausgeht.	danger|risk|threat	tehlike	metirsî|xeter
Klang	noun	masculine	Klänge	Der Klang ihrer Stimme entzückte ihn immer wieder aufs neue.	tone|ring|sound|chord	ses	
Witwe	noun	feminine	Witwen	Als Witwe hat sie es schwer, ihre Kinder allein zu erziehen.|„Sie sind wie Witwen, wie enteignete Pächter, Märtyrer, Wahnsinnige.“			
Wild	noun	neuter		Der Bestand des Wildes in deutschen Wäldern ist hoch.|Er schießt das Wild daher, gleich wie es ihm gefallt.	game	yabani hayvan	
Gespräch	noun	neuter	Gespräche	Sie führten ein langes Gespräch.|„Das Kleingruppengespräch ist die prototypische Form des Gesprächs.“|„Das Gespräch hat stattgefunden, als Dincklage noch nicht in Erscheinung getreten war.“|„Es kam weder ein sinnvolles Gespräch noch eine belanglose Plauderei in Gang.“	conversation|talk	konuşma	
Mission	noun	feminine	Missionen	„Meine Mission wird mit unserer Ankunft in Frankreich nicht abgeschlossen sein.“	mission	misyon|delegasyon|heyet	
Mitarbeiter	noun	masculine	Mitarbeiter	Die Firma hat zwölf Mitarbeiter.	employee|coworker|assistant	çalışan	
Auftrag	noun	masculine	Aufträge	Ich hole im Auftrag meiner Eltern das Paket ab.|„Alpatytsch hatte jetzt alle seine Aufträge erhalten.“	assignment|order|commission|mission	emir|sipariş	
Hintergrund	noun	masculine	Hintergründe	Im Hintergrund sah ich einen Mann zur Tür hinausschleichen.|„Im Hintergrund dröhnte eine Jukebox.“	background	fon|iç yüzü	
Besucher	noun	masculine	Besucher	Was wollte heute dein Besucher?|„Der Besucher ist vollkommen verblüfft.“	visitor|patron		mêvan /
Betrieb	noun	masculine	Betriebe	Auf dem Jahrmarkt herrscht reger Betrieb.	business|concern|operation|company	hareket|iş yeri|işletme	
Tat	noun	feminine	Taten	„An ihren Taten sollt ihr sie erkennen!“	act|action|deed|crime		
Kauf	noun	masculine	Käufe	„Beim Kauf einer Immobilie ist es nicht mit einer einmaligen Zahlung getan.“	purchase	alım	
Penner	noun	masculine	Penner	Guck dir mal den Penner da drüben an.	bum		
Furcht	noun	feminine		Man muss die Furcht überwinden, um ihren Ursachen wehren zu können.|Ich habe keine Furcht vor Gespenstern, aber Angst vor freilaufenden Kampfhunden.|Wir hörten ein Furcht erregendes Getöse, das vom Abhang zu kommen schien.	fear|dread	korku	tirs
Geschäft	noun	neuter	Geschäfte	Claas und Saxbert machen schon seit 20 Jahren miteinander Geschäfte.|„Illegaler Holzschlag ist für mexikanische Banden und Kartelle ein lukratives Geschäft.“	business|deal|profit|store	iş|kâr|iş yeri|def-i ihtiyaç ihtiyaç	
Ewigkeit	noun	feminine	Ewigkeiten	Du brauchst ja wieder eine Ewigkeit, bis du endlich fertig bist.	aeon eternity|eternity		
Party	noun	feminine	Partys	„Danach waren Fotos von Ali auf der Party im Internet veröffentlicht worden.“|„Irgendwo in der Stadt fand eine Party statt.“|„Die Party steigt in einer Dachwohnung im 6. Arrondissement.“	party|do	parti	partî
Tun	noun	neuter		Dein Tun wird nicht ohne Folgen bleiben.	doing		
Tun	noun	masculine	Tune	„Die Kieferzähne sind kräftiger, als bei den Tunen und leicht zusammengedrückt.“			
Glaube	noun	masculine	Glauben	„Die Botschaft hör ich wohl, allein mir fehlt der Glaube“|„Der religiöse Glaube entspringt dem Streben nach Sinnfindung, Welterklärung und Existenzorientierung.“	faith als Haltung|belief als religiöse Überzeugung|creed als Bekenntnis	din|mezhep|inanç|itikat	bawerî
Los	noun	neuter	Lose	Es ist sein Los, zu leiden.|Er hat ein schweres Los zu tragen.	lot|destiny|fate|ticket		
Spur	noun	feminine	Spuren	Von den Einbrechern fehlt jede Spur.	trace|track|sign|trail	iz	
Wirklichkeit	noun	feminine	Wirklichkeiten	Man muss sich der Wirklichkeit stellen.|In Wirklichkeit interessiert es dich nicht.	reality		
Gift	noun	neuter	Gifte	Hamlets Vater wurde vom eigenen Bruder mit Gift ermordet.|Das Gift des Inlandtaipans ist das stärkste bekannte Schlangengift.|„Einige haben Gift genommen wie der Chirurg aus Stolp und andere Ärzte.“	poison|toxin	zehir	
Gift	noun	feminine	Giften	„Bei Gott und Menschen ist beliebt, Wer Gift und Gaben richtig gibt.“	gift|present	hediye	
Karriere	noun	feminine	Karrieren	Eine große Karriere ist ihm leider nicht gelungen.|„Umstände und Zeitgeist verwandelten seine zunächst vielversprechende Karriere in eine Tragödie.“	career	kariyer	
Zorn	noun	masculine		„Das heizte seinen Zorn an.“|„Nicht einmal der Nieselregen schaffte es, seinen Zorn zu kühlen.“	anger|fury|rage|wrath	öfke	
Pause	noun	feminine	Pausen	Hin und wieder sollte man sich eine Pause gönnen.|„Eine kurze Pause entstand.“|„Die Rezeptionistin sagt, dass Toni in seiner Pause sei.“	break|pause|recess	ara|mola	
Pause	noun	feminine	Pausen	Als erstes haben wir von den Runen eine Pause angefertigt.			
Verantwortung	noun	feminine	Verantwortungen	Ich trage die Verantwortung.|Wer diese Verantwortung übernimmt, steht mit einem Bein im Gefängnis.|„Die Kolonialmacht Dänemark traute den Inuit keine Verwaltung und keine Verantwortung zu.“	responsibility	mesuliyet|sorumluluk	
Stimme	noun	feminine	Stimmen	Der Redner erhob seine Stimme.|Die Stimme des Wolfes übertönte die Stimme des Windes…|Die Sängerin hat eine wundervolle Stimme.|„Ihre Stimme ist sehr schwach.“|„Die Stimme im Radio ließ sich nicht stören.“|„Noch einmal spiegelte die Stimme der Mutter die Fassungslosigkeit von damals wider.“	voice|vote	ses|oy|rey	
Priester	noun	masculine	Priester	Die ägyptischen Priester waren hoch angesehen.	priest	papaz	keşe
Rate	noun	feminine	Raten	Die Rate der Geburten nimmt wieder zu.	rate|instalment|installment	nispet|oran|taksit	rêje
Braut	noun	feminine	Bräute	Die Braut geht traditionell in Weiß zur Trauung.	bride fiancée|bird|girl	gelin	bûk
Ware	noun	feminine	Waren	Der Händler bietet seine Waren feil.|„Er musste Ware ausliefern, davon hing sein Leben ab.“	wares|goods|article	mal	
Henry	noun	neuter		Die Spule hat eine Induktivität von 0,1 Henry.	henry		
Ex	noun	masculine	Ex	Roland ist mein Ex.|„Deine Exen waren ja eher so, na ja, so Jungs halt.“	ex		
Ex	noun	feminine	Ex	„Erinnere mich bloß nie wieder an meine Ex!“|Mit der Ex meines Schwagers ist nicht gut Kirschen essen.|„Charlie hatte ja seine Exen, für die zu sorgen war.“	ex		
Ex	noun	feminine	Exen	Wir haben gestern eine Ex in Physik geschrieben.	quiz|pop quiz		
Bulle	noun	masculine	Bullen	Der Bulle stürmte schnaubend in die Arena.	bull|gorilla|hulk|cop		
Bulle	noun	feminine	Bullen	„Ich erinnere mich nicht mehr an den Rest der Bulle.“	bulla|Papal bull		
Kapitel	noun	neuter	Kapitel	Dieses Buch ist in zehn Kapitel eingeteilt.|„Bitte lest auf morgen Kapitel 2 und 3.“	chapter		
Reifen	noun	masculine	Reifen	„Schon seit Jahren arbeiten Reifenhersteller daran, ihre Reifen umweltfreundlicher und nachhaltiger herzustellen.“	tyre|tire|hoop|bangle	lastik	
Paradies	noun	neuter	Paradiese	Der sumerische Name für Paradies ist Dilmun.|„Es lebten einmal im Paradies zwei Menschen, Adam und Eva.“	Paradise|paradise|narthex	Cennet|cennet	
Augenblick	noun	masculine	Augenblicke	In diesem Augenblick gefror mir das Blut in den Adern.|Sie erreichte im letzten Augenblick noch ihren Zug.|„Einen Augenblick später wurde meine Zellentür aufgerissen.“|„Von diesem mystischen Augenblicke an nehmen die Ereignisse einen tragikomischen Verlauf.“|„Nach ein paar Augenblicken steht sie wieder.“	moment|eyeblink		kêlî|gav
Zirkus	noun	masculine	Zirkusse	„Als Junge war ich mal im Zirkus.“	circus	sirk	
Clown	noun	masculine	Clowns	Grock war ein berühmter Clown.|„Der Clown hatte eine große Kiste in die Mitte der Manege gestellt.“|„Als Clown oder als Revuestar wäre ich berühmt geworden.“	clown	palyaço|soytarı|şarlatan|şarlo	qeşmer
Rasse	noun	feminine	Rassen	Der Deutsche Schäferhund ist die verbreitetste Rasse der Schutzhunde.	race|subspecies|breed	ırk	regez|nijad|irq
Schicksal	noun	neuter	Schicksale	„Das Schicksal mischt die Karten und wir spielen.“|„Das Schicksal ist launisch und grausam.“|„Doch das Schicksal machte schon bald meiner bitteren Probezeit ein Ende.“|„Das Schicksal ist so alt wie die Welt.“	destiny|doom|fate|lot	kader	
Oscar	noun	masculine	Oscars	Viele Schauspieler warten vergebens auf den Gewinn eines Oscars.|„Die findet immer vier Wochen vor den Oscars statt.“	Oscar		
Selbstmord	noun	masculine	Selbstmorde	In ihrer Verzweiflung beging sie Selbstmord.|„Ein alter Freund von mir hatte Selbstmord begangen.“|„Erst fünfundreißigjährig beging Hłasko Selbstmord in Wiesbaden, wo er begraben liegt.“|„Das ist die Gruppe, die Grönland in Sachen Selbstmorde traurige Rekorde beschert.“	suicide	intihar	xwekujî|xwekuştin
Mist	noun	masculine		Mist ist auch im ökologischen Landbau als Dünger gestattet.|„Jauche und Mist hatten das Weiß eingefärbt.“	dung|manure|crap|waste		
Bargeld	noun	neuter		Tut mir leid, ich habe kein Bargeld im Haus.	cash|currency|bar money|ready money	nakit|nakit para	
Patient	noun	masculine	Patienten	Patienten müssen in manchen Praxen ziemlich lange warten.|„Im Kantonsspital Baden werden jedes Jahr 55'000 Patienten auf der Notfallstation behandelt.“|„Die Patienten sind schon fort, gehen langsam im Sonnenlicht herum.“	patient	hasta	
Stock	noun	masculine	Stöcke	Der Kampf mit dem Stock ist eine raue japanische Sportart.	stick|walking stick|baton|stock	sopa|stok|kat	
Zeuge	noun	masculine	Zeugen	Vor gut hundert Zeugen zauberte er ein Kaninchen aus dem Hut.|Haben Sie Zeugen, die diese Aussage bestätigen können?|Der Richter glaubt dem Zeugen.|„Da es keinen Zeugen gab, wurden die Worte des Kapitäns Wahrheit.“|„Die Anhörung der Zeugen nahm kein Ende.“|„Teilweise konnten Zeugen befragt oder ihre Protokolle genutzt werden.“	witness	şahit|tanık	
Schädel	noun	masculine	Schädel	Der Schädel ist ein generelles Merkmal aller Wirbeltiere.|Beim Autounfall erlitt sie eine Fraktur des Schädels.	cranium|skull		
Herausforderung	noun	feminine	Herausforderungen	Dieses Projekt entwickelt sich zu einer richtigen Herausforderung für uns.|„Denn Telomere leiden nachweislich, wenn Herausforderungen uns ständig grübeln und zweifeln lassen.“|„Challenge ist englisch und bedeutet wörtlich übersetzt nichts anderes als Herausforderung.“	challenge	uğraştırıcı şey|uğraştırıcı|görev|müsabakaya davet	
Wunde	noun	feminine	Wunden	Die Kontrahenten fügten sich mit dem Schwert gegenseitig tiefe Wunden zu.|„Was er eine ernste Wunde nannte, wußte sie aus seiner Vergangenheit.“|„Die Wunde schlug eine Gürtelschnalle.“|„Und der Geruch aus seinen Wunden lockte zahllose Fliegen herbei.“	wound|lesion|injury	yara	
Schild	noun	masculine	Schilde	Die Schilde schützten die Ritter vor den Pfeilen der Bogenschützen.|„Speere, Lanzen und Schilde stammten aus dem gesamten skandinavischen Raum.“	shield	kalkan	
Verbrecher	noun	masculine	Verbrecher	Dieser Verbrecher ist nun schon mehrmals aus dem Gefängnis ausgebrochen.|„So etwas tun nur Verbrecher und Trunkenbolde, hieß es.“|„Später ließen die Franzosen unter dem Baum Verbrecher hinrichten.“	criminal	suçlu	
City	noun	feminine	Citys	Ich gehe am Samstag wieder in die City mich umschauen.	downtown|city centre|city center|inner city		
Gentleman	noun	masculine	Gentlemen	„Seine Umgangsformen waren die eines Gentlemans.“.“	gentleman		
Vorfall	noun	masculine	Vorfälle	Der gestrige Vorfall muss unter uns bleiben.|„Am Karfreitag hörte Hjøstrup die ganze Geschichte über den Vorfall im Fischkeller.“	incident|prolapse	hadise|fıtık	
Hass	noun	masculine		Das hat er aus Hass getan.|„Jetzt fühlte ich nur noch Hass.“	hatred|hate	buğuz|nefret	
Rakete	noun	feminine	Raketen	Jedes Silvester werden unzählige Raketen in den Nachthimmel geschossen.	rocket|missile|skyrocket	roket|havai fişek	
Würde	noun	feminine	Würden	„Kein Gesetz bestimmte, daß die Würde des Fürsten widerruflich sey.“	dignity|honour|title	haysiyet	
Scherz	noun	masculine	Scherze	Er hält das Leben für einen einzigen Scherz.|Das habe ich nur im Scherz gesagt.|Mit so etwas treibt man keine Scherze!|„Kein Scherz war in seiner Stimme.“|„Die alte Feng machte noch ein Weilchen Scherze und ging dann davon.“	joke	şaka|latife	
Grün	noun	neuter	Grüns	Fenster- und Türrahmen sind in einem dezenten Grün gehalten.|Grün ist die Farbe der Hoffnung.	green	yeşil renk|yeşil alan	
Verbrechen	noun	neuter	Verbrechen	Was ein Verbrechen ist, wissen wir und wissens nicht! (Hans Magnus Enzensberger).	crime|criminality	cürüm|suç	
Einstellung	noun	feminine	Einstellungen	Meine Einstellung ist, dass jede Software Open Source sein sollte.|„Und auch die Engländer verändern ihre Einstellungen gegenüber den Indigenen.“	attitude|adjustment|setup|setting	tavır|tutum|ayar|bir işi süreci sonlandırma	
Gewehr	noun	neuter	Gewehre	Das Gewehr ist die Braut des Soldaten.|„Jetzt sind wir in der Kaserne und geben die Gewehre ab.“|„Ich hielt das Gewehr bereit.“	rifle|gun|weapon|tusk	tüfek	
Nachmittag	noun	masculine	Nachmittage	Unser Flug startet am Nachmittag.|„Wir landeten am späten Nachmittag in einer kleinen sandigen Bucht.“|„Eines Nachmittags saß ich bei offenem Fenster in meiner Bücherstube.“	afternoon	öğleden sonra	
Rot	noun	neuter	Rot	Der Himmel erglühte in tiefem Rot.|Nie werde ich das Rot ihrer Wangen vergessen.|Das Rot ihrer Haare stach ihm in die Augen.|Adamo ist doch der Farbtopf mit Rot von der Leiter gefallen.	red		sor
Lärm	noun	masculine		Vom Platz erscholl lautes Getöse und Lärm.	noise|racket	gürültü	
Indianer	noun	masculine	Indianer	„Die Indianer fühlten sich dadurch um ihre Kriegsbeute betrogen.“	Indian|native American|American Indian|Amerindian	Kızılderili	
Gemälde	noun	neuter	Gemälde	Als er vor dem Gemälde stand, machte er halt.|„Goethe wird das Gemälde ohne Vorbehalt gegen Friedrich betrachtet haben.“|„Die Gerüste erinnerten mich an alte Gemälde vom Turmbau zu Babel.“|„Viele Gemälde aus französischen Museen kamen so als Raubkunst nach Deutschland.“	canvas|painting|picture|tableau	tablo|resim	nîgar
Vampir	noun	masculine	Vampire	Die Briten, diese Vampire, haben Indien ausgebeutet und aller Reichtümer bestohlen.	vampire|vampire bat	vampir	vampîr
Toast	noun	masculine	Toasts	Könnte ich bitte noch einen Toast haben?|„Sie schob Sylvia einen Teller mit Toast und selbstgekochter Marmelade hin.“	toast	tost|kızarmış ekmek|şerefe içme	
Fett	noun	neuter	Fette	Es gibt gesunde und ungesunde Fette.	fat|grease	yağ	
Gut	noun	neuter	Güter	Er hat sein ganzes Hab und Gut verspielt.|Alle Güter werden im Rahmen der Gütertrennung aufgeteilt.	property|estate|good	mal|çiftlik|değer|kıymet	
Plan	noun	masculine	Pläne	Der Plan sieht verschiedene Möglichkeiten vor.|„Nikolai setzte ihr seinen Plan auseinander.“	plan|map|blueprint|plain	plan	
Geheimnis	noun	neuter	Geheimnisse	Diese kleine Episode bleibt auf ewig unser Geheimnis.|Das Verhältnis zwischen Karl und Lisa ist doch ein offenes Geheimnis.|„Es gab keinen Platz für Geheimnisse und Intimität.“|„Trotzdem musste sie die Geheimnisse mit jemandem teilen.“|„Das Geheimnis von Masaryks Erfolg war seine Orientierung nach dem Westen.“	secret	giz|gizem|sır	
Schwachsinn	noun	masculine		Mach nicht so einen Schwachsinn!|„Immerhin fiel inmitten des weltweit verbreiteten Schwachsinns ein kritischer Nebenton auf.“|„Dies Büchlein ist ein ernsthafter sprachwissenschaftlicher Schwachsinn.“	mental deficiency|rubbish|nonsense|folly	ahmaklık	
Halt	noun	masculine	Halte	„Bei einem der seltenen Halts stieg er zu, suchte mich, fand mich.“	stop|support|hold	durak|durma|destek	
Thron	noun	masculine	Throne	Schon seit Jahrhunderten dienen Throne den Herrschern als Symbol ihrer Macht.	throne	taht|tuvalet	
Heulen	noun	neuter		Das Heulen der Wölfe war meilenweit zu hören.	howl|roar		
Werbung	noun	feminine	Werbungen	Er wirbt seine Kunden mit einer neuen Form der Werbung.|„Die grelle Werbung sprang ihn an, und er schaltete sofort aus.“	advertising|publicity	reklam	
Freak	noun	masculine	Freaks	Der kleine Freak dort drüben hat ein paar ziemlich verrückte Hobbys.	freak		
Talent	noun	neuter	Talente	Man muss sein Talent für das Musizieren unbedingt fördern.|„Ich kam mit keinem Talent auf die Welt.“	talent|gift|flair	kabiliyet|yetenek|kabiliyetli|yetenekli	
Talent	noun	neuter	Talente	Ein Talent Gold hatte einen sehr großen Wert.			
Konto	noun	neuter	Konten	Ein Kontenrahmen ist ein systematisch sortiertes Verzeichnis der Konten im Rechnungswesen.	account	hesap|banka hesabı	
Gewinn	noun	masculine	Gewinne	Die Wikiprojekte sind ein großer Gewinn für viele kreative und wissbegierige Menschen.|Der Gewinn der Goldmedaille bei den Olympischen Spielen hat sein Leben verändert.	profit|gain|winnings|yield	kâr|kazanç	
Wunsch	noun	masculine	Wünsche	Hast du noch einen Wunsch?|„In den Mondbädern kristallisierten sich viele von Sabinas Wünschen und Orientierungen.“|„Diesen Wunsch haben wir mit ihnen gemeinsam.“	request|wish	arzu|dilek|istek	daxwaz
Gehalt	noun	masculine	Gehalte	Süßwasser weist einen Gehalt an Salz von 0,1 % auf.	content	içerik|muhteva|mazruf	
Gehalt	noun	masculine	Gehälter	Bei dem Gehalt möchte ich hier nicht weiter arbeiten.|„Verwendung für sein Gehalt wird Einstein schon gefunden haben.“	salary	aylık|haftalık|maaş	
Amerikaner	noun	masculine	Amerikaner	Woher die ersten Amerikaner kamen, ist wissenschaftlich umstritten.	American	Amerikalı|Amerikan	
Plus	noun	neuter	Plus	Normalerweise setzt man kein Plus vor positive Zahlen.|Viele Leute setzen auch für „und“ ein Plus.	plus		
Verhandlung	noun	feminine	Verhandlungen	Die Verhandlung muss vertagt werden.	trial|negotiation	görüşme|müzakere	
Koffer	noun	masculine	Koffer	Die Koffer sind bereits gepackt.|„Ihr Koffer war noch immer leicht.“|„Die Koffer ließ ich im Kibbuz zurück.“	suitcase	bavul|valiz|aptal|salak	
Heim	noun	neuter	Heime	Sie sind stolz auf ihr neues Heim.|„Sie arbeitete schwer, um ihren vaterlosen Kindern ein Heim zu schaffen.“	home|asylum	ev|yuva	
Felsen	noun	masculine	Felsen	Beim Ausheben der Baugrube sind wir auf Felsen gestoßen.	rock		
Leid	noun	neuter		Auch kleine bewaffnete Auseinandersetzungen verursachen unbeschreiblich viel Leid.	grief|distress|sorrow|wrong		
Menschheit	noun	feminine		„In der Zubereitung von Kaffee machte die Menschheit seitdem rasche Fortschritte.“	humanity|humankind|mankind	insanlık	mirovatî
Jäger	noun	masculine	Jäger	Die Natur ist Schauplatz ewiger Kämpfe zwischen Jägern und Gejagten.	hunter|huntsman|chaser|fighter	kovalayan|avcı	
Wand	noun	feminine	Wände	Walters Kopf schlug gegen die vordere Wand der Kiste.|Die Wand des Magens ist mit einer Schleimhaut bedeckt.	wall|barrier	duvar	dîwar
Tunnel	noun	masculine	Tunnel	Hinter der Kurve fuhr der Zug in den Tunnel.|„Der Tunnel endet am westlichen Ende des Sees.“	tunnel	tünel	
Tunnel	noun	masculine	Tunnel	Ich lasse mir jetzt einen Tunnel im Ohrläppchen anbringen.	tunnel		
Knopf	noun	masculine	Knöpfe	Ich muss schon wieder Knöpfe annähen.|Ich kriege den obersten Knopf nicht zu.	button|knob	düğme|tokmak	
Geräusch	noun	neuter	Geräusche	„Das Geräusch der Dusche war jetzt zu hören.“|„Außer seiner Stimme waren die Geräusche der Menge hinter ihm zu hören.“	noise|sound	çıtırtı|gürültü|patırtı|ses	deng
Foto	noun	feminine	Fotos	Fotos helfen gegen das Vergessen.|„Ich machte etwa dreißig Fotos von ihr.“|„Ich nahm das Foto aus der Brieftasche und sah es an.“|„Die Foto entstand am jüdischen Versöhnungstag Jom Kippur im September 2007.“	photo|photography|picture	foto	
Foto	noun	masculine	Fotos	Jetzt hast du den Foto heruntergeworfen!			
Kollege	noun	masculine	Kollegen	Liebe Kolleginnen und Kollegen, ich begrüße euch alle herzlich zu unserer Betriebsversammlung.|Frag doch mal deine Kollegen, ob sie zum Grillabend kommen wollen.|Kollege Bleibein hat mal wieder kein Papier in den Drucker eingelegt.	colleague|co-worker|workmate	arkadaş|-taş	
Dummkopf	noun	masculine	Dummköpfe	Ich Dummkopf, dass ich die Schule abgebrochen habe!|„Heinrich Cuno ist ein unwissender Dummkopf, der sich vor Eitelkeit aufbläht.“	blockhead|fool|nincompoop		
Atmosphäre	noun	feminine	Atmosphären	„Neben manchen Planeten hat auch der große Saturnmond Titan eine dichte Atmosphäre.“	atmosphere|vibes	atmosfer	atmosfer
Verlangen	noun	neuter	Verlangen	Das Verlangen nach Alkohol wurde mit jeder Stunde größer.|Das Verlangen nach der geliebten Person raubte ihr den Atem.	desire|request	istek|arzu|özlem|talep	
Ahnung	noun	feminine	Ahnungen	Ich habe so eine Ahnung, wer Weltmeister wird.|„Der Forschungserfolg gibt eine Ahnung davon, was später einmal möglich sein wird.“	foreboding|presentiment|idea		
Stimmung	noun	feminine	Stimmungen	Er ist in einer guten Stimmung.|„Warme Sonnenstrahlen auf der Haut heben die Stimmung einfach sofort.“	mood|humour|atmosphere|vibe	atmosfer	
Freundschaft	noun	feminine	Freundschaften	Die beiden verbindet eine langjährige Freundschaft.|„Es fiel mir immer leicht, Freundschaften zu knüpfen.“|„Er ist so furchtbar, ich habe ihm die Freundschaft gekündigt.“|„Eine tiefe Freundschaft resultierte aus dieser Begegnung.“	friendship	arkadaşlık	hevalbendî|hevaltî
Kindheit	noun	feminine		Erlebnisse der Kindheit sind prägend für das restliche Leben.|„Er sprach über seine Kindheit und wie er den Schnee geliebt hatte.“	childhood	çocukluk	zaroktî
Ken	noun	neuter	Ken	Der Stiel ist ein Ken lang.	ken		
Maske	noun	feminine	Masken	Der Räuber trug eine Maske.|„In der letzten Zeit hat sie die Maske ganz fallen lassen.“|„Small hatte seine Maske unerschütterlicher Ruhe fallengelassen.“	mask	maske	
Minister	noun	masculine	Minister	In der Bundesregierung wirken viele Minister mit.|„Diese Einschätzung hatte der Minister weitgehend exklusiv.“|„Parteiübergreifend empören sich Abgeordnete über die Arroganz des Regierungschefs und seiner Minister.“	minister|secretary	bakan|vekil	
Tote	noun	feminine	Tote	Heute wurde eine Tote aus dem Rhein gezogen.|Jana wurde das Herz einer Toten transplantiert.|„Um die Tote zu identifizieren, wird der Ehemann ins Leichenschauhaus geholt.“	dead person|casualty		
Geruch	noun	masculine	Gerüche	Ein Hund hat einen feineren Geruch als wir Menschen.|„Jeder Geruch erzeugt ein einzigartiges Aktivitätsmuster der Mitralzellen.“	smell|odor|odour|scent	koku	bêhn
Nation	noun	feminine	Nationen	Die französische Nation ist eine Nation großer Künstler.	nation	millet|ulus	netewe
Vermögen	noun	neuter	Vermögen	Für diese Arbeit reicht mein Vermögen nicht aus.	capability|assets|fortune	kabiliyet|yetenek|servet	
Vorstellung	noun	feminine	Vorstellungen	Bei der bloßen Vorstellung wird mir übel.|„Ich hatte keine Vorstellung davon, was das Leben bieten kann.“	idea|notion|introduction|presentation	düşünce|fikir|mütalaa|ide	
Faust	noun	feminine	Fäuste	Die Finger sind zur Faust geballt.|„Er machte eine Faust und hielt den Unterarm hoch.“	fist	yumruk	
Kamera	noun	feminine	Kameras	Ich habe mir eine neue Kamera gekauft.|Heute hat fast jedes Smartphone eine integrierte Kamera.	camera	kamera|fotoğraf makinesi	
Tara	noun	feminine	Taren	Beim Beratungsgespräch in der Apotheke wünscht man sich Diskretion an der Tara.	tare		
Gloria	noun	neuter		„Gloria in excelsis Deo“ – „Ehre sei Gott in der Höhe“			
Rosa	noun	neuter	Rosas	Der Himmel über Alpen erglühte in tiefem Rosa.|Babette ist doch der Farbtopf mit Rosa von der Leiter gefallen.|„Sie konnte sich gut an dieses Rosa erinnern.“|„Ein blasses Rosa hing über den Hausdächern.“			
Restaurant	noun	neuter	Restaurants	Ach, an der Ecke ist ein Restaurant.|Im Restaurant muss man sich benehmen.|Ich kenne bessere Restaurants.|„Wir wagen kaum noch, ins Restaurant zu gehen, meine Mutter und ich.“|„Nur die, denen es finanziell gut geht, gehen in ein Restaurant.“	restaurant	restoran	xwaringeh
Personal	noun	neuter		In der Firma Anton Steiner wird zur Zeit Personal abgebaut.	personnel|human resources|staff	kişi|personel	
Kämpfer	noun	masculine	Kämpfer	Wer sich nicht ohne Gegenwehr unterkriegen lässt, ist ein Kämpfer.|„Die Kämpfer attackieren jeden, den sie für einen Verräter halten.“	fighter|corbel	dövüşçü|mücahit|muharip|savaşçı	şervan
Geschenk	noun	neuter	Geschenke	Das Auto war ein Geschenk meiner Eltern.	gift|present	hediye|armağan	
Weiß	noun	neuter		Sinnend betrachtete er das Weiß ihrer Brüste.|Oje, das Weiß ist alle!|„Unter der Badehose ist das Weiß von frischen Verbänden.“|Der Herr in Weiß scheint der Arzt zu sein.	white|whiteness	beyaz	
Absicht	noun	feminine	Absichten	„Die Rechtheit der Absicht allein macht nicht schon den ganzen guten Willen.“|Es war meine Absicht, dich zu besuchen.	intention|purpose|intent|aim	gaye|kasıt|niyet|amaç	
Fresse	noun	feminine	Fressen	„Hast du aber eine häßliche Fresse!“|„Ein bisschen wehmütig – und ab morgen kriegen sie in die Fresse.“	kisser|puss		
Puppe	noun	feminine	Puppen	Als ich klein war, habe ich oft mit Puppen gespielt.	doll|puppet|chick|dolly bird	bebek|kukla|koza	
Leiche	noun	feminine	Leichen	„Ganz in der Nähe musste wieder eine Leiche liegen.“|„Eine Straße weiter waren vor einer knappen Stunde drei Leichen weggeräumt worden.“	body|corpse|cadaver|carcass	ceset|naaş	cenaze|kelex|term
Club	noun	masculine	Clubs	„Für den Besuch im Club hat Pretty heute Morgen arabische Enthaarungscreme gekauft.“			
Angelegenheit	noun	feminine	Angelegenheiten	Die Angelegenheit sollte morgen erörtert werden.|„Der Gewinner in der ganzen Angelegenheit war Menelik II.“	business|concern	konu|mevzu	
Szene	noun	feminine	Szenen	„Die zweite Szene fand am Mittagstisch meines Vaters statt.“|Der Vorhang hebt sich, die Szene ist eröffnet.	scene|setting|stage	sahne	
Kehle	noun	feminine	Kehlen	Und dann ging er ihm an die Kehle.|„Tom verspürte einen Kloß in der Kehle und musste erst einmal schlucken.“|„Jón Hreggvidsson schluckte etwas Speichel herunter, um sich die Kehle zu feuchten.“	throat|chamfer	boğaz	
Bühne	noun	feminine	Bühnen	Es traten vier als Indianer verkleidete Jungen auf die Bühne.|„Lucien hatte sich auf der Bühne verbarrikadiert.“|„Nie hatte es hier eine schönere Bühne gegeben.“	stage|theatre|theater|attic	sahne|tiyatro|platform	
Rum	noun	masculine	Rums	„Murphy und William würden um ihren Rum kämpfen.“|„Cachaça ist ein Rum aus Zuckerrohr.“	rum	rom	
Füllen	noun	neuter	Füllen	Das Füllen kam betrübt zurück… Aus „Das Füllen“ (Christian Fürchtegott Gellert, 1746)	foal|colt	tay	
Füllen	noun	neuter		Vor dem Füllen werden die Flaschen durchleuchtet.|Amalgam wird zum Füllen hohler Zähne verwendet.			
Zettel	noun	masculine	Zettel	Sie nimmt einen Zettel und schreibt darauf.|„Ich ließ den Zettel auf dem Schreibtisch liegen.“	slip of paper|note		
Ofen	noun	masculine	Öfen	Morgen heizen wir den Ofen an.|„Beide Zimmer hatten keinen Ofen.“	oven|stove|furnace	soba|fırın	sobe
Klo	noun	neuter	Klos	„Ich muss ganz dringend aufs Klo!“|„Wenn die aufs Klo geht, muss die bei der Gertrud vorbei.“|„Weil ich aufs Klo muss, klopfe ich.“	bog|toilet|loo|lavatory	hela	
Schnauze	noun	feminine	Schnauzen	Schäferhunde haben lange Schnauzen.|„Er leckte sich die Schnauze und schien gefressen zu haben.“|„Bob legte zwei Fingerkuppen an die kleine Schnauze des Hasen.“	snout|mouth|front end		
Not	noun	feminine	Nöte	Es herrschte eine große Not in der Bevölkerung.	need|necessity|destitution|distress	darlık|zorluk|acil durum|hayati tehlike	
Überraschung	noun	feminine	Überraschungen	Nach dieser unerwartet guten Rede machte sich große Überraschung breit.|„Zu seiner Überraschung erschien Csoma beinahe umgehend vor seinem Zelt.“	surprise	sürpriz	
Bescheid	noun	masculine	Bescheide	Ich habe bei der Krankenkasse angefragt, aber offensichtlich einen falschen Bescheid erhalten.|Wenn ich mehr erfahren habe, gebe ich Ihnen Bescheid.|Der Bescheid über die Förderung wird per Post versendet.|Du musst den Bescheid im Original vorlegen.	notification|answer|reply deal|know	haber	
Schaden	noun	masculine	Schäden	Wenn Sie mich rechtzeitig informieren, soll es nicht zu Ihrem Schaden sein.|„Sein Schaden soll es aber nicht sein.“	damage|injury|harm|disadvantage	zarar	
Bob	noun	masculine	Bobs	Der Bob wird von einer Bobmannschaft besetzt, vorne sitzt der Steuermann.	bob		
Dank	noun	masculine		Ich war des Dankes voll.|Verdient diese Gnade keinen Dank gegen den Schöpfer?	gratitude|thank|thanks	şükür	
Chance	noun	feminine	Chancen	Du bekommst eine Chance.|„Es ist eine Chance für ihn, sein Lebenswerk zu krönen.“|„Viele Menschen weltweit hatte noch keine Chance auf eine Corona-Impfung.“	opportunity|prospect|chance|odds	fırsat|şans	
Gabe	noun	feminine	Gaben	Mozart hatte eine besondere Gabe für Musik.	dower|endowment|faculty|talent	yetenek|kabiliyet	
Dunkelheit	noun	feminine	Dunkelheiten	Die in der Höhle herrschende Dunkelheit war absolut.|Der unbekannte Mann verschwand wortlos in der Dunkelheit.|„Sie kletterten hinaus und rannten in die Dunkelheit.“|„Sie gingen in die Dunkelheit hinaus.“	darkness|gloom|dark	karanlık|muğlaklık|müphemlik	
Trick	noun	masculine	Tricks	Den Trick kenne ich schon!|„Und ein paar Tricks sollte er kennen.“	flim-flam|trick|hoax		
Muster	noun	neuter	Muster	Die Vorhänge haben ein sehr schönes Muster.	pattern|example|sample	örnek|numune|kalıp	
Fan	noun	masculine	Fans	Ich bin ihr größter Fan.|Nach dem Spiel kam es zu Ausschreitungen seitens der Fans.|In der Schar der kreischenden Fans fanden sich auch vereinzelt über Zwölfjährige.|„Die 20000 Fans sind aufgeputscht.“|„Als Fan schwört der Isländer seinem Verein ewige Treue.“|„Persönlich bin ich ein großer Fan von Komfort und Bequemlichkeit.“	enthusiast|fan|admirer|groupie	taraftar	
Schönheit	noun	feminine	Schönheiten	„Ihre Schönheit war erschütternd.“	beauty|belle	güzellik	delalî
Gesang	noun	masculine	Gesänge	Der Gesang hat allen Zuhörern gefallen.|„Ich wachte auf von einem Gesang nebenan.“	singing		stran
Moral	noun	feminine	Moralen	„Erst kommt das Fressen, dann kommt die Moral.“|„Über die Moral des Schmuggelns möchte ich gar nicht weiter sprechen.“|„Ich verstehe die amerikanische Moral nicht.“|„Moralen sind ebenso der Vergänglichkeit und dem Wechsel unterworfen wie Kleidermoden.“	morality|moral|morale		
Süße	noun	feminine		Die Süße des Weins war überwältigend.	sweetness		
Süße	noun	feminine	Süßen	„Ich bin Janice Cray, und die kleine Süße da heißt Patti“	sweetheart		
Griff	noun	masculine	Griffe	Der Griff des Kochtopfes ist abgebrochen.|Der Griff des Schwertes war kunstvoll verziert.	handle|grip	tutamaç|kabza|kulp|sap	destik
Puls	noun	masculine	Pulse	Mein Puls beträgt 120 Schläge pro Minute, da ich gerade gelaufen bin!|Fühlen Sie doch bitte der Patientin den Puls.|Mit rasendem Puls versuchte er, sich hinter dem Baum zu verstecken.|Schlagartig beschleunigte sich ihr Puls.|„Vorsichtshalber tastete ich nach dem Puls ihrer Halsschlagader.“|„Dem Archivar klopften die Pulse zum Zerspringen, ihm taumelten die Sinne.“	pulse	nabız|bilek	
Puls	noun	feminine		„Grundnahrungsmittel war Puls, ein temperierter Brei aus geschrotetem Getreide.“			
Vorschlag	noun	masculine	Vorschläge	Wir hätten auf ihren Vorschlag hören sollen.|„Einige griffen Armfeldts Vorschlag an, andere traten für ihn ein.“	offer|proposal|proposition|recommendation	öneri|teklif	
Veränderung	noun	feminine	Veränderungen	Warte es ab, die Veränderungen haben gerade erst begonnen.|„Heutzutage vollziehen sich die Veränderungen mit atemberaubender Geschwindigkeit.“|„Das erklärt wohl auch unser Beharrungsvermögen gegenüber Veränderungen.“	changing|change	değişme|değişiklik	
Zweifel	noun	masculine	Zweifel	Das sind unbegründete Zweifel.|Als er das hörte, kamen ihm Zweifel an ihrer Aufrichtigkeit.|Ich habe keinen Zweifel daran, dass diese Aussage richtig ist.|„Er war als Skeptiker hierhergekommen, doch nun waren ihm alle Zweifel vergangen.“|„Ihr ist es gelungen, die Zweifel an der Existenz des Dino-Gewebes auszuräumen.“|„Natascha gewahrte ihren Zweifel und fiel ihr erschrocken ins Wort.“	doubt	şüphe	guman
Zeug	noun	neuter	Zeuge	Räum mal dein Zeug hier weg!|„Ich stopfte mein bißchen Zeug hinein, die Papiere des Toten zuunterst.“	stuff|fabric		
Flur	noun	masculine	Flure	Da steht ein Pferd auf'm Flur! – (Schlager)|Die Garderobe ist im Flur.	corridor|hall|hallway		
Flur	noun	feminine	Fluren	Durch Wald und Flur – (Buchtitel)	field|farmland		
Pilot	noun	masculine	Piloten	Der Pilot kündigte Turbulenzen während des Fluges an.|Nur Piloten dürfen ans Steuer dieses Passagierjets.	pilot	pilot	
Ärger	noun	masculine		„Ohne etwas zu entgegnen, schluckte Herbstaster ihren Ärger hinunter.“	aggro|annoyance|anger|aggravation		
Erlaubnis	noun	feminine	Erlaubnisse	Der Eigentümer des Ackers gab uns die Erlaubnis, unser Kunstwerk dort aufzustellen.|Lizzy kann mitkommen nach Rom. Sie hat die Erlaubnis ihrer Mutter.	allowance|permission	izin|müsade	
Stärke	noun	feminine	Stärken	[Völkerrecht:] „Gegen das Recht des Stärkeren hilft nur die Stärke des Rechts.“	strength|potency|excellence|vigorousness	güç|kuvvet|özellik|şiddet	
Whisky	noun	masculine	Whiskys	Ein Glas Whisky, bitte!|„Lady Death bekam ihren Whisky, kippte ihn und wandte sich an Céline.“|„Der eine trank Whisky, der andere aß Eis mit Schlagsahne.“	whisky whiskey	viski	
Gast	noun	masculine	Gäste	Zu seiner Geburtstagsfeier kamen um die zwanzig Gäste.|„Akrobaten unterhalten die Gäste mit ihren Kunststücken.“|„Zudem wird ihn Extremkletterer Stefan Glowacz, kürzlich Gast beim Nationalteam, gewarnt haben.“	guest|sojourner|invitee|visitor	konuk|misafir|müşteri|ziyaretçi	mêvan
Gast	noun	masculine	Gasten	„Befehl: "Ruder an"“: „Die Gasten an den Arbeitsriemen beginnen zu pullen.“			
Schmuck	noun	masculine	Schmucke	Manche Personen zeigen gerne ihren Schmuck.	jewellery|jewelry	süs|mücevher|mücevherat|takı	
Pro	noun	feminine	Pros	Die Pro hat kein Handicap. Ein Handicap haben ausschließlich Amateur-Golfer.			
Pro	noun	masculine	Pros	Der Pro hat kein Handicap. Ein Handicap haben ausschließlich Amateur-Golfer.			
Pfarrer	noun	masculine	Pfarrer	„Der Pfarrer nickte ihm zu und ging zum Altar.“|„Sie weinte, weil sie ahnte, was der Pfarrer gemeint hatte.“	pastor	papaz	
Parkplatz	noun	masculine	Parkplätze	Fahren Sie auf den Parkplatz dort rechts!|„Er bog auf den kleinen Parkplatz vor dem winzigen Rathaus ein.“|„Auf dem Parkplatz steht ihr Wagen nicht mehr allein.“	car park|parking lot|parking place	park yeri	
Job	noun	masculine	Jobs	Dieser Job war nicht einfach.|„Ohne Amerikas Jobs wiederum wäre Mexiko noch ein Land der dritten Welt.“	job	iş	
Treue	noun	feminine		Ich schwor meinen Vorsätzen Treue!	faithfulness|fealty		
Garage	noun	feminine	Garagen	Ich werde das Auto in die Garage schaffen.|„Ein Mann steht vor seinem Opel allein in einer Garage.“|„Als ich zur Garage gehe, sehe ich die Post auf dem Wohnzimmertisch.“|„Er ging zur Garage, um nach Guiseppe zu sehen.“	garage	garaj	
Aussicht	noun	feminine	Aussichten	Heute bei dem klaren Wetter haben wir hier eine herrliche Aussicht.|„Das Ziel vieler Wanderer ist natürlich die schöne Aussicht.“	view|outlook|prospect	manzara|şans	
Madame	noun	feminine	Mmes.	Küss die Hand, Madame.|„Ab und zu kommt mir Madame Jobs Parfüm in die Nase.“|„Es war ein sehr liebliches kleines Brustbild der jungen Madame Henriot.“|„Sie war eindeutig eine Mademoiselle; an ihr war keine Spur von Madame.“	madam		
Hochzeit	noun	feminine	Hochzeiten	Die Hubers feiern nächsten Sonntag Hochzeit.	marriage|wedding	düğün	dawet
Hochzeit	noun	feminine	Hochzeiten	Die Hochzeit des traditionellen Jazz ist vorbei.|„Katastrophen sind immer auch die Hochzeiten der Notfallseelsorge.“|„Zur Hochzeit des Jazz war New York seine Hauptstadt.“	golden age		
Hinweis	noun	masculine	Hinweise	Er gab ihm einen Hinweis.	advice|suggestion|tip|steer	ipucu|işaret	
Sendung	noun	feminine	Sendungen	Wir gehen pünktlich acht Uhr mit den Nachrichten auf Sendung.|„Mehr als hundert Millionen Sendungen hat das Unternehmen gespeichert.“	broadcasting|program|show|delivery	yayın|program|gönderme|sevkiyat	
Knall	noun	masculine	Knalle	Der Knall von Feuerwerkskörpern kann sehr laut sein.	bang|crack		
Vorhaben	noun	neuter	Vorhaben	„Wieder räumte er seinen musikalischen Vorhaben den Vorrang ein.“|„Karabana versprach, sich um mein Vorhaben zu kümmern.“	intention|plan	niyet	
Störung	noun	feminine	Störungen	„Ohne weitere Störung beendeten sie den Unterricht.“	annoyance|disturbance|error|dysfunction	aksama|arıza|rahatsızlık	
Kette	noun	feminine	Ketten	Es gibt verschiedene Ketten zum Antrieb, zum Beispiel die Fahrradkette.|„Der Waschbär lief hin und her – an seine Kette gefesselt.“	chain|necklace|warp|catenary	zincir|kolye	zincîr|kotan|col
Aktion	noun	feminine	Aktionen	Auf jede Aktion folgt immer eine entsprechende Reaktion.|Im Museum kann man am Donnerstag alte Druckmaschinen in Aktion sehen.	action|operation|campaign|promotion	eylem|teşebbüs|indirim|tenzilat	
Brauch	noun	masculine	Bräuche	Bei uns ist es Brauch, die Braut über die Schwelle zu tragen.|„Der Brauch soll auf das 16. Jahrhundert zurückgehen.“|„Dem Brauch gemäß eröffneten ihn Braut und Bräutigam mit einem Menuett.“	custom|practice	örf|adet	
Fang	noun	masculine	Fänge	Der Fang von Tieren erfordert einige Erfahrung.	catch|success|fang|claws		
Kerl	noun	masculine	Kerle	Letztens spricht doch so ein Kerl in der Kneipe meine Freundin an.|„Der Kerl wartete, bis sein Drink kam.“|„Sie war einfach ein feiner Kerl.“	guy|bloke|chap|cove	herif|oğlan|adam	
Blödsinn	noun	masculine		Was du da sagst, ist der totale Blödsinn!	rubbish|nonsense		
Empfang	noun	masculine	Empfänge	In ländlichen Regionen lässt der Empfang von Fernsehsendungen oft zu wünschen übrig.	reception	alma|selamlama|resepsiyon|kabul	
Höhle	noun	feminine	Höhlen	Vorsicht! In der Höhle dort lebt ein Bär.|Die Wanderer suchten während des Regens in der Höhle Schutz.|„Sie lag in der Höhle auf einem Lager aus Blättern.“	cave|cavern|den|hole	in|mağara|ev|boşluk	
Konzert	noun	neuter	Konzerte	Paul geht regelmäßig zu Konzerten.	concert|concerto	konser	
Ruf	noun	masculine	Rufe	Der Ruf „Feuer!“ hallte durch das Haus.	call|summons|fame|repute		
Gepäck	noun	neuter	Gepäcke	So viel Gepäck können wir kaum unterbringen.|„Alle Passagiere sammt ihren Gepäcken wurden glücklich ans Ufer gebracht.“	luggage	bagaj|eþya	
Schachtel	noun	feminine	Schachteln	„Er holte den Kulturbeutel aus dem Koffer und öffnete die Schachtel.“	box	kutu	
Schulter	noun	feminine	Schultern	Bei manchen Sportarten wird die Schulter sehr stark beansprucht.|„Er kniete und goß sich Wasser über Kopf und Schultern.“	shoulder	omuz|kürek	pî
Erfahrung	noun	feminine	Erfahrungen	Wir suchen für diese Arbeitsstelle jemanden, der Erfahrung mit unseren Technologien hat.	experience	deneyim|tecrübe	serpêhatî
Couch	noun	masculine	Couchs	Auf der Couch ist genug Platz für drei Personen.	couch		
Durcheinander	noun	neuter	Durcheinander	Nach dem Unfall gab es im Straßenverkehr ein großes Durcheinander.|„Das Erstaunliche: Viele Trump-Wähler finden genau dieses Durcheinander gut und richtig.“	chaos|clutter|confusion|mess		
Schütze	noun	masculine	Schützen	Der Schütze spannt den Bogen mit viel Kraft.|Der Jäger oder der Förster ist auch ein Schütze mit Gewehr.	shooter|shot|marksman|Sagittarius		
Kleinigkeit	noun	feminine	Kleinigkeiten	Um die Kleinigkeiten kümmern wir uns später.|„Kleinigkeiten machten manchmal den größten Unterschied.“	bagatelle|trifle chicken-feed|small thing|peanuts		
Verlust	noun	masculine	Verluste	Der Verlust des Ausweises führt zu einer Geldstrafe.	loss	kayıp|zarar	
Liebling	noun	masculine	Lieblinge	Komm Liebling, sei mein Liebling.|Liebling, mein Herz läßt dich grüßen!|Manche Hundebesitzer ziehen ihrem Liebling Stiefelchen und Regencape über.	darling|sweetheart		
Prüfung	noun	feminine	Prüfungen	Wir äußern uns erst nach gründlicher Prüfung des Sachverhaltes.|„Nach fünf Jahren Prüfung entschied das Bundesverfassungsgericht 1956: Die KPD wird verboten.“	check|checking|audit|validation	kontrol|test|imtihan|sınav	
Leiden	noun	neuter	Leiden	Wie lange hält Ihr Leiden denn bereits an?	suffering		
Unterricht	noun	masculine	Unterrichte	Der Unterricht in Hauswirtschaft ist bei den Jungen meist nicht sehr beliebt.|„Ohne weitere Störung beendeten sie den Unterricht.“|„Sie gerät dann in den Unterricht Hainstocks.“	instruction|classes|lessons|teaching	ders	
Betrug	noun	masculine	Betrüge	Der Betrug ist offensichtlich.|Er ist nur auf Betrug aus.|„Zur Verhandlung kommt der zweite Betrug.“	fraud|deceit		
Schock	noun	neuter	Schocke	Sie brachte gestern ein halbes Schock frischer Eier.	threescore		
Lohn	noun	masculine	Löhne	Die Gewerkschaften fordern höhere Löhne.|„Die Löhne der Arbeiter sind kaum mehr als Almosen.“	wage|reward		
Sitzung	noun	feminine	Sitzungen	Die Sitzung des Stadtparlaments war öffentlich, sodass interessierte Bürger daran teilnehmen konnten.|„Die Sitzungsunterlagen werden den Mitgliedern mindestens zwei Wochen vor einer Sitzung zugesandt.“|„Es wurde eine dramatische fünfstündige Sitzung.“	session|meeting	celse|oturum	
Chef	noun	masculine	Chefs	Ihr Chef ist ein sehr umgänglicher Mensch.	boss|manager	başkan|reis|şef|patron	
Bericht	noun	masculine	Berichte	Er sollte uns über den Verlauf der Veranstaltung endlich mal Bericht erstatten.	report	rapor|bülten	
Rezept	noun	neuter	Rezepte	Ich werde diesmal nicht nach Rezept kochen.|„Dann teilte sie ein Rezept für Einlegegurken mit.“	recipe|prescription	yemek tarifi	
Stich	noun	masculine	Stiche	Der Stich ging tief unter die Haut.|„Der Stich war nicht weiter gefährlich, doch die Wunde eiterte.“	sting|stab|engraving|trick		
Pistole	noun	feminine	Pistolen	Der Räuber bedrohte die Kassiererin mit einer Pistole.|In der Kiste mit den Pistolen liegen auch die Magazine.|„Ohne länger zu zögern, zog ich meine Pistole und öffnete die Tür.“|„Sie sicherte die Pistole und schob sie in die Tasche zurück.“	pistol	tabanca	
Probe	noun	feminine	Proben	„Morgen findet die Probe für die Streicher statt!“	rehearsal|trial|sample	prova|numune|örnek	
Apparat	noun	masculine	Apparate	Mit diesem Apparat misst man die Stromstärke.|„Jetzt war es ihm geglückt, leichte Musik in den Apparat zu bekommen.“|„Neben ihm piepte ein Apparat in beruhigender Regelmäßigkeit.“	accessory|appliance|apparatus	alet|apart	
Diener	noun	masculine	Diener	Er war ein mächtiger Diener der Wissenschaft.	valet|servant		xizmetkar|xulam
Chip	noun	masculine	Chips	Es gibt Menschen, die leben nur von Chips und Dosenpils.	chip	çip|mikroçip|yonga|cips	
Flug	noun	masculine	Flüge	Der Flug verlief sehr ruhig.|Die Zeit verging wie im Flug.	flight	uçuş|sefer	
Benehmen	noun	neuter		Wir müssen rechtzeitig absagen, das ist eine Frage des Benehmens.|Sie hat sich wie eine Furie aufgeführt, ihr Benehmen war völlig unmöglich.|„Herder versucht, das peinliche Benehmen seines Lehrers zu überspielen.“	behavior|behaviour|manners|deportment	davranis	
Nutzen	noun	masculine	Nutzen	Der Nutzen dieses Programms liegt in der Flexibilität und den vielen Erweiterungen.|„Vom Nutzen und Nachtheil der Historie für das Leben.“|In diesem Verein wird das Geld noch den größten Nutzen stiften.	utility|panel|board	fayda|yarar	sûd
Maul	noun	neuter	Mäuler	In den Mäulern einiger Tiere finden sich sehr viele Bakterien.	mouth|yap|chops		
Runde	noun	feminine	Runden	Der Spaziergänger dreht seine Runde.	round|circuit|lap	tur|halka|raunt	
Angriff	noun	masculine	Angriffe	„Die persönlichen Angriffe hingegen setzten sich fort.“	attack|assailment	saldırı|taarruz|sekte	êrîş
Marke	noun	feminine	Marken	Rinder werden mit Ohrenmarken versehen.	marking|brand	belirti|emmare|marka|pul	
Urteil	noun	neuter	Urteile	Die Richter verkünden das Urteil um 10 Uhr.|Oft werden politische Entscheidungen durch Urteile der Gerichte korrigiert.	verdict|judgement|court decision|court judgment	karar	
Wettbewerb	noun	masculine	Wettbewerbe	Die Wettbewerbe auf den Kurzstrecken waren besonders umkämpft.|„Bei diesen Wettbewerben war meine Schwiegermutter nicht die Schlechteste.“|„Ich habe diesen Wettbewerb verloren.“|„Sie überlassen den Wettbewerb den Amateuren.“	competition	müsabaka|yarışma|rekabet	
Schicht	noun	feminine	Schichten	In diesem Bereich liegen einige Schichten Lehm und Eisenerz.	layer|thickness|class|shift	tabaka|vardiya	
Hintern	noun	masculine	Hintern	Setz dich auf deinen Hintern!|„Das, was eine Jeans immer musste, war einen schönen Hintern machen!“|„Sie trug ein schräg kariertes Kleid, in dem der Hintern sich beulte.“	arse|ass|behind|buttocks		
Ladung	noun	feminine	Ladungen	„Eine einzige Ladung konnte Tausende Posten enthalten.“	load|freight|cargo|charge		
Sack	noun	masculine	Säcke	Ich habe noch einen Sack Kartoffeln übrig.|Sie hat immer einen ganzen Sack voll Ausreden parat.	bag|nutsack	çuval|torba	
Sprung	noun	masculine	Sprünge	Diese Wand hat einen gefährlichen Sprung.|Die Teetasse hat einen Sprung.	crack|fracture|jump|leap	çatlak|atlama|sıçrama|adım	
Vergnügen	noun	neuter	Vergnügen	Im Schwimmbad hatte er ein großes Vergnügen.|„Die ganz großen Vergnügen bereiten die Wochenendausflüge über die Dörfer.“|„Mit Bewunderung und Vergnügen begegnete Franz jetzt immer seinem Reinhold.“|„Und um Vergnügen geht es hier.“	fun|pleasure		
Bord	noun	neuter	Borde	Das Wörterbuch steht auf dem Bord.	shelf		
Bord	noun	masculine	Borde	Werfen Sie bloß nicht die Abfälle einfach über Bord!|Mann über Bord! Sofort wenden und einen Rettungsring rauswerfen!|„Er schwankte, zog sein Unterhemd aus und fiel beinah über Bord.“	board		
Gelegenheit	noun	feminine	Gelegenheiten	Das ist die Gelegenheit, dir etwas zu kaufen.	chance|occasion|opportunity	fırsat	
Anlass	noun	masculine	Anlässe	Aus Anlass des 100-Geburtstages des Dichters wurde ein Fest gefeiert.	reason|event		
Diebstahl	noun	masculine	Diebstähle	Mein Laptop ist gegen Diebstahl versichert.|„Auch Diebstahl aus Hunger verstößt gegen das 7. Gebot, hatte er gelernt.“	theft|larceny	hırsızlık	dizî
Mama	noun	feminine	Mamas	Ich will zu meiner Mama!|Du bist nicht die Mama!|„Victoire sah die Mama mit einem Anfluge schelmischer Verwunderung an.“	Mom	ana	
Earl	noun	masculine	Earls	Der Earl von Shaftesbury lehnte das Vorhaben ab.	earl		
Angel	noun	feminine	Angeln	„Olav Hanson holte die Angel ruckweise gegen die Strömung ein.“	rod and line fishing pole|fishing rod|rod|hinge	olta	
Angel	noun	masculine		Vergrößert, sieht die Wespe mit ihrem Angel noch bedrohlicher aus.			
Termin	noun	masculine	Termine	Der Termin für die Tagung ist der 31. Oktober.|Wir müssen uns noch auf einen Termin einigen.|Hätten Sie in der nächsten Woche einen freien Termin?	date|time limit|deadline	randevu	
Offizier	noun	masculine	Offiziere	„Einen der Offiziere erkannte sie als Paul von Hohenstein.“	officer|mate|commissioned officer|piece	subay|zabit	
Ausweis	noun	masculine	Ausweise	Ich habe meinen Ausweis zu Hause liegen lassen.|Ist Dein Ausweis schon abgelaufen?|„Da war der Ausweis des Toten.“|„Irinas Ausweis war also ebenso wenig wert wie seine Dienstmarke.“	identity card	hüviyet|kimlik	nasname
Last	noun	feminine	Lasten	Das Paket war eine große Last für die Frau.|Sie hatte an der Last schwer zu tragen.|Plötzlich brach die Brücke unter der großen Last zusammen.	load|weight|burden|pressure		bar
Dreck	noun	masculine		Dreck ist wie das Schwarze unter dem Fingernagel: Materie am falschen Ort.	dirt|filth|dreg|mud	kir|pislik	
Eimer	noun	masculine	Eimer	Gieß bitte mal das Wasser aus dem Eimer.	bucket|pail|blow|flop	kova	
Ansehen	noun	neuter		Sein Ansehen in der Bevölkerung ist groß.	respect|reputation|looking at|view		
Werkstatt	noun	feminine	Werkstätten	In unserer Werkstatt sind auch Schraubenzieher aller Größen.|„Gestern hat er einen Anruf bekommen: Seiner Werkstatt fehle die Baugenehmigung.“	workshop|garage|automobile repair shop	atölye|tamirhane	
Psychiater	noun	masculine	Psychiater	„Ein Psychiater von heute hätte vielleicht die verschiedenartigsten narzißstischen Persönlichkeitsstörungen diagnostiziert.“	psychiatrist|shrink	psikiyatrist	
Positiv	noun	masculine	Positive	In "Hans ist ein großer Junge" steht das Adjektiv "großer" im Positiv.|„Schon beim Positiv gibt es Merkwürdigkeiten.“	positive		
Positiv	noun	neuter	Positive	Zu diesen Negativen gibt es noch keine Positive.	positive		
Zaun	noun	masculine	Zäune	Viele Menschen frieden ihr Grundstück mit einem Zaun ein.|„Es blieb nicht aus, daß wir dann vor dem Zaun standen.“	fence	çit	
Bleibe	noun	feminine	Bleiben	An diesem Abend konnte er keine Bleibe finden.	abode|doss		
Leine	noun	feminine	Leinen	Die Wäsche hängt zum Trocknen auf der Leine.	cord|leash	ip	
Fluch	noun	masculine	Flüche	Auf der Sache liegt von Anfang an ein Fluch.	curse|malediction	beddua	
Gouverneur	noun	masculine	Gouverneure	„Zusammen mit dem Gouverneur waren jesuitische Missionare eingetroffen.“	governor	vali	
Deal	noun	masculine	Deals	Der Deal mit den Italienern war sehr erfolgreich.	deal		
Mühe	noun	feminine	Mühen	Mit viel Mühe fanden sie den richtigen Weg.|Vielen Dank für deine Mühen.	trouble|effort		
Telefonnummer	noun	feminine	Telefonnummern	Gibst du mir deine Telefonnummer?|Wie lautet deine neue Telefonnummer?	telephone number	telefon numarası	
Gerechtigkeit	noun	feminine	Gerechtigkeiten	Auch bei der Verteilung der Beute musste die Gerechtigkeit gewahrt bleiben.	justice|righteousness	adalet|adil olma	
Wächter	noun	masculine	Wächter	Der Wächter hat den Dieb auf frischer Tat ertappt.|„Zwei Wächter hielten den zum Gelage angereisten Fürsten an den Armen fest.“	guard	bekçi|metre|-ölçer	
Botschaft	noun	feminine	Botschaften	Die Botschaft hör’ ich wohl, allein mir fehlt der Glaube (Goethe)	message|embassy	haber|mesaj|elçilik|sefaret	
Vernunft	noun	feminine		Nur der Mensch ist zur Vernunft fähig.|„Wo die moralische Verdächtigung zu herrschen beginnt, hat die Vernunft keine Chance.|Nimm doch Vernunft an!	reason|good sense|intellect|understanding		
Korrektur	noun	feminine	Korrekturen	Die Korrekturen musst du nochmals machen; sie sind nicht sorgfältig genug durchgeführt.	correction	düzeltme|tashih	
Boss	noun	masculine	Bosse	Wir müssen den Boss fragen – das können wir nicht allein entscheiden.	boss	şef|baş	
Befinden	noun	neuter		Wie ist das werte Befinden?	condition|state of health|health|state		
Glückwunsch	noun	masculine	Glückwünsche	Die besten Glückwünsche zur Vermählung!|Darf ich Ihnen meine Glückwünsche zur bestandenen Prüfung aussprechen?|Herzlichen Glückwunsch nachträglich zum Geburtstag!|Herzlichen Glückwunsch zur Geburt eurer Tochter!|Er stand auf der Treppe und nahm die Glückwünsche der Belegschaft entgegen.|Vielen Dank für die Glückwünsche zu meinem Geburtstag.|„Ein Papier war dabei mit einem kurzen Glückwunsch vom Oberst.“	congratulation		
Reverend	noun	masculine	Reverends	Reverend Brown zelebriert die Messe am Sonntag.			
Kommissar	noun	masculine	Kommissare	Ein Kommissar verwaltete vorübergehend das Gebiet.	commissioner|superintendent	komiser	
Opa	noun	masculine	Opas	Mein Opa arbeitet in einem Supermarkt.|„Ich besitze die Tagebücher meines Opas.“	grandad|poppi|grandpa		
Versteck	noun	neuter	Verstecke	Die Kinder haben im Gebüsch ein Versteck.|„Der einzige Mensch, der mich in meinem Versteck besucht, ist Berut.“	hiding place	saklanca|saklanılan yer	
Knast	noun	masculine	Knäste	Er sitzt im Knast.	clink|jail|prison|slammer		
Knast	noun	masculine	Knäste	Die Knoten am Holz bezeichnet man auch als Knast.|Leider bleiben manche elektrischen Holzspalter bei einem kleinen Knast schon stehen.	burl|gnarl		
Verteidigung	noun	feminine	Verteidigungen	Die Verteidigung der These war nicht möglich.	defence|defense	müdafaa|savunma	
Klinik	noun	feminine	Kliniken	Die Klinik für Chirurgie wurde gerade renoviert.|„Nachdem sie die Klinik besichtigt hatten, gingen sie zurück in die Bibliothek.“	clinic|hospital	klinik	
Alibi	noun	neuter	Alibis	Er hat ein wasserdichtes Alibi.|Die Zeugin verschaffte mir ein Alibi.|Das Alibi wurde von dem Zeugen nicht bestätigt.	alibi		
Schwimmen	noun	neuter		Schwimmen kräftigt die Rückenmuskulatur.|Erfolgreiche Schwimmer begannen mit dem Schwimmen oft schon mit sieben.	swim|swimming	yüzme	avjenî
Grab	noun	neuter	Gräber	Sie standen an Opas Grab und trauerten.|Es gibt zu viele Gräber auf dem Soldatenfriedhof.	grave	mezar	gor
Laune	noun	feminine	Launen	Ich habe schlechte Laune.|„Jetzt, nach seinem Vormittagsschlaf, war der Alte besonders guter Laune.“	mood whim|whim		
Zentrale	noun	feminine	Zentralen	Der Unfall wurde sofort der Zentrale gemeldet.	central office|headquarters	merkez|santral	navend
Geliebte	noun	feminine	Geliebte	Nachts traf er sich immer mit seiner Geliebten.|Er hatte die ganze Zeit eine Geliebte gehabt.|„Man munkelte, er habe eine junge Geliebte.“|„Er hat keine Geliebte unterhalten.“	lover|beloved		hezkirî
Bursche	noun	masculine	Burschen	Der Bursche spielt mal wieder in der Matsche.|Das blaue Hemd gehört dem Burschen.|Mach Dir keine Sorgen, er ist ein zäher Bursche.|„Der zweite Bursche kam auf mich zu.“	boy		
Wade	noun	feminine	Waden	Der Rock reicht ihr bis zu den Waden.	calf	baldır	
Video	noun	neuter	Videos	Ich habe mir ein Video ausgeliehen.	video	video|video tekniği	
Scheiß	noun	masculine		Jetzt bin ich voll über den Scheiß hier gestolpert!|Was soll der Scheiß?	shit		
Stopp	noun	masculine	Stopps	Legen wir einen kleinen Stopp ein.	stop	durak|mola|ara	
Profi	noun	masculine	Profis	Ein echter Profi wird auch mit den vielen Auflagen zurechtkommen.|„Ich fühlte mich allmählich wie ein richtiger Profi.“|„Müller ist Profi geworden.“|„Mach dir keine Sorgen, Mali. Die Mädels sind Profis“|„Sie sah wirklich scharf aus, aber sie war ein echter Profi.“	pro|professional	profesyonel	
Rache	noun	feminine		Sein Sohn wurde ermordet. Nun will er Rache.	revenge|vengeance	öç|intikam	
Vision	noun	feminine	Visionen	Lourdes und Fatima haben als Wallfahrtsorte ihren Ursprung in Visionen.	vision	hayal	
Generation	noun	feminine	Generationen	Die Generation nach dem Krieg wird auch Aufbaugeneration genannt.|„Wir haben es also mit einer vergessenen Generation zu tun.“|„Diese neue Generation hat erstaunliche Fellatorinnen hervorgebracht.“	generation	nesil	
Erbe	noun	neuter		Das Erbe muss nicht angetreten werden, es kann auch ausgeschlagen werden.|„Wenn Holmes' Nachforschungen erfolgreich waren, würde sie ein beachtliches Erbe antreten.“	estate|legacy|heritage	miras	mîras
Erbe	noun	masculine	Erben	Die Erben versammelten sich beim Rechtsanwalt zur Testamentseröffnung.|„Erben hatte Tante Dagmar keine.“	heir	mirasçı	
Gerede	noun	neuter		Was soll das ständige Gerede von einem Neuanfang?|„Wie ein Schwamm muß der Junge ihr Gerede aufgesogen haben.“|„Gerede und Geschwätzigkeit galten als zwei gravierende Charaktermängel.“	chatter|talk|gossip|gossiping		
Einbruch	noun	masculine	Einbrüche	Der Einbruch konnte trotz Warnanlage nicht verhindert werden.	break and entry|breaking and entering|burglary|housebreaking	soygun|başlama|azalma|azalış	
Risiko	noun	neuter	Risikos	Es besteht ein enormes Risiko.|„Rein politisch war das Risiko gering.“	risk|chance	risk|riziko	rîsk|xeter
Staatsanwalt	noun	masculine	Staatsanwälte	In der Theorie ist der Staatsanwalt Herr des Ermittlungsverfahrens.|„Dort werden die Rufe, den mächtigen Staatsanwalt abzusetzen, immer lauter.“	prosecutor|public prosecutor|attorney general|district attorney	müddeiumumi|savcı	
Viertel	noun	masculine	Viertel	Das letzte Viertel kannst du verschenken.	quarter	çeyrek|semt	
Flucht	noun	feminine	Fluchten	Drogen waren für ihn eine Flucht vor der Realität.|„Unterwegs gelang mir die Flucht.“	flight|escape	firar|kaçış	rev
Flucht	noun	feminine	Fluchten	Die Schlafräume befinden sich alle in einer Flucht.	alignement|row|suite|enfilade		
Zerstörung	noun	feminine	Zerstörungen	Die Zerstörung der Natur durch die Industrie ist erschreckend.|„Doch die Zerstörung geschah nicht.“	destruction	tahrip etme|tahribat	
Aus	noun	neuter		Das ist das Aus für all unsere Träume und Hoffnungen.	end|touch|out of bounds		
College	noun	neuter	Colleges	Der Junge besucht für drei Jahre das College.|„Donna ist ihre Zimmergenossin auf dem College.“|„In vier Jahren College gelang mir das nur einmal.“	college		kolej
Sandwich	noun	masculine	Sandwichs	Wenn man unterwegs Hunger bekommt, ist ein Sandwich ideal.|„Danach lagen ihre Sandwiches auf der Straße verteilt.“|„Ein Mann verkauft Sandwiches und Bier von einem Karren.“	sandwich	sandviç	
Direktor	noun	masculine	Direktoren	In einem großen Betrieb gibt es Direktoren für verschiedene Betriebszweige.|Mehrere Direktoren können ein Direktorium bilden.|„Der Direktor glaubt das nicht.“	manager|senior vice president|headmaster|principal	müdür	
Heilmittel	noun	neuter	Heilmittel	Immer mehr Deutsche setzen ihre ganze Hoffnung auf natürliche Heilmittel.|Nach Jahren der Forschung gibt es immer noch kein Heilmittel gegen AIDS.	remedy		
Anblick	noun	masculine	Anblicke	Der Anblick ganz Berlins ist nur von der Luft aus möglich.	looking|sight		
Wache	noun	feminine	Wachen	Wegen seiner Erkrankung mussten wir Tag und Nacht bei ihm Wache halten.	guard|police station|sentinel		
Partner	noun	masculine	Partner	Die Schüler suchten sich je einen Partner und bastelten gemeinsam Weihnachtssterne.|Sterbehilfe Trauerhuber – ihr Partner für Bestattungen.	associate|partner	ortak|eş	
Experiment	noun	neuter	Experimente	Das Experiment schlug fehl, weil jemand sämtliche Sensoren falsch angeschlossen hatte.|„Mein Experiment war ein Reinfall.“|„Die junge Frau ist auf ein Experiment hereingefallen.“	experiment	deney	
Explosion	noun	feminine	Explosionen	"Von einer Explosion der Kosten im Gesundheitswesen kann keine Rede sein."	explosion|flare-up	infilak|patlama	teqîn
Rettung	noun	feminine	Rettungen	Gut dass Du mir hilfst, das ist meine Rettung.|„Mit schneller Rettung rechnete er nicht.“	rescue|ambulance	kurtarma	
Anwalt	noun	masculine	Anwälte	Der Angeklagte wird durch seinen Anwalt entlastet.|„Die beiden Anwälte werden lebendig.“	advocate|lawyer	avukat|sözcü|temsilci	
Kutsche	noun	feminine	Kutschen	„Schon der Anblick einer Kutsche macht mich ja ganz krank.“	carriage|coach	fayton	
Flotte	noun	feminine	Flotten	Die Flotte von Kriegsschiffen fuhr vorbei.	fleet|airline fleet|liquor|dip		
Raumschiff	noun	neuter	Raumschiffe	Wann werden wohl die ersten Menschen in einem Raumschiff zum Mars fliegen?	spaceship|spacecraft|starship	uzay gemisi	keştiya fezayê
Zauber	noun	masculine	Zauber	Es kam uns vor wie ein Zauber.	magic		efsûn
Entführung	noun	feminine	Entführungen	Die Entführung von Kindern zählt zu den schweren Verbrechen.	abduction|hijacking|kidnapping|elopment	kaçırma	revandin
Drehbuch	noun	neuter	Drehbücher	Das Drehbuch konnte weder den Regisseur noch den vorgeschlagenen Hauptdarsteller begeistern.|„Dafür wollte er das Drehbuch sehen.“|„Vor drei Jahren schrieb ich an einem Drehbuch und kam nicht weiter.“	script	senaryo	senaryo
Zone	noun	feminine	Zonen	In den Zonen 1 – 3 gilt der Nahtarif.	zone	bölge|mıntıka|Doğu Almanya|dilim	
Sucht	noun	feminine	Süchte	Die Sucht nach Alkohol ist eine Volkskrankheit.	addiction|desire|obsession	bağımlılık	
Uniform	noun	feminine	Uniformen	Die Soldaten trugen Uniformen.|„Die Schupos haben jetzt blaue Uniformen.“|„Die Mädchen trugen Uniform: blaugraue, schlichte Kleider und darüber dunkelblaue Schürzen.“	uniform	üniforma	
Uni	noun	feminine	Unis	Freitags muss ich nicht zur Uni.|Ich studiere an der Uni Köln.|„Die Krise ist an den Unis angekommen, endlich.“|„Die Uni bildet für den Markt aus, nicht fürs Leben.“			
Uni	noun	neuter	Unis	Im Kaufhaus bot man Blusen und Jacken vor allem in Uni an.			
Bombe	noun	feminine	Bomben	Die B52-Bomber warfen tonnenweise Bomben auf die Stadt.|„An der Ostsee gab es keine Sirenen und keine Bomben.“|„Noch heute ist der Boden voller Bomben, und das Leben geht weiter.“	bomb|shell	bomba	
Irrtum	noun	masculine	Irrtümer	Es war ein Irrtum zu denken, dass hier schon ein Beispiel steht.|„Dieses Mal war kein Irrtum mehr möglich.“	error|fallacy|misapprehension|mistake	hata|yanılgı	
Vorsicht	noun	feminine		Im Straßenverkehr ist immer Vorsicht geboten.|Man muss beim Umgang mit ihm immer einige Vorsicht walten lassen.|„Vorsicht und Aufmerksamkeit waren gefragt, um nicht in den Dreck zu treten.“	caution|care|danger	dikkat	
Regisseur	noun	masculine	Regisseure	Alfred Hitchcock war einer der berühmtesten Regisseure.	director|producer	rejisör	derhêner
Spaziergang	noun	masculine	Spaziergänge	Viele Menschen machen am Sonntag einen Spaziergang mit ihrer Familie.|„Lea sah die weiten Spaziergänge nicht gern.“	stroll|walk|a walk in the park	dolaşma|gezinti	
Fantasie	noun	feminine	Fantasien	„Die Fantasie guter Bürokraten ist unerschöpflich.“|„Vor allem aber befeuerte das angebliche Urvolk die Fantasie der Romantiker.“	imagination|fantasy	fantazi	
Bande	noun	feminine	Banden	In Los Angeles beherrschen Banden ganze Stadtviertel.|„Illegaler Holzschlag ist für mexikanische Banden und Kartelle ein lukratives Geschäft.“|„Der wichtigste Schutz der Bande blieb das Geheimnis.“|„Mitglieder dieser Banden waren Franzosen, Nordafrikaner, Armenier, viele Korsen und Spanier.“	band|gang|bunch|barrier	çete	
Frisur	noun	feminine	Frisuren	Wie findest du meine neue Frisur?|„Es ging ein leichter Wind, der seine Frisur in Unordnung brachte.“|„Ihre Frisur ist unaufwendig, ihr Haar gepflegt.“	haircut|hairstyle	saç biçimi|saç şekli	
Schluck	noun	masculine	Schlucke	Im Glas war nur noch ein Schluck.|„Ich trank einen Schluck kalten Sake.“	drop|sip|swallow|gulp		
Gangster	noun	masculine	Gangster	Die Gangster verschiedener Gangs bekriegen sich untereinander.|„Sie sammeln monatelang Beweismaterial und überwachen die Gangster.“	gangster	çeteci|gangster|haydut	
Letzter	noun	masculine	Letzte	Er hatte einen Fehlstart und wurde Letzter.|„Der Jockey ist als Letzter durchs Ziel gegangen.“	last	sonuncu	
Verdacht	noun	masculine	Verdachte	Ich habe den Verdacht, dass du dich gestern erkältet hast.|„Der Student Hans Langenscheidt schöpft Verdacht, geht zur Polizei und erstattet Anzeige.“	suspicion	kuşku|şüphe	guman
Mac	noun	masculine	Macs	Ich habe mir einen Mac gekauft.	mac		
Master	noun	masculine	Master	Er macht gerade seinen Master.	master		
Meeting	noun	neuter	Meetings	Mein Mann ist noch auf einem Meeting.	meeting		
Nachbarschaft	noun	feminine	Nachbarschaften	Er ist ein Junge aus der Nachbarschaft.	neighbourhood		
All	noun	neuter		Das All ist vor etwa 13,7 Milliarden Jahren entstanden.|„Seit 20 Jahren ist die [Raumstation] ISS inzwischen im All.“			
Sage	noun	feminine	Sagen	Die Sage von der Gründung Roms ist sehr bekannt.|„Hundert glorreiche Sagen von seiner Tollkühnheit sind hier wie überall im Schwang.“	saga		
Gewinner	noun	masculine	Gewinner	Ein Gewinner hat gut Lachen.|Die Vorsitzende des Sportvereins überreichte den Gewinnern der Leichtathletikwettbewerbe ihre Pokale.	winner	kazanan	
Verlierer	noun	masculine	Verlierer	Ein Verlierer tut gut daran, sich das nächste Mal mehr anzustrengen.|„Verlierer sind allein, und wer allein ist, hat verloren.“|„Und Verlierer mögen die Wähler nicht.“	loser	kaybeden	
Hast	noun	feminine		Warum diese Eile, diese fast krankhafte Hast?|Das trieb zu neuer, wilder Hast …	haste|hurry|precipitation	acele|telaş	
Ruhm	noun	masculine		„Nicht einmal die Aussicht auf Ruhm hatte ihn seine Ängste überwinden lassen.“|„Canetti hat zeitlebens ein gespaltenes Verhältnis zum Ruhm.“	glory|fame|stardom	şan	
Blutdruck	noun	masculine	Blutdrücke	Er hat einen viel zu hohen Blutdruck.|„Ihr Blutdruck stieg auf einen Wert von 240.“|„Der Blutdruck steigt von 120 auf 180.“	blood pressure	kan basıncı	
Pleite	noun	feminine	Pleiten	Die Pleite der Firma ließ sich nicht mehr vermeiden.	bankruptcy|bust|collapse|failure	iflas	
Fällen	noun	neuter		Beim Fällen eines Baumes muss immer auf die Sicherheit geachtet werden.	felling		
Rechte	noun	feminine	Rechte	Ein wuchtiger Treffer mit der Rechten beendete den Kampf vorzeitig.	right		
Graben	noun	masculine	Gräben	Die Gräben werden ausgehoben, um unterirdische Leitungen zu verlegen.|„Der Graben war hier flach.“|„Der Graben selbst wurde 1580 zugeschüttet.“	ditch		
Graben	noun	neuter		„Alles ist besser, als dem Bagger beim Graben zuzusehen.“	digging		
Schiffe	noun	feminine		Eine Gruppe Jugendlicher hinterließ eine große Lache Schiffe an der Hauswand.			
Verrat	noun	masculine		Der Verrat wurde bestraft.	betrayal|treason	hainlik|hiyanet	bêbextî
Soll	noun	neuter	Soll	Man bucht Soll an Haben.	debit		
Weile	noun	feminine		Das wird noch eine Weile dauern.|Ich brauche noch eine Weile zum Umziehen.|„Ich schob das Telefon weg und starrte es eine Weile an.“	while		
Testament	noun	neuter	Testamente	Testamente müssen schriftlich niedergelegt und eigenhändig unterschrieben werden.	testament|will	vasiyetname|vasiyet	
Geduld	noun	feminine		Sie wartete mit großer Geduld, bis sie endlich an der Reihe war.	patience	sabır	
Versicherung	noun	feminine	Versicherungen	Ich habe eine Versicherung gegen Diebstahl abgeschlossen.	insurance|insurance company|affirmation|assurance	garanti|sigorta|teyit	
Verabredung	noun	feminine	Verabredungen	Eine Verabredung war geplant, kam aber nicht zustande, weil wir uns verfehlten.	appointment|date	randevu|buluşma	
Tritt	noun	masculine	Tritte	Ihre Tritte waren leise und federnd.	step|kick|steps	adım|basamak|ayak izi|tekme	
Entschuldigung	noun	feminine	Entschuldigungen	Sie hat meine Entschuldigung nicht akzeptiert.|Was soll ich mehr tun, als um Entschuldigung bitten.	apology|excuse		
Front	noun	feminine	Fronten	„Wir liegen neun Kilometer hinter der Front.“	front	dalga|cephe|taraf	
Manager	noun	masculine	Manager	Zurzeit wird über die Gehälter der Manager heftig diskutiert.	manager	idareci|yönetici	
Versprechen	noun	neuter	Versprechen	„Bei jedem Takt schüttelte Schascha die Hände, das Versprechen war besiegelt.“	assurance|promise	söz|vaat	
Stolz	noun	masculine		Sein Stolz erlaubt es nicht, Spenden anzunehmen.|„Aber ein wenig Stolz ist damals doch mitgeschwungen in Jakobs Spöttelei…“	pride		
Blasen	noun	neuter		Wenn man sich beim Blasen Zeit läßt, wird die Glaskugel schön rund.|Es gibt Laubsauger zum Saugen und Laubläser zum Blasen.|Das Blasen und Heulen des Sturmes währte die ganze Nacht.	blowing		
Anwesenheit	noun	feminine		Sie glänzte schon durch ihre bloße Anwesenheit.	presence		
Zuschauer	noun	masculine	Zuschauer	Die zahlreichen Zuschauer feuerten ihre Mannschaft lautstark an.|Die deutschen Zuschauer lieben "Shaun" - und stürmen die Kinos.	spectator|viewer|bystander|observer	seyirci|izleyici	bîner|temaşevan
Blau	noun	neuter	Blau	Sie waren überwältigt vom tiefen Blau des Himmels.|Das Blau der Hose ist mir ein bisschen zu dunkel.|René ist doch der Farbtopf mit Blau von der Leiter gefallen.|„Es wird aber allein um das Blau und seine Bedeutungen gehen.“|„Und dann beginnt das reine melancholische erste Blau des Morgens.“|„Mein Blick folgte den Schäfchenwolken im sonst klaren Blau über uns.“	blue		
Code	noun	masculine	Codes	Der Code von Open-Source-Projekten kann legal heruntergeladen und verändert werden.	code	kod	kod
Matt	noun	neuter	Matts	Weiß kündigte seinem Gegner freudig ein Matt in vier Zügen an.	mate		
Geständnis	noun	neuter	Geständnisse	Er hatte ein falsches Geständnis abgelegt, um seinem Sohn zu helfen.|Die Verdächtige legte ein umfassendes Geständnis ab.|Ich muss dir ein Geständnis machen. Ich habe die ganze Schokolade aufgegessen.|„Kein Wunder also, dass es wieder und wieder zu falschen Geständnissen kommt.“|„Im Verkehr mit Menschen muß man mit vertraulichen Geständnissen sparsam sein.“|„Er war bewegt, am bewegtesten durch das rückhaltlose Geständnis ihrer Neigung.“	confession	itiraf	
Laufen	noun	neuter		Im Laufen war er besser als im Weitspringen.|„An erster Stelle soll beim Laufen immer das persönliche Wohlbefinden stehen.“	running		
Legende	noun	feminine	Legenden	„Siegfried, der Drachentöter“ ist eine Legende.|„Alte Legenden berichten indes, dass seinem Werk der Segen von oben fehlte.“	legend|key	efsane|masal|açıklama	
Tanzen	noun	neuter		Das Tanzen gefällt ihnen besonders.	dance		
Abschied	noun	masculine	Abschiede	Es ist ein Abschied für immer.|„Es war ganz nach ihrer Art, die Sentimentalität eines Abschieds zu vermeiden.“|„Ihr Werk hat viel von Abschied.“|„Und es ist ihm nach Abschied zumute.“|„Beim Abschied gaben wir ihm noch etwas Geld.“	farewell|leave|parting|decease		veqetîn|xatir|xatirxwestin
Trost	noun	masculine		Nach den schrecklichen Dingen, die geschehen waren, kam jeder Trost zu spät.|„Religion kann Trost spenden, sie kann Ruhe und Harmonie stiften.“|„Viele suchen Trost im Alkohol.“|„Es war sogar noch mehr, ich fand keinen Trost mehr darin.“|„Sie suchten Trost beim Pferderennen, beim Boxkampf und am Tresen.“	solace|comfort|consolation	avuntu	
Prinzessin	noun	feminine	Prinzessinnen	Der König versprach dem Ritter die Hand der Prinzessin.|Diana Spencer war die wohl bekannteste Prinzessin Großbritanniens.|„Es war die Prinzessin Marina Stirby, Schwester des Königs von Rumänien.“	princess	prenses	
Anruf	noun	masculine	Anrufe	„Der erste Anruf, den ich entgegennahm, kam von Herrn Jackopp.“|„Sein Anruf erwischte mich noch im Bett.“	phone call|call	arama	
Alarm	noun	masculine	Alarme	Die Feuerwehr löste rechtzeitig einen Alarm aus.|„Es waren nur Alarme und kein Luftangriff.“|„Instinktiv löste Carlos in diesem Moment den Alarm für die Feuerwehr aus.“	alarm|alert	alarm	
Loyalität	noun	feminine	Loyalitäten	Er erwies seinem Betrieb während seiner ganzen Zugehörigkeit Loyalität.|Es ist eine Frage der Loyalität, ob wir jetzt bleiben.|Seine Loyalität konnte man sicher nicht in Frage stellen.|Ihr Verhalten war grausam, was seiner Loyalität keinen Abbruch tat.|„Über meine Loyalität zu Deutschland muss sich niemand Sorgen machen.“	loyalty		
Verständnis	noun	neuter	Verständnisse	Es benötigt Verständnis, um die Lösung dieses Problems nachvollziehen zu können.	comprehension|understanding|appreciation|sympathy	duyarlılık|telakki|anlayış	
Gelächter	noun	neuter	Gelächter	Die Männer brachen in schallendes Gelächter aus.|„Eine Regung von Gelächter selbst in diesem Augenblick.“	laughter		
Luke	noun	feminine	Luken	Männer, verschließt die Luken!	hatch|scuttle		
Affäre	noun	feminine	Affären	Bei der Gerichtsverhandlung wurde die Affäre in allen Einzelheiten nochmals aufgerollt.	affair	hadise|olay|gönül ilişkisi	
Anklage	noun	feminine	Anklagen	Die Staatsanwaltschaft erhebt nun Anklage wegen Nötigung.|Trotz der vielen Tatverdächtigen kam es nur in zwei Fällen zu Anklagen.|„Es gab Hausdurchsuchungen und Anklagen.“	accusal|accusation	iddianame|itham|suçlama	
Posten	noun	masculine	Posten	Wir benötigen dringend einen Posten Verpackungsmaterial.		mevki	
Abmachung	noun	feminine	Abmachungen	Mündliche Abmachungen sind vertraglich rechtswirksam.|Laut schriftlicher Abmachung darf ich einen Hund halten.|„Diese Abmachung gefiel mir.“	accord|agreement|arrangement|bargain		
Mine	noun	feminine	Minen	In der Mine förderten die Arbeiter viele Tonnen Gold im Jahr.	quarry|mine|lead|refill	maden ocağı|mayın	
Mine	noun	feminine	Minen	Eine Mine entsprach bei den alten Griechen hundert Drachmen.	mine|mina		
Unterwäsche	noun	feminine	Unterwäschen	„Sie lehnten es ab, Unterwäsche zu tragen, angeblich weil die sie einengte.“	undergarments|underwear|underclothes|underclothing		
Auftauchen	noun	neuter		Ich war überrascht durch das Auftauchen der Polizei.	appearance		
Unschuld	noun	feminine		Der Angeklagte konnte seine Unschuld beweisen.	innocence|virginity		
Aufregung	noun	feminine	Aufregungen	Er konnte vor Aufregung nicht schlafen.	excitement|stir|suspense|agitation		
Ausrüstung	noun	feminine	Ausrüstungen	Zieh deine Ausrüstung an - wir müssen los!	outfit|equipment|gear	kıyafet|teçhizat	
Warte	noun	feminine	Warten	In der Umgebung von Duderstadt sind zwei Warten erhalten.	watchtower|lookout	tarassut kulesi	
Fressen	noun	neuter		Sie gab der Katze ihr Fressen.|Er schüttete seinem Hund das Fressen in den Fressnapf.|Das Fressen in der Kaschemme war mies.	gorging|feeding|eating|food		
Treffen	noun	neuter	Treffen	Sie organisierten das Treffen sich um die Angelegenheit zu besprechen.	meeting|encounter	buluşma	
Spielen	noun	neuter		Das Spielen kommt bei den vielen Hausaufgaben oft zu kurz.			
Klappe	noun	feminine	Klappen	Halt die Klappe! Dich habe ich gar nicht gefragt.	flap|door|mouth|trap	kapak|çene	
Anzeichen	noun	neuter	Anzeichen	Fieber ist ein Anzeichen für eine Erkrankung.|„Der Leichnam trägt bereits Anzeichen der Verwesung.“|„Es hatte natürlich zuvor schon einige Anzeichen dafür gegeben.“	indication		
Gehen	noun	neuter		Regelmäßiges Gehen wirkt wie eine Medizin gegen Knochenschwund.	ambulation|walking|race walking		
Voraus	noun	masculine		Der Voraus wird noch zu Lebzeiten des Erblassers übertragen.			
Zuhause	noun	neuter		Diese Wohnung ist nun bis auf Weiteres mein Zuhause.|„Das also war mein neues Zuhause.“	home|crib	ev|yurt	
Schießerei	noun	feminine	Schießereien	„Die Schießerei hatte unterdessen gewaltig zugenommen.“	gunfight|shootout|shooting		
Training	noun	neuter	Trainings	Leistungssportler benötigen viel Training.|„Jack begann sein Training auf Danny Hogans Gesundheitsfarm drüben in Jersey.“|„Clerfayt hatte Lillian verboten, beim Training dabei zu sein.“	training|practice	antrenman|idman	rahênan
Schreiben	noun	neuter	Schreiben	Das Schreiben muss in der Schule gelernt werden.|„Das (handschriftliche) Schreiben wird als Chirographie, das Drucken als Typographie bezeichnet (…).“|„Ja, das Schreiben und das Lesen	writing|letter	yazma|yazı	
Tiefe	noun	feminine	Tiefen	Unser Blick ging senkrecht in die Tiefe.	depth	derinlik	kûrahî
Rennen	noun	neuter	Rennen	Wer wird das Rennen wohl gewinnen?	race	yarış|koşu	
Gefallen	noun	masculine	Gefallen	Ich mag Frank nicht schon wieder um einen Gefallen bitten.	favour		
Gefallen	noun	neuter		Sie hat an ihm Gefallen gefunden.|Ihre anmutige Erscheinung erregt allerorten Gefallen.|Deine Pläne werden bei Tjark kein Gefallen finden.|Margrit roch ohne Gefallen an der Suppe.|Opa Hartmut hatte an dir nie großes Gefallen.|Bei mir erregten Thomas’ Bekanntschaften ja noch nie Gefallen.	appeal		
Signal	noun	neuter	Signale	In der Leichtathletik dient ein Schuss als Signal für den Start.	signal	sinyal	
Geschehen	noun	neuter	Geschehen	Das damalige Geschehen hat 1968 die politischen Konstellationen in Deutschland nachhaltig beeinflusst.	happening		
Interview	noun	neuter	Interviews	„Interviews müssen dazu genutzt werden, sich zu verbergen.“|„Im journalistischen Interview geht es um mehr als um Frage und Antwort.“	interview	röportaj|mülakat	
Alter	noun	masculine	Alte	Er spielte schon mit 30 den Alten.	old man|dude		
Alter	noun	neuter	Alter	Der Meteorit hat ein Alter von 150.000 Jahren.|Im Alter von 40 Jahren, so sagt man, werden die Schwaben gescheit.	age	yaş	
Alte	noun	feminine	Alte	Sie hat schon mit 30 die Alte gespielt.	old lady|chick		
Krieger	noun	masculine	Krieger	Das Kämpfen ist die Aufgabe der Krieger.	warrior	savaşçı	
Vergebung	noun	feminine	Vergebungen	Für einen Mörder, sagt er, gebe es keine Vergebung.	forgiveness|pardon	bağışlama	
Genie	noun	neuter	Genies	Albert Einstein wird von vielen Menschen für ein Genie gehalten.|Meine Nachbarn wollen aus ihren Kindern kleine Genies machen.|„Andernfalls war sie einfach ein Genie mit einer unglaublichen Auffassungsgabe.“	genius	dâhi	
Unrecht	noun	neuter		Er kann Recht nicht von Unrecht unterscheiden.|Ihr widerfuhr himmelschreiendes Unrecht.|„Mit dem Fall der Mauer wurde dieses Unrecht über Nacht beendet.“|„Ich habe vielen Menschen Unrecht getan.“	injustice		
Fort	noun	neuter	Forts	In Western spielen Forts oft eine große Rolle.|„Entlang der Grenze wurde ein Ring aus 12 Forts errichtet.“	fort		
Vanessa	noun	feminine		Die Gattung Vanessa ist in Europa mit zwei Arten vertreten.	vanessa		
Zugriff	noun	masculine	Zugriffe	Auf diese Dateien habe ich keinen Zugriff.|Ihr Zugriff auf das Vermögen war vertraglich eingeschränkt.|Statt der blockierten Seite sah man ein »Zugriff verweigert«.|Täglich zählt der Server mehr als 10.000 Zugriffe.	access	erişim|tutuklama|tevkif	
Schick	noun	masculine		Ihr Schick verzaubert alle Männer.		şık|zarif	
Spruch	noun	masculine	Sprüche	Der Spruch der Höchstrichter kam allen einschlägigen Bemühungen zuvor.	saying|ruling|verdict		
Eile	noun	feminine		Sie sind in Eile.|In dieser kritischen Situation ist Eile geboten, sonst stirbt der Patient.	hurry|rush	acele	lez
Tatort	noun	masculine	Tatorte	Am Tatort fanden die Ermittler viele Spuren.	crime scene	suç mahali|olay yeri	
Tipp	noun	masculine	Tipps	Kannst Du mir einen Tipp geben, wie ich dieses Programm richtig konfiguriere?|Vielen Dank für den Tipp!|„Es hörte sich an, als ginge er einem Tipp nach.“	clue|hint|pick	akıl|fikir|tüyo	
Krankenwagen	noun	masculine	Krankenwagen	Der Krankenwagen fährt dich sofort ins Krankenhaus.|„Nachmittags bringt mich ein Krankenwagen ins Militärlazarett.“	ambulance	ambulans	
Freier	noun	masculine	Freier	Sie stammte aus vermögendem Hause und konnte sich vor Freiern kaum retten.	suitor|john		
Krise	noun	feminine	Krisen	Die internationalen Finanzen befinden sich zur Zeit in einer Krise.|„Wir mussten uns unsere Krisen selber machen.“	crisis	kriz	krîz|qeyran
Verderben	noun	neuter	Verderben	Dem Verderben von Lebensmitteln kann vielfach durch Kühlung entgegengewirkt werden.	spoilage|ruin|undoing		
Agent	noun	masculine	Agenten	„Ein Sänger singt bei einem Agenten eine Arie vor.“|„Daraufhin wird der Agent nur noch in den USA seine Interessen vertreten.“	agent|spy	vekil|ajan	
Einladung	noun	feminine	Einladungen	Ich schreibe die Einladungen für meine Geburtstagsfeier.|„Marie weigerte sich zunächst, die Einladung nach Nonnenwerth anzunehmen.“|„Der Sozialdemokrat Peter Glotz nahm einst meine Einladung an.“	invitation	davetiye	
Wecken	noun	masculine	Wecken	Jeder bekommt eine Wurst mit einem Wecken.	bread roll|oblong loaf		
Wecken	noun	neuter		Morgen früh um sieben Uhr ist Wecken.|Nach dem Wecken gibt es Frühstück.	arousing|reveille|rouse		
Spinner	noun	masculine	Spinner	Ein Spinner arbeitet in einer Firma, die Garn für Textilien herstellt.	loon|Arctiinae		
Gnade	noun	feminine	Gnaden	Die Verurteilten wollten öffentlich um Gnade bitten.|Gib deinem Herzen einen Ruck und zeig Gnade. Verzichte auf weitere Maßnahmen.	mercy|pardon|clemency|grace		
Munition	noun	feminine	Munitionen	Die Munition ist der eigentliche Wirkungsträger einer Waffe.	ammunition|munitions	mühimmat	
Walker	noun	masculine	Walker	Reich mir bitte den Walker, mir ist so kalt.			
Walker	noun	masculine	Walker	Viele Walker betreiben ihren Sport aus gesundheitlichen Gründen.			
Ausweg	noun	masculine	Auswege	Ich bin im Wald verirrt! Gibt es hier denn keinen Ausweg?	way out|solution		
Knarre	noun	feminine	Knarren	Die Kinder lärmten mit ihren Knarren und Glocken im ganzen Dorf.	ratchet|socket wrench|piece		
Anführer	noun	masculine	Anführer	Der Anführer der Räuberbande wurde verurteilt und anschließend erhängt.|„Anders als die meisten Anführer gehörte er nicht zur gebildeten Elite.“	chief|leader	baş|komutan|kumandan|lider	
Verspätung	noun	feminine	Verspätungen	Der Flieger nach Berlin hat schon wieder Verspätung.|„Der ICE nach Basel hat auch Verspätung.“	delay		derengî
Fliegen	noun	neuter		Das Fliegen erleichtert den Krankentransport.|Dem Fliegen verdanken wir eine höhere Lärmbelästigung.	flight|flying		
Schläger	noun	masculine	Schläger	Der Spieler mit dem blauen Schläger in der Hand ist Boris Becker.	club|bat|racket|thug		
Cowboy	noun	masculine	Cowboys	Treffen sich zwei Cowboys! … Beide tot!|Zum Fasching verkleide ich mich als Cowboy.	cowboy		kowboy
Truppe	noun	feminine	Truppen	Die deutschen Truppen nahmen während des zweiten Weltkriegs Frankreich ein.	body of troops|body of soldiers|troop	bölük|kıta	
Kram	noun	masculine		Der ganze Kram soll in den Müll.|„Rasch werfen wir unsern alten Kram beiseite und ziehen uns um.“	stuff		
Anwältin	noun	feminine	Anwältinnen	Dem Angeklagten wurde eine Anwältin als Pflichtverteidigerin beigeordnet.|„Zwei Gnadengesuche ihrer Anwältin werden abgelehnt.“	advocate	avukat|sözcü|temsilci	
Beileid	noun	neuter		Er drückte ihnen sein Beileid aus.	condolence|sympathy	başsağlığı|taziye	serxweşî
Mitleid	noun	neuter		Sie hat großes Mitleid mit ihnen.|„Mitleid mit ihr und mit sich selbst preßten ihm das Herz zusammen.“|„Ihr Verhalten verriet weder Mitleid noch Mitgefühl.“|„Bis jetzt hatte Alice Schwarzer Mitleid mit mir.“|„Das sagte ich und erweckte Mitleid damit.“	compassion|pity	acımak	
Trainer	noun	masculine	Trainer	Der Trainer war nach dem schlechten Spiel seiner Mannschaft völlig außer sich.|„Der Trainer übt sich in Zurückhaltung.“	coach	antrenör	rahêner
Kostüm	noun	neuter	Kostüme	Ein flottes Kostüm trägt Frau Reimann heute wieder.|„Sie hat sich oben umgezogen und trägt nichts unter ihrem Kostüm.“	suit|fancy dress|costume	kostüm	
Überfall	noun	masculine	Überfälle	Der Überfall auf die alte Dame wird nun von der Polizei untersucht.|„Aber sie ist erst nach dem Überfall zurückgekommen.“	raid|holdup|assailment	saldırı|taarruz	
Schwäche	noun	feminine	Schwächen	Mich überkam plötzlich eine unerklärliche Schwäche in den Beinen.|„Wobei ich eine klitzekleine Schwäche habe, die ich den Damen gern verschweige.“|„Allgemeine Schwäche des Körpers und erhöhte Reizbarkeit des Nervensystems gesellen sich dazu.“|„Meine Schwäche ist wie weggeblasen.“|[Covid-19-Erkrankungen:] „Andere Genesene leiden unter einem Taubheitsgefühl, Schwäche und Gedächtniseinschränkungen.“	flaw|weakness	zaaf|zayıflık	
Auftritt	noun	masculine	Auftritte	Akte von Theaterstücken werden nach Auftritten gegliedert.	scene|entrance|appearance|performance	sahneye çıkma	
Trank	noun	masculine	Tränke	Der Trank ist gesund und aufbauend.	potion		
Rückkehr	noun	feminine		„Diese Rückkehr erwarteten ja auch die meisten Deutschen von uns.“	return|comeback	dönüş	
Sender	noun	masculine	Sender	Die Sonne ist der Sender und Spender der Wärmestrahlung und des Lichts.	emitter|broadcaster|transmitter	verici	
Wart	noun	masculine	Warte	Als ehrenamtlicher Wart der Anlage war er stets nicht weit.	supervisor		
Vögeln	noun	neuter		Er ertappte seine Frau beim Vögeln mit dem Staubsaugervertreter.			
Untertitel	noun	masculine	Untertitel	„Sie ermorde den jüdischen Witz, heißt es im Untertitel seiner Kritik.“|„Mir war bewußt, daß mich noch ein Untertitel erwartete.“	subtitle|subtitles|caption	altyazı	binnivîs
Grant	noun	masculine		Obacht, heute hat er wieder seinen Grant!			
Betrüger	noun	masculine	Betrüger	Er wurde als Betrüger entlarvt.|„Er ist ein Betrüger und ein Halunke, das ist klar.“	fraud|scammer	dolandırıcı|hileci|hilekâr|dalaveracı	
Bestie	noun	feminine	Bestien	Der Dompteur traut sich sogar zu diesen Bestien in den Käfig.|„Irgendwie musste ich es mit den wilden Bestien aufnehmen.“	beast		
Station	noun	feminine	Stationen	An der nächsten Station müssen wir aussteigen.	station|ward	istasyon|bölüm|kısım|servis	
Zugang	noun	masculine	Zugänge	Zu diesem Dichter finde ich keinen Zugang.	access|entrance	erişme|ulaşma|kavrama|yol	
Segen	noun	masculine	Segen	Vielen Katholiken ist der Segen des Papstes sehr wichtig.	blessing	kutsama	
Alpha	noun	neuter	Alphas	Ein Alpha wird oft als Parameter in Verteilungen verwendet.	alpha		
Bestand	noun	masculine	Bestände	Unser Bestand an Bleistiften ist merklich geschrumpft.|„Der Bestand vieler Insektenarten ist in den vergangenen Jahren rapide zurückgegangen.“|„Deutschland liefert Waffen aus den Beständen der Bundeswehr an die Ukraine.“	stock|persistence|existence	istikrar|süreklilik	
Spion	noun	masculine	Spione	„Hier wurden zwischen den USA und der Sowjetunion Spione ausgetauscht.“	spy|peephole	casus	
Socken	noun	masculine	Socken	Die Waschmaschine hat einen schwarzen Socken verschluckt!			
Toter	noun	masculine	Tote	Es wurde ein Toter im Wald gefunden.|„Polizei sucht Hinweise zu Totem“|„Auf dem Märtyrerfriedhof liegen die Toten des Iran-Irak-Kriegs begraben.“	corpse|dead person|dead		
Sieger	noun	masculine	Sieger	Der Sieger des heutigen Spiels wird nächste Woche gegen den Weltmeister antreten.	winner|victor	kazanan|muzaffer	
Scheidung	noun	feminine	Scheidungen	Seit ihrer Scheidung redeten Olaf und Martha nicht mehr viel miteinander.|„Die Scheidung ist eingereicht; sie wird alsbald ausgesprochen werden.“|„Ich hatte wirklich schon viel zu lange mit der Scheidung gewartet.“|„Eine Frau, die in Scheidung lebt, findet allgemeine Beachtung.“|„Die Scheidung war sehr teuer, hat sie mir erzählt.“	divorce	boşanma	hevberdan|devjihevberdan
Schande	noun	feminine		Er hat uns allen Schimpf und Schande gebracht.|„Diese Bahn ist eine Schande für den Industriestandort Deutschland.“	disgrace|shame|ignominy	yüzkarası|ayıp|rezalet	
Junge	noun	masculine	Jungen	Sie hat drei Jungens aus Wuppertal getroffen.|„Als Junge war ich mal im Zirkus.“|„Der Schotte McDonald brachte seinen beiden Jungen einen Luftballon vom Jahrmarkt mit.“	boy	oğlan	
Güte	noun	feminine		Sein Handeln gegenüber Kollegen und Untergebenen war von großer Güte bestimmt.		iyilik	
Brieftasche	noun	feminine	Brieftaschen	„Insgeheim betete er, der Soldat möge ihm nicht die Brieftasche abverlangen.“|„Sie öffnet die Brieftasche und zieht ein abgegriffenes Passfoto hervor.“	wallet	cüzdan	
Lächeln	noun	neuter	Lächeln	„Ich hatte Mühe, ein Lächeln zu unterdrücken.“	smile	gülümseme|tebessüm	
Hirn	noun	neuter	Hirne	„Ich spürte, wie mein Hirn langsam warmlief.“|„Wir brauchen das Gefühl, Herr oder Frau unseres Hirns zu sein.“	brain	beyin|alın	
Liebhaber	noun	masculine	Liebhaber	Frau Schmidt hat einen Liebhaber nach dem anderen.|Du solltest dir endlich einen Liebhaber zulegen.	enthusiast		
Vergehen	noun	neuter	Vergehen	Die gefährliche Körperverletzung gemäß § 224 StGB ist ein Vergehen.	offence|misdemeanour		
Lachen	noun	neuter		„Ich konnte mir ein Lachen nicht verkneifen.“	laughter|laugh		ken
Fremder	noun	masculine	Fremde	Rat an Kinder: Öffne keinem Fremden die Türe.|„Ein solcher hilfsbereiter Fremder war Tony, ein amerikanischer Diplomat in Namibia.“	stranger		
Grüne	noun	feminine	Grüne	Meine Nachbarin ist eine Grüne, sie kandidiert aber nicht zur Kommunalwahl.	Green|member of the Green Party		
Vorgehen	noun	neuter		Die eigentliche Idee war gut, aber ein solches Vorgehen sorgte für Kritik.	course of action	hareket tarzı|tutum	
Treffer	noun	masculine	Treffer	„Bereits beim ersten Treffer flog der Tanker in die Luft.“	hit		
Magie	noun	feminine		Magier setzen ihre Magie mittels eigentümlicher Rituale ein.|„Der Glaube an Magie und Zauberei ist in Afrika lebendig und verbreitet.“	magic	sihir	
Übel	noun	neuter	Übel	Mein Großvater leidet an einem alten Übel aus Kriegszeiten.	evil|malady		
Tief	noun	neuter	Tiefs	Am Wochenende ist das Tief „Ursula“ wetterbestimmend.	low|depression	alçak basınç merkezi	
Laster	noun	neuter	Laster	Das Rauchen war nicht Karls einziges Laster.	vice		
Laster	noun	masculine	Laster	Ich habe für den Umzug einen Laster gemietet.|„Dann wurden die Laster beladen.“	lorry|truck	kamyon	
Lektion	noun	feminine	Lektionen	Heute behandeln wir in unserem Lehrbuch die Lektion 10.	lesson		
Botschafter	noun	masculine	Botschafter	Der Botschafter ist der persönliche Repräsentant des Staatsoberhauptes seiner Nation.	ambassador	büyükelçi|sefirikebir	
Apartment	noun	neuter	Apartments	Manche mieten ein Apartment an ihrem Arbeitsort als Zweitwohnung.|„An einer Wand ihres Apartments in Ogba hingen drei eingerahmte Fotos.“|„Dieses Apartment mußte ich allmählich loswerden.“	apartment	apartman	
Dusche	noun	feminine	Duschen	„Unter der Dusche lasse ich mir heißes Wasser den Rücken hinunterlaufen.“	shower|shower bath	duş	
Fremde	noun	feminine		Peter ist sehr reisefreudig, es zieht ihn immer wieder in die Fremde.|„Will einer hinaus in die Fremde, muss er Fremdsprachen können.“			
Reden	noun	neuter		„‚Die Zeit des Redens ist vorüber. Jetzt ist es Zeit zum Handeln.‘“|„Beim Reden wischte er ein unsichtbares Fädchen vom Seidenaufschlag seiner Jacke.“	talking		
Tausend	noun	feminine	Tausenden	Die Tausend hat drei Nullen.|Burkhard hat in sein Matheheft lauter Tausenden geschrieben.	thousand	bin	
Tausend	noun	neuter	Tausend	Das erste Tausend hat uns mehr Mühe gemacht als die folgenden.|Schnittblumen werden bei uns im Hundert und im Tausend verkauft.	thousand		
Tausend	noun	masculine		Zum Tausend! Ist das eine bittere Medizin!			
Show	noun	feminine	Shows	Die Show von Disney on Ice war wirklich wunderschön.|„Die Show beginnt wieder.“	show		
Muss	noun	neuter		Gute Deutschkenntnisse sind ein Muss, um ein Literaturstudium anzufangen.|„Große Fenster waren ein Muss.“	must		
Von	noun	masculine		Reiten? Wir sind doch keine Vons! – (Detlev Buck)			
Thanksgiving	noun	neuter		Das letzte Thanksgiving war ein Desaster.	Thanksgiving		
Hauptsache	noun	feminine	Hauptsachen	Wir haben uns nicht beliebt gemacht, aber Hauptsache wir haben es geschafft.	main thing		
Nigger	noun	masculine	Nigger	Er outete sich als Rassist, indem er ihn öffentlich als Nigger bezeichnete.|„Bald würde sie es nur noch mit Niggern aufnehmen können, meinte sie.“	nigger		
Feigling	noun	masculine	Feiglinge	„Wer eine Familie mit fünf Töchtern gründet, kann kein Feigling sein.“	coward		
Jünger	noun	masculine	Jünger	Dieses Gemälde zeigt Jesus Christus im Kreise seiner Jünger.	disciple	havari	
Funk	noun	masculine		Wir hatten wiederholt per Funk Kontakt.|Es wurde ein Polizeitaucher über Funk angefordert.	radio|broadcast	radyo	
Funk	noun	masculine	Fünke	Nach dem letzten Funk des Zaubertranks war Peterle unverwundbar.			
Funk	noun	masculine	Funken	Der Funk dieses Stern ist allzu lieblich.			
Funk	noun	masculine		Giacomo hat sich während seines Musikstudiums lange mit Funk beschäftigt.	funk		
Planen	noun	neuter		„Die Verwaltung ist für das Organisatorische zuständig, wie das Planen der Versammlungen.“	planning|scheduling		
Arme	noun	feminine	Arme	Im Haus nebenan wohnt eine Arme, die keinen teuren Sportwagen fährt.	poor		
Hexen	noun	neuter	Hexene	Hexen ist eine benzinartig riechende, farblose Flüssigkeit.	hexene		
Sagen	noun	neuter		Das alleinige Sagen reicht nicht, man muss auch Beispiele vorleben.|Insofern geht das Meinen immer über das Sagen hinaus.	saying		
Reisen	noun	neuter		Die Motive seines rastlosen Reisens um die Jahrhundertwende sind uns unbekannt.|Eine gute Planung erleichtert das Reisen.	travelling		
Liege	noun	feminine	Liegen	Die Liege konnte sein Gewicht nicht halten und brach ein.|„Kurzzeitig zog eine Finnin mit Liege zu mir.“	lounger	şezlong	
Duschen	noun	neuter		„Zeit, in Gang zu kommen. Scheißen, Duschen, Zähneputzen, Rasieren.“	showering		
Klauen	noun	neuter		Ich habe deinen Sohn gestern beim Klauen erwischt!			
Leutnant	noun	masculine	Leutnante	In der NATO hat der Leutnant den Rangcode OF-1.	lieutenant	teğmen	
Gegenüber	noun	neuter	Gegenüber	Der Trainer war recht zufrieden, sein Gegenüber war dagegen etwas enttäuscht.|„Auf einmal wurde mein Gegenüber größer.“	person opposite|counterpart		
Biest	noun	neuter	Biester	„Und es kamen immer mehr von den Biestern.“	beast		
Hundert	noun	feminine		Die Hundert ist die Quadratzahl von 10.	hundred		
Hundert	noun	neuter	Hundert	Wie viel kostet das Hundert Dioden?|Wie viele Hundert hast du vorrätig?|„Hundert glorreiche Sagen von seiner Tollkühnheit sind hier wie überall im Schwang.“			
Lieferung	noun	feminine	Lieferungen	Bei der Lieferung ist etwas kaputt gegangen.	delivery|shipment	teslimat	
Singen	noun	neuter		Heute ersetzen wir das Singen durch rhythmisches Klatschen.	singing|chanting		stran
Out	noun	neuter	Out	Der Torwart fühlte sich bedrängt und schlug den Ball ins Out.			
Lernen	noun	neuter		Ihm fiel das Lernen schon immer schwer.|Man hört nie im Leben mit dem Lernen ganz auf.	learning|study	öğrenmek|çalışmak	
Kofferraum	noun	masculine	Kofferräume	Der Kofferraum war so voll, dass wir die Klappe kaum zu bekamen.|„Die Terroristen laden den Kofferraum voll.“	trunk|boot|car boot	bagaj	
Fangen	noun	neuter		Die Kinder spielen Fangen.	tag|catchers|chasey|tiggy	kovalamanca	
Pater	noun	masculine	PP.	Wo ist Pater Benedikt?			
Ficken	noun	neuter		„Ich sah zwei Fliegen beim Ficken zu.“|„›Geh nach Galapagos und schau den Schildkröten beim Ficken zu.‹“	fucking		
Franzosen	noun	masculine	Franzosen	Der Bauer litt fürchterlich an den Franzosen.	French disease		
Majestät	noun	feminine	MM.	„Die darauffolgende Audienz bei Ihrer Majestät war ein weiteres wichtiges Ereignis.“	majesty		
Major	noun	masculine	Majore	Der Major befahl ihm, zehn Liegestütze zu machen.|„Der Major kam sehr regelmäßig ins Krankenhaus.“|„Ein Major und zwei Hauptleute kamen an ihnen vorbei.“	major	binbaşı	
Entfernen	noun	neuter		Das Entfernen des Warnhinweises ist verboten und unter Strafe gestellt.			
Verstärkung	noun	feminine	Verstärkungen	Da die Front bröckelte mussten immer neue Truppen als Verstärkung abgestellt werden.	enhancement|reinforcement|reinforcements|amplification		
Cent	noun	masculine	Cent	Ich gebe meinem Freund 80 Cent.|Die Verkäuferin fordert mich auf, noch 20 Cent zu geben.	cent		
Lesen	noun	neuter		„Ja, das Schreiben und das Lesen	reading		
Gutes	noun	neuter		Ich glaube an das Ideal vom Guten, Wahren und Schönen.|Es gibt nichts Gutes außer man tut es. (Deutsches Sprichwort)		iyi şeyler	
Kerle	noun	masculine	Kerle	Er ist ein Kerle wie ein Schrank.|Den Kerle kann man brauchen!|In unserer Klasse waren zwölf Mädchen und elf Kerle.			
Leisten	noun	masculine	Leisten	Der Schuhmacher zieht das Leder über den Leisten.	last		
Letzte	noun	feminine	Letzte	Beim 1000-Meter-Rennen war sie die Letzte.			
Reiche	noun	feminine	Reiche	Im Haus nebenan wohnt eine Reiche, die einen teuren Sportwagen fährt	rich		
Patientin	noun	feminine	Patientinnen	„Uns wurde also das Recht zugebilligt, Patientinnen aufzunehmen.“|„Die Patientin schien eher ein Herzproblem zu haben.“	patient	hasta	
Nein	noun	neuter	Nein	Durch das Nein des Präsidenten ist der Gesetzentwurf gescheitert.|Ich habe der Kommission meine Vorschläge vorgelegt, aber ein entschiedenes Nein bekommen.|Du kannst hier nur mit einem Ja oder einem Nein stimmen.|„Mit einem einfachen Nein ist man erst mal aus dem Schneider.“|„Sie bat Yvonne inständig, geradezu flehend, doch Yvonne blieb bei ihrem Nein.“	no|nay	hayır	na
Ja	noun	neuter	Ja	Ein endgültiges Ja steht noch aus.	yes|yea|aye	evet	erê
Warnung	noun	feminine	Warnungen	Aufgrund der Warnung vor Wildwechsel fuhr er langsamer.|„Hamids paranoide Warnungen vor dem Nachbarland taten ihr Übriges.“	warning	ihtar|ikaz|uyarı	
Football	noun	masculine	Footballs	Er mochte jegliche Varianten des Footballs.			
Melde	noun	feminine	Melden	Im Mittelalter wusste man, dass Melden Stoffe grün färben.	message|orach|saltbush		
Farm	noun	feminine	Farmen	„Wir schlenderten den Hügel zur Farm hinauf.“|„Die Arbeit auf der Farm brachte nach einiger Zeit tatsächlich Erfolg.“|„Nach und nach entstehen neue Farmen, Siedlungen und Plantagen.“		çiftlik	
Wählen	noun	neuter		Ich weiß noch nicht, ob ich am Sonntag zum Wählen gehe.			
Fehlen	noun	neuter		Als der Lehrer das Fehlen eines Schülers bemerkte, stutzte er.	absence|lack		
Mademoiselle	noun	feminine	Mlles	„Im Konzert trägt Mademoiselle immer das Kreuz von ihrer Erstkommunion.“|„Sie war eindeutig eine Mademoiselle; an ihr war keine Spur von Madame.“	mademoiselle		
Rund	noun	neuter	Runde	Ich habe das gesamte Rund der Erde bereist.|Im Rund der Manege fühlt er sich am wohlsten.	round		
Unschuldige	noun	feminine	Unschuldige	Die Unschuldige gab ihre Aussage zum Tathergang zu Protokoll.			
Extrem	noun	neuter	Extreme	Ein Erdbeben der Stufe 9,0 ist auf jeden Fall ein Extrem.|Klimaforscher sagen voraus, dass mit dem Klimawandel vor allem die Extreme zunehmen.			
Köder	noun	masculine	Köder	Er befestigte seinen Köder am Angelhaken.	bait	yem	
Studio	noun	neuter	Studios	„Wir gingen hinunter zu dem Studio, in dem Black seine Bilder zeigte.“	studio	stüdyo	
Story	noun	feminine	Storys	Das Buch hat eine spannende, romantische und traurige Story.	story		
Große	noun	feminine	Große	Unsere Große hat uns neulich bei der Gartenarbeit geholfen.			
Großer	noun	masculine	Große	Unser Großer hat nur gute Zensuren auf seinem Zeugnis.			
Hinweg	noun	masculine	Hinwege	Auf dem Hinweg können wir ja noch kurz bei Tante Frieda vorbeischauen.|Der Hinweg kommt mir immer viel länger vor als der Rückweg.			
Des	noun	neuter	Des	Denke bitte daran in Takt 5 ein Des zu spielen!	D flat		
Dunkel	noun	neuter		Im Dunkel dieses Zimmers kann man das Fürchten kriegen.|Schon bald hüllte uns das Dunkel des Waldes ein.|Ganz unerwartet brach das Dunkel der Nacht über uns herein.	dark		
Dicke	noun	feminine	Dicken	Ich hätte gerne einer Scheibe Leberkäse, mit etwa einem Zentimeter Dicke.|Wir haben Stahlbleche in verschiedenen Dicken.|Wir brauchen einen Baumstamm mit ausreichender Dicke.	thickness		
Dicke	noun	feminine	Dicke	Siehst du die Dicke da vorne? Die wiegt doch mindestens 150 Kilo!|Er nennt seine Hündin liebevoll seine „Dicke“.			
Tolle	noun	feminine	Tollen	Die Tolle war ein Markenzeichen von Elvis Presley.	pompadour		
Pool	noun	masculine	Pools	Nach der Schule erfrischen sich die Kinder gerne im Pool.|„Früher oder später würde ich jedenfalls an den Pool gehen müssen.“	pool|swimming pool	havuz	hewz
Pool	noun	neuter		Sie spielten in der Kneipe eine Runde Pool.	pool		
Alf	noun	masculine	?	„Bei Venedien hat sich früher ein Alf herumgetrieben.“			
Erzählen	noun	neuter		Das Erzählen fiel ihr schwerer als das Zeichnen.			
Hauptmann	noun	masculine	Hauptmänner	Er wurde zum Hauptmann ernannt.	captain	yüzbaşı|eyalet başkanı	
Oberst	noun	masculine	Oberste	Er ging als Oberst in Pension.	colonel	albay	
Irre	noun	feminine		Das Navi hat uns in die Irre geleitet.			
Irre	noun	feminine	Irre	Sie raste wie eine Irre durch die Stadt.|Denk dir nichts, das ist doch eine arme Irre!			
Kate	noun	feminine	Katen	In dieser Kate lebten mehr als zehn Leute.			
OB	noun	masculine	OBs	Unser OB ist zurückgetreten.			
Näher	noun	masculine	Näher	Er brachte seine kaputten Hemden zum Näher.	sewer|seamster		
Penny	noun	masculine	Pennys	In Großbritannien entsprechen einhundert Pennys einem Pfund.|„Für jeden beim Würfeln gewonnenen Shilling bekamen wir einen Penny.“	penny		
Halbe	noun	feminine	Halben	Komm, wir trinken noch eine Halbe.|Resi, bring uns noch zwei Halbe.			
Herrgott	noun	masculine		Durch regelmäßiges Beten kann man den Herrgott milde stimmen.			
Sir	noun	masculine	Sirs	Bitte entschuldigen Sie, Sir!	sir		
Frische	noun	feminine		Die Frische der hereinbrechenden Nacht ließ uns die Tageshitze vergessen.	freshness|viridity		
Lade	noun	feminine	Laden	„Ein zweiter, abmontierter Telefonhörer liegt in der oberen Lade des Nachtkästchens.“	drawer|chest|coffer|receptacle		
Trotz	noun	masculine		Sein Verhalten ist reiner Trotz.|„Dann aber war ein wütender Trotz in ihm hochgestiegen.“	defiance		
Selbst	noun	neuter		Das eigene Selbst sollte man nicht vernachlässigen.	self		
Mehr	noun	neuter		Das Mehr an Arbeit wird durch einen Gehaltsbonus ausgeglichen.|„Über ein Mehr lege er sich vorläufig Schweigen auf.“	plus		
Einer	noun	masculine	Einer	Sie gewann die Goldmedaille im Einer.		tekli bot	
Hoheit	noun	feminine	Hoheiten	„Mit Hoheit hörte er ihren Bericht und ihre Schicksale während seiner Abwesenheit.“	Highness|sovereignty		
Festhalten	noun	neuter		Das Festhalten autistischer Kinder ist umstritten.			
Gestern	noun	neuter		Du lebst noch immer im Gestern.	yesterday		duh
Neues	noun	neuter		Gibt es etwas Neues?|Ich möchte mir dringend mal etwas Neues kaufen.		yeni haber|güncel olan|yeni bir şey	
Mir	noun	masculine	Mirs	Im Wohnzimmer liegt ein Mir aus dem 19. Jahrhundert.			
Mir	noun	masculine		Zum Mir gehörten alle Einwohner eines Dorfes.			
Erwarten	noun	neuter		Wider Erwarten lief alles wie geschmiert.			
Handeln	noun	neuter		Sein Handeln war in dieser Situation durchaus gerechtfertigt.	action|acting|haggling|bargaining		
Hurra	noun	neuter	Hurras	Ein dreifaches Hurra auf unseren König!|Mit einem donnernden Hurra gingen sie zum Angriff über.			
Boston	noun	masculine	Bostons	Sie tanzten auf dem Ball einen Boston.|„Es gibt drei Preise für Onestep, Boston und Foxtrott.“			
Sekretärin	noun	feminine	Sekretärinnen	Ohne meine Sekretärin wäre ich aufgeschmissen.|„Eine der Sekretärinnen dort macht mit mir Yoga.“	secretary		
Leider	noun	masculine	Leider	Der Leider behält das Land.			
Guter	noun	masculine	Gute	Das Happy-End bestand aus einem gewaltlosen Sieg der Guten über die Bösen.|Bist du ein Guter?|Die Guten werden stets übersehen oder verfolgt.|„Der Vogl, der ist ein ganz Guter.“			
Real	noun	masculine	Reales	Der portugiesische Real wurde 1914 vom Escudo abgelöst.	real	real	
Schönes	noun	neuter		Er hat in seinem Leben schon viel Schönes gesehen.|Ich kann nur wenig Schönes berichten.|Der Abend bot viel Schönes, leider aber auch einen tragischen Zwischenfall.		güzel şey|beğendiğin şey	
Mami	noun	feminine	Mamis	Mami, kannst du mir mein Taschengeld schon heute geben?	mum		
Mami	noun	neuter	Mamis	„Das übernimmt weiterhin sein Mami.“|„Kontakt zu seinem Mami Elvira soll er seit Knastantritt keinen haben.“	mum		
Für	noun	neuter		Das Für und Wider des Flughafenausbaus wurde erschöpfend diskutiert.			
Kleine	noun	feminine	Kleine	Unsere Kleine ist gerade in die Schule gekommen.			
Junior	noun	masculine	Junioren	Der Junior übernahm die Firma, als der Geschäftsinhaber krank wurde.	junior		
Hauptquartier	noun	neuter	Hauptquartiere	Die militärischen Befehlshaber trafen sich wegen eines Präzedenzfalles im Hauptquartier.|„Zum ersten Mal seit Kriegsbeginn befand sich das Hauptquartier in Berlin.“|„Murat schickte einen reitenden Boten ins Hauptquartier.“	headquarters	karargâh	baregeh
Staffel	noun	feminine	Staffeln	Vor der ersten Staffel überflog eine Beobachtungsmaschine die Stadt.	squadron|relay|season	sezon	
Staffel	noun	masculine	Staffeln	Fall nicht über den Staffel!|„Auf dem barrierefreien Zugangsweg sollen Spalten, Stufen und Staffeln vermieden werden.“			
Früh	noun	masculine		Um sieben in der Früh klingelte es an der Tür.|In der Früh kommt Norbert nur schwer in Gang.|„Der Pächter starb am 19. Oktober 2018 in der Früh.“			
Schwarze	noun	feminine	Schwarze	Seine neue Freundin ist eine Schwarze.			
Versehen	noun	neuter	Versehen	Ich habe Ihnen aus Versehen die falschen Unterlagen zukommen lassen.|Ich bitte Sie, dieses Versehen zu entschuldigen.	accident|mistake|inadvertence|oversight		
Besonderes	noun	neuter		„Auf der Fähre passierte dann aber noch einmal etwas Besonderes.“			
Verzeihung	noun	feminine		Ich sehe meinen Fehler ein und bitte dich vielmals um Verzeihung!	pardon|forgiveness		
Hängen	noun	neuter		„›Hängen ist zu gut für so einen Drecksack‹, sagt ein Mann.“	hanging		
Heiliger	noun	masculine	Heilige	Die Figur auf dem Altar stellt wohl einen Heiligen dar.|„Die Odyssee des Heiligen endet schließlich im nordostenglischen Durham.“	saint	aziz|melek	
Heilige	noun	feminine	Heilige	Die Figur auf dem Altar stellt wohl eine Heilige dar.	saint	azîze|melek	
Schaffen	noun	neuter		Die Ausstellung präsentiert besonders das Schaffen seiner Anfangsjahre.			
Schwarzer	noun	masculine	Schwarze	Sie trinkt meist einen großen Schwarzen im Kaffeehaus.			
Molly	noun	masculine	Mollys	Der Molly gehört zur Unterfamilie der lebendgebärenden Zahnkarpfen.	molly		
Bobby	noun	masculine	Bobbies	„Bobbys tragen traditionell keine Schusswaffen, sondern nur Schlagstöcke.“	bobby		
Können	noun	neuter		Geschick und etwas handwerkliches Können schaden nicht beim Zusammenbauen dieses Regals.|Bei der Theateraufführung zeigten die Schüler ihr schauspielerisches Können.|„Sie neidete Carl sein Können, aber noch mehr diese Liebe.“			
Crew	noun	feminine	Crews	Beim Einstieg ins Flugzeug wird jeder Gast von der Crew begrüßt.	crew		
Trage	noun	feminine	Tragen	„Eine Trage wurde unter mir herausgezogen.“	stretcher|litter	sedye	
Zwischenzeit	noun	feminine	Zwischenzeiten	„Aber auch diese Zwischenzeit war bald vorüber.“|„In der Zwischenzeit blieb der Status der deutschen Bevölkerung unklar.“	meantime|in the meantime|meanwhile|split		
Bedrohung	noun	feminine	Bedrohungen	Diese Reaktoren stellen eine große Bedrohung dar.	threat	tehdit	gef
Sergeant	noun	masculine	Sergeanten	Der Redner ist Sergeant der US-Armee in Heidelberg.|«Befehl von Sergeant Miller», das sollten Sie also jetzt besser tun.			
Schätzchen	noun	neuter	Schätzchen	Na, Schätzchen? Wie geht’s dir heute?|„Die Schätzchen, die Kellnerinnen und die Aushilfskellnerinnen lassen sich nicht blenden.“			
Revier	noun	neuter	Reviere	Singvögel kennzeichnen ihr Revier durch ihren Gesang.	territory|district|precinct		
Tragen	noun	neuter		„Allein die Logistik - das Tragen - erforderte mindestens zwanzig Personen.“	carrying|bearing		
Spreche	noun	feminine		Kevins Spreche ist mir aber zuwider.	parlance|speech		
Schreibe	noun	feminine	Schreiben	Ein Autor verbessert seine Schreibe durch Analyse seiner eigenen Texte.|„Wie gute Schokolade wird alles lange gerührt, die Schreibe ist flüssig.“	way of writing|written language|pen		
Erster	noun	masculine	Erste	Beim Wettlaufen war ich als Kind immer Erster.|Er kam als Erster ins Ziel.	first	birinci	
CIA	noun	masculine		„Noch am selben Tag kennt die CIA das Telegramm.“			
Nix	noun	masculine	Nixe	Der Nix versucht Menschen ins Wasser zu ziehen und sie zu ertränken.	neck	su perisi|Plutay	
Deckung	noun	feminine	Deckungen	Die Deckung bietet Schutz vor Gewehrkugeln.	cover	örtü|siper	
Testen	noun	neuter		Zum Testen der Prototypen wurde extra eine eigene Teststrecke angelegt.	testing		
Denke	noun	feminine		„Die Denke muss sich ändern“|„Sie kennen die Denke Ihres ehemaligen Trainers Jürgen Klopp.“			
Zweiter	noun	masculine	Zweite	Beim Wettlaufen war ich als Kind immer nur Zweiter.|Der Zweite konnte seine Enttäuschung über den verpassten Sieg nicht verbergen.			
Bravo	noun	neuter	Bravos	„Ein Bravo ihrer Courage und ihrer Leistung!“|„Das war ein ziemlich hochgestimmtes Bravo.“			
Bravo	noun	feminine	Bravos	„Beim Bäcker liegen Zeitschriften aus und ich stoße auf die neue Bravo.“|„In der Lektüre der Lehrlinge dominiert eindeutig »Bravo«.“|„Meine liest das Bravo mit ihren Schulfreundinnen, irgendeine kauft das Heftl immer.“|„BRAVO weiß, wie es seine ›BRAVO-Mädchen‹ erreichen kann.“|„14jährige Bravo-Mädchen sind als Fans doch nicht schlechter als 30jährige Linguistik-Studenten.“|„Der Briefroman als »BRAVO« des 18. Jahrhunderts?“|„Der Metal Hammer ist einfach immer mehr die Bravo der Metal-Musik-Zeitschriften.“|„Playboy als die Bravo der Stehengebliebenen“			
Dan	noun	masculine	Dan	Sie hat den zweiten Dan.			
Assistentin	noun	feminine	Assistentinnen	Dem Hochschulprofessor wurden zwei Assistentinnen zur Seite gestellt.|„Ihre Assistentin lässt am Flughafen Le Bourget einen Privatjet bereitstellen.“|„Bereits um neun Uhr steht Thomas vor dem Schreibtisch der jungen Assistentin.“	assistant	asistan	
Stimmengewirr	noun	neuter		„Nachts ertönte aus der Männergruppe leises Stimmengewirr.“|„Plötzlich hielt das Taxi unvermittelt an, und Ferris hörte arabisches Stimmengewirr.“			
Spielchen	noun	neuter	Spielchen	Wir spielten ein kleines Spielchen.|Wir machten nur ein paar Spielchen und gingen dann nach Hause.			
Mistkerl	noun	masculine	Mistkerle	„Nie mehr wollte ich mit dem Mistkerl was zu tun haben.“|„Aber das hatte der arme Mistkerl sich selbst zuzuschreiben.“|„Da hat dieser Mistkerl den Menschen doch sofort hinterm Vorgang hervorlugen sehen.“	bastard|bugger|scumbag|son of a bitch		
Krankenstation	noun	feminine	Krankenstationen	„Mama ist lieber schon aus der Krankenstation zurückgekommen.“|„Die Krankenstation leitet ein deutscher Arzt, doch der kann kaum helfen.“			
Töten	noun	neuter		Das Töten geht immer weiter.	killing		
Verschwinden	noun	neuter		Das Verschwinden von Sandra ist rätselhaft.	disappearance		
Waschen	noun	neuter		„Für das Waschen von Autos auf öffentlichen Straßen gilt ähnliches.“	washing	yıkama	
Air	noun	neuter	Airs	„Darüberhinaus besaß Ségouin das unverkennbare Air des Reichtums.“			
Riechen	noun	neuter		Das Riechen und das Schmecken sind bei einer Erkältung stark vermindert.			
Verdächtige	noun	feminine	Verdächtige	Die Verdächtige wurde durchsucht und dann auf die Wache gebracht.	suspect		
Wohnen	noun	neuter		„Experten rechnen, dass intelligentes Wohnen bis 2030 zur Standardausstattung bei Neubauten gehört.“	habitation	oturma	
Mister	noun	masculine	Mister	Ich darf Ihnen Mister Smith vorstellen.	mister		
Inspektor	noun	masculine	Inspektoren	Der Inspektor hat seine Untersuchung abgeschlossen.	inspector		
Drink	noun	masculine	Drinks	„Angelini lud alle auf einen Drink in den Salon ein.“|„Aber mit ein paar Drinks wird es schon laufen.“|„Sie hat schon ein paar Drinks gehabt, schlecht für ihre Leber natürlich.“	drink		
Heil	noun	neuter		Er sah sein Heil in der Gründung einer eigenen Familie.	hail|heil		
Packen	noun	masculine	Packen	Sie faltete die Sachen aufeinander und schob den Packen in den Schrank.			
Pinkeln	noun	neuter		„Ein Mann klagt über furchtbare Schmerzen beim Pinkeln.“			
Die	noun	neuter	Dice	Das Die wird bis zu 98 °C heiß.|Bei der Herstellung der CPU-Dice hat Intel 96 % Ausschuss.			
Camp	noun	neuter	Camps	„Ihr Camp lag flussabwärts, nicht weit von Kouroussa.“|„Am Camp ist nicht viel dran.“			
Safe	noun	masculine	Safes	„Liza verschloss das Bargeld im Safe und machte alle Lampen aus.“	safe	çelik kasa	
Jersey	noun	neuter	Jerseys	Die Rugbyspieler trugen die typischen breit gestreiften Jerseys.	jersey		
Niemand	noun	masculine	Niemande	„Wer bist du schon außer ein Niemand?“|„Ich raste gegen Nichts und Niemand.“	nobody	hiç kimse	
Green	noun	neuter	Greens	Auf dem Green benutzt man in der Regel den Putter.	green		
Avenue	noun	feminine	Avenuen	„Ich ging die fünfte Avenue entlang.“			
Schießen	noun	neuter	Schießen	Ich erinnere nicht mehr, wann das erste Schießen am Gotthardbasistunnel war.	shooting	ateş etme	
Bisschen	noun	neuter	Bisschen	„Nicht das geringste Bisschen blieb von ihm übrig.“			
Normal	noun	neuter	Normale	Im roten Kanister ist Super und im grünen Normal.			
GUS	noun	feminine		GUS ist eine wichtige Substanz, die im GUSB-Gen des Menschen vorkommt.	CIS	BDT	
Papi	noun	masculine	Papis	Papi, kommst du bitte mal.|Mein Papi steht morgens ungern auf.|Der Papi nannte sich bei Hans-Jürgen „Vati“.	daddy|dad		
King	noun	masculine	Kings	Ich bin der King von Berlin-Mitte.			
Sterben	noun	neuter		[Frühjahr 2022:] Das Sterben im Osten der Ukraine ist in vollem Gange.|„Doch nun beginnt im Lager ein großes Sterben.“|„Denn der Gedanke an das Sterben macht Angst, jedem von uns.“|„Minutiös beschreibt er, wie unser Sterben vonstatten geht.“|„Was muss anders werden, damit ein würdevolles Sterben möglich wird?“|„Die Varroa-Milben gelten als Hauptgrund für das Sterben von Bienenvölkern.“|„Um das Sterben der Innenstädte aufzuhalten, braucht es neue Konzepte.“|[Schlagzeile:] „Ghana: Das Sterben der Kakaoplantagen“	dying|departure	ölme	
Leere	noun	feminine		Die Leere der vor ihnen liegenden Landschaft erschreckte sie.	emptiness		valahî
Miteinander	noun	neuter		„Schonungslos decken die Kleinen jede Sollbruchstelle im Miteinander auf.“|„Dieses gemütvolle Miteinander ist nun vorbei.“	togetherness		
Action	noun	feminine		„Und dieses ewige Joggen ist mir zu langweilig, ich brauche mehr Action.“	action|liveliness		
Kleiner	noun	masculine	Kleine	Mein Kleiner muss morgen zum Ohrenarzt.			
Daddy	noun	masculine	Daddys	„Daddys Meinung ist eben doch nicht ganz unwichtig.“	codger|gaffer|geezer		
Prost	noun	neuter	Proste	Wir stoßen mit einem Prost an.|„Mit einem Prost stoßen wir an.“			
Ach	noun	neuter		Das ewige Ach meines Vaters geht mir auf den Geist.			
Super	noun	neuter		Denken Sie daran, im neuen Dienstwagen Super zu tanken und nicht Diesel!|Das Super ist schon wieder teurer geworden.			
Truck	noun	masculine	Trucks	„Paul Hopkins war froh, dass sein riesiger Truck endlich leer war.“			
Betreten	noun	neuter		„Zum Betreten eines Zuschauerraums ist normalerweise eine Berechtigung erforderlich, eine sogenannte Eintrittskarte.“|„Für das Betreten des Waldes darf kein Entgelt erhoben werden.“|„Das Betreten von Milman und Aplin Island ist ganzjährig untersagt.“|„Das Betreten erfolgt grundsätzlich auf eigene Gefahr.“|„Ein Betreten der Flächen ist auf mehreren Wegen möglich.“|„Gekennzeichnete Wanderwege ermöglichen ein Betreten des Gebiets.“	access|entry		
Dritte	noun	feminine	Dritte	Die Dritte war nicht zufrieden mit ihren Leistungen.	third		
Reiten	noun	neuter		Beim Reiten ist es wichtig, das Gleichgewicht zu halten.|Das Reiten auf dem Elefanten ist natürlich nicht kostenlos.	horse riding	binme	
Zweite	noun	feminine	Zweite	Die Zweite konnte ihre Enttäuschung über den verpassten Sieg nicht verbergen.		ikinci	
Neue	noun	feminine	Neue	„Die Neue kam nicht näher als 40 cm an Jessika heran.“			
Trinken	noun	neuter		Leider kann sie das Trinken nicht lassen.	drinking		
Sowieso	noun	masculine	Sowiesos	„Sie müssen unbedingt den Sowieso, die Sowieso kennenlernen!“|„Der Sowieso, das ist ein außerordentlich interessanter Mann.“	so-and-so / so and so|such-and-such / such and such		
Sowieso	noun	feminine	Sowiesos	„Sie müssen unbedingt den Sowieso, die Sowieso kennenlernen!“|„Für die Hauptrolle ist die Sowieso ideal, phänomenal.“	so-and-so / so and so|such-and-such / such and such		
Klopfen	noun	neuter		„Heftiges Klopfen zerreißt einen unruhigen Schlaf.“|„An der Tür erklang plötzlich ein Klopfen, und ich fuhr zusammen.“			
Entkommen	noun	neuter		„Wenn kein Entkommen mehr möglich ist, werden wir uns umbringen, uns erschießen.“			
Schwere	noun	feminine		„Das Gesetz der Schwere ist in den mechanischen Künsten eine erkennende Wahrheit.“	heaviness|gravity|difficulty|weight		giranî
Schließen	noun	neuter		„Der Taucher musste den Toten vor dem Schließen der Tür hereingeschleppt haben.“	closing		
Viel	noun	neuter		„Aus einem Wenig kommt ein Viel.“			
Verlass	noun	masculine		Auf die Bahn ist Verlass.			
Nachsehen	noun	neuter		Tja, wirklich dumm gelaufen, da bleibt dir nur das Nachsehen.			
Freie	noun	feminine	Freie	Die Freie hatte das Sagen und Vorrecht, die Magd war rechtlos.			
Vergessen	noun	neuter		„So handeln Witze von der Vergänglichkeit und dem Vergessen in der Veränderung.“	forgetting|oblivion		jibîrkirin
Hole	noun	neuter	Holes	Dein Ball liegt super, nur ein paar Zentimeter neben dem Hole.	hole		
Fahren	noun	neuter		Das Fahren ohne Führerschein ist verboten.			
Atmen	noun	neuter		„Hilfreich ist auch, wenn Sie beim Atmen während des Sports zählen.“			
Reine	noun	feminine		Die Reine des Metalls prüfte man mit Salpetersäure.	purity		
Bester	noun	masculine	Beste	Bester wurde der Belgier Sander.|Der Beste darf zur nationalen Endausscheidung fahren.|Stell jemanden ein, der dir hilft, den ersten Besten, der hier vorbeikommt!		en iyisi	
Beste	noun	feminine	Beste	Nur die Beste wird weiterkommen.|Du wirst doch wohl nicht die erste Beste heiraten?	best	en iyisi	
Bestes	noun	neuter	Beste	Das Beste kommt zum Schluss.			
Ganzes	noun	neuter	Ganze	Wir sehen das Ganze und schauen nicht mehr auf die Details.			
Letztes	noun	neuter	Letzte	Das Letzte habe ich von ihm im Frühjahr gehört.			
Knacken	noun	neuter		„Suttree lauschte träumerisch dem Knacken des Funkgeräts.“			
Lese	noun	feminine	Lesen	„Auch hier hat die Lese schon begonnen.“			
Bete	noun	feminine	Beten	Das Sortenspektrum der Beten reicht vom klassischen Rot über Weiß bis Gelborange.	beet		
Live	noun	masculine	Liven	Der Live lebt seit vielen Jahren in Riga.			
Hören	noun	neuter		„Hören hilft bei der Orientierung und Verständigung, beeinflusst das Denken und Fühlen.“			
Schmecken	noun	neuter		„Von Geburt an orientieren sich Kinder durch Riechen und Schmecken.“			
Fühlen	noun	neuter		Das Fühlen von Gegenständen erfolgt zumeist mit unseren Händen.	feeling		
Kochen	noun	neuter		Man darf nur vorsichtig erhitzen und keinesfalls das Wasser zum Kochen bringen.	boiling|cooking		
Begrüßen	noun	neuter		Beim Begrüßen nickt sie immer so komisch mit ihrem schräg gehaltenen Kopf.			
Erschießen	noun	neuter		Er wurde zum Tod durch Erschießen verurteilt.			
Stoßen	noun	neuter		Und Matthias gewinnt im Stoßen!			
Genießen	noun	neuter		Jetzt stehen Enspannen und Genießen auf dem Programm.|Genießen ist hier ganz ausdrücklich erlaubt.			
Anziehen	noun	neuter		Beim ersten Anziehen des Wagens riss ein Seil.			
Willkommen	noun	neuter	Willkommen	Lasst uns Onkel Gustav ein herzliches Willkommen bereiten.	welcome		
Mach	noun	neuter	Mach	Morgen werden wir beim Test der Rakete Mach 9 erreichen.			
Jemand	noun	masculine	Jemande	„Der Jemand hörte auf zu watscheln und blieb reglos vor Pu stehen.“	somebody		
Over	noun	neuter	Overs	„Achtunddreißig, Sir. War sechs Overs dabei.“	over		
Stöhnen	noun	neuter		„Langsam löste sich ein Stöhnen aus seinem Mund, das als Knurren endete.“	groan|moan		
Aua	noun	neuter	Auas	Der Kleine hat heute ein dolles Aua gemacht.	boo-boo|owie		
Colt	noun	masculine	Colts	„Ich zog den Colt.“|„Owens richtete den Colt auf ihn.“|„Petersons Daumen presste eine Nuance stärker auf den Abzug des Colts.“			
Quietschen	noun	neuter		„Schritte. Das Quietschen einer Holzdiele.“			
Schönste	noun	feminine	Schönste	Spieglein, Spieglein an der Wand, wer ist die Schönste im ganzen Land?			
Öffnen	noun	neuter		„Die eine Hälfte bildete die Tür und schwang beim Öffnen nach außen.“	opening		
Dummer	noun	masculine	Dumme	„›Gehängt werden nur die Dummen, und ich bin nicht dumm.‹“			
Jagen	noun	neuter		„Mir machte es mehr Spaß, von Meklein das Jagen zu lernen.“	hunting	avlanma	
lieben	verb			Sie lieben Nudeln, sie essen sie dreimal die Woche.	love|have sex	sevmek	hez kirin
sein	verb			Er ist 30 Jahre alt.|Der Präsident ist schwarz.|Sie ist früher eine Schönheit gewesen.|Das ist ein Problem, weil er ein Schürzenjäger ist.|Das Neue scheint interessant zu sein.|Die Konsequenzen der Wahrheit könnten unangenehm sein.|Ihr wart damals noch jung.|Vergiss, was gewesen ist; jetzt ist es so.	be|exist|have	olmak	bûn
wissen	verb			Ich weiß nicht, ob ich morgen Zeit habe.|Weißt du, wie spät es ist?|Ich weiß, dass ich nichts weiß.|Ich habe alle Antworten im Quiz gewusst.|Sie wusste von dem gestrigen Ereignis.|Weißt du eigentlich, wo meine Uhr ist?|Wusstest du um ihre Schwierigkeiten mit ihrem Mann?	know	bilmek	zanîn
brechen	verb			Er brach das Brot und verteilte es unter den Armen.	break|burst|refract|breach	kırmak	
verbrechen	verb			Das Gulasch kann man ja nicht essen, wer hat das denn verbrochen?	be responsible for|be up to|perpetrate		
machen	verb			Das macht mich wütend.|Komm, lieber Mai, und mache die Bäume wieder grün. (Wolfgang Amadeus Mozart)|Du machst dich zum Gespött der Leute.|Was hast du nur aus mir gemacht!|Er machte sie zu seiner engsten Vertrauten.|Sie machte ihn zu ihrem Verlobten.|Meine Frau hat sich heute Abend besonders hübsch gemacht.|Du machst mich aber jetzt neugierig!	make|do|perform|run	yapmak	kirin
untersuchen	verb			Der Kommissar untersuchte den Tatort, um Hinweise auf den Täter zu finden.|Im Labor untersucht man die DNA-Proben.|Die Arbeitsgruppe untersucht, wie man die Öle recyceln kann.|Diese Fragestellung sollten wir noch etwas genauer untersuchen.	investigate|examine		
kaufen	verb			Wenn ich einmal groß bin, kaufe ich mir ein Auto.	buy|bribe	satın almak	kirîn
wohnen	verb			Er wohnt in der Stadt und sein Bruder auf dem Land.|Mein Cousin wohnt nur fünf Minuten von der Universität entfernt.|Meine Schwester wohnt noch bei unseren Eltern, ich dagegen in einer WG.	live|lodge|reside|dwell	oturmak|kalmak	
sehen	verb			Seit ich die neue Brille habe, sehe ich viel besser.|Das Kindermädchen sah nach den Kleinen.|Siehst du den Mann mit Hut auf der anderen Straßenseite?|Miriam hatte ihre Tante lange nicht gesehen.	see|look|view	görmek	dîtin
essen	verb			Wir haben schon gegessen.	eat	yemek|atıştırmak	
trinken	verb			Ich trinke ein Glas Wasser.	drink	içmek	vexwarin
gehen	verb			Ich gehe über die Straße.|„Nur die, denen es finanziell gut geht, gehen in ein Restaurant.“	walk|go|leave|work	yürümek|gitmek|çalışmak|işlemek	
ficken	verb			Ich möchte dich gern ficken!|Ich möchte mit dir ficken!|„Eine Hure ist dazu da, dass sie gefickt wird.“|Er fickt besser als jeder andere.	fuck|screw|bone|bonk	sikişmek|sikmek	niyan|tê niyan|gan
kochen	verb			Wir kochen uns eine Gemüsesuppe.	cook|make|boil|be seething with rage	pişirmek	kelandin|kelîn
sprechen	verb			Mein Kind hat mit neun Monaten sein erstes Wort gesprochen.|Ihr Sohn spricht ruhig und gut verständlich.|Hast du Zeit, mit mir zu sprechen?|Er hat einen Papagei, der sprechen kann.|Er spricht mit seiner Familie Englisch und Spanisch.|Können Sie Deutsch sprechen?|Er möchte mit uns über seine Abenteuerreise in die Arktis sprechen.|Welche Sprache spricht man eigentlich in Belgien?|Sie spricht mit einem leichten englischen Akzent.|Der Pastor sprach am Ende der Messe ein Gebet.|Kann ich dich kurz sprechen?|Ich möchte Herrn Müller einmal sprechen.	speak|propose|talk	konuşmak|ifade etmek	
akzeptieren	verb			Der Vorschlag wurde von allen akzeptiert.	accept		pejirandin|qebûl kirin
liegen	verb			Ich liege in meinem Bett.	lie|sit|stand|be located		
ignorieren	verb			Es war wirklich nicht gut, diesen Vorfall einfach zu ignorieren.|Den Zusatz im Anhang kannst du getrost ignorieren.	ignore	dikkate almamak|ihmal etmek	piştguh kirin
sparen	verb			Mein Neffe hat schon 100 Euro gespart.|Für das neue Auto müsste er sparen.	save|put aside|economise / economize	biriktirmek|idareli harcamak|tasarruf etmek|vazgeçmek	
fliegen	verb			Ein Adler kann fliegen, ein Pinguin kann nicht fliegen.|Wohin fliegt der Schmetterling?|Das Flugzeug fliegt von Berlin nach Moskau.|Der Ballon flog hunderte Kilometer weit.|Die Rackete fliegt zum Mond.|Die Vögel fliegen tief über dem Wald.|Im Himmel erblickte ich ein hoch über den Wolken fliegendes Flugzeug.|Die Biene fliegt von Blüte zu Blüte, um sie zu bestäuben.|Der Satellit fliegt in über 400 Kilometern Höhe.|„Zu Tal fliegt, wer will, wieder mit dem Paragleiter.“	fly|aviate|be expelled	uçmak|kovulmak	firîn
schweigen	verb			Die Menschen schweigen, um den Redner besser zu verstehen.	be silent|keep quiet|keep a secret	susmak	
verstehen	verb			Es war so laut, man konnte sein eigenes Wort kaum verstehen.	understand|mean|interpret|consider oneself	anlamak|çakmak|kavramak|bilmek	
verstehen	verb			Wir haben eine Stunde an der Vorverkaufskasse verstanden.	spend one's time standing about		
hören	verb			Mein Großvater hört nicht mehr gut.	hear|obey|listen	duymak	
lesen	verb			Wer heute nicht lesen und schreiben kann, hat keinerlei berufliche Aussichten.	read|pick|glean|select	okumak	xwendin
haben	verb			Er hat es in der Schule gelernt.	have|have got|contain|must	sahip olmak|olmak	hebûn
können	verb			Wenn die Schüler wollen, können sie die Übungen schaffen.|Sie hat den Unfall nicht vorhersehen können.	can|may		karîn|şiyan
können	verb			Ich kann mehrere Sprachen.|Mein Schüler kann das Gedicht noch immer nicht auswendig.|Wer nur tut, was er kann, der bleibt, was er ist.	know|be able to|can|may		
fernsehen	verb			Gestern Abend haben wir ferngesehen.|Morgen wird Sophie fernsehen, wenn die Biathlon-Weltmeisterschaft übertragen wird.|In unserer Familie wird selten ferngesehen.	watch TV	televizyon seyretmek|televizyon izlemek	
arbeiten	verb			Wir arbeiten gemeinsam an einem Wörterbuch.|Er arbeitet als Lektor in einem bekannten Verlag.|Was macht das Studium? Ich arbeite daran.|Was macht die Reparatur? Wir arbeiten mit Hochdruck an der Hauptleitung.	work|function|warp|be employed	çalışmak	kar kirin|xebitîn
denken	verb			Sabine denkt immer viel zu kompliziert.|Wenn ich zu viel getrunken hab, kann ich nicht mehr ordentlich denken.|Denke nie, gedacht zu haben.	think		
kriegen	verb			Nimm, was du kriegen kannst.|Wie viel Geld kriegst du eigentlich?|Meinen die wirklich Madonna kriegt einen Oscar?|Kriegen wir dieses Jahr eigentlich noch einen richtigen Sommer?|Ich hab gehört sie kriegt ein Kind, stimmt das?	come down with|have|get|catch	almak|ele geçirmek|yakalamak|savaşmak	
sitzen	verb			Bei ARD und ZDF sitzen Sie in der ersten Reihe.	sit|fit	oturmak	
laufen	verb			Das Kind fängt bald an zu laufen.|Der Hund läuft hinter dem Auto her.	run|walk	koşmak|yürümek	bazdan
schreiben	verb			Er schrieb ein paar Zahlen an die Tafel.	write|store|touch-type	yazmak|kaydetmek	
schlagen	verb			Er schlug ihn brutal zu Boden.	beat|hit|knock|ring someone's bell	çırpmak	lê dan|lê xistin
gucken	verb			Du sollst ihr nicht unter den Rock gucken!	look|watch	seyretmek	
verlieren	verb			Ich habe meinen Autoschlüssel verloren.	lose|relinquish	kaybetmek	
blasen	verb			Sie blies kurz durch das Röhrchen.	blow|puff|suck off|blowjob	üflemek	
küssen	verb			Sie küssten sich innig.	kiss	öpmek	
ausrichten	verb			Wir müssen die Antenne auf den Satelliten ausrichten.	align|to align something with something|adjust|orient		
lernen	verb			Man lernt jeden Tag etwas Neues.	learn|study	öğrenmek	fêrbûn
retten	verb			Sie konnten gerade noch gerettet werden.|„Ausgeschaltete Lampen könnten dabei im Sommer ganze Insektenpopulationen retten.“	save|rescue|recover|escape		
vögeln	verb			Ich möchte gerne mit dir vögeln!|Jeden Mittwoch vögelte ich gern meine Frau.	screw|fowl		
stehen	verb			Er steht auf dem Teppich.	stand|be|stand still|suit	durmak|bulunmak|kalmak|olmak	
töten	verb			„Gestehen Sie, Sie haben ihn getötet. Sie sind der Mörder!“	kill	öldürmek	kuştin
sterben	verb			Er starb im Alter von 82 Jahren.|Vor drei Jahren starb mein Freund an den Folgen eines schweren Verkehrsunfalls.|Täglich sterben Kinder an Hunger.|[Schlagzeile:] „Arbeiter sterben früher als Beamte“|„Und Sarah starb in Kirjat-Arba, das ist Hebron, im Land Kanaan.“	die|perish|decease|depart	ölmek	mirin|çûn ber dilovaniya Xwedê|koça dawîn kirin|emrê Xwedê kirin
weinen	verb			Hast du schon wieder die ganze Nacht lang geweint?|Wein nicht, mein Schatz, alles wird wieder gut. Bitte nicht weinen!|Weinend lief Gernot aus dem Zimmer heraus.	cry|weep	ağlamak	girîn
sammeln	verb			Das Eichhörnchen sammelt einen Vorrat an Nahrung, um den Winter zu überstehen.	collect|gather|accumulate|concentrate		
klauen	verb			Sie klaut manchmal im Supermarkt.|Hast du das Armband geklaut?	rip sth. off|shoplift|snitch|steal		
fressen	verb			Der Spatz fraß mir aus der Hand.|Er frisst wie ein Schwein.	gorge|feed|eat|eat up something	otlamak|zıkkımlanmak|tıkınmak	
sieben	verb			Bei den Prüfungen der einzelnen Kanidaten wird kräftig gesiebt.	sift|sieve|shake out		
aufhören	verb			Ich höre auf zu rauchen.|Schon mal ans Aufhören gedacht?	cease|stop|quit|end	bırakmak	
schenken	verb			Sie schenkte ihm zum Geburtstag ein Buch.	give|donate|spare somebody|let off		diyarî kirin
reden	verb			Sie redet gerne über Politik.|Die Freunde redeten bis spät in die Nacht.|Florian redet viel, wenn der Tag lang ist.|Rede doch nicht solchen Unsinn!	speak|talk|utter|say	konuşmak	
packen	verb			Ich habe keine Zeit, ich muss noch packen!|Gepackt passt das Programm auf eine Diskette.	pack|grab|seize|get		
suchen	verb			Ich suche meinen Autoschlüssel.|Der Täter wird polizeilich gesucht.	search|seek|look for	aramak	lê gerîn|lê gerîyan
wollen	verb			verkürzt: Ich will morgen zum Friseur. (Ich will morgen zum Friseur [gehen]/[fahren].)|„Wolle nur was du sollst, so kannst du was du willst.“	want|wish	istemek	xwestin
anstellen	verb			Du musst die Leiter richtig anstellen.	employ|hire|accomplish|manage		
schaffen	verb			Im Anfang schuf Gott Himmel und Erde.	create|shape|make		
schaffen	verb			Ich habe mein Examen endlich geschafft!|Ich weiß nicht, wie ich das geschafft habe.|Bundeskanzlerin Angela Merkel: „Wir schaffen das!“ (Schlagwort der Flüchtlingskrise 2015)	make|manage|accomplish|complete		
lassen	verb			Man kann teures Mineralwasser trinken, man kann es aber auch lassen.	leave|stop|quit|give up		berdan
aufstehen	verb			Ich bin heute extra früh aufgestanden.	rise|get up|stand up|rise up		rabûn
unterhalten	verb			Mit ihren Liedern konnte sie die Leute den ganzen Abend unterhalten.|„Akrobaten unterhalten die Gäste mit ihren Kunststücken.“	entertain|talk|chat|propose		
unterhalten	verb			Der Pascha, den Erfolg voraussehend, wies Franz an, eine Schüssel unterzuhalten.	hold underneath		
anbieten	verb			Ich könnte dir einen Kaffee anbieten.	offer|propose|be suitable for		
schlafen	verb			Er war müde und schläft jetzt tief.|In dem neuen Bett schläft es sich gut.	sleep|stay at someones place|to stay over night|to stay the night	uyumak|gecelemek|geceyi geçirmek|sevişmek	razan|xew|xewraçuyîn
bekommen	verb			Ich bekomme den Lachs, mein Mann das Steak.	get|receive|be given		girtin
träumen	verb			Ich habe gestern Nacht etwas Seltsames geträumt.	dream	rüya görmek|düş görmek|hayal etmek	xewn dîtin
geben	verb			Er gibt seiner Freundin die Jacke.	give|there is|exist|be around	vermek	dan
ziehen	verb			Die Lok zieht 40 Güterwaggons.	pull tow|draw|steep|stand	çekmek|demlenmek	
lachen	verb			Ich lache immer, wenn jemand einen Witz erzählt.|Da kann ich nur lachen.|Man sollte darüber lachen können.	laugh|giggle	gülmek	kenîn
abnehmen	verb			Die Birnen sind reif. Wir müssen sie noch heute abnehmen.	take off|to remove|take down|to extract	almak|çıkarmak|üstlenmek|inanmak	
handeln	verb			Sie handelte sehr besonnen.	do|act|trade|deal		
handeln	verb			Wie sollen wir das jetzt handeln?|So eine Situation ist nie leicht zu handeln.|Und wie handelt man das Teil?			
kosten	verb			Diese Vase hat ihn sehr viel Geld gekostet.|Das hat die Familie einen großen Haufen Geld gekostet.|Das kostet zusammen 19,30 €.|Das kostet dich eine Runde!	cost	değmek|mal olmak	
kosten	verb			Koste doch mal meinen selbstgemachten Kuchen!	taste|get a taste of	tatmak	
verabschieden	verb			Ich verabschiede mich mit einer Umarmung von meiner Frau.|Ich muss mich heute schon zeitig verabschieden (= ich muss eher gehen).	say goodbye|take leave|see off|bid farewell		xatir xwestin
wirken	verb			Wir wirken für den Frieden und den Schutz der Umwelt.	work|operate|act|take effect		
überlegen	verb			Die Zeiten sind vorbei, als Lehrer ungehorsame Schüler überlegten.			
überlegen	verb			Er überlegte eine Zeitlang, wie er aus dem Schlamassel herauskommen sollte.|Sie sagte: „Das möchte ich mir nochmal überlegen, bevor ich entscheide.“	think something over|consider|ponder|contemplate	üzerine düşünmek	
spielen	verb			Kinder lernen am besten spielend.	play	oynamak|çalmak	lîstin
riskieren	verb			Er hat sein Leben für dich riskiert!	risk|hazard	riske etmek	
gewinnen	verb			Er gewann gegen den Titelverteidiger.|Möge der Bessere gewinnen!	win|gain|earn|profit		
fallen	verb			Nachdem er auf die Leiter stand, fiel er auf den harten Boden.|Wer hoch steigt, kann tief fallen.	fall|drop|decline|be killed in action		ketin
reiten	verb			Er ritt seit frühester Kindheit.|Peter kann nicht gut reiten.	ride|ride on horseback		
füttern	verb			Er füttert sein Meerschweinchen.	feed		
füttern	verb			Der Rock muss noch gefüttert werden.			
besuchen	verb			Gestern haben wir unsere Verwandten besucht.	visit|attend	ziyaret etmek	
leben	verb			Wir hatten Glück – es lebt.|Martin Luther lebte von 1483 bis 1546.|Sie ist 95 Jahre alt und krank und will nicht mehr leben.|Ich habe Krebs und werde nicht mehr lange zu leben haben.	live	yaşamak	jîn
ändern	verb			Wir änderten den Plan.	change|alter|vary	değiştirmek|değişmek	guhertin|guherîn
zahlen	verb			Ich glaube, da habe ich zu viel gezahlt.	pay	ödemek	
beobachten	verb			Der Typ da drüben beobachtet mich schon die ganze Zeit.|Auf der Außenalster wurde ein Eistaucher beobachtet.	watch|supervise|observe|study	gözetlemek|gözlemek|tarassut etmek	çavdêrî kirin
einen	verb			Trotz aller Gegensätze einte sie doch die Ablehnung des alten Regimes.	unite		
reisen	verb			Statt hier zu bleiben würden wir lieber weiter reisen.|Wir reisen morgen nach Tunesien.|Sie ist eine ganze Zeit lang durch die Welt gereist.|Welch ein Luxus, die Welt reisend erleben zu dürfen.|„Sechs Jahre ist Claudio Sieber durch Asien gereist.“|„In der Stadt und ihrer Umgebung kann mit Taxen gereist werden.“|„Wer viel reist, trifft auch auf viele fremde Sprachen.“	travel	yolculuk yapmak	
sind	verb			Joachim Ringelnatz: An Land: "Wir sind betrunken wie die Wellen"			
finden	verb			Ich habe den Schlüssel gefunden!|Auf der Straße habe ich gestern einen Ring gefunden.|Im ganzen Haus konnten wir niemanden finden.	find|think	bulmak	
sagen	verb			Er sagte: „Pass auf!“	say|tell	demek|söylemek	gotin
riechen	verb			Mit meinem Schnupfen rieche ich überhaupt nichts.|„Ich konnte das Harz der Pinien neben dem Bootshaus riechen.“	smell|reek	koklamak|koku duymak|kokmak	
schmecken	verb			Seit dem Schlag auf den Kopf kann sie nicht mehr schmecken.|Ich schmecke eine Prise Senf in der Salatsoße.	taste|smack|like|smell		
singen	verb			Der Gefangene hat gesungen. Nun wurde auch sein Komplize festgenommen.	sing|squeal|rat	şarkı söylemek|ötmek	
bringen	verb			Der Briefträger bringt mir einen Brief vom Gouverneur.|Mama bringt jeden Tag das Essen.|Sie bringt seinen Freund nach Hause.|Der Mann wurde zur Polizei gebracht.	bring|take	getirmek	anîn
tragen	verb			Er trug schwer an dieser Last.	carry|wear|drag|yield		
vorstellen	verb			Darf ich mich vorstellen?	put in front|move forward|introduce oneself|introduce someone	öne koymak|kendini tanıtmak|tanıştırmak|tasvir etmek	
brennen	verb			Die Flammen schlugen von der brennenden Scheune auf das Haus über.	burn|be lit|distil bootleg	yanmak	
kennen	verb			Ich kenne die Gegend.|Ja, ja - ich kenne das schon.	know	bilmek|tanımak	
beginnen	verb			Morgen beginne ich mit der Therapie.|Wir beginnen die Reise in Cuxhaven.|Wir dachten am nächsten Wochenende mit den Übungen zu beginnen.	begin|start|commence	başlamak	dest pê kirin
bewegen	verb			Die Wellen bewegen das Schiff.|Sie bewegte nur den kleinen Finger.|Der Magnet bewegt das Eisen auf sich zu.|Er bewegt seine Arm hoch und runter.	move|agitate	yer değişmek|yer değiştirmek|hareket etmek|düşündürmek	
bewegen	verb			Die Finanzlage bewog ihn zu einer raschen Entscheidung.	induce		
wenden	verb			Um richtig zu wenden, muss man schon einige Segelkenntnisse besitzen.	turn|turn . put about|turn to|address	dönmek|başvurmak|müracaat etmek|yönelmek	
fahren	verb			Ich fahre morgen nach Paris.|Ich fahre gerne mit der Bahn.	cart|to ride|to drive|to go by vehicle	gitmek|gezdirmek|infilak etmek	
betrügen	verb			Er betrügt uns, sobald er den Mund aufmacht.	betray|deceive|fool|trick	aldatmak|dolandırmak|kandırmak	xapandin
tun	verb			Was ihr sagt oder tut, ist mir egal.|Ich würde alles dafür tun.|All dies tat ich für Euch!	do|put|work|act	yapmak	kirin
tun	verb			Tut er noch schlafen? (schläft er noch?)			
erfahren	verb			Ich habe im Leben viel Gutes und Böses erfahren.	experience|learn|find out	deneyimlemek|tecrübe etmek|öğrenmek	
übertragen	verb			Er hat sein Amt an einen Unbekannten übertragen.|Mir wurde die Verantwortung übertragen, und ich drücke mich nicht vor ihr.	transfer|transmit|infect|transform		
leeren	verb			Und er leert den Krug in einem Zug – (Ralph Siegel)	empty		vala kirin
rücken	verb			Er rückte den Stuhl in die Ecke.	move|push|draw|proceed		
pinkeln	verb			Ich muss mal ganz dringend pinkeln. Wo ist die Toilette?|Wer behauptet, ich pinkele im Garten, lügt.|Wer behauptet, ich würde im Garten pinkeln, lügt.|„Erleichtert pinkelte Bobby gegen die Tür.“	pee|urinate	işemek	
behaupten	verb			Ich behaupte, ich hätte gestern den Mount Everest bestiegen.|Ich behaupte, Jesus ist Gott.	claim|maintain|allege|assert		
zwingen	verb			Die Wachen zwangen die Erschöpften, weiterzugehen.	force|to compel		
anziehen	verb			Ich weiß nicht, was ich anziehen soll.	put on|attire|dress|attract		li xwe kirin|lê kirin
tanzen	verb			Wir tanzten die ganze Nacht hindurch.	dance	dans etmek	
glauben	verb			Er glaubt an Gott.	believe in|believe|suppose|trust	inanmak	bawer kirin
mögen	verb			Das mag ja sein.|Es mochten wohl dreißig Gäste bei Jürgens Feier gewesen sein.|Hinz und Kunz, Jansen und Thomsen und wie sie alle heißen mögen.	may		
mögen	verb			Henner mag gern Rinderhirn und klassische Musik.|Da ich mein Butterbrot nicht essen mochte, gab ich es dem Hund.|Du bist so süß, man muss dich einfach mögen.	like		
betrachten	verb			Wollen wir meine Briefmarken betrachten?|Wir sollten das genauer betrachten.	look at|observe|gaze at|regard	bakmak|göz atmak|ele almak|saymak	
holen	verb			Ich geh' mal eben Zigaretten holen.|Geh lieber die Kinder aus dem Kindergarten holen.	get|fetch|breathe in|take a breath		
atmen	verb			Er atmet sehr schnell.|Noch atmet die Patientin.	breathe|respire	nefes almak	
fühlen	verb			Er bekam den Stock zu fühlen.|Er fühlt sein Herz bis zum Hals schlagen.|Sie fühlte die Rippen des Hundes durch das struppige Fell.	feel|sense		
rennen	verb			So schnell wie Maik rennt niemand bei uns in der Klasse.	run|race|sprint	koşmak	
schwimmen	verb			„Wildenten schwammen weitab vom schützenden Schilfrand im See.“|„Da stehen riesige Pfützen, tief genug, daß die Vögel darin schwimmen.“	swim|bathe|go swim|convey by water	yüzmek	
ankommen	verb			Hier ist es schwierig, gegen die Strömung anzukommen.	arrive|climatize|climatise|acclimatize		
laden	verb			Pass auf, das Gewehr ist geladen!	load|download|charge	yüklemek	
laden	verb			Zu diesem Empfang sind 500 Gäste geladen.|Wir laden zum Tee.	invite|summon|summons	davet etmek	
wachsen	verb			Kleine Kinder wachsen schnell.|Seine beiden Hunde sind in letzter Zeit ziemlich gewachsen.|Das rasant wachsende Unkraut muss gejätet werden.	grow|increase	büyümek	
wachsen	verb			Die Möbel wurden nicht lackiert, sondern gewachst.	wax		
waschen	verb			Hat jemand einen Tipp, wie man Schwarzgeld weiß waschen kann?	wash	yıkamak	
baden	verb			Er badet sein Baby jeden Abend.|Ich soll die Wunde baden.|Der Krankenpfleger badete den alten Herren.|Kleopatra soll in Milch und Honig gebadet haben.	bathe|take a bath|have a bath|swim		
springen	verb			Sie springt zwei Meter hoch.	jump|leap|spring|dive	sıçramak|atlamak|ortaya çıkmak|fışkırmak	
prüfen	verb			Ob die Aussage richtig ist, bleibt zu prüfen.	check|validate|examine|assess	denemek|test etmek|imtihan etmek|sınamak	
testen	verb			Ob das funktionieren kann, müssen wir noch testen.|„Stiftung Warentest hat verschiedene Balkonkraftwerke getestet. Das sind die Ergebnisse.“	test|trial	denemek	
überprüfen	verb			Ob der Apparat weiterhin funktioniert, muss noch überprüft werden.	check|recheck|review		
merken	verb			Hast du gemerkt, dass dein Sohn raucht?|Plötzlich merkte ich, dass ich eine Tochter habe.|Ich habe gemerkt, dass du rauchst.	notice|realize|keep in mind|memorize		
werden	verb			Dein Gesicht wird rot.|Es wird langsam dunkel.|Wenn er wütend ist, wird er zum Berserker.	become|get|grow|will	olmak	bûn
helfen	verb			Lass mich dir helfen, dann geht es schneller.|„Der Rabe Ralf, dem niemand half, half sich allein.“|Dumm kann der Mensch sein, er muss sich nur zu helfen wissen.|Bakterien helfen uns in unserem Darm beim Verdauen.|„Norwegen will der Ukraine mit umgerechnet fast einer Milliarde Euro helfen.“	help	yardım etmek	
sondern	verb			Im Dualen System werden die Wertstoffe vom Müll gesondert.	separate	ayıklamak|ayırmak	
teilen	verb			Der Bug teilt das Wasser.|Meine Mutter teilt die Torte gewöhnlich in zwölf gleich große Stücke.	divide|part|share	bölmek|paylaşmak	
kommen	verb			Soll ich zu euch kommen?	come|arrive|advance|return	gelmek	hatin
schreien	verb			Er schrie vor Schmerz.	cry out|shriek|scream|yell	bağırmak|haykırmak	
schauen	verb			Auf die Straße schauen.	look|gaze|view|see	bakmak|dikkat etmek|çalışmak	
kümmern	verb			Sie kümmern sich um ihr Kind.	look after|take care of|worry about|pay attention to		
nehmen	verb			Er nahm den Löffel aus der Tasse.	seize|take|have	almak|tutmak	
annehmen	verb			Ich nehme an, hier geht es zum Hauptbahnhof.|Angenommen, die Erde sei eine Scheibe; dann …	assume|premise|suppose|receive	varsaymak|teslim almak|kabûl etmek|almak	
tauschen	verb			Die Nachbarn tauschten ihre Grundstücke. Die Kinder tauschen Spielsachen.	exchange|swap|change		
leihen	verb			Sie leiht ihm eines ihrer Bücher für kurze Zeit.	lend|borrow		
rauchen	verb			Er raucht eine Zigarette.	smoke		
öffnen	verb			Ich öffne die Tür.|„Allgemein gilt: Blasen nicht öffnen.“	open	açmak	vekirin|vebûn
anlegen	verb			Heute habe ich das Inhaltsverzeichnis angelegt.	create|apply|put sth. on|take someone on	yaratmak|yatırım yapmak|demirlemek|nişan almak	
schießen	verb			Er schoss, ohne darüber nachzudenken, wohin.	shoot	ateş etmek|vurmak|fırlamak|fotoğraf çekmek	
passieren	verb			Wir haben soeben die Landesgrenze passiert.|„Südirland war bei gutem Wind passiert worden.“	pass|cross|strain|filter	vuku bulmak	
wechseln	verb			Die Farben wechselten ständig.|Ich habe häufig wechselnde Arbeitszeiten.	change|vary|exchange		
verschwinden	verb			Die Schmerzen verschwanden so schnell wie sie gekommen waren.	disappear|vanish|be lost|get lost		ji holê rabûn
rechnen	verb			Klaus rechnet gerade Aufgabe 2b aus dem Mathematikbuch.	calculate|compute|reckon|work out	hesaplamak|öngörmek	
ehren	verb			Du sollst Vater und Mutter ehren!	honor		
hinterlassen	verb			Ich habe einen Eindruck hinterlassen.|Sie verließen den Rastplatz und hinterließen sehr viele Plastiktüten.|Online hinterlässt man immer Daten. Diese bleiben dort lange Zeit gespeichert.	leave leave behind|leave		
benötigen	verb			Ich benötige unbedingt einen neuen Plattenspieler.|Wir benötigen dringend eine Aushilfe.|Sie bestellten nur so viel, wie an einem Tag benötigt wurde.	require|need|take		
stöhnen	verb			Die Patientin stöhnte vor lauter Schmerzen.|Er stöhnt vor Lust.	moan		
aufgeben	verb			Diese Mühle wurde schon vor Jahren aufgegeben.	give up|relinquish|assign|give		
decken	verb			Ich hoffe, wir kriegen vor dem Regen das Dach gedeckt.	cover|roof|tile|lay		
treten	verb			Beim Tanzen trat er ihr auf die Füße.	step|tread|pedal|kick	basmak|çevirmek|gitmek|akmak	
verlieben	verb			Er hat sich Hals über Kopf in sie verliebt.|Ich bin in dich verliebt.	fall in love		
raten	verb			Ich rate dir dazu, die Chance zu ergreifen.|Er riet ihm gut zu.	advise|give advice|guess		
raten	verb			„Geratet werden die Vergleichswerte zum Zeitraum zuvor.“	rate		
fliehen	verb			Wenn das Hochwasser kommt, müssen wir fliehen.|„Die Wagenburg hatte den Vorteil, dass die Kämpfenden schwerer fliehen konnten.“	flee		
bedenken	verb			„Man muss bedenken, welche Sanktionen Abweichlern von der Linie des Nationalsozialismus drohten.“	consider|give|reflect		
geschehen	verb			Auf dem Heimweg geschah ein Unfall.	happen|occur		qewimîn
bauen	verb			Klaus baut ein Haus.|Hier soll eine Umgehungsstraße gebaut werden.|Obermanns wollen sich eine kleine Windmühle bauen.|Kevin hat eine Sandburg gebaut.	construct|erect|build|rely		lê kirin
vergessen	verb			Unglücklicherweise vergaß er ihrer nach all den Jahren. (veraltend)	forget|forget oneself		ji bîr kirin
anhalten	verb			Bei roten Ampeln sollte man im Straßenverkehr anhalten.	urge|stop|hold on|place against		
kotzen	verb			Mir ist schlecht, ich glaube, ich muss gleich kotzen.|Vorher kotzte der Wal Blut und hatte braunen Abfluss an seinem Anus.	spew|vomit|puke|barf		
rufen	verb			Das Kind rief nach seiner Mutter.|Ich glaube, wir müssen doch einen Notarztwagen rufen.	call|summon|shout|cry	bağırmak|haykırmak	
legen	verb			Ich lege ein Buch auf den Tisch.	lay|put|deal the Skat|castrate	yatırmak|yumurtlamak|döşemek|hadım etmek	
fragen	verb			Ich frage nach dem Weg.|Du fragst sie nach der Uhrzeit.|Er fragt sie, ob sie möchte.|„Dann frägt man nicht mehr, man weiß Bescheid.“	ask enquire|wonder	sormak|sual etmek	pirsîn
befragen	verb			Der Richter befragte die Zeugen.	ask|question|consult|query		
erhalten	verb			Der Empfänger erhielt ein Paket von einem Boten.|Der Sklave erhielt Schläge für seinen Ungehorsam.|Der Schüler erhielt schlechte Bewertungen.|„Ich habe einen dreiwöchigen Grundkurs erhalten, mehr nicht!“	get|obtain|receive|achieve	almak|erişmek|korumak|muhafaza etmek	
führen	verb			Der Knappe führt das Pferd in den Stall.|Wenn ich ihn durch den Irrgarten führe, was bekomme ich dafür?|„Seine erste Reise führte Olaf Scholz nach Senegal, Niger und Südafrika.“	lead	götürmek|kullanmak|sallamak|bulundurmak	
sollen	verb			Ich soll Wasser holen.|„Du sollst nicht stehlen.“	shall|should		vîn
bilden	verb			Fasst euch an den Händen, wir bilden einen Kreis.|Damals bildeten wir eine außerparlamentarische Gruppe.|Vor Jahrmillionen bildeten sich die Alpen.	form|educate		
befinden	verb			Der Tresor befindet sich hinter dem Bild im Wohnzimmer.	be located	bulunmak	li ... bûn
heiraten	verb			„Sie mussten heiraten, sie ist schwanger.“|Geheiratet hat Vestre erst mit 57.|„Geheiratet haben die beiden 1989, kurz nach dem Tiananmen-Massaker.“	marry|get married|wed	evlenmek	mêr kirin
antworten	verb			Ich kann dir auf deine Frage nicht aus dem Stegreif antworten.	answer	cevap vermek|cevaplamak|yanıt vermek|yanıtlamak	bersiv dan
bestehen	verb			Er hat die Prüfung bestanden.|Nur der bußfertige Mann wird bestehen. (Filmzitat)	succeed|pass|consist|insist	geçmek|oluşmak|ısrar etmek|dayatmak	
erreichen	verb			Ich kann den Ast nicht erreichen.|Er erreichte den Zug in letzter Sekunde.|Die Kugel erreichte den fliehenden Schurken nicht.|Das Kind erreicht heute das Alter von einem Jahr|Trotz ihrer leidenschaftlicher Bemühung erreichte sie nicht sein Herz.	reach|acquire|achieve|accomplish		
stellen	verb			Er stellte die Vase auf den Tisch.|Das Kind stellte sich auf den Stuhl.|Der Besen wurde in den Schrank gestellt.|Das Model stellte sich in Positur.	place|put|stand|adjust		
bedeuten	verb			Das englische Verb „to know“ bedeutet auf Deutsch soviel wie „wissen“.	mean		
ausruhen	verb			Nach dem Fünftausendmeterlauf werde ich mich zunächst ausruhen müssen.	rest		
zeigen	verb			Darf ich Ihnen meine Briefmarkensammlung zeigen?	show|present|indicate|demonstrate	göstermek	
dienen	verb			„Womit kann ich Ihnen dienen?“|Seine emsigen Studien dienten seiner späteren Karriere.	serve|be useful|help|be on active service	hizmet etmek|görevini görmek|faydasi dokunmak|yaramak	
bleiben	verb			Der Mann blieb zu Hause.|Die Vase bleibt auf dem Tisch!	stay|last|remain		
besitzen	verb			Ich besitze ein Haus, auch wenn es der Bank gehört.	own|possess		
existieren	verb			Darüber existiert ein Gesetz.	exist	var olmak	hebûn|heyî bûn
dürfen	verb			Mama, darf ich morgen ins Kino gehen?|Das dürfen wir auf keinen Fall tun, das ist doch verboten!	may|allowed		
halten	verb			Ich halte dich fest im Arm.|Wie kann ein Zeppelin es schaffen, sich in der Luft zu halten?|„Er hielt die Pistole an Seans Schläfe.“|„Er konnte das Wasser nicht halten.“	hold|keep|maintain|consider	tutmak|beslemek|farzetmek	
erkennen	verb			Sie erkannte Peter erst, als er direkt vor ihr stand.	recognize|recognise|spot|identify	algılamak|idrak etmek|ayırdetmek	
vertreten	verb			Die kranke Frau Klein wurde heute von Herrn Gross vertreten.	represent|substitute|stand in|support	temsil etmek	
stammen	verb			Ich stamme aus Italien.	come from ; to originate|to stem|date from|to stem ; to be descended		
zählen	verb			Horst zählt die leeren Bierflaschen auf seinem Küchentisch.	count|rank	saymak|arasında sayılmak|-den meydana gelmek|-dan oluşmak	
brauchen	verb			Ich gehe einkaufen. Brauchen wir noch Milch?	need|use		
bieten	verb			Ich biete dir einen mehr als adäquaten Ersatz für dein altes Fahrrad.|Was bietest du mir dafür?|Dieser Raum bietet genügend Platz für Großveranstaltungen.	offer|oppose|allow|accept		
ergeben	verb			Eins und eins ergibt zwei.	result in|to yield|to produce|occur		
erscheinen	verb			Kurz vor Mitternacht erschien ihm ein Engel.	appear|turn up|publish|be released		
verwenden	verb			Die Worte, die ich verwendete, schienen mir angemessen.|Ich konnte mein Fahrrad wieder verwenden.|„Nur für obergärige Biere darf Weizen anstelle von Gerste verwendet werden.“	use|utilise|apply to sth.|employ	kullanmak	
verlassen	verb			Er verließ das Haus wie jeden Werktag um sieben Uhr.|„Junge Frauen verlassen Ostdeutschland in Scharen.“	abandon|leave|quit|forsake		
verhindern	verb			Wie kann man Unfälle verhindern?	prevent|inhibit|avert	önlemek|engel olmak	rê li ber girtin|pêşî lê girtin|ber girtin
entwickeln	verb			Wir müssen dafür ein neues Konzept entwickeln.|„Die modernen Menschen entwickelten in der oberen Altsteinzeit mehrere aufeinanderfolgende Kulturen.“	develop|devise|evolve|develop a photo	geliştirmek	
setzen	verb			Sie setzte ihren Teddybären aufs Sofa.	sit|seat|sit down|settle down		
studieren	verb			Ich habe Medizin studiert.|Immer weniger junge Menschen studieren.|Sabine studiert seit vier Semestern Psychologie und Soziologie in Wien.	study		xwendin
nutzen	verb			Sabine nutzt täglich den Bus, um ohne Stress zur Arbeit zu kommen.|Das Angebot, bei den Schmidts im Auto mitzufahren, sollten wir nutzen.|„Verstärkt genutzt werden könnten Blogs, Foren und Soziale Netzwerke.“	use|utilise|utilize|employ		
angeln	verb			„Heute gehe ich angeln.“	angle|to fish		
versuchen	verb			Man sollte es wenigstens versucht haben.	try|tempt|taste		
treffen	verb			Sie am Wochenende zu treffen ist schwierig.	meet|hit|affect		
interessieren	verb			Es gelang ihm, Peter für das Projekt zu interessieren.|Das Schicksal dieser Leute interessiert doch keinen!	interest		
folgen	verb			Sie ist mir bis zum Bahnhof gefolgt.|Der Hund folgt ihm auf Schritt und Tritt.|Folgen Sie dem Taxi da!	follow|ensue		
versehen	verb			Er versah alle seine Ämter mit Hingabe.	provide|supply|give sth. sth.|occupy		
nennen	verb			Sie wollen ihren Sohn Pius nennen.|Vielleicht solltest du diese Skulptur „Nekromania“ nennen.|Ich nenne meine Katze Sina.	name|call|mention	demek|adlandırmak	
auftreten	verb			Falls Anzeichen einer Entzündung auftreten, kommen Sie sofort in meine Praxis.|„Beim Messaging-Dienst Whatsapp ist eine weitreichende Störung aufgetreten.“|„An der russischen Ölpipeline Druschba ist auf polnischer Seite ein Leck aufgetreten.'“	appear|occur|act|treat	ortaya çıkmak|meydana gelmek|belirmek|davranmak	
beenden	verb			Doch Goethe will sein Rechtsstudium beenden und nimmt seine Kräfte zusammen. (Internetbeleg)|„Ohne weitere Störung beendeten sie den Unterricht.“	end|finish|complete|terminate	sonlandırmak	
stehlen	verb			Ein Dieb stahl letzte Woche ein wertvolles Collier.	steal|steal away|sneak	çalmak	dizîn
werfen	verb			Er wirft den Ball ziemlich weit.	throw|hurl|give birth|warp		avêtin
regen	verb			Peters Finger waren so kalt, dass er sie kaum regen konnte.|Das Kind regte sich im Schlaf.	stir|move	kımıldamak|kıpırdamak|tezahür etmek	livîn
schneiden	verb			Der Friseur schneidet die Haare mit der Schere.|Der Nonnenmacher schneidet die Ferkel.	cut|tap	kesmek|ayırmak|kesişmek|görmemezlikten gelmek	jêkirin
danken	verb			Marie dankte Familie Lehmann für ihre Gastfreundschaft.|Peter hat Michaela mit einem großen Blumenstrauch gedankt.|mit Akkusativobjekt, formelhaft: „[E]r hat ihm seine Hilfe schlecht gedankt[.]“	thank		
fassen	verb			Er fasste sie um die Taille.	seize|grasp|grab|catch	kavramak|sıkıca tutmak	
erklären	verb			Kannst du mir das nochmal erklären?|Die Theorie musst Du mir bei einem Kaffee mal etwas genauer erklären.|Wie erklärst du die Erscheinungen am Himmel?	explain|declare|announce|state	açıklamak	
klingen	verb			Gläser klingen, wenn man sie gegeneinander stößt.	ring|clink|sound		
putzen	verb			Ich müsste dringend Fenster putzen.	clean|plaster|render	temizlemek|sıvamak	
verbergen	verb			Wo verbirgt sich Osama Bin Laden?|Die Katze verbirgt sich hinter dem Sofa.	hide|conceal|suppress	saklamak|gizlemek|göstermemek	
benutzen	verb			Auf dem Laptop benutze ich das Betriebssystem eines bekannten Herstellers.|Siehst du nicht, dass er dich nur benutzt!|Oh, diese Gabel ist schon benutzt.|Meine Chefin benutzte ständig Fachbegriffe.|Darf ich mal Ihre Toilette benutzen?	use|utilize	kullanmak	
berühren	verb			Er berührt behutsam die Schneide des Messers.|Für den Bruchteil einer Sekunde berührten sich die Finger der beiden.	touch|address|to touch on		
lächeln	verb			Anna lächelte nur, als sie seine Worte hörte.	smile|grin		
lügen	verb			Ich will ja nicht lügen, aber 200 Leute waren bestimmt da.	lie	yalan söylemek	derew kirin|vir kirin
beten	verb			In der Not beten viele Menschen.|Ich bete, dass die beiden wieder heil nach Hause zurückkommen.	pray	dua etmek	
heilen	verb			Die Ärzte konnten sie vollständig heilen.	heal|cure		
treiben	verb			Sie trieben die Gefangenen in eine Scheune.|Du treibst mich noch in den Wahnsinn.	drive|bring forth|float|drift	sürmek|açmak|yeşermek|açtırmak	
freuen	verb			Maria freut sich, Peter endlich wiederzusehen.	be happy|be pleased|rejoice|be glad	mutlu olmak|memnun olmak	
müssen	verb			Jeder Mensch muss sterben.|Der Mensch muss sein Gehirn gebrauchen, sonst verblödet er.|„Ich habe es nicht müssen, aber ich habe es getan: …“	must|have to		
schätzen	verb			Er schätzte ihr Alter auf 21 Jahre.|Die Expertin schätzte den Wert auf 500 €.	estimate|to assess|to guess|guess		
entlassen	verb			Die Klassenlehrerin entließ ihre Schüler heute früher nach Hause.|Er entließ mich mit der Bitte, morgen um dieselbe Zeit wiederzukommen.	dismiss|release|discharge|fire	çıkmak|serbest kalmak|çıkış yapmak	
heißen	verb			Er hieß mich einen Dummkopf.|Einen in aller Öffentlichkeit Dummbatz geheißenen Ehemann kann man nur bedauern.	be called|be named|call|mean	adı olmak|ismi olmak|ad vermek|isim vermek	navê ... bûn
heißen	verb			Wenn Wind aufkommt, werden wir die Segel heißen.			
versprechen	verb			Er ist ein viel versprechender junger Politiker.	promise|pledge|misspeak|mispronounce		
besprechen	verb			Man sitzt im Konferenzzimmer und bespricht das neue Projekt.|„Auf dem Thing besprechen sie Gesetze, schlichten Streitigkeiten in ihrer Region.“	discuss|review		
versagen	verb			Der Trainer hat doch auf der ganzen Linie versagt.|Die Sicherheitsmaßnahmen haben versagt.	fail|deny|abstain		
anfassen	verb			Er wagte es nicht, die glühend heißen Kohlen anzufassen.|Oh, wie niedlich die Welpen sind! Darf man die mal anfassen?	touch		
freien	verb			Der alte Graf freite die schöne Tochter des armen Bauern.	court		
einstellen	verb			Auf Grund des heftigen Schneefalles musste der Flugbetrieb vorübergehend eingestellt werden.	employ|hire|appoint|adjust		
heben	verb			Mit einem Kran kann man schwere Lasten heben.	lift|raise|hold	kaldırmak|yükseltmek|ilerletmek	
drehen	verb			Der Kreisel dreht sich immer langsamer, bis er umkippt.	turn|spin|twist|shoot	döndürmek|çevirmek|dönmek|film çevirmek	
schieben	verb			Hilf mir mal, das Auto von der Straße zu schieben.	push|shove|impute	itmek	
verarschen	verb			„Verarschen kann ich mich selber!“|„Willst du mich verarschen?“|„Wir alle verarschten uns selbst.“	fool|trick|taunt		
hassen	verb			Sie hassen die Unzuverlässigkeit und Schlamperei Ihrer Mitarbeiter? (Internetbeleg)	hate|mob		
verkaufen	verb			Ich verkaufe mein Auto.	sell|make a bad buy	satmak	firotin
leiden	verb			Sie litt lange Zeit unter schlimmen Kopfschmerzen.|Wir leiden mit dir.|„Für Hafermilch leiden keine Kühe.“	suffer|put up with|tolerate	acı çekmek	
telefonieren	verb			Sei gefälligst still, ich telefoniere gerade!|Am besten wird es sein, wenn wir morgen noch einmal miteinander telefonieren.|In einer fremden Sprache zu telefonieren ist besonders schwierig.|„Redakteurin und Informant mailten und telefonierten.“	telephone	telefon etmek	
zurückkommen	verb			Um auf die Frage zurückzukommen …	return|come back|get back	geri dönmek|ele almak	
albern	verb			Am liebsten albert er mit den Enkelkindern.	play up		
hängen	verb			Ich hänge die Lampe zwischen die zwei Bilder.|Ich hängte die Lampe an einen Haken am Türpfosten.	hang|pend|impend		
hängen	verb			Die Lampe hängt zwischen den zwei Bildern.|Die Lampe hing am Balken im Stall.|[Schlagzeile:] „Energiepreise zu hoch: Apfelbauern lassen viele Äpfel hängen“|Der Mörder hing am Galgen.	hang|be fond of|love		
täuschen	verb			Beim Kauf des Gebrauchtwagens wurde ich arglistig getäuscht.	deceive|mislead|delude|be mistaken		
lösen	verb			Die Rechenaufgaben konnte er bei bestem Willen nicht lösen.	resolve|solve|buy|dissolve	çözmek|halletmek|almak|ayırmak	çareser kirin
bergen	verb			Das Wrack konnte noch immer nicht geborgen werden.|Die Besatzung konnte nur noch tot geborgen werden.	save|salvage|recover|shelter		
einfallen	verb			[Im Dreißigjährigen Krieg sind die] „Soldaten wie Heuschrecken über die Region eingefallen.“	intrude|occur to someone|remember|come to mind		
scheiden	verb			Silber scheidet man von Kupfer und Blei durch Schmelzen.	separate|divorce		
starten	verb			Zu Beginn der Sommerferien starten viele Familien ihren Urlaub.|Wir haben ein neues Projekt gestartet.	start	başlamak|çalıştırmak	
starten	verb			Ich bin dieses Jahr zum ersten Mal bei den Senioren gestartet.|Die Rakete startete um acht Uhr MEZ.	start		
entfernen	verb			Laura entfernte das Haargummi.|Hilfst du mir, die Flecken vom Teppich zu entfernen?|Bitte entfernen Sie vor der Montage die Transportsicherungen.	detach|remove|extirpate|deprive	çıkarmak|kaldırmak|uzaklaşmak	
stimmen	verb			Seine Gitarre ist schlecht gestimmt.	tune|vote|be correct|be spot on		
schließen	verb			Hinter ihm schloss sich der Vorhang.|Der Reißverschluss schließt nicht mehr.|Und hier schließt sich der Kreis.|„Israel schließt seine Botschaft in Dublin.“	shut|close|fasten|conclude		
malen	verb			(bildlich) Der Herbst malt die Wälder bunt.	paint|colour|color|calligraph	malca|boyamak|resim yapmak	
verhungern	verb			In der belagerten syrischen Stadt Madaja verhungern weiterhin Menschen.	famish|starve		
verhaften	verb			Die Polizei verhaftet den Erpresser.	arrest seize		girtin
schalten	verb			Jetzt hat er endlich geschaltet!|Es war ein Glück, dass sie so schnell geschaltet hat.|Da muss man doch sofort schalten!	shift|change|switch|get the idea	değiştirmek|çevirmek|düşmek|kavramak	
diskutieren	verb			Über dieses Thema müssen wir diskutieren.	discuss	görüşmek	
erinnern	verb			Ich erinnere mich noch genau daran, als du …|Ich erinnere mich an dich.	remember|remind		
aufhalten	verb			Das Einsatzkommando konnte gerade noch rechtzeitig aufgehalten werden.	balk|block|hinder stop|delay	durdurmak|kalmak	
ruinieren	verb			Er hat sich durch seine Spielsucht ruiniert.	ruin		
besiegen	verb			Ich habe ihn im Tennis besiegt.	beat|defeat|bag|overcome	yenmek|kontrol altına almak	binketî kirin
heiligen	verb			Heiligt der Zweck wirklich alle Mittel?|Der Erfolg heiligt im Nachhinein eben doch den eingeschlagenen Weg.	holy		
wünschen	verb			Sie wünscht sich ein Kind.|Du wünscht dir aber einen vernünftigen Rat, was du heute tun sollst.|Ich wünsche, nicht gestört zu werden.	wish|will|want|desire		xwestin|daxwaz kirin
planen	verb			Die Flucht war sorgfältig geplant.	plan|contrive		
rächen	verb			Diese frevelhafte Tat musste gerächt (gerochen) werden.|Jedes Verbrechen wird irgendwann gerächt.	avenge|revenge|avenge oneself|revenge oneself	öç almak	
bezahlen	verb			Für den Stapel Bücher hat er ihr 50 Euro bezahlt.|Er war bereit, diesen hohen Betrag zu bezahlen.|Für deine hervorragenden Leistungen möchte ich dir 10 Euro bezahlen.	pay		
aufnehmen	verb			Ich sollte den Suchbegriff in das Verzeichnis aufnehmen.|Das ist ein interessanter Gedanke, den sollten wir unbedingt aufnehmen.	pick up|take up|include|begin		
verstecken	verb			Zu Ostern werden bemalte Eier und kleine Geschenke versteckt.|Wo hast du denn mein Notizbuch schon wieder versteckt?|Mit deinen Fremdsprachenkenntnissen brauchst du dich nun wirklich nicht zu verstecken.|„Die engschäftige Uniform versteckte er im Kegelschub.“	hide		veşartin
üben	verb			Ich übe jeden Tag zwei Stunden Klavier.|Mit dieser Handschrift muss dein Sohn noch Schreiben üben.|„Ich empfehle, die Prozedur vorher an einem Abfallstück zu üben!“	exercise|practice|train|do	alıştırma yapmak	
füllen	verb			Ich fülle eine Flasche mit Wasser.|Wir könnten die Ente mal mit Äpfeln und Nüssen füllen.	fill	doldurmak	
leiten	verb			Die Autokarawane wurde in Richtung Strand geleitet.	manage|lead|conduct		
beißen	verb			Der Nachbarshund hat mich gebissen.	bite|burn|itch	ısırmak	
zerstören	verb			Streptokokkus ist ein Bakterium, das Zähne zerstört.|Durch den Bombenkrieg wurden viele Städte zerstört.|„Torf wird in Mooren abgebaut, die so unwiederbringlich zerstört werden.“	destroy		
klopfen	verb			Seit sie ausgebombt wurde, klopft ihr Herz Synkopen.|Erfolgt die Verbrennung bereits vor dem Arbeitstakt klopft der Motor.	knock|tap|beat|thump	çalmak	
einsetzen	verb			Wir sollten ihn als Leiter der Kommission einsetzen.	appoint|use|give|employ		
behalten	verb			Behältst du den Hund?	keep|remember		
ahnen	verb			Oi, Oi, sie ahnte, was da kommen würde.	suspect ; to guess|guess		
bestätigen	verb			Die Untersuchungsergebnisse bestätigen unsere Vorhersagen.	confirm|authenticate		
verbinden	verb			Bitte hilf mir mal, mein Bein zu verbinden.	bandage|associate|connect|unite	sarmak|birleştirmek|bitiştirmek|birleşmek	
zustimmen	verb			Dem kann ich nur vorbehaltlos zustimmen.	agree with	onaylamak|beyanı kabul etmek|muvafakat etmek	
ausziehen	verb			Die Blütenmischung muss dann ungefähr drei Wochen ausziehen.	pull out|draw|extract|bleach		
wählen	verb			Ich wähle diese Hose da, die mit der Bügelfalte.|Ich verstehe nicht, warum diese nette Frau diesen blöden Kerl gewählt hat.|»Welchen Wein wählen sie zum Fisch?«|»Wählst du den günstigeren Bummelzug oder den schnellen ICE?«|Ihr habt nur zwei Möglichkeiten, zwischen denen ihr wählen könnt!|Ich habe mir Rosa Luxemburg zum Vorbild gewählt.	choose|select|adopt|dial	aramak	
spenden	verb			Kathrin hat Blut gespendet.|Wir spenden für Afrika!|„Sogar der politische Gegner spendet Lob.“|Das Wasser spendet Erquickung.	donate|give|dispense	infak etmek	
überraschen	verb			Unsere Mannschaft überraschte gestern alle Zuschauer, als sie den Gegner 3:0 schlug.	surprise		
kontrollieren	verb			Heute wurde wieder mal die Geschwindigkeit der Fahrzeuge kontrolliert.|Die Mitarbeiter unseres Labors kontrollieren jeden Rohstoffeingang auf Schadstoffe und Verunreinigungen.|[Photographie:] „Direkt lassen sich Aufnahmen am Display kontrollieren und bei Nichtgefallen löschen.“|[Atomkraft:] „Steuerstäbe etwa aus Bor kontrollieren dabei die Zahl neu freigesetzter Neutronen.“	check|inspect		
abgeben	verb			Wenn er doch (den Ball) abgegeben hätte.	deliver|concede|hand in|hand over		
fangen	verb			Nachdem er Vegetarier wurde, fängt er auch zum Weiterverkauf keine Vögel mehr.	capture|entrap|catch|bag	hapsetmek|elde etmek|tutmak|kendine hâkim olmak	girtin
erlauben	verb			Ich erlaube dir heute, länger wach zu bleiben.	allow|permit|indulge		
einladen	verb			Ich möchte Sie zu unserer Feier einladen.|Gestern hat sie mich zu sich nach Hause eingeladen.	invite|load in	davet etmek	vexwendin
entdecken	verb			Clyde Tombaugh entdeckte 1930 den Pluto.	discover|to descry|spot	keşfetmek	
verlegen	verb			Jetzt habe ich den Schlüssel schon wieder verlegt!	misplace|mislay|lay|reschedule		
erwischen	verb			Die Polizei wird die Gammelfleisch-Betrüger schon erwischen.	catch|grab|catch red-handed|catch off guard	yakalamak	
wiederholen	verb			Großmütter wiederholen sich gern.	iterate|repeat|revise|repeat oneself		dubare kirin
wiederholen	verb			„Die Franzosen habe sich ihre Freiheit wiedergeholt,“ so Le Pen.|Er reiste nun nach Rom zu Augustus, um die Söhne wiederzuholen.	fetch back		
vernichten	verb			Er vernichtete alle Unterlagen, damit man ihm nichts nachweisen konnte.|Ein Hagelschlag vernichtete in wenigen Minuten die Ernte.|Die feindlichen Streitkräfte wurden vernichtet.|Wo war Gott, als sechs Millionen Juden vernichtet wurden?|„Vernichtet die PiS in Polen Akten im großen Stil?“	annihilate		
zuhören	verb			Hör zu! Die Nachrichten kommen!|Zuhören war noch nie Monas Stärke.	listen|hear|pay attention		guhdarî kirin|guh dan
erzählen	verb			Siegfried Lenz kann sehr gut Geschichten erzählen.	narrate|tell	anlatmak	vegotin
trennen	verb			Der Türsteher musste die beiden Streithähne trennen.	separate|sort|distinguish|split up	ayırmak	
vergehen	verb			Die Zeit vergeht so schnell.|Die Zeit verging wie im Flug.	elapse|pass|proceed|die		derbas bûn
begegnen	verb			Und was, wenn ich ihm im Bus begegne?	encounter|to meet|to come across|face	karşılaşmak	
bestimmen	verb			„Inwieweit Organe der Gemeinden als Sicherheitsbehörden einzuschreiten haben, bestimmen die Bundesgesetze.“|Die Mietdauer haben wir noch nicht bestimmt.|Ein Dreieck ist durch die Länge seiner drei Seiten eindeutig bestimmt.	determine|rule	saptamak|karar vermek|bir bitki veya hayvanın türlerini sınıflandırmak|bilimsel yöntemlerle belirlemek	
gedacht	verb			Er hatte dabei an sie gedacht.			
gedacht	verb			Er hatte ihrer gedacht.			
senden	verb			Senden Sie uns Ihr Feedback.|Ich sende Ihnen meine besten Grüße.	send|broadcast	göndermek|yayın yapmak	şandin
seid	verb			Joachim Ringelnatz: Jene brasilianischen Schmetterlinge: "Wie schön ihr angezogen seid!"			
schämen	verb			Ich schäme mich für meine Unsportlichkeit.|Sie brauchen sich nicht Ihrer Taten zu schämen!	be ashamed of		fedî kirin|şerm kirin
steigen	verb			Der Drachen steigt bei diesem Wind ganz hervorragend.	rise|climb|get into/out of		
genießen	verb			Sie genießt das Essen.	enjoy|relish|savour|savor		
abendessen	verb			Wann wollt ihr heute abendessen?|Habt ihr schon abendgegessen?			
mittagessen	verb			Wann wollt ihr heute mittagessen?|Habt ihr schon mittaggegessen?			
meinen	verb			Ich meine, dass das anders war.	think|intend|speak about|mean		
erheben	verb			Er wurde in den Adelsstand erhoben.	raise|lift|elevate|ennoble		
verlangen	verb			Ich verlange von ihnen, dass sie ordentliche Arbeit abliefern!|Der Gast verlangt gutes Essen und Luxus von einem Fünfsternehotel.	demand|to request|require|long for	istemek|arzu etmek|istek duymak|dilemek	
passen	verb			Die Jeans passt mir nicht, ich brauche eine Größe kleiner.|Das passt nicht mehr in die heutige Welt.	fit|suit|go with|skip		lê hatin
aufwachen	verb			Ich bin aufgewacht, als meine Mutter morgens ins Zimmer kam.|Ich wachte auf, als der Wecker klingelte.|Wenn ich aufwache, bin ich immer noch ein bisschen schläfrig.	wake up|awake		
süßen	verb			Der Tee wurde mit Honig gesüßt.	sweeten		şêrîn kirin
richten	verb			Der Kieferorthopäde richtet die Zähne.	straighten|direct|point|fix		
umziehen	verb			Sie ist gerade umgezogen.	move|get changed|change clothes		bar kirin
umziehen	verb			Deine Zeichnung kannst du noch mit einem Filzstift umziehen.	surround|cloud over		
verbringen	verb			So ward verbracht deß Herrn und auch der Frauen Wille.	acquire|squander|dissipate in luxury|guzzle		
weihnachten	verb			„Da es eben weihnachtet, haben wir den Strand für uns.“|„Ordentlich weihnachten soll es dafür ab morgen in der Breiten Gasse.“|„Anfang November weihnachtet es im Schloß Bellevue schon.“|„Zum Sessionsschluss hat es im Bundeshaus dann doch noch geweihnachtet.“|„Die beiden Formationen liessen es dabei bereits kräftig weihnachten.“	Christmas in the air|Christmas be on one’s way|Christmas approach sowie season|everything is Christmassy		
zurückgeben	verb			Ich muss noch bei der Bücherei anhalten und die geliehenen Bücher zurückgeben.|Das Land wurde mehrfach aufgefordert, die sogenannte Beutekunst zurückzugeben.	return|resign	geri vermek|iade etmek	
reichen	verb			Kannst du mir mal das Salz reichen?	hand|pass|serve|stretch		
vergeben	verb			Die Noten werden zwei Wochen nach der Prüfung vergeben.|Das Forstamt vergibt Flächenlose.	award|assign sth.|give away|forgive	dağıtmak|heba etmek|heder etmek|affetmek	
schicken	verb			Ich kann es ihr nicht direkt sagen. Ich schicke ihr einen Liebesbrief.	send|consign		şandin
drücken	verb			Drücken Sie diesen Knopf, um den Computer anzuschalten!	push|shake|be too tight|press	basmak|dürtmek|itmek|sarılmak	
stecken	verb			Er steckte (nicht „stak“) seine Hände in die Taschen.	insert|stick|be stuck|tell		
übergeben	verb			Nachdem ich ihm das Paket übergeben hatte, öffnete er es sofort.|Ich übergab meinem Nachfolger das Amt.	hand over|vomit	vermek|istifra etmek|kusmak	
begehen	verb			Darf mein Vermieter meine Wohnung begehen und Fotos machen?|Der frisch asphaltierte Fußweg kann noch nicht begangen werden.	inspect|visit|go along|walk on		
schützen	verb			Wir müssen den Regenwald schützen, sonst wird er gnadenlos abgeholzt.|„Normalerweise schützt die Plazenta den Fötus vor dem Stresshormon Cortisol.“	protect		
kämpfen	verb			Der Herausforderer und der Weltmeister kämpfen erneut um den Titel.|„Gipfelsammler der Sächsischen Schweiz haben mit mehreren Problemen zu kämpfen.“	fight|struggle|wrestle		
scheinen	verb			Die Sonne hat den ganzen Tag geschienen.	shine|seem	gibi görünmek|izlenim bırakmak	
entscheiden	verb			Sie können zwischen Fleisch- und Fischmenü entscheiden.|Sie können sich zwischen Fleisch- und Fischmenü entscheiden.	decide|rule	seçmek|karar vermek|neticelenmek|sonuçlanmak	
ansehen	verb			Wollen wir uns den Film ansehen?|Das soll sich die Frau Doktor mal näher ansehen.	look at|watch		
verderben	verb			Mit so viel Salz hast du die ganze Suppe verdorben.	ruin|spoil|decay		
erledigen	verb			Nach dem Skandal ist der Minister erledigt, er wird zurücktreten müssen	finish|complete|deal with|take out	halletmek	
reißen	verb			Er riss das Blatt Papier in mehrere Fetzen.	tear|rip|pull|kill		
tagen	verb			Es tagte bereits, als wir uns auf den Heimweg machten.	dawn|meet		
jagen	verb			Allgemein verbreitet ist die Vorstellung, dass Indianer vorwiegend Büffel gejagt hätten.	chase|hunt|rush	avlanmak|avlamak|koşmak	
weggehen	verb			Anstatt mich auf irgendwelche Diskussionen einzulassen, bin ich sofort weggegangen.	leave|go away|disappear		
anschauen	verb			Ich muss immerzu das Foto anschauen.	look at|watch		
behandeln	verb			In unserem Geschäft werden Kunden wie Könige behandelt.	treat|cover		
stoßen	verb			Er stieß ihr mit der Faust in die Seite.|Immer musst du mit deinen Füßen an den Tisch stoßen!|Wir haben immer wieder mit dem Ast an deine Fensterscheibe gestoßen.	push|run into|encounter		
ausgehen	verb			„Niemand bestreitet, dass von der Atomkraft Gefahren ausgehen.“	go out|go places|run out|assume		
empfangen	verb			Er empfing gestern endlich das Paket.	receive|welcome|conceive		wergirtin
hauen	verb			Hans hat Peter auf die Nase gehauen.|Als ich ihm eine in die Fresse haute, ist er weggerannt.|„Der Papa hieb mit der Hand auf den Tisch.“	hit|to beat|to poke|chop		
greifen	verb			Emil griff das herabhängende Seil und schwang sich auf die andere Seite.	grab|seize|grip|reach for	uzanmak|yakalamak	
feiern	verb			Ich wurde befördert! Es darf gefeiert werden!	celebrate		
begrüßen	verb			Sie war sichtlich froh, ihren langjährigen Freund wiederzusehen und begrüßte ihn freundlich.	greet|to welcome		
enttäuschen	verb			Juttas Unzuverlässigkeit enttäuscht mich maßlos.|Was soll ich sagen, ich bin enttäuscht und am Boden zerstört.|Die deutschen Hoffungen auf einen Oscar sind mal wieder enttäuscht worden.	disappoint|falsify		
anrufen	verb			„Warum wird die UN nicht angerufen?“	call|to challenge|appeal|to call	aramak	
bestrafen	verb			Der König bestrafte die Verräter mit dem Tode.|[Jugendstrafrecht:] „Kinder und Jugendliche kann man nicht wie Erwachsene bestrafen.“|[Schlagzeile (Fußball):] „Bayern bestrafen Stuttgarter Fehler gnadenlos“	punish	cezalandırmak	
probieren	verb			Ich würde gerne ein Stück von diesem Käse probieren.	try|attempt|taste|sample		
eingehen	verb			Die Pflanze ist eingegangen.|Eine der beiden Schildkröten ist leider eingegangen.	die|go into|enter into a relationship or contract|go into that; to respond		
rollen	verb			Der Stein rollte den Berg hinunter.	roll		girgirandin
unterstützen	verb			Sie unterstützten die Widerstandskämpfer bei ihrem Aufstand.|„Klöster und Private unterstützten den bettelnden Landstreicher.“	support	desteklemek	
verbessern	verb			Die Lehrerin hat die Klausuren noch nicht verbessert.	correct|improve		baş kirin
streiten	verb			Seine Eltern streiten sich jeden Tag über unwichtige Dinge.	argue|fight	tartışmak	
durchführen	verb			Als wir den Befehl durchgeführt hatten, kehrten wir zur Basis zurück.	carry out|guide|give a tour	tertip etmek|icra etmek|eşlik etmek	
melden	verb			Der Direktor meldete den Unfall.	report|get in touch|raise one's hand|enlist oneself		
warten	verb			Seit Stunden warten die Kunden auf die Lieferung.|„Im Eckbüro warteten Sonny und Tessio.“	wait|maintain	beklemek	
stürzen	verb			Er hat ihn vom Turm gestürzt.	plunge|overthrow	düşmek|düşürmek|çevirmek|devirmek	
beweisen	verb			Vor Gericht konnte der Verteidiger die Unschuld des Mandanten beweisen.|Glauben reicht hier nicht, diese Theorie muss erst einmal bewiesen werden.	prove		
ertragen	verb			Ich kann es nicht mehr ertragen.|An besonders warmen Tagen konnte man seinen Körpergeruch kaum ertragen.	bear|endure|take	katlanmak|tahammül etmek	
hoffen	verb			Ich hoffe, das Wetter bleibt weiterhin stabil.|Dieses Ereignis lässt uns auf das Ende hoffen.	hope|trust		
wegnehmen	verb			Es war ganz leicht, dem Kind seinen Lolli wegzunehmen.	take away|take up		
ruhen	verb			Er ruht bei dem schönen Wetter.	rest|halt|stop|stall	dinlenmek|istirahat etmek|beklemek|durdurmak	
leisten	verb			Ich leiste mir gerne feine Speisen.|Zur Belohnung haben die beiden sich ein Städtewochenende geleistet.|Er leistete sich einen teuren Sportwagen.	allow oneself|treat oneself|perform|afford		
bestellen	verb			Ich habe mir eben eine Pizza bestellt.|Ich habe beim Italiener für heute Abend einen Tisch bestellt.|Könnten Sie mir bitte ein Taxi bestellen?	order|convey|pass on|cultivate		
verändern	verb			Er veränderte die Einstellungen.|An einem Tatort darf nichts verändert werden, bis die Spurensicherung eintrifft.|„Die germanische Invasion veränderte dauerhaft die Machtstrukturen in Britannien.“	change		
erfüllen	verb			Das Urteil erfüllt den Angeklagten mit Hass.	elate|fulfil		
reparieren	verb			Er reparierte die Tür.	repair		
gewöhnen	verb			Ich habe mich von klein auf daran gewöhnt, früh aufzustehen.	acclimate|accustom|habituate|get used		
löschen	verb			Die Feuerwehr löschte das Feuer.|„Das Feuer wurde gelöscht.“	extinguish|put out|quench|delete	söndürmek|silmek	
löschen	verb			Die Ladung des Schiffes wurde gestern Abend gelöscht.	unload	yük boşaltmak	
verdienen	verb			„Nicht alle Kampfparteien in Syrien verdienen am Drogenschmuggel.“	earn|deserve	kazanmak	
gehören	verb			Ihm gehört das ganze Land.	belong	ait olmak	
beschreiben	verb			Er beschrieb den Block innerhalb kurzer Zeit.	describe	tanımlamak	
heulen	verb			Nach dieser Schreckensnachricht heulten viele Menschen.	bawl|blubber|hoot|howl	ulumak|ağlamak|feryat etmek	zûrîn
respektieren	verb			Ich respektiere deine Autorität.|Als dein Kollege respektiere ich deine Ansichten, halte sie aber für rückwärtsgewandt.	respect	hürmet etmek|saygı göstermek|saymak	rêz girtin|rêz lê girtin
möchten	verb			„Möchten kannst du vieles. Nur werden Wünsche nicht immer gewährt.“		arzulamak	
haken	verb			Die Kupplungen der Waggons hakten ein.	hook|stick		
verraten	verb			Er hat seiner Kollegin verraten, dass der Vorgesetzte eine Intrige plant.	reveal|betray		
beibringen	verb			Zum Glück konnte ich Zeugen für den Unfall beibringen.|Wer am Tag der Prüfung krank ist, muss ein Attest beibringen.	provide|produce|inflict|teach		
klappen	verb			Es klappte auf Anhieb.|Glaub mir, es wird schon alles klappen.	fold|flip|work|work out	yolunda gitmek|yürümek	
verdächtigen	verb			Er wurde einer Fälschung unschuldig verdächtigt.	suspect		
blauen	verb			Der Himmel blaut über dem Meer.|„Das Firmament blaut ewig und die Erde			
funktionieren	verb			Der Traktor ist kaputt und funktioniert nicht.|Spruch: „Wenn Du willst, das etwas funktioniert, dann mach' es selbst!“|„Wie funktioniert eigentlich ein Computer?“|Die kleine Solaranlage, die er sich selbst zusammengebastelt hatte, funktionierte einwandfrei.	function|to work|to operate|to perform		
ausschalten	verb			Bei technischen Störungen sollte man den Strom ausschalten.	switch off|turn off|eliminate	kesmek|kapamak|yenmek|saf dışı bırakmak	
zulassen	verb			Wie konntet ihr nur das gefährliche Spiel zulassen.	tolerate something|allow something|permit|keep closed		
stören	verb			Dieser Lärm stört mich bei der Arbeit.|„Mario stört zum wiederholten Male den Unterricht.“	disturb|interfere with|hinder		
nachdenken	verb			Ich habe lange darüber nachgedacht.	think|reflect|ponder	düşünmek	
betreten	verb			Bevor man die Halle betritt, muss man seine Schuhe ausziehen.	enter|step into|step onto|set foot on		
vertrauen	verb			Ich vertraue auf deine guten Fahrkünste.|„Für Spielzeughersteller sind derartige Kinderstars attraktive Werbeträger, da andere Kinder ihnen vertrauen.“	trust		
knacken	verb			Der Ast knackte laut, während er zerbrach.	crack|sleep|nap		
gelangen	verb			Nach mehreren Stunden Aufstieg gelangten wir zur Schutzhütte.|Und wie gelangen wir jetzt schnellstens an das Ziel unserer Wünsche?|Das kurze Video gelangte in falsche Hände.|„Sein Plan, wie er zum Flugzeugwrack gelangen sollte, war fertig.“	reach|attain		
abwarten	verb			Wir haben das Gewitter abgewartet.	await|wait till|wait for|wait and see	beklemek	
landen	verb			Kolumbus landete zuerst auf Hispaniola.	land|alight|debark|disembark		
erwarten	verb			Ich erwarte dich dann um 11 Uhr zum Brunch.|„Die Lufthansa-Maschine wird gegen acht Uhr am Frankfurter Flughafen erwartet.“	await|expect|abide	beklemek|ummak	
verbrennen	verb			Er hat alle Reste des Mülls verbrannt, um keine Entsorgungskosten zu bezahlen.|„Willst du dich von etwas trennen, dann musst du es verbrennen.“	incinerate|burn|burn at the stake|cremate	yakmak	
überlassen	verb			Da sie arbeiten muss, überlässt sie ihre Kinder der Schwiegermutter.|Ich überlasse dir die Koffer, um die Bahnkarten zu besorgen.	cede|to relinquish|to leave sth. to sb.|relinquish ; to concede	emanet etmek|vazgeçmek|bırakmak|kendi haline bırakmak	
überlassen	verb			Du hast mir von der Currywurst gar nichts übergelassen.|Soll ich wirklich nichts mehr vom Gemüse überlassen?	leave over|to spare		
ausgeben	verb			Für die Hose hat er 70 Euro ausgegeben.	spend|issue|dispense|imitate	gibi davranmak|kendini gibiymiş gibi gösterip|tükenme sınırına gelmek|gücünün sınırını zorlamak	
opfern	verb			Sie opferten Ziegen auf dem Altar, um die Vulkangötter friedlich zu stimmen.	sacrifice		
bewahren	verb			Im Falle von Feuer, bitte Ruhe bewahren.	keep|protect	muhafaza etmek|korumak|edinmek	
verzichten	verb			Ich verzichte auf eine Antwort.|Möchtest denn du die Jubiläumsrede halten? Nein, ich verzichte dankend.	renounce|resign|forgo	vaz gecmek|istifa etmek|feragat etmek	
spazieren	verb			Er spazierte am Hafen entlang.	stroll|walk	dolaşmak	
umgehen	verb			Sie wollte die Baustelle umgehen.|Er umging es, den Tod ihres Mannes anzusprechen.	evade|avoid|circumvent|bypass	kaçınmak	
umgehen	verb			Sie kann schlecht mit Geld umgehen.	handle|deal with|treat|circulate		
aussagen	verb			Ein negatives Ergebnis sagt aus, dass kein Virus nachweisbar ist.|Was sagt dieses Sprichwort aus? Mit diesem Ausdruck wird ausgesagt, dass …	state|reveal|express|testify	belirtmek|iddalı söylemek|ifade etmek|ifade vermek	
unterschreiben	verb			Ich habe den Vertrag jetzt unterschrieben.	sign	imzalamak	
fehlen	verb			Doch an Blumen fehlt's im Revier. (Goethe, Faust I)	miss|lack|be short|be missing		
befreien	verb			Sie konnte sich aus seiner Umklammerung nicht befreien.	free|to liberate		rizgar kirin
begraben	verb			Wir müssen die Toten begraben.|Ich begrub die Leiche in der Erde.|Du begräbst den Hamster und ich das Meerschweinchen.	bury		binax kirin
langen	verb			Das Benzin langt noch bis Köln.|Es waren so viele belegte Brote da, dass es für alle langte.	be enough|suffice		
bereiten	verb			Ich werde Ihnen das Bett bereiten.|Mein ehemaliger Professor hat mir den Weg bereitet.|Herr Bleibein bereitete grade sein Mittagsmahl, als es an der Tür klingelte.	prepare|get something ready|cause		
bereiten	verb			Bereite du den Rappen, dann übernehme ich den Fuchswallach.	ride over|to ride across|train|to break in		
irren	verb			Ich dachte, die Erde sei eine Scheibe, doch ich irrte.|Wenn Du glaubst, dass ich diesen Vertrag unterschreibe, irrst Du Dich.|Sie irren, Herr Bleibein!|Verzeihung, da habe ich mich wohl geirrt.	err|be mistaken|roam|wander		
umbringen	verb			Ich werde dieses Miststück umbringen.|Die Raucherei wird dich nochmal umbringen.	kill|commit suicide|kill oneself		kuştin
steuern	verb			Ich steuere das Raumschiff bis ans Ende der Galaxis.|Herr Bleibein steuerte sein ferngelenktes Flugzeug ohne jedes Geschick gegen einen Baum.|Der Reaktorfahrer steuert den Brüter mit viel Bedacht.	control|steer|pilot|head		
übernehmen	verb			Ich übernehme diese Arbeit gerne.|Die Terroristen übernahmen die Kontrolle über das Flugzeug.|Sie werden die Verantwortung für diesen Vorfall übernehmen.|Zum ersten April wurde die Winzig AG von der Heuschreck AG übernommen.|Ein Roboter könnte seinen Job übernehmen.	take|take over|assume|burn the candle at both ends	üstlenmek|üzerine almak	
unterbrechen	verb			Ich habe den Fehler gefunden: Die Leitung war unterbrochen.|Mitten im Telefonat wurde die Verbindung unterbrochen.	disrupt|disconnect|interrupt|disturb	kesmek|araya girmek|ara vermek	
ausmachen	verb			Hast du die Heizung ausgemacht?	put out|turn off|switch off|agree on		
achten	verb			Wir haben alle die Regeln zu achten.	respect|value|think highly of|watch for		
festhalten	verb			Ich möchte festhalten, dass es sich hierbei um eine erhebliche Straftat handelt.	hold tigthly|hold onto|clasp|note		
verschieben	verb			Der Kommandant befahl, die Truppen auf die gegenüberliegende Hügelkette zu verschieben.|Das Sofa müssen wir verschieben, wenn die neue Pflanze Platz haben soll.	move|postpone|reschedule	kaydırma|yerinden oynatmak|ertelemek|tehir etmek	
vermeiden	verb			Vermeiden Sie direkten Augenkontakt.|Vermeiden Sie es, das Wasser dort zu trinken.	avoid	kaçınmak|sakınmak	
abhauen	verb			Der Junge ist von zuhause abgehauen/abgehaut.	cut off|run away		
verzeihen	verb			Ich kann dir nicht verzeihen.|Es sei dir verziehen!|Nach einer Stunde hatte sie ihm schon verziehen.	forgive|excuse|pardon	affetmek	
verfolgen	verb			Die Autobahnpolizei verfolgte die Raser.	follow|pursue|trace|persecute	izlemek|takip etmek|zulmetmek	
duschen	verb			Sie duscht den Jungen, damit er sauber wird.|"Eigentlich würde es reichen, ein- bis zweimal die Woche zu duschen."	shower|take a shower|have a shower		
beruhigen	verb			Die Mutter konnte das weinende Kind schnell wieder beruhigen.	calm|blow over		hedidandin
aufmachen	verb			Kannst du mir die Dose aufmachen?	open|make for a place		
überzeugen	verb			Erst nach Vorlage der Beweise konnte ich ihn überzeugen.	convince|persuade|satisfy|convince oneself	ikna etmek	
grüßen	verb			Ich grüße alle Gäste im Saal.|Die neue Mieterin grüßt immer so freundlich.	greet|remember		silav kirin
erwähnen	verb			Er erwähnte auch, dass er schon immer hier wohnte.|Ein neues Testament wurde meines Wissens nie erwähnt.|Sie hat beiläufig erwähnt, dass sie wieder verheiratet ist.	mention|bring up	söz etmek|bahsetmek	
vermögen	verb			„Einstein vermochte das tragische Schicksal seines Sohnes nicht zu verwinden.“	be able to|be capable of		karîn
geraten	verb			Wohin sind wir hier bloß geraten?	fall into|get into|get in|succeed		
erleben	verb			Ich habe noch nie erlebt, dass ein Beamter nach Dienstschluss noch arbeitet.|Mit dir habe ich viel Leid, aber auch überschwängliche Freude erlebt.|Das ich das noch erleben darf!	experience|encounter	yaşamak	
pflanzen	verb			Der Gärtner pflanzt schon früh im Jahr im Glashaus Gemüse.|„Zum 1.200-jährigen Stadtjubiläum will die mittelfränkische Stadt Gunzenhausen 1.200 Bäume pflanzen.“	plant		
vorbereiten	verb			Ich muss mich noch auf die morgige Prüfung vorbereiten.|Wir haben das Haus auf den kommenden Sturm bereits vorbereitet.	prepare	hazırlamak	amade kirin
klären	verb			Damit wären hoffentlich alle Unstimmigkeiten geklärt.	clear|clarify|settle|purge		
stoppen	verb			Die Polizei stoppte den Raser.|„Der Anker polterte ins Wasser, und das Schiff stoppte.“|Sie können den Druckauftrag auch stoppen.|Wenn man auf Stopp drückt, stoppt der Rekorder.	stop	durdurmak	
vermissen	verb			Ich vermisse den alten Spaten.	miss		bêrî kirin
liefern	verb			Die bestellten Waren wurden noch nicht geliefert.|Der Rechner wird ohne Betriebssystem geliefert.|Firma Müller liefert uns die Beschläge.|Wir liefern das komplette Zubehör.|Die ersten Maschinen werden 2024 geliefert.|„Deutschland liefert Waffen aus den Beständen der Bundeswehr an die Ukraine.“|„China hat Probleme zu liefern, auch wegen der Lockdowns ganzer Städte.“	deliver|ship|supply|produce	teslim etmek|yollamak	
verteidigen	verb			Er verteidigte sein Königreich.	defend|protect		
warnen	verb			Ich warne dich, es droht Gefahr.|„Ich entkam einem Unfall nur deshalb, weil mich ein Fahrradkurier warnte.“	warn		
erschrecken	verb			Peter hat Simone mit seiner Fahrweise erschreckt.	frighten|scare|startle	korkutmak	
erschrecken	verb			Simone sieht Peters Fahrweise und erschrickt.	startle		
erschrecken	verb			Erschrecke dich nicht, wenn du mich gleich siehst.|Ich habe mich trotz seiner Warnung fürchterlich erschrocken.|Ich habe mich trotz seiner Warnung fürchterlich erschreckt.	be frightened|get scared		
zusammenarbeiten	verb			Alleine können wir es nicht schaffen. Wir sollten zusammenarbeiten.	work together|cooperate	teşriki mesai yapmak|işbirliği yapmak|beraber çalışmak	bi hev re kar kirin|bi hev re xebat kirin|bi hev re xebitîn
bedanken	verb			Ich möchte mich bei Ihnen für Ihre große Hilfe bedanken.|Sie bedankte sich für die Unterstützung.	thank|bethank		
kontaktieren	verb			Wenn Sie Fragen haben, kontaktieren Sie uns bitte per E-Mail oder Telefon.|Bevor wir den Auftrag vergeben, sollten wir auch noch andere Anbieter kontaktieren.	contact		
klingeln	verb			Es hat geklingelt, willst du nicht schauen, wer da ist?|Es klingelt, willst du nicht drangehen?|Der Wecker klingelt jeden Morgen um sechs Uhr.	ring	çalmak	
angehen	verb			Lass uns die Sache gemeinsam angehen.	come on|tackle|address|concern		
überwachen	verb			Die Temperatur und die Luftfeuchtigkeit im Gewächshaus sollte immer überwacht werden.	oversee|survey|surveil	denetleme|kontrol	çavdêrî kirin
zeugen	verb			Die Palastmauern zeugen von der einstigen Größe des Herrscherhauses.|Dein Verhalten zeugt nicht unbedingt von Kooperationsbereitschaft.	testify|show		
zeugen	verb			Er zeugte zwei Töchter und einen Sohn.|Zeuge erst ein Kind, bevor du einen Baum pflanzt!	procreate|father|beget		
aufpassen	verb			Ich habe im Matheunterricht gut aufgepasst und konnte die Aufgaben anschließend lösen.	pay attention|take care|be careful		
identifizieren	verb			Ich musste meine Mutter identifizieren.|Über die Gesichtsgeometrie habe ich mich identifiziert.|Du bist identifiziert worden.	identify		
gestatten	verb			Der Zutritt ist Ihnen nicht gestattet.|„Mein Herr, leider können wir Ihnen nicht gestatten, an Bord zu bleiben.“	permit|allow	izin vermek|müsade etmek	
schwören	verb			Otto musste die feierlichen Worte schwören.	swear|swear by		
entschuldigen	verb			Dieser Fehler ist nicht zu entschuldigen.	apologize|excuse	özür dilemek	
hinsetzen	verb			Können Sie die Vase hier hinsetzen, bitte.	sit down|put down		
kennenlernen	verb			Er hat seine Frau an einem Freitag kennengelernt.	get to know	tanımak	
rechten	verb			„Haſtig in dem, was ſie fuͤr Rechtens hielten, rechteten ſie gegen einander.“	argue|dispute|defend right|claim		
beeilen	verb			Sie mussten sich sehr beeilen, um den Bus noch zu erreichen.	hurry		
enden	verb			Der Tag endet mit einem großen Feuerwerk.|„Jenseits der linken Leitplanke endet hier Georgiens Hoheitsgebiet.“|„Die Odyssee des Heiligen endet schließlich im nordostenglischen Durham.“	end		bi dawî bûn
gefallen	verb			„Das angenehme am Älterwerden: Mir gefallen immer mehr Frauenjahrgänge.“|Diese Bluse hier tät mir schon gefallen.	please		
berichten	verb			Der Reporter berichtet über die Verhältnisse in Afrika.|Es gibt nichts Neues zu berichten.	report|refer|relate|detail		
zurückgehen	verb			Es ist schon spät: Es wird Zeit, dass wir zurückgehen.|„Fußball ist keine Religion, da seine Regeln nicht auf übermenschliche Gebote zurückgehen.“	go back|return|decline|decrease		
gründen	verb			Wir wollen einen neuen Verein gründen.	found|build|base	kurmak|tesis etmek|temel atmak	
zugeben	verb			Zugegeben, Peter ist vielleicht rücksichtslos, aber ist Hans denn besser?|Ich gebe zu, dass das nicht ganz in Ordnung war.	admit|acknowledge|concede|add		
aufbauen	verb			Es dauert ziemlich lange, eine Brücke aufzubauen.	build|construct|establish|build up		ava kirin
informieren	verb			Er informierte uns über das bevorstehende Unwetter.	inform|let know	bilgilendirmek	
wahren	verb			Man muss den Frieden wahren.|Vor Ort und beim Schreiben wahrten wir professionelle Distanz.	maintain|preserve		
vorgehen	verb			Wir sollten noch ein bisschen weiter vorgehen, dann sehen wir besser.	happen|proceed|precede		
ersetzen	verb			Ich ersetze im Text jedes Vorkommen von „Maria“ durch „Hilda“.|Mike hat seine alte Freundin ganz einfach durch eine jüngere ersetzt.|Maschinen ersetzen den Menschen im Berufsalltag.	replace|substitute		
begreifen	verb			Der Junge benötigt noch etwas Zeit, bis er die Rechenart wirklich begreift.|Der Junge begreift schnell.|„Das Publikum im Saal begriff sofort und applaudierte.“|Ein einmal wirklich begriffenes Konzept kann man dann immer wieder verwenden.|„Erst allmählich begriff er, dass es vielen Patienten ohne Opioide besser ging.“	understand|to comprehend|include|to encompass		
sorgen	verb			Man muss sich nicht um jede Kleinigkeit sorgen.|Die Mutter sorgt sich um ihr Kind, dessen Ankunft überfällig ist.	care|worry|tend|cause		
besorgen	verb			Wir müssen uns für den Winter noch neue Jacken besorgen.	get|obtain|procure|provide with		dabîn kirin
eröffnen	verb			Ich eröffne heute mein neues Geschäft.|„Jede dieser selbständigen Luftsportarten eröffnet in demselben Element eine eigene Welt.“	open|inaugurate|open up		
verhalten	verb			„Soll der Stuhl verhalten werden, so bleibt der äußere Muskel angespannt.“	restrain|suppress|behave|stand	davranmak|hareket etmek	
abholen	verb			Ich muss noch ein Paket von der Post abholen.|Sie hat die Karten an der Kasse abgeholt.	pick up|collect|take away	alıp getirmek|alıp götürmek|teslim almak	girtin|stendin
ausreden	verb			Dieses Projekt müssen wir ihnen ausreden.	talk out of		
verlaufen	verb			Hänsel und Gretel haben sich im Wald verlaufen.|In der ungewohnten Umgebung verläuft man sich schnell mal.	stray|get lost|scatter|dispel		
entkommen	verb			Sie sind der Feuersbrunst gerade noch entkommen.|Der angedrohten Strafe konnten sie diesmal gerade noch entkommen.|„Ich entkam einem Unfall nur deshalb, weil mich ein Fahrradkurier warnte.“	escape		filitîn
mitkommen	verb			»Ich würde gerne mit euch mitkommen, bin aber leider krank.«|»Willst du zur Party mitkommen?«	accompany|come along|tag along|understand	eşlik etmek	
graben	verb			Für das Pflanzloch müssen wir noch etwas tiefer graben.	dig		
umdrehen	verb			Um die Rückseite des Bildes sehen zu können, musst du es umdrehen.	turn|flip|reverse|turn around		
verhandeln	verb			Über die genauen Bedingungen des Vertrags müssen wir noch verhandeln.	negotiate		
mitnehmen	verb			Kannst du meinen Bruder zum Bahnhof mitnehmen?	take with|keep|take	beraber almak	
verloren	verb			Das Spiel ist verloren.			
begleiten	verb			Hast du Lust, mich zum Abschlussball zu begleiten?|Darf ich dich nach Hause begleiten?	accompany|trace someone's journey	refakat etmek|eşlik etmek	
überleben	verb			„Als einziges Mitglied seiner Familie überlebte er den Holocaust.“	survive|overlive	hayatta kalmak	
einkaufen	verb			Er hat sich in die Praxis von xy eingekauft.	buy|go shopping|buy in		kirîn
fürchten	verb			Der Tapfre fürchtet weder Tod noch Teufel.	fear|afraid of something	korkmak	
wagen	verb			Vor Angst, entdeckt zu werden, wagte er nicht einmal zu atmen.|Wie können Sie es wagen! Nehmen Sie sofort Ihre Hand da weg!	dare|venture		
trauen	verb			Ich traue diesen Leuten nicht, sie sind mir suspekt.	trust|dare|to venture|to have the heart to do something		
erwachsen	verb			Wie soll das geschehen, ohne dass jemandem ein Vorteil daraus erwächst?	arise		
nerven	verb			Kinder können ihre Eltern manchmal ganz schön nerven.|Nun geh mal weg hier, du nervst!	bug|annoy|pester|bother	sinirlendirmek	
reagieren	verb			Ich bin gespannt, wie er reagieren wird.	react	reaksiyon göstermek|tepki göstermek|tepki vermek	
wecken	verb			Leider muss ich Dich jetzt schon wecken.|Der Mann weckt den Hund.	wake|wake up|cause|bring about		
tropfen	verb			Pass auf, dass du mit dem nassen Handtuch nicht tropfst.|Der Wasserhahn tropfte die ganze Nacht.|„Von der Kelter tropft dann zuckersüßer Saft.“	drip|drop		dilop kirin
spüren	verb			Im Sommer spürt man die Wärme der Sonne auf der Haut.	feel|to sense	hissetmek	
spuren	verb			Im Winter werden die Langlaufloipen gespurt.	lay a track|toe the line		
schultern	verb			Es stellt sich die Frage, ob Pakistan diese Aufgabe schultern kann.|„Sowohl die Finanzierung als auch die Umgestaltung der Räumlichkeiten schulterten sie alleine“.	sling over one's shoulder|shoulder		
schönen	verb			Zudem wurden statistische Angaben in der UdSSR regelmäßig geschönt.	clarify|clear|fine|refine		
beschützen	verb			Der Geldtransporter wird wegen der Überfallgefahr beschützt.|Ranger beschützen den Nationalpark.|Die Löwenmutter beschützt ihr Kleines vor den Hyänen.|Ein Personenschützer beschützt seinen Klienten.	protect		
herausfinden	verb			Ich habe herausgefunden, dass mein Freund mich betrügt.|Welche Ursache Morbus Alzheimer hat, müssen die Forscher noch herausfinden.|Um seine Adresse herauszufinden musst du nur im Telefonbuch nachgucken.	find out|discover|figure out|learn		
konzentrieren	verb			In den nächsten Monaten konzentriere ich mich auf mein neues Buch.|„Ruhe! Wie soll man sich denn bei diesem Lärm konzentrieren?“	pay attention|concentrate|focus|center on	yoğunlaştırmak	
regeln	verb			Das ist eine Sache, die wir vertraglich regeln sollten.|Ich habe meinen Nachlass schon lange geregelt.	control|manage|regulate		
verpassen	verb			Er hat knapp das Ziel verpasst.	miss		
übersehen	verb			Huch! Ich habe dich total übersehen.	overlook|comprehend		
kehren	verb			Wir sollten mal den Bürgersteig kehren.	sweep|turn|take care of		
mitbringen	verb			Würdest du mir bitte etwas aus der Stadt mitbringen?	bring along|to bring		
zusehen	verb			Er sah zu, wie die Firma langsam in Konkurs ging.	watch|make sure that	seyretmek	
fällen	verb			Der Holzfäller fällt den Baum für die Weiterverarbeitung im Sägewerk.	fell|chop down|cut down|come to		
schaden	verb			Mit seinem Verhalten will er niemandem schaden.|Wenn du dich so schlampig anziehst, schadest du nur deinem Ruf.|Das ständige Ein- und Ausschalten schadet dem Gerät.	hurt|to damage|to harm		
amüsieren	verb			Der Gastgeber versucht seine Gäste mit kleinen Sketchen zu amüsieren.	amuse|entertain		
grenzen	verb			Die Schweiz grenzt an Deutschland, Österreich, Italien und Frankreich.	abut	bitişmek|bitişik olmak|sınırı olmak|dayanmak	
dauern	verb			Eine Massage dauert 45 Minuten.|Bis alle Schäden des Erdbebens beseitigt sind, wird es noch Jahre dauern.|„Die Varusschlacht, auch als Schlacht am Teutoburger Wald bekannt, dauerte vier Tage.“	last|take time		
bereuen	verb			Der Dieb bereut seine Tat.|[Schlagzeile:] „Lungenarzt über Covid: »Wer nicht geimpft ist, bereut es«“	regret|rue|repent	pişman olmak	
verwandeln	verb			Kinder verwandeln sich gerne, indem sie sich verkleiden.	transform|metamorphose|transmute|turn into		
sichern	verb			Sichere die Pistole, wenn Du fertig bist mit der Übung!	safeguard|protect|put on a safety catch|secure		
einigen	verb			Bismarck nutzte den Deutsch-Französischen Krieg, um die deutschen Staaten zu einigen.	unite|agree	uzlaşmak|anlaşmak	
aussteigen	verb			Wir sind an der Endstation und müssen jetzt aussteigen.	to get off|to get out of|to alight from|to disembark		peya bûn
einsteigen	verb			Der Zug ist da, wir können schon mal einsteigen.	board|get in|climb in|to tackle hard	binmek|katılmak	siwar bûn
haaren	verb			Mein Hund haart zur Zeit besonders stark.	shed|lose hair		
blicken	verb			Er blickte mir nur kurz ins Gesicht, dann verschwand er.	look	bakmak|göz atmak	
wachen	verb			Die Mutter wachte über ihr krankes Kind.	watch over		
erschaffen	verb			Er erschuf sein gesamtes literarisches Werk in 3 Jahren.	create		
unternehmen	verb			Die Lehrer beschlossen, eine Besprechung bezüglich der Schüler zu unternehmen.	undertake		
wetten	verb			Die Besucher einer Pferderennbahn wetten auf das siegreiche Pferd.	bet	bahse girmek	
vertragen	verb			Die Kinder vertragen die Hitze und die hohe Luftfeuchtigkeit erstaunlich gut.|Du verträgst wohl keinen Spass, oder?	tolerate|get along with	dayanmak|gecinmek	
osten	verb			Hier handelt es sich um eine geostete Kirche.	orientate		
hinlegen	verb			Wo habe ich meine Autoschlüssel nur wieder hingelegt?|Ich werde die Prospekte dort drüben hinlegen.	put down|lay down|lie down		
überfallen	verb			Deutschland überfiel Polen im zweiten Weltkrieg.	invade|attack|mug|assault		
stunden	verb			Kannst du mir den Deckel stunden, bis ich wieder Geld habe?	defer		
beantworten	verb			Er beantwortet die Fragen blitzschnell.	answer|to respond		bersivandin
bekämpfen	verb			Nach diesen erneuten Angriffen entschloss ich mich, die Urheber zu bekämpfen.	antagonize / antagonize|battle|combat|fight	müharebe etmek|mücadele etmek|savaşmak	
auftauchen	verb			Nach einer Weile muss ich wieder auftauchen.	emerge|show|show up|turn up	su yüzüne çıkmak|ortaya çıkmak|belirmek	
nähern	verb			Schleichend nähert er sich der Tür.			
quietschen	verb			„Und nun quietschen die Bremsen, die Fahrt ist zu Ende.“	squeak|screech|creak		
durchsuchen	verb			Durchsuche doch mal deine Ordner; vielleicht findest du die Studienbescheinigung dort.|Ich habe meine ganze Wohnung durchsucht; ich finde den Schlüssel nicht.	search		
schmerzen	verb			Mein Zahn schmerzt mich seit zwei Tagen, ich muss dringend zum Arzt!|Die Wunde hat stark geschmerzt und ist schlecht verheilt.	ache|pain|hurt	ağrımak	
überreden	verb			Er überredete sie zu bleiben.	talk over|persuade|cajole	ikna etmek	
posten	verb			Er muss noch Brot posten gehen, bevor er frühstücken kann.			
weißen	verb			Er weißte die Wand mit der Farbe Eierschalenweiß.	paint a wall white|whitewash		
proben	verb			Die Theatergruppe hat den ganzen Tag geprobt.|Die Theatergruppe probte die letzte Szene mehrere Male.	rehearse		
orten	verb			„Drei Satelliten genügen China, um die US-Marine zu orten.“|„Auf sieben Gebieten orteten die Forscherinnen die Zutaten des langen gesunden Lebens.“	locate		
filmen	verb			Seit ich meine Videokamera habe, filme ich fast alles.|Wilde Tiere zu filmen erfordert viel Geduld.	film		
räumen	verb			Wir räumen die alten Bücher aus dem Regal.	clear|move|vacate|move out		
weglaufen	verb			Letzte Woche ist Tommy zum zweiten Mal von zu Hause weggelaufen.	run away		
loslassen	verb			Du musst das Seil loslassen!	let loose|let go|release		
erschießen	verb			„Pistorius erschoss Reeva Steenkamp am 14. Februar 2013.“	shoot dead		
schnappen	verb			Hinter ihm schnappte die Tür ins Schloss.	snap|snatch|grab|catch	kapmak	
feuern	verb			Hier feuert man noch mit Birkenholz.	fire		
nachsehen	verb			Die Frage kann ich nicht beantworten; da muss ich erst nachsehen.	look up|check		
antun	verb			Wie konnte er ihr das nur antun?	do|cause|dress		
grünen	verb			Nachdem ich meine Alpenveilchen gegossen hatte, fingen sie wieder an zu grünen.	green|to turn green		
durchgehen	verb			Der Mann geht durch die Türe durch.	pass|go through		
durchgehen	verb			Ich musste auf dem Heimweg den Wald durchgehen.			
verfahren	verb			Entschuldige die Verspätung. Ich habe mich auf dem Herweg total verfahren.			
verfahren	verb			Wir sollten uns zunächst einigen, wie wir verfahren wollen.			
schulden	verb			Ich schulde dir noch 20 Mark.	owe		
entspannen	verb			Bei einer Massage kann man sich entspannen.|Sie entspannt sich gerne beim Schwimmen.	relax		
gestehen	verb			Die Indizien sind klar, der Tatverdächtige muss den Mord nur noch gestehen.|Er gestand ihr seine Zuneigung.	confess|admit		
weitermachen	verb			Sollen wir weitermachen, oder willst du eine Pause einlegen?	go on|keep going|continue		
reifen	verb			Die frühesten Kirschen reifen schon im Mai.	ripen	olgunlaşmak	
reifen	verb			Heute Nacht hat es gereift.	cover with frost		
mitmachen	verb			Wir spielen Verstecken! Willst du mitmachen?	participate|join in|function		
herzen	verb			Innig herzte er sein Kind zum Abschied.|„Komm, lass dich herzen.“	hug		
hingehen	verb			Ich möchte nicht mehr dort hingehen!	go		
losgehen	verb			„Einfach losgehen und schnell kaufen, das ist trotzdem ihre Sache nicht.“	leave|start|go off|fire		
vorfahren	verb			Kannst du noch 20 cm vorfahren?	drive ahead|drive up		
aussuchen	verb			Ich habe mir dieses Paar Schuhe ausgesucht, das will ich haben!|Ich habe dieses Paar Schuhe ausgesucht, das wird Martina bestimmt gefallen.|Darf ich mir den Nachtisch selber aussuchen?	choose|select|pick|opt for		
trainieren	verb			Ich trainiere meine Muskeln jeden Tag im Fitnessstudio.|Der Sportler trainiert fleißig für den morgigen Wettkampf.	train		
narren	verb			Das Duo narrt die Polizei.|Die Fatamorgana narrte die Reisenden.|Wenn mich mein Gedächtnis nicht narrt, war das im Frühsommer 1989.	fool		
kugeln	verb			Langsam kugelt der Ball am Torhüter vorbei in den Kasten.|„Plötzlich kugelte Jonas der Kräuterfrau direkt vor die Füße.“			
daten	verb			„„Naja, angesichts der Sorte Mann, die du datest...“ „Welche Sorte wäre das?““	date		
bullen	verb			„Von einer brünstigen Kuh sagt man, sie bullt oder sie rindert.“|„[Tierhalter zum Tierarzt] ‚Bessy hat noch nicht gebullt‘“			
hexen	verb			Diese Frau hext uns noch allen diese neue Seuche an den Hals!	practise witchcraft|do wonders|astound		
flammen	verb			„In der Sprache fließt Kraft, sprüht ein fester Wille, flammt ein Feuer.“			
erden	verb			„Esoterisch ausgedrückt: Ich musste mich wieder erden.“|„Ich musste wieder runter kommen und mich erden.“	earth|ground		
arten	verb			„Wie ist das Verbrechen geartet? Wie muss es geahndet werden?“			
bomben	verb			„Wir bombten mit B29, sie bombten zurück mit Artillerie, Mörsern und Panzern.“	bomb|slam		
herkommen	verb			Er kam her und fing sofort an ununterbrochen zu reden.|„Ich fühlte mich dort wohl und beschloß öfters herzukommen.“	come|derive|originate		
vergnügen	verb			Es vergnügt die Eltern, ihrem Sohn bei der Schulaufführung zuzuschauen.|Sie vergnügten ihre Zungen durch die erlesensten Speisen und besten Weine.	please|have fun		
vorbeikommen	verb			„Mahaney unterstützt die These, dass das karthagische Heer hier vorbeigekommen sei.“	drop by|come by|pass by|come over		
rausfinden	verb			Hast du was rausgefunden?|Es war gar nicht so einfach, den Nachnamen rauszufinden.	find out	bulup çıkarmak|çare bulmak	
hierbleiben	verb			„Ich kann nicht bleiben, so gern ich hierbliebe.“|„Er rief Jochmann nach: ‚Hiergeblieben! Wohin willst du?‘“|„Ich will noch eine Weile hierbleiben.“|„Ida sprang auf, sie wollte sowieso keine Minute länger hierbleiben.“	stay		
tränen	verb			Die Gase reizen die Schleimhäute und lassen die Augen tränen.|„Es ist ihr nicht peinlich, dass ich träne.“	tear		
wiederkommen	verb			Sie brauchen nicht wiederzukommen, die Behandlung ist abgeschlossen.	come back		
typen	verb			„Die Bearbeitung der Werkstücke erfolgt nach getypten technologischen Prozessen.“			
dunkeln	verb			Schnell nach Hause! Es dunkelt schon!			
loswerden	verb			[Schlagzeile:] „US-Wahl – Können die Republikaner Trump noch loswerden?“|[Schlagzeile:] „Hoeneß gibt zu: Einige Bayern-Spieler wollten Kovac loswerden!“|„[die "Berliner Zeitung" ist ihr] Ost-Image nie ganz losgeworden.“	get rid of		
zurückbringen	verb			Der Bürgerkrieg hat die Entwicklung des Landes um Jahrzehnte zurückgebracht.	bring back		
hosen	verb			Er beschrieb genau, wie der Fremdling sich gehost hatte.			
kunden	verb			Er aber stand auf und kundete seine Absicht mit lauter Stimme.			
schatten	verb			Erst den Enkel schattet ein gepflanzter Baum.|Du schattest meinen Ruheplatz und schirmst mich vor dem Sonnenlichte.			
seelen	verb			Was wohl leibt, das seelt übel.			
karten	verb			Wer gut mischt, kann gut karten.			
weitergehen	verb			Wie soll das bloß alles weitergehen?|Irgendwie muss die Geschichte ja weitergehen.			
lieb	adj			Das ist lieb von dir.	nice|dear	uslu	
Hammer	adj			Die Hammer Kirche wurde nach dem Krieg neu erbaut.	Hamm		
rot	adj			Der rote Knopf ist für den Notfall.	red	kırmızı|al-|kızıl|kızıl derili	sor
total	adj			Nach dem achtstündigen Marsch war ich total erschöpft.|Dass meine Tante aus Amerika gekommen ist, war die totale Überraschung!	total|complete		
blau	adj			Möchten Sie Ihre Forelle blau oder nach Müllerin Art?	blue|drunk|boozed|bluish	mavi|lacivert|sarhoş	şîn|serxweş
schwul	adj			Frank und Tom sind schwul.|„Schwule Männer galten als Weichlinge und minderwertig.“	gay		
geil	adj			Petra ist geil auf Martin.|„Er fühlte sich auf eine unverschämte Weise geil.“	horny|randy|super|awesome	azgın|şehvetli	
neu	adj			Die Schuhe sind neu und ungetragen.	new	yeni|peyda	nû
alt	adj			Die Schuhe sind alt und durchgetreten.	old	eski|yaşlı|ihtiyar	kevn
schön	adj			Sie hat schönes Haar. Das Musikstück ist schön.|„Die Herzen bebten über die Kühnheit des jungen, schönen, wagemutigen Paares.“	beautiful|nice	güzel|hoş|bir hayli|bir güzel	rind|delal
verrückt	adj			Der Typ ist total verrückt. Halt dich von ihm fern.	crazy|mad|moved|displaced	deli	
normal	adj			Ihr Blutdruck ist normal.	normal	normal	normal|asayî
müde	adj			Wenn ich müde bin, gehe ich zu Bett.	sleepy|tired	yorgun	
groß	adj			Der Baum ist aber nicht sehr groß für sein Alter.	big|large|adult|great	büyük|muazzam	mezin
frei	adj			Ich bin ein freier Mann und mache, was ich machen kann.|Die freie Lüftung eines Raumes kann durch das öffnen eines Fensters erfolgen.	emancipated|liberated|free|naked	özgür|serbest|hür	azad|serbest
arm	adj			Bei großen sozialen Einschnitten werden viele Leute arm.|„Reiche und Superreiche tragen zur Erderwärmung zigmal stärker bei als ärmere Menschen.“|Das ist eine arme Gegend hier.|„Ehemals arme Arbeiterviertel wandelten sich zu „IN“-Gegenden; die Immobilienpreise stiegen stark.“	poor|needy|unfortunate|wretched	fakir|zavallı|gariban|az miktarda	
lustig	adj			Ich kenne einen lustigen Witz.|Das finde ich gar nicht lustig.	funny|jocular|merry|gay	komik	
schwarz	adj			Mir fehlt die schwarze Druckerpatrone.|Wer will schon eine schwarz gestrichene Wand in seinem Haus haben?|Sie trägt aus Trauer um ihren Mann immer noch schwarze Kleidung.	black	kara|siyah	reş
verflucht	adj			Dieser Gegenstand ist verflucht.	damned|cursed		نهفرهتلێكراو
deutsch	adj			Er brachte seine deutsche Ehefrau mit.|„Wir Kinder, wir waren dabei, deutscher zu werden als alle Deutschen…“	German	Alman	alman
dumm	adj			3 mal 3 ist bei dir 5? Bist du dumm?	stupid|dumb		
langweilig	adj			Das ist ein langweiliges Buch.|Diesen Film finde ich langweilig.|„Es klingt nicht weltbewegend, eher langweilig und nach klassischem Graswurzelkampf.“	boring|dull	sıkıcı	
cool	adj			Cool brachte er die Sache hinter sich.|Trotz der angespannten Situation blieb er cool.|„Cool sein gehört einfach nicht zu den deutschen Tugenden.“	cool		
mächtig	adj			Der mächtige Tyrann war über die Ländergrenzen gefürchtet.	powerful|mighty|thick|master of	güçlü|müthiş|hâkim|çok	
wichtig	adj			Es ist ihm wichtig, dass du es weißt.|Er tut sehr wichtig. (Er ist ein Wichtigtuer)|„Bei akuten Verbrennungen ist das wichtigste Gegenmittel kaltes Leitungswasser.“|„Bewegen ist wichtig, ja, solange bis man nicht mehr kann!“	important|relevant|significant	önemli	giring
übel	adj			„Wenn es dir übel geht, nimm es für gut nur immer,	bad|sick|vile|wicked		
unheimlich	adj			Es herrschte eine unheimliche Dunkelheit.|Mir wird allmählich unheimlich zumute.	uncanny|weird|scary|eerily		
dick	adj			Die Wand ist aber dick.|Die Bretter sind 5 mm dick.|Und dann bekamen wir endlich einen dicken Auftrag.	thick|big|fat		
voll	adj			Ein voller Bus hält nicht mehr.|Die Packung ist noch voll.	full|sozzled	dolu|sarhoş|toplu|şişman	
allein	adj			Bei dieser Unternehmung sind wir allein.|Er ist allein einkaufen gegangen.|Sie fühlt sich sehr allein.|Er ist allein auf die Idee gekommen.|„Allein gelassen werden ist ein Gefühl, dass viele der Befragten teilen.“	alone		
süß	adj			Ach, ist das ein süßes Plüschtier, das du da hast!|Süßer die Glocken nie klingen, als zu der Weihnachtszeit.|Danke! Das ist aber süß! Dass ihr daran gedacht habt!	sweet|cute	tatlı	
wollen	adj			Die wollene Unterhose hält sehr warm.	woollen woolen		
weiß	adj			Du bist ja ganz weiß im Gesicht!	white|Caucasian	beyaz	spî|سپی
stolz	adj			Die bestandene Prüfung machte ihn sehr stolz.|Der stolze Vater gab auf die Geburt seiner Tochter einen aus.	proud|haughty|impressive|very tall		
grün	adj			Er mischte grüne und rote Farbe.	green	yeşil	kesk
französisch	adj			„Sie ist landschaftlich westlicher, man möchte ruhig sagen: französischer als alle.“|Die französische Küche ist weltberühmt.	French|oral|orally		
schlecht	adj			Die Messer sind von schlechter Qualität, sie schneiden nicht.	bad|shoddy|poor|rotten	kötü	
gemein	adj			All diesen Leuten ist die Muttersprache Deutsch gemein.|Hier wächst eine Gemeine Schlüsselblume.	common|mean		
schau	adj			Das Kleid ist wirklich schau.|Dein Freund ist ein schauer Typ, echt!.			
licht	adj			Der Wald ist hier sehr licht.|Seine Haare wurden schon lichter.	light|bright|clear|sparse		
billig	adj			Es ist nur billig, so zu entscheiden.	fitting|cheap|inexpensive	ucuz|basit	erzan
teuer	adj			Er hat ihr einen sehr teuren Ring geschenkt.|Auch teure Textilien sind kein Garant für faire Herstellung.|Dass der Brexit für die Briten teuer wird, ist schon länger klar.	expensive|dear	pahalı	
verliebt	adj			Ich bin in dich verliebt.|Verliebte Menschen haben die seltsamsten Einfälle.	in love|enamoured|fond|have a crush on someone	âşık	
gut	adj			Es geht mir gut.|Das hast du gut gemacht!	good|well	iyi	baş
klein	adj			Das ist ein kleines Haus.|Wale ernähren sich von Plankton und kleinen Fischen.	small|little|insignificant|uncapitalized	küçük	piçûk
lang	adj			Der Fastnachtszug war dieses Jahr besonders lang.|Sie hat sich ihre Haare wieder lang wachsen lassen.	long		
angenehm	adj			Ist die Temperatur des Wassers so angenehm?|Er ist ein angenehmer Zeitgenosse.|Eine Annehmlichkeit ist ein angenehmes Ereignis.	agreeable|pleasant	hoş	
okay	adj			Der zweite Teil war schon okay, aber der erste war Klassen besser.|Du bist so blass, bist du okay?	okay		
gerade	adj			Diese Strecke ist sehr kurvenreich, die andere ist viel gerader.|Lass uns den mittleren Weg nehmen, der ist am geradesten.	straight|even|frank|honest	düz|çift	
natürlich	adj			Die natürlichen Ressourcen sind begrenzt.|Dieser Bergkamm zieht eine natürliche Grenze.	natural|normal		
englisch	adj			Wir haben einen englischen Cockerspaniel.|Ihre Wurzeln sind englisch, nicht irisch oder walisisch.	English|rare		
romantisch	adj			Mein Freund ist sehr romantisch.	romantic	romantik	romantîk
hart	adj			Es war schon hart gefroren.|„Mit Gegenständen aus härteren Stoffen kann man weichere Stoffe ritzen.“|„Nach Diamant ist Korund das härteste Mineral.“	hard|unyielding|unmoved|cold	sert	
angesehen	adj			Albert Einstein ist ein weltweit angesehener Wissenschaftler.	respected|reputable|distinguished		
überlegen	adj			Paul ist im Sport immer überlegen.	superior|predominant	üstün	
fabelhaft	adj			Es war ein fabelhafter Abend.|Er kann fabelhaft kochen und sie ist eine begnadete Klavierspielerin.	fantastic|fabulous|great|tremendous		
fähig	adj			Sie ist eine fähige Mitarbeiterin.|Wir sind fähig, euch unsere Meinung zu sagen.	capable|able to|competent	ehil|kabil|mahir|muktedir	
egal	adj			Das ist mir so was von egal!|„»Ist mir egal« klingt für viele nach Wurschtigkeit und irgendwie beleidigend.“|„Aber ich merke, wie mir das immer egaler wird.“	all the same|level	farketmez	
böse	adj			Er ist ein durch und durch böser Mensch.	bad|evil|wicked|angry	kötü|fena|dargın|kızgın	
falsch	adj			Was habe ich denn falsch gemacht?	wrong|false|fake|deceitful		
rund	adj			Diese Figur ist rund (ist kreisförmig).	round|rotund|corpulent|regular	yuvarlak|şişman|düzenli	
in	adj			Der Sänger ist zur Zeit gerade in.	in		
niedlich	adj			Meine kleine Schwester hat sich einen niedlichen Teddybären gekauft.	cute|sweet	sevimli	
sauer	adj			Die Milch ist sauer geworden!	sour|annoyed|angry|pissed	ekşi	tirş
ein	adj			Ist der Schalter ein oder aus? (Ist der Schalter ein- oder ausgeschaltet?)	on		
großzügig	adj			Du bist ja sehr großzügig mit dem Trinkgeld.|„Nero bot den beiden dann großzügig das römische Bürgerrecht an.“	generous|permissive|spacious		
positiv	adj			Der Bewerber machte einen positiven Eindruck.|Sie freut sich über die positive Bewertung ihrer Arbeit.	positive	olumlu	
hungrig	adj			„Denn ich war hungrig und ihr habt mir zu essen gegeben; …“	hungry		birçî
schlau	adj			Max und Moritz waren sicherlich schlau, aber nicht gescheit.	sly|cunning|smart|clever	zeki|akıllı	
krass	adj			Das ist ein krasser Widerspruch.	crass|crazy|rad|wicked		
blind	adj			Er ist seit dem Unfall blind.	blind|sightless|blinded|opaque	âmâ|kör|çıkmaz|kaçak	
uniform	adj			Hochhaussiedlungen wirken oft uniform.	uniform		
hoch	adj			Die Hütte liegt hoch in den Bergen.|Das ist aber ganz schön hoch hier.|Die Schwalben fliegen heute wieder hoch.	high|tall|to the power of|to the	yüksek	bilind
laut	adj			Dreh bitte mal das Radio lauter!|Sie sprach sehr laut.|Der laute Lüfter ihres Computers ging ihr gehörig auf die Nerven.	loud		
erfahren	adj			Er ist ein erfahrener Handwerker.	experienced|expert	deneyimli|tecrübeli	
nah	adj			Der Schlüssel liegt zum Greifen nah auf dem Beistelltischchen.|Der Baum wächst nah am Abgrund.|Die Besucher der Messe kommen aus nah und fern.	near|close	yakın	
übertragen	adj			Das meinte ich sowohl im wörtlichen, wie im übertragenen Sinne.	figurative		
peinlich	adj			Es war ihm furchtbar peinlich, dass er seinen Geldbeutel verloren hatte.	awkward|embarrassing|cringy|unpleasant		
schwanger	adj			Ich bin schwanger, sagte Sandra und schaute ihren Freund frohgelaunt an.|„Weil Mama schwanger war, erhielt sie mehr Lebensmittelkarten als vorher.“	pregnant|gravid|with child	gebe|hamile|yüklü	
jung	adj			Das ist aber ein junger Mensch!|„Die Herzen bebten über die Kühnheit des jungen, schönen, wagemutigen Paares.“	young	genç	ciwan
kurz	adj			Es ist ein kurzer Weg bis nach München.|Die Tage werden länger und die Röcke kürzer.|Nimm das Messer, und dann hier kurz abschneiden.	short|brief		kurt
hell	adj			Er steht im hellen Sonnenlicht.|Das Musikzimmer war hell erleuchtet.	light bright|bright|sharp|smart		
reizend	adj			Marie ist ein reizendes Mädchen.	charming|lovely|irritating|irritant		
rauch	adj			Dieses Fell ist rauch.	thick		
dicht	adj			Der Hund hat sehr dichtes Fell.	dense|thick|close|tipsy	kesif|yoğun|sıkı|yakın	
toll	adj			Sind hier denn alle toll geworden?	crazy|insane|mad|wild	çılgın|kuduz olmak|harika	
stark	adj			Er hat viele Muskeln – er ist stark.|Es weht ein starker Wind.|Ein starker Mann kann schwere Sachen tragen.	powerful|strong|intense|solid	güçlü|kuvvetli|gür|kesif	
leise	adj			Im Raum ist es sehr leise, man hört keinen Ton.|„Er sprach leise mit ihnen, und plötzlich wurden aufgebrachte Stimmen laut.“	faint|low|muted|quiet	alçak sesle|sakin|sessiz|suskun	
gesund	adj			Ich bin vollkommen gesund.|Oh wie schön, dass du gesund zurückgekommen bist!|Ein gesunder Patient ist mir natürlich lieber als ein kranker.|Wird man wirklich gesünder durch die vorbeugende Einnahme von Nahrungsrgänzungsmitteln?|Vollkornbrot soll gesünder sein als Weißbrot.	well|sane|healthy|recovered	sağ|sağlıklı	
extrem	adj			Das ist ein extrem starker Kaffee.	extreme	aşırı	
brav	adj			Sie trägt eine brave Frisur.	obedient|well-behaved|conservative|upright		
nett	adj			Die Tochter des neuen Nachbars ist ein nettes Mädchen.	nice|cute	nazik	
richtig	adj			Richtiger gesagt: zwei verschiedene! Nicht nur einfach zwei.	right|correct|exact	doğru	rast
nackt	adj			„Ihre nackten Arme waren blaß.“	naked|bare|nude|bald	çıplak|nü|üryan|saçsız	
gleichzeitig	adj			Ich kann nicht gleichzeitig an verschiedenen Orten sein.	at the same time|contemporaneous|simultaneous		hevdem
scheinbar	adj			Dies ist ein nur scheinbar günstiges Angebot.|Die Unterredung zieht sich scheinbar endlos in die Länge.|Das Medikament bewirkte nur eine scheinbare Verbesserung.	pretended|seeming|apparently		
ganz	adj			Obwohl die Vase auf den Boden gefallen ist, ist sie noch ganz.	intact|whole|full|complete		
nahe	adj			Ein weiterer Vorteil der Wohnung ist der nahe gelegene Bahnhof.	near|nearby|close	yakın	nêzîk
fern	adj			Ich träume vom Leben in einem fernen Land.	far	uzak	
spät	adj			Wir feierten bis in die späte Nacht.|Der späte Bote brachte die erwartete Nachricht.	late|tardy|early|fresh	geç	dereng
früh	adj			Nach der sehr langen Feier gingen die Gäste erst am frühen Morgen.|„Früh hatte der Ostgote begonnen, verwandtschaftliche Bande zu anderen Königshäusern zu knüpfen.“|„Die besten Hängegleiter erzielen heute Flugleistungen, die an die früher Segelflugzeuge anknüpfen.“	early	erken	zû
weit	adj			Das WWW ist ein weites Feld.	vast|far|wide	geniş	
super	adj			Dass der Torwart den Elfmeter gehalten hat, ist einfach super.|(adverbiell:) Meine Frau hat das super gemacht.|Die Italiener hatten eine super Mannschaft. (www.zeit.de)	super	süper	
intelligent	adj			Das Wikikonzept ist eine intelligente Lösung.|„Skorzeny war nicht nur ein Draufgänger, sondern auch sehr intelligent.“	intelligent|smart	zeki	biaqil|hişmend|bîrbir|jîr
später	adj			Der Abend wurde immer später.|Je später der Abend, desto interessanter die Gäste.	later|future|subsequent		
blöd	adj			Du bist so blöd, du verstehst nichts, was man dir erklärt!|Das war ein ganz blöder Fehler, ich habe die Nachkommazahl verdreht.	stupid|silly|frustrating	aptal|bön|usandırıcı	
tief	adj			Der Atlantik ist an manchen Stellen sehr tief.|Er flog viel tiefer, um dem Radar zu entgehen.	deep|profound	derin|koyu	bêbinî|kûr
spanisch	adj			Der spanische Außenminister ist heute in Berlin.	Spanish	İspanyol	
ungewöhnlich	adj			Ungewöhnliche Zeiten erfordern ungewöhnliches Handeln.|Am ungewöhnlichsten jedoch war ihre Art zu laufen.	unusual|unwontedly		
heimlich	adj			Während der Arbeit benutzte Matthias heimlich das Internet.|Die heimliche Affäre des Präsidenten wurde nun doch öffentlich.	secret|covert|clandestine		
sinnlos	adj			Gegen Windmühlenflügel zu kämpfen ist sinnlos.	senseless|absurd		
dünn	adj			Ich hätte gerne eine dünne Scheibe Brot.|Das ist ja mal ein dünnes Kind.	thin|weak	ince	tenik|zirav
weise	adj			Er ist ein weiser Mann.|Die achtzig Jahre ihres Lebens haben sie weise werden lassen.	wise		
grausam	adj			Ein grausamer Zug lag um seinen Mund.|„Das Schicksal ist launisch und grausam.“|„Unsere jungsteinzeitlichen Vorfahren praktizierten offenbar eine besonders grausame Form der Menschenopfer.“	cruel|brutal|fierce|cold-blooded	dehşet verici|zalim|acımasız|merhametsiz	
brutal	adj			Er war schon immer ein brutaler Mensch.	brutal|violent brutish|violent brute|tough		
kalt	adj			Ein kalter Wind wehte von Osten.|„Bei akuten Verbrennungen ist das wichtigste Gegenmittel kaltes Leitungswasser.“|Kommt ins Haus, Essen wird kalt!	cold|cool|chilly|freezing		sar
möglich	adj			Es ist für uns einfach nicht möglich, die Zeit zurückzudrehen.|Wäre es möglich, hier eine Nachricht zu hinterlassen?|Das wäre mit ihm nicht möglich gewesen!|Die Ärzte taten alles, was möglich war, um ihn zu retten.|Wennimmer möglich, benutzen sie öffentliche Verkehsmittel.	possible|potential	mümkün	
menschlich	adj			Affen zeigen viele menschliche Eigenschaften.	human|humane	insânî	mirovî
offiziell	adj			Ich habe eine offizielle Genehmigung, dieses Haus abreißen zu dürfen.	official|officially		fermî
früher	adj			Die Filme des früheren 20. Jahrhunderts gefallen mir besser.	early|former|erstwhile		
wunderschön	adj			An einem Tag, so wunderschön wie heute, ist es dann passiert.|So wunderschön es auch war, ich muss jetzt nach Hause fahren.|Meine Tante Helga konnte wunderschön erzählen.	wonderful|gorgeous|swell|beautiful		pir delal|ciwan|delal
ziemlich	adj			„Regierungstechnisch ist der Zugewinn an Gestaltungsfreiheit eine ziemliche Herausforderung.“|Das war schon eine ziemliche Enttäuschung, als wir unsere Teilnahme zurückziehen mussten.	considerable|substantial		
live	adj			Die Fernsehübertragung ist live.|Wir können uns auf weitere live gesendete Auftritte freuen.|Die Künstlerin tritt nicht so gerne live auf.	live		
real	adj			Die digitale Welt ist nicht real.	real|natural		
schnell	adj			Heute nehme ich den schnelleren Zug.|„Beim Bodyflying werden Sie durch einen 180 km/h schnellen Luftstrom aufwärts getrieben.“|Sie ist wirklich schnell, kein anderer schafft soviel an einem Tag.	fast|quick|rapid|swift	hızlı|süratli|seri|tez	zû|bilez
hässlich	adj			Zieh bloß dieses hässliche Kleid nicht mehr an!|„Hässlich, ich bin so hässlich, so grässlich hässlich:“	ugly|nasty	çirkin	
online	adj			Zwischen Rechnern, die online sind, können Daten auch direkt übertragen werden.|Die Daten wurden auf einen WWW-Server hochgeladen und sind somit online.	online	çevrimiçi	
gleich	adj			Das Fell eines Hundes ist dem einer Katze gleich.|Wir haben ja die gleichen Schuhe an!	equal|like|similar		
schwer	adj			Der Amboss war extrem schwer.	heavy|difficult|hard|grave		giran
leicht	adj			Das ist aber ein sehr leichtes Fahrrad. Das wiegt ja fast nichts!|Ich hätte gerne ein leichteres Paar Schuhe.	light|easy|readily|slightly		sivik|hêsan
einfach	adj			Die Klassenarbeit in Französisch war sehr einfach.	simple|simply|easy|single	kolay|tek|tekrarlanmayan|mütevazi	hêsan
schwierig	adj			Die Schulaufgabe ist schwierig.	difficult	zor	
wundervoll	adj			In der Karibik ist es wundervoll.	delightful|marvellous|marvelous|wonderful		
genial	adj			Er hat lauter geniale Ideen.|Sie ist einfach genial.	ingenious|brilliant		
klug	adj			Meine Klassenkameraden sind alle sehr klug.	clever|intelligent|smart|judicious		
brillant	adj			Diese Idee war brillant.	brilliant		
offen	adj			Durch ein offenes Fenster konnten die Diebe leicht in die Wohnung eindringen.|„Offene Brandwunden sind ein idealer Nährboden für Bakterien und infizieren sich oft.“|[Schlagzeile:] „US-Gefangenenlager auf Kuba - Guantánamo soll weitere 25 Jahre offen bleiben“	open	açık	
kaputt	adj			Die Waschmaschine, die ich eben als „neuwertig“ gekauft habe, ist leider kaputt.	broken|bust|broken-down|out of order	bozuk|kırık|bitkin|yorgun	
glatt	adj			Die Oma hatte eine Haut so glatt wie mit zwanzig.	smooth|slippery|icy|plain		
momentan	adj			Momentan habe ich sehr wenig Zeit.|Eine Versetzung ist momentan leider nicht möglich.	current|at the moment|currently|instantaneous	şu anki	
sexy	adj			Er findet Jule sexy.|„Was sie für Paul aber sexy machte, war ihre Jugendlichkeit.“	sexy		
langsam	adj			Eine Schnecke bewegt sich im Vergleich zu einem Verkehrsflugzeug sehr langsam.	slow|slowly|step by step	yavaş|ağır|bati|aheste aheste	hêdî
taub	adj			Er ist von Geburt an taub	deaf|insensitive|numb	sağır|uyuşuk	
heiß	adj			Jetzt ist mir aber heiß.|Gestern war es heißer als heute.|„Es war ein sehr heißer Tag, und es wurde immer heißer.“	hot|on heat|in heat	sıcak	
ausgezeichnet	adj			Alle mit dem Sportabzeichen ausgezeichneten Sportler sind zum Empfang geladen.	decorated|excellent|marvellous|marvelous		xelatikirî
zuständig	adj			Der Landrat war in diesem Fall die zuständige Behörde für das Einschreiten.|Irgendjemand muss doch für diese Frage zuständig sein.|Das Innenministerium erklärte sich für nicht zuständig.	responsible for|in charge of	yetkili|ilgili|sorumlu	
treu	adj			Frau Müller ist ein treuer Kunde von uns.	loyal		dilsoz|wefadar|pêgir|pabend
leer	adj			Die Flasche ist leer.|»Ich trinke nur noch mein Glas leer, dann gehe ich.«|»Mein Magen ist leer, ich muss unbedingt etwas essen.«	empty|deserted	boş	vala
sicher	adj			Sie verstauten das Geld an einem sicheren Ort.|„Fliegen war noch niemals so sicher, wie heute“, behaupten die Luftverkehrsunternehmen.	safe|sure|certain|self-assured	emin|muhtemel|olası|kat'î	
nass	adj			Nach dem Regen ist das Gras nass.	wet	ıslak	
willkommen	adj			Du bist uns stets ein willkommener Gast!	welcome	hoş geldiniz	
eben	adj			Die ebene Landschaft erstreckt sich bis zum Horizont.|Die Gegend um Plattling ist völlig eben.	even|plain|smooth	dümdüz|düz|yayvan|engebesiz	
wirklich	adj			Peter hatte sich die Geschichte nicht ausgedacht. Sie war wirklich passiert.|Im wirklichen Leben ist sie Verkäuferin.|Wirklich? Du hast sie eben noch am Bahnhof gesehen?	real|natural|true|genuine	gerçek	
vollständig	adj			Ein vollständiger Satz Briefmarken ist wertvoller als ein unvollständiger.	complete|whole|total|entire	tam|tamamen|eksiksiz|bütün	
ergeben	adj			Manch ein Reicher sucht sich ergebenes Personal.	devoted|loyal|obedient		
verlassen	adj			Das Kind stand verlassen am Straßenrand.	abandoned|alone		
dunkel	adj			Im Winter wird es früher dunkel.	dark|sneaking|uncertain|grave	karanlık	tarî
interessant	adj			„Das Buch solltest du lesen, das ist interessant.“|Indien ist ein sehr interessantes Land.|Ich finde, sie ist eine interessante Frau.|Es gab viele interessante Gespräche.	interesting	ilginç	
interessiert	adj			Sie war schon immer vielseitig interessiert.|Michael ist ein sehr interessierter Schüler.	interested		
perfekt	adj			Sein Lauf war perfekt. (Er hätte nicht besser laufen können.)|„Er war so perfekt wie aus dem Mund einer Germanistin.“|Seine Aussprache des Englischen ist perfekt. (Es gibt daran nichts zu korrigieren)|Das ist ein perfekter Plan. Er kann nicht schiefgehen!	perfect		
locker	adj			Dieser Schal ist locker gestrickt.	loose|relaxed|laid-back|easygoing		
selten	adj			Mondgestein ist auf der Erde ein seltenes Material.	rare|seldom|sometimes|rarely	nadir|nadiren	kêmpeyda|kêm caran
tapfer	adj			Sie griff beim Essen tapfer zu. (Sie aß viel.)	brave|courageous|stalwart|valiant	cesur|korkusuz	
weich	adj			Ihm wurde weich ums Herz.	soft|weak|mellow		
gar	adj			Der Kuchen ist schon gar und ich habe kein Stück abbekommen.|Die Ferien sind gar, jetzt beginnt wieder der Ernst des Lebens.	done|cooked		
fröhlich	adj			Es ist eine fröhliche Gesellschaft.	merry|happy|cheerful|bright	neşeli	
nämlich	adj			Die Zeitung kommt jeden Morgen zur nämlichen Zeit.	same	aynı	
fest	adj			Heute ist nun das Eis auf dem Teich fest.	solid|fixed|permanent|stable	katı|sabit|dayanıklı|katî	
direkt	adj			Der direkte Weg vom Bahnhof zum Rathaus ist die Hauptstraße.|Das Hotel liegt direkt am Meer.|Der Richter wandte sich direkt an den Angeklagten.|„Kelheim: Münchens direktester Zugang zum europäischen Wasserstraßennetz“	direct	direk|doğrudan	rasterast|yekser
scharf	adj			Das Messer ist so scharf, dass es ein Seidentuch zerschneidet.	sharp-edged|sharp|hot|spicy	keskin	
illegal	adj			Drogen wie Kokain und Heroin sind in Deutschland illegal.|„Die illegalsten Websites der Welt - Teil 1“	illegal|illicit|clandestine		
verheiratet	adj			Das seit 10 Jahren verheiratete Paar hat keine Kinder.	married	evli	
eigentlich	adj			Sein eigentlicher Name ist Hase, aber er bevorzugt ein Pseudonym.	proper	gerçek|asıl|hakiki|esas	
betrunken	adj			Heike ist jedes Wochenende betrunken.	drunk|ebrious|full|drunken	içkili|sarhoş|hoş	serxweş
gefährlich	adj			Die Kreuzung erwies sich immer wieder als sehr gefährlich.|„Das Bundesarbeitsgericht hat sogar das Drachenfliegen als nicht besonders gefährlich angesehen.“	dangerous|hazardous|perilous|risky	tehlikeli	metirsîdar
ewig	adj			Sie sind ewig in Liebe verbunden.|Uns ist das Ewige Leben versprochen.	eternal		ebedî
fett	adj			Die Thunfische werden in Umzäunungen gehalten und gefüttert, bis sie fett sind.	fat|rich|bold|fertile		
enttäuscht	adj			Er machte ein sehr enttäuschtes Gesicht.	crestfallen|disappointed		
verboten	adj			Rauchen ist in diesem Gebäude strengstens verboten.|„Wenn diese Berichte von Gewalttaten oder verbotener Leidenschaft handelten, dann umso besser.“	forbidden|prohibited|verboten		
schmutzig	adj			Die Tischdecke war schmutzig.	dirty|filthy	çirkin|iğrenç	
pünktlich	adj			Du musst unbedingt pünktlich kommen, sonst verpasse ich den Höhepunkt!	punctual	zamanında|vakitlice	di dema xwe de
ehrlich	adj			„Ich bin in dich verliebt.“ - „Ehrlich?“|Es lag ehrliche Trauer in ihrer Stimme.|„Findest du mich schön? Sei ehrlich!“	real|really|honest	dürüst	
scheiße	adj			„Ich finde ihn echt scheiße.“|Das hört sich doch scheiße an!	crappy|shit|shitty		
verwirrt	adj			„Wie heißt du nochmal?“, fragte sie ihn verwirrt.|Verwirrt irrte er durch die Gänge.	confused		
hinter	adj			Der hintere Mann überragt den Vorderen um einige Zentimeter.|Die Meldung ist bis in die hintersten Reihen durchgekommen.		arka	
high	adj			Jimmy war mal wieder total high.	high		
sanft	adj			Er kraulte ihr sanft den Nacken.|„Nun beruhige dich doch“, sagte sie sanft.	gentle|suave|soft	yumuşak	
sauber	adj			Das Hemd ist sauber.|Das Wasser ist sauber.	clean|accurate|well done	temiz	
eng	adj			Ich habe wohl zugenommen, meine Hose ist jetzt etwas eng.|In der engen Gasse war ein Überholen unmöglich.|Wenn du auch noch zum Bäcker willst, wird es eng.	tight|narrow|close|intimate	yakın	teng|nêz|nêzîk
genau	adj			Sie ist in Geldangelegenheiten sehr genau.|Sie müssen genau haushalten.|Er nimmt es mit dem Geld nicht so genau.|„Eure Befehle sollen schnell und genau befolgt werden.“ _(Goethe)|„Doch bei genauerer Betrachtung bleibt sie auch damit sich selbst treu.“|Also, der nimmt's jetzt zu genau.	truly|strictly|exact|precise		
rein	adj			Die Wäsche ist nicht nur sauber, sondern rein.	clean|pure|sheer|mere		
klar	adj			Heute soll es klares Wetter geben.|Heute ist das Wasser ganz klar, man kann den Grund sehen.|Sie antwortete mit klarer Stimme.|Dieses klare Rot gefällt mir besser als das abgetönte.	clear|lucid|obvious|clear to go	açık|bariz|belirgin|belli	
recht	adj			Ich habe mir den rechten Arm gebrochen.	right		
knapp	adj			Das Essen wird rationiert, denn unsere Vorräte sind knapp bemessen.|Rechne lieber noch einen Meter drauf, sonst ist mir das zu knapp.|Das Angebot an qualifiziertem Personal wird immer knapper.|Der weltweit steigende Preis signalisiert, dass Erdöl knapp wird.|Die Mehrheit im Parlament ist mit zwei Stimmen extrem knapp.|Bezahlbarer Wohnraum in den Innenstädten wird knapp.|„Doch das Ballungsgebiet hat auch Nachteile: Bezahlbarer Wohnraum wird knapp.“	tight|scant|succinct|terse		
ruhig	adj			Wir verleben einen ruhigen Nachmittag.	quiet|silent|still	rahat|sakin|durgun|heycansiz	
deutlich	adj			Zwischen den beiden Materialien war ein deutlicher Unterschied zu tasten|Die Worte waren deutlich hinter der Tür vernehmbar.|Am Telephon: »Könnten sie deutlicher reden? Ich verstehe sie leider kaum.«	clear|distinct|marked		
wild	adj			Viele Menschen haben Angst vor wild lebenden Tieren.|Wir haben wilde Beeren im Wald gepflückt.	wild|feral		
endgültig	adj			Meine Einstellung zu ihm ist jetzt endgültig.	final|definitive		
erneut	adj			Der Klub versucht in einem erneuten Anlauf die Tabellenspitze zu erreichen.	again|anew	yine|tekrar|yeniden	
komplett	adj			Das komplette Haus ist jetzt saniert.|Wir müssen den kompletten Außenbereich überwachen.	complete	komple|tam|tamam	
wahrscheinlich	adj			Der wahrscheinliche Mörder wurde gestern verhaftet.	likely|probable|supposable|verisimilar	muhtemel|olası	
gemeinsam	adj			Die beiden Länder verfolgen gemeinsame Interessen.	common|mutual|shared|jointly		
ständig	adj			Das ist mein ständiger Wohnsitz.|Im Flughafenbistro ist ständig Betrieb.	persistent		
ungefähr	adj			Mir würden schon ungefähre Angaben zum voraussichtlichen Preis genügen.|Haben Sie eine ungefähre Vorstellung, wann der Zug ankommt?	approximate|roughly|about|around		
höflich	adj			Es ist höflich, „bitte“ und „danke“ zu sagen.|„… wenn Sie höflich sind, ist das Gegenüber unwillkürlich auch höflicher.“|„Bleib höflich und sag nichts - das ärgert sie am meisten.“	polite|suave|debonair|courteous		
negativ	adj			Das wird sich negativ auf ihre Zukunft auswirken.	negative	olumsuz|eksi|negatif	
zufällig	adj			Zufällig traf ich sie wieder.	by chance|by luck|casual|random		
hübsch	adj			Ein hübsches Mädchen sitzt dort.	nice|pretty	güzel|sevimli|şirin|yakışıklı	
warm	adj			Der Sommer war recht warm.|„Damit etwas wärmer wird, muss man Energie zuführen.“|„So ist es seit 1881 in Hamburg etwa 1,7 °C wärmer geworden.“	warm	sıcak|eşcinsel	germ
reich	adj			Bill Gates ist ein reicher Mann.|Durch Spekulation reich werden zu wollen ist einfach die falsche Idee.	rich|abundant|copious|precious	zengin|muhteşem	dewlemend
verantwortlich	adj			Eltern sind verantwortlich für ihre Kinder.|Du bist mir für die Reisekasse verantwortlich!	responsible	mesul|sorumlu|mesuliyetli|sorumluluklu	
notwendig	adj			Die Regierung verabschiedete eine notwendige Gesetzesreform.	necessary	gerekli|lazım|zorunlu	pêwîst
besser	adj			Hast du eine bessere Antwort?|Der Rote wäre doch die bessere Wahl gewesen.|Die besseren Wanderschuhe sind schon alle ausverkauft.|Linda hat was Besseres verdient als den Kerl.|Das ist meine bessere Hälfte.	better		baştir|çêtir
endlich	adj			Das Universum ist sehr groß, aber endlich.	limited|finite		bidawî
plötzlich	adj			Plötzlich kam ein alter Mann in den Laden.|Was soll denn dieser plötzliche Aufbruch?|Mein Vater ist ganz plötzlich gestorben.|„Eine plötzliche Vertragskündigung durch Yahoo beendete laut dem Verein die Geschäftsbeziehung.“	suddenly		
eifersüchtig	adj			Ich bin nicht eifersüchtig, wie oft soll ich das noch sagen!|Ihr zweiter Mann ist noch eifersüchtiger als der erste.|Die eifersüchtige Sekretärin verfolgte die Frau ihres Chefs.|Du bist doch nicht etwa eifersüchtig auf mich?|Eifersüchtig musterte sie ihre Rivalin.	jealous	kıskanç	hesûd|çavnebar
kürzlich	adj			„Falls kürzlicher Krankheitsbeginn, sollte zur Verlaufskontrolle eine weitere Blutprobe untersucht werden.“	recent		
traurig	adj			Warum bist Du heute so traurig?|Ich habe neulich einen sehr traurigen Film gesehen.	sad|unhappy|sorry		
köstlich	adj			Das Essen ist köstlich.	delicious|exquisite|amusing|costly		
beschissen	adj			Mein Leben ist beschissen.|Noch beschissener kann's ja kaum gehen!|Ein derart beschissenes Theaterstück habe ich noch nicht gesehen.	crappy|shitty		
riesig	adj			Bei der Kollision wurde ein riesiges Loch in die Bordwand gerissen.|Auf der Messe herrschte ein riesiger Andrang.|„Viele Konzerne verursachen riesige Mengen CO₂.“	gigantic|huge|giant|great	koskocaman|harika	
paar	adj			Unpaare und paare Flossen sind vorhanden, …|… Strauch, mit vielen Zweigen, wechselweise stehenden gefiederten (10–16 paaren) Blättern, …	paired|in pairs|pairwise		
rosa	adj			Sie hat einen rosa Pullover an.|„Die Wände des Wohnzimmers waren rosa.“	pink	pembe	
täglich	adj			„Wie gesund ist unser täglich Brot?“|Füttern gehört natürlich zu unseren täglichen Aufgaben.	daily		
albern	adj			Die Kinder sind heute besonders albern.|Nun setzt mal die alberne Pappnase ab!	silly|childish		
gerecht	adj			Durch das Urteil erhielt der Verbrecher doch noch seine gerechte Strafe.	fair|just|conforming	adil|haklı|meşru|münasip	
gewöhnlich	adj			Sie antwortete wie gewöhnlich.|Für gewöhnlich sind sie pünktlich.|Das ist ein für eine Mutter ganz gewöhnliches Verhalten.	usual|ordinary|common	sıradan|alışılagelmiş|adi	
fein	adj			Dazu benötigen wir einen sehr feinen Draht.	delicate|fine|good|polite	ince|narin|zarif|edepli	
prima	adj			Alles muss raus: prima Bananen 1 kg 0,99 €	super|excellent		
geheim	adj			Die Industrie hält ihre neuesten Produkte bis zur Serienreife geheim.	secret|confidential|hidden		
freundlich	adj			Der Verkäufer ist freundlich.|„Er ist ein sehr freundlicher und äußerst hilfsbereiter Mitbürger.“	friendly|cordial|affable|pleasant	güleryüzlü|hoş|güneşli	
dringend	adj			Schnell, es ist dringend!|Ich muss mal ganz dringend aufs Klo!|Ich hab vergessen den Herd auszumachen, ich muss dringend zurück nach Hause.|Diesmal ist es noch dringender als beim letzten Mal.	badly|urgent|strong	acil	
dämlich	adj			Er war ein selten dämlicher Hund!|Dämlicher hättest du dich auch nicht anstellen können!	stupid|sodding		
krank	adj			Er muss im Bett liegen, weil er krank ist.|Auch schlechte soziale Umstände, wie Armut, Lärmbelastung, enge Wohnverhältnisse, machen krank.|„Alexander ist noch viel kranker, als wir angenommen haben.“	ill|sick	hasta|hastalıklı	nexweş
wahr	adj			Ist es wahr, dass du geheiratet hast?|Wahr oder falsch, wer will das genau sagen bei all der Propaganda.	true		
korrekt	adj			Deine Lösung ist korrekt.	correct		
komisch	adj			Die „Hochzeit des Figaro“ ist eine komische Oper.	comic|funny|strange|weird	komik|acaip	
bar	adj			Er kam baren Hauptes.	bare|cash|pure|plain		
witzig	adj			Mein Bruder ist sehr witzig.	funny|facetious|jocular|resourceful	komik|esprili|garip|tuhaf	
clever	adj			Er ist ein besonders cleveres Kerlchen.|Du glaubst wohl, du bist besonders clever, oder was?|Sie haben für den Geldtransfer eine wirklich clevere Methode gefunden.|Deinen Vater zu fragen war aber nicht besonders clever.|Das war aber eine wirklich clevere Idee!|Glückwunsch, cleverer kann man das wohl kaum lösen.	clever|cunning|smart		
angeblich	adj			Angeblich trifft er einen prominenten Gast.	alleged|supposedly|putative		qaşo
plan	adj			Die Platte wird zuerst plan geschliffen.|„Schmirgiel“ schleift nicht nur eben, sondern plan!	plane|planar		
schwach	adj			„Ich fühle mich so schwach, dass ich nicht mehr weitergehen kann.“|In einem schwachen Moment hat sie dann doch zugestimmt.	weak|feeble		
unhöflich	adj			„Sei doch bitte nicht so unhöflich zu deinem lieben Onkel!“|Er ist ein sehr unhöflicher Junge und missachtet stets die Bedürfnisse anderer.	discourteous|impolite		
offensichtlich	adj			Den Wolken nach zu urteilen, wird es offensichtlich regnen.	apparent|apparently|obvious|obviously	görünüşe göre|açıkça|aşikar|besbelli	
jahrelang	adj			„Die Folgen der Grausamkeiten spürt Elisa bis heute, trotz jahrelanger Psychotherapie.“	for years|longstanding|long-standing|in years		
unglücklich	adj			Sie ist ganz unglücklich, weil ihre Katze eingegangen ist.	unhappy		
still	adj			Er war schon immer ein stilles Kind.|Plötzlich wurde es so still, dass man eine Stecknadel hätte fallen hören.|Der ständige stille Vorwurf in den Augen der Mutter schmerzte ihn.	still|quiet|silent|secret	durgun|hareketsiz|tenha|sessiz	
nötig	adj			Das war doch gar nicht nötig!|Nötige Reformen sind bislang unterblieben.	necessary	gerekli|lazım|zorunlu	
unglaublich	adj			Er erzählt gerne unglaubliche Geschichten.	incredible|unbelievable	inanılmaz	
heftig	adj			Heftiger Wind schlug uns ins Gesicht.|Was er uns anbot, war ganz schön heftig.	hefty|intense|violent|heavy	yoğun|etkileyici|çarpıcı	
streng	adj			Uns steht eine strenge Zeit der Enthaltsamkeit bevor.	strict|sternly|hard		
frisch	adj			Am liebsten koche ich mit frischem Gemüse.|„Für Gerichte mit rohen Eiern verwenden Sie am besten möglichst frische Eier.“	fresh	taze|serin	
glücklich	adj			In Erzählungen enden die meisten Abenteuer glücklich.|Odysseus kehrte nach Jahren glücklich zu seiner Penelope zurück.	lucky|happy|fortunate	sanslı|başarılı|muvaffakıyetli|kutlu	
bestimmt	adj			Der Aufzug kann höchstens eine bestimmte Anzahl von Personen befördern.|Suchst du ein bestimmtes Buch?	certain|definite	belli|muayyen|kat'î|kesin	
völlig	adj			Ich bin mit dir völlig einverstanden.|Was der da erzählt, ist doch völliger Unsinn!	absolute|absolutely|altogether|all	büsbütün|tam|tamamen	
großartig	adj			Das hast du großartig gemacht!|Er ist ein großartiger Mensch.|Alle Freunde zu der Feier einzuladen, ist eine großartige Idee.	brilliant|awesome	fevkalade|olağanüstü|mükemmel|görkemli	
mies	adj			Es sieht damit mies aus.|Das ist der mieseste Laden, den ich seit langem gesehen habe.|Das ist eine miese Sache.	poor|wretched|bad|lousy	kötü	
extra	adj			Beim Essen sind meine Kinder schon sehr extra.			
echt	adj			Die Briefmarke ist echt und keine Fälschung.|Es handelt sich hier um die echten Dokumente.	real|genuine	gerçek|hakiki	
ring	adj			Die ringste Tanne maß 14 Zoll.|Der erste Sack war von ringem Gewicht.|Das war ein ringer, trockner Winter.|Er schätzte sich selbst zu ring.			
verbunden	adj			Mit deinem verbundenen Arm solltest du vorsichtiger sein.	connected|interconnected|related		girêdayî
benutzt	adj			Benutzte Taschentücher sollten so entsorgt werden, dass es hygienisch ist.	used		bikaranî
scheißegal	adj			Es ist mir ehrlich gesagt scheißegal, was er dazu meint.			
doppelt	adj			„Das doppelte Lottchen“ ist ein Kinderbuch von Erich Kästner.|Einen Kognak, aber einen doppelten bitte!	double	çifte|duble|ikişer	
verlegen	adj			Die Anwesenheit einer schönen Frau macht mich stets verlegen.	abashed|shy|lacking		
froh	adj			Frohe Gesichter machen zufrieden.|Nachdem die Feinde vertrieben worden waren, waren die Bürger froh.	happy|merry|glad		
vorsichtig	adj			Sei vorsichtig, wenn du über die Straße gehst!	careful|wary|chary|circumspect		
matt	adj			Herr Doktor, ich fühle mich immer so matt!|Ein matter Schlussapplaus beendete die peinliche Vorstellung.|„Nach dem Essen hatte Ida sich etwas matt gefühlt und bald zurückgezogen.“	weak|dull|mat|frosted		
matt	adj			Er war schon nach zehn Zügen matt.	mate		
seltsam	adj			Dieser Apfel hat eine seltsame Form.|„Sie hatte einen etwas seltsamen Mann geheiratet.“	bizarre|eerie|strange|uncanny		
selbstverständlich	adj			Dieser Gedanke ist selbstverständlich.	natural|self-evident		
wunderbar	adj			Obwohl alle Tiere männlich waren, vermehrten sie sich auf wunderbare Weise.	miraculous|wonderful|marvellous|marvelous		
typisch	adj			Typisch ist die dunkelrot gefärbte Brustbefederung.|Der typische Leser des Magazins ist unter 30 und Alleinstehender.	typical	tipik	tîpîk
schlimm	adj			Deine schlimme Handschrift kann kein Mensch lesen.	bad|terrible|serious	kötü	
faul	adj			Es roch stark nach Schwefelwasserstoff, das ist der typische Geruch fauler Eier.	rotten|idle|lazy|slothful	bayat|çürük|tembel|bozuk	tiral
eklig	adj			In dem Raum herrschte ein überaus ekliger Geruch.|Ich finde Schnecken eklig.	disgusting|icky|yucky		
friedlich	adj			„Wir lebten damals in friedlichen Zeiten.“	amicable|peaceful|pacific|placid		
furchtbar	adj			Das ist ja furchtbar.	terrible	berbat	tirsnak|bitirs
unangenehm	adj			In der Wohnung schlugen ihr unangenehme Gerüche entgegen.|Am unangenehmsten war mir dieser eine Gast.	disagreeable|nasty|unpleasant|uncomfortable		
geschickt	adj			Der neue Lehrling ist nicht sehr geschickt.	skilled|handy|deft		
trocken	adj			Das Handtuch ist trocken.	dry		ziwa
absolut	adj			Dieses Gesetz garantiert absolute Glaubensfreiheit.|Das hat absolute Priorität.|Hier ist absolutes Halteverbot.	absolute	mutlak|salt	serberdayî
unbedingt	adj			Ihre unbedingte Anwesenheit ist erforderlich.|Sie wollte diese Schuhe unbedingt.	unconditional|absolute|by all means|at all events		
bloß	adj			Mit bloßen Füßen lief sie durch den Schlamm.|Das Baby hatte sich bloß gestrampelt.	bare|just		
öffentlich	adj			Ich besitze keinen Wagen, deshalb benütze ich die öffentlichen Verkehrsmittel.|„Pocketbikes sind für öffentliche Straßen nicht zugelassen.“	public		
verschlossen	adj			Die Tür ist verschlossen.	locked|reserved|taciturn	kilitli|içe kapanık	
herrlich	adj			Ein herrlicher Sommertag auf einer grünen Wiese ist immer wieder etwas Besonderes.|Wir hörten einen herrlichen Vortrag über die Architektur der vergangenen vier Jahrzehnte.|Der Abend mit Konrad war herrlich.|„Sie kenne kein herrlicheres Bier als das tschechische, lobte sie.“	marvellous|marvelous|magnificent|wonderful	fevkalade|harikulade|mükemmel|yetkin	
persönlich	adj			Ich habe eine persönliche Einladung vom Direktor bekommen.	personal|personally|in person		
kompliziert	adj			Die Einsteinsche Relativitätstheorie ist mir zu kompliziert.	complicated|difficult|sophisticated|tricky	karmaşık|komplike	
ähnlich	adj			Vater und Sohn sind sich sehr ähnlich.|Dein Kind sieht dir sehr ähnlich.	similar|alike	benzer|mümasil|müşabih	
nutzlos	adj			Die Anstrengungen waren völlig nutzlos.	useless|futile		
vergeben	adj			Meine Tochter ist bereits vergeben, sie heiratet nächste Woche.	taken		
tatsächlich	adj			(adverbiell:) Der Dozent ist tatsächlich netter, als ich gedacht hatte.	real|actual|as a matter of fact		
halb	adj			»Die werden halb Frankreich alarmiert haben.«|Er verbringt den halben Tag vor dem Computer.|Ein halbes Dutzend sind 6 Stück.|„Im Jahr 1942 hatte Nazi-Deutschland halb Europa besetzt.“|adverbial: Um drei schaute ich auf mein Bierglas. Es war halb leer.	half		
fertig	adj			Nächste Woche sind wir damit wohl fertig.|Die fertige Jacke wird dann noch aufgebügelt.	done|ready|finished|exhausted	tamam|hazır|bitmiş|hünerli	
hilfreich	adj			Die Beschreibung der Aussprache jedes Wortes ist sehr hilfreich für Ausländer.	helpful|useful		
lecker	adj			Schmeckt es dir? Ja, danke, es ist sehr lecker!	delicious|tasty|yummy|scrumptious		
abgemacht	adj			„Wir treffen uns morgen, ja?“ - „Abgemacht!“			
bekannt	adj			Der Klimawandel ist mittlerweile eine bekannte Tatsache geworden.	known|famous	tanınmış|bilinen|malum	nas
berühmt	adj			Fernando Vallejo ist ein berühmter Schriftsteller.|„In jedem Reiseführer steht, daß es die berühmteste Burg Polens ist.“|übertragen: Deine Leistungen der letzten Wochen waren nicht gerade berühmt.	famous|celebrated|renowned	ünlü	
beliebt	adj			Er war bei seinen Kollegen sehr beliebt.|„Die Kinderbuchfigur Conni ist eine beliebte Vorlage für Memes.“	popular		
ordentlich	adj			Dein Zimmer ist ja heute so ordentlich.	tidy|orderly		
privat	adj			„Der Sonderlandeplatz dient dem privaten Geschäftsverkehr und dem Flugsport.“	private	hususi|özel	kesîn
stabil	adj			Für die Kneipentür brauchen wir einen stabilen Griff.|„Ich habe mir diesen stabilen Hammer gekauft, der wird lange halten.“|Der Euro zeigt einen stabilen Aufwärtstrend.|Europa hat ein fundamentales Interesse an einer stabilen und weltoffenen Türkei.	stable|sturdy	stabil	
zufrieden	adj			Er arbeitete unermüdlich, nur damit sein Chef zufrieden sei.	satisfied|content	hoşnut|memnun	
ernst	adj			»Benimm dich jetzt!«, wiederholte sie ein wenig lauter und ernster.|Während der Rede machte er ein ernstes Gesicht.|Nun wird es aber ernst.	serious	ciddi	
satt	adj			Möchtest du noch etwas? Nein, danke. Ich bin satt.	full|satiated|replete|vibrant		têr
eventuell	adj			adverbial: Eventuell komme ich morgen später.|adverbial: Wir telefonieren eventuell heute noch einmal.|adverbial: Willst du eventuell ein zweites Mal probieren?|adverbial: Er ist eventuell krank und sollte zum Arzt gehen.	possible|contingent|perhaps|maybe		
praktisch	adj			Och, mein neuer Freund ist sehr praktisch veranlagt.	handy|practical		
schrecklich	adj			Er hatte schreckliche Alpträume.|Einen schrecklichen Anblick bot die lynchende Menge.|Sie kamen auf schreckliche Weise ums Leben.	horrible|terrible	feci|korkunç	
weiter	adj			Haben Sie weitere Fragen zum Thema?|Mit weiteren Schwierigkeiten würde ich da nicht rechnen.|Ein weiteres Problem sind natürlich die Anfangskosten.	further		
merkwürdig	adj			Heute verhält er sich merkwürdig.|Sie kamen unter merkwürdigen Umständen ums Leben.|Heute war er merkwürdig still.	remarkable|strange	acayip|tuhaf|göze çarpan|ilginç	
hervorragend	adj			Ottokar ist ein hervorragender Klavierspieler.|Dein Abschlusszeugnis ist hervorragend.	outstanding|excellent|superb		
erfolgreich	adj			Die Fußballmannschaft hatte ein erfolgreiches Spiel.	successful		
gemütlich	adj			Diese Wohnlage ist sehr gemütlich.	comfortable|cosy		
versaut	adj			Erzähl nicht immer solche versauten Witze!	raunchy|swinish		
einsam	adj			Nach dem Tod seiner Frau fühlte er sich sehr einsam und verlassen.	lonely|alone|remote|isolated	yalnız|münzevi|ıssız	
schade	adj			Schade, dass du nicht kommen kannst.|Das ist aber schade, dass Sie schon gehen müssen.|„Es ist schade, daß du auf Freundschaft nichts gabst.“|„‚Schade auch‘, stammelte Hesselbart, ‚sehr schade.‘“|„Liebe Anita, es ist schade, daß ihr eure Wohnung verloren habt.“|„Irgendwie schade, daß er dann wegen ’nem Suppenrezept in Erinnerung bleibt.“|„Ach, wie schade ist das, so unsagbar schade.“	pity|pity ; shame|shame	yazık	
lächerlich	adj			Es war ein lächerlicher Auftritt, direkt peinlich.|„Die Maske machte ein unaufhörlich lächerliches Gesicht.“	ridiculous|absurd|ludicrous|comical		
einzig	adj			Das einzige Frachtschiff der Reederei ist im Sturm gesunken.|„Mit diesem moralischen Gottesbeweis hätten wir den einzig möglichen Gottesbeweis vor uns.“	only|sole|unique	tek	
betreten	adj			Als ihn seine Mutter beim Naschen erwischte, blickte Peter betreten drein.	embarrassed		
entfernt	adj			Emma und Kurt sind entfernte Verwandte meines Mannes.|Man könnte sagen, wir sind nur entfernt bekannt miteinander.	distant|far|faraway|far-off		
attraktiv	adj			Sie sah attraktiv aus.	attractive	çekici|cazip	
absurd	adj			Die Vorschläge scheinen mir allesamt vollkommen absurd zu sein.	absurd		dûrî aqil
heil	adj			Trotz des Zusammenstoßes sind die Fahrräder noch heil.|Die Scheidung der Eltern zerstörte Lindas heile Welt.	intact|unhurt		
beteiligt	adj			Er war an dem Projekt beteiligt.	involved|concerned|participating		
vernünftig	adj			Hierbei bedarf es vernünftigen Handelns.	reasonable|sensible	akıllı|makul|mantıklı|ussal	aqilmend
gelassen	adj			Scaramanga hatte seine Waffe im Anschlag, doch Bond blieb völlig gelassen.|Das Model blickt gelassen in die Kamera.|Der Angeklagte nahm das Urteil gelassen auf.|„Du sprichst ein großes Wort gelassen aus.“ (Goethe, Torquato Tasso)	serene|calm		
schief	adj			Dieses Bild hängt ja ganz schief!|Anhand der schiefen Ebene behandelt man in der Elementarphysik das Kräfteparallelogramm.|„Eine Besonderheit sind dabei die nebeneinander stehenden schiefen Türme Garisenda und Asinelli.“	oblique not straight	çarpık|eğimli|eğri|inişli	
besondere	adj			Wir verkaufen besondere Kerzen für besondere Anlässe.	special	özel	
original	adj			Das ist eine originale Malerei aus dem 19. Jahrhundert.	original		
bescheuert	adj			Dein Freund ist wohl bescheuert, wenn er das von dir verlangt.	stupid|dumb		
genügend	adj			Mittlerweile sind genügend Leute gekommen.	sufficient|enough		
vollkommen	adj			"Köln ist nicht perfekt, aber vollkommen, es ist vollkommen Köln."|Das vollkommene Werk begeistert alle Zuseher.	absolute|perfect|completely|totally	kusursuz|hepten|tamamıyla|tamamen	
nervös	adj			Klar, in der Stunde vor Bekanntgabe der Prüfungsergebnisse ist jeder nervös!|Sie hat schon so eine nervöse Ader, die einen verrückt machen kann.|Beruhige dich, sei doch nicht so nervös.	jumpy|jittery|on edge|nervous		agirnok
nützlich	adj			Ein Kalender ist sehr nützlich.	useful		
bequem	adj			Das Sofa ist sehr bequem.|Mein Opa hat es gern bequem.	comfortable|comfy|relaxed|easy	rahat|üşengeç	
unwichtig	adj			Ob du die Sachen nach der Prüfung noch weißt, ist unwichtig.|Danke, das war eine nicht ganz unwichtige Frage.|Ihr Alter ist ein kleines, aber nicht unwichtiges Faktum.	unimportant		
gegenseitig	adj			Wir müssen uns gegenseitig helfen.|Zu einer guten menschlichen Beziehung gehört eine gegenseitige Rücksichtnahme.	mutual|reciprocal	karsilikli	
fantastisch	adj			Was da erzählt wird, ist fantastisch.	fantastic		
aufmerksam	adj			Asami hört aufmerksam zu.	attentive|alert|mindful|draw someone's attention to something/someone		
fair	adj			Der Kampf verlief absolut fair.	fair		
unmöglich	adj			Es ist unmöglich, diese schwierige Aufgabe in so kurzer Zeit zu lösen.|„Es wird immer unmöglicher, schlafen zu gehen.“	impossible|ridiculous|inconceivable	imkânsız|olanaksız|beklenmedik	
ernsthaft	adj			Mit ernsthafter Miene begann er seine Rede.	serious|earnest|honest|grave		
lebendig	adj			Sie ist sehr lebendig bei allem, was sie tut.	alive|live|vivid	canlı|hareketli	
einig	adj			Wir waren uns einig, dass „einig“ dringend einen eigenen Eintrag benötigte.	agreed|in agreement|at one|united	hemfikir|mutabık	
beschäftigt	adj			Ich bin momentan sehr beschäftigt.	busy	meşgul	
besorgt	adj			Die um ihre Kinder besorgten Eltern waren nicht zu beruhigen.	anxious|apprehensive|worried		
aufgeregt	adj			Die aufgeregten Schüler brachten bei der Prüfung kaum ein Wort heraus.	excited|nervous|flustered		
freiwillig	adj			Insbesondere in der Weihnachtszeit gibt es viele freiwillige Spenden.|Ich backe freiwillig den Kuchen.	unsolicited|voluntary|optionally|voluntarily	gönüllü	
neugierig	adj			Sag es mir endlich, du hast mich neugierig gemacht.|Unsere Nachbarn sind ziemlich neugierig.|[Sie] „trifft auf einer menschenleeren Sandbank vor Pellworm neugierige Seehunde.“	curious|inquisitive		
wach	adj			Nach einem langen Arbeitstag hat Thomas Schwierigkeiten, wach zu bleiben.|Bist du überhaupt wach?	awake	uyanık	
verdammt	adj			Ich bin es verdammt nochmal leid, das immer wieder sagen zu müssen!|„Er mußte diesem verdammten Schafhirten einmal die Leviten lesen.“	damn		
pleite	adj			Die Firma war schon nach einem halben Jahr pleite.	bankrupt|broke|skint	beş parasız|parasız	
bewaffnet	adj			Die bewaffneten Soldaten patrouillierten durch die Stadt.	weaponed		çekdar
not	adj			Seefahrt ist not (Roman von Gorch Fock, 1912)	necessary		
herzlich	adj			Sie wurde am Bahnhof von der Tante herzlich empfangen.|Er wünschte ihr herzliche Glückwünsche zum Geburtstag.|„Freddie begrüßte seinen Bruder mit einer herzlichen Umarmung.“	hearty|cordial	candan|yürekten	
anständig	adj			Zieh dir was Anständiges an!|Eine anständige Frau tut so etwas nicht.	decent|proper|honest		
geboren	adj			Sie ist eine geborene Schulz.|Das ist Gesine Lehmann, geborene Krüger, wohnhaft in Mönchengladbach.	born|née|nee		
gefallen	adj			„Gefallene Vorbilder werden nicht ohne Häme gern als gefallene Engel stilisiert.“	fallen		
ekelhaft	adj			Diese Schamlosigkeit ist ja ekelhaft.	disgustful|feculent|misbegotten|disgusting		
lebend	adj			Die letzten noch lebenden Personen der Verbrecherbande wurden gestern dem Haftrichter vorgeführt.	alive|animate|live|living		
begeistert	adj			Musiker aus der halben Welt trafen auf ein begeistertes Publikum.|Sie brauchen keine zufriedenen Gäste. Sie brauchen begeisterte Fans.	enthusiastic|thrilled|excited|passionate		
verhalten	adj			Er sprach mit verhaltener Stimme.|Ja, das stimmt, es war nichts Aufsehenerweckendes, nur eine verhaltene Reaktion.	restrained|suppressed|subdued|bated		
schick	adj			Sie ist eine ausgesprochen schicke Person.|Der neue Laden ist sehr schick aufgemacht.|„Wir hatten uns schick gemacht am ersten Tag nach den großen Ferien.“	elegant	şık|zarif	
los	adj			Meine ewigen Schmerzen bin ich endlich los.|Er ist seine Schulden endlich los.	loose	bağsız|sıkı olmayan	
bezüglich	adj			„Wem“ ist unter anderem ein bezügliches Fürwort.	referential		
eindeutig	adj			Dieser Brief ist eine eindeutige Absage.|Eindeutiger kann man es wohl kaum formulieren, wenn man nicht beleidigen will.	unequivocal|unambiguous|univocal|clear	açıkça|kat'î|kesin|sarih	
erwachsen	adj			Ich wollte eigentlich nie erwachsen sein.|Jugendliche sind daran interessiert, erwachsen zu werden.	adult|grown|grown-up		
charmant	adj			Sie war heute wieder besonders charmant.	charming		
definitiv	adj			Die Angelegenheit ist definitiv beendet.	definite|definitive|positively		
gründlich	adj			Wir sollten den Vorfall gründlich untersuchen.	thorough|diligent		
gerissen	adj			Hier sehen wir das gerissene Seil, das die Last nicht ausgehalten hat.|„Die gerissene Oberschenkelsehne wurde behutsam wieder an der Knochenhaut angenäht.“|[Schlagzeile:] „Gerissene Kette und Pech bei Nils Politt“|[Schlagzeile:] „Gerissene Oberleitung – ICE mit 400 Fahrgästen muss evakuiert werden“			
wert	adj			Anrede im Brief: Werter Herr Meyer! Auch möglich: Wertester Herr Meyer!	valued|dear|worth		
angetan	adj			Er war von dem Vorschlag sehr angetan.	appropriate|suitable		
widerlich	adj			Die Banane hat widerlich geschmeckt, die war bestimmt nicht mehr gut.	abhorrent|disgusting|nauseating	iğrenç	
lauter	adj			Anfangs hegte er reine und lautere Absichten.|Er erklärte, dass er bei ihr nur die lautersten Absichten hege.|Er hatte bewiesen, dass er einen lauteren Charakter besaß.	pure|sincere	dürüst|düzgün	
letzte	adj			Dem letzten Redner dankten die Zuhörer durch Beifall im Stehen.|„Dort schrieb er in den letzten Lebensjahren sein Hauptwerk nieder.“|„Ich bin der letzte Kunde, ich komm' nicht los vom Hahn.	last	son|en son|nihai|geçen	dawî
geschlossen	adj			In geschlossenen Räumen ohne Belüftung kann die Atemluft sehr schlecht werden.|Wegen eines Streik der Kindergärtnerinnen standen die Eltern vor geschlossenen Kindergärten.	closed|united|unanimous|well-rounded		
gehalten	adj			Mit Deinem gehaltenen Auftritt gestern hast Du gepunktet.	controlled|selfcontrolled		
abgeschlossen	adj			Verfügen Sie über eine abgeschlossene Berufsausbildung?	separate|enclosed|secluded|completed		
beendet	adj			Der soeben beendete Lehrgang war für Reinhard nicht sehr hilfreich.	finished|done|completed		
ausgeschlossen	adj			Der aus der Partei ausgeschlossene Politiker möchte nun eine eigene Partei gründen.|Die rund 7000 in Israel inhaftierten Palästinenser bleiben von der Wahl ausgeschlossen.	impossible|out of the question		negengaz|derkirî
bewusst	adj			Ich bin mir bewusst, dass das ein Fehler war.	conscious|aware of something|clear to somebody|wilful / willful	bilinçli|kasıtlı|bilerek|kasten	
eigenartig	adj			Die Cola hat einen eigenartigen Beigeschmack.|„Das eigenartigste Glied der Elbtalzone ist zweifellos das Elbsandsteingebirge.“	weird|peculiar|strange|characteristic		
entschieden	adj			Ich habe ihm mit entschiedenem Blick gesagt, dass ich nicht unterschreiben werde.	determined|resolute|evident|obvious		
geplant	adj			„Der von Gewerkschaften geplante unbefristete Kitastreik in Berlin bleibt verboten.“	planned		
verletzt	adj			Nachdem er mich beleidigt hatte, fühlte ich mich verletzt.|Ihre Absage zum gemeinsamen Abendessen hat ihn verletzt.	offended|hurt|injured	yaralı|yaralanmış	
gewohnt	adj			Mit gewohnter Leichtigkeit unterhielt der Künstler sein Publikum.|Er ist es gewohnt, dass ihm alle aufs Wort gehorchen.	familiar|usual|accustomed|used to		
beschädigt	adj			„›Ich untersuche jetzt den beschädigten Bereich.‹“	damaged		
verschwunden	adj			Mein Kugelschreiber ist schon wieder verschwunden.	lost		
gelernt	adj			„Zuvor gelernte Vokabeln konnten die Probanden nach dem Schlafen perfekt.“|„Deutsch - eine weltweit gelernte Sprache“	skilled|trained|learnt|learned		
geschafft	adj			Nach einem solchen Arbeitstag bin ich geschafft.			
gesichert	adj			Niederlande - Flugschreiberdaten von MH17 gesichert [Überschrift]	secured	emin|güvenli|garanti verilmiş|garantilenmiş	
geschrieben	adj			„Seine Geschichte ist noch nicht geschrieben.“	written		
geschaffen	adj			„Das neu geschaffene schottische Parlament hat 129 Mitglieder.“			
verwendet	adj			Der auf der Rennstrecke verwendete Motor hat nicht die gewünschte Leistung erbracht.	used		
verurteilt	adj			Pakistan will 500 verurteilte Extremisten hinrichten	sentenced|condemned		
gebaut	adj			„Die robust gebauten Moas erreichten in den größten Arten 3,50 m.“	built		
gefragt	adj			In der Medienbranche ist viel Kreativität gefragt.|In diesem Sommer sind die Urlaubsziele Türkei und Griechenland sehr gefragt.	in demand		
vorgestellt	adj			Mein vorgestellter Schreibtisch steht schief.	presented		
abgesehen	adj			„Die Insel hat, abgesehen von Antarktika, die geringste Bevölkerungsdichte der Welt.“	except for|apart from|other than		
verärgert	adj			„Ich bin sehr verärgert wegen deiner erneuten Verspätung!“	angrily|angry|annoyed|disgruntled		
angestellt	adj			Er jobbt da nicht nur, sondern ist in der Firma fest angestellt.|Sie arbeitet als angestellte Ärztin im Krankenhaus.	employed		
geladen	adj			Seit Jahren forscht er über geladene Moleküle und Teilchen.	loaded|armed|charged|invited		
gebrochen	adj			Der Parameter kann ganzzahlige oder gebrochene Werte annehmen.	fractional|blackletter|broken	kesirli|köşeli|çat pat|çökmüş	
gestohlen	adj			Viele gestohlenen Autos werden nach Osteuropa verkauft.	stolen		
verbrannt	adj			Verbrannte Speisen sollte man nicht verzehren.	adust|burnt|burned		
akzeptiert	adj			Was ist der gesellschaftlich akzeptierteste Weg zum Klimaschutz? Schwer zu beantworten.	accepted		
weh	adj			„Die Ohren weh von Schreien[,] Flüchen[,] Gewimmer[,] Gestöhn.“	woebegone|woeful|woesome|painful		
champagner	adj			Mit seinem extravaganten champagner Dinner-Jacket zog er alle Blicke auf sich.	champagne		
dankbar	adj			Ich bin sehr dankbar, dass mir meine Kollegin diese Aufgabe abgenommen hat.	grateful|thankful	müteşekkir	spasdar
wahnsinnig	adj			Er führte sich auf wie wahnsinnig.	mad|insane|insanely|incredibly		
übrig	adj			Wie viel ist denn vom Kuchen von gestern noch übrig?	remaining	kalan	
bewusstlos	adj			Die bewusstlosen Patienten wurden in die Intensivstation gebracht.|Er schleppte sich noch ins Krankenhaus, bevor er bewusstlos zusammenbrach.|„Die Waräger eilen zu dem bewusstlosen General.“	unconscious	bilinçsiz	bêhiş
gebraucht	adj			Ich habe mir ein gebrauchtes Fahrrad gekauft.	second-hand|secondhand		
klasse	adj			Das Konzert gestern Abend war wirklich klasse.|Julia hat da echt einen klasse Job in der Arbeitsagentur.|„Aber hast du auch gesehen, was für eine klasse Frau das ist?“|„Morgens hatte die Mutter uns ein klasse Frühstück aufgetischt.“|„Die Damen zeigten jedoch klasse Leistungen und zeigten keinen Fehltritt.“	awesome|great		
alleine	adj			Klara ist seit der Trennung von ihrem Freund oft alleine.	alone	tek başına	
irre	adj			Sie hat zu viele Drogen genommen und ist davon irre geworden.	crazy|insane|mad		
bewegt	adj			Ede hatte wohl die bewegteste Vergangenheit von uns allen.	eventful		
besucht	adj			Das Kino/Konzert/Theater war gut besucht.	attended		
besetzt	adj			„Die Polizei hat in Rümlang (ZH) ein von Aktivisten besetztes Waldgebiet geräumt.“			
verhaftet	adj			Die beiden verhafteten Personen beteuern ihre Unschuld.			
erleichtert	adj			Nach seiner letzten Prüfung war Thomas in einer sehr erleichterten Stimmung.|Erleichtert verließ der Freigesprochene das Gerichtsgebäude.	alleviated|facilitated|relieved	ferahlamış|müsterih|rahatlamış	
vertraut	adj			Ich bin mit der Funktionsweise dieser Waschmaschine vertraut.	familiar to someone|close to someone|familiar with		
erledigt	adj			Nach den erledigten Hausaufgaben kann Kevin mit seinen Freunden spielen.|Die Akte wanderte zu den erledigten Vorgängen.|Sag kein Wort mehr, der Fall ist für mich erledigt.	completed|done|finished		
übersetzt	adj			„Beim Rückwärtsfahren steht ein zweiter, länger übersetzter Gang zur Verfügung.“			
beeindruckt	adj			„Die prominenten Zuhörer rund um Bezirkstagspräsident Franz Löffler zeigten sich beeindruckt.“|„Er war beeindruckt vom Erfolg seines Sohnes und dessen aufwendigem Lebensstil.“	impressed		
trainiert	adj			„Ein gut trainierter älterer Mensch kann Gedächtnisleistungen wie ein untrainierter Dreißigjähriger bringen.“			
erfreut	adj			Ein sichtlich erfreuter Trainer gratulierte nach dem Gewinn seinen Spielern.	pleased|delighted		
gefasst	adj			Als ich mich von ihr verabschiedete, blieb sie gefasst.	cool|composed|calm		
aktiviert	adj			Bei sportlicher Betätigung sind die Muskelzellen aktiviert.|Während ein Flugzeug fliegt, sind die Triebwerke aktiviert.	activated		
erschöpft	adj			Nach dem Fußballspiel gingen die Spieler erschöpft in die Kabinen.|„Er sah erschöpft aus, entspannte sich jedoch und schlief wieder ein.“|„»Ich war psychisch erschöpft.«“|„Erschöpft und voller Erwartungen kommen Flüchtlingsfamilien im fremden Deutschland an.“|„Erschöpfte Zugvögel sind leichte Beute für die Raubtiere.“	exhausted	bitkin	
entschlossen	adj			Manchmal reicht ein entschlossener Blick, um sein Gegenüber einzuschüchtern.	decided|determined|resolute		
beschlossen	adj			Das ist jetzt beschlossene Sache. So machen wir das.|Jetzt werden die beschlossenen Maßnahmen umgesetzt.	agreed|decided		biryardayî
gewusst	adj			„Wir möchten, damit es gewusst sei, endlich, die unanfechtbaren Zahlen nennen.“|„Ist gewusst gegenüber wem diese 965.000€ Mietschulden sind?“			
angezogen	adj			„Was passiert, wenn ich einen angezogenen Gegenstand von einem Magnet langsam entferne?“	dressed|decent|attracted|drawn		
ruiniert	adj			Dieter wollte ernsthaft mit einer wirtschaftlich ruinierten Fluggesellschaft nach Neuseeland fliegen.|Mein Kleid ist ruiniert!|Den ruinierten Plattenspieler kann auch keiner mehr reparieren.|Und schon wieder ein ruinierter Feierabend.	ruined		
diamanten	adj			Er hat dem Superhelden passend ein diamantenes Schwert gezeichnet.	diamond		
nieder	adj			Mit solch einem niederen Auto hast Du doch keine Übersicht im Verkehr.	low|inferior|indecent		
mittel	adj			Wie ist die Klassenarbeit gelaufen? Na ja, so mittel!	middle|mediocre		
dutzend	adj			Ich habe dir schon dutzend Mal gesagt, dass du das lassen sollst!			
einverstanden	adj			Sind sie damit einverstanden?|Wir sind nicht damit einverstanden, dass du wegziehst.|Wir sind uns doch einverstanden, dass „morgen“ „morgen früh“ bedeutet, oder?|Wir erklären uns mit der vorzeitigen Rückzahlung des Darlehens einverstanden.	agreement|agreed		
geliebt	adj			Dem geliebteren Maximilian erfüllte man die Kriegsforderungen lieber und schneller.	beloved|dear		
leid	adj			Das ist ein leides Thema.	hideous|unpleasant|fed up		
happy	adj			„Und ich war schon vor lauter Vorfreude ganz happy.“	glad|satisfied	mutlu	
schuldig	adj			Der Angeklagte ist schuldig.	guilty		
mitgenommen	adj			Die vor drei Tagen mitgenommene Plastiktüte liegt nun in meiner Küche herum.	beat-up		
feind	adj			Die Beiden waren sich schon immer feind.			
aufregend	adj			„Das schönste und aufregendste Gefühl auf der Welt ist die Liebe.“			
uni	adj			Unser Chef trägt nur uni Hemden.			
verfahren	adj			Die Sache ist total verfahren.		tecrübe etmek	
ohnmächtig	adj			„Eine Frau auf der Straße war ohnmächtig geworden und zusammengefallen.“	unconscious|powerless		
schmuck	adj			Das sieht aber schmuck aus.|Silke ist ein schmuckes Mädchen.	pretty		
dauernd	adj			Deine dauernden Unterbrechungen stören irgendwie.	continuous		
beleidigt	adj			Wladimir Putin ist wegen des Sieges der Maidan-Bewegung beleidigt.	offended huffy in a huff		
passiert	adj			Er kaufte eine Dose mit passierten Tomaten.			
junior	adj			Hans Schäfer junior übernimmt die Firma von seinem Vater.	junior		
eilig	adj			Er hatte es plötzlich sehr eilig, zu gehen.	hasty|urgent		lezgîn
verzweifelt	adj			Mein Leben ist am Ende, ich fühle mich so verzweifelt.	desperate|despairing|frantic		
blöde	adj			Das wird mir jetzt echt zu blöde!			
schuld	adj			Du bist schuld, dass wir zu spät kommen.	be to blame|responsible		
unschuldig	adj			Der Angeklagte wurde für unschuldig befunden.	innocent|virginal	suçsuz|bakire	
befreundet	adj			Am Abend kam ein befreundetes Ehepaar zu Besuch.|Der Geheimdienst überwachte auch befreundete Staaten.	friendly|close|friends	dost	
faszinierend	adj			Was für eine faszinierende Geschichte, ich würde gerne mehr darüber hören.|Die Loren war zu ihrer Zeit eine der faszinierendsten Frauen Europas.	fascinating		
riskant	adj			Dein Plan, im Winter zum Nordpol zu laufen, scheint mir äußerst riskant.|Die Steilwand bei dem Wetter hoch zu klettern ist mir zu riskant.|Das Leben als Entwicklungshelfer in einer Nicht-Regierungsorganisation ist ein riskantes Geschäft.	risky		
erstaunlich	adj			"Er ist für sein Alter erstaunlich fit!"|Carl Friedrich Gauss konnte schon im jungen Alter erstaunlich gut rechnen.|Die Entwicklung von Wikipedia ist einfach erstaunlich.|„Die Wälder im Kongobecken sind noch erstaunlich intakt.“	amazing		
beschützt	adj			Diese Duftrose verlangt eine etwas beschütztere Stelle.			
unfair	adj			Im Scheidungskrieg wird schon mal gerne zu unfairen Mitteln gegriffen.|Das ist aber jetzt echt unfair! Ich will nicht zu Hause bleiben!	unfair		
unrecht	adj			Das war ein unzeitiges Vorgehen mit unrechten Schritten.|Sie hatte wohl zur unrechten Zeit nachgefragt.			
freund	adj			Der alte Herr aus Freiburg ist mir flugs freund geworden.			`;

/** Records in `EXAMPLES_TSV` — asserted by the loader's tests as a smoke
 *  check that the data file and the loader were regenerated together. */
export const EXAMPLES_TSV_ROWS = 2885;
