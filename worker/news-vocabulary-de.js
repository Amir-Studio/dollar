// German News Vocabulary — curated launch curriculum (100 curated starter entries; lexical review pending).
// Editorial examples are original teaching sentences, not quotations from publishers.
// Frequency ranks are intentionally not fabricated; corpus ranking is pending a licensed
// Leipzig deu_news_2025_1M lemma/POS import and review.
export const GERMAN_NEWS_VOCABULARY_VERSION = "de-news-vocabulary-0.1.0";
export const GERMAN_NEWS_VOCABULARY_TARGET = 1000;
export const GERMAN_NEWS_LESSON_TARGET = 100;
export const GERMAN_NEWS_VOCABULARY = [
["de001","politics","die Regierung","die Regierungen","دولت","/ɡəˈʁiːʁʊŋ/","Die Regierung stellt heute ihren neuen Plan vor.","دولت امروز برنامه جدید خود را معرفی می‌کند.","noun"],
["de002","politics","das Parlament","die Parlamente","پارلمان","/paʁlaˈmɛnt/","Das Parlament stimmt am Freitag über den Gesetzentwurf ab.","پارلمان روز جمعه درباره پیش‌نویس قانون رأی‌گیری می‌کند.","noun"],
["de003","politics","die Opposition","die Oppositionen","اپوزیسیون؛ احزاب مخالف","/ɔpoziˈt͡si̯oːn/","Die Opposition kritisiert den Vorschlag der Regierung.","احزاب مخالف پیشنهاد دولت را نقد می‌کنند.","noun"],
["de004","politics","die Koalition","die Koalitionen","ائتلاف","/koaliˈt͡si̯oːn/","Die Koalition einigt sich auf gemeinsame Ziele.","ائتلاف بر سر اهداف مشترک به توافق می‌رسد.","noun"],
["de005","politics","der Abgeordnete","die Abgeordneten","نماینده مجلس","/ˈapɡəˌʔɔʁdnətə/","Die Abgeordneten beraten über den Haushalt.","نمایندگان درباره بودجه مشورت می‌کنند.","noun"],
["de006","politics","der Gesetzentwurf","die Gesetzentwürfe","پیش‌نویس قانون","/ɡəˈzɛt͡sʔɛntvʊʁf/","Der Gesetzentwurf sieht neue Regeln vor.","پیش‌نویس قانون مقررات جدیدی را پیش‌بینی می‌کند.","noun"],
["de007","politics","die Abstimmung","die Abstimmungen","رأی‌گیری","/ˈapʃtɪmʊŋ/","Die Abstimmung findet nächste Woche statt.","رأی‌گیری هفته آینده برگزار می‌شود.","noun"],
["de008","politics","die Wahl","die Wahlen","انتخابات","/vaːl/","Die Wahl wird im Herbst stattfinden.","انتخابات در پاییز برگزار خواهد شد.","noun"],
["de009","politics","der Rücktritt","die Rücktritte","استعفا","/ˈʁʏkˌtʁɪt/","Der Minister kündigt seinen Rücktritt an.","وزیر استعفای خود را اعلام می‌کند.","noun"],
["de010","politics","fordern","fordert · forderte · hat gefordert","خواستار شدن؛ مطالبه کردن","/ˈfɔʁdɐn/","Die Opposition fordert eine unabhängige Untersuchung.","اپوزیسیون خواستار یک تحقیق مستقل است.","verb"],
["de011","economy","die Wirtschaft","die Wirtschaften","اقتصاد","/ˈvɪʁtʃaft/","Die Wirtschaft wächst langsamer als erwartet.","اقتصاد کندتر از حد انتظار رشد می‌کند.","noun"],
["de012","economy","das Wachstum","—","رشد","/ˈvaxstuːm/","Das Wachstum bleibt in diesem Quartal schwach.","رشد در این سه‌ماهه ضعیف باقی می‌ماند.","noun"],
["de013","economy","die Inflation","die Inflationen","تورم","/ɪnflaˈt͡si̯oːn/","Die Inflation ist im vergangenen Monat gesunken.","تورم در ماه گذشته کاهش یافته است.","noun"],
["de014","economy","der Verbraucherpreis","die Verbraucherpreise","قیمت مصرف‌کننده","/fɛɐ̯ˈbʁaʊxɐˌpʁaɪ̯s/","Die Verbraucherpreise steigen erneut.","قیمت‌های مصرف‌کننده دوباره افزایش می‌یابند.","noun"],
["de015","economy","die Rezession","die Rezessionen","رکود اقتصادی","/ʁet͡sɛˈsi̯oːn/","Experten warnen vor einer möglichen Rezession.","کارشناسان درباره رکود احتمالی هشدار می‌دهند.","noun"],
["de016","economy","die Nachfrage","—","تقاضا","/ˈnaːxfʁaːɡə/","Die Nachfrage nach Industrieprodukten nimmt zu.","تقاضا برای محصولات صنعتی افزایش می‌یابد.","noun"],
["de017","economy","das Angebot","die Angebote","عرضه؛ پیشنهاد","/ˈanɡəboːt/","Das Angebot auf dem Wohnungsmarkt bleibt knapp.","عرضه در بازار مسکن همچنان محدود است.","noun"],
["de018","economy","die Investition","die Investitionen","سرمایه‌گذاری","/ɪnvɛstiˈt͡si̯oːn/","Die Investitionen in neue Anlagen steigen.","سرمایه‌گذاری در تأسیسات جدید افزایش می‌یابد.","noun"],
["de019","economy","der Umsatz","die Umsätze","گردش مالی؛ فروش","/ˈʊmzat͡s/","Der Umsatz des Unternehmens ist deutlich gestiegen.","گردش مالی شرکت به‌طور چشمگیری افزایش یافته است.","noun"],
["de020","economy","sinken","sinkt · sank · ist gesunken","کاهش یافتن","/ˈzɪŋkn̩/","Die Industrieproduktion ist im März gesunken.","تولید صنعتی در ماه مارس کاهش یافت.","verb"],
["de021","finance","der Haushalt","die Haushalte","بودجه؛ خانوار","/ˈhaʊ̯shalt/","Der Bundestag berät über den Bundeshaushalt.","بوندستاگ درباره بودجه فدرال بحث می‌کند.","noun"],
["de022","finance","die Staatsausgaben","—","هزینه‌های دولت","/ˈʃtaːt͡sʔaʊ̯sˌɡaːbn̩/","Die Staatsausgaben sollen begrenzt werden.","قرار است هزینه‌های دولت محدود شوند.","noun"],
["de023","finance","die Einnahme","die Einnahmen","درآمد؛ دریافتی","/ˈaɪ̯nˌnaːmə/","Die Steuereinnahmen sind höher ausgefallen.","درآمدهای مالیاتی بیشتر از حد پیش‌بینی‌شده بوده‌اند.","noun"],
["de024","finance","die Steuer","die Steuern","مالیات","/ˈʃtɔɪ̯ɐ/","Die Regierung plant Änderungen bei der Steuer.","دولت برای مالیات تغییراتی را برنامه‌ریزی می‌کند.","noun"],
["de025","finance","die Schulden","—","بدهی‌ها","/ˈʃʊldn̩/","Die öffentlichen Schulden haben einen neuen Höchststand erreicht.","بدهی عمومی به رکورد تازه‌ای رسیده است.","noun"],
["de026","finance","das Defizit","die Defizite","کسری","/defiˈt͡siːt/","Das Defizit fällt größer aus als zunächst erwartet.","کسری بیشتر از برآورد اولیه است.","noun"],
["de027","finance","der Überschuss","die Überschüsse","مازاد","/ˈyːbɐˌʃʊs/","Die Stadt meldet einen finanziellen Überschuss.","شهر از مازاد مالی خبر می‌دهد.","noun"],
["de028","finance","die Ausgabe","die Ausgaben","هزینه؛ مخارج","/ˈaʊ̯sˌɡaːbə/","Die Ausgaben für Energie bleiben hoch.","هزینه‌های انرژی همچنان بالاست.","noun"],
["de029","finance","der Kredit","die Kredite","وام؛ اعتبار","/kʁeˈdiːt/","Unternehmen erhalten leichter Zugang zu Krediten.","شرکت‌ها آسان‌تر به وام دسترسی پیدا می‌کنند.","noun"],
["de030","finance","erhöhen","erhöht · erhöhte · hat erhöht","افزایش دادن","/ɛɐ̯ˈhøːən/","Die Zentralbank erhöht den Leitzins vorerst nicht.","بانک مرکزی فعلاً نرخ بهره اصلی را افزایش نمی‌دهد.","verb"],
["de031","central_bank","die Zentralbank","die Zentralbanken","بانک مرکزی","/t͡sɛnˈtʁaːlˌbaŋk/","Die Zentralbank veröffentlicht ihren Monatsbericht.","بانک مرکزی گزارش ماهانه خود را منتشر می‌کند.","noun"],
["de032","central_bank","der Leitzins","die Leitzinsen","نرخ بهره اصلی","/ˈlaɪ̯t͡sɪnt͡s/","Der Leitzins bleibt unverändert.","نرخ بهره اصلی بدون تغییر می‌ماند.","noun"],
["de033","central_bank","die Geldpolitik","—","سیاست پولی","/ˈɡɛltpoliˌtiːk/","Die Geldpolitik soll die Preisstabilität sichern.","سیاست پولی باید ثبات قیمت‌ها را تضمین کند.","noun"],
["de034","central_bank","die Zinssenkung","die Zinssenkungen","کاهش نرخ بهره","/ˈt͡sɪn͡sˌzɛŋkʊŋ/","Eine Zinssenkung wird derzeit nicht ausgeschlossen.","در حال حاضر کاهش نرخ بهره منتفی نیست.","noun"],
["de035","central_bank","die Zinserhöhung","die Zinserhöhungen","افزایش نرخ بهره","/ˈt͡sɪn͡sʔɛɐ̯ˌhøːʊŋ/","Die Zinserhöhung soll die Inflation bremsen.","افزایش نرخ بهره قرار است تورم را مهار کند.","noun"],
["de036","central_bank","die Preisstabilität","—","ثبات قیمت‌ها","/ˈpʁaɪ̯sʃtabiliˌtɛːt/","Die Preisstabilität ist das zentrale Ziel.","ثبات قیمت‌ها هدف اصلی است.","noun"],
["de037","central_bank","die Liquidität","—","نقدینگی","/likvidiˈtɛːt/","Die Banken verfügen über ausreichende Liquidität.","بانک‌ها نقدینگی کافی در اختیار دارند.","noun"],
["de038","central_bank","die Geldmenge","die Geldmengen","حجم پول","/ˈɡɛltˌmɛŋə/","Die Geldmenge ist im Jahresvergleich gewachsen.","حجم پول نسبت به سال گذشته رشد کرده است.","noun"],
["de039","central_bank","der Wechselkurs","die Wechselkurse","نرخ ارز","/ˈvɛksl̩ˌkʊʁs/","Der Wechselkurs reagierte auf die Ankündigung.","نرخ ارز به این اعلام واکنش نشان داد.","noun"],
["de040","central_bank","stabilisieren","stabilisiert · stabilisierte · hat stabilisiert","باثبات کردن","/ʃtabiliˈziːʁən/","Die Maßnahmen sollen den Markt stabilisieren.","این اقدامات قرار است بازار را باثبات کنند.","verb"],
["de041","labour","der Arbeitsmarkt","die Arbeitsmärkte","بازار کار","/ˈaʁbaɪ̯t͡sˌmaʁkt/","Der Arbeitsmarkt zeigt erste Anzeichen einer Erholung.","بازار کار نخستین نشانه‌های بهبود را نشان می‌دهد.","noun"],
["de042","labour","die Arbeitslosigkeit","—","بیکاری","/ˈaʁbaɪ̯t͡sloːzɪçkaɪ̯t/","Die Arbeitslosigkeit ist leicht gestiegen.","بیکاری اندکی افزایش یافته است.","noun"],
["de043","labour","die Beschäftigung","—","اشتغال","/bəˈʃɛftɪɡʊŋ/","Die Beschäftigung im Dienstleistungssektor nimmt zu.","اشتغال در بخش خدمات افزایش می‌یابد.","noun"],
["de044","labour","der Fachkräftemangel","—","کمبود نیروی متخصص","/ˈfaxˌkʁɛftəˌmaŋəl/","Der Fachkräftemangel bleibt eine Herausforderung.","کمبود نیروی متخصص همچنان یک چالش است.","noun"],
["de045","labour","der Tarifvertrag","die Tarifverträge","قرارداد جمعی کار","/taˈʁiːfˌfɛɐ̯tʁaːk/","Gewerkschaften und Arbeitgeber verhandeln über einen Tarifvertrag.","اتحادیه‌ها و کارفرمایان درباره قرارداد جمعی کار مذاکره می‌کنند.","noun"],
["de046","labour","die Gewerkschaft","die Gewerkschaften","اتحادیه کارگری","/ɡəˈvɛʁkʃaft/","Die Gewerkschaft fordert höhere Löhne.","اتحادیه کارگری خواستار دستمزدهای بالاتر است.","noun"],
["de047","labour","der Lohn","die Löhne","دستمزد","/loːn/","Die Löhne steigen in mehreren Branchen.","دستمزدها در چندین صنعت افزایش می‌یابند.","noun"],
["de048","labour","die Stelle","die Stellen","موقعیت شغلی","/ˈʃtɛlə/","Das Unternehmen schafft neue Stellen.","شرکت فرصت‌های شغلی جدید ایجاد می‌کند.","noun"],
["de049","labour","die Entlassung","die Entlassungen","اخراج؛ تعدیل نیرو","/ɛntˈlasʊŋ/","Der Konzern kündigt weitere Entlassungen an.","این گروه صنعتی از تعدیل نیروی بیشتر خبر می‌دهد.","noun"],
["de050","labour","beschäftigen","beschäftigt · beschäftigte · hat beschäftigt","استخدام کردن؛ مشغول کردن","/bəˈʃɛftɪɡn̩/","Der Betrieb beschäftigt rund 500 Menschen.","این مجموعه حدود ۵۰۰ نفر را استخدام کرده است.","verb"],
["de051","energy","die Energieversorgung","die Energieversorgungen","تأمین انرژی","/eneʁˈɡiːfɛɐ̯ˌzɔʁɡʊŋ/","Die Energieversorgung ist weiterhin gesichert.","تأمین انرژی همچنان تضمین شده است.","noun"],
["de052","energy","der Strompreis","die Strompreise","قیمت برق","/ˈʃtʁoːmˌpʁaɪ̯s/","Der Strompreis ist für viele Haushalte gestiegen.","قیمت برق برای بسیاری از خانوارها افزایش یافته است.","noun"],
["de053","energy","das Erdgas","—","گاز طبیعی","/ˈeːɐ̯tˌɡaːs/","Die Nachfrage nach Erdgas bleibt hoch.","تقاضا برای گاز طبیعی همچنان بالاست.","noun"],
["de054","energy","das Erdöl","—","نفت خام","/ˈeːɐ̯tˌʔøːl/","Der Preis für Erdöl schwankt stark.","قیمت نفت خام به‌شدت نوسان می‌کند.","noun"],
["de055","energy","die erneuerbare Energie","die erneuerbaren Energien","انرژی تجدیدپذیر","/ɛɐ̯ˈnɔɪ̯ɐbaːʁə eneʁˈɡiː/","Der Anteil erneuerbarer Energien nimmt zu.","سهم انرژی‌های تجدیدپذیر افزایش می‌یابد.","noun"],
["de056","energy","die Versorgungssicherheit","—","امنیت تأمین","/fɛɐ̯ˈzɔʁɡʊŋsˌzɪçɐhaɪ̯t/","Die Versorgungssicherheit hat oberste Priorität.","امنیت تأمین در بالاترین اولویت قرار دارد.","noun"],
["de057","energy","die Pipeline","die Pipelines","خط لوله","/ˈpaɪ̯plaɪ̯n/","Die Pipeline wird vorübergehend gewartet.","خط لوله به‌طور موقت تعمیر و نگهداری می‌شود.","noun"],
["de058","energy","der Stromverbrauch","—","مصرف برق","/ˈʃtʁoːmfɛɐ̯ˌbʁaʊx/","Der Stromverbrauch erreicht im Winter seinen Höhepunkt.","مصرف برق در زمستان به اوج خود می‌رسد.","noun"],
["de059","energy","die Klimaziele","—","اهداف اقلیمی","/ˈkliːmaˌt͡siːlə/","Die Regierung hält an ihren Klimazielen fest.","دولت بر اهداف اقلیمی خود پایبند می‌ماند.","noun"],
["de060","energy","ausbauen","baut aus · baute aus · hat ausgebaut","گسترش دادن","/ˈaʊ̯sˌbaʊ̯ən/","Das Land will seine Windkraft ausbauen.","کشور می‌خواهد ظرفیت انرژی بادی خود را گسترش دهد.","verb"],
["de061","foreign_policy","die Außenpolitik","—","سیاست خارجی","/ˈaʊ̯sn̩poliˌtiːk/","Die Außenpolitik des Landes steht im Mittelpunkt der Debatte.","سیاست خارجی کشور در کانون بحث قرار دارد.","noun"],
["de062","foreign_policy","die Verhandlungen","—","مذاکرات","/fɛɐ̯ˈhandlʊŋən/","Die Verhandlungen werden nächste Woche fortgesetzt.","مذاکرات هفته آینده از سر گرفته می‌شوند.","noun"],
["de063","foreign_policy","das Abkommen","die Abkommen","توافق‌نامه","/ˈapˌkɔmən/","Beide Seiten unterzeichnen ein neues Abkommen.","هر دو طرف توافق‌نامه جدیدی امضا می‌کنند.","noun"],
["de064","foreign_policy","die Delegation","die Delegationen","هیئت نمایندگی","/delegat͡si̯ˈoːn/","Eine Delegation reist zu Gesprächen nach Berlin.","هیئتی برای گفت‌وگو به برلین سفر می‌کند.","noun"],
["de065","foreign_policy","die Sanktion","die Sanktionen","تحریم","/zaŋkˈt͡si̯oːn/","Die Sanktionen bleiben vorerst in Kraft.","تحریم‌ها فعلاً به قوت خود باقی می‌مانند.","noun"],
["de066","foreign_policy","die Gipfelkonferenz","die Gipfelkonferenzen","کنفرانس سران","/ˈɡɪpfl̩kɔnfeˌʁɛnt͡s/","Die Gipfelkonferenz beginnt am Montag in Berlin.","کنفرانس سران روز دوشنبه در برلین آغاز می‌شود.","noun"],
["de067","foreign_policy","die Vermittlung","die Vermittlungen","میانجی‌گری","/fɛɐ̯ˈmɪtlʊŋ/","Mehrere Staaten bieten ihre Vermittlung an.","چند کشور پیشنهاد میانجی‌گری می‌دهند.","noun"],
["de068","foreign_policy","die Zusammenarbeit","—","همکاری","/t͡suˈzamənˌaʁbaɪ̯t/","Beide Länder wollen ihre Zusammenarbeit vertiefen.","هر دو کشور می‌خواهند همکاری خود را گسترش دهند.","noun"],
["de069","foreign_policy","die Beziehungen","—","روابط","/bəˈt͡siːʊŋən/","Die diplomatischen Beziehungen sind angespannt.","روابط دیپلماتیک پرتنش است.","noun"],
["de070","foreign_policy","ankündigen","kündigt an · kündigte an · hat angekündigt","اعلام کردن","/ˈanˌkʏndɪɡn̩/","Der Minister kündigt weitere Gespräche an.","وزیر از گفت‌وگوهای بیشتر خبر می‌دهد.","verb"],
["de071","society","die Bevölkerung","—","جمعیت؛ مردم","/bəˈfœlkəʁʊŋ/","Die Bevölkerung wird zur Teilnahme aufgerufen.","از مردم دعوت می‌شود در این رویداد شرکت کنند.","noun"],
["de072","society","die Umfrage","die Umfragen","نظرسنجی","/ˈʊmˌfʁaːɡə/","Eine neue Umfrage zeigt veränderte Erwartungen.","یک نظرسنجی جدید تغییر انتظارات را نشان می‌دهد.","noun"],
["de073","society","die Zustimmung","—","موافقت؛ میزان حمایت","/ˈt͡suːʃtɪmʊŋ/","Die Zustimmung zu dem Vorschlag wächst.","حمایت از این پیشنهاد افزایش می‌یابد.","noun"],
["de074","society","die Kritik","—","انتقاد","/kʁiˈtiːk/","Der Beschluss stößt auf breite Kritik.","این مصوبه با انتقاد گسترده روبه‌رو می‌شود.","noun"],
["de075","society","die Demonstration","die Demonstrationen","تظاهرات","/demɔnˌstʁat͡si̯ˈoːn/","In mehreren Städten ist eine Demonstration geplant.","در چندین شهر تظاهراتی برنامه‌ریزی شده است.","noun"],
["de076","society","die Kundgebung","die Kundgebungen","گردهمایی اعتراضی","/ˈkʊntˌɡeːbʊŋ/","Die Kundgebung verlief nach Polizeiangaben friedlich.","به گفته پلیس، گردهمایی اعتراضی مسالمت‌آمیز برگزار شد.","noun"],
["de077","society","die Ungleichheit","—","نابرابری","/ˈʊŋɡlaɪ̯çhaɪ̯t/","Der Bericht untersucht die soziale Ungleichheit.","این گزارش نابرابری اجتماعی را بررسی می‌کند.","noun"],
["de078","society","die Maßnahme","die Maßnahmen","اقدام؛ تدبیر","/ˈmaːsˌnaːmə/","Die Maßnahme soll Familien entlasten.","این اقدام قرار است فشار بر خانواده‌ها را کاهش دهد.","noun"],
["de079","society","die Herausforderung","die Herausforderungen","چالش","/hɛˈʁaʊ̯sfɔʁdərʊŋ/","Der demografische Wandel bleibt eine große Herausforderung.","تغییرات جمعیتی همچنان چالشی بزرگ است.","noun"],
["de080","society","betreffen","betrifft · betraf · hat betroffen","مربوط بودن به؛ متأثر کردن","/bəˈtʁɛfn̩/","Die Änderungen betreffen Millionen Menschen.","این تغییرات میلیون‌ها نفر را تحت تأثیر قرار می‌دهد.","verb"],
["de081","justice","das Gericht","die Gerichte","دادگاه","/ɡəˈʁɪçt/","Das Gericht verkündet sein Urteil am Montag.","دادگاه روز دوشنبه حکم خود را اعلام می‌کند.","noun"],
["de082","justice","das Urteil","die Urteile","حکم قضایی","/ˈʊɐ̯taɪ̯l/","Das Urteil ist noch nicht rechtskräftig.","این حکم هنوز قطعی و لازم‌الاجرا نیست.","noun"],
["de083","justice","die Ermittlungen","—","تحقیقات قضایی","/ɛɐ̯ˈmɪtlʊŋən/","Die Ermittlungen dauern weiterhin an.","تحقیقات همچنان ادامه دارد.","noun"],
["de084","justice","der Verdacht","die Verdachte","ظن؛ سوءظن","/fɛɐ̯ˈdaxt/","Es besteht der Verdacht auf Betrug.","ظن کلاهبرداری وجود دارد.","noun"],
["de085","justice","die Anklage","die Anklagen","کیفرخواست؛ اتهام","/ˈanklaːɡə/","Die Staatsanwaltschaft erhebt Anklage.","دادستانی کیفرخواست صادر می‌کند.","noun"],
["de086","justice","der Beschluss","die Beschlüsse","مصوبه؛ تصمیم رسمی","/bəˈʃlʊs/","Der Beschluss tritt im kommenden Monat in Kraft.","این مصوبه از ماه آینده اجرایی می‌شود.","noun"],
["de087","justice","das Verfahren","die Verfahren","روند؛ دادرسی","/fɛɐ̯ˈfaːʁən/","Das Verfahren wird vor einem höheren Gericht fortgesetzt.","رسیدگی در دادگاه بالاتر ادامه می‌یابد.","noun"],
["de088","justice","die Behörde","die Behörden","نهاد دولتی؛ اداره","/bəˈhøːɐ̯də/","Die Behörde prüft die eingereichten Unterlagen.","نهاد مربوط مدارک ارائه‌شده را بررسی می‌کند.","noun"],
["de089","justice","die Genehmigung","die Genehmigungen","مجوز","/ɡəˈneːmɪɡʊŋ/","Für das Projekt fehlt noch eine Genehmigung.","این پروژه هنوز یک مجوز کم دارد.","noun"],
["de090","justice","überprüfen","überprüft · überprüfte · hat überprüft","بررسی کردن؛ بازبینی کردن","/yːbɐˈpʁyːfn̩/","Die Behörde überprüft die Entscheidung.","نهاد مربوط تصمیم را بازبینی می‌کند.","verb"],
["de091","technology","die Technologie","die Technologien","فناوری","/tɛçnoloˈɡiː/","Neue Technologien verändern die Industrie.","فناوری‌های جدید صنعت را تغییر می‌دهند.","noun"],
["de092","technology","die künstliche Intelligenz","—","هوش مصنوعی","/ˈkʏnstlɪçə ɪntɛliˈɡɛnt͡s/","Künstliche Intelligenz wird in Behörden eingesetzt.","هوش مصنوعی در نهادهای دولتی به کار گرفته می‌شود.","noun"],
["de093","technology","die Datenschutzregel","die Datenschutzregeln","قانون حفاظت از داده","/ˈdaːtn̩ʃʊt͡sˌʁeːɡl̩/","Die neue Datenschutzregel gilt ab Januar.","قانون جدید حفاظت از داده از ژانویه اجرا می‌شود.","noun"],
["de094","technology","die Infrastruktur","die Infrastrukturen","زیرساخت","/ɪnfʁastʁʊkˈtuːɐ̯/","Der Ausbau der digitalen Infrastruktur hat Priorität.","توسعه زیرساخت دیجیتال در اولویت است.","noun"],
["de095","technology","die Forschung","—","پژوهش","/ˈfɔʁʃʊŋ/","Die Forschung liefert neue Erkenntnisse.","پژوهش یافته‌های تازه‌ای ارائه می‌دهد.","noun"],
["de096","technology","die Entwicklung","die Entwicklungen","توسعه؛ تحول","/ɛntˈvɪklʊŋ/","Die Entwicklung wird von Fachleuten beobachtet.","این تحول از سوی متخصصان رصد می‌شود.","noun"],
["de097","technology","die Daten","—","داده‌ها","/ˈdaːtn̩/","Die Daten werden jährlich aktualisiert.","داده‌ها هر سال به‌روزرسانی می‌شوند.","noun"],
["de098","technology","die Cyberattacke","die Cyberattacken","حمله سایبری","/ˈsaɪ̯bɐʔaˌtakə/","Die Behörde untersucht eine mögliche Cyberattacke.","نهاد مربوط یک حمله سایبری احتمالی را بررسی می‌کند.","noun"],
["de099","technology","veröffentlichen","veröffentlicht · veröffentlichte · hat veröffentlicht","منتشر کردن","/fɛɐ̯ˈʔœfntlɪçn̩/","Das Ministerium veröffentlicht neue Zahlen.","وزارتخانه آمار جدیدی منتشر می‌کند.","verb"],
["de100","technology","hinweisen","weist hin · wies hin · hat hingewiesen","اشاره کردن؛ هشدار دادن","/ˈhɪnˌvaɪ̯zn̩/","Der Bericht weist auf erhebliche Risiken hin.","این گزارش به خطرات قابل‌توجهی اشاره می‌کند.","verb"]
];

