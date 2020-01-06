// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

let day = date.getDay();
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to todo list"
});
const item2 = new Item({
  name: "click the + button to add item "
});
const item3 = new Item({
  name: "<-- hit this to remove item"
});

const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List", listSchema);


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set("view engine", "ejs");


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {

});
//let items = ["buy food", "Cook food", "Eat food"];
//let workItems = [];

app.get("/", function(req, res) {



  Item.find({}, function(err, founditems) {

    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("list was added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        LISTTITTLE: day,
        LIST: founditems
      });
    }

  });



});
app.get("/:customListName", function(req, res) {

  const custListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: custListName
  }, function(err, found) {
    if (err) {
      console.log(err);
    } else if (!found) {
      const list = new List({
        name: custListName,
        items: defaultItems
      });

      list.save();
      res.redirect("/" + custListName);
    } else {
      res.render("list", {
        LISTTITTLE: found.name,
        LIST: found.items
      });

    }
  });


});
app.post("/", function(req, res) {

  console.log(req.body);
  let newitems = req.body.newItem;
  const listname = req.body.list;


  /**
    if (req.body.list === "Work") {
      let item = new Item({
        name: newitems
      });
      item.save();
      res.redirect("/work");
      **/
  //  }
  let item = new Item({
    name: newitems
  });
  if (listname === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listname
    }, function(err, foundit) {
      if (!err) {
        foundit.items.push(item);
        foundit.save();
        res.redirect("/" + listname);
      }
    });
  }



});

/**
app.get("/work", function(req, res) {

  res.render("list", {
    LISTTITTLE: "Work List",
    LIST: workItems
  });

});
app.post("/work", function(req, res) {
  let it = req.body.newItem;
  workItems.push(it);
  res.redirect("/work");
});

**/
app.get("/about", function(req, res) {
  res.render("about");

});
app.post("/delete", function(req, res) {
  const checkeditemID = req.body.checked;
  const listname = req.body.listname;
  if(listname === day){Item.findByIdAndRemove(checkeditemID, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("item deleted");
      res.redirect("/");
    }
  });}else{
    List.findOneAndUpdate({name: listname}, {$pull: {items: {_id : checkeditemID}}}, function(err, one){
      if(!err){
        res.redirect("/"+listname);
      }
    });
  }


});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
