// DOM Elements
const addPartButton = document.getElementById("add-part");
const partNameInput = document.getElementById("part-name");
const partsList = document.getElementById("parts-list");
const preview = document.getElementById("receipt-preview");
const totalDisplay = document.getElementById("total-display");
const statusDisplay = document.getElementById("status-display");

// Control number generation
let controlNumberCounter = 1;

function generateControlNumber() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const counter = controlNumberCounter.toString().padStart(4, "0");

  const controlNumber = `RF${year}${month}${day}${counter}`;
  controlNumberCounter++;

  return controlNumber;
}

// Form validation
const requiredFields = [
  "cust-name",
  "cust-contact",
  "item-brand",
  "item-model",
  "total-price",
];

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + "-error");
  const value = field.value.trim();

  if (requiredFields.includes(fieldId) && !value) {
    field.classList.add("error");
    errorElement.style.display = "block";
    return false;
  } else {
    field.classList.remove("error");
    errorElement.style.display = "none";
    return true;
  }
}

function validateForm() {
  return requiredFields.every((fieldId) => validateField(fieldId));
}

// Helper function to center text
// function centerText(text, width = 32) {
//   const padding = Math.max(0, Math.floor((width - text.length) / 2));
//   return " ".repeat(padding) + text;
// }

// Update preview function
function updatePreview() {
  const name = document.getElementById("cust-name").value.trim() || "N/A";
  const contact = document.getElementById("cust-contact").value.trim() || "N/A";
  const address = document.getElementById("cust-address").value.trim() || "N/A";
  const brand = document.getElementById("item-brand").value.trim() || "N/A";
  const model = document.getElementById("item-model").value.trim() || "N/A";
  const color = document.getElementById("item-color").value.trim() || "N/A";
  const total = document.getElementById("total-price").value.trim() || "0";
  const status = document.getElementById("payment-status").value;
  const parts = Array.from(partsList.children)
    .map((li) => `- ${li.textContent.replace("×", "").trim()}`)
    .join("\n");

  const formattedTotal = parseFloat(total).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const controlNumber = generateControlNumber();

  preview.textContent = `${"=".repeat(
    32
  )}\nRF REPAIR SHOP\nContact: 02-82532334\n${"=".repeat(
    32
  )}\nControl No: ${controlNumber}\nDate: ${new Date().toLocaleDateString()}\nTime: ${new Date().toLocaleTimeString()}\n\nCUSTOMER INFORMATION:\n${"-".repeat(
    32
  )}\nName: ${name}\nContact: ${contact}\nAddress: ${address}\n\nITEM INFORMATION:\n${"-".repeat(
    32
  )}\nBrand: ${brand}\nModel: ${model}\nColor: ${color}\n\nPARTS TO BE REPLACED:\n${"-".repeat(
    32
  )}\n${parts || "None"}\n\n${"=".repeat(
    32
  )}\nTOTAL PRICE: ${formattedTotal}\nPAYMENT STATUS: ${status}\n${"=".repeat(
    32
  )}`;

  // Update total display
  totalDisplay.textContent = formattedTotal;

  // Update status display
  statusDisplay.className =
    status === "Paid"
      ? "status-badge status-paid"
      : "status-badge status-unpaid";
  statusDisplay.innerHTML =
    status === "Paid"
      ? '<i class="fas fa-check-circle"></i> Paid'
      : '<i class="fas fa-times-circle"></i> Not Paid';
}

// Add part functionality
addPartButton.addEventListener("click", () => {
  const name = partNameInput.value.trim();
  if (name) {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${name}</span>
            <button class="remove-part" onclick="removePart(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
    partsList.appendChild(li);
    partNameInput.value = "";
    updatePreview();

    // Add animation
    li.style.animation = "fadeIn 0.3s ease-in";
  }
});

// Remove part functionality
function removePart(button) {
  const li = button.parentElement;
  li.style.animation = "fadeOut 0.3s ease-out";
  setTimeout(() => {
    li.remove();
    updatePreview();
  }, 300);
}

// Enter key support for adding parts
partNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addPartButton.click();
  }
});

// Form validation and preview updates
document.querySelectorAll("input, select, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    validateField(el.id);
    updatePreview();
  });

  el.addEventListener("blur", () => {
    validateField(el.id);
  });
});

// Print functions
function printReceipt() {
  if (!validateForm()) {
    alert("Please fill in all required fields before printing.");
    return;
  }

  const status = document.getElementById("payment-status").value;
  if (status !== "Paid") {
    alert('Cannot print receipt: Payment status must be "Paid".');
    return;
  }

  const receiptControlNumber = generateControlNumber();
  saveTransactionToLocalStorage(receiptControlNumber);
  const receiptContent = generateReceiptContent(
    receiptControlNumber,
    "RECEIPT"
  );

  const w = window.open("", "", "width=220,height=600");
  w.document.write(`
        <html>
        <head>
            <style>
                @media print {
                  body, pre { width: 58mm; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.2; }
                }
                body { width: 58mm; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.2; }
                pre { width: 58mm; white-space: pre-wrap; word-break: break-all; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; }
            </style>
        </head>
        <body>
            <pre>${receiptContent}</pre>
        </body>
        </html>
    `);
  w.document.close();
  w.print();
  w.close();
}

