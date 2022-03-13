const SB = extend(BombBulletType, {});
SB.amage = 0;
SB.speed = 0;
SB.hitEffect = Fx.pulverize;
SB.lifetime = 10;
SB.speed = 10;
SB.splashDamageRadius = 60;
SB.instantDisappear = true;
SB.splashDamage = 130;
SB.killShooter = true;
SB.hittable = false;
SB.collidesAir = true;
SB.status = StatusEffects.burning;


const SC = extend(BasicBulletType, {});
SC.amage = 20;
SC.speed = 3;
SC.width = 7;
SC.height = 9;
SC.lifetime = 45;
SC.shootEffect = Fx.shootSmall;
SC.smokeEffect = Fx.shootSmallSmoke;
SC.ammoMultiplier = 2;
//SC.status = StatusEffects.blasted;
//SC.statusDuration = 60;

const zisha = new UnitType('zisha');//自杀小队
zisha.constructor = prov(() => extend(UnitTypes.eclipse.constructor.get().class, {}));
zisha.speed = 3;
zisha.accel = 0.08;
zisha.drag = 0.01;
zisha.flying = true;
zisha.health = 520;
zisha.engineOffset = 5.5;
zisha.range = 140;
zisha.targetAir = false;
zisha.commandLimit = 4;
zisha.circleTarget = true;
zisha.hitSize = 13;
zisha.armor = 5;

zisha.ammoType = new ItemAmmoType(Items.coal);

zisha.weapons.add(
    (() => {
        const w = new Weapon("");
        w.reload = 60;
        w.shootCone = 180;
        w.ejectEffect = Fx.none;
        w.shootSound = Sounds.explosion;
        w.x = 0;
        w.shootY = 0;
        w.mirror = false;
        w.bullet = SB;
        return w;
    })()
);
exports.zisha = zisha;