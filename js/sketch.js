
const MAX_H = 7.8
const MAX_B = - 5.8

class Player {
    
    constructor(_scene,x,y,color){
        
        this.w = 0.5
        this.h = 4
        this.vel = new THREE.Vector2()
        
        this.cubeCam = new THREE.CubeCamera(0.1,100,256)
        this.cubeCam.position.set(x,y,0)
        this.cubeCam.rotation.y = 3.7
        
        /*this.cubeCam.lookAt(new THREE.Vector3(1,2,1.5))*/
        this.cubeCam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter
        
        scene.add(this.cubeCam)
        
        this.geometry = new THREE.BoxGeometry(0.5,this.h,this.w)
        this.material = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true, envMap: this.cubeCam.renderTarget.texture, ambient: 0xc82222, emissive: 0x222222, side: THREE.BackSide })
        this.bar = new THREE.Mesh(this.geometry,this.material)
        _scene.add(this.bar)
        
        this.material.color = new THREE.Color(0x2c3e50)
        //this.material.rotation.y = 2
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
        if(this.y + 0.4 < MAX_H) {
            this.vel.y = 0.3
        }

    }
    
    moveDown() {
        
        if(this.y - 0.4 > MAX_B){
            this.vel.y = -0.3
        }
    }
    
    updatePos() {
        
       this.y += this.vel.y
       
       if(this.vel.y > 0){
           this.vel.y -= 0.15
       }
        else if(this.vel.y < 0){
            this.vel.y += 0.15
            
        }

        
    }
    
    respawn(y) {
        this.y = 0
        this.vel = new THREE.Vector2()
    }
    
    updateReflect(){
    
    this.cubeCam.position.set(this.x,this.y,0)
    this.material.envMap = this.cubeCam.renderTarget.texture
    this.cubeCam.updateCubeMap(renderer,scene)
        
    }
    
    
}

class Ball {
    constructor(_scene,x = 0,y = 0){
        
        this.w = 0.8
        this.h = 0.8
        this.vel = new THREE.Vector2()
        
        this.geometry = new THREE.BoxGeometry(1,this.w,this.h)
        this.material = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true/*, emissive: 0xffffff*/})
        this.ball = new THREE.Mesh(this.geometry,this.material)
        
        _scene.add(this.ball)
    }
    
    updatePos(){
        this.ball.position.x += this.vel.x
        this.ball.position.y += this.vel.y
        
        if(this.ball.position.y > MAX_H || this.ball.position.y < MAX_B){
            this.vel.y = - this.vel.y
        }        
    }
    
    respawn(){
        
        this.vel = new THREE.Vector2()
        this.x = 0
        this.y = 0
        
        
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
let cubemap 

let hemiLight
let background
let ground
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
    launchBall()
}


function createScene(){
 
 /// CAMERA
 camera = new THREE.PerspectiveCamera(75,w / h, 0.1,1000)
 camera.position.z = 10
 camera.position.y = -2
 camera.lookAt(new THREE.Vector3(0,0,0))
 /// RENDERER
 renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })

 renderer.setSize(w,h)
 renderer.setClearColor( 0x0e0a38 )

 
 document.body.appendChild(renderer.domElement)
 
 
 createMap()
 

 /// STATS
 stats = new Stats()

 document.body.appendChild( stats.dom )
 
}


function createMap(){
    
    background =  new THREE.GridHelper(25,10,0xcf63ae,0xcf63ae)
    background.rotation.x = - Math.PI / 2
    background.position.z = -0.5
    scene.add(background)
    
    /*cubemap = new THREE.CubeCamera(0.1,100,1024)
    cubemap.position.set(0,25,0)
    cubemap.lookAt(new THREE.Vector3(0,0,0))
    cubemap.rotation.z = 0
    
    scene.add(cubemap)
    
    let geometry = new THREE.PlaneGeometry( 30, 30, 1 );
    let material = new THREE.MeshBasicMaterial( { envMap: cubemap.renderTarget.texture} );
    
    ground = new THREE.Mesh( geometry, material );
    ground.rotation.x = - Math.PI / 2
    ground.position.z = -2
    
    
    ground.position.z = -2
    
 
    scene.add(ground)*/
    
    
    
}


function createPlayers(){
    
    player1 = new Player(scene,-10,0)
    player2 = new Player(scene,10,0)

}


function createLights(){
    
    hemiLight = new THREE.HemisphereLight(0xffffff,0xffffff,2)
    hemiLight.color.setHSL(0.6,1,0.6)
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
    hemiLight.position.set(0,0,10)
    
    scene.add(hemiLight)
    
}


function createBall(){
    ball = new Ball(scene)
}


function launchBall(){
    if(Math.random(0,1) > 0.5){
        ball.vel.x = 0.1
    }
    else{
        ball.vel.x = 0.1
    }
}

function collisionMap(){
    if(ball.x < -11 || ball.x > 11){
        respawnGame()
    }
}

function respawnGame(){
    
    down = {}
    
    player1.respawn()
    player2.respawn()
    ball.respawn()
    
    setTimeout(()=>{
        launchBall()
    },500)
    
}

function collision(box1,box2){
    
    if((box2.x - box2.w/2 >= box1.x + box1.w) ||
       (box2.x + box2.w <= box1.x) ||
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

function AngleBarCollision(_player){
    return ( ( (_player.y - ball.y ) / _player.h) * 2) * 1.25
}

/// BIND KEY

document.body.addEventListener('keydown',(e) => {

    down[e.keyCode] = true
    
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
    
    if(collision(player2,ball)){
        
        console.log( AngleBarCollision(player2) )
        
        ball.vel.negate()

        ball.vel.add(player2.vel)
        
        ball.x = 9
        
        ball.vel.rotateAround(player2.vel, ( ( (player2.y - ball.y ) / player2.h) * 2) * 1.25)
        
        
    }
    else if(collision(player1,ball)){
        
        ball.vel.negate()
        
        ball.vel.add(player1.vel)
        
        ball.x = -9
        
        ball.vel.rotateAround(player1.vel,- ( ( (player1.y - ball.y ) / player1.h) * 2) * 1.25)
    }
    
    /// position des barres
    
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
    
    
    ball.updatePos()
    player1.updatePos()
    player2.updatePos()
    
    collisionMap()
    
},17) // ~60FPS

setInterval(() => {
    
    
    /*ground.material.envMap = cubemap.renderTarget.texture
    cubemap.updateCubeMap(renderer,scene)
    */
    player1.updateReflect()
    player2.updateReflect()
},70)

