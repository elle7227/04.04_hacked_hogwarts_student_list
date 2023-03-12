"use strict";

window.addEventListener("DOMContentLoaded", start);
let filterBy = "all";
let allStudents = [];
let expelledStudents = [];
let searchBar = document.getElementById("searchbar");
let hacked = false;

const settings = {
  filter: "all",
  sortBy: "first_name",
  sortDir: "asc",
};

// The prototype for Students:
const Student = {
  first_name: "",
  last_name: "",
  middleName: "",
  nickName: "",
  house: "",
  blood: "",
  image: "",
  expelled: false,
  prefect: false,
  inquisitorial: false,
};

//hide the pop_op from start
document.querySelector("#pop_op_info").style.display = "none";

async function start() {
  console.log("ready");
  document.body.style.backgroundColor = " rgb(62, 55, 55)";
  document.querySelector("#hacked_text").classList.add("hide");
  await loadJSON();

  //call function that adds event-listeners to filter and sort buttons
  registerButtons();
}

//function that adds event-listeners to filter and sort buttons
function registerButtons() {
  document.querySelector("#hack_button").addEventListener("click", starthack);

  //event-listeners to filter buttons
  document.querySelectorAll(`[data-action="filter"]`).forEach((button) => button.addEventListener("click", selectFilter));

  //event-listeners to sort buttons (tekst)
  document.querySelectorAll(`[data-action="sort"]`).forEach((button) => button.addEventListener("click", selectSort));
}

//fetch data objects from json file
async function loadJSON() {
  const response = await fetch("student_list.json");
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  // calling this function so we filter and sort on the first load
  buildList();
}

//prepare the object from prototype and json we want to show
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  //correct capitalization
  let upperCase = true;
  let result = "";
  for (let i = 0; i < jsonObject.fullname.length; i++) {
    let letter = jsonObject.fullname[i];
    if (upperCase) {
      letter = letter.toUpperCase();
    } else {
      letter = letter.toLowerCase();
    }
    upperCase = letter === " " || letter === "-" || letter === '"';
    result += letter;
  }

  //splits into fullname, lastname, middlename and nickname
  const fullname = result.trim().split(" ");
  if (fullname.length > 2) {
    student.first_name = fullname[0];
    if (fullname[1].includes('"')) {
      student.nickName = fullname[1];
    } else {
      student.middleName = fullname[1];
    }
    student.last_name = fullname[2];
  } else if (fullname.length < 2) {
    student.first_name = fullname[0];
    student.last_name = "";
  } else {
    student.first_name = fullname[0];
    student.last_name = fullname[1];
  }

  //adds houses
  student.house = jsonObject.house.trim().substring(0, 1).toUpperCase() + jsonObject.house.trim().substring(1).toLowerCase();

  //adds images
  if (student.last_name != undefined) {
    student.image = `images/${student.last_name.toLowerCase()}_${student.first_name.substring(0, 1).toLowerCase()}.png`;
    if (student.last_name.includes("-")) {
      student.image = `images/${student.last_name.toLowerCase().substring(student.last_name.indexOf("-") + 1)}_${student.first_name.toLowerCase().substring(0, 1)}.png`;
    }
  }

  //adds blood type
  student.blood = jsonObject.blood;

  student.expelled = jsonObject.expelled;

  student.inquisitorial = jsonObject.inquisitorial;

  return student;
}

document.querySelector("#searchBar").addEventListener("keyup", (e) => {
  console.log(e.target.value);
  const searchtarget = e.target.value;
  const filteredstudents = allStudents.filter((student) => {
    return student.first_name.includes(searchtarget);
  });
  console.log(filteredstudents);
  displayList(filteredstudents);
  //search();
});

