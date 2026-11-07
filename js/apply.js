/**
 * TTC Online Admission System - Application Form Logic
 * วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
 */

document.addEventListener("DOMContentLoaded", function() {
  let currentStep = 1;
  const totalSteps = 5;

  // State to hold uploaded files in Base64
  const uploadedDocs = {
    photo: "",
    idCardDoc: "",
    houseDoc: "",
    transcriptDoc: ""
  };

  // Initialize Form Elements
  initMajorDropdowns();
  initMaskersAndValidation();
  initFileUploadHandlers();
  initStepNavigation();

  // Populate level and major select
  function initMajorDropdowns() {
    const levelSelect = document.getElementById("applyLevel");
    const majorSelect = document.getElementById("applyMajor");
    const quotaBadge = document.getElementById("majorQuotaInfo");

    if (!levelSelect || !majorSelect) return;

    function updateMajors(level) {
      majorSelect.innerHTML = '<option value="">-- กรุณาเลือกสาขาวิชาที่ต้องการสมัคร --</option>';
      const programs = TTC_PROGRAMS[level] || [];

      programs.forEach(prog => {
        const opt = document.createElement("option");
        opt.value = prog.code;
        opt.textContent = `[${prog.code}] ${prog.name}`;
        opt.dataset.dept = prog.dept;
        opt.dataset.quota = prog.quota;
        opt.dataset.name = prog.name;
        majorSelect.appendChild(opt);
      });

      if (quotaBadge) quotaBadge.textContent = "เลือกสาขาวิชาเพื่อดูข้อมูล";
    }

    levelSelect.addEventListener("change", function() {
      updateMajors(this.value);
    });

    majorSelect.addEventListener("change", function() {
      const selected = this.options[this.selectedIndex];
      if (quotaBadge && selected.value) {
        quotaBadge.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><i class="fa-solid fa-graduation-cap mr-1"></i> แผนก: ${selected.dataset.dept} | โควตารับ: ${selected.dataset.quota} คน</span>`;
      } else if (quotaBadge) {
        quotaBadge.textContent = "";
      }
    });

    // Default trigger
    updateMajors(levelSelect.value);
  }

  // Real-time Input Masks and Validations
  function initMaskersAndValidation() {
    const idCardInput = document.getElementById("idCard");
    const phoneInput = document.getElementById("phone");
    const gpaxInput = document.getElementById("gpax");

    if (idCardInput) {
      idCardInput.addEventListener("input", function(e) {
        // Strip non-digits
        let val = this.value.replace(/[^0-9]/g, "");
        if (val.length > 13) val = val.slice(0, 13);
        this.value = TTC_VALIDATOR.formatThaiCitizenId(val);

        const errorEl = document.getElementById("idCardError");
        if (val.length === 13) {
          const isValid = TTC_VALIDATOR.validateThaiCitizenId(val);
          if (isValid) {
            this.classList.remove("is-invalid");
            this.classList.add("is-valid");
            if (errorEl) errorEl.style.display = "none";
          } else {
            this.classList.remove("is-valid");
            this.classList.add("is-invalid");
            if (errorEl) {
              errorEl.textContent = "เลขบัตรประชาชนไม่ถูกต้องตามหลักการตรวจสอบเลข 13 หลัก";
              errorEl.style.display = "block";
            }
          }
        } else {
          this.classList.remove("is-valid");
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function() {
        let val = this.value.replace(/[^0-9]/g, "");
        if (val.length > 10) val = val.slice(0, 10);
        this.value = TTC_VALIDATOR.formatThaiPhone(val);

        if (val.length === 10) {
          if (TTC_VALIDATOR.validateThaiPhone(val)) {
            this.classList.remove("is-invalid");
            this.classList.add("is-valid");
          } else {
            this.classList.add("is-invalid");
          }
        }
      });
    }

    if (gpaxInput) {
      gpaxInput.addEventListener("blur", function() {
        if (this.value) {
          const num = parseFloat(this.value);
          if (isNaN(num) || num < 0 || num > 4.0) {
            this.classList.add("is-invalid");
          } else {
            this.value = num.toFixed(2);
            this.classList.remove("is-invalid");
            this.classList.add("is-valid");
          }
        }
      });
    }
  }

  // Handle Drag & Drop and File Selection
  function initFileUploadHandlers() {
    const uploadTypes = ["photo", "idCardDoc", "houseDoc", "transcriptDoc"];

    uploadTypes.forEach(type => {
      const input = document.getElementById(`file_${type}`);
      const dropZone = document.getElementById(`drop_${type}`);
      const preview = document.getElementById(`preview_${type}`);
      const previewText = document.getElementById(`text_${type}`);

      if (!input || !dropZone) return;

      // Click to choose
      dropZone.addEventListener("click", () => input.click());

      // Drag and drop events
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.add("dragover");
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.remove("dragover");
        }, false);
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
          processFile(files[0], type, dropZone, preview, previewText);
        }
      });

      input.addEventListener("change", function() {
        if (this.files.length > 0) {
          processFile(this.files[0], type, dropZone, preview, previewText);
        }
      });
    });

    async function processFile(file, type, dropZone, preview, previewText) {
      const check = TTC_VALIDATOR.validateUploadFile(file);
      if (!check.valid) {
        alert(check.error);
        return;
      }

      try {
        const dataUrl = await TTC_VALIDATOR.readFileAsDataURL(file);
        uploadedDocs[type] = dataUrl;
        dropZone.classList.add("has-file");

        if (previewText) {
          previewText.innerHTML = `<span class="text-emerald-700 font-semibold"><i class="fa-solid fa-circle-check"></i> อัปโหลดแล้ว:</span> <span class="text-xs text-gray-600">${file.name} (${(file.size / 1024).toFixed(0)} KB)</span>`;
        }

        if (preview) {
          if (file.type.startsWith("image/")) {
            preview.innerHTML = `<img src="${dataUrl}" class="upload-preview-img mx-auto mb-2" alt="Uploaded Document" />`;
          } else if (file.type === "application/pdf") {
            preview.innerHTML = `<div class="p-3 bg-red-50 text-red-700 rounded-md inline-block"><i class="fa-solid fa-file-pdf text-3xl"></i><div class="text-xs mt-1 font-medium">ไฟล์เอกสาร PDF</div></div>`;
          }
        }
      } catch (err) {
        console.error("File read error:", err);
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาลองใหม่อีกครั้ง");
      }
    }
  }

  // Step Wizard Navigation & Validation
  function initStepNavigation() {
    const btnNext = document.getElementById("btnNextStep");
    const btnPrev = document.getElementById("btnPrevStep");
    const btnSubmit = document.getElementById("btnSubmitApplication");

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (validateStep(currentStep)) {
          currentStep++;
          updateStepView();
          if (currentStep === 5) {
            populateReviewSummary();
          }
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepView();
        }
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", submitFinalApplication);
    }
  }

  function validateStep(step) {
    let isValid = true;
    let firstErrorField = null;

    function markError(el, message) {
      if (!el) return;
      el.classList.add("is-invalid");
      const errEl = el.parentElement.querySelector(".error-feedback");
      if (errEl) {
        if (message) errEl.textContent = message;
        errEl.style.display = "block";
      }
      if (!firstErrorField) firstErrorField = el;
      isValid = false;
    }

    function clearError(el) {
      if (!el) return;
      el.classList.remove("is-invalid");
      const errEl = el.parentElement.querySelector(".error-feedback");
      if (errEl) errEl.style.display = "none";
    }

    if (step === 1) {
      // Step 1: Program & Major
      const major = document.getElementById("applyMajor");
      if (!major.value) {
        markError(major, "กรุณาเลือกสาขาวิชาที่ต้องการสมัคร");
      } else {
        clearError(major);
      }
    } else if (step === 2) {
      // Step 2: Personal Info
      const prefix = document.getElementById("prefix");
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const idCard = document.getElementById("idCard");
      const birthDate = document.getElementById("birthDate");
      const phone = document.getElementById("phone");
      const houseNo = document.getElementById("houseNo");
      const district = document.getElementById("district");
      const province = document.getElementById("province");

      [prefix, firstName, lastName, birthDate, houseNo, district, province].forEach(el => {
        if (!el.value.trim()) markError(el, "กรุณากรอกข้อมูลในช่องนี้");
        else clearError(el);
      });

      // ID Card check
      const rawId = idCard.value.replace(/[^0-9]/g, "");
      if (!TTC_VALIDATOR.validateThaiCitizenId(rawId)) {
        markError(idCard, "เลขประจำตัวประชาชน 13 หลักไม่ถูกต้อง");
      } else {
        clearError(idCard);
      }

      // Phone check
      const rawPhone = phone.value.replace(/[^0-9]/g, "");
      if (!TTC_VALIDATOR.validateThaiPhone(rawPhone)) {
        markError(phone, "เบอร์โทรศัพท์ 10 หลักไม่ถูกต้อง");
      } else {
        clearError(phone);
      }
    } else if (step === 3) {
      // Step 3: Education & Family
      const schoolName = document.getElementById("schoolName");
      const schoolProvince = document.getElementById("schoolProvince");
      const gpax = document.getElementById("gpax");
      const guardianName = document.getElementById("guardianName");
      const guardianPhone = document.getElementById("guardianPhone");
      const guardianRelation = document.getElementById("guardianRelation");

      [schoolName, schoolProvince, guardianName, guardianRelation].forEach(el => {
        if (!el.value.trim()) markError(el, "กรุณากรอกข้อมูลในช่องนี้");
        else clearError(el);
      });

      if (!TTC_VALIDATOR.validateGpax(gpax.value)) {
        markError(gpax, "กรุณาระบุเกรดเฉลี่ยสะสมระหว่าง 0.00 ถึง 4.00");
      } else {
        clearError(gpax);
      }

      const rawGuardPhone = guardianPhone.value.replace(/[^0-9]/g, "");
      if (!TTC_VALIDATOR.validateThaiPhone(rawGuardPhone)) {
        markError(guardianPhone, "เบอร์โทรศัพท์ผู้ปกครองไม่ถูกต้อง");
      } else {
        clearError(guardianPhone);
      }
    } else if (step === 4) {
      // Step 4: Documents (Recommended check)
      if (!uploadedDocs.photo) {
        if (!confirm("ท่านยังไม่ได้แนบรูปถ่ายหน้าตรง ต้องการดำเนินการต่อหรือไม่?")) {
          return false;
        }
      }
    }

    if (!isValid && firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  }

  function updateStepView() {
    // Hide all step sections
    for (let i = 1; i <= totalSteps; i++) {
      const sec = document.getElementById(`stepSection${i}`);
      const ind = document.getElementById(`stepIndicator${i}`);
      if (sec) sec.style.display = (i === currentStep) ? "block" : "none";
      if (ind) {
        if (i < currentStep) {
          ind.classList.remove("active");
          ind.classList.add("completed");
        } else if (i === currentStep) {
          ind.classList.add("active");
          ind.classList.remove("completed");
        } else {
          ind.classList.remove("active", "completed");
        }
      }
    }

    // Step Line Progress
    const fillLine = document.getElementById("stepProgressLine");
    if (fillLine) {
      const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
      fillLine.style.width = `${percentage}%`;
    }

    // Buttons
    const btnPrev = document.getElementById("btnPrevStep");
    const btnNext = document.getElementById("btnNextStep");
    const btnSubmit = document.getElementById("btnSubmitApplication");

    if (btnPrev) btnPrev.style.display = (currentStep === 1) ? "none" : "inline-flex";
    if (btnNext) btnNext.style.display = (currentStep === totalSteps) ? "none" : "inline-flex";
    if (btnSubmit) btnSubmit.style.display = (currentStep === totalSteps) ? "inline-flex" : "none";

    window.scrollTo({ top: 150, behavior: "smooth" });
  }

  function populateReviewSummary() {
    const level = document.getElementById("applyLevel").value;
    const majorSelect = document.getElementById("applyMajor");
    const majorCode = majorSelect.value;
    const majorName = majorSelect.options[majorSelect.selectedIndex]?.dataset.name || "";

    const prefix = document.getElementById("prefix").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const idCard = document.getElementById("idCard").value;
    const phone = document.getElementById("phone").value;
    const birthDate = document.getElementById("birthDate").value;

    const schoolName = document.getElementById("schoolName").value;
    const gpax = document.getElementById("gpax").value;
    const guardianName = document.getElementById("guardianName").value;
    const guardianRelation = document.getElementById("guardianRelation").value;
    const guardianPhone = document.getElementById("guardianPhone").value;

    const summaryBox = document.getElementById("reviewSummaryContent");
    if (!summaryBox) return;

    summaryBox.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
        <h4 class="font-bold text-lg text-blue-900 border-b border-blue-200 pb-2 mb-3">
          <i class="fa-solid fa-graduation-cap text-amber-600 mr-2"></i> สาขาวิชาที่เลือกสมัคร
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span class="text-gray-600">ระดับการศึกษา:</span> <strong>${level}</strong></div>
          <div><span class="text-gray-600">สาขาวิชา:</span> <strong>[${majorCode}] ${majorName}</strong></div>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
        <h4 class="font-bold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-3">
          <i class="fa-solid fa-user text-blue-700 mr-2"></i> ข้อมูลส่วนตัวและที่อยู่
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-600">ชื่อ-นามสกุล:</span> <strong>${prefix}${firstName} ${lastName}</strong></div>
          <div><span class="text-gray-600">เลขประจำตัวประชาชน:</span> <strong>${idCard}</strong></div>
          <div><span class="text-gray-600">วันเดือนปีเกิด:</span> <strong>${birthDate}</strong></div>
          <div><span class="text-gray-600">เบอร์โทรศัพท์:</span> <strong>${phone}</strong></div>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
        <h4 class="font-bold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-3">
          <i class="fa-solid fa-school text-emerald-700 mr-2"></i> ข้อมูลการศึกษาเดิม & ผู้ปกครอง
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span class="text-gray-600">สถานศึกษาเดิม:</span> <strong>${schoolName}</strong></div>
          <div><span class="text-gray-600">เกรดเฉลี่ยสะสม (GPAX):</span> <strong>${gpax}</strong></div>
          <div><span class="text-gray-600">ผู้ปกครอง:</span> <strong>${guardianName} (${guardianRelation})</strong></div>
          <div><span class="text-gray-600">เบอร์โทรผู้ปกครอง:</span> <strong>${guardianPhone}</strong></div>
        </div>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 flex items-start gap-2">
        <i class="fa-solid fa-triangle-exclamation text-amber-600 text-lg mt-0.5"></i>
        <div>
          <strong>คำรับรองของผู้สมัคร:</strong> ข้าพเจ้าขอรับรองว่าข้อความและเอกสารหลักฐานทั้งหมดที่ได้กรอกและแนบมานี้เป็นความจริงทุกประการ หากตรวจสอบในภายหลังพบว่าเป็นเท็จ ข้าพเจ้ายินยอมให้วิทยาลัยตัดสิทธิ์การสมัครเข้าศึกษาโดยไม่มีเงื่อนไข
        </div>
      </div>
    `;
  }

  function submitFinalApplication() {
    const agreeCheck = document.getElementById("agreeTerms");
    if (agreeCheck && !agreeCheck.checked) {
      alert("กรุณาทำเครื่องหมายถูกในช่องรับรองความถูกต้องของข้อมูลก่อนยืนยันการสมัคร");
      agreeCheck.focus();
      return;
    }

    const majorSelect = document.getElementById("applyMajor");
    const rawId = document.getElementById("idCard").value.replace(/[^0-9]/g, "");

    // Check if ID card already exists in database
    const existing = TTC_DB.getApplicantByCitizenId(rawId);
    if (existing) {
      if (!confirm(`เลขประจำตัวประชาชนนี้เคยยื่นใบสมัครแล้ว (รหัส: ${existing.id})\nต้องการอัปเดตข้อมูลใบสมัครเดิมหรือไม่?`)) {
        return;
      }
    }

    const applicantData = {
      id: existing ? existing.id : null,
      academicYear: TTC_COLLEGE_INFO.currentAcademicYear,
      level: document.getElementById("applyLevel").value,
      majorCode: majorSelect.value,
      majorName: majorSelect.options[majorSelect.selectedIndex]?.dataset.name || "",
      prefix: document.getElementById("prefix").value,
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      idCard: rawId,
      birthDate: document.getElementById("birthDate").value,
      gender: document.getElementById("gender").value,
      nationality: document.getElementById("nationality").value.trim() || "ไทย",
      religion: document.getElementById("religion").value || "พุทธ",
      bloodGroup: document.getElementById("bloodGroup").value || "-",
      phone: document.getElementById("phone").value.replace(/[^0-9]/g, ""),
      email: document.getElementById("email").value.trim(),
      address: {
        houseNo: document.getElementById("houseNo").value.trim(),
        moo: document.getElementById("moo").value.trim(),
        subDistrict: document.getElementById("subDistrict").value.trim(),
        district: document.getElementById("district").value.trim(),
        province: document.getElementById("province").value.trim(),
        postalCode: document.getElementById("postalCode").value.trim()
      },
      previousEducation: {
        schoolName: document.getElementById("schoolName").value.trim(),
        province: document.getElementById("schoolProvince").value.trim(),
        degree: document.getElementById("degree").value.trim(),
        gpax: document.getElementById("gpax").value.trim()
      },
      parentInfo: {
        fatherName: document.getElementById("fatherName").value.trim(),
        fatherPhone: document.getElementById("fatherPhone").value.replace(/[^0-9]/g, ""),
        motherName: document.getElementById("motherName").value.trim(),
        motherPhone: document.getElementById("motherPhone").value.replace(/[^0-9]/g, ""),
        guardianName: document.getElementById("guardianName").value.trim(),
        guardianPhone: document.getElementById("guardianPhone").value.replace(/[^0-9]/g, ""),
        guardianRelation: document.getElementById("guardianRelation").value.trim()
      },
      referral: document.getElementById("referral").value,
      documents: {
        photo: uploadedDocs.photo || (existing ? existing.documents.photo : ""),
        idCardDoc: uploadedDocs.idCardDoc || (existing ? existing.documents.idCardDoc : ""),
        houseDoc: uploadedDocs.houseDoc || (existing ? existing.documents.houseDoc : ""),
        transcriptDoc: uploadedDocs.transcriptDoc || (existing ? existing.documents.transcriptDoc : "")
      }
    };

    const saved = TTC_DB.saveApplicant(applicantData);

    // Show Success Modal
    showSuccessDialog(saved);
  }

  function showSuccessDialog(applicant) {
    const modal = document.getElementById("successModal");
    if (!modal) {
      alert(`ยื่นใบสมัครสำเร็จ! รหัสประจำตัวผู้สมัครของท่านคือ: ${applicant.id}`);
      window.location.href = `status.html?id=${applicant.idCard}`;
      return;
    }

    document.getElementById("modalAppId").textContent = applicant.id;
    document.getElementById("modalApplicantName").textContent = `${applicant.prefix}${applicant.firstName} ${applicant.lastName}`;
    document.getElementById("modalMajor").textContent = `${applicant.level} ${applicant.majorName}`;

    document.getElementById("btnModalPrint").href = `print-application.html?id=${applicant.id}`;
    document.getElementById("btnModalStatus").href = `status.html?id=${applicant.idCard}`;

    modal.classList.remove("hidden");
  }
});
