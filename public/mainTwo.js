
const trash = document.getElementsByClassName("fa-trash");

const checkedOff = document.getElementsByClassName("fa-check-circle")

Array.from(checkedOff).forEach(function(element) {
      element.addEventListener('click', function(){
    
        const postObjectID = this.parentNode.parentNode.parentNode.id
        //console.log(`this ${postObjectID}`)
        const tookMeds = this.parentNode.parentNode.id

        // console.log(this,tookMeds == true)
        
        if(tookMeds == 'true'){
          
          fetch('updateTookMedFalse', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'postObjectID': postObjectID
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            window.location.reload(true)
          })
        
        }else if (tookMeds == 'false'){
           
          fetch('updateTookMedTrue', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'postObjectID': postObjectID
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            window.location.reload(true)
          })
        }
      
      
      });
});

// if (checkedOff == "no") {
//   fetch("crossedOut", {
//     method: "put",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       item: item,
//       checkedOff: checkedOff,
//     }),
//   })
//     .then((response) => {
//       if (response.ok) return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       window.location.reload(true);
//     });
// } else if (checkedOff == "yes") {
//   fetch("notCrossedOut", {
//     method: "put",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       item: item,
//       checkedOff: checkedOff,
//     }),
//   })
//     .then((response) => {
//       if (response.ok) return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       window.location.reload(true);
//     });
// } //else statement
// }); //event listener
// }); //forEach function




// Array.from(thumbDown).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//     fetch('messagesTDown', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg,
//         'thumbUp':thumbUp
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });


Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const postObjectID = this.parentNode.parentNode.parentNode.id

    fetch('deleteMed', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'postObjectID':postObjectID
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

