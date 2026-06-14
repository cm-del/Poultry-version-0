// ========== متغير العنبر الحالي ==========
let currentBarn = 0;

// ========== التبديل بين العنابر ==========
function switchBarn(barnIndex) {
    currentBarn = barnIndex;
    
    // تحديث التبويبات
    const tabs = document.querySelectorAll('.barn-tab');
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === barnIndex);
    });
    
    // تحديث عنوان الجدول
    document.getElementById('barnTitle').textContent = 'عنبر ' + (barnIndex + 1);
    
    // إعادة رسم الجدول والحسابات
    renderTable();
    calculateAll();
}

// ========== رسم جدول الدورة ==========
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const barn = farmData.barns[currentBarn];
    const age = getCycleAge();
    
    let html = '';
    
    for (let i = 0; i < cycleData.length; i++) {
        const dayData = cycleData[i];
        const day = dayData.day;
        
        // جلب البيانات المحفوظة أو إنشاء بيانات فارغة
        const saved = barn[i] || { dead: '', feed: '', weight: '' };
        
        // تحديد إذا كان هذا هو اليوم الحالي
        const isToday = day === age;
        const rowClass = isToday ? 'today-row' : '';
        
        // العلف المتوقع والوزن المتوقع
        const expectedFeed = getExpectedFeedBags(day);
        const expectedWeight = getExpectedWeight(day);
        
        html += `<tr class="${rowClass}">
            <td><strong>${day}</strong></td>
            <td>${dayData.temp}</td>
            <td>${dayData.hum}</td>
            <td>${dayData.dark} ساعة</td>
            <td>${dayData.feed}</td>
            <td>${dayData.med}</td>
            <td>
                <input type="number" class="input-cell" 
                    value="${saved.dead}" 
                    min="0" 
                    onchange="updateDayData(${i}, 'dead', this.value)">
            </td>
            <td>
                <input type="number" class="input-cell" 
                    value="${saved.feed}" 
                    min="0" step="0.1"
                    onchange="updateDayData(${i}, 'feed', this.value)">
            </td>
            <td>
                <input type="number" class="input-cell" 
                    value="${saved.weight}" 
                    min="0" step="1"
                    onchange="updateDayData(${i}, 'weight', this.value)">
            </td>
            <td>${expectedFeed}</td>
            <td>${expectedWeight}</td>
        </tr>`;
    }
    
    tbody.innerHTML = html;
}

// ========== تحديث بيانات يوم معين ==========
function updateDayData(dayIndex, field, value) {
    const barn = farmData.barns[currentBarn];
    
    // تأكد من وجود العنصر
    while (barn.length <= dayIndex) {
        barn.push({ dead: '', feed: '', weight: '' });
    }
    
    barn[dayIndex][field] = value;
    saveData();
    calculateAll();
}

// ========== تمييز صف اليوم الحالي ==========
function highlightTodayRow(age) {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach((row, index) => {
        if (index + 1 === age) {
            row.classList.add('today-row');
            // تمرير تلقائي للصف
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            row.classList.remove('today-row');
        }
    });
}

// ========== تهيئة الواجهة ==========
function initUI() {
    loadSetup();
    renderTable();
    calculateAll();
}
