/**
 * TTC Online Admission System - Validation & Utility Library
 * ตรวจสอบความถูกต้องของข้อมูล (Thai Citizen ID, Phone, Files, Dates, GPAX)
 */

const TTC_VALIDATOR = {
  /**
   * ตรวจสอบความถูกต้องของเลขประจำตัวประชาชนไทย 13 หลัก ตามสูตร Modulo 11
   * @param {string} id - เลขประจำตัวประชาชน 13 หลัก
   * @returns {boolean} true ถ้าถูกต้องตามหลักคณิตศาสตร์ทะเบียนราษฎร์
   */
  validateThaiCitizenId: function(id) {
    if (!id) return false;
    const cleanId = String(id).replace(/[^0-9]/g, "");
    if (cleanId.length !== 13) return false;

    // ตรวจสอบกรณีเลขเหมือนกันทั้ง 13 ตัว เช่น 0000000000000 หรือ 1111111111111
    if (/^(\d)\1{12}$/.test(cleanId)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanId.charAt(i), 10) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(cleanId.charAt(12), 10);
  },

  /**
   * จัดรูปแบบเลขบัตรประชาชน 13 หลัก: X-XXXX-XXXXX-XX-X
   */
  formatThaiCitizenId: function(id) {
    const clean = String(id || "").replace(/[^0-9]/g, "").slice(0, 13);
    if (!clean) return "";
    let formatted = clean.substring(0, 1);
    if (clean.length > 1) formatted += "-" + clean.substring(1, 5);
    if (clean.length > 5) formatted += "-" + clean.substring(5, 10);
    if (clean.length > 10) formatted += "-" + clean.substring(10, 12);
    if (clean.length > 12) formatted += "-" + clean.substring(12, 13);
    return formatted;
  },

  /**
   * ตรวจสอบเบอร์โทรศัพท์ไทย (10 หลัก สำหรับมือถือ เช่น 08, 09, 06 หรือ 9 หลักสำหรับเบอร์บ้าน)
   */
  validateThaiPhone: function(phone) {
    if (!phone) return false;
    const clean = String(phone).replace(/[^0-9]/g, "");
    // เบอร์มือถือ 10 หลักขึ้นต้นด้วย 06, 08, 09 หรือ เบอร์ 02, 03, 05, 07
    return /^(0[689]\d{8}|0[23457]\d{7,8})$/.test(clean);
  },

  /**
   * จัดรูปแบบเบอร์โทรศัพท์: 0XX-XXX-XXXX
   */
  formatThaiPhone: function(phone) {
    const clean = String(phone || "").replace(/[^0-9]/g, "").slice(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  },

  /**
   * ตรวจสอบเกรดเฉลี่ยสะสม (GPAX): 0.00 - 4.00
   */
  validateGpax: function(gpax) {
    if (gpax === "" || gpax === null || gpax === undefined) return false;
    const num = parseFloat(gpax);
    return !isNaN(num) && num >= 0.00 && num <= 4.00;
  },

  /**
   * ตรวจสอบไฟล์ที่อัปโหลด (ประเภทไฟล์ และขนาดไม่เกิน maxSizeBytes)
   */
  validateUploadFile: function(file, options = {}) {
    const maxSize = options.maxSize || (5 * 1024 * 1024); // 5 MB
    const allowedTypes = options.allowedTypes || [
      'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
    ];

    if (!file) {
      return { valid: false, error: "กรุณาเลือกไฟล์เอกสาร" };
    }

    // ตรวจสอบขนาดไฟล์
    if (file.size > maxSize) {
      const maxMb = (maxSize / (1024 * 1024)).toFixed(0);
      return { valid: false, error: `ขนาดไฟล์เกินกำหนด (สูงสุดไม่เกิน ${maxMb}MB)` };
    }

    // ตรวจสอบประเภทไฟล์
    const isTypeValid = allowedTypes.includes(file.type) || 
      file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i);

    if (!isTypeValid) {
      return { valid: false, error: "ประเภทไฟล์ไม่ถูกต้อง อนุญาตเฉพาะไฟล์ JPG, PNG หรือ PDF เท่านั้น" };
    }

    return { valid: true, error: null };
  },

  /**
   * แปลงไฟล์เป็น Base64 Data URL สำหรับแสดงพรีวิวและเก็บข้อมูล
   */
  readFileAsDataURL: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  },

  /**
   * แปลงวันที่ พ.ศ. เป็นรูปแบบภาษาไทยสวยงาม
   */
  formatThaiDate: function(dateStr) {
    if (!dateStr) return "-";
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    try {
      // ถ้ามาในรูปแบบ YYYY-MM-DD
      const parts = dateStr.split("T")[0].split("-");
      if (parts.length === 3) {
        let year = parseInt(parts[0], 10);
        // ถ้าเป็น ค.ศ. ให้แปลงเป็น พ.ศ.
        if (year < 2400) year += 543;
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return `${day} ${thaiMonths[monthIndex]} ${year}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  },

  /**
   * คำนวณอายุจากปีเกิด (พ.ศ.)
   */
  calculateAge: function(birthDateStr) {
    if (!birthDateStr) return "";
    try {
      const parts = birthDateStr.split("-");
      let bYear = parseInt(parts[0], 10);
      if (bYear > 2400) bYear -= 543; // แปลงเป็น ค.ศ. ชั่วคราวเพื่อคำนวณ
      const bMonth = parseInt(parts[1], 10) - 1;
      const bDay = parseInt(parts[2], 10);

      const today = new Date();
      let age = today.getFullYear() - bYear;
      const m = today.getMonth() - bMonth;
      if (m < 0 || (m === 0 && today.getDate() < bDay)) {
        age--;
      }
      return age >= 0 ? `${age} ปี` : "";
    } catch (e) {
      return "";
    }
  }
};
