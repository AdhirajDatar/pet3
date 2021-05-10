var dog, happyDog, sadDog, database, foodS, foodStock;

var feed, addFood;

var foodObj;

var fedTime, lastFed;

var gameState

var bed, bath, garden;

var currentTime;

function preload()
{
  dog1 = loadImage('images/dogImg.png');
	hdog = loadImage('images/dogImg1.png');
  bed = loadImage('images/Bed Room.png');
  bath = loadImage('images/Wash Room.png');
  garden = loadImage('images/Garden.png');
  sadDog = loadImage('images/Lazy.png');
}

function setup() {
  createCanvas(500,500);

  feed = createButton("Khana Khilao");
  feed.position(500,120);
  feed.mousePressed(feedDog);

  addFood = createButton("Khana Bharo");
  addFood.position(600,120);
  addFood.mousePressed(addFoods);

  dog = createSprite(250,250);
  dog.addImage(dog1);
  dog.scale = 0.08;

  foodObj = new Food();

  database = firebase.database();

  foodStock= database.ref('FOOD');
  foodStock.on ("value",readStock);

  getState()

  

  
  
}


function draw() {  

  background(rgb(46, 139, 87));

  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text(" LAST FED : " + lastFed%12 + "PM" , 350 ,30)
  }
  else if (lastFed == 0){
    text("Last Fed : 12 AM ", 350 , 30);
  }
  else{
    text (" Last Fed :"+lastFed+"AM", 350, 30);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data)
  {
    lastFed = data.val();
  })

if(gameState != "Hungry"){
  feed.hide();
  addFood.hide(); 
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog);
}

  currentTime = hour()
  console.log(currentTime)
  if (currentTime === lastFed+1) {
    foodObj.gardenFun();
    writeState("playing")
  }else if(currentTime === lastFed+2){
    foodObj.bedroom();
    writeState("sleeping")
  }else if (currentTime > (lastFed+2) && currentTime <= (lastFed+4)){
    foodObj.bath()
    writeState("bathing")
  }else{
    writeState("Hungry")
    foodObj.display()
  }
  

  drawSprites();
}

function feedDog(){
    dog.addImage(hdog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
       FOOD: foodObj.getFoodStock(),
      FeedTime: hour()
    })
}

function addFoods(){
  foodS = foodS+1
  database.ref('/').update({
    FOOD : foodS
  })
}

function readStock(data){
     foodS =  data.val();
     foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x = 0
  }
  else{
    x = x-1;
  }
  database.ref('/').update({FOOD:x})
  
}


function getState(){
database.ref('gameState').on("value", function(data){
  gameState = data.val();
})
}

function writeState(y){
    database.ref('/').update({gameState:y})
}

