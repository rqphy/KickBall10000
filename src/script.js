import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'


/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xfffae8)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const tennisBallTexture = textureLoader.load('/textures/tennisball.jpeg')
const basketBallTexture = textureLoader.load('/textures/basket.jpeg')
const footBallTexture = textureLoader.load('/textures/football.jpeg')
const volleyBallTexture = textureLoader.load('/textures/volleyball.jpg')

/**
 * Variables
 */
let powerCursorPosition = 0
let powerCursorDirection = 'right'
let score = 0
const targets = []
const objectsToUpdate = []
const scoreInput = document.querySelector('#score')



/**
 * Mouse
 */

const mouse = new THREE.Vector2()

document.addEventListener('mousedown', (_event) => 
{

    mouse.x = ( _event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( _event.clientY / window.innerHeight ) * 2 + 1;

})

document.addEventListener('mouseup', (_event) =>
{
    const currentMouse = {
        x: ( _event.clientX / window.innerWidth ) * 2 - 1,
        y: - ( _event.clientY / window.innerHeight ) * 2 + 1
    }


    if(currentIntersect.length)
    {
        const bodyBall = objectsToUpdate.find(obj => obj.mesh.uuid === currentIntersect[0].object.uuid)
        bodyBall.body.applyLocalForce(
            new CANNON.Vec3((- currentMouse.x - mouse.x) * 2500, (- currentMouse.y - mouse.y) * 900, -1000),
            new CANNON.Vec3(0, 0, 0)
        )
            
        currentIntersect = null
        setTimeout(() =>
        {
            createSphere(
                'foot',
                {
                    x: 0,
                    y: -4,
                    z: 5,
                }
            )
        }, 1000)

        currentIntersect = raycaster.intersectObject(objectsToUpdate[objectsToUpdate.length - 1].mesh)
        
    }
})

document.addEventListener('touchstart', (_event) => 
{

    mouse.x = ( _event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( _event.touches[0].clientY / window.innerHeight ) * 2 + 1;

})

document.addEventListener('touchend', (_event) =>
{
    const currentMouse = {
        // x: 0,
        // y: 0
        x: ( _event.changedTouches[0].clientX / window.innerWidth ) * 2 - 1,
        y: - ( _event.changedTouches[0].clientY / window.innerHeight ) * 2 + 1
    }



    if(currentIntersect.length)
    {
        console.log(currentIntersect)
        const bodyBall = objectsToUpdate.find(obj => obj.mesh.uuid === currentIntersect[0].object.uuid)
        bodyBall.body.applyLocalForce(
            new CANNON.Vec3((- currentMouse.x - mouse.x) * 2500, (- currentMouse.y - mouse.y) * 900, -1000),
            new CANNON.Vec3(0, 0, 0)
        )
            
        currentIntersect = null
        setTimeout(() =>
        {
            createSphere(
                'foot',
                {
                    x: 0,
                    y: -4,
                    z: 5,
                }
            )
        }, 1000)

        currentIntersect = raycaster.intersectObject(objectsToUpdate[objectsToUpdate.length - 1].mesh)
        
    }
})



// let powerStartTime = 0

// document.addEventListener('mousedown', () =>
// {
//     if(!powerStartTime)
//     {
//         powerStartTime = Date.now()
//     }
// })


// document.addEventListener('mouseup', () =>
// {
//     const power = (Date.now() - powerStartTime) / 2
//     powerStartTime = 0

//     if(currentIntersect.length)
//     {
//         console.log(currentIntersect)
//         const bodyBall = objectsToUpdate.find(obj => obj.mesh.uuid === currentIntersect[0].object.uuid)
//         const impactCoords = currentIntersect[0].face.normal
//         console.log(impactCoords.x / 10, impactCoords.y / 10, Math.abs(impactCoords.z))
//         bodyBall.body.applyLocalForce(
//             new CANNON.Vec3(impactCoords.x > 0 ? -200: 200, power > 1000 ? 1000 : power, power > 3000 ? - 3000 : - power),
//             new CANNON.Vec3(impactCoords.x / 10, impactCoords.y / 10, Math.abs(impactCoords.z))
//         )
            
//         currentIntersect = null
//         createSphere(
//             'foot',
//             {
//                 x: 0,
//                 y: 6,
//                 z: 5,
//             }
//         )
//         currentIntersect = raycaster.intersectObject(objectsToUpdate[objectsToUpdate.length - 1].mesh)


//     }

    // for(const object of objectsToUpdate)
    // {
    //     object.body.applyLocalForce(
    //         new CANNON.Vec3(0, power > 2000 ? 2000 : power, 0),
    //         new CANNON.Vec3(0, 0, 0)
    //     )
    // }
// })



// // Mobile gesture
// document.addEventListener('touchstart', () =>
// {
//     if(!powerStartTime)
//     {
//         powerStartTime = Date.now()
//     }
// })

// document.addEventListener('touchend', () =>
// {
//     const power = Date.now() - powerStartTime
//     powerStartTime = 0

//     console.log(power);

//     for(const object of objectsToUpdate)
//     {
//         object.body.applyLocalForce(
//             new CANNON.Vec3(0, power > 2000 ? 2000 : power, 0),
//             new CANNON.Vec3(0, 0, 0)
//         )
//     }
// })

// document.addEventListener('touchmove', (_event) => 
// {
//     const mouseX = ( _event.clientX / window.innerWidth ) * 2 - 1;
//     const mouseY = - ( _event.clientY / window.innerHeight ) * 2 + 1;


//     world.gravity.set(-mouseX / 20, mouseY / 20, 0)
// })



/**
 * Utils
*/
const detectCollision = (object1, object2) =>
{
    // console.log(object1, object2)
    // console.log('toto');

    if(
        object1.position.x + object1.scale.x >= object2.position.x - object2.scale.x
        && object1.position.x - object1.scale.x <= object2.position.x + object2.scale.x
        && object1.position.y + object1.scale.y >= object2.position.y - object2.scale.y
        && object1.position.y - object1.scale.y <= object2.position.y + object2.scale.y
        && object1.position.z + object1.scale.z <= object2.position.z + object2.scale.z
    )
    {
        scene.remove(object2)
        createTarget(2, generateRandomTargetCoords())
        scoreInput.innerHTML = ++score
    }
}

const movePowerCursor = (cursor) =>
{

    if(powerCursorPosition === 200)
    {
        powerCursorDirection = 'right'
    } else if(powerCursorPosition === 0)
    {
        powerCursorDirection = 'left'
    }

    if(powerCursorDirection === 'left')
    {
        powerCursorPosition += 2
    } else
    {
        powerCursorPosition -= 2
    }
    
    cursor.style.left = `${powerCursorPosition}px`
}


// const objectsToUpdate = []

const generateRandomTargetCoords = () =>
{
    return [(Math.random() - 0.5) * 50, Math.random() * 10, -29.9]
}

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereTennisMaterial = new THREE.MeshStandardMaterial({
    map: tennisBallTexture
})
const sphereFootMaterial = new THREE.MeshStandardMaterial({
    map: footBallTexture
})
const sphereVolleyMaterial = new THREE.MeshStandardMaterial({
    map: volleyBallTexture
})
const sphereBasketMaterial = new THREE.MeshStandardMaterial({
    map: basketBallTexture
})

const createSphere = (type, position) =>
{

    // Threejs mesh

    let material = sphereTennisMaterial
    let radius = 0.2

    switch (type)
    {
        case 'basket':
            material = sphereBasketMaterial
            radius = 1
            break
        case 'foot':
            material = sphereFootMaterial
            radius = 0.7
            break
        case 'volley':
            material = sphereVolleyMaterial
            radius = 0.8
            break
    }

    const mesh = new THREE.Mesh(
        sphereGeometry,
        material
    )



    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannonjs body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in object to update
    objectsToUpdate.push({
        mesh,
        body
    })
}

// Target
const targetGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32)
const targetMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
})

