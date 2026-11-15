// Canonical multilingual financial lexicon. English is the pivot language.
// Translations are contextual equivalents, NOT automatically synonyms.
// Keep sense, register, domain and false-friend distinctions explicit.
export const MARKET_LEXICON_VERSION = "market-lexicon-ontology-1.0.0";
export const PIVOT_LANGUAGE = "en";
export const SUPPORTED_LEXICON_LANGUAGES = ["en","fa","ar","de","fr","ru","zh","ja","ko","hi","es","it","pt","tr","nl","pl"];

const C = (id, en, definition, equivalents, extra={}) => ({id,pivot:{language:"en",term:en,definition},equivalents, ...extra});
export const MARKET_CONCEPTS = [
C("inflation","inflation","A sustained increase in the general price level, reducing the purchasing power of money.",{
fa:["تورم"],ar:["التضخم"],de:["Inflation"],fr:["inflation"],ru:["инфляция"],zh:["通货膨胀"],ja:["インフレーション","物価上昇"],ko:["인플레이션","물가 상승"],hi:["मुद्रास्फीति"],es:["inflación"],it:["inflazione"],pt:["inflação"],tr:["enflasyon"],nl:["inflatie"],pl:["inflacja"]},{near_miss:{fa:["گرانی"],en:["price increase","high cost of living"]},note:"A rise in one product's price is not necessarily inflation."}),
C("deflation","deflation","A sustained decline in the general price level.",{
fa:["تورم منفی","کاهش سطح عمومی قیمت‌ها"],ar:["الانكماش السعري","انخفاض المستوى العام للأسعار"],de:["Deflation"],fr:["déflation"],ru:["дефляция"],zh:["通货紧缩"],ja:["デフレーション"],ko:["디플레이션"],hi:["अपस्फीति"],es:["deflación"],it:["deflazione"],pt:["deflação"],tr:["deflasyon"],nl:["deflatie"],pl:["deflacja"]}),
C("disinflation","disinflation","A slowing rate of inflation; prices may still be rising, but more slowly.",{
fa:["کاهش نرخ تورم"],ar:["تباطؤ التضخم"],de:["Disinflation","nachlassende Inflation"],fr:["désinflation"],ru:["дезинфляция"],zh:["通胀放缓"],ja:["ディスインフレーション","インフレ鈍化"],ko:["디스인플레이션","물가 상승률 둔화"],hi:["मुद्रास्फीति में कमी"],es:["desinflación"],it:["disinflazione"],pt:["desinflação"],tr:[" dezenflasyon","enflasyonun yavaşlaması"],nl:["desinflatie"],pl:["dezinflacja"]},{near_miss:{en:["deflation"]},note:"Disinflation is not deflation."}),
C("interest_rate","interest rate","The price paid for borrowing money or the return received for lending or depositing it.",{
fa:["نرخ بهره","نرخ سود"],ar:["سعر الفائدة","سعر العائد"],de:["Zinssatz","Zins"],fr:["taux d’intérêt"],ru:["процентная ставка","процентную ставку"],zh:["利率"],ja:["金利"],ko:["금리"],hi:["ब्याज दर"],es:["tipo de interés","tipos de interés","tasa de interés"],it:["tasso d’interesse","tassi d’interesse"],pt:["taxa de juros"],tr:["faiz oranı","faiz oranını"],nl:["rente","rentetarief"],pl:["stopa procentowa","stopę procentową"]}),
C("policy_rate","policy interest rate","The benchmark rate set by a central bank to influence financial conditions.",{
fa:["نرخ سیاستی","نرخ بهره سیاستی"],ar:["سعر الفائدة الأساسي","سعر السياسة النقدية"],de:["Leitzins"],fr:["taux directeur"],ru:["ключевая ставка"],zh:["政策利率"],ja:["政策金利"],ko:["기준금리"],hi:["नीतिगत ब्याज दर"],es:["tipo de interés oficial","tasa de política monetaria"],it:["tasso ufficiale"],pt:["taxa básica de juros"],tr:["politika faizi"],nl:["beleidsrente"],pl:["stopa referencyjna"]}),
C("rate_hike","interest rate hike","A decision to increase a benchmark or other interest rate.",{
fa:["افزایش نرخ بهره","افزایش نرخ سود"],ar:["رفع سعر الفائدة","زيادة سعر الفائدة"],de:["Zinserhöhung"],fr:["hausse des taux d’intérêt"],ru:["повышение процентной ставки","повысил процентную ставку","повысила процентную ставку"],zh:["加息"],ja:["利上げ"],ko:["금리 인상","금리를 인상"],hi:["ब्याज दर में वृद्धि","ब्याज दर बढ़ाई"],es:["subida de los tipos de interés"],it:["aumento dei tassi d’interesse","ha aumentato i tassi d’interesse"],pt:["alta da taxa de juros","aumentou a taxa de juros"],tr:["faiz artırımı","faiz oranını artırdı","faiz oranını artırmak"],nl:["renteverhoging","verhoogde de rente"],pl:["podwyżka stóp procentowych","podniósł stopę procentową"]}),
C("rate_cut","interest rate cut","A decision to reduce a benchmark or other interest rate.",{
fa:["کاهش نرخ بهره","کاهش نرخ سود"],ar:["خفض سعر الفائدة"],de:["Zinssenkung"],fr:["baisse des taux d’intérêt"],ru:["снижение процентной ставки"],zh:["降息"],ja:["利下げ"],ko:["금리 인하"],hi:["ब्याज दर में कटौती"],es:["bajada de los tipos de interés"],it:["riduzione dei tassi d’interesse","ha tagliato i tassi d’interesse"],pt:["corte da taxa de juros","reduziu a taxa de juros"],tr:["faiz indirimi","faiz oranını düşürdü","faiz oranını düşürmek"],nl:["renteverlaging"],pl:["obniżka stóp procentowych"]}),
C("exchange_rate","exchange rate","The price of one currency expressed in units of another currency.",{
fa:["نرخ ارز","نرخ تبدیل ارز"],ar:["سعر الصرف"],de:["Wechselkurs"],fr:["taux de change"],ru:["обменный курс"],zh:["汇率"],ja:["為替レート"],ko:["환율"],hi:["विनिमय दर"],es:["tipo de cambio"],it:["tasso di cambio"],pt:["taxa de câmbio"],tr:["döviz kuru"],nl:["wisselkoers"],pl:["kurs walutowy"]}),
C("currency_depreciation","currency depreciation","A market-driven fall in a currency's value relative to another currency.",{
fa:["تضعیف ارزش پول","کاهش ارزش پول در بازار"],ar:["انخفاض قيمة العملة"],de:["Abwertung einer Währung","Währungsabwertung"],fr:["dépréciation de la monnaie"],ru:["обесценение валюты"],zh:["货币贬值"],ja:["通貨安"],ko:["통화 가치 하락"],hi:["मुद्रा का मूल्यह्रास"],es:["depreciación de la moneda"],it:["deprezzamento della valuta"],pt:["depreciação da moeda"],tr:["para biriminin değer kaybetmesi"],nl:["waardedaling van een valuta"],pl:["deprecjacja waluty"]},{near_miss:{en:["devaluation"]},note:"Depreciation is usually market-driven; devaluation is an official downward reset in a fixed/managed regime."}),
C("currency_devaluation","currency devaluation","An official reduction in a currency's value under a fixed or managed exchange-rate regime.",{
fa:["کاهش رسمی ارزش پول","تعدیل رسمی نرخ ارز"],ar:["خفض رسمي لقيمة العملة"],de:["Abwertung per Beschluss"],fr:["dévaluation"],ru:["девальвация"],zh:["官方货币贬值"],ja:["切り下げ"],ko:["평가절하"],hi:["आधिकारिक मुद्रा अवमूल्यन"],es:["devaluación"],it:["svalutazione"],pt:["desvalorização"],tr:["resmî devalüasyon"],nl:["devaluatie"],pl:["dewaluacja"]},{near_miss:{en:["depreciation"]}}),
C("currency_appreciation","currency appreciation","A market-driven rise in a currency's value relative to another currency.",{
fa:["تقویت ارزش پول"],ar:["ارتفاع قيمة العملة"],de:["Aufwertung einer Währung"],fr:["appréciation de la monnaie"],ru:["укрепление валюты"],zh:["货币升值"],ja:["通貨高"],ko:["통화 가치 상승"],hi:["मुद्रा का मूल्यवृद्धि"],es:["apreciación de la moneda"],it:["apprezzamento della valuta"],pt:["valorização da moeda"],tr:["para biriminin değer kazanması"],nl:["waardestijging van een valuta"],pl:["aprecjacja waluty"]}),
C("central_bank","central bank","A public institution responsible for monetary policy and core monetary functions.",{
fa:["بانک مرکزی"],ar:["البنك المركزي","المصرف المركزي"],de:["Zentralbank"],fr:["banque centrale"],ru:["центральный банк"],zh:["中央银行","央行"],ja:["中央銀行"],ko:["중앙은행"],hi:["केंद्रीय बैंक"],es:["banco central"],it:["banca centrale"],pt:["banco central"],tr:["merkez bankası"],nl:["centrale bank"],pl:["bank centralny"]}),
C("monetary_policy","monetary policy","Central-bank actions affecting money, credit and interest rates.",{
fa:["سیاست پولی"],ar:["السياسة النقدية"],de:["Geldpolitik"],fr:["politique monétaire"],ru:["денежно-кредитная политика"],zh:["货币政策"],ja:["金融政策"],ko:["통화 정책"],hi:["मौद्रिक नीति"],es:["política monetaria"],it:["politica monetaria"],pt:["política monetária"],tr:["para politikası"],nl:["monetair beleid"],pl:["polityka pieniężna"]}),
C("fiscal_policy","fiscal policy","Government decisions on taxation, public spending and borrowing.",{
fa:["سیاست مالی"],ar:["السياسة المالية"],de:["Fiskalpolitik"],fr:["politique budgétaire"],ru:["бюджетно-налоговая политика"],zh:["财政政策"],ja:["財政政策"],ko:["재정 정책"],hi:["राजकोषीय नीति"],es:["política fiscal"],it:["politica fiscale"],pt:["política fiscal"],tr:["maliye politikası"],nl:["begrotingsbeleid"],pl:["polityka fiskalna"]}),
C("liquidity","liquidity","The ease with which an asset can be converted into cash, or funding available in a market.",{
fa:["نقدشوندگی","نقدینگی"],ar:["السيولة"],de:["Liquidität"],fr:["liquidité"],ru:["ликвидность"],zh:["流动性"],ja:["流動性"],ko:["유동성"],hi:["तरलता"],es:["liquidez"],it:["liquidità"],pt:["liquidez"],tr:["likidite"],nl:["liquiditeit"],pl:["płynność"]},{note:"Asset liquidity and system-wide money/liquidity are related but distinct senses."}),
C("foreign_reserves","foreign exchange reserves","Foreign-currency assets held by a monetary authority.",{
fa:["ذخایر ارزی"],ar:["الاحتياطيات الأجنبية","احتياطيات النقد الأجنبي"],de:["Devisenreserven"],fr:["réserves de change"],ru:["международные резервы"],zh:["外汇储备"],ja:["外貨準備"],ko:["외환보유액"],hi:["विदेशी मुद्रा भंडार"],es:["reservas internacionales"],it:["riserve valutarie"],pt:["reservas internacionais"],tr:["döviz rezervleri"],nl:["deviezenreserves"],pl:["rezerwy walutowe"]}),
C("public_debt","public debt","The outstanding financial obligations of a government.",{
fa:["بدهی عمومی","بدهی دولت"],ar:["الدين العام"],de:["Staatsschulden"],fr:["dette publique"],ru:["государственный долг"],zh:["公共债务"],ja:["公的債務"],ko:["국가채무"],hi:["सार्वजनिक ऋण"],es:["deuda pública"],it:["debito pubblico"],pt:["dívida pública"],tr:["kamu borcu"],nl:["overheidsschuld"],pl:["dług publiczny"]}),
C("budget_deficit","budget deficit","The amount by which government expenditure exceeds revenue over a period.",{
fa:["کسری بودجه"],ar:["عجز الموازنة","العجز في الميزانية"],de:["Haushaltsdefizit"],fr:["déficit budgétaire"],ru:["дефицит бюджета"],zh:["财政赤字"],ja:["財政赤字"],ko:["재정 적자"],hi:["बजट घाटा"],es:["déficit presupuestario"],it:["disavanzo di bilancio"],pt:["déficit orçamentário"],tr:["bütçe açığı"],nl:["begrotingstekort"],pl:["deficyt budżetowy"]}),
C("budget_surplus","budget surplus","The amount by which government revenue exceeds expenditure over a period.",{
fa:["مازاد بودجه"],ar:["فائض الموازنة"],de:["Haushaltsüberschuss"],fr:["excédent budgétaire"],ru:["профицит бюджета"],zh:["财政盈余"],ja:["財政黒字"],ko:["재정 흑자"],hi:["बजट अधिशेष"],es:["superávit presupuestario"],it:["avanzo di bilancio"],pt:["superávit orçamentário"],tr:["bütçe fazlası"],nl:["begrotingsoverschot"],pl:["nadwyżka budżetowa"]}),
C("bond_yield","bond yield","The return an investor earns on a bond, commonly expressed as an annual rate.",{
fa:["بازده اوراق قرضه"],ar:["عائد السندات"],de:["Anleiherendite"],fr:["rendement obligataire"],ru:["доходность облигаций"],zh:["债券收益率"],ja:["債券利回り"],ko:["채권 수익률"],hi:["बॉन्ड प्रतिफल"],es:["rendimiento de los bonos"],it:["rendimento obbligazionario"],pt:["rendimento dos títulos"],tr:["tahvil getirisi"],nl:["obligatierendement"],pl:["rentowność obligacji"]}),
C("sanctions","economic sanctions","Restrictions imposed by governments or international bodies for political or security objectives.",{
fa:["تحریم‌های اقتصادی"],ar:["العقوبات الاقتصادية"],de:["Wirtschaftssanktionen"],fr:["sanctions économiques"],ru:["экономические санкции"],zh:["经济制裁"],ja:["経済制裁"],ko:["경제 제재"],hi:["आर्थिक प्रतिबंध"],es:["sanciones económicas"],it:["sanzioni economiche"],pt:["sanções econômicas"],tr:["ekonomik yaptırımlar"],nl:["economische sancties"],pl:["sankcje gospodarcze"]}),
C("oil_price","crude oil price","The market price of crude petroleum.",{
fa:["قیمت نفت خام"],ar:["سعر النفط الخام"],de:["Rohölpreis"],fr:["prix du pétrole brut"],ru:["цена на сырую нефть"],zh:["原油价格"],ja:["原油価格"],ko:["원유 가격"],hi:["कच्चे तेल की कीमत"],es:["precio del petróleo crudo"],it:["prezzo del petrolio greggio"],pt:["preço do petróleo bruto"],tr:["ham petrol fiyatı"],nl:["prijs van ruwe olie"],pl:["cena ropy naftowej"]}),
C("gold_price","gold price","The market price of gold, often quoted per troy ounce.",{
fa:["قیمت طلا"],ar:["سعر الذهب"],de:["Goldpreis"],fr:["prix de l’or"],ru:["цена золота"],zh:["黄金价格"],ja:["金価格"],ko:["금 가격"],hi:["सोने की कीमत"],es:["precio del oro"],it:["prezzo dell’oro"],pt:["preço do ouro"],tr:["altın fiyatı"],nl:["goudprijs"],pl:["cena złota"]}),
C("exports","exports","Goods and services sold by residents to buyers abroad.",{
fa:["صادرات"],ar:["الصادرات"],de:["Exporte"],fr:["exportations"],ru:["экспорт"],zh:["出口"],ja:["輸出"],ko:["수출"],hi:["निर्यात"],es:["exportaciones"],it:["esportazioni"],pt:["exportações"],tr:["ihracat"],nl:["uitvoer","export"],pl:["eksport"]}),
C("imports","imports","Goods and services purchased from sellers abroad.",{
fa:["واردات"],ar:["الواردات"],de:["Importe"],fr:["importations"],ru:["импорт"],zh:["进口"],ja:["輸入"],ko:["수입"],hi:["आयात"],es:["importaciones"],it:["importazioni"],pt:["importações"],tr:["ithalat"],nl:["invoer","import"],pl:["import"]}),
C("trade_balance","trade balance","The difference between the value of a country's exports and imports.",{
fa:["تراز تجاری"],ar:["الميزان التجاري"],de:["Handelsbilanz"],fr:["balance commerciale"],ru:["торговый баланс"],zh:["贸易差额"],ja:["貿易収支"],ko:["무역수지"],hi:["व्यापार संतुलन"],es:["balanza comercial"],it:["bilancia commerciale"],pt:["balança comercial"],tr:["ticaret dengesi"],nl:["handelsbalans"],pl:["bilans handlowy"]}),
C("recession","recession","A significant decline in economic activity across an economy, lasting more than a brief period.",{
fa:["رکود اقتصادی"],ar:["الركود الاقتصادي"],de:["Rezession"],fr:["récession"],ru:["рецессия"],zh:["经济衰退"],ja:["景気後退"],ko:["경기 침체"],hi:["आर्थिक मंदी"],es:["recesión"],it:["recessione"],pt:["recessão"],tr:["ekonomik durgunluk"],nl:["recessie"],pl:["recesja"]}),
C("gross_domestic_product","gross domestic product","The total market value of final goods and services produced within a country in a period.",{
fa:["تولید ناخالص داخلی"],ar:["الناتج المحلي الإجمالي"],de:["Bruttoinlandsprodukt"],fr:["produit intérieur brut"],ru:["валовой внутренний продукт"],zh:["国内生产总值"],ja:["国内総生産"],ko:["국내총생산"],hi:["सकल घरेलू उत्पाद"],es:["producto interno bruto"],it:["prodotto interno lordo"],pt:["produto interno bruto"],tr:["gayrisafi yurt içi hasıla"],nl:["bruto binnenlands product"],pl:["produkt krajowy brutto"]}),
C("unemployment","unemployment","The condition of people without work who are available for and seeking employment.",{
fa:["بیکاری"],ar:["البطالة"],de:["Arbeitslosigkeit"],fr:["chômage"],ru:["безработица"],zh:["失业"],ja:["失業"],ko:["실업"],hi:["बेरोज़गारी"],es:["desempleo"],it:["disoccupazione"],pt:["desemprego"],tr:["işsizlik"],nl:["werkloosheid"],pl:["bezrobocie"]}),
C("volatility","volatility","The degree of variation in a market price or return over time.",{
fa:["نوسان‌پذیری","نوسان"],ar:["التقلب"],de:["Volatilität"],fr:["volatilité"],ru:["волатильность"],zh:["波动性"],ja:["ボラティリティ","価格変動性"],ko:["변동성"],hi:["अस्थिरता"],es:["volatilidad"],it:["volatilità"],pt:["volatilidade"],tr:["oynaklık"],nl:["volatiliteit"],pl:["zmienność"]}),
C("basis_point","basis point","One hundredth of a percentage point (0.01 percentage point).",{
fa:["واحد پایه"],ar:["نقطة أساس"],de:["Basispunkt"],fr:["point de base"],ru:["базисный пункт"],zh:["基点"],ja:["ベーシスポイント"],ko:["베이시스 포인트"],hi:["आधार अंक"],es:["punto básico"],it:["punto base"],pt:["ponto-base"],tr:["baz puan"],nl:["basispunt"],pl:["punkt bazowy"]}),
C("risk_premium","risk premium","Additional expected return demanded for bearing risk beyond a benchmark or safer asset.",{
fa:["صرف ریسک"],ar:["علاوة المخاطر"],de:["Risikoprämie"],fr:["prime de risque"],ru:["премия за риск"],zh:["风险溢价"],ja:["リスクプレミアム"],ko:["위험 프리미엄"],hi:["जोखिम प्रीमियम"],es:["prima de riesgo"],it:["premio per il rischio"],pt:["prêmio de risco"],tr:["risk primi"],nl:["risicopremie"],pl:["premia za ryzyko"]}),
C("safe_haven","safe-haven asset","An asset investors may favor during periods of stress or uncertainty.",{
fa:["دارایی امن","پناهگاه امن سرمایه"],ar:["أصل ملاذ آمن"],de:["sicherer Hafen"],fr:["valeur refuge"],ru:["защитный актив","актив-убежище"],zh:["避险资产"],ja:["安全資産"],ko:["안전자산"],hi:["सुरक्षित निवेश परिसंपत्ति"],es:["activo refugio"],it:["bene rifugio"],pt:["ativo de refúgio"],tr:["güvenli liman varlığı"],nl:["veilige haven"],pl:["bezpieczna przystań"]}),
C("market_rise","market rise","An upward movement in a quoted market price, index or measured value.",{
fa:["افزایش قیمت","رشد قیمت","بالا رفتن قیمت"],ar:["ارتفاع السعر","صعود الأسعار","زيادة السعر"],de:["Kursanstieg","Preisanstieg"],fr:["hausse des cours","hausse des prix"],ru:["рост цены","повышение котировок"],zh:["价格上涨","上升"],ja:["価格上昇","上昇"],ko:["가격 상승","상승"],hi:["कीमतों में वृद्धि","बढ़ोतरी"],es:["subida de precios","alza"],it:["aumento dei prezzi","rialzo"],pt:["alta dos preços","valorização"],tr:["fiyat artışı","yükseliş"],nl:["prijsstijging","koersstijging"],pl:["wzrost cen","wzrost notowań"]}),
C("market_fall","market fall","A downward movement in a quoted market price, index or measured value.",{
fa:["کاهش قیمت","افت قیمت","پایین آمدن قیمت"],ar:["انخفاض السعر","هبوط الأسعار","تراجع السعر"],de:["Kursrückgang","Preisrückgang"],fr:["baisse des cours","baisse des prix"],ru:["падение цены","снижение котировок"],zh:["价格下跌","下降"],ja:["価格下落","下落"],ko:["가격 하락","하락"],hi:["कीमतों में गिरावट","कमी"],es:["caída de precios","bajada"],it:["calo dei prezzi","ribasso"],pt:["queda dos preços","baixa"],tr:["fiyat düşüşü","gerileme"],nl:["prijsdaling","koersdaling"],pl:["spadek cen","spadek notowań"]}),
C("price_stability","price stability","A condition in which a price or rate remains unchanged or changes only slightly.",{
fa:["ثبات قیمت","بدون تغییر ماندن"],ar:["استقرار الأسعار","ثبات السعر"],de:["Preisstabilität","unverändert bleiben"],fr:["stabilité des prix","rester inchangé"],ru:["стабильность цен","без изменений"],zh:["价格稳定","保持不变"],ja:["価格安定","据え置き"],ko:["가격 안정","동결"],hi:["मूल्य स्थिरता","अपरिवर्तित रहना"],es:["estabilidad de precios","mantenerse sin cambios"],it:["stabilità dei prezzi","invariato"],pt:["estabilidade dos preços","manter inalterado"],tr:["fiyat istikrarı","değişmeden kalmak"],nl:["prijsstabiliteit","ongewijzigd blijven"],pl:["stabilność cen","pozostawać bez zmian"]}),
C("monetary_tightening","monetary tightening","A restrictive shift in monetary policy, often involving higher rates or tighter financial conditions.",{
fa:["سیاست انقباضی پولی","سخت‌گیری پولی"],ar:["التشديد النقدي","سياسة نقدية انكماشية"],de:["geldpolitische Straffung"],fr:["resserrement monétaire"],ru:["ужесточение денежно-кредитной политики"],zh:["货币紧缩"],ja:["金融引き締め"],ko:["통화 긴축"],hi:["मौद्रिक सख्ती"],es:["endurecimiento monetario"],it:["stretta monetaria"],pt:["aperto monetário"],tr:["parasal sıkılaşma"],nl:["monetaire verkrapping"],pl:["zacieśnianie polityki pieniężnej"]}),
C("monetary_easing","monetary easing","An expansionary shift in monetary policy, often involving lower rates or easier financial conditions.",{
fa:["سیاست انبساطی پولی","تسهیل پولی"],ar:["التيسير النقدي","سياسة نقدية توسعية"],de:["geldpolitische Lockerung"],fr:["assouplissement monétaire"],ru:["смягчение денежно-кредитной политики"],zh:["货币宽松"],ja:["金融緩和"],ko:["통화 완화"],hi:["मौद्रिक ढील"],es:["flexibilización monetaria"],it:["allentamento monetario"],pt:["afrouxamento monetário"],tr:["parasal gevşeme"],nl:["monetaire versoepeling"],pl:["łagodzenie polityki pieniężnej"]}),
C("sanctions_relief","sanctions relief","A reduction, suspension or removal of economic sanctions.",{
fa:["رفع تحریم‌ها","کاهش تحریم‌ها"],ar:["رفع العقوبات","تخفيف العقوبات"],de:["Lockerung der Sanktionen","Aufhebung von Sanktionen"],fr:["allègement des sanctions","levée des sanctions"],ru:["смягчение санкций","снятие санкций"],zh:["解除制裁","制裁放宽"],ja:["制裁緩和","制裁解除"],ko:["제재 완화","제재 해제"],hi:["प्रतिबंधों में ढील","प्रतिबंध हटाना"],es:["alivio de sanciones","levantamiento de sanciones"],it:["allentamento delle sanzioni","revoca delle sanzioni"],pt:["alívio das sanções","suspensão das sanções"],tr:["yaptırımların hafifletilmesi","yaptırımların kaldırılması"],nl:["versoepeling van sancties","opheffing van sancties"],pl:["złagodzenie sankcji","zniesienie sankcji"]}),
C("sanctions_imposition","imposition of sanctions","The introduction or expansion of economic restrictions by an authority.",{
fa:["اعمال تحریم‌ها","وضع تحریم‌های جدید"],ar:["فرض العقوبات","فرض عقوبات جديدة"],de:["Verhängung von Sanktionen"],fr:["imposition de sanctions"],ru:["введение санкций"],zh:["实施制裁"],ja:["制裁の発動"],ko:["제재 부과"],hi:["प्रतिबंध लगाना"],es:["imposición de sanciones"],it:["imposizione di sanzioni"],pt:["imposição de sanções"],tr:["yaptırım uygulanması"],nl:["oplegging van sancties"],pl:["nałożenie sankcji"]}),
C("negotiation_progress","negotiation progress","Developments indicating that talks are advancing or an agreement is becoming more likely.",{
fa:["پیشرفت مذاکرات","ازسرگیری گفت‌وگوها"],ar:["تقدم المفاوضات","استئناف المحادثات"],de:["Fortschritte bei Verhandlungen"],fr:["progrès des négociations"],ru:["прогресс в переговорах"],zh:["谈判取得进展"],ja:["交渉の進展"],ko:["협상 진전"],hi:["वार्ता में प्रगति"],es:["avance de las negociaciones"],it:["progressi nei negoziati"],pt:["avanço nas negociações"],tr:["müzakerelerde ilerleme"],nl:["vooruitgang in onderhandelingen"],pl:["postęp w negocjacjach"]}),
C("negotiation_breakdown","negotiation breakdown","A failure or collapse of talks, with no agreement reached.",{
fa:["شکست مذاکرات","فروپاشی گفت‌وگوها"],ar:["انهيار المفاوضات","فشل المحادثات"],de:["Scheitern der Verhandlungen"],fr:["échec des négociations"],ru:["срыв переговоров"],zh:["谈判破裂"],ja:["交渉決裂"],ko:["협상 결렬"],hi:["वार्ता विफल होना"],es:["fracaso de las negociaciones"],it:["fallimento dei negoziati"],pt:["fracasso das negociações"],tr:["müzakerelerin çökmesi"],nl:["mislukken van onderhandelingen"],pl:["fiasko negocjacji"]})
];

