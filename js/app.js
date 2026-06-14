// ========== المتغير العام للبيانات ==========
let farmData = loadData();

// ========== تهيئة التطبيق عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    initUI();
    
    // تحديث تلقائي كل دقيقة
    setInterval(function() {
        calculateAll();
    }, 60000);
    
    console.log('✅ تم تحميل نظام إدارة مزارع الدواجن بنجاح');
    console.log('📦 وزن الشيكارة:', BAG_WEIGHT_KG, 'كجم');
    console.log('🏠 عدد العنابر: 3');
});

// ========== حفظ البيانات عند الخروج ==========
window.addEventListener('beforeunload', function() {
    saveData();
});

// ========== دعم الاختصارات ==========
document.addEventListener('keydown', function(e) {
    // Ctrl + S لحفظ البيانات
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveData();
        alert('✅ تم حفظ البيانات');
    }
    
    // Ctrl + E لتصدير البيانات
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// ========== معلومات التطبيق ==========
function getAppInfo() {
    return {
        name: 'نظام إدارة مزارع الدواجن الشامل',
        version: '4.0',
        barns: 3,
        bagWeight: BAG_WEIGHT_KG + ' كجم',
        cycleDuration: '45 يوم',
        features: [
            'متابعة 3 عنابر',
            'حساب FCR تلقائي',
            'حساب التهوية CFM',
            'العلف بالشيكارة (50 كجم)',
            'البرنامج الطبي اليومي',
            'المعايير المعيارية',
            'تصدير واستيراد البيانات',
            'تخزين محلي تلقائي'
        ]
    };
}
