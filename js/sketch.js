
class Player {
    
    constructor(_scene,x,y,color){
        
        this.w = 0.5
        this.h = 4
        
        this.geometry = new THREE.BoxGeometry(0.5,this.h,this.w)
        this.material = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true})
        this.bar = new THREE.Mesh(this.geometry,this.material)
        _scene.add(this.bar)
        
        this.material.color = new THREE.Color(0x2c3e50)
        this.x = x
        this.y = y
        
    }
    
    get x() {
        return this.bar.position.x
    }
    
    set x(_x) {
        this.bar.position.x = _x
    }
    
    get y() {
        return this.bar.position.y
    }
    
    set y(_y) {
        this.bar.position.y = _y
    }
    
    moveUp(){
        if(this.y + 0.4 < 5.4) {
            this.y += 0.4
        }

    }
    
    moveDown() {
        if(this.y - 0.4 > -5.6){
            this.y -= 0.4
        }
    }
    
}

class Ball {
    constructor(_scene,x = 0,y = 0){
        
        this.w = 1
        this.h = 1
        
        this.geometry = new THREE.BoxGeometry(1,this.w,this.h)
        this.material = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true, emissive: 0xffffff})
        this.ball = new THREE.Mesh(this.geometry,this.material)
        
        this.pos = new THREE.Vector3()
        
        _scene.add(this.ball)
    }
    
    updatePos(){
        this.ball.position.x = this.pos.x
        this.ball.position.y = this.pos.y
    }
    
    get x() {
        return this.ball.position.x
    }
    
    set x(_x) {
        this.ball.position.x = _x
    }
    
    get y() {
        return this.ball.position.y
    }
    
    set y(_y) {
            this.ball.position.y = _y
    }  
}

let renderer
let camera
let stats

let player1
let player2
let ball

let hemiLight
let background
let down = {};

/// Screen size

let h = document.documentElement.clientHeight,
    w = document.documentElement.clientWidth
/// SCENE

let scene = new THREE.Scene()


function Init(){
    createScene()
    createLights()
    createPlayers()
    createBall()
}


function createScene(){
 
 /// CAMERA
 camera = new THREE.PerspectiveCamera(75,w / h, 0.1,1000)
 camera.position.z = 10
 camera.lookAt(new THREE.Vector3(0,0,0))
 /// RENDERER
 renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })

 renderer.setSize(w,h)
 renderer.setClearColor( 0x0e0a38 )

 document.body.appendChild(renderer.domElement)
 
 
 /// WALL
 
 /*wall = new THREE.GridHelper(22,10,0xcf63ae,0xcf63ae)
 
 wall.position.z = - 1
 wall.rotation.x = - Math.PI / 2*/
 
 createMap()
 
 //scene.add(wall)

 /// STATS
 stats = new Stats()

 document.body.appendChild( stats.dom )
 
}


function createMap(){
    
    background =  new THREE.GridHelper(25,10,0xcf63ae,0xcf63ae)
    background.rotation.x = - Math.PI / 2
    background.position.z = -2 
    scene.add(background)
    
}


function createPlayers(){
    
    player1 = new Player(scene,-10,0)
    player2 = new Player(scene,10,0)

}


function createLights(){
    
    hemiLight = new THREE.HemisphereLight(0xffffff,0xffffff,0.6)
    hemiLight.color.setHSL(0.6,1,0.6)
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
    hemiLight.position.set(0,50,0)
    
    scene.add(hemiLight)
    
}


function createBall(){
    ball = new Ball(scene)
}


function launchBall(){
    
}

function collision(box1,box2){
    
    if((box2.x >= box1.x + box1.w/2) ||
       (box2.x <= box1.x - box1.w/2) ||
       (box2.y - box2.h/2 >= box1.y + box1.h/2) ||
       (box2.y + box2.h/2 <= box1.y - box1.h/2))
        {
            return false
        }
    else
    {
        return true
    }
}

/// BIND KEY

document.body.addEventListener('keydown',(e) => {

    down[e.keyCode] = true
    
    if(down[90]){
        player1.moveUp()
    }
    
    if(down[83]){
        player1.moveDown()
    }
    
    if(down[38]){
        player2.moveUp()
    }
    
    if(down[40]){
        player2.moveDown()
    }
    
})

document.body.addEventListener('keyup', (e) => {
    
    down[e.keyCode] = false
    
})

/// LOOP
let render = function render(){
    
    
    requestAnimationFrame(render)
    renderer.render(scene,camera)
    
    stats.update()
    
}

Init()
render()

setInterval(() => {
    
    ball.pos.x += 0.05
    
    if(collision(player2,ball)){
        console.log("collision")
        ball.pos.x -= 0.05
    }
    
    
    ball.updatePos()
    
},17)


