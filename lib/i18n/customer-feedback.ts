// ─── supported languages ──────────────────────────────────────────────────────

export type SupportedLang = "en" | "ja" | "zh" | "ko" | "ar" | "ru" | "nl" | "es";

const SUPPORTED: SupportedLang[] = ["en", "ja", "zh", "ko", "ar", "ru", "nl", "es"];

// ─── translation shape ────────────────────────────────────────────────────────

export type FeedbackTranslations = {
  // Rating button aria-labels, index 0 = value 1, index 4 = value 5
  ratingLabels: [string, string, string, string, string];
  // Form sections
  experienceQuestion: string;
  // Use {name} as the placeholder for the business name
  recommendQuestion: string;
  yes: string;
  no: string;
  commentLabel: string;
  commentOptional: string;
  commentPlaceholder: string;
  submitButton: string;
  submittingButton: string;
  // Validation / network errors
  errorRating: string;
  errorRecommend: string;
  errorSubmit: string;
  // Already-submitted cooldown screen
  alreadyTitle: string;
  // Use {name} as the placeholder for the business name
  alreadyMessage: string;
  // Success screen
  successTitle: string;
  // Use {name} as the placeholder for the business name
  successMessage: string;
  // Page-level states
  loading: string;
  unavailableTitle: string;
  unavailableMessage: string;
  poweredBy: string;
};

// ─── translations ─────────────────────────────────────────────────────────────

const en: FeedbackTranslations = {
  ratingLabels: ["Very bad", "Bad", "Okay", "Good", "Excellent"],
  experienceQuestion: "How was your experience today?",
  recommendQuestion: "Would you recommend {name}?",
  yes: "Yes",
  no: "No",
  commentLabel: "Anything you'd like us to know?",
  commentOptional: "Optional",
  commentPlaceholder: "Tell us about your experience...",
  submitButton: "Submit feedback",
  submittingButton: "Submitting...",
  errorRating: "Please rate your experience.",
  errorRecommend: "Please tell us if you would recommend this business.",
  errorSubmit: "We couldn't submit your feedback. Please try again.",
  alreadyTitle: "Thanks for your feedback",
  alreadyMessage: "You've already shared feedback with {name} recently.",
  successTitle: "Thank you!",
  successMessage: "Your feedback has been shared with {name}.",
  loading: "Loading...",
  unavailableTitle: "Feedback unavailable",
  unavailableMessage: "This feedback page is not currently available.",
  poweredBy: "Powered by Expulse",
};

const ja: FeedbackTranslations = {
  ratingLabels: ["とても悪い", "悪い", "普通", "良い", "とても良い"],
  experienceQuestion: "本日のご体験はいかがでしたか？",
  recommendQuestion: "{name}をご友人や知人にすすめたいですか？",
  yes: "はい",
  no: "いいえ",
  commentLabel: "ご意見・ご感想をお聞かせください",
  commentOptional: "任意",
  commentPlaceholder: "ご体験についてお聞かせください...",
  submitButton: "送信する",
  submittingButton: "送信中...",
  errorRating: "評価を選択してください。",
  errorRecommend: "おすすめするかどうかを選択してください。",
  errorSubmit: "送信できませんでした。もう一度お試しください。",
  alreadyTitle: "フィードバックありがとうございます",
  alreadyMessage: "{name}へのフィードバックはすでに送信されています。",
  successTitle: "ありがとうございます！",
  successMessage: "フィードバックが{name}に届きました。",
  loading: "読み込み中...",
  unavailableTitle: "フィードバックは現在利用できません",
  unavailableMessage: "このフィードバックページは現在ご利用いただけません。",
  poweredBy: "Powered by Expulse",
};

const zh: FeedbackTranslations = {
  ratingLabels: ["非常差", "差", "一般", "好", "非常好"],
  experienceQuestion: "您今天的体验如何？",
  recommendQuestion: "您愿意向朋友推荐{name}吗？",
  yes: "是",
  no: "否",
  commentLabel: "有什么想告诉我们的吗？",
  commentOptional: "选填",
  commentPlaceholder: "分享您的体验...",
  submitButton: "提交反馈",
  submittingButton: "提交中...",
  errorRating: "请为您的体验评分。",
  errorRecommend: "请告诉我们您是否愿意推荐这里。",
  errorSubmit: "提交失败，请重试。",
  alreadyTitle: "感谢您的反馈",
  alreadyMessage: "您近期已向{name}提交过反馈。",
  successTitle: "谢谢！",
  successMessage: "您的反馈已发送给{name}。",
  loading: "加载中...",
  unavailableTitle: "反馈暂不可用",
  unavailableMessage: "此反馈页面目前无法访问。",
  poweredBy: "Powered by Expulse",
};

