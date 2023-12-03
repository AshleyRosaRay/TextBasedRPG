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
    //Ticks every turn
    turnTick() {
        return;
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
        this.distancemoved = 0;
        this.actionsperturn = 3;
        this.actionsused = 0;
        this.showmovement = false;
        this.spellbook = [];
    }
    //PUBLIC
    moveTo (x,y) {
        var xdist = this.x - x;
        var ydist = this.y - y;

        var distance = Math.ceil(Math.sqrt(xdist*xdist + ydist*ydist));
        if (distance <= this.movementspeed-this.distancemoved) {
            this.x = x;
            this.y = y;
            this.distancemoved += distance;
            return true;
        }
        return false;
    }
    turnTick() {
        this.distancemoved = 0;
        this.actionsused = 0;
    }
    getCastableSpells() {
        //return array of tdSpell based on what's currently castable
        return [new tdSpell("Fireball"), new tdSpell("Magic Missle"), new tdSpell("Polymorph")];
    }
    //PRIVATE
}
class tdSpell {
    constructor (name) {
        this.minigame = false;
        this.difficulty = false;
        this.name=name;
    }
    //PUBLIC
    cast(x,y,scene) {
        console.log("CAST "+this.name)
    }
    //PRIVATE
}