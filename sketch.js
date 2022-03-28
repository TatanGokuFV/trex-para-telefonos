var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver;
var gameOverImg;

var restart;
var restartImg;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud,cloudImg;

var score;
var obstacle;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");

  groundImage = loadImage("ground2.png");
  cloudImg=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png")
  obstacle2=loadImage("obstacle2.png")
  obstacle3=loadImage("obstacle3.png")
  obstacle4=loadImage("obstacle4.png")
  obstacle5=loadImage("obstacle5.png")
  obstacle6=loadImage("obstacle6.png")
  
}

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  
  //crear sprite de trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  //crear sprite de suelo
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  //crear sprite de suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //generar números aleatorios
  var rand =  Math.round(random(1,100))
  console.log(rand)
  score=0;

  //Grupos de objetos 
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //objeto restart
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale=0.5;

  //objeto game over
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
}

function draw() {
  //establecer color de fondo
  background(180);
  
  text("score: "+score,width-85,50);
  gameOver.visible=false;
  restart.visible=false;
  if(gameState === PLAY){
    ground.velocityX = -(4+score/100);
    score=score+Math.round(getFrameRate()/30);
    console.log(getFrameRate());
  if(score> 0 && score% 100===0){

    checkpointSound.play();

  }

    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(touches.lenght>0 || keyDown("UP_ARROW") && trex.y >=height-40) {
      trex.velocityY = -10;
      jumpSound.play();
      touches=[]
    }
    
    trex.velocityY = trex.velocityY + 0.8

  spawnObstacles();
  spawnClouds()
  if(obstaclesGroup.isTouching(trex)){
    //trex.velocityY = -12;
    jumpSound.play();
    gameState = END;
    dieSound.play()
  }
}
   
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;
  
  trex.changeAnimation("collided", trex_collided);

  ground.velocityX = 0;
  trex.velocityY = 0
  
 
  
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
  
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
  
  if(touches.lenght>0 || keyDown("space")){
    reset();
    touches=0;
  }
}
  
  
  
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
gameState = PLAY;
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
trex.changeAnimation("running",trex_running);
score = 0;
}

function spawnClouds(){
 if(frameCount%60===0){
 cloud=createSprite(width+20,height-300,40,10);
 cloud.addImage("cloud",cloudImg);
 cloud.scale=random(0.4,0.6);
 cloud.y=Math.round(random(20,90));
 cloud.velocityX=-3;
 cloud.lifetime=605;
 cloud.depth=trex.depth;
 trex.depth=trex.depth+1;
 cloudsGroup.add(cloud);
 }
}

function spawnObstacles(){
  var randomObstacles = Math.round(random(60,110));
  if(frameCount % randomObstacles === 0){
  obstacle=createSprite(600,height-30,10,40);
  obstacle.velocityX=-(6+score/100);
  var rand=Math.round(random(1,6));
  switch(rand){
    case 1: obstacle.addImage(obstacle1);
    break;
    case 2: obstacle.addImage(obstacle2);
    break;
    case 3: obstacle.addImage(obstacle3);
    break;
    case 4: obstacle.addImage(obstacle4);
    break;
    case 5: obstacle.addImage(obstacle5);
    break;
    case 6: obstacle.addImage(obstacle6);
    break;
    default:break;

}
obstacle.scale=0.4;
obstacle.lifetime=210;
obstaclesGroup.add(obstacle);
  }
  }
  