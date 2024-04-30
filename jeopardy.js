const APIURL = "https://opentdb.com/api.php?amount=20";
let categories = [];
async function getCategoryIds() {
  let res = await axios.get(`${APIURL}`);
  console.log(res.data.results);
  //   let topicID = res.data.map((topic) => topic.id);
  //   let keys = Object.keys(topicID);
  //   return topicID;
  return res.data.results;
}
async function getCategory() {
  const response = await axios.get(`${APIURL}`);
  const categoryData = {
    title: response.data.category,
    clues: response.data.question.map((clue) => ({
      question: clue.question,
      answer: clue.correct_answer,
      showing: null,
   
    })),
    
  };
  console.log(categoryData);
  return categoryData;
}
async function fillTable() {
  const tableHead = document.querySelector("thead tr");
  const tableBody = document.querySelector("tbody");
  tableHead.innerHTML = "";
  let categoryIds = [];
  const response = await axios.get(`${APIURL}`);
  categoryIds = await getCategoryIds();
  
  console.log(categoryIds);
  const selectedCategories = [];
  for (let i = 0; i < 6; i++) {
    // let catId;
    // do {
    //   catId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    // } while (selectedCategories.includes(catId));
    // selectedCategories.push(catId);
    // const category = await getCategory(catId);
    // if (category) {
      const th = document.createElement("th");
      th.classList.add("col-2");
      th.textContent = response.data.results[i].category;
      tableHead.appendChild(th);
      // categories.push(category);
    // }
  }
  for (let i = 0; i < 5; i++) {
    const tr = document.createElement("tr");
    tr.classList.add("col-lg-2");
    for (let j = 0; j < 6; j++) {
      const td = document.createElement("td");
      td.classList.add("col-4", "col-lg-2");
      td.textContent = "?";
      td.addEventListener("click", handleClick);
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }
}






function handleClick(evt) {
  const cell = evt.target;
  const rowIndex = this.parentNode.rowIndex - 2;
  const columnIndex = this.cellIndex;
  const category = categories[columnIndex];
  console.log(category);
  const clue =  category.clues[rowIndex];
  if (!clue.showing) {
    this.textContent = clue.question;
    clue.showing = "question";
    cell.classList.add("clicked");
  } else if (clue.showing === "question") {
    cell.innerHTML = clue.answer.replace("\\", "");
    clue.showing = "answer";
    cell.classList.add("answer");
  } else {
    return;
  }
}






function showLoadingView() {
  const spinner = document.querySelector("#spin-container");
  spinner.style.display = "block";
}

function hideLoadingView() {
  const spinner = document.querySelector("#spin-container");
  spinner.style.display = "none";
}
async function setupAndStart() {
  const startButton = document.getElementById("start");
  if (startButton.textContent === "Start!") {
    showLoadingView();
    try {
      await fillTable();
      hideLoadingView();
      startButton.textContent = "New Board";
    } catch (error) {
      console.error("Error setting up and starting the game:", error);
      hideLoadingView();
    }
  } else if (startButton.textContent === "New Board") {
    location.reload();
  }
}
document.getElementById("start").addEventListener("click", setupAndStart);
