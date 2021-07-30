var mario, mario_animation,mario_collided;
var obstacle, obstacle_animation;
var bg, background_image;
var invisibleWall;
var obstacle, obstacle_animation, obstacleGroup;
var brick, brickImage, brickGroup;
var gameState = "play";
var restart, gameOver, restartImage, gameOverImage;
var mario_sound, die_sound, jump_sound, checkPoint_Sound;
var score =0;

function preload(){
  background_image = loadImage("bg.png");
  mario_animation = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  obstacle_animation = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  brickImage = loadImage("brick.png");
  mario_collided = loadAnimation("collided.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  mario_sound = loadSound("super-mario.mp3");
  die_sound = loadSound("die.mp3");
  jump_sound=loadSound("jump.mp3");
  checkPoint_Sound =loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(600,400);
  bg = createSprite(0,40,600,400);
  bg.scale=1.9;
  bg.addImage(background_image);
  
  
  mario = createSprite(20,230);
  mario.addAnimation("mario_running",mario_animation);
  mario.addAnimation("mario_collided", mario_collided);
  mario.scale = 1.5;
  
  invisibleWall = createSprite(300,305,600,20);
  invisibleWall.visible=false;
  
  restart = createSprite(300,200);
  restart.addImage(restartImage);
  restart.scale=0.5;
  
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImage);
  gameOver.scale=0.8;
  
  obstacleGroup = new Group();
  brickGroup = new Group();
  
  mario_sound.loop();
  
}

function draw(){
  
  if(gameState === "play"){
    
    bg.velocityX=-4;
    if(bg.x<0){
      bg.x = bg.width/2;
    }

    if(keyDown("space")){
      mario.velocityY = -12;
      jump_sound.play();
    }
    mario.velocityY += 0.8;

    mario.collide(invisibleWall);

    if(obstacleGroup.isTouching(mario)){
      mario.changeAnimation("mario_collided",mario_collided);
      mario.velocityY =0;
      mario_sound.stop();
      die_sound.play();
      gameState = "end";
    }
    
    if(brickGroup.isTouching(mario)){
      mario.velocityY = 0;
    }

    spawnObstacle();
    spawnBrick();
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score % 100 === 0){
      checkPoint_Sound.play();
    }
    
    restart.visible= false;
    gameOver.visible=false;
    
  } else if(gameState === "end"){
     bg.velocityX=0;
     brickGroup.setVelocityXEach(0);
     obstacleGroup.setVelocityXEach(0);
     brickGroup.setLifetimeEach(-1);
     obstacleGroup.setLifetimeEach(-1);
     restart.visible= true;
     gameOver.visible=true;
    
     if(mousePressedOver(restart)){
       gameState="play";
       mario.changeAnimation("mario_running",mario_animation);
       mario_sound.loop();   
       brickGroup.destroyEach();
       obstacleGroup.destroyEach();
       score=0;
     }
  }
  drawSprites();
  textSize(20);
  text("Score : " + score, 10,40);
}

function spawnObstacle(){
  if(frameCount% 150 === 0){
    obstacle = createSprite(610,265);
  obstacle.addAnimation("obstacle", obstacle_animation);
    obstacle.velocityX= -4;
    obstacle.scale = 1.2;  
    obstacle.lifeTime = 125;
    obstacleGroup.add(obstacle);
  }
}

function spawnBrick(){
  if(frameCount % 100 === 0){
    brick = createSprite(610,200);
    brick.addImage(brickImage);
    brick.velocityX= -4;
    brick.scale=2;
    brick.y = Math.round(random(50,200)); 
    brickGroup.add(brick);
    gameOver.depth = brick.depth+1;
    restart.depth = brick.depth+1;
  }
}