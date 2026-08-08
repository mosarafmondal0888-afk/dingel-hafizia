/* =========================================================
   DINGEL HAFIZIA MADRASA
   PROFESSIONAL MANAGEMENT SYSTEM
   APP.JS
========================================================= */


/* =========================================================
   1. FIREBASE CONFIGURATION
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCmoFXa6eYEi-SV_Otk9c-l4TlHWXzMFQU",
    authDomain: "dingel-hafizia-manager.firebaseapp.com",
    projectId: "dingel-hafizia-manager",
    storageBucket: "dingel-hafizia-manager.firebasestorage.app",
    messagingSenderId: "1019481403108",
    appId: "1:1019481403108:web:06b44cac27a54a557d86f1",
    measurementId: "G-FPETR4EDYP"
};


/* Firebase Initialize */

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();


/* =========================================================
   2. GLOBAL VARIABLES
========================================================= */

const MADRASA_PASSWORD = "123";

let students = [];
let collections = [];

let currentReceiptNo = null;

let currentStudentPage = 1;

const STUDENTS_PER_PAGE = 15;


/* =========================================================
   3. UTILITY FUNCTIONS
========================================================= */


/* INR Currency */

function formatINR(amount) {

    const value = Number(amount) || 0;

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);

}


/* Escape HTML */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* Today */

function getTodayDate() {

    return new Date().toLocaleDateString("bn-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}


/* Current month */

function getCurrentMonth() {

    const months = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর"
    ];

    return months[new Date().getMonth()];
}


/* Toast */

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = document.getElementById("toastIcon");

    if (!toast || !toastMessage || !toastIcon) {
        alert(message);
        return;
    }

    toastMessage.innerText = message;

    if (type === "error") {

        toastIcon.className = "fa-solid fa-circle-exclamation";
        toastIcon.style.color = "#fb7185";

    } else {

        toastIcon.className = "fa-solid fa-circle-check";
        toastIcon.style.color = "#34d399";

    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}


/* Loading */

function showLoading(text = "ডাটা লোড হচ্ছে...") {

    const loading = document.getElementById("loadingScreen");
    const loadingText = document.getElementById("loadingText");

    if (loading) {
        loading.classList.remove("hidden");
    }

    if (loadingText) {
        loadingText.innerText = text;
    }

}


function hideLoading() {

    const loading = document.getElementById("loadingScreen");

    if (loading) {
        loading.classList.add("hidden");
    }

}


/* =========================================================
   4. LOGIN SYSTEM
========================================================= */

function handleLogin(event) {

    event.preventDefault();

    const passwordInput =
        document.getElementById("passwordInput");

    const errorMessage =
        document.getElementById("errorMessage");

    const password =
        passwordInput ? passwordInput.value : "";

    if (password === MADRASA_PASSWORD) {

        if (errorMessage) {
            errorMessage.style.display = "none";
        }

        const loginScreen =
            document.getElementById("loginScreen");

        const dashboardScreen =
            document.getElementById("dashboardScreen");

        if (loginScreen) {
            loginScreen.classList.add("hidden");
        }

        if (dashboardScreen) {
            dashboardScreen.classList.remove("hidden");
        }

        if (passwordInput) {
            passwordInput.value = "";
        }

        localStorage.setItem(
            "dingelLoggedIn",
            "true"
        );

        loadApplicationData();

    } else {

        if (errorMessage) {
            errorMessage.style.display = "block";
        }

        if (passwordInput) {
            passwordInput.value = "";
            passwordInput.focus();
        }

    }

}


/* Password show/hide */

function togglePassword() {

    const input =
        document.getElementById("passwordInput");

    const icon =
        document.getElementById("passwordIcon");

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";

        if (icon) {
            icon.className = "fa-solid fa-eye-slash";
        }

    } else {

        input.type = "password";

        if (icon) {
            icon.className = "fa-solid fa-eye";
        }

    }

}


/* Logout */

function handleLogout() {

    localStorage.removeItem("dingelLoggedIn");

    const dashboard =
        document.getElementById("dashboardScreen");

    const login =
        document.getElementById("loginScreen");

    if (dashboard) {
        dashboard.classList.add("hidden");
    }

    if (login) {
        login.classList.remove("hidden");
    }

}


/* =========================================================
   5. SIDEBAR / NAVIGATION
========================================================= */

function openSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.add("open");
    }

}


function closeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.remove("open");
    }

}


/* Change section */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".content-section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const target =
        document.getElementById(sectionId);

    if (target) {
        target.classList.remove("hidden");
    }


    const menuItems =
        document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionId) {
            item.classList.add("active");
        }

    });


    const titles = {

        dashboardSection: [
            "ড্যাশবোর্ড",
            "মাদ্রাসার সামগ্রিক হিসাব ও তথ্য"
        ],

        studentsSection: [
            "ছাত্র তালিকা",
            "সকল ছাত্রের তথ্য ও ব্যবস্থাপনা"
        ],

        collectionSection: [
            "ফি আদায়",
            "সকল ফি জমার রেকর্ড"
        ],

        reportsSection: [
            "রিপোর্ট",
            "মাদ্রাসার আর্থিক ও ছাত্র সংক্রান্ত রিপোর্ট"
        ]

    };


    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");

    if (titles[sectionId]) {

        if (title) {
            title.innerText = titles[sectionId][0];
        }

        if (subtitle) {
            subtitle.innerText = titles[sectionId][1];
        }

    }


    closeSidebar();

}


