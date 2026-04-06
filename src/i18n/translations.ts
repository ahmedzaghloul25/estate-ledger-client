export type Language = 'en' | 'ar';

const en = {
  // ── Avatar menu ──────────────────────────────────────────────────────────
  'menu.language': 'Language',
  'menu.languageEnglish': 'English',
  'menu.languageArabic': 'Arabic',
  'menu.darkMode': 'Dark Mode',
  'menu.on': 'ON',
  'menu.off': 'OFF',
  'menu.logout': 'Logout',
  'menu.cancel': 'Cancel',

  // ── RTL alert ─────────────────────────────────────────────────────────────
  'alert.rtlTitle': 'Language Changed',
  'alert.rtlMessage': 'Please restart the app to apply the Arabic layout.',
  'alert.ok': 'OK',

  // ── Bottom tab labels ─────────────────────────────────────────────────────
  'nav.dashboard': 'Dashboard',
  'nav.properties': 'Properties',
  'nav.tenants': 'Tenants',
  'nav.contracts': 'Contracts',
  'nav.reports': 'Reports',

  // ── Dashboard ─────────────────────────────────────────────────────────────
  'dashboard.headerTitle': 'Sovereign Curator',
  'dashboard.monthlyPerf': 'MONTHLY PERFORMANCE',
  'dashboard.expectedMonth': 'Expected this month',
  'dashboard.collected': 'COLLECTED',
  'dashboard.totalPortfolio': 'TOTAL PORTFOLIO',
  'dashboard.rented': '3 Rented • 2 Available',
  'dashboard.overduePayments': 'OVERDUE PAYMENTS',
  'dashboard.attentionReq': 'Attention required',
  'dashboard.activeRentals': 'Active Rentals',
  'dashboard.activeRentalsSubtitle': 'Your curated view of current tenancy performance and financial health.',
  'dashboard.addContract': 'Add New Contract',
  'dashboard.viewDetails': 'View Details',
  'dashboard.collectPayment': 'Collect Payment',
  'dashboard.paid': 'PAID',
  'dashboard.due': 'DUE',
  'dashboard.late': 'LATE',
  'dashboard.contractEnd': 'CONTRACT END',
  'dashboard.dueDate': 'DUE DATE',

  // ── Properties ────────────────────────────────────────────────────────────
  'properties.title': 'Properties',
  'properties.subtitle': 'assets in portfolio',
  'properties.newButton': '+ NEW PROPERTY',
  'properties.rented': 'RENTED',
  'properties.available': 'AVAILABLE',
  'properties.overdue': 'OVERDUE',

  // ── Property Detail ───────────────────────────────────────────────────────
  'propertyDetail.headerTitle': 'Property Detail',
  'propertyDetail.rent': 'MONTHLY RENT',
  'propertyDetail.area': 'AREA',
  'propertyDetail.sectionTenant': 'Current Tenant',

  // ── Create Property ───────────────────────────────────────────────────────
  'createProperty.headerTitle': 'New Property',
  'createProperty.name': 'Property Name',
  'createProperty.namePlaceholder': 'e.g. The Meridian Penthouse',
  'createProperty.address': 'Address',
  'createProperty.addressPlaceholder': 'Street, unit, city',
  'createProperty.area': 'Area',
  'createProperty.areaPlaceholder': '0',
  'createProperty.submit': 'Add Property',

  // ── Tenants ───────────────────────────────────────────────────────────────
  'tenants.title': 'Tenants',
  'tenants.subtitle': 'active tenancies',
  'tenants.newButton': '+ NEW TENANT',
  'tenants.paid': 'PAID',
  'tenants.upcoming': 'UPCOMING',
  'tenants.overdue': 'OVERDUE',

  // ── Create Tenant ─────────────────────────────────────────────────────────
  'createTenant.headerTitle': 'New Tenant',
  'createTenant.fullName': 'Full Name',
  'createTenant.fullNamePlaceholder': 'Legal full name',
  'createTenant.phone': 'Phone',
  'createTenant.phonePlaceholder': '01xxxxxxxxx',
  'createTenant.id': 'ID',
  'createTenant.idPlaceholder': 'ID no.',
  'createTenant.submit': 'Add Tenant',

  // ── Contracts ─────────────────────────────────────────────────────────────
  'contracts.title': 'Contracts',
  'contracts.subtitle': 'agreements',
  'contracts.newButton': '+ NEW CONTRACT',
  'contracts.active': 'ACTIVE',
  'contracts.expiring': 'EXPIRING SOON',
  'contracts.expired': 'EXPIRED',
  'contracts.terminated': 'TERMINATED',

  // ── Contract Payments ─────────────────────────────────────────────────────
  'contractPayments.headerTitle': 'Contract & Payments',
  'contractPayments.monthlyRent': 'MONTHLY RENT',
  'contractPayments.months': 'MONTHS',
  'contractPayments.totalValue': 'TOTAL VALUE',
  'contractPayments.paymentHistory': 'Payment History',
  'contractPayments.paid': 'PAID',
  'contractPayments.upcoming': 'UPCOMING',
  'contractPayments.overdue': 'OVERDUE',
  'contractPayments.voided': 'VOIDED',
  'contractPayments.terminateButton': 'Terminate Contract',
  'contractPayments.terminateTitle': 'Terminate Contract',
  'contractPayments.terminateMessage': 'This will void all upcoming payments and mark the contract as terminated. This action cannot be undone.',
  'contractPayments.terminateConfirm': 'Terminate',
  'contractPayments.terminateCancel': 'Cancel',
  'contractPayments.terminatedBanner': 'CONTRACT TERMINATED',

  // ── Create Contract ───────────────────────────────────────────────────────
  'createContract.headerTitle': 'New Contract',
  'createContract.tenantLabel': 'Tenant Name',
  'createContract.tenantPlaceholder': 'Select tenant',
  'createContract.propertyLabel': 'Property',
  'createContract.propertyPlaceholder': 'Select property',
  'createContract.rentLabel': 'Monthly Rent',
  'createContract.intervalLabel': 'Payment Interval',
  'createContract.intervalPlaceholder': 'Select interval',
  'createContract.depositLabel': 'Security Deposit',
  'createContract.increaseLabel': 'Annual Increase (%)',
  'createContract.startDateLabel': 'Start Date',
  'createContract.endDateLabel': 'End Date',
  'createContract.datePlaceholder': 'Select date',
  'createContract.cancel': 'Cancel',
  'createContract.confirm': 'Confirm',
  'createContract.submit': 'Create Contract',

  // ── Reports ───────────────────────────────────────────────────────────────
  'reports.title': 'Reports',
  'reports.subtitle': 'Global payment overview',
  'reports.ytdRevenue': 'YEAR TO DATE REVENUE',
  'reports.trend': '↑ 12.4% vs last year',
  'reports.monthlyCollections': 'Monthly Collections',
  'reports.paymentBreakdown': 'Payment Breakdown',
  'reports.collected': 'Collected',
  'reports.pending': 'Pending',
  'reports.overdue': 'Overdue',

  // ── Login ─────────────────────────────────────────────────────────────────
  'login.brand': 'Estate Ledger',
  'login.heroTitle': 'Estate\nLedger.',
  'login.heroSubtitle': 'The sovereign platform for the discerning property curator.',
  'login.managedAssets': 'MANAGED ASSETS',
  'login.efficiencyGain': 'EFFICIENCY GAIN',
  'login.welcomeBack': 'Welcome Back',
  'login.emailLabel': 'Email',
  'login.emailPlaceholder': 'user@example.com',
  'login.passwordLabel': 'Password',
  'login.forgotPassword': 'Forgot Password?',
  'login.signIn': 'Sign In',
} as const;

