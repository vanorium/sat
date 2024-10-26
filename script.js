const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Polygon{
    constructor(vertices, x, y, withControl){
        this.vertices = vertices
        this.x = x
        this.y = y
        this.withControl = withControl
        this.color = 'rgb(0,0,0)'
    }

    draw(){
        const v = this.getTransformedVertices()
        const len = this.vertices.length
        for(let i=0; i<len; i+=2){
            ctx.beginPath()
            ctx.moveTo(v[i], v[i+1])
            ctx.lineTo(v[(i+2)%len], v[(i+2)%len+1])
            ctx.strokeStyle = this.color
            ctx.stroke()
        }
    }

    getTransformedVertices() {
        const transformedVertices = new Array(this.vertices.length);
        for (let i = 0; i < this.vertices.length; i += 2) {
            transformedVertices[i] = this.vertices[i] + this.x;        
            transformedVertices[i + 1] = this.vertices[i + 1] + this.y; 
        }
        return transformedVertices;
    }
    
}

const getDot = (a, b) => a.x * b.x + a.y * b.y

const projectVertices = (vertices, axis) => {
    let min = Infinity
    let max = -Infinity

    for(let i=0; i<vertices.length; i+=2){
        const v = {
            x:vertices[i],
            y:vertices[i+1]
        }

        const proj = getDot(v, axis) 

        if(proj < min) min = proj
        if(proj > max) max = proj
    }

    return {min, max}
}

const intersectPolygons = (verticesA, verticesB) => {
    for(let i=0; i<verticesA.length; i+=2){
        const va = {
            x: verticesA[i],    
            y: verticesA[i+1]
        }
        const vb = {
            x: verticesA[(i+2) % verticesA.length],
            y: verticesA[(i+2) % verticesA.length + 1]
        }

        const edge = {
            x: vb.x - va.x,
            y: vb.y - va.y,
        }
        
        const axis = {
            x: edge.y,
            y: -edge.x,
        }

        const outA = projectVertices(verticesA, axis)
        const outB = projectVertices(verticesB, axis)

        if(outA.min >= outB.max || outB.min >= outA.max){
            return false
        }
    }

    for(let i=0; i<verticesB.length; i+=2){
        const va = {
            x: verticesB[i],    
            y: verticesB[i+1]
        }
        const vb = {
            x: verticesB[(i+2) % verticesB.length],
            y: verticesB[(i+2) % verticesB.length + 1]
        }

        
        const edge = {
            x: vb.x - va.x,
            y: vb.y - va.y,
        }
        
        const axis = {
            x: edge.y,
            y: -edge.x,
        }

        const outA = projectVertices(verticesA, axis)
        const outB = projectVertices(verticesB, axis)

        if(outA.min >= outB.max || outB.min >= outA.max){
            return false
        }
    }

    return true
}

const polygon1 = [
    0, 0,
    0, 32,
    32, 32
]

const polygon2 = [
    16, 0,
    0, 32,
    32, 32
]

const objects = []

objects.push(new Polygon(polygon1, 320, 320))
objects.push(new Polygon(polygon2, 320, 320, true))

let controls = {up:false, left:false, down:false, right:false}

window.addEventListener('keydown', (event) => {
    const code = event.code

    if(code == 'ArrowUp') controls.up = true
    if(code == 'ArrowLeft') controls.left = true
    if(code == 'ArrowDown') controls.down = true
    if(code == 'ArrowRight') controls.right = true

})

window.addEventListener('keyup', (event) => {
    const code = event.code

    if(code == 'ArrowUp') controls.up = false
    if(code == 'ArrowLeft') controls.left = false
    if(code == 'ArrowDown') controls.down = false
    if(code == 'ArrowRight') controls.right = false

})

const speed = 1/4

const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    
    objects.forEach((obj1) => {
        if(obj1.withControl) {
            if(controls.up) obj1.y-=speed
            if(controls.left) obj1.x-=speed
            if(controls.down) obj1.y+=speed
            if(controls.right) obj1.x+=speed
        } 

        objects.forEach((obj2) => {
            if(obj1 != obj2) {
                obj1.color = 'rgb(0,0,0)'
                obj2.color = 'rgb(0,0,0)'
                if(intersectPolygons(obj1.getTransformedVertices(), obj2.getTransformedVertices())){
                    obj1.color = 'rgb(255,0,0)'
                    obj2.color = 'rgb(255,0,0)'
                }
            }
        })

        obj1.draw()

    })

    requestAnimationFrame(loop)
}

requestAnimationFrame(loop)