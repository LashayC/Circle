const user = require("./models/user");
const dayjs = require('dayjs') //date manipulation
const customParseFormat = require('dayjs/plugin/customParseFormat') //lets you give dates and format them
dayjs.extend(customParseFormat)
const advancedFormat = require('dayjs/plugin/advancedFormat') //extends date formats able to be used
dayjs.extend(advancedFormat)
var weekOfYear = require('dayjs/plugin/weekOfYear');// lets you give week of year
const { sortBy } = require("lodash");
dayjs.extend(weekOfYear)

let todaysDate =  dayjs().format('YYYY-MM-DD')
//console.log('todays big oldate is', todaysDate)
module.exports = function(app, passport, db) {

const {ObjectId} = require('mongodb') //gives access to _id in mongodb

//Collection Names =============================================================
const medCollection = 'medications'
const moodCollection = 'moodLog'
const apptCollection = 'appointments'

//Route functions ===============================================================


// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
         //req.user if user is logged in and makigng a request, you can see everything bout that user also passed in.. Good for making profile pgs
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection(medCollection).find().toArray((err, result) => {
          if (err) return console.log(err)
          //console.log(result)

         

          res.render('profile.ejs', {
            user : req.user
    
          })
        })
    });

  //   app.get('/profile', isLoggedIn, function(req, res) {
  //     db.collection('plants').find().toArray((err, result) => {
  //       if (err) return console.log(err)
  //       console.log(result)

  //       let bigPlants = result.filter(doc => doc.plantInfo.name === req.user.local.email)

  //       res.render('profile.ejs', {
  //         user : req.user, 
  //         plants: result,
  //         bigPlants: myPlants
  //       })
  //     })
  // });

    // HOME SECTION =================================
    
    app.get('/home', isLoggedIn, function(req, res) {
      db.collection(medCollection).find().toArray((err, result) => {
        if (err) return console.log(err)
        //console.log(result)
       

        res.render('home.ejs', {
          user : req.user
        })
      })
  });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// Home Page Routes ===============================================================

   

    // app.post('/careUpdate', (req, res) => {
    //   db.collection(medCollection).updateOne({ _id: ObjectId(req.body.plantID)},
    //   {
    //     $push: {
    //       plantCare:{
    //       water: req.body.water, 
    //       comments: req.body.comments,
    //       careDate: req.body.careDate,
    //       status: req.body.status, 
    //       waterReminderDate: req.body.waterReminderDate
    //       }
    //     }
    //   },
    //    (err, result) => {
    //     if (err) return console.log(err)
    //     //console.log(result)
    //     console.log('saved to database')
    //     res.redirect('/home')
    //   })
    // })


    // app.delete('/deletePlant', (req, res) => {
    //   db.collection('plants').findOneAndDelete({ _id: ObjectId(req.body.theID)}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

 
// Medication Section ==============================================

app.get('/medication', isLoggedIn, function(req, res) {
  db.collection(medCollection).find({createdBy: ObjectId(req.user._id)}).toArray((err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    // let medCollection = result.filter(doc => doc.name === req.user.local.email)
    //medication recurrence functions Daily/ Weekly/ Monthly
    let todaysMeds = []
    

      for(let i = 0; i < result.length; i++){
        // result[i].startDate
        // result[i].endDate
        //console.log('all enddates',result[i].endDate)
        // let dailyList = []
        // let weeklyList = []
        // let monthlyList = []

        console.log(dayjs(result[i].startDate, 'YYYY-MM-DD').format('dddd') === dayjs().format('dddd'))

        if( result[i].recurrence == 'daily' && result[i].endDate == '' && todaysDate >= result[i].startDate){
          //conditional for daily recurrence, no end date, and todays date greater than start date.
          todaysMeds.push(result[i].medicine)

        }else if(result[i].recurrence == 'daily' && todaysDate >= result[i].startDate && todaysDate <= result[i].endDate ){
          todaysMeds.push(result[i].medicine)

        }else if( result[i].recurrence == 'weekly' && result[i].endDate == '' && todaysDate >= result[i].startDate && dayjs(result[i].startDate, 'YYYY-MM-DD').format('dddd') === dayjs().format('dddd')){
          //conditional for if recurrence weekly, no endate, todays date greater than start date, and todays day of the week is same as one in start date
          todaysMeds.push(result[i].medicine)

        }else if(result[i].recurrence == 'weekly' && todaysDate >= result[i].startDate && todaysDate <= result[i].endDate && dayjs(result[i].startDate, 'YYYY-MM-DD').format('dddd') == dayjs().format('dddd')){

          todaysMeds.push(result[i].medicine)
          
        }else if(result[i].recurrence == 'daily' && todaysDate >= result[i].startDate && todaysDate <= result[i].endDate ){
          todaysMeds.push(result[i].medicine)

        }else if( result[i].recurrence == 'monthly' && result[i].endDate == '' && todaysDate >= result[i].startDate && dayjs(result[i].startDate, 'YYYY-MM-DD').format('D') === dayjs().format('D')){
          //conditional for if recurrence monthly, no endate, todays date greater than start date, and todays day of month is same as one in start date
          todaysMeds.push(result[i].medicine)

        }else if(result[i].recurrence == 'monthly' && todaysDate >= result[i].startDate && todaysDate <= result[i].endDate && dayjs(result[i].startDate, 'YYYY-MM-DD').format('D') == dayjs().format('D')){

          todaysMeds.push(result[i].medicine)
          
        }
        
      }
      console.log('todays medications', todaysMeds)

      console.log('todays big ole date', dayjs().format('YYYY-MM-DD'))
      console.log('is dayjs equal to written date', dayjs().format('YYYY-MM-DD') == '2022-06-19')
      console.log('is dayjs greater than yesterdays written date', dayjs().format('YYYY-MM-DD') > '2022-06-18')
      console.log('is dayjs less than tomorrows written date', dayjs().format('YYYY-MM-DD') < '2022-06-20')
      console.log('add days to day.js check: returns 19 + 4 returns 23', dayjs().add(4, 'day').format('YYYY-MM-DD'))
      console.log('check if dayjs can take given date and pull day of week from it', dayjs('2022-06-15', 'YYYY-MM-DD').format('dddd'))
      console.log('check if dayjs can take todays date and pull day of week from it', dayjs().format('dddd'))

      res.render('medication.ejs', {
        user : req.user, 
        medications: result, 
        todaysMeds
        
      })
    })
});


