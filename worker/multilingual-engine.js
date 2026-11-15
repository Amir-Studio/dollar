// Dollar multilingual market-news comprehension engine v1.0
// Deterministic, auditable linguistic feature extraction; not a generative model or a translation engine.
export const MULTILINGUAL_VERSION = "dollar-multilingual-news-1.0.0";

const LANGS = {
  ar: {
    name: "Arabic",
    script: /[\u0600-\u06ff]/g,
    cues: ["البنك","الاقتصاد","الأسعار","الحكومة","المركزي","النفط","الذهب","الدولار","ارتفع","انخفض","قالت","أعلنت","يتوقع","قد","إذا","لكن","ليس","لم","لن","بالمئة","مليار"],
    modality: /(?:قد\s|ربما|من المحتمل|من المتوقع|يتوقع|تتوقع|يمكن أن|قد يكون|قد تكون|مرجح أن)/,
    conditional: /(?:اذا|ان\s|في حال|بشرط|ما لم|شريطة ان)/,
    negation: /(?:لا|لم|لن|ليس|ليست|لم يكن|لم يتم|ما زال لا|ينفي|نفت|نفي|لم يؤكد)/,
    attribution: /(?:قال|قالت|أفاد|أفادت|اعلن|اعلنت|ذكر|ذكرت|بحسب|وفقا ل|اوضح|اوضحت|حذر|حذرت|صرح|صرحت|نفي|نفت)/,
    causal: /(?:بسبب|نتيجة ل|مما أدى إلى|أدى إلى|أدت إلى|يرجع إلى|جراء|لذلك|وبالتالي)/,
    contrast: /(?:لكن|غير أن|إلا أن|على الرغم من|رغم|بينما|في المقابل|مع ذلك)/,
    comparison: /(?:مقارنة ب|مقارنة مع|أعلى من|أقل من|أكثر من|ضعف|نصف|مقابل)/,
    forecast: /(?:توقع|تتوقع|يتوقع|توقعات|تنبأ|من المتوقع|يرجح|قد يرتفع|قد ينخفض)/,
    past: /(?:امس|الاسبوع الماضي|الشهر الماضي|العام الماضي|ارتفع|ارتفعت|انخفض|انخفضت|اعلن|اعلنت|فرض|فرضت|وافق|وافقت|توافق|تراجعت|تراجع)/,
    future: /(?:غدا|الاسبوع المقبل|الشهر المقبل|العام المقبل|المقبل|سوف|سي(?:رتفع|نخفض|علن|فرض|كون)|من المتوقع ان)/,
    actions: [
      ["increase", /(?:ارتفع|ارتفعت|يرتفع|ترتفع|زيادة|يزيد|زادت|صعد|صعدت|نمو)/],
      ["decrease", /(?:انخفض|انخفضت|ينخفض|تراجع|تراجعت|هبط|هبطت|خفض|خفضت|تراجع)/],
      ["hold", /(?:ابقي|ابقت|ثبت|استقر|استقرت|دون تغيير|بدون تغيير)/],
      ["deny", /(?:نفي|نفت|ينفي|تنفي|كذب|كذبت|رفض|رفضت)/],
      ["approve", /(?:وافق|وافقت|توافق|اقر|اقرت|اعتمد|اعتمدت)/],
      ["sanction", /(?:فرض عقوبات|رفعت العقوبات|تخفيف العقوبات|عقوبات جديدة)/],
      ["negotiate", /(?:مفاوضات|تفاوض|محادثات|اتفاق)/],
      ["invest", /(?:استثمار|استثمر|استثمارات)/],
      ["export", /(?:صادرات|تصدير|صدر)/],
      ["oil", /(?:النفط|الخام|برنت)/]
    ],
    actors: [["central_bank", /(?:البنك المركزي|مصرف مركزي)/],["government", /(?:الحكومة|الوزارة|الوزير)/],["opec", /(?:أوبك|أوبك+)/],["imf", /(?:صندوق النقد الدولي)/],["us", /(?:الولايات المتحدة|أمريكا)/],["iran", /(?:إيران|الإيراني)/]]
  },
  zh: {
    name: "Chinese",
    script: /[\u4e00-\u9fff]/g,
    cues: ["经济","央行","银行","政府","价格","美元","黄金","石油","人民币","上涨","下跌","表示","预计","可能","如果","但是","没有","不会","同比","增长"],
    modality: /(?:可能|或将|预计|预期|有望|或许|恐将|可能会)/,
    conditional: /(?:如果|若|假如|除非|在.*情况下|前提是)/,
    negation: /(?:没有|未能|尚未|并未|不会|不再|否认|未证实|未宣布|未批准|并非|不是|无意)/,
    attribution: /(?:表示|称|指出|宣布|报告称|据.*报告|据.*报道|根据.*报告|警告|透露|预计)/,
    causal: /(?:由于|因为|导致|因此|从而|促使|源于|归因于)/,
    contrast: /(?:但是|但|然而|不过|尽管|虽然|相比之下|另一方面|却)/,
    comparison: /(?:相比|与.*相比|高于|低于|超过|少于|同比|环比|增长.*个百分点)/,
    forecast: /(?:预计|预测|展望|预期|估计|将.*增长|将.*下降)/,
    past: /(?:昨日|上周|上月|去年|此前|已经|宣布|表示|上涨|下跌|批准|暂停|恢复)/,
    future: /(?:明日|明年|下周|下月|将|即将|未来)/,
    actions: [
      ["increase", /(?:上涨|上升|增加|增长|提高|升至|攀升|走高)/],
      ["decrease", /(?:下跌|下降|减少|降低|降至|回落|走低)/],
      ["hold", /(?:维持.*不变|保持不变|维持不变|稳定|持平)/],
      ["deny", /(?:否认|驳斥|辟谣)/],
      ["approve", /(?:批准|通过|核准)/],
      ["sanction", /(?:制裁|解除制裁)/],
      ["negotiate", /(?:谈判|磋商|会谈|协议)/],
      ["invest", /(?:投资|融资)/],
      ["export", /(?:出口|出口额)/],
      ["oil", /(?:石油|原油|油价|布伦特)/],
    ],
    actors: [["central_bank", /(?:央行|中央银行)/],["government", /(?:政府|财政部|商务部)/],["opec", /(?:欧佩克|石油输出国组织)/],["imf", /(?:国际货币基金组织)/],["us", /(?:美国|美联储)/],["china", /(?:中国|中国人民银行)/]]
  },
  de: {
    name: "German",
    script: /[A-Za-zÄÖÜäöüß]/g,
    cues: ["der","die","das","und","nicht","wirtschaft","bundesbank","regierung","preise","öl","gold","dollar","stieg","sank","wird","könnte","wenn","aber","laut","prozent","zinsen"],
    modality: /(?:könnte|könnten|dürfte|dürften|möglicherweise|wahrscheinlich|voraussichtlich|erwartet|plant|beabsichtigt)/i,
    conditional: /(?:\bwenn\b|\falls\b|\sofern\b|\unter der bedingung|\vorausgesetzt)/i,
    negation: /(?:\bnicht\b|\bkein(?:e|en|er|es)?\b|\w+te nicht\b|\w+en nicht\b|lehnte ab|bestritt|bestreitet|nicht bestätigt)/i,
    attribution: /(?:laut|nach angaben|teilte mit|erklärte|sagte|berichtete|warnte|kündigte an|zufolge)/i,
    causal: /(?:wegen|aufgrund|infolge|führte zu|führte dazu|deshalb|daher|dadurch)/i,
    contrast: /(?:jedoch|allerdings|obwohl|während|hingegen|dennoch|aber|im gegensatz dazu)/i,
    comparison: /(?:im vergleich zu|verglichen mit|höher als|niedriger als|mehr als|weniger als|gegenüber)/i,
    forecast: /(?:prognose|prognostiziert|erwartet|rechnet mit|ausblick|voraussichtlich|dürfte|dürften)/i,
    past: /(?:gestern|vergangene woche|im vergangenen jahr|stieg|stiegen|sank|sanken|fiel|fielen|kündigte an|beschloss|genehmigte)/i,
    future: /(?:morgen|nächste woche|im kommenden jahr|wird|werden|soll|dürfte|voraussichtlich)/i,
    actions: [
      ["increase", /(?:stieg|stiegen|steigt|steigen|erhöhte|erhöhen|zunahm|zunahme|wuchs|wachstum|legte zu)/i],
      ["decrease", /(?:sank|sanken|sinkt|sinken|fallen|fiel|fielen|senkte|rückgang|ging zurück|gingen zurück|zurückgingen)/i],
      ["hold", /(?:unverändert|stabil|hielt.*konstant|bleibt gleich)/i],
      ["deny", /(?:bestritt|bestreitet|wies.*zurück|dementierte|lehnte ab)/i],
      ["approve", /(?:genehmigte|genehmigt|genehmigen|billigte|verabschiedete|stimmte zu)/i],
      ["sanction", /(?:sanktionen|sanktionierte|hob.*sanktionen auf)/i],
      ["negotiate", /(?:verhandlungen|verhandelte|gespräche|einigung)/i],
      ["invest", /(?:investition|investierte|investitionen)/i],
      ["export", /(?:export|ausfuhr)/i],
      ["oil", /(?:öl|rohöl|brent)/i]
    ],
    actors: [["central_bank", /(?:bundesbank|europäische zentralbank|ezb|zentralbank)/i],["government", /(?:regierung|finanzministerium|ministerium)/i],["opec", /\bopec\b/i],["imf", /(?:iwf|internationaler währungsfonds)/i],["us", /(?:vereinigte staaten|usa|fed)/i],["germany", /(?:deutschland|bundesrepublik)/i]]
  },
  fr: {
    name: "French",
    script: /[A-Za-zÀÂÇÉÈÊËÎÏÔÛÙÜŸÆŒàâçéèêëîïôûùüÿæœ]/g,
    cues: ["le","la","les","des","une","économie","banque","gouvernement","prix","pétrole","or","dollar","hausse","baisse","prévoit","pourrait","selon","mais","pas","si","pour cent","taux"],
    modality: /(?:pourrait|pourraient|devrait|devraient|éventuellement|probablement|susceptible de|prévoit|s'attend à|risque de)/i,
    conditional: /(?:\bsi\b|à condition que|sauf si|dans le cas où|sous réserve de)/i,
    negation: /(?:\bne\b.*\bpas\b|\bne\b.*\bplus\b|\baucun(?:e)?\b|\bjamais\b|\bn'a pas\b|\bn'ont pas\b|\bpas encore\b|a démenti|a rejeté)/i,
    attribution: /(?:selon|a déclaré|a annoncé|a indiqué|a affirmé|a averti|d'après|d’après|le rapport indique|a estimé)/i,
    causal: /(?:en raison de|à cause de|grâce à|a entraîné|a provoqué|conduit à|donc|par conséquent)/i,
    contrast: /(?:cependant|toutefois|pourtant|bien que|alors que|en revanche|mais|malgré|tandis que)/i,
    comparison: /(?:par rapport à|comparé à|supérieur à|inférieur à|plus que|moins que|contre)/i,
    forecast: /(?:prévoit|prévision|perspectives|s'attend à|estime que|anticiper|devrait|devraient)/i,
    past: /(?:hier|la semaine dernière|le mois dernier|l'année dernière|a annoncé|a augmenté|a baissé|a chuté|a approuvé|a suspendu)/i,
    future: /(?:demain|la semaine prochaine|le mois prochain|l'année prochaine|va augmenter|va baisser|sera|seront|devrait)/i,
    actions: [
      ["increase", /(?:hausse|augmenté|augmenter|augmente|a progressé|a grimpé|croissance|en hausse)/i],
      ["decrease", /(?:baisse|baissé|diminuer|diminue|a chuté|recul|reculé|en baisse|réduit)/i],
      ["hold", /(?:stable|inchangé|inchangée|maintenu|maintenue|sans changement)/i],
      ["deny", /(?:démenti|démentir|dément|a démenti|a nié|a rejeté)/i],
      ["approve", /(?:approuvé|approuver|adopté|validé)/i],
      ["sanction", /(?:sanctions|sanctionné|levée des sanctions)/i],
      ["negotiate", /(?:négociations|négocié|pourparlers|accord)/i],
      ["invest", /(?:investissement|investi|investir)/i],
      ["export", /(?:exportation|exportations|exporté)/i],
      ["oil", /(?:pétrole|pétrolier|brut|brent)/i],
    ],
    actors: [["central_bank", /(?:banque centrale|banque centrale européenne|bce)/i],["government", /(?:gouvernement|ministère|ministre)/i],["opec", /\bopep\b|\bopec\b/i],["imf", /(?:fonds monétaire international|fmi)/i],["us", /(?:états-unis|états unis|réserve fédérale)/i],["france", /(?:france|français)/i]]
  },
  ru: {
    name:"Russian",script:/[А-Яа-яЁё]/g,
    cues:["экономика","центробанк","цены","правительство","нефть","золото","доллар","рубль","вырос","снизился","ожидается","возможно","если","однако","не","процент","ставка"],
    modality:/(?:возможно|вероятно|может|ожидается|прогнозируется|предполагается|вероятнее всего)/i,
    conditional:/(?:если|при условии|в случае если|при условии что|за исключением)/i,
    negation:/(?:не\s|ни\s|никогда|отрицает|опроверг|не подтвердил|не одобрил|не будет)/i,
    attribution:/(?:сообщил|сообщила|заявил|заявила|по данным|согласно|отметил|предупредил|по сообщению)/i,
    causal:/(?:из-за|в результате|привело к|по причине|вследствие|поэтому)/i,
    contrast:/(?:однако|но|тем не менее|несмотря на|в то время как|напротив)/i,
    comparison:/(?:по сравнению с|выше чем|ниже чем|больше чем|меньше чем)/i,
    forecast:/(?:прогноз|ожидается|предполагается|прогнозирует|ожидает|может вырасти|может снизиться)/i,
    past:/(?:вчера|на прошлой неделе|в прошлом месяце|в прошлом году|вырос|снизился|объявил|одобрил)/i,
    future:/(?:завтра|на следующей неделе|в следующем месяце|в следующем году|будет|предстоит|ожидается)/i,
    actions:[["increase",/(?:вырос|выросла|увеличил|увеличилось|повысил|поднялся|рост)/i],["decrease",/(?:снизил|снизился|упал|сократил|уменьшил|спад)/i],["hold",/(?:без изменений|оставил без изменений|стабильн|сохранил на прежнем уровне)/i],["deny",/(?:отрицает|опроверг|отказался|не подтвердил)/i],["approve",/(?:одобрил|утвердил|согласовал)/i],["sanction",/(?:санкци|ограничени)/i],["negotiate",/(?:переговор|соглашени)/i],["invest",/(?:инвестиц|вложени)/i],["export",/(?:экспорт|поставки за рубеж)/i],["oil",/(?:нефть|нефтян|брент)/i]],
    actors:[["central_bank",/(?:центральный банк|центробанк)/i],["government",/(?:правительств|министерств)/i],["opec",/(?:опек|opec)/i],["imf",/(?:мвф|международный валютный фонд)/i],["us",/(?:сша|соединенные штаты|фрс)/i],["russia",/(?:росси|российск)/i]]
  },
  ja: {
    name:"Japanese",script:/[\u3040-\u30ff\u4e00-\u9fff]/g,
    cues:["経済","中央銀行","政府","価格","原油","金価格","ドル","円","上昇","下落","予想","可能性","しかし","発表","金利"],
    modality:/(?:可能性がある|可能性|見通し|予想|とみられる|おそれ)/,
    conditional:/(?:もし|場合|条件|ならば|なければ)/,
    negation:/(?:ない|ません|否定|未定|未確認|承認していない|発表していない)/,
    attribution:/(?:発表した|発表によると|述べた|によると|報じた|警告した|明らかにした)/,
    causal:/(?:ため|によって|結果として|につながった|原因で)/,
    contrast:/(?:しかし|一方|にもかかわらず|ただし|反面)/,
    comparison:/(?:と比べて|より高い|より低い|前年比|前月比)/,
    forecast:/(?:予測|見通し|予想|見込まれる|可能性がある)/,
    past:/(?:昨日|先週|先月|昨年|上昇した|下落した|発表した)/,
    future:/(?:明日|来週|来月|来年|する見通し|見込まれる)/,
    actions:[["increase",/(?:上昇|値上がり|増加|引き上げ|拡大)/],["decrease",/(?:下落|値下がり|減少|引き下げ|縮小)/],["hold",/(?:据え置き|変わらない|横ばい|維持)/],["deny",/(?:否定|否認|反論)/],["approve",/(?:承認|可決|認可)/],["sanction",/(?:制裁|制裁措置)/],["negotiate",/(?:交渉|協議|合意)/],["invest",/(?:投資|出資)/],["export",/(?:輸出)/],["oil",/(?:原油|石油|ブレント)/]],
    actors:[["central_bank",/(?:中央銀行|日銀|日本銀行)/],["government",/(?:政府|財務省|経済産業省)/],["opec",/(?:OPEC|石油輸出国機構)/],["imf",/(?:国際通貨基金)/],["us",/(?:米国|アメリカ|FRB)/],["japan",/(?:日本|日銀)/]]
  },
  ko: {
    name:"Korean",script:/[\uac00-\ud7af]/g,
    cues:["경제","중앙은행","정부","가격","원유","금값","달러","원화","상승","하락","전망","가능성","그러나","발표","금리"],
    modality:/(?:가능성이|전망이다|예상된다|수도 있다|것으로 보인다)/,
    conditional:/(?:만약|경우|조건으로|라면|하지 않는 한)/,
    negation:/(?:않았다|않을|아니다|없다|부인|미확인|승인하지 않았)/,
    attribution:/(?:밝혔다|발표했다|말했다|보도에 따르면|경고했다|전했다)/,
    causal:/(?:때문에|결과로|초래했다|따라서|원인으로)/,
    contrast:/(?:그러나|하지만|반면|에도 불구하고|한편)/,
    comparison:/(?:와 비교해|보다 높|보다 낮|전년 대비|전월 대비)/,
    forecast:/(?:전망|예상|예측|가능성이|것으로 보인다)/,
    past:/(?:어제|지난주|지난달|지난해|상승했다|하락했다|발표했다)/,
    future:/(?:내일|다음 주|다음 달|내년|할 예정이다|전망이다)/,
    actions:[["increase",/(?:상승|증가|인상|올랐|확대)/],["decrease",/(?:하락|감소|인하|내렸|축소)/],["hold",/(?:동결|변동 없|유지)/],["deny",/(?:부인|반박|否認)/],["approve",/(?:승인|통과|가결)/],["sanction",/(?:제재|제재 조치)/],["negotiate",/(?:협상|회담|합의)/],["invest",/(?:투자|출자)/],["export",/(?:수출)/],["oil",/(?:원유|석유|브렌트)/]],
    actors:[["central_bank",/(?:중앙은행|한국은행)/],["government",/(?:정부|기획재정부)/],["opec",/(?:OPEC|석유수출국기구)/],["imf",/(?:국제통화기금)/],["us",/(?:미국|연방준비제도)/],["south_korea",/(?:한국|대한민국)/]]
  },
  hi: {
    name:"Hindi",script:/[\u0900-\u097f]/g,
    cues:["अर्थव्यवस्था","केंद्रीय बैंक","सरकार","कीमत","तेल","सोना","डॉलर","रुपया","बढ़ा","गिरावट","अनुमान","संभावना","लेकिन","नहीं","ब्याज"],
    modality:/(?:संभावना|हो सकता है|अनुमान है|उम्मीद है|संभवतः)/,
    conditional:/(?:यदि|अगर|शर्त|जब तक)/,
    negation:/(?:नहीं|न तो|इनकार|अस्वीकार|पुष्टि नहीं|मंजूरी नहीं)/,
    attribution:/(?:कहा|बताया|घोषणा की|रिपोर्ट के अनुसार|चेतावनी दी|के मुताबिक)/,
    causal:/(?:के कारण|की वजह से|जिससे|परिणामस्वरूप|इसलिए)/,
    contrast:/(?:लेकिन|हालांकि|जबकि|इसके बावजूद|दूसरी ओर)/,
    comparison:/(?:की तुलना में|से अधिक|से कम|पिछले साल के मुकाबले)/,
    forecast:/(?:अनुमान|पूर्वानुमान|उम्मीद|संभावना|आशंका)/,
    past:/(?:कल|पिछले सप्ताह|पिछले महीने|पिछले साल|बढ़ा|गिरा|घोषणा की)/,
    future:/(?:कल|अगले सप्ताह|अगले महीने|अगले साल|होगा|होने की उम्मीद)/,
    actions:[["increase",/(?:बढ़ा|बढ़ोतरी|वृद्धि|ऊपर गया|इजाफा)/],["decrease",/(?:गिरा|गिरावट|कमी|घटा|नीचे आया)/],["hold",/(?:स्थिर|अपरिवर्तित|कोई बदलाव नहीं)/],["deny",/(?:इनकार|खंडन|अस्वीकार)/],["approve",/(?:मंजूरी|स्वीकृति|अनुमोदन)/],["sanction",/(?:प्रतिबंध|पाबंदी)/],["negotiate",/(?:बातचीत|वार्ता|समझौता)/],["invest",/(?:निवेश)/],["export",/(?:निर्यात)/],["oil",/(?:तेल|कच्चा तेल)/]],
    actors:[["central_bank",/(?:केंद्रीय बैंक|भारतीय रिजर्व बैंक|आरबीआई)/],["government",/(?:सरकार|वित्त मंत्रालय)/],["opec",/(?:ओपेक|OPEC)/],["imf",/(?:अंतरराष्ट्रीय मुद्रा कोष)/],["us",/(?:अमेरिका|अमेरिकी फेडरल रिजर्व)/],["india",/(?:भारत|भारतीय)/]]
  },
  es: {
    name:"Spanish",script:/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g,
    cues:["economía","banco central","gobierno","precios","petróleo","oro","dólar","subió","bajó","previsión","posible","aunque","según","no","tipos","inflación"],
    modality:/(?:podría|podrían|posiblemente|probablemente|se espera|es probable|previsiblemente)/i,
    conditional:/(?:\bsi\b|en caso de|a condición de|salvo que|siempre que)/i,
    negation:/(?:\bno\b|nunca|ni siquiera|negó|desmintió|no confirmó|no aprobó)/i,
    attribution:/(?:según|declaró|anunció|afirmó|advirtió|informó|de acuerdo con)/i,
    causal:/(?:debido a|a causa de|provocó|condujo a|por lo tanto|como resultado)/i,
    contrast:/(?:sin embargo|aunque|pero|mientras que|a pesar de|por el contrario)/i,
    comparison:/(?:en comparación con|frente a|más que|menos que|por encima de|por debajo de)/i,
    forecast:/(?:previsión|pronóstico|se espera|prevé|estima|podría subir|podría caer)/i,
    past:/(?:ayer|la semana pasada|el mes pasado|el año pasado|subió|bajó|anunció)/i,
    future:/(?:mañana|la próxima semana|el próximo mes|el próximo año|subirá|bajará|será)/i,
    actions:[["increase",/(?:subió|subida|aumentó|aumento|creció|alza|incrementó)/i],["decrease",/(?:bajó|caída|cayó|descendió|disminuyó|retroceso)/i],["hold",/(?:sin cambios|se mantuvo|estable|estancado)/i],["deny",/(?:negó|desmintió|rechazó)/i],["approve",/(?:aprobó|autorizó|ratificó)/i],["sanction",/(?:sanciones|sancionó|levantó las sanciones)/i],["negotiate",/(?:negociaciones|negoció|acuerdo)/i],["invest",/(?:inversión|invirtió)/i],["export",/(?:exportación|exportaciones|exportó)/i],["oil",/(?:petróleo|crudo|brent)/i]],
    actors:[["central_bank",/(?:banco central|banco central europeo)/i],["government",/(?:gobierno|ministro|ministerio)/i],["opec",/\bopec\b/i],["imf",/(?:fondo monetario internacional|fmi)/i],["us",/(?:estados unidos|reserva federal|fed)/i],["spain",/(?:españa|español)/i]]
  },
  it: {
    name:"Italian",script:/[A-Za-zÀÈÉÌÒÙàèéìòù]/g,
    cues:["economia","banca centrale","governo","prezzi","petrolio","oro","dollaro","aumento","calo","prevede","potrebbe","tuttavia","secondo","non","tassi"],
    modality:/(?:potrebbe|potrebbero|probabilmente|possibilmente|si prevede|è probabile)/i,
    conditional:/(?:\bse\b|a condizione che|nel caso in cui|salvo che)/i,
    negation:/(?:\bnon\b|mai|nessun|ha negato|non ha confermato|non ha approvato)/i,
    attribution:/(?:secondo|ha dichiarato|ha annunciato|ha affermato|ha avvertito|stando a)/i,
    causal:/(?:a causa di|per effetto di|ha provocato|ha portato a|pertanto)/i,
    contrast:/(?:tuttavia|però|sebbene|mentre|nonostante|al contrario)/i,
    comparison:/(?:rispetto a|in confronto a|più di|meno di|superiore a|inferiore a)/i,
    forecast:/(?:previsione|prevede|si attende|stima|potrebbe salire|potrebbe scendere)/i,
    past:/(?:ieri|la settimana scorsa|il mese scorso|l'anno scorso|è aumentato|è calato)/i,
    future:/(?:domani|la prossima settimana|il prossimo mese|il prossimo anno|sarà|aumenterà)/i,
    actions:[["increase",/(?:aumento|aumentato|crescita|salita|rialzo|incremento)/i],["decrease",/(?:calo|diminuzione|discesa|riduzione|ribasso|scende)/i],["hold",/(?:stabile|invariato|senza variazioni)/i],["deny",/(?:negato|smentito|respinto)/i],["approve",/(?:approvato|autorizzato|ratificato)/i],["sanction",/(?:sanzioni|sanzionato)/i],["negotiate",/(?:negoziati|trattative|accordo)/i],["invest",/(?:investimento|investimenti)/i],["export",/(?:esportazione|esportazioni)/i],["oil",/(?:petrolio|greggio|brent)/i]],
    actors:[["central_bank",/(?:banca centrale|banca centrale europea|bce)/i],["government",/(?:governo|ministero)/i],["opec",/\bopec\b/i],["imf",/(?:fondo monetario internazionale|fmi)/i],["us",/(?:stati uniti|federal reserve)/i],["italy",/(?:italia|italiano)/i]]
  },
  pt: {
    name:"Portuguese",script:/[A-Za-zÁÂÃÀÇÉÊÍÓÔÕÚÜáâãàçéêíóôõúü]/g,
    cues:["economia","banco central","governo","preços","petróleo","ouro","dólar","aumentou","queda","previsão","poderia","segundo","não","juros","inflação"],
    modality:/(?:poderia|poderão|possivelmente|provavelmente|espera-se|é provável)/i,
    conditional:/(?:\bse\b|caso|desde que|a menos que)/i,
    negation:/(?:\bnão\b|nunca|nenhum|negou|não confirmou|não aprovou)/i,
    attribution:/(?:segundo|afirmou|declarou|anunciou|alertou|de acordo com)/i,
    causal:/(?:devido a|por causa de|levou a|provocou|portanto|em consequência)/i,
    contrast:/(?:porém|contudo|embora|mas|enquanto|apesar de)/i,
    comparison:/(?:em comparação com|em relação a|mais do que|menos do que|acima de|abaixo de)/i,
    forecast:/(?:previsão|projeção|espera-se|prevê|estima|poderia subir|poderia cair)/i,
    past:/(?:ontem|na semana passada|no mês passado|no ano passado|subiu|caiu|anunciou)/i,
    future:/(?:amanhã|na próxima semana|no próximo mês|no próximo ano|será|deverá)/i,
    actions:[["increase",/(?:aumentou|alta|crescimento|subida|elevação|avançou)/i],["decrease",/(?:queda|caiu|recuou|redução|diminuiu|baixa)/i],["hold",/(?:estável|sem alterações|manteve|inalterado)/i],["deny",/(?:negou|desmentiu|rejeitou)/i],["approve",/(?:aprovou|autorizou|ratificou)/i],["sanction",/(?:sanções|sancionou)/i],["negotiate",/(?:negociações|negociou|acordo)/i],["invest",/(?:investimento|investiu)/i],["export",/(?:exportação|exportações)/i],["oil",/(?:petróleo|brent|crude)/i]],
    actors:[["central_bank",/(?:banco central|banco central do brasil)/i],["government",/(?:governo|ministério)/i],["opec",/\bopec\b/i],["imf",/(?:fundo monetário internacional|fmi)/i],["us",/(?:estados unidos|fed)/i],["brazil",/(?:brasil|brasileiro)/i]]
  },
  tr: {
    name:"Turkish",script:/[A-Za-zÇĞİÖŞÜçğıöşü]/g,
    cues:["ekonomi","merkez bankası","hükümet","fiyatlar","petrol","altın","dolar","yükseldi","düştü","beklenti","olabilir","ancak","göre","değil","faiz"],
    modality:/(?:olabilir|bekleniyor|muhtemelen|öngörülüyor|ihtimali)/i,
    conditional:/(?:\beğer\b|\bise\b|şartıyla|durumunda|olmadıkça)/i,
    negation:/(?:değil|yok|hayır|reddetti|doğrulamadı|onaylamadı)/i,
    attribution:/(?:açıklamasına göre|dedi|belirtti|duyurdu|uyardı|raporuna göre)/i,
    causal:/(?:nedeniyle|sonucunda|yol açtı|sebebiyle|bu nedenle)/i,
    contrast:/(?:ancak|fakat|oysa|rağmen|buna karşın|öte yandan)/i,
    comparison:/(?:karşılaştırıldığında|göre daha|daha yüksek|daha düşük|geçen yıla göre)/i,
    forecast:/(?:beklenti|tahmin|öngörü|bekleniyor|olabilir)/i,
    past:/(?:dün|geçen hafta|geçen ay|geçen yıl|yükseldi|düştü|açıkladı)/i,
    future:/(?:yarın|gelecek hafta|gelecek ay|gelecek yıl|olacak|artacak)/i,
    actions:[["increase",/(?:yükseldi|arttı|artış|yükseliş|çoğaldı)/i],["decrease",/(?:düştü|azaldı|düşüş|geriledi|daraldı)/i],["hold",/(?:sabit|değişmedi|aynı kaldı|istikrarlı)/i],["deny",/(?:reddetti|yalanladı|inkâr etti)/i],["approve",/(?:onayladı|kabul etti|yetkilendirdi)/i],["sanction",/(?:yaptırım|ambargo)/i],["negotiate",/(?:müzakere|görüşme|anlaşma)/i],["invest",/(?:yatırım|yatırdı)/i],["export",/(?:ihracat|dış satım)/i],["oil",/(?:petrol|ham petrol|brent)/i]],
    actors:[["central_bank",/(?:merkez bankası|tcmb)/i],["government",/(?:hükümet|bakanlık)/i],["opec",/\bopec\b/i],["imf",/(?:uluslararası para fonu|imf)/i],["us",/(?:abd|amerikan merkez bankası|fed)/i],["turkey",/(?:türkiye|türk)/i]]
  },
  nl: {
    name:"Dutch",script:/[A-Za-zÀ-ÿ]/g,
    cues:["economie","centrale bank","regering","prijzen","olie","goud","dollar","steeg","daalde","verwacht","mogelijk","maar","volgens","niet","rente"],
    modality:/(?:mogelijk|waarschijnlijk|naar verwachting|kan stijgen|zou kunnen)/i,
    conditional:/(?:\bals\b|indien|mits|op voorwaarde dat|tenzij)/i,
    negation:/(?:\bniet\b|geen|nooit|ontkende|niet bevestigd|niet goedgekeurd)/i,
    attribution:/(?:volgens|verklaarde|kondigde aan|meldde|waarschuwde|aldus)/i,
    causal:/(?:door|vanwege|leidde tot|als gevolg van|daarom)/i,
    contrast:/(?:maar|echter|hoewel|terwijl|desondanks|daarentegen)/i,
    comparison:/(?:vergeleken met|hoger dan|lager dan|meer dan|minder dan)/i,
    forecast:/(?:verwachting|voorspelling|verwacht|vooruitzicht|mogelijk)/i,
    past:/(?:gisteren|vorige week|vorige maand|vorig jaar|steeg|daalde|kondigde aan)/i,
    future:/(?:morgen|volgende week|volgende maand|volgend jaar|zal|zullen)/i,
    actions:[["increase",/(?:steeg|stijging|toename|verhoogde|groei)/i],["decrease",/(?:daalde|daling|afname|verlaagde|terugval)/i],["hold",/(?:stabiel|ongewijzigd|bleef gelijk)/i],["deny",/(?:ontkende|weersprak|afgewezen)/i],["approve",/(?:goedgekeurd|keurde goed|aangenomen)/i],["sanction",/(?:sancties|sanctioneerde)/i],["negotiate",/(?:onderhandelingen|overleg|akkoord)/i],["invest",/(?:investering|investeerde)/i],["export",/(?:export|uitvoer)/i],["oil",/(?:olie|ruwe olie|brent)/i]],
    actors:[["central_bank",/(?:centrale bank|europese centrale bank|ecb)/i],["government",/(?:regering|ministerie)/i],["opec",/\bopec\b/i],["imf",/(?:internationaal monetair fonds|imf)/i],["us",/(?:verenigde staten|fed)/i],["netherlands",/(?:nederland|nederlands)/i]]
  },
  pl: {
    name:"Polish",script:/[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g,
    cues:["gospodarka","bank centralny","rząd","ceny","ropa","złoto","dolar","wzrosła","spadła","prognoza","może","jednak","według","nie","stopy"],
    modality:/(?:może|prawdopodobnie|oczekuje się|przewiduje|jest możliwe)/i,
    conditional:/(?:\bjeśli\b|\bgdyby\b|pod warunkiem|chyba że)/i,
    negation:/(?:\bnie\b|nigdy|zaprzeczył|nie potwierdził|nie zatwierdził)/i,
    attribution:/(?:według|powiedział|ogłosił|poinformował|ostrzegł|jak wynika z)/i,
    causal:/(?:z powodu|w wyniku|doprowadził do|dlatego|na skutek)/i,
    contrast:/(?:jednak|ale|chociaż|mimo że|natomiast|z kolei)/i,
    comparison:/(?:w porównaniu z|wyższy niż|niższy niż|więcej niż|mniej niż)/i,
    forecast:/(?:prognoza|przewiduje|oczekuje|perspektywy|może wzrosnąć)/i,
    past:/(?:wczoraj|w zeszłym tygodniu|w zeszłym miesiącu|w ubiegłym roku|wzrosła|spadła)/i,
    future:/(?:jutro|w przyszłym tygodniu|w przyszłym miesiącu|w przyszłym roku|będzie)/i,
    actions:[["increase",/(?:wzrosła|wzrost|zwiększył|podwyższył|zwyżka)/i],["decrease",/(?:spadła|spadek|obniżył|zmniejszył|zniżka)/i],["hold",/(?:bez zmian|stabilny|pozostał bez zmian)/i],["deny",/(?:zaprzeczył|zdementował|odrzucił)/i],["approve",/(?:zatwierdził|zaakceptował|przyjął)/i],["sanction",/(?:sankcje|sankcjonował)/i],["negotiate",/(?:negocjacje|rozmowy|porozumienie)/i],["invest",/(?:inwestycja|inwestował)/i],["export",/(?:eksport|wywóz)/i],["oil",/(?:ropa|ropa naftowa|brent)/i]],
    actors:[["central_bank",/(?:bank centralny|nbp|europejski bank centralny)/i],["government",/(?:rząd|ministerstwo)/i],["opec",/\bopec\b/i],["imf",/(?:międzynarodowy fundusz walutowy|mfw)/i],["us",/(?:stany zjednoczone|fed)/i],["poland",/(?:polska|polski)/i]]
  }
};

const normalize = (value, lang) => {
  let s = String(value ?? "").normalize("NFKC").toLocaleLowerCase(lang === "tr" ? "tr" : "und");
  if (lang === "ar") s = s.replace(/[ًٌٍَُِّْـٰ]/g, "").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/[٠-٩۰-۹]/g, d => String("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹".indexOf(d) % 10));
  if (lang === "de") s = s.replace(/ß/g,"ss");
  return s.replace(/[\u200b-\u200f\uFEFF]/g," ").replace(/\s+/g," ").trim();
};

function detectMultilingualLanguage(text, hint) {
  if (Object.hasOwn(LANGS,hint)) return {language:hint,confidence:0.98,method:"source_language_metadata"};
  const s=String(text ?? "");
  const ar=(s.match(/[\u0600-\u06ff]/g)||[]).length;
  const zh=(s.match(/[\u4e00-\u9fff]/g)||[]).length;
  if (hi>=2 && hi>s.length*0.04) return {language:"hi",confidence:Math.min(0.99,0.65+hi/Math.max(1,s.length)),method:"script_detection"};
  if (ko>=2 && ko>s.length*0.04) return {language:"ko",confidence:Math.min(0.99,0.65+ko/Math.max(1,s.length)),method:"script_detection"};
  if (ja>=2 && ja>s.length*0.04) return {language:"ja",confidence:Math.min(0.99,0.65+ja/Math.max(1,s.length)),method:"script_detection"};
  if (zh>=2 && zh>s.length*0.04) return {language:"zh",confidence:Math.min(0.99,0.65+zh/Math.max(1,s.length)),method:"script_detection"};
  if (ru>=2 && ru>s.length*0.04) return {language:"ru",confidence:Math.min(0.99,0.65+ru/Math.max(1,s.length)),method:"script_detection"};
  if (ar>=3 && ar>s.length*0.08) return {language:"ar",confidence:Math.min(0.99,0.65+ar/Math.max(1,s.length)),method:"script_detection"};
  const words=(s.toLowerCase().match(/[A-Za-zÀ-žİı]+/g)||[]);
  const lexicalLanguages=["de","fr","es","it","pt","tr","nl","pl"];
  const scores=Object.fromEntries(lexicalLanguages.map(code=>[code,0]));
  for (const w of words) for (const code of lexicalLanguages) if (LANGS[code].cues.includes(w)) scores[code]++;
  const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  if (ranked[0][1]<2 || ranked[0][1]===ranked[1][1]) return {language:"und",confidence:0,method:"insufficient_language_evidence"};
  const language=ranked[0][0];
  return {language,confidence:Number((Math.min(0.96,0.58+ranked[0][1]*0.06)).toFixed(2)),method:"lexical_cue_detection"};
}

function splitSentences(text) {
  return String(text ?? "").replace(/\s+/g," ").split(/(?<=[.!?؟。！？])\s*/u).map(x=>x.trim()).filter(Boolean).slice(0,30);
}

function extractQuantities(text) {
  const out=[];
  const re=/(?:[$€£¥]\s*)?\d[\d.,]*(?:\s?(?:%|٪|percent|prozent|pour cent|مليار|میلیارد|million|billion|trillion|millions?|milliards?|billionen?|millionen?|yuan|euros?|dollars?|euro|dollar|元|亿元|美元|欧元|دولار|درهم|ریال))?/giu;
  for (const m of String(text ?? "").matchAll(re)) {
    const raw=m[0].trim();
    if (!/\d/.test(raw)) continue;
    const numeric=(raw.match(/\d[\d.,]*/)||[])[0];
    const value=Number(numeric.replace(/,(?=\d{3}(?:\D|$))/g,"").replace(/,(?=\d{1,2}$)/,"."));
    if (!Number.isFinite(value)) continue;
    out.push({raw,value,unit:(raw.slice(numeric.length).trim()||null),context:String(text).slice(Math.max(0,m.index-45),Math.min(String(text).length,m.index+raw.length+45))});
    if (out.length>=20) break;
  }
  return out;
}

function inspect(text, language, index) {
  const cfg=LANGS[language];
  const t=normalize(text,language);
  const actions=cfg.actions.filter(([,re])=>re.test(t)).map(([id])=>id);
  const actors=cfg.actors.filter(([,re])=>re.test(t)).map(([id])=>id);
  const modality=cfg.modality.test(t);
  const conditional=cfg.conditional.test(t);
  const negated=cfg.negation.test(t);
  const attributed=cfg.attribution.test(t);
  const causal=cfg.causal.test(t);
  const contrast=cfg.contrast.test(t);
  const comparison=cfg.comparison.test(t);
  const forecast=cfg.forecast.test(t);
  const tense=cfg.future.test(t)?"future":cfg.past.test(t)?"past":"unspecified";
  const quantities=extractQuantities(t);
  const features=[modality,conditional,negated,attributed,causal,contrast,comparison,forecast,actions.length>0,actors.length>0,quantities.length>0].filter(Boolean).length;
  return {
    sentence_index:index+1,text,language,actors,action_concepts:actions,
    modality,conditional,negated,attributed,causal,contrast,comparison,forecast,tense,
    quantities,
    assertion_class:conditional?"conditional":modality||forecast?"possible_or_forecast":negated?"negated_or_denied":attributed?"attributed_statement":"asserted_in_text",
    ambiguity_flags:[...(quantities.some(q=>!q.unit)?["quantity_without_explicit_unit"]:[]),...(text.length>360?["long_sentence_requires_clause_review"]:[])],
    feature_coverage_pct:Number((features/11*100).toFixed(1)),
    verification_state:"linguistic_features_only_claim_not_fact_checked"
  };
}

export function analyzeMultilingualNews(title, body="", languageHint=null) {
  const text=[title,body].filter(Boolean).join(". ").slice(0,6000);
  const detection=detectMultilingualLanguage(text,languageHint);
  if (!LANGS[detection.language]) return {
    version:MULTILINGUAL_VERSION,language:"und",language_detection:detection,
    reading_status:"unsupported_or_ambiguous_language",sentence_frames:[],claims:[],extracted_quantities:[],
    limitations:["No reliable Arabic, Chinese, German or French language identification was possible."]
  };
  const language=detection.language;
  const sentences=splitSentences(text);
  const frames=sentences.map((sentence,index)=>inspect(sentence,language,index));
  const claims=frames.map(f=>({
    claim_id:"sentence_"+f.sentence_index,sentence_index:f.sentence_index,text:f.text,
    actor_candidates:f.actors,action_concepts:f.action_concepts,
    polarity:f.negated?"negated":"not_explicitly_negated",
    certainty:f.assertion_class,attribution_present:f.attributed,
    temporal_scope:f.tense,quantities:f.quantities,
    verification_state:f.verification_state
  }));
  return {
    version:MULTILINGUAL_VERSION,language,language_name:LANGS[language].name,
    language_detection:detection,reading_status:text.length>0?"parsed_linguistic_features":"insufficient_text",
    sentence_frames:frames,claims,extracted_quantities:frames.flatMap(f=>f.quantities),
    summary:{
      sentence_count:frames.length,
      conditional_count:frames.filter(f=>f.conditional).length,
      modal_or_forecast_count:frames.filter(f=>f.modality||f.forecast).length,
      negated_count:frames.filter(f=>f.negated).length,
      attributed_count:frames.filter(f=>f.attributed).length,
      causal_count:frames.filter(f=>f.causal).length,
      contrast_count:frames.filter(f=>f.contrast).length,
      comparison_count:frames.filter(f=>f.comparison).length,
      action_concepts:[...new Set(frames.flatMap(f=>f.action_concepts))],
      actor_candidates:[...new Set(frames.flatMap(f=>f.actors))]
    },
    limitations:[
      "Rule-based language support; not neural or human-level comprehension.",
      "No machine translation is performed.",
      "Arabic dialects, Chinese traditional characters, German compounds and French idioms need broader validation.",
      "A detected linguistic relation does not verify the underlying event or causal claim.",
      "Long-distance coreference, sarcasm and source credibility require separate evidence."
    ]
  };
}

const BENCHMARK_CASES = [
  {lang:"ar",text:"أعلن البنك المركزي أن أسعار النفط ارتفعت بنسبة ٣٪ أمس، لكنه لا يتوقع استمرار الزيادة.",checks:{attributed:true,contrast:true,negated:true,actions:["increase"],actors:["central_bank"],past:true}},
  {lang:"ar",text:"إذا انخفضت أسعار النفط فقد يتراجع الدولار، وفقاً لتقرير البنك.",checks:{conditional:true,modality:true,attributed:true,actions:["decrease"]}},
  {lang:"ar",text:"الحكومة لم توافق على الاتفاق، ومن المتوقع استئناف المفاوضات الأسبوع المقبل.",checks:{negated:true,forecast:true,actions:["approve","negotiate"],future:true}},
  {lang:"ar",text:"ارتفع الذهب إلى ٢٣٠٠ دولار، بينما انخفض النفط إلى ٧٥ دولاراً.",checks:{contrast:true,actions:["increase","decrease","oil"],quantities:2}},
  {lang:"ar",text:"نفى المسؤولون فرض عقوبات جديدة على إيران.",checks:{negated:true,attributed:true,actions:["deny","sanction"]}},
  {lang:"ar",text:"قد يرفع البنك المركزي أسعار الفائدة إذا تسارع التضخم.",checks:{modality:true,conditional:true}},
  {lang:"ar",text:"بحسب التقرير، زادت الصادرات بنسبة ٥ بالمئة مقارنة بالعام الماضي.",checks:{attributed:true,comparison:true,actions:["increase","export"]}},
  {lang:"ar",text:"أبقى البنك المركزي سعر الفائدة دون تغيير.",checks:{actions:["hold"],actors:["central_bank"]}},
  {lang:"zh",text:"央行表示，昨日油价上涨了3%，但预计涨势不会持续。",checks:{attributed:true,past:true,contrast:true,modality:true,negated:true,actions:["increase","oil"],actors:["central_bank"],quantities:1}},
  {lang:"zh",text:"如果原油价格下跌，美元可能走强。",checks:{conditional:true,modality:true,actions:["decrease","oil"]}},
  {lang:"zh",text:"政府尚未批准该协议，并否认将实施新制裁。",checks:{negated:true,actions:["approve","deny","sanction"]}},
  {lang:"zh",text:"报告预计明年黄金价格将上涨至每盎司2500美元。",checks:{forecast:true,future:true,actions:["increase"],quantities:1}},
  {lang:"zh",text:"与去年相比，出口增长了5%，进口却下降了2%。",checks:{comparison:true,contrast:true,actions:["increase","decrease","export"],quantities:2}},
  {lang:"zh",text:"据央行报告，通胀下降了一个百分点。",checks:{attributed:true,actions:["decrease"],actors:["central_bank"]}},
  {lang:"zh",text:"尽管投资增加，企业融资成本仍然较高。",checks:{contrast:true,actions:["increase","invest"]}},
  {lang:"zh",text:"政府表示将维持利率不变。",checks:{attributed:true,future:true,actions:["hold"]}},
  {lang:"de",text:"Die Zentralbank erklärte, dass die Ölpreise gestern um 3 Prozent stiegen, aber der Anstieg könnte nicht anhalten.",checks:{attributed:true,past:true,contrast:true,modality:true,negated:true,actions:["increase","oil"],actors:["central_bank"],quantities:1}},
  {lang:"de",text:"Wenn die Ölpreise fallen, könnte der Dollar stärker werden.",checks:{conditional:true,modality:true,actions:["decrease","oil"]}},
  {lang:"de",text:"Die Regierung hat das Abkommen noch nicht genehmigt und bestreitet neue Sanktionen.",checks:{negated:true,actions:["approve","deny","sanction"]}},
  {lang:"de",text:"Laut dem Bericht dürfte die Inflation im nächsten Jahr um 2 Prozent sinken.",checks:{attributed:true,forecast:true,future:true,actions:["decrease"],quantities:1}},
  {lang:"de",text:"Im Vergleich zum Vorjahr stiegen die Exporte um 5 Prozent, während die Importe zurückgingen.",checks:{comparison:true,contrast:true,actions:["increase","decrease","export"],quantities:1}},
  {lang:"de",text:"Die Bundesbank hielt den Leitzins unverändert.",checks:{actions:["hold"],actors:["central_bank"]}},
  {lang:"de",text:"Die Regierung kündigte an, die Investitionen zu erhöhen.",checks:{attributed:true,actions:["increase","invest"]}},
  {lang:"de",text:"Obwohl die Nachfrage steigt, bleibt das Angebot begrenzt.",checks:{contrast:true,actions:["increase"]}},
  {lang:"fr",text:"La banque centrale a annoncé que les prix du pétrole ont augmenté de 3 % hier, mais cette hausse pourrait ne pas durer.",checks:{attributed:true,past:true,contrast:true,modality:true,negated:true,actions:["increase","oil"],actors:["central_bank"],quantities:1}},
  {lang:"fr",text:"Si les prix du pétrole baissent, le dollar pourrait se renforcer.",checks:{conditional:true,modality:true,actions:["decrease","oil"]}},
  {lang:"fr",text:"Le gouvernement n'a pas approuvé l'accord et dément de nouvelles sanctions.",checks:{negated:true,actions:["approve","deny","sanction"]}},
  {lang:"fr",text:"Selon le rapport, l'inflation devrait diminuer de 2 % l'année prochaine.",checks:{attributed:true,forecast:true,future:true,actions:["decrease"],quantities:1}},
  {lang:"fr",text:"Par rapport à l'année dernière, les exportations ont augmenté de 5 %, tandis que les importations ont reculé.",checks:{comparison:true,contrast:true,actions:["increase","decrease","export"],quantities:1}},
  {lang:"fr",text:"La banque centrale a maintenu le taux d'intérêt inchangé.",checks:{actions:["hold"],actors:["central_bank"]}},
  {lang:"fr",text:"Le gouvernement a annoncé un nouvel investissement dans le secteur pétrolier.",checks:{attributed:true,actions:["invest","oil"]}},
  {lang:"fr",text:"Bien que la demande augmente, les prix restent stables.",checks:{contrast:true,actions:["increase","hold"]}}
];

export function runMultilingualBenchmark() {
  const results=BENCHMARK_CASES.map((item,index)=>{
    const frame=inspect(item.text,item.lang,0);
    const checks=[];
    for (const key of ["modality","conditional","negated","attributed","causal","contrast","comparison","forecast"]) {
      if (item.checks[key]!==undefined) checks.push({key,passed:frame[key]===item.checks[key]});
    }
    if (item.checks.past!==undefined) checks.push({key:"past",passed:frame.tense==="past"});
    if (item.checks.future!==undefined) checks.push({key:"future",passed:frame.tense==="future"});
    if (item.checks.actions) checks.push({key:"actions",passed:item.checks.actions.every(x=>frame.action_concepts.includes(x))});
    if (item.checks.actors) checks.push({key:"actors",passed:item.checks.actors.every(x=>frame.actors.includes(x))});
    if (item.checks.quantities!==undefined) checks.push({key:"quantities",passed:frame.quantities.length>=item.checks.quantities});
    return {id:index+1,language:item.lang,passed:checks.every(x=>x.passed),checks,text:item.text};
  });
  const byLanguage={};
  for (const lang of ["ar","zh","de","fr"]) {
    const subset=results.filter(x=>x.language===lang);
    byLanguage[lang]={total:subset.length,passed:subset.filter(x=>x.passed).length,failed:subset.filter(x=>!x.passed).length};
  }
  return {
    version:MULTILINGUAL_VERSION,benchmark:"curated_rule_based_news_comprehension_regression",
    total:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,
    score_pct:Number((results.filter(x=>x.passed).length/results.length*100).toFixed(1)),
    by_language:byLanguage,failures:results.filter(x=>!x.passed),
    scope:"Curated synthetic regression cases only; not a real-world accuracy estimate or independent translation evaluation."
  };
}
