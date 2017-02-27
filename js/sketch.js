let renderer
let material
let bar
let camera
let stats

/// Screen size

let h = document.documentElement.clientHeight,
    w = document.documentElement.clientWidth
/// SCENE

let scene = new THREE.Scene()


function Init(){
    createScene()
    createBar()
}


function createScene(){
 
 /// CAMERA
 camera = new THREE.PerspectiveCamera(75,w / h, 0.1,1000)
 camera.position.z = 5
 /// RENDERER
 renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true})

 renderer.setSize(w,h)
 renderer.setClearColor( 0xffffff )

 document.body.appendChild(renderer.domElement)

 /// STATS
 stats = new Stats()

 document.body.appendChild( stats.dom )
 
}

function createBar(){
    
    geometry = new THREE.BoxGeometry(1,4,1)
    material = new THREE.MeshBasicMaterial({color: 0x2c3e50})
    bar = new THREE.Mesh(geometry,material)
    
    scene.add(bar)
    
}


/// LOOP
let render = function render(){
    
    
    requestAnimationFrame(render)
    renderer.render(scene,camera)
    
    stats.update()
    
}

Init()
render()
