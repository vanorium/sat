export const getCollisionData = (verticesA, verticesB) => {
    let separation = -Infinity

    let normalizedNormal = null
    let depth = null

    for (let i = 0; i < verticesA.length; i++) {
        const normal = verticesA[i].normal(verticesA[(i + 1) % verticesA.length])
        const magnitude = verticesA[i].magnitude(verticesA[(i + 1) % verticesA.length])

        let minSep = Infinity
        
        for (let j = 0; j < verticesB.length; j++) {
            const sep = verticesB[j].sub(verticesA[i]).dot(normal)
            minSep = Math.min(minSep, sep)
        } 
        
        if (minSep > separation) {
            separation = minSep
            normalizedNormal = normal.div(magnitude)
            depth = -separation/magnitude
        }
    }

    for (let i = 0; i < verticesB.length; i++) {
        const normal = verticesB[i].normal(verticesB[(i + 1) % verticesB.length])
        const magnitude = verticesB[i].magnitude(verticesB[(i + 1) % verticesB.length])

        let minSep = Infinity
        
        for (let j = 0; j < verticesA.length; j++) {
            const sep = verticesA[j].sub(verticesB[i]).dot(normal)
            minSep = Math.min(minSep, sep)
        }
        
        if (minSep > separation) {
            separation = minSep
            normalizedNormal = normal.div(-magnitude)
            depth = -separation/magnitude
        }
    }

    return separation <= 0 ? {normalizedNormal, depth} : false
}