function search() {
  allStudents.forEach((student) => {
    const searchtarget = event.target.value;
    console.log(event.target.value);
    if (student.first_name.includes(searchtarget)) {
      buildList();
    }
  });
  console.log("working");
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterlist(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGriffendor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    filteredList = expelledStudents;
  }

  //number of hufflepuff students
  const huffleStudent = allStudents.filter((student) => student.house == "Hufflepuff");
  document.querySelector("#nr_hufflepuff").textContent = `Hufflepuff: ${huffleStudent.length} students`;

  //number of gryffin students
  const gryffinStudents = allStudents.filter((student) => student.house == "Gryffindor");
  document.querySelector("#nr_gryffindor").textContent = `Gryffindor: ${gryffinStudents.length} students`;

  //number of slytherin students
  const slytherStudents = allStudents.filter((student) => student.house == "Slytherin");
  document.querySelector("#nr_slytherin").textContent = `Slytherin: ${slytherStudents.length} students`;

  //number of ravenclaw students
  const ravenStudents = allStudents.filter((student) => student.house == "Ravenclaw");
  document.querySelector("#nr_ravenclaw").textContent = `Ravenclaw: ${ravenStudents.length} students`;

  return filteredList;
}

function isGriffendor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house == "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  if (student.house == "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house == "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  const oldElement = document.querySelector(`[data-sort="${settings.sortBy}"]`);

  oldElement.classList.remove("sortby");
  event.target.classList.add("sortby");

  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  //console.log(`user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterlist(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

function sortByType(a, b) {
  if (a.first_name < b.first_name) {
    return -1;
  } else {
    return 1;
  }
}

function displayList(students) {
  document.querySelector("#array_lenght").textContent = `Students total: ${allStudents.length - expelledStudents.length}`;
  // clear the list
  document.querySelector("#holder").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template").cloneNode(true).content;
  // set clone data
  clone.querySelector("[data-field=first_name]").textContent = student.first_name;
  clone.querySelector("[data-field=last_name]").textContent = student.last_name;
  clone.querySelector("[data-field=house]").textContent = `From: ${student.house}`;
  clone.querySelector("button").addEventListener("click", () => showPopUp(student));

  document.querySelector(".closebutton").addEventListener("click", () => (pop_op_info.style.display = "none"));

  function showPopUp(student) {
    console.log("viser pop_op");
    const pop_op_info = document.querySelector("#pop_op_info");
    pop_op_info.style.display = "flex";
    pop_op_info.querySelector("h1").textContent = student.first_name + ` ${student.middleName} ${student.nickName}`;
    pop_op_info.querySelector("#lastName").textContent = `Last name: ${student.last_name}`;
    pop_op_info.querySelector("#house").textContent = `House: ${student.house}`;
    pop_op_info.querySelector("#blood").textContent = `Blood-status: ${student.blood}`;
    pop_op_info.querySelector("#prefect").textContent = `Prefect: ${student.prefect}`;
    pop_op_info.querySelector("#inquisitorial").textContent = "Inquisitorial: false";

    pop_op_info.querySelector("#picture").src = student.image;

    if (student.blood == "pure" || student.house == "Slytherin") {
      pop_op_info.querySelector("#makeIT").addEventListener("click", clickSquad);
      pop_op_info.querySelector("#makeIT").style.display = "block";
    } else {
      pop_op_info.querySelector("#makeIT").style.display = "none";
    }

    function clickSquad() {
      if (hacked) {
        student.inquisitorial = true;
        setTimeout(removeInquisitorial, 1000);
        function removeInquisitorial() {
          student.inquisitorial = false;
          pop_op_info.querySelector("#inquisitorial").textContent = `Inquisitorial: ${student.inquisitorial}`;
        }
      } else {
        if (student.inquisitorial) {
          student.inquisitorial = false;
          pop_op_info.querySelector("#inquisitorial").textContent = `Inquisitorial: ${student.inquisitorial}`;
        } else {
          student.inquisitorial = true;
        }
      }
      buildList();
      pop_op_info.querySelector("#inquisitorial").textContent = `Inquisitorial: ${student.inquisitorial}`;
    }

    pop_op_info.querySelector("button#expell").addEventListener("click", expelStudent);

    function expelStudent() {
      if (student.first_name != "Ellen" && student.last_name != "Sørensen") {
        allStudents.splice(allStudents.indexOf(student), 1);
        expelledStudents.push(student);
      } else {
        alert("not possible");
      }
      close();
      document.querySelector("#nr_expelled").innerHTML = `Students expelled: ${expelledStudents.length + 0}`;
    }

    function close() {
      pop_op_info.querySelector("button#expell").removeEventListener("click", expelStudent);
      document.querySelector("#pop_op_info").style.display = "none";
      buildList();
    }
  }

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#holder").appendChild(clone);
}
const prefects = allStudents.filter((student) => student.prefect);