export function getGermanNewsVocabulary({lesson=null,category=null,query=null,limit=1000}={}) {
 const q=String(query||"").trim().toLocaleLowerCase("de");
 const rows=GERMAN_NEWS_VOCABULARY.filter(row=>
  (lesson==null || Math.ceil(Number(row[0].slice(2))/10)===Number(lesson)) &&
  (!category || row[1]===category) &&
  (!q || row.join(" ").toLocaleLowerCase("de").includes(q))
 ).slice(0,Math.max(1,Math.min(1000,Number(limit)||1000)));
 return {version:GERMAN_NEWS_VOCABULARY_VERSION,language:"de",target_total:1000,lesson_target:100,verified_entries:GERMAN_NEWS_VOCABULARY.length,available_lessons:Math.ceil(GERMAN_NEWS_VOCABULARY.length/10),frequency_status:"corpus_rank_pending",items:rows.map(([id,category,word,form,fa,ipa,example,example_fa,pos])=>({id,category,word,form,fa,ipa,example,example_fa,pos,lesson:Math.ceil(Number(id.slice(2))/10),dictionary_url:"https://www.dwds.de/wb/"+encodeURIComponent(word.replace(/^der |^die |^das /,""))}))};
}
export function runGermanNewsVocabularySelfTest() {
 const ids=new Set(GERMAN_NEWS_VOCABULARY.map(x=>x[0]));
 const words=new Set(GERMAN_NEWS_VOCABULARY.map(x=>x[2]));
 const invalid=GERMAN_NEWS_VOCABULARY.filter(x=>x.length!==9||!x[0]||!x[2]||!x[4]||!x[5]||!x[6]||!x[7]);
 return {total:GERMAN_NEWS_VOCABULARY.length,passed:invalid.length===0&&ids.size===GERMAN_NEWS_VOCABULARY.length&&words.size===GERMAN_NEWS_VOCABULARY.length,unique_ids:ids.size,unique_words:words.size,available_lessons:Math.ceil(GERMAN_NEWS_VOCABULARY.length/10),target_lessons:100,scope:"Structure and uniqueness only; lexical, IPA, translation and corpus-frequency review still required."};
}