app.post('/addMedication', (req, res) => {
  db.collection(medCollection).insertOne({name: req.body.name, 
    medicine: req.body.medicine, 
    purpose: req.body.purpose, 
    startDate: req.body.startDate, 
    endDate: req.body.endDate, 
    recurrence: req.body.recurrence, 
    dosage: req.body.dosage, 
    medNotes: req.body.medNotes, 
    tookMed: false, 
    createdBy: req.user._id}, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/medication')
  })
})

app.put('/updateTookMedTrue', (req, res) => {
  db.collection(medCollection)
  .findOneAndUpdate({ _id: ObjectId(req.body.postObjectID)}, 
  {
    $set: {
      tookMed: true
    }
  },
   {
    sort: {_id: -1}, //Sorts documents in db ascending (1) or descending (-1)
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/updateTookMedFalse', (req, res) => {
  db.collection(medCollection)
  .findOneAndUpdate({ _id: ObjectId(req.body.postObjectID)}, 
  {
    $set: {
      tookMed: false
    }
  },
   {
    sort: {_id: -1}, //Sorts documents in db ascending (1) or descending (-1)
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/deleteMed', (req, res) => {
  db.collection(medCollection).findOneAndDelete({ _id: ObjectId(req.body.postObjectID)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

//Mood Log ======================================================

app.get('/moodLog', isLoggedIn, function(req, res) {
  db.collection(moodCollection, medCollection).find({createdBy: ObjectId(req.user._id)}).toArray((err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    //let myPlants = result.filter(doc => doc.name === req.user.local.email)

    console.log('This is the result for Mood Collection AND Med Collection', result)

    console.log('user from db on moodLog', req.user)
    res.render('moodLog.ejs', {
      user : req, 
      moodLog: result
    
    })
  })
});


// app.post('/addMood', (req, res) => {
//   // let stressObj = JSON.stringify(req.body.stress)
//   let stressArray = req.body.stress.split(', ')
//   let energyArray = req.body.energy.split(', ')
//   let moodArray = req.body.mood.split(', ')
// // mood{'Happy': 5, 'Sad':1}

//   // console.log('stressObject', stressObj)
//   db.collection(moodCollection).insertOne({date: req.body.date,
//       time: req.body.time, 
//       mood: [moodArray],  
//       medsTaken: req.body.medsTaken, 
//       activities: req.body.activities, 
//       moodNotes: req.body.moodNotes,
//       stress: [stressArray],
//       energy: [energyArray],
//       sleep: req.body.sleep,
//       createdBy: req.user._id
//       }, (err, result) => {
//     if (err) return console.log(err)
//     //console.log(result)
//     console.log('saved to database')
//     res.redirect('/moodLog')
//   })
// })

app.post('/addMood', (req, res) => {
  // let stressObj = JSON.stringify(req.body.stress)
  // let stressArray = req.body.stress.split(', ')
  // let energyArray = req.body.energy.split(', ')
  // let moodArray = req.body.mood.split(', ')
// mood{'Happy': 5, 'Sad':1}

  // console.log('stressObject', stressObj)
  db.collection(moodCollection).insertOne({date: req.body.date,
      createdBy: req.user._id,
      sleep: req.body.sleep,
      mood: [],  
      stress: [],
      energy: [],
      }, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})


app.post('/updateMood', (req, res) => {
  db.collection(moodCollection).updateOne({date: req.body.date},
  {
    $push: {
     stress: req.body.stress,

     energy: req.body.energy
    }
  },
   (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})

app.post('/updateNotes', (req, res) => {
  db.collection(moodCollection).updateOne({date: req.body.date},
  {
    $set: {
      mood: req.body.mood,
      moodNotes: req.body.moodNotes
    }
  },
   (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})

app.post('/updateTookMed', (req, res) => {
  db.collection(moodCollection).updateOne({date: req.body.date},
  {
    $set: {
      medsTaken: req.body.medsTaken
    }
  },
   (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})

app.post('/updateActivities', (req, res) => {
  db.collection(moodCollection).updateOne({date: req.body.date},
  {
    $push: {
     activities: req.body.activities
    }
  },
   (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})



//Appointment Log ======================================================

app.get('/appointments', isLoggedIn, function(req, res) {
  db.collection(apptCollection).find({createdBy: ObjectId(req.user._id)}).toArray((err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    //let myPlants = result.filter(doc => doc.name === req.user.local.email)

    res.render('appointments.ejs', {
      user : req.user, 
      appointments: result
    
    })
  })
});


app.post('/addAppointments', (req, res) => {
  db.collection(apptCollection).insertOne({date: req.body.date,
      time: req.body.time, 
      location: req.body.location,  
      appointmentType: req.body.appointmentType, 
      providerName: req.body.providerName, 
      reasonNotes: req.body.reasonNotes, 
      complete: false,  
      createdBy: req.user._id}, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/appointments')
  })
})

//Insights Page ====================================================================
//isDoctor add plays off role in DB(added manually for now), 
//can set 

//Once roles are set, can either check inside conditional with 'isDoctor' callback or by doing if conditional within get that uses 'req.user.local.role

//if you want to use same route for dif roles.

//grab insights assoc w/ account
app.get('/insights', isLoggedIn, function(req, res) {
  //console.log(req.user.local.role)
  db.collection(moodCollection).find({createdBy: ObjectId(req.user._id)}).toArray((err, result) => {
    db.collection(medCollection).find({createdBy: ObjectId(req.user._id)}).toArray((err2, medResult) => {

    if (err) return console.log(err)
    //console.log('mood for insights', result.length)
    
    // Sleep Chart---------------------------------
    let sleepHours = []
    let sleepDates = []
    let monthLabel = dayjs().format('MMMM')
    
    for(let i = 0; i < result.length; i++){
      if (dayjs().format('YYYY-MM') === dayjs(result[i].date, 'YYYY-MM-DD').format('YYYY-MM')){
      sleepHours.push(result[i].sleep)
      sleepDates.push(dayjs(result[i].date, 'YYYY-MM-DD').format('DD'))
      }
    }
    console.log('this is sleepdays', sleepHours)
    console.log('this is sleep dates', sleepDates)


    // mood chart ----------------------------------------------------------
    // let sleepNumbers = []
    // dayjs('2018-06-27').week() // 26 //can get weeks of year.
    let moodDaysOfWeek = []
    let moodData =[]

    for(let i = 0; i < result.length; i++){
      if(23 === dayjs(result[i].date, 'YYYY-MM-DD').week() ){
        moodData.push(result[i].mood[0])
        moodDaysOfWeek.push(dayjs(result[i].date, 'YYYY-MM-DD').format('ddd'))
      }
    }
    console.log('this is the current week of the month', dayjs().week())
    console.log('this is the  week of the given month 2022-06-02', dayjs('2022-05-31', 'YYYY-MM-DD').week())
    console.log('this is moodDays of week and mood Data', moodDaysOfWeek, moodData)

    // Med Streak ----------------------------------------------------------
    let medStreak = 0

    for(let i = 0; i < result.length; i++){
      if(23 === dayjs(result[i].date, 'YYYY-MM-DD').week() && result[i].medsTaken == 'Yes'){
        medStreak += 1
      } 
    }
    console.log('How many days of meds week 23', medStreak)
    // Check In Streak ----------------------------------------------------------------------------


    // Average Mood --------------------------------------------------------------------------------
    let averageMood = 0
    let moodCount = 0
    let divMood = 0
    for(let i = 0; i < result.length; i++){
      if(23 === dayjs(result[i].date, 'YYYY-MM-DD').week() ){
        divMood += Number(result[i].mood[0])
        moodCount ++
      }

    }
    averageMood = Math.round(divMood / moodCount)
    // Math.round(averageMood)

    console.log('This is avg divMood and moodCount', divMood, moodCount)
    console.log('This is avg mood', averageMood)


    // Medication for Insights page-----------------------------------------
    let todaysMeds = []
    

    for(let i = 0; i < medResult.length; i++){
      // medResult[i].startDate
      // medResult[i].endDate
      //console.log('all enddates',medResult[i].endDate)
      // let dailyList = []
      // let weeklyList = []
      // let monthlyList = []

      console.log(dayjs(medResult[i].startDate, 'YYYY-MM-DD').format('dddd') === dayjs().format('dddd'))

      if( medResult[i].recurrence == 'daily' && medResult[i].endDate == '' && todaysDate >= medResult[i].startDate){
        //conditional for daily recurrence, no end date, and todays date greater than start date.
        todaysMeds.push(medResult[i].medicine)

      }else if(medResult[i].recurrence == 'daily' && todaysDate >= medResult[i].startDate && todaysDate <= medResult[i].endDate ){
        todaysMeds.push(medResult[i].medicine)

      }else if( medResult[i].recurrence == 'weekly' && medResult[i].endDate == '' && todaysDate >= medResult[i].startDate && dayjs(medResult[i].startDate, 'YYYY-MM-DD').format('dddd') === dayjs().format('dddd')){
        //conditional for if recurrence weekly, no endate, todays date greater than start date, and todays day of the week is same as one in start date
        todaysMeds.push(medResult[i].medicine)

      }else if(medResult[i].recurrence == 'weekly' && todaysDate >= medResult[i].startDate && todaysDate <= medResult[i].endDate && dayjs(medResult[i].startDate, 'YYYY-MM-DD').format('dddd') == dayjs().format('dddd')){

        todaysMeds.push(medResult[i].medicine)
        
      }else if(medResult[i].recurrence == 'daily' && todaysDate >= medResult[i].startDate && todaysDate <= medResult[i].endDate ){
        todaysMeds.push(medResult[i].medicine)

      }else if( medResult[i].recurrence == 'monthly' && medResult[i].endDate == '' && todaysDate >= medResult[i].startDate && dayjs(medResult[i].startDate, 'YYYY-MM-DD').format('D') === dayjs().format('D')){
        //conditional for if recurrence monthly, no endate, todays date greater than start date, and todays day of month is same as one in start date
        todaysMeds.push(medResult[i].medicine)

      }else if(medResult[i].recurrence == 'monthly' && todaysDate >= medResult[i].startDate && todaysDate <= medResult[i].endDate && dayjs(medResult[i].startDate, 'YYYY-MM-DD').format('D') == dayjs().format('D')){

        todaysMeds.push(medResult[i].medicine)
        
      }
      
    }


    // Consecutive day function ---------------------------------------------------------------------------------

    // let datesMood = result.map(el => dayjs(el.date, 'YYYY-MM-DD'))

    // console.log('This is the datesMood', datesMood)
    // let checkinStreak = 0

    // for(let i = 0; i < datesMood.length; i++){
    //   if(dayjs(datesMood[datesMood.length -1], 'YYYY-MM-DD').format('D'))
    // }

     let datesMood = result.map(el => el.date)

     console.log('These are unsorted dates', datesMood)

     datesMood.sort((a, b) => {return Date.parse(a) - Date.parse(b) });

     console.log('These are sorted dates', datesMood)
    console.log('This is the date for today', dayjs())

    let checkinStreak = 0

    for(let i = 0; i < result)
         
    res.render('insights.ejs', {
      user : req.user, 
      moodLog:result,
      sleepHours,
      sleepDates,
      monthLabel, 
      moodDaysOfWeek,
      moodData,
      medStreak,
      averageMood,
      todaysMeds: todaysMeds

    
    })
  })
  })
});


app.post('/insights', (req, res) => {
  //console.log(req.body)
  db.collection(apptCollection).insertOne({date: req.body.date,
      time: req.body.time, 
      location: req.body.location,  
      appointmentType: req.body.appointmentType, 
      providerName: req.body.providerName, 
      reasonNotes: req.body.reasonNotes, 
      complete: false, 
      createdBy: req.user._id }, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/insights')
  })
})



// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        let user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

// (Middleware) CHECKS FOR ROLE ON USER
function isDoctor(req, res, next){
    if(req.user.local.role === 'doctor'){
      return next()
    }
    res.redirect('/')
}

