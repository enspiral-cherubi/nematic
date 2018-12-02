const THREE = require('three')
const $ = require('jquery')
const OrbitControls = require('three-orbit-controls')(THREE)
const FlyControls = require('three-fly-controls')(THREE)
const WindowResize = require('three-window-resize')
const dat = require('dat.gui')

class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
    this.camera.position.z = 10
    this.camera.position.x = 0
    this.camera.position.y = 0


    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 1)

    // this.controls = new OrbitControls(this.camera)
    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.5
    this.controls.rollSpeed = 0.01
    this.keyMap = {}

    const windowResize = new WindowResize(this.renderer, this.camera)

    //params
    this.followCamera = false
    this.multiplier = 1

    this.rotateIX = false
    this.rotateIY = false
    this.rotateIZ = false
    this.rotateJX = false
    this.rotateJY = false
    this.rotateJZ = false

    this.gaze = false

    this.gui = new dat.GUI()
    var modes = this.gui.addFolder('Modes');
    modes.add(this, 'followCamera').listen();
    modes.add(this, 'multiplier').min(-5).max(5).step(1).listen();
    // modes.open();

    var rotations = this.gui.addFolder('Rotations');
    rotations.add(this, 'rotateIX').listen();
    rotations.add(this, 'rotateIY').listen();
    rotations.add(this, 'rotateIZ').listen();
    rotations.add(this, 'rotateJX').listen();
    rotations.add(this, 'rotateJY').listen();
    rotations.add(this, 'rotateJZ').listen();
    // rotations.open()

    var framings = this.gui.addFolder('Framings');
    framings.add(this, 'gaze').listen()


    // this._addCubeToScene()
    this.createFibers(200,100)

    // this.light = new THREE.PointLight( 0xFFFFFF, 1, 100 )
    // this.light.position.set(
    //   this.camera.position.x,
    //   this.camera.position.y,
    //   this.camera.position.z )
    // this.scene.add( this.light )

    // this.cyanLight = new THREE.PointLight(0x00FFFF, 1, 100)
    // this.cyanLight.position.set(100*Math.sin(Date.now()*0.001),0,0)
    // this.scene.add(this.cyanLight)
    //
    // this.magentaLight = new THREE.PointLight(0xFF00FF, 1, 100)
    // this.magentaLight.position.set(0,100*Math.sin(Date.now()*0.001),0)
    // this.scene.add(this.magentaLight)
    //
    // this.yellowLight = new THREE.PointLight(0xFFFF00, 1, 100)
    // this.yellowLight.position.set(0,0,100*Math.sin(Date.now()*0.001))
    // this.scene.add(this.yellowLight)
  }

  render () {
    this.nematize()
    this.renderer.render(this.scene, this.camera)
    // this.camera.getWorldDirection(this.cameraDirection)
    // this.light.position.set(
    //   this.camera.position.x,
    //   this.camera.position.y,
    //   this.camera.position.z )
    //
    // this.cyanLight.position.set(100*Math.sin(Date.now()*0.0001),0,0)
    // this.magentaLight.position.set(0,100*Math.sin(Date.now()*0.00008),0)
    // this.yellowLight.position.set(0,0,100*Math.sin(Date.now()*0.00012))
  }

  // 'private'

  createFibers (m,n) {
    this.m = m
    this.n = n
    this.fibers = []
    const material = new THREE.MeshNormalMaterial()
    // const material = new THREE.MeshPhongMaterial()
    // const material = new THREE.MeshToonMaterial()
    for(var i = 0; i < m; i++){
      for(var j = 0; j < n; j++){
        const geometry = new THREE.BoxGeometry(1, 1, 10)
        geometry.computeBoundingBox()
        geometry.translate(-m + 2*i,-n + 2*j,0)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.i = i
        mesh.j = j
        var box = new THREE.Box3()
        box.setFromPoints( mesh.geometry.vertices )
        box.getCenter( mesh.position )

        var pivot = new THREE.Group();
        this.scene.add( pivot )
        pivot.add(mesh)
        mesh.pivot = pivot

        this.fibers.push(mesh)



        this.scene.add(mesh)
      }
    }
  }

  nematize () {

    this.fibers.forEach((f) => {
      if(this.rotateIX){f.rotation.x += 0.0001*this.multiplier*(f.i-this.m/2)}
      if(this.rotateIY){f.rotation.y += 0.0001*this.multiplier*(f.i-this.m/2)}
      if(this.rotateIZ){f.rotation.z += 0.0001*this.multiplier*(f.i-this.m/2)}
      if(this.rotateJX){f.rotation.x += 0.0001*this.multiplier*(f.j-this.n/2)}
      if(this.rotateJY){f.rotation.y += 0.0001*this.multiplier*(f.j-this.n/2)}
      if(this.rotateJZ){f.rotation.z += 0.0001*this.multiplier*(f.j-this.n/2)}
    })

    if(this.gaze){
      this.fibers.forEach((f) => {
        f.lookAt(this.cyanLight.position)
      })
    }



    // this.fibers.forEach((f) => {
    //   f.translateX(-f.i)
    //   f.translateY(-f.j)
    //   f.lookAt(this.camera.position)
    //   f.translateX(f.i)
    //   f.translateY(f.j)
    // })

    if(this.followCamera){
      this.fibers.forEach((f) => {
        f.translateX(this.m-2*f.i)
        f.translateY(this.n-2*f.j)
        f.lookAt(this.camera.position)
        f.translateX(-this.m+2*f.i)
        f.translateY(-this.n+2*f.j)
      })
    }

  }

}

module.exports = Environment
