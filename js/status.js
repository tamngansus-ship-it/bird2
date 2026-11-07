/**
 * TTC Online Admission System - Status Tracking Logic
 * วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
 */

document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("searchIdCard");
  const btnSearch = document.getElementById("btnSearchStatus");
  const resultContainer = document.getElementById("statusResultContainer");
  const notFoundContainer = document.getElementById("statusNotFoundContainer");

  // Format ID card input while typing
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      let val = this.value.replace(/[^0-9]/g, "");
      if (val.length > 13) val = val.slice(0, 13);
      this.value = TTC_VALIDATOR.formatThaiCitizenId(val);
    });

    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener("click", doSearch);
  }

  // Check URL params (?id=1103702584129 or ?appId=APP-68001)
  const urlParams = new URLSearchParams(window.location.search);
  const qId = urlParams.get("id") || urlParams.get("citizenId");
  const qAppId = urlParams.get("appId");

  if (qId && searchInput) {
    searchInput.value = TTC_VALIDATOR.formatThaiCitizenId(qId);
    doSearch();
  } else if (qAppId) {
    const app = TTC_DB.getApplicantById(qAppId);
    if (app && searchInput) {
      searchInput.value = TTC_VALIDATOR.formatThaiCitizenId(app.idCard);
      renderStatusResult(app);
    }
  }

  function doSearch() {
    const rawVal = searchInput.value.replace(/[^0-9]/g, "");
    if (!rawVal) {
      alert("กรุณากรอกเลขประจำตัวประชาชน 13 หลักเพื่อค้นหา");
      searchInput.focus();
      return;
    }

    // Try finding by citizen ID
    let applicant = TTC_DB.getApplicantByCitizenId(rawVal);

    if (!applicant) {
      // Try by App ID if input is string
      applicant = TTC_DB.getApplicantById(searchInput.value.trim());
    }

    if (applicant) {
      renderStatusResult(applicant);
    } else {
      if (resultContainer) resultContainer.classList.add("hidden");
      if (notFoundContainer) notFoundContainer.classList.remove("hidden");
    }
  }

  function renderStatusResult(applicant) {
    if (notFoundContainer) notFoundContainer.classList.add("hidden");
    if (!resultContainer) return;

    resultContainer.classList.remove("hidden");

    const statusObj = APPLICATION_STATUSES[applicant.status] || {
      label: applicant.status,
      badgeClass: "badge-status-pending",
      desc: applicant.statusNotes || ""
    };

    // Populate Details
    document.getElementById("resAppId").textContent = applicant.id;
    document.getElementById("resStudentId").textContent = applicant.studentId || "- (รอดำเนินการมอบตัว)";
    document.getElementById("resFullName").textContent = `${applicant.prefix}${applicant.firstName} ${applicant.lastName}`;
    document.getElementById("resIdCard").textContent = TTC_VALIDATOR.formatThaiCitizenId(applicant.idCard);
    document.getElementById("resLevel").textContent = applicant.level;
    document.getElementById("resMajor").textContent = `[${applicant.majorCode}] ${applicant.majorName}`;
    document.getElementById("resSchool").textContent = applicant.previousEducation?.schoolName || "-";
    document.getElementById("resGpax").textContent = applicant.previousEducation?.gpax || "-";
    document.getElementById("resApplyDate").textContent = TTC_VALIDATOR.formatThaiDate(applicant.applyDate);

    // Status Badge
    const badgeEl = document.getElementById("resStatusBadge");
    if (badgeEl) {
      badgeEl.className = `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${statusObj.badgeClass}`;
      badgeEl.innerHTML = `<i class="fa-solid fa-circle-dot mr-2"></i> ${statusObj.label}`;
    }

    // Notes
    const notesEl = document.getElementById("resStatusNotes");
    if (notesEl) {
      notesEl.textContent = applicant.statusNotes || statusObj.desc;
    }

    // Step Progress
    updateTrackingSteps(applicant.status);

    // Incomplete documents re-upload box
    const reuploadBox = document.getElementById("reuploadContainer");
    if (reuploadBox) {
      if (applicant.status === "incomplete") {
        reuploadBox.classList.remove("hidden");
        initReuploadFeature(applicant);
      } else {
        reuploadBox.classList.add("hidden");
      }
    }

    // Print Buttons
    const btnPrintApp = document.getElementById("btnPrintApplication");
    const btnPrintEnroll = document.getElementById("btnPrintEnrollment");

    if (btnPrintApp) {
      btnPrintApp.href = `print-application.html?id=${applicant.id}&tab=app`;
    }

    if (btnPrintEnroll) {
      btnPrintEnroll.href = `print-application.html?id=${applicant.id}&tab=enroll`;
      if (applicant.status === "passed" || applicant.status === "enrolled") {
        btnPrintEnroll.classList.remove("opacity-50", "pointer-events-none");
        btnPrintEnroll.title = "พิมพ์ใบมอบตัว";
      } else {
        btnPrintEnroll.classList.add("opacity-50", "pointer-events-none");
        btnPrintEnroll.title = "จะสามารถพิมพ์ใบมอบตัวได้เมื่อผ่านการคัดเลือกแล้ว";
      }
    }

    resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateTrackingSteps(status) {
    const s1 = document.getElementById("trackStep1");
    const s2 = document.getElementById("trackStep2");
    const s3 = document.getElementById("trackStep3");
    const s4 = document.getElementById("trackStep4");

    const reset = (el) => el?.classList.remove("active", "completed", "error");

    [s1, s2, s3, s4].forEach(reset);

    // Step 1: ยื่นใบสมัคร (เสร็จแล้วเสมอ)
    s1?.classList.add("completed");

    if (status === "pending") {
      s2?.classList.add("active");
    } else if (status === "incomplete") {
      s2?.classList.add("error");
    } else if (status === "passed") {
      s2?.classList.add("completed");
      s3?.classList.add("active");
    } else if (status === "enrolled") {
      s2?.classList.add("completed");
      s3?.classList.add("completed");
      s4?.classList.add("completed");
    }
  }

  function initReuploadFeature(applicant) {
    const fileInput = document.getElementById("reuploadFile");
    const docTypeSelect = document.getElementById("reuploadDocType");
    const btnSubmitFix = document.getElementById("btnSubmitReupload");

    if (!btnSubmitFix) return;

    btnSubmitFix.onclick = async function() {
      if (!fileInput.files || fileInput.files.length === 0) {
        alert("กรุณาเลือกไฟล์เอกสารที่ต้องการส่งเพิ่มเติม");
        return;
      }

      const file = fileInput.files[0];
      const check = TTC_VALIDATOR.validateUploadFile(file);
      if (!check.valid) {
        alert(check.error);
        return;
      }

      const docType = docTypeSelect.value;
      try {
        const base64 = await TTC_VALIDATOR.readFileAsDataURL(file);
        applicant.documents[docType] = base64;
        applicant.status = "pending";
        applicant.statusNotes = `ผู้สมัครอัปโหลดเอกสารแก้ไขเพิ่มเติมแล้ว (${docTypeSelect.options[docTypeSelect.selectedIndex].text}) รอเจ้าหน้าที่ตรวจสอบ`;

        TTC_DB.saveApplicant(applicant);

        alert("อัปโหลดเอกสารแก้ไขสำเร็จ! ระบบได้ปรับสถานะเป็น 'รอตรวจสอบเอกสาร' และส่งแจ้งเตือนไปยังเจ้าหน้าที่แล้ว");
        renderStatusResult(applicant);
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง");
      }
    };
  }
});