const ko: FeedbackTranslations = {
  ratingLabels: ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"],
  experienceQuestion: "오늘 방문 어떠셨나요?",
  recommendQuestion: "{name}을(를) 지인에게 추천하시겠어요?",
  yes: "예",
  no: "아니요",
  commentLabel: "추가로 하고 싶은 말씀이 있으신가요?",
  commentOptional: "선택 사항",
  commentPlaceholder: "경험을 자유롭게 작성해 주세요...",
  submitButton: "의견 보내기",
  submittingButton: "전송 중...",
  errorRating: "경험을 평가해 주세요.",
  errorRecommend: "추천 여부를 선택해 주세요.",
  errorSubmit: "의견을 보내지 못했습니다. 다시 시도해 주세요.",
  alreadyTitle: "소중한 의견 감사합니다",
  alreadyMessage: "{name}에 이미 의견을 남기셨습니다.",
  successTitle: "감사합니다!",
  successMessage: "{name}에 의견이 전달되었습니다.",
  loading: "불러오는 중...",
  unavailableTitle: "피드백을 사용할 수 없습니다",
  unavailableMessage: "현재 이 피드백 페이지를 이용할 수 없습니다.",
  poweredBy: "Powered by Expulse",
};

const ar: FeedbackTranslations = {
  ratingLabels: ["سيئ جداً", "سيئ", "مقبول", "جيد", "ممتاز"],
  experienceQuestion: "كيف كانت تجربتك اليوم؟",
  recommendQuestion: "هل ستوصي بـ{name} لأصدقائك؟",
  yes: "نعم",
  no: "لا",
  commentLabel: "هل هناك شيء تريد إخبارنا به؟",
  commentOptional: "اختياري",
  commentPlaceholder: "أخبرنا عن تجربتك...",
  submitButton: "إرسال الملاحظات",
  submittingButton: "جارٍ الإرسال...",
  errorRating: "يرجى تقييم تجربتك.",
  errorRecommend: "يرجى إخبارنا إذا كنت ستوصي بهذا المكان.",
  errorSubmit: "تعذّر إرسال ملاحظاتك. يرجى المحاولة مرة أخرى.",
  alreadyTitle: "شكراً على ملاحظاتك",
  alreadyMessage: "لقد شاركت ملاحظاتك مع {name} مؤخراً.",
  successTitle: "شكراً لك!",
  successMessage: "تمت مشاركة ملاحظاتك مع {name}.",
  loading: "جارٍ التحميل...",
  unavailableTitle: "الملاحظات غير متاحة",
  unavailableMessage: "هذه الصفحة غير متاحة حالياً.",
  poweredBy: "Powered by Expulse",
};

const ru: FeedbackTranslations = {
  ratingLabels: ["Очень плохо", "Плохо", "Нормально", "Хорошо", "Отлично"],
  experienceQuestion: "Как прошёл ваш визит сегодня?",
  recommendQuestion: "Вы бы порекомендовали {name} друзьям?",
  yes: "Да",
  no: "Нет",
  commentLabel: "Есть что добавить?",
  commentOptional: "Необязательно",
  commentPlaceholder: "Расскажите о вашем впечатлении...",
  submitButton: "Отправить отзыв",
  submittingButton: "Отправка...",
  errorRating: "Пожалуйста, оцените ваш визит.",
  errorRecommend: "Пожалуйста, укажите, порекомендуете ли вы нас.",
  errorSubmit: "Не удалось отправить отзыв. Попробуйте ещё раз.",
  alreadyTitle: "Спасибо за ваш отзыв",
  alreadyMessage: "Вы уже оставили отзыв о {name} недавно.",
  successTitle: "Спасибо!",
  successMessage: "Ваш отзыв был передан в {name}.",
  loading: "Загрузка...",
  unavailableTitle: "Страница недоступна",
  unavailableMessage: "Эта страница отзывов сейчас недоступна.",
  poweredBy: "Powered by Expulse",
};

