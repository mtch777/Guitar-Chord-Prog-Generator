//Eventually: For efficiency - move smoothing criteria upstream to where the chord combos are generated?
//change root note optimization to low note optimization
//add more voicings
//Allow for repeats
//regen chord when repeat
//Create logic to choose from the existing options
//Iterate through chord shapes to see which inverted ones are feasible
//Come up with logic to make new chords from scratch

//Nice-to-have: Option to randomly generate chord voicings
//Nice-to-have: Save default settings to cache
//Nice-to-have: Translate checkboxes to multi-select drop-downs
//Nice-to-have: Collapsable settings & advanced settings menu
//Nice-to-have: Mobile phone view
//Nice-to-have: Other modes
//Nice-to-have: Weighted 'favorite' voicings
//Nice-to-have: Scales between each voicing
//Nice-to-have: Chord Substitutions
//Nice-to-have: Individual chord adjustments (regen, more or less spicy)
//Nice-to-have: Individual pentatonic adjustments (add/remove extensions)

function ranSelector (list){
  var randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}

let noteList = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B']
let qualityList = ['M7','m7','7','ø','°']
let chordList = []
let chordShapes = [
  ['M7','Triad',0,[0,2,2,1,0,0]],
  ['m7','Triad',0,[0,2,2,0,0,0]],
  ['M7','7th',0,[0,2,1,1,0,0]],
  ['m7','7th',0,[0,2,0,0,0,0]],
  ['M7','11th',0,[0,0,2,1,0,0]],
  ['m7','9th',0,[0,2,2,0,0,2]],
  ['m7','11th',0,[0,0,2,0,0,0]],
  ['m7','13th',0,[0,2,2,0,2,0]],
  ['M7','7th, 11th',0,[0,0,1,1,0,0]],
  ['m7','7th, 9th',0,[0,2,0,0,0,2]],
  ['m7','7th, 11th',0,[0,2,0,2,0,0]],
  ['m7','7th, 13th',0,[0,2,0,0,2,0]],
  ['7','Dom 7th, 9th',0,[0,2,0,1,0,2]],
  ['7','Dom 7th, 11th',0,[0,0,0,1,0,0]],
  ['7','Dom 7th, 13th',0,[0,2,0,1,2,0]],
  ['7','Dom 7th',0,[0,2,0,1,0,0]],
  //['ø','Triad',0,[0,1,2,0,'x','x']],
  //['ø','7th',0,[0,1,0,0,'x','x']],
  ['ø','7th, 13th',2,[1,1,3,1,1,1]],
  ['M7','Triad',1,[0,0,2,2,2,0]],
  ['m7','Triad',1,[0,0,2,2,1,0]],
  ['M7','7th',1,[0,0,2,1,2,0]],
  ['m7','7th',1,[0,0,2,0,1,0]],
  ['M7','/Min 9th',1,[0,0,2,2,0,0]],
  ['M7','11th',1,[0,0,0,2,2,0]],
  ['M7','13th',1,[0,0,2,2,2,2]],
  ['m7','11th',1,[0,0,0,2,1,0]],
  ['M7','/Min 7th, 9th',1,[0,0,2,1,0,0]],
  ['M7','7th, 11th',1,[0,0,0,1,2,0]],
  ['m7','7th, 13th',1,[0,0,2,0,1,2]],
  ['7','Dom 7th',1,[0,0,2,0,2,0]],
  ['7','Dom 7th, 11th',1,[0,0,0,0,2,0]],
  //['ø','Triad',1,['x',0,1,2,1,'x']],
  //['ø','7th',1,['x',0,1,0,1,'x']]
]

