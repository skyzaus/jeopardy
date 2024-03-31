// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

//get api link
const APIURL = "https://rithm-jeopardy.herokuapp.com/api/";
//------https://rithm-jeopardy.herokuapp.com/api/categories/------------

// function getRandomNumbers() {
//   let numbers = [0, 1, 2, 3, 4];
//   for (let i = numbers.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * (i + 1));
//     let temp = numbers[i];
//     numbers[i] = numbers[j];
//     numbers[j] = temp;
//     console.log(temp);
//   }
//   return numbers;
// }

// console.log(getRandomNumbers());

let categories = [];

const six = 6;

const five = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

//------make a function that retrieves 6 random categories ID's from API-----
async function getCategoryIds() {
  let res = await axios.get(`${APIURL}categories`, {
    params: { count: 100 },
  });

  console.log(typeof res.data, res.data);

  let topicID = res.data.map((topic) => topic.id);
  console.log(typeof topicID);
  console.log(topicID);
  // Convert the keys of the object to an array
  let keys = Object.keys(topicID);
  console.log(keys);
  // Shuffle the array   <-------------- shuffled code used later------------>
  //for (let i = keys.length - 1; i > 0; i--) {
  //    let j = Math.floor(Math.random() * (i + 1));
  ///   let temp = keys[i];
  // /   keys[i] = keys[j];
  //    keys[j] = temp;

  //}

  let response = keys;

  response.forEach(function (item) {
    console.log(item.name);
  });
  console.log(response);

  console.log(typeof keys, keys);

  // Get 20 and add ids from the array//------ did later ---------
  //let randomKeys = keys.slice(0, 20);
  //console.log(typeof randomKeys);
  // log 6 random keys from the object//------ did later ---------

  //filter out and remove from array bad ID's'/ figured out a fix but will leave code
  let numbersToRemove = [0, 7, 1, 5];

  let filteredCategoryIds = topicID.filter(
    (item) => !numbersToRemove.includes(item)
  );

  console.log(filteredCategoryIds);

  console.log(filteredCategoryIds);

  return topicID;
}

//getCategoryIds()
/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(getCat) {
  const response = await axios.get(`${APIURL}/category?id=${getCat}`);
  //get and store required data from api
  const categoryData = {
    title: response.data.title,
    clues: response.data.clues.map((clue) => ({
      question: clue.question,
      answer: clue.answer,
      showing: null,
    })),
  };
  console.log(categoryData);
  return categoryData;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  const tableHead = document.querySelector("thead tr");
  const tableBody = document.querySelector("tbody");
  tableHead.innerHTML = "";
  // Setting this to '' clears the existing table header

  //make empty id array
  let categoryIds = [];

  categoryIds = await getCategoryIds();
  console.log(categoryIds);

  const selectedCategories = []; // Array to store selected category IDs

  //loop to get random id
  for (let i = 0; i < 6; i++) {
    let catId;
    do {
      catId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    } while (selectedCategories.includes(catId)); // Keep selecting until a unique category ID is found

    selectedCategories.push(catId); // Add the selected category ID to the array

    console.log(catId);
    console.log(selectedCategories);

    //use function getCategory to append info to th enter class col for bootstrap
    const category = await getCategory(catId);
    if (category) {
      const th = document.createElement("th");
      console.log(th);
      th.classList.add("col-2");
      th.textContent = category.title;
      tableHead.appendChild(th);
      categories.push(category);
    }
  }
  //This helps us fill the 6 category <thead> with the names of each category. It uses a for loop that adds the category to the table up until 6 are loaded. It also filters out repeated categories.

  for (let i = 0; i < 5; i++) {
    const tr = document.createElement("tr");
    //tr.class = "col";
    tr.classList.add("col-lg-2");
    console.log(tr);
    for (let j = 0; j < 6; j++) {
      const td = document.createElement("td");
      td.classList.add("col-4", "col-lg-2");
      td.textContent = "?";
      td.addEventListener("click", handleClick);
      tr.appendChild(td);
      console.log(td);
    }
    tableBody.appendChild(tr);
  }
  //This fills the table body with the cells for the questions and answers. The for loop accesses 5 since the first cell in each column is reserved for the category name.
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  const cell = evt.target;
  console.log(cell);

  const rowIndex = this.parentNode.rowIndex - 2; //We use -2 here to account for the array index starting at 0, and the table head not counting for questions. This hard-coding is not best practice but it fixes the current issue.
  console.log(rowIndex);
  const columnIndex = this.cellIndex;
  console.log(columnIndex);
  const category = categories[columnIndex];
  console.log(category);

  const clue = category.clues[rowIndex];

  console.log(clue);

  if (!clue.showing) {
    console.log(!clue.showing);

    cell.textContent = clue.question;

    console.log(cell.textContent);

    clue.showing = "question";
    console.log(clue.showing);
    cell.classList.add("clicked");
  } else if (clue.showing === "question") {
    //   cell.textContent = '';
    //   clue.showing = 'hidden';
    //   cell.classList.remove('clicked');
    // } else if (clue.showing === 'hidden') {

    //remove html tags from textContent, remove the escape characters
    cell.innerHTML = clue.answer.replace("\\", "");
    //  let cellAnswer = cell.innerHTML.replace('\\',"")

    //  console.log(cellAnswer)

    console.log(cell.innerHTML);

    clue.showing = "answer";
    console.log(clue.showing);

    cell.classList.add("answer");
  } else {
    return;
  }
} // The logic that should be followed is: if the default is showing, click the box to show the question. if the question is showing, click the box to reveal the answer. if the answer is showing, do nothing. currently, what is happening is we go from ? to blank on the first click, and blank to the answer on the second click. we need to see ? to question on click 1, and question to answer on click 2.

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  const spinner = document.querySelector("#spin-container");
  spinner.style.display = "block";
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  const spinner = document.querySelector("#spin-container");
  spinner.style.display = "none";
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  const startButton = document.getElementById("start");
  if (startButton.textContent === "Start!") {
    showLoadingView();
    categories = [];
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
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
