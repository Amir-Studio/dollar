import { ENGLISH_GRAMMAR_ADVANCED, runAdvancedEnglishGrammarSelfTest } from "./english-grammar-advanced.js";
import { getChineseNewsVocabulary } from "./news-vocabulary-zh.js";
export const ENGLISH_NEWS_VOCABULARY_VERSION="en-news-vocabulary-1.0.0";
export const ENGLISH_NEWS_VOCABULARY_TARGET=500;
const seen=new Set();
export const ENGLISH_NEWS_VOCABULARY=getChineseNewsVocabulary({limit:1000}).items.filter(x=>{const k=String(x.english||"").trim().toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,500).map((x,i)=>({id:"en"+String(i+1).padStart(3,"0"),category:x.category,term:x.english,meaning_fa:x.fa,language:"en",status:"curriculum"}));
const R=[
["articles","اسم مفرد شمارش‌پذیر معمولاً به a/an/the نیاز دارد.","A minister made a statement.","اسم جمع و غیرقابل‌شمارش معمولاً a/an نمی‌گیرند."],
["a-an","a/an بر اساس صدا انتخاب می‌شود، نه حرف اول.","a university; an hour; an FBI agent","university صدای /j/ دارد؛ h در hour بی‌صداست؛ FBI با نام حروف خوانده می‌شود."],
["plural","بیشتر اسم‌ها s و پایان‌های s/x/ch/sh معمولاً es می‌گیرند.","market/markets; tax/taxes","child/children, person/people, mouse/mice بی‌قاعده‌اند."],
["y-plural","همخوان+y به ies؛ واکه+y فقط s می‌گیرد.","policy/policies; day/days","boy/boys و key/keys استثناهای رایج‌اند."],
["f-plural","برخی f/fe ها به ves تبدیل می‌شوند.","leaf/leaves; knife/knives","roof/roofs, chief/chiefs, belief/beliefs."],
["countability","many/few برای شمارش‌پذیر؛ much/little برای غیرقابل‌شمارش.","many reports; much information","news, advice, information, equipment معمولاً غیرقابل‌شمارش‌اند."],
["third-person","حال ساده برای سوم‌شخص مفرد معمولاً s می‌گیرد.","The bank raises rates.","have→has؛ do→does؛ be→is."],
["do-support","سؤال و منفی با do/does/did ساخته می‌شود.","Did prices rise?","پس از did فعل ساده است: did go نه did went."],
["continuous","am/is/are + ing برای عمل در جریان است.","Oil prices are rising.","know, believe, own معمولاً استمراری نمی‌شوند."],
["past","گذشته با ed یا شکل بی‌قاعده ساخته می‌شود.","announced; went; rose","go/went, rise/rose, make/made."],
["ed-sound","ed سه صدای /t/، /d/، /ɪd/ دارد.","asked; announced; wanted","تلفظ به صدای پایانی فعل بستگی دارد."],
["present-perfect","have/has + شکل سوم برای نتیجه مرتبط با اکنون.","The bank has changed its outlook.","با yesterday معمولاً past simple می‌آید."],
["past-perfect","had + شکل سوم برای عمل پیش از نقطه‌ای در گذشته.","The currency had weakened.","پس از had شکل سوم، نه گذشته ساده."],
["future","will + فعل ساده؛ going to برای قصد/نشانه.","The bank will respond.","will rises غلط است؛ will rise درست است."],
["passive","مجهول با be + شکل سوم ساخته می‌شود.","The sanctions were announced.","زمان روی be تغییر می‌کند."],
["modals","پس از can/may/must/should فعل ساده می‌آید.","Policy may affect trade.","ought to و have to ساختار جدا دارند."],
["agreement","فعل با هسته فاعل هماهنگ می‌شود.","The impact of rates is uncertain.","news مفرد؛ police معمولاً جمع."],
["comparative","صفت کوتاه er و صفت بلند more می‌گیرد.","higher; more volatile","good/better؛ bad/worse."],
["superlative","صفت کوتاه est و صفت بلند most می‌گیرد.","highest; most significant","good/best؛ bad/worst."],
["adverbs","بسیاری از قیدها ly می‌گیرند.","sharply; rapidly","fast, hard, late قیدند؛ hardly معنی متفاوت دارد."],
["prepositions","حرف اضافه را همراه ترکیب حفظ کن.","depend on; result in; result from","result in با result from فرق معنایی دارد."],
["gerund-infinitive","بعضی افعال ing و بعضی to+verb می‌گیرند.","avoid raising; decide to intervene","stop doing ≠ stop to do."],
["conditionals","شرطی اول: if+حال، will+فعل.","If prices rise, demand may fall.","در شرط واقعی آینده پس از if معمولاً will نمی‌آید."],
["relative","who برای انسان، which برای چیز، that برای بند محدودکننده.","The policy that changed markets...","در بند توضیحیِ ویرگولی that نمی‌آید."],
["false-friends","معنی واژه را از بافت تشخیص بده.","economic=اقتصادی; economical=مقرون‌به‌صرفه","eventually=سرانجام، نه احتمالاً."],
["capitalization","کشورها، ملیت‌ها، زبان‌ها، روزها و ماه‌ها بزرگ‌نویسی می‌شوند.","Iranian; English; Monday","فصل‌ها معمولاً کوچک نوشته می‌شوند."]
];
export const ENGLISH_GRAMMAR_RULES=R.map(([topic,rule,example,exception],i)=>({id:"G"+String(i+1).padStart(2,"0"),topic,rule,example,exception}));
export const ENGLISH_IRREGULAR_VERBS=[
["be","was/were","been"],["become","became","become"],["begin","began","begun"],["break","broke","broken"],["bring","brought","brought"],["build","built","built"],["buy","bought","bought"],["catch","caught","caught"],["choose","chose","chosen"],["come","came","come"],["do","did","done"],["draw","drew","drawn"],["drink","drank","drunk"],["drive","drove","driven"],["eat","ate","eaten"],["fall","fell","fallen"],["feel","felt","felt"],["find","found","found"],["forget","forgot","forgotten"],["get","got","got/gotten"],["give","gave","given"],["go","went","gone"],["grow","grew","grown"],["have","had","had"],["hear","heard","heard"],["keep","kept","kept"],["know","knew","known"],["lead","led","led"],["leave","left","left"],["lose","lost","lost"],["make","made","made"],["mean","meant","meant"],["meet","met","met"],["pay","paid","paid"],["put","put","put"],["read","read","read"],["rise","rose","risen"],["run","ran","run"],["say","said","said"],["see","saw","seen"],["sell","sold","sold"],["send","sent","sent"],["set","set","set"],["show","showed","shown"],["speak","spoke","spoken"],["spend","spent","spent"],["take","took","taken"],["teach","taught","taught"],["think","thought","thought"],["write","wrote","written"]
].map(([base,past,participle])=>({base,past,participle}));
export const ENGLISH_IRREGULAR_PLURALS=[
["man","men"],["woman","women"],["child","children"],["person","people"],["tooth","teeth"],["foot","feet"],["mouse","mice"],["goose","geese"],["analysis","analyses"],["crisis","crises"],["basis","bases"],["thesis","theses"],["phenomenon","phenomena"],["criterion","criteria"],["datum","data"],["index","indexes/indices"],["sheep","sheep"],["deer","deer"],["series","series"],["species","species"]
].map(([singular,plural])=>({singular,plural}));
export function getEnglishNewsVocabulary({category=null,query=null,limit=500}={}){const q=String(query||"").toLowerCase();const items=ENGLISH_NEWS_VOCABULARY.filter(x=>(!category||x.category===category)&&(!q||(x.term+" "+x.meaning_fa+" "+x.category).toLowerCase().includes(q))).slice(0,Math.max(1,Math.min(500,Number(limit)||500)));return{version:ENGLISH_NEWS_VOCABULARY_VERSION,language:"en",target_total:500,current_total:ENGLISH_NEWS_VOCABULARY.length,categories:[...new Set(ENGLISH_NEWS_VOCABULARY.map(x=>x.category))],items,grammar:{rules:[...ENGLISH_GRAMMAR_RULES,...ENGLISH_GRAMMAR_ADVANCED],advanced_self_test:runAdvancedEnglishGrammarSelfTest(),irregular_verbs:ENGLISH_IRREGULAR_VERBS,irregular_plurals:ENGLISH_IRREGULAR_PLURALS}};}
export function runEnglishNewsVocabularySelfTest(){const ids=new Set(ENGLISH_NEWS_VOCABULARY.map(x=>x.id));const terms=new Set(ENGLISH_NEWS_VOCABULARY.map(x=>x.term.toLowerCase()));const invalid=ENGLISH_NEWS_VOCABULARY.filter(x=>!x.term||!x.meaning_fa||!x.category);return{total:ENGLISH_NEWS_VOCABULARY.length,unique_ids:ids.size,unique_terms:terms.size,grammar_rules:ENGLISH_GRAMMAR_RULES.length+ENGLISH_GRAMMAR_ADVANCED.length,irregular_verbs:ENGLISH_IRREGULAR_VERBS.length,irregular_plurals:ENGLISH_IRREGULAR_PLURALS.length,passed:ENGLISH_NEWS_VOCABULARY.length===500&&ids.size===500&&terms.size===500&&!invalid.length&&ENGLISH_GRAMMAR_RULES.length+ENGLISH_GRAMMAR_ADVANCED.length===100&&ENGLISH_IRREGULAR_VERBS.length>=50&&ENGLISH_IRREGULAR_PLURALS.length>=20,scope:"Curriculum integrity only; not proof of learner mastery."};}
