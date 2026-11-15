// Curated Chinese-language news vocabulary, batch 1/9 (120 of 1,000 target concepts).
// Each row: [id, category, English concept, Simplified Chinese, pinyin, Persian meaning].
// Entries are specialist news terms, not everyday vocabulary.
export const CHINESE_NEWS_VOCABULARY_VERSION = "zh-news-vocabulary-1.3.0";
const CHINESE_NEWS_VOCABULARY_BATCH_1 = [
["zh001","macroeconomics","consumer price index","居民消费价格指数","jūmín xiāofèi jiàgé zhǐshù","شاخص قیمت مصرف‌کننده"],
["zh002","macroeconomics","producer price index","工业生产者出厂价格指数","gōngyè shēngchǎnzhě chūchǎng jiàgé zhǐshù","شاخص قیمت تولیدکننده"],
["zh003","macroeconomics","core inflation","核心通货膨胀","héxīn tōnghuò péngzhàng","تورم هسته"],
["zh004","macroeconomics","headline inflation","总体通货膨胀","zǒngtǐ tōnghuò péngzhàng","تورم کل"],
["zh005","macroeconomics","inflation expectations","通胀预期","tōngzhàng yùqī","انتظارات تورمی"],
["zh006","macroeconomics","economic growth rate","经济增长率","jīngjì zēngzhǎng lǜ","نرخ رشد اقتصادی"],
["zh007","macroeconomics","quarter-on-quarter growth","环比增长","huánbǐ zēngzhǎng","رشد نسبت به فصل/دوره قبل"],
["zh008","macroeconomics","year-on-year growth","同比增长","tóngbǐ zēngzhǎng","رشد سالانه نسبت به دوره مشابه"],
["zh009","macroeconomics","economic slowdown","经济放缓","jīngjì fànghuǎn","کاهش سرعت رشد اقتصادی"],
["zh010","macroeconomics","soft landing","软着陆","ruǎn zhuólù","فرود نرم اقتصاد"],
["zh011","macroeconomics","hard landing","硬着陆","yìng zhuólù","فرود سخت اقتصاد"],
["zh012","macroeconomics","stagflation","滞胀","zhìzhàng","رکود تورمی"],
["zh013","macroeconomics","output gap","产出缺口","chǎnchū quēkǒu","شکاف تولید"],
["zh014","macroeconomics","potential output","潜在产出","qiánzài chǎnchū","تولید بالقوه"],
["zh015","macroeconomics","business cycle","经济周期","jīngjì zhōuqī","چرخه اقتصادی"],
["zh016","macroeconomics","leading economic indicator","先行经济指标","xiānxíng jīngjì zhǐbiāo","شاخص پیش‌نگر اقتصادی"],
["zh017","macroeconomics","coincident indicator","同步指标","tóngbù zhǐbiāo","شاخص هم‌زمان"],
["zh018","macroeconomics","lagging indicator","滞后指标","zhìhòu zhǐbiāo","شاخص پس‌نگر"],
["zh019","macroeconomics","industrial production","工业生产","gōngyè shēngchǎn","تولید صنعتی"],
["zh020","macroeconomics","capacity utilization","产能利用率","chǎnnéng lìyòng lǜ","نرخ بهره‌برداری از ظرفیت"],
["zh021","central_banking","reserve requirement ratio","存款准备金率","cúnkuǎn zhǔnbèi jīn lǜ","نرخ سپرده قانونی"],
["zh022","central_banking","open market operations","公开市场操作","gōngkāi shìchǎng cāozuò","عملیات بازار باز"],
["zh023","central_banking","quantitative easing","量化宽松","liànghuà kuānsōng","تسهیل کمی"],
["zh024","central_banking","quantitative tightening","量化紧缩","liànghuà jǐnsuō","انقباض کمی"],
["zh025","central_banking","forward guidance","前瞻性指引","qiánzhānxìng zhǐyǐn","راهنمایی آینده‌نگر بانک مرکزی"],
["zh026","central_banking","emergency liquidity facility","紧急流动性支持工具","jǐnjí liúdòngxìng zhīchí gōngjù","تسهیلات اضطراری نقدینگی"],
["zh027","central_banking","lender of last resort","最后贷款人","zuìhòu dàikuǎn rén","وام‌دهنده نهایی"],
["zh028","central_banking","monetary transmission mechanism","货币政策传导机制","huòbì zhèngcè chuándǎo jīzhì","سازوکار انتقال سیاست پولی"],
["zh029","central_banking","policy normalization","货币政策正常化","huòbì zhèngcè zhèngchánghuà","عادی‌سازی سیاست پولی"],
["zh030","central_banking","policy divergence","货币政策分化","huòbì zhèngcè fēnhuà","واگرایی سیاست‌های پولی"],
["zh031","markets","market capitalization","市值","shìzhí","ارزش بازار"],
["zh032","markets","price-to-earnings ratio","市盈率","shìyínglǜ","نسبت قیمت به سود"],
["zh033","markets","earnings per share","每股收益","měi gǔ shōuyì","سود هر سهم"],
["zh034","markets","initial public offering","首次公开募股","shǒucì gōngkāi mùgǔ","عرضه اولیه سهام"],
["zh035","markets","secondary market","二级市场","èrjí shìchǎng","بازار ثانویه"],
["zh036","markets","short selling","卖空","màikōng","فروش استقراضی"],
["zh037","markets","margin call","追加保证金通知","zhuījiā bǎozhèngjīn tōngzhī","اخطار افزایش وجه تضمین"],
["zh038","markets","circuit breaker","熔断机制","róngduàn jīzhì","سازوکار توقف معاملات"],
["zh039","markets","market correction","市场回调","shìchǎng huítiáo","اصلاح بازار"],
["zh040","markets","bear market","熊市","xióngshì","بازار نزولی"],
["zh041","markets","bull market","牛市","niúshì","بازار صعودی"],
["zh042","markets","market sentiment","市场情绪","shìchǎng qíngxù","احساسات و جو بازار"],
["zh043","markets","capital outflow","资本外流","zīběn wàiliú","خروج سرمایه"],
["zh044","markets","capital inflow","资本流入","zīběn liúrù","ورود سرمایه"],
["zh045","markets","portfolio rebalancing","投资组合再平衡","tóuzī zǔhé zài pínghéng","بازمتعادل‌سازی سبد سرمایه‌گذاری"],
["zh046","markets","asset allocation","资产配置","zīchǎn pèizhì","تخصیص دارایی"],
["zh047","markets","systemic risk","系统性风险","xìtǒngxìng fēngxiǎn","ریسک سیستمی"],
["zh048","markets","contagion effect","传染效应","chuánrǎn xiàoyìng","اثر سرایت بحران"],
["zh049","markets","credit spread","信用利差","xìnyòng lìchā","فاصله بازده اعتباری"],
["zh050","markets","yield curve inversion","收益率曲线倒挂","shōuyìlǜ qūxiàn dàoguà","معکوس‌شدن منحنی بازده"],
["zh051","banking","non-performing loan","不良贷款","bùliáng dàikuǎn","وام غیرجاری"],
["zh052","banking","capital adequacy ratio","资本充足率","zīběn chōngzú lǜ","نسبت کفایت سرمایه"],
["zh053","banking","bank run","银行挤兑","yínháng jǐduì","هجوم سپرده‌گذاران برای برداشت"],
["zh054","banking","deposit insurance","存款保险","cúnkuǎn bǎoxiǎn","بیمه سپرده"],
["zh055","banking","stress test","压力测试","yālì cèshì","آزمون تنش"],
["zh056","banking","bad bank","坏账银行","huàizhàng yínháng","بانک مدیریت دارایی‌های مشکل‌دار"],
["zh057","banking","shadow banking","影子银行","yǐngzi yínháng","بانکداری سایه"],
["zh058","banking","interbank market","银行间市场","yínháng jiān shìchǎng","بازار بین‌بانکی"],
["zh059","banking","loan-to-deposit ratio","存贷比","cúndài bǐ","نسبت تسهیلات به سپرده‌ها"],
["zh060","banking","debt restructuring","债务重组","zhàiwù chóngzǔ","تجدید ساختار بدهی"],
["zh061","trade","current account balance","经常账户余额","jīngcháng zhànghù yú'é","تراز حساب جاری"],
["zh062","trade","capital account","资本账户","zīběn zhànghù","حساب سرمایه"],
["zh063","trade","balance of payments","国际收支","guójì shōuzhī","تراز پرداخت‌های خارجی"],
["zh064","trade","trade surplus","贸易顺差","màoyì shùnchā","مازاد تجاری"],
["zh065","trade","trade deficit","贸易逆差","màoyì nìchā","کسری تجاری"],
["zh066","trade","tariff barrier","关税壁垒","guānshuì bìlěi","مانع تعرفه‌ای"],
["zh067","trade","non-tariff barrier","非关税壁垒","fēi guānshuì bìlěi","مانع غیرتعرفه‌ای"],
["zh068","trade","dumping","倾销","qīngxiāo","دامپینگ؛ فروش زیر قیمت متعارف"],
["zh069","trade","anti-dumping duty","反倾销税","fǎn qīngxiāo shuì","عوارض ضددامپینگ"],
["zh070","trade","trade facilitation","贸易便利化","màoyì biànlìhuà","تسهیل تجارت"],
["zh071","energy","strategic petroleum reserve","战略石油储备","zhànlüè shíyóu chǔbèi","ذخایر راهبردی نفت"],
["zh072","energy","production quota","产量配额","chǎnliàng pèi'é","سهمیه تولید"],
["zh073","energy","spare production capacity","闲置产能","xiánzhì chǎnnéng","ظرفیت مازاد آماده تولید"],
["zh074","energy","benchmark crude","基准原油","jīzhǔn yuányóu","نفت خام شاخص"],
["zh075","energy","oil futures","原油期货","yuányóu qīhuò","قراردادهای آتی نفت"],
["zh076","energy","liquefied natural gas","液化天然气","yèhuà tiānránqì","گاز طبیعی مایع"],
["zh077","energy","pipeline transit","管道运输","guǎndào yùnshū","انتقال از طریق خط لوله"],
["zh078","energy","refining margin","炼油利润率","liànyóu lìrùnlǜ","حاشیه سود پالایش"],
["zh079","energy","energy price cap","能源价格上限","néngyuán jiàgé shàngxiàn","سقف قیمت انرژی"],
["zh080","energy","electricity grid","电力电网","diànlì diànwǎng","شبکه برق"],
["zh081","politics","coalition government","联合政府","liánhé zhèngfǔ","دولت ائتلافی"],
["zh082","politics","snap election","提前选举","tíqián xuǎnjǔ","انتخابات زودهنگام"],
["zh083","politics","vote of no confidence","不信任投票","bù xìnrèn tóupiào","رأی عدم اعتماد"],
["zh084","politics","legislative deadlock","立法僵局","lìfǎ jiāngjú","بن‌بست قانون‌گذاری"],
["zh085","politics","constitutional court","宪法法院","xiànfǎ fǎyuàn","دادگاه قانون اساسی"],
["zh086","politics","executive order","行政命令","xíngzhèng mìnglìng","فرمان اجرایی"],
["zh087","politics","political legitimacy","政治合法性","zhèngzhì héfǎxìng","مشروعیت سیاسی"],
["zh088","politics","public approval rating","公众支持率","gōngzhòng zhīchílǜ","میزان حمایت عمومی"],
["zh089","politics","opposition bloc","反对派阵营","fǎnduìpài zhènyíng","ائتلاف/جبهه مخالفان"],
["zh090","politics","power transition","权力交接","quánlì jiāojiē","انتقال قدرت"],
["zh091","diplomacy","bilateral summit","双边峰会","shuāngbiān fēnghuì","نشست عالی دوجانبه"],
["zh092","diplomacy","multilateral negotiations","多边谈判","duōbiān tánpàn","مذاکرات چندجانبه"],
["zh093","diplomacy","joint communiqué","联合公报","liánhé gōngbào","بیانیه مشترک"],
["zh094","diplomacy","diplomatic channel","外交渠道","wàijiāo qúdào","کانال دیپلماتیک"],
["zh095","diplomacy","back-channel talks","幕后渠道谈判","mùhòu qúdào tánpàn","مذاکرات پشت‌پرده"],
["zh096","diplomacy","confidence-building measures","建立信任措施","jiànlì xìnrèn cuòshī","اقدامات اعتمادساز"],
["zh097","diplomacy","strategic partnership","战略伙伴关系","zhànlüè huǒbàn guānxì","مشارکت راهبردی"],
["zh098","diplomacy","non-aggression pact","互不侵犯条约","hùbù qīnfàn tiáoyuē","پیمان عدم تجاوز"],
["zh099","diplomacy","diplomatic recognition","外交承认","wàijiāo chéngrèn","به‌رسمیت‌شناختن دیپلماتیک"],
["zh100","diplomacy","consular relations","领事关系","lǐngshì guānxì","روابط کنسولی"],
["zh101","sanctions","secondary sanctions","次级制裁","cìjí zhìcái","تحریم‌های ثانویه"],
["zh102","sanctions","sanctions relief","制裁减免","zhìcái jiǎnmiǎn","کاهش یا لغو بخشی از تحریم‌ها"],
["zh103","sanctions","sanctions evasion","规避制裁","guībì zhìcái","دور زدن تحریم‌ها"],
["zh104","sanctions","asset freeze","资产冻结","zīchǎn dòngjié","مسدودسازی دارایی‌ها"],
["zh105","sanctions","export controls","出口管制","chūkǒu guǎnzhì","کنترل صادرات"],
["zh106","sanctions","financial restrictions","金融限制","jīnróng xiànzhì","محدودیت‌های مالی"],
["zh107","sanctions","trade embargo","贸易禁运","màoyì jìnyùn","ممنوعیت تجاری"],
["zh108","sanctions","humanitarian exemption","人道主义豁免","réndào zhǔyì huòmiǎn","معافیت بشردوستانه"],
["zh109","geopolitics","sphere of influence","势力范围","shìlì fànwéi","حوزه نفوذ"],
["zh110","geopolitics","strategic autonomy","战略自主","zhànlüè zìzhǔ","خودمختاری راهبردی"],
["zh111","geopolitics","great-power competition","大国竞争","dàguó jìngzhēng","رقابت قدرت‌های بزرگ"],
["zh112","geopolitics","geopolitical tension","地缘政治紧张局势","dìyuán zhèngzhì jǐnzhāng júshì","تنش ژئوپلیتیکی"],
["zh113","geopolitics","strategic ambiguity","战略模糊","zhànlüè móhu","ابهام راهبردی"],
["zh114","geopolitics","deterrence","威慑","wēishè","بازدارندگی"],
["zh115","geopolitics","security guarantee","安全保障","ānquán bǎozhàng","تضمین امنیتی"],
["zh116","conflict_security","ceasefire agreement","停火协议","tínghuǒ xiéyì","توافق آتش‌بس"],
["zh117","conflict_security","peacekeeping mission","维和任务","wéihé rènwù","مأموریت حفظ صلح"],
["zh118","conflict_security","cross-border attack","跨境袭击","kuàjìng xíjí","حمله فرامرزی"],
["zh119","conflict_security","military mobilization","军事动员","jūnshì dòngyuán","بسیج نظامی"],
["zh120","conflict_security","arms control","军备控制","jūnbèi kòngzhì","کنترل تسلیحات"]
];

