
const MAX_H = 7.8
const MAX_B = - 5.8

class Player {
    
    constructor(_scene,x,y,color){
        
        this.w = 0.5
        this.h = 4
        this.vel = new THREE.Vector2()
        this.scoreText = undefined
        
        this.cubeCam = new THREE.CubeCamera(0.1,100,256)
        this.cubeCam.position.set(x,y,0)
        this.cubeCam.rotation.y = 3.7
        
        this.score = 0
        
        this.animOffset =  [10.2,x]
        
        if(x < 0){
            this.animOffset = [-10.2,x]
        }
        
                

        

        /*this.animation.chain(new TWEEN.Tween({w: 0.35}).to({w: this.w},500))
        this.animation.easing(TWEEN.Easing.Elastic.In)*/
        
        
        /*this.cubeCam.lookAt(new THREE.Vector3(1,2,1.5))*/
        this.cubeCam.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter
        
        
        this.geometry = new THREE.BoxGeometry(0.5,this.h,this.w)
        this.material = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true, ambient: 0xc82222, emissive: 0x222222, side: THREE.BackSide })
        this.bar = new THREE.Mesh(this.geometry,this.material)
        _scene.add(this.bar)
        
        this.material.color = new THREE.Color(0x2c3e50)
        //this.material.rotation.y = 2
        this.x = x
        this.y = y
        
        this.animation = new TWEEN.Tween(this.bar.position).to({x:this.animOffset[0]},200).onComplete(() => {
            (new TWEEN.Tween(this.bar.position).to({x:this.animOffset[1]},200)).start()
        })
        
        this.animation.easing(TWEEN.Easing.Elastic.Out)

        
    }
    
    winRound() {
        
        this.score++
        
        this.scoreText.geometry = new THREE.TextGeometry(this.score.toString(), {
            font: font,
            size: 3,
            height: 0.25
        });
        
        
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
        (new TWEEN.Tween(this).to({y:0},500)).start()
        //this.y = 0
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
        
        this.w = 0.4
        this.h = 0.4
        this.vel = new THREE.Vector2()
        this.respawnAnimation = new TWEEN.Tween(this).to({x: 0,y:0},1000).easing(TWEEN.Easing.Quintic.Out)
        
        this.geometry = new THREE.SphereGeometry(this.w,10,10)
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
        this.respawnAnimation.start()
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

let renderer,
    camera,
    stats

let player1,
    player2,
    font,
    ball,
    cubemap,
    randLaunch = Math.round(Math.random())

let hemiLight
let background
let ground
let down = {};

let composer,
    rgbEffect,
    filmEffect,
    correctColor,
    effectBloom,
    effectFXAA

/// Particles system

let particleCount = 10,
    particles,
    pMaterial,
    particleSystem,
    options,
    spawnerOptions

function SetupParticles() {
    
    particleSystem = new THREE.GPUParticleSystem({
        maxParticles: 2500
    })
    
    scene.add(particleSystem)
    
    options = {
				position: new THREE.Vector3(),
				positionRandomness: 0.1,
				velocity: new THREE.Vector3(),
				velocityRandomness: 0,
				color: 0xffffff,
				colorRandomness: .5,
				turbulence: 0,
				lifetime: 1,
				size: 45,
				sizeRandomness: 0
			};
	spawnerOptions = {
				spawnRate: 2,
				horizontalSpeed: 10,
				verticalSpeed: 10,
				timeScale: 1
			};
     
}

/// Screen size

let h = document.documentElement.clientHeight,
    w = document.documentElement.clientWidth
/// SCENE

let scene = new THREE.Scene()


function Init(){
    createScene()
    createLights()
    SetupParticles()
    SetupShaders()
    createPlayers()
    loadScore()
    createBall()
    launchBall()
}


function createScene(){
 
 /// CAMERA
 camera = new THREE.PerspectiveCamera(75,w / h, 0.1,1000)
 camera.position.z = 15
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
    if(randLaunch === 1){
        ball.vel.x = 0.1
        randLaunch = 0
    }
    else{
        ball.vel.x = -0.1
        randLaunch = 1
    }
}

function collisionMap(){
    if(ball.x < -11)
        {
            player1.winRound()
            respawnGame()
        }
        else if(ball.x > 11)
        {
            player2.winRound()
            respawnGame()
        }
}

function respawnGame(){
    
    down = {}
    
    player1.respawn()
    player2.respawn()
    ball.respawn()
    ball.respawnAnimation.onComplete(() => {
    
    setTimeout(()=>{
        launchBall()
    },500)
    
    })

    
}

function loadScore(){
          
        let loader = new THREE.FontLoader()

        loader.load('fonts/optimer_regular.typeface.json', function(response){
        
            font = response;
            console.log(font)
        scoreGeo = new THREE.TextGeometry('0', {
            font: font,
            size: 3,
            height: 0.25
        });
        
            let material = new THREE.MeshBasicMaterial({ color: 0xffffff})
            
            player1.scoreText = new THREE.Mesh(scoreGeo,material)
            player1.scoreText.position.set(player1.x - 6,7,0)
            
            player2.scoreText = new THREE.Mesh(scoreGeo,material)
            player2.scoreText.position.set(player2.x + 4,7,0)
            
            scene.add(player1.scoreText)
            scene.add(player2.scoreText)
            
            
        });

        /*
        this.ScoreMaterial = new THREE.MeshPhongMaterial({ antialias: true, logarithmicDepthBuffer: true})
        
        this.scoreText = new THREE.Mesh(this.scoreGeo,this.ScoreMaterial)
        
        this.scoreText.position.set(-10,0,2)
        
        scene.add(this.scoreText)
*/        
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

function SetupShaders() {
   composer = new THREE.EffectComposer( renderer )
   composer.addPass( new THREE.RenderPass(scene,camera))
   
   
   filmEffect = new THREE.FilmPass(0.8,0.25,512, false)
   composer.addPass( filmEffect )
   
   effectBloom = new THREE.BloomPass(1.05, 10, 0.2,1024)
   composer.addPass( effectBloom )         

   rgbEffect = new THREE.ShaderPass( THREE.RGBShiftShader )
   rgbEffect.uniforms[ 'amount' ].value = 0.003;
   rgbEffect.uniforms[ 'angle' ].value = 1.25;
   rgbEffect.renderToScreen = true;
   composer.addPass( rgbEffect );
}

/// BIND KEY

document.body.addEventListener('keydown',(e) => {

    down[e.keyCode] = true
    
})

document.body.addEventListener('keyup', (e) => {
    
    down[e.keyCode] = false
    
})

/// RESIZE

window.addEventListener('resize',() => {
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    
})

/// LOOP

let clock = new THREE.Clock()
let tick = 0
let view = new THREE.Vector3()

let render = function render(){
    
    

    let delta = clock.getDelta();
    
    tick += (delta * spawnerOptions.timeScale)
    
    composer.render(delta)
    //renderer.render(scene,camera)
    
    
        options.position.x = ball.x
        options.position.y = ball.y
		options.position.z = 0
        
        for(let i = 0; i < spawnerOptions.spawnRate; i++){
           particleSystem.spawnParticle(options);  
        }
        
       
    
    
    particleSystem.update(tick)
    
    requestAnimationFrame(render)
    

    view.set(ball.ball.position.x * 0.25,ball.ball.position.y * 0.1,0)
    
    camera.lookAt(view)
    //renderer.render(scene,camera)
    stats.update() 
    
    TWEEN.update()
    
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
        
        player2.animation.start()
        
        
    }
    else if(collision(player1,ball)){
        
        ball.vel.negate()
        
        ball.vel.add(player1.vel)
        
        ball.x = -9
        
        ball.vel.rotateAround(player1.vel,- ( ( (player1.y - ball.y ) / player1.h) * 2) * 1.25)
        
        player1.animation.start()
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
/*
setInterval(() => {
        options.position.x = 0
        options.position.y = 0
		options.position.z = 0
        particleSystem.spawnParticle(options);
},100)
*/
