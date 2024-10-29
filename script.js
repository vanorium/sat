import { Vec2 } from "./vec2.js"
import { getCollisionData } from "./sat.js"
import { Polygon } from "./polygon.js"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const polygon1 = [
    new Vec2(0, 0),
    new Vec2(0, 32),
    new Vec2(32, 32),
]

const polygon2 = [
    new Vec2(0, 0),
    new Vec2(0, 32),
    new Vec2(32, 32),
    new Vec2(32, 0)
]

const objects = [
    // new Polygon(polygon2, new Vec2(320, 320), false),
    new Polygon(polygon1, new Vec2(320, 320-64), false),
    new Polygon(polygon2, new Vec2(320, 320+64), true),
]

let controls = { up: false, left: false, down: false, right: false }
let rotateControls = { left: false, right: false }

window.addEventListener('keydown', (event) => {
    const code = event.code

    if (code == 'ArrowUp') controls.up = 1
    if (code == 'ArrowLeft') controls.left = 1
    if (code == 'ArrowDown') controls.down = 1
    if (code == 'ArrowRight') controls.right = 1

    if (code == 'KeyA') rotateControls.left = 1
    if (code == 'KeyD') rotateControls.right = 1
})

window.addEventListener('keyup', (event) => {
    const code = event.code

    if (code == 'ArrowUp') controls.up = 0
    if (code == 'ArrowLeft') controls.left = 0
    if (code == 'ArrowDown') controls.down = 0
    if (code == 'ArrowRight') controls.right = 0

    if (code == 'KeyA') rotateControls.left = 0
    if (code == 'KeyD') rotateControls.right = 0
})

const speed = 1

const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    objects.forEach((obj1) => {
        obj1.color = 'rgb(0,0,0)'

        if (obj1.withControl) {

            if(controls.left || controls.right || controls.up || controls.down){
                obj1.translation = obj1.translation.add(
                    new Vec2((-controls.left+controls.right) * speed, (-controls.up+controls.down) * speed)
                )
            }

            if(rotateControls.left || rotateControls.right) {
                obj1.addDeg((-rotateControls.left + rotateControls.right) * speed)
            }
        }

        objects.forEach((obj2) => {
            if (obj1 != obj2) {
                const collision = getCollisionData(obj1.getTransformedVertices(), obj2.getTransformedVertices())
                if (collision) {
                    obj1.color = 'rgb(255,0,0)'

                    if(obj1.withControl) console.log(collision.normalizedNormal, collision.depth)
                    obj1.translation = obj1.translation.sub(collision.normalizedNormal.scale(collision.depth))
                    // obj2.translation = obj2.translation.add(collision.normalizedNormal.scale(collision.depth))

                }
            }
        })
        obj1.draw(ctx)
    })

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)