const createTarget = (size, position) =>
{
    // Threejs mesh
    console.log(position);
    const [x, y, z] = position
    const scale = size || 1
    const mesh = new THREE.Mesh(
        targetGeometry,
        targetMaterial
    )
    mesh.scale.set(scale, 0.2, scale)
    mesh.rotation.x = Math.PI / 2
    mesh.position.set(x, y, z)
    scene.add(mesh)

    targets.push(mesh)
}

// Wall
const wallGeometry = new THREE.PlaneGeometry(1, 1)
const wallMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    roughness: 0.5,
    reflectivity: 0.17,
    side: THREE.DoubleSide
})


const createWall = (position, rotation, size) =>
{
    const [x, y, z] = position
    // Threejs mesh
    const mesh = new THREE.Mesh(
        wallGeometry,
        wallMaterial
    )
    mesh.receiveShadow = true
    mesh.rotation.x = rotation.x || 0
    mesh.rotation.y = rotation.y || 0
    mesh.scale.set(size.x, size.y, 1)
    mesh.position.set(x, y, z)
    scene.add(mesh)

    //Cannonjs body
    const glassDepth = 0.1
    const wallShape = new CANNON.Plane()
    const wallBody = new CANNON.Body()
    wallBody.mass = 0
    wallBody.addShape(wallShape)
    wallBody.position.set(
        x > 0 ? x - glassDepth : x + glassDepth,
        y > 0 ? y - glassDepth : y + glassDepth,
        z > 0 ? z - glassDepth : z + glassDepth
    )
    if(rotation.y)
    {
        wallBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            rotation.y
        )
    } else if(rotation.x)
    {
        wallBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            rotation.x 
        )
    }

    world.addBody(wallBody)

}



