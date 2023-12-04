class tdScene {
    constructor (height,width) {
        this.entities = [];
        this.height = height;
        this.width = width;
        this.entities.push(new tdPlayer(2,3,this.nextTurn.bind(this)),new tdEnemy(2,10,this.nextTurn.bind(this)));
        this.turnEntity = 0;
        this.nextTurn();
    }
    getRenderableEntities() {
        return this.entities;
    }
    getPlayerControlledEntities() {
        var pcEntities = [];
        for (var i = 0; i < this.entities.length; i++) {
            var entity = this.entities[i];
            if (entity.hasOwnProperty("playerControlled") && entity.playerControlled) {
                pcEntities.push(entity);
            }
        }
        return pcEntities;
    }
    nextTurn() {
        var entity = this.entities[this.turnEntity];
        if (this.turnEntity < this.entities.length-1) {
            this.turnEntity++;
        } else {
            this.turnEntity = 0;
        }
        entity.turnTick();
    }
}
class tdSceneEntity {
    constructor (x,y,turnCallback) {
        this.name = "Base Entity";
        this.x = x;
        this.y = y;
        this.sprite = 
        ["#   ",
        "| ^ ",
        "|\\O",
        "| 8\\",
        " / \\"];
        this.turnCallback = turnCallback;
    }
    moveTo (x,y) {
        this.x = x;
        this.y = y;
    }
    //Ticks every turn
    turnTick() {
        this.endTurn();
        return;
    }
    endTurn() {
        console.log(this);
        this.turnCallback();
    }
}
class tdPerson extends tdSceneEntity{
    constructor (x,y,turnCallback) {
        super(x,y,turnCallback);
        this.name = "Person";
        this.health = 10;
        this.stats = false;
        this.gear = false;
        this.movementspeed = 20;
        this.distancemoved = 0;
        this.actionsperturn = 3;
        this.actionsused = 0;
        this.showmovement = false;
        this.spellbook = [];
        this.afflictions=[];
        this.playerControlled = false;
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
        if (!this.playerControlled) {
            this.applyAI();
            this.endTurn();
        }
    }
    applyAI() {
        
    }
    getCastableSpells() {
        //return array of tdSpell based on what's currently castable
        return [new tdSpell('Fireball',5,1,['Burning']), 
        new tdSpell('Magic Missile',2,3,[]), 
        new tdSpell('Polymorph',0,1,['Polymorphed'])];
    }
    //PRIVATE
}
class tdPlayer extends tdPerson {
    constructor (x,y,turnCallback) {
        super(x,y,turnCallback);
        this.name = "Player";
        this.playerControlled = true;
    }
}
class tdEnemy extends tdPerson {
    constructor (x,y,turnCallback) {
        super(x,y,turnCallback);
        this.name = "Enemy";
        this.sprite = 
        [
        " O ",
        "/8\\",
        "/ \\"
        ];
    }
    applyAI () {
        this.x += 5;
    }
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
        console.log("CAST "+this.name)
    }
    //PRIVATE
}