const nl: FeedbackTranslations = {
  ratingLabels: ["Heel slecht", "Slecht", "Gaat wel", "Goed", "Uitstekend"],
  experienceQuestion: "Hoe was uw bezoek vandaag?",
  recommendQuestion: "Zou u {name} aanraden aan anderen?",
  yes: "Ja",
  no: "Nee",
  commentLabel: "Wilt u nog iets kwijt?",
  commentOptional: "Optioneel",
  commentPlaceholder: "Vertel ons over uw ervaring...",
  submitButton: "Verstuur feedback",
  submittingButton: "Verzenden...",
  errorRating: "Geef uw ervaring een beoordeling.",
  errorRecommend: "Geef aan of u dit bedrijf zou aanraden.",
  errorSubmit: "We konden uw feedback niet versturen. Probeer het opnieuw.",
  alreadyTitle: "Bedankt voor uw feedback",
  alreadyMessage: "U heeft recent al feedback gedeeld met {name}.",
  successTitle: "Bedankt!",
  successMessage: "Uw feedback is gedeeld met {name}.",
  loading: "Laden...",
  unavailableTitle: "Feedback niet beschikbaar",
  unavailableMessage: "Deze feedbackpagina is momenteel niet beschikbaar.",
  poweredBy: "Powered by Expulse",
};

const es: FeedbackTranslations = {
  ratingLabels: ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"],
  experienceQuestion: "¿Cómo fue tu experiencia hoy?",
  recommendQuestion: "¿Recomendarías {name} a otras personas?",
  yes: "Sí",
  no: "No",
  commentLabel: "¿Hay algo más que quieras contarnos?",
  commentOptional: "Opcional",
  commentPlaceholder: "Cuéntanos sobre tu experiencia...",
  submitButton: "Enviar opinión",
  submittingButton: "Enviando...",
  errorRating: "Por favor, valora tu experiencia.",
  errorRecommend: "Por favor, indícanos si recomendarías este lugar.",
  errorSubmit: "No pudimos enviar tu opinión. Por favor, inténtalo de nuevo.",
  alreadyTitle: "Gracias por tu opinión",
  alreadyMessage: "Ya has compartido tu opinión con {name} recientemente.",
  successTitle: "¡Gracias!",
  successMessage: "Tu opinión ha sido compartida con {name}.",
  loading: "Cargando...",
  unavailableTitle: "Opiniones no disponibles",
  unavailableMessage: "Esta página de opiniones no está disponible en este momento.",
  poweredBy: "Powered by Expulse",
};

// ─── dictionary ───────────────────────────────────────────────────────────────

const translations: Record<SupportedLang, FeedbackTranslations> = {
  en,
  ja,
  zh,
  ko,
  ar,
  ru,
  nl,
  es,
};

// ─── public helpers ───────────────────────────────────────────────────────────

export function getTranslations(lang: SupportedLang): FeedbackTranslations {
  return translations[lang];
}

/**
 * Reads the browser's preferred language and normalises it to a supported
 * language code, falling back to English for anything unrecognised.
 *
 * Safe to call only on the client (navigator is not available during SSR).
 */
export function detectLang(): SupportedLang {
  if (typeof navigator === "undefined") return "en";

  const raw = navigator.languages?.[0] ?? navigator.language ?? "";

  return normalizeLang(raw);
}

function normalizeLang(raw: string): SupportedLang {
  if (!raw) return "en";

  const lower = raw.toLowerCase();

  // Chinese — any zh-* variant maps to Simplified Chinese for V1
  if (lower === "zh" || lower.startsWith("zh-")) return "zh";

  // Arabic — ar-SA, ar-AE, ar-EG, etc.
  if (lower === "ar" || lower.startsWith("ar-")) return "ar";

  // All other languages: extract the base subtag before any hyphen
  const base = lower.split("-")[0];

  if ((SUPPORTED as string[]).includes(base)) return base as SupportedLang;

  return "en";
}

/**
 * Replaces {name} placeholders in a translated string with the actual value.
 *
 * Example: interpolate("Welcome to {name}!", { name: "Cafe Luna" })
 *          → "Welcome to Cafe Luna!"
 */
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
