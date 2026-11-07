/**
 * TTC Online Admission System - Admin Portal Logic & Realtime Analytics
 * วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
 */

let chartMajorInstance = null;
let chartLevelInstance = null;
let chartSchoolInstance = null;
let chartReferralInstance = null;

document.addEventListener("DOMContentLoaded", function() {
  // Ensure DB initialized
  TTC_DB.init();

  // Initialize UI Components
  initAdminDashboard();
  initApplicantTable();
  initFilterControls();
  initNotificationCenter();
  initExportButtons();
  initLineSettingsModal();
});

// ==========================================================================
// 1. DASHBOARD & ANALYTICS (CHART.JS)
// ==========================================================================
function initAdminDashboard() {
  renderKpiCards();
  renderCharts();
}

function renderKpiCards() {
  const stats = TTC_DB.getAnalytics();

  const elTotal = document.getElementById("statTotal");
  const elPending = document.getElementById("statPending");
  const elPassed = document.getElementById("statPassed");
  const elEnrolled = document.getElementById("statEnrolled");
  const elIncomplete = document.getElementById("statIncomplete");

  if (elTotal) elTotal.textContent = stats.total;
  if (elPending) elPending.textContent = stats.pending;
  if (elPassed) elPassed.textContent = stats.passed;
  if (elEnrolled) elEnrolled.textContent = stats.enrolled;
  if (elIncomplete) elIncomplete.textContent = stats.incomplete;
}

