/**
 * TTC Online Admission System - Data Export Utility (ศธ.02 Standard Compliant)
 * ส่งออกไฟล์ Excel (.xlsx) และ CSV มาตรฐานงานทะเบียนสำหรับนำเข้าสู่ระบบ ศธ.02
 */

const TTC_EXPORTER = {
  /**
   * แมปข้อมูลผู้สมัครให้ตรงตามฟิลด์มาตรฐานของงานทะเบียนและระบบ ศธ.02
   */
  mapApplicantsToRegistryFormat: function(applicants) {
    return applicants.map((app, index) => {
      const addr = app.address || {};
      const edu = app.previousEducation || {};
      const par = app.parentInfo || {};
      const enroll = app.enrollmentDetails || {};

      return {
        "ลำดับ": index + 1,
        "ปีการศึกษา": app.academicYear || TTC_COLLEGE_INFO.currentAcademicYear,
        "เลขที่ใบสมัคร": app.id || "",
        "รหัสนักศึกษา": app.studentId || "-",
        "ระดับชั้น": app.level || "",
        "รหัสสาขาวิชา": app.majorCode || "",
        "ชื่อสาขาวิชา": app.majorName || "",
        "เลขประจำตัวประชาชน": `'${app.idCard || ""}`, // ใส่ ' นำหน้าเพื่อป้องกัน Excel ตัดเลข 0
        "คำนำหน้าชื่อ": app.prefix || "",
        "ชื่อ": app.firstName || "",
        "นามสกุล": app.lastName || "",
        "เพศ": app.gender || "",
        "วันเดือนปีเกิด": app.birthDate || "",
        "สัญชาติ": app.nationality || "ไทย",
        "ศาสนา": app.religion || "พุทธ",
        "หมู่เลือด": app.bloodGroup || "-",
        "เบอร์โทรศัพท์ผู้สมัคร": `'${app.phone || ""}`,
        "อีเมล": app.email || "",
        "บ้านเลขที่": addr.houseNo || "",
        "หมู่ที่": addr.moo || "",
        "ตำบล_แขวง": addr.subDistrict || "",
        "อำเภอ_เขต": addr.district || "",
        "จังหวัด": addr.province || "",
        "รหัสไปรษณีย์": addr.postalCode || "",
        "วุฒิการศึกษาเดิม": edu.degree || "",
        "สถานศึกษาเดิม": edu.schoolName || "",
        "จังหวัดสถานศึกษาเดิม": edu.province || "",
        "เกรดเฉลี่ยสะสม_GPAX": edu.gpax || "",
        "ชื่อสกุลบิดา": par.fatherName || "",
        "เบอร์โทรบิดา": par.fatherPhone || "",
        "ชื่อสกุลมารดา": par.motherName || "",
        "เบอร์โทรมารดา": par.motherPhone || "",
        "ชื่อสกุลผู้ปกครอง": par.guardianName || "",
        "ความสัมพันธ์ผู้ปกครอง": par.guardianRelation || "",
        "เบอร์โทรผู้ปกครอง": par.guardianPhone || "",
        "ช่องทางแนะแนว": app.referral || "",
        "สถานะการสมัคร": APPLICATION_STATUSES[app.status]?.label || app.status,
        "วันที่สมัคร": app.applyDate ? app.applyDate.split("T")[0] : "",
        "วันที่มอบตัว": enroll.enrolledDate || "-",
        "พยานการมอบตัว": enroll.witness1 || "-",
        "หมายเหตุ": app.statusNotes || ""
      };
    });
  },

  /**
   * ส่งออกเป็นไฟล์ CSV รองรับภาษาไทย UTF-8 with BOM
   */
  exportToCSV: function(applicants, filename = "TTC_Student_Registry_Data") {
    if (!applicants || applicants.length === 0) {
      alert("ไม่มีข้อมูลผู้สมัครสำหรับส่งออก");
      return;
    }

    const data = this.mapApplicantsToRegistryFormat(applicants);
    const headers = Object.keys(data[0]);

    // สร้างเนื้อหา CSV
    let csvContent = "";
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\r\n";

    data.forEach(row => {
      const line = headers.map(header => {
        let val = row[header] === undefined || row[header] === null ? "" : String(row[header]);
        // ลบ single quote นำหน้าที่ใส่กัน Excel แปลงเลข
        if (val.startsWith("'")) val = val.substring(1);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(",");
      csvContent += line + "\r\n";
    });

    // เพิ่ม BOM \uFEFF เพื่อให้ Excel ภาษาไทยเปิดแล้วไม่เป็นภาษาต่างดาว
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    this.downloadBlob(blob, `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  },

  /**
   * ส่งออกเป็นไฟล์ Excel (.xlsx) แท้ๆ โดยใช้ SheetJS
   */
  exportToExcel: function(applicants, filename = "TTC_Student_Registry_Data_ศธ02") {
    if (!applicants || applicants.length === 0) {
      alert("ไม่มีข้อมูลผู้สมัครสำหรับส่งออก");
      return;
    }

    const data = this.mapApplicantsToRegistryFormat(applicants);

    // ตรวจสอบว่ามี Library XLSX หรือไม่
    if (typeof XLSX !== "undefined") {
      const worksheet = XLSX.utils.json_to_sheet(data);

      // กำหนดความกว้างคอลัมน์อัตโนมัติ
      const colWidths = Object.keys(data[0]).map(k => ({ wch: Math.max(k.length * 2, 14) }));
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูลผู้สมัคร_ศธ02");

      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } else {
      console.warn("XLSX library not found. Falling back to CSV export.");
      this.exportToCSV(applicants, filename);
    }
  },

  /**
   * ดาวน์โหลด Blob File
   */
  downloadBlob: function(blob, filename) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
