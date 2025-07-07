document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#completed-table tbody");
  const exportBtn = document.getElementById("export-csv");
  const modal = document.getElementById("transaction-modal");
  const modalDetails = document.getElementById("modal-details");
  const closeModalBtn = document.querySelector(".close-modal");

  function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  }

  function setTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  function renderTable() {
    const transactions = getTransactions();
    tableBody.innerHTML = "";
    transactions
      .filter((t) => t.completed)
      .forEach((t, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${t.controlNumber}</td>
        <td>${t.date} ${t.time}</td>
        <td>${t.brand}</td>
        <td>${t.model}</td>
        <td><button class="btn btn-success" data-idx="${idx}" data-action="toggle-paid">${
          t.paid ? "Set Not Paid" : "Set Paid"
        }</button></td>
        <td><button class="btn btn-primary" data-idx="${idx}" data-action="claim">${
          t.claimed ? "Claimed" : "Not Claimed"
        }</button></td>
      `;
        tr.setAttribute("data-row-idx", idx);
        tableBody.appendChild(tr);
      });
  }

  tableBody.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      const idx = e.target.getAttribute("data-idx");
      const action = e.target.getAttribute("data-action");
      const transactions = getTransactions();
      // Find the nth completed transaction
      let count = -1;
      let tIndex = -1;
      let t = null;
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].completed) count++;
        if (count == idx) {
          tIndex = i;
          t = transactions[i];
          break;
        }
      }
      if (action === "claim") {
        if (tIndex !== -1) {
          if (!transactions[tIndex].paid) {
            transactions[tIndex].paid = true;
          }
          transactions[tIndex].claimed = !transactions[tIndex].claimed;
          setTransactions(transactions);
          renderTable();
        }
        return;
      } else if (action === "toggle-paid") {
        if (tIndex !== -1) {
          transactions[tIndex].paid = !transactions[tIndex].paid;
          setTransactions(transactions);
          renderTable();
        }
        return;
      }
      return;
    }
    // Row click logic (not on button)
    let tr = e.target.closest("tr");
    if (!tr) return;
    const idx = tr.getAttribute("data-row-idx");
    const transactions = getTransactions();
    // Find the nth completed transaction
    let count = -1;
    let t = null;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].completed) count++;
      if (count == idx) {
        t = transactions[i];
        break;
      }
    }
    if (!t) return;
    showModal(t);
  });

  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
  window.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });

  exportBtn.addEventListener("click", function () {
    const transactions = getTransactions();
    let csv =
      "Control No,Date,Time,Name,Contact,Address,Brand,Model,Color,Parts,Total Price,Paid,Completed,Claimed\n";
    transactions.forEach((t) => {
      csv += `"${t.controlNumber}","${t.date}","${t.time}","${t.name}","${
        t.contact
      }","${t.address}","${t.brand}","${t.model}","${t.color}","${t.parts}","${
        t.totalPrice
      }","${t.paid ? "Paid" : "Not Paid"}","${t.completed ? "Yes" : "No"}","${
        t.claimed ? "Yes" : "No"
      }"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  function showModal(transaction) {
    const modal = document.getElementById("transaction-modal");
    const modalDetails = document.getElementById("modal-details");
    modalDetails.innerHTML = `
      <div class="modal-details-grid">
        <div class="modal-details-label"><i class="fa fa-hashtag"></i> Control No</div>
        <div class="modal-details-value">${
          transaction.controlNumber ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-calendar"></i> Date/Time</div>
        <div class="modal-details-value">${
          (transaction.date ?? "undefined") + " " + (transaction.time ?? "")
        }</div>
        <div class="modal-details-label"><i class="fa fa-user"></i> Name</div>
        <div class="modal-details-value">${
          transaction.customerName ?? transaction.name ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-phone"></i> Contact</div>
        <div class="modal-details-value">${
          transaction.customerContact ?? transaction.contact ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-map-marker-alt"></i> Address</div>
        <div class="modal-details-value">${
          transaction.customerAddress ?? transaction.address ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-tag"></i> Brand</div>
        <div class="modal-details-value">${
          transaction.itemBrand ?? transaction.brand ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-cube"></i> Model</div>
        <div class="modal-details-value">${
          transaction.itemModel ?? transaction.model ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-palette"></i> Color</div>
        <div class="modal-details-value">${
          transaction.itemColor ?? transaction.color ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-tools"></i> Parts</div>
        <div class="modal-details-value">${
          transaction.parts ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-money-bill"></i> Price</div>
        <div class="modal-details-value">${
          transaction.price ?? transaction.totalPrice ?? "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-check-circle"></i> Paid</div>
        <div class="modal-details-value">${
          typeof transaction.paid === "boolean"
            ? transaction.paid
              ? "Yes"
              : "No"
            : "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-box-open"></i> Claimed</div>
        <div class="modal-details-value">${
          typeof transaction.claimed === "boolean"
            ? transaction.claimed
              ? "Yes"
              : "No"
            : "undefined"
        }</div>
        <div class="modal-details-label"><i class="fa fa-clipboard-check"></i> Completed</div>
        <div class="modal-details-value">${
          typeof transaction.completed === "boolean"
            ? transaction.completed
              ? "Yes"
              : "No"
            : "undefined"
        }</div>
      </div>
    `;
    modal.style.display = "block";
  }

  renderTable();
});
