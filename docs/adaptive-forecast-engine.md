# موتور پیش‌بینی تطبیقی نبض بازار

## نسخه فعلی: `iran-ensemble-wf-1.0`

این موتور یک سامانهٔ پیش‌بینی آماری رایگان و مستقل از API مدل زبانی است. مدل زبانی نباید قیمت را از خودش حدس بزند؛ پیش‌بینی عددی از دادهٔ تاریخی و ارزیابی خارج از نمونه تولید می‌شود.

## روش کار

- سری تاریخی به نقاط روزانهٔ یکتا تبدیل می‌شود.
- چهار نامزد پیش‌بینی محاسبه می‌شوند: drift مقاوم با میانهٔ بازده، روند رگرسیون لگاریتمی، مومنتوم چندپنجره‌ای و بازگشت به روند.
- برای افق‌های ۱، ۳ و ۷ روز، آزمون walk-forward انجام می‌شود: در هر مبدأ فقط داده‌های قبل از آن مبدأ دیده می‌شوند و نتیجه با مشاهدهٔ بعدی در افق مربوط سنجیده می‌شود.
- وزن مدل‌ها از خطای مطلق تاریخی خارج از نمونه به‌دست می‌آید.
- مدل فقط وقتی پیش‌بینی منتشر می‌کند که خطای ensemble در backtest دست‌کم ۲٪ بهتر از baseline «بدون تغییر قیمت» باشد؛ وگرنه پیش‌بینی را با وضعیت withheld کنار می‌گذارد.
- بازهٔ سناریو از خطای تاریخی و نوسان برآورد می‌شود؛ confidence زبانی از تعداد نمونه و بهبود خطا جدا نگه داشته می‌شود.

## ثبت و یادگیری

هر پیش‌بینی در `market_forecast_runs` با زمان صدور، افق، قیمت مبنا، قیمت هدف، بازه، نسخهٔ مدل، وزن‌ها و معیارهای backtest ذخیره می‌شود. پیش‌بینی قدیمی بازنویسی نمی‌شود.

Cron پنج‌دقیقه‌ای داده را تازه‌سازی می‌کند؛ برای جلوگیری از ثبت پیش‌بینی تکراری، برای هر دارایی و افق حداقل شش ساعت فاصله در نظر گرفته شده است. پس از رسیدن زمان هدف و دریافت quote تازه، رکورد به `evaluated` تغییر می‌کند و قیمت واقعی، خطای مطلق و صحت جهت در همان رکورد ثبت می‌شوند.

## API

- `/forecast/v2?asset=USD_IRR_FREE&horizon_days=7`: تولید یا ثبت پیش‌بینی برای افق ۱، ۳ یا ۷ روز.
- `/forecast/history?asset=USD_IRR_FREE&horizon_days=7`: تاریخچهٔ ۳۰ پیش‌بینی آخر؛ پیش‌بینی‌های قبلی محفوظ‌اند.
- `/forecast/performance?asset=USD_IRR_FREE`: خطای مطلق میانگین و دقت جهت بر اساس پیش‌بینی‌هایی که واقعاً ارزیابی شده‌اند.

دارایی‌های فعال در این نسخه: دلار، یورو، طلای ۱۸ عیار و سکهٔ امامی. پوند و تتر تا تأیید تاریخچه وارد موتور پیش‌بینی نمی‌شوند.

## محدودیت‌ها و معیار انتشار

- این نسخه هنوز مدل یادگیری عمیق یا مدل زبانی آموزش‌دیده نیست؛ یک ensemble آماری با وزن‌دهی تطبیقی و اعتبارسنجی walk-forward است.
- نتیجهٔ backtest تضمین عملکرد آینده نیست؛ تغییر رژیم بازار می‌تواند خطا را افزایش دهد.
- نرخ منبع عمومی ممکن است با تأخیر منتشر شود؛ Cron پنج‌دقیقه‌ای تأخیر upstream را حذف نمی‌کند.
- «دقت جهت» فقط وقتی گزارش می‌شود که نمونه‌های ارزیابی‌شدهٔ واقعی وجود داشته باشند. تا قبل از جمع‌شدن نمونه، نباید ادعای دقت ۸۰٪ کرد.
- معیارها باید به تفکیک دارایی و افق گزارش شوند. مدل فقط وقتی ارتقا می‌یابد که در دادهٔ خارج از نمونه بهتر شود.
- این سامانه اطلاعات آموزشی و تحلیلی بازار است و توصیهٔ خریدوفروش یا تضمین سود نیست.

## راه‌اندازی دیتابیس

قبل از فعال‌شدن ثبت و ارزیابی، migration زیر باید در Supabase SQL Editor اجرا شود:

`supabase/migrations/202611060002_market_forecast_learning.sql`

این migration فقط جدول جدید `market_forecast_runs` را اضافه می‌کند و به جدول‌های فروشگاه دست نمی‌زند.


## بازخورد مقاوم از خطاها — نسخهٔ ۲٫۸