function renderCharts() {
  const stats = TTC_DB.getAnalytics();

  // Chart 1: Applicants by Major
  const ctxMajor = document.getElementById("chartMajor")?.getContext("2d");
  if (ctxMajor) {
    if (chartMajorInstance) chartMajorInstance.destroy();

    const labels = Object.keys(stats.byMajor);
    const dataVals = Object.values(stats.byMajor);

    chartMajorInstance = new Chart(ctxMajor, {
      type: "bar",
      data: {
        labels: labels.map(l => l.length > 25 ? l.substring(0, 25) + "..." : l),
        datasets: [{
          label: "จำนวนผู้สมัคร (คน)",
          data: dataVals,
          backgroundColor: "#1E40AF",
          borderRadius: 6,
          hoverBackgroundColor: "#2563EB"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => labels[items[0].dataIndex]
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          },
          x: {
            ticks: {
              font: { size: 10 },
              maxRotation: 45,
              minRotation: 25
            }
          }
        }
      }
    });
  }

  // Chart 2: Level Ratio (ปวช. vs ปวส.)
  const ctxLevel = document.getElementById("chartLevel")?.getContext("2d");
  if (ctxLevel) {
    if (chartLevelInstance) chartLevelInstance.destroy();

    chartLevelInstance = new Chart(ctxLevel, {
      type: "doughnut",
      data: {
        labels: ["ระดับ ปวช.", "ระดับ ปวส."],
        datasets: [{
          data: [stats.vcCount, stats.dvsCount],
          backgroundColor: ["#2563EB", "#D97706"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }
        },
        cutout: "68%"
      }
    });
  }

  // Chart 3: Previous School Breakdown
  const ctxSchool = document.getElementById("chartSchool")?.getContext("2d");
  if (ctxSchool) {
    if (chartSchoolInstance) chartSchoolInstance.destroy();

    const schoolLabels = Object.keys(stats.bySchool).slice(0, 6);
    const schoolVals = schoolLabels.map(k => stats.bySchool[k]);

    chartSchoolInstance = new Chart(ctxSchool, {
      type: "bar",
      data: {
        labels: schoolLabels,
        datasets: [{
          label: "ผู้สมัคร",
          data: schoolVals,
          backgroundColor: "#059669",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  // Chart 4: Referral Channel Breakdown
  const ctxRef = document.getElementById("chartReferral")?.getContext("2d");
  if (ctxRef) {
    if (chartReferralInstance) chartReferralInstance.destroy();

    const refLabels = Object.keys(stats.byReferral);
    const refVals = Object.values(stats.byReferral);

    chartReferralInstance = new Chart(ctxRef, {
      type: "pie",
      data: {
        labels: refLabels,
        datasets: [{
          data: refVals,
          backgroundColor: [
            "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", 
            "#EC4899", "#06B6D4", "#64748B", "#F97316"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } }
        }
      }
    });
  }
}

// ==========================================================================
// 2. APPLICANT MANAGEMENT TABLE & FILTERING
// ==========================================================================
let currentFilters = {
  search: "",
  academicYear: "all",
  level: "all",
  majorCode: "all",
  status: "all"
};

function initFilterControls() {
  const searchInput = document.getElementById("adminSearchInput");
  const yearSelect = document.getElementById("filterYear");
  const levelSelect = document.getElementById("filterLevel");
  const majorSelect = document.getElementById("filterMajor");
  const statusSelect = document.getElementById("filterStatus");

  // Populate Major filter dynamically when level changes
  if (levelSelect && majorSelect) {
    levelSelect.addEventListener("change", function() {
      currentFilters.level = this.value;
      currentFilters.majorCode = "all";
      populateFilterMajors(this.value);
      renderApplicantTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function() {
      currentFilters.search = this.value;
      renderApplicantTable();
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener("change", function() {
      currentFilters.academicYear = this.value;
      renderApplicantTable();
    });
  }

  if (majorSelect) {
    majorSelect.addEventListener("change", function() {
      currentFilters.majorCode = this.value;
      renderApplicantTable();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", function() {
      currentFilters.status = this.value;
      renderApplicantTable();
    });
  }

  // Reset Filters Button
  const btnReset = document.getElementById("btnResetFilters");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      currentFilters = { search: "", academicYear: "all", level: "all", majorCode: "all", status: "all" };
      if (searchInput) searchInput.value = "";
      if (yearSelect) yearSelect.value = "all";
      if (levelSelect) levelSelect.value = "all";
      if (statusSelect) statusSelect.value = "all";
      populateFilterMajors("all");
      renderApplicantTable();
    });
  }

  // Reset Demo Data Button
  const btnResetDemo = document.getElementById("btnResetDemoData");
  if (btnResetDemo) {
    btnResetDemo.addEventListener("click", () => {
      if (confirm("ต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?")) {
        TTC_DB.resetDemo();
        initAdminDashboard();
        renderApplicantTable();
        alert("รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว");
      }
    });
  }

  populateFilterMajors("all");
}

function populateFilterMajors(level) {
  const majorSelect = document.getElementById("filterMajor");
  if (!majorSelect) return;

  majorSelect.innerHTML = '<option value="all">-- สาขาวิชาทั้งหมด --</option>';

  let progs = [];
  if (level === "all") {
    progs = [...(TTC_PROGRAMS["ปวช."] || []), ...(TTC_PROGRAMS["ปวส."] || [])];
  } else {
    progs = TTC_PROGRAMS[level] || [];
  }

  // Remove duplicates by code
  const seen = new Set();
  progs.forEach(p => {
    if (!seen.has(p.code)) {
      seen.add(p.code);
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `[${p.code}] ${p.name}`;
      majorSelect.appendChild(opt);
    }
  });
}

function initApplicantTable() {
  renderApplicantTable();
}

function renderApplicantTable() {
  const tbody = document.getElementById("applicantTableBody");
  const countBadge = document.getElementById("tableRecordCount");
  if (!tbody) return;

  const applicants = TTC_DB.getApplicants(currentFilters);

  if (countBadge) {
    countBadge.textContent = `พบ ${applicants.length} รายการ`;
  }

  if (applicants.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-gray-500">
          <i class="fa-solid fa-folder-open text-3xl mb-2 text-gray-300"></i>
          <div>ไม่พบข้อมูลผู้สมัครตามเงื่อนไขที่ระบุ</div>
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  applicants.forEach((item, index) => {
    const statusObj = APPLICATION_STATUSES[item.status] || {
      label: item.status,
      badgeClass: "badge-status-pending"
    };

    const hasDocs = item.documents?.photo || item.documents?.idCardDoc || item.documents?.houseDoc || item.documents?.transcriptDoc;

    html += `
      <tr class="hover:bg-slate-50 transition border-b border-gray-100">
        <td class="px-4 py-3 text-center text-xs text-gray-500">${index + 1}</td>
        <td class="px-4 py-3">
          <div class="font-bold text-blue-900 text-sm">${item.id}</div>
          <div class="text-xs text-gray-500">ปี ${item.academicYear}</div>
          ${item.studentId ? `<div class="text-xs text-purple-700 font-semibold mt-0.5"><i class="fa-solid fa-id-badge"></i> ${item.studentId}</div>` : ''}
        </td>
        <td class="px-4 py-3">
          <div class="font-semibold text-gray-900 text-sm">${item.prefix}${item.firstName} ${item.lastName}</div>
          <div class="text-xs text-gray-500"><i class="fa-regular fa-id-card"></i> ${TTC_VALIDATOR.formatThaiCitizenId(item.idCard)}</div>
          <div class="text-xs text-gray-500"><i class="fa-solid fa-phone"></i> ${TTC_VALIDATOR.formatThaiPhone(item.phone)}</div>
        </td>
        <td class="px-4 py-3">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${item.level === 'ปวช.' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">
            ${item.level}
          </span>
          <div class="text-xs font-medium text-gray-800 mt-1">${item.majorName}</div>
        </td>
        <td class="px-4 py-3 text-xs text-gray-600">
          <div>${item.previousEducation?.schoolName || '-'}</div>
          <div>GPAX: <strong class="text-emerald-700">${item.previousEducation?.gpax || '-'}</strong></div>
        </td>
        <td class="px-4 py-3 text-center">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusObj.badgeClass}">
            ${statusObj.label}
          </span>
          ${item.statusNotes ? `<div class="text-[11px] text-gray-500 truncate max-w-[160px] mt-1" title="${item.statusNotes}">${item.statusNotes}</div>` : ''}
        </td>
        <td class="px-4 py-3 text-center">
          ${hasDocs ? 
            `<button onclick="viewApplicantDetails('${item.id}', 'docs')" class="text-blue-600 hover:text-blue-800 text-xs font-medium inline-flex items-center">
              <i class="fa-solid fa-paperclip mr-1"></i> ดูเอกสาร
            </button>` : 
            `<span class="text-xs text-gray-400">ไม่มี</span>`
          }
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end space-x-1">
            <button onclick="viewApplicantDetails('${item.id}')" title="ดูรายละเอียดผู้สมัคร" class="p-1.5 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded">
              <i class="fa-solid fa-eye text-sm"></i>
            </button>
            <button onclick="openStatusModal('${item.id}')" title="เปลี่ยนสถานะการสมัคร" class="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded">
              <i class="fa-solid fa-pen-to-square text-sm"></i>
            </button>
            <button onclick="openEnrollModal('${item.id}')" title="บันทึกการมอบตัว & รหัสนักศึกษา" class="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded">
              <i class="fa-solid fa-user-check text-sm"></i>
            </button>
            <a href="print-application.html?id=${item.id}" target="_blank" title="พิมพ์ใบสมัคร (PDF)" class="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded">
              <i class="fa-solid fa-print text-sm"></i>
            </a>
            <button onclick="deleteApplicantRow('${item.id}')" title="ลบข้อมูล" class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded">
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// ==========================================================================
// 3. APPLICANT DETAIL & DOCUMENT INSPECTION MODAL
// ==========================================================================
function viewApplicantDetails(id, defaultTab = 'info') {
  const applicant = TTC_DB.getApplicantById(id);
  if (!applicant) return;

  const modal = document.getElementById("applicantDetailModal");
  if (!modal) return;

  // Header Info
  document.getElementById("modalDetailTitle").textContent = `ข้อมูลผู้สมัคร: ${applicant.id} - ${applicant.prefix}${applicant.firstName} ${applicant.lastName}`;
  
  // Tab 1: Info Tab
  const infoContainer = document.getElementById("tabContentInfo");
  if (infoContainer) {
    const addr = applicant.address || {};
    const edu = applicant.previousEducation || {};
    const par = applicant.parentInfo || {};

    infoContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 class="font-bold text-blue-900 text-sm mb-2 border-b pb-1">
            <i class="fa-solid fa-user mr-1 text-blue-700"></i> ข้อมูลส่วนตัว
          </h5>
          <div class="space-y-1 text-xs text-gray-700">
            <div><span class="text-gray-500">เลขประจำตัวประชาชน:</span> <strong>${TTC_VALIDATOR.formatThaiCitizenId(applicant.idCard)}</strong></div>
            <div><span class="text-gray-500">วันเดือนปีเกิด:</span> ${TTC_VALIDATOR.formatThaiDate(applicant.birthDate)} (อายุ ${TTC_VALIDATOR.calculateAge(applicant.birthDate)})</div>
            <div><span class="text-gray-500">สัญชาติ / ศาสนา / หมู่เลือด:</span> ${applicant.nationality} / ${applicant.religion} / ${applicant.bloodGroup}</div>
            <div><span class="text-gray-500">เบอร์โทรศัพท์:</span> ${TTC_VALIDATOR.formatThaiPhone(applicant.phone)}</div>
            <div><span class="text-gray-500">อีเมล:</span> ${applicant.email || '-'}</div>
            <div><span class="text-gray-500">ที่อยู่:</span> ${addr.houseNo} ม.${addr.moo || '-'} ต.${addr.subDistrict} อ.${addr.district} จ.${addr.province} ${addr.postalCode}</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 class="font-bold text-emerald-900 text-sm mb-2 border-b pb-1">
            <i class="fa-solid fa-graduation-cap mr-1 text-emerald-700"></i> ข้อมูลการสมัคร & การศึกษาเดิม
          </h5>
          <div class="space-y-1 text-xs text-gray-700">
            <div><span class="text-gray-500">ปีการศึกษา / ระดับชั้น:</span> ${applicant.academicYear} / <strong>${applicant.level}</strong></div>
            <div><span class="text-gray-500">สาขาวิชา:</span> <strong>[${applicant.majorCode}] ${applicant.majorName}</strong></div>
            <div><span class="text-gray-500">สถานศึกษาเดิม:</span> ${edu.schoolName} (จ.${edu.province})</div>
            <div><span class="text-gray-500">วุฒิที่จบ:</span> ${edu.degree || '-'}</div>
            <div><span class="text-gray-500">เกรดเฉลี่ยสะสม (GPAX):</span> <strong class="text-emerald-700">${edu.gpax || '-'}</strong></div>
            <div><span class="text-gray-500">ช่องทางการแนะแนว:</span> ${applicant.referral || '-'}</div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
          <h5 class="font-bold text-amber-900 text-sm mb-2 border-b pb-1">
            <i class="fa-solid fa-people-roof mr-1 text-amber-700"></i> ข้อมูลครอบครัวและผู้ปกครอง
          </h5>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700">
            <div><span class="text-gray-500">บิดา:</span> ${par.fatherName || '-'} (โทร: ${par.fatherPhone || '-'})</div>
            <div><span class="text-gray-500">มารดา:</span> ${par.motherName || '-'} (โทร: ${par.motherPhone || '-'})</div>
            <div><span class="text-gray-500">ผู้ปกครอง:</span> ${par.guardianName || '-'} (${par.guardianRelation || '-'}) โทร: ${par.guardianPhone || '-'}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Tab 2: Documents Tab
  const docsContainer = document.getElementById("tabContentDocs");
  if (docsContainer) {
    const docs = applicant.documents || {};
    const docItems = [
      { label: "1. รูปถ่ายหน้าตรง", val: docs.photo, icon: "fa-image" },
      { label: "2. สำเนาบัตรประจำตัวประชาชน", val: docs.idCardDoc, icon: "fa-id-card" },
      { label: "3. สำเนาทะเบียนบ้าน", val: docs.houseDoc, icon: "fa-house" },
      { label: "4. ใบแสดงผลการเรียน (รบ. / ปพ.1)", val: docs.transcriptDoc, icon: "fa-file-lines" }
    ];

    let docsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    docItems.forEach(doc => {
      docsHtml += `
        <div class="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between">
          <div class="font-semibold text-xs text-gray-700 mb-2 flex items-center justify-between">
            <span><i class="fa-solid ${doc.icon} mr-1 text-blue-600"></i> ${doc.label}</span>
            ${doc.val ? '<span class="text-emerald-600 font-bold text-xs"><i class="fa-solid fa-check"></i> แนบแล้ว</span>' : '<span class="text-rose-500 font-bold text-xs"><i class="fa-solid fa-xmark"></i> ยังไม่แนบ</span>'}
          </div>
          <div class="min-h-[140px] flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200 p-2">
            ${doc.val ? 
              (doc.val.startsWith("data:image/") || doc.val.endsWith(".jpg") || doc.val.endsWith(".png") ? 
                `<img src="${doc.val}" class="max-h-32 object-contain cursor-pointer hover:scale-105 transition" onclick="previewImageZoom('${doc.val}')" alt="${doc.label}" title="คลิกเพื่อดูภาพขนาดใหญ่" />` : 
                `<div class="text-center p-3"><i class="fa-solid fa-file-pdf text-rose-600 text-3xl mb-1"></i><div class="text-xs text-gray-600">ไฟล์เอกสาร PDF</div></div>`
              ) : 
              `<span class="text-xs text-gray-400"><i class="fa-regular fa-image text-2xl block mb-1"></i>ไม่มีเอกสาร</span>`
            }
          </div>
        </div>
      `;
    });
    docsHtml += '</div>';
    docsContainer.innerHTML = docsHtml;
  }

  // Switch Tab
  switchDetailTab(defaultTab);

  modal.classList.remove("hidden");
}

function switchDetailTab(tabName) {
  const btnInfo = document.getElementById("btnTabInfo");
  const btnDocs = document.getElementById("btnTabDocs");
  const contentInfo = document.getElementById("tabContentInfo");
  const contentDocs = document.getElementById("tabContentDocs");

  if (tabName === "docs") {
    btnDocs?.classList.add("border-blue-600", "text-blue-600", "font-bold");
    btnDocs?.classList.remove("text-gray-500");
    btnInfo?.classList.remove("border-blue-600", "text-blue-600", "font-bold");
    btnInfo?.classList.add("text-gray-500");
    contentDocs?.classList.remove("hidden");
    contentInfo?.classList.add("hidden");
  } else {
    btnInfo?.classList.add("border-blue-600", "text-blue-600", "font-bold");
    btnInfo?.classList.remove("text-gray-500");
    btnDocs?.classList.remove("border-blue-600", "text-blue-600", "font-bold");
    btnDocs?.classList.add("text-gray-500");
    contentInfo?.classList.remove("hidden");
    contentDocs?.classList.add("hidden");
  }
}

function closeDetailModal() {
  document.getElementById("applicantDetailModal")?.classList.add("hidden");
}

function previewImageZoom(src) {
  const zoomModal = document.getElementById("imageZoomModal");
  const zoomImg = document.getElementById("zoomModalImage");
  if (zoomModal && zoomImg) {
    zoomImg.src = src;
    zoomModal.classList.remove("hidden");
  }
}

function closeZoomModal() {
  document.getElementById("imageZoomModal")?.classList.add("hidden");
}

// ==========================================================================
// 4. STATUS CHANGE MODAL
// ==========================================================================
let currentEditingApplicantId = null;

function openStatusModal(id) {
  currentEditingApplicantId = id;
  const applicant = TTC_DB.getApplicantById(id);
  if (!applicant) return;

  const modal = document.getElementById("statusUpdateModal");
  if (!modal) return;

  document.getElementById("statusModalAppId").textContent = applicant.id;
  document.getElementById("statusModalApplicantName").textContent = `${applicant.prefix}${applicant.firstName} ${applicant.lastName}`;
  
  const selectStatus = document.getElementById("modalSelectStatus");
  const inputNotes = document.getElementById("modalStatusNotes");

  if (selectStatus) selectStatus.value = applicant.status;
  if (inputNotes) inputNotes.value = applicant.statusNotes || "";

  modal.classList.remove("hidden");
}

function closeStatusModal() {
  document.getElementById("statusUpdateModal")?.classList.add("hidden");
}

function saveStatusUpdate() {
  if (!currentEditingApplicantId) return;

  const newStatus = document.getElementById("modalSelectStatus").value;
  const notes = document.getElementById("modalStatusNotes").value.trim();

  TTC_DB.updateApplicantStatus(currentEditingApplicantId, newStatus, notes);

  closeStatusModal();
  renderKpiCards();
  renderCharts();
  renderApplicantTable();
  alert("อัปเดตสถานะผู้สมัครเรียบร้อยแล้ว");
}

// Quick preset reason helper
function setQuickReason(text) {
  const inputNotes = document.getElementById("modalStatusNotes");
  if (inputNotes) {
    inputNotes.value = text;
  }
}

// ==========================================================================
// 5. ENROLLMENT & STUDENT ID GENERATION MODAL (การมอบตัว)
// ==========================================================================
function openEnrollModal(id) {
  currentEditingApplicantId = id;
  const applicant = TTC_DB.getApplicantById(id);
  if (!applicant) return;

  const modal = document.getElementById("enrollmentModal");
  if (!modal) return;

  document.getElementById("enrollAppId").textContent = applicant.id;
  document.getElementById("enrollApplicantName").textContent = `${applicant.prefix}${applicant.firstName} ${applicant.lastName}`;
  document.getElementById("enrollMajorName").textContent = `${applicant.level} ${applicant.majorName}`;

  // Suggest or load student ID
  const studentIdInput = document.getElementById("enrollStudentId");
  if (studentIdInput) {
    if (applicant.studentId) {
      studentIdInput.value = applicant.studentId;
    } else {
      const yr = (applicant.academicYear || TTC_COLLEGE_INFO.currentAcademicYear).slice(-2);
      const code = applicant.majorCode || "20101";
      const randomSeq = String(Math.floor(Math.random() * 800) + 100).padStart(4, '0');
      studentIdInput.value = `${yr}${code}${randomSeq}`;
    }
  }

  // Contract signer & parent info
  const signerInput = document.getElementById("enrollSigner");
  const relationInput = document.getElementById("enrollSignerRelation");
  const dateInput = document.getElementById("enrollDate");

  if (signerInput) signerInput.value = applicant.parentInfo?.guardianName || "";
  if (relationInput) relationInput.value = applicant.parentInfo?.guardianRelation || "ผู้ปกครอง";
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];

  modal.classList.remove("hidden");
}

function closeEnrollModal() {
  document.getElementById("enrollmentModal")?.classList.add("hidden");
}

function saveEnrollment() {
  if (!currentEditingApplicantId) return;

  const studentId = document.getElementById("enrollStudentId").value.trim();
  const enrollDate = document.getElementById("enrollDate").value;
  const contractSigner = document.getElementById("enrollSigner").value.trim();
  const signerRelation = document.getElementById("enrollSignerRelation").value.trim();
  const witness1 = document.getElementById("enrollWitness1").value.trim();
  const witness2 = document.getElementById("enrollWitness2").value.trim();
  const paymentStatus = document.getElementById("enrollPaymentStatus").value;

  if (!studentId) {
    alert("กรุณาระบุรหัสนักศึกษา");
    return;
  }

  const applicant = TTC_DB.getApplicantById(currentEditingApplicantId);
  if (applicant) {
    applicant.studentId = studentId;
  }

  TTC_DB.enrollApplicant(currentEditingApplicantId, {
    enrolledDate: enrollDate,
    contractSigner,
    signerRelation,
    witness1,
    witness2,
    paymentStatus
  });

  closeEnrollModal();
  renderKpiCards();
  renderCharts();
  renderApplicantTable();

  alert(`บันทึกการมอบตัวสำเร็จ!\nรหัสนักศึกษาใหม่: ${studentId}\nท่านสามารถสั่งพิมพ์ 'ใบมอบตัว' ได้ทันที`);
}

// Delete row
function deleteApplicantRow(id) {
  if (confirm(`คุณต้องการลบข้อมูลผู้สมัครรหัส ${id} ใช่หรือไม่?`)) {
    TTC_DB.deleteApplicant(id);
    renderKpiCards();
    renderCharts();
    renderApplicantTable();
  }
}

// ==========================================================================
// 6. NOTIFICATION SYSTEM & LINE CONFIGURATION
// ==========================================================================
function initNotificationCenter() {
  updateNotificationBadge();

  const btnBell = document.getElementById("btnNotificationBell");
  const dropdown = document.getElementById("notificationDropdown");

  if (btnBell && dropdown) {
    btnBell.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
      renderNotificationList();
    });

    document.addEventListener("click", () => {
      dropdown.classList.add("hidden");
    });
  }

  const btnMarkRead = document.getElementById("btnMarkAllNotifsRead");
  if (btnMarkRead) {
    btnMarkRead.addEventListener("click", () => {
      TTC_DB.markNotificationsAsRead();
      updateNotificationBadge();
      renderNotificationList();
    });
  }
}

function updateNotificationBadge() {
  const notifs = TTC_DB.getNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;
  const badge = document.getElementById("notifUnreadBadge");

  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }
}

function renderNotificationList() {
  const listEl = document.getElementById("notificationListContainer");
  if (!listEl) return;

  const notifs = TTC_DB.getNotifications();
  if (notifs.length === 0) {
    listEl.innerHTML = '<div class="p-4 text-center text-xs text-gray-500">ไม่มีการแจ้งเตือน</div>';
    return;
  }

  let html = "";
  notifs.slice(0, 15).forEach(n => {
    let iconClass = "fa-bell text-blue-500";
    if (n.type === "new_applicant") iconClass = "fa-user-plus text-emerald-500";
    else if (n.type === "status_change") iconClass = "fa-check-double text-amber-500";
    else if (n.type === "doc_incomplete") iconClass = "fa-triangle-exclamation text-rose-500";
    else if (n.type === "enrolled") iconClass = "fa-id-badge text-purple-500";

    html += `
      <div class="p-3 border-b border-gray-100 hover:bg-slate-50 transition text-xs ${n.read ? 'opacity-70' : 'bg-blue-50/40 font-medium'}">
        <div class="flex items-start gap-2">
          <i class="fa-solid ${iconClass} mt-0.5"></i>
          <div class="flex-1">
            <div>${n.message}</div>
            <div class="text-[10px] text-gray-400 mt-1">${new Date(n.timestamp).toLocaleTimeString('th-TH')} - ${new Date(n.timestamp).toLocaleDateString('th-TH')}</div>
          </div>
        </div>
      </div>
    `;
  });
  listEl.innerHTML = html;
}

// LINE Settings Modal
function initLineSettingsModal() {
  const btnOpen = document.getElementById("btnOpenLineSettings");
  const modal = document.getElementById("lineSettingsModal");

  if (btnOpen && modal) {
    btnOpen.addEventListener("click", () => {
      const cfg = TTC_DB.getLineSettings();
      document.getElementById("lineNotifyToken").value = cfg.lineNotifyToken || "";
      document.getElementById("lineOaWebhook").value = cfg.lineOaWebhook || "";
      document.getElementById("adminEmail").value = cfg.adminEmail || "";
      document.getElementById("enableLineNotify").checked = !!cfg.enableLineNotify;
      renderDispatchLogs();
      modal.classList.remove("hidden");
    });
  }

  const btnSave = document.getElementById("btnSaveLineSettings");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      TTC_DB.saveLineSettings({
        lineNotifyToken: document.getElementById("lineNotifyToken").value.trim(),
        lineOaWebhook: document.getElementById("lineOaWebhook").value.trim(),
        adminEmail: document.getElementById("adminEmail").value.trim(),
        enableLineNotify: document.getElementById("enableLineNotify").checked
      });
      alert("บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ");
      closeLineSettingsModal();
    });
  }

  const btnTest = document.getElementById("btnTestSendNotification");
  if (btnTest) {
    btnTest.addEventListener("click", () => {
      TTC_DB.dispatchExternalNotification({
        event: "new_application",
        applicant: {
          prefix: "นาย",
          firstName: "ทดสอบ",
          lastName: "ระบบส่งข้อความ",
          level: "ปวช.",
          majorName: "ช่างยนต์",
          phone: "089-999-9999",
          previousEducation: { schoolName: "โรงเรียนอนุบาลวัดบ้านหมอ" }
        }
      });
      renderDispatchLogs();
      alert("ส่งการแจ้งเตือนทดสอบเรียบร้อยแล้ว (ตรวจสอบผลในช่องประวัติการส่งด้านล่าง)");
    });
  }
}

function closeLineSettingsModal() {
  document.getElementById("lineSettingsModal")?.classList.add("hidden");
}

function renderDispatchLogs() {
  const logBox = document.getElementById("notificationDispatchLog");
  if (!logBox) return;

  const logs = window.__ttc_notification_logs || [];
  if (logs.length === 0) {
    logBox.innerHTML = '<span class="text-gray-400">ยังไม่มีประวัติการส่งข้อมูล</span>';
    return;
  }

  let text = "";
  logs.forEach(l => {
    text += `[${new Date(l.time).toLocaleTimeString('th-TH')}] (${l.status}) -> ${l.channel}\n${l.content}\n----------------------------------------\n`;
  });
  logBox.textContent = text;
}

// ==========================================================================
// 7. DATA EXPORT BUTTONS (EXCEL & CSV STANDARD)
// ==========================================================================
function initExportButtons() {
  const btnExportExcel = document.getElementById("btnExportExcel");
  const btnExportCSV = document.getElementById("btnExportCSV");

  if (btnExportExcel) {
    btnExportExcel.addEventListener("click", () => {
      const filtered = TTC_DB.getApplicants(currentFilters);
      TTC_EXPORTER.exportToExcel(filtered, "TTC_Student_Registry_Data_ศธ02");
    });
  }

  if (btnExportCSV) {
    btnExportCSV.addEventListener("click", () => {
      const filtered = TTC_DB.getApplicants(currentFilters);
      TTC_EXPORTER.exportToCSV(filtered, "TTC_Student_Registry_Data_ศธ02");
    });
  }
}