function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  //const andre = prefects.filter((student) => student.house);
  console.log(prefects);
  console.log(prefects.length);

  //const numberOfPrefects = prefects.length;

  const other = prefects.filter((student) => student.house === selectedStudent.house);

  const numberOfandre = other.length;
  document.querySelector("#prefect_students").textContent = `Prefects: ${prefects.length + 1}`;

  //if there is another of the same type
  if (numberOfandre >= 2) {
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  /*function removeOther(other) {
    //ask user to ignore og remove other
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton1").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #remove_other_button").addEventListener("click", clickRemoveOther);
    document.querySelector("#remove_other [data-field=prefect]").textContent = other.first_name;

    //if ignore do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton1").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #remove_other_button").removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }*/
}

function removeAorB(prefectA, prefectB) {
  //ask user to ignore og remove a or b

  document.querySelector("#remove_aorb").classList.remove("hide");
  document.querySelector("#remove_aorb .closebutton1").addEventListener("click", closeDialog);
  document.querySelector("#remove_aorb #remove_a").addEventListener("click", clickRemoveA);
  document.querySelector("#remove_aorb #remove_b").addEventListener("click", clickRemoveB);

  //show names on buttons
  document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.first_name;
  document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.first_name;

  //if ignore do nothing
  function closeDialog() {
    document.querySelector("#remove_aorb").classList.add("hide");
    document.querySelector("#remove_aorb .closebutton1").removeEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #remove_a").removeEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #remove_b").removeEventListener("click", clickRemoveB);
  }

  //if remove a
  function clickRemoveA(selectedStudent) {
    removePrefect(prefectA);
    makePrefect(selectedStudent);
    buildList();
    closeDialog();
  }

  //if remove b
  function clickRemoveB(selectedStudent) {
    removePrefect(prefectB);
    makePrefect(selectedStudent);
    buildList();
    closeDialog();
  }
}

function removePrefect(prefectStudent) {
  prefectStudent.prefect = false;
}

function makePrefect(selectedStudent) {
  selectedStudent.prefect = true;
}

function starthack() {
  hacked = true;
  console.log("system is hacked");
  document.body.style.backgroundColor = "purple";
  document.querySelector("#hacked_text").classList.remove("hide");
  hackTheSystem();
}

function hackTheSystem() {
  hacked = true;
  buildList();
  console.log("hacked with random and push ellen ");

  let random;
  allStudents.forEach((student) => {
    random = Math.floor(Math.random() * 3);
    if (random == 0) {
      student.blood = "pure";
    } else if (random == 1) {
      student.blood = "half";
    } else {
      student.blood = "muggle-blood";
    }
    buildList();
    student.inquisitorial = false;
  });

  const mySelf = {
    first_name: "Ellen",
    last_name: "Sørensen",
    middleName: "hein",
    nickName: "",
    house: "Gryffindor",
    blood: "pure",
    image: "images/ellen.png",
    expelled: false,
    prefect: false,
    inquisitorial: false,
  };

  allStudents.push(mySelf);
  buildList();
  document.querySelector("#hack_button").removeEventListener("click", starthack);
  document.querySelector("h1").addEventListener("click", start);
}
