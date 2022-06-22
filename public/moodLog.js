// const dayjs = require('dayjs')
// let now = new Date();

const inputDate = document.querySelectorAll("input[type=date]")
const inputTime = document.getElementById("time")

// let formDate = dayjs().format('YYYY-MM-DD')
// let formTime = dayjs().format('hh:mm A')


Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

inputDate.forEach(inputDo => {
    inputDo.value = new Date().toDateInputValue()
})

inputTime.value = ("0" +  new Date().getHours()).slice(-2) + ":" + ("0" +  new Date().getMinutes()).slice(-2)

document.querySelector('body').style.backgroundColor = 'red'




