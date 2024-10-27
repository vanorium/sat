import { Vec2 } from "./vec2.js"

export class Polygon {
    constructor(vertices, translation, withControl) {
        this.vertices = vertices
        this.translation = translation
        this.withControl = withControl
        this.color = 'rgb(0,0,0)'
        this.deg = 0
        this.origin = new Vec2(0.5, 0.5)
        this.size =  this.#computeSidesLength()
    }

    #computeSidesLength(){
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity

        this.vertices.forEach((vertex) => {
            if(vertex.x < minX) minX = vertex.x
            if(vertex.x > maxX) maxX = vertex.x
            if(vertex.y < minY) minY = vertex.y
            if(vertex.y > maxY) maxY = vertex.y
        })
        
        return new Vec2(maxX - minX, maxY - minY)
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