export const CHINESE_NEWS_VOCABULARY = [...CHINESE_NEWS_VOCABULARY_BATCH_1, ...CHINESE_NEWS_VOCABULARY_BATCH_2];

const ids = new Set();
const terms = new Set();
for (const row of CHINESE_NEWS_VOCABULARY) {
  if (row.length !== 6 || ids.has(row[0]) || terms.has(row[3]) || !row[4] || !row[5]) {
    throw new Error("Invalid or duplicate Chinese news vocabulary row: " + row[0]);
  }
  ids.add(row[0]);
  terms.add(row[3]);
}
export function getChineseNewsVocabulary({category=null, query=null, limit=1000}={}) {
  const q=String(query||"").trim().toLocaleLowerCase();
  const items=CHINESE_NEWS_VOCABULARY.filter(row=>
    (!category || row[1]===category) &&
    (!q || row.join(" ").toLocaleLowerCase().includes(q))
  ).slice(0,Math.max(1,Math.min(1000,Number(limit)||1000)));
  return {
    version:CHINESE_NEWS_VOCABULARY_VERSION,
    language:"zh",
    script:"Simplified Chinese",
    batch:2,
    batch_size:100,
    target_total:1000,
    previously_covered_concepts:120,
    current_batch_new:CHINESE_NEWS_VOCABULARY.length,
    current_total:CHINESE_NEWS_VOCABULARY.length,
    coverage_pct:CHINESE_NEWS_VOCABULARY.length/10,
    categories:[...new Set(CHINESE_NEWS_VOCABULARY.map(x=>x[1]))],
    items:items.map(([id,category,english,zh,pinyin,fa])=>({id,category,english,zh,pinyin,fa}))
  };
}
export function runChineseNewsVocabularySelfTest() {
  const ids=new Set(CHINESE_NEWS_VOCABULARY.map(x=>x[0]));
  const terms=new Set(CHINESE_NEWS_VOCABULARY.map(x=>x[3]));
  const categories=new Set(CHINESE_NEWS_VOCABULARY.map(x=>x[1]));
  const invalid=CHINESE_NEWS_VOCABULARY.filter(x=>x.length!==6||!x[2]||!x[3]||!x[4]||!x[5]);
  return {
    total:CHINESE_NEWS_VOCABULARY.length,
    passed:invalid.length===0&&ids.size===CHINESE_NEWS_VOCABULARY.length&&terms.size===CHINESE_NEWS_VOCABULARY.length&&categories.size>=8,
    unique_ids:ids.size,unique_chinese_terms:terms.size,category_count:categories.size,
    batch_2:runChineseVocabularyBatch2SelfTest(),
    scope:"Structural and deduplication checks only; translations and pinyin require native-speaker review before high-stakes use."
  };
}