let chordDegreeObj = {
  'Maj Diatonic': [[0,4,7,11,2,5,9]],
  'Min Diatonic': [[0,3,7,10,2,5,9]],
  'M7' : [[0,4,7,11,2,5,9],["R","3","5","7","9","11","13"],["#1E5631","#46900c","#46900c","#1cb2f5","Yellow","Yellow","Yellow"]],
  '7' : [[0,4,7,10,2,5,9],["R","3","5","b7","9","11","13"],["#1E5631","#46900c","#46900c","#1cb2f5","Yellow","Yellow","Yellow"]],
  'm7' : [[0,3,7,10,2,5,9],["R","b3","5","b7","9","11","13"],["#1E5631","#46900c","#46900c","#1cb2f5","Yellow","Yellow","Yellow"]],
  'ø' : [[0,3,6,10,2,5,8],["R","b3","b5","b7","9","11","b13"],["#1E5631","#46900c","#46900c","#1cb2f5","Yellow","Yellow","Yellow"]],
  '°' : [[0,3,6,9,2,5,8],["R","b3","b5","bb7","9","11","b13"],["#1E5631","#46900c","#46900c","#1cb2f5","Yellow","Yellow","Yellow"]],
  'Min Pentatonic': [[0,3,6,7,10,5],["R","3","b5","5","7","11"],["#1E5631","#46900c","Blue","#46900c","#1cb2f5","Yellow"]],
  'Maj Pentatonic': [[0,4,7,2,9],["R","3","5","9","13"],["#1E5631","#46900c","#46900c","Yellow","Yellow"]],
  'Rel Min Pentatonic': [[0,3,6,7,10,5],["R","3","b5","5","7","11"],["#1E5631","#46900c","Blue","#46900c","#1cb2f5","Yellow"]],
  'Rel Maj Pentatonic': [[0,4,7,2,9],["R","3","5","9","13"],["#1E5631","#46900c","#46900c","Yellow","Yellow"]]
}

let openStrings = ["E","A","D","G","B","E",""]
let playChordList = []
for (let i=0;i<noteList.length;i++){
  playChordList.push([noteList[i],ranSelector(chordShapes)])
}


function resetVisuals(){
  document.getElementById('chartDiv').innerText = ''
  document.getElementById('chartDiv').style.color = 'black'
  document.getElementById('chartDiv').style.fontSize = '16px'
  var minFretSetting = parseInt(document.getElementById("minFretSetting").value)
  var maxFretSetting = parseInt(document.getElementById("maxFretSetting").value)
  var oneChord = document.getElementById("1Chord").value
  var checkedValue = document.querySelectorAll('.chordCheckbox:checked')
  var chordInts = []
  for (var i=0;i<checkedValue.length;i++) {
    chordInts.push(checkedValue[i].value)
  }

  let currentNotes = openStrings
  let stringStart = [1,1,1,1,1,1]
  let dotNums = [minFretSetting,3,5,7,9,12]

  //remove any previously generated charts
  var chordCharts = document.querySelectorAll('table');
  for (var i=0;i<chordCharts.length;i++) {
    chordCharts[i].remove()
  }


  //for each chord selected
  for (let i=0;i<chordInts.length;i++){
    //select chordChart and delete children
    let chartDiv = document.getElementById("chartDiv");
    let table = document.createElement("table")
    chartDiv.appendChild(table)
    table.setAttribute("id",chordInts[i])
    table.setAttribute("border",1)

    const caption = document.createElement("caption")
    table.appendChild(caption)
    caption.setAttribute("id", `${chordInts[i]}caption`);

    //make initial tableHeader
    const row = document.createElement("tr")
    table.appendChild(row);
    for (let k=0;k<openStrings.length;k++){
      const cell = document.createElement("th")
      row.appendChild(cell);
      cell.classList.add(chordInts[i]);
      cell.classList.add('0');
      cell.classList.add(k);
      cell.innerText = openStrings[k]
      if(k == openStrings.length -1){
        cell.style.border = "none"
      }
    }
    //for each fret in minFretSetting-maxFretSetting: add a row
    for (let j=minFretSetting;j<=maxFretSetting;j++){
      const row = document.createElement("tr")
      table.appendChild(row);

      //for each note in openStrings, add a cell
      for (let k=0;k<openStrings.length;k++){
        const cell = document.createElement("td")
        row.appendChild(cell);
        cell.classList.add(chordInts[i]);
        cell.classList.add(j);
        cell.classList.add(k);

        //if last cell, do fret# stuff
        if(k == openStrings.length -1){
          cell.style.border = "none"
          if(dotNums.includes(j)){
            cell.innerText = j
          }
        }
        //if not last cell, update note
        else{
          if(j>=stringStart[k]){
            let startNumKey = noteList.indexOf(openStrings[k])
            cell.innerText = noteList[(startNumKey + j%12)<noteList.length?(startNumKey + j%12):(startNumKey + j%12)-noteList.length]
            cell.style.color = 'white'
          }
        }
      }
    }

  }
  /*var all = document.getElementsByTagName("*");

  for (var i=0, max=all.length; i < max; i++) {
      all[i].style.background = "White"
      all[i].style.color = "Black"
      all[i].innerText = "t"
  }*/
}

