const user = require("./models/user");
const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015

let todaysDate =  dayjs().format('YYYY-MM-DD')

module.exports = function(app, passport, db) {

const {ObjectId} = require('mongodb') //gives access to _id in mongodb

//Collection Names
const medCollection = 'medications'
const moodCollection = 'moodLog'
const apptCollection = 'appointments'


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
          console.log(result)

         

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
        console.log(result)
       

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
    db.collection(medCollection).find({name: req.user.local.email}).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      // let medCollection = result.filter(doc => doc.name === req.user.local.email)

      res.render('medication.ejs', {
        user : req.user, 
        medications: result, 
        todaysDate
        
      })
    })
});


app.post('/addMedication', (req, res) => {
  db.collection(medCollection).insertOne({name: req.body.name, medicine: req.body.medicine, purpose: req.body.purpose, startDate: req.body.startDate, recurrence: req.body.recurrence, doseTime: req.body.doseTime, nextDose: req.body.nextDose, medNotes: req.body.medNotes, tookMed: false}, (err, result) => {
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
  db.collection(moodCollection).find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    //let myPlants = result.filter(doc => doc.name === req.user.local.email)

    res.render('moodLog.ejs', {
      user : req.user, 
      moodLog: result
    
    })
  })
});


app.post('/addMood', (req, res) => {
  db.collection(moodCollection).insertOne({date: req.body.date,
      time: req.body.time, 
      mood: req.body.mood,  
      medsTaken: req.body.medsTaken, 
      activities: req.body.activities, 
      moodNotes: req.body.moodNotes}, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/moodLog')
  })
})


//Appointment Log ======================================================

app.get('/appointments', isLoggedIn, function(req, res) {
  db.collection(apptCollection).find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
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
      complete: false}, (err, result) => {
    if (err) return console.log(err)
    //console.log(result)
    console.log('saved to database')
    res.redirect('/appointments')
  })
})

//Insights Page ======================================================

app.get('/insights', isLoggedIn, function(req, res) {
  db.collection(apptCollection).find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    //let myPlants = result.filter(doc => doc.name === req.user.local.email)

    res.render('insights.ejs', {
      user : req.user, 
      appointments: result
    
    })
  })
});


app.post('/insights', (req, res) => {
  db.collection(apptCollection).insertOne({date: req.body.date,
      time: req.body.time, 
      location: req.body.location,  
      appointmentType: req.body.appointmentType, 
      providerName: req.body.providerName, 
      reasonNotes: req.body.reasonNotes, 
      complete: false}, (err, result) => {
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
