// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {

  //! login
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  //! signup
  app.post("/api/signup", function (req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //! logout
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //! user_data
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //! add-recipe
  app.post("/api/add-recipe", function (req, res) {
    console.log("req.user", req.body);

    db.Recipe.create({
      title: req.body.title,
      description: req.body.description,
      instructions: req.body.instructions,
      UserId: req.user.id
    })
    .then(function (data) {
      
      let Array = [];
      
      for (let i = 0; i < req.body.ingredients.length; i++ ) {
        
        let qty = req.body.ingredients[i].qty;
        let measurement = req.body.ingredients[i].measurement;
        let name = req.body.ingredients[i].name;

        Array.push({
          qty: qty,
          measurement: measurement,
          name: name,
          RecipeId: data.dataValues.id
        })
      }

      db.Ingredient.bulkCreate(Array);

    }).then((data) => {
      console.log('hit', data);
      res.sendStatus(200);
    })
    .catch(function (err) {
      console.log({err});
      res.status(401).json(err);
    });
  });

  //! add-ingredient
  // app.post("/api/add-ingredient", function (req, res) {
  //   db.Ingredient.create({
  //     qty: req.body.qty,
  //     measurement: req.body.measurement,
  //     ingredient: req.body.ingredient
  //   })
  //   .then(function () {
        
  //     })
  //     .catch(function (err) {
  //       res.status(401).json(err);
  //     });;
  // });

};
