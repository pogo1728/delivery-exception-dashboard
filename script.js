
var exceptions = [];
var form = document.querySelector("#exceptionForm");
var tableBody = document.querySelector("#exceptionsTableBody");

var deliveryIdInput = document.querySelector("#deliveryId");
var customerNameInput = document.querySelector("#customerName");
var issueTypeSelect = document.querySelector("#issueType");

var filterIssueType = document.querySelector("#filterIssueType");
var filterStatus = document.querySelector("#filterStatus");

var openCountEl = document.querySelector("#openCount");
var resolvedCountEl = document.querySelector("#resolvedCount");
var emptyState = document.querySelector("#emptyState");

function getPriorityValue() {
  var low = document.querySelector("input[value='Low']");
  var medium = document.querySelector("input[value='Medium']");
  var high = document.querySelector("input[value='High']");

  if (low.checked) return "Low";
  if (medium.checked) return "Medium";
  if (high.checked) return "High";
  return "";
}

function updateCounts() {
  var open = 0;
  var resolved = 0;

  for (var i = 0; i < exceptions.length; i++) {
    if (exceptions[i].status === "Open") {
      open++;
    } else {
      resolved++;
    }
  }

  openCountEl.textContent = open;
  resolvedCountEl.textContent = resolved;
}

function passesFilter(item) {
  if (filterIssueType.value !== "All" && item.issueType !== filterIssueType.value) {
    return false;
  }

  if (filterStatus.value !== "All" && item.status !== filterStatus.value) {
    return false;
  }

  return true;
}


function renderTable() {
  tableBody.textContent = "";

  var visible = 0;

  for (var i = 0; i < exceptions.length; i++) {
    var item = exceptions[i];

    var row = document.createElement("tr");

    if (!passesFilter(item)) {
      row.style.display = "none";
    } else {
      visible++;
    }

    if (item.status === "Resolved") {
      row.classList.add("row-resolved");
    }

    if (item.priority === "High") {
      row.classList.add("priority-high");
    }

    var tdId = document.createElement("td");
    tdId.textContent = item.deliveryId;

    var tdName = document.createElement("td");
    tdName.textContent = item.customerName;

    var tdIssue = document.createElement("td");
    tdIssue.textContent = item.issueType;

    var tdPriority = document.createElement("td");
    tdPriority.textContent = item.priority;

    var tdStatus = document.createElement("td");
    tdStatus.textContent = item.status;

    var tdActions = document.createElement("td");

    var resolveBtn = document.createElement("button");
    resolveBtn.textContent = "Resolve";
    resolveBtn.classList.add("btn");
    resolveBtn.classList.add("success");

    if (item.status === "Resolved") {
      resolveBtn.disabled = true;
    }

    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn");
    deleteBtn.classList.add("danger");

    tdActions.appendChild(resolveBtn);
    tdActions.appendChild(deleteBtn);

    row.appendChild(tdId);
    row.appendChild(tdName);
    row.appendChild(tdIssue);
    row.appendChild(tdPriority);
    row.appendChild(tdStatus);
    row.appendChild(tdActions);

    tableBody.appendChild(row);
  }

  updateCounts();

  if (exceptions.length === 0) {
    emptyState.style.display = "block";
    emptyState.textContent = "No exceptions reported yet.";
  } else if (visible === 0) {
    emptyState.style.display = "block";
    emptyState.textContent = "No results match current filters.";
  } else {
    emptyState.style.display = "none";
  }
}


form.addEventListener("submit", function (e) {
  e.preventDefault();

  var deliveryId = deliveryIdInput.value.trim();
  var customerName = customerNameInput.value.trim();
  var issueType = issueTypeSelect.value;
  var priority = getPriorityValue();

  if (!deliveryId || !customerName || !issueType || !priority) {
    alert("Please fill all required fields.");
    return;
  }

  exceptions.push({
    deliveryId: deliveryId,
    customerName: customerName,
    issueType: issueType,
    priority: priority,
    status: "Open"
  });

  renderTable();
  form.reset();
});


filterIssueType.addEventListener("change", renderTable);
filterStatus.addEventListener("change", renderTable);

tableBody.addEventListener("click", function (e) {
  var target = e.target;

  if (target.tagName !== "BUTTON") return;

  var row = target.parentNode.parentNode;
  var index = row.rowIndex - 1;

  if (target.textContent === "Resolve") {
    exceptions[index].status = "Resolved";
  }

  if (target.textContent === "Delete") {
    if (confirm("Are you sure you want to delete this issue?")) {
      exceptions.splice(index, 1);
    }
  }

  renderTable();
});

renderTable();
