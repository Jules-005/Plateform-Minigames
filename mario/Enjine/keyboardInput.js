/**
	Class that helps to manage keyboard input.
	Code by Rob Kleffner, 2011
*/

Enjine.Keys = {
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Space: 32  // Ajout de la touche Espace
};

Enjine.KeyboardInput = {
    Pressed: new Array(),
    
    Initialize: function() {
        var self = this;
        document.onkeydown = function(event) { self.KeyDownEvent(event); }
        document.onkeyup = function(event) { self.KeyUpEvent(event); }
        document.onmousedown = function(event) { self.MouseDownEvent(event); } // Détecte clic de la souris
        document.onmouseup = function(event) { self.MouseUpEvent(event); }
    },
    
    IsKeyDown: function(key) {
        if (this.Pressed[key] != null)
            return this.Pressed[key];
        return false;
    },
    
    KeyDownEvent: function(event) {
        this.Pressed[event.keyCode] = true;
        this.PreventScrolling(event);
    },
    
    KeyUpEvent: function(event) {
        this.Pressed[event.keyCode] = false;
        this.PreventScrolling(event);
    },

    MouseDownEvent: function(event) {
        if (event.button === 0) { // bouton gauche de la souris
            this.Pressed["LeftClick"] = true;
        }
    },
    
    MouseUpEvent: function(event) {
        if (event.button === 0) {
            this.Pressed["LeftClick"] = false;
        }
    },
    
    PreventScrolling: function(event) {
        // Empêche le défilement avec les flèches directionnelles
        if(event.keyCode >= 37 && event.keyCode <= 40){
            event.preventDefault();
        }
    }
};
