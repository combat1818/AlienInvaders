import PlayerLaserGroup from "../entities/Level1/PlayerLaserGroup";
import InvaderLaserGroup from "../entities/Level1/InvaderLaserGroup";
import InvaderGroup from "../entities/Level1/InvaderGroup";
import Player from "../entities/Level1/Player";

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });

    //Objects
    this.player;
    this.laserGroup;
    this.invaderLaserGroup;
    this.invadersGroup1;
    this.invadersGroup2;
    this.background;
    this.inputKeys;
    this.cursors;
    this.initialInvaders=16
    this.invadersLeft = this.initialInvaders;
    this.initialWaves=2
    this.actualWaves = this.initialWaves; // =n actual waves=n+1 zrobione: 1,2

    //Game Options
    this.movementSpeed;
    this.canInvaderShoot;
    this.colliderActive;
    this.canPlayerShoot=0

    //Sounds
    this.invaderLaserSound;
    this.invaderDieSound;
    this.laserSound;
    this.gameOverSound
    this.nextStageSound
  }

  preload() {}

  create() {
    //Initialize input keys
    this.cursors = this.input.keyboard.createCursorKeys();
    //Set world bounds
    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    //Scrolling Background
    this.background = this.add
      .tileSprite(
        0,
        0,
        window.innerWidth,
        window.innerHeight,
        "scrollBackground"
      )
      .setScale(2);



    //Objects
    this.laserGroup = new PlayerLaserGroup(this, -300, -300);
    this.createNewWave();
    this.invaderLaserGroup = new InvaderLaserGroup(this,-500,500);

    //Game Options
    this.movementSpeed = 500;
    this.canMove = 1;
    this.canInvaderShoot = 1;
    this.colliderActive = true;

    //Sounds
    this.laserSound = this.sound.add("laserSound");
    this.invaderDieSound = this.sound.add("invaderDieSound");
    this.gameOverSound = this.sound.add("gameOverSound");
    this.invaderLaserSound = this.sound.add("invaderLaserSound");
    this.nextStageSound=this.sound.add("nextStageSound")

    //Add player ship, input listeners, collide ship with world bounds
    this.player=new Player(this,this.cameras.main.width / 2,this.cameras.main.height-50)
    this.player.addCollider()
    this.addEvents();

    //Invader shoot events
    var timer1 = this.time.addEvent({
      delay: 1500, // ms
      callback: () => {
        this.invadersGroup1.fireInvaderLaser();
      },
      args: [this],
      loop: true,
    });
    var timer2 = this.time.addEvent({
      delay: 2000, // ms
      callback: () => {
        this.invadersGroup2.fireInvaderLaser();
      },
      args: [this],
      loop: true,
    });

    //InvadersGroup-PlayerLaser colliders
    this.addColliders();
  }

  addEvents() {
    // Fire Laser on Spacedown or Enterdown
    this.inputKeys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
    ];
  }

  createNewWave() {
    this.invadersGroup1 = new InvaderGroup(this, 0, 0, -200, -200);
    this.invadersGroup2 = new InvaderGroup(this, 120, 100, window.innerWidth+200, -200);

    this.invadersGroup1.setInvaders();
    //Set initial velocity 
    this.invadersGroup1.setVelocityX(-100);

    this.invadersGroup2.setInvaders();
    //Set initial velocity 
    this.invadersGroup2.setVelocityX(100);
  }

  addColliders() {
    //PlayerLasers-Invaders Collider
    this.physics.add.collider(
      this.invadersGroup1,
      this.laserGroup,
      (invader, laser) => {
        this.invaderDieSound.play();
        //invader.destroy();
        //invader.setActive(false)
        //invader.setVisible(false)
        invader.setActive(false)
        console.log(invader.active)
        invader.disableBody(true,true)
        laser.setX(-100) //SET LASERS X AFTER COLLISION- AVOID DOUBLE HIT

        this.invadersLeft--;
      }
    );
  }

  update(time, delta) {
    //Scroll Background
    this.background.tilePositionY -= 1.5;

    //Fire Laser
    this.inputKeys.forEach((key) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        if(this.canPlayerShoot){
          this.laserGroup.fireBullet(this.player.x, this.player.y - 20);
          this.laserSound.play();
        }
      }
    });

    //Move Player Ship
    if (this.player.canMove && this.cursors.left.isDown)
    this.player.setVelocityX(-this.movementSpeed);
    else if (this.player.canMove && this.cursors.right.isDown)
      this.player.setVelocityX(this.movementSpeed);
    else this.player.setVelocityX(0);

    //Move InvadersGroup 1
    if (
      this.invadersGroup1.countActive() &&
      this.invadersGroup1.getFirstAlive().x < 0
    )
      this.invadersGroup1.setVelocityX(100);
    if (
      this.invadersGroup1.countActive() &&
      this.invadersGroup1.getLast(true).x > window.innerWidth
    )
      this.invadersGroup1.setVelocityX(-100);

    //Move InvadersGroup 2
    if (
      this.invadersGroup2.countActive() &&
      this.invadersGroup2.getFirstAlive().x < 0
    )
      this.invadersGroup2.setVelocityX(100);
    if (
      this.invadersGroup2.countActive() &&
      this.invadersGroup2.getLast(true).x > window.innerWidth
    )
      this.invadersGroup2.setVelocityX(-100);

    //Win Condition
    if (!this.invadersLeft) {
      this.invadersLeft = this.initialInvaders;
      this.canPlayerShoot=0
      this.laserGroup.getChildren().forEach(child=>{
        child.setActive(false)
        child.setVisible(false)
        child.body.reset(window.innerWidth+400,-300)
      })
      if (this.actualWaves > 0) {
        this.actualWaves--;
        this.createNewWave();
        this.addColliders()
      } else {
        this.nextStageSound.play()
        setTimeout(()=>{
          this.actualWaves=this.initialWaves
          this.scene.start("Level2");
        },3000)
      }
    }
  }
}
