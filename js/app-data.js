/**
 * TTC Online Admission System - Data Core & Storage Engine
 * วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ (Thaluang Cementhai Anusorn Technical College)
 */

const TTC_COLLEGE_INFO = {
  nameTh: "วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์",
  nameEn: "Thaluang Cementhai Anusorn Technical College",
  shortTh: "วท.ท่าหลวงฯ",
  shortEn: "T.T.C.",
  ministry: "สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)",
  address: "เลขที่ 290 หมู่ 8 บ้านท่าลาน ตำบลบ้านครัว อำเภอบ้านหมอ จังหวัดสระบุรี 18270",
  phone: "036-201-447, 036-201-448",
  website: "www.tl.ac.th",
  facebook: "วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์",
  currentAcademicYear: "2568",
  motto: "ทักษะเยี่ยม เปี่ยมคุณธรรม นำเทคโนโลยี",
  colors: {
    primary: "#1E3A8A",
    secondary: "#D97706"
  }
};

// ข้อมูลหลักสูตรและสาขาวิชาที่เปิดรับสมัคร
const TTC_PROGRAMS = {
  "ปวช.": [
    { code: "20101", name: "สาขาวิชาช่างยนต์ (เครื่องกล)", quota: 80, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20102", name: "สาขาวิชาช่างกลโรงงาน (เทคนิคการผลิต)", quota: 40, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20103", name: "สาขาวิชาช่างเชื่อมโลหะ (โครงสร้าง)", quota: 35, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20104", name: "สาขาวิชาช่างไฟฟ้ากำลัง", quota: 75, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20105", name: "สาขาวิชาช่างอิเล็กทรอนิกส์", quota: 40, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20106", name: "สาขาวิชาช่างซ่อมบำรุง (ทวิภาคี SCG)", quota: 35, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "20201", name: "สาขาวิชาการบัญชี", quota: 70, enrolled: 0, dept: "พาณิชยกรรม" },
    { code: "20204", name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล", quota: 45, enrolled: 0, dept: "พาณิชยกรรม" },
    { code: "20901", name: "สาขาวิชาเทคโนโลยีสารสนเทศ", quota: 40, enrolled: 0, dept: "เทคโนโลยีสารสนเทศ" }
  ],
  "ปวส.": [
    { code: "30101", name: "สาขาวิชาเทคนิคเครื่องกล (เทคนิคยานยนต์)", quota: 45, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30102", name: "สาขาวิชาเทคนิคการผลิต / เทคนิคอุตสาหกรรม", quota: 35, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30103", name: "สาขาวิชาเทคนิคการเชื่อมโลหะ", quota: 30, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30104", name: "สาขาวิชาไฟฟ้ากำลัง (ระบบควบคุม/เครื่องมือวัด)", quota: 50, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30105", name: "สาขาวิชาเทคโนโลยีอิเล็กทรอนิกส์", quota: 30, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30106", name: "สาขาวิชาเมคคาทรอนิกส์และหุ่นยนต์", quota: 35, enrolled: 0, dept: "ช่างอุตสาหกรรม" },
    { code: "30201", name: "สาขาวิชาการบัญชี", quota: 40, enrolled: 0, dept: "บริหารธุรกิจ" },
    { code: "30204", name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล", quota: 35, enrolled: 0, dept: "บริหารธุรกิจ" },
    { code: "30901", name: "สาขาวิชาเทคโนโลยีสารสนเทศ", quota: 35, enrolled: 0, dept: "เทคโนโลยีสารสนเทศ" }
  ]
};

// ช่องทางการรับรู้ข้อมูล / การแนะแนว
const REFERRAL_CHANNELS = [
  "ครูแนะแนวโรงเรียนเดิม",
  "กิจกรรม Open House / นิทรรศการวิทยาลัย",
  "เพจ Facebook วิทยาลัย",
  "เพื่อน / รุ่นพี่ แนะนำ",
  "ผู้ปกครอง / ญาติ แนะนำ",
  "ใบปลิว / โปสเตอร์ประชาสัมพันธ์",
  "เว็บไซต์วิทยาลัย",
  "บริษัท ปูนซิเมนต์ไทย (SCG) แนะนำ",
  "อื่นๆ"
];

// สถานะการสมัคร
const APPLICATION_STATUSES = {
  pending: {
    code: "pending",
    label: "รอตรวจสอบเอกสาร",
    badgeClass: "badge-status-pending",
    desc: "เจ้าหน้าที่งานรับสมัครกำลังตรวจสอบข้อมูลและเอกสารหลักฐานของท่าน"
  },
  incomplete: {
    code: "incomplete",
    label: "เอกสารไม่สมบูรณ์ (ต้องแก้ไข)",
    badgeClass: "badge-status-incomplete",
    desc: "มีเอกสารไม่ถูกต้องหรือไม่ชัดเจน กรุณาอัปโหลดเอกสารแก้ไขตามหมายเหตุ"
  },
  passed: {
    code: "passed",
    label: "ผ่านการคัดเลือก (มีสิทธิ์มอบตัว)",
    badgeClass: "badge-status-passed",
    desc: "ผ่านการคัดเลือกเรียบร้อยแล้ว กรุณาพิมพ์ใบสมัครและใบมอบตัวเพื่อนำมายื่นในวันรายงานตัว"
  },
  enrolled: {
    code: "enrolled",
    label: "มอบตัวและขึ้นทะเบียนสำเร็จ",
    badgeClass: "badge-status-enrolled",
    desc: "บันทึกข้อมูลการมอบตัวและออกรหัสนักศึกษาใหม่เรียบร้อยแล้ว ยินดีต้อนรับสู่รั้วท่าหลวงฯ"
  },
  rejected: {
    code: "rejected",
    label: "สละสิทธิ์ / ไม่ผ่านคุณสมบัติ",
    badgeClass: "badge-status-rejected",
    desc: "ผู้สมัครสละสิทธิ์ หรือไม่ผ่านเกณฑ์คุณสมบัติตามประกาศของวิทยาลัย"
  }
};

// ข้อมูลจำลองตั้งต้น (Initial Realistic Thai Vocational Applicants)
const INITIAL_DEMO_APPLICANTS = [
  {
    id: "APP-68001",
    academicYear: "2568",
    level: "ปวช.",
    majorCode: "20101",
    majorName: "สาขาวิชาช่างยนต์ (เครื่องกล)",
    applyDate: "2026-11-01T09:30:00",
    status: "enrolled",
    studentId: "68201010001",
    prefix: "นาย",
    firstName: "กิตติศักดิ์",
    lastName: "ทองมี",
    idCard: "1103702584129",
    birthDate: "2552-05-14",
    gender: "ชาย",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "O",
    phone: "0891234567",
    email: "kittisak.t@gmail.com",
    address: {
      houseNo: "45/2",
      moo: "3",
      subDistrict: "บ้านครัว",
      district: "บ้านหมอ",
      province: "สระบุรี",
      postalCode: "18270"
    },
    previousEducation: {
      schoolName: "โรงเรียนอนุบาลวัดบ้านหมอ",
      province: "สระบุรี",
      degree: "มัธยมศึกษาตอนต้น (ม.3)",
      gpax: "3.45"
    },
    parentInfo: {
      fatherName: "นายสมชาย ทองมี",
      fatherPhone: "0812345678",
      fatherOccupation: "พนักงาน บมจ.ปูนซิเมนต์ไทย",
      motherName: "นางสมร ทองมี",
      motherPhone: "0819876543",
      guardianName: "นายสมชาย ทองมี",
      guardianPhone: "0812345678",
      guardianRelation: "บิดา"
    },
    referral: "ครูแนะแนวโรงเรียนเดิม",
    documents: {
      photo: "assets/sample-photo-1.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "มอบตัวเรียบร้อย ชำระค่าธรรมเนียมและรับชุดฝึกงานแล้ว",
    enrollmentDetails: {
      enrolledDate: "2026-11-05",
      contractSigner: "นายสมชาย ทองมี",
      witness1: "นางสาวดวงใจ รักษ์ดี (หัวหน้างานทะเบียน)",
      witness2: "นายวิชาญ สอนช่าง (หัวหน้าแผนกช่างยนต์)",
      paymentStatus: "paid"
    }
  },
  {
    id: "APP-68002",
    academicYear: "2568",
    level: "ปวช.",
    majorCode: "20104",
    majorName: "สาขาวิชาช่างไฟฟ้ากำลัง",
    applyDate: "2026-11-02T10:15:00",
    status: "passed",
    studentId: "",
    prefix: "นาย",
    firstName: "ชนาธิป",
    lastName: "ปานแก้ว",
    idCard: "1199901452368",
    birthDate: "2552-08-20",
    gender: "ชาย",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "B",
    phone: "0863334444",
    email: "chanathip.p@gmail.com",
    address: {
      houseNo: "88",
      moo: "1",
      subDistrict: "หนองโดน",
      district: "หนองโดน",
      province: "สระบุรี",
      postalCode: "18190"
    },
    previousEducation: {
      schoolName: "โรงเรียนหนองโดนวิทยา",
      province: "สระบุรี",
      degree: "มัธยมศึกษาตอนต้น (ม.3)",
      gpax: "3.20"
    },
    parentInfo: {
      fatherName: "นายสนิท ปานแก้ว",
      fatherPhone: "0861112222",
      guardianName: "นายสนิท ปานแก้ว",
      guardianPhone: "0861112222",
      guardianRelation: "บิดา"
    },
    referral: "เพจ Facebook วิทยาลัย",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "เอกสารครบถ้วน ผ่านการคัดเลือกรอบโควตา นัดมอบตัววันที่ 10 พ.ย. 2568",
    enrollmentDetails: null
  },
  {
    id: "APP-68003",
    academicYear: "2568",
    level: "ปวช.",
    majorCode: "20201",
    majorName: "สาขาวิชาการบัญชี",
    applyDate: "2026-11-03T11:45:00",
    status: "incomplete",
    studentId: "",
    prefix: "นางสาว",
    firstName: "พิมพ์นภัส",
    lastName: "เจริญสุข",
    idCard: "1180200874152",
    birthDate: "2552-03-10",
    gender: "หญิง",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "A",
    phone: "0955566778",
    email: "pimnaphat.c@hotmail.com",
    address: {
      houseNo: "123/4",
      moo: "5",
      subDistrict: "โคกตูม",
      district: "เมืองลพบุรี",
      province: "ลพบุรี",
      postalCode: "15210"
    },
    previousEducation: {
      schoolName: "โรงเรียนวินิตศึกษา",
      province: "ลพบุรี",
      degree: "มัธยมศึกษาตอนต้น (ม.3)",
      gpax: "3.80"
    },
    parentInfo: {
      motherName: "นางยุพาพร เจริญสุข",
      motherPhone: "0898889999",
      guardianName: "นางยุพาพร เจริญสุข",
      guardianPhone: "0898889999",
      guardianRelation: "มารดา"
    },
    referral: "เพื่อน / รุ่นพี่ แนะนำ",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: ""
    },
    statusNotes: "ยังไม่ได้แนบใบแสดงผลการเรียน 5 ภาคเรียน (ปพ.1) กรุณาอัปโหลดเอกสารใหม่",
    enrollmentDetails: null
  },
  {
    id: "APP-68004",
    academicYear: "2568",
    level: "ปวส.",
    majorCode: "30104",
    majorName: "สาขาวิชาไฟฟ้ากำลัง (ระบบควบคุม/เครื่องมือวัด)",
    applyDate: "2026-11-04T13:20:00",
    status: "pending",
    studentId: "",
    prefix: "นาย",
    firstName: "ธนกฤต",
    lastName: "วงศ์สวรรค์",
    idCard: "1100501239841",
    birthDate: "2549-11-02",
    gender: "ชาย",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "O",
    phone: "0812233445",
    email: "thanakrit.w@gmail.com",
    address: {
      houseNo: "10/1",
      moo: "2",
      subDistrict: "ท่าหลวง",
      district: "ท่าเรือ",
      province: "พระนครศรีอยุธยา",
      postalCode: "13130"
    },
    previousEducation: {
      schoolName: "วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ (จบ ปวช.)",
      province: "สระบุรี",
      degree: "ปวช.3 ไฟฟ้ากำลัง",
      gpax: "3.55"
    },
    parentInfo: {
      fatherName: "นายประวิทย์ วงศ์สวรรค์",
      fatherPhone: "0817766554",
      guardianName: "นายประวิทย์ วงศ์สวรรค์",
      guardianPhone: "0817766554",
      guardianRelation: "บิดา"
    },
    referral: "เพื่อน / รุ่นพี่ แนะนำ",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "อยู่ระหว่างเจ้าหน้าที่ตรวจสอบใบ รบ. ระดับ ปวช.",
    enrollmentDetails: null
  },
  {
    id: "APP-68005",
    academicYear: "2568",
    level: "ปวส.",
    majorCode: "30901",
    majorName: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    applyDate: "2026-11-05T14:10:00",
    status: "passed",
    studentId: "",
    prefix: "นางสาว",
    firstName: "สุพัตรา",
    lastName: "บุญมี",
    idCard: "1198500224190",
    birthDate: "2549-07-18",
    gender: "หญิง",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "AB",
    phone: "0923344556",
    email: "supattra.bm@gmail.com",
    address: {
      houseNo: "50",
      moo: "4",
      subDistrict: "หน้าพระลาน",
      district: "เฉลิมพระเกียรติ",
      province: "สระบุรี",
      postalCode: "18240"
    },
    previousEducation: {
      schoolName: "โรงเรียนสระบุรีวิทยาคม",
      province: "สระบุรี",
      degree: "มัธยมศึกษาตอนปลาย (ม.6)",
      gpax: "3.62"
    },
    parentInfo: {
      motherName: "นางนิตยา บุญมี",
      motherPhone: "0894455667",
      guardianName: "นางนิตยา บุญมี",
      guardianPhone: "0894455667",
      guardianRelation: "มารดา"
    },
    referral: "กิจกรรม Open House / นิทรรศการวิทยาลัย",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "เอกสารครบถ้วน นัดรายงานตัวพร้อมหลักฐานตัวจริง",
    enrollmentDetails: null
  },
  {
    id: "APP-68006",
    academicYear: "2568",
    level: "ปวช.",
    majorCode: "20106",
    majorName: "สาขาวิชาช่างซ่อมบำรุง (ทวิภาคี SCG)",
    applyDate: "2026-11-05T15:30:00",
    status: "enrolled",
    studentId: "68201060002",
    prefix: "นาย",
    firstName: "ภานุพงศ์",
    lastName: "แก่นจันทร์",
    idCard: "1103300456123",
    birthDate: "2552-09-05",
    gender: "ชาย",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "B",
    phone: "0856677889",
    email: "panupong.k@gmail.com",
    address: {
      houseNo: "77/9",
      moo: "6",
      subDistrict: "พุกร่าง",
      district: "พระพุทธบาท",
      province: "สระบุรี",
      postalCode: "18120"
    },
    previousEducation: {
      schoolName: "โรงเรียนสุทธิวิทยา",
      province: "สระบุรี",
      degree: "มัธยมศึกษาตอนต้น (ม.3)",
      gpax: "3.50"
    },
    parentInfo: {
      fatherName: "นายชูชาติ แก่นจันทร์",
      fatherPhone: "0890011223",
      guardianName: "นายชูชาติ แก่นจันทร์",
      guardianPhone: "0890011223",
      guardianRelation: "บิดา"
    },
    referral: "บริษัท ปูนซิเมนต์ไทย (SCG) แนะนำ",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "ผ่านการคัดเลือกและทำสัญญาฝึกอาชีพทวิภาคี SCG เรียบร้อย",
    enrollmentDetails: {
      enrolledDate: "2026-11-06",
      contractSigner: "นายชูชาติ แก่นจันทร์",
      witness1: "นางสาวดวงใจ รักษ์ดี (หัวหน้างานทะเบียน)",
      witness2: "นายสุรพล มีทรัพย์ (ผู้แทน บมจ.ปูนซีเมนต์ไทย)",
      paymentStatus: "paid"
    }
  },
  {
    id: "APP-68007",
    academicYear: "2568",
    level: "ปวช.",
    majorCode: "20204",
    majorName: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล",
    applyDate: "2026-11-06T08:50:00",
    status: "pending",
    studentId: "",
    prefix: "นางสาว",
    firstName: "ชลธิชา",
    lastName: "แสงดาว",
    idCard: "1198401345678",
    birthDate: "2552-12-12",
    gender: "หญิง",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "O",
    phone: "0871122334",
    email: "cholticha.sd@gmail.com",
    address: {
      houseNo: "12",
      moo: "8",
      subDistrict: "จำปา",
      district: "ท่าเรือ",
      province: "พระนครศรีอยุธยา",
      postalCode: "13130"
    },
    previousEducation: {
      schoolName: "โรงเรียนท่าเรือ 'นิตยานุกูล'",
      province: "พระนครศรีอยุธยา",
      degree: "มัธยมศึกษาตอนต้น (ม.3)",
      gpax: "3.68"
    },
    parentInfo: {
      motherName: "นางสมหมาย แสงดาว",
      motherPhone: "0815566778",
      guardianName: "นางสมหมาย แสงดาว",
      guardianPhone: "0815566778",
      guardianRelation: "มารดา"
    },
    referral: "ครูแนะแนวโรงเรียนเดิม",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "ส่งใบสมัครใหม่ รอเจ้าหน้าที่ตรวจเอกสาร",
    enrollmentDetails: null
  },
  {
    id: "APP-68008",
    academicYear: "2568",
    level: "ปวส.",
    majorCode: "30106",
    majorName: "สาขาวิชาเมคคาทรอนิกส์และหุ่นยนต์",
    applyDate: "2026-11-06T11:15:00",
    status: "passed",
    studentId: "",
    prefix: "นาย",
    firstName: "วรวุฒิ",
    lastName: "พรมมา",
    idCard: "1103701998246",
    birthDate: "2549-04-03",
    gender: "ชาย",
    nationality: "ไทย",
    religion: "พุทธ",
    bloodGroup: "A",
    phone: "0887766554",
    email: "worawut.p@gmail.com",
    address: {
      houseNo: "90/4",
      moo: "2",
      subDistrict: "หนองแค",
      district: "หนองแค",
      province: "สระบุรี",
      postalCode: "18140"
    },
    previousEducation: {
      schoolName: "วิทยาลัยเทคนิคสระบุรี",
      province: "สระบุรี",
      degree: "ปวช.3 แมคคาทรอนิกส์",
      gpax: "3.75"
    },
    parentInfo: {
      fatherName: "นายประดิษฐ์ พรมมา",
      fatherPhone: "0845566778",
      guardianName: "นายประดิษฐ์ พรมมา",
      guardianPhone: "0845566778",
      guardianRelation: "บิดา"
    },
    referral: "เว็บไซต์วิทยาลัย",
    documents: {
      photo: "assets/sample-photo.jpg",
      idCardDoc: "assets/sample-idcard.jpg",
      houseDoc: "assets/sample-house.jpg",
      transcriptDoc: "assets/sample-transcript.pdf"
    },
    statusNotes: "ผ่านการทดสอบสัมภาษณ์รอบพิเศษ นัดส่งตัวนักเรียน",
    enrollmentDetails: null
  }
];

// Storage Engine
const STORAGE_KEY_APPLICANTS = "ttc_admission_applicants_v1";
const STORAGE_KEY_NOTIFICATIONS = "ttc_admission_notifications_v1";
const STORAGE_KEY_LINE_SETTINGS = "ttc_admission_line_settings_v1";

const TTC_DB = {
  // Initialize Database with demo data if empty
  init: function() {
    if (!localStorage.getItem(STORAGE_KEY_APPLICANTS)) {
      this.resetDemo();
    }
    if (!localStorage.getItem(STORAGE_KEY_NOTIFICATIONS)) {
      const initNotes = [
        {
          id: "NOTIF-1",
          type: "new_applicant",
          message: "ผู้สมัครใหม่: นายกิตติศักดิ์ ทองมี สมัครสาขาวิชาช่างยนต์ (ปวช.)",
          timestamp: "2026-11-01T09:30:15",
          read: true
        },
        {
          id: "NOTIF-2",
          type: "status_change",
          message: "อนุมัติผล: นายกิตติศักดิ์ ทองมี ผ่านการมอบตัวเรียบร้อยแล้ว",
          timestamp: "2026-11-05T14:22:00",
          read: true
        },
        {
          id: "NOTIF-3",
          type: "doc_incomplete",
          message: "แจ้งเตือน: นางสาวพิมพ์นภัส เจริญสุข เอกสารใบแสดงผลการเรียนไม่สมบูรณ์",
          timestamp: "2026-11-03T12:00:10",
          read: false
        }
      ];
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(initNotes));
    }
    if (!localStorage.getItem(STORAGE_KEY_LINE_SETTINGS)) {
      const defaultLine = {
        lineNotifyToken: "demo_line_notify_token_ttc",
        lineOaWebhook: "https://notify-bot.line.me/api/notify",
        adminEmail: "admission@tl.ac.th",
        enableLineNotify: true,
        enableEmail: false
      };
      localStorage.setItem(STORAGE_KEY_LINE_SETTINGS, JSON.stringify(defaultLine));
    }
  },

  // Reset to initial demo dataset
  resetDemo: function() {
    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(INITIAL_DEMO_APPLICANTS));
    return INITIAL_DEMO_APPLICANTS;
  },

  // Get all applicants with optional filters
  getApplicants: function(filters = {}) {
    this.init();
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY_APPLICANTS) || "[]");

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      data = data.filter(item => 
        (item.firstName && item.firstName.toLowerCase().includes(q)) ||
        (item.lastName && item.lastName.toLowerCase().includes(q)) ||
        (item.idCard && item.idCard.includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.studentId && item.studentId.includes(q)) ||
        (item.previousEducation && item.previousEducation.schoolName.toLowerCase().includes(q))
      );
    }

    if (filters.academicYear && filters.academicYear !== "all") {
      data = data.filter(item => item.academicYear === filters.academicYear);
    }

    if (filters.level && filters.level !== "all") {
      data = data.filter(item => item.level === filters.level);
    }

    if (filters.majorCode && filters.majorCode !== "all") {
      data = data.filter(item => item.majorCode === filters.majorCode);
    }

    if (filters.status && filters.status !== "all") {
      data = data.filter(item => item.status === filters.status);
    }

    return data;
  },

  // Get single applicant by Application ID (e.g. APP-68001)
  getApplicantById: function(id) {
    const list = this.getApplicants();
    return list.find(item => item.id === id) || null;
  },

  // Get single applicant by Thai 13-digit Citizen ID
  getApplicantByCitizenId: function(idCard) {
    const cleanId = (idCard || "").replace(/[^0-9]/g, "");
    const list = this.getApplicants();
    return list.find(item => item.idCard.replace(/[^0-9]/g, "") === cleanId) || null;
  },

  // Save or update an applicant
  saveApplicant: function(applicantData) {
    this.init();
    const list = this.getApplicants();
    let isNew = false;

    if (!applicantData.id) {
      // Generate new application ID
      isNew = true;
      const count = list.length + 1;
      const yr = (applicantData.academicYear || TTC_COLLEGE_INFO.currentAcademicYear).slice(-2);
      applicantData.id = `APP-${yr}${String(count).padStart(3, '0')}`;
      applicantData.applyDate = new Date().toISOString();
      applicantData.status = "pending";
      applicantData.studentId = "";
      applicantData.statusNotes = "ยื่นใบสมัครเรียบร้อย รอเจ้าหน้าที่ตรวจเอกสาร";
      list.unshift(applicantData);
    } else {
      const idx = list.findIndex(item => item.id === applicantData.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...applicantData };
      } else {
        list.unshift(applicantData);
      }
    }

    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(list));

    if (isNew) {
      this.addNotification(
        "new_applicant",
        `ผู้สมัครใหม่: ${applicantData.prefix}${applicantData.firstName} ${applicantData.lastName} สมัคร ${applicantData.level} ${applicantData.majorName}`,
        applicantData.id
      );
      this.dispatchExternalNotification({
        event: "new_application",
        applicant: applicantData
      });
    }

    return applicantData;
  },

  // Update status with remarks
  updateApplicantStatus: function(id, newStatus, reason = "", updatedBy = "เจ้าหน้าที่ทะเบียน") {
    const list = this.getApplicants();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const prevStatus = list[idx].status;
    list[idx].status = newStatus;
    list[idx].statusNotes = reason || list[idx].statusNotes;
    list[idx].lastUpdated = new Date().toISOString();
    list[idx].updatedBy = updatedBy;

    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(list));

    // Log notification
    const statusLabel = APPLICATION_STATUSES[newStatus] ? APPLICATION_STATUSES[newStatus].label : newStatus;
    this.addNotification(
      "status_change",
      `อัปเดตสถานะ: ${list[idx].prefix}${list[idx].firstName} ${list[idx].lastName} -> [${statusLabel}] ${reason ? `(${reason})` : ''}`,
      id
    );

    this.dispatchExternalNotification({
      event: "status_changed",
      applicant: list[idx],
      previousStatus: prevStatus,
      newStatus: newStatus,
      notes: reason
    });

    return list[idx];
  },

  // Record Enrollment (มอบตัว) & Generate Student ID
  enrollApplicant: function(id, details) {
    const list = this.getApplicants();
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const applicant = list[idx];
    applicant.status = "enrolled";
    
    // Generate Student ID (รหัสนักศึกษา 11 หลัก ตามระบบ สอศ.)
    // เช่น 68 (ปี) + 20101 (รหัสสาขา) + 0001 (ลำดับ)
    if (!applicant.studentId) {
      const yr = (applicant.academicYear || TTC_COLLEGE_INFO.currentAcademicYear).slice(-2);
      const code = applicant.majorCode || "20101";
      const randomSeq = String(Math.floor(Math.random() * 900) + 100);
      applicant.studentId = `${yr}${code}0${randomSeq}`;
    }

    applicant.enrollmentDetails = {
      enrolledDate: details.enrolledDate || new Date().toISOString().split("T")[0],
      contractSigner: details.contractSigner || applicant.parentInfo.guardianName,
      signerRelation: details.signerRelation || applicant.parentInfo.guardianRelation,
      witness1: details.witness1 || "นางสาวดวงใจ รักษ์ดี (หัวหน้างานทะเบียน)",
      witness2: details.witness2 || "นายวิชาญ สอนช่าง (หัวหน้าแผนก)",
      paymentStatus: details.paymentStatus || "paid",
      notes: details.notes || "มอบตัวและบันทึกสัญญาค้ำประกันเรียบร้อย"
    };
    applicant.statusNotes = `มอบตัวสำเร็จ รหัสนักศึกษา: ${applicant.studentId}`;

    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(list));

    this.addNotification(
      "enrolled",
      `มอบตัวสำเร็จ: ${applicant.prefix}${applicant.firstName} ${applicant.lastName} ได้รับรหัสนักศึกษา ${applicant.studentId}`,
      id
    );

    return applicant;
  },

  // Delete applicant
  deleteApplicant: function(id) {
    let list = this.getApplicants();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(list));
    return true;
  },

  // Analytics summary for Dashboard
  getAnalytics: function() {
    const list = this.getApplicants();
    
    // Counts
    const total = list.length;
    const pending = list.filter(x => x.status === "pending").length;
    const incomplete = list.filter(x => x.status === "incomplete").length;
    const passed = list.filter(x => x.status === "passed").length;
    const enrolled = list.filter(x => x.status === "enrolled").length;
    const vcCount = list.filter(x => x.level === "ปวช.").length;
    const dvsCount = list.filter(x => x.level === "ปวส.").length;

    // Major breakdown
    const byMajor = {};
    list.forEach(item => {
      const key = `${item.level} ${item.majorName}`;
      byMajor[key] = (byMajor[key] || 0) + 1;
    });

    // School breakdown
    const bySchool = {};
    list.forEach(item => {
      const sch = item.previousEducation?.schoolName || "ไม่ระบุ";
      bySchool[sch] = (bySchool[sch] || 0) + 1;
    });

    // Referral breakdown
    const byReferral = {};
    list.forEach(item => {
      const ref = item.referral || "ไม่ระบุ";
      byReferral[ref] = (byReferral[ref] || 0) + 1;
    });

    // Province breakdown
    const byProvince = {};
    list.forEach(item => {
      const prov = item.address?.province || "สระบุรี";
      byProvince[prov] = (byProvince[prov] || 0) + 1;
    });

    return {
      total,
      pending,
      incomplete,
      passed,
      enrolled,
      vcCount,
      dvsCount,
      byMajor,
      bySchool,
      byReferral,
      byProvince
    };
  },

  // Notifications
  getNotifications: function() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFICATIONS) || "[]");
  },

  addNotification: function(type, message, refId = "") {
    const list = this.getNotifications();
    const item = {
      id: `NOTIF-${Date.now()}`,
      type,
      message,
      refId,
      timestamp: new Date().toISOString(),
      read: false
    };
    list.unshift(item);
    if (list.length > 50) list.pop();
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(list));
    return item;
  },

  markNotificationsAsRead: function() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(list));
  },

  // LINE / Webhook integration simulation & trigger
  getLineSettings: function() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LINE_SETTINGS) || "{}");
  },

  saveLineSettings: function(settings) {
    localStorage.setItem(STORAGE_KEY_LINE_SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Dispatch notification (Simulate LINE Notify & Webhook with live log)
  dispatchExternalNotification: function(payload) {
    const settings = this.getLineSettings();
    const time = new Date().toLocaleTimeString('th-TH');
    let messageText = "";

    if (payload.event === "new_application") {
      const a = payload.applicant;
      messageText = `[TTC ระบบรับสมัครออนไลน์]\nมีผู้สมัครใหม่เข้ามา!\nชื่อ: ${a.prefix}${a.firstName} ${a.lastName}\nระดับ: ${a.level} สาขา: ${a.majorName}\nโรงเรียนเดิม: ${a.previousEducation?.schoolName || '-'}\nเบอร์โทร: ${a.phone}\nเวลา: ${time}`;
    } else if (payload.event === "status_changed") {
      const a = payload.applicant;
      const statusLbl = APPLICATION_STATUSES[payload.newStatus]?.label || payload.newStatus;
      messageText = `[TTC แจ้งสถานะผู้สมัคร]\nผู้สมัคร: ${a.prefix}${a.firstName} ${a.lastName}\nเลขที่ใบสมัคร: ${a.id}\nสถานะใหม่: ${statusLbl}\nหมายเหตุ: ${payload.notes || 'ไม่มี'}\nเวลา: ${time}`;
    }

    console.log(">> [LINE NOTIFY / WEBHOOK DISPATCHED] <<", {
      token: settings.lineNotifyToken ? "CONFIGURED (MASKED)" : "NONE",
      message: messageText
    });

    // Store in transient runtime dispatch log
    if (!window.__ttc_notification_logs) {
      window.__ttc_notification_logs = [];
    }
    window.__ttc_notification_logs.unshift({
      time: new Date().toISOString(),
      channel: "LINE Notify & Email",
      content: messageText,
      status: "SUCCESS (200 OK)"
    });
  }
};

// Auto initialize
TTC_DB.init();