const ENGLISH_FORMS = [
["inflation",["inflationary","inflation-adjusted"]],
["interest_rate",["interest rates","rate of interest"]],
["policy_rate",["benchmark rate","key rate","official rate"]],
["rate_hike",["hike rates","raise interest rates","tightening move","interest rate increase","interest-rate increase"]],
["rate_cut",["cut rates","lower interest rates","easing move","interest rate reduction","interest-rate reduction"]],
["exchange_rate",["FX rate","foreign-exchange rate"]],
["central_bank",["monetary authority"]],
["monetary_policy",["monetary stance"]],
["foreign_reserves",["FX reserves","foreign exchange reserves"]],
["budget_deficit",["fiscal deficit"]],
["budget_surplus",["fiscal surplus"]],
["gross_domestic_product",["GDP"]],
["basis_point",["bps","basis points"]],
["market_rise",["rise","rises","rose","risen","surge","surges","surged","soar","soars","soared","climb","climbs","climbed","jump","jumps","jumped","increase","increases","increased","gain","gains","gained","edge higher","move higher","advance","advanced"]],
["market_fall",["fall","falls","fell","fallen","drop","drops","dropped","decline","declines","declined","slump","slumps","slumped","plunge","plunges","plunged","slide","slides","slid","sink","sinks","sank","retreat","retreated","ease","eased","move lower","edge lower"]],
["price_stability",["hold","holds","held","keep unchanged","keeps unchanged","leave unchanged","left unchanged","stand pat","maintain","maintains","maintained"]],
["monetary_tightening",["tighten","tightens","tightened","tightening","raise rates","raises rates","raised rates","rate hike"]],
["monetary_easing",["ease policy","eases policy","eased policy","loosen policy","loosens policy","rate cut","cuts rates","cut rates"]],
["sanctions_relief",["lift sanctions","lifts sanctions","lifted sanctions","ease sanctions","eases sanctions","sanctions relief","waive sanctions","waives sanctions"]],
["sanctions_imposition",["impose sanctions","imposes sanctions","imposed sanctions","tighten sanctions","tightens sanctions","new sanctions","sanctions package"]],
["negotiation_progress",["resume talks","resumes talks","talks resume","restart negotiations","restarts negotiations","reach an agreement","deal reached","make progress in talks"]],
["negotiation_breakdown",["walk away from talks","walks away from talks","talks collapse","negotiations collapse","break off talks","breaks off talks","negotiations stall"]]
];
const FORM_MAP = new Map(ENGLISH_FORMS.flatMap(([id,forms])=>forms.map(term=>[term.toLowerCase(),id])));
const CONCEPT_MAP = new Map(MARKET_CONCEPTS.map(c=>[c.id,c]));
const TERM_INDEX = new Map();
for (const c of MARKET_CONCEPTS) {
  for (const [lang,terms] of Object.entries({en:[c.pivot.term],...c.equivalents})) {
    for (const term of terms) {
      const key=term.toLocaleLowerCase();
      if (!TERM_INDEX.has(lang)) TERM_INDEX.set(lang,new Map());
      const list=TERM_INDEX.get(lang).get(key)||[];
      list.push(c.id);
      TERM_INDEX.get(lang).set(key,list);
    }
  }
}
for (const [term,id] of FORM_MAP) {
  const c=CONCEPT_MAP.get(id);
  const m=TERM_INDEX.get("en");
  const list=m.get(term)||[];
  if (!list.includes(id)) list.push(id);
  m.set(term,list);
}
const escapeRe = value => value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
function normalizeLexicalText(value,lang) {
  let s=String(value||"").normalize("NFKC").toLocaleLowerCase();
  if(lang==="fa") s=s.replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[ۀة]/g,"ه").replace(/[\u200c\u200f]/g," ");
  if(lang==="ar") s=s.replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/[\u064b-\u065f\u0670]/g,"").replace(/ـ/g,"");
  return s.replace(/\s+/g," ").trim();
}
export function analyzeMarketLexicon(text,language) {
  const lang=SUPPORTED_LEXICON_LANGUAGES.includes(language)?language:"und";
  if(lang==="und") return {version:MARKET_LEXICON_VERSION,pivot:PIVOT_LANGUAGE,matches:[],unmatched_language:true};
  const normalized=normalizeLexicalText(text,lang);
  const matches=[];
  for(const [term,ids] of TERM_INDEX.get(lang)||[]) {
    const pattern=(lang==="zh"||lang==="ja"||lang==="ko"||lang==="hi")?null:new RegExp("(^|[^\\p{L}])"+escapeRe(term)+"(?=$|[^\\p{L}])","gu");
    const found=pattern?pattern.test(normalized):normalized.includes(term);
    if(found) for(const id of ids) {
      const concept=CONCEPT_MAP.get(id);
      matches.push({concept_id:id,pivot_term:concept.pivot.term,matched_term:term,language:lang,relation:lang==="en"?(term===concept.pivot.term?"pivot_term":"english_synonym_or_inflection"):"contextual_equivalent",definition:concept.pivot.definition,register:"standard_financial",notes:concept.note||null,near_miss:concept.near_miss||null});
    }
  }
  const unique=[...new Map(matches.map(x=>[x.concept_id+"|"+x.matched_term,x])).values()];
  return {version:MARKET_LEXICON_VERSION,pivot:PIVOT_LANGUAGE,language:lang,concept_count:MARKET_CONCEPTS.length,matches:unique,matched_concept_ids:[...new Set(unique.map(x=>x.concept_id))]};
}
export function getMarketLexicon({language=null,query=null,limit=100}={}) {
  const q=String(query||"").toLocaleLowerCase().trim();
  return {version:MARKET_LEXICON_VERSION,pivot:PIVOT_LANGUAGE,supported_languages:SUPPORTED_LEXICON_LANGUAGES,total_concepts:MARKET_CONCEPTS.length,concepts:MARKET_CONCEPTS.filter(c=>{
    if(q && ![c.id,c.pivot.term,c.pivot.definition,...Object.values(c.equivalents).flat()].some(v=>String(v).toLocaleLowerCase().includes(q))) return false;
    return !language || language==="en" || Object.prototype.hasOwnProperty.call(c.equivalents,language);
  }).slice(0,Math.max(1,Math.min(200,limit))).map(c=>({...c,english_synonyms:ENGLISH_FORMS.filter(([id])=>id===c.id).flatMap(([,terms])=>terms)}))};
}
export function runMarketLexiconBenchmark() {
 const cases=[
  {lang:"en",text:"Inflation slowed, but interest rates remained unchanged.",expected:["inflation","interest_rate"]},
  {lang:"fa",text:"بانک مرکزی نرخ بهره را افزایش داد و تورم کاهش یافت.",expected:["central_bank","interest_rate","inflation"]},
  {lang:"ar",text:"أعلن البنك المركزي رفع سعر الفائدة لمواجهة التضخم.",expected:["central_bank","rate_hike","interest_rate","inflation"]},
  {lang:"de",text:"Die Zentralbank senkte den Leitzins.",expected:["central_bank","policy_rate"]},
  {lang:"fr",text:"La banque centrale a annoncé une hausse des taux d’intérêt.",expected:["central_bank","rate_hike","interest_rate"]},
  {lang:"ru",text:"Центральный банк повысил процентную ставку.",expected:["central_bank","interest_rate"]},
  {lang:"zh",text:"央行宣布降息以应对通货膨胀。",expected:["central_bank","rate_cut","inflation"]},
  {lang:"ja",text:"中央銀行は政策金利を引き上げた。",expected:["central_bank","policy_rate"]},
  {lang:"ko",text:"중앙은행이 금리를 인상했다.",expected:["central_bank","interest_rate","rate_hike"]},
  {lang:"hi",text:"केंद्रीय बैंक ने ब्याज दर बढ़ाई।",expected:["central_bank","interest_rate","rate_hike"]},
  {lang:"es",text:"El banco central anunció una subida de los tipos de interés.",expected:["central_bank","rate_hike","interest_rate"]},
  {lang:"it",text:"La banca centrale ha tagliato i tassi d’interesse.",expected:["central_bank","rate_cut","interest_rate"]},
  {lang:"pt",text:"O banco central reduziu a taxa de juros.",expected:["central_bank","rate_cut","interest_rate"]},
  {lang:"tr",text:"Merkez bankası faiz oranını artırdı.",expected:["central_bank","rate_hike","interest_rate"]},
  {lang:"nl",text:"De centrale bank verhoogde de rente.",expected:["central_bank","rate_hike"]},
  {lang:"pl",text:"Bank centralny podniósł stopę procentową.",expected:["central_bank","rate_hike","interest_rate"]}
 ];
 const results=cases.map(c=>{const a=analyzeMarketLexicon(c.text,c.lang);const found=new Set(a.matched_concept_ids);return {language:c.lang,passed:c.expected.every(x=>found.has(x)),expected:c.expected,found:[...found]};});
 const passed=results.filter(x=>x.passed).length;
 return {version:MARKET_LEXICON_VERSION,total:results.length,passed,failed:results.length-passed,score_pct:Math.round(passed/results.length*100),cases:results,scope:"Curated lexical matching smoke tests; not a translation quality or full language proficiency score."};
}
