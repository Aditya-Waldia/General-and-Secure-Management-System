const key = "my-secret-key-123";
let logs = [];

function logAction(msg) {
  const time = new Date().toLocaleString();
  const logMsg = `[${time}] ${msg}`;
  logs.push(logMsg);
  document.getElementById('logBox').textContent = logs.join('\n');
}

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

function decryptData(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

function initDefaultCreds() {
  if (!localStorage.getItem('creds')) {
    const credsObj = {
      admin: encryptData({ username: 'admin', password: 'Admin@123' }),
      user: encryptData({ username: 'user', password: 'User@123' })
    };
    localStorage.setItem('creds', JSON.stringify(credsObj));
    logAction('Default credentials initialized');
  }
}
initDefaultCreds();

function checkStrength() {
  const pwd = document.getElementById('password').value;
  const strength = document.getElementById('strength');
  if (pwd.length < 4) strength.textContent = "Strength: Weak";
  else if (pwd.length < 8) strength.textContent = "Strength: Medium";
  else strength.textContent = "Strength: Strong";
}

function login() {
  const role = document.getElementById('roleSelect').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return alert("Enter username and password!");

  const creds = JSON.parse(localStorage.getItem('creds') || '{}');
  const enc = creds[role];
  if (!enc) return alert("No credentials configured for this role.");

  const stored = decryptData(enc);
  if (stored.username === username && stored.password === password) {
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById(`${role}Dashboard`).classList.remove('hidden');
    logAction(`${role.charAt(0).toUpperCase() + role.slice(1)} '${username}' logged in`);
  } else {
    alert("Invalid credentials!");
    logAction(`Failed login attempt for '${username}' as ${role}`);
  }
}

function logout() {
  document.querySelectorAll('.dashboard').forEach(d => d.classList.add('hidden'));
  document.getElementById('loginBox').classList.remove('hidden');
  logAction("User logged out");
}

document.getElementById('employeeForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const emp = {
    name: empName.value.trim(),
    email: empEmail.value.trim(),
    salary: empSalary.value,
    age: empAge.value,
    allowance: empAllowance.value,
    years: empYears.value,
    experience: empExperience.value
  };

  if (!emp.name || !emp.email) return alert("Name and Email are required!");

  let data = JSON.parse(localStorage.getItem('employees') || '[]');
  data.push(encryptData(emp));
  localStorage.setItem('employees', JSON.stringify(data));
  logAction(`Admin added record for ${emp.name}`);
  alert("Record added successfully (Encrypted)");
  this.reset();
});

function showRecords() {
  const data = JSON.parse(localStorage.getItem('employees') || '[]');
  if (data.length === 0) {
    document.getElementById('records').innerHTML = "<p>No records found.</p>";
    return;
  }

  let output = "<h3>All Employee Records (Decrypted)</h3>";
  data.forEach((encrypted, i) => {
    try {
      const emp = decryptData(encrypted);
      output += `
      <div class="record">
        <button onclick="deleteRecord(${i})">Delete</button>
        <p><strong>${i + 1}. ${emp.name}</strong></p>
        <p>Email: ${emp.email}</p>
        <p>Salary: ₹${emp.salary}</p>
        <p>Age: ${emp.age}</p>
        <p>Allowance: ₹${emp.allowance}</p>
        <p>Years of Service: ${emp.years}</p>
        <p>Experience: ${emp.experience} years</p>
      </div>`;
    } catch (e) {
      console.error("Decryption failed", e);
    }
  });
  document.getElementById('records').innerHTML = output;
  logAction("Admin viewed all records");
}

function deleteRecord(index) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  let data = JSON.parse(localStorage.getItem('employees') || '[]');
  const emp = decryptData(data[index]);
  data.splice(index, 1);
  localStorage.setItem('employees', JSON.stringify(data));
  logAction(`Deleted record for ${emp.name}`);
  showRecords();
}

function fetchUser() {
  const username = document.getElementById('searchUser').value.trim().toLowerCase();
  const box = document.getElementById('userDetails');
  const data = JSON.parse(localStorage.getItem('employees') || '[]');
  if (!username) return box.innerHTML = `<p style="color:red;">Enter your username!</p>`;

  let found = null;
  data.forEach(encrypted => {
    try {
      const emp = decryptData(encrypted);
      if (emp.name.toLowerCase() === username) found = emp;
    } catch {}
  });

  if (found) {
    box.innerHTML = `
      <div class="record">
        <p><strong>Name:</strong> ${found.name}</p>
        <p><strong>Email:</strong> ${found.email}</p>
        <p><strong>Salary:</strong> ₹${found.salary}</p>
        <p><strong>Age:</strong> ${found.age}</p>
        <p><strong>Allowance:</strong> ₹${found.allowance}</p>
        <p><strong>Years of Service:</strong> ${found.years}</p>
        <p><strong>Experience:</strong> ${found.experience} years</p>
      </div>`;
    logAction(`User '${found.name}' viewed their details`);
  } else {
    box.innerHTML = `<p style="color:red;">No record found for '${username}'</p>`;
    logAction(`User '${username}' not found`);
  }
}
