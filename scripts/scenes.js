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
    }
    //PUBLIC
    getCastableSpells() {
        //return array of tdSpell based on what's currently castable
    }
    //PRIVATE
}
class tdSpell {
    constructor () {
        this.minigame = false;
        this.difficulty = false;
        this.name="Fireball";
    }
    //PUBLIC
    cast(x,y,scene) {
    }
    //PRIVATE
}