function colorDiatonicChords (chordInput, coords, diatonicNotes, answerNotes){
  let chordType = chordInput[1]
  let allElements = document.querySelectorAll(`.${chordInput[2]}`);
  for (var i = 0; i < allElements.length; i++) {
      let currentNote = allElements[i].textContent

      for(let coordNum = 0; coordNum < coords.length; coordNum++){
        if(typeof(coords[coordNum][0]) == "number" && typeof(coords[coordNum][1]) == "number"){
          coords[coordNum][0] = coords[coordNum][0].toString()
          coords[coordNum][1] = coords[coordNum][1].toString()
        }
        
        let coord1 = allElements[i].className.split(' ')[1]
        let coord2 = allElements[i].className.split(' ')[2]
        if(allElements[i].className.split(' ')[2] == undefined){
          coord2 = coord1
        }
        if(coords[coordNum][0] == coord1){
          if(coords[coordNum][1] == coord2){
            if(answerNotes.includes(currentNote)){
              if(! diatonicNotes.includes(currentNote)){
                allElements[i].style.boxSizing = 'border-box'
                allElements[i].style.borderColor = 'Red'
                allElements[i].style.borderWidth = '1.4px'
                allElements[i].style.lineHeight = '23px'
              }
              //Condense the below into one loop
              if(answerNotes.indexOf(allElements[i].textContent) == 0){
                allElements[i].textContent = chordDegreeObj[chordType][1][0]
                allElements[i].style.background = chordDegreeObj[chordType][2][0]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 1){
                allElements[i].textContent = chordDegreeObj[chordType][1][1]
                allElements[i].style.background = chordDegreeObj[chordType][2][1]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 2){
                allElements[i].textContent = chordDegreeObj[chordType][1][2]
                allElements[i].style.background = chordDegreeObj[chordType][2][2]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 3){
                allElements[i].textContent = chordDegreeObj[chordType][1][3]
                allElements[i].style.background = chordDegreeObj[chordType][2][3]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 4){
                allElements[i].textContent = chordDegreeObj[chordType][1][4]
                allElements[i].style.background = chordDegreeObj[chordType][2][4]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 5){
                allElements[i].textContent = chordDegreeObj[chordType][1][5]
                allElements[i].style.background = chordDegreeObj[chordType][2][5]
                allElements[i].style.color= "Black"
              }
              if(answerNotes.indexOf(allElements[i].textContent) == 6){
                allElements[i].textContent = chordDegreeObj[chordType][1][6]
                allElements[i].style.background = chordDegreeObj[chordType][2][6]
                allElements[i].style.color= "Black"
              }
            }
          }
        }
      }
    }
}
function colorPentatonicScales (chordInput, coords, diatonicNotes, answerNotes, allElements){
  let chordType = chordInput[1]
  for (var i = 0; i < allElements.length; i++) {
    let currentNote = allElements[i].textContent
    if(answerNotes.includes(currentNote)){
      if(! diatonicNotes.includes(currentNote)){
        allElements[i].style.boxSizing = 'border-box'
        allElements[i].style.borderColor = 'Red'
        allElements[i].style.borderWidth = '1.4px'
        allElements[i].style.lineHeight = '23px'
      }
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 0){
      allElements[i].textContent = chordDegreeObj[chordType][1][0]
      allElements[i].style.background = chordDegreeObj[chordType][2][0]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 1){
      allElements[i].textContent = chordDegreeObj[chordType][1][1]
      allElements[i].style.background = chordDegreeObj[chordType][2][1]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 2){
      allElements[i].textContent = chordDegreeObj[chordType][1][2]
      allElements[i].style.background = chordDegreeObj[chordType][2][2]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 3){
      allElements[i].textContent = chordDegreeObj[chordType][1][3]
      allElements[i].style.background = chordDegreeObj[chordType][2][3]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 4){
      allElements[i].textContent = chordDegreeObj[chordType][1][4]
      allElements[i].style.background = chordDegreeObj[chordType][2][4]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 5){
      allElements[i].textContent = chordDegreeObj[chordType][1][5]
      allElements[i].style.background = chordDegreeObj[chordType][2][5]
      allElements[i].style.color= "Black"
    }
    if(answerNotes.indexOf(allElements[i].textContent) == 6){
      allElements[i].textContent = chordDegreeObj[chordType][1][6]
      allElements[i].style.background = chordDegreeObj[chordType][2][6]
      allElements[i].style.color= "Black"
    }
  }
}

