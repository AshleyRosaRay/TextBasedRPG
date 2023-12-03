
class tdTextDrawingTool {
    constructor (textScreen) {
        this.textScreen = textScreen;
    }
    //PUBLIC
    drawCharacter(char,x,y) {
        this.textScreen.setChar(x,y,this.getCharForChar(char));
        this.textScreen.update(x,y,x,y);
    }
    //returns any remaining text
    drawString(dstring,x,y) {
        for (var xoffset = 0; xoffset < dstring.length; xoffset++) {
            var updated = this.textScreen.setChar(x+xoffset,y,this.getCharForChar(dstring[xoffset]));
            if (!updated) {
                this.textScreen.update(x,y,x+xoffset-1,y);
                return dstring.substring(xoffset-1);
            }
        }
        this.textScreen.update(x,y,x+dstring.length-1,y);
        return "";
    }
    drawParagraph(dstring,x,y,width) {
        var words = dstring.split(" ");
        var line = "";
        var lineNo = 0;
        for (var i = 0; i < words.length; i++) {
            var toDrawWord = words[i];
            if (line != "") {
                toDrawWord = " "+toDrawWord
            }
            if (line.length + toDrawWord.length < width) {
                line = line + toDrawWord
            } else {
                this.drawString(line,x,y+lineNo);
                lineNo++;
                line = words[i];
            }
        }
        if (line != "") {
            this.drawString(line,x,y+lineNo);
        }
        this.textScreen.update(x,y,x+width,y+lineNo);
        return "";
    }
    drawBox(x,y,width,height,borderchar="-",cornerchar="+",verticalchar="|") {
        for (var yPos = y; yPos < y+height; yPos++) {
            for (var xPos = x; xPos < x+width; xPos += (yPos==y||yPos==y+height-1)?1:width-1) {
                var char = borderchar;
                if (verticalchar && (xPos == x || xPos == x+width-1) ) {
                    char=verticalchar;
                }
                if (cornerchar && (yPos==y||yPos==y+height-1) && (xPos == x || xPos == x+width-1) ) {
                    char=cornerchar;
                }
                this.textScreen.setChar(xPos,yPos,this.getCharForChar(char));
            }
        }
        this.textScreen.update(x,y,x+width,y+height);
    }
    drawSprite(x,y,sprite) {
        console.log(sprite);
        for (var sy = 0; sy < sprite.length; sy++) {
            for (var sx = 0; sx < sprite[sy].length; sx++) {
                var char = sprite[sy][sx];
                console.log(char);
                this.textScreen.setChar(x+sx,y+sy,this.getCharForChar(char));
            }
        }
        this.textScreen.update(x,y,x+sprite[0].length,y+sprite.length);
    }
    clear() {
        this.textScreen.clear();
    }
    //PRIVATE