/* =========================================================
   6. LOAD ALL APPLICATION DATA
========================================================= */

async function loadApplicationData() {

    showLoading("ডাটা লোড হচ্ছে...");

    try {

        await Promise.all([
            fetchStudents(),
            fetchCollections()
        ]);

        renderAll();

    } catch (error) {

        console.error(error);

        showToast(
            "ডাটা লোড করতে সমস্যা হয়েছে।",
            "error"
        );

    } finally {

        hideLoading();

    }

}


/* =========================================================
   7. FETCH STUDENTS
========================================================= */

async function fetchStudents() {

    try {

        const snapshot =
            await db.collection("students").get();


        if (!snapshot.empty) {

            students =
                snapshot.docs.map(doc => {

                    const data = doc.data();

                    return {
                        id: doc.id,
                        ...data
                    };

                });

        } else {

            /* Firebase empty হলে students.json */

            const response =
                await fetch("students.json");

            if (!response.ok) {
                throw new Error(
                    "students.json পাওয়া যায়নি"
                );
            }

            const jsonData =
                await response.json();


            students =
                jsonData.map(student => {

                    let type = "General";

                    if (
                        String(student.monthly)
                            .toUpperCase() === "ATIM"
                    ) {

                        type = "Orphan";

                    } else if (
                        String(student.monthly)
                            .toUpperCase() === "N RSD"
                    ) {

                        type = "Poor";

                    }


                    let monthly = 0;

                    const monthlyValue =
                        String(student.monthly || "")
                            .trim()
                            .toUpperCase();


                    if (
                        monthlyValue !== "ATIM" &&
                        monthlyValue !== "N RSD" &&
                        monthlyValue !== ""
                    ) {

                        monthly =
                            Number(monthlyValue) || 0;

                    }


                    return {

                        id: "std_" + student.roll,

                        roll: student.roll,

                        name: student.name || "",

                        class:
                            String(student.class || "")
                                .toUpperCase(),

                        guardian:
                            student.father || "N/A",

                        phone:
                            student.number || "N/A",

                        address:
                            student.address || "",

                        type: type,

                        monthly: monthly

                    };

                });

        }


        renderStudents();

        updateDashboard();

    } catch (error) {

        console.error(
            "Student Fetch Error:",
            error
        );

        throw error;

    }

}


/* =========================================================
   8. FETCH COLLECTIONS
========================================================= */

async function fetchCollections() {

    try {

        const snapshot =
            await db.collection("collections").get();

        collections =
            snapshot.docs.map(doc => {

                return {
                    id: doc.id,
                    ...doc.data()
                };

            });

        renderCollections();

        updateDashboard();

    } catch (error) {

        console.error(
            "Collection Fetch Error:",
            error
        );

        throw error;

    }

}


/* =========================================================
   9. RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderStudents();

    renderCollections();

    renderRecentCollections();

    updateDashboard();

    updateReports();

}


/* =========================================================
   10. DASHBOARD UPDATE
========================================================= */

function updateDashboard() {

    const totalStudents =
        students.length;

    const totalCollection =
        collections.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );


    const currentMonth =
        getCurrentMonth();


    const monthlyCollection =
        collections
            .filter(item =>
                item.month === currentMonth
            )
            .reduce(
                (sum, item) =>
                    sum + Number(item.amount || 0),
                0
            );


    const freeStudents =
        students.filter(student =>
            student.type === "Orphan" ||
            student.type === "Poor"
        ).length;


    setText(
        "totalStudents",
        toBanglaNumber(totalStudents)
    );

    setText(
        "totalCollection",
        formatINR(totalCollection)
    );

    setText(
        "monthlyCollection",
        formatINR(monthlyCollection)
    );

    setText(
        "freeStudents",
        toBanglaNumber(freeStudents)
    );


    setText(
        "collectionPageTotal",
        formatINR(totalCollection)
    );

    setText(
        "totalReceipts",
        toBanglaNumber(collections.length)
    );

}


/* Set text helper */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }

}


/* Bangla numbers */

function toBanglaNumber(number) {

    const map = {
        "0": "০",
        "1": "১",
        "2": "২",
        "3": "৩",
        "4": "৪",
        "5": "৫",
        "6": "৬",
        "7": "৭",
        "8": "৮",
        "9": "৯"
    };

    return String(number)
        .replace(/[0-9]/g, digit => map[digit]);

}


/* =========================================================
   11. STUDENT MODAL
========================================================= */

function openStudentModal(studentId = null) {

    const modal =
        document.getElementById("studentModal");

    const form =
        document.getElementById("addStudentForm");

    const title =
        document.getElementById("studentModalTitle");


    if (!modal) return;


    if (form) {
        form.reset();
    }


    setText(
        "editingStudentId",
        ""
    );

    const editing =
        document.getElementById(
            "editingStudentId"
        );

    if (editing) {
        editing.value = "";
    }


    if (studentId) {

        const student =
            students.find(
                item => item.id === studentId
            );

        if (!student) return;


        if (title) {
            title.innerText =
                "ছাত্রের তথ্য এডিট";
        }


        setInput(
            "editingStudentId",
            student.id
        );

        setInput(
            "studentName",
            student.name
        );

        setInput(
            "studentRoll",
            student.roll
        );

        setInput(
            "studentClass",
            student.class
        );

        setInput(
            "guardianName",
            student.guardian
        );

        setInput(
            "guardianPhone",
            student.phone === "N/A"
                ? ""
                : student.phone
        );

        setInput(
            "studentType",
            student.type
        );

        setInput(
            "studentMonthly",
            student.monthly || ""
        );

    } else {

        if (title) {
            title.innerText =
                "নতুন ছাত্র ভর্তি";
        }

    }


    modal.classList.remove("hidden");

}