function printStub() {
  if (!validateForm()) {
    alert("Please fill in all required fields before printing.");
    return;
  }

  const stubControlNumber = generateControlNumber();
  saveTransactionToLocalStorage(stubControlNumber);
  const stubContent = generateReceiptContent(stubControlNumber, "CLAIM STUB");

  const w = window.open("", "", "width=220,height=500");
  w.document.write(`
        <html>
        <head>
            <style>
                @media print {
                  body, pre { width: 58mm; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.2; }
                }
                body { width: 58mm; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.2; }
                pre { width: 58mm; white-space: pre-wrap; word-break: break-all; margin: 0; font-family: 'Courier New', monospace; font-size: 11px; }
            </style>
        </head>
        <body>
            <pre>${stubContent}</pre>
        </body>
        </html>
    `);
  w.document.close();
  w.print();
  w.close();
}

function saveTransactionToLocalStorage(controlNumber) {
  const name = document.getElementById("cust-name").value.trim() || "N/A";
  const contact = document.getElementById("cust-contact").value.trim() || "N/A";
  const address = document.getElementById("cust-address").value.trim() || "N/A";
  const brand = document.getElementById("item-brand").value.trim() || "N/A";
  const model = document.getElementById("item-model").value.trim() || "N/A";
  const color = document.getElementById("item-color").value.trim() || "N/A";
  const total = document.getElementById("total-price").value.trim() || "0";
  const status = document.getElementById("payment-status").value;
  const parts = Array.from(partsList.children)
    .map((li) => `- ${li.textContent.replace("×", "").trim()}`)
    .join(", ");
  const formattedTotal = parseFloat(total).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
  const paid = status === "Paid";
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const transaction = {
    controlNumber,
    date,
    time,
    name,
    contact,
    address,
    brand,
    model,
    color,
    parts,
    totalPrice: formattedTotal,
    paid,
    completed: false,
    claimed: false,
  };

  let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  // Only add if not already present (by control number)
  if (!transactions.some((t) => t.controlNumber === controlNumber)) {
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
}

function generateReceiptContent(controlNumber, documentType) {
  const name = document.getElementById("cust-name").value.trim() || "N/A";
  const contact = document.getElementById("cust-contact").value.trim() || "N/A";
  const address = document.getElementById("cust-address").value.trim() || "N/A";
  const brand = document.getElementById("item-brand").value.trim() || "N/A";
  const model = document.getElementById("item-model").value.trim() || "N/A";
  const color = document.getElementById("item-color").value.trim() || "N/A";
  const total = document.getElementById("total-price").value.trim() || "0";
  const status = document.getElementById("payment-status").value;
  const parts = Array.from(partsList.children)
    .map((li) => `- ${li.textContent.replace("×", "").trim()}`)
    .join("\n");

  const formattedTotal = parseFloat(total).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  if (documentType === "CLAIM STUB") {
    return `${"=".repeat(
      32
    )}\nRF REPAIR SHOP\nContact: 02-82532334\n${"=".repeat(
      32
    )}\nControl No: ${controlNumber}\nDate: ${new Date().toLocaleDateString()}\nTime: ${new Date().toLocaleTimeString()}\n\nCustomer: ${name}\n\nParts to be replaced:\n${
      parts || "None"
    }\n\nTotal Price: ${formattedTotal}\n${"=".repeat(32)}`;
  } else {
    return `${"=".repeat(
      32
    )}\nRF REPAIR SHOP\nContact: 02-82532334\n${"=".repeat(
      32
    )}\nControl No: ${controlNumber}\nDate: ${new Date().toLocaleDateString()}\nTime: ${new Date().toLocaleTimeString()}\nType: ${documentType}\n\nCUSTOMER INFORMATION:\n${"-".repeat(
      32
    )}\nName: ${name}\nContact: ${contact}\nAddress: ${address}\n\nITEM INFORMATION:\n${"-".repeat(
      32
    )}\nBrand: ${brand}\nModel: ${model}\nColor: ${color}\n\nPARTS TO BE REPLACED:\n${"-".repeat(
      32
    )}\n${parts || "None"}\n\n${"=".repeat(
      32
    )}\nTOTAL PRICE: ${formattedTotal}\nPAYMENT STATUS: ${status}\n${"=".repeat(
      32
    )}`;
  }
}

// Navigation functionality
document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-button")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Initialize preview
updatePreview();
