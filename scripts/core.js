
class tdGameEngine {
    constructor(element) {
        this.elem = element;
        this.textScreen = new tdTextScreen(40,25);
        this.textCanvas = new tdTextCanvas(element, this.textScreen);
        this.drawingTool = new tdTextDrawingTool(this.textScreen);
        document.addEventListener("keypress", this.handleKeypress.bind(this));
        this.elem.addEventListener('click', this.handleClick.bind(this));
        this.elem.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.renderer = new tdSceneView(this.drawingTool);
    }
    handleKeypress(e) {
        e.preventDefault();
        this.renderer.handleKeypress(e);
    }
    handleMouseMove(e) {
        this.renderer.handleMouseMove(Number(e.target.dataset.x),Number(e.target.dataset.y));
    }
    handleClick(e) {
        this.renderer.handleClick(Number(e.target.dataset.x),Number(e.target.dataset.y));
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