function closeStudentModal() {

    const modal =
        document.getElementById("studentModal");

    if (modal) {
        modal.classList.add("hidden");
    }

}


function setInput(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value =
            value === undefined ||
            value === null
                ? ""
                : value;
    }

}


/* Compatibility */

function toggleStudentModal() {

    const modal =
        document.getElementById("studentModal");

    if (!modal) return;

    if (modal.classList.contains("hidden")) {
        openStudentModal();
    } else {
        closeStudentModal();
    }

}


/* =========================================================
   12. ADD / EDIT STUDENT
========================================================= */

async function saveStudent(event) {

    event.preventDefault();


    const name =
        document.getElementById("studentName")
            .value.trim();

    const roll =
        document.getElementById("studentRoll")
            .value.trim();

    const studentClass =
        document.getElementById("studentClass")
            .value.trim();

    const guardian =
        document.getElementById("guardianName")
            .value.trim();

    const phone =
        document.getElementById("guardianPhone")
            .value.trim();

    const type =
        document.getElementById("studentType")
            .value;

    const monthly =
        Number(
            document.getElementById(
                "studentMonthly"
            ).value
        ) || 0;


    if (!name || !roll || !studentClass) {

        showToast(
            "নাম, রোল ও শ্রেণী অবশ্যই দিতে হবে।",
            "error"
        );

        return;

    }


    if (phone) {

        const phoneRegex =
            /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {

            showToast(
                "সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর দিন।",
                "error"
            );

            return;

        }

    }


    const editingId =
        document.getElementById(
            "editingStudentId"
        ).value;


    const studentData = {

        name: name,

        roll: roll,

        class: studentClass,

        guardian:
            guardian || "N/A",

        phone:
            phone || "N/A",

        type: type,

        monthly:
            type === "Orphan" ||
            type === "Poor"
                ? 0
                : monthly,

        updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

    };


    try {

        showLoading(
            editingId
                ? "ছাত্রের তথ্য আপডেট হচ্ছে..."
                : "নতুন ছাত্র সেভ হচ্ছে..."
        );


        if (editingId) {

            await db
                .collection("students")
                .doc(editingId)
                .update(studentData);


            const index =
                students.findIndex(
                    item => item.id === editingId
                );


            if (index !== -1) {

                students[index] = {
                    ...students[index],
                    ...studentData
                };

            }


            showToast(
                "ছাত্রের তথ্য সফলভাবে আপডেট হয়েছে।"
            );

        } else {

            studentData.createdAt =
                firebase.firestore.FieldValue.serverTimestamp();


            const docRef =
                await db
                    .collection("students")
                    .add(studentData);


            students.push({
                id: docRef.id,
                ...studentData
            });


            showToast(
                "নতুন ছাত্র সফলভাবে যোগ হয়েছে।"
            );

        }


        closeStudentModal();

        renderAll();

    } catch (error) {

        console.error(error);

        showToast(
            "ডাটা সেভ করতে সমস্যা হয়েছে।",
            "error"
        );

    } finally {

        hideLoading();

    }

}


/* =========================================================
   13. STUDENT RENDER
========================================================= */