function checkValues(chordInput, diatonicNotes){
  console.log(chordInput)
  let chordSpecific_SnapShotList = []
  let answerNotes = []
  
  let extensionList = ["7","9","11",'13']

  let startNum = noteList.indexOf(chordInput[0])
  let chordType = chordInput[1]
  if(chordInput[2].includes("Pentatonic")){
    for(let extNum = 0; extNum < extensionList.length; extNum ++){
      let extElem = document.getElementById(`${extensionList[extNum]}th`)
      if(! extElem.checked){
        if(chordDegreeObj[chordType][1]){
          for(let i=0;i<chordDegreeObj[chordType][1].length;i++){
            if(chordDegreeObj[chordType][1][i].includes(extensionList[extNum])){
              chordDegreeObj[chordType][0].splice(i,1)
              chordDegreeObj[chordType][1].splice(i,1)
              chordDegreeObj[chordType][2].splice(i,1)
            }
          }
        }
      }
    }
  }

  let chordDegrees = chordDegreeObj[chordType][0]
  let chordRootOrigin
  for (i=0;i<chordDegrees.length;i++){
    if((startNum + chordDegrees[i]) >= noteList.length){
      answerNotes.push(noteList[(startNum + chordDegrees[i]) - noteList.length])
    }else{
      answerNotes.push(noteList[startNum + chordDegrees[i]])
    }
  }
  if(chordInput[2]=='diatonic'){
    return(answerNotes)
  }


  let allElements = document.querySelectorAll(`.${chordInput[2]}`);

  //////////////Round 1 - Create the chord coordinate obj//////////// <-skip for pentatonic
  //get all chords that match selection
  let validChordShapes = []
  let validChordShapes_allRoots = []
  let valid = 1
  let coords = []

  let answerChord
  if(!chordInput[2].includes("Pentatonic")){
    for(let shapeNum = 0;shapeNum < chordShapes.length;shapeNum ++){
      let spice = 0
      valid = 1
      let chordShapeQuality = chordShapes[shapeNum][0]
      if(!document.getElementById(`7th`).checked || document.getElementById('maxExt').value == 0){
        if(chordInput[1] == '7'){
          if(chordShapeQuality == 'M7'){
            chordShapeQuality = '7'
          }
        }
      }

      if(chordShapeQuality == chordInput[1]){
        for(let extNum = 0; extNum < extensionList.length; extNum ++){
          let extElem = document.getElementById(`${extensionList[extNum]}th`)
          if(! extElem.checked){
            if(chordShapes[shapeNum][1].includes(`${extensionList[extNum]}th`)){
              valid = 0
            }
          }
          if(chordShapes[shapeNum][1].includes(`${extensionList[extNum]}th`)){
            spice ++
          }
        }
        if(chordShapes[shapeNum][1].includes(`${7}th`)){
            spice -= .5
          }
        if(spice < document.getElementById("minExt").value || spice > document.getElementById("maxExt").value){
          //let all rootless half-dim through?
          valid = 0
        }
        if (valid == 1 || chordShapeQuality == "ø"){
          validChordShapes.push(chordShapes[shapeNum])
        }
      }
    }
    if(validChordShapes.length == 0){
      console.log('no valid shapes!!')
      document.getElementById(`${chordInput[2]}caption`).innerText = 
        `${chordInput[2]}\n No Chord Found`
      return
    }
    console.log(`Number of valid shapes: ${validChordShapes.length}`)
    
    let coordsList = []
    let toupleList = []
    let snapShotTempList = []
    //add chord Shapes to obj
    for(var shapeIter = 0; shapeIter < validChordShapes.length;shapeIter ++){
      
      let originNote = chordInput[0]
      let currentShape = validChordShapes[shapeIter]
      console.log(currentShape)
      
      let currentChord = [chordInput[0]].concat([validChordShapes[shapeIter]])
      
      let lowerFretSetting = parseInt(document.getElementById('minFretSetting').value)
      let lowerFretBoundary = true
      let upperFretSetting = parseInt(document.getElementById('maxFretSetting').value)
      let upperFretBoundary = true
      let minFret = 10000
      let maxFret = 0
            
      for (var i = 0; i < allElements.length; i++) {
        
        //Find root note coordinates, use chord shape to generate other note coordinates
        let currentNote = allElements[i].textContent
        if(originNote == currentNote){
          let coord1 = allElements[i].className.split(' ')[1]
          let coord2 = allElements[i].className.split(' ')[2]
          //if only one class #, that means the fret & string # are the same & merged
          if(coord2 == undefined){
            coord2 = coord1
          }
          
          let currentString = currentChord[1][2]
          if(currentString == coord2){
            console.log('found origin')
            coords = []
            let snapShotCoords = []
            let snapShotFretSum = 0
            let snapShotStringSum = 0
            let snapShotCount = 0
            let snapShotShape = []
            let snapShotOrigin
            let snapShotHighCoord

            
            minFret = 10000
            maxFret = 0
            
            lowerFretSetting = parseInt(document.getElementById('minFretSetting').value)
            lowerFretBoundary = true
            upperFretSetting = parseInt(document.getElementById('maxFretSetting').value)
            upperFretBoundary = true

            let chordShape = currentChord[1][3]
            chordRootOrigin = [coord1,coord2]

            snapShotOrigin = [parseInt(coord1),parseInt(coord2)]

            //if there are strings before the root note, add those first------------
            for(let y = 0;y < currentString;y++){
              if(!isNaN(chordShape[y])){
                coords.push([`${(parseInt(chordRootOrigin[0]) + parseInt(chordShape[y]))}`,`${y}`])
                minFret = Math.min(minFret,(parseInt(chordRootOrigin[0]) + parseInt(chordShape[y])))
                maxFret = Math.max(maxFret,(parseInt(chordRootOrigin[0]) + parseInt(chordShape[y])))
                if(parseInt(chordRootOrigin[0]) + parseInt(chordShape[y]) >0 && parseInt(chordRootOrigin[0]) + parseInt(chordShape[y])<lowerFretSetting){
                  lowerFretBoundary = false
                }
                
                snapShotShape.push([parseInt(chordRootOrigin[0]) + parseInt(chordShape[y]),y])
                snapShotCount ++
                snapShotFretSum += parseInt(chordRootOrigin[0]) + parseInt(chordShape[y])
                snapShotStringSum += y
              }
            }
            

            //then add the origin note--------------
            let originFretNum = (parseInt(chordRootOrigin[0]) + parseInt(chordShape[currentString]))
            coords.push([`${originFretNum}`,`${currentString}`])
            minFret = Math.min(minFret,originFretNum)
            maxFret = Math.max(maxFret,originFretNum)
            if(originFretNum > 0 && originFretNum < lowerFretSetting){
              lowerFretBoundary = false
            }
            
            snapShotShape.push([originFretNum,currentString])
            snapShotCount ++
            snapShotFretSum += originFretNum
            snapShotStringSum += currentString

            //then add the rest of the strings-------------
            for(let z=currentString+1;z<chordShape.length;z++){
              if(!isNaN(chordShape[z])){
                coords.push([`${(parseInt(chordRootOrigin[0]) + parseInt(chordShape[z]))}`,`${z}`])
                minFret = Math.min(minFret,(parseInt(chordRootOrigin[0]) + parseInt(chordShape[z])))
                maxFret = Math.max(maxFret,(parseInt(chordRootOrigin[0]) + parseInt(chordShape[z])))
                if(parseInt(chordRootOrigin[0]) + parseInt(chordShape[z]) >0 && parseInt(chordRootOrigin[0]) + parseInt(chordShape[z])<lowerFretSetting){
                  lowerFretBoundary = false
                }
                
                snapShotShape.push([parseInt(chordRootOrigin[0]) + parseInt(chordShape[z]),z])
                snapShotCount ++
                snapShotFretSum += parseInt(chordRootOrigin[0]) + parseInt(chordShape[z])
                snapShotHighCoord = [parseInt(chordRootOrigin[0]) + parseInt(chordShape[z]),z]
                snapShotStringSum += z
              }
            }
            console.log(currentShape)
            console.log(lowerFretBoundary)
            console.log(maxFret <= upperFretSetting)
            if(lowerFretBoundary && maxFret <= upperFretSetting){
              chordSpecific_SnapShotList.push([chordInput,diatonicNotes,currentShape,minFret,maxFret,snapShotOrigin,[snapShotFretSum/snapShotCount,snapShotStringSum/snapShotCount],snapShotHighCoord,chordShape,snapShotShape,answerNotes])
              coordsList.push(coords)
              toupleList.push([currentChord,coords])
            }
            //chordInput[0], coords[2], diatonicNotes[1], answerNotes[10]
          }
        }
      }
    }
    let tempTouple = ranSelector(toupleList)
    answerChord = tempTouple[0]
    coords = tempTouple[1]
    snapShot.push(chordSpecific_SnapShotList)
  }
  
  
  
  //////////////Round 2 - color the chord////////////
  if(!chordInput[2].includes("Pentatonic")){
    if(document.getElementById("smoothStrength").value == "off"){
      colorDiatonicChords(chordInput, coords, diatonicNotes, answerNotes)
    }
  }
  if(chordInput[2].includes("Pentatonic")){
    colorPentatonicScales(chordInput, coords, diatonicNotes, answerNotes, allElements)
    
  }
  if(chordInput[2].includes("Pentatonic")){
    document.getElementById(`${chordInput[2]}caption`).innerText = `${chordInput[0]} ${chordInput[1]}\n \u00A0`
  }else{
    document.getElementById(`${chordInput[2]}caption`).innerText = 
      `${chordInput[2]}\n${chordInput[0]}${chordInput[1]} (${answerChord[1][1]})`
  }
}

