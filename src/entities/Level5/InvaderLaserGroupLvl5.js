import InvaderLaser5 from "./InvaderLaserLvl5"

// SET XY OF THIS GROUP SO THAT IT DOES NOT COLLIDE WITH MOVING OBJECTS

export default class InvaderLaserGroup5 extends Phaser.Physics.Arcade.Group {
  constructor(scene, startX, startY) {
    super(scene.physics.world, scene, { runChildUpdate: true });

    this.createMultiple({
      frameQuantity: 10,
      key: "laser",
      active: false,
      visible: false,
      classType: InvaderLaser5,
      setXY: {x: startX, y: startY}
    });
  }

  fireBullet(x, y) {
    var laser = this.getFirstDead(false);

    if (laser) {
      laser.fireNormal(x, y);
    }

    laser = this.getFirstDead(false);

    if(laser) {
      laser.fireFast(x, y);
    }
  }
}
