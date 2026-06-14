// ========== حساب عمر الدورة ==========
function getCycleAge() {
    if (!farmData.setup.startDate) return 0;
    const start = new Date(farmData.setup.startDate);
    const today = new Date();
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, Math.min(diffDays, 45));
}

// ========== حساب إجمالي النافق لعنبر معين ==========
function getTotalDead(barnIndex) {
    const barn = farmData.barns[barnIndex];
    let total = 0;
    for (let i = 0; i < barn.length; i++) {
        total += parseInt(barn[i].dead) || 0;
    }
    return total;
}

// ========== حساب إجمالي العلف بالشيكارة ==========
function getTotalBags(barnIndex) {
    const barn = farmData.barns[barnIndex];
    let total = 0;
    for (let i = 0; i < barn.length; i++) {
        total += parseFloat(barn[i].feed) || 0;
    }
    return total;
}

// ========== تحويل الشيكارة إلى كجم ==========
function bagsToKg(bags) {
    return bags * BAG_WEIGHT_KG;
}

// ========== حساب الطيور الحية ==========
function getLiveBirds(barnIndex) {
    const initial = farmData.setup.chickCount;
    const dead = getTotalDead(barnIndex);
    return Math.max(0, initial - dead);
}

// ========== حساب نسبة النفوق ==========
function getMortalityRate(barnIndex) {
    const initial = farmData.setup.chickCount;
    if (initial === 0) return 0;
    const dead = getTotalDead(barnIndex);
    return ((dead / initial) * 100).toFixed(2);
}

// ========== حساب معامل التحويل FCR ==========
function calculateFCR(barnIndex) {
    const liveBirds = getLiveBirds(barnIndex);
    const avgWeightKg = farmData.setup.avgWeight;
    const totalKg = bagsToKg(getTotalBags(barnIndex));
    
    if (liveBirds === 0 || avgWeightKg === 0) return 0;
    
    const totalWeightKg = liveBirds * avgWeightKg;
    return (totalKg / totalWeightKg).toFixed(2);
}

// ========== حساب الاستهلاك اليومي للطائر (جم) ==========
function getDailyFeedPerBird(barnIndex) {
    const liveBirds = getLiveBirds(barnIndex);
    const totalKg = bagsToKg(getTotalBags(barnIndex));
    const age = getCycleAge();
    
    if (liveBirds === 0 || age === 0) return 0;
    
    return ((totalKg * 1000) / (liveBirds * age)).toFixed(1);
}

// ========== حساب التهوية CFM ==========
function calculateVentilation(barnIndex) {
    const liveBirds = getLiveBirds(barnIndex);
    const age = getCycleAge();
    const factor = getVentilationFactor(age);
    return Math.round(liveBirds * factor);
}

// ========== حساب العلف المتبقي بالمخزن ==========
function getRemainingFeed() {
    const totalStorage = farmData.setup.feedStorage;
    let totalUsed = 0;
    for (let i = 0; i < 3; i++) {
        totalUsed += getTotalBags(i);
    }
    return Math.max(0, totalStorage - totalUsed);
}

// ========== حساب نسبة استهلاك العلف ==========
function getFeedConsumptionPercent() {
    const totalStorage = farmData.setup.feedStorage;
    if (totalStorage === 0) return 0;
    let totalUsed = 0;
    for (let i = 0; i < 3; i++) {
        totalUsed += getTotalBags(i);
    }
    return Math.min(100, ((totalUsed / totalStorage) * 100)).toFixed(1);
}

// ========== حساب نسبة تقدم الدورة ==========
function getCycleProgressPercent() {
    const age = getCycleAge();
    return Math.min(100, ((age / 45) * 100)).toFixed(1);
}

// ========== حساب العلف المتوقع تراكمياً (شيكارة) ==========
function getExpectedFeedBags(day) {
    const liveBirds = getLiveBirds(currentBarn);
    const cumulativeGrams = standardFeedCumulative[day] || 0;
    return ((liveBirds * cumulativeGrams) / (BAG_WEIGHT_KG * 1000)).toFixed(1);
}

// ========== حساب الوزن المعياري ==========
function getExpectedWeight(day) {
    return standardWeight[day] || 0;
}

// ========== تنفيذ جميع الحسابات وتحديث الواجهة ==========
function calculateAll() {
    const barnIndex = currentBarn;
    const age = getCycleAge();
    
    // تحديث عمر الدورة
    document.getElementById('currentAge').textContent = age + ' يوم';
    
    // الإحصائيات
    document.getElementById('totalDead').textContent = getTotalDead(barnIndex);
    document.getElementById('mortalityRate').textContent = getMortalityRate(barnIndex) + '%';
    document.getElementById('totalBags').textContent = getTotalBags(barnIndex).toFixed(1);
    document.getElementById('totalKg').textContent = bagsToKg(getTotalBags(barnIndex)).toFixed(0);
    document.getElementById('fcrValue').textContent = calculateFCR(barnIndex);
    document.getElementById('liveBirds').textContent = getLiveBirds(barnIndex);
    document.getElementById('remainingBags').textContent = getRemainingFeed().toFixed(1);
    document.getElementById('dailyFeedPerBird').textContent = getDailyFeedPerBird(barnIndex);
    document.getElementById('ventilationRate').textContent = calculateVentilation(barnIndex);
    
    // أشرطة التقدم
    const feedPercent = getFeedConsumptionPercent();
    document.getElementById('feedPercent').textContent = feedPercent + '%';
    document.getElementById('feedProgressBar').style.width = feedPercent + '%';
    
    const cyclePercent = getCycleProgressPercent();
    document.getElementById('cyclePercent').textContent = cyclePercent + '%';
    document.getElementById('cycleProgressBar').style.width = cyclePercent + '%';
    
    // تمييز صف اليوم الحالي في الجدول
    highlightTodayRow(age);
}