var oldDoc = document.cloneNode(true);
let quality
let key
let snapShot = [] //number : [chordList[j], diatonicNotes, validChordShape Array, selected chordShape Array]

function diatonicChords(){
  chordList = []
  snapShot = []
  key = document.getElementById("keySetting").value
  quality = document.getElementById("scaleSetting").value
  let startNumKey = noteList.indexOf(key)

  if (quality == "Maj"){
    chordList.push([key,"M7","one"])
    chordList.push([noteList[(startNumKey + 2)<noteList.length?(startNumKey + 2):(startNumKey + 2)-noteList.length],"m7","two"])
    chordList.push([noteList[(startNumKey + 4)<noteList.length?(startNumKey + 4):(startNumKey + 4)-noteList.length],"m7","three"])
    chordList.push([noteList[(startNumKey + 5)<noteList.length?(startNumKey + 5):(startNumKey + 5)-noteList.length],"M7","four"])
    chordList.push([noteList[(startNumKey + 7)<noteList.length?(startNumKey + 7):(startNumKey + 7)-noteList.length],"7","five"])
    chordList.push([noteList[(startNumKey + 9)<noteList.length?(startNumKey + 9):(startNumKey + 9)-noteList.length],"m7","six"])
    chordList.push([noteList[(startNumKey + 11)<noteList.length?(startNumKey + 11):(startNumKey + 11)-noteList.length],"ø","seven"])
    chordList.push([key,"Maj Pentatonic","Pentatonic"])
    chordList.push([noteList[(startNumKey + 9)<noteList.length?(startNumKey + 9):(startNumKey + 9)-noteList.length],"Min Pentatonic", "relPentatonic"])
  }
  if (quality == "Min"){
    chordList.push([key,"m7","one"])
    chordList.push([noteList[(startNumKey + 2)<noteList.length?(startNumKey + 2):(startNumKey + 2)-noteList.length],"ø","two"])
    chordList.push([noteList[(startNumKey + 3)<noteList.length?(startNumKey + 3):(startNumKey + 3)-noteList.length],"M7","three"])
    chordList.push([noteList[(startNumKey + 5)<noteList.length?(startNumKey + 5):(startNumKey + 5)-noteList.length],"m7","four"])
    chordList.push([noteList[(startNumKey + 7)<noteList.length?(startNumKey + 7):(startNumKey + 7)-noteList.length],"m7","five"])
    chordList.push([noteList[(startNumKey + 8)<noteList.length?(startNumKey + 8):(startNumKey + 8)-noteList.length],"M7","six"])
    chordList.push([noteList[(startNumKey + 10)<noteList.length?(startNumKey + 10):(startNumKey + 10)-noteList.length],"7","seven"])
    chordList.push([key,"Min Pentatonic","Pentatonic"])
    chordList.push([noteList[(startNumKey + 3)<noteList.length?(startNumKey + 3):(startNumKey + 3)-noteList.length],"Maj Pentatonic", "relPentatonic"])
  }
  var checkedValue = document.querySelectorAll('.chordCheckbox:checked')
  let diatonicNotes = checkValues([key,`${quality} Diatonic`,'diatonic'])
  for (var i=0;i<checkedValue.length;i++) {
    for (let j=0;j<chordList.length;j++){
      if(chordList[j][2] == checkedValue[i].value){
        /*if(!chordList[j][2].includes('Pentatonic')){
          snapShot[chordList[j][2]] = [chordList[j],diatonicNotes]
        }*/
        checkValues(chordList[j],diatonicNotes)
      }
    }
  }
}

