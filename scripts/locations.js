class tdLocationView {
    constructor (drawingTool) {
        document.addEventListener("keypress", this.handleKeypress.bind(this));
        this.drawingTool = drawingTool;
        this.locationset = new tdLocationSet();
        this.player = new tdPlayerAgent("hombl");
        this.handleUpdate();
    }
    handleMouseMove(e) {

    }
    handleUpdate() {
        var locationid = this.player.getLocation();
        this.location = this.locationset.getLocationById(locationid);
        this.drawUI();
    }
    drawUI() {
        this.drawingTool.clear();
        this.drawingTool.drawString(this.location.name,1,1);
        this.drawingTool.drawSprite(22,0,this.location.art);
        this.drawingTool.drawParagraph(this.location.description,1,3,30);

        var options = this.location.getOptions(this.player);
        for (var i = 0; i < options.length; i++) {
            console.log(options[i]);
            this.drawingTool.drawString((i+1)+" "+options[i].label,2,8+(i*2));
        }
    }
    handleKeypress(e) {
        this.selectOption(Number(e.key-1));
    }
    selectOption(id) {
        var options = this.location.getOptions(this.player);
        options[id].activate();
        this.handleUpdate();
    }
}
class tdPlayerAgent {
    constructor(startLocation) {
        this.location = startLocation;
    }
    getLocation() {
        return this.location;
    }
    moveTo(location) {
        this.location = location;
    }
}
class tdLocationSet {
    constructor() {
        this.locationset = {
            "hombl":new tdWorldLocation("Hombledon Square","You are standing in hombledon square - the town guard is sneering at you,","Townhouse",["bsmith","church"]),
            "bsmith":new tdWorldLocation("Blacksmiths","You are in the blacksmiths. The blacksmith is not in the blacksmiths.", "Townhouse"),
            "church":new tdWorldLocation("Old Church","You find yourself cautiously stepping through the ruins of the old church.","Townhouse")
        }
    }
    getLocationById(id) {
        if (this.locationset.hasOwnProperty(id)) {
            return this.locationset[id];
        } else {
            return new tdWorldLocation("The Underwoods")
        }
    }
}
class tdWorldLocation {
    constructor (name,desc,art,routes=[]) {
        this.name = name;
        this.description = desc;
        this.art = art;
        this.mapX = 1;
        this.mapY = 1;
        this.routes = routes //location ids that this connects to
    }
    getOptions (playerAgent) {
        var options = [];
        for (var i = 0; i < this.routes.length; i++) {
            options.push(new tdLocationNavOption(playerAgent,this.routes[i]));
        }
        return options;
    }
}
// abstract-ish class for generic options - eg talk to, interact, play slot machine
class tdLocationOption {
    constructor(label) {
        this.label = label;
    }
    activate() {

    }
}
class tdLocationNavOption extends tdLocationOption {
    constructor(playerAgent,destinationId) {
        super("Go to "+destinationId);
        this.playerAgent = playerAgent;
        this.dest = destinationId;
    }
    activate() {
        this.playerAgent.moveTo(this.dest);
    }
}