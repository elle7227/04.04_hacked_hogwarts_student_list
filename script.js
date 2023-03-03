"use strict";

window.addEventListener("DOMContentLoaded", start);
let filterBy="all";
let allStudents = [];
let searchBar = document.getElementById("searchbar");



const settings = {
    filter:"all",
    sortBy: "first_name",
    sortDir: "asc"
}

// The prototype for Students: 
const Student = {
    first_name: "",
    last_name: "",
    house: "",
    blood: "",
    status: false,
    winner: false
};



function start( ) {
    console.log("ready");
    // call function that adds event-listeners to filter and sort buttons
    registerButtons();
    loadJSON();
}

//function that adds event-listeners to filter and sort buttons
function registerButtons(){
    //event-listeners to filter buttons
    document.querySelectorAll(`[data-action="filter"]`).forEach
    (button=> button.addEventListener("click", selectFilter));

    //event-listeners to sort buttons (tekst)
    document.querySelectorAll(`[data-action="sort"]`).forEach
    (button=> button.addEventListener("click", selectSort));

}

//fetch data from json file
async function loadJSON() {
    const response = await fetch("student_list.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects( jsonData );
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map( preapareObject );
    // calling this function so we filter and sort on the first load
    buildList();
}

//prepare the object from prototype and json we want to show 
function preapareObject( jsonObject ) {
    // making the prototype (Student) to an object (sudent)
    const student = Object.create(Student);

    // splitting the full name in first and last name
    const texts = jsonObject.fullname.toLowerCase().split(" ");
    student.first_name = texts[0];
    student.last_name = texts[1];
    student.house = jsonObject.house.toLowerCase();
    student.status = jsonObject.status;
    student.blood = jsonObject.blood;
    
    return student;
}



document.querySelector("#searchBar").addEventListener("keyup",(e)=>{
    console.log(e.target.value);
    const searchtarget = e.target.value;
    /* filterkeramik2 defineres som værende produkter (som returneres) hvori de indtastede bogstaver indår i navnet*/
    const filteredstudents = allStudents.filter(student=>{
      return(student.first_name.includes(searchtarget));
    });
    console.log(filteredstudents);
    search();
        });
    
function search(){
        allStudents.forEach(student =>{
            const searchtarget = event.target.value;
            console.log(event.target.value);
            if(student.first_name.includes(searchtarget)){
            buildList();              
            }
        });
}
    
    
function selectFilter(event){
    const filter = event.target.dataset.filter;
    console.log(`user selected ${filter}`);
    setFilter(filter);  
    }

function setFilter(filter){
    settings.filterBy = filter;
    buildList();
}



function filterlist(filteredList){
    if(settings.filterBy === "gryffindor"){
        filteredList = allStudents.filter(isGriffendor);
    } else if(settings.filterBy   ===  "hufflepuff"){
        filteredList = allStudents.filter(isHufflepuff);
    }else if(settings.filterBy   ===  "ravenclaw"){
    filteredList = allStudents.filter(isRavenclaw);
    }else if(settings.filterBy   ===  "slytherin"){
    filteredList = allStudents.filter(isSlytherin);
    }else if(settings.filterBy   ===  "expelled"){
        filteredList = allStudents.filter(isExpelled);
    }
  
    //showing nymber of students in each house/category on interface

    //number of displayed students
    document.querySelector("#array_lenght").textContent = `Displayed students: ${filteredList.length}`;

    //number of hufflepuff students
    const huffleStudent = allStudents.filter(student => student.house =="hufflepuff");
    document.querySelector("#nr_hufflepuff").textContent = `Hufflepuff students: ${huffleStudent.length}`;

      //number of gryffin students
      const gryffinStudents = allStudents.filter(student => student.house =="gryffindor");
      document.querySelector("#nr_gryffindor").textContent = `Gryffindor students: ${gryffinStudents.length}`;

       //number of slytherin students
       const slytherStudents = allStudents.filter(student => student.house =="slytherin");
       document.querySelector("#nr_slytherin").textContent = `Slytherin students: ${slytherStudents.length}`;


       //number of ravenclaw students
       const ravenStudents = allStudents.filter(student => student.house =="ravenclaw");
       document.querySelector("#nr_ravenclaw").textContent = `Ravenclaw students: ${ravenStudents.length}`;

        //number of expelled students
        const expelledStudents = allStudents.filter(student => student.status ==false);
        document.querySelector("#nr_expelled").textContent = `Expelled students: ${expelledStudents.length}`;
  
    return (filteredList);
}





function isGriffendor (student){

    if(student.house === "gryffindor"){
        return true; 
    }else{
        return false; 
    }

}

function isHufflepuff (student){
    if(student.house == "hufflepuff"){
        return true; }
        else{
            return false; 
        }
}  

function isRavenclaw (student){
    if(student.house == "ravenclaw"){
        return true; }
        else{
            return false; 
        }
} 

function isSlytherin (student){
    if(student.house == "slytherin"){
        return true; }
        else{
            return false; 
        }
} 

function isExpelled (student){
    if(student.status == false){
        return true;
    }
        else{
            return false; 
        }
}



function selectSort(event){
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;


    const oldElement = document.querySelector(`[data-sort="${settings.sortBy}"]`);

    oldElement.classList.remove("sortby");
    event.target.classList.add("sortby");

    if(sortDir==="asc"){
        event.target.dataset.sortDirection = "desc";
    }
    else{
        event.target.dataset.sortDirection = "asc";  
    }

    //console.log(`user selected ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
}


function setSort(sortBy, sortDir){
    settings.sortBy= sortBy; 
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList){
    let direction = 1;

    if (settings.sortDir === "desc"){
        direction=-1;
    }else {
        direction=1;
    }
    sortedList = sortedList.sort(sortByProperty);
  

    function sortByProperty(a,b){
       
        if(a[settings.sortBy]< b[settings.sortBy]){
            return -1*direction;
        }else{
            return 1*direction;
        }
    }
    return sortedList;
}



function buildList(){
    const currentList = filterlist(allStudents);
    const sortedList = sortList(currentList);
    displayList(sortedList);

}


function sortByType(a,b){
    if(a.first_name< b.first_name){
        return-1;
    }else{
        return 1;
    }
}


function displayList(students) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    students.forEach( displayStudent );
}