function renderStudents() {

    const tableBody =
        document.getElementById(
            "studentTableBody"
        );

    if (!tableBody) return;


    const search =
        (
            document.getElementById(
                "searchInput"
            )?.value || ""
        )
        .trim()
        .toLowerCase();


    const classFilter =
        (
            document.getElementById(
                "classFilter"
            )?.value || ""
        )
        .trim()
        .toUpperCase();


    const typeFilter =
        (
            document.getElementById(
                "typeFilter"
            )?.value || ""
        )
        .trim();


    let filtered =
        students.filter(student => {

            const searchable = [

                student.name,

                student.roll,

                student.class,

                student.guardian,

                student.phone

            ]
                .join(" ")
                .toLowerCase();


            const searchMatch =
                !search ||
                searchable.includes(search);


            const classMatch =
                !classFilter ||
                String(student.class || "")
                    .toUpperCase()
                    .includes(classFilter);


            const typeMatch =
                !typeFilter ||
                student.type === typeFilter;


            return (
                searchMatch &&
                classMatch &&
                typeMatch
            );

        });


    filtered.sort((a, b) => {

        const rollA =
            Number(a.roll) || 0;

        const rollB =
            Number(b.roll) || 0;

        return rollA - rollB;

    });


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                STUDENTS_PER_PAGE
            )
        );


    if (
        currentStudentPage >
        totalPages
    ) {
        currentStudentPage = totalPages;
    }


    const start =
        (
            currentStudentPage - 1
        ) *
        STUDENTS_PER_PAGE;


    const pageStudents =
        filtered.slice(
            start,
            start + STUDENTS_PER_PAGE
        );


    tableBody.innerHTML = "";


    if (pageStudents.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="no-history">

                        <i
                            class="fa-solid fa-folder-open"
                            style="font-size:30px;margin-bottom:10px;"
                        ></i>

                        <br>

                        কোনো ছাত্র পাওয়া যায়নি।

                    </div>

                </td>

            </tr>

        `;

        renderPagination(0);

        return;

    }


    pageStudents.forEach(student => {

        const row =
            document.createElement("tr");


        const typeBadge =
            getStudentTypeBadge(student);


        const monthlyText =
            getMonthlyText(student);


        const phone =
            student.phone &&
            student.phone !== "N/A"
                ? `
                    <a
                        href="tel:+91${escapeHTML(student.phone)}"
                        style="color:#047857;font-weight:600;"
                    >
                        +91 ${escapeHTML(student.phone)}
                    </a>
                `
                : `
                    <span style="color:#94a3b8;">
                        নেই
                    </span>
                `;


        row.innerHTML = `

            <td>
                <strong>
                    #${escapeHTML(student.roll)}
                </strong>
            </td>


            <td>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:9px;
                ">

                    <div style="
                        width:34px;
                        height:34px;
                        border-radius:9px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#ecfdf5;
                        color:#047857;
                    ">

                        <i class="fa-solid fa-user"></i>

                    </div>


                    <div>

                        <strong style="
                            display:block;
                            color:#0f172a;
                        ">

                            ${escapeHTML(student.name)}

                        </strong>

                        <small style="
                            color:#94a3b8;
                            font-size:9px;
                        ">

                            ${escapeHTML(
                                student.address || ""
                            )}

                        </small>

                    </div>

                </div>

            </td>


            <td>

                <span style="
                    padding:5px 8px;
                    border-radius:7px;
                    background:#f1f5f9;
                    font-size:9px;
                    font-weight:700;
                ">

                    ${escapeHTML(
                        formatClassName(
                            student.class
                        )
                    )}

                </span>

            </td>


            <td>
                ${escapeHTML(
                    student.guardian || "N/A"
                )}
            </td>


            <td>
                ${phone}
            </td>


            <td>
                ${typeBadge}
                <br>
                <small style="
                    color:#64748b;
                    font-size:9px;
                ">
                    ${monthlyText}
                </small>
            </td>


            <td>

                <div style="
                    display:flex;
                    gap:4px;
                    justify-content:center;
                    flex-wrap:wrap;
                ">


                    <button
                        onclick="openFeeModal('${escapeHTML(student.id)}')"
                        title="ফি জমা"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#dcfce7;
                            color:#15803d;
                        "
                    >

                        <i class="fa-solid fa-indian-rupee-sign"></i>

                    </button>


                    <button
                        onclick="showStudentHistory('${escapeHTML(student.id)}')"
                        title="ইতিহাস"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#dbeafe;
                            color:#2563eb;
                        "
                    >

                        <i class="fa-solid fa-clock-rotate-left"></i>

                    </button>


                    <button
                        onclick="openStudentModal('${escapeHTML(student.id)}')"
                        title="এডিট"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#fef3c7;
                            color:#d97706;
                        "
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        onclick="deleteStudent('${escapeHTML(student.id)}')"
                        title="ডিলিট"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#ffe4e6;
                            color:#e11d48;
                        "
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });


    renderPagination(filtered.length);

}


/* Type badge */

function getStudentTypeBadge(student) {

    if (student.type === "Orphan") {

        return `
            <span style="
                display:inline-block;
                padding:4px 8px;
                border-radius:20px;
                background:#ede9fe;
                color:#7c3aed;
                font-size:8px;
                font-weight:800;
            ">
                এতিম — ফ্রি
            </span>
        `;

    }


    if (student.type === "Poor") {

        return `
            <span style="
                display:inline-block;
                padding:4px 8px;
                border-radius:20px;
                background:#fef3c7;
                color:#b45309;
                font-size:8px;
                font-weight:800;
            ">
                গরিব — ফ্রি
            </span>
        `;

    }


    return `
        <span style="
            display:inline-block;
            padding:4px 8px;
            border-radius:20px;
            background:#d1fae5;
            color:#047857;
            font-size:8px;
            font-weight:800;
        ">
            সাধারণ
        </span>
    `;

}


/* Monthly text */

function getMonthlyText(student) {

    if (
        student.type === "Orphan" ||
        student.type === "Poor"
    ) {

        return "ফি প্রযোজ্য নয়";

    }

    return formatINR(
        Number(student.monthly || 0)
    );

}


/* Class name */

function formatClassName(className) {

    const value =
        String(className || "")
            .toUpperCase();

    const map = {

        "MAKTAB": "মক্তব",

        "HIFZ": "হিফজ",

        "ADNA ALIF": "আদনা আলিফ",

        "ADNA BA": "আদনা বা"

    };

    return map[value] || className || "N/A";

}


/* =========================================================
   14. PAGINATION
========================================================= */

