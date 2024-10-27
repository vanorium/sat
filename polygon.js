import { Vec2 } from "./vec2.js"

export class Polygon {
    constructor(vertices, translation, withControl) {
        this.vertices = vertices
        this.translation = translation
        this.withControl = withControl
        this.color = 'rgb(0,0,0)'
        this.deg = 0
        this.origin = new Vec2(0.5, 0.5)
        this.computeSidesLength()
    }

    computeSidesLength(){
        const arrX = [], arrY = []

        this.vertices.forEach((vertex) => {
            arrX.push(vertex.x)
            arrY.push(vertex.y)
        })

        arrX.sort((a, b) => a-b)
        arrY.sort((a, b) => a-b)
        
        this.size = new Vec2(arrX[arrX.length-1] - arrX[0], arrY[arrY.length-1] - arrY[0])
    }

    draw(ctx) {
        const vertices = this.getTransformedVertices()
        const len = vertices.length
        for (let i = 0; i < len; i++) {
            ctx.beginPath()
            ctx.moveTo(vertices[i].x, vertices[i].y)
            ctx.lineTo(vertices[(i + 1) % len].x, vertices[(i + 1) % len].y)
            ctx.strokeStyle = this.color
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(this.translation.x, this.translation.y, 1, 0, Math.PI*2)
            ctx.stroke()
        }
    }

    addDeg(deg) {
        this.deg = (this.deg + deg) % 360
    }

    getTransformedVertices() {
        const transformedVertices = []

        this.vertices.forEach((vertex) => {
            transformedVertices.push(
                vertex.sub(this.size.scaleVec(this.origin))
                    .rotate(this.deg)
                    .add(this.translation)
            )
        })

        return transformedVertices;
    }
}