function orderChords(chordOrder = ['one','two','three','four','five','six','seven']){
  let tempSnapShot = []
  
  chordOrder.push('Pentatonic','relPentatonic')
  var wrapper = document.getElementById("chartDiv");
  var items = wrapper.children;
  var elements = document.createDocumentFragment();
  let counter = 0
  chordOrder.forEach(function(idx) {
    let chartElement = wrapper.querySelector(`#${idx}`)

    if(chartElement){
      elements.appendChild(wrapper.querySelector(`#${idx}`).cloneNode(true));
      if(!idx.includes('Pentatonic')){
        for(let i = 0; i < snapShot.length;i++){
          if(idx == snapShot[i][0][0][2]){
            tempSnapShot.push(snapShot[i])
          }
        }
        counter++
      }
    }
  });
  snapShot = tempSnapShot
  wrapper.innerHTML = null;
  wrapper.appendChild(elements);
  //.appendChild(elements);
}

let progRetryCount = 0
function chordProgression(){
  let progType = document.getElementById("progression").value
  if(progType == "Chronological"){
    orderChords()
    return
  }
  
  let nextObj = {
    'one':['two','three','four','five','seven'],
    'two':['one','five'],
    'three':['two','four','six'],
    'four':['one','two','five'],
    'five':['one','six'],
    'six':['two','four'],
    'seven':['three']
  }
  let nextObjKeys = Object.keys(nextObj)

  let checkedChords = Array.from(document.querySelectorAll('.chordCheckbox:checked'), ({ value }) => value).filter((value) => !value.includes('Pentatonic'))

  for(let k = 0; k<nextObjKeys.length;k++){
    if(!checkedChords.includes(nextObjKeys[k])){
      delete nextObj[nextObjKeys[k]]
      continue
    }
    nextObj[nextObjKeys[k]] = nextObj[nextObjKeys[k]].filter((value) => checkedChords.includes(value))
  }

  let chordOrder = []

  let chord = 'one' //ranSelector(chordList2) //<---- starting chord

  chordOrder = [chord]
  let numChords = parseInt(document.getElementById('numChords').value)
  for (let i = 1; i< numChords;i++){
    chord = ranSelector(nextObj[chord])
    if(chordOrder.indexOf(chord) != -1){
      chord = ranSelector(nextObj[chord])
    }//excludes repeats
    if ((i==numChords-1 && nextObj[chord].indexOf(chordOrder[0]) == -1) || chordOrder.indexOf(chord) != -1){ //<-- excludes repeats
      chordOrder = []
      progRetryCount++
      if(progRetryCount < 1000){
        chordProgression()
      }else{
        document.getElementById('chartDiv').innerText = 'No progression found, please select less restrictive settings'
        document.getElementById('chartDiv').style.color = 'red'
        document.getElementById('chartDiv').style.fontSize = '18px'
      }
      return
    }
    chordOrder.push(chord)
  }
  orderChords(chordOrder)
}