function renderPagination(totalItems) {

    const container =
        document.getElementById(
            "studentPagination"
        );

    if (!container) return;


    const totalPages =
        Math.ceil(
            totalItems /
            STUDENTS_PER_PAGE
        );


    container.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");

        button.innerText =
            toBanglaNumber(page);

        if (page === currentStudentPage) {
            button.classList.add("active");
        }

        button.onclick = () => {

            currentStudentPage = page;

            renderStudents();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

        container.appendChild(button);

    }

}


/* =========================================================
   15. FEE MODAL
========================================================= */

function openFeeModal(studentId) {

    const student =
        students.find(
            item => item.id === studentId
        );

    if (!student) {

        showToast(
            "ছাত্র পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    setInput(
        "feeStudentId",
        student.id
    );


    setText(
        "feeStudentName",
        `${student.name} — রোল #${student.roll}`
    );


    setText(
        "feeStudentInfo",
        `${formatClassName(student.class)} | মাসিক ফি: ${getMonthlyText(student)}`
    );


    const feeAmount =
        document.getElementById(
            "feeAmount"
        );


    if (feeAmount) {

        feeAmount.value =
            student.type === "Orphan" ||
            student.type === "Poor"
                ? 0
                : Number(student.monthly || 0);

    }


    const month =
        document.getElementById(
            "feeMonth"
        );

    if (month) {
        month.value =
            getCurrentMonth();
    }


    const modal =
        document.getElementById(
            "feeModal"
        );

    if (modal) {
        modal.classList.remove("hidden");
    }

}


function closeFeeModal() {

    const modal =
        document.getElementById(
            "feeModal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

}


/* Compatibility */

function toggleFeeModal() {

    const modal =
        document.getElementById(
            "feeModal"
        );

    if (!modal) return;

    if (modal.classList.contains("hidden")) {

        modal.classList.remove("hidden");

    } else {

        modal.classList.add("hidden");

    }

}


/* =========================================================
   16. SAVE FEE
========================================================= */

async function saveFee(event) {

    event.preventDefault();


    const studentId =
        document.getElementById(
            "feeStudentId"
        ).value;


    const student =
        students.find(
            item => item.id === studentId
        );


    if (!student) {

        showToast(
            "ছাত্র পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    const amount =
        Number(
            document.getElementById(
                "feeAmount"
            ).value
        );


    const month =
        document.getElementById(
            "feeMonth"
        ).value;


    if (!Number.isFinite(amount) || amount < 0) {

        showToast(
            "সঠিক টাকার পরিমাণ দিন।",
            "error"
        );

        return;

    }


    /* Duplicate month protection */

    const duplicate =
        collections.find(record =>

            record.studentId === studentId &&
            record.month === month

        );


    if (duplicate) {

        const confirmDuplicate =
            confirm(
                `${student.name}-এর ${month} মাসের ফি ইতিমধ্যে জমা আছে।\n\nরসিদ: ${duplicate.recNo}\nপরিমাণ: ${formatINR(duplicate.amount)}\n\nআপনি কি আবার জমা নিতে চান?`
            );


        if (!confirmDuplicate) {
            return;
        }

    }


    const record = {

        recNo:
            generateReceiptNumber(),

        studentId:
            student.id,

        name:
            student.name,

        roll:
            student.roll,

        class:
            student.class,

        amount:
            amount,

        month:
            month,

        date:
            getTodayDate(),

        createdAt:
            firebase.firestore.FieldValue.serverTimestamp()

    };


    try {

        showLoading(
            "ফি জমার তথ্য সেভ হচ্ছে..."
        );


        const docRef =
            await db
                .collection("collections")
                .add(record);


        collections.push({
            id: docRef.id,
            ...record
        });


        closeFeeModal();


        const form =
            document.getElementById(
                "payFeeForm"
            );

        if (form) {
            form.reset();
        }


        renderAll();

        showReceipt(record);

        showToast(
            "ফি সফলভাবে জমা হয়েছে।"
        );

    } catch (error) {

        console.error(error);

        showToast(
            "ফি সেভ করতে সমস্যা হয়েছে।",
            "error"
        );

    } finally {

        hideLoading();

    }

}


/* Receipt number */

function generateReceiptNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `REC-${year}${month}${day}-${random}`;

/* =========================================================
   17. COLLECTION RENDER
========================================================= */

function renderCollections() {

    const body =
        document.getElementById(
            "collectionTableBody"
        );

    if (!body) return;


    const search =
        (
            document.getElementById(
                "collectionSearch"
            )?.value || ""
        )
        .trim()
        .toLowerCase();


    let filtered =
        collections.filter(record => {

            const text = [

                record.recNo,

                record.name,

                record.roll,

                record.month

            ]
                .join(" ")
                .toLowerCase();


            return (
                !search ||
                text.includes(search)
            );

        });


    filtered.sort((a, b) => {

        const aDate =
            a.createdAt &&
            a.createdAt.toMillis
                ? a.createdAt.toMillis()
                : 0;

        const bDate =
            b.createdAt &&
            b.createdAt.toMillis
                ? b.createdAt.toMillis()
                : 0;

        return bDate - aDate;

    });


    body.innerHTML = "";


    if (filtered.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="no-history">

                        <i
                            class="fa-solid fa-receipt"
                            style="
                                font-size:28px;
                                margin-bottom:10px;
                            "
                        ></i>

                        <br>

                        কোনো ফি রেকর্ড পাওয়া যায়নি।

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(record => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong style="
                    color:#047857;
                ">

                    ${escapeHTML(record.recNo)}

                </strong>

            </td>


            <td>

                <strong>
                    ${escapeHTML(record.name)}
                </strong>

            </td>


            <td>
                #${escapeHTML(record.roll)}
            </td>


            <td>
                ${escapeHTML(record.month)}
            </td>


            <td>

                <strong style="
                    color:#047857;
                ">

                    ${formatINR(record.amount)}

                </strong>

            </td>


            <td>
                ${escapeHTML(record.date)}
            </td>


            <td>

                <div style="
                    display:flex;
                    gap:5px;
                ">


                    <button
                        onclick="showReceiptByNumber('${escapeHTML(record.recNo)}')"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#dbeafe;
                            color:#2563eb;
                        "
                        title="রসিদ"
                    >

                        <i class="fa-solid fa-receipt"></i>

                    </button>


                    <button
                        onclick="deleteCollection('${escapeHTML(record.id || "")}')"
                        style="
                            width:32px;
                            height:32px;
                            border:none;
                            border-radius:7px;
                            background:#ffe4e6;
                            color:#e11d48;
                        "
                        title="ডিলিট"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        `;


        body.appendChild(row);

    });

}
}

/* =========================================================
   18. RECENT COLLECTION
========================================================= */

function renderRecentCollections() {

    const body =
        document.getElementById(
            "recentCollectionBody"
        );

    if (!body) return;


    const recent =
        [...collections]
            .sort((a, b) => {

                const aTime =
                    a.createdAt &&
                    a.createdAt.toMillis
                        ? a.createdAt.toMillis()
                        : 0;

                const bTime =
                    b.createdAt &&
                    b.createdAt.toMillis
                        ? b.createdAt.toMillis()
                        : 0;

                return bTime - aTime;

            })
            .slice(0, 8);


    body.innerHTML = "";


    if (recent.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="no-history">

                        এখনো কোনো ফি জমা হয়নি।

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    recent.forEach(record => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong style="
                    color:#047857;
                ">

                    ${escapeHTML(record.recNo)}

                </strong>

            </td>


            <td>
                ${escapeHTML(record.name)}
            </td>


            <td>
                ${escapeHTML(record.month)}
            </td>


            <td>

                <strong style="
                    color:#047857;
                ">

                    ${formatINR(record.amount)}

                </strong>

            </td>


            <td>
                ${escapeHTML(record.date)}
            </td>

        `;


        body.appendChild(row);

    });

}

  /* =========================================================
   18. RECENT COLLECTION
========================================================= */

function renderRecentCollections() {

    const body =
        document.getElementById(
            "recentCollectionBody"
        );

    if (!body) return;


    const recent =
        [...collections]
            .sort((a, b) => {

                const aTime =
                    a.createdAt &&
                    a.createdAt.toMillis
                        ? a.createdAt.toMillis()
                        : 0;

                const bTime =
                    b.createdAt &&
                    b.createdAt.toMillis
                        ? b.createdAt.toMillis()
                        : 0;

                return bTime - aTime;

            })
            .slice(0, 8);


    body.innerHTML = "";


    if (recent.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="no-history">

                        এখনো কোনো ফি জমা হয়নি।

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    recent.forEach(record => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong style="
                    color:#047857;
                ">

                    ${escapeHTML(record.recNo)}

                </strong>

            </td>


            <td>
                ${escapeHTML(record.name)}
            </td>


            <td>
                ${escapeHTML(record.month)}
            </td>


            <td>

                <strong style="
                    color:#047857;
                ">

                    ${formatINR(record.amount)}

                </strong>

            </td>


            <td>
                ${escapeHTML(record.date)}
            </td>

        `;


        body.appendChild(row);

    });

}
/* =========================================================
   19. RECEIPT
========================================================= */

function showReceipt(record) {

    if (!record) return;


    currentReceiptNo =
        record.recNo;


    setText(
        "recNo",
        record.recNo
    );

    setText(
        "recName",
        record.name
    );

    setText(
        "recRoll",
        "#" + record.roll
    );

    setText(
        "recClass",
        formatClassName(record.class)
    );

    setText(
        "recMonth",
        record.month
    );

    setText(
        "recAmount",
        formatINR(record.amount)
    );

    setText(
        "recDate",
        record.date
    );


    const modal =
        document.getElementById(
            "receiptModal"
        );

    if (modal) {
        modal.classList.remove("hidden");
    }

}


function showReceiptByNumber(recNo) {

    const record =
        collections.find(
            item => item.recNo === recNo
        );

    if (record) {
        showReceipt(record);
    }

}


function closeReceiptModal() {

    const modal =
        document.getElementById(
            "receiptModal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

}


/* Compatibility */

function toggleReceiptModal() {

    const modal =
        document.getElementById(
            "receiptModal"
        );

    if (!modal) return;

    if (modal.classList.contains("hidden")) {

        modal.classList.remove("hidden");

    } else {

        modal.classList.add("hidden");

    }

}


/* Print */

function printReceipt() {

    window.print();

}


/* WhatsApp */

function sendWhatsAppReceipt(
    recNo = currentReceiptNo
) {

    const record =
        collections.find(
            item => item.recNo === recNo
        );


    if (!record) {

        showToast(
            "রসিদ পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    const student =
        students.find(
            item =>
                item.id === record.studentId
        );


    if (
        !student ||
        !student.phone ||
        student.phone === "N/A"
    ) {

        showToast(
            "অভিভাবকের সঠিক মোবাইল নম্বর নেই।",
            "error"
        );

        return;

    }


    let phone =
        String(student.phone)
            .replace(/\D/g, "");


    if (phone.length === 10) {
        phone = "91" + phone;
    }


    const message =

`আসসালামু আলাইকুম,

*ডিঙ্গেল হাফিজিয়া মাদ্রাসা*
*ফি প্রাপ্তি রসিদ*

━━━━━━━━━━━━━━

ছাত্রের নাম: ${record.name}
রোল: ${record.roll}
শ্রেণী: ${formatClassName(record.class)}

মাস: ${record.month}

জমার পরিমাণ: ${formatINR(record.amount)}

রসিদ নং: ${record.recNo}

তারিখ: ${record.date}

━━━━━━━━━━━━━━

টাকা জমা দেওয়ার জন্য ধন্যবাদ।

মাদ্রাসা কর্তৃপক্ষ`;


    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}


/* =========================================================
   20. STUDENT HISTORY
========================================================= */

function showStudentHistory(studentId) {

    const student =
        students.find(
            item => item.id === studentId
        );


    if (!student) return;


    const records =
        collections
            .filter(
                item =>
                    item.studentId === studentId
            )
            .sort((a, b) => {

                const aTime =
                    a.createdAt &&
                    a.createdAt.toMillis
                        ? a.createdAt.toMillis()
                        : 0;

                const bTime =
                    b.createdAt &&
                    b.createdAt.toMillis
                        ? b.createdAt.toMillis()
                        : 0;

                return bTime - aTime;

            });


    setText(
        "historyStudentName",
        `${student.name} — রোল #${student.roll}`
    );


    const content =
        document.getElementById(
            "historyContent"
        );


    if (!content) return;


    if (records.length === 0) {

        content.innerHTML = `

            <div class="no-history">

                <i
                    class="fa-solid fa-receipt"
                    style="
                        font-size:30px;
                        margin-bottom:10px;
                    "
                ></i>

                <br>

                এই ছাত্রের কোনো ফি জমার ইতিহাস নেই।

            </div>

        `;

    } else {

        let html = "";

        records.forEach(record => {

            html += `

                <div class="history-item">

                    <div class="history-item-left">

                        <strong>
                            ${escapeHTML(record.month)}
                        </strong>

                        <span>
                            রসিদ:
                            ${escapeHTML(record.recNo)}
                        </span>

                        <span>
                            ${escapeHTML(record.date)}
                        </span>

                    </div>


                    <div class="history-item-right">

                        <strong>
                            ${formatINR(record.amount)}
                        </strong>

                        <small>
                            ফি জমা
                        </small>

                    </div>

                </div>

            `;

        });


        content.innerHTML = html;

    }


    const modal =
        document.getElementById(
            "historyModal"
        );

    if (modal) {
        modal.classList.remove("hidden");
    }

}


function closeHistoryModal() {

    const modal =
        document.getElementById(
            "historyModal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

}


/* =========================================================
   21. DELETE STUDENT
========================================================= */

async function deleteStudent(studentId) {

    const student =
        students.find(
            item => item.id === studentId
        );


    if (!student) return;


    const confirmed =
        confirm(
            `আপনি কি নিশ্চিত?\n\n${student.name}-কে ছাত্র তালিকা থেকে মুছে ফেলা হবে।`
        );


    if (!confirmed) return;


    try {

        showLoading(
            "ছাত্র মুছে ফেলা হচ্ছে..."
        );


        await db
            .collection("students")
            .doc(studentId)
            .delete();


        students =
            students.filter(
                item => item.id !== studentId
            );


        renderAll();


        showToast(
            "ছাত্র সফলভাবে মুছে ফেলা হয়েছে।"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "ছাত্র ডিলিট করতে সমস্যা হয়েছে।",
            "error"
        );

    } finally {

        hideLoading();

    }

}
/* =========================================================
   22. DELETE COLLECTION
========================================================= */

async function deleteCollection(id) {

    if (!id) {

        showToast(
            "এই রেকর্ডটি ডিলিট করা যাচ্ছে না।",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            "আপনি কি নিশ্চিত যে এই ফি রেকর্ডটি মুছে ফেলতে চান?"
        );


    if (!confirmed) return;


    try {

        showLoading(
            "ফি রেকর্ড মুছে ফেলা হচ্ছে..."
        );


        await db
            .collection("collections")
            .doc(id)
            .delete();


        collections =
            collections.filter(
                item => item.id !== id
            );


        renderAll();


        showToast(
            "ফি রেকর্ড মুছে ফেলা হয়েছে।"
        );


    } catch (error) {

        console.error(error);

        showToast(
            "রেকর্ড ডিলিট করতে সমস্যা হয়েছে।",
            "error"
        );

    } finally {

        hideLoading();

    }

}


/* =========================================================
   23. REPORTS
========================================================= */

function updateReports() {

    const total =
        students.length;


    const totalCollection =
        collections.reduce(
            (sum, item) =>
                sum + Number(item.amount || 0),
            0
        );


    const orphans =
        students.filter(
            item => item.type === "Orphan"
        ).length;


    const poor =
        students.filter(
            item => item.type === "Poor"
        ).length;


    setText(
        "reportStudents",
        toBanglaNumber(total)
    );


    setText(
        "reportCollection",
        formatINR(totalCollection)
    );


    setText(
        "reportOrphans",
        toBanglaNumber(orphans)
    );


    setText(
        "reportPoor",
        toBanglaNumber(poor)
    );


    renderClassReport();

}


function renderClassReport() {

    const container =
        document.getElementById(
            "classReportBody"
        );

    if (!container) return;


    const counts = {};


    students.forEach(student => {

        const className =
            formatClassName(
                student.class
            );


        counts[className] =
            (counts[className] || 0) + 1;

    });


    container.innerHTML = "";


    const classes =
        Object.keys(counts);


    if (classes.length === 0) {

        container.innerHTML = `

            <div class="no-history">
                কোনো তথ্য নেই।
            </div>

        `;

        return;

    }


    classes.forEach(className => {

        container.innerHTML += `

            <div class="class-report-row">

                <span>
                    ${escapeHTML(className)}
                </span>

                <strong>
                    ${toBanglaNumber(
                        counts[className]
                    )}
                    জন
                </strong>

            </div>

        `;

    });

}


/* =========================================================
   24. CSV EXPORT
========================================================= */

function exportStudentsToCSV() {

    if (students.length === 0) {

        showToast(
            "ডাউনলোড করার মতো ছাত্র তথ্য নেই।",
            "error"
        );

        return;

    }


    let csv =
        "\uFEFFরোল,নাম,শ্রেণী,অভিভাবক,মোবাইল,ঠিকানা,ধরন,মাসিক ফি\n";


    students.forEach(student => {

        csv += [

            csvSafe(student.roll),

            csvSafe(student.name),

            csvSafe(
                formatClassName(
                    student.class
                )
            ),

            csvSafe(student.guardian),

            csvSafe(student.phone),

            csvSafe(student.address),

            csvSafe(student.type),

            csvSafe(
                student.type === "Orphan" ||
                student.type === "Poor"
                    ? "FREE"
                    : student.monthly
            )

        ].join(",") + "\n";

    });


    downloadCSV(
        csv,
        `Dingel_Students_${new Date()
            .toISOString()
            .slice(0,10)}.csv`
    );


    showToast(
        "ছাত্র তালিকা CSV হিসেবে ডাউনলোড হয়েছে।"
    );

}


/* CSV safe */

function csvSafe(value) {

    return `"${String(
        value === undefined ||
        value === null
            ? ""
            : value
    ).replace(/"/g, '""')}"`;

}


/* Download CSV */

function downloadCSV(content, filename) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/* =========================================================
   25. SEARCH / FILTER EVENTS
========================================================= */

function setupSearchAndFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const classFilter =
        document.getElementById(
            "classFilter"
        );


    const typeFilter =
        document.getElementById(
            "typeFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentStudentPage = 1;

                renderStudents();

            }
        );

    }


    if (classFilter) {

        classFilter.addEventListener(
            "change",
            () => {

                currentStudentPage = 1;

                renderStudents();

            }
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            () => {

                currentStudentPage = 1;

                renderStudents();

            }
        );

    }


    const collectionSearch =
        document.getElementById(
            "collectionSearch"
        );


    if (collectionSearch) {

        collectionSearch.addEventListener(
            "input",
            renderCollections
        );

    }

}


/* =========================================================
   26. FORM EVENTS
========================================================= */

function setupForms() {

    const studentForm =
        document.getElementById(
            "addStudentForm"
        );


    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            saveStudent
        );

    }


    const feeForm =
        document.getElementById(
            "payFeeForm"
        );


    if (feeForm) {

        feeForm.addEventListener(
            "submit",
            saveFee
        );

    }

}


/* =========================================================
   27. CURRENT DATE
========================================================= */

function setCurrentDate() {

    const element =
        document.getElementById(
            "currentDate"
        );


    if (element) {

        element.innerText =
            getTodayDate();

    }

}


/* =========================================================
   28. MODAL OUTSIDE CLICK
========================================================= */

function setupModalClicks() {

    const modals =
        document.querySelectorAll(
            ".modal-overlay"
        );


    modals.forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.add(
                        "hidden"
                    );

                }

            }
        );

    });

}


/* =========================================================
   29. KEYBOARD ESC
========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            document
                .querySelectorAll(
                    ".modal-overlay"
                )
                .forEach(modal => {

                    modal.classList.add(
                        "hidden"
                    );

                });

        }
    );

}


/* =========================================================
   30. INITIALIZE APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setCurrentDate();

        setupForms();

        setupSearchAndFilters();

        setupModalClicks();

        setupKeyboard();


        /* Login page initially */

        const loggedIn =
            localStorage.getItem(
                "dingelLoggedIn"
            );


        if (loggedIn === "true") {

            const login =
                document.getElementById(
                    "loginScreen"
                );

            const dashboard =
                document.getElementById(
                    "dashboardScreen"
                );


            if (login) {
                login.classList.add("hidden");
            }


            if (dashboard) {
                dashboard.classList.remove(
                    "hidden"
                );
            }


            await loadApplicationData();

        }

    }
);