    //lmao this sucks, it switches a standard js "string char" for the special
    //internal characters with colour encoding and stuff.
    //-- couldn't resist the shitty joke name.
    getCharForChar(char) {
        return new tdTextCharacter(char,"#FFFFFF")
    }
}
class tdTextCanvas {
    constructor (canvasElem,textScreen) {
        this.canvasElem = canvasElem;
        this.textScreen = textScreen;
        this.textScreen.registerFramehandler(this.handleUpdate.bind(this));
        this.render();
    }
    //PUBLIC
    handleUpdate(startx,starty,endx,endy) {
        for (var x=startx; x <= endx; x++) {
            for (var y=starty; y <= endy; y++) {
                this.refreshCell(x,y);
            }
        }
    }
    refreshCell(x,y) {
        var buffer = this.canvasElem.querySelector(".td-buf");
        if (buffer) {
            var target = buffer.children[y].children[x];
            target.replaceWith(this.getCharAsSpan(this.textScreen.getChar(x,y),x,y));
        }
    }
    render() {
        var screenData = this.textScreen.getScreenData();
        var screenBuffer = document.createElement("div");
        screenBuffer.classList.add("td-buf");
        for (var y = 0; y < screenData.length; y++) {
            var row = document.createElement("div");
            row.classList.add("td-r");
            screenBuffer.append(row);
            for (var x = 0; x < screenData[y].length; x++) {
                row.append(this.getCharAsSpan(screenData[y][x],x,y));
            }
        }
        this.canvasElem.innerHTML = "";
        this.canvasElem.classList.add("td-canv");
        this.canvasElem.append(screenBuffer);
    }
    //PRIVATE
    getCharAsSpan(char,x,y) {
        var span = document.createElement("span");
        span.style.color = char.col;
        span.textContent = char.char;
        span.dataset.x = x;
        span.dataset.y = y;
        span.classList.add("td-c");
        return span;
    }
}
class tdTextScreen {
    constructor (width,height) {
        this.width = width;
        this.height = height;
        this.screenData = [];
        this.frameHandlers = [];
        this.clear();
    }
    clear() {
        for (var y = 0; y < this.height; y++) {
            this.screenData[y] = []
            for (var x = 0; x < this.width; x++) {
                this.screenData[y][x] = new tdTextCharacter(" ","#FFFFFF");
            }
        }
        for (var i = 0; i < this.frameHandlers.length; i++) {
            this.frameHandlers[i](0,0,this.width-1,this.height-1);
        }
    }
    registerFramehandler(callback) {
        this.frameHandlers.push(callback);
    } 
    getScreenData() {
        return this.screenData;
    }
    getChar(x,y) {
        return this.screenData[y][x];
    }
    setChar(x,y,char) {
        if (this.screenData.length > y && this.screenData[y].length > x) {
            this.screenData[y][x] = char;
            return true;
        }
        return false;
    }
    //updates a region of the screen - as defined by the passed params (or fullscreen if none passed)
    //passes updates to anything rendering this screen to update that portion of it.
    update(startx=false,starty=false,endx=false,endy=false) {
        var trueEndX = Math.min(endx,this.width-1);
        var trueEndY = Math.min(endy,this.height-1);
        for (var i = 0; i < this.frameHandlers.length; i++) {
            this.frameHandlers[i](startx,starty,trueEndX,trueEndY);
        }
    }
}
class tdTextCharacter {
    constructor (character,color) {
        this.char = character;
        this.col = color;
    }
}
class tdGameEngine {
    constructor(element) {
        this.elem = element;
        this.textScreen = new tdTextScreen(40,25);
        this.textCanvas = new tdTextCanvas(element, this.textScreen);
        this.drawingTool = new tdTextDrawingTool(this.textScreen);
        document.addEventListener("keypress", this.handleKeypress.bind(this));
        this.elem.addEventListener('click', this.handleClick.bind(this));
        this.renderer = new tdSceneView(this.drawingTool);
    }
    handleKeypress(e) {
        e.preventDefault();
        this.renderer.handleKeypress(e);
    }
    handleClick(e) {
        this.renderer.handleClick(Number(e.target.dataset.x),Number(e.target.dataset.y));
    }
}
class tdDialogueView {
    constructor (drawingTool) {
        document.addEventListener("keypress", this.handleKeypress.bind(this));
        this.drawingTool = drawingTool;
        this.dialogueHandler = new tdDialogueHandler();
        this.dialogueHandler.listen(this.handleDialogue.bind(this));
    }
    handleDialogue(dialogue) {
        this.showingOptions = dialogue.hasOwnProperty("options");
        this.drawingTool.clear();
        this.drawingTool.drawBox(0,0,40,17);
        this.drawingTool.drawParagraph(dialogue.text,1,1,38);
        if (this.showingOptions) {
            for (var i = 0; i < dialogue.options.length; i++) {
                this.drawingTool.drawParagraph((i+1)+". "+dialogue.options[i].text,1,18+(i*2),38);
            }
        } else {
            this.drawingTool.drawParagraph("[ANY KEY] Continue...",1,18,38);
        }
    }
    handleKeypress(e) {
        if (this.showingOptions) {
            this.dialogueHandler.respond(Number(e.key-1));
        } else {
            this.dialogueHandler.respond(Number(e.key));
        }
    }
}
class tdSceneView {
    constructor (drawingTool) {
        this.drawingTool = drawingTool;
        document.addEventListener("keypress", this.handleKeypress.bind(this));
        this.scene = new tdScene();
        this.drawScene();
    }
    drawScene() {
        var entities = this.scene.getRenderableEntities();
        this.drawingTool.clear();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            this.drawingTool.drawBox(entity.x,entity.y,1,1);
            this.drawingTool.drawSprite(entity.x,entity.y,entity.sprite);
        }
    }
    handleKeypress(e) {
        console.log(e);
    }
    handleClick(x,y) {
        this.scene.entities[0].moveTo(x,y);
        this.drawScene();
    }
}
class tdScene {
    constructor (height,width) {
        this.entities = [];
        this.height = height;
        this.width = width;
        this.entities.push(new tdSceneEntity(2,3));
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
class tdDialogueHandler {
    constructor () {
        this.runner=false;
        //this is here because the python webserver I'm using for development
        //doesn't serve .yarn files properly - shouldnt use .html in production
        fetch('dialog/testdialog.html')
        .then(response => response.text())
        .then((yarnData) => {
            this.runner = new YarnBound({
                dialogue:yarnData,
                combineTextAndOptionsResults:true
            });
            this.tell();
        });
        this.listeners = [];
    }
    //PUBLIC
    listen(listener) {
        this.listeners.push(listener);
    }
    respond(option) {
        this.runner.advance(option);
        this.tell();
    }
    //PRIVATE
    tell() {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.runner.currentResult)
        }
    }
    
}
_textCanv = new tdGameEngine(document.getElementById("MainScreen"));