let optimizeRetryCounter = 0
function optimize(){
  let progComboList = []
  
  let strength = document.getElementById('smoothStrength').value
  let calc = document.getElementById('smoothCalc').value
  let ref = document.getElementById('smoothRef').value
  let direction = document.getElementById('smoothDirection').value
  let chordGen = document.getElementById('chordGen').value
  if(strength == 'Off'){
    return
  }
  strength = parseInt(strength)
  
  //1 Find optimal combo of pre-generated shapes
  //Step 1.1: Iterate through each chord shape and get its root coords, and its Average, High Note/or root (Completed in above function)
   //(Completed in above function)
  //Step 1.2: Create list of all combos of chord shapes
  
  /*let minFret = JSON.parse(progComboList[0][0])[3]
  let maxFret = JSON.parse(progComboList[0][0])[4]
  let rootCoord = JSON.parse(progComboList[0][0])[5]
  let avgCoord = JSON.parse(progComboList[0][0])[6]
  let highCoord = JSON.parse(progComboList[0][0])[7]*/
  
  let refIndex = parseInt(calc)
  
  let minFretSetting = parseInt(document.getElementById("minFretSetting").value)
  let maxFretSetting = parseInt(document.getElementById("maxFretSetting").value)
  
  let indvRefCoord
  let overallRefCoord
  let coordDiffDist
  let coordDiffFret
  let minCoordDiffFret = 10000
  let minCoordDiffDist = 10000
  let maxCoordDiffFret = 0
  
  let minMaxFretDifferent = 10000
  let optimalProgression

  if(ref == 'middle'){
    //get the [refIndex](high, avg, or root) coord of the middle of the fretboard
    if(refIndex == 7){overallRefCoord = ([(minFretSetting + maxFretSetting)/2,openStrings.length-2])}
    if(refIndex == 6){overallRefCoord = ([(minFretSetting + maxFretSetting)/2,(openStrings.length-2)/2])}
    if(refIndex == 5){overallRefCoord = ([(minFretSetting + maxFretSetting)/2,0.5])}
  }
  
  function addOptions(addList,chordIndex){
    let tempList = []
    if(chordIndex == 0 && ref == 'first'){
      for(let j = 0; j<addList.length; j++){
        progComboList.push([addList[j]])
      }
      return
    }
    if(chordIndex == 0 && ref == 'middle'){
      for(let j = 0; j<addList.length; j++){
        if(strength - Math.abs(overallRefCoord[0]-addList[j][refIndex][0]) >= 0){
          progComboList.push([addList[j]])
        }
      }
      return
    }
    if(ref == 'middle'){
      for(let i = 0; i<progComboList.length; i++){
        for(let j = 0; j<addList.length; j++){
          if(strength - Math.abs(overallRefCoord[0]-addList[j][refIndex][0]) >= 0){
            tempList.push(progComboList[i].concat(addList[j]))
          }
        }
      }
    }
    if(ref == 'first'){
      for(let i = 0; i<progComboList.length; i++){
        for(let j = 0; j<addList.length; j++){
          //overallRefCoord = JSON.parse(progComboList[j][0])[refIndex]
          if(strength - Math.abs(progComboList[i][0][refIndex][0]-addList[j][refIndex][0]) >= 0){
            tempList.push(progComboList[i].concat([addList[j]]))
          }
        }
      }
    }
    progComboList = tempList
  }
  
  

  for(let i = 0; i < snapShot.length ; i++){
    addOptions(snapShot[i],i)
  }
  if(progComboList.length == 0){
    console.log('No optimal progression found, restarting')
    if(optimizeRetryCounter == 5){
      document.getElementById('chartDiv').innerText = 'No optimized progression found within those parameters, please select less restrictive settings'
      document.getElementById('chartDiv').style.color = 'red'
      document.getElementById('chartDiv').style.fontSize = '18px'
      return
    }
    optimizeRetryCounter ++
    diatonicChords()
    chordProgression()
    optimize()
  }
  optimalProgression = ranSelector(progComboList)
  
  
  
  for(let z = 0; z< optimalProgression.length; z++){
    //chordInput[0], coords[9], diatonicNotes[1], answerNotes[10]
    //colorDiatonicChords (chordInput, coords, diatonicNotes, answerNotes)
    colorDiatonicChords (optimalProgression[z][0],optimalProgression[z][9],optimalProgression[z][1],optimalProgression[z][10])
  }
  
  //If meets criteria re-gen visuals
  //Caveat - Same Settings + Same Random Progression will result in the same optimized output (not sure how prevelant this will be yet)
  
  //2 If the above can't get a model to meet the criteria, try transposing existing shapes
  //Step 2.1 Find the problem children from above
  //Step 2.2 Manually cycle shape across tolerance range on fretboard to see if it fits the diatonic notes
  //Step 2.3 Select best model. If meets criteria, replace and re-gen
  
  //3 If the above can't get a model to meet the criteria, generate our own shapes
  //Step 3.1 Find the problem children from above
  //Step 3.2 Define how to make "feasible" chord shapes
    //Find all roots in strength range
    //Find all barre chord shapes that meet the settings (might need to define shapes that WONT work to manually exclude)
    //Pick the best one (or random?)
  //Step 3.3 Select best model. If meets criteria, replace and re-gen
  
  //Thoughts - how to define how far to push the 'soft' goals, & how to choose when conflicting (standardized metrics?)
}

// get setting parameters
document.getElementById("settingsSubmit").addEventListener("click", function(e) {
  // and then, stop the default action.
  console.clear()
  e.preventDefault();
  resetVisuals()
  diatonicChords()
  chordProgression()
  optimize()
});

console.clear()
resetVisuals()
diatonicChords()
chordProgression()
optimize()

//turn cells white when clicked (For chord shape screenshots)
var tables = document.querySelector('#chartDiv')
tables.addEventListener('click', function(e) {
  var td = e.target

  if(td.style.background != 'white' && td.tagName == 'TD'){
    td.style.background = 'white'
    td.style.color= "gray"
  }
})