function displayStudent( student ) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);
    // set clone data
    clone.querySelector("[data-field=first_name]").textContent = student.first_name;
    clone.querySelector("[data-field=last_name]").textContent = student.last_name;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("button").addEventListener("click",()=>showPopUp(student));

    document.querySelector(".closebutton").addEventListener("click",()=>pop_op_info.style.display="none");


function showPopUp(student){
    console.log("viser pop_op");
    const pop_op_info =document.querySelector("#pop_op_info");
    pop_op_info.style.display = "flex";
    pop_op_info.querySelector("h1").textContent=student.first_name;
    pop_op_info.querySelector("#lastName").textContent=student.last_name;
    pop_op_info.querySelector("#house").textContent=student.house;
    pop_op_info.querySelector("#blood").textContent = `Blood-status: ${student.blood}`;
}

  
    if(student.star===true){
        clone.querySelector("[data-field=star]").textContent = "⭐";
    }else{
        clone.querySelector("[data-field=star]").textContent = "☆";
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    function clickStar(){
        if(student.star===true){
            student.star =false;
        }else{
            student.star=true;
        }
        buildList();
    }

    clone.querySelector("[data-field=winner]").dataset.winner = student.winner;
    clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);

    function clickWinner(){
        if(student.winner===true){
            student.winner =false;
        }else{
            tryToMakeAWinner(student);
        }
        buildList();
    }

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
    
}



function tryToMakeAWinner(selectedStudent){
 
    const winners = allStudents.filter(student => student.winner);
    console.log(winners);

    const numberOfWinners = winners.length;
    const other = winners.filter(student=> student.house ===selectedStudent.house).shift();

    //if there is another of the same type
    if(other !==undefined){
        removeOther(other);
    }else if(numberOfWinners >= 2){
        removeAorB(winners[0], winners[1]);
    }else{
        makeWinner(selectedStudent);
    }

    function removeOther(other){
        //ask user to ignore og remove other
        document.querySelector("#remove_other").classList.remove("hide");
        document.querySelector("#remove_other .closebutton1").addEventListener("click", closeDialog);
        document.querySelector("#remove_other #remove_other_button").addEventListener("click", clickRemoveOther);

        document.querySelector("#remove_other [data-field=otherwinner]").textContent=other.first_name;
  
        //if ignore do nothing 
        function closeDialog(){
            document.querySelector("#remove_other").classList.add("hide");
            document.querySelector("#remove_other .closebutton1").removeEventListener("click", closeDialog);
        document.querySelector("#remove_other #remove_other_button").removeEventListener("click", clickRemoveOther);
        }

        //if remove other:
        function clickRemoveOther(){
            removeWinner(other);
            makeWinner(selectedStudent);
            buildList();
            closeDialog();
        }
      
    }
}


function removeAorB(winnerA, winnerB){
    //ask user to ignore og remove a or b

    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton1").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #remove_a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #remove_b").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove_aorb [data-field=winnerA]").textContent=winnerA.first_name;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent=winnerB.first_name;
   

    //if ignore do nothing 
    function closeDialog(){
        document.querySelector("#remove_aorb").classList.add("hide");
        document.querySelector("#remove_aorb .closebutton1").removeEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #remove_a").removeEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #remove_b").removeEventListener("click", clickRemoveB);
    }

     //if remove a 
    function clickRemoveA(){
        removeWinner(winnerA);
        makeWinner(selectedStudent);
        buildList();
        closeDialog();
    }


    //if remove b
    function clickRemoveB(){
        removeWinner(winnerB);
        makeWinner(selectedStudent);  
        buildList();
        closeDialog();
    }
     
}

function removeWinner(winnerStudent){
    winnerStudent.winner = false;
}

function makeWinner(student){
    student.winner=true; 
}










