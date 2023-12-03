class tdScene {
    constructor (height,width) {
        this.entities = [];
        this.height = height;
        this.width = width;
        this.entities.push(new tdPerson(2,3));
    }
    getRenderableEntities() {
        return this.entities;
    }
}
class tdSceneEntity {
    constructor (x,y) {
        this.x = x;
        this.y = y;
        this.sprite = 
        ["#   ",
        "| ^ ",
        "|\\O",
        "| 8\\",
        " / \\"];
    }
    moveTo (x,y) {
        this.x = x;
        this.y = y;
    }
}
class tdPerson extends tdSceneEntity{
    constructor (x,y) {
        super(x,y);
        this.name = "Player";
        this.health = 10;
        this.stats = false;
        this.gear = false;
        this.movementspeed = 8;
        this.spellbook = [];
        this.afflictions=[]
    }
    //PUBLIC
    getCastableSpells() {
        //return array of tdSpell based on what's currently castable
        return [new tdSpell('Fireball',5,1,['Burning']), 
        new tdSpell('Magic Missile',2,3,[None]), 
        new tdSpell('Polymorph',0,1,['Polymorphed'])];
    }
    //PRIVATE
}

class tdSpell {
    constructor (name, damage,projectilenum,effects) {
        this.minigame = false;
        this.difficulty = false;
        this.name=name;
        this.damage = damage;
        this.projectilenum = projectilenum;
        this.effects= effects;
    }
    //PUBLIC
    cast(x,y,scene) {
        alert("CAST FIREBALL")
    }
    //PRIVATE
}