- هر پیش‌بینیِ بالغ‌شده با قیمت واقعی مقایسه می‌شود؛ پیش‌بینی‌های قبلی بازنویسی نمی‌شوند.
- خطا به چند بُعد تفکیک می‌شود: خطای مطلق، سوگیری علامت‌دار (کم‌برآورد/بیش‌برآورد)، صحت جهت، افت عملکرد اخیر و پوشش بازهٔ عدم‌قطعیت.
- اصلاح سوگیری فقط با حداقل ۳۰ پیش‌بینی بالغ‌شده و وقتی دو پنجرهٔ زمانی مستقل جهت سوگیری یکسانی داشته باشند فعال می‌شود.
- برآورد اصلاح با میانه و محدودسازی اثر داده‌های پرت انجام می‌شود؛ اندازهٔ اصلاح نیز حداکثر به ۱٪ در مقیاس لگاریتمی محدود است.
- اگر دو پنجره با هم اختلاف داشته باشند، اصلاح اعمال نمی‌شود و سامانه به‌جای حدس‌زدن، شواهد بیشتری جمع می‌کند.
- تشخیص افت عملکرد و کم‌پوششی بازهٔ پیش‌بینی به‌عنوان اقدام یادگیری ثبت می‌شود؛ این هشدارها به‌تنهایی مجوز تغییر خودکار وزن‌ها نیستند.
- نسخهٔ مدل به iran-ensemble-wf-2.8-robust-feedback افزایش یافته تا نتایج نسخهٔ قبلی بدون اعتبارسنجی وارد کالیبراسیون جدید نشوند.


## Deep error-learning loop — version 2.8

### 1. Immutable forecast-level diagnosis
Each newly matured forecast receives one durable diagnosis in `market_forecast_error_diagnostics`. The record keeps the measured error, quote/provider context, volatility/trend regime, news-risk context, ensemble concentration, and candidate explanations. The diagnosis is unique per forecast and is not rewritten by later learning cycles.

### 2. Error decomposition
The diagnosis separates:
- signed price residual (under-prediction vs over-prediction);
- direction miss;
- magnitude over-forecast vs under-forecast;
- prediction-interval miss and interval width;
- reference-quote age, provider consensus count, and provider spread;
- elevated event-risk context and ensemble weight concentration.

Observed symptoms are distinguished from contextual risk factors. The system must not describe correlation as proven causation.

### 3. Cohort and regime analysis
Rolling reports compare errors by quote source, historical-data provider, forecast mode, quote-age band, source-consensus band, spread band, news-risk band, realized-volatility regime, and 20-day trend regime. Cohorts smaller than five matured forecasts are hidden to reduce noise. A cohort gap is a review signal, not an automatic model-weight change.

### 4. Out-of-sample calibration promotion
Calibration uses up to 40 older matured observations to estimate a robust residual correction and keeps the latest 20 observations as a chronological holdout. The correction is rejected unless the training bias is stable across two windows, the holdout confirms its direction, and holdout absolute error improves by at least 3%. The log adjustment remains capped at 1%. No in-sample-only improvement is sufficient for promotion.

### 5. Safety and evaluation rules
- Pending, invalidated, stale, or malformed forecasts are excluded.
- Each asset and horizon is evaluated separately.
- No missing provider metadata is silently converted to zero or treated as evidence of a weak source.
- No automatic strategy or weight change is made solely from a suspected root cause.
- A new correction must improve a later holdout; historical forecast records remain unchanged.
- The live learning report is exposed at `/forecast/learning`, including aggregate cycles and individual diagnoses.

The live database migration for the immutable diagnosis ledger is `20261114184452_market_forecast_error_diagnostics`. The Worker change remains subject to PR review and deployment; schema availability alone does not mean the new code is live.

- Calibration promotion also checks that directional accuracy on the same chronological holdout does not deteriorate by more than five percentage points.
- Baseline-only forecasts are retained for diagnosis and uncertainty monitoring but are excluded from the adaptive directional model's skill, drift, and cohort-promotion decisions. This prevents neutral benchmark records from masking the directional model's actual performance.
- Issued forecasts now carry 20-day realized-volatility and trend-regime context. These regimes are used for post-outcome cohort comparison, not as a causal explanation or a direct trading trigger.


## Evidence-aware news verification — version 1.0

The news pipeline now combines scheduled RSS collection with GDELT DOC 2.0 web discovery. GDELT is queried once per scheduled collection cycle (not on every public page read), and a bounded on-demand endpoint is available at:

- \`GET /news/verify?claim=<URL-encoded claim>\` — searches the web for up to 75 relevant article headlines from the last seven days and returns linked evidence.
- \`GET /news\` — returns the collected items plus a structured cross-publisher verification report.

### What the verifier does

- Normalizes Persian and Arabic digits, Persian letter variants, and common whitespace differences.
- Extracts checkable headline-level signals: market metric, direction, numeric values/units, publication day, publisher domain, and whether an RSS excerpt is available.
- Compares only related claims with aligned metric and publication day. Opposing direction words or differing numeric values with the same unit are flagged as potential conflicts.
- Separates supporting, contradicting, related-but-unclear, and different-publication-day evidence.
- Does not count the same publisher twice or near-identical syndicated headlines as independent corroboration.
- Identifies a small explicit allowlist of official primary-source domains; all other outlets remain \`publisher_unrated\`. No unsupported outlet credibility score is invented.
- Preserves the article URL, domain, publication timestamp, search provider, and the relation used in each evidence comparison.

### Verdict policy and limitations

The engine uses evidence-oriented states such as \`corroborated_by_independent_headlines\`, \`contradicted_by_independent_headlines\`, \`mixed_evidence\`, \`insufficient_independent_evidence\`, and \`not_checkable_from_headline\`. These are not calibrated probabilities and are not claims that an article is definitively true or false.

Headline-only search results are leads, not proof. Different dates, definitions, units, observation windows, and populations can explain apparent disagreement. A decisive verification still requires the full article and, when available, the original data release, official statement, or primary document. If web search fails or evidence is weak, the endpoint abstains instead of inventing a verdict.

GDELT is an additional discovery index, not an authority or truth oracle. Its results are deduplicated against exact URLs, rate-limited by the provider, and fetched only in scheduled collection or explicit claim-verification requests. GDELT's API documentation describes its Article List search mode, query operators, time windows, and result limits: https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/.

The verifier is not used to generate directional market predictions. News-derived direction remains disabled until a separate historical evaluation demonstrates incremental value.
