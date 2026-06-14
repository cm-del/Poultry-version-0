// ========== إدارة التخزين المحلي ==========

const STORAGE_KEY = 'poultryFarmData_v4';

// تحميل البيانات من التخزين المحلي
function loadData() {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('خطأ في تحميل البيانات:', e);
        }
    }
    return getDefaultData();
}

// الحصول على البيانات الافتراضية
function getDefaultData() {
    return {
        setup: { 
            startDate: '', 
            chickCount: 10000, 
            feedStorage: 1000, 
            avgWeight: 0 
        },
        barns: [[], [], []]
    };
}

// حفظ البيانات في التخزين المحلي
function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(farmData));
        return true;
    } catch (e) {
        console.error('خطأ في حفظ البيانات:', e);
        return false;
    }
}

// حفظ إعدادات الدورة
function saveSetup() {
    farmData.setup.startDate = document.getElementById('startDate').value;
    farmData.setup.chickCount = parseInt(document.getElementById('chickCount').value) || 10000;
    farmData.setup.feedStorage = parseInt(document.getElementById('feedStorage').value) || 1000;
    farmData.setup.avgWeight = parseFloat(document.getElementById('avgWeight').value) || 0;
    saveData();
}

// تحميل إعدادات الدورة للواجهة
function loadSetup() {
    document.getElementById('startDate').value = farmData.setup.startDate || '';
    document.getElementById('chickCount').value = farmData.setup.chickCount || 10000;
    document.getElementById('feedStorage').value = farmData.setup.feedStorage || 1000;
    document.getElementById('avgWeight').value = farmData.setup.avgWeight || 0;
}

// مسح جميع البيانات
function resetData() {
    if (confirm('⚠️ هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع!')) {
        localStorage.removeItem(STORAGE_KEY);
        farmData = getDefaultData();
        loadSetup();
        renderTable();
        calculateAll();
        alert('✅ تم مسح جميع البيانات بنجاح');
    }
}

// تصدير البيانات كملف JSON
function exportData() {
    const dataStr = JSON.stringify(farmData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poultry_farm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// استيراد البيانات من ملف
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.setup && imported.barns) {
                farmData = imported;
                saveData();
                loadSetup();
                renderTable();
                calculateAll();
                alert('✅ تم استيراد البيانات بنجاح');
            } else {
                alert('❌ ملف غير صالح');
            }
        } catch (e) {
            alert('❌ خطأ في قراءة الملف');
        }
    };
    reader.readAsText(file);
}
