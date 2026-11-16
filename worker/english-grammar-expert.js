// Expert English grammar curriculum: advanced syntax, complementation, semantics, discourse, register and usage.
// Each record includes a rule, authentic-style example and a scope/variation note.
export const ENGLISH_GRAMMAR_EXPERT_VERSION = "en-grammar-expert-1.0.0";
const rows = [
  [
    "finite-nonfinite-clauses",
    "تمایز بند متناهی و نامتناهی: بند متناهی فعل صرف‌شده و زمان/وجه دارد؛ بند نامتناهی با to-infinitive، bare infinitive یا -ing/-ed ساخته می‌شود.",
    "That she resigned surprised everyone. / Her resigning surprised everyone.",
    "بند نامتناهی می‌تواند فاعل، مفعول، مکمل یا قید باشد؛ همهٔ بندهای دارای -ing یکسان نیستند."
  ],
  [
    "gerund-participle-distinction",
    "شکل -ing بسته به جایگاه می‌تواند اسم‌مصدر (gerund) یا وجه وصفی/فعل استمراری باشد؛ نقش نحوی را از ساختار تشخیص بده، نه صرفاً پسوند را.",
    "Swimming relaxes me. / The swimming child waved.",
    "در دستورهای نوین، هر دو اغلب present participle/gerund-participle نامیده می‌شوند؛ مرزبندی سنتی همیشه روشن نیست."
  ],
  [
    "to-infinitive-subject",
    "مصدر با to می‌تواند فاعل جمله باشد؛ در انگلیسی امروز ساختار it-extraposition اغلب طبیعی‌تر است.",
    "To admit the error was difficult. / It was difficult to admit the error.",
    "در سبک رسمی یا برای تأکید، مصدر در ابتدای جمله همچنان طبیعی است."
  ],
  [
    "bare-infinitive-causative",
    "پس از make/let و گاهی help، مفعول با مصدر بدون to می‌آید؛ در مجهول make، to بازمی‌گردد.",
    "They made us wait. / We were made to wait.",
    "help هم با to و هم بدون to می‌آید؛ let در مجهول معمولاً با be allowed to بازنویسی می‌شود."
  ],
  [
    "perception-verb-complement",
    "پس از افعال ادراک، object + bare infinitive کل رویداد را و -ing رویداد در حال جریان را برجسته می‌کند.",
    "I saw him cross the road. / I saw him crossing the road.",
    "تفاوت معنایی همیشه مطلق نیست و با بافت و نوع فعل تغییر می‌کند."
  ],
  [
    "verb-complement-meaning-change",
    "برخی افعال با gerund و infinitive معنی متفاوت می‌گیرند؛ الگوی مکمل بخشی از معنی واژه است.",
    "I stopped smoking. / I stopped to smoke.",
    "remember, forget, regret, try, mean و go on نیز تفاوت‌های معنایی مهم دارند."
  ],
  [
    "remember-gerund-infinitive",
    "remember/forget + gerund به یادآوریِ عملِ انجام‌شده و + infinitive به یادآوریِ وظیفهٔ آینده اشاره می‌کند.",
    "I remember locking the door. / Remember to lock it.",
    "کاربردها با زمان مرجع و بافت گفتمانی تفسیر می‌شوند."
  ],
  [
    "regret-gerund-infinitive",
    "regret + gerund برای پشیمانی از عمل گذشته و regret + to-infinitive عمدتاً در اعلام رسمی خبر ناخوشایند است.",
    "I regret saying that. / We regret to inform you...",
    "regret to say/inform/announce قالب رسمی و محدودتر است."
  ],
  [
    "try-gerund-infinitive",
    "try + gerund یعنی یک روش را آزمایش کردن؛ try + infinitive یعنی تلاش کردن تا کاری انجام شود.",
    "Try restarting the system. / I tried to restart it.",
    "در بافت‌های خاص هم‌پوشانی معنایی ممکن است."
  ],
  [
    "mean-gerund-infinitive",
    "mean + gerund به معنی مستلزم بودن و mean + infinitive به معنی قصد داشتن است.",
    "The job means travelling. / I meant to call you.",
    "فاعل و بافت تعیین می‌کنند کدام معنی فعال است."
  ],
  [
    "go-on-gerund-infinitive",
    "go on + gerund ادامهٔ همان فعالیت و go on + infinitive رفتن به مرحله/موضوع بعدی را نشان می‌دهد.",
    "He went on talking. / He went on to discuss the results.",
    "این تمایز در روایت و توالی رویداد اهمیت دارد."
  ],
  [
    "need-gerund-passive",
    "need + gerund می‌تواند معنای مجهول داشته باشد؛ need + to-infinitive با فاعل انجام‌دهندهٔ کار می‌آید.",
    "The report needs revising. / You need to revise it.",
    "ساختار need to be revised نیز معادل مجهول روشن‌تر است."
  ],
  [
    "having-participle-perfect",
    "having + past participle بند participle کامل می‌سازد و معمولاً تقدم زمانی را نشان می‌دهد.",
    "Having reviewed the data, she published the report.",
    "فاعل ضمنی بند باید با فاعل بند اصلی هم‌مرجع باشد؛ وگرنه dangling participle رخ می‌دهد."
  ],
  [
    "dangling-modifier",
    "عبارت وصفی یا قیدیِ آغازین باید از نظر منطقی به فاعل بند اصلی متصل باشد.",
    "Walking home, I saw the storm.",
    "ساختارهایی مانند Generally speaking قیدهای تثبیت‌شده‌اند و الزاماً dangling نیستند."
  ],
  [
    "absolute-construction",
    "ساختار absolute دارای فاعل مستقل و معمولاً participle/adjective است و اطلاعات زمینه‌ای می‌دهد.",
    "The meeting having ended, the delegates left.",
    "این ساختار رسمی/نوشتاری است و فاعل آن با فاعل جمله اصلی یکی نیست."
  ],
  [
    "reduced-relative-clause",
    "بند موصولی در شرایط مشخص به participle یا عبارت وصفی کوتاه می‌شود.",
    "The people waiting outside are journalists.",
    "کاهش فقط وقتی ممکن است که رابطهٔ نحوی و زمان/وجه حفظ شود؛ هر موصولی قابل حذف نیست."
  ],
  [
    "contact-relative-clause",
    "در بند موصولی مفعولی، ضمیر موصولی گاهی حذف می‌شود؛ در نقش فاعلی حذف نمی‌شود.",
    "The report (that) I read was useful.",
    "حذف در بندهای توضیحی non-defining مجاز نیست."
  ],
  [
    "whose-of-which",
    "whose برای مالکیت انسان و نیز اشیا/سازمان‌ها در انگلیسی معیار به‌کار می‌رود؛ of which رسمی‌تر است.",
    "A company whose profits fell... / a policy the effects of which...",
    "در نثر رسمی، of which می‌تواند ساختار سنگین‌تری بسازد."
  ],
  [
    "preposition-stranding",
    "در پرسش و بند موصولی غیررسمی، حرف اضافه می‌تواند در انتهای بند بماند؛ fronting رسمی‌تر است.",
    "Who did you speak to? / To whom did you speak?",
    "بعد از phrasal/prepositional verbs، جابه‌جایی حرف اضافه همیشه ممکن نیست."
  ],
  [
    "relative-what-fused",
    "what می‌تواند معنای the thing(s) that داشته باشد و بند موصولیِ fused بسازد.",
    "What matters is the evidence.",
    "what در این کاربرد antecedent جداگانه نمی‌گیرد."
  ],
  [
    "cleft-it",
    "ساختار it-cleft بخشی از جمله را برای تقابل یا تمرکز برجسته می‌کند.",
    "It was the timing that caused the delay.",
    "زمان و نوع بند موصولی با عنصر برجسته‌شده هماهنگ می‌شود."
  ],
  [
    "pseudo-cleft",
    "ساختار wh-cleft با بند what/where/why و یک مکمل، اطلاعات کانونی را مشخص می‌کند.",
    "What we need is reliable evidence.",
    "ترتیب و نوع مکمل بر کانون اطلاعاتی اثر می‌گذارد."
  ],
  [
    "inversion-negative-adverbial",
    "پس از قیدهای منفی/محدودکنندهٔ آغازین مانند never و rarely، وارونگی کمکی-فاعل رخ می‌دهد.",
    "Rarely have markets been this volatile.",
    "اگر قید منفی در جایگاه آغازین نباشد، وارونگی لازم نیست."
  ],
  [
    "inversion-only-then",
    "only + عبارت قیدی در آغاز جمله می‌تواند وارونگی در بند اصلی ایجاد کند.",
    "Only then did the board act.",
    "Only اگر فاعل بند باشد، وارونگی رخ نمی‌دهد: Only John knew."
  ],
  [
    "inversion-not-until",
    "not until در آغاز جمله باعث وارونگی در بند اصلی می‌شود، نه در بند زمانیِ وابسته.",
    "Not until Monday did trading resume.",
    "در ترتیب عادی جمله وارونگی لازم نیست."
  ],
  [
    "inversion-so-such",
    "so/such در ساختار تأکیدی رسمی می‌تواند با وارونگی همراه شود.",
    "So severe was the shock that markets closed.",
    "ساختار عادی so + adjective نیز بسیار رایج است و وارونگی اجباری نیست."
  ],
  [
    "inversion-conditionals",
    "در شرطی رسمی می‌توان if را حذف و وارونگی were/had/should را به‌کار برد.",
    "Had I known, I would have acted.",
    "این ساختار رسمی است؛ وارونگی برای همهٔ افعال و همهٔ شرطی‌ها ممکن نیست."
  ],
  [
    "subject-auxiliary-inversion",
    "وارونگی در پرسش مستقیم، برخی ساختارهای تأکیدی و بندهای خاص رخ می‌دهد؛ فعل اصلی به‌تنهایی معمولاً وارونگی نمی‌کند.",
    "Does she agree? / Never did he complain.",
    "در حال ساده و گذشته ساده از do-support استفاده می‌شود، مگر be یا modal حاضر باشد."
  ],
  [
    "do-support-emphasis",
    "do/does/did برای تأکید بر فعل اصلی در جمله مثبت به‌کار می‌رود.",
    "I do understand your concern.",
    "با modal و auxiliary دیگر معمولاً do اضافه نمی‌شود."
  ],
  [
    "echo-questions",
    "پرسش پژواکی برای درخواست تکرار یا نشان دادن شگفتی، الگوی پرسشی متفاوتی دارد.",
    "They sold the company?",
    "نشانه‌گذاری و آهنگ گفتار در تفسیر آن مهم است."
  ],
  [
    "tag-question-polarity",
    "question tag معمولاً قطب مخالف بند اصلی دارد و ضمیر فاعلی را تکرار می‌کند.",
    "You have finished, haven't you?",
    "ساختارهای ثابت مانند Let's go, shall we? و I am..., aren't I? استثناهای رایج‌اند."
  ],
  [
    "tag-question-intonation",
    "آهنگ صعودی tag معمولاً پرسش واقعی و آهنگ نزولی انتظار تأیید را نشان می‌دهد.",
    "You're coming, aren't you?",
    "الگو وابسته به لهجه و بافت است و قاعدهٔ مطلق نیست."
  ],
  [
    "embedded-interrogative",
    "بند پرسشیِ توکار ترتیب خبری دارد و do-support پرسش مستقیم را حفظ نمی‌کند.",
    "I wonder where she lives.",
    "در سؤال مستقیم می‌گوییم Where does she live?؛ در بند توکار does حذف می‌شود."
  ],
  [
    "whether-if-complement",
    "whether و if هر دو می‌توانند بند پرسشی غیرمستقیم بسازند، اما whether در جایگاه‌های رسمی/پیش از to و پس از حرف اضافه ترجیح دارد.",
    "We debated whether to proceed.",
    "if معمولاً پیش از مصدر با to نمی‌آید و پس از حرف اضافه محدودتر است."
  ],
  [
    "subjunctive-mandative",
    "در mandative subjunctive، شکل پایهٔ فعل پس از demand, insist, recommend و ساختارهای مشابه می‌آید.",
    "They demanded that he be present.",
    "در انگلیسی بریتانیایی should + base نیز رایج است؛ insist می‌تواند معنی اصرار بر واقعیت گذشته داشته باشد."
  ],
  [
    "were-subjunctive",
    "were-subjunctive در فرض خلاف واقع یا آرزوی غیرواقعی، به‌ویژه در سبک رسمی، با همهٔ فاعل‌ها ممکن است.",
    "If I were in charge, I would resign.",
    "در گفتار غیررسمی was نیز شنیده می‌شود؛ were رسمی‌تر و معیارتر است."
  ],
  [
    "formulaic-subjunctive",
    "عبارت‌های تثبیت‌شده‌ای مانند God save the King و be that as it may شکل subjunctive حفظ کرده‌اند.",
    "Be that as it may, the decision stands.",
    "این‌ها الگوهای واژگانی‌شده‌اند و به‌صورت آزاد برای هر فعل استفاده نمی‌شوند."
  ],
  [
    "modal-perfect-deduction",
    "modal + have + past participle برای استنتاج دربارهٔ گذشته است: must have، may have، can't have.",
    "She must have missed the train.",
    "mustn't have معمولاً نفی الزام نیست؛ برای استنتاج منفی can't/couldn't have رایج‌تر است."
  ],
  [
    "modal-perfect-regret",
    "should/ought to have + participle برای انتقاد یا وظیفهٔ انجام‌نشده در گذشته است.",
    "The bank should have acted sooner.",
    "could have گاهی امکانِ استفاده‌نشده و گاهی احتمال گذشته را می‌رساند."
  ],
  [
    "modal-epistemic-deontic",
    "modalها می‌توانند احتمال/استنتاج (epistemic) یا الزام/اجازه (deontic) را بیان کنند.",
    "She must be home. / You must leave now.",
    "معنی از بافت، گوینده و نوع گزاره استنتاج می‌شود."
  ],
  [
    "modal-remoteness",
    "گذشته‌نمایی در could/would/might همیشه زمان گذشته نیست و می‌تواند فاصلهٔ فرضی یا ادب را نشان دهد.",
    "Could you help me?",
    "در کاربردهای واقعی باید زمان مرجع را از میزان قطعیت/ادب جدا کرد."
  ],
  [
    "semi-modals",
    "ساختارهایی مانند have to, need to, be able to و be supposed to از نظر صرف و معنی با modalهای مرکزی فرق دارند.",
    "She has to leave. / She may leave.",
    "have to در سؤال و منفی از do-support استفاده می‌کند؛ must نه."
  ],
  [
    "modal-dare-need",
    "dare و need گاهی مانند modal و گاهی مانند فعل معمولی رفتار می‌کنند.",
    "Need we wait? / We don't need to wait.",
    "کاربرد modal بیشتر رسمی یا بریتانیایی است؛ الگوهای معمولی با to رایج‌ترند."
  ],
  [
    "shall-offer",
    "shall در پرسش‌های اول‌شخص برای پیشنهاد/درخواست نظر، به‌ویژه در انگلیسی بریتانیایی، زنده است.",
    "Shall we begin?",
    "در آینده‌گویی عمومی، will غالب است؛ shall در کاربرد حقوقی/الزامی معنای خاص دارد."
  ],
  [
    "will-would-habit",
    "will/would می‌توانند عادت یا رفتار تکراری را نشان دهند؛ would معمولاً به زمینهٔ گذشته نیاز دارد.",
    "He will often interrupt. / As a child, she would read for hours.",
    "برای حالت‌های پایدار، used to معمولاً مناسب‌تر از would است."
  ],
  [
    "be-going-to-evidence",
    "be going to برای قصد قبلی یا پیش‌بینی مبتنی بر شواهد فعلی است.",
    "Look at those clouds; it is going to rain.",
    "برای تصمیم لحظه‌ای will رایج‌تر است؛ تمایزها در گفتار هم‌پوشانی دارند."
  ],
  [
    "future-present-simple-schedule",
    "حال ساده برای برنامهٔ زمانی رسمی/ثابت آینده به‌کار می‌رود.",
    "The train leaves at 08:10 tomorrow.",
    "برای قصد شخصی و توافق معمولاً present continuous طبیعی‌تر است."
  ],
  [
    "future-present-continuous-arrangement",
    "حال استمراری برای قرار و توافق آینده به‌کار می‌رود.",
    "I am meeting the minister on Friday.",
    "برنامهٔ ثابت عمومی می‌تواند حال ساده باشد."
  ],
  [
    "future-time-clause",
    "پس از when, until, as soon as و before در بند زمانی آینده معمولاً حال ساده می‌آید.",
    "Call me when you arrive.",
    "در بند اسمیِ پرسشی پس از know، زمان آینده می‌تواند با will بیاید: I don't know when he will arrive."
  ],
  [
    "future-in-the-past",
    "was/were going to و would می‌توانند آینده از دیدگاه گذشته را بیان کنند.",
    "She said she would return.",
    "would معانی دیگری مانند عادت، ادب و فرض نیز دارد."
  ],
  [
    "sequence-of-tense",
    "زمان فعل در بند وابسته با زمان مرجع و نوع گزارش هماهنگ می‌شود؛ backshift در نقل قول رایج اما اجباری مطلق نیست.",
    "He said he was tired. / He says he is tired.",
    "حقایق پایدار و اطلاعات هنوز معتبر می‌توانند بدون backshift بمانند."
  ],
  [
    "reported-speech-deixis",
    "تغییر زمان، ضمیر و قیدهای زمان/مکان در نقل قول به نقطهٔ دید گوینده وابسته است.",
    "today → that day; here → there",
    "اگر زمان و مکان همچنان همان باشد، تغییر ضمیر اشاره اجباری نیست."
  ],
  [
    "reporting-verb-complement",
    "افعال گزارشی الگوهای مکمل متفاوت دارند: admit doing، deny doing، promise to do، tell someone to do.",
    "She denied leaking the memo.",
    "نمی‌توان یک الگوی مکمل را برای همهٔ reporting verbs تعمیم داد."
  ],
  [
    "say-tell-speak-talk",
    "say معمولاً بدون مفعول شخصی مستقیم، tell با مخاطب، speak رسمی‌تر و talk گفت‌وگومحورتر است.",
    "She said that... / She told us that...",
    "say to someone ممکن است؛ tell بدون مفعول فقط در کاربردهای خاص مانند tell the truth."
  ],
  [
    "causative-have-get",
    "have/get + object + past participle نشان می‌دهد کاری برای فاعل انجام شده یا تجربه شده است.",
    "We had the system audited. / She got her phone repaired.",
    "have someone do و get someone to do فاعل انجام‌دهنده را صریح می‌کنند."
  ],
  [
    "causative-make-let-have",
    "ساختارهای make/let/have + object + bare infinitive نوعی causative هستند و الگوی مجهول هرکدام متفاوت است.",
    "The manager had the team revise the draft.",
    "make در مجهول to می‌گیرد؛ let معمولاً با be allowed to بازنویسی می‌شود."
  ],
  [
    "passive-get",
    "get-passive اغلب رویداد، تغییر وضعیت یا تجربهٔ غیرمنتظره را برجسته می‌کند.",
    "The company got acquired.",
    "از نظر سبک غیررسمی‌تر است و برای همهٔ افعال مجهول طبیعی نیست."
  ],
  [
    "passive-prepositional-verb",
    "در مجهول، مفعولِ فعل حرف‌اضافه‌ای می‌تواند فاعل شود و حرف اضافه باقی بماند.",
    "The proposal was objected to.",
    "همهٔ فعل‌های حرف‌اضافه‌ای به یک اندازه طبیعی یا رایج در مجهول نیستند."
  ],
  [
    "passive-double-object",
    "افعال دو مفعولی می‌توانند دو مجهول بسازند، اما یکی ممکن است طبیعی‌تر باشد.",
    "She was given a grant. / A grant was given to her.",
    "انتخاب به فعل، طول عبارت و کانون اطلاعات بستگی دارد."
  ],
  [
    "passive-reporting",
    "ساختار مجهول گزارشی با it یا فاعل انسانی برای گزارش باور/ادعا به‌کار می‌رود.",
    "It is believed that rates will fall. / Rates are believed to fall.",
    "زمان مصدر با زمان رویداد گزارش‌شده هماهنگ می‌شود."
  ],
  [
    "middle-construction",
    "در ساختار میانی، فاعل از نظر دستوری فاعل است اما از نظر معنایی چیزی است که عمل روی آن انجام‌پذیر است.",
    "This book reads easily.",
    "معمولاً قید یا ارزیابی‌گر لازم است و همهٔ افعال گذرا وارد این ساختار نمی‌شوند."
  ],
  [
    "existential-there",
    "there ساختار وجودی را معرفی می‌کند و فعل با فاعل پس از خود از نظر شمار هماهنگ می‌شود.",
    "There is a problem. / There are two problems.",
    "در گفتار there is با فاعل جمع نیز شنیده می‌شود، اما در نوشتار معیار there are مناسب‌تر است."
  ],
  [
    "dummy-it-weather",
    "it در بیان آب‌وهوا، زمان، فاصله و برخی ساختارهای غیرشخصی فاعل صوری است.",
    "It is raining. / It is five miles away.",
    "این it به مرجع مشخصی اشاره نمی‌کند."
  ],
  [
    "extraposition-that-clause",
    "بند that می‌تواند با it صوری به انتهای جمله منتقل شود تا جمله متوازن‌تر شود.",
    "It is clear that the model failed.",
    "در برخی سبک‌ها بند آغازین رسمی و برای تأکید مناسب است."
  ],
  [
    "there-cleft",
    "ساختار there is/was می‌تواند معرفی وجودی یا ارائهٔ عنصر تازه در گفتمان باشد.",
    "There is one issue we have not discussed.",
    "نباید هر there را فاعل صوریِ بی‌معنا تلقی کرد."
  ],
  [
    "count-mass-conversion",
    "برخی اسم‌ها بسته به معنی شمارش‌پذیر یا غیرقابل‌شمارش‌اند؛ تغییر شمارش‌پذیری معنی را تغییر می‌دهد.",
    "paper / a paper; experience / an experience",
    "اسم‌های حوزهٔ اقتصاد و رسانه مانند business, industry, currency نیز کاربردهای دوگانه دارند."
  ],
  [
    "plural-only-nouns",
    "برخی اسم‌ها معمولاً فقط جمع‌اند یا به شکل جمع برای یک مفهوم واحد می‌آیند.",
    "The data are/is...; the police are...",
    "data در کاربرد علمی سنتی جمع است، اما در انگلیسی عمومی اغلب اسم جمع‌نما/غیرقابل‌شمارش مفردگونه می‌شود."
  ],
  [
    "collective-nouns-agreement",
    "اسم‌های جمعی در انگلیسی بریتانیایی می‌توانند توافق مفرد یا جمع بگیرند؛ آمریکایی معمولاً مفرد را ترجیح می‌دهد.",
    "The committee is/are divided.",
    "توافق معنایی جمع بر اعضا و توافق دستوری مفرد بر نهاد به‌عنوان واحد تمرکز دارد."
  ],
  [
    "number-of-a-number-of",
    "the number of با فعل مفرد و a number of با فعل جمع می‌آید.",
    "The number of applicants is rising. / A number of applicants are waiting.",
    "هستهٔ گروه اسمی را تشخیص بده، نه نزدیک‌ترین اسم را."
  ],
  [
    "none-agreement",
    "none می‌تواند بسته به معنی مفرد یا جمع بگیرد؛ هرگز به‌طور مطلق فقط مفرد نیست.",
    "None of the money is missing. / None of the students are ready.",
    "در نثر رسمی سنتی مفرد رایج‌تر است؛ توافق با اسم جمع در کاربرد امروز طبیعی است."
  ],
  [
    "either-neither-agreement",
    "either/neither به‌تنهایی معمولاً مفرد است؛ در either of/neither of توافق در کاربرد واقعی متغیر است.",
    "Neither answer is correct. / Neither of them is/are ready.",
    "در آزمون‌های رسمی، فعل مفرد امن‌تر است؛ در گفتار جمع هم رایج است."
  ],
  [
    "notional-agreement",
    "توافق معنایی گاهی بر توافق صوری غلبه می‌کند، به‌ویژه در کمیت‌ها و گروه‌های جمعی.",
    "Ten dollars is enough. / A lot of people are here.",
    "نوع اسم و معنای واحد/تعداد تعیین‌کننده است."
  ],
  [
    "proximity-agreement",
    "در برخی ساختارهای هماهنگ‌شده، فعل با نزدیک‌ترین جزء هماهنگ می‌شود؛ اما این الگو همیشه سبک مطلوب نیست.",
    "Either the manager or the assistants are responsible.",
    "برای وضوح، بازنویسی جمله اغلب بهتر از اتکا به proximity است."
  ],
  [
    "coordination-agreement",
    "فاعل‌های پیوندخورده با and معمولاً جمع‌اند؛ اما یک مفهوم واحد یا عبارت تثبیت‌شده می‌تواند مفرد باشد.",
    "Bread and butter is my usual breakfast.",
    "معنای یک واحد یا نام یک عنوان/اثر می‌تواند توافق مفرد را توجیه کند."
  ],
  [
    "correlative-coordination",
    "ساختارهای both...and، either...or، neither...nor و not only...but also رابطهٔ موازی می‌خواهند.",
    "Not only the costs but also the delay matters.",
    "در either/neither و not only، توافق می‌تواند با جزء نزدیک‌تر هماهنگ شود."
  ],
  [
    "parallelism",
    "اجزای هم‌پایه در فهرست، مقایسه و ساختارهای هم‌آهنگ باید از نظر نحوی موازی باشند.",
    "The plan aims to cut costs, raise output, and improve quality.",
    "موازی‌سازی معنایی مهم‌تر از یکسان‌سازی مکانیکی شکل‌هاست."
  ],
  [
    "ellipsis-verb-phrase",
    "برای جلوگیری از تکرار، بخش فعلی می‌تواند با auxiliary یا operator حذف‌شده بازنمایی شود.",
    "She can speak French, and he can too.",
    "نوع حذف به فعل کمکی و ساختار تقابل وابسته است."
  ],
  [
    "substitution-one-ones",
    "one/ones می‌تواند هستهٔ اسم شمارش‌پذیر را جایگزین کند تا از تکرار جلوگیری شود.",
    "I prefer the red one.",
    "برای اسم غیرقابل‌شمارش معمولاً one جایگزین نمی‌شود."
  ],
  [
    "substitution-do-so",
    "do so جایگزین عبارت فعلی/عمل می‌شود و معمولاً رسمی‌تر از تکرار فعل است.",
    "The firm promised to invest and did so.",
    "do so معمولاً مفعول‌ها و مکمل‌های خاص را به همان شکل حفظ نمی‌کند."
  ],
  [
    "so-neither-agreement",
    "so/neither + auxiliary + subject برای هم‌نظری مثبت/منفی به‌کار می‌رود.",
    "Rates rose, and so did inflation. / Neither did wages.",
    "زمان و نوع auxiliary باید با جملهٔ مرجع هماهنگ شود."
  ],
  [
    "as-do-i-inversion",
    "ساختارهای as/than می‌توانند حذف و وارونگی داشته باشند، به‌ویژه در نثر رسمی.",
    "She earns more than do her colleagues.",
    "ترتیب عادی نیز ممکن است: than her colleagues do."
  ],
  [
    "comparative-correlative",
    "ساختار the + comparative, the + comparative رابطهٔ تغییر هم‌زمان را بیان می‌کند.",
    "The more you practise, the better you become.",
    "هر دو بند معمولاً ساختار موازی دارند؛ the در این کاربرد حرف تعریف عادی نیست."
  ],
  [
    "comparative-ellipsis",
    "در مقایسه، بخش تکراری می‌تواند حذف شود؛ از than me و than I am هر دو استفاده می‌شود.",
    "She is taller than I am. / taller than me.",
    "than به‌عنوان حرف اضافه یا پیونددهنده تحلیل می‌شود؛ سبک و وضوح تعیین‌کننده است."
  ],
  [
    "as-as-degree",
    "ساختار as...as برابری درجه را می‌رساند و در منفی، not as/so...as ممکن است.",
    "The result is as good as expected.",
    "so...as بیشتر در ساختار منفی/رسمی دیده می‌شود."
  ],
  [
    "farther-further",
    "farther بیشتر برای فاصلهٔ فیزیکی و further برای مقدار/پیشرفت یا معنای افزوده رایج است.",
    "We travelled farther. / Further analysis is needed.",
    "در کاربرد امروز هم‌پوشانی وجود دارد؛ این تفکیک قانون مطلق نیست."
  ],
  [
    "elder-older",
    "elder عمدتاً پیش از اسم خویشاوندی و در نقش صفت محدود به انسان است؛ older دامنهٔ گسترده‌تری دارد.",
    "My elder sister is older than me.",
    "elder معمولاً با than نمی‌آید."
  ],
  [
    "less-fewer-measure",
    "fewer برای واحدهای شمارش‌پذیر و less برای مقدار/غیرقابل‌شمارش معیار است؛ در اندازه‌گیری‌ها less طبیعی است.",
    "fewer transactions; less money; less than ten kilometres",
    "less با اسم جمع در گفتار و برخی کاربردهای تثبیت‌شده رایج است."
  ],
  [
    "so-such-degree",
    "so پیش از صفت/قید و such پیش از گروه اسمی می‌آید.",
    "so difficult; such a difficult task",
    "so + adjective + a/an + noun نیز ممکن است: so difficult a task."
  ],
  [
    "too-enough-position",
    "too پیش از صفت/قید و enough پس از صفت اما پیش از اسم می‌آید.",
    "too expensive; old enough; enough evidence",
    "too much/many و much/many enough ساختارهای جداگانه دارند."
  ],
  [
    "very-absolutely-gradability",
    "very معمولاً صفت درجه‌پذیر را تقویت می‌کند؛ absolutely با صفت‌های مطلق/غیرقابل‌درجه‌گیری طبیعی‌تر است.",
    "very tired; absolutely impossible",
    "تغییر معنا می‌تواند درجه‌پذیری را تغییر دهد؛ absolutely exhausted نیز رایج است."
  ],
  [
    "adjective-order",
    "ترتیب چند صفت تابع دستهٔ معنا، نظر، اندازه، سن، شکل، رنگ، منشأ، جنس و کارکرد است.",
    "a beautiful small old Italian wooden table",
    "ترتیب یک قاعدهٔ انعطاف‌پذیر گرایشی است؛ طول و کانون اطلاعات نیز اثر دارد."
  ],
  [
    "adjective-complement",
    "برخی صفت‌ها مکمل حرف اضافه‌ای یا مصدر/بند می‌گیرند و حرف اضافهٔ آن‌ها واژگانی است.",
    "aware of the risk; eager to help",
    "حرف اضافه را از ترجمهٔ فارسی حدس نزن؛ الگوی هر صفت را جدا یاد بگیر."
  ],
  [
    "adjective-attributive-predicative",
    "بعضی صفت‌ها فقط پیش از اسم یا پس از فعل ربطی می‌آیند؛ جایگاه می‌تواند معنی را عوض کند.",
    "the former president; the president is asleep",
    "صفات classifying مانند medical معمولاً attributive و asleep معمولاً predicative است."
  ],
  [
    "adverb-position-focus",
    "جایگاه قیدهای بسامد، نگرش، تمرکز و شیوه به نوع قید و فعل کمکی وابسته است.",
    "She has never really agreed.",
    "قیدهای محدودکننده مانند only باید نزدیک عنصری باشند که محدود می‌کنند."
  ],
  [
    "only-scope",
    "جایگاه only دامنهٔ معنایی را تعیین می‌کند و می‌تواند تفسیر جمله را عوض کند.",
    "Only John called. / John only called.",
    "برای جلوگیری از ابهام، only را کنار عنصر موردنظر قرار بده."
  ],
  [
    "even-scope",
    "even عنصر غیرمنتظره در مقیاس اطلاعاتی را برجسته می‌کند.",
    "Even the minister rejected the proposal.",
    "جایگاه even بر دامنه و پیش‌فرض جمله اثر دارد."
  ],
  [
    "not-scope",
    "دامنهٔ not تعیین می‌کند کدام بخش گزاره نفی می‌شود؛ جابه‌جایی آن معنی را تغییر می‌دهد.",
    "I don't think he lied. / I think he didn't lie.",
    "نفی در گفتار ممکن است از نظر معنایی گسترده‌تر از جایگاه نحوی خود باشد."
  ],
  [
    "negation-raising",
    "با افعالی مانند think و believe، نفی ظاهری بند اصلی گاهی از نظر معنی به بند وابسته تعلق می‌گیرد.",
    "I don't think she will agree.",
    "این پدیده به فعل، قطبیت و بافت وابسته است و برای همهٔ افعال رخ نمی‌دهد."
  ],
  [
    "negative-concord-dialect",
    "در برخی گویش‌های انگلیسی negative concord قاعده‌مند است، اما در انگلیسی معیار رسمی معمولاً از آن پرهیز می‌شود.",
    "I didn't see nobody. (در برخی گویش‌ها)",
    "این ساختار را نباید صرفاً خطای منطقی دانست؛ داوری به گونهٔ زبانی و بافت بستگی دارد."
  ],
  [
    "discourse-markers",
    "حروف/عبارات گفتمانی مانند however, well, actually و anyway رابطهٔ سخن را سازمان می‌دهند، نه صرفاً محتوای گزاره را.",
    "The figures improved. However, risks remain.",
    "جایگاه و نشانه‌گذاری آن‌ها با نقش گفتمانی و سبک تغییر می‌کند."
  ],
  [
    "conjunctive-adverb-punctuation",
    "however, therefore, moreover و consequently قیدهای پیوندی‌اند؛ به‌تنهایی دو جملهٔ مستقل را با کاما وصل نمی‌کنند.",
    "The data were incomplete; therefore, we waited.",
    "از نقطه، نقطه‌ویرگول یا پیونددهندهٔ هم‌پایه استفاده کن."
  ],
  [
    "comma-splice",
    "اتصال دو جملهٔ مستقل فقط با کاما در نثر معیار خطای comma splice است.",
    "The market fell; investors panicked.",
    "در سبک ادبی/گفتاری ممکن است عمدی باشد؛ در متن رسمی از نقطه، semicolon یا conjunction استفاده کن."
  ],
  [
    "semicolon-coordination",
    "نقطه‌ویرگول دو جملهٔ مستقلِ نزدیک از نظر معنایی را بدون conjunction پیوند می‌دهد.",
    "The evidence was weak; the claim was withdrawn.",
    "برای اجزای کوتاه یا بند وابسته به‌تنهایی معمولاً مناسب نیست."
  ],
  [
    "colon-explanation",
    "دونقطه می‌تواند توضیح، فهرست یا نتیجهٔ بند مستقل پیشین را معرفی کند.",
    "One fact is clear: demand has weakened.",
    "در نثر رسمی، بخش پیش از colon معمولاً باید بند مستقل کامل باشد."
  ],
  [
    "restrictive-nonrestrictive-punctuation",
    "بند موصولی محدودکننده برای شناسایی مرجع ضروری است و معمولاً ویرگول نمی‌گیرد؛ توضیحی با ویرگول جدا می‌شود.",
    "Employees who work remotely... / My brother, who lives abroad,...",
    "معنی و مرجع تعیین می‌کند بند محدودکننده است یا توضیحی؛ صرف مکث کافی نیست."
  ],
  [
    "that-which-style",
    "that بیشتر در بندهای محدودکننده و which در بندهای توضیحی رایج است؛ which محدودکننده نیز در برخی سبک‌ها پذیرفته است.",
    "The report that I read... / The report, which I read,...",
    "راهنماهای سبک آمریکایی often ترجیح می‌دهند that برای restrictive؛ این تفاوت مطلق جهانی نیست."
  ],
  [
    "apostrophe-possession",
    "مالکیت مفرد معمولاً 's و جمع منتهی به s فقط apostrophe می‌گیرد.",
    "the firm's assets; the firms' assets",
    "ساختارهای of، مالکیت مشترک و نام‌های خاص قواعد سبک‌نامه‌ای دارند."
  ],
  [
    "hyphen-compound-modifier",
    "صفت مرکب پیش از اسم اغلب خط تیره می‌گیرد تا رابطهٔ اجزا روشن شود.",
    "a long-term strategy",
    "پس از اسم معمولاً خط تیره حذف می‌شود؛ سبک‌نامه‌ها تفاوت دارند."
  ],
  [
    "capitalization-proper-nouns",
    "نام‌های خاص، ملیت‌ها، زبان‌ها و ابتدای جمله با حرف بزرگ نوشته می‌شوند.",
    "English, the European Union, Monday",
    "عنوان شغلی و سمت فقط در برخی کاربردهای پیش از نام یا عنوان رسمی بزرگ می‌شود."
  ],
  [
    "determiner-order",
    "در گروه اسمی، predeterminer، central determiner و postdeterminer ترتیب نسبتاً مشخصی دارند.",
    "all those three proposals",
    "همهٔ ترکیب‌ها ممکن نیستند؛ کمیت‌نماها و اشاره‌گرها محدودیت هم‌نشینی دارند."
  ],
  [
    "articles-generic-reference",
    "the، a/an و جمع بدون حرف تعریف برای ارجاع خاص، نمونه‌ای و نوعی تفاوت دارند.",
    "The tiger is endangered. / Tigers are endangered.",
    "انتخاب generic article به سبک و نوع اسم بستگی دارد."
  ],
  [
    "zero-article-institutions",
    "نام نهادها با zero article وقتی کارکرد نهادی برجسته است و با the وقتی ساختمان/مکان مشخص است می‌آید.",
    "go to school; go to the school",
    "این تمایز در انگلیسی بریتانیایی و آمریکایی و اسم نهادها تفاوت‌هایی دارد."
  ],
  [
    "geographical-articles",
    "نام کشورها و مکان‌ها الگوهای حرف تعریف دارند؛ نام‌های جمعی/سیاسی اغلب the می‌گیرند.",
    "France; the Netherlands; the United States",
    "نام‌های رسمی و تاریخی استثنا دارند؛ فهرست مکان‌ها باید واژگانی یاد گرفته شود."
  ],
  [
    "article-abstraction",
    "اسم انتزاعی می‌تواند بدون article به‌صورت کلی یا با the برای مفهوم مشخص بیاید.",
    "Freedom matters. / The freedom we gained...",
    "معنی و محدودشدگی مرجع از خود نوع اسم مهم‌تر است."
  ],
  [
    "quantifier-of-pattern",
    "many/much/few/little و a lot of بر اساس شمارش‌پذیری انتخاب می‌شوند؛ of پیش از ضمیر/تعیین‌گر لازم است.",
    "many books; much time; many of them",
    "a few/a little مثبت‌تر از few/little است و معنی کم اما کافی را می‌رساند."
  ],
  [
    "all-whole",
    "all بر کل مجموعه/مقدار و whole بر کامل بودن یک واحد تمرکز می‌کند.",
    "all the day; the whole day",
    "whole معمولاً پیش از اسم مفرد شمارش‌پذیر می‌آید؛ all با جمع/غیرقابل‌شمارش رایج است."
  ],
  [
    "both-either-neither-reference",
    "both دو عضو، either یکی از دو و neither هیچ‌یک از دو را نشان می‌دهد.",
    "Both options are viable. / Neither option works.",
    "either در کاربرد غیررسمی گاهی به بیش از دو مورد هم تعمیم می‌یابد، اما معنای دقیق باید روشن باشد."
  ],
  [
    "each-every",
    "each اعضا را جداگانه و every مجموعه را به‌صورت کلی برجسته می‌کند؛ هر دو معمولاً با اسم مفرد می‌آیند.",
    "Each candidate has a score. / Every candidate has a score.",
    "each of + determiner/pronoun می‌آید؛ every of نادرست است."
  ],
  [
    "another-other-the-other",
    "another یک مورد دیگر، other موارد دیگر، the other مورد باقی‌مانده از مجموعهٔ دوگانه را نشان می‌دهد.",
    "one option, another option, the other option",
    "others ضمیر جمع است؛ the others به مجموعهٔ مشخص اشاره می‌کند."
  ],
  [
    "such-as-determiner",
    "such پیش از گروه اسمی برای تأکید می‌آید و با a/an ترتیب ویژه دارد.",
    "such a difficult question; such difficult questions",
    "such as برای معرفی نمونه است و نقش تعیین‌گر ندارد."
  ],
  [
    "possessive-double-genitive",
    "double genitive با of + possessive نشان‌دهندهٔ یکی از چند مورد یا رابطهٔ شخصی است.",
    "a friend of my father's",
    "معنی با my father's friend یکسان نیست و مالکیت/انتخاب را متفاوت قاب‌بندی می‌کند."
  ],
  [
    "noun-noun-compounds",
    "در ترکیب اسم+اسم، اسم اول معمولاً نقش طبقه‌بندی/توصیف دارد و معمولاً جمع نمی‌شود.",
    "currency market; sales figures",
    "استثناهای تثبیت‌شده و ترکیب‌های واژگانی وجود دارد؛ معنی از ترتیب و بافت حاصل می‌شود."
  ],
  [
    "compound-plurals",
    "در ترکیب‌ها معمولاً عنصر اصلی جمع می‌شود، نه لزوماً آخرین واژه.",
    "mothers-in-law; attorneys general",
    "ترکیب‌های بسته و واژگانی‌شده ممکن است جمع پایانی بگیرند: forget-me-nots."
  ],
  [
    "possessive-time-measure",
    "ساختار ملکی می‌تواند مدت، ارزش یا اندازه را بیان کند.",
    "a day's work; two weeks' notice",
    "در ساختار صفتی با عدد و واحد، خط تیره و مفرد ممکن است: a two-week period."
  ],
  [
    "phrasal-verb-separable",
    "در فعل عبارتی جداشدنی، مفعول اسمی می‌تواند قبل یا بعد از particle بیاید؛ ضمیر معمولاً میان آن‌هاست.",
    "turn the offer down; turn it down",
    "افعال غیرقابل‌جداسازی مانند look after این الگو را نمی‌پذیرند."
  ],
  [
    "phrasal-prepositional-verb",
    "افعال سه‌جزئی دارای فعل + particle + preposition معمولاً مفعول را پس از حرف اضافه می‌گیرند.",
    "put up with delays",
    "ترتیب اجزا ثابت‌تر است و ضمیر میان فعل و particle قرار نمی‌گیرد."
  ],
  [
    "particle-stress",
    "تکیه در فعل عبارتی می‌تواند به تمایز فعل مرکب واژگانی از فعل + حرف اضافه کمک کند.",
    "LOOK up the word / look UP the hill",
    "تکیه در گفتار واقعی به اطلاعات جدید و آهنگ جمله نیز وابسته است."
  ],
  [
    "verb-preposition-collocation",
    "برخی افعال حرف اضافهٔ واژگانی ثابت دارند و انتخاب آن‌ها را باید به‌صورت collocation آموخت.",
    "depend on; comply with; object to",
    "ترجمهٔ مستقیم حرف اضافه از زبان دیگر خطای رایج است."
  ],
  [
    "preposition-time-place",
    "حروف اضافهٔ زمان و مکان الگوهای مفهومی دارند: at نقطه، on سطح/روز، in بازه/فضا.",
    "at noon; on Monday; in July",
    "ترکیب‌های تثبیت‌شده مانند at night و in the morning استثناهای واژگانی‌اند."
  ],
  [
    "preposition-end-sentence",
    "پایان دادن جمله با حرف اضافه در انگلیسی امروز کاملاً معیار و طبیعی است.",
    "Which policy did they object to?",
    "در سبک بسیار رسمی می‌توان حرف اضافه را جلو آورد، اما جمله را بی‌دلیل سنگین نکن."
  ],
  [
    "preposition-gerund",
    "پس از حرف اضافه، فعل معمولاً به شکل -ing می‌آید؛ to در look forward to حرف اضافه است.",
    "They succeeded by reducing costs.",
    "to در want to مصدرساز است؛ نقش واژه را از ساختار تشخیص بده."
  ],
  [
    "because-because-of",
    "because بند کامل و because of گروه اسمی/gerund می‌گیرد.",
    "because demand fell; because of falling demand",
    "due to و owing to از نظر نقش و سبک تفاوت‌هایی دارند."
  ],
  [
    "although-despite",
    "although/even though بند کامل می‌گیرند؛ despite/in spite of گروه اسمی یا gerund.",
    "Although prices rose... / Despite rising prices...",
    "despite the fact that می‌تواند بند کامل بگیرد."
  ],
  [
    "while-whereas",
    "while می‌تواند زمان، تقابل یا هم‌زمانی را بیان کند؛ whereas عمدتاً تقابل رسمی دارد.",
    "While costs fell, output rose.",
    "ابهام while را با whereas یا during بازنویسی کن اگر زمان/تقابل روشن نیست."
  ],
  [
    "since-as-because",
    "since و as می‌توانند علت معرفی کنند، اما since معنای زمانی نیز دارد و گاهی علت را مفروض می‌گیرد.",
    "Since funding ended, the project stopped.",
    "برای علت محوری و بی‌ابهام because معمولاً روشن‌تر است."
  ],
  [
    "so-that-purpose-result",
    "so that می‌تواند هدف یا نتیجه را بیان کند؛ ساختار و وجه فعل به معنی بستگی دارد.",
    "We left early so that we could vote.",
    "in order that رسمی‌تر است؛ so...that ساختار درجه/نتیجهٔ متفاوتی دارد."
  ],
  [
    "lest-purpose",
    "lest بند رسمیِ هدف منفی می‌گیرد و اغلب با should یا subjunctive همراه می‌شود.",
    "They acted quickly lest the deal should collapse.",
    "بسیار رسمی/ادبی است؛ در نثر عادی so that...not طبیعی‌تر است."
  ],
  [
    "provided-unless-condition",
    "provided/providing و as long as شرط را بیان می‌کنند؛ unless معمولاً if...not است.",
    "We will proceed provided that costs remain stable.",
    "unless برای همهٔ موقعیت‌های if not جانشین دقیق نیست، به‌ویژه با شرط‌های غیرواقعی یا استثنا."
  ],
  [
    "in-case-condition",
    "in case اقدام احتیاطی در برابر احتمال را بیان می‌کند و با if هم‌معنی کامل نیست.",
    "Take a copy in case the server fails.",
    "in case اغلب حال/گذشته دارد؛ will در کاربردهای معمول بند آن کمتر می‌آید."
  ],
  [
    "even-if-concession",
    "even if شرط فرضی را می‌پذیرد اما نتیجه را مستقل نگه می‌دارد.",
    "Even if rates fall, inflation may persist.",
    "even though واقعیت را می‌پذیرد، نه صرفاً فرض را."
  ],
  [
    "mixed-conditionals",
    "شرطی مختلط زمان شرط و نتیجه را در دو نقطهٔ زمانی متفاوت قرار می‌دهد.",
    "If I had studied law, I would be a lawyer now.",
    "رابطهٔ زمانی باید از معنی روشن باشد؛ صورت‌ها را مکانیکی ترکیب نکن."
  ],
  [
    "zero-first-second-third-conditionals",
    "انواع شرطی بر اساس رابطهٔ زمانی/واقعیت و صورت فعل دسته‌بندی می‌شوند؛ کاربرد واقعی انعطاف دارد.",
    "If water reaches 100°C, it boils.",
    "در شرطی واقعی ممکن است modalهای مختلف در بند نتیجه بیایند."
  ],
  [
    "unless-negative-condition",
    "unless معمولاً شرط منفی را فشرده می‌کند؛ با بند منفی دیگر ممکن است معنای ناخواسته بسازد.",
    "Unless demand recovers, output will fall.",
    "از unless...not پرهیز کن مگر دو نفی واقعاً مقصود باشد."
  ],
  [
    "wish-past",
    "wish + past simple برای نارضایتی از وضعیت حال یا آرزوی خلاف واقع است.",
    "I wish the market were calmer.",
    "were در سبک رسمی و همهٔ فاعل‌ها ممکن است؛ was در گفتار هم شنیده می‌شود."
  ],
  [
    "wish-past-perfect",
    "wish + past perfect برای پشیمانی یا آرزوی خلاف واقع دربارهٔ گذشته است.",
    "I wish we had acted earlier.",
    "could have و would have با تفاوت معنایی در برخی ساختارها ممکن‌اند."
  ],
  [
    "wish-would",
    "wish + would برای تغییر رفتار/وضعیت یا شکایت از چیزی خارج از کنترل مستقیم گوینده می‌آید.",
    "I wish the noise would stop.",
    "برای وضعیت ثابت خود گوینده معمولاً wish + past ساده‌تر است."
  ],
  [
    "if-only",
    "if only همانند wish برای آرزو/پشیمانی است، اما تأکید عاطفی بیشتری دارد.",
    "If only I had checked the figures.",
    "زمان فعل همان تمایز حال/گذشته را حفظ می‌کند."
  ],
  [
    "its-time",
    "it's time + past simple برای کاری که اکنون باید انجام شود و دیر شده است.",
    "It's time we left.",
    "it's high time معمولاً تأکید بیشتری دارد؛ مصدر to نیز ممکن است: time to leave."
  ],
  [
    "would-rather",
    "would rather + bare infinitive برای ترجیح فاعل و would rather + subject + past برای ترجیح دربارهٔ دیگری است.",
    "I'd rather stay. / I'd rather you stayed.",
    "برای گذشتهٔ خلاف واقع از past perfect استفاده می‌شود."
  ],
  [
    "prefer-patterns",
    "prefer + gerund/to-infinitive و prefer A to B الگوهای مکمل متفاوت دارند.",
    "I prefer walking to driving.",
    "would prefer معمولاً برای ترجیح موقعیتی و اغلب مصدر با to می‌گیرد."
  ],
  [
    "as-if-as-though",
    "as if/as though بند فرضی یا واقعی می‌گیرند؛ زمان فعل فاصلهٔ ذهنی را نشان می‌دهد.",
    "He talks as if he knew everything.",
    "اگر گزاره محتمل/واقعی باشد، زمان عادی نیز طبیعی است."
  ],
  [
    "participle-adjective-ed-ing",
    "صفت -ed معمولاً حالت تجربه‌کننده و -ing ویژگی ایجادکنندهٔ آن حالت را بیان می‌کند.",
    "The investors were worried; the news was worrying.",
    "برخی صورت‌ها واژگانی شده‌اند و معنی را باید جداگانه آموخت."
  ],
  [
    "adjective-order-complement",
    "صفت‌های ارزیابانه می‌توانند پس از فعل ربطی یا پیش از اسم بیایند، اما معنی/تأکید تغییر می‌کند.",
    "the responsible official; the official is responsible",
    "برخی صفت‌ها مانند asleep فقط predicative هستند."
  ],
  [
    "gradable-ungradable-adjectives",
    "صفت‌های درجه‌پذیر با very و rather و صفت‌های مطلق با completely/absolutely ترکیب می‌شوند.",
    "very likely; absolutely certain",
    "بافت می‌تواند صفت مطلق را درجه‌پذیر کند: almost unique."
  ],
  [
    "lexical-aspect",
    "افعال از نظر حالت (state)، فعالیت (activity)، دستاورد (achievement) و انجام (accomplishment) رفتار زمانی متفاوت دارند.",
    "know (state); run (activity); reach (achievement)",
    "طبقه‌بندی aspectual به بافت و مفعول وابسته است؛ یک فعل می‌تواند چند طبقه داشته باشد."
  ],
  [
    "telicity",
    "افعال telic نقطهٔ پایان ذاتی دارند؛ عبارت‌های مفعولی/قیدی می‌توانند رویداد را telic یا atelic کنند.",
    "read a book vs read books",
    "مدت‌نماها و زمان‌نماها آزمون‌های مفیدی‌اند اما استثنا دارند."
  ],
  [
    "progressive-aspect-meaning",
    "استمراری می‌تواند موقتی بودن، تغییر، رفتار تکراری آزاردهنده یا آیندهٔ برنامه‌ریزی‌شده را نشان دهد.",
    "He is always losing keys.",
    "always با استمراری نگرش/ارزیابی می‌افزاید؛ با ساده بسامد خنثی‌تر است."
  ],
  [
    "perfect-aspect-reference",
    "perfect رویداد را نسبت به یک نقطهٔ مرجع پیشین می‌نگرد؛ صرفاً معادل گذشته نیست.",
    "By noon, she had left.",
    "زمان مرجع می‌تواند حال، گذشته یا آینده باشد."
  ],
  [
    "present-perfect-experience",
    "حال کامل برای تجربه تا زمان حال بدون زمان مشخصِ تمام‌شده به‌کار می‌رود.",
    "Have you ever visited London?",
    "با yesterday و last year در معنی گذشتهٔ تمام‌شده معمولاً past simple می‌آید."
  ],
  [
    "present-perfect-result",
    "حال کامل می‌تواند نتیجهٔ کنونی رویداد گذشته را برجسته کند.",
    "The central bank has cut rates.",
    "اگر زمان/زمینهٔ گذشته کاملاً بسته باشد، past simple ممکن است مناسب‌تر باشد."
  ],
  [
    "present-perfect-american-british",
    "در انگلیسی بریتانیایی present perfect با just/already/yet رایج‌تر است؛ آمریکایی simple past نیز طبیعی است.",
    "I've just eaten. / I just ate.",
    "هر دو گونه صورت‌های مشترک دارند؛ تفاوت گرایشی است نه ممنوعیت."
  ],
  [
    "past-perfect-not-always",
    "past perfect فقط برای تقدم زمانیِ مرتبط با نقطهٔ گذشته لازم است؛ هر دو رویداد گذشته را بی‌دلیل با آن ننویس.",
    "When I arrived, she left. / had left (if already gone)",
    "روایت می‌تواند ترتیب را با قیدها روشن کند و past simple کافی باشد."
  ],
  [
    "used-to-would",
    "used to هم حالت و هم عادت گذشته را بیان می‌کند؛ would بیشتر برای رفتار تکراری و با زمینهٔ گذشته مناسب است.",
    "I used to live there. / Every summer we would visit.",
    "would معمولاً برای حالت پایدار مانند live/know جایگزین used to نمی‌شود."
  ],
  [
    "be-used-to-get-used-to",
    "be used to + noun/gerund یعنی عادت داشتن؛ get used to یعنی عادت کردن.",
    "She is used to working late.",
    "used to + bare infinitive عادت گذشته است و ساختاری جدا دارد."
  ],
  [
    "get-used-to-progressive",
    "get used to می‌تواند روند سازگاری را نشان دهد و با زمان‌های استمراری بیاید.",
    "I'm getting used to the new system.",
    "پس از to همچنان اسم یا gerund می‌آید."
  ],
  [
    "would-rather-past-perfect",
    "would rather + subject + past perfect ترجیح خلاف واقع دربارهٔ گذشته را می‌رساند.",
    "I'd rather you had told me earlier.",
    "فاعل دوم و رابطهٔ زمانی باید صریح باشند."
  ],
  [
    "fronting-topicalization",
    "عنصر جمله برای موضوع‌سازی می‌تواند به ابتدای جمله منتقل شود؛ وارونگی همیشه رخ نمی‌دهد.",
    "This proposal, I strongly oppose.",
    "fronting با inversion یکی نیست؛ ساختار نحوی و کانون اطلاعاتی جداگانه تحلیل می‌شوند."
  ],
  [
    "left-dislocation",
    "عنصر موضوعی در آغاز می‌آید و با ضمیر در جمله بازارجاع می‌شود.",
    "That proposal, I haven't read it.",
    "بیشتر گفتاری/گفتمانی است و در نثر رسمی باید با احتیاط به‌کار رود."
  ],
  [
    "right-dislocation",
    "عنصر توضیحی در انتهای جمله می‌آید و ضمیر پیشین به آن ارجاع می‌دهد.",
    "It's difficult, this problem.",
    "بیشتر گفتاری و وابسته به آهنگ است."
  ],
  [
    "information-focus-end-weight",
    "انگلیسی تمایل دارد عبارت‌های سنگین/اطلاعات تازه را به انتهای جمله ببرد و ساختارهای صوری مانند it را به‌کار ببرد.",
    "It surprised us that the deal failed.",
    "این گرایش مطلق نیست؛ تأکید و سبک می‌توانند ترتیب دیگری بسازند."
  ],
  [
    "given-new-information",
    "ترتیب موضوع-خبر و اطلاعات داده‌شده-تازه به انسجام متن کمک می‌کند.",
    "The report was released yesterday. It contains...",
    "given/new مفاهیم گفتمانی‌اند و الزاماً با فاعل/مفعول یکی نیستند."
  ],
  [
    "anaphora-cataphora",
    "ضمیر می‌تواند به مرجع پیشین (anaphora) یا مرجع بعدی (cataphora) اشاره کند.",
    "When she arrived, Maria called. / Before he spoke, John...",
    "مرجع باید از نظر جنس، شمار و گفتمان روشن باشد."
  ],
  [
    "pronoun-antecedent-ambiguity",
    "ضمیر مبهم ممکن است بیش از یک مرجع داشته باشد؛ تکرار اسم یا بازنویسی وضوح را بالا می‌برد.",
    "When the bank met the regulator, it...",
    "it ممکن است به بانک یا نهاد ناظر برگردد؛ زمینه همیشه ابهام را رفع نمی‌کند."
  ],
  [
    "singular-they",
    "they مفرد برای مرجع نامشخص یا فردی که ضمیرش they است در انگلیسی معاصر معیار پذیرفته شده است.",
    "Every applicant should submit their form.",
    "توافق معمولاً they/their و فعل جمع‌نماست، حتی با مرجع مفرد."
  ],
  [
    "who-whom-register",
    "who نقش فاعلی و whom نقش مفعولی در سبک رسمی‌تر دارد؛ در گفتار whom اغلب جای خود را به who می‌دهد.",
    "Who called? / Whom did you call?",
    "پس از حرف اضافهٔ جلوآمده، whom رسمی‌تر است: to whom."
  ],
  [
    "reflexive-emphatic",
    "ضمیر بازتابی مفعول/مکمل هم‌مرجع و ضمیر تأکیدی برای برجسته‌سازی است.",
    "She blamed herself. / The director herself spoke.",
    "استفاده از myself به‌جای I یا me در جایگاه فاعل/مفعول صرفاً برای رسمی‌نمایی نادرست است."
  ],
  [
    "reciprocal-pronouns",
    "each other و one another رابطهٔ متقابل را بیان می‌کنند و معمولاً تفاوت سخت‌گیرانهٔ شمار ندارند.",
    "The two firms sued each other.",
    "مالکیت متقابل با each other's و one another's ساخته می‌شود."
  ],
  [
    "dummy-one-generic",
    "one می‌تواند ضمیر عام برای انسان/فاعل کلی باشد و از تکرار گروه اسمی جلوگیری کند.",
    "One should check one's sources.",
    "در گفتار غیررسمی you رایج‌تر است؛ one رسمی‌تر است."
  ],
  [
    "determiner-zero-possessive",
    "تعیین‌گرها در انگلیسی معمولاً هم‌زمانی محدود دارند؛ نمی‌توان دو central determiner را بی‌قاعده کنار هم آورد.",
    "my book; this book; all my books",
    "all/both/half می‌توانند پیش از possessive یا demonstrative قرار گیرند."
  ],
  [
    "subjunctive-should",
    "should در بندهای mandative بریتانیایی و در برخی بیان‌های توصیه/احساس رایج است.",
    "It is essential that he should attend.",
    "در انگلیسی آمریکایی subjunctive ساده be/attend رایج‌تر است."
  ],
  [
    "mandative-that-omission",
    "در برخی افعال و صفت‌ها بند that ممکن است حذف شود، به‌ویژه در گفتار.",
    "They insisted (that) he leave.",
    "حذف that گاهی ابهام ایجاد می‌کند؛ در نثر رسمی نگه‌داشتن آن می‌تواند روشن‌تر باشد."
  ],
  [
    "exclamative-what-how",
    "جملات تعجبی با what + noun phrase یا how + adjective/adverb ساخته می‌شوند.",
    "What a remarkable result! / How quickly it changed!",
    "ترتیب آن‌ها با پرسش‌های مستقیم متفاوت است."
  ],
  [
    "imperative-subject",
    "فاعل you در امر معمولاً حذف می‌شود اما برای تأکید، تقابل یا هشدار می‌تواند بیاید.",
    "You be careful. / Don't you move.",
    "let's و let us الگوهای امر/پیشنهاد جداگانه‌اند."
  ],
  [
    "imperative-negative",
    "امر منفی معمولاً با don't + bare infinitive ساخته می‌شود؛ be در امر منفی نیز don't be می‌گیرد.",
    "Don't be late.",
    "در دستور رسمی do not شکل رسمی‌تر است؛ never می‌تواند هشدار قوی‌تر بدهد."
  ],
  [
    "let-us-let's",
    "let's پیشنهاد مشترک و let us گاهی اجازه/درخواست رسمی‌تر را بیان می‌کند.",
    "Let's review the figures. / Let us know.",
    "در let's منفی، let's not و don't let's هر دو در گونه‌ها دیده می‌شوند."
  ],
  [
    "polite-requests",
    "درخواست مؤدبانه با could/would/can و صورت‌های غیرمستقیم ساخته می‌شود؛ گذشته‌نمایی می‌تواند ادب را افزایش دهد.",
    "Would you mind closing the door?",
    "Would you mind پس از خود gerund می‌گیرد، نه مصدر با to."
  ],
  [
    "would-you-mind",
    "پس از would you mind، gerund برای درخواست انجام کار می‌آید؛ پاسخ yes/no ممکن است از نظر کاربردشناختی گیج‌کننده باشد.",
    "Would you mind waiting?",
    "No, not at all یعنی مشکلی نیست؛ Yes می‌تواند یعنی بله، مخالفت دارم."
  ],
  [
    "politeness-indirectness",
    "ساختارهای غیرمستقیم مانند I was wondering if می‌توانند درخواست را نرم‌تر کنند.",
    "I was wondering if you could help.",
    "زمان گذشته در اینجا لزوماً گذشتهٔ واقعی نیست؛ فاصلهٔ ادب می‌سازد."
  ],
  [
    "register-contractions",
    "انقباض‌ها در گفتار و نوشتار غیررسمی رایج‌اند؛ در نثر رسمی بسیار رسمی ممکن است شکل کامل ترجیح داده شود.",
    "cannot / can't; we are / we're",
    "این مرزبندی مطلق نیست؛ سبک‌نامه و مخاطب تعیین‌کننده‌اند."
  ],
  [
    "formal-informal-pronouns",
    "انتخاب واژگان و ساختار نحوی باید با register، مخاطب و هدف ارتباطی هماهنگ باشد.",
    "commence vs start; children vs kids",
    "رسمی بودن الزاماً به معنی پیچیده‌تر نوشتن نیست."
  ],
  [
    "british-american-prepositions",
    "برخی ترکیب‌های حرف اضافه میان گونه‌های بریتانیایی و آمریکایی فرق دارند.",
    "at the weekend (BrE); on the weekend (AmE)",
    "هر دو گونه در سطح جهانی تنوع داخلی دارند؛ برچسب‌ها گرایشی‌اند."
  ],
  [
    "british-american-past-forms",
    "برخی افعال در BrE و AmE صورت گذشته/شکل سوم متفاوت یا ترجیح متفاوت دارند.",
    "learnt/learned; got/gotten",
    "gotten در آمریکایی رایج است و got در برخی کاربردهای مالکیت/الزام هر دو گونه مشترک‌اند."
  ],
  [
    "british-american-collectives",
    "اسم‌های جمعی در BrE اغلب توافق جمعی می‌گیرند و در AmE بیشتر مفردند.",
    "The team are/is winning.",
    "توافق بر اساس تمرکز بر اعضا یا واحد سازمانی است."
  ],
  [
    "subjunctive-dialect",
    "mandative subjunctive در AmE رسمی‌تر و رایج‌تر؛ should در BrE نیز متداول است.",
    "They recommended that he resign. / should resign.",
    "هر دو صورت در هر دو گونه فهمیده می‌شوند."
  ],
  [
    "spelling-variation",
    "املای -ise/-ize، -our/-or و -re/-er میان گونه‌ها تفاوت دارد.",
    "organise/organize; colour/color; centre/center",
    "-ize در برخی سبک‌های بریتانیایی هم پذیرفته است؛ سبک‌نامه را یکدست نگه دار."
  ],
  [
    "punctuation-quotation-dialect",
    "جایگاه نقطه و ویرگول نسبت به گیومه در سبک آمریکایی و بریتانیایی می‌تواند متفاوت باشد.",
    "AmE often places commas inside quotes; BrE logical punctuation varies.",
    "سبک‌نامهٔ سازمان/ناشر را دنبال کن؛ یک قاعدهٔ جهانی واحد وجود ندارد."
  ],
  [
    "hyphenation-style",
    "ترکیب‌های دارای پیشوند و پسوند با توجه به خوانایی، ابهام و سبک‌نامه خط تیره می‌گیرند یا نمی‌گیرند.",
    "re-enter; non-governmental; email",
    "املای واژه‌های مرکب در گذر زمان تغییر می‌کند و باید با فرهنگ معتبر تطبیق داده شود."
  ],
  [
    "word-formation-derivation",
    "پسوندها و پیشوندها طبقهٔ واژه و معنی را تغییر می‌دهند؛ انتخاب آن‌ها تابع محدودیت‌های واژگانی است.",
    "stable → stability; govern → government",
    "قاعدهٔ اشتقاق همیشه مولد و قابل تعمیم نیست؛ املای پایه ممکن است تغییر کند."
  ],
  [
    "conversion-zero-derivation",
    "در conversion واژه بدون پسوند به طبقهٔ دستوری دیگر می‌رود.",
    "to email; a reply; to bottle",
    "معنی جدید همیشه از معنی اسم/فعل پایه قابل پیش‌بینی نیست."
  ],
  [
    "compounding-stress",
    "تکیه در ترکیب‌های اسمی اغلب روی جزء نخست و در گروه وصفی آزاد ممکن است روی جزء دوم باشد.",
    "GREENhouse vs green HOUSE",
    "الگوی تکیه گرایشی است و ترکیب‌های واژگانی استثنا دارند."
  ],
  [
    "counting-compounds",
    "جمع و مالکیت ترکیب‌های چندواژه‌ای بر اساس هستهٔ نحوی و واژگانی‌شدن تعیین می‌شود.",
    "passers-by; a friend of mine",
    "فرهنگ لغت برای ترکیب‌های تثبیت‌شده مرجع نهایی است."
  ],
  [
    "morphological-inflection",
    "صرف زمان، شمار، سوم‌شخص و مقایسه با اشتقاق واژه‌ساز تفاوت دارد.",
    "walks, walked, walking vs kindness",
    "صورت صرفی معمولاً طبقهٔ واژه را حفظ می‌کند؛ اشتقاق ممکن است آن را عوض کند."
  ],
  [
    "third-person-s-spelling",
    "پسوند سوم‌شخص مفرد -s با توجه به sibilant و املای پایه به -es یا -ies تبدیل می‌شود.",
    "watches, studies, plays",
    "افعال بی‌قاعدهٔ be و have و do شکل‌های خاص دارند."
  ],
  [
    "past-ed-pronunciation",
    "پسوند -ed سه تلفظ /t/، /d/ و /ɪd/ دارد و به صدای پایانی ریشه وابسته است.",
    "worked /t/, played /d/, wanted /ɪd/",
    "تلفظ را بر اساس صدا، نه حرف پایانی، تعیین کن."
  ],
  [
    "plural-s-pronunciation",
    "جمع -s سه تلفظ /s/، /z/ و /ɪz/ دارد و به صدای پایانی اسم وابسته است.",
    "cats /s/, dogs /z/, buses /ɪz/",
    "املای -es همیشه به‌تنهایی تلفظ را پیش‌بینی نمی‌کند."
  ],
  [
    "stress-shift-noun-verb",
    "برخی جفت‌های اسم/فعل با تغییر تکیه از هم متمایز می‌شوند.",
    "REcord (noun) / reCORD (verb)",
    "این الگو فقط در بخشی از واژگان و با تفاوت‌های لهجه‌ای وجود دارد."
  ],
  [
    "sentence-fragments-style",
    "fragment جمله‌وارهٔ وابسته یا گروه اسمیِ بدون بند مستقل است؛ در نثر رسمی معمولاً باید به جمله کامل پیوند بخورد.",
    "Because the data were incomplete. (fragment)",
    "در تیتر، تبلیغ، گفت‌وگو و نثر ادبی fragment می‌تواند عمدی و مؤثر باشد."
  ],
  [
    "run-on-sentence",
    "run-on وقتی دو بند مستقل بدون نشانه‌گذاری/پیوند مناسب به هم چسبیده‌اند رخ می‌دهد.",
    "The model failed, we retrained it.",
    "از نقطه، semicolon یا conjunction استفاده کن؛ طول جمله به‌تنهایی معیار نیست."
  ],
  [
    "sentence-adverb-position",
    "قیدهای جمله‌ای مانند fortunately و frankly نگرش گوینده را نسبت به کل گزاره نشان می‌دهند.",
    "Fortunately, the system recovered.",
    "قید جمله‌ای را از قید manner که فعل را توصیف می‌کند جدا کن."
  ],
  [
    "parenthetical-insertion",
    "عبارت معترضه اطلاعات جانبی می‌دهد و با ویرگول، خط تیره یا پرانتز جدا می‌شود.",
    "The policy, according to the report, failed.",
    "نشانه‌گذاری بر میزان جدایی و تأکید اثر می‌گذارد."
  ],
  [
    "apposition",
    "appositive یک اسم/گروه اسمی را با نام‌گذاری یا توضیح دوباره معرفی می‌کند.",
    "The CEO, Maria Chen, resigned.",
    "appositive محدودکننده و توضیحی از نظر ویرگول متفاوت‌اند."
  ],
  [
    "noun-clause-functions",
    "بند اسمی می‌تواند فاعل، مفعول، مکمل صفت/اسم یا مکمل حرف اضافه باشد.",
    "That prices fell surprised analysts.",
    "that در بند اسمیِ محتوایی معمولاً حذف‌پذیر است، اما نه در همهٔ جایگاه‌ها."
  ],
  [
    "content-clause-that",
    "بند that محتوایی گزاره/باور/گزارش را کامل می‌کند و با بند موصولی that فرق دارد.",
    "I believe that the figures are accurate.",
    "در نقش مفعول گاهی that حذف می‌شود؛ در آغاز جمله معمولاً حفظ می‌شود."
  ],
  [
    "nominal-relative",
    "بندهای موصولی اسمی مانند whoever/whatever به کل یک گروه اسمی اشاره می‌کنند.",
    "Whoever arrives first should call.",
    "whatever می‌تواند معنی هر چیزی که یا مهم نیست چه چیزی را بدهد."
  ],
  [
    "fused-relative-wh-ever",
    "whoever, whichever و whatever بندهای موصولی آزاد می‌سازند و نقش اسمی می‌گیرند.",
    "Choose whichever option works.",
    "whichever مجموعهٔ انتخاب را محدود می‌کند؛ whatever دامنهٔ آزادتر دارد."
  ],
  [
    "adverbial-clause-reduction",
    "بند قیدی در صورت هم‌فاعل بودن و حفظ معنی می‌تواند کاهش یابد.",
    "While waiting, she reviewed the file.",
    "فاعل ضمنی باید با فاعل بند اصلی یکی باشد؛ در غیر این صورت dangling رخ می‌دهد."
  ],
  [
    "correlative-conjunctions",
    "جفت‌هایی مانند no sooner...than و hardly...when ترتیب زمانی و گاهی وارونگی می‌سازند.",
    "No sooner had we arrived than it started raining.",
    "در آغاز جمله، بخش نخست وارونگی می‌گیرد؛ کاربردهای بدون وارونگی نیز وجود دارد."
  ],
  [
    "no-sooner-hardly",
    "no sooner با than و hardly/scarcely با when/before می‌آیند و تقدم نزدیک زمانی را نشان می‌دهند.",
    "Hardly had trading begun when prices fell.",
    "این ساختار رسمی/روایی است و در گفتار روزمره کمتر به‌کار می‌رود."
  ],
  [
    "rather-than-parallelism",
    "rather than می‌تواند دو اسم، مصدر یا ساختار موازی را مقایسه کند.",
    "We chose to delay rather than cancel.",
    "شکل فعل و موازی‌سازی به جایگاه rather than بستگی دارد."
  ],
  [
    "instead-of-versus-rather-than",
    "instead of حرف اضافه است و gerund/اسم می‌گیرد؛ rather than می‌تواند ساختارهای موازی گوناگون بگیرد.",
    "Instead of waiting, we left.",
    "پس از instead of فعل به شکل -ing می‌آید."
  ],
  [
    "not-only-but-also-inversion",
    "اگر not only در آغاز بند بیاید، در همان بند وارونگی رخ می‌دهد و but also بند دوم را موازی می‌کند.",
    "Not only did costs rise, but output also fell.",
    "اگر not only در آغاز کل جمله نباشد، وارونگی لازم نیست."
  ],
  [
    "neither-nor-inversion",
    "neither در آغاز جمله می‌تواند وارونگی داشته باشد؛ neither...nor نیز دو جزء منفی را هماهنگ می‌کند.",
    "Neither did the board respond nor did it explain.",
    "در ساختار هماهنگ، توافق فعل با جزء نزدیک‌تر یا بازنویسی برای وضوح اهمیت دارد."
  ],
  [
    "so-do-i-response",
    "so + auxiliary + subject پاسخ مثبت هم‌معنی و neither/nor پاسخ منفی هم‌معنی می‌سازد.",
    "I agree. So do I. / I don't. Neither do I.",
    "نوع auxiliary باید با زمان و فعل جملهٔ نخست یکسان باشد."
  ],
  [
    "as-long-as-duration-condition",
    "as long as می‌تواند مدت یا شرط را بیان کند؛ معنی از بافت تعیین می‌شود.",
    "Stay as long as you like. / We will invest as long as risks remain low.",
    "برای رفع ابهام می‌توان provided that یا while را جایگزین کرد."
  ],
  [
    "once-temporal-condition",
    "once می‌تواند زمانِ پس از تحقق رویداد یا شرطِ کافی را نشان دهد.",
    "Once the data arrive, we can decide.",
    "در بند زمانی آینده، حال ساده معمولاً می‌آید."
  ],
  [
    "by-the-time-tense",
    "by the time نقطهٔ مرجع می‌سازد و زمان فعل بر اساس نسبت تکمیل رویداد انتخاب می‌شود.",
    "By the time we arrived, the meeting had ended.",
    "برای آینده، by the time + present و future perfect در بند اصلی رایج است."
  ],
  [
    "until-by-difference",
    "until نشان‌دهندهٔ ادامه تا یک نقطه و by نشان‌دهندهٔ مهلت/حداکثر زمان تکمیل است.",
    "Wait until Friday. / Finish it by Friday.",
    "در منفی، not until می‌تواند معنی تا آن زمان رخ نداد را بدهد."
  ],
  [
    "during-for-while",
    "during با گروه اسمی، for با مدت، while با بند جمله‌ای می‌آید.",
    "during the meeting; for two hours; while we met",
    "throughout نیز بر کل بازه تأکید دارد."
  ],
  [
    "ago-before-since",
    "ago از اکنون به عقب می‌شمارد و معمولاً past simple می‌گیرد؛ since نقطهٔ آغاز تا مرجع را می‌دهد.",
    "I left two days ago. / I have lived here since 2020.",
    "before نسبت زمانی را به مرجع دیگری هم می‌تواند نشان دهد."
  ],
  [
    "already-yet-still",
    "already، yet و still جایگاه و پیش‌فرض‌های متفاوت دارند.",
    "She has already left; hasn't she left yet?; she is still here.",
    "already در پرسش می‌تواند شگفتی/انتظار را نشان دهد."
  ],
  [
    "anymore-any-longer-no-longer",
    "anymore/any longer معمولاً در منفی و پرسش و no longer در ساختار مثبتِ منفی‌معنا به‌کار می‌رود.",
    "We don't use that system anymore. / We no longer use it.",
    "جایگاه قید در گونه‌های انگلیسی متفاوت است."
  ],
  [
    "ever-never-just",
    "ever، never و just با زمان کامل و ساختارهای پرسشی/تأکیدی هم‌نشینی‌های مشخص دارند.",
    "Have you ever seen it? / I've just arrived.",
    "just در آمریکایی می‌تواند با past simple بیاید."
  ],
  [
    "still-yet-negative",
    "still در منفی می‌تواند انتظارِ تحقق‌نیافتن را برجسته کند؛ yet بیشتر به عدم تحقق تا زمان مرجع اشاره دارد.",
    "I still haven't received it. / I haven't received it yet.",
    "جایگاه و آهنگ می‌تواند نگرش گوینده را عوض کند."
  ],
  [
    "so-far-to-date",
    "so far و to date بازهٔ جاری تا زمان حال را می‌سازند و اغلب با present perfect می‌آیند.",
    "So far, the company has raised $2 million.",
    "اگر بازه پایان یافته باشد، past simple طبیعی‌تر است."
  ],
  [
    "as-of-temporal",
    "as of نقطهٔ زمانیِ اعتبار/وضعیت را مشخص می‌کند و در گزارش‌ها رایج است.",
    "As of Monday, the rule is in force.",
    "as at نیز در برخی گونه‌ها/سبک‌های مالی رایج است."
  ],
  [
    "respectively",
    "respectively ارتباط ترتیب‌مند میان دو یا چند فهرست را مشخص می‌کند.",
    "Exports and imports rose 4% and 2%, respectively.",
    "دو فهرست باید هم‌طول و ترتیبشان روشن باشد."
  ],
  [
    "respectively-placement",
    "respectively معمولاً در انتهای بند یا پس از جفت داده‌ها می‌آید تا تناظر روشن باشد.",
    "A and B scored 8 and 6, respectively.",
    "جایگاه نادرست می‌تواند دامنهٔ ارتباط را مبهم کند."
  ],
  [
    "respectively-vs-each",
    "respectively تناظر چندبه‌چند می‌سازد؛ each توزیع جداگانه را برجسته می‌کند.",
    "The rates were 3% and 5%, respectively.",
    "از respectively برای فهرست‌های طولانی و مبهم استفاده نکن."
  ],
  [
    "hedging-modality",
    "قیدها و افعال وجهی مانند may, might, likely, appear to و suggest میزان قطعیت ادعا را تنظیم می‌کنند.",
    "The data suggest that inflation may ease.",
    "hedging نباید شواهد قوی را بی‌جهت ضعیف یا شواهد ضعیف را قطعی جلوه دهد."
  ],
  [
    "evidential-reporting-verbs",
    "reporting verbs مانند claim, argue, find, demonstrate و suggest درجات و انواع شواهد متفاوتی القا می‌کنند.",
    "The study finds... / The author argues...",
    "فعل گزارشی باید با نوع شاهد و موضع نویسنده منطبق باشد."
  ],
  [
    "stance-adverbials",
    "قیدهای موضعی مانند apparently, arguably, certainly و reportedly دیدگاه یا منبع قطعیت را نشان می‌دهند.",
    "Reportedly, the minister will resign.",
    "جایگاه قید و دامنهٔ آن بر معنی و لحن اثر دارد."
  ],
  [
    "causal-inference-language",
    "because, therefore, lead to, result from و be associated with روابط علّی یا همبستگی متفاوتی دارند.",
    "Higher costs contributed to lower output.",
    "همبستگی را با علیت اشتباه نگیر؛ انتخاب ساختار گرامری ادعای علمی را تقویت می‌کند."
  ],
  [
    "nominalization-register",
    "nominalization فرایند/ویژگی را به اسم تبدیل می‌کند و نثر رسمی/فشرده می‌سازد.",
    "The government reduced spending. / The reduction in spending...",
    "افراط در nominalization نثر را مبهم و سنگین می‌کند."
  ],
  [
    "agent-suppression",
    "مجهول و nominalization می‌توانند عامل را حذف کنند؛ این حذف بر مسئولیت‌پذیری و تمرکز اطلاعاتی اثر دارد.",
    "The decision was made.",
    "اگر عامل مهم است، by-phrase یا جملهٔ معلوم را به‌کار ببر."
  ],
  [
    "parallel-citation-reporting",
    "در گزارش چند منبع، زمان و ساختار reporting verbs باید سازگار و نسبت ادعا به منبع روشن باشد.",
    "Smith argues..., whereas Lee finds...",
    "زمان حال برای آثار/استدلال‌های همچنان معتبر رایج است؛ گذشته برای رویداد پژوهش خاص ممکن است."
  ],
  [
    "academic-tense-choice",
    "در نوشتار دانشگاهی، حال ساده برای دانش/نتیجهٔ متن، گذشته برای روش/یافتهٔ پژوهش مشخص و present perfect برای مرور ادبیات به‌کار می‌رود.",
    "The paper argues...; participants completed...",
    "رشته، مجله و سبک‌نامه ممکن است الگوی متفاوتی ترجیح دهند."
  ],
  [
    "headline-grammar",
    "تیتر خبر ممکن است article، auxiliary و copula را حذف کند و زمان حال را برای رویداد گذشته به‌کار ببرد.",
    "Central Bank Cuts Rates",
    "این حذف‌ها مخصوص ژانر تیترند و نباید به نثر کامل تعمیم داده شوند."
  ],
  [
    "telegram-style-ellipsis",
    "در تیتر و یادداشت کوتاه، حذف عناصر قابل بازیابی برای ایجاز رخ می‌دهد.",
    "Minister to visit Ankara",
    "در متن رسمی کامل، فاعل/فعل و رابطهٔ نحوی را بازسازی کن."
  ],
  [
    "quotative-like",
    "like در گفتار می‌تواند نقش quotative یا discourse marker داشته باشد، اما در نثر رسمی کاربردهای محدودتری دارد.",
    "She was like, 'No way.'",
    "این کاربرد با like حرف اضافه یا مقایسه‌ای فرق دارد."
  ],
  [
    "quotative-go",
    "go در گفتار غیررسمی می‌تواند فعل نقل قول باشد.",
    "He goes, 'I can't believe it.'",
    "در گزارش رسمی از say/tell استفاده کن."
  ],
  [
    "be-like-stance",
    "be like می‌تواند نقل گفتار یا حالت/واکنش را نشان دهد و الزاماً نقل قول لفظی نیست.",
    "I was like, 'What?'",
    "برای نقل دقیق و رسمی، said را ترجیح بده."
  ],
  [
    "discourse-repair",
    "تکرار، self-correction و false starts در گفتار بخشی از ساختار تعامل‌اند، نه الزاماً خطای گرامری نوشتار.",
    "The figures—well, the revised figures—were lower.",
    "در رونویسی و تحلیل گفتار باید این پدیده‌ها را از خطای دستوری جدا کرد."
  ],
  [
    "ellipsis-conversation",
    "حذف در پاسخ‌های کوتاه بافت‌محور است و بخش حذف‌شده از پرسش/گفتمان بازیابی می‌شود.",
    "Coming? — In a minute.",
    "این حذف در گفتار طبیعی است؛ در نوشتار مستقل ممکن است ناقص به‌نظر برسد."
  ],
  [
    "short-answer-auxiliary",
    "پاسخ کوتاه مثبت/منفی معمولاً auxiliary را تکرار می‌کند و از تکرار کل فعل پرهیز می‌کند.",
    "Do you agree? — Yes, I do.",
    "پاسخ‌های غیررسمی sure/nope الگوهای متفاوت دارند."
  ],
  [
    "echo-auxiliary-do",
    "do در پرسش پژواکی می‌تواند فعل/گزارهٔ پیشین را بازتاب دهد.",
    "You sold it? — I did?",
    "آهنگ گفتار برای تشخیص پرسش واقعی از شگفتی ضروری است."
  ],
  [
    "metalinguistic-negation",
    "نفی گاهی خود واژه یا صورت بیان را رد می‌کند، نه واقعیت گزاره را.",
    "He isn't unhappy; he's delighted.",
    "تفسیر وابسته به تأکید و بافت است."
  ],
  [
    "litotes",
    "litotes با نفی متضاد، تأیید ملایم یا تأکیدی می‌سازد.",
    "That is not uncommon.",
    "شدت واقعی از بافت و لحن برداشت می‌شود."
  ],
  [
    "understatement-overstatement",
    "ساختارهای درجه و کمیت می‌توانند برای understatement یا hyperbole به‌کار روند.",
    "I've told you a thousand times.",
    "این کاربرد بلاغی است و نباید همیشه لفظی تحلیل شود."
  ],
  [
    "rhetorical-question",
    "پرسش بلاغی از نظر شکل پرسش است اما کارکردش تأکید/ادعاست.",
    "Who could deny the evidence?",
    "نشانه‌گذاری و آهنگ در تفسیر آن نقش دارند."
  ],
  [
    "expletive-insertion",
    "عبارت‌های تقویتی گفتاری مانند do/ever/at all می‌توانند شدت یا نگرش بسازند.",
    "I do hope it works. / I don't know at all.",
    "register و لحن تعیین می‌کند کدام تقویت‌کننده طبیعی است."
  ],
  [
    "swearing-register",
    "واژگان تابو و swear words می‌توانند نقش دستوری قید/صفت/اسم/فعل بگیرند اما register بسیار غیررسمی دارند.",
    "That was bloody difficult. (BrE informal)",
    "در متن حرفه‌ای/عمومی از آن‌ها پرهیز کن مگر نقل قول تحلیلی لازم باشد."
  ],
  [
    "grammar-vs-usage",
    "تفاوت میان قاعدهٔ نحوی، ترجیح سبکی و کاربرد گویشی را تشخیص بده؛ هر تفاوتی خطای گرامری نیست.",
    "different from/to/than",
    "قضاوت باید با گونه، register، مخاطب و سبک‌نامه مشخص شود."
  ],
  [
    "prescriptive-descriptive",
    "گرامر توصیفی الگوهای واقعی زبان را ثبت می‌کند؛ دستور تجویزی توصیهٔ سبک/استاندارد می‌دهد.",
    "Who are you talking to? (standard modern usage)",
    "برای ویرایش حرفه‌ای باید هدف و گونهٔ متن را مشخص کرد."
  ],
  [
    "ambiguity-syntactic",
    "ابهام ساختاری وقتی رخ می‌دهد که یک رشتهٔ واژگانی چند درخت نحوی ممکن داشته باشد.",
    "I saw the man with a telescope.",
    "بازنویسی یا نشانه‌گذاری می‌تواند تفسیر موردنظر را روشن کند."
  ],
  [
    "attachment-ambiguity",
    "عبارت قیدی/موصولی ممکن است به بیش از یک گروه اسمی متصل شود.",
    "She discussed the report with the editor.",
    "بافت کمک می‌کند اما گاهی بازنویسی تنها راه رفع ابهام است."
  ],
  [
    "scope-ambiguity-quantifier",
    "جایگاه کمیت‌نماها و نفی می‌تواند دامنهٔ منطقی متفاوتی بسازد.",
    "Every student didn't pass.",
    "برای معنی «هیچ‌کس قبول نشد» از none/no student استفاده کن."
  ],
  [
    "coordination-ambiguity",
    "هماهنگی می‌تواند دامنهٔ متفاوتی داشته باشد و گروه‌بندی اجزا را مبهم کند.",
    "old men and women",
    "برای روشن‌سازی، تکرار صفت یا بازنویسی لازم است."
  ],
  [
    "garden-path-sentences",
    "ساختارهای garden-path خواننده را موقتاً به تحلیل نحوی نادرست هدایت می‌کنند.",
    "The horse raced past the barn fell.",
    "این مثال‌ها برای تحلیل پردازش جمله‌اند، نه الگوی نوشتار روزمره."
  ],
  [
    "constituency-tests",
    "جایگزینی، جابه‌جایی، حذف و پرسش‌سازی آزمون‌هایی برای تشخیص constituent هستند.",
    "The very old building collapsed. → It collapsed.",
    "هیچ آزمون واحدی برای همهٔ ساختارها قطعی نیست؛ چند شاهد را ترکیب کن."
  ],
  [
    "dependency-vs-constituency",
    "تحلیل constituency گروه‌های سلسله‌مراتبی و dependency رابطهٔ سر-وابسته را مدل می‌کند.",
    "the rapid fall in prices",
    "دو چارچوب بازنمایی متفاوتی از یک جمله می‌دهند؛ هر دو برای تحلیل مفیدند."
  ],
  [
    "head-complement-adjunct",
    "head هستهٔ گروه است؛ complement را انتخاب می‌کند و adjunct اطلاعات اختیاری می‌افزاید.",
    "rely on evidence; quickly; in the morning",
    "مرز complement/adjunct گاهی نظری و وابسته به چارچوب دستور است."
  ],
  [
    "valency-argument-structure",
    "ظرفیت فعل تعداد و نوع argumentهای لازم/ممکن را تعیین می‌کند.",
    "give requires giver, recipient, and theme in its ditransitive use.",
    "معنی‌های مختلف یک فعل ظرفیت متفاوت دارند."
  ],
  [
    "transitivity-alternation",
    "برخی افعال میان کاربرد متعدی و لازم جابه‌جا می‌شوند و عامل را حذف/برجسته می‌کنند.",
    "The door opened. / She opened the door.",
    "این alternation برای همهٔ افعال ممکن نیست."
  ],
  [
    "dative-alternation",
    "برخی افعال دو مفعولی دو ساختار dative دارند؛ انتخاب به طول، تأکید و ویژگی مفعول وابسته است.",
    "She sent him a letter. / She sent a letter to him.",
    "هر فعل هر دو الگو را نمی‌پذیرد: explain the issue to me, نه explain me the issue در معیار."
  ],
  [
    "locative-alternation",
    "برخی افعال میان ساختار مکان/مفعول جابه‌جا می‌شوند و معنی/کانون تغییر می‌کند.",
    "load the truck with hay; load hay onto the truck",
    "انتخاب فعل و معنای نتیجه‌محور/مکان‌محور تعیین‌کننده است."
  ],
  [
    "resultative-construction",
    "صفت/گروه اسمی resultative نتیجهٔ عمل را بر مفعول یا فاعل توصیف می‌کند.",
    "They painted the door red.",
    "این ساختار در انگلیسی مولد اما محدود به سازگاری معنایی است."
  ],
  [
    "way-construction",
    "ساختار make one's way و فعل + one's way مسیر/پیشروی را بیان می‌کند.",
    "She talked her way into the meeting.",
    "فعل باید از نظر معنایی با ساختار سازگار باشد."
  ],
  [
    "small-clause",
    "گروه اسمی + مکمل وصفی می‌تواند small clause و محتوای گزاره‌ایِ مفعول باشد.",
    "I consider the plan risky.",
    "تحلیل آن در چارچوب‌های نظری مختلف فرق می‌کند."
  ],
  [
    "raising-control",
    "در raising، فاعل معنایی از بند پایین می‌آید؛ در control، فاعل ضمنی بند پایین با argument فعل اصلی کنترل می‌شود.",
    "She seems to understand. / She tried to understand.",
    "آزمون‌هایی مانند expletive it/there و انتخاب معنایی کمک می‌کنند."
  ],
  [
    "subject-control-object-control",
    "در subject control فاعل بند اصلی کنترل‌کننده است؛ در object control مفعول کنترل می‌کند.",
    "She promised him to leave. / She persuaded him to leave.",
    "افعال promise و persuade الگوهای متفاوت دارند؛ کنترل را باید واژگانی یاد گرفت."
  ],
  [
    "tough-construction",
    "در tough-construction، صفتی مانند easy با مصدر می‌آید و مفعول ضمنی مصدر با فاعل جمله هم‌مرجع است.",
    "This problem is easy to solve.",
    "فاعل جمله عامل حل‌کردن نیست؛ نقش معنایی را از ساختار جدا کن."
  ],
  [
    "unaccusative-unergative",
    "افعال لازم از نظر رفتار نحوی به unaccusative و unergative تقسیم می‌شوند؛ این تمایز بر participle و ساختارهای دیگر اثر دارد.",
    "The glass broke. / The athlete ran.",
    "طبقه‌بندی به معنی فعل و چارچوب نظری وابسته است."
  ],
  [
    "ergative-verbs",
    "افعال ergative در کاربرد لازم و متعدی، مفعول متعدی با فاعل لازم هم‌نقش است.",
    "The price increased. / They increased the price.",
    "همهٔ افعال لازم/متعدی alternation ergative ندارند."
  ],
  [
    "light-verbs",
    "ترکیب‌های light verb مانند take a decision یا make an attempt معنی را با اسم محتوایی می‌سازند.",
    "make an assessment; take action",
    "انتخاب فعل سبک collocational است و میان BrE/AmE فرق دارد."
  ],
  [
    "colligation",
    "colligation الگوی دستوری هم‌نشینی یک واژه است؛ مثلاً فعل خاص با gerund یا that-clause می‌آید.",
    "insist on doing; suggest that...",
    "این مفهوم فراتر از معنی واژه و مربوط به الگوی نحویِ واژگانی است."
  ],
  [
    "collocation-grammar",
    "هم‌نشینی‌های دستوری مانند adjective + preposition یا verb + noun باید به‌صورت واحدهای واژگانی یاد گرفته شوند.",
    "keen on; depend on; raise concerns",
    "ترکیب‌های ظاهراً ممکن ممکن است برای گویشور طبیعی نباشند."
  ],
  [
    "lexical-grammar-patterns",
    "معنی واژه و الگوی دستوری آن به هم وابسته‌اند؛ ساختار complement بخشی از دانش واژگانی است.",
    "prevent someone from doing; enable someone to do",
    "آموزش صرفاً فهرست قواعد بدون الگوی واژگانی برای تسلط کافی نیست."
  ],
  [
    "corpus-frequency-register",
    "فراوانی ساختارها در corpus بر اساس ژانر و register فرق دارد؛ رایج بودن با درست بودن یکسان نیست.",
    "shall in legal prose vs everyday speech",
    "برای تصمیم ویرایشی، corpus هم‌ژانر و گونهٔ هدف را انتخاب کن."
  ],
  [
    "grammaticalization",
    "عبارت‌های واژگانی می‌توانند در طول زمان نقش دستوری پیدا کنند، مانند going to به نشانگر آینده.",
    "I'm gonna leave. (speech)",
    "gonna در نوشتار رسمی مناسب نیست و محدودیت‌های نحوی دارد."
  ],
  [
    "contraction-gonna-wanna",
    "gonna از going to و wanna از want to در گفتار کاهش‌یافته‌اند و همهٔ جایگاه‌های دستوری را نمی‌پذیرند.",
    "I'm gonna leave. / I wanna know.",
    "در متن رسمی شکل کامل را بنویس؛ wanna معمولاً پیش از اسم به‌کار نمی‌رود."
  ],
  [
    "speech-reduction",
    "کاهش‌های گفتاری مانند gonna, hafta, coulda بازتاب تلفظ متصل‌اند و نباید با املای معیار اشتباه شوند.",
    "have to → hafta; could have → coulda",
    "در رونویسی دقیق گفتار ممکن است ثبت شوند؛ در نوشتار استاندارد شکل کامل لازم است."
  ],
  [
    "intonation-grammar",
    "آهنگ صعودی/نزولی می‌تواند نوع جمله، کانون، قطعیت و نگرش را تغییر دهد.",
    "You're leaving? (rise) / You're leaving. (fall)",
    "الگوهای آهنگ میان گویش‌ها و موقعیت‌ها تفاوت دارند."
  ],
  [
    "stress-focus",
    "تکیهٔ جمله‌ای عنصر تقابلی یا تازه را برجسته می‌کند و معنی ضمنی جمله را تغییر می‌دهد.",
    "I said JOHN called, not Jack.",
    "نوشتار برای انتقال آن به ترتیب، italics یا بافت تکیه می‌کند."
  ],
  [
    "contrastive-focus",
    "ساختارهای cleft، fronting و stress ابزارهای مختلف برای کانون تقابلی‌اند.",
    "It was the timing, not the cost, that mattered.",
    "هر ابزار register و محدودیت نحوی متفاوت دارد."
  ],
  [
    "register-genre-grammar",
    "ژانرهای علمی، خبری، حقوقی و گفتاری الگوهای گرامری متفاوت دارند؛ انتخاب ساختار بخشی از مهارت تخصصی است.",
    "Headlines omit articles; legal prose uses shall/whereas.",
    "هیچ register ذاتاً برتر نیست؛ تناسب با هدف مهم است."
  ],
  [
    "legal-modal-shall",
    "در قراردادها shall می‌تواند تعهد یا الزام را بیان کند، اما سبک حقوقی مدرن گاهی must را روشن‌تر می‌داند.",
    "The tenant shall pay...",
    "تفسیر حقوقی به حوزهٔ قضایی و drafting convention وابسته است؛ توصیهٔ حقوقی نیست."
  ],
  [
    "legal-hereby-whereas",
    "عبارت‌هایی مانند hereby، therein و whereas ویژگی‌های register حقوقی/اداری‌اند.",
    "The parties hereby agree...",
    "در نثر عمومی اغلب واژه‌های ساده‌تر روشن‌ترند."
  ],
  [
    "news-attribution-grammar",
    "ساختارهای attribution در خبر منبع ادعا را مشخص می‌کنند و جایگاه said/according to بر کانون اثر دارد.",
    "The minister said the measure would begin...",
    "نسبت دادن ادعا به منبع برای جلوگیری از القای واقعیت قطعی ضروری است."
  ],
  [
    "reported-claim-vs-fact",
    "تفاوت ساختار factive و non-factive در افعال گزارشی بر پیش‌فرض صدق بند وابسته اثر دارد.",
    "regret that p (factive); claim that p (non-factive)",
    "طبقه‌بندی دقیق به معنی فعل و بافت وابسته است."
  ],
  [
    "factive-verbs",
    "افعالی مانند know, realize و regret معمولاً صدق بند متممی را مفروض می‌گیرند.",
    "She realized that the figures were wrong.",
    "افعال non-factive مانند believe/claim صدق بند را پیش‌فرض نمی‌گیرند."
  ],
  [
    "presupposition-triggers",
    "عبارت‌هایی مانند stop, continue, again و cleft می‌توانند پیش‌فرض معنایی ایجاد کنند.",
    "She stopped smoking (presupposes prior smoking).",
    "پیش‌فرض‌ها در نفی و پرسش ممکن است باقی بمانند، اما لغوپذیر و وابسته به بافت‌اند."
  ],
  [
    "entailment-contradiction",
    "معنی جمله می‌تواند entailment، presupposition یا implicature بسازد؛ این‌ها را از معنی لفظی جدا کن.",
    "He managed to escape entails he escaped.",
    "تحلیل دقیق به منطق و کاربردشناسی نیاز دارد و همیشه با ترجمهٔ لغوی یکی نیست."
  ],
  [
    "implicature",
    "implicature معنای ضمنیِ قابل استنتاج از بافت و اصول مکالمه است.",
    "Some of the reports were accurate. (possibly not all)",
    "ضمنی‌بودن یعنی در بافت دیگر قابل لغو است؛ entailment قابل لغو نیست."
  ],
  [
    "scalar-implicature",
    "انتخاب واژه‌ای ضعیف‌تر در مقیاس مانند some در برابر all می‌تواند برداشت ضمنی بسازد.",
    "Some investors agreed.",
    "این برداشت قطعی نیست و می‌تواند با بافت یا تأکید لغو شود."
  ],
  [
    "polarity-items",
    "some/any، ever و at all حساسیت قطبیت دارند و در پرسش، نفی و شرط الگوهای متفاوتی می‌گیرند.",
    "Have you seen any evidence? / I haven't seen any.",
    "some در پیشنهاد/درخواست و any در معنی آزاد نیز ممکن‌اند."
  ],
  [
    "negative-polarity-items",
    "عبارت‌هایی مانند any، ever و lift a finger در محیط‌های منفی/پرسشی/شرطی مجازند.",
    "I don't have any evidence.",
    "محیط‌های polarity-licensing پیچیده‌اند و همهٔ پرسش‌ها یکسان نیستند."
  ],
  [
    "positive-polarity-items",
    "عبارت‌هایی مانند already و some در برخی محیط‌های مثبت ترجیح دارند و در منفی محدود می‌شوند.",
    "I have already finished.",
    "پرسش‌های مثبت با already می‌توانند انتظار/شگفتی بسازند."
  ],
  [
    "generic-vs-specific",
    "زمان حال ساده و اسم جمع بدون article اغلب تعمیم نوعی می‌سازند؛ the می‌تواند نوع را به‌صورت کل گونه معرفی کند.",
    "Banks create credit. / The bank is a key institution.",
    "خوانش generic به بافت و نوع گزاره وابسته است."
  ],
  [
    "habitual-vs-characteristic",
    "حال ساده می‌تواند عادت یا ویژگی ذاتی را نشان دهد؛ استمراری می‌تواند رفتار موقت/تکراری ارزیابانه باشد.",
    "He works in finance. / He's always complaining.",
    "نوع فعل و قید بسامد تفسیر را تعیین می‌کند."
  ],
  [
    "aspectual-coercion",
    "بافت می‌تواند نوع رویداد فعل را تغییر دهد؛ فعل حالتی در خوانش موقت یا رفتاری استمراری می‌شود.",
    "I'm loving this course.",
    "این کاربردها وابسته به معنی و register هستند؛ قاعدهٔ همهٔ stative verbs نیستند."
  ],
  [
    "lexical-polysemy-grammar",
    "یک فعل چندمعنا ممکن است در معنی‌های مختلف الگوی نحوی متفاوت داشته باشد.",
    "weigh 60 kg (state) / weigh the options (action)",
    "تحلیل باید معنی فعال‌شده را در نظر بگیرد."
  ],
  [
    "semantic-roles",
    "فاعل، مفعول و مکمل نقش‌های معنایی agent, patient, experiencer, theme و recipient می‌گیرند.",
    "The analyst (agent) examined the report (patient).",
    "نقش معنایی با نقش نحوی یکی نیست؛ فاعل همیشه agent نیست."
  ],
  [
    "voice-and-agency",
    "معلوم/مجهول علاوه بر صورت فعل، عامل، موضوع و کانون اطلاعاتی را بازآرایی می‌کنند.",
    "The regulator fined the bank. / The bank was fined.",
    "انتخاب voice می‌تواند عامل را حذف کند و بر برداشت خواننده اثر بگذارد."
  ],
  [
    "grammatical-metaphor",
    "در نثر علمی/رسمی، فرایندها می‌توانند به اسم تبدیل شوند و روابط منطقی فشرده شوند.",
    "When prices rose... / the rise in prices...",
    "فشردگی بیش از حد باعث پنهان شدن عامل و دشواری خواندن می‌شود."
  ],
  [
    "nominal-group-complexity",
    "گروه اسمی می‌تواند premodifier و postmodifier متعدد داشته باشد؛ سرگروه را برای فهم ساختار پیدا کن.",
    "the recently revised central bank policy framework",
    "طولانی شدن گروه اسمی ابهام و بار پردازشی ایجاد می‌کند؛ بازنویسی مفید است."
  ],
  [
    "postmodification-of-nouns",
    "اسم می‌تواند با عبارت حرف اضافه‌ای، relative clause، participle یا مصدر پس‌توصیف شود.",
    "the decision to postpone the vote",
    "هر پس‌توصیف رابطهٔ معنایی متفاوتی با head دارد."
  ],
  [
    "noun-complement-vs-modifier",
    "بند مکمل اسم محتوای معنایی آن را کامل می‌کند؛ modifier صرفاً آن را محدود/توصیف می‌کند.",
    "the claim that rates will fall; the report on rates",
    "تمایز به نوع اسم و انتخاب نحوی وابسته است."
  ],
  [
    "of-genitive-meaning",
    "of-phrase می‌تواند مالکیت، جزء-کل، محتوا، موضوع یا ویژگی را بیان کند.",
    "the roof of the building; a cup of tea",
    "رابطهٔ معنایی از اسم head و بافت مشخص می‌شود."
  ],
  [
    "s-genitive-animacy",
    "'s-genitive با انسان، سازمان، زمان و مکان رایج است؛ of-genitive با روابط دیگر نیز کاربرد دارد.",
    "the company's policy; today's market",
    "این تمایز گرایشی است و سازمان‌ها/کشورها به‌راحتی 's می‌گیرند."
  ],
  [
    "double-object-restrictions",
    "ساختار دو مفعولی محدودیت معنایی/واژگانی دارد؛ recipient معمولاً انسان/موجود دریافت‌کننده است.",
    "She gave the firm a loan.",
    "برخی اسم‌های انتزاعی یا مفعول‌های سنگین ساختار to را ترجیح می‌دهند."
  ],
  [
    "prepositional-dative",
    "در dative با to/for، recipient پس از گروه theme می‌آید و می‌تواند طولانی‌تر باشد.",
    "They sent the documents to the regulator.",
    "فعل و معنی تعیین می‌کنند to یا for مناسب است."
  ],
  [
    "for-to-infinitive",
    "در برخی گونه‌ها و ساختارهای خاص for + NP + to-infinitive فاعل مصدر را معرفی می‌کند.",
    "It is important for markets to remain liquid.",
    "for در اینجا حرف اضافه/نشانگر بند است و نباید با for-purpose اشتباه شود."
  ],
  [
    "infinitival-complement-control",
    "برخی صفت‌ها و اسم‌ها مصدر با to می‌گیرند و فاعل ضمنی آن از بافت کنترل می‌شود.",
    "eager to help; decision to resign",
    "نوع control به head واژگانی وابسته است."
  ],
  [
    "that-vs-infinitive-complement",
    "برخی اسم‌ها/صفت‌ها بند that و برخی مصدر می‌گیرند؛ انتخاب می‌تواند معنی/مرجع فاعل را تغییر دهد.",
    "the claim that he lied; the desire to leave",
    "الگوی مکمل را همراه واژه یاد بگیر."
  ],
  [
    "wh-infinitive",
    "بند wh + to-infinitive بیانگر ندانستن/تصمیم دربارهٔ عمل است.",
    "She knows what to do.",
    "فاعل ضمنی معمولاً از بند اصلی بازیابی می‌شود."
  ],
  [
    "infinitive-purpose",
    "مصدر با to می‌تواند هدف عمل را بیان کند؛ in order to و so as to رسمی‌تر/صریح‌ترند.",
    "They cut rates to stimulate demand.",
    "فاعل ضمنی معمولاً با فاعل بند اصلی هم‌مرجع است."
  ],
  [
    "infinitive-result",
    "مصدر می‌تواند نتیجهٔ غیرمنتظره یا پیامد پس از only/never را نشان دهد.",
    "He returned to find the office empty.",
    "این ساختار از مصدر هدف متفاوت است و اغلب در روایت می‌آید."
  ],
  [
    "too-adjective-infinitive",
    "too + adjective + to-infinitive محدودیت/عدم امکان را بیان می‌کند.",
    "The data are too incomplete to support the claim.",
    "معنی می‌تواند با for + NP مشخص شود."
  ],
  [
    "adjective-enough-infinitive",
    "adjective + enough + to-infinitive کفایت برای انجام عمل را نشان می‌دهد.",
    "The sample is large enough to analyse.",
    "فاعل ضمنی مصدر معمولاً از جمله بازیابی می‌شود."
  ],
  [
    "such-that-result",
    "such + noun phrase + that-clause نتیجهٔ شدت را می‌رساند.",
    "It was such a shock that trading stopped.",
    "با so + adjective/adverb + that تفاوت دارد."
  ],
  [
    "so-that-ambiguity",
    "so that می‌تواند هدف یا نتیجه باشد؛ وجه و بافت به تفکیک کمک می‌کنند.",
    "We lowered fees so that more users would join.",
    "برای هدف اغلب modal و برای نتیجه گزارهٔ واقعی می‌آید، اما هم‌پوشانی وجود دارد."
  ],
  [
    "as-as-subordinate",
    "as می‌تواند زمان، علت، مقایسه، نقش یا شیوه را معرفی کند.",
    "As prices rose, demand fell. / Do as I say.",
    "معنی از ساختار بند و رابطهٔ معنایی تشخیص داده می‌شود."
  ],
  [
    "like-as-conjunction",
    "like در گفتار می‌تواند پیش از بند بیاید، اما as/as if در نثر رسمی‌تر و ساختارهای دقیق ترجیح دارند.",
    "It looks like we're late. / as if we were late.",
    "کاربرد like به‌عنوان conjunction در انگلیسی معاصر رایج است، اما سبک‌نامه‌ها متفاوت‌اند."
  ],
  [
    "than-as-preposition-conjunction",
    "than می‌تواند با گروه اسمی یا بند بیاید؛ ضمیر پس از آن در کاربرد رسمی ممکن است فاعلی یا مفعولی تحلیل شود.",
    "taller than me; taller than I am",
    "برای رفع ابهام، بند کامل را حفظ کن."
  ],
  [
    "but-as-preposition-conjunction",
    "but می‌تواند conjunction یا preposition به معنی except باشد.",
    "Everyone but John agreed.",
    "ساختار بعد از but و نقش معنایی آن را تشخیص بده."
  ],
  [
    "except-for",
    "except و except for استثنا را معرفی می‌کنند؛ انتخاب به ساختار و جایگاه وابسته است.",
    "All attended except John. / Except for John, all attended.",
    "عبارت آغازین except for می‌تواند کل گزاره را محدود کند."
  ],
  [
    "including-such-as",
    "including و such as نمونه معرفی می‌کنند اما از نظر دامنهٔ مجموعه یکسان نیستند.",
    "Several sectors, including banking, grew.",
    "فهرست مثال‌ها نباید به‌اشتباه exhaustive تلقی شود."
  ],
  [
    "respectively-ellipsis",
    "در متن آماری، حذف فعل و اسم تکراری با respectively ممکن است اما باید تناظر بی‌ابهام باشد.",
    "A rose 2%, B 3%.",
    "در نوشتار تخصصی جملهٔ کامل گاهی وضوح بیشتری دارد."
  ],
  [
    "number-agreement-percentages",
    "توافق درصد و کسر با اسم پس از of یا با مقدار به‌عنوان یک کل تغییر می‌کند.",
    "A large percentage of firms are...; 50% is a majority.",
    "نوع اسم و اینکه درصد به‌عنوان مقدار واحد دیده شود تعیین‌کننده است."
  ],
  [
    "fractions-agreement",
    "کسرها با اسم پس از of هماهنگ می‌شوند یا به‌عنوان یک مقدار واحد مفرد می‌آیند.",
    "Two-thirds of the shares were sold. / Two-thirds is enough.",
    "درصد/کسر در نقش مقدار کلی می‌تواند مفرد باشد."
  ],
  [
    "none-of-mass-count",
    "none of با اسم غیرقابل‌شمارش معمولاً فعل مفرد می‌گیرد؛ با جمع شمارش‌پذیر توافق متغیر است.",
    "None of the funding is available. / None of the funds are available.",
    "در آزمون رسمی، توافق مفرد با none گزینهٔ سنتی و امن است."
  ],
  [
    "data-agreement-register",
    "data از نظر تاریخی جمع datum است، اما در کاربرد عمومی امروز اغلب اسم mass مفردگونه است.",
    "The data are compelling. / The data is compelling.",
    "در نوشتار علمی، سیاست مجله/سبک‌نامه را رعایت کن."
  ],
  [
    "media-agreement",
    "media در کاربرد سنتی جمع medium است، اما به‌عنوان حوزه/صنعت می‌تواند جمع‌نما یا mass تلقی شود.",
    "The media are reporting... / social media is...",
    "توافق به معنی و کاربرد lexicalized وابسته است."
  ],
  [
    "company-agreement",
    "نام شرکت/سازمان از نظر دستوری مفرد است؛ ضمیر آن با نگاه به نهاد یا اعضا تغییر می‌کند.",
    "The company has announced its results.",
    "در BrE ممکن است جمع برای اعضای سازمان استفاده شود."
  ],
  [
    "government-agreement",
    "government می‌تواند نهاد واحد یا اعضای آن را برجسته کند و توافق مفرد/جمع بگیرد.",
    "The government has/have announced...",
    "BrE جمع را بیشتر می‌پذیرد؛ AmE معمولاً مفرد را ترجیح می‌دهد."
  ],
  [
    "police-agreement",
    "police اسم جمع‌نماست و معمولاً فعل جمع می‌گیرد؛ a police officer مفرد است.",
    "The police are investigating.",
    "برای یک نهاد/سازمان باید police force را به‌کار برد."
  ],
  [
    "people-persons",
    "people جمع معمول person و persons رسمی/حقوقی یا شمارش افراد مشخص است.",
    "Many people attended. / ten persons were detained.",
    "peoples جمعِ قوم‌ها/ملت‌هاست."
  ],
  [
    "fish-fishes",
    "fish معمولاً جمع fish است؛ fishes برای گونه‌های مختلف یا کاربرد تخصصی می‌آید.",
    "Three fish; many fishes of the reef",
    "صورت جمع به معنی و register وابسته است."
  ],
  [
    "species-series",
    "species و series در مفرد و جمع هم‌شکل‌اند و فعل از مرجع تعیین می‌شود.",
    "This species is rare. / These species are rare.",
    "تعیین‌گر و فعل برای شمارش ضروری‌اند."
  ],
  [
    "means-means",
    "means می‌تواند اسم مفرد یا جمع باشد و صورت نوشتاری یکسان دارد.",
    "A means of payment; several means of payment",
    "فعل و تعیین‌گر شمار را مشخص می‌کنند."
  ],
  [
    "headquarters-works",
    "برخی اسم‌های پایان‌یافته به -s مفرد یا جمع‌اند: headquarters, economics, athletics.",
    "The headquarters is in Berlin. / The works are closed.",
    "معنی سازمان/مکان و رشتهٔ علمی را از شمار دستوری جدا کن."
  ],
  [
    "news-singular",
    "news با وجود -s اسم غیرقابل‌شمارش مفرد است.",
    "The news is encouraging.",
    "a news نادرست است؛ a piece of news ممکن است."
  ],
  [
    "series-plural",
    "series هم مفرد و هم جمع است و article/verb آن را مشخص می‌کند.",
    "A series of events has occurred. / Two series have...",
    "هستهٔ گروه اسمی و توافق نزدیک‌ترین اسم را اشتباه نگیر."
  ],
  [
    "compound-adjective-number",
    "در صفت مرکب اندازه/مدت پیش از اسم، واحد معمولاً مفرد می‌ماند.",
    "a five-year plan; a ten-dollar fee",
    "در گروه اسمی مستقل جمع می‌آید: five years, ten dollars."
  ],
  [
    "measurement-noun-adjective",
    "واحدهای اندازه‌گیری وقتی صفت مرکب می‌سازند مفرد می‌مانند، اما در گزارهٔ اندازه‌گیری جمع می‌شوند.",
    "a six-mile road; the road is six miles long",
    "hyphenation به جایگاه و سبک‌نامه وابسته است."
  ],
  [
    "ordinal-articles",
    "ترتیبی‌ها معمولاً the می‌گیرند اما possessive و determinerهای دیگر می‌توانند جای آن بیایند.",
    "the first attempt; my first attempt",
    "first/last/next در کاربرد زمانی گاهی بدون the می‌آیند."
  ],
  [
    "last-next-article",
    "last و next در ارجاع زمانیِ نسبی اغلب بدون article می‌آیند؛ در ارجاع مشخص article ممکن است.",
    "last week; the last week of June",
    "معنی «قبلی/آینده» با «آخرین/پایانی» را جدا کن."
  ],
  [
    "one-another-of",
    "one of + plural noun با فعل مفرد می‌آید؛ یکی از مجموعه را انتخاب می‌کند.",
    "One of the reports is missing.",
    "one of us/them و one of the few... ساختارهای توسعه‌یافته‌اند."
  ],
  [
    "every-one-of-agreement",
    "every one of + plural determiner/pronoun فعل مفرد می‌گیرد.",
    "Every one of the candidates has arrived.",
    "every one دو واژه است؛ everyone ضمیر مفرد با معنی همهٔ افراد."
  ],
  [
    "everyone-every-one",
    "everyone ضمیر به معنی همه و every one تأکید بر تک‌تک اعضای مجموعه دارد.",
    "Everyone is ready. / Every one of them is ready.",
    "ضمیر مالکیتی singular they در انگلیسی امروز طبیعی است."
  ],
  [
    "each-other-possessive",
    "مالکیت متقابل با each other's و one another's ساخته می‌شود.",
    "They checked each other's work.",
    "apostrophe جایگاه مالکیت را نشان می‌دهد؛ each others بدون apostrophe نادرست است."
  ],
  [
    "one-another-distance",
    "one another و each other در انگلیسی معاصر اغلب قابل جایگزینی‌اند؛ تمایز دو/چند نفر سخت‌گیرانه نیست.",
    "The teams respect one another.",
    "برخی سبک‌های سنتی each other را برای دو و one another را برای بیش از دو ترجیح می‌دادند."
  ],
  [
    "both-of-determiner",
    "both + determiner + plural noun یا both of + pronoun/determiner می‌آید.",
    "both the reports; both of them",
    "both the reports و both of the reports هر دو درست‌اند."
  ],
  [
    "all-of-zero-article",
    "all (of) با گروه اسمی می‌تواند of را حذف کند؛ با ضمیر معمولاً of لازم است.",
    "all the evidence; all of it",
    "all of the evidence نیز درست است؛ تفاوت سبکی/تأکیدی دارد."
  ],
  [
    "half-of-determiner",
    "half (of) پیش از گروه اسمی می‌آید؛ of پیش از ضمیر لازم است.",
    "half the money; half of it",
    "a half of به معنی یک نیمهٔ مشخص در ساختارهای دیگر ممکن است."
  ],
  [
    "double-determiner-error",
    "دو central determiner مانند the و my معمولاً نمی‌توانند مستقیم کنار هم بیایند.",
    "my car, not the my car",
    "predeterminers مانند all و both می‌توانند پیش از central determiner بیایند."
  ],
  [
    "predeterminer-quantifier",
    "all, both, half و such در جایگاه predeterminer می‌توانند پیش از central determiner قرار گیرند.",
    "all my friends; both these options",
    "ترتیب و هم‌نشینی همهٔ predeterminerها آزاد نیست."
  ],
  [
    "postdeterminer-numeral",
    "اعداد و ordinalها اغلب پس از central determiner می‌آیند.",
    "the first three chapters; my next two meetings",
    "ترتیب دقیق با quantifierها و صفت‌ها محدود می‌شود."
  ],
  [
    "such-a-an-order",
    "such پیش از a/an و صفت می‌آید: such + a/an + adjective + singular noun.",
    "such an important issue",
    "so + adjective + a/an + noun الگوی متفاوت و رسمی‌تر است."
  ],
  [
    "what-a-an-exclamative",
    "what در تعجبی با اسم شمارش‌پذیر مفرد به شکل what a/an می‌آید.",
    "What an extraordinary result!",
    "با اسم جمع و غیرقابل‌شمارش article نمی‌آید: What beautiful weather!"
  ],
  [
    "quite-rather-pretty",
    "quite, rather, pretty و fairly درجه و نگرش را تنظیم می‌کنند و معنی آن‌ها با نوع صفت و جایگاه تغییر می‌کند.",
    "quite good; quite impossible; rather unusual",
    "quite با صفت درجه‌پذیر می‌تواند متوسط تا زیاد و با صفت مطلق نزدیک به کامل باشد."
  ],
  [
    "rather-than-noun-verb",
    "rather than می‌تواند حرف ربط/حرف اضافه‌مانند باشد و انتخاب شکل فعل به ساختار موازی وابسته است.",
    "Rather than complain, she acted.",
    "در جمله‌های پیچیده بهتر است اجزای موازی از نظر شکل یکسان باشند."
  ],
  [
    "as-well-as-agreement",
    "فاعل اصلی پیش از as well as تعیین‌کنندهٔ فعل است؛ عبارت افزوده‌شده معمولاً توافق را تغییر نمی‌دهد.",
    "The CEO, as well as the directors, is attending.",
    "این ساختار با and تفاوت دارد؛ and معمولاً فاعل مرکب جمع می‌سازد."
  ],
  [
    "together-with-agreement",
    "عبارت‌های همراهی مانند together with, along with و in addition to فعل را با فاعل اصلی هماهنگ می‌کنند.",
    "The minister, along with advisers, is travelling.",
    "نزدیکی اسم جمع نباید باعث خطای توافق شود."
  ],
  [
    "including-agreement",
    "عبارت including و such as معمولاً جزئی از فاعل را معرفی می‌کنند و هستهٔ فاعل را عوض نمی‌کنند.",
    "Several countries, including Germany, have signed.",
    "فاعل اصلی را پیدا کن و با آن فعل را هماهنگ کن."
  ],
  [
    "appositive-agreement",
    "عبارت appositive معمولاً در توافق فعل نقشی ندارد؛ هستهٔ اصلی گروه اسمی تعیین‌کننده است.",
    "The founder of the firms is speaking.",
    "نزدیکی firms نباید فعل را جمع کند."
  ],
  [
    "not-only-but-also-agreement",
    "در not only...but also، فعل با هستهٔ فاعل هماهنگ می‌شود؛ گاهی proximity در ساختارهای وارونه اثر دارد.",
    "Not only the CEO but also the directors are attending.",
    "بازنویسی برای جلوگیری از اختلاف توافق مفید است."
  ],
  [
    "either-or-agreement",
    "در either...or و neither...nor، در بسیاری از راهنماها فعل با نزدیک‌ترین فاعل هماهنگ می‌شود.",
    "Either the directors or the CEO is attending.",
    "برای نثر رسمی، نزدیک‌ترین جزء و بازنویسی را با دقت انتخاب کن."
  ],
  [
    "each-every-compound",
    "each/every پیش از اسم‌های هماهنگ‌شده می‌تواند برداشت مفرد توزیعی بسازد.",
    "Every boy and girl was given a badge.",
    "اگر چند واحد جداگانه مدنظر است، ساختار جمله را بازنویسی کن."
  ],
  [
    "number-of-plural-head",
    "در the number of، head واژهٔ number است؛ در a number of، عبارت کمیتی معنی جمع می‌دهد.",
    "The number of errors is small. / A number of errors are minor.",
    "این تفاوت یکی از دام‌های رایج آزمون‌های پیشرفته است."
  ],
  [
    "more-than-one-agreement",
    "more than one + singular noun معمولاً فعل مفرد می‌گیرد؛ many a نیز مفرد است.",
    "More than one investor has complained.",
    "از نظر معنی چند نفرند اما توافق دستوری مفرد است."
  ],
  [
    "many-a-agreement",
    "many a + singular noun با فعل مفرد می‌آید و سبک رسمی/ادبی دارد.",
    "Many a company has failed.",
    "many companies با فعل جمع می‌آید."
  ],
  [
    "a-great-deal-of-agreement",
    "a great deal of + mass noun معمولاً فعل مفرد می‌گیرد؛ a great many + plural noun فعل جمع می‌گیرد.",
    "A great deal of money is needed. / A great many firms are affected.",
    "اسم پس از of را از نظر شمارش‌پذیری بررسی کن."
  ],
  [
    "plenty-of-agreement",
    "plenty of با اسم شمارش‌پذیر جمع یا mass می‌آید و فعل با اسم بعد از of هماهنگ می‌شود.",
    "Plenty of opportunities are available. / Plenty of time is left.",
    "plenty of در نقش قید/تأکید نیز ممکن است."
  ],
  [
    "a-lot-of-agreement",
    "a lot of با اسم جمع فعل جمع و با اسم mass فعل مفرد می‌گیرد.",
    "A lot of people are waiting. / A lot of work is pending.",
    "lots of نیز همین الگو را دارد."
  ],
  [
    "the-majority-of-agreement",
    "the majority of معمولاً با اسم پس از of توافق می‌کند؛ majority به‌عنوان گروه واحد مفرد می‌شود.",
    "The majority of voters are young. / The majority is clear.",
    "سبک و معنای جمعیت در برابر نهاد واحد مهم است."
  ],
  [
    "a-majority-of-agreement",
    "a majority of + plural noun اغلب فعل جمع می‌گیرد؛ a majority به‌عنوان اکثریت واحد مفرد می‌شود.",
    "A majority of members have voted.",
    "توافق معنایی/دستوری به بافت بستگی دارد."
  ],
  [
    "all-of-agreement",
    "all of با mass noun فعل مفرد و با plural count noun فعل جمع می‌گیرد.",
    "All of the water is gone. / All of the files are gone.",
    "all به‌عنوان کل مقدار واحد می‌تواند مفرد باشد."
  ],
  [
    "some-of-agreement",
    "some of با mass noun مفرد و با plural count noun جمع می‌گیرد.",
    "Some of the evidence is weak. / Some of the claims are false.",
    "some به‌عنوان ضمیر مستقل نیز ممکن است."
  ],
  [
    "most-of-agreement",
    "most of با اسم بعد از of هماهنگ می‌شود؛ most people فعل جمع و most money مفرد می‌گیرد.",
    "Most of the population is urban. / Most of the people are here.",
    "population می‌تواند به‌عنوان جمعیت واحد یا اعضا تفسیر شود."
  ],
  [
    "none-singular-plural-usage",
    "none از نظر تاریخی not one است اما در کاربرد جمع با plural noun بسیار رایج است.",
    "None of the proposals are acceptable.",
    "در متن رسمی و آزمون، توافق مفرد ممکن است ترجیح داده شود؛ plural امروز معتبر است."
  ],
  [
    "collective-singular-plural-meaning",
    "اسم جمعی می‌تواند واحد یا اعضای تشکیل‌دهنده را برجسته کند.",
    "The family is large. / The family are arguing.",
    "BrE این توافق معنایی را بیشتر می‌پذیرد؛ AmE معمولاً مفرد."
  ],
  [
    "committee-team-band",
    "committee, team, band و government می‌توانند بسته به گونه و معنی مفرد/جمع باشند.",
    "The team is winning. / The team are changing shirts.",
    "برای یکدستی متن، یک سیاست توافق انتخاب کن."
  ],
  [
    "audience-public-staff",
    "audience, public و staff بسته به معنی و گونه توافق جمعی/مفرد می‌گیرند.",
    "The audience was silent. / The staff are helpful.",
    "staff در انگلیسی آمریکایی می‌تواند به‌صورت collective singular هم بیاید."
  ],
  [
    "police-cattle-people",
    "police, cattle و people معمولاً جمع دستوری‌اند و a/an مستقیم نمی‌گیرند.",
    "The police are here. / Cattle are grazing.",
    "a police officer و a person مفردهای واژگانی‌اند."
  ],
  [
    "mathematics-economics",
    "نام رشته‌ها با -s اغلب مفردند، اما برخی نام‌ها به معنی فعالیت/آمار جمع می‌گیرند.",
    "Economics is complex. / The statistics are alarming.",
    "statistics به معنی رشته مفرد و به معنی داده‌ها جمع است."
  ],
  [
    "means-singular-plural",
    "means می‌تواند مفرد و جمع هم‌شکل باشد؛ determiner و فعل شمار را مشخص می‌کند.",
    "A means is available. / Several means are available.",
    "means of communication یک ترکیب رایج است."
  ],
  [
    "series-singular-plural",
    "series و species در مفرد و جمع هم‌صورت‌اند؛ فعل و تعیین‌گر شمار را روشن می‌کند.",
    "One series is missing. / Two series are missing.",
    "s پایانی به‌تنهایی نشانهٔ جمع نیست."
  ],
  [
    "pluralia-tantum",
    "pluralia tantum اسم‌هایی‌اند که معمولاً فقط شکل جمع دارند، مانند trousers و scissors.",
    "These scissors are sharp.",
    "a pair of برای یک واحد به‌کار می‌رود: a pair of scissors is..."
  ],
  [
    "singularia-tantum",
    "singularia tantum معمولاً شکل مفرد دارند، مانند furniture و information؛ برای شمارش واحد از piece/item استفاده می‌شود.",
    "Two pieces of information were added.",
    "کاربردهای تخصصی/معنایی ممکن است شمارش‌پذیری را تغییر دهند."
  ],
  [
    "mass-noun-reclassification",
    "اسم mass با تغییر معنی می‌تواند count شود؛ نوع، ظرف یا رخداد را نشان می‌دهد.",
    "two coffees; several cheeses; a good knowledge",
    "این تغییر معنی واژگانی است و برای همهٔ mass nouns مجاز نیست."
  ],
  [
    "zero-plural-animals",
    "برخی اسم حیوانات جمع بی‌تغییر دارند، به‌ویژه در شکار/دامداری یا واحدهای شمارشی.",
    "ten sheep; three deer; two fish",
    "fishes برای گونه‌ها و fish برای تعداد معمول رایج است."
  ],
  [
    "foreign-plurals",
    "برخی واژه‌های لاتین/یونانی جمع سنتی دارند، اما صورت‌های انگلیسی‌شده نیز پذیرفته‌اند.",
    "criteria/criterions (rare); indexes/indices",
    "انتخاب به حوزه و register بستگی دارد؛ صورت‌های معیار را با فرهنگ بررسی کن."
  ],
  [
    "criterion-phenomenon",
    "criterion/criteria و phenomenon/phenomena در انگلیسی رسمی صورت مفرد و جمع متمایز دارند.",
    "One criterion; several criteria.",
    "استفاده از criteria به‌عنوان مفرد در گفتار غیررسمی شنیده می‌شود اما در نوشتار رسمی پرهیز شود."
  ],
  [
    "datum-data",
    "datum مفرد سنتی و data جمع سنتی است؛ data در انگلیسی امروز اغلب mass noun است.",
    "The data are robust. / The data is useful.",
    "در متن علمی از سیاست نشریه پیروی کن."
  ],
  [
    "medium-media",
    "medium مفرد و media جمع سنتی است؛ media همچنین می‌تواند به صنعت رسانه اشاره کند.",
    "A medium; several media; social media.",
    "معنی و توافق به کاربرد تخصصی/عمومی وابسته است."
  ],
  [
    "index-indices",
    "indexes و indices هر دو جمع index هستند؛ indices در ریاضی/مالی تخصصی‌تر است.",
    "stock-market indices; book indexes",
    "در کاربرد عمومی indexes نیز کاملاً معیار است."
  ],
  [
    "appendix-appendices",
    "appendixes و appendices هر دو جمع appendix هستند؛ دومی رسمی‌تر/لاتینی‌تر است.",
    "The appendices contain tables.",
    "در سبک‌نامه‌ها ممکن است یک صورت ترجیح داده شود."
  ],
  [
    "formula-formulae",
    "formulas و formulae هر دو جمع formula هستند؛ کاربرد علمی و عمومی متفاوت است.",
    "mathematical formulae; chemical formulas",
    "صورت انگلیسی‌شده formulas در کاربرد عمومی بسیار رایج است."
  ],
  [
    "focus-foci",
    "focuses و foci هر دو جمع focus هستند؛ foci در علوم/ریاضی رایج‌تر است.",
    "The study has two main focuses.",
    "صورت لاتینی foci ممکن است در کاربرد عمومی نامأنوس باشد."
  ],
  [
    "syllabus-syllabi",
    "syllabuses و syllabi هر دو جمع syllabus هستند.",
    "course syllabuses; university syllabi",
    "صورت انگلیسی‌شده معمولاً طبیعی و پذیرفته است."
  ],
  [
    "cactus-cacti",
    "cactuses و cacti هر دو جمع cactus هستند.",
    "Several cacti grow there.",
    "انتخاب به register و مخاطب وابسته است."
  ],
  [
    "octopus-octopuses",
    "octopuses جمع معیار انگلیسی octopus است؛ octopi بر اساس لاتینی‌سازی نادرست/بحث‌برانگیز است.",
    "Three octopuses were observed.",
    "در نوشتار دقیق octopuses را ترجیح بده."
  ],
  [
    "agenda-singular-plural-history",
    "agenda از نظر ریشه جمع agendum است اما در انگلیسی مدرن معمولاً اسم مفرد است و agendas جمع می‌شود.",
    "The agenda is ready. / The agendas are ready.",
    "ریشه‌شناسی لاتین را به دستور انگلیسی امروز تعمیم نده."
  ],
  [
    "criteria-agreement",
    "criteria در نوشتار رسمی جمع است و با فعل جمع می‌آید؛ criterion مفرد است.",
    "The criteria are strict.",
    "در گفتار معیارهای جدید ممکن است criteria مفردگونه شنیده شود، اما در متن تخصصی از آن پرهیز کن."
  ],
  [
    "media-agreement-specialized",
    "media در معناهای مختلف می‌تواند جمعِ medium یا اسم جمعی/صنعت باشد.",
    "The media are covering it. / Social media is influential.",
    "سبک‌نامه و معنای مرجع را مشخص کن."
  ],
  [
    "data-as-mass",
    "data در کاربرد عمومی می‌تواند mass noun با فعل مفرد باشد؛ در علوم رسمی جمع سنتی هم حفظ شده است.",
    "The data is stored securely.",
    "در مقالهٔ علمی یکدست‌بودن و راهنمای ناشر مهم است."
  ],
  [
    "none-of-agreement-nuance",
    "none of + plural noun می‌تواند فعل جمع بگیرد؛ با mass noun معمولاً مفرد می‌آید.",
    "None of the analysts are available. / None of the money is left.",
    "توافق جمعی امروز پذیرفته است و نباید همهٔ موارد را به مفرد اصلاح کرد."
  ],
  [
    "each-of-pronoun",
    "each of + object pronoun/determiner + plural noun از نظر فعل مفرد است.",
    "Each of them has a copy.",
    "each + noun نیز فعل مفرد می‌گیرد."
  ],
  [
    "everybody-singular-they",
    "everyone/everybody از نظر فعل مفرد است اما ضمیر ارجاعی می‌تواند singular they باشد.",
    "Everybody has their own view.",
    "فعل با everyone مفرد می‌ماند؛ ضمیر مالکیتی their پذیرفته است."
  ],
  [
    "either-of-variation",
    "either of + plural noun/pronoun در سبک رسمی فعل مفرد می‌گیرد؛ جمع در گفتار رایج است.",
    "Either of the routes is acceptable.",
    "برای آزمون و نثر رسمی مفرد انتخاب مطمئن‌تری است."
  ],
  [
    "neither-of-variation",
    "neither of در انگلیسی رسمی سنتی فعل مفرد می‌گیرد؛ توافق جمع در گفتار دیده می‌شود.",
    "Neither of the answers is correct.",
    "با neither...nor ساختار هماهنگی جداگانه است."
  ],
  [
    "one-of-relative-agreement",
    "در one of the people who..., فعل بند موصولی با people جمع است؛ اما one که head است مفرد می‌گیرد.",
    "She is one of the analysts who work here.",
    "اگر منظور تنها فردی است که ...، ساختار the only one who works... می‌آید."
  ],
  [
    "the-only-one-relative",
    "the only one of + plural noun + who معمولاً فعل مفرد می‌گیرد چون مرجع موصولی one است.",
    "She is the only one of the analysts who works here.",
    "تفاوت معنایی با one of the analysts who work... بسیار مهم است."
  ],
  [
    "as-well-as-not-and",
    "as well as و along with فاعل مرکب جمع نمی‌سازند؛ فعل با فاعل اصلی هماهنگ است.",
    "The chair, as well as members, is present.",
    "این ترکیب‌ها را با and اشتباه نگیر."
  ],
  [
    "together-with-not-and",
    "together with, accompanied by و in addition to گروه همراه‌اند، نه فاعل هم‌پایه.",
    "The report, together with appendices, is ready.",
    "نزدیک‌ترین اسم جمع نباید فعل را تغییر دهد."
  ],
  [
    "either-or-proximity",
    "در either...or و neither...nor، توافق نزدیک‌ترین فاعل در راهنماهای سنتی رایج است؛ بازنویسی ابهام را کم می‌کند.",
    "Neither the manager nor the employees are ready.",
    "اگر اجزا از نظر شمار متفاوت‌اند، نزدیک‌ترین فاعل را طوری انتخاب کن که جمله روان بماند."
  ],
  [
    "not-only-but-also-proximity",
    "در not only...but also توافق می‌تواند به عنصر نزدیک‌تر حساس باشد؛ ساختار موازی ضروری است.",
    "Not only the staff but also the manager is responsible.",
    "در وارونگی آغازین، auxiliary با فاعل بند هماهنگ می‌شود."
  ],
  [
    "there-be-agreement",
    "در existential there، فعل معمولاً با فاعل پس از فعل هماهنگ می‌شود، نه با there.",
    "There are several reasons. / There is one reason.",
    "در گفتار there is + plural رایج است اما در نثر رسمی از آن پرهیز کن."
  ],
  [
    "here-be-agreement",
    "در ساختار here + be، فعل با فاعل پس از آن هماهنگ می‌شود.",
    "Here are the documents.",
    "وارونگی/ترتیب اطلاعاتی را با توافق فعل اشتباه نگیر."
  ],
  [
    "inverted-subject-agreement",
    "پس از قیدهای آغازین و وارونگی، فعل با فاعل واقعی هماهنگ می‌شود؛ فاعل ممکن است بعد از فعل بیاید.",
    "On the wall were three portraits.",
    "فاعل را از مفعول یا مکمل اشتباه نکن."
  ],
  [
    "not-until-inversion-agreement",
    "در وارونگی پس از not until، auxiliary با فاعل بند اصلی هماهنگ می‌شود.",
    "Not until later did the truth emerge.",
    "بند not until خودش ترتیب عادی دارد."
  ],
  [
    "negative-adverb-inversion-agreement",
    "پس از never, rarely, seldom, little و under no circumstances وارونگی رخ می‌دهد و توافق auxiliary مهم است.",
    "Rarely do investors see such volatility.",
    "اگر قید در جایگاه عادی باشد، وارونگی نداریم."
  ],
  [
    "so-such-inversion-agreement",
    "در ساختارهای so/such آغازین، فعل ربطی یا کمکی پیش از فاعل می‌آید.",
    "So complex was the issue that...",
    "در ساختارهای عادی so و such وارونگی اجباری نیست."
  ],
  [
    "fronted-locative-inversion",
    "عبارت مکان در آغاز روایت می‌تواند وارونگی فاعل-فعل ایجاد کند، به‌ویژه با افعال حرکت/وجود.",
    "On the hill stood an old castle.",
    "با ضمیر فاعلی و در نثر محاوره‌ای وارونگی محدودتر است."
  ],
  [
    "quotative-inversion",
    "در روایت و نقل قول، فعل گفتاری می‌تواند پس از نقل قول و پیش از فاعل بیاید.",
    "'I'm ready,' said Maria.",
    "با ضمیر معمولاً ترتیب said she در سبک ادبی ممکن است؛ گفتار عادی she said."
  ],
  [
    "subject-verb-inversion-style",
    "وارونگی می‌تواند اطلاعات تازه را در انتهای جمله قرار دهد و سبک روایی/رسمی بسازد.",
    "Also included are two appendices.",
    "این وارونگی با پرسش‌سازی تفاوت دارد و نیازمند ساختار مناسب است."
  ],
  [
    "auxiliary-contraction-negation",
    "not با auxiliaryها منقبض می‌شود اما شکل‌های منفی و جایگاهشان به نوع فعل وابسته است.",
    "isn't, haven't, won't, can't",
    "amn't در انگلیسی معیار عمومی رایج نیست؛ aren't I? در tag معمول است."
  ],
  [
    "do-not-vs-don't",
    "do not شکل کامل و don't شکل منقبض است؛ تأکید، رسمیت و آهنگ بر انتخاب اثر دارد.",
    "Do not enter. / Don't worry.",
    "در امر رسمی/تابلوها شکل کامل رایج‌تر است."
  ],
  [
    "cannot-vs-can-not",
    "cannot معمولاً یک واژه و can not در ساختارهای تقابلی/تأکیدی خاص می‌آید.",
    "You cannot enter. / You can not only enter but stay.",
    "can't شکل منقبض cannot است."
  ],
  [
    "will-not-wont",
    "won't صورت نامنظمِ انقباض will not است و از قاعدهٔ نوشتاری ساده پیروی نمی‌کند.",
    "The system won't start.",
    "در نقل قول رسمی می‌توان will not را برای تأکید نوشت."
  ],
  [
    "shall-not-shant",
    "shan't صورت بریتانیایی/قدیمی‌تر shall not است و در کاربرد امروز محدود است.",
    "I shan't be late.",
    "در انگلیسی آمریکایی بسیار کم‌کاربرد است؛ shall not رسمی‌تر است."
  ],
  [
    "must-not-vs-dont-have-to",
    "mustn't یعنی ممنوعیت؛ don't have to یعنی نبود الزام.",
    "You mustn't disclose it. / You don't have to attend.",
    "این تفاوت معنایی مهم است و در ترجمهٔ فارسی ممکن است گم شود."
  ],
  [
    "neednt-vs-dont-need-to",
    "needn't و don't need to هر دو نبود ضرورت را می‌رسانند، اما از نظر سبک و صرف متفاوت‌اند.",
    "You needn't wait. / You don't need to wait.",
    "needn't در BrE رایج‌تر است؛ don't need to در هر دو گونه طبیعی است."
  ],
  [
    "cant-vs-mustnt-deduction",
    "can't برای استنتاج منفی و mustn't برای ممنوعیت به‌کار می‌رود.",
    "That can't be true. / You mustn't park here.",
    "mustn't معمولاً به معنی ناممکن بودن نیست."
  ],
  [
    "may-not-ambiguity",
    "may not می‌تواند نبود اجازه یا احتمال منفی را بیان کند؛ بافت باید معنی را روشن کند.",
    "You may not leave. / It may not happen.",
    "برای رفع ابهام از be not allowed to یا might not استفاده کن."
  ],
  [
    "should-ought-to",
    "should و ought to توصیه/انتظار را می‌رسانند؛ ought رسمی‌تر و با to است.",
    "You should review it. / You ought to review it.",
    "should have + participle دربارهٔ گذشته و انتقاد/انتظار برآورده‌نشده است."
  ],
  [
    "had-better",
    "had better + bare infinitive توصیهٔ قوی با پیامد ضمنی است؛ زمان ظاهری had الزاماً گذشته نیست.",
    "You had better leave now.",
    "منفی با had better not ساخته می‌شود؛ در موقعیت رسمی ممکن است تند به نظر برسد."
  ],
  [
    "would-better-error",
    "had better را با would better اشتباه نکن؛ ساختار معیار had better است.",
    "You had better check the figures.",
    "would be better یک ساختار جداست: It would be better to wait."
  ],
  [
    "be-to-infinitive",
    "be to + infinitive برنامهٔ رسمی، دستور، سرنوشت یا توافق را بیان می‌کند.",
    "The president is to visit Berlin.",
    "معنی از بافت خبری/رسمی/دستوری مشخص می‌شود."
  ],
  [
    "be-bound-to",
    "be bound to + infinitive احتمال قوی یا الزام را می‌رساند.",
    "Prices are bound to fluctuate.",
    "bound to می‌تواند به معنی موظف/متعهد بودن نیز باشد."
  ],
  [
    "be-likely-to",
    "be likely to احتمال را بیان می‌کند و می‌تواند با it-extraposition بیاید.",
    "Rates are likely to remain stable. / It is likely that...",
    "likely هم صفت است و هم قید در برخی گونه‌ها."
  ],
  [
    "be-supposed-to",
    "be supposed to انتظار، قاعده یا وظیفهٔ معمول را می‌رساند.",
    "The report is supposed to arrive today.",
    "در گفتار می‌تواند انتقاد از انجام‌نشدن وظیفه را القا کند."
  ],
  [
    "be-meant-to",
    "be meant to قصد/کارکرد یا انتظار را بیان می‌کند.",
    "This tool is meant to help analysts.",
    "معنی intended و expected را از بافت جدا کن."
  ],
  [
    "be-about-to",
    "be about to + infinitive آیندهٔ بسیار نزدیک را نشان می‌دهد.",
    "The meeting is about to begin.",
    "معمولاً با قید زمانی دور مثل next year ناسازگار است."
  ],
  [
    "be-due-to",
    "be due to + infinitive زمان‌بندی/انتظار رویداد را نشان می‌دهد؛ due to + noun phrase علت هم می‌دهد.",
    "The train is due to arrive. / Delay due to snow.",
    "دو ساختار هم‌شکل اما از نظر نحوی و معنایی متفاوت‌اند."
  ],
  [
    "be-set-to",
    "be set to + infinitive رویداد مورد انتظار/برنامه‌ریزی‌شده را در خبر بیان می‌کند.",
    "The bank is set to announce a decision.",
    "register خبری است و قطعیت آن به منبع بستگی دارد."
  ],
  [
    "be-poised-to",
    "be poised to + infinitive آمادگی/آستانهٔ اقدام را می‌رساند.",
    "The company is poised to expand.",
    "واژهٔ poised لحن خبری/تحلیلی دارد و لزوماً وقوع قطعی نیست."
  ],
  [
    "be-on-the-verge-of",
    "be on the verge of + noun/gerund رویداد قریب‌الوقوع را بیان می‌کند.",
    "The firm is on the verge of collapse.",
    "پس از of اسم یا gerund می‌آید."
  ],
  [
    "be-in-the-process-of",
    "be in the process of + gerund بر روند جاری تأکید دارد.",
    "The agency is in the process of reviewing bids.",
    "با to-infinitive نمی‌آید."
  ],
  [
    "be-worth-gerund",
    "worth معمولاً صفت است و پس از آن gerund می‌آید؛ worth to do در این معنی معیار نیست.",
    "The report is worth reading.",
    "worthy of + gerund/noun ساختار دیگری است."
  ],
  [
    "worthwhile-infinitive-gerund",
    "worthwhile می‌تواند با gerund یا مصدر با to بیاید.",
    "It is worthwhile checking/to check.",
    "سبک و ساختار جمله بر انتخاب اثر می‌گذارد."
  ],
  [
    "busy-gerund",
    "busy + gerund برای بیان فعالیتی که فرد مشغول آن است می‌آید.",
    "She is busy preparing the report.",
    "busy to do در این معنی معمولاً طبیعی نیست."
  ],
  [
    "cannot-help-gerund",
    "cannot help + gerund یعنی نتوانستن از انجام/احساس چیزی خودداری کرد.",
    "I couldn't help laughing.",
    "cannot help but + bare infinitive نیز پذیرفته است."
  ],
  [
    "feel-like-gerund",
    "feel like + gerund یا noun برای بیان میل به چیزی می‌آید.",
    "I feel like taking a break.",
    "feel like به معنی به نظر رسیدن در ساختارهای دیگر می‌آید."
  ],
  [
    "would-you-mind-gerund",
    "would you mind + gerund برای درخواست مؤدبانه است؛ پاسخ منفی معمولاً موافقت می‌رساند.",
    "Would you mind opening the window?",
    "Would you mind if I opened...? ساختار شرطی متفاوتی دارد."
  ],
  [
    "object-to-gerund",
    "object to, look forward to, be accustomed to و be committed to حرف اضافهٔ to دارند و gerund می‌گیرند.",
    "We object to paying extra.",
    "to همیشه نشانگر مصدر نیست؛ نقش نحوی را بررسی کن."
  ],
  [
    "used-to-gerund-contrast",
    "used to + bare infinitive عادت گذشته؛ be/get used to + noun/gerund عادت داشتن/کردن.",
    "I used to work nights. / I'm used to working nights.",
    "صورت‌ها از نظر زمان و معنی کاملاً متفاوت‌اند."
  ],
  [
    "prefer-would-rather",
    "prefer + gerund/to-infinitive برای ترجیح کلی و would rather + bare infinitive برای موقعیت مشخص است.",
    "I prefer walking. / I'd rather walk now.",
    "would rather + subject + past برای ترجیح دربارهٔ دیگری می‌آید."
  ],
  [
    "like-love-hate-gerund-infinitive",
    "like/love/hate + gerund یا infinitive هر دو ممکن‌اند؛ تفاوت عادت/تجربه و انتخاب در برخی بافت‌ها ظریف است.",
    "I like swimming. / I like to swim before work.",
    "در بسیاری از کاربردها تفاوت معنایی اندک است و گونه/بافت اثر دارد."
  ],
  [
    "begin-start-gerund-infinitive",
    "begin/start با gerund و infinitive هر دو می‌آیند؛ با افعال حالتی یا ساختار استمراری مصدر طبیعی‌تر است.",
    "It began raining. / It began to rain.",
    "در ساختارهای تکراری/سنگین ممکن است یکی ترجیح داده شود."
  ],
  [
    "continue-gerund-infinitive",
    "continue با gerund و infinitive اغلب معنی مشابه دارد.",
    "She continued working/to work.",
    "مکمل‌های دیگر و register ممکن است انتخاب را تغییر دهند."
  ],
  [
    "advise-recommend-gerund-object",
    "advise/recommend + gerund یا that-clause می‌گیرند؛ با شخص مفعول، advise someone to do ممکن است.",
    "They recommend reducing costs. / They advised us to wait.",
    "recommend someone to do در برخی گونه‌ها/معانی محدود است؛ recommend that he wait معیارتر است."
  ],
  [
    "suggest-gerund-that",
    "suggest + gerund یا that-clause می‌گیرد؛ suggest someone to do در انگلیسی معیار معمولاً درست نیست.",
    "She suggested waiting. / She suggested that we wait.",
    "برای پیشنهاد به شخص بگو suggest that someone do یا suggest doing."
  ],
  [
    "propose-gerund-infinitive",
    "propose + gerund یا that-clause رایج است؛ propose to do می‌تواند قصد شخصی را برساند.",
    "They proposed reducing taxes. / He proposed to resign.",
    "معنی propose a plan و propose to do متفاوت است."
  ],
  [
    "allow-permit-pattern",
    "allow/permit + object + to-infinitive یا gerund بدون مفعول می‌گیرند.",
    "They allowed us to enter. / They don't allow smoking.",
    "الگوی object را حذف نکن."
  ],
  [
    "forbid-pattern",
    "forbid + object + to-infinitive یا forbid + gerund ممکن است.",
    "They forbade visitors to take photos. / Smoking is forbidden.",
    "ساختار مجهول و register بر انتخاب اثر دارند."
  ],
  [
    "prevent-stop-from",
    "prevent/stop + object + from + gerund برای جلوگیری از عمل می‌آید.",
    "The law prevents firms from colluding.",
    "from در این الگو معمولاً لازم است."
  ],
  [
    "discourage-from",
    "discourage + object + from + gerund برای منصرف کردن به‌کار می‌رود.",
    "The regulator discouraged banks from lending recklessly.",
    "discourage someone to do در این معنی معیار نیست."
  ],
  [
    "accuse-of-gerund",
    "accuse someone of + gerund/noun ساختار اتهام است.",
    "They accused the firm of hiding losses.",
    "of را حذف نکن؛ passive: be accused of doing."
  ],
  [
    "charge-with-gerund",
    "charge someone with + noun/gerund برای اتهام رسمی می‌آید.",
    "The executive was charged with fraud.",
    "charge with و charge for معنی‌های متفاوت دارند."
  ],
  [
    "congratulate-on-gerund",
    "congratulate someone on + noun/gerund برای تبریک می‌آید.",
    "They congratulated her on winning the award.",
    "on حرف اضافه است و پس از آن gerund می‌آید."
  ],
  [
    "thank-for-gerund",
    "thank someone for + noun/gerund علت تشکر را معرفی می‌کند.",
    "Thank you for helping us.",
    "for حرف اضافه است؛ مصدر با to در این ساختار نمی‌آید."
  ],
  [
    "blame-for-on",
    "blame someone for an action و blame something on someone دو الگوی معنایی متفاوت‌اند.",
    "They blamed him for the delay. / blamed the delay on him.",
    "ترتیب مفعول‌ها معنی مسئولیت را تغییر می‌دهد."
  ],
  [
    "accustomed-to-gerund",
    "be accustomed to + noun/gerund یعنی عادت‌کرده؛ get accustomed to روند عادت را بیان می‌کند.",
    "They are accustomed to working under pressure.",
    "to حرف اضافه است، نه مصدرساز."
  ],
  [
    "capable-of-gerund",
    "capable of + gerund/noun توانایی را بیان می‌کند.",
    "The system is capable of detecting anomalies.",
    "پس از of مصدر با to نمی‌آید."
  ],
  [
    "responsible-for-gerund",
    "responsible for + noun/gerund مسئولیت یا علت را بیان می‌کند.",
    "The team is responsible for updating the data.",
    "معنی پاسخ‌گو بودن و علت بودن را از بافت تفکیک کن."
  ],
  [
    "insist-on-gerund",
    "insist on + gerund/noun یعنی پافشاری بر عمل؛ insist that + subjunctive یعنی اصرار بر اینکه.",
    "They insisted on reviewing the data. / insisted that he be present.",
    "insist that می‌تواند معنی ادعای واقعیت هم داشته باشد و همیشه subjunctive نیست."
  ],
  [
    "succeed-in-gerund",
    "succeed in + gerund برای موفق شدن در انجام کار است.",
    "They succeeded in reducing costs.",
    "in حرف اضافه است؛ succeed to a position معنی دیگری دارد."
  ],
  [
    "fail-to-infinitive",
    "fail + to-infinitive یعنی موفق نشدن/انجام ندادن.",
    "The firm failed to disclose the risk.",
    "fail + noun می‌تواند معنی شکست در کاری داشته باشد."
  ],
  [
    "manage-to-infinitive",
    "manage + to-infinitive برای موفق شدن با دشواری به‌کار می‌رود.",
    "They managed to reach an agreement.",
    "manage doing در معنی موفق شدن در انجام کار معمولاً معیار نیست."
  ],
  [
    "afford-to-infinitive",
    "afford + to-infinitive برای توان مالی/امکانی به‌کار می‌رود.",
    "The company cannot afford to delay.",
    "can afford + noun نیز ممکن است."
  ],
  [
    "hesitate-to-infinitive",
    "hesitate + to-infinitive برای تردید در انجام عمل است.",
    "Do not hesitate to contact us.",
    "hesitate about + gerund/noun نیز ممکن است."
  ],
  [
    "threaten-to-infinitive",
    "threaten + to-infinitive یا threaten that-clause برای تهدید به عمل است.",
    "The firm threatened to sue.",
    "threaten someone with something الگوی دیگری است."
  ],
  [
    "tend-to-infinitive",
    "tend + to-infinitive گرایش/تمایل عمومی را نشان می‌دهد.",
    "Prices tend to rise in summer.",
    "tend toward(s) + noun معنی گرایش به سمت دارد."
  ],
  [
    "appear-seem-infinitive",
    "seem/appear + to-infinitive و it seems that برای استنتاج/ظاهر بودن است.",
    "The figures seem to indicate recovery.",
    "perfect infinitive تقدم زمانی را نشان می‌دهد: seems to have fallen."
  ],
  [
    "happen-to-infinitive",
    "happen + to-infinitive می‌تواند تصادفی/اتفاقی بودن را بیان کند.",
    "I happened to meet the analyst.",
    "happen to be/do در ساختارهای مختلف معنی دارد."
  ],
  [
    "pretend-to-infinitive",
    "pretend + to-infinitive یا that-clause برای وانمود کردن است.",
    "He pretended to understand.",
    "pretend doing در این معنی معمولاً معیار نیست."
  ],
  [
    "claim-to-infinitive",
    "claim + to-infinitive یا that-clause برای ادعاست.",
    "The firm claims to have complied.",
    "perfect infinitive ادعای عمل پیشین را نشان می‌دهد."
  ],
  [
    "prove-to-infinitive",
    "prove + to-infinitive برای نتیجه/آشکار شدن به‌کار می‌رود.",
    "The forecast proved to be inaccurate.",
    "prove + adjective/noun نیز ممکن است: proved useful."
  ],
  [
    "turn-out-to-infinitive",
    "turn out + to-infinitive برای نتیجهٔ نهایی/کشف‌شده است.",
    "The rumour turned out to be false.",
    "turn out that-clause نیز ممکن است."
  ],
  [
    "happen-that-clause",
    "it happens that برای بیان اتفاق/واقعیت غیرمنتظره می‌آید.",
    "It happens that we have the same data.",
    "happen to + infinitive ساختار دیگری است."
  ],
  [
    "as-though-perfect",
    "as if/as though + past perfect برای مقایسه با وضعیت خلاف واقع گذشته به‌کار می‌رود.",
    "He looked as though he had seen a ghost.",
    "اگر برداشت واقعی باشد، past simple/present perfect نیز ممکن است."
  ],
  [
    "would-have-condition",
    "would have + past participle نتیجهٔ فرضیِ گذشته را می‌سازد؛ در if-clause معمولاً past perfect می‌آید.",
    "If we had waited, we would have succeeded.",
    "would در if-clause استاندارد معمولاً نمی‌آید، جز کاربردهای مودبانه/ارادی خاص."
  ],
  [
    "should-in-if-clause",
    "should در if-clause رسمی می‌تواند احتمال کم/شرط محتاطانه را نشان دهد.",
    "If you should need help, call us.",
    "در این ساختار should وارونگی if حذف‌شده نیز ممکن است: Should you need..."
  ],
  [
    "were-to-condition",
    "were to + infinitive شرط فرضی/دور را می‌سازد و رسمی است.",
    "If the system were to fail, backups would activate.",
    "با فاعل مفرد و جمع صورت were حفظ می‌شود."
  ],
  [
    "if-it-was-were",
    "was در شرط‌های فرضی گفتاری رایج است؛ were رسمی‌تر و در subjunctive معیار است.",
    "If I were you... / If I was unclear...",
    "در شرط واقعی گذشته، was صورت عادی است؛ معنای فرضی را تشخیص بده."
  ],
  [
    "unless-with-will",
    "در unless-clause آیندهٔ واقعی معمولاً present simple می‌آید؛ will در صورت اراده/اصرار خاص ممکن است.",
    "Unless demand rises, output will fall.",
    "will در بند شرطی را به‌طور مطلق ممنوع ندان؛ معنی ارادی استثناست."
  ],
  [
    "if-will-politeness",
    "will در if-clause می‌تواند درخواست مؤدبانه یا willingness را بیان کند، نه آیندهٔ خنثی.",
    "If you will wait here, I'll check.",
    "این کاربرد با خطای رایج if + will برای شرط عادی فرق دارد."
  ],
  [
    "when-if-future",
    "when برای زمان مورد انتظار و if برای عدم قطعیت/شرط است؛ هر دو در آینده بند حال می‌گیرند.",
    "When the data arrive... / If the data arrive...",
    "در بند اسمی، will ممکن است: I don't know when they will arrive."
  ],
  [
    "provided-that-formality",
    "provided/providing that شرط رسمی/قراردادی را معرفی می‌کند.",
    "The deal will proceed provided that funding is secured.",
    "provided به‌عنوان صفت/حرف ربط در ساختارهای دیگر نیز می‌آید."
  ],
  [
    "supposing-what-if",
    "supposing و what if برای طرح فرض/احتمال و بررسی پیامد به‌کار می‌روند.",
    "Supposing the forecast is wrong, what then?",
    "register گفتاری‌تر و کاربردی برای بحث سناریو است."
  ],
  [
    "whether-or-not",
    "whether or not بر مستقل بودن نتیجه از تحقق شرط تأکید دارد.",
    "Whether or not prices fall, the policy will continue.",
    "whether را می‌توان با or not در چند جایگاه آورد."
  ],
  [
    "even-though-even-if",
    "even though واقعیت را می‌پذیرد؛ even if فرض را برای استدلال می‌پذیرد.",
    "Even though it rained... / Even if it rains...",
    "تمایز factual/concessive و hypothetical را حفظ کن."
  ],
  [
    "as-long-as-only-if",
    "as long as شرط کافی/مدت؛ only if شرط لازم و محدودکننده را بیان می‌کند.",
    "Only if costs fall will we invest.",
    "only if در آغاز جمله وارونگی بند اصلی می‌سازد."
  ],
  [
    "if-and-only-if",
    "if and only if در منطق/ریاضی شرط لازم و کافی را می‌رساند.",
    "A contract is valid if and only if...",
    "در نثر عمومی بسیار فنی است و باید دقیق استفاده شود."
  ],
  [
    "notwithstanding",
    "notwithstanding حرف اضافه/قید رسمی به معنی despite است و جایگاه انعطاف‌پذیر دارد.",
    "Notwithstanding the delay, the project continued.",
    "در متن حقوقی register تخصصی دارد؛ in spite of ساده‌تر است."
  ],
  [
    "albeit",
    "albeit حرف ربط/پیونددهندهٔ concessive رسمی به معنی although است و معمولاً عبارت کوتاه می‌گیرد.",
    "The plan was successful, albeit costly.",
    "albeit + full finite clause ممکن است اما ساختار فشرده‌تر رایج‌تر است."
  ],
  [
    "whereas-while-contrast",
    "whereas تقابل مستقیم و while تقابل یا هم‌زمانی را می‌رساند.",
    "Exports rose, whereas imports fell.",
    "ویرگول و جایگاه بند به طول و ساختار وابسته است."
  ],
  [
    "nevertheless-nonetheless",
    "nevertheless/nonetheless قید پیوندی‌اند و با conjunction تفاوت دارند.",
    "Costs rose; nevertheless, demand remained strong.",
    "برای اتصال دو بند مستقل فقط کاما کافی نیست."
  ],
  [
    "however-conjunctive",
    "however می‌تواند قید پیوندی یا قید manner/degree باشد؛ نشانه‌گذاری تابع نقش است.",
    "The plan, however, failed. / However hard we tried...",
    "however در آغاز جملهٔ concessive می‌تواند بند وابسته/قید بسازد."
  ],
  [
    "whatever-however-concessive",
    "whatever/however/wherever می‌توانند بند concessive آزاد بسازند.",
    "Whatever happens, remain calm. / However difficult it is...",
    "این کاربرد با wh-interrogative فرق دارد."
  ],
  [
    "no-matter-wh",
    "no matter what/how/where بند concessive می‌سازد و بر بی‌تأثیری شرط تأکید دارد.",
    "No matter how hard it is, continue.",
    "در برخی ساختارها whatever طبیعی‌تر و کوتاه‌تر است."
  ],
  [
    "despite-of-error",
    "despite بدون of می‌آید؛ in spite of با of؛ هر دو اسم/gerund می‌گیرند.",
    "Despite the rain... / In spite of the rain...",
    "despite of در انگلیسی معیار نادرست است."
  ],
  [
    "although-but-double",
    "although و but معمولاً برای یک رابطهٔ تقابلی در یک ساختار واحد با هم نمی‌آیند.",
    "Although it rained, we left. / It rained, but we left.",
    "در برخی گفتارها ساختار دوگانه به‌صورت تأکیدی شنیده می‌شود اما در نثر رسمی پرهیز شود."
  ],
  [
    "because-so-double",
    "because و so معمولاً هر دو در یک جمله برای یک رابطهٔ علت-نتیجه استفاده نمی‌شوند.",
    "Because it rained, we stayed. / It rained, so we stayed.",
    "در گفتار غیررسمی ممکن است تکرار گفتمانی رخ دهد؛ در نوشتار رسمی یکی را انتخاب کن."
  ],
  [
    "despite-although-structure",
    "despite + noun/gerund؛ although + finite clause؛ despite the fact that + finite clause.",
    "Despite being tired... / Although she was tired...",
    "ساختار را بر اساس نوع مکمل انتخاب کن."
  ],
  [
    "during-while-structure",
    "during + noun phrase؛ while + clause؛ during when نادرست است.",
    "during the meeting; while we met",
    "for + duration و throughout + period نیز تمایز دارند."
  ],
  [
    "because-of-due-to",
    "because of و due to هر دو علت می‌دهند؛ due to در سبک سنتی مکمل اسمی می‌گیرد و در کاربرد امروز گسترده‌تر است.",
    "The delay was due to weather.",
    "در ویرایش رسمی، ساختار و مرجع due to را روشن نگه دار."
  ],
  [
    "owing-to-thanks-to",
    "owing to رسمی و thanks to معمولاً علت مثبت/منفی بسته به لحن را معرفی می‌کند.",
    "Owing to delays, the launch was postponed.",
    "thanks to می‌تواند طعنه‌آمیز باشد."
  ],
  [
    "therefore-thus-hence",
    "therefore, thus, hence قیدهای نتیجه‌اند و رابطهٔ استدلالی/نتیجه را نشان می‌دهند.",
    "The sample was small; therefore, conclusions are limited.",
    "این واژه‌ها رابطهٔ واقعی را اثبات نمی‌کنند؛ منطق استدلال باید درست باشد."
  ],
  [
    "thereby-gerund",
    "thereby + gerund نتیجه/وسیلهٔ حاصل از عمل قبلی را نشان می‌دهد.",
    "The firm cut costs, thereby improving margins.",
    "thereby + bare infinitive نادرست است."
  ],
  [
    "thus-gerund-participle",
    "thus می‌تواند پیش از -ing بیاید و نتیجهٔ عمل را فشرده کند.",
    "The bank raised rates, thus reducing demand.",
    "فاعل ضمنی gerund باید با عامل/رویداد قبلی سازگار باشد."
  ],
  [
    "hence-noun-gerund",
    "hence می‌تواند پیش از اسم یا gerund بیاید و نتیجه را معرفی کند.",
    "Hence the delay; hence needing more time.",
    "hence + full clause در برخی کاربردها ممکن است، اما نشانه‌گذاری لازم است."
  ],
  [
    "accordingly",
    "accordingly قید پیوندی برای نشان دادن نتیجه/انطباق با وضعیت است.",
    "The rules changed; staff acted accordingly.",
    "با consequently و therefore از نظر معنایی کاملاً یکسان نیست."
  ],
  [
    "insofar-as",
    "insofar as محدودیت/دامنهٔ ادعا را بیان می‌کند و رسمی است.",
    "The claim is valid insofar as the data are accurate.",
    "در نثر ساده‌تر to the extent that می‌تواند روشن‌تر باشد."
  ],
  [
    "inasmuch-as",
    "inasmuch as رابطهٔ علت/دامنه را رسمی بیان می‌کند.",
    "The policy matters inasmuch as it affects exports.",
    "کاربرد آن محدود و رسمی است."
  ],
  [
    "in-that",
    "in that برای مشخص‌کردن جنبه/علت به‌کار می‌رود.",
    "The model is useful in that it captures uncertainty.",
    "در نثر عمومی because یا since اغلب طبیعی‌تر است."
  ],
  [
    "whereby",
    "whereby سازوکار/روشی را معرفی می‌کند که به نتیجه‌ای می‌انجامد.",
    "A system whereby firms report emissions.",
    "whereby را با where مکان‌نما اشتباه نگیر."
  ],
  [
    "wherein",
    "wherein به معنی in which است و رسمی/حقوقی است.",
    "The clause wherein liability is defined.",
    "در نثر عمومی in which روشن‌تر است."
  ],
  [
    "whereupon",
    "whereupon رویدادی را معرفی می‌کند که بلافاصله پس از رویداد پیشین رخ می‌دهد.",
    "The vote ended, whereupon the chair resigned.",
    "بسیار رسمی/روایی است."
  ],
  [
    "thereof-therein-thereto",
    "thereof, therein و thereto ضمایر/قیدهای حقوقی به معنی of/in/to that هستند.",
    "the terms thereof; the rights therein",
    "در متن عمومی از مرجع صریح‌تر استفاده کن."
  ],
  [
    "notwithstanding-position",
    "notwithstanding می‌تواند پیش یا پس از اسم بیاید و نقش concessive دارد.",
    "Notwithstanding the risks... / the risks notwithstanding",
    "register حقوقی/رسمی است."
  ],
  [
    "save-except",
    "save می‌تواند در زبان حقوقی/قدیمی به معنی except باشد.",
    "All save one agreed.",
    "در انگلیسی عمومی از except استفاده کن."
  ],
  [
    "barring-excepting",
    "barring + noun/gerund استثنا/شرط منفی را معرفی می‌کند.",
    "Barring further delays, we will launch.",
    "barring در نثر خبری/رسمی رایج است."
  ],
  [
    "failing-preposition",
    "failing + noun به معنی در صورت نبود/عدم تحقق است.",
    "Failing an agreement, the talks will end.",
    "این کاربرد با فعل fail متفاوت است."
  ],
  [
    "assuming-provided",
    "assuming (that) بند شرطی/فرضی را معرفی می‌کند و اغلب برای سناریو به‌کار می‌رود.",
    "Assuming demand remains stable, profits should rise.",
    "فرض باید صریح باشد و به‌عنوان واقعیت قطعی گزارش نشود."
  ],
  [
    "given-that",
    "given (that) پیش‌فرض/شرط زمینه‌ای را معرفی می‌کند.",
    "Given that costs have risen, prices may increase.",
    "given + noun phrase نیز ممکن است."
  ],
  [
    "considering-that",
    "considering (that) با درنظرگرفتن واقعیت زمینه‌ای را می‌آورد.",
    "Considering that time is short, we should begin.",
    "considering می‌تواند حرف اضافه/participle باشد."
  ],
  [
    "seeing-that",
    "seeing that علت/زمینه را در گفتار و نثر نیمه‌رسمی معرفی می‌کند.",
    "Seeing that no one objected, we proceeded.",
    "در متن رسمی because روشن‌تر است."
  ],
  [
    "now-that",
    "now that تغییر وضعیت/واقعیت تازه را علت تصمیم کنونی معرفی می‌کند.",
    "Now that the data are available, we can analyse them.",
    "now that معمولاً بند کامل می‌گیرد."
  ],
  [
    "in-the-event-that",
    "in the event that شرط رسمی/حقوقی برای رویداد احتمالی است.",
    "In the event that payment fails, contact support.",
    "در متن ساده‌تر if کوتاه‌تر است."
  ],
  [
    "on-condition-that",
    "on condition that شرط صریح/قراردادی را بیان می‌کند.",
    "Access is granted on condition that rules are followed.",
    "register رسمی/حقوقی دارد."
  ],
  [
    "so-long-as",
    "so long as می‌تواند شرط یا مدت را بیان کند.",
    "You may stay so long as you remain quiet.",
    "معنی زمانی و شرطی را از بافت جدا کن."
  ],
  [
    "lest-subjunctive",
    "lest بند هدف منفی می‌گیرد و در سبک رسمی با base form یا should می‌آید.",
    "They left early lest they miss the train.",
    "در نثر امروز so that...not رایج‌تر است."
  ],
  [
    "for-fear-that",
    "for fear that بند هدف منفی/نگرانی را معرفی می‌کند.",
    "They hid the files for fear that they might leak.",
    "for fear of + gerund نیز ممکن است."
  ],
  [
    "in-case-of-vs-in-case",
    "in case + clause و in case of + noun phrase دو ساختار متفاوت‌اند.",
    "Take an umbrella in case it rains. / in case of rain",
    "in case of rain با if it rains یکسان نیست و اغلب دستورالعملی است."
  ],
  [
    "whether-or-if-complement",
    "whether در جایگاه فاعل، پس از حرف اضافه و پیش از مصدر با to ترجیح دارد.",
    "Whether to proceed remains unclear.",
    "if در بندهای مفعولی معمولی رایج است."
  ],
  [
    "whether-or-not-placement",
    "or not می‌تواند بلافاصله پس از whether یا در انتهای بند بیاید.",
    "Whether or not we agree, the vote will proceed.",
    "در نثر رسمی، جایگاه نزدیک به whether گاهی روشن‌تر است."
  ],
  [
    "if-whether-indirect",
    "if و whether در بند پرسشی غیرمستقیم کاربرد دارند اما if برای شرط هم هست و می‌تواند ابهام بسازد.",
    "I don't know whether he agreed.",
    "در ساختارهای رسمی و چندبخشی whether دقیق‌تر است."
  ],
  [
    "wh-ever-indirect",
    "whoever/whatever/whichever در بندهای پرسشی غیرمستقیمِ آزاد نیز ممکن‌اند.",
    "Choose whichever you prefer.",
    "باید بین معنی «هرکدام» و «نمی‌دانم کدام» تمایز گذاشت."
  ],
  [
    "embedded-question-punctuation",
    "بند پرسشی توکار نقطه می‌گیرد نه علامت سؤال، مگر کل جمله پرسشی باشد.",
    "I wonder where he went. / Do you know where he went?",
    "نشانه‌گذاری بر اساس نوع جملهٔ اصلی است."
  ],
  [
    "indirect-command",
    "دستور غیرمستقیم با tell/ask/order + object + to-infinitive ساخته می‌شود.",
    "They told us to wait.",
    "say someone to do نادرست است؛ say that یا tell someone to."
  ],
  [
    "reported-questions-if-whether",
    "سؤال yes/no در نقل غیرمستقیم با if/whether و ترتیب خبری می‌آید.",
    "She asked whether we were ready.",
    "علامت سؤال فقط اگر جملهٔ اصلی پرسشی باشد."
  ],
  [
    "reported-wh-questions",
    "سؤال wh در نقل غیرمستقیم با wh-word و ترتیب خبری می‌آید.",
    "He asked where the files were.",
    "do-support پرسش مستقیم حذف می‌شود."
  ],
  [
    "reported-imperatives",
    "امر در نقل غیرمستقیم با to-infinitive و منفی با not to ساخته می‌شود.",
    "She told him not to leave.",
    "فعل گزارشی و مفعول باید مناسب مخاطب باشند."
  ],
  [
    "reporting-verb-admit",
    "admit + gerund یا that-clause؛ admit to + gerund نیز ممکن است.",
    "He admitted making a mistake.",
    "admit to do در معنی اعتراف به عمل، معمولاً نادرست است."
  ],
  [
    "reporting-verb-deny",
    "deny + gerund/noun/that-clause می‌آید.",
    "They denied receiving the payment.",
    "deny someone something در معنی رد کردن/محروم کردن ساختار دیگری است."
  ],
  [
    "reporting-verb-accuse",
    "accuse + object + of + gerund/noun می‌آید.",
    "She accused him of lying.",
    "accuse to do نادرست است."
  ],
  [
    "reporting-verb-apologize",
    "apologize for + noun/gerund و apologize to + person می‌آید.",
    "He apologized to us for arriving late.",
    "حرف اضافهٔ شخص و علت را جدا نگه دار."
  ],
  [
    "reporting-verb-insist",
    "insist on + gerund و insist that + clause؛ معنی اصرار بر واقعیت می‌تواند indicative بگیرد.",
    "She insisted that she was innocent.",
    "نوع معنی insist را از بافت تشخیص بده."
  ],
  [
    "reporting-verb-suggest",
    "suggest + gerund/that-clause؛ شخص به‌عنوان مفعول مستقیم نمی‌آید.",
    "He suggested that we leave.",
    "suggested me to leave در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-recommend",
    "recommend + gerund, noun, that-clause یا recommend something to someone.",
    "They recommended that the bank act.",
    "recommend someone to do در برخی کاربردها محدود است؛ ساختار that امن‌تر است."
  ],
  [
    "reporting-verb-propose",
    "propose + gerund/that-clause برای پیشنهاد و propose to do برای قصد شخصی.",
    "They proposed lowering rates. / He proposed to resign.",
    "فاعل و معنی را بررسی کن."
  ],
  [
    "reporting-verb-warn",
    "warn + object + (not) to-infinitive یا warn that-clause می‌گیرد.",
    "They warned us not to invest.",
    "warn against + gerund/noun نیز رایج است."
  ],
  [
    "reporting-verb-remind",
    "remind + object + to-infinitive برای یادآوری وظیفه و remind + object + of/about + noun برای یادآوری موضوع است.",
    "Remind me to call. / remind me of the meeting.",
    "remind that-clause معمولاً با object می‌آید."
  ],
  [
    "reporting-verb-convince",
    "convince + object + that-clause یا of + noun/gerund برای قانع کردن است.",
    "They convinced us that the plan was sound.",
    "convince someone to do نیز ممکن است."
  ],
  [
    "reporting-verb-persuade",
    "persuade + object + to-infinitive برای متقاعد کردن به عمل است.",
    "She persuaded him to stay.",
    "persuade of + noun/that-clause الگوی دیگری است."
  ],
  [
    "reporting-verb-encourage",
    "encourage + object + to-infinitive و encourage + gerund برای تشویق است.",
    "They encouraged staff to apply.",
    "encourage someone into doing نیز ممکن است."
  ],
  [
    "reporting-verb-urge",
    "urge + object + to-infinitive یا urge that + subjunctive برای توصیهٔ قوی است.",
    "The panel urged the bank to act.",
    "urge someone into/out of نیز ساختار دارد."
  ],
  [
    "reporting-verb-demand",
    "demand + that-clause با subjunctive یا demand + noun می‌آید؛ demand someone to do معمولاً معیار نیست.",
    "They demanded that he resign.",
    "demand of someone that... ساختار رسمی است."
  ],
  [
    "reporting-verb-request",
    "request + that-clause/subjunctive یا request that someone be... و request something from someone.",
    "They requested that the data be released.",
    "request someone to do در انگلیسی رسمی/حقوقی ممکن است اما ask someone to رایج‌تر است."
  ],
  [
    "reporting-verb-order",
    "order + object + to-infinitive یا order that + subjunctive برای دستور است.",
    "The court ordered the firm to pay.",
    "order that he pays در برخی گونه‌ها ممکن است اما subjunctive رسمی است."
  ],
  [
    "reporting-verb-forbid",
    "forbid + object + to-infinitive یا forbid + gerund.",
    "The rules forbid users to share passwords.",
    "passive: sharing is forbidden; الگو را با prohibit from اشتباه نکن."
  ],
  [
    "reporting-verb-claim",
    "claim + that-clause/to-infinitive برای ادعاست؛ claim to have done برای عمل پیشین.",
    "The company claims to have complied.",
    "claim that لزوماً حقیقت گزاره را پیش‌فرض نمی‌گیرد."
  ],
  [
    "reporting-verb-allege",
    "allege that / allege something against someone برای ادعای اثبات‌نشده، به‌ویژه حقوقی/خبری است.",
    "Prosecutors allege that funds were diverted.",
    "در خبر، allegation را به‌عنوان واقعیت قطعی بیان نکن."
  ],
  [
    "reporting-verb-maintain",
    "maintain that برای پافشاری بر یک موضع/ادعا به‌کار می‌رود.",
    "The minister maintained that the policy worked.",
    "maintain + noun به معنی حفظ/نگهداری است."
  ],
  [
    "reporting-verb-note",
    "note that برای اشاره/ثبت نکته، نه لزوماً ادعای قطعی است.",
    "The report notes that inflation eased.",
    "فعل گزارشی موضع نویسنده را قاب‌بندی می‌کند."
  ],
  [
    "reporting-verb-observe",
    "observe that می‌تواند مشاهده/اظهارنظر تحلیلی را معرفی کند.",
    "The authors observe that the sample is small.",
    "observe + object به معنی مشاهده کردن نیز هست."
  ],
  [
    "reporting-verb-demonstrate",
    "demonstrate that برای شواهد قوی‌تر/نمایش نتیجه به‌کار می‌رود.",
    "The experiment demonstrates that the effect is real.",
    "فقط در صورت کفایت شواهد از آن استفاده کن."
  ],
  [
    "reporting-verb-indicate",
    "indicate that شواهدی را نشان می‌دهد، معمولاً با قطعیت کمتر از prove.",
    "The data indicate that demand is weakening.",
    "فاعل معمولاً داده/نشانه است."
  ],
  [
    "reporting-verb-suggest-evidence",
    "suggest that در گزارش علمی اغلب نتیجهٔ محتاطانه را می‌رساند.",
    "The findings suggest that the policy helped.",
    "suggest به معنی پیشنهاد دادن نیز هست؛ ساختار و بافت تعیین‌کننده است."
  ],
  [
    "reporting-verb-reveal",
    "reveal that اطلاعات پنهان/تازه را آشکار می‌کند.",
    "The audit revealed that funds were missing.",
    "reveal + noun نیز رایج است."
  ],
  [
    "reporting-verb-show",
    "show that برای ارائهٔ شواهد/نتیجه به‌کار می‌رود.",
    "The chart shows that exports fell.",
    "show someone something ساختار دو مفعولی دارد."
  ],
  [
    "reporting-verb-prove",
    "prove that / prove to be برای اثبات یا از کار درآمدن است.",
    "The claim proved false.",
    "prove به‌عنوان فعل linking و transitive هر دو کاربرد دارد."
  ],
  [
    "reporting-verb-confirm",
    "confirm that برای تأیید اطلاعات/فرضیه است.",
    "Officials confirmed that talks had begun.",
    "confirm + noun و confirm something with someone نیز ممکن است."
  ],
  [
    "reporting-verb-deny-reported",
    "deny that و deny + gerund ادعای منفی را گزارش می‌کنند.",
    "The firm denied that it had manipulated prices.",
    "زمان بند وابسته به زمان ادعای گزارش‌شده بستگی دارد."
  ],
  [
    "reporting-verb-announce",
    "announce that و announce something برای اعلام عمومی است.",
    "The bank announced that rates would remain unchanged.",
    "announce someone to do در این معنی معیار نیست."
  ],
  [
    "reporting-verb-state",
    "state that رسمی و خنثی‌تر از claim است و بیان موضع را گزارش می‌کند.",
    "The statement states that...",
    "state + noun و state something clearly نیز کاربرد دارد."
  ],
  [
    "reporting-verb-explain",
    "explain something to someone یا explain that؛ explain someone something در معیار عمومی نادرست است.",
    "She explained the process to us.",
    "explain why/how نیز بند پرسشی توکار می‌گیرد."
  ],
  [
    "reporting-verb-describe",
    "describe + object + as + noun/adjective برای توصیف است.",
    "The report described the outlook as uncertain.",
    "describe about در این معنی نادرست است."
  ],
  [
    "reporting-verb-regard",
    "regard + object + as + noun/adjective برای تلقی کردن است.",
    "They regard the measure as necessary.",
    "be regarded as ساختار مجهول رایج است."
  ],
  [
    "reporting-verb-consider",
    "consider + object + adjective/noun یا consider doing برای بررسی/تلقی است.",
    "We consider the risk serious. / consider investing.",
    "consider to do در معنی بررسی انجام کار معمولاً نادرست است."
  ],
  [
    "reporting-verb-find",
    "find + object + adjective/noun یا find that برای نتیجهٔ ارزیابی است.",
    "The study found the treatment effective.",
    "find to be نیز ممکن است و رسمی‌تر است."
  ],
  [
    "reporting-verb-believe",
    "believe + that-clause و believe + object + to-infinitive ساختارهای گزارشی‌اند.",
    "They believe that the figures are accurate.",
    "passive: He is believed to be...؛ زمان مصدر مهم است."
  ],
  [
    "reporting-verb-expect",
    "expect + object + to-infinitive، expect that یا expect to do می‌آید.",
    "We expect prices to fall.",
    "expect someone doing در این معنی معمولاً ساختار دیگری دارد."
  ],
  [
    "reporting-verb-predict",
    "predict + that-clause/noun؛ predict something for a time/place.",
    "Analysts predict that inflation will ease.",
    "predict someone to do در انگلیسی معیار معمولاً نامأنوس است."
  ],
  [
    "reporting-verb-forecast",
    "forecast + noun/that-clause و اغلب آیندهٔ اقتصادی/هواشناسی را پیش‌بینی می‌کند.",
    "The agency forecasts slower growth.",
    "forecasted و forecast هر دو گذشته/شکل سوم‌اند."
  ],
  [
    "reporting-verb-estimate",
    "estimate + that-clause یا estimate something at/to be.",
    "They estimate losses at $2 billion.",
    "estimate someone to do محدودتر و رسمی است."
  ],
  [
    "reporting-verb-assume",
    "assume that برای فرض گرفتن و assume + noun برای برعهده گرفتن نقش/مسئولیت است.",
    "We assume that demand remains constant.",
    "assume to do در معنی فرض کردن معمولاً درست نیست."
  ],
  [
    "reporting-verb-presume",
    "presume that/to be برای فرض مبتنی بر احتمال/قرینه است.",
    "The court presumed him innocent.",
    "presume + object + adjective ساختار مهمی است."
  ],
  [
    "reporting-verb-suppose",
    "suppose that برای فرض/گمان و be supposed to برای انتظار/وظیفه است.",
    "I suppose he is right. / He is supposed to arrive.",
    "suppose + object + to-infinitive نیز ممکن است."
  ],
  [
    "reporting-verb-imagine",
    "imagine + that-clause, object + -ing یا imagine + noun.",
    "Imagine living abroad.",
    "imagine to do در معنی تصور کردن معمولاً نادرست است."
  ],
  [
    "reporting-verb-doubt",
    "doubt whether/if/that برای تردید است؛ polarity و register بر that/if اثر دارد.",
    "I doubt that the claim is true.",
    "I don't doubt that می‌تواند تأیید ضمنی باشد."
  ],
  [
    "reporting-verb-wonder",
    "wonder whether/if/wh-clause برای پرسش غیرمستقیم و wonder about + noun است.",
    "I wonder whether they will agree.",
    "wonder that ساختار معنایی متفاوت و محدودتری دارد."
  ],
  [
    "reporting-verb-question",
    "question + noun/claim یا question whether برای زیر سؤال بردن است.",
    "Experts questioned whether the data were reliable.",
    "question someone about something نیز ممکن است."
  ],
  [
    "reporting-verb-challenge",
    "challenge + claim/assumption یا challenge someone to do برای به چالش کشیدن است.",
    "The findings challenge conventional wisdom.",
    "challenge to do می‌تواند دعوت به رقابت/عمل باشد."
  ],
  [
    "reporting-verb-acknowledge",
    "acknowledge + noun/gerund/that-clause برای پذیرفتن واقعیت است.",
    "The firm acknowledged making an error.",
    "acknowledge someone for something معنی تقدیر/شناخت دارد."
  ],
  [
    "reporting-verb-recognize",
    "recognize that و recognize + noun برای تشخیص/پذیرفتن است.",
    "We recognize that risks remain.",
    "recognize someone as... ساختار دیگری است."
  ],
  [
    "reporting-verb-emphasize",
    "emphasize that/on + noun برای برجسته‌سازی است.",
    "The report emphasizes the need for reform.",
    "emphasize about نادرست است."
  ],
  [
    "reporting-verb-highlight",
    "highlight + noun/that-clause برای برجسته‌سازی نکته/شاهد است.",
    "The data highlight regional differences.",
    "highlight می‌تواند فعل مستقیم مفعولی بگیرد."
  ],
  [
    "reporting-verb-stress",
    "stress that/on + noun برای تأکید است.",
    "The minister stressed that the policy would continue.",
    "stress در زبان‌شناسی تکیه نیز معنی می‌دهد."
  ],
  [
    "reporting-verb-argue",
    "argue that/for/against و argue with someone الگوهای متفاوت دارند.",
    "The authors argue that reform is necessary.",
    "argue someone to do نادرست است."
  ],
  [
    "reporting-verb-contend",
    "contend that برای استدلال/ادعای رسمی است.",
    "The paper contends that the model is flawed.",
    "register آکادمیک/حقوقی دارد."
  ],
  [
    "reporting-verb-assert",
    "assert that با قطعیت/قاطعیت ادعا را بیان می‌کند.",
    "The company asserted that it complied.",
    "assertion لزوماً اثبات نیست."
  ],
  [
    "reporting-verb-acknowledge-contrast",
    "acknowledge that می‌تواند امتیاز دادن به نکتهٔ مخالف پیش از استدلال باشد.",
    "The authors acknowledge that the sample is limited.",
    "این فعل اغلب برای ساختار concessive argument به‌کار می‌رود."
  ],
  [
    "reporting-verb-concede",
    "concede that امتیاز/پذیرش نکتهٔ مخالف را بیان می‌کند.",
    "The minister conceded that costs had risen.",
    "concede + noun/point نیز ممکن است."
  ],
  [
    "reporting-verb-admit-to",
    "admit to + gerund/noun با admit + gerund تفاوت سبکی اندک دارد.",
    "He admitted to falsifying records.",
    "admit to be در این معنی معمولاً نادرست است."
  ],
  [
    "reporting-verb-confess",
    "confess to + gerund/noun یا confess that برای اعتراف است.",
    "She confessed to taking the money.",
    "confess + object + to someone نیز ممکن است."
  ],
  [
    "reporting-verb-insinuate",
    "insinuate that برای القای غیرمستقیم/ضمنی، اغلب با بار منفی است.",
    "He insinuated that the deal was corrupt.",
    "در گزارش حرفه‌ای از نسبت دادن نیت بدون شاهد پرهیز کن."
  ],
  [
    "reporting-verb-imply",
    "imply that برای القای غیرمستقیم است؛ imply something to someone نیز ممکن است.",
    "The wording implies that risks were known.",
    "infer از سوی شنونده/خواننده است و با imply از سوی گوینده فرق دارد."
  ],
  [
    "reporting-verb-infer",
    "infer that از شواهد نتیجه‌گیری کردن است.",
    "Readers may infer that the policy failed.",
    "infer something from evidence؛ infer from را با imply اشتباه نگیر."
  ],
  [
    "reporting-verb-entail",
    "entail + noun/gerund به معنی مستلزم بودن است.",
    "The proposal entails raising taxes.",
    "entail that-clause در برخی کاربردهای رسمی ممکن است."
  ],
  [
    "reporting-verb-mean",
    "mean + gerund یعنی مستلزم بودن؛ mean to do یعنی قصد داشتن؛ mean that یعنی معنی/دلالت داشتن.",
    "The change means paying more.",
    "این سه ساختار را از هم جدا نگه دار."
  ],
  [
    "reporting-verb-involve",
    "involve + noun/gerund برای دربرگرفتن/مستلزم بودن است.",
    "The project involves collecting data.",
    "involve someone in something نیز ساختار دیگری است."
  ],
  [
    "reporting-verb-require",
    "require + noun, gerund یا object + to-infinitive/that-clause.",
    "The task requires careful analysis.",
    "require that he be present در سبک رسمی subjunctive می‌گیرد."
  ],
  [
    "reporting-verb-entitle",
    "entitle + object + to-infinitive/noun برای اعطای حق است.",
    "The contract entitles users to a refund.",
    "be entitled to + noun/gerund نیز ممکن است."
  ],
  [
    "reporting-verb-enable",
    "enable + object + to-infinitive برای ممکن ساختن است.",
    "The update enables users to export data.",
    "enable to do بدون مفعول در این معنی معمولاً نادرست است."
  ],
  [
    "reporting-verb-allow-permit-distinction",
    "allow/permit + object + to-infinitive یا gerund؛ permit رسمی‌تر است.",
    "The rule permits firms to operate.",
    "allow doing و permit doing هر دو ممکن‌اند."
  ],
  [
    "reporting-verb-force-compel",
    "force/compel + object + to-infinitive برای اجبار است.",
    "The crisis forced the bank to act.",
    "force someone into doing نیز ممکن است."
  ],
  [
    "reporting-verb-cause",
    "cause + object + to-infinitive یا cause + noun برای علت است.",
    "The shock caused prices to rise.",
    "cause someone to do رسمی‌تر از make someone do است."
  ],
  [
    "reporting-verb-lead-to",
    "lead to + noun/gerund برای پیامد است.",
    "The policy led to higher costs.",
    "to حرف اضافه است و gerund می‌گیرد."
  ],
  [
    "reporting-verb-result-in-from",
    "result in پیامد و result from علت را معرفی می‌کند.",
    "The delay resulted in losses. / Losses resulted from the delay.",
    "جهت رابطهٔ علت/معلول را اشتباه نکن."
  ],
  [
    "reporting-verb-contribute-to",
    "contribute to + noun/gerund برای سهم داشتن در پیامد است.",
    "Higher rates contributed to slower growth.",
    "این ساختار الزاماً علت یگانه را بیان نمی‌کند."
  ],
  [
    "reporting-verb-account-for",
    "account for + noun می‌تواند به معنی توضیح دادن یا تشکیل دادن سهمی از کل باشد.",
    "Exports account for 40% of revenue.",
    "account for a loss و account to someone معنی‌های دیگر دارند."
  ],
  [
    "reporting-verb-consist-of",
    "consist of + noun برای اجزا؛ consist in برای ماهیت/اصل است.",
    "The index consists of 30 assets.",
    "consist from نادرست است."
  ],
  [
    "reporting-verb-comprise",
    "comprise + parts یعنی شامل بودن؛ be comprised of رایج اما از نظر سنتی محل اختلاف است.",
    "The group comprises five firms.",
    "در نثر رسمی comprise of را به‌جای comprises پرهیز کن."
  ],
  [
    "reporting-verb-compose",
    "be composed of و compose something روابط جزء-کل را بیان می‌کنند.",
    "The committee is composed of experts.",
    "فرق comprise و compose را با جهت رابطه یاد بگیر."
  ],
  [
    "reporting-verb-constitute",
    "constitute + noun برای تشکیل دادن کل/ماهیت است.",
    "These factors constitute a serious risk.",
    "be constituted by/of کاربردهای متفاوت دارد."
  ],
  [
    "reporting-verb-include-contain",
    "include فهرستی غیرجامع و contain دربرگرفتن درون یک کل را بیان می‌کند.",
    "The report includes three charts. / contains confidential data.",
    "معنی‌ها هم‌پوشانی دارند اما انتخاب بر دامنه اثر می‌گذارد."
  ],
  [
    "reporting-verb-involve-entail",
    "involve مشارکت/درگیر بودن و entail پیامد ضروری/منطقی را برجسته می‌کند.",
    "The plan involves risk. / entails costs.",
    "این دو را در تحلیل اقتصادی یکسان به‌کار نبر."
  ],
  [
    "reporting-verb-ensure",
    "ensure that برای تضمین نتیجه و ensure + noun برای اطمینان از وجود/انجام است.",
    "Ensure that all figures are checked.",
    "ensure someone to do نادرست است؛ ensure someone does یا ensure that."
  ],
  [
    "reporting-verb-assure",
    "assure + person + that برای اطمینان دادن به شخص است.",
    "The bank assured clients that funds were safe.",
    "assure someone of something نیز ممکن است."
  ],
  [
    "reporting-verb-insure",
    "insure + object برای بیمه کردن و ensure برای تضمین است.",
    "The company insured the building.",
    "در BrE insure و ensure از نظر تلفظ/نوشتار فرق دارند."
  ],
  [
    "reporting-verb-assess",
    "assess + noun/wh-clause برای ارزیابی است.",
    "The team assessed whether the model was accurate.",
    "assess about نادرست است."
  ],
  [
    "reporting-verb-evaluate",
    "evaluate + noun/wh-clause برای ارزیابی معیارمند است.",
    "We evaluated how well the model performed.",
    "evaluate the effectiveness of... ساختار رایج است."
  ],
  [
    "reporting-verb-analyse",
    "analyse + noun/wh-clause برای تحلیل؛ BrE analyse و AmE analyze.",
    "Researchers analysed the results.",
    "فعل مستقیم مفعولی می‌گیرد و معمولاً about نمی‌خواهد."
  ],
  [
    "reporting-verb-compare",
    "compare A with/to B و compare A to B تمایزهای گرایشی دارند.",
    "Compare the forecast with actual data.",
    "compare to برای تشبیه و compare with برای سنجش مشابهت/تفاوت سنتی‌تر است؛ هم‌پوشانی وجود دارد."
  ],
  [
    "reporting-verb-differ",
    "differ from و differ in/to/with الگوهای متفاوت دارند.",
    "The results differ from earlier findings.",
    "differ with someone یعنی اختلاف نظر داشتن."
  ],
  [
    "reporting-verb-distinguish",
    "distinguish A from B یا distinguish between A and B برای تمایز است.",
    "Distinguish correlation from causation.",
    "distinguish oneself معنی دیگری دارد."
  ],
  [
    "reporting-verb-prevent-prohibit",
    "prevent someone from doing و prohibit someone from doing ساختار مشابه دارند.",
    "The law prohibits firms from colluding.",
    "prohibit + gerund بدون مفعول نیز ممکن است."
  ],
  [
    "reporting-verb-resist",
    "resist + noun/gerund؛ resist to do در این معنی نادرست است.",
    "They resisted cutting costs.",
    "resist temptation و resist pressure collocationهای رایج‌اند."
  ],
  [
    "reporting-verb-avoid",
    "avoid + noun/gerund می‌گیرد و از مصدر با to استفاده نمی‌کند.",
    "Avoid making unsupported claims.",
    "avoid doing و avoid something را به‌خاطر بسپار."
  ],
  [
    "reporting-verb-deny-gerund",
    "deny + gerund برای انکار انجام عمل است؛ deny to do در این معنی نادرست است.",
    "He denied leaking the document.",
    "deny that-clause نیز ممکن است."
  ],
  [
    "reporting-verb-postpone",
    "postpone/delay + gerund یا noun؛ مصدر با to نمی‌آید.",
    "They postponed announcing the results.",
    "delay doing با put off doing هم‌معنی نزدیک دارد."
  ],
  [
    "reporting-verb-consider-gerund",
    "consider + gerund برای بررسی احتمال انجام عمل است.",
    "We are considering moving abroad.",
    "consider to move در این معنی نادرست است."
  ],
  [
    "reporting-verb-risk-gerund",
    "risk + gerund/noun برای به خطر انداختن/احتمال خطر است.",
    "The firm risks losing market share.",
    "risk to do در این معنی نادرست است."
  ],
  [
    "reporting-verb-miss-gerund",
    "miss + gerund برای دلتنگی/از دست دادن تجربهٔ عمل است.",
    "I miss working with the team.",
    "miss to do در این معنی نادرست است."
  ],
  [
    "reporting-verb-practise-gerund",
    "practise + gerund برای تمرین عمل است؛ BrE practise فعل و practice اسم.",
    "Practise writing concise reports.",
    "AmE برای هر دو معمولاً practice می‌نویسد."
  ],
  [
    "reporting-verb-imagine-gerund",
    "imagine + gerund/noun/that-clause برای تصور است.",
    "Imagine working without internet.",
    "imagine to work در معنی تصور کردن معیار نیست."
  ],
  [
    "reporting-verb-deny-to",
    "deny to do را با deny doing اشتباه نکن؛ to در ساختارهای دیگر ممکن است نقش حرف اضافه داشته باشد.",
    "She denied taking the money.",
    "deny + object + noun به معنی محروم کردن نیز می‌آید."
  ],
  [
    "reporting-verb-regret-to",
    "regret to inform/say/announce قالب رسمی برای بیان خبر ناخوشایند است.",
    "We regret to inform you that...",
    "regret doing برای پشیمانی از عمل انجام‌شده است."
  ],
  [
    "reporting-verb-stop-to",
    "stop to do یعنی توقف فعالیتی برای انجام کار دیگر؛ stop doing یعنی پایان دادن به همان فعالیت.",
    "He stopped to answer the phone. / stopped answering calls.",
    "این تفاوت در آزمون‌های پیشرفته بسیار پرتکرار است."
  ],
  [
    "reporting-verb-remember-to",
    "remember to do یعنی به خاطر داشتن وظیفه؛ remember doing یعنی خاطرهٔ انجام عمل.",
    "Remember to submit the form. / I remember submitting it.",
    "زمان مرجع و وقوع عمل تعیین‌کننده است."
  ],
  [
    "reporting-verb-forget-to",
    "forget to do یعنی انجام ندادن به‌علت فراموشی؛ forget doing یعنی به یاد نداشتن تجربهٔ انجام‌شده.",
    "I forgot to lock the door. / I forgot locking it.",
    "در برخی بافت‌ها ساختار دوم به معنی خاطرهٔ مبهم است."
  ],
  [
    "reporting-verb-try-to",
    "try to do تلاش برای رسیدن به هدف است؛ try doing آزمایش یک روش است.",
    "I tried to fix it. / Try restarting it.",
    "ترجمهٔ فارسی به‌تنهایی تفاوت را نشان نمی‌دهد؛ هدف و روش را تشخیص بده."
  ],
  [
    "reporting-verb-mean-to",
    "mean to do قصد داشتن و mean doing مستلزم بودن است.",
    "I meant to call. / This means working late.",
    "فاعل و ساختار مکمل را با معنی پیوند بده."
  ],
  [
    "reporting-verb-go-on-to",
    "go on to do رفتن به مرحلهٔ بعدی و go on doing ادامهٔ همان کار است.",
    "She went on to lead the team. / went on talking.",
    "توالی رویداد را در بافت روایت تشخیص بده."
  ],
  [
    "reporting-verb-need-doing",
    "need doing در BrE می‌تواند معنای مجهول بدهد؛ need to do فاعل انجام‌دهنده را دارد.",
    "The car needs washing. / I need to wash it.",
    "need to be washed ساختار مجهول صریح‌تر است."
  ],
  [
    "reporting-verb-want-doing",
    "want doing در برخی گونه‌های BrE می‌تواند معنای مجهول داشته باشد.",
    "The room wants cleaning.",
    "این کاربرد منطقه‌ای/غیررسمی‌تر است؛ want to be cleaned روشن‌تر است."
  ],
  [
    "reporting-verb-deserve-gerund",
    "deserve + gerund گاهی معنای مجهول/ارزش انجام شدن می‌دهد.",
    "The issue deserves discussing.",
    "deserve to be discussed نیز ممکن و صریح‌تر است."
  ],
  [
    "reporting-verb-require-gerund",
    "require + gerund می‌تواند معنی مجهول بدهد.",
    "The document requires updating.",
    "require to be updated نیز ممکن است."
  ],
  [
    "reporting-verb-be-worth",
    "be worth + gerund/noun برای ارزش داشتن است.",
    "The proposal is worth considering.",
    "worthwhile to consider نیز ساختار دیگری است."
  ],
  [
    "reporting-verb-be-busy",
    "be busy + gerund برای مشغول انجام کاری است.",
    "She is busy preparing the presentation.",
    "busy with + noun نیز ممکن است."
  ],
  [
    "reporting-verb-have-difficulty",
    "have difficulty/trouble/a hard time + gerund برای دشواری در انجام کار است.",
    "They had difficulty accessing the files.",
    "difficulty in doing نیز ممکن است."
  ],
  [
    "reporting-verb-spend-time",
    "spend time/money + gerund برای صرف زمان/هزینه در انجام کار است.",
    "She spent hours analysing the data.",
    "spend time on + noun نیز ساختار جایگزین است."
  ],
  [
    "reporting-verb-waste-time",
    "waste time + gerund برای اتلاف زمان در انجام کار است.",
    "Don't waste time arguing.",
    "waste time on + noun نیز رایج است."
  ],
  [
    "reporting-verb-have-fun",
    "have fun/enjoy oneself + gerund برای فعالیت لذت‌بخش است.",
    "We had fun exploring the city.",
    "have fun to do در این معنی معیار نیست."
  ],
  [
    "reporting-verb-look-forward",
    "look forward to + noun/gerund برای انتظار مشتاقانه است.",
    "I look forward to hearing from you.",
    "to حرف اضافه است؛ look forward to hear نادرست است."
  ],
  [
    "reporting-verb-object-to",
    "object to + noun/gerund برای مخالفت است.",
    "They objected to changing the rules.",
    "object to do در این معنی نادرست است."
  ],
  [
    "reporting-verb-confess-to",
    "confess to + noun/gerund برای اعتراف است.",
    "She confessed to taking the files.",
    "confess that نیز ممکن است."
  ],
  [
    "reporting-verb-be-committed-to",
    "be committed to + noun/gerund برای تعهد است.",
    "The team is committed to improving quality.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-dedicated-to",
    "be dedicated to + noun/gerund برای وقف/اختصاص دادن است.",
    "They are dedicated to serving clients.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-opposed-to",
    "be opposed to + noun/gerund برای مخالفت است.",
    "The group is opposed to raising taxes.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-accustomed-to",
    "be accustomed to + noun/gerund برای عادت داشتن است.",
    "She is accustomed to working remotely.",
    "با used to + base verb اشتباه نشود."
  ],
  [
    "reporting-verb-be-restricted-to",
    "be restricted to + noun/gerund برای محدود بودن است.",
    "Access is restricted to registered users.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-reduced-to",
    "be reduced to + noun/gerund برای تقلیل یافتن به وضعیتی است.",
    "The discussion was reduced to arguing.",
    "معنی reduced to a number/level متفاوت است."
  ],
  [
    "reporting-verb-be-subject-to",
    "be subject to + noun/gerund برای مشمول/در معرض بودن است.",
    "The policy is subject to review.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-prone-to",
    "be prone to + noun/gerund برای مستعد بودن است.",
    "The system is prone to failing.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-be-liable-to",
    "be liable to + noun/infinitive برای احتمال/مسئولیت قانونی است.",
    "The firm is liable to pay damages.",
    "معنی حقوقی و احتمالی را از بافت تفکیک کن."
  ],
  [
    "reporting-verb-be-bound-to",
    "be bound to + infinitive احتمال قوی/الزام؛ be bound for مقصد.",
    "Costs are bound to rise. / bound for London.",
    "دو ساختار هم‌شکل را تفکیک کن."
  ],
  [
    "reporting-verb-be-due-to-cause",
    "due to + noun علت را معرفی می‌کند؛ be due to + infinitive برنامه/انتظار زمانی است.",
    "The delay was due to snow. / The train is due to arrive.",
    "ساختار و نقش due to را مشخص کن."
  ],
  [
    "reporting-verb-be-likely-that",
    "it is likely that و subject + be likely to هر دو احتمال می‌سازند.",
    "It is likely that prices will rise.",
    "likely of someone doing در برخی گونه‌ها/کاربردها محدود است."
  ],
  [
    "reporting-verb-unlikely",
    "unlikely می‌تواند با to-infinitive یا that-clause بیاید.",
    "The plan is unlikely to succeed.",
    "not likely و unlikely از نظر لحن/تأکید متفاوت‌اند."
  ],
  [
    "reporting-verb-certain-sure",
    "be certain/sure that و be sure to do ساختارهای متفاوت دارند.",
    "I'm sure that he knows. / Be sure to call.",
    "be sure of + noun/gerund نیز ممکن است."
  ],
  [
    "reporting-verb-sure-of",
    "sure of + noun/gerund برای اطمینان از موضوع/عمل است.",
    "She is sure of winning.",
    "sure to do می‌تواند پیش‌بینی/اطمینان گوینده باشد."
  ],
  [
    "reporting-verb-afraid-to",
    "afraid to do یعنی ترس از انجام عمل؛ afraid of doing یعنی ترس از احتمال/تجربهٔ آن.",
    "I'm afraid to ask. / afraid of asking.",
    "معنی‌ها هم‌پوشانی دارند اما کانون متفاوت است."
  ],
  [
    "reporting-verb-interested-in",
    "interested in + noun/gerund برای علاقه‌مندی است.",
    "They are interested in investing.",
    "in حرف اضافه است؛ interested to hear ساختار/معنی متفاوت دارد."
  ],
  [
    "reporting-verb-good-at",
    "good at + noun/gerund برای مهارت است.",
    "She is good at analysing data.",
    "at حرف اضافه است."
  ],
  [
    "reporting-verb-responsible-to-for",
    "responsible to شخص/نهاد پاسخ‌گو و responsible for کار/نتیجه را معرفی می‌کند.",
    "The director is responsible to the board for compliance.",
    "دو حرف اضافه رابطه‌های متفاوت می‌سازند."
  ],
  [
    "reporting-verb-similar-to",
    "similar to + noun/gerund برای شباهت است.",
    "The pattern is similar to what we observed.",
    "to حرف اضافه است؛ similarly به‌عنوان قید ساختار دیگری دارد."
  ],
  [
    "reporting-verb-different-from",
    "different from معیار رایج است؛ different to در BrE و different than در AmE نیز دیده می‌شود.",
    "This result is different from ours.",
    "سبک‌نامه و گونهٔ هدف را رعایت کن."
  ],
  [
    "reporting-verb-prefer-to",
    "prefer A to B برای ترجیح و مقایسه است؛ to در اینجا حرف اضافه است.",
    "I prefer tea to coffee.",
    "prefer to do ساختار مصدرساز جداگانه است."
  ],
  [
    "reporting-verb-superior-to",
    "superior/inferior/senior/junior/prior/subsequent معمولاً to می‌گیرند، نه than.",
    "This model is superior to the old one.",
    "این صفت‌ها از نظر مقایسه‌ای الگوی واژگانی خاص دارند."
  ],
  [
    "reporting-verb-married-to",
    "married to ساختار معیار است؛ marry someone بدون to می‌آید.",
    "She is married to an economist. / She married an economist.",
    "get married نیز ساختار فعلی است."
  ],
  [
    "reporting-verb-arrive-in-at",
    "arrive in برای شهر/کشور و arrive at برای مکان/نقطهٔ مشخص رایج است.",
    "arrive in Berlin; arrive at the station",
    "arrive home بدون حرف اضافه می‌آید."
  ],
  [
    "reporting-verb-reach-no-preposition",
    "reach + place بدون حرف اضافه می‌آید؛ arrive at/in و get to ساختارهای متفاوت‌اند.",
    "We reached the airport.",
    "reach to در معنی رسیدن به مکان معمولاً نادرست است."
  ],
  [
    "reporting-verb-enter-no-preposition",
    "enter + place بدون into در معنی ورود به مکان معیار است؛ enter into برای قرارداد/بحث می‌آید.",
    "Enter the building. / enter into an agreement.",
    "enter into the room در کاربردهای خاص/قدیمی ممکن است اما enter the room طبیعی‌تر است."
  ],
  [
    "reporting-verb-approach-no-preposition",
    "approach + person/place بدون to می‌آید.",
    "She approached the manager.",
    "approach to a problem اسم است؛ فعل approach مفعول مستقیم می‌گیرد."
  ],
  [
    "reporting-verb-attend-no-preposition",
    "attend + event/institution بدون to می‌آید.",
    "They attended the meeting.",
    "attend to به معنی رسیدگی کردن است."
  ],
  [
    "reporting-verb-discuss-no-about",
    "discuss + topic بدون about می‌آید.",
    "We discussed the proposal.",
    "have a discussion about ساختار اسمی است."
  ],
  [
    "reporting-verb-describe-no-about",
    "describe + object بدون about می‌آید.",
    "Describe the process.",
    "describe someone as... ساختار مکمل دارد."
  ],
  [
    "reporting-verb-explain-to",
    "explain something to someone؛ explain to someone why/how.",
    "Explain the problem to me.",
    "explain me the problem در انگلیسی معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-suggest-no-person-object",
    "suggest + idea/gerund/that-clause؛ شخص مخاطب با to معرفی می‌شود.",
    "She suggested a plan to us.",
    "suggest us a plan در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-recommend-to",
    "recommend something to someone یا recommend that someone do.",
    "I recommend this book to you.",
    "recommend you this book در معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-say-to-tell",
    "say something to someone؛ tell someone something؛ tell someone to do.",
    "She said hello to me. / She told me the news.",
    "say me نادرست است؛ tell to me در این الگو نادرست است."
  ],
  [
    "reporting-verb-ask-pattern",
    "ask someone a question; ask someone to do; ask about something; ask for something.",
    "She asked me to wait.",
    "ask to someone در معنی پرسیدن از کسی نادرست است."
  ],
  [
    "reporting-verb-answer-no-to",
    "answer a question و answer someone بدون to می‌آیند.",
    "He answered the question.",
    "reply to a question/person با to می‌آید."
  ],
  [
    "reporting-verb-reply-to",
    "reply to someone/something؛ reply that-clause در سبک رسمی ممکن است.",
    "She replied to the email.",
    "reply me در انگلیسی معیار نادرست است."
  ],
  [
    "reporting-verb-contact-no-preposition",
    "contact + person/organization بدون with/to می‌آید.",
    "Please contact the support team.",
    "get in contact with ساختار اسمی جداست."
  ],
  [
    "reporting-verb-phone-call",
    "call/phone someone بدون to؛ make a call to someone با to.",
    "I called the bank.",
    "call to someone می‌تواند معنی فریاد زدن به سوی او داشته باشد."
  ],
  [
    "reporting-verb-mention-no-about",
    "mention + noun/that-clause بدون about می‌آید.",
    "She mentioned the delay.",
    "mention about در معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-emphasize-no-on",
    "emphasize + noun/that-clause؛ place emphasis on + noun.",
    "The report emphasizes transparency.",
    "emphasize on در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-enter-into",
    "enter into + agreement/contract/discussion برای وارد شدن به رابطه/فرایند است.",
    "The parties entered into an agreement.",
    "enter a building بدون into است."
  ],
  [
    "reporting-verb-refer-to",
    "refer to + source/topic برای اشاره؛ refer someone to + person/place برای ارجاع.",
    "The report refers to earlier studies.",
    "refer about نادرست است."
  ],
  [
    "reporting-verb-apply-for-to",
    "apply for a job/grant و apply to an institution؛ apply a rule to a case.",
    "She applied for a grant to the agency.",
    "حرف اضافه با معنی فعل تغییر می‌کند."
  ],
  [
    "reporting-verb-agree-with-on-to",
    "agree with a person/opinion، agree on a topic/decision، agree to a proposal.",
    "We agreed on the date and agreed to the terms.",
    "agree to do نیز به معنی رضایت به انجام عمل است."
  ],
  [
    "reporting-verb-apologize-to-for",
    "apologize to a person for an action.",
    "He apologized to the client for the delay.",
    "ترتیب شخص و علت را حفظ کن."
  ],
  [
    "reporting-verb-complain-to-about",
    "complain to a person/authority about a problem.",
    "They complained to the regulator about fees.",
    "complain of illness و complain that نیز ساختارهای جدا هستند."
  ],
  [
    "reporting-verb-suffer-from",
    "suffer from a condition/problem؛ suffer a loss/damage بدون from.",
    "The company suffered a major loss.",
    "حرف اضافه به نوع مفعول بستگی دارد."
  ],
  [
    "reporting-verb-provide-with",
    "provide someone with something یا provide something for someone.",
    "The agency provided firms with guidance.",
    "supply someone with و supply something to نیز الگوهای واژگانی‌اند."
  ],
  [
    "reporting-verb-supply-to-with",
    "supply something to someone یا supply someone with something.",
    "They supplied data to the bank.",
    "ساختار را با provide اشتباه نکن."
  ],
  [
    "reporting-verb-invest-in",
    "invest in + asset/industry و invest money in something.",
    "They invested in renewable energy.",
    "invest into در برخی کاربردها شنیده می‌شود اما in معیارتر است."
  ],
  [
    "reporting-verb-spend-on",
    "spend money/time on + noun یا spend time + gerund.",
    "They spent millions on infrastructure.",
    "spend for در برخی معانی/گونه‌ها محدود است."
  ],
  [
    "reporting-verb-pay-for",
    "pay for a product/service؛ pay someone for work؛ pay a bill.",
    "They paid for the service.",
    "pay someone money ساختار دو مفعولی نیز ممکن است."
  ],
  [
    "reporting-verb-charge-for",
    "charge someone for something؛ charge a fee for a service.",
    "The bank charged customers for transfers.",
    "charge with در اتهام و charge at در حمله معنی دیگری دارند."
  ],
  [
    "reporting-verb-blame-on",
    "blame something on someone/something؛ blame someone for something.",
    "They blamed the loss on poor planning.",
    "فاعل و مفعول‌ها را با جهت علت اشتباه نکن."
  ],
  [
    "reporting-verb-attribute-to",
    "attribute something to a cause/person.",
    "Analysts attributed the decline to weaker demand.",
    "be attributed to ساختار مجهول رایج است."
  ],
  [
    "reporting-verb-credit-with",
    "credit someone with something یا credit something to someone.",
    "The team was credited with the discovery.",
    "credit to در ثبت حساب/اعتبار معنای دیگری دارد."
  ],
  [
    "reporting-verb-accustom-to",
    "accustom someone to + noun/gerund برای عادت دادن.",
    "The training accustoms users to working securely.",
    "to حرف اضافه است؛ be accustomed to حالت است."
  ],
  [
    "reporting-verb-adapt-to",
    "adapt to + noun/gerund برای سازگار شدن؛ adapt something for/to.",
    "Firms adapted to new rules.",
    "adapt with معمولاً در این معنی نادرست است."
  ],
  [
    "reporting-verb-adjust-to",
    "adjust to + noun/gerund برای سازگار شدن/تنظیم شدن.",
    "Markets adjusted to the policy.",
    "adjust something to a level ساختار متعدی است."
  ],
  [
    "reporting-verb-conform-to",
    "conform to + rule/standard.",
    "The process conforms to international standards.",
    "conform with نیز در برخی کاربردها ممکن است."
  ],
  [
    "reporting-verb-comply-with",
    "comply with + law/rule/request.",
    "The firm complied with regulations.",
    "comply to در انگلیسی معیار نادرست است."
  ],
  [
    "reporting-verb-compete-with-for",
    "compete with/against rivals; compete for a prize/market share.",
    "Firms compete for customers.",
    "compete in a market/event نیز ممکن است."
  ],
  [
    "reporting-verb-depend-on",
    "depend on/upon + noun/wh-clause.",
    "Success depends on execution.",
    "depend of نادرست است."
  ],
  [
    "reporting-verb-rely-on",
    "rely on + person/thing/gerund.",
    "The model relies on historical data.",
    "rely to نادرست است."
  ],
  [
    "reporting-verb-consist-of-in",
    "consist of parts; consist in essence/quality.",
    "The index consists of ten assets.",
    "consist with در معنی سازگار بودن نیست؛ be consistent with."
  ],
  [
    "reporting-verb-result-from-in",
    "result from cause; result in effect.",
    "The fall resulted from weak demand and resulted in losses.",
    "جهت رابطه را با فاعل جمله بررسی کن."
  ],
  [
    "reporting-verb-protect-from-against",
    "protect someone/something from/against danger.",
    "The policy protects consumers from fraud.",
    "against بیشتر بر مقابله/دفاع تأکید دارد."
  ],
  [
    "reporting-verb-prevent-from",
    "prevent someone/something from + gerund.",
    "The rule prevents firms from sharing data.",
    "from را حذف نکن."
  ],
  [
    "reporting-verb-suspect-of",
    "suspect someone of + gerund/noun یا suspect that-clause.",
    "They suspected him of fraud.",
    "suspect someone to do در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-accuse-of-passive",
    "be accused of + noun/gerund؛ accuse someone of.",
    "The firm was accused of concealing losses.",
    "accused for در این معنی نادرست است."
  ],
  [
    "reporting-verb-congratulate-on",
    "congratulate someone on + noun/gerund.",
    "We congratulated her on her promotion.",
    "congratulate for در برخی کاربردهای غیررسمی شنیده می‌شود اما on معیارتر است."
  ],
  [
    "reporting-verb-insist-on-vs-that",
    "insist on + gerund برای پافشاری بر عمل؛ insist that + clause برای مطالبه/ادعا.",
    "He insisted on paying. / insisted that he was innocent.",
    "subjunctive در معنی مطالبه و indicative در معنی ادعای واقعیت ممکن است."
  ],
  [
    "reporting-verb-apologize-for-doing",
    "apologize for + gerund علت عذرخواهی را می‌آورد.",
    "She apologized for interrupting.",
    "apologize to someone for doing دو مکمل با نقش متفاوت دارد."
  ],
  [
    "reporting-verb-thank-for-doing",
    "thank someone for + gerund/noun.",
    "They thanked us for attending.",
    "thank to someone در این معنی نادرست است."
  ],
  [
    "reporting-verb-forgive-for",
    "forgive someone for + noun/gerund.",
    "He forgave her for lying.",
    "forgive someone something نیز در معنی بخشیدن ممکن است."
  ],
  [
    "reporting-verb-punish-for",
    "punish someone for + noun/gerund.",
    "The company was punished for violating the rules.",
    "punish with برای نوع مجازات می‌آید."
  ],
  [
    "reporting-verb-reward-for",
    "reward someone for + noun/gerund.",
    "They rewarded staff for meeting targets.",
    "reward someone with something ساختار دیگری است."
  ],
  [
    "reporting-verb-praise-for",
    "praise someone for + noun/gerund.",
    "The analyst was praised for her accuracy.",
    "praise someone as... ساختار توصیفی است."
  ],
  [
    "reporting-verb-criticize-for",
    "criticize someone for + noun/gerund.",
    "The report criticized the agency for failing to act.",
    "criticize something as... برای ارزیابی است."
  ],
  [
    "reporting-verb-accustom-to-gerund",
    "be/get accustomed to + gerund؛ accustom someone to + gerund.",
    "Workers got accustomed to using the system.",
    "to حرف اضافه است و فعل -ing می‌گیرد."
  ],
  [
    "reporting-verb-object-to-gerund",
    "object to + gerund و object that برای اعتراض/ادعای مخالفت در ساختارهای خاص.",
    "They objected to paying the fee.",
    "object someone to something معنی دیگری دارد."
  ],
  [
    "reporting-verb-appeal-to-for",
    "appeal to someone for help; appeal against a decision; appeal to a court.",
    "The company appealed against the ruling.",
    "حرف اضافه بر نوع appeal وابسته است."
  ],
  [
    "reporting-verb-apply-to-for",
    "apply to an institution for a grant; apply a method to a problem.",
    "She applied to the university for funding.",
    "to و for دو رابطهٔ متفاوت را مشخص می‌کنند."
  ],
  [
    "reporting-verb-search-for",
    "search for something؛ search a place/person یعنی بازرسی کردن.",
    "They searched for evidence. / searched the office.",
    "search about در این معنی معمولاً نادرست است."
  ],
  [
    "reporting-verb-look-for-at-into",
    "look for جست‌وجو؛ look at بررسی/نگاه؛ look into تحقیق؛ look after مراقبت.",
    "The committee looked into the allegation.",
    "particle/preposition معنی فعل عبارتی را تعیین می‌کند."
  ],
  [
    "reporting-verb-care-about-for",
    "care about یعنی اهمیت دادن؛ care for یعنی مراقبت یا علاقه/ترجیح در کاربردهای خاص.",
    "She cares about accuracy. / cares for her father.",
    "care for something در انگلیسی آمریکایی می‌تواند معنی دوست داشتن/میل داشتن دهد."
  ],
  [
    "reporting-verb-wait-for",
    "wait for + person/thing؛ wait to do یعنی منتظر فرصت انجام کاری بودن.",
    "We waited for the results. / waited to hear.",
    "wait someone در انگلیسی معیار نادرست است."
  ],
  [
    "reporting-verb-listen-to",
    "listen to + sound/person؛ hear معمولاً مفعول مستقیم می‌گیرد.",
    "Listen to the announcement. / I heard it.",
    "listen music در انگلیسی معیار نادرست است."
  ],
  [
    "reporting-verb-look-at",
    "look at + object؛ see + object؛ watch + event/activity.",
    "Look at the chart; watch the market; see the result.",
    "تفاوت ارادی/غیرارادی و مدت/فرایند مهم است."
  ],
  [
    "reporting-verb-hear-listen",
    "hear ادراک شنیداری و listen توجه ارادی را بیان می‌کند.",
    "I heard a noise. / I listened to the speech.",
    "hear about/of معنی اطلاع یافتن دارد."
  ],
  [
    "reporting-verb-see-watch",
    "see رویداد را ادراک می‌کند؛ watch مشاهدهٔ ممتد/فعالیت را برجسته می‌کند.",
    "I saw him leave. / watched him working.",
    "see + bare infinitive کل رویداد و -ing روند در جریان را نشان می‌دهد."
  ],
  [
    "reporting-verb-feel-touch",
    "feel می‌تواند ادراک حسی یا حالت عاطفی باشد و linking verb یا transitive شود.",
    "The fabric feels soft. / I felt the surface.",
    "feel like + gerund ساختار میل/حالت است."
  ],
  [
    "reporting-verb-smell-taste",
    "smell/taste به‌عنوان linking verb حالت و به‌عنوان فعل کنشی تجربهٔ حسی را بیان می‌کنند.",
    "The soup tastes good. / She tasted the soup.",
    "stative/action distinction بر progressive اثر می‌گذارد."
  ],
  [
    "reporting-verb-grow-turn-go",
    "grow/turn/go + adjective تغییر حالت را بیان می‌کنند.",
    "The situation grew worse. / The leaves turned yellow.",
    "go bad/crazy و turn red collocationهای واژگانی‌اند."
  ],
  [
    "reporting-verb-remain-stay-keep",
    "remain/stay/keep + adjective یا participle برای تداوم حالت است.",
    "The market remained volatile.",
    "keep someone waiting ساختار مفعول + participle دارد."
  ],
  [
    "reporting-verb-become-get",
    "become رسمی‌تر و get گفتاری‌تر برای تغییر حالت‌اند؛ become + adjective/noun.",
    "The economy became unstable. / got worse.",
    "get + past participle می‌تواند مجهول/تغییر وضعیت باشد."
  ],
  [
    "reporting-verb-seem-look-sound",
    "seem/look/sound + adjective یا like + noun/clause برای برداشت حسی/استنتاج.",
    "It sounds reasonable. / looks like a mistake.",
    "look at و sound out ساختارهای فعلی دیگری‌اند."
  ],
  [
    "reporting-verb-feel-as-if",
    "feel as if/though + clause برای توصیف تجربه/برداشت است.",
    "It feels as if time has stopped.",
    "زمان و وجه در بند وابسته به واقعی/فرضی بودن بستگی دارد."
  ],
  [
    "reporting-verb-smell-of",
    "smell of + noun برای بوی چیزی دادن؛ smell like برای شباهت به بو/توصیف غیررسمی.",
    "The room smells of paint.",
    "smell like a rose در گفتار طبیعی است."
  ],
  [
    "reporting-verb-taste-of",
    "taste of + noun برای مزهٔ چیزی دادن؛ taste like برای تشبیه/توصیف است.",
    "It tastes of lemon. / tastes like lemon.",
    "ساختارهای linking و transitive را تفکیک کن."
  ],
  [
    "reporting-verb-sound-like",
    "sound like + noun/clause برای شباهت شنیداری/برداشت است.",
    "That sounds like a good idea.",
    "sound + adjective ساختار متفاوتی دارد."
  ],
  [
    "reporting-verb-look-like",
    "look like + noun/clause برای ظاهر/شباهت است؛ look as if برای برداشت گزاره‌ای.",
    "It looks like rain. / looks as if it will rain.",
    "look like doing در برخی گونه‌ها به معنی احتمال/ظاهر می‌آید."
  ],
  [
    "reporting-verb-seem-to-have",
    "seem/appear + perfect infinitive برای رویداد پیش از زمان مرجع است.",
    "He seems to have forgotten.",
    "seem that-clause نیز ممکن است: It seems that he forgot."
  ],
  [
    "reporting-verb-happen-to-be",
    "happen to + infinitive برای تصادف/اتفاقی بودن و happen to be برای حضور اتفاقی است.",
    "I happened to be nearby.",
    "happen + that-clause ساختار impersonal جداگانه است."
  ],
  [
    "reporting-verb-turn-out",
    "turn out + adjective/noun/to-infinitive/that-clause برای نتیجهٔ نهایی است.",
    "The forecast turned out to be accurate.",
    "turn out the lights معنی دیگری دارد."
  ],
  [
    "reporting-verb-end-up",
    "end up + gerund/adjective/preposition phrase برای نتیجهٔ نهایی، اغلب غیرمنتظره.",
    "They ended up paying more.",
    "end up to do در این معنی نادرست است."
  ],
  [
    "reporting-verb-wind-up",
    "wind up + gerund/adjective برای سرانجام یافتن، بیشتر غیررسمی است.",
    "We wound up staying overnight.",
    "wind up a company معنی حقوقی/مالی دیگری دارد."
  ],
  [
    "reporting-verb-carry-on",
    "carry on + gerund برای ادامه دادن است؛ carry on with + noun.",
    "They carried on working.",
    "carry on to do می‌تواند رفتن به مرحلهٔ بعدی را بیان کند."
  ],
  [
    "reporting-verb-keep-on",
    "keep on + gerund برای ادامهٔ تکراری/اصراری است.",
    "He kept on asking questions.",
    "keep + object + adjective/participle ساختار دیگری دارد."
  ],
  [
    "reporting-verb-go-ahead",
    "go ahead + gerund در برخی کاربردها، یا go ahead with + noun برای ادامه/شروع.",
    "They went ahead with the merger.",
    "go ahead and + bare infinitive نیز رایج است."
  ],
  [
    "reporting-verb-put-off",
    "put off + gerund/noun برای به تعویق انداختن است.",
    "They put off announcing the results.",
    "put off someone معنی دفع/دل‌زده کردن دارد."
  ],
  [
    "reporting-verb-call-off",
    "call off + noun/event برای لغو کردن است.",
    "They called off the meeting.",
    "call off doing نیز ممکن است اما اسم رویداد طبیعی‌تر است."
  ],
  [
    "reporting-verb-bring-about",
    "bring about + noun برای موجب شدن تغییر/رویداد است.",
    "The reform brought about major changes.",
    "bring about doing معمولاً به‌جای اسم نتیجه نمی‌آید."
  ],
  [
    "reporting-verb-carry-out",
    "carry out + task/research/plan برای اجرا/انجام است.",
    "The team carried out an audit.",
    "carry out a promise کمتر طبیعی از fulfil a promise است."
  ],
  [
    "reporting-verb-set-up",
    "set up + organization/system/meeting برای ایجاد/برپا کردن است.",
    "They set up a new department.",
    "set someone up معنی دیگری دارد."
  ],
  [
    "reporting-verb-take-over",
    "take over + company/role برای تصاحب/عهده‌دار شدن است.",
    "The firm took over its rival.",
    "take over from someone ساختار دیگری است."
  ],
  [
    "reporting-verb-take-up",
    "take up + activity/position/time برای شروع/اشغال کردن است.",
    "She took up a new role.",
    "take up an issue معنی مطرح کردن دارد."
  ],
  [
    "reporting-verb-break-down",
    "break down + machine/process برای از کار افتادن/تجزیه شدن؛ break something down برای تفکیک.",
    "The negotiations broke down.",
    "break down a problem into parts متعدی است."
  ],
  [
    "reporting-verb-break-out",
    "break out برای آغاز ناگهانی جنگ/آتش/بیماری و break out of برای فرار.",
    "A crisis broke out.",
    "break out in a rash و break out of prison ساختارهای جدا هستند."
  ],
  [
    "reporting-verb-bring-up",
    "bring up + topic/child برای مطرح کردن/بزرگ کردن.",
    "She brought up the issue.",
    "bring someone up to speed معنی دیگری دارد."
  ],
  [
    "reporting-verb-point-out",
    "point out + fact/that-clause برای اشاره/تذکر است.",
    "The analyst pointed out that costs had risen.",
    "point something out to someone؛ point at برای اشارهٔ فیزیکی."
  ],
  [
    "reporting-verb-find-out",
    "find out + fact/wh-clause برای کشف/مطلع شدن است.",
    "We found out why the system failed.",
    "find out about + noun نیز ممکن است."
  ],
  [
    "reporting-verb-work-out",
    "work out + solution/result/plan برای حل/محاسبه/از آب درآمدن است.",
    "They worked out a compromise.",
    "work out for someone معنی نتیجه دادن دارد."
  ],
  [
    "reporting-verb-look-up",
    "look up + word/information برای جست‌وجو در منبع است.",
    "Look up the term in a dictionary.",
    "look something up؛ با ضمیر particle میان فعل و مفعول می‌آید."
  ],
  [
    "reporting-verb-look-into",
    "look into + issue/allegation برای بررسی/تحقیق است.",
    "The regulator is looking into the complaint.",
    "look into a room معنی نگاه کردن به داخل دارد."
  ],
  [
    "reporting-verb-look-after",
    "look after + person/thing برای مراقبت است.",
    "She looks after the accounts.",
    "look after oneself و look after a child."
  ],
  [
    "reporting-verb-look-forward-to",
    "look forward to + gerund/noun برای انتظار مشتاقانه است.",
    "We look forward to working with you.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-run-into",
    "run into + problem/person برای برخورد/مواجههٔ اتفاقی است.",
    "We ran into unexpected costs.",
    "run into debt معنی دیگری دارد."
  ],
  [
    "reporting-verb-run-out-of",
    "run out of + resource برای تمام شدن است.",
    "The firm ran out of cash.",
    "run out of time؛ فاعل چیزی است که تمام می‌شود."
  ],
  [
    "reporting-verb-cut-back-on",
    "cut back on + noun/gerund برای کاهش مصرف/هزینه است.",
    "The company cut back on hiring.",
    "cut back costs نیز بدون on ممکن است."
  ],
  [
    "reporting-verb-cut-down-on",
    "cut down on + noun/gerund برای کاهش است.",
    "Households cut down on spending.",
    "cut down a tree معنی دیگری دارد."
  ],
  [
    "reporting-verb-do-away-with",
    "do away with + noun برای حذف/لغو است.",
    "The rule was done away with.",
    "ساختار مجهول و زمان‌های مختلف ممکن است."
  ],
  [
    "reporting-verb-get-away-with",
    "get away with + noun/gerund برای بی‌مجازات ماندن است.",
    "They got away with breaking the rules.",
    "get away with murder اصطلاحی است."
  ],
  [
    "reporting-verb-put-up-with",
    "put up with + noun/gerund برای تحمل است.",
    "We cannot put up with delays.",
    "با put up a building اشتباه نشود."
  ],
  [
    "reporting-verb-look-down-on",
    "look down on + person/thing برای تحقیر/کم‌ارزش دانستن است.",
    "They looked down on small firms.",
    "on حرف اضافهٔ ثابت phrasal-prepositional است."
  ],
  [
    "reporting-verb-catch-up-with",
    "catch up with + person/work برای رسیدن/جبران است.",
    "We need to catch up with competitors.",
    "catch up on work معنی تکمیل کارهای عقب‌مانده است."
  ],
  [
    "reporting-verb-keep-up-with",
    "keep up with + pace/person/trend برای همگام ماندن است.",
    "The system cannot keep up with demand.",
    "keep up appearances معنی دیگری دارد."
  ],
  [
    "reporting-verb-come-up-with",
    "come up with + idea/solution برای ارائه/فکر کردن است.",
    "They came up with a new strategy.",
    "come up against یعنی مواجه شدن با مانع."
  ],
  [
    "reporting-verb-get-down-to",
    "get down to + noun/gerund برای شروع جدی کار است.",
    "Let's get down to analysing the data.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-face-up-to",
    "face up to + problem/reality برای پذیرفتن/مواجه شدن است.",
    "The firm must face up to its losses.",
    "up to در این ساختار بخشی از فعل است."
  ],
  [
    "reporting-verb-live-up-to",
    "live up to + expectation/standard برای برآورده کردن است.",
    "The results lived up to expectations.",
    "live up to a promise نیز ممکن است."
  ],
  [
    "reporting-verb-fall-behind",
    "fall behind + person/schedule برای عقب افتادن است.",
    "The project fell behind schedule.",
    "fall behind in payments نیز ممکن است."
  ],
  [
    "reporting-verb-fall-through",
    "fall through برای عملی نشدن توافق/برنامه است.",
    "The deal fell through.",
    "fall through the floor معنی literal دارد."
  ],
  [
    "reporting-verb-see-through",
    "see through + deception/person برای تشخیص فریب/شناختن ماهیت است.",
    "Investors saw through the promise.",
    "see someone through a crisis معنی حمایت کردن دارد."
  ],
  [
    "reporting-verb-go-through",
    "go through + process/document/difficulty برای طی/بررسی/تجربه است.",
    "The proposal went through several revisions.",
    "go through with a plan یعنی آن را واقعاً انجام دادن."
  ],
  [
    "reporting-verb-get-through",
    "get through + task/person/period برای به پایان رساندن/ارتباط برقرار کردن/عبور است.",
    "We got through the audit.",
    "معنی از بافت و particle تشخیص داده می‌شود."
  ],
  [
    "reporting-verb-put-forward",
    "put forward + proposal/argument برای مطرح کردن است.",
    "She put forward three options.",
    "put someone forward for a role معنی معرفی کردن است."
  ],
  [
    "reporting-verb-bring-forward",
    "bring forward + date/meeting برای جلو انداختن است؛ BrE رایج‌تر.",
    "The meeting was brought forward.",
    "AmE غالباً move up را به‌کار می‌برد."
  ],
  [
    "reporting-verb-put-back",
    "put back + date/item برای عقب انداختن/بازگرداندن است.",
    "The vote was put back until June.",
    "put something back در معنی بازگرداندن به جای اصلی نیز هست."
  ],
  [
    "reporting-verb-push-back",
    "push back + date/deadline برای عقب انداختن و push back against برای مقاومت است.",
    "The launch was pushed back.",
    "register تجاری/گفتاری است."
  ],
  [
    "reporting-verb-bring-in",
    "bring in + law/person/revenue برای معرفی/استخدام/درآمدزایی است.",
    "The government brought in new rules.",
    "bring someone in for questioning معنی دیگری دارد."
  ],
  [
    "reporting-verb-phase-in-out",
    "phase in/out + policy/system برای اجرای تدریجی/حذف تدریجی است.",
    "The tax will be phased in over three years.",
    "مجهول برای سیاست‌گذاری و گزارش رسمی رایج است."
  ],
  [
    "reporting-verb-roll-out",
    "roll out + product/policy/service برای عرضه/اجرای مرحله‌ای است.",
    "The bank rolled out a new service.",
    "roll out a plan اصطلاح تجاری است."
  ],
  [
    "reporting-verb-scale-up-down",
    "scale up/down + operation/production برای افزایش/کاهش مقیاس است.",
    "The company scaled up production.",
    "scale something up و scale up نیز ساختارهای متعدی/لازم دارند."
  ],
  [
    "reporting-verb-step-down",
    "step down از سمت کناره‌گیری کردن؛ step down as + role.",
    "The CEO stepped down.",
    "step down from a position نیز ممکن است."
  ],
  [
    "reporting-verb-step-up",
    "step up + effort/security/production برای افزایش؛ step up as برای قبول نقش.",
    "The bank stepped up monitoring.",
    "step up to the challenge معنی دیگری دارد."
  ],
  [
    "reporting-verb-back-down",
    "back down از موضع/درخواست عقب‌نشینی کردن.",
    "The minister refused to back down.",
    "back down from a demand نیز ممکن است."
  ],
  [
    "reporting-verb-back-out-of",
    "back out of + agreement/commitment برای انصراف از تعهد.",
    "The investor backed out of the deal.",
    "back out بدون of نیز به معنی عقب رفتن فیزیکی است."
  ],
  [
    "reporting-verb-opt-for",
    "opt for + noun و opt to + infinitive برای انتخاب است.",
    "The firm opted for a merger. / opted to merge.",
    "opt in/out ساختارهای دیگری‌اند."
  ],
  [
    "reporting-verb-settle-for",
    "settle for + noun/gerund برای رضایت به گزینهٔ کمتر از مطلوب است.",
    "They settled for a smaller deal.",
    "settle on یعنی انتخاب نهایی کردن."
  ],
  [
    "reporting-verb-settle-on",
    "settle on + choice/plan برای تصمیم نهایی است.",
    "The board settled on a new strategy.",
    "settle down معنی آرام/مستقر شدن دارد."
  ],
  [
    "reporting-verb-agree-to-do",
    "agree to + noun/infinitive برای پذیرفتن پیشنهاد/تعهد است.",
    "They agreed to lower fees.",
    "agree with a person/opinion و agree on a topic تفاوت دارد."
  ],
  [
    "reporting-verb-refuse-to",
    "refuse + to-infinitive برای نپذیرفتن/امتناع است.",
    "The company refused to comment.",
    "refuse + noun نیز ممکن است."
  ],
  [
    "reporting-verb-decline-to",
    "decline + to-infinitive برای رد مؤدبانه/رسمی است.",
    "The minister declined to answer.",
    "decline + noun به معنی کاهش نیز هست."
  ],
  [
    "reporting-verb-choose-to",
    "choose + to-infinitive و choose between/from برای انتخاب است.",
    "They chose to wait.",
    "choose someone as/for نیز ساختارهای دیگری‌اند."
  ],
  [
    "reporting-verb-decide-to",
    "decide + to-infinitive یا decide that-clause؛ decide on + noun.",
    "They decided to postpone the vote.",
    "decide doing در معیار عمومی معمولاً نادرست است."
  ],
  [
    "reporting-verb-plan-to",
    "plan + to-infinitive یا plan on + gerund در کاربرد غیررسمی.",
    "They plan to expand. / plan on expanding.",
    "plan doing بدون on در برخی گونه‌ها شنیده می‌شود اما plan to رایج‌تر است."
  ],
  [
    "reporting-verb-intend-to",
    "intend + to-infinitive یا intend that-clause برای قصد است.",
    "They intend to appeal.",
    "intend on doing در برخی کاربردها غیررسمی است."
  ],
  [
    "reporting-verb-aim-to",
    "aim + to-infinitive یا aim at + gerund/noun برای هدف‌گذاری است.",
    "The policy aims to reduce inflation.",
    "aim at doing و aim to do هر دو ممکن‌اند."
  ],
  [
    "reporting-verb-seek-to",
    "seek + to-infinitive برای تلاش/درخواست رسمی است.",
    "The company seeks to expand.",
    "seek + noun نیز رایج است."
  ],
  [
    "reporting-verb-strive-to",
    "strive + to-infinitive برای تلاش جدی/مستمر است.",
    "The team strives to improve accuracy.",
    "strive for + noun نیز ممکن است."
  ],
  [
    "reporting-verb-endeavour-to",
    "endeavour + to-infinitive رسمی/بریتانیایی‌تر است.",
    "We endeavour to provide accurate data.",
    "endeavor املای آمریکایی است."
  ],
  [
    "reporting-verb-attempt-to",
    "attempt + to-infinitive یا attempt + noun برای تلاش است.",
    "They attempted to negotiate.",
    "attempt doing در برخی بافت‌ها ممکن اما to-infinitive رایج‌تر است."
  ],
  [
    "reporting-verb-try-one's-best",
    "try one's best to + infinitive برای بیشترین تلاش است.",
    "She tried her best to explain.",
    "do one's best نیز ساختار جایگزین است."
  ],
  [
    "reporting-verb-fail-in",
    "fail to do و fail in + noun دو الگوی متفاوت‌اند.",
    "The plan failed to deliver. / failed in its aim.",
    "fail at doing نیز ممکن است."
  ],
  [
    "reporting-verb-succeed-to",
    "succeed in + gerund یعنی موفق شدن؛ succeed to + title/position یعنی جانشین شدن.",
    "She succeeded in winning. / succeeded to the throne.",
    "حرف اضافه معنی را عوض می‌کند."
  ],
  [
    "reporting-verb-manage-to",
    "manage to + infinitive برای موفقیت با دشواری است.",
    "They managed to secure funding.",
    "manage + noun به معنی اداره کردن نیز هست."
  ],
  [
    "reporting-verb-afford-to",
    "afford to + infinitive برای توان مالی/امکانی است.",
    "We cannot afford to wait.",
    "afford + noun: afford a house."
  ],
  [
    "reporting-verb-risk-losing",
    "risk + gerund برای احتمالِ زیان‌بار/به خطر انداختن است.",
    "They risk losing customers.",
    "risk to lose در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-stand-doing",
    "can't stand + gerund/to-infinitive برای تحمل نکردن است.",
    "I can't stand waiting.",
    "در کاربرد عمومی gerund رایج‌تر است."
  ],
  [
    "reporting-verb-can't-help-but",
    "can't help + gerund و can't help but + bare infinitive هر دو درست‌اند.",
    "I couldn't help laughing. / couldn't help but laugh.",
    "can't help to laugh در این معنی نادرست است."
  ],
  [
    "reporting-verb-would-prefer",
    "would prefer + to-infinitive و would prefer + object + to-infinitive.",
    "I'd prefer to wait. / I'd prefer you to wait.",
    "would rather + subject + past الگوی دیگری است."
  ],
  [
    "reporting-verb-would-like",
    "would like + noun/to-infinitive برای خواستهٔ مؤدبانه است.",
    "I'd like to ask a question.",
    "would like someone to do نیز ممکن است."
  ],
  [
    "reporting-verb-would-love",
    "would love + to-infinitive برای خواستهٔ مشتاقانه است.",
    "We'd love to help.",
    "would love doing معنی عادت/لذت عمومی می‌تواند بدهد اما کمتر در خواستهٔ موقعیتی."
  ],
  [
    "reporting-verb-would-hate",
    "would hate + to-infinitive برای نخواستن/نگرانی از انجام عمل است.",
    "I'd hate to disappoint you.",
    "would hate someone doing نیز ممکن است."
  ],
  [
    "reporting-verb-would-rather-not",
    "would rather not + bare infinitive برای ترجیح منفی است.",
    "I'd rather not comment.",
    "پس از rather to نمی‌آید."
  ],
  [
    "reporting-verb-had-better-not",
    "had better not + bare infinitive برای هشدار/توصیهٔ منفی است.",
    "You had better not delay.",
    "had بهتر است با فاعل و زمان حال/آینده فهمیده شود."
  ],
  [
    "reporting-verb-would-sooner",
    "would sooner + bare infinitive برای ترجیح است، رسمی/کم‌کاربردتر از would rather.",
    "I'd sooner wait.",
    "would sooner + subject + past نیز ممکن است."
  ],
  [
    "reporting-verb-would-just-as-soon",
    "would just as soon + bare infinitive برای ترجیح قوی/مودبانه است.",
    "I'd just as soon leave.",
    "کاربرد نسبتاً رسمی/قدیمی‌تر است."
  ],
  [
    "reporting-verb-prefer-rather-than",
    "prefer to do rather than do ساختار موازی می‌خواهد.",
    "I prefer to walk rather than drive.",
    "prefer doing to doing نیز الگوی موازی gerund دارد."
  ],
  [
    "reporting-verb-would-rather-than",
    "would rather do than do دو مصدر بدون to را موازی می‌کند.",
    "I'd rather walk than drive.",
    "پس از would rather مصدر بدون to می‌آید."
  ],
  [
    "reporting-verb-like-better",
    "like A better than B برای ترجیح و like doing/to do برای علاقه/عادت است.",
    "I like reading better than watching TV.",
    "better قید مقایسه‌ای است و جایگاهش مهم است."
  ],
  [
    "reporting-verb-love-hate-ing",
    "love/hate + gerund اغلب علاقه/انزجار عمومی یا تجربه را نشان می‌دهد.",
    "She hates waiting.",
    "love to do می‌تواند ترجیح/عادت را در موقعیت مشخص برجسته کند."
  ],
  [
    "reporting-verb-go-gerund-activity",
    "go + gerund برای فعالیت‌های تفریحی/حرکتی تثبیت‌شده به‌کار می‌رود.",
    "go swimming, go shopping, go hiking",
    "برای همهٔ gerundها مولد نیست؛ collocation را یاد بگیر."
  ],
  [
    "reporting-verb-do-make-collocation",
    "do برای فعالیت/وظیفه و make برای ایجاد/تولید نتیجه در collocationهای ثابت رایج‌اند.",
    "do research; make a decision",
    "ترکیب‌های تثبیت‌شده استثنا دارند: make an effort, do business."
  ],
  [
    "reporting-verb-have-take-collocation",
    "have/take با اسم‌های کنش‌نما ترکیب‌های واژگانی می‌سازند.",
    "have a meeting; take a break",
    "انتخاب فعل سبک به collocation وابسته است."
  ],
  [
    "reporting-verb-give-collocation",
    "give با اسم‌های ارتباط/واکنش/ارائه ترکیب می‌سازد.",
    "give advice; give a presentation",
    "give an advice نادرست است؛ advice mass noun است."
  ],
  [
    "reporting-verb-pay-attention",
    "pay attention to + noun/gerund؛ attention حرف اضافهٔ to می‌گیرد.",
    "Pay attention to detail.",
    "to حرف اضافه است و gerund می‌گیرد."
  ],
  [
    "reporting-verb-take-into-account",
    "take something into account برای درنظرگرفتن است.",
    "We must take inflation into account.",
    "account for به معنی توضیح/تشکیل سهم است."
  ],
  [
    "reporting-verb-take-advantage-of",
    "take advantage of + noun/gerund برای بهره‌برداری/سوءاستفاده است.",
    "They took advantage of the opportunity.",
    "of حرف اضافه است."
  ],
  [
    "reporting-verb-make-sense",
    "make sense و make sense of دو ساختار متفاوت‌اند.",
    "The explanation makes sense. / make sense of the data.",
    "make sense to someone نیز ممکن است."
  ],
  [
    "reporting-verb-make-sure",
    "make sure + that-clause/to-infinitive برای اطمینان از انجام کار است.",
    "Make sure that the figures are correct.",
    "make sure of + noun/gerund نیز ممکن است."
  ],
  [
    "reporting-verb-make-up",
    "make up + story/excuse برای ساختن؛ make up for برای جبران.",
    "He made up an excuse. / made up for the loss.",
    "make up a team معنی تشکیل دادن نیز دارد."
  ],
  [
    "reporting-verb-make-out",
    "make out + that-clause برای ادعا/وانمود کردن و make out + object برای تشخیص است.",
    "He made out that he was innocent.",
    "make out a cheque معنی نوشتن چک است."
  ],
  [
    "reporting-verb-make-do-with",
    "make do with + noun برای سر کردن با امکانات محدود است.",
    "We had to make do with old equipment.",
    "make do بدون with نیز در برخی ساختارها می‌آید."
  ],
  [
    "reporting-verb-do-without",
    "do without + noun برای بی‌نیاز/محروم بودن است.",
    "We cannot do without reliable data.",
    "do without doing نیز ممکن است."
  ],
  [
    "reporting-verb-have-something-done",
    "have + object + past participle برای سپردن کار به دیگری یا تجربهٔ رویداد است.",
    "She had her laptop repaired.",
    "معنی causative و تجربهٔ ناخواسته از بافت مشخص می‌شود."
  ],
  [
    "reporting-verb-get-something-done",
    "get + object + past participle برای ترتیب دادن/موفق شدن به انجام کار است.",
    "We got the documents translated.",
    "get someone to do با get something done فرق دارد."
  ],
  [
    "reporting-verb-have-someone-do",
    "have + person + bare infinitive برای دستور/ترتیب انجام کار است.",
    "I had the analyst check the figures.",
    "در مجهول/تجربه ساختار تغییر می‌کند."
  ],
  [
    "reporting-verb-get-someone-to-do",
    "get + person + to-infinitive برای ترغیب/واداشتن است.",
    "She got him to reconsider.",
    "to در این ساختار لازم است."
  ],
  [
    "reporting-verb-make-someone-do",
    "make + person + bare infinitive برای اجبار/واداشتن است.",
    "The news made investors panic.",
    "در مجهول to برمی‌گردد: investors were made to panic."
  ],
  [
    "reporting-verb-let-someone-do",
    "let + person + bare infinitive برای اجازه دادن است.",
    "They let us leave early.",
    "مجهول معمولاً be allowed to است."
  ],
  [
    "reporting-verb-help-someone-do",
    "help + person + bare infinitive یا to-infinitive هر دو درست‌اند.",
    "She helped me understand/to understand.",
    "در انگلیسی آمریکایی bare infinitive رایج است؛ هر دو معیارند."
  ],
  [
    "reporting-verb-see-someone-do",
    "see/hear/watch + object + bare infinitive برای کل رویداد و -ing برای بخشی در جریان.",
    "I heard her sing. / heard her singing.",
    "در مجهول، to-infinitive می‌آید: She was heard to sing."
  ],
  [
    "reporting-verb-feel-someone-do",
    "feel + object + bare infinitive برای ادراک عمل/حرکت است.",
    "I felt the ground shake.",
    "feel + -ing برای تجربهٔ روند در جریان ممکن است."
  ],
  [
    "reporting-verb-notice-observe",
    "notice/observe + object + bare infinitive یا -ing بر کل رویداد/روند تمرکز دارد.",
    "I noticed him leave/leaving.",
    "انتخاب بافتی است و گاهی تفاوت ظریف دارد."
  ],
  [
    "reporting-verb-watch-someone-doing",
    "watch + object + -ing برای مشاهدهٔ روند و bare infinitive برای کل رویداد است.",
    "We watched the sun set.",
    "در کاربردهای واقعی هم‌پوشانی وجود دارد."
  ],
  [
    "reporting-verb-find-object-adjective",
    "find + object + adjective/noun برای ارزیابی/کشف وضعیت است.",
    "I found the task difficult.",
    "find that-clause و find someone doing ساختارهای دیگری‌اند."
  ],
  [
    "reporting-verb-keep-object-adjective",
    "keep + object + adjective/participle برای حفظ وضعیت است.",
    "Keep the door closed.",
    "keep someone waiting ساختار object + -ing دارد."
  ],
  [
    "reporting-verb-leave-object-adjective",
    "leave + object + adjective/participle برای باقی گذاشتن در وضعیت است.",
    "The news left investors confused.",
    "leave someone to do معنی دیگری دارد."
  ],
  [
    "reporting-verb-want-object-infinitive",
    "want + object + to-infinitive برای خواستن از شخصی که کاری کند.",
    "I want you to review this.",
    "want + gerund در برخی گونه‌های BrE می‌تواند معنای مجهول داشته باشد."
  ],
  [
    "reporting-verb-need-object-infinitive",
    "need + object + to-infinitive برای نیاز به انجام کار توسط شخص است.",
    "We need you to respond.",
    "need doing و need to be done ساختارهای مجهول‌معنا هستند."
  ],
  [
    "reporting-verb-expect-object-infinitive",
    "expect + object + to-infinitive برای انتظار انجام عمل از فاعل ضمنی است.",
    "We expect the team to deliver.",
    "expect that-clause نیز ممکن است."
  ],
  [
    "reporting-verb-would-like-object-infinitive",
    "would like + object + to-infinitive درخواست مؤدبانه دربارهٔ عمل دیگری است.",
    "I'd like you to reconsider.",
    "would like + noun و would like to do ساختارهای دیگرند."
  ],
  [
    "reporting-verb-prefer-object-infinitive",
    "prefer + object + to-infinitive برای ترجیح عمل دیگری است.",
    "I'd prefer you to stay.",
    "would rather + subject + past ساختار متفاوتی دارد."
  ],
  [
    "reporting-verb-allow-object-infinitive",
    "allow + object + to-infinitive برای اجازه به شخص؛ allow + gerund بدون object.",
    "They allowed staff to leave. / allowed leaving early.",
    "مفعول را در ساختار اول حذف نکن."
  ],
  [
    "reporting-verb-encourage-object-infinitive",
    "encourage + object + to-infinitive برای تشویق است.",
    "The policy encourages firms to invest.",
    "encourage doing نیز برای فعالیت کلی می‌آید."
  ],
  [
    "reporting-verb-force-object-infinitive",
    "force + object + to-infinitive برای اجبار است.",
    "The crisis forced the firm to sell assets.",
    "make + object + bare infinitive است؛ to اضافه نکن."
  ],
  [
    "reporting-verb-persuade-object-infinitive",
    "persuade + object + to-infinitive برای متقاعد کردن به عمل است.",
    "They persuaded investors to wait.",
    "persuade someone into doing نیز ممکن است."
  ],
  [
    "reporting-verb-remind-object-infinitive",
    "remind + object + to-infinitive برای یادآوری وظیفه است.",
    "Remind me to send the report.",
    "remind someone of something ساختار دیگری است."
  ],
  [
    "reporting-verb-warn-object-infinitive",
    "warn + object + (not) to-infinitive برای هشدار/منع است.",
    "They warned us not to enter.",
    "warn against + gerund نیز رایج است."
  ],
  [
    "reporting-verb-order-object-infinitive",
    "order + object + to-infinitive برای دستور رسمی است.",
    "The court ordered the company to pay.",
    "order that + subjunctive نیز ممکن است."
  ],
  [
    "reporting-verb-tell-object-infinitive",
    "tell + object + to-infinitive برای دستور/توصیه است.",
    "She told him to wait.",
    "say someone to wait نادرست است."
  ],
  [
    "reporting-verb-ask-object-infinitive",
    "ask + object + to-infinitive برای درخواست است.",
    "I asked them to help.",
    "ask to do یعنی درخواست کردن برای خود فاعل."
  ],
  [
    "reporting-verb-invite-object-infinitive",
    "invite + object + to-infinitive برای دعوت است.",
    "They invited us to attend.",
    "invite someone for dinner نیز ممکن است."
  ],
  [
    "reporting-verb-advise-object-infinitive",
    "advise + object + to-infinitive برای توصیه به شخص است.",
    "Doctors advised him to rest.",
    "advise doing برای توصیهٔ کلی است."
  ],
  [
    "reporting-verb-instruct-object-infinitive",
    "instruct + object + to-infinitive برای دستور/راهنمایی رسمی است.",
    "The regulator instructed banks to report.",
    "instruct that + subjunctive نیز ممکن است."
  ],
  [
    "reporting-verb-remind-that",
    "remind + object + that-clause برای یادآوری واقعیت/تعهد است.",
    "She reminded us that the deadline was near.",
    "مفعول شخصی معمولاً لازم است."
  ],
  [
    "reporting-verb-inform-of-that",
    "inform someone of/about + noun یا inform someone that-clause.",
    "They informed us that the meeting was cancelled.",
    "inform to someone نادرست است."
  ],
  [
    "reporting-verb-notify-of-that",
    "notify someone of + noun یا notify someone that-clause در سبک رسمی.",
    "Users were notified that the service was down.",
    "notify about نیز در کاربردهای خاص دیده می‌شود."
  ],
  [
    "reporting-verb-advise-that",
    "advise that + base verb در subjunctive یا should + base در برخی گونه‌ها.",
    "The doctor advised that he rest.",
    "advise that he rests در بعضی گونه‌ها/معنی‌ها ممکن است."
  ],
  [
    "reporting-verb-demand-that",
    "demand that + base verb در mandative subjunctive.",
    "They demanded that the report be published.",
    "demand that someone should do در BrE نیز رایج است."
  ],
  [
    "reporting-verb-insist-that",
    "insist that + subjunctive برای مطالبه؛ indicative برای اصرار بر صحت ادعا.",
    "She insisted that he leave. / insisted that he was innocent.",
    "معنی را با نوع بند و بافت تشخیص بده."
  ],
  [
    "reporting-verb-suggest-that",
    "suggest that + base verb در mandative معنی پیشنهاد؛ indicative در معنی اشاره/استنباط.",
    "They suggested that he resign. / Evidence suggests that he lied.",
    "این تفاوت معنایی برای تفسیر مهم است."
  ],
  [
    "reporting-verb-recommend-that",
    "recommend that + base verb یا should + base برای توصیه رسمی.",
    "We recommend that the bank act.",
    "recommend that the bank acts در برخی گونه‌ها رایج اما subjunctive رسمی‌تر است."
  ],
  [
    "reporting-verb-propose-that",
    "propose that + base verb/should + base برای پیشنهاد رسمی.",
    "They proposed that taxes be reduced.",
    "propose to do برای قصد فاعل است."
  ],
  [
    "reporting-verb-request-that",
    "request that + base verb/should + base برای درخواست رسمی.",
    "They requested that access be restored.",
    "در انگلیسی آمریکایی subjunctive ساده رایج‌تر است."
  ],
  [
    "reporting-verb-order-that",
    "order that + base verb/should + base برای دستور رسمی/حقوقی.",
    "The court ordered that the assets be frozen.",
    "فاعل بند وابسته می‌تواند متفاوت از فاعل اصلی باشد."
  ],
  [
    "reporting-verb-essential-that",
    "essential/important/necessary + that-clause در mandative subjunctive.",
    "It is essential that every user be informed.",
    "در BrE should نیز رایج است."
  ],
  [
    "reporting-verb-it-is-time",
    "it is important/imperative/vital that + base verb یا should + base.",
    "It is vital that the data remain secure.",
    "remain در subjunctive شکل پایه است؛ برای سوم‌شخص s نمی‌گیرد."
  ],
  [
    "reporting-verb-wish-that",
    "wish + past/past perfect/would بسته به زمان و کنترل وضعیت.",
    "I wish the policy were different.",
    "wish + that-clause واقعی با hope تفاوت دارد."
  ],
  [
    "reporting-verb-hope-that",
    "hope + present/future/past perfect برای امید به احتمال واقعی‌تر است.",
    "I hope the talks succeed.",
    "hope را با wish خلاف واقع اشتباه نکن."
  ],
  [
    "reporting-verb-if-only-that",
    "if only + past/past perfect/would برای آرزو/پشیمانی/شکایت است.",
    "If only they had listened.",
    "زمان مرجع و نوع کنترل وضعیت تعیین‌کننده است."
  ],
  [
    "reporting-verb-would-rather-clause",
    "would rather + subject + past simple برای ترجیح حال/آینده و past perfect برای گذشته.",
    "I'd rather you stayed. / had stayed.",
    "فاعل دوم در بند ترجیحی می‌آید."
  ],
  [
    "reporting-verb-as-if-clause",
    "as if + past برای فاصلهٔ فرضی حال و past perfect برای گذشتهٔ خلاف واقع.",
    "He acts as if he owned the place.",
    "اگر واقعیت محتمل باشد زمان عادی نیز ممکن است."
  ],
  [
    "reporting-verb-suppose-subjunctive",
    "suppose/supposing + past یا were برای طرح فرض دور.",
    "Suppose the bank were to fail...",
    "فرض واقعی می‌تواند حال ساده بگیرد."
  ],
  [
    "reporting-verb-imagine-subjunctive",
    "imagine + past/were برای سناریوی فرضی.",
    "Imagine you were the governor.",
    "درخواست/دعوت به تصور با امر نیز ممکن است."
  ],
  [
    "reporting-verb-if-i-were-you",
    "If I were you یک ساختار تثبیت‌شدهٔ توصیه با subjunctive است.",
    "If I were you, I'd wait.",
    "If I was you در گفتار شنیده می‌شود اما were معیار رسمی است."
  ],
  [
    "reporting-verb-were-it-not",
    "Were it not for + noun و Had it not been for + noun شرطی وارونه‌اند.",
    "Were it not for the subsidy, prices would rise.",
    "ساختار رسمی و فشرده است."
  ],
  [
    "reporting-verb-had-it-not-been",
    "Had it not been for + noun برای شرط خلاف واقع گذشته است.",
    "Had it not been for the intervention, the bank would have failed.",
    "معادل if it had not been for است."
  ],
  [
    "reporting-verb-should-you",
    "Should + subject + base verb وارونگی رسمی شرطی با حذف if است.",
    "Should you need assistance, contact us.",
    "should در اینجا احتمال/احتیاط را نشان می‌دهد."
  ],
  [
    "reporting-verb-were-you-to",
    "Were + subject + to-infinitive شرط فرضی رسمی است.",
    "Were the bank to collapse, markets would react.",
    "در گفتار روزمره if ساده‌تر است."
  ],
  [
    "reporting-verb-had-i-known",
    "Had + subject + past participle وارونگی شرطی نوع سوم است.",
    "Had I known, I would have objected.",
    "فاعل پس از had می‌آید؛ had را با فعل اصلی اشتباه نکن."
  ],
  [
    "reporting-verb-only-if-inversion",
    "Only if در آغاز جمله وارونگی بند اصلی را می‌سازد.",
    "Only if demand rises will output expand.",
    "در بند if ترتیب عادی می‌ماند."
  ],
  [
    "reporting-verb-not-only-inversion",
    "Not only در آغاز بند موجب وارونگی auxiliary می‌شود.",
    "Not only did prices rise, but wages fell.",
    "اگر not only در جایگاه میانی باشد وارونگی نیست."
  ],
  [
    "reporting-verb-little-inversion",
    "Little در آغاز به معنی hardly/not much موجب وارونگی است.",
    "Little did they know what would happen.",
    "little به‌عنوان کمیت‌نمای اسم در ساختار عادی وارونگی نمی‌سازد."
  ],
  [
    "reporting-verb-at-no-time-inversion",
    "قیدهای منفی مانند at no time و under no circumstances در آغاز موجب وارونگی می‌شوند.",
    "At no time did the bank admit liability.",
    "این وارونگی در نثر رسمی/تأکیدی است."
  ],
  [
    "reporting-verb-no-sooner-inversion",
    "No sooner + past perfect وارونگی و than + past simple می‌گیرد.",
    "No sooner had the vote ended than protests began.",
    "hardly/scarcely با when/before می‌آیند."
  ],
  [
    "reporting-verb-hardly-inversion",
    "Hardly/scarcely + past perfect با وارونگی و when/before بند دوم می‌گیرد.",
    "Hardly had trading begun when prices fell.",
    "این ساختار رسمی/روایی است."
  ],
  [
    "reporting-verb-seldom-inversion",
    "seldom/rarely/never در آغاز جمله موجب وارونگی می‌شوند.",
    "Seldom have we seen such growth.",
    "در جایگاه عادی قید، وارونگی لازم نیست."
  ],
  [
    "reporting-verb-so-adjective-inversion",
    "So + adjective + be + subject + that برای تأکید و نتیجه است.",
    "So severe was the crisis that banks closed.",
    "ساختار عادی so...that نیز ممکن است."
  ],
  [
    "reporting-verb-such-noun-inversion",
    "Such + be + noun phrase + that ساختار تأکیدی رسمی است.",
    "Such was the demand that queues formed.",
    "ترتیب عادی such...that نیز وجود دارد."
  ],
  [
    "reporting-verb-as-inversion",
    "در مقایسه/توافق رسمی، as + auxiliary + subject می‌تواند وارونگی داشته باشد.",
    "She works hard, as do her colleagues.",
    "ساختار عادی as her colleagues do نیز درست است."
  ],
  [
    "reporting-verb-than-inversion",
    "پس از than در نثر رسمی، auxiliary می‌تواند پیش از فاعل بیاید.",
    "The result was worse than had been expected.",
    "ترتیب عادی than was expected رایج‌تر است."
  ],
  [
    "reporting-verb-neither-inversion",
    "Neither/nor در پاسخ یا آغاز بند منفی با auxiliary و subject وارونگی می‌سازد.",
    "Neither did the minister respond.",
    "neither...nor هماهنگی دو جزء نیز می‌سازد."
  ],
  [
    "reporting-verb-so-inversion",
    "So + auxiliary + subject برای هم‌نظری مثبت است.",
    "Inflation rose, and so did unemployment.",
    "so در معنی بنابراین وارونگی این ساختار را ندارد."
  ],
  [
    "reporting-verb-here-there-inversion",
    "here/there + verb + noun برای معرفی/روایت ممکن است.",
    "Here comes the train. / There goes our chance.",
    "با ضمیر فاعلی معمولاً ترتیب عادی می‌آید: Here it comes."
  ],
  [
    "reporting-verb-locative-inversion",
    "عبارت مکان آغازین با افعال ایستا/حرکت می‌تواند وارونگی فاعل اسمی ایجاد کند.",
    "At the centre of the city stood a bank.",
    "این ساختار ادبی/روایی است و با فاعل ضمیری محدودتر."
  ],
  [
    "reporting-verb-quotative-inversion",
    "در نقل قول ادبی، said/asked + subject می‌تواند پس از نقل قول بیاید.",
    "'Never,' said the chairman.",
    "در گفتار عادی subject + said رایج است."
  ],
  [
    "reporting-verb-there-exist",
    "there exists/there exist ساختار رسمی وجودی است و فعل با فاعل پس از آن هماهنگ می‌شود.",
    "There exists a clear alternative.",
    "there is/are طبیعی‌تر و عمومی‌تر است."
  ],
  [
    "reporting-verb-it-seems",
    "it seems/appears that + clause برای استنتاج غیرشخصی است.",
    "It appears that the data were altered.",
    "seem + to-infinitive نیز ممکن است."
  ],
  [
    "reporting-verb-it-turns-out",
    "it turns out that + clause برای نتیجهٔ کشف‌شده است.",
    "It turns out that the figures were wrong.",
    "turn out + to-infinitive ساختار دیگر است."
  ],
  [
    "reporting-verb-it-transpires",
    "it transpires that رسمی/خبری برای آشکار شدن واقعیت است.",
    "It later transpired that funds were missing.",
    "register رسمی/حقوقی دارد."
  ],
  [
    "reporting-verb-there-is-no-point",
    "there is no point (in) + gerund برای بی‌فایده بودن است.",
    "There is no point arguing.",
    "point in + gerund؛ مصدر با to در این ساختار معیار نیست."
  ],
  [
    "reporting-verb-it-is-no-use",
    "it is no use/no good + gerund برای بی‌فایده بودن است.",
    "It is no use complaining.",
    "there is no use in + gerund نیز ممکن است."
  ],
  [
    "reporting-verb-it-is-worth",
    "it is worth + gerund برای ارزش داشتن است.",
    "It is worth checking the source.",
    "worth to check در این معنی معیار نیست."
  ],
  [
    "reporting-verb-it-takes",
    "it takes + time/person + to-infinitive برای مدت/نیاز است.",
    "It takes two hours to finish.",
    "take someone time to do ساختار جایگزین است."
  ],
  [
    "reporting-verb-it-costs",
    "it costs + amount + to-infinitive برای هزینه است.",
    "It costs $10 to subscribe.",
    "cost someone money/time ساختار مستقیم نیز دارد."
  ],
  [
    "reporting-verb-it-matters",
    "it matters + wh/that/to-infinitive برای اهمیت است.",
    "It matters whether the data are accurate.",
    "what matters is... ساختار pseudo-cleft است."
  ],
  [
    "reporting-verb-what-matters",
    "what-clause می‌تواند فاعل/موضوع کانونی بسازد.",
    "What matters is the quality of evidence.",
    "فعل ربطی با مکمل بعدی توافق معنایی/دستوری پیچیده دارد."
  ],
  [
    "reporting-verb-all-that",
    "all (that) + clause برای تنها چیزی که/تمام چیزی که است.",
    "All I need is time.",
    "all می‌تواند فاعل مفرد یا جمع با توجه به مرجع باشد."
  ],
  [
    "reporting-verb-the-thing-that",
    "the thing/person/place + relative clause برای ارجاع صریح‌تر است.",
    "The thing that matters is timing.",
    "what می‌تواند fused relative و بدون antecedent باشد."
  ],
  [
    "reporting-verb-wh-cleft",
    "what/where/why-cleft برای تمرکز بر عمل/مکان/علت است.",
    "What we need is more evidence.",
    "فعل be و توافق با مکمل تابع ساختار و تحلیل است."
  ],
  [
    "reporting-verb-it-cleft",
    "it-cleft با it + be + focus + relative clause برای برجسته‌سازی است.",
    "It was the timing that mattered.",
    "زمان be و ضمیر موصولی با کانون هماهنگ می‌شوند."
  ],
  [
    "reporting-verb-all-cleft",
    "all-cleft کانون را بر تنها چیزی که رخ داده/لازم است می‌گذارد.",
    "All I did was ask a question.",
    "پس از was گاهی مصدر با to و گاهی bare infinitive در ساختارهای خاص می‌آید."
  ],
  [
    "reporting-verb-there-cleft",
    "there-cleft عنصر تازه/وجودی را معرفی می‌کند.",
    "There was a time when markets were stable.",
    "این ساختار با there فاعل مکانی متفاوت است."
  ],
  [
    "reporting-verb-fronted-object",
    "مفعول یا مکمل می‌تواند برای تقابل به آغاز منتقل شود.",
    "This question, nobody has answered.",
    "fronting تأکید می‌سازد و معمولاً وارونگی ندارد."
  ],
  [
    "reporting-verb-topicalization",
    "موضوع‌سازی با left-dislocation یا fronting رابطهٔ گفتمانی می‌سازد.",
    "As for the forecast, it remains uncertain.",
    "as for دربارهٔ موضوع است و جایگاه نحوی فاعل را نمی‌گیرد."
  ],
  [
    "reporting-verb-passive-topicalization",
    "مجهول می‌تواند موضوع جمله را به فاعل دستوری تبدیل کند و عامل را حذف کند.",
    "The proposal was rejected.",
    "برای شفافیت مسئولیت، عامل را در صورت اهمیت ذکر کن."
  ],
  [
    "reporting-verb-agentless-passive",
    "مجهول بی‌عامل وقتی عامل ناشناخته/نامهم است مناسب است.",
    "The files were deleted.",
    "حذف عامل نباید برای پنهان کردن مسئولیت در گزارش شفاف به‌کار رود."
  ],
  [
    "reporting-verb-by-agent",
    "by-phrase عامل/سبب را در مجهول معرفی می‌کند؛ با ابزار by متفاوت است.",
    "The report was written by the analyst.",
    "by + agent و with + instrument را تفکیک کن."
  ],
  [
    "reporting-verb-with-instrument",
    "with-phrase ابزار/وسیله را معرفی می‌کند.",
    "The lock was opened with a key.",
    "by a key در معنی ابزار معمولاً نادرست/نامأنوس است."
  ],
  [
    "reporting-verb-passive-preposition",
    "در مجهول حرف اضافهٔ فعل حفظ می‌شود و در پایان یا fronted position می‌آید.",
    "The issue was dealt with.",
    "با فعل‌های چندبخشی، particle/preposition را حذف نکن."
  ],
  [
    "reporting-verb-get-passive-register",
    "get-passive در گفتار/خبر برای رویداد یا تجربهٔ فاعل رایج است.",
    "He got promoted.",
    "در نثر رسمی be-passive خنثی‌تر است."
  ],
  [
    "reporting-verb-have-passive-causative",
    "have + object + past participle causative و تجربهٔ ناخواسته را بیان می‌کند.",
    "We had the system tested.",
    "فاعل لزوماً انجام‌دهندهٔ عمل نیست."
  ],
  [
    "reporting-verb-need-passive-gerund",
    "need + gerund می‌تواند مجهول‌معنا باشد.",
    "The figures need checking.",
    "در برخی گونه‌ها want + gerund نیز مشابه است."
  ],
  [
    "reporting-verb-modal-passive",
    "modal + be + past participle مجهول وجهی می‌سازد.",
    "The data must be protected.",
    "modal perfect passive: may have been altered."
  ],
  [
    "reporting-verb-perfect-passive",
    "have/has/had + been + past participle برای perfect passive است.",
    "The files have been reviewed.",
    "زمان و شمار auxiliary را با فاعل هماهنگ کن."
  ],
  [
    "reporting-verb-progressive-passive",
    "be + being + past participle برای مجهول استمراری است.",
    "The bridge is being repaired.",
    "با perfect passive تفاوت دارد: has been repaired."
  ],
  [
    "reporting-verb-future-passive",
    "will be + past participle برای مجهول آینده است.",
    "The results will be published tomorrow.",
    "be going to be published نیز ممکن است."
  ],
  [
    "reporting-verb-passive-infinitive",
    "to be + past participle مصدر مجهول است؛ perfect passive infinitive تقدم زمانی دارد.",
    "The report needs to be revised. / to have been revised.",
    "مجهول بودن و زمان مرجع را جدا تحلیل کن."
  ],
  [
    "reporting-verb-passive-gerund",
    "being + past participle gerund مجهول و having been + participle gerund perfect passive است.",
    "He dislikes being criticised.",
    "پس از حرف اضافه نیز gerund مجهول می‌آید."
  ],
  [
    "reporting-verb-participle-passive",
    "past participle می‌تواند صفت یا reduced passive clause باشد.",
    "the data collected yesterday",
    "تفاوت صفت واژگانی و participle فعلی از معنی و مکمل‌ها تشخیص داده می‌شود."
  ],
  [
    "reporting-verb-participle-active",
    "present participle در reduced clause رابطهٔ فعال/هم‌زمانی می‌سازد.",
    "Investors reacting to the news sold shares.",
    "فاعل ضمنی باید با فاعل بند اصلی سازگار باشد."
  ],
  [
    "reporting-verb-perfect-participle",
    "having + past participle تقدم زمانی را در بند participle نشان می‌دهد.",
    "Having completed the audit, they published the report.",
    "فاعل ضمنی و رابطهٔ زمانی باید روشن باشد."
  ],
  [
    "reporting-verb-absolute-participle",
    "absolute construction فاعل مستقل دارد و زمینهٔ رویداد را می‌دهد.",
    "Weather permitting, the flight will depart.",
    "این ساختار رسمی و فشرده است."
  ],
  [
    "reporting-verb-dangling-participle",
    "dangling modifier وقتی فاعل ضمنی participle با فاعل بند اصلی هم‌خوان نیست رخ می‌دهد.",
    "Walking to work, the rain began. (dangling)",
    "بازنویسی: As I was walking to work, it began to rain."
  ],
  [
    "reporting-verb-reduced-adverbial",
    "بند قیدی با حذف فاعل و auxiliary به participle کاهش می‌یابد، اگر فاعل مشترک باشد.",
    "When asked, she declined to comment.",
    "اگر فاعل‌ها متفاوت‌اند، حذف فاعل مجاز نیست."
  ],
  [
    "reporting-verb-reduced-relative",
    "بند موصولی فعال به -ing و مجهول به past participle کاهش می‌یابد.",
    "the people waiting; the documents signed yesterday",
    "حذف ضمیر و auxiliary باید رابطهٔ موصولی را حفظ کند."
  ],
  [
    "reporting-verb-perfect-relative",
    "بند موصولی می‌تواند perfect aspect داشته باشد و تقدم زمانی را نشان دهد.",
    "The report, which had been revised twice, was released.",
    "در reduced form ممکن است ساختار سنگین شود."
  ],
  [
    "reporting-verb-nonfinite-subject",
    "مصدر/gerund clause می‌تواند فاعل باشد و توافق فعل معمولاً مفرد است.",
    "To err is human. / Swimming is healthy.",
    "فاعل مصدر می‌تواند طولانی باشد؛ it-extraposition خوانایی را افزایش می‌دهد."
  ],
  [
    "reporting-verb-gerund-subject",
    "gerund clause به‌عنوان فاعل معمولاً فعل مفرد می‌گیرد.",
    "Reading improves vocabulary.",
    "در هماهنگی دو gerund clause فعل جمع می‌آید."
  ],
  [
    "reporting-verb-infinitive-subject",
    "to-infinitive clause می‌تواند فاعل باشد، اما it-extraposition رایج است.",
    "To understand syntax takes time.",
    "این ساختار رسمی‌تر/تأکیدی است."
  ],
  [
    "reporting-verb-coordinated-subject",
    "دو بند/گروه اسمی هماهنگ با and معمولاً فعل جمع می‌گیرند.",
    "Reading and writing are essential.",
    "اگر دو عمل یک مفهوم واحد بسازند، توافق مفرد ممکن است."
  ],
  [
    "reporting-verb-either-neither-subject",
    "either/neither به‌عنوان فاعل مستقل معمولاً مفرد است.",
    "Neither is acceptable.",
    "either of/neither of با کاربردهای متغیر جداست."
  ],
  [
    "reporting-verb-each-subject",
    "each به‌عنوان فاعل یا تعیین‌گر اسم مفرد فعل مفرد می‌گیرد.",
    "Each has a different role.",
    "each of نیز فعل مفرد رسمی می‌گیرد."
  ],
  [
    "reporting-verb-every-subject",
    "every + singular noun و everyone/everything فعل مفرد می‌گیرند.",
    "Every detail matters.",
    "every one of نیز مفرد است."
  ],
  [
    "reporting-verb-many-subject",
    "many + plural noun فعل جمع می‌گیرد؛ many a + singular noun فعل مفرد.",
    "Many analysts disagree. / Many an analyst disagrees.",
    "تفاوت معنایی و سبکی را حفظ کن."
  ],
  [
    "reporting-verb-more-than-one",
    "more than one + singular noun معمولاً فعل مفرد می‌گیرد.",
    "More than one answer is possible.",
    "more + plural noun ساختار متفاوت است."
  ],
  [
    "reporting-verb-a-number-of",
    "a number of + plural noun فعل جمع می‌گیرد.",
    "A number of issues remain.",
    "the number of + plural noun فعل مفرد می‌گیرد."
  ],
  [
    "reporting-verb-the-number-of",
    "the number of + plural noun فعل مفرد می‌گیرد.",
    "The number of applicants is rising.",
    "number head است."
  ],
  [
    "reporting-verb-amount-of",
    "the amount of + mass noun فعل مفرد و the number of + plural count noun فعل مفرد می‌گیرد.",
    "The amount of debt is high.",
    "a large amount of + mass noun نیز مفرد است."
  ],
  [
    "reporting-verb-quantity-of",
    "a quantity of با اسم mass یا plural ممکن است؛ فعل بر اساس معنی واحد/تعداد متغیر است.",
    "A large quantity of goods was/were seized.",
    "برای نثر روشن، quantity/quantities و فعل را صریح هماهنگ کن."
  ],
  [
    "reporting-verb-variety-of",
    "a variety of + plural noun اغلب فعل جمع می‌گیرد؛ the variety of + noun فعل مفرد می‌گیرد.",
    "A variety of options are available. / The variety is impressive.",
    "معنی مجموعهٔ گزینه‌ها یا تنوع را تشخیص بده."
  ],
  [
    "reporting-verb-range-of",
    "a range of + plural noun می‌تواند مفرد/جمع بگیرد بسته به تأکید بر دامنه یا اقلام.",
    "A range of measures is/are available.",
    "در BrE توافق جمع رایج‌تر؛ بازنویسی با measures وضوح می‌دهد."
  ],
  [
    "reporting-verb-series-of",
    "a series of + plural noun معمولاً فعل مفرد با series می‌گیرد.",
    "A series of events has occurred.",
    "هستهٔ series مفرد است."
  ],
  [
    "reporting-verb-group-of",
    "a group of + plural noun معمولاً فعل مفرد با group می‌گیرد؛ در BrE توافق جمع معنایی هم دیده می‌شود.",
    "A group of experts is/are meeting.",
    "سبک و تمرکز بر گروه یا افراد تعیین‌کننده است."
  ],
  [
    "reporting-verb-pair-of",
    "a pair of + plural-form noun فعل مفرد می‌گیرد.",
    "A pair of scissors is missing.",
    "the scissors are missing بدون pair جمع است."
  ],
  [
    "reporting-verb-kind-of",
    "kind/type/sort of + noun توافق بر اساس head و معنی دارد.",
    "This kind of problem is common. / These kinds of problems are common.",
    "تطابق this/these با kind/kinds مهم است."
  ],
  [
    "reporting-verb-one-of",
    "one of + plural noun فعل مفرد در بند اصلی می‌گیرد.",
    "One of the reports is missing.",
    "در بند موصولی بعدی فعل ممکن است جمع باشد."
  ],
  [
    "reporting-verb-each-of",
    "each of + plural group فعل مفرد رسمی می‌گیرد.",
    "Each of the files has a label.",
    "کاربرد جمع در گفتار وجود دارد اما در نوشتار رسمی مفرد را ترجیح بده."
  ],
  [
    "reporting-verb-every-one-of",
    "every one of + plural group فعل مفرد است.",
    "Every one of the files has been checked.",
    "every one را با everyone از نظر مرجع تفکیک کن."
  ],
  [
    "reporting-verb-all-of",
    "all of با mass noun مفرد و plural noun جمع می‌گیرد.",
    "All of the evidence is relevant. / All of the reports are relevant.",
    "all به‌عنوان مقدار کلی مفرد می‌شود."
  ],
  [
    "reporting-verb-some-of",
    "some of با mass noun مفرد و plural count noun جمع می‌گیرد.",
    "Some of the funding is missing. / Some of the funds are missing.",
    "هستهٔ اسم بعد از of را شناسایی کن."
  ],
  [
    "reporting-verb-most-of",
    "most of با mass noun مفرد و plural noun جمع می‌گیرد.",
    "Most of the work is complete. / Most of the workers are here.",
    "most بدون of می‌تواند تعیین‌گر/قید باشد."
  ],
  [
    "reporting-verb-half-of",
    "half of با mass noun مفرد و plural noun جمع می‌گیرد.",
    "Half of the budget is spent. / Half of the employees are absent.",
    "half a + singular noun ساختار جداست."
  ],
  [
    "reporting-verb-percent-of",
    "درصد با mass noun مفرد و plural noun جمع می‌گیرد.",
    "Thirty percent of the budget is allocated. / 30% of firms are small.",
    "درصد به‌عنوان یک عدد واحد می‌تواند فعل مفرد بگیرد."
  ],
  [
    "reporting-verb-fraction-of",
    "کسر با اسم پس از of هماهنگ می‌شود، مگر مقدار به‌عنوان واحد در نظر گرفته شود.",
    "Two-thirds of the land is protected. / shares are sold.",
    "صورت کسر و مرجع اسم را بررسی کن."
  ],
  [
    "reporting-verb-majority-of",
    "majority of + plural noun در توافق جمعی رایج است؛ majority به‌عنوان واحد مفرد است.",
    "The majority of voters support it.",
    "BrE/AmE و register بر توافق اثر دارد."
  ],
  [
    "reporting-verb-minority-of",
    "minority of + plural noun می‌تواند جمع یا مفرد بسته به تمرکز بر اعضا/گروه بگیرد.",
    "A minority of members oppose it.",
    "برای گزارش آماری، فعل را با مفهوم مدنظر هماهنگ کن."
  ],
  [
    "reporting-verb-rest-of",
    "the rest of با mass noun مفرد و plural noun جمع می‌گیرد.",
    "The rest of the money is safe. / The rest of the files are safe.",
    "اسم بعد از of تعیین‌کننده است."
  ],
  [
    "reporting-verb-plenty-of",
    "plenty of با اسم mass مفرد و اسم جمع شمارش‌پذیر جمع می‌گیرد.",
    "Plenty of time is available. / Plenty of seats are free.",
    "plenty به‌تنهایی می‌تواند ضمیر جمعی باشد."
  ],
  [
    "reporting-verb-a-lot-of",
    "a lot of/lots of با اسم mass مفرد و اسم جمع جمع می‌گیرد.",
    "A lot of information is missing. / A lot of people are waiting.",
    "a lot در نقش قید شدت ساختار دیگری دارد."
  ],
  [
    "reporting-verb-loads-of",
    "loads of در گفتار با mass/ plural می‌آید و توافق با اسم پس از of است.",
    "Loads of work is waiting. / Loads of people are here.",
    "غیررسمی است؛ در متن رسمی plenty of یا much/many."
  ],
  [
    "reporting-verb-heaps-of",
    "heaps of در BrE/AusE غیررسمی برای مقدار زیاد می‌آید.",
    "Heaps of people were there.",
    "register محاوره‌ای است."
  ],
  [
    "reporting-verb-a-couple-of",
    "a couple of + plural noun معمولاً فعل جمع می‌گیرد.",
    "A couple of issues remain.",
    "the couple به‌عنوان زوج واحد می‌تواند مفرد باشد."
  ],
  [
    "reporting-verb-the-couple",
    "the couple می‌تواند واحد یا دو فرد را برجسته کند و توافق مفرد/جمع بگیرد.",
    "The couple is/are travelling.",
    "BrE توافق جمعی را بیشتر می‌پذیرد."
  ],
  [
    "reporting-verb-audience",
    "audience به‌عنوان جمعیت واحد مفرد و به‌عنوان افراد حاضر می‌تواند جمع بگیرد.",
    "The audience was silent. / were clapping.",
    "گونهٔ BrE/AmE و focus مهم است."
  ],
  [
    "reporting-verb-staff",
    "staff می‌تواند جمعی/مفردگونه باشد و توافق آن میان گونه‌ها تفاوت دارد.",
    "The staff are helpful. / The staff is small.",
    "staff members همیشه جمع صریح است."
  ],
  [
    "reporting-verb-data-style",
    "در نوشتار علمی، data are سنتی و data is در کاربرد عمومی پذیرفته است؛ یکدستی مهم است.",
    "The data are consistent.",
    "با datum مفرد سنتی آشنا باش."
  ],
  [
    "reporting-verb-media-style",
    "media به‌عنوان مجموعهٔ رسانه‌ها می‌تواند جمع و به‌عنوان صنعت/فضا mass تلقی شود.",
    "The media are reporting. / Social media is changing.",
    "در نثر حرفه‌ای معنی و سیاست سبک‌نامه را مشخص کن."
  ],
  [
    "reporting-verb-politics-economics",
    "نام رشته‌ها مانند politics/economics معمولاً مفرد است؛ political/economic issues جمع با اسم‌اند.",
    "Economics is difficult.",
    "the economics of... مفرد؛ statistics در معنی داده‌ها جمع."
  ],
  [
    "reporting-verb-statistics",
    "statistics به‌عنوان رشته مفرد و به‌عنوان داده/آمار جمع است.",
    "Statistics is a discipline. / The statistics are alarming.",
    "معنی lexical تعیین‌کننده است."
  ],
  [
    "reporting-verb-glasses-trousers",
    "اسم‌های دو‌بخشی مانند glasses/trousers فعل جمع می‌گیرند؛ pair مفرد است.",
    "These trousers are new. / This pair is new.",
    "a pair of scissors, glasses, trousers."
  ],
  [
    "reporting-verb-police",
    "police فعل جمع می‌گیرد و برای یک فرد police officer استفاده می‌شود.",
    "The police have arrived.",
    "police force می‌تواند مفرد باشد."
  ],
  [
    "reporting-verb-cattle",
    "cattle اسم جمع‌نماست و فعل جمع می‌گیرد.",
    "Cattle are grazing.",
    "a head of cattle برای شمارش واحد است."
  ],
  [
    "reporting-verb-people",
    "people جمع person و فعل جمع می‌گیرد؛ people به معنی ملت‌ها نیز می‌آید.",
    "People are concerned.",
    "a people می‌تواند یک قوم/ملت را بیان کند."
  ],
  [
    "reporting-verb-family",
    "family به‌عنوان یک واحد مفرد و اعضا به‌عنوان جمع می‌تواند توافق بگیرد.",
    "My family is large. / are all doctors.",
    "BrE plural agreement رایج‌تر است."
  ],
  [
    "reporting-verb-company",
    "company/organization در AmE معمولاً مفرد و در BrE گاهی جمع معنایی است.",
    "The company has announced its results.",
    "برای گزارش مالی، singular agreement معمولاً روشن‌تر است."
  ],
  [
    "reporting-verb-government",
    "government می‌تواند نهاد واحد یا اعضای آن باشد؛ BrE جمع معنایی رایج‌تر است.",
    "The government has/have announced...",
    "سبک‌نامه و تمرکز را حفظ کن."
  ],
  [
    "reporting-verb-team",
    "team به‌عنوان واحد مفرد یا اعضای تیم جمع معنایی می‌گیرد.",
    "The team is winning. / are wearing new shirts.",
    "در AmE مفرد غالب است."
  ],
  [
    "reporting-verb-board",
    "board معمولاً نهاد واحد مفرد است؛ اعضا در BrE ممکن است جمع شوند.",
    "The board has approved the plan.",
    "board members فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-police-officer",
    "police officer اسم شمارش‌پذیر مفرد است و article می‌گیرد.",
    "A police officer was present.",
    "police به‌تنهایی pluralia tantum است."
  ],
  [
    "reporting-verb-news",
    "news اسم mass مفرد است با اینکه -s دارد.",
    "The news is encouraging.",
    "a piece of news برای شمارش."
  ],
  [
    "reporting-verb-means",
    "means می‌تواند singular/plural هم‌شکل باشد.",
    "One means is available; several means are available.",
    "فعل و determiner شمار را مشخص می‌کند."
  ],
  [
    "reporting-verb-species",
    "species مفرد و جمع هم‌شکل است.",
    "This species is rare; these species are rare.",
    "this/these و فعل شمار را مشخص می‌کنند."
  ],
  [
    "reporting-verb-series",
    "series مفرد و جمع هم‌شکل است.",
    "This series is popular; these series are popular.",
    "س پایانی نشان جمع نیست."
  ],
  [
    "reporting-verb-headquarters",
    "headquarters می‌تواند مفرد یا جمع باشد بسته به معنی سازمان/دفترها.",
    "The headquarters is in London.",
    "در کاربرد عمومی یک دفتر مرکزی مفرد است."
  ],
  [
    "reporting-verb-works",
    "works می‌تواند کارخانه، آثار یا کارها باشد و توافق به معنی بستگی دارد.",
    "The steelworks are closed. / His collected works are...",
    "در معنای work mass noun است: the work is difficult."
  ],
  [
    "reporting-verb-customs",
    "customs به معنی گمرک یا رسوم معمولاً جمع است؛ custom مفرد برای رسم/سفارشی.",
    "Customs are checking luggage. / a local custom",
    "معنی را از بافت تشخیص بده."
  ],
  [
    "reporting-verb-savings",
    "savings معمولاً جمع است و به پول پس‌اندازشده اشاره دارد.",
    "Her savings are substantial.",
    "saving مفرد می‌تواند به معنی صرفه‌جویی باشد."
  ],
  [
    "reporting-verb-earnings",
    "earnings معمولاً جمع است و درآمد/سود را بیان می‌کند.",
    "The company's earnings have risen.",
    "earning به معنی کسب کردن/درآمد یک فرد کاربرد دیگری دارد."
  ],
  [
    "reporting-verb-proceeds",
    "proceeds به معنی عواید/درآمد فروش جمع است.",
    "The proceeds were donated.",
    "proceed فعل به معنی ادامه دادن است."
  ],
  [
    "reporting-verb-outskirts",
    "outskirts اسم جمع برای حومه است.",
    "The outskirts are expanding.",
    "an outskirts نادرست است."
  ],
  [
    "reporting-verb-surroundings",
    "surroundings اسم جمع برای محیط اطراف است.",
    "The surroundings are peaceful.",
    "surrounding به‌عنوان صفت/participle کاربرد دیگری دارد."
  ],
  [
    "reporting-verb-belongings",
    "belongings اسم جمع برای وسایل شخصی است.",
    "Her belongings were returned.",
    "belonging به معنی تعلق داشتن فعل است."
  ],
  [
    "reporting-verb-remains",
    "remains جمع برای بقایا؛ remain فعل است.",
    "The remains were discovered.",
    "the remains of a building."
  ],
  [
    "reporting-verb-contents",
    "contents جمع برای محتویات؛ content mass noun برای محتوا/رضایت.",
    "The contents are listed below.",
    "content of a book مفرد mass است."
  ],
  [
    "reporting-verb-looks",
    "looks جمع برای ظاهر؛ look فعل.",
    "Her looks are striking.",
    "look good فعل linking است."
  ],
  [
    "reporting-verb-odds",
    "odds اسم جمع برای احتمال/شانس است.",
    "The odds are against us.",
    "odd صفت به معنی عجیب است."
  ],
  [
    "reporting-verb- thanks",
    "thanks معمولاً جمع/عبارت ثابت است.",
    "Many thanks for your help.",
    "thank فعل و thanks اسم/عبارت است."
  ],
  [
    "reporting-verb-congratulations",
    "congratulations اسم جمع/عبارت است.",
    "Congratulations on your success.",
    "congratulation مفرد در کاربردهای خاص ممکن است."
  ],
  [
    "reporting-verb-regards",
    "regards در نامه‌نگاری عبارت پایانی و در معنی احترام/توجه جمع است.",
    "Kind regards; give my regards.",
    "regard به معنی توجه/ملاحظه اسم مفرد است."
  ],
  [
    "reporting-verb-spirits",
    "spirits می‌تواند روحیه یا نوشیدنی الکلی باشد و جمع است.",
    "Her spirits are high.",
    "spirit در معنی روح/انرژی اسم مفرد است."
  ],
  [
    "reporting-verb-works-meaning",
    "works می‌تواند کارخانه، آثار یا پروژه‌های مهندسی باشد؛ معنی شمار را تعیین می‌کند.",
    "The waterworks are old.",
    "work mass noun معمولاً مفرد است."
  ],
  [
    "reporting-verb-people-vs-persons",
    "persons در متون حقوقی/رسمی برای افراد مشخص و people در زبان عمومی رایج است.",
    "Persons under 18 are not admitted.",
    "people می‌تواند ملت‌ها را نیز نشان دهد."
  ],
  [
    "reporting-verb-fishes",
    "fishes برای گونه‌های مختلف و fish برای تعداد معمول به‌کار می‌رود.",
    "The lake contains many fish species.",
    "در برخی گونه‌ها fishes برای تعداد هم پذیرفته است."
  ],
  [
    "reporting-verb-sheep-deer",
    "sheep/deer جمع بی‌تغییر دارند.",
    "One sheep; ten sheep.",
    "واحدهای شمارش مانند head of sheep نیز ممکن‌اند."
  ],
  [
    "reporting-verb-mouse-mice",
    "mouse/mice و louse/lice جمع بی‌قاعده دارند.",
    "One mouse; several mice.",
    "computer mouse در برخی سبک‌ها mice و mouses هر دو دیده می‌شوند."
  ],
  [
    "reporting-verb-goose-geese",
    "goose/geese جمع بی‌قاعده دارد.",
    "A goose; two geese.",
    "جمع‌های ترکیبی و اصطلاحی ممکن است صورت‌های واژگانی داشته باشند."
  ],
  [
    "reporting-verb-child-children",
    "child/children و man/men جمع‌های بی‌قاعده‌اند.",
    "One child; three children.",
    "childs در انگلیسی معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-person-people",
    "person/people و persons در کاربردهای متفاوت‌اند.",
    "Two people; two persons.",
    "people به معنی قوم‌ها جمع peoples می‌گیرد."
  ],
  [
    "reporting-verb-foot-feet",
    "foot/feet جمع بی‌قاعده؛ foot در اندازه‌گیری مرکب پیش از اسم مفرد می‌ماند.",
    "six feet tall; a six-foot wall",
    "foot در معنی واحد اندازه در ترکیب صفتی مفرد است."
  ],
  [
    "reporting-verb-tooth-teeth",
    "tooth/teeth جمع بی‌قاعده دارد.",
    "One tooth; several teeth.",
    "tooths در انگلیسی معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-man-woman",
    "man/men و woman/women جمع بی‌قاعده دارند؛ ترکیب‌های جنسیتی املای خاص دارند.",
    "businesswoman/businesswomen",
    "در کاربرد خنثی از people/personnel استفاده کن."
  ],
  [
    "reporting-verb-analysis-analyses",
    "analysis/analyses و basis/bases جمع با تغییر تلفظ/املا دارند.",
    "one analysis; several analyses",
    "analysis فعل نیست؛ analyze فعل است."
  ],
  [
    "reporting-verb-crisis-crises",
    "crisis/crises و thesis/theses جمع لاتینی/یونانی دارند.",
    "economic crises; several theses",
    "تلفظ /ˈsiːz/ در پایان جمع."
  ],
  [
    "reporting-verb-axis-axes",
    "axis/axes و index/indices جمع‌های تخصصی دارند.",
    "two axes; stock indices",
    "axes می‌تواند جمع axe نیز باشد و ابهام معنایی دارد."
  ],
  [
    "reporting-verb-matrix-matrices",
    "matrix/matrices یا matrixes هر دو جمع پذیرفته‌اند.",
    "several matrices",
    "در ریاضی matrices رایج‌تر است."
  ],
  [
    "reporting-verb-vertex-vertices",
    "vertex/vertices جمع تخصصی دارد.",
    "the vertices of a polygon",
    "در نوشتار ریاضی صورت لاتینی معیار است."
  ],
  [
    "reporting-verb-radius-radii",
    "radius/radii یا radiuses جمع می‌شود.",
    "two radii",
    "در متن عمومی radiuses نیز پذیرفته است."
  ],
  [
    "reporting-verb-alumnus-alumni",
    "alumnus/alumni، alumna/alumnae و alumni به‌عنوان جمع فراگیر کاربرد دارد.",
    "one alumnus; several alumni",
    "در زبان معاصر alum/alums و alumni gender-neutral رایج‌اند."
  ],
  [
    "reporting-verb-curriculum-curricula",
    "curriculum/curricula یا curriculums هر دو جمع‌اند.",
    "several curricula",
    "curricula در نثر رسمی/آموزشی رایج‌تر است."
  ],
  [
    "reporting-verb-syllabus-syllabi",
    "syllabus/syllabuses/syllabi صورت‌های جمع پذیرفته‌اند.",
    "course syllabi",
    "سبک و مخاطب تعیین‌کننده است."
  ],
  [
    "reporting-verb-status-statuses",
    "status/statuses جمع می‌شود؛ status مفرد با s پایانی است.",
    "their statuses differ",
    "status به معنی وضعیت در مفرد هم -s دارد."
  ],
  [
    "reporting-verb-virus-viruses",
    "virus/viruses جمع معیار است؛ viri در انگلیسی معیار عمومی نیست.",
    "several viruses",
    "ریشهٔ لاتین را به جمع انگلیسی تعمیم نده."
  ],
  [
    "reporting-verb-octopus",
    "octopus/octopuses جمع معیار؛ octopi محل بحث و کمتر ترجیحی است.",
    "three octopuses",
    "برای نوشتار دقیق octopuses را به‌کار ببر."
  ],
  [
    "reporting-verb-millennium-millennia",
    "millennium/millennia یا millenniums جمع می‌شود.",
    "two millennia",
    "صورت لاتینی در نثر رسمی رایج‌تر است."
  ],
  [
    "reporting-verb-phenomenon",
    "phenomenon/phenomena جمع یونانی دارد.",
    "many phenomena",
    "phenomenas در انگلیسی معیار رسمی پرهیز شود."
  ],
  [
    "reporting-verb-criterion",
    "criterion/criteria مفرد/جمع است.",
    "one criterion; three criteria",
    "criteria را در نثر رسمی مفرد نکن."
  ],
  [
    "reporting-verb-bacterium-bacteria",
    "bacterium/bacteria جمع لاتینی دارد؛ bacteria در کاربرد عمومی می‌تواند اسم mass باشد.",
    "a bacterium; bacteria are present",
    "bacteria is در برخی کاربردهای عمومی شنیده می‌شود اما علمی جمع است."
  ],
  [
    "reporting-verb-medium-media",
    "medium/media جمع لاتینی و واژهٔ رسانه با کاربرد معنایی گسترده است.",
    "a medium; several media",
    "medium می‌تواند رسانه/واسطه/اندازه باشد."
  ],
  [
    "reporting-verb-automaton-automata",
    "automaton/automata جمع تخصصی دارد.",
    "several automata",
    "automations به معنی فرایندهای خودکارسازی واژهٔ دیگری است."
  ],
  [
    "reporting-verb-cactus-cacti",
    "cactus/cacti و cactuses هر دو پذیرفته‌اند.",
    "several cacti",
    "در انگلیسی عمومی cactuses نیز طبیعی است."
  ],
  [
    "reporting-verb-focus-foci",
    "focus/foci و focuses هر دو جمع‌اند.",
    "research focuses; focal foci",
    "در متن عمومی focuses معمولاً روشن‌تر است."
  ],
  [
    "reporting-verb-index-indices",
    "index/indices در ریاضی/مالی و indexes در کتاب/فهرست رایج است.",
    "price indices; book indexes",
    "تمایز حوزه‌ای گرایشی است."
  ],
  [
    "reporting-verb-appendix",
    "appendix/appendices و appendixes هر دو پذیرفته‌اند.",
    "the appendices",
    "سبک‌نامهٔ علمی را رعایت کن."
  ],
  [
    "reporting-verb-formula",
    "formula/formulas/formulae هر دو جمع‌اند.",
    "mathematical formulas",
    "formulae در برخی علوم/سبک‌ها رایج‌تر است."
  ],
  [
    "reporting-verb-bureaucracy",
    "اسم‌های انتزاعی و mass مانند bureaucracy, equipment, information بدون شمارش مستقیم می‌آیند.",
    "a piece of equipment",
    "در معنی نوع/واحد، reclassification ممکن است."
  ],
  [
    "reporting-verb-advice",
    "advice غیرقابل‌شمارش است؛ a piece of advice برای یک مورد.",
    "some advice; two pieces of advice",
    "advices فقط در کاربردهای حقوقی/قدیمی محدود است."
  ],
  [
    "reporting-verb-information",
    "information غیرقابل‌شمارش است و article a/an نمی‌گیرد.",
    "some information; a piece of information",
    "informations در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-evidence",
    "evidence معمولاً mass noun است؛ item/piece of evidence برای شمارش.",
    "strong evidence; two pieces of evidence",
    "evidences در کاربردهای حقوقی/تخصصی محدود دیده می‌شود."
  ],
  [
    "reporting-verb-research",
    "research معمولاً mass noun است؛ a study/project برای یک پژوهش.",
    "conduct research; a research project",
    "researches به‌عنوان فعل سوم‌شخص و جمع‌های تخصصی متفاوت است."
  ],
  [
    "reporting-verb-furniture",
    "furniture mass noun است؛ item/piece of furniture برای شمارش.",
    "some furniture; three pieces of furniture",
    "furnitures در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-luggage",
    "luggage/baggage mass noun است؛ bag/suitcase برای شمارش.",
    "two pieces of luggage",
    "luggages در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-traffic",
    "traffic mass noun است؛ vehicle/car برای شمارش.",
    "heavy traffic; many vehicles",
    "a traffic نادرست است."
  ],
  [
    "reporting-verb-machinery",
    "machinery mass noun است؛ machine برای شمارش.",
    "new machinery; several machines",
    "machineries در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-equipment",
    "equipment mass noun است؛ piece/item of equipment برای شمارش.",
    "modern equipment",
    "equipments در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-homework",
    "homework mass noun است؛ assignment/exercise برای شمارش.",
    "a lot of homework; two assignments",
    "homeworks در انگلیسی عمومی نادرست است."
  ],
  [
    "reporting-verb-work-mass-count",
    "work mass noun برای فعالیت و count noun برای اثر/اثر هنری/کار مشخص است.",
    "a lot of work; a work of art",
    "works در معنی آثار هنری جمع است."
  ],
  [
    "reporting-verb-time-count-mass",
    "time mass noun برای مدت و count noun برای دفعات/دوره‌هاست.",
    "I have no time. / three times",
    "معنی و ساختار تعیین می‌کنند a/an یا plural بیاید."
  ],
  [
    "reporting-verb-chicken-count-mass",
    "chicken به‌عنوان گوشت mass و حیوان count است.",
    "We ate chicken. / three chickens",
    "معنی مادهٔ غذایی و حیوان را تفکیک کن."
  ],
  [
    "reporting-verb-paper-count-mass",
    "paper به‌عنوان ماده mass و مقاله/روزنامه count است.",
    "some paper; a paper on inflation",
    "معنی واژگانی بر article و plural اثر دارد."
  ],
  [
    "reporting-verb-glass-count-mass",
    "glass به‌عنوان ماده mass و ظرف count است.",
    "glass is fragile; two glasses",
    "معنی ماده/ظرف را مشخص کن."
  ],
  [
    "reporting-verb-iron-count-mass",
    "iron به‌عنوان ماده mass و اتو/وسیله count است.",
    "made of iron; an iron",
    "تغییر معنی countability را عوض می‌کند."
  ],
  [
    "reporting-verb-experience-count-mass",
    "experience mass برای دانش/تجربهٔ کلی و count برای رویداد/تجربهٔ مشخص است.",
    "experience matters; an unusual experience",
    "a/an معنی رخداد را فعال می‌کند."
  ],
  [
    "reporting-verb-business-count-mass",
    "business به معنی فعالیت/کسب‌وکار کلی mass و business(es) برای شرکت/معامله count است.",
    "Business is slow. / several businesses",
    "businessman و businesswoman ترکیب‌های دیگرند."
  ],
  [
    "reporting-verb-light-count-mass",
    "light mass برای نور و count برای چراغ/منبع نور است.",
    "There is little light. / turn on the lights.",
    "light به معنی سبک/روشن نیز صفت است."
  ],
  [
    "reporting-verb-room-count-mass",
    "room mass برای فضا و count برای اتاق است.",
    "There isn't much room. / two rooms",
    "معنی فضا/اتاق را از بافت تشخیص بده."
  ],
  [
    "reporting-verb-noise-count-mass",
    "noise mass برای سروصدا و count برای صدای مشخص است.",
    "There was too much noise. / a strange noise",
    "countability به معنی و نوع صدا بستگی دارد."
  ],
  [
    "reporting-verb-success-count-mass",
    "success mass برای موفقیت کلی و count برای فرد/رویداد موفق است.",
    "Success takes time. / The launch was a success.",
    "a success به معنی یک مورد موفق است."
  ],
  [
    "reporting-verb-failure-count-mass",
    "failure mass برای شکست و count برای فرد/چیز ناموفق است.",
    "Failure is instructive. / The test was a failure.",
    "countability با تغییر معنی عوض می‌شود."
  ],
  [
    "reporting-verb-knowledge-count-mass",
    "knowledge mass noun است؛ a knowledge of... در معنی نوع/میزان دانش با modifier ممکن است.",
    "knowledge of English; a good working knowledge",
    "knowledge به‌طور معمول plural نمی‌شود."
  ],
  [
    "reporting-verb-permission-count-mass",
    "permission mass noun؛ permit count noun است.",
    "You need permission. / a parking permit",
    "اسم و فعل را تفکیک کن."
  ],
  [
    "reporting-verb-progress-count-mass",
    "progress mass noun است؛ a step/advance برای شمارش پیشرفت.",
    "make progress; significant advances",
    "progresses فعل سوم‌شخص یا جمع پیشرفت‌ها در کاربرد تخصصی است."
  ],
  [
    "reporting-verb-fun-count-mass",
    "fun معمولاً mass noun است؛ fun activity یک صفت/اسم ترکیبی است.",
    "We had fun. / a fun activity",
    "a fun در برخی کاربردهای غیررسمی جدید دیده می‌شود اما معیار سنتی mass است."
  ],
  [
    "reporting-verb-weather-count-mass",
    "weather mass noun است؛ a spell/period of weather برای دورهٔ مشخص.",
    "bad weather; a spell of hot weather",
    "a weather در کاربرد عمومی نادرست است."
  ],
  [
    "reporting-verb-accommodation-count-mass",
    "accommodation در BrE معمولاً mass noun؛ AmE accommodations جمع برای محل/امکانات.",
    "Accommodation is expensive. / special accommodations",
    "گونهٔ زبانی و معنی را مشخص کن."
  ],
  [
    "reporting-verb-staff-count-mass",
    "staff collective noun؛ staff member برای فرد و staffs برای چند گروه/نیروی انسانی.",
    "The staff are helpful. / two staff members",
    "توافق با گونه و نگاه به اعضا/واحد فرق می‌کند."
  ],
  [
    "reporting-verb-police-count-mass",
    "police جمع‌نماست؛ police officer count noun است.",
    "The police are investigating. / a police officer",
    "a police برای یک افسر نادرست است."
  ],
  [
    "reporting-verb-people-count-mass",
    "people جمع عادی و a people یک ملت/قوم است.",
    "many people; an indigenous people",
    "peoples جمع ملت‌هاست."
  ],
  [
    "reporting-verb-hair-count-mass",
    "hair mass برای موی سر و count برای تارهای جداگانه است.",
    "She has long hair. / two hairs",
    "a hair به یک تار مو اشاره دارد."
  ],
  [
    "reporting-verb-fruit-count-mass",
    "fruit mass برای میوه به‌طور کلی و fruits برای انواع/گونه‌هاست.",
    "Eat more fruit. / tropical fruits",
    "انتخاب به حوزه و معنی وابسته است."
  ],
  [
    "reporting-verb-vegetable-count",
    "vegetable شمارش‌پذیر است؛ vegetables جمع آن است.",
    "a vegetable; fresh vegetables",
    "vegetation mass noun و به معنی پوشش گیاهی است."
  ],
  [
    "reporting-verb-money-count-mass",
    "money mass noun؛ currency/coin/note برای واحدهای شمارش‌پذیر.",
    "a lot of money; several coins",
    "moneys/moneies در کاربردهای حقوقی/مالی محدود ممکن است."
  ],
  [
    "reporting-verb-cash-count-mass",
    "cash mass noun و cash payment/amount برای واحد/نوع پرداخت.",
    "We need cash. / cash payments",
    "cashes در کاربردهای تخصصی نادر است."
  ],
  [
    "reporting-verb-currency-count",
    "currency می‌تواند نوع/واحد شمارش‌پذیر باشد و currencies جمع می‌شود.",
    "major currencies",
    "currency به‌عنوان نظام پولی نیز مفهومی کلی دارد."
  ],
  [
    "reporting-verb-capital-count-mass",
    "capital mass برای سرمایه و count برای حرف بزرگ/پایتخت در معانی دیگر است.",
    "capital investment; a capital city",
    "capital به معنی سرمایه معمولاً mass است."
  ],
  [
    "reporting-verb-debt-count-mass",
    "debt mass برای بدهی کلی و debts برای بدهی‌های مشخص/انواع است.",
    "national debt; outstanding debts",
    "معنی جمع/تک‌تک تعهدات را تعیین می‌کند."
  ],
  [
    "reporting-verb-tax-count-mass",
    "tax count برای مالیات مشخص و mass در مفهوم نظام/بار مالیاتی.",
    "a tax; tax is burdensome",
    "taxes می‌تواند عوارض/مالیات‌ها باشد."
  ],
  [
    "reporting-verb-growth-count-mass",
    "growth mass برای رشد کلی و count برای رشد/افزایش مشخص یا نوع.",
    "economic growth; several growths",
    "در اقتصاد growth اغلب mass است."
  ],
  [
    "reporting-verb-inflation-count-mass",
    "inflation معمولاً mass noun است؛ انواع/دوره‌های inflation با ساختارهای توصیفی بیان می‌شود.",
    "Inflation is easing.",
    "inflations در کاربردهای تخصصی محدود است."
  ],
  [
    "reporting-verb-unemployment-count-mass",
    "unemployment mass noun؛ unemployment rate برای شاخص شمارش‌پذیر.",
    "Unemployment is rising.",
    "an unemployment نادرست است."
  ],
  [
    "reporting-verb-employment-count-mass",
    "employment mass noun برای وضعیت/مجموع اشتغال؛ jobs countable.",
    "Employment is increasing.",
    "employment opportunities جمع count noun است."
  ],
  [
    "reporting-verb-labour-labor",
    "labour/labor می‌تواند نیروی کار mass و labourers افراد count باشد؛ املای BrE/AmE متفاوت.",
    "labour costs; labor market",
    "labour به معنی زحمت/فرایند زایمان نیز می‌آید."
  ],
  [
    "reporting-verb-staffing",
    "staffing معمولاً mass برای تأمین نیرو/تعداد کارکنان است.",
    "Staffing levels are low.",
    "staff members شمارش‌پذیرند."
  ],
  [
    "reporting-verb-police-force",
    "police force مفرد به‌عنوان نهاد و police جمع‌نما برای افسران است.",
    "The police force is understaffed.",
    "police are on duty."
  ],
  [
    "reporting-verb-committee-members",
    "committee به‌عنوان واحد و committee members به‌عنوان افراد تفاوت توافق دارند.",
    "The committee has met. / The members have met.",
    "تغییر head noun، توافق را تغییر می‌دهد."
  ],
  [
    "reporting-verb-board-members",
    "board مفرد و board members جمع است.",
    "The board has voted. / Board members have voted.",
    "نزدیکی members را با head board اشتباه نکن."
  ],
  [
    "reporting-verb-majority-minority",
    "majority/minority می‌تواند نهاد واحد یا اعضای گروه باشد.",
    "The majority has decided. / A majority of voters have decided.",
    "ساختار of و نوع تمرکز را بررسی کن."
  ],
  [
    "reporting-verb-number-amount-quantity",
    "number برای شمارش‌پذیر، amount برای mass و quantity برای هر دو در بافت‌های خاص.",
    "a number of cases; an amount of money; a quantity of goods",
    "انتخاب head noun بر توافق اثر دارد."
  ],
  [
    "reporting-verb-fewer-less",
    "fewer برای count plural و less برای mass/اندازه؛ less than + number برای مقدار/عدد.",
    "fewer errors; less time; less than 20%",
    "less people در گفتار رایج است اما در نثر رسمی fewer people."
  ],
  [
    "reporting-verb-little-few",
    "few/a few با count plural؛ little/a little با mass؛ a- مثبت‌تر/کافی‌تر است.",
    "few options; a few options; little time; a little time",
    "quite a few به معنی تعداد نسبتاً زیاد است."
  ],
  [
    "reporting-verb-few-little-without-a",
    "few/little بدون a اغلب معنی کم و ناکافی می‌دهند.",
    "Few people agreed. / Little progress was made.",
    "a few/a little معنی مقداری/چندتا و مثبت‌تر دارند."
  ],
  [
    "reporting-verb-fewer-than",
    "fewer than + plural count noun/number برای تعداد کمتر است.",
    "fewer than 100 applicants",
    "less than برای مقدار، زمان، فاصله و در کاربردهای عمومی اعداد."
  ],
  [
    "reporting-verb-less-than",
    "less than + mass/measure/number برای مقدار کمتر است.",
    "less than $10; less than an hour",
    "less than 10 people در گفتار و برخی سبک‌ها رایج، اما fewer than رسمی‌تر."
  ],
  [
    "reporting-verb-number-vs-amount",
    "the number of و the amount of به نوع اسم و مفهوم شمار/مقدار وابسته‌اند.",
    "the number of users; the amount of data",
    "data می‌تواند count یا mass تلقی شود؛ سبک علمی را رعایت کن."
  ],
  [
    "reporting-verb-a-little-a-few",
    "a little و a few بر مقدار/تعداد کوچک اما موجود تأکید می‌کنند.",
    "a little money; a few questions",
    "little/few بدون a کمبود را برجسته می‌کند."
  ],
  [
    "reporting-verb-quite-a-few",
    "quite a few به معنی تعداد نسبتاً زیاد و informal است.",
    "Quite a few firms applied.",
    "quite few معنی بسیار کم دارد و با quite a few فرق می‌کند."
  ],
  [
    "reporting-verb-not-a-few",
    "not a few به معنی تعداد قابل توجه، رسمی/ادبی است.",
    "Not a few analysts disagreed.",
    "عبارت تثبیت‌شده است؛ در نثر ساده many روشن‌تر است."
  ],
  [
    "reporting-verb-a-good-deal-of",
    "a good/great deal of با mass noun می‌آید.",
    "A great deal of effort is required.",
    "a good many با plural count noun می‌آید."
  ],
  [
    "reporting-verb-a-good-many",
    "a good/great many + plural count noun فعل جمع می‌گیرد.",
    "A great many people were affected.",
    "با a great deal of اشتباه نشود."
  ],
  [
    "reporting-verb-a-large-number-of",
    "a large number of + plural noun فعل جمع می‌گیرد.",
    "A large number of firms are exposed.",
    "the number of + noun فعل مفرد."
  ],
  [
    "reporting-verb-a-large-amount-of",
    "a large amount of + mass noun فعل مفرد می‌گیرد.",
    "A large amount of capital is required.",
    "amounts of در جمع فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-amounts-of",
    "amounts of + mass noun معمولاً فعل جمع می‌گیرد چون head amounts جمع است.",
    "Large amounts of data are stored.",
    "درصد/مقدار به‌عنوان واحد ممکن است مفرد شود."
  ],
  [
    "reporting-verb-quantities-of",
    "quantities of + noun معمولاً فعل جمع می‌گیرد.",
    "Large quantities of grain were imported.",
    "a quantity of می‌تواند مفرد باشد."
  ],
  [
    "reporting-verb-various",
    "various + plural count noun؛ variously قید است.",
    "various reasons were given.",
    "various information نادرست است مگر اطلاعات به انواع تقسیم شود."
  ],
  [
    "reporting-verb-several",
    "several + plural count noun و فعل جمع می‌گیرد.",
    "Several reports were published.",
    "several of + determiner/pronoun نیز ممکن است."
  ],
  [
    "reporting-verb-a-couple",
    "a couple of + plural noun معمولاً جمع؛ couple به‌عنوان زوج واحد مفرد/جمع معنایی.",
    "A couple of issues remain.",
    "BrE جمع معنایی برای couple بیشتر رایج است."
  ],
  [
    "reporting-verb-dozen-hundred",
    "dozen/hundred/thousand پس از عدد بدون -s؛ با of و معنی نامعین جمع می‌گیرند.",
    "two hundred people; hundreds of people",
    "a hundred people و one hundred people هر دو درست‌اند."
  ],
  [
    "reporting-verb-dozens-of",
    "dozens/hundreds/thousands of + plural noun برای تعداد نامعین زیاد.",
    "Thousands of users joined.",
    "پس از عدد مشخص of نمی‌آید: two thousand users."
  ],
  [
    "reporting-verb-number-collective",
    "a number of, a total of و the total number of توافق متفاوت دارند.",
    "A total of 50 people were invited. / The total was 50.",
    "head و معنای total را تشخیص بده."
  ],
  [
    "reporting-verb-the-total-of",
    "the total of + plural items می‌تواند فعل مفرد بگیرد چون total head است.",
    "The total of the expenses is high.",
    "a total of + plural noun اغلب فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-a-total-of",
    "a total of + plural count noun معمولاً با فعل جمع یا گاهی مفرد به‌عنوان مقدار کل می‌آید.",
    "A total of 30 firms were surveyed.",
    "در گزارش آماری، انتخاب بر مفهوم تعداد شرکت‌ها یا total واحد بستگی دارد."
  ],
  [
    "reporting-verb-one-half",
    "one half of + mass noun فعل مفرد و plural noun فعل جمع می‌گیرد.",
    "One half of the budget is gone.",
    "half of نیز همین قاعده را دارد."
  ],
  [
    "reporting-verb-two-thirds",
    "two-thirds of + mass noun فعل مفرد و plural noun فعل جمع می‌گیرد.",
    "Two-thirds of the land is protected. / shares are sold.",
    "کسر به‌عنوان عدد واحد ممکن است مفرد شود."
  ],
  [
    "reporting-verb-each-and-every",
    "each and every + singular noun برای تأکید توزیعی فعل مفرد می‌گیرد.",
    "Each and every applicant is checked.",
    "این ساختار تأکیدی است و در نثر رسمی ممکن است سنگین باشد."
  ],
  [
    "reporting-verb-every-single",
    "every single + singular noun برای تأکید فردبه‌فرد است.",
    "Every single detail matters.",
    "فعل مفرد است."
  ],
  [
    "reporting-verb-each-respectively",
    "each می‌تواند توزیع فردی و respectively تناظر فهرستی بسازد؛ کاربرد هم‌زمان نیازمند وضوح است.",
    "Each branch received a different target.",
    "از تکرار غیرضروری هر دو پرهیز کن."
  ],
  [
    "reporting-verb-whole-entire",
    "whole و entire پیش از اسم مفرد count می‌آیند و بر کامل بودن تأکید می‌کنند.",
    "the entire country; a whole day",
    "all + determiner + noun الگوی متفاوت است."
  ],
  [
    "reporting-verb-all-whole-day",
    "all day و the whole day هر دو مدت کامل را بیان می‌کنند؛ all of the day کمتر طبیعی است.",
    "It rained all day.",
    "all day long تأکید زمانی بیشتری دارد."
  ],
  [
    "reporting-verb-each-every-time",
    "each time و every time می‌توانند بند زمانی معرفی کنند.",
    "Each time prices rise, demand falls.",
    "every time ممکن است اسم/عبارت زمانی نیز باشد."
  ],
  [
    "reporting-verb-whenever",
    "whenever برای هر زمان/هر بار که به‌کار می‌رود.",
    "Call whenever you need help.",
    "whenever می‌تواند پرسش غیرمستقیم نیز باشد."
  ],
  [
    "reporting-verb-whatever",
    "whatever به معنی هرچه/هر چیزی که است و بند concessive نیز می‌سازد.",
    "Whatever you decide, let us know.",
    "whatever + noun نیز تعیین‌گر است."
  ],
  [
    "reporting-verb-whichever",
    "whichever انتخاب از مجموعهٔ محدود را نشان می‌دهد.",
    "Choose whichever route is safer.",
    "whichever of + plural noun نیز ممکن است."
  ],
  [
    "reporting-verb-whoever",
    "whoever هر شخصی که/هرکس که را می‌رساند.",
    "Whoever arrives first should call.",
    "در بند موصولی آزاد، خود بند نقش اسمی می‌گیرد."
  ],
  [
    "reporting-verb-whomever",
    "whomever صورت مفعولی رسمی whoever است؛ در کاربرد امروز whoever اغلب در گفتار غالب است.",
    "Give it to whomever you choose.",
    "در بندهای توکار، نقش نحوی داخل بند را بررسی کن."
  ],
  [
    "reporting-verb-whose-ever",
    "whosever بسیار نادر/رسمی است؛ whose + noun برای مالکیت در بند موصولی رایج‌تر است.",
    "a writer whose work is influential",
    "whose هم برای انسان و هم برای سازمان/اشیا پذیرفته است."
  ],
  [
    "reporting-verb-whom-relative",
    "whom در بند موصولی نقش مفعول و در سبک رسمی می‌آید.",
    "The person whom I met...",
    "در گفتار that/zero relative رایج‌تر است."
  ],
  [
    "reporting-verb-who-relative",
    "who در بند موصولی برای انسان و معمولاً نقش فاعلی است.",
    "The analyst who called...",
    "who در نقش مفعولی نیز در انگلیسی امروز رایج است."
  ],
  [
    "reporting-verb-that-relative",
    "that در بند موصولی محدودکننده برای انسان/اشیا ممکن است.",
    "The report that arrived...",
    "در بند توضیحی با ویرگول that به‌کار نمی‌رود."
  ],
  [
    "reporting-verb-which-relative",
    "which برای اشیا/حیوانات و بندهای توضیحی رایج است.",
    "The report, which was published yesterday,...",
    "which محدودکننده در برخی سبک‌ها پذیرفته است."
  ],
  [
    "reporting-verb-where-relative",
    "where برای مکان و در معنی in/at which به‌کار می‌رود.",
    "The city where I was born...",
    "where برای زمان/موقعیت استعاری نیز ممکن است."
  ],
  [
    "reporting-verb-when-relative",
    "when برای زمان و in/on which به‌کار می‌رود.",
    "The day when we met...",
    "that یا حذف ضمیر نیز در بند محدودکننده ممکن است."
  ],
  [
    "reporting-verb-why-relative",
    "why پس از reason می‌تواند بند موصولی بسازد؛ that یا حذف نیز رایج است.",
    "The reason why we left...",
    "the reason is because ساختاری بحث‌برانگیز/تکراری است؛ the reason is that روشن‌تر."
  ],
  [
    "reporting-verb-whose-relative",
    "whose مالکیت را در بند موصولی نشان می‌دهد.",
    "A firm whose assets were frozen...",
    "whose برای غیرانسان نیز معیار است."
  ],
  [
    "reporting-verb-of-which-relative",
    "of which ساختار رسمی برای مالکیت/جزء-کل است.",
    "a policy the effects of which are unclear",
    "whose معمولاً روان‌تر و کوتاه‌تر است."
  ],
  [
    "reporting-verb-whereby-relative",
    "whereby روش/سازوکار را در بند موصولی توضیح می‌دهد.",
    "a system whereby data are verified",
    "whereby در register رسمی است."
  ],
  [
    "reporting-verb-preposition-relative",
    "حرف اضافه می‌تواند پیش از whom/which بیاید یا در انتهای بند بماند.",
    "the person to whom I spoke; the person I spoke to",
    "fronting رسمی‌تر است؛ stranded preposition کاملاً معیار است."
  ],
  [
    "reporting-verb-relative-omission",
    "ضمیر موصولی مفعولی در restrictive clause حذف‌پذیر است؛ فاعلی حذف‌ناپذیر.",
    "The book (that) I bought...",
    "در non-defining clause ضمیر حذف نمی‌شود."
  ],
  [
    "reporting-verb-relative-reduction",
    "relative clause فعال با -ing و مجهول با past participle کاهش می‌یابد.",
    "people living abroad; documents signed today",
    "فاعل و زمان باید قابل بازیابی باشد."
  ],
  [
    "reporting-verb-relative-nondefining",
    "non-defining relative اطلاعات افزوده می‌دهد و با ویرگول جدا می‌شود.",
    "My car, which is electric, is new.",
    "that در این بندها به‌کار نمی‌رود."
  ],
  [
    "reporting-verb-relative-defining",
    "defining relative مرجع را محدود می‌کند و معمولاً بدون ویرگول است.",
    "The cars that were damaged were removed.",
    "حذف ضمیر مفعولی ممکن است."
  ],
  [
    "reporting-verb-which-whole-clause",
    "which می‌تواند به کل بند پیشین ارجاع دهد.",
    "He missed the train, which annoyed him.",
    "مرجع which باید روشن باشد؛ در سبک رسمی this may be clearer."
  ],
  [
    "reporting-verb-what-relative",
    "what به معنی the thing(s) that و بند موصولی fused است.",
    "I understood what she meant.",
    "what معمولاً antecedent مستقل قبل از خود نمی‌گیرد."
  ],
  [
    "reporting-verb-whatever-relative",
    "whatever می‌تواند fused relative یا concessive باشد.",
    "Take whatever you need. / Whatever happens, call me.",
    "نقش نحوی بند را از بافت تشخیص بده."
  ],
  [
    "reporting-verb-as-relative",
    "as می‌تواند پس از same/such و در ساختارهای توضیحی رسمی بند موصولی بسازد.",
    "As was expected, prices fell.",
    "as در آغاز بند می‌تواند discourse marker هم باشد."
  ],
  [
    "reporting-verb-than-relative",
    "than در مقایسه می‌تواند بند موصولی/مقایسه‌ای با حذف داشته باشد.",
    "more than we expected",
    "بند می‌تواند auxiliary حذف‌شده داشته باشد."
  ],
  [
    "reporting-verb-but-relative",
    "but در کاربرد ادبی/قدیمی می‌تواند به معنی that...not باشد.",
    "There is no rule but has exceptions.",
    "در انگلیسی امروز ساختار نادر است؛ that does not have روشن‌تر است."
  ],
  [
    "reporting-verb-ever-relative",
    "whoever/whatever/whichever بند موصولی آزاد می‌سازند.",
    "Whoever wants to join may apply.",
    "این‌ها هم‌زمان نقش pronoun/determiner دارند."
  ],
  [
    "reporting-verb-restrictive-meaning",
    "وجود/حذف ویرگول در relative clause می‌تواند مرجع را تغییر دهد.",
    "My sisters who live abroad...",
    "با ویرگول یعنی همهٔ خواهران در خارج‌اند؛ بدون آن ممکن است فقط زیرمجموعه باشد."
  ],
  [
    "reporting-verb-that-which-choice",
    "that برای restrictive در سبک آمریکایی ترجیح دارد؛ which نیز در بسیاری از گونه‌ها پذیرفته است.",
    "The policy that/which we adopted...",
    "یک سبک‌نامه را انتخاب و در کل متن یکدست اجرا کن."
  ],
  [
    "reporting-verb-which-after-comma",
    "پس از ویرگول، which می‌تواند بند توضیحی معرفی کند و به اسم یا کل گزاره ارجاع دهد.",
    "The bank cut rates, which surprised markets.",
    "that پس از ویرگول برای این کاربرد نمی‌آید."
  ],
  [
    "reporting-verb-whose-nonhuman",
    "whose می‌تواند مالکیت شرکت، کشور، ابزار یا مفهوم را نشان دهد.",
    "a country whose exports fell",
    "of which جایگزین رسمی‌تر اما اغلب سنگین است."
  ],
  [
    "reporting-verb-relative-pronoun-case",
    "حالت فاعلی/مفعولی who/whom در انگلیسی امروز با جایگاه نحوی و register تعیین می‌شود.",
    "Who did you see? / Whom did you see?",
    "who به‌عنوان مفعول در گفتار معیار بسیار رایج است."
  ],
  [
    "reporting-verb-relative-preposition-fronting",
    "پس از حرف اضافهٔ جلوآمده از whom/which استفاده می‌شود، نه that یا zero relative.",
    "the policy to which we objected",
    "این ساختار رسمی است."
  ],
  [
    "reporting-verb-contact-clause",
    "contact clause بند موصولی مفعولی بدون ضمیر موصولی است.",
    "The person I met was helpful.",
    "فقط در جایگاه مفعولی ممکن است."
  ],
  [
    "reporting-verb-relative-antecedent",
    "مرجع ضمیر موصولی باید از نظر معنی و شمار روشن باشد.",
    "The company and its subsidiaries, which...",
    "در صورت ابهام، جمله را بازنویسی کن."
  ],
  [
    "reporting-verb-relative-nested",
    "بندهای موصولی تو در تو می‌توانند جمله را سنگین و مبهم کنند.",
    "The report that the analyst who resigned wrote...",
    "برای نثر حرفه‌ای، شکستن جمله وضوح را بالا می‌برد."
  ],
  [
    "reporting-verb-relative- pied-piping",
    "pied-piping یعنی انتقال حرف اضافه همراه ضمیر موصولی به ابتدای بند.",
    "the conditions under which the loan was issued",
    "ساختار رسمی‌تر از حرف اضافهٔ پایانی است."
  ],
  [
    "reporting-verb-relative-stranding",
    "preposition stranding در بند موصولی محاوره‌ای/معیار رایج است.",
    "the conditions which the loan was issued under",
    "در برخی آزمون‌ها/سبک‌های رسمی pied-piping ترجیح داده می‌شود."
  ],
  [
    "reporting-verb-relative-which-vs-where",
    "which به اسم/شیء و where به مکان/موقعیت ارجاع می‌دهد؛ انتخاب بر اساس نقش در بند است.",
    "the city in which I live / the city where I live",
    "where به‌عنوان قید موصولی و which پس از حرف اضافه ساختارهای متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-when-vs-which",
    "when برای زمان و on/in which برای اسم زمان است.",
    "the year when we met / the year in which we met",
    "that نیز در restrictive relative ممکن است."
  ],
  [
    "reporting-verb-relative-why-vs-that",
    "reason why/that یا حذف ضمیر در restrictive clause ممکن است.",
    "the reason (why/that) she left",
    "why در گفتار طبیعی و رسمی هر دو رایج است."
  ],
  [
    "reporting-verb-relative-all-that",
    "all that و everything that بند موصولی محدودکننده می‌گیرند.",
    "All that remains is one question.",
    "that ممکن است حذف شود اگر نقش مفعولی داشته باشد."
  ],
  [
    "reporting-verb-relative-the-way",
    "the way (that/in which) برای روش است؛ how معمولاً هم‌زمان با the way در یک ساختار نمی‌آید.",
    "I like the way (that) she writes.",
    "the way how در معیار عمومی پرهیز شود."
  ],
  [
    "reporting-verb-relative-the-moment",
    "the moment/minute/instant می‌تواند بدون when بند زمانی معرفی کند.",
    "The moment I arrived, it started.",
    "این ساختار با relative clause قابل تفکیک است."
  ],
  [
    "reporting-verb-relative-whenever",
    "whenever می‌تواند بند زمانی آزاد بسازد.",
    "Whenever the market opens, prices fluctuate.",
    "در پرسش غیرمستقیم نیز کاربرد دارد."
  ],
  [
    "reporting-verb-relative-wherever",
    "wherever مکان نامعین یا هر مکانی را معرفی می‌کند.",
    "Wherever you go, keep your documents safe.",
    "در معنی concessive نیز ممکن است."
  ],
  [
    "reporting-verb-relative-whichever-of",
    "whichever of + plural group انتخاب از مجموعهٔ محدود است.",
    "Whichever of the routes you choose...",
    "فعل با مرجع بند و نقش نحوی هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-whatever-noun",
    "whatever می‌تواند پیش از اسم به‌عنوان determiner بیاید.",
    "Whatever reason he gives, check it.",
    "whatever reason می‌تواند concessive meaning داشته باشد."
  ],
  [
    "reporting-verb-relative-whose-ever",
    "whoever/whomever تفاوت نقش فاعلی/مفعولی دارد؛ در گفتار whoever غالب است.",
    "Give it to whoever needs it.",
    "در ساختار رسمی دقیقاً نقش داخل بند را بررسی کن."
  ],
  [
    "reporting-verb-relative-pronoun-that-person",
    "that برای انسان در restrictive clause ممکن است اما پس از حرف اضافهٔ جلوآمده نمی‌آید.",
    "the person that called",
    "who در بسیاری از سبک‌ها طبیعی‌تر است."
  ],
  [
    "reporting-verb-relative-which-person",
    "which برای انسان در relative clause معمولاً به‌کار نمی‌رود؛ who/whom مناسب است.",
    "the person who called",
    "which می‌تواند به گروه/نهاد یا کل گزاره ارجاع دهد."
  ],
  [
    "reporting-verb-relative-what-person",
    "what به‌تنهایی برای شخص به معنی whoever در ساختارهای خاص قدیمی/لهجه‌ای است؛ در معیار عمومی who(ever) را به‌کار ببر.",
    "Whoever arrives first...",
    "what person در پرسش مستقیم به معنی کدام شخص ساختار جداست."
  ],
  [
    "reporting-verb-relative-that-comma",
    "that در بند non-defining پس از کاما به‌کار نمی‌رود.",
    "My car, which is old, still works.",
    "بند توضیحی را با which/who بساز."
  ],
  [
    "reporting-verb-relative-which-restrictive-style",
    "which در restrictive clause در BrE رایج و در سبک‌های آمریکایی برخی ناشران محدودتر است.",
    "The book which I bought...",
    "برای امتحان ویرایش آمریکایی از that استفاده کن، مگر حرف اضافه جلو آمده باشد."
  ],
  [
    "reporting-verb-relative-whereby-which",
    "whereby یعنی by which و سازوکار/روش را بیان می‌کند.",
    "a process whereby data are encrypted",
    "whereby رسمی‌تر و گاهی حقوقی است."
  ],
  [
    "reporting-verb-relative-wherein-which",
    "wherein یعنی in which و برای محیط/سند/بند رسمی است.",
    "a contract wherein liability is defined",
    "in which در نثر عمومی روشن‌تر است."
  ],
  [
    "reporting-verb-relative-whereupon",
    "whereupon به معنی immediately after which در نثر روایی/رسمی است.",
    "The vote ended, whereupon the chair spoke.",
    "در متن عمومی after which طبیعی‌تر است."
  ],
  [
    "reporting-verb-relative-as-expected",
    "as expected یک عبارت parenthetical برای بیان انتظار است.",
    "As expected, the figures declined.",
    "as + clause می‌تواند به گزارهٔ کامل پیشین ارجاع دهد."
  ],
  [
    "reporting-verb-relative-as-is-known",
    "as is well known ساختار غیرشخصی/توضیحی است.",
    "As is well known, prices fluctuate.",
    "این ساختار کلیشه‌ای است و در نثر آکادمیک بهتر است از ادعای بی‌منبع پرهیز شود."
  ],
  [
    "reporting-verb-relative-which-is-why",
    "which is why به کل گزارهٔ قبلی و نتیجهٔ آن ارجاع می‌دهد.",
    "Demand collapsed, which is why output fell.",
    "مرجع which باید روشن باشد."
  ],
  [
    "reporting-verb-relative-which-means",
    "which means + clause برای توضیح پیامد گزارهٔ قبلی است.",
    "The sample is small, which means results are uncertain.",
    "این ساختار را با which به اسم مفرد اشتباه نکن."
  ],
  [
    "reporting-verb-relative-which-suggests",
    "which suggests/indicates می‌تواند نتیجه‌گیری محتاطانه از گزارهٔ قبلی باشد.",
    "Costs rose, which suggests demand is strong.",
    "از نسبت دادن استنتاج فراتر از داده پرهیز کن."
  ],
  [
    "reporting-verb-relative-whose-result",
    "whose می‌تواند مالکیت/ویژگی را به اسم قبلی متصل کند.",
    "a policy whose effects are unclear",
    "whose effects به‌عنوان فاعل بند موصولی است."
  ],
  [
    "reporting-verb-relative-of-whom",
    "of whom/of which برای partitive یا مالکیت رسمی است.",
    "several of whom resigned",
    "بعد از of ضمیر مفعولی whom لازم است."
  ],
  [
    "reporting-verb-relative-many-of-whom",
    "many/some/none + of whom/which برای اشاره به زیرمجموعه در بند توضیحی است.",
    "The firms, many of which are small, ...",
    "بند توضیحی با ویرگول جدا می‌شود."
  ],
  [
    "reporting-verb-relative-both-of-whom",
    "both/neither/each of whom/which ساختار partitive دارد.",
    "The two analysts, both of whom agreed,...",
    "whom برای انسان و which برای اشیا/نهادها."
  ],
  [
    "reporting-verb-relative-determiner-whose",
    "whose + noun مالکیت را در relative clause نشان می‌دهد.",
    "a firm whose shares fell",
    "whose به انسان محدود نیست."
  ],
  [
    "reporting-verb-relative-whatsoever",
    "whatsoever پس از no/none/anything برای تأکید می‌آید.",
    "There is no evidence whatsoever.",
    "register تأکیدی/رسمی است."
  ],
  [
    "reporting-verb-relative-whatever-the-case",
    "whatever the case may be عبارت concessive ثابت است.",
    "Whatever the case may be, we need evidence.",
    "may be ساختار وجهی است."
  ],
  [
    "reporting-verb-relative-whoever-it-is",
    "whoever it is ساختار آزاد/تأکیدی برای نامشخص بودن شخص است.",
    "Whoever it is, ask them to wait.",
    "it is می‌تواند ساختار شناسایی/تعریف باشد."
  ],
  [
    "reporting-verb-relative-whatever-it-takes",
    "whatever it takes یعنی هر کاری لازم باشد.",
    "We will do whatever it takes.",
    "عبارت اصطلاحی است و در برخی بافت‌ها اغراق‌آمیز."
  ],
  [
    "reporting-verb-relative-no-matter",
    "no matter who/what/how/where ساختار concessive با هر مرجع/شرط است.",
    "No matter what happens, stay calm.",
    "no matter how + adjective/adverb می‌آید."
  ],
  [
    "reporting-verb-relative-however-degree",
    "however + adjective/adverb + subject + verb ساختار concessive است.",
    "However difficult the task is, we will finish.",
    "however به معنی با هر روشی نیز می‌آید."
  ],
  [
    "reporting-verb-relative-whatever-concession",
    "whatever + noun/clause برای پذیرش هر احتمال و بی‌تأثیری نتیجه است.",
    "Whatever the outcome, we will continue.",
    "whatever + noun می‌تواند تعیین‌گر باشد."
  ],
  [
    "reporting-verb-relative-whichever-concession",
    "whichever + noun برای هرکدام از مجموعهٔ محدود، حتی با تفاوت انتخاب است.",
    "Whichever route you take, the journey is long.",
    "مجموعهٔ گزینه‌ها باید از بافت معلوم باشد."
  ],
  [
    "reporting-verb-relative-whoever-concession",
    "whoever برای هر شخصی که، با نتیجهٔ مستقل از هویت اوست.",
    "Whoever wins, the rules remain.",
    "فاعل بند موصولی آزاد است."
  ],
  [
    "reporting-verb-relative-whenever-concession",
    "whenever برای هر زمان/هر بار، با نتیجهٔ ثابت است.",
    "Whenever you call, I will answer.",
    "زمان آینده در بند زمانی با حال ساده می‌آید."
  ],
  [
    "reporting-verb-relative-wherever-concession",
    "wherever برای هر مکان، با نتیجهٔ مستقل از مکان است.",
    "Wherever she goes, she learns.",
    "wherever بند قیدی می‌سازد."
  ],
  [
    "reporting-verb-relative-whichever-option",
    "whichever + singular count noun در انتخاب یکی از چند گزینه می‌آید.",
    "Whichever option you choose is acceptable.",
    "فعل در بند اصلی با whichever option مفرد است."
  ],
  [
    "reporting-verb-relative-whatever-noun-agreement",
    "whatever + singular noun می‌تواند گروه اسمی مفرد بسازد.",
    "Whatever decision is made, record it.",
    "whatever decisions plural agreement می‌گیرد."
  ],
  [
    "reporting-verb-relative-whoever-agreement",
    "whoever به‌عنوان فاعل بند موصولی آزاد معمولاً فعل را با معنی مفرد می‌گیرد.",
    "Whoever is responsible should explain.",
    "ضمیر بعدی می‌تواند singular they باشد."
  ],
  [
    "reporting-verb-relative-what-agreement",
    "what-clause به‌عنوان فاعل اغلب فعل مفرد می‌گیرد؛ complement plural می‌تواند در برخی ساختارها توافق معنایی ایجاد کند.",
    "What matters is the evidence.",
    "توافق با what-clause و مکمل آن در برخی تحلیل‌ها متغیر است."
  ],
  [
    "reporting-verb-relative-all-that-agreement",
    "all that remains به‌عنوان head مفرد تلقی می‌شود؛ all + plural reference ممکن است جمع شود.",
    "All that remains is one file.",
    "مرجع all را تعیین کن."
  ],
  [
    "reporting-verb-relative-none-that",
    "none that... بند موصولی برای هیچ‌یک از موارد می‌سازد.",
    "None that I contacted were available.",
    "توافق none در جمع متغیر است."
  ],
  [
    "reporting-verb-relative-those-who",
    "those who + plural verb برای گروه انسانی است.",
    "Those who disagree may leave.",
    "those جمع است و فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-relative-one-who",
    "one who + singular verb برای یک فرد/نوع کلی است.",
    "One who ignores evidence makes mistakes.",
    "one به‌عنوان ضمیر رسمی است."
  ],
  [
    "reporting-verb-relative-anyone-who",
    "anyone who از نظر head مفرد است؛ فعل بند موصولی با anyone هماهنگ می‌شود.",
    "Anyone who wants to apply is welcome.",
    "ضمیر ارجاعی بعدی singular they ممکن است."
  ],
  [
    "reporting-verb-relative-people-who",
    "people who فعل جمع می‌گیرد.",
    "People who work remotely need support.",
    "people را با person مفرد اشتباه نکن."
  ],
  [
    "reporting-verb-relative-the-people-who",
    "the people who به گروه مشخص جمع اشاره می‌کند.",
    "The people who were selected...",
    "the people is/are بسته به مرجع و ساختار جمع است."
  ],
  [
    "reporting-verb-relative-everyone-who",
    "everyone who head مفرد دارد و فعل بند اصلی مفرد می‌گیرد.",
    "Everyone who applies is considered.",
    "در بند موصولی، فعل با مرجع everyone هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-each-person-who",
    "each person who فعل مفرد می‌گیرد.",
    "Each person who attends receives a badge.",
    "each به توزیع فردی اشاره دارد."
  ],
  [
    "reporting-verb-relative-one-of-those-who",
    "one of those who + plural verb در relative clause چون who به those برمی‌گردد.",
    "He is one of those who work late.",
    "دام آزمونی رایج."
  ],
  [
    "reporting-verb-relative-only-one-who",
    "the only one of those who + singular verb چون who به one برمی‌گردد.",
    "She is the only one who knows.",
    "تفاوت معنایی را با one of those who know حفظ کن."
  ],
  [
    "reporting-verb-relative-most-of-whom",
    "most of whom/which در بند توضیحی زیرمجموعه را معرفی می‌کند.",
    "The applicants, most of whom were qualified,...",
    "ویرگول‌ها و مرجع را روشن کن."
  ],
  [
    "reporting-verb-relative-some-of-which",
    "some of which برای اشیا/مفاهیم و some of whom برای انسان است.",
    "The reports, some of which were delayed,...",
    "ضمیر موصولی باید با نوع مرجع هماهنگ باشد."
  ],
  [
    "reporting-verb-relative-all-of-which",
    "all of which برای کل مجموعهٔ اشیا/اطلاعات پیشین است.",
    "The data, all of which were verified,...",
    "all of which به کل مرجع قبلی اشاره می‌کند."
  ],
  [
    "reporting-verb-relative-neither-of-whom",
    "neither of whom برای دو انسان و ساختار توضیحی است.",
    "The two candidates, neither of whom was selected,...",
    "فعل در بند relative با neither اغلب مفرد رسمی است."
  ],
  [
    "reporting-verb-relative-each-of-whom",
    "each of whom برای اشارهٔ جداگانه به افراد است.",
    "The five directors, each of whom has a vote,...",
    "فعل مفرد با each."
  ],
  [
    "reporting-verb-relative-both-of-which",
    "both of which برای دو شیء/مورد است.",
    "The two proposals, both of which were rejected,...",
    "both فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-relative-one-of-which",
    "one of which برای انتخاب یک مورد از مرجع جمع است.",
    "Three plans, one of which is viable,...",
    "فعل با one مفرد."
  ],
  [
    "reporting-verb-relative-many-of-which",
    "many of which برای تعداد زیادی از مرجع جمع است.",
    "Several policies, many of which are controversial,...",
    "فعل جمع."
  ],
  [
    "reporting-verb-relative-few-of-which",
    "few of which برای تعداد اندکی از مرجع جمع است.",
    "Several proposals, few of which were funded,...",
    "few فعل جمع."
  ],
  [
    "reporting-verb-relative-none-of-which",
    "none of which برای هیچ‌یک از اشیا/موارد است.",
    "The options, none of which is ideal,...",
    "none توافق مفرد/جمع متغیر دارد."
  ],
  [
    "reporting-verb-relative-whose-which",
    "whose و of which هر دو مالکیت/رابطه را نشان می‌دهند، اما ساختار و register متفاوت دارند.",
    "a firm whose assets... / the assets of which...",
    "whose معمولاً روان‌تر است."
  ],
  [
    "reporting-verb-relative-whom-after-preposition",
    "پس از حرف اضافهٔ جلوآمده، whom برای انسان لازم است در سبک رسمی.",
    "the colleague with whom I worked",
    "with who در گفتار شنیده می‌شود اما رسمی نیست."
  ],
  [
    "reporting-verb-relative-which-after-preposition",
    "پس از حرف اضافهٔ جلوآمده، which برای شیء/نهاد می‌آید.",
    "the framework within which we operate",
    "that یا حذف ضمیر پس از حرف اضافهٔ جلوآمده ممکن نیست."
  ],
  [
    "reporting-verb-relative-that-after-preposition",
    "that پس از حرف اضافهٔ جلوآمده مجاز نیست؛ حرف اضافه را به انتهای بند ببر یا which/whom بیاور.",
    "the issue that we spoke about",
    "the issue about which we spoke رسمی‌تر است."
  ],
  [
    "reporting-verb-relative-omitted-object",
    "ضمیر مفعولی در restrictive relative می‌تواند حذف شود.",
    "The book I bought is excellent.",
    "ضمیر فاعلی را حذف نکن."
  ],
  [
    "reporting-verb-relative-omitted-subject",
    "ضمیر فاعلی در relative clause محدودکننده حذف نمی‌شود، مگر ساختار reduced participle بسازی.",
    "The man who called is here.",
    "The man calling is here ساختار reduced است."
  ],
  [
    "reporting-verb-relative-omission-nondefining",
    "ضمیر موصولی در non-defining clause حذف نمی‌شود.",
    "My car, which I bought last year, is electric.",
    "با ویرگول و ضمیر موصولی کامل بنویس."
  ],
  [
    "reporting-verb-relative-contact",
    "contact clause مفعولی بدون ضمیر است و برای فاعل موصولی مجاز نیست.",
    "The person I met...",
    "در نقش فاعلی: the person who met me."
  ],
  [
    "reporting-verb-relative-preposition-stranding",
    "حرف اضافه می‌تواند در انتهای restrictive relative بماند.",
    "the topic we talked about",
    "در نثر رسمی، fronting ممکن است ترجیح داده شود."
  ],
  [
    "reporting-verb-relative-pied-piping",
    "حرف اضافه همراه ضمیر موصولی به آغاز بند منتقل می‌شود.",
    "the topic about which we talked",
    "در این ساختار that/zero relative نمی‌آید."
  ],
  [
    "reporting-verb-relative-reduced-ing",
    "active relative clause به -ing کاهش می‌یابد.",
    "the people working here",
    "فاعل ضمنی همان head noun است."
  ],
  [
    "reporting-verb-relative-reduced-ed",
    "passive relative clause به past participle کاهش می‌یابد.",
    "the documents signed yesterday",
    "اگر participle صفت واژگانی باشد تحلیل ممکن است متفاوت باشد."
  ],
  [
    "reporting-verb-relative-reduced-to",
    "برخی relative clauseها با to-infinitive کاهش می‌یابند، اغلب پس از first/only/next/superlative.",
    "the first person to arrive",
    "معنی active/passive و نقش فاعل ضمنی را بررسی کن."
  ],
  [
    "reporting-verb-relative-reduced-preposition",
    "relative clause می‌تواند به عبارت حرف اضافه‌ای کاهش یابد.",
    "the room at the end of the hall",
    "رابطهٔ مکانی/توصیفی باید روشن باشد."
  ],
  [
    "reporting-verb-relative-nested-avoid",
    "relative clauseهای چندلایه می‌توانند پردازش را دشوار کنند؛ نثر حرفه‌ای جمله را ساده می‌کند.",
    "The report that the analyst who left wrote...",
    "این ساختار از نظر نحوی ممکن اما از نظر سبک نامطلوب است."
  ],
  [
    "reporting-verb-relative-which-entire",
    "which می‌تواند به کل جمله/رویداد پیشین اشاره کند.",
    "He resigned, which surprised everyone.",
    "مرجع which را با اسم نزدیک اشتباه نکن."
  ],
  [
    "reporting-verb-relative-as-entire",
    "as می‌تواند به گزارهٔ کل ارجاع دهد، به‌ویژه در عبارت‌های as expected/as noted.",
    "As we have seen, the trend is clear.",
    "as ممکن است بند وابستهٔ مقایسه‌ای/علّی نیز باشد."
  ],
  [
    "reporting-verb-relative-which-is",
    "which is + adjective/noun clause برای توضیح نتیجه/ویژگی گزارهٔ قبلی است.",
    "The sample is small, which is a limitation.",
    "برای رفع ابهام می‌توان this fact را به‌کار برد."
  ],
  [
    "reporting-verb-relative-which-in-turn",
    "which in turn نشان‌دهندهٔ پیامد زنجیره‌ای است.",
    "Costs rose, which in turn reduced investment.",
    "رابطهٔ علّی را با شواهد پشتیبانی کن."
  ],
  [
    "reporting-verb-relative-which-then",
    "which then برای مرحلهٔ بعدی/پیامد زمانی است.",
    "The firm cut jobs, which then affected demand.",
    "زمان و مرجع relative روشن باشد."
  ],
  [
    "reporting-verb-relative-which-otherwise",
    "which otherwise می‌تواند به حالت جایگزین/در غیر این صورت اشاره کند.",
    "The rule, which otherwise seems simple,...",
    "جایگاه otherwise دامنه را تعیین می‌کند."
  ],
  [
    "reporting-verb-relative-which-including",
    "which, including... می‌تواند اطلاعات افزوده بدهد، اما گاهی ابهام دامنه می‌سازد.",
    "The report, which includes three charts,...",
    "فاعل/مرجع including را روشن کن."
  ],
  [
    "reporting-verb-relative-such-as",
    "such as نمونه‌ها را معرفی می‌کند و لزوماً کل مجموعه نیست.",
    "assets such as gold and oil",
    "such as می‌تواند پیش از گروه اسمی بیاید."
  ],
  [
    "reporting-verb-relative-like-examples",
    "like برای مثال در گفتار رایج است؛ such as در نثر رسمی دقیق‌تر است.",
    "countries such as Germany and Japan",
    "like می‌تواند معنی شباهت داشته باشد و ابهام بسازد."
  ],
  [
    "reporting-verb-relative-including-excluding",
    "including/excluding گروه‌های افزوده/مستثنا را مشخص می‌کنند و بر دامنهٔ شمار اثر دارند.",
    "All firms, including subsidiaries, must report.",
    "نشانه‌گذاری مشخص می‌کند عبارت توضیحی است یا محدودکننده."
  ],
  [
    "reporting-verb-relative-respectively",
    "respectively تناظر عناصر موازی را در بند/جمله مشخص می‌کند.",
    "A and B rose 3% and 5%, respectively.",
    "فهرست‌ها باید دقیقاً هم‌طول و موازی باشند."
  ],
  [
    "reporting-verb-relative-former-latter",
    "former/latter به دو مرجع پیشین اشاره می‌کنند؛ در متون طولانی مبهم می‌شوند.",
    "Of the two plans, the former is cheaper.",
    "برای وضوح، اسم را تکرار کن اگر فاصله زیاد است."
  ],
  [
    "reporting-verb-relative-respective",
    "respective صفت توزیعی است و هر عنصر را به مورد متناظر وصل می‌کند.",
    "They returned to their respective offices.",
    "respectively قید است و جایگاه متفاوت دارد."
  ],
  [
    "reporting-verb-relative-respectively-vs-respective",
    "respective پیش از اسم و respectively معمولاً پس از فعل/عبارت داده‌ای می‌آید.",
    "their respective roles; they scored 5 and 7, respectively.",
    "این دو را از نظر نقش دستوری اشتباه نگیر."
  ],
  [
    "reporting-verb-relative-former-latter-agreement",
    "former/latter به یک عضو از دو مرجع اشاره می‌کند و فعل با آن مفرد می‌آید.",
    "The former is more expensive.",
    "برای بیش از دو مرجع، first/second/third روشن‌تر است."
  ],
  [
    "reporting-verb-relative-same-as",
    "the same as برای برابری و the same that برای همان مورد مشخص/تأکید خاص است.",
    "This is the same as before.",
    "در بسیاری کاربردها same as رایج‌تر است."
  ],
  [
    "reporting-verb-relative-such-as-that",
    "such...that نتیجهٔ شدت؛ such as مثال؛ دو ساختار متفاوت‌اند.",
    "such a shock that... / assets such as gold",
    "نشانه‌گذاری و نوع بند را تشخیص بده."
  ],
  [
    "reporting-verb-relative-as-many-as",
    "as many as برای تأکید بر تعداد زیاد/غافلگیرکننده و as much as برای مقدار است.",
    "As many as 500 firms applied.",
    "as much as + amount/uncountable noun."
  ],
  [
    "reporting-verb-relative-as-few-as",
    "as few as برای تعداد اندک و غافلگیرکننده است.",
    "As few as ten people attended.",
    "few با count plural می‌آید."
  ],
  [
    "reporting-verb-relative-no-more-than",
    "no more than بر سقف/محدودیت عددی تأکید می‌کند؛ not more than در برخی کاربردها خنثی‌تر است.",
    "No more than 20 people attended.",
    "no less than برای تأکید بر مقدار زیاد نیز به‌کار می‌رود."
  ],
  [
    "reporting-verb-relative-no-less-than",
    "no less than می‌تواند مقدار قابل‌توجه/غافلگیرکننده را برجسته کند.",
    "No less than 80% agreed.",
    "در متن آماری خنثی، at least یا 80% روشن‌تر است."
  ],
  [
    "reporting-verb-relative-not-less-than",
    "not less than به معنی حداقل/کمتر از نبودن و رسمی است.",
    "The fee is not less than $100.",
    "at least ساده‌تر و روان‌تر است."
  ],
  [
    "reporting-verb-relative-at-least-most",
    "at least و at most حد پایین/بالا را مشخص می‌کنند.",
    "At least 30 firms applied; at most 10 succeeded.",
    "تفاوت lower bound و upper bound را حفظ کن."
  ],
  [
    "reporting-verb-relative-up-to",
    "up to می‌تواند حداکثر مقدار یا تا مقصد/زمان را نشان دهد.",
    "Up to 50% of users may be affected.",
    "در تبلیغات، up to گاهی گمراه‌کننده است؛ مقدار واقعی را مشخص کن."
  ],
  [
    "reporting-verb-relative-more-or-less",
    "more or less به معنی تقریباً/تا حدی است و register غیررسمی‌تر دارد.",
    "The figures are more or less stable.",
    "در متن رسمی approximately/roughly مناسب‌تر است."
  ],
  [
    "reporting-verb-relative-somewhat",
    "somewhat قید درجه برای تعدیل صفت/قید است.",
    "The results are somewhat uncertain.",
    "somewhat رسمی‌تر از a bit است."
  ],
  [
    "reporting-verb-relative-rather",
    "rather می‌تواند شدت، ترجیح یا اصلاح تقابلی را بیان کند.",
    "rather expensive; rather than; or rather",
    "جایگاه و ساختار معنی را تعیین می‌کند."
  ],
  [
    "reporting-verb-relative-pretty",
    "pretty به‌عنوان قید شدت در گفتار غیررسمی رایج است.",
    "pretty good; pretty difficult",
    "در نثر رسمی fairly/quite مناسب‌تر است."
  ],
  [
    "reporting-verb-relative-fairly",
    "fairly شدت متوسط و اغلب مثبت/خنثی می‌دهد.",
    "fairly clear",
    "fairly با rather از نظر نگرش و شدت فرق دارد."
  ],
  [
    "reporting-verb-relative-quite",
    "quite با صفت درجه‌پذیر می‌تواند تا حدی/نسبتاً و با صفت مطلق کاملاً باشد.",
    "quite good; quite impossible",
    "لهجه و نوع صفت بر معنی اثر دارد."
  ],
  [
    "reporting-verb-relative-rather-too",
    "rather و too هر دو شدت می‌دهند اما too اغلب معنی بیش از حد/نامطلوب دارد.",
    "rather expensive; too expensive to buy",
    "too + infinitive نتیجهٔ عدم امکان/کفایت را می‌سازد."
  ],
  [
    "reporting-verb-relative-enough-of",
    "enough of + determiner/pronoun/noun برای مقدار کافی است.",
    "Enough of the evidence is available.",
    "enough + plural noun بدون of نیز ممکن است: enough reports."
  ],
  [
    "reporting-verb-relative-too-much-many",
    "too much با mass و too many با plural count noun می‌آید.",
    "too much debt; too many loans",
    "much/many در پرسش و منفی نیز کاربرد دارند."
  ],
  [
    "reporting-verb-relative-so-much-many",
    "so much/so many برای شدت مقدار/تعداد و نتیجهٔ that می‌آید.",
    "so much money that...; so many firms that...",
    "such + noun phrase ساختار موازی است."
  ],
  [
    "reporting-verb-relative-as-much-many",
    "as much/as many as برای برابری مقدار/تعداد است.",
    "as much capital as possible; as many jobs as...",
    "اسم mass/count تعیین‌کننده است."
  ],
  [
    "reporting-verb-relative-the-more",
    "the more...the more رابطهٔ همبستگی/تغییر موازی می‌سازد.",
    "The more you practise, the more confident you become.",
    "هر بند باید comparative داشته باشد؛ ترتیب می‌تواند کوتاه/بلند باشد."
  ],
  [
    "reporting-verb-relative-less-and-less",
    "less and less برای کاهش تدریجی مقدار/درجه است؛ fewer and fewer برای count plural.",
    "less and less time; fewer and fewer jobs",
    "اسم پس از آن نوع ساختار را تعیین می‌کند."
  ],
  [
    "reporting-verb-relative-more-and-more",
    "more and more برای افزایش تدریجی مقدار/تعداد/درجه است.",
    "More and more people work remotely.",
    "با اسم mass یا plural count می‌آید."
  ],
  [
    "reporting-verb-relative-bigger-and-bigger",
    "reduplicated comparative برای تغییر تدریجی صفت/قید است.",
    "The gap is getting wider and wider.",
    "با صفت‌های چندبخشی، more and more + adjective نیز رایج است."
  ],
  [
    "reporting-verb-relative-far-more",
    "far/much/a lot/even + comparative برای تقویت مقایسه است.",
    "far more effective; much less expensive",
    "very + comparative در معیار عمومی نادرست/نامأنوس است."
  ],
  [
    "reporting-verb-relative-by-far-superlative",
    "by far + superlative برای برجسته‌کردن فاصلهٔ زیاد است.",
    "It is by far the best option.",
    "by far با comparative نیز در برخی ساختارها می‌آید."
  ],
  [
    "reporting-verb-relative-one-of-superlative",
    "one of the + superlative + plural noun ساختار رایج است.",
    "one of the most influential economists",
    "head noun one مفرد است؛ اسم پس از superlative جمع."
  ],
  [
    "reporting-verb-relative-the-second-most",
    "the second/third + superlative برای رتبه‌بندی است.",
    "the second-largest economy",
    "ترتیب عدد ترتیبی و superlative را حفظ کن."
  ],
  [
    "reporting-verb-relative-least",
    "the least + adjective/adverb برای کمترین درجه است.",
    "the least expensive option",
    "least با uncountable/gradable adjective معنی متفاوت می‌سازد."
  ],
  [
    "reporting-verb-relative-most-vs-most-of",
    "most + noun به معنی بیشترِ کلی؛ most of + determiner/pronoun به مجموعهٔ مشخص اشاره می‌کند.",
    "Most people agree. / Most of the people here agree.",
    "of را پیش از the/my/these/them به‌کار ببر."
  ],
  [
    "reporting-verb-relative-all-vs-all-of",
    "all + noun و all of + determiner/pronoun؛ of پیش از ضمیر لازم است.",
    "all the money; all of it",
    "all of the money نیز درست است."
  ],
  [
    "reporting-verb-relative-both-vs-both-of",
    "both + noun و both of + pronoun/determiner برای دو مورد است.",
    "both reports; both of them",
    "both the reports و both of the reports هر دو پذیرفته‌اند."
  ],
  [
    "reporting-verb-relative-half-vs-half-of",
    "half + determiner + noun یا half of + pronoun؛ ساختارهای اندازه‌گیری نیز ممکن است.",
    "half the population; half of it",
    "half a dozen و one and a half hours الگوهای خاص دارند."
  ],
  [
    "reporting-verb-relative-double-comparative",
    "از more + comparative -er و most + -est در یک صفت واحد پرهیز کن.",
    "more useful; taller; most useful",
    "more and more useful ساختار تدریجی صحیح است."
  ],
  [
    "reporting-verb-relative-irregular-comparative",
    "good/bad/far/little/many صورت‌های مقایسه‌ای بی‌قاعده دارند.",
    "good-better-best; bad-worse-worst",
    "farther/further و less/lesser تفاوت‌های معنایی دارند."
  ],
  [
    "reporting-verb-relative-lesser",
    "lesser به معنی کوچک‌تر/کم‌اهمیت‌تر و بیشتر صفتی است؛ less کمیت/درجه را نشان می‌دهد.",
    "the lesser risk; less risk",
    "lesser of two evils عبارت تثبیت‌شده است."
  ],
  [
    "reporting-verb-relative-farthest-furthest",
    "farthest/furthest عالی فاصله/پیشرفت را بیان می‌کنند.",
    "the farthest point; the furthest research",
    "هم‌پوشانی و تفاوت گونه‌ای وجود دارد."
  ],
  [
    "reporting-verb-relative-older-elder",
    "older عمومی‌تر؛ elder عمدتاً پیش از اسم خویشاوندی و بدون than.",
    "my elder brother; older than me",
    "elderly صفت به معنی سالمند است و ساختار دیگری دارد."
  ],
  [
    "reporting-verb-relative-latest-last",
    "latest یعنی جدیدترین/آخرین از نظر زمان انتشار؛ last می‌تواند قبلی یا پایانی باشد.",
    "the latest report; last year's report",
    "latest news عبارت تثبیت‌شده است."
  ],
  [
    "reporting-verb-relative-nearest-next",
    "nearest فاصلهٔ مکانی/مفهومی؛ next ترتیب/زمان بعدی را بیان می‌کند.",
    "the nearest station; the next meeting",
    "next door و next week بدون article می‌آیند."
  ],
  [
    "reporting-verb-relative-very-first",
    "very پیش از ordinal برای تأکید می‌آید.",
    "the very first day",
    "very به معنی دقیقاً/خودِ در این ساختار است، نه قید شدت عادی."
  ],
  [
    "reporting-verb-relative-actual-very",
    "actual و very در بعضی collocationها تفاوت معنایی دارند؛ actual یعنی واقعی، very یعنی دقیقاً همان.",
    "the actual cost; the very same cost",
    "actual را با current اشتباه نکن."
  ],
  [
    "reporting-verb-relative-current-present",
    "current به معنی کنونی و present بسته به ساختار می‌تواند حاضر/فعلی باشد.",
    "current policy; the people present",
    "present در جایگاه صفت قبل اسم می‌تواند معنی کنونی یا هدیه نیز بدهد."
  ],
  [
    "reporting-verb-relative-late-lately",
    "late یعنی دیر/مرحوم و lately یعنی اخیراً.",
    "He arrived late. / I haven't seen him lately.",
    "lately اغلب با present perfect می‌آید."
  ],
  [
    "reporting-verb-relative-hard-hardly",
    "hard یعنی سخت/با تلاش؛ hardly یعنی تقریباً نه.",
    "She works hard. / She hardly works.",
    "hardly قید منفی‌معناست و در آغاز وارونگی می‌سازد."
  ],
  [
    "reporting-verb-relative-high-highly",
    "high مکان/مقدار فیزیکی؛ highly درجهٔ ارزیابی/شدت.",
    "Prices rose high; highly respected",
    "highly successful و high above کاربردهای متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-near-nearly",
    "near مکان/زمان نزدیک؛ nearly تقریباً.",
    "The deadline is near. / nearly finished",
    "near نیز حرف اضافه/صفت/قید است."
  ],
  [
    "reporting-verb-relative-mostly-almost",
    "mostly یعنی عمدتاً و almost یعنی تقریباً.",
    "The sample is mostly male. / almost complete",
    "almost با all/every و عدد می‌آید اما معمولاً پیش از اسم مستقل نه."
  ],
  [
    "reporting-verb-relative-already-all-ready",
    "already یعنی پیش‌تر و all ready یعنی همگی آماده.",
    "The team has already left. / They are all ready.",
    "تفاوت املایی/معنایی را حفظ کن."
  ],
  [
    "reporting-verb-relative-altogether-all-together",
    "altogether یعنی کاملاً/در مجموع؛ all together یعنی همگی با هم.",
    "The plan failed altogether. / We met all together.",
    "ساختار و معنی را از هم جدا کن."
  ],
  [
    "reporting-verb-relative-everyday-every-day",
    "everyday صفت و every day عبارت قیدی زمانی است.",
    "everyday language; practise every day",
    "صفت پیش از اسم و عبارت زمانی جدا نوشته می‌شود."
  ],
  [
    "reporting-verb-relative-maybe-may-be",
    "maybe قید احتمال؛ may be فعل وجهی + be.",
    "Maybe he is right. / He may be right.",
    "نقش دستوری و جایگاه را بررسی کن."
  ],
  [
    "reporting-verb-relative-sometime-sometimes",
    "sometime زمانی نامشخص؛ sometimes بسامد؛ some time مدت.",
    "Call me sometime. / sometimes; spend some time",
    "املای یکپارچه/جدا معنی را عوض می‌کند."
  ],
  [
    "reporting-verb-relative-anytime-any-time",
    "anytime قید زمانی در AmE و any time گروه اسمی/عبارت زمانی.",
    "Call anytime. / at any time",
    "در برخی سبک‌های BrE any time جدا ترجیح داده می‌شود."
  ],
  [
    "reporting-verb-relative-everyone-every-one",
    "everyone ضمیر مفرد؛ every one + of برای تک‌تک اعضای گروه.",
    "Everyone is here. / every one of them",
    "everybody و everyone از نظر توافق مفردند."
  ],
  [
    "reporting-verb-relative-someone-some-one",
    "someone ضمیر نامعین؛ some one در کاربرد تأکیدی/محدود بسیار نادر است.",
    "Someone called.",
    "برای معنی یک نفر از گروه خاص، one of them روشن‌تر است."
  ],
  [
    "reporting-verb-relative-anyone-any-one",
    "anyone شخص نامعین؛ any one تأکید بر هر عضو از مجموعه.",
    "Anyone can apply. / any one of these options",
    "ساختارهای determiner و pronoun را تفکیک کن."
  ],
  [
    "reporting-verb-relative-no-one-none",
    "no one برای هیچ شخص؛ none برای هیچ‌یک از افراد/اشیا/مقدار.",
    "No one knows. / None of the files remain.",
    "no one دو واژه و فعل مفرد؛ none توافق متغیر."
  ],
  [
    "reporting-verb-relative-nobody-no-body",
    "nobody ضمیر؛ no body گروه اسمی با معنی جسم/بدن در بافت خاص.",
    "Nobody answered.",
    "املای جدا معمولاً معنی دیگری دارد."
  ],
  [
    "reporting-verb-relative-somewhere-some-place",
    "somewhere قید مکان؛ some place گروه اسمی است.",
    "I left it somewhere.",
    "somewhere else و anywhere else ترکیب‌های رایج‌اند."
  ],
  [
    "reporting-verb-relative-anywhere",
    "anywhere در پرسش/منفی/شرط و معنی آزاد به‌کار می‌رود.",
    "I can't find it anywhere.",
    "somewhere در جملهٔ مثبت خنثی‌تر است."
  ],
  [
    "reporting-verb-relative-nowhere",
    "nowhere قید/ضمیر منفی‌معناست و معمولاً با فعل مثبت می‌آید.",
    "There is nowhere to go.",
    "با not هم‌زمان برای یک نفی معیار پرهیز شود."
  ],
  [
    "reporting-verb-relative-everywhere",
    "everywhere برای تمام مکان‌ها و گاهی اغراق است.",
    "The news is everywhere.",
    "everywhere + clause نیز ممکن است."
  ],
  [
    "reporting-verb-relative-somehow",
    "somehow به معنی به‌نحوی/به هر ترتیب است.",
    "Somehow, we managed to finish.",
    "some way گروه اسمی متفاوت است."
  ],
  [
    "reporting-verb-relative-anyhow-anyway",
    "anyhow/anyway برای هر طور/در هر حال و تغییر موضوع در گفتار است.",
    "Anyway, let's continue.",
    "register محاوره‌ای؛ nevertheless رسمی‌تر."
  ],
  [
    "reporting-verb-relative-somewhat-of",
    "somewhat of a + singular noun برای ارزیابی نسبی است.",
    "It was somewhat of a surprise.",
    "ساختار رسمی‌تر: something of a surprise."
  ],
  [
    "reporting-verb-relative-kind-of",
    "kind of به معنی نوعی از یا قید شدت غیررسمی است.",
    "a kind of tool; I'm kind of tired.",
    "در نثر رسمی somewhat/rather مناسب‌تر است."
  ],
  [
    "reporting-verb-relative-sort-of",
    "sort of مانند kind of، برای طبقه‌بندی یا تعدیل غیررسمی است.",
    "a sort of agreement; sort of difficult",
    "معنی دقیق از نقش و بافت مشخص می‌شود."
  ],
  [
    "reporting-verb-relative-type-of",
    "type of برای نوع/طبقه‌بندی و در ساختارهای مفرد/جمع است.",
    "this type of policy; these types of policies",
    "these type of در نثر رسمی نادرست است."
  ],
  [
    "reporting-verb-relative-kind-of-agreement",
    "this/that kind of + singular noun؛ these/those kinds of + plural noun.",
    "this kind of problem; these kinds of problems",
    "توافق determiner با kind/kinds را حفظ کن."
  ],
  [
    "reporting-verb-relative-number-of-noun",
    "a number of + plural count noun؛ amount of + mass noun؛ type of + count/mass بر اساس معنی.",
    "a number of firms; an amount of capital",
    "head noun و اسم پس از of را تفکیک کن."
  ],
  [
    "reporting-verb-relative-sort-of-plural",
    "these/those sorts of + plural noun ساختار معیار است.",
    "those sorts of problems",
    "this sort of problem نیز مفرد است."
  ],
  [
    "reporting-verb-relative-a-kind-of",
    "a kind of + singular noun برای طبقه‌بندی؛ kinds of + plural noun برای انواع.",
    "a kind of investment; several kinds of investments",
    "در برخی کاربردها kind of + adjective قید شدت است."
  ],
  [
    "reporting-verb-relative-what-kind",
    "what kind/type/sort of + noun برای پرسش طبقه‌بندی است.",
    "What kind of data do you need?",
    "نوع اسم بعدی شمارش‌پذیر/غیرقابل‌شمارش را تعیین می‌کند."
  ],
  [
    "reporting-verb-relative-such-kind",
    "such a kind of ساختار ممکن اما گاهی سنگین است؛ such kind of + noun در کاربردهای منطقه‌ای.",
    "such a policy; this kind of policy",
    "در انگلیسی معیار روان، such a + noun یا this kind of را ترجیح بده."
  ],
  [
    "reporting-verb-relative-all-kinds",
    "all kinds of + plural/mass noun برای تنوع گسترده است.",
    "all kinds of problems; all kinds of information",
    "فعل با هستهٔ گروه اسمی/مرجع معنایی هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-other-than",
    "other than برای استثنا/تفاوت و به‌عنوان حرف اضافه/پیونددهنده است.",
    "No one other than the chair objected.",
    "other + noun و others ضمیر را تفکیک کن."
  ],
  [
    "reporting-verb-relative-rather-than-coordination",
    "rather than می‌تواند contrast و alternative بسازد؛ parallelism باید حفظ شود.",
    "We need evidence rather than speculation.",
    "در جایگاه‌های مختلف نقش نحوی آن متفاوت تحلیل می‌شود."
  ],
  [
    "reporting-verb-relative-as-opposed-to",
    "as opposed to + noun/gerund برای تقابل صریح است.",
    "fixed costs as opposed to variable costs",
    "to حرف اضافه است و gerund می‌گیرد."
  ],
  [
    "reporting-verb-relative-instead-of-gerund",
    "instead of + noun/gerund؛ به‌عنوان عبارت قیدی جایگزینی را نشان می‌دهد.",
    "Instead of cutting staff, they reduced bonuses.",
    "فاعل ضمنی gerund باید با جمله سازگار باشد."
  ],
  [
    "reporting-verb-relative-in-lieu-of",
    "in lieu of + noun/gerund عبارت رسمی به معنی به‌جای است.",
    "in lieu of payment",
    "register حقوقی/اداری است."
  ],
  [
    "reporting-verb-relative-on-behalf-of",
    "on behalf of + noun/pronoun برای نمایندگی است.",
    "She spoke on behalf of the board.",
    "behalf اسم است و of لازم دارد."
  ],
  [
    "reporting-verb-relative-in-terms-of",
    "in terms of + noun/gerund برای بیان معیار/جنبه است.",
    "in terms of cost and efficiency",
    "عبارت کلیشه‌ای را بی‌دلیل زیاد تکرار نکن."
  ],
  [
    "reporting-verb-relative-with-regard-to",
    "with regard to/regarding/concerning + noun برای موضوع است.",
    "With regard to your question...",
    "regards در پایان نامه معنای دیگری دارد."
  ],
  [
    "reporting-verb-relative-as-regards",
    "as regards + noun برای موضوع، رسمی‌تر است.",
    "As regards the budget, no decision has been made.",
    "as regard نادرست است."
  ],
  [
    "reporting-verb-relative-irrespective-of",
    "irrespective of + noun/gerund برای مستقل از است.",
    "irrespective of age",
    "irrespective whether نیازمند of whether است."
  ],
  [
    "reporting-verb-relative-regardless-of",
    "regardless of + noun/gerund برای بدون توجه به است.",
    "regardless of the outcome",
    "regardless whether در برخی کاربردها شنیده می‌شود؛ regardless of whether روشن‌تر."
  ],
  [
    "reporting-verb-relative-depending-on",
    "depending on + noun/clause برای وابستگی به شرایط است.",
    "Depending on demand, prices may change.",
    "فاعل ضمنی باید با فاعل جمله سازگار باشد."
  ],
  [
    "reporting-verb-relative-subject-to",
    "subject to + noun/gerund برای مشروط/در معرض بودن است.",
    "The plan is subject to approval.",
    "subjected to فعل مجهول متفاوتی است."
  ],
  [
    "reporting-verb-relative-in-spite-of",
    "in spite of + noun/gerund برای تقابل است.",
    "In spite of the delay, we proceeded.",
    "in spite of the fact that + clause."
  ],
  [
    "reporting-verb-relative-regardless",
    "regardless به‌تنهایی قید است؛ regardless of + noun.",
    "We will proceed regardless.",
    "از regardless of whether برای بند استفاده کن."
  ],
  [
    "reporting-verb-relative-notwithstanding",
    "notwithstanding می‌تواند حرف اضافه/قید و جایگاه‌های مختلف داشته باشد.",
    "Notwithstanding the objections, the bill passed.",
    "در نثر عمومی despite ساده‌تر است."
  ],
  [
    "reporting-verb-relative-albeit",
    "albeit + adjective/noun phrase برای concessive فشرده است.",
    "The policy was effective, albeit costly.",
    "albeit that + clause نیز در برخی کاربردهای رسمی ممکن است."
  ],
  [
    "reporting-verb-relative-whereas",
    "whereas بند تقابلی می‌سازد و با while زمانی اشتباه نشود.",
    "The north grew, whereas the south contracted.",
    "معمولاً بند کامل می‌گیرد."
  ],
  [
    "reporting-verb-relative-while-ambiguity",
    "while می‌تواند زمان، تقابل یا concession باشد و ابهام ایجاد کند.",
    "While costs fell, output rose.",
    "برای رفع ابهام during/although/whereas را انتخاب کن."
  ],
  [
    "reporting-verb-relative-whilst",
    "whilst گونهٔ بریتانیایی/رسمی‌تر while است.",
    "Whilst costs fell, output rose.",
    "در انگلیسی آمریکایی while رایج‌تر است."
  ],
  [
    "reporting-verb-relative-amid-amidst",
    "amid/amidst + noun برای «در میان/هم‌زمان با» و register خبری/رسمی است.",
    "amid rising uncertainty",
    "amidst قدیمی‌تر/ادبی‌تر و هر دو پذیرفته‌اند."
  ],
  [
    "reporting-verb-relative-amid-vs-during",
    "amid معمولاً فضای/شرایط پیرامون و during بازهٔ زمانی را برجسته می‌کند.",
    "amid turmoil; during the meeting",
    "این تفاوت گرایشی است و هم‌پوشانی ممکن است."
  ],
  [
    "reporting-verb-relative-throughout",
    "throughout + noun برای تمام مدت/تمام مکان است.",
    "throughout the year; throughout Europe",
    "throughout می‌تواند قید مستقل نیز باشد."
  ],
  [
    "reporting-verb-relative-over-time",
    "over + period برای در طول بازه و over time برای به‌تدریج است.",
    "over the past decade; change over time",
    "زمان‌های فعل با نقطهٔ مرجع هماهنگ شوند."
  ],
  [
    "reporting-verb-relative-within",
    "within + period برای حداکثر تا پایان بازه و درون محدودهٔ مکانی است.",
    "within three days; within the city",
    "within three days یعنی قبل از پایان سه روز، نه لزوماً در روز سوم."
  ],
  [
    "reporting-verb-relative-by-time",
    "by + time برای deadline/حداکثر زمان تکمیل است.",
    "Submit the report by Friday.",
    "until Friday بر ادامه تا آن زمان تأکید می‌کند."
  ],
  [
    "reporting-verb-relative-until-time",
    "until/till برای ادامهٔ وضعیت/عمل تا نقطهٔ زمانی است.",
    "The office is open until six.",
    "not until برای تأکید بر تأخیر/عدم وقوع تا آن نقطه است."
  ],
  [
    "reporting-verb-relative-from-to",
    "from...to و between...and برای محدودهٔ زمانی/مکانی‌اند.",
    "from Monday to Friday; between 2020 and 2024",
    "between بدون and در برخی ساختارهای دیگر می‌آید."
  ],
  [
    "reporting-verb-relative-by-until",
    "by و until را برای مهلت و تداوم اشتباه نکن.",
    "Finish by noon; wait until noon.",
    "این تمایز یکی از خطاهای رایج زبان‌آموزان است."
  ],
  [
    "reporting-verb-relative-since-for",
    "since نقطهٔ آغاز و for مدت را معرفی می‌کند.",
    "since 2020; for six years",
    "since + clause می‌تواند علت نیز باشد."
  ],
  [
    "reporting-verb-relative-during-for",
    "during + noun phrase و for + duration؛ during two hours در معیار عمومی نامأنوس است.",
    "during the meeting; for two hours",
    "over the course of two hours نیز ممکن است."
  ],
  [
    "reporting-verb-relative-in-on-at-place",
    "in فضای محصور/منطقه، on سطح/خط، at نقطه/موقعیت را می‌رساند.",
    "in Germany; on the coast; at the station",
    "ترکیب‌های تثبیت‌شده و نگاه مفهومی استثنا می‌سازند."
  ],
  [
    "reporting-verb-relative-to-into-onto",
    "to مقصد، into حرکت به داخل و onto حرکت به سطح را مشخص می‌کند.",
    "go to the room; walk into the room; step onto the stage",
    "افعال و بافت می‌توانند انتخاب را تغییر دهند."
  ],
  [
    "reporting-verb-relative-in-into",
    "in موقعیت و into حرکت/تغییر حالت را برجسته می‌کند.",
    "The money is in the account. / Put it into the account.",
    "into در phrasal verbها معنی واژگانی دارد."
  ],
  [
    "reporting-verb-relative-on-onto",
    "on موقعیت و onto حرکت به سطح را نشان می‌دهد.",
    "The book is on the table. / Put it onto the table.",
    "on to می‌تواند دو بخش مستقل باشد: move on to the next topic."
  ],
  [
    "reporting-verb-relative-at-to",
    "at نقطهٔ مکانی/زمانی و to جهت/مقصد را نشان می‌دهد.",
    "at the airport; go to the airport",
    "arrive at و go to الگوهای واژگانی‌اند."
  ],
  [
    "reporting-verb-relative-above-over",
    "above موقعیت بالاتر و over می‌تواند پوشش/حرکت/مقدار بیشتر را نشان دهد.",
    "above the clouds; a bridge over the river",
    "over نیز در معنی بیش از و در طول زمان می‌آید."
  ],
  [
    "reporting-verb-relative-below-under",
    "below سطح پایین‌تر و under زیر/کمتر از/تحت کنترل را بیان می‌کند.",
    "below zero; under the table; under pressure",
    "معنی استعاری و literal را از بافت جدا کن."
  ],
  [
    "reporting-verb-relative-between-among",
    "between برای روابط جداگانهٔ اعضا و among برای قرار گرفتن در یک گروه؛ between می‌تواند بیش از دو مورد هم باشد.",
    "between the three countries; among friends",
    "قاعدهٔ دو در برابر چند مطلق نیست؛ نوع رابطه مهم است."
  ],
  [
    "reporting-verb-relative-beside-besides",
    "beside یعنی کنار؛ besides یعنی علاوه بر.",
    "beside the river; besides the cost",
    "املای یک s تفاوت معنی را عوض می‌کند."
  ],
  [
    "reporting-verb-relative-near-nearby",
    "near حرف اضافه/صفت/قید؛ nearby عمدتاً صفت/قید و بدون مفعول حرف اضافه‌ای.",
    "near the station; a nearby station",
    "nearby to در کاربرد عمومی معمولاً پرهیز می‌شود."
  ],
  [
    "reporting-verb-relative-opposite-in-front",
    "opposite روبه‌رو؛ in front of جلوی چیزی در جهت/ترتیب.",
    "opposite the bank; in front of the bank",
    "opposite of برای تضاد معنایی ساختار دیگری است."
  ],
  [
    "reporting-verb-relative-across-through",
    "across حرکت/گستره از یک سو به سوی دیگر؛ through عبور درون فضا/مسیر.",
    "across the street; through the tunnel",
    "across from برای موقعیت روبه‌رو است."
  ],
  [
    "reporting-verb-relative-along-through",
    "along در امتداد مسیر و through درون/از میان آن است.",
    "along the river; through the forest",
    "فعل حرکت و هندسهٔ مسیر تعیین‌کننده است."
  ],
  [
    "reporting-verb-relative-past-passed",
    "past حرف اضافه/قید/صفت مکانی-زمانی؛ passed گذشته/شکل سوم pass است.",
    "walk past the shop; time passed",
    "نقش دستوری را از املای مشابه تفکیک کن."
  ],
  [
    "reporting-verb-relative-raise-rise",
    "raise متعدی و rise لازم است؛ raise raised raised و rise rose risen.",
    "They raised prices. / Prices rose.",
    "raise بدون مفعول در معنی افزایش دادن نادرست/ناقص است."
  ],
  [
    "reporting-verb-relative-lie-lay",
    "lie به معنی دراز کشیدن لازم و lie-lay-lain؛ lay به معنی گذاشتن متعدی و lay-laid-laid.",
    "The book lies there. / She laid it down.",
    "lie به معنی دروغ گفتن regular است: lied-lied."
  ],
  [
    "reporting-verb-relative-sit-set",
    "sit لازم و sat-sat؛ set متعدی/لازم و set-set-set.",
    "She sat down. / Set the table.",
    "set در معنی تنظیم کردن و غروب/خورشید نیز لازم می‌آید."
  ],
  [
    "reporting-verb-relative-borrow-lend",
    "borrow دریافت موقت و lend قرض دادن است.",
    "Can I borrow your pen? / Can you lend it to me?",
    "borrow from و lend to ساختارهای جهت‌دارند."
  ],
  [
    "reporting-verb-relative-bring-take",
    "bring حرکت به سمت مرجع و take حرکت دور از مرجع/به مقصد دیگر است.",
    "Bring the files here; take them to the office.",
    "مرجع دیدگاه گوینده تعیین‌کننده است."
  ],
  [
    "reporting-verb-relative-learn-teach",
    "learn دریافت دانش و teach انتقال آموزش است.",
    "I learned English; she taught me English.",
    "learned/learnt تفاوت گونه‌ای/سبکی دارد."
  ],
  [
    "reporting-verb-relative-say-tell",
    "say محتوای گفتار و tell مخاطب/اطلاع را برجسته می‌کند.",
    "say something; tell someone something",
    "tell a story/the truth و say hello collocationهای خاص‌اند."
  ],
  [
    "reporting-verb-relative-speak-talk",
    "speak رسمی‌تر/توانایی زبان و talk گفت‌وگو/تعامل را برجسته می‌کند.",
    "speak English; talk to a colleague",
    "speak to/with و talk about نیز الگوهای مکمل دارند."
  ],
  [
    "reporting-verb-relative-see-look-watch",
    "see ادراک، look توجه جهت‌دار، watch مشاهدهٔ ممتد/تغییر را نشان می‌دهد.",
    "see a sign; look at a chart; watch a match",
    "فعل‌ها در معنی‌های دیگر هم‌پوشانی دارند."
  ],
  [
    "reporting-verb-relative-hear-listen",
    "hear ادراک صدا، listen to توجه فعال به صداست.",
    "hear a noise; listen to music",
    "listen بدون to در کاربردهای محدود/امری ممکن است: Listen!"
  ],
  [
    "reporting-verb-relative-make-do",
    "make تولید/ایجاد و do فعالیت/وظیفه؛ collocationها استثنا دارند.",
    "make a decision; do homework",
    "do business, make a mistake و make progress را واژگانی یاد بگیر."
  ],
  [
    "reporting-verb-relative-say-speak",
    "say + words/that-clause؛ speak + language/to person/about topic.",
    "She said that...; spoke to us.",
    "speak something در برخی کاربردها ممکن اما say برای محتوای نقل قول طبیعی‌تر است."
  ],
  [
    "reporting-verb-relative-advise-advice",
    "advise فعل و advice اسم mass است؛ املای c/s در BrE/AmE متفاوت نیست.",
    "They advised caution. / some advice",
    "an advice نادرست است؛ a piece of advice."
  ],
  [
    "reporting-verb-relative-practice-practise",
    "practice اسم/فعل در AmE؛ practise فعل و practice اسم در BrE.",
    "practise grammar (BrE); practice grammar (AmE)",
    "املای هدف را در کل متن یکدست نگه دار."
  ],
  [
    "reporting-verb-relative-license-licence",
    "license فعل در AmE و licence اسم در BrE؛ در AmE هر دو license.",
    "a driving licence (BrE); to license (BrE/AmE)",
    "املای BrE به نقش دستوری وابسته است."
  ],
  [
    "reporting-verb-relative-advice-advise",
    "advice /s/ اسم و advise /z/ فعل؛ تلفظ نیز متفاوت است.",
    "advice from an expert; advise someone",
    "اشتباه املایی می‌تواند نقش دستوری را تغییر دهد."
  ],
  [
    "reporting-verb-relative-device-devise",
    "device اسم ابزار و devise فعل طراحی/ابداع است.",
    "a new device; devise a strategy",
    "تلفظ و املای مشابه را تفکیک کن."
  ],
  [
    "reporting-verb-relative-affect-effect",
    "affect معمولاً فعل اثر گذاشتن؛ effect معمولاً اسم نتیجه، اما هر دو استثناهای دستوری دارند.",
    "The policy affects prices. / the effect is clear",
    "effect به‌عنوان فعل رسمی به معنی ایجاد کردن نیز ممکن است."
  ],
  [
    "reporting-verb-relative-compliment-complement",
    "compliment تعریف/تمجید و complement تکمیل‌کننده/مکمل است.",
    "a compliment; a perfect complement",
    "معنی و املای نزدیک را جدا یاد بگیر."
  ],
  [
    "reporting-verb-relative-principal-principle",
    "principal صفت/اسم به معنی اصلی/مدیر؛ principle اسم به معنی اصل.",
    "the principal reason; a guiding principle",
    "نقش دستوری را بررسی کن."
  ],
  [
    "reporting-verb-relative-stationary-stationery",
    "stationary ثابت و stationery لوازم‌التحریر است.",
    "a stationary object; office stationery",
    "هم‌آوا هستند اما معنی متفاوت."
  ],
  [
    "reporting-verb-relative-council-counsel",
    "council شورا و counsel مشاوره/وکیل یا فعل مشاوره دادن است.",
    "city council; legal counsel",
    "counsel به‌عنوان فعل نیز می‌آید."
  ],
  [
    "reporting-verb-relative-ensure-insure-assure",
    "ensure تضمین، insure بیمه، assure اطمینان دادن به شخص.",
    "ensure accuracy; insure a car; assure clients",
    "در BrE/AmE تفاوت‌های کاربردی و هم‌پوشانی محدود وجود دارد."
  ],
  [
    "reporting-verb-relative-fewer-less",
    "fewer count plural و less mass/measure؛ less than + عدد در اندازه‌گیری.",
    "fewer mistakes; less water; less than 5 km",
    "در انگلیسی روزمره less people رایج اما در ویرایش رسمی fewer people."
  ],
  [
    "reporting-verb-relative-amount-number",
    "amount برای mass و number برای count؛ quantity می‌تواند هر دو را بگیرد.",
    "amount of money; number of users",
    "amount of people در گفتار شنیده می‌شود اما number of people معیارتر است."
  ],
  [
    "reporting-verb-relative-continual-continuous",
    "continual تکرار با وقفه و continuous بدون وقفه را برجسته می‌کند.",
    "continual interruptions; continuous flow",
    "در کاربرد روزمره هم‌پوشانی وجود دارد."
  ],
  [
    "reporting-verb-relative-economic-economical",
    "economic مربوط به اقتصاد و economical کم‌هزینه/صرفه‌جویانه است.",
    "economic growth; an economical car",
    "این دو صفت جایگزین هم نیستند."
  ],
  [
    "reporting-verb-relative-historic-historical",
    "historic مهم در تاریخ و historical مربوط به تاریخ/گذشته است.",
    "a historic agreement; historical records",
    "مرز معنی به بافت وابسته است."
  ],
  [
    "reporting-verb-relative-sensible-sensitive",
    "sensible عاقلانه و sensitive حساس است.",
    "a sensible decision; sensitive data",
    "ترجمهٔ مشابه ممکن است گمراه‌کننده باشد."
  ],
  [
    "reporting-verb-relative-later-latter",
    "later زمانیِ بعدتر و latter دوم از دو مورد قبلی است.",
    "at a later date; the latter option",
    "latter معمولاً به دو مرجع نزدیک در متن اشاره می‌کند."
  ],
  [
    "reporting-verb-relative-actually-currently",
    "actually یعنی در واقع؛ currently یعنی در حال حاضر.",
    "Actually, the data are incomplete. / Currently, the system is offline.",
    "actually را به‌جای currently به‌کار نبر."
  ],
  [
    "reporting-verb-relative-eventually-finally",
    "eventually در نهایت پس از زمان/تأخیر؛ finally آخرین مرحله/بالاخره.",
    "Eventually, an agreement was reached. / Finally, the vote began.",
    "eventually به معنی احتمالاً نیست."
  ],
  [
    "reporting-verb-relative-ordinary-ordinary",
    "ordinary معمولی؛ common رایج؛ usual معمول/مورد انتظار.",
    "an ordinary day; a common error; the usual procedure",
    "انتخاب صفت بر فراوانی یا انتظار دلالت دارد."
  ],
  [
    "reporting-verb-relative-typical-usual",
    "typical ویژگی نمایندهٔ یک گروه؛ usual چیزی که معمولاً رخ می‌دهد.",
    "a typical response; the usual response",
    "typical of و usual for الگوهای حرف اضافه‌ای دارند."
  ],
  [
    "reporting-verb-relative-special-especially",
    "special صفت و especially قید برای تأکید/به‌ویژه است.",
    "a special case; especially important",
    "specially به معنی برای هدف خاص است."
  ],
  [
    "reporting-verb-relative-specially-especially",
    "especially یعنی به‌خصوص؛ specially یعنی به‌طور ویژه/برای هدف مشخص.",
    "especially useful; specially designed",
    "در برخی بافت‌ها هم‌پوشانی دارند اما کانون متفاوت است."
  ],
  [
    "reporting-verb-relative-hardly-scarcely",
    "hardly/scarcely به معنی تقریباً نه و اغلب با وارونگی آغازین‌اند.",
    "Hardly anyone agreed.",
    "hardly ever یعنی تقریباً هرگز."
  ],
  [
    "reporting-verb-relative-nearly-almost",
    "nearly/almost تقریباً؛ nearly all و almost all هر دو رایج‌اند.",
    "almost finished; nearly complete",
    "not nearly به معنی به‌هیچ‌وجه به اندازهٔ کافی نیست."
  ],
  [
    "reporting-verb-relative-almost-never",
    "almost never و hardly ever برای بسامد بسیار کم‌اند.",
    "She almost never complains.",
    "hardly ever بار منفی دارد اما فعل با صورت مثبت می‌آید."
  ],
  [
    "reporting-verb-relative-seldom-rarely",
    "seldom/rarely قید بسامد کم و در آغاز جمله وارونگی می‌سازند.",
    "Rarely do we see this pattern.",
    "seldom رسمی‌تر/کم‌کاربردتر است."
  ],
  [
    "reporting-verb-relative-occasionally",
    "occasionally, sometimes, frequently و often بسامدهای نسبی‌اند و جایگاه قید انعطاف دارد.",
    "The system occasionally fails.",
    "درصد دقیق ثابتی برای هر قید وجود ندارد."
  ],
  [
    "reporting-verb-relative-always-progressive",
    "always + progressive می‌تواند رفتار تکراری آزاردهنده/غیرمنتظره را القا کند.",
    "He is always interrupting.",
    "always + simple برای عادت خنثی است."
  ],
  [
    "reporting-verb-relative-constantly",
    "constantly می‌تواند با simple یا progressive برای بسامد/تکرار به‌کار رود.",
    "The system constantly updates.",
    "با progressive بار موقتی/ارزیابانه ممکن است."
  ],
  [
    "reporting-verb-relative-once-twice",
    "once/twice تعداد دفعات یا زمان گذشته را بیان می‌کنند.",
    "I have visited twice.",
    "once upon a time عبارت روایی تثبیت‌شده است."
  ],
  [
    "reporting-verb-relative-every-other",
    "every other + singular noun یعنی یک‌درمیان.",
    "every other day; every other page",
    "با every second در برخی گونه‌ها هم‌معنی است."
  ],
  [
    "reporting-verb-relative-every-two",
    "every + number + plural noun برای فاصلهٔ تکرار است.",
    "every two weeks; every three years",
    "واحد پس از عدد جمع می‌آید."
  ],
  [
    "reporting-verb-relative-once-every",
    "once every + period برای بسامد دوره‌ای است.",
    "once every six months",
    "once per + singular noun نیز ممکن است."
  ],
  [
    "reporting-verb-relative-twice-as",
    "twice as + adjective/adverb + as برای نسبت دوبرابری است.",
    "twice as expensive as before",
    "twice the price و double the price ساختارهای جایگزین‌اند."
  ],
  [
    "reporting-verb-relative-half-as",
    "half as...as برای نصف درجه/مقدار است.",
    "half as much as last year",
    "half the amount of نیز ممکن است."
  ],
  [
    "reporting-verb-relative-three-times",
    "three times as...as یا three times the size/amount برای نسبت است.",
    "three times as large as; three times the cost",
    "three times larger than می‌تواند از نظر منطقی مبهم باشد؛ از as...as استفاده کن."
  ],
  [
    "reporting-verb-relative-double",
    "double به‌عنوان فعل/صفت و twice as much برای نسبت استفاده می‌شود.",
    "Profits doubled. / twice as high",
    "double in size و double the amount ساختارهای مختلف‌اند."
  ],
  [
    "reporting-verb-relative-half-of-article",
    "half a/an + noun یا half of + determiner/noun group.",
    "half an hour; half of the hour",
    "one and a half hours فعل جمع می‌گیرد."
  ],
  [
    "reporting-verb-relative-one-and-half",
    "one and a half + plural noun و فعل معمولاً جمع می‌آید.",
    "One and a half hours have passed.",
    "در بیان مقدار به‌عنوان واحد، توافق مفرد گاهی شنیده می‌شود."
  ],
  [
    "reporting-verb-relative-number-of-times",
    "number of times برای دفعات و time به معنی زمان/مدت mass است.",
    "three times; no time",
    "a time می‌تواند یک موقعیت/دوره باشد."
  ],
  [
    "reporting-verb-relative-at-times",
    "at times یعنی گاهی و at a time یعنی در هر نوبت.",
    "At times, markets are volatile. / two at a time",
    "عبارت‌های ثابت را واژگانی یاد بگیر."
  ],
  [
    "reporting-verb-relative-in-time-on-time",
    "in time یعنی به‌موقع پیش از دیر شدن؛ on time یعنی دقیقاً طبق برنامه.",
    "We arrived in time. / The train was on time.",
    "just in time معنی درست در لحظهٔ لازم است."
  ],
  [
    "reporting-verb-relative-at-the-end-in-the-end",
    "at the end نقطهٔ پایانی مشخص؛ in the end نتیجهٔ نهایی پس از فرایند.",
    "At the end of the year; in the end, we agreed.",
    "end of the day می‌تواند literal یا اصطلاحی باشد."
  ],
  [
    "reporting-verb-relative-at-first-first",
    "at first یعنی ابتدا و later تغییر وضعیت؛ first می‌تواند ترتیب/اولویت باشد.",
    "At first I disagreed, but later I changed my mind.",
    "first of all برای سازمان‌دهی گفتار است."
  ],
  [
    "reporting-verb-relative-at-last-lastly",
    "at last یعنی بالاخره پس از انتظار؛ lastly برای آخرین مورد فهرست.",
    "At last, the results arrived. / Lastly, consider cost.",
    "finally نیز چند معنی دارد."
  ],
  [
    "reporting-verb-relative-finally-eventually",
    "finally ترتیب پایانی/بالاخره؛ eventually پس از گذشت زمان/فرایند.",
    "Finally, we reached a decision. / Eventually, the firm recovered.",
    "eventually معنی eventually ≠ possibly."
  ],
  [
    "reporting-verb-relative-in-the-meantime",
    "in the meantime در فاصلهٔ زمانی تا رویداد دیگر است.",
    "The review continues; in the meantime, trading is suspended.",
    "meanwhile نیز برای هم‌زمانی/تقابل می‌آید."
  ],
  [
    "reporting-verb-relative-meanwhile",
    "meanwhile قید گفتمانی برای هم‌زمانی یا تغییر موضوع است.",
    "Meanwhile, investors remain cautious.",
    "نشانه‌گذاری و کانون گفتمانی مهم است."
  ],
  [
    "reporting-verb-relative-subsequently",
    "subsequently قید رسمی برای بعد از آن است.",
    "The firm subsequently revised its forecast.",
    "subsequent + noun صفت است."
  ],
  [
    "reporting-verb-relative-prior-to",
    "prior to + noun/gerund برای پیش از و رسمی است.",
    "prior to signing the contract",
    "prior to the fact that سنگین است؛ before روشن‌تر."
  ],
  [
    "reporting-verb-relative-following",
    "following + noun برای پس از/در پی است و می‌تواند preposition باشد.",
    "Following the announcement, shares fell.",
    "following به‌عنوان participle نیز ممکن است."
  ],
  [
    "reporting-verb-relative-preceding",
    "preceding + noun برای پیشین/قبل از است.",
    "the preceding quarter",
    "precede فعل متعدی است و preposition لازم ندارد."
  ],
  [
    "reporting-verb-relative-respectful-respectable",
    "respectful نشان‌دهندهٔ احترام؛ respectable یعنی قابل احترام/آبرومند.",
    "a respectful tone; a respectable firm",
    "respectively قید دیگری است."
  ],
  [
    "reporting-verb-relative-respective-respectively",
    "respective صفت و respectively قید است.",
    "their respective positions; they stood 2nd and 3rd, respectively.",
    "نقش دستوری را بررسی کن."
  ],
  [
    "reporting-verb-relative-each-other-one-another",
    "each other و one another برای رابطهٔ متقابل‌اند؛ تمایز عددی سنتی الزام‌آور نیست.",
    "They support each other.",
    "possessive: each other's / one another's."
  ],
  [
    "reporting-verb-relative-reflexive-emphasis",
    "ضمیرهای reflexive برای هم‌مرجعی یا تأکید؛ از آن‌ها برای رسمی‌نمایی بی‌جا استفاده نکن.",
    "I did it myself. / She hurt herself.",
    "between you and me معیار است، نه between you and myself."
  ],
  [
    "reporting-verb-relative-pronoun-case-after-than",
    "پس از than، ضمیر می‌تواند با بند حذف‌شده فاعلی یا به‌عنوان مفعول تحلیل شود.",
    "She is taller than I (am). / than me.",
    "در گفتار than me طبیعی است؛ بند کامل ابهام را رفع می‌کند."
  ],
  [
    "reporting-verb-relative-pronoun-case-after-as",
    "پس از as در مقایسه، ضمیر با ساختار حذف‌شده یا مفعول حرف اضافه می‌آید.",
    "as tall as I am; as tall as me",
    "برای نوشتار رسمی بند کامل روشن‌تر است."
  ],
  [
    "reporting-verb-relative-it-is-me",
    "It is I رسمی/سنتی و It is me در انگلیسی امروز معیار عمومی است.",
    "It's me at the door.",
    "پس از linking be، pronoun case در کاربرد واقعی متفاوت از تجویز سنتی است."
  ],
  [
    "reporting-verb-relative-who-is-it",
    "Who is it? پاسخ It's me طبیعی است؛ It's I بسیار رسمی/غیرطبیعی در گفتار است.",
    "Who called? — It's me.",
    "نقش و register را از قاعدهٔ سنتی جدا کن."
  ],
  [
    "reporting-verb-relative-between-you-and-me",
    "پس از preposition حالت مفعولی لازم است.",
    "between you and me; for him and her",
    "myself را به‌جای me برای رسمی‌نمایی به‌کار نبر."
  ],
  [
    "reporting-verb-relative-subject-pronouns",
    "ضمیر فاعلی پیش از فعل و مفعولی پس از فعل/حرف اضافه می‌آید.",
    "She called him.",
    "در coordinated phrase نیز case را حفظ کن."
  ],
  [
    "reporting-verb-relative-coordinated-pronoun",
    "در گروه هماهنگ‌شده، هر جزء باید case درست بگیرد.",
    "She and I attended. / They invited her and me.",
    "حذف جزء دیگر برای آزمون case مفید است: They invited me."
  ],
  [
    "reporting-verb-relative-one's",
    "one's ضمیر ملکی متناظر با one است.",
    "One should respect one's colleagues.",
    "در گفتار عمومی you/your رایج‌تر است."
  ],
  [
    "reporting-verb-relative-singular-they-agreement",
    "singular they از نظر معنا مفرد اما فعل و ضمیرهای شکل جمع می‌گیرد.",
    "Someone left their umbrella; they are coming back.",
    "با everyone فعل مفرد است: everyone is; سپس their/them/they."
  ],
  [
    "reporting-verb-relative-they-nonbinary",
    "they برای فردی که ضمیرش they است در انگلیسی معاصر استاندارد و محترمانه است.",
    "Alex said they would arrive.",
    "نام و ضمیر را مطابق ترجیح فرد به‌کار ببر."
  ],
  [
    "reporting-verb-relative-generic-he",
    "generic he در نوشتار معاصر کمتر ترجیح داده می‌شود؛ singular they یا بازنویسی خنثی‌تر است.",
    "A student should submit their work.",
    "سبک‌نامه‌های حرفه‌ای عموماً زبان فراگیر را ترجیح می‌دهند."
  ],
  [
    "reporting-verb-relative-generic-you",
    "generic you در گفتار رایج برای تجربهٔ عمومی است؛ one رسمی‌تر است.",
    "You never know what will happen.",
    "در متن رسمی ممکن است مخاطب را به‌اشتباه مشخص کند."
  ],
  [
    "reporting-verb-relative-one-generic",
    "one برای تعمیم رسمی و فاصله‌دار است.",
    "One must consider the evidence.",
    "تکرار one's می‌تواند متن را سنگین کند."
  ],
  [
    "reporting-verb-relative-somebody-agreement",
    "somebody/someone/everybody/anyone/no one از نظر فعل مفردند.",
    "Someone has called.",
    "ضمیر ارجاعی singular they پذیرفته است."
  ],
  [
    "reporting-verb-relative-nobody-agreement",
    "nobody/no one فعل مفرد می‌گیرند و با فعل منفی مضاعف همراه نمی‌شوند در معیار رسمی.",
    "Nobody knows.",
    "Nobody doesn't know در معنی یک نفی معیار پرهیز شود."
  ],
  [
    "reporting-verb-relative-everything-agreement",
    "everything/something/anything/nothing فعل مفرد می‌گیرند.",
    "Everything is ready.",
    "ارجاع ضمیری می‌تواند it باشد."
  ],
  [
    "reporting-verb-relative-each-other-subject",
    "each other معمولاً مفعول است، نه فاعل مستقل؛ both/they فاعل می‌شوند.",
    "They help each other.",
    "Each other helps... فقط در تحلیل‌های خاص/نادر."
  ],
  [
    "reporting-verb-relative-one-another-subject",
    "one another معمولاً مفعول متقابل است.",
    "The teams respect one another.",
    "فاعل جمله باید مرجع‌های متقابل را معرفی کند."
  ],
  [
    "reporting-verb-relative-reflexive-after-preposition",
    "ضمیر reflexive پس از حرف اضافه وقتی با فاعل هم‌مرجع است می‌آید.",
    "She kept the information to herself.",
    "by oneself یعنی تنها/بدون کمک."
  ],
  [
    "reporting-verb-relative-by-myself",
    "by myself می‌تواند به معنی تنها یا بدون کمک باشد؛ myself به‌تنهایی تأکید است.",
    "I did it by myself.",
    "معنی را از بافت جدا کن."
  ],
  [
    "reporting-verb-relative-myself-as-subject",
    "myself به‌عنوان فاعل مستقل در انگلیسی معیار معمولاً جای I را نمی‌گیرد.",
    "I sent the email, not my colleague.",
    "در برخی گفتارهای اداری شنیده می‌شود اما برای نثر حرفه‌ای پرهیز کن."
  ],
  [
    "reporting-verb-relative-yourself-singular",
    "yourself مفرد و yourselves جمع است.",
    "Help yourself; help yourselves.",
    "ضمیر بازتابی با مرجع you هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-themself",
    "themself برای singular they در کاربرد معاصر دیده می‌شود؛ themselves نیز رایج و پذیرفته است.",
    "Someone should ask themself/themselves.",
    "سبک‌نامه و ترجیح فرد/ناشر را رعایت کن."
  ],
  [
    "reporting-verb-relative-himself-herself",
    "ضمیرهای بازتابی با فاعل هم‌مرجع و از نظر شمار/جنس دستوری هماهنگ می‌شوند.",
    "He blamed himself; she blamed herself.",
    "برای مرجع غیرشخصی itself به‌کار می‌رود."
  ],
  [
    "reporting-verb-relative-oneself",
    "oneself برای فاعل generic one است.",
    "One must ask oneself why.",
    "در گفتار عمومی yourself رایج‌تر است."
  ],
  [
    "reporting-verb-relative-itself",
    "itself برای مرجع غیرانسانی مفرد و تأکید/بازتابی است.",
    "The system updates itself.",
    "by itself یعنی به‌تنهایی/خودبه‌خود."
  ],
  [
    "reporting-verb-relative-themselves",
    "themselves برای جمع و singular they نیز پذیرفته است.",
    "They introduced themselves.",
    "با خودکاربردی تأکیدی و بازتابی تفاوت دارد."
  ],
  [
    "reporting-verb-relative-each-himself",
    "each + reflexive می‌تواند توزیع فردی را بیان کند.",
    "They each introduced themselves.",
    "فاعل جمع و each توزیع‌کننده است."
  ],
  [
    "reporting-verb-relative-all-themselves",
    "all + reflexive برای تأکید بر تمام اعضا است.",
    "They all did it themselves.",
    "جایگاه all و reflexive بر تأکید اثر دارد."
  ],
  [
    "reporting-verb-relative-possessive-pronoun",
    "mine/yours/his/hers/ours/theirs بدون اسم head می‌آیند؛ my/your و غیره تعیین‌گرند.",
    "This book is mine. / my book.",
    "its به‌عنوان ضمیر ملکی مستقل بسیار نادر است؛ of its own ممکن است."
  ],
  [
    "reporting-verb-relative-double-possessive",
    "of + possessive pronoun برای یکی از موارد متعلق به فرد/گروه است.",
    "a colleague of mine; a decision of hers",
    "ساختار می‌تواند معنی انتخاب/رابطهٔ شخصی داشته باشد."
  ],
  [
    "reporting-verb-relative-possessive-its",
    "its ملکی بدون apostrophe؛ it's مخفف it is/it has.",
    "The company changed its policy. / It's changing.",
    "دام املایی رایج."
  ],
  [
    "reporting-verb-relative-whose-who's",
    "whose ملکی و who's مخفف who is/who has است.",
    "Whose report is this? / Who's responsible?",
    "نقش دستوری و بازکردن contraction را بررسی کن."
  ],
  [
    "reporting-verb-relative-their-there-they're",
    "their ملکی، there مکان/وجودی، they're مخفف they are.",
    "Their office is there; they're waiting.",
    "هم‌آوایی املایی را با دستور تفکیک کن."
  ],
  [
    "reporting-verb-relative-your-you're",
    "your ملکی و you're مخفف you are است.",
    "Your report is ready; you're welcome.",
    "با گسترش contraction خطا را تشخیص بده."
  ],
  [
    "reporting-verb-relative-then-than",
    "then زمانی/نتیجه و than برای مقایسه است.",
    "Then we left; taller than me.",
    "نقش دستوری و معنی را جدا کن."
  ],
  [
    "reporting-verb-relative-loose-lose",
    "loose صفت به معنی شل/آزاد و lose فعل از دست دادن است.",
    "a loose screw; don't lose it",
    "صورت‌های صرفی lose: lost/lost."
  ],
  [
    "reporting-verb-relative-breath-breathe",
    "breath اسم و breathe فعل است.",
    "take a breath; breathe deeply",
    "تلفظ نیز تفاوت دارد."
  ],
  [
    "reporting-verb-relative-licence-license",
    "licence اسم و license فعل در BrE؛ AmE هر دو license.",
    "a licence; to license",
    "نقش دستوری را تشخیص بده."
  ],
  [
    "reporting-verb-relative-desert-dessert",
    "desert بیابان/ترک کردن و dessert دسر است.",
    "cross the desert; eat dessert",
    "تلفظ اسم desert با فعل desert تفاوت تکیه دارد."
  ],
  [
    "reporting-verb-relative-ensure-insure",
    "ensure تضمین، insure بیمه.",
    "ensure quality; insure a car",
    "assure شخص را مطمئن می‌کند."
  ],
  [
    "reporting-verb-relative-complement-compliment",
    "complement چیزی را کامل می‌کند؛ compliment تحسین است.",
    "The colours complement each other.",
    "هر دو اسم/فعل‌اند اما معنی متفاوت."
  ],
  [
    "reporting-verb-relative-emigrate-immigrate",
    "emigrate از کشور خارج شدن؛ immigrate به کشور وارد شدن.",
    "emigrate from Iran; immigrate to Germany",
    "migrate عمومی‌تر است."
  ],
  [
    "reporting-verb-relative-ensure-assure",
    "ensure نتیجه را تضمین؛ assure شخص را مطمئن؛ insure بیمه.",
    "ensure safety; assure clients; insure property",
    "این سه فعل را با مکملشان یاد بگیر."
  ],
  [
    "reporting-verb-relative-imply-infer",
    "imply گوینده/شاهد القا می‌کند؛ infer خواننده/شنونده استنتاج می‌کند.",
    "The data imply a decline; we infer a trend.",
    "جهت ارتباط را معکوس نکن."
  ],
  [
    "reporting-verb-relative-accept-except",
    "accept پذیرفتن؛ except به‌جز.",
    "accept an offer; everyone except John",
    "نقش دستوری و معنی متفاوت است."
  ],
  [
    "reporting-verb-relative-adapt-adopt",
    "adapt سازگار/تغییر دادن؛ adopt پذیرفتن/اتخاذ کردن.",
    "adapt to change; adopt a policy",
    "حرف اضافهٔ adapt to را یاد بگیر."
  ],
  [
    "reporting-verb-relative-see-watch-look",
    "see ادراک؛ watch مشاهدهٔ ممتد؛ look توجه جهت‌دار.",
    "see a result; watch a game; look at a chart",
    "افعال چندمعنا هستند."
  ],
  [
    "reporting-verb-relative-do-make",
    "do فعالیت/وظیفه؛ make ایجاد/تولید.",
    "do homework; make a decision",
    "collocationهای تثبیت‌شده را جدا حفظ کن."
  ],
  [
    "reporting-verb-relative-work-job",
    "work mass noun برای کار/فعالیت؛ job count noun برای شغل/وظیفه.",
    "I have work; I have a job.",
    "works می‌تواند آثار یا کارخانه باشد."
  ],
  [
    "reporting-verb-relative-travel-trip-journey",
    "travel فعالیت/سفر کلی mass؛ trip/journey سفر مشخص count.",
    "Travel broadens the mind; a business trip",
    "journey بر مسیر/مدت سفر تأکید دارد."
  ],
  [
    "reporting-verb-relative-house-home",
    "house ساختمان و home محل تعلق/زندگی است.",
    "go home; stay at the house",
    "home قید مقصد بدون to می‌آید."
  ],
  [
    "reporting-verb-relative-say-speak-language",
    "speak + language و say + utterance.",
    "She speaks English; she said hello.",
    "speak in English و say in English ساختارهای متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-enter-attend-reach",
    "enter/attend/reach مفعول مستقیم می‌گیرند و معمولاً حرف اضافهٔ to/in لازم ندارند.",
    "enter the room; attend a meeting; reach the station",
    "arrive in/at و get to متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-discuss-describe",
    "discuss/describe مفعول مستقیم می‌گیرند، نه about.",
    "discuss the issue; describe the process",
    "talk about the issue ساختار جایگزین است."
  ],
  [
    "reporting-verb-relative-explain-say",
    "explain something to someone؛ say something to someone؛ tell someone something.",
    "explain the rule to me; tell me the rule",
    "explain me the rule نادرست است."
  ],
  [
    "reporting-verb-relative-suggest-recommend",
    "suggest/recommend + gerund/that-clause؛ advise someone to do.",
    "suggest leaving; recommend that he leave",
    "suggest me to leave در معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-relative-arrive-reach",
    "arrive at/in، reach + object، get to + destination.",
    "arrive in Paris; reach Paris; get to Paris",
    "reach to در معنی رسیدن به مقصد نادرست است."
  ],
  [
    "reporting-verb-relative-married",
    "marry someone و be married to someone.",
    "She married him; she is married to him.",
    "get married to someone."
  ],
  [
    "reporting-verb-relative-similar",
    "similar to و the same as.",
    "similar to the model; the same as before",
    "similar with در معیار عمومی پرهیز شود."
  ],
  [
    "reporting-verb-relative-different",
    "different from معیار؛ different to BrE؛ different than AmE/مقایسه‌ای.",
    "different from the original",
    "سبک‌نامه و گونه را حفظ کن."
  ],
  [
    "reporting-verb-relative-superior",
    "superior/inferior/senior/junior/prior/subsequent + to.",
    "superior to the old model",
    "than به‌جای to در این صفات نادرست است."
  ],
  [
    "reporting-verb-relative-prefer",
    "prefer A to B؛ prefer to do؛ would rather do.",
    "prefer tea to coffee",
    "to در prefer A to B حرف اضافه است."
  ],
  [
    "reporting-verb-relative-object",
    "object to + noun/gerund؛ object that + clause.",
    "object to paying",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-look-forward",
    "look forward to + noun/gerund.",
    "look forward to meeting you",
    "to مصدرساز نیست."
  ],
  [
    "reporting-verb-relative-be-used",
    "be used to + noun/gerund؛ used to + bare infinitive.",
    "be used to working; used to work",
    "دو ساختار را از نظر معنی تفکیک کن."
  ],
  [
    "reporting-verb-relative-get-used",
    "get used to + noun/gerund برای عادت کردن.",
    "get used to driving",
    "پس از to gerund می‌آید."
  ],
  [
    "reporting-verb-relative-accustomed",
    "accustomed to + noun/gerund.",
    "accustomed to change; accustomed to working",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-committed",
    "committed to + noun/gerund.",
    "committed to improving",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-dedicated",
    "dedicated to + noun/gerund.",
    "dedicated to helping clients",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-opposed",
    "opposed to + noun/gerund.",
    "opposed to raising rates",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-prone",
    "prone to + noun/gerund.",
    "prone to errors; prone to failing",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-capable",
    "capable of + noun/gerund.",
    "capable of solving problems",
    "of حرف اضافه است."
  ],
  [
    "reporting-verb-relative-good-at",
    "good at + noun/gerund.",
    "good at explaining",
    "at حرف اضافه است."
  ],
  [
    "reporting-verb-relative-interested",
    "interested in + noun/gerund.",
    "interested in learning",
    "in حرف اضافه است."
  ],
  [
    "reporting-verb-relative-responsible",
    "responsible for + noun/gerund; responsible to + authority.",
    "responsible for reporting to the board",
    "for and to roles differ."
  ],
  [
    "reporting-verb-relative-worried",
    "worried about + noun/gerund; worried that + clause.",
    "worried about losing money",
    "about حرف اضافه است."
  ],
  [
    "reporting-verb-relative-afraid",
    "afraid of + noun/gerund; afraid to do.",
    "afraid of failing; afraid to ask",
    "معنی و کانون متفاوت."
  ],
  [
    "reporting-verb-relative-tired",
    "tired of + noun/gerund برای خستگی/دلزدگی؛ tired from برای علت فیزیکی.",
    "tired of waiting; tired from work",
    "حرف اضافه معنی را تغییر می‌دهد."
  ],
  [
    "reporting-verb-relative-succeed",
    "succeed in + gerund؛ succeed to + position.",
    "succeed in negotiating; succeed to the throne",
    "in/to را تفکیک کن."
  ],
  [
    "reporting-verb-relative-insist",
    "insist on + gerund؛ insist that + clause.",
    "insist on paying; insist that he pay",
    "معنی ادعا/مطالبه متفاوت."
  ],
  [
    "reporting-verb-relative-apologize",
    "apologize to someone for something/doing.",
    "apologize to the client for the delay",
    "ترتیب شخص/علت."
  ],
  [
    "reporting-verb-relative-thank",
    "thank someone for something/doing.",
    "thank them for helping",
    "for + gerund."
  ],
  [
    "reporting-verb-relative-congratulate",
    "congratulate someone on something/doing.",
    "congratulate her on winning",
    "on + gerund."
  ],
  [
    "reporting-verb-relative-accuse",
    "accuse someone of something/doing.",
    "accuse him of fraud",
    "of + gerund."
  ],
  [
    "reporting-verb-relative-prevent",
    "prevent someone from doing.",
    "prevent them from leaving",
    "from + gerund."
  ],
  [
    "reporting-verb-relative-stop",
    "stop doing vs stop to do.",
    "stop smoking; stop to smoke",
    "تفاوت معنی."
  ],
  [
    "reporting-verb-relative-remember",
    "remember doing vs remember to do.",
    "remember locking; remember to lock",
    "گذشته در برابر وظیفه."
  ],
  [
    "reporting-verb-relative-regret",
    "regret doing vs regret to inform.",
    "regret saying; regret to announce",
    "پشیمانی در برابر اعلام رسمی."
  ],
  [
    "reporting-verb-relative-try",
    "try doing vs try to do.",
    "try restarting; try to restart",
    "آزمایش روش در برابر تلاش."
  ],
  [
    "reporting-verb-relative-mean",
    "mean doing vs mean to do.",
    "mean paying; mean to pay",
    "مستلزم بودن در برابر قصد."
  ],
  [
    "reporting-verb-relative-go-on",
    "go on doing vs go on to do.",
    "go on talking; go on to explain",
    "ادامه در برابر مرحلهٔ بعد."
  ],
  [
    "reporting-verb-relative-need",
    "need doing vs need to do.",
    "needs repairing; needs to repair it",
    "مجهول‌معنا در برابر فاعل انجام‌دهنده."
  ],
  [
    "reporting-verb-relative-want",
    "want doing در BrE می‌تواند مجهول‌معنا باشد؛ want to do خواستن.",
    "The car wants washing.",
    "منطقه‌ای/غیررسمی."
  ],
  [
    "reporting-verb-relative-deserve",
    "deserve doing می‌تواند مجهول‌معنا داشته باشد؛ deserve to do فاعل عمل را دارد.",
    "The issue deserves discussing.",
    "deserve to be discussed روشن‌تر."
  ],
  [
    "reporting-verb-relative-worth",
    "worth + gerund؛ worthy of + gerund/noun.",
    "worth reading; worthy of consideration",
    "worth to read نادرست در این معنی."
  ],
  [
    "reporting-verb-relative-cannot-help",
    "cannot help + gerund؛ cannot help but + bare infinitive.",
    "can't help laughing; can't help but laugh",
    "cannot help to laugh نادرست."
  ],
  [
    "reporting-verb-relative-feel-like",
    "feel like + gerund/noun.",
    "feel like going out",
    "to-infinitive نمی‌گیرد."
  ],
  [
    "reporting-verb-relative-busy",
    "busy + gerund/with noun.",
    "busy writing; busy with work",
    "busy to write نامأنوس."
  ],
  [
    "reporting-verb-relative-have-trouble",
    "have trouble/difficulty + gerund.",
    "have trouble sleeping",
    "in + gerund نیز ممکن است."
  ],
  [
    "reporting-verb-relative-spend-time",
    "spend time + gerund/on noun.",
    "spend time studying",
    "spend time to study در این معنی معمولاً نادرست."
  ],
  [
    "reporting-verb-relative-waste-time",
    "waste time + gerund/on noun.",
    "waste time arguing",
    "to-infinitive نادرست در این الگو."
  ],
  [
    "reporting-verb-relative-go-swimming",
    "go + gerund برای فعالیت‌های خاص.",
    "go swimming/shopping",
    "collocation واژگانی."
  ],
  [
    "reporting-verb-relative-doing-activity",
    "do + activity/subject؛ go + activity در برخی ورزش/تفریح‌ها.",
    "do yoga; go skiing",
    "انتخاب فعل به collocation وابسته است."
  ],
  [
    "reporting-verb-relative-make-progress",
    "make progress/decision/effort؛ do research/homework.",
    "make progress; do research",
    "collocations را حفظ کن."
  ],
  [
    "reporting-verb-relative-have-take",
    "have a meeting/break; take a decision (BrE) / make a decision.",
    "take a break; make a decision",
    "BrE/AmE تفاوت واژگانی."
  ],
  [
    "reporting-verb-relative-pay-attention",
    "pay attention to + noun/gerund.",
    "pay attention to spelling",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-take-part",
    "take part in + noun/gerund.",
    "take part in discussions",
    "in حرف اضافه است."
  ],
  [
    "reporting-verb-relative-take-place",
    "take place برای رخ دادن؛ لازم و بدون مفعول.",
    "The meeting took place yesterday.",
    "take place ≠ take someone's place."
  ],
  [
    "reporting-verb-relative-take-effect",
    "take effect برای لازم‌الاجرا/اثرگذار شدن.",
    "The rule takes effect tomorrow.",
    "effect اسم است."
  ],
  [
    "reporting-verb-relative-come-into-effect",
    "come into effect برای به اجرا درآمدن.",
    "The law came into effect.",
    "ساختار ثابت."
  ],
  [
    "reporting-verb-relative-bring-into-force",
    "bring into force برای لازم‌الاجرا کردن.",
    "The act was brought into force.",
    "register حقوقی/رسمی."
  ],
  [
    "reporting-verb-relative-enter-force",
    "enter into force برای لازم‌الاجرا شدن.",
    "The treaty entered into force.",
    "enter + noun مستقیم در برخی کاربردها."
  ],
  [
    "reporting-verb-relative-be-in-force",
    "be in force برای معتبر/لازم‌الاجرا بودن.",
    "The regulation is in force.",
    "in force عبارت حرف اضافه‌ای است."
  ],
  [
    "reporting-verb-relative-come-to-power",
    "come to power برای به قدرت رسیدن.",
    "The party came to power.",
    "come into power نیز ممکن است."
  ],
  [
    "reporting-verb-relative-take-power",
    "take power برای به دست گرفتن قدرت.",
    "The military took power.",
    "take over power کمتر طبیعی است."
  ],
  [
    "reporting-verb-relative-hold-office",
    "hold office برای تصدی سمت.",
    "She held office for ten years.",
    "in office یعنی در سمت بودن."
  ],
  [
    "reporting-verb-relative-step-into-role",
    "step into a role/position برای پذیرفتن نقش.",
    "He stepped into the role of CEO.",
    "step down از سمت کناره‌گیری."
  ],
  [
    "reporting-verb-relative-resign-from",
    "resign from a position/organization.",
    "She resigned from the board.",
    "resign as CEO نیز ممکن است."
  ],
  [
    "reporting-verb-relative-retire-from",
    "retire from a job/position.",
    "He retired from public service.",
    "retire at age 65 و retire as CEO."
  ],
  [
    "reporting-verb-relative-succeed-succession",
    "succeed someone as + role برای جانشین شدن.",
    "She succeeded him as chair.",
    "succeed in doing معنی موفق شدن است."
  ],
  [
    "reporting-verb-relative-replace-with",
    "replace A with B برای جایگزینی.",
    "The firm replaced cash with digital payments.",
    "replace A by B نیز در برخی گونه‌ها ممکن است."
  ],
  [
    "reporting-verb-relative-substitute-for",
    "substitute A for B و substitute B with A تفاوت جهت دارند.",
    "They substituted tea for coffee.",
    "جهت جایگزینی را دقیق بررسی کن."
  ],
  [
    "reporting-verb-relative-exchange-for",
    "exchange A for B و exchange with someone.",
    "They exchanged dollars for euros.",
    "exchange A with B نیز ممکن است."
  ],
  [
    "reporting-verb-relative-swap-with",
    "swap A for B / swap with someone.",
    "They swapped seats.",
    "ساختار و جهت مبادله را روشن کن."
  ],
  [
    "reporting-verb-relative-protect-against",
    "protect against + noun/gerund برای پیشگیری.",
    "The policy protects against fraud.",
    "protect someone from danger نیز ممکن است."
  ],
  [
    "reporting-verb-relative-defend-against",
    "defend against + attack/claim.",
    "The company defended itself against allegations.",
    "defend someone from/against."
  ],
  [
    "reporting-verb-relative-insulate-from",
    "insulate from + noun/gerund برای مصون کردن.",
    "The economy is insulated from shocks.",
    "from حرف اضافه است."
  ],
  [
    "reporting-verb-relative-shield-from",
    "shield someone/something from + noun.",
    "The fund shields investors from losses.",
    "shield against نیز ممکن است."
  ],
  [
    "reporting-verb-relative-exempt-from",
    "exempt someone from + noun/gerund.",
    "The law exempts small firms from reporting.",
    "be exempt from."
  ],
  [
    "reporting-verb-relative-exclude-from",
    "exclude someone from + noun/gerund.",
    "The policy excludes minors from access.",
    "exclude from."
  ],
  [
    "reporting-verb-relative-include-in",
    "include someone/something in + group/list.",
    "The report includes gold in the index.",
    "include among نیز ممکن است."
  ],
  [
    "reporting-verb-relative-involve-in",
    "involve someone in + noun/gerund.",
    "They involved staff in planning.",
    "involve doing یعنی مستلزم بودن."
  ],
  [
    "reporting-verb-relative-engage-in",
    "engage in + activity/gerund.",
    "The firm engaged in risky trading.",
    "engage someone in conversation ساختار دیگری است."
  ],
  [
    "reporting-verb-relative-participate-in",
    "participate in + noun/gerund.",
    "They participated in the survey.",
    "participate at کمتر رایج."
  ],
  [
    "reporting-verb-relative-concentrate-on",
    "concentrate on + noun/gerund.",
    "Focus on improving accuracy.",
    "on حرف اضافه است."
  ],
  [
    "reporting-verb-relative-focus-on",
    "focus on + noun/gerund.",
    "The analysis focuses on inflation.",
    "focus something on نیز ممکن است."
  ],
  [
    "reporting-verb-relative-depend-upon",
    "depend on/upon + noun/clause.",
    "It depends on whether rates rise.",
    "upon رسمی‌تر."
  ],
  [
    "reporting-verb-relative-rely-upon",
    "rely on/upon + noun/gerund.",
    "The system relies on external data.",
    "upon رسمی‌تر."
  ],
  [
    "reporting-verb-relative-insist-upon",
    "insist on/upon + noun/gerund.",
    "They insisted upon a review.",
    "upon رسمی‌تر."
  ],
  [
    "reporting-verb-relative-object-to",
    "object to + noun/gerund.",
    "They objected to paying.",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-appeal-to",
    "appeal to someone / appeal against a decision / appeal for help.",
    "They appealed to the court.",
    "معنی و حرف اضافه را تفکیک کن."
  ],
  [
    "reporting-verb-relative-apply-to",
    "apply to a school/person/rule; apply for a job/grant.",
    "Apply to the university for funding.",
    "دو حرف اضافه دو رابطهٔ مختلف‌اند."
  ],
  [
    "reporting-verb-relative-agree-with",
    "agree with person/opinion.",
    "I agree with you.",
    "agree to proposal و agree on issue متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-agree-on",
    "agree on a plan/topic.",
    "They agreed on the date.",
    "agree about نیز ممکن است."
  ],
  [
    "reporting-verb-relative-agree-to",
    "agree to a proposal/terms or to do something.",
    "They agreed to the terms.",
    "agree with شخص/نظر."
  ],
  [
    "reporting-verb-relative-argue-about",
    "argue about a topic; argue with a person; argue for/against a position.",
    "They argued about costs.",
    "argue that + clause نیز ممکن است."
  ],
  [
    "reporting-verb-relative-debate-over",
    "debate + topic مستقیم یا debate over/about + topic.",
    "They debated the proposal.",
    "debate on نیز در کاربردهای رسمی/موضوعی ممکن است."
  ],
  [
    "reporting-verb-relative-discuss-no-prep",
    "discuss + noun مستقیم.",
    "discuss the issue",
    "discuss about نادرست در معیار عمومی."
  ],
  [
    "reporting-verb-relative-mention-no-prep",
    "mention + noun/that-clause مستقیم.",
    "mention the problem",
    "mention about نادرست در معیار عمومی."
  ],
  [
    "reporting-verb-relative-enter-no-prep",
    "enter + place مستقیم؛ enter into agreement.",
    "enter the room; enter into a contract",
    "معنی literal و انتزاعی متفاوت."
  ],
  [
    "reporting-verb-relative-approach-no-prep",
    "approach + person/problem مستقیم.",
    "approach the manager",
    "approach to + noun اسم است."
  ],
  [
    "reporting-verb-relative-attend-no-prep",
    "attend + event/school مستقیم.",
    "attend a lecture",
    "attend to means care for."
  ],
  [
    "reporting-verb-relative-reach-no-prep",
    "reach + destination مستقیم.",
    "reach the station",
    "get to/arrive at متفاوت."
  ],
  [
    "reporting-verb-relative-lack-no-prep",
    "lack + noun مستقیم؛ be lacking in + noun.",
    "The report lacks detail.",
    "lack of + noun ساختار اسمی است."
  ],
  [
    "reporting-verb-relative-approach-as",
    "approach someone about a topic یا approach a problem in a way.",
    "approach the issue carefully",
    "approach to the issue اسم است."
  ],
  [
    "reporting-verb-relative-marry-no-prep",
    "marry someone؛ be married to someone.",
    "She married an economist.",
    "marry with در معیار عمومی نادرست است."
  ],
  [
    "reporting-verb-relative-resemble-no-prep",
    "resemble + noun مستقیم و بدون like.",
    "The pattern resembles last year's.",
    "be similar to ساختار جایگزین است."
  ],
  [
    "reporting-verb-relative-lack-of",
    "lack of + noun و lack + noun فعل مستقیم.",
    "a lack of evidence; lack evidence",
    "lack of پشت head noun می‌آید."
  ],
  [
    "reporting-verb-relative-emphasize-that",
    "emphasize + that-clause یا noun.",
    "They emphasized that accuracy matters.",
    "emphasize on در معیار عمومی نادرست."
  ],
  [
    "reporting-verb-relative-explain-why",
    "explain + wh-clause یا explain something to someone.",
    "Explain why it failed.",
    "explain me why نادرست؛ explain to me why."
  ],
  [
    "reporting-verb-relative-suggest-that-meaning",
    "suggest that + subjunctive برای پیشنهاد؛ indicative برای evidence/implication.",
    "I suggest that he leave. / The data suggest that he left.",
    "معنی واژه را تعیین کن."
  ],
  [
    "reporting-verb-relative-insist-that-meaning",
    "insist that + subjunctive برای مطالبه و indicative برای اصرار بر واقعیت.",
    "He insisted that she stay. / insisted that she was honest.",
    "دو معنی را از بافت تفکیک کن."
  ],
  [
    "reporting-verb-relative-hope-wish",
    "hope برای احتمال مطلوب واقعی؛ wish برای خلاف واقع/نارضایتی.",
    "I hope it works. / I wish it worked.",
    "زمان و وجه تفاوت را می‌سازند."
  ],
  [
    "reporting-verb-relative-expect-wait",
    "expect انتظار ذهنی؛ wait منتظر ماندن؛ await فعل رسمی و متعدی.",
    "We expect a reply. / await a reply.",
    "wait for a reply، نه wait a reply."
  ],
  [
    "reporting-verb-relative-await",
    "await + noun مستقیم و رسمی؛ await for نادرست است.",
    "The decision is awaited.",
    "await someone/something."
  ],
  [
    "reporting-verb-relative-lack-need",
    "need + noun/to-infinitive/gerund passive-like.",
    "The system needs updating.",
    "need for + noun ساختار اسمی است."
  ],
  [
    "reporting-verb-relative-require-need",
    "require + noun/gerund/to-infinitive/object + to-infinitive.",
    "The system requires maintenance.",
    "require doing می‌تواند مجهول‌معنا باشد."
  ],
  [
    "reporting-verb-relative-deserve-need",
    "deserve + noun/to-infinitive/gerund passive-like.",
    "The proposal deserves attention.",
    "deserve to be considered نیز روشن‌تر."
  ],
  [
    "reporting-verb-relative-worthwhile",
    "worthwhile + gerund/to-infinitive در it is worthwhile.",
    "It is worthwhile reviewing the evidence.",
    "worth + gerund و worthy of ساختارهای متفاوت."
  ],
  [
    "reporting-verb-relative-necessary-essential",
    "necessary/essential + that-clause mandative subjunctive.",
    "It is necessary that the data be checked.",
    "should + base در BrE رایج است."
  ],
  [
    "reporting-verb-relative-important",
    "important + for someone + to-infinitive یا that-clause.",
    "It is important for users to understand.",
    "important that he understand در subjunctive."
  ],
  [
    "reporting-verb-relative-advisable",
    "advisable + to-infinitive/that-clause.",
    "It is advisable to wait.",
    "advisable that he wait رسمی است."
  ],
  [
    "reporting-verb-relative-likely",
    "likely + to-infinitive/that-clause; unlikely.",
    "They are likely to win.",
    "It is likely that..."
  ],
  [
    "reporting-verb-relative-sure",
    "sure + that/of/to; be sure to do.",
    "I'm sure that he knows. / Be sure to call.",
    "معنی اطمینان در برابر دستور را تشخیص بده."
  ],
  [
    "reporting-verb-relative-bound",
    "bound to + infinitive for certainty/obligation.",
    "The plan is bound to fail.",
    "bound for + destination."
  ],
  [
    "reporting-verb-relative-due",
    "due to + noun cause; be due to + infinitive scheduled.",
    "The delay was due to snow. / due to arrive.",
    "نقش due را بررسی کن."
  ],
  [
    "reporting-verb-relative-about-to",
    "be about to + bare infinitive برای آیندهٔ بسیار نزدیک.",
    "The show is about to start.",
    "about to + noun ساختار متفاوت."
  ],
  [
    "reporting-verb-relative-going-to",
    "be going to + infinitive برای قصد/پیش‌بینی شواهدی.",
    "It is going to rain.",
    "going to مقصد literal نیز می‌تواند باشد."
  ],
  [
    "reporting-verb-relative-will-going",
    "will برای تصمیم لحظه‌ای/پیش‌بینی/اراده و going to برای قصد قبلی/شواهد.",
    "I'll answer. / I'm going to answer.",
    "تمایز مطلق نیست و کاربردها هم‌پوشانی دارند."
  ],
  [
    "reporting-verb-relative-future-continuous",
    "will be + -ing برای عمل در جریان در زمان آینده یا ادب/پرسش غیرمستقیم.",
    "This time tomorrow, I'll be flying.",
    "برای برنامهٔ قطعی present continuous نیز ممکن است."
  ],
  [
    "reporting-verb-relative-future-perfect",
    "will have + V3 برای تکمیل تا موعد آینده.",
    "By June, we will have finished.",
    "by then/by the time نشانهٔ رایج است."
  ],
  [
    "reporting-verb-relative-future-perfect-continuous",
    "will have been + -ing برای مدت روند تا نقطهٔ آینده.",
    "By July, she will have been working here for a year.",
    "بر مدت تأکید دارد، نه فقط تکمیل."
  ],
  [
    "reporting-verb-relative-future-in-past",
    "would/was going to برای آینده از دیدگاه گذشته.",
    "He said he would return.",
    "would عادت/ادب/فرض نیز می‌سازد."
  ],
  [
    "reporting-verb-relative-present-simple-future",
    "حال ساده برای جدول/برنامهٔ رسمی آینده.",
    "The train leaves at nine tomorrow.",
    "برای قرار شخصی present continuous طبیعی‌تر."
  ],
  [
    "reporting-verb-relative-present-continuous-future",
    "حال استمراری برای قرار و توافق آینده.",
    "I'm meeting her tomorrow.",
    "برای برنامهٔ عمومی ثابت simple present."
  ],
  [
    "reporting-verb-relative-present-perfect-future",
    "حال کامل در بندهای زمانی آینده برای عمل تکمیل‌شده پیش از رویداد دیگر.",
    "I'll call you when I have finished.",
    "در بند زمانی از will have finished معمولاً استفاده نمی‌شود."
  ],
  [
    "reporting-verb-relative-future-time-clause",
    "when/as soon as/until/before + present simple برای آیندهٔ زمانی.",
    "When the report arrives, we'll review it.",
    "بند اسمی wh می‌تواند will بگیرد."
  ],
  [
    "reporting-verb-relative-future-condition-clause",
    "if/unless + present simple برای شرط واقعی آینده.",
    "If demand rises, prices may increase.",
    "will برای willingness/insistence استثناست."
  ],
  [
    "reporting-verb-relative-past-habit",
    "used to و would برای عادت گذشته با محدودیت‌های معنایی متفاوت.",
    "We used to live there; every summer we'd travel.",
    "would برای state verbs معمولاً طبیعی نیست."
  ],
  [
    "reporting-verb-relative-past-state",
    "past simple برای حالت تمام‌شده/گذشته و used to برای تقابل با حال.",
    "I knew him at school. / I used to know him.",
    "used to می‌تواند بر پایان یافتن عادت دلالت کند."
  ],
  [
    "reporting-verb-relative-past-progressive",
    "past continuous برای روند/زمینه و past simple برای رویداد کامل/کوتاه.",
    "I was reading when she called.",
    "هر دو عمل می‌توانند هم‌زمان باشند."
  ],
  [
    "reporting-verb-relative-past-perfect",
    "past perfect برای تقدم نسبت به مرجع گذشته؛ نه برای هر رویداد قدیمی‌تر.",
    "She had left before I arrived.",
    "ترتیب زمانی روشن ممکن است past simple را کافی کند."
  ],
  [
    "reporting-verb-relative-past-perfect-continuous",
    "had been + -ing برای روند تا نقطهٔ گذشته و مدت/علت نتیجه.",
    "He was tired because he had been working.",
    "برای نتیجهٔ کامل‌شده past perfect ساده ممکن است."
  ],
  [
    "reporting-verb-relative-present-perfect-simple",
    "present perfect simple برای تجربه/نتیجه/بازهٔ جاری.",
    "I have read the report.",
    "با زمان گذشتهٔ تمام‌شده مثل yesterday معمولاً نمی‌آید."
  ],
  [
    "reporting-verb-relative-present-perfect-continuous",
    "have been + -ing برای مدت/روند جاری تا اکنون.",
    "I have been reading for two hours.",
    "افعال stative معمولاً simple می‌آیند."
  ],
  [
    "reporting-verb-relative-past-simple-vs-present-perfect",
    "past simple زمان گذشتهٔ بسته؛ present perfect پیوند با حال/بازهٔ جاری.",
    "I visited in 2020. / I have visited twice.",
    "قید زمانی و چارچوب گفتمان تعیین‌کننده‌اند."
  ],
  [
    "reporting-verb-relative-for-since",
    "for مدت؛ since نقطهٔ آغاز؛ هر دو با present perfect رایج‌اند.",
    "for five years; since 2021",
    "since + clause می‌تواند علت باشد."
  ],
  [
    "reporting-verb-relative-already-yet",
    "already در جملهٔ مثبت/پرسش؛ yet در پرسش/منفی اغلب انتهای جمله.",
    "Have you finished yet?",
    "already در پرسش می‌تواند شگفتی/انتظار را نشان دهد."
  ],
  [
    "reporting-verb-relative-just",
    "just با present perfect برای رویداد تازه در BrE؛ past simple در AmE نیز رایج.",
    "I've just arrived. / I just arrived.",
    "گونهٔ زبانی تفاوت گرایشی دارد."
  ],
  [
    "reporting-verb-relative-ever-never",
    "ever در پرسش/تجربه؛ never نفی بسامدی با فعل مثبت.",
    "Have you ever been there? / I've never been.",
    "never با not برای یک نفی معیار همراه نمی‌شود."
  ],
  [
    "reporting-verb-relative-still-yet",
    "still ادامهٔ وضعیت و yet عدم تحقق تا اکنون را نشان می‌دهد.",
    "I still haven't heard. / not yet.",
    "جایگاه قید و نگرش فرق دارد."
  ],
  [
    "reporting-verb-relative-recently-lately",
    "recently/lately برای زمان نزدیک گذشته و اغلب present perfect.",
    "We have recently updated the system.",
    "recently با past simple نیز ممکن است."
  ],
  [
    "reporting-verb-relative-so-far",
    "so far/to date/up to now برای بازهٔ جاری و present perfect.",
    "So far, sales have risen.",
    "با بازهٔ پایان‌یافته past simple مناسب‌تر است."
  ],
  [
    "reporting-verb-relative-this-week",
    "this week/month/year با present perfect اگر بازه هنوز باز است و past simple اگر بسته/زمان مشخص باشد.",
    "We've met twice this week.",
    "بازهٔ زمانی و نقطهٔ دید گوینده تعیین‌کننده است."
  ],
  [
    "reporting-verb-relative-today",
    "today می‌تواند با present perfect یا past simple بیاید بر اساس پایان/چارچوب روز و گونه.",
    "I've seen him today. / I saw him this morning.",
    "در برخی گونه‌ها past simple رایج‌تر است."
  ],
  [
    "reporting-verb-relative-yesterday",
    "yesterday با past simple برای زمان بسته می‌آید.",
    "I saw her yesterday.",
    "present perfect + yesterday در انگلیسی معیار معمولاً نادرست است."
  ],
  [
    "reporting-verb-relative-last-year",
    "last year/ago/in 2010 زمان گذشتهٔ مشخص و بسته است و past simple می‌گیرد.",
    "The firm expanded last year.",
    "اگر از نتیجهٔ حال حرف می‌زنی، جمله را بازسازی کن."
  ],
  [
    "reporting-verb-relative-by-now",
    "by now می‌تواند present perfect برای نتیجه تا اکنون یا past perfect با مرجع گذشته بسازد.",
    "They should have arrived by now.",
    "وجهی should have با perfect متفاوت است."
  ],
  [
    "reporting-verb-relative-by-then",
    "by then معمولاً past perfect/future perfect نسبت به مرجع گذشته/آینده می‌گیرد.",
    "By then, the meeting had ended.",
    "زمان مرجع را از متن پیدا کن."
  ],
  [
    "reporting-verb-relative-until-now",
    "until now/up to now اغلب present perfect؛ past simple اگر مرجع گذشته بسته شود.",
    "Until now, no one has objected.",
    "until now می‌تواند contrast با وضعیت جدید بسازد."
  ],
  [
    "reporting-verb-relative-from-then-on",
    "from then on برای ادامه از نقطهٔ گذشته و معمولاً past simple/continuous.",
    "From then on, prices rose steadily.",
    "زمان فعل با روایت هماهنگ شود."
  ],
  [
    "reporting-verb-relative-ever-since",
    "ever since + point/clause برای ادامه از زمان مشخص تا حال.",
    "Ever since we met, we've worked together.",
    "اغلب present perfect در بند اصلی می‌آید."
  ],
  [
    "reporting-verb-relative-since-then",
    "since then برای فاصله تا اکنون یا نقطهٔ مرجع دیگر.",
    "Since then, the company has grown.",
    "past perfect می‌تواند با مرجع گذشته بیاید."
  ],
  [
    "reporting-verb-relative-before-after",
    "before/after بند زمانی و نسبت توالی را مشخص می‌کند؛ perfect برای تأکید بر تکمیل ممکن است.",
    "After she left, we began.",
    "زمان‌ها را بر اساس مرجع انتخاب کن."
  ],
  [
    "reporting-verb-relative-as-soon-as",
    "as soon as بند زمانی آینده با present simple؛ در گذشته با زمان گذشته.",
    "As soon as he arrives, call me.",
    "will در بند زمانی معمولاً نمی‌آید."
  ],
  [
    "reporting-verb-relative-once",
    "once + clause برای پس از تحقق رویداد/زمانی که.",
    "Once you understand, it becomes easier.",
    "once به معنی یک‌بار/زمانی نامشخص نیز هست."
  ],
  [
    "reporting-verb-relative-no-sooner-time",
    "no sooner...than و hardly...when برای رویدادهای نزدیک زمانی‌اند.",
    "No sooner had he arrived than it rained.",
    "وارونگی در ساختار آغازین رسمی."
  ],
  [
    "reporting-verb-relative-scarcely-time",
    "scarcely...when/before برای تقدم/توالی نزدیک است.",
    "Scarcely had we begun when the lights failed.",
    "scarcely رسمی‌تر/کم‌کاربردتر."
  ],
  [
    "reporting-verb-relative-while-past",
    "while + past continuous برای هم‌زمانی روندها؛ past simple برای رویدادهای کامل/تکراری.",
    "While I was reading, she cooked.",
    "while می‌تواند contrast نیز باشد."
  ],
  [
    "reporting-verb-relative-when-past",
    "when + past simple می‌تواند رویداد کوتاه را در روند past continuous قطع کند.",
    "I was sleeping when the phone rang.",
    "وقتی دو رویداد پشت سرهم‌اند، هر دو past simple ممکن است."
  ],
  [
    "reporting-verb-relative-as-past",
    "as برای هم‌زمانی دو روند/تغییر تدریجی است.",
    "As prices rose, demand weakened.",
    "as می‌تواند علت/شیوه/مقایسه نیز باشد."
  ],
  [
    "reporting-verb-relative-whenever-past",
    "whenever برای رویداد تکرارشونده در گذشته/حال است.",
    "Whenever he called, she answered.",
    "زمان فعل با بازهٔ تکرار هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-every-time-past",
    "every time + clause برای هر بار رخداد تکراری است.",
    "Every time it rained, the road flooded.",
    "در آینده بند زمانی حال ساده می‌گیرد."
  ],
  [
    "reporting-verb-relative-as-long-as-time",
    "as long as برای تمام مدت تا زمانی که وضعیت ادامه دارد.",
    "You can stay as long as you need.",
    "شرط کافی نیز معنی دیگر است."
  ],
  [
    "reporting-verb-relative-no-longer",
    "no longer پیش از فعل اصلی و پس از be/auxiliary می‌آید.",
    "The service is no longer available.",
    "not...any longer در انتهای بند می‌آید."
  ],
  [
    "reporting-verb-relative-anymore",
    "anymore معمولاً در منفی و در AmE انتهای جمله؛ any more پیش از اسم برای مقدار.",
    "We don't use it anymore. / any more questions",
    "BrE any more به‌عنوان قید نیز رایج است."
  ],
  [
    "reporting-verb-relative-any-longer",
    "any longer در انتهای منفی برای ادامه‌نداشتن است.",
    "I can't wait any longer.",
    "no longer پیش از فعل اصلی می‌آید."
  ],
  [
    "reporting-verb-relative-still",
    "still پیش از فعل اصلی و پس از be/auxiliary برای ادامهٔ وضعیت.",
    "She still works here. / is still working.",
    "still not و not still دامنهٔ متفاوت دارند."
  ],
  [
    "reporting-verb-relative-yet-final",
    "yet در انتهای پرسش/منفی برای تا اکنون؛ yet در ابتدای جمله به معنی با این حال.",
    "Have you finished yet? / Yet, risks remain.",
    "دو نقش دستوری متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-already-position",
    "already معمولاً بین auxiliary و V3 یا پیش از فعل اصلی می‌آید.",
    "She has already left. / already knows",
    "در انتهای جمله نیز در گفتار ممکن است."
  ],
  [
    "reporting-verb-relative-just-position",
    "just پیش از فعل اصلی/participle و در BrE با present perfect برای تازگی.",
    "I've just seen him.",
    "just می‌تواند فقط/دقیقاً نیز معنی دهد."
  ],
  [
    "reporting-verb-relative-only-position",
    "only را نزدیک عنصر محدودشده قرار بده.",
    "Only three people came. / I only asked.",
    "جایگاه جابه‌جا دامنه را تغییر می‌دهد."
  ],
  [
    "reporting-verb-relative-also-position",
    "also معمولاً پیش از فعل اصلی و پس از be/auxiliary؛ too معمولاً انتهای جمله.",
    "She also agreed. / She agreed too.",
    "as well معمولاً انتهای جمله است."
  ],
  [
    "reporting-verb-relative-either-neither-adverb",
    "either در پایان جملهٔ منفی و neither در ساختار وارونه/هم‌نظری منفی می‌آید.",
    "I don't agree either. / Neither do I.",
    "either...or تعیین‌گر/پیونددهندهٔ دیگری است."
  ],
  [
    "reporting-verb-relative-too-as-well",
    "too/as well برای افزودن مثبت و either برای افزودن منفی است.",
    "I agree too. / I don't agree either.",
    "too می‌تواند قید شدت نیز باشد."
  ],
  [
    "reporting-verb-relative-so",
    "so در پاسخ مثبت با وارونگی auxiliary و در معنی therefore قید پیوندی است.",
    "So do I. / It rained, so we stayed.",
    "نقش و نشانه‌گذاری را مشخص کن."
  ],
  [
    "reporting-verb-relative-such",
    "such + noun phrase و so + adjective/adverb؛ so much/many + noun.",
    "such a problem; so difficult; so much time",
    "such a lot of نیز در کاربردهای خاص می‌آید."
  ],
  [
    "reporting-verb-relative-too-enough",
    "too + adjective + to-infinitive و adjective + enough + to-infinitive.",
    "too late to change; old enough to vote",
    "enough + noun و too much/many ساختارهای دیگرند."
  ],
  [
    "reporting-verb-relative-very-much",
    "very با صفت/قید و much با comparative/participle/فعل خاص می‌آید.",
    "very good; much better; much appreciated",
    "very much می‌تواند شدت احساس/تشکر را بیان کند."
  ],
  [
    "reporting-verb-relative-very-much-so",
    "very much so برای تأیید قوی گزارهٔ پیشین است.",
    "Is it important? — Very much so.",
    "ساختار پاسخ گفتمانی است."
  ],
  [
    "reporting-verb-relative-quite-a",
    "quite a + singular count noun و quite + adjective.",
    "quite a surprise; quite surprising",
    "quite the + noun در برخی گونه‌ها/معنی‌ها تأکیدی است."
  ],
  [
    "reporting-verb-relative-rather-a",
    "rather a/an + adjective + noun در BrE رسمی و a rather + adjective + noun.",
    "rather a difficult task; a rather difficult task",
    "ترتیب در AmE ممکن است متفاوت باشد."
  ],
  [
    "reporting-verb-relative-such-a",
    "such a/an + adjective + singular count noun.",
    "such an unusual case",
    "such + plural/mass noun بدون article."
  ],
  [
    "reporting-verb-relative-what-such",
    "what a/an در تعجب و such a در بیان شدت؛ هر دو گروه اسمی می‌سازند.",
    "What a mess! / such a mess",
    "what + plural/mass noun بدون a."
  ],
  [
    "reporting-verb-relative-very-same",
    "the very same برای تأکید بر دقیقاً همان مورد است.",
    "the very same policy",
    "very در اینجا determiner-like intensifier است."
  ],
  [
    "reporting-verb-relative-same-one",
    "the same one و the same as برای یکسانی مرجع/مقایسه‌اند.",
    "I bought the same one.",
    "same معمولاً the یا possessive/demonstrative می‌گیرد."
  ],
  [
    "reporting-verb-relative-own",
    "own پس از possessive determiner برای مالکیت شخصی/تأکیدی می‌آید.",
    "my own office; on their own",
    "of one's own و one's own + noun ساختارهای متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-on-one's-own",
    "on one's own یعنی تنها/مستقل و با by oneself هم‌معنی نزدیک.",
    "She works on her own.",
    "own در اینجا صفت است."
  ],
  [
    "reporting-verb-relative-of-one's-own",
    "of one's own برای داشتن چیزی متعلق به خود است.",
    "a room of her own",
    "با possessive determiner مستقیم تفاوت معنایی دارد."
  ],
  [
    "reporting-verb-relative-each-and-every-emphasis",
    "each and every برای تأکید بر تمام اعضا و فعل مفرد است.",
    "Each and every detail is important.",
    "در نثر ساده every کافی است."
  ],
  [
    "reporting-verb-relative-whole-entire-all",
    "all + plural/mass noun و whole/entire + singular count noun.",
    "all the reports; the whole report",
    "the whole of + determiner نیز ممکن است."
  ],
  [
    "reporting-verb-relative-both-two",
    "both فقط برای دو مورد؛ all برای سه یا بیشتر/کل مجموعه.",
    "both options; all three options",
    "either/neither نیز برای دو موردند."
  ],
  [
    "reporting-verb-relative-either-one",
    "either یعنی یکی از دو، نه هر دو؛ either of + plural noun.",
    "Either option is acceptable.",
    "در کاربرد غیررسمی برای بیش از دو هم دیده می‌شود."
  ],
  [
    "reporting-verb-relative-neither-one",
    "neither یعنی هیچ‌یک از دو؛ فعل مفرد رسمی.",
    "Neither answer is correct.",
    "neither...nor دو عنصر را هماهنگ می‌کند."
  ],
  [
    "reporting-verb-relative-each-of-two",
    "each می‌تواند دو یا چند عضو را جداگانه بررسی کند؛ every معمولاً سه یا بیشتر/مجموعه کلی.",
    "Each of the two candidates has a score.",
    "این تمایز گرایشی است، نه قانون مطلق."
  ],
  [
    "reporting-verb-relative-every-other-day",
    "every other day یعنی یک روز در میان.",
    "We meet every other week.",
    "every second day نیز در برخی گونه‌ها."
  ],
  [
    "reporting-verb-relative-another",
    "another + singular count noun یا another + number + plural noun.",
    "another idea; another three days",
    "another of + plural group نیز ممکن است."
  ],
  [
    "reporting-verb-relative-other",
    "other + plural/mass noun؛ the other برای مورد مشخص/باقی‌مانده.",
    "other countries; the other option",
    "another به معنی یک مورد دیگر است."
  ],
  [
    "reporting-verb-relative-others",
    "others ضمیر جمع و بدون اسم پس از خود است.",
    "Some agreed; others objected.",
    "the others به مجموعهٔ مشخص اشاره دارد."
  ],
  [
    "reporting-verb-relative-the-others",
    "the others برای اعضای باقی‌ماندهٔ مجموعهٔ مشخص است.",
    "Two left; the others stayed.",
    "others بدون the نامعین‌تر است."
  ],
  [
    "reporting-verb-relative-one-another-determiner",
    "one another ضمیر متقابل؛ each other's possessive determiner.",
    "They respect one another's views.",
    "one another's با apostrophe قبل s."
  ],
  [
    "reporting-verb-relative-some-other",
    "some other + singular/plural noun بر مورد دیگری نامشخص تأکید می‌کند.",
    "some other reason; some other people",
    "some others ضمیر جمع است."
  ],
  [
    "reporting-verb-relative-any-other",
    "any other + singular noun در مقایسهٔ یک مورد با باقی مجموعه.",
    "better than any other option",
    "با any other + plural noun در برخی معنی‌ها ممکن است."
  ],
  [
    "reporting-verb-relative-no-other",
    "no other + singular noun برای نفی وجود مورد مشابه.",
    "No other option is available.",
    "فعل با head مفرد هماهنگ است."
  ],
  [
    "reporting-verb-relative-each-other-possessive",
    "each other's + noun برای مالکیت متقابل.",
    "They checked each other's work.",
    "apostrophe s را فراموش نکن."
  ],
  [
    "reporting-verb-relative-another-vs-other",
    "another با اسم مفرد و other با جمع/mass یا تعیین‌گر دیگر می‌آید.",
    "another day; other days; the other day",
    "the other day می‌تواند به معنی چند روز پیش باشد."
  ],
  [
    "reporting-verb-relative-another-two",
    "another + numeral + plural noun برای تعداد اضافه است.",
    "another two weeks",
    "two more weeks نیز ممکن است."
  ],
  [
    "reporting-verb-relative-more-two",
    "two more + plural noun برای دو مورد اضافه؛ another two برای دو مورد دیگر.",
    "two more days; another two days",
    "تفاوت ظریف در ترتیب و کانون است."
  ],
  [
    "reporting-verb-relative-other-than-except",
    "other than می‌تواند معنی except یا متفاوت از بدهد.",
    "No one other than her came. / something other than money",
    "معنی از بافت تعیین می‌شود."
  ],
  [
    "reporting-verb-relative-rather-other",
    "rather than برای جایگزینی/تقابل است و با other than تفاوت دارد.",
    "We chose quality rather than speed.",
    "other than = به‌جز/غیر از."
  ],
  [
    "reporting-verb-relative-each-other-not-each",
    "each other رابطهٔ متقابل؛ each other person معنی هر فرد دیگر است.",
    "They help each other. / each other person",
    "ساختارها را به‌علت شباهت ظاهری یکی نکن."
  ],
  [
    "reporting-verb-relative-another-one",
    "another one برای یک مورد دیگر و another + noun.",
    "I need another one.",
    "one جایگزین اسم شمارش‌پذیر است."
  ],
  [
    "reporting-verb-relative-the-other-one",
    "the other one برای مورد باقی‌مانده از دو مورد.",
    "One is mine; the other one is yours.",
    "برای چند مورد the others."
  ],
  [
    "reporting-verb-relative-one-ones",
    "one/ones جایگزین اسم count می‌شوند؛ با adjective/determiner می‌آیند.",
    "the red one; the cheaper ones",
    "برای mass noun از one استفاده نکن."
  ],
  [
    "reporting-verb-relative-it-one",
    "it به مرجع مشخص/قبلی و one به نمونه/عضو از نوع اشاره می‌کند.",
    "I lost my pen; I need a new one. / I found it.",
    "این تمایز در ارجاع و انسجام مهم است."
  ],
  [
    "reporting-verb-relative-do-so",
    "do so جایگزین عبارت فعلی/عمل می‌شود و رسمی‌تر است.",
    "They promised to help and did so.",
    "مفعول‌ها و قیدها ممکن است با ellipsis متفاوت باشند."
  ],
  [
    "reporting-verb-relative-do-it",
    "do it به عمل مشخص اشاره می‌کند و do so به گزاره/عمل قبلی رسمی‌تر ارجاع می‌دهد.",
    "If you can do it, do so.",
    "it مرجع مشخص و so ارجاع فعلی است."
  ],
  [
    "reporting-verb-relative-so-do",
    "so + auxiliary + subject برای توافق مثبت است.",
    "She works hard, and so do I.",
    "نوع auxiliary با زمان و فعل اصلی هماهنگ است."
  ],
  [
    "reporting-verb-relative-neither-do",
    "neither/nor + auxiliary + subject برای توافق منفی است.",
    "He didn't call, nor did he write.",
    "neither در آغاز بند وارونگی می‌سازد."
  ],
  [
    "reporting-verb-relative-not-either",
    "not...either در پایان بند منفی برای هم‌نظری/افزودن منفی است.",
    "I don't agree either.",
    "neither do I ساختار وارونه است."
  ],
  [
    "reporting-verb-relative-so-such-pronoun",
    "so می‌تواند جای adjective phrase و such جای noun phrase را بگیرد.",
    "I think so. / I didn't expect such.",
    "معنی و نقش discourse را بررسی کن."
  ],
  [
    "reporting-verb-relative-not-so",
    "not so برای نفی درجه/مقایسه یا پاسخ محتاطانه است.",
    "It's not so difficult.",
    "not that difficult و not very difficult تفاوت ظریف دارند."
  ],
  [
    "reporting-verb-relative-so-that-pronoun",
    "so that به معنی برای اینکه و so...that برای نتیجه؛ so that pronoun usage differs.",
    "I left early so that I could vote.",
    "نقش ساختاری را با نشانه‌های بند تشخیص بده."
  ],
  [
    "reporting-verb-relative-such-as-example",
    "such as برای مثال و such...as برای نوع/مقیاس.",
    "tools such as Python; such problems as these",
    "such as معمولاً بند کامل نمی‌گیرد."
  ],
  [
    "reporting-verb-relative-as-such",
    "as such به معنی به‌عنوان چنین چیزی/بنابراین و ساختار discourse است.",
    "The role is advisory; as such, it has no vote.",
    "معنی را از context تشخیص بده."
  ],
  [
    "reporting-verb-relative-such-that-math",
    "such that در ریاضی/فنی شرط/ویژگی دقیق را معرفی می‌کند.",
    "Choose x such that x > 0.",
    "در نثر عمومی such that ممکن است معنی نتیجه بدهد."
  ],
  [
    "reporting-verb-relative-so-as-to",
    "so as to + infinitive برای هدف رسمی/فشرده است.",
    "The system was redesigned so as to reduce errors.",
    "فاعل ضمنی معمولاً با فاعل جمله هم‌مرجع است."
  ],
  [
    "reporting-verb-relative-in-order-to",
    "in order to + infinitive برای هدف صریح است.",
    "They revised the policy in order to comply.",
    "in order not to برای هدف منفی."
  ],
  [
    "reporting-verb-relative-so-as-not-to",
    "so as not to + infinitive برای هدف منفی است.",
    "He whispered so as not to wake them.",
    "فاعل ضمنی باید درست تفسیر شود."
  ],
  [
    "reporting-verb-relative-in-order-that",
    "in order that + clause برای هدف رسمی و modal می‌آید.",
    "They acted in order that no one should be harmed.",
    "so that رایج‌تر و روان‌تر است."
  ],
  [
    "reporting-verb-relative-for-fear-of",
    "for fear of + noun/gerund برای ترس از پیامد است.",
    "They stayed silent for fear of offending.",
    "for fear that + clause ساختار دیگر."
  ],
  [
    "reporting-verb-relative-with-a-view-to",
    "with a view to + noun/gerund برای هدف رسمی است.",
    "They met with a view to reaching agreement.",
    "to حرف اضافه است، پس gerund می‌آید."
  ],
  [
    "reporting-verb-relative-with-the-aim-of",
    "with the aim of + gerund/noun برای هدف است.",
    "The policy was introduced with the aim of reducing inflation.",
    "of حرف اضافه است."
  ],
  [
    "reporting-verb-relative-in-an-effort-to",
    "in an effort to + infinitive برای تلاش/هدف است.",
    "They cut rates in an effort to stimulate demand.",
    "effort to + infinitive."
  ],
  [
    "reporting-verb-relative-for-the-purpose-of",
    "for the purpose of + gerund/noun رسمی/حقوقی است.",
    "Data are collected for the purpose of analysis.",
    "for the purpose to do نادرست."
  ],
  [
    "reporting-verb-relative-to-this-end",
    "to this end برای معرفی هدف/اقدام مرتبط در نثر رسمی است.",
    "To this end, the team developed a new model.",
    "عبارت گفتمانی است."
  ],
  [
    "reporting-verb-relative-thereby-purpose",
    "thereby نتیجه/وسیلهٔ حاصل از عمل را بیان می‌کند، نه هدف آینده.",
    "The bank cut rates, thereby stimulating demand.",
    "to stimulate هدف است؛ thereby stimulating پیامد."
  ],
  [
    "reporting-verb-relative-so-that-purpose-vs-result",
    "so that با could/would/might اغلب هدف و با واقعیت گزارش‌شده می‌تواند نتیجه باشد.",
    "We left early so that we could vote.",
    "بافت و وجه فعل مهم است."
  ],
  [
    "reporting-verb-relative-in-case-precaution",
    "in case + clause اقدام احتیاطی در برابر احتمال است.",
    "Take cash in case the card fails.",
    "این معنی با if متفاوت است."
  ],
  [
    "reporting-verb-relative-in-case-of-noun",
    "in case of + noun برای دستورالعمل/وضعیت احتمالی است.",
    "In case of fire, use the stairs.",
    "in case it catches fire ساختار بند است."
  ],
  [
    "reporting-verb-relative-if-only-hope",
    "if only + past/past perfect برای آرزو/پشیمانی و if only + would برای شکایت/تغییر.",
    "If only it would stop raining.",
    "would برای وضعیت خارج از کنترل گوینده مناسب‌تر است."
  ],
  [
    "reporting-verb-relative-wish-would",
    "wish + would برای رفتار/وضعیت قابل تغییر یا آزاردهنده است.",
    "I wish he would listen.",
    "برای حالت خود گوینده معمولاً past simple می‌آید."
  ],
  [
    "reporting-verb-relative-wish-could",
    "wish + could برای توانایی/امکان ناموجود است.",
    "I wish I could help.",
    "could have برای امکان گذشته."
  ],
  [
    "reporting-verb-relative-wish-past",
    "wish + past simple برای وضعیت خلاف واقع حال/آینده.",
    "I wish I knew the answer.",
    "were رسمی‌تر از was در subjunctive."
  ],
  [
    "reporting-verb-relative-wish-past-perfect",
    "wish + past perfect برای پشیمانی گذشته.",
    "I wish I had studied harder.",
    "تقدم زمانی به گذشتهٔ مرجع وابسته است."
  ],
  [
    "reporting-verb-relative-if-only-past-perfect",
    "if only + past perfect برای آرزوی تغییر گذشته.",
    "If only we had checked.",
    "بار عاطفی قوی‌تر از wish."
  ],
  [
    "reporting-verb-relative-it-is-time-past",
    "it's time + subject + past simple برای کاری که اکنون باید انجام شود.",
    "It's time we left.",
    "زمان گذشته نشانگر فاصله/توصیه است، نه گذشتهٔ واقعی."
  ],
  [
    "reporting-verb-relative-high-time",
    "it's high time + subject + past simple برای تأکید بر دیرشدن.",
    "It's high time the agency acted.",
    "مصدر to نیز در it's time to leave ممکن است."
  ],
  [
    "reporting-verb-relative-would-rather-past",
    "would rather + subject + past simple برای ترجیح دربارهٔ دیگری در حال/آینده.",
    "I'd rather you didn't tell anyone.",
    "در گذشته از past perfect استفاده کن."
  ],
  [
    "reporting-verb-relative-would-rather-perfect",
    "would rather + subject + past perfect برای ترجیح خلاف واقع دربارهٔ گذشته.",
    "I'd rather you had called.",
    "فعل کمکی و زمان را حفظ کن."
  ],
  [
    "reporting-verb-relative-as-if-past",
    "as if + past برای برداشت خلاف واقع/فاصله‌دار در حال.",
    "He behaves as if he owned the firm.",
    "اگر احتمال واقعی باشد present ممکن است."
  ],
  [
    "reporting-verb-relative-as-if-perfect",
    "as if + past perfect برای برداشت دربارهٔ گذشتهٔ خلاف واقع.",
    "She looked as if she had seen something.",
    "فعل look/seem و زمان مرجع را هماهنگ کن."
  ],
  [
    "reporting-verb-relative-subjunctive-were",
    "were در شرطی و wish برای همهٔ اشخاص ممکن است.",
    "If she were here...",
    "was در گفتار غیررسمی پذیرفته/شنیده می‌شود."
  ],
  [
    "reporting-verb-relative-subjunctive-be",
    "mandative subjunctive از base form حتی برای سوم‌شخص مفرد استفاده می‌کند.",
    "They insisted that he be present.",
    "در BrE should + base نیز رایج است."
  ],
  [
    "reporting-verb-relative-subjunctive-have",
    "subjunctive شکل پایهٔ have را نگه می‌دارد، نه has.",
    "It is vital that she have access.",
    "این ساختار رسمی است."
  ],
  [
    "reporting-verb-relative-subjunctive-do",
    "subjunctive do/does به base form do تبدیل می‌شود.",
    "They requested that he do it.",
    "در نثر رسمی، do برای همهٔ فاعل‌ها یکسان است."
  ],
  [
    "reporting-verb-relative-subjunctive-negative",
    "منفی subjunctive با not + base verb و بدون do-support ساخته می‌شود.",
    "They demanded that he not leave.",
    "not + should نیز در برخی گونه‌ها ممکن است."
  ],
  [
    "reporting-verb-relative-subjunctive-passive",
    "mandative subjunctive در مجهول با be + past participle است.",
    "They requested that the report be published.",
    "be در همهٔ اشخاص شکل پایه می‌ماند."
  ],
  [
    "reporting-verb-relative-subjunctive-perfect",
    "subjunctive perfect در برخی ساختارهای رسمی/قدیمی ممکن است اما should have + participle رایج‌تر است.",
    "It is essential that he should have been informed.",
    "کاربرد محدود و register رسمی."
  ],
  [
    "reporting-verb-relative-subjunctive-should",
    "should + base در mandative clauses، به‌ویژه BrE، جایگزین subjunctive است.",
    "They insisted that he should attend.",
    "should در اینجا الزام/توصیه است."
  ],
  [
    "reporting-verb-relative-subjunctive-should-omission",
    "در BrE می‌توان should را در بند mandative به‌کار برد یا حذف کرد و base verb آورد.",
    "They suggested that he (should) leave.",
    "در AmE subjunctive ساده بسیار رایج است."
  ],
  [
    "reporting-verb-relative-subjunctive-verb-list",
    "افعال demand, insist, recommend, suggest, request, propose, require و order می‌توانند mandative clause بگیرند.",
    "They recommended that she apply.",
    "معنی هر فعل و الگوی complement را بررسی کن."
  ],
  [
    "reporting-verb-relative-subjunctive-adjective-list",
    "صفات essential, vital, important, necessary, advisable و desirable می‌توانند mandative clause بگیرند.",
    "It is essential that he be informed.",
    "that-clause باید معنی توصیه/ضرورت داشته باشد."
  ],
  [
    "reporting-verb-relative-subjunctive-noun-list",
    "اسم‌هایی مانند recommendation, demand, request, requirement و proposal می‌توانند mandative clause بگیرند.",
    "Their recommendation that he resign...",
    "نوع اسم و سبک متن تعیین‌کننده است."
  ],
  [
    "reporting-verb-relative-subjunctive-factive",
    "فعل insist/suggest می‌تواند در یک معنی mandative و در معنی دیگر factive/reportive باشد.",
    "She insisted that he leave. / insisted that he was ill.",
    "صورت فعل و معنی را هم‌زمان بررسی کن."
  ],
  [
    "reporting-verb-relative-subjunctive-were-to",
    "were to در شرطی فرضی رسمی است.",
    "If the bank were to fail...",
    "were در همهٔ اشخاص ثابت است."
  ],
  [
    "reporting-verb-relative-subjunctive-had",
    "had + subject inversion در شرطی نوع سوم رسمی است.",
    "Had they known, they would have acted.",
    "if حذف شده و ترتیب وارونه است."
  ],
  [
    "reporting-verb-relative-subjunctive-should-inversion",
    "should + subject + base verb وارونگی شرطی رسمی است.",
    "Should you have questions, contact us.",
    "در صورت if عادی، subject پس از if می‌آید."
  ],
  [
    "reporting-verb-relative-subjunctive-were-inversion",
    "were + subject + to-infinitive وارونگی شرطی رسمی است.",
    "Were the plan to fail, costs would rise.",
    "معادل if the plan were to fail."
  ],
  [
    "reporting-verb-relative-conditional-inversion-mixed",
    "وارونگی شرطی می‌تواند با mixed conditional نیز بیاید.",
    "Had I taken the job, I would be in London now.",
    "زمان نتیجه و شرط را جدا تحلیل کن."
  ],
  [
    "reporting-verb-relative-unreal-past",
    "past simple در شرط/آرزو می‌تواند معنی غیرواقعی حال یا آینده بدهد.",
    "If I knew, I would tell you.",
    "past form الزاماً زمان گذشته نیست."
  ],
  [
    "reporting-verb-relative-unreal-past-perfect",
    "past perfect در شرط/آرزو می‌تواند خلاف واقع گذشته را بیان کند.",
    "If I had known, I would have told you.",
    "در نتیجه mixed conditional امکان دارد."
  ],
  [
    "reporting-verb-relative-unreal-would",
    "would در نتیجهٔ فرضی و درخواست مودبانه می‌آید؛ در if-clause معمولی پرهیز می‌شود.",
    "If I knew, I would help.",
    "استثنای willingness/politeness در if-clause را بشناس."
  ],
  [
    "reporting-verb-relative-conditional-will",
    "will در if-clause می‌تواند اراده/اصرار را نشان دهد، نه آیندهٔ ساده.",
    "If you will insist, I cannot stop you.",
    "برای شرط عادی present simple."
  ],
  [
    "reporting-verb-relative-conditional-should",
    "should در if-clause احتمال کم/رسمی را بیان می‌کند.",
    "If you should see him, tell him.",
    "وارونگی Should you see him نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-happen",
    "if it happens that + clause برای شرط احتمالی/تصادفی است.",
    "If it happens that you are free, call me.",
    "ساختار رسمی/گفتاری."
  ],
  [
    "reporting-verb-relative-conditional-even-if",
    "even if شرط فرضی را می‌پذیرد و نتیجه را مستقل نگه می‌دارد.",
    "Even if it rains, we'll go.",
    "even though برای واقعیت پذیرفته‌شده است."
  ],
  [
    "reporting-verb-relative-conditional-only-if",
    "only if شرط لازم و محدودکننده است و در آغاز جمله وارونگی می‌آورد.",
    "Only if costs fall will we expand.",
    "if only برای آرزو ساختار متفاوتی است."
  ],
  [
    "reporting-verb-relative-conditional-unless",
    "unless = if not در بسیاری از شرط‌های واقعی؛ در برخی بافت‌ها معادل کامل نیست.",
    "Unless you hurry, you'll miss it.",
    "با بند منفی دوباره‌کاری نکن."
  ],
  [
    "reporting-verb-relative-conditional-provided",
    "provided/providing/as long as شرط کافی/قراردادی است.",
    "We can proceed provided costs remain low.",
    "زمان آینده در بند شرطی حال ساده."
  ],
  [
    "reporting-verb-relative-conditional-suppose",
    "suppose/supposing + clause برای فرض و طرح سناریو است.",
    "Suppose the forecast is wrong.",
    "suppose می‌تواند فعل گزارشی نیز باشد."
  ],
  [
    "reporting-verb-relative-conditional-imagine",
    "imagine + past/were برای فرض دور و + present برای احتمال واقعی.",
    "Imagine the bank failed...",
    "بافت سناریو زمان را تعیین می‌کند."
  ],
  [
    "reporting-verb-relative-conditional-in-case",
    "in case برای احتیاط در برابر احتمال، نه شرط مستقیم نتیجه.",
    "Take a charger in case the battery dies.",
    "in case of + noun."
  ],
  [
    "reporting-verb-relative-conditional-as-long-as",
    "as long as برای شرط یا مدت.",
    "You can stay as long as you are quiet.",
    "معنی از بافت مشخص می‌شود."
  ],
  [
    "reporting-verb-relative-conditional-so-long-as",
    "so long as مشابه as long as و گاهی رسمی‌تر است.",
    "The deal stands so long as terms are met.",
    "در شرط آینده present simple."
  ],
  [
    "reporting-verb-relative-conditional-on-condition",
    "on condition that برای شرط صریح/قراردادی.",
    "Access is granted on condition that users comply.",
    "formal register."
  ],
  [
    "reporting-verb-relative-conditional-in-event",
    "in the event that برای شرط رسمی/حقوقی.",
    "In the event that payment fails...",
    "if ساده‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-assuming",
    "assuming (that) برای فرض پایهٔ تحلیل.",
    "Assuming inflation remains stable...",
    "فرض را با واقعیت قطعی اشتباه نکن."
  ],
  [
    "reporting-verb-relative-conditional-given",
    "given that برای پیش‌فرض/زمینه.",
    "Given that rates are high...",
    "given + noun phrase نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-seeing",
    "seeing that برای علت/زمینه در گفتار.",
    "Seeing that you're here, let's begin.",
    "because رسمی‌تر/روشن‌تر."
  ],
  [
    "reporting-verb-relative-conditional-now-that",
    "now that برای واقعیت جدید که وضعیت را تغییر می‌دهد.",
    "Now that the data are ready...",
    "بند کامل می‌گیرد."
  ],
  [
    "reporting-verb-relative-conditional-lest",
    "lest برای هدف منفی رسمی.",
    "They left lest they be seen.",
    "subjunctive/should."
  ],
  [
    "reporting-verb-relative-conditional-for-fear",
    "for fear that + clause یا for fear of + gerund.",
    "for fear that prices might rise",
    "دو ساختار را تفکیک کن."
  ],
  [
    "reporting-verb-relative-conditional-whether",
    "whether or not برای مستقل بودن نتیجه از شرط.",
    "Whether or not he agrees, we proceed.",
    "whether در indirect questions نیز می‌آید."
  ],
  [
    "reporting-verb-relative-conditional-no-matter",
    "no matter + wh-word برای هر حالت/شرط.",
    "No matter how hard it is...",
    "however + adjective + clause نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-however",
    "however + adjective/adverb + clause برای concession.",
    "However carefully you plan...",
    "however می‌تواند قید پیوندی نیز باشد."
  ],
  [
    "reporting-verb-relative-conditional-whatever",
    "whatever + noun/clause برای هر نتیجه/اتفاق.",
    "Whatever happens, call me.",
    "wh-ever بند موصولی آزاد نیز می‌سازد."
  ],
  [
    "reporting-verb-relative-conditional-whoever",
    "whoever برای هر شخصی که.",
    "Whoever wins, the policy remains.",
    "فعل بند تابع مرجع است."
  ],
  [
    "reporting-verb-relative-conditional-whenever",
    "whenever برای هر زمان/هر بار.",
    "Whenever you need help, call.",
    "زمان آینده با present simple."
  ],
  [
    "reporting-verb-relative-conditional-wherever",
    "wherever برای هر مکان.",
    "Wherever you go, stay safe.",
    "بند قیدی آزاد."
  ],
  [
    "reporting-verb-relative-conditional-whichever",
    "whichever برای هر یک از گزینه‌های محدود.",
    "Whichever option you choose...",
    "گزینه‌ها باید از بافت معلوم باشند."
  ],
  [
    "reporting-verb-relative-conditional-whoever-it-may-be",
    "whoever it may be برای هر فردی، با وجه احتمال/بی‌تفاوتی.",
    "Whoever it may be, ask for ID.",
    "register رسمی."
  ],
  [
    "reporting-verb-relative-conditional-whatever-the-cost",
    "whatever the cost/price برای تأکید بر مستقل بودن تصمیم.",
    "Whatever the cost, we must comply.",
    "عبارت تثبیت‌شده."
  ],
  [
    "reporting-verb-relative-conditional-at-all-costs",
    "at all costs عبارت قیدی برای تأکید بر ضرورت است.",
    "Avoid errors at all costs.",
    "هشدار/اغراق؛ با whatever the cost تفاوت سبکی دارد."
  ],
  [
    "reporting-verb-relative-conditional-if-necessary",
    "if necessary/possible/appropriate بند شرطی کوتاه‌شده است.",
    "We will revise it if necessary.",
    "فاعل و فعل از بافت بازیابی می‌شوند."
  ],
  [
    "reporting-verb-relative-conditional-if-any",
    "if any برای بیان احتمال صفر/مقدار اندک است.",
    "Few, if any, firms complied.",
    "عبارت parenthetical و نشانه‌گذاری مهم است."
  ],
  [
    "reporting-verb-relative-conditional-if-not",
    "if not می‌تواند اصلاح/افزودهٔ شرطی بسازد.",
    "The result is good, if not excellent.",
    "با unless اشتباه نشود."
  ],
  [
    "reporting-verb-relative-conditional-or-else",
    "or else برای هشدار/پیامد است.",
    "Hurry up, or else we'll be late.",
    "register گفتاری/تأکیدی."
  ],
  [
    "reporting-verb-relative-conditional-otherwise",
    "otherwise قید برای نتیجهٔ خلاف شرط ضمنی است.",
    "Submit it today; otherwise, it will be rejected.",
    "otherwise می‌تواند به معنی به شکل دیگری نیز باشد."
  ],
  [
    "reporting-verb-relative-conditional-but-for",
    "but for + noun برای شرط خلاف واقع رسمی است.",
    "But for your help, I would have failed.",
    "معادل if it had not been for."
  ],
  [
    "reporting-verb-relative-conditional-if-it-were-not",
    "if it were not for + noun شرط خلاف واقع حال.",
    "If it were not for the subsidy...",
    "were not for رسمی/فرضی است."
  ],
  [
    "reporting-verb-relative-conditional-if-it-had-not",
    "if it had not been for + noun شرط خلاف واقع گذشته.",
    "If it had not been for the loan...",
    "Had it not been for وارونگی رسمی."
  ],
  [
    "reporting-verb-relative-conditional-without",
    "without + noun/gerund می‌تواند شرط ضمنی خلاف واقع بسازد.",
    "Without the data, we couldn't decide.",
    "زمان/وجه نتیجه از بافت مشخص می‌شود."
  ],
  [
    "reporting-verb-relative-conditional-or",
    "or می‌تواند دو گزینه/شرط را به‌صورت هشدار پیوند دهد.",
    "Pay now or lose the discount.",
    "ساختار امری و پیامد را تشخیص بده."
  ],
  [
    "reporting-verb-relative-conditional-and",
    "and در امر می‌تواند نتیجهٔ شرط ضمنی بسازد.",
    "Work hard and you will improve.",
    "معادل if you work hard است."
  ],
  [
    "reporting-verb-relative-conditional-inverted",
    "وارونگی were/had/should در شرط رسمی بدون if به‌کار می‌رود.",
    "Had I known; Were I there; Should you need help",
    "فاعل پس از auxiliary می‌آید."
  ],
  [
    "reporting-verb-relative-conditional-mixed-past-now",
    "شرط گذشته و نتیجه حال: If + past perfect, would + base.",
    "If I had studied medicine, I would be a doctor now.",
    "زمان‌های دو بند را بر اساس مرجع انتخاب کن."
  ],
  [
    "reporting-verb-relative-conditional-mixed-now-past",
    "شرط حال و نتیجه گذشته: If + past simple, would have + V3.",
    "If I were more careful, I wouldn't have made that error.",
    "این ترکیب کمتر رایج و بافتی است."
  ],
  [
    "reporting-verb-relative-conditional-mixed-continuous",
    "شرط/نتیجه می‌تواند continuous برای وضعیت جاری/روند داشته باشد.",
    "If she were working, she would answer.",
    "زمان و aspect مستقل از نوع شرط‌اند."
  ],
  [
    "reporting-verb-relative-conditional-past-perfect-continuous",
    "past perfect continuous در if-clause برای روند خلاف واقع گذشته.",
    "If he had been listening, he would have understood.",
    "بر مدت/روند تأکید دارد."
  ],
  [
    "reporting-verb-relative-conditional-modal-result",
    "نتیجهٔ شرطی می‌تواند could/might/should/must به‌جای would داشته باشد.",
    "If we hurry, we might catch it.",
    "modal معنی امکان/توصیه/الزام را تغییر می‌دهد."
  ],
  [
    "reporting-verb-relative-conditional-modal-if",
    "modal در if-clause معمولاً برای willingness/politeness/insistence یا معنی خاص است.",
    "If you can wait, I'll help.",
    "will در شرط معمولی آینده معمولاً نمی‌آید."
  ],
  [
    "reporting-verb-relative-conditional-should-result",
    "should در نتیجهٔ شرطی برای توصیه/انتظار است.",
    "If costs rise, the bank should respond.",
    "نوع شرط را با معنی modal قاطی نکن."
  ],
  [
    "reporting-verb-relative-conditional-might",
    "might در نتیجهٔ شرطی احتمال کمتر را بیان می‌کند.",
    "If demand falls, profits might decline.",
    "might در گذشته نیز شکل گذشتهٔ may است."
  ],
  [
    "reporting-verb-relative-conditional-could",
    "could در نتیجهٔ شرطی توانایی/امکان را بیان می‌کند.",
    "If we had more time, we could test it.",
    "could have + V3 برای امکان استفاده‌نشده."
  ],
  [
    "reporting-verb-relative-conditional-would",
    "would در نتیجهٔ شرطی پیامد فرضی را می‌سازد.",
    "If rates fell, borrowing would increase.",
    "would در بند if معمولی پرهیز شود."
  ],
  [
    "reporting-verb-relative-conditional-would-have",
    "would have + V3 برای نتیجهٔ خلاف واقع گذشته است.",
    "If they had acted, losses would have been lower.",
    "would have been + adjective/passive نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-could-have",
    "could have + V3 امکانِ انجام‌نشده یا انتقاد/احتمال گذشته.",
    "We could have avoided the error.",
    "بافت تعیین می‌کند امکان یا سرزنش."
  ],
  [
    "reporting-verb-relative-conditional-might-have",
    "might have + V3 احتمال دربارهٔ گذشته یا نتیجهٔ فرضی است.",
    "They might have misunderstood.",
    "با must have/can't have از نظر قطعیت فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-should-have",
    "should have + V3 انتظار/وظیفهٔ انجام‌نشده یا استنتاج گذشته.",
    "The bank should have acted.",
    "shouldn't have برای انتقاد از عمل انجام‌شده."
  ],
  [
    "reporting-verb-relative-conditional-must-have",
    "must have + V3 استنتاج قوی دربارهٔ گذشته.",
    "She must have left.",
    "mustn't have معمولاً استنتاج منفی نیست."
  ],
  [
    "reporting-verb-relative-conditional-cant-have",
    "can't/couldn't have + V3 استنتاج منفی دربارهٔ گذشته.",
    "He can't have known.",
    "برای ممنوعیت mustn't."
  ],
  [
    "reporting-verb-relative-conditional-may-have",
    "may/might have + V3 احتمال گذشته.",
    "The report may have been altered.",
    "may/might تفاوت درجه‌ای و سبکی دارند."
  ],
  [
    "reporting-verb-relative-conditional-would-have-liked",
    "would have liked + to-infinitive برای خواستهٔ برآورده‌نشده در گذشته.",
    "I would have liked to attend.",
    "would like to برای خواستهٔ حال/آینده."
  ],
  [
    "reporting-verb-relative-conditional-would-rather-have",
    "would rather have + V3 برای ترجیح خلاف واقع گذشتهٔ فاعل؛ would rather + subject + past perfect برای دیگری.",
    "I'd rather have stayed. / I'd rather you had stayed.",
    "دو ساختار را تفکیک کن."
  ],
  [
    "reporting-verb-relative-conditional-prefer-would-have",
    "would have preferred + to-infinitive برای ترجیح گذشتهٔ برآورده‌نشده.",
    "I'd have preferred to wait.",
    "prefer + gerund/to-infinitive در معنی کلی."
  ],
  [
    "reporting-verb-relative-conditional-wish-could-have",
    "wish + could have + V3 برای امکان/توانایی گذشتهٔ ازدست‌رفته.",
    "I wish I could have helped.",
    "با wish + past perfect برای پشیمانی فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-if-only-could-have",
    "if only + could have + V3 برای آرزوی امکان گذشته.",
    "If only I could have attended.",
    "بار عاطفی قوی."
  ],
  [
    "reporting-verb-relative-conditional-as-if-would",
    "as if + would در برخی کاربردها برای willingness/رفتار آینده، اما معمولاً past/past perfect برای فرض.",
    "He acts as if he owned it.",
    "زمان را از معنی و کنترل وضعیت انتخاب کن."
  ],
  [
    "reporting-verb-relative-conditional-were-to-have",
    "were to have + V3 در شرط فرضی رسمی/ادبی محدود است.",
    "Were the firm to have failed...",
    "ساختار پیچیده و کم‌کاربرد؛ در نثر ساده بازنویسی کن."
  ],
  [
    "reporting-verb-relative-conditional-had-been",
    "Had + subject + been + complement در وارونگی شرطی گذشته.",
    "Had she been informed, she would have acted.",
    "فاعل پس از had و قبل از been می‌آید."
  ],
  [
    "reporting-verb-relative-conditional-should-have-inversion",
    "Should + subject + have + V3 در شرط رسمی برای احتمال گذشته.",
    "Should you have received the file, please confirm.",
    "این ساختار از should have برای توصیه گذشته فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-were-to-inversion",
    "Were + subject + to + base برای فرض دور.",
    "Were prices to rise, demand might fall.",
    "در نثر روزمره if ساده‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-ellipsis",
    "شرط می‌تواند با if omitted و participle/phrase کوتاه شود.",
    "If necessary, call me. / Had I known...",
    "فاعل/فعل حذف‌شده باید قابل بازیابی باشد."
  ],
  [
    "reporting-verb-relative-conditional-implied",
    "شرط ضمنی با without, otherwise, or, but for و imperative ساخته می‌شود.",
    "Without your help, I would fail.",
    "ساختار نتیجه را با شرط ضمنی پیوند بده."
  ],
  [
    "reporting-verb-relative-conditional-pragmatics",
    "نوع شرطی به‌تنهایی احتمال واقعی را تعیین نمی‌کند؛ گوینده می‌تواند شرط را برای ادب/احتیاط استفاده کند.",
    "If you could possibly wait...",
    "کاربردشناسی و لحن بر صورت نحوی افزوده می‌شوند."
  ],
  [
    "reporting-verb-relative-conditional-factual",
    "شرطی factual رابطهٔ همیشگی/تکراری را نشان می‌دهد.",
    "If water freezes, it expands.",
    "زمان‌ها بر اساس نوع رابطه انتخاب می‌شوند."
  ],
  [
    "reporting-verb-relative-conditional-predictive",
    "شرطی predictive احتمال آینده را بیان می‌کند.",
    "If rates fall, demand may rise.",
    "حال ساده در if و modal/will در نتیجه."
  ],
  [
    "reporting-verb-relative-conditional-hypothetical",
    "شرطی hypothetical فاصلهٔ ذهنی از واقعیت را با past form نشان می‌دهد.",
    "If I had more time, I would study.",
    "past form الزاماً زمان گذشته نیست."
  ],
  [
    "reporting-verb-relative-conditional-counterfactual",
    "شرطی counterfactual وضعیت خلاف واقع گذشته/حال را نشان می‌دهد.",
    "If I had known, I would have acted.",
    "ساختار mixed نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-open",
    "open condition شرط را باز می‌گذارد و وقوع آن ممکن است.",
    "If you see him, tell him.",
    "ممکن است نتیجه با imperative ساخته شود."
  ],
  [
    "reporting-verb-relative-conditional-remote",
    "remote condition فاصلهٔ ذهنی/فرضی را با past/were نشان می‌دهد.",
    "If I were rich, I would travel.",
    "در برخی زبان‌شناسی‌ها remote به جای second conditional به‌کار می‌رود."
  ],
  [
    "reporting-verb-relative-conditional-past-remote",
    "past perfect در شرطی remote گذشته، خلاف واقع را می‌سازد.",
    "If they had left earlier, they would have arrived.",
    "تقدم زمانی و خلاف واقع را هم‌زمان نشان می‌دهد."
  ],
  [
    "reporting-verb-relative-conditional-future-remote",
    "were to/should در شرط آیندهٔ کم‌احتمال/رسمی.",
    "If the system were to fail...",
    "should احتمال محتاطانه‌تر/رسمی‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-should-formal",
    "if + should برای احتمال ضعیف یا ادب رسمی.",
    "If you should require assistance...",
    "Should you require assistance وارونگی بدون if."
  ],
  [
    "reporting-verb-relative-conditional-were-formal",
    "if + were to برای سناریوی فرضی رسمی.",
    "If the bank were to collapse...",
    "Were the bank to collapse..."
  ],
  [
    "reporting-verb-relative-conditional-unless-not",
    "unless معمولاً معادل if not اما در شرط‌های پیچیده ممکن است تفاوت داشته باشد.",
    "Unless you object, we'll proceed.",
    "unless + negative clause اغلب double negative می‌سازد."
  ],
  [
    "reporting-verb-relative-conditional-but-for-past",
    "but for + noun برای شرط خلاف واقع گذشته/حال و نتیجهٔ فرضی.",
    "But for the warning, we would have lost money.",
    "معادل if it were not/had not been for."
  ],
  [
    "reporting-verb-relative-conditional-if-not-for",
    "if it were not for و if it had not been for زمان حال/گذشته را تفکیک می‌کنند.",
    "If it weren't for the data...",
    "were not for حال؛ had not been for گذشته."
  ],
  [
    "reporting-verb-relative-conditional-without-gerund",
    "without + gerund می‌تواند شرط ضمنی باشد.",
    "Without checking the source, you might be misled.",
    "فاعل ضمنی باید با جمله اصلی سازگار باشد."
  ],
  [
    "reporting-verb-relative-conditional-and-imperative",
    "imperative + and برای شرط مثبت و imperative + or برای شرط منفی/بدیل.",
    "Press this button and the system starts.",
    "معادل if you press... است."
  ],
  [
    "reporting-verb-relative-conditional-inversion-had",
    "Had + subject + V3 در شرطی نوع سوم رسمی.",
    "Had we known, we would have stayed.",
    "در گفتار if رایج‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-inversion-were",
    "Were + subject + complement/to-infinitive در شرطی فرضی.",
    "Were I you, I would wait.",
    "were در همهٔ اشخاص."
  ],
  [
    "reporting-verb-relative-conditional-inversion-should",
    "Should + subject + base verb برای احتمال/شرط رسمی.",
    "Should anything happen, call us.",
    "در گفتار روزمره کمتر رایج است."
  ],
  [
    "reporting-verb-relative-conditional-inversion-not",
    "وارونگی شرطی با not می‌تواند در جملهٔ منفی بیاید.",
    "Had it not been for her...",
    "not پس از فاعل می‌آید."
  ],
  [
    "reporting-verb-relative-conditional-if-omission",
    "در شرط رسمی، حذف if با وارونگی had/were/should ممکن است.",
    "Had I known...",
    "با فعل‌های دیگر وارونگی شرطی استاندارد نیست."
  ],
  [
    "reporting-verb-relative-conditional-ellipsis-if",
    "if + adjective/participle phrase می‌تواند بند کوتاه‌شده بسازد.",
    "If possible, send the file.",
    "فاعل/فعل از بافت بازیابی می‌شود."
  ],
  [
    "reporting-verb-relative-conditional-if-ever",
    "if ever برای احتمال نادر/حداکثری است.",
    "He rarely, if ever, complains.",
    "جایگاه پرانتزی و قید بسامد."
  ],
  [
    "reporting-verb-relative-conditional-if-at-all",
    "if at all برای تردید دربارهٔ وجود/میزان است.",
    "The effect is small, if it exists at all.",
    "عبارت تقویتی است."
  ],
  [
    "reporting-verb-relative-conditional-if-not-otherwise",
    "unless otherwise stated و unless otherwise agreed عبارت‌های قراردادی‌اند.",
    "Prices exclude tax unless otherwise stated.",
    "otherwise به شرایط متفاوت ارجاع می‌دهد."
  ],
  [
    "reporting-verb-relative-conditional-subject-to",
    "subject to + noun یعنی مشروط به؛ subject to change عبارت رایج است.",
    "The offer is subject to approval.",
    "not subject for."
  ],
  [
    "reporting-verb-relative-conditional-contingent-on",
    "contingent on/upon + noun/gerund برای وابستگی شرطی است.",
    "Payment is contingent on delivery.",
    "register رسمی/تجاری."
  ],
  [
    "reporting-verb-relative-conditional-dependent-on",
    "dependent on + noun/gerund/clause.",
    "The outcome is dependent on demand.",
    "depend on فعل و dependent on صفت‌اند."
  ],
  [
    "reporting-verb-relative-conditional-insofar",
    "insofar as برای محدودکردن دامنهٔ ادعا.",
    "The rule applies insofar as it is relevant.",
    "register رسمی."
  ],
  [
    "reporting-verb-relative-conditional-to-the-extent",
    "to the extent that برای تعیین دامنه/حد شرط.",
    "The claim is true to the extent that...",
    "ساختار آکادمیک/رسمی."
  ],
  [
    "reporting-verb-relative-conditional-as-far-as",
    "as far as می‌تواند دامنهٔ دانش/موضوع یا فاصله را نشان دهد.",
    "As far as I know...",
    "as far as possible و as far as distance."
  ],
  [
    "reporting-verb-relative-conditional-so-far-as",
    "so far as در نثر رسمی به معنی تا جایی که است.",
    "So far as we can tell...",
    "as far as رایج‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-provided-that-vs-if",
    "provided that شرط را به‌صورت شرط لازم/توافقی برجسته می‌کند؛ if خنثی‌تر است.",
    "We'll agree provided that terms are clear.",
    "معنی دقیق به قرارداد/بافت وابسته است."
  ],
  [
    "reporting-verb-relative-conditional-unless-vs-if",
    "unless معادل if not در بسیاری موارد، اما با شرط‌های منفی/استثنا ممکن است فرق کند.",
    "Unless you object, we'll proceed.",
    "جمله را با if not بازنویسی کن تا معنی کنترل شود."
  ],
  [
    "reporting-verb-relative-conditional-even-if-vs-even-though",
    "even if فرض؛ even though واقعیت.",
    "Even if he apologizes... / Even though he apologized...",
    "این تمایز در نوشتار استدلالی مهم است."
  ],
  [
    "reporting-verb-relative-conditional-in-case-vs-if",
    "in case اقدام احتیاطی؛ if شرطی که نتیجه به آن وابسته است.",
    "Take cash in case the card fails. / If it fails, call us.",
    "دو جمله از نظر منطق رابطه متفاوت‌اند."
  ],
  [
    "reporting-verb-relative-conditional-when-vs-if",
    "when انتظار وقوع و زمان را برجسته می‌کند؛ if عدم قطعیت/شرط را.",
    "When he arrives... / If he arrives...",
    "بند زمانی آینده حال ساده می‌گیرد."
  ],
  [
    "reporting-verb-relative-conditional-as-long-as-vs-unless",
    "as long as شرط مثبت/مدت؛ unless شرط منفی/استثنا.",
    "You can stay as long as you behave.",
    "ساختارها در برخی موقعیت‌ها قابل جایگزینی نیستند."
  ],
  [
    "reporting-verb-relative-conditional-only-if-vs-if-only",
    "only if شرط لازم؛ if only آرزو/پشیمانی.",
    "Only if you agree... / If only you agreed...",
    "جایگاه only دامنه را تغییر می‌دهد."
  ],
  [
    "reporting-verb-relative-conditional-if-and-only-if",
    "if and only if شرط لازم و کافی در منطق/ریاضی.",
    "A iff B.",
    "در نثر عمومی از when and only when یا precisely when با دقت استفاده کن."
  ],
  [
    "reporting-verb-relative-conditional-whether-or-not",
    "whether or not یعنی مستقل از اینکه شرط برقرار شود یا نه.",
    "Whether or not prices fall, we proceed.",
    "whether همچنین بند پرسشی غیرمستقیم می‌سازد."
  ],
  [
    "reporting-verb-relative-conditional-no-matter-what",
    "no matter what + clause برای هر اتفاق/شرط.",
    "No matter what happens, stay calm.",
    "whatever می‌تواند جایگزین شود."
  ],
  [
    "reporting-verb-relative-conditional-however-hard",
    "however + adjective/adverb + clause برای concessive.",
    "However hard you try, it may fail.",
    "no matter how نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-whatever-happens",
    "whatever happens یک عبارت concessive ثابت است.",
    "Whatever happens, call me.",
    "فاعل whatever clause می‌تواند مفرد/جمع بر اساس اسم باشد."
  ],
  [
    "reporting-verb-relative-conditional-whoever-wins",
    "whoever wins ساختار concessive/relative آزاد دارد.",
    "Whoever wins, the rules remain.",
    "فعل wins با whoever مفرد است."
  ],
  [
    "reporting-verb-relative-conditional-whichever-you-choose",
    "whichever you choose انتخاب از مجموعهٔ محدود است.",
    "Whichever you choose will work.",
    "فعل در بند اصلی با کل clause هماهنگ می‌شود."
  ],
  [
    "reporting-verb-relative-conditional-wherever-you-go",
    "wherever you go بند مکانی آزاد/concessive است.",
    "Wherever you go, keep learning.",
    "go حال ساده در بند آینده."
  ],
  [
    "reporting-verb-relative-conditional-whenever-you-call",
    "whenever you call بند زمانی/تکراری است.",
    "Whenever you call, I'll answer.",
    "will در بند اصلی، present در بند زمانی."
  ],
  [
    "reporting-verb-relative-conditional-whether-you-like",
    "whether you like it or not عبارت concessive است.",
    "Whether you like it or not, the rule applies.",
    "or not می‌تواند بعد از whether یا انتهای بند بیاید."
  ],
  [
    "reporting-verb-relative-conditional-come-what-may",
    "come what may عبارت ثابت ادبی به معنی هرچه پیش آید است.",
    "Come what may, we will continue.",
    "ساختار inversion/فعل come در عبارت ثابت."
  ],
  [
    "reporting-verb-relative-conditional-be-that-as-it-may",
    "be that as it may عبارت concessive رسمی است.",
    "Be that as it may, evidence is needed.",
    "subjunctive be در عبارت ثابت."
  ],
  [
    "reporting-verb-relative-conditional-so-be-it",
    "so be it عبارت پذیرش/تسلیم رسمی است.",
    "If that is the decision, so be it.",
    "be subjunctive/فرمولی."
  ],
  [
    "reporting-verb-relative-conditional-far-be-it",
    "far be it from me to... عبارت ثابت برای فاصله‌گیری مودبانه/طعنه.",
    "Far be it from me to criticize...",
    "وارونگی و subjunctive فرمولی."
  ],
  [
    "reporting-verb-relative-conditional-long-live",
    "long live + subject عبارت دعایی/آرزویی با subjunctive است.",
    "Long live the republic!",
    "در زبان روزمره محدود به شعار/فرمول."
  ],
  [
    "reporting-verb-relative-conditional-heaven-forbid",
    "heaven forbid + clause عبارت آرزویی/دفع احتمال است.",
    "Heaven forbid that should happen.",
    "فرمولی و register خاص."
  ],
  [
    "reporting-verb-relative-conditional-if-need-be",
    "if need be عبارت ثابت به معنی اگر لازم باشد است.",
    "We can stay longer if need be.",
    "need در اینجا modal-like است."
  ],
  [
    "reporting-verb-relative-conditional-if-possible",
    "if possible/necessary/appropriate بند کوتاه‌شده است.",
    "If possible, reply today.",
    "فاعل/فعل از متن بازیابی می‌شود."
  ],
  [
    "reporting-verb-relative-conditional-if-only-now",
    "if only now می‌تواند آرزوی دیرهنگام/تغییر در حال را بیان کند.",
    "If only they would act now.",
    "ساختار wish + would مشابه است."
  ],
  [
    "reporting-verb-relative-conditional-wish-if-only",
    "wish و if only در زمان و وجه مشابه اما در شدت عاطفی متفاوت‌اند.",
    "I wish I knew; If only I knew.",
    "if only معمولاً تأکیدی‌تر است."
  ],
  [
    "reporting-verb-relative-conditional-would-rather",
    "would rather + base و would rather + subject + past/past perfect.",
    "I'd rather go; I'd rather you went.",
    "to بعد از rather نمی‌آید."
  ],
  [
    "reporting-verb-relative-conditional-had-better",
    "had better + base برای توصیهٔ قوی و پیامد ضمنی.",
    "You had better leave.",
    "زمان ظاهری had گذشته نیست."
  ],
  [
    "reporting-verb-relative-conditional-would-sooner",
    "would sooner + base برای ترجیح.",
    "I'd sooner resign than lie.",
    "register کمی رسمی/قدیمی."
  ],
  [
    "reporting-verb-relative-conditional-would-just-as-soon",
    "would just as soon + base برای ترجیح.",
    "I'd just as soon wait.",
    "کاربرد محدودتر."
  ],
  [
    "reporting-verb-relative-conditional-prefer",
    "prefer doing to doing و prefer to do rather than do.",
    "I prefer walking to driving.",
    "ساختارهای موازی."
  ],
  [
    "reporting-verb-relative-conditional-would-prefer",
    "would prefer to do / would prefer someone to do.",
    "I'd prefer to wait.",
    "با would rather + subject + past فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-would-like",
    "would like to do / would like someone to do.",
    "I'd like you to stay.",
    "درخواست مودبانه."
  ],
  [
    "reporting-verb-relative-conditional-would-love",
    "would love to do برای میل قوی.",
    "I'd love to visit.",
    "would love doing برای لذت عمومی ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-would-hate",
    "would hate to do برای عدم تمایل/نگرانی.",
    "I'd hate to disappoint you.",
    "would hate someone doing نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-rather-than",
    "rather than + parallel infinitive/gerund/noun.",
    "rather than wait; rather than waiting",
    "ساختار را موازی نگه دار."
  ],
  [
    "reporting-verb-relative-conditional-instead-of",
    "instead of + noun/gerund.",
    "instead of waiting",
    "to-infinitive مستقیم بعد از of نمی‌آید."
  ],
  [
    "reporting-verb-relative-conditional-as-opposed",
    "as opposed to + noun/gerund.",
    "fixed rather than variable costs",
    "to حرف اضافه است."
  ],
  [
    "reporting-verb-relative-conditional-in-lieu",
    "in lieu of + noun/gerund رسمی.",
    "in lieu of payment",
    "عبارت حقوقی."
  ],
  [
    "reporting-verb-relative-conditional-instead",
    "instead قید؛ instead of حرف اضافه.",
    "We stayed home instead. / instead of travelling",
    "نقش و ساختار را تفکیک کن."
  ],
  [
    "reporting-verb-relative-conditional-alternatively",
    "alternatively قید گفتمانی برای گزینهٔ دیگر است.",
    "Alternatively, we could wait.",
    "برای ارائهٔ گزینهٔ جایگزین."
  ],
  [
    "reporting-verb-relative-conditional-or-rather",
    "or rather برای اصلاح/دقیق‌کردن گفتهٔ پیشین است.",
    "The minister—or rather, the deputy—spoke.",
    "نشانه‌گذاری و کانون اصلاح مهم است."
  ],
  [
    "reporting-verb-relative-conditional-more-precisely",
    "more precisely برای بازتعریف دقیق‌تر گزاره است.",
    "The rate fell—more precisely, it fell by 0.4 points.",
    "قید گفتمانی."
  ],
  [
    "reporting-verb-relative-conditional-that-is",
    "that is/i.e. برای توضیح دقیق‌تر است.",
    "The measure is temporary, that is, it expires in June.",
    "i.e. با e.g. فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-for-example",
    "for example/e.g. برای نمونه؛ for instance نیز مشابه.",
    "Several assets, for example gold, rose.",
    "مثال‌ها لزوماً کل مجموعه نیستند."
  ],
  [
    "reporting-verb-relative-conditional-such-as-vs-like",
    "such as رسمی‌تر برای نمونه؛ like برای شباهت و در گفتار مثال.",
    "countries such as Germany",
    "دامنهٔ فهرست را روشن کن."
  ],
  [
    "reporting-verb-relative-conditional-namely",
    "namely برای مشخص‌کردن دقیق موارد است.",
    "Two factors matter, namely cost and time.",
    "فهرست معمولاً exhaustive است."
  ],
  [
    "reporting-verb-relative-conditional-respectively",
    "respectively برای تناظر دو فهرست.",
    "A and B cost 5 and 7, respectively.",
    "فهرست‌ها باید موازی و هم‌طول باشند."
  ],
  [
    "reporting-verb-relative-conditional-in-particular",
    "in particular برای برجسته‌کردن یک مورد از مجموعه.",
    "Inflation, in particular, remains high.",
    "جایگاه بر دامنهٔ تأکید اثر دارد."
  ],
  [
    "reporting-verb-relative-conditional-especially",
    "especially برای به‌ویژه و تقویت نمونه.",
    "This is especially important.",
    "به‌عنوان قید شدت/تمرکز."
  ],
  [
    "reporting-verb-relative-conditional-particularly",
    "particularly مشابه especially، رسمی‌تر/تحلیلی‌تر.",
    "Particularly in emerging markets...",
    "ساختار قیدی."
  ],
  [
    "reporting-verb-relative-conditional-most-notably",
    "most notably برای برجسته‌ترین نمونه.",
    "Several sectors, most notably energy,...",
    "قید گفتمانی."
  ],
  [
    "reporting-verb-relative-conditional-chiefly",
    "chiefly/mainly/primarily برای عمدتاً.",
    "The decline was chiefly driven by exports.",
    "درجهٔ تمرکز و register متفاوت."
  ],
  [
    "reporting-verb-relative-conditional-largely",
    "largely برای تا حد زیادی و قید درجه.",
    "The outcome was largely expected.",
    "largely due to ساختار علت."
  ],
  [
    "reporting-verb-relative-conditional-partly",
    "partly/in part برای بخشی از علت/مقدار.",
    "The decline was partly caused by demand.",
    "از بیان علت کامل پرهیز کن اگر سهمی است."
  ],
  [
    "reporting-verb-relative-conditional-at-least",
    "at least حد پایین و دست‌کم.",
    "At least 20 firms applied.",
    "در قید جمله نیز برای حداقل ادعا."
  ],
  [
    "reporting-verb-relative-conditional-at-most",
    "at most حد بالای مقدار.",
    "At most ten users were affected.",
    "حداکثر."
  ],
  [
    "reporting-verb-relative-conditional-no-more-than",
    "no more than حداکثر/تأکید بر کم بودن.",
    "No more than five people attended.",
    "با not more than از نظر لحن فرق دارد."
  ],
  [
    "reporting-verb-relative-conditional-no-fewer-than",
    "no fewer than برای تأکید بر تعداد زیاد.",
    "No fewer than 500 applications arrived.",
    "register رسمی/تأکیدی."
  ],
  [
    "reporting-verb-relative-conditional-as-many-as",
    "as many as برای تعداد زیاد غیرمنتظره.",
    "As many as 1,000 users were affected.",
    "as much as برای مقدار mass."
  ],
  [
    "reporting-verb-relative-conditional-as-little-as",
    "as little as برای مقدار اندک/حداقل.",
    "It costs as little as $5.",
    "تأکید بر کم بودن."
  ],
  [
    "reporting-verb-relative-conditional-up-to",
    "up to برای حداکثر مقدار.",
    "Up to 30% may be affected.",
    "ادعای تبلیغاتی را دقیق ارزیابی کن."
  ],
  [
    "reporting-verb-relative-conditional-over-under",
    "over/under برای بیش/کمتر از مقدار/سن/زمان.",
    "over 100 users; under 18",
    "more than/less than رسمی‌تر/شفاف‌تر."
  ],
  [
    "reporting-verb-relative-conditional-around-about",
    "around/about/approximately برای تقریب.",
    "about 20 people",
    "about به معنی موضوع/درباره نیز می‌آید."
  ],
  [
    "reporting-verb-relative-conditional-some",
    "some + plural/mass برای مقدار نامشخص و some + singular count برای یک فرد/چیز خاص در معنی خاص.",
    "some water; some books; some person",
    "some of + determiner/pronoun."
  ],
  [
    "reporting-verb-relative-conditional-any",
    "any در پرسش/منفی/شرط و معنی آزاد «هر» در مثبت.",
    "Do you have any? / Any student can apply.",
    "some در offers/requests."
  ],
  [
    "reporting-verb-relative-conditional-no",
    "no + noun برای نفی مستقیم و فعل مثبت.",
    "No evidence was found.",
    "not any نیز ممکن است."
  ],
  [
    "reporting-verb-relative-conditional-none",
    "none ضمیر مستقل؛ of + group.",
    "None of them agreed.",
    "توافق مفرد/جمع متغیر."
  ],
  [
    "reporting-verb-relative-conditional-each",
    "each + singular noun/each of + plural group و فعل مفرد.",
    "Each employee has a badge.",
    "each به توزیع فردی."
  ],
  [
    "reporting-verb-relative-conditional-every",
    "every + singular noun و فعل مفرد.",
    "Every employee has a badge.",
    "every of نادرست."
  ],
  [
    "reporting-verb-relative-conditional-both",
    "both + plural noun/ both of + pronoun.",
    "Both reports are ready.",
    "فقط دو مورد."
  ],
  [
    "reporting-verb-relative-conditional-either",
    "either + singular noun برای یکی از دو.",
    "Either route is fine.",
    "either of + plural group."
  ],
  [
    "reporting-verb-relative-conditional-neither",
    "neither + singular noun برای هیچ‌یک از دو.",
    "Neither option works.",
    "neither of و neither...nor."
  ],
  [
    "reporting-verb-relative-conditional-all",
    "all + plural/mass noun و all of + pronoun.",
    "All the reports are ready.",
    "all of them."
  ],
  [
    "reporting-verb-relative-conditional-most",
    "most + noun؛ most of + determiner/pronoun.",
    "Most people agree.",
    "most of the people."
  ],
  [
    "reporting-verb-relative-conditional-several",
    "several + plural count noun.",
    "Several firms applied.",
    "several of + determiner."
  ],
  [
    "reporting-verb-relative-conditional-many",
    "many + plural count noun; much + mass.",
    "many firms; much capital",
    "many a + singular."
  ],
  [
    "reporting-verb-relative-conditional-much",
    "much + mass noun؛ در مثبت با so/too/as/how و formal.",
    "too much money; much appreciated",
    "a lot of در جملهٔ مثبت روزمره رایج‌تر."
  ],
  [
    "reporting-verb-relative-conditional-little",
    "little/a little + mass noun.",
    "little evidence; a little time",
    "a little مثبت‌تر."
  ],
  [
    "reporting-verb-relative-conditional-few",
    "few/a few + plural count noun.",
    "few options; a few options",
    "a few مثبت‌تر."
  ],
  [
    "reporting-verb-relative-conditional-plenty",
    "plenty of + mass/plural count.",
    "plenty of time; plenty of options",
    "فعل با اسم پس از of."
  ],
  [
    "reporting-verb-relative-conditional-lots",
    "lots of/a lot of + mass/plural count.",
    "lots of work; a lot of people",
    "register غیررسمی‌تر."
  ],
  [
    "reporting-verb-relative-conditional-a-number",
    "a number of + plural noun فعل جمع.",
    "A number of firms are exposed.",
    "the number of مفرد."
  ],
  [
    "reporting-verb-relative-conditional-the-number",
    "the number of + plural noun فعل مفرد.",
    "The number of firms is rising.",
    "head number."
  ],
  [
    "reporting-verb-relative-conditional-a-amount",
    "an amount of + mass noun.",
    "A large amount of money is missing.",
    "amounts of plural."
  ],
  [
    "reporting-verb-relative-conditional-quantity",
    "quantity of + mass/count; agreement with head.",
    "A quantity of goods was seized.",
    "quantities of plural."
  ],
  [
    "reporting-verb-relative-conditional-a-great-deal",
    "a great deal of + mass noun.",
    "A great deal of work remains.",
    "a great many + plural."
  ],
  [
    "reporting-verb-relative-conditional-a-great-many",
    "a great many + plural count noun.",
    "A great many people were affected.",
    "a great deal of + mass."
  ],
  [
    "reporting-verb-relative-conditional-a-large-number",
    "a large number of + plural count noun.",
    "A large number of users are active.",
    "the number of + plural noun singular."
  ],
  [
    "reporting-verb-relative-conditional-a-large-amount",
    "a large amount of + mass noun.",
    "A large amount of data is stored.",
    "data agreement depends on register."
  ],
  [
    "reporting-verb-relative-conditional-percent",
    "percentages agree with the noun after of or are treated as one amount.",
    "20% of users are active; 20% is a large share.",
    "context and notional agreement."
  ],
  [
    "reporting-verb-relative-conditional-fraction",
    "fractions agree with the noun after of.",
    "Two-thirds of the land is dry.",
    "fractions as one value can be singular."
  ],
  [
    "reporting-verb-relative-conditional-majority",
    "majority of + plural can be plural; majority as a unit singular.",
    "The majority of voters are young.",
    "BrE/AmE differences."
  ],
  [
    "reporting-verb-relative-conditional-minority",
    "minority of + plural can be plural or singular depending on focus.",
    "A minority of voters oppose it.",
    "clarity and style guide."
  ],
  [
    "reporting-verb-relative-conditional-rest",
    "the rest of agrees with mass/plural noun.",
    "The rest of the money is safe.",
    "the rest of the files are safe."
  ],
  [
    "reporting-verb-relative-conditional-pluralia",
    "plural-only nouns take plural verbs.",
    "The trousers are new.",
    "a pair of trousers is."
  ],
  [
    "reporting-verb-relative-conditional-mass-nouns",
    "mass nouns take singular verbs and no a/an.",
    "The equipment is ready.",
    "count reclassification possible."
  ],
  [
    "reporting-verb-relative-conditional-countability",
    "some nouns change countability with meaning.",
    "paper/a paper; chicken/a chicken",
    "learn lexical senses."
  ],
  [
    "reporting-verb-relative-conditional-collective",
    "collective nouns allow notional agreement in some dialects.",
    "The family are travelling.",
    "AmE singular preference."
  ],
  [
    "reporting-verb-relative-conditional-police",
    "police plural; police officer singular.",
    "The police are here.",
    "police force singular."
  ],
  [
    "reporting-verb-relative-conditional-data",
    "data plural in traditional academic usage; mass singular in general usage.",
    "The data are/is useful.",
    "follow publisher style."
  ],
  [
    "reporting-verb-relative-conditional-media",
    "media plural or collective mass depending on meaning.",
    "The media are covering it.",
    "social media as platform/industry singular possible."
  ],
  [
    "reporting-verb-relative-conditional-either-neither",
    "either/neither singular in formal use; variation after of.",
    "Neither of them is ready.",
    "plural informal usage."
  ],
  [
    "reporting-verb-relative-conditional-each-everyone",
    "each/everyone singular verb, singular they pronoun.",
    "Everyone is ready; they are waiting.",
    "agreement split between antecedent and pronoun."
  ],
  [
    "reporting-verb-relative-conditional-one-of-who",
    "one of those who + plural verb in relative clause.",
    "one of those who work here",
    "who refers to those."
  ],
  [
    "reporting-verb-relative-conditional-only-one-who",
    "the only one who + singular verb.",
    "the only one who knows",
    "who refers to one."
  ],
  [
    "reporting-verb-relative-conditional-more-than-one",
    "more than one + singular noun and verb.",
    "More than one person has called.",
    "many a similar."
  ],
  [
    "reporting-verb-relative-conditional-many-a",
    "many a + singular noun/verb.",
    "Many a person has tried.",
    "formal/literary."
  ],
  [
    "reporting-verb-relative-conditional-as-well-as",
    "as well as does not create plural compound subject.",
    "The manager, as well as staff, is here.",
    "and creates plural."
  ],
  [
    "reporting-verb-relative-conditional-along-with",
    "along with/together with does not change head agreement.",
    "The CEO, along with advisers, is present.",
    "identify subject head."
  ],
  [
    "reporting-verb-relative-conditional-either-or",
    "either...or often follows nearest-subject agreement.",
    "Either the manager or staff are responsible.",
    "rewrite for clarity."
  ],
  [
    "reporting-verb-relative-conditional-neither-nor",
    "neither...nor often follows nearest-subject agreement.",
    "Neither staff nor the manager is ready.",
    "style guide and rewrite."
  ],
  [
    "reporting-verb-relative-conditional-not-only",
    "not only...but also requires parallel structure and agreement.",
    "Not only costs but also risks are rising.",
    "fronted not only triggers inversion."
  ],
  [
    "reporting-verb-relative-conditional-there",
    "existential there + be agrees with postverbal subject.",
    "There are two reasons.",
    "formal there exists."
  ],
  [
    "reporting-verb-relative-conditional-here",
    "here + be agrees with postverbal subject.",
    "Here are the files.",
    "pronoun order differs."
  ],
  [
    "reporting-verb-relative-conditional-inversion",
    "inverted clauses agree with postverbal subject.",
    "On the desk were two reports.",
    "find true subject."
  ],
  [
    "reporting-verb-relative-conditional-apposition",
    "appositive does not control agreement.",
    "The CEO of the firms is here.",
    "head noun is CEO."
  ],
  [
    "reporting-verb-relative-conditional-prepositional-phrase",
    "noun inside a prepositional phrase usually does not control verb agreement.",
    "The quality of the reports is high.",
    "head noun quality."
  ],
  [
    "reporting-verb-relative-conditional-intervening-phrase",
    "ignore intervening phrases when identifying subject-verb agreement.",
    "The list of items is long.",
    "find grammatical head."
  ],
  [
    "reporting-verb-relative-conditional-subject-complement",
    "subject complement can be plural while subject is singular; agreement may be notional in some cases.",
    "The main problem is the costs.",
    "formal style often follows subject."
  ],
  [
    "reporting-verb-relative-conditional-what-clause",
    "what-clause subject often takes singular verb.",
    "What we need is evidence.",
    "plural complement can influence agreement in some patterns."
  ],
  [
    "reporting-verb-relative-conditional-all-that",
    "all that + clause often takes singular when meaning everything.",
    "All that matters is trust.",
    "all + plural noun is plural."
  ],
  [
    "reporting-verb-relative-conditional-number-vs-numeral",
    "numbers as arithmetic values are singular; plural units can be plural.",
    "Ten is a large number. / Ten people are waiting.",
    "meaning determines agreement."
  ],
  [
    "reporting-verb-relative-conditional-time-distance-money",
    "time/distance/money as one amount take singular.",
    "Ten dollars is enough.",
    "separate units/items can be plural."
  ],
  [
    "reporting-verb-relative-conditional-title",
    "titles of works and organizations usually take singular verbs even if plural-looking.",
    "Great Expectations is a novel.",
    "title is one entity."
  ],
  [
    "reporting-verb-relative-conditional-country",
    "country names with plural form often take singular verbs.",
    "The United States is...",
    "the Netherlands is..."
  ],
  [
    "reporting-verb-relative-conditional-measles",
    "disease names ending in -s often singular.",
    "Measles is contagious.",
    "plural-looking form does not determine count."
  ],
  [
    "reporting-verb-relative-conditional-athletics",
    "academic disciplines ending -ics usually singular.",
    "Economics is important.",
    "statistics/physics can have other meanings."
  ],
  [
    "reporting-verb-relative-conditional-statistics",
    "statistics discipline singular; numerical statistics plural.",
    "Statistics is difficult. / The statistics are worrying.",
    "lexical sense determines."
  ],
  [
    "reporting-verb-relative-conditional-glasses",
    "glasses/trousers/scissors plural; pair singular.",
    "The glasses are broken. / A pair is missing.",
    "pair of + pluralia tantum."
  ],
  [
    "reporting-verb-relative-conditional-goods",
    "goods plural for merchandise.",
    "The goods were delivered.",
    "good adjective/noun singular differs."
  ],
  [
    "reporting-verb-relative-conditional-customs",
    "customs plural for border agency or traditions.",
    "Customs are strict.",
    "custom singular."
  ],
  [
    "reporting-verb-relative-conditional-savings",
    "savings plural for saved money.",
    "My savings are safe.",
    "saving can be singular as action."
  ],
  [
    "reporting-verb-relative-conditional-earnings",
    "earnings plural.",
    "Earnings have increased.",
    "earning as gerund/participle."
  ],
  [
    "reporting-verb-relative-conditional-proceeds",
    "proceeds plural for revenue.",
    "The proceeds were donated.",
    "proceed verb."
  ],
  [
    "reporting-verb-relative-conditional-outskirts",
    "outskirts plural.",
    "The outskirts are quiet.",
    "no singular outskirts."
  ],
  [
    "reporting-verb-relative-conditional-surroundings",
    "surroundings plural.",
    "The surroundings are peaceful.",
    "surrounding adjective."
  ],
  [
    "reporting-verb-relative-conditional-belongings",
    "belongings plural.",
    "Her belongings were returned.",
    "belonging verb/noun singular."
  ],
  [
    "reporting-verb-relative-conditional-remains",
    "remains plural for what is left.",
    "The remains were found.",
    "remain verb."
  ],
  [
    "reporting-verb-relative-conditional-contents",
    "contents plural for what is inside.",
    "The contents are listed.",
    "content mass noun."
  ],
  [
    "reporting-verb-relative-conditional-odds",
    "odds plural.",
    "The odds are low.",
    "odd adjective."
  ],
  [
    "reporting-verb-relative-conditional-looks",
    "looks plural noun for appearance.",
    "Her looks are striking.",
    "look verb."
  ],
  [
    "reporting-verb-relative-conditional-spirits",
    "spirits plural for mood.",
    "Her spirits are high.",
    "spirit singular for energy/ghost."
  ],
  [
    "reporting-verb-relative-conditional-thanks",
    "thanks plural/phrase.",
    "Many thanks.",
    "thank verb."
  ],
  [
    "reporting-verb-relative-conditional-congratulations",
    "congratulations plural expression.",
    "Congratulations!",
    "congratulation singular possible in formal contexts."
  ],
  [
    "reporting-verb-relative-conditional-regards",
    "regards plural expression/letter closing.",
    "Kind regards.",
    "regard singular as attention."
  ],
  [
    "reporting-verb-relative-conditional-means",
    "means singular/plural same form.",
    "A means is; several means are.",
    "verb/determiner disambiguates."
  ],
  [
    "reporting-verb-relative-conditional-series",
    "series singular/plural same form.",
    "One series is; two series are.",
    "determiner/verb."
  ],
  [
    "reporting-verb-relative-conditional-species",
    "species singular/plural same form.",
    "This species is; these species are.",
    "determiner/verb."
  ],
  [
    "reporting-verb-relative-conditional-headquarters",
    "headquarters singular/plural depending on institution/locations.",
    "The headquarters is in Berlin.",
    "headquarter as verb."
  ],
  [
    "reporting-verb-relative-conditional-works",
    "works has multiple meanings and agreement.",
    "The works are closed.",
    "work mass noun."
  ],
  [
    "reporting-verb-relative-conditional-people",
    "people plural; a people nation; peoples nations.",
    "People are; a people is.",
    "semantic number."
  ],
  [
    "reporting-verb-relative-conditional-persons",
    "persons formal/legal plural of person.",
    "Ten persons were present.",
    "people general."
  ],
  [
    "reporting-verb-relative-conditional-fish",
    "fish plural unchanged; fishes species.",
    "Many fish; several fishes.",
    "context."
  ],
  [
    "reporting-verb-relative-conditional-sheep",
    "sheep plural unchanged.",
    "Ten sheep are grazing.",
    "one sheep is."
  ],
  [
    "reporting-verb-relative-conditional-deer",
    "deer plural unchanged.",
    "Two deer were seen.",
    "deer."
  ],
  [
    "reporting-verb-relative-conditional-mice",
    "mouse/mice irregular.",
    "Several mice were caught.",
    "computer mouse variants."
  ],
  [
    "reporting-verb-relative-conditional-geese",
    "goose/geese irregular.",
    "Three geese flew over.",
    "geese."
  ],
  [
    "reporting-verb-relative-conditional-children",
    "child/children irregular.",
    "The children are playing.",
    "children."
  ],
  [
    "reporting-verb-relative-conditional-teeth",
    "tooth/teeth irregular.",
    "Brush your teeth.",
    "teeth."
  ],
  [
    "reporting-verb-relative-conditional-feet",
    "foot/feet irregular.",
    "My feet hurt.",
    "feet."
  ],
  [
    "reporting-verb-relative-conditional-men-women",
    "man/men, woman/women irregular.",
    "Women are attending.",
    "compound plurals."
  ],
  [
    "reporting-verb-relative-conditional-oxen",
    "ox/oxen archaic/irregular plural.",
    "The oxen are working.",
    "not productive for modern nouns."
  ],
  [
    "reporting-verb-relative-conditional-brothers-brethren",
    "brothers common plural; brethren specialized/archaic collective.",
    "my brothers; religious brethren",
    "register and meaning."
  ],
  [
    "reporting-verb-relative-conditional-sisters",
    "sister/sisters regular.",
    "The sisters are here.",
    "no irregular form."
  ],
  [
    "reporting-verb-relative-conditional-appendix",
    "appendices/appendixes both accepted.",
    "The appendices are attached.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-index",
    "indices/indexes both accepted.",
    "Price indices are rising.",
    "domain-specific preference."
  ],
  [
    "reporting-verb-relative-conditional-formula",
    "formulae/formulas both accepted.",
    "The formulas are complex.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-curriculum",
    "curricula/curriculums both accepted.",
    "Several curricula were reviewed.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-syllabus",
    "syllabi/syllabuses both accepted.",
    "The syllabi are available.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-octopus",
    "octopuses standard; octopi less preferred.",
    "Octopuses are intelligent.",
    "avoid false Latin plural."
  ],
  [
    "reporting-verb-relative-conditional-virus",
    "viruses standard plural.",
    "Viruses spread.",
    "viri nonstandard."
  ],
  [
    "reporting-verb-relative-conditional-agenda",
    "agenda singular in modern English; agendas plural.",
    "The agenda is full.",
    "Latin origin not English agreement."
  ],
  [
    "reporting-verb-relative-conditional-bacteria",
    "bacteria traditional plural; bacterium singular.",
    "Bacteria are present.",
    "mass usage varies."
  ],
  [
    "reporting-verb-relative-conditional-phenomena",
    "phenomena plural; phenomenon singular.",
    "The phenomena are unusual.",
    "Greek plural."
  ],
  [
    "reporting-verb-relative-conditional-criteria",
    "criteria plural; criterion singular.",
    "The criteria are clear.",
    "avoid criteria is in formal writing."
  ],
  [
    "reporting-verb-relative-conditional-crises",
    "crises plural; crisis singular.",
    "The crises were severe.",
    "Greek plural."
  ],
  [
    "reporting-verb-relative-conditional-analyses",
    "analyses plural; analysis singular.",
    "The analyses were detailed.",
    "Greek plural."
  ],
  [
    "reporting-verb-relative-conditional-theses",
    "theses plural; thesis singular.",
    "The theses were accepted.",
    "Greek plural."
  ],
  [
    "reporting-verb-relative-conditional-bases",
    "bases plural; basis singular.",
    "The bases are solid.",
    "pronunciation differs."
  ],
  [
    "reporting-verb-relative-conditional-axes",
    "axes plural of axis; also plural of axe.",
    "The axes are aligned.",
    "ambiguity."
  ],
  [
    "reporting-verb-relative-conditional-matrices",
    "matrices/matrixes plural.",
    "The matrices are sparse.",
    "domain."
  ],
  [
    "reporting-verb-relative-conditional-radii",
    "radii/radiuses plural.",
    "The radii are equal.",
    "domain."
  ],
  [
    "reporting-verb-relative-conditional-alumni",
    "alumni plural; alumnus singular.",
    "The alumni are meeting.",
    "gendered forms and modern usage."
  ],
  [
    "reporting-verb-relative-conditional-millennium",
    "millennia/millenniums plural.",
    "Two millennia have passed.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-medium",
    "media plural of medium; mediums accepted in some senses.",
    "The media are influential.",
    "meaning."
  ],
  [
    "reporting-verb-relative-conditional-automata",
    "automata plural of automaton.",
    "The automata are tested.",
    "technical."
  ],
  [
    "reporting-verb-relative-conditional-focus",
    "foci/focuses plural.",
    "The focuses are different.",
    "domain."
  ],
  [
    "reporting-verb-relative-conditional-cactus",
    "cacti/cactuses plural.",
    "Cacti grow slowly.",
    "both accepted."
  ],
  [
    "reporting-verb-relative-conditional-syllabi",
    "syllabi/syllabuses plural.",
    "The syllabi differ.",
    "both accepted."
  ],
  [
    "reporting-verb-relative-conditional-status",
    "statuses plural.",
    "Their statuses changed.",
    "status ends s in singular."
  ],
  [
    "reporting-verb-relative-conditional-memorandum",
    "memoranda/memorandums plural.",
    "The memoranda were filed.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-indexes",
    "indexes common general plural; indices specialized.",
    "Book indexes; stock indices.",
    "register."
  ],
  [
    "reporting-verb-relative-conditional-formulae",
    "formulae common scientific; formulas general.",
    "The formulae are listed.",
    "style."
  ],
  [
    "reporting-verb-relative-conditional-appendixes",
    "appendixes common general; appendices formal.",
    "The appendixes are attached.",
    "style."
  ]
];
export const ENGLISH_GRAMMAR_EXPERT = rows.map(([topic,rule,example,exception],i)=>({id:"X"+String(i+1).padStart(3,"0"),topic,rule,example,exception,level:"C1-C2",domain:topic.split("-")[0]}));
export function runExpertEnglishGrammarSelfTest(){
 const ids=new Set(ENGLISH_GRAMMAR_EXPERT.map(x=>x.id));
 const topics=new Set(ENGLISH_GRAMMAR_EXPERT.map(x=>x.topic));
 const invalid=ENGLISH_GRAMMAR_EXPERT.filter(x=>!x.topic||!x.rule||!x.example||!x.exception||!x.level);
 const domains=new Set(ENGLISH_GRAMMAR_EXPERT.map(x=>x.domain));
 return {version:ENGLISH_GRAMMAR_EXPERT_VERSION,total:ENGLISH_GRAMMAR_EXPERT.length,unique_ids:ids.size,unique_topics:topics.size,domains:[...domains],invalid:invalid.length,passed:ids.size===rows.length&&topics.size===rows.length&&invalid.length===0,scope:"Dataset integrity only; expert competence requires external corpus-based testing and adaptive learner assessment."};
}
