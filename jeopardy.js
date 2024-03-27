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









let categories = [];


const six = 6

const five = 5

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

 //------make a function that retrieves 6 random categories ID's from API-----
 async function getCategoryIds() {
	let res = await axios.get(`${APIURL}categories`, {
    params: { count: 100 },});
  


  console.log(res);

  let topicID = res.data.map((topic) => topic.id);
  console.log(typeof topicID);
  console.log(topicID);
  // Convert the keys of the object to an array
 let keys = Object.keys(topicID);

 // Shuffle the array
for (let i = keys.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = keys[i];
    keys[i] = keys[j];
    keys[j] = temp;







}

// Get the first 6 numbers from the array
let randomKeys = keys.slice(0, 20);

// log 6 random keys from the object


let numbersToRemove = [0];

    let filteredCategoryIds = topicID.filter(item => !numbersToRemove.includes(item));

console.log(filteredCategoryIds); // [1, 2, 4, 5, 8, 9]
    
   



    console.log(filteredCategoryIds)







console.log(randomKeys); 

  return randomKeys;
}

getCategoryIds()
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



async function getCategory(catId) {
   const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`);



   const catData = {
        id: res.data.id,
        title: res.data.title,
        clues: res.data.clues.slice(0,2)
    };



   console.log(catData) 

    // return category with only 2 clues
    return catData
}





/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const tableHead = document.querySelector('thead tr');
    const tableBody = document.querySelector('tbody');
    tableHead.innerHTML = ''; 
    // Setting this to '' clears the existing table header

    let categoryIds = [];
    try {
        categoryIds = await getCategoryIds();
    } catch (error) {
        console.error('Error fetching category IDs:', error);
        return;
    }
    if (!categoryIds || categoryIds.length === 0) {
        console.error('No category IDs fetched.');
        return;
    }
    //This helps us fetch the category IDs. It will stop the execution if there is either an error fetching the IDs, or if there aren't any IDs being fetched.

    const selectedCategories = []; // Array to store selected category IDs

    for (let i = 0; i < 6; i++) {
        let catId;
        do {
            catId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        } while (selectedCategories.includes(catId)); // Keep selecting until a unique category ID is found

        selectedCategories.push(catId); // Add the selected category ID to the array

        const category = await getCategory(catId);
        if (category) {
            const th = document.createElement('th');
            th.textContent = category.title;
            tableHead.appendChild(th);
            categories.push(category);
        }
    }
    //This helps us fill the 6 category <thead> with the names of each category. It uses a for loop that adds the category to the table up until 6 are loaded. It also filters out repeated categories.

    for (let i = 0; i < 5; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 6; j++) {
        const td = document.createElement('td');
        td.textContent = '?';
       // td.addEventListener('click', clickCell);
        tr.appendChild(td);
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
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */
$("#start").on("click", getCategoryIds);
// TODO

/** On page load, add event handler for clicking clues */

// TODO