/**
 * Physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
// world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Material
const defaultMaterial = new CANNON.Material('concrete')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.4,
        restitution: 0.5
    }
)

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

/**
 * Ball
 */
createSphere(
    'foot',
    {
        x: 0,
        y: -4,
        z: 5,
    }
)

/**
 * Walls
 */

// front
createWall([0, 5, -30], {y: 0}, {x: 60, y: 20})
// floor
createWall([0, -5, 5], {x: - Math.PI * 0.5}, {x: 10, y: 10})

/**
 * Targets
 */

createTarget(2, generateRandomTargetCoords())

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight2.castShadow = true
directionalLight2.shadow.mapSize.set(1024, 1024)
directionalLight2.shadow.camera.far = 15
directionalLight2.shadow.camera.left = - 7
directionalLight2.shadow.camera.top = 7
directionalLight2.shadow.camera.right = 7
directionalLight2.shadow.camera.bottom = - 7
directionalLight2.position.set(-5, 5, 5)
scene.add(directionalLight, directionalLight2)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 20)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Frustum
 */
const frustum = new THREE.Frustum()
const cameraViewProjectionMatrix = new THREE.Matrix4()

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

let currentIntersect = null

console.log(camera.matrixWorld)
console.log(camera.matrixWorldInv)
console.log(camera.matrixWorldInverse)

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime


    // Update physic world

    // Wind
    // sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position)

    world.step(1 / 60, deltaTime, 3)
        
    // Update cursor
    movePowerCursor(document.querySelector('.cursor'))


    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)

    }

    // Cast a ray
    raycaster.setFromCamera(mouse, camera)
    currentIntersect = raycaster.intersectObject(objectsToUpdate[objectsToUpdate.length  -1].mesh)

    // Check collisions

    // console.log(objectsToUpdate[objectsToUpdate.length  - 2], targets[targets.length - 2]);

    if(objectsToUpdate[objectsToUpdate.length  - 2] && targets[targets.length - 1])
    {
        detectCollision(objectsToUpdate[objectsToUpdate.length  - 2].mesh, targets[targets.length - 1])
    }


    // Update sphere
    // sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()