const ar: typeof en = {
  // ── Avatar menu ──────────────────────────────────────────────────────────
  'menu.language': 'اللغة',
  'menu.languageEnglish': 'English',
  'menu.languageArabic': 'العربية',
  'menu.darkMode': 'الوضع الداكن',
  'menu.on': 'تشغيل',
  'menu.off': 'إيقاف',
  'menu.logout': 'تسجيل الخروج',
  'menu.cancel': 'إلغاء',

  // ── RTL alert ─────────────────────────────────────────────────────────────
  'alert.rtlTitle': 'تم تغيير اللغة',
  'alert.rtlMessage': 'يرجى إعادة تشغيل التطبيق لتطبيق تخطيط اللغة العربية.',
  'alert.ok': 'حسناً',

  // ── Bottom tab labels ─────────────────────────────────────────────────────
  'nav.dashboard': 'الرئيسية',
  'nav.properties': 'العقارات',
  'nav.tenants': 'المستأجرون',
  'nav.contracts': 'العقود',
  'nav.reports': 'التقارير',

  // ── Dashboard ─────────────────────────────────────────────────────────────
  'dashboard.headerTitle': 'المنسق السيادي',
  'dashboard.monthlyPerf': 'الأداء الشهري',
  'dashboard.expectedMonth': 'المتوقع هذا الشهر',
  'dashboard.collected': 'المحصّل',
  'dashboard.totalPortfolio': 'إجمالي المحفظة',
  'dashboard.rented': '3 مؤجرة • 2 متاحة',
  'dashboard.overduePayments': 'دفعات متأخرة',
  'dashboard.attentionReq': 'يستلزم الانتباه',
  'dashboard.activeRentals': 'الإيجارات النشطة',
  'dashboard.activeRentalsSubtitle': 'عرض شامل لأداء الإيجارات الحالية وصحتها المالية.',
  'dashboard.addContract': 'إضافة عقد جديد',
  'dashboard.viewDetails': 'عرض التفاصيل',
  'dashboard.collectPayment': 'تحصيل دفعة',
  'dashboard.paid': 'مدفوع',
  'dashboard.due': 'مستحق',
  'dashboard.late': 'متأخر',
  'dashboard.contractEnd': 'نهاية العقد',
  'dashboard.dueDate': 'تاريخ الاستحقاق',

  // ── Properties ────────────────────────────────────────────────────────────
  'properties.title': 'العقارات',
  'properties.subtitle': 'أصول في المحفظة',
  'properties.newButton': '+ عقار جديد',
  'properties.rented': 'مؤجر',
  'properties.available': 'متاح',
  'properties.overdue': 'متأخر',

  // ── Property Detail ───────────────────────────────────────────────────────
  'propertyDetail.headerTitle': 'تفاصيل العقار',
  'propertyDetail.rent': 'الإيجار الشهري',
  'propertyDetail.area': 'المساحة',
  'propertyDetail.sectionTenant': 'المستأجر الحالي',

  // ── Create Property ───────────────────────────────────────────────────────
  'createProperty.headerTitle': 'عقار جديد',
  'createProperty.name': 'اسم العقار',
  'createProperty.namePlaceholder': 'مثال: برج ميريديان',
  'createProperty.address': 'العنوان',
  'createProperty.addressPlaceholder': 'الشارع، الوحدة، المدينة',
  'createProperty.area': 'المساحة',
  'createProperty.areaPlaceholder': '0',
  'createProperty.submit': 'إضافة عقار',

  // ── Tenants ───────────────────────────────────────────────────────────────
  'tenants.title': 'المستأجرون',
  'tenants.subtitle': 'إيجارات نشطة',
  'tenants.newButton': '+ مستأجر جديد',
  'tenants.paid': 'مدفوع',
  'tenants.upcoming': 'قادم',
  'tenants.overdue': 'متأخر',

  // ── Create Tenant ─────────────────────────────────────────────────────────
  'createTenant.headerTitle': 'مستأجر جديد',
  'createTenant.fullName': 'الاسم الكامل',
  'createTenant.fullNamePlaceholder': 'الاسم القانوني الكامل',
  'createTenant.phone': 'الهاتف',
  'createTenant.phonePlaceholder': '01xxxxxxxxx',
  'createTenant.id': 'رقم الهوية',
  'createTenant.idPlaceholder': 'رقم الهوية',
  'createTenant.submit': 'إضافة مستأجر',

  // ── Contracts ─────────────────────────────────────────────────────────────
  'contracts.title': 'العقود',
  'contracts.subtitle': 'اتفاقيات',
  'contracts.newButton': '+ عقد جديد',
  'contracts.active': 'نشط',
  'contracts.expiring': 'ينتهي قريباً',
  'contracts.expired': 'منتهي',
  'contracts.terminated': 'منتهي مبكراً',

  // ── Contract Payments ─────────────────────────────────────────────────────
  'contractPayments.headerTitle': 'العقد والمدفوعات',
  'contractPayments.monthlyRent': 'الإيجار الشهري',
  'contractPayments.months': 'أشهر',
  'contractPayments.totalValue': 'القيمة الإجمالية',
  'contractPayments.paymentHistory': 'سجل المدفوعات',
  'contractPayments.paid': 'مدفوع',
  'contractPayments.upcoming': 'قادم',
  'contractPayments.overdue': 'متأخر',
  'contractPayments.voided': 'ملغي',
  'contractPayments.terminateButton': 'إنهاء العقد مبكراً',
  'contractPayments.terminateTitle': 'إنهاء العقد',
  'contractPayments.terminateMessage': 'سيؤدي هذا إلى إلغاء جميع المدفوعات القادمة وتعليم العقد كمنتهٍ. لا يمكن التراجع عن هذا الإجراء.',
  'contractPayments.terminateConfirm': 'إنهاء',
  'contractPayments.terminateCancel': 'إلغاء',
  'contractPayments.terminatedBanner': 'تم إنهاء العقد مبكراً',

  // ── Create Contract ───────────────────────────────────────────────────────
  'createContract.headerTitle': 'عقد جديد',
  'createContract.tenantLabel': 'اسم المستأجر',
  'createContract.tenantPlaceholder': 'اختر مستأجراً',
  'createContract.propertyLabel': 'العقار',
  'createContract.propertyPlaceholder': 'اختر عقاراً',
  'createContract.rentLabel': 'الإيجار الشهري',
  'createContract.intervalLabel': 'فترة الدفع',
  'createContract.intervalPlaceholder': 'اختر الفترة',
  'createContract.depositLabel': 'مبلغ التأمين',
  'createContract.increaseLabel': 'الزيادة السنوية (%)',
  'createContract.startDateLabel': 'تاريخ البداية',
  'createContract.endDateLabel': 'تاريخ النهاية',
  'createContract.datePlaceholder': 'اختر تاريخاً',
  'createContract.cancel': 'إلغاء',
  'createContract.confirm': 'تأكيد',
  'createContract.submit': 'إنشاء عقد',

  // ── Reports ───────────────────────────────────────────────────────────────
  'reports.title': 'التقارير',
  'reports.subtitle': 'نظرة عامة على المدفوعات',
  'reports.ytdRevenue': 'الإيرادات حتى الآن',
  'reports.trend': '↑ 12.4% مقارنة بالعام الماضي',
  'reports.monthlyCollections': 'التحصيلات الشهرية',
  'reports.paymentBreakdown': 'تفصيل المدفوعات',
  'reports.collected': 'محصّل',
  'reports.pending': 'معلق',
  'reports.overdue': 'متأخر',

  // ── Login ─────────────────────────────────────────────────────────────────
  'login.brand': 'سجل العقارات',
  'login.heroTitle': 'سجل\nالعقارات.',
  'login.heroSubtitle': 'المنصة السيادية لمنسق العقارات المميز.',
  'login.managedAssets': 'الأصول المدارة',
  'login.efficiencyGain': 'كفاءة مكتسبة',
  'login.welcomeBack': 'مرحباً بعودتك',
  'login.cardSubtitle': 'يرجى التعريف بنفسك للوصول إلى المحفظة.',
  'login.emailLabel': 'البريد المؤسسي',
  'login.emailPlaceholder': 'curator@estateledger.com',
  'login.passwordLabel': 'كلمة المرور',
  'login.forgotPassword': 'نسيت كلمة المرور؟',
  'login.signIn': 'تسجيل الدخول',
  'login.secureBiometrics': 'البيومتري الآمن',
  'login.faceId': 'التعرف على الوجه',
  'login.touchId': 'بصمة الإصبع',
  'login.footerText': 'للاستخدام المصرح به فقط.',
  'login.footerLink': 'بروتوكول السرية.',
};

export type TranslationKey = keyof typeof en;

export const translations: Record<Language, typeof